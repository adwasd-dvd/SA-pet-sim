# Project Memory

This file is the durable memory for continuing development on another machine or in another thread.

## Product Identity

- The project is `石器时代 Web 重构`; the old standalone simulator identity and APIs are removed from the active project.
- Goal: rebuild the Stone Age client/server loop as a browser-first online game, with Cloudflare Worker/PWA as the first runtime target.
- The original shape is `gmsv` game server + `saac` account/character server + local client; the web rebuild should eventually cover all three responsibilities.
- User preference: keep the core cloud-first and Worker-native if possible, because expected player count is small; use original `gmsv/saac` as behavior specs, not as required daemons.
- Future native clients should reuse the same cloud API/WebSocket protocol instead of forcing the browser build to imitate the old TCP client too early.
- Deterministic source/gmsv-data behavior comes first; AI augments only after grounding in game state and source facts.

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

- `external/sources/ref___data` (shown as `gmsv-data` in generated world/debug UI)
- `external/sources/client-assets`
- `external/sources/gmsv`
- `external/sources/client-source`
- `external/sources/saac-data`
- `external/sources/saac-source`

Run `node scripts/check-resources.mjs` after moving machines.

## Resource Pack Strategy

- Treat `external/sources/client-assets/data` as the offline source library, not a publish directory.
- Raw client files such as `real_136.bin`, `adrn_136.bin`, `wayisa`, `spr_115.bin`, and `spradrn_115.bin` should be mined into web-ready packs rather than shipped directly.
- Prioritize original resources that define the StoneAge feel:
  - pet/enemy portraits from `enemybase*.txt` `ImgNo` bitmap references
  - pet/enemy animation frames from `spr_115.bin` / `spradrn_115.bin`
  - core UI windows, field menus, battle panels, and buttons from `anim_tbl.h` and client UI source
- Avoid one giant atlas. Use separate boot UI, map tile, pet-static, pet-field, and pet-battle packs, then lazy-load the optional packs needed by the current map, pet window, or battle.
- Keep the default `public/` boot package small enough for Cloudflare Workers/Pages static asset limits; large optional original-resource packs should be split or served through R2 with cache-versioned manifests.

## Map Rendering Conclusions

- `gmsv-data` is authoritative for map/game logic.
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

1. `progression-001`: finish source EXP/level/counters/field runtime and cover quest/NPC rewards, capture, and battle tests.
2. `combat-001`: deepen source combat formulas, elemental matchup, deterministic enemy battle AI, and battle result telemetry.
3. `status-ui-001`: rebuild original-client STATUS / PET STATUS / ITEM / BATTLE windows around EXP/NEXT, attributes, equipment, and counters.
4. `ai-training-001`: keep AI代练 as battle operation only, with clear guardrails and compact context.
5. `character-fields-001`: expand SAAC-like field/flag/counter APIs for NPC conditions and AI context.
6. `asset-pipeline-001`: define original-client resource pack pipeline and size budgets.
7. `pet-assets-001`: build pet portrait and lazy animation packs around original client sprite data.
8. `asset-pipeline-002`: extract original UI core atlas for windows, menus, and battle panels.
9. `client-ui-002`: continue rebuilding original-client UHD game UI around the map.
10. `script-vm-001`: deterministic NPC action VM for common script actions.
11. `npc-runtime-002`: run NPCs, quests, flags, and field-like data through source-grounded deterministic rules.
12. `warp-002`: complete source-grounded map jump and warp runtime.
13. `pathfinding-001`: mouse movement, route finding, and collision/hit-map logic.
14. `cloud-assets-001`: serve large optional resource packs through R2 and cache.
15. `worker-port-002`: define the JSON/WebSocket command protocol.
16. `persistence-002`: D1/Durable Object cloud save plan.
17. `realtime-001`: first map-room WebSocket architecture.
18. `realtime-002`: online presence MVP where same-map players see each other moving.

## Latest Runtime Notes

- Progression direction accepted 2026-05-13: player/pet leveling must come from battle EXP, not direct buttons. `progression-001` now ports gmsv `LevelUpTbl` cumulative EXP/NEXT thresholds, enemy EXP approximation, level-difference reduction, battle/capture EXP settlement, player/pet counters, save progression summaries, and player ability-point allocation. `/api/game/train` refuses direct mutation, while `/api/game/allocate-point` mirrors `CHAR_SkillUp`: spend 1 `CHAR_SKILLUPPOINT`, add +100 raw Vital/Str/Tough/Dex. Player level-up now follows `battle.c::BATTLE_GetExpGold`: ability points are `UpLevel * 3`, but source `CHAR_CHARM` gains +2 once per EXP settlement, up to 100. At `CHAR_MAXUPLEVEL` 140, player and active pet battle EXP settlement returns 0 and keeps total EXP unchanged, matching `BATTLE_GetExp`. Battle outcomes now carry `sourceResults`, an RS_LIST-style result list where player `num=-2` and pet `num` is the source pet slot, plus persisted defeated-enemy telemetry for multi-enemy battles. Pet level-up follows `CHAR_PetLevelUp`'s 10 random growth point accumulation instead of collapsing repeated rolls. NPC/quest VM `give` rewards now route EXP through the same level-up/skill-point path, sync `characterFields`, and record level-up lines in VM trace.
- AI代练 direction accepted 2026-05-13: AI may help operate battles, but it must not directly write levels/EXP. `ai-training-001` now routes guide training prompts through source encounters and `/api/game/battle` settlement, refuses safe maps, and reports player/pet EXP gains and level changes. The guide can now chain a small bounded set of real wild battles when it spawned the encounter itself, which makes代练 less flaky without bypassing battle EXP/level rules.
- AI NPC role-favor direction accepted 2026-05-13: NPC AI can help only within the NPC's role and source data. `ai-002` now supports a VM-gated `roleFavor` proposal: healer/nurse NPCs may, based on context/probability/compensation, sell a real recovery item from `itemset6` such as `耐久力回复药`; stone, inventory, flags, and debug traces still mutate only through `runNpcVmAction`.
- Character/pet/status UI direction accepted 2026-05-13: STATUS, PET STATUS, BATTLE, and assist panels must show EXP/NEXT/attributes/counters and must not expose direct level-up buttons. Current slice updates main HUD, AI status card, bottom pet/person tabs, PET STATUS, STATUS, and battle panel, with STATUS/assist buttons only for spending already-earned player ability points. Pet assist cards, PET STATUS, and the secondary pet list now show growth breakdown and battle counters from characterFields. The BATTLE panel now reads enemy source EXP, capture rate, party metadata, and nested Earth/Water/Fire/Wind from `characterFields.battle`; battle/capture/AI/NPC battle actions now persist a compact `lastBattleOutcome` so the assist status can show player EXP, active pet EXP, stone, and level-up lines after combat ends. The new source `CHAR_CHARM` field is now visible in the main HUD, map HUD, STATUS, assist character tab, battle player row, and AI status card. Latest slice makes STATUS, PET STATUS, BATTLE, map status, assist pet/person tabs, and AI status display `WORKATTACKPOWER`/`WORKDEFENCEPOWER`/`WORKQUICK` before falling back to WorkFix stats, matching the fields used by battle calculations.
- Combat direction accepted 2026-05-13: base battle damage now includes WorkFixStr/WorkFixTough/WorkFixDex plus Earth/Water/Fire/Wind matchup notes. Elemental multiplier now follows the source `BATTLE_AttrCalc` matrix from `battle_event.c`; `CHAR_complianceParameter` aliases `WORKATTACKPOWER`, `WORKDEFENCEPOWER`, `WORKQUICK`, `WORKFIXLUCK`, and `WORKFIXCHARM` are now normalized into player/pet/enemy field summaries, and battle damage/turn order now prefer `WORKATTACKPOWER`/`WORKDEFENCEPOWER`/`WORKQUICK` before falling back to WorkFix stats. Enemy battle AI now reads `enemy1.txt` tactics for deterministic attack/guard/escape decisions: `es` maps to `BATTLE_COM_ESCAPE`, uses a Worker port of the source escape chance formula, can advance to the next live enemy without awarding EXP, and persists escaped-enemy telemetry separately from defeated enemies. Player escape now also runs through the same source-style chance formula using `WORKFIXLUCK`; failed escape leaves battle active and gives the enemy a same-turn attack, while successful escape ends combat without EXP. Player `G`/`N` commands now persist source player-action telemetry; guard uses the source `BATTLE_GuardAdjust` distribution (25% full guard, then 10/20/30/40/50% damage bands) instead of a flat web multiplier, and NPC dialog understands 防御/待机 as battle commands. Latest slices port the first `W|技能槽|目标` pet-skill path from `battle_command.c` and `pet_skill.c`: `petskill2.txt` now exposes function/option/target metadata, the battle panel has a source `W` skill menu, and Worker battle settlement supports normal attack, guard, guard break, continuous attacks, mighty attacks, `PETSKILL_StatusChange`, and the first `PETSKILL_MagicStatusChange` superwall path. Status attacks parse `毒/剧/麻/眠/石/醉/乱/虚/煞 turn N` options, persist enemy `BattleStatuses`, tick poison-like damage before enemy actions, and block turns for sleep/stone/paralysis. Magic status skills parse `铁壁|turn|percent|scope`, persist active-pet `BattleMagicStatuses.superWall`, and feed that into source-style defence power for the battle duration. Current slices port the battle `S|宠物栏位` and `S|-1` paths from `battle_command.c`/`battle.c`: Worker battle settlement switches to a live reserve pet with `BATTLE_COM_PETOUT`, can withdraw the default pet with `BATTLE_COM_PETIN`, consumes the turn, lets enemy tactics respond, clears outgoing battle-only magic status, and NPC dialog/AI guide can request the same VM-validated switch. Deeper gmsv target selection, broader magic statuses, and full per-side command queue remain follow-up work.
- Battle formation correction accepted 2026-05-13: the previous single-active-pet mental model is not source-accurate enough. The original source uses `BATTLE_ENTRY_MAX=10`, `BATTLE_PLAYER_MAX=5`, and `SIDE_OFFSET=10`; player-side entries are up to five players in slots 0-4, and each default pet enters at owner slot +5 through `BATTLE_PetDefaultEntry`. The current slice adds `S|-1` as real `BATTLE_COM_PETIN` telemetry, preserves `activePetIndex=-1` for pet-in/player-alone states, allows `PETOUT` from that state, and exposes `characterFields.battle.formation` as a source-formation scaffold with ally player/pet slots and enemy side-offset slots. Next battle work must rebuild the battle screen and resolver around full side/slot formation, not the temporary single target panel.
- Original battle screen requirements clarified 2026-05-13: player side appears in the lower-right, enemy side in the upper-left; player party can be up to five people and each person can have one default pet in battle, so the player side can show 10 units. Enemy count/composition must come from source enemy/group files. The UI also needs source-style round countdown, combo/合击, spirit/精灵 commands, item/medicine use, target prompt, HP bars, and bottom chat/status strip before it can be called original-like.
- Battle formation/menu slice 2026-05-13: `characterFields.battle.formation` now exposes `allySlots`/`enemySlots` as 10 source slots per side, `battleNo`/`targetNo`, target group constants `20/21/22/23/24/25/26`, command menu metadata, and a 30-second command window. The browser battle overlay renders enemy units in the upper-left, player/default-pet units in the lower-right, a source-style target prompt, a large countdown, HP bars over units, and a compact original-order 8-button command panel (`H/J/T/Help/G/I/S/E`); the currently ported pet-skill `W` path remains available by keyboard/menu follow-up while the main panel stays source-like. This is still a scaffold; the resolver must next become a real per-unit queue for five players plus five pets.
- Battle interaction slice 2026-05-13: battle commands now give immediate pointer feedback. Attack/capture are selectable modes, targetable enemies show a sprite-tight target frame (not a whole container frame around HP/name), clicked buttons/targets flash, in-flight commands show pending state and a prompt change, and the battle outcome drives a first lunge/hit/impact animation from the source battleNo actor to target (`pet` actor slot maps to visual battleNo `5+slot`). This is still a lightweight DOM motion layer; the next source-accuracy step is to replace it with original action frame/timing data.
- Battle performance hotfix 2026-05-13: the first interaction slice was too visually expensive on some machines. Battle sprites no longer use persistent CSS `filter/drop-shadow`, target frames use simple border/outline, hit feedback uses transform/opacity only, and JS animation restarts avoid forced synchronous `offsetWidth` layout. Browser smoke saw no >33ms frames during target selection/attack on the local test scene.
- `character-fields-001` has started: saves now carry `gmsv-character-fields-v1`, a compact SAAC/gmsv-facing field summary covering base player fields, raw attributes, WorkFix stats, source work aliases, elements, counters, event bits, inventory capacity, pet summaries, and active battle summary. Guide/NPC AI contexts now receive `compactCharacterFields` and `compactPlayerContext`, reducing raw save/token exposure while giving future NPC condition checks one stable field surface. Pet field summaries now include EXP/NEXT/EXP-to-next, progress percent, limit level, growth breakdown, WorkMaxHp/WorkFix/source work stats, and battle counters so AI training and pet UI can reason from the same save data. Active battle fields now include active enemy and enemy-party summaries with source EXP, capture rate, Earth/Water/Fire/Wind, and WorkFix/work aliases so AI/status/battle surfaces can explain matchup and rewards without raw save dumps.
- NPC/warp condition direction accepted 2026-05-13: source `FREE`/`EVENT` expressions must be interpreted as gameplay gates, not loose text. Runtime now evaluates comma OR / `&` AND conditions for `LV`, `ITEM`, `ENDEV`, `NOWEV`, `STONE`, `PET`, `PETCOUNT`, `MANOR`, `CLASS`, and `TRANS`; no-cost gated warps block until conditions pass, while paid fallback warps can still charge through `MONEY`. Current map NPC payloads, nearby state, AI workspace, and NPC AI contexts now include compact `warpStatus` and `scriptStatus` summaries so UI/AI can explain missing item/event/pet/level conditions without reading raw saves. ITEM/PET checks now also carry player-facing names from inventory, party pets, original `itemset6`, original `enemybase2`, or known shop goods, reducing raw numeric IDs in UI and AI context even before the player owns the required item/pet.
- Multiplayer direction accepted 2026-05-13: first target is a Durable Object/WebSocket online-presence MVP, not full MMO systems. Same-map players should see names, positions, facing direction, and movement updates; chat, party, trade, PvP, and authoritative cloud saves come after the presence layer.
- Resource direction accepted 2026-05-12: maximize use of original client assets by extracting web-sized packs from the local source bundle, especially pets and original UI, while avoiding raw multi-GB client files in the Cloudflare publish package.
- Map rendering now uses real client DAT viewport rendering for large maps such as floor `100` / `萨伊那斯`; same-map walking updates markers/viewport without rebuilding `.map-content` or `.ls2-map`, avoiding step flicker.
- Map layering now follows the original client's diagonal tile display order and puts parts/NPC sprites into one depth queue, so trees/walls/NPCs no longer render as a single flat overlay layer.
- `map-render-002` is implemented: `scripts/extract-client-tiles.mjs` now exports `adrn` metadata (`bitmapNo`, `hit`, `hitRaw`, `prioType`, `hitX`, `hitY`, `heightFlag`) into `tiles.json`; `public/assets/app.js` uses a JS port of `checkPrioPartsVsChar` for parts-vs-character ordering; `scripts/check-map-atlas.mjs` validates priority metadata coverage.
- `client-ui-002` now treats the left/top map as a classic 800x600 client viewport: the white floating map card is gone, the map title/source strip is compact and framed, the player/exit markers no longer render as large web badges, and the on-map status/command controls use square beveled client-style panels. Browser checks covered desktop and narrow mobile viewports.
- `client-ui-002` has started: the map now has an original-client-style command dock for pet/task/log/save/data/AI panels plus an in-map status HUD for player/pet HP, level, stone, inventory, and pet count, giving the player in-map controls instead of relying only on the right-side dashboard tabs.
- `pathfinding-001` has started: Worker movement now builds and caches original-client-style hit maps from DAT/LS2MAP tile, parts, event layers plus `adrn` hit metadata; WASD/API movement rejects blocked terrain and NPC cells before mutating location, warp tiles remain passable, and map clicks can request a bounded server-validated route that the client follows step by step.
- Exit marker/list clicks now use Worker `/api/game/route-exit` to choose a reachable exact `mapwarp.txt` source tile and route there, so the same `/walk` path triggers real mapwarp instead of the UI calling instant `/travel` or guessing tiles client-side.
- NPC marker/list clicks now use Worker `/api/game/route-npc` to route to a reachable tile within interaction range before opening dialogue, so map NPC buttons behave like in-world action hotspots rather than remote UI shortcuts without making many client-side route probes.
- Worker NPC `talk/dialog` and shop `buy` actions now enforce source-style distance gates before mutating state, matching the original `CharDistance`/window checks; the client surfaces these refusals in log/dialog text instead of silently remote-operating NPCs.
- NPC dialogs now include structured debug/source metadata (`source`, `script`, `template`, `type`, `actions`, gmsv talk flow) and the in-map dialog header shows the actual `gmsv-data` path/action profile, which is the handoff point for the deterministic script VM and future AI guardrails.
- `npc-002` is implemented: default click-to-talk sends `hi`, custom dialog text appends in the same overlay, source dialogue advances one NPC line at a time, and asking an NPC about `来源/脚本/source/debug` returns the `gmsv-data` source and script entry.
- `script-vm-001` has started: deterministic NPC replies now record `npcVmEvents` for whitelisted actions such as `say`, `quest`, `shop`, `window`, `warp`, `heal`, `save`, `setFlag`, `give`, `take`, `startBattle`, `battleAction`, `debug`, and unsupported future actions; dialog debug returns `actions`, VM `allowedActions`, global `supportedActions`, and the current NPC's recent `vmTrace`, and SAAC-like save JSON carries recent VM events for inspection. Stateful `setFlag/give/take/startBattle/battleAction` actions now run through `runNpcVmAction`, mutate flags/stone/exp/inventory/encounter/battle state inside the NPC VM executor, and mark trace detail with `executor: npc-action-vm` plus `mutated`.
- `shop-001` now supports original-style buy/sell item shops: `/api/game/sell` enforces the same NPC window distance gate, reads parsed `trade.sellRate`, removes one inventory item through NPC VM `take`, pays stone through NPC VM `give`, and the in-map shop window shows buy and sell lists together.
- `npc-runtime-002` has started: healer NPCs now perform source-style recovery for player/pets and savepoint NPCs record last savepoint into game/save state, including SAAC-like save info and event flags.
- `warp-002` has started: NPC WarpMan args now parse source `WARP`, `FREE`, `MONEY`, and `DelItem` metadata into `WORLD`; dialog can prompt and execute loaded warp targets, including level/item checks, level-based stone cost, ticket consumption, logs, event flags, and SAAC-like save updates. Floors `122` and `1021` are forced into the compact Worker map set as renderable source warp fixtures.
- Map exits now carry exact per-tile `mapwarp.txt` targets, so stepping onto a multi-tile doorway lands at the matching original target coordinate instead of the cluster center. Runtime records `lastWarp` and `LAST_WARP` in the SAAC-like save info for both mapwarp and NPC warp actions.
- Automatic walking encounters and the visible encounter/capture UI are disabled per user direction. NPC dialogue can now explicitly create a source-grounded `startBattle` VM state from current-map `encount.txt` and continue with `battleAction` attack/capture/release commands in the same dialog. The dialog overlay shows a compact battle box with enemy sprite, HP, capture rate, active pet HP, and recent battle log, while the old auto capture panel remains hidden.
- `item-use-001` is implemented: `/api/game/use-item` consumes bought recovery items, restores active pet HP first and player HP when the pet is already full, and keeps unsupported inventory items visible but disabled in the UI.
- Battle `I` item command is now wired into the source-command battle loop: the map battle panel enables 道具 only when a recovery item and recoverable target exist, opens an in-battle ITEM picker, sends the selected `item:<id>` command to `/api/game/battle`, restores active pet/player endurance, records `sourceCommand: "I"`, and lets the enemy respond in the same turn. NPC dialog battleAction also accepts “道具”.
- `quest-001` data/runtime hooks exist, but its battle/capture progress step is currently not reachable from the main UI while automatic encounter/capture is disabled. Redesign this under a source-grounded battle/capture task before making it player-facing again.
- `client-ui-002` latest slice follows `external/sources/client-source/system/field.cpp` and `chat.cpp`: the left/top map viewport now owns original-style top-left field buttons, top-right action buttons, a bottom channel/chat strip, the drawn player sprite, and in-map PET STATUS / ITEM / QUEST / LOG / DATA / ACTION windows. The outside right-side tabs remain as secondary/debug surfaces while the map becomes the primary client screen.
- NPC dialogue has been moved into the main map viewport as an original-client-style bottom dialog window. Opening NPC dialogue now closes PET/ITEM-style map windows, keeping the field view as one coherent client screen instead of a separate web modal layer.
- Dialogue subpanels for shop and battle now share the dark, gold-trimmed client-window treatment instead of modern white cards, so NPC trade/combat interactions stay visually native to the map viewport.
- Original field menu assets are now extracted from the client atlas by explicit `anim_tbl.h` IDs (`CG_FIELD_MENU_LEFT_NEW`, `CG_FIELD_MENU_RIGHT`, menu/trade/channel/join/help/action button states) and shown as atlas sprites instead of recreated CSS buttons.
- The temporary player character uses original `SPR_001em` animation frames parsed from `spr_115.bin` (`ANIM_STAND`/`ANIM_WALK` bitmap numbers) and redraws during each movement step; these player frames are force-extracted by `bitmapNo` to avoid collisions with unrelated `graphicNo` records.
- Real client-map mode no longer shows the web-only `W` / `出` glyph badges over the map; NPC and exit DOM elements remain as transparent click/focus hotspots while the visible NPCs/warps come from the original canvas render and bottom channel/status text.
- Player sprite resources are cache-busted with `player-sprite-v2`, and runtime rendering rejects any player frame whose atlas metadata is not the original `bitmapNo` frame (`graphicNo` must be `0`, dimensions must stay in character-sprite range) to prevent old/colliding building sprites from appearing as the main character.
- Keyboard/player facing now uses the original gmsv 8-direction table from `CHAR_getDXDY`: `0=(0,-1)`, `1=(1,-1)`, `2=(1,0)`, `3=(1,1)`, `4=(0,1)`, `5=(-1,1)`, `6=(-1,0)`, `7=(-1,-1)`. `Q/W/E/A/D/Z/S/C`, arrow keys, Home/PageUp/End/PageDown, and numpad keys map through this table, and blocked moves still rotate the character to face the attempted direction.
- Field button actions have been split by original `FIELD_FUNC_*` semantics: menu opens `OPTION`, family/channel opens `CHANNEL`, Action opens character actions instead of AI, join-battle opens a battle/join status window, and help remains quest/query.
