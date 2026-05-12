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
assert([253, 254].includes(Number(ganzoBattleGame.encounter?.PetId)), "Ganzo YES creates source enemyno encounter");
assertEqual(ganzoBattleGame.encounter.CaptureRate, 0, "Ganzo NPCEnemy encounter is not catchable");
assert(ganzoBattleGame.battle?.source?.includes("npc_npcenemy.c"), "Ganzo battle records NPCEnemy source");
assertEqual(ganzoBattleGame.battle?.npcEnemy?.npcId, ganzo.id, "Ganzo battle keeps NPCEnemy metadata");
assert(ganzoBattleGame.battle.log.some((line) => line.includes("呼拔吉，去吧")), "Ganzo battle logs source startmsg");
assert(ganzoBattleGame.dialog.suggestions.includes("攻击") && ganzoBattleGame.dialog.suggestions.includes("防御"), "Ganzo battle exposes battle commands");
assert(!ganzoBattleGame.dialog.suggestions.includes("捕获"), "Ganzo NPCEnemy battle does not suggest capture");
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
assertEqual(ganzoBattleGame.battleOutcome.result, "victory", "Ganzo NPCEnemy can be defeated through battle API");
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

console.log("NPC actions OK: source-debug dialogue, VM executor guardrails, allowed/unsupported actions, setFlag/give/take/startBattle/battleAction traces, distance-gated talk/window actions, healer, savepoint, NPCEnemy prompt/battle/defeat, battle start/attack/item/capture/release, and source WARP NPC actions mutate game/save state.");

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
