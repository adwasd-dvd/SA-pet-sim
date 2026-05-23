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
    "maxHp": 100,
    "Vital": 1600,
    "Str": 1200,
    "Tough": 1200,
    "Dex": 1000,
    "EarthAT": 50,
    "WaterAT": 50,
    "FireAT": 0,
    "WindAT": 0,
    "charm": 60,
    "skillUpPoint": 0
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
    "work": {
      "WorkFixVital": 16,
      "WorkMaxHp": 98,
      "WorkFixStr": 14,
      "WorkFixTough": 14,
      "WorkFixDex": 10,
      "WorkFixCharm": 60,
      "WorkAttackPower": 14,
      "WorkDefencePower": 14,
      "WorkQuick": 10
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

Cloud persistence note: `docs/planning/CLOUD_PERSISTENCE_SCHEMA.md` defines how this JSON save maps onto D1 tables, `AccountSessionDO` / `CharacterLockDO` leases, `saveVersion` compare-and-set writes, and localStorage import. The JSON object remains canonical; `charname|option|charinfo` stays a debug/export companion for SAAC compatibility work.

## Flag Model

- `flags.endEvents`: persistent completed-event bit arrays.
- `flags.nowEvents`: temporary/current-event bit arrays.
- `flags.bits`: readable debug index by `kind:shiftbit`.
- `flags.npcTalkCounts`: per-NPC talk count used by first-pass dialogue and quest triggers.
- `characterFields`: compact SAAC/gmsv-facing field summary for deterministic NPC checks and AI context. It mirrors stable gameplay state: base stats, `CHAR_SKILLUPPOINT`, Earth/Water/Fire/Wind, source WorkFix and battle aliases such as `WORKATTACKPOWER`/`WORKDEFENCEPOWER`/`WORKQUICK`, event bits, inventory capacity, pet summaries, and active battle summary. This avoids sending full raw saves to AI and gives NPC logic one field API to read from.

## AI NPC Social State

`npc-social-001` adds compact, source-grounded NPC identity and relationship state:

- `npcSocial.schema`: currently `stoneage-npc-social-v1`.
- `npcSocial.npcs`: up to 32 NPC entries keyed by source NPC id/floor/coordinate.
- Each entry stores small tone-only scores such as affinity, trust, suspicion, helped, threatened, challenged, declined, failed, and cooldownUntil.
- Each entry stores at most five short memories; prompts expose at most three relevant memories.
- Persona/debug context may include role, duty, source meaning, topics, role-fit capabilities, and high-confidence gender or age clues, but these clues are tone-only and never grant rewards, discounts, warps, or task success.
- `flags.pendingNpcProposal`: one short-lived current NPC proposal waiting for accept or decline. Save/export exposes only the public proposal summary, costs, grants, risk, expiry, NPC id, and proposal id; the executable internal action is Worker-owned and must be revalidated by `/api/game/dialog-proposal`.
- `effects.npcConditionOverrides`: scoped, short-TTL task-condition relief keyed by `npcId:eventNo:conditionHash`. Each entry stores `npcId`, optional `npcName`, `eventNo`, `conditionHash`, the normalized source `condition`/`conditionToken`/`conditionKind`, a compact failed-check summary, optional `substituteCost.stone`, `createdAt`, `expiresAt`, and `usesLeft`. The Worker consumes or expires entries deterministically before original source rewards, warps, flags, pet grants, or savepoint changes run.
- `effects.npcConditionOverrideDebug`: bounded recent debug events for override creation, matching, consumption, expiry, and refusal diagnosis. This is debug-only and may be truncated during normalization.

Planned later social fields:

- Additional social scoring fields may be added after the proposal/regression gate if they stay compact and tone-only.

These fields must stay compact because future multiplayer persistence may store them per character. They must not contain raw dialogue transcripts, raw source scripts, or unrelated NPC histories.

## Import/Export

- Export uses `game.save.json`.
- Import accepts either a raw `saac-pwa-v1` object or `{ "game": ... }`.
- Import calls `/api/game/sync`, which normalizes identity, flags, save metadata, and current map state.
