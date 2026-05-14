# Classic Core Closure Manifest

Generated: 2026-05-14T15:33:34.102Z

This manifest is the first machine-readable dependency closure draft for original-resource content profiles. It does not prune runtime assets yet.

## Profile Summary

| Profile | Lines | Floors | Source-Only Floors | NPCs | Items | Enemy TempNos | Pet Frames | Closed Warps | Map Bytes | Client Map Bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| classic-core | 9 | 134 | 151 | 1590 | 819 | 76 | 74 | 51 | 9200637 | 13805782 |
| classic-advanced-2.0 | 1 | 5 | 0 | 118 | 5 | 1 | 1 | 19 | 160220 | 240040 |
| classic-advanced-2.5 | 1 | 1 | 0 | 78 | 51 | 1 | 1 | 12 | 90044 | 135008 |

## Line Summary

| Line | Profile | Stage | Floors | Source-Only | NPCs | Source Tasks | Items | Enemies | Status | Warnings |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Classic Village Start | classic-core | boot | 53 | 8 | 547 | 8 | 843 | 36 | needs-closure-work | 8 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| Village Shops, Heal, Save, Equipment | classic-core | boot | 98 | 48 | 402 | 0 | 752 | 62 | needs-closure-work | 48 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| First Pet Capture And Training Loop | classic-core | boot | 31 | 17 | 120 | 2 | 3 | 66 | needs-closure-work | 17 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas. |
| 成人仪式 | classic-core | core | 1 | 0 | 2 | 1 | 3 | 4 | playable-source-script-draft |  |
| 琉璃洞窟 | classic-core | rebirth-proof | 2 | 16 | 2 | 1 | 2 | 29 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 玄黄洞窟 | classic-core | rebirth-proof | 1 | 15 | 1 | 1 | 0 | 30 | needs-closure-work | 15 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 碧青洞窟 | classic-core | rebirth-proof | 2 | 19 | 2 | 1 | 0 | 29 | needs-closure-work | 19 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 深红洞窟 | classic-core | rebirth-proof | 0 | 16 | 0 | 0 | 0 | 0 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 漆黑洞窟 / 人物转生 | classic-core | rebirth | 0 | 21 | 0 | 0 | 0 | 1 | needs-closure-work | 21 source map floors are not in current generated WORLD and must be added before this line is playable.<br>Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.0 英雄岛 / 红暴 / 四圣石 / 金虎 | classic-advanced-2.0 | advanced | 5 | 0 | 5 | 0 | 2 | 3 | needs-closure-work | Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.5 玛蕾菲雅 / 精灵王线 | classic-advanced-2.5 | advanced | 1 | 0 | 2 | 1 | 5 | 4 | needs-closure-work | Some enemy/pet bitmap ids are not in the current client tile atlas.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |

## Important Notes

- `sourceOnlyFloors` means local original LS2MAP data exists, but the current generated Worker `WORLD` does not include the floor yet.
- `sourceTaskClusters` are parsed `EventNo`/`TYPE` changeevent groups with their source required/reward items. They are used to keep task resources in profile closure instead of trusting text matches alone.
- Route evidence uses original map exits and generated NPC warp scripts. `script-playable-needs-entry` means the local NPC script task cluster looks runnable, but no verified mapwarp/NPC-warp route from core start maps is known yet.
- `closedWarps` are not bugs by themselves. They are the list of exits that need source-style close/hide behavior if a smaller profile ships without the target map.
- Rebirth remains gated until the four proof cave lines and dark cave line have no missing generated floors and have battle/NPC rewards validated.
- This draft intentionally avoids new art, renamed content, shortened cave chains, and arbitrary map caps.
