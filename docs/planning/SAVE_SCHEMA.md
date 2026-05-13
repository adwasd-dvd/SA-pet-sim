# Save Schema: `saac-pwa-v1`

The browser save format keeps the original SAAC mental model but stores it as readable JSON for Worker/PWA development.

## Source Basis

- SAAC character slots: `saac/include/char.h` uses `MAXCHAR_PER_USER` and exposes `loadCharOne` / `saveCharOne`.
- SAAC save string: `saac/char.c` builds a character save with `makeSaveCharString(charname, option, charinfo)`.
- SAAC file placement: `saac/char.c` derives per-account/per-slot filenames through `makeCharFileName`.
- SAAC grouped fields: `saac/characters.h` names grouped save sections such as flags, skills, items, title, mail, and profession data.

## Browser JSON Shape

```json
{
  "schema": "saac-pwa-v1",
  "account": {
    "id": "local-account",
    "name": "本地账号",
    "activeSlot": 0,
    "maxSlots": 4,
    "lock": null
  },
  "character": {
    "id": "uuid-or-stable-id",
    "slot": 0,
    "name": "人物名",
    "createdAt": "ISO time",
    "updatedAt": "ISO time",
    "deleted": false
  },
  "player": {
    "name": "人物名",
    "level": 1,
    "exp": 0,
    "stone": 100,
    "hp": 100,
    "maxHp": 100
  },
  "location": {
    "mapId": "1000",
    "x": 50,
    "y": 116
  },
  "pets": [],
  "inventory": [],
  "quests": {},
  "characterFields": {
    "schema": "gmsv-character-fields-v1",
    "base": {
      "level": 1,
      "exp": 0,
      "nextExp": 2,
      "expToNext": 2,
      "hp": 100,
      "maxHp": 100,
      "stone": 100,
      "mapId": "1000",
      "x": 50,
      "y": 116,
      "dir": 5
    },
    "attributes": {
      "Vital": 1600,
      "Str": 1200,
      "Tough": 1200,
      "Dex": 1000,
      "EarthAT": 50,
      "WaterAT": 50,
      "FireAT": 0,
      "WindAT": 0
    },
    "counters": {
      "battleCount": 0,
      "winCount": 0,
      "loseCount": 0,
      "skillUpPoint": 0
    },
    "events": {
      "endEvents": [0, 0, 0, 0, 0, 0, 0, 0],
      "nowEvents": [0, 0, 0, 0, 0, 0, 0, 0],
      "bitsCount": 0,
      "recentBits": []
    }
  },
  "flags": {
    "endEvents": [0, 0, 0, 0, 0, 0, 0, 0],
    "nowEvents": [0, 0, 0, 0, 0, 0, 0, 0],
    "bits": {},
    "npcTalkCounts": {}
  },
  "walk": {
    "steps": 0,
    "encounterSteps": 0
  },
  "log": []
}
```

## SAAC Debug String

The Save tab also renders a compatibility/debug string:

```text
charname|option|charinfo
```

This mirrors SAAC `makeSaveCharString` enough for inspection while keeping the actual PWA import/export path JSON-first.

## Flag Model

- `flags.endEvents`: persistent completed-event bit arrays.
- `flags.nowEvents`: temporary/current-event bit arrays.
- `flags.bits`: readable debug index by `kind:shiftbit`.
- `flags.npcTalkCounts`: per-NPC talk count used by first-pass dialogue and quest triggers.
- `characterFields`: compact SAAC/gmsv-facing field summary for deterministic NPC checks and AI context. It mirrors stable gameplay state: base stats, `CHAR_SKILLUPPOINT`, Earth/Water/Fire/Wind, WorkFix battle stats, event bits, inventory capacity, pet summaries, and active battle summary. This avoids sending full raw saves to AI and gives NPC logic one field API to read from.

## Import/Export

- Export uses `game.save.json`.
- Import accepts either a raw `saac-pwa-v1` object or `{ "game": ... }`.
- Import calls `/api/game/sync`, which normalizes identity, flags, save metadata, and current map state.
