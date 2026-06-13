import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { STONEAGE_QUEST_INDEX_25 } from "../src/stoneage-quest-index.js";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const failures = [];

const pkg = readJson(path.join(appRoot, "package.json"));
const manifest = readJson(path.join(appRoot, "docs/planning/classic-core-closure-manifest.json"));
const profilePackPlan = readJson(path.join(appRoot, "public/data/profiles/classic-core/profile-texture-pack-plan.json"));
const sourceMapWarps = parseSourceMapWarps(path.join(appRoot, "external/sources/ref___data/map/mapwarp.txt"));

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

const classicCoreProfile = (manifest.profiles || []).find((profile) => profile.id === "classic-core");
expect(classicCoreProfile, "classic-core closure manifest must contain the classic-core profile");
expect((classicCoreProfile?.sourceOnlyFloors || []).length === 0, "classic-core profile must not retain source-only floors");
expect(classicCoreProfile?.validation?.status !== "needs-world-generation", "classic-core profile must not require world generation");

const requiredClassicCoreLines = (manifest.lines || []).filter((line) =>
  line.profile === "classic-core" && line.required === true
);
expect(requiredClassicCoreLines.length > 0, "classic-core profile must keep required playable lines");
for (const line of requiredClassicCoreLines) {
  expect((line.maps?.generatedFloors || []).length > 0, `required classic-core line ${line.id} must have generated WORLD floors`);
  expect((line.maps?.sourceOnlyFloors || []).length === 0, `required classic-core line ${line.id} must not retain source-only floors`);
  expect((line.maps?.missingSeedFloors || []).length === 0, `required classic-core line ${line.id} must not have missing seed floors`);
  expect(line.validation?.status !== "needs-world-generation", `required classic-core line ${line.id} must not need world generation`);
}

const firstPetLine = (manifest.lines || []).find((line) => line.id === "first-pet-capture-training");
expect(firstPetLine, "classic-core closure manifest must contain first-pet-capture-training");
expect(firstPetLine?.profile === "classic-core", "first pet capture/training must remain in classic-core profile");
expect(firstPetLine?.stage === "boot", "first pet capture/training must remain a boot milestone");
expect(firstPetLine?.required === true, "first pet capture/training must remain required in classic-core");
expect((firstPetLine?.maps?.sourceOnlyFloors || []).length === 0, "first pet capture/training must not have source-only floors");
expect((firstPetLine?.maps?.missingSeedFloors || []).length === 0, "first pet capture/training must not have missing seed floors");
expect((firstPetLine?.counts?.encounterAreaCount || 0) >= 40, "first pet capture/training must retain source encounter coverage");
expect((firstPetLine?.counts?.petResourceCount || 0) >= 50, "first pet capture/training must retain source pet resource coverage");

for (const evidenceName of ["宠物店", "乌力系", "布伊系", "加美系", "凯比系"]) {
  const evidence = (firstPetLine?.sourceEvidence || []).find((entry) => entry.name === evidenceName);
  expect(evidence?.status === "source-confirmed", `first pet evidence ${evidenceName} must stay source-confirmed`);
  expect((evidence?.evidenceKinds || []).length > 0, `first pet evidence ${evidenceName} must retain local evidence kinds`);
}

const firstPetRequiredFloors = [
  100, 1000, 1003, 1100, 1103, 1203, 1212, 1303, 1403, 2000,
  2003, 3003, 3103, 3203, 3303, 3400, 3403, 4000, 4003, 10006
];
for (const floor of firstPetRequiredFloors) {
  expect(hasFloor(firstPetLine?.maps?.requiredFloors, floor), `first pet capture/training must require floor ${floor}`);
  expect(hasFloor(firstPetLine?.maps?.generatedFloors, floor), `first pet capture/training floor ${floor} must be generated in WORLD`);
  expect(getWorldMap(floor), `WORLD must include first pet capture/training floor ${floor}`);
}

const firstPetShopFixtures = [
  { floor: 1003, name: "宠物店", type: "PetShop", x: 12, y: 13, script: "file:genout/ps_1003_12_13" },
  { floor: 1003, name: "超级饲育员", type: "PetSkillShop", x: 18, y: 13, script: "file:genout/psks_1003_18_13" },
  { floor: 1003, name: "蛇的训练师", type: "NPC_FreePetSkill", x: 19, y: 20, script: "file:freeshop/freeshop04.arg" },
  { floor: 1103, name: "柯奥的宠物店", type: "PetShop", x: 19, y: 17, script: "file:genout/ps_1103_19_17" },
  { floor: 1103, name: "饲育员", type: "PetSkillShop", x: 14, y: 13, script: "file:genout/psks_1103_14_13" },
  { floor: 2003, name: "宠物店", type: "PetShop", x: 18, y: 17, script: "file:genout/ps_2003_18_17" },
  { floor: 2003, name: "饲育员", type: "PetSkillShop", x: 18, y: 14, script: "file:genout/psks_2003_18_14" },
  { floor: 3003, name: "宠物店", type: "PetShop", x: 12, y: 13, script: "file:genout/ps_3003_12_13" },
  { floor: 3003, name: "饲育员", type: "PetSkillShop", x: 16, y: 13, script: "file:genout/psks_3003_16_13" },
  { floor: 3403, name: "奇喀喀的宠物店", type: "PetShop", x: 18, y: 18, script: "file:genout/ps_3403_18_18" },
  { floor: 3403, name: "饲育员", type: "PetSkillShop", x: 18, y: 14, script: "file:genout/psks_3403_18_14" },
  { floor: 4003, name: "宠物店", type: "PetShop", x: 13, y: 13, script: "file:genout/ps_4003_13_13" },
  { floor: 4003, name: "饲育员", type: "PetSkillShop", x: 18, y: 15, script: "file:genout/psks_4003_18_15" }
];
for (const fixture of firstPetShopFixtures) {
  expect(hasNpc(firstPetLine?.npcs, fixture), `first pet closure must retain source NPC ${fixture.name} on floor ${fixture.floor}`);
  expect(hasWorldNpc(fixture), `WORLD must retain source NPC ${fixture.name} on floor ${fixture.floor}`);
}

const firstPetCorePets = [
  { tempNo: 1, name: "乌力" },
  { tempNo: 3, name: "乌力斯坦" },
  { tempNo: 13, name: "布伊" },
  { tempNo: 21, name: "加美" },
  { tempNo: 112, name: "凯比" }
];
for (const pet of firstPetCorePets) {
  expect(hasEnemy(firstPetLine?.enemies, pet), `first pet closure must retain source enemybase pet ${pet.name} (${pet.tempNo})`);
  expect(hasPetResource(firstPetLine?.petResources, pet), `first pet closure must retain client pet resource ${pet.name} (${pet.tempNo})`);
}
expect(
  (firstPetLine?.encounters || []).some((area) => area.enemyTempNos?.some((tempNo) => [1, 3, 13, 21, 112].includes(Number(tempNo)))),
  "first pet capture/training must retain source encounter areas for core pet families"
);

const villageStartLine = (manifest.lines || []).find((line) => line.id === "classic-village-start");
expect(villageStartLine, "classic-core closure manifest must contain classic-village-start");
expect(villageStartLine?.profile === "classic-core", "Classic Village Start must remain in classic-core profile");
expect((villageStartLine?.maps?.sourceOnlyFloors || []).length === 0, "Classic Village Start must not have source-only floors");

const koCaveFloors = [10301, 10302, 10303, 10304, 10305, 10306, 10307, 10308];
for (const floor of koCaveFloors) {
  expect(hasFloor(villageStartLine?.maps?.generatedFloors, floor), `Classic Village Start must generate Ko cave floor ${floor}`);
  const map = getWorldMap(floor);
  expect(map, `WORLD must include Ko cave floor ${floor}`);
  expect(String(map?.name || "").startsWith("柯奥的洞窟"), `Ko cave floor ${floor} must keep its original cave name`);
  expect(JSON.stringify(map?.size || []) === JSON.stringify([50, 50]), `Ko cave floor ${floor} must keep its original 50x50 map size`);
  expect(map?.mapFile === `/data/maps/${floor}.ls2map`, `Ko cave floor ${floor} must load its generated LS2MAP file`);
  const floorPacks = profilePackPlan.runtimeManifestSketch?.floors?.[String(floor)]?.packs || [];
  expect(floorPacks.length > 0, `classic-core profile runtime manifest must cover Ko cave floor ${floor}`);
  for (const packRef of floorPacks) {
    expect(
      existsSync(path.join(appRoot, "public/data/profiles/classic-core", packRef)),
      `classic-core profile pack is missing for Ko cave floor ${floor}: ${packRef}`
    );
  }
}

const koCaveAdjacentPairs = [
  [10301, 10302],
  [10302, 10303],
  [10303, 10304],
  [10304, 10305],
  [10305, 10306],
  [10306, 10307],
  [10307, 10308]
];

for (const [from, to] of koCaveAdjacentPairs) {
  expect(sourceHasWarp(from, to), `source mapwarp.txt must include Ko cave warp ${from} -> ${to}`);
  expect(sourceHasWarp(to, from), `source mapwarp.txt must include Ko cave warp ${to} -> ${from}`);
  expect(worldHasExit(from, to), `WORLD must include Ko cave exit ${from} -> ${to}`);
  expect(worldHasExit(to, from), `WORLD must include Ko cave exit ${to} -> ${from}`);
}

expect(
  worldReachableWithin(10301, 10308, koCaveFloors),
  "Ko cave generated WORLD exits must keep 10301 -> 10308 reachable inside the eight-floor source cave chain"
);
expect(
  worldReachableWithin(10308, 10301, koCaveFloors),
  "Ko cave generated WORLD exits must keep 10308 -> 10301 reachable inside the eight-floor source cave chain"
);

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

console.log("Classic core spine OK: adult ceremony, first-pet capture/training, and Ko cave route remain source-grounded and packaged without custom shortcuts.");

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function parseSourceMapWarps(filePath) {
  const warps = new Map();
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const parts = line.trim().split(":");
    if (parts.length < 4) continue;
    const from = parts[2].split(",").map(Number);
    const to = parts[3].split(",").map(Number);
    if (from.length < 3 || to.length < 3 || from.some(Number.isNaN) || to.some(Number.isNaN)) continue;
    if (!warps.has(from[0])) warps.set(from[0], []);
    warps.get(from[0]).push({ floor: from[0], x: from[1], y: from[2], toFloor: to[0], toX: to[1], toY: to[2] });
  }
  return warps;
}

function getWorldMap(floor) {
  return WORLD.maps[String(floor)] || WORLD.maps[floor];
}

function sourceHasWarp(from, to) {
  return (sourceMapWarps.get(Number(from)) || []).some((warp) => Number(warp.toFloor) === Number(to));
}

function worldHasExit(from, to) {
  return (getWorldMap(from)?.exits || []).some((exit) => Number(exit.to) === Number(to));
}

function worldReachableWithin(start, goal, allowedFloors) {
  const allowed = new Set((allowedFloors || []).map(Number));
  const queue = [Number(start)];
  const seen = new Set(queue);
  while (queue.length) {
    const floor = queue.shift();
    if (floor === Number(goal)) return true;
    for (const exit of getWorldMap(floor)?.exits || []) {
      const next = Number(exit.to);
      if (!allowed.has(next) || seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return false;
}

function hasFloor(entries, floor) {
  return (entries || []).some((entry) => Number(entry.floor) === Number(floor));
}

function hasItem(entries, id, qty) {
  return (entries || []).some((entry) => Number(entry.id) === Number(id) && Number(entry.qty) === Number(qty));
}

function hasNpc(entries, fixture) {
  return (entries || []).some((entry) =>
    Number(entry.floor) === Number(fixture.floor) &&
    entry.name === fixture.name &&
    entry.type === fixture.type &&
    Number(entry.x) === Number(fixture.x) &&
    Number(entry.y) === Number(fixture.y) &&
    entry.script === fixture.script
  );
}

function hasWorldNpc(fixture) {
  return (getWorldMap(fixture.floor)?.npcs || []).some((npc) =>
    npc.name === fixture.name &&
    npc.type === fixture.type &&
    Number(npc.x) === Number(fixture.x) &&
    Number(npc.y) === Number(fixture.y) &&
    npc.script === fixture.script
  );
}

function hasEnemy(entries, pet) {
  return (entries || []).some((entry) =>
    Number(entry.tempNo) === Number(pet.tempNo) &&
    entry.name === pet.name &&
    entry.hasClientFrame === true
  );
}

function hasPetResource(entries, pet) {
  return (entries || []).some((entry) =>
    Number(entry.tempNo) === Number(pet.tempNo) &&
    entry.name === pet.name &&
    entry.hasClientFrame === true
  );
}
