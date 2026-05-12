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
- Original server entry point map: `docs/planning/GMSV_SAAC_WORKER_PORT_MAP.md`.
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
- Draw order follows original client `system/map.cpp::drawMap` plus `SortDispBuffer` behavior:
  - ground tiles use the client's diagonal scan in final display order
  - parts/objects and NPC sprites are drawn through a shared screen-depth queue
  - future accuracy work should include `adrn` hit/prio metadata and port `setPartsPrio` more exactly
- Current default zoom is `100%`.
- Camera recenters on the player using the rendered client-map coordinate space.

## UI Conclusions

- UI should follow the original client mental model:
  - main game viewport
  - right auxiliary/info panel
  - lower status/NPC/exit panel
- Current viewport is max 800x600 and shrinks to fit screen height.
- Next UI direction is original-client-inspired UHD game UI, not a dashboard:
  - map remains the main surface
  - location/NPC/warp/action buttons live on or near the map where source data supports them
  - character, pet, item bag, status, dialogue, shop, and save surfaces should feel like in-game windows/panels
  - read `external/sources/client-source/system/menu.cpp`, `talkwindow.cpp`, `field.cpp`, `mouse.cpp`, and `sprdisp.cpp` before major UI changes

## Save Model

- Current schema: `saac-pwa-v1`.
- Save doc: `docs/planning/SAVE_SCHEMA.md`.
- Save panel supports JSON export/import.
- Flags are available as `flags.endEvents`, `flags.nowEvents`, `flags.bits`, and `flags.npcTalkCounts`.
- Upcoming NPC/runtime work should expand this toward original character `field`/flag/state semantics rather than inventing web-only quest state.

## Current Done Tasks

- `client-ui-001`
- `movement-001`
- `npc-001`
- `npc-002`
- `save-001`
- `cloud-001`
- `shop-001`
- `battle-001`
- `item-use-001`
- `cleanup-001`
- `quest-001`
- `worker-port-001`
- `map-render-002`

See `docs/planning/tasks.jsonl` for the full backlog.

## Likely Next Work

1. `client-ui-002`: rebuild original-client UHD game UI around the map.
2. `script-vm-001`: deterministic NPC action VM for common script actions.
3. `npc-runtime-002`: run NPCs, quests, flags, and field-like data through source-grounded deterministic rules.
4. `warp-002`: complete source-grounded map jump and warp runtime.
5. `pathfinding-001`: mouse movement, route finding, and collision/hit-map logic.
6. `battle-002`: redesign encounter/battle/capture without resurrecting the removed auto capture UI.
7. `worker-port-002`: define the JSON/WebSocket command protocol.
8. `persistence-002`: D1/Durable Object cloud save plan.
9. `realtime-001`: first map-room WebSocket architecture.

## Latest Runtime Notes

- Map rendering now uses real client DAT viewport rendering for large maps such as floor `100` / `萨伊那斯`; same-map walking updates markers/viewport without rebuilding `.map-content` or `.ls2-map`, avoiding step flicker.
- Map layering now follows the original client's diagonal tile display order and puts parts/NPC sprites into one depth queue, so trees/walls/NPCs no longer render as a single flat overlay layer.
- `map-render-002` is implemented: `scripts/extract-client-tiles.mjs` now exports `adrn` metadata (`bitmapNo`, `hit`, `hitRaw`, `prioType`, `hitX`, `hitY`, `heightFlag`) into `tiles.json`; `public/assets/app.js` uses a JS port of `checkPrioPartsVsChar` for parts-vs-character ordering; `scripts/check-map-atlas.mjs` validates priority metadata coverage.
- `client-ui-002` now treats the left/top map as a classic 800x600 client viewport: the white floating map card is gone, the map title/source strip is compact and framed, the player/exit markers no longer render as large web badges, and the on-map status/command controls use square beveled client-style panels. Browser checks covered desktop and narrow mobile viewports.
- `client-ui-002` has started: the map now has an original-client-style command dock for pet/task/log/save/data/AI panels plus an in-map status HUD for player/pet HP, level, stone, inventory, and pet count, giving the player in-map controls instead of relying only on the right-side dashboard tabs.
- `pathfinding-001` has started: Worker movement now builds and caches original-client-style hit maps from DAT/LS2MAP tile, parts, event layers plus `adrn` hit metadata; WASD/API movement rejects blocked terrain and NPC cells before mutating location, warp tiles remain passable, and map clicks can request a bounded server-validated route that the client follows step by step.
- Exit marker/list clicks now use Worker `/api/game/route-exit` to choose a reachable exact `mapwarp.txt` source tile and route there, so the same `/walk` path triggers real mapwarp instead of the UI calling instant `/travel` or guessing tiles client-side.
- NPC marker/list clicks now use Worker `/api/game/route-npc` to route to a reachable tile within interaction range before opening dialogue, so map NPC buttons behave like in-world action hotspots rather than remote UI shortcuts without making many client-side route probes.
- Worker NPC `talk/dialog` and shop `buy` actions now enforce source-style distance gates before mutating state, matching the original `CharDistance`/window checks; the client surfaces these refusals in log/dialog text instead of silently remote-operating NPCs.
- NPC dialogs now include structured debug/source metadata (`source`, `script`, `template`, `type`, `actions`, gmsv talk flow) and the in-map dialog header shows the actual ref-data path/action profile, which is the handoff point for the deterministic script VM and future AI guardrails.
- `npc-002` is implemented: default click-to-talk sends `hi`, custom dialog text appends in the same overlay, source dialogue advances one NPC line at a time, and asking an NPC about `来源/脚本/source/debug` returns the ref-data source and script entry.
- `script-vm-001` has started: deterministic NPC replies now record `npcVmEvents` for whitelisted actions such as `say`, `quest`, `shop`, `window`, `warp`, `heal`, `save`, `setFlag`, `give`, `take`, `startBattle`, `battleAction`, `debug`, and unsupported future actions; dialog debug returns `actions`, VM `allowedActions`, global `supportedActions`, and the current NPC's recent `vmTrace`, and SAAC-like save JSON carries recent VM events for inspection. Stateful `setFlag/give/take/startBattle/battleAction` actions now run through `runNpcVmAction`, mutate flags/stone/exp/inventory/encounter/battle state inside the NPC VM executor, and mark trace detail with `executor: npc-action-vm` plus `mutated`.
- `npc-runtime-002` has started: healer NPCs now perform source-style recovery for player/pets and savepoint NPCs record last savepoint into game/save state, including SAAC-like save info and event flags.
- `warp-002` has started: NPC WarpMan args now parse source `WARP`, `FREE`, `MONEY`, and `DelItem` metadata into `WORLD`; dialog can prompt and execute loaded warp targets, including level/item checks, level-based stone cost, ticket consumption, logs, event flags, and SAAC-like save updates. Floors `122` and `1021` are forced into the compact Worker map set as renderable source warp fixtures.
- Map exits now carry exact per-tile `mapwarp.txt` targets, so stepping onto a multi-tile doorway lands at the matching original target coordinate instead of the cluster center. Runtime records `lastWarp` and `LAST_WARP` in the SAAC-like save info for both mapwarp and NPC warp actions.
- Automatic walking encounters and the visible encounter/capture UI are disabled per user direction. NPC dialogue can now explicitly create a source-grounded `startBattle` VM state from current-map `encount.txt` and continue with `battleAction` attack/capture/release commands in the same dialog. The dialog overlay shows a compact battle box with enemy sprite, HP, capture rate, active pet HP, and recent battle log, while the old auto capture panel remains hidden.
- `item-use-001` is implemented: `/api/game/use-item` consumes bought recovery items, restores active pet HP first and player HP when the pet is already full, and keeps unsupported inventory items visible but disabled in the UI.
- `quest-001` data/runtime hooks exist, but its battle/capture progress step is currently not reachable from the main UI while automatic encounter/capture is disabled. Redesign this under a source-grounded battle/capture task before making it player-facing again.
- `client-ui-002` latest slice follows `external/sources/client-source/system/field.cpp` and `chat.cpp`: the left/top map viewport now owns original-style top-left field buttons, top-right action buttons, a bottom channel/chat strip, the drawn player sprite, and in-map PET STATUS / ITEM / QUEST / LOG / DATA / ACTION windows. The outside right-side tabs remain as secondary/debug surfaces while the map becomes the primary client screen.
- NPC dialogue has been moved into the main map viewport as an original-client-style bottom dialog window. Opening NPC dialogue now closes PET/ITEM-style map windows, keeping the field view as one coherent client screen instead of a separate web modal layer.
- Dialogue subpanels for shop and battle now share the dark, gold-trimmed client-window treatment instead of modern white cards, so NPC trade/combat interactions stay visually native to the map viewport.
- Original field menu assets are now extracted from the client atlas by explicit `anim_tbl.h` IDs (`CG_FIELD_MENU_LEFT_NEW`, `CG_FIELD_MENU_RIGHT`, menu/trade/channel/join/help/action button states) and shown as atlas sprites instead of recreated CSS buttons.
- The temporary player character uses original `SPR_001em` animation frames parsed from `spr_115.bin` (`ANIM_STAND`/`ANIM_WALK` bitmap numbers) and redraws during each movement step; these player frames are force-extracted by `bitmapNo` to avoid collisions with unrelated `graphicNo` records.
- Real client-map mode no longer shows the web-only `W` / `出` glyph badges over the map; NPC and exit DOM elements remain as transparent click/focus hotspots while the visible NPCs/warps come from the original canvas render and bottom channel/status text.
- Player sprite resources are cache-busted with `player-sprite-v2`, and runtime rendering rejects any player frame whose atlas metadata is not the original `bitmapNo` frame (`graphicNo` must be `0`, dimensions must stay in character-sprite range) to prevent old/colliding building sprites from appearing as the main character.
