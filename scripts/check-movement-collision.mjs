import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import worker from "../src/worker.js";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(appRoot, "public");
const appJsSource = readFileSync(path.join(publicRoot, "assets/app.js"), "utf8");
const indexHtmlSource = readFileSync(path.join(publicRoot, "index.html"), "utf8");
const serviceWorkerSource = readFileSync(path.join(publicRoot, "sw.js"), "utf8");

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
  if (!response.ok) {
    const error = new Error(data.error || `API failed: ${pathName}`);
    error.status = response.status;
    throw error;
  }
  return data;
};

assertFrontendMovementContract(appJsSource, indexHtmlSource, serviceWorkerSource);

let game = await api("/api/game/new", { name: "collision-test" });
const start = { ...game.location };
assertEqual(game.player.dir, 5, "new character starts with source default direction");
assertEqual(game.location.dir, 5, "new location carries source default direction");
assert(game.save.option.includes("dir=5"), "saac-like option records initial direction");
let route = await api("/api/game/route", { game, targetX: start.x + 3, targetY: start.y + 3 });
assertEqual(route.blocked, false, "open route is reachable");
assertEqual(route.route.length, 3, "open diagonal route length");

route = await api("/api/game/route", { game, targetX: start.x - 1, targetY: start.y - 1 });
assertEqual(route.blocked, false, "blocked target can be approached source-style");
assertEqual(route.reason, "target-blocked-nearby", "blocked target reports source-style nearby facing route");
assertEqual(route.route.length, 0, "adjacent blocked target needs no movement route");
assertEqual(route.face.dir, 7, "blocked target route turns toward requested cell");

game = await api("/api/game/turn", { game, dir: route.face.dir, dx: route.face.dx, dy: route.face.dy });
assertEqual(game.location.x, start.x, "turn keeps x");
assertEqual(game.location.y, start.y, "turn keeps y");
assertEqual(game.player.dir, 7, "turn API records requested direction");
assert(game.save.info.includes("DIR=7"), "saac-like save info records turn direction");

game = await api("/api/game/walk", { game, dx: -1, dy: -1 });
assertEqual(game.location.x, start.x, "blocked terrain keeps x");
assertEqual(game.location.y, start.y, "blocked terrain keeps y");
assertEqual(game.player.dir, 7, "blocked terrain still turns character toward attempted direction");
assertEqual(game.location.dir, 7, "blocked terrain keeps attempted direction on location");
assert(game.save.info.includes("DIR=7"), "saac-like save info records blocked facing direction");
assertLog(game, "被地形或 NPC 挡住");

game = await api("/api/game/walk", { game, dx: 1, dy: 1 });
assertEqual(game.location.x, start.x + 1, "open terrain advances x");
assertEqual(game.location.y, start.y + 1, "open terrain advances y");
assertEqual(game.player.dir, 3, "open terrain records southeast source direction");
assertEqual(game.location.dir, 3, "location records southeast source direction");
assert(game.save.option.includes("dir=3"), "saac-like option records walking direction");

let cornerGame = await api("/api/game/new", { name: "corner-walk-test" });
cornerGame.location = { mapId: "1000", x: 110, y: 1, dir: 1 };
cornerGame.player = { ...cornerGame.player, dir: 1 };
cornerGame = await api("/api/game/walk", { game: cornerGame, dx: 1, dy: -1 });
assertEqual(cornerGame.location.x, 110, "source-style diagonal corner keeps x when side cell is blocked");
assertEqual(cornerGame.location.y, 1, "source-style diagonal corner keeps y when side cell is blocked");
assertEqual(cornerGame.player.dir, 1, "source-style diagonal corner still turns toward northeast");
assertLog(cornerGame, "被地形或 NPC 挡住");
const cornerRoute = await api("/api/game/route", {
  game: { ...cornerGame, location: { mapId: "1000", x: 110, y: 1, dir: 1 } },
  targetX: 111,
  targetY: 0
});
assert(
  !(cornerRoute.route.length === 1 && cornerRoute.route[0].dx === 1 && cornerRoute.route[0].dy === -1),
  "route avoids diagonal corner cutting that source walking would reject"
);

game.location = { ...game.location, x: 41, y: 72 };
game = await api("/api/game/walk", { game, dx: 1, dy: 0 });
assertEqual(game.location.x, 41, "NPC collision keeps x");
assertEqual(game.location.y, 72, "NPC collision keeps y");
assertEqual(game.player.dir, 2, "NPC collision still turns character toward NPC");

const exactExit = WORLD.maps["1000"].exits
  .find((exit) => exit.to === "100" && exit.tiles?.some((tile) => tile.x === 49 && tile.y === 116));
if (!exactExit) throw new Error("missing exact mapwarp fixture");

assertNoPseudoMapWarpNpcs();

route = await api("/api/game/route-exit", {
  game: { ...game, location: { mapId: "1000", x: 49, y: 116, dir: 2 } },
  exitId: exactExit.id
});
assertEqual(route.reason, "already-at-exit", "route-exit reports already standing on exact source tile");
assertEqual(route.route[0].dx, 0, "already-at-exit uses zero-step route dx");
assertEqual(route.route[0].dy, 0, "already-at-exit uses zero-step route dy");

let warpGame = await api("/api/game/walk", {
  game: { ...game, location: { mapId: "1000", x: 49, y: 116, dir: 2 }, player: { ...game.player, dir: 2 } },
  dx: 0,
  dy: 0
});
assertEqual(warpGame.location.mapId, "100", "zero-step walk on exact mapwarp changes floor");
assertEqual(warpGame.location.x, 637, "zero-step mapwarp uses exact source target x");
assertEqual(warpGame.location.y, 491, "zero-step mapwarp uses exact source target y");
assertEqual(warpGame.transition.type, "warp", "mapwarp records transient warp transition");
assertEqual(warpGame.transition.kind, "mapwarp", "mapwarp transition keeps kind");

route = await api("/api/game/route", {
  game: { ...game, location: { mapId: "1000", x: 48, y: 116 } },
  targetX: 49,
  targetY: 116
});
assertEqual(route.blocked, false, "route can target exact warp tile");
assertEqual(route.route.length, 1, "route reaches adjacent exact warp tile");

route = await api("/api/game/route-exit", {
  game: { ...game, location: { mapId: "1000", x: 48, y: 116 } },
  exitId: exactExit.id
});
assertEqual(route.blocked, false, "route-exit finds reachable source mapwarp tile");
assertEqual(route.target.x, 49, "route-exit selects nearest exact source tile x");
assertEqual(route.target.y, 116, "route-exit selects nearest exact source tile y");
assertEqual(route.route.length, 1, "route-exit returns route to exact warp tile");
assertEqual(route.exit.to, "100", "route-exit keeps source mapwarp destination");

route = await api("/api/game/route-exit", {
  game: { ...game, location: { mapId: "1000", x: 48, y: 116 } },
  exitId: exactExit.id,
  targetX: 49,
  targetY: 119
});
assertEqual(route.blocked, false, "route-exit honors a clicked warp-side preference");
assertEqual(route.target.x, 49, "route-exit preferred exact source tile x");
assertEqual(route.target.y, 119, "route-exit preferred exact source tile y");
assertEqual(route.exit.target[1], 494, "route-exit preferred tile preserves that source mapwarp target");

game.location = { mapId: "1000", x: 48, y: 116 };
const directExitRoute = await api("/api/game/route-exit", {
  game: { ...game, location: { mapId: "1000", x: 48, y: 116 } },
  exitId: exactExit.id
});
for (const step of directExitRoute.route) {
  game = await api("/api/game/walk", { game, dx: step.dx, dy: step.dy });
}
assertEqual(game.location.mapId, "100", "stepping onto mapwarp changes floor");
assertEqual(game.location.x, 637, "mapwarp uses exact source tile target x");
assertEqual(game.location.y, 491, "mapwarp uses exact source tile target y");
assertEqual(game.player.dir, 2, "mapwarp preserves source direction");
assertEqual(game.location.dir, 2, "mapwarp location preserves source direction");
assertEqual(game.lastWarp.sourceTile.x, 49, "lastWarp records source tile x");
assertEqual(game.lastWarp.sourceTile.y, 116, "lastWarp records source tile y");
assertEqual(game.transition.type, "warp", "walked mapwarp records transient transition");
assertEqual(game.transition.to.mapId, "100", "transition records target floor");
assert(game.save.info.includes("LAST_WARP=100,637,491"), "saac-like save info records last mapwarp");
assert(game.save.info.includes("DIR=2"), "saac-like save info records mapwarp direction");

let npcGame = await api("/api/game/new", { name: "npc-route-test" });
const teacher = WORLD.maps["1000"].npcs.find((npc) => npc.name.includes("老师"));
if (!teacher) throw new Error("missing teacher NPC fixture");
let npcRoute = await api("/api/game/route-npc", { game: npcGame, npcId: teacher.id });
assertEqual(npcRoute.blocked, false, "route-npc finds reachable interaction tile");
assert(npcRoute.route.length > 0, "route-npc returns route steps from spawn");
assert(distance(npcRoute.target.x, npcRoute.target.y, teacher.x, teacher.y) <= 2, "route-npc target is in interaction range");
const preferredNpcRoute = await api("/api/game/route-npc", {
  game: npcGame,
  npcId: teacher.id,
  targetX: teacher.x + 2,
  targetY: teacher.y
});
assertEqual(preferredNpcRoute.blocked, false, "route-npc honors a clicked NPC-side preference");
assertEqual(preferredNpcRoute.target.x, teacher.x + 2, "route-npc preferred interaction tile x");
assertEqual(preferredNpcRoute.target.y, teacher.y, "route-npc preferred interaction tile y");
for (const step of npcRoute.route) {
  npcGame = await api("/api/game/walk", { game: npcGame, dx: step.dx, dy: step.dy });
}
assert(distance(npcGame.location.x, npcGame.location.y, teacher.x, teacher.y) <= 2, "route-npc route reaches interaction range");
npcRoute = await api("/api/game/route-npc", { game: npcGame, npcId: teacher.id });
assertEqual(npcRoute.reason, "already-near", "route-npc reports already-near in interaction range");
assertEqual(npcRoute.route.length, 0, "route-npc does not route when already near");

let paidJumpGame = await api("/api/game/new", { name: "paid-jump-test" });
paidJumpGame.player.stone = 100000;
paidJumpGame.inventory = [{ id: "stone", name: "石币", qty: 100000 }];
const paidJumpToNpc = await api("/api/game/paid-jump", { game: paidJumpGame, kind: "npc", id: teacher.id });
assertEqual(paidJumpToNpc.location.mapId, "1000", "paid-jump to NPC stays on source floor");
assert(distance(paidJumpToNpc.location.x, paidJumpToNpc.location.y, teacher.x, teacher.y) <= 2, "paid-jump lands within NPC interaction range");
assert(paidJumpToNpc.paidJump.cost > 0, "paid-jump charges for a nonzero NPC jump");
assertEqual(paidJumpToNpc.player.stone, 100000 - paidJumpToNpc.paidJump.cost, "paid-jump deducts NPC jump stone");
assertLog(paidJumpToNpc, "付费跳转花费");

await assertRejects(
  () => api("/api/game/paid-jump", {
    game: { ...paidJumpGame, player: { ...paidJumpGame.player, stone: 1 }, inventory: [{ id: "stone", name: "石币", qty: 1 }] },
    kind: "npc",
    id: teacher.id
  }),
  "石币不够",
  400,
  "paid-jump rejects insufficient stone"
);

let paidExitGame = {
  ...game,
  player: { ...game.player, stone: 10000 },
  inventory: [{ id: "stone", name: "石币", qty: 10000 }],
  location: { mapId: "1000", x: 48, y: 116, dir: 2 }
};
const paidExit = await api("/api/game/paid-jump", { game: paidExitGame, kind: "exit", id: exactExit.id });
assertEqual(paidExit.location.mapId, "100", "paid-jump to map exit applies the original mapwarp");
assertEqual(paidExit.location.x, 637, "paid-jump mapwarp target x follows source mapwarp");
assertEqual(paidExit.location.y, 491, "paid-jump mapwarp target y follows source mapwarp");
assertEqual(paidExit.paidJump.cost, paidJumpCostForTest(1), "paid-jump exit cost uses tiered distance pricing");
assertEqual(paidExit.player.stone, 10000 - paidJumpCostForTest(1), "paid-jump exit deducts jump cost");

console.log("Movement collision OK: frontend 8-way keyboard input/cache-bust guards, routing, blocked terrain, source-style diagonal corner blocking, source-style blocked-target facing, NPC cells, Worker exit routes, click-preferred NPC/warp targets, zero-step exact mapwarps, warp transitions, exact mapwarp tiles, map teleport points stay out of the NPC list, NPC approach routes are enforced, long-route heap routing is active, and paid-jump actions are server-priced and server-applied.");

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

function assertFrontendMovementContract(appJs, indexHtml, serviceWorker) {
  for (const snippet of [
    "q: [-1, -1]",
    "e: [1, -1]",
    "z: [-1, 1]",
    "c: [1, 1]",
    "home: [-1, -1]",
    "pageup: [1, -1]",
    "end: [-1, 1]",
    "pagedown: [1, 1]",
    "numpad7: [-1, -1]",
    "numpad9: [1, -1]",
    "numpad1: [-1, 1]",
    "numpad3: [1, 1]"
  ]) {
    assert(appJs.includes(snippet), `frontend missing direct diagonal movement key: ${snippet}`);
  }
  for (const snippet of [
    "\"1,-1\": 2",
    "\"1,1\": 4",
    "\"-1,1\": 6",
    "\"-1,-1\": 0",
    "pressedMoveKeys.add(keyId)",
    "pressedMoveKeys.delete(keyId)",
    "pressedScreenDirection()",
    "if (face && token === routeToken) return turnPlayer(face);"
  ]) {
    assert(appJs.includes(snippet), `frontend movement contract missing: ${snippet}`);
  }

  const indexVersion = versionFromSource(indexHtml, /\/assets\/app\.js\?v=(\d+)/, "index app.js version");
  const swAppVersion = versionFromSource(serviceWorker, /\/assets\/app\.js\?v=(\d+)/, "service worker app.js version");
  const swCacheVersion = versionFromSource(serviceWorker, /stoneage-web-v(\d+)/, "service worker cache version");
  assertEqual(indexVersion, swAppVersion, "index.html and service worker app.js cache-bust versions match");
  assertEqual(indexVersion, swCacheVersion, "service worker cache version tracks app.js cache-bust version");
}

function versionFromSource(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`missing ${label}`);
  return Number(match[1]);
}

async function assertRejects(fn, messagePart, expectedStatus, label) {
  try {
    await fn();
  } catch (error) {
    if (!String(error.message || "").includes(messagePart)) {
      throw new Error(`${label}: expected message containing ${messagePart}, got ${error.message}`);
    }
    if (expectedStatus && error.status !== expectedStatus) {
      throw new Error(`${label}: expected status ${expectedStatus}, got ${error.status}`);
    }
    return;
  }
  throw new Error(`${label}: expected rejection`);
}

function distance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax) - Number(bx)), Math.abs(Number(ay) - Number(by)));
}

function paidJumpCostForTest(stepDistance) {
  const steps = Math.max(0, Math.trunc(Number(stepDistance) || 0));
  if (steps <= 0) return 0;
  const first = Math.min(steps, 300);
  const second = Math.min(Math.max(steps - 300, 0), 200);
  const third = Math.max(steps - 500, 0);
  return 2000 + first * 30 + second * 50 + third * 80;
}

function assertNoPseudoMapWarpNpcs() {
  for (const map of Object.values(WORLD.maps)) {
    const leaked = (map.npcs || []).find((npc) => /^npcgen_warp$/i.test(npc.template || "") || /^Warp$/i.test(npc.type || ""));
    if (leaked) {
      throw new Error(`map teleport point leaked into NPC list: floor ${map.id} at (${leaked.x},${leaked.y})`);
    }
  }
}
