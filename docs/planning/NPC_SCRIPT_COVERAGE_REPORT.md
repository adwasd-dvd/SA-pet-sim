# NPC Script Coverage Report

Generated: 2026-06-12T05:56:09.628Z

This report is generated from local NPC source files and generated world data. It is the planning gate for loading more source NPC tasks without sending raw scripts to the client.

## Summary

| Metric | Value |
| --- | ---: |
| Raw NPC files scanned | 3599 |
| Generated world NPCs | 1749 |
| Generated script NPCs | 394 |
| Generated script events | 1725 |
| Parsed action kinds | 25 |
| Unsupported/unknown raw keys | 22 |
| Candidate action keys | 5 |
| Unknown raw keys | 17 |

## Profile Impact

| Profile | Floors | Source files | World NPCs | Script NPCs | Script events |
| --- | ---: | ---: | ---: | ---: | ---: |
| classic-core | 99 | 656 | 701 | 117 | 604 |
| classic-rebirth | 103 | 726 | 772 | 135 | 703 |
| classic-advanced-2.0 | 103 | 726 | 772 | 135 | 703 |
| classic-advanced-2.5 | 103 | 726 | 772 | 135 | 703 |

## Parsed Runtime Actions

| Action | Full world | classic-core | rebirth | advanced-2.0 | advanced-2.5 |
| --- | ---: | ---: | ---: | ---: | ---: |
| AddGold | 24 | 0 | 0 | 0 | 0 |
| AddItem | 45 | 6 | 6 | 6 | 6 |
| AddExps | 24 | 0 | 0 | 0 | 0 |
| Charm | 2 | 2 | 2 | 2 | 2 |
| CleanFlg | 26 | 8 | 8 | 8 | 8 |
| condition | 1724 | 604 | 703 | 703 | 703 |
| DelItem | 426 | 229 | 243 | 243 | 243 |
| DelItemEVDEL | 6 | 0 | 0 | 0 | 0 |
| DelPet | 64 | 22 | 22 | 22 | 22 |
| NewDelPet | 1 | 0 | 0 | 0 | 0 |
| DelStone | 15 | 7 | 8 | 8 | 8 |
| EndSetFlg | 56 | 34 | 37 | 37 | 37 |
| GetItem | 345 | 171 | 194 | 194 | 194 |
| AddPet | 49 | 0 | 0 | 0 | 0 |
| GetPet | 65 | 11 | 11 | 11 | 11 |
| GetRandItem | 56 | 30 | 30 | 30 | 30 |
| GetStone | 119 | 63 | 63 | 63 | 63 |
| KeyWord | 60 | 20 | 26 | 26 | 26 |
| MessagePages | 217 | 72 | 88 | 88 | 88 |
| MISSIONCLEAN | 0 | 0 | 0 | 0 | 0 |
| MISSIONOVER | 0 | 0 | 0 | 0 | 0 |
| NotDel | 6 | 0 | 0 | 0 | 0 |
| NowSetFlg | 51 | 0 | 0 | 0 | 0 |
| NpcWarp | 57 | 14 | 15 | 15 | 15 |
| NpcPoint | 15 | 4 | 4 | 4 | 4 |
| Pet_Name | 2 | 0 | 0 | 0 | 0 |
| SetLastTalkelder | 0 | 0 | 0 | 0 | 0 |
| StopMsg | 46 | 28 | 30 | 30 | 30 |

## Top Unsupported Action Candidates

These are not automatically bugs. Some belong to later systems or config files. They are sorted by current profile impact first, then total local source frequency.

| Key | Category | classic-core refs | rebirth refs | advanced-2.5 refs | Total refs | Sample |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| TENSEI | unknown | 0 | 0 | 0 | 11 | external/sources/ref___data/npc/777/ten.arg:17 |
| B_evnow | unknown | 0 | 0 | 0 | 3 | external/sources/ref___data/npc/eden2/kraken/ev88_07.arg:14 |
| showstopx | unknown | 0 | 0 | 0 | 3 | external/sources/ref___data/npc/casino/petracepet1.arg:2 |
| showstopy | unknown | 0 | 0 | 0 | 3 | external/sources/ref___data/npc/casino/petracepet1.arg:3 |
| CHANGEBBI | candidate-action | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/eden3/karo/etar:14 |
| jaja | unknown | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/777/ten.arg:3 |
| karutarna | unknown | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/777/ten.arg:4 |
| marinasu | unknown | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/777/ten.arg:2 |
| PETTRANS | candidate-action | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/777/ten.arg:7 |
| pickupitem | candidate-action | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/chatroom/airplane4.arg:6 |
| samugiru | unknown | 0 | 0 | 0 | 2 | external/sources/ref___data/npc/777/ten.arg:1 |
| B_evend | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/eden2/kraken/ev88_05.arg:14 |
| elItem | candidate-action | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/giiru/event/ev28_23:19 |
| EvebtNo | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/giiru/event/garunaev6:37 |
| GraNo | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/eden3/karo/chara:5 |
| loop_tme | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/roulette/roulette01.arg:5 |
| NEWTIME | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/eden3/karo/chara:4 |
| nowev | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/my/ruieryasi/goldpet0.arg:13 |
| ord | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/demale/core:707 |
| run_time | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/roulette/roulette01.arg:4 |
| seflg | candidate-action | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/giiru/banam.arg:13 |
| TimeXYPoint | unknown | 0 | 0 | 0 | 1 | external/sources/ref___data/npc/eden3/karo/chara:6 |

## Recommended Next Slice

- No unsupported action candidate currently hits classic-core source references; keep porting the highest rebirth or 2.5 candidates only after the core quest spine is playable.
- Every newly ported action should go through the Worker deterministic NPC VM and add `check:npc` regression coverage.
- Keep normal client payloads compact: expose summaries and debug-tab details, not raw script bodies.

