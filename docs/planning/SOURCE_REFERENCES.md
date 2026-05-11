# Source References

These local source trees are the canonical references for rebuilding the game behavior. When browser behavior and guessed logic disagree with these sources, prefer the source/ref-data path listed here.

## Canonical Data

- Bundled: `external/sources/ref___data`
- Original local path: `/Users/adwasd/Downloads/CodeX-projects/SA-Pet-sim/ref___data`
  - Primary gameplay data for maps, NPCs, pets, items, warps, encounters, and scripts.
  - Use this as the authoritative data source for gameplay logic.

## Runtime Server

- Bundled: `external/sources/gmsv`
- Original local path: `/Users/adwasd/Downloads/CodeX-projects/CodeX-石器时代网游/stoneage-master/石器时代服务器端最新完整源代码/gmsv`
  - Source reference for map runtime, NPC creation, NPC talk flow, shops, items, battle, pets, flags, and warps.
  - Browser Worker modules should reimplement behavior from this tree in small, testable services.

## Account And Character Server

- Bundled: `external/sources/saac-data`
- Original local path: `/Users/adwasd/Downloads/CodeX-projects/CodeX-石器时代网游/2016_SA80/Linux-Main-app/saac`
  - Reference data/layout for account and character persistence.

- Bundled: `external/sources/saac-source`
- Original local path: `/Users/adwasd/Downloads/CodeX-projects/CodeX-石器时代网游/stoneage-master/石器时代服务器端最新完整源代码/saac`
  - Source reference for account login, character slots, save/load, locks, pool item/pet storage, mail/family placeholders.
  - Key files:
    - `include/char.h`: `MAXCHAR_PER_USER`, `loadCharOne`, `saveCharOne`, pool item/pet APIs.
    - `char.c`: `makeSaveCharString`, `makeCharFileName`, `loadCharNameAndOption`, `getCharInfoFromString`.
    - `characters.h`: SQL save field grouping including `CHAR_list_flg_String`, `CHAR_list_item_String`, and related fields.

## Client

- Bundled source: `external/sources/client-source`
- Bundled assets: `external/sources/client-assets`
- Original source path: `/Users/adwasd/Downloads/CodeX-projects/CodeX-石器时代网游/stoneage-master/石器时代8.5客户端最新源代码/石器源码`
- Original asset path: `/Users/adwasd/Downloads/CodeX-projects/公益石器时代`
  - Source reference for map projection, UI flow, visual map rendering, interaction conventions, and input feel.
  - Current browser projection follows client `drawMap` / `camMapToGamen` behavior.

## Current Browser Rebuild Rules

- Ref-data is canonical for logic; client map data is allowed for visual reconstruction.
- The Worker replaces `gmsv` runtime behavior.
- Browser JSON/local storage and future Cloudflare persistence replace `saac`.
- AI can explain or extend interaction only after the deterministic data/source-backed behavior has first been modeled.
