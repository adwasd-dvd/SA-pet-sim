# Slim SA Game Guide Adoption

Source guide: <https://github.com/adwasd-dvd/slim-SA-Game-Guide>

Imported revision: `b1239ae`.

## How This Project Uses It

The guide is now treated as an implementation input, not just a reference link.
Its planning documents are mirrored under `docs/reference/slim-SA-Game-Guide/`,
and its resource analysis tools are imported under `scripts/resource-tools/`.

The active strategy is:

1. Build content profiles from source-data dependency closure.
2. Keep complete original quest lines; close disabled entrances instead of
   sending players to missing maps.
3. Generate profile texture keep-sets from the closure manifest, maps, client
   maps, NPC graphics, encounter enemies, original UI frames, and selected
   player frames.
4. Plan boot/shared/region/floor/pet packs before changing runtime loading.
5. Build and validate profile packs with pixel comparison against the current
   monolithic atlas.

This keeps the project faithful to original maps, names, pets, NPCs, and client
resources while making the package small enough for web/cloud deployment.

## Commands

```bash
npm run closure:classic-core
npm run report:classic-core
npm run profile:keep-set:classic-core
npm run profile:plan-packs:classic-core
npm run profile:build-packs:classic-core
npm run profile:validate-packs:classic-core
```

Or run the full resource pipeline:

```bash
npm run profile:assets:classic-core
```

## Current Guardrails

- `profiles/content-profiles.json` is the source profile config.
- `classic-core` is first-session content: village start, first pet, service
  loops, low-level combat, and adult ceremony.
- `classic-rebirth` is separate and must preserve the full four-cave plus dark
  cave chain before it ships.
- `classic-advanced-2.0` and `classic-advanced-2.5` are optional staged packs.
- `classic-lite-remix` is explicitly non-faithful and must not be confused with
  source-faithful profiles.

## Next Runtime Step

The current runtime still loads `/data/client-tiles/tiles-atlas.png`. After the
pack reports are stable, the next implementation step is to teach
`public/assets/app.js` to load `profile-manifest.json` and then fetch only boot
packs plus the current floor's packs.
