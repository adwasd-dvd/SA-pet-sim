import fs from "node:fs";

const docPath = "docs/planning/CLOUD_PERSISTENCE_SCHEMA.md";
const tasksPath = "docs/planning/tasks.jsonl";
const migrationPath = "migrations/0001_cloud_persistence.sql";

const doc = fs.readFileSync(docPath, "utf8");
const tasks = fs.readFileSync(tasksPath, "utf8");
const migration = fs.readFileSync(migrationPath, "utf8");

const requiredDocSnippets = [
  "MAXCHAR_PER_USER",
  "makeCharFileName",
  "makeSaveCharString",
  "charname|option|charinfo",
  "ACCharLoad",
  "ACCharSave",
  "ACLock",
  "accounts",
  "characters",
  "character_snapshots",
  "character_inventory",
  "character_pets",
  "character_quest_flags",
  "character_sessions",
  "AccountSessionDO",
  "CharacterLockDO",
  "saveVersion",
  "localStorage",
  "saac-pwa-v1",
  "MapRoom",
  "D1",
  "Durable Objects",
  "pendingNpcProposal",
  "0001_cloud_persistence.sql",
];

const missing = requiredDocSnippets.filter((snippet) => !doc.includes(snippet));
if (missing.length > 0) {
  throw new Error(`Cloud persistence schema is missing required term(s): ${missing.join(", ")}`);
}

const persistenceTaskLine = tasks
  .split("\n")
  .find((line) => line.includes('"id":"persistence-002"'));

if (!persistenceTaskLine) {
  throw new Error("persistence-002 task is missing from docs/planning/tasks.jsonl");
}

const persistenceTask = JSON.parse(persistenceTaskLine);
if (persistenceTask.status !== "done") {
  throw new Error(`persistence-002 should be marked done after ${docPath}; got ${persistenceTask.status}`);
}

if (!String(persistenceTask.notes || "").includes("CLOUD_PERSISTENCE_SCHEMA.md")) {
  throw new Error("persistence-002 notes should reference CLOUD_PERSISTENCE_SCHEMA.md");
}

const requiredMigrationSnippets = [
  "CREATE TABLE IF NOT EXISTS accounts",
  "CREATE TABLE IF NOT EXISTS characters",
  "CREATE TABLE IF NOT EXISTS character_snapshots",
  "CREATE TABLE IF NOT EXISTS character_inventory",
  "CREATE TABLE IF NOT EXISTS character_pets",
  "CREATE TABLE IF NOT EXISTS character_quest_flags",
  "CREATE TABLE IF NOT EXISTS character_sessions",
  "save_json TEXT NOT NULL",
  "save_version INTEGER NOT NULL",
  "saac_debug_string TEXT NOT NULL",
  "lease_until INTEGER NOT NULL",
  "CREATE INDEX IF NOT EXISTS idx_characters_account",
  "CREATE INDEX IF NOT EXISTS idx_snapshots_character_version",
  "CREATE INDEX IF NOT EXISTS idx_sessions_lease",
];

const missingMigration = requiredMigrationSnippets.filter((snippet) => !migration.includes(snippet));
if (missingMigration.length > 0) {
  throw new Error(`${migrationPath} is missing required SQL term(s): ${missingMigration.join(", ")}`);
}

if (/MapRoom/i.test(migration)) {
  throw new Error(`${migrationPath} must not couple persistent character data to MapRoom heat state`);
}

console.log("Cloud persistence schema check OK: D1 tables, DO locks, migration SQL, SAAC compatibility, and migration path are documented.");
