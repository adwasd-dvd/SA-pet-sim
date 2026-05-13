import { WORLD } from "./world-data.js";
import { STONEAGE_KNOWLEDGE } from "./stoneage-knowledge.js";

const DATA_FILES = {
  enemy: "/data/enemy1.txt",
  enemyBase: "/data/enemybase2.txt",
  items: "/data/itemset6.txt",
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
const CHAR_MAX_EXP = 1224160000;
const EXPGET_MAXLEVEL = 5;
const EXPGET_DIV = 15;
const LEVEL_EXP_TABLE = Object.freeze([
  0, 0, 2, 8, 25, 62, 129, 240, 409, 656, 1000, 1464, 2073, 2856, 3841, 5062,
  6553, 8352, 10497, 13032, 16000, 19448, 23425, 27984, 33177, 39062, 45697, 53144,
  61465, 70728, 81000, 92352, 104857, 118592, 133633, 150062, 167961, 187416, 208513,
  231344, 256000, 282576, 311169, 341880, 374809, 410062, 447745, 487968, 530841,
  576480, 625000, 676520, 731161, 789048, 850305, 915062, 983449, 1055600, 1131649,
  1211736, 1296000, 1402110, 1515521, 1636671, 1766022, 1904066, 2051322, 2208342,
  2375708, 2554041, 2744000, 2946281, 3161630, 3390834, 3634736, 3894230, 4170272,
  4463878, 4776136, 5108207, 5461333, 5836843, 6236162, 6660816, 7112448, 7592818,
  8103824, 8647511, 9226082, 9841920, 10497600, 11195912, 11939882, 12732800,
  13578242, 14480111, 15442664, 16470563, 17568917, 18743336, 20000000, 21345723,
  22788045, 24335325, 25996856, 27783000, 29705340, 31776872, 34012224, 36427912,
  39042666, 41877804, 44957696, 48310329, 51968004, 55968200, 60354645, 65178685,
  70501009, 76393874, 82944000, 95270613, 110766728, 130792366, 157614250, 195312500,
  252047376, 320144641, 388435456, 456922881, 525610000, 594499921, 663595776,
  732900721, 802417936, 872150625, 942102016, 1012275361, 1082673936, 1153301041,
  1224160000
]);
const ENEMY_BASE_EXP_TABLE = Object.freeze([
  1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 58, 65, 72,
  79, 87, 95, 104, 113, 122, 131, 141, 151, 162, 173, 184, 196, 208, 220, 233,
  246, 260, 274, 288, 303, 318, 333, 348, 365, 381, 398, 415, 432, 450, 468, 486,
  506, 525, 545, 564, 585, 606, 627, 648, 670, 692, 714, 737, 760, 784, 808, 832,
  857, 882, 907, 933, 959, 956, 1012, 1040, 1067, 1095, 1123, 1152, 1181, 1210,
  1240, 1270, 1300, 1331, 1362, 1394, 1426, 1458, 1490, 1524, 1557, 1590, 1625,
  1659, 1694, 1729, 1764, 1800, 1836, 1872, 1909, 1946, 1983, 2021, 2059, 2097,
  2136, 2175, 2214, 2254, 2294, 2334, 2374, 2414, 2455, 2496, 2537, 2578, 2619,
  2661, 2703, 2745, 2787, 2829, 2872, 2915, 2958, 3000, 3043, 3088, 3132, 3176,
  3220, 3264, 3309, 3354, 3399, 3444, 3489, 3535, 3581, 3627, 3673, 3719, 3765,
  3812, 3859, 3906, 3953, 4000, 4047, 4095, 4143, 4191, 4239, 4287, 4335, 4384,
  4433, 4482, 4531, 4580, 4629, 4679, 4729, 4779, 4829, 4879, 4929, 4980, 5031,
  5082, 5133, 5133, 5184, 5235, 5287, 5339, 5391, 5443, 5495, 5547, 5599, 5652,
  5705, 5758, 5811, 5864, 5917, 5970, 6024, 6078, 6132, 6186, 6240, 6295, 6350,
  6405, 6460
]);
const SAVE_SCHEMA = "saac-pwa-v1";
const MAXCHAR_PER_USER = 4;
const INVENTORY_CAPACITY = 15;
const PET_CAPACITY = 5;
const CG_INVISIBLE = 99;
const MAP_BLOCKED = 1;
const MAP_SPECIAL = 2;
const EVENT_NPC = 1;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";
const NPC_INTERACTION_RANGE = 2;
const NPC_WINDOW_ACTION_RANGE = 3;
const ROUTE_MAX_STEPS = 160;
const ROUTE_MAX_VISITS = 12000;
const DEFAULT_CHAR_DIR = 5;
const AI_WORKSPACE_SCHEMA = "stoneage-ai-workspace-v1";
const AI_WORKSPACE_MAX_MEMORIES = 60;
const SAFE_WILD_ENCOUNTER_MAP_RE = /村|庄园|店|医院|道场|柜台|商店|房屋|之家|的家|宠物店|肉店|武器店|防具店|便利|竞技场|競技場|斗技场|鬥技場|PK竞技|武斗场/i;
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
const OPENAI_GUIDE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    intent: {
      type: "string",
      enum: ["status", "map", "npc", "quest", "battle", "inventory", "pet", "refuse", "other"]
    },
    nextStep: { type: "string" },
    confidence: { type: "number" }
  },
  required: ["reply", "intent", "nextStep", "confidence"],
  additionalProperties: false
};
const OPENAI_NPC_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    intent: {
      type: "string",
      enum: ["chat", "quest", "trade", "heal", "save", "warp", "battle", "discount", "gift", "noEncounter", "negotiatePass", "mapInfo", "refuse"]
    },
    action: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["none", "warp", "teleportInfo", "noEncounter", "shopDiscount", "offMenuItem", "negotiatePass"]
        },
        text: { type: "string" },
        seconds: { type: "integer" },
        percent: { type: "integer" },
        reason: { type: "string" }
      },
      required: ["type", "text", "seconds", "percent", "reason"],
      additionalProperties: false
    },
    confidence: { type: "number" }
  },
  required: ["reply", "intent", "action", "confidence"],
  additionalProperties: false
};

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
    if (url.pathname === "/api/game/dialog-ai" && request.method === "POST") {
      const body = await readJson(request);
      return json(dialogAiModeGame(body.game, String(body.npcId || ""), Boolean(body.enabled)));
    }
    if (url.pathname === "/api/game/buy" && request.method === "POST") {
      const body = await readJson(request);
      return json(buyGame(body.game, String(body.npcId || ""), Number(body.itemId)));
    }
    if (url.pathname === "/api/game/use-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(useItemGame(body.game, Number(body.itemId)));
    }
    if (url.pathname === "/api/game/drop-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(dropItemGame(body.game, Number(body.itemId), Number(body.qty) || 1));
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
    if (url.pathname === "/api/game/pet-mode" && request.method === "POST") {
      const body = await readJson(request);
      return json(petModeGame(body.game, Number(body.petIndex) || 0, String(body.mode || "active")));
    }
    if (url.pathname === "/api/game/pet-release" && request.method === "POST") {
      const body = await readJson(request);
      return json(releasePetGame(body.game, body.petIndex));
    }
    if (url.pathname === "/api/ai/guide" && request.method === "POST") {
      const body = await readJson(request);
      return json(await guideGame(env, request, body.game, String(body.prompt || "")));
    }
    if (url.pathname === "/api/ai/workspace" && request.method === "POST") {
      const body = await readJson(request);
      const game = normalizeGame(body.game);
      return json({
        workspace: buildAiWorkspace(env, game, String(body.prompt || "")),
        game: withMap(game)
      });
    }
    if (url.pathname === "/api/ai/workspace-note" && request.method === "POST") {
      const body = await readJson(request);
      const game = normalizeGame(body.game);
      const note = writeAiWorkspaceNote(game, body.note || body);
      return json({
        note,
        workspace: buildAiWorkspace(env, game, String(body.prompt || note.title || "")),
        game: withMap(game)
      });
    }
    if (url.pathname === "/api/ai/status" && request.method === "GET") {
      return json(aiRuntimeStatus(env));
    }
    return json({ error: "not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "server error" }, 500);
  }
}

async function createPlayerGame(env, request, body) {
  const data = await loadGameData(env, request);
  const starterEnemy = createEnemy(data, Number(body.starterPet) || 100, 1) || createEnemy(data, pick(data.enemyNoList), 1);
  const starter = normalizeCapturedPet(starterEnemy);
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
      hp: 98,
      maxHp: 98,
      dir: DEFAULT_CHAR_DIR,
      Vital: 1600,
      Str: 1200,
      Tough: 1200,
      Dex: 1000,
      EarthAT: 0,
      WaterAT: 0,
      FireAT: 0,
      WindAT: 0,
      WorkFixVital: 16,
      WorkFixStr: 14,
      WorkFixTough: 14,
      WorkFixDex: 10,
      WorkMaxHp: 98,
      duelPoint: 0,
      skillUpPoint: 0,
      killPetCount: 0,
      deadCount: 0,
      battleCount: 0,
      winCount: 0,
      loseCount: 0
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
    aiWorkspace: createAiWorkspace(now),
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
    const activePet = getActivePet(game);
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

function dropItemGame(game, itemId, qty = 1) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能整理背包");
  const dropped = dropItemInPlace(game, itemId, qty);
  return withMap(game, {
    itemAction: {
      type: "drop",
      itemId: dropped.itemId,
      itemName: dropped.itemName,
      qty: dropped.qty,
      remaining: dropped.remaining,
      source: `${GMSV_DATA_SOURCE}/itemset6.txt + CHAR_MAXITEMNUM=${INVENTORY_CAPACITY}`
    }
  });
}

function dropItemInPlace(game, itemId, qty = 1) {
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");
  const count = Math.max(1, Math.trunc(Number(qty) || 1));
  const dropQty = Math.min(count, Number(item.qty || 0));
  item.qty = Number(item.qty || 0) - dropQty;
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  addLog(game, `丢弃了 ${item.name} x${dropQty}，背包空位 ${inventoryState(game).remaining}/${INVENTORY_CAPACITY}。`);
  return {
    itemId: item.id,
    itemName: item.name,
    qty: dropQty,
    remaining: Math.max(0, Number(item.qty || 0))
  };
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
  const activePet = getActivePet(game);
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

function dialogAiModeGame(game, npcId, enabled) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);
  setNpcAiModeReply(game, npc, enabled);
  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc);
  openDialog(game, npc, existing);
  addLog(game, `${npc.name} ${enabled ? "切换到 AI 对话" : "切回普通脚本对话"}。`);
  return withMap(game, { npc });
}

async function encounterGame(env, request, game) {
  game = normalizeGame(game);
  const map = currentMap(game);
  assertWildEncounterAllowed(map, game);
  await spawnEncounter(env, request, game, map, "野外");
  return withMap(game);
}

async function maybeStepEncounter(env, request, game, map) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.steps = Number(game.walk.steps || 0) + 1;
  if (!wildEncounterAllowed(map, game) || game.encounter) return false;
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
  assertWildEncounterAllowed(map, game);
  const encounter = await createEncounterParty(env, request, game, map);
  const enemy = encounter.enemies[0];
  if (!enemy) throw new Error("当前地图没有可遇敌宠物");
  game.encounter = enemy;
  const activePet = getActivePet(game);
  if (activePet) {
    ensureBattleState(game, activePet, enemy);
    if (game.battle) {
      game.battle.source = `${source} encounter from ${encounter.source}`;
      game.battle.enemyParty = encounter.enemies;
      game.battle.activeEnemyIndex = 0;
      game.battle.defeatedEnemies = [];
      game.battle.encounterArea = encounter.area ? {
        id: encounter.area.id,
        bounds: encounter.area.bounds,
        zorder: encounter.area.zorder,
        enemyMax: encounter.area.enemyMax
      } : null;
    }
  }
  const partyText = encounter.enemies.length > 1 ? `等 ${encounter.enemies.length} 个敌人` : "";
  addLog(game, `${source}遇到了 ${enemy.Name} Lv.${enemy.Lv}${partyText}。`);
  return enemy;
}

function hasActiveNoEncounterEffect(game) {
  const until = Number(game.effects?.noEncounterUntil || 0);
  if (!Number.isFinite(until) || until <= 0) return false;
  if (until > Date.now()) return true;
  if (game.effects) delete game.effects.noEncounterUntil;
  return false;
}

async function createEncounterParty(env, request, game, map) {
  const data = await loadGameData(env, request);
  const area = chooseEncounterArea(map, game.location);
  if ((map.encounterAreas || []).some((item) => item.groups?.length) && !area) {
    return { enemies: [], area: null, source: `${GMSV_DATA_SOURCE}/encount.txt no active area at (${game.location?.x},${game.location?.y})` };
  }
  if (area?.groups?.length) {
    const availableGroups = area.groups.filter((group) => encounterGroupCanAppear(game, group));
    if (!availableGroups.length) {
      return { enemies: [], area, source: `${GMSV_DATA_SOURCE}/encount.txt area ${area.id} gated by ${GMSV_DATA_SOURCE}/group1.txt item rules` };
    }
    const enemies = [];
    const counts = new Map();
    const enemyMax = Math.max(1, Number(area.enemyMax || 1));
    const count = randRange(1, enemyMax);
    const attempts = Math.max(10, count * 8);
    for (let i = 0; enemies.length < count && i < attempts; i += 1) {
      const group = pickWeighted(availableGroups, (item) => item.weight);
      const entry = group ? pickWeighted(group.enemies || [], (item) => item.weight) : null;
      if (entry && Number(counts.get(entry.enemyId) || 0) >= Math.max(1, Number(entry.createMax || 1))) continue;
      const enemy = entry ? createWildEnemyFromSpec(data, entry, game, area, group) : null;
      if (enemy) {
        counts.set(entry.enemyId, Number(counts.get(entry.enemyId) || 0) + 1);
        enemies.push(enemy);
      }
    }
    if (enemies.length) {
      return {
        enemies,
        area,
        source: `${GMSV_DATA_SOURCE}/encount.txt area ${area.id} + ${GMSV_DATA_SOURCE}/group1.txt + ${GMSV_DATA_SOURCE}/enemy1.txt + ${GMSV_DATA_SOURCE}/enemybase2.txt`
      };
    }
  }
  const petNo = pick(map.encounterPets || []);
  const enemy = createEnemy(data, petNo, Math.max(1, game.player.level + randInt(3) - 1));
  if (!enemy) return { enemies: [], area: null, source: `${GMSV_DATA_SOURCE}/encount.txt` };
  enemy.CaptureRate = wildCaptureRate(game, enemy);
  enemy.source = `${GMSV_DATA_SOURCE}/encount.txt fallback tempNo ${petNo} + ${GMSV_DATA_SOURCE}/enemybase2.txt`;
  return {
    enemies: [enemy],
    area: null,
    source: `${GMSV_DATA_SOURCE}/encount.txt fallback tempNo + ${GMSV_DATA_SOURCE}/enemybase2.txt`
  };
}

function encounterGroupCanAppear(game, group) {
  const requiredItem = Number(group?.appearByItemId || 0);
  if (requiredItem > 0 && !findInventoryItem(game, requiredItem)) return false;
  const blockedItem = Number(group?.notAppearByItemId || 0);
  if (blockedItem > 0 && findInventoryItem(game, blockedItem)) return false;
  return true;
}

function chooseEncounterArea(map, location) {
  const x = Number(location?.x || 0);
  const y = Number(location?.y || 0);
  const areas = (map.encounterAreas || []).filter((area) => area.groups?.length);
  const inside = areas
    .filter((area) => pointInBounds(x, y, area.bounds))
    .sort((a, b) => Number(b.zorder || 0) - Number(a.zorder || 0));
  return inside[0] || null;
}

function pointInBounds(x, y, bounds = []) {
  return x >= Number(bounds[0] || 0)
    && y >= Number(bounds[1] || 0)
    && x <= Number(bounds[2] || 0)
    && y <= Number(bounds[3] || 0);
}

function createWildEnemyFromSpec(data, entry, game, area, group) {
  const enemy = createEnemyFromEnemySpec(data, Number(entry.enemyId), null);
  if (!enemy) return null;
  enemy.CaptureRate = wildCaptureRate(game, enemy);
  enemy.source = [
    `${GMSV_DATA_SOURCE}/encount.txt area ${area.id}`,
    `${GMSV_DATA_SOURCE}/group1.txt group ${group.groupId}`,
    `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${entry.enemyId}`,
    `${GMSV_DATA_SOURCE}/enemybase2.txt ${entry.tempNo}`
  ].join(" + ");
  return enemy;
}

function wildCaptureRate(game, enemy) {
  return Math.max(18, Math.min(75, 70 - Number(enemy.Rare || 0) + Number(game.player?.level || 1) * 2));
}

function pickWeighted(items, weightOf) {
  const weighted = (items || [])
    .map((item) => ({ item, weight: Math.max(0, Number(weightOf(item)) || 0) }))
    .filter((entry) => entry.weight > 0);
  if (!weighted.length) return null;
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
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
  if (move.targetIndex != null) selectBattleTarget(game, move.targetIndex);
  if (move.type === "capture") {
    return performCaptureAction(game);
  }
  if (move.type === "item") {
    return performBattleItemAction(game, move.itemId);
  }
  if (!["attack", "guard", "wait"].includes(move.type)) throw new Error("这个战斗动作还没有实现");
  const activePet = getActivePet(game);
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
    const hit = combatDamageDetail(activePet, enemy);
    enemy.Hp = Math.max(0, Number(enemy.Hp || 0) - hit.damage);
    battleLog.push(`${activePet.Name} 攻击 ${enemy.Name}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
  };
  const enemyTurn = (guarded = false) => {
    const hit = combatDamageDetail(enemy, activePet, guarded ? 0.45 : 1);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - hit.damage);
    battleLog.push(`${enemy.Name} ${guarded ? "攻击防御中的" : "反击"} ${activePet.Name}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
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
  const targetMatch = value.match(/^(attack|h|攻击|打|capture|catch|捕获|抓宠|抓)[:|](\d+)$/);
  if (targetMatch) {
    const targetIndex = Math.max(0, Number(targetMatch[2]) || 0);
    const isCapture = ["capture", "catch", "捕获", "抓宠", "抓"].includes(targetMatch[1]);
    return {
      type: isCapture ? "capture" : "attack",
      command: `${isCapture ? "T" : "H"}|${targetIndex}`,
      targetIndex
    };
  }
  if (["release", "放走"].includes(value)) return { type: "escape", command: "E", release: true };
  if (["run", "escape", "逃跑", "离开", "離開", "e"].includes(value)) return { type: "escape", command: "E" };
  if (["capture", "catch", "捕获", "抓宠", "抓", "t", "t|0"].includes(value)) return { type: "capture", command: "T|0" };
  if (["item", "道具", "物品", "i"].includes(value)) return { type: "item", command: "I" };
  if (["guard", "防御", "防守", "g"].includes(value)) return { type: "guard", command: "G" };
  if (["wait", "待机", "等待", "n"].includes(value)) return { type: "wait", command: "N" };
  if (["attack", "攻击", "战斗", "打", "h", "h|0"].includes(value)) return { type: "attack", command: "H|0" };
  return { type: value, command: value };
}

function selectBattleTarget(game, targetIndex) {
  const battle = game.battle;
  const party = Array.isArray(battle?.enemyParty) ? battle.enemyParty : [];
  if (!party.length) {
    if (targetIndex === 0) return;
    throw new Error("当前战斗没有这个目标");
  }
  const target = party[targetIndex];
  if (!target) throw new Error("当前战斗没有这个目标");
  if (Number(target.Hp || 0) <= 0) throw new Error("这个目标已经倒下");
  battle.activeEnemyIndex = targetIndex;
  game.encounter = target;
}

function performBattleItemAction(game, itemId = null) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const activePet = getActivePet(game);
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
    const hit = combatDamageDetail(enemy, activePet);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - hit.damage);
    battleLog.push(`${enemy.Name} 趁机反击 ${activePet.Name}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
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
    const reward = grantBattleExperience(game, activePet, defeatedEnemies, { reason: "victory" });
    exp = reward.playerExp;
    stone = defeatedEnemies.reduce((sum, item) => sum + 12 + Number(item.Lv || 1) * 4, 0);
    game.player.stone += stone;
    syncStoneItem(game);
    const defeatedText = defeatedEnemies.length > 1
      ? `击败敌方 ${defeatedEnemies.length} 人`
      : `击败 ${enemy.Name}`;
    const petReward = reward.petName ? `，${reward.petName} 获得 ${reward.petExp} 经验` : "";
    const levelText = reward.levelUps.length ? ` ${reward.levelUps.join(" ")}` : "";
    battleLog.push(`${defeatedText}，人物获得 ${reward.playerExp} 经验${petReward}，获得 ${stone} 石币。${levelText}`.trim());
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
    recordBattleDefeat(game, activePet);
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
  const nextIndex = battle.enemyParty.findIndex((item) => Number(item.Hp || 0) > 0);
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
    Lv: enemy.Lv,
    Exp: sourceEnemyExp(enemy),
    SourceExp: sourceEnemyExp(enemy),
    WorkFixStr: enemy.WorkFixStr,
    WorkFixTough: enemy.WorkFixTough,
    WorkFixDex: enemy.WorkFixDex,
    EarthAT: enemy.EarthAT,
    WaterAT: enemy.WaterAT,
    FireAT: enemy.FireAT,
    WindAT: enemy.WindAT
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
  const activePet = getActivePet(game);
  if (activePet) {
    ensureBattleState(game, activePet, target);
    game.battle.sourceCommand = "T|0";
    game.battle.mode = "resolving";
  }
  const rate = Math.max(0, Math.min(100, Number(target.CaptureRate ?? 35)));
  if (rate > 0 && petState(game).used >= PET_CAPACITY) {
    const line = `宠物栏已满（${PET_CAPACITY}/${PET_CAPACITY}），无法捕获 ${enemyName}。`;
    if (game.battle) game.battle.log = [...(game.battle.log || []), line].slice(-8);
    addLog(game, line);
    return { result: "pet-full", enemyName, petName: enemyName, sourceCommand: "T|0", log: [line] };
  }
  const ok = Math.random() * 100 < rate;
  if (ok) {
    const capturedPet = normalizeCapturedPet(target);
    game.pets.push(capturedPet);
    game.encounter = null;
    game.battle = null;
    const reward = activePet
      ? grantBattleExperience(game, activePet, [target], { reason: "capture", scale: 0.5 })
      : { playerExp: 0, petExp: 0, petName: "", levelUps: [] };
    const exp = reward.playerExp;
    const stone = 20;
    game.player.stone += stone;
    syncStoneItem(game);
    const petReward = reward.petName ? `，${reward.petName} 获得 ${reward.petExp} 经验` : "";
    const levelText = reward.levelUps.length ? ` ${reward.levelUps.join(" ")}` : "";
    const line = `捕获成功！${enemyName} 加入了队伍，人物获得 ${exp} 经验${petReward}，获得 ${stone} 石币。${levelText}`.trim();
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
    const hit = combatDamageDetail(target, activePet);
    activePet.Hp = Math.max(0, Number(activePet.Hp || 0) - hit.damage);
    battleLog.push(`${target.Name} 反击 ${activePet.Name}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
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
  return combatDamageDetail(attacker, defender, multiplier).damage;
}

function combatDamageDetail(attacker, defender, multiplier = 1) {
  const attack = Math.max(1, Number(attacker.WorkFixStr || attacker.level || attacker.Lv || 1));
  const defense = Math.max(0, Number(defender.WorkFixTough || 0));
  const variance = 0.85 + Math.random() * 0.3;
  const elementMultiplier = elementalDamageMultiplier(attacker, defender);
  const raw = attack * variance - defense * 0.42;
  const critical = Math.random() * 100 < Math.max(2, Number(attacker.Critical || 0) * 0.35);
  return {
    damage: Math.max(1, Math.floor(raw * (critical ? 1.6 : 1) * multiplier * elementMultiplier)),
    critical,
    elementMultiplier
  };
}

function battleDetailSuffix(detail) {
  const parts = [];
  if (detail.critical) parts.push("会心");
  if (Math.abs(Number(detail.elementMultiplier || 1) - 1) >= 0.06) {
    parts.push(`属性${detail.elementMultiplier > 1 ? "有利" : "不利"} x${detail.elementMultiplier.toFixed(2)}`);
  }
  return parts.length ? `（${parts.join("，")}）` : "";
}

function elementalDamageMultiplier(attacker, defender) {
  const a = elementVector(attacker);
  const d = elementVector(defender);
  const advantage = a.earth * d.water + a.water * d.fire + a.fire * d.wind + a.wind * d.earth;
  const disadvantage = a.earth * d.wind + a.water * d.earth + a.fire * d.water + a.wind * d.fire;
  const score = (advantage - disadvantage) / 10000;
  return Math.max(0.7, Math.min(1.35, 1 + score * 0.45));
}

function elementVector(char = {}) {
  return {
    earth: clampInt(char.EarthAT ?? char.Earth ?? char.earth, 0, 100, 0),
    water: clampInt(char.WaterAT ?? char.Water ?? char.water, 0, 100, 0),
    fire: clampInt(char.FireAT ?? char.Fire ?? char.fire, 0, 100, 0),
    wind: clampInt(char.WindAT ?? char.WindAt ?? char.Wind ?? char.wind, 0, 100, 0)
  };
}

function levelExp(level) {
  const lv = clampInt(level, 0, CHAR_MAXUPLEVEL, 0);
  return LEVEL_EXP_TABLE[lv] ?? CHAR_MAX_EXP;
}

function progressionSummary(level, exp) {
  const lv = clampInt(level, 1, CHAR_MAXUPLEVEL, 1);
  const safeExp = clampInt(exp, 0, CHAR_MAX_EXP, 0);
  const currentLevelExp = levelExp(lv);
  const nextExp = lv >= CHAR_MAXUPLEVEL ? -1 : levelExp(lv + 1);
  const span = nextExp > currentLevelExp ? nextExp - currentLevelExp : 1;
  const expInLevel = Math.max(0, safeExp - currentLevelExp);
  const expToNext = nextExp < 0 ? 0 : Math.max(0, nextExp - safeExp);
  return {
    level: lv,
    exp: safeExp,
    currentLevelExp,
    nextExp,
    expInLevel,
    expToNext,
    progressPct: nextExp < 0 ? 100 : Math.max(0, Math.min(100, Math.floor((expInLevel / span) * 100))),
    source: "gmsv char_data.c LevelUpTbl cumulative EXP"
  };
}

function addPlayerExp(game, amount) {
  const exp = Math.max(0, Math.trunc(Number(amount) || 0));
  if (exp <= 0) return 0;
  game.player.exp = clampInt(Number(game.player.exp || 0) + exp, 0, CHAR_MAX_EXP, CHAR_MAX_EXP);
  return exp;
}

function addPetExp(pet, amount) {
  const exp = Math.max(0, Math.trunc(Number(amount) || 0));
  if (!pet || exp <= 0) return 0;
  pet.Exp = clampInt(Number(pet.Exp || 0) + exp, 0, CHAR_MAX_EXP, CHAR_MAX_EXP);
  return exp;
}

function maybeLevelPlayer(game) {
  normalizePlayerRuntime(game.player);
  const levelUps = [];
  while (game.player.level < CHAR_MAXUPLEVEL && game.player.exp >= levelExp(game.player.level + 1)) {
    game.player.level += 1;
    game.player.duelPoint = Number(game.player.duelPoint || 0) + game.player.level * 10;
    game.player.skillUpPoint = Number(game.player.skillUpPoint || 0) + 3;
    game.player.Vital = Number(game.player.Vital || 0) + 38 + randInt(7);
    game.player.Str = Number(game.player.Str || 0) + 28 + randInt(7);
    game.player.Tough = Number(game.player.Tough || 0) + 28 + randInt(7);
    game.player.Dex = Number(game.player.Dex || 0) + 22 + randInt(7);
    compliancePlayerParameter(game.player, { preserveHp: false });
    levelUps.push(`${game.player.name} 提升到 Lv.${game.player.level}`);
  }
  normalizePlayerRuntime(game.player);
  levelUps.forEach((line) => addLog(game, `${line}。`));
  return levelUps;
}

function maybeLevelPet(game, pet) {
  if (!pet) return [];
  normalizePetRuntime(pet);
  const levelUps = [];
  const limit = petLimitLevel(pet);
  while (pet.Lv < limit && pet.Exp >= levelExp(pet.Lv + 1)) {
    petLevelUp(pet, { preserveHp: true });
    levelUps.push(`${pet.Name} 提升到 Lv.${pet.Lv}`);
  }
  normalizePetRuntime(pet);
  levelUps.forEach((line) => addLog(game, `${line}。`));
  return levelUps;
}

function petLimitLevel(pet) {
  const raw = Number(pet?.LimitLevel ?? pet?.limitLevel);
  if (!Number.isFinite(raw) || raw <= 0) return CHAR_MAXUPLEVEL;
  return clampInt(raw, 1, CHAR_MAXUPLEVEL, CHAR_MAXUPLEVEL);
}

function sourceEnemyExp(enemy) {
  const direct = Number(enemy?.SourceExp ?? enemy?.EnemyExp ?? enemy?.Exp);
  if (Number.isFinite(direct) && direct > 0) return Math.max(1, Math.trunc(direct));
  return sourceEnemyExpFromStats(enemy);
}

function sourceEnemyExpFromStats(enemy = {}) {
  const level = clampInt(enemy.Lv ?? enemy.level, 1, ENEMY_BASE_EXP_TABLE.length, 1);
  const base = ENEMY_BASE_EXP_TABLE[level - 1] || ENEMY_BASE_EXP_TABLE.at(-1) || 1;
  const rankNum = [2.5, 2, 1.5, 1, 0.5, 0][clampInt(enemy.PetRank, 0, 5, 5)] ?? 0;
  const alpha = (
    Number(enemy.Critical || 0) + Number(enemy.Counter || 0) + Number(enemy.WorkModCaptureDefault || 0)
    + Number(enemy.Poison || 0) + Number(enemy.Paralysis || 0) + Number(enemy.Sleep || 0)
    + Number(enemy.Stone || 0) + Number(enemy.Drunk || 0) + Number(enemy.Confusion || 0)
  ) / 100 + Number(enemy.Rare || 0);
  return Math.max(1, Math.trunc(base + (rankNum + alpha) * level));
}

function battleExpForLevel(enemy, characterLevel) {
  const exp = sourceEnemyExp(enemy);
  const level = clampInt(characterLevel, 1, CHAR_MAXUPLEVEL, 1);
  const enemyLevel = clampInt(enemy?.Lv, 1, CHAR_MAXUPLEVEL, 1);
  const diff = level - enemyLevel;
  if (diff <= EXPGET_MAXLEVEL) return exp;
  const factor = EXPGET_MAXLEVEL + EXPGET_DIV - diff;
  if (factor <= 0) return 1;
  return Math.max(1, Math.trunc((exp * factor) / EXPGET_DIV));
}

function scaleBattleExp(exp, scale = 1) {
  return exp <= 0 ? 0 : Math.max(1, Math.trunc(exp * Math.max(0, Number(scale) || 0)));
}

function grantBattleExperience(game, activePet, defeatedEnemies, options = {}) {
  const enemies = (defeatedEnemies || []).filter(Boolean);
  const scale = options.scale ?? 1;
  const playerExp = enemies.reduce((sum, enemy) => sum + scaleBattleExp(battleExpForLevel(enemy, game.player.level), scale), 0);
  const petExp = activePet
    ? enemies.reduce((sum, enemy) => sum + scaleBattleExp(battleExpForLevel(enemy, activePet.Lv), scale), 0)
    : 0;
  addPlayerExp(game, playerExp);
  if (activePet) addPetExp(activePet, petExp);
  recordBattleVictory(game, activePet, enemies, options.reason || "battle");
  const playerLevelUps = maybeLevelPlayer(game);
  const petLevelUps = activePet ? maybeLevelPet(game, activePet) : [];
  syncCharacterFields(game);
  return {
    playerExp,
    petExp,
    petName: activePet?.Name || "",
    levelUps: [...playerLevelUps, ...petLevelUps],
    source: "gmsv battle.c BATTLE_AddExpItem/BATTLE_GetExpGold"
  };
}

function recordBattleVictory(game, activePet, enemies, reason) {
  const count = Math.max(1, enemies.length);
  game.player.killPetCount = Number(game.player.killPetCount || 0) + count;
  game.player.battleCount = Number(game.player.battleCount || 0) + 1;
  game.player.winCount = Number(game.player.winCount || 0) + 1;
  game.player.lastBattleReason = reason;
  if (activePet) {
    activePet.KillPetCount = Number(activePet.KillPetCount || 0) + count;
    activePet.BattleCount = Number(activePet.BattleCount || 0) + 1;
    activePet.WinCount = Number(activePet.WinCount || 0) + 1;
    activePet.LastBattleReason = reason;
  }
}

function recordBattleDefeat(game, activePet) {
  game.player.deadCount = Number(game.player.deadCount || 0) + 1;
  game.player.battleCount = Number(game.player.battleCount || 0) + 1;
  game.player.loseCount = Number(game.player.loseCount || 0) + 1;
  if (activePet) {
    activePet.DeadCount = Number(activePet.DeadCount || 0) + 1;
    activePet.BattleCount = Number(activePet.BattleCount || 0) + 1;
    activePet.LoseCount = Number(activePet.LoseCount || 0) + 1;
  }
  syncCharacterFields(game);
}

function normalizeCapturedPet(target) {
  const pet = { ...target };
  pet.Exp = levelExp(clampInt(pet.Lv, 1, CHAR_MAXUPLEVEL, 1));
  pet.SourceExp = 0;
  pet.EnemyExp = 0;
  pet.CaptureRate = Number(pet.CaptureRate || 0);
  normalizePetRuntime(pet);
  return pet;
}

function trainGame(game, petIndex) {
  game = normalizeGame(game);
  if (petIndex < 0 || petIndex >= game.pets.length) throw new Error("没有找到这只宠物");
  throw new Error("升级需要通过战斗经验累计；请去野外战斗，或和 AI 协商代练。");
}

function restGame(game) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能休息");
  healParty(game);
  addLog(game, `${game.player.name} 和宠物休息了一会儿，耐久力恢复了。`);
  return withMap(game);
}

function petModeGame(game, petIndex, mode) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中暂时不能切换出战宠");
  const index = clampInt(petIndex, 0, Math.max(0, game.pets.length - 1), 0);
  const pet = game.pets[index];
  if (!pet) throw new Error("没有找到这只宠物");
  if (!["active", "battle", "出战", "战斗", "fight"].includes(mode)) {
    throw new Error("这个宠物状态还没有实现");
  }
  ensurePetFormation(game).activeIndex = index;
  addLog(game, `${pet.Name} 设为出战宠。`);
  return withMap(game, {
    petAction: {
      type: "active",
      petIndex: index,
      petName: pet.Name,
      source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`
    }
  });
}

function releasePetGame(game, petIndex) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能放生宠物");
  const released = releasePetInPlace(game, petIndex);
  return withMap(game, {
    petAction: {
      type: "release",
      petIndex: released.index,
      petName: released.pet.Name,
      remaining: game.pets.length,
      source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`
    }
  });
}

function releasePetInPlace(game, petIndex) {
  const index = exactPetIndex(game, petIndex);
  if (game.pets.length <= 1) throw new Error("至少要保留一只宠物");
  const formation = ensurePetFormation(game);
  const oldActive = formation.activeIndex;
  const [pet] = game.pets.splice(index, 1);
  if (!pet) throw new Error("没有找到这只宠物");
  if (oldActive === index) formation.activeIndex = Math.min(index, game.pets.length - 1);
  else if (oldActive > index) formation.activeIndex = oldActive - 1;
  else formation.activeIndex = oldActive;
  ensurePetFormation(game);
  addLog(game, `${pet.Name} 离开了队伍，宠物栏空出 1 格。`);
  return { index, pet };
}

async function guideGame(env, request, game, prompt) {
  game = normalizeGame(game);
  const action = await applyGuideRequest(env, request, game, prompt);
  if (action) {
    return {
      text: action.text,
      model: "local-action",
      provider: "local-action",
      action: action.action,
      game: withMap(game)
    };
  }
  const map = currentMap(game);
  const context = buildGuideContext(game, map, prompt);
  if (hasOpenAi(env)) {
    try {
      const rsp = await callOpenAiGuide(env, context, prompt);
      return { text: rsp.reply || fallbackGuide(context, prompt), model: rsp.model, provider: "openai" };
    } catch (error) {
      if (!env.AI || typeof env.AI.run !== "function") {
        return {
          text: fallbackGuide(context, prompt, error),
          model: "local-rule",
          provider: "local-rule",
          warning: error?.message || "OpenAI failed"
        };
      }
    }
  }
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      {
        role: "system",
        content: [
          "你是单人版石器时代网页运行时的向导，不是万能 GM。",
          "必须只根据给定 JSON 回答；把“当前能做的事”和“需要找对应 NPC/脚本的事”说清楚。",
          "如果玩家问任务、地图、NPC、交易、战斗或避敌，要优先引用当前地图、附近 NPC、出口、任务进度、原 gmsv 脚本线索。",
          "如果 JSON 里有 knowledge，只引用其中和玩家问题相关的 17173 压缩条目；条目只是索引时要说明不能补编完整流程。",
          "workspace.memory 是 Worker 保存的受限记忆，只能当线索；和当前状态冲突时以当前状态为准。",
          "中文，最多三段；给出下一步可执行动作，不要编不存在的地点、NPC 或奖励。"
        ].join("\n")
      },
      { role: "user", content: `${prompt || "我下一步该做什么？"}\n\n当前状态 JSON：${JSON.stringify(context)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    try {
      const rsp = await env.AI.run(model, { messages });
      return { text: rsp.response || rsp.text || fallbackGuide(context, prompt), model, provider: "workers-ai" };
    } catch (error) {
      return {
        text: fallbackGuide(context, prompt, error),
        model: "local-rule",
        provider: "local-rule",
        warning: error?.message || "AI binding failed"
      };
    }
  }
  return { text: fallbackGuide(context, prompt), model: "local-rule", provider: "local-rule" };
}

async function callOpenAiGuide(env, context, prompt) {
  const system = [
    "你是单人版石器时代网页运行时的向导，不是万能 GM。",
    "只根据当前 JSON 状态回答；不要编不存在的地点、NPC、道具、任务或奖励。",
    "如果请求会改变游戏状态，说明应由 Worker 的确定性逻辑执行；你只负责解释和提出下一步。",
    "优先引用当前地图、附近 NPC、出口、任务进度、背包、宠物、战斗和临时状态。",
    "context.knowledge 是从 17173 石器时代专区压缩检索出的相关知识；只用匹配条目补充专业背景，不要把索引条目扩写成不存在的完整攻略。",
    "context.workspace.memory 是 Worker 保存的受限记忆，只能作为线索；不要把记忆当成已完成的任务状态。",
    "中文，最多三段，口吻清楚但保持游戏沉浸感。"
  ].join("\n");
  const user = JSON.stringify({
    prompt: prompt || "我下一步该做什么？",
    context
  });
  const { json: decision, model } = await callOpenAiStructured(env, {
    name: "stoneage_guide_reply",
    schema: OPENAI_GUIDE_SCHEMA,
    system,
    user,
    maxOutputTokens: 700
  });
  return {
    model,
    reply: String(decision?.reply || "").trim()
  };
}

function hasOpenAi(env) {
  return typeof env?.OPENAI_API_KEY === "string" && env.OPENAI_API_KEY.trim().length > 0;
}

function openAiModel(env) {
  return String(env?.OPENAI_MODEL || DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL;
}

function aiRuntimeStatus(env) {
  if (hasOpenAi(env)) {
    return {
      provider: "openai",
      model: openAiModel(env),
      actionAuthority: "worker-npc-vm",
      structured: true,
      fallback: env?.AI && typeof env.AI.run === "function" ? "workers-ai" : "local-rule"
    };
  }
  if (env?.AI && typeof env.AI.run === "function") {
    return {
      provider: "workers-ai",
      model: env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct",
      actionAuthority: "worker-npc-vm",
      structured: false,
      fallback: "local-rule"
    };
  }
  return {
    provider: "local-rule",
    model: "local-rule",
    actionAuthority: "worker-npc-vm",
    structured: false,
    fallback: "none"
  };
}

async function callOpenAiStructured(env, { name, schema, system, user, maxOutputTokens = 600 }) {
  const model = openAiModel(env);
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema
        }
      },
      max_output_tokens: maxOutputTokens
    })
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`OpenAI ${response.status}: ${message.slice(0, 240)}`);
  }
  const payload = await response.json();
  const outputText = extractOpenAiOutputText(payload);
  if (!outputText) throw new Error("OpenAI returned empty structured output");
  try {
    return { json: JSON.parse(outputText), model };
  } catch (error) {
    throw new Error(`OpenAI structured JSON parse failed: ${error.message || "invalid JSON"}`);
  }
}

function extractOpenAiOutputText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text.trim();
  const parts = [];
  for (const item of payload?.output || []) {
    if (typeof item?.text === "string") parts.push(item.text);
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") parts.push(content.text);
      if (typeof content?.content === "string") parts.push(content.content);
    }
  }
  return parts.join("\n").trim();
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

  if (isItemDropRequest(lower)) {
    if (game.encounter) {
      return {
        text: "战斗中不能整理背包。先结束当前战斗，再丢弃或使用道具。",
        action: { type: "item-drop-refused", reason: "battle-active" }
      };
    }
    const choice = chooseGuideItem(game, text);
    if (!choice?.item) {
      return {
        text: guideItemChoiceHelp(game),
        action: { type: "item-drop-refused", reason: choice?.reason || "unknown-item" }
      };
    }
    const qty = itemDropQtyFromPrompt(text, choice.item);
    const dropped = dropItemInPlace(game, choice.item.id, qty);
    return {
      text: `已丢弃 ${dropped.itemName} x${dropped.qty}，背包现在 ${inventoryState(game).used}/${INVENTORY_CAPACITY}。`,
      action: { type: "item-drop", itemId: dropped.itemId, itemName: dropped.itemName, qty: dropped.qty, reason: choice.reason }
    };
  }

  if (isItemUseRequest(lower)) {
    const choice = chooseGuideItem(game, text);
    if (!choice?.item) {
      return {
        text: guideItemChoiceHelp(game).replace("丢弃", "使用"),
        action: { type: "item-use-refused", reason: choice?.reason || "unknown-item" }
      };
    }
    const preview = previewRecoveryItem(game, choice.item);
    if (!preview.usable) {
      return {
        text: `${choice.item.name} 现在没有可模拟的恢复效果。可以继续找对应 NPC 或脚本线索确认这个道具的原版用途。`,
        action: { type: "item-use-refused", reason: preview.reason || "unsupported", itemId: choice.item.id }
      };
    }
    const itemUse = applyRecoveryItem(game, choice.item);
    addLog(game, `AI 向导使用 ${itemUse.itemName}，${itemUse.targetName} 的耐久力恢复 ${itemUse.restored}。`);
    return {
      text: `已使用 ${itemUse.itemName}，${itemUse.targetName} 的耐久力从 ${itemUse.before} 恢复到 ${itemUse.after}。`,
      action: { type: "item-use", itemId: itemUse.itemId, itemName: itemUse.itemName, targetName: itemUse.targetName, restored: itemUse.restored, reason: choice.reason }
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

  if (isPetReleaseRequest(lower)) {
    if (game.encounter) {
      return {
        text: "战斗中不能放生宠物。先结束当前战斗，再整理宠物栏。",
        action: { type: "pet-release-refused", reason: "battle-active" }
      };
    }
    if ((game.pets || []).length <= 1) {
      return {
        text: "现在只有一只宠物，先保留它吧；至少要有一只宠物才能继续战斗和探索。",
        action: { type: "pet-release-refused", reason: "last-pet" }
      };
    }
    const choice = chooseGuidePet(game, text);
    if (!choice?.pet) {
      return {
        text: `${guidePetChoiceHelp(game)} 放生会永久移出当前队伍，请说清楚要放生哪一只。`,
        action: { type: "pet-release-refused", reason: choice?.reason || "unknown-pet" }
      };
    }
    const released = releasePetInPlace(game, choice.index);
    return {
      text: `${released.pet.Name} 已离开队伍，宠物栏现在是 ${petState(game).used}/${PET_CAPACITY}。`,
      action: { type: "pet-release", petIndex: choice.index, petName: released.pet.Name, reason: choice.reason }
    };
  }

  if (isPetSwitchRequest(lower) && !isPetTrainingRequest(lower)) {
    if (game.encounter) {
      return {
        text: "现在已经进入战斗，暂时不能换出战宠。先完成、逃离或放走当前战斗目标，再调整宠物队列。",
        action: { type: "pet-switch-refused", reason: "battle-active" }
      };
    }
    const choice = chooseGuidePet(game, text);
    if (!choice?.pet) {
      return {
        text: guidePetChoiceHelp(game),
        action: { type: "pet-switch-refused", reason: choice?.reason || "unknown-pet" }
      };
    }
    ensurePetFormation(game).activeIndex = choice.index;
    addLog(game, `AI 向导把 ${choice.pet.Name} 设为出战宠。`);
    return {
      text: `已让 ${choice.pet.Name} Lv.${Number(choice.pet.Lv || 1)} 出战。之后战斗和道具恢复都会优先作用在这只宠物身上。`,
      action: { type: "pet-switch", petIndex: choice.index, petName: choice.pet.Name, reason: choice.reason }
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

  if (isPetTrainingRequest(lower)) {
    return runGuideTrainingBattle(env, request, game, text);
  }

  if (!game.encounter && hasAny(lower, ["遇敌", "遇敵", "野外敌人", "野外敵人", "找敌人", "找敵人", "敌人", "敵人", "刷怪", "开战", "開戰"])) {
    const map = currentMap(game);
    if (!wildEncounterAllowed(map, game)) {
      return {
        text: wildEncounterBlockedText(map, game),
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

async function runGuideTrainingBattle(env, request, game, prompt) {
  const activeIndex = getActivePetIndex(game);
  const activePet = getActivePet(game);
  if (!activePet) {
    return {
      text: "现在没有出战宠，不能代练。先带上一只宠物，再去野外按原版战斗结算获得经验。",
      action: { type: "ai-training-refused", reason: "no-active-pet" }
    };
  }
  let map = currentMap(game);
  if (!game.encounter) {
    if (!wildEncounterAllowed(map, game)) {
      return {
        text: `${wildEncounterBlockedText(map, game)} 代练不会直接给等级；你可以先去野外，我再按战斗流程帮你打。`,
        action: { type: "ai-training-refused", reason: "safe-map", mapId: map.id }
      };
    }
    await spawnEncounter(env, request, game, map, "AI 代练");
    map = currentMap(game);
  }
  const petBefore = game.pets[activeIndex] || activePet;
  const before = {
    playerLevel: Number(game.player.level || 1),
    playerExp: Number(game.player.exp || 0),
    petLevel: Number(petBefore.Lv || 1),
    petExp: Number(petBefore.Exp || 0)
  };
  const logs = [];
  let lastOutcome = null;
  for (let i = 0; i < 12 && game.encounter; i += 1) {
    lastOutcome = performBattleAction(game, "attack");
    logs.push(...(lastOutcome.log || []));
    if (!game.encounter || ["victory", "defeat", "escaped", "released", "captured"].includes(lastOutcome.result)) break;
  }
  const petAfter = game.pets[activeIndex] || getActivePet(game);
  const after = {
    playerLevel: Number(game.player.level || 1),
    playerExp: Number(game.player.exp || 0),
    petLevel: Number(petAfter?.Lv || 1),
    petExp: Number(petAfter?.Exp || 0)
  };
  const playerExp = Math.max(0, after.playerExp - before.playerExp);
  const petExp = Math.max(0, after.petExp - before.petExp);
  const levelText = [
    after.playerLevel > before.playerLevel ? `人物 Lv.${before.playerLevel}->${after.playerLevel}` : "",
    after.petLevel > before.petLevel ? `${petAfter?.Name || activePet.Name} Lv.${before.petLevel}->${after.petLevel}` : ""
  ].filter(Boolean).join("，");
  const summary = lastOutcome?.result === "victory"
    ? `这轮代练按战斗结算完成：人物获得 ${playerExp} 经验，${petAfter?.Name || activePet.Name} 获得 ${petExp} 经验。`
    : `我帮你按战斗规则推进了 ${logs.length ? "几手" : "一手"}，但还没有稳定胜利。人物获得 ${playerExp} 经验，${petAfter?.Name || activePet.Name} 获得 ${petExp} 经验。`;
  addLog(game, `AI 代练：${summary}`);
  return {
    text: `${summary}${levelText ? ` ${levelText}。` : ""}`,
    action: {
      type: "ai-training-battle",
      result: lastOutcome?.result || "none",
      petIndex: activeIndex,
      petName: petAfter?.Name || activePet.Name,
      playerExp,
      petExp,
      playerLevel: after.playerLevel,
      petLevel: after.petLevel,
      source: "AI can help operate battle; EXP/level still comes from Worker battle settlement"
    }
  };
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
  if (!game.encounter && isNpcEnemy(npc) && (isNpcAiMode(game, npc) || isAiRequest(lower)) && isAiRequest(lower)) return aiNpcReply(env, request, game, npc, text);
  if (isNpcEnemy(npc)) return npcEnemyReply(env, request, game, npc, lower);
  if (isGreeting(lower)) return runNpcTalk(game, npc, "hi");
  if (!game.encounter && (isNpcAiMode(game, npc) || isAiRequest(lower)) && isAiRequest(lower)) return aiNpcReply(env, request, game, npc, text);
  if (isHealerNpc(npc) && hasAny(lower, ["治疗", "恢復", "恢复", "补血", "耐久", "heal", "hp"])) return healerReply(game, npc);
  if (isSavePointNpc(npc) && hasAny(lower, ["记录", "記錄", "纪录", "存档", "保存", "save"])) return savePointReply(game, npc);
  if (npc.trade && hasAny(lower, ["买", "卖", "交易", "商品", "shop", "buy"])) return tradeReply(game, npc);
  if (isWarpNpc(npc) && hasAny(lower, ["传送", "傳送", "进入", "進入", "出发", "出發", "前往", "移动", "warp"])) return warpNpcReply(game, npc);
  if (hasAny(lower, ["任务", "委托", "攻略", "quest"])) return questReply(game, npc, text);
  if (hasAny(lower, ["抓宠", "捕获"]) || (hasAny(lower, ["宠物", "pet"]) && !isStoneAgeKnowledgeQuestion(lower))) return captureReply(env, request, game, npc);
  if (hasAny(lower, ["训练", "练级", "成长", "技能"]) && !isStoneAgeKnowledgeQuestion(lower)) return trainReply(game, npc);
  if (hasAny(lower, ["地图", "出口", "去哪", "travel", "map", "森林", "草原", "村", "坐标", "座标"])) return mapReply(game, npc, text);
  if (isStoneAgeKnowledgeQuestion(lower)) {
    const reply = localStoneAgeKnowledgeReply(buildStoneAgeKnowledgeContext(game, currentMap(game), text, npc), npc.name);
    if (reply) return reply;
  }
  if (isNpcAiMode(game, npc) || isAiRequest(lower)) return aiNpcReply(env, request, game, npc, text);
  if (env.AI && typeof env.AI.run === "function") return aiNpcReply(env, request, game, npc, text);
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
  if (outcome.result === "pet-full") return `${summary}\n先去宠物店或仓库整理宠物栏，再继续捕获。`;
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
  if (!lines.length) return npcDefaultLine(npc);
  ensureFlags(game);
  game.flags.npcTalkCounts ||= {};
  const count = Number(game.flags.npcTalkCounts[npc.id] || 0);
  game.flags.npcTalkCounts[npc.id] = count + 1;
  return lines[count % lines.length];
}

function npcDefaultLine(npc) {
  if (npc.trade?.items?.length) return "欢迎光临。";
  if (isWarpNpc(npc)) return "要出发的话，请告诉我目的地。";
  if (isHealerNpc(npc)) return "需要恢复耐久力吗？";
  if (isSavePointNpc(npc)) return "要记录冒险进度吗？";
  if (isNpcEnemy(npc)) return npcEnemyAskMessage(npc);
  return "有什么事吗？";
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
    addPlayerExp(game, expReward);
    maybeLevelPlayer(game);
    game.player.stone += stoneReward;
    syncStoneItem(game);
    setEventFlag(game, eventFlagForQuest(questId), "end");
  }
  addLog(game, `完成任务「${quest.title}」，获得奖励。`);
}

function questReply(game, npc, text = "") {
  const questIds = npcQuestIds(npc);
  recordNpcVmEvent(game, npc, "quest", questIds.length ? "ok" : "unsupported", { questIds, query: true });
  if (isSpecificStoneAgeKnowledgeQuestion(text) || (!questIds.length && isStoneAgeKnowledgeQuestion(text))) {
    const reply = localStoneAgeKnowledgeReply(buildStoneAgeKnowledgeContext(game, currentMap(game), text, npc), npc.name);
    if (reply) return reply;
  }
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
  if (!wildEncounterAllowed(map, game)) {
    runNpcVmAction(game, npc, {
      type: "startBattle",
      reason: encounterSourceDataAvailable(map) ? "safe-or-gated-map" : "no-encounter-data",
      mapId: map.id,
      mapName: map.name
    });
    return `${npc.name} 查看了当前地图资料：${wildEncounterBlockedText(map, game)}`;
  }
  const encounter = await createEncounterParty(env, request, game, map);
  const enemy = encounter.enemies[0];
  if (!enemy) return `${npc.name} 找不到可用的遇敌资料。`;
  const event = runNpcVmAction(game, npc, {
    type: "startBattle",
    enemy,
    enemies: encounter.enemies,
    reason: "npc-capture",
    mapId: map.id,
    mapName: map.name,
    source: encounter.source
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

function mapReply(game, npc, text = "") {
  const map = currentMap(game);
  const exits = map.exits.map((exit) => exit.label).join("、") || "暂无出口";
  recordNpcVmEvent(game, npc, "say", "ok", { topic: "map", mapId: map.id });
  const knowledge = buildStoneAgeKnowledgeContext(game, map, text, npc).entries
    .filter((entry) => ["map", "village", "world"].includes(entry.category))
    .slice(0, 2);
  const tip = knowledge.length
    ? `\n资料库提示：${knowledge.map((entry) => `${entry.title}：${entry.facts?.[0] || entry.summary || ""}`).join("；")}`
    : "";
  return `当前地图是${map.name}。出口：${exits}。${tip}`;
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
  return npcDialogueLines(npc)[0] || npcDefaultLine(npc);
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

async function aiNpcReply(env, request, game, npc, text) {
  const action = inferNpcAiAction(game, npc, text);
  if (action) return applyNpcAiAction(game, npc, action);

  const map = currentMap(game);
  const debug = npcDebugInfo(npc, game);
  const scriptReferences = await npcScriptReferenceContext(env, request, game, npc, text);
  const referenceReply = npcReferenceQuestionReply(game, npc, text, scriptReferences);
  if (referenceReply) {
    recordNpcVmEvent(game, npc, "say", "ok", { reason: "npc-reference-context", ids: scriptReferences.queryIds });
    return referenceReply;
  }
  const compactScriptReferences = compactNpcScriptReferences(scriptReferences);
  const knowledge = buildStoneAgeKnowledgeContext(game, map, text, npc);
  if (hasOpenAi(env)) {
    try {
      const rsp = await callOpenAiNpc(env, game, npc, text, map, debug, compactScriptReferences);
      const proposed = openAiNpcAction(game, npc, rsp.decision, text);
      if (proposed) return openAiNpcActionReply(game, npc, proposed, rsp.decision);
      if (rsp.decision?.reply) {
        recordNpcVmEvent(game, npc, "say", "ok", { reason: "openai-npc", model: rsp.model, intent: rsp.decision.intent });
        return rsp.decision.reply;
      }
    } catch (error) {
      recordNpcVmEvent(game, npc, "say", "blocked", { reason: "openai-npc-error", error: error?.message || "OpenAI failed" });
    }
  }
  const messages = [
    { role: "system", content: "你是石器时代单人 PWA 里的 NPC。必须保持当前 NPC 的身份、职业和原 gmsv 脚本线索，只根据 JSON 回答。knowledge 是从 17173 专区压缩出的相关条目，只能用来补充专业背景，不能把索引编成完整流程。workspace.memory 是 Worker 保存的受限记忆，只能当线索。中文，1-2 句。你可以商量信息、优惠或帮助，但不能直接执行状态变化；所有交易、传送、奖励、flag、避敌效果和战斗都必须由 Worker 的确定性 NPC VM 校验执行。不要编造与你身份不符的物品、地点或任务。" },
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
        scriptHints: compactNpcHints(npc),
        scriptReferences: compactScriptReferences,
        trade: npc.trade ? { items: npc.trade.items?.slice(0, 8).map((item) => item.name) || [], source: npc.trade.source } : null,
        warp: npc.warp || null
      },
      vm: { allowedActions: debug.allowedActions, recentTrace: compactNpcVmTrace(debug) },
      player: game.player,
      map: {
        id: map.id,
        name: map.name,
        position: [game.location.x, game.location.y],
        exits: map.exits.map((exit) => ({ label: exit.label, to: exit.to, targetMapName: WORLD.maps[exit.to]?.name || "", distance: distanceToExit(exit, game.location.x, game.location.y) })).slice(0, 12),
        nearbyNpcs: nearbyState(game, map).npcs
      },
      knowledge,
      workspace: compactAiWorkspaceMemory(game),
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

async function callOpenAiNpc(env, game, npc, text, map, debug, scriptReferences) {
  const role = npcActionProfile(npc);
  const context = {
    npc: {
      id: npc.id,
      name: npc.name,
      type: npc.type,
      dialogue: npc.dialogue,
      source: npc.source,
      script: npc.script,
      template: npc.template,
      actions: debug.actions,
      allowedActions: debug.allowedActions,
      questIds: npcQuestIds(npc),
      questLead: npc.questLead || null,
      scriptHints: compactNpcHints(npc),
      scriptReferences,
      trade: npc.trade ? {
        items: npc.trade.items?.slice(0, 12).map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.price || item.cost || 0,
          source: item.source
        })) || [],
        source: npc.trade.source
      } : null,
      warp: npc.warp || null,
      roleProfile: role,
      canDirectlyMutate: false
    },
    player: game.player,
    location: {
      mapId: map.id,
      floorId: map.floorId,
      name: map.name,
      position: [game.location.x, game.location.y],
      canWildEncounter: map.canWildEncounter,
      wildEncounterReason: map.wildEncounterReason
    },
    map: {
      exits: map.exits.map((exit) => ({
        label: exit.label,
        to: exit.to,
        targetMapName: WORLD.maps[exit.to]?.name || "",
        distance: distanceToExit(exit, game.location.x, game.location.y)
      })).slice(0, 12),
      nearbyNpcs: nearbyState(game, map).npcs
    },
    quests: game.quests,
    pets: game.pets.map(petSummary),
    inventory: inventoryState(game),
    effects: guideEffectSummary(game),
    knowledge: buildStoneAgeKnowledgeContext(game, map, text, npc),
    workspace: compactAiWorkspaceMemory(game),
    recentConversation: npcOpenAiHistory(game, npc),
    vmTrace: compactNpcVmTrace(debug),
    userText: text
  };
  const system = [
    "你正在扮演石器时代单人网页版里的当前 NPC，不是旁白，也不是万能 GM。",
    "必须保持 NPC 的姓名、职业、地图、脚本来源和行为范围；只能根据 JSON 上下文说话。",
    "NPC 可以解释任务、地图、交易、传送和战斗线索；可以提出优待或交涉意图，但不能直接改状态。",
    "knowledge 是从 17173 石器时代专区压缩检索出的相关条目；只引用和玩家问题、当前地图或当前 NPC 相关的条目，不要把索引扩写成不存在的完整攻略。",
    "workspace.memory 是 Worker 保存的受限记忆，只能当线索；和当前状态冲突时以当前地图、背包、任务、flag 为准。",
    "所有交易、传送、奖励、flag、避敌、开战、折扣和赠品都必须交给 Worker 的 NPC VM 校验执行。",
    "只允许提出 action.type 中列出的动作；如果动作不符合 NPC 身份，type 必须是 none 或 teleportInfo，并在 reply 里自然拒绝。",
    "商店只能围绕自己的商品类别和 gmsv/itemset 资料谈额外物品；守门/敌人 NPC 可被贿赂、威胁或说服，但是否通过由 VM 决定。",
    "脚本里出现数字 id 时，必须先查看 scriptReferences，把它解释成道具、宠物、敌人或地图名；不要把裸编号当成最终答案。解析不到时要说资料里暂时找不到，不能假装知道。",
    "中文，1-3 句，像 NPC 在游戏里说话；不要输出调试字段。"
  ].join("\n");
  const { json: decision, model } = await callOpenAiStructured(env, {
    name: "stoneage_npc_reply",
    schema: OPENAI_NPC_SCHEMA,
    system,
    user: JSON.stringify(context),
    maxOutputTokens: 650
  });
  return { decision, model };
}

async function npcScriptReferenceContext(env, request, game, npc, text) {
  const extracted = extractNpcReferenceIds(npc, text);
  const ids = [...extracted.keys()].slice(0, 18);
  const empty = {
    queryIds: [],
    ids: [],
    resolved: [],
    unresolved: [],
    byId: {},
    hintLines: npc.scriptHints?.hints?.slice(0, 8) || []
  };
  if (!ids.length) return empty;
  let data = null;
  try {
    data = await loadGameData(env, request);
  } catch {
    data = null;
  }
  const tradeIndex = worldTradeItemIndex();
  const resolved = [];
  const unresolved = [];
  const byId = {};
  for (const key of ids) {
    const usage = extracted.get(key);
    const id = Number(key);
    const matches = resolveNpcReferenceId(id, usage, data, game, tradeIndex);
    const preferred = pickPreferredReference(matches, usage);
    const entry = {
      id,
      fromUser: Boolean(usage.fromUser),
      uses: [...usage.uses],
      useLabels: referenceUseLabels(usage.uses),
      hintLines: usage.hintLines.slice(0, 4),
      preferred,
      matches: matches.slice(0, 6)
    };
    byId[key] = entry;
    if (preferred) resolved.push(entry);
    else unresolved.push({ id, fromUser: Boolean(usage.fromUser), uses: [...usage.uses], hintLines: usage.hintLines.slice(0, 4) });
  }
  return {
    queryIds: ids.filter((id) => extracted.get(id)?.fromUser).map(Number),
    ids: ids.map(Number),
    resolved,
    unresolved,
    byId,
    hintLines: empty.hintLines
  };
}

function extractNpcReferenceIds(npc, text) {
  const out = new Map();
  const add = (rawId, use, line = "", fromUser = false) => {
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0 || id > 999999) return;
    const key = String(id);
    const entry = out.get(key) || { id, uses: new Set(), hintLines: [], fromUser: false };
    if (use) entry.uses.add(use);
    if (fromUser) entry.fromUser = true;
    if (line && !entry.hintLines.includes(line)) entry.hintLines.push(line);
    out.set(key, entry);
  };
  for (const id of String(text || "").match(/\b\d{2,6}\b/g) || []) add(id, "user-question", "", true);
  const hintLines = [
    ...(npc.scriptHints?.hints || []),
    npc.questLead?.summary || "",
    npc.dialogue || ""
  ].filter(Boolean);
  for (const line of hintLines) {
    let match;
    const rules = [
      { re: /\b(?:GETITEM|GIVEITEM)\s*[:=]\s*(\d{1,6})/gi, use: "give-item" },
      { re: /\b(?:DELITEM|TAKEITEM)\s*[:=]\s*(\d{1,6})/gi, use: "take-item" },
      { re: /\bITEM\s*!=\s*(\d{1,6})/gi, use: "condition-missing-item" },
      { re: /\bITEM\s*=\s*(\d{1,6})/gi, use: "condition-has-item" },
      { re: /\bCHANGEITEM\s*[:=]\s*(\d{1,6})/gi, use: "change-item" },
      { re: /\b(?:ENEMY|ENEMYNO|BATTLE)\s*[:=]\s*(\d{1,6})/gi, use: "enemy-ref" },
      { re: /\bWARP\s*[:=]\s*(\d{1,6})/gi, use: "map-ref" }
    ];
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      while ((match = rule.re.exec(line))) add(match[1], rule.use, line);
    }
  }
  return out;
}

function resolveNpcReferenceId(id, usage, data, game, tradeIndex) {
  const matches = [];
  const item = data?.itemSet?.get(id);
  if (item && item.name) {
    matches.push({
      kind: "item",
      id,
      name: item.name,
      description: item.description,
      cost: item.cost,
      type: item.type,
      image: item.image,
      source: DATA_FILES.items
    });
  }
  const carried = (game.inventory || []).find((entry) => Number(entry.id) === id);
  if (carried) {
    matches.push({
      kind: "inventoryItem",
      id,
      name: carried.name,
      qty: carried.qty || 1,
      description: carried.description || "",
      source: carried.source || "player-inventory"
    });
  }
  const sold = tradeIndex.get(id);
  if (sold) {
    matches.push({
      kind: "shopItem",
      id,
      name: sold.name,
      soldBy: sold.soldBy.slice(0, 4),
      source: "world-trade"
    });
  }
  const enemySpec = data?.enemySpecsById?.get(id);
  if (enemySpec) {
    const base = data.enemyBaseSet.get(enemySpec.tempNo);
    matches.push({
      kind: "enemy",
      id,
      name: base?.Name || `敌人 ${enemySpec.tempNo}`,
      tempNo: enemySpec.tempNo,
      level: `${enemySpec.lvMin}-${enemySpec.lvMax}`,
      count: `${enemySpec.createMin}-${enemySpec.createMax}`,
      source: enemySpec.source
    });
  }
  const petTemplate = data?.enemyBaseSet?.get(id);
  if (petTemplate) {
    matches.push({
      kind: "petTemplate",
      id,
      name: petTemplate.Name,
      image: petTemplate.ImgNo,
      species: petTemplate.Species,
      attributes: {
        earth: petTemplate.EarthAT,
        water: petTemplate.WaterAT,
        fire: petTemplate.FireAT,
        wind: petTemplate.WindAt
      },
      source: DATA_FILES.enemyBase
    });
  }
  const map = WORLD.maps[String(id)];
  if (map) {
    matches.push({
      kind: "map",
      id,
      name: map.name,
      floorId: map.floorId,
      source: "world-data"
    });
  }
  return matches.filter((match) => usableReferenceName(match.name));
}

function pickPreferredReference(matches, usage) {
  if (!matches.length) return null;
  const uses = usage.uses || new Set();
  const wantsItem = ["condition-has-item", "condition-missing-item", "give-item", "take-item", "change-item"].some((use) => uses.has(use));
  const wantsEnemy = uses.has("enemy-ref");
  const wantsMap = uses.has("map-ref");
  const order = wantsItem
    ? ["inventoryItem", "item", "shopItem", "enemy", "petTemplate", "map"]
    : wantsEnemy
      ? ["enemy", "petTemplate", "item", "inventoryItem", "shopItem", "map"]
      : wantsMap
        ? ["map", "item", "enemy", "petTemplate", "inventoryItem", "shopItem"]
        : ["inventoryItem", "item", "shopItem", "enemy", "petTemplate", "map"];
  return [...matches].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))[0] || null;
}

function npcReferenceQuestionReply(game, npc, text, context) {
  const queryIds = context?.queryIds || [];
  if (!queryIds.length) return "";
  if (!/(什么|甚么|甚麼|啥|哪个|哪個|编号|編號|道具|物品|东西|東西|意思|用来|用來|item|id)/i.test(String(text || ""))) return "";
  const entries = queryIds.map((id) => context.byId?.[String(id)]).filter(Boolean);
  if (!entries.length) return "";
  const entry = entries.find((item) => item.preferred) || entries[0];
  if (!entry?.preferred) {
    return `${npc.name}想了想：这个编号我暂时没在道具、宠物、敌人或地图资料里对上。先按任务线索找人问问，别只盯着数字。`;
  }
  const main = entry.preferred;
  const relation = npcReferenceRelationSentence(entry, context);
  const description = main.description ? ` ${main.description}` : "";
  return `${npc.name}想了想：你问的那个东西是${referenceKindLabel(main.kind)}「${main.name}」。${description}${relation ? ` ${relation}` : ""}`.replace(/\s+/g, " ").trim();
}

function npcReferenceRelationSentence(entry, context) {
  const uses = new Set(entry.uses || []);
  const given = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.uses?.includes("give-item") && item.preferred?.kind === "item")
    .map((item) => `「${item.preferred.name}」`);
  const taken = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.uses?.includes("take-item") && item.preferred?.kind === "item")
    .map((item) => `「${item.preferred.name}」`);
  if ((uses.has("condition-has-item") || uses.has("take-item")) && given.length) {
    return `按这段任务，它是要交给我的东西，交给我后会换成${given.join("、")}。`;
  }
  if (uses.has("give-item") && taken.length) {
    return `按这段任务，我会把它给你，用来回应你交来的${taken.join("、")}。`;
  }
  const relatedItems = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.preferred?.kind === "item")
    .slice(0, 3)
    .map((item) => `「${item.preferred.name}」`);
  if ((uses.has("condition-has-item") || uses.has("take-item")) && relatedItems.length) {
    return `按这段任务，它会和${relatedItems.join("、")}一起判断或交换。`;
  }
  if (uses.has("give-item")) return "按这段任务，它是我会交给你的道具。";
  if (uses.has("take-item")) return "按这段任务，它是我会收下的道具。";
  if (uses.has("condition-has-item")) return "按这段任务，我会先看你身上有没有它。";
  if (uses.has("condition-missing-item")) return "按这段任务，我会看你身上是否缺少它来决定下一句。";
  return referenceUseLabels(entry.uses || []).join("，");
}

function compactNpcScriptReferences(context) {
  const resolved = context?.resolved || [];
  const unresolved = context?.unresolved || [];
  return {
    queryIds: (context?.queryIds || []).slice(0, 6),
    refs: resolved.slice(0, 8).map((entry) => ({
      id: entry.id,
      kind: referenceKindLabel(entry.preferred?.kind),
      name: entry.preferred?.name || "",
      use: referenceUseLabels(entry.uses || []).join("；"),
      desc: shortReferenceText(entry.preferred?.description, 70),
      relation: shortReferenceText(npcReferenceRelationSentence(entry, context), 90),
      alt: entry.matches
        .filter((match) => match.kind !== entry.preferred?.kind && usableReferenceName(match.name))
        .slice(0, 2)
        .map((match) => `${referenceKindLabel(match.kind)}:${match.name}`)
    })),
    unresolved: unresolved.slice(0, 4).map((entry) => ({
      id: entry.id,
      use: referenceUseLabels(entry.uses || []).join("；")
    }))
  };
}

function compactNpcHints(npc) {
  if (!npc.scriptHints) return null;
  return {
    actions: (npc.scriptHints.actions || []).slice(0, 6),
    hints: (npc.scriptHints.hints || []).slice(0, 5)
  };
}

function compactNpcVmTrace(debug) {
  return (debug.vmTrace || []).slice(-5).map((event) => ({
    action: event.action,
    status: event.status,
    reason: event.detail?.reason || "",
    effect: event.detail?.effect || "",
    proposedAction: event.detail?.proposedAction || ""
  }));
}

function shortReferenceText(value, max = 80) {
  const text = cleanReferenceText(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function referenceUseLabels(uses) {
  const labels = {
    "user-question": "玩家问到这个编号",
    "condition-has-item": "脚本检查玩家是否持有",
    "condition-missing-item": "脚本检查玩家是否未持有",
    "give-item": "脚本给予",
    "take-item": "脚本收走",
    "change-item": "脚本交换",
    "enemy-ref": "脚本敌人引用",
    "map-ref": "脚本地图/传送引用"
  };
  return [...uses].map((use) => labels[use]).filter(Boolean);
}

function referenceKindLabel(kind) {
  if (kind === "inventoryItem") return "背包道具";
  if (kind === "shopItem") return "商品";
  if (kind === "item") return "道具";
  if (kind === "enemy") return "战斗敌人";
  if (kind === "petTemplate") return "宠物/敌人模板";
  if (kind === "map") return "地图";
  return "资料";
}

let tradeItemIndexCache = null;
function worldTradeItemIndex() {
  if (tradeItemIndexCache) return tradeItemIndexCache;
  const index = new Map();
  for (const map of Object.values(WORLD.maps)) {
    for (const npc of map.npcs || []) {
      for (const item of npc.trade?.items || []) {
        const id = Number(item.id);
        if (!Number.isFinite(id) || id <= 0) continue;
        const entry = index.get(id) || { id, name: item.name, soldBy: [] };
        if (!entry.soldBy.some((shop) => shop.npc === npc.name && shop.map === map.name)) {
          entry.soldBy.push({ npc: npc.name, map: map.name, price: Number(item.price || item.cost || 0) });
        }
        index.set(id, entry);
      }
    }
  }
  tradeItemIndexCache = index;
  return index;
}

function usableReferenceName(value) {
  const text = cleanReferenceText(value);
  return Boolean(text && !/[�]/.test(text));
}

function npcOpenAiHistory(game, npc) {
  if (game.dialog?.npcId !== npc.id) return [];
  return (game.dialog.messages || [])
    .slice(-6)
    .map((message) => ({
      speaker: message.speaker,
      text: String(message.text || "").slice(0, 160)
    }));
}

function openAiNpcAction(game, npc, decision, fallbackText) {
  const action = decision?.action;
  const type = String(action?.type || "none");
  if (type === "none") return null;
  const text = String(action?.text || fallbackText || "");
  if (type === "warp") {
    if (isWarpNpc(npc) || isTransportNpc(npc)) return { type: "warp", text };
    return { type: "teleportInfo", text };
  }
  if (type === "teleportInfo") return { type: "teleportInfo", text };
  if (type === "noEncounter") {
    if (isNpcEnemy(npc)) return { type: "negotiatePass", text };
    if (!npcCanOfferAiFavor(npc)) return null;
    return { type: "noEncounter", seconds: clampInt(action.seconds, 60, 420, aiNoEncounterSeconds(game, npc, text)) };
  }
  if (type === "shopDiscount") {
    if (!npc.trade?.items?.length) return null;
    return {
      type: "shopDiscount",
      percent: clampInt(action.percent, 5, 25, aiShopDiscountPercent(game, npc, text)),
      seconds: 600
    };
  }
  if (type === "offMenuItem") {
    if (!npc.trade?.items?.length) return null;
    return { type: "offMenuItem", text };
  }
  if (type === "negotiatePass") {
    if (!isNpcEnemy(npc)) return null;
    return { type: "negotiatePass", text };
  }
  return null;
}

function openAiNpcActionReply(game, npc, action, decision) {
  const reply = String(decision?.reply || "").trim();
  const applied = applyNpcAiAction(game, npc, action);
  recordNpcVmEvent(game, npc, "say", "ok", { reason: "openai-npc-action", intent: decision?.intent || "", proposedAction: action.type });
  if (!reply || applied.includes(reply)) return applied;
  return `${reply}\n${applied}`;
}

function npcCanOfferAiFavor(npc) {
  return Boolean(
    npc.trade?.items?.length ||
    isHealerNpc(npc) ||
    isSavePointNpc(npc) ||
    isWarpNpc(npc) ||
    isTransportNpc(npc) ||
    npc.questLead ||
    /elder|guard|gate|town|timeman|村|庄|守|长老|少女|姑娘|男人|女人/i.test(`${npc.name} ${npc.type} ${npc.template} ${npc.script}`)
  );
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
    addPlayerExp(game, exp);
    maybeLevelPlayer(game);
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
  const activePet = getActivePet(game);
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

function ensurePetFormation(game) {
  game.petFormation ||= {};
  const count = (game.pets || []).length;
  game.petFormation.activeIndex = count
    ? clampInt(game.petFormation.activeIndex, 0, count - 1, 0)
    : -1;
  game.petFormation.source ||= `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`;
  return game.petFormation;
}

function getActivePetIndex(game) {
  return ensurePetFormation(game).activeIndex;
}

function getActivePet(game) {
  const index = getActivePetIndex(game);
  return index >= 0 ? game.pets[index] || null : null;
}

function exactPetIndex(game, petIndex) {
  const index = Math.trunc(Number(petIndex));
  if (!Number.isFinite(index) || index < 0 || index >= (game.pets || []).length) {
    throw new Error("没有找到这只宠物");
  }
  return index;
}

function isPetSwitchRequest(text) {
  return hasAny(text, [
    "出战宠",
    "出戰寵",
    "换宠",
    "換寵",
    "换一只",
    "換一隻",
    "切换宠",
    "切換寵",
    "上场",
    "上場",
    "出战",
    "出戰",
    "active pet",
    "battle pet"
  ]);
}

function isPetTrainingRequest(text) {
  return hasAny(text, ["练级", "練級", "训练", "訓練", "练宠", "練寵", "升级", "升級", "level", "train"]);
}

function isPetReleaseRequest(text) {
  return hasAny(text, ["放生", "野放", "离队", "離隊", "放走宠", "放走寵", "释放宠", "釋放寵", "release pet"]);
}

function isItemDropRequest(text) {
  return hasAny(text, ["丢弃", "丟棄", "扔掉", "丢掉", "丟掉", "不要这个道具", "整理背包", "清背包", "drop item"]);
}

function isItemUseRequest(text) {
  return hasAny(text, ["使用", "用道具", "用一下", "吃", "喂", "餵", "use item"])
    && !isItemDropRequest(text);
}

function chooseGuideItem(game, prompt) {
  const items = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  if (!items.length) return { reason: "empty-inventory" };
  const indexByNumber = itemIndexFromPrompt(prompt, items.length);
  if (indexByNumber >= 0) return { item: items[indexByNumber], reason: "index" };

  const normalized = guideSearchText(prompt);
  const named = items
    .map((item, index) => ({
      item,
      index,
      name: guideSearchText(item.name || ""),
      id: guideSearchText(`${item.id || ""}`)
    }))
    .filter((entry) => (entry.name && normalized.includes(entry.name)) || (entry.id && normalized.includes(entry.id)))
    .sort((a, b) => b.name.length - a.name.length || a.index - b.index);
  if (named.length) return { item: named[0].item, reason: "name" };

  if (hasAny(String(prompt || "").toLowerCase(), ["第一个", "第一個", "第1个", "第1個", "第1"])) {
    return { item: items[0], reason: "first" };
  }
  return { reason: "ambiguous" };
}

function itemIndexFromPrompt(prompt, itemCount) {
  const text = String(prompt || "");
  const match = text.match(/(?:第\s*)?([1-9])\s*(?:个|個|件|格|号|號|道具)?/);
  if (match) {
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < itemCount) return index;
  }
  const ordinals = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  for (let i = 0; i < Math.min(itemCount, ordinals.length); i += 1) {
    const ordinal = ordinals[i];
    if (text.includes(`第${ordinal}`) || text.includes(`${ordinal}号`) || text.includes(`${ordinal}號`)) return i;
  }
  return -1;
}

function itemDropQtyFromPrompt(prompt, item) {
  if (hasAny(String(prompt || "").toLowerCase(), ["全部", "全丢", "全丟", "all"])) return Number(item.qty || 1);
  const match = String(prompt || "").match(/x\s*(\d+)|(\d+)\s*(?:个|個|件|份)/i);
  const qty = Number(match?.[1] || match?.[2] || 1);
  return Math.max(1, Math.min(Number(item.qty || 1), Math.trunc(qty) || 1));
}

function guideItemChoiceHelp(game) {
  const items = (game.inventory || [])
    .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
    .map((item, index) => `${index + 1}. ${item.name} x${Number(item.qty || 0)}`)
    .join("；");
  if (!items) return "背包里没有可以丢弃的普通道具；石币不占道具格，也不能丢弃。";
  return `我没判断出要丢弃哪个道具。可以说“丢弃第 1 个”“丢弃小的肉”或“丢弃小的肉全部”。当前背包：${items}。`;
}

function chooseGuidePet(game, prompt) {
  const pets = game.pets || [];
  if (!pets.length) return { reason: "no-pets" };
  const indexByNumber = petIndexFromPrompt(prompt, pets.length);
  if (indexByNumber >= 0) return { index: indexByNumber, pet: pets[indexByNumber], reason: "index" };

  const normalized = guideSearchText(prompt);
  const named = pets
    .map((pet, index) => ({
      pet,
      index,
      name: guideSearchText(pet.Name || ""),
      petId: guideSearchText(`${pet.PetId || ""}`),
      noText: guideSearchText(`no${pet.PetId || ""}`)
    }))
    .filter((entry) => (entry.name && normalized.includes(entry.name))
      || (entry.petId && normalized.includes(entry.petId))
      || (entry.noText && normalized.includes(entry.noText)))
    .sort((a, b) => b.name.length - a.name.length || a.index - b.index);
  if (named.length) return { index: named[0].index, pet: named[0].pet, reason: "name" };

  const lower = String(prompt || "").toLowerCase();
  if (hasAny(lower, ["最强", "最強", "攻击最高", "攻擊最高", "攻击力最高", "攻擊力最高"])) {
    return bestGuidePet(pets, (pet) => Number(pet.WorkFixStr || 0), "highest-attack");
  }
  if (hasAny(lower, ["等级最高", "等級最高", "最高等级", "最高等級", "level"])) {
    return bestGuidePet(pets, (pet) => Number(pet.Lv || 0), "highest-level");
  }
  if (hasAny(lower, ["血最多", "耐久最高", "耐久力最高", "hp最高", "hp 最高"])) {
    return bestGuidePet(pets, (pet) => Number(pet.WorkMaxHp || pet.Hp || 0), "highest-hp");
  }
  return { reason: "ambiguous" };
}

function petIndexFromPrompt(prompt, petCount) {
  const text = String(prompt || "");
  const match = text.match(/(?:第\s*)?([1-5])\s*(?:只|隻|个|個|号|號|宠|寵)?/);
  if (match) {
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < petCount) return index;
  }
  const ordinals = ["一", "二", "三", "四", "五"];
  for (let i = 0; i < Math.min(petCount, ordinals.length); i += 1) {
    const ordinal = ordinals[i];
    if (text.includes(`第${ordinal}`) || text.includes(`${ordinal}号`) || text.includes(`${ordinal}號`)) return i;
  }
  return -1;
}

function bestGuidePet(pets, scoreOf, reason) {
  const ranked = pets
    .map((pet, index) => ({ pet, index, score: Number(scoreOf(pet)) || 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked[0] ? { index: ranked[0].index, pet: ranked[0].pet, reason } : { reason: "no-pets" };
}

function guidePetChoiceHelp(game) {
  const pets = (game.pets || []).map((pet, index) => `${index + 1}. ${pet.Name} Lv.${Number(pet.Lv || 1)} 攻${Number(pet.WorkFixStr || 0)}`).join("；");
  if (!pets) return "你现在没有宠物，先通过剧情、捕获或宠物店取得宠物后才能设置出战宠。";
  return `我没判断出要让哪只宠物出战。可以说“让第 2 只出战”“让${game.pets[0]?.Name || "这只宠物"}出战”，也可以说“让攻击最高的宠物出战”。当前宠物：${pets}。`;
}

function petState(game) {
  const formation = ensurePetFormation(game);
  const used = (game.pets || []).length;
  const active = getActivePet(game);
  return {
    used,
    capacity: PET_CAPACITY,
    remaining: Math.max(0, PET_CAPACITY - used),
    activeIndex: formation.activeIndex,
    activeName: active?.Name || "",
    modes: (game.pets || []).map((pet, index) => ({
      index,
      name: pet.Name,
      active: index === formation.activeIndex,
      hp: Number(pet.Hp || 0),
      maxHp: Number(pet.WorkMaxHp || pet.Hp || 0)
    })),
    source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE`
  };
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

function buildGuideContext(game, map, prompt = "") {
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
      nextExp: game.player.nextExp,
      expToNext: game.player.expToNext,
      hp: game.player.hp,
      maxHp: game.player.maxHp,
      stone: game.player.stone,
      dir: game.player.dir,
      counters: game.characterFields?.counters || {},
      attributes: game.characterFields?.attributes || {}
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
    knowledge: buildStoneAgeKnowledgeContext(game, map, prompt),
    workspace: compactAiWorkspaceMemory(game),
    map: { exits, npcs, nearby: nearbyState(game, map) },
    world: guideWorldSummary(game, map),
    pets: game.pets.map(petSummary),
    petState: petState(game),
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

function guideWorldSummary(game, currentMapValue) {
  const currentId = String(currentMapValue?.id || game.location?.mapId || "");
  const maps = Object.values(WORLD.maps || {});
  const notable = maps
    .filter((map) => map.id === currentId || guideNotableMap(map))
    .map((map) => ({
      id: map.id,
      floorId: map.floorId,
      name: map.name,
      kind: guideMapKind(map),
      canWildEncounter: wildEncounterAllowed(map, map.id === currentId ? game : null),
      source: map.summary
    }))
    .sort((a, b) => (
      Number(b.id === currentId) - Number(a.id === currentId)
      || guideMapKindRank(a.kind) - guideMapKindRank(b.kind)
      || String(a.name).localeCompare(String(b.name), "zh-Hans")
    ))
    .slice(0, 24);
  return {
    mapCount: maps.length,
    questLeadCount: maps.reduce((sum, map) => sum + (map.npcs || []).filter((npc) => npc.questLead).length, 0),
    safePolicy: "村镇、店铺、医院、庄园和竞技场按安全区处理；野外、大陆、洞窟按 encount.txt 触发随机遇敌。",
    notableMaps: notable
  };
}

function guideNotableMap(map) {
  const text = `${map?.name || ""} ${map?.summary || ""}`;
  return /村|医院|庄园|竞技场|競技場|斗技场|鬥技場|PK|洞窟|通路|萨姆吉尔|玛丽娜丝|柯奥|加加|卡鲁它那/i.test(text);
}

function guideMapKind(map) {
  const text = `${map?.name || ""} ${map?.summary || ""}`;
  if (/竞技场|競技場|斗技场|鬥技場|PK/i.test(text)) return "arena";
  if (/医院|店|商店|肉店|宠物店|武器店|防具店|便利/i.test(text)) return "service";
  if (/村|庄园/i.test(text)) return "village";
  if (/洞窟|通路|坑道|海底/i.test(text)) return "dungeon";
  if (wildEncounterAllowed(map)) return "field";
  return "map";
}

function guideMapKindRank(kind) {
  return { village: 0, service: 1, arena: 2, dungeon: 3, field: 4, map: 5 }[kind] ?? 9;
}

function buildStoneAgeKnowledgeContext(game, map, text = "", npc = null) {
  const x = Number(game.location?.x || 0);
  const y = Number(game.location?.y || 0);
  const nearbyNames = (map.npcs || [])
    .filter((item) => distance(item.x, item.y, x, y) <= 6)
    .map((item) => `${item.name} ${item.type || ""}`)
    .slice(0, 8);
  const questTitles = Object.values(game.quests || {})
    .map((quest) => `${quest.title || ""} ${quest.status || ""}`)
    .slice(0, 6);
  const exitNames = (map.exits || [])
    .map((exit) => `${exit.label || ""} ${WORLD.maps[exit.to]?.name || ""}`)
    .slice(0, 8);
  const npcParts = npc ? [
    npc.name,
    npc.type,
    npc.template,
    npc.dialogue,
    npc.questLead?.title,
    npc.questLead?.summary,
    (npc.scriptHints?.hints || []).slice(0, 5).join(" ")
  ] : [];
  const query = [
    text,
    map.name,
    map.summary,
    guideMapKind(map),
    exitNames.join(" "),
    nearbyNames.join(" "),
    questTitles.join(" "),
    game.pets?.map((pet) => pet.Name).join(" "),
    game.inventory?.map((item) => item.name).join(" "),
    ...npcParts
  ].filter(Boolean).join(" ");
  return {
    version: STONEAGE_KNOWLEDGE.version,
    source: STONEAGE_KNOWLEDGE.sourceLabel,
    usage: "只把 entries 当作 17173 攻略/设定线索；实际动作仍由当前地图、NPC 脚本、背包和 Worker VM 决定。",
    entries: selectStoneAgeKnowledgeEntries(query, { game, map, npc, prompt: text, limit: 6 })
  };
}

function selectStoneAgeKnowledgeEntries(query, { game = null, map = null, npc = null, prompt = "", limit = 6 } = {}) {
  const normalized = guideSearchText(query).slice(0, 1600);
  const promptNormalized = guideSearchText(prompt);
  const tokens = stoneAgeKnowledgeTokens(promptNormalized ? prompt : `${map?.name || ""} ${npc?.name || ""}`);
  const hints = stoneAgeKnowledgeHints(promptNormalized, map, npc);
  const scored = STONEAGE_KNOWLEDGE.entries
    .map((entry, index) => ({
      entry,
      index,
      score: stoneAgeKnowledgeEntryScore(entry, normalized, promptNormalized, tokens, hints)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [];
  for (const item of scored) {
    if (!selected.some((entry) => entry.id === item.entry.id)) selected.push(item.entry);
    if (selected.length >= limit) break;
  }
  for (const entry of defaultStoneAgeKnowledgeEntries(map, npc, game, promptNormalized)) {
    if (selected.length >= Math.min(limit, 4)) break;
    if (!selected.some((item) => item.id === entry.id)) selected.push(entry);
  }
  return selected.slice(0, limit).map(compactStoneAgeKnowledgeEntry);
}

function stoneAgeKnowledgeTokens(value) {
  const source = String(value || "").slice(0, 240);
  const normalized = guideSearchText(source);
  const tokens = new Set((source.match(/[\u4e00-\u9fff]{2,12}|[a-z0-9]{2,}/gi) || []).map(guideSearchText));
  for (let size = 2; size <= Math.min(4, normalized.length); size += 1) {
    for (let i = 0; i <= normalized.length - size && i < 80; i += 1) tokens.add(normalized.slice(i, i + size));
  }
  return [...tokens].filter((token) => token.length >= 2);
}

function stoneAgeKnowledgeHints(promptNormalized, map, npc) {
  const mapKind = map ? guideMapKind(map) : "";
  return {
    quest: hasAny(promptNormalized, ["任务", "委托", "攻略", "红暴", "四圣石", "成人仪式", "成人礼", "英雄岛", "二转", "六转"]),
    pet: hasAny(promptNormalized, ["宠物技能", "宠物邮件", "骑宠", "忠诚", "三围", "宠物二转", "抓宠", "捕获"]),
    map: hasAny(promptNormalized, ["地图", "坐标", "座标", "村", "洞窟", "北岛", "南岛", "吉鲁", "沙姆", "去哪"]),
    version: hasAny(promptNormalized, ["版本", "精灵的传说", "精灵的召唤", "7.5", "伊甸", "魔界", "追猎者"]),
    combat: hasAny(promptNormalized, ["属性", "相克", "战斗", "遇敌", "攻击", "防御", "敏捷", "地克水", "水克火", "火克风", "风克地"]),
    guide: hasAny(promptNormalized, ["新手", "入门", "开局", "怎么开始", "下一步"]),
    village: mapKind === "village" || mapKind === "service" || hasAny(promptNormalized, ["商店", "购物", "补给", "医院", "肉屋", "宠物店"]),
    npcTrade: Boolean(npc?.trade?.items?.length),
    npcWarp: isWarpNpc(npc || {}),
    npcEnemy: isNpcEnemy(npc || {})
  };
}

function stoneAgeKnowledgeEntryScore(entry, normalized, promptNormalized, tokens, hints) {
  const haystack = guideSearchText([
    entry.id,
    entry.category,
    entry.title,
    entry.summary,
    ...(entry.tags || []),
    ...(entry.facts || []),
    ...(entry.guidance || [])
  ].join(" "));
  let score = 0;
  for (const tag of entry.tags || []) {
    const token = guideSearchText(tag);
    if (!token) continue;
    const generic = stoneAgeGenericKnowledgeTag(token);
    if (promptNormalized.includes(token)) score += (generic ? 8 : 28) + Math.min(generic ? 3 : 10, token.length);
    else if (normalized.includes(token)) score += 3 + Math.min(3, token.length);
  }
  for (const token of tokens) {
    if (haystack.includes(token)) score += Math.min(8, Math.max(2, token.length));
  }
  if (hints.quest && entry.category === "quest") score += 14;
  if (hints.pet && entry.category === "pet") score += 14;
  if (hints.map && entry.category === "map") score += 12;
  if (hints.map && entry.category === "village") score += 8;
  if (hints.version && entry.category === "version") score += 14;
  if (hints.combat && entry.category === "combat") score += 12;
  if (hints.guide && entry.category === "guide") score += 10;
  if (hints.village && entry.category === "village") score += 10;
  if (hints.npcTrade && entry.category === "village") score += 4;
  if (hints.npcWarp && entry.category === "map") score += 4;
  if (hints.npcEnemy && entry.category === "combat") score += 4;
  if (entry.category === "system" && hasAny(promptNormalized, ["能干嘛", "能做什么", "ai", "npc", "脚本", "gm"])) score += 10;
  return score;
}

function stoneAgeGenericKnowledgeTag(token) {
  return ["任务", "攻略", "任务攻略", "地图", "宠物", "版本", "新手", "入门", "村", "商店", "坐标", "座标"].includes(token);
}

function defaultStoneAgeKnowledgeEntries(map, npc, game, promptNormalized) {
  const ids = ["ai-role-boundaries"];
  const kind = map ? guideMapKind(map) : "";
  if (!promptNormalized || hasAny(promptNormalized, ["下一步", "干嘛", "做什么", "新手", "入门"])) ids.push("beginner-first-steps");
  if (kind === "village" || kind === "service") ids.push("village-shopping-index");
  if (kind === "field" || kind === "dungeon") ids.push("battle-basics", "map-index");
  if (npc?.trade?.items?.length) ids.push("village-shopping-index");
  if (game?.pets?.length) ids.push("pet-system-basics");
  ids.push("map-index");
  const byId = new Map(STONEAGE_KNOWLEDGE.entries.map((entry) => [entry.id, entry]));
  return [...new Set(ids)].map((id) => byId.get(id)).filter(Boolean);
}

function compactStoneAgeKnowledgeEntry(entry) {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    summary: entry.summary,
    facts: (entry.facts || []).slice(0, 4),
    guidance: (entry.guidance || []).slice(0, 2),
    source: entry.sourceLabel || entry.source
  };
}

function localStoneAgeKnowledgeReply(knowledge, speaker = "AI向导") {
  const rawEntries = (knowledge?.entries || []).filter((entry) => entry.category !== "system");
  const primary = rawEntries[0]?.category || "";
  const entries = rawEntries
    .filter((entry) => stoneAgeRelatedKnowledgeCategory(primary, entry.category))
    .slice(0, 3);
  if (!entries.length) return "";
  const lines = entries.map((entry, index) => {
    const fact = entry.facts?.[0] || entry.summary || "";
    const guidance = entry.guidance?.[0] || "";
    return `${index + 1}. ${entry.title}：${fact}${guidance ? ` ${guidance}` : ""}`;
  });
  return [
    `${speaker}按 17173 资料库能对上这些线索：`,
    ...lines,
    "我会把这些当攻略背景；真正能不能交任务、传送、给奖励或开战，仍看当前 NPC 脚本、背包、flag 和 Worker VM。"
  ].join("\n");
}

function stoneAgeRelatedKnowledgeCategory(primary, category) {
  if (!primary || primary === category) return true;
  const related = {
    quest: ["quest"],
    pet: ["pet", "combat"],
    combat: ["combat", "pet"],
    map: ["map", "village", "world"],
    village: ["village", "map", "world"],
    world: ["world", "map", "village"],
    version: ["version", "quest"],
    guide: ["guide", "pet", "combat", "map"]
  };
  return (related[primary] || [primary]).includes(category);
}

function isStoneAgeKnowledgeQuestion(text) {
  const value = guideSearchText(text);
  return hasAny(value, [
    "17173",
    "攻略",
    "版本",
    "新手",
    "入门",
    "坐标",
    "座标",
    "属性相克",
    "地克水",
    "水克火",
    "火克风",
    "风克地",
    "宠物技能",
    "宠物邮件",
    "骑宠",
    "忠诚",
    "三围",
    "红暴",
    "四圣石",
    "四宝玉",
    "英雄岛",
    "成人仪式",
    "成人礼",
    "委托店",
    "宠物二转",
    "六转",
    "精灵的召唤",
    "精灵的传说",
    "尼斯大陆",
    "村庄购物"
  ]);
}

function isSpecificStoneAgeKnowledgeQuestion(text) {
  const value = guideSearchText(text);
  return isStoneAgeKnowledgeQuestion(value) && !["任务", "委托", "quest"].includes(value);
}

function createAiWorkspace(now = new Date().toISOString()) {
  return {
    schema: AI_WORKSPACE_SCHEMA,
    scope: "save-local",
    createdAt: now,
    updatedAt: now,
    memories: []
  };
}

function normalizeAiWorkspace(workspace = null) {
  const now = new Date().toISOString();
  const out = {
    ...createAiWorkspace(now),
    ...(workspace && typeof workspace === "object" ? workspace : {})
  };
  out.schema = AI_WORKSPACE_SCHEMA;
  out.scope = out.scope || "save-local";
  out.createdAt ||= now;
  out.updatedAt ||= out.createdAt;
  out.memories = Array.isArray(out.memories)
    ? out.memories.map(normalizeAiWorkspaceMemory).filter(Boolean).slice(0, AI_WORKSPACE_MAX_MEMORIES)
    : [];
  return out;
}

function normalizeAiWorkspaceMemory(entry) {
  if (!entry || typeof entry !== "object") return null;
  const text = String(entry.text || "").trim().slice(0, 360);
  const title = String(entry.title || "").trim().slice(0, 60);
  if (!text && !title) return null;
  const now = new Date().toISOString();
  return {
    id: String(entry.id || `mem-${stableFlag(`${title}:${text}:${entry.createdAt || now}`).toString(36)}`),
    kind: aiWorkspaceKind(entry.kind),
    title: title || aiWorkspaceKind(entry.kind),
    text,
    tags: Array.isArray(entry.tags) ? entry.tags.map((tag) => String(tag).trim().slice(0, 24)).filter(Boolean).slice(0, 8) : [],
    source: String(entry.source || "ai-workspace").trim().slice(0, 80),
    confidence: clampNumber(entry.confidence, 0, 1, 0.6),
    createdAt: String(entry.createdAt || now),
    updatedAt: String(entry.updatedAt || entry.createdAt || now)
  };
}

function writeAiWorkspaceNote(game, note = {}) {
  const workspace = normalizeAiWorkspace(game.aiWorkspace);
  const now = new Date().toISOString();
  const title = String(note.title || note.key || "").trim().slice(0, 60);
  const text = String(note.text || note.body || note.value || "").trim().slice(0, 360);
  if (!title && !text) throw new Error("AI workspace note 需要 title 或 text");
  const entry = normalizeAiWorkspaceMemory({
    id: crypto.randomUUID(),
    kind: note.kind,
    title: title || aiWorkspaceKind(note.kind),
    text,
    tags: Array.isArray(note.tags) ? note.tags : String(note.tags || "").split(/[,\s，、]+/),
    source: note.source || "api:/api/ai/workspace-note",
    confidence: note.confidence,
    createdAt: now,
    updatedAt: now
  });
  workspace.memories = [
    entry,
    ...workspace.memories.filter((item) => item.id !== entry.id)
  ].slice(0, AI_WORKSPACE_MAX_MEMORIES);
  workspace.updatedAt = now;
  game.aiWorkspace = workspace;
  game.character ||= {};
  game.character.updatedAt = now;
  addLog(game, `AI workspace 记录：${entry.title}`);
  return entry;
}

function buildAiWorkspace(env, game, prompt = "") {
  const map = currentMap(game);
  const nearby = nearbyState(game, map);
  return {
    schema: AI_WORKSPACE_SCHEMA,
    scope: "per-save workspace; 可迁移到 D1/KV/R2，但当前先随存档走",
    runtime: aiRuntimeStatus(env),
    writePolicy: {
      mode: "worker-validated-notes",
      endpoint: "POST /api/ai/workspace-note",
      allowedKinds: ["observation", "questLead", "playerPreference", "todo", "routeHint", "npcMemory"],
      maxMemories: AI_WORKSPACE_MAX_MEMORIES,
      rule: "AI 只能写入受限 note，不能直接写背包、任务、flag、石币、传送或战斗结果。"
    },
    current: {
      player: {
        name: game.player.name,
        level: game.player.level,
        hp: `${game.player.hp}/${game.player.maxHp}`,
        stone: game.player.stone
      },
      location: {
        mapId: map.id,
        floorId: map.floorId,
        name: map.name,
        position: [game.location.x, game.location.y],
        canWildEncounter: map.canWildEncounter,
        wildEncounterReason: map.wildEncounterReason
      },
      nearby,
      activePet: getActivePet(game) ? petSummary(getActivePet(game)) : null,
      inventory: inventoryState(game),
      petState: petState(game),
      effects: guideEffectSummary(game)
    },
    actionSurface: {
      guideCanMutate: ["heal", "item-use", "item-drop", "pet-switch", "pet-release", "ai-training-battle", "encounter", "teleport", "noEncounter"],
      npcVmActions: [...NPC_VM_ACTIONS],
      authority: "worker-npc-vm"
    },
    knowledge: buildStoneAgeKnowledgeContext(game, map, prompt),
    memory: compactAiWorkspaceMemory(game),
    sources: STONEAGE_KNOWLEDGE.sources
  };
}

function compactAiWorkspaceMemory(game) {
  const workspace = normalizeAiWorkspace(game.aiWorkspace);
  return {
    schema: workspace.schema,
    scope: workspace.scope,
    updatedAt: workspace.updatedAt,
    count: workspace.memories.length,
    memories: workspace.memories.slice(0, 12).map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      text: entry.text,
      tags: entry.tags,
      source: entry.source,
      confidence: entry.confidence,
      updatedAt: entry.updatedAt
    }))
  };
}

function aiWorkspaceKind(kind) {
  const value = guideSearchText(kind || "observation");
  const allowed = {
    observation: "observation",
    questlead: "questLead",
    playerpreference: "playerPreference",
    todo: "todo",
    routehint: "routeHint",
    npcmemory: "npcMemory"
  };
  return allowed[value] || "observation";
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
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
  if (isStoneAgeKnowledgeQuestion(lower)) {
    const reply = localStoneAgeKnowledgeReply(context.knowledge, "AI向导");
    if (reply) return `${aiNote}${reply}`;
  }
  if (hasAny(lower, ["任务", "quest"])) {
    if (reportable) return `${aiNote}你现在在${context.location.name}。「${reportable.title}」可以回报了，回到对应 NPC 双击/hi 结算。附近 NPC：${nearbyNpc || "无"}。`;
    if (active) return `${aiNote}你现在在${context.location.name}。继续「${active.title}」：${active.steps[Math.min(active.progress || 0, active.steps.length - 1)]}。出口：${exits}。`;
    return `${aiNote}你现在在${context.location.name}。当前可接任务有：${context.availableQuests.map((quest) => quest.title).join("、")}。先找带 quest 动作的 NPC，通常是老师或剧情 NPC。`;
  }
  if (hasAny(lower, ["地图", "出口", "去哪", "去哪里", "传送", "瞬移"])) {
    const notable = (context.world?.notableMaps || [])
      .filter((map) => map.id !== context.location.mapId)
      .slice(0, 8)
      .map((map) => `${map.name}(floor ${map.floorId})`)
      .join("、");
    return `${aiNote}你在${context.location.name} (${context.location.position.join(",")})。可走出口：${exits}。Worker 已打包 ${context.world?.mapCount || "多张"} 张地图；可尝试的目标有：${notable || "当前出口目标"}。需要瞬移时可以说“带我去 地图名/floor”。`;
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

function normalizePlayerRuntime(player) {
  player.level = clampInt(player.level ?? player.Lv, 1, CHAR_MAXUPLEVEL, 1);
  player.exp = clampInt(player.exp ?? player.Exp, 0, CHAR_MAX_EXP, 0);
  player.Vital = clampInt(player.Vital, 1, 999999, 1600);
  player.Str = clampInt(player.Str, 1, 999999, 1200);
  player.Tough = clampInt(player.Tough, 1, 999999, 1200);
  player.Dex = clampInt(player.Dex, 1, 999999, 1000);
  player.EarthAT = clampInt(player.EarthAT, 0, 100, 0);
  player.WaterAT = clampInt(player.WaterAT, 0, 100, 0);
  player.FireAT = clampInt(player.FireAT, 0, 100, 0);
  player.WindAT = clampInt(player.WindAT, 0, 100, 0);
  player.duelPoint = clampInt(player.duelPoint ?? player.DuelPoint, 0, 999999999, 0);
  player.skillUpPoint = clampInt(player.skillUpPoint ?? player.SkillUpPoint, 0, 999999999, 0);
  player.killPetCount = clampInt(player.killPetCount ?? player.KillPetCount, 0, 999999999, 0);
  player.deadCount = clampInt(player.deadCount ?? player.DeadCount, 0, 999999999, 0);
  player.battleCount = clampInt(player.battleCount, 0, 999999999, 0);
  player.winCount = clampInt(player.winCount, 0, 999999999, 0);
  player.loseCount = clampInt(player.loseCount, 0, 999999999, 0);
  compliancePlayerParameter(player, { preserveHp: true });
  const progress = progressionSummary(player.level, player.exp);
  player.currentLevelExp = progress.currentLevelExp;
  player.nextExp = progress.nextExp;
  player.expToNext = progress.expToNext;
  player.expProgressPct = progress.progressPct;
}

function compliancePlayerParameter(player, options = {}) {
  const previousHp = Number(player.hp ?? player.Hp ?? player.maxHp ?? 1);
  player.WorkFixDex = Math.max(1, Math.trunc(Number(player.Dex || 0) / 100));
  player.WorkFixVital = Math.max(1, Math.trunc(Number(player.Vital || 0) / 100));
  player.WorkFixStr = Math.max(1, Math.trunc((Number(player.Str || 0) + Number(player.Tough || 0) * 0.1 + Number(player.Vital || 0) * 0.1 + Number(player.Dex || 0) * 0.05) / 100));
  player.WorkFixTough = Math.max(1, Math.trunc((Number(player.Tough || 0) + Number(player.Str || 0) * 0.1 + Number(player.Vital || 0) * 0.1 + Number(player.Dex || 0) * 0.05) / 100));
  player.WorkMaxHp = Math.max(1, Math.trunc((Number(player.Vital || 0) * 4 + Number(player.Str || 0) + Number(player.Tough || 0) + Number(player.Dex || 0)) / 100));
  player.maxHp = player.WorkMaxHp;
  player.hp = options.preserveHp
    ? clampInt(previousHp, 0, player.maxHp, player.maxHp)
    : player.maxHp;
}

function normalizePetRuntime(pet) {
  pet.Lv = clampInt(pet.Lv ?? pet.level, 1, CHAR_MAXUPLEVEL, 1);
  pet.Exp = clampInt(pet.Exp ?? pet.exp, 0, CHAR_MAX_EXP, levelExp(pet.Lv));
  pet.LimitLevel = petLimitLevel(pet);
  pet.EarthAT = clampInt(pet.EarthAT ?? pet.Earth, 0, 100, 0);
  pet.WaterAT = clampInt(pet.WaterAT ?? pet.Water, 0, 100, 0);
  pet.FireAT = clampInt(pet.FireAT ?? pet.Fire, 0, 100, 0);
  pet.WindAT = clampInt(pet.WindAT ?? pet.WindAt ?? pet.Wind, 0, 100, 0);
  pet.KillPetCount = clampInt(pet.KillPetCount, 0, 999999999, 0);
  pet.DeadCount = clampInt(pet.DeadCount, 0, 999999999, 0);
  pet.BattleCount = clampInt(pet.BattleCount, 0, 999999999, 0);
  pet.WinCount = clampInt(pet.WinCount, 0, 999999999, 0);
  pet.LoseCount = clampInt(pet.LoseCount, 0, 999999999, 0);
  if (!Number.isFinite(Number(pet.WorkMaxHp)) || Number(pet.WorkMaxHp) <= 0) {
    complianceParameter(pet, { preserveHp: true });
  } else {
    pet.Hp = clampInt(pet.Hp, 0, Math.max(1, Number(pet.WorkMaxHp)), Number(pet.WorkMaxHp));
  }
  const progress = progressionSummary(pet.Lv, pet.Exp);
  pet.CurrentLevelExp = progress.currentLevelExp;
  pet.NextExp = progress.nextExp;
  pet.ExpToNext = progress.expToNext;
  pet.ExpProgressPct = progress.progressPct;
}

function normalizeProgressionRuntime(game) {
  normalizePlayerRuntime(game.player);
  game.pets = (game.pets || []).map((pet) => {
    normalizePetRuntime(pet);
    return pet;
  });
  syncCharacterFields(game);
}

function syncCharacterFields(game) {
  game.characterFields ||= {};
  game.characterFields.source = "gmsv CHAR_* counters/field-style runtime subset";
  game.characterFields.counters = {
    killPetCount: Number(game.player?.killPetCount || 0),
    deadCount: Number(game.player?.deadCount || 0),
    battleCount: Number(game.player?.battleCount || 0),
    winCount: Number(game.player?.winCount || 0),
    loseCount: Number(game.player?.loseCount || 0),
    duelPoint: Number(game.player?.duelPoint || 0),
    skillUpPoint: Number(game.player?.skillUpPoint || 0)
  };
  game.characterFields.attributes = {
    Vital: Number(game.player?.Vital || 0),
    Str: Number(game.player?.Str || 0),
    Tough: Number(game.player?.Tough || 0),
    Dex: Number(game.player?.Dex || 0),
    EarthAT: Number(game.player?.EarthAT || 0),
    WaterAT: Number(game.player?.WaterAT || 0),
    FireAT: Number(game.player?.FireAT || 0),
    WindAT: Number(game.player?.WindAT || 0),
    WorkFixStr: Number(game.player?.WorkFixStr || 0),
    WorkFixTough: Number(game.player?.WorkFixTough || 0),
    WorkFixDex: Number(game.player?.WorkFixDex || 0)
  };
}

function progressionState(game) {
  return {
    source: "gmsv char_data.c LevelUpTbl + battle.c EXP distribution",
    player: progressionSummary(game.player?.level, game.player?.exp),
    pets: (game.pets || []).map((pet) => ({
      ...progressionSummary(pet.Lv, pet.Exp),
      name: pet.Name,
      petId: pet.PetId,
      limitLevel: petLimitLevel(pet)
    }))
  };
}

function normalizeGame(game) {
  if (!game || !game.player || !game.location) throw new Error("需要先创建人物");
  ensureSaveIdentity(game);
  setCharacterDir(game, game.player?.dir ?? game.location?.dir);
  game.pets ||= [];
  ensurePetFormation(game);
  normalizeProgressionRuntime(game);
  game.inventory ||= [];
  game.quests ||= {};
  ensureFlags(game);
  game.effects ||= {};
  game.aiWorkspace = normalizeAiWorkspace(game.aiWorkspace);
  game.dialogAi ||= {};
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.savePoint ||= null;
  game.lastWarp ||= null;
  game.dialog ||= null;
  if (game.dialog?.messages) game.dialog.messages = game.dialog.messages.map((message) => (
    message?.speaker === "npc" && /^脚本入口：/.test(String(message.text || ""))
      ? { ...message, text: "有什么事吗？" }
      : message
  ));
  game.battle ||= null;
  game.npcVmEvents ||= [];
  game.log ||= [];
  game.log = game.log.map(sanitizePlayerFacingText).slice(-40);
  game.character.name = game.player.name;
  game.character.updatedAt = new Date().toISOString();
  game.save = buildSaacSave(game);
  return game;
}

function sanitizePlayerFacingText(text) {
  return String(text || "").replace(/脚本入口：[^。\n]*/g, "有什么事吗？");
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
    petFormation: { ...ensurePetFormation(game) },
    petState: petState(game),
    progression: progressionState(game),
    characterFields: { ...(game.characterFields || {}) },
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
    aiWorkspace: normalizeAiWorkspace(game.aiWorkspace),
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
    `NEXTEXP=${game.player.nextExp}`,
    `EXP_TO_NEXT=${game.player.expToNext}`,
    `STONE=${game.player.stone}`,
    `HP=${game.player.hp}`,
    `MAXHP=${game.player.maxHp}`,
    `VITAL=${game.player.Vital}`,
    `STR=${game.player.Str}`,
    `TOUGH=${game.player.Tough}`,
    `DEX=${game.player.Dex}`,
    `EARTH=${game.player.EarthAT}`,
    `WATER=${game.player.WaterAT}`,
    `FIRE=${game.player.FireAT}`,
    `WIND=${game.player.WindAT}`,
    `WORKMAXHP=${game.player.WorkMaxHp}`,
    `WORKFIXSTR=${game.player.WorkFixStr}`,
    `WORKFIXTOUGH=${game.player.WorkFixTough}`,
    `WORKFIXDEX=${game.player.WorkFixDex}`,
    `DUELPOINT=${game.player.duelPoint}`,
    `SKILLUPPOINT=${game.player.skillUpPoint}`,
    `KILLPETCOUNT=${game.player.killPetCount}`,
    `DEADCOUNT=${game.player.deadCount}`,
    `BATTLECOUNT=${game.player.battleCount}`,
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
    `AI_WORKSPACE=${safeJson(compactAiWorkspaceMemory(game))}`,
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
    level: pet.Lv,
    hp: pet.Hp,
    maxHp: pet.WorkMaxHp,
    exp: pet.Exp,
    nextExp: pet.NextExp,
    expToNext: pet.ExpToNext,
    killPetCount: pet.KillPetCount,
    deadCount: pet.DeadCount,
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
    petState: petState(game),
    progression: progressionState(game),
    world: {
      map,
      quests: WORLD.quests,
      mapCount: Object.keys(WORLD.maps || {}).length,
      questLeadCount: Object.values(WORLD.maps || {})
        .reduce((sum, item) => sum + (item.npcs || []).filter((npc) => npc.questLead).length, 0)
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
  return withWildEncounterPolicy(visible, game);
}

function withWildEncounterPolicy(map, game = null) {
  const canWildEncounter = wildEncounterAllowed(map, game);
  return {
    ...map,
    canWildEncounter,
    wildEncounterReason: canWildEncounter
      ? "encount.txt wild encounter enabled"
      : wildEncounterBlockedText(map, game)
  };
}

function wildEncounterAllowed(map, game = null) {
  return encounterDataAvailable(map, game) && !isSafeWildEncounterMap(map);
}

function encounterSourceDataAvailable(map) {
  return Boolean(map?.encounterAreas?.some((area) => area.groups?.some((group) => group.enemies?.length)))
    || Boolean(map?.encounterPets?.length);
}

function encounterDataAvailable(map, game = null) {
  if (!encounterSourceDataAvailable(map)) return false;
  if (!game) return true;
  const sourceAreas = (map?.encounterAreas || []).filter((area) => area.groups?.some((group) => group.enemies?.length));
  if (!sourceAreas.length) return Boolean(map?.encounterPets?.length);
  const area = chooseEncounterArea(map, game.location);
  return Boolean(area?.groups?.some((group) => group.enemies?.length && encounterGroupCanAppear(game, group)));
}

function isSafeWildEncounterMap(map) {
  const name = String(map?.name || "").replace(/[|�]/g, "");
  if (SAFE_WILD_ENCOUNTER_MAP_RE.test(name)) return true;
  const summary = String(map?.summary || "");
  return /\/samugiru\/|\/kuo\/kuomura|\/marinasu\/marinasu|\/family\//i.test(summary);
}

function assertWildEncounterAllowed(map, game = null) {
  if (!wildEncounterAllowed(map, game)) throw new Error(wildEncounterBlockedText(map, game));
}

function wildEncounterBlockedText(map, game = null) {
  if (!encounterSourceDataAvailable(map)) return `${map?.name || "当前地图"} 没有 encount.txt 遇敌表，不能在这里触发野外战斗。`;
  if (isSafeWildEncounterMap(map)) return `${map.name} 是村镇或安全地图，虽然资料里有 encount.txt 记录，但随机野外遇敌已按安全区规则关闭。`;
  if (game && !encounterDataAvailable(map, game)) {
    const area = chooseEncounterArea(map, game.location);
    if (!area) return `${map?.name || "当前地图"} 当前坐标没有可用的 encount.txt 遇敌区域。`;
    return `${map?.name || "当前地图"} 当前遇敌组需要特定道具或受 group1.txt 背包条件限制，暂时不能在这里触发野外战斗。`;
  }
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
  const [enemyText, enemyBaseText, skillText, itemText] = await Promise.all([
    assetText(env, request, DATA_FILES.enemy),
    assetText(env, request, DATA_FILES.enemyBase),
    assetText(env, request, DATA_FILES.skills),
    assetEncodedText(env, request, DATA_FILES.items, "gb18030")
  ]);
  const skills = parseSkills(skillText);
  const itemSet = parseItemSet(itemText);
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
  cache = { enemyBaseSet, enemyNoList, enemySpecsById, itemSet, skills };
  return cache;
}

function parseItemSet(text) {
  const items = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 20) continue;
    const id = toInt(rows[16]);
    if (!id) continue;
    const name = cleanReferenceText(rows[0]) || `道具 ${id}`;
    items.set(id, {
      id,
      name,
      secretName: cleanReferenceText(rows[1]),
      description: cleanReferenceText(rows[2]),
      image: toInt(rows[17]),
      cost: toInt(rows[18]),
      type: toInt(rows[19]),
      useField: toInt(rows[20]),
      target: toInt(rows[21]),
      level: toInt(rows[22]),
      category: cleanReferenceText(rows[68])
    });
  }
  return items;
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
    SourceExp: 0,
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
  char.Exp = sourceEnemyExpFromStats(char);
  char.SourceExp = char.Exp;
  char.BornPoint = [char.WorkMaxHp, char.WorkFixStr, char.WorkFixTough, char.WorkFixDex];
  return char;
}

function petLevelUp(char, options = {}) {
  if (char.Lv >= CHAR_MAXUPLEVEL) return;
  const prevHp = Number(char.Hp || 0);
  const prevMaxHp = Math.max(1, Number(char.WorkMaxHp || char.Hp || 1));
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
  complianceParameter(char, { preserveHp: Boolean(options.preserveHp) });
  if (options.preserveHp) {
    const maxDelta = Math.max(0, Number(char.WorkMaxHp || 1) - prevMaxHp);
    char.Hp = Math.max(1, Math.min(Number(char.WorkMaxHp || 1), prevHp + maxDelta));
  }
  const lvd = char.Lv - char.BornLv;
  if (lvd > 0) {
    char.GrowthHp = (char.WorkMaxHp - char.BornPoint[0]) / lvd;
    char.GrowthStr = (char.WorkFixStr - char.BornPoint[1]) / lvd;
    char.GrowthTough = (char.WorkFixTough - char.BornPoint[2]) / lvd;
    char.GrowthDex = (char.WorkFixDex - char.BornPoint[3]) / lvd;
    char.Growth = char.GrowthStr + char.GrowthTough + char.GrowthDex;
  }
}

function complianceParameter(char, options = {}) {
  const previousHp = Number(char.Hp || 0);
  char.WorkFixDex = Math.trunc(char.Dex / 100);
  char.WorkFixVital = Math.trunc(char.Vital / 100);
  char.WorkFixStr = Math.trunc((char.Str * 1 + char.Tough * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkFixTough = Math.trunc((char.Tough * 1 + char.Str * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkMaxHp = Math.trunc((char.Vital * 4 + char.Str + char.Tough + char.Dex) / 100);
  char.Hp = options.preserveHp
    ? clampInt(previousHp, 0, Math.max(1, char.WorkMaxHp), Math.max(1, char.WorkMaxHp))
    : char.WorkMaxHp;
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
    const text = path === DATA_FILES.items
      ? await assetEncodedText(env, request, path, "gb18030")
      : await assetText(env, request, path);
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
    exp: pet.Exp,
    nextExp: pet.NextExp,
    expToNext: pet.ExpToNext,
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

async function assetEncodedText(env, request, path, encoding) {
  const buffer = await assetBuffer(env, request, path);
  try {
    return new TextDecoder(encoding).decode(buffer);
  } catch {
    return new TextDecoder().decode(buffer);
  }
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

function cleanReferenceText(value) {
  return String(value || "")
    .replace(/\0/g, "")
    .replace(/[�\uE000-\uF8FF]/g, "")
    .replace(/\\n/g, " ")
    .replace(/\|0+.*$/g, "")
    .replace(/\|([1-9]\d*).*$/g, " $1")
    .replace(/\|.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
