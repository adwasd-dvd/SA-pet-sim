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

let petModeGame = await api("/api/game/new", { name: "pet-mode-test" });
petModeGame.pets.push({
  ...petModeGame.pets[0],
  Name: "备用奥卡洛斯",
  PetId: Number(petModeGame.pets[0].PetId || 100) + 1,
  ImgNo: petModeGame.pets[0].ImgNo,
  Lv: 3,
  Hp: 80,
  WorkMaxHp: 80,
  WorkFixStr: 120
});
petModeGame = await api("/api/game/pet-mode", { game: petModeGame, petIndex: 1, mode: "active" });
assertEqual(petModeGame.petState.activeIndex, 1, "pet-mode can select a non-leading active pet");
assertEqual(petModeGame.petState.activeName, "备用奥卡洛斯", "pet state exposes selected active pet name");
const activePetLevelBefore = petModeGame.pets[1].Lv;
const petGuideRsp = await api("/api/ai/guide", { game: petModeGame, prompt: "帮我训练出战宠" });
assertEqual(petGuideRsp.action.petIndex, 1, "AI guide trains the selected active pet");
assert(petGuideRsp.game.pets[1].Lv > activePetLevelBefore, "selected active pet gains levels through guide training");
assertEqual(petGuideRsp.game.petState.activeIndex, 1, "selected active pet survives save/map wrapping");

const teacher = WORLD.maps["1000"].npcs.find((npc) => npc.name.includes("老师"));
if (!teacher) throw new Error("missing teacher NPC fixture");
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
const questExpReward = Number(teacherGame.quests[teacher.questId].expReward || 20);
const questStoneReward = Number(teacherGame.quests[teacher.questId].stoneReward || 80);
const expBeforeQuest = teacherGame.player.exp;
const stoneBeforeQuest = teacherGame.player.stone;
teacherGame.quests[teacher.questId].status = "可回报";
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "hi" });
assertEqual(teacherGame.player.exp, expBeforeQuest + questExpReward, "teacher quest reward adds player exp through VM");
assertEqual(teacherGame.player.stone, stoneBeforeQuest + questStoneReward, "teacher quest reward adds stone through VM");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "quest-complete"), "teacher quest complete records setFlag VM event");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "quest"), "teacher quest complete records give VM event");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.executor === "npc-action-vm"), "teacher give runs through NPC VM executor");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.mutated === true), "teacher give mutates state through NPC VM executor");

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
ganzoTargetGame.pets[0].WorkFixStr = 999;
ganzoTargetGame.pets[0].WorkFixDex = 999;
ganzoTargetGame = await api("/api/game/battle", { game: ganzoTargetGame, action: "attack:1" });
assertEqual(ganzoTargetGame.battleOutcome.result, "next-enemy", "targeted battle command can defeat a selected non-leading enemy");
assertEqual(ganzoTargetGame.encounter.EnemyId, 253, "targeted battle returns to the remaining live enemy");
assertEqual(ganzoTargetGame.battle.activeEnemyIndex, 0, "targeted battle tracks active enemy index after selection");
assert(ganzoTargetGame.battle.defeatedEnemies.some((enemy) => enemy.EnemyId === 254), "targeted battle records defeated selected enemy");
let ganzoCaptureGame = JSON.parse(JSON.stringify(ganzoBattleGame));
const ganzoPetsBeforeCapture = ganzoCaptureGame.pets.length;
ganzoCaptureGame.encounter.WorkFixStr = 1;
ganzoCaptureGame = await api("/api/game/battle", { game: ganzoCaptureGame, action: "捕获" });
assertEqual(ganzoCaptureGame.battleOutcome.result, "capture-missed", "Ganzo NPCEnemy capture always misses");
assertEqual(ganzoCaptureGame.pets.length, ganzoPetsBeforeCapture, "Ganzo NPCEnemy capture does not add a pet");
ganzoBattleGame.encounter.Hp = 1;
ganzoBattleGame.encounter.WorkFixDex = 0;
ganzoBattleGame.pets[0].WorkFixStr = 999;
ganzoBattleGame.pets[0].WorkFixDex = 999;
ganzoBattleGame = await api("/api/game/battle", { game: ganzoBattleGame, action: "攻击" });
assertEqual(ganzoBattleGame.battleOutcome.result, "next-enemy", "Ganzo first defeated target advances to next source enemy");
assertEqual(ganzoBattleGame.encounter.EnemyId, 254, "Ganzo advances to source enemy1 id 254");
assert(!ganzoBattleGame.flags.npcEnemyDefeats[ganzo.id]?.until, "Ganzo blocker does not clear before all source enemies are defeated");
ganzoBattleGame.encounter.Hp = 1;
ganzoBattleGame.encounter.WorkFixDex = 0;
ganzoBattleGame = await api("/api/game/battle", { game: ganzoBattleGame, action: "攻击" });
assertEqual(ganzoBattleGame.battleOutcome.result, "victory", "Ganzo NPCEnemy can be defeated through battle API");
assertEqual(ganzoBattleGame.battleOutcome.defeatedEnemies.length, 2, "Ganzo final victory reports both source enemies defeated");
assert(ganzoBattleGame.flags.npcEnemyDefeats[ganzo.id]?.until, "Ganzo victory records source dieact=0 respawn timer");
assert(!ganzoBattleGame.world.map.npcs.some((npc) => npc.id === ganzo.id), "Ganzo victory hides the blocker NPC from the active map");

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
const beforeGuidePetLv = assistGame.pets[0].Lv;
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我练宠升级" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "train", "right AI guide can choose train action");
assert(assistGame.pets[0].Lv > beforeGuidePetLv, "right AI guide training mutates pet level");
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
assert(sourceEncounterGame.encounter.CaptureRate > 0, "wild source encounters remain catchable");
assert(sourceEncounterGame.battle?.source?.includes("group1.txt"), "wild encounter battle source records group1 resolution");
assert(sourceEncounterGame.battle?.enemyParty?.length <= sainasuArea.enemyMax, "wild encounter party respects encount enemymaxnum");
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
assistGame.location = { mapId: "100", x: 637, y: 493 };
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我找野外敌人开战" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "encounter", "right AI guide can spawn source encounter");
assert(assistGame.encounter, "right AI guide encounter mutates battle target");
assistGame.encounter.Hp = 1;
assistGame.pets[0].WorkFixStr = 999;
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我攻击战斗" });
assert(["battle", "encounter"].includes(guideRsp.action.type), "right AI guide can help with an active battle");

console.log("NPC actions OK: source-debug dialogue, VM executor guardrails, allowed/unsupported actions, setFlag/give/take/effect/startBattle/battleAction traces, distance-gated talk/window actions, healer, savepoint, NPCEnemy prompt/battle/defeat/bribe, battle start/attack/item/capture/release, AI negotiated effects/warp/discount/off-menu items, role-fit shop refusals, bottom assist rest, right AI guide actions, and source WARP NPC actions mutate game/save state.");

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

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}
