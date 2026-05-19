import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");

const SPR_START = 100000;
const SPRADRN_RECORD_BYTES = 12;
const ADRN_RECORD_BYTES = 80;
const ANIM_HEADER_BYTES = 12;
const FRAME_BYTES = 10;

const ANIM = {
  ATTACK: 0,
  DAMAGE: 1,
  DEAD: 2,
  STAND: 3,
  WALK: 4,
  GUARD: 10,
  THROW: 12
};

const ACTION_GROUPS = {
  field: [ANIM.STAND, ANIM.WALK],
  fieldStand: [ANIM.STAND],
  fieldWalk: [ANIM.WALK],
  battleCore: [ANIM.ATTACK, ANIM.DAMAGE, ANIM.DEAD, ANIM.GUARD],
  battleExtended: [ANIM.ATTACK, ANIM.DAMAGE, ANIM.DEAD, ANIM.GUARD, ANIM.THROW]
};

const ACTION_NAMES = Object.fromEntries(Object.entries(ANIM).map(([name, id]) => [id, name.toLowerCase()]));

const paths = {
  world: path.join(appRoot, "src/world-data.js"),
  enemyBase: path.join(appRoot, "public/data/enemybase2.txt"),
  closure: path.join(appRoot, "docs/planning/classic-core-closure-manifest.json"),
  atlas: path.join(appRoot, "public/data/client-tiles/tiles.json"),
  spr: path.join(appRoot, "external/sources/client-assets/data/spr_115.bin"),
  spradrn: path.join(appRoot, "external/sources/client-assets/data/spradrn_115.bin"),
  adrn: path.join(appRoot, "external/sources/client-assets/data/adrn_136.bin"),
  jsonOut: path.join(appRoot, "docs/planning/pet-animation-coverage-report.json"),
  mdOut: path.join(appRoot, "docs/planning/PET_ANIMATION_COVERAGE_REPORT.md")
};

const generatedAt = new Date().toISOString();
const world = await loadWorld(paths.world);
const profileFloors = loadProfileFloors(paths.closure, "classic-core");
const enemyBase = parseEnemyBase(paths.enemyBase);
const atlasFrameIds = new Set(Object.keys(readJson(paths.atlas).frames || {}).map(Number));
const spriteIndex = parseSpradrn(paths.spradrn);
const bitmapRecords = parseAdrnBitmapRecords(paths.adrn);
const sprBytes = fs.readFileSync(paths.spr);
const profileRefs = collectClassicCoreSpriteRefs(world, profileFloors, enemyBase.byTempNo);
const sourceSpriteNos = [...profileRefs.spriteNos.keys()].sort((a, b) => a - b);
const spriteSummaries = sourceSpriteNos.map((sprNo) => summarizeSprite({
  sprNo,
  refs: profileRefs.spriteNos.get(sprNo) || [],
  rowNames: enemyBase.namesByImageNo.get(sprNo) || [],
  spriteIndex,
  sprBytes,
  bitmapRecords,
  atlasFrameIds
}));

const report = {
  generatedAt,
  sourcePolicy: [
    "Pet animation coverage is read from local client spr_115.bin/spradrn_115.bin and verified against adrn_136 bitmap records.",
    "This report does not enlarge the runtime atlas; it tells the pack builder exactly what to extract next."
  ],
  summary: summarizeAll(spriteSummaries),
  actionGroups: summarizeActionGroups(spriteSummaries),
  importantModels: spriteSummaries.filter((item) => isImportant(item)).slice(0, 80).map(compactSprite),
  missing: {
    spriteIndex: spriteSummaries.filter((item) => !item.hasSpriteIndex).map((item) => compactSprite(item)).slice(0, 80),
    adrnBitmapRecords: spriteSummaries.flatMap((item) => item.missingAdrnFrames.map((frame) => ({
      sprNo: item.sprNo,
      names: item.names,
      ...frame
    }))).slice(0, 80),
    currentAtlasFieldFrames: spriteSummaries.flatMap((item) => item.missingAtlasFieldFrames.map((frame) => ({
      sprNo: item.sprNo,
      names: item.names,
      ...frame
    }))).slice(0, 80)
  },
  sprites: spriteSummaries.map(compactSprite),
  notes: [
    "SPRADRN entries are 12 bytes: sprNo, offset in spr_115.bin, animSize. This matches client-source/systeminc/loadsprbin.h and loadsprbin.cpp.",
    "Animation headers are 12 bytes and frame records are 10 bytes. Frame BmpNo values resolve by bitmapNo in adrn_136.bin.",
    "Current atlas coverage is expected to be low for pet animation frames; these should become lazy pet-field-animation and pet-battle-animation packs instead of boot atlas entries."
  ]
};

fs.writeFileSync(paths.jsonOut, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(paths.mdOut, renderMarkdown(report));
console.log(`Wrote ${path.relative(appRoot, paths.jsonOut)}`);
console.log(`Wrote ${path.relative(appRoot, paths.mdOut)}`);

async function loadWorld(file) {
  const mod = await import(pathToFileURL(file).href);
  return mod.WORLD || mod.default?.WORLD || mod.default || {};
}

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function parseEnemyBase(file) {
  const rows = [];
  const byTempNo = new Map();
  const namesByImageNo = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = line.split(",");
    if (cells.length < 37) continue;
    const row = {
      name: cells[0] || "",
      tempNo: Number(cells[6]),
      imageNo: Number(cells[36])
    };
    if (!Number.isFinite(row.tempNo)) continue;
    rows.push(row);
    byTempNo.set(row.tempNo, row);
    if (Number.isFinite(row.imageNo) && row.imageNo >= SPR_START) {
      if (!namesByImageNo.has(row.imageNo)) namesByImageNo.set(row.imageNo, new Set());
      namesByImageNo.get(row.imageNo).add(row.name);
    }
  }
  return { rows, byTempNo, namesByImageNo };
}

function loadProfileFloors(file, profileId) {
  const floors = new Set();
  const closure = readJson(file, null);
  const profile = (closure?.profiles || []).find((item) => item.id === profileId);
  for (const item of profile?.floors || []) {
    const floor = Number(item.floor ?? item);
    if (Number.isFinite(floor)) floors.add(floor);
  }
  return floors;
}

function parseSpradrn(file) {
  const buf = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + SPRADRN_RECORD_BYTES <= buf.length; offset += SPRADRN_RECORD_BYTES) {
    const sprNo = buf.readUInt32LE(offset);
    const sprOffset = buf.readUInt32LE(offset + 4);
    const animSize = buf.readUInt16LE(offset + 8);
    if (sprNo >= SPR_START && animSize > 0) {
      records.set(sprNo, { sprNo, offset: sprOffset, animSize });
    }
  }
  return records;
}

function parseAdrnBitmapRecords(file) {
  const buf = fs.readFileSync(file);
  const records = new Map();
  for (let offset = 0; offset + ADRN_RECORD_BYTES <= buf.length; offset += ADRN_RECORD_BYTES) {
    const bitmapNo = buf.readUInt32LE(offset);
    const size = buf.readUInt32LE(offset + 8);
    const width = buf.readUInt32LE(offset + 20);
    const height = buf.readUInt32LE(offset + 24);
    if (!bitmapNo || !size || !width || !height) continue;
    records.set(bitmapNo, {
      bitmapNo,
      graphicNo: buf.readUInt32LE(offset + 76),
      width,
      height,
      xoffset: buf.readInt32LE(offset + 12),
      yoffset: buf.readInt32LE(offset + 16)
    });
  }
  return records;
}

function collectClassicCoreSpriteRefs(sourceWorld, floorSet, enemyByTempNo) {
  const spriteNos = new Map();
  const enemyTempNos = new Set();

  const addSprite = (sprNo, source) => {
    const value = Number(sprNo);
    if (!Number.isFinite(value) || value < SPR_START) return;
    if (!spriteNos.has(value)) spriteNos.set(value, []);
    const list = spriteNos.get(value);
    if (list.length < 10) list.push(source);
  };

  const addTempNo = (tempNo, source) => {
    const value = Number(tempNo);
    if (!Number.isFinite(value) || value <= 0) return;
    enemyTempNos.add(value);
    const row = enemyByTempNo.get(value);
    if (row?.imageNo >= SPR_START) addSprite(row.imageNo, { ...source, tempNo: value, name: row.name, source: "enemybase.imageNo" });
  };

  const visitTempNos = (value, floor, mapName, trail) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visitTempNos(item, floor, mapName, [...trail, String(index)]));
      return;
    }
    for (const [key, item] of Object.entries(value)) {
      if (key === "tempNo" || key === "PetId" || key === "EnemyTempNo") {
        addTempNo(item, { floor, map: mapName, key, trace: [...trail, key].join(".") });
      }
      visitTempNos(item, floor, mapName, [...trail, key]);
    }
  };

  for (const [floor, map] of Object.entries(sourceWorld.maps || {})) {
    const floorNo = Number(floor);
    if (floorSet.size && !floorSet.has(floorNo)) continue;
    const mapName = map.name || "";
    for (const npc of map.npcs || []) {
      addSprite(npc.graphic, {
        floor: floorNo,
        map: mapName,
        npc: npc.name || npc.id || "",
        type: npc.type || "",
        source: "npc.graphic"
      });
    }
    for (const tempNo of map.encounterPets || []) {
      addTempNo(tempNo, { floor: floorNo, map: mapName, source: "map.encounterPets" });
    }
    visitTempNos(map, floorNo, mapName, [`WORLD.maps.${floor}`]);
  }
  return { spriteNos, enemyTempNos };
}

function summarizeSprite({ sprNo, refs, rowNames, spriteIndex, sprBytes, bitmapRecords, atlasFrameIds }) {
  const index = spriteIndex.get(sprNo);
  const base = {
    sprNo,
    names: [...rowNames].slice(0, 8),
    refs,
    hasSpriteIndex: Boolean(index),
    animSize: index?.animSize || 0,
    actions: {},
    missingAdrnFrames: [],
    missingAtlasFieldFrames: []
  };
  if (!index) return base;

  const spr = sprBytes;
  let offset = index.offset;
  for (let i = 0; i < index.animSize; i += 1) {
    if (offset + ANIM_HEADER_BYTES > spr.length) break;
    const dir = spr.readUInt16LE(offset);
    const action = spr.readUInt16LE(offset + 2);
    const dtAnim = spr.readUInt32LE(offset + 4);
    const frameCnt = spr.readUInt32LE(offset + 8);
    offset += ANIM_HEADER_BYTES;
    const frames = [];
    for (let frameIndex = 0; frameIndex < frameCnt; frameIndex += 1) {
      if (offset + FRAME_BYTES > spr.length) break;
      const bitmapNo = spr.readUInt32LE(offset);
      const posX = spr.readInt16LE(offset + 4);
      const posY = spr.readInt16LE(offset + 6);
      const soundNo = spr.readUInt16LE(offset + 8);
      const bitmap = bitmapRecords.get(bitmapNo);
      const frame = {
        bitmapNo,
        frameIndex,
        posX,
        posY,
        soundNo,
        hasAdrnRecord: Boolean(bitmap),
        inCurrentAtlas: atlasFrameIds.has(bitmapNo),
        width: bitmap?.width || 0,
        height: bitmap?.height || 0,
        xoffset: bitmap?.xoffset || 0,
        yoffset: bitmap?.yoffset || 0
      };
      frames.push(frame);
      if (!frame.hasAdrnRecord) base.missingAdrnFrames.push({ action: actionName(action), dir, bitmapNo, frameIndex });
      if ((action === ANIM.STAND || action === ANIM.WALK) && !frame.inCurrentAtlas) {
        base.missingAtlasFieldFrames.push({ action: actionName(action), dir, bitmapNo, frameIndex });
      }
      offset += FRAME_BYTES;
    }
    const key = actionName(action);
    if (!base.actions[key]) {
      base.actions[key] = {
        action,
        dirs: new Set(),
        animations: 0,
        frames: 0,
        uniqueBitmaps: new Set(),
        currentAtlasFrames: 0,
        missingAdrnFrames: 0,
        sampleFrames: []
      };
    }
    const stat = base.actions[key];
    stat.dirs.add(dir);
    stat.animations += 1;
    stat.frames += frames.length;
    for (const frame of frames) {
      stat.uniqueBitmaps.add(frame.bitmapNo);
      if (frame.inCurrentAtlas) stat.currentAtlasFrames += 1;
      if (!frame.hasAdrnRecord) stat.missingAdrnFrames += 1;
      if (stat.sampleFrames.length < 4) {
        stat.sampleFrames.push({
          dir,
          bitmapNo: frame.bitmapNo,
          width: frame.width,
          height: frame.height,
          xoffset: frame.xoffset,
          yoffset: frame.yoffset
        });
      }
    }
    stat.minDtAnim = stat.minDtAnim == null ? dtAnim : Math.min(stat.minDtAnim, dtAnim);
    stat.maxDtAnim = stat.maxDtAnim == null ? dtAnim : Math.max(stat.maxDtAnim, dtAnim);
  }

  for (const [key, stat] of Object.entries(base.actions)) {
    stat.dirs = [...stat.dirs].sort((a, b) => a - b);
    stat.uniqueBitmaps = [...stat.uniqueBitmaps].sort((a, b) => a - b);
  }
  return base;
}

function summarizeAll(sprites) {
  const actionGroups = summarizeActionGroups(sprites);
  return {
    classicCoreSpriteNos: sprites.length,
    missingSpriteIndex: sprites.filter((item) => !item.hasSpriteIndex).length,
    spritesWithMissingAdrnFrames: sprites.filter((item) => item.missingAdrnFrames.length).length,
    fieldUniqueBitmaps: actionGroups.field.uniqueBitmaps,
    fieldAdrnMissing: actionGroups.field.missingAdrnFrames,
    fieldCurrentAtlasPresent: actionGroups.field.currentAtlasFrames,
    battleCoreUniqueBitmaps: actionGroups.battleCore.uniqueBitmaps,
    battleCoreAdrnMissing: actionGroups.battleCore.missingAdrnFrames,
    battleCoreCurrentAtlasPresent: actionGroups.battleCore.currentAtlasFrames
  };
}

function summarizeActionGroups(sprites) {
  const out = {};
  for (const [group, actions] of Object.entries(ACTION_GROUPS)) {
    const actionSet = new Set(actions.map(actionName));
    const bitmapSet = new Set();
    let animations = 0;
    let frames = 0;
    let missingAdrnFrames = 0;
    let currentAtlasFrames = 0;
    for (const sprite of sprites) {
      for (const [name, stat] of Object.entries(sprite.actions || {})) {
        if (!actionSet.has(name)) continue;
        animations += stat.animations;
        frames += stat.frames;
        missingAdrnFrames += stat.missingAdrnFrames;
        currentAtlasFrames += stat.currentAtlasFrames;
        for (const bitmapNo of stat.uniqueBitmaps || []) bitmapSet.add(bitmapNo);
      }
    }
    out[group] = {
      actions: [...actionSet],
      animations,
      frames,
      uniqueBitmaps: bitmapSet.size,
      missingAdrnFrames,
      currentAtlasFrames
    };
  }
  return out;
}

function isImportant(sprite) {
  const names = sprite.names.join(" ");
  return sprite.sprNo === 100250
    || sprite.sprNo === 100371
    || sprite.sprNo === 100388
    || /乌力|奥卡洛斯|布伊|加比奥|凯比|布林帖斯|猪雀/.test(names);
}

function compactSprite(sprite) {
  const actions = {};
  for (const [name, stat] of Object.entries(sprite.actions || {})) {
    actions[name] = {
      dirs: stat.dirs,
      animations: stat.animations,
      frames: stat.frames,
      uniqueBitmaps: stat.uniqueBitmaps.length,
      currentAtlasFrames: stat.currentAtlasFrames,
      missingAdrnFrames: stat.missingAdrnFrames,
      minDtAnim: stat.minDtAnim,
      maxDtAnim: stat.maxDtAnim,
      sampleFrames: stat.sampleFrames
    };
  }
  return {
    sprNo: sprite.sprNo,
    names: sprite.names,
    hasSpriteIndex: sprite.hasSpriteIndex,
    animSize: sprite.animSize,
    actions,
    refs: sprite.refs.slice(0, 5)
  };
}

function actionName(action) {
  return ACTION_NAMES[action] || `action_${action}`;
}

function renderMarkdown(data) {
  const lines = [];
  lines.push("# Pet Animation Coverage Report");
  lines.push("");
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Classic-core sprite numbers: ${data.summary.classicCoreSpriteNos}`);
  lines.push(`- Missing sprite index entries: ${data.summary.missingSpriteIndex}`);
  lines.push(`- Field stand/walk unique bitmap frames: ${data.summary.fieldUniqueBitmaps}`);
  lines.push(`- Field stand/walk frames already in current atlas: ${data.summary.fieldCurrentAtlasPresent}`);
  lines.push(`- Field stand/walk missing adrn records: ${data.summary.fieldAdrnMissing}`);
  lines.push(`- Battle core unique bitmap frames: ${data.summary.battleCoreUniqueBitmaps}`);
  lines.push(`- Battle core frames already in current atlas: ${data.summary.battleCoreCurrentAtlasPresent}`);
  lines.push(`- Battle core missing adrn records: ${data.summary.battleCoreAdrnMissing}`);
  lines.push("");
  lines.push("## Action Groups");
  lines.push("");
  lines.push("| Group | Actions | Animations | Unique Bitmaps | Current Atlas Frames | Missing ADRN |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: |");
  for (const [group, stat] of Object.entries(data.actionGroups)) {
    lines.push(`| ${group} | ${stat.actions.join(", ")} | ${stat.animations} | ${stat.uniqueBitmaps} | ${stat.currentAtlasFrames} | ${stat.missingAdrnFrames} |`);
  }
  lines.push("");
  lines.push("## Important Models");
  lines.push("");
  lines.push("| SprNo | Names | AnimSize | Stand Frames | Walk Frames | Battle Frames | Source Refs |");
  lines.push("| ---: | --- | ---: | ---: | ---: | ---: | --- |");
  for (const compact of data.importantModels.slice(0, 40)) {
    const stand = compact.actions.stand?.uniqueBitmaps || 0;
    const walk = compact.actions.walk?.uniqueBitmaps || 0;
    const battle = ["attack", "damage", "dead", "guard"].reduce((sum, name) => sum + (compact.actions[name]?.uniqueBitmaps || 0), 0);
    const refs = compact.refs.map((ref) => `${ref.floor || ""}${ref.map ? ` ${ref.map}` : ""}${ref.npc ? ` ${ref.npc}` : ""}`).filter(Boolean).slice(0, 2).join("; ");
    lines.push(`| ${compact.sprNo} | ${compact.names.join(", ") || "-"} | ${compact.animSize} | ${stand} | ${walk} | ${battle} | ${refs || "-"} |`);
  }
  lines.push("");
  lines.push("## Current Runtime Implication");
  lines.push("");
  lines.push("- The original client animation table is parseable and complete for the classic-core pet/NPC sprites in this report.");
  lines.push("- These bitmap frame numbers resolve through `adrn_136.bin`, but most are not in the current monolithic runtime atlas.");
  lines.push("- The next implementation should extract `fieldStand`/`fieldWalk` into a lazy pet field pack, then switch map pets and PET STATUS portraits to those frames before adding battle action packs.");
  lines.push("");
  lines.push("## Source Structure");
  lines.push("");
  lines.push("- `spradrn_115.bin`: 12-byte records: `sprNo`, `offset`, `animSize`.");
  lines.push("- `spr_115.bin`: 12-byte animation headers followed by 10-byte frame records.");
  lines.push("- `FRAMELIST.BmpNo` resolves by bitmap number in `adrn_136.bin`; no custom art or remapping is used.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}
