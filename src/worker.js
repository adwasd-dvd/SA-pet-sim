import { WORLD } from "./world-data.js";

const DATA_FILES = {
  enemy: "/data/enemy1.txt",
  enemyBase: "/data/enemybase2.txt",
  skills: "/data/petskill2.txt",
  searchable: [
    ["宠物", "/data/enemybase2.txt"],
    ["道具", "/data/itemset6.txt"],
    ["地图", "/data/mapset.txt"],
    ["传送", "/data/mapwarp.txt"],
    ["NPC外观", "/data/npc-look.txt"],
    ["遇敌", "/data/encount.txt"],
    ["敌人", "/data/enemy1.txt"],
    ["可捕获排行", "/data/obtainable_140_attr_net_rank_v2.csv"]
  ]
};

const GMSV_DATA_SOURCE = "gmsv-data";
const CHAR_MAXUPLEVEL = 140;
const SAVE_SCHEMA = "saac-pwa-v1";
const MAXCHAR_PER_USER = 4;
const INVENTORY_CAPACITY = 15;
const CG_INVISIBLE = 99;
const MAP_BLOCKED = 1;
const MAP_SPECIAL = 2;
const EVENT_NPC = 1;
const NPC_INTERACTION_RANGE = 2;
const NPC_WINDOW_ACTION_RANGE = 3;
const ROUTE_MAX_STEPS = 160;
const ROUTE_MAX_VISITS = 12000;
const DEFAULT_CHAR_DIR = 5;
const SAFE_WILD_ENCOUNTER_MAP_RE = /村|庄园|店|医院|道场|柜台|商店|房屋|之家|的家|宠物店|肉店|武器店|防具店|便利/i;
const SA_DIRECTION_DELTAS = Object.freeze([
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]);
const NPC_VM_ACTIONS = new Set([
  "say",
  "window",
  "shop",
  "warp",
  "heal",
  "save",
  "give",
  "take",
  "setFlag",
  "effect",
  "startBattle",
  "battleAction",
  "quest",
  "debug"
]);
const rankTab = [
  [450, 500],
  [470, 520],
  [490, 540],
  [510, 560],
  [530, 580],
  [550, 600]
];

let cache;
let charId = 0;
let tileMetaPromise = null;
const collisionCache = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }
    return env.ASSETS.fetch(request);
  }
};

async function handleApi(request, env, url) {
  try {
    if (request.method === "OPTIONS") return json({});
    if (url.pathname === "/api/data/search" && request.method === "POST") {
      const body = await readJson(request);
      return json(await searchData(env, request, String(body.q || "").trim()));
    }
    if (url.pathname === "/api/game/new" && request.method === "POST") {
      const body = await readJson(request);
      return json(await createPlayerGame(env, request, body));
    }
    if (url.pathname === "/api/game/sync" && request.method === "POST") {
      const body = await readJson(request);
      return json(withMap(normalizeGame(body.game)));
    }
    if (url.pathname === "/api/game/travel" && request.method === "POST") {
      const body = await readJson(request);
      return json(travelGame(body.game, String(body.to || "")));
    }
    if (url.pathname === "/api/game/walk" && request.method === "POST") {
      const body = await readJson(request);
      return json(await walkGame(env, request, body.game, Number(body.dx) || 0, Number(body.dy) || 0));
    }
    if (url.pathname === "/api/game/turn" && request.method === "POST") {
      const body = await readJson(request);
      return json(turnGame(body.game, body));
    }
    if (url.pathname === "/api/game/route" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeGame(env, request, body.game, Number(body.targetX), Number(body.targetY)));
    }
    if (url.pathname === "/api/game/route-npc" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeNpcGame(env, request, body.game, String(body.npcId || "")));
    }
    if (url.pathname === "/api/game/route-exit" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeExitGame(env, request, body.game, String(body.exitId || "")));
    }
    if (url.pathname === "/api/game/talk" && request.method === "POST") {
      const body = await readJson(request);
      return json(talkGame(body.game, String(body.npcId || "")));
    }
    if (url.pathname === "/api/game/dialog" && request.method === "POST") {
      const body = await readJson(request);
      return json(await dialogGame(env, request, body.game, String(body.npcId || ""), String(body.message || "")));
    }
    if (url.pathname === "/api/game/buy" && request.method === "POST") {
      const body = await readJson(request);
      return json(buyGame(body.game, String(body.npcId || ""), Number(body.itemId)));
    }
    if (url.pathname === "/api/game/use-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(useItemGame(body.game, Number(body.itemId)));
    }
    if (url.pathname === "/api/game/encounter" && request.method === "POST") {
      const body = await readJson(request);
      return json(await encounterGame(env, request, body.game));
    }
    if (url.pathname === "/api/game/capture" && request.method === "POST") {
      const body = await readJson(request);
      return json(captureGame(body.game));
    }
    if (url.pathname === "/api/game/battle" && request.method === "POST") {
      const body = await readJson(request);
      return json(battleGame(body.game, String(body.action || "attack")));
    }
    if (url.pathname === "/api/game/train" && request.method === "POST") {
      const body = await readJson(request);
      return json(trainGame(body.game, Number(body.petIndex) || 0));
    }
    if (url.pathname === "/api/game/rest" && request.method === "POST") {
      const body = await readJson(request);
      return json(restGame(body.game));
    }
    if (url.pathname === "/api/ai/guide" && request.method === "POST") {
      const body = await readJson(request);
      return json(await guideGame(env, request, body.game, String(body.prompt || "")));
    }
    return json({ error: "not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "server error" }, 500);
  }
}

async function createPlayerGame(env, request, body) {
  const data = await loadGameData(env, request);
  const starter = createEnemy(data, Number(body.starterPet) || 100, 1) || createEnemy(data, pick(data.enemyNoList), 1);
  const name = String(body.name || "").trim().slice(0, 12) || "新来的原始人";
  const now = new Date().toISOString();
  const accountId = cleanAccountId(body.accountId) || `local-${crypto.randomUUID().slice(0, 8)}`;
  return withMap({
    id: crypto.randomUUID(),
    account: {
      id: accountId,
      name: "本地账号",
      activeSlot: 0,
      maxSlots: MAXCHAR_PER_USER,
      lock: null,
      source: "参考 SAAC char.c: id.slot.char"
    },
    character: {
      id: crypto.randomUUID(),
      slot: 0,
      name,
      createdAt: now,
      updatedAt: now,
      deleted: false
    },
    player: {
      name,
      level: 1,
      exp: 0,
      stone: 100,
      hp: 100,
      maxHp: 100,
      dir: DEFAULT_CHAR_DIR
    },
    location: {
      mapId: WORLD.startMap,
      x: WORLD.maps[WORLD.startMap].spawn[0],
      y: WORLD.maps[WORLD.startMap].spawn[1],
      dir: DEFAULT_CHAR_DIR
    },
    pets: [starter],
    inventory: [{ id: "stone", name: "石币", qty: 100 }],
    quests: {},
    flags: createFlags(),
    effects: {},
    dialogAi: {},
    encounter: null,
    dialog: null,
    log: [`${name} 来到了 ${WORLD.maps[WORLD.startMap].name}。`]
  });
}

function travelGame(game, to) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const exit = findExit(map, to);
  if (!exit) throw new Error("这个出口不存在");
  return applyExit(game, exit);
}

function normalizeDir(dir) {
  const n = Number(dir);
  if (!Number.isFinite(n)) return DEFAULT_CHAR_DIR;
  const int = Math.trunc(n);
  return int >= 0 && int < SA_DIRECTION_DELTAS.length ? int : DEFAULT_CHAR_DIR;
}

function dirFromDelta(dx, dy, fallback = DEFAULT_CHAR_DIR) {
  const sx = Math.sign(Number(dx) || 0);
  const sy = Math.sign(Number(dy) || 0);
  const dir = SA_DIRECTION_DELTAS.findIndex(([x, y]) => x === sx && y === sy);
  return dir >= 0 ? dir : normalizeDir(fallback);
}

function deltaForDir(dir) {
  const [dx, dy] = SA_DIRECTION_DELTAS[normalizeDir(dir)];
  return { dx, dy };
}

function setCharacterDir(game, dir) {
  const next = normalizeDir(dir);
  game.player ||= {};
  game.location ||= {};
  game.player.dir = next;
  game.location.dir = next;
  return next;
}

async function walkGame(env, request, game, dx, dy) {
  game = normalizeGame(game);
  const map = currentMap(game);
  if (game.encounter) {
    const activePet = game.pets?.[0];
    if (activePet) ensureBattleState(game, activePet, game.encounter);
    return withMap(game);
  }
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const requestedDx = Math.sign(Number(dx) || 0);
  const requestedDy = Math.sign(Number(dy) || 0);
  if (requestedDx === 0 && requestedDy === 0) {
    const currentExit = exitAt(map, game.location.x, game.location.y);
    if (currentExit) return applyExit(game, currentExit);
    noteNearby(game, map);
    return withMap(game);
  }
  const dir = dirFromDelta(dx, dy, game.player?.dir ?? game.location?.dir);
  const delta = deltaForDir(dir);
  setCharacterDir(game, dir);
  const nextX = clampInt(Number(game.location.x || 0) + delta.dx, 0, width - 1, game.location.x);
  const nextY = clampInt(Number(game.location.y || 0) + delta.dy, 0, height - 1, game.location.y);
  const exit = exitAt(map, nextX, nextY);
  if (!exit && (await blocksMove(env, request, map, nextX, nextY))) {
    noteBlockedMove(game, map, nextX, nextY);
    noteNearby(game, map);
    return withMap(game);
  }
  game.location = { ...game.location, x: nextX, y: nextY, dir };
  if (exit) return applyExit(game, exit);
  noteNearby(game, map);
  await maybeStepEncounter(env, request, game, map);
  return withMap(game);
}

function turnGame(game, body = {}) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const fallback = game.player?.dir ?? game.location?.dir;
  const hasExplicitDir = body.dir !== undefined && body.dir !== null && Number.isFinite(Number(body.dir));
  const dir = hasExplicitDir
    ? normalizeDir(Number(body.dir))
    : dirFromDelta(Number(body.dx) || 0, Number(body.dy) || 0, fallback);
  setCharacterDir(game, dir);
  noteNearby(game, map);
  return withMap(game);
}

async function routeGame(env, request, game, targetX, targetY) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  const target = {
    x: clampInt(targetX, 0, width - 1, from.x),
    y: clampInt(targetY, 0, height - 1, from.y)
  };
  if (from.x === target.x && from.y === target.y) {
    return { from, target, route: [], blocked: false, reason: "already-there" };
  }
  if (!canStandAt(map, collision, target.x, target.y)) {
    const approach = findBlockedTargetApproach(map, collision, from, target);
    if (approach) {
      return {
        from,
        target,
        standTarget: approach.target,
        face: faceTargetFrom(approach.target, target),
        route: approach.route,
        blocked: false,
        reason: "target-blocked-nearby"
      };
    }
    return { from, target, route: [], blocked: true, reason: "target-blocked" };
  }
  const route = findRoute(map, collision, from, target);
  return {
    from,
    target,
    route,
    blocked: route.length === 0,
    reason: route.length ? "ok" : "unreachable"
  };
}

function findBlockedTargetApproach(map, collision, from, target) {
  const candidates = [];
  const maxRadius = 3;
  for (let y = target.y - maxRadius; y <= target.y + maxRadius; y += 1) {
    for (let x = target.x - maxRadius; x <= target.x + maxRadius; x += 1) {
      if (x === target.x && y === target.y) continue;
      if (!canStandAt(map, collision, x, y)) continue;
      candidates.push({
        x,
        y,
        targetDistance: distance(x, y, target.x, target.y),
        fromDistance: routeHeuristic(from.x, from.y, x, y)
      });
    }
  }
  candidates.sort((a, b) => (
    a.targetDistance - b.targetDistance
    || a.fromDistance - b.fromDistance
    || a.y - b.y
    || a.x - b.x
  ));
  for (const candidate of candidates) {
    if (candidate.x === from.x && candidate.y === from.y) {
      return { target: { x: candidate.x, y: candidate.y }, route: [] };
    }
    const route = findRoute(map, collision, from, candidate);
    if (route.length) return { target: { x: candidate.x, y: candidate.y }, route };
  }
  return null;
}

function faceTargetFrom(from, target) {
  const dir = dirFromDelta(target.x - from.x, target.y - from.y, DEFAULT_CHAR_DIR);
  const { dx, dy } = deltaForDir(dir);
  return { dir, dx, dy, x: target.x, y: target.y };
}

async function routeNpcGame(env, request, game, npcId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  if (distance(from.x, from.y, npc.x, npc.y) <= NPC_INTERACTION_RANGE) {
    return {
      from,
      target: from,
      route: [],
      blocked: false,
      reason: "already-near",
      npc: routeNpcSummary(npc)
    };
  }
  for (const target of npcApproachTargets(map, collision, npc, from)) {
    const route = findRoute(map, collision, from, target);
    if (route.length) {
      return {
        from,
        target,
        route,
        blocked: false,
        reason: "ok",
        npc: routeNpcSummary(npc)
      };
    }
  }
  return {
    from,
    target: null,
    route: [],
    blocked: true,
    reason: "unreachable-npc",
    npc: routeNpcSummary(npc)
  };
}

function npcApproachTargets(map, collision, npc, from) {
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const targets = [];
  const npcX = Number(npc.x);
  const npcY = Number(npc.y);
  for (let dy = -NPC_INTERACTION_RANGE; dy <= NPC_INTERACTION_RANGE; dy += 1) {
    for (let dx = -NPC_INTERACTION_RANGE; dx <= NPC_INTERACTION_RANGE; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const x = npcX + dx;
      const y = npcY + dy;
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const npcDistance = distance(x, y, npcX, npcY);
      if (npcDistance > NPC_INTERACTION_RANGE) continue;
      if (!canStandAt(map, collision, x, y)) continue;
      targets.push({
        x,
        y,
        npcDistance,
        distance: distance(from.x, from.y, x, y)
      });
    }
  }
  return targets.sort((a, b) => a.distance - b.distance || a.npcDistance - b.npcDistance || a.y - b.y || a.x - b.x);
}

function routeNpcSummary(npc) {
  return { id: npc.id, name: npc.name, x: npc.x, y: npc.y, type: npc.type };
}

async function routeExitGame(env, request, game, exitId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const exit = findExit(map, exitId);
  if (!exit) throw new Error("这个出口不在当前地图");
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  for (const target of exitRouteTargets(map, collision, exit, from)) {
    if (from.x === target.x && from.y === target.y) {
      return {
        from,
        target,
        route: [{ dx: 0, dy: 0, x: target.x, y: target.y }],
        blocked: false,
        reason: "already-at-exit",
        exit: routeExitSummary(exit, target)
      };
    }
    const route = findRoute(map, collision, from, target);
    if (route.length) {
      return {
        from,
        target,
        route,
        blocked: false,
        reason: "ok",
        exit: routeExitSummary(exit, target)
      };
    }
  }
  return {
    from,
    target: null,
    route: [],
    blocked: true,
    reason: "unreachable-exit",
    exit: routeExitSummary(exit)
  };
}

function exitRouteTargets(map, collision, exit, from) {
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const rawTiles = Array.isArray(exit.tiles) && exit.tiles.length
    ? exit.tiles
    : exitBoundsTiles(exit);
  const seen = new Set();
  return rawTiles
    .map((tile) => ({
      x: Number(tile.x),
      y: Number(tile.y),
      target: tile.target || exit.target,
      distance: distance(from.x, from.y, tile.x, tile.y)
    }))
    .filter((tile) => Number.isFinite(tile.x) && Number.isFinite(tile.y))
    .filter((tile) => tile.x >= 0 && tile.y >= 0 && tile.x < width && tile.y < height)
    .filter((tile) => {
      const key = routeKey(tile.x, tile.y);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter((tile) => canStandAt(map, collision, tile.x, tile.y))
    .sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x);
}

function exitBoundsTiles(exit) {
  const bounds = Array.isArray(exit.bounds) ? exit.bounds : [exit.x, exit.y, exit.x, exit.y];
  const minX = Math.min(Number(bounds[0]), Number(bounds[2]));
  const maxX = Math.max(Number(bounds[0]), Number(bounds[2]));
  const minY = Math.min(Number(bounds[1]), Number(bounds[3]));
  const maxY = Math.max(Number(bounds[1]), Number(bounds[3]));
  const tiles = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      tiles.push({ x, y, target: exit.target });
    }
  }
  return tiles;
}

function routeExitSummary(exit, target = null) {
  return {
    id: exit.id,
    label: exit.label,
    to: exit.to,
    x: target?.x ?? exit.x,
    y: target?.y ?? exit.y,
    target: target?.target || exit.target,
    source: exit.source
  };
}

function assertNpcInteractionRange(game, npc, range = NPC_INTERACTION_RANGE, action = "和 NPC 对话") {
  const currentDistance = distance(game.location.x, game.location.y, npc.x, npc.y);
  if (currentDistance <= range) return;
  throw new Error(`请先走近 ${npc.name} 再${action}。当前位置距离 ${currentDistance} 格，原版 NPC 交互需要靠近。`);
}

function findExit(map, id) {
  return map.exits.find((item) => item.id === id || item.to === id);
}

function exitAt(map, x, y) {
  for (const exit of map.exits) {
    const tile = (exit.tiles || []).find((item) => Number(item.x) === x && Number(item.y) === y);
    if (tile) {
      return {
        ...exit,
        x: tile.x,
        y: tile.y,
        target: tile.target,
        sourceTile: { x: tile.x, y: tile.y, target: tile.target }
      };
    }
    if (Array.isArray(exit.tiles) && exit.tiles.length) continue;
    const bounds = Array.isArray(exit.bounds) ? exit.bounds : [exit.x, exit.y, exit.x, exit.y];
    if (x >= bounds[0] && y >= bounds[1] && x <= bounds[2] && y <= bounds[3]) return exit;
  }
  return null;
}

async function blocksMove(env, request, map, x, y) {
  const collision = await loadCollisionMap(env, request, map);
  return !canStandAt(map, collision, x, y);
}

function noteBlockedMove(game, map, x, y) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  const key = `${map.id}:${x}:${y}`;
  if (game.walk.blockedKey === key) return;
  game.walk.blockedKey = key;
  addLog(game, `前方 (${x},${y}) 被地形或 NPC 挡住，无法通行。`);
}

async function loadCollisionMap(env, request, map) {
  const path = map.clientMapFile || map.mapFile;
  if (!path) return null;
  if (collisionCache.has(path)) return collisionCache.get(path);
  const [buf, tileMeta] = await Promise.all([
    assetBuffer(env, request, path),
    loadTileMeta(env, request)
  ]);
  const collision = map.clientMapFile
    ? buildClientDatCollision(buf, tileMeta, path)
    : buildLs2Collision(buf, tileMeta, path);
  collisionCache.set(path, collision);
  return collision;
}

async function loadTileMeta(env, request) {
  tileMetaPromise ||= assetJson(env, request, "/data/client-tiles/tiles.json");
  return tileMetaPromise;
}

function buildClientDatCollision(buf, tileMeta, source) {
  const view = new DataView(buf);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const layerSize = width * height * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.byteLength < expected) throw new Error(`invalid client map: ${source}`);
  return buildCollisionFromLayers(width, height, tileMeta, (index) => {
    const tileOffset = 8 + index * 2;
    const partsOffset = 8 + layerSize + index * 2;
    const eventOffset = 8 + layerSize * 2 + index * 2;
    return [
      view.getUint16(tileOffset, true),
      view.getUint16(partsOffset, true),
      view.getUint16(eventOffset, true)
    ];
  }, `${source} client DAT hitMap`);
}

function buildLs2Collision(buf, tileMeta, source) {
  const bytes = new Uint8Array(buf, 0, Math.min(6, buf.byteLength));
  const magic = String.fromCharCode(...bytes);
  if (magic !== "LS2MAP") throw new Error(`invalid LS2MAP: ${source}`);
  const view = new DataView(buf);
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
  const objectLayer = 44 + width * height * 2;
  return buildCollisionFromLayers(width, height, tileMeta, (index) => [
    view.getUint16(44 + index * 2, false),
    objectLayer + index * 2 + 1 < buf.byteLength ? view.getUint16(objectLayer + index * 2, false) : 0,
    0
  ], `${source} LS2MAP hitMap`);
}

function buildCollisionFromLayers(width, height, tileMeta, tileAt, source) {
  const hitMap = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const [ground, parts, event] = tileAt(index);
      applyGroundCollision(hitMap, width, height, x, y, ground, tileMeta);
      applyPartsCollision(hitMap, width, height, x, y, parts, tileMeta);
      if ((event & 0x0fff) === EVENT_NPC) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    }
  }
  return { width, height, hitMap, source };
}

function applyGroundCollision(hitMap, width, height, x, y, tileId, tileMeta) {
  if (tileId > CG_INVISIBLE) {
    const frame = tileMeta.frames?.[tileId];
    if (!frame) return;
    const hit = Number(frame.hit || 0);
    if (hit === 0) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    else if (hit === 2) markHit(hitMap, width, height, x, y, MAP_SPECIAL);
    return;
  }
  applyControlTileCollision(hitMap, width, height, x, y, tileId);
}

function applyPartsCollision(hitMap, width, height, x, y, tileId, tileMeta) {
  if (tileId > CG_INVISIBLE) {
    const frame = tileMeta.frames?.[tileId];
    if (!frame) return;
    const hit = Number(frame.hit || 0);
    const hitX = Math.max(1, Number(frame.hitX || 1));
    const hitY = Math.max(1, Number(frame.hitY || 1));
    if (hit === 0 || hit === 2) {
      for (let ky = 0; ky < hitY; ky += 1) {
        for (let kx = 0; kx < hitX; kx += 1) {
          markHit(hitMap, width, height, x + kx, y - ky, hit === 2 ? MAP_SPECIAL : MAP_BLOCKED);
        }
      }
    } else if (hit === 1 && tileId >= 15680 && tileId <= 15732) {
      markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    }
    return;
  }
  applyControlTileCollision(hitMap, width, height, x, y, tileId);
}

function applyControlTileCollision(hitMap, width, height, x, y, tileId) {
  if ([1, 2, 5, 6, 9, 10].includes(tileId)) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
  else if (tileId === 4) markHit(hitMap, width, height, x, y, MAP_SPECIAL);
}

function markHit(hitMap, width, height, x, y, value) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = y * width + x;
  if (value === MAP_SPECIAL) {
    hitMap[index] = MAP_SPECIAL;
  } else if (hitMap[index] !== MAP_SPECIAL) {
    hitMap[index] = MAP_BLOCKED;
  }
}

function canStandAt(map, collision, x, y) {
  if (!collision || x < 0 || y < 0 || x >= collision.width || y >= collision.height) return false;
  if (exitAt(map, x, y)) return true;
  if (map.npcs.some((npc) => Number(npc.x) === x && Number(npc.y) === y)) return false;
  return collision.hitMap[y * collision.width + x] !== MAP_BLOCKED;
}

function findRoute(map, collision, from, target) {
  const startKey = routeKey(from.x, from.y);
  const targetKey = routeKey(target.x, target.y);
  const open = [{
    x: from.x,
    y: from.y,
    key: startKey,
    g: 0,
    f: routeHeuristic(from.x, from.y, target.x, target.y)
  }];
  const best = new Map([[startKey, 0]]);
  const cameFrom = new Map();
  const moves = routeMoves();
  let visits = 0;

  while (open.length && visits < ROUTE_MAX_VISITS) {
    open.sort((a, b) => a.f - b.f || a.g - b.g);
    const current = open.shift();
    if (current.key === targetKey) return reconstructRoute(cameFrom, current.key);
    if (current.g >= ROUTE_MAX_STEPS) continue;
    visits += 1;

    for (const move of moves) {
      const nx = current.x + move.dx;
      const ny = current.y + move.dy;
      if (!canStandAt(map, collision, nx, ny)) continue;
      if (move.dx !== 0 && move.dy !== 0) {
        const sideA = canStandAt(map, collision, current.x + move.dx, current.y);
        const sideB = canStandAt(map, collision, current.x, current.y + move.dy);
        if (!sideA && !sideB) continue;
      }
      const key = routeKey(nx, ny);
      const nextG = current.g + 1;
      if (nextG >= (best.get(key) ?? Infinity)) continue;
      best.set(key, nextG);
      cameFrom.set(key, { prev: current.key, dx: move.dx, dy: move.dy, x: nx, y: ny });
      open.push({
        x: nx,
        y: ny,
        key,
        g: nextG,
        f: nextG + routeHeuristic(nx, ny, target.x, target.y)
      });
    }
  }
  return [];
}

function reconstructRoute(cameFrom, key) {
  const route = [];
  while (cameFrom.has(key)) {
    const step = cameFrom.get(key);
    route.push({ dx: step.dx, dy: step.dy, x: step.x, y: step.y });
    key = step.prev;
  }
  return route.reverse();
}

function routeMoves() {
  return SA_DIRECTION_DELTAS.map(([dx, dy]) => ({ dx, dy }));
}

function routeHeuristic(x, y, targetX, targetY) {
  return Math.max(Math.abs(targetX - x), Math.abs(targetY - y));
}

function routeKey(x, y) {
  return `${x},${y}`;
}

function noteNearby(game, map) {
  const nearby = nearbyState(game, map);
  const key = [
    game.location.mapId,
    game.location.x,
    game.location.y,
    nearby.npcs.map((npc) => npc.id).join(","),
    nearby.exits.map((exit) => exit.id).join(",")
  ].join(":");
  if (game.lastNearbyKey === key) return;
  game.lastNearbyKey = key;
  const parts = [];
  if (nearby.npcs.length) parts.push(`附近 NPC：${nearby.npcs.map((npc) => npc.name).join("、")}`);
  if (nearby.exits.length) parts.push(`附近出口：${nearby.exits.map((exit) => exit.label).join("、")}`);
  if (parts.length) addLog(game, parts.join("；"));
}

function applyExit(game, exit) {
  const from = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  const dir = normalizeDir(game.player?.dir ?? game.location?.dir);
  const now = new Date().toISOString();
  const to = { mapId: exit.to, x: exit.target[0], y: exit.target[1] };
  game.location = { ...to, dir };
  setCharacterDir(game, dir);
  game.encounter = null;
  game.battle = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  game.lastWarp = {
    kind: "mapwarp",
    exitId: exit.id,
    label: exit.label,
    from,
    sourceTile: exit.sourceTile || { x: exit.x, y: exit.y, target: exit.target },
    to,
    source: exit.source,
    warpedAt: now
  };
  game.transition = warpTransition("mapwarp", exit.label, from, to, exit.source, now);
  game.character ||= {};
  game.character.updatedAt = now;
  addLog(game, `你通过「${exit.label}」来到 ${WORLD.maps[exit.to].name}。`);
  updateQuestProgress(game, "enterMap", { mapId: exit.to });
  return withMap(game);
}

function applyWarpTarget(game, target, label) {
  const targetMap = WORLD.maps[String(target.mapId)];
  if (!targetMap) throw new Error("目标地图尚未加载");
  const from = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  const dir = normalizeDir(game.player?.dir ?? game.location?.dir);
  const now = new Date().toISOString();
  const width = Math.max(1, Number(targetMap.size?.[0]) || 1);
  const height = Math.max(1, Number(targetMap.size?.[1]) || 1);
  const x = clampInt(target.x, 0, width - 1, 0);
  const y = clampInt(target.y, 0, height - 1, 0);
  game.location = { mapId: targetMap.id, x, y, dir };
  setCharacterDir(game, dir);
  game.encounter = null;
  game.battle = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  game.lastWarp = {
    kind: "npc-warp",
    label,
    from,
    to: { mapId: targetMap.id, x, y },
    warpedAt: now
  };
  game.transition = warpTransition("npc-warp", label, from, game.lastWarp.to, target.source || "npc warp", now);
  game.character ||= {};
  game.character.updatedAt = game.lastWarp.warpedAt;
  addLog(game, `你通过「${label}」来到 ${targetMap.name} (${x},${y})。`);
  updateQuestProgress(game, "enterMap", { mapId: targetMap.id });
  return targetMap;
}

function warpTransition(kind, label, from, to, source, at) {
  return {
    id: `${kind}:${from.mapId},${from.x},${from.y}->${to.mapId},${to.x},${to.y}:${at}`,
    type: "warp",
    kind,
    label,
    from,
    to,
    source,
    at
  };
}

function buyGame(game, npcId, itemId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作 NPC 窗口");
  if (!npc.trade?.items?.length) throw new Error("这个 NPC 没有商品资料");
  const item = availableTradeItems(game, npc).find((entry) => Number(entry.id) === Number(itemId));
  if (!item) throw new Error("商品不存在");
  const sourcePrice = Number(item.price || item.cost || 0);
  const discount = shopDiscountForNpc(game, npc);
  const price = discountedShopPrice(game, npc, item);
  if (Number(game.player.stone || 0) < price) throw new Error("石币不够");
  if (!canCarryItem(game, item)) throw new Error(`背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具`);
  recordNpcVmEvent(game, npc, "shop", "ok", { action: "buy", itemId, itemName: item.name, price, sourcePrice, discountPercent: discount?.percent || 0 });
  if (price > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: price, reason: "buy" });
    if (!taken.ok) throw new Error(taken.error || "石币不够");
  }
  const given = runNpcVmAction(game, npc, { type: "give", item, itemId, itemName: item.name, qty: 1, reason: "buy" });
  if (!given.ok) throw new Error(given.error || "购买失败");
  const discountText = discount ? `（AI 协商 ${discount.percent}% 优待）` : "";
  addLog(game, `向 ${npc.name} 购买了 ${item.name}，花费 ${price} 石币${discountText}。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : []),
    npcMessage("system", `购买成功：${item.name} x1，花费 ${price} 石币${discountText}。`)
  ]);
  return withMap(game, { npc });
}

function useItemGame(game, itemId) {
  game = normalizeGame(game);
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");

  const itemUse = applyRecoveryItem(game, item);
  addLog(game, `使用 ${itemUse.itemName}，${itemUse.targetName} 的耐久力恢复 ${itemUse.restored}。`);
  return withMap(game, { itemUse });
}

function itemEffect(item) {
  const text = `${item.name || ""} ${item.description || ""}`;
  const revive = text.includes("复活") || text.includes("气绝");
  const hpMatch = text.match(/(?:耐久力|耐力|HP)\s*(\d+)/i) || text.match(/回复成耐力\s*(\d+)/);
  if (hpMatch) {
    return {
      usable: true,
      amount: Math.max(1, Number(hpMatch[1]) || 1),
      revive
    };
  }
  if (text.includes("小的肉")) return { usable: true, amount: 20, revive: false };
  if (text.includes("乾燥肉")) return { usable: true, amount: 35, revive: false };
  if (text.includes("大的肉")) return { usable: true, amount: 65, revive: false };
  if (text.includes("高级肉")) return { usable: true, amount: 80, revive: false };
  return { usable: false, amount: 0, revive: false };
}

function selectItemTarget(game, activePet, effect) {
  if (activePet) {
    activePet.WorkMaxHp ||= Math.max(1, Number(activePet.Hp || 1));
    if (!Number.isFinite(Number(activePet.Hp))) activePet.Hp = activePet.WorkMaxHp;
    if (effect.revive || Number(activePet.Hp || 0) < Number(activePet.WorkMaxHp || 1)) {
      return {
        name: activePet.Name,
        maxHp: activePet.WorkMaxHp,
        hpField: { owner: activePet, key: "Hp" }
      };
    }
  }
  if (Number(game.player.hp || 0) < Number(game.player.maxHp || 1)) {
    return {
      name: game.player.name,
      maxHp: game.player.maxHp,
      hpField: { owner: game.player, key: "hp" }
    };
  }
  return null;
}

function findInventoryItem(game, itemId) {
  return (game.inventory || []).find((entry) => Number(entry.id) === Number(itemId) && Number(entry.qty || 0) > 0);
}

function firstUsableRecoveryItem(game) {
  return (game.inventory || []).find((item) => {
    if (item.id === "stone" || Number(item.qty || 0) <= 0) return false;
    const preview = previewRecoveryItem(game, item);
    return preview.usable && preview.next > preview.before;
  }) || null;
}

function previewRecoveryItem(game, item) {
  const effect = itemEffect(item);
  if (!effect.usable) return { usable: false, reason: "unsupported" };
  const activePet = game.pets[0] || null;
  const target = selectItemTarget(game, activePet, effect);
  if (!target) return { usable: false, effect, reason: "no-target" };
  const before = Number(target.hpField.owner[target.hpField.key] || 0);
  const max = Number(target.maxHp || 1);
  const next = effect.revive
    ? Math.min(max, Math.max(before, effect.amount))
    : Math.min(max, before + effect.amount);
  return {
    usable: next > before,
    effect,
    target,
    before,
    next,
    restored: Math.max(0, next - before)
  };
}

function applyRecoveryItem(game, item) {
  const preview = previewRecoveryItem(game, item);
  if (!preview.effect?.usable) throw new Error(`${item.name} 还没有可模拟的使用效果`);
  if (!preview.target) throw new Error("当前没有可以恢复的目标");
  if (!preview.usable) throw new Error(`${preview.target.name} 的耐久力已经不需要恢复`);
  preview.target.hpField.owner[preview.target.hpField.key] = preview.next;
  item.qty = Number(item.qty || 0) - 1;
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  return {
    itemId: item.id,
    itemName: item.name,
    targetName: preview.target.name,
    before: preview.before,
    after: preview.next,
    restored: preview.restored,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
}

function talkGame(game, npcId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);
  if (isNpcEnemy(npc)) {
    openNpcEnemyStartWindow(game, npc);
    return withMap(game, { npc });
  }
  const reply = runNpcTalk(game, npc, "hi");
  openDialog(game, npc, [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", reply)
  ]);
  return withMap(game, { npc });
}

async function dialogGame(env, request, game, npcId, message) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);

  const text = message.trim().slice(0, 160);
  if (!text) {
    if (isNpcEnemy(npc)) {
      openNpcEnemyStartWindow(game, npc);
      return withMap(game, { npc });
    }
    const reply = runNpcTalk(game, npc, "hi");
    openDialog(game, npc, [
      npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
      npcMessage("player", "hi"),
      npcMessage("npc", reply)
    ]);
    return withMap(game, { npc });
  }

  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc);
  const reply = await npcReply(env, request, game, npc, text);
  openDialog(game, npc, [
    ...existing,
    npcMessage("player", text),
    npcMessage("npc", reply)
  ]);
  addLog(game, `${game.player.name} 对 ${npc.name} 说：${text}`);
  addLog(game, `${npc.name}：${reply}`);
  return withMap(game, { npc });
}

async function encounterGame(env, request, game) {
  game = normalizeGame(game);
  const map = currentMap(game);
  assertWildEncounterAllowed(map);
  await spawnEncounter(env, request, game, map, "野外");
  return withMap(game);
}

async function maybeStepEncounter(env, request, game, map) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.steps = Number(game.walk.steps || 0) + 1;
  if (!wildEncounterAllowed(map) || game.encounter) return false;
  if (hasActiveNoEncounterEffect(game)) {
    game.walk.encounterSteps = 0;
    return false;
  }
  game.walk.encounterSteps = Number(game.walk.encounterSteps || 0) + 1;
  const steps = game.walk.encounterSteps;
  if (steps < 5) return false;
  const chance = Math.min(0.38, 0.12 + (steps - 5) * 0.035);
  if (steps < 14 && Math.random() >= chance) return false;
  await spawnEncounter(env, request, game, map, "行走");
  game.walk.encounterSteps = 0;
  return true;
}

async function spawnEncounter(env, request, game, map, source) {
  assertWildEncounterAllowed(map);
  const enemy = await createEncounterEnemy(env, request, game, map);
  if (!enemy) throw new Error("当前地图没有可遇敌宠物");
  game.encounter = enemy;
  const activePet = game.pets?.[0];
  if (activePet) {
    ensureBattleState(game, activePet, enemy);
    if (game.battle) game.battle.source = `${source} encounter from ${GMSV_DATA_SOURCE}/encount.txt + gmsv/char/encount.c`;
  }
  addLog(game, `${source}遇到了 ${enemy.Name} Lv.${enemy.Lv}。`);
  return enemy;
}

function hasActiveNoEncounterEffect(game) {
  const until = Number(game.effects?.noEncounterUntil || 0);
  if (!Number.isFinite(until) || until <= 0) return false;
  if (until > Date.now()) return true;
  if (game.effects) delete game.effects.noEncounterUntil;
  return false;
}

async function createEncounterEnemy(env, request, game, map) {
  const data = await loadGameData(env, request);
  const petNo = pick(map.encounterPets || []);
  const enemy = createEnemy(data, petNo, Math.max(1, game.player.level + randInt(3) - 1));
  if (!enemy) return null;
  enemy.CaptureRate = Math.max(18, Math.min(75, 70 - enemy.Rare + game.player.level * 2));
  enemy.source = `${GMSV_DATA_SOURCE}/encount.txt + ${GMSV_DATA_SOURCE}/enemybase2.txt`;
  return enemy;
}

async function npcEnemyReply(env, request, game, npc, lower) {
  if (isYesChoice(lower)) return startNpcEnemyBattle(env, request, game, npc);
  if (isNoChoice(lower)) {
    runNpcVmAction(game, npc, {
      type: "window",
      status: "cancel",
      reason: "npcenemy-start",
      windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
      select: "no",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    const denied = npcEnemyDeniedMessage(npc);
    recordNpcVmEvent(game, npc, "say", "ok", { line: denied, reason: "npcenemy-denied" });
    return denied;
  }
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "npcenemy-start",
    windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
    buttons: "YESNO",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  return npcEnemyAskMessage(npc);
}

function isYesChoice(text) {
  return /(^|\s)(yes|y|ok)(\s|$)/i.test(text)
    || hasAny(text, ["是", "好", "确定", "確定", "愿意", "願意", "决胜负", "決勝負", "战斗", "戰鬥", "开战", "開始", "开始"]);
}

function isNoChoice(text) {
  return /(^|\s)(no|n|cancel)(\s|$)/i.test(text)
    || hasAny(text, ["否", "不", "算了", "取消", "不要", "拒绝", "拒絕"]);
}

async function startNpcEnemyBattle(env, request, game, npc) {
  const enemies = await createNpcEnemyEncounterParty(env, request, game, npc);
  if (!enemies.length) {
    recordNpcVmEvent(game, npc, "startBattle", "blocked", {
      reason: "missing-enemyno",
      enemyNos: npc.npcEnemy?.enemyNos || [],
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    return `${npc.name} 的 NPCEnemy 脚本没有可用的 enemyno，无法开战。`;
  }
  const enemy = enemies[0];
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "npcenemy-start",
    windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
    select: "yes",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  const event = runNpcVmAction(game, npc, {
    type: "startBattle",
    enemy,
    enemies,
    reason: "npcenemy",
    enemyNos: npc.npcEnemy?.enemyNos || [],
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  if (!event.ok) return `${npc.name} 找不到可用的敌人资料：${event.error || "startBattle 被 VM 拒绝"}。`;
  if (game.battle) {
    const startMessage = npcEnemyStartMessage(npc);
    game.battle.source = `gmsv/npc/npc_npcenemy.c NPC_NPCEnemy_BattleIn + ${npc.npcEnemy?.source || npc.script || npc.source || ""}`;
    game.battle.sourceCommand = "YES";
    game.battle.npcEnemy = {
      npcId: npc.id,
      npcName: npc.name,
      source: npc.npcEnemy?.source || npc.script || npc.source || "",
      dieAct: Number(npc.npcEnemy?.dieAct || 0),
      respawnSeconds: Number(npc.npcEnemy?.respawnSeconds || 0),
      startMessage,
      endMessage: npc.npcEnemy?.endMessage || "",
      warp: npc.npcEnemy?.warp || null
    };
    if (startMessage) game.battle.log = [...(game.battle.log || []), `${npc.name}：${startMessage}`].slice(-8);
  }
  const startMessage = npcEnemyStartMessage(npc);
  const enemyList = enemies.map((item) => `${item.Name} Lv.${item.Lv}`).join("、");
  if (startMessage) addLog(game, `${npc.name}：${startMessage}`);
  addLog(game, `${npc.name} 召出 ${enemyList}。`);
  return `${startMessage}\n${enemyList} 出现了。`;
}

async function createNpcEnemyEncounterParty(env, request, game, npc) {
  const data = await loadGameData(env, request);
  return (npc.npcEnemy?.enemyNos || [])
    .map((enemyNo) => createEnemyFromEnemySpec(data, Number(enemyNo), {
      npcId: npc.id,
      npcName: npc.name,
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    }))
    .filter(Boolean);
}

function createEnemyFromEnemySpec(data, enemyId, npcEnemy = null) {
  const spec = data.enemySpecsById.get(Number(enemyId));
  if (!spec) return null;
  const level = randRange(spec.lvMin, spec.lvMax);
  const enemy = createEnemy(data, spec.tempNo, level);
  if (!enemy) return null;
  enemy.EnemyId = spec.id;
  enemy.EnemyTempNo = spec.tempNo;
  enemy.EnemyLvMin = spec.lvMin;
  enemy.EnemyLvMax = spec.lvMax;
  enemy.EnemyCreateMin = spec.createMin;
  enemy.EnemyCreateMax = spec.createMax;
  enemy.CaptureRate = 0;
  enemy.source = `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${spec.id} -> ${GMSV_DATA_SOURCE}/enemybase2.txt ${spec.tempNo}`;
  if (npcEnemy) enemy.npcEnemy = npcEnemy;
  return enemy;
}

function captureGame(game) {
  game = normalizeGame(game);
  const outcome = performBattleAction(game, "capture");
  return withMap(game, {
    captured: outcome.result === "captured",
    battleOutcome: outcome
  });
}

function battleGame(game, action) {
  game = normalizeGame(game);
  const outcome = performBattleAction(game, action);
  return withMap(game, { battleOutcome: outcome });
}

function performBattleAction(game, action) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const move = normalizeBattleMove(action);
  if (move.type === "escape") {
    const enemyName = game.encounter.Name || "野外宠物";
    game.encounter = null;
    game.battle = null;
    const line = move.release ? `你放走了 ${enemyName}，战斗结束。` : `你从 ${enemyName} 面前逃跑了，战斗结束。`;
    addLog(game, line);
    return { result: move.release ? "released" : "escaped", enemyName, sourceCommand: move.command, log: [line] };
  }
  if (move.type === "capture") {
    return performCaptureAction(game);
  }
  if (move.type === "item") {
    return performBattleItemAction(game, move.itemId);
  }
  if (!["attack", "guard", "wait"].includes(move.type)) throw new Error("这个战斗动作还没有实现");
  const activePet = game.pets[0];
  if (!activePet) throw new Error("你需要至少一只宠物才能战斗");
  ensureBattleState(game, activePet, game.encounter);

  const enemy = game.encounter;
  const enemyName = enemy.Name;
  const petName = activePet.Name;
  const battleLog = [];
  const petFirst = Number(activePet.WorkFixDex || 0) >= Number(enemy.WorkFixDex || 0);
  game.battle.sourceCommand = move.command;
  game.battle.mode = "resolving";
  const petTurn = () => {
    const damage = combatDamage(activePet, enemy);
    enemy.Hp = Math.max(0, Number(enemy.Hp || 0) - damage);
    battleLog.push(`${activePet.Name} 攻击 ${enemy.Name}，造成 ${damage} 伤害。`);
  };
  const enemyTurn = (guarded = false) => {
    const damage = combatDamage(enemy, activePet, guarded ? 0.45 : 1);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - damage);
    battleLog.push(`${enemy.Name} ${guarded ? "攻击防御中的" : "反击"} ${activePet.Name}，造成 ${damage} 伤害。`);
  };

  if (move.type === "guard") {
    battleLog.push(`${activePet.Name} 采取防御姿势。`);
    enemyTurn(true);
  } else if (move.type === "wait") {
    battleLog.push(`${activePet.Name} 等待时机。`);
    enemyTurn(false);
  } else if (petFirst) {
    petTurn();
    if (enemy.Hp > 0) enemyTurn();
  } else {
    enemyTurn();
    if (activePet.Hp > 0) petTurn();
  }

  return settleBattleRound(game, activePet, enemy, {
    battleLog,
    result: "turn",
    sourceCommand: move.command
  });
}

function normalizeBattleMove(action) {
  const value = String(action || "attack").toLowerCase();
  const itemMatch = value.match(/^item[:|](\d+)$/);
  if (itemMatch) return { type: "item", command: "I", itemId: Number(itemMatch[1]) };
  if (["release", "放走"].includes(value)) return { type: "escape", command: "E", release: true };
  if (["run", "escape", "逃跑", "离开", "離開", "e"].includes(value)) return { type: "escape", command: "E" };
  if (["capture", "catch", "捕获", "抓宠", "抓", "t", "t|0"].includes(value)) return { type: "capture", command: "T|0" };
  if (["item", "道具", "物品", "i"].includes(value)) return { type: "item", command: "I" };
  if (["guard", "防御", "防守", "g"].includes(value)) return { type: "guard", command: "G" };
  if (["wait", "待机", "等待", "n"].includes(value)) return { type: "wait", command: "N" };
  if (["attack", "攻击", "战斗", "打", "h", "h|0"].includes(value)) return { type: "attack", command: "H|0" };
  return { type: value, command: value };
}

function performBattleItemAction(game, itemId = null) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const activePet = game.pets[0];
  if (!activePet) throw new Error("你需要至少一只宠物才能在战斗中使用道具");
  ensureBattleState(game, activePet, game.encounter);

  const item = itemId == null ? firstUsableRecoveryItem(game) : findInventoryItem(game, itemId);
  if (!item) throw new Error("背包里没有可用于战斗恢复的道具");

  const enemy = game.encounter;
  game.battle.sourceCommand = "I";
  game.battle.mode = "resolving";
  const itemUse = applyRecoveryItem(game, item);
  const battleLog = [`使用 ${itemUse.itemName}，${itemUse.targetName} 的耐久力恢复 ${itemUse.restored}。`];
  if (enemy.Hp > 0) {
    const damage = combatDamage(enemy, activePet);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - damage);
    battleLog.push(`${enemy.Name} 趁机反击 ${activePet.Name}，造成 ${damage} 伤害。`);
  }

  return settleBattleRound(game, activePet, enemy, {
    battleLog,
    result: "item",
    sourceCommand: "I",
    itemUse
  });
}

function settleBattleRound(game, activePet, enemy, options = {}) {
  const battleLog = options.battleLog || [];
  const enemyName = enemy.Name;
  const petName = activePet.Name;
  game.battle.turn = Number(game.battle.turn || 0) + 1;
  game.battle.sourceCommand = options.sourceCommand || game.battle.sourceCommand || "H|0";
  let result = options.result || "turn";
  let exp = 0;
  let stone = 0;
  let defeatedEnemies = [];
  if (enemy.Hp <= 0) {
    const nextEnemy = advanceBattleEnemy(game, enemy, battleLog);
    if (nextEnemy) {
      result = "next-enemy";
      battleLog.forEach((line) => addLog(game, line));
      return {
        result,
        enemyName,
        nextEnemyName: nextEnemy.Name,
        petName,
        exp,
        stone,
        sourceCommand: options.sourceCommand,
        itemUse: options.itemUse || null,
        defeatedEnemies: game.battle?.defeatedEnemies || [],
        log: battleLog
      };
    }
    result = "victory";
    defeatedEnemies = completedBattleEnemies(game, enemy);
    exp = defeatedEnemies.reduce((sum, item) => sum + 10 + Number(item.Lv || 1) * 6, 0);
    stone = defeatedEnemies.reduce((sum, item) => sum + 12 + Number(item.Lv || 1) * 4, 0);
    game.player.exp += exp;
    game.player.stone += stone;
    syncStoneItem(game);
    const defeatedText = defeatedEnemies.length > 1
      ? `击败敌方 ${defeatedEnemies.length} 人`
      : `击败 ${enemy.Name}`;
    battleLog.push(`${defeatedText}，获得 ${exp} 经验和 ${stone} 石币。`);
    maybeLevelPlayer(game);
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: enemy.Name,
      result: "battle"
    });
    settleNpcEnemyVictory(game, game.battle?.npcEnemy, battleLog);
    game.encounter = null;
    game.battle = null;
  } else if (activePet.Hp <= 0) {
    result = "defeat";
    const recovered = Math.max(1, Math.floor(Number(activePet.WorkMaxHp || 1) * 0.35));
    activePet.Hp = recovered;
    game.player.hp = Math.max(1, Math.floor(Number(game.player.maxHp || 1) * 0.5));
    game.encounter = null;
    game.battle = null;
    battleLog.push(`${activePet.Name} 被击倒，你带着队伍撤退并恢复了少量体力。`);
  } else {
    game.battle.mode = "command";
    game.battle.log = [...(game.battle.log || []), ...battleLog].slice(-8);
  }
  battleLog.forEach((line) => addLog(game, line));
  return { result, enemyName, petName, exp, stone, sourceCommand: options.sourceCommand, itemUse: options.itemUse || null, defeatedEnemies, log: battleLog };
}

function advanceBattleEnemy(game, defeatedEnemy, battleLog) {
  const battle = game.battle;
  if (!battle || !Array.isArray(battle.enemyParty) || battle.enemyParty.length <= 1) return null;
  const activeIndex = Math.max(0, Number(battle.activeEnemyIndex || 0));
  battle.enemyParty[activeIndex] = { ...battle.enemyParty[activeIndex], ...defeatedEnemy, Hp: 0 };
  const nextIndex = battle.enemyParty.findIndex((item, index) => index > activeIndex && Number(item.Hp || 0) > 0);
  if (nextIndex < 0) return null;
  battle.defeatedEnemies ||= [];
  battle.defeatedEnemies.push(enemyBattleSummary(defeatedEnemy));
  const nextEnemy = battle.enemyParty[nextIndex];
  battle.activeEnemyIndex = nextIndex;
  game.encounter = nextEnemy;
  battle.mode = "command";
  battleLog.push(`击倒 ${defeatedEnemy.Name}。`);
  battleLog.push(`敌方第 ${nextIndex + 1}/${battle.enemyParty.length} 个目标 ${nextEnemy.Name} Lv.${nextEnemy.Lv} 上前。`);
  battle.log = [...(battle.log || []), ...battleLog].slice(-8);
  return nextEnemy;
}

function completedBattleEnemies(game, finalEnemy) {
  const defeated = Array.isArray(game.battle?.defeatedEnemies) ? [...game.battle.defeatedEnemies] : [];
  defeated.push(enemyBattleSummary(finalEnemy));
  return defeated;
}

function enemyBattleSummary(enemy) {
  return {
    EnemyId: enemy.EnemyId,
    PetId: enemy.PetId,
    Name: enemy.Name,
    Lv: enemy.Lv
  };
}

function settleNpcEnemyVictory(game, npcEnemy, battleLog) {
  if (!npcEnemy?.npcId) return;
  ensureFlags(game);
  setEventFlag(game, stableFlag(`${npcEnemy.npcId}:npcenemy-win`), "end");
  updateQuestProgress(game, "npcEnemyWin", {
    npcId: npcEnemy.npcId,
    npcName: npcEnemy.npcName || "",
    mapId: game.location.mapId
  });
  if (npcEnemy.endMessage) battleLog.push(npcEnemy.endMessage);
  if (Number(npcEnemy.dieAct || 0) === 1 && npcEnemy.warp?.mapId && WORLD.maps[npcEnemy.warp.mapId]) {
    game.location = {
      ...game.location,
      mapId: npcEnemy.warp.mapId,
      x: Number(npcEnemy.warp.x || 0),
      y: Number(npcEnemy.warp.y || 0)
    };
    battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 让开并把你送到 (${game.location.x},${game.location.y})。`);
    return;
  }
  const respawnSeconds = Math.max(1, Number(npcEnemy.respawnSeconds || 60));
  game.flags.npcEnemyDefeats ||= {};
  game.flags.npcEnemyDefeats[npcEnemy.npcId] = {
    npcName: npcEnemy.npcName || "",
    source: npcEnemy.source || "",
    defeatedAt: new Date().toISOString(),
    until: new Date(Date.now() + respawnSeconds * 1000).toISOString()
  };
  battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 暂时退开，通路打开 ${respawnSeconds} 秒。`);
}

function performCaptureAction(game) {
  if (!game.encounter) throw new Error("当前没有可捕获目标");
  const target = game.encounter;
  const enemyName = target.Name || "野外宠物";
  const activePet = game.pets[0] || null;
  if (activePet) {
    ensureBattleState(game, activePet, target);
    game.battle.sourceCommand = "T|0";
    game.battle.mode = "resolving";
  }
  const rate = Math.max(0, Math.min(100, Number(target.CaptureRate ?? 35)));
  const ok = Math.random() * 100 < rate;
  if (ok) {
    game.pets.push({ ...target });
    game.encounter = null;
    game.battle = null;
    const exp = 12;
    const stone = 20;
    game.player.exp += exp;
    game.player.stone += stone;
    syncStoneItem(game);
    const line = `捕获成功！${enemyName} 加入了队伍，获得 ${exp} 经验和 ${stone} 石币。`;
    addLog(game, line);
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: enemyName,
      result: "capture"
    });
    return { result: "captured", enemyName, petName: enemyName, exp, stone, rate, sourceCommand: "T|0", log: [line] };
  }
  const battleLog = [`${enemyName} 挣脱了绳索。`];
  if (activePet) {
    const damage = combatDamage(target, activePet);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - damage);
    battleLog.push(`${target.Name} 反击 ${activePet.Name}，造成 ${damage} 伤害。`);
    return settleBattleRound(game, activePet, target, {
      battleLog,
      result: "capture-missed",
      sourceCommand: "T|0"
    });
  }
  addLog(game, battleLog[0]);
  return { result: "capture-missed", enemyName, rate, sourceCommand: "T|0", log: battleLog };
}

function ensureBattleState(game, pet, enemy) {
  pet.WorkMaxHp ||= Math.max(1, Number(pet.Hp || 1));
  enemy.WorkMaxHp ||= Math.max(1, Number(enemy.Hp || 1));
  if (!Number.isFinite(Number(pet.Hp)) || Number(pet.Hp) <= 0) pet.Hp = pet.WorkMaxHp;
  if (!Number.isFinite(Number(enemy.Hp)) || Number(enemy.Hp) <= 0) enemy.Hp = enemy.WorkMaxHp;
  game.battle ||= {
    mode: "command",
    turn: 0,
    startedAt: new Date().toISOString(),
    log: [`${pet.Name} 遭遇 ${enemy.Name}，战斗开始。`],
    sourceCommand: "",
    source: `gmsv battle_command.c + battle.c command loop from ${GMSV_DATA_SOURCE} enemy parameters`
  };
}

function combatDamage(attacker, defender, multiplier = 1) {
  const attack = Math.max(1, Number(attacker.WorkFixStr || attacker.level || attacker.Lv || 1));
  const defense = Math.max(0, Number(defender.WorkFixTough || 0));
  const variance = 0.85 + Math.random() * 0.3;
  const raw = attack * variance - defense * 0.42;
  const critical = Math.random() * 100 < Math.max(2, Number(attacker.Critical || 0) * 0.35);
  return Math.max(1, Math.floor(raw * (critical ? 1.6 : 1) * multiplier));
}

function maybeLevelPlayer(game) {
  const needed = game.player.level * 60;
  if (game.player.exp < needed) return;
  game.player.exp -= needed;
  game.player.level += 1;
  game.player.maxHp += 12;
  game.player.hp = game.player.maxHp;
  addLog(game, `${game.player.name} 提升到 Lv.${game.player.level}。`);
}

function trainGame(game, petIndex) {
  game = normalizeGame(game);
  trainPetInPlace(game, petIndex);
  return withMap(game);
}

function trainPetInPlace(game, petIndex) {
  const pet = game.pets[petIndex];
  if (!pet) throw new Error("没有找到这只宠物");
  const before = pet.Lv;
  const up = pet.Lv < 10 ? 2 : 1;
  for (let i = 0; i < up; i += 1) petLevelUp(pet);
  game.player.exp += 10 * (pet.Lv - before);
  game.player.stone += 12;
  addLog(game, `${pet.Name} 完成训练，从 Lv.${before} 提升到 Lv.${pet.Lv}。`);
  return { pet, before };
}

function restGame(game) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能休息");
  healParty(game);
  addLog(game, `${game.player.name} 和宠物休息了一会儿，耐久力恢复了。`);
  return withMap(game);
}

async function guideGame(env, request, game, prompt) {
  game = normalizeGame(game);
  const action = await applyGuideRequest(env, request, game, prompt);
  if (action) {
    return {
      text: action.text,
      model: "local-action",
      action: action.action,
      game: withMap(game)
    };
  }
  const map = currentMap(game);
  const context = buildGuideContext(game, map);
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      {
        role: "system",
        content: [
          "你是单人版石器时代网页运行时的向导，不是万能 GM。",
          "必须只根据给定 JSON 回答；把“当前能做的事”和“需要找对应 NPC/脚本的事”说清楚。",
          "如果玩家问任务、地图、NPC、交易、战斗或避敌，要优先引用当前地图、附近 NPC、出口、任务进度、原 gmsv 脚本线索。",
          "中文，最多三段；给出下一步可执行动作，不要编不存在的地点、NPC 或奖励。"
        ].join("\n")
      },
      { role: "user", content: `${prompt || "我下一步该做什么？"}\n\n当前状态 JSON：${JSON.stringify(context)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    try {
      const rsp = await env.AI.run(model, { messages });
      return { text: rsp.response || rsp.text || fallbackGuide(context, prompt), model };
    } catch (error) {
      return {
        text: fallbackGuide(context, prompt, error),
        model: "local-rule",
        warning: error?.message || "AI binding failed"
      };
    }
  }
  return { text: fallbackGuide(context, prompt), model: "local-rule" };
}

async function applyGuideRequest(env, request, game, prompt) {
  const text = String(prompt || "").trim();
  const lower = text.toLowerCase();
  if (!text) return null;

  if (game.encounter && hasAny(lower, ["战斗", "戰鬥", "攻击", "攻擊", "帮打", "幫打", "打一下", "battle", "attack"])) {
    const outcome = performBattleAction(game, "attack");
    const lines = Array.isArray(outcome.log) ? outcome.log.join("\n") : "我帮你推进了一回合战斗。";
    return {
      text: `${lines}\n我只能按当前战斗规则帮忙出一手，后续还要看你的宠物状态。`,
      action: { type: "battle", outcome: outcome.result }
    };
  }

  if (hasAny(lower, ["避敌", "避敵", "不遇敌", "不遇敵", "不会遇到", "不會遇到"])) {
    game.effects ||= {};
    game.effects.noEncounterUntil = Date.now() + 10 * 60 * 1000;
    addLog(game, "AI 向导暂时帮你避开野外敌人，持续 10 分钟。");
    return {
      text: "我先帮你把野外遇敌压住 10 分钟。这个帮助只影响随机遇敌，不会跳过 NPC 战斗或剧情判断。",
      action: { type: "noEncounter", seconds: 600 }
    };
  }

  if (hasAny(lower, ["回血", "治疗", "治療", "恢复", "恢復", "补血", "補血", "休息", "heal", "hp"])) {
    healParty(game);
    addLog(game, "AI 向导帮队伍恢复了耐久力。");
    return {
      text: "我帮你把人物和宠物的耐久力恢复了。真正的医院和治疗 NPC 以后仍会按原版脚本来收钱或判断条件。",
      action: { type: "heal" }
    };
  }

  if (isTeleportRequest(lower)) {
    const teleport = chooseGuideTeleport(game, text);
    if (!teleport) {
      const map = currentMap(game);
      const labels = map.exits.map((item) => item.label).slice(0, 5).join("、") || "当前地图没有出口";
      return {
        text: `我没判断出你想去哪里。你可以说完整地图名、floor，或直接说“带我去 ${labels}”。`,
        action: { type: "teleport-refused" }
      };
    }
    let targetMap;
    if (teleport.exit) {
      targetMap = WORLD.maps[teleport.exit.to];
      applyExit(game, teleport.exit);
    } else {
      targetMap = WORLD.maps[teleport.target.mapId];
      applyWarpTarget(game, teleport.target, `AI 向导瞬移到 ${targetMap?.name || teleport.target.mapId}`);
    }
    return {
      text: teleport.exit
        ? `我带你走「${teleport.exit.label}」，到了 ${targetMap?.name || teleport.exit.to}。`
        : `我直接把你送到 ${targetMap?.name || teleport.target.mapId}。这属于 AI 向导辅助瞬移，不会伪装成原版 NPC 脚本。`,
      action: {
        type: "teleport",
        mode: teleport.exit ? "mapwarp" : "guide-warp",
        exitId: teleport.exit?.id,
        mapId: teleport.exit?.to || teleport.target.mapId
      }
    };
  }

  if (hasAny(lower, ["练级", "練級", "训练", "訓練", "练宠", "練寵", "升级", "升級", "level", "train"])) {
    const { pet, before } = trainPetInPlace(game, 0);
    return {
      text: `我帮 ${pet.Name} 做了一轮训练，从 Lv.${before} 到 Lv.${pet.Lv}。这只是向导辅助，正式战斗经验后面会继续接 gmsv 的战斗结算。`,
      action: { type: "train", petIndex: 0, level: pet.Lv }
    };
  }

  if (!game.encounter && hasAny(lower, ["遇敌", "遇敵", "野外敌人", "野外敵人", "找敌人", "找敵人", "敌人", "敵人", "刷怪", "开战", "開戰"])) {
    const map = currentMap(game);
    if (!wildEncounterAllowed(map)) {
      return {
        text: wildEncounterBlockedText(map),
        action: { type: "encounter-refused" }
      };
    }
    const enemy = await spawnEncounter(env, request, game, map, "AI 向导");
    return {
      text: `我帮你找到了 ${enemy.Name} Lv.${enemy.Lv}。接下来可以在主画面的 BATTLE 里攻击、道具、捕获或放走。`,
      action: { type: "encounter", enemy: enemy.Name }
    };
  }

  return null;
}

function chooseGuideExit(game, prompt) {
  const map = currentMap(game);
  if (!map.exits?.length) return null;
  const normalizedPrompt = guideSearchText(prompt);
  const tokens = guideSearchTokens(prompt);
  const scored = map.exits.map((exit, index) => {
    const targetMap = WORLD.maps[exit.to];
    const haystack = guideSearchText(`${exit.label} ${exit.detail || ""} ${targetMap?.name || ""} ${exit.to}`);
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += token.length;
    }
    const targetName = guideSearchText(targetMap?.name || "");
    const exitLabel = guideSearchText(exit.label || "");
    if (targetName && normalizedPrompt.includes(targetName)) score += 8;
    if (exitLabel && normalizedPrompt.includes(exitLabel)) score += 6;
    return { exit, index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  return scored[0]?.score > 0 ? scored[0].exit : (map.exits.length === 1 ? map.exits[0] : null);
}

function chooseGuideTeleport(game, prompt) {
  const exit = chooseGuideExit(game, prompt);
  const map = chooseWorldMapFromPrompt(prompt);
  if (exit && (!map || String(exit.to) === String(map.id))) return { exit };
  if (!map) return null;
  const spawn = Array.isArray(map.spawn) ? map.spawn : [Math.floor((Number(map.size?.[0]) || 2) / 2), Math.floor((Number(map.size?.[1]) || 2) / 2)];
  return {
    target: {
      mapId: map.id,
      x: spawn[0],
      y: spawn[1],
      source: "AI guide world-map teleport"
    }
  };
}

function chooseWorldMapFromPrompt(prompt) {
  const normalized = guideSearchText(prompt);
  const tokens = guideSearchTokens(prompt);
  const scored = Object.values(WORLD.maps).map((map) => {
    const name = guideSearchText(map.name || "");
    const summary = guideSearchText(map.summary || "");
    const floor = guideSearchText(`${map.floorId || map.id}`);
    let score = 0;
    if (name && normalized.includes(name)) score += 20;
    if (floor && normalized.includes(floor)) score += 10;
    for (const token of tokens) {
      if (name.includes(token)) score += token.length * 2;
      else if (summary.includes(token)) score += token.length;
    }
    if ((normalized.includes("渔村") || normalized.includes("魚村") || normalized.includes("鱼村")) && /渔村|魚村|鱼村/.test(map.name || "")) score += 18;
    if (normalized.includes("玛丽娜丝") && /玛丽娜丝/.test(map.name || "")) score += 10;
    if (normalized.includes("萨姆吉尔") && /萨姆吉尔/.test(map.name || "")) score += 10;
    if (normalized.includes("柯奥") && /柯奥/.test(map.name || "")) score += 10;
    return { map, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].map : null;
}

function isTeleportRequest(text) {
  return hasAny(text, ["瞬移", "传送", "傳送", "带我去", "帶我去", "送我去", "飛到", "飞到", "送到", "移动到", "移動到"]);
}

function guideSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[|�]/g, "")
    .replace(/\s+/g, "");
}

function guideSearchTokens(value) {
  const stopWords = ["帮我", "幫我", "帶我", "带我", "送我", "传送", "傳送", "瞬移", "移动到", "移動到", "到", "去", "一下", "可以", "能不能", "请", "請"];
  let cleaned = guideSearchText(value);
  for (const word of stopWords) cleaned = cleaned.replaceAll(guideSearchText(word), "");
  const tokens = new Set((cleaned.match(/[\u4e00-\u9fff]{2,}|[a-z0-9]+/gi) || []).map(guideSearchText));
  for (let size = 2; size <= Math.min(4, cleaned.length); size += 1) {
    for (let i = 0; i <= cleaned.length - size; i += 1) tokens.add(cleaned.slice(i, i + size));
  }
  return [...tokens].filter((token) => token.length >= 2);
}

async function npcReply(env, request, game, npc, text) {
  const lower = text.toLowerCase();
  if (game.encounter && hasAny(lower, ["攻击", "戰鬥", "战斗", "打", "attack", "放走", "逃跑", "离开", "離開", "release", "run"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["抓宠", "捕获", "capture", "catch"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["道具", "物品", "item"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["宠物", "pet"])) return battleStatusReply(game, npc);
  if (!game.encounter && isAiModeOn(lower)) return setNpcAiModeReply(game, npc, true);
  if (!game.encounter && isAiModeOff(lower)) return setNpcAiModeReply(game, npc, false);
  if (hasAny(lower, ["来源", "來源", "脚本", "腳本", "source", "debug"])) return sourceReply(game, npc);
  if (!game.encounter && isNpcEnemy(npc) && (isNpcAiMode(game, npc) || isAiRequest(lower)) && isAiRequest(lower)) return aiNpcReply(env, game, npc, text);
  if (isNpcEnemy(npc)) return npcEnemyReply(env, request, game, npc, lower);
  if (isGreeting(lower)) return runNpcTalk(game, npc, "hi");
  if (!game.encounter && (isNpcAiMode(game, npc) || isAiRequest(lower)) && isAiRequest(lower)) return aiNpcReply(env, game, npc, text);
  if (isHealerNpc(npc) && hasAny(lower, ["治疗", "恢復", "恢复", "补血", "耐久", "heal", "hp"])) return healerReply(game, npc);
  if (isSavePointNpc(npc) && hasAny(lower, ["记录", "記錄", "纪录", "存档", "保存", "save"])) return savePointReply(game, npc);
  if (npc.trade && hasAny(lower, ["买", "卖", "交易", "商品", "shop", "buy"])) return tradeReply(game, npc);
  if (isWarpNpc(npc) && hasAny(lower, ["传送", "傳送", "进入", "進入", "出发", "出發", "前往", "移动", "warp"])) return warpNpcReply(game, npc);
  if (hasAny(lower, ["任务", "委托", "quest"])) return questReply(game, npc);
  if (hasAny(lower, ["抓宠", "捕获", "宠物", "pet"])) return captureReply(env, request, game, npc);
  if (hasAny(lower, ["训练", "练级", "成长", "技能"])) return trainReply(game, npc);
  if (hasAny(lower, ["地图", "出口", "去哪", "travel", "map", "森林", "草原", "村"])) return mapReply(game, npc);
  if (isNpcAiMode(game, npc) || isAiRequest(lower)) return aiNpcReply(env, game, npc, text);
  if (env.AI && typeof env.AI.run === "function") return aiNpcReply(env, game, npc, text);
  recordNpcVmEvent(game, npc, "unsupported", "unsupported", { text: text.slice(0, 80) });
  return fallbackNpcReply(npc);
}

function isAiModeOn(text) {
  return /(^|\s)ai(\s|$)/i.test(text) || hasAny(text, ["AI对话", "ai对话", "智能对话", "AI聊天", "ai聊天"]);
}

function isAiModeOff(text) {
  return hasAny(text, ["普通对话", "退出AI", "关闭AI", "不用AI", "普通聊天"]);
}

function isAiRequest(text) {
  return isTeleportRequest(text)
    || hasAny(text, ["请求避敌", "不会遇到", "野外敌人", "避敌", "商量传送", "商量坐车", "去别的地图", "去其他地图", "打折", "折扣", "便宜", "优惠", "優待", "优待", "平时不卖", "平常不卖", "隐藏", "有没有", "能不能给", "给我", "卖我", "要一个", "贿赂", "收钱", "买路", "威胁", "恐吓", "让我过去", "放我过去", "bus", "ai:"]);
}

function isNpcAiMode(game, npc) {
  return Boolean(game.dialogAi?.[npc.id]);
}

function setNpcAiModeReply(game, npc, enabled) {
  game.dialogAi ||= {};
  game.dialogAi[npc.id] = enabled;
  recordNpcVmEvent(game, npc, "debug", "ok", { reason: enabled ? "ai-mode-on" : "ai-mode-off" });
  return enabled
    ? `${npc.name} 会用 AI 对话方式继续回应；可商量信息、优待或传送，但交易、传送、战斗和 flag 仍由 Worker 的 NPC VM 校验。`
    : `${npc.name} 切回普通脚本对话。`;
}

function battleActionReply(game, npc, text) {
  const move = hasAny(text, ["放走", "逃跑", "离开", "離開", "release", "run"])
    ? "release"
    : hasAny(text, ["抓宠", "捕获", "capture", "catch"])
      ? "capture"
      : hasAny(text, ["道具", "物品", "item"])
        ? "item"
        : "attack";
  const event = runNpcVmAction(game, npc, {
    type: "battleAction",
    move,
    reason: "dialog-battle"
  });
  if (!event.ok) return `${npc.name}：${event.error || "战斗动作失败"}。`;
  const outcome = event.detail?.outcome || {};
  const lines = Array.isArray(outcome.log) ? outcome.log : [];
  const summary = lines.length ? lines.join("\n") : `${npc.name} 处理了战斗动作。`;
  if (outcome.result === "turn" || outcome.result === "item" || outcome.result === "next-enemy") return `${summary}\n继续输入“攻击”推进战斗，或输入“道具”“放走”结束。`;
  if (outcome.result === "victory") return `${summary}\n战斗结束。`;
  if (outcome.result === "defeat") return `${summary}\n队伍撤退，战斗结束。`;
  if (outcome.result === "released") return `${summary}\n战斗结束。`;
  if (outcome.result === "captured") return `${summary}\n捕获成功，战斗结束。`;
  if (outcome.result === "capture-missed") return `${summary}\n继续输入“攻击”“捕获”或“放走”。`;
  return summary;
}

function battleStatusReply(game, npc) {
  const enemy = game.encounter;
  recordNpcVmEvent(game, npc, "battleAction", "noop", {
    query: true,
    enemyName: enemy?.Name,
    enemyLevel: enemy?.Lv,
    enemyHp: enemy?.Hp ?? enemy?.WorkMaxHp,
    reason: "dialog-battle-status"
  });
  return `${npc.name}：当前正在与 ${enemy?.Name || "野外宠物"} Lv.${enemy?.Lv || "?"} 交战。输入“攻击”推进战斗，输入“捕获”尝试抓宠，或输入“放走”结束。`;
}

function isGreeting(text) {
  return /(^|\s)(hi|hello|hey|yo)(\s|$)/i.test(text) || hasAny(text, ["你好", "嗨", "哈喽", "問候", "问候"]);
}

function hasAny(text, tokens) {
  return tokens.some((token) => text.includes(token));
}

function npcQuestIds(npc) {
  return [...new Set([
    npc?.questId,
    ...(Array.isArray(npc?.questIds) ? npc.questIds : [])
  ].filter((id) => id && WORLD.quests[id]))];
}

function applyNpcHi(game, npc) {
  ensureFlags(game);
  setNpcVmFlag(game, npc, eventFlagForNpc(npc.id), "now", "talk-hi");
  if (isHealerNpc(npc)) return healerReply(game, npc);
  if (isSavePointNpc(npc)) return savePointReply(game, npc);
  if (isWarpNpc(npc)) return warpPromptReply(game, npc);
  const line = nextNpcDialogueLine(game, npc);
  const questIds = npcQuestIds(npc);
  const reportableId = questIds.find((questId) => game.quests[questId]?.status === "可回报");
  if (reportableId) {
    completeQuest(game, reportableId, npc);
    recordNpcVmEvent(game, npc, "quest", "ok", { questId: reportableId, phase: "complete" });
    recordNpcVmEvent(game, npc, "say", "ok", { line });
    return `${line} 你已经完成了「${WORLD.quests[reportableId].title}」，奖励已经给你。`;
  }
  const activeId = questIds.find((questId) => game.quests[questId]?.status === "进行中");
  const newQuestId = questIds.find((questId) => !game.quests[questId]);
  if (newQuestId && !activeId) {
    startQuest(game, newQuestId, npc);
    recordNpcVmEvent(game, npc, "quest", "ok", { questId: newQuestId, phase: "start" });
    recordNpcVmEvent(game, npc, "say", "ok", { line });
    return `${line} ${game.quests[newQuestId].steps[1]}`;
  }
  recordNpcVmEvent(game, npc, "say", "ok", { line });
  return line;
}

function nextNpcDialogueLine(game, npc) {
  const lines = npcDialogueLines(npc);
  if (!lines.length) return `脚本入口：${npc.script || npc.template || npc.source || "未配置"}`;
  ensureFlags(game);
  game.flags.npcTalkCounts ||= {};
  const count = Number(game.flags.npcTalkCounts[npc.id] || 0);
  game.flags.npcTalkCounts[npc.id] = count + 1;
  return lines[count % lines.length];
}

function npcDialogueLines(npc) {
  if (Array.isArray(npc.dialogueLines) && npc.dialogueLines.length) return npc.dialogueLines.filter(Boolean);
  if (!npc.dialogue) return [];
  return String(npc.dialogue).split(/\n+/).map((item) => item.trim()).filter(Boolean);
}

function runNpcTalk(game, npc, text) {
  const body = text.trim().toLowerCase();
  if (isGreeting(body)) {
    const reply = applyNpcHi(game, npc);
    addLog(game, `${game.player.name} 对 ${npc.name} 说：hi`);
    addLog(game, `${npc.name}：${reply}`);
    return reply;
  }
  return fallbackNpcReply(npc);
}

function completeQuest(game, questId, npc = null) {
  const quest = game.quests[questId];
  if (!quest || quest.status === "完成") return;
  quest.status = "完成";
  quest.progress = quest.steps.length;
  const expReward = Number(quest.expReward || 20);
  const stoneReward = Number(quest.stoneReward || 80);
  if (npc) {
    setNpcVmFlag(game, npc, eventFlagForQuest(questId), "end", "quest-complete");
    runNpcVmAction(game, npc, { type: "give", exp: expReward, stone: stoneReward, reason: "quest" });
  } else {
    game.player.exp += expReward;
    game.player.stone += stoneReward;
    syncStoneItem(game);
    setEventFlag(game, eventFlagForQuest(questId), "end");
  }
  addLog(game, `完成任务「${quest.title}」，获得奖励。`);
}

function questReply(game, npc) {
  const questIds = npcQuestIds(npc);
  recordNpcVmEvent(game, npc, "quest", questIds.length ? "ok" : "unsupported", { questIds, query: true });
  if (!questIds.length) {
    if (npc.questLead) return `${npc.name} 有原脚本线索：「${npc.questLead.title}」。${npc.questLead.summary}\n来源：${npc.questLead.source}`;
    return `${npc.name} 这里没有正式委托，但可以继续问地图、交易或训练。`;
  }
  const reportable = questIds.map((id) => game.quests[id]).find((quest) => quest?.status === "可回报");
  if (reportable) return `你已经可以回报「${reportable.title}」了。再次点选我会自动送出 hi 并结算奖励。`;
  const active = questIds.map((id) => game.quests[id]).find((quest) => quest?.status === "进行中");
  if (active) return `「${active.title}」还在进行中。下一步是：${active.steps[Math.min(active.progress || 0, active.steps.length - 1)]}。`;
  const titles = questIds.map((id) => `「${WORLD.quests[id].title}」`).join("、");
  return `我这里有 ${titles}。点选我时客户端会自动打招呼并触发一个可接任务。`;
}

async function captureReply(env, request, game, npc) {
  const map = currentMap(game);
  if (!wildEncounterAllowed(map)) {
    runNpcVmAction(game, npc, {
      type: "startBattle",
      reason: map.encounterPets?.length ? "safe-map" : "no-encounter-data",
      mapId: map.id,
      mapName: map.name
    });
    return `${npc.name} 查看了当前地图资料：${wildEncounterBlockedText(map)}`;
  }
  const enemy = await createEncounterEnemy(env, request, game, map);
  const event = runNpcVmAction(game, npc, {
    type: "startBattle",
    enemy,
    reason: "npc-capture",
    mapId: map.id,
    mapName: map.name,
    source: `${GMSV_DATA_SOURCE}/encount.txt`
  });
  if (!event.ok) {
    return `${npc.name} 找不到可用的遇敌资料：${event.error || "startBattle 被 VM 拒绝"}。`;
  }
  addLog(game, `${npc.name} 引导出 ${enemy.Name} Lv.${enemy.Lv}。`);
  return `${npc.name} 根据 ${map.name} 的 encount.txt 引导出 ${enemy.Name} Lv.${enemy.Lv}。\n战斗状态已由 NPC VM 建立；旧的自动抓宠弹窗仍保持关闭，后续会接入原版战斗窗口。`;
}

function trainReply(game, npc) {
  recordNpcVmEvent(game, npc, "fieldSkill", "unsupported", { reason: "training script not ported" });
  return `${npc.name} 当前没有可模拟的训练脚本，只保留原 NPC 数据入口：${npc.source || npc.script || npc.type}。`;
}

function healerReply(game, npc) {
  const before = {
    playerHp: Number(game.player.hp || 0),
    pets: game.pets.map((pet) => Number(pet.Hp || 0))
  };
  const cost = healerCost(game, npc);
  const needed = needsHealing(game);
  if (!needed) {
    setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "healer-check"), "now", "healer-check");
    recordNpcVmEvent(game, npc, "heal", "noop", { reason: "full-hp" });
    return `${npc.name} 查看了你的状态：人物和宠物都不需要治疗。`;
  }
  if (cost > 0 && Number(game.player.stone || 0) < cost) {
    recordNpcVmEvent(game, npc, "heal", "blocked", { reason: "stone", cost });
    return `${npc.name}：治疗需要 ${cost} 石币，你现在的石币不够。`;
  }
  if (cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "heal" });
    if (!taken.ok) return `${npc.name}：治疗需要 ${cost} 石币，你现在的石币不够。`;
  }
  healParty(game);
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "healer"), "now", "healer");
  const restored = [
    Math.max(0, Number(game.player.hp || 0) - before.playerHp),
    ...game.pets.map((pet, index) => Math.max(0, Number(pet.Hp || 0) - Number(before.pets[index] || 0)))
  ].reduce((sum, item) => sum + item, 0);
  const line = cost > 0
    ? `${npc.name} 为人物和宠物恢复了耐久，花费 ${cost} 石币。`
    : `${npc.name} 为人物和宠物恢复了耐久。`;
  addLog(game, `${line} 合计恢复 ${restored}。`);
  recordNpcVmEvent(game, npc, "heal", "ok", { cost, restored });
  return `${line}\n来源：gmsv npc_windowhealer / npc_healer 会恢复玩家与宠物 HP/MP。`;
}

function needsHealing(game) {
  if (Number(game.player.hp || 0) < Number(game.player.maxHp || 0)) return true;
  return game.pets.some((pet) => Number(pet.Hp || 0) < Number(pet.WorkMaxHp || 0));
}

function healerCost(game, npc) {
  if (!/windowhealer/i.test(`${npc.type} ${npc.template}`)) return 0;
  if (!needsHealing(game)) return 0;
  return Math.max(1, Math.floor(Number(game.player.level || 1) * 2));
}

function healParty(game) {
  game.player.hp = Number(game.player.maxHp || game.player.hp || 1);
  for (const pet of game.pets) {
    pet.WorkMaxHp ||= Math.max(1, Number(pet.Hp || 1));
    pet.Hp = Number(pet.WorkMaxHp || pet.Hp || 1);
    if (Number.isFinite(Number(pet.WorkMaxMp))) pet.Mp = Number(pet.WorkMaxMp || 0);
    pet.IsDie = false;
  }
}

function savePointReply(game, npc) {
  ensureFlags(game);
  const now = new Date().toISOString();
  game.savePoint = {
    npcId: npc.id,
    npcName: npc.name,
    mapId: game.location.mapId,
    x: npc.x,
    y: npc.y,
    source: npc.source || npc.script || npc.template,
    savedAt: now
  };
  game.character.updatedAt = now;
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "savepoint"), "end", "savepoint");
  addLog(game, `${npc.name} 已记录你的冒险进度。`);
  recordNpcVmEvent(game, npc, "save", "ok", { mapId: game.location.mapId, x: game.location.x, y: game.location.y });
  return `${npc.name} 已记录你的冒险进度。\n来源：gmsv npc_savepoint 会设置 LASTTALKELDER 并触发 SAAC 角色保存。`;
}

function warpPromptReply(game, npc) {
  if (!npc.warp?.target) return fallbackNpcReply(npc);
  const target = npc.warp.target;
  const targetMap = WORLD.maps[target.mapId];
  const targetName = targetMap?.name || `floor ${target.mapId}`;
  const permission = warpPermission(game, npc.warp);
  if (!targetMap) {
    recordNpcVmEvent(game, npc, "warp", "unsupported", { reason: "target-map-missing", target });
    return `${npc.name} 的原版脚本目标是 ${targetName} (${target.x},${target.y})，但这个 floor 尚未打包进当前 Worker 地图集。\n来源：${npc.warp.source}`;
  }
  if (!permission.ok) {
    const line = npc.warp.payMessage || npc.warp.moneyMessage || `${npc.name} 说：现在还不能传送。`;
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: permission.reason || "condition", target });
    return `${line}\n条件：${npc.warp.free || "未满足"}\n来源：${npc.warp.source}`;
  }
  const costLine = permission.cost > 0 ? `需要 ${permission.cost} 石币。` : "当前满足免费传送条件。";
  const intro = permission.free
    ? npc.warp.freeMessage || `${npc.name} 可以送你去 ${targetName}。`
    : npc.warp.payMessage || `${npc.name} 可以送你去 ${targetName}。`;
  recordNpcVmEvent(game, npc, "window", "ok", { action: "warpPrompt", target, cost: permission.cost });
  return `${intro}\n目的地：${targetName} (${target.x},${target.y})。${costLine} 输入“传送”确认。`;
}

function warpNpcReply(game, npc) {
  if (!npc.warp?.target) return fallbackNpcReply(npc);
  const target = npc.warp.target;
  const targetMap = WORLD.maps[target.mapId];
  if (!targetMap) {
    recordNpcVmEvent(game, npc, "warp", "unsupported", { reason: "target-map-missing", target });
    return `${npc.name} 已解析到原版 WARP:${target.mapId},${target.x},${target.y}，但目标地图还没有打包进当前 Worker。`;
  }
  const permission = warpPermission(game, npc.warp);
  if (!permission.ok) {
    const line = npc.warp.payMessage || npc.warp.moneyMessage || `${npc.name}：现在还不能传送。`;
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: permission.reason || "condition", target });
    return `${line}\n条件：${npc.warp.free || "未满足"}`;
  }
  if (permission.cost > 0 && Number(game.player.stone || 0) < permission.cost) {
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: "stone", target, cost: permission.cost });
    return npc.warp.moneyMessage || `${npc.name}：传送需要 ${permission.cost} 石币，你现在的石币不够。`;
  }
  if (permission.cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: permission.cost, reason: "warp" });
    if (!taken.ok) return npc.warp.moneyMessage || `${npc.name}：传送需要 ${permission.cost} 石币，你现在的石币不够。`;
  }
  const consumed = permission.free ? consumeWarpItems(game, npc.warp) : [];
  for (const itemName of consumed) {
    runNpcVmAction(game, npc, { type: "take", item: itemName, qty: 1, reason: "warp" });
  }
  const arrived = applyWarpTarget(game, target, npc.name);
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "warp"), "end", "warp");
  const paid = permission.cost > 0 ? `花费 ${permission.cost} 石币，` : "";
  const ticket = consumed.length ? `消耗 ${consumed.join("、")}，` : "";
  recordNpcVmEvent(game, npc, "warp", "ok", { target, cost: permission.cost, consumed });
  return `${npc.name} 启动传送，${ticket}${paid}你来到 ${arrived.name} (${game.location.x},${game.location.y})。\n来源：gmsv npc_warpman WARP:${target.mapId},${target.x},${target.y}`;
}

function warpPermission(game, warp) {
  const hasFreeSpec = Boolean(String(warp.free || "").trim());
  const free = warpFreeStatus(game, warp.free || "");
  const cost = warpCost(game, warp.cost);
  if (hasFreeSpec && free.ok) return { ok: true, free: true, cost: 0 };
  if (!hasFreeSpec && cost === 0) return { ok: true, free: true, cost: 0 };
  if (cost == null) return { ok: false, free: false, cost: 0, reason: free.reason };
  return { ok: true, free: false, cost };
}

function warpFreeStatus(game, spec) {
  const raw = String(spec || "").trim();
  if (!raw || /^ALLFREE$/i.test(raw)) return { ok: true };
  const parts = raw.split(/[&|]/).map((item) => item.trim()).filter(Boolean);
  if (!parts.length) return { ok: true };
  for (const part of parts) {
    if (!warpConditionMet(game, part)) return { ok: false, reason: raw };
  }
  return { ok: true };
}

function warpConditionMet(game, part) {
  const level = part.match(/^LV\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (level) {
    const playerLevel = Number(game.player.level || 1);
    const target = Number(level[2]);
    if (level[1] === ">") return playerLevel > target;
    if (level[1] === ">=") return playerLevel >= target;
    if (level[1] === "<") return playerLevel < target;
    if (level[1] === "<=") return playerLevel <= target;
    return playerLevel === target;
  }
  const item = part.match(/^ITEM\s*=\s*(\d+)(?:\*(\d+))?$/i);
  if (item) return inventoryQty(game, Number(item[1])) >= Number(item[2] || 1);
  return false;
}

function warpCost(game, cost) {
  if (!cost) return 0;
  if (cost.mode === "fixed") return Math.max(0, Number(cost.amount || 0));
  if (cost.mode === "level-multiplier") return Math.max(0, Number(game.player.level || 1) * Number(cost.amount || 0));
  return null;
}

function consumeWarpItems(game, warp) {
  if (!Array.isArray(warp.deleteItems) || !warp.deleteItems.length) return [];
  const consumed = [];
  for (const id of warp.deleteItems) {
    const item = game.inventory?.find((entry) => Number(entry.id) === Number(id) && Number(entry.qty || 0) > 0);
    if (!item) continue;
    item.qty = Number(item.qty || 0) - 1;
    consumed.push(item.name || `item ${id}`);
  }
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  return consumed;
}

function inventoryQty(game, id) {
  return (game.inventory || [])
    .filter((item) => Number(item.id) === Number(id))
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function mapReply(game, npc) {
  const map = currentMap(game);
  const exits = map.exits.map((exit) => exit.label).join("、") || "暂无出口";
  recordNpcVmEvent(game, npc, "say", "ok", { topic: "map", mapId: map.id });
  return `当前地图是${map.name}。出口：${exits}。`;
}

function isHealerNpc(npc) {
  return /healer/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isSavePointNpc(npc) {
  return /savepoint|save/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isWarpNpc(npc) {
  return Boolean(npc.warp?.target) || /warp/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isTransportNpc(npc) {
  return /bus|巴士|客运|客運|长毛象|長毛象/i.test(`${npc.name || ""} ${npc.type || ""} ${npc.template || ""} ${npc.script || ""}`);
}

function npcTeleportInfoReply(game, npc, text) {
  const map = currentMap(game);
  const targetMap = chooseWorldMapFromPrompt(text);
  const directExit = targetMap ? map.exits.find((exit) => String(exit.to) === String(targetMap.id)) : chooseGuideExit(game, text);
  recordNpcVmEvent(game, npc, "say", "ok", {
    reason: "ai-teleport-info",
    targetMapId: targetMap?.id || "",
    directExitId: directExit?.id || ""
  });
  if (directExit) {
    return `${npc.name} 认真想了想：我不是传送师，不能直接把你瞬移过去。不过这张地图有「${directExit.label}」，从那里可以到 ${WORLD.maps[directExit.to]?.name || directExit.to}。你可以让右侧 AI 向导帮你瞬移，或自己走这个出口。`;
  }
  const exits = map.exits.map((exit) => exit.label).slice(0, 6).join("、") || "当前地图没有出口";
  if (targetMap) {
    return `${npc.name} 认真想了想：${targetMap.name} 确实在地图资料里，但我这个 NPC 没有传送脚本，不能直接瞬移你。当前可走出口是：${exits}。`;
  }
  return `${npc.name} 没听清你想瞬移到哪里。可以说完整地点名，例如“玛丽娜丝渔村”，也可以用右侧 AI 向导直接请求传送。当前可走出口是：${exits}。`;
}

function isNpcEnemy(npc) {
  return Boolean(npc?.npcEnemy) || /npcenemy/i.test(`${npc?.type || ""} ${npc?.template || ""}`);
}

function npcEnemyAskMessage(npc) {
  return npc?.npcEnemy?.askBattleMessages?.find(Boolean)
    || npcDialogueLines(npc).find(Boolean)
    || "如果能赢过我的话就让你通过。要决胜负吗？";
}

function npcEnemyDeniedMessage(npc) {
  return npc?.npcEnemy?.deniedMessage || "有什么事吗？";
}

function npcEnemyStartMessage(npc) {
  return npc?.npcEnemy?.startMessage || "来吧！";
}

function npcInitialDialogMessages(game, npc) {
  if (isNpcEnemy(npc)) {
    runNpcVmAction(game, npc, {
      type: "window",
      reason: "npcenemy-start",
      windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
      buttons: "YESNO",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    return [npcMessage("npc", npcEnemyAskMessage(npc))];
  }
  return [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", runNpcTalk(game, npc, "hi"))
  ];
}

function openNpcEnemyStartWindow(game, npc) {
  openDialog(game, npc, npcInitialDialogMessages(game, npc));
}

function eventFlagForNpcAction(npcId, action) {
  return stableFlag(`${npcId}:${action}`);
}

function fallbackNpcReply(npc) {
  return npcDialogueLines(npc)[0] || `脚本入口：${npc.script || npc.template || npc.source || "未配置"}`;
}

function tradeReply(game, npc) {
  const items = availableTradeItems(game, npc).slice(0, 8);
  const discount = shopDiscountForNpc(game, npc);
  recordNpcVmEvent(game, npc, "shop", items.length ? "ok" : "unsupported", { items: items.length, source: npc.trade?.source || "", discountPercent: discount?.percent || 0 });
  if (!items.length) return `${npc.name} 没有可解析的商品清单。`;
  const priceText = (item) => {
    const price = discountedShopPrice(game, npc, item);
    const sourcePrice = Number(item.price || item.cost || 0);
    return discount && price < sourcePrice ? `${sourcePrice}->${price}石币` : `${price}石币`;
  };
  return [
    npc.trade.mainMessage || "欢迎光临！",
    `可购买：${items.map((item) => `${item.name}(${priceText(item)})`).join("、")}`,
    discount ? `这次 AI 协商优待：${discount.percent}% 折扣，临时有效。` : "",
    `商品来源：${npc.trade.source}`
  ].filter(Boolean).join("\n");
}

function sourceReply(game, npc) {
  const debug = npcDebugInfo(npc);
  recordNpcVmEvent(game, npc, "debug", "ok", { actions: debug.actions });
  return [
    `来源：${debug.source || "未配置"}`,
    `脚本：${debug.script || "未配置"}；template：${debug.template || "未配置"}；type：${debug.type || "未配置"}`,
    `动作：${debug.actions.length ? debug.actions.join("、") : "未归类"}`
  ].join("\n");
}

async function aiNpcReply(env, game, npc, text) {
  const action = inferNpcAiAction(game, npc, text);
  if (action) return applyNpcAiAction(game, npc, action);

  const map = currentMap(game);
  const debug = npcDebugInfo(npc, game);
  const messages = [
    { role: "system", content: "你是石器时代单人 PWA 里的 NPC。必须保持当前 NPC 的身份、职业和原 gmsv 脚本线索，只根据 JSON 回答。中文，1-2 句。你可以商量信息、优惠或帮助，但不能直接执行状态变化；所有交易、传送、奖励、flag、避敌效果和战斗都必须由 Worker 的确定性 NPC VM 校验执行。不要编造与你身份不符的物品、地点或任务。" },
    { role: "user", content: JSON.stringify({
      npc: {
        id: npc.id,
        name: npc.name,
        type: npc.type,
        dialogue: npc.dialogue,
        source: npc.source,
        script: npc.script,
        actions: debug.actions,
        questIds: npcQuestIds(npc),
        questLead: npc.questLead || null,
        scriptHints: npc.scriptHints || null,
        trade: npc.trade ? { items: npc.trade.items?.slice(0, 8).map((item) => item.name) || [], source: npc.trade.source } : null,
        warp: npc.warp || null
      },
      vm: { allowedActions: debug.allowedActions, recentTrace: debug.vmTrace },
      player: game.player,
      map: {
        id: map.id,
        name: map.name,
        position: [game.location.x, game.location.y],
        exits: map.exits.map((exit) => ({ label: exit.label, to: exit.to, targetMapName: WORLD.maps[exit.to]?.name || "", distance: distanceToExit(exit, game.location.x, game.location.y) })).slice(0, 12),
        nearbyNpcs: nearbyState(game, map).npcs
      },
      quests: game.quests,
      pets: game.pets.map(petSummary),
      inventory: inventoryState(game),
      effects: game.effects || {},
      text
    }) }
  ];
  if (env.AI && typeof env.AI.run === "function") {
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    try {
      const rsp = await env.AI.run(model, { messages });
      recordNpcVmEvent(game, npc, "say", "ok", { reason: "ai-npc", model });
      return rsp.response || rsp.text || localNpcAiFallback(game, npc, text);
    } catch (error) {
      recordNpcVmEvent(game, npc, "say", "blocked", { reason: "ai-npc-error", error: error?.message || "AI binding failed" });
      return localNpcAiFallback(game, npc, text, error);
    }
  }
  recordNpcVmEvent(game, npc, "say", "ok", { reason: "ai-npc-local" });
  return localNpcAiFallback(game, npc, text);
}

function localNpcAiFallback(game, npc, text, error = null) {
  const intro = error ? `${npc.name} 低声说：我现在只能按本地规则回答。` : `${npc.name} 想了想：`;
  const role = npcActionProfile(npc);
  if (isNpcEnemy(npc)) {
    return `${intro}我是守路的 NPCEnemy。你可以按原版方式选“是”开战；也可以试着贿赂或威胁，但是否让路会看你的等级、石币和临时状态。`;
  }
  if (npc.trade?.items?.length) {
    const samples = npc.trade.items.slice(0, 5).map((item) => item.name).join("、");
    return `${intro}我这里能谈交易，货架上有 ${samples || "商品"}。想要折扣、柜台后面的东西可以直接说，但物品必须符合我的店铺身份。`;
  }
  if (isWarpNpc(npc)) {
    const target = npc.warp?.target;
    const targetName = target ? WORLD.maps[target.mapId]?.name || `floor ${target.mapId}` : "目标地图";
    return `${intro}我有传送脚本，能按条件送你去 ${targetName}。输入“传送”会走原版 WARP 条件；想商量也可以先说原因。`;
  }
  if (npc.questLead) {
    return `${intro}${npc.questLead.title}：${npc.questLead.summary}\n来源：${npc.questLead.source}`;
  }
  if (role.includes("heal")) return `${intro}我主要负责治疗。你可以说“治疗”，费用和效果会由 Worker 的 NPC VM 校验。`;
  if (role.includes("save")) return `${intro}我主要负责记录进度。你可以说“记录”或“存档”。`;
  return `${intro}我能聊地图、任务线索和附近 NPC。更具体地说“出口”“任务”“能不能帮我避敌”，我会按当前脚本身份回答。`;
}

function inferNpcAiAction(game, npc, text) {
  const lower = String(text || "").toLowerCase();
  if (isTeleportRequest(lower)) {
    if (isWarpNpc(npc) || isTransportNpc(npc)) return { type: "warp", text: lower };
    return { type: "teleportInfo", text: lower };
  }
  if (hasAny(lower, ["避敌", "不会遇到", "野外敌人", "不遇敌", "免遇敌", "安全通过", "护送"])) {
    return { type: "noEncounter", seconds: aiNoEncounterSeconds(game, npc, lower) };
  }
  if (npc.trade?.items?.length && hasAny(lower, ["打折", "折扣", "便宜", "优惠", "優待", "优待", "少一点", "少一點"])) {
    return { type: "shopDiscount", percent: aiShopDiscountPercent(game, npc, lower), seconds: 600 };
  }
  if (npc.trade?.items?.length && hasAny(lower, ["平时不卖", "平常不卖", "隐藏", "有没有", "能不能给", "给我", "卖我", "要一个", "要把", "特殊", "稀有"])) {
    return { type: "offMenuItem", text: lower };
  }
  if (isNpcEnemy(npc) && hasAny(lower, ["贿赂", "收钱", "买路", "给你石币", "给钱", "威胁", "恐吓", "让我过去", "放我过去", "让开"])) {
    return { type: "negotiatePass", text: lower };
  }
  if ((isWarpNpc(npc) || isTransportNpc(npc)) && hasAny(lower, ["商量传送", "商量坐车", "去别的地图", "去其他地图", "出发", "前往", "bus", "巴士", "传送", "傳送"])) {
    return { type: "warp", text: lower };
  }
  return null;
}

function aiNoEncounterSeconds(game, npc, text) {
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "商量", "帮"]);
  const base = polite ? 240 : 150;
  const levelBonus = Math.min(90, Math.max(0, Number(game.player.level || 1) - 1) * 5);
  const serviceNpc = npc.trade || isHealerNpc(npc) || isSavePointNpc(npc) || isWarpNpc(npc);
  return clampInt(base + levelBonus + (serviceNpc ? 60 : 0), 90, 420, 180);
}

function aiShopDiscountPercent(game, npc, text) {
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "商量", "帮"]);
  const loyalCustomer = Number(game.player.level || 1) >= 5 || Number(game.player.stone || 0) >= 1000;
  return clampInt(10 + (polite ? 5 : 0) + (loyalCustomer ? 5 : 0), 5, 25, 10);
}

function applyNpcAiAction(game, npc, action) {
  recordNpcVmEvent(game, npc, "debug", "ok", { reason: "ai-action-proposal", action: action.type });
  if (action.type === "warp") {
    if (isWarpNpc(npc)) {
      const reply = warpNpcReply(game, npc);
      return `${npc.name} 听完你的请求，决定按原版传送脚本处理。\n${reply}`;
    }
    const teleport = chooseGuideTeleport(game, action.text || "");
    if (!teleport) return `${npc.name} 摇摇头：我能帮你坐车，但你得说清楚要去哪个村或地图。`;
    const targetMap = teleport.exit ? WORLD.maps[teleport.exit.to] : WORLD.maps[teleport.target.mapId];
    if (teleport.exit) applyExit(game, teleport.exit);
    else applyWarpTarget(game, teleport.target, `${npc.name} 帮忙传送`);
    recordNpcVmEvent(game, npc, "warp", "ok", {
      reason: "ai-transport-npc",
      mapId: targetMap?.id,
      source: npc.script || npc.source || ""
    });
    return `${npc.name} 听完你的请求，答应帮你过去。\n你来到了 ${targetMap?.name || "目标地图"}。`;
  }
  if (action.type === "teleportInfo") {
    return npcTeleportInfoReply(game, npc, action.text || "");
  }
  if (action.type === "noEncounter") {
    const seconds = clampInt(action.seconds, 30, 600, 180);
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "noEncounter",
      seconds,
      reason: "ai-negotiation",
      source: "npc-ai-worker-guard"
    });
    if (!event.ok) return `${npc.name} 没能给出这个优待：${event.error || "effect 被 VM 拒绝"}。`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    const duration = rest ? `${minutes}分${rest}秒` : `${minutes}分钟`;
    return `${npc.name} 接受了你的说法，暂时帮你避开野外敌人 ${duration}。这只是 AI 协商后的 Worker 效果，不会改动原版遇敌表。`;
  }
  if (action.type === "shopDiscount") {
    const percent = clampInt(action.percent, 5, 30, 10);
    const seconds = clampInt(action.seconds, 60, 1200, 600);
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "shopDiscount",
      npcId: npc.id,
      percent,
      seconds,
      reason: "ai-negotiation",
      source: npc.trade?.source || "npc-ai-worker-guard"
    });
    if (!event.ok) return `${npc.name} 没能给出这个优惠：${event.error || "effect 被 VM 拒绝"}。`;
    return `${npc.name} 点点头：这次给你 ${percent}% 的临时优惠。价格仍按原版商品表读取，只在结账时由 Worker 校验折扣。`;
  }
  if (action.type === "offMenuItem") {
    const offer = chooseRoleFitOffMenuItem(game, npc, action.text || "");
    if (!offer.item) {
      recordNpcVmEvent(game, npc, "shop", "blocked", { action: "offMenu", reason: offer.reason, role: offer.role, text: String(action.text || "").slice(0, 80) });
      return roleMismatchReply(npc, offer);
    }
    if (offer.mode === "gift") {
      const giftKey = `${npc.id}:${offer.item.id}`;
      game.effects ||= {};
      game.effects.npcGifts ||= {};
      if (game.effects.npcGifts[giftKey]) return `${npc.name} 摇摇头：刚才已经给过你了，店里的东西也要留着做生意。`;
      const given = runNpcVmAction(game, npc, {
        type: "give",
        item: offer.item,
        itemId: offer.item.id,
        itemName: offer.item.name,
        qty: 1,
        reason: "ai-off-menu-gift"
      });
      if (!given.ok) return `${npc.name} 想给你 ${offer.item.name}，但 ${given.error || "背包放不下"}。`;
      game.effects.npcGifts[giftKey] = Date.now();
      return `${npc.name} 从柜台后面拿出 ${offer.item.name} 给你。${offer.explain}这是角色相符的小人情，不会凭空生成店外物品。`;
    }
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "offMenuShop",
      npcId: npc.id,
      item: offer.item,
      price: offer.price,
      seconds: 600,
      reason: "ai-off-menu-sale",
      source: offer.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
    });
    if (!event.ok) return `${npc.name} 找到了 ${offer.item.name}，但 ${event.error || "不能摆上临时商品栏"}。`;
    return `${npc.name} 翻了翻柜台后面：可以临时卖你 ${offer.item.name}，价格 ${offer.price} 石币。${offer.explain}输入“买东西”或点商品栏就能购买。`;
  }
  if (action.type === "negotiatePass") {
    return npcEnemyNegotiationReply(game, npc, action.text || "");
  }
  return fallbackNpcReply(npc);
}

function openDialog(game, npc, messages) {
  const debug = npcDebugInfo(npc, game);
  game.dialog = {
    open: true,
    npcId: npc.id,
    npcName: npc.name,
    npcType: npc.type,
    trade: npc.trade ? withTradeState(game, npc.trade, npc) : null,
    warp: npc.warp || null,
    aiMode: isNpcAiMode(game, npc),
    messages: messages.slice(-12),
    suggestions: dialogSuggestions(npc, game),
    source: dialogSourceLine(debug),
    debug
  };
}

function npcDebugInfo(npc, game = null) {
  const actions = npcActionProfile(npc);
  return {
    source: npc.source || "",
    script: npc.script || "",
    template: npc.template || "",
    type: npc.type || "",
    graphic: npc.graphic || "",
    actions,
    allowedActions: actions.filter((action) => NPC_VM_ACTIONS.has(action)),
    supportedActions: [...NPC_VM_ACTIONS],
    vmTrace: game ? recentNpcVmEvents(game, npc) : [],
    talkFlow: "gmsv CHAR_Talk -> NPC talkedfunc; browser click sends P|hi"
  };
}

function dialogSourceLine(debug) {
  const parts = [];
  if (debug.source) parts.push(debug.source);
  if (debug.script && debug.script !== debug.source) parts.push(debug.script);
  if (debug.template && debug.template !== debug.script) parts.push(`template:${debug.template}`);
  if (debug.actions?.length) parts.push(`actions:${debug.actions.join("/")}`);
  return parts.join(" | ") || "参考 gmsv：点击 NPC 后客户端自动送出 P|hi，再由 CHAR_Talk 触发 NPC talkedfunc";
}

function npcActionProfile(npc) {
  const actions = [];
  if (isNpcEnemy(npc)) actions.push("window", "startBattle", "battleAction");
  if (npc.trade?.items?.length || /shop/i.test(`${npc.type} ${npc.template}`)) actions.push("shop");
  if (npc.warp?.target || /warp/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("warp");
  if (isHealerNpc(npc)) actions.push("heal");
  if (isSavePointNpc(npc)) actions.push("save");
  if (npcQuestIds(npc).length || npc.questLead) actions.push("quest");
  if (npcDialogueLines(npc).length || /timeman|town|msg|sign/i.test(`${npc.type} ${npc.template}`)) actions.push("say");
  if (!isNpcEnemy(npc)) actions.push("effect");
  return [...new Set(actions)];
}

function recordNpcVmEvent(game, npc, action, status = "ok", detail = {}) {
  game.npcVmEvents ||= [];
  const supported = NPC_VM_ACTIONS.has(action);
  const event = {
    at: new Date().toISOString(),
    npcId: npc.id,
    npcName: npc.name,
    action: supported ? action : "unsupported",
    status: supported ? status : "unsupported",
    supported,
    source: npc.source || "",
    script: npc.script || "",
    template: npc.template || "",
    type: npc.type || "",
    detail: supported ? detail : { ...detail, originalAction: action }
  };
  game.npcVmEvents.push(event);
  game.npcVmEvents = game.npcVmEvents.slice(-40);
  return event;
}

function runNpcVmAction(game, npc, action = {}) {
  const type = String(action.type || action.action || "");
  const status = String(action.status || "ok");
  const mutation = applyNpcVmMutation(game, type, action);
  const event = recordNpcVmEvent(
    game,
    npc,
    type,
    mutation.ok ? status : "blocked",
    npcVmActionDetail(action, mutation)
  );
  event.ok = mutation.ok;
  if (mutation.error) event.error = mutation.error;
  return event;
}

function applyNpcVmMutation(game, type, action) {
  if (!NPC_VM_ACTIONS.has(type)) return { ok: false, mutated: false, error: `unsupported action: ${type || "empty"}` };
  if (type === "setFlag") {
    if (!action.shiftbit) return { ok: true, mutated: false };
    setEventFlag(game, action.shiftbit, action.kind || "end");
    return { ok: true, mutated: true };
  }
  if (type === "take") return applyNpcVmTake(game, action);
  if (type === "give") return applyNpcVmGive(game, action);
  if (type === "effect") return applyNpcVmEffect(game, action);
  if (type === "startBattle") return applyNpcVmStartBattle(game, action);
  if (type === "battleAction") return applyNpcVmBattleAction(game, action);
  return { ok: true, mutated: false };
}

function applyNpcVmEffect(game, action) {
  game.effects ||= {};
  if (action.effect === "shopDiscount") {
    if (!action.npcId) return { ok: false, mutated: false, error: "shopDiscount 缺少 npcId" };
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 60, 1200, 600);
    const percent = clampInt(action.percent, 5, 30, 10);
    game.effects.shopDiscounts ||= {};
    game.effects.shopDiscounts[action.npcId] = {
      percent,
      until: Date.now() + seconds * 1000,
      reason: action.reason || "npc-effect",
      source: action.source || ""
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, percent, seconds };
  }
  if (action.effect === "offMenuShop") {
    if (!action.npcId || !action.item) return { ok: false, mutated: false, error: "offMenuShop 缺少 npcId 或 item" };
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 60, 1200, 600);
    const item = {
      ...action.item,
      price: Math.max(1, Number(action.price || action.item.price || action.item.cost || 1)),
      offMenu: true,
      source: action.source || action.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
    };
    game.effects.offMenuShop ||= {};
    game.effects.offMenuShop[action.npcId] = {
      until: Date.now() + seconds * 1000,
      reason: action.reason || "npc-effect",
      source: action.source || "",
      items: [item]
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, itemId: item.id, itemName: item.name, price: item.price, seconds };
  }
  if (action.effect === "npcBypass") {
    if (!action.npcId) return { ok: false, mutated: false, error: "npcBypass 缺少 npcId" };
    ensureFlags(game);
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 30, 1200, 300);
    game.flags.npcEnemyDefeats[action.npcId] = {
      until: new Date(Date.now() + seconds * 1000).toISOString(),
      mode: action.mode || "negotiation",
      source: action.source || "",
      reason: action.reason || "npc-effect"
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, seconds, mode: action.mode || "negotiation" };
  }
  if (action.effect !== "noEncounter") return { ok: false, mutated: false, error: `unsupported effect: ${action.effect || "empty"}` };
  const seconds = clampInt(action.seconds ?? action.durationSeconds, 30, 600, 180);
  const until = Math.max(Number(game.effects.noEncounterUntil || 0), Date.now() + seconds * 1000);
  game.effects.noEncounterUntil = until;
  game.effects.noEncounterReason = action.reason || "npc-effect";
  game.effects.noEncounterSource = action.source || "";
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.encounterSteps = 0;
  return { ok: true, mutated: true, effect: action.effect, seconds, until };
}

function applyNpcVmTake(game, action) {
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  if (qty <= 0) return { ok: true, mutated: false };
  const key = npcVmItemKey(action);
  if (isStoneKey(key)) {
    if (Number(game.player.stone || 0) < qty) return { ok: false, mutated: false, error: "石币不够" };
    game.player.stone = Number(game.player.stone || 0) - qty;
    syncStoneItem(game);
    return { ok: true, mutated: true };
  }
  if (action.itemId != null || (typeof action.item === "object" && action.item?.id != null)) {
    const id = Number(action.itemId ?? action.item.id);
    const item = game.inventory?.find((entry) => Number(entry.id) === id && Number(entry.qty || 0) > 0);
    if (!item || Number(item.qty || 0) < qty) return { ok: false, mutated: false, error: "道具不足" };
    item.qty = Number(item.qty || 0) - qty;
    game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
    return { ok: true, mutated: true };
  }
  return { ok: true, mutated: false };
}

function applyNpcVmGive(game, action) {
  let mutated = false;
  const exp = npcVmAmount(action.exp, 0);
  if (exp > 0) {
    game.player.exp = Number(game.player.exp || 0) + exp;
    mutated = true;
  }
  const stone = npcVmAmount(action.stone, 0);
  if (stone > 0) {
    game.player.stone = Number(game.player.stone || 0) + stone;
    syncStoneItem(game);
    mutated = true;
  }
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  const item = npcVmGiveItem(action);
  if (item && qty > 0) {
    if (isStoneKey(item.id)) {
      game.player.stone = Number(game.player.stone || 0) + qty;
      syncStoneItem(game);
      mutated = true;
    } else {
      if (!canCarryItem(game, item)) return { ok: false, mutated, error: `背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具` };
      addInventoryItem(game, item, qty);
      mutated = true;
    }
  }
  return { ok: true, mutated };
}

function applyNpcVmStartBattle(game, action) {
  if (!action.enemy) return { ok: false, mutated: false, error: "没有可用的遇敌资料" };
  const enemyParty = Array.isArray(action.enemies) && action.enemies.length
    ? action.enemies.map((enemy) => ({ ...enemy }))
    : [{ ...action.enemy }];
  game.encounter = enemyParty[0];
  game.battle = null;
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.encounterSteps = 0;
  const activePet = game.pets?.[0];
  if (activePet) {
    ensureBattleState(game, activePet, game.encounter);
    if (game.battle) {
      game.battle.source = action.source
        ? `npc-action-vm startBattle from ${action.source}`
        : `npc-action-vm startBattle from ${GMSV_DATA_SOURCE}/encount.txt`;
      game.battle.enemyParty = enemyParty;
      game.battle.activeEnemyIndex = 0;
      game.battle.defeatedEnemies = [];
    }
  }
  return { ok: true, mutated: true };
}

function applyNpcVmBattleAction(game, action) {
  try {
    const outcome = performBattleAction(game, action.move || action.battleAction || "attack");
    return { ok: true, mutated: true, outcome };
  } catch (error) {
    return { ok: false, mutated: false, error: error.message || "战斗动作失败" };
  }
}

function npcVmActionDetail(action, mutation) {
  const { type: _type, action: _action, status: _status, item, enemy, ...detail } = action;
  const out = {
    executor: "npc-action-vm",
    ...detail,
    mutated: Boolean(mutation.mutated)
  };
  if (item != null && typeof item === "object") {
    if (out.itemId == null && item.id != null) out.itemId = item.id;
    if (out.itemName == null && item.name) out.itemName = item.name;
  } else if (item != null) {
    out.item = item;
  }
  if (enemy && typeof enemy === "object") {
    out.enemyNo = enemy.No;
    out.enemyId = enemy.EnemyId;
    out.enemyTempNo = enemy.EnemyTempNo;
    out.enemyName = enemy.Name;
    out.enemyLevel = enemy.Lv;
    out.enemyImage = enemy.ImgNo;
    out.captureRate = enemy.CaptureRate;
  }
  if (mutation.outcome) {
    out.outcome = {
      result: mutation.outcome.result,
      enemyName: mutation.outcome.enemyName,
      petName: mutation.outcome.petName,
      exp: mutation.outcome.exp,
      stone: mutation.outcome.stone,
      rate: mutation.outcome.rate,
      itemUse: mutation.outcome.itemUse,
      defeatedEnemies: mutation.outcome.defeatedEnemies,
      nextEnemyName: mutation.outcome.nextEnemyName,
      log: mutation.outcome.log
    };
  }
  if (mutation.error) out.error = mutation.error;
  return out;
}

function npcVmAmount(value, fallback) {
  const amount = Number(value ?? fallback);
  if (!Number.isFinite(amount)) return fallback;
  return Math.max(0, Math.floor(amount));
}

function npcVmItemKey(action) {
  if (action.item != null && typeof action.item === "object") return action.item.id;
  return action.item ?? action.itemId ?? action.itemName;
}

function npcVmGiveItem(action) {
  if (action.item != null && typeof action.item === "object") return action.item;
  if (action.itemId == null && action.item == null) return null;
  if (isStoneKey(action.item)) return { id: "stone", name: "石币" };
  return {
    id: action.itemId ?? action.item,
    name: action.itemName || `item ${action.itemId ?? action.item}`,
    image: action.image,
    type: action.itemType || action.typeName,
    useField: action.useField,
    target: action.target,
    level: action.level,
    price: action.price,
    cost: action.cost,
    description: action.description
  };
}

function isStoneKey(value) {
  const key = String(value ?? "").toLowerCase();
  return key === "stone" || key === "stones" || key === "石币";
}

function recentNpcVmEvents(game, npc) {
  return (game.npcVmEvents || [])
    .filter((event) => event.npcId === npc.id)
    .slice(-8);
}

function availableTradeItems(game, npc) {
  const base = npc.trade?.items || [];
  const extras = activeOffMenuItems(game, npc);
  const seen = new Set();
  return [...base, ...extras].filter((item) => {
    const key = Number(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function activeOffMenuItems(game, npc) {
  const entry = game.effects?.offMenuShop?.[npc.id];
  if (!entry) return [];
  const until = Number(entry.until || 0);
  if (!Number.isFinite(until) || until <= Date.now()) {
    if (game.effects?.offMenuShop) delete game.effects.offMenuShop[npc.id];
    return [];
  }
  return (entry.items || []).map((item) => ({ ...item, offMenu: true, offMenuUntil: until }));
}

function withTradeState(game, trade, npc = null) {
  const state = inventoryState(game);
  const discount = npc ? shopDiscountForNpc(game, npc) : null;
  const items = npc ? availableTradeItems(game, npc) : (trade.items || []);
  return {
    ...trade,
    discount,
    inventory: state,
    items: items.map((item) => ({
      ...item,
      sourcePrice: Number(item.price || item.cost || 0),
      discountPrice: npc ? discountedShopPrice(game, npc, item) : Number(item.price || item.cost || 0),
      discountPercent: discount?.percent || 0,
      price: npc ? discountedShopPrice(game, npc, item) : Number(item.price || item.cost || 0),
      affordable: game.player.stone >= (npc ? discountedShopPrice(game, npc, item) : Number(item.price || item.cost || 0)),
      canCarry: canCarryItem(game, item)
    }))
  };
}

function shopDiscountForNpc(game, npc) {
  const entry = game.effects?.shopDiscounts?.[npc.id];
  if (!entry) return null;
  const until = Number(entry.until || 0);
  if (!Number.isFinite(until) || until <= Date.now()) {
    if (game.effects?.shopDiscounts) delete game.effects.shopDiscounts[npc.id];
    return null;
  }
  const percent = clampInt(entry.percent, 0, 30, 0);
  return percent > 0 ? { ...entry, percent, until } : null;
}

function discountedShopPrice(game, npc, item) {
  const sourcePrice = Math.max(0, Number(item.price || item.cost || 0));
  const discount = shopDiscountForNpc(game, npc);
  if (!discount || sourcePrice <= 0) return sourcePrice;
  return Math.max(1, Math.floor(sourcePrice * (100 - discount.percent) / 100));
}

function chooseRoleFitOffMenuItem(game, npc, text) {
  const role = npcShopRole(npc);
  const sold = new Set((npc.trade?.items || []).map((item) => Number(item.id)));
  const queryTags = requestedItemTags(text);
  if (role.includes("meat") && queryTags.includes("knife")) {
    return { item: null, role, reason: "working-tool", queryTags };
  }
  const candidates = worldTradeItems()
    .filter((item) => !sold.has(Number(item.id)))
    .map((item) => ({ item, score: roleItemScore(role, item, queryTags, text) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(a.item.price || a.item.cost || 0) - Number(b.item.price || b.item.cost || 0));
  const entry = candidates[0];
  if (!entry) return { item: null, role, reason: queryTags.length ? "role-mismatch" : "no-hidden-item", queryTags };
  const item = {
    ...entry.item,
    source: entry.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
  const basePrice = Math.max(1, Number(item.price || item.cost || 1));
  const mode = shouldGiftOffMenuItem(game, npc, item, text) ? "gift" : "sale";
  const price = mode === "gift" ? 0 : Math.max(1, Math.round(basePrice * 1.2));
  return {
    item: { ...item, price },
    price,
    mode,
    role,
    explain: offMenuExplain(npc, item, role)
  };
}

function npcShopRole(npc) {
  const text = `${npc.name || ""} ${npc.type || ""} ${npc.template || ""} ${npc.script || ""} ${(npc.trade?.items || []).map((item) => `${item.name} ${item.description} ${item.type}`).join(" ")}`;
  const roles = [];
  if (/肉/.test(text) || (npc.trade?.items || []).some((item) => /肉/.test(`${item.name} ${item.description}`))) roles.push("meat");
  if (/药|藥|医|醫|耐久|气力|復活|复活/.test(text)) roles.push("medicine");
  if (/武器|斧|枪|槍|棍|棒|爪|弓|投掷/.test(text) || (npc.trade?.items || []).some((item) => Number(item.type) === 1)) roles.push("weapon");
  if (/防具|兜|铠|鎧|衣|帽|甲/.test(text)) roles.push("armor");
  if (/首饰|首飾|戒|项链|項鍊/.test(text)) roles.push("accessory");
  if (/素材|石|木|矿|礦|草|皮/.test(text)) roles.push("material");
  if (/宠|寵|饲|飼|pet|skill/i.test(text)) roles.push("pet");
  return roles.length ? [...new Set(roles)] : ["general"];
}

function requestedItemTags(text) {
  const out = [];
  const pairs = [
    ["knife", /刀/],
    ["meat", /肉/],
    ["medicine", /药|藥|耐久|气力|復活|复活/],
    ["weapon", /武器|斧|枪|槍|棍|棒|爪|弓|投掷/],
    ["armor", /防具|兜|铠|鎧|衣|帽|甲/],
    ["accessory", /首饰|首飾|戒|项链|項鍊/],
    ["material", /素材|石|木|矿|礦|草|皮/],
    ["pet", /宠|寵|饲|飼|技能/],
    ["stat", /能力|攻击|攻|防御|防|敏捷|敏|加成/]
  ];
  for (const [tag, pattern] of pairs) {
    if (pattern.test(text)) out.push(tag);
  }
  return out;
}

function roleItemScore(role, item, queryTags, text) {
  const itemText = `${item.name || ""} ${item.description || ""}`;
  const itemTags = itemRoleTags(item);
  let score = 0;
  for (const tag of role) {
    if (itemTags.includes(tag)) score += 8;
  }
  for (const tag of queryTags) {
    if (tag === "stat" && /攻|防|敏|耐久|气力/.test(itemText)) score += 4;
    else if (itemTags.includes(tag)) score += 10;
  }
  if (queryTags.includes("knife") && !/刀/.test(itemText)) score -= 20;
  if (/平时不卖|平常不卖|隐藏|特殊|稀有/.test(text)) score += 2;
  return score;
}

function itemRoleTags(item) {
  const text = `${item.name || ""} ${item.description || ""}`;
  const tags = [];
  if (/肉/.test(text)) tags.push("meat");
  if (/药|藥|耐久|气力|復活|复活/.test(text)) tags.push("medicine");
  if (/斧|枪|槍|棍|棒|爪|弓|投掷|刀/.test(text) || Number(item.type) === 1) tags.push("weapon");
  if (/兜|铠|鎧|衣|帽|甲/.test(text)) tags.push("armor");
  if (/首饰|首飾|戒|项链|項鍊/.test(text)) tags.push("accessory");
  if (/石|木|矿|礦|草|皮|素材/.test(text)) tags.push("material");
  if (/宠|寵|饲|飼|技能/.test(text)) tags.push("pet");
  if (/攻|防|敏|耐久|气力/.test(text)) tags.push("stat");
  return [...new Set(tags)];
}

function shouldGiftOffMenuItem(game, npc, item, text) {
  const cheap = Number(item.price || item.cost || 0) <= 60;
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "帮"]);
  return cheap && polite && /给|送|要/.test(text) && !/买|卖/.test(text);
}

function offMenuExplain(npc, item, role) {
  if (role.includes("meat")) return "肉店只会拿出肉类和恢复用食物；";
  if (role.includes("weapon")) return "武器店只会拿出武器架上同类装备；";
  if (role.includes("medicine")) return "药店只会拿出药剂和恢复品；";
  if (role.includes("material")) return "素材店只会拿出石、木、矿草皮这类材料；";
  if (role.includes("armor")) return "防具店只会拿出兜、铠和护具；";
  if (role.includes("accessory")) return "饰品店只会拿出首饰和戒指；";
  return `${npc.name} 只会拿出和自己业务相符的东西；`;
}

function roleMismatchReply(npc, offer) {
  if (offer.queryTags?.includes("knife") && offer.role?.includes("meat")) {
    return `${npc.name} 把刀往身后收了收：我是卖肉的，切肉刀是吃饭工具，不能卖也不能送。你可以问我要肉或恢复用的食物。`;
  }
  const roleText = (offer.role || []).filter((item) => item !== "general").join("、") || "本职";
  return `${npc.name} 想了想：这件事不太符合我的身份。可以继续探索，找更合适的 NPC；我这里能谈的范围是 ${roleText}。`;
}

function npcEnemyNegotiationReply(game, npc, text) {
  if (!isNpcEnemy(npc)) return `${npc.name} 不负责守路，没法通过贿赂或威胁改变地图通行。`;
  const threat = hasAny(text, ["威胁", "恐吓", "吓", "打服", "揍"]);
  if (threat) {
    const strongEnough = Number(game.player.level || 1) >= 10 || (game.pets || []).some((pet) => Number(pet.Lv || 1) >= 10);
    recordNpcVmEvent(game, npc, "debug", strongEnough ? "ok" : "blocked", { reason: "ai-threat", strongEnough });
    if (!strongEnough) return `${npc.name} 冷笑了一声：这种话对守路的人没用。想过去就按原版规则决胜负，或拿出足够的石币谈。`;
  }
  const cost = threat ? 0 : Math.max(80, Number(game.player.level || 1) * 40);
  if (cost > 0 && Number(game.player.stone || 0) < cost) {
    recordNpcVmEvent(game, npc, "take", "blocked", { reason: "ai-bribe", cost, current: game.player.stone });
    return `${npc.name} 看了一眼你的钱袋：至少 ${cost} 石币才值得我装作没看见。`;
  }
  if (cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "ai-bribe" });
    if (!taken.ok) return `${npc.name} 没有收下：${taken.error || "石币不够"}。`;
  }
  const event = runNpcVmAction(game, npc, {
    type: "effect",
    effect: "npcBypass",
    npcId: npc.id,
    seconds: 300,
    mode: threat ? "threat" : "bribe",
    reason: threat ? "ai-threat" : "ai-bribe",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  if (!event.ok) return `${npc.name} 收了钱，但没能让开：${event.error || "npcBypass 被 VM 拒绝"}。`;
  return threat
    ? `${npc.name} 判断你现在确实不好惹，侧身让开一会儿。通路会打开 5 分钟；这是临时威慑，不会改掉原版 NPCEnemy 的战斗脚本。`
    : `${npc.name} 收下 ${cost} 石币，侧身让开一会儿。通路会打开 5 分钟；这是临时交涉，不会改掉原版 NPCEnemy 的战斗脚本。`;
}

function worldTradeItems() {
  const byId = new Map();
  for (const map of Object.values(WORLD.maps || {})) {
    for (const npc of map.npcs || []) {
      for (const item of npc.trade?.items || []) {
        if (!byId.has(Number(item.id))) {
          byId.set(Number(item.id), {
            ...item,
            price: Number(item.price || item.cost || 0),
            source: item.source || npc.trade.source || npc.source || `${GMSV_DATA_SOURCE}/itemset6.txt`,
            shopNpcName: npc.name,
            shopMapId: map.id
          });
        }
      }
    }
  }
  return [...byId.values()];
}

function dialogSuggestions(npc, game = null) {
  if (game?.encounter && game?.battle?.npcEnemy) return ["攻击", "防御", "道具", "逃跑"];
  if (game?.encounter) return ["攻击", "捕获", "道具", "放走"];
  const aiToggle = isNpcAiMode(game, npc) ? "普通对话" : "AI对话";
  if (isNpcEnemy(npc)) return isNpcAiMode(game, npc)
    ? [aiToggle, "是", "否", "试着交涉"]
    : [aiToggle, "是", "否"];
  const aiHints = isNpcAiMode(game, npc)
    ? ["请求避敌", npc.trade?.items?.length ? "看看柜台后面" : "请求信息", isWarpNpc(npc) ? "试着交涉" : "试着交涉"]
    : [];
  const base = npc.trade || /shop/i.test(npc.type)
    ? ["hi", "买东西", "地图"]
    : /healer/i.test(npc.type)
      ? ["hi", "治疗", "地图"]
      : npc.warp || /warp/i.test(npc.type)
        ? ["hi", "传送", "出口"]
        : /save/i.test(npc.type)
          ? ["hi", "记录", "地图"]
          : ["hi", "任务", "地图"];
  return [...new Set([aiToggle, ...base, ...aiHints])];
}

function addInventoryItem(game, item, qty = 1) {
  game.inventory ||= [];
  const existing = game.inventory.find((entry) => Number(entry.id) === Number(item.id));
  if (existing) {
    existing.qty = Number(existing.qty || 0) + qty;
    return;
  }
  game.inventory.push({
    id: item.id,
    name: item.name,
    qty,
    image: item.image,
    type: item.type,
    useField: item.useField,
    target: item.target,
    level: item.level,
    price: item.price,
    cost: item.cost,
    description: item.description,
    source: `${GMSV_DATA_SOURCE}/itemset6.txt`
  });
}

function canCarryItem(game, item) {
  if (!item || item.id === "stone") return true;
  const id = Number(item.id);
  if (game.inventory?.some((entry) => Number(entry.id) === id)) return true;
  return inventoryState(game).used < INVENTORY_CAPACITY;
}

function inventoryState(game) {
  const used = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0).length;
  return {
    used,
    capacity: INVENTORY_CAPACITY,
    remaining: Math.max(0, INVENTORY_CAPACITY - used),
    source: "gmsv CHAR_MAXITEMNUM=15; stone is currency, not an item slot"
  };
}

function syncStoneItem(game) {
  game.inventory ||= [];
  const stone = game.inventory.find((item) => item.id === "stone");
  if (stone) stone.qty = game.player.stone;
}

function npcMessage(speaker, text) {
  return { speaker, text, at: Date.now() };
}

function buildGuideContext(game, map) {
  const x = Number(game.location.x || 0);
  const y = Number(game.location.y || 0);
  const npcs = (map.npcs || [])
    .map((npc) => ({
      id: npc.id,
      name: npc.name,
      type: npc.type,
      distance: distance(npc.x, npc.y, x, y),
      position: [npc.x, npc.y],
      actions: npcActionProfile(npc),
      questIds: npcQuestIds(npc),
      questLead: npc.questLead || null,
      trade: npc.trade ? {
        itemCount: npc.trade.items?.length || 0,
        sampleItems: (npc.trade.items || []).slice(0, 4).map((item) => item.name)
      } : null,
      warp: npc.warp?.target ? {
        target: npc.warp.target,
        targetMapName: WORLD.maps[npc.warp.target.mapId]?.name || ""
      } : null,
      source: npc.source,
      script: npc.script,
      scriptHints: npc.scriptHints || null
    }))
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name, "zh-Hans"))
    .slice(0, 16);
  const exits = (map.exits || [])
    .map((exit) => ({
      id: exit.id,
      label: exit.label,
      detail: exit.detail,
      distance: distanceToExit(exit, x, y),
      to: exit.to,
      targetMapName: WORLD.maps[exit.to]?.name || "",
      source: exit.source
    }))
    .sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label, "zh-Hans"))
    .slice(0, 16);
  return {
    player: {
      name: game.player.name,
      level: game.player.level,
      exp: game.player.exp,
      hp: game.player.hp,
      maxHp: game.player.maxHp,
      stone: game.player.stone,
      dir: game.player.dir
    },
    location: {
      mapId: map.id,
      floorId: map.floorId,
      name: map.name,
      position: [x, y],
      summary: map.summary,
      canWildEncounter: map.canWildEncounter,
      wildEncounterReason: map.wildEncounterReason
    },
    map: { exits, npcs, nearby: nearbyState(game, map) },
    pets: game.pets.map(petSummary),
    inventory: inventoryState(game),
    effects: guideEffectSummary(game),
    quests: Object.values(game.quests || {}),
    availableQuests: Object.values(WORLD.quests || {}).map((quest) => ({
      id: quest.id,
      title: quest.title,
      steps: quest.steps,
      source: quest.source
    })),
    dialog: game.dialog?.open ? {
      npcId: game.dialog.npcId,
      npcName: game.dialog.npcName,
      aiMode: game.dialog.aiMode,
      source: game.dialog.source,
      recentMessages: (game.dialog.messages || []).slice(-4)
    } : null,
    battle: game.encounter ? {
      enemy: game.encounter.Name,
      level: game.encounter.Lv,
      hp: game.encounter.Hp,
      source: game.battle?.source || game.encounter.source || ""
    } : null,
    recentNpcVmEvents: (game.npcVmEvents || []).slice(-8),
    recentLog: game.log.slice(-8)
  };
}

function guideEffectSummary(game) {
  const now = Date.now();
  const effects = [];
  const noEncounterUntil = Number(game.effects?.noEncounterUntil || 0);
  if (noEncounterUntil > now) {
    effects.push({
      type: "noEncounter",
      secondsLeft: Math.ceil((noEncounterUntil - now) / 1000),
      reason: game.effects?.noEncounterReason || "",
      source: game.effects?.noEncounterSource || ""
    });
  }
  for (const [npcId, discount] of Object.entries(game.effects?.shopDiscounts || {})) {
    if (Number(discount.until || 0) > now) effects.push({
      type: "shopDiscount",
      npcId,
      percent: discount.percent,
      secondsLeft: Math.ceil((discount.until - now) / 1000),
      source: discount.source || ""
    });
  }
  for (const [npcId, entry] of Object.entries(game.effects?.offMenuShop || {})) {
    if (Number(entry.until || 0) > now) effects.push({
      type: "offMenuShop",
      npcId,
      items: (entry.items || []).map((item) => item.name),
      secondsLeft: Math.ceil((entry.until - now) / 1000),
      source: entry.source || ""
    });
  }
  for (const [npcId, entry] of Object.entries(game.flags?.npcEnemyDefeats || {})) {
    const until = Date.parse(entry.until || "");
    if (Number.isFinite(until) && until > now) effects.push({
      type: "npcBypass",
      npcId,
      npcName: entry.npcName || "",
      secondsLeft: Math.ceil((until - now) / 1000),
      source: entry.source || ""
    });
  }
  return effects;
}

function fallbackGuide(context, prompt = "", error = null) {
  const lower = String(prompt || "").toLowerCase();
  const active = context.quests.find((item) => item.status === "进行中");
  const reportable = context.quests.find((item) => item.status === "可回报");
  const nearbyNpc = context.map.nearby.npcs.map((npc) => npc.name).join("、");
  const exits = context.map.exits.slice(0, 5).map((exit) => `${exit.label}${exit.distance <= 2 ? "(附近)" : ""}`).join("、") || "暂无出口";
  const effects = context.effects.map((item) => {
    if (item.type === "noEncounter") return `避敌剩余 ${item.secondsLeft}s`;
    if (item.type === "shopDiscount") return `NPC ${item.npcId} 折扣 ${item.percent}%`;
    if (item.type === "offMenuShop") return `临时商品 ${item.items.join("、")}`;
    if (item.type === "npcBypass") return `${item.npcName || item.npcId} 暂时让路`;
    return item.type;
  }).join("；");
  const aiNote = error ? "远程 AI 暂时不可用，我先按本地规则判断。 " : "";
  if (hasAny(lower, ["任务", "quest"])) {
    if (reportable) return `${aiNote}你现在在${context.location.name}。「${reportable.title}」可以回报了，回到对应 NPC 双击/hi 结算。附近 NPC：${nearbyNpc || "无"}。`;
    if (active) return `${aiNote}你现在在${context.location.name}。继续「${active.title}」：${active.steps[Math.min(active.progress || 0, active.steps.length - 1)]}。出口：${exits}。`;
    return `${aiNote}你现在在${context.location.name}。当前可接任务有：${context.availableQuests.map((quest) => quest.title).join("、")}。先找带 quest 动作的 NPC，通常是老师或剧情 NPC。`;
  }
  if (hasAny(lower, ["地图", "出口", "去哪", "去哪里", "传送", "瞬移"])) {
    return `${aiNote}你在${context.location.name} (${context.location.position.join(",")})。可走出口：${exits}。需要瞬移时可以说“带我去 地图名/floor”，我会优先匹配已经打包进 Worker 的地图。`;
  }
  if (hasAny(lower, ["npc", "对话", "聊天", "任务线索"])) {
    const list = context.map.npcs.slice(0, 6).map((npc) => `${npc.name}[${npc.actions.join("/") || "say"}] 距离${npc.distance}`).join("；");
    return `${aiNote}当前地图 NPC 按距离看：${list || "无"}。距离 2 格内可以双击，AI 对话会参考 NPC 的职业、商品、传送和 gmsv 脚本线索。`;
  }
  if (hasAny(lower, ["遇敌", "野外", "刷怪", "敌人"])) {
    return `${aiNote}${context.location.canWildEncounter ? "这里可以按 encount.txt 触发野外遇敌。" : context.location.wildEncounterReason} ${effects ? `当前状态：${effects}。` : ""}`;
  }
  if (reportable) return `${aiNote}你现在在${context.location.name}。「${reportable.title}」已经可回报。附近 NPC：${nearbyNpc || "无"}。`;
  if (active) return `${aiNote}你现在在${context.location.name}。建议继续「${active.title}」：${active.steps[Math.min(active.progress || 0, active.steps.length - 1)]}。出口：${exits}。`;
  return `${aiNote}你现在在${context.location.name}。附近 NPC：${nearbyNpc || "无"}；出口：${exits}。${effects ? `当前状态：${effects}。` : ""}`;
}

function normalizeGame(game) {
  if (!game || !game.player || !game.location) throw new Error("需要先创建人物");
  ensureSaveIdentity(game);
  setCharacterDir(game, game.player?.dir ?? game.location?.dir);
  game.pets ||= [];
  game.inventory ||= [];
  game.quests ||= {};
  ensureFlags(game);
  game.effects ||= {};
  game.dialogAi ||= {};
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.savePoint ||= null;
  game.lastWarp ||= null;
  game.dialog ||= null;
  game.battle ||= null;
  game.npcVmEvents ||= [];
  game.log ||= [];
  game.character.name = game.player.name;
  game.character.updatedAt = new Date().toISOString();
  game.save = buildSaacSave(game);
  return game;
}

function ensureSaveIdentity(game) {
  const now = new Date().toISOString();
  game.account ||= {};
  game.account.id = cleanAccountId(game.account.id) || `local-${stableFlag(game.id || game.player.name).toString(36)}`;
  game.account.name ||= "本地账号";
  game.account.activeSlot = clampInt(game.account.activeSlot, 0, MAXCHAR_PER_USER - 1, 0);
  game.account.maxSlots = MAXCHAR_PER_USER;
  game.account.lock ||= null;
  game.account.source ||= "参考 SAAC char.c: id.slot.char";
  game.character ||= {};
  game.character.id ||= game.id || `${game.account.id}-${game.account.activeSlot}`;
  game.character.slot = clampInt(game.character.slot ?? game.account.activeSlot, 0, MAXCHAR_PER_USER - 1, game.account.activeSlot);
  game.character.name = game.player.name;
  game.character.createdAt ||= now;
  game.character.updatedAt ||= now;
  game.character.deleted = Boolean(game.character.deleted);
}

function buildSaacSave(game) {
  const option = buildCharOption(game);
  const info = buildCharInfo(game);
  const json = buildSaveJson(game);
  return {
    schema: SAVE_SCHEMA,
    source: "SAAC charSave/makeSaveCharString model: charname|option|charinfo",
    fileName: `${game.account.id}.${game.character.slot}.char`,
    accountId: game.account.id,
    slot: game.character.slot,
    name: game.player.name,
    option,
    info,
    serialized: [escapeSaacField(game.player.name), escapeSaacField(option), escapeSaacField(info)].join("|"),
    json,
    updatedAt: game.character.updatedAt
  };
}

function buildSaveJson(game) {
  return {
    schema: SAVE_SCHEMA,
    source: {
      saac: "stoneage-master/石器时代服务器端最新完整源代码/saac",
      chardata: "2016_SA80/Linux-Main-app/saac",
      gmsv: "stoneage-master/石器时代服务器端最新完整源代码/gmsv",
      client: "stoneage-master/石器时代8.5客户端最新源代码/石器源码"
    },
    account: {
      id: game.account.id,
      name: game.account.name,
      activeSlot: game.account.activeSlot,
      maxSlots: game.account.maxSlots,
      lock: game.account.lock
    },
    character: {
      id: game.character.id,
      slot: game.character.slot,
      name: game.character.name,
      createdAt: game.character.createdAt,
      updatedAt: game.character.updatedAt,
      deleted: game.character.deleted
    },
    player: { ...game.player },
    location: { ...game.location },
    pets: game.pets.map((pet) => ({ ...pet })),
    inventory: game.inventory.map((item) => ({ ...item })),
    inventoryState: inventoryState(game),
    quests: game.quests || {},
    savePoint: game.savePoint ? { ...game.savePoint } : null,
    lastWarp: game.lastWarp ? { ...game.lastWarp } : null,
    flags: {
      endEvents: [...(game.flags?.endEvents || [])],
      nowEvents: [...(game.flags?.nowEvents || [])],
      bits: { ...(game.flags?.bits || {}) },
      npcTalkCounts: { ...(game.flags?.npcTalkCounts || {}) }
    },
    effects: { ...(game.effects || {}) },
    dialogAi: { ...(game.dialogAi || {}) },
    walk: {
      steps: Number(game.walk?.steps || 0),
      encounterSteps: Number(game.walk?.encounterSteps || 0)
    },
    npcVmEvents: (game.npcVmEvents || []).slice(-20),
    log: (game.log || []).slice(-40)
  };
}

function buildCharOption(game) {
  return [
    `lv=${game.player.level}`,
    `floor=${game.location.mapId}`,
    `x=${game.location.x}`,
    `y=${game.location.y}`,
    `dir=${normalizeDir(game.player.dir)}`,
    `pet=${game.pets.length}`,
    `item=${game.inventory.length}`
  ].join(",");
}

function buildCharInfo(game) {
  const activeQuests = Object.values(game.quests || {}).filter((quest) => quest.status !== "完成").map((quest) => quest.title);
  return [
    "DATASTART=1",
    `SCHEMA=${SAVE_SCHEMA}`,
    `ACCOUNT=${game.account.id}`,
    `SLOT=${game.character.slot}`,
    `CHARID=${game.character.id}`,
    `NAME=${game.player.name}`,
    `LV=${game.player.level}`,
    `EXP=${game.player.exp}`,
    `STONE=${game.player.stone}`,
    `HP=${game.player.hp}`,
    `MAXHP=${game.player.maxHp}`,
    `FLOOR=${game.location.mapId}`,
    `X=${game.location.x}`,
    `Y=${game.location.y}`,
    `DIR=${normalizeDir(game.player.dir)}`,
    `LAST_WARP=${game.lastWarp?.to ? `${game.lastWarp.to.mapId},${game.lastWarp.to.x},${game.lastWarp.to.y}` : "NONE"}`,
    `PETCOUNT=${game.pets.length}`,
    `ITEMCOUNT=${game.inventory.length}`,
    `LAST_SAVEPOINT=${game.savePoint ? safeJson(game.savePoint) : ""}`,
    `WALK_STEPS=${game.walk?.steps || 0}`,
    `ENCOUNTER_STEPS=${game.walk?.encounterSteps || 0}`,
    `QUESTS=${safeJson(activeQuests)}`,
    `EFFECTS=${safeJson(game.effects || {})}`,
    `FLAGS_END=${(game.flags?.endEvents || []).join(",")}`,
    `FLAGS_NOW=${(game.flags?.nowEvents || []).join(",")}`,
    `FLAGS_BITS=${safeJson(game.flags?.bits || {})}`,
    `NPC_TALK=${safeJson(game.flags?.npcTalkCounts || {})}`,
    `PETS=${safeJson(game.pets.map(petSaveSummary))}`,
    `ITEMS=${safeJson(game.inventory.map(itemSaveSummary))}`,
    `UPDATED=${game.character.updatedAt}`,
    "DATAEND=1"
  ].join("\n");
}

function escapeSaacField(value = "") {
  return String(value)
    .replaceAll("\\", "\\y")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\c")
    .replaceAll("|", "\\z");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("\n", " ");
}

function petSaveSummary(pet) {
  return {
    id: pet.Id,
    no: pet.PetId,
    name: pet.Name,
    level: pet.LV,
    hp: pet.HP,
    maxHp: pet.MaxHP,
    exp: pet.Exp,
    image: pet.ImgNo
  };
}

function itemSaveSummary(item) {
  return {
    id: item.id,
    name: item.name,
    qty: item.qty,
    type: item.type,
    level: item.level
  };
}

function cleanAccountId(value = "") {
  return String(value).trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function withMap(game, extra = {}) {
  const map = currentMap(game);
  ensureSaveIdentity(game);
  ensureFlags(game);
  setCharacterDir(game, game.player?.dir ?? game.location?.dir);
  game.save = buildSaacSave(game);
  return {
    ...game,
    nearby: nearbyState(game, map),
    inventoryState: inventoryState(game),
    world: {
      map,
      quests: WORLD.quests
    },
    ...extra
  };
}

function currentMap(game) {
  const map = WORLD.maps[game.location.mapId];
  if (!map) throw new Error("当前地图不存在");
  return visibleMapForGame(game, map);
}

function visibleMapForGame(game, map) {
  const visible = map.npcs?.length
    ? (() => {
        const npcs = map.npcs.filter((npc) => !isNpcEnemyDefeated(game, npc));
        return npcs.length === map.npcs.length ? map : { ...map, npcs };
      })()
    : map;
  return withWildEncounterPolicy(visible);
}

function withWildEncounterPolicy(map) {
  const canWildEncounter = wildEncounterAllowed(map);
  return {
    ...map,
    canWildEncounter,
    wildEncounterReason: canWildEncounter
      ? "encount.txt wild encounter enabled"
      : wildEncounterBlockedText(map)
  };
}

function wildEncounterAllowed(map) {
  return Boolean(map?.encounterPets?.length) && !isSafeWildEncounterMap(map);
}

function isSafeWildEncounterMap(map) {
  const name = String(map?.name || "").replace(/[|�]/g, "");
  if (SAFE_WILD_ENCOUNTER_MAP_RE.test(name)) return true;
  const summary = String(map?.summary || "");
  return /\/samugiru\/|\/kuo\/kuomura|\/marinasu\/marinasu|\/family\//i.test(summary);
}

function assertWildEncounterAllowed(map) {
  if (!wildEncounterAllowed(map)) throw new Error(wildEncounterBlockedText(map));
}

function wildEncounterBlockedText(map) {
  if (!map?.encounterPets?.length) return `${map?.name || "当前地图"} 没有 encount.txt 遇敌表，不能在这里触发野外战斗。`;
  if (isSafeWildEncounterMap(map)) return `${map.name} 是村镇或安全地图，虽然资料里有 encount.txt 记录，但随机野外遇敌已按安全区规则关闭。`;
  return `${map?.name || "当前地图"} 当前不能触发野外遇敌。`;
}

function isNpcEnemyDefeated(game, npc) {
  const entry = game.flags?.npcEnemyDefeats?.[npc.id];
  if (!entry) return false;
  const until = Date.parse(entry.until || "");
  return Number.isFinite(until) && until > Date.now();
}

function nearbyState(game, map) {
  const x = Number(game.location.x || 0);
  const y = Number(game.location.y || 0);
  const npcs = map.npcs
    .filter((npc) => distance(npc.x, npc.y, x, y) <= 2)
    .slice(0, 5)
    .map((npc) => ({ id: npc.id, name: npc.name, x: npc.x, y: npc.y, type: npc.type }));
  const exits = map.exits
    .filter((exit) => distanceToExit(exit, x, y) <= 2)
    .slice(0, 5)
    .map((exit) => ({ id: exit.id, label: exit.label, x: exit.x, y: exit.y, to: exit.to }));
  return { npcs, exits };
}

function distance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax) - bx), Math.abs(Number(ay) - by));
}

function distanceToBounds(bounds, x, y) {
  const dx = x < bounds[0] ? bounds[0] - x : x > bounds[2] ? x - bounds[2] : 0;
  const dy = y < bounds[1] ? bounds[1] - y : y > bounds[3] ? y - bounds[3] : 0;
  return Math.max(dx, dy);
}

function distanceToExit(exit, x, y) {
  if (Array.isArray(exit.tiles) && exit.tiles.length) {
    return Math.min(...exit.tiles.map((tile) => distance(tile.x, tile.y, x, y)));
  }
  return distanceToBounds(exit.bounds || [exit.x, exit.y, exit.x, exit.y], x, y);
}

function addLog(game, text) {
  game.log.push(text);
  game.log = game.log.slice(-24);
}

function addQuestProgress(game, questId, amount) {
  const quest = game.quests[questId];
  if (!quest || quest.status === "完成") return;
  quest.progress = Math.min((quest.progress || 0) + amount, quest.steps.length);
  if (quest.progress >= quest.steps.length - 1) {
    quest.status = "可回报";
  }
}

function startQuest(game, questId, npc = null) {
  const source = WORLD.quests[questId];
  if (!source) return null;
  game.quests[questId] = {
    ...source,
    status: "进行中",
    progress: Math.min(1, source.steps.length - 1),
    startedAt: new Date().toISOString()
  };
  if (npc) setNpcVmFlag(game, npc, eventFlagForQuest(questId), "now", "quest-start");
  else setEventFlag(game, eventFlagForQuest(questId), "now");
  addLog(game, `接到任务「${source.title}」。`);
  return game.quests[questId];
}

function updateQuestProgress(game, event, payload = {}) {
  for (const [questId, quest] of Object.entries(game.quests || {})) {
    if (!quest || quest.status === "完成") continue;
    const target = questProgressTarget(quest, event, payload);
    if (!target || target <= Number(quest.progress || 0)) continue;
    quest.progress = Math.min(target, quest.steps.length - 1);
    if (quest.progress >= quest.steps.length - 1) {
      quest.status = "可回报";
      addLog(game, `任务「${quest.title}」已完成目标，可以回报。`);
    } else {
      addLog(game, `任务「${quest.title}」推进：${quest.steps[quest.progress]}`);
    }
    game.quests[questId] = quest;
  }
}

function questProgressTarget(quest, event, payload) {
  const objectives = quest.objectives || {};
  if (event === "enterMap" && Array.isArray(objectives.enterMaps)) {
    const mapId = String(payload.mapId || "");
    const targetMaps = objectives.enterMaps.map(String);
    if (targetMaps.includes(mapId)) {
      quest.visitedMaps ||= [];
      if (!quest.visitedMaps.includes(mapId)) quest.visitedMaps.push(mapId);
      return Math.max(1 + quest.visitedMaps.length, Number(quest.progress || 0));
    }
  }
  if (event === "enterMap" && objectives.visitEncounterMap) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (wildEncounterAllowed(map)) return Math.max(2, Number(quest.progress || 0));
  }
  if (event === "fieldWin" && objectives.fieldWin) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (wildEncounterAllowed(map)) return Math.max(quest.steps.length - 1, Number(quest.progress || 0));
  }
  if (event === "npcEnemyWin" && Array.isArray(objectives.npcEnemyIds)) {
    if (objectives.npcEnemyIds.includes(String(payload.npcId || ""))) {
      return Math.max(quest.steps.length - 1, Number(quest.progress || 0));
    }
  }
  return 0;
}

function createFlags() {
  return {
    endEvents: Array(8).fill(0),
    nowEvents: Array(8).fill(0),
    bits: {}
  };
}

function ensureFlags(game) {
  game.flags ||= {};
  game.flags.endEvents = normalizeFlagArray(game.flags.endEvents);
  game.flags.nowEvents = normalizeFlagArray(game.flags.nowEvents);
  game.flags.bits ||= {};
  game.flags.npcTalkCounts ||= {};
  game.flags.npcEnemyDefeats ||= {};
}

function normalizeFlagArray(value) {
  if (!Array.isArray(value)) return Array(8).fill(0);
  const out = Array(8).fill(0);
  value.slice(0, 8).forEach((item, index) => {
    out[index] = Number(item) >>> 0;
  });
  return out;
}

function setEventFlag(game, shiftbit, kind = "end") {
  if (!shiftbit) return;
  ensureFlags(game);
  const field = kind === "now" ? "nowEvents" : "endEvents";
  const index = Math.floor(shiftbit / 32);
  const bit = shiftbit % 32;
  while (game.flags[field].length <= index) game.flags[field].push(0);
  game.flags[field][index] = (game.flags[field][index] | (1 << bit)) >>> 0;
  game.flags.bits[`${kind}:${shiftbit}`] = true;
}

function setNpcVmFlag(game, npc, shiftbit, kind = "end", reason = "") {
  if (!shiftbit) return;
  runNpcVmAction(game, npc, {
    type: "setFlag",
    kind,
    shiftbit,
    key: `${kind}:${shiftbit}`,
    reason
  });
}

function eventFlagForNpc(npcId) {
  return stableFlag(npcId);
}

function eventFlagForQuest(questId) {
  return stableFlag(questId);
}

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}

async function loadGameData(env, request) {
  if (cache) return cache;
  const [enemyText, enemyBaseText, skillText] = await Promise.all([
    assetText(env, request, DATA_FILES.enemy),
    assetText(env, request, DATA_FILES.enemyBase),
    assetText(env, request, DATA_FILES.skills)
  ]);
  const skills = parseSkills(skillText);
  const enemyBaseSet = new Map();
  const enemyNoList = [];
  for (const line of lines(enemyBaseText)) {
    const rows = line.split(",");
    if (rows.length < 56) continue;
    const petSkills = [];
    const petSkillIds = [];
    for (let j = 0; j < 7; j += 1) {
      const skillId = toInt(rows[25 + j]);
      petSkillIds[j] = skillId;
      petSkills[j] = skillId ? skills.get(skillId) || null : null;
    }
    const eb = {
      Name: rows[0],
      No: toInt(rows[6]),
      InitNum: toInt(rows[7]),
      LvUpPoint: Math.trunc(toFloat(rows[8])),
      BaseVital: toInt(rows[9]),
      BaseStr: toInt(rows[10]),
      BaseTgh: toInt(rows[11]),
      BaseDex: toInt(rows[12]),
      ModAI: toInt(rows[13]),
      Get: toInt(rows[14]),
      EarthAT: toInt(rows[15]),
      WaterAT: toInt(rows[16]),
      FireAT: toInt(rows[17]),
      WindAt: toInt(rows[18]),
      Poison: toInt(rows[19]),
      Paralysis: toInt(rows[20]),
      Sleep: toInt(rows[21]),
      Stone: toInt(rows[22]),
      Drunk: toInt(rows[23]),
      Confusion: toInt(rows[24]),
      PetSkillIds: petSkillIds,
      PetSkills: petSkills,
      Rare: toInt(rows[32]),
      Critical: toInt(rows[33]),
      Counter: toInt(rows[34]),
      Slot: toInt(rows[35]),
      ImgNo: toInt(rows[36]),
      PetFlag: toInt(rows[37]),
      Size: toInt(rows[38]),
      LimitLevel: toInt(rows[54]),
      Species: toInt(rows[55])
    };
    enemyBaseSet.set(eb.No, eb);
    enemyNoList.push(eb.No);
  }
  const enemySpecsById = parseEnemySpecs(enemyText, enemyBaseSet);
  cache = { enemyBaseSet, enemyNoList, enemySpecsById, skills };
  return cache;
}

function parseEnemySpecs(text, enemyBaseSet) {
  const specs = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 10) continue;
    const offset = Number.isFinite(Number.parseInt(rows[2], 10)) && Number.parseInt(rows[2], 10) > 0 ? 2 : 3;
    const id = toInt(rows[offset]);
    const tempNo = toInt(rows[offset + 1]);
    if (!id || !tempNo || !enemyBaseSet.has(tempNo)) continue;
    const rawMin = toInt(rows[offset + 2]);
    const rawMax = toInt(rows[offset + 3]);
    const maxLevel = Math.max(1, rawMax || rawMin || 1);
    const minLevel = Math.max(1, rawMin || maxLevel);
    specs.set(id, {
      id,
      tempNo,
      lvMin: Math.min(minLevel, maxLevel),
      lvMax: Math.max(minLevel, maxLevel),
      createMax: Math.max(1, toInt(rows[offset + 4]) || 1),
      createMin: Math.max(1, toInt(rows[offset + 5]) || 1),
      source: `${GMSV_DATA_SOURCE}/enemy1.txt`
    });
  }
  return specs;
}

function parseSkills(text) {
  const skills = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 12) continue;
    const id = toInt(rows[6]);
    skills.set(id, { Id: id, Name: rows[0], Des: compressStr(rows[1]) });
  }
  return skills;
}

function createEnemy(data, ebno, baselevel) {
  const eb = data.enemyBaseSet.get(ebno);
  if (!eb) return null;
  const level = baselevel;
  const tp = { ...eb };
  const paramCal = (v) => ((level - 1) * eb.LvUpPoint + eb.InitNum) * v;
  tp.BaseVital += randInt(5) - 2;
  tp.BaseStr += randInt(5) - 2;
  tp.BaseTgh += randInt(5) - 2;
  tp.BaseDex += randInt(5) - 2;

  const char = {
    Id: ++charId,
    Name: eb.Name,
    ImgNo: tp.ImgNo,
    WhichType: 2,
    DuelPoint: 0,
    Vital: 0,
    Str: 0,
    Tough: 0,
    Dex: 0,
    EarthAT: tp.EarthAT,
    WaterAT: tp.WaterAT,
    FireAT: tp.FireAT,
    WindAT: tp.WindAt,
    ModAI: tp.ModAI,
    VariableAI: 0,
    Slot: tp.Slot,
    Poison: tp.Poison,
    Paralysis: tp.Paralysis,
    Sleep: tp.Sleep,
    Stone: tp.Stone,
    Drunk: tp.Drunk,
    Confusion: tp.Confusion,
    Rare: tp.Rare,
    PetId: tp.No,
    Critical: tp.Critical,
    Counter: tp.Counter,
    Luck: 0,
    PetSkillIds: tp.PetSkillIds,
    PetSkills: tp.PetSkills,
    PetRank: enemyRank(data, ebno),
    Exp: 0,
    AllocPoint: [tp.BaseVital, tp.BaseStr, tp.BaseTgh, tp.BaseDex],
    WorkTactics: 0,
    WorkTacticsOption: "",
    WorkBattleActContition: "",
    WorkPetFlag: 0,
    WorkModCaptureDefault: tp.Get,
    Hp: 0,
    Mp: 0,
    BornLv: level,
    Lv: level,
    BornPoint: [0, 0, 0, 0],
    WorkMaxHp: 0,
    WorkMaxMp: 0,
    WorkFixVital: 0,
    WorkFixStr: 0,
    WorkFixTough: 0,
    WorkFixDex: 0,
    GrowthHp: 0,
    GrowthStr: 0,
    GrowthTough: 0,
    GrowthDex: 0,
    Growth: 0
  };

  for (let i = 0; i < 10; i += 1) {
    const w = randInt(4);
    if (w === 0) tp.BaseVital += 1;
    if (w === 1) tp.BaseStr += 1;
    if (w === 2) tp.BaseTgh += 1;
    if (w === 3) tp.BaseDex += 1;
  }
  char.Vital = paramCal(tp.BaseVital);
  char.Str = paramCal(tp.BaseStr);
  char.Tough = paramCal(tp.BaseTgh);
  char.Dex = paramCal(tp.BaseDex);
  complianceParameter(char);
  char.BornPoint = [char.WorkMaxHp, char.WorkFixStr, char.WorkFixTough, char.WorkFixDex];
  return char;
}

function petLevelUp(char) {
  if (char.Lv >= CHAR_MAXUPLEVEL) return;
  const param = [0, 0, 0, 0];
  for (let i = 0; i < 10; i += 1) param[randInt(4)] = 1;
  const rank = Math.max(0, Math.min(char.PetRank || 0, rankTab.length - 1));
  const [min, max] = rankTab[rank];
  const frand = (min + randInt(max - min + 1)) * 0.01;
  char.Vital += Math.trunc((char.AllocPoint[0] + param[0]) * frand);
  char.Str += Math.trunc((char.AllocPoint[1] + param[1]) * frand);
  char.Tough += Math.trunc((char.AllocPoint[2] + param[2]) * frand);
  char.Dex += Math.trunc((char.AllocPoint[3] + param[3]) * frand);
  char.Lv += 1;
  complianceParameter(char);
  const lvd = char.Lv - char.BornLv;
  if (lvd > 0) {
    char.GrowthHp = (char.WorkMaxHp - char.BornPoint[0]) / lvd;
    char.GrowthStr = (char.WorkFixStr - char.BornPoint[1]) / lvd;
    char.GrowthTough = (char.WorkFixTough - char.BornPoint[2]) / lvd;
    char.GrowthDex = (char.WorkFixDex - char.BornPoint[3]) / lvd;
    char.Growth = char.GrowthStr + char.GrowthTough + char.GrowthDex;
  }
}

function complianceParameter(char) {
  char.WorkFixDex = Math.trunc(char.Dex / 100);
  char.WorkFixVital = Math.trunc(char.Vital / 100);
  char.WorkFixStr = Math.trunc((char.Str * 1 + char.Tough * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkFixTough = Math.trunc((char.Tough * 1 + char.Str * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkMaxHp = Math.trunc((char.Vital * 4 + char.Str + char.Tough + char.Dex) / 100);
  char.Hp = char.WorkMaxHp;
  char.Mp = char.WorkMaxMp;
}

function enemyRank(data, ebno) {
  const ranktbl = [100, 95, 90, 85, 80, 0];
  const tp = data.enemyBaseSet.get(ebno);
  if (!tp) return 0;
  const sum = tp.BaseVital + tp.BaseStr + tp.BaseTgh + tp.BaseDex;
  return ranktbl.findIndex((w) => sum >= w);
}

async function searchData(env, request, q) {
  if (q.length < 2) return { query: q, results: [] };
  const results = [];
  await Promise.all(DATA_FILES.searchable.map(async ([label, path]) => {
    const text = await assetText(env, request, path);
    let lineNo = 0;
    for (const line of lines(text)) {
      lineNo += 1;
      if (line.toLowerCase().includes(q.toLowerCase())) {
        results.push({ source: label, file: path, line: lineNo, text: line.slice(0, 280) });
        if (results.length >= 40) break;
      }
    }
  }));
  return { query: q, results: results.slice(0, 60) };
}

function petSummary(pet) {
  return {
    name: pet.Name,
    no: pet.PetId,
    lv: pet.Lv,
    hp: pet.WorkMaxHp,
    attack: pet.WorkFixStr,
    defense: pet.WorkFixTough,
    speed: pet.WorkFixDex,
    growth: round2(pet.Growth),
    growthHp: round2(pet.GrowthHp),
    growthStr: round2(pet.GrowthStr),
    growthTough: round2(pet.GrowthTough),
    growthDex: round2(pet.GrowthDex),
    attributes: { earth: pet.EarthAT, water: pet.WaterAT, fire: pet.FireAT, wind: pet.WindAT },
    skills: (pet.PetSkills || []).filter(Boolean).map((sk) => sk.Name)
  };
}

async function assetText(env, request, path) {
  const url = new URL(path, request.url);
  const rsp = await env.ASSETS.fetch(new Request(url));
  if (!rsp.ok) throw new Error(`missing asset: ${path}`);
  return rsp.text();
}

async function assetBuffer(env, request, path) {
  const url = new URL(path, request.url);
  const rsp = await env.ASSETS.fetch(new Request(url));
  if (!rsp.ok) throw new Error(`missing asset: ${path}`);
  return rsp.arrayBuffer();
}

async function assetJson(env, request, path) {
  return JSON.parse(await assetText(env, request, path));
}

async function readJson(request) {
  if (!request.body) return {};
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}

function lines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function compressStr(str) {
  return str ? str.replace(/\s+/g, ",") : "";
}

function toInt(value) {
  const n = Number.parseInt(value || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

function toFloat(value) {
  const n = Number.parseFloat(value || "0");
  return Number.isFinite(n) ? n : 0;
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function randRange(min, max) {
  const low = Math.min(Number(min) || 1, Number(max) || 1);
  const high = Math.max(Number(min) || 1, Number(max) || 1);
  return Math.floor(low + Math.random() * (high - low + 1));
}

function pick(list) {
  return list[randInt(list.length)];
}

function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}
