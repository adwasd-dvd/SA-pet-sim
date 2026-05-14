import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const refRoot = path.join(appRoot, "external", "sources", "ref___data");
const refMapRoot = path.join(refRoot, "map");
const publicRoot = path.join(appRoot, "public");
const publicMapRoot = path.join(publicRoot, "data", "maps");
const publicClientMapRoot = path.join(publicRoot, "data", "client-maps");
const manifestPath = path.join(appRoot, "docs", "planning", "classic-core-closure-manifest.json");
const reportJsonOut = path.join(appRoot, "docs", "planning", "classic-core-package-report.json");
const reportMarkdownOut = path.join(appRoot, "docs", "planning", "CLASSIC_CORE_PACKAGE_REPORT.md");
const gb18030 = new TextDecoder("gb18030");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const classicProfile = manifest.profiles.find((profile) => profile.id === "classic-core");
if (!classicProfile) throw new Error("classic-core profile missing from closure manifest");

const fullFloors = new Set(Object.keys(WORLD.maps || {}).map((floor) => Number(floor)));
const classicFloors = new Set((classicProfile.floors || []).map((item) => Number(item.floor ?? item)).filter(Number.isFinite));
const fullProfile = profileStats("full-dev-current", fullFloors);
const classicStats = profileStats("classic-core", classicFloors);
const sharedPublic = sharedPublicStats();
const omittedFloors = omittedFloorStats(fullFloors, classicFloors).slice(0, 20);

const reportBody = {
  sourcePolicy: "Package estimates are computed from local WORLD data, the classic-core closure manifest, and current public map/client-map files. They do not invent or modify resources.",
  currentPublic: publicStats(),
  sharedPublic,
  profiles: [fullProfile, classicStats],
  comparison: compareProfiles(fullProfile, classicStats, sharedPublic),
  omittedLargestFloors: omittedFloors,
  followUps: [
    "Switching the deployed build to classic-core would remove map/client-map files outside the profile, but the shared client tile atlas is still monolithic.",
    "Next asset-pipeline work should split UI, map tiles, pet portraits, field sprites, and battle sprites into lazy packs before moving optional packs to R2.",
    "Do not delete source-only floors or advanced lines; keep them staged behind profile closure until their complete quest dependencies are enabled."
  ]
};

const report = {
  generatedAt: stableGeneratedAt(reportJsonOut, reportBody),
  ...reportBody
};

writeFileSync(reportJsonOut, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(reportMarkdownOut, renderMarkdown(report));
console.log(`Wrote ${path.relative(appRoot, reportMarkdownOut)}`);
console.log(`Wrote ${path.relative(appRoot, reportJsonOut)}`);
console.log(`classic-core estimated raw saving: ${formatBytes(report.comparison.estimatedRawSavings.bytes)} (${report.comparison.estimatedRawSavings.percent.toFixed(1)}%)`);

function profileStats(id, floorSet) {
  const floors = [...floorSet].sort((a, b) => a - b);
  const floorStats = floors.map((floor) => floorAssetStats(floor));
  const mapAssets = sumAssetStats(floorStats.map((item) => item.map).filter(Boolean));
  const clientMapAssets = sumAssetStats(floorStats.map((item) => item.clientMap).filter(Boolean));
  const worldModel = worldModelStats(floorSet, id);
  const missing = floorStats
    .filter((item) => !item.map?.exists || !item.clientMap?.exists)
    .map((item) => ({
      floor: item.floor,
      name: item.name,
      missingMap: !item.map?.exists,
      missingClientMap: !item.clientMap?.exists
    }));
  return {
    id,
    floorCount: floors.length,
    npcCount: floors.reduce((sum, floor) => sum + ((WORLD.maps[String(floor)]?.npcs || []).length), 0),
    activeExitCount: worldModel.activeExitCount,
    profileClosedExitCount: id === "classic-core" ? countProfileClosedExitClusters(floorSet) : worldModel.profileClosedExitCount,
    mapAssets,
    clientMapAssets,
    worldModel,
    profileRawBytes: mapAssets.bytes + clientMapAssets.bytes + worldModel.bytes,
    profileGzipBytes: mapAssets.gzipBytes + clientMapAssets.gzipBytes + worldModel.gzipBytes,
    missing
  };
}

function floorAssetStats(floor) {
  const map = WORLD.maps[String(floor)] || {};
  return {
    floor,
    name: map.name || map.summary || `floor ${floor}`,
    map: fileAssetStats(path.join(publicMapRoot, `${floor}.ls2map`)),
    clientMap: fileAssetStats(path.join(publicClientMapRoot, `${floor}.dat`))
  };
}

function omittedFloorStats(fullSet, keepSet) {
  return [...fullSet]
    .filter((floor) => !keepSet.has(floor))
    .map((floor) => {
      const stats = floorAssetStats(floor);
      const bytes = (stats.map?.bytes || 0) + (stats.clientMap?.bytes || 0);
      const gzipBytes = (stats.map?.gzipBytes || 0) + (stats.clientMap?.gzipBytes || 0);
      return { floor, name: stats.name, bytes, gzipBytes };
    })
    .sort((a, b) => b.bytes - a.bytes || a.floor - b.floor);
}

function compareProfiles(full, classic, shared) {
  const fullEstimatedRaw = shared.bytes + full.profileRawBytes;
  const classicEstimatedRaw = shared.bytes + classic.profileRawBytes;
  const fullEstimatedGzip = shared.gzipBytes + full.profileGzipBytes;
  const classicEstimatedGzip = shared.gzipBytes + classic.profileGzipBytes;
  return {
    floorSavings: full.floorCount - classic.floorCount,
    npcDelta: classic.npcCount - full.npcCount,
    estimatedRawBytes: { fullDev: fullEstimatedRaw, classicCore: classicEstimatedRaw },
    estimatedGzipBytes: { fullDev: fullEstimatedGzip, classicCore: classicEstimatedGzip },
    estimatedRawSavings: savings(fullEstimatedRaw, classicEstimatedRaw),
    estimatedGzipSavings: savings(fullEstimatedGzip, classicEstimatedGzip),
    mapAssetSavings: savings(full.mapAssets.bytes + full.clientMapAssets.bytes, classic.mapAssets.bytes + classic.clientMapAssets.bytes),
    worldModelSavings: savings(full.worldModel.bytes, classic.worldModel.bytes),
    unchangedSharedAssets: {
      bytes: shared.bytes,
      gzipBytes: shared.gzipBytes,
      note: "Shared assets include the current monolithic client tile atlas and data tables; these require later resource-pack extraction to shrink further."
    }
  };
}

function sharedPublicStats() {
  const files = walk(publicRoot)
    .filter((file) => !isMapAsset(file) && !isClientMapAsset(file));
  return sumAssetStats(files.map(fileAssetStats));
}

function publicStats() {
  const files = walk(publicRoot).map(fileAssetStats);
  return {
    fileCount: files.length,
    ...sumAssetStats(files)
  };
}

function worldModelStats(floorSet, id) {
  const maps = {};
  let activeExitCount = 0;
  let profileClosedExitCount = 0;
  for (const floor of [...floorSet].sort((a, b) => a - b)) {
    const map = WORLD.maps[String(floor)];
    if (!map) continue;
    const profileMap = id === "classic-core" ? profileFilteredMap(map, floorSet) : map;
    activeExitCount += (profileMap.exits || []).length;
    profileClosedExitCount += (profileMap.profileClosedExits || []).length;
    maps[String(floor)] = profileMap;
  }
  const body = {
    source: WORLD.source,
    startMap: WORLD.startMap,
    maps,
    quests: WORLD.quests
  };
  const text = `export const WORLD = ${JSON.stringify(body, null, 2)};\n`;
  return {
    bytes: Buffer.byteLength(text),
    gzipBytes: gzipSync(text).byteLength,
    activeExitCount,
    profileClosedExitCount
  };
}

function profileFilteredMap(map, floorSet) {
  const activeExits = (map.exits || []).filter((exit) => floorSet.has(Number(exit.to)));
  const closedExits = (map.exits || [])
    .filter((exit) => !floorSet.has(Number(exit.to)))
    .map((exit, index) => ({
      id: `closed-${exit.to}-${index}`,
      label: exit.label,
      detail: `${WORLD.maps[String(exit.to)]?.name || exit.to || "未开放地图"} | floor ${exit.to} | classic-core 暂未开放`,
      to: String(exit.to),
      toName: WORLD.maps[String(exit.to)]?.name || "",
      x: exit.x,
      y: exit.y,
      bounds: exit.bounds,
      target: exit.target,
      tiles: exit.tiles,
      source: exit.source,
      status: "closed-or-hidden-until-profile-enabled",
      reason: `classic-core profile 未启用 ${WORLD.maps[String(exit.to)]?.name || `floor ${exit.to}`}`
    }));
  return {
    ...map,
    exits: activeExits,
    ...(closedExits.length ? { profileClosedExits: closedExits } : {})
  };
}

function countProfileClosedExitClusters(floorSet) {
  const sourceMaps = scanSourceMapFiles();
  const warps = parseWarps(path.join(refMapRoot, "mapwarp.txt"));
  let count = 0;
  for (const floor of floorSet) {
    const closedSourceWarps = (warps.get(Number(floor)) || [])
      .filter((warp) => !floorSet.has(Number(warp.toFloor)) && sourceMaps.has(Number(warp.toFloor)));
    count += clusterWarps(closedSourceWarps).length;
  }
  return count;
}

function scanSourceMapFiles() {
  const files = new Set();
  for (const file of walk(refMapRoot)) {
    const buf = readFileSync(file);
    if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") continue;
    files.add(buf.readUInt16BE(6));
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
    const list = out.get(from[0]) || [];
    list.push({ floor: from[0], x: from[1], y: from[2], toFloor: to[0], toX: to[1], toY: to[2] });
    out.set(from[0], list);
  }
  return out;
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

function fileAssetStats(file) {
  if (!existsSync(file)) return { path: relative(file), exists: false, bytes: 0, gzipBytes: 0 };
  const bytes = statSync(file).size;
  return {
    path: relative(file),
    exists: true,
    bytes,
    gzipBytes: gzipSync(readFileSync(file)).byteLength
  };
}

function readText(file) {
  return gb18030.decode(readFileSync(file));
}

function sumAssetStats(items) {
  return {
    fileCount: items.length,
    bytes: items.reduce((sum, item) => sum + (item?.bytes || 0), 0),
    gzipBytes: items.reduce((sum, item) => sum + (item?.gzipBytes || 0), 0)
  };
}

function savings(fullBytes, classicBytes) {
  const bytes = fullBytes - classicBytes;
  return {
    bytes,
    percent: fullBytes > 0 ? (bytes / fullBytes) * 100 : 0
  };
}

function renderMarkdown(report) {
  const [full, classic] = report.profiles;
  const rows = [
    ["Floors", full.floorCount, classic.floorCount, report.comparison.floorSavings],
    ["NPCs", full.npcCount, classic.npcCount, report.comparison.npcDelta],
    ["Active exits", full.activeExitCount, classic.activeExitCount, classic.activeExitCount - full.activeExitCount],
    ["Profile-closed exits", full.profileClosedExitCount, classic.profileClosedExitCount, classic.profileClosedExitCount - full.profileClosedExitCount],
    ["LS2MAP raw", formatBytes(full.mapAssets.bytes), formatBytes(classic.mapAssets.bytes), formatBytes(full.mapAssets.bytes - classic.mapAssets.bytes)],
    ["Client DAT raw", formatBytes(full.clientMapAssets.bytes), formatBytes(classic.clientMapAssets.bytes), formatBytes(full.clientMapAssets.bytes - classic.clientMapAssets.bytes)],
    ["WORLD model raw", formatBytes(full.worldModel.bytes), formatBytes(classic.worldModel.bytes), formatBytes(full.worldModel.bytes - classic.worldModel.bytes)],
    ["Estimated raw package", formatBytes(report.comparison.estimatedRawBytes.fullDev), formatBytes(report.comparison.estimatedRawBytes.classicCore), `${formatBytes(report.comparison.estimatedRawSavings.bytes)} (${report.comparison.estimatedRawSavings.percent.toFixed(1)}%)`],
    ["Estimated gzip package", formatBytes(report.comparison.estimatedGzipBytes.fullDev), formatBytes(report.comparison.estimatedGzipBytes.classicCore), `${formatBytes(report.comparison.estimatedGzipSavings.bytes)} (${report.comparison.estimatedGzipSavings.percent.toFixed(1)}%)`]
  ];
  const omitted = report.omittedLargestFloors
    .map((item) => `| ${item.floor} | ${escapePipes(item.name)} | ${formatBytes(item.bytes)} | ${formatBytes(item.gzipBytes)} |`)
    .join("\n");
  const missing = classic.missing.length
    ? classic.missing.map((item) => `- floor ${item.floor} ${item.name}: ${item.missingMap ? "missing LS2MAP " : ""}${item.missingClientMap ? "missing DAT" : ""}`).join("\n")
    : "- None.";
  return `# Classic Core Package Report

Generated at: ${report.generatedAt}

${report.sourcePolicy}

## Summary

Current public directory: ${report.currentPublic.fileCount} files, ${formatBytes(report.currentPublic.bytes)} raw, ${formatBytes(report.currentPublic.gzipBytes)} gzip-estimated.

Shared assets not yet profile-filtered: ${report.sharedPublic.fileCount} files, ${formatBytes(report.sharedPublic.bytes)} raw, ${formatBytes(report.sharedPublic.gzipBytes)} gzip-estimated.

| Metric | Full-dev current | Classic-core estimate | Difference |
| --- | ---: | ---: | ---: |
${rows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} |`).join("\n")}

## Largest Omitted Current Floors

These are full-dev generated floors not present in the current classic-core profile estimate. They should stay closed/staged unless a complete source quest line enables them.

| Floor | Name | Raw map+DAT | Gzip-estimated |
| ---: | --- | ---: | ---: |
${omitted || "| - | - | - | - |"}

## Classic-Core Missing Assets

${missing}

## Notes

${report.followUps.map((item) => `- ${item}`).join("\n")}
`;
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(2)} MiB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KiB`;
  return `${value} B`;
}

function stableGeneratedAt(existingPath, body) {
  if (!existsSync(existingPath)) return new Date().toISOString();
  try {
    const existing = JSON.parse(readFileSync(existingPath, "utf8"));
    const { generatedAt: _old, ...oldBody } = existing;
    if (JSON.stringify(oldBody) === JSON.stringify(body)) return existing.generatedAt || new Date().toISOString();
  } catch {
    // Ignore malformed old reports.
  }
  return new Date().toISOString();
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

function isMapAsset(file) {
  return path.dirname(file) === publicMapRoot && file.endsWith(".ls2map");
}

function isClientMapAsset(file) {
  return path.dirname(file) === publicClientMapRoot && file.endsWith(".dat");
}

function relative(file) {
  return path.relative(appRoot, file).replaceAll(path.sep, "/");
}

function escapePipes(value) {
  return String(value || "").replaceAll("|", "\\|");
}
