# Classic Core Closure Manifest

Generated: 2026-05-14T04:28:54.334Z

This manifest is the first machine-readable dependency closure draft for original-resource content profiles. It does not prune runtime assets yet.

## Profile Summary

| Profile | Lines | Floors | Source-Only Floors | NPCs | Items | Enemy TempNos | Pet Frames | Closed Warps | Map Bytes | Client Map Bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| classic-core | 9 | 133 | 151 | 1588 | 819 | 76 | 74 | 53 | 9190993 | 13791374 |
| classic-advanced-2.0 | 1 | 5 | 0 | 118 | 5 | 1 | 1 | 19 | 160220 | 240040 |
| classic-advanced-2.5 | 1 | 1 | 0 | 78 | 51 | 1 | 1 | 12 | 90044 | 135008 |

## Line Summary

| Line | Profile | Stage | Floors | Source-Only | NPCs | Items | Enemies | Status | Warnings |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Classic Village Start | classic-core | boot | 53 | 8 | 547 | 607 | 36 | needs-closure-work | 8 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| Village Shops, Heal, Save, Equipment | classic-core | boot | 98 | 48 | 402 | 738 | 62 | needs-closure-work | 48 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| First Pet Capture And Training Loop | classic-core | boot | 31 | 17 | 120 | 0 | 66 | needs-closure-work | 17 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| 成人仪式 | classic-core | core | 6 | 0 | 7 | 0 | 4 | needs-closure-work | NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 琉璃洞窟 | classic-core | rebirth-proof | 2 | 16 | 2 | 0 | 29 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 玄黄洞窟 | classic-core | rebirth-proof | 1 | 15 | 1 | 0 | 30 | needs-closure-work | 15 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 碧青洞窟 | classic-core | rebirth-proof | 2 | 19 | 2 | 0 | 29 | needs-closure-work | 19 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 深红洞窟 | classic-core | rebirth-proof | 0 | 16 | 0 | 0 | 0 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 漆黑洞窟 / 人物转生 | classic-core | rebirth | 0 | 21 | 0 | 0 | 1 | needs-closure-work | 21 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.0 英雄岛 / 红暴 / 四圣石 / 金虎 | classic-advanced-2.0 | advanced | 5 | 0 | 5 | 0 | 3 | needs-closure-work | Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.5 玛蕾菲雅 / 精灵王线 | classic-advanced-2.5 | advanced | 1 | 0 | 2 | 0 | 4 | needs-closure-work | Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |

## Important Notes

- `sourceOnlyFloors` means local original LS2MAP data exists, but the current generated Worker `WORLD` does not include the floor yet.
- `closedWarps` are not bugs by themselves. They are the list of exits that need source-style close/hide behavior if a smaller profile ships without the target map.
- Rebirth remains gated until the four proof cave lines and dark cave line have no missing generated floors and have battle/NPC rewards validated.
- This draft intentionally avoids new art, renamed content, shortened cave chains, and arbitrary map caps.
