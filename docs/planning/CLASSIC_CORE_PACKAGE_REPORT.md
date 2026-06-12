# Classic Core Package Report

Generated at: 2026-06-12T09:25:03.002Z

Package estimates are computed from local WORLD data, the classic-core closure manifest, and current public map/client-map files. They do not invent or modify resources.

## Summary

Current public directory: 935 files, 94.66 MiB raw, 52.82 MiB gzip-estimated.

Shared assets not yet profile-filtered: 20 files, 25.61 MiB raw, 19.10 MiB gzip-estimated.

| Metric | Full-dev current | Classic-core estimate | Difference |
| --- | ---: | ---: | ---: |
| Floors | 308 | 107 | 201 |
| NPCs | 1749 | 701 | -1048 |
| Active exits | 1016 | 210 | -806 |
| Profile-closed exits | 0 | 56 | 56 |
| LS2MAP raw | 15.32 MiB | 3.86 MiB | 11.47 MiB |
| Client DAT raw | 22.67 MiB | 5.66 MiB | 17.01 MiB |
| WORLD model raw | 7.63 MiB | 2.85 MiB | 4.78 MiB |
| Estimated raw package | 71.22 MiB | 37.97 MiB | 33.25 MiB (46.7%) |
| Estimated gzip package | 24.23 MiB | 20.56 MiB | 3.67 MiB (15.2%) |

## Largest Omitted Current Floors

These are full-dev generated floors not present in the current classic-core profile estimate. They should stay closed/staged unless a complete source quest line enables them.

| Floor | Name | Raw map+DAT | Gzip-estimated |
| ---: | --- | ---: | ---: |
| 200 | 加鲁卡 | 9.16 MiB | 1.06 MiB |
| 300 | 吉鲁岛 | 3.43 MiB | 335.4 KiB |
| 817 | 泪之海海底 | 2.29 MiB | 438.0 KiB |
| 700 | 伊甸园区 | 1.53 MiB | 242.5 KiB |
| 122 | 迷宫 | 586.0 KiB | 73.1 KiB |
| 1021 | 百人联手道场 | 572.4 KiB | 96.5 KiB |
| 3021 | 百人联手道场 | 572.4 KiB | 7.2 KiB |
| 118 | 迷宫 | 439.5 KiB | 56.0 KiB |
| 20301 | 拉多拉的回廊 | 439.5 KiB | 43.7 KiB |
| 119 | 迷宫 | 390.7 KiB | 31.0 KiB |
| 7000 | 伊甸园0 | 390.7 KiB | 74.0 KiB |
| 8200 | 英雄战场 8 | 343.8 KiB | 21.2 KiB |
| 8201 | 英雄战场 14 | 343.8 KiB | 22.5 KiB |
| 8202 | 英雄战场 10 | 343.8 KiB | 24.5 KiB |
| 8203 | 英雄战场 12 | 343.8 KiB | 22.1 KiB |
| 8204 | 英雄战场 11 | 343.8 KiB | 22.0 KiB |
| 8205 | 英雄战场 6 | 343.8 KiB | 19.8 KiB |
| 8206 | 英雄战场 4 | 343.8 KiB | 22.5 KiB |
| 8207 | 英雄战场 14 | 343.8 KiB | 23.6 KiB |
| 8208 | 英雄战场 8 | 343.8 KiB | 22.1 KiB |

## Classic-Core Missing Assets

- floor 10301 柯奥的洞窟１楼 100: missing DAT
- floor 10302 柯奥的洞窟２楼 1000: missing DAT
- floor 10303 柯奥的洞窟３楼 1000: missing DAT
- floor 10304 柯奥的洞窟４楼 1000: missing DAT
- floor 10305 柯奥的洞窟５楼 100: missing DAT
- floor 10306 柯奥的洞窟６楼 100: missing DAT
- floor 10307 柯奥的洞窟７楼 100: missing DAT
- floor 10308 柯奥的洞窟８楼 1000: missing DAT

## Notes

- Switching the deployed build to classic-core would remove map/client-map files outside the profile, but the shared client tile atlas is still monolithic.
- Next asset-pipeline work should split UI, map tiles, pet portraits, field sprites, and battle sprites into lazy packs before moving optional packs to R2.
- Do not delete source-only floors or advanced lines; keep them staged behind profile closure until their complete quest dependencies are enabled.
