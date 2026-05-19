import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const clientMapRoot = path.join(projectRoot, "public/data/client-maps");
const logicMapRoot = path.join(projectRoot, "public/data/maps");
const atlasPath = path.join(projectRoot, "public/data/client-tiles/tiles.json");
const enemyBasePath = path.join(projectRoot, "public/data/enemybase2.txt");
const CG_INVISIBLE = 99;

const atlas = readJson(atlasPath);
const frames = atlas?.frames || {};
const reports = [];
const missing = new Map();
const missingMetadata = new Map();
const missingEnemyImages = new Map();
const enemyImageCoverage = checkEnemyBaseImages();

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
for (const line of largest) console.log(`  ${line}`);

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
