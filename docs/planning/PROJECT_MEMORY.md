# Project Memory

This file is the durable memory for continuing development on another machine or in another thread.

## Product Identity

- The project is `石器时代 Web 重构`; the old standalone simulator identity and APIs are removed from the active project.
- Goal: rebuild the Stone Age client/server loop as a browser-first online game, with Cloudflare Worker/PWA as the first runtime target.
- The original shape is `gmsv` game server + `saac` account/character server + local client; the web rebuild should eventually cover all three responsibilities.
- User preference: keep the core cloud-first and Worker-native if possible, because expected player count is small; use original `gmsv/saac` as behavior specs, not as required daemons.
- Future native clients should reuse the same cloud API/WebSocket protocol instead of forcing the browser build to imitate the old TCP client too early.
- Deterministic source/ref-data behavior comes first; AI augments only after grounding in game state and source facts.

## Current Technical State

- App root: `app/`.
- Cloudflare Worker entry: `src/worker.js`.
- Frontend entry: `public/index.html`, `public/assets/app.js`, `public/assets/app.css`.
- Generated world model: `src/world-data.js`.
- Cloud/runtime strategy: `docs/planning/CLOUD_RUNTIME_STRATEGY.md`.
- Worker-native port plan: `docs/planning/WORKER_NATIVE_GMSV_PORT.md`.
- Runtime map assets:
  - `public/data/maps/*.ls2map`
  - `public/data/client-maps/*.dat`
  - `public/data/client-tiles/tiles.json`
  - `public/data/client-tiles/tiles-atlas.png`

## Bundled Source/Data Bundle

All major external references have been copied locally:

- `external/sources/ref___data`
- `external/sources/client-assets`
- `external/sources/gmsv`
- `external/sources/client-source`
- `external/sources/saac-data`
- `external/sources/saac-source`

Run `node scripts/check-resources.mjs` after moving machines.

## Map Rendering Conclusions

- Ref-data is authoritative for map/game logic.
- Client `.dat` visual maps are used for visual reconstruction when available.
- Projection follows client `drawMap` / `camMapToGamen`:
  - `screenX = (mapX + mapY) * 32`
  - `screenY = (-mapX + mapY) * 24`
- Tile sprites from the client atlas must be vertically flipped before drawing into each diamond cell.
- Current default zoom is `100%`.
- Camera recenters on the player using the rendered client-map coordinate space.

## UI Conclusions

- UI should follow the original client mental model:
  - main game viewport
  - right auxiliary/info panel
  - lower status/NPC/exit panel
- Current viewport is max 800x600 and shrinks to fit screen height.

## Save Model

- Current schema: `saac-pwa-v1`.
- Save doc: `docs/planning/SAVE_SCHEMA.md`.
- Save panel supports JSON export/import.
- Flags are available as `flags.endEvents`, `flags.nowEvents`, `flags.bits`, and `flags.npcTalkCounts`.

## Current Done Tasks

- `client-ui-001`
- `movement-001`
- `npc-001`
- `save-001`
- `cloud-001`
- `shop-001`
- `battle-001`
- `item-use-001`
- `cleanup-001`
- `quest-001`

See `docs/planning/tasks.jsonl` for the full backlog.

## Likely Next Work

1. `worker-port-001`: inventory `gmsv/saac` entry points and map them to Worker-native services.
2. `persistence-002`: D1/Durable Object cloud save plan.
3. `realtime-001`: first map-room WebSocket architecture.
4. `npc-002`: source-grounded NPC dialogue overlay.
5. `script-001`: common NPC action VM from `gmsv` and ref-data.
6. `script-vm-001`: deterministic NPC action VM for common script actions.

## Latest Runtime Notes

- `battle-001` first pass is implemented: `/api/game/battle` supports an `attack` action for the active first pet against the current encounter, applies speed-order turns, stores temporary `game.battle.log`, grants exp/stone on victory, and clears the encounter on win/defeat.
- Encounter overlay now has Attack / Capture / Release controls and displays enemy/current pet HP plus recent battle lines.
- Maps without `encounterPets` disable the manual `野外遇敌` button to avoid direct encounter calls from safe village maps.
- `item-use-001` is implemented: `/api/game/use-item` consumes bought recovery items, restores active pet HP first and player HP when the pet is already full, and keeps unsupported inventory items visible but disabled in the UI.
- `quest-001` is implemented: generated world data now gives `萨姆吉尔的老师` the `samugiru-field-practice` quest, and the Worker advances it when the player leaves for an encounter map, defeats/captures a wild pet, then returns to report. The quest panel shows step progress and completion state.
