import { readFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const appJs = readFileSync(path.join(appRoot, "public/assets/app.js"), "utf8");
const css = readFileSync(path.join(appRoot, "public/assets/app.css"), "utf8");
const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

const requiredAppSnippets = [
  ["assist body routes click actions", 'els.assistPanelBody.addEventListener("click", onAssistPanelClick);'],
  ["quest list routes click actions", 'els.questList?.addEventListener("click", onAssistPanelClick);'],
  ["quest list routes double-click actions", 'els.questList?.addEventListener("dblclick", onAssistPanelDoubleClick);'],
  ["right status panel routes click actions", 'els.aiStatusPanel?.addEventListener("click", onAssistPanelClick);'],
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

console.log("Assist route UI OK: quest, task, starter, status, and map panels share deterministic route actions.");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
