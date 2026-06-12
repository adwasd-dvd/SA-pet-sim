# Classic Core Closure Manifest

Generated: 2026-06-12T09:24:58.858Z

This manifest is the first machine-readable dependency closure draft for original-resource content profiles. It does not prune runtime assets yet.

## Profile Summary

| Profile | Lines | Floors | Source-Only Floors | NPCs | Items | Enemy TempNos | Pet Frames | Closed Warps | Map Bytes | Client Map Bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| classic-core | 4 | 107 | 0 | 665 | 763 | 39 | 39 | 49 | 4042708 | 5937792 |
| classic-rebirth | 9 | 111 | 87 | 732 | 763 | 68 | 66 | 57 | 7924884 | 11760824 |
| classic-advanced-2.0 | 10 | 111 | 87 | 732 | 763 | 68 | 66 | 57 | 7924884 | 11760824 |
| classic-advanced-2.5 | 11 | 111 | 87 | 732 | 763 | 68 | 66 | 57 | 7924884 | 11760824 |
| classic-lite-remix | 4 | 107 | 0 | 665 | 763 | 39 | 39 | 49 | 4042708 | 5937792 |

## Line Summary

| Line | Profile | Stage | Floors | Source-Only | NPCs | Source Tasks | Items | Enemies | Status | Warnings |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Classic Village Start | classic-core | boot | 43 | 0 | 257 | 7 | 836 | 34 | playable-source-script-draft |  |
| Village Shops, Heal, Save, Equipment | classic-core | boot | 87 | 0 | 227 | 2 | 808 | 33 | playable-source-script-draft |  |
| First Pet Capture And Training Loop | classic-core | boot | 20 | 0 | 84 | 0 | 0 | 60 | closure-draft |  |
| 成人仪式 | classic-core | core | 1 | 0 | 2 | 1 | 3 | 4 | playable-source-script-draft |  |
| 琉璃洞窟 | classic-rebirth | rebirth-proof | 2 | 16 | 2 | 1 | 2 | 29 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 玄黄洞窟 | classic-rebirth | rebirth-proof | 1 | 15 | 1 | 1 | 0 | 30 | needs-closure-work | 15 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 碧青洞窟 | classic-rebirth | rebirth-proof | 2 | 19 | 2 | 1 | 0 | 29 | needs-closure-work | 19 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 深红洞窟 | classic-rebirth | rebirth-proof | 2 | 16 | 2 | 0 | 2 | 0 | needs-closure-work | 16 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 漆黑洞窟 / 人物转生 | classic-rebirth | rebirth | 0 | 21 | 0 | 0 | 0 | 1 | needs-closure-work | 21 source map floors are not in current generated WORLD and must be added before this line is playable.<br>NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.0 英雄岛 / 红暴 / 四圣石 / 金虎 | classic-advanced-2.0 | advanced | 1 | 0 | 1 | 0 | 2 | 2 | needs-closure-work | NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |
| 2.5 玛蕾菲雅 / 精灵王线 | classic-advanced-2.5 | advanced | 1 | 0 | 2 | 1 | 5 | 4 | needs-closure-work | NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable. |

## Important Notes

- `sourceOnlyFloors` means local original LS2MAP data exists, but the current generated Worker `WORLD` does not include the floor yet.
- `sourceTaskClusters` are parsed `EventNo`/`TYPE` changeevent groups with their source required/reward items. They are used to keep task resources in profile closure instead of trusting text matches alone.
- Route evidence uses original map exits and generated NPC warp scripts. `script-playable-needs-entry` means the local NPC script task cluster looks runnable, but no verified mapwarp/NPC-warp route from core start maps is known yet.
- `closedWarps` are not bugs by themselves. They are the list of exits that need source-style close/hide behavior if a smaller profile ships without the target map.
- Rebirth remains gated until the four proof cave lines and dark cave line have no missing generated floors and have battle/NPC rewards validated.
- This draft intentionally avoids new art, renamed content, shortened cave chains, and arbitrary map caps.
