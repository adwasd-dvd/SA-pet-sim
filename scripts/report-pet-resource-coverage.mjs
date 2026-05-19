import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");

const paths = {
  atlas: path.join(appRoot, "public/data/client-tiles/tiles.json"),
  enemyBase: path.join(appRoot, "public/data/enemybase2.txt"),
  world: path.join(appRoot, "src/world-data.js"),
  closure: path.join(appRoot, "docs/planning/classic-core-closure-manifest.json"),
  keepSet: path.join(appRoot, "public/data/profiles/classic-core/texture-keep-set.json"),
  packPlan: path.join(appRoot, "public/data/profiles/classic-core/profile-texture-pack-plan.json"),
  jsonOut: path.join(appRoot, "docs/planning/pet-resource-coverage-report.json"),
  mdOut: path.join(appRoot, "docs/planning/PET_RESOURCE_COVERAGE_REPORT.md"),
  clientData: path.join(appRoot, "external/sources/client-assets/data")
};

const generatedAt = new Date().toISOString();
const atlas = readJson(paths.atlas);
const enemyRows = parseEnemyBase(paths.enemyBase);
const world = await loadWorld(paths.world);
const profileFloors = loadProfileFloors(paths.closure, "classic-core");
const profileWorld = filterWorldByFloors(world, profileFloors);
const keepSet = readJson(paths.keepSet, {});
const packPlan = readJson(paths.packPlan, {});
const frameIds = new Set(Object.keys(atlas.frames || {}).map(Number));
const packRefsById = buildPackRefs(packPlan);
const allStaticImageNos = uniqueNumberArray(enemyRows.map((row) => row.imageNo).filter((id) => id > 99));
const profileRefs = collectWorldPetRefs(profileWorld);
const fullRefs = collectWorldPetRefs(world);
const profileStaticImageNos = uniqueNumberArray(
  [...profileRefs.enemyTempNos.keys()]
    .map((tempNo) => enemyRows.byTempNo.get(tempNo)?.imageNo)
    .filter((id) => Number.isFinite(id) && id > 99)
);
const petNpcGraphics = collectPetLikeNpcGraphics(profileRefs.npcGraphics, enemyRows);
const importantModels = summarizeImportantModels(enemyRows, frameIds, packRefsById);
const familyCoverage = summarizeFamilies(enemyRows, frameIds, packRefsById);
const clientAnimationFiles = summarizeClientAnimationFiles(paths.clientData);

const report = {
  generatedAt,
  sourcePolicy: [
    "Local source data is authoritative: enemybase2.txt, world-data.js, classic-core closure, and client atlas/profile packs.",
    "External slim-SA-Game-Guide is used as the resource-splitting method, not as replacement content."
  ],
  slimGuideRevision: "b1239ae2293c443473af36dc8626e87279d4d00b",
  summary: {
    atlasImage: atlas.image || null,
    atlasFrames: frameIds.size,
    enemyBaseRows: enemyRows.length,
    enemyBaseStaticImageNos: allStaticImageNos.length,
    enemyBaseStaticFramesPresent: countPresent(allStaticImageNos, frameIds),
    enemyBaseStaticFramesMissing: allStaticImageNos.length - countPresent(allStaticImageNos, frameIds),
    classicCoreFloors: profileFloors.size,
    classicCoreEncounterTempNos: profileRefs.enemyTempNos.size,
    classicCoreEncounterStaticImageNos: profileStaticImageNos.length,
    classicCoreEncounterStaticFramesMissing: missingIds(profileStaticImageNos, frameIds).length,
    classicCorePetLikeNpcGraphics: petNpcGraphics.length,
    fullWorldEncounterTempNos: fullRefs.enemyTempNos.size,
    keepSetDomains: Object.keys(keepSet.domains || {}),
    packCount: (packPlan.packs || []).length
  },
  runtimeStatus: {
    staticPetFrames: "present and packed",
    fieldAnimationFrames: "not yet split into a pet-field-animation domain",
    battleAnimationFrames: "not yet split into a pet-battle-animation domain",
    reasonForCurrentVisualBug: "The runtime can now find enemybase ImgNo frames, but map pets and pet panels still resolve to one static ImgNo instead of the original walk/stand/battle animation sets from spr_115/spradrn_115.",
    nextImplementationStep: "Parse and map source animation records for classic-core pets, then add pet-field-animation and pet-battle-animation pack domains before switching runtime sprites away from static ImgNo fallbacks."
  },
  clientAnimationFiles,
  packCoverage: summarizePackCoverage({
    allStaticImageNos,
    profileStaticImageNos,
    packRefsById,
    keepSet
  }),
  importantModels,
  familyCoverage,
  petLikeNpcGraphics: petNpcGraphics.slice(0, 80),
  missing: {
    enemyBaseStaticImageNos: missingIds(allStaticImageNos, frameIds).slice(0, 80),
    classicCoreEncounterStaticImageNos: missingIds(profileStaticImageNos, frameIds).slice(0, 80),
    staticImageNosWithoutProfilePack: allStaticImageNos.filter((id) => !packRefsById.has(id)).slice(0, 80)
  }
};

fs.writeFileSync(paths.jsonOut, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(paths.mdOut, renderMarkdown(report));
console.log(`Wrote ${path.relative(appRoot, paths.jsonOut)}`);
console.log(`Wrote ${path.relative(appRoot, paths.mdOut)}`);

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function loadWorld(file) {
  const mod = await import(pathToFileURL(file).href);
  return mod.WORLD || mod.default?.WORLD || mod.default || {};
}

function parseEnemyBase(file) {
  const rows = [];
  const byTempNo = new Map();
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = line.split(",");
    if (cells.length < 37) continue;
    const row = {
      name: cells[0] || "",
      tempNo: Number(cells[6]),
      level: Number(cells[7]),
      growth: Number(cells[8]),
      earth: Number(cells[15]) || 0,
      water: Number(cells[16]) || 0,
      fire: Number(cells[17]) || 0,
      wind: Number(cells[18]) || 0,
      race: Number(cells[35]),
      imageNo: Number(cells[36])
    };
    if (!Number.isFinite(row.tempNo)) continue;
    rows.push(row);
    byTempNo.set(row.tempNo, row);
  }
  rows.byTempNo = byTempNo;
  return rows;
}

function loadProfileFloors(file, profileId) {
  const floors = new Set();
  if (!fs.existsSync(file)) return floors;
  const closure = readJson(file);
  const profile = (closure.profiles || []).find((item) => item.id === profileId);
  for (const item of profile?.floors || []) {
    const floor = Number(item.floor ?? item);
    if (Number.isFinite(floor)) floors.add(floor);
  }
  return floors;
}

function filterWorldByFloors(sourceWorld, floorSet) {
  if (!floorSet.size) return sourceWorld;
  const maps = {};
  for (const [floor, map] of Object.entries(sourceWorld.maps || {})) {
    if (floorSet.has(Number(floor))) maps[floor] = map;
  }
  return { ...sourceWorld, maps };
}

function collectWorldPetRefs(sourceWorld) {
  const enemyTempNos = new Map();
  const npcGraphics = new Map();
  for (const [floor, map] of Object.entries(sourceWorld.maps || {})) {
    const floorNo = Number(floor);
    const mapName = map.name || "";
    for (const npc of map.npcs || []) {
      const graphic = Number(npc.graphic);
      if (Number.isFinite(graphic) && graphic > 99) {
        addSource(npcGraphics, graphic, {
          floor: floorNo,
          map: mapName,
          npc: npc.name || npc.id || "",
          type: npc.type || "",
          source: "npc.graphic"
        });
      }
    }
    for (const tempNo of map.encounterPets || []) {
      addTempNo(enemyTempNos, tempNo, floorNo, mapName, "map.encounterPets");
    }
    collectRecursiveTempNos(map, enemyTempNos, [`WORLD.maps.${floor}`], floorNo, mapName);
  }
  return { enemyTempNos, npcGraphics };
}

function collectRecursiveTempNos(value, out, trail, floor, mapName) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectRecursiveTempNos(item, out, [...trail, String(index)], floor, mapName));
    return;
  }
  for (const [key, item] of Object.entries(value)) {
    if (key === "tempNo" || key === "PetId" || key === "EnemyTempNo") {
      addTempNo(out, item, floor, mapName, key, [...trail, key].join("."));
    }
    collectRecursiveTempNos(item, out, [...trail, key], floor, mapName);
  }
}

function addTempNo(out, value, floor, mapName, source, trace = "") {
  const tempNo = Number(value);
  if (!Number.isFinite(tempNo) || tempNo <= 0) return;
  addSource(out, tempNo, { floor, map: mapName, source, trace });
}

function addSource(map, key, source) {
  if (!map.has(key)) map.set(key, []);
  const list = map.get(key);
  if (list.length < 8) list.push(source);
}

function collectPetLikeNpcGraphics(npcGraphics, enemyRows) {
  const imageNames = new Map();
  for (const row of enemyRows) {
    if (!imageNames.has(row.imageNo)) imageNames.set(row.imageNo, new Set());
    imageNames.get(row.imageNo).add(row.name);
  }
  return [...npcGraphics.entries()]
    .filter(([graphic]) => graphic >= 100000 || imageNames.has(graphic))
    .map(([graphic, sources]) => ({
      graphic,
      names: [...(imageNames.get(graphic) || [])].slice(0, 6),
      framePresent: frameIds.has(graphic),
      packs: packRefsById.get(graphic) || [],
      sources
    }))
    .sort((a, b) => a.graphic - b.graphic);
}

function buildPackRefs(packPlanData) {
  const refs = new Map();
  for (const pack of packPlanData.packs || []) {
    for (const id of pack.presentIds || pack.ids || []) {
      const key = Number(id);
      if (!Number.isFinite(key)) continue;
      if (!refs.has(key)) refs.set(key, []);
      refs.get(key).push({ id: pack.id, domain: pack.domain, load: pack.load, frames: pack.frames });
    }
  }
  return refs;
}

function summarizePackCoverage({ allStaticImageNos, profileStaticImageNos, packRefsById, keepSet }) {
  const domainStats = {};
  for (const [domain, record] of Object.entries(keepSet.domains || {})) {
    const ids = record.ids || [];
    domainStats[domain] = {
      ids: ids.length,
      present: (record.present || []).length,
      missing: (record.missing || []).length,
      presentFrameArea: record.presentFrameArea || 0
    };
  }
  return {
    domains: domainStats,
    allStaticImageNosInPacks: allStaticImageNos.filter((id) => packRefsById.has(id)).length,
    profileStaticImageNosInPacks: profileStaticImageNos.filter((id) => packRefsById.has(id)).length
  };
}

function summarizeImportantModels(enemyRows, frameIdSet, packRefsById) {
  const wantedTempNos = new Set([1, 5, 11, 13, 21, 23, 39, 100, 371]);
  const wantedNameParts = ["乌力", "奥卡洛斯", "布伊", "加比奥", "猪雀", "布林帖斯", "凯比", "威威"];
  const rows = enemyRows.filter((row) =>
    wantedTempNos.has(row.tempNo) || wantedNameParts.some((part) => row.name.includes(part))
  );
  return rows.slice(0, 80).map((row) => modelRow(row, frameIdSet, packRefsById));
}

function summarizeFamilies(enemyRows, frameIdSet, packRefsById) {
  const families = [
    ["乌力", ["乌力", "黑乌力", "奥卡洛斯"]],
    ["布伊", ["布伊", "布比", "卡布伊"]],
    ["加美/加比", ["加美", "加比", "加斯"]],
    ["威威", ["威威", "乌宝宝", "乌卡鲁", "威伯"]],
    ["猪雀/火鸡", ["猪雀", "火鸡"]],
    ["凯比", ["凯比", "凯比特"]],
    ["人龙", ["人龙", "邦浦洛斯", "邦奇诺"]],
    ["暴龙", ["暴龙", "帖拉"]],
    ["雷龙", ["雷龙", "布林帖斯"]],
    ["鲨鱼", ["鲨鱼", "加格"]]
  ];
  return families.map(([family, parts]) => {
    const rows = enemyRows.filter((row) => parts.some((part) => row.name.includes(part)));
    const imageNos = uniqueNumberArray(rows.map((row) => row.imageNo).filter((id) => id > 99));
    return {
      family,
      rows: rows.length,
      imageNos: imageNos.length,
      staticFramesPresent: countPresent(imageNos, frameIdSet),
      staticFramesMissing: missingIds(imageNos, frameIdSet).length,
      packedFrames: imageNos.filter((id) => packRefsById.has(id)).length,
      samples: rows.slice(0, 8).map((row) => modelRow(row, frameIdSet, packRefsById))
    };
  });
}

function modelRow(row, frameIdSet, packRefsById) {
  return {
    tempNo: row.tempNo,
    name: row.name,
    level: row.level,
    imageNo: row.imageNo,
    framePresent: frameIdSet.has(row.imageNo),
    packs: packRefsById.get(row.imageNo) || [],
    attributes: {
      earth: row.earth,
      water: row.water,
      fire: row.fire,
      wind: row.wind
    }
  };
}

function summarizeClientAnimationFiles(dataDir) {
  const names = ["spr_115.bin", "spradrn_115.bin", "adrn_136.bin", "real_136.bin"];
  return names.map((name) => {
    const file = path.join(dataDir, name);
    if (!fs.existsSync(file)) return { name, present: false };
    const stat = fs.statSync(file);
    return { name, present: true, bytes: stat.size };
  });
}

function uniqueNumberArray(values) {
  return [...new Set(values.map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
}

function countPresent(ids, frameIdSet) {
  return ids.reduce((count, id) => count + (frameIdSet.has(id) ? 1 : 0), 0);
}

function missingIds(ids, frameIdSet) {
  return ids.filter((id) => !frameIdSet.has(id));
}

function renderMarkdown(data) {
  const lines = [];
  lines.push("# Pet Resource Coverage Report");
  lines.push("");
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push(`Slim guide revision: \`${data.slimGuideRevision}\``);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Atlas frames: ${data.summary.atlasFrames}`);
  lines.push(`- Enemybase static ImgNo coverage: ${data.summary.enemyBaseStaticFramesPresent}/${data.summary.enemyBaseStaticImageNos} present, ${data.summary.enemyBaseStaticFramesMissing} missing.`);
  lines.push(`- Classic-core encounter static ImgNo coverage: ${data.summary.classicCoreEncounterStaticImageNos - data.summary.classicCoreEncounterStaticFramesMissing}/${data.summary.classicCoreEncounterStaticImageNos} present.`);
  lines.push(`- Classic-core pet-like NPC graphics: ${data.summary.classicCorePetLikeNpcGraphics}`);
  lines.push(`- Profile texture packs: ${data.summary.packCount}`);
  lines.push("");
  lines.push("## Runtime Status");
  lines.push("");
  lines.push(`- Static pet frames: ${data.runtimeStatus.staticPetFrames}`);
  lines.push(`- Field animation frames: ${data.runtimeStatus.fieldAnimationFrames}`);
  lines.push(`- Battle animation frames: ${data.runtimeStatus.battleAnimationFrames}`);
  lines.push(`- Current visual risk: ${data.runtimeStatus.reasonForCurrentVisualBug}`);
  lines.push(`- Next step: ${data.runtimeStatus.nextImplementationStep}`);
  lines.push("");
  lines.push("## Pack Domains");
  lines.push("");
  lines.push("| Domain | IDs | Present | Missing |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const [domain, stats] of Object.entries(data.packCoverage.domains)) {
    lines.push(`| ${domain} | ${stats.ids} | ${stats.present} | ${stats.missing} |`);
  }
  lines.push("");
  lines.push("## Important Models");
  lines.push("");
  lines.push("| TempNo | Name | ImgNo | Static Frame | Packs |");
  lines.push("| ---: | --- | ---: | --- | --- |");
  for (const row of data.importantModels.slice(0, 30)) {
    lines.push(`| ${row.tempNo} | ${row.name} | ${row.imageNo} | ${row.framePresent ? "yes" : "missing"} | ${packLabels(row.packs)} |`);
  }
  lines.push("");
  lines.push("## Classic Families");
  lines.push("");
  lines.push("| Family | Rows | ImgNos | Static Missing | Packed Frames |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const family of data.familyCoverage) {
    lines.push(`| ${family.family} | ${family.rows} | ${family.imageNos} | ${family.staticFramesMissing} | ${family.packedFrames} |`);
  }
  lines.push("");
  lines.push("## Pet-Like NPC Graphics");
  lines.push("");
  lines.push("| Graphic | Names | Frame | Packs | Sample Source |");
  lines.push("| ---: | --- | --- | --- | --- |");
  for (const item of data.petLikeNpcGraphics.slice(0, 40)) {
    const source = item.sources[0] || {};
    lines.push(`| ${item.graphic} | ${item.names.join(", ") || "-"} | ${item.framePresent ? "yes" : "missing"} | ${packLabels(item.packs)} | ${source.floor || ""} ${source.map || ""} ${source.npc || ""} |`);
  }
  lines.push("");
  lines.push("## Animation Source Files");
  lines.push("");
  lines.push("| File | Present | Bytes |");
  lines.push("| --- | --- | ---: |");
  for (const file of data.clientAnimationFiles) {
    lines.push(`| ${file.name} | ${file.present ? "yes" : "no"} | ${file.bytes || 0} |`);
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push("- This report intentionally separates static enemybase ImgNo coverage from true field/battle animation coverage.");
  lines.push("- Passing static coverage means PET STATUS and fallback field sprites can show original-source images; it does not prove walk/battle action sets are wired.");
  lines.push("- Follow the slim guide by adding separate lazy packs for pet field animation and pet battle animation, rather than enlarging the boot atlas again.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function packLabels(packs) {
  if (!packs?.length) return "-";
  return packs.map((pack) => `${pack.id}:${pack.domain}`).join(", ");
}
