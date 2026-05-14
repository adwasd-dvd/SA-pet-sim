import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import worker from "../src/worker.js";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(appRoot, "public");

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      const file = path.join(publicRoot, decodeURIComponent(url.pathname));
      if (!file.startsWith(publicRoot) || !existsSync(file)) {
        return new Response("not found", { status: 404 });
      }
      return new Response(readFileSync(file));
    }
  }
};

const api = async (pathName, body) => {
  const response = await worker.fetch(new Request(`http://local.test${pathName}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }), env);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `API failed: ${pathName}`);
  return data;
};

let game = await api("/api/game/new", { name: "npc-action-test" });
assertEqual(game.player.EarthAT, 50, "new player keeps source-style Earth attribute default");
assertEqual(game.player.WaterAT, 50, "new player keeps source-style Water attribute default");
assertEqual(game.player.FireAT, 0, "new player starts without opposite Fire attribute");
assertEqual(game.player.WindAT, 0, "new player starts without opposite Wind attribute");
assertEqual(game.player.charm, 60, "new player starts with source CHAR_CHARM default");

let playerPointGame = await api("/api/game/new", { name: "player-point-test" });
playerPointGame.player.skillUpPoint = 2;
const playerPointStrBefore = Number(playerPointGame.player.Str || 0);
playerPointGame = await api("/api/game/allocate-point", { game: playerPointGame, stat: "腕力" });
assertEqual(playerPointGame.player.skillUpPoint, 1, "player point allocation consumes one CHAR_SKILLUPPOINT");
assertEqual(playerPointGame.player.Str, playerPointStrBefore + 100, "player point allocation adds source CHAR_SkillUp +100 raw stat");
assertEqual(playerPointGame.characterFields?.attributes?.Str, playerPointGame.player.Str, "player point allocation syncs SA character fields");
assertEqual(playerPointGame.characterFields?.schema, "gmsv-character-fields-v1", "character fields expose a stable schema");
assertEqual(playerPointGame.characterFields?.elements?.EarthAT, 50, "character fields expose Earth attribute");
assertEqual(playerPointGame.characterFields?.work?.WorkFixStr, playerPointGame.player.WorkFixStr, "character fields expose derived WorkFixStr");
assertEqual(playerPointGame.characterFields?.work?.WorkAttackPower, playerPointGame.player.WorkFixStr, "character fields expose source WorkAttackPower alias");
assertEqual(playerPointGame.characterFields?.work?.WorkDefencePower, playerPointGame.player.WorkFixTough, "character fields expose source WorkDefencePower alias");
assertEqual(playerPointGame.characterFields?.work?.WorkQuick, playerPointGame.player.WorkFixDex, "character fields expose source WorkQuick alias");
assertEqual(playerPointGame.characterFields?.work?.WorkFixCharm, playerPointGame.player.charm, "character fields expose source WorkFixCharm");
assertEqual(playerPointGame.characterFields?.inventory?.capacity, 15, "character fields expose source inventory capacity");
assert(playerPointGame.characterFields?.pets?.some((pet) => pet.active), "character fields expose active pet summary");
const activeFieldPet = playerPointGame.characterFields?.pets?.find((pet) => pet.active);
assertEqual(activeFieldPet?.exp, playerPointGame.pets[0].Exp, "character fields expose pet EXP");
assertEqual(activeFieldPet?.expToNext, playerPointGame.pets[0].ExpToNext, "character fields expose pet EXP to next level");
assertEqual(activeFieldPet?.work?.WorkMaxHp, playerPointGame.pets[0].WorkMaxHp, "character fields expose pet derived WorkMaxHp");
assertEqual(activeFieldPet?.work?.WorkAttackPower, playerPointGame.pets[0].WorkFixStr, "character fields expose pet WorkAttackPower alias");
assert(typeof activeFieldPet?.growth?.total === "number", "character fields expose pet growth summary");
assertEqual(activeFieldPet?.counters?.battleCount, Number(playerPointGame.pets[0].BattleCount || 0), "character fields expose pet battle counters");
assert(playerPointGame.save.info.includes("CHARACTER_FIELDS="), "saac-like save info includes compact character fields");
assertEqual(playerPointGame.save.json.characterFields.schema, "gmsv-character-fields-v1", "save json carries compact character fields");
assertEqual(playerPointGame.save.json.characterFields.pets[0].expToNext, playerPointGame.pets[0].ExpToNext, "save json carries pet EXP to next level");

let petModeGame = await api("/api/game/new", { name: "pet-mode-test" });
petModeGame.pets.push({
  ...petModeGame.pets[0],
  Name: "备用奥卡洛斯",
  PetId: Number(petModeGame.pets[0].PetId || 100) + 1,
  ImgNo: petModeGame.pets[0].ImgNo,
  Lv: 3,
  Exp: 24,
  Hp: 999,
  WorkMaxHp: 999,
  WorkFixStr: 999,
  WorkFixDex: 999
});
petModeGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
petModeGame = await api("/api/game/pet-mode", { game: petModeGame, petIndex: 1, mode: "active" });
assertEqual(petModeGame.petState.activeIndex, 1, "pet-mode can select a non-leading active pet");
assertEqual(petModeGame.petState.activeName, "备用奥卡洛斯", "pet state exposes selected active pet name");
const activePetLevelBefore = petModeGame.pets[1].Lv;
const petGuideRsp = await api("/api/ai/guide", { game: petModeGame, prompt: "帮我训练出战宠" });
assertEqual(petGuideRsp.action.type, "ai-training-battle", "AI guide trains through battle settlement");
assertEqual(petGuideRsp.action.petIndex, 1, "AI guide trains the selected active pet");
assert(petGuideRsp.game.pets[1].Lv > activePetLevelBefore, "selected active pet gains levels through battle experience");
const trainedFieldPet = petGuideRsp.game.characterFields.pets.find((pet) => pet.active);
assertEqual(trainedFieldPet?.level, petGuideRsp.game.pets[1].Lv, "AI training syncs active pet level into character fields");
assertEqual(trainedFieldPet?.counters?.winCount, petGuideRsp.game.pets[1].WinCount, "AI training syncs active pet counters into character fields");
assertEqual(petGuideRsp.game.petState.activeIndex, 1, "selected active pet survives save/map wrapping");
await expectApiError(
  "/api/game/train",
  { game: petGuideRsp.game, petIndex: 1 },
  "战斗经验",
  "direct pet training endpoint refuses level mutation"
);
let petSwitchGame = await api("/api/game/new", { name: "pet-switch-guide-test" });
petSwitchGame.pets.push({
  ...petSwitchGame.pets[0],
  Name: "高攻备用奥卡洛斯",
  PetId: Number(petSwitchGame.pets[0].PetId || 100) + 2,
  Lv: 2,
  Hp: 70,
  WorkMaxHp: 70,
  WorkFixStr: 1,
  WorkAttackPower: 300
});
let petSwitchRsp = await api("/api/ai/guide", { game: petSwitchGame, prompt: "让高攻备用奥卡洛斯出战" });
assertEqual(petSwitchRsp.action.type, "pet-switch", "AI guide can switch active pet by name");
assertEqual(petSwitchRsp.game.petState.activeIndex, 1, "AI guide name switch selects matching pet");
petSwitchGame = petSwitchRsp.game;
petSwitchGame.petFormation.activeIndex = 0;
petSwitchRsp = await api("/api/ai/guide", { game: petSwitchGame, prompt: "让攻击最高的宠物出战" });
assertEqual(petSwitchRsp.action.reason, "highest-attack", "AI guide can choose pet by role-fit stat hint");
assertEqual(petSwitchRsp.game.petState.activeIndex, 1, "AI guide stat switch selects strongest attack pet");
petSwitchRsp = await api("/api/ai/guide", { game: petSwitchRsp.game, prompt: "放生高攻备用奥卡洛斯" });
assertEqual(petSwitchRsp.action.type, "pet-release", "AI guide can release a named pet");
assertEqual(petSwitchRsp.game.petState.used, 1, "AI guide release frees a pet slot");
assertEqual(petSwitchRsp.game.petState.activeIndex, 0, "AI guide release keeps remaining pet active");
await expectApiError(
  "/api/game/pet-release",
  { game: petSwitchRsp.game, petIndex: 0 },
  "至少要保留一只宠物",
  "pet release refuses to remove the last pet"
);
let petReleaseGame = await api("/api/game/new", { name: "pet-release-active-test" });
petReleaseGame.pets.push({ ...petReleaseGame.pets[0], Name: "中间宠", PetId: 101, Lv: 2 });
petReleaseGame.pets.push({ ...petReleaseGame.pets[0], Name: "后排宠", PetId: 102, Lv: 3 });
petReleaseGame = await api("/api/game/pet-mode", { game: petReleaseGame, petIndex: 2, mode: "active" });
petReleaseGame = await api("/api/game/pet-release", { game: petReleaseGame, petIndex: 1 });
assertEqual(petReleaseGame.petState.used, 2, "pet release removes exactly one pet");
assertEqual(petReleaseGame.petState.activeIndex, 1, "pet release shifts active index when a prior pet leaves");
assertEqual(petReleaseGame.petState.activeName, "后排宠", "pet release keeps the same active pet after index shift");
let itemDropGame = await api("/api/game/new", { name: "item-drop-test" });
itemDropGame.inventory.push({ id: 5001, name: "小的肉", qty: 2, type: "meat", description: "耐久力 20" });
itemDropGame = await api("/api/game/drop-item", { game: itemDropGame, itemId: 5001, qty: 1 });
assertEqual(inventoryQty(itemDropGame, 5001), 1, "drop item decrements stack quantity");
assertEqual(itemDropGame.inventoryState.used, 1, "drop item keeps occupied slot while stack remains");
itemDropGame = await api("/api/game/drop-item", { game: itemDropGame, itemId: 5001, qty: 1 });
assertEqual(inventoryQty(itemDropGame, 5001), 0, "drop item removes empty stack");
assertEqual(itemDropGame.inventoryState.used, 0, "drop item frees inventory slot when stack is gone");
await expectApiError(
  "/api/game/drop-item",
  { game: itemDropGame, itemId: "stone", qty: 1 },
  "背包里没有这个道具",
  "drop item refuses stone currency"
);
let aiDropGame = await api("/api/game/new", { name: "ai-item-drop-test" });
aiDropGame.inventory.push({ id: 5002, name: "大的肉", qty: 3, type: "meat", description: "耐久力 65" });
const aiDropRsp = await api("/api/ai/guide", { game: aiDropGame, prompt: "丢弃大的肉全部" });
assertEqual(aiDropRsp.action.type, "item-drop", "AI guide can drop an item by name");
assertEqual(aiDropRsp.action.qty, 3, "AI guide can drop an entire item stack");
assertEqual(inventoryQty(aiDropRsp.game, 5002), 0, "AI item drop mutates inventory");
let aiUseGame = await api("/api/game/new", { name: "ai-item-use-test" });
aiUseGame.pets[0].Hp = 10;
aiUseGame.inventory.push({ id: 5003, name: "小的肉", qty: 2, type: "meat", description: "耐久力 20" });
const aiUseRsp = await api("/api/ai/guide", { game: aiUseGame, prompt: "使用小的肉回血" });
assertEqual(aiUseRsp.action.type, "item-use", "AI guide uses named recovery items before free healing");
assertEqual(aiUseRsp.action.itemName, "小的肉", "AI guide reports used item name");
assert(aiUseRsp.game.pets[0].Hp > 10, "AI item use restores active pet hp");
assertEqual(inventoryQty(aiUseRsp.game, 5003), 1, "AI item use consumes one item from stack");

const redRaptorGuideRsp = await api("/api/ai/guide", { game, prompt: "红暴任务怎么做" });
assert(redRaptorGuideRsp.text.includes("英雄岛前传：红暴"), "local guide retrieves red raptor quest knowledge");
assert(redRaptorGuideRsp.text.includes("日美子") && redRaptorGuideRsp.text.includes("弥生"), "red raptor guide answer includes key quest NPCs");
assert(redRaptorGuideRsp.text.includes("Worker VM"), "knowledge guide keeps action authority with the Worker VM");
const petKnowledgeRsp = await api("/api/ai/guide", { game, prompt: "宠物技能和忠诚是怎么回事" });
assert(petKnowledgeRsp.text.includes("宠物系统") && petKnowledgeRsp.text.includes("宠物技能"), "local guide retrieves pet system and skill knowledge");
let workspaceRsp = await api("/api/ai/workspace", { game, prompt: "红暴任务怎么做" });
assertEqual(workspaceRsp.workspace.schema, "stoneage-ai-workspace-v1", "AI workspace exposes its schema");
assert(workspaceRsp.workspace.knowledge.entries.some((entry) => entry.id === "quest-red-raptor-hero-island"), "AI workspace includes prompt-relevant knowledge entries");
workspaceRsp = await api("/api/ai/workspace-note", {
  game,
  note: { kind: "questLead", title: "红暴线索", text: "玩家正在问英雄岛前传。", tags: ["红暴", "英雄岛"], confidence: 0.8 }
});
assertEqual(workspaceRsp.note.kind, "questLead", "AI workspace note validates note kind");
assert(workspaceRsp.game.aiWorkspace.memories.some((entry) => entry.title === "红暴线索"), "AI workspace note persists in game save state");

const quest25GuideRsp = await api("/api/ai/guide", { game, prompt: "2.5任务有哪些" });
assert(quest25GuideRsp.text.includes("石器2.5任务攻略"), "local guide retrieves 2.5 quest catalog group");
assert(quest25GuideRsp.text.includes("目录索引"), "2.5 quest catalog stays labeled as index-only knowledge");
workspaceRsp = await api("/api/ai/workspace", { game, prompt: "2.5 精灵少女 黑暗精灵王" });
assert(workspaceRsp.workspace.knowledge.entries.some((entry) => entry.id === "quest-version-25-dark-elf-king" && entry.version === "2.5"), "AI workspace includes versioned 2.5 quest index entries");
workspaceRsp = await api("/api/ai/workspace", { game, prompt: "沙姆岛梦幻洞窟任务" });
assert(workspaceRsp.workspace.knowledge.entries.some((entry) => entry.id === "quest-sham-island-dream-cave" && entry.group === "沙姆岛任务全攻略"), "AI workspace includes island quest index entries before 2.5");

const teacher = WORLD.maps["1000"].npcs.find((npc) => npc.name.includes("老师"));
if (!teacher) throw new Error("missing teacher NPC fixture");
assertEqual(WORLD.quests["samugiru-arena-tour"]?.playerFacing, false, "arena tour remains staged as full-dev content");
assert(!teacher.questIds?.includes("samugiru-arena-tour"), "teacher default quest chain excludes non-core arena tour");
await expectApiError(
  "/api/game/dialog",
  { game, npcId: teacher.id },
  "请先走近",
  "dialog rejects remote NPC talk"
);

let teacherGame = await api("/api/game/new", { name: "npc-dialog-test" });
teacherGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id });
assertEqual(teacherGame.dialog.open, true, "dialog opens on default hi");
assertEqual(teacherGame.dialog.messages.length, 3, "default hi creates one player line and one NPC line");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "player" && message.text === "hi"), "default hi sends player hi");
assertEqual(teacherGame.dialog.messages.filter((message) => message.speaker === "npc").length, 1, "default hi does not dump all NPC lines");
assert(!teacherGame.dialog.messages.some((message) => message.text.includes(teacher.dialogueLines[1])), "default hi only returns the next source dialogue line");
assert(teacherGame.dialog.debug.actions.includes("quest"), "teacher debug profiles quest action");
assert(teacherGame.dialog.debug.actions.includes("say"), "teacher debug profiles say action");
assert(teacherGame.dialog.debug.allowedActions.includes("quest"), "teacher debug exposes VM allowed quest action");
assert(teacherGame.dialog.debug.supportedActions.includes("setFlag"), "teacher debug exposes VM supported setFlag action");
assert(teacherGame.dialog.source.includes(teacher.source), "teacher dialog source line includes source path");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.status === "ok"), "teacher dialog debug includes quest VM trace");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "say" && event.status === "ok"), "teacher dialog debug includes say VM trace");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "quest-start"), "teacher quest start records setFlag VM event");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.executor === "npc-action-vm"), "teacher setFlag runs through NPC VM executor");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "来源" });
assert(teacherGame.dialog.messages.some((message) => message.speaker === "player" && message.text === "来源"), "custom dialog text is appended");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(teacher.source)), "source query replies with source path");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(teacher.script)), "source query replies with script path");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "debug" && event.status === "ok"), "source query records debug VM event");
assert(teacherGame.save.json.npcVmEvents.some((event) => event.action === "debug" && event.npcId === teacher.id), "save json carries recent NPC VM events");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "AI对话" });
assertEqual(teacherGame.dialog.aiMode, true, "AI dialog toggle is reflected in dialog state");
assert(teacherGame.dialog.suggestions.includes("请求避敌"), "AI mode exposes negotiated no-encounter suggestion");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
assert(Number(teacherGame.effects?.noEncounterUntil || 0) > Date.now(), "AI negotiated no-encounter effect sets a future expiry");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "effect" && event.status === "ok" && event.detail?.effect === "noEncounter"), "AI no-encounter effect runs through NPC VM");
assert(teacherGame.save.json.effects?.noEncounterUntil, "save json carries AI negotiated effects");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "普通对话" });
assertEqual(teacherGame.dialog.aiMode, false, "AI dialog toggle can return to source dialog mode");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "训练" });
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "unsupported" && event.detail?.originalAction === "fieldSkill"), "unsupported VM actions preserve original action");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.reason === "training-query"), "teacher training query connects to active quest context");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && /战斗经验|下一步/.test(message.text)), "teacher training reply explains battle-based progression and next quest step");

let questLoopGame = await api("/api/game/new", { name: "source-quest-loop-test" });
questLoopGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y, dir: 2 };
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id });
assertEqual(questLoopGame.quests[teacher.questId].status, "进行中", "teacher starts the first source-grounded quest");
questLoopGame = await api("/api/game/walk", {
  game: { ...questLoopGame, location: { mapId: "1000", x: 49, y: 116, dir: 2 }, player: { ...questLoopGame.player, dir: 2 } },
  dx: 0,
  dy: 0
});
assertEqual(questLoopGame.location.mapId, "100", "field quest uses real mapwarp into Sainasu");
assert(Number(questLoopGame.quests[teacher.questId].progress || 0) >= 2, "entering a wild encounter map advances the field quest");
questLoopGame.location = { ...questLoopGame.location, x: 637, y: 493, dir: 2 };
questLoopGame.pets[0].WorkFixStr = 999;
questLoopGame.pets[0].WorkAttackPower = 999;
questLoopGame.pets[0].WorkFixDex = 999;
questLoopGame.pets[0].WorkQuick = 999;
questLoopGame = await api("/api/game/encounter", { game: questLoopGame });
assert(questLoopGame.battle?.source?.includes("encount.txt"), "field quest encounter is sourced from encount.txt");
questLoopGame.encounter.Hp = 1;
questLoopGame.encounter.WorkFixDex = 0;
questLoopGame.encounter.WorkQuick = 0;
questLoopGame.battle.enemyParty = [{ ...questLoopGame.encounter }];
questLoopGame = await api("/api/game/battle", { game: questLoopGame, action: "攻击" });
assertEqual(questLoopGame.battleOutcome.result, "victory", "field quest can finish through Worker battle settlement");
assertEqual(questLoopGame.quests[teacher.questId].status, "可回报", "field quest becomes reportable after a wild battle win");
const questLoopStoneBefore = questLoopGame.player.stone;
questLoopGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y, dir: 2 };
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id, message: "hi" });
assertEqual(questLoopGame.quests[teacher.questId].status, "完成", "field quest completes through teacher NPC VM reward");
assert(questLoopGame.player.stone > questLoopStoneBefore, "field quest completion grants source-style stone reward");

const fourVillageQuestId = "samugiru-four-village-route";
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id });
assertEqual(questLoopGame.quests[fourVillageQuestId].status, "进行中", "teacher starts the four-village source route after field practice");
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id, message: "任务" });
assert(questLoopGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("下一处地图：萨伊那斯")), "four-village quest reply shows source map objective hints");
questLoopGame = await walkSourceWarp(questLoopGame, "1000", "100");
assertEqual(questLoopGame.location.mapId, "100", "four-village route uses mapwarp from Samugiru to Sainasu");
assertEqual(questLoopGame.quests[fourVillageQuestId].progress, 2, "four-village route records Sainasu visit");
questLoopGame = await walkSourceWarp(questLoopGame, "100", "2000");
assertEqual(questLoopGame.location.mapId, "2000", "four-village route uses mapwarp from Sainasu to Marinasu");
assertEqual(questLoopGame.quests[fourVillageQuestId].progress, 3, "four-village route records Marinasu visit");
questLoopGame = await walkSourceWarp(questLoopGame, "2000", "100");
questLoopGame = await walkSourceWarp(questLoopGame, "100", "1100");
assertEqual(questLoopGame.location.mapId, "1100", "four-village route uses mapwarp from Sainasu to Kuo");
assertEqual(questLoopGame.quests[fourVillageQuestId].status, "可回报", "four-village route becomes reportable after all source maps");
const fourVillageStoneBefore = questLoopGame.player.stone;
questLoopGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y, dir: 2 };
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id, message: "hi" });
assertEqual(questLoopGame.quests[fourVillageQuestId].status, "完成", "four-village route completes through teacher NPC VM reward");
assert(questLoopGame.player.stone > fourVillageStoneBefore, "four-village completion grants source-style stone reward");
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id });
assert(!questLoopGame.quests["samugiru-arena-tour"], "teacher skips staged arena tour after four-village route");
assertEqual(questLoopGame.quests["ganzo-roadblock"].status, "进行中", "teacher continues to the next player-facing source NPCEnemy quest");
const questExpReward = Number(teacherGame.quests[teacher.questId].expReward || 20);
const questStoneReward = Number(teacherGame.quests[teacher.questId].stoneReward || 80);
teacherGame.player.exp = Math.max(0, Number(teacherGame.player.nextExp || 1) - questExpReward + 1);
const expBeforeQuest = teacherGame.player.exp;
const levelBeforeQuest = Number(teacherGame.player.level || 1);
const skillPointsBeforeQuest = Number(teacherGame.player.skillUpPoint || 0);
const stoneBeforeQuest = teacherGame.player.stone;
teacherGame.quests[teacher.questId].status = "可回报";
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "hi" });
assertEqual(teacherGame.player.exp, expBeforeQuest + questExpReward, "teacher quest reward adds player exp through VM");
assert(teacherGame.player.level > levelBeforeQuest, "teacher quest EXP reward can trigger source level-up");
assert(Number(teacherGame.player.skillUpPoint || 0) >= skillPointsBeforeQuest + 3, "teacher quest level-up grants source ability points");
assertEqual(teacherGame.player.stone, stoneBeforeQuest + questStoneReward, "teacher quest reward adds stone through VM");
assertEqual(teacherGame.characterFields?.base?.level, teacherGame.player.level, "quest EXP reward syncs character field level");
assertEqual(teacherGame.save.json.characterFields.base.level, teacherGame.player.level, "quest EXP reward syncs save character field level");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "quest-complete"), "teacher quest complete records setFlag VM event");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "quest"), "teacher quest complete records give VM event");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.executor === "npc-action-vm"), "teacher give runs through NPC VM executor");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.mutated === true), "teacher give mutates state through NPC VM executor");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.levelUps?.length), "teacher give VM trace records source level-up lines");

const healer = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => /healer/i.test(`${npc.type} ${npc.template}`));
if (!healer) throw new Error("missing healer NPC fixture");

game.location = { mapId: healer.map.id, x: healer.npc.x + 1, y: healer.npc.y };
game.player.hp = 7;
game.pets[0].Hp = 3;
const stoneBefore = game.player.stone;
game = await api("/api/game/dialog", { game, npcId: healer.npc.id, message: "治疗" });
assertEqual(game.player.hp, game.player.maxHp, "healer restores player hp");
assertEqual(game.pets[0].Hp, game.pets[0].WorkMaxHp, "healer restores active pet hp");
assert(game.player.stone < stoneBefore, "window healer charges stone");
assert(game.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("恢复")), "healer replies with recovery text");
assertEqual(game.dialog.debug.source, healer.npc.source, "dialog debug records healer source");
assertEqual(game.dialog.debug.template, healer.npc.template, "dialog debug records healer template");
assert(game.dialog.debug.actions.includes("heal"), "dialog debug profiles healer action");
assert(game.dialog.source.includes(healer.npc.source), "dialog source line includes source path");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "heal" && event.status === "ok"), "healer dialog debug includes heal VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "healer"), "healer dialog debug includes setFlag VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "heal"), "healer dialog debug includes stone take VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.executor === "npc-action-vm"), "healer take runs through NPC VM executor");
assert(game.flags.bits[`now:${stableFlag(`${healer.npc.id}:healer`)}`], "healer action flag set");
assert(game.characterFields.events.recentBits.includes(`now:${stableFlag(`${healer.npc.id}:healer`)}`), "character fields summarize recent event bits after NPC VM mutation");
assert(game.save.json.characterFields.events.recentBits.includes(`now:${stableFlag(`${healer.npc.id}:healer`)}`), "save json character fields keep event bits for AI/NPC context");

const caveNurse = WORLD.maps["100"].npcs.find((npc) => npc.name === "洞窟前的护士");
if (!caveNurse) throw new Error("missing cave nurse fixture");
let nurseAidGame = await api("/api/game/new", { name: "npc-ai-healer-aid-test" });
nurseAidGame.location = { mapId: "100", x: caveNurse.x + 1, y: caveNurse.y };
nurseAidGame.player.stone = 200;
nurseAidGame = await api("/api/game/dialog", { game: nurseAidGame, npcId: caveNurse.id, message: "AI对话" });
assert(nurseAidGame.dialog.suggestions.includes("请求急救药"), "AI healer mode exposes role-fit aid suggestion");
const nurseStoneBefore = nurseAidGame.player.stone;
nurseAidGame = await api("/api/game/dialog", { game: nurseAidGame, npcId: caveNurse.id, message: "真的很需要，可以卖给我一些回复药么？" });
const nurseAidItem = nurseAidGame.inventory.find((item) => /回复药|回復藥|恢复药|恢復藥/.test(item.name || ""));
assert(nurseAidItem, "AI healer aid gives a role-fit recovery item");
assert(nurseAidGame.player.stone < nurseStoneBefore, "AI healer aid asks for compensation");
assert(nurseAidGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(nurseAidItem.name)), "AI healer aid names the recovery item");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "debug" && event.detail?.reason === "ai-role-favor" && event.detail?.role === "healer"), "AI healer aid records role-favor decision");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "ai-healer-aid"), "AI healer aid compensation runs through NPC VM");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "ai-healer-aid" && event.detail?.itemName === nurseAidItem.name), "AI healer aid item runs through NPC VM");
assert(nurseAidGame.flags.bits[`now:${stableFlag(`${caveNurse.id}:ai-healer-aid`)}`], "AI healer aid records a source-style action flag");

const saveNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => /savepoint|save/i.test(`${npc.type} ${npc.template}`));
if (!saveNpc) throw new Error("missing savepoint NPC fixture");

game.location = { mapId: saveNpc.map.id, x: saveNpc.npc.x + 1, y: saveNpc.npc.y };
game = await api("/api/game/dialog", { game, npcId: saveNpc.npc.id, message: "记录" });
assertEqual(game.savePoint.npcId, saveNpc.npc.id, "savepoint records npc id");
assertEqual(game.save.json.savePoint.npcId, saveNpc.npc.id, "save json records savepoint");
assert(game.save.info.includes("LAST_SAVEPOINT="), "saac-like save info includes last savepoint");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "save" && event.status === "ok"), "savepoint dialog debug includes save VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "savepoint"), "savepoint dialog debug includes setFlag VM trace");
assert(game.flags.bits[`end:${stableFlag(`${saveNpc.npc.id}:savepoint`)}`], "savepoint end flag set");

const ganzo = WORLD.maps["100"]?.npcs.find((npc) => npc.name === "坏心眼的愿藏");
if (!ganzo) throw new Error("missing Ganzo NPCEnemy fixture");
assertEqual(ganzo.graphic, "100401", "Ganzo uses source graphicname 100401");
assert(ganzo.npcEnemy?.enemyNos.includes(253) && ganzo.npcEnemy?.enemyNos.includes(254), "Ganzo parses source enemyno list");
let ganzoPromptGame = await api("/api/game/new", { name: "ganzo-prompt-test" });
ganzoPromptGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoPromptGame = await api("/api/game/dialog", { game: ganzoPromptGame, npcId: ganzo.id });
assert(!ganzoPromptGame.encounter, "Ganzo default dialog does not start battle before YES");
assert(ganzoPromptGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("要决胜负吗")), "Ganzo default dialog asks source battle question");
assert(ganzoPromptGame.dialog.suggestions.includes("是") && ganzoPromptGame.dialog.suggestions.includes("否"), "Ganzo prompt exposes source YES/NO buttons");
assert(ganzoPromptGame.dialog.debug.actions.includes("window"), "Ganzo debug profiles NPCEnemy window action");
assert(ganzoPromptGame.dialog.debug.actions.includes("startBattle"), "Ganzo debug profiles NPCEnemy battle action");
ganzoPromptGame = await api("/api/game/dialog", { game: ganzoPromptGame, npcId: ganzo.id, message: "否" });
assert(!ganzoPromptGame.encounter, "Ganzo NO keeps battle closed");
assert(ganzoPromptGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("有什么事吗")), "Ganzo NO returns deniedmsg");
assert(ganzoPromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.status === "cancel" && event.detail?.select === "no"), "Ganzo NO records source window cancel");

let ganzoBattleGame = await api("/api/game/new", { name: "ganzo-battle-test" });
ganzoBattleGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoBattleGame.player.level = 5;
ganzoBattleGame.pets[0].Lv = 5;
ganzoBattleGame = await api("/api/game/dialog", { game: ganzoBattleGame, npcId: ganzo.id, message: "是" });
assertEqual(ganzoBattleGame.encounter?.EnemyId, 253, "Ganzo YES starts with source enemy1 id 253");
assertEqual(ganzoBattleGame.encounter?.PetId, 500, "Ganzo enemy1 id 253 resolves to enemybase tempNo 500");
assert(ganzoBattleGame.encounter.Lv >= 14 && ganzoBattleGame.encounter.Lv <= 15, "Ganzo enemy1 id 253 uses source level range 14-15");
assertEqual(ganzoBattleGame.battle?.enemyParty?.length, 2, "Ganzo NPCEnemy creates the exact source enemy count");
assertEqual(ganzoBattleGame.battle.enemyParty[1].EnemyId, 254, "Ganzo second target keeps source enemy1 id 254");
assertEqual(ganzoBattleGame.battle.enemyParty[1].PetId, 501, "Ganzo enemy1 id 254 resolves to enemybase tempNo 501");
assert(ganzoBattleGame.battle.enemyParty[1].Lv >= 10 && ganzoBattleGame.battle.enemyParty[1].Lv <= 13, "Ganzo enemy1 id 254 uses source level range 10-13");
assertEqual(ganzoBattleGame.encounter.CaptureRate, 0, "Ganzo NPCEnemy encounter is not catchable");
assert(ganzoBattleGame.battle?.source?.includes("npc_npcenemy.c"), "Ganzo battle records NPCEnemy source");
assertEqual(ganzoBattleGame.battle?.npcEnemy?.npcId, ganzo.id, "Ganzo battle keeps NPCEnemy metadata");
assert(ganzoBattleGame.battle.log.some((line) => line.includes("呼拔吉，去吧")), "Ganzo battle logs source startmsg");
assert(ganzoBattleGame.dialog.suggestions.includes("攻击") && ganzoBattleGame.dialog.suggestions.includes("防御"), "Ganzo battle exposes battle commands");
assert(!ganzoBattleGame.dialog.suggestions.includes("捕获"), "Ganzo NPCEnemy battle does not suggest capture");
let ganzoTargetGame = JSON.parse(JSON.stringify(ganzoBattleGame));
ganzoTargetGame.battle.enemyParty[1].Hp = 1;
ganzoTargetGame.battle.enemyParty[1].WorkFixDex = 0;
ganzoTargetGame.battle.enemyParty[1].WorkQuick = 0;
ganzoTargetGame.pets[0].WorkFixStr = 999;
ganzoTargetGame.pets[0].WorkFixDex = 999;
ganzoTargetGame.pets[0].WorkAttackPower = 999;
ganzoTargetGame.pets[0].WorkQuick = 999;
ganzoTargetGame = await api("/api/game/battle", { game: ganzoTargetGame, action: "attack:1" });
assertEqual(ganzoTargetGame.battleOutcome.result, "next-enemy", "targeted battle command can defeat a selected non-leading enemy");
assertEqual(ganzoTargetGame.encounter.EnemyId, 253, "targeted battle returns to the remaining live enemy");
assertEqual(ganzoTargetGame.battle.activeEnemyIndex, 0, "targeted battle tracks active enemy index after selection");
assert(ganzoTargetGame.battle.defeatedEnemies.some((enemy) => enemy.EnemyId === 254), "targeted battle records defeated selected enemy");
let ganzoCaptureGame = JSON.parse(JSON.stringify(ganzoBattleGame));
const ganzoPetsBeforeCapture = ganzoCaptureGame.pets.length;
ganzoCaptureGame.encounter.WorkFixStr = 1;
ganzoCaptureGame.encounter.WorkAttackPower = 1;
ganzoCaptureGame = await api("/api/game/battle", { game: ganzoCaptureGame, action: "捕获" });
assertEqual(ganzoCaptureGame.battleOutcome.result, "capture-missed", "Ganzo NPCEnemy capture always misses");
assertEqual(ganzoCaptureGame.pets.length, ganzoPetsBeforeCapture, "Ganzo NPCEnemy capture does not add a pet");
ganzoBattleGame.encounter.Hp = 1;
ganzoBattleGame.encounter.WorkFixDex = 0;
ganzoBattleGame.encounter.WorkQuick = 0;
ganzoBattleGame.pets[0].WorkFixStr = 999;
ganzoBattleGame.pets[0].WorkFixDex = 999;
ganzoBattleGame.pets[0].WorkAttackPower = 999;
ganzoBattleGame.pets[0].WorkQuick = 999;
ganzoBattleGame = await api("/api/game/battle", { game: ganzoBattleGame, action: "攻击" });
assertEqual(ganzoBattleGame.battleOutcome.result, "next-enemy", "Ganzo first defeated target advances to next source enemy");
assertEqual(ganzoBattleGame.encounter.EnemyId, 254, "Ganzo advances to source enemy1 id 254");
assert(!ganzoBattleGame.flags.npcEnemyDefeats[ganzo.id]?.until, "Ganzo blocker does not clear before all source enemies are defeated");
ganzoBattleGame.encounter.Hp = 1;
ganzoBattleGame.encounter.WorkFixDex = 0;
ganzoBattleGame.encounter.WorkQuick = 0;
ganzoBattleGame = await api("/api/game/battle", { game: ganzoBattleGame, action: "攻击" });
assertEqual(ganzoBattleGame.battleOutcome.result, "victory", "Ganzo NPCEnemy can be defeated through battle API");
assertEqual(ganzoBattleGame.battleOutcome.defeatedEnemies.length, 2, "Ganzo final victory reports both source enemies defeated");
assertEqual(ganzoBattleGame.lastBattleOutcome.defeatedEnemies.length, 2, "last battle outcome persists defeated enemy telemetry");
assert(ganzoBattleGame.flags.npcEnemyDefeats[ganzo.id]?.until, "Ganzo victory records source dieact=0 respawn timer");
assert(!ganzoBattleGame.world.map.npcs.some((npc) => npc.id === ganzo.id), "Ganzo victory hides the blocker NPC from the active map");

const adultJudge = WORLD.maps["10204"]?.npcs.find((npc) => npc.name === "仪式的审判");
const adultMessenger = WORLD.maps["10204"]?.npcs.find((npc) => npc.name === "仪式审判的差使");
if (!adultJudge || !adultMessenger) throw new Error("missing adult ceremony changeevent fixtures");
assert(adultJudge.scriptEvents?.some((event) => event.type === "ACCEPT" && event.delItems?.some((item) => Number(item.id) === 2417)), "adult ceremony judge parses source DelItem from changeevent script");
assert(adultMessenger.scriptEvents?.some((event) => event.type === "ACCEPT" && event.getItems?.some((item) => Number(item.id) === 2417)), "adult ceremony messenger parses source GetItem from changeevent script");
let adultGame = await api("/api/game/new", { name: "adult-ceremony-test" });
adultGame.location = { mapId: "10204", x: adultJudge.x + 1, y: adultJudge.y };
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultJudge.id });
assert(adultGame.flags.bits["now:4"], "adult ceremony judge REQUEST sets source NOWEV=4");
assert(adultGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("取回１５个")), "adult ceremony judge explains source request text");
assert(adultGame.dialog.debug.actions.includes("give") && adultGame.dialog.debug.actions.includes("take"), "changeevent debug profiles deterministic item actions");
const adultJudgePayload = adultGame.world.map.npcs.find((npc) => npc.id === adultJudge.id);
assert(!adultJudgePayload.scriptEvents, "client map payload strips raw changeevent scripts");
assert(adultJudgePayload.scriptEventSummary?.count >= 1, "client map payload keeps compact changeevent summary");
assert(!adultGame.npc?.scriptEvents, "client dialog payload strips raw NPC changeevent scripts");
assert(!JSON.stringify(adultJudgePayload).includes("取回１５个"), "client NPC payload does not include raw source dialogue script text");
adultGame.location = { mapId: "10204", x: adultMessenger.x + 1, y: adultMessenger.y };
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultMessenger.id });
assertEqual(inventoryQty(adultGame, 2417), 15, "adult ceremony messenger gives exactly 15 source ritual jades");
assert(adultGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("给你１５个仪玉")), "adult ceremony messenger uses source thanks text");
assert(adultGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-getitem" && event.detail?.itemId === 2417), "adult ceremony messenger gives item through NPC VM");
adultGame.location = { mapId: "10204", x: adultJudge.x + 1, y: adultJudge.y };
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultJudge.id });
assertEqual(inventoryQty(adultGame, 2417), 0, "adult ceremony judge removes all ritual jades through source DelItem");
assertEqual(inventoryQty(adultGame, 2418), 1, "adult ceremony judge gives source adult helmet reward");
assert(adultGame.flags.bits["end:4"], "adult ceremony judge sets source ENDEV=4");
assert(adultGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-delitem" && event.detail?.itemId === 2417), "adult ceremony judge takes items through NPC VM");
assert(adultGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "source-changeevent-end" && event.detail?.shiftbit === 4), "adult ceremony judge records source EndSetFlg through NPC VM");
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultJudge.id });
assert(adultGame.dialog.messages.at(-1)?.text.includes("成人的身份"), "adult ceremony completed branch uses source ENDEV=4 message");

const shopNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.trade?.items?.length);
if (!shopNpc) throw new Error("missing shop NPC fixture");
game.location = farLocation(shopNpc.map, shopNpc.npc);
await expectApiError(
  "/api/game/buy",
  { game, npcId: shopNpc.npc.id, itemId: shopNpc.npc.trade.items[0].id },
  "请先走近",
  "shop purchase rejects remote NPC window action"
);
await expectApiError(
  "/api/game/sell",
  { game, npcId: shopNpc.npc.id, itemId: shopNpc.npc.trade.items[0].id },
  "请先走近",
  "shop sell rejects remote NPC window action"
);
game.location = { mapId: shopNpc.map.id, x: shopNpc.npc.x + 1, y: shopNpc.npc.y };
game.player.stone = 10000;
const shopItem = shopNpc.npc.trade.items[0];
const shopPrice = Number(shopItem.price || shopItem.cost || 0);
const shopQtyBefore = inventoryQty(game, shopItem.id);
game = await api("/api/game/buy", { game, npcId: shopNpc.npc.id, itemId: shopItem.id });
assertEqual(game.player.stone, 10000 - shopPrice, "shop buy charges stone through VM");
assertEqual(inventoryQty(game, shopItem.id), shopQtyBefore + 1, "shop buy gives item through VM");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.action === "buy"), "shop buy records shop VM event");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "buy" && event.detail?.executor === "npc-action-vm" && event.detail?.mutated === true), "shop buy runs stone take through NPC VM executor");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "buy" && event.detail?.executor === "npc-action-vm" && event.detail?.mutated === true), "shop buy runs item give through NPC VM executor");
assert(game.dialog.trade.sellItems.some((item) => Number(item.id) === Number(shopItem.id) && item.sellable), "shop dialog exposes inventory sell list");
const sellRate = Number(shopNpc.npc.trade.sellRate ?? 0.2);
const sellPrice = Math.max(1, Math.floor(shopPrice * sellRate));
const stoneBeforeSell = game.player.stone;
game = await api("/api/game/sell", { game, npcId: shopNpc.npc.id, itemId: shopItem.id });
assertEqual(game.player.stone, stoneBeforeSell + sellPrice, "shop sell adds stone through VM");
assertEqual(inventoryQty(game, shopItem.id), shopQtyBefore, "shop sell removes one inventory item through VM");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.action === "sell"), "shop sell records shop VM event");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "sell" && event.detail?.executor === "npc-action-vm" && event.detail?.mutated === true), "shop sell runs item take through NPC VM executor");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "sell" && event.detail?.stone === sellPrice && event.detail?.executor === "npc-action-vm" && event.detail?.mutated === true), "shop sell runs stone give through NPC VM executor");

const discountItem = shopNpc.npc.trade.items.find((item) => Number(item.price || item.cost || 0) > 1);
if (!discountItem) throw new Error("missing priced shop item fixture");
let aiShopGame = await api("/api/game/new", { name: "ai-shop-discount-test" });
aiShopGame.location = { mapId: shopNpc.map.id, x: shopNpc.npc.x + 1, y: shopNpc.npc.y };
aiShopGame.player.stone = 10000;
aiShopGame = await api("/api/game/dialog", { game: aiShopGame, npcId: shopNpc.npc.id, message: "AI对话" });
assert(aiShopGame.dialog.suggestions.includes("看看柜台后面"), "AI mode nudges shop exploration without naming exact reward");
aiShopGame = await api("/api/game/dialog", { game: aiShopGame, npcId: shopNpc.npc.id, message: "能不能打折便宜一点" });
assert(aiShopGame.effects?.shopDiscounts?.[shopNpc.npc.id]?.percent > 0, "AI negotiated shop discount stores a NPC-scoped effect");
assert(aiShopGame.dialog.debug.vmTrace.some((event) => event.action === "effect" && event.status === "ok" && event.detail?.effect === "shopDiscount"), "AI shop discount runs through NPC VM effect guard");
const discountedDialogItem = aiShopGame.dialog.trade.items.find((item) => Number(item.id) === Number(discountItem.id));
assert(discountedDialogItem.discountPrice < discountedDialogItem.sourcePrice, "dialog shop list exposes discounted price");
const discountBeforeStone = aiShopGame.player.stone;
aiShopGame = await api("/api/game/buy", { game: aiShopGame, npcId: shopNpc.npc.id, itemId: discountItem.id });
assertEqual(aiShopGame.player.stone, discountBeforeStone - discountedDialogItem.discountPrice, "AI shop discount changes the checked-out price");
assert(aiShopGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.discountPercent > 0), "discounted buy records discount in shop VM trace");

const weaponShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.trade?.items?.some((item) => /斧头|枪|棍棒|爪/.test(item.name)));
if (!weaponShop) throw new Error("missing weapon shop fixture");
let aiOffMenuGame = await api("/api/game/new", { name: "ai-off-menu-test" });
aiOffMenuGame.location = { mapId: weaponShop.map.id, x: weaponShop.npc.x + 1, y: weaponShop.npc.y };
aiOffMenuGame.player.stone = 10000;
aiOffMenuGame = await api("/api/game/dialog", { game: aiOffMenuGame, npcId: weaponShop.npc.id, message: "AI对话" });
aiOffMenuGame = await api("/api/game/dialog", { game: aiOffMenuGame, npcId: weaponShop.npc.id, message: "有没有平时不卖的斧头" });
assert(aiOffMenuGame.effects?.offMenuShop?.[weaponShop.npc.id]?.items?.length, "AI off-menu request adds a role-fit temporary shop item");
const hiddenWeapon = aiOffMenuGame.effects.offMenuShop[weaponShop.npc.id].items[0];
assert(/斧头|枪|棍棒|爪|投掷/.test(hiddenWeapon.name), "AI off-menu item matches weapon shop role");
assert(aiOffMenuGame.dialog.trade.items.some((item) => Number(item.id) === Number(hiddenWeapon.id) && item.offMenu), "dialog shop list includes off-menu item");
const hiddenWeaponBefore = inventoryQty(aiOffMenuGame, hiddenWeapon.id);
aiOffMenuGame = await api("/api/game/buy", { game: aiOffMenuGame, npcId: weaponShop.npc.id, itemId: hiddenWeapon.id });
assertEqual(inventoryQty(aiOffMenuGame, hiddenWeapon.id), hiddenWeaponBefore + 1, "AI off-menu item can be bought through shop VM");

const meatShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => /肉店/.test(npc.name || "") && npc.trade?.items?.some((item) => /肉/.test(item.name)));
if (!meatShop) throw new Error("missing meat shop fixture");
let aiMeatGame = await api("/api/game/new", { name: "ai-meat-knife-reject-test" });
aiMeatGame.location = { mapId: meatShop.map.id, x: meatShop.npc.x + 1, y: meatShop.npc.y };
aiMeatGame = await api("/api/game/dialog", { game: aiMeatGame, npcId: meatShop.npc.id, message: "AI对话" });
aiMeatGame = await api("/api/game/dialog", { game: aiMeatGame, npcId: meatShop.npc.id, message: "能不能给我切肉的刀" });
assert(!aiMeatGame.effects?.offMenuShop?.[meatShop.npc.id], "meat shop rejects role-mismatched knife request");
assert(aiMeatGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("切肉刀")), "meat shop rejection stays in character");

let ganzoBribeGame = await api("/api/game/new", { name: "ganzo-bribe-test" });
ganzoBribeGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoBribeGame.player.stone = 1000;
ganzoBribeGame = await api("/api/game/dialog", { game: ganzoBribeGame, npcId: ganzo.id, message: "AI对话" });
assert(ganzoBribeGame.dialog.suggestions.includes("试着交涉"), "NPCEnemy AI mode exposes negotiation without naming bribe/threat outcomes");
ganzoBribeGame = await api("/api/game/dialog", { game: ganzoBribeGame, npcId: ganzo.id, message: "给你石币让我过去" });
assert(ganzoBribeGame.player.stone < 1000, "NPCEnemy bribe takes stone through VM");
assert(ganzoBribeGame.flags.npcEnemyDefeats[ganzo.id]?.until, "NPCEnemy bribe opens temporary bypass");
assert(!ganzoBribeGame.world.map.npcs.some((npc) => npc.id === ganzo.id), "NPCEnemy bribe hides blocker while bypass is active");

let ganzoThreatGame = await api("/api/game/new", { name: "ganzo-threat-test" });
ganzoThreatGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoThreatGame.player.level = 12;
ganzoThreatGame.player.stone = 1000;
ganzoThreatGame = await api("/api/game/dialog", { game: ganzoThreatGame, npcId: ganzo.id, message: "AI对话" });
ganzoThreatGame = await api("/api/game/dialog", { game: ganzoThreatGame, npcId: ganzo.id, message: "威胁他让我过去" });
assertEqual(ganzoThreatGame.player.stone, 1000, "strong NPCEnemy threat does not take bribe money");
assert(ganzoThreatGame.flags.npcEnemyDefeats[ganzo.id]?.mode === "threat", "strong NPCEnemy threat opens bypass as threat mode");

const battleNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ map, npc }) => map.encounterPets?.length && npc.id && !npc.npcEnemy);
if (!battleNpc) throw new Error("missing NPC on encounter map fixture");
let npcBattleGame = await api("/api/game/new", { name: "npc-start-battle-test" });
npcBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
npcBattleGame = await api("/api/game/dialog", { game: npcBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
assert(npcBattleGame.encounter?.Name, "NPC startBattle creates an encounter enemy");
assert(npcBattleGame.battle?.source?.includes("npc-action-vm startBattle"), "NPC startBattle initializes battle through VM");
assert(npcBattleGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("旧的自动抓宠弹窗仍保持关闭")), "NPC startBattle keeps old auto capture UI disabled");
assert(npcBattleGame.dialog.suggestions.includes("攻击"), "NPC battle dialog exposes attack command");
assert(npcBattleGame.dialog.suggestions.includes("捕获"), "NPC battle dialog exposes capture command");
assert(npcBattleGame.dialog.suggestions.includes("道具"), "NPC battle dialog exposes item command");
assert(npcBattleGame.dialog.debug.vmTrace.some((event) => event.action === "startBattle" && event.status === "ok" && event.detail?.executor === "npc-action-vm"), "NPC startBattle runs through VM executor");
assert(npcBattleGame.dialog.debug.vmTrace.some((event) => event.action === "startBattle" && event.detail?.mutated === true && event.detail?.enemyName), "NPC startBattle trace records enemy summary and mutation");
npcBattleGame = await api("/api/game/dialog", { game: npcBattleGame, npcId: battleNpc.npc.id, message: "攻击" });
assert(npcBattleGame.dialog.messages.some((message) => message.speaker === "npc" && /攻击|反击|击败|撤退/.test(message.text)), "NPC battle attack replies with battle log");
assert(npcBattleGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.status === "ok" && event.detail?.executor === "npc-action-vm"), "NPC battle attack runs through VM executor");
assert(npcBattleGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.mutated === true && event.detail?.outcome?.log?.length), "NPC battle attack trace records outcome log");
let npcItemBattleGame = await api("/api/game/new", { name: "npc-item-battle-test" });
npcItemBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
npcItemBattleGame = await api("/api/game/dialog", { game: npcItemBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
npcItemBattleGame.inventory.push({ id: 990001, name: "小的肉", qty: 1, description: "回复耐久力 30", source: "test itemset6 recovery" });
npcItemBattleGame.pets[0].WorkMaxHp = Math.max(80, Number(npcItemBattleGame.pets[0].WorkMaxHp || npcItemBattleGame.pets[0].Hp || 1));
npcItemBattleGame.pets[0].Hp = Math.max(1, npcItemBattleGame.pets[0].WorkMaxHp - 40);
npcItemBattleGame.encounter.WorkFixStr = 1;
const itemBattleHpBefore = Number(npcItemBattleGame.pets[0].Hp || 0);
npcItemBattleGame = await api("/api/game/dialog", { game: npcItemBattleGame, npcId: battleNpc.npc.id, message: "道具" });
assert(inventoryQty(npcItemBattleGame, 990001) === 0, "NPC battle item consumes recovery item");
assert(Number(npcItemBattleGame.pets[0].Hp || 0) > itemBattleHpBefore, "NPC battle item restores active pet HP before enemy response");
assert(npcItemBattleGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("使用 小的肉")), "NPC battle item replies with item battle log");
assert(npcItemBattleGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "item" && event.detail?.outcome?.itemUse?.itemName === "小的肉"), "NPC battle item records item outcome through VM");
let selectedItemBattleGame = await api("/api/game/new", { name: "selected-item-battle-test" });
selectedItemBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
selectedItemBattleGame = await api("/api/game/dialog", { game: selectedItemBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
selectedItemBattleGame.inventory.push({ id: 990002, name: "小的肉", qty: 1, description: "回复耐久力 30", source: "test itemset6 recovery" });
selectedItemBattleGame.inventory.push({ id: 990003, name: "大的肉", qty: 1, description: "回复耐久力 65", source: "test itemset6 recovery" });
selectedItemBattleGame.pets[0].WorkMaxHp = Math.max(120, Number(selectedItemBattleGame.pets[0].WorkMaxHp || selectedItemBattleGame.pets[0].Hp || 1));
selectedItemBattleGame.pets[0].Hp = Math.max(1, selectedItemBattleGame.pets[0].WorkMaxHp - 80);
selectedItemBattleGame.encounter.WorkFixStr = 1;
selectedItemBattleGame = await api("/api/game/battle", { game: selectedItemBattleGame, action: "item:990003" });
assert(inventoryQty(selectedItemBattleGame, 990002) === 1, "selected battle item leaves unselected item untouched");
assert(inventoryQty(selectedItemBattleGame, 990003) === 0, "selected battle item consumes requested item id");
assert(selectedItemBattleGame.battleOutcome?.itemUse?.itemName === "大的肉", "selected battle item outcome records requested item");
let petSkillBattleGame = await api("/api/game/new", { name: "pet-skill-battle-test" });
petSkillBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
petSkillBattleGame = await api("/api/game/dialog", { game: petSkillBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
petSkillBattleGame.pets[0].PetSkillIds = [10];
petSkillBattleGame.pets[0].PetSkills = [{
  Id: 10,
  Name: "连续攻击",
  Des: "两次连续攻击",
  FuncName: "PETSKILL_ContinuationAttack",
  Option: "2",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
petSkillBattleGame.pets[0].WorkFixStr = 60;
petSkillBattleGame.pets[0].WorkAttackPower = 60;
petSkillBattleGame.pets[0].WorkQuick = 999;
petSkillBattleGame.pets[0].WorkFixDex = 999;
petSkillBattleGame.encounter.WorkMaxHp = 999;
petSkillBattleGame.encounter.Hp = 999;
petSkillBattleGame.encounter.WorkFixTough = 1;
petSkillBattleGame.encounter.WorkDefencePower = 1;
petSkillBattleGame.encounter.WorkQuick = 0;
petSkillBattleGame.encounter.WorkFixDex = 0;
petSkillBattleGame.encounter.WorkAttackPower = 1;
const skillTargetHpBefore = Number(petSkillBattleGame.encounter.Hp || 0);
petSkillBattleGame = await api("/api/game/battle", { game: petSkillBattleGame, action: "skill:0" });
assertEqual(petSkillBattleGame.battleOutcome.playerAction?.command, "W|0|0", "pet skill battle action uses source W command");
assertEqual(petSkillBattleGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_RENZOKU", "continuous pet skill maps to source battle command");
assertEqual(petSkillBattleGame.battleOutcome.playerAction?.petSkill?.id, 10, "pet skill telemetry records source petskill2 id");
assertEqual(petSkillBattleGame.battleOutcome.playerAction?.petSkill?.hitCount, 2, "pet skill telemetry records option-derived hit count");
assert(Number(petSkillBattleGame.encounter?.Hp || 0) < skillTargetHpBefore, "pet skill damages the active battle target");
assert(petSkillBattleGame.battleOutcome.log.some((line) => line.includes("连续攻击")), "pet skill battle log names the source skill");
let petStatusSkillGame = await api("/api/game/new", { name: "pet-status-skill-test" });
petStatusSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
petStatusSkillGame = await api("/api/game/dialog", { game: petStatusSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
petStatusSkillGame.pets[0].PetSkillIds = [60];
petStatusSkillGame.pets[0].PetSkills = [{
  Id: 60,
  Name: "毒攻击",
  Des: "攻击力减95%三回合前后让敌人中毒",
  FuncName: "PETSKILL_StatusChange",
  Option: "毒 turn 3  攻%-95",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
petStatusSkillGame.pets[0].Lv = 80;
petStatusSkillGame.pets[0].WorkFixLuck = 80;
petStatusSkillGame.pets[0].Luck = 80;
petStatusSkillGame.pets[0].WorkFixStr = 1;
petStatusSkillGame.pets[0].WorkAttackPower = 1;
petStatusSkillGame.pets[0].WorkQuick = 999;
petStatusSkillGame.pets[0].WorkFixDex = 999;
petStatusSkillGame.pets[0].Critical = 0;
const statusSkillEnemyFixture = {
  EnemyId: 999999,
  PetId: 999999,
  Name: "状态测试敌人",
  Lv: 1,
  WorkMaxHp: 999,
  Hp: 999,
  Vital: 100,
  Str: 100,
  Tough: 100,
  Dex: 100,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 1
};
Object.assign(petStatusSkillGame.encounter, statusSkillEnemyFixture);
Object.assign(petStatusSkillGame.battle?.enemyParty?.[0] || {}, statusSkillEnemyFixture);
petStatusSkillGame = await api("/api/game/battle", { game: petStatusSkillGame, action: "skill:0" });
const statusSkillTelemetry = petStatusSkillGame.battleOutcome.playerAction?.petSkill?.status;
assertEqual(petStatusSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_STATUSCHANGE", "status pet skill maps to source battle command");
assertEqual(statusSkillTelemetry?.status?.key, "poison", "status pet skill parses petskill2 status token");
assert(statusSkillTelemetry?.success, "status pet skill applies source status chance");
assert(Number(petStatusSkillGame.encounter?.BattleStatuses?.poison?.turns || 0) > 0, "status pet skill persists enemy BattleStatuses");
const poisonHpBefore = Number(petStatusSkillGame.encounter.Hp || 0);
petStatusSkillGame = await api("/api/game/battle", { game: petStatusSkillGame, action: "wait" });
assert(Number(petStatusSkillGame.encounter?.Hp || 0) < poisonHpBefore, "poison status ticks before the enemy turn");
assert(petStatusSkillGame.battleOutcome.log.some((line) => line.includes("中毒")), "poison status writes battle log");
let petMagicStatusGame = await api("/api/game/new", { name: "pet-magic-status-test" });
petMagicStatusGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
petMagicStatusGame = await api("/api/game/dialog", { game: petMagicStatusGame, npcId: battleNpc.npc.id, message: "宠物" });
petMagicStatusGame.pets[0].PetSkillIds = [552];
petMagicStatusGame.pets[0].PetSkills = [{
  Id: 552,
  Name: "铁壁",
  Des: "提高己方全体防御力30%3回合",
  FuncName: "PETSKILL_MagicStatusChange",
  Option: "铁壁|3|30|全",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
petMagicStatusGame.pets[0].WorkMaxHp = 999;
petMagicStatusGame.pets[0].Hp = 999;
petMagicStatusGame.pets[0].WorkFixDex = 999;
petMagicStatusGame.pets[0].WorkQuick = 999;
petMagicStatusGame.pets[0].WorkFixTough = 10;
petMagicStatusGame.pets[0].WorkDefencePower = 10;
petMagicStatusGame.encounter.WorkQuick = 0;
petMagicStatusGame.encounter.WorkFixDex = 0;
petMagicStatusGame.encounter.WorkAttackPower = 40;
petMagicStatusGame = await api("/api/game/battle", { game: petMagicStatusGame, action: "skill:0" });
const magicStatusTelemetry = petMagicStatusGame.battleOutcome.playerAction?.petSkill?.magicStatus;
assertEqual(petMagicStatusGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SUPERWALL", "magic status pet skill maps to source superwall command");
assertEqual(magicStatusTelemetry?.status?.key, "superWall", "magic status pet skill parses petskill2 option");
assert(magicStatusTelemetry?.success, "magic status pet skill applies to active pet");
assert(Number(petMagicStatusGame.pets[0].BattleMagicStatuses?.superWall?.turns || 0) > 0, "magic status pet skill persists active pet battle magic status");
assert(petMagicStatusGame.battleOutcome.log.some((line) => line.includes("铁壁") && line.includes("防御")), "magic status battle log explains defense buff");
let battlePetSwitchGame = await api("/api/game/new", { name: "battle-pet-switch-test" });
battlePetSwitchGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
battlePetSwitchGame = await api("/api/game/dialog", { game: battlePetSwitchGame, npcId: battleNpc.npc.id, message: "宠物" });
battlePetSwitchGame.pets[0].BattleMagicStatuses = {
  superWall: { key: "superWall", label: "铁壁", turns: 2, percent: 30 }
};
battlePetSwitchGame.pets.push({
  ...battlePetSwitchGame.pets[0],
  Name: "后备出战奥卡洛斯",
  PetId: Number(battlePetSwitchGame.pets[0].PetId || 100) + 30,
  Lv: 4,
  Hp: 400,
  WorkMaxHp: 400,
  WorkFixTough: 500,
  WorkDefencePower: 500
});
battlePetSwitchGame.encounter.WorkTactics = 1;
battlePetSwitchGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0";
battlePetSwitchGame.encounter.WorkAttackPower = 1;
battlePetSwitchGame = await api("/api/game/battle", { game: battlePetSwitchGame, action: "S|1" });
assertEqual(battlePetSwitchGame.petState.activeIndex, 1, "source S pet command switches active battle pet");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_PETOUT", "battle pet switch maps to source PETOUT command");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.command, "S|1", "battle pet switch records source S slot command");
assert(!battlePetSwitchGame.pets[0].BattleMagicStatuses?.superWall, "switching out clears old active pet battle-only magic status");
assert(battlePetSwitchGame.encounter, "battle pet switch keeps battle active after the enemy response");
assert(battlePetSwitchGame.battleOutcome.log.some((line) => line.includes("后备出战奥卡洛斯") && line.includes("出战")), "battle pet switch writes source-style battle log");
battlePetSwitchGame = await api("/api/game/dialog", { game: battlePetSwitchGame, npcId: battleNpc.npc.id, message: "换宠" });
assertEqual(battlePetSwitchGame.petState.activeIndex, 0, "NPC dialog battleAction can switch to the next available pet");
assert(battlePetSwitchGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "pet-switch"), "NPC dialog pet switch records battleAction VM trace");
battlePetSwitchGame.player.hp = 999;
battlePetSwitchGame.player.maxHp = 999;
battlePetSwitchGame.player.WorkMaxHp = 999;
battlePetSwitchGame.player.WorkAttackPower = 250;
battlePetSwitchGame.player.WorkDefencePower = 250;
battlePetSwitchGame.player.WorkQuick = 250;
battlePetSwitchGame.encounter.WorkAttackPower = 1;
battlePetSwitchGame = await api("/api/game/battle", { game: battlePetSwitchGame, action: "S|-1" });
assertEqual(battlePetSwitchGame.petState.activeIndex, -1, "source S|-1 pet command withdraws active pet");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_PETIN", "source S|-1 maps to PETIN");
assertEqual(battlePetSwitchGame.battleOutcome.result, "pet-in", "pet-in keeps the battle resolving as a distinct source outcome");
assertEqual(battlePetSwitchGame.characterFields.battle.activePetIndex, -1, "character fields expose no default pet after PETIN");
assert(battlePetSwitchGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "player" && unit.slot === 0), "battle formation exposes player slot 0");
assert(!battlePetSwitchGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "pet"), "battle formation omits pet slot after PETIN");
assertEqual(battlePetSwitchGame.characterFields.battle.formation.allySlots.length, 10, "battle formation exposes 10 source ally slots");
assertEqual(battlePetSwitchGame.characterFields.battle.formation.enemySlots[0].battleNo, 10, "enemy slot 0 maps to source battle no 10");
assertEqual(battlePetSwitchGame.characterFields.battle.formation.targetGroups.side0, 20, "source target group 20 maps to ally side");
assert(battlePetSwitchGame.battleOutcome.log.some((line) => line.includes("独自应战")), "S|-1 log explains player-alone battle state");
battlePetSwitchGame = await api("/api/game/battle", { game: battlePetSwitchGame, action: "pet:0" });
assertEqual(battlePetSwitchGame.petState.activeIndex, 0, "PETOUT can send a pet back out from player-alone state");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_PETOUT", "player-alone pet out maps back to PETOUT");
assert(battlePetSwitchGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "pet" && unit.slot === 5), "battle formation exposes default pet as owner slot + 5");
assertEqual(battlePetSwitchGame.characterFields.battle.formation.localPetNo, 5, "battle formation exposes local pet battle no 5");
await expectApiError(
  "/api/game/battle",
  { game: battlePetSwitchGame, action: "pet:0" },
  "已经在战斗",
  "battle pet switch refuses the already active pet"
);
let npcReleaseGame = await api("/api/game/new", { name: "npc-release-battle-test" });
npcReleaseGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
npcReleaseGame = await api("/api/game/dialog", { game: npcReleaseGame, npcId: battleNpc.npc.id, message: "宠物" });
npcReleaseGame = await api("/api/game/dialog", { game: npcReleaseGame, npcId: battleNpc.npc.id, message: "放走" });
assert(!npcReleaseGame.encounter, "NPC battle release clears encounter");
assert(npcReleaseGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "released"), "NPC battle release records released outcome");
let npcCaptureGame = await api("/api/game/new", { name: "npc-capture-battle-test" });
npcCaptureGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
npcCaptureGame = await api("/api/game/dialog", { game: npcCaptureGame, npcId: battleNpc.npc.id, message: "宠物" });
const petsBeforeCapture = npcCaptureGame.pets.length;
npcCaptureGame.encounter.CaptureRate = 100;
npcCaptureGame = await api("/api/game/dialog", { game: npcCaptureGame, npcId: battleNpc.npc.id, message: "捕获" });
assert(!npcCaptureGame.encounter, "NPC battle capture clears encounter on success");
assertEqual(npcCaptureGame.pets.length, petsBeforeCapture + 1, "NPC battle capture adds pet");
assert(npcCaptureGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("捕获成功")), "NPC battle capture replies with success");
assert(npcCaptureGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "captured"), "NPC battle capture records captured outcome");
let npcFullCaptureGame = await api("/api/game/new", { name: "npc-full-capture-test" });
npcFullCaptureGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
npcFullCaptureGame = await api("/api/game/dialog", { game: npcFullCaptureGame, npcId: battleNpc.npc.id, message: "宠物" });
while (npcFullCaptureGame.pets.length < 5) {
  npcFullCaptureGame.pets.push({ ...npcFullCaptureGame.pets[0], Name: `${npcFullCaptureGame.pets[0].Name}${npcFullCaptureGame.pets.length}` });
}
const fullCapturePetCount = npcFullCaptureGame.pets.length;
npcFullCaptureGame.encounter.CaptureRate = 100;
npcFullCaptureGame = await api("/api/game/dialog", { game: npcFullCaptureGame, npcId: battleNpc.npc.id, message: "捕获" });
assert(npcFullCaptureGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "pet-full"), "full pet slots block capture before adding a pet");
assertEqual(npcFullCaptureGame.pets.length, fullCapturePetCount, "full pet slots keep pet count unchanged");
assert(npcFullCaptureGame.encounter, "full pet slot capture refusal keeps battle target active");
assert(npcFullCaptureGame.dialog.messages.some((message) => message.text.includes("宠物栏已满")), "full pet slot capture replies with capacity text");
assertEqual(npcFullCaptureGame.petState?.capacity, 5, "pet state exposes source CHAR_MAXPETHAVE capacity");

const warpNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.warp?.target && WORLD.maps[npc.warp.target.mapId] && npc.warp.cost?.mode === "level-multiplier");
if (!warpNpc) throw new Error("missing loaded warp NPC fixture");

game.location = { mapId: warpNpc.map.id, x: warpNpc.npc.x + 1, y: warpNpc.npc.y };
game.player.level = 1;
game.player.stone = 100;
const warpCost = Number(warpNpc.npc.warp.cost.amount || 0);
game = await api("/api/game/dialog", { game, npcId: warpNpc.npc.id, message: "传送" });
assertEqual(game.location.mapId, warpNpc.npc.warp.target.mapId, "warp NPC moves player to target map");
assertEqual(game.location.x, warpNpc.npc.warp.target.x, "warp NPC sets target x");
assertEqual(game.location.y, warpNpc.npc.warp.target.y, "warp NPC sets target y");
assertEqual(game.player.stone, 100 - warpCost, "warp NPC charges level-based stone cost");
assert(game.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("启动传送")), "warp NPC replies with travel text");
assert(game.dialog.debug.actions.includes("warp"), "dialog debug profiles warp action");
assert(game.dialog.source.includes(warpNpc.npc.source), "dialog source line includes warp source path");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "ok"), "warp dialog debug includes warp VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "warp"), "warp dialog debug includes setFlag VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "warp"), "warp dialog debug includes stone take VM trace");
assert(game.save.info.includes(`FLOOR=${warpNpc.npc.warp.target.mapId}`), "saac-like save info records warped floor");
assert(game.flags.bits[`end:${stableFlag(`${warpNpc.npc.id}:warp`)}`], "warp action flag set");

const itemGateWarp = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.warp?.target && WORLD.maps[npc.warp.target.mapId] && !npc.warp.cost && /^ITEM=/.test(String(npc.warp.free || "")));
if (!itemGateWarp) throw new Error("missing item-gated no-cost warp fixture");
let itemGateGame = await api("/api/game/new", { name: "warp-item-gate-test" });
itemGateGame.location = { mapId: itemGateWarp.map.id, x: itemGateWarp.npc.x + 1, y: itemGateWarp.npc.y };
const itemGateStartMap = itemGateGame.location.mapId;
itemGateGame = await api("/api/game/sync", { game: itemGateGame });
let itemGateStatus = itemGateGame.world.map.npcs.find((npc) => npc.id === itemGateWarp.npc.id)?.warpStatus;
assertEqual(itemGateStatus?.ok, false, "world map NPC exposes blocked item-gated warp status");
assert(itemGateStatus.unmet.some((check) => check.type === "item"), "blocked item-gated warp status names missing item condition");
workspaceRsp = await api("/api/ai/workspace", { game: itemGateGame, prompt: "这个守卫为什么不让我进" });
const workspaceItemGateNpc = workspaceRsp.workspace.current.nearby.npcs.find((npc) => npc.id === itemGateWarp.npc.id);
assert(workspaceItemGateNpc?.warpStatus?.unmet?.some((check) => check.type === "item"), "AI workspace nearby NPCs include compact warp condition failures");
itemGateGame = await api("/api/game/dialog", { game: itemGateGame, npcId: itemGateWarp.npc.id, message: "传送" });
assertEqual(itemGateGame.location.mapId, itemGateStartMap, "no-cost item-gated warp blocks when source ITEM condition fails");
assert(itemGateGame.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "blocked" && event.detail?.condition?.groups?.[0]?.checks?.[0]?.type === "item"), "blocked item-gated warp records condition detail");
itemGateGame.inventory.push({ id: Number(String(itemGateWarp.npc.warp.free).match(/ITEM=(\d+)/)?.[1] || 0), name: "条件道具", qty: 1, source: "test" });
itemGateGame = await api("/api/game/sync", { game: itemGateGame });
itemGateStatus = itemGateGame.world.map.npcs.find((npc) => npc.id === itemGateWarp.npc.id)?.warpStatus;
assertEqual(itemGateStatus?.ok, true, "world map NPC warp status updates after item condition is satisfied");
const itemGateCheck = itemGateStatus.condition?.groups?.flatMap((group) => group.checks || []).find((check) => check.type === "item");
assertEqual(itemGateCheck?.itemName, "条件道具", "satisfied item-gated warp condition carries player-facing item name");
itemGateGame = await api("/api/game/dialog", { game: itemGateGame, npcId: itemGateWarp.npc.id, message: "传送" });
assertEqual(itemGateGame.location.mapId, itemGateWarp.npc.warp.target.mapId, "no-cost item-gated warp passes after source ITEM condition is satisfied");

const scriptConditionNpc = WORLD.maps["100"].npcs.find((npc) => npc.scriptHints?.hints?.some((line) => line.includes("TRANS=0&ITEM=2347*2&ITEM=20911")));
if (!scriptConditionNpc) throw new Error("missing script condition fixture with TRANS and item qty");
let scriptConditionGame = await api("/api/game/new", { name: "npc-script-condition-test" });
scriptConditionGame.location = { mapId: "100", x: scriptConditionNpc.x + 1, y: scriptConditionNpc.y };
scriptConditionGame = await api("/api/game/sync", { game: scriptConditionGame });
let scriptRuntimeNpc = scriptConditionGame.world.map.npcs.find((npc) => npc.id === scriptConditionNpc.id);
assert(scriptRuntimeNpc?.scriptStatus?.conditions?.some((condition) => condition.unmet?.some((check) => check.type === "level" || check.type === "item")), "world map NPC exposes source EVENT condition failures");
const missingScriptItemCheck = scriptRuntimeNpc.scriptStatus.conditions
  .flatMap((condition) => condition.unmet || [])
  .find((check) => check.itemId === 2347);
assert(missingScriptItemCheck?.itemName, "unmet source EVENT item condition resolves itemset name before player owns the item");
workspaceRsp = await api("/api/ai/workspace", { game: scriptConditionGame, prompt: "这个肉店老板任务需要什么" });
let workspaceScriptNpc = workspaceRsp.workspace.current.nearby.npcs.find((npc) => npc.id === scriptConditionNpc.id);
assert(workspaceScriptNpc?.scriptStatus?.conditions?.length, "AI workspace nearby NPCs include compact script condition status");
const workspaceMissingItemCheck = workspaceScriptNpc.scriptStatus.conditions
  .flatMap((condition) => condition.unmet || [])
  .find((check) => check.itemId === 2347);
assert(workspaceMissingItemCheck?.itemName, "AI workspace script condition includes source item name for unmet requirements");
scriptConditionGame.player.level = 20;
scriptConditionGame.inventory.push({ id: 2347, name: "测试食材", qty: 2, source: "test" });
scriptConditionGame.inventory.push({ id: 20911, name: "测试凭证", qty: 1, source: "test" });
scriptConditionGame = await api("/api/game/sync", { game: scriptConditionGame });
scriptRuntimeNpc = scriptConditionGame.world.map.npcs.find((npc) => npc.id === scriptConditionNpc.id);
assert(scriptRuntimeNpc.scriptStatus.conditions.some((condition) => condition.ok), "source EVENT condition status updates after level, TRANS, and item requirements are satisfied");
const scriptItemCheck = scriptRuntimeNpc.scriptStatus.conditions
  .flatMap((condition) => condition.condition?.groups || [])
  .flatMap((group) => group.checks || [])
  .find((check) => check.itemId === 2347);
assertEqual(scriptItemCheck?.itemName, "测试食材", "source EVENT item condition includes resolved inventory item name");

const petScriptNpc = WORLD.maps["100"].npcs.find((npc) => npc.scriptHints?.hints?.some((line) => line.includes("PET=25-221*1") && line.includes("PET=25-222*1")));
if (!petScriptNpc) throw new Error("missing script condition fixture with PET=family-id format");
let petScriptGame = await api("/api/game/new", { name: "npc-pet-script-condition-test" });
petScriptGame.location = { mapId: "100", x: petScriptNpc.x + 1, y: petScriptNpc.y };
petScriptGame = await api("/api/game/sync", { game: petScriptGame });
let petRuntimeNpc = petScriptGame.world.map.npcs.find((npc) => npc.id === petScriptNpc.id);
assert(petRuntimeNpc.scriptStatus.conditions.some((condition) => condition.unmet?.some((check) => check.type === "pet")), "source EVENT condition status exposes missing PET requirements");
const missingPetCheck = petRuntimeNpc.scriptStatus.conditions
  .flatMap((condition) => condition.unmet || [])
  .find((check) => check.petId === 221);
assert(missingPetCheck?.petName, "unmet source EVENT PET condition resolves enemybase pet name before player owns the pet");
petScriptGame.inventory.push({ id: 2607, name: "测试任务道具", qty: 1, source: "test" });
petScriptGame.pets.push({ ...petScriptGame.pets[0], PetId: 221, Name: "测试宠物221", Lv: 1, Hp: 10, WorkMaxHp: 10 });
petScriptGame.pets.push({ ...petScriptGame.pets[0], PetId: 222, Name: "测试宠物222", Lv: 1, Hp: 10, WorkMaxHp: 10 });
setTestEventFlag(petScriptGame, 35, "now");
petScriptGame = await api("/api/game/sync", { game: petScriptGame });
petRuntimeNpc = petScriptGame.world.map.npcs.find((npc) => npc.id === petScriptNpc.id);
assert(petRuntimeNpc.scriptStatus.conditions.some((condition) => condition.ok && condition.condition?.groups?.some((group) => group.checks?.some((check) => check.type === "pet"))), "source EVENT condition status supports PET=family-id requirements");
const scriptPetCheck = petRuntimeNpc.scriptStatus.conditions
  .flatMap((condition) => condition.condition?.groups || [])
  .flatMap((group) => group.checks || [])
  .find((check) => check.petId === 221);
assertEqual(scriptPetCheck?.petName, "测试宠物221", "source EVENT PET condition includes resolved party pet name");

const petEventWarp = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.warp?.target && WORLD.maps[npc.warp.target.mapId] && String(npc.warp.free || "").includes("PET>0-"));
if (!petEventWarp) throw new Error("missing PET/ENDEV gated warp fixture");
let petEventGame = await api("/api/game/new", { name: "warp-pet-event-gate-test" });
petEventGame.location = { mapId: petEventWarp.map.id, x: petEventWarp.npc.x + 1, y: petEventWarp.npc.y };
const petEventStartMap = petEventGame.location.mapId;
petEventGame.player.level = 30;
petEventGame = await api("/api/game/dialog", { game: petEventGame, npcId: petEventWarp.npc.id, message: "传送" });
assertEqual(petEventGame.location.mapId, petEventStartMap, "PET/ENDEV gated warp blocks before event bit and pet match");
setTestEventFlag(petEventGame, 4, "end");
petEventGame.pets.push({ ...petEventGame.pets[0], PetId: 962, Name: "条件宠物", Lv: 1, Hp: 10, WorkMaxHp: 10 });
petEventGame = await api("/api/game/dialog", { game: petEventGame, npcId: petEventWarp.npc.id, message: "传送" });
assertEqual(petEventGame.location.mapId, petEventWarp.npc.warp.target.mapId, "PET/ENDEV gated warp passes after source level, event, and pet conditions are satisfied");

let aiWarpGame = await api("/api/game/new", { name: "ai-warp-test" });
aiWarpGame.location = { mapId: warpNpc.map.id, x: warpNpc.npc.x + 1, y: warpNpc.npc.y };
aiWarpGame.player.level = 1;
aiWarpGame.player.stone = 100;
aiWarpGame = await api("/api/game/dialog", { game: aiWarpGame, npcId: warpNpc.npc.id, message: "AI对话" });
aiWarpGame = await api("/api/game/dialog", { game: aiWarpGame, npcId: warpNpc.npc.id, message: "商量坐车去别的地图" });
assertEqual(aiWarpGame.location.mapId, warpNpc.npc.warp.target.mapId, "AI negotiated bus/warp still uses source warp target");
assert(aiWarpGame.dialog.debug.vmTrace.some((event) => event.action === "debug" && event.detail?.reason === "ai-action-proposal"), "AI warp negotiation records a guarded proposal");
assert(aiWarpGame.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "ok"), "AI warp negotiation executes through source warp VM");

let assistGame = await api("/api/game/new", { name: "guide-assist-test" });
assistGame.player.hp = 1;
assistGame.pets[0].Hp = 1;
assistGame = await api("/api/game/rest", { game: assistGame });
assertEqual(assistGame.player.hp, assistGame.player.maxHp, "bottom rest helper restores player hp");
assertEqual(assistGame.pets[0].Hp, assistGame.pets[0].WorkMaxHp, "bottom rest helper restores pet hp");
assistGame.player.hp = 2;
assistGame.pets[0].Hp = 2;
let guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "求你帮我回血" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "heal", "right AI guide can choose heal action");
assertEqual(assistGame.player.hp, assistGame.player.maxHp, "right AI guide heal mutates player hp");
assertEqual(assistGame.pets[0].Hp, assistGame.pets[0].WorkMaxHp, "right AI guide heal mutates pet hp");
assistGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
assistGame.pets[0].Hp = 999;
assistGame.pets[0].WorkMaxHp = 999;
assistGame.pets[0].WorkFixStr = 999;
assistGame.pets[0].WorkFixDex = 999;
const beforeGuidePetExp = Number(assistGame.pets[0].Exp || 0);
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我练宠升级" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "ai-training-battle", "right AI guide can choose battle-based training action");
assert(Number(assistGame.pets[0].Exp || 0) > beforeGuidePetExp, "right AI guide training grants pet exp through battle settlement");
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我一段时间不会遇到野外敌人" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "noEncounter", "right AI guide can grant no-encounter effect");
assert(Number(assistGame.effects?.noEncounterUntil || 0) > Date.now(), "right AI guide no-encounter mutates effects");
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "瞬移去萨姆吉尔的医院" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "teleport", "right AI guide can choose mapwarp teleport action");
assertEqual(assistGame.location.mapId, "1005", "right AI guide teleport uses current map source exit");
assistGame.location = { mapId: "1100", x: 65, y: 35 };
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我瞬移到渔村" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "teleport", "right AI guide understands natural teleport wording");
assertEqual(guideRsp.action.mode, "guide-warp", "right AI guide can teleport by target map name when no direct exit matches");
assertEqual(assistGame.location.mapId, "2000", "right AI guide resolves 渔村 to 玛丽娜丝渔村");
assert(WORLD.maps["7006"] && WORLD.maps["20000"], "arena and duel maps are included in the playable world bundle");
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "带我去萨姆吉尔竞技场" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "teleport", "right AI guide can teleport to bundled arena maps by name");
assertEqual(assistGame.location.mapId, "1007", "right AI guide resolves 萨姆吉尔竞技场 to floor 1007");
assistGame = await api("/api/game/sync", { game: assistGame });
assertEqual(assistGame.world.map.canWildEncounter, false, "arena maps are marked safe even if source tables later add encounter rows");
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我瞬移到渔村" });
assistGame = guideRsp.game;
assistGame = await api("/api/game/sync", { game: assistGame });
assertEqual(assistGame.world.map.canWildEncounter, false, "village maps with stray encount.txt rows are marked safe");
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "有哪些地图可以探索" });
assert(guideRsp.text.includes("260"), "right AI guide includes bundled world map count in local context replies");
await expectApiError(
  "/api/game/encounter",
  { game: assistGame },
  "安全地图",
  "manual wild encounter rejects safe village map"
);
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我找野外敌人" });
assertEqual(guideRsp.action.type, "encounter-refused", "right AI guide refuses wild encounter in safe village map");
assert(!guideRsp.game.encounter, "safe village AI encounter refusal does not create a battle target");
let sourceEncounterGame = await api("/api/game/new", { name: "source-encount-test" });
sourceEncounterGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
const sainasuArea = WORLD.maps["100"].encounterAreas.find((area) => pointInBounds(637, 493, area.bounds));
if (!sainasuArea) throw new Error("missing Sainasu source encounter area fixture");
const gatedGroup = sainasuArea.groups.find((group) => Number(group.appearByItemId) === 1961);
assert(gatedGroup?.enemies.some((enemy) => Number(enemy.lvMin || 0) >= 80), "Sainasu area keeps source item-gated high-level event group");
const allowedEnemyIds = sainasuArea.groups
  .filter((group) => !group.appearByItemId && !group.notAppearByItemId)
  .flatMap((group) => group.enemies.map((enemy) => enemy.enemyId));
sourceEncounterGame = await api("/api/game/encounter", { game: sourceEncounterGame });
assert(allowedEnemyIds.includes(sourceEncounterGame.encounter.EnemyId), "wild encounter resolves encount group1 enemy id");
assert(sourceEncounterGame.battle.enemyParty.every((enemy) => allowedEnemyIds.includes(enemy.EnemyId)), "wild encounter filters group1 appear/not-appear item gates");
assert(sourceEncounterGame.battle.enemyParty.every((enemy) => Number(enemy.Lv || 0) <= 5), "Sainasu ungated encounter stays in the source new-player level range");
assert(sourceEncounterGame.encounter.EnemyTempNo && sourceEncounterGame.encounter.EnemyTempNo !== sourceEncounterGame.encounter.EnemyId, "wild encounter uses enemy1 -> enemybase tempNo instead of treating group id as pet no");
assert(sourceEncounterGame.encounter.WorkTacticsOption?.includes("at:"), "wild source encounter keeps enemy1 battle AI tactics");
assert(sourceEncounterGame.encounter.CaptureRate > 0, "wild source encounters remain catchable");
assert(sourceEncounterGame.battle?.source?.includes("group1.txt"), "wild encounter battle source records group1 resolution");
assert(sourceEncounterGame.battle?.enemyParty?.length <= sainasuArea.enemyMax, "wild encounter party respects encount enemymaxnum");
assertEqual(sourceEncounterGame.characterFields?.battle?.active, true, "battle character fields mark active encounter");
assert(sourceEncounterGame.characterFields.battle.activeEnemy?.elements, "battle character fields expose active enemy elements");
assert(sourceEncounterGame.characterFields.battle.activeEnemy?.work?.WorkFixStr >= 0, "battle character fields expose active enemy work stats");
assert(sourceEncounterGame.characterFields.battle.activeEnemy?.sourceExp > 0, "battle character fields expose source enemy EXP");
assertEqual(
  sourceEncounterGame.characterFields.battle.enemyParty.length,
  sourceEncounterGame.battle.enemyParty.length,
  "battle character fields mirror source enemy party size"
);

let workAliasBattleGame = await api("/api/game/new", { name: "source-work-alias-battle-test" });
workAliasBattleGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
workAliasBattleGame = await api("/api/game/encounter", { game: workAliasBattleGame });
Object.assign(workAliasBattleGame.pets[0], {
  WorkAttackPower: 320,
  WorkFixStr: 1,
  WorkQuick: 900,
  WorkFixDex: 1,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(workAliasBattleGame.encounter, {
  Hp: 30,
  WorkMaxHp: 30,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkDefencePower: 0,
  WorkFixTough: 999,
  WorkQuick: 1,
  WorkFixDex: 999,
  SourceExp: 1,
  Exp: 1
});
workAliasBattleGame.battle.enemyParty = [workAliasBattleGame.encounter];
workAliasBattleGame.battle.activeEnemyIndex = 0;
workAliasBattleGame = await api("/api/game/battle", { game: workAliasBattleGame, action: "攻击" });
assertEqual(workAliasBattleGame.battleOutcome.result, "victory", "battle damage reads source WorkAttackPower/WorkDefencePower aliases");
assert(!workAliasBattleGame.battleOutcome.log.some((line) => line.includes("反击")), "battle turn order reads source WorkQuick alias");

let enemyGuardAiGame = await api("/api/game/new", { name: "enemy-ai-guard-test" });
enemyGuardAiGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyGuardAiGame = await api("/api/game/encounter", { game: enemyGuardAiGame });
Object.assign(enemyGuardAiGame.pets[0], {
  WorkAttackPower: 80,
  WorkFixStr: 80,
  WorkQuick: 900,
  WorkFixDex: 900,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(enemyGuardAiGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 300,
  WorkFixStr: 300,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:0;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
enemyGuardAiGame.battle.enemyParty = [enemyGuardAiGame.encounter];
enemyGuardAiGame.battle.activeEnemyIndex = 0;
enemyGuardAiGame = await api("/api/game/battle", { game: enemyGuardAiGame, action: "攻击" });
assertEqual(enemyGuardAiGame.battleOutcome.result, "turn", "enemy guard AI keeps battle active after reducing incoming damage");
assertEqual(enemyGuardAiGame.battleOutcome.enemyAi?.type, "guard", "enemy AI can choose source guard command without OpenAI");
assert(enemyGuardAiGame.battleOutcome.log.some((line) => line.includes("采取防御姿势")), "enemy guard AI logs deterministic guard action");

let enemyEscapeAiGame = await api("/api/game/new", { name: "enemy-ai-escape-test" });
enemyEscapeAiGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyEscapeAiGame = await api("/api/game/encounter", { game: enemyEscapeAiGame });
enemyEscapeAiGame.player.level = 1;
Object.assign(enemyEscapeAiGame.pets[0], {
  Lv: 1,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(enemyEscapeAiGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  Lv: 140,
  Rare: 0,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:0;3;1|gu:0|es:100|wa:0;0;0;0;0;0;0",
  SourceExp: 999,
  Exp: 999
});
enemyEscapeAiGame.battle.enemyParty = [enemyEscapeAiGame.encounter];
enemyEscapeAiGame.battle.activeEnemyIndex = 0;
enemyEscapeAiGame = await api("/api/game/battle", { game: enemyEscapeAiGame, action: "攻击" });
assertEqual(enemyEscapeAiGame.battleOutcome.result, "enemy-escaped", "enemy escape AI can end battle without EXP");
assertEqual(enemyEscapeAiGame.battleOutcome.enemyAi?.type, "escape", "enemy AI can choose source escape command without OpenAI");
assertEqual(enemyEscapeAiGame.battleOutcome.enemyAi?.sourceCommand, "BATTLE_COM_ESCAPE", "enemy escape records source command");
assert(enemyEscapeAiGame.battleOutcome.enemyAi.escapeChance >= 100, "enemy escape chance follows source-style level formula");
assertEqual(enemyEscapeAiGame.battleOutcome.playerExp, 0, "enemy escape gives no player EXP");
assert(!enemyEscapeAiGame.encounter && !enemyEscapeAiGame.battle, "single enemy escape clears battle state");
assertEqual(enemyEscapeAiGame.lastBattleOutcome.escapedEnemies.length, 1, "last battle outcome persists escaped enemy telemetry");

let enemyEscapeNextGame = await api("/api/game/new", { name: "enemy-ai-escape-next-test" });
enemyEscapeNextGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyEscapeNextGame = await api("/api/game/encounter", { game: enemyEscapeNextGame });
enemyEscapeNextGame.player.level = 1;
Object.assign(enemyEscapeNextGame.pets[0], {
  Lv: 1,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(enemyEscapeNextGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  Lv: 140,
  Rare: 0,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:0;3;1|gu:0|es:100|wa:0;0;0;0;0;0;0"
});
const nextEnemyAfterEscape = {
  ...enemyEscapeNextGame.encounter,
  EnemyId: 999901,
  Name: "留下的敌人",
  Hp: 500,
  WorkMaxHp: 500,
  Lv: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
};
enemyEscapeNextGame.battle.enemyParty = [enemyEscapeNextGame.encounter, nextEnemyAfterEscape];
enemyEscapeNextGame.battle.activeEnemyIndex = 0;
enemyEscapeNextGame = await api("/api/game/battle", { game: enemyEscapeNextGame, action: "攻击" });
assertEqual(enemyEscapeNextGame.battleOutcome.result, "enemy-escaped-next", "enemy escape advances to next live source enemy");
assertEqual(enemyEscapeNextGame.encounter.EnemyId, 999901, "enemy escape selects next live enemy");
assertEqual(enemyEscapeNextGame.battle.activeEnemyIndex, 1, "enemy escape tracks next active enemy index");
assertEqual(enemyEscapeNextGame.battle.escapedEnemies.length, 1, "enemy escape keeps escaped telemetry separate from defeated enemies");
assertEqual(enemyEscapeNextGame.battle.defeatedEnemies.length, 0, "enemy escape does not count as defeated enemy");

let playerGuardGame = await api("/api/game/new", { name: "player-guard-test" });
playerGuardGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerGuardGame = await api("/api/game/encounter", { game: playerGuardGame });
Object.assign(playerGuardGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1
});
Object.assign(playerGuardGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 120,
  WorkFixStr: 120,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
const playerGuardHpBefore = Number(playerGuardGame.pets[0].Hp || 0);
playerGuardGame = await api("/api/game/battle", { game: playerGuardGame, action: "防御" });
assertEqual(playerGuardGame.battleOutcome.result, "turn", "player guard consumes a normal battle turn");
assertEqual(playerGuardGame.battleOutcome.sourceCommand, "G", "player guard records source command G");
assertEqual(playerGuardGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_GUARD", "player guard records BATTLE_COM_GUARD telemetry");
assert(playerGuardGame.battleOutcome.playerAction?.guardAdjust?.source.includes("BATTLE_GuardAdjust"), "player guard uses source guard adjustment");
assert(playerGuardGame.battleOutcome.playerAction.guardAdjust.multiplier <= 0.5, "player guard damage multiplier follows source max half damage");
assert(Number(playerGuardGame.pets[0].Hp || 0) >= playerGuardHpBefore - playerGuardGame.battleOutcome.playerAction.guardAdjust.originalDamage, "player guard reduces incoming damage");
assertEqual(playerGuardGame.lastBattleOutcome.playerAction.sourceCommand, "BATTLE_COM_GUARD", "last battle outcome persists player guard telemetry");

let playerWaitGame = await api("/api/game/new", { name: "player-wait-test" });
playerWaitGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerWaitGame = await api("/api/game/encounter", { game: playerWaitGame });
Object.assign(playerWaitGame.pets[0], { Hp: 999, WorkMaxHp: 999 });
Object.assign(playerWaitGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
const playerWaitEnemyHpBefore = Number(playerWaitGame.encounter.Hp || 0);
playerWaitGame = await api("/api/game/battle", { game: playerWaitGame, action: "等待" });
assertEqual(playerWaitGame.battleOutcome.result, "turn", "player wait consumes a normal battle turn");
assertEqual(playerWaitGame.battleOutcome.sourceCommand, "N", "player wait records source command N");
assertEqual(playerWaitGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_WAIT", "player wait records BATTLE_COM_WAIT telemetry");
assertEqual(Number(playerWaitGame.encounter.Hp || 0), playerWaitEnemyHpBefore, "player wait does not attack the enemy");

let playerEscapeFailGame = await api("/api/game/new", { name: "player-escape-fail-test" });
playerEscapeFailGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerEscapeFailGame = await api("/api/game/encounter", { game: playerEscapeFailGame });
Object.assign(playerEscapeFailGame.player, { level: 1, Luck: 1, WorkFixLuck: 1 });
Object.assign(playerEscapeFailGame.pets[0], { Lv: 1, Hp: 999, WorkMaxHp: 999 });
Object.assign(playerEscapeFailGame.encounter, {
  Lv: 140,
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
playerEscapeFailGame.battle.enemyParty = [playerEscapeFailGame.encounter];
playerEscapeFailGame = await api("/api/game/battle", { game: playerEscapeFailGame, action: "逃跑" });
assertEqual(playerEscapeFailGame.battleOutcome.result, "escape-failed", "player escape can fail through source escape formula");
assertEqual(playerEscapeFailGame.battleOutcome.playerEscape?.sourceCommand, "BATTLE_COM_ESCAPE", "player escape records source command");
assertEqual(playerEscapeFailGame.battleOutcome.playerEscape?.chance, 1, "player escape low-level chance bottoms at source minimum");
assert(playerEscapeFailGame.encounter && playerEscapeFailGame.battle, "failed player escape keeps battle active");
assert(playerEscapeFailGame.battleOutcome.log.some((line) => line.includes("逃跑") && line.includes("失败")), "failed player escape logs failed attempt");

let playerEscapeSuccessGame = await api("/api/game/new", { name: "player-escape-success-test" });
playerEscapeSuccessGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerEscapeSuccessGame = await api("/api/game/encounter", { game: playerEscapeSuccessGame });
Object.assign(playerEscapeSuccessGame.player, { level: 140, Luck: 5, WorkFixLuck: 5 });
Object.assign(playerEscapeSuccessGame.pets[0], { Lv: 140, Hp: 999, WorkMaxHp: 999 });
Object.assign(playerEscapeSuccessGame.encounter, {
  Lv: 1,
  Hp: 500,
  WorkMaxHp: 500,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
playerEscapeSuccessGame.battle.enemyParty = [playerEscapeSuccessGame.encounter];
playerEscapeSuccessGame.battle.playerEscapeAttempts = 1;
playerEscapeSuccessGame = await api("/api/game/battle", { game: playerEscapeSuccessGame, action: "逃跑" });
assertEqual(playerEscapeSuccessGame.battleOutcome.result, "escaped", "player escape succeeds through source escape formula");
assert(playerEscapeSuccessGame.battleOutcome.playerEscape?.chance > 100, "player escape repeated attempt is not capped, matching source");
assertEqual(playerEscapeSuccessGame.battleOutcome.playerExp, 0, "successful player escape gives no EXP");
assert(!playerEscapeSuccessGame.encounter && !playerEscapeSuccessGame.battle, "successful player escape clears battle state");
assertEqual(playerEscapeSuccessGame.lastBattleOutcome.playerEscape.succeeded, true, "last battle outcome persists player escape telemetry");

let playerLevelPointGame = await api("/api/game/new", { name: "player-level-point-test" });
playerLevelPointGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerLevelPointGame.player.exp = Math.max(0, Number(playerLevelPointGame.player.nextExp || 1) - 1);
const playerLevelBeforeSourceGrowth = Number(playerLevelPointGame.player.level || 1);
const playerLevelVitalBefore = Number(playerLevelPointGame.player.Vital || 0);
const playerCharmBefore = Number(playerLevelPointGame.player.charm || 0);
playerLevelPointGame.pets[0].Exp = Math.max(0, Number(playerLevelPointGame.pets[0].NextExp || 2) - 1);
const petLevelBeforeSourceGrowth = Number(playerLevelPointGame.pets[0].Lv || 1);
const petRawBeforeSourceGrowth = ["Vital", "Str", "Tough", "Dex"]
  .reduce((sum, key) => sum + Number(playerLevelPointGame.pets[0][key] || 0), 0);
playerLevelPointGame.pets[0].WorkFixStr = 9999;
playerLevelPointGame.pets[0].WorkFixDex = 9999;
playerLevelPointGame.pets[0].Hp = 999;
playerLevelPointGame.pets[0].WorkMaxHp = 999;
playerLevelPointGame = await api("/api/game/encounter", { game: playerLevelPointGame });
playerLevelPointGame.encounter.Hp = 1;
playerLevelPointGame.encounter.WorkFixDex = 0;
playerLevelPointGame.encounter.SourceExp = 100;
playerLevelPointGame.encounter.Exp = 100;
playerLevelPointGame.battle.enemyParty = [playerLevelPointGame.encounter];
playerLevelPointGame.battle.activeEnemyIndex = 0;
playerLevelPointGame = await api("/api/game/battle", { game: playerLevelPointGame, action: "攻击" });
assertEqual(playerLevelPointGame.battleOutcome.result, "victory", "battle can settle player level-up fixture");
assert(playerLevelPointGame.battleOutcome.playerExp >= 100, "battle outcome exposes structured player EXP gain");
assert(playerLevelPointGame.battleOutcome.petExp >= 100, "battle outcome exposes structured active pet EXP gain");
assert(playerLevelPointGame.battleOutcome.sourceResults.some((item) => item.type === "player" && item.num === -2 && item.exp >= 100), "battle outcome carries source RS_LIST-style player result");
assert(playerLevelPointGame.battleOutcome.sourceResults.some((item) => item.type === "pet" && item.num === 0 && item.exp >= 100), "battle outcome carries source RS_LIST-style pet slot result");
assert(playerLevelPointGame.battleOutcome.levelUps.length >= 1, "battle outcome exposes level-up lines");
assertEqual(playerLevelPointGame.lastBattleOutcome.result, "victory", "game keeps a compact last battle outcome");
assertEqual(playerLevelPointGame.save.json.lastBattleOutcome.result, "victory", "save json carries last battle outcome summary");
assertEqual(playerLevelPointGame.save.json.lastBattleOutcome.sourceResults[0].num, -2, "save json carries source RS_LIST-style battle result telemetry");
assert(playerLevelPointGame.player.level >= 2, "player levels through accumulated battle EXP");
const playerLevelGain = Number(playerLevelPointGame.player.level || 1) - playerLevelBeforeSourceGrowth;
assertEqual(Number(playerLevelPointGame.player.skillUpPoint || 0), playerLevelGain * 3, "player level-up grants source 3 unspent ability points per gained level");
assertEqual(playerLevelPointGame.player.charm, Math.min(100, playerCharmBefore + 2), "player battle settlement applies source CHAR_CHARM gain once per EXP settlement");
assertEqual(playerLevelPointGame.characterFields.base.charm, playerLevelPointGame.player.charm, "character fields expose player charm");
assert(playerLevelPointGame.save.info.includes(`CHARM=${playerLevelPointGame.player.charm}`), "saac-like save info carries player charm");
assert(playerLevelPointGame.save.info.includes(`WORKFIXCHARM=${playerLevelPointGame.player.WorkFixCharm}`), "saac-like save info carries source WorkFixCharm");
assert(playerLevelPointGame.save.info.includes(`WORKATTACKPOWER=${playerLevelPointGame.player.WorkAttackPower}`), "saac-like save info carries source WorkAttackPower");
assertEqual(playerLevelPointGame.player.Vital, playerLevelVitalBefore, "player level-up does not auto-spend Vital");
assert(playerLevelPointGame.pets[0].Lv > petLevelBeforeSourceGrowth, "pet levels through accumulated battle EXP");
assert(
  ["Vital", "Str", "Tough", "Dex"].reduce((sum, key) => sum + Number(playerLevelPointGame.pets[0][key] || 0), 0) > petRawBeforeSourceGrowth,
  "pet level-up applies source CHAR_PetLevelUp raw stat growth"
);

let maxLevelExpGame = await api("/api/game/new", { name: "max-level-exp-test" });
maxLevelExpGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
maxLevelExpGame.player.level = 140;
maxLevelExpGame.player.exp = 1224160000;
Object.assign(maxLevelExpGame.pets[0], {
  Lv: 140,
  Exp: 1224160000,
  WorkAttackPower: 9999,
  WorkFixStr: 9999,
  WorkQuick: 9999,
  WorkFixDex: 9999,
  Hp: 999,
  WorkMaxHp: 999
});
const maxLevelPlayerExpBefore = Number(maxLevelExpGame.player.exp || 0);
const maxLevelPetExpBefore = Number(maxLevelExpGame.pets[0].Exp || 0);
maxLevelExpGame = await api("/api/game/encounter", { game: maxLevelExpGame });
Object.assign(maxLevelExpGame.encounter, {
  Hp: 1,
  WorkMaxHp: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  SourceExp: 100000,
  Exp: 100000
});
maxLevelExpGame.battle.enemyParty = [maxLevelExpGame.encounter];
maxLevelExpGame.battle.activeEnemyIndex = 0;
maxLevelExpGame = await api("/api/game/battle", { game: maxLevelExpGame, action: "攻击" });
assertEqual(maxLevelExpGame.battleOutcome.result, "victory", "battle can settle max-level EXP fixture");
assertEqual(maxLevelExpGame.battleOutcome.playerExp, 0, "max-level player receives no battle EXP");
assertEqual(maxLevelExpGame.battleOutcome.petExp, 0, "max-level active pet receives no battle EXP");
assert(maxLevelExpGame.battleOutcome.sourceResults.some((item) => item.type === "player" && item.num === -2 && item.exp === 0), "max-level player still emits source result entry with zero EXP");
assert(!maxLevelExpGame.battleOutcome.sourceResults.some((item) => item.type === "pet"), "max-level pet with zero WORKGETEXP is skipped in source-style result list");
assertEqual(maxLevelExpGame.player.exp, maxLevelPlayerExpBefore, "max-level player EXP total is unchanged after battle");
assertEqual(maxLevelExpGame.pets[0].Exp, maxLevelPetExpBefore, "max-level pet EXP total is unchanged after battle");

let sourceNoAreaGame = await api("/api/game/new", { name: "source-encount-no-area-test" });
sourceNoAreaGame.location = { mapId: "100", x: 5, y: 5, dir: 2 };
sourceNoAreaGame = await api("/api/game/sync", { game: sourceNoAreaGame });
assertEqual(sourceNoAreaGame.world.map.canWildEncounter, false, "current coordinate without an active encount area is not marked encounterable");
assert(sourceNoAreaGame.world.map.wildEncounterReason.includes("当前坐标"), "no active encount area explains coordinate-specific refusal");
let gatedEncounterGame = await api("/api/game/new", { name: "source-encount-gated-test" });
gatedEncounterGame.location = { mapId: "100", x: 250, y: 180, dir: 2 };
const gatedArea = WORLD.maps["100"].encounterAreas.find((area) => area.id === 980);
const gatedEnemyIds = gatedArea.groups.flatMap((group) => group.enemies.map((enemy) => enemy.enemyId));
gatedEncounterGame = await api("/api/game/sync", { game: gatedEncounterGame });
assertEqual(gatedEncounterGame.world.map.canWildEncounter, false, "item-gated source encounter area is blocked without required item");
assert(gatedEncounterGame.world.map.wildEncounterReason.includes("group1.txt"), "item-gated source encounter explains group1 condition");
gatedEncounterGame.inventory.push({ id: 1693, name: "测试用出现道具", qty: 1, source: "test group1 appear item" });
gatedEncounterGame = await api("/api/game/encounter", { game: gatedEncounterGame });
assert(gatedEnemyIds.includes(gatedEncounterGame.encounter.EnemyId), "required item enables source item-gated encounter group");
const villageGirl = WORLD.maps["1100"].npcs.find((npc) => npc.name === "村庄小姑娘" && npc.x === 68 && npc.y === 36);
if (!villageGirl) throw new Error("missing Koao village girl fixture");
let villageGirlGame = await api("/api/game/new", { name: "npc-ai-teleport-info-test" });
villageGirlGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
villageGirlGame = await api("/api/game/dialog", { game: villageGirlGame, npcId: villageGirl.id, message: "AI对话" });
villageGirlGame = await api("/api/game/dialog", { game: villageGirlGame, npcId: villageGirl.id, message: "帮我瞬移到渔村" });
assertEqual(villageGirlGame.location.mapId, "1100", "non-transport NPC AI does not teleport out of character");
assert(villageGirlGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("不能直接瞬移")), "non-transport NPC AI explains teleport refusal instead of falling back to map reply");
const yayoi = WORLD.maps["2000"].npcs.find((npc) => npc.name === "弥生" && npc.script === "file:sainasu/event/event02_1");
if (!yayoi) throw new Error("missing Yayoi fixture");
let yayoiGame = await api("/api/game/new", { name: "npc-ai-source-item-context-test" });
yayoiGame.location = { mapId: "2000", x: yayoi.x, y: yayoi.y + 1 };
yayoiGame = await api("/api/game/dialog", { game: yayoiGame, npcId: yayoi.id, message: "AI对话" });
yayoiGame = await api("/api/game/dialog", { game: yayoiGame, npcId: yayoi.id, message: "什么是2415呢？" });
const yayoiReply = yayoiGame.dialog.messages.at(-1)?.text || "";
assert(yayoiReply.includes("仙尼亚的花"), "NPC AI source item context resolves itemset id 2415 to its item name");
assert(yayoiReply.includes("不可思议的贝壳"), "NPC AI source item context explains the exchange relation");
assistGame.location = { mapId: "100", x: 637, y: 493 };
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我找野外敌人开战" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "encounter", "right AI guide can spawn source encounter");
assert(assistGame.encounter, "right AI guide encounter mutates battle target");
assistGame.encounter.Hp = 1;
assistGame.pets[0].WorkFixStr = 999;
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我攻击战斗" });
assert(["battle", "encounter"].includes(guideRsp.action.type), "right AI guide can help with an active battle");

console.log("NPC actions OK: source-debug dialogue, VM executor guardrails, allowed/unsupported actions, setFlag/give/take/effect/startBattle/battleAction traces, distance-gated talk/window actions, shop buy/sell, healer, AI healer role-favor aid, savepoint, NPCEnemy prompt/battle/defeat/bribe, battle start/attack/item/capture/release/guard/wait/pet-switch, deterministic enemy/player escape AI, AI negotiated effects/warp/discount/off-menu items, role-fit shop refusals, bottom assist rest, right AI guide actions, source WARP NPC actions, and source FREE/EVENT item/event/pet gates mutate game/save state.");

function assert(value, label) {
  if (!value) throw new Error(label);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

async function expectApiError(pathName, body, text, label) {
  try {
    await api(pathName, body);
  } catch (error) {
    assert(String(error.message || "").includes(text), `${label}: expected error containing ${text}, got ${error.message}`);
    return;
  }
  throw new Error(`${label}: expected API error`);
}

function farLocation(map, npc) {
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const candidates = [
    { mapId: map.id, x: 0, y: 0 },
    { mapId: map.id, x: width - 1, y: height - 1 },
    { mapId: map.id, x: 0, y: height - 1 },
    { mapId: map.id, x: width - 1, y: 0 }
  ];
  const far = candidates.find((item) => distance(item.x, item.y, npc.x, npc.y) > 4);
  if (!far) throw new Error(`cannot find far point for ${npc.name}`);
  return far;
}

async function walkSourceWarp(game, fromMapId, toMapId) {
  const map = WORLD.maps[String(fromMapId)];
  const exit = map?.exits?.find((item) => String(item.to) === String(toMapId));
  if (!exit) throw new Error(`missing source mapwarp ${fromMapId}->${toMapId}`);
  const tile = exit.tiles?.[0] || { x: exit.x, y: exit.y };
  return api("/api/game/walk", {
    game: {
      ...game,
      dialog: null,
      encounter: null,
      battle: null,
      location: { mapId: String(fromMapId), x: tile.x, y: tile.y, dir: 2 },
      player: { ...game.player, dir: 2 }
    },
    dx: 0,
    dy: 0
  });
}

function distance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax) - Number(bx)), Math.abs(Number(ay) - Number(by)));
}

function pointInBounds(x, y, bounds = []) {
  return x >= Number(bounds[0] || 0)
    && y >= Number(bounds[1] || 0)
    && x <= Number(bounds[2] || 0)
    && y <= Number(bounds[3] || 0);
}

function inventoryQty(game, id) {
  return (game.inventory || [])
    .filter((item) => Number(item.id) === Number(id))
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function setTestEventFlag(game, shiftbit, kind = "end") {
  game.flags ||= {};
  const field = kind === "now" ? "nowEvents" : "endEvents";
  game.flags[field] ||= Array(8).fill(0);
  game.flags.bits ||= {};
  const index = Math.floor(Number(shiftbit) / 32);
  const bit = Number(shiftbit) % 32;
  while (game.flags[field].length <= index) game.flags[field].push(0);
  game.flags[field][index] = (Number(game.flags[field][index] || 0) | (1 << bit)) >>> 0;
  game.flags.bits[`${kind}:${shiftbit}`] = true;
}

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}
