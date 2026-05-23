# Cloud Persistence Schema

This document closes `persistence-002`: the first SAAC-like cloud persistence
contract for the StoneAge Web rebuild.

The goal is not to invent a new save model. The browser JSON save remains
`saac-pwa-v1`; Cloudflare storage gives it accounts, character slots, conflict
protection, snapshots, and queryable summaries.

## Source Basis

Local source facts that shape the design:

- `external/sources/saac-source/include/char.h` defines `MAXCHAR_PER_USER` as
  2 or 4 depending on build flags. Cloud slots should default to 4 for current
  web saves, while keeping the limit configurable per account.
- `external/sources/saac-source/char.c` stores slot files through
  `makeCharFileName(id, num)`, producing one account/slot record such as
  `id.0.char`.
- `char.c` serializes the source save as `charname|option|charinfo` through
  `makeSaveCharString`. The cloud design preserves this as a debug/export
  companion, but treats JSON as the canonical Worker runtime save.
- `saacproto_serv.c` exposes the old shape through `ACCharLoad`,
  `ACCharSave`, `ACCharDelete`, and `ACLock`. Cloud APIs should map to the
  same semantics: load optional lock, save optional unlock, delete by slot, and
  account/character lock checks before mutation.
- `lock.c` keeps account locks in hash buckets and refuses duplicate loads.
  Cloud locks should move to Durable Objects with short leases and explicit
  session ids.
- `characters.h` names save groups such as info, flags, skills, items, title,
  mail, and profession data. Cloud tables should only index compact summaries
  of those groups and keep the full JSON snapshot intact.
- `_CHAR_POOLITEM` and `_CHAR_POOLPET` store account-level item/pet pools
  separately from active character inventory. These pools are later tables, not
  part of the first character-save write path.

## Boundaries

- D1 is the durable index and snapshot store.
- Durable Objects own live account/character locks and session leases.
- `MapRoom` Durable Objects keep only same-map hot presence and chat payloads;
  they must not write movement spam into character snapshots.
- The Worker is the only writer for gameplay mutations. AI NPC proposals,
  condition overrides, item/pet changes, warps, battles, and savepoint effects
  still pass through deterministic Worker/NPC VM code before a save is written.
- KV is not the authoritative save store because it is eventually consistent.
- R2 may hold large archived snapshots later, but v1 stores current JSON and
  small recent snapshots in D1.

## D1 Tables

The first D1 migration should create these tables. Column names are deliberately
plain and stable so future native clients can use the same API envelope.

```sql
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  display_name TEXT NOT NULL,
  max_slots INTEGER NOT NULL DEFAULT 4,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  UNIQUE (provider, provider_subject)
);

CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL,
  name TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0,
  schema TEXT NOT NULL DEFAULT 'saac-pwa-v1',
  save_version INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_loaded_at INTEGER,
  last_saved_at INTEGER,
  last_map_id TEXT,
  last_x INTEGER,
  last_y INTEGER,
  last_dir INTEGER,
  level INTEGER,
  stone INTEGER,
  exp INTEGER,
  summary_json TEXT NOT NULL DEFAULT '{}',
  save_json TEXT NOT NULL,
  saac_option TEXT NOT NULL DEFAULT '',
  saac_charinfo TEXT NOT NULL DEFAULT '',
  saac_debug_string TEXT NOT NULL DEFAULT '',
  UNIQUE (account_id, slot),
  UNIQUE (account_id, name)
);

CREATE TABLE character_snapshots (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  save_version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  checksum TEXT NOT NULL,
  save_json TEXT NOT NULL,
  saac_debug_string TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE TABLE character_inventory (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, slot)
);

CREATE TABLE character_pets (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL,
  pet_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  hp INTEGER,
  max_hp INTEGER,
  state TEXT,
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, slot)
);

CREATE TABLE character_quest_flags (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  flag_key TEXT NOT NULL,
  value TEXT NOT NULL,
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, kind, flag_key)
);

CREATE TABLE character_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  lease_until INTEGER NOT NULL,
  save_version INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

Indexes:

```sql
CREATE INDEX idx_characters_account ON characters(account_id, deleted, slot);
CREATE INDEX idx_characters_updated ON characters(updated_at);
CREATE INDEX idx_snapshots_character_version ON character_snapshots(character_id, save_version DESC);
CREATE INDEX idx_inventory_item ON character_inventory(item_id);
CREATE INDEX idx_pets_pet_id ON character_pets(pet_id);
CREATE INDEX idx_quest_flags_key ON character_quest_flags(kind, flag_key);
CREATE INDEX idx_sessions_lease ON character_sessions(lease_until);
```

## Canonical Save And Derived Rows

`characters.save_json` is the canonical `saac-pwa-v1` document. The inventory,
pet, quest flag, and summary tables are derived from it at save time so that
guides, admin tools, search, and smoke checks do not need to parse every full
snapshot.

If a derived row disagrees with `save_json`, the Worker must rebuild the derived
rows from the snapshot instead of trusting the stale index.

Snapshot retention for v1:

- Keep the current row in `characters`.
- Insert a `character_snapshots` row for manual saves, imports, and major
  source milestones such as source savepoint, rebirth, or character delete.
- Keep a bounded rolling set for autosaves, for example the latest 10 per
  character, until R2 archival is added.

## Durable Object Locks

Two DO names are enough for v1:

- `AccountSessionDO`: `account:${accountId}`. Owns account bootstrap, character
  list, local-save import, and account-level slot operations.
- `CharacterLockDO`: `char:${characterId}`. Owns load/save leases for one
  character and serializes writes to D1.

Lease shape:

```json
{
  "sessionId": "uuid",
  "accountId": "acct",
  "characterId": "char",
  "clientId": "browser-or-device",
  "saveVersion": 12,
  "leaseUntil": 1760000000000,
  "lastSeenAt": 1760000000000
}
```

Rules:

- Loading with lock fails if another unexpired lease exists, mirroring SAAC's
  duplicate-load refusal.
- Saving must include the last loaded `saveVersion` and active `sessionId`.
- The DO increments `saveVersion` after a successful D1 transaction.
- Unlock clears only the matching `sessionId`.
- Expired leases may be reclaimed by a later load, but the response should tell
  the old client to resync if it tries to save.
- Manual export remains available even if cloud lock acquisition fails.

## API Surface

The initial cloud APIs should sit beside existing local-game endpoints:

```text
GET  /api/account/bootstrap
GET  /api/account/characters
POST /api/account/import-local-save
POST /api/account/characters
POST /api/account/characters/:id/load
POST /api/account/characters/:id/save
POST /api/account/characters/:id/unlock
POST /api/account/characters/:id/delete
```

Every mutating request should include:

- `requestId` for idempotency.
- `sessionId` when a character is locked.
- `saveVersion` for compare-and-set writes.
- Compact client build/cache version for diagnosis.

Every response should include:

- `account`.
- `characters` or active `character`.
- `saveVersion`.
- `lock` or `lease` summary when relevant.
- The canonical `game` JSON for active loads.

## Local Save Migration

The browser can remain local-first until the player signs in or asks to import.

Migration path:

1. Read localStorage `game.save.json` / `saac-pwa-v1`.
2. Call `/api/account/import-local-save` with the raw JSON and a checksum.
3. Worker validates schema, normalizes the save through the existing sync path,
   assigns `account.id`, `character.id`, slot, and `saveVersion`.
4. D1 stores the normalized JSON, a snapshot with `kind='import'`, and derived
   inventory/pet/quest rows.
5. The browser receives a cloud-backed save and keeps the old local export as a
   rollback file until the first successful cloud save.

Name and slot conflicts:

- If the local name already exists on the account, offer a free slot with a
  suffix proposal such as `name-2` rather than overwriting.
- If all slots are full, refuse import without mutating D1.
- Deleted characters keep their slot reserved until explicit purge or restore
  support is designed.

## Write Timing

To stay smooth, do not write D1 on every movement step.

Write on:

- manual save
- source savepoint NPC
- mapwarp or NPC warp that changes floor
- battle settlement
- item/pet/shop mutation
- quest flag mutation
- proposal acceptance that mutates state
- periodic quiet autosave, capped and debounced

Do not write on:

- every same-map step
- every MapRoom presence ping
- pure AI chat
- hover/click UI state
- failed proposal preflight

## Compatibility Notes

- `saac_debug_string` must remain `charname|option|charinfo` for inspection and
  future gateway work. It is not the canonical runtime parser.
- `summary_json` may expose player level, map, stone, active pet, item count,
  and last battle/task summary, but not raw source scripts or AI prompt text.
- `game.npcSocial` remains compact and tone-only. It must not store raw chat
  transcripts.
- `flags.pendingNpcProposal` should normally be short-lived and may be dropped
  on load if expired.
- `effects.npcConditionOverrides` can persist because it is scoped, one-shot,
  and deterministic.

## Acceptance Mapping

This document satisfies `persistence-002`:

- D1 schema covers accounts, character slots, save snapshots, inventory, pets,
  quest flags, sessions, and timestamps.
- Account and character DO lock boundaries are defined.
- `saac-pwa-v1` JSON and `charname|option|charinfo` debug export remain
  compatible with the current Save tab.
- localStorage import into cloud slots is documented without forcing existing
  local-only play to disappear.

## Follow-Up Tasks

- `persistence-003`: add D1 migrations and account/character Worker APIs.
- `persistence-004`: add browser sign-in/import/load/save UI while preserving
  local export/import.
- `persistence-005`: connect CharacterLockDO save leases to mutating game
  endpoints.
- `realtime-003`: make MapRoom presence optionally reference cloud character ids
  while still keeping room heat state separate from saves.
