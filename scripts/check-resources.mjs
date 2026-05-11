import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "external", "resources.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const checks = [];

for (const [envName, entry] of Object.entries(manifest.environment)) {
  const configured = process.env[envName];
  const candidates = [
    configured,
    entry.defaultPath ? path.resolve(root, entry.defaultPath) : null,
    entry.currentAbsolutePath
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  checks.push({
    name: envName,
    ok: Boolean(found),
    path: found || candidates[0] || "(missing)",
    requiredFor: entry.requiredFor.join(", ")
  });
}

const generated = [
  ["src/world-data.js", "Generated world model"],
  ["public/data/maps", "Copied LS2MAP logic maps"],
  ["public/data/client-maps", "Copied client DAT visual maps"],
  ["public/data/client-tiles/tiles.json", "Client tile atlas manifest"],
  ["public/data/client-tiles/tiles-atlas.png", "Client tile atlas image"],
  ["public/data/mapwarp.txt", "Warp table"],
  ["public/data/itemset6.txt", "Item table"],
  ["public/data/encount.txt", "Encounter table"],
  ["public/data/enemybase2.txt", "Pet/enemy base table"],
  ["public/data/petskill2.txt", "Pet skill table"]
].map(([rel, label]) => {
  const abs = path.join(root, rel);
  return { name: rel, ok: fs.existsSync(abs), path: abs, requiredFor: label };
});

let failed = false;
for (const section of [
  ["External sources", checks],
  ["Generated/runtime assets", generated]
]) {
  console.log(`\n${section[0]}`);
  for (const item of section[1]) {
    failed ||= !item.ok;
    console.log(`${item.ok ? "OK " : "MISS"} ${item.name}`);
    console.log(`    ${item.path}`);
    console.log(`    ${item.requiredFor}`);
  }
}

process.exitCode = failed ? 1 : 0;
