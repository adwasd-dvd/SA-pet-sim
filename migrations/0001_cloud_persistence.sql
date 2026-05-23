-- SAAC-like cloud persistence baseline for StoneAge Web Rebuild.
-- The canonical character save remains the saac-pwa-v1 JSON snapshot; compact
-- inventory, pet, quest, and session rows are derived/index data.

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  display_name TEXT NOT NULL,
  max_slots INTEGER NOT NULL DEFAULT 4 CHECK (max_slots > 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  UNIQUE (provider, provider_subject)
);

CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK (slot >= 0),
  name TEXT NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
  schema TEXT NOT NULL DEFAULT 'saac-pwa-v1',
  save_version INTEGER NOT NULL DEFAULT 1 CHECK (save_version > 0),
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

CREATE TABLE IF NOT EXISTS character_snapshots (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  save_version INTEGER NOT NULL CHECK (save_version > 0),
  kind TEXT NOT NULL,
  checksum TEXT NOT NULL,
  save_json TEXT NOT NULL,
  saac_debug_string TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS character_inventory (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK (slot >= 0),
  item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1 CHECK (count >= 0),
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, slot)
);

CREATE TABLE IF NOT EXISTS character_pets (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK (slot >= 0),
  pet_id TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
  hp INTEGER,
  max_hp INTEGER,
  state TEXT,
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, slot)
);

CREATE TABLE IF NOT EXISTS character_quest_flags (
  character_id TEXT NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  flag_key TEXT NOT NULL,
  value TEXT NOT NULL,
  source_json TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (character_id, kind, flag_key)
);

CREATE TABLE IF NOT EXISTS character_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  lease_until INTEGER NOT NULL,
  save_version INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_characters_account ON characters(account_id, deleted, slot);
CREATE INDEX IF NOT EXISTS idx_characters_updated ON characters(updated_at);
CREATE INDEX IF NOT EXISTS idx_snapshots_character_version ON character_snapshots(character_id, save_version DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_item ON character_inventory(item_id);
CREATE INDEX IF NOT EXISTS idx_pets_pet_id ON character_pets(pet_id);
CREATE INDEX IF NOT EXISTS idx_quest_flags_key ON character_quest_flags(kind, flag_key);
CREATE INDEX IF NOT EXISTS idx_sessions_lease ON character_sessions(lease_until);
