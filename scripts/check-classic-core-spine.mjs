import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { STONEAGE_QUEST_INDEX_25 } from "../src/stoneage-quest-index.js";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const failures = [];

const pkg = readJson(path.join(appRoot, "package.json"));
const manifest = readJson(path.join(appRoot, "docs/planning/classic-core-closure-manifest.json"));

expect(
  pkg.scripts?.["check:classic-core-spine"] === "node scripts/check-classic-core-spine.mjs",
  "package.json must expose check:classic-core-spine"
);
expect(
  String(pkg.scripts?.check || "").includes("npm run check:classic-core-spine"),
  "npm run check must include check:classic-core-spine"
);

const adultQuest = STONEAGE_QUEST_INDEX_25.find((entry) => entry.id === "quest-south-island-adult-ceremony");
expect(adultQuest, "2.5 quest index must keep the canonical adult ceremony entry");
expect(adultQuest?.source?.startsWith("任务攻略/"), "adult ceremony catalog source must remain local guide material");

const adultLine = (manifest.lines || []).find((line) => line.id === "adult-ceremony");
expect(adultLine, "classic-core closure manifest must contain adult-ceremony");
expect(adultLine?.profile === "classic-core", "adult ceremony must remain in classic-core profile");
expect(adultLine?.stage === "core", "adult ceremony must remain a core milestone");
expect(adultLine?.required === true, "adult ceremony must remain required in classic-core");
expect(adultLine?.validation?.status === "playable-source-script-draft", "adult ceremony must remain marked source-playable");

expect(hasFloor(adultLine?.maps?.requiredFloors, 10204), "adult ceremony must require floor 10204");
expect(hasFloor(adultLine?.maps?.generatedFloors, 10204), "adult ceremony floor 10204 must be generated in WORLD");
expect(hasFloor(adultLine?.maps?.routeTransitFloors, 10202), "adult ceremony route must retain transit floor 10202");
expect(hasFloor(adultLine?.maps?.routeTransitFloors, 10203), "adult ceremony route must retain transit floor 10203");
expect((adultLine?.maps?.sourceOnlyFloors || []).length === 0, "adult ceremony must not have source-only floors");
expect((adultLine?.maps?.missingSeedFloors || []).length === 0, "adult ceremony must not have missing seed floors");

expect(
  adultLine?.npcs?.some((npc) =>
    npc.name === "仪式的审判" &&
    npc.floor === 10204 &&
    npc.x === 14 &&
    npc.y === 6 &&
    npc.type === "ExChangeMan" &&
    npc.script === "file:jaruga/event/event04_1"
  ),
  "adult ceremony must keep source judge NPC event04_1 on floor 10204"
);
expect(
  adultLine?.npcs?.some((npc) =>
    npc.name === "仪式审判的差使" &&
    npc.floor === 10204 &&
    npc.x === 188 &&
    npc.y === 13 &&
    npc.type === "ExChangeMan" &&
    npc.script === "file:jaruga/event/event04_2"
  ),
  "adult ceremony must keep source messenger NPC event04_2 on floor 10204"
);

const taskCluster = (adultLine?.sourceTaskClusters || []).find((cluster) => cluster.eventNo === 4);
expect(taskCluster?.runnable === true, "adult ceremony eventNo 4 source task must stay runnable");
expect(taskCluster?.eventTypes?.includes("ACCEPT"), "adult ceremony source task must include ACCEPT");
expect(taskCluster?.eventTypes?.includes("REQUEST"), "adult ceremony source task must include REQUEST");
expect(hasItem(taskCluster?.requiredItems, 2417, 15), "adult ceremony must require 仪的玉 x15 from source item 2417");
expect(hasItem(taskCluster?.rewardItems, 2417, 15), "adult ceremony messenger must reward 仪的玉 x15 from source item 2417");
expect(hasItem(taskCluster?.rewardItems, 2418, 1), "adult ceremony judge must reward 仪之兜 x1 from source item 2418");
expect(taskCluster?.endSetFlags?.includes(4), "adult ceremony must set ENDEV=4 on completion");
expect(taskCluster?.sources?.includes("gmsv-data/npc/jaruga/event/event04_1"), "adult ceremony must include event04_1 source");
expect(taskCluster?.sources?.includes("gmsv-data/npc/jaruga/event/event04_2"), "adult ceremony must include event04_2 source");

const routePath = adultLine?.route?.paths?.["10204"];
expect(adultLine?.route?.status === "reachable-with-source-npc-warp", "adult ceremony must remain reachable through source NPC warp");
expect(
  JSON.stringify(routePath?.floors || []) === JSON.stringify([200, 10203, 10202, 10204]),
  "adult ceremony source route must stay 200 -> 10203 -> 10202 -> 10204"
);
expect(
  routePath?.edges?.some((edge) =>
    edge.kind === "npc-warp" &&
    edge.from === 10202 &&
    edge.to === 10204 &&
    edge.npcName === "仪的值班者" &&
    edge.x === 31 &&
    edge.y === 13 &&
    edge.condition === "LV>29" &&
    edge.source === "gmsv-data/npc/genout/wpm_10202_31_13"
  ),
  "adult ceremony route must use source 仪的值班者 LV>29 NPC warp"
);

for (const floor of [10202, 10203, 10204]) {
  expect(WORLD.maps[String(floor)] || WORLD.maps[floor], `WORLD must include adult ceremony floor ${floor}`);
  expect(
    existsSync(path.join(appRoot, `public/data/profiles/classic-core/packs/floor-${floor}-map-delta.json`)),
    `classic-core profile must include floor-${floor} map pack JSON`
  );
  expect(
    existsSync(path.join(appRoot, `public/data/profiles/classic-core/packs/floor-${floor}-map-delta.png`)),
    `classic-core profile must include floor-${floor} map pack image`
  );
}

const guardNpc = (WORLD.maps["10202"]?.npcs || []).find((npc) => npc.name === "仪的值班者");
expect(guardNpc, "WORLD floor 10202 must expose 仪的值班者");
expect(guardNpc?.type === "WarpMan", "仪的值班者 must stay a source WarpMan, not a dialogue-only NPC");
expect(guardNpc?.x === 31 && guardNpc?.y === 13, "仪的值班者 must stay at source coordinate (31,13)");
expect(guardNpc?.warp?.target?.floor === 10204, "仪的值班者 must warp to floor 10204");
expect(guardNpc?.warp?.target?.x === 2 && guardNpc?.warp?.target?.y === 6, "仪的值班者 must warp to source target (2,6)");
expect(guardNpc?.warp?.free === "LV>29", "仪的值班者 must keep source LV>29 gate");
expect(guardNpc?.warp?.source === "gmsv-data/npc/genout/wpm_10202_31_13", "仪的值班者 must keep source wpm script path");

const judgeNpc = (WORLD.maps["10204"]?.npcs || []).find((npc) => npc.name === "仪式的审判");
const messengerNpc = (WORLD.maps["10204"]?.npcs || []).find((npc) => npc.name === "仪式审判的差使");
const judgeAccept = (judgeNpc?.scriptEvents || []).find((event) =>
  event.source === "gmsv-data/npc/jaruga/event/event04_1" &&
  event.eventNo === 4 &&
  event.type === "ACCEPT"
);
const judgeRequest = (judgeNpc?.scriptEvents || []).find((event) =>
  event.source === "gmsv-data/npc/jaruga/event/event04_1" &&
  event.eventNo === 4 &&
  event.type === "REQUEST"
);
const messengerAccept = (messengerNpc?.scriptEvents || []).find((event) =>
  event.source === "gmsv-data/npc/jaruga/event/event04_2" &&
  event.eventNo === 4 &&
  event.type === "ACCEPT"
);

expect(judgeAccept?.condition === "ITEM=2417*15", "judge ACCEPT must require ITEM=2417*15");
expect(hasItem(judgeAccept?.delItems, 2417, 15), "judge ACCEPT must consume 仪的玉 x15");
expect(hasItem(judgeAccept?.getItems, 2418, 1), "judge ACCEPT must give 仪之兜 x1");
expect(judgeAccept?.endSetFlags?.includes(4), "judge ACCEPT must set ENDEV=4");
expect(judgeRequest?.condition === "LV>0", "judge REQUEST must expose the source start condition");
expect(messengerAccept?.condition === "NOWEV=4&ITEM!=2417", "messenger ACCEPT must require NOWEV=4 and no 仪的玉");
expect(hasItem(messengerAccept?.getItems, 2417, 15), "messenger ACCEPT must give 仪的玉 x15");

for (const file of [
  "external/sources/ref___data/npc/genout/wpm_10202_31_13",
  "external/sources/ref___data/npc/jaruga/event/event04_1",
  "external/sources/ref___data/npc/jaruga/event/event04_2",
  "external/sources/ref___data/map/mapwarp.txt",
  "public/data/itemset6.txt"
]) {
  expect(existsSync(path.join(appRoot, file)), `required local source file is missing: ${file}`);
}

if (failures.length) {
  console.error("Classic core spine check failed:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("Classic core spine OK: adult ceremony remains source-routed, source-scripted, and packaged without custom shortcuts.");

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function hasFloor(entries, floor) {
  return (entries || []).some((entry) => Number(entry.floor) === Number(floor));
}

function hasItem(entries, id, qty) {
  return (entries || []).some((entry) => Number(entry.id) === Number(id) && Number(entry.qty) === Number(qty));
}
