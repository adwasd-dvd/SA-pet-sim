# NPC Script Coverage Report

Generated: 2026-05-20T15:49:29.262Z

This report is generated from local NPC source files and generated world data. It is the planning gate for loading more source NPC tasks without sending raw scripts to the client.

## Summary

| Metric | Value |
| --- | ---: |
| Raw NPC files scanned | 3599 |
| Generated world NPCs | 1749 |
| Generated script NPCs | 394 |
| Generated script events | 1725 |
| Parsed action kinds | 22 |
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
| NpcWarp | 57 | 14 | 15 | 15 | 15 |
| NpcPoint | 15 | 4 | 4 | 4 | 4 |
| Pet_Name | 2 | 0 | 0 | 0 | 0 |
| StopMsg | 46 | 27 | 28 | 28 | 28 |

## Top Unsupported Action Candidates

These are not automatically bugs. Some belong to later systems or config files. They are sorted by current profile impact first, then total local source frequency.

| Key | Category | classic-core refs | rebirth refs | advanced-2.5 refs | Total refs | Sample |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| ADDEGGID | unknown | 2 | 2 | 2 | 2 | external/sources/ref___data/npc/sa50/petfusion/petfusion.arg:4 |
| trans | unknown | 1 | 3 | 3 | 6 | external/sources/ref___data/npc/sa70/hunsk2:9 |
| REPLACEMENT | unknown | 1 | 1 | 1 | 3 | external/sources/ref___data/npc/sa50/dodo/dodopupk1-8.arg:4 |
| selectmsg | unknown | 1 | 1 | 1 | 3 | external/sources/ref___data/npc/777/ten.arg:9 |
| CHECK_MSG | unknown | 1 | 1 | 1 | 1 | external/sources/ref___data/npc/demale/testnpc01.arg:2 |
| msg | unknown | 1 | 1 | 1 | 1 | external/sources/ref___data/npc/genout/ss_1100_86_107:9 |
| gym | unknown | 0 | 0 | 0 | 346 | external/sources/ref___data/npc/doujyou/jyajyadou001.arg:6 |
| enemypetno | candidate-action | 0 | 0 | 0 | 325 | external/sources/ref___data/npc/doujyou/jyajyadou001.arg:9 |
| PET | candidate-action | 0 | 0 | 0 | 246 | external/sources/ref___data/npc/pettalk/pettalk01.arg:10 |
| EVENTRUN2 | candidate-action | 0 | 0 | 0 | 138 | external/sources/ref___data/npc/pettalk/pettalk01.arg:93 |
| herobattlefield | candidate-action | 0 | 0 | 0 | 133 | external/sources/ref___data/npc/heroic/DEADJOE:18 |
| Floor | candidate-action | 0 | 0 | 0 | 131 | external/sources/ref___data/npc/genout/wpm_1012_14_13:2 |
| sktype | unknown | 0 | 0 | 0 | 125 | external/sources/ref___data/npc/heroic/DEADJOE:13 |
| LimitLevel | candidate-action | 0 | 0 | 0 | 68 | external/sources/ref___data/npc/pettalk/pettalk01.arg:96 |
| mainmsg | unknown | 0 | 0 | 0 | 48 | external/sources/ref___data/npc/777/ten.arg:8 |
| BOTH1 | unknown | 0 | 0 | 0 | 32 | external/sources/ref___data/npc/pettalk/pettalk01.arg:282 |
| EntryItem | candidate-action | 0 | 0 | 0 | 31 | external/sources/ref___data/npc/genout/jan_802_29_19:2 |
| WAVE | unknown | 0 | 0 | 0 | 30 | external/sources/ref___data/npc/eden1/animal01.arg:2 |
| MenuStr | unknown | 0 | 0 | 0 | 27 | external/sources/ref___data/npc/eden3/transfer.arg:6 |
| WARPPOINT | candidate-action | 0 | 0 | 0 | 27 | external/sources/ref___data/npc/eden3/transfer.arg:9 |
| LeavepkMsg | unknown | 0 | 0 | 0 | 26 | external/sources/ref___data/npc/family/fmpoint10/wpm_7530_51_51:6 |
| gamble_msg01 | unknown | 0 | 0 | 0 | 25 | external/sources/ref___data/npc/bank/bankman01.arg:5 |
| CHECKPARTY | unknown | 0 | 0 | 0 | 24 | external/sources/ref___data/npc/eden1/saveking/saveking4:14 |
| Event_Now | candidate-action | 0 | 0 | 0 | 24 | external/sources/ref___data/npc/eden2/kraken/kraken88_06:26 |
| PETTEMPNO | candidate-action | 0 | 0 | 0 | 24 | external/sources/ref___data/npc/pettalk/pettalk.mem:1 |

## Recommended Next Slice

- Start with `ADDEGGID`, because it appears in classic-core source references 2 times.
- Every newly ported action should go through the Worker deterministic NPC VM and add `check:npc` regression coverage.
- Keep normal client payloads compact: expose summaries and debug-tab details, not raw script bodies.

