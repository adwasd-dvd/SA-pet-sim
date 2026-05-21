# NPC Script Coverage Report

Generated: 2026-05-21T17:47:45.113Z

This report is generated from local NPC source files and generated world data. It is the planning gate for loading more source NPC tasks without sending raw scripts to the client.

## Summary

| Metric | Value |
| --- | ---: |
| Raw NPC files scanned | 3599 |
| Generated world NPCs | 1749 |
| Generated script NPCs | 394 |
| Generated script events | 1725 |
| Parsed action kinds | 24 |
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
| AddPet | 49 | 0 | 0 | 0 | 0 |
| GetPet | 65 | 11 | 11 | 11 | 11 |
| GetRandItem | 56 | 30 | 30 | 30 | 30 |
| GetStone | 119 | 63 | 63 | 63 | 63 |
| KeyWord | 60 | 19 | 25 | 25 | 25 |
| MessagePages | 217 | 72 | 83 | 83 | 83 |
| MISSIONCLEAN | 0 | 0 | 0 | 0 | 0 |
| MISSIONOVER | 0 | 0 | 0 | 0 | 0 |
| NotDel | 6 | 0 | 0 | 0 | 0 |
| NowSetFlg | 51 | 0 | 0 | 0 | 0 |
| NpcWarp | 57 | 14 | 15 | 15 | 15 |
| NpcPoint | 15 | 4 | 4 | 4 | 4 |
| Pet_Name | 2 | 0 | 0 | 0 | 0 |
| StopMsg | 46 | 27 | 28 | 28 | 28 |

## Top Unsupported Action Candidates

These are not automatically bugs. Some belong to later systems or config files. They are sorted by current profile impact first, then total local source frequency.

| Key | Category | classic-core refs | rebirth refs | advanced-2.5 refs | Total refs | Sample |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| item | candidate-action | 0 | 0 | 0 | 20 | external/sources/ref___data/npc/100/sb_mimi.arg:5 |
| TENSEI | unknown | 0 | 0 | 0 | 11 | external/sources/ref___data/npc/777/ten.arg:17 |
| challengewait | unknown | 0 | 0 | 0 | 10 | external/sources/ref___data/npc/family/manorsman.arg1:4 |
| loop | unknown | 0 | 0 | 0 | 10 | external/sources/ref___data/npc/family/manorsman.arg1:2 |
| manorid | unknown | 0 | 0 | 0 | 10 | external/sources/ref___data/npc/family/manorsman.arg1:3 |
| peacewait | unknown | 0 | 0 | 0 | 10 | external/sources/ref___data/npc/family/manorsman.arg1:5 |
| OTHER | unknown | 0 | 0 | 0 | 9 | external/sources/ref___data/npc/pettalk/pettalk01.arg:5 |
| angry | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:9 |
| attack | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:3 |
| damage | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:4 |
| down | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:5 |
| guard | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:11 |
| hand | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:7 |
| msgcol | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:1 |
| nod | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:12 |
| pleasure | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:8 |
| sad | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:10 |
| sit | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:6 |
| throw | unknown | 0 | 0 | 0 | 8 | external/sources/ref___data/npc/genout/act_31603_20_22:13 |
| GAMBLE_TYPE | unknown | 0 | 0 | 0 | 6 | external/sources/ref___data/npc/bank/bankman01.arg:3 |
| challengetimeout | unknown | 0 | 0 | 0 | 5 | external/sources/ref___data/npc/family/scheduleman.arg1:3 |
| fightinterval | unknown | 0 | 0 | 0 | 5 | external/sources/ref___data/npc/family/scheduleman.arg1:5 |
| loopinterval | unknown | 0 | 0 | 0 | 5 | external/sources/ref___data/npc/family/scheduleman.arg1:2 |
| page_num11 | unknown | 0 | 0 | 0 | 5 | external/sources/ref___data/npc/roulette/master01.arg:15 |
| settingtimeout | unknown | 0 | 0 | 0 | 5 | external/sources/ref___data/npc/family/scheduleman.arg1:4 |

## Recommended Next Slice

- No unsupported action candidate currently hits classic-core source references; keep porting the highest rebirth or 2.5 candidates only after the core quest spine is playable.
- Every newly ported action should go through the Worker deterministic NPC VM and add `check:npc` regression coverage.
- Keep normal client payloads compact: expose summaries and debug-tab details, not raw script bodies.

