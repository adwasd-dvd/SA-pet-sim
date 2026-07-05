import { readFileSync } from "node:fs";
import path from "node:path";

const appRoot = path.resolve(import.meta.dirname, "..");
const appJs = readFileSync(path.join(appRoot, "public/assets/app.js"), "utf8");
const css = readFileSync(path.join(appRoot, "public/assets/app.css"), "utf8");
const sw = readFileSync(path.join(appRoot, "public/sw.js"), "utf8");
const index = readFileSync(path.join(appRoot, "public/index.html"), "utf8");
const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

const requiredAppSnippets = [
  ["proposal render is first auxiliary panel", "renderDialogProposal(dialog)"],
  ["proposal section contract", 'data-dialog-proposal="${escapeHtml(proposal.id)}"'],
  ["proposal accept button contract", 'data-dialog-proposal-decision="accept"'],
  ["proposal decline button contract", 'data-dialog-proposal-decision="decline"'],
  ["proposal expiry guard contract", 'data-dialog-proposal-expired="${expired ? "1" : "0"}"'],
  ["proposal pet selector contract", "data-dialog-proposal-pet"],
  ["proposal click handler", 'querySelectorAll("[data-dialog-proposal-decision]")'],
  ["proposal endpoint call", 'api("/api/game/dialog-proposal"'],
  ["proposal accept pet guard", "需要先选择一只宠物。"],
  ["proposal no window confirm", "function renderDialogProposal(dialog)"]
];

for (const [label, snippet] of requiredAppSnippets) {
  assert(appJs.includes(snippet), `public/assets/app.js missing ${label}: ${snippet}`);
}

const proposalFunction = extractFunctionSource(appJs, "renderDialogProposal");
assert(proposalFunction, "public/assets/app.js missing renderDialogProposal");
assert(!proposalFunction.includes("window.confirm"), "dialog proposal UI must not use window.confirm");
for (const label of ["NPC 要求", "玩家获得", "风险", "剩余"]) {
  assert(proposalFunction.includes(label), `proposal panel must show ${label}`);
}

const submitFunction = extractFunctionSource(appJs, "submitDialogProposal");
assert(submitFunction, "public/assets/app.js missing submitDialogProposal");
for (const snippet of ["proposalId: proposal.id", "decision", "selectedPetIndex", "save();", "render();"]) {
  assert(submitFunction.includes(snippet), `submitDialogProposal missing ${snippet}`);
}

for (const snippet of [
  ".dialog-proposal",
  ".dialog-proposal-pet",
  ".dialog-proposal footer button",
  "grid-template-columns: repeat(3, minmax(0, 1fr))"
]) {
  assert(css.includes(snippet), `public/assets/app.css missing proposal style: ${snippet}`);
}

assert(pkg.scripts?.["check:dialog-proposal-ui"] === "node scripts/check-dialog-proposal-ui.mjs", "package.json must expose check:dialog-proposal-ui");
assert(String(pkg.scripts?.check || "").includes("npm run check:dialog-proposal-ui"), "npm run check must include check:dialog-proposal-ui");
assert(index.includes("/assets/app.js?v=111"), "index.html must bump app.js cache query to v111");
assert(index.includes("/assets/app.css?v=67"), "index.html must bump app.css cache query to v67");
assert(sw.includes('const CACHE = "stoneage-web-v111"'), "service worker cache must bump to v111");
assert(sw.includes("/assets/app.js?v=111"), "service worker shell must cache app.js v111");
assert(sw.includes("/assets/app.css?v=67"), "service worker shell must cache app.css v67");

console.log("Dialog proposal UI OK: confirmation panel and endpoint contract are guarded.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
