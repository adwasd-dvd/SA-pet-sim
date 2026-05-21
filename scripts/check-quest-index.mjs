import { readFileSync } from "node:fs";
import path from "node:path";
import { STONEAGE_KNOWLEDGE } from "../src/stoneage-knowledge.js";
import { STONEAGE_QUEST_GROUPS_25, STONEAGE_QUEST_INDEX_25, STONEAGE_QUEST_VERSION_SCOPE } from "../src/stoneage-quest-index.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

const failures = [];

expect(
  pkg.scripts?.["check:quest-index"] === "node scripts/check-quest-index.mjs",
  "package.json must expose check:quest-index"
);
expect(
  String(pkg.scripts?.check || "").includes("npm run check:quest-index"),
  "npm run check must include check:quest-index"
);

expect(STONEAGE_QUEST_VERSION_SCOPE.maxVersion === "2.5", "quest version scope must stay capped at 2.5");
expect(
  STONEAGE_QUEST_VERSION_SCOPE.policy.includes("2.5") && STONEAGE_QUEST_VERSION_SCOPE.policy.includes("任务索引"),
  "quest version scope policy must describe the 2.5-and-earlier catalog boundary"
);
expect(
  STONEAGE_KNOWLEDGE.sources?.questIndex25 === STONEAGE_QUEST_VERSION_SCOPE.sourceLabel,
  "STONEAGE_KNOWLEDGE must publish the 2.5 quest index source label"
);

const expectedGroups = [
  "major-20-25",
  "version-25",
  "version-20",
  "south-island",
  "north-island",
  "jilu-island",
  "sham-island",
  "rebirth-caves",
  "jot-sot"
];
const groupIds = STONEAGE_QUEST_GROUPS_25.map((group) => group.id);
for (const id of expectedGroups) {
  expect(groupIds.includes(id), `missing required 2.5 quest group ${id}`);
}
expect(groupIds.length === expectedGroups.length, `expected ${expectedGroups.length} quest groups, got ${groupIds.length}`);
expect(STONEAGE_QUEST_INDEX_25.length >= 64, `expected at least 64 2.5-and-earlier quest tasks, got ${STONEAGE_QUEST_INDEX_25.length}`);

const ids = new Set();
for (const entry of STONEAGE_QUEST_INDEX_25) {
  expect(entry.id.startsWith("quest-"), `quest index id must be namespaced: ${entry.id}`);
  expect(!ids.has(entry.id), `duplicate quest index id ${entry.id}`);
  ids.add(entry.id);
  expect(entry.status === "catalog", `${entry.id} must stay catalog-only until source scripts are wired`);
  expect(entry.source.startsWith("任务攻略/"), `${entry.id} source must stay under local task guide catalog`);
  expect(!futureVersionLeak(entry), `${entry.id} leaks a post-2.5 version tag`);
  expect(
    (entry.guidance || []).some((line) => line.includes("不要") && line.includes("奖励")),
    `${entry.id} must warn NPC/AI not to mutate rewards from catalog-only data`
  );
  expect(
    (entry.facts || []).some((line) => line.includes("gmsv") || line.includes("本地")),
    `${entry.id} must mention local/source script validation in facts`
  );
}

const knowledgeById = new Map(STONEAGE_KNOWLEDGE.entries.map((entry) => [entry.id, entry]));
for (const entry of STONEAGE_QUEST_INDEX_25) {
  const knowledge = knowledgeById.get(entry.id);
  expect(knowledge, `STONEAGE_KNOWLEDGE missing quest catalog entry ${entry.id}`);
  if (!knowledge) continue;
  expect(knowledge.category === "quest", `${entry.id} knowledge category must be quest`);
  expect(knowledge.status === "catalog", `${entry.id} knowledge status must stay catalog`);
  expect(knowledge.source === entry.source, `${entry.id} knowledge source drifted from quest index`);
  expect(knowledge.version === entry.version, `${entry.id} knowledge version drifted from quest index`);
  expect(knowledge.group === entry.group, `${entry.id} knowledge group drifted from quest index`);
}

const requiredEntryIds = [
  "quest-version-25-dark-elf-king",
  "quest-version-25-spirit-king",
  "quest-version-20-red-raptor-hero-island",
  "quest-south-island-adult-ceremony",
  "quest-north-island-yuancang-doll",
  "quest-jilu-island-five-brothers",
  "quest-sham-island-dream-cave",
  "quest-rebirth-caves-black-cave-final-rebirth",
  "quest-jot-sot-jot-a-south",
  "quest-jot-sot-sot-d-north"
];
for (const id of requiredEntryIds) {
  expect(ids.has(id), `missing canonical classic/core quest entry ${id}`);
}

if (failures.length) {
  console.error("Quest index check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Quest index OK: ${STONEAGE_QUEST_INDEX_25.length} catalog-only 2.5-and-earlier tasks are grounded in STONEAGE_KNOWLEDGE.`);

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function futureVersionLeak(entry) {
  const haystack = [
    entry.version,
    entry.group,
    entry.summary,
    ...(entry.tags || [])
  ].join(" ");
  return /(?:^|[^\d.])(?:3\.0|4\.0|5\.0|6\.0|7\.0|7\.5|8\.0)(?:$|[^\d.])/.test(haystack);
}
