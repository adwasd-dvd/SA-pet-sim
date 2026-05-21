# Worker-Native Command Protocol

This document freezes the current browser-to-Worker command boundary for the StoneAge rebuild. It is the Worker-native replacement for the original TCP packet surface while preserving `gmsv` and `saac` gameplay semantics.

## Rules

- The browser sends HTTPS commands for request/response gameplay actions and WebSocket messages only for same-map room presence.
- All state mutation is deterministic and owned by Worker services. AI can propose wording or candidate actions, but the Worker must validate and execute every item, warp, battle, heal, flag, pet, and stone change.
- Every command must remain source-grounded: behavior should trace to `gmsv`, `saac`, `ref___data`, `gmsv-data`, generated `world-data`, or verified client assets.
- old native TCP compatibility is a later gateway track. Do not shape the main Worker protocol around legacy socket framing.
- The command schema must be stable enough for future D1/DO persistence and native client support.

## Request Envelope

Current endpoints still accept compact JSON bodies, but new server-side command adapters should normalize them into this envelope before touching game state:

```json
{
  "schema": "sa-worker-command-v1",
  "command": "map.walkStep",
  "requestId": "uuid-or-client-generated-id",
  "sessionId": "browser-or-account-session",
  "accountId": "optional-account-id",
  "characterId": "active-character-id",
  "saveVersion": 12,
  "game": {
    "mapId": 1000,
    "floor": 1000,
    "x": 50,
    "y": 118,
    "dir": 2
  },
  "payload": {}
}
```

`requestId` gives later `CharacterSessionDO` and `BattleRoomDO` handlers a place to make retry handling idempotent. `saveVersion` lets the server reject stale browser snapshots once cloud persistence is active.

## Response Envelope

Worker responses should keep the current `game` snapshot shape, but command handlers should eventually return this normalized envelope:

```json
{
  "schema": "sa-worker-command-v1",
  "ok": true,
  "requestId": "uuid-or-client-generated-id",
  "command": "map.walkStep",
  "game": {},
  "events": [],
  "vmTrace": [],
  "roomEvents": [],
  "error": null
}
```

`events` are deterministic local client updates. `roomEvents` are same-map presence or chat events that can be mirrored to `MapRoomDO`. `vmTrace` is structured NPC/script evidence for Debug and test reports.

## Current HTTPS Commands

| Endpoint | Canonical command | Source role |
| --- | --- | --- |
| `POST /api/data/search` | `data.searchSourceIndex` | Tooling/debug source lookup only. |
| `POST /api/game/new` | `character.createLocalSnapshot` | Temporary local character creation before D1 slots. |
| `POST /api/game/sync` | `character.syncSnapshot` | Save schema normalization and hydration. |
| `POST /api/game/travel` | `map.travelToExit` | Source map exit/warp travel. |
| `POST /api/game/walk` | `map.walkStep` | Movement, collision, exit trigger, step encounter. |
| `POST /api/game/turn` | `map.turn` | Direction-only update. |
| `POST /api/game/route` | `map.routeToTile` | Deterministic pathfinding, no AI. |
| `POST /api/game/route-npc` | `map.routeToNpc` | Deterministic route to NPC interaction range. |
| `POST /api/game/route-exit` | `map.routeToExit` | Deterministic route to warp/exit entry tile. |
| `POST /api/game/paid-jump` | `map.paidJump` | Worker-validated stone cost and warp to known map point. |
| `POST /api/game/return-savepoint` | `map.returnSavePoint` | Return to player-selected source savepoint. |
| `POST /api/game/talk` | `npc.talkDefault` | Default `hi` click/double-click NPC talk. |
| `POST /api/game/dialog` | `npc.dialog` | Source NPC dialogue, shop, warp, quest, battle, and script actions. |
| `POST /api/game/dialog-ai` | `npc.dialogAi` | AI wording/proposal path, deterministic VM executes mutations. |
| `POST /api/game/buy` | `shop.buyItem` | Source shop purchase and temporary AI discount validation. |
| `POST /api/game/sell` | `shop.sellItem` | Source item shop buyback. |
| `POST /api/game/learn-pet-skill` | `pet.learnSkill` | Source pet skill shop command. |
| `POST /api/game/learn-profession-skill` | `character.learnProfessionSkill` | Source profession skill shop command. |
| `POST /api/game/pool-pet` | `pet.poolAction` | Source pet depot/store action. |
| `POST /api/game/pet-fusion` | `pet.fusion` | Source pet fusion validation and mutation. |
| `POST /api/game/pool-item` | `inventory.poolAction` | Source item depot/store action. |
| `POST /api/game/change-item` | `inventory.changeItem` | Source item exchange action. |
| `POST /api/game/use-item` | `inventory.useItem` | Source-backed item effects. |
| `POST /api/game/equip-item` | `inventory.equipItem` | Equip item from backpack to character. |
| `POST /api/game/unequip-item` | `inventory.unequipItem` | Return equipped item to backpack. |
| `POST /api/game/drop-item` | `inventory.dropItem` | Remove one backpack item. |
| `POST /api/game/encounter` | `battle.startEncounter` | Source encounter table battle creation. |
| `POST /api/game/capture` | `battle.capturePet` | Battle capture command. |
| `POST /api/game/battle` | `battle.submitAction` | Attack, defend, item, escape, skill, capture, settlement. |
| `POST /api/game/train` | `character.refuseDirectTraining` | Retired debug path; EXP must come from battle or auto-battle. |
| `POST /api/game/allocate-point` | `character.allocatePoint` | Player-controlled stat point allocation after leveling. |
| `POST /api/game/rest` | `character.restRecover` | Deterministic rest/heal command. |
| `POST /api/game/pet-mode` | `pet.setBattleMode` | Set pet fight/rest mode. |
| `POST /api/game/pet-release` | `pet.release` | Release a pet from the team. |
| `POST /api/ai/guide` | `ai.guide` | Grounded helper guidance and deterministic service suggestions. |
| `POST /api/ai/workspace` | `ai.workspaceQuery` | Development/debug knowledge workspace query. |
| `POST /api/ai/workspace-note` | `ai.workspaceNote` | Development/debug knowledge note capture. |
| `GET /api/ai/status` | `ai.status` | AI model and availability status. |

## Current WebSocket Commands

| Endpoint | Canonical command | Source role |
| --- | --- | --- |
| `/api/realtime/map/:mapId` | `room.mapPresence` | Same-map player presence, coordinate, direction, and movement updates. |

`room.mapPresence` belongs to `MapRoomDO`. It should carry hot room state only: player id, display name, map/floor, x/y, direction, movement stamp, and optional chat. Character save data remains in `CharacterSessionDO` or D1 snapshots.

## Legacy Protocol Mapping

| Original packet/function | Worker command |
| --- | --- |
| `lssproto_ClientLogin_recv`, `ACCharLogin` | `account.login` |
| `lssproto_CharList_recv`, `ACCharList` | `character.listSlots` |
| `lssproto_CreateNewChar_recv` | `character.createSlot` |
| `lssproto_CharLogin_recv`, `ACCharLoad` | `character.loadAndLock` |
| `lssproto_CharLogout_recv`, `ACCharSave` | `character.saveSnapshot` |
| `W_recv`, `W2_recv` | `map.walkStep` |
| `M_recv` | `map.fetchChunk` or static asset fetch |
| `TK_recv`, `CHAR_Talk` | `npc.talkDefault` or `npc.dialog` |
| `WN_recv` | `npc.windowResponse` |
| `EV_recv` | `map.triggerEvent` |
| `EN_recv`, `DU_recv` | `battle.startEncounter`, `battle.requestDuel` |
| `EO_recv` | `battle.escape` |
| `B_recv`, `BattleCommandDispach` | `battle.submitAction` |
| `ID_recv`, `PI_recv`, `DI_recv`, `MI_recv`, `PETITEM_recv` | `inventory.useItem`, `inventory.dropItem`, `inventory.poolAction`, `inventory.useOnPet` |
| `KS_recv`, `SPET_recv`, `PS_recv`, `KN_recv`, `PMSG_recv` | `pet.setBattleMode`, `pet.learnSkill`, `pet.rename`, `pet.message` |
| `PR_recv`, `KTEAM_recv`, `CHATROOM_recv` | `party.action`, `room.chat` |

## Durable Object Split

| Target | Owns | Does not own |
| --- | --- | --- |
| `CharacterSessionDO` | Active save lock, idempotency, snapshot saveVersion, save throttling | Map broadcasts, AI text generation |
| `MapRoomDO` | Same-map WebSocket presence, movement broadcast, room chat | Permanent inventory, flags, battle settlement |
| `BattleRoomDO` | Turn order, active units, commands, reward settlement | Map walking or unrelated NPC dialogue |
| `PartyTradeDO` | Temporary party/trade confirmation state | Character storage outside confirmed mutations |

## Gateway Compatibility Track

Native TCP compatibility is explicitly later. A future gateway may translate old packets into `sa-worker-command-v1` commands, but the gateway must not bypass Worker validation or mutate D1/DO state directly.
