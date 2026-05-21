import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const refRoot = path.resolve(process.env.SA_REF_DATA || path.join(appRoot, "external", "sources", "ref___data"));
const clientRoot = path.resolve(process.env.SA_CLIENT_ASSET_ROOT || path.join(appRoot, "external", "sources", "client-assets"));
const mapRoot = path.join(refRoot, "map");
const npcRoot = path.join(refRoot, "npc");
const professionSkillPath = path.join(refRoot, "profession.txt");
const clientMapRoot = path.join(clientRoot, "map");
const publicMapRoot = path.join(appRoot, "public", "data", "maps");
const publicClientMapRoot = path.join(appRoot, "public", "data", "client-maps");
const worldOut = path.join(appRoot, "src", "world-data.js");
const closureManifestPath = path.join(appRoot, "docs", "planning", "classic-core-closure-manifest.json");
const gb18030 = new TextDecoder("gb18030");
const GMSV_DATA_SOURCE = "gmsv-data";
const CLIENT_ASSET_SOURCE = "client-assets";
const CONTENT_PROFILE = process.env.SA_CONTENT_PROFILE || "full-dev";
const CONTENT_PROFILE_INCLUDE_SOURCE_ONLY = process.env.SA_CONTENT_PROFILE_INCLUDE_SOURCE_ONLY === "1";
const DRY_RUN = process.env.SA_BUILD_WORLD_DRY_RUN === "1";

const START_FLOOR = 1000;
const MAX_MAPS = 300;
const ARENA_FLOORS = [
  130, 141, 142, 143, 144, 145, 146, 147,
  154, 155, 156, 157,
  1007, 1042, 2007, 3007, 4007,
  5032, 6032, 7006, 7007, 7032, 7532, 8032, 9032,
  20000
];
const ITEM_WARP_FLOORS = [
  3100, 3200, 3300, 3400, 5000, 5106, 7000
];
const LEGACY_GENERATED_FLOORS = [
  40, 119, 400, 811, 851, 10102, 10904, 10912, 11006
];
const FORCED_FLOORS = [
  100, 101, 120, 121, 122, 200, 601,
  ...ARENA_FLOORS,
  ...ITEM_WARP_FLOORS,
  ...LEGACY_GENERATED_FLOORS,
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
let professionSkillCatalogCache = null;
const npcWarpPoints = parseNpcWarpPoints();
const npcsByFloor = parseNpcs();
const contentProfile = loadContentProfile();
const selectedFloors = selectFloors();
const maps = {};

if (!DRY_RUN) {
  rmSync(publicMapRoot, { recursive: true, force: true });
  rmSync(publicClientMapRoot, { recursive: true, force: true });
  mkdirSync(publicMapRoot, { recursive: true });
  mkdirSync(publicClientMapRoot, { recursive: true });
}

for (const floor of selectedFloors) {
  const mapInfo = mapFiles.get(floor);
  if (!mapInfo) continue;
  const id = String(floor);
  const mapFile = `/data/maps/${floor}.ls2map`;
  const clientMapInfo = clientMapFile(floor);
  if (!DRY_RUN) {
    cpSync(mapInfo.file, path.join(publicMapRoot, `${floor}.ls2map`));
    if (clientMapInfo) cpSync(clientMapInfo.file, path.join(publicClientMapRoot, `${floor}.dat`));
  }
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
  for (const warp of [...(warps.get(floor) || []), ...(npcWarpPoints.get(floor) || [])]) {
    if (!maps[String(warp.toFloor)]) continue;
    const key = `${warp.x}:${warp.y}:${warp.toFloor}:${warp.toX}:${warp.toY}`;
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
    const scriptedWarp = cluster.find((item) => item.warp)?.warp || null;
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
      source: cluster.map((item) => item.source || `${GMSV_DATA_SOURCE}/map/mapwarp.txt`)
        .filter((source, index, list) => list.indexOf(source) === index)
        .join(" + "),
      ...(scriptedWarp ? { warp: scriptedWarp } : {})
    });
  }
}

applyProfileClosedExits(maps);

const quests = firstPlayableQuests(maps);
applyFirstPlayableQuestHooks(maps, quests);

const world = {
  source: {
    root: relativeRef(refRoot),
    maps: `${GMSV_DATA_SOURCE}/map/** LS2MAP`,
    clientMaps: "公益石器时代/map/*.dat",
    npcs: `${GMSV_DATA_SOURCE}/npc/**/*.create + .template + args/config`,
    warps: `${GMSV_DATA_SOURCE}/map/mapwarp.txt + npcgen_warp create points`,
    encounters: `${GMSV_DATA_SOURCE}/encount.txt`,
    contentProfile: contentProfile ? {
      id: contentProfile.id,
      closureManifest: "docs/planning/classic-core-closure-manifest.json",
      includeSourceOnly: CONTENT_PROFILE_INCLUDE_SOURCE_ONLY
    } : null
  },
  startMap: String(START_FLOOR),
  maps,
  quests
};

if (!DRY_RUN) writeFileSync(worldOut, `export const WORLD = ${JSON.stringify(world, null, 2)};\n`);
console.log(`${DRY_RUN ? "[dry-run] " : ""}Generated ${Object.keys(maps).length} maps${DRY_RUN ? "" : ` into ${path.relative(appRoot, worldOut)}`}`);
if (contentProfile) {
  const activeExitCount = Object.values(maps).reduce((sum, map) => sum + (map.exits || []).length, 0);
  const profileClosedExitCount = Object.values(maps).reduce((sum, map) => sum + (map.profileClosedExits || []).length, 0);
  console.log(`${DRY_RUN ? "[dry-run] " : ""}Content profile ${contentProfile.id}: manifest floors=${contentProfile.floorSet.size}, active exits=${activeExitCount}, profile-closed exits=${profileClosedExitCount}, closed warps=${contentProfile.closedWarps.length}, includeSourceOnly=${CONTENT_PROFILE_INCLUDE_SOURCE_ONLY}`);
}
if (!DRY_RUN) {
  console.log(`Copied LS2MAP files into ${path.relative(appRoot, publicMapRoot)}`);
  console.log(`Copied client DAT maps into ${path.relative(appRoot, publicClientMapRoot)}`);
}

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

function loadContentProfile() {
  if (!CONTENT_PROFILE || CONTENT_PROFILE === "full-dev") return null;
  if (!exists(closureManifestPath)) {
    throw new Error(`SA_CONTENT_PROFILE=${CONTENT_PROFILE} requires ${path.relative(appRoot, closureManifestPath)}. Run npm run closure:classic-core first.`);
  }
  const manifest = JSON.parse(readFileSync(closureManifestPath, "utf8"));
  const profile = (manifest.profiles || []).find((item) => item.id === CONTENT_PROFILE);
  if (!profile) {
    const known = (manifest.profiles || []).map((item) => item.id).join(", ");
    throw new Error(`Unknown SA_CONTENT_PROFILE=${CONTENT_PROFILE}. Known profiles: ${known || "(none)"}`);
  }
  const floors = [
    ...(profile.floors || []).map((item) => Number(item.floor)),
    ...(CONTENT_PROFILE_INCLUDE_SOURCE_ONLY ? (profile.sourceOnlyFloors || []).map((item) => Number(item.floor)) : [])
  ].filter((value) => Number.isFinite(value));
  return {
    id: profile.id,
    floorSet: new Set(floors),
    closedWarps: profile.closedWarps || []
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

function parseNpcWarpPoints() {
  const out = new Map();
  for (const file of walk(npcRoot).filter((item) => item.endsWith(".create"))) {
    const text = readText(file);
    for (const block of blocks(text)) {
      const kv = parseBlock(block);
      const floor = Number(kv.floorid);
      if (!Number.isFinite(floor)) continue;
      const pos = parsePos(kv.borncenter || kv.borncorner || kv.movecenter);
      if (!pos) continue;
      const enemy = parseEnemy(kv.enemy || "");
      const warp = npcWarpFromEnemy(enemy, file);
      if (!warp) continue;
      push(out, floor, {
        floor,
        x: pos[0],
        y: pos[1],
        ...warp,
        source: relativeRef(file)
      });
    }
  }
  return out;
}

function npcWarpFromEnemy(enemy, createFile) {
  if (!isNpcMapWarp(enemy.template)) return null;
  const numericTarget = enemy.parts.slice(1, 4).map((part) => Number(part));
  if (numericTarget.length >= 3 && numericTarget.every(Number.isFinite)) {
    return {
      toFloor: numericTarget[0],
      toX: numericTarget[1],
      toY: numericTarget[2]
    };
  }
  const scriptedWarp = readNpcWarp(enemy.argPath || "", createFile);
  if (!scriptedWarp?.target) return null;
  const target = {
    toFloor: Number(scriptedWarp.target.floor),
    toX: Number(scriptedWarp.target.x),
    toY: Number(scriptedWarp.target.y)
  };
  if (![target.toFloor, target.toX, target.toY].every(Number.isFinite)) return null;
  return {
    toFloor: target.toFloor,
    toX: target.toX,
    toY: target.toY,
    warp: scriptedWarp
  };
}

function isNpcMapWarp(template = "") {
  return /^npcgen_warp$/i.test(template);
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
      name: cleanName(rows[0]) || `enemy ${id}`,
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
      if (isNpcMapWarp(enemy.template)) {
        idCounter += 1;
        continue;
      }
      const template = templates.get(enemy.template) || {};
      const argPath = enemy.argPath || "";
      const functionset = template.functionset || enemy.template || "NPC";
      const dialogue = readNpcDialogue(argPath, file);
      const trade = readNpcTrade(argPath, file);
      const petShop = readNpcPetShop(argPath, file, functionset, enemy.template);
      const petFusion = readNpcPetFusion(argPath, file, functionset, enemy.template);
      const newNpcMan = readNpcNewNpcMan(argPath, file, functionset, enemy.template);
      const raceMan = readNpcRaceMan(argPath, file, functionset, enemy.template);
      const itemPoolShop = raceMan ? null : readNpcItemPoolShop(argPath, file, functionset, enemy.template);
      const routeService = readNpcRouteService(argPath, file, functionset, enemy.template, floor);
      const petSkillShop = readNpcPetSkillShop(argPath, file);
      const professionShop = readNpcProfessionShop(argPath, file, functionset, enemy.template);
      const itemChange = readNpcItemChange(argPath, file);
      const savePoint = readNpcSavePoint(argPath, file);
      const luckyMan = readNpcLuckyMan(argPath, file, functionset, enemy.template);
      const janken = readNpcJanken(argPath, file, functionset, enemy.template);
      const warp = readNpcWarp(argPath, file);
      const npcEnemy = readNpcEnemy(argPath, file, functionset);
      const scriptEvents = readNpcScriptEvents(argPath, file, functionset);
      const name = cleanName(kv.name || template.name || functionset);
      const scriptHints = npcScriptHints(argPath, file, npcEnemy, trade, warp, petSkillShop, professionShop, itemChange, savePoint, petShop, itemPoolShop, routeService, luckyMan, janken, raceMan, petFusion, newNpcMan);
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
        ...(petShop ? { petShop } : {}),
        ...(petFusion ? { petFusion } : {}),
        ...(newNpcMan ? { newNpcMan } : {}),
        ...(itemPoolShop ? { itemPoolShop } : {}),
        ...(raceMan ? { raceMan } : {}),
        ...(routeService ? { routeService } : {}),
        ...(petSkillShop ? { petSkillShop } : {}),
        ...(professionShop ? { professionShop } : {}),
        ...(itemChange ? { itemChange } : {}),
        ...(savePoint ? { savePoint } : {}),
        ...(luckyMan ? { luckyMan } : {}),
        ...(janken ? { janken } : {}),
        ...(warp ? { warp } : {}),
        ...(npcEnemy ? { npcEnemy } : {}),
        ...(scriptEvents?.length ? { scriptEvents } : {}),
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
    const damageBreak = Number(cols[23]) || 0;
    const item = {
      id,
      name: cleanName(cols[0]) || `item ${id}`,
      secretName: cleanName(cols[1]) || "",
      description: cleanName(cols[2]) || "",
      option: cleanName(cols[3]) || "",
      functionName: cleanName(cols[10]) || "",
      image: Number(cols[17]) || 0,
      cost: Number(cols[18]) || 0,
      type: Number(cols[19]) || 0,
      useField: Number(cols[20]) || 0,
      target: Number(cols[21]) || 0,
      level: Number(cols[22]) || 0
    };
    if (damageBreak > 0) {
      item.damageBreak = damageBreak;
      item.maxUses = damageBreak;
    }
    out.set(id, item);
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
  if (contentProfile) {
    return [...contentProfile.floorSet, START_FLOOR]
      .filter((floor) => mapFiles.has(floor))
      .filter((floor, index, list) => list.indexOf(floor) === index)
      .sort((a, b) => a - b);
  }
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

function applyProfileClosedExits(maps) {
  if (!contentProfile) return;
  const selected = new Set(Object.keys(maps));
  for (const floorText of selected) {
    const floor = Number(floorText);
    const map = maps[floorText];
    const closedSourceWarps = (warps.get(floor) || []).filter((warp) => !selected.has(String(warp.toFloor)) && mapFiles.has(warp.toFloor));
    if (!closedSourceWarps.length) continue;
    const closedExits = [];
    const seen = new Set();
    for (const cluster of clusterWarps(closedSourceWarps)) {
      const warp = cluster[0];
      const target = mapFiles.get(warp.toFloor);
      const targetName = cleanName(target?.name) || `floor ${warp.toFloor}`;
      const bounds = boundsFor(cluster);
      const marker = centerFor(cluster);
      const targetPoint = centerFor(cluster.map((item) => ({ x: item.toX, y: item.toY })));
      const key = `${warp.toFloor}:${bounds.minX}:${bounds.minY}:${bounds.maxX}:${bounds.maxY}`;
      if (seen.has(key)) continue;
      seen.add(key);
      closedExits.push({
        id: `closed-${warp.toFloor}-${closedExits.length}`,
        label: `去 ${targetName}`,
        detail: `${targetName} | floor ${warp.toFloor} | ${formatExitBounds(bounds, cluster.length)} | classic-core 暂未开放`,
        to: String(warp.toFloor),
        toName: targetName,
        x: marker.x,
        y: marker.y,
        bounds: [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY],
        target: [targetPoint.x, targetPoint.y],
        tiles: cluster.map((item) => ({
          x: item.x,
          y: item.y,
          target: [item.toX, item.toY]
        })),
        source: `${GMSV_DATA_SOURCE}/map/mapwarp.txt`,
        status: "closed-or-hidden-until-profile-enabled",
        reason: `${CONTENT_PROFILE} profile 未启用 ${targetName}`
      });
    }
    if (closedExits.length) {
      map.profileClosedExits = closedExits.sort((a, b) => a.y - b.y || a.x - b.x || a.to.localeCompare(b.to));
    }
  }
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
      playerFacing: false,
      contentProfile: "full-dev",
      stagedReason: "非核心竞技场/英雄战场地图采样任务；按 classic-core 策略不自动给玩家。",
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
    if (quest.playerFacing === false) continue;
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
  const entries = expandShopItemEntries(itemSpec, {
    changeItemCostSpec: kv.changeitemcost || "",
    costFameSpec: kv.costfame || "",
    costPointSpec: kv.costpoint || ""
  });
  const limitItemRanges = parseItemRanges(kv.limititemno || "", 2000);
  const limitItemTypes = splitWords(kv.limititemtype)
    .map((item) => item.toUpperCase())
    .filter((item) => item && item !== "TRUE");
  const specialItems = expandItemList(kv.special_item || "");
  const specialRate = Number(kv.special_rate);
  const buyRate = Number(kv.buy_rate || 1) || 1;
  const sellRate = Number(kv.sell_rate || 0) || 0;
  const noteMessage = cleanName(kv.msg || "");
  const items = [];
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.id)) continue;
    const item = itemDb.get(entry.id);
    if (!item) continue;
    seen.add(entry.id);
    const sourceCost = Number(item.cost || 0);
    const priceBase = entry.changeItemCost == null ? sourceCost : entry.changeItemCost;
    items.push({
      ...item,
      price: Math.max(0, Math.round(priceBase * buyRate)),
      ...(entry.changeItemCost == null ? {} : { changeItemCost: entry.changeItemCost, sourceCost }),
      ...(Number(entry.costFame || 0) > 0 ? { costFame: entry.costFame } : {}),
      ...(Number(entry.costPoint || 0) > 0 ? { costPoint: entry.costPoint } : {})
    });
  }
  if (!items.length) return null;
  return {
    kind: "shop",
    source: relativeRef(file),
    buyRate,
    sellRate,
    buyWords: splitWords(kv.buy_msg),
    sellWords: splitWords(kv.sell_msg),
    mainMessage: cleanName(kv.main_msg || kv.buy_main || ""),
    ...(noteMessage ? { noteMessage } : {}),
    ...(limitItemRanges.length ? { limitItemRanges } : {}),
    ...(limitItemTypes.length ? { limitItemTypes: [...new Set(limitItemTypes)] } : {}),
    ...(specialItems.length ? { specialItems: specialItems.slice(0, 120) } : {}),
    ...(Number.isFinite(specialRate) ? { specialRate } : {}),
    ...(items.some((item) => item.changeItemCost != null) ? { hasChangeItemCost: true } : {}),
    ...(items.some((item) => Number(item.costFame || 0) > 0) ? { hasCostFame: true } : {}),
    ...(items.some((item) => Number(item.costPoint || 0) > 0) ? { hasCostPoint: true } : {}),
    items: items.slice(0, 40)
  };
}

function readNpcPetSkillShop(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const kv = parseColonFile(readText(file));
  const skillIds = expandItemList(kv.pet_skill || "", 80).filter((id) => Number(id) > 0);
  if (!skillIds.length) return null;
  const skillRate = Number(kv.skill_rate || 1) || 1;
  return {
    kind: /free/i.test(`${argPath} ${relativeRef(file)}`) ? "free-pet-skill" : "pet-skill",
    source: relativeRef(file),
    skillRate,
    skillIds,
    mainMessage: cleanName(kv.main_msg || kv.start_msg || ""),
    errorMessage: cleanName(kv.err_msg || kv.nothing_msg || ""),
    startMessage: cleanName(kv.start_msg || ""),
    nothingMessage: cleanName(kv.nothing_msg || "")
  };
}

function readNpcProfessionShop(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const serviceText = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  if (!/ProfessionShop|Profession/i.test(serviceText) && !/^\s*profession_skill\s*:/im.test(text)) {
    return null;
  }
  const kv = parseColonFile(text);
  const skillIds = expandItemList(kv.profession_skill || "", 120).filter((id) => Number(id) > 0);
  if (!skillIds.length) return null;
  const catalog = readProfessionSkillCatalog();
  const skillRate = Number(kv.skill_rate || 1) || 1;
  const classId = Math.max(0, Number(kv.profession_class || 0) || 0);
  const transRequirements = expandItemList(kv.trans || "", 20).filter((id) => Number.isFinite(Number(id)));
  const minTrans = transRequirements.length ? Number(transRequirements[0]) || 0 : 0;
  const skills = skillIds.map((id) => catalog.get(Number(id)) || professionSkillFallback(id));
  return {
    kind: "profession-skill",
    source: relativeRef(file),
    skillRate,
    classId,
    className: professionClassName(classId),
    transRequirements,
    minTrans,
    skillIds,
    skills,
    mainMessage: cleanName(kv.main_msg || kv.start_msg || ""),
    startMessage: cleanName(kv.start_msg || ""),
    nothingMessage: cleanName(kv.nothing_msg || ""),
    errorMessage: cleanName(kv.err_msg || kv.nothing_msg || ""),
    transMessage: cleanName(kv.trans_msg || "")
  };
}

function readProfessionSkillCatalog() {
  if (professionSkillCatalogCache) return professionSkillCatalogCache;
  const out = new Map();
  if (!exists(professionSkillPath)) {
    professionSkillCatalogCache = out;
    return out;
  }
  for (const line of readText(professionSkillPath).split(/\r?\n/)) {
    const skill = parseProfessionSkillLine(line);
    if (skill) out.set(skill.id, skill);
  }
  professionSkillCatalogCache = out;
  return out;
}

function parseProfessionSkillLine(line) {
  const raw = String(line || "").trim();
  if (!raw || raw.startsWith("#")) return null;
  const cols = raw.split(",");
  if (cols.length < 15) return null;
  const id = Number(cols[4]);
  if (!Number.isFinite(id) || id <= 0) return null;
  const professionClass = Number(cols[5]) || 0;
  const prerequisites = [];
  for (let index = 15; index <= 21; index += 2) {
    const skillId = Number(cols[index] || 0);
    const percent = Number(cols[index + 1] || 0);
    if (skillId > 0) {
      prerequisites.push({
        skillId,
        percent: Math.max(0, percent || 0)
      });
    }
  }
  return {
    id,
    name: cleanName(cols[0]) || `职业技能 ${id}`,
    description: cleanName(cols[1]) || "",
    func: cleanName(cols[2]) || "",
    option: String(cols[3] || "").trim(),
    professionClass,
    professionClassName: professionClassName(professionClass),
    target: Number(cols[6]) || 0,
    costMp: Number(cols[7]) || 0,
    useFlag: Number(cols[8]) || 0,
    kind: Number(cols[9]) || 0,
    icon: Number(cols[10]) || 0,
    imageBefore: Number(cols[11]) || 0,
    imageAfter: Number(cols[12]) || 0,
    sourceCost: Math.max(0, Number(cols[13]) || 0),
    fixValue: Number(cols[14]) || 0,
    prerequisites,
    source: `${GMSV_DATA_SOURCE}/profession.txt`
  };
}

function professionSkillFallback(id) {
  const skillId = Number(id);
  return {
    id: skillId,
    name: `职业技能 ${skillId}`,
    description: "",
    func: "",
    option: "",
    professionClass: 0,
    professionClassName: "未知",
    target: 0,
    costMp: 0,
    useFlag: 0,
    kind: 0,
    icon: 0,
    imageBefore: 0,
    imageAfter: 0,
    sourceCost: 0,
    fixValue: 0,
    prerequisites: [],
    source: `${GMSV_DATA_SOURCE}/profession.txt`
  };
}

function professionClassName(id) {
  const value = Number(id) || 0;
  if (value === 1) return "战士";
  if (value === 2) return "魔法师";
  if (value === 3) return "追猎者";
  if (value === 4) return "通用";
  return "未转职";
}

function readNpcPetShop(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  if (!/npcgen_petshop|PetShop/i.test(`${functionset} ${template} ${argPath}`) && !/^\s*(?:pool_flg|pool_cost|special_pet|pooltanks_msg|getfull_msg)\s*:/im.test(text)) {
    return null;
  }
  const kv = parseColonFile(text);
  const poolEnabled = Number(kv.pool_flg || 0) === 1;
  const poolCost = Math.max(1, Number(kv.pool_cost || 200) || 200);
  const normalRate = positiveRate(kv.nomal_rate ?? kv.normal_rate, 1);
  const specialRate = positiveRate(kv.special_rate, 1.2);
  const specialPetImages = parseNumericRanges(kv.special_pet || "", 120);
  return {
    kind: poolEnabled ? "pet-pool" : "pet-shop",
    source: relativeRef(file),
    poolEnabled,
    poolCost,
    normalRate,
    specialRate,
    specialPetImages,
    supports: {
      sell: true,
      deposit: poolEnabled,
      withdraw: poolEnabled
    },
    messages: {
      main: cleanScriptText(kv.main_msg || ""),
      confirm: cleanScriptText(kv.realy_msg || kv.really_msg || ""),
      over: cleanScriptText(kv.over_msg || ""),
      thanks: cleanScriptText(kv.thanks_msg || ""),
      cost: cleanScriptText(kv.cost_msg || ""),
      poolThanks: cleanScriptText(kv.pooltanks_msg || kv.poolthanks_msg || ""),
      poolFull: cleanScriptText(kv.poolfull_msg || ""),
      getFull: cleanScriptText(kv.getfull_msg || "")
    }
  };
}

function readNpcPetFusion(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const serviceText = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  if (!/npc_petfusion|PetFusion|petfusion/i.test(serviceText) && !/^\s*ADDEGGID\s*:/im.test(text)) {
    return null;
  }
  const eggEnemyIds = [...new Set(parseRepeatedColonValues(text, "ADDEGGID")
    .flatMap(parsePetFusionEggIds)
    .filter((id) => Number.isFinite(id) && id > 0))];
  if (!eggEnemyIds.length) return null;
  const kv = parseColonFile(text);
  return {
    kind: "pet-fusion",
    source: relativeRef(file),
    free: cleanScriptText(kv.free || ""),
    primaryEggEnemyId: eggEnemyIds[0],
    eggEnemyIds,
    eggs: eggEnemyIds.map(compactScriptEnemy).filter(Boolean),
    messages: {
      start: cleanScriptText(kv.startmsg || ""),
      select: cleanScriptText(kv.selectmsg || "")
    }
  };
}

function readNpcNewNpcMan(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const serviceText = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  if (!/npc_newnpcman|NPC_NewNpcMan/i.test(serviceText) && !/^\s*CHECK_MSG\s*:/im.test(text)) {
    return null;
  }
  const kv = parseColonFile(text);
  const start = cleanScriptText(kv.start_msg || kv.startmsg || "");
  const check = cleanScriptText(kv.check_msg || kv.checkmsg || "");
  if (!start && !check) return null;
  return {
    kind: "new-npc-man",
    source: relativeRef(file),
    messages: {
      start,
      check
    },
    appearanceRestore: true
  };
}

function parseRepeatedColonValues(text, key) {
  const values = [];
  const pattern = new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`, "gim");
  let match;
  while ((match = pattern.exec(String(text || ""))) !== null) {
    values.push(trimInlineValue(match[1] || ""));
  }
  return values;
}

function parsePetFusionEggIds(value = "") {
  return String(value || "")
    .split(",")
    .map((part) => Number(String(part || "").trim().split(/[;|\s]+/)[0]))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function readNpcItemPoolShop(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const serviceText = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  const explicitPoolNpc = /PoolItemShop|npcgen_poolitemshop/i.test(serviceText);
  const hasPoolActions = /^\s*(?:pool_main|draw_main)\s*:/im.test(text);
  const hasPoolCostAndLimit = /^\s*cost\s*:/im.test(text) && /^\s*(?:poolfull_msg|itemfull_msg)\s*:/im.test(text);
  if (!explicitPoolNpc && !hasPoolActions && !hasPoolCostAndLimit) {
    return null;
  }
  const kv = parseColonFile(text);
  const cost = Number(kv.cost);
  return {
    kind: "item-pool",
    source: relativeRef(file),
    cost: Math.max(0, Number.isFinite(cost) ? cost : 200),
    supports: {
      deposit: true,
      withdraw: true
    },
    messages: {
      main: cleanScriptText(kv.main_msg || ""),
      pool: cleanScriptText(kv.pool_main || ""),
      draw: cleanScriptText(kv.draw_main || ""),
      confirm: cleanScriptText(kv.realy_msg || kv.really_msg || ""),
      stone: cleanScriptText(kv.stone_msg || ""),
      poolFull: cleanScriptText(kv.poolfull_msg || ""),
      itemFull: cleanScriptText(kv.itemfull_msg || "")
    }
  };
}

function readNpcRaceMan(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const serviceText = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  if (!/npc_raceman|Raceman|\/race2?\//i.test(serviceText)) return null;
  const kv = parseColonFile(readText(file));
  const modes = [];
  const history = [];
  for (let index = 1; index <= 5; index += 1) {
    const mode = cleanRaceToken(kv[`mode${index}`]);
    if (mode) modes.push({ index, code: mode });
    const historyCode = cleanRaceToken(kv[`history${index}`]);
    if (historyCode) history.push({ index, code: historyCode });
  }
  const rewards = {
    first: raceRewardItems(kv.first, 1),
    second: raceRewardItems(kv.second, 1),
    third: raceRewardItems(kv.third, 1),
    normal: raceRewardItems(kv.normal, 12)
  };
  return {
    kind: "race-man",
    source: relativeRef(file),
    hasGame: positiveNumber(kv.hasgame),
    gameMode: positiveNumber(kv.gamemode),
    gameCode: cleanRaceToken(kv.gamecode),
    modes,
    history,
    rankNum: positiveNumber(kv.ranknum),
    lowLevel: positiveNumber(kv.lowlevel),
    fornewLv: positiveNumber(kv.fornewlv),
    fornewTran: cleanRaceToken(kv.fornewtran),
    delFlag: cleanRaceToken(kv.delflag),
    endFlag: cleanRaceToken(kv.endflag),
    requiredItem: raceSingleItem(kv.checkitem),
    rewardItem: raceSingleItem(kv.getitem),
    requiredPetId: positiveNumber(kv.checkpet),
    petLevel: positiveNumber(kv.petlevel),
    rewards,
    messages: {
      subject: cleanScriptText(kv.subject_msg || ""),
      time: cleanScriptText(kv.time_msg || ""),
      card: cleanScriptText(kv.card_msg || ""),
      caution: cleanScriptText(kv.caution_msg || ""),
      itemFull: cleanScriptText(kv.itemfull_msg || ""),
      hadItem: cleanScriptText(kv.haditem_msg || ""),
      nonItem: cleanScriptText(kv.nonitem_msg || ""),
      notEnd: cleanScriptText(kv.notend_msg || ""),
      wrongAnswer: cleanScriptText(kv.wrongans_msg || ""),
      fmLeader: cleanScriptText(kv.fmleader_msg || ""),
      notNew: cleanScriptText(kv.notnew_msg || ""),
      repeat: cleanScriptText(kv.repeat_msg || ""),
      thanks: [
        cleanScriptText(kv.thanks1_msg || ""),
        cleanScriptText(kv.thanks2_msg || ""),
        cleanScriptText(kv.thanks3_msg || ""),
        cleanScriptText(kv.thanks_msg || "")
      ].filter(Boolean)
    }
  };
}

function cleanRaceToken(value = "") {
  return cleanScriptText(value).replace(/\s+/g, " ").trim();
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function raceSingleItem(value = "") {
  const id = Number(String(value || "").split(/[,\s]+/).find(Boolean));
  return Number.isFinite(id) && id > 0 ? compactScriptItem(id) : null;
}

function raceRewardItems(value = "", limit = 12) {
  return String(value || "")
    .split(",")
    .map((part) => compactScriptItem(Number(part.trim())))
    .filter(Boolean)
    .slice(0, limit);
}

function readNpcRouteService(argPath, createFile, functionset = "", template = "", floor = 0) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const kv = parseColonFile(text);
  const routeCount = Math.max(0, Number(kv.routenum || 0) || 0);
  if (!routeCount || !kv.routeto1) return null;
  const routeKind = routeServiceKind(`${functionset} ${template} ${argPath} ${relativeRef(file)}`);
  const routes = [];
  for (let index = 1; index <= routeCount; index += 1) {
    const points = parseNpcRoutePoints(kv[`routeto${index}`] || "", floor);
    if (!points.length) continue;
    const target = routeTargetFromPoints(points);
    routes.push({
      index,
      name: cleanScriptText(kv[`routename${index}`] || "") || `路线 ${index}`,
      points: compactNpcRoutePoints(points),
      target,
      stepCount: points.length
    });
  }
  if (!routes.length) return null;
  return {
    kind: routeKind,
    source: relativeRef(file),
    routeCount,
    routes,
    needStone: Math.max(0, Number(kv.needstone || 0) || 0),
    deniedItems: expandItemList(kv.denieditem || "", 80).filter((id) => Number(id) > 0),
    waitTime: Math.max(0, Number(kv.waittime || 0) || 0),
    oneWay: Number(kv.oneway ?? 1) === 1,
    messages: {
      gettingOn: cleanScriptText(kv.msg_gettingon || ""),
      notParty: cleanScriptText(kv.msg_notparty || ""),
      overParty: cleanScriptText(kv.msg_overparty || ""),
      deniedItem: cleanScriptText(kv.msg_denieditem || ""),
      stone: cleanScriptText(kv.msg_stone || ""),
      start: cleanScriptText(kv.msg_start || ""),
      end: cleanScriptText(kv.msg_end || "")
    }
  };
}

function routeServiceKind(text) {
  if (/airplane|npc_airplane|飞机|飛機/i.test(text)) return "airplane-route";
  if (/bus|npc_bus|客运|客運|巴士/i.test(text)) return "bus-route";
  return "route-service";
}

function parseNpcRoutePoints(value = "", floor = 0) {
  const defaultMapId = String(Number(floor) || floor || "");
  return String(value || "")
    .split(";")
    .map((entry) => {
      const nums = entry.split(",").map((part) => Number(part.trim())).filter((num) => Number.isFinite(num));
      if (nums.length >= 3) return { mapId: String(nums[0]), x: nums[1], y: nums[2] };
      if (nums.length >= 2 && defaultMapId) return { mapId: defaultMapId, x: nums[0], y: nums[1] };
      return null;
    })
    .filter((point) => point && point.mapId !== "0" && Number.isFinite(point.x) && Number.isFinite(point.y));
}

function routeTargetFromPoints(points = []) {
  const target = [...points].reverse().find((point) => point?.mapId && point.mapId !== "0");
  return target ? { mapId: target.mapId, x: target.x, y: target.y } : null;
}

function compactNpcRoutePoints(points = []) {
  if (points.length <= 12) return points;
  return [
    ...points.slice(0, 6),
    ...points.slice(-6)
  ];
}

function positiveRate(value, fallback) {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : fallback;
}

function parseNumericRanges(value = "", maxItems = 120) {
  return String(value || "")
    .split(",")
    .map((part) => {
      const text = part.trim();
      if (!text) return null;
      const range = text.match(/^(\d+)\s*-\s*(\d+)$/);
      if (range) {
        const a = Number(range[1]);
        const b = Number(range[2]);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
        return [Math.min(a, b), Math.max(a, b)];
      }
      const id = Number(text);
      return Number.isFinite(id) && id > 0 ? [id, id] : null;
    })
    .filter(Boolean)
    .slice(0, maxItems);
}

function readNpcItemChange(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  if (!/^\s*(?:CHANGEITEM|NeedItem|AddItem|DelItem|DelGold)\s*:/im.test(text) || !blocks(text).length) return null;
  const kv = parseColonFile(text);
  const recipes = blocks(text)
    .map((rawBlock, index) => parseNpcItemChangeRecipe(rawBlock, file, index))
    .filter(Boolean)
    .slice(0, 120);
  if (!recipes.length) return null;
  return {
    kind: "item-change",
    source: relativeRef(file),
    startMessage: cleanScriptText(kv.start_msg || kv.startmsg || ""),
    menuHead: cleanScriptText(kv.menuhead || ""),
    needHead: cleanScriptText(kv.needhead || ""),
    failMessage: cleanScriptText(kv.fail_msg || kv.failmsg || ""),
    recipes
  };
}

function parseNpcItemChangeRecipe(rawBlock, file, index) {
  const kv = parseColonFile(rawBlock);
  const needItems = itemSpecsWithNames(countNeedItemSpecs(kv.needitem || ""));
  const delItems = itemSpecsWithNames(parseScriptItemSpecs(kv.delitem || "").filter((item) => !item.evdel));
  const addItems = itemSpecsWithNames(parseScriptItemSpecs(kv.additem || kv.getitem || "").filter((item) => !item.evdel));
  const changeItemId = Number(kv.changeitem || addItems[0]?.id || 0);
  const displayItem = compactScriptItem(changeItemId);
  const resultItems = addItems.length
    ? addItems
    : (displayItem ? [{ ...displayItem, qty: 1 }] : []);
  const requirements = delItems.length ? delItems : needItems;
  if (!changeItemId && !resultItems.length && !requirements.length) return null;
  return {
    index,
    changeItemId: changeItemId || resultItems[0]?.id || 0,
    changeItemName: cleanScriptText(kv.changemsg || "") || displayItem?.name || resultItems[0]?.name || `配方 ${index + 1}`,
    changeMsg: cleanScriptText(kv.changemsg || ""),
    needMsg: cleanScriptText(kv.needmsg || ""),
    needItems,
    delItems: requirements,
    addItems: resultItems,
    delGold: Math.max(0, Number(kv.delgold || kv.delstone || 0) || 0),
    free: cleanName(kv.free || ""),
    source: `${relativeRef(file)}#${index + 1}`
  };
}

function readNpcSavePoint(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const kv = parseColonFile(text);
  if (!kv.born) return null;
  const bornParts = String(kv.born || "")
    .split(",")
    .map((part) => Number(part.trim()));
  const hasBorn = bornParts.length >= 3 && bornParts.slice(0, 3).every((value) => Number.isFinite(value));
  const requiredAlternatives = parseSavePointRequirementAlternatives(kv.getitem || "");
  return {
    kind: "savepoint",
    source: relativeRef(file),
    id: Number(kv.id || 0) || 0,
    ...(hasBorn ? {
      born: {
        mapId: String(bornParts[0]),
        floor: bornParts[0],
        x: bornParts[1],
        y: bornParts[2]
      }
    } : {}),
    noItem: /\bNOITEM\b/i.test(text),
    ...(requiredAlternatives.length ? { requiredAlternatives } : {}),
    messages: {
      normal: cleanScriptText(kv.nomalmsg || kv.normalmsg || ""),
      request: cleanScriptText(kv.requestmsg || ""),
      ok: cleanScriptText(kv.okmsg || ""),
      confirm: cleanScriptText(kv.realymsg || kv.reallymsg || "")
    }
  };
}

function readNpcLuckyMan(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  if (!/LuckyMan|luckyman/i.test(`${functionset} ${template} ${argPath} ${relativeRef(file)}`)
    && !/^\s*luck[1-5]\s*:/im.test(text)) {
    return null;
  }
  const kv = parseColonFile(text);
  const luckMessages = {};
  for (let index = 1; index <= 5; index += 1) {
    const messages = splitScriptMessageChoices(kv[`luck${index}`] || "");
    if (messages.length) luckMessages[index] = messages;
  }
  if (!Object.keys(luckMessages).length) return null;
  return {
    kind: "lucky-man",
    source: relativeRef(file),
    stoneExpr: cleanName(kv.stone || "0"),
    mainMessage: cleanName(String(kv.main_msg || "").replace(/\\n/g, "\n")),
    noMoneyMessage: cleanScriptText(kv.nomoney || ""),
    luckMessages
  };
}

function readNpcJanken(argPath, createFile, functionset = "", template = "") {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return null;
  const text = readText(file);
  const identity = `${functionset} ${template} ${argPath} ${relativeRef(file)}`;
  if (!/Janken|npcgen_janken|\/jan_/i.test(identity)
    && !/^\s*(WinWarp|LoseWarp)\s*:/im.test(text)) {
    return null;
  }
  const kv = parseColonFile(text);
  const entryItems = parseScriptItemSpecs(kv.entryitem || "").map(withScriptItemName);
  const winItems = parseScriptItemSpecs(kv.winitem || "").map(withScriptItemName);
  const loseItems = parseScriptItemSpecs(kv.loseitem || "").map(withScriptItemName);
  const winWarp = parseJankenWarp(kv.winwarp || "");
  const loseWarp = parseJankenWarp(kv.losewarp || "");
  if (!entryItems.length && !winWarp && !loseWarp && !winItems.length && !loseItems.length) return null;
  return {
    kind: "janken",
    source: relativeRef(file),
    mainMessage: cleanScriptText(kv.mainmsg || kv.main_msg || ""),
    noItemMessage: cleanScriptText(kv.noitem || kv.nonitem_msg || ""),
    entryItems,
    winWarp,
    loseWarp,
    ...(winItems.length ? { winItems } : {}),
    ...(loseItems.length ? { loseItems } : {})
  };
}

function parseJankenWarp(value = "") {
  const parts = String(value || "").split(",").map((part) => Number(part.trim()));
  if (parts.length < 3 || parts.some((part) => !Number.isFinite(part))) return null;
  const [floor, x, y] = parts;
  if (floor <= 0) return null;
  return { mapId: String(floor), floor, x, y };
}

function splitScriptMessageChoices(value = "") {
  return String(value || "")
    .split(",")
    .map((part) => cleanScriptText(part))
    .filter(Boolean)
    .slice(0, 16);
}

function parseSavePointRequirementAlternatives(value = "") {
  return String(value || "")
    .split(",")
    .map((alternative) => alternative
      .split("&")
      .map((part) => {
        const match = part.trim().match(/^(\d+)(?:\*(\d+))?$/);
        if (!match) return null;
        const item = compactScriptItem(Number(match[1]));
        if (!item) return null;
        return { ...item, qty: Math.max(1, Number(match[2] || 1)) };
      })
      .filter(Boolean))
    .filter((items) => items.length)
    .slice(0, 16);
}

function readNpcScriptEvents(argPath, createFile, functionset) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return [];
  const text = readText(file);
  const isChangeEvent = /changeevent|exchange|event/i.test(`${functionset} ${argPath} ${text.slice(0, 240)}`);
  const events = [];
  if (isChangeEvent && /^\s*EventNo\s*:/im.test(text) && /^\s*TYPE\s*:/im.test(text)) {
    for (const rawBlock of text.split(/^\s*EventEnd\s*$/gim)) {
      const event = parseNpcScriptEventBlock(rawBlock, file);
      if (event) events.push(event);
      if (events.length >= 16) break;
    }
  }
  if (events.length < 16 && /^\s*FREE\s*:/im.test(text) && /^\s*OVER\s*$/im.test(text)) {
    events.push(...parseNpcFreeScriptEvents(text, file).slice(0, 16 - events.length));
  }
  return events;
}

function parseNpcScriptEventBlock(rawBlock, file) {
  const event = {
    source: relativeRef(file),
    messages: {},
    messagePages: {},
    getItems: [],
    delItems: [],
    getRandItems: [],
    getStones: [],
    delStones: [],
    npcWarps: [],
    charms: [],
    notDelItems: [],
    cleanFlags: [],
    nowSetFlags: [],
    endSetFlags: [],
    addExps: 0
  };
  const getPets = [];
  const rawDelPetSpecs = [];
  for (const raw of String(rawBlock || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (key === "eventno") {
      event.eventNo = Number(value);
      continue;
    }
    if (key === "type") {
      event.type = cleanName(value).toUpperCase();
      continue;
    }
    if (key === "event") {
      event.condition = cleanName(value);
      continue;
    }
    if (key === "keyword") {
      event.keyword = cleanName(value);
      continue;
    }
    if (key === "pet_name" || key === "petname") {
      event.petName = cleanName(value);
      continue;
    }
    if (key === "getitem" || key === "giveitem") {
      event.getItems.push(...parseScriptItemSpecs(value));
      continue;
    }
    if (key === "additem") {
      event.getItems.push(...parseScriptItemSpecs(value).map((item) => ({ ...item, scriptAction: "AddItem" })));
      continue;
    }
    if (key === "delitem") {
      event.delItems.push(...parseScriptItemSpecs(value));
      continue;
    }
    if (key === "getranditem") {
      event.getRandItems.push(...parseScriptRandomItemSpecs(value));
      continue;
    }
    if (key === "getstone" || key === "getgold") {
      event.getStones.push(...parseScriptStoneSpecs(value));
      continue;
    }
    if (key === "delstone" || key === "delgold") {
      event.delStones.push(...parseScriptStoneSpecs(value));
      continue;
    }
    if (key === "addgold") {
      event.getStones.push(...parseScriptStoneSpecs(value).map((stone) => ({ ...stone, source: "AddGold" })));
      continue;
    }
    if (key === "addexps" || key === "addexp") {
      event.addExps = Number(value) || 0;
      continue;
    }
    if (key === "npcwarp") {
      event.npcWarps.push(...parseScriptNpcWarpSpecs(value));
      continue;
    }
    if (key === "npcpoint" || key === "npc_point") {
      event.npcWarps.push(...parseScriptNpcPointSpecs(value));
      continue;
    }
    if (key === "charm") {
      event.charms.push(...splitNumberList(value));
      continue;
    }
    if (key === "notdel" || key === "notdelitem") {
      event.notDelItems.push(...splitNumberList(value));
      continue;
    }
    if (key === "getpet" || key === "addpet") {
      getPets.push(...parseScriptGetPetSpecs(value, key === "addpet" ? "AddPet" : "GetPet"));
      continue;
    }
    if (key === "delpet") {
      rawDelPetSpecs.push(value);
      continue;
    }
    if (key === "endsetflg" || key === "endsetflag") {
      event.endSetFlags.push(...splitNumberList(value));
      continue;
    }
    if (key === "nowsetflg" || key === "nowsetflag" || key === "event_now" || key === "eventnow") {
      event.nowSetFlags.push(...splitNumberList(value));
      continue;
    }
    if (key === "cleanflg" || key === "cleanflag") {
      event.cleanFlags.push(...splitNumberList(value));
      continue;
    }
    if (key === "missionover") {
      event.missionOver = Number(value) || 0;
      continue;
    }
    if (key === "missionclean") {
      event.missionClean = Number(value) || 0;
      continue;
    }
    const messageSpec = npcScriptMessageSpec(key);
    if (messageSpec) {
      const message = cleanScriptText(value);
      if (messageSpec.page > 0) {
        event.messagePages[messageSpec.key] ||= [];
        event.messagePages[messageSpec.key][messageSpec.page - 1] = message;
      } else {
        event.messages[messageSpec.key] = message;
      }
    }
  }
  return finalizeNpcScriptEvent(event, getPets, rawDelPetSpecs);
}

function parseNpcFreeScriptEvents(text, file) {
  const events = [];
  let event = null;
  let getPets = [];
  let rawDelPetSpecs = [];

  const startEvent = (label = "") => {
    event = {
      source: relativeRef(file),
      eventNo: -1,
      type: "MESSAGE",
      condition: "",
      messages: {},
      messagePages: {},
      getItems: [],
      delItems: [],
      getRandItems: [],
      getStones: [],
      delStones: [],
      npcWarps: [],
      charms: [],
      notDelItems: [],
      cleanFlags: [],
      nowSetFlags: [],
      endSetFlags: [],
      addExps: 0,
      fallback: /^NOFREE$/i.test(label)
    };
    getPets = [];
    rawDelPetSpecs = [];
  };

  const finishEvent = () => {
    if (!event) return;
    const out = finalizeNpcScriptEvent(event, getPets, rawDelPetSpecs);
    if (out) events.push(out);
    event = null;
    getPets = [];
    rawDelPetSpecs = [];
  };

  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (/^OVER$/i.test(line)) {
      finishEvent();
      continue;
    }
    const eventStart = line.match(/^(?:NOFREE|TALKEVENT\d*|TALKRUN\d*|EVENTRUN\d*|EVENT\d*)$/i);
    if (eventStart) {
      finishEvent();
      startEvent(eventStart[0]);
      continue;
    }
    if (!event) continue;
    const index = line.indexOf(":");
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (key === "freemsg") {
      event.messages.normal = cleanScriptText(value);
      continue;
    }
    if (key === "free" || key.startsWith("free")) {
      event.condition = cleanName(value);
      continue;
    }
    if (key === "getitem" || key === "giveitem") {
      event.getItems.push(...parseScriptItemSpecs(value));
      continue;
    }
    if (key === "additem") {
      event.getItems.push(...parseScriptItemSpecs(value).map((item) => ({ ...item, scriptAction: "AddItem" })));
      continue;
    }
    if (key === "delitem") {
      event.delItems.push(...parseScriptItemSpecs(value));
      continue;
    }
    if (key === "getranditem") {
      event.getRandItems.push(...parseScriptRandomItemSpecs(value));
      continue;
    }
    if (key === "getstone" || key === "getgold" || key === "addgold") {
      const isAddGold = key === "addgold";
      event.getStones.push(...parseScriptStoneSpecs(value).map((stone) => isAddGold ? { ...stone, source: "AddGold" } : stone));
      continue;
    }
    if (key === "delstone" || key === "delgold") {
      event.delStones.push(...parseScriptStoneSpecs(value));
      continue;
    }
    if (key === "npcpoint" || key === "npc_point") {
      event.npcWarps.push(...parseScriptNpcPointSpecs(value));
      continue;
    }
    if (key === "addexps" || key === "addexp") {
      event.addExps = Number(value) || 0;
      continue;
    }
    if (key === "getpet" || key === "addpet") {
      getPets.push(...parseScriptGetPetSpecs(value, key === "addpet" ? "AddPet" : "GetPet"));
      continue;
    }
    if (key === "delpet") {
      rawDelPetSpecs.push(value);
      continue;
    }
    if (key === "endsetflg" || key === "endsetflag") {
      event.endSetFlags.push(...splitNumberList(value));
      continue;
    }
    if (key === "nowsetflg" || key === "nowsetflag" || key === "event_now" || key === "eventnow") {
      event.nowSetFlags.push(...splitNumberList(value));
      continue;
    }
    if (key === "cleanflg" || key === "cleanflag") {
      event.cleanFlags.push(...splitNumberList(value));
      continue;
    }
    const messageSpec = npcScriptMessageSpec(key);
    if (messageSpec) {
      const message = cleanScriptText(value);
      if (messageSpec.page > 0) {
        event.messagePages[messageSpec.key] ||= [];
        event.messagePages[messageSpec.key][messageSpec.page - 1] = message;
      } else {
        event.messages[messageSpec.key] = message;
      }
    }
  }

  finishEvent();
  return [
    ...events.filter((item) => !item.fallback),
    ...events.filter((item) => item.fallback)
  ];
}

function finalizeNpcScriptEvent(event, getPets = [], rawDelPetSpecs = []) {
  const delPets = rawDelPetSpecs.flatMap((value) => parseScriptDelPetSpecs(value, event.condition));
  const messagePages = Object.fromEntries(
    Object.entries(event.messagePages)
      .map(([key, pages]) => [key, pages.filter(Boolean)])
      .filter(([, pages]) => pages.length)
  );
  if (!event.type && !Object.keys(event.messages).length && !Object.keys(messagePages).length) return null;
  const {
    messagePages: _rawMessagePages,
    npcWarps: _rawNpcWarps,
    charms: _rawCharms,
    notDelItems: _rawNotDelItems,
    addExps: _rawAddExps,
    fallback: _rawFallback,
    ...eventOut
  } = event;
  return {
    ...eventOut,
    ...(Object.keys(messagePages).length ? { messagePages } : {}),
    getItems: event.getItems.map(withScriptItemName),
    delItems: event.delItems.map(withScriptItemName),
    getRandItems: event.getRandItems.map(withScriptRandomItemNames),
    ...(event.npcWarps.length ? { npcWarps: event.npcWarps } : {}),
    ...(event.charms.length ? { charms: event.charms } : {}),
    ...(event.notDelItems.length ? { notDelItems: [...new Set(event.notDelItems)].filter((value) => value > 0) } : {}),
    ...(Number(event.missionOver || 0) > 0 ? { missionOver: Number(event.missionOver) } : {}),
    ...(Number(event.missionClean || 0) > 0 ? { missionClean: Number(event.missionClean) } : {}),
    ...(Number(event.addExps || 0) > 0 ? { addExps: Number(event.addExps) } : {}),
    ...(event.fallback ? { fallback: true } : {}),
    ...(getPets.length ? { getPets } : {}),
    ...(delPets.length ? { delPets } : {}),
    cleanFlags: [...new Set(event.cleanFlags)].filter((value) => value > 0),
    nowSetFlags: [...new Set(event.nowSetFlags)].filter((value) => value > 0),
    endSetFlags: [...new Set(event.endSetFlags)].filter((value) => value > 0)
  };
}

function npcScriptMessageKey(key) {
  return npcScriptMessageSpec(key)?.key || "";
}

function npcScriptMessageSpec(key) {
  const match = String(key || "").toLowerCase().match(/^(.+?)(\d+)?$/);
  const base = match?.[1] || "";
  const page = Number(match?.[2] || 0);
  const messageKeys = {
    nomalmainmsg: "normalMain",
    normalmainmsg: "normalMain",
    nomalmsg: "normal",
    normalmsg: "normal",
    nomalwindowmsg: "normal",
    normalwindowmsg: "normal",
    requestmsg: "request",
    acceptmsg: "accept",
    thanksmsg: "thanks",
    freemsg: "normal",
    itemfullmsg: "itemFull",
    stonefullmsg: "stoneFull",
    stonelessmsg: "stoneLess",
    petfullmsg: "petFull",
    stopmsg: "stop",
    endstopmsg: "endStop",
    nostopmsg: "noStop",
    cleanmainmsg: "cleanMain",
    cleanflgmsg: "cleanFlag",
    cleanflagmsg: "cleanFlag"
  };
  return messageKeys[base] ? { key: messageKeys[base], page } : null;
}

function parseScriptNpcWarpSpecs(value = "") {
  return String(value || "")
    .split(",")
    .map((part) => {
      const [mapId, x, y] = part.trim().split(".");
      if (!mapId || x === undefined || y === undefined) return null;
      return {
        mapId: String(Number(mapId)),
        x: Number(x),
        y: Number(y)
      };
    })
    .filter((target) => target && target.mapId !== "0" && Number.isFinite(target.x) && Number.isFinite(target.y));
}

function parseScriptNpcPointSpecs(value = "") {
  return String(value || "")
    .split(";")
    .map((part) => {
      const text = part.trim();
      if (!text) return null;
      const pieces = text.includes(".")
        ? text.split(".")
        : text.split(",");
      const [mapId, x, y] = pieces.map((piece) => piece.trim());
      if (!mapId || x === undefined || y === undefined) return null;
      return {
        mapId: String(Number(mapId)),
        x: Number(x),
        y: Number(y),
        sourceAction: "NPCPOINT"
      };
    })
    .filter((target) => target && target.mapId !== "0" && Number.isFinite(target.x) && Number.isFinite(target.y));
}

function parseScriptItemSpecs(value = "") {
  const text = String(value || "").trim();
  if (/^EVDEL$/i.test(text)) return [{ evdel: true, source: "EVDEL" }];
  return text
    .split(",")
    .map((part) => {
      const match = part.trim().match(/^(\d+)(?:\*(\d+))?$/);
      if (!match) return null;
      return { id: Number(match[1]), qty: Number(match[2] || 1) };
    })
    .filter((item) => item && item.id > 0 && item.qty > 0);
}

function countNeedItemSpecs(value = "") {
  const counts = new Map();
  for (const part of String(value || "").split(",")) {
    const id = Number(part.trim());
    if (!Number.isFinite(id) || id <= 0) continue;
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return [...counts].map(([id, qty]) => ({ id, qty }));
}

function itemSpecsWithNames(specs = []) {
  return specs
    .map((spec) => {
      if (!spec || spec.evdel) return null;
      const item = compactScriptItem(spec.id);
      return item ? { ...item, qty: Math.max(1, Number(spec.qty || 1)) } : null;
    })
    .filter(Boolean);
}

function compactScriptItem(id) {
  const itemId = Number(id);
  if (!Number.isFinite(itemId) || itemId <= 0) return null;
  const item = itemDb.get(itemId);
  return {
    id: itemId,
    name: item?.name || `item ${itemId}`,
    image: Number(item?.image || 0),
    cost: Number(item?.cost || 0),
    type: Number(item?.type || 0),
    useField: Number(item?.useField || 0),
    target: Number(item?.target || 0),
    level: Number(item?.level || 0),
    description: item?.description || "",
    functionName: item?.functionName || "",
    option: item?.option || ""
  };
}

function compactScriptEnemy(id) {
  const enemyId = Number(id);
  if (!Number.isFinite(enemyId) || enemyId <= 0) return null;
  const enemy = enemySpecs.get(enemyId);
  return {
    enemyId,
    name: enemy?.name || `enemy ${enemyId}`,
    tempNo: Number(enemy?.tempNo || 0),
    levelMin: Number(enemy?.lvMin || 1),
    levelMax: Number(enemy?.lvMax || enemy?.lvMin || 1),
    createMin: Number(enemy?.createMin || 1),
    createMax: Number(enemy?.createMax || 1),
    source: `${GMSV_DATA_SOURCE}/enemy1.txt`
  };
}

function parseScriptRandomItemSpecs(value = "") {
  const ids = [];
  for (const part of String(value || "").split(",")) {
    const text = part.trim();
    if (!text) continue;
    const range = text.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      if (max - min <= 500) {
        for (let id = min; id <= max; id += 1) ids.push(id);
      }
      continue;
    }
    const id = Number(text);
    if (Number.isFinite(id) && id > 0) ids.push(id);
  }
  if (!ids.length) return [];
  // gmsv keeps duplicate ids in GetRandItem as weighted random choices.
  return [{ ids, qty: 1, source: "GetRandItem" }];
}

function parseScriptStoneSpecs(value = "") {
  return String(value || "")
    .split(",")
    .map((part) => {
      const text = part.trim();
      if (!text) return null;
      const levelCost = text.match(/^LV\s*\*\s*(\d+)$/i);
      if (levelCost) return { expr: `LV*${Number(levelCost[1])}`, multiplier: Number(levelCost[1]), source: text };
      const amount = Number(text);
      if (Number.isFinite(amount) && amount > 0) return { amount, source: text };
      return null;
    })
    .filter(Boolean);
}

function parseScriptGetPetSpecs(value = "", sourceAction = "GetPet") {
  const choices = String(value || "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
  if (!choices.length) return [];
  // gmsv NPC_EventAddPet picks one enemy1 id from a comma list.
  return [{ enemyIds: choices, qty: 1, source: sourceAction }];
}

function parseScriptDelPetSpecs(value = "", eventCondition = "") {
  const text = String(value || "").trim();
  if (/EVDEL/i.test(text)) {
    return [{ evdel: true, source: "EVDEL" }];
  }
  const source = text || eventCondition;
  return String(source || "")
    .split(/[,&|]/)
    .map((part) => parseScriptPetConditionSpec(part))
    .filter(Boolean);
}

function parseScriptPetConditionSpec(value = "") {
  const match = String(value || "").trim().match(/^PET\s*(!=|>=|<=|>|<|=)\s*(\d+)-(\d+)(?:\*(\d+))?$/i);
  if (!match) return null;
  return {
    op: match[1],
    level: Number(match[2]),
    petId: Number(match[3]),
    qty: Number(match[4] || 1),
    source: match[0]
  };
}

function withScriptItemName(item) {
  if (item?.evdel) return { ...item, source: item.source || "EVDEL" };
  const sourceItem = itemDb.get(Number(item.id));
  const out = {
    ...item,
    name: sourceItem?.name || `item ${item.id}`,
    image: sourceItem?.image || 0,
    cost: sourceItem?.cost || 0,
    description: sourceItem?.description || "",
    source: `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
  for (const key of ["option", "functionName"]) {
    if (sourceItem?.[key]) out[key] = sourceItem[key];
  }
  for (const key of ["damageBreak", "maxUses"]) {
    if (Number(sourceItem?.[key])) out[key] = sourceItem[key];
  }
  return out;
}

function withScriptRandomItemNames(spec) {
  const ids = (spec.ids || []).map((id) => Number(id)).filter((id) => id > 0);
  const uniqueIds = [...new Set(ids)];
  const names = uniqueIds
    .slice(0, 8)
    .map((id) => itemDb.get(id)?.name || `item ${id}`);
  return {
    ...spec,
    ids,
    names,
    sample: uniqueIds.slice(0, 8).map((id) => withScriptItemName({ id, qty: 1 })),
    source: spec.source || "GetRandItem"
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
  const text = readText(file);
  const kv = parseNpcEnemyFile(text);
  const enemyNos = splitNumberList(kv.enemyno || "");
  const requiredItems = expandItemList(kv.item || "", 32).map((id) => ({ id, qty: 1 }));
  const forbiddenItems = expandItemList(kv.noitem || "", 32).map((id) => ({ id, qty: 1 }));
  const addItems = expandItemList(kv.additem || "", 1).map((id) => ({ id, qty: 1 }));
  const replacementPoints = parseNpcEnemyReplacementPoints(kv.replacement || "");
  const askBattleMessages = [];
  for (let i = 1; i <= 6; i += 1) {
    const line = cleanScriptText(kv[`askbattlemsg${i}`] || "");
    if (line) askBattleMessages.push(line);
  }
  const postBattleEvents = parseNpcEnemyPostBattleEvents(text, file);
  return {
    kind: "NPCEnemy",
    source: relativeRef(file),
    entype: Number(kv.entype || 0) || 0,
    enemyNos,
    askBattleMessages,
    startMessage: cleanScriptText(kv.startmsg || ""),
    deniedMessage: cleanScriptText(kv.deniedmsg || ""),
    alreadyMessage: cleanScriptText(kv.alreadymsg || ""),
    oneBattle: Number(kv.onebattle || 0) === 1,
    endMessage: cleanScriptText(kv.endmsg || kv["end msg"] || ""),
    dieAct: Number(kv.dieact || 0) || 0,
    respawnSeconds: Number(kv.time || 0) || 0,
    warp: parseNpcEnemyWarp(kv),
    ...(requiredItems.length ? { requiredItems } : {}),
    ...(forbiddenItems.length ? { forbiddenItems } : {}),
    ...(Number(kv.steal || 0) === 1 ? { stealItems: true } : {}),
    ...(addItems.length ? { addItems } : {}),
    ...(replacementPoints.length ? { replacementPoints } : {}),
    ...(postBattleEvents.length ? { postBattleEvents } : {})
  };
}

function npcScriptHints(argPath, createFile, npcEnemy, trade, warp, petSkillShop, professionShop, itemChange, savePoint, petShop, itemPoolShop, routeService, luckyMan, janken, raceMan, petFusion, newNpcMan) {
  const file = resolveNpcArg(argPath, createFile);
  const actions = [];
  if (trade) actions.push("shop");
  if (petShop) actions.push("petShop");
  if (petFusion) actions.push("petFusion");
  if (newNpcMan) actions.push("appearance");
  if (itemPoolShop) actions.push("itemPoolShop");
  if (raceMan) actions.push("raceMan");
  if (routeService) actions.push("routeService");
  if (petSkillShop) actions.push("petSkillShop");
  if (professionShop) actions.push("professionShop");
  if (itemChange) actions.push("itemChange");
  if (savePoint) actions.push("save");
  if (warp) actions.push("warp");
  if (npcEnemy) actions.push("battle");
  if (luckyMan) actions.push("fortune");
  if (janken) actions.push("janken", "window", "take", "warp");
  if (janken?.winItems?.length || janken?.loseItems?.length) actions.push("give");
  if (!file) return actions.length ? { actions } : null;
  const text = readText(file);
  const hints = [];
  for (const item of tradeHints(trade)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const item of petFusionHints(petFusion)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const item of professionShopHints(professionShop)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const item of raceManHints(raceMan)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const item of newNpcManHints(newNpcMan)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const item of jankenHints(janken)) {
    if (!hints.includes(item)) hints.push(item);
    if (hints.length >= 8) break;
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(NEWEVENT\d*|EVENTRUN\d*|EVENT\d*|FREE|CHECKPARTY|TALKEVENT\d*|ENDEVENT\d*|CHANGEITEM|DELITEM|WARP|GIVEITEM|GOLD|MONEY|BORN|GETITEM|ADDEGGID)\s*[:=]\s*(.*)$/i);
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

function jankenHints(janken) {
  if (!janken) return [];
  return [
    ...(janken.entryItems || []).slice(0, 4).map((item) => `EntryItem:${item.name || item.id} x${item.qty || 1}`),
    janken.winWarp ? `WinWarp:${janken.winWarp.mapId},${janken.winWarp.x},${janken.winWarp.y}` : "",
    janken.loseWarp ? `LoseWarp:${janken.loseWarp.mapId},${janken.loseWarp.x},${janken.loseWarp.y}` : "",
    janken.noItemMessage ? `NoItem:${janken.noItemMessage}` : ""
  ].filter(Boolean);
}

function newNpcManHints(newNpcMan) {
  if (!newNpcMan) return [];
  return [
    newNpcMan.messages?.start ? `StartMsg:${newNpcMan.messages.start}` : "",
    newNpcMan.messages?.check ? `CheckMsg:${newNpcMan.messages.check}` : "",
    newNpcMan.appearanceRestore ? "AppearanceRestore:CHAR_BASEBASEIMAGENUMBER" : ""
  ].filter(Boolean);
}

function tradeHints(trade) {
  if (!trade) return [];
  return [
    trade.noteMessage ? `Msg:${trade.noteMessage}` : "",
    trade.mainMessage ? `MainMsg:${trade.mainMessage}` : ""
  ].filter(Boolean);
}

function professionShopHints(professionShop) {
  if (!professionShop) return [];
  return [
    professionShop.className ? `ProfessionClass:${professionShop.className}` : "",
    Number(professionShop.minTrans || 0) > 0 ? `Trans>=${professionShop.minTrans}` : "",
    ...((professionShop.skills || []).slice(0, 4).map((skill) => `Skill:${skill.name || skill.id}`))
  ].filter(Boolean);
}

function raceManHints(raceMan) {
  if (!raceMan) return [];
  return [
    raceMan.requiredItem ? `CheckItem:${raceMan.requiredItem.id}` : "",
    raceMan.requiredPetId ? `CheckPet:${raceMan.requiredPetId}` : "",
    raceMan.petLevel ? `PetLevel:${raceMan.petLevel}` : "",
    raceMan.gameMode ? `GameMode:${raceMan.gameMode}` : "",
    raceMan.gameCode ? `GameCode:${raceMan.gameCode}` : "",
    ...((raceMan.modes || []).map((mode) => `Mode${mode.index}:${mode.code}`)),
    ...((raceMan.history || []).map((item) => `History${item.index}:${item.code}`)),
    raceMan.rankNum ? `RankNum:${raceMan.rankNum}` : "",
    raceMan.lowLevel ? `LowLevel:${raceMan.lowLevel}` : ""
  ].filter(Boolean);
}

function petFusionHints(petFusion) {
  if (!petFusion) return [];
  return [
    petFusion.free ? `FREE:${petFusion.free}` : "",
    ...(petFusion.eggEnemyIds || []).slice(0, 4).map((id) => `ADDEGGID:${id}`)
  ].filter(Boolean);
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
  const mainBlock = String(text || "").split(/^\s*OVER\s*$/im)[0] || "";
  for (const raw of mainBlock.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([^:=]+)\s*[:=]\s*(.*)$/);
    if (!match) continue;
    kv[match[1].trim().toLowerCase()] = match[2].trim();
  }
  return kv;
}

function parseNpcEnemyPostBattleEvents(text, file) {
  const events = [];
  let event = null;

  const finishEvent = () => {
    if (!event) return;
    const out = {
      source: relativeRef(file),
      seq: Number(event.seq || 0),
      condition: cleanName(event.condition || ""),
      warps: event.warps.slice(0, 15),
      endMessage: cleanScriptText(event.endMessage || ""),
      ...(event.checkParty ? { checkParty: cleanName(event.checkParty) } : {}),
      ...(Number(event.heroBattleField || 0) > 0 ? { heroBattleField: Number(event.heroBattleField) } : {})
    };
    if (out.condition || out.warps.length || out.endMessage) events.push(out);
    event = null;
  };

  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eventStart = line.match(/^NEWEVENT(\d*)\s*:\s*$/i);
    if (eventStart) {
      finishEvent();
      event = {
        seq: Number(eventStart[1] || events.length + 1),
        condition: "",
        warps: [],
        endMessage: "",
        checkParty: "",
        heroBattleField: 0
      };
      continue;
    }
    if (!event) continue;
    if (/^OVER$/i.test(line)) {
      finishEvent();
      continue;
    }
    const index = line.indexOf(":");
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (key === "free") {
      event.condition = value;
      continue;
    }
    if (key === "warp") {
      event.warps.push(...parseNpcEnemyEventWarps(value));
      continue;
    }
    if (key === "endmsg") {
      event.endMessage = value;
      continue;
    }
    if (key === "checkparty") {
      event.checkParty = value;
      continue;
    }
    if (key === "herobattlefield") {
      event.heroBattleField = Number(value) || 0;
    }
  }
  finishEvent();
  return events.slice(0, 16);
}

function parseNpcEnemyEventWarps(value = "") {
  return String(value || "")
    .split(";")
    .map((part) => {
      const [floor, x, y] = part.trim().split(",").map((item) => Number(item.trim()));
      if (![floor, x, y].every(Number.isFinite) || floor <= 0) return null;
      return { mapId: String(floor), floor, x, y };
    })
    .filter(Boolean);
}

function parseNpcEnemyReplacementPoints(value = "") {
  return String(value || "")
    .split(";")
    .map((part) => {
      const [floor, x, y] = part.trim().split(",").map((item) => Number(item.trim()));
      if (![floor, x, y].every(Number.isFinite) || floor <= 0) return null;
      return { mapId: String(floor), floor, x, y };
    })
    .filter(Boolean)
    .slice(0, 32);
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

function expandItemList(spec, maxItems = 120) {
  const ids = [];
  for (const part of spec.split(",")) {
    const value = part.trim();
    if (!value) continue;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let id = start; id <= end && ids.length < maxItems; id += 1) ids.push(id);
      continue;
    }
    const id = Number(value);
    if (Number.isFinite(id) && ids.length < maxItems) ids.push(id);
  }
  return [...new Set(ids)];
}

function expandShopItemEntries(spec, { changeItemCostSpec = "", costFameSpec = "", costPointSpec = "", maxItems = 120 } = {}) {
  const entries = [];
  const changeCostTokens = changeItemCostSpec.split(",").map((part) => part.trim());
  const hasChangeCost = changeItemCostSpec.trim().length > 0;
  const costFameTokens = costFameSpec.split(",").map((part) => part.trim());
  const hasCostFame = costFameSpec.trim().length > 0;
  const costPointTokens = costPointSpec.split(",").map((part) => part.trim());
  const hasCostPoint = costPointSpec.trim().length > 0;
  let currentChangeCost = hasChangeCost ? 0 : null;
  let currentCostFame = hasCostFame ? 0 : null;
  let currentCostPoint = hasCostPoint ? 0 : null;
  let specIndex = 0;
  for (const part of spec.split(",")) {
    if (entries.length >= maxItems) break;
    const value = part.trim();
    if (!value) continue;
    specIndex += 1;
    if (hasChangeCost) {
      const rawCost = Number(changeCostTokens[specIndex - 1]);
      if (Number.isFinite(rawCost)) currentChangeCost = Math.max(0, rawCost);
    }
    if (hasCostFame) {
      const rawCostFame = Number(costFameTokens[specIndex - 1]);
      if (Number.isFinite(rawCostFame)) currentCostFame = rawCostFame;
    }
    if (hasCostPoint) {
      const rawCostPoint = Number(costPointTokens[specIndex - 1]);
      if (Number.isFinite(rawCostPoint)) currentCostPoint = rawCostPoint;
    }
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      for (let id = min; id <= max && entries.length < maxItems; id += 1) {
        entries.push(shopItemEntry(id, currentChangeCost, currentCostFame, currentCostPoint));
      }
      continue;
    }
    const id = Number(value);
    if (Number.isFinite(id)) entries.push(shopItemEntry(id, currentChangeCost, currentCostFame, currentCostPoint));
  }
  return entries;
}

function shopItemEntry(id, changeItemCost, costFame, costPoint) {
  return {
    id,
    ...(changeItemCost == null ? {} : { changeItemCost }),
    ...(Number(costFame || 0) > 0 ? { costFame: Number(costFame) } : {}),
    ...(Number(costPoint || 0) > 0 ? { costPoint: Number(costPoint) } : {})
  };
}

function parseItemRanges(spec, maxItems = 2000) {
  const ranges = [];
  let count = 0;
  for (const part of spec.split(",")) {
    if (count >= maxItems) break;
    const value = part.trim();
    if (!value) continue;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      const min = Math.min(start, end);
      const max = Math.max(start, end);
      const allowed = Math.max(1, Math.min(max - min + 1, maxItems - count));
      ranges.push([min, min + allowed - 1]);
      count += allowed;
      continue;
    }
    const id = Number(value);
    if (!Number.isFinite(id)) continue;
    ranges.push([id, id]);
    count += 1;
  }
  return ranges;
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
  const parts = enemy.split("|").map((part) => part.trim());
  const template = parts[0] || "NPC";
  const arg = parts.find((part) => /^(file|conff):/.test(part)) || "";
  return { template, argPath: arg, parts };
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
