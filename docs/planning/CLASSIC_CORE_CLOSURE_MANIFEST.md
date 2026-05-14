# Classic Core Closure Manifest

Generated: 2026-05-14T01:49:43.289Z

This manifest is the first machine-readable dependency closure draft for original-resource content profiles. It does not prune runtime assets yet.

## Profile Summary

| Profile | Lines | Floors | Source-Only Floors | NPCs | Items | Enemy TempNos | Pet Frames | Closed Warps | Map Bytes | Client Map Bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| classic-core | 9 | 131 | 152 | 1560 | 819 | 70 | 68 | 52 | 9137704 | 13711558 |
| classic-advanced-2.0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| classic-advanced-2.5 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Line Summary

| Line | Profile | Stage | Floors | Source-Only | NPCs | Items | Enemies | Status | Warnings |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Classic Village Start | classic-core | boot | 51 | 8 | 545 | 607 | 33 | needs-closure-work | 8 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| Village Shops, Heal, Save, Equipment | classic-core | boot | 94 | 48 | 398 | 738 | 62 | needs-closure-work | 48 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| First Pet Capture And Training Loop | classic-core | boot | 29 | 17 | 118 | 0 | 66 | needs-closure-work | 17 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| 成人仪式 | classic-core | core | 0 | 0 | 0 | 0 | 0 | needs-closure-work | No local floor was pulled into this line yet; use script/NPC evidence before enabling. |
| 琉璃洞窟 | classic-core | rebirth-proof | 0 | 16 | 0 | 0 | 0 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable. |
| 玄黄洞窟 | classic-core | rebirth-proof | 0 | 15 | 0 | 0 | 0 | needs-closure-work | 15 source map floors are not in current generated WORLD and must be added before this line is playable. |
| 碧青洞窟 | classic-core | rebirth-proof | 0 | 19 | 0 | 0 | 0 | needs-closure-work | 19 source map floors are not in current generated WORLD and must be added before this line is playable. |
| 深红洞窟 | classic-core | rebirth-proof | 0 | 16 | 0 | 0 | 0 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable. |
| 漆黑洞窟 / 人物转生 | classic-core | rebirth | 4 | 22 | 0 | 0 | 17 | needs-closure-work | 22 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| 2.0 英雄岛 / 红暴 / 四圣石 / 金虎 | classic-advanced-2.0 | advanced | 0 | 0 | 0 | 0 | 2 | needs-closure-work | No local floor was pulled into this line yet; use script/NPC evidence before enabling.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| 2.5 玛蕾菲雅 / 精灵王线 | classic-advanced-2.5 | advanced | 0 | 0 | 0 | 0 | 3 | needs-closure-work | No local floor was pulled into this line yet; use script/NPC evidence before enabling.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |

## Important Notes

- `sourceOnlyFloors` means local original LS2MAP data exists, but the current generated Worker `WORLD` does not include the floor yet.
- `closedWarps` are not bugs by themselves. They are the list of exits that need source-style close/hide behavior if a smaller profile ships without the target map.
- Rebirth remains gated until the four proof cave lines and dark cave line have no missing generated floors and have battle/NPC rewards validated.
- This draft intentionally avoids new art, renamed content, shortened cave chains, and arbitrary map caps.
