import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const profileRoot = path.join(projectRoot, "public/data/profiles/classic-core");
const staticPackPath = path.join(profileRoot, "packs/pets-static-all.json");
const texturePlanPath = path.join(profileRoot, "profile-texture-pack-plan.json");
const fieldManifestPath = path.join(profileRoot, "pet-field-animations.json");

const importantPets = [
  { spriteNo: 100250, name: "乌力" },
  { spriteNo: 100251, name: "乌力乌力" },
  { spriteNo: 100252, name: "乌力斯坦" },
  { spriteNo: 100371, name: "奥卡洛斯" },
  { spriteNo: 100388, name: "黑乌力" }
];

const missing = [];
const staticPack = readJson(staticPackPath);
const texturePlan = readJson(texturePlanPath);
const fieldManifest = readJson(fieldManifestPath);
const staticFrames = frameIdSet(staticPack);
const keepSetStaticIds = profilePackIds(texturePlan, "pets-static-all");
const packCache = new Map();

for (const pet of importantPets) {
  if (!staticFrames.has(pet.spriteNo)) {
    missing.push(`${pet.name} ${pet.spriteNo}: missing static ImgNo frame in packs/pets-static-all.json`);
  }
  if (!keepSetStaticIds.has(pet.spriteNo)) {
    missing.push(`${pet.name} ${pet.spriteNo}: missing from profile-texture-pack-plan pets-static-all`);
  }

  const sprite = fieldManifest.sprites?.[pet.spriteNo];
  if (!sprite) {
    missing.push(`${pet.name} ${pet.spriteNo}: missing pet-field animation sprite entry`);
    continue;
  }
  if (!sprite.pack) {
    missing.push(`${pet.name} ${pet.spriteNo}: missing pet-field pack reference`);
    continue;
  }

  const pack = loadFieldPack(sprite.pack);
  const packFrames = frameIdSet(pack);
  for (const actionName of ["stand", "walk"]) {
    const action = sprite.actions?.[actionName] || {};
    const dirs = Object.keys(action);
    if (dirs.length !== 8) {
      missing.push(`${pet.name} ${pet.spriteNo}: expected 8 ${actionName} directions, found ${dirs.length}`);
    }
    for (let dir = 0; dir < 8; dir += 1) {
      const frames = action[String(dir)]?.[2] || [];
      if (!frames.length) {
        missing.push(`${pet.name} ${pet.spriteNo}: missing ${actionName} dir ${dir} animation frames`);
        continue;
      }
      const firstBitmapNo = Number(frames[0]?.[0]);
      if (!packFrames.has(firstBitmapNo)) {
        missing.push(`${pet.name} ${pet.spriteNo}: ${actionName} dir ${dir} first bitmap ${firstBitmapNo} not in ${sprite.pack}`);
      }
    }
  }
}

if (missing.length) {
  console.error("Pet asset resolution check failed:");
  for (const line of missing) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(`Pet asset resolution OK: ${importantPets.length} core pet sprites have static ImgNo portraits and 8-dir stand/walk field frames.`);

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required pet asset file: ${path.relative(projectRoot, file)}`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function frameIdSet(pack) {
  const ids = new Set();
  for (const frame of pack.frames || []) {
    const id = Array.isArray(frame) ? Number(frame[0]) : Number(frame?.id);
    if (Number.isFinite(id)) ids.add(id);
  }
  return ids;
}

function loadFieldPack(packRef) {
  if (packCache.has(packRef)) return packCache.get(packRef);
  const file = path.join(profileRoot, packRef);
  const pack = readJson(file);
  packCache.set(packRef, pack);
  return pack;
}

function profilePackIds(plan, id) {
  const pack = (plan.packs || []).find((item) => item.id === id);
  return new Set((pack?.ids || []).map((item) => Number(item)).filter(Number.isFinite));
}
