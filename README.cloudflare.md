# Cloudflare 版本

这个目录是可以直接部署到 Cloudflare Workers 的网页应用。当前主线是 `石器时代 Web 重构`，旧的独立模拟器和 Go 服务已经移除：

- `public/`：静态前端、PWA manifest、service worker、游戏数据和素材。
- `src/worker.js`：Worker API，承载网页游戏的创建人物、同步、移动、NPC 对话、商店、训练、存档和 AI 向导入口。
- `wrangler.jsonc`：Cloudflare Workers 静态资产和 Workers AI 绑定配置。
- `external/sources/`：本地迁移用的原始数据/源码副本，不提交到 git，但会被迁移打包脚本包含。

## 本地运行

```bash
npm install
npm run check:resources
npm run dev
```

打开 Wrangler 输出的本地地址即可测试。

## 部署

```bash
npm run deploy
```

如果要启用 Cloudflare Workers AI，确保账号已开通 Workers AI。`wrangler.jsonc` 已经配置 `AI` binding；也可以在 Cloudflare 环境变量里设置 `AI_MODEL` 覆盖默认模型。

如果要让游戏 NPC/向导使用 OpenAI 模型，把 API key 作为 Worker secret 配置，不能放进前端或提交到 git：

```bash
npx wrangler secret put OPENAI_API_KEY
```

可选设置普通环境变量 `OPENAI_MODEL` 覆盖默认 `gpt-5.4-mini`。有 `OPENAI_API_KEY` 时，Worker 会优先用 OpenAI Responses API 生成结构化 NPC/向导回复；没有 key 时继续回退到 Workers AI 或本地规则。AI 只能提出对话和 action proposal，交易、传送、折扣、赠品、flag、避敌和战斗仍由 `src/worker.js` 里的确定性 NPC VM 校验执行。

## API

- `POST /api/game/new`：创建网页游戏人物和初始状态。
- `POST /api/game/sync`：同步/规范化当前游戏存档。
- `POST /api/game/walk`：按地图坐标移动并触发出口；自动遇敌/抓宠 UI 当前已关闭。
- `POST /api/game/dialog`：和当前地图 NPC 对话。
- `POST /api/game/buy`：从可交易 NPC 购买道具。
- `POST /api/game/encounter`、`/api/game/capture`：保留的后端实验接口，当前主 UI 不暴露自动遇敌/抓宠。
- `POST /api/game/train`：旧调试训练入口，现拒绝直接升级；人物和宠物成长必须来自战斗经验或 AI 代练触发的战斗结算。
- `POST /api/data/search`：搜索从 `gmsv-data` 同步来的宠物、地图、NPC、道具、遇敌资料。
- `POST /api/ai/guide`：用当前地图、NPC、任务、背包、宠物和日志生成游戏内向导建议。
- `POST /api/ai/workspace`：返回 AI 可用的压缩 workspace，包括当前场景、动作边界、石器时代资料库条目和随存档保存的 AI memory。
- `POST /api/ai/workspace-note`：写入受 Worker 校验的 AI memory note；只允许记录观察/线索/偏好/TODO，不允许直接改背包、任务、flag、石币、传送或战斗结果。
- `GET /api/ai/status`：返回当前 AI 运行时，区分 OpenAI、Workers AI 和本地规则回退。
