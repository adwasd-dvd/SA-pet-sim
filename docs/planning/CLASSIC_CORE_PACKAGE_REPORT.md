# Classic Core Package Report

Generated at: 2026-05-14T14:09:21.946Z

Package estimates are computed from local WORLD data, the classic-core closure manifest, and current public map/client-map files. They do not invent or modify resources.

## Summary

Current public directory: 539 files, 63.53 MiB raw, 25.90 MiB gzip-estimated.

Shared assets not yet profile-filtered: 20 files, 28.42 MiB raw, 21.90 MiB gzip-estimated.

| Metric | Full-dev current | Classic-core estimate | Difference |
| --- | ---: | ---: | ---: |
| Floors | 260 | 133 | 127 |
| NPCs | 2353 | 1588 | -765 |
| Active exits | 774 | 323 | -451 |
| Profile-closed exits | 0 | 65 | 65 |
| LS2MAP raw | 14.12 MiB | 8.77 MiB | 5.36 MiB |
| Client DAT raw | 20.99 MiB | 13.15 MiB | 7.84 MiB |
| WORLD model raw | 5.11 MiB | 3.33 MiB | 1.78 MiB |
| Estimated raw package | 68.64 MiB | 53.67 MiB | 14.97 MiB (21.8%) |
| Estimated gzip package | 26.29 MiB | 24.67 MiB | 1.62 MiB (6.2%) |

## Largest Omitted Current Floors

These are full-dev generated floors not present in the current classic-core profile estimate. They should stay closed/staged unless a complete source quest line enables them.

| Floor | Name | Raw map+DAT | Gzip-estimated |
| ---: | --- | ---: | ---: |
| 300 | 吉鲁岛 | 3.43 MiB | 335.4 KiB |
| 817 | 泪之海海底 | 2.29 MiB | 438.0 KiB |
| 122 | 迷宫 | 586.0 KiB | 73.1 KiB |
| 1021 | 百人联手道场 | 572.4 KiB | 96.5 KiB |
| 3021 | 百人联手道场 | 572.4 KiB | 7.2 KiB |
| 118 | 迷宫 | 439.5 KiB | 56.0 KiB |
| 20301 | 拉多拉的回廊 | 439.5 KiB | 43.7 KiB |
| 119 | 迷宫 | 390.7 KiB | 31.0 KiB |
| 8202 | 英雄战场 10 | 343.8 KiB | 24.5 KiB |
| 8205 | 英雄战场 6 | 343.8 KiB | 19.8 KiB |
| 8207 | 英雄战场 14 | 343.8 KiB | 23.6 KiB |
| 8209 | 英雄战场 7 | 343.8 KiB | 22.9 KiB |
| 8211 | 英雄战场 2 | 343.8 KiB | 22.1 KiB |
| 8213 | 英雄战场 1 | 343.8 KiB | 22.2 KiB |
| 400 | 沙姆岛A 10 | 218.3 KiB | 32.5 KiB |
| 8219 | 白狼勇士试练洞窟 | 156.3 KiB | 8.9 KiB |
| 8220 | 追猎者试练洞窟 | 156.3 KiB | 9.8 KiB |
| 147 | 瑞尔亚斯大陆 | 131.9 KiB | 26.8 KiB |
| 3007 | 加加的竞技场 | 97.7 KiB | 5.7 KiB |
| 4007 | 卡鲁它那的竞技场 | 97.7 KiB | 5.2 KiB |

## Classic-Core Missing Assets

- None.

## Notes

- Switching the deployed build to classic-core would remove map/client-map files outside the profile, but the shared client tile atlas is still monolithic.
- Next asset-pipeline work should split UI, map tiles, pet portraits, field sprites, and battle sprites into lazy packs before moving optional packs to R2.
- Do not delete source-only floors or advanced lines; keep them staged behind profile closure until their complete quest dependencies are enabled.
