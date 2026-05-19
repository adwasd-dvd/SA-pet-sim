# Pet Animation Coverage Report

Generated: 2026-05-19T09:06:25.753Z

## Summary

- Classic-core sprite numbers: 56
- Missing sprite index entries: 0
- Field stand/walk unique bitmap frames: 5920
- Field stand/walk frames already in current atlas: 905
- Field stand/walk missing adrn records: 0
- Battle core unique bitmap frames: 7828
- Battle core frames already in current atlas: 253
- Battle core missing adrn records: 0

## Action Groups

| Group | Actions | Animations | Unique Bitmaps | Current Atlas Frames | Missing ADRN |
| --- | --- | ---: | ---: | ---: | ---: |
| field | stand, walk | 896 | 5920 | 905 | 0 |
| fieldStand | stand | 448 | 3152 | 803 | 0 |
| fieldWalk | walk | 448 | 2816 | 102 | 0 |
| battleCore | attack, damage, dead, guard | 1792 | 7828 | 253 | 0 |
| battleExtended | attack, damage, dead, guard, throw | 1880 | 8164 | 263 | 0 |

## Important Models

| SprNo | Names | AnimSize | Stand Frames | Walk Frames | Battle Frames | Source Refs |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 100250 | 乌力, 森林乌力, 小乌乌, 禧 | 56 | 48 | 48 | 136 | 100 萨伊那斯; 100 萨伊那斯 |
| 100251 | 乌力乌力 | 56 | 48 | 48 | 136 | 2000 玛丽娜丝渔村 乌力; 2003 玛丽娜丝的宠物店 乌力乌力 |
| 100252 | 乌力斯坦, 小坦坦 | 56 | 48 | 48 | 168 | 100 萨伊那斯; 100 萨伊那斯 |
| 100256 | 布伊 | 56 | 64 | 48 | 135 | 100 萨伊那斯; 100 萨伊那斯 |
| 100257 | 布伊比 | 56 | 64 | 48 | 135 | 3103 塔姆塔姆的宠物店 布伊比; 4003 卡鲁它那的宠物店 布伊比 |
| 100261 | 加比奥 | 56 | 56 | 80 | 144 | 100 萨伊那斯 |
| 100296 | 凯比 | 56 | 96 | 48 | 136 | 1303 霍特尔的宠物店 凯比; 3303 乌鲁力的宠物店 凯比 |
| 100298 | 凯比特, 卡比特 | 56 | 96 | 48 | 136 | 100 萨伊那斯; 100 萨伊那斯 |
| 100370 | 猪雀, 奇宝, 火的守护者 | 56 | 88 | 48 | 136 | 100 萨伊那斯; 100 萨伊那斯 |
| 100388 | 黑乌力 | 56 | 72 | 48 | 152 | 1000 萨姆吉尔村 黑乌力 |

## Current Runtime Implication

- The original client animation table is parseable and complete for the classic-core pet/NPC sprites in this report.
- These bitmap frame numbers resolve through `adrn_136.bin`, but most are not in the current monolithic runtime atlas.
- The next implementation should extract `fieldStand`/`fieldWalk` into a lazy pet field pack, then switch map pets and PET STATUS portraits to those frames before adding battle action packs.

## Source Structure

- `spradrn_115.bin`: 12-byte records: `sprNo`, `offset`, `animSize`.
- `spr_115.bin`: 12-byte animation headers followed by 10-byte frame records.
- `FRAMELIST.BmpNo` resolves by bitmap number in `adrn_136.bin`; no custom art or remapping is used.

