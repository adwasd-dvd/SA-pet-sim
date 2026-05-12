import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import worker from "../src/worker.js";

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

console.log("Movement collision OK: blocked terrain, open movement, and NPC cells are enforced.");

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
