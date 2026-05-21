import { readFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const workerJs = readFileSync(path.join(appRoot, "src/worker.js"), "utf8");
const appJs = readFileSync(path.join(appRoot, "public/assets/app.js"), "utf8");
const npcCheck = readFileSync(path.join(appRoot, "scripts/check-npc-actions.mjs"), "utf8");
const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

const failures = [];

expect(
  pkg.scripts?.["check:item-effects"] === "node scripts/check-item-effects.mjs",
  "package.json must expose check:item-effects"
);
expect(
  String(pkg.scripts?.check || "").includes("npm run check:item-effects"),
  "npm run check must include check:item-effects"
);

expectIncludes("Worker exposes deterministic use-item endpoint", 'url.pathname === "/api/game/use-item"', workerJs);

const useItemGame = extractFunction(workerJs, "useItemGame");
for (const snippet of [
  "hydrateInventoryItemFromSource(item, data?.itemSet);",
  "hydrateRuntimeItemEffect(item, data);",
  "applyUsableItem(game, item)",
  "triggerItemEncounter(env, request, game, itemUse)",
  "return withMap(game, { itemUse });"
]) {
  expectIncludes(`useItemGame keeps source item pipeline: ${snippet}`, snippet, useItemGame);
}

const itemEffect = extractFunction(workerJs, "itemEffect");
for (const snippet of [
  "const warpFunction = /ITEM_useWarp/i.test(functionName);",
  "const deathCounterFunction = /ITEM_useDeathcounter/i.test(functionName);",
  "const encounterFunction = /ITEM_useEncounter/i.test(functionName);",
  "const noEnemyFunction = /ITEM_useNoenemy/i.test(functionName);",
  "const goldFunction = /ITEM_Gold/i.test(functionName);",
  "const skillCannedFunction = /ITEM_useSkillCanned/i.test(functionName);",
  "const captureUpFunction = /ITEM_useCaptureUp/i.test(functionName);",
  "const statusChangeFunction = /ITEM_useStatusChange/i.test(functionName);",
  'kind: "warp"',
  'kind: "encounter"',
  'kind: "noEncounter"',
  'kind: "gold"',
  'kind: "petSkillCan"',
  'kind: "captureUp"',
  'kind: "statusInflict"',
  "uses: /ITEM_useWarpForNum/i.test(functionName) ? itemUseCount(item) : -1"
]) {
  expectIncludes(`itemEffect preserves source function ${snippet}`, snippet, itemEffect);
}

const applyItemUseAction = extractFunction(workerJs, "applyItemUseAction");
for (const snippet of [
  'if (action.kind === "noEncounter")',
  'if (action.kind === "gold")',
  'if (action.kind === "petSkillCan")',
  'if (action.kind === "captureUp")',
  'if (action.kind === "statusInflict")',
  'if (action.kind === "warp")',
  "syncStoneItem(game)",
  "syncActiveEnemyPartyEntry(game, target)",
  "applyBattleStatus(target, action.status"
]) {
  expectIncludes(`applyItemUseAction applies source effect ${snippet}`, snippet, applyItemUseAction);
}

const hydrateInventoryItemFromSource = extractFunction(workerJs, "hydrateInventoryItemFromSource");
for (const snippet of [
  "const sourceItem = itemSet?.get(id) || worldTradeItemIndex().get(id);",
  "if (!itemNameCompatibleWithSource(item, sourceItem)) return item;",
  '"functionName"',
  '"option"',
  "sourceItem.damageBreak",
  "item.usesRemaining = sourceDamageBreak",
  "item.source ||= `${GMSV_DATA_SOURCE}/itemset6.txt`;"
]) {
  expectIncludes(`source item hydration keeps ${snippet}`, snippet, hydrateInventoryItemFromSource);
}

const inventoryItemUsable = extractFunction(appJs, "inventoryItemUsable");
for (const snippet of [
  "ITEM_useWarp",
  "ITEM_useWarpForNum",
  "ITEM_useDeathcounter",
  "ITEM_useEncounter",
  "ITEM_useNoenemy",
  "ITEM_useCaptureUp",
  "ITEM_useSkillCanned",
  "ITEM_Gold",
  "ITEM_useStatusChange",
  "羽毛",
  "恶魔宝石",
  "原地遇敌",
  "飞行"
]) {
  expectIncludes(`client inventory usability recognizes ${snippet}`, snippet, inventoryItemUsable);
}

for (const [label, snippets] of [
  ["safe demon gem refusal", ["safeGemGame", "恶魔宝石LV1", "ITEM_useDeathcounter", "不能触发原地遇敌"]],
  ["source demon gem encounter", ["deathCounterGame", "ITEM_useDeathcounter starts an immediate source encounter", "usesRemaining), 2"]],
  ["direct spirit feather warp", ["featherGame", "id: 20912", "精灵的羽毛", "ITEM_useWarp", "mapId, \"7000\""]],
  ["direct memory feather charges", ["memoryFeatherGame", "id: 1345", "记忆的羽毛", "ITEM_useWarpForNum", "usesRemaining), 1"]],
  ["raw saved spirit feather hydration", ["rawFeatherGame", "sync hydrates raw saved feather", "raw saved feather id hydrates ITEM_useWarp"]],
  ["raw saved memory feather hydration", ["rawMemoryFeatherGame", "sync hydrates raw saved memory feather", "raw saved memory feather hydrates ITEM_useWarpForNum"]],
  ["raw saved demon gem hydration", ["rawDeathCounterGame", "id: 20129", "sync hydrates raw saved demon gem", "raw saved demon gem id hydrates ITEM_useDeathcounter"]],
  ["AI guide raw source item use", ["guideRawFeatherGame", "guideRawGemGame", "AI guide hydrates raw saved source items", "AI guide raw demon gem use triggers the source encounter path"]],
  ["gold voucher effect", ["goldVoucherGame", "ITEM_Gold adds source stone amount", "ITEM_Gold consumes one voucher item"]],
  ["skill canned effect", ["skillCanGame", "ITEM_useSkillCanned teaches the option skill id", "ITEM_useSkillCanned consumes one canned skill item"]],
  ["capture-up battle effect", ["captureUpGame", "ITEM_useCaptureUp raises capture rate by item option", "ITEM_useCaptureUp consumes one battle item"]],
  ["status-change battle effect", ["statusChangeItemGame", "ITEM_useStatusChange applies battle status", "ITEM_useStatusChange consumes one battle item"]]
]) {
  for (const snippet of snippets) {
    expectIncludes(`check:npc covers ${label}: ${snippet}`, snippet, npcCheck);
  }
}

if (failures.length) {
  console.error("Item effects check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("Item effects OK: source item hydration, client use buttons, field items, battle items, and AI guide item use are guarded.");

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectIncludes(label, needle, haystack) {
  if (!haystack.includes(needle)) failures.push(`${label}: missing ${needle}`);
}

function extractFunction(source, name) {
  const start = findFunctionStart(source, name);
  if (start < 0) {
    failures.push(`missing function ${name}`);
    return "";
  }
  const bodyStart = source.indexOf("{", start);
  if (bodyStart < 0) {
    failures.push(`missing body for function ${name}`);
    return "";
  }
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  failures.push(`unterminated function ${name}`);
  return "";
}

function findFunctionStart(source, name) {
  const starts = [
    `function ${name}(`,
    `async function ${name}(`,
    `const ${name} = (`,
    `const ${name} = async (`
  ];
  return starts
    .map((needle) => source.indexOf(needle))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0] ?? -1;
}
