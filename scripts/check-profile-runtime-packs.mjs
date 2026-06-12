import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const closureManifestPath = path.join(root, "docs/planning/classic-core-closure-manifest.json");
const keepSetPath = path.join(root, "public/data/profiles/classic-core/texture-keep-set.json");
const packPlanPath = path.join(root, "public/data/profiles/classic-core/profile-texture-pack-plan.json");
const packsRoot = path.dirname(packPlanPath);

const closureManifest = readJson(closureManifestPath);
const keepSet = readJson(keepSetPath);
const packPlan = readJson(packPlanPath);
const packById = new Map((packPlan.packs || []).map((pack) => [String(pack.id), pack]));
const manifestIdCache = new Map();
const issues = [];

const floorDetails = keepSet.floorDetails || {};
let checkedFloors = 0;
let okFloors = 0;

assertKeepSetMatchesClosure();

for (const [floor, detail] of Object.entries(floorDetails)) {
  checkedFloors += 1;
  const requiredMapIds = uniqueSorted(detail.mapTileIds || detail.presentIds || []);
  if (!requiredMapIds.length) {
    okFloors += 1;
    continue;
  }

  const planRefs = (packPlan.floorPacks?.[floor]?.packs || []).map(normalizePackId).filter(Boolean);
  if (!planRefs.length) {
    addIssue("missing-floor-pack-plan", floor, `Floor ${floor} has no floorPacks plan entry.`);
    continue;
  }

  const planCoverage = idsCoveredByRefs(planRefs);
  const planMissing = requiredMapIds.filter((id) => !planCoverage.has(id));
  if (planMissing.length) {
    addIssue("floor-pack-plan-gap", floor, `Floor ${floor} floorPacks plan misses ${planMissing.length} map ids.`, planMissing);
    continue;
  }

  const runtimeRefs = runtimeRefsForFloor(floor).map(normalizePackId).filter(Boolean);
  const runtimeCoverage = idsCoveredByRefs(runtimeRefs);
  const runtimeMissing = requiredMapIds.filter((id) => !runtimeCoverage.has(id));
  if (runtimeMissing.length) {
    addIssue("runtime-floor-pack-gap", floor, `Floor ${floor} runtime manifest misses ${runtimeMissing.length} map ids.`, runtimeMissing);
    continue;
  }

  okFloors += 1;
}

const summary = {
  checkedFloors,
  okFloors,
  failedFloors: checkedFloors - okFloors,
  issues: issues.length
};

console.log(JSON.stringify({ v: 1, summary, issues }, null, 2));
if (issues.length) process.exit(1);

function assertKeepSetMatchesClosure() {
  const classicProfile = (closureManifest.profiles || []).find((profile) => profile.id === "classic-core");
  const closureFloors = uniqueSorted((classicProfile?.floors || []).map((entry) => entry?.floor ?? entry));
  const keepSetFloors = uniqueSorted(Object.keys(floorDetails));
  const missing = closureFloors.filter((floor) => !keepSetFloors.includes(floor));
  const extra = keepSetFloors.filter((floor) => !closureFloors.includes(floor));
  if (missing.length) {
    addIssue(
      "closure-keep-set-floor-gap",
      "classic-core",
      `Texture keep-set is missing ${missing.length} classic-core closure floors. Run npm run profile:assets:classic-core.`,
      missing
    );
  }
  if (extra.length) {
    addIssue(
      "keep-set-extra-floor",
      "classic-core",
      `Texture keep-set has ${extra.length} floors outside the classic-core closure manifest.`,
      extra
    );
  }
}

function runtimeRefsForFloor(floor) {
  const sketch = packPlan.runtimeManifestSketch || {};
  return [
    ...(sketch.bootPacks || []),
    ...(sketch.sharedPacks || []),
    ...(sketch.floors?.[String(floor)]?.packs || [])
  ];
}

function idsCoveredByRefs(refs) {
  const covered = new Set();
  for (const ref of refs) {
    for (const id of idsForPack(ref)) covered.add(id);
  }
  return covered;
}

function idsForPack(ref) {
  const packId = normalizePackId(ref);
  const pack = packById.get(packId);
  const manifestPath = path.join(packsRoot, "packs", `${packId}.json`);

  if (!fs.existsSync(manifestPath)) {
    addIssue("missing-runtime-pack-json", packId, `Pack ${packId} has no runtime JSON file at ${displayPath(manifestPath)}.`);
    return new Set(uniqueSorted(pack?.presentIds || []));
  }

  if (manifestIdCache.has(manifestPath)) return manifestIdCache.get(manifestPath);

  const manifest = readJson(manifestPath);
  const ids = new Set(parseCompactFrameIds(manifest));
  manifestIdCache.set(manifestPath, ids);
  return ids;
}

function parseCompactFrameIds(manifest) {
  if (!Array.isArray(manifest.frames)) return [];
  const fields = manifest.fields || [];
  const idIndex = fields.indexOf("id");
  if (idIndex < 0) return uniqueSorted(manifest.frames.map((frame) => frame?.id));
  return uniqueSorted(manifest.frames.map((row) => row?.[idIndex]));
}

function normalizePackId(ref) {
  return String(ref || "")
    .trim()
    .replace(/^packs\//, "")
    .replace(/\.json$/, "");
}

function addIssue(code, floor, message, missing = []) {
  issues.push({
    code,
    floor: String(floor),
    message,
    missingCount: missing.length,
    sample: missing.slice(0, 24)
  });
}

function uniqueSorted(values) {
  return [...new Set([...values].map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function displayPath(filePath) {
  const relative = path.relative(root, filePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative) ? relative : filePath;
}
