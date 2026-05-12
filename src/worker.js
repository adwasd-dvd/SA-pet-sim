import { WORLD } from "./world-data.js";

const DATA_FILES = {
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
  "startBattle",
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
      return json(await dialogGame(env, body.game, String(body.npcId || ""), String(body.message || "")));
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
    if (url.pathname === "/api/ai/guide" && request.method === "POST") {
      const body = await readJson(request);
      return json(await guideGame(env, body.game, String(body.prompt || "")));
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
      maxHp: 100
    },
    location: {
      mapId: WORLD.startMap,
      x: WORLD.maps[WORLD.startMap].spawn[0],
      y: WORLD.maps[WORLD.startMap].spawn[1]
    },
    pets: [starter],
    inventory: [{ id: "stone", name: "石币", qty: 100 }],
    quests: {},
    flags: createFlags(),
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

async function walkGame(env, request, game, dx, dy) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const nextX = clampInt(Number(game.location.x || 0) + Math.sign(dx), 0, width - 1, game.location.x);
  const nextY = clampInt(Number(game.location.y || 0) + Math.sign(dy), 0, height - 1, game.location.y);
  const exit = exitAt(map, nextX, nextY);
  if (!exit && (await blocksMove(env, request, map, nextX, nextY))) {
    noteBlockedMove(game, map, nextX, nextY);
    noteNearby(game, map);
    return withMap(game);
  }
  game.location = { ...game.location, x: nextX, y: nextY };
  game.encounter = null;
  game.battle = null;
  if (exit) return applyExit(game, exit);
  noteNearby(game, map);
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.steps = Number(game.walk.steps || 0) + 1;
  game.walk.encounterSteps = 0;
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
  return [
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 }
  ];
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
  const now = new Date().toISOString();
  game.location = { mapId: exit.to, x: exit.target[0], y: exit.target[1] };
  game.encounter = null;
  game.battle = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  game.lastWarp = {
    kind: "mapwarp",
    exitId: exit.id,
    label: exit.label,
    from,
    sourceTile: exit.sourceTile || { x: exit.x, y: exit.y, target: exit.target },
    to: { mapId: exit.to, x: exit.target[0], y: exit.target[1] },
    source: exit.source,
    warpedAt: now
  };
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
  const now = new Date().toISOString();
  const width = Math.max(1, Number(targetMap.size?.[0]) || 1);
  const height = Math.max(1, Number(targetMap.size?.[1]) || 1);
  const x = clampInt(target.x, 0, width - 1, 0);
  const y = clampInt(target.y, 0, height - 1, 0);
  game.location = { mapId: targetMap.id, x, y };
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
  game.character ||= {};
  game.character.updatedAt = game.lastWarp.warpedAt;
  addLog(game, `你通过「${label}」来到 ${targetMap.name} (${x},${y})。`);
  updateQuestProgress(game, "enterMap", { mapId: targetMap.id });
  return targetMap;
}

function buyGame(game, npcId, itemId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作 NPC 窗口");
  if (!npc.trade?.items?.length) throw new Error("这个 NPC 没有商品资料");
  const item = npc.trade.items.find((entry) => entry.id === itemId);
  if (!item) throw new Error("商品不存在");
  const price = Number(item.price || item.cost || 0);
  if (game.player.stone < price) throw new Error("石币不够");
  if (!canCarryItem(game, item)) throw new Error(`背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具`);
  game.player.stone -= price;
  addInventoryItem(game, item, 1);
  syncStoneItem(game);
  recordNpcVmEvent(game, npc, "shop", "ok", { action: "buy", itemId, itemName: item.name, price });
  if (price > 0) recordNpcVmEvent(game, npc, "take", "ok", { item: "stone", qty: price, reason: "buy" });
  recordNpcVmEvent(game, npc, "give", "ok", { itemId, itemName: item.name, qty: 1, reason: "buy" });
  addLog(game, `向 ${npc.name} 购买了 ${item.name}，花费 ${price} 石币。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : []),
    npcMessage("system", `购买成功：${item.name} x1，花费 ${price} 石币。`)
  ]);
  return withMap(game, { npc });
}

function useItemGame(game, itemId) {
  game = normalizeGame(game);
  const item = game.inventory.find((entry) => Number(entry.id) === Number(itemId) && Number(entry.qty || 0) > 0);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");

  const effect = itemEffect(item);
  if (!effect.usable) throw new Error(`${item.name} 还没有可模拟的使用效果`);

  const activePet = game.pets[0] || null;
  const target = selectItemTarget(game, activePet, effect);
  if (!target) throw new Error("当前没有可以恢复的目标");

  const before = Number(target.hpField.owner[target.hpField.key] || 0);
  const max = Number(target.maxHp || 1);
  const next = effect.revive
    ? Math.min(max, Math.max(before, effect.amount))
    : Math.min(max, before + effect.amount);
  if (next <= before) throw new Error(`${target.name} 的耐久力已经不需要恢复`);

  target.hpField.owner[target.hpField.key] = next;
  item.qty = Number(item.qty || 0) - 1;
  if (item.qty <= 0) {
    game.inventory = game.inventory.filter((entry) => entry === item || Number(entry.qty || 0) > 0);
    game.inventory = game.inventory.filter((entry) => entry !== item);
  }
  addLog(game, `使用 ${item.name}，${target.name} 的耐久力恢复 ${next - before}。`);
  return withMap(game);
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

function talkGame(game, npcId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);
  const reply = runNpcTalk(game, npc, "hi");
  openDialog(game, npc, [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", reply)
  ]);
  return withMap(game, { npc });
}

async function dialogGame(env, game, npcId, message) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);

  const text = message.trim().slice(0, 160);
  if (!text) {
    const reply = runNpcTalk(game, npc, "hi");
    openDialog(game, npc, [
      npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
      npcMessage("player", "hi"),
      npcMessage("npc", reply)
    ]);
    return withMap(game, { npc });
  }

  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", runNpcTalk(game, npc, "hi"))
  ];
  const reply = await npcReply(env, game, npc, text);
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
  await spawnEncounter(env, request, game, map, "野外");
  return withMap(game);
}

async function maybeStepEncounter(env, request, game, map) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.steps = Number(game.walk.steps || 0) + 1;
  if (!map.encounterPets?.length || game.encounter) return false;
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
  const data = await loadGameData(env, request);
  const petNo = pick(map.encounterPets);
  const enemy = createEnemy(data, petNo, Math.max(1, game.player.level + randInt(3) - 1));
  if (!enemy) throw new Error("当前地图没有可遇敌宠物");
  enemy.CaptureRate = Math.max(18, Math.min(75, 70 - enemy.Rare + game.player.level * 2));
  game.encounter = enemy;
  addLog(game, `${source}遇到了 ${enemy.Name} Lv.${enemy.Lv}。`);
}

function captureGame(game) {
  game = normalizeGame(game);
  if (!game.encounter) throw new Error("当前没有可捕获目标");
  const target = game.encounter;
  const rate = Number(target.CaptureRate || 35);
  const ok = Math.random() * 100 < rate;
  if (ok) {
    game.pets.push(target);
    game.encounter = null;
    game.player.exp += 12;
    game.player.stone += 20;
    addLog(game, `捕获成功！${target.Name} 加入了队伍。`);
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: target.Name,
      result: "capture"
    });
  } else {
    addLog(game, `${target.Name} 挣脱了绳索。`);
  }
  return withMap(game, { captured: ok });
}

function battleGame(game, action) {
  game = normalizeGame(game);
  if (!game.encounter) throw new Error("当前没有战斗目标");
  if (action !== "attack") throw new Error("这个战斗动作还没有实现");
  const activePet = game.pets[0];
  if (!activePet) throw new Error("你需要至少一只宠物才能战斗");
  ensureBattleState(game, activePet, game.encounter);

  const enemy = game.encounter;
  const battleLog = [];
  const petFirst = Number(activePet.WorkFixDex || 0) >= Number(enemy.WorkFixDex || 0);
  const petTurn = () => {
    const damage = combatDamage(activePet, enemy);
    enemy.Hp = Math.max(0, Number(enemy.Hp || 0) - damage);
    battleLog.push(`${activePet.Name} 攻击 ${enemy.Name}，造成 ${damage} 伤害。`);
  };
  const enemyTurn = () => {
    const damage = combatDamage(enemy, activePet);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - damage);
    battleLog.push(`${enemy.Name} 反击 ${activePet.Name}，造成 ${damage} 伤害。`);
  };

  if (petFirst) {
    petTurn();
    if (enemy.Hp > 0) enemyTurn();
  } else {
    enemyTurn();
    if (activePet.Hp > 0) petTurn();
  }

  game.battle.turn = Number(game.battle.turn || 0) + 1;
  if (enemy.Hp <= 0) {
    const exp = 10 + Number(enemy.Lv || 1) * 6;
    const stone = 12 + Number(enemy.Lv || 1) * 4;
    game.player.exp += exp;
    game.player.stone += stone;
    syncStoneItem(game);
    battleLog.push(`击败 ${enemy.Name}，获得 ${exp} 经验和 ${stone} 石币。`);
    maybeLevelPlayer(game);
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: enemy.Name,
      result: "battle"
    });
    game.encounter = null;
    game.battle = null;
  } else if (activePet.Hp <= 0) {
    const recovered = Math.max(1, Math.floor(Number(activePet.WorkMaxHp || 1) * 0.35));
    activePet.Hp = recovered;
    game.player.hp = Math.max(1, Math.floor(Number(game.player.maxHp || 1) * 0.5));
    game.encounter = null;
    game.battle = null;
    battleLog.push(`${activePet.Name} 被击倒，你带着队伍撤退并恢复了少量体力。`);
  } else {
    game.battle.log = [...(game.battle.log || []), ...battleLog].slice(-8);
  }
  battleLog.forEach((line) => addLog(game, line));
  return withMap(game);
}

function ensureBattleState(game, pet, enemy) {
  pet.WorkMaxHp ||= Math.max(1, Number(pet.Hp || 1));
  enemy.WorkMaxHp ||= Math.max(1, Number(enemy.Hp || 1));
  if (!Number.isFinite(Number(pet.Hp)) || Number(pet.Hp) <= 0) pet.Hp = pet.WorkMaxHp;
  if (!Number.isFinite(Number(enemy.Hp)) || Number(enemy.Hp) <= 0) enemy.Hp = enemy.WorkMaxHp;
  game.battle ||= {
    turn: 0,
    startedAt: new Date().toISOString(),
    log: [`${pet.Name} 遭遇 ${enemy.Name}，战斗开始。`],
    source: "first-pass Worker battle loop from ref-data enemy parameters"
  };
}

function combatDamage(attacker, defender) {
  const attack = Math.max(1, Number(attacker.WorkFixStr || attacker.level || attacker.Lv || 1));
  const defense = Math.max(0, Number(defender.WorkFixTough || 0));
  const variance = 0.85 + Math.random() * 0.3;
  const raw = attack * variance - defense * 0.42;
  const critical = Math.random() * 100 < Math.max(2, Number(attacker.Critical || 0) * 0.35);
  return Math.max(1, Math.floor(raw * (critical ? 1.6 : 1)));
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
  const pet = game.pets[petIndex];
  if (!pet) throw new Error("没有找到这只宠物");
  const before = pet.Lv;
  const up = pet.Lv < 10 ? 2 : 1;
  for (let i = 0; i < up; i += 1) petLevelUp(pet);
  game.player.exp += 10 * (pet.Lv - before);
  game.player.stone += 12;
  addLog(game, `${pet.Name} 完成训练，从 Lv.${before} 提升到 Lv.${pet.Lv}。`);
  return withMap(game);
}

async function guideGame(env, game, prompt) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const context = {
    player: game.player,
    map: { name: map.name, summary: map.summary, exits: map.exits.map((e) => e.label), npcs: map.npcs.map((n) => n.name) },
    pets: game.pets.map(petSummary),
    quests: Object.values(game.quests),
    recentLog: game.log.slice(-6)
  };
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      { role: "system", content: "你是单人版石器时代游戏里的向导。只根据给你的当前游戏状态回答，给玩家下一步建议。简洁中文，最多三段。" },
      { role: "user", content: `${prompt || "我下一步该做什么？"}\n\n当前状态：${JSON.stringify(context)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    const rsp = await env.AI.run(model, { messages });
    return { text: rsp.response || rsp.text || fallbackGuide(context), model };
  }
  return { text: fallbackGuide(context), model: "local-rule" };
}

async function npcReply(env, game, npc, text) {
  const lower = text.toLowerCase();
  if (isGreeting(lower)) return runNpcTalk(game, npc, "hi");
  if (isHealerNpc(npc) && hasAny(lower, ["治疗", "恢復", "恢复", "补血", "耐久", "heal", "hp"])) return healerReply(game, npc);
  if (isSavePointNpc(npc) && hasAny(lower, ["记录", "記錄", "纪录", "存档", "保存", "save"])) return savePointReply(game, npc);
  if (npc.trade && hasAny(lower, ["买", "卖", "交易", "商品", "shop", "buy"])) return tradeReply(game, npc);
  if (isWarpNpc(npc) && hasAny(lower, ["传送", "傳送", "进入", "進入", "出发", "出發", "前往", "移动", "warp"])) return warpNpcReply(game, npc);
  if (hasAny(lower, ["任务", "委托", "quest"])) return questReply(game, npc);
  if (hasAny(lower, ["来源", "來源", "脚本", "腳本", "source", "debug"])) return sourceReply(game, npc);
  if (hasAny(lower, ["抓宠", "捕获", "宠物", "pet"])) return captureReply(game, npc);
  if (hasAny(lower, ["训练", "练级", "成长", "技能"])) return trainReply(game, npc);
  if (hasAny(lower, ["地图", "出口", "去哪", "travel", "map", "森林", "草原", "村"])) return mapReply(game, npc);
  if (env.AI && typeof env.AI.run === "function") return aiNpcReply(env, game, npc, text);
  recordNpcVmEvent(game, npc, "unsupported", "unsupported", { text: text.slice(0, 80) });
  return fallbackNpcReply(npc);
}

function isGreeting(text) {
  return /(^|\s)(hi|hello|hey|yo)(\s|$)/i.test(text) || hasAny(text, ["你好", "嗨", "哈喽", "問候", "问候"]);
}

function hasAny(text, tokens) {
  return tokens.some((token) => text.includes(token));
}

function applyNpcHi(game, npc) {
  ensureFlags(game);
  setNpcVmFlag(game, npc, eventFlagForNpc(npc.id), "now", "talk-hi");
  if (isHealerNpc(npc)) return healerReply(game, npc);
  if (isSavePointNpc(npc)) return savePointReply(game, npc);
  if (isWarpNpc(npc)) return warpPromptReply(game, npc);
  const line = nextNpcDialogueLine(game, npc);
  if (npc.questId && WORLD.quests[npc.questId]) {
    if (!game.quests[npc.questId]) {
      startQuest(game, npc.questId, npc);
      recordNpcVmEvent(game, npc, "quest", "ok", { questId: npc.questId, phase: "start" });
      recordNpcVmEvent(game, npc, "say", "ok", { line });
      return `${line} ${game.quests[npc.questId].steps[1]}`;
    } else if (game.quests[npc.questId].status === "可回报") {
      completeQuest(game, npc.questId, npc);
      recordNpcVmEvent(game, npc, "quest", "ok", { questId: npc.questId, phase: "complete" });
      recordNpcVmEvent(game, npc, "say", "ok", { line });
      return `${line} 你已经完成了「${WORLD.quests[npc.questId].title}」，奖励已经给你。`;
    }
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
  game.player.exp += expReward;
  game.player.stone += stoneReward;
  syncStoneItem(game);
  if (npc) {
    setNpcVmFlag(game, npc, eventFlagForQuest(questId), "end", "quest-complete");
    recordNpcVmEvent(game, npc, "give", "ok", { exp: expReward, stone: stoneReward, reason: "quest" });
  } else {
    setEventFlag(game, eventFlagForQuest(questId), "end");
  }
  addLog(game, `完成任务「${quest.title}」，获得奖励。`);
}

function questReply(game, npc) {
  recordNpcVmEvent(game, npc, "quest", npc.questId ? "ok" : "unsupported", { questId: npc.questId || null, query: true });
  if (!npc.questId) return `${npc.name} 这里没有正式委托，但可以继续问地图、交易或训练。`;
  const quest = game.quests[npc.questId];
  if (!quest) return `我这里有「${WORLD.quests[npc.questId].title}」。点选我时客户端会自动打招呼并触发任务。`;
  if (quest.status === "可回报") return `你已经可以回报「${quest.title}」了。再次点选我会自动送出 hi 并结算奖励。`;
  return `「${quest.title}」还在进行中。下一步是：${quest.steps[Math.min(quest.progress || 0, quest.steps.length - 1)]}。`;
}

function captureReply(game, npc) {
  recordNpcVmEvent(game, npc, "startBattle", "unsupported", { reason: "battle-002 pending" });
  return `${npc.name} 使用原始脚本入口「${npc.script || npc.template || npc.type}」。自动遇敌与捕获界面目前已关闭，后续会按原版系统重新接入。`;
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
    game.player.stone = Number(game.player.stone || 0) - cost;
    syncStoneItem(game);
    recordNpcVmEvent(game, npc, "take", "ok", { item: "stone", qty: cost, reason: "heal" });
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
    game.player.stone = Number(game.player.stone || 0) - permission.cost;
    syncStoneItem(game);
    recordNpcVmEvent(game, npc, "take", "ok", { item: "stone", qty: permission.cost, reason: "warp" });
  }
  const consumed = permission.free ? consumeWarpItems(game, npc.warp) : [];
  for (const itemName of consumed) {
    recordNpcVmEvent(game, npc, "take", "ok", { item: itemName, qty: 1, reason: "warp" });
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

function eventFlagForNpcAction(npcId, action) {
  return stableFlag(`${npcId}:${action}`);
}

function fallbackNpcReply(npc) {
  return npcDialogueLines(npc)[0] || `脚本入口：${npc.script || npc.template || npc.source || "未配置"}`;
}

function tradeReply(game, npc) {
  const items = (npc.trade?.items || []).slice(0, 8);
  recordNpcVmEvent(game, npc, "shop", items.length ? "ok" : "unsupported", { items: items.length, source: npc.trade?.source || "" });
  if (!items.length) return `${npc.name} 没有可解析的商品清单。`;
  return [
    npc.trade.mainMessage || "欢迎光临！",
    `可购买：${items.map((item) => `${item.name}(${item.price}石币)`).join("、")}`,
    `商品来源：${npc.trade.source}`
  ].join("\n");
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
  const map = currentMap(game);
  const debug = npcDebugInfo(npc, game);
  const messages = [
    { role: "system", content: "你是石器时代单人 PWA 里的 NPC。必须保持 NPC 身份，只根据当前地图、任务、宠物和玩家发言回应。中文，1-2 句。你可以解释或建议 allowedActions，但不能直接执行状态变化；所有交易、传送、奖励、flag 和战斗都必须由 Worker 的确定性 NPC VM 校验执行。" },
    { role: "user", content: JSON.stringify({
      npc: { id: npc.id, name: npc.name, type: npc.type, dialogue: npc.dialogue, source: npc.source, script: npc.script },
      vm: { allowedActions: debug.allowedActions, recentTrace: debug.vmTrace },
      player: game.player,
      map: { name: map.name, exits: map.exits.map((exit) => exit.label) },
      quests: game.quests,
      pets: game.pets.map(petSummary),
      text
    }) }
  ];
  const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
  const rsp = await env.AI.run(model, { messages });
  return rsp.response || rsp.text || fallbackNpcReply(npc);
}

function openDialog(game, npc, messages) {
  const debug = npcDebugInfo(npc, game);
  game.dialog = {
    open: true,
    npcId: npc.id,
    npcName: npc.name,
    npcType: npc.type,
    trade: npc.trade ? withTradeState(game, npc.trade) : null,
    warp: npc.warp || null,
    messages: messages.slice(-12),
    suggestions: dialogSuggestions(npc),
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
  if (npc.trade?.items?.length || /shop/i.test(`${npc.type} ${npc.template}`)) actions.push("shop");
  if (npc.warp?.target || /warp/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("warp");
  if (isHealerNpc(npc)) actions.push("heal");
  if (isSavePointNpc(npc)) actions.push("save");
  if (npc.questId) actions.push("quest");
  if (npcDialogueLines(npc).length || /timeman|town|msg|sign/i.test(`${npc.type} ${npc.template}`)) actions.push("say");
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

function recentNpcVmEvents(game, npc) {
  return (game.npcVmEvents || [])
    .filter((event) => event.npcId === npc.id)
    .slice(-8);
}

function withTradeState(game, trade) {
  const state = inventoryState(game);
  return {
    ...trade,
    inventory: state,
    items: (trade.items || []).map((item) => ({
      ...item,
      affordable: game.player.stone >= Number(item.price || item.cost || 0),
      canCarry: canCarryItem(game, item)
    }))
  };
}

function dialogSuggestions(npc) {
  if (npc.trade || /shop/i.test(npc.type)) return ["hi", "买东西", "地图"];
  if (/healer/i.test(npc.type)) return ["hi", "治疗", "地图"];
  if (npc.warp || /warp/i.test(npc.type)) return ["hi", "传送", "出口"];
  if (/save/i.test(npc.type)) return ["hi", "记录", "地图"];
  return ["hi", "任务", "地图"];
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
    source: "ref___data/itemset6.txt"
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

function fallbackGuide(context) {
  const quest = context.quests.find((item) => item.status === "进行中");
  if (quest) {
    return `你现在在${context.map.name}。建议继续任务「${quest.title}」：${quest.steps[Math.min(quest.progress || 0, quest.steps.length - 1)]}。当前地图 NPC：${context.map.npcs.join("、") || "无"}。`;
  }
  return `你现在在${context.map.name}。可以先和 NPC 交谈接任务，或者查看地图出口继续探索。出口：${context.map.exits.join("、") || "暂无"}`;
}

function normalizeGame(game) {
  if (!game || !game.player || !game.location) throw new Error("需要先创建人物");
  ensureSaveIdentity(game);
  game.pets ||= [];
  game.inventory ||= [];
  game.quests ||= {};
  ensureFlags(game);
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
    `LAST_WARP=${game.lastWarp?.to ? `${game.lastWarp.to.mapId},${game.lastWarp.to.x},${game.lastWarp.to.y}` : "NONE"}`,
    `PETCOUNT=${game.pets.length}`,
    `ITEMCOUNT=${game.inventory.length}`,
    `LAST_SAVEPOINT=${game.savePoint ? safeJson(game.savePoint) : ""}`,
    `WALK_STEPS=${game.walk?.steps || 0}`,
    `ENCOUNTER_STEPS=${game.walk?.encounterSteps || 0}`,
    `QUESTS=${safeJson(activeQuests)}`,
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
  return map;
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
  if (event === "enterMap" && objectives.visitEncounterMap) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (map?.encounterPets?.length) return Math.max(2, Number(quest.progress || 0));
  }
  if (event === "fieldWin" && objectives.fieldWin) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (map?.encounterPets?.length) return Math.max(quest.steps.length - 1, Number(quest.progress || 0));
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
  setEventFlag(game, shiftbit, kind);
  if (!shiftbit) return;
  recordNpcVmEvent(game, npc, "setFlag", "ok", {
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
  const [enemyText, skillText] = await Promise.all([
    assetText(env, request, DATA_FILES.enemyBase),
    assetText(env, request, DATA_FILES.skills)
  ]);
  const skills = parseSkills(skillText);
  const enemyBaseSet = new Map();
  const enemyNoList = [];
  for (const line of lines(enemyText)) {
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
  cache = { enemyBaseSet, enemyNoList, skills };
  return cache;
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

function pick(list) {
  return list[randInt(list.length)];
}

function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}
