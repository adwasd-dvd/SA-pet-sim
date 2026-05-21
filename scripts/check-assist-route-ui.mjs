import { readFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const appJs = readFileSync(path.join(appRoot, "public/assets/app.js"), "utf8");
const css = readFileSync(path.join(appRoot, "public/assets/app.css"), "utf8");
const workerJs = readFileSync(path.join(appRoot, "src/worker.js"), "utf8");
const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

const requiredAppSnippets = [
  ["assist body routes click actions", 'els.assistPanelBody.addEventListener("click", onAssistPanelClick);'],
  ["quest list routes click actions", 'els.questList?.addEventListener("click", onAssistPanelClick);'],
  ["quest list routes double-click actions", 'els.questList?.addEventListener("dblclick", onAssistPanelDoubleClick);'],
  ["right status panel routes click actions", 'els.aiStatusPanel?.addEventListener("click", onAssistPanelClick);'],
  ["client window route click actions", 'els.clientWindowBody.addEventListener("click", onAssistPanelClick);'],
  ["active quest route action renderer", "${renderLeadTargetActions(quest.target)}"],
  ["source task route action renderer", "${renderLeadTargetActions(task.target)}"],
  ["starter NPC route action renderer", '${renderAssistMapActions("npc", npc.id, pointDistance(npc.x, npc.y))}'],
  ["starter exit route action renderer", '${renderAssistMapActions("exit", exit.id, distanceToExitClient(exit))}'],
  ["NPC auto-go button contract", "data-assist-go-npc"],
  ["NPC paid-jump button contract", "data-assist-paid-jump-npc"],
  ["exit auto-go button contract", "data-assist-go-exit"],
  ["exit paid-jump button contract", "data-assist-paid-jump-exit"],
  ["lead action renderer function", "function renderLeadTargetActions(target)"],
  ["assist action handler", "function onAssistPanelClick(event)"],
  ["assist double-click handler", "function onAssistPanelDoubleClick(event)"],
  ["tiered paid jump cost display", "paidJumpCost(distance)"],
  ["dialog-open map NPC confirm helper", "function handleDialogOpenMapEvent(event, maxTileDistance = 2)"],
  ["dialog-open map uses NPCEnemy default submit", "defaultDialogSubmitText(game?.dialog)"],
  ["dialog-open map confirms through dialog endpoint", "sendDialog(fallback)"],
  ["source drop candidate summary helper", "function battlePotentialLootSummary(items = [])"],
  ["right status shows no-drop candidates", "未掉落；候选"],
  ["debug tab exposes source drop table", '["dropTable", battlePotentialLootSummary(recentBattleOutcome()?.potentialLootItems) || "--"]'],
  ["encounter gate summary helper", "function encounterGateSummaryText(full = false)"],
  ["right status exposes encounter gates", "<b>遇敌条件</b>"],
  ["debug tab exposes encounter gates", '["encounterGate", encounterGateSummaryText(true) || "--"]']
];

for (const [label, snippet] of requiredAppSnippets) {
  assert(appJs.includes(snippet), `public/assets/app.js missing ${label}: ${snippet}`);
}

const requiredCssSnippets = [
  [".assist-lead-actions", ".assist-lead-actions"],
  [".quest-starter-line", ".quest-starter-line"],
  [".assist-go-btn", ".assist-go-btn"]
];

for (const [label, snippet] of requiredCssSnippets) {
  assert(css.includes(snippet), `public/assets/app.css missing ${label}`);
}

assert(
  pkg.scripts?.["check:assist-ui"] === "node scripts/check-assist-route-ui.mjs",
  "package.json must expose check:assist-ui"
);
assert(
  String(pkg.scripts?.check || "").includes("npm run check:assist-ui"),
  "npm run check must include check:assist-ui"
);

assertPaidJumpContract("public/assets/app.js", appJs, { requireWorkerMutation: false });
assertPaidJumpContract("src/worker.js", workerJs, { requireWorkerMutation: true });
assertClientQuestWindowRouteActions(appJs);

console.log("Assist route UI OK: deterministic route actions and tiered paid-jump fares are guarded.");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertClientQuestWindowRouteActions(source) {
  const questWindow = extractFunctionSource(source, "clientQuestWindow");
  assert(questWindow, "public/assets/app.js missing clientQuestWindow");
  assert(
    questWindow.includes("${renderLeadTargetActions(quest.target)}"),
    "client QUEST window must expose deterministic route actions for active quest targets"
  );
  assert(
    questWindow.includes("${renderLeadTargetActions(task.target)}"),
    "client QUEST window must expose deterministic route actions for source task targets"
  );
}

function assertPaidJumpContract(label, source, { requireWorkerMutation }) {
  const constants = {
    PAID_JUMP_BASE_COST: 2000,
    PAID_JUMP_FIRST_TIER_STEPS: 300,
    PAID_JUMP_SECOND_TIER_STEPS: 500,
    PAID_JUMP_FIRST_TIER_COST: 30,
    PAID_JUMP_SECOND_TIER_COST: 50,
    PAID_JUMP_THIRD_TIER_COST: 80
  };
  for (const [name, expected] of Object.entries(constants)) {
    const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\d+)\\s*;`));
    assert(match, `${label} missing paid-jump constant ${name}`);
    assert(Number(match[1]) === expected, `${label} ${name} must stay ${expected}, got ${match[1]}`);
  }
  const costFunction = extractFunctionSource(source, "paidJumpCost");
  assert(costFunction, `${label} missing paidJumpCost(stepDistance)`);
  for (const snippet of [
    "if (steps <= 0) return 0;",
    "Math.min(steps, PAID_JUMP_FIRST_TIER_STEPS)",
    "PAID_JUMP_SECOND_TIER_STEPS - PAID_JUMP_FIRST_TIER_STEPS",
    "Math.max(steps - PAID_JUMP_SECOND_TIER_STEPS, 0)",
    "PAID_JUMP_BASE_COST",
    "first * PAID_JUMP_FIRST_TIER_COST",
    "second * PAID_JUMP_SECOND_TIER_COST",
    "third * PAID_JUMP_THIRD_TIER_COST"
  ]) {
    assert(costFunction.includes(snippet), `${label} paidJumpCost missing formula piece: ${snippet}`);
  }
  if (!requireWorkerMutation) return;
  for (const snippet of [
    'url.pathname === "/api/game/paid-jump"',
    "async function paidJumpGame(",
    "assertPaidJumpFunds(game, jumpCost",
    "chargePaidJump(game, jumpCost)",
    "syncStoneItem(game)",
    "source: \"worker deterministic paid jump\""
  ]) {
    assert(source.includes(snippet), `${label} missing Worker paid-jump mutation guard: ${snippet}`);
  }
}

function extractFunctionSource(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return "";
  const firstBrace = source.indexOf("{", start);
  if (firstBrace < 0) return "";
  let depth = 0;
  for (let index = firstBrace; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return "";
}
