import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(relPath) {
  return fs.readFileSync(path.join(appRoot, relPath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function parseJsonc(text) {
  return JSON.parse(
    text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1")
      .replace(/,\s*([}\]])/g, "$1")
  );
}

function includesAll(text, needles, label) {
  for (const needle of needles) {
    assert(text.includes(needle), `${label} missing ${needle}`);
  }
}

const wrangler = parseJsonc(read("wrangler.jsonc"));
const worker = read("src/worker.js");
const app = read("public/assets/app.js");
const pkg = JSON.parse(read("package.json"));

const mapRoomMatch = worker.match(/export class MapRoom[\s\S]*?\nexport default\s+\{/);
const mapRoomSource = mapRoomMatch ? mapRoomMatch[0] : "";

const bindings = wrangler.durable_objects?.bindings || [];
assert(
  bindings.some((binding) => binding.name === "MAP_ROOMS" && binding.class_name === "MapRoom"),
  "wrangler.jsonc must bind MAP_ROOMS to MapRoom"
);
assert(
  (wrangler.migrations || []).some((migration) => (migration.new_sqlite_classes || []).includes("MapRoom")),
  "wrangler.jsonc must declare a MapRoom Durable Object migration"
);

includesAll(worker, [
  "export class MapRoom",
  "new WebSocketPair",
  "handleMapRoomSocket",
  'url.pathname.startsWith("/api/realtime/map/")',
  "env.MAP_ROOMS.idFromName",
  "sanitizeRealtimePlayer",
  "stripRealtimePrivateFields",
  "REALTIME_PRESENCE_TTL_MS"
], "src/worker.js realtime server");

includesAll(mapRoomSource, [
  'message.type === "join"',
  'message.type === "ping"',
  'message.type === "chat"',
  'type: "hello"',
  'type: "snapshot"',
  'type: "leave"',
  "this.sessions",
  "this.players"
], "MapRoom");

assert(/message\.type\s*!==\s*"join"\s*&&\s*message\.type\s*!==\s*"move"/.test(mapRoomSource) || /message\.type\s*===\s*"move"/.test(mapRoomSource), "MapRoom must accept move messages");
assert(/type:\s*message\.type\s*===\s*"join"\s*\?\s*"presence"\s*:\s*"move"/.test(mapRoomSource) || mapRoomSource.includes('type: "presence"'), "MapRoom must broadcast join presence and move updates");
assert(!/state\.storage|this\.state\.storage/.test(mapRoomSource), "MapRoom MVP must keep presence heat-state out of DO storage");

includesAll(app, [
  "syncRealtimeRoom",
  "openRealtimeSocket",
  "sendRealtimePresence",
  "handleRealtimeMessage",
  "collectRemotePlayerSprites",
  "redrawRealtimePeers",
  "drawSpriteLabel",
  'new WebSocket(url.toString())',
  'new URL(`/api/realtime/map/${encodeURIComponent(mapId)}`',
  'JSON.stringify({ type: "ping"',
  'JSON.stringify({ type, player })',
  'message.type === "snapshot"',
  'message.type === "presence"',
  'message.type === "move"',
  'message.type === "leave"',
  'message.type === "chat"'
], "public/assets/app.js realtime client");

assert(
  (app.match(/syncRealtimeRoom\(\{ force: true \}\)/g) || []).length >= 2,
  "movement and facing changes should force realtime presence updates"
);
assert(app.includes('window.addEventListener("pagehide"') && app.includes('window.addEventListener("pageshow"'), "page lifecycle should close and restore realtime sockets");
assert(pkg.scripts?.["check:realtime"] === "node scripts/check-realtime-room.mjs", "package.json must expose check:realtime");
assert(pkg.scripts?.check?.includes("npm run check:realtime"), "npm run check must include check:realtime");

if (failures.length) {
  console.error("Realtime room check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Realtime room check OK: Durable Object binding, Worker room, and browser presence path are wired.");
