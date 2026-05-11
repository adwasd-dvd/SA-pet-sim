import { cpSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const refRoot = path.resolve(appRoot, "..", "ref___data");
const mapRoot = path.join(refRoot, "map");
const npcRoot = path.join(refRoot, "npc");
const publicMapRoot = path.join(appRoot, "public", "data", "maps");
const worldOut = path.join(appRoot, "src", "world-data.js");
const gb18030 = new TextDecoder("gb18030");

const START_FLOOR = 1000;
const MAX_MAPS = 42;
const MAX_NPCS_PER_MAP = 18;

const mapFiles = scanMapFiles();
const warps = parseWarps(path.join(mapRoot, "mapwarp.txt"));
const encounterByFloor = parseEncounters(path.join(refRoot, "encount.txt"));
const itemDb = parseItems(path.join(refRoot, "itemset6.txt"));
const npcsByFloor = parseNpcs();
const selectedFloors = selectFloors();
const maps = {};

mkdirSync(publicMapRoot, { recursive: true });

for (const floor of selectedFloors) {
  const mapInfo = mapFiles.get(floor);
  if (!mapInfo) continue;
  const id = String(floor);
  const mapFile = `/data/maps/${floor}.ls2map`;
  cpSync(mapInfo.file, path.join(publicMapRoot, `${floor}.ls2map`));
  maps[id] = {
    id,
    floorId: floor,
    name: cleanName(mapInfo.name) || `floor ${floor}`,
    mapFile,
    summary: `${cleanName(mapInfo.name) || `floor ${floor}`} | floor=${floor} | ${mapInfo.width}x${mapInfo.height} | ${relativeRef(mapInfo.file)}`,
    size: [mapInfo.width, mapInfo.height],
    spawn: defaultSpawn(floor, mapInfo),
    encounterPets: encounterByFloor.get(floor)?.slice(0, 8) || [],
    npcs: (npcsByFloor.get(floor) || []).slice(0, MAX_NPCS_PER_MAP),
    exits: []
  };
}

for (const floor of selectedFloors) {
  const map = maps[String(floor)];
  if (!map) continue;
  const seen = new Set();
  for (const warp of warps.get(floor) || []) {
    if (!maps[String(warp.toFloor)]) continue;
    const key = `${warp.toFloor}:${warp.toX}:${warp.toY}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const target = mapFiles.get(warp.toFloor);
    const targetName = cleanName(target?.name) || `floor ${warp.toFloor}`;
    map.exits.push({
      id: `${warp.toFloor}-${map.exits.length}`,
      label: `去 ${targetName}`,
      detail: `${targetName} | floor ${warp.toFloor} | 目标 (${warp.toX},${warp.toY})`,
      to: String(warp.toFloor),
      x: warp.x,
      y: warp.y,
      target: [warp.toX, warp.toY],
      source: "ref___data/map/mapwarp.txt"
    });
    if (map.exits.length >= 10) break;
  }
}

const world = {
  source: {
    root: relativeRef(refRoot),
    maps: "ref___data/map/** LS2MAP",
    npcs: "ref___data/npc/**/*.create + .template + args/config",
    warps: "ref___data/map/mapwarp.txt",
    encounters: "ref___data/encount.txt"
  },
  startMap: String(START_FLOOR),
  maps,
  quests: {}
};

writeFileSync(worldOut, `export const WORLD = ${JSON.stringify(world, null, 2)};\n`);
console.log(`Generated ${Object.keys(maps).length} maps into ${path.relative(appRoot, worldOut)}`);
console.log(`Copied LS2MAP files into ${path.relative(appRoot, publicMapRoot)}`);

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

function parseEncounters(file) {
  const out = new Map();
  for (const line of readText(file).split(/\r?\n/)) {
    const cols = line.trim().split(",");
    const floor = Number(cols[1]);
    if (!Number.isFinite(floor)) continue;
    const pets = cols.slice(10, 20).map(Number).filter((value) => Number.isFinite(value) && value > 0);
    if (!pets.length) continue;
    const list = out.get(floor) || [];
    for (const pet of pets) {
      if (!list.includes(pet)) list.push(pet);
    }
    out.set(floor, list);
  }
  return out;
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
      const functionset = template.functionset || enemy.template || "NPC";
      const name = cleanName(kv.name || template.name || functionset);
      idCounter += 1;
      push(out, floor, {
        id: `${floor}-${pos[0]}-${pos[1]}-${idCounter}`,
        name: name || functionset,
        x: pos[0],
        y: pos[1],
        type: functionset,
        dialogue,
        source: relativeRef(file),
        script: argPath || enemy.template,
        template: enemy.template,
        graphic: kv.graphicname || template.graphicname || "",
        ...(trade ? { trade } : {})
      });
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
  const queued = [START_FLOOR];
  const seen = new Set();
  while (queued.length && selected.length < MAX_MAPS) {
    const floor = queued.shift();
    if (seen.has(floor) || !mapFiles.has(floor)) continue;
    seen.add(floor);
    selected.push(floor);
    const next = (warps.get(floor) || []).map((warp) => warp.toFloor).filter((item) => mapFiles.has(item));
    for (const item of next) {
      if (!seen.has(item) && !queued.includes(item)) queued.push(item);
    }
  }
  for (const floor of [1006, 100, 101, 2000, 2006, 3000, 3006, 4000, 4006]) {
    if (selected.length >= MAX_MAPS) break;
    if (mapFiles.has(floor) && !selected.includes(floor)) selected.push(floor);
  }
  return selected;
}

function defaultSpawn(floor, mapInfo) {
  const warpBack = [...warps.values()].flat().find((warp) => warp.toFloor === floor);
  if (warpBack) return [clamp(warpBack.toX, mapInfo.width), clamp(warpBack.toY, mapInfo.height)];
  return [Math.floor(mapInfo.width / 2), Math.floor(mapInfo.height / 2)];
}

function readNpcDialogue(argPath, createFile) {
  const file = resolveNpcArg(argPath, createFile);
  if (!file) return `脚本入口：${argPath || "未配置脚本参数"}`;
  const text = readText(file);
  const messages = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const value = line.match(/^(?:message|main_msg|askbattlemsg1|deniedmsg|luck\d+|TALKEVENT\d*)[:=](.*)$/i)?.[1];
    if (!value) continue;
    const cleaned = value.replace(/\\n/g, " ").replace(/%[0-9]*[a-z]/gi, "").trim();
    if (cleaned && !messages.includes(cleaned)) messages.push(cleaned);
    if (messages.length >= 4) break;
  }
  if (messages.length) return messages.join("\n");
  return `脚本入口：${relativeRef(file)}`;
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
  return value.replace(/\|0$/, "").replace(/\s+/g, " ").trim();
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
  return path.relative(path.dirname(refRoot), file).replaceAll(path.sep, "/");
}
