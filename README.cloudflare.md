# Cloudflare 版本

这个目录是可以直接部署到 Cloudflare Workers 的网页应用。当前主线是 `石器时代 Web 重构`，旧的独立模拟器和 Go 服务已经移除：

- `public/`：静态前端、PWA manifest、service worker、游戏数据和素材。
- `src/worker.js`：Worker API，承载网页游戏的创建人物、同步、移动、NPC 对话、商店、遇敌、捕获、训练和 AI 向导入口。
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

## API

- `POST /api/game/new`：创建网页游戏人物和初始状态。
- `POST /api/game/sync`：同步/规范化当前游戏存档。
- `POST /api/game/walk`：按地图坐标移动并触发出口/遇敌。
- `POST /api/game/dialog`：和当前地图 NPC 对话。
- `POST /api/game/buy`：从可交易 NPC 购买道具。
- `POST /api/game/encounter`、`/api/game/capture`、`/api/game/train`：当前网页游戏的遇敌、捕获和训练流程。
- `POST /api/data/search`：搜索从 `ref___data` 同步来的宠物、地图、NPC、道具、遇敌资料。
- `POST /api/ai/guide`：用当前地图、NPC、任务、背包、宠物和日志生成游戏内向导建议。
