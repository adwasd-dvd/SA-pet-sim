# Cloudflare 版本

这个目录保留原 Go 版本，同时新增了可以直接部署到 Cloudflare Workers 的网页应用：

- `public/`：静态前端、PWA manifest、service worker、游戏数据和素材。
- `src/worker.js`：Worker API，移植了原来的宠物生成和升级算法。
- `wrangler.jsonc`：Cloudflare Workers 静态资产和 Workers AI 绑定配置。

## 本地运行

```bash
npm install
npm run dev
```

打开 Wrangler 输出的本地地址即可测试。

## 部署

```bash
npm run deploy
```

如果要启用 Cloudflare Workers AI，确保账号已开通 Workers AI。`wrangler.jsonc` 已经配置 `AI` binding；也可以在 Cloudflare 环境变量里设置 `AI_MODEL` 覆盖默认模型。

## API

- `POST /api/getpet`：`{ "no": 0 }` 随机捕获，或传宠物编号原地遇敌。
- `POST /api/levelup`：`{ "pet": {}, "up": 10 }` 无状态升级，适合边缘运行。
- `POST /api/data/search`：搜索从 `ref___data` 同步来的宠物、地图、NPC、道具、遇敌资料。
- `POST /api/ai/analyze`：用 Workers AI 分析当前宠物；未启用 AI binding 时使用本地规则分析。
