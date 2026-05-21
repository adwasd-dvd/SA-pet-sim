import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const clientMapRoot = path.join(projectRoot, "public/data/client-maps");
const logicMapRoot = path.join(projectRoot, "public/data/maps");
const atlasPath = path.join(projectRoot, "public/data/client-tiles/tiles.json");
const enemyBasePath = path.join(projectRoot, "public/data/enemybase2.txt");
const appPath = path.join(projectRoot, "public/assets/app.js");
const CG_INVISIBLE = 99;
const VISUAL_FALLBACK_SAMPLE_FLOORS = ["300", "5000"];
const SPARSE_INTERIOR_SAMPLE_FLOORS = ["5001", "5003", "5005"];

const atlas = readJson(atlasPath);
const frames = atlas?.frames || {};
const reports = [];
const missing = new Map();
const missingMetadata = new Map();
const missingEnemyImages = new Map();
const enemyImageCoverage = checkEnemyBaseImages();
const visualFallbackCoverage = checkVisualFallbackCoverage();
checkSparseRuntimeGuard();
const objectOnlyFallbackRisk = checkObjectOnlyFallbackGuard();
const sparseInteriorCoverage = checkSparseInteriorGuard();

for (const file of listFiles(clientMapRoot, ".dat")) {
  const report = checkClientDat(file);
  if (report) reports.push(report);
}

for (const file of listFiles(logicMapRoot, ".ls2map")) {
  const report = checkLs2Map(file);
  if (report) reports.push(report);
}

reports.sort((a, b) => b.cells - a.cells || a.name.localeCompare(b.name));

if (missing.size) {
  console.error("Missing map atlas frames:");
  for (const [id, count] of [...missing.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40)) {
    console.error(`  ${id}: ${count} references`);
  }
  process.exit(1);
}

if (missingMetadata.size) {
  console.error("Missing map atlas priority metadata:");
  for (const [id, fields] of [...missingMetadata.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).slice(0, 40)) {
    console.error(`  ${id}: ${[...fields].sort().join(", ")}`);
  }
  process.exit(1);
}

if (missingEnemyImages.size) {
  console.error("Missing pet/enemy ImgNo atlas frames:");
  for (const [id, refs] of [...missingEnemyImages.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).slice(0, 40)) {
    console.error(`  ${id}: ${refs.slice(0, 6).join("; ")}`);
  }
  process.exit(1);
}

const largest = reports.slice(0, 8).map((report) => (
  `${report.name} ${report.width}x${report.height} cells=${report.cells} drawable=${report.drawable} control=${report.control}`
));

console.log(`Map atlas coverage OK: ${reports.length} maps, ${Object.keys(frames).length} atlas frames.`);
console.log(`Pet/enemy static ImgNo coverage OK: ${enemyImageCoverage.covered}/${enemyImageCoverage.total} enemybase2 images.`);
if (visualFallbackCoverage.length) {
  console.log(`Client visual ground fallback OK: ${visualFallbackCoverage.map((item) => `${item.floor}:${item.groundFill}`).join(", ")} LS2 ground fills.`);
}
if (sparseInteriorCoverage.length) {
  const summary = sparseInteriorCoverage
    .map((item) => `${item.floor}:${item.missingGround} missing/${item.lowControlRefs} low-control/${item.frontendBlocked} blocked`)
    .join(", ");
  console.log(`Sparse original interior outside-black OK: ${summary}; low-id part refs stay non-drawable outside the real floor.`);
}
console.log(`LS2 object-only fallback guard OK: ${objectOnlyFallbackRisk.riskyFloors} floor(s) have potential object-only fallback cells but runtime keeps them black.`);
for (const line of largest) console.log(`  ${line}`);

function checkVisualFallbackCoverage() {
  const coverage = [];
  for (const floor of VISUAL_FALLBACK_SAMPLE_FLOORS) {
    const clientFile = path.join(clientMapRoot, `${floor}.dat`);
    const logicFile = path.join(logicMapRoot, `${floor}.ls2map`);
    if (!fs.existsSync(clientFile) || !fs.existsSync(logicFile)) continue;
    const clientMap = readClientDat(clientFile);
    const logicMap = readLs2Map(logicFile);
    if (clientMap.width !== logicMap.width || clientMap.height !== logicMap.height) {
      throw new Error(`Visual fallback dimension mismatch on floor ${floor}`);
    }
    let groundFill = 0;
    for (let index = 0; index < clientMap.cells; index += 1) {
      const clientGround = clientMap.ground(index);
      const logicGround = logicMap.ground(index);
      if (clientGround <= CG_INVISIBLE && logicGround > CG_INVISIBLE) groundFill += 1;
    }
    if (!groundFill) throw new Error(`Expected LS2 visual ground fallback cells for floor ${floor}`);
    coverage.push({ floor, groundFill });
  }
  return coverage;
}

function checkSparseInteriorGuard() {
  const coverage = [];
  for (const floor of SPARSE_INTERIOR_SAMPLE_FLOORS) {
    const clientFile = path.join(clientMapRoot, `${floor}.dat`);
    const logicFile = path.join(logicMapRoot, `${floor}.ls2map`);
    if (!fs.existsSync(clientFile) || !fs.existsSync(logicFile)) continue;
    const clientMap = readClientDat(clientFile);
    const logicMap = readLs2Map(logicFile);
    if (clientMap.width !== logicMap.width || clientMap.height !== logicMap.height) {
      throw new Error(`Sparse interior dimension mismatch on floor ${floor}`);
    }

    let missingGround = 0;
    let groundFill = 0;
    let objectFill = 0;
    let lowControlRefs = 0;
    let frontendLeaks = 0;
    let frontendBlocked = 0;
    for (let index = 0; index < clientMap.cells; index += 1) {
      const clientGround = clientMap.ground(index);
      const clientPart = clientMap.part(index);
      const logicGround = logicMap.ground(index);
      const logicPart = logicMap.part(index);
      if (clientGround <= CG_INVISIBLE) missingGround += 1;
      if (clientGround <= CG_INVISIBLE && logicGround > CG_INVISIBLE) groundFill += 1;
      if (clientGround <= CG_INVISIBLE && logicPart > CG_INVISIBLE) objectFill += 1;
      if (clientGround <= CG_INVISIBLE && clientPart > 0 && clientPart <= CG_INVISIBLE) lowControlRefs += 1;
      if (clientGround <= CG_INVISIBLE) {
        if (frontendWouldDrawGround(clientGround) || frontendWouldDrawObject(clientPart)) {
          frontendLeaks += 1;
        } else if (clientPart > 0) {
          frontendBlocked += 1;
        }
      }
    }

    if (missingGround < Math.floor(clientMap.cells / 2)) {
      throw new Error(`Expected sparse original interior ground cells for floor ${floor}`);
    }
    if (groundFill) {
      throw new Error(`Floor ${floor} has LS2 ground fallback cells; move it to VISUAL_FALLBACK_SAMPLE_FLOORS instead of sparse guard`);
    }
    if (objectFill) {
      throw new Error(`Floor ${floor} has LS2 object fallback cells outside client ground; keep sparse interiors outside-black instead`);
    }
    if (!lowControlRefs) {
      throw new Error(`Expected low control part refs on sparse original interior floor ${floor}`);
    }
    if (frontendLeaks) {
      throw new Error(`Floor ${floor} would draw ${frontendLeaks} missing-ground cells in the frontend sparse-interior path`);
    }
    coverage.push({ floor, missingGround, lowControlRefs, frontendBlocked });
  }
  return coverage;
}

function checkSparseRuntimeGuard() {
  const appSource = fs.readFileSync(appPath, "utf8");
  const match = appSource.match(/SPARSE_INTERIOR_OUTSIDE_BLACK_FLOORS\s*=\s*new Set\(\[([^\]]+)\]\)/);
  if (!match) throw new Error("Missing runtime sparse-interior outside-black floor guard in app.js");
  for (const floor of SPARSE_INTERIOR_SAMPLE_FLOORS) {
    if (!match[1].includes(`"${floor}"`)) {
      throw new Error(`Runtime sparse-interior outside-black guard is missing floor ${floor}`);
    }
  }
  if (!appSource.includes("isSparseInteriorOutsideBlackFloor(map?.floorId)")) {
    throw new Error("Runtime sparse-interior outside-black guard is not applied before LS2 visual fallback");
  }
}

function checkObjectOnlyFallbackGuard() {
  const appSource = fs.readFileSync(appPath, "utf8");
  if (!appSource.includes("if (!groundFill) return null;")) {
    throw new Error("Runtime must not apply LS2 visual fallback when it can only add object tiles and no real ground");
  }
  if (!appSource.includes("const visualGround = ground > CG_INVISIBLE ? ground : fallbackGround;")) {
    throw new Error("Runtime LS2 visual fallback must compute visualGround before choosing fallback objects");
  }
  if (!appSource.includes("visualGround > CG_INVISIBLE && isStaticMapObjectTile(fallbackObject)")) {
    throw new Error("Runtime LS2 visual fallback must block fallback object tiles when the visual ground is still outside-black");
  }

  let riskyFloors = 0;
  for (const clientFile of listFiles(clientMapRoot, ".dat")) {
    const floor = path.basename(clientFile, ".dat");
    const logicFile = path.join(logicMapRoot, `${floor}.ls2map`);
    if (!fs.existsSync(logicFile)) continue;
    const clientMap = readClientDat(clientFile);
    const logicMap = readLs2Map(logicFile);
    if (clientMap.width !== logicMap.width || clientMap.height !== logicMap.height) continue;
    let groundFill = 0;
    let objectOnlyCells = 0;
    for (let index = 0; index < clientMap.cells; index += 1) {
      const clientGround = clientMap.ground(index);
      const clientPart = clientMap.part(index);
      const logicGround = logicMap.ground(index);
      const logicPart = logicMap.part(index);
      if (clientGround <= CG_INVISIBLE && logicGround > CG_INVISIBLE) groundFill += 1;
      if (
        clientGround <= CG_INVISIBLE
        && logicGround <= CG_INVISIBLE
        && !frontendWouldDrawObject(clientPart)
        && frontendWouldDrawObject(logicPart)
      ) {
        objectOnlyCells += 1;
      }
    }
    if (groundFill > 0 && objectOnlyCells > 0) riskyFloors += 1;
  }
  return { riskyFloors };
}

function frontendWouldDrawGround(tileId, lowGroundTiles = null) {
  const id = Number(tileId || 0);
  return id > CG_INVISIBLE || Boolean(lowGroundTiles?.has?.(id));
}

function frontendWouldDrawObject(tileId) {
  const id = Number(tileId || 0);
  return id > CG_INVISIBLE;
}

function checkEnemyBaseImages() {
  let total = 0;
  let covered = 0;
  if (!fs.existsSync(enemyBasePath)) return { total, covered };
  for (const line of fs.readFileSync(enemyBasePath, "utf8").split(/\r?\n/)) {
    const rows = line.split(",");
    if (rows.length < 37) continue;
    const imageNo = Number(rows[36]);
    if (!Number.isFinite(imageNo) || imageNo <= CG_INVISIBLE) continue;
    total += 1;
    if (frames[imageNo]) {
      covered += 1;
      continue;
    }
    const ref = `${rows[0] || "unnamed"} petNo ${rows[6] || "?"}`;
    if (!missingEnemyImages.has(imageNo)) missingEnemyImages.set(imageNo, []);
    missingEnemyImages.get(imageNo).push(ref);
  }
  return { total, covered };
}

function checkClientDat(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 8) return null;
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  const cells = width * height;
  const layerSize = cells * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.length < expected) throw new Error(`Invalid DAT map: ${file}`);
  const report = mapReport(file, width, height);
  for (let index = 0; index < cells; index += 1) {
    includeTile(report, buf.readUInt16LE(8 + index * 2));
    includeTile(report, buf.readUInt16LE(8 + layerSize + index * 2));
  }
  return report;
}

function readClientDat(file) {
  const buf = fs.readFileSync(file);
  const width = buf.readUInt32LE(0);
  const height = buf.readUInt32LE(4);
  const cells = width * height;
  const layerSize = cells * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.length < expected) throw new Error(`Invalid DAT map: ${file}`);
  return {
    width,
    height,
    cells,
    ground(index) {
      return buf.readUInt16LE(8 + index * 2);
    },
    part(index) {
      return buf.readUInt16LE(8 + layerSize + index * 2);
    }
  };
}

function readLs2Map(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") throw new Error(`Invalid LS2MAP map: ${file}`);
  const width = buf.readUInt16BE(0x28);
  const height = buf.readUInt16BE(0x2a);
  const cells = width * height;
  const layerSize = cells * 2;
  const expected = 44 + layerSize * 2;
  if (!width || !height || buf.length < expected) throw new Error(`Invalid LS2MAP map: ${file}`);
  return {
    width,
    height,
    cells,
    ground(index) {
      return buf.readUInt16BE(44 + index * 2);
    },
    part(index) {
      return buf.readUInt16BE(44 + layerSize + index * 2);
    }
  };
}

function checkLs2Map(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") return null;
  const width = buf.readUInt16BE(0x28);
  const height = buf.readUInt16BE(0x2a);
  const cells = width * height;
  const layerSize = cells * 2;
  const expected = 44 + layerSize * 2;
  if (!width || !height || buf.length < expected) throw new Error(`Invalid LS2MAP map: ${file}`);
  const report = mapReport(file, width, height);
  for (let index = 0; index < cells; index += 1) {
    includeTile(report, buf.readUInt16BE(44 + index * 2));
    includeTile(report, buf.readUInt16BE(44 + layerSize + index * 2));
  }
  return report;
}

function includeTile(report, tileId) {
  if (!tileId) return;
  if (tileId <= CG_INVISIBLE) {
    report.control += 1;
    return;
  }
  report.drawable += 1;
  const frame = frames[tileId];
  if (!frame) {
    missing.set(tileId, (missing.get(tileId) || 0) + 1);
    return;
  }
  for (const field of ["bitmapNo", "hit", "hitRaw", "prioType", "hitX", "hitY", "heightFlag"]) {
    if (typeof frame[field] !== "number") {
      if (!missingMetadata.has(tileId)) missingMetadata.set(tileId, new Set());
      missingMetadata.get(tileId).add(field);
    }
  }
}

function mapReport(file, width, height) {
  return {
    name: path.relative(projectRoot, file),
    width,
    height,
    cells: width * height,
    drawable: 0,
    control: 0
  };
}

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing atlas manifest: ${file}`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith(ext))
    .map((file) => path.join(dir, file));
}
