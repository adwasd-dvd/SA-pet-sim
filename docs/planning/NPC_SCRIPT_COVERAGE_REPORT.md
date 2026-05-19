# NPC Script Coverage Report

Generated: 2026-05-19T13:43:30.937Z

This report is generated from local NPC source files and generated world data. It is the planning gate for loading more source NPC tasks without sending raw scripts to the client.

## Summary

| Metric | Value |
| --- | ---: |
| Raw NPC files scanned | 3599 |
| Generated world NPCs | 1749 |
| Generated script NPCs | 394 |
| Generated script events | 1725 |
| Parsed action kinds | 21 |
| Unsupported action candidates | 40 |

## Profile Impact

| Profile | Floors | Source files | World NPCs | Script NPCs | Script events |
| --- | ---: | ---: | ---: | ---: | ---: |
| classic-core | 93 | 641 | 681 | 114 | 589 |
| classic-rebirth | 95 | 692 | 737 | 127 | 656 |
| classic-advanced-2.0 | 95 | 692 | 737 | 127 | 656 |
| classic-advanced-2.5 | 95 | 692 | 737 | 127 | 656 |

## Parsed Runtime Actions

| Action | Full world | classic-core | rebirth | advanced-2.0 | advanced-2.5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| AddGold | 24 | 0 | 0 | 0 | 0 |
| AddItem | 45 | 6 | 6 | 6 | 6 |
| AddExps | 24 | 0 | 0 | 0 | 0 |
| Charm | 2 | 2 | 2 | 2 | 2 |
| CleanFlg | 26 | 8 | 8 | 8 | 8 |
| condition | 1724 | 589 | 656 | 656 | 656 |
| DelItem | 426 | 225 | 236 | 236 | 236 |
| DelItemEVDEL | 6 | 0 | 0 | 0 | 0 |
| DelPet | 63 | 22 | 22 | 22 | 22 |
| DelStone | 15 | 7 | 8 | 8 | 8 |
| EndSetFlg | 56 | 33 | 34 | 34 | 34 |
| GetItem | 345 | 167 | 186 | 186 | 186 |
| GetPet | 16 | 11 | 11 | 11 | 11 |
| GetRandItem | 56 | 30 | 30 | 30 | 30 |
| GetStone | 119 | 63 | 63 | 63 | 63 |
| KeyWord | 60 | 19 | 25 | 25 | 25 |
| MessagePages | 217 | 72 | 83 | 83 | 83 |
| MISSIONCLEAN | 0 | 0 | 0 | 0 | 0 |
| MISSIONOVER | 0 | 0 | 0 | 0 | 0 |
| NotDel | 6 | 0 | 0 | 0 | 0 |
| NpcWarp | 42 | 10 | 11 | 11 | 11 |
| Pet_Name | 2 | 0 | 0 | 0 | 0 |
| StopMsg | 46 | 27 | 28 | 28 | 28 |

## Top Unsupported Action Candidates

These are not automatically bugs. Some belong to later systems or config files. They are sorted by current profile impact first, then total local source frequency.

| Key | Category | classic-core refs | rebirth refs | advanced-2.5 refs | Total refs | Sample |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| skill_rate | candidate-action | 16 | 18 | 18 | 45 | external/sources/ref___data/npc/freeshop/freeshop01.arg:7 |
| CHANGEITEM | candidate-action | 15 | 15 | 15 | 147 | external/sources/ref___data/npc/eden3/process/blacksmith1.arg:10 |
| NeedItem | candidate-action | 15 | 15 | 15 | 147 | external/sources/ref___data/npc/eden3/process/blacksmith1.arg:11 |
| pet_skill | candidate-action | 15 | 15 | 15 | 35 | external/sources/ref___data/npc/freeshop/freeshop01.arg:8 |
| Born | unknown | 14 | 16 | 16 | 29 | external/sources/ref___data/npc/genout/sp_1000_94_99:2 |
| NEWEVENT1 | candidate-action | 11 | 11 | 11 | 141 | external/sources/ref___data/npc/eden1/init/event81_6f.arg:18 |
| onebattle | candidate-action | 10 | 10 | 10 | 261 | external/sources/ref___data/npc/100/sb_jba.arg:13 |
| special_pet | candidate-action | 9 | 9 | 9 | 16 | external/sources/ref___data/npc/genout/ps_1003_12_13:13 |
| routeto | unknown | 5 | 8 | 8 | 46 | external/sources/ref___data/npc/casino/petracepet1.arg:1 |
| needstone | candidate-action | 5 | 8 | 8 | 43 | external/sources/ref___data/npc/chatroom/airplane.arg:6 |
| routename1 | unknown | 5 | 8 | 8 | 43 | external/sources/ref___data/npc/chatroom/airplane.arg:3 |
| routenum | unknown | 5 | 8 | 8 | 43 | external/sources/ref___data/npc/chatroom/airplane.arg:1 |
| waittime | unknown | 5 | 8 | 8 | 43 | external/sources/ref___data/npc/chatroom/airplane.arg:5 |
| msg_denieditem | candidate-action | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:10 |
| msg_end | unknown | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:13 |
| msg_gettingon | unknown | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:7 |
| msg_notparty | unknown | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:8 |
| msg_overparty | unknown | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:9 |
| msg_start | unknown | 5 | 8 | 8 | 16 | external/sources/ref___data/npc/chatroom/airplane.arg:12 |
| denieditem | candidate-action | 5 | 8 | 8 | 15 | external/sources/ref___data/npc/chatroom/airplane.arg:4 |
| Mode1 | unknown | 5 | 5 | 5 | 10 | external/sources/ref___data/npc/race/DEADJOE:29 |
| History1 | unknown | 5 | 5 | 5 | 5 | external/sources/ref___data/npc/race2/second.arg:35 |
| luck1 | unknown | 5 | 5 | 5 | 5 | external/sources/ref___data/npc/sainasu/uranai:4 |
| err_msg | unknown | 4 | 6 | 6 | 17 | external/sources/ref___data/npc/freeshop/freeshop01.arg:6 |
| nothing_msg | unknown | 4 | 6 | 6 | 17 | external/sources/ref___data/npc/freeshop/freeshop01.arg:5 |

## Recommended Next Slice

- Start with `skill_rate`, because it appears in classic-core source references 16 times.
- Every newly ported action should go through the Worker deterministic NPC VM and add `check:npc` regression coverage.
- Keep normal client payloads compact: expose summaries and debug-tab details, not raw script bodies.

