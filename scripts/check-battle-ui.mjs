import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const appJsPath = path.join(projectRoot, "public/assets/app.js");
const packageJsonPath = path.join(projectRoot, "package.json");
const appJs = fs.readFileSync(appJsPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

const failures = [];

expectIncludes("enemy battle facing direction", "const BATTLE_ENEMY_FACE_DIRECTION = 2;");
expectIncludes("ally battle facing direction", "const BATTLE_ALLY_FACE_DIRECTION = 6;");
expectIncludes("battle check is wired into npm check", "npm run check:battle-ui", JSON.stringify(packageJson.scripts || {}));

const directionFn = extractFunction("battleFormationUnitDirection");
expectIncludes("enemy units use source enemy face dir", "BATTLE_ENEMY_FACE_DIRECTION", directionFn);
expectIncludes("ally units use source ally face dir", "BATTLE_ALLY_FACE_DIRECTION", directionFn);
expectNotIncludes("battle unit direction must be deterministic", "Math.random", directionFn);

const positionFn = extractFunction("battleFormationUnitPosition");
expectNotIncludes("battle slot positions must be deterministic", "Math.random", positionFn);
const slots = extractSlotPairs(positionFn);
const enemySlots = slots.slice(0, 10);
const allySlots = slots.slice(10, 20);
if (enemySlots.length !== 10) {
  failures.push(`expected 10 source-side enemy battle slots, found ${enemySlots.length}`);
}
if (allySlots.length !== 10) {
  failures.push(`expected 10 source-side ally battle slots, found ${allySlots.length}`);
}
if (enemySlots.some(([x]) => x >= 62)) {
  failures.push("enemy battle slots must stay on the left/upper side of the battlefield");
}
if (allySlots.some(([x]) => x <= 62)) {
  failures.push("ally battle slots must stay on the right/lower side of the battlefield");
}
if (average(enemySlots.map(([, y]) => y)) >= average(allySlots.map(([, y]) => y))) {
  failures.push("enemy slots should average above ally slots so both sides face each other diagonally");
}

const renderFormationFn = extractFunction("renderBattleFormation");
expectIncludes("battle formation sprite uses shared face direction", "const faceDir = battleFormationUnitDirection(unit);", renderFormationFn);
expectIncludes("battle formation clickable target is tied to source battle number", "data-battle-target-no=\"${battleNo}\"", renderFormationFn);
expectIncludes("battle formation unit hitbox is tied to source battle number", "data-battle-no=\"${battleNo}\"", renderFormationFn);
expectIncludes("battle formation hydrates source directional sprites", "sourceSpriteAttrs(imgNo, spriteId, { dir: faceDir })", renderFormationFn);

const partyFn = extractFunction("renderBattleEnemyParty");
expectIncludes("enemy party thumbnails face the player side", "dir: BATTLE_ENEMY_FACE_DIRECTION", partyFn);
expectIncludes("enemy party target number uses source enemy offset", "data-battle-target-no=\"${BATTLE_SIDE_OFFSET + index}\"", partyFn);

const actorFn = extractFunction("battleActionActorNo");
expectIncludes("active pet actor uses source pet-side battle slot", "BATTLE_PLAYER_MAX + Math.max(0, Number(action.actorSlot || 0))", actorFn);

const lungeFn = extractFunction("playBattleLunge");
expectIncludes("attack animation finds actor by source battle number", "querySelector(`[data-battle-no=\"${Number(action.actorNo)}\"]`)", lungeFn);
expectIncludes("attack animation finds target by source battle number", "querySelector(`[data-battle-no=\"${Number(action.targetNo)}\"]`)", lungeFn);
expectIncludes("attack animation moves toward the target center", "targetRect.left + targetRect.width / 2", lungeFn);
expectIncludes("attack animation returns through CSS class reset", "source.classList.remove(\"is-attacking\")", lungeFn);

if (failures.length) {
  console.error("Battle UI check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("Battle UI OK: source-style facing, 10v10 slots, target hitboxes, and lunge animation are guarded.");

function expectIncludes(label, needle, haystack = appJs) {
  if (!haystack.includes(needle)) failures.push(`${label}: missing ${needle}`);
}

function expectNotIncludes(label, needle, haystack) {
  if (haystack.includes(needle)) failures.push(`${label}: unexpected ${needle}`);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
}

function extractSlotPairs(source) {
  return [...source.matchAll(/\[(\d+),\s*(\d+)\]/g)]
    .map((match) => [Number(match[1]), Number(match[2])])
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
}

function extractFunction(name) {
  const start = appJs.indexOf(`function ${name}(`);
  if (start < 0) {
    failures.push(`missing function ${name}`);
    return "";
  }
  const paramsEnd = appJs.indexOf(")", start);
  const bodyStart = paramsEnd >= 0 ? appJs.indexOf("{", paramsEnd) : -1;
  if (bodyStart < 0) {
    failures.push(`missing body for function ${name}`);
    return "";
  }
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let i = bodyStart; i < appJs.length; i += 1) {
    const ch = appJs[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = "";
      }
      continue;
    }
    if (ch === "\"" || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return appJs.slice(start, i + 1);
    }
  }
  failures.push(`unterminated function ${name}`);
  return "";
}
