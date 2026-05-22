# StoneAge Web Rebuild Development Plan

This project is no longer just a fork cleanup. The goal is to rebuild Stone Age as a browser-first PWA that preserves the client/server behavior where it matters, then adds an AI layer that helps the world feel alive.

## Product Direction

1. Recreate the original play loop in the browser.
   - One-screen game client: map, player, NPCs, dialogue, inventory, pets, battle/trade panels.
   - Movement, warp, NPC interaction, shops, pets, quests, encounter logic.
   - Visual fidelity follows the original client source and assets, not guessed transforms.

2. Re-implement server behavior in web-native modules.
   - `gmsv` behavior becomes game simulation services: maps, NPC scripts, encounters, battle, items, pets, quests.
   - `saac` behavior becomes account/character persistence: characters, flags, pets, inventory, bank, save/load.
   - Cloudflare Worker hosts APIs and static assets; Durable Objects/KV/D1 can be introduced when persistence needs grow.

3. Add AI as an augmentation layer, not a replacement for source data.
   - AI can summarize quest state, help explain NPC hints, guide players, and generate contextual dialogue extensions.
   - Canonical data remains ref-data/client/server source derived.
   - AI must cite or ground itself in current map, NPC, flags, inventory, quests, and server script facts.

4. Grow from single-player PWA into an online game runtime.
   - Treat `gmsv` as the source reference for world simulation, not as a monolith that must run unchanged inside a Worker.
   - Treat `saac` as the source reference for account/character persistence, then rebuild the persistence semantics with browser JSON, D1, and Durable Objects.
   - Use WebSocket rooms for real-time map, party, chat, battle, and trade state.
   - Keep original TCP client compatibility as a later bridge/container/VPS track, not the first blocker.

## Current Ground Rules

- Source paths are tracked in `docs/planning/SOURCE_REFERENCES.md`.
- Cloud and multiplayer runtime direction is tracked in `docs/planning/CLOUD_RUNTIME_STRATEGY.md`.
- Worker-native `gmsv/saac` porting decisions are tracked in `docs/planning/WORKER_NATIVE_GMSV_PORT.md`.
- Character/account persistence is tracked in `docs/planning/SAVE_SCHEMA.md`.
- Visual maps use client map rendering behavior.
- Map geometry and projection follow the original client `drawMap` / `camMapToGamen` logic.
- Each tile sprite is vertically flipped before being pasted into its diamond cell.
- NPC, warp, encounter, shop, quest, and account semantics come from ref-data and server source.
- Client `.dat` visual data may be used for visual reconstruction, while ref-data remains authoritative for game logic.
- AI may propose dialogue or allowed actions, but deterministic game services must validate and execute every state change.

## Cloud Runtime Direction

Cloudflare is a good fit for the browser-first rebuild when the project is split into web-native services:

- Worker: API gateway, static assets, light deterministic game APIs, AI routing.
- Durable Objects: per-account locks, map rooms, battle rooms, party/trade sessions, WebSocket coordination.
- D1: account, character, inventory, pet, quest, and save snapshot data.
- R2 or Static Assets: generated maps, tile atlases, data tables, large client resources.
- KV: read-heavy config/cache only, not authoritative character saves.
- Workers AI or external models: grounded NPC wording and guide responses.

Plain Workers are not the right place for unmodified long-running `gmsv/saac` TCP daemons. That path should use Containers, a VPS, or a protocol bridge later if old native client compatibility becomes a priority.

The preferred near-term strategy is still Cloudflare-first: port the `gmsv/saac` behavior into Worker-native services instead of running the original daemon. `mysqlclient` becomes D1/DO persistence, `pthread/epoll` becomes Durable Object/WebSocket event handling, and Lua/LuaJIT behavior starts as a deterministic NPC action VM before any Lua/WASM compatibility work.

## Milestones

### M1: Client Shell In One Screen

Goal: Make the PWA feel like a game client, not a dashboard.

- Put map, player, NPC dialogue, chat/log, inventory/pets, and action buttons in one continuous game screen.
- Replace separate tab-first UX with overlay windows modeled after the client.
- Keep NPC dialogue on top of the map, with click-to-talk and default `hi` behavior.
- Add persistent hotkeys for movement, talk, inventory, pet, map, close window.
- Make UI windows draggable or stackable only if it helps play.

Acceptance:

- Player can move, click NPC, talk, shop, inspect pets/items without leaving the main screen.
- UI does not cover the player by default.
- The map remains interactive under the UI shell.

### M2: Movement On 45-Degree Map

Goal: WASD should feel like normal world directions, despite the diamond projection.

- Separate world grid movement from screen-space movement.
- `W` means north/up in the player’s mental map, not visually diagonal drift.
- Convert key input to grid deltas through the isometric basis:
  - screen up corresponds to `(-1, -1)` style movement depending on final camera orientation.
  - screen right/left/down map to paired grid deltas.
- Test movement against visible player marker and warp triggers.
- Keep click-to-walk later as a separate pathfinding task.

Acceptance:

- Pressing WASD feels like moving up/down/left/right on the rendered screen.
- Player remains centered at default zoom.
- Walking onto a warp tile triggers map transition.

### M3: NPC Layer

Goal: Real NPCs appear and interact correctly.

- Load all NPCs per floor from ref-data, not just a small sample.
- Render NPC sprites using their `graphic` id.
- Keep text hotspots light so they do not hide sprites.
- Parse common NPC script patterns: `TimeMan`, shops, banks, skill NPCs, healers, warp NPCs, quest NPCs.
- Dialogue should start with default `hi`, but allow custom user text.

Acceptance:

- NPCs visible at real coordinates on 1000 and 2000.
- Clicking visible NPC opens in-map dialogue.
- Shop NPCs show real items and prices.

### M4: Character And Account Model

Goal: Implement a browser-native version of `saac` save semantics.

- Define account, character, flags, pets, inventory, bank, mail/family placeholders.
- Store save state in a format inspired by original fields but readable in JSON.
- Track per-character flags for NPC/quest conditions.
- Add import/export debug panel for saves.

Acceptance:

- A player can create a character, reload, and continue with flags/inventory/pets intact.
- NPC dialogue can read/write flags.

### M5: Item, Pet, Battle, Encounter Loop

Goal: Bring back the core RPG loop.

- Parse item stats and equipment categories.
- Model inventory capacity and item use.
- Parse pets/enemies and build encounter tables.
- Implement first-pass battle: turn order, attack, skill placeholder, catch pet, rewards.
- Add leveling for player and pets.

Acceptance:

- Walking in encounter regions can start battle.
- Player can catch a pet, gain exp, buy/use item.

### M6: Quest And Script Runtime

Goal: Move from static dialogue to script-driven behavior.

- Build a small interpreter for common ref-data NPC script patterns.
- Support conditions on flags, items, pets, level, map, time.
- Represent quests as derived structured state.
- Keep unsupported script actions visible in debug output.

Acceptance:

- At least one multi-step original quest works end to end.
- Debug panel shows which script/source produced each response.

### M7: AI Layer

Goal: Add useful AI without losing original game truth.

- AI guide reads current game context and suggests next actions.
- AI can rephrase NPC hints, but must preserve canonical facts.
- AI can answer “what should I do now?” from map, flags, quests, items, pets.
- Planned v1 NPC social layer: persona sandbox, compact relationship memory, social negotiation, and player-confirmed proposals. Track the full design in `docs/planning/AI_NPC_SOCIAL_PROPOSAL_PLAN.md`.
- Later: AI companion, dynamic NPC flavor, quest recap, translation/explanation.

Acceptance:

- AI answer includes source-grounded current context.
- AI does not invent NPC/shop/warp data when ref-data has the answer.
- NPC AI cannot directly mutate critical game state; stone, item, pet, warp, discount, pass, savepoint, and condition-relief actions must be Worker-validated proposals confirmed by the player.

### M8: Cloud Multiplayer Runtime

Goal: Make the browser rebuild feel like an online game again.

- Add a Durable Object map room that owns nearby player presence and chat.
- Add a WebSocket protocol for enter, move, talk, leave, and room state snapshots.
- Persist character changes through a per-character lock/session boundary.
- Keep room hot state separate from D1 save snapshots.

Acceptance:

- Two browser tabs can see each other on the same map.
- Moving in one tab broadcasts a position update to the other tab.
- Chat appears only to players in the same room/range.
- Reloading preserves the character through cloud persistence.

## Engineering Tracks

- `client-render`: map, sprites, UI windows, movement, camera.
- `world-data`: extraction from ref-data/client assets/server source.
- `game-runtime`: player, NPC scripts, flags, encounters, battle.
- `persistence`: local save, Worker KV/D1/Durable Object later.
- `ai`: grounded assistant APIs, NPC persona, compact social memory, and prompt/proposal boundaries.
- `ops`: Cloudflare deploy, cache versioning, smoke tests.

## JSONL Workflow

Planning tasks live in `docs/planning/tasks.jsonl`. Each line is one task object. This keeps the roadmap append-only and easy to grep, script, or feed into future automation.

Required fields:

- `id`: stable task id.
- `track`: engineering track.
- `status`: `todo`, `doing`, `done`, `blocked`.
- `priority`: `P0`, `P1`, `P2`.
- `title`: short task name.
- `goal`: why this task exists.
- `source`: source of truth or reference path.
- `acceptance`: array of concrete checks.
- `depends_on`: array of task ids.

Recommended rhythm:

1. Pick one `P0` or `P1` task.
2. Change status to `doing`.
3. Implement and verify.
4. Change status to `done` with evidence in `notes`.
5. Add follow-up tasks as new JSONL lines instead of rewriting history.
