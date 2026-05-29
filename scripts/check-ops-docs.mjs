import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readmePath = path.join(root, "README.cloudflare.md");
const packagePath = path.join(root, "package.json");

const readme = fs.readFileSync(readmePath, "utf8");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const issues = [];

requireText("npm install", "local npm install requirement");
requireText("npm run check:resources", "resource integrity check");
requireText("npm run build:world", "world-data rebuild order");
requireText("npm run profile:assets:classic-core", "classic-core profile asset step");
requireText("npm run check", "full predeploy check");
requireText("npm run deploy", "npm deploy command");
requireText("npx wrangler deploy", "local wrangler fallback");
requireText("floor 1000", "floor 1000 smoke test");
requireText("NPC", "NPC render smoke test");
requireText("对话", "dialogue smoke test");
requireText("移动", "movement smoke test");
requireText("cache", "cache-version smoke test");
requireText("service worker", "service worker cache note");

if (!pkg.scripts?.["check:ops-docs"]) {
  issues.push("package.json must define scripts.check:ops-docs.");
}
if (!String(pkg.scripts?.check || "").includes("check:ops-docs")) {
  issues.push("package.json scripts.check must include npm run check:ops-docs.");
}

if (issues.length) {
  console.error(JSON.stringify({ ok: false, issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checked: ["README.cloudflare.md", "package.json"] }, null, 2));

function requireText(needle, label) {
  if (!readme.includes(needle)) {
    issues.push(`README.cloudflare.md missing ${label}: ${needle}`);
  }
}
