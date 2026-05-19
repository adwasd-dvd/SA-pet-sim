# Classic Core Package Report

Generated at: 2026-05-19T01:28:39.515Z

Package estimates are computed from local WORLD data, the classic-core closure manifest, and current public map/client-map files. They do not invent or modify resources.

## Summary

Current public directory: 722 files, 91.95 MiB raw, 52.66 MiB gzip-estimated.

Shared assets not yet profile-filtered: 20 files, 28.47 MiB raw, 21.94 MiB gzip-estimated.

| Metric | Full-dev current | Classic-core estimate | Difference |
| --- | ---: | ---: | ---: |
| Floors | 260 | 93 | 167 |
| NPCs | 2353 | 1138 | -1215 |
| Active exits | 774 | 164 | -610 |
| Profile-closed exits | 0 | 61 | 61 |
| LS2MAP raw | 14.12 MiB | 3.74 MiB | 10.39 MiB |
| Client DAT raw | 20.99 MiB | 5.60 MiB | 15.39 MiB |
| WORLD model raw | 5.96 MiB | 2.51 MiB | 3.45 MiB |
| Estimated raw package | 69.54 MiB | 40.31 MiB | 29.23 MiB (42.0%) |
| Estimated gzip package | 26.44 MiB | 23.33 MiB | 3.11 MiB (11.7%) |

## Largest Omitted Current Floors

These are full-dev generated floors not present in the current classic-core profile estimate. They should stay closed/staged unless a complete source quest line enables them.

| Floor | Name | Raw map+DAT | Gzip-estimated |
| ---: | --- | ---: | ---: |
| 200 | 加鲁卡 | 9.16 MiB | 1.06 MiB |
| 300 | 吉鲁岛 | 3.43 MiB | 335.4 KiB |
| 817 | 泪之海海底 | 2.29 MiB | 438.0 KiB |
| 122 | 迷宫 | 586.0 KiB | 73.1 KiB |
| 1021 | 百人联手道场 | 572.4 KiB | 96.5 KiB |
| 3021 | 百人联手道场 | 572.4 KiB | 7.2 KiB |
| 118 | 迷宫 | 439.5 KiB | 56.0 KiB |
| 20301 | 拉多拉的回廊 | 439.5 KiB | 43.7 KiB |
| 119 | 迷宫 | 390.7 KiB | 31.0 KiB |
| 8200 | 英雄战场 8 | 343.8 KiB | 21.2 KiB |
| 8201 | 英雄战场 14 | 343.8 KiB | 22.5 KiB |
| 8202 | 英雄战场 10 | 343.8 KiB | 24.5 KiB |
| 8203 | 英雄战场 12 | 343.8 KiB | 22.1 KiB |
| 8204 | 英雄战场 11 | 343.8 KiB | 22.0 KiB |
| 8205 | 英雄战场 6 | 343.8 KiB | 19.8 KiB |
| 8206 | 英雄战场 4 | 343.8 KiB | 22.5 KiB |
| 8207 | 英雄战场 14 | 343.8 KiB | 23.6 KiB |
| 8208 | 英雄战场 8 | 343.8 KiB | 22.1 KiB |
| 8209 | 英雄战场 7 | 343.8 KiB | 22.9 KiB |
| 8210 | 英雄战场 1 | 343.8 KiB | 22.4 KiB |

## Classic-Core Missing Assets

- None.

## Notes

- Switching the deployed build to classic-core would remove map/client-map files outside the profile, but the shared client tile atlas is still monolithic.
- Next asset-pipeline work should split UI, map tiles, pet portraits, field sprites, and battle sprites into lazy packs before moving optional packs to R2.
- Do not delete source-only floors or advanced lines; keep them staged behind profile closure until their complete quest dependencies are enabled.
