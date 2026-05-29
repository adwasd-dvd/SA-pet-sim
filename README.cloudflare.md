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

## 构建、检查和部署顺序

平时只改 Worker、前端或文档时，先跑完整检查，再部署：

```bash
npm run check
npm run deploy
```

改过 `external/sources/`、`gmsv-data`、`ref___data`、NPC、地图、道具、宠物或遇敌源数据时，先重新生成世界数据，再检查：

```bash
npm run build:world
npm run check:resources
npm run check
```

改过 classic-core 白名单、资源裁剪 profile 或纹理包计划时，先刷新 profile 产物，再检查：

```bash
npm run build:world:classic-core
npm run profile:assets:classic-core
npm run check:resources
npm run check
```

本地 shell 找不到全局 `wrangler` 时，用项目依赖运行 Cloudflare CLI：

```bash
npx wrangler deploy
```

`npm run deploy` 和 `npm run dev` 默认使用 `node_modules/.bin/wrangler`。不要把外部源码、密钥或临时导出目录提交到 git。

## 部署前烟测

部署前至少覆盖下面的轻量流程，避免资源、路由、PWA cache 或 NPC VM 回归：

- 打开 `npm run dev` 输出的本地地址，创建或同步角色，确认初始区域或可达路径上的 `floor 1000` 地图正常显示。
- 检查地图真实贴图、地图外黑底、对象遮挡和 NPC 精灵渲染，不应出现缺图占位纹理或异常黑屏。
- 用 WASD 或方向键移动，确认正常移动、撞墙转向、出口/warp、遇敌条件和日志反馈正常。
- 双击 NPC 打开对话，确认原版风格窗口出现，`对话` 不泄露完整脚本，交易/治疗/存档/战斗类状态变化仍由 Worker deterministic NPC VM 校验。
- 试一次自动前往或任务路线按钮，确认能走到目标，失败时给出明确阻塞原因。
- 如果改过 `public/assets/app.js`、`public/sw.js`、PWA manifest、静态数据或 cache 名称，部署后强制刷新页面，并确认 service worker cache 没有继续使用旧 bundle。
- 保存/同步后刷新页面，确认当前位置、背包、宠物、任务、存档点和战斗状态没有丢失。

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
