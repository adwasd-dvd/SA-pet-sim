import { mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "external", "transfer");
const archive = path.join(outDir, "stoneage-web-workspace.tar.gz");

mkdirSync(outDir, { recursive: true });
rmSync(archive, { force: true });

const exclude = [
  "--exclude=.git",
  "--exclude=node_modules",
  "--exclude=external/transfer",
  "--exclude=public/debug",
  "--exclude=*.tar.gz"
];

const args = ["-czf", archive, ...exclude, "-C", path.dirname(root), path.basename(root)];
const result = spawnSync("tar", args, { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status || 1);

console.log(`\nWrote ${archive}`);
console.log("Note: external source trees are not copied into this archive unless you place them under the project first.");
