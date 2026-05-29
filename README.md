# StoneAge Web Rebuild
![LOGO](https://upload.wikimedia.org/wikipedia/zh/e/e1/STONEAGE_ICON.GIF)

### 石器时代 Web 重构

这是一个把《石器时代》客户端、地图、NPC、宠物、战斗、账号存档逐步重构到 Web / Cloudflare Workers 的项目。

旧的独立模拟器已经从当前主线移除。宠物仍然是石器时代玩法系统的一部分，但项目不再保留独立模拟器功能。

## Current App

- `public/`: PWA frontend, generated maps, client tiles, tables, and assets.
- `src/worker.js`: Cloudflare Worker API and game runtime.
- `src/world-data.js`: generated world/NPC/warp model.
- `external/sources/`: local copy of original ref-data, client assets, gmsv, saac, and client source for transfer.
- `docs/`: migration, project memory, planning, source references, save schema.

## Local Work

```bash
npm install
npm run check:resources
npm run dev
```

部署前请按 [README.cloudflare.md](README.cloudflare.md) 的构建顺序和烟测清单检查 `floor 1000` 地图、NPC 渲染、对话打开、移动/自动前往、保存同步和 service worker cache 版本。

## Transfer To Another Computer

See [docs/MIGRATION.md](docs/MIGRATION.md).

```bash
npm run package:transfer
```

## More Docs

- [docs/README.md](docs/README.md)
- [README.cloudflare.md](README.cloudflare.md)
