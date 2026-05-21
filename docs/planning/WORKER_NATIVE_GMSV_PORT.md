# Worker-Native GMSV/SAAC Port Plan

本文记录新的优先方向：尽量让游戏核心跑在 Cloudflare Workers / Durable Objects / D1 上，而不是先依赖 VPS 跑原版 `gmsv` 和 `saac`。

## Decision

可以继续把目标定为“云端 Worker 原生运行”，尤其在预期玩家数量不大的情况下。关键限制是：这不是把 `mysqlclient`、`pthread`、`LuaJIT` 换几个库就能编译过，而是把原服的行为模型拆成 Worker 事件模型。

换句话说：

- 原版 C daemon 不直接进普通 Worker。
- `gmsv` 和 `saac` 作为行为规格和数据来源。
- Worker/DO/D1 实现兼容的账号、存档、NPC、地图、战斗、交易语义。
- 只有必要时才用 Containers 或 VPS 做对照实验。

## Dependency Replacement Map

| Original piece | Worker-native replacement | Notes |
| --- | --- | --- |
| `mysqlclient` in `saac` | D1 tables plus Durable Object locks; optional JSON snapshots | 账号、角色槽、人物存档、物品、宠物、任务 flag 都改成 D1/DO 语义。 |
| `pthread`, `epoll`, `select`, infinite loops | Fetch handlers, Durable Object RPC, WebSocket hibernation, alarms | 不做全世界常驻 tick。玩家移动、对话、战斗指令触发计算；房间只在有人时热运行。 |
| Raw TCP client protocol | Browser HTTPS/WebSocket command protocol | 旧 TCP 客户端兼容后置，通过 gateway/Container/VPS 再考虑。 |
| `gmsv` global arrays/process memory | Generated read-only world data plus per-map/per-battle/per-character DO state | 静态数据来自 ref-data/gmsv/client assets；热状态按地图房间、战斗房间、角色拆分。 |
| SAAC socket protocol | Internal service calls/RPC facade | 先做 `AccountService` / `CharacterService`，模拟 `load/save/lock` 语义，不保留 socket。 |
| Lua/LuaJIT hooks | Declarative NPC action VM first; optional sandboxed Lua/WASM later | NPC 行为先支持常见 `TimeMan`、shop、warp、healer、savepoint。真的 Lua 脚本后续再评估 WASM Lua，不使用 JIT。 |
| Server-side file reads | Build-time extraction into `src/world-data.js`, R2, D1 seed data | Worker 包不能塞完整 2.6GB 客户端资源；大资源走 R2/CDN 懒加载。 |

## Feasibility Notes

### MySQL Client

`mysqlclient` 这一块最容易换，但不是保留 C 库。推荐路径是直接把 `saac` 的语义搬到 Cloudflare：

- `accounts`: 账号、密码哈希、封禁/锁状态。
- `characters`: 每账号角色槽。
- `character_snapshots`: 存档快照和 schema version。
- `inventory_items` / `pets` / `quest_flags`: 可查询结构化数据。
- `CharacterSessionDO`: 防止同一角色多窗口同时覆盖存档。

如果将来一定要保留 MySQL，也可以让 Worker 通过 Hyperdrive 连接外部 MySQL。但是原 `saac` 里有 `set names 'gbk'` 和老式 SQL 行为；Hyperdrive/MySQL 路线可能会碰到编码和兼容限制。因此第一阶段不建议把 MySQL 当核心依赖。

### Pthread / Epoll / Main Loop

这部分不能“换库”，必须换模型。原 `gmsv` 做的是：

- 监听 TCP 端口。
- `epoll` 接受连接和收包。
- 多个 `pthread` 扫连接缓冲。
- `while(1)` 里跑网络、NPC、战斗、角色、家族、存档检查。

Worker-native 版本应该变成：

- 浏览器通过 HTTPS/WebSocket 发命令。
- `MapRoomDO` 处理同地图移动、聊天、附近广播。
- `BattleRoomDO` 处理一场战斗的回合状态。
- `CharacterSessionDO` 处理角色锁和保存。
- 定时类行为用 DO alarm 或 Cron 触发，不做全局常驻循环。

小规模玩家时，这个模型反而更适合：没有玩家的地图不会消耗常驻 CPU。

### LuaJIT

`LuaJIT` 不适合直接放进 Worker：

- JIT 依赖运行时生成机器码，不符合 Worker 的安全模型。
- Workers 支持 WebAssembly，但每个 Worker 是单线程；Web Worker/threading 不可用。
- WASI 也不是完整 Linux 系统调用环境，不能假设文件系统、socket、进程都存在。

可行路径是两层：

1. 先做 `NPC Action VM`，把常见 NPC 行为变成白名单动作：`say`、`window`、`shop`、`warp`、`heal`、`save`、`give`、`take`、`setFlag`、`startBattle`。
2. 如果之后发现大量剧情必须跑 Lua，再引入 Lua interpreter 的 WASM/JS 版本，但只能调用白名单动作，不能访问任意文件、网络或数据库。

### Original TCP Protocol

普通 Worker 不能作为原版 `gmsv` 那样的入站 TCP 服务器。浏览器端也更适合 WebSocket。因此第一阶段协议应该是新的 JSON/binary command protocol。旧客户端兼容放到后面，用 gateway、Cloudflare Containers、Cloudflare Tunnel/Spectrum 或 VPS 再评估。

## Practical Verdict

可以尽量让它全部云端跑，但要用下面这个定义：

- **可以**：游戏逻辑、账号存档、地图房间、NPC、商店、战斗、AI NPC，都跑在 Worker/DO/D1/R2 组合里。
- **不建议**：把原 `gmsvjt` / `saacjt` 进程或 C 源码直接编译成普通 Worker。
- **后置实验**：Lua/WASM 兼容、旧 TCP 客户端兼容、Containers 跑原服。

这条路线比“先跑原服”慢一点恢复完整性，但长期更干净，也更接近用户想要的纯云端网页游戏。

## Why This Can Work For This Project

这个游戏不会按原版高并发运营，目标更像小规模云端复活和持续开发。因此 Worker-native 路线可以成立：

- 没必要让所有 NPC、地图、怪物全天候循环。
- 多数游戏动作是玩家触发：移动、对话、买卖、战斗回合、存档。
- Durable Object 可以天然表达“一个地图房间”“一场战斗”“一个角色锁”。
- D1/DO 足够先承载账号和角色存档，只要不把所有玩家塞进一个全局对象。
- AI NPC 可以挂在 Worker 侧，但动作执行仍然走确定性规则。

## Risk Boundary

需要避免的误区：

- 不要试图把 `gmsv/mainloop` 原样搬到 Worker。
- 不要把 `pthread` 翻译成 JavaScript worker thread；Cloudflare 的隔离模型不是传统进程。
- 不要让 AI 直接改人物、背包、宠物或任务状态。
- 不要把 KV 当强一致存档数据库。
- 不要把旧客户端 TCP 兼容放在第一阶段，否则会把开发锁进网络协议兼容，而不是游戏行为恢复。

## Porting Order

### 1. SAAC Facade

先实现 Worker-native 的 SAAC 等价层：

- account create/login placeholder
- character slots
- character load/save
- per-character session lock
- save snapshot versioning
- JSON import/export remains compatible with `saac-pwa-v1`

### 2. GMSV Command Facade

把浏览器动作整理成服务端命令：

- `enterMap`
- `move`
- `talkToNpc`
- `openShop`
- `buyItem`
- `startEncounter`
- `battleAction`
- `saveCharacter`

每个命令必须对应 `gmsv` 源码或 ref-data 的来源说明。

协议边界见 `docs/planning/WORKER_NATIVE_COMMAND_PROTOCOL.md`。该文档列出当前所有 `/api/game/*`、`/api/ai/*` 和同地图 WebSocket 命令，并由 `npm run check:protocol` 防止 Worker 新增接口时忘记同步 gmsv/saac 兼容说明。

### 3. NPC Action VM

先不追完整 LuaJIT。先做小型确定性 action VM：

- condition: flag/item/pet/level/map/time
- action: say/window/shop/warp/heal/save/give/take/setFlag/startBattle
- unsupported action: structured debug event

这样能最快恢复剧情、商店、任务，而不是停在“能聊天但不懂规则”。

### 4. Durable Object Rooms

按热点拆对象：

- `CharacterSessionDO`: 角色锁、短期人物状态、保存节流。
- `MapRoomDO`: 同地图玩家、附近广播、聊天、移动同步。
- `BattleRoomDO`: 回合状态、战斗结算。
- `PartyTradeDO`: 组队、交易、临时确认状态。

### 5. Optional Lua Compatibility

等常见 NPC 行为跑起来后，再评估 Lua：

- 如果脚本主要是数据化模板，继续扩 action VM。
- 如果确实有大量 Lua 脚本，尝试 sandboxed Lua interpreter compiled to WASM。
- Lua 只能调用白名单 game actions，不能读写任意 Worker/D1 状态。

## First Proof

第一阶段验证不追求完整游戏，只证明路线正确：

1. D1/DO 保存一个账号和一个角色。
2. 两个浏览器标签页进入同一地图并看到彼此移动。
3. 点击真实 NPC，服务端根据 ref-data/gmsv 映射返回窗口或对白。
4. 一个商店 NPC 能打开真实商品列表，购买后扣石币、加物品、保存。
5. 重新加载后角色位置、背包、石币保留。

做到这五点，就可以说 `gmsv/saac` 的核心语义开始在 Worker-native 云端跑起来了。
