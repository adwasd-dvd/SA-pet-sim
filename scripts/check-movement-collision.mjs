import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import worker from "../src/worker.js";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(appRoot, "public");

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      const file = path.join(publicRoot, decodeURIComponent(url.pathname));
      if (!file.startsWith(publicRoot) || !existsSync(file)) {
        return new Response("not found", { status: 404 });
      }
      return new Response(readFileSync(file));
    }
  }
};

const api = async (pathName, body) => {
  const response = await worker.fetch(new Request(`http://local.test${pathName}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }), env);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `API failed: ${pathName}`);
  return data;
};

let game = await api("/api/game/new", { name: "collision-test" });
const start = { ...game.location };
let route = await api("/api/game/route", { game, targetX: start.x + 3, targetY: start.y + 3 });
assertEqual(route.blocked, false, "open route is reachable");
assertEqual(route.route.length, 3, "open diagonal route length");

route = await api("/api/game/route", { game, targetX: start.x - 1, targetY: start.y - 1 });
assertEqual(route.blocked, true, "blocked target route is rejected");

game = await api("/api/game/walk", { game, dx: -1, dy: -1 });
assertEqual(game.location.x, start.x, "blocked terrain keeps x");
assertEqual(game.location.y, start.y, "blocked terrain keeps y");
assertLog(game, "被地形或 NPC 挡住");

game = await api("/api/game/walk", { game, dx: 1, dy: 1 });
assertEqual(game.location.x, start.x + 1, "open terrain advances x");
assertEqual(game.location.y, start.y + 1, "open terrain advances y");

game.location = { ...game.location, x: 41, y: 72 };
game = await api("/api/game/walk", { game, dx: 1, dy: 0 });
assertEqual(game.location.x, 41, "NPC collision keeps x");
assertEqual(game.location.y, 72, "NPC collision keeps y");

const exactExit = WORLD.maps["1000"].exits
  .find((exit) => exit.to === "100" && exit.tiles?.some((tile) => tile.x === 49 && tile.y === 116));
if (!exactExit) throw new Error("missing exact mapwarp fixture");

route = await api("/api/game/route", {
  game: { ...game, location: { mapId: "1000", x: 48, y: 116 } },
  targetX: 49,
  targetY: 116
});
assertEqual(route.blocked, false, "route can target exact warp tile");
assertEqual(route.route.length, 1, "route reaches adjacent exact warp tile");

game.location = { mapId: "1000", x: 48, y: 116 };
game = await api("/api/game/walk", { game, dx: 1, dy: 0 });
assertEqual(game.location.mapId, "100", "stepping onto mapwarp changes floor");
assertEqual(game.location.x, 637, "mapwarp uses exact source tile target x");
assertEqual(game.location.y, 491, "mapwarp uses exact source tile target y");
assertEqual(game.lastWarp.sourceTile.x, 49, "lastWarp records source tile x");
assertEqual(game.lastWarp.sourceTile.y, 116, "lastWarp records source tile y");
assert(game.save.info.includes("LAST_WARP=100,637,491"), "saac-like save info records last mapwarp");

console.log("Movement collision OK: routing, blocked terrain, NPC cells, and exact mapwarp tiles are enforced.");

function assert(value, label) {
  if (!value) throw new Error(label);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

function assertLog(state, text) {
  if (!state.log.some((line) => line.includes(text))) {
    throw new Error(`missing log text: ${text}`);
  }
}
