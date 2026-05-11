# StoneAge Web Rebuild
![LOGO](https://upload.wikimedia.org/wikipedia/zh/e/e1/STONEAGE_ICON.GIF)

### 石器时代 Web 重构

这是一个把《石器时代》客户端、地图、NPC、宠物、战斗、账号存档逐步重构到 Web / Cloudflare Workers 的项目。

原始宠物成长率模拟器仍保留在历史代码中；当前主线目标已经升级为真正的 StoneAge Web 重构。

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

## Transfer To Another Computer

See [docs/MIGRATION.md](docs/MIGRATION.md).

```bash
npm run package:transfer
```

## More Docs

- [docs/README.md](docs/README.md)
- [README.cloudflare.md](README.cloudflare.md)
