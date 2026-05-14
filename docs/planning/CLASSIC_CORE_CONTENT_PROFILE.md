# Classic Core Content Profile

This document defines the content-slimming direction for the StoneAge Web rebuild.

The project should shrink by enabling a smaller original-content graph, not by inventing replacement art, editing maps, or cutting quest lines halfway.

## Reference Policy

External guides are useful for memory, naming, and player expectations, but they are not authoritative build data.

Use this authority order:

1. Local source data in `external/sources/ref___data`.
2. Generated local world data in `src/world-data.js`.
3. Local client resources in `external/sources/client-assets` and `external/sources/client-source`.
4. Imported quest index entries in `src/stoneage-quest-index.js`.
5. External guides and map/pet websites as advisory candidates only.

Any map id, cave floor count, NPC, pet member, item, enemy group, or quest step from an external page must be verified against local data before it becomes part of a release profile.

Public deployment note: original client, map, pet, music, server, and guide resources may require explicit rights. This technical plan assumes authorized use or private research.

## Non-Negotiables

- Do not use custom replacement art when original client resources exist.
- Do not modify original maps to make them smaller or easier.
- Do not change map structure, layer data, floor count, or cave depth.
- Do not recolor, palette-swap, or reskin pets/maps/UI to pretend content exists.
- Do not rename original NPCs, enemies, pets, items, or maps.
- Do not create an original starter story, lightweight tutorial quest, or replacement quest line.
- Do not invent new pets, NPCs, enemies, items, or quest shortcuts as a substitute for source content.
- Do not keep half a quest line. A quest is either preserved as a complete playable flow or closed for the current profile.
- Do not package unopened maps just because they exist in source data.
- Close or hide entrances to disabled content instead of letting players enter broken or empty areas.
- If rebirth is enabled, preserve the complete original requirement chain, including the four caves and the dark cave final flow.

## Slimming Principle

The minimum viable game is not "few maps." It is a source-faithful progression spine:

1. Start in the classic village experience: 渔村 / 萨姆吉尔村.
2. Catch the first pet.
3. Run village loops: shops, equipment, capture learning, pet training.
4. Complete 成人仪式 as the first major "I entered mid-game" milestone.
5. Clear representative caves and earn attribute proof moments.
6. Enter 漆黑洞窟, defeat the final boss, and complete rebirth.

After that, advanced staged goals should preserve old-player memory points:

- 2.0: 英雄岛 / 红暴 / 四圣石 / 金虎.
- 2.5: 玛蕾菲雅 / 精灵王线.

## Content Profiles

### `classic-core`

Bootable small game profile. This is the "Core 1.82-like" package, but exact membership is determined by local data, not by a public version article.

It should include the source-complete progression spine:

- 渔村 and/or 萨姆吉尔村 start flow.
- First-pet capture flow.
- Core village shops, equipment, heal/save, and capture/training loops.
- 成人仪式.
- Four proof caves required by rebirth when those lines are enabled: 琉璃 / 玄黄 / 碧青 / 深红.
- Rebirth path only if the complete 四洞 + 漆黑洞窟 flow is included.
- Classic pet families and iconic battle targets needed by this profile.

The default boot package should not include later regions just because they are present in source data.

### `classic-side`

Optional side-task pack after the core spine is playable:

- 伐木任务.
- 小猪爱情故事.
- 恐龙博士.
- 亚姆的斧头.
- 阿布洞窟.
- 强盗洞穴.
- JOT / SOT, only when the route can be preserved as source-complete.

### `classic-advanced-2.0`

High-level extension after `classic-core`:

- 英雄岛.
- 红暴.
- 四圣石.
- 金虎.

### `classic-advanced-2.5`

Advanced extension after `classic-advanced-2.0`:

- 玛蕾菲雅.
- 精灵王 / 精灵少女 / 黑暗精灵王 lines, only after local scripts, maps, pet dependencies, and rewards are verified.

### `full-dev`

Developer profile that can load broader source content for analysis, comparison, and future staging. This profile is not the default deploy target.

## Candidate Whitelist

This is a candidate list, not a direct shipping list. Every entry must pass the closure and source-evidence validation below.

### Core Quest Lines

- 成人仪式.
- 琉璃洞窟.
- 玄黄洞窟.
- 碧青洞窟.
- 深红洞窟.
- 漆黑洞窟 / 人物转生.

If one of these lines is too large or not source-complete yet, disable the whole line and close its entrances. Do not shorten cave floors or rewrite steps.

### Advanced Quest Lines

- 2.0 memory targets: 英雄岛, 红暴, 四圣石, 金虎.
- 2.5 memory targets: 玛蕾菲雅, 精灵王 / 精灵少女 / 黑暗精灵王.

These should be optional content profiles or lazy packs, not mandatory `classic-core` boot resources.

### Core Map/Region Candidates

- 北岛 / 萨伊那斯.
- 南岛 / 加鲁卡.
- 吉鲁岛 if needed for 深红, 漆黑, 达那, 福尔德, and related source flows.
- 沙姆岛 only if a verified enabled line requires it; otherwise stage it with advanced content.
- Core villages from local data such as 玛丽娜丝渔村, 萨姆吉尔村, 柯奥村, 卡坦村, 柯尔克村, 加加村, 卡鲁它那村, 奇喀喀村, 福尔德村, 达那村.
- Functional interiors only when required: weapon shop, item shop, pet shop, hospital, meat shop, village elder/chief house, and required transit/transport interiors.

Nonessential interiors such as idle houses, arenas, chat rooms, dojos, quiz rooms, and manors should stay closed until their source-complete line is enabled.

### Core Pet Family Candidates

Keep families and iconic members as original resources, but pack only the members required by enabled content plus a small classic showcase set:

- 乌力系.
- 布伊系.
- 加美系.
- 凯比系.
- 人龙系.
- 火鸡系.
- 老虎系.
- 暴龙系, including red/blue/mechanical targets when required by enabled lines.
- 雷龙系.
- 鲨鱼系 and 海主人系 for water/undersea content when required.
- 穿山甲系 and cave ecology pets when required.
- 大象系 when transport/cave lines require it.
- 飞天蛙系 and 洛克斯系 mainly for 2.5/advanced staging unless local core data requires them.
- Four guardians and other rebirth bosses when rebirth is enabled.

Delay event pets, holiday pets, GP pets, "改" variants, fusion-era pets, and later-version pets unless an enabled source-complete line requires them.

## Build Rules

- A content profile owns the enabled quest lines, regions, maps, NPCs, enemy groups, pets, items, scripts, and resource packs.
- World generation should compute a closure graph from enabled quest lines:
  - required floors and transit floors
  - source warps and entrances
  - NPC scripts and window/shop/battle actions
  - quest and progression items
  - enemy groups and encounter maps
  - pet family and sprite/image dependencies
  - UI, map tile, and animation resources needed by those contents
- If a warp target is outside the enabled graph, the entrance should be closed or hidden with source-style behavior. It must not lead to a missing or empty map.
- Do not use a global `MAX_MAPS` cap as content design. A profile is a quest/resource dependency closure, not an arbitrary map count.
- Items should be kept only when they are sold, rewarded, consumed, equipped, or required by enabled content.
- Enemies should be kept only when they appear in enabled encounters, NPC battles, quest battles, or representative training loops.
- Pets should keep classic families and iconic targets, but nonessential family variants can be staged later. Removed variants should not be replaced with custom art.
- Pet resources should remain lazy-loaded by map/region/battle. Do not put every pet family member and every animation into the boot package.

## Validation Gates

Every content profile build should report:

- enabled floor count and total map asset size
- enabled NPC/script count
- enabled item count
- enabled enemy group and enemy count
- enabled pet family/member count
- generated bitmap/sprite frame count and atlas/pack sizes
- closed warp/entrance count
- missing dependency errors
- source evidence for each externally suggested map, NPC, item, enemy, pet, and quest line

A profile should fail the build if:

- an enabled quest references a missing map, NPC, item, enemy, pet, or script action
- an enabled warp points to an unpackaged floor without an explicit closed-entry rule
- an enabled battle references missing enemy/pet art
- rebirth is enabled without the full 四洞 + 漆黑洞窟 flow
- an external-guide-only entry is included without local data evidence
- a profile introduces custom art, renamed source content, modified map structure, or shortened cave floors
