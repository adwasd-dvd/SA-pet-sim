import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const refRoot = path.resolve(process.env.SA_REF_DATA || path.join(appRoot, "external", "sources", "ref___data"));
const clientRoot = path.resolve(process.env.SA_CLIENT_ASSET_ROOT || path.join(appRoot, "external", "sources", "client-assets"));
const mapRoot = path.join(refRoot, "map");
const npcRoot = path.join(refRoot, "npc");
const clientMapRoot = path.join(clientRoot, "map");
const publicMapRoot = path.join(appRoot, "public", "data", "maps");
const publicClientMapRoot = path.join(appRoot, "public", "data", "client-maps");
const worldOut = path.join(appRoot, "src", "world-data.js");
const gb18030 = new TextDecoder("gb18030");
const GMSV_DATA_SOURCE = "gmsv-data";
const CLIENT_ASSET_SOURCE = "client-assets";

const START_FLOOR = 1000;
const MAX_MAPS = 260;
const ARENA_FLOORS = [
  130, 141, 142, 143, 144, 145, 146, 147,
  154, 155, 156, 157,
  1007, 1042, 2007, 3007, 4007,
  5032, 6032, 7006, 7007, 7032, 7532, 8032, 9032,
  20000
];
const FORCED_FLOORS = [
  100, 101, 120, 121, 122, 200, 601,
  ...ARENA_FLOORS,
  ...range(1000, 1022),
  ...range(1040, 1048),
  ...range(1100, 1112),
  ...range(1200, 1215),
  ...range(1300, 1310),
  ...range(1400, 1408),
  ...range(2000, 2020),
  ...range(2030, 2038),
  ...range(3000, 3022),
  ...range(3030, 3038),
  ...range(4000, 4020),
  ...range(4030, 4038),
  ...range(8200, 8213),
  ...range(8216, 8221),
  ...range(8230, 8233),
  ...range(10001, 10007),
  10101,
  ...range(10201, 10204),
  ...range(10701, 10705),
  ...range(10901, 10903),
  ...range(11001, 11005),
  31401
];
const MAX_NPCS_PER_MAP = 120;

const mapFiles = scanMapFiles();
const warps = parseWarps(path.join(mapRoot, "mapwarp.txt"));
const enemySpecs = parseEnemySpecs(path.join(refRoot, "enemy1.txt"));
const enemyGroups = parseEnemyGroups(path.join(refRoot, "group1.txt"), enemySpecs);
const encounterByFloor = parseEncounters(path.join(refRoot, "encount.txt"), enemyGroups);
const itemDb = parseItems(path.join(refRoot, "itemset6.txt"));
const npcsByFloor = parseNpcs();
const selectedFloors = selectFloors();
const maps = {};

rmSync(publicMapRoot, { recursive: true, force: true });
rmSync(publicClientMapRoot, { recursive: true, force: true });
mkdirSync(publicMapRoot, { recursive: true });
mkdirSync(publicClientMapRoot, { recursive: true });

for (const floor of selectedFloors) {
  const mapInfo = mapFiles.get(floor);
  if (!mapInfo) continue;
  const id = String(floor);
  const mapFile = `/data/maps/${floor}.ls2map`;
  const clientMapInfo = clientMapFile(floor);
  cpSync(mapInfo.file, path.join(publicMapRoot, `${floor}.ls2map`));
  if (clientMapInfo) cpSync(clientMapInfo.file, path.join(publicClientMapRoot, `${floor}.dat`));
  const encounterAreas = encounterByFloor.get(floor) || [];
  maps[id] = {
    id,
    floorId: floor,
    name: cleanName(mapInfo.name) || `floor ${floor}`,
    mapFile,
    ...(clientMapInfo ? { clientMapFile: `/data/client-maps/${floor}.dat`, clientMapSource: clientMapInfo.source } : {}),
    summary: `${cleanName(mapInfo.name) || `floor ${floor}`} | floor=${floor} | ${mapInfo.width}x${mapInfo.height} | ${relativeRef(mapInfo.file)}`,
    size: [mapInfo.width, mapInfo.height],
    spawn: defaultSpawn(floor, mapInfo),
    encounterPets: encounterPetNos(encounterAreas).slice(0, 20),
    encounterAreas,
    npcs: (npcsByFloor.get(floor) || []).slice(0, MAX_NPCS_PER_MAP),
    exits: []
  };
}

for (const floor of selectedFloors) {
  const map = maps[String(floor)];
  if (!map) continue;
  const seen = new Set();
  const usableWarps = [];
  for (const warp of warps.get(floor) || []) {
    if (!maps[String(warp.toFloor)]) continue;
    const key = `${warp.x}:${warp.y}:${warp.toFloor}`;
    if (seen.has(key)) continue;
    seen.add(key);
    usableWarps.push(warp);
  }
  for (const cluster of clusterWarps(usableWarps)) {
    const warp = cluster[0];
    const target = mapFiles.get(warp.toFloor);
    const targetName = cleanName(target?.name) || `floor ${warp.toFloor}`;
    const bounds = boundsFor(cluster);
    const marker = centerFor(cluster);
    const targetPoint = centerFor(cluster.map((item) => ({ x: item.toX, y: item.toY })));
    map.exits.push({
      id: `${warp.toFloor}-${map.exits.length}`,
      label: `去 ${targetName}`,
      detail: `${targetName} | floor ${warp.toFloor} | 目标 (${targetPoint.x},${targetPoint.y}) | ${formatExitBounds(bounds, cluster.length)}`,
      to: String(warp.toFloor),
      x: marker.x,
      y: marker.y,
      bounds: [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY],
      target: [targetPoint.x, targetPoint.y],
      tiles: cluster.map((item) => ({
        x: item.x,
        y: item.y,
        target: [item.toX, item.toY]
      })),
      source: `${GMSV_DATA_SOURCE}/map/mapwarp.txt`
    });
  }
}

const quests = firstPlayableQuests(maps);
applyFirstPlayableQuestHooks(maps, quests);

const world = {
  source: {
    root: relativeRef(refRoot),
    maps: `${GMSV_DATA_SOURCE}/map/** LS2MAP`,
    clientMaps: "公益石器时代/map/*.dat",
    npcs: `${GMSV_DATA_SOURCE}/npc/**/*.create + .template + args/config`,
    warps: `${GMSV_DATA_SOURCE}/map/mapwarp.txt`,
    encounters: `${GMSV_DATA_SOURCE}/encount.txt`
  },
  startMap: String(START_FLOOR),
  maps,
  quests
};

writeFileSync(worldOut, `export const WORLD = ${JSON.stringify(world, null, 2)};\n`);
console.log(`Generated ${Object.keys(maps).length} maps into ${path.relative(appRoot, worldOut)}`);
console.log(`Copied LS2MAP files into ${path.relative(appRoot, publicMapRoot)}`);
console.log(`Copied client DAT maps into ${path.relative(appRoot, publicClientMapRoot)}`);

function scanMapFiles() {
  const files = new Map();
  for (const file of walk(mapRoot)) {
    const buf = readFileSync(file);
    if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") continue;
    const floor = buf.readUInt16BE(6);
    const rawName = gb18030.decode(buf.subarray(8, 40)).replace(/\0/g, "").trim();
    files.set(floor, {
      floor,
      file,
      name: rawName,
      width: buf.readUInt16BE(40),
      height: buf.readUInt16BE(42)
    });
  }
  return files;
}

function clientMapFile(floor) {
  const file = path.join(clientMapRoot, `${floor}.dat`);
  if (!exists(file)) return null;
  const buf = readFileSync(file);
  if (buf.length < 8) return null;
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  if (buf.length < 8 + width * height * 6) return null;
  return {
    file,
    width,
    height,
    source: `公益石器时代/map/${floor}.dat`
  };
}

function parseWarps(file) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const parts = line.trim().split(":");
    if (parts.length < 5) continue;
    const from = parts[2].split(",").map(Number);
    const to = parts[3].split(",").map(Number);
    if (from.length < 3 || to.length < 3 || from.some(Number.isNaN) || to.some(Number.isNaN)) continue;
    push(out, from[0], { floor: from[0], x: from[1], y: from[2], toFloor: to[0], toX: to[1], toY: to[2] });
  }
  return out;
}

function parseEnemySpecs(file) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const rows = line.trim().split(",");
    if (rows.length < 10) continue;
    const offset = Number.isFinite(Number.parseInt(rows[2], 10)) && Number.parseInt(rows[2], 10) > 0 ? 2 : 3;
    const id = Number(rows[offset]);
    const tempNo = Number(rows[offset + 1]);
    if (!Number.isFinite(id) || !Number.isFinite(tempNo) || id <= 0 || tempNo <= 0) continue;
    const rawMin = Number(rows[offset + 2]) || 1;
    const rawMax = Number(rows[offset + 3]) || rawMin;
    out.set(id, {
      id,
      tempNo,
      lvMin: Math.max(1, Math.min(rawMin, rawMax)),
      lvMax: Math.max(1, Math.max(rawMin, rawMax)),
      createMax: Math.max(1, Number(rows[offset + 4]) || 1),
      createMin: Math.max(1, Number(rows[offset + 5]) || 1)
    });
  }
  return out;
}

function parseEnemyGroups(file, specs) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const cols = line.trim().split(",");
    const groupId = Number(cols[1]);
    if (!Number.isFinite(groupId) || groupId <= 0) continue;
    const enemies = [];
    for (let i = 0; i < 10; i += 1) {
      const enemyId = Number(cols[4 + i]);
      const weight = Number(cols[14 + i]) || 0;
      const spec = specs.get(enemyId);
      if (!Number.isFinite(enemyId) || enemyId <= 0 || weight <= 0 || !spec) continue;
      enemies.push({
        enemyId,
        weight,
        tempNo: spec.tempNo,
        lvMin: spec.lvMin,
        lvMax: spec.lvMax,
        createMin: spec.createMin,
        createMax: spec.createMax
      });
    }
    if (!enemies.length) continue;
    out.set(groupId, {
      groupId,
      name: cleanName(cols[0]) || `group ${groupId}`,
      appearByItemId: positiveId(cols[2]),
      notAppearByItemId: positiveId(cols[3]),
      enemies,
      source: `${GMSV_DATA_SOURCE}/group1.txt`
    });
  }
  return out;
}

function parseEncounters(file, groupsById) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const cols = line.trim().split(",");
    const id = Number(cols[0]);
    const floor = Number(cols[1]);
    if (!Number.isFinite(id) || !Number.isFinite(floor)) continue;
    const groups = [];
    for (let i = 0; i < 10; i += 1) {
      const groupId = Number(cols[10 + i]);
      const group = groupsById.get(groupId);
      if (!Number.isFinite(groupId) || groupId <= 0 || !group) continue;
      groups.push({
        groupId,
        name: group.name,
        weight: Math.max(1, Number(cols[20 + i]) || 1),
        appearByItemId: group.appearByItemId,
        notAppearByItemId: group.notAppearByItemId,
        enemies: group.enemies,
        source: group.source
      });
    }
    if (!groups.length) continue;
    push(out, floor, {
      id,
      floor,
      bounds: normalizeBounds(cols.slice(2, 6).map(Number)),
      encounterProbMin: Math.max(0, Number(cols[6]) || 0),
      encounterProbMax: Math.max(0, Number(cols[7]) || 0),
      enemyMax: Math.max(1, Number(cols[8]) || 1),
      zorder: Number(cols[9]) || 0,
      groups,
      source: `${GMSV_DATA_SOURCE}/encount.txt`
    });
  }
  return out;
}

function normalizeBounds([x1, y1, x2, y2]) {
  return [
    Math.min(Number(x1) || 0, Number(x2) || 0),
    Math.min(Number(y1) || 0, Number(y2) || 0),
    Math.max(Number(x1) || 0, Number(x2) || 0),
    Math.max(Number(y1) || 0, Number(y2) || 0)
  ];
}

function positiveId(value) {
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function encounterPetNos(areas) {
  return [...new Set((areas || [])
    .flatMap((area) => area.groups || [])
    .flatMap((group) => group.enemies || [])
    .map((enemy) => Number(enemy.tempNo))
    .filter((value) => Number.isFinite(value) && value > 0))];
}

function parseNpcs() {
  const templates = parseTemplates();
  const out = new Map();
  let idCounter = 0;
  for (const file of walk(npcRoot).filter((item) => item.endsWith(".create"))) {
    const text = readText(file);
    for (const block of blocks(text)) {
      const kv = parseBlock(block);
      const floor = Number(kv.floorid);
      if (!Number.isFinite(floor)) continue;
      const pos = parsePos(kv.borncenter || kv.borncorner || kv.movecenter);
      if (!pos) continue;
      const enemy = parseEnemy(kv.enemy || "");
      const template = templates.get(enemy.template) || {};
      const argPath = enemy.argPath || "";
      const dialogue = readNpcDialogue(argPath, file);
      const trade = readNpcTrade(argPath, file);
      const warp = readNpcWarp(argPath, file);
      const functionset = template.functionset || enemy.template || "NPC";
      const npcEnemy = readNpcEnemy(argPath, file, functionset);
      const name = cleanName(kv.name || template.name || functionset);
      const scriptHints = npcScriptHints(argPath, file, npcEnemy, trade, warp);
      const npc = {
        id: `${floor}-${pos[0]}-${pos[1]}-${idCounter + 1}`,
        name: name || functionset,
        x: pos[0],
        y: pos[1],
        type: functionset,
        dialogue: dialogue.text,
        dialogueLines: dialogue.lines,
        source: relativeRef(file),
        script: argPath || enemy.template,
        template: enemy.template,
        graphic: kv.graphicname || template.graphicname || "",
        ...(trade ? { trade } : {}),
        ...(warp ? { warp } : {}),
        ...(npcEnemy ? { npcEnemy } : {}),
        ...(scriptHints ? { scriptHints } : {})
      };
      const questLead = questLeadForNpc(npc, scriptHints);
      idCounter += 1;
      if (questLead) npc.questLead = questLead;
      push(out, floor, npc);
    }
  }
  for (const [floor, list] of out) {
    list.sort((a, b) => npcPriority(b) - npcPriority(a) || a.y - b.y || a.x - b.x);
    out.set(floor, list);
  }
  return out;
}

function parseItems(file) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const cols = line.trim().split(",");
    if (cols.length < 20) continue;
    const id = Number(cols[16]);
    if (!Number.isFinite(id) || id <= 0) continue;
    out.set(id, {
      id,
      name: cleanName(cols[0]) || `item ${id}`,
      secretName: cleanName(cols[1]) || "",
      description: cleanName(cols[2]) || "",
      image: Number(cols[17]) || 0,
      cost: Number(cols[18]) || 0,
      type: Number(cols[19]) || 0,
      useField: Number(cols[20]) || 0,
      target: Number(cols[21]) || 0,
      level: Number(cols[22]) || 0
    });
  }
  return out;
}

function parseTemplates() {
  const templates = new Map();
  for (const file of walk(npcRoot).filter((item) => item.endsWith(".template"))) {
    const text = readText(file);
    for (const block of blocks(text)) {
      const kv = parseBlock(block);
      if (!kv.templatename) continue;
      templates.set(kv.templatename, kv);
    }
  }
  return templates;
}

function selectFloors() {
  const selected = [];
  const addFloor = (floor) => {
    if (selected.length >= MAX_MAPS) return false;
    if (!mapFiles.has(floor) || selected.includes(floor)) return false;
    selected.push(floor);
    return true;
  };
  for (const floor of FORCED_FLOORS) addFloor(floor);
  const queued = [START_FLOOR, ...selected];
  const explored = new Set();
  while (queued.length && selected.length < MAX_MAPS) {
    const floor = queued.shift();
    if (explored.has(floor) || !mapFiles.has(floor)) continue;
    explored.add(floor);
    addFloor(floor);
    const next = (warps.get(floor) || []).map((warp) => warp.toFloor).filter((item) => mapFiles.has(item));
    for (const item of next) {
      if (!explored.has(item) && !queued.includes(item)) queued.push(item);
    }
  }
  return selected;
}

function firstPlayableQuests(maps) {
  const teacherId = "1000-42-72-1505";
  const ganzo = findNpc(maps, "100", (npc) => /愿藏|願藏/.test(npc.name || "") && npc.npcEnemy);
  return {
    "samugiru-field-practice": {
      id: "samugiru-field-practice",
      title: "萨姆吉尔野外练习",
      description: "萨姆吉尔的老师让新来的冒险者到村外确认野外宠物资料，完成一次战斗或捕获后回来报告。",
      steps: [
        "向萨姆吉尔的老师打招呼。",
        "离开萨姆吉尔村，前往有野外遇敌资料的地图。",
        "击败或捕获一只野外宠物。",
        "回到萨姆吉尔的老师身边报告。"
      ],
      reward: "经验 40 / 石币 120",
      expReward: 40,
      stoneReward: 120,
      startNpcId: teacherId,
      returnNpcId: teacherId,
      objectives: {
        visitEncounterMap: true,
        fieldWin: true
      },
      source: `${GMSV_DATA_SOURCE}/npc/genout/1000npc_m.create + ${GMSV_DATA_SOURCE}/encount.txt`
    },
    "samugiru-four-village-route": {
      id: "samugiru-four-village-route",
      title: "萨伊那斯四村巡礼",
      description: "从萨姆吉尔出发，按原 mapwarp 资料走访萨伊那斯、玛丽娜丝渔村和柯奥村，确认村镇与出口已经在 Worker 世界里可玩。",
      steps: [
        "向萨姆吉尔的老师询问四村路线。",
        "离开萨姆吉尔村，抵达萨伊那斯。",
        "前往玛丽娜丝渔村。",
        "前往柯奥村。",
        "回到萨姆吉尔的老师身边报告。"
      ],
      reward: "经验 60 / 石币 180",
      expReward: 60,
      stoneReward: 180,
      startNpcId: teacherId,
      returnNpcId: teacherId,
      objectives: {
        enterMaps: ["100", "2000", "1100"]
      },
      source: `${GMSV_DATA_SOURCE}/map/mapwarp.txt`
    },
    "samugiru-arena-tour": {
      id: "samugiru-arena-tour",
      title: "竞技场与英雄战场见学",
      description: "确认村内竞技场、道场和英雄战场地图已经加载，并记录这些地图的原始入口资料。",
      steps: [
        "向萨姆吉尔的老师询问竞技场。",
        "进入萨姆吉尔竞技场或道场柜台。",
        "前往英雄战场。",
        "回到萨姆吉尔的老师身边报告。"
      ],
      reward: "经验 50 / 石币 150",
      expReward: 50,
      stoneReward: 150,
      startNpcId: teacherId,
      returnNpcId: teacherId,
      objectives: {
        enterMaps: ["1007", "8200"]
      },
      source: `${GMSV_DATA_SOURCE}/map/sainasu/samugiru/1007 + ${GMSV_DATA_SOURCE}/map/hero/8200`
    },
    ...(ganzo ? {
      "ganzo-roadblock": {
        id: "ganzo-roadblock",
        title: "坏心眼的愿藏",
        description: "萨伊那斯路上的愿藏会按 NPCEnemy 脚本拦住玩家。战胜他后道路会暂时打开。",
        steps: [
          "向萨姆吉尔的老师打听愿藏。",
          "在萨伊那斯找到坏心眼的愿藏。",
          "按原 NPCEnemy 对话确认战斗并击败愿藏。",
          "回到萨姆吉尔的老师身边报告。"
        ],
        reward: "经验 70 / 石币 220",
        expReward: 70,
        stoneReward: 220,
        startNpcId: teacherId,
        returnNpcId: teacherId,
        objectives: {
          npcEnemyIds: [ganzo.id]
        },
        source: ganzo.npcEnemy?.source || ganzo.script || ganzo.source
      }
    } : {})
  };
}

function applyFirstPlayableQuestHooks(maps, quests) {
  const map = maps[String(START_FLOOR)];
  for (const quest of Object.values(quests)) {
    const npc = map?.npcs?.find((item) => item.id === quest.startNpcId || item.id === quest.returnNpcId);
    if (!npc) continue;
    pushNpcQuestId(npc, quest.id);
    const lines = [
      ...(npc.dialogueLines || []),
      questHookLine(quest)
    ];
    npc.dialogueLines = [...new Set(lines.filter(Boolean))];
  }
  const teacher = map?.npcs?.find((item) => item.id === "1000-42-72-1505");
  if (teacher) {
    teacher.dialogueLines = [
      ...(teacher.dialogueLines || []),
      "如果遇到危险，记得先让宠物出战；击败或捕获一只野外宠物就足够了。"
    ];
    teacher.dialogueLines = [...new Set(teacher.dialogueLines.filter(Boolean))];
  }
}

function findNpc(maps, mapId, predicate) {
  const map = maps[String(mapId)];
  if (!map?.npcs?.length) return null;
  return map.npcs.find(predicate) || null;
}

function range(from, to) {
  const out = [];
  for (let value = from; value <= to; value += 1) out.push(value);
  return out;
}

function npcQuestIds(npc) {
  return [...new Set([
    npc.questId,
    ...(Array.isArray(npc.questIds) ? npc.questIds : [])
  ].filter(Boolean))];
}

function pushNpcQuestId(npc, questId) {
  const ids = npcQuestIds(npc);
  if (!ids.includes(questId)) ids.push(questId);
  npc.questIds = ids;
  npc.questId ||= ids[0];
}

function questHookLine(quest) {
  if (quest.id === "samugiru-field-practice") {
    return "成人练习不只是听课。到村外确认一次野外宠物资料，再回来向我报告。";
  }
  if (quest.id === "samugiru-four-village-route") {
    return "萨伊那斯四村之间的路要自己走一遍，地图、出口和村镇服务才算真正认得。";
  }
  if (quest.id === "samugiru-arena-tour") {
    return "竞技场、道场和英雄战场也在地图资料里。进去看看，再回来告诉我入口是否顺畅。";
  }
  if (quest.id === "ganzo-roadblock") {
    return "如果遇到坏心眼的愿藏，别光听他说狠话；那是 NPCEnemy 拦路脚本，确认以后要真打赢。";
  }
  return quest.description;
}

function defaultSpawn(floor, mapInfo) {
  const warpBack = [...warps.values()].flat().find((warp) => warp.toFloor === floor);
  if (warpBack) return [clamp(warpBack.toX, mapInfo.width), clamp(warpBack.toY, mapInfo.height)];
  return [Math.floor(mapInfo.width / 2), Math.floor(mapInfo.height / 2)];
}

function clusterWarps(items) {
  const clusters = [];
  for (const item of items) {
    let cluster = clusters.find((candidate) => candidate[0].toFloor === item.toFloor && nearCluster(candidate, item));
    if (!cluster) {
      cluster = [];
      clusters.push(cluster);
    }
    cluster.push(item);
  }
  return clusters;
}

function nearCluster(cluster, item) {
  const bounds = boundsFor(cluster);
  const dx = item.x < bounds.minX ? bounds.minX - item.x : item.x > bounds.maxX ? item.x - bounds.maxX : 0;
  const dy = item.y < bounds.minY ? bounds.minY - item.y : item.y > bounds.maxY ? item.y - bounds.maxY : 0;
  return dx <= 2 && dy <= 2;
}

function boundsFor(items) {
  return items.reduce((bounds, item) => ({
    minX: Math.min(bounds.minX, item.x),
    minY: Math.min(bounds.minY, item.y),
    maxX: Math.max(bounds.maxX, item.x),
    maxY: Math.max(bounds.maxY, item.y)
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
}

function centerFor(items) {
  const total = items.reduce((sum, item) => ({ x: sum.x + item.x, y: sum.y + item.y }), { x: 0, y: 0 });
  return {
    x: Math.round(total.x / items.length),
    y: Math.round(total.y / items.length)
  };
}

function formatExitBounds(bounds, count) {
  if (count <= 1 || (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY)) return `入口 (${bounds.minX},${bounds.minY})`;
  return `入口 ${count} 格 (${bounds.minX},${bounds.minY})-(${bounds.maxX},${bounds.maxY})`;
}

function readNpcDialogue(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return { text: `脚本入口：${argPath || "未配置脚本参数"}`, lines: [] };
  const text = readText(file);
  const messages = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const value = line.match(/^(?:message|main_msg|askbattlemsg1|deniedmsg|luck\d+|TALKEVENT\d*)[:=](.*)$/i)?.[1];
    if (!value) continue;
    for (const part of value.split(/(?:\\n|\n|,)/)) {
      const cleaned = cleanName(part.replace(/%[0-9]*[a-z]/gi, ""));
      if (cleaned && !messages.includes(cleaned)) messages.push(cleaned);
      if (messages.length >= 8) break;
    }
    if (messages.length >= 8) break;
  }
  if (messages.length) return { text: messages[0], lines: messages };
  return { text: `脚本入口：${relativeRef(file)}`, lines: [] };
}

function readNpcTrade(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const kv = parseColonFile(readText(file));
  const itemSpec = kv.itemlist || kv.limititemno || "";
  if (!itemSpec) return null;
  const ids = expandItemList(itemSpec);
  const buyRate = Number(kv.buy_rate || 1) || 1;
  const sellRate = Number(kv.sell_rate || 0) || 0;
  const items = ids.map((id) => itemDb.get(id)).filter(Boolean).map((item) => ({
    ...item,
    price: Math.max(0, Math.round(item.cost * buyRate))
  }));
  if (!items.length) return null;
  return {
    kind: "shop",
    source: relativeRef(file),
    buyRate,
    sellRate,
    buyWords: splitWords(kv.buy_msg),
    sellWords: splitWords(kv.sell_msg),
    mainMessage: cleanName(kv.main_msg || kv.buy_main || ""),
    items: items.slice(0, 40)
  };
}

function readNpcWarp(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const target = parseWarpTarget(text);
  if (!target) return null;
  const kv = parseColonFile(text);
  const free = trimInlineValue(kv.free || "");
  const money = trimInlineValue(kv.money || "");
  return {
    kind: "warpman",
    target,
    free: cleanName(free),
    money: cleanName(money),
    cost: parseWarpCost(money),
    deleteItems: expandItemList(kv.delitem || ""),
    freeMessage: cleanScriptText(kv.freemsg || kv.free_msg || ""),
    payMessage: cleanScriptText(kv.paymsg || kv.pay_msg || ""),
    normalMessage: cleanScriptText(kv.nomal_msg || kv.normalmsg || kv.main_msg || ""),
    moneyMessage: cleanScriptText(kv.moneymsg || kv.money_msg || ""),
    partyMessage: cleanScriptText(kv.partymsg || kv.party_msg || ""),
    warpMessage: cleanScriptText(kv.warp_msg || ""),
    source: relativeRef(file)
  };
}

function readNpcEnemy(argPath, createFile, functionset) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file || !/npcenemy/i.test(functionset || "")) return null;
  const kv = parseNpcEnemyFile(readText(file));
  const enemyNos = splitNumberList(kv.enemyno || "");
  const askBattleMessages = [];
  for (let i = 1; i <= 6; i += 1) {
    const line = cleanScriptText(kv[`askbattlemsg${i}`] || "");
    if (line) askBattleMessages.push(line);
  }
  return {
    kind: "NPCEnemy",
    source: relativeRef(file),
    entype: Number(kv.entype || 0) || 0,
    enemyNos,
    askBattleMessages,
    startMessage: cleanScriptText(kv.startmsg || ""),
    deniedMessage: cleanScriptText(kv.deniedmsg || ""),
    endMessage: cleanScriptText(kv.endmsg || kv["end msg"] || ""),
    dieAct: Number(kv.dieact || 0) || 0,
    respawnSeconds: Number(kv.time || 0) || 0,
    warp: parseNpcEnemyWarp(kv)
  };
}

function npcScriptHints(argPath, createFile, npcEnemy, trade, warp) {
  const file = resolveNpcArg(argPath, createFile);
  const actions = [];
  if (trade) actions.push("shop");
  if (warp) actions.push("warp");
  if (npcEnemy) actions.push("battle");
  if (!file) return actions.length ? { actions } : null;
  const text = readText(file);
  const hints = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(EVENTRUN\d*|EVENT\d*|FREE|CHECKPARTY|TALKEVENT\d*|ENDEVENT\d*|CHANGEITEM|DELITEM|WARP|GIVEITEM|GOLD|MONEY)\s*[:=]\s*(.*)$/i);
    if (!match) continue;
    const value = cleanScriptText(`${match[1]}:${match[2]}`).replace(/\s+/g, " ");
    if (value && !hints.includes(value)) hints.push(value);
    if (hints.length >= 8) break;
  }
  if (hints.some((item) => /EVENT|FREE|CHECKPARTY|CHANGEITEM|GIVEITEM|DELITEM|GOLD|MONEY/i.test(item))) {
    actions.push("questLead");
  }
  return {
    actions: [...new Set(actions)],
    hints,
    source: relativeRef(file)
  };
}

function questLeadForNpc(npc, scriptHints) {
  if (!scriptHints?.actions?.includes("questLead")) return null;
  const firstHint = scriptHints.hints?.find(Boolean) || "原脚本有事件条件，后续需要按 gmsv 规则接入。";
  return {
    title: `${npc.name} 的原脚本线索`,
    summary: firstHint,
    source: scriptHints.source || npc.script || npc.source || "",
    status: "source-lead"
  };
}

function parseNpcEnemyFile(text) {
  const kv = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([^:=]+)\s*[:=]\s*(.*)$/);
    if (!match) continue;
    kv[match[1].trim().toLowerCase()] = match[2].trim();
  }
  return kv;
}

function parseNpcEnemyWarp(kv) {
  const floor = Number(kv.warpfl);
  const x = Number(kv.warpx);
  const y = Number(kv.warpy);
  if (![floor, x, y].every(Number.isFinite) || floor <= 0) return null;
  return { mapId: String(floor), floor, x, y };
}

function splitNumberList(value = "") {
  return value.split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0);
}

function parseWarpTarget(text) {
  const matches = [...text.matchAll(/\b(?:WARP|TO)\s*:\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/gi)];
  for (const match of matches) {
    const floor = Number(match[1]);
    const x = Number(match[2]);
    const y = Number(match[3]);
    if ([floor, x, y].some((value) => !Number.isFinite(value))) continue;
    if (floor <= 0) continue;
    return { mapId: String(floor), floor, x, y };
  }
  return null;
}

function parseWarpCost(value = "") {
  const text = cleanName(trimInlineValue(value)).toUpperCase();
  if (!text) return null;
  if (text === "-1") return { mode: "unavailable" };
  const levelCost = text.match(/^LV\s*\*\s*(\d+)$/);
  if (levelCost) return { mode: "level-multiplier", amount: Number(levelCost[1]) };
  const fixed = Number(text);
  if (Number.isFinite(fixed) && fixed >= 0) return { mode: "fixed", amount: fixed };
  return { mode: "unknown", raw: cleanName(value) };
}

function trimInlineValue(value = "") {
  return String(value).split(/\|(?:to|warp|money|delitem|over)\b:?/i)[0].trim();
}

function cleanScriptText(value = "") {
  return cleanName(String(value).replace(/\\n/g, "\n").replace(/%[0-9]*[a-z]/gi, ""));
}

function parseColonFile(text) {
  const kv = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index < 0) continue;
    kv[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim();
  }
  return kv;
}

function expandItemList(spec) {
  const ids = [];
  for (const part of spec.split(",")) {
    const value = part.trim();
    if (!value) continue;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let id = start; id <= end && ids.length < 120; id += 1) ids.push(id);
      continue;
    }
    const id = Number(value);
    if (Number.isFinite(id)) ids.push(id);
  }
  return [...new Set(ids)];
}

function splitWords(value = "") {
  return value.split(",").map((item) => cleanName(item)).filter(Boolean);
}

function resolveNpcArg(argPath, createFile) {
  const normalized = argPath.replace(/^(file|conff):/, "");
  if (!normalized) return null;
  const candidates = [
    path.join(npcRoot, normalized),
    path.join(npcRoot, `${normalized}.arg`),
    path.join(path.dirname(createFile), normalized),
    path.join(path.dirname(createFile), `${normalized}.arg`)
  ];
  return candidates.find((file) => exists(file)) || null;
}

function parseEnemy(enemy) {
  const parts = enemy.split("|");
  const template = parts[0] || "NPC";
  const arg = parts.find((part) => /^(file|conff):/.test(part)) || "";
  return { template, argPath: arg };
}

function parseBlock(block) {
  const kv = {};
  for (const raw of block.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 0) continue;
    kv[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim();
  }
  return kv;
}

function blocks(text) {
  return [...text.matchAll(/\{([\s\S]*?)\}/g)].map((match) => match[1]);
}

function parsePos(value = "") {
  const nums = value.split(",").map(Number);
  if (nums.length < 2 || nums.slice(0, 2).some(Number.isNaN)) return null;
  return [nums[0], nums[1]];
}

function npcPriority(npc) {
  let score = 0;
  if (npc.dialogue && !npc.dialogue.startsWith("脚本入口")) score += 8;
  if (!/warp/i.test(npc.type)) score += 4;
  if (/shop|healer|save|pet|man|window|event/i.test(npc.type)) score += 2;
  if (npc.name && !/^NPC$/.test(npc.name)) score += 1;
  return score;
}

function cleanName(value = "") {
  return value
    .replace(/\0/g, "")
    .replace(/[�\uE000-\uF8FF]/g, "")
    .replace(/\|0+.*$/g, "")
    .replace(/\|([1-9]\d*).*$/g, " $1")
    .replace(/\|.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readText(file) {
  return gb18030.decode(readFileSync(file));
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) out.push(...walk(file));
    else out.push(file);
  }
  return out;
}

function exists(file) {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function push(map, key, value) {
  const list = map.get(key) || [];
  list.push(value);
  map.set(key, list);
}

function clamp(value, max) {
  return Math.max(0, Math.min(Number(value) || 0, max - 1));
}

function relativeRef(file) {
  const resolved = path.resolve(file);
  const refRelative = path.relative(refRoot, resolved);
  if (!refRelative) return GMSV_DATA_SOURCE;
  if (!refRelative.startsWith("..") && !path.isAbsolute(refRelative)) {
    return `${GMSV_DATA_SOURCE}/${refRelative}`.replaceAll(path.sep, "/");
  }
  const clientRelative = path.relative(clientRoot, resolved);
  if (!clientRelative) return CLIENT_ASSET_SOURCE;
  if (!clientRelative.startsWith("..") && !path.isAbsolute(clientRelative)) {
    return `${CLIENT_ASSET_SOURCE}/${clientRelative}`.replaceAll(path.sep, "/");
  }
  return path.relative(appRoot, resolved).replaceAll(path.sep, "/");
}
