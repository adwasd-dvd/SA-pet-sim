# Cloud Runtime Strategy

本文记录当前目标、Cloudflare 适配结论、推荐架构和近期开发顺序。更细的 Worker-native `gmsv/saac` 移植路线见 `docs/planning/WORKER_NATIVE_GMSV_PORT.md`。

## Goal

目标不是只做一个离线网页模拟器，而是把原来的三段式网游形态逐步迁移到云端：

- `gmsv`: 游戏世界服务器，负责地图、移动、NPC、任务、商店、战斗、宠物、玩家互动。
- `saac`: 人物账号服务器，负责账号、角色槽、存档、锁、银行、邮件、家族等持久化语义。
- 本地客户端: 玩家实际操作的画面、输入、协议收发和资源渲染。

新的方向是：

- 浏览器先行，让玩家可以直接在云端网页运行。
- 服务端逐步补齐 `gmsv` 和 `saac` 的核心能力。
- 以后仍然保留做独立客户端的可能，最好复用同一套云端 API/WebSocket 协议。
- AI NPC 只能增强表达和解释，不能绕过游戏规则。交易、任务、打折、给物品等行为必须由确定性的游戏服务执行。

## Current Project State

当前仓库已经完成了第一层 Web 重构：

- `src/worker.js`: Cloudflare Worker API，已经承载新建人物、同步存档、移动、对话、购买、遇敌、捕获、训练和 AI 向导入口。
- `public/assets/app.js`: 浏览器 PWA 客户端，已经有一屏式客户端、地图画布、WASD、NPC 列表/点击、对话浮层、宠物/背包/任务/日志/存档/资料库/AI 面板。
- `src/world-data.js`: 由 `scripts/build-world.mjs` 生成的地图、NPC、出口、遇敌资料。
- `external/sources/gmsv`: 原游戏服务器源码参考。
- `external/sources/saac-source` 和 `external/sources/saac-data`: 原账号/人物服务器源码和数据参考。
- `docs/planning/SAVE_SCHEMA.md`: 已经定义浏览器 JSON 存档，映射到 SAAC 的 `charname|option|charinfo` 思路。

还没有完成的关键能力：

- 云端账号和多角色持久化。
- 多人实时会话、同地图玩家同步和聊天。
- 完整 NPC 脚本解释器。
- 完整战斗、物品、宠物、交易、任务链。
- 原客户端 TCP 协议兼容层。

## Cloudflare Fit

结论：Cloudflare 可以撑住当前 Web 原生路线的大部分需求，但不能把原版 `gmsv/saac` 当作普通长期 TCP 进程直接跑在 Worker 里。新的优先方向是 Worker-native 行为移植：把 `gmsv/saac` 当成规格，逐步用 Worker、Durable Objects、D1 和 R2 实现兼容语义。

适合放在 Cloudflare 的部分：

- 静态网页客户端和资源：Workers Static Assets，必要时大资源转 R2。
- 轻量 API：Workers。
- 游戏房间、地图实例、玩家会话、WebSocket 协调：Durable Objects。
- 账号/角色/存档索引：D1，或者每账号/每角色 Durable Object 加 D1 快照。
- 高频读、低一致性要求的配置缓存：KV。
- AI NPC/向导：Workers AI 或外部模型，经由 Worker 统一加规则和上下文。
- 原始服务器或工具链的容器化实验：Cloudflare Containers，或者独立 VPS/裸机，主要用于对照和兼容验证。

不适合只靠普通 Worker 的部分：

- 原版 `gmsv` 和 `saac` 作为常驻 C TCP 服务器直接运行。
- 原本地客户端直接连入 Worker 的自定义 TCP 协议。
- 大量 CPU 常驻循环、复杂战斗批处理、长时间脚本跑在单次请求内。

官方限制和设计点：

- Workers 有 128 MB isolate 内存、启动 1 秒、Worker 包大小限制；付费计划 HTTP 请求 CPU 默认 30 秒，可配置到 5 分钟。参考：<https://developers.cloudflare.com/workers/platform/limits/>
- Workers HTTP 请求没有硬性 wall-time 上限，但客户端断开后任务会取消，`waitUntil()` 只适合短延续。参考：<https://developers.cloudflare.com/workers/platform/limits/>
- Durable Objects 单个对象适合做有状态协调，SQLite-backed DO 单对象存储上限 10 GB，单对象有软性的约 1000 requests/s 指引。参考：<https://developers.cloudflare.com/durable-objects/platform/limits/>
- Durable Objects WebSocket Hibernation 单对象最多 32768 WebSocket 连接，但实际容量还受 CPU/内存/业务消息频率影响。参考：<https://developers.cloudflare.com/durable-objects/api/state/>
- D1 单个数据库 10 GB，单个 D1 数据库串行处理查询，适合拆成多个小数据库或把热状态放 DO。参考：<https://developers.cloudflare.com/d1/reference/faq/>
- KV 是最终一致，跨地区可见性可能延迟 60 秒或更久，不适合作为强一致人物存档唯一写入点。参考：<https://developers.cloudflare.com/kv/concepts/how-kv-works/>
- Workers 目前支持出站 TCP，不支持把 Worker 作为入站 TCP 服务。参考：<https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/>
- Containers 可以跑 Linux-like 应用和现有镜像，适合保留原服实验；但它仍要通过 Worker/DO 编排。参考：<https://developers.cloudflare.com/containers/>

## Recommended Architecture

先走 Worker-native Web 原生重建，不先追求原 TCP 客户端兼容。

```text
Browser PWA / future native client
        |
        | HTTPS + WebSocket JSON/binary protocol
        v
Cloudflare Worker API gateway
        |
        +-- Durable Object: account/session lock
        +-- Durable Object: map room / battle room / party room
        +-- D1: account, character, inventory, pets, quest snapshots
        +-- R2/Static Assets: maps, sprites, extracted data, client assets
        +-- Workers AI / AI Gateway: grounded NPC wording and guide replies
```

组件映射：

- `gmsv` 不是一次性移植成一个大服务，而是拆成 `game-runtime` 模块：
  - map service
  - movement/warp service
  - NPC script runtime
  - shop/item service
  - battle/encounter service
  - party/trade/chat service
- `saac` 拆成 `persistence` 模块：
  - account service
  - character slots
  - save snapshots
  - per-character lock/session token
  - import/export compatibility debug string
- `mysqlclient`、`pthread`、`epoll`、Lua/LuaJIT 的替代不是一对一库替换，而是：
  - MySQL -> D1/DO 持久化和锁。
  - pthread/epoll/mainloop -> Worker fetch、DO RPC、WebSocket、alarm。
  - LuaJIT -> 先做确定性 NPC action VM，后续再评估 sandboxed Lua/WASM。
  - SAAC socket -> 内部 service facade。
- 原客户端行为拆成 `client-render` 和 `protocol`：
  - 浏览器先实现地图、UI、输入和资源渲染。
  - 后续独立客户端可以复用同一套 HTTPS/WebSocket 协议。
  - 原 TCP 客户端兼容作为后置路线，通过 VPS/Spectrum/Container gateway 做桥接。

## AI NPC Rules

AI NPC 的边界必须写死：

- AI 负责“说话方式、解释、引导、总结”，不直接修改游戏状态。
- 所有改状态动作都通过 deterministic action executor：
  - `explainQuest`
  - `openShop`
  - `quotePrice`
  - `offerDiscount`
  - `buyItem`
  - `giveReward`
  - `warpPlayer`
  - `startBattle`
- AI 可以提出 action proposal，但服务器必须检查：
  - NPC 类型是否允许该动作。
  - 玩家是否满足任务、等级、金钱、背包、宠物、事件 flag 条件。
  - 折扣是否在 NPC/声望/任务允许范围内。
  - 奖励是否来自脚本或配置，不可凭空生成。
- AI 回复必须带上下文：
  - 当前地图、NPC id/type/source、玩家位置、任务 flags、背包、宠物、商店清单、最近日志。
- 如果资料缺失，AI 应该说明“不确定”，再给玩家可验证的下一步。

## Phased Development

### Phase 0: Stabilize Current Web Client

目标：让当前单人网页客户端成为稳定开发基线。

- 跑通 `check:resources` 和 `wrangler deploy --dry-run`。
- 保证 1000/2000 地图可进入，NPC 可见，WASD 移动、出口、对话、购买、遇敌不会崩。
- 建立最小浏览器 smoke test 清单。

### Phase 1: Source-Grounded NPC And Shops

目标：先把 NPC 行为从“示意回复”提升到“按原数据/脚本响应”。

- 扩展 `scripts/build-world.mjs`，提取更多 NPC arg/config。
- 建 `npc-runtime` 模块，支持 `TimeMan`、`ItemShop`、`WarpMan`、`SavePoint`、`Healer`、`WindowMan` 的最小解释。
- 所有未支持脚本输出结构化 debug，不静默失败。

### Phase 2: SAAC-Like Cloud Save

目标：从本地 localStorage 走向云端账号。

- D1 schema：accounts、characters、save_snapshots、inventory、pets、quest_flags。
- 会话锁：每账号或每角色 Durable Object，防止多窗口同时覆盖。
- 保留 JSON 导入导出和 SAAC debug string。

### Phase 3: Real-Time Multiplayer Core

目标：恢复“这是网游”的核心感觉。

- Durable Object map room：同一地图玩家位置、入场、离场、聊天、附近广播。
- Worker WebSocket gateway：浏览器客户端连接房间。
- 客户端渲染其他玩家、聊天泡泡和基础互动。
- 地图房间只保存热状态，定期/关键动作写入持久化。

### Phase 4: Battle, Trade, Party

目标：补回主要 RPG 循环。

- 遇敌进入 battle room。
- 攻击、技能、捕获、逃跑、结算。
- 玩家交易、组队、队伍聊天。

### Phase 5: AI NPC Layer

目标：让 NPC 会说更多话，但不破坏规则。

- 先做 AI guide context builder。
- 再做 NPC AI reply adapter。
- 最后做 action proposal + deterministic executor。
- 建 AI 成本和频率限制：缓存常见解释，限制每 NPC/每玩家请求频率。

### Phase 6: Compatibility And Hosting Options

目标：决定是否支持旧客户端或原服。

- 方案 A：继续 Web 原生，未来写新客户端。
- 方案 B：原 `gmsv/saac` 跑在 VPS/裸机，Cloudflare 只做网站、账号面板、AI 服务、反向代理。
- 方案 C：Cloudflare Containers 跑原服实验，Worker 提供管理/API/WebSocket 网关。
- 方案 D：原 TCP 客户端兼容，通过 Spectrum 或自建网关；这条路线后置，因为会牵涉协议、加密、运维和计划限制。

## Immediate Backlog

下一轮开发建议按这个顺序：

1. `cloud-001`: 固化云端运行策略和组件边界。
2. `npc-002`: 让 NPC 对话浮层基于原脚本路径和默认 `hi` 流程更完整。
3. `script-001`: 做 NPC 脚本解释器的最小可扩展框架。
4. `shop-001`: 商店窗口从雏形变成真实库存和背包容量。
5. `ops-001`: 增加 deploy/smoke checklist。
6. `persistence-002`: 设计 D1/DO 云端存档 schema。
7. `realtime-001`: 设计并实现第一版 map room WebSocket。
8. `ai-002`: 给 NPC AI 增加 action proposal 和 deterministic guardrails。
