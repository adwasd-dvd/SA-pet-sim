# GMSV/SAAC Worker Port Map

This document maps the original `gmsv`/`saac` entry points to Worker-native services. It is the concrete checklist for rebuilding server behavior without running the old C daemons inside a Worker.

## Source Entry Points

Primary source files:

- `external/sources/gmsv/include/lssproto_serv.h`: old client protocol receive/send surface.
- `external/sources/gmsv/lssproto_serv.c`: protocol dispatcher from packet id to `lssproto_*_recv`.
- `external/sources/gmsv/callfromcli.c`: game server handlers for client commands.
- `external/sources/gmsv/callfromac.c`: game server callbacks from SAAC.
- `external/sources/gmsv/include/saacproto_cli.h`: GMSV -> SAAC protocol surface.
- `external/sources/saac-source/char.c`: account character load/list/save/delete behavior.
- `external/sources/gmsv/char/char_talk.c`: player chat and NPC talk dispatch.
- `external/sources/gmsv/char/encount.c`: encounter area parsing and probability behavior.
- `external/sources/gmsv/npc/*.c`: NPC-specific talked/window behavior.

Current Worker entry:

- `src/worker.js`: browser API, first-pass game runtime, local save model, NPC dialogue, shops, encounters, battle, item use, AI guide.

## Worker-Native Services

| Service | Responsibility | Cloudflare target |
| --- | --- | --- |
| `AccountService` | Account id/password/session, ban/lock placeholders, character list entry | Worker + D1 |
| `CharacterService` | Character slots, create/delete, save snapshot, import/export schema | Worker + D1 |
| `CharacterSessionDO` | Per-character lock, active save state, idempotency, save throttling | Durable Object |
| `MapRoomDO` | Players in one map, movement broadcast, local chat, join/leave | Durable Object WebSocket |
| `NpcActionVM` | Source-grounded NPC talked/window actions | Worker module, later shared with DO |
| `ShopService` | Real shop item list, buy/sell validation, inventory capacity | Worker module |
| `EncounterService` | Encounter area, step chance, enemy selection | Worker module |
| `BattleRoomDO` | Battle turn state, commands, rewards, escape/capture | Durable Object |
| `AssetService` | Static maps, tile atlas, generated world data, large asset plan | Static Assets/R2 |
| `AiNpcService` | Grounded speech/action proposals only | Worker + Workers AI/external AI |

## Account And Character Flow

| Original path | Meaning | Worker-native target | Status |
| --- | --- | --- | --- |
| `lssproto_ClientLogin_recv` -> `saacproto_ACCharLogin_send` -> `saacproto_ACCharLogin_recv` | Authenticate account before character list | `AccountService.login(accountId, password, clientInfo)` | Next |
| `lssproto_CharList_recv` -> `saacproto_ACCharList_send` -> `ACCharList_recv` | Fetch character slots | `CharacterService.listSlots(accountId)` | Next |
| `lssproto_CreateNewChar_recv` | Create a new character in a slot | `CharacterService.createCharacter(accountId, slot, characterDraft)` | First-pass `/api/game/new` exists, cloud slot persistence next |
| `lssproto_CharLogin_recv` -> `saacproto_ACCharLoad_send` -> `ACCharLoad_recv` -> `CHAR_login` | Load character and lock it for play | `CharacterSessionDO.loadAndLock(characterId, sessionId)` | Next |
| `lssproto_CharLogout_recv` / `closeAllConnectionandSaveData` -> `saacproto_ACCharSave_send` | Save character and optionally unlock | `CharacterSessionDO.saveSnapshot({ unlock })` | Next |
| `lssproto_CharDelete_recv` -> `saacproto_ACCharDelete_send` | Delete character slot | `CharacterService.deleteCharacter(accountId, slot, confirm)` | Later |
| `saacproto_ACLock_send` / `ACLock_recv` | Account lock/unlock | `CharacterSessionDO` lease plus D1 lock audit | Next |
| `ACCharSavePoolItem/Pet`, `ACCharGetPoolItem/Pet` | Depot/pool item and pet storage | Bank/depot service | Later |
| `mail.c`, `acfamily.c` callbacks | Mail, family, social persistence | Mail/family services | Later |

## Game Command Flow

| Original protocol/function | Meaning | Worker command/API | Target service | Status |
| --- | --- | --- | --- | --- |
| `W_recv`, `W2_recv` | Move character on map | `move { mapId, x, y, dx, dy, dir }` / current `/api/game/walk` | `MapRoomDO` + movement validation | First-pass implemented |
| `XYD_send`, `C_send`, `CA_send`, `CD_send` | Send position/character appearance updates | `room.playerMoved`, `room.playerJoined`, `room.playerLeft` events | `MapRoomDO` WebSocket | Next |
| `M_recv`, `M_send`, `MC_send` | Request map chunk/data | Static map asset fetch, optional chunk endpoint | `AssetService` | First-pass static/generated |
| `TK_recv` -> `CHAR_Talk` -> NPC `talkedfunc` | Player chat and default `P|hi` NPC talk | `talkToNpc { npcId, message }` / current `/api/game/dialog` | `NpcActionVM` | First-pass implemented |
| `WN_recv` | NPC window button/selection response | `npcWindow { npcId, seqNo, select, data }` | `NpcActionVM` | Next |
| `WN_send` | NPC opens a window/dialog/menu | `npc.windowOpened` response | `NpcActionVM` | Next |
| `EV_recv` | Map event trigger | `triggerEvent { eventId, x, y, dir }` | Event/action VM | Later |
| `EN_recv`, `DU_recv` | Encounter request / duel request | `startEncounter`, `requestDuel` | `EncounterService`, `BattleRoomDO` | First-pass encounter implemented; duel later |
| `EO_recv` | Leave/escape battle encounter | `battleAction { action: "escape" }` | `BattleRoomDO` | Later |
| `B_recv` -> `BattleCommandDispach` | Battle command packet | `battleAction { action, target, skill, item }` / current `/api/game/battle` | `BattleRoomDO` | First-pass attack implemented |
| `BU_recv` | Battle setup/update request | `battleSnapshot` | `BattleRoomDO` | Later |
| `BATTLESKILL_recv` | Out-of-battle or special battle skill | `battleSkill` / `fieldSkill` | Skill service | Later |
| `ID_recv`, `PI_recv`, `DI_recv`, `DG_recv`, `MI_recv`, `PETITEM_recv` | Item pickup/drop/gold/move/use-on-pet | `inventoryAction` / current `/api/game/use-item` | Inventory service | First-pass item use; full inventory later |
| `KS_recv`, `SPET_recv`, `PS_recv`, `KN_recv`, `PMSG_recv` | Pet battle selection, pet skills, pet rename/message | `petAction` | Pet service | Later |
| `PR_recv`, `KTEAM_recv`, `CHATROOM_recv` | Party/team/chatroom requests | `partyAction`, `chatAction` | `MapRoomDO`, `PartyTradeDO` | Later |
| `STREET_VENDOR_recv`, `VIP_SHOP_recv`, `VIP_SHOP_buy_recv` | Player vendor and VIP shop | Shop variants | Shop service | Later |

## NPC Priority Map

These NPC source modules should drive the first `NpcActionVM` milestones:

| NPC source | Expected actions | Worker VM target |
| --- | --- | --- |
| `npc_timeman.c`, `npc_townpeople.c`, `npc_signboard.c`, `npc_msg.c` | Say/window text, time-gated text | `say`, `window`, `condition.time` |
| `npc_itemshop.c`, `npc_simpleshop.c`, `npc_petshop.c`, `npc_petskillshop.c` | Shop list, buy/sell, pet/skill variants | `openShop`, `buyItem`, `condition.stone`, `condition.capacity` |
| `npc_warp.c`, `npc_warpman.c`, `npc_door.c`, `npc_bus.c`, `npc_ship.c`, `npc_airplane.c` | Warp and transport | `warp`, `condition.flag`, `condition.stone` |
| `npc_healer.c`, `npc_windowhealer.c`, `npc_fmhealer.c` | Heal player/pets | `heal`, `condition.stone` |
| `npc_savepoint.c` | Save location/state | `save`, `setFlag` |
| `npc_windowman.c`, `npc_newnpcman.c`, `npc_eventaction.c`, `npc_storyteller.c` | Window menu, branch, flag/script events | `window`, `choice`, `setFlag`, `give`, `take` |
| `npc_npcenemy.c` | NPC-triggered battle | `startBattle` |
| `npc_bankman.c`, `npc_poolitemshop.c` | Bank/depot item storage | Bank/depot service later |
| `npc_familyman.c`, `npc_fm*.c`, `npc_manorsman.c` | Family/manor systems | Social/manor services later |
| `npc_quiz.c`, `npc_janken.c`, `npc_gambleroulette.c`, `npc_gamblemaster.c` | Mini-games | Mini-game action modules later |

## Current API Compatibility

The current Worker already exposes a thin command facade:

| Current endpoint | Intended command | Notes |
| --- | --- | --- |
| `POST /api/game/new` | `createCharacter` | Local/browser save; cloud account slot next. |
| `POST /api/game/sync` | `normalizeSave` | Keeps `saac-pwa-v1` save stable. |
| `POST /api/game/travel` | `move/warp` | Direct exit selection. |
| `POST /api/game/walk` | `move` | Movement, exit trigger, step encounter. |
| `POST /api/game/talk` | `talkToNpc(hi)` | Default click-to-talk. |
| `POST /api/game/dialog` | `talkToNpc(message)` | Source-grounded first pass, optional AI wording. |
| `POST /api/game/buy` | `buyItem` | Real parsed shop item purchase. |
| `POST /api/game/use-item` | `inventoryAction(use)` | HP recovery first pass. |
| `POST /api/game/encounter` | `startEncounter` | Manual/debug encounter. |
| `POST /api/game/capture` | `battleAction(capture)` | Capture first pass. |
| `POST /api/game/battle` | `battleAction(attack)` | Attack first pass. |
| `POST /api/game/train` | `petAction(train)` | Debug training, should later become real training service. |
| `POST /api/ai/guide` | `aiGuide` | Grounded guide, not state mutation. |

## Unsupported Or Later-Only

Keep these out of the first Worker-native pass unless a feature depends on them:

- Old native TCP compatibility and packet encoding.
- Family/manor ranking and PK scheduling.
- Auction, street vendor, VIP billing, online point purchases.
- GM debug chat commands.
- Full profession skill system.
- Mail, depot, pet depot, and cross-server SAAC features.
- LuaJIT compatibility. Use deterministic action VM first; only add sandboxed Lua/WASM if data proves it is required.

## First Implementation Order

1. `CharacterSessionDO`: load/save/lock surface matching `ACCharLoad`, `ACCharSave`, and `ACLock`.
2. `MapRoomDO`: WebSocket room for `W/W2`, chat, join/leave broadcast.
3. `NpcActionVM`: `TK`/`WN` equivalent for text, shop, warp, heal, savepoint, flag set.
4. `BattleRoomDO`: replace current local encounter with room-backed battle state.
5. `Protocol doc`: freeze JSON command names and payloads before adding native-client or gateway compatibility.
