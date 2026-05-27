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

const apiWithEnv = async (customEnv, pathName, body) => {
  const response = await worker.fetch(new Request(`http://local.test${pathName}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }), customEnv);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `API failed: ${pathName}`);
  return data;
};

const api = (pathName, body) => apiWithEnv(env, pathName, body);

function pendingNpcProposal(game) {
  return game.dialog?.proposal || game.flags?.pendingNpcProposal || game.save?.json?.flags?.pendingNpcProposal || null;
}

function assertNpcProposal(game, kind, label) {
  const proposal = pendingNpcProposal(game);
  assert(proposal?.id, `${label} creates pending proposal`);
  if (kind) assertEqual(proposal.kind, kind, `${label} proposal kind`);
  assert(game.dialog?.messages?.some((message) => message.speaker === "npc" && /需要你确认|提案/.test(message.text || "")), `${label} explains confirmation`);
  return proposal;
}

async function acceptNpcProposal(game, npcId, label, selectedPetIndex = undefined) {
  const proposal = assertNpcProposal(game, null, label);
  return api("/api/game/dialog-proposal", {
    game,
    npcId,
    proposalId: proposal.id,
    decision: "accept",
    ...(Number.isFinite(Number(selectedPetIndex)) ? { selectedPetIndex: Number(selectedPetIndex) } : {})
  });
}

async function declineNpcProposal(game, npcId, label) {
  const proposal = assertNpcProposal(game, null, label);
  return api("/api/game/dialog-proposal", {
    game,
    npcId,
    proposalId: proposal.id,
    decision: "decline"
  });
}

function isStoneOnlyTradePointFixture(npc) {
  return npc?.trade?.source === "gmsv-data/npc/scipt_plus/test2nd/c_can_mm";
}

function fillInventoryForCapacity(game, length = 20) {
  game.inventory = Array.from({ length }, (_, index) => ({
    id: 970000 + index,
    name: `容量测试物品${index}`,
    qty: 1,
    source: "check-npc-capacity"
  }));
}

function fillPetsForCapacity(game, length = 5) {
  const base = structuredClone(game.pets?.[0] || { Name: "容量测试宠物", PetId: 100, Lv: 1, Hp: 1, WorkMaxHp: 1 });
  game.pets = Array.from({ length }, (_, index) => ({
    ...structuredClone(base),
    Name: `容量测试宠物${index}`,
    PetId: 970000 + index,
    id: 970000 + index
  }));
}

let game = await api("/api/game/new", { name: "npc-action-test" });
assertEqual(game.player.EarthAT, 50, "new player keeps source-style Earth attribute default");
assertEqual(game.player.WaterAT, 50, "new player keeps source-style Water attribute default");
assertEqual(game.player.FireAT, 0, "new player starts without opposite Fire attribute");
assertEqual(game.player.WindAT, 0, "new player starts without opposite Wind attribute");
assertEqual(game.player.charm, 60, "new player starts with source CHAR_CHARM default");
assertEqual(game.player.fame, 0, "new player starts with source CHAR_FAME default");
assertEqual(game.player.amPoint, 0, "new player starts with source CHAR_AMPOINT default");
assertEqual(game.characterFields?.base?.fame, 0, "character fields expose source CHAR_FAME");
assertEqual(game.characterFields?.base?.amPoint, 0, "character fields expose source CHAR_AMPOINT");
assert(game.save.info.includes("FAME=0"), "saac-like save info includes source CHAR_FAME");
assert(game.save.info.includes("AMPOINT=0"), "saac-like save info includes source CHAR_AMPOINT");

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
assertEqual(game.player.startPoint, 0, "new player defaults to source startpoint SP=0");
assertEqual(game.player.savePointMask, 1, "new player defaults to source CHAR_SAVEPOINT bit 0");
assertEqual(game.characterFields?.base?.startPoint, 0, "character fields expose source startpoint");
assert(game.save.info.includes("STARTPOINT=0"), "saac-like save info records source startpoint");
assert(game.save.info.includes("SAVEPOINT=1"), "saac-like save info records source CHAR_SAVEPOINT mask");
let defaultReturnPointGame = await api("/api/game/new", { name: "default-return-point-test" });
defaultReturnPointGame.location = { mapId: "300", x: 274, y: 403, dir: 4 };
defaultReturnPointGame.savePoint = { mapId: "300", x: 274, y: 403, source: "stale-local-tile-without-source-born" };
defaultReturnPointGame = await api("/api/game/return-savepoint", { game: defaultReturnPointGame });
assertEqual(defaultReturnPointGame.location.mapId, WORLD.startMap, "return point ignores stale recent tile when no source Born savepoint exists");
assertEqual(defaultReturnPointGame.location.x, WORLD.maps[WORLD.startMap].spawn[0], "return point without source Born uses birth x");
assertEqual(defaultReturnPointGame.location.y, WORLD.maps[WORLD.startMap].spawn[1], "return point without source Born uses birth y");
assertEqual(defaultReturnPointGame.returnPoint.kind, "start", "return point reports birth fallback when player has not changed record point through NPC");

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
assertEqual(petGuideRsp.action.type, "auto-level", "AI guide routes training requests to auto leveling");
assertEqual(petGuideRsp.action.enabled, true, "AI guide can request client auto leveling");
assertEqual(petGuideRsp.game.pets[1].Lv, activePetLevelBefore, "AI guide no longer mutates pet levels directly");
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

let allyQueueBattleGame = await api("/api/game/new", { name: "ally-command-queue-battle-test" });
allyQueueBattleGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
allyQueueBattleGame = await api("/api/game/encounter", { game: allyQueueBattleGame });
Object.assign(allyQueueBattleGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  Str: 12000,
  Dex: 5000,
  WorkAttackPower: 120,
  WorkFixStr: 120,
  WorkQuick: 50,
  WorkFixDex: 50
});
Object.assign(allyQueueBattleGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  Str: 100,
  Dex: 10000,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 100,
  WorkFixDex: 100
});
Object.assign(allyQueueBattleGame.encounter, {
  Hp: 80,
  WorkMaxHp: 80,
  Str: 100,
  Tough: 0,
  Dex: 100,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1,
  SourceExp: 1,
  Exp: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
allyQueueBattleGame.battle.enemyParty = [allyQueueBattleGame.encounter];
allyQueueBattleGame.battle.activeEnemyIndex = 0;
allyQueueBattleGame = await api("/api/game/battle", { game: allyQueueBattleGame, action: "攻击" });
assertEqual(allyQueueBattleGame.battleOutcome.result, "victory", "source-like ally queue lets player attack with active pet");
assertEqual(allyQueueBattleGame.battleOutcome.playerAction?.supportAction?.actorKind, "player", "normal attack records player support action when pet is active");
assert(
  allyQueueBattleGame.battleOutcome.log.some((line) => line.includes(allyQueueBattleGame.player.name) && line.includes("攻击")),
  "battle log includes player support attack"
);

let enemyTargetPlayerGame = await api("/api/game/new", { name: "enemy-target-player-test" });
enemyTargetPlayerGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyTargetPlayerGame = await api("/api/game/encounter", { game: enemyTargetPlayerGame });
Object.assign(enemyTargetPlayerGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  Tough: 0,
  Dex: 1,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetPlayerGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  Tough: 0,
  Dex: 1,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetPlayerGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  Str: 800,
  Tough: 0,
  Dex: 5000,
  WorkAttackPower: 80,
  WorkFixStr: 80,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
enemyTargetPlayerGame.battle.enemyParty = [enemyTargetPlayerGame.encounter];
enemyTargetPlayerGame.battle.activeEnemyIndex = 0;
enemyTargetPlayerGame = await api("/api/game/battle", { game: enemyTargetPlayerGame, action: "防御" });
assertEqual(enemyTargetPlayerGame.battleOutcome.enemyAi?.targetKind, "player", "enemy ai honors source target player rule");
assert(Number(enemyTargetPlayerGame.player.hp || 0) < 98, "source target player rule damages the player even when a pet is active");
assertEqual(Number(enemyTargetPlayerGame.pets[0].Hp || 0), 999, "source target player rule does not redirect damage to the active pet");
assert(enemyTargetPlayerGame.battleOutcome.log.some((line) => line.includes(enemyTargetPlayerGame.player.name) && line.includes("攻击")), "enemy target log names the selected player target");

let enemyTargetStrGame = await api("/api/game/new", { name: "enemy-target-str-select-test" });
enemyTargetStrGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyTargetStrGame = await api("/api/game/encounter", { game: enemyTargetStrGame });
Object.assign(enemyTargetStrGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  Str: 5000,
  Dex: 1,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetStrGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  Str: 1,
  Dex: 5000,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetStrGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 10,
  WorkFixStr: 10,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;1;4|rn:999999|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
enemyTargetStrGame.battle.enemyParty = [enemyTargetStrGame.encounter];
enemyTargetStrGame.battle.activeEnemyIndex = 0;
enemyTargetStrGame = await api("/api/game/battle", { game: enemyTargetStrGame, action: "防御" });
assertEqual(enemyTargetStrGame.battleOutcome.enemyAi?.targetSelectMetric, "STR_MAX", "enemy ai honors source STR_MAX target selection");
assertEqual(enemyTargetStrGame.battleOutcome.enemyAi?.targetKind, "player", "source STR_MAX selection chooses the stronger player over the active pet");

let enemyTargetRandomRuleGame = await api("/api/game/new", { name: "enemy-target-rn-random-test" });
enemyTargetRandomRuleGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyTargetRandomRuleGame = await api("/api/game/encounter", { game: enemyTargetRandomRuleGame });
Object.assign(enemyTargetRandomRuleGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetRandomRuleGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetRandomRuleGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 10,
  WorkFixStr: 10,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;1;3|rn:0|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
enemyTargetRandomRuleGame.battle.enemyParty = [enemyTargetRandomRuleGame.encounter];
enemyTargetRandomRuleGame.battle.activeEnemyIndex = 0;
enemyTargetRandomRuleGame = await api("/api/game/battle", { game: enemyTargetRandomRuleGame, action: "防御" });
assertEqual(enemyTargetRandomRuleGame.battleOutcome.enemyAi?.targetSelectMetric, "HP_MIN", "enemy ai records source HP_MIN selection metric");
assertEqual(enemyTargetRandomRuleGame.battleOutcome.enemyAi?.targetRandomized, true, "enemy ai honors source rn:0 random target override");

let enemyWazaFallbackGame = await api("/api/game/new", { name: "enemy-wa-fallback-test" });
enemyWazaFallbackGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyWazaFallbackGame = await api("/api/game/encounter", { game: enemyWazaFallbackGame });
Object.assign(enemyWazaFallbackGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyWazaFallbackGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyWazaFallbackGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 80,
  WorkFixStr: 80,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:3;0;0;0;0;0;0"
});
enemyWazaFallbackGame.battle.enemyParty = [enemyWazaFallbackGame.encounter];
enemyWazaFallbackGame.battle.activeEnemyIndex = 0;
enemyWazaFallbackGame = await api("/api/game/battle", { game: enemyWazaFallbackGame, action: "防御" });
assertEqual(enemyWazaFallbackGame.battleOutcome.enemyAi?.type, "wait", "wa-only source tactics fallback to non-attack action when skill runtime is unavailable");
assertEqual(enemyWazaFallbackGame.battleOutcome.enemyAi?.sourceCommand, "BATTLE_COM_WAIT", "wa-only source fallback records BATTLE_COM_WAIT command telemetry");
assertEqual(Number(enemyWazaFallbackGame.player.hp || 0), 98, "wa-only source fallback does not force an unintended enemy normal attack");
assert(enemyWazaFallbackGame.battleOutcome.log.some((line) => line.includes("暂不行动")), "wa-only source fallback logs enemy wait behavior");

let enemyTargetPlayerDefeatGame = await api("/api/game/new", { name: "enemy-target-player-defeat-test" });
enemyTargetPlayerDefeatGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
enemyTargetPlayerDefeatGame = await api("/api/game/encounter", { game: enemyTargetPlayerDefeatGame });
Object.assign(enemyTargetPlayerDefeatGame.player, {
  hp: 1,
  maxHp: 98,
  WorkMaxHp: 98,
  Tough: 0,
  Dex: 1,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetPlayerDefeatGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(enemyTargetPlayerDefeatGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  Str: 800,
  Dex: 5000,
  WorkAttackPower: 80,
  WorkFixStr: 80,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
enemyTargetPlayerDefeatGame.battle.enemyParty = [enemyTargetPlayerDefeatGame.encounter];
enemyTargetPlayerDefeatGame.battle.activeEnemyIndex = 0;
enemyTargetPlayerDefeatGame = await api("/api/game/battle", { game: enemyTargetPlayerDefeatGame, action: "防御" });
assertEqual(enemyTargetPlayerDefeatGame.battleOutcome.result, "defeat", "player knockout by enemy target rule ends battle even if active pet survives");
assertEqual(enemyTargetPlayerDefeatGame.encounter, null, "player knockout clears battle encounter");

let petKoBattleGame = await api("/api/game/new", { name: "pet-ko-continues-test" });
petKoBattleGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
petKoBattleGame = await api("/api/game/encounter", { game: petKoBattleGame });
Object.assign(petKoBattleGame.player, {
  hp: 98,
  maxHp: 98,
  WorkMaxHp: 98,
  Str: 0,
  Dex: 100,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(petKoBattleGame.pets[0], {
  Hp: 1,
  WorkMaxHp: 1,
  Str: 0,
  Dex: 100,
  Tough: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(petKoBattleGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  Str: 5000,
  Tough: 0,
  Dex: 99900,
  WorkAttackPower: 50,
  WorkFixStr: 50,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
petKoBattleGame.battle.enemyParty = [petKoBattleGame.encounter];
petKoBattleGame.battle.activeEnemyIndex = 0;
petKoBattleGame = await api("/api/game/battle", { game: petKoBattleGame, action: "攻击" });
assertEqual(petKoBattleGame.battleOutcome.result, "pet-defeated", "active pet knockout no longer counts as full party defeat");
assert(petKoBattleGame.encounter && petKoBattleGame.battle, "pet knockout keeps battle active while player is alive");
assertEqual(petKoBattleGame.petFormation.activeIndex, -1, "pet knockout withdraws active pet so player can continue");
assert(petKoBattleGame.battleOutcome.log.some((line) => line.includes("继续战斗")), "pet knockout log explains player continues");

const petShopEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.petShop?.poolEnabled);
assert(petShopEntry, "world build parses source npcgen_petshop pool scripts");
let petShopGame = await api("/api/game/new", { name: "pet-shop-pool-test" });
petShopGame.player.stone = 1000;
petShopGame.location = {
  mapId: petShopEntry.map.id,
  x: petShopEntry.npc.x,
  y: Math.max(0, petShopEntry.npc.y - 1),
  dir: 4
};
petShopGame.pets.push({
  ...petShopGame.pets[0],
  Name: "寄放测试奥卡洛斯",
  PetId: Number(petShopGame.pets[0].PetId || 100) + 10,
  Lv: 4,
  PetGetLv: 1,
  Hp: 62,
  WorkMaxHp: 62,
  Loyalty: 80,
  Rare: 0
});
const petShopPetCountBefore = petShopGame.pets.length;
const petShopStoneBefore = Number(petShopGame.player.stone || 0);
petShopGame = await api("/api/game/talk", { game: petShopGame, npcId: petShopEntry.npc.id });
assert(petShopGame.dialog?.petShop?.poolEnabled, "pet shop dialog exposes source pool metadata");
assert(petShopGame.dialog?.messages?.some((message) => String(message.text || "").includes("随身宠物")), "pet shop talk explains carried pets");
petShopGame = await api("/api/game/pool-pet", { game: petShopGame, npcId: petShopEntry.npc.id, action: "deposit", petIndex: 1 });
assertEqual(petShopGame.pets.length, petShopPetCountBefore - 1, "pet shop deposit moves a pet out of carried pets");
assertEqual(petShopGame.petPoolState.used, 1, "pet shop deposit fills one source-style pool slot");
assert(Number(petShopGame.player.stone || 0) < petShopStoneBefore, "pet shop deposit charges source-style stone cost");
assert(petShopGame.dialog?.debug?.vmTrace?.some((event) => event.action === "petShop" && event.detail?.action === "deposit"), "pet shop deposit records a petShop VM trace");
petShopGame = await api("/api/game/pool-pet", { game: petShopGame, npcId: petShopEntry.npc.id, action: "withdraw", poolIndex: 0 });
assertEqual(petShopGame.pets.length, petShopPetCountBefore, "pet shop withdraw returns a pet to carried pets");
assertEqual(petShopGame.petPoolState.used, 0, "pet shop withdraw clears the source-style pool slot");
assert(petShopGame.save.info.includes("POOLPETCOUNT=0"), "saac-like save info records pool pet count");

const passShopEntry = {
  map: WORLD.maps["1100"],
  npc: WORLD.maps["1100"].npcs.find((npc) => npc.trade?.source === "gmsv-data/npc/genout/ss_1100_86_107")
};
assert(passShopEntry.npc, "world build keeps source pass shop fixture");
assertEqual(passShopEntry.npc.trade.noteMessage, "最近如何？", "npcgen_shop bare msg is preserved as shop note metadata");
assert(passShopEntry.npc.scriptHints?.hints?.includes("Msg:最近如何？"), "shop note msg is exposed through compact script hints");
let passShopGame = await api("/api/game/new", { name: "shop-msg-note-test" });
passShopGame.location = {
  mapId: passShopEntry.map.id,
  x: passShopEntry.npc.x,
  y: Math.max(0, passShopEntry.npc.y - 1),
  dir: 4
};
passShopGame = await api("/api/game/talk", { game: passShopGame, npcId: passShopEntry.npc.id });
assertEqual(passShopGame.dialog?.trade?.noteMessage, "最近如何？", "shop dialog exposes source msg note without invoking AI");
passShopGame = await api("/api/game/dialog", { game: passShopGame, npcId: passShopEntry.npc.id, message: "买东西" });
assert(passShopGame.dialog?.messages?.some((message) => String(message.text || "").includes("最近如何？")), "shop prompt includes the source msg note");

const petFusionEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.petFusion?.eggEnemyIds?.length);
assert(petFusionEntry, "world build parses source npc_petfusion ADDEGGID scripts");
assert(petFusionEntry.npc.scriptHints?.actions?.includes("petFusion"), "npc_petfusion script hints expose petFusion action");
assert(petFusionEntry.npc.petFusion.eggs?.some((egg) => egg.name && Number(egg.tempNo || 0) > 0), "npc_petfusion resolves ADDEGGID through enemy1 metadata");
let petFusionGame = await api("/api/game/new", { name: "pet-fusion-window-test" });
petFusionGame.location = {
  mapId: petFusionEntry.map.id,
  x: Math.max(0, Number(petFusionEntry.npc.x || 0) - 1),
  y: Number(petFusionEntry.npc.y || 0),
  dir: 2
};
petFusionGame.pets.push({
  ...petFusionGame.pets[0],
  Name: "副宠测试奥卡洛斯",
  PetId: Number(petFusionGame.pets[0].PetId || 100),
  Lv: 6,
  Hp: 80,
  WorkMaxHp: 80,
  FusionBeit: 0,
  FusionRaise: 0
});
petFusionGame = await api("/api/game/talk", { game: petFusionGame, npcId: petFusionEntry.npc.id });
assert(petFusionGame.dialog?.petFusion?.eggs?.length, "pet fusion dialog exposes source egg metadata");
assert(petFusionGame.dialog?.debug?.actions?.includes("petFusion"), "pet fusion dialog debug exposes petFusion action profile");
assert(petFusionGame.dialog?.messages?.some((message) => /融合|宠物蛋|生成/.test(String(message.text || ""))), "pet fusion talk explains source fusion window and egg result without leaking script ids");
petFusionGame = await api("/api/game/dialog", { game: petFusionGame, npcId: petFusionEntry.npc.id, message: "融合" });
assert(petFusionGame.dialog?.debug?.vmTrace?.some((event) => event.action === "petFusion" && event.status === "ok"), "pet fusion dialog records deterministic petFusion VM trace");
const petFusionPetCountBefore = petFusionGame.pets.length;
petFusionGame = await api("/api/game/pet-fusion", { game: petFusionGame, npcId: petFusionEntry.npc.id, mainIndex: 0, subIndex1: 1 });
assertEqual(petFusionGame.pets.length, petFusionPetCountBefore - 1, "pet fusion consumes two selected pets and adds one egg");
const fusedEgg = petFusionGame.pets[0];
assertEqual(Number(fusedEgg.FusionBeit || fusedEgg.CHAR_FUSIONBEIT || 0), 1, "pet fusion marks the generated pet as a source-style fusion egg");
assertEqual(Number(fusedEgg.FusionRaise || fusedEgg.CHAR_FUSIONRAISE || 0), 40, "pet fusion keeps source FUSIONRAISE incubation value");
assert(Number(fusedEgg.FusionIndex || fusedEgg.CHAR_FUSIONINDEX || fusedEgg.FusionResultPetId || 0) > 0, "pet fusion stores the source result pet id on the egg");
assert(Array.isArray(fusedEgg.FusionParents) && fusedEgg.FusionParents.length === 2, "pet fusion records both consumed source pets");
assert(petFusionGame.dialog?.debug?.vmTrace?.some((event) => event.action === "petFusion" && event.detail?.mutated === true), "pet fusion execution records a mutated petFusion VM trace");

const quizEntryNpcs = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .filter(({ npc }) => npc.quiz || String(npc.script || "").includes("quz_"));
assert(quizEntryNpcs.length >= 2, "world build keeps source quiz NPC fixtures with EntryItem-style keys");
assert(quizEntryNpcs.every(({ npc }) => !npc.janken), "source quiz NPCs are not misclassified as Janken by EntryItem/NoItem metadata");
const quizRuntimeEntry = quizEntryNpcs.find(({ npc }) => (
  npc.quiz?.questions?.length
  && npc.quiz?.entryItems?.length
  && npc.quiz?.rewardItems?.length
)) || quizEntryNpcs.find(({ npc }) => npc.quiz?.questions?.length);
assert(quizRuntimeEntry, "world build parses source quiz runtime metadata and question fixtures");
assert(quizRuntimeEntry.npc.scriptHints?.actions?.includes("quiz"), "source quiz NPCs expose quiz script action hints");
let quizGame = await api("/api/game/new", { name: "source-quiz-runtime-test" });
quizGame.location = {
  mapId: quizRuntimeEntry.map.id,
  x: quizRuntimeEntry.npc.x,
  y: Math.max(0, quizRuntimeEntry.npc.y - 1),
  dir: 4
};
quizGame = await api("/api/game/talk", { game: quizGame, npcId: quizRuntimeEntry.npc.id });
assert(quizGame.dialog?.quiz?.quizCount >= 1, "source quiz dialog exposes question count metadata");
assert(quizGame.dialog?.debug?.actions?.includes("quiz"), "source quiz dialog debug exposes quiz action");
if (quizRuntimeEntry.npc.quiz?.entryItems?.length) {
  quizGame = await api("/api/game/dialog", { game: quizGame, npcId: quizRuntimeEntry.npc.id, message: "开始" });
  assert(!quizGame.flags?.pendingQuiz, "source quiz blocks start when required entry items are missing");
  assert(quizGame.dialog?.debug?.vmTrace?.some((event) => event.action === "quiz" && event.status === "blocked"), "blocked source quiz records deterministic VM trace");
}
quizGame = await api("/api/game/dialog", { game: quizGame, npcId: quizRuntimeEntry.npc.id, message: "hi" });
for (const item of quizRuntimeEntry.npc.quiz.entryItems || []) {
  quizGame.inventory.push({ id: item.id, name: item.name, qty: Math.max(1, Number(item.qty || 1)), source: item.source || "source quiz test" });
}
quizGame.player.stone = Math.max(Number(quizGame.player.stone || 0), Number(quizRuntimeEntry.npc.quiz.entryStone || 0));
const quizEntryBefore = new Map((quizRuntimeEntry.npc.quiz.entryItems || []).map((item) => [Number(item.id), inventoryQty(quizGame, item.id)]));
quizGame = await api("/api/game/dialog", { game: quizGame, npcId: quizRuntimeEntry.npc.id, message: "开始" });
assert(quizGame.flags?.pendingQuiz?.paid, "source quiz charges entry and starts a pending quiz session");
for (const item of quizRuntimeEntry.npc.quiz.entryItems || []) {
  assertEqual(inventoryQty(quizGame, item.id), quizEntryBefore.get(Number(item.id)) - Math.max(1, Number(item.qty || 1)), "source quiz entry item is charged through VM take");
}
const sourceQuestion = quizRuntimeEntry.npc.quiz.questions[0];
const sourceAnswer = (sourceQuestion.options || [])[Number(sourceQuestion.correctIndex || 0)] || String(sourceQuestion.answerNo || 1);
quizGame = await api("/api/game/dialog", { game: quizGame, npcId: quizRuntimeEntry.npc.id, message: sourceAnswer });
assert(quizGame.dialog?.debug?.vmTrace?.some((event) => event.action === "quiz" && event.detail?.reason === "source-quiz-answer"), "source quiz answer records deterministic VM telemetry");
if (!quizGame.flags?.pendingQuiz) {
  assert(quizGame.dialog?.debug?.vmTrace?.some((event) => event.action === "quiz" && event.detail?.reason === "source-quiz-finish"), "source quiz finish records deterministic VM telemetry");
  if (quizRuntimeEntry.npc.quiz.rewardItems?.length) {
    const rewardIds = quizRuntimeEntry.npc.quiz.rewardItems.flatMap((entry) => entry.candidates || []).map((item) => Number(item.id));
    assert(rewardIds.some((id) => inventoryQty(quizGame, id) > 0) || quizGame.dialog.messages.at(-1)?.text.includes("发放失败"), "source quiz reward runs through VM give or reports full inventory");
  }
}
const bundledJankenEntries = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .filter(({ npc }) => npc.janken);
assert(
  bundledJankenEntries.every(({ npc }) => /Janken|npcgen_janken|\/jan_/i.test(`${npc.type || ""} ${npc.template || ""} ${npc.script || ""} ${npc.janken?.source || ""}`)),
  "bundled Janken NPCs must come from source Janken/jan scripts only"
);
const jankenTestMap = WORLD.maps["100"];
const jankenTestNpc = {
  id: "test-source-janken-100",
  name: "源码猜拳测试员",
  type: "Janken",
  template: "npcgen_janken",
  graphic: 100000,
  x: jankenTestMap.spawn[0],
  y: Math.max(0, jankenTestMap.spawn[1] - 1),
  dir: 4,
  script: "file:genout/jan_check_fixture",
  source: "check:npc synthetic source-janken fixture",
  janken: {
    kind: "janken",
    source: "gmsv-data/npc/genout/jan_check_fixture",
    mainMessage: "用一块高级肉参加猜拳。",
    noItemMessage: "没有高级肉不能参加。",
    entryItems: [{ id: 2347, name: "高级肉", qty: 1 }],
    winWarp: { mapId: "100", floor: 100, x: jankenTestMap.spawn[0] + 1, y: jankenTestMap.spawn[1] - 1 },
    loseWarp: { mapId: "100", floor: 100, x: jankenTestMap.spawn[0] - 1, y: jankenTestMap.spawn[1] - 1 }
  }
};
jankenTestMap.npcs.push(jankenTestNpc);
let jankenGame = await api("/api/game/new", { name: "source-janken-test" });
jankenGame.location = {
  mapId: "100",
  x: jankenTestMap.spawn[0],
  y: jankenTestMap.spawn[1],
  dir: 0
};
jankenGame.inventory.push({ id: 2347, name: "高级肉", qty: 1, source: "test source itemset6 2347" });
jankenGame = await api("/api/game/talk", { game: jankenGame, npcId: jankenTestNpc.id });
assert(jankenGame.dialog?.janken?.entryItems?.some((item) => Number(item.id) === 2347), "Janken dialog exposes source entry item metadata");
assert(jankenGame.dialog?.debug?.actions?.includes("janken"), "Janken dialog debug exposes janken action");
assert(jankenGame.dialog?.debug?.vmTrace?.some((event) => event.action === "window" && event.detail?.reason === "source-janken-start"), "Janken prompt records source window VM trace");
const jankenChoices = ["石头", "剪刀", "布", "石头", "剪刀", "布"];
for (const choice of jankenChoices) {
  jankenGame = await api("/api/game/dialog", { game: jankenGame, npcId: jankenTestNpc.id, message: choice });
  if (!jankenGame.flags?.pendingJanken) break;
}
assert(!jankenGame.flags?.pendingJanken, "Janken source runtime eventually resolves win/lose and clears pending state");
assertEqual(inventoryQty(jankenGame, 2347), 0, "Janken entry item is charged exactly once even if the first round ties");
assert(jankenGame.dialog?.debug?.vmTrace?.some((event) => event.action === "take" && event.detail?.reason === "source-janken-entry"), "Janken entry charge runs through NPC VM take");
assert(jankenGame.dialog?.debug?.vmTrace?.some((event) => event.action === "janken" && event.detail?.reason === "source-janken-round"), "Janken round records deterministic VM telemetry");
assert(jankenGame.dialog?.debug?.vmTrace?.some((event) => event.action === "warp" && /^source-janken-/.test(String(event.detail?.reason || ""))), "Janken win/lose warp runs through NPC VM warp");

const itemPoolEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.itemPoolShop);
assert(itemPoolEntry, "world build parses source npcgen_poolitemshop scripts");
let itemPoolGame = await api("/api/game/new", { name: "item-pool-shop-test" });
itemPoolGame.player.stone = 1000;
itemPoolGame.location = {
  mapId: itemPoolEntry.map.id,
  x: itemPoolEntry.npc.x,
  y: Math.max(0, itemPoolEntry.npc.y - 1),
  dir: 4
};
const poolCandidateSource = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).flatMap((npc) => npc.trade?.items || []))
  .find((item) => Number(item.id || 0) > 0);
assert(poolCandidateSource, "world data has at least one source item fixture for item pool test");
itemPoolGame.inventory.push({
  id: poolCandidateSource.id,
  name: poolCandidateSource.name,
  qty: 2,
  image: poolCandidateSource.image,
  source: poolCandidateSource.source || "WORLD trade fixture"
});
const poolCandidate = itemPoolGame.inventory.find((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
assert(poolCandidate, "new game has a source item that can be deposited in item pool");
const itemPoolQtyBefore = inventoryQty(itemPoolGame, poolCandidate.id);
const itemPoolStoneBefore = Number(itemPoolGame.player.stone || 0);
itemPoolGame = await api("/api/game/talk", { game: itemPoolGame, npcId: itemPoolEntry.npc.id });
assert(itemPoolGame.dialog?.itemPoolShop?.cost >= 0, "item pool dialog exposes source cost metadata");
assert(itemPoolGame.dialog?.debug?.actions?.includes("itemPoolShop"), "item pool dialog exposes itemPoolShop action profile");
itemPoolGame = await api("/api/game/pool-item", { game: itemPoolGame, npcId: itemPoolEntry.npc.id, action: "deposit", itemId: poolCandidate.id });
assertEqual(inventoryQty(itemPoolGame, poolCandidate.id), itemPoolQtyBefore - 1, "item pool deposit moves one inventory item out of carried slots");
assertEqual(itemPoolGame.itemPoolState.used, 1, "item pool deposit fills one source-style pool slot");
assert(Number(itemPoolGame.player.stone || 0) <= itemPoolStoneBefore, "item pool deposit charges source-style stone cost when configured");
assert(itemPoolGame.dialog?.debug?.vmTrace?.some((event) => event.action === "itemPoolShop" && event.detail?.action === "deposit"), "item pool deposit records an itemPoolShop VM trace");
itemPoolGame = await api("/api/game/pool-item", { game: itemPoolGame, npcId: itemPoolEntry.npc.id, action: "withdraw", poolIndex: 0 });
assertEqual(inventoryQty(itemPoolGame, poolCandidate.id), itemPoolQtyBefore, "item pool withdraw returns the item to carried inventory");
assertEqual(itemPoolGame.itemPoolState.used, 0, "item pool withdraw clears the source-style pool slot");
assert(itemPoolGame.save.info.includes("POOLITEMCOUNT=0"), "saac-like save info records pool item count");

const raceManEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.raceMan || npc.template === "npc_raceman");
assert(raceManEntry, "world build parses source npc_raceman scripts");
assert(raceManEntry.npc.raceMan, "npc_raceman exposes compact raceMan metadata");
assert(!raceManEntry.npc.itemPoolShop, "npc_raceman is not misclassified as itemPoolShop by itemfull_msg");
assert(raceManEntry.npc.scriptHints?.actions?.includes("raceMan"), "npc_raceman script hints expose raceMan action");
assert(
  (raceManEntry.npc.raceMan.modes || []).length || (raceManEntry.npc.raceMan.history || []).length || Number(raceManEntry.npc.raceMan.gameMode || 0) > 0,
  "npc_raceman parses source mode/history/game metadata"
);
let raceManGame = await api("/api/game/new", { name: "npc-raceman-test" });
raceManGame.location = {
  mapId: raceManEntry.map.id,
  x: Math.max(0, Number(raceManEntry.npc.x || 0) - 1),
  y: Number(raceManEntry.npc.y || 0),
  dir: 2
};
raceManGame = await api("/api/game/talk", { game: raceManGame, npcId: raceManEntry.npc.id });
assert(raceManGame.dialog?.raceMan, "raceMan dialog exposes compact race metadata");
assert(raceManGame.dialog?.debug?.actions?.includes("raceMan"), "raceMan dialog debug exposes raceMan action profile");
assert(!raceManGame.dialog?.debug?.actions?.includes("itemPoolShop"), "raceMan dialog debug no longer exposes itemPoolShop");
assert(
  raceManGame.dialog?.messages?.some((message) => /竞赛|比赛|報名|报名|赛程|来源/.test(String(message.text || ""))),
  "raceMan dialog explains source race metadata"
);
raceManGame = await api("/api/game/dialog", { game: raceManGame, npcId: raceManEntry.npc.id, message: "规则" });
assert(
  raceManGame.dialog?.debug?.vmTrace?.some((event) => event.action === "raceMan" && event.status === "ok"),
  "raceMan dialog records deterministic raceMan VM trace"
);

const newNpcManEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.newNpcMan);
assert(newNpcManEntry, "world build parses source npc_newnpcman CHECK_MSG scripts");
assert(newNpcManEntry.npc.scriptHints?.actions?.includes("appearance"), "npc_newnpcman script hints expose appearance action");
assert(String(newNpcManEntry.npc.newNpcMan?.messages?.check || "").includes("造型"), "npc_newnpcman preserves source CHECK_MSG");
let newNpcManGame = await api("/api/game/new", { name: "npc-newnpcman-checkmsg-test" });
newNpcManGame.location = {
  mapId: newNpcManEntry.map.id,
  x: Math.max(0, Number(newNpcManEntry.npc.x || 0) - 1),
  y: Number(newNpcManEntry.npc.y || 0),
  dir: 2
};
newNpcManGame.player.CHAR_FACEIMAGENUMBER = 30025;
newNpcManGame.player.CHAR_BASEIMAGENUMBER = 101578;
newNpcManGame.player.CHAR_BASEBASEIMAGENUMBER = 101578;
newNpcManGame.effects ||= {};
newNpcManGame.effects.metamo = { imageNo: 101578, originalImageNo: 100000, until: Date.now() + 60000 };
newNpcManGame = await api("/api/game/talk", { game: newNpcManGame, npcId: newNpcManEntry.npc.id });
assert(newNpcManGame.dialog?.newNpcMan?.appearanceRestore, "npc_newnpcman dialog exposes appearance metadata");
assert(newNpcManGame.dialog?.debug?.actions?.includes("appearance"), "npc_newnpcman dialog debug exposes appearance action profile");
assert(newNpcManGame.dialog?.messages?.some((message) => String(message.text || "").includes("确认造型")), "npc_newnpcman prompt keeps source check flow visible");
newNpcManGame = await api("/api/game/dialog", { game: newNpcManGame, npcId: newNpcManEntry.npc.id, message: "确认造型" });
assertEqual(Number(newNpcManGame.player.CHAR_BASEIMAGENUMBER || 0), 100005, "npc_newnpcman maps CHAR_FACEIMAGENUMBER through source checkPc table");
assertEqual(Number(newNpcManGame.player.CHAR_BASEBASEIMAGENUMBER || 0), 100005, "npc_newnpcman confirms CHAR_BASEBASEIMAGENUMBER after appearance restore");
assert(!newNpcManGame.effects?.metamo, "npc_newnpcman clears temporary metamo state deterministically");
assert(newNpcManGame.dialog?.debug?.vmTrace?.some((event) => event.action === "appearance" && event.status === "ok"), "npc_newnpcman CHECK_MSG runs through appearance VM action");

const routeServiceEntry = Object.values(WORLD.maps)
  .flatMap((map) => (map.npcs || []).map((npc) => ({ map, npc })))
  .find(({ npc }) => {
    const route = npc.routeService?.routes?.[0];
    return route?.target && WORLD.maps[String(route.target.mapId)] && Number(npc.routeService.needStone || 0) > 0;
  });
assert(routeServiceEntry, "world build parses source bus/airplane routeto service scripts");
let routeServiceGame = await api("/api/game/new", { name: "route-service-test" });
const routeServiceCost = Number(routeServiceEntry.npc.routeService.needStone || 0);
routeServiceGame.player.stone = routeServiceCost + 100;
routeServiceGame.location = {
  mapId: routeServiceEntry.map.id,
  x: routeServiceEntry.npc.x,
  y: Math.max(0, routeServiceEntry.npc.y - 1),
  dir: 4
};
routeServiceGame = await api("/api/game/talk", { game: routeServiceGame, npcId: routeServiceEntry.npc.id });
assert(routeServiceGame.dialog?.routeService?.routes?.length, "route service dialog exposes compact route metadata");
routeServiceGame = await api("/api/game/dialog", { game: routeServiceGame, npcId: routeServiceEntry.npc.id, message: "路线" });
assert(routeServiceGame.dialog?.messages?.some((message) => String(message.text || "").includes("路线")), "route service can explain source routes");
const routeServiceTarget = routeServiceEntry.npc.routeService.routes[0].target;
routeServiceGame = await api("/api/game/dialog", { game: routeServiceGame, npcId: routeServiceEntry.npc.id, message: "搭乘" });
assertEqual(routeServiceGame.location.mapId, String(routeServiceTarget.mapId), "route service moves player to parsed source route target map");
assertEqual(routeServiceGame.location.x, routeServiceTarget.x, "route service moves player to parsed source route target x");
assertEqual(routeServiceGame.location.y, routeServiceTarget.y, "route service moves player to parsed source route target y");
assertEqual(routeServiceGame.player.stone, 100, "route service charges source needstone cost");
assert(routeServiceGame.dialog?.debug?.vmTrace?.some((event) => event.action === "routeService" && event.status === "ok"), "route service records a deterministic routeService VM trace");

const assistNpcFixture = await reachableAssistNpcFixture();
let assistRouteGame = await api("/api/game/new", { name: "assist-route-paid-jump-test" });
assistRouteGame.player.stone = 999999;
assistRouteGame.location = assistNpcFixture.from;
const blockedTileRoute = await api("/api/game/route", {
  game: assistRouteGame,
  targetX: assistNpcFixture.npc.x,
  targetY: assistNpcFixture.npc.y
});
assertEqual(blockedTileRoute.reason, "target-blocked-nearby", "map click route approaches blocked NPC tiles instead of failing outright");
assert(blockedTileRoute.standTarget, "blocked map click route exposes standTarget for client completion checks");
assert(blockedTileRoute.face, "blocked map click route exposes facing data for source-style NPC approach");
const assistNpcRoute = await api("/api/game/route-npc", { game: assistRouteGame, npcId: assistNpcFixture.npc.id });
assert(!assistNpcRoute.blocked && assistNpcRoute.route.length, "assist auto-go can compute a route to an NPC interaction range");
const assistNpcJumpCost = paidJumpCostForTest(distance(
  assistNpcFixture.from.x,
  assistNpcFixture.from.y,
  assistNpcRoute.target.x,
  assistNpcRoute.target.y
));
const assistNpcStoneBefore = Number(assistRouteGame.player.stone || 0);
assistRouteGame = await api("/api/game/paid-jump", { game: assistRouteGame, kind: "npc", id: assistNpcFixture.npc.id });
assertEqual(assistRouteGame.location.mapId, assistNpcFixture.map.id, "paid jump to NPC stays on the current source map");
assert(distance(assistRouteGame.location.x, assistRouteGame.location.y, assistNpcFixture.npc.x, assistNpcFixture.npc.y) <= 2, "paid jump to NPC lands within source interaction range");
assertEqual(assistNpcStoneBefore - Number(assistRouteGame.player.stone || 0), assistNpcJumpCost, "paid jump to NPC charges deterministic tiered distance cost");
assertEqual(assistRouteGame.paidJump?.cost, assistNpcJumpCost, "paid jump to NPC records deterministic cost telemetry");

const assistExitFixture = await reachableAssistExitFixture();
let assistExitGame = await api("/api/game/new", { name: "assist-exit-paid-jump-test" });
assistExitGame.location = assistExitFixture.from;
const assistExitRoute = await api("/api/game/route-exit", { game: assistExitGame, exitId: assistExitFixture.exit.id });
assert(!assistExitRoute.blocked && assistExitRoute.route.length, "assist auto-go can compute a route to an exit tile");
const assistExitJumpCost = paidJumpCostForTest(distance(
  assistExitFixture.from.x,
  assistExitFixture.from.y,
  assistExitRoute.target.x,
  assistExitRoute.target.y
));
assistExitGame.player.stone = assistExitJumpCost + 5000;
const assistExitStoneBefore = Number(assistExitGame.player.stone || 0);
assistExitGame = await api("/api/game/paid-jump", { game: assistExitGame, kind: "exit", id: assistExitFixture.exit.id });
assertEqual(assistExitGame.location.mapId, String(assistExitFixture.exit.to), "paid jump to exit enters the target map through source mapwarp");
assertEqual(assistExitStoneBefore - Number(assistExitGame.player.stone || 0), assistExitJumpCost, "paid jump to exit charges deterministic tiered distance cost");
assertEqual(assistExitGame.paidJump?.cost, assistExitJumpCost, "paid jump to exit records deterministic cost telemetry");
assertEqual(assistExitGame.lastWarp?.kind, "mapwarp", "paid jump to exit still uses the normal mapwarp transition");

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
let itemEffectGame = await api("/api/game/new", { name: "item-effect-status-test" });
itemEffectGame.pets[0].BattleStatuses = {
  poison: { key: "poison", label: "中毒", turns: 3 },
  confusion: { key: "confusion", label: "混乱", turns: 3 }
};
itemEffectGame.pets[0].BattleStatus = { key: "poison", label: "中毒", turns: 3 };
itemEffectGame.inventory.push({ id: 5010, name: "治疗中毒的肉", qty: 1, description: "毒状态回复", option: "毒", functionName: "ITEM_useStatusRecovery" });
itemEffectGame = await api("/api/game/use-item", { game: itemEffectGame, itemId: 5010 });
assert(!itemEffectGame.pets[0].BattleStatuses?.poison, "status recovery item removes matching poison status");
assert(itemEffectGame.pets[0].BattleStatuses?.confusion, "status recovery item leaves unrelated status untouched");
assertEqual(inventoryQty(itemEffectGame, 5010), 0, "status recovery item consumes one item");
let reviveItemGame = await api("/api/game/new", { name: "item-effect-revive-test" });
reviveItemGame.pets[0].WorkMaxHp = 120;
reviveItemGame.pets[0].Hp = 0;
reviveItemGame.inventory.push({ id: 5011, name: "复活药(100)", qty: 1, description: "气绝回复成耐力100", option: "100", functionName: "ITEM_useRessurect", target: 101 });
reviveItemGame = await api("/api/game/use-item", { game: reviveItemGame, itemId: 5011 });
assertEqual(reviveItemGame.pets[0].Hp, 100, "resurrection item revives active pet with source item amount");
assertEqual(inventoryQty(reviveItemGame, 5011), 0, "resurrection item consumes one item");
let charmItemGame = await api("/api/game/new", { name: "item-effect-charm-test" });
charmItemGame.player.charm = 60;
charmItemGame.inventory.push({ id: 5012, name: "魅力苹果", qty: 1, description: "吃了以後会很有魅力 魅+5", option: "魅5", functionName: "ITEM_useRecovery" });
charmItemGame = await api("/api/game/use-item", { game: charmItemGame, itemId: 5012 });
assertEqual(charmItemGame.player.charm, 65, "charm item updates player charm");
let loyalItemGame = await api("/api/game/new", { name: "item-effect-loyal-test" });
loyalItemGame.pets[0].Loyal = 40;
loyalItemGame.inventory.push({ id: 5013, name: "安抚之素", qty: 1, description: "宠物的忠诚度+30上升", option: "忠30", functionName: "ITEM_useRecovery" });
loyalItemGame = await api("/api/game/use-item", { game: loyalItemGame, itemId: 5013 });
assertEqual(loyalItemGame.pets[0].Loyal, 70, "loyalty item updates active pet loyalty");
let questItemUseGame = await api("/api/game/new", { name: "item-effect-quest-refusal-test" });
questItemUseGame.inventory.push({ id: 5014, name: "检查石", qty: 1, description: "第5检查点通过" });
await expectApiError(
  "/api/game/use-item",
  { game: questItemUseGame, itemId: 5014 },
  "还没有可模拟",
  "quest marker item is not consumed as a fake usable item"
);
let noEnemyItemGame = await api("/api/game/new", { name: "item-effect-noenemy-test" });
noEnemyItemGame.inventory.push({ id: 5015, name: "除  剂", qty: 1, description: "使用後可暂时驱散敌人", functionName: "ITEM_useNoenemy" });
noEnemyItemGame = await api("/api/game/use-item", { game: noEnemyItemGame, itemId: 5015 });
assert(Number(noEnemyItemGame.effects?.noEncounterUntil || 0) > Date.now(), "ITEM_useNoenemy applies a timed no-encounter effect");
assertEqual(inventoryQty(noEnemyItemGame, 5015), 0, "ITEM_useNoenemy consumes one item");
let expBonusItemGame = await api("/api/game/new", { name: "item-effect-addexp-test" });
expBonusItemGame.inventory.push({ id: 5016, name: "聪明的豆子3", qty: 1, description: "使用後获得经验值上升150% 使用时间1小时", option: "增150分60", functionName: "ITEM_Addexp" });
expBonusItemGame = await api("/api/game/use-item", { game: expBonusItemGame, itemId: 5016 });
assertEqual(expBonusItemGame.effects?.expBonus?.power, 150, "ITEM_Addexp records source exp bonus power");
assertEqual(expBonusItemGame.effects?.expBonus?.multiplier, 4, "ITEM_Addexp uses source battle.c 1 + power*2/100 multiplier");
assertEqual(inventoryQty(expBonusItemGame, 5016), 0, "ITEM_Addexp consumes one item");
let chikulaItemGame = await api("/api/game/new", { name: "item-effect-chikula-test" });
chikulaItemGame.player.hp = 20;
chikulaItemGame.player.maxHp = 100;
chikulaItemGame.inventory.push({ id: 5017, name: "奇克拉耐久力之石", qty: 1, description: "非战斗状态自动回复耐久力", option: "hp:50", functionName: "ITEM_ChikulaStone" });
chikulaItemGame = await api("/api/game/use-item", { game: chikulaItemGame, itemId: 5017 });
assertEqual(chikulaItemGame.effects?.chikula?.amount, 50, "ITEM_ChikulaStone stores the auto-recovery amount");
assertEqual(chikulaItemGame.player.hp, 70, "ITEM_ChikulaStone immediately applies one recovery tick for feedback");
assertEqual(inventoryQty(chikulaItemGame, 5017), 0, "ITEM_ChikulaStone consumes one item");
let petMetamoItemGame = await api("/api/game/new", { name: "item-effect-pet-metamo-test" });
const petMetamoImage = Number(petMetamoItemGame.pets[0].ImgNo || 0);
petMetamoItemGame.inventory.push({ id: 19692, name: "变身镜 Lv3", qty: 1, description: "能变身成自己的宠物叁分钟", option: "180", functionName: "ITEM_metamo" });
petMetamoItemGame = await api("/api/game/use-item", { game: petMetamoItemGame, itemId: 19692 });
assertEqual(petMetamoItemGame.effects?.metamo?.imageNo, petMetamoImage, "ITEM_metamo uses the active pet original image as the temporary player model");
assert(Number(petMetamoItemGame.effects?.metamo?.until || 0) > Date.now(), "ITEM_metamo records a timed source metamo state");
assertEqual(Number(petMetamoItemGame.player.CHAR_BASEIMAGENUMBER || 0), petMetamoImage, "ITEM_metamo updates CHAR_BASEIMAGENUMBER");
assertEqual(inventoryQty(petMetamoItemGame, 19692), 0, "ITEM_metamo consumes one item");
let fixedMetamoItemGame = await api("/api/game/new", { name: "item-effect-fixed-metamo-test" });
fixedMetamoItemGame.inventory.push({ id: 20830, name: "潜水药水", qty: 1, description: "可变身为石器潜水员1小时", option: "101530|1|石器潜水员", functionName: "ITEM_MetamoTime" });
fixedMetamoItemGame = await api("/api/game/use-item", { game: fixedMetamoItemGame, itemId: 20830 });
assertEqual(fixedMetamoItemGame.effects?.metamo?.imageNo, 101530, "ITEM_MetamoTime applies the source fixed image number");
assertEqual(fixedMetamoItemGame.effects?.metamo?.formName, "石器潜水员", "ITEM_MetamoTime preserves the source metamo form name");
assert(Number(fixedMetamoItemGame.effects?.metamo?.seconds || 0) >= 3600, "ITEM_MetamoTime reads readable hour duration");
assertEqual(inventoryQty(fixedMetamoItemGame, 20830), 0, "ITEM_MetamoTime consumes one item");
let safeGemGame = await api("/api/game/new", { name: "item-effect-safe-gem-test" });
safeGemGame.inventory.push({ id: 5018, name: "恶魔宝石LV1", qty: 1, description: "使用後可原地遇敌 使用次数3次", functionName: "ITEM_useDeathcounter", damageBreak: 3, maxUses: 3 });
await expectApiError(
  "/api/game/use-item",
  { game: safeGemGame, itemId: 5018 },
  "不能触发原地遇敌",
  "ITEM_useDeathcounter refuses to fire inside safe village maps"
);
assertEqual(inventoryQty(safeGemGame, 5018), 1, "refused ITEM_useDeathcounter does not consume the item");
const encounterMap = Object.values(WORLD.maps).find((map) => (
  map.id === "100"
  && (map.encounterAreas || []).some((area) => (area.groups || []).some((group) => group.enemies?.length && !group.appearByItemId && !group.notAppearByItemId))
));
if (!encounterMap) throw new Error("missing source encounter map fixture");
const encounterArea = encounterMap.encounterAreas.find((area) => (area.groups || []).some((group) => group.enemies?.length && !group.appearByItemId && !group.notAppearByItemId));
const encounterAreaMin = Math.max(0, Math.trunc(Number(encounterArea?.encounterProbMin || 1)));
const encounterAreaMax = Math.max(encounterAreaMin, Math.trunc(Number(encounterArea?.encounterProbMax || encounterAreaMin)));
let walkEncounterCepGame = await api("/api/game/new", { name: "walk-encounter-cep-test" });
walkEncounterCepGame.location = {
  mapId: encounterMap.id,
  x: Math.trunc((Number(encounterArea.bounds[0]) + Number(encounterArea.bounds[2])) / 2),
  y: Math.trunc((Number(encounterArea.bounds[1]) + Number(encounterArea.bounds[3])) / 2),
  dir: 2
};
walkEncounterCepGame.player.dir = 2;
walkEncounterCepGame.walk = { steps: 0, encounterSteps: 0, encounterCep: 0 };
const originalRandomForWalkEncounter = Math.random;
Math.random = () => 0.99;
try {
  walkEncounterCepGame = await walkOneReachableStep(walkEncounterCepGame);
  assertEqual(Number(walkEncounterCepGame.walk?.encounterSteps || 0), 1, "walk encounter miss increments encounter step counter");
  assertEqual(Number(walkEncounterCepGame.walk?.encounterCep || 0), Math.min(120, encounterAreaMin + 1), "walk encounter miss increments source CEP by one");
  assertEqual(walkEncounterCepGame.encounter, null, "walk encounter miss does not start battle");
  walkEncounterCepGame.walk.encounterCep = encounterAreaMax;
  Math.random = () => 0;
  walkEncounterCepGame = await walkOneReachableStep(walkEncounterCepGame);
  assert(walkEncounterCepGame.encounter, "walk encounter hit starts battle");
  assertEqual(Number(walkEncounterCepGame.walk?.encounterSteps || 0), 0, "walk encounter hit resets step counter");
  assertEqual(Number(walkEncounterCepGame.walk?.encounterCep || 0), encounterAreaMin, "walk encounter hit resets CEP to source min");
} finally {
  Math.random = originalRandomForWalkEncounter;
}
let deathCounterGame = await api("/api/game/new", { name: "item-effect-deathcounter-test" });
deathCounterGame.location = {
  mapId: encounterMap.id,
  x: Math.trunc((Number(encounterArea.bounds[0]) + Number(encounterArea.bounds[2])) / 2),
  y: Math.trunc((Number(encounterArea.bounds[1]) + Number(encounterArea.bounds[3])) / 2),
  dir: 0
};
deathCounterGame.inventory.push({ id: 5019, name: "恶魔宝石LV1", qty: 1, description: "使用後可原地遇敌 使用次数3次", functionName: "ITEM_useDeathcounter", damageBreak: 3, maxUses: 3 });
deathCounterGame = await api("/api/game/use-item", { game: deathCounterGame, itemId: 5019 });
assert(deathCounterGame.encounter, "ITEM_useDeathcounter starts an immediate source encounter");
assertEqual(inventoryQty(deathCounterGame, 5019), 1, "ITEM_useDeathcounter keeps the stack while charges remain");
assertEqual(Number(deathCounterGame.inventory.find((item) => Number(item.id) === 5019)?.usesRemaining), 2, "ITEM_useDeathcounter decrements ITEM_DAMAGEBREAK-style uses");
let battleLootGame = await api("/api/game/new", { name: "source-battle-loot-test" });
const battleLootFixture = sourceLootEncounterFixture();
battleLootGame.location = {
  mapId: battleLootFixture.map.id,
  x: Math.trunc((Number(battleLootFixture.area.bounds[0]) + Number(battleLootFixture.area.bounds[2])) / 2),
  y: Math.trunc((Number(battleLootFixture.area.bounds[1]) + Number(battleLootFixture.area.bounds[3])) / 2),
  dir: 0
};
const lootFixtureLevel = Math.max(
  1,
  Math.trunc((Number(battleLootFixture.enemy.lvMin || 1) + Number(battleLootFixture.enemy.lvMax || battleLootFixture.enemy.lvMin || 1)) / 2)
);
battleLootGame.player.level = lootFixtureLevel;
battleLootGame.pets[0].Lv = lootFixtureLevel;
const originalRandomForLoot = Math.random;
Math.random = () => 0;
try {
  battleLootGame = await api("/api/game/encounter", { game: battleLootGame });
  assert(battleLootGame.encounter?.EnemyDropTable?.length, "source enemy1 drop table is exposed on spawned enemies");
  assert(battleLootGame.encounter?.EnemyDropItems?.length, "source enemy1 drop probabilities roll item inventory onto spawned enemies");
  const expectedLootId = battleLootGame.encounter.EnemyDropItems[0].id;
  const expectedDropEntry = battleLootGame.encounter.EnemyDropTable.find((item) => Number(item.id) === Number(expectedLootId));
  assert(expectedDropEntry, "rolled source loot keeps a matching ITEM slot in EnemyDropTable");
  assert(Number(expectedDropEntry.probability || 0) > 0, "source EnemyDropTable keeps ITEMPROB probability metadata");
  assertEqual(Number(expectedDropEntry.rollBase || 0), 1000, "source EnemyDropTable keeps the enemy1 roll base");
  assert(String(expectedDropEntry.source || "").includes("enemy1.txt"), "source EnemyDropTable keeps enemy1.txt provenance");
  assert(
    battleLootGame.encounter.EnemyDropItems.every((rolled) => (
      battleLootGame.encounter.EnemyDropTable.some((entry) => (
        Number(entry.id) === Number(rolled.id)
        && Number(entry.slot) === Number(rolled.slot)
        && Number(entry.probability) === Number(rolled.probability)
        && Number(entry.rollBase) === Number(rolled.rollBase)
      ))
    )),
    "rolled source loot stays tied to its enemy1 ITEM/ITEMPROB metadata"
  );
  battleLootGame.encounter.Hp = 1;
  battleLootGame.encounter.WorkFixDex = 0;
  battleLootGame.encounter.WorkQuick = 0;
  battleLootGame.pets[0].WorkFixStr = 999;
  battleLootGame.pets[0].WorkAttackPower = 999;
  battleLootGame.pets[0].WorkFixDex = 999;
  battleLootGame.pets[0].WorkQuick = 999;
  battleLootGame = await api("/api/game/battle", { game: battleLootGame, action: "攻击" });
  assertEqual(battleLootGame.battleOutcome.result, "victory", "source battle loot test wins the encounter");
  assert(battleLootGame.battleOutcome.lootItems.some((item) => Number(item.id) === expectedLootId), "victory outcome reports source enemy1 loot");
  assert(battleLootGame.battleOutcome.potentialLootItems.some((item) => Number(item.id) === expectedLootId), "victory outcome preserves source enemy1 potential drop table for debug and task checks");
  assert(inventoryQty(battleLootGame, expectedLootId) > 0, "source enemy1 loot is added to inventory after victory");
  assert(battleLootGame.lastBattleOutcome.lootItems.some((item) => Number(item.id) === expectedLootId), "last battle telemetry persists source loot");
  assert(battleLootGame.lastBattleOutcome.potentialLootItems.some((item) => Number(item.id) === expectedLootId && Number(item.probability || 0) > 0), "last battle telemetry persists source drop probability metadata");
  assert(battleLootGame.log.some((line) => line.includes("掉落")), "battle log announces dropped items");
  const lootWorkspaceRsp = await api("/api/ai/workspace", { game: battleLootGame, prompt: "刚才怪会掉什么" });
  assert(
    lootWorkspaceRsp.workspace.current.lastBattle.potentialLootText.includes(expectedDropEntry.name)
      && lootWorkspaceRsp.workspace.current.lastBattle.potentialLootText.includes("enemy1.txt"),
    "AI workspace exposes last battle source ITEM/ITEMPROB loot candidates"
  );
  const lootGuideRsp = await api("/api/ai/guide", { game: battleLootGame, prompt: "刚才怪会掉什么，为什么没掉" });
  assert(
    lootGuideRsp.text.includes(expectedDropEntry.name)
      && lootGuideRsp.text.includes("候选掉落")
      && lootGuideRsp.text.includes("实际获得"),
    "local guide answers loot questions with source candidate and actual drop text"
  );
} finally {
  Math.random = originalRandomForLoot;
}
let featherGame = await api("/api/game/new", { name: "item-effect-feather-test" });
featherGame.inventory.push({ id: 20912, name: "精灵的羽毛", qty: 1, description: "可瞬间飞行至伊甸大陆", option: "0 7000 106 49", functionName: "ITEM_useWarp" });
featherGame = await api("/api/game/use-item", { game: featherGame, itemId: 20912 });
assertEqual(featherGame.location.mapId, "7000", "ITEM_useWarp can fly to the source Eden floor after world profile includes it");
assertEqual(inventoryQty(featherGame, 20912), 0, "ITEM_useWarp consumes one feather");
let memoryFeatherGame = await api("/api/game/new", { name: "item-effect-memory-feather-test" });
memoryFeatherGame.inventory.push({ id: 1345, name: "记忆的羽毛", qty: 1, description: "可单人来回飞行至萨姆吉尔村", option: "0 1000 92 99", functionName: "ITEM_useWarpForNum" });
memoryFeatherGame = await api("/api/game/use-item", { game: memoryFeatherGame, itemId: 1345 });
assertEqual(memoryFeatherGame.location.mapId, "1000", "ITEM_useWarpForNum flies to its source map");
assertEqual(inventoryQty(memoryFeatherGame, 1345), 1, "ITEM_useWarpForNum keeps the item while a charge remains");
assertEqual(Number(memoryFeatherGame.inventory.find((item) => Number(item.id) === 1345)?.usesRemaining), 1, "ITEM_useWarpForNum decrements source-style remaining uses");
memoryFeatherGame = await api("/api/game/use-item", { game: memoryFeatherGame, itemId: 1345 });
assertEqual(inventoryQty(memoryFeatherGame, 1345), 0, "ITEM_useWarpForNum consumes the item on the final charge");
let rawFeatherGame = await api("/api/game/new", { name: "item-effect-raw-feather-test" });
rawFeatherGame.inventory.push({ id: 20912, name: "精灵的羽毛", qty: 1 });
rawFeatherGame = await api("/api/game/sync", { game: rawFeatherGame });
assertEqual(rawFeatherGame.inventory.find((item) => Number(item.id) === 20912)?.functionName, "ITEM_useWarp", "sync hydrates raw saved feather so client item buttons can enable use");
assert(String(rawFeatherGame.inventory.find((item) => Number(item.id) === 20912)?.option || "").includes("7000"), "sync exposes raw saved feather warp target from source itemset6");
rawFeatherGame = await api("/api/game/use-item", { game: rawFeatherGame, itemId: 20912 });
assertEqual(rawFeatherGame.location.mapId, "7000", "raw saved feather id hydrates ITEM_useWarp from itemset6 before use");
assertEqual(inventoryQty(rawFeatherGame, 20912), 0, "raw saved feather consumes after hydrated warp use");
let rawMemoryFeatherGame = await api("/api/game/new", { name: "item-effect-raw-memory-feather-test" });
rawMemoryFeatherGame.inventory.push({ id: 1345, name: "记忆的羽毛", qty: 1 });
rawMemoryFeatherGame = await api("/api/game/sync", { game: rawMemoryFeatherGame });
assertEqual(rawMemoryFeatherGame.inventory.find((item) => Number(item.id) === 1345)?.functionName, "ITEM_useWarpForNum", "sync hydrates raw saved memory feather use function for client item windows");
assert(Number(rawMemoryFeatherGame.inventory.find((item) => Number(item.id) === 1345)?.usesRemaining || 0) > 0, "sync exposes raw saved memory feather remaining source uses");
rawMemoryFeatherGame = await api("/api/game/use-item", { game: rawMemoryFeatherGame, itemId: 1345 });
assertEqual(rawMemoryFeatherGame.location.mapId, "1000", "raw saved memory feather hydrates ITEM_useWarpForNum target from itemset6");
assertEqual(Number(rawMemoryFeatherGame.inventory.find((item) => Number(item.id) === 1345)?.usesRemaining), 1, "raw saved memory feather hydrates and decrements source damageBreak uses");
let rawDeathCounterGame = await api("/api/game/new", { name: "item-effect-raw-deathcounter-test" });
rawDeathCounterGame.location = {
  mapId: encounterMap.id,
  x: Math.trunc((Number(encounterArea.bounds[0]) + Number(encounterArea.bounds[2])) / 2),
  y: Math.trunc((Number(encounterArea.bounds[1]) + Number(encounterArea.bounds[3])) / 2),
  dir: 0
};
rawDeathCounterGame.inventory.push({ id: 20129, name: "恶魔宝石LV1", qty: 1 });
rawDeathCounterGame = await api("/api/game/sync", { game: rawDeathCounterGame });
assertEqual(rawDeathCounterGame.inventory.find((item) => Number(item.id) === 20129)?.functionName, "ITEM_useDeathcounter", "sync hydrates raw saved demon gem use function for main inventory use");
assert(Number(rawDeathCounterGame.inventory.find((item) => Number(item.id) === 20129)?.usesRemaining || 0) > 0, "sync exposes raw saved demon gem source charge count before use");
rawDeathCounterGame = await api("/api/game/use-item", { game: rawDeathCounterGame, itemId: 20129 });
assert(rawDeathCounterGame.encounter, "raw saved demon gem id hydrates ITEM_useDeathcounter from itemset6 before use");
assertEqual(Number(rawDeathCounterGame.inventory.find((item) => Number(item.id) === 20129)?.usesRemaining), 2, "raw saved demon gem hydrates and decrements source damageBreak uses");
let guideRawFeatherGame = await api("/api/game/new", { name: "ai-guide-raw-feather-use-test" });
guideRawFeatherGame.inventory.push({ id: 20912, name: "精灵的羽毛", qty: 1 });
const guideRawFeatherRsp = await api("/api/ai/guide", { game: guideRawFeatherGame, prompt: "使用精灵的羽毛" });
assertEqual(guideRawFeatherRsp.action.type, "item-use", "AI guide hydrates raw saved source items before preview/use");
assertEqual(guideRawFeatherRsp.game.location.mapId, "7000", "AI guide raw feather use warps to source itemset6 target");
let guideRawGemGame = await api("/api/game/new", { name: "ai-guide-raw-gem-use-test" });
guideRawGemGame.location = {
  mapId: encounterMap.id,
  x: Math.trunc((Number(encounterArea.bounds[0]) + Number(encounterArea.bounds[2])) / 2),
  y: Math.trunc((Number(encounterArea.bounds[1]) + Number(encounterArea.bounds[3])) / 2),
  dir: 0
};
guideRawGemGame.inventory.push({ id: 20129, name: "恶魔宝石LV1", qty: 1 });
const guideRawGemRsp = await api("/api/ai/guide", { game: guideRawGemGame, prompt: "使用恶魔宝石" });
assertEqual(guideRawGemRsp.action.type, "item-use", "AI guide can use a raw saved demon gem after itemset6 hydration");
assert(guideRawGemRsp.game.encounter, "AI guide raw demon gem use triggers the source encounter path");
let goldVoucherGame = await api("/api/game/new", { name: "item-effect-gold-voucher-test" });
goldVoucherGame.player.stone = 100;
goldVoucherGame.inventory.push({ id: 5030, name: "十万石币券", qty: 1, option: "100000", functionName: "ITEM_Gold" });
goldVoucherGame = await api("/api/game/use-item", { game: goldVoucherGame, itemId: 5030 });
assertEqual(goldVoucherGame.player.stone, 100100, "ITEM_Gold adds source stone amount to player currency");
assertEqual(inventoryQty(goldVoucherGame, 5030), 0, "ITEM_Gold consumes one voucher item");
let skillCanGame = await api("/api/game/new", { name: "item-effect-skill-can-test" });
skillCanGame.pets[0].PetSkillIds = [0, 0, 0, 0, 0, 0, 0];
skillCanGame.pets[0].PetSkills = [null, null, null, null, null, null, null];
skillCanGame.inventory.push({ id: 5031, name: "宠技罐头", qty: 1, option: "609", functionName: "ITEM_useSkillCanned" });
skillCanGame = await api("/api/game/use-item", { game: skillCanGame, itemId: 5031 });
assertEqual(Number(skillCanGame.pets[0].PetSkillIds[0]), 609, "ITEM_useSkillCanned teaches the option skill id to the active pet");
assert(skillCanGame.pets[0].PetSkills[0]?.Name, "ITEM_useSkillCanned stores compact petskill2 metadata");
assertEqual(inventoryQty(skillCanGame, 5031), 0, "ITEM_useSkillCanned consumes one canned skill item");
let captureUpGame = await api("/api/game/new", { name: "item-effect-capture-up-test" });
captureUpGame.encounter = { Name: "乌力", Lv: 5, Hp: 80, WorkMaxHp: 80, CaptureRate: 35, WorkAttackPower: 1, Attack: 1, WorkFixStr: 1, Str: 1, WorkQuick: 1, Quick: 1 };
captureUpGame.pets[0].WorkMaxHp = Math.max(200, Number(captureUpGame.pets[0].WorkMaxHp || captureUpGame.pets[0].Hp || 1));
captureUpGame.pets[0].Hp = captureUpGame.pets[0].WorkMaxHp;
captureUpGame.inventory.push({ id: 5032, name: "野蛮团子", qty: 1, option: "30", functionName: "ITEM_useCaptureUp" });
captureUpGame = await api("/api/game/battle", { game: captureUpGame, action: "item:5032" });
const captureUpEffect = captureUpGame.battleOutcome?.itemUse?.effects?.find((effect) => effect.kind === "captureUp");
assertEqual(captureUpEffect?.before, 35, "ITEM_useCaptureUp reads current source capture rate");
assertEqual(captureUpEffect?.after, 65, "ITEM_useCaptureUp raises capture rate by item option");
assertEqual(inventoryQty(captureUpGame, 5032), 0, "ITEM_useCaptureUp consumes one battle item");
let statusChangeItemGame = await api("/api/game/new", { name: "item-effect-status-change-test" });
statusChangeItemGame.encounter = { Name: "乌力", Lv: 5, Hp: 80, WorkMaxHp: 80, CaptureRate: 35, WorkAttackPower: 30, Attack: 30, WorkFixStr: 30, Str: 30, WorkQuick: 1, Quick: 1 };
statusChangeItemGame.pets[0].WorkMaxHp = Math.max(200, Number(statusChangeItemGame.pets[0].WorkMaxHp || statusChangeItemGame.pets[0].Hp || 1));
statusChangeItemGame.pets[0].Hp = statusChangeItemGame.pets[0].WorkMaxHp;
const hpBeforeStatusItem = Number(statusChangeItemGame.pets[0].Hp || 0);
statusChangeItemGame.inventory.push({ id: 5033, name: "睡眠药", qty: 1, option: "眠 turn 3 成 300", functionName: "ITEM_useStatusChange" });
statusChangeItemGame = await api("/api/game/battle", { game: statusChangeItemGame, action: "item:5033" });
assert(statusChangeItemGame.encounter?.BattleStatuses?.sleep, "ITEM_useStatusChange applies battle status to selected enemy");
assertEqual(Number(statusChangeItemGame.pets[0].Hp || 0), hpBeforeStatusItem, "blocking ITEM_useStatusChange prevents the immediate enemy counterattack");
assertEqual(inventoryQty(statusChangeItemGame, 5033), 0, "ITEM_useStatusChange consumes one battle item");
let equipGame = await api("/api/game/new", { name: "item-equip-test" });
equipGame.inventory.push({ id: 5020, name: "石斧", qty: 1, description: "武器 攻击力+5", functionName: "ITEM_suitEquip" });
equipGame = await api("/api/game/equip-item", { game: equipGame, itemId: 5020 });
assertEqual(inventoryQty(equipGame, 5020), 0, "equip item removes the equipped copy from inventory");
assertEqual(equipGame.character.equipment["武器"].name, "石斧", "equip item records the weapon slot on character");
assertEqual(equipGame.player.equipment["武器"].id, 5020, "equip item mirrors equipment on player runtime");
equipGame.inventory.push({ id: 5021, name: "骨刀", qty: 1, description: "武器 攻击力+8", functionName: "ITEM_suitEquip" });
equipGame = await api("/api/game/equip-item", { game: equipGame, itemId: 5021 });
assertEqual(equipGame.character.equipment["武器"].name, "骨刀", "equip item replaces an occupied slot");
assertEqual(inventoryQty(equipGame, 5020), 1, "replaced equipment returns to inventory");
equipGame = await api("/api/game/unequip-item", { game: equipGame, slot: "武器" });
assertEqual(equipGame.character.equipment["武器"], undefined, "unequip clears the equipment slot");
assertEqual(inventoryQty(equipGame, 5021), 1, "unequip returns the item to inventory");
let rawEquipGame = await api("/api/game/new", { name: "item-raw-source-equip-test" });
const rawAttackBefore = Number(rawEquipGame.player?.WorkAttackPower || rawEquipGame.player?.WorkFixStr || 0);
rawEquipGame.inventory.push({ id: 1338, qty: 1 });
rawEquipGame = await api("/api/game/equip-item", { game: rawEquipGame, itemId: 1338 });
assert(rawEquipGame.itemAction?.type === "equip", "equip API hydrates raw source equipment before checking equipability");
assert(rawEquipGame.character.equipment["武器"] || Object.values(rawEquipGame.character.equipment || {}).length, "raw source equipment occupies a character equipment slot");
assertEqual(inventoryQty(rawEquipGame, 1338), 0, "raw source equipment is removed from inventory after equip");
const rawAttackAfter = Number(rawEquipGame.player?.WorkAttackPower || rawEquipGame.player?.WorkFixStr || 0);
assert(rawAttackAfter >= rawAttackBefore + 40, "source equipment bonus is applied to player battle attack runtime");
rawEquipGame = await api("/api/game/unequip-item", { game: rawEquipGame, slot: "武器" });
const rawAttackUnequipped = Number(rawEquipGame.player?.WorkAttackPower || rawEquipGame.player?.WorkFixStr || 0);
assert(rawAttackUnequipped <= rawAttackBefore + 1, "unequip removes source equipment battle attack bonus");
assertEqual(inventoryQty(rawEquipGame, 1338), 1, "unequip puts raw source equipment back into inventory");

const redRaptorGuideRsp = await api("/api/ai/guide", { game, prompt: "红暴任务怎么做" });
assert(redRaptorGuideRsp.text.includes("英雄岛前传：红暴"), "local guide retrieves red raptor quest knowledge");
assert(redRaptorGuideRsp.text.includes("日美子") && redRaptorGuideRsp.text.includes("弥生"), "red raptor guide answer includes key quest NPCs");
assert(redRaptorGuideRsp.text.includes("Worker VM"), "knowledge guide keeps action authority with the Worker VM");
const petKnowledgeRsp = await api("/api/ai/guide", { game, prompt: "宠物技能和忠诚是怎么回事" });
assert(petKnowledgeRsp.text.includes("宠物系统") && petKnowledgeRsp.text.includes("宠物技能"), "local guide retrieves pet system and skill knowledge");
const autoLevelRsp = await api("/api/ai/guide", { game, prompt: "帮我练宠升级" });
assertEqual(autoLevelRsp.action.type, "auto-level", "AI guide routes training requests to client auto leveling");
assert(autoLevelRsp.text.includes("自动练级") && autoLevelRsp.text.includes("战斗结果"), "AI guide explains training uses battle settlement");
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
const islandCheckpointSign = WORLD.maps["100"].npcs.find((npc) => String(npc.script || "").includes("signb_100_728_501"));
if (!islandCheckpointSign) throw new Error("missing island checkpoint signboard fixture");
assert(!String(islandCheckpointSign.dialogue || "").startsWith("脚本入口"), "source signboard text is loaded instead of script-entry fallback");
assert(islandCheckpointSign.dialogueLines?.some((line) => line.includes("第1检查点")), "source signboard keeps checkpoint title");
assert(islandCheckpointSign.dialogueLines?.some((line) => line.includes("柯尔克宠物店")), "source signboard keeps checkpoint question text");
let signboardGame = await api("/api/game/new", { name: "signboard-dialog-test" });
signboardGame.location = { mapId: "100", x: islandCheckpointSign.x - 1, y: islandCheckpointSign.y, dir: 2 };
signboardGame = await api("/api/game/talk", { game: signboardGame, npcId: islandCheckpointSign.id });
const signboardReply = signboardGame.dialog?.messages?.find((message) => message.speaker === "npc")?.text || "";
assert(signboardReply.includes("第1检查点") && signboardReply.includes("柯尔克宠物店") && signboardReply.includes("名字叫什么"), "source signboard talk displays the full checkpoint question");
assert(!signboardReply.includes("脚本入口"), "source signboard talk no longer leaks script-entry fallback");
const arenaBoardSign = WORLD.maps["2000"]?.npcs.find((npc) => String(npc.script || "").includes("signb_2000_87_78"));
if (!arenaBoardSign) throw new Error("missing arena board signboard fixture");
assert(!String(arenaBoardSign.dialogue || "").startsWith("脚本入口"), "empty signboard script falls back to create-name board copy");
assert(arenaBoardSign.dialogueLines?.some((line) => line.includes("玛丽娜丝的竞技场")), "arena board keeps the create-name headline");
let arenaBoardGame = await api("/api/game/new", { name: "arena-board-signboard-dialog-test" });
arenaBoardGame.location = { mapId: "2000", x: arenaBoardSign.x - 1, y: arenaBoardSign.y, dir: 2 };
arenaBoardGame = await api("/api/game/talk", { game: arenaBoardGame, npcId: arenaBoardSign.id });
const arenaBoardReply = arenaBoardGame.dialog?.messages?.find((message) => message.speaker === "npc")?.text || "";
assert(arenaBoardReply.includes("玛丽娜丝的竞技场") && arenaBoardReply.includes("公开挑战对战"), "arena board talk keeps the scripted board guidance");
assert(!arenaBoardReply.includes("脚本入口"), "arena board talk no longer falls back to script-entry text");
const timeManNpc = WORLD.maps["400"]?.npcs.find((npc) => npc.type === "TimeMan" && String(npc.script || "").includes("tman_400_85_102"));
if (!timeManNpc) throw new Error("missing TimeMan fixture");
assertEqual(timeManNpc.timeMan?.time, "AFTER", "source TimeMan parses time window");
assertEqual(timeManNpc.timeMan?.changeGraphic, 16204, "source TimeMan parses change_no as alternate graphic metadata");
assert(timeManNpc.scriptHints?.actions?.includes("timeMan"), "source TimeMan script hints expose timeMan metadata");
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
let disabledNpcAiCalls = 0;
const envWithNpcAi = {
  ...env,
  AI: {
    async run() {
      disabledNpcAiCalls += 1;
      return { response: "这条远程 AI 回复不应该在普通 NPC 对话里出现。" };
    }
  }
};
const noAiEffectCutoff = Date.now();
teacherGame = await apiWithEnv(envWithNpcAi, "/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
assertEqual(disabledNpcAiCalls, 0, "disabled NPC AI mode never calls Workers AI");
assertEqual(teacherGame.dialog.aiMode, false, "ordinary NPC dialog keeps AI mode off");
assert(!teacherGame.effects?.noEncounterUntil || Number(teacherGame.effects.noEncounterUntil) <= noAiEffectCutoff, "ordinary NPC dialog does not apply AI negotiated no-encounter");
assert(!teacherGame.dialog.messages.at(-1)?.text.includes("远程 AI"), "ordinary NPC dialog does not display AI response text");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "AI对话" });
assertEqual(teacherGame.dialog.aiMode, true, "AI dialog toggle is reflected in dialog state");
assert(teacherGame.dialog.suggestions.includes("请求避敌"), "AI mode exposes negotiated no-encounter suggestion");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
assertNpcProposal(teacherGame, "noEncounter", "AI negotiated no-encounter");
assert(!teacherGame.effects?.noEncounterUntil || Number(teacherGame.effects.noEncounterUntil) <= noAiEffectCutoff, "AI no-encounter proposal does not mutate before confirmation");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-proposal-pending" && event.detail?.kind === "noEncounter"), "AI no-encounter proposal records pending VM trace");
teacherGame = await acceptNpcProposal(teacherGame, teacher.id, "AI negotiated no-encounter");
assert(Number(teacherGame.effects?.noEncounterUntil || 0) > Date.now(), "AI negotiated no-encounter effect sets a future expiry after confirmation");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "effect" && event.status === "ok" && event.detail?.effect === "noEncounter"), "AI no-encounter effect runs through NPC VM");
assert(teacherGame.save.json.effects?.noEncounterUntil, "save json carries AI negotiated effects");
assert(Number(teacherGame.npcSocial?.npcs?.[teacher.id]?.scores?.helped || 0) > 0, "accepted proposal records helped social score");
assert(Number(teacherGame.npcSocial?.npcs?.[teacher.id]?.scores?.trust || 0) > 0, "accepted proposal records trust social score");

let noEncounterDeclineGame = await api("/api/game/new", { name: "npc-proposal-decline-test" });
noEncounterDeclineGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
noEncounterDeclineGame = await api("/api/game/dialog", { game: noEncounterDeclineGame, npcId: teacher.id, message: "AI对话" });
noEncounterDeclineGame = await api("/api/game/dialog", { game: noEncounterDeclineGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
noEncounterDeclineGame = await declineNpcProposal(noEncounterDeclineGame, teacher.id, "AI no-encounter decline");
assert(!pendingNpcProposal(noEncounterDeclineGame), "declined proposal clears pending proposal");
assert(!noEncounterDeclineGame.effects?.noEncounterUntil, "declined proposal does not apply no-encounter effect");
assert(noEncounterDeclineGame.npcSocial?.npcs?.[teacher.id]?.memories?.some((memory) => memory.kind === "proposal-declined"), "declined proposal writes compact social memory");

let expiredProposalGame = await api("/api/game/new", { name: "npc-proposal-expiry-test" });
expiredProposalGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
expiredProposalGame = await api("/api/game/dialog", { game: expiredProposalGame, npcId: teacher.id, message: "AI对话" });
expiredProposalGame = await api("/api/game/dialog", { game: expiredProposalGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
const expiredProposal = assertNpcProposal(expiredProposalGame, "noEncounter", "expired no-encounter");
expiredProposalGame.flags.pendingNpcProposal.expiresAt = Date.now() - 1000;
expiredProposalGame = await api("/api/game/dialog-proposal", { game: expiredProposalGame, npcId: teacher.id, proposalId: expiredProposal.id, decision: "accept" });
assert(!pendingNpcProposal(expiredProposalGame), "expired proposal clears pending proposal");
assert(!expiredProposalGame.effects?.noEncounterUntil, "expired proposal does not apply no-encounter effect");
assert(expiredProposalGame.dialog.messages.some((message) => String(message.text || "").includes("过期")), "expired proposal explains expiry");

let farProposalGame = await api("/api/game/new", { name: "npc-proposal-distance-test" });
farProposalGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
farProposalGame = await api("/api/game/dialog", { game: farProposalGame, npcId: teacher.id, message: "AI对话" });
farProposalGame = await api("/api/game/dialog", { game: farProposalGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
const farProposal = assertNpcProposal(farProposalGame, "noEncounter", "far no-encounter");
farProposalGame.location = farLocation(WORLD.maps["1000"], teacher);
await expectApiError(
  "/api/game/dialog-proposal",
  { game: farProposalGame, npcId: teacher.id, proposalId: farProposal.id, decision: "accept" },
  "请先走近",
  "proposal confirmation rejects remote NPC"
);

const wrongProposalNpc = WORLD.maps["1000"].npcs.find((npc) => npc.id !== teacher.id);
if (!wrongProposalNpc) throw new Error("missing wrong-NPC proposal fixture");
let mismatchProposalGame = await api("/api/game/new", { name: "npc-proposal-mismatch-test" });
mismatchProposalGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
mismatchProposalGame = await api("/api/game/dialog", { game: mismatchProposalGame, npcId: teacher.id, message: "AI对话" });
mismatchProposalGame = await api("/api/game/dialog", { game: mismatchProposalGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
const mismatchProposal = assertNpcProposal(mismatchProposalGame, "noEncounter", "mismatched no-encounter");
mismatchProposalGame.location = { mapId: "1000", x: wrongProposalNpc.x + 1, y: wrongProposalNpc.y };
await expectApiError(
  "/api/game/dialog-proposal",
  { game: mismatchProposalGame, npcId: wrongProposalNpc.id, proposalId: mismatchProposal.id, decision: "accept" },
  "没有等待确认",
  "proposal confirmation rejects NPC mismatch"
);

let petFullProposalGame = await api("/api/game/new", { name: "npc-proposal-pet-full-test" });
petFullProposalGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
petFullProposalGame = await api("/api/game/dialog", { game: petFullProposalGame, npcId: teacher.id, message: "AI对话" });
petFullProposalGame = await api("/api/game/dialog", { game: petFullProposalGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
petFullProposalGame.flags.pendingNpcProposal.grants.pets = ["容量测试宠物"];
fillPetsForCapacity(petFullProposalGame);
petFullProposalGame = await acceptNpcProposal(petFullProposalGame, teacher.id, "pet-full proposal");
assert(!petFullProposalGame.effects?.noEncounterUntil, "pet-full proposal preflight blocks state mutation");
assert(petFullProposalGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-proposal-preflight-failed"), "pet-full proposal records preflight failure");

let wrongPetProposalGame = await api("/api/game/new", { name: "npc-proposal-wrong-pet-test" });
wrongPetProposalGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y };
wrongPetProposalGame = await api("/api/game/dialog", { game: wrongPetProposalGame, npcId: teacher.id, message: "AI对话" });
wrongPetProposalGame = await api("/api/game/dialog", { game: wrongPetProposalGame, npcId: teacher.id, message: "能不能帮我一段时间不会遇到野外敌人" });
wrongPetProposalGame.flags.pendingNpcProposal.costs.requiresPetChoice = true;
wrongPetProposalGame.flags.pendingNpcProposal.costs.pets = ["不存在的宠物"];
wrongPetProposalGame = await acceptNpcProposal(wrongPetProposalGame, teacher.id, "wrong-pet proposal", 0);
assert(!wrongPetProposalGame.effects?.noEncounterUntil, "wrong-pet proposal preflight blocks state mutation");
assert(wrongPetProposalGame.dialog.messages.some((message) => String(message.text || "").includes("宠物")), "wrong-pet proposal explains selected pet mismatch");

teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "普通对话" });
assertEqual(teacherGame.dialog.aiMode, false, "AI dialog toggle can return to source dialog mode");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "训练" });
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "unsupported" && event.detail?.originalAction === "fieldSkill"), "unsupported VM actions preserve original action");
assert(teacherGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.reason === "training-query"), "teacher training query connects to active quest context");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && /战斗经验|下一步/.test(message.text)), "teacher training reply explains battle-based progression and next quest step");

const conditionOverrideMap = WORLD.maps["100"];
const conditionOverrideRewardBase = 910001;
function installConditionOverrideNpc(kind, condition, eventNo, offset = 0, type = "MESSAGE") {
  const npc = {
    id: `npc-condition-override-${kind}-${eventNo}`,
    name: `条件通融${kind}`,
    type: "Event",
    template: "check-npc-condition-override",
    source: `test/npc-condition-override/${kind}`,
    script: `test/npc-condition-override/${kind}`,
    x: 700 + offset,
    y: 500 + offset,
    dialogue: "按原脚本条件办理。",
    scriptEvents: [{
      eventNo,
      type,
      condition,
      messages: {
        normalMain: `${kind} 条件通融完成。`,
        request: `${kind} 条件通融完成。`
      },
      getItems: [{ id: conditionOverrideRewardBase + offset, qty: 1, source: "check-npc-condition-override" }],
      source: `test/npc-condition-override/${kind}`
    }]
  };
  conditionOverrideMap.npcs.push(npc);
  return npc;
}

function baseConditionOverrideGame(name, npc) {
  return {
    ...structuredClone(game),
    name,
    location: { mapId: "100", x: npc.x + 1, y: npc.y, dir: 6 },
    player: { ...structuredClone(game.player), stone: 120000, level: 11 },
    inventory: [],
    effects: {},
    dialog: null,
    dialogAi: {},
    flags: { ...structuredClone(game.flags || {}), bits: {}, endEvents: Array(8).fill(0), nowEvents: Array(8).fill(0) },
    pets: structuredClone(game.pets || []).slice(0, 1),
    save: structuredClone(game.save || {})
  };
}

async function createConditionOverride(gameState, npc, label, text = "请通融这个任务条件，我愿意给报酬") {
  gameState = await api("/api/game/dialog", { game: gameState, npcId: npc.id, message: "AI对话" });
  assertEqual(gameState.dialog.aiMode, true, `${label} enables AI mode`);
  const stoneBefore = Number(gameState.player.stone || 0);
  gameState = await api("/api/game/dialog", { game: gameState, npcId: npc.id, message: text });
  const proposal = assertNpcProposal(gameState, "conditionOverride", `${label} condition override proposal`);
  assert(proposal.grants?.conditionOverrides?.length, `${label} proposal advertises condition override grant`);
  assertEqual(Number(gameState.player.stone || 0), stoneBefore, `${label} proposal does not charge before confirmation`);
  gameState = await acceptNpcProposal(gameState, npc.id, `${label} condition override proposal`);
  assert(Object.keys(gameState.effects?.npcConditionOverrides || {}).length === 1, `${label} stores one pending condition override`);
  assert(gameState.dialog.debug.conditionOverrides.active.length === 1, `${label} dialog debug exposes active condition override`);
  assert(gameState.dialog.debug.conditionOverrides.recent.some((entry) => entry.reason === "created"), `${label} dialog debug records override creation`);
  return gameState;
}

async function assertConditionOverrideSuccess(kind, condition, eventNo, offset, setup = null) {
  const npc = installConditionOverrideNpc(kind, condition, eventNo, offset);
  let testGame = baseConditionOverrideGame(`condition-override-${kind}`, npc);
  if (setup) setup(testGame);
  const rewardId = conditionOverrideRewardBase + offset;
  testGame = await createConditionOverride(testGame, npc, `${kind}`);
  const stoneBeforeRun = Number(testGame.player.stone || 0);
  testGame = await api("/api/game/dialog", { game: testGame, npcId: npc.id, message: "任务" });
  assertEqual(inventoryQty(testGame, rewardId), 1, `${kind} override lets the original NPC VM grant reward`);
  assert(Number(testGame.player.stone || 0) < stoneBeforeRun, `${kind} override charges substitute stone at script execution`);
  assert(testGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-condition-override-match"), `${kind} override records match in dialog debug`);
  assert(testGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-condition-override-consumed"), `${kind} override records one-shot consumption`);
  assert(!Object.keys(testGame.effects?.npcConditionOverrides || {}).length, `${kind} override is consumed after one use`);
  testGame = await api("/api/game/dialog", { game: testGame, npcId: npc.id, message: "任务" });
  assertEqual(inventoryQty(testGame, rewardId), 1, `${kind} override cannot be reused after consumption`);
}

const noAiConditionNpc = installConditionOverrideNpc("no-ai", "ITEM=990401*1", 941, 41);
let noAiConditionGame = baseConditionOverrideGame("condition-override-no-ai", noAiConditionNpc);
noAiConditionGame = await api("/api/game/dialog", { game: noAiConditionGame, npcId: noAiConditionNpc.id, message: "请通融这个任务条件，我愿意给报酬" });
assert(!pendingNpcProposal(noAiConditionGame), "normal condition-relief request does not create proposal without AI mode");
assert(!Object.keys(noAiConditionGame.effects?.npcConditionOverrides || {}).length, "normal condition-relief request does not create condition override");

await assertConditionOverrideSuccess("item", "ITEM=990001*1", 901, 1);
await assertConditionOverrideSuccess("level", "LV>=99", 902, 2, (testGame) => {
  testGame.player.level = 11;
});
await assertConditionOverrideSuccess("pet", "PET=60-990002*1", 903, 3);
await assertConditionOverrideSuccess("stone", "STONE>=999999", 904, 4, (testGame) => {
  testGame.player.stone = 120000;
});
await assertConditionOverrideSuccess("event", "ENDEV=999", 905, 5);

const wrongNpcA = installConditionOverrideNpc("wrong-npc-a", "ITEM=990101*1", 911, 11);
const wrongNpcB = installConditionOverrideNpc("wrong-npc-b", "ITEM=990101*1", 911, 12);
let wrongNpcGame = baseConditionOverrideGame("condition-override-wrong-npc", wrongNpcA);
wrongNpcGame = await createConditionOverride(wrongNpcGame, wrongNpcA, "wrong npc");
wrongNpcGame.location = { mapId: "100", x: wrongNpcB.x + 1, y: wrongNpcB.y, dir: 6 };
wrongNpcGame = await api("/api/game/dialog", { game: wrongNpcGame, npcId: wrongNpcB.id, message: "任务" });
assertEqual(inventoryQty(wrongNpcGame, conditionOverrideRewardBase + 12), 0, "condition override does not apply to another NPC");
assert(wrongNpcGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-condition-override-no-matching-override"), "wrong NPC condition override refusal is recorded");

const wrongEventNpc = {
  ...installConditionOverrideNpc("wrong-event", "ITEM=990201*1", 921, 21, "REQUEST"),
  scriptEvents: [
    {
      eventNo: 921,
      type: "REQUEST",
      condition: "ITEM=990201*1",
      messages: { request: "first event should stay skipped" },
      getItems: [{ id: conditionOverrideRewardBase + 21, qty: 1, source: "check-npc-condition-override" }],
      source: "test/npc-condition-override/wrong-event-a"
    },
    {
      eventNo: 922,
      type: "MESSAGE",
      condition: "LV>=99",
      messages: { normalMain: "second event should stay blocked" },
      getItems: [{ id: conditionOverrideRewardBase + 22, qty: 1, source: "check-npc-condition-override" }],
      source: "test/npc-condition-override/wrong-event-b"
    }
  ]
};
conditionOverrideMap.npcs[conditionOverrideMap.npcs.findIndex((npc) => npc.id === wrongEventNpc.id)] = wrongEventNpc;
let wrongEventGame = baseConditionOverrideGame("condition-override-wrong-event", wrongEventNpc);
wrongEventGame = await createConditionOverride(wrongEventGame, wrongEventNpc, "wrong event");
setTestEventFlag(wrongEventGame, 921, "now");
wrongEventGame = await api("/api/game/dialog", { game: wrongEventGame, npcId: wrongEventNpc.id, message: "任务" });
assertEqual(inventoryQty(wrongEventGame, conditionOverrideRewardBase + 22), 0, "condition override does not apply to a different script event");
assert(wrongEventGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-condition-override-no-matching-override"), "wrong event condition override refusal is recorded");

const expiredNpc = installConditionOverrideNpc("expired", "ITEM=990301*1", 931, 31);
let expiredGame = baseConditionOverrideGame("condition-override-expired", expiredNpc);
expiredGame = await createConditionOverride(expiredGame, expiredNpc, "expired");
const expiredEntry = Object.values(expiredGame.effects.npcConditionOverrides)[0];
expiredEntry.expiresAt = Date.now() - 1000;
expiredGame = await api("/api/game/dialog", { game: expiredGame, npcId: expiredNpc.id, message: "任务" });
assertEqual(inventoryQty(expiredGame, conditionOverrideRewardBase + 31), 0, "expired condition override cannot run source event");
assert(expiredGame.dialog.debug.conditionOverrides.recent.some((entry) => entry.reason === "expired"), "expired condition override is recorded in dialog debug");

let questLoopGame = await api("/api/game/new", { name: "source-quest-loop-test" });
questLoopGame.location = { mapId: "1000", x: teacher.x + 1, y: teacher.y, dir: 2 };
questLoopGame = await api("/api/game/dialog", { game: questLoopGame, npcId: teacher.id });
assertEqual(questLoopGame.quests[teacher.questId].status, "进行中", "teacher starts the first source-grounded quest");
assert(questLoopGame.quests[teacher.questId].guidance?.some((line) => line.includes("萨伊那斯") && line.includes("floor 100")), "field quest guidance tells the player which map to visit");
assert(questLoopGame.quests[teacher.questId].guidance?.some((line) => line.includes("路线") && line.includes("出口")), "field quest guidance includes route/exit instructions");
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
assert(questLoopGame.quests[fourVillageQuestId].guidance?.some((line) => line.includes("下一张地图") && line.includes("萨伊那斯")), "four-village route guidance names the next map");
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
assertNpcProposal(nurseAidGame, "roleFavor", "AI healer aid");
assertEqual(nurseAidGame.player.stone, nurseStoneBefore, "AI healer aid does not charge before confirmation");
assert(!nurseAidGame.inventory.some((item) => /回复药|回復藥|恢复药|恢復藥/.test(item.name || "")), "AI healer aid does not give item before confirmation");
nurseAidGame = await acceptNpcProposal(nurseAidGame, caveNurse.id, "AI healer aid");
const nurseAidItem = nurseAidGame.inventory.find((item) => /回复药|回復藥|恢复药|恢復藥/.test(item.name || ""));
assert(nurseAidItem, "AI healer aid gives a role-fit recovery item");
assert(nurseAidGame.player.stone < nurseStoneBefore, "AI healer aid asks for compensation");
assert(nurseAidGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(nurseAidItem.name)), "AI healer aid names the recovery item");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "debug" && event.detail?.reason === "ai-role-favor" && event.detail?.role === "healer"), "AI healer aid records role-favor decision");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "ai-healer-aid"), "AI healer aid compensation runs through NPC VM");
assert(nurseAidGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "ai-healer-aid" && event.detail?.itemName === nurseAidItem.name), "AI healer aid item runs through NPC VM");
assert(nurseAidGame.flags.bits[`now:${stableFlag(`${caveNurse.id}:ai-healer-aid`)}`], "AI healer aid records a source-style action flag");

let nurseFullInventoryGame = await api("/api/game/new", { name: "npc-proposal-inventory-full-test" });
nurseFullInventoryGame.location = { mapId: "100", x: caveNurse.x + 1, y: caveNurse.y };
nurseFullInventoryGame.player.stone = 1000;
fillInventoryForCapacity(nurseFullInventoryGame);
nurseFullInventoryGame = await api("/api/game/dialog", { game: nurseFullInventoryGame, npcId: caveNurse.id, message: "AI对话" });
nurseFullInventoryGame = await api("/api/game/dialog", { game: nurseFullInventoryGame, npcId: caveNurse.id, message: "真的很需要，可以卖给我一些回复药么？" });
const nurseFullInventoryStone = nurseFullInventoryGame.player.stone;
nurseFullInventoryGame = await acceptNpcProposal(nurseFullInventoryGame, caveNurse.id, "AI healer full inventory");
assertEqual(nurseFullInventoryGame.player.stone, nurseFullInventoryStone, "inventory-full proposal does not deduct stone");
assert(nurseFullInventoryGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-proposal-preflight-failed"), "inventory-full proposal records preflight failure");
assert(nurseFullInventoryGame.dialog.messages.some((message) => String(message.text || "").includes("背包已满")), "inventory-full proposal explains bag capacity");

const saveNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => /savepoint|save/i.test(`${npc.type} ${npc.template}`));
if (!saveNpc) throw new Error("missing savepoint NPC fixture");

game.location = { mapId: saveNpc.map.id, x: saveNpc.npc.x + 1, y: saveNpc.npc.y };
const savePointRequirement = saveNpc.npc.savePoint?.requiredAlternatives?.[0] || [];
const savePointRequirementBefore = new Map(savePointRequirement.map((item) => [Number(item.id), inventoryQty(game, item.id)]));
for (const item of savePointRequirement) {
  const existing = game.inventory.find((entry) => Number(entry.id) === Number(item.id));
  if (existing) existing.qty = Number(existing.qty || 0) + Number(item.qty || 1);
  else game.inventory.push({ ...item, qty: Number(item.qty || 1) });
}
game = await api("/api/game/dialog", { game, npcId: saveNpc.npc.id, message: "记录" });
if (savePointRequirement.length) {
  assert(game.flags.pendingSavePoint?.npcId === saveNpc.npc.id, "source savepoint asks for confirmation before consuming GetItem requirements");
  assert(game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.reason === "source-savepoint-confirm"), "source savepoint confirmation runs through window VM trace");
  game = await api("/api/game/dialog", { game, npcId: saveNpc.npc.id, message: "确认记录" });
  for (const item of savePointRequirement) {
    assertEqual(inventoryQty(game, item.id), savePointRequirementBefore.get(Number(item.id)), "source savepoint consumes its selected GetItem requirement set");
  }
  assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-savepoint-getitem"), "source savepoint item consumption runs through NPC VM take");
}
assertEqual(game.savePoint.npcId, saveNpc.npc.id, "savepoint records npc id");
assertEqual(game.savePoint.sourceId, saveNpc.npc.savePoint?.id || 0, "savepoint records source elder id");
if (saveNpc.npc.savePoint?.born) {
  assertEqual(game.savePoint.born.mapId, saveNpc.npc.savePoint.born.mapId, "savepoint records source Born map");
  assertEqual(game.savePoint.born.x, saveNpc.npc.savePoint.born.x, "savepoint records source Born x");
  assertEqual(game.savePoint.born.y, saveNpc.npc.savePoint.born.y, "savepoint records source Born y");
}
assertEqual(game.save.json.savePoint.npcId, saveNpc.npc.id, "save json records savepoint");
assert(game.save.info.includes("LAST_SAVEPOINT="), "saac-like save info includes last savepoint");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "save" && event.status === "ok"), "savepoint dialog debug includes save VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "savepoint"), "savepoint dialog debug includes setFlag VM trace");
assert(game.flags.bits[`end:${stableFlag(`${saveNpc.npc.id}:savepoint`)}`], "savepoint end flag set");
if (saveNpc.npc.savePoint?.born) {
  game.location = { mapId: "300", x: 274, y: 403, dir: 4 };
  game = await api("/api/game/return-savepoint", { game });
  assertEqual(game.location.mapId, saveNpc.npc.savePoint.born.mapId, "return point uses source savepoint Born map after NPC record");
  assertEqual(game.location.x, saveNpc.npc.savePoint.born.x, "return point uses source savepoint Born x after NPC record");
  assertEqual(game.location.y, saveNpc.npc.savePoint.born.y, "return point uses source savepoint Born y after NPC record");
  assertEqual(game.returnPoint.kind, "savepoint", "return point reports source savepoint after NPC record");
}

const allSavePointReqIds = new Set((saveNpc.npc.savePoint?.requiredAlternatives || []).flat().map((item) => Number(item.id)).filter(Boolean));
let savePointNoAiGame = await api("/api/game/new", { name: "savepoint-no-ai-flex-block-test" });
savePointNoAiGame.location = { mapId: saveNpc.map.id, x: saveNpc.npc.x + 1, y: saveNpc.npc.y };
savePointNoAiGame.player.stone = 5000;
savePointNoAiGame.inventory = (savePointNoAiGame.inventory || []).filter((item) => !allSavePointReqIds.has(Number(item.id)));
const savePointNoAiStone = savePointNoAiGame.player.stone;
savePointNoAiGame = await api("/api/game/dialog", { game: savePointNoAiGame, npcId: saveNpc.npc.id, message: "给你钱，帮我记录吧" });
assert(!pendingNpcProposal(savePointNoAiGame), "normal savepoint favor request does not create proposal without AI mode");
assert(savePointNoAiGame.savePoint?.npcId !== saveNpc.npc.id, "normal savepoint dialog does not accept compensation without AI mode");
assertEqual(savePointNoAiGame.player.stone, savePointNoAiStone, "normal savepoint compensation request does not spend stone");
assert(savePointNoAiGame.dialog.messages.some((message) => message.speaker === "npc" && /需要|来源|原脚本/.test(message.text)), "normal savepoint dialog still explains source requirement");
assert(savePointNoAiGame.dialog.debug.vmTrace.some((event) => event.action === "save" && event.status === "blocked" && event.detail?.reason === "source-savepoint-missing-item"), "normal savepoint missing item stays on source block path");

let savePointFavorGame = await api("/api/game/new", { name: "savepoint-ai-favor-test" });
savePointFavorGame.location = { mapId: saveNpc.map.id, x: saveNpc.npc.x + 1, y: saveNpc.npc.y };
savePointFavorGame.player.stone = 5000;
savePointFavorGame.inventory = (savePointFavorGame.inventory || []).filter((item) => !allSavePointReqIds.has(Number(item.id)));
const savePointFavorStoneBefore = savePointFavorGame.player.stone;
savePointFavorGame = await api("/api/game/dialog", { game: savePointFavorGame, npcId: saveNpc.npc.id, message: "AI对话" });
assertEqual(savePointFavorGame.dialogAi?.[saveNpc.npc.id], true, "savepoint AI mode toggles on");
savePointFavorGame = await api("/api/game/dialog", { game: savePointFavorGame, npcId: saveNpc.npc.id, message: "给你钱，帮我记录吧" });
assertNpcProposal(savePointFavorGame, "roleFavor", "AI savepoint favor");
assert(savePointFavorGame.savePoint?.npcId !== saveNpc.npc.id, "AI savepoint favor does not record before confirmation");
assertEqual(savePointFavorGame.player.stone, savePointFavorStoneBefore, "AI savepoint favor does not charge before confirmation");
savePointFavorGame = await acceptNpcProposal(savePointFavorGame, saveNpc.npc.id, "AI savepoint favor");
assertEqual(savePointFavorGame.savePoint.npcId, saveNpc.npc.id, "AI savepoint favor records npc id");
assert(savePointFavorGame.player.stone < savePointFavorStoneBefore, "AI savepoint favor charges stone compensation");
assert(!savePointFavorGame.flags.pendingSavePoint, "AI savepoint favor does not leave source item confirmation pending");
assert(savePointFavorGame.dialog.messages.some((message) => message.speaker === "npc" && /石币|通融|记下来|记录/.test(message.text)), "AI savepoint favor explains flexible compensation");
assert(savePointFavorGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "ai-savepoint-fee"), "AI savepoint favor fee runs through NPC VM");
assert(savePointFavorGame.dialog.debug.vmTrace.some((event) => event.action === "save" && event.detail?.reason === "ai-savepoint-favor"), "AI savepoint favor save runs through NPC VM");
if (saveNpc.npc.savePoint?.born) {
  assertEqual(savePointFavorGame.savePoint.born.mapId, saveNpc.npc.savePoint.born.mapId, "AI savepoint favor records source Born map");
  assertEqual(savePointFavorGame.savePoint.born.x, saveNpc.npc.savePoint.born.x, "AI savepoint favor records source Born x");
  assertEqual(savePointFavorGame.savePoint.born.y, saveNpc.npc.savePoint.born.y, "AI savepoint favor records source Born y");
}

const luckyManEntry = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.luckyMan?.luckMessages);
if (!luckyManEntry) throw new Error("missing LuckyMan NPC fixture");
let luckyManGame = await api("/api/game/new", { name: "luckyman-source-test" });
luckyManGame.location = { mapId: luckyManEntry.map.id, x: luckyManEntry.npc.x + 1, y: luckyManEntry.npc.y };
luckyManGame.player.level = 12;
luckyManGame.player.stone = 100;
luckyManGame.player.Luck = 1;
luckyManGame.player.WorkFixLuck = 1;
luckyManGame = await api("/api/game/dialog", { game: luckyManGame, npcId: luckyManEntry.npc.id, message: "hi" });
assert(luckyManGame.flags.pendingLuckyMan?.npcId === luckyManEntry.npc.id, "LuckyMan source dialog asks for confirmation before charging stone");
assert(luckyManGame.dialog.debug.actions.includes("fortune"), "LuckyMan debug exposes fortune VM action");
assert(luckyManGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.reason === "source-luckyman-confirm"), "LuckyMan prompt records source window VM trace");
luckyManGame = await api("/api/game/dialog", { game: luckyManGame, npcId: luckyManEntry.npc.id, message: "是" });
assertEqual(luckyManGame.player.stone, 88, "LuckyMan charges source LV*1 stone cost");
assert(!luckyManGame.flags.pendingLuckyMan, "LuckyMan clears pending confirmation after fortune");
assert(luckyManGame.dialog.messages.at(-1)?.text.includes("来源："), "LuckyMan result keeps source attribution for debug tab");
assert(luckyManGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-luckyman" && event.detail?.qty === 12), "LuckyMan stone charge runs through NPC VM take");
assert(luckyManGame.dialog.debug.vmTrace.some((event) => event.action === "fortune" && event.detail?.luck === 1), "LuckyMan fortune result records source luck tier through VM");

const ganzo = WORLD.maps["100"]?.npcs.find((npc) => npc.name === "坏心眼的愿藏");
if (!ganzo) throw new Error("missing Ganzo NPCEnemy fixture");
assertEqual(ganzo.graphic, "100401", "Ganzo uses source graphicname 100401");
assert(ganzo.npcEnemy?.enemyNos.includes(253) && ganzo.npcEnemy?.enemyNos.includes(254), "Ganzo parses source enemyno list");
let ganzoPromptGame = await api("/api/game/new", { name: "ganzo-prompt-test" });
ganzoPromptGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoPromptGame = await api("/api/game/dialog", { game: ganzoPromptGame, npcId: ganzo.id });
assert(!ganzoPromptGame.encounter, "Ganzo default dialog does not start battle before YES");
assert(ganzoPromptGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("要决胜负吗")), "Ganzo default dialog asks source battle question");
assert(ganzoPromptGame.dialog.suggestions.includes("开战") && ganzoPromptGame.dialog.suggestions.includes("离开"), "Ganzo prompt exposes source YES/NO as player-facing battle buttons");
assert(ganzoPromptGame.dialog.debug.actions.includes("window"), "Ganzo debug profiles NPCEnemy window action");
assert(ganzoPromptGame.dialog.debug.actions.includes("startBattle"), "Ganzo debug profiles NPCEnemy battle action");
ganzoPromptGame = await api("/api/game/dialog", { game: ganzoPromptGame, npcId: ganzo.id, message: "离开" });
assert(!ganzoPromptGame.encounter, "Ganzo NO keeps battle closed");
assert(ganzoPromptGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("有什么事吗")), "Ganzo NO returns deniedmsg");
assert(ganzoPromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.status === "cancel" && event.detail?.select === "no"), "Ganzo NO records source window cancel");

const chahan = WORLD.maps["10007"]?.npcs.find((npc) => npc.name === "查罕·乌尔夫" && npc.npcEnemy);
if (!chahan) throw new Error("missing Chahan NPCEnemy fixture");
let chahanPromptGame = await api("/api/game/new", { name: "chahan-prompt-test" });
chahanPromptGame.location = { mapId: "10007", x: chahan.x + 1, y: chahan.y };
chahanPromptGame = await api("/api/game/dialog", { game: chahanPromptGame, npcId: chahan.id });
assertEqual(chahanPromptGame.dialog.npcType, "NPCEnemy", "NPCEnemy dialogs normalize npcType for client confirm buttons");
assert(chahanPromptGame.dialog.messages.some((message) => message.text.includes("只有我们三兄弟承认的人") && message.text.includes("你要试试看吗")), "NPCEnemy prompt keeps all source askbattlemsg lines");
assert(chahanPromptGame.dialog.suggestions.includes("开战"), "NPCEnemy prompt exposes explicit start battle command");
chahanPromptGame = await api("/api/game/dialog", { game: chahanPromptGame, npcId: chahan.id, message: "攻击" });
assert(chahanPromptGame.encounter, "NPCEnemy natural attack intent starts the source battle");
assertEqual(chahanPromptGame.battle?.npcEnemy?.npcId, chahan.id, "NPCEnemy natural attack intent keeps source NPC metadata");

const noAskNpcEnemy = WORLD.maps["1021"]?.npcs.find((npc) => npc.name === "第 100 个弟子" && npc.npcEnemy && !(npc.npcEnemy.askBattleMessages || []).length);
if (!noAskNpcEnemy) throw new Error("missing no-ask NPCEnemy fixture");
let noAskNpcEnemyGame = await api("/api/game/new", { name: "npcenemy-no-ask-direct-battle-test" });
noAskNpcEnemyGame.location = { mapId: "1021", x: noAskNpcEnemy.x, y: noAskNpcEnemy.y + 1 };
noAskNpcEnemyGame = await api("/api/game/dialog", { game: noAskNpcEnemyGame, npcId: noAskNpcEnemy.id });
assert(!noAskNpcEnemyGame.dialog, "NPCEnemy without source askbattlemsg skips the YES/NO dialog window");
assert(noAskNpcEnemyGame.npcVmEvents.some((event) => (
  event.npcId === noAskNpcEnemy.id
  && event.action === "startBattle"
  && event.status === "blocked"
  && event.detail?.reason === "missing-enemyno"
)), "no-ask NPCEnemy immediately attempts the source battle path even when its compact enemy data is unavailable");

const requiredItemNpcEnemy = WORLD.maps["10701"]?.npcs.find((npc) => npc.name === "怪力的小阵" && npc.npcEnemy?.requiredItems?.length);
if (!requiredItemNpcEnemy) throw new Error("missing source NPCEnemy required-item fixture");
let requiredItemNpcEnemyGame = await api("/api/game/new", { name: "npcenemy-required-item-test" });
requiredItemNpcEnemyGame.location = { mapId: "10701", x: requiredItemNpcEnemy.x, y: requiredItemNpcEnemy.y + 1 };
requiredItemNpcEnemyGame.player.level = 40;
requiredItemNpcEnemyGame.pets[0].Lv = 40;
requiredItemNpcEnemyGame = await api("/api/game/dialog", { game: requiredItemNpcEnemyGame, npcId: requiredItemNpcEnemy.id, message: "开战" });
assert(!requiredItemNpcEnemyGame.encounter, "NPCEnemy source item gate blocks battle when required item is missing");
assert(requiredItemNpcEnemyGame.dialog.messages.at(-1)?.text.includes("需要"), "NPCEnemy item gate explains missing source item");
assert(requiredItemNpcEnemyGame.dialog.debug.vmTrace.some((event) => event.action === "startBattle" && event.status === "blocked" && event.detail?.reason === "npcenemy-required-item"), "NPCEnemy missing item records blocked startBattle VM trace");
requiredItemNpcEnemyGame.inventory.push({ id: 2431, name: "盗贼们的足迹", qty: 1 });
requiredItemNpcEnemyGame = await api("/api/game/dialog", { game: requiredItemNpcEnemyGame, npcId: requiredItemNpcEnemy.id, message: "开战" });
assert(requiredItemNpcEnemyGame.encounter, "NPCEnemy starts the source battle after required item is present");
assertEqual(inventoryQty(requiredItemNpcEnemyGame, 2431), 1, "NPCEnemy without steal:1 keeps the required source item after battle start");

const stealItemNpcEnemy = WORLD.maps["6000"]?.npcs.find((npc) => npc.name === "尊尼" && npc.npcEnemy?.stealItems && npc.npcEnemy?.requiredItems?.length);
if (!stealItemNpcEnemy) throw new Error("missing source NPCEnemy steal-item fixture");
let stealItemNpcEnemyGame = await api("/api/game/new", { name: "npcenemy-steal-item-test" });
stealItemNpcEnemyGame.location = { mapId: "6000", x: stealItemNpcEnemy.x, y: stealItemNpcEnemy.y + 1 };
stealItemNpcEnemyGame.player.level = 80;
stealItemNpcEnemyGame.pets[0].Lv = 80;
for (const item of stealItemNpcEnemy.npcEnemy.requiredItems) {
  stealItemNpcEnemyGame.inventory.push({ id: item.id, name: `source item ${item.id}`, qty: Number(item.qty || 1) });
}
stealItemNpcEnemyGame = await api("/api/game/dialog", { game: stealItemNpcEnemyGame, npcId: stealItemNpcEnemy.id, message: "开战" });
assert(stealItemNpcEnemyGame.encounter, "NPCEnemy steal fixture starts battle after all required items are present");
for (const item of stealItemNpcEnemy.npcEnemy.requiredItems) {
  assertEqual(inventoryQty(stealItemNpcEnemyGame, item.id), 0, "NPCEnemy steal:1 removes every required source item on battle start");
}
assert(stealItemNpcEnemyGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "npcenemy-steal"), "NPCEnemy steal:1 runs through deterministic take VM action");

let ganzoBattleGame = await api("/api/game/new", { name: "ganzo-battle-test" });
ganzoBattleGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoBattleGame.player.level = 5;
ganzoBattleGame.pets[0].Lv = 5;
ganzoBattleGame = await api("/api/game/dialog", { game: ganzoBattleGame, npcId: ganzo.id, message: "开战" });
assertEqual(ganzoBattleGame.encounter?.EnemyId, 253, "Ganzo YES starts with source enemy1 id 253");
assertEqual(ganzoBattleGame.encounter?.PetId, 500, "Ganzo enemy1 id 253 resolves to enemybase tempNo 500");
assert(ganzoBattleGame.encounter.Lv >= 14 && ganzoBattleGame.encounter.Lv <= 15, "Ganzo enemy1 id 253 uses source level range 14-15");
assertEqual(ganzoBattleGame.battle?.enemyParty?.length, 2, "Ganzo NPCEnemy creates the exact source enemy count");
assertEqual(ganzoBattleGame.battle.enemyParty[1].EnemyId, 254, "Ganzo second target keeps source enemy1 id 254");
assertEqual(ganzoBattleGame.battle.enemyParty[1].PetId, 501, "Ganzo enemy1 id 254 resolves to enemybase tempNo 501");
assert(ganzoBattleGame.battle.enemyParty[1].Lv >= 10 && ganzoBattleGame.battle.enemyParty[1].Lv <= 13, "Ganzo enemy1 id 254 uses source level range 10-13");
assertEqual(ganzoBattleGame.characterFields.battle.formation.activeActorKind, "pet", "battle formation marks the active actor as the deployed pet");
assertEqual(ganzoBattleGame.characterFields.battle.formation.activeActorNo, 5, "battle formation activeActorNo uses the source pet battle slot instead of the player slot");
assert(ganzoBattleGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "player" && unit.battleNo === 0 && !unit.active), "battle formation does not mark player slot 0 active while the pet is acting");
assert(ganzoBattleGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "pet" && unit.battleNo === 5 && unit.active), "battle formation exposes the active pet on source battleNo 5");
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
let ganzoTargetNoGame = JSON.parse(JSON.stringify(ganzoBattleGame));
ganzoTargetNoGame.battle.enemyParty[1].Hp = 1;
ganzoTargetNoGame.battle.enemyParty[1].WorkFixDex = 0;
ganzoTargetNoGame.battle.enemyParty[1].WorkQuick = 0;
ganzoTargetNoGame.pets[0].WorkFixStr = 999;
ganzoTargetNoGame.pets[0].WorkFixDex = 999;
ganzoTargetNoGame.pets[0].WorkAttackPower = 999;
ganzoTargetNoGame.pets[0].WorkQuick = 999;
ganzoTargetNoGame = await api("/api/game/battle", { game: ganzoTargetNoGame, action: "attackNo:11" });
assertEqual(ganzoTargetNoGame.battleOutcome.result, "next-enemy", "source battleNo target command can defeat the selected enemy");
assertEqual(ganzoTargetNoGame.battleOutcome.playerAction.command, "H|B", "source battleNo target command records original-style target token");
assertEqual(ganzoTargetNoGame.battleOutcome.playerAction.targetNo, 11, "source battleNo target command preserves source battleNo telemetry");
assert(ganzoTargetNoGame.battle.defeatedEnemies.some((enemy) => enemy.EnemyId === 254), "source battleNo target command records defeated selected enemy");
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

const oneBattleFixture = Object.entries(WORLD.maps)
  .flatMap(([mapId, map]) => (map.npcs || []).map((npc) => ({ mapId, npc })))
  .find(({ npc }) => npc.npcEnemy?.oneBattle && npc.npcEnemy?.alreadyMessage && npc.npcEnemy?.enemyNos?.length);
assert(oneBattleFixture, "world data exposes at least one source NPCEnemy onebattle fixture");
let oneBattleGame = await api("/api/game/new", { name: "npcenemy-onebattle-test" });
oneBattleGame.location = {
  mapId: oneBattleFixture.mapId,
  x: oneBattleFixture.npc.x,
  y: oneBattleFixture.npc.y + 1
};
oneBattleGame.player.level = 60;
oneBattleGame.pets[0].Lv = 60;
oneBattleGame = await api("/api/game/dialog", { game: oneBattleGame, npcId: oneBattleFixture.npc.id, message: "是" });
assert(oneBattleGame.encounter, "NPCEnemy onebattle fixture starts an encounter on first YES");
assertEqual(oneBattleGame.battle?.npcEnemy?.oneBattle, true, "NPCEnemy onebattle metadata is preserved on active battle");
assert(oneBattleGame.battle?.npcEnemy?.alreadyMessage, "NPCEnemy onebattle battle metadata keeps alreadymsg");
const oneBattleEnemyId = oneBattleGame.encounter.EnemyId;
oneBattleGame = await api("/api/game/dialog", { game: oneBattleGame, npcId: oneBattleFixture.npc.id, message: "是" });
assertEqual(oneBattleGame.encounter.EnemyId, oneBattleEnemyId, "NPCEnemy onebattle duplicate YES keeps the existing active encounter");
assert(oneBattleGame.dialog.messages.at(-1)?.text.includes(oneBattleFixture.npc.npcEnemy.alreadyMessage.slice(0, 6)), "NPCEnemy onebattle duplicate YES returns source alreadymsg");
assert(oneBattleGame.dialog.debug.vmTrace.some((event) => event.action === "startBattle" && event.status === "blocked" && event.detail?.reason === "npcenemy-onebattle"), "NPCEnemy onebattle duplicate YES records blocked startBattle VM trace");

const himikoSp = WORLD.maps["1000"]?.npcs.find((npc) => npc.name === "日美子");
const yayoiSp = WORLD.maps["2000"]?.npcs.find((npc) => npc.name === "弥生");
if (!himikoSp || !yayoiSp) throw new Error("missing Himiko/Yayoi source task fixtures");
assert(himikoSp.scriptEvents?.some((event) => event.type === "REQUEST" && /SP=0/.test(event.condition || "")), "Himiko parses source SP-gated request branch");
assert(yayoiSp.scriptEvents?.some((event) => event.type === "REQUEST" && /SP=1/.test(event.condition || "")), "Yayoi parses source SP-gated request branch");

let sourceStopGame = await api("/api/game/new", { name: "source-stopmsg-test" });
sourceStopGame.location = { mapId: "1000", x: himikoSp.x + 1, y: himikoSp.y };
sourceStopGame = await api("/api/game/dialog", { game: sourceStopGame, npcId: himikoSp.id });
assert(sourceStopGame.flags.bits["now:2"], "source REQUEST sets NOWEV before StopMsg flow");
assertEqual(inventoryQty(sourceStopGame, 2415), 1, "source REQUEST gives the item before StopMsg flow");
const sourceStopCharmBefore = Number(sourceStopGame.player.charm || 0);
sourceStopGame = await api("/api/game/dialog", { game: sourceStopGame, npcId: himikoSp.id, message: "取消任务" });
assert(sourceStopGame.dialog.messages.at(-1)?.text.includes("弥生"), "source StopMsg prompt is shown before cancelling an in-progress request");
assert(sourceStopGame.flags.bits["now:2"], "source StopMsg prompt keeps NOWEV until confirmed");
assertEqual(inventoryQty(sourceStopGame, 2415), 1, "source StopMsg prompt keeps the request item until confirmed");
assert(sourceStopGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.reason === "source-changeevent-stop-prompt"), "source StopMsg prompt records source NOWEVENT window");
sourceStopGame = await api("/api/game/dialog", { game: sourceStopGame, npcId: himikoSp.id, message: "确定" });
assert(!testEventFlagSet(sourceStopGame, 2, "now"), "source EndStopMsg clears NOWEV through NPC VM");
assertEqual(inventoryQty(sourceStopGame, 2415), 0, "source EndStopMsg removes the REQUEST GetItem through NPC VM");
assertEqual(sourceStopGame.player.charm, Math.max(0, sourceStopCharmBefore - 1), "source EndStopMsg decreases CHAR_CHARM by one");
assert(sourceStopGame.dialog.messages.at(-1)?.text.includes("再请别人帮忙"), "source EndStopMsg reply is shown after confirmation");
assert(sourceStopGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-endstop-getitem" && event.detail?.itemId === 2415), "source EndStopMsg request-item return runs through NPC VM");
assert(sourceStopGame.dialog.debug.vmTrace.some((event) => event.action === "clearFlag" && event.detail?.reason === "source-changeevent-endstop" && event.detail?.shiftbit === 2), "source EndStopMsg clear NOWEV records clearFlag VM action");
assert(sourceStopGame.dialog.debug.vmTrace.some((event) => event.action === "adjustCharm" && event.detail?.reason === "source-changeevent-endstop" && event.detail?.charmAfter === sourceStopGame.player.charm), "source EndStopMsg charm loss records adjustCharm VM action");
assert(sourceStopGame.world.map.npcs.find((npc) => npc.id === himikoSp.id)?.scriptEventSummary?.actions?.includes("StopMsg"), "client payload exposes compact StopMsg summary");

const mammothBoss = WORLD.maps["1011"]?.npcs.find((npc) => npc.name === "长毛象快递老板" && String(npc.script || "").includes("worksell_1014"));
if (!mammothBoss) throw new Error("missing mammoth delivery boss FREE script fixture");
assert(mammothBoss.scriptEvents?.some((event) => Number(event.addExps || 0) === 16000 && event.getStones?.some((stone) => stone.source === "AddGold")), "mammoth delivery FREE script parses AddExps and AddGold rewards");
let mammothGame = await api("/api/game/new", { name: "source-addexps-free-test" });
mammothGame.location = { mapId: "1011", x: mammothBoss.x + 1, y: mammothBoss.y };
mammothGame.player.level = 10;
mammothGame.player.Lv = 10;
mammothGame.inventory.push({ id: 12879, name: "樱桃酱汁牛排", qty: 1, source: "test mammoth delivery item" });
const mammothExpBefore = Number(mammothGame.player.exp || 0);
const mammothStoneBefore = Number(mammothGame.player.stone || 0);
mammothGame = await api("/api/game/dialog", { game: mammothGame, npcId: mammothBoss.id });
assertEqual(inventoryQty(mammothGame, 12879), 0, "mammoth FREE script consumes the matched delivery item");
assertEqual(mammothGame.player.exp, mammothExpBefore + 16000, "source AddExps grants player EXP through NPC VM");
assertEqual(mammothGame.player.stone, mammothStoneBefore + 2000, "source AddGold grants stone through NPC VM");
assert(/酱汁牛排|精进/.test(mammothGame.dialog.messages.at(-1)?.text || ""), "mammoth FREE script replies with source FreeMsg");
assert(mammothGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-eventaction-addexps" && event.detail?.exp === 16000), "source AddExps records give VM action");
assert(mammothGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-eventaction-addgold" && event.detail?.stone === 2000), "source AddGold records give VM action");
const mammothSummary = mammothGame.world.map.npcs.find((npc) => npc.id === mammothBoss.id)?.scriptEventSummary?.actions || [];
assert(mammothSummary.includes("AddExps") && mammothSummary.includes("AddGold"), "client payload exposes compact AddExps/AddGold summary");

const riderTrainer = WORLD.maps["1040"]?.npcs.find((npc) => npc.name === "驯兽机暴" && String(npc.script || "").includes("eden3/rider.arg"));
if (!riderTrainer) throw new Error("missing rider trainer AddItem fixture");
assert(riderTrainer.scriptEvents?.[0]?.condition.includes("ITEM=20296"), "NOFREE fallback is sorted behind matching TALKEVENT branches");
assert(riderTrainer.scriptEvents?.some((event) => event.getItems?.some((item) => item.id === 20296 && item.scriptAction === "AddItem")), "rider trainer parses source AddItem reward");
let riderGame = await api("/api/game/new", { name: "source-additem-free-test" });
riderGame.location = { mapId: "1040", x: riderTrainer.x + 1, y: riderTrainer.y };
riderGame.player.transmigration = 5;
riderGame.player.Trans = 5;
riderGame.player.trans = 5;
assertEqual(inventoryQty(riderGame, 20296), 0, "rider test starts without riding consent item");
riderGame = await api("/api/game/sync", { game: riderGame });
const riderSummary = riderGame.world.map.npcs.find((npc) => npc.id === riderTrainer.id)?.scriptEventSummary?.actions || [];
assert(riderSummary.includes("AddItem"), "client payload exposes compact AddItem summary before source NPCPOINT relocation");
riderGame = await api("/api/game/dialog", { game: riderGame, npcId: riderTrainer.id });
assertEqual(inventoryQty(riderGame, 20296), 1, "source AddItem grants riding consent item");
assert(riderGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-eventaction-additem" && event.detail?.itemId === 20296), "source AddItem records give VM action");
assert(riderGame.dialog.debug.vmTrace.some((event) => event.action === "moveNpc" && event.detail?.reason === "source-changeevent-npcpoint"), "source AddItem event also runs NPCPOINT relocation through NPC VM");

const battleTutor = WORLD.maps["1000"]?.npcs.find((npc) => npc.name === "战斗技巧指导员");
if (!battleTutor) throw new Error("missing battle tutor source message fixture");
const battleTutorEvent = battleTutor.scriptEvents?.find((event) => event.type === "MESSAGE" && event.messagePages?.normal?.length >= 8);
assert(battleTutorEvent, "battle tutor parses numbered NormalWindowMsg pages from source script");
let battleTutorGame = await api("/api/game/new", { name: "source-numbered-message-test" });
battleTutorGame.location = { mapId: "1000", x: battleTutor.x + 1, y: battleTutor.y };
battleTutorGame = await api("/api/game/dialog", { game: battleTutorGame, npcId: battleTutor.id });
const battleTutorReply = battleTutorGame.dialog.messages.at(-1)?.text || "";
assert(battleTutorReply.includes("要提升自已的等级") && battleTutorReply.includes("四种属性"), "source numbered message pages are joined into the NPC dialogue reply");
const battleTutorPayload = battleTutorGame.world.map.npcs.find((npc) => npc.id === battleTutor.id);
assert(battleTutorPayload?.scriptEventSummary?.actions?.includes("MessagePages"), "client payload exposes compact source numbered-message summary");

const giftCleanNpc = WORLD.maps["1100"]?.npcs.find((npc) => npc.name === "伊芙丽");
if (!giftCleanNpc) throw new Error("missing source CleanFlg fixture");
const giftCleanEvent = giftCleanNpc.scriptEvents?.find((event) => event.type === "CLEAN" && event.cleanFlags?.includes(139));
assert(giftCleanEvent, "gift source script parses TYPE:CLEAN and CleanFlg");
let cleanFlagGame = await api("/api/game/new", { name: "source-cleanflg-test" });
cleanFlagGame.location = { mapId: "1100", x: giftCleanNpc.x + 1, y: giftCleanNpc.y };
setTestEventFlag(cleanFlagGame, 139, "now");
setTestEventFlag(cleanFlagGame, 139, "end");
cleanFlagGame = await api("/api/game/dialog", { game: cleanFlagGame, npcId: giftCleanNpc.id });
assert(!testEventFlagSet(cleanFlagGame, 139, "now"), "source CleanFlg clears NOWEV through NPC VM");
assert(!testEventFlagSet(cleanFlagGame, 139, "end"), "source CleanFlg clears ENDEV through NPC VM");
assert(cleanFlagGame.dialog.messages.at(-1)?.text.includes("分隔两地"), "source CleanFlg reply uses CleanFlgMsg");
assert(cleanFlagGame.dialog.debug.vmTrace.some((event) => event.action === "clearFlag" && event.detail?.reason === "source-changeevent-cleanflag" && event.detail?.shiftbit === 139), "source CleanFlg records clearFlag VM action");
const giftCleanPayload = cleanFlagGame.world.map.npcs.find((npc) => npc.id === giftCleanNpc.id);
assert(giftCleanPayload?.scriptEventSummary?.actions?.includes("CleanFlg"), "client payload exposes compact CleanFlg summary");

const npcWarpFixture = {
  id: "source-npcwarp-fixture",
  name: "源码 NpcWarp 位置测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 40,
  y: 40,
  source: "gmsv-data/npc/my/weilingbei/talimu.arg",
  script: "file:my/weilingbei/talimu.arg",
  scriptEvents: [{
    type: "MESSAGE",
    eventNo: -1,
    condition: "LV>0",
    messages: { normal: "我去下一个碑位看看。" },
    npcWarps: [
      { mapId: "1000", x: 42, y: 40 },
      { mapId: "200", x: 10, y: 10 }
    ]
  }]
};
WORLD.maps["1000"].npcs.push(npcWarpFixture);
let npcWarpGame = await api("/api/game/new", { name: "source-npcwarp-test" });
npcWarpGame.location = { mapId: "1000", x: 39, y: 40 };
npcWarpGame = await api("/api/game/dialog", { game: npcWarpGame, npcId: npcWarpFixture.id });
assertEqual(npcWarpGame.flags.npcPositions[npcWarpFixture.id]?.x, 42, "source NpcWarp records first NPC runtime x");
assertEqual(npcWarpGame.world.map.npcs.find((npc) => npc.id === npcWarpFixture.id)?.x, 42, "source NpcWarp moves NPC in current map payload");
assert(npcWarpGame.dialog.debug.vmTrace.some((event) => event.action === "moveNpc" && event.detail?.reason === "source-changeevent-npcwarp" && event.detail?.target?.x === 42), "source NpcWarp runs through NPC VM moveNpc action");
assert(npcWarpGame.world.map.npcs.find((npc) => npc.id === npcWarpFixture.id)?.scriptEventSummary?.actions?.includes("NpcWarp"), "client payload exposes compact NpcWarp summary");
npcWarpGame.location = { mapId: "1000", x: 42, y: 40 };
npcWarpGame = await api("/api/game/dialog", { game: npcWarpGame, npcId: npcWarpFixture.id });
assertEqual(npcWarpGame.flags.npcPositions[npcWarpFixture.id]?.mapId, "200", "source NpcWarp can move an NPC to another loaded map");
assert(!npcWarpGame.world.map.npcs.some((npc) => npc.id === npcWarpFixture.id), "source NpcWarp hides moved-away NPC from the original map payload");
npcWarpGame.location = { mapId: "200", x: 10, y: 10 };
npcWarpGame = await api("/api/game/dialog", { game: npcWarpGame, npcId: npcWarpFixture.id });
assertEqual(npcWarpGame.flags.npcPositions[npcWarpFixture.id]?.mapId, "1000", "source NpcWarp injected NPC can be talked to on the target map and cycles back");

const npcPointFixture = {
  id: "source-npcpoint-fixture",
  name: "源码 NPCPOINT 位置测试",
  type: "newwarpman",
  template: "npcgen_man",
  x: 43,
  y: 40,
  source: "gmsv-data/npc/eden2/kraken/kraken88_08",
  script: "file:eden2/kraken/kraken88_08",
  scriptEvents: [{
    type: "MESSAGE",
    eventNo: -1,
    condition: "LV>0",
    messages: { normal: "我按 NPCPOINT 去下一个位置。" },
    npcWarps: [
      { mapId: "1000", x: 44, y: 40, sourceAction: "NPCPOINT" },
      { mapId: "200", x: 11, y: 10, sourceAction: "NPCPOINT" }
    ]
  }]
};
WORLD.maps["1000"].npcs.push(npcPointFixture);
let npcPointGame = await api("/api/game/new", { name: "source-npcpoint-test" });
npcPointGame.location = { mapId: "1000", x: 42, y: 40 };
npcPointGame = await api("/api/game/dialog", { game: npcPointGame, npcId: npcPointFixture.id });
assertEqual(npcPointGame.flags.npcPositions[npcPointFixture.id]?.x, 44, "source NPCPOINT records first NPC runtime x");
assert(npcPointGame.dialog.debug.vmTrace.some((event) => event.action === "moveNpc" && event.detail?.reason === "source-changeevent-npcpoint" && event.detail?.target?.x === 44), "source NPCPOINT runs through NPC VM moveNpc action");
assert(npcPointGame.world.map.npcs.find((npc) => npc.id === npcPointFixture.id)?.scriptEventSummary?.actions?.includes("NpcPoint"), "client payload exposes compact NPCPOINT summary");

const sourceCharmNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs || [])
  .find((npc) => (npc.scriptEvents || []).some((event) => event.charms?.includes(1)));
assert(sourceCharmNpc, "world data parses at least one source Charm changeevent branch");
const charmFixture = {
  id: "source-charm-fixture",
  name: "源码 Charm 测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 41,
  y: 40,
  source: "gmsv-data/npc/sainasu/event/event11",
  script: "file:sainasu/event/event11",
  scriptEvents: [{
    type: "MESSAGE",
    eventNo: 111,
    condition: "LV>0",
    messages: { normal: "谢谢你帮忙，名声会变好的。" },
    charms: [1]
  }]
};
WORLD.maps["1000"].npcs.push(charmFixture);
let charmGame = await api("/api/game/new", { name: "source-charm-test" });
charmGame.location = { mapId: "1000", x: 40, y: 40 };
charmGame.player.charm = 99;
charmGame.player.Charm = 99;
charmGame.player.CHARM = 99;
charmGame.player.WorkFixCharm = 99;
charmGame = await api("/api/game/dialog", { game: charmGame, npcId: charmFixture.id });
assertEqual(charmGame.player.charm, 100, "source Charm action caps player CHAR_CHARM at 100");
assertEqual(charmGame.player.WorkFixCharm, 100, "source Charm action syncs WorkFixCharm");
assertEqual(charmGame.characterFields.base.charm, 100, "source Charm action syncs character base charm");
assertEqual(charmGame.characterFields.work.WorkFixCharm, 100, "source Charm action syncs character work charm");
assert(charmGame.save.info.includes("CHARM=100"), "saac-like save info carries source Charm result");
assert(charmGame.dialog.debug.actions.includes("adjustCharm"), "source Charm branch advertises deterministic charm VM action");
assert(charmGame.dialog.debug.vmTrace.some((event) => event.action === "adjustCharm" && event.detail?.reason === "source-changeevent-charm" && event.detail?.charmAfter === 100), "source Charm runs through NPC VM adjustCharm action");
assert(charmGame.world.map.npcs.find((npc) => npc.id === charmFixture.id)?.scriptEventSummary?.actions?.includes("Charm"), "client payload exposes compact Charm summary");

const sourceKeywordNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs || [])
  .find((npc) => (npc.scriptEvents || []).some((event) => event.keyword));
assert(sourceKeywordNpc, "world data parses at least one source KeyWord changeevent branch");
const keywordFixture = {
  id: "source-keyword-fixture",
  name: "源码 KeyWord 测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 42,
  y: 40,
  source: "gmsv-data/npc/jaruga/event/oev_4",
  script: "file:jaruga/event/oev_4",
  scriptEvents: [{
    type: "MESSAGE",
    eventNo: -1,
    condition: "LV>0&ITEM=2555",
    keyword: "20000",
    messages: { normal: "正确答案。" },
    delItems: [{ id: 2555, qty: 1, name: "测试证明石" }],
    getItems: [{ id: 2556, qty: 1, name: "测试下一站证明石" }]
  }]
};
WORLD.maps["1000"].npcs.push(keywordFixture);
let keywordGame = await api("/api/game/new", { name: "source-keyword-test" });
keywordGame.location = { mapId: "1000", x: 41, y: 40 };
keywordGame.inventory.push({ id: 2555, name: "测试证明石", qty: 1, source: "test keyword item" });
keywordGame = await api("/api/game/dialog", { game: keywordGame, npcId: keywordFixture.id });
assertEqual(inventoryQty(keywordGame, 2555), 1, "source KeyWord branch does not mutate on default hi");
assert(keywordGame.dialog.messages.at(-1)?.text.includes("正确的关键词"), "source KeyWord branch asks player to discover the correct keyword");
assert(keywordGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.status === "blocked" && event.detail?.reason === "source-changeevent-keyword"), "source KeyWord mismatch records a blocked VM trace without leaking the keyword");
assert(keywordGame.world.map.npcs.find((npc) => npc.id === keywordFixture.id)?.scriptEventSummary?.actions?.includes("KeyWord"), "client payload exposes compact KeyWord summary");
keywordGame = await api("/api/game/dialog", { game: keywordGame, npcId: keywordFixture.id, message: "20000" });
assertEqual(inventoryQty(keywordGame, 2555), 0, "source KeyWord match consumes the source item");
assertEqual(inventoryQty(keywordGame, 2556), 1, "source KeyWord match gives the source reward item");
assert(keywordGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true), "source KeyWord match opens source event window through VM");
assert(keywordGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-message-delitem" && event.detail?.itemId === 2555), "source KeyWord item take runs through NPC VM");
assert(keywordGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-message-getitem" && event.detail?.itemId === 2556), "source KeyWord item give runs through NPC VM");

const sourceNotDelNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs || [])
  .find((npc) => (npc.scriptEvents || []).some((event) => event.notDelItems?.length && event.delItems?.some((item) => item.evdel)));
assert(sourceNotDelNpc, "world data parses at least one source NotDel + DelItem:EVDEL branch");
const notDelFixture = {
  id: "source-notdel-fixture",
  name: "源码 NotDel 测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 43,
  y: 40,
  source: "gmsv-data/npc/jaruga/event/bait_03a2",
  script: "file:jaruga/event/bait_03a2",
  scriptEvents: [{
    type: "MESSAGE",
    eventNo: -1,
    condition: "LV>0&ITEM=2590*1&ITEM=2594",
    messages: { normal: "保留加工工具，扣掉材料。" },
    notDelItems: [2594],
    delItems: [{ evdel: true, source: "EVDEL" }],
    getItems: [{ id: 2591, qty: 1, name: "测试加工证明" }]
  }]
};
WORLD.maps["1000"].npcs.push(notDelFixture);
let notDelGame = await api("/api/game/new", { name: "source-notdel-test" });
notDelGame.location = { mapId: "1000", x: 42, y: 40 };
notDelGame.inventory.push(
  { id: 2590, name: "测试材料证明", qty: 1, source: "test notdel consumed item" },
  { id: 2594, name: "测试加工工具", qty: 1, source: "test notdel kept item" }
);
notDelGame = await api("/api/game/dialog", { game: notDelGame, npcId: notDelFixture.id });
assertEqual(inventoryQty(notDelGame, 2590), 0, "source DelItem:EVDEL consumes matched EVENT item");
assertEqual(inventoryQty(notDelGame, 2594), 1, "source NotDel keeps matched EVENT item");
assertEqual(inventoryQty(notDelGame, 2591), 1, "source NotDel branch still grants reward item");
assert(notDelGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-message-delitem" && event.detail?.itemId === 2590), "source DelItem:EVDEL take runs through NPC VM");
assert(!notDelGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.itemId === 2594), "source NotDel item is not sent to the NPC VM take action");
const notDelSummary = notDelGame.world.map.npcs.find((npc) => npc.id === notDelFixture.id)?.scriptEventSummary?.actions || [];
assert(notDelSummary.includes("DelItemEVDEL") && notDelSummary.includes("NotDel"), "client payload exposes compact NotDel/EVDEL summary without raw source lines");

assert(readFileSync(path.join(appRoot, "external/sources/ref___data/npc/jaruga/event/kikukuev"), "utf8").includes("Pet_Name:"), "local source data contains a Pet_Name branch fixture");
const petNameFixture = {
  id: "source-pet-name-fixture",
  name: "源码 Pet_Name 测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 44,
  y: 40,
  source: "gmsv-data/npc/jaruga/event/kikukuev",
  script: "file:jaruga/event/kikukuev",
  scriptEvents: [{
    type: "ACCEPT",
    eventNo: -1,
    condition: "LV>0&PET>14-524",
    petName: "加美努",
    messages: { accept: "这是我要找的孩子。" },
    delPets: [{ petId: 524, op: ">", level: 14, qty: 1 }],
    getItems: [{ id: 2451, qty: 1, name: "测试正确名字奖励" }]
  }, {
    type: "ACCEPT",
    eventNo: -1,
    condition: "LV>0&PET>14-524",
    messages: { accept: "这孩子名字不对。" },
    getItems: [{ id: 2455, qty: 1, name: "测试错误名字奖励" }]
  }]
};
WORLD.maps["1000"].npcs.push(petNameFixture);
let petNameGame = await api("/api/game/new", { name: "source-pet-name-wrong-test" });
petNameGame.location = { mapId: "1000", x: 43, y: 40 };
petNameGame.pets.push({ ...petNameGame.pets[0], PetId: 524, Name: "别的加美", Lv: 15, Hp: 10, WorkMaxHp: 10 });
petNameGame = await api("/api/game/dialog", { game: petNameGame, npcId: petNameFixture.id });
assertEqual(inventoryQty(petNameGame, 2451), 0, "source Pet_Name branch does not match a wrong-name pet");
assertEqual(inventoryQty(petNameGame, 2455), 1, "source Pet_Name falls through to the next PET branch when name differs");
assert(petNameGame.pets.some((pet) => Number(pet.PetId) === 524 && pet.Name === "别的加美"), "wrong-name Pet_Name branch does not delete the pet");
let petNameOkGame = await api("/api/game/new", { name: "source-pet-name-ok-test" });
petNameOkGame.location = { mapId: "1000", x: 43, y: 40 };
petNameOkGame.pets.push({ ...petNameOkGame.pets[0], PetId: 524, Name: "加美努", Lv: 15, Hp: 10, WorkMaxHp: 10 });
petNameOkGame = await api("/api/game/dialog", { game: petNameOkGame, npcId: petNameFixture.id });
assertEqual(inventoryQty(petNameOkGame, 2451), 1, "source Pet_Name matches the named pet branch");
assert(!petNameOkGame.pets.some((pet) => Number(pet.PetId) === 524 && pet.Name === "加美努"), "source Pet_Name DelPet removes the named pet through VM");
assert(petNameOkGame.dialog.debug.vmTrace.some((event) => event.action === "takePet" && event.detail?.reason === "source-changeevent-delpet" && event.detail?.petName === "加美努"), "source Pet_Name DelPet carries the required name into NPC VM");
const petNameSummary = petNameOkGame.world.map.npcs.find((npc) => npc.id === petNameFixture.id)?.scriptEventSummary?.actions || [];
assert(petNameSummary.includes("Pet_Name"), "client payload exposes compact Pet_Name summary");

const missionFixture = {
  id: "source-missionover-fixture",
  name: "源码 MISSIONOVER 测试",
  type: "changeevent",
  template: "npcgen_man",
  x: 45,
  y: 40,
  source: "gmsv-data/npc/eden2/kraken/kraken88_01",
  script: "file:eden2/kraken/kraken88_01",
  scriptEvents: [{
    type: "ACCEPT",
    eventNo: 227,
    condition: "HERO_I_NOW=2&ITEM=2895",
    messages: { accept: "水之勇者任务完成。" },
    delItems: [{ id: 2895, qty: 1, name: "测试水精灵证明" }],
    endSetFlags: [227],
    missionOver: 2
  }, {
    type: "CLEAN",
    eventNo: -1,
    condition: "HERO_OVER=2",
    messages: { cleanMain: "勇者任务记录已经清理。" },
    missionClean: 2
  }]
};
WORLD.maps["1000"].npcs.push(missionFixture);
let missionGame = await api("/api/game/new", { name: "source-missionover-test" });
missionGame.location = { mapId: "1000", x: 44, y: 40 };
missionGame.flags.angelMission = {
  mission: 2,
  role: "hero",
  flag: 2,
  status: "DOING",
  hasHeroToken: true
};
missionGame.inventory.push(
  { id: 2885, name: "测试勇者证明", qty: 1, source: "test hero token" },
  { id: 2895, name: "测试水精灵证明", qty: 1, source: "test mission item" }
);
missionGame = await api("/api/game/dialog", { game: missionGame, npcId: missionFixture.id });
assertEqual(inventoryQty(missionGame, 2895), 0, "source MISSIONOVER branch consumes the turn-in item");
assert(missionGame.flags.bits["end:227"], "source MISSIONOVER branch still sets EndSetFlg");
assertEqual(missionGame.flags.angelMission?.flag, 3, "source MISSIONOVER marks the active hero mission complete");
assertEqual(missionGame.player.heroCompleteCount, 1, "source MISSIONOVER increments CHAR_HEROCNT");
assert(missionGame.dialog.debug.vmTrace.some((event) => event.action === "missionOver" && event.detail?.reason === "source-changeevent-missionover" && event.detail?.missionAfter?.status === "HERO_COMPLETE"), "source MISSIONOVER runs through the NPC VM");
const missionSummary = missionGame.world.map.npcs.find((npc) => npc.id === missionFixture.id)?.scriptEventSummary?.actions || [];
assert(missionSummary.includes("MISSIONOVER") && missionSummary.includes("MISSIONCLEAN"), "client payload exposes compact mission action summaries");
missionGame = await api("/api/game/dialog", { game: missionGame, npcId: missionFixture.id });
assertEqual(missionGame.flags.angelMission, null, "source MISSIONCLEAN clears the active angel mission table entry");
assert(missionGame.dialog.debug.vmTrace.some((event) => event.action === "missionClean" && event.detail?.reason === "source-changeevent-missionclean"), "source MISSIONCLEAN runs through the NPC VM");

let flowerShellGame = await api("/api/game/new", { name: "source-task-sp0-test" });
flowerShellGame.location = { mapId: "1000", x: himikoSp.x + 1, y: himikoSp.y };
flowerShellGame = await api("/api/game/dialog", { game: flowerShellGame, npcId: himikoSp.id });
assert(flowerShellGame.flags.bits["now:2"], "Himiko REQUEST sets source NOWEV=2 for SP=0 player");
assertEqual(inventoryQty(flowerShellGame, 2415), 1, "Himiko REQUEST gives source Senia flower");
assert(flowerShellGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-request-getitem" && event.detail?.itemId === 2415), "Himiko REQUEST gives item through NPC VM");
assert(flowerShellGame.progression.sourceTasks.some((task) => task.eventNo === 2 && task.phase === "collect" && task.nextNpcs.some((npc) => npc.name === "弥生")), "source task EventNo 2 points SP=0 player to Yayoi after request");
const flowerTask = flowerShellGame.progression.sourceTasks.find((task) => task.eventNo === 2);
assert(flowerTask?.guidance?.some((line) => line.includes("弥生") && line.includes("floor 2000")), "source task guidance includes target NPC map and floor");
flowerShellGame = await api("/api/game/dialog", { game: flowerShellGame, npcId: himikoSp.id });
assertEqual(inventoryQty(flowerShellGame, 2415), 1, "repeating Himiko while NOWEV=2 does not duplicate request item");
flowerShellGame.location = { mapId: "2000", x: yayoiSp.x + 1, y: yayoiSp.y };
flowerShellGame = await api("/api/game/dialog", { game: flowerShellGame, npcId: yayoiSp.id });
assertEqual(inventoryQty(flowerShellGame, 2415), 0, "Yayoi ACCEPT takes source Senia flower");
assertEqual(inventoryQty(flowerShellGame, 2414), 1, "Yayoi ACCEPT gives source mysterious shell");
assert(flowerShellGame.flags.bits["end:2"], "Yayoi ACCEPT sets source ENDEV=2");
assert(!flowerShellGame.progression.sourceTasks.some((task) => task.eventNo === 2), "source task EventNo 2 disappears after ENDEV=2");

let shellFlowerGame = await api("/api/game/new", { name: "source-task-sp1-test", startPoint: 1 });
shellFlowerGame.location = { mapId: "2000", x: yayoiSp.x + 1, y: yayoiSp.y };
shellFlowerGame = await api("/api/game/dialog", { game: shellFlowerGame, npcId: yayoiSp.id });
assertEqual(shellFlowerGame.player.startPoint, 1, "new player can carry source startpoint SP=1");
assertEqual(shellFlowerGame.player.savePointMask, 2, "SP=1 player carries CHAR_SAVEPOINT bit 1");
assertEqual(inventoryQty(shellFlowerGame, 2414), 1, "Yayoi REQUEST gives source shell to SP=1 player");
assert(shellFlowerGame.progression.sourceTasks.some((task) => task.eventNo === 2 && task.phase === "collect" && task.nextNpcs.some((npc) => npc.name === "日美子")), "source task EventNo 2 points SP=1 player to Himiko");
shellFlowerGame.location = { mapId: "1000", x: himikoSp.x + 1, y: himikoSp.y };
shellFlowerGame = await api("/api/game/dialog", { game: shellFlowerGame, npcId: himikoSp.id });
assertEqual(inventoryQty(shellFlowerGame, 2414), 0, "Himiko ACCEPT takes source mysterious shell");
assertEqual(inventoryQty(shellFlowerGame, 2415), 1, "Himiko ACCEPT gives source Senia flower");
assert(shellFlowerGame.flags.bits["end:2"], "Himiko ACCEPT completes source EventNo 2 for SP=1 path");

const yamyam = WORLD.maps["1400"]?.npcs.find((npc) => npc.name === "亚姆亚姆");
const matiAxe = WORLD.maps["1300"]?.npcs.find((npc) => npc.name === "马提");
if (!yamyam || !matiAxe) throw new Error("missing Yamyam/Mati source task fixtures");
let axeLetterGame = await api("/api/game/new", { name: "source-task-axe-letter-test" });
axeLetterGame.location = { mapId: "1400", x: yamyam.x + 1, y: yamyam.y };
axeLetterGame = await api("/api/game/dialog", { game: axeLetterGame, npcId: yamyam.id });
assert(axeLetterGame.flags.bits["now:3"], "Yamyam REQUEST starts source EventNo 3");
assertEqual(inventoryQty(axeLetterGame, 2416), 1, "Yamyam REQUEST gives source axe");
assert(axeLetterGame.progression.sourceTasks.some((task) => task.eventNo === 3 && task.phase === "turn-in" && task.nextNpcs.some((npc) => npc.name === "马提")), "EventNo 3 source task points to Mati");
axeLetterGame = await api("/api/game/dialog", { game: axeLetterGame, npcId: yamyam.id });
assertEqual(inventoryQty(axeLetterGame, 2416), 1, "repeating Yamyam while NOWEV=3 does not duplicate the axe");
axeLetterGame.location = { mapId: "1300", x: matiAxe.x + 1, y: matiAxe.y };
axeLetterGame = await api("/api/game/dialog", { game: axeLetterGame, npcId: matiAxe.id });
assertEqual(inventoryQty(axeLetterGame, 2416), 0, "Mati ACCEPT takes source axe");
assert(axeLetterGame.flags.bits["end:3"], "Mati ACCEPT completes source EventNo 3");
assert(!axeLetterGame.progression.sourceTasks.some((task) => task.eventNo === 3), "EventNo 3 disappears after ENDEV=3");
axeLetterGame = await api("/api/game/dialog", { game: axeLetterGame, npcId: matiAxe.id });
assert(axeLetterGame.flags.bits["now:5"], "Mati REQUEST starts source EventNo 5 after EventNo 3");
assertEqual(inventoryQty(axeLetterGame, 2423), 1, "Mati REQUEST gives source letter");
assert(axeLetterGame.progression.sourceTasks.some((task) => task.eventNo === 5 && task.phase === "turn-in" && task.nextNpcs.some((npc) => npc.name === "亚姆亚姆")), "EventNo 5 source task points back to Yamyam");
axeLetterGame.location = { mapId: "1400", x: yamyam.x + 1, y: yamyam.y };
axeLetterGame = await api("/api/game/dialog", { game: axeLetterGame, npcId: yamyam.id });
assertEqual(inventoryQty(axeLetterGame, 2423), 0, "Yamyam ACCEPT takes source letter");
assertEqual(inventoryQty(axeLetterGame, 2448), 1, "Yamyam ACCEPT gives source return axe reward");
assert(axeLetterGame.flags.bits["end:5"], "Yamyam ACCEPT completes source EventNo 5");

const sutton = WORLD.maps["1112"]?.npcs.find((npc) => npc.name === "老人萨顿");
if (!sutton) throw new Error("missing Sutton source task fixture");
assert(sutton.scriptEvents?.some((event) => event.type === "MESSAGE" && event.getItems?.some((item) => Number(item.id) === 2431)), "Sutton parses source MESSAGE item recovery branch");
let suttonGame = await api("/api/game/new", { name: "source-task-message-item-test" });
suttonGame.player.level = 16;
suttonGame.location = { mapId: "1112", x: sutton.x + 1, y: sutton.y };
suttonGame = await api("/api/game/dialog", { game: suttonGame, npcId: sutton.id });
assert(suttonGame.flags.bits["now:13"], "Sutton REQUEST starts source EventNo 13");
assertEqual(inventoryQty(suttonGame, 2431), 1, "Sutton REQUEST gives source thief footprints");
suttonGame.inventory = suttonGame.inventory.filter((item) => Number(item.id) !== 2431);
suttonGame = await api("/api/game/dialog", { game: suttonGame, npcId: sutton.id });
assertEqual(inventoryQty(suttonGame, 2431), 1, "Sutton MESSAGE branch reissues lost source thief footprints");
assert(suttonGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-message-getitem" && event.detail?.itemId === 2431), "MESSAGE item branch runs through NPC VM");

const adultJudge = WORLD.maps["10204"]?.npcs.find((npc) => npc.name === "仪式的审判");
const adultMessenger = WORLD.maps["10204"]?.npcs.find((npc) => npc.name === "仪式审判的差使");
const adultGatekeeper = WORLD.maps["10202"]?.npcs.find((npc) => npc.name === "仪的值班者");
if (!adultJudge || !adultMessenger || !adultGatekeeper) throw new Error("missing adult ceremony fixtures");
assertEqual(adultGatekeeper.warp?.target?.mapId, "10204", "adult ceremony gatekeeper parses source WARP target");
assertEqual(adultGatekeeper.warp?.free, "LV>29", "adult ceremony gatekeeper preserves source level gate");
let adultGateGame = await api("/api/game/new", { name: "adult-ceremony-entry-test" });
adultGateGame.location = { mapId: "10202", x: adultGatekeeper.x + 1, y: adultGatekeeper.y };
adultGateGame.player.level = 29;
adultGateGame = await api("/api/game/dialog", { game: adultGateGame, npcId: adultGatekeeper.id, message: "传送" });
assertEqual(adultGateGame.location.mapId, "10202", "adult ceremony gatekeeper blocks players below source LV>29");
assert(adultGateGame.dialog.messages.at(-1)?.text.includes("LV>29"), "blocked adult ceremony gatekeeper explains source level condition");
assert(adultGateGame.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "blocked" && event.detail?.reason === "LV>29"), "blocked adult ceremony gatekeeper records source level gate");
adultGateGame.player.level = 30;
adultGateGame = await api("/api/game/dialog", { game: adultGateGame, npcId: adultGatekeeper.id, message: "传送" });
assertEqual(adultGateGame.location.mapId, "10204", "adult ceremony gatekeeper warps eligible players into source ceremony floor");
assertEqual(adultGateGame.location.x, 2, "adult ceremony gatekeeper preserves source target x");
assertEqual(adultGateGame.location.y, 6, "adult ceremony gatekeeper preserves source target y");
assertEqual(adultGateGame.lastWarp?.kind, "npc-warp", "adult ceremony entry records NPC warp telemetry");
assertEqual(adultGateGame.lastWarp?.to?.mapId, "10204", "adult ceremony entry telemetry records target floor");
assert(adultGateGame.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "ok" && event.detail?.target?.mapId === "10204"), "adult ceremony gatekeeper warp runs through NPC VM");
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
assert(adultGame.progression.sourceTasks.some((task) => task.eventNo === 4 && task.phase === "collect" && task.nextNpcs.some((npc) => npc.name === "仪式审判的差使")), "adult ceremony NOWEV=4 exposes source task collection target");
const adultCollectTask = adultGame.progression.sourceTasks.find((task) => task.eventNo === 4);
assertEqual(adultCollectTask?.sourceCluster, "jaruga/event", "adult ceremony source task stays scoped to jaruga/event scripts");
assert(adultCollectTask?.nextNpcs.every((npc) => String(npc.source || "").includes("jaruga/event")), "adult ceremony collection target does not mix unrelated same-EventNo scripts");
assert(adultCollectTask?.nextNpcs.some((npc) => npc.name === "仪式审判的差使" && npc.gives?.some((label) => label.includes("仪") && label.includes("x15"))), "adult ceremony collection target exposes source item handout summary");
assert(adultCollectTask?.guidance?.some((line) => line.includes("领取/确认") && line.includes("仪") && line.includes("x15")), "adult ceremony guidance explains what to collect from target NPC");
let adultGuideRsp = await api("/api/ai/guide", { game: adultGame, prompt: "任务下一步" });
assert(adultGuideRsp.text.includes("仪式审判的差使"), "AI guide prioritizes active source task collection target");
assert(adultGuideRsp.text.includes("目标 NPC") && /做法|操作|领取\/确认/.test(adultGuideRsp.text), "AI guide explains who to find and how to trigger the task");
assert(/floor\s+10204/.test(adultGuideRsp.text) && adultGuideRsp.text.includes(`(${adultMessenger.x},${adultMessenger.y})`), "AI guide includes source target floor and coordinates");
assert(adultGuideRsp.text.includes("领取/确认：") && adultGuideRsp.text.includes("x15"), "AI guide target line carries source item handout summary");
let adultWorkspaceRsp = await api("/api/ai/workspace", { game: adultGame, prompt: "任务下一步" });
assert(adultWorkspaceRsp.workspace.current.sourceTasks.some((task) => task.eventNo === 4), "AI workspace exposes active source task state");
assert(adultWorkspaceRsp.workspace.current.sourceTasks.some((task) => task.eventNo === 4 && task.guidance?.some((line) => line.includes("目标 NPC"))), "AI workspace keeps deterministic task guidance lines");
adultGame.location = { mapId: "10204", x: adultMessenger.x + 1, y: adultMessenger.y };
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultMessenger.id });
assertEqual(inventoryQty(adultGame, 2417), 15, "adult ceremony messenger gives exactly 15 source ritual jades");
assert(adultGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("给你１５个仪玉")), "adult ceremony messenger uses source thanks text");
assert(adultGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-getitem" && event.detail?.itemId === 2417), "adult ceremony messenger gives item through NPC VM");
assert(adultGame.progression.sourceTasks.some((task) => task.eventNo === 4 && task.phase === "turn-in" && task.requiredItems.some((item) => item.id === 2417 && item.have === 15)), "adult ceremony source task switches to turn-in after ritual jades are collected");
const adultTurnInTask = adultGame.progression.sourceTasks.find((task) => task.eventNo === 4);
assertEqual(adultTurnInTask?.sourceCluster, "jaruga/event", "adult ceremony turn-in source task stays scoped to jaruga/event scripts");
assert(adultTurnInTask?.nextNpcs.some((npc) => npc.name === "仪式的审判" && npc.requires?.some((label) => label.includes("仪") && label.includes("x15"))), "adult ceremony turn-in target exposes source item requirement summary");
assert(adultTurnInTask?.guidance?.some((line) => line.includes("交付内容") && line.includes("仪") && line.includes("x15")), "adult ceremony guidance explains what to turn in to target NPC");
const adultTaskDropGame = JSON.parse(JSON.stringify(adultGame));
adultTaskDropGame.lastBattleOutcome = {
  result: "victory",
  defeatedEnemies: [{ Name: "测试敌人", Lv: 1 }],
  escapedEnemies: [],
  lootItems: [],
  skippedLootItems: [],
  potentialLootItems: [{
    id: 999999,
    name: "测试掉落",
    qty: 1,
    probability: 1,
    rollBase: 1000,
    source: "gmsv-data/enemy/enemy1.txt test ITEM/ITEMPROB"
  }]
};
const adultTaskDropWorkspace = await api("/api/ai/workspace", { game: adultTaskDropGame, prompt: "这个任务道具会掉落吗" });
assert(
  adultTaskDropWorkspace.workspace.current.lastBattle.taskLootText.includes("当前任务需求")
    && adultTaskDropWorkspace.workspace.current.lastBattle.taskLootText.includes("没有出现在")
    && adultTaskDropWorkspace.workspace.current.lastBattle.taskLootText.includes("enemy1.txt"),
  "AI workspace distinguishes source task item requirements from unrelated enemy drop candidates"
);
const adultTaskDropGuide = await api("/api/ai/guide", { game: adultTaskDropGame, prompt: "这个任务道具会掉落吗，为什么没掉" });
assert(
  adultTaskDropGuide.text.includes("当前任务需求")
    && adultTaskDropGuide.text.includes("没有出现在")
    && adultTaskDropGuide.text.includes("目标 NPC"),
  "local guide tells players when source task items are not in the current enemy drop candidates"
);
adultGuideRsp = await api("/api/ai/guide", { game: adultGame, prompt: "任务下一步" });
assert(adultGuideRsp.text.includes("仪式的审判"), "AI guide switches active source task to turn-in target");
assert(adultGuideRsp.text.includes("交付：") && adultGuideRsp.text.includes("x15"), "AI guide target line carries source item turn-in summary");
adultGame.location = { mapId: "10204", x: adultJudge.x + 1, y: adultJudge.y };
adultGame = await api("/api/game/dialog", { game: adultGame, npcId: adultJudge.id });
assertEqual(inventoryQty(adultGame, 2417), 0, "adult ceremony judge removes all ritual jades through source DelItem");
assertEqual(inventoryQty(adultGame, 2418), 1, "adult ceremony judge gives source adult helmet reward");
assert(adultGame.flags.bits["end:4"], "adult ceremony judge sets source ENDEV=4");
assert(!adultGame.progression.sourceTasks.some((task) => task.eventNo === 4), "adult ceremony source task disappears after ENDEV=4");
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

const pkStoneOnlyShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => isStoneOnlyTradePointFixture(npc));
if (!pkStoneOnlyShop) throw new Error("missing stone-only PK shop fixture");
const pkStoneOnlyItem = pkStoneOnlyShop.npc.trade.items.find((item) => Number(item.price || item.cost || 0) > 0);
if (!pkStoneOnlyItem) throw new Error("missing stone-priced PK shop item fixture");
let pkStoneOnlyGame = await api("/api/game/new", { name: "shop-pk-stone-only-test" });
pkStoneOnlyGame.location = { mapId: pkStoneOnlyShop.map.id, x: pkStoneOnlyShop.npc.x + 1, y: pkStoneOnlyShop.npc.y };
pkStoneOnlyGame.player.stone = Number(pkStoneOnlyItem.price || pkStoneOnlyItem.cost || 0) + 456;
pkStoneOnlyGame.player.fame = 0;
pkStoneOnlyGame.player.amPoint = 0;
pkStoneOnlyGame = await api("/api/game/talk", { game: pkStoneOnlyGame, npcId: pkStoneOnlyShop.npc.id });
assert(
  pkStoneOnlyGame.dialog.trade.items.every((item) => Number(item.costPoint || 0) === 0 && item.pointAffordable !== false),
  "Marinas PK merchant hides internal CostPoint and remains stone-priced"
);
assert(!pkStoneOnlyGame.dialog.debug.actions.includes("adjustAmPoint"), "stone-only PK merchant debug omits point deduction action");
const pkStoneOnlySourceBefore = pkStoneOnlyShop.npc.trade.source;
pkStoneOnlyShop.npc.trade.source = `${pkStoneOnlySourceBefore}.arg`;
try {
  let pkStoneOnlyArgSourceGame = await api("/api/game/new", { name: "shop-pk-stone-only-source-suffix-test" });
  pkStoneOnlyArgSourceGame.location = { mapId: pkStoneOnlyShop.map.id, x: pkStoneOnlyShop.npc.x + 1, y: pkStoneOnlyShop.npc.y };
  pkStoneOnlyArgSourceGame.player.stone = Number(pkStoneOnlyItem.price || pkStoneOnlyItem.cost || 0) + 456;
  pkStoneOnlyArgSourceGame.player.amPoint = 0;
  pkStoneOnlyArgSourceGame = await api("/api/game/talk", { game: pkStoneOnlyArgSourceGame, npcId: pkStoneOnlyShop.npc.id });
  assert(
    pkStoneOnlyArgSourceGame.dialog.trade.items.every((item) => Number(item.costPoint || 0) === 0 && item.pointAffordable !== false),
    "stone-only PK merchant stays stone-priced when source path has suffix"
  );
} finally {
  pkStoneOnlyShop.npc.trade.source = pkStoneOnlySourceBefore;
}
pkStoneOnlyGame.dialog.trade.items = pkStoneOnlyGame.dialog.trade.items.map((item) => ({
  ...item,
  costPoint: 10000,
  pointAffordable: false,
  affordable: false
}));
pkStoneOnlyGame = await api("/api/game/sync", { game: pkStoneOnlyGame });
assert(
  pkStoneOnlyGame.dialog.trade.items.every((item) => Number(item.costPoint || 0) === 0 && item.pointAffordable !== false),
  "normalization refreshes open dialog trade state and clears stale CostPoint cache"
);
const pkStoneBefore = pkStoneOnlyGame.player.stone;
pkStoneOnlyGame = await api("/api/game/buy", { game: pkStoneOnlyGame, npcId: pkStoneOnlyShop.npc.id, itemId: pkStoneOnlyItem.id });
assertEqual(pkStoneOnlyGame.player.stone, pkStoneBefore - Number(pkStoneOnlyItem.price || pkStoneOnlyItem.cost || 0), "stone-only PK merchant buy charges only source stone price");
assertEqual(pkStoneOnlyGame.player.amPoint, 0, "stone-only PK merchant buy does not require or deduct points");
assertEqual(inventoryQty(pkStoneOnlyGame, pkStoneOnlyItem.id), 1, "stone-only PK merchant buy gives source item");
assert(pkStoneOnlyGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.costPoint === 0), "stone-only PK merchant VM trace records normalized zero point cost");

const fixedCostShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.trade?.items?.some((item) => (
    Number.isFinite(Number(item.changeItemCost))
    && Number(item.changeItemCost) > 0
    && Number(item.changeItemCost) !== Number(item.sourceCost ?? item.cost ?? 0)
  )));
if (!fixedCostShop) throw new Error("missing ChangeItemCost shop fixture");
const fixedCostItem = fixedCostShop.npc.trade.items.find((item) => (
  Number.isFinite(Number(item.changeItemCost))
  && Number(item.changeItemCost) > 0
  && Number(item.changeItemCost) !== Number(item.sourceCost ?? item.cost ?? 0)
));
let fixedCostGame = await api("/api/game/new", { name: "shop-changeitemcost-test" });
fixedCostGame.location = { mapId: fixedCostShop.map.id, x: fixedCostShop.npc.x + 1, y: fixedCostShop.npc.y };
fixedCostGame.player.stone = Number(fixedCostItem.price) + 123;
fixedCostGame.player.fame = Number(fixedCostItem.costFame || 0);
fixedCostGame = await api("/api/game/buy", { game: fixedCostGame, npcId: fixedCostShop.npc.id, itemId: fixedCostItem.id });
assertEqual(fixedCostGame.player.stone, 123, "shop buy uses source ChangeItemCost instead of itemset6 base cost");
assertEqual(inventoryQty(fixedCostGame, fixedCostItem.id), 1, "ChangeItemCost shop buy still gives the selected source item");
assert(fixedCostGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.action === "buy" && event.detail?.sourcePrice === Number(fixedCostItem.price)), "ChangeItemCost buy records the fixed source price in shop VM trace");

const costFameShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.trade?.items?.some((item) => Number(item.costFame || 0) > 0));
if (!costFameShop) throw new Error("missing CostFame shop fixture");
const costFameItem = costFameShop.npc.trade.items.find((item) => Number(item.costFame || 0) > 0);
let costFameGame = await api("/api/game/new", { name: "shop-costfame-test" });
costFameGame.location = { mapId: costFameShop.map.id, x: costFameShop.npc.x + 1, y: costFameShop.npc.y };
costFameGame.player.stone = Number(costFameItem.price || costFameItem.cost || 0) + 123;
costFameGame.player.fame = Number(costFameItem.costFame) - 1;
await expectApiError(
  "/api/game/buy",
  { game: costFameGame, npcId: costFameShop.npc.id, itemId: costFameItem.id },
  "声望不足",
  "CostFame shop buy rejects insufficient source CHAR_FAME"
);
costFameGame.player.fame = Number(costFameItem.costFame) + 100;
costFameGame = await api("/api/game/buy", { game: costFameGame, npcId: costFameShop.npc.id, itemId: costFameItem.id });
assertEqual(costFameGame.player.stone, 123, "CostFame shop buy still charges source stone price");
assertEqual(costFameGame.player.fame, 100, "CostFame shop buy deducts source CHAR_FAME");
assertEqual(costFameGame.characterFields?.base?.fame, 100, "CostFame buy syncs character fields");
assert(costFameGame.save.info.includes("FAME=100"), "CostFame buy persists CHAR_FAME into save info");
assertEqual(inventoryQty(costFameGame, costFameItem.id), 1, "CostFame shop buy gives the selected source item");
assert(costFameGame.dialog.trade.items.some((item) => Number(item.id) === Number(costFameItem.id) && Number(item.costFame || 0) === Number(costFameItem.costFame)), "CostFame shop dialog exposes source fame requirement");
assert(costFameGame.dialog.debug.actions.includes("adjustFame"), "CostFame shop debug exposes source fame mutation action");
assert(costFameGame.dialog.debug.vmTrace.some((event) => event.action === "adjustFame" && event.detail?.fameAmount === -Number(costFameItem.costFame)), "CostFame shop buy runs fame deduction through NPC VM executor");

const costPointShop = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => !isStoneOnlyTradePointFixture(npc) && npc.trade?.items?.some((item) => Number(item.costPoint || 0) > 0));
if (!costPointShop) throw new Error("missing CostPoint shop fixture");
const costPointItem = costPointShop.npc.trade.items.find((item) => Number(item.costPoint || 0) > 0);
let costPointGame = await api("/api/game/new", { name: "shop-costpoint-test" });
costPointGame.location = { mapId: costPointShop.map.id, x: costPointShop.npc.x + 1, y: costPointShop.npc.y };
costPointGame.player.stone = Number(costPointItem.price || costPointItem.cost || 0) + 77;
costPointGame.player.fame = Number(costPointItem.costFame || 0) + 222;
costPointGame.player.amPoint = Number(costPointItem.costPoint) - 1;
await expectApiError(
  "/api/game/buy",
  { game: costPointGame, npcId: costPointShop.npc.id, itemId: costPointItem.id },
  "点数不足",
  "CostPoint shop buy rejects insufficient source CHAR_AMPOINT"
);
costPointGame.player.amPoint = Number(costPointItem.costPoint) + 333;
costPointGame = await api("/api/game/buy", { game: costPointGame, npcId: costPointShop.npc.id, itemId: costPointItem.id });
assertEqual(costPointGame.player.stone, 77, "CostPoint shop buy still charges source stone price");
assertEqual(costPointGame.player.fame, 222, "CostPoint shop buy keeps deducting paired source CHAR_FAME");
assertEqual(costPointGame.player.amPoint, 333, "CostPoint shop buy deducts source CHAR_AMPOINT");
assertEqual(costPointGame.characterFields?.base?.amPoint, 333, "CostPoint buy syncs character fields");
assert(costPointGame.save.info.includes("AMPOINT=333"), "CostPoint buy persists CHAR_AMPOINT into save info");
assertEqual(inventoryQty(costPointGame, costPointItem.id), 1, "CostPoint shop buy gives the selected source item");
assert(costPointGame.dialog.trade.items.some((item) => Number(item.id) === Number(costPointItem.id) && Number(item.costPoint || 0) === Number(costPointItem.costPoint)), "CostPoint shop dialog exposes source point requirement");
assert(costPointGame.dialog.debug.actions.includes("adjustAmPoint"), "CostPoint shop debug exposes source point mutation action");
assert(costPointGame.dialog.debug.vmTrace.some((event) => event.action === "adjustAmPoint" && event.detail?.amPointAmount === -Number(costPointItem.costPoint)), "CostPoint shop buy runs point deduction through NPC VM executor");

const petSkillNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.petSkillShop?.skillIds?.length);
if (!petSkillNpc) throw new Error("missing pet skill shop fixture");
let petSkillGame = await api("/api/game/new", { name: "pet-skill-shop-test" });
petSkillGame.location = farLocation(petSkillNpc.map, petSkillNpc.npc);
await expectApiError(
  "/api/game/learn-pet-skill",
  { game: petSkillGame, npcId: petSkillNpc.npc.id, skillId: petSkillNpc.npc.petSkillShop.skillIds[0], petIndex: 0, slotIndex: 4 },
  "请先走近",
  "pet skill learning rejects remote NPC window action"
);
petSkillGame.location = { mapId: petSkillNpc.map.id, x: petSkillNpc.npc.x + 1, y: petSkillNpc.npc.y };
petSkillGame.player.stone = 100000;
petSkillGame = await api("/api/game/dialog", { game: petSkillGame, npcId: petSkillNpc.npc.id });
assert(petSkillGame.dialog.petSkillShop?.skills?.length, "pet skill shop dialog exposes source pet_skill list");
assert(petSkillGame.dialog.debug.actions.includes("petSkillShop"), "pet skill shop debug exposes source action profile");
const learnableSkill = petSkillGame.dialog.petSkillShop.skills.find((skill) => !skill.alreadyKnown && Number(skill.cost || 0) > 0);
if (!learnableSkill) throw new Error("missing learnable priced pet skill fixture");
const learnSlot = petSkillGame.dialog.petSkillShop.slots.find((slot) => slot.empty)?.index ?? 4;
const stoneBeforePetSkill = petSkillGame.player.stone;
petSkillGame = await api("/api/game/learn-pet-skill", {
  game: petSkillGame,
  npcId: petSkillNpc.npc.id,
  skillId: learnableSkill.id,
  petIndex: 0,
  slotIndex: learnSlot
});
assertEqual(Number(petSkillGame.pets[0].PetSkillIds[learnSlot]), Number(learnableSkill.id), "pet skill shop writes selected skill id to pet skill slot");
assertEqual(petSkillGame.pets[0].PetSkills[learnSlot]?.Name, learnableSkill.name, "pet skill shop stores compact skill metadata on pet");
assertEqual(petSkillGame.player.stone, stoneBeforePetSkill - Number(learnableSkill.cost || 0), "pet skill shop charges source PETSKILL_COST * skill_rate");
assert(petSkillGame.dialog.petSkillShop.skills.some((skill) => Number(skill.id) === Number(learnableSkill.id) && skill.alreadyKnown), "pet skill shop refreshes known-skill state after teaching");
assert(petSkillGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "pet-skill"), "pet skill shop deducts stone through NPC VM");
assert(petSkillGame.dialog.debug.vmTrace.some((event) => event.action === "petSkillShop" && event.detail?.skillId === learnableSkill.id), "pet skill shop records teach VM event");
let brokePetSkillGame = await api("/api/game/new", { name: "pet-skill-shop-broke-test" });
brokePetSkillGame.location = { mapId: petSkillNpc.map.id, x: petSkillNpc.npc.x + 1, y: petSkillNpc.npc.y };
brokePetSkillGame.player.stone = 0;
await expectApiError(
  "/api/game/learn-pet-skill",
  { game: brokePetSkillGame, npcId: petSkillNpc.npc.id, skillId: learnableSkill.id, petIndex: 0, slotIndex: learnSlot },
  "石币不够",
  "pet skill shop refuses teaching when stone is insufficient"
);

const professionNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.professionShop?.skillIds?.length);
if (professionNpc) {
  let professionGame = await api("/api/game/new", { name: "profession-shop-test" });
  professionGame.location = farLocation(professionNpc.map, professionNpc.npc);
  await expectApiError(
    "/api/game/learn-profession-skill",
    { game: professionGame, npcId: professionNpc.npc.id, skillId: professionNpc.npc.professionShop.skillIds[0] },
    "请先走近",
    "profession shop rejects remote NPC window action"
  );
  professionGame.location = { mapId: professionNpc.map.id, x: professionNpc.npc.x + 1, y: professionNpc.npc.y };
  professionGame.player.stone = 1000000;
  professionGame = await api("/api/game/dialog", { game: professionGame, npcId: professionNpc.npc.id });
  assert(professionGame.dialog.professionShop?.skills?.length, "profession shop dialog exposes source profession_skill list");
  assert(professionGame.dialog.debug.actions.includes("professionShop"), "profession shop debug exposes source action profile");
  const blockedSkill = professionGame.dialog.professionShop.skills[0];
  await expectApiError(
    "/api/game/learn-profession-skill",
    { game: professionGame, npcId: professionNpc.npc.id, skillId: blockedSkill.id },
    "尚未转职",
    "profession shop refuses learning before profession class is set"
  );

  const learnableProfessionSkill = professionGame.dialog.professionShop.skills.find((skill) => Number(skill.professionClass || 0) > 0)
    || professionGame.dialog.professionShop.skills[0];
  const professionClass = Number(learnableProfessionSkill.professionClass || professionNpc.npc.professionShop.classId || 1);
  professionGame.player.professionClass = professionClass === 4
    ? Number(professionNpc.npc.professionShop.classId || 1)
    : professionClass;
  professionGame.player.ProfessionClass = professionGame.player.professionClass;
  professionGame.player.PROFESSION_CLASS = professionGame.player.professionClass;
  professionGame.player.transmigration = Number(professionNpc.npc.professionShop.minTrans || 0);
  professionGame.player.Transmigration = professionGame.player.transmigration;
  professionGame.player.TRANSMIGRATION = professionGame.player.transmigration;
  professionGame.player.professionSkillPoint = 1;
  professionGame.player.ProfessionSkillPoint = 1;
  professionGame.player.PROFESSION_SKILL_POINT = 1;
  professionGame.player.professionSkills = (learnableProfessionSkill.prerequisites || []).map((req) => ({
    id: Number(req.skillId),
    name: req.name || `职业技能 ${Number(req.skillId)}`,
    level: Number(req.percent || 10),
    percent: Number(req.percent || 10)
  }));
  professionGame = await api("/api/game/dialog", { game: professionGame, npcId: professionNpc.npc.id });
  const skillToLearn = professionGame.dialog.professionShop.skills.find((skill) => skill.learnable);
  if (!skillToLearn) throw new Error("missing learnable profession skill fixture after satisfying source conditions");
  const professionStoneBefore = Number(professionGame.player.stone || 0);
  professionGame = await api("/api/game/learn-profession-skill", {
    game: professionGame,
    npcId: professionNpc.npc.id,
    skillId: skillToLearn.id
  });
  assert(professionGame.player.professionSkills.some((skill) => Number(skill.id) === Number(skillToLearn.id)), "profession shop stores learned source skill");
  assertEqual(professionGame.player.professionSkillPoint, 0, "profession shop consumes one profession skill point");
  assertEqual(professionGame.player.stone, professionStoneBefore - Number(skillToLearn.cost || 0), "profession shop charges source PROFESSION_SKILL_COST * skill_rate");
  assert(professionGame.dialog.professionShop.skills.some((skill) => Number(skill.id) === Number(skillToLearn.id) && skill.alreadyKnown), "profession shop refreshes learned state after training");
  assert(professionGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "profession-skill"), "profession shop deducts stone through NPC VM");
  assert(professionGame.dialog.debug.vmTrace.some((event) => event.action === "professionShop" && event.detail?.skillId === skillToLearn.id), "profession shop records learn VM event");
  assert(professionGame.save.info.includes("PROFESSION_SKILL_POINT=0"), "profession shop persists source profession skill point");
  assert(professionGame.save.info.includes("PROFESSION_SKILLS="), "profession shop persists learned profession skills");
} else {
  console.warn("warning: no profession shop NPC fixture in generated WORLD; skipping profession shop runtime check");
}

const itemChangeNpc = Object.values(WORLD.maps)
  .flatMap((map) => map.npcs.map((npc) => ({ map, npc })))
  .find(({ npc }) => npc.itemChange?.recipes?.some(isSimpleItemChangeRecipe));
if (!itemChangeNpc) throw new Error("missing ITEMCHANGE fixture");
const itemChangeRecipe = itemChangeNpc.npc.itemChange.recipes.find(isSimpleItemChangeRecipe);
let itemChangeGame = await api("/api/game/new", { name: "item-change-test" });
itemChangeGame.location = farLocation(itemChangeNpc.map, itemChangeNpc.npc);
await expectApiError(
  "/api/game/change-item",
  { game: itemChangeGame, npcId: itemChangeNpc.npc.id, recipeIndex: itemChangeRecipe.index },
  "请先走近",
  "ITEMCHANGE rejects remote NPC window action"
);
itemChangeGame.location = { mapId: itemChangeNpc.map.id, x: itemChangeNpc.npc.x + 1, y: itemChangeNpc.npc.y };
satisfySourceFlagCondition(itemChangeGame, itemChangeRecipe.free);
itemChangeGame = await api("/api/game/dialog", { game: itemChangeGame, npcId: itemChangeNpc.npc.id });
assert(itemChangeGame.dialog.itemChange?.recipes?.length, "ITEMCHANGE dialog exposes source recipes");
assert(itemChangeGame.dialog.debug.actions.includes("itemChange"), "ITEMCHANGE debug exposes source action profile");
await expectApiError(
  "/api/game/change-item",
  { game: itemChangeGame, npcId: itemChangeNpc.npc.id, recipeIndex: itemChangeRecipe.index },
  "材料不足",
  "ITEMCHANGE refuses missing materials"
);
for (const item of itemChangeRecipe.delItems) {
  itemChangeGame.inventory.push({ ...item, qty: Number(item.qty || 1), source: "test itemchange material" });
}
itemChangeGame.player.stone = Number(itemChangeRecipe.delGold || 0) + 5000;
satisfySourceFlagCondition(itemChangeGame, itemChangeRecipe.free);
const stoneBeforeItemChange = itemChangeGame.player.stone;
const itemChangeResult = itemChangeRecipe.addItems[0];
const consumedMaterial = itemChangeRecipe.delItems.find((item) => !itemChangeRecipe.addItems.some((add) => Number(add.id) === Number(item.id))) || itemChangeRecipe.delItems[0];
itemChangeGame = await api("/api/game/change-item", {
  game: itemChangeGame,
  npcId: itemChangeNpc.npc.id,
  recipeIndex: itemChangeRecipe.index
});
assertEqual(itemChangeGame.player.stone, stoneBeforeItemChange - Number(itemChangeRecipe.delGold || 0), "ITEMCHANGE deducts DelGold through VM");
if (consumedMaterial && !itemChangeRecipe.addItems.some((item) => Number(item.id) === Number(consumedMaterial.id))) {
  assertEqual(inventoryQty(itemChangeGame, consumedMaterial.id), 0, "ITEMCHANGE deducts DelItem material through VM");
}
assert(inventoryQty(itemChangeGame, itemChangeResult.id) >= Number(itemChangeResult.qty || 1), "ITEMCHANGE gives AddItem result through VM");
assert(itemChangeGame.dialog.itemChange?.recipes?.some((recipe) => Number(recipe.index) === Number(itemChangeRecipe.index)), "ITEMCHANGE refreshes dialog recipe state after crafting");
assert(itemChangeGame.dialog.debug.vmTrace.some((event) => event.action === "itemChange" && event.detail?.recipeIndex === itemChangeRecipe.index), "ITEMCHANGE records itemChange VM event");
assert(itemChangeGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "item-change"), "ITEMCHANGE runs take actions through NPC VM");
assert(itemChangeGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "item-change"), "ITEMCHANGE runs give actions through NPC VM");

const discountItem = shopNpc.npc.trade.items.find((item) => Number(item.price || item.cost || 0) > 1);
if (!discountItem) throw new Error("missing priced shop item fixture");
let normalShopDiscountGame = await api("/api/game/new", { name: "normal-shop-discount-no-ai-test" });
normalShopDiscountGame.location = { mapId: shopNpc.map.id, x: shopNpc.npc.x + 1, y: shopNpc.npc.y };
normalShopDiscountGame = await api("/api/game/dialog", { game: normalShopDiscountGame, npcId: shopNpc.npc.id, message: "能不能打折便宜一点" });
assert(!pendingNpcProposal(normalShopDiscountGame), "normal shop discount request does not create proposal without AI mode");
assert(!normalShopDiscountGame.effects?.shopDiscounts?.[shopNpc.npc.id], "normal shop discount request does not mutate discount effect");
let aiShopGame = await api("/api/game/new", { name: "ai-shop-discount-test" });
aiShopGame.location = { mapId: shopNpc.map.id, x: shopNpc.npc.x + 1, y: shopNpc.npc.y };
aiShopGame.player.stone = 10000;
aiShopGame = await api("/api/game/dialog", { game: aiShopGame, npcId: shopNpc.npc.id, message: "AI对话" });
assert(aiShopGame.dialog.suggestions.includes("看看柜台后面"), "AI mode nudges shop exploration without naming exact reward");
aiShopGame = await api("/api/game/dialog", { game: aiShopGame, npcId: shopNpc.npc.id, message: "能不能打折便宜一点" });
assertNpcProposal(aiShopGame, "shopDiscount", "AI shop discount");
assert(!aiShopGame.effects?.shopDiscounts?.[shopNpc.npc.id], "AI shop discount does not apply before confirmation");
aiShopGame = await acceptNpcProposal(aiShopGame, shopNpc.npc.id, "AI shop discount");
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
const sourceWeaponItem = weaponShop.npc.trade.items.find((item) => [0, 1, 2, 3, 4, 17, 18, 19].includes(Number(item.type))) || weaponShop.npc.trade.items[0];
assert(weaponShop.npc.trade.limitItemTypes?.includes("OFFENCE"), "weapon shop keeps source LimitItemType=OFFENCE sell filter");
let sellFilterGame = await api("/api/game/new", { name: "shop-sell-filter-test" });
sellFilterGame.location = { mapId: weaponShop.map.id, x: weaponShop.npc.x + 1, y: weaponShop.npc.y };
sellFilterGame.player.stone = 0;
sellFilterGame.inventory.push({ ...sourceWeaponItem, qty: 1 });
sellFilterGame.inventory.push({ id: 2344, name: "小的肉", qty: 1, cost: 10, price: 10, type: 20 });
sellFilterGame = await api("/api/game/dialog", { game: sellFilterGame, npcId: weaponShop.npc.id });
assert(sellFilterGame.dialog.trade.sellItems.some((item) => Number(item.id) === Number(sourceWeaponItem.id) && item.sellable), "weapon shop accepts source offence item types for selling");
assert(sellFilterGame.dialog.trade.sellItems.some((item) => Number(item.id) === 2344 && !item.sellable && item.reason.includes("不收")), "weapon shop rejects non-offence source item types");
await expectApiError(
  "/api/game/sell",
  { game: sellFilterGame, npcId: weaponShop.npc.id, itemId: 2344 },
  "不能出售",
  "shop sell respects source LimitItemType"
);
const weaponSellPrice = Math.max(1, Math.floor(Number(sourceWeaponItem.price || sourceWeaponItem.cost || 0) * Number(weaponShop.npc.trade.sellRate ?? 0.2)));
sellFilterGame = await api("/api/game/sell", { game: sellFilterGame, npcId: weaponShop.npc.id, itemId: sourceWeaponItem.id });
assertEqual(sellFilterGame.player.stone, weaponSellPrice, "shop sell accepts matching LimitItemType item");

let aiOffMenuGame = await api("/api/game/new", { name: "ai-off-menu-test" });
aiOffMenuGame.location = { mapId: weaponShop.map.id, x: weaponShop.npc.x + 1, y: weaponShop.npc.y };
aiOffMenuGame.player.stone = 10000;
aiOffMenuGame = await api("/api/game/dialog", { game: aiOffMenuGame, npcId: weaponShop.npc.id, message: "AI对话" });
aiOffMenuGame = await api("/api/game/dialog", { game: aiOffMenuGame, npcId: weaponShop.npc.id, message: "有没有平时不卖的斧头" });
assertNpcProposal(aiOffMenuGame, "offMenuItem", "AI off-menu weapon");
assert(!aiOffMenuGame.effects?.offMenuShop?.[weaponShop.npc.id], "AI off-menu request does not add item before confirmation");
aiOffMenuGame = await acceptNpcProposal(aiOffMenuGame, weaponShop.npc.id, "AI off-menu weapon");
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
const specialMeatItem = meatShop.npc.trade.items.find((item) => meatShop.npc.trade.specialItems?.map(Number).includes(Number(item.id)));
if (!specialMeatItem) throw new Error("missing special-rate meat shop fixture");
let specialSellGame = await api("/api/game/new", { name: "shop-special-rate-test" });
specialSellGame.location = { mapId: meatShop.map.id, x: meatShop.npc.x + 1, y: meatShop.npc.y };
specialSellGame.player.stone = 0;
specialSellGame.inventory.push({ ...specialMeatItem, qty: 1 });
specialSellGame = await api("/api/game/dialog", { game: specialSellGame, npcId: meatShop.npc.id });
const specialSellRow = specialSellGame.dialog.trade.sellItems.find((item) => Number(item.id) === Number(specialMeatItem.id));
assertEqual(specialSellRow?.specialSellRate, Number(meatShop.npc.trade.specialRate), "shop dialog exposes source special_rate for special_item");
const specialSellPrice = Math.max(1, Math.floor(Number(specialMeatItem.price || specialMeatItem.cost || 0) * Number(meatShop.npc.trade.specialRate)));
specialSellGame = await api("/api/game/sell", { game: specialSellGame, npcId: meatShop.npc.id, itemId: specialMeatItem.id });
assertEqual(specialSellGame.player.stone, specialSellPrice, "shop sell applies source special_item special_rate");
assert(specialSellGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.specialSellRate === Number(meatShop.npc.trade.specialRate)), "special-rate sell records shop VM trace");

let aiMeatSpecialGame = await api("/api/game/new", { name: "ai-meat-special-source-item-test" });
aiMeatSpecialGame.location = { mapId: meatShop.map.id, x: meatShop.npc.x + 1, y: meatShop.npc.y };
aiMeatSpecialGame.player.stone = 10000;
aiMeatSpecialGame = await api("/api/game/dialog", { game: aiMeatSpecialGame, npcId: meatShop.npc.id, message: "AI对话" });
aiMeatSpecialGame = await api("/api/game/dialog", { game: aiMeatSpecialGame, npcId: meatShop.npc.id, message: "有没有乌力的肉，必须是乌力斯坦的肉" });
assertNpcProposal(aiMeatSpecialGame, "offMenuItem", "AI source meat");
assert(!aiMeatSpecialGame.effects?.offMenuShop?.[meatShop.npc.id], "AI source meat does not add item before confirmation");
aiMeatSpecialGame = await acceptNpcProposal(aiMeatSpecialGame, meatShop.npc.id, "AI source meat");
const sourceMeatOffer = aiMeatSpecialGame.effects?.offMenuShop?.[meatShop.npc.id]?.items?.find((item) => /乌力斯坦的肉/.test(item.name || ""));
assert(sourceMeatOffer, "AI meat shop resolves pet-specific meat from source requirement items");
assert(aiMeatSpecialGame.dialog.trade.items.some((item) => Number(item.id) === Number(sourceMeatOffer.id) && /乌力斯坦的肉/.test(item.name || "") && item.offMenu), "AI meat shop exposes source meat in temporary shop list");
assert(aiMeatSpecialGame.dialog.messages.some((message) => message.speaker === "npc" && /乌力斯坦的肉/.test(message.text || "")), "AI meat shop reply names the resolved source meat");
const sourceMeatBefore = inventoryQty(aiMeatSpecialGame, sourceMeatOffer.id);
aiMeatSpecialGame = await api("/api/game/buy", { game: aiMeatSpecialGame, npcId: meatShop.npc.id, itemId: sourceMeatOffer.id });
assertEqual(inventoryQty(aiMeatSpecialGame, sourceMeatOffer.id), sourceMeatBefore + 1, "AI source meat can be bought through shop VM");

let aiMeatGame = await api("/api/game/new", { name: "ai-meat-knife-reject-test" });
aiMeatGame.location = { mapId: meatShop.map.id, x: meatShop.npc.x + 1, y: meatShop.npc.y };
aiMeatGame = await api("/api/game/dialog", { game: aiMeatGame, npcId: meatShop.npc.id, message: "AI对话" });
aiMeatGame = await api("/api/game/dialog", { game: aiMeatGame, npcId: meatShop.npc.id, message: "能不能给我切肉的刀" });
assert(!aiMeatGame.effects?.offMenuShop?.[meatShop.npc.id], "meat shop rejects role-mismatched knife request");
assert(aiMeatGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("切肉刀")), "meat shop rejection stays in character");

let normalGanzoBribeGame = await api("/api/game/new", { name: "normal-ganzo-bribe-no-ai-test" });
normalGanzoBribeGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
normalGanzoBribeGame.player.stone = 1000;
normalGanzoBribeGame = await api("/api/game/dialog", { game: normalGanzoBribeGame, npcId: ganzo.id, message: "给你石币让我过去" });
assert(!pendingNpcProposal(normalGanzoBribeGame), "normal NPCEnemy bribe request does not create proposal without AI mode");
assert(!normalGanzoBribeGame.flags.npcEnemyDefeats?.[ganzo.id]?.until, "normal NPCEnemy bribe request does not mutate bypass without AI mode");

let ganzoBribeGame = await api("/api/game/new", { name: "ganzo-bribe-test" });
ganzoBribeGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoBribeGame.player.stone = 1000;
ganzoBribeGame = await api("/api/game/dialog", { game: ganzoBribeGame, npcId: ganzo.id, message: "AI对话" });
assert(ganzoBribeGame.dialog.suggestions.includes("试着交涉"), "NPCEnemy AI mode exposes negotiation without naming bribe/threat outcomes");
ganzoBribeGame = await api("/api/game/dialog", { game: ganzoBribeGame, npcId: ganzo.id, message: "给你石币让我过去" });
assertNpcProposal(ganzoBribeGame, "negotiatePass", "NPCEnemy bribe");
assertEqual(ganzoBribeGame.player.stone, 1000, "NPCEnemy bribe does not take stone before confirmation");
assert(!ganzoBribeGame.flags.npcEnemyDefeats[ganzo.id]?.until, "NPCEnemy bribe does not open bypass before confirmation");
ganzoBribeGame = await acceptNpcProposal(ganzoBribeGame, ganzo.id, "NPCEnemy bribe");
assert(ganzoBribeGame.player.stone < 1000, "NPCEnemy bribe takes stone through VM");
assert(ganzoBribeGame.flags.npcEnemyDefeats[ganzo.id]?.until, "NPCEnemy bribe opens temporary bypass");
assert(!ganzoBribeGame.world.map.npcs.some((npc) => npc.id === ganzo.id), "NPCEnemy bribe hides blocker while bypass is active");

let ganzoPoorGame = await api("/api/game/new", { name: "ganzo-bribe-insufficient-stone-test" });
ganzoPoorGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoPoorGame.player.stone = 1;
ganzoPoorGame = await api("/api/game/dialog", { game: ganzoPoorGame, npcId: ganzo.id, message: "AI对话" });
ganzoPoorGame = await api("/api/game/dialog", { game: ganzoPoorGame, npcId: ganzo.id, message: "给你石币让我过去" });
assertNpcProposal(ganzoPoorGame, "negotiatePass", "NPCEnemy poor bribe");
ganzoPoorGame = await acceptNpcProposal(ganzoPoorGame, ganzo.id, "NPCEnemy poor bribe");
assertEqual(ganzoPoorGame.player.stone, 1, "insufficient-stone proposal does not deduct partial stone");
assert(!ganzoPoorGame.flags.npcEnemyDefeats?.[ganzo.id]?.until, "insufficient-stone proposal does not open bypass");
assert(ganzoPoorGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "npc-proposal-preflight-failed" || event.detail?.reason === "npc-proposal-confirm-failed"), "insufficient-stone proposal records blocked confirmation");

let ganzoThreatGame = await api("/api/game/new", { name: "ganzo-threat-test" });
ganzoThreatGame.location = { mapId: "100", x: ganzo.x, y: ganzo.y + 1 };
ganzoThreatGame.player.level = 12;
ganzoThreatGame.player.stone = 1000;
ganzoThreatGame = await api("/api/game/dialog", { game: ganzoThreatGame, npcId: ganzo.id, message: "AI对话" });
ganzoThreatGame = await api("/api/game/dialog", { game: ganzoThreatGame, npcId: ganzo.id, message: "威胁他让我过去" });
assertNpcProposal(ganzoThreatGame, "negotiatePass", "NPCEnemy threat");
assert(!ganzoThreatGame.flags.npcEnemyDefeats[ganzo.id]?.until, "NPCEnemy threat does not open bypass before confirmation");
ganzoThreatGame = await acceptNpcProposal(ganzoThreatGame, ganzo.id, "NPCEnemy threat");
assertEqual(ganzoThreatGame.player.stone, 1000, "strong NPCEnemy threat does not take bribe money");
assert(ganzoThreatGame.flags.npcEnemyDefeats[ganzo.id]?.mode === "threat", "strong NPCEnemy threat opens bypass as threat mode");
assert(Number(ganzoThreatGame.npcSocial?.npcs?.[ganzo.id]?.scores?.threatened || 0) > 0, "accepted threat proposal records threatened social score");
assert(Number(ganzoThreatGame.npcSocial?.npcs?.[ganzo.id]?.scores?.suspicion || 0) > 0, "accepted threat proposal records suspicion social score");

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
npcItemBattleGame.encounter.WorkAttackPower = 1;
npcItemBattleGame.encounter.Attack = 1;
npcItemBattleGame.encounter.Str = 1;
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
selectedItemBattleGame.encounter.WorkAttackPower = 1;
selectedItemBattleGame.encounter.Attack = 1;
selectedItemBattleGame.encounter.Str = 1;
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
petStatusSkillGame.pets[0].Str = 50000;
petStatusSkillGame.pets[0].WorkFixStr = 500;
petStatusSkillGame.pets[0].WorkAttackPower = 500;
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
petMagicStatusGame.player.hp = Math.max(999, Number(petMagicStatusGame.player.hp || 0));
petMagicStatusGame.player.maxHp = Math.max(999, Number(petMagicStatusGame.player.maxHp || 0));
petMagicStatusGame.player.WorkMaxHp = Math.max(999, Number(petMagicStatusGame.player.WorkMaxHp || 0));
petMagicStatusGame.encounter.WorkQuick = 0;
petMagicStatusGame.encounter.WorkFixDex = 0;
petMagicStatusGame.encounter.Hp = Math.max(999, Number(petMagicStatusGame.encounter.Hp || 0));
petMagicStatusGame.encounter.WorkMaxHp = Math.max(999, Number(petMagicStatusGame.encounter.WorkMaxHp || 0));
petMagicStatusGame.encounter.WorkAttackPower = 40;
petMagicStatusGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
petMagicStatusGame = await api("/api/game/battle", { game: petMagicStatusGame, action: "skill:0" });
const magicStatusTelemetry = petMagicStatusGame.battleOutcome.playerAction?.petSkill?.magicStatus;
const activeMagicPetIndex = Math.max(0, Number(petMagicStatusGame.petState?.activeIndex || 0));
const activeMagicPet = petMagicStatusGame.pets?.[activeMagicPetIndex] || petMagicStatusGame.pets?.[0];
assertEqual(petMagicStatusGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SUPERWALL", "magic status pet skill maps to source superwall command");
assertEqual(magicStatusTelemetry?.status?.key, "superWall", "magic status pet skill parses petskill2 option");
assert(magicStatusTelemetry?.success, "magic status pet skill applies to active pet");
assert(Number(activeMagicPet?.BattleMagicStatuses?.superWall?.turns || 0) > 0, "magic status pet skill persists active pet battle magic status");
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
warpNpc.npc.warp.lastTalkElder = 4;
const warpCost = Number(warpNpc.npc.warp.cost.amount || 0);
game = await api("/api/game/dialog", { game, npcId: warpNpc.npc.id, message: "传送" });
assertEqual(game.location.mapId, warpNpc.npc.warp.target.mapId, "warp NPC moves player to target map");
assertEqual(game.location.x, warpNpc.npc.warp.target.x, "warp NPC sets target x");
assertEqual(game.location.y, warpNpc.npc.warp.target.y, "warp NPC sets target y");
assertEqual(game.player.stone, 100 - warpCost, "warp NPC charges level-based stone cost");
assertEqual(game.player.LastTalkElder, 4, "warp NPC applies source SetLastTalkelder to player state");
assertEqual(game.player.CHAR_LASTTALKELDER, 4, "warp NPC keeps source CHAR_LASTTALKELDER alias");
assertEqual(game.characterFields?.work?.CHAR_LASTTALKELDER, 4, "warp NPC syncs SetLastTalkelder into compact character fields");
assert(game.save.info.includes("LASTTALKELDER=4"), "saac-like save info records source LASTTALKELDER");
assert(game.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("启动传送")), "warp NPC replies with travel text");
assert(game.dialog.debug.actions.includes("warp"), "dialog debug profiles warp action");
assert(game.dialog.source.includes(warpNpc.npc.source), "dialog source line includes warp source path");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "warp" && event.status === "ok"), "warp dialog debug includes warp VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setLastTalkElder" && event.detail?.sourceId === 4), "warp dialog debug includes SetLastTalkelder VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "warp"), "warp dialog debug includes setFlag VM trace");
assert(game.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "warp"), "warp dialog debug includes stone take VM trace");
assertEqual(game.lastWarp?.lastTalkElder, 4, "warp NPC transition records source elder id");
assert(game.save.info.includes(`FLOOR=${warpNpc.npc.warp.target.mapId}`), "saac-like save info records warped floor");
assert(game.flags.bits[`end:${stableFlag(`${warpNpc.npc.id}:warp`)}`], "warp action flag set");

let mapWarpGame = await api("/api/game/new", { name: "mapwarp-lasttalkelder-test" });
const mapWarpSource = WORLD.maps[mapWarpGame.location.mapId];
const mapWarpExit = {
  id: "test-lasttalkelder-exit",
  label: "测试记录点出口",
  to: mapWarpSource.id,
  x: mapWarpSource.spawn[0],
  y: mapWarpSource.spawn[1],
  bounds: [mapWarpSource.spawn[0], mapWarpSource.spawn[1], mapWarpSource.spawn[0], mapWarpSource.spawn[1]],
  target: [mapWarpSource.spawn[0], mapWarpSource.spawn[1]],
  source: "test/source-warpman.arg",
  warp: {
    target: { mapId: mapWarpSource.id, x: mapWarpSource.spawn[0], y: mapWarpSource.spawn[1] },
    lastTalkElder: 3,
    source: "test/source-warpman.arg"
  }
};
mapWarpSource.exits.push(mapWarpExit);
try {
  mapWarpGame = await api("/api/game/travel", { game: mapWarpGame, to: mapWarpExit.id });
  assertEqual(mapWarpGame.player.LastTalkElder, 3, "map exit applies source SetLastTalkelder to player state");
  assertEqual(mapWarpGame.characterFields?.work?.CHAR_LASTTALKELDER, 3, "map exit syncs SetLastTalkelder into character fields");
  assert(mapWarpGame.save.info.includes("LASTTALKELDER=3"), "map exit save info records source LASTTALKELDER");
  assert(mapWarpGame.npcVmEvents.some((event) => event.action === "setLastTalkElder" && event.type === "mapwarp" && event.detail?.sourceId === 3), "map exit records SetLastTalkelder VM trace");
  assertEqual(mapWarpGame.lastWarp?.lastTalkElder, 3, "map exit transition records source elder id");
} finally {
  mapWarpSource.exits = mapWarpSource.exits.filter((exit) => exit.id !== mapWarpExit.id);
}

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
petScriptGame.pets.push({ ...petScriptGame.pets[0], PetId: 221, Name: "测试宠物221", Lv: 25, Hp: 10, WorkMaxHp: 10 });
petScriptGame.pets.push({ ...petScriptGame.pets[0], PetId: 222, Name: "测试宠物222", Lv: 25, Hp: 10, WorkMaxHp: 10 });
setTestEventFlag(petScriptGame, 35, "now");
petScriptGame = await api("/api/game/sync", { game: petScriptGame });
petRuntimeNpc = petScriptGame.world.map.npcs.find((npc) => npc.id === petScriptNpc.id);
assert(petRuntimeNpc.scriptStatus.conditions.some((condition) => condition.ok && condition.condition?.groups?.some((group) => group.checks?.some((check) => check.type === "pet"))), "source EVENT condition status supports PET=level-pet-id requirements");
const scriptPetCheck = petRuntimeNpc.scriptStatus.conditions
  .flatMap((condition) => condition.condition?.groups || [])
  .flatMap((group) => group.checks || [])
  .find((check) => check.petId === 221);
assertEqual(scriptPetCheck?.petName, "测试宠物221", "source EVENT PET condition includes resolved party pet name");

const dinoDoctor = WORLD.maps["11006"]?.npcs.find((npc) => npc.name === "恐龙博士哈鲁");
if (!dinoDoctor) throw new Error("missing dinosaur doctor source task fixture");
assert(dinoDoctor.scriptEvents?.some((event) => event.type === "ACCEPT" && event.delPets?.some((pet) => pet.petId === 74 && pet.op === ">" && pet.level === 14)), "dinosaur doctor parses source DelPet PET>level-pet-id condition");
assert(dinoDoctor.scriptEvents?.some((event) => event.type === "ACCEPT" && event.getPets?.some((pet) => pet.enemyIds?.includes(95))), "dinosaur doctor parses source GetPet reward");
assert(dinoDoctor.scriptEvents?.some((event) => event.type === "ACCEPT" && event.getRandItems?.some((spec) => spec.ids?.includes(1350))), "dinosaur doctor parses source GetRandItem reward pool");
let dinoGame = await api("/api/game/new", { name: "source-task-dino-pet-test" });
dinoGame.location = { mapId: "11006", x: dinoDoctor.x + 1, y: dinoDoctor.y };
setTestEventFlag(dinoGame, 15, "now");
dinoGame.pets.push({ ...dinoGame.pets[0], PetId: 74, Name: "未达标鲁尼帖斯", Lv: 14, Hp: 10, WorkMaxHp: 10 });
dinoGame = await api("/api/game/dialog", { game: dinoGame, npcId: dinoDoctor.id });
assert(!dinoGame.flags.bits["end:15"], "dinosaur doctor does not accept PET>14 when the pet is exactly Lv.14");
assert(dinoGame.pets.some((pet) => Number(pet.PetId) === 74), "failed source PET>level condition does not delete the pet");
dinoGame.pets = dinoGame.pets.filter((pet) => Number(pet.PetId) !== 74);
dinoGame.pets.push({ ...dinoGame.pets[0], PetId: 74, Name: "达标鲁尼帖斯", Lv: 15, Hp: 10, WorkMaxHp: 10 });
dinoGame = await api("/api/game/dialog", { game: dinoGame, npcId: dinoDoctor.id });
assert(dinoGame.flags.bits["end:15"], "dinosaur doctor accepts PET>14 when the pet is Lv.15");
assert(!dinoGame.pets.some((pet) => Number(pet.PetId) === 74), "dinosaur doctor deletes the submitted source pet");
assert(dinoGame.dialog.debug.vmTrace.some((event) => event.action === "takePet" && event.detail?.reason === "source-changeevent-delpet" && event.detail?.petId === 74), "source DelPet runs through NPC VM");
assert(dinoGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-getitem" && [1350, 1351, 1352, 1354, 700, 1455, 1102, 1122].includes(Number(event.detail?.itemId))), "source GetRandItem reward runs through NPC VM item give");
setTestEventFlag(dinoGame, 16, "now");
dinoGame.player.level = 16;
dinoGame.pets.push({ ...dinoGame.pets[0], PetId: 191, Name: "贝鲁卡", Lv: 30, Hp: 10, WorkMaxHp: 10 });
const dinoPetCountBeforeReward = dinoGame.pets.length;
dinoGame = await api("/api/game/dialog", { game: dinoGame, npcId: dinoDoctor.id });
assert(dinoGame.flags.bits["end:16"], "dinosaur doctor second source pet task completes with PET>29-191");
assert(!dinoGame.pets.some((pet) => Number(pet.PetId) === 191), "dinosaur doctor removes submitted Beluka source pet");
assertEqual(dinoGame.pets.length, dinoPetCountBeforeReward, "dinosaur doctor removes one pet and gives one source reward pet");
assert(dinoGame.dialog.debug.vmTrace.some((event) => event.action === "givePet" && event.detail?.reason === "source-changeevent-getpet" && event.detail?.givenPets?.some((pet) => pet.enemyId === 95)), "source GetPet reward runs through NPC VM");

const hunterTrialNpc = WORLD.maps["8220"]?.npcs.find((npc) => npc.script === "file:sa70/class/aquest2");
if (!hunterTrialNpc) throw new Error("missing hunter trial NewDelPet fixture");
assert(hunterTrialNpc.scriptEvents?.some((event) => event.delPets?.some((pet) => pet.petId === 97 && pet.op === ">" && pet.level === 0 && pet.sourceAction === "NewDelPet")), "hunter trial parses source NewDelPet PET>level-pet-id condition");
let hunterTrialGame = await api("/api/game/new", { name: "source-newdelpet-hunter-trial-test" });
hunterTrialGame.location = { mapId: "8220", x: hunterTrialNpc.x + 1, y: hunterTrialNpc.y };
hunterTrialGame.inventory.push({ id: 2096, name: "猎人信物一", qty: 1, source: "test" });
hunterTrialGame.pets.push({ ...hunterTrialGame.pets[0], PetId: 97, Name: "测试乌力", Lv: 1, Hp: 10, WorkMaxHp: 10 });
setTestEventFlag(hunterTrialGame, 4, "end");
setTestEventFlag(hunterTrialGame, 147, "now");
hunterTrialGame = await api("/api/game/dialog", { game: hunterTrialGame, npcId: hunterTrialNpc.id });
assertEqual(inventoryQty(hunterTrialGame, 2097), 1, "hunter trial gives next source token after NewDelPet requirement");
assert(!hunterTrialGame.pets.some((pet) => Number(pet.PetId) === 97), "hunter trial removes the submitted NewDelPet source pet");
assert(hunterTrialGame.dialog.debug.vmTrace.some((event) => event.action === "takePet" && event.detail?.reason === "source-eventaction-newdelpet" && event.detail?.sourceAction === "NewDelPet" && event.detail?.petId === 97), "source NewDelPet runs through NPC VM with source action trace");

const tigerTrainer = WORLD.maps["1040"]?.npcs.find((npc) => npc.script === "file:sa60/newbie/m_tiger");
if (!tigerTrainer) throw new Error("missing source AddPet tiger trainer fixture");
assert(tigerTrainer.scriptEvents?.some((event) => event.getPets?.some((pet) => pet.source === "AddPet" && pet.enemyIds?.includes(2483))), "tiger trainer parses source AddPet reward");
assert(tigerTrainer.scriptEvents?.some((event) => event.nowSetFlags?.includes(166)), "tiger trainer parses source Event_Now flag");
let tigerGame = await api("/api/game/new", { name: "source-addpet-tiger-test" });
tigerGame.location = { mapId: "1040", x: tigerTrainer.x + 1, y: tigerTrainer.y };
tigerGame.player.level = 30;
tigerGame.player.CHAR_BASEBASEIMAGENUMBER = 100000;
tigerGame.player.BaseBaseImageNumber = 100000;
setTestEventFlag(tigerGame, 4, "end");
const tigerPetCountBefore = tigerGame.pets.length;
tigerGame = await api("/api/game/dialog", { game: tigerGame, npcId: tigerTrainer.id });
assertEqual(tigerGame.pets.length, tigerPetCountBefore + 1, "source AddPet reward adds one pet through NPC VM");
assert(testEventFlagSet(tigerGame, 166, "now"), "source Event_Now sets NOWEV=166 after AddPet reward");
assert(tigerGame.pets.some((pet) => pet.EventSource === "AddPet"), "source AddPet reward marks the granted event pet");
assert(tigerGame.dialog.debug.vmTrace.some((event) => event.action === "givePet" && event.detail?.reason === "source-eventaction-addpet" && event.detail?.source === "AddPet" && event.detail?.givenPets?.some((pet) => pet.enemyId === 2483)), "source AddPet reward runs through NPC VM");

const commissionNpc = WORLD.maps["1009"]?.npcs.find((npc) => npc.name === "委托管理员" && npc.scriptEvents?.some((event) => event.getStones?.some((stone) => Number(stone.amount) === 350)));
if (!commissionNpc) throw new Error("missing commission source GetStone fixture");
assert(commissionNpc.scriptEvents?.some((event) => event.getStones?.some((stone) => Number(stone.amount) === 350)), "commission manager parses source GetStone reward");
let commissionGame = await api("/api/game/new", { name: "source-script-stone-reward-test" });
commissionGame.location = { mapId: "1009", x: commissionNpc.x + 1, y: commissionNpc.y };
commissionGame.player.stone = 100;
commissionGame.inventory = [
  { id: "stone", name: "石币", qty: 100 },
  { id: 20021, name: "萨村料理委托书Ａ", qty: 1 },
  { id: 12583, name: "硬掉的荷包蛋", qty: 5 }
];
commissionGame = await api("/api/game/dialog", { game: commissionGame, npcId: commissionNpc.id });
assertEqual(inventoryQty(commissionGame, 20021), 0, "source commission consumes commission ticket");
assertEqual(inventoryQty(commissionGame, 12583), 0, "source commission consumes submitted food stack");
assertEqual(commissionGame.player.stone, 450, "source GetStone reward adds stone through NPC VM");
assert(commissionGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "source-changeevent-getstone" && event.detail?.stone === 350), "source GetStone records NPC VM stone give");

const ticketNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.name === "门票贩卖员" && npc.scriptEvents?.some((event) => event.delStones?.some((stone) => stone.expr === "LV*3")));
if (!ticketNpc) throw new Error("missing source DelStone ticket fixture");
assert(ticketNpc.scriptEvents?.some((event) => event.delStones?.some((stone) => stone.expr === "LV*3")), "ticket seller parses source DelStone LV* multiplier");
let ticketGame = await api("/api/game/new", { name: "source-script-stone-cost-test" });
ticketGame.location = { mapId: "1000", x: ticketNpc.x + 1, y: ticketNpc.y };
ticketGame.player.level = 12;
ticketGame.player.stone = 100;
ticketGame.inventory = [
  { id: "stone", name: "石币", qty: 100 },
  ...[2521, 2522, 2523, 2524, 2598, 2599, 2600, 2601, 2602].map((id) => ({ id, name: `旧票${id}`, qty: 1 }))
];
ticketGame = await api("/api/game/dialog", { game: ticketGame, npcId: ticketNpc.id });
assertEqual(ticketGame.player.stone, 64, "source DelStone LV*3 charges player level times multiplier");
assertEqual(inventoryQty(ticketGame, 2597), 1, "ticket seller gives source arena ticket after DelStone payment");
assert(ticketGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-delstone" && event.detail?.qty === 36), "source DelStone records NPC VM stone take");

const petEventWarp = Object.values(WORLD.maps)
  .flatMap((map) => map.exits.map((exit) => ({ map, exit })))
  .find(({ exit }) => exit.warp?.target && WORLD.maps[exit.warp.target.mapId] && String(exit.warp.free || "").includes("PET>0-"));
if (!petEventWarp) throw new Error("missing PET/ENDEV gated mapwarp fixture");
let petEventGame = await api("/api/game/new", { name: "warp-pet-event-gate-test" });
const petEventTile = petEventWarp.exit.tiles?.[0] || { x: petEventWarp.exit.x, y: petEventWarp.exit.y };
petEventGame.location = { mapId: petEventWarp.map.id, x: petEventTile.x, y: petEventTile.y };
const petEventStartMap = petEventGame.location.mapId;
petEventGame.player.level = 30;
petEventGame = await api("/api/game/walk", { game: petEventGame, dx: 0, dy: 0 });
assertEqual(petEventGame.location.mapId, petEventStartMap, "PET/ENDEV gated mapwarp blocks before event bit and pet match");
setTestEventFlag(petEventGame, 4, "end");
petEventGame.pets.push({ ...petEventGame.pets[0], PetId: 962, Name: "条件宠物", Lv: 1, Hp: 10, WorkMaxHp: 10 });
petEventGame = await api("/api/game/walk", { game: petEventGame, dx: 0, dy: 0 });
assertEqual(petEventGame.location.mapId, petEventWarp.exit.warp.target.mapId, "PET/ENDEV gated mapwarp passes after source level, event, and pet conditions are satisfied");

let aiWarpGame = await api("/api/game/new", { name: "ai-warp-test" });
aiWarpGame.location = { mapId: warpNpc.map.id, x: warpNpc.npc.x + 1, y: warpNpc.npc.y };
aiWarpGame.player.level = 1;
aiWarpGame.player.stone = 100;
aiWarpGame = await api("/api/game/dialog", { game: aiWarpGame, npcId: warpNpc.npc.id, message: "AI对话" });
aiWarpGame = await api("/api/game/dialog", { game: aiWarpGame, npcId: warpNpc.npc.id, message: "商量坐车去别的地图" });
assertNpcProposal(aiWarpGame, "warp", "AI negotiated bus/warp");
assertEqual(aiWarpGame.location.mapId, warpNpc.map.id, "AI negotiated bus/warp does not move before confirmation");
aiWarpGame = await acceptNpcProposal(aiWarpGame, warpNpc.npc.id, "AI negotiated bus/warp");
assertEqual(aiWarpGame.location.mapId, warpNpc.npc.warp.target.mapId, "AI negotiated bus/warp still uses source warp target");
assert(aiWarpGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.reason === "npc-proposal-confirmed"), "AI warp negotiation records a confirmed guarded proposal");
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
assertEqual(guideRsp.action.type, "auto-level", "right AI guide can enable client auto leveling");
assertEqual(guideRsp.action.enabled, true, "right AI guide auto leveling action is explicit");
assertEqual(Number(assistGame.pets[0].Exp || 0), beforeGuidePetExp, "right AI guide no longer grants pet exp directly");
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
assert(guideRsp.text.includes(String(Object.keys(WORLD.maps).length)), "right AI guide includes bundled world map count in local context replies");
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
sourceEncounterGame = await api("/api/game/sync", { game: sourceEncounterGame });
const sainasuGate = sourceEncounterGame.world.map.encounterGateSummary.find((gate) => Number(gate.requiredItem?.id) === 1961);
assert(sainasuGate?.missingRequired, "sync exposes source group1 appear item gate before battle");
assertEqual(sainasuGate.available, false, "source group1 appear item gate is marked unavailable without the item");
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
const selectedGroupId = Number((sourceEncounterGame.battle?.source || "").match(/group\s+(\d+)/)?.[1] || 0);
if (selectedGroupId > 0) {
  const selectedGroup = sainasuArea.groups.find((group) => Number(group.groupId || 0) === selectedGroupId);
  if (!selectedGroup) throw new Error(`missing source encounter group fixture ${selectedGroupId}`);
  const selectedEnemyIds = new Set((selectedGroup.enemies || []).map((enemy) => Number(enemy.enemyId || 0)));
  assert(
    sourceEncounterGame.battle.enemyParty.every((enemy) => selectedEnemyIds.has(Number(enemy.EnemyId || 0))),
    "wild encounter party keeps a single source group roll instead of mixing groups"
  );
}
assert(
  sourceEncounterGame.battle?.encounterArea?.groupGates?.some((gate) => Number(gate.requiredItem?.id) === 1961 && gate.missingRequired),
  "battle encounter area preserves source group1 item gate telemetry"
);
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
assert(
  sourceEncounterGame.characterFields.battle.formation.enemySide.every((unit, index) => Number(unit.imgNo || 0) === Number(sourceEncounterGame.battle.enemyParty[index]?.ImgNo || 0) && Number(unit.imgNo || 0) > 0),
  "battle formation enemy units expose source ImgNo for browser sprite rendering"
);
assert(
  sourceEncounterGame.characterFields.battle.formation.allySide.some((unit) => unit.kind === "pet" && Number(unit.imgNo || 0) === Number(sourceEncounterGame.pets[0]?.ImgNo || 0)),
  "battle formation pet unit exposes active pet ImgNo for browser sprite rendering"
);

let sourceEncounterMidLevelGame = await api("/api/game/new", { name: "source-encount-mid-level-window-test" });
sourceEncounterMidLevelGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceEncounterMidLevelGame.player.level = 11;
sourceEncounterMidLevelGame.pets[0].Lv = 11;
sourceEncounterMidLevelGame = await api("/api/game/encounter", { game: sourceEncounterMidLevelGame });
assert(
  sourceEncounterMidLevelGame.battle.enemyParty.every((enemy) => Number(enemy.Lv || 0) <= 3),
  "when no near-level group exists, source encounter fallback avoids extreme outlier buckets"
);

let mixedRangeLowLevelGame = await api("/api/game/new", { name: "mixed-range-low-level-encounter-test" });
mixedRangeLowLevelGame.location = { mapId: "100", x: 440, y: 120, dir: 2 };
mixedRangeLowLevelGame.player.level = 1;
mixedRangeLowLevelGame.pets[0].Lv = 1;
mixedRangeLowLevelGame = await api("/api/game/encounter", { game: mixedRangeLowLevelGame });
assert(
  mixedRangeLowLevelGame.battle.enemyParty.every((enemy) => Number(enemy.Lv || 0) <= 1),
  "mixed source area keeps low-level actors on near-level wild groups"
);

let mixedRangeHighLevelGame = await api("/api/game/new", { name: "mixed-range-high-level-encounter-test" });
mixedRangeHighLevelGame.location = { mapId: "100", x: 440, y: 120, dir: 2 };
mixedRangeHighLevelGame.player.level = 20;
mixedRangeHighLevelGame.pets[0].Lv = 20;
mixedRangeHighLevelGame = await api("/api/game/encounter", { game: mixedRangeHighLevelGame });
assert(
  mixedRangeHighLevelGame.battle.enemyParty.every((enemy) => Number(enemy.Lv || 0) >= 14),
  "mixed source area lets higher-level actors draw the higher nearby wild groups"
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
  WorkFixDex: 0,
  SourceExp: 1,
  Exp: 1
});
workAliasBattleGame.battle.enemyParty = [workAliasBattleGame.encounter];
workAliasBattleGame.battle.activeEnemyIndex = 0;
workAliasBattleGame = await api("/api/game/battle", { game: workAliasBattleGame, action: "攻击" });
assertEqual(workAliasBattleGame.battleOutcome.result, "victory", "battle damage reads source WorkAttackPower/WorkDefencePower aliases");
assert(!workAliasBattleGame.battleOutcome.log.some((line) => line.includes("反击")), "battle turn order reads source WorkQuick alias");

let sourceRandDamageGame = await api("/api/game/new", { name: "source-rand-damage-battle-test" });
sourceRandDamageGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceRandDamageGame = await api("/api/game/encounter", { game: sourceRandDamageGame });
Object.assign(sourceRandDamageGame.player, {
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 900,
  WorkFixDex: 900,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0
});
Object.assign(sourceRandDamageGame.pets[0], {
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 901,
  WorkFixDex: 901,
  Hp: 999,
  WorkMaxHp: 999,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0
});
Object.assign(sourceRandDamageGame.encounter, {
  Hp: 2,
  WorkMaxHp: 2,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkDefencePower: 999,
  WorkFixTough: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0,
  SourceExp: 1,
  Exp: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
sourceRandDamageGame.battle.enemyParty = [sourceRandDamageGame.encounter];
sourceRandDamageGame.battle.activeEnemyIndex = 0;
const originalRandomForSourceDamage = Math.random;
try {
  Math.random = () => 0.75;
  sourceRandDamageGame = await api("/api/game/battle", { game: sourceRandDamageGame, action: "攻击" });
} finally {
  Math.random = originalRandomForSourceDamage;
}
assertEqual(sourceRandDamageGame.battleOutcome.result, "victory", "source RAND(0,1) lets low attack chip high-defence enemies");
assert(
  sourceRandDamageGame.battleOutcome.log.filter((line) => line.includes("造成 1 伤害")).length >= 2,
  "player and active pet both preserve source low-attack 0/1 chip damage"
);

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
assert(
  gatedEncounterGame.world.map.encounterGateSummary.some((gate) => Number(gate.requiredItem?.id) === 1693 && gate.missingRequired),
  "blocked source encounter area still exposes the missing appear item gate"
);
const gatedSourceGroupId = gatedEncounterGame.world.map.encounterGateSummary.find((gate) => Number(gate.requiredItem?.id) === 1693)?.groupId;
assert(gatedSourceGroupId, "blocked source encounter area exposes its source group1 group id");
workspaceRsp = await api("/api/ai/workspace", { game: gatedEncounterGame, prompt: "这里野外条件是什么" });
assert(
  workspaceRsp.workspace.current.location.encounterGateText.includes(`group ${gatedSourceGroupId}`)
    && workspaceRsp.workspace.current.location.encounterGateText.includes("需要"),
  "AI workspace exposes source encounter group item gates as guide text"
);
const gatedGuideRsp = await api("/api/ai/guide", { game: gatedEncounterGame, prompt: "这里野外情况" });
assert(
  gatedGuideRsp.text.includes("源码条件")
    && gatedGuideRsp.text.includes(`group ${gatedSourceGroupId}`)
    && gatedGuideRsp.text.includes("需要"),
  "local AI guide explains source encounter group item gates instead of guessing"
);
const gatedEncounterRefusedRsp = await api("/api/ai/guide", { game: gatedEncounterGame, prompt: "帮我找敌人" });
assertEqual(gatedEncounterRefusedRsp.action.type, "encounter-refused", "AI encounter helper refuses blocked source encounter group");
assert(
  gatedEncounterRefusedRsp.text.includes("条件")
    && gatedEncounterRefusedRsp.text.includes(`group ${gatedSourceGroupId}`)
    && gatedEncounterRefusedRsp.text.includes("需要"),
  "AI encounter refusal includes source item gate details"
);
gatedEncounterGame.inventory.push({ id: 1693, name: "测试用出现道具", qty: 1, source: "test group1 appear item" });
gatedEncounterGame = await api("/api/game/sync", { game: gatedEncounterGame });
assert(
  gatedEncounterGame.world.map.encounterGateSummary.some((gate) => Number(gate.requiredItem?.id) === 1693 && gate.available),
  "held source appear item marks the gated encounter group available"
);
gatedEncounterGame = await api("/api/game/encounter", { game: gatedEncounterGame });
assert(gatedEnemyIds.includes(gatedEncounterGame.encounter.EnemyId), "required item enables source item-gated encounter group");
const villageGirl = WORLD.maps["1100"].npcs.find((npc) => npc.name === "村庄小姑娘" && npc.x === 68 && npc.y === 36);
if (!villageGirl) throw new Error("missing Koao village girl fixture");
let normalVillageGirlGame = await api("/api/game/new", { name: "npc-normal-no-ai-teleport-test" });
normalVillageGirlGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
normalVillageGirlGame = await api("/api/game/dialog", { game: normalVillageGirlGame, npcId: villageGirl.id, message: "帮我瞬移到渔村" });
assertEqual(normalVillageGirlGame.location.mapId, "1100", "normal NPC dialog does not run AI teleport negotiation");
assertEqual(normalVillageGirlGame.dialog.aiMode, false, "AI mode stays off until the user explicitly toggles it");
assert(!normalVillageGirlGame.dialog.suggestions.includes("AI对话"), "normal dialog suggestions do not duplicate the dedicated AI toggle button");
assert(normalVillageGirlGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("请先点对话框里的 AI 按钮")), "normal NPC tells the player to explicitly enable AI for negotiation");
assert(!normalVillageGirlGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "ai-action-proposal"), "normal NPC AI-gated request does not create an AI action proposal");
let villageGirlGame = await api("/api/game/new", { name: "npc-ai-teleport-info-test" });
villageGirlGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
villageGirlGame = await api("/api/game/dialog", { game: villageGirlGame, npcId: villageGirl.id, message: "AI对话" });
villageGirlGame = await api("/api/game/dialog", { game: villageGirlGame, npcId: villageGirl.id, message: "帮我瞬移到渔村" });
assertEqual(villageGirlGame.location.mapId, "1100", "non-transport NPC AI does not teleport out of character");
assert(villageGirlGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("不能直接瞬移")), "non-transport NPC AI explains teleport refusal instead of falling back to map reply");
assertEqual(villageGirlGame.npcSocial?.schema, "stoneage-npc-social-v1", "NPC social memory schema is attached to game saves");
assert(Object.keys(villageGirlGame.npcSocial?.npcs || {}).length <= 32, "NPC social state is capped to 32 NPCs");
assert(villageGirlGame.dialog.debug.persona?.identity?.includes("村庄小姑娘"), "NPC debug exposes inferred persona identity");
assert(villageGirlGame.dialog.debug.persona?.roleFitCapabilities?.length > 0, "NPC persona exposes role-fit capabilities");
assertEqual(villageGirlGame.dialog.debug.persona?.gender?.gameplayEffect, "tone-only", "NPC gender inference is marked tone-only");
assert(villageGirlGame.dialog.debug.social?.memoriesUsed?.length <= 3, "NPC prompt/debug social memory is capped to three memories");
assert(Object.prototype.hasOwnProperty.call(villageGirlGame.dialog.debug.social?.scores || {}, "cooldownUntil"), "NPC social state exposes compact cooldown state");
assert(
  Object.values(villageGirlGame.npcSocial?.npcs || {}).some((entry) => (entry.memories || []).some((memory) => memory.kind === "request")),
  "helpful AI NPC request stores a compact social memory"
);
let challengeSocialGame = await api("/api/game/new", { name: "npc-social-challenge-test" });
challengeSocialGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
challengeSocialGame = await api("/api/game/dialog", { game: challengeSocialGame, npcId: villageGirl.id, message: "AI对话" });
challengeSocialGame = await api("/api/game/dialog", { game: challengeSocialGame, npcId: villageGirl.id, message: "我想挑战你比试一下" });
assert(Number(challengeSocialGame.npcSocial?.npcs?.[villageGirl.id]?.scores?.challenged || 0) > 0, "challenge wording records challenged social score");
assert(Number(challengeSocialGame.npcSocial?.npcs?.[villageGirl.id]?.scores?.suspicion || 0) > 0, "challenge wording records suspicion social score");
const yayoi = WORLD.maps["2000"].npcs.find((npc) => npc.name === "弥生" && npc.script === "file:sainasu/event/event02_1");
if (!yayoi) throw new Error("missing Yayoi fixture");
let yayoiGame = await api("/api/game/new", { name: "npc-ai-source-item-context-test" });
yayoiGame.location = { mapId: "2000", x: yayoi.x, y: yayoi.y + 1 };
yayoiGame = await api("/api/game/dialog", { game: yayoiGame, npcId: yayoi.id, message: "AI对话" });
yayoiGame = await api("/api/game/dialog", { game: yayoiGame, npcId: yayoi.id, message: "什么是2415呢？" });
const yayoiReply = yayoiGame.dialog.messages.at(-1)?.text || "";
assert(yayoiReply.includes("仙尼亚的花"), "NPC AI source item context resolves itemset id 2415 to its item name");
assert(yayoiReply.includes("不可思议的贝壳"), "NPC AI source item context explains the exchange relation");
const katan = WORLD.maps["100"].npcs.find((npc) => npc.name === "卡坦" && npc.script === "file:seimu/event/event02_1");
if (!katan) throw new Error("missing Katan source pet-reference fixture");
let petReferenceGame = await api("/api/game/new", { name: "npc-ai-source-pet-context-test" });
petReferenceGame.location = { mapId: "100", x: katan.x, y: katan.y + 1 };
petReferenceGame = await api("/api/game/dialog", { game: petReferenceGame, npcId: katan.id, message: "AI对话" });
petReferenceGame = await api("/api/game/dialog", { game: petReferenceGame, npcId: katan.id, message: "什么是221呢？" });
const petReferenceReply = petReferenceGame.dialog.messages.at(-1)?.text || "";
assert(petReferenceReply.includes("宠物/敌人模板"), "NPC AI source pet context resolves PET=level-pet-id as pet template context");
assert(petReferenceReply.includes("队伍里有没有这类宠物"), "NPC AI source pet context explains PET condition relation");
let aiCacheGame = await api("/api/game/new", { name: "npc-ai-cache-test" });
aiCacheGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
aiCacheGame = await api("/api/game/dialog", { game: aiCacheGame, npcId: villageGirl.id, message: "AI对话" });
const originalFetch = globalThis.fetch;
let openAiNpcCalls = 0;
globalThis.fetch = async (request, init) => {
  const url = typeof request === "string" ? request : request?.url || "";
  if (String(url).includes("/v1/responses")) {
    openAiNpcCalls += 1;
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        reply: "村子里有长者、商店和通往外面的路；想做任务就先问附近的人。",
        intent: "chat",
        action: { type: "none", text: "", seconds: 0, percent: 0, reason: "" },
        confidence: 0.8
      })
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return originalFetch(request, init);
};
try {
  const openAiEnv = { ...env, OPENAI_API_KEY: "test-openai-key", OPENAI_MODEL: "gpt-cache-test" };
  aiCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiCacheGame, npcId: villageGirl.id, message: "随便聊两句" });
  const firstCacheReply = aiCacheGame.dialog.messages.at(-1)?.text || "";
  assert(firstCacheReply.includes("长者"), "NPC OpenAI fixture returns a grounded village reply");
  aiCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiCacheGame, npcId: villageGirl.id, message: "随便聊两句" });
  assertEqual(openAiNpcCalls, 1, "repeat NPC AI pure chat reuses cache instead of calling OpenAI again");
  assert(aiCacheGame.aiNpcCache?.entries?.length >= 1, "NPC AI cache persists a short-lived entry on the game state");
  assert(aiCacheGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "ai-npc-cache"), "NPC AI cache hit records a VM trace reason");
} finally {
  globalThis.fetch = originalFetch;
}

let aiProposalCacheGame = await api("/api/game/new", { name: "npc-ai-proposal-cache-boundary-test" });
aiProposalCacheGame.location = { mapId: shopNpc.map.id, x: shopNpc.npc.x + 1, y: shopNpc.npc.y };
aiProposalCacheGame = await api("/api/game/dialog", { game: aiProposalCacheGame, npcId: shopNpc.npc.id, message: "AI对话" });
let openAiProposalCalls = 0;
globalThis.fetch = async (request, init) => {
  const url = typeof request === "string" ? request : request?.url || "";
  if (String(url).includes("/v1/responses")) {
    openAiProposalCalls += 1;
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        reply: "店主压低声音：这次可以给你一点折扣，但要先点头确认。",
        intent: "discount",
        action: { type: "shopDiscount", text: "临时折扣", seconds: 600, percent: 12, reason: "merchant flexibility" },
        confidence: 0.83
      })
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return originalFetch(request, init);
};
try {
  const openAiEnv = { ...env, OPENAI_API_KEY: "test-openai-key", OPENAI_MODEL: "gpt-proposal-cache-test" };
  aiProposalCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiProposalCacheGame, npcId: shopNpc.npc.id, message: "今天聊聊柜台安排" });
  assertNpcProposal(aiProposalCacheGame, "shopDiscount", "OpenAI shop discount");
  assert(!aiProposalCacheGame.aiNpcCache?.entries?.length, "OpenAI proposal reply is not cached as pure chat");
  aiProposalCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiProposalCacheGame, npcId: shopNpc.npc.id, message: "今天聊聊柜台安排" });
  assertEqual(openAiProposalCalls, 2, "repeat OpenAI proposal request is not served from pure-chat cache");
} finally {
  globalThis.fetch = originalFetch;
}

let aiMemoryCacheGame = await api("/api/game/new", { name: "npc-ai-memory-cache-boundary-test" });
aiMemoryCacheGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
aiMemoryCacheGame = await api("/api/game/dialog", { game: aiMemoryCacheGame, npcId: villageGirl.id, message: "AI对话" });
let openAiMemoryCalls = 0;
globalThis.fetch = async (request, init) => {
  const url = typeof request === "string" ? request : request?.url || "";
  if (String(url).includes("/v1/responses")) {
    openAiMemoryCalls += 1;
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        reply: "我记住你刚才的请求了，先按附近长者给的线索走。",
        intent: "chat",
        action: { type: "none", text: "", seconds: 0, percent: 0, reason: "" },
        confidence: 0.78
      })
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return originalFetch(request, init);
};
try {
  const openAiEnv = { ...env, OPENAI_API_KEY: "test-openai-key", OPENAI_MODEL: "gpt-memory-cache-test" };
  aiMemoryCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiMemoryCacheGame, npcId: villageGirl.id, message: "谢谢啦" });
  aiMemoryCacheGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiMemoryCacheGame, npcId: villageGirl.id, message: "谢谢啦" });
  assertEqual(openAiMemoryCalls, 2, "memory-writing NPC message is not served from pure-chat cache");
  assert(!aiMemoryCacheGame.aiNpcCache?.entries?.length, "memory-writing NPC reply does not persist a pure-chat cache entry");
  assert(aiMemoryCacheGame.npcSocial?.npcs?.[villageGirl.id]?.memories?.some((memory) => memory.kind === "request"), "memory-writing NPC message stores social memory");
} finally {
  globalThis.fetch = originalFetch;
}
assistGame.location = { mapId: "100", x: 637, y: 493 };
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我找野外敌人开战" });
assistGame = guideRsp.game;
assertEqual(guideRsp.action.type, "encounter", "right AI guide can spawn source encounter");
assert(assistGame.encounter, "right AI guide encounter mutates battle target");
assistGame.encounter.Hp = 1;
assistGame.pets[0].WorkFixStr = 999;
guideRsp = await api("/api/ai/guide", { game: assistGame, prompt: "帮我攻击战斗" });
assert(["battle", "encounter"].includes(guideRsp.action.type), "right AI guide can help with an active battle");

let npcEnemyNewEventGame = await api("/api/game/new", { name: "npcenemy-newevent-fallback-test" });
npcEnemyNewEventGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
npcEnemyNewEventGame.pets[0].WorkFixStr = 9999;
npcEnemyNewEventGame.pets[0].WorkFixDex = 9999;
const newEventEnemy = {
  Name: "NEWEVENT测试敌",
  EnemyId: 1704,
  Lv: 1,
  Hp: 1,
  MaxHp: 1,
  WorkFixStr: 0,
  WorkFixTgh: 0,
  WorkFixDex: 0,
  WorkQuick: 0,
  CaptureRate: 0,
  WhichType: 2
};
const newEventPostBattleEvents = [
  {
    seq: 1,
    condition: "NOWEV=81",
    warps: [{ mapId: "100", floor: 100, x: 640, y: 492 }],
    endMessage: "源码 NOWEV 分支"
  },
  {
    seq: 2,
    condition: "LV>0",
    warps: [{ mapId: "100", floor: 100, x: 641, y: 492 }],
    endMessage: "源码 LV 分支",
    addItems: [{ id: 2054, qty: 1 }],
    heroBattleField: 100,
    endSetFlags: [153],
    nowSetFlags: [154],
    clearFlags: [44]
  }
];
setTestEventFlag(npcEnemyNewEventGame, 44, "now");
setTestEventFlag(npcEnemyNewEventGame, 44, "end");
npcEnemyNewEventGame.encounter = { ...newEventEnemy };
npcEnemyNewEventGame.battle = {
  mode: "command",
  turn: 0,
  log: [],
  enemyParty: [{ ...newEventEnemy }],
  activeEnemyIndex: 0,
  npcEnemy: {
    npcId: "npcenemy-newevent-test",
    npcName: "NEWEVENT守卫",
    source: "external/sources/ref___data/npc/eden1/init/event81_6f.arg",
    dieAct: 1,
    postBattleEvents: newEventPostBattleEvents
  }
};
npcEnemyNewEventGame = await api("/api/game/battle", { game: npcEnemyNewEventGame, action: "攻击" });
assertEqual(npcEnemyNewEventGame.battleOutcome.result, "victory", "NPCEnemy NEWEVENT fixture wins through battle settlement");
assertEqual(npcEnemyNewEventGame.location.x, 641, "NPCEnemy NEWEVENT falls through to the first matching source FREE branch");
assert(npcEnemyNewEventGame.battleOutcome.log.some((line) => line.includes("源码 LV 分支")), "NPCEnemy NEWEVENT victory logs source branch endmsg");
assert(npcEnemyNewEventGame.inventory.some((item) => Number(item.id) === 2054), "NPCEnemy NEWEVENT AddItem grants source reward through VM");
assertEqual(npcEnemyNewEventGame.player.CHAR_WORKHEROFLOOR, 100, "NPCEnemy NEWEVENT herobattlefield updates source work floor");
assertEqual(npcEnemyNewEventGame.player.CHAR_HEROFLOOR, 100, "NPCEnemy NEWEVENT herobattlefield advances best hero floor");
assert(testEventFlagSet(npcEnemyNewEventGame, 153, "end"), "NPCEnemy NEWEVENT Event_End sets ENDEV flag");
assert(testEventFlagSet(npcEnemyNewEventGame, 154, "now"), "NPCEnemy NEWEVENT Event_Now sets NOWEV flag");
assert(!testEventFlagSet(npcEnemyNewEventGame, 44, "now"), "NPCEnemy NEWEVENT EvClr clears NOWEV flag");
assert(!testEventFlagSet(npcEnemyNewEventGame, 44, "end"), "NPCEnemy NEWEVENT EvClr clears ENDEV flag");
assert(npcEnemyNewEventGame.npcVmEvents.some((event) => event.action === "heroBattleField" && event.detail?.reason === "npcenemy-herobattlefield"), "NPCEnemy NEWEVENT herobattlefield runs through deterministic VM");

let npcEnemyNewEventFlagGame = await api("/api/game/new", { name: "npcenemy-newevent-nowev-test" });
npcEnemyNewEventFlagGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
npcEnemyNewEventFlagGame.pets[0].WorkFixStr = 9999;
npcEnemyNewEventFlagGame.pets[0].WorkFixDex = 9999;
setTestEventFlag(npcEnemyNewEventFlagGame, 81, "now");
npcEnemyNewEventFlagGame.encounter = { ...newEventEnemy };
npcEnemyNewEventFlagGame.battle = {
  mode: "command",
  turn: 0,
  log: [],
  enemyParty: [{ ...newEventEnemy }],
  activeEnemyIndex: 0,
  npcEnemy: {
    npcId: "npcenemy-newevent-test",
    npcName: "NEWEVENT守卫",
    source: "external/sources/ref___data/npc/eden1/init/event81_6f.arg",
    dieAct: 1,
    postBattleEvents: newEventPostBattleEvents
  }
};
npcEnemyNewEventFlagGame = await api("/api/game/battle", { game: npcEnemyNewEventFlagGame, action: "攻击" });
assertEqual(npcEnemyNewEventFlagGame.location.x, 640, "NPCEnemy NEWEVENT honors NOWEV source flags before fallback branches");
assert(npcEnemyNewEventFlagGame.battleOutcome.log.some((line) => line.includes("NEWEVENT1")), "NPCEnemy NEWEVENT victory records the selected source branch");

const replacementFixture = Object.entries(WORLD.maps)
  .flatMap(([mapId, map]) => (map.npcs || []).map((npc) => ({ mapId, map, npc })))
  .find(({ npc }) => npc.npcEnemy?.replacementPoints?.some((point) => WORLD.maps[String(point.mapId)]));
assert(replacementFixture, "world data exposes source NPCEnemy REPLACEMENT points");
const replacementTargets = replacementFixture.npc.npcEnemy.replacementPoints.filter((point) => WORLD.maps[String(point.mapId)]);
let npcEnemyReplacementGame = await api("/api/game/new", { name: "npcenemy-replacement-test" });
npcEnemyReplacementGame.location = { mapId: replacementFixture.mapId, x: replacementFixture.npc.x, y: replacementFixture.npc.y + 1, dir: 2 };
npcEnemyReplacementGame.pets[0].WorkFixStr = 9999;
npcEnemyReplacementGame.pets[0].WorkFixDex = 9999;
npcEnemyReplacementGame.encounter = { ...newEventEnemy };
npcEnemyReplacementGame.battle = {
  mode: "command",
  turn: 0,
  log: [],
  enemyParty: [{ ...newEventEnemy }],
  activeEnemyIndex: 0,
  npcEnemy: {
    npcId: replacementFixture.npc.id,
    npcName: replacementFixture.npc.name,
    source: replacementFixture.npc.npcEnemy.source,
    dieAct: 0,
    respawnSeconds: 60,
    replacementPoints: replacementTargets
  }
};
npcEnemyReplacementGame = await api("/api/game/battle", { game: npcEnemyReplacementGame, action: "攻击" });
const replacementPos = npcEnemyReplacementGame.flags.npcPositions?.[replacementFixture.npc.id];
assert(replacementPos, "NPCEnemy REPLACEMENT victory moves source blocker through VM");
assert(replacementTargets.some((point) => (
  String(point.mapId) === String(replacementPos.mapId)
  && Number(point.x) === Number(replacementPos.x)
  && Number(point.y) === Number(replacementPos.y)
)), "NPCEnemy REPLACEMENT selects one source point");
assert(npcEnemyReplacementGame.battleOutcome.log.some((line) => line.includes("REPLACEMENT")), "NPCEnemy REPLACEMENT victory logs source relocation");
assert(npcEnemyReplacementGame.npcVmEvents.some((event) => event.action === "moveNpc" && event.detail?.reason === "npcenemy-replacement"), "NPCEnemy REPLACEMENT runs through deterministic moveNpc VM action");

console.log("NPC actions OK: source-debug dialogue, VM executor guardrails, allowed/unsupported actions, setFlag/clearFlag/give/take/effect/startBattle/battleAction/moveNpc/adjustCharm/missionOver/missionClean/fortune/janken traces, distance-gated talk/window actions, shop buy/sell, pet shop/pet fusion/pet skill shop/profession skill shop training, ITEMCHANGE crafting, healer, LuckyMan fortune, source Janken entry/tie/warp flow, pet/item pool deposit-withdraw, AI healer role-favor aid, source Born savepoint/return point, NPCEnemy prompt/battle/defeat/bribe/NEWEVENT warp/REPLACEMENT relocation, battle start/attack/item/capture/release/guard/wait/pet-switch, deterministic enemy/player escape AI, AI negotiated effects/warp/discount/off-menu items, role-fit shop refusals, bottom assist rest, right AI guide actions, source WARP/NpcWarp/Charm/KeyWord/Pet_Name/StopMsg/AddItem/AddGold/AddExps/MISSIONOVER NPC actions, and source FREE/EVENT item/event/pet gates mutate game/save state.");

function assert(value, label) {
  if (!value) throw new Error(label);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

async function reachableAssistNpcFixture() {
  const baseGame = await api("/api/game/new", { name: "assist-npc-fixture-probe" });
  for (const map of preferredProbeMaps()) {
    const from = mapSpawnLocation(map);
    for (const npc of map.npcs || []) {
      try {
        const route = await api("/api/game/route-npc", {
          game: { ...baseGame, location: from, dialog: null, encounter: null, battle: null },
          npcId: npc.id
        });
        if (!route.blocked && route.target && route.route?.length) {
          return { map, npc, from, route };
        }
      } catch {
        // Keep probing; some source NPCs are intentionally unreachable or gated.
      }
    }
  }
  throw new Error("missing reachable assist NPC route fixture");
}

async function reachableAssistExitFixture() {
  const baseGame = await api("/api/game/new", { name: "assist-exit-fixture-probe" });
  for (const map of preferredProbeMaps()) {
    const from = mapSpawnLocation(map);
    for (const exit of map.exits || []) {
      if (!WORLD.maps[String(exit.to)]) continue;
      try {
        const route = await api("/api/game/route-exit", {
          game: { ...baseGame, location: from, dialog: null, encounter: null, battle: null },
          exitId: exit.id
        });
        if (!route.blocked && route.target && route.route?.length) {
          return { map, exit, from, route };
        }
      } catch {
        // Keep probing; some exits need source flags/items and should stay gated.
      }
    }
  }
  throw new Error("missing reachable assist exit route fixture");
}

function preferredProbeMaps() {
  const ids = [WORLD.startMap, "100", "300", "1100", "2000", "5000", "5001", "10007"];
  const seen = new Set();
  return ids
    .map((id) => WORLD.maps[String(id)])
    .filter((map) => {
      if (!map || seen.has(map.id)) return false;
      seen.add(map.id);
      return true;
    });
}

function mapSpawnLocation(map) {
  return {
    mapId: map.id,
    x: Number(map.spawn?.[0] ?? 0),
    y: Number(map.spawn?.[1] ?? 0),
    dir: 2
  };
}

function paidJumpCostForTest(stepDistance) {
  const steps = Math.max(0, Math.trunc(Number(stepDistance) || 0));
  if (steps <= 0) return 0;
  const first = Math.min(steps, 300);
  const second = Math.min(Math.max(steps - 300, 0), 200);
  const third = Math.max(steps - 500, 0);
  return 2000 + first * 30 + second * 50 + third * 80;
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

async function walkOneReachableStep(game) {
  const start = {
    mapId: String(game.location?.mapId || ""),
    x: Number(game.location?.x || 0),
    y: Number(game.location?.y || 0)
  };
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (const [dx, dy] of dirs) {
    const next = await api("/api/game/walk", { game, dx, dy });
    if (String(next.location?.mapId || "") !== start.mapId) continue;
    if (Number(next.location?.x || 0) !== start.x || Number(next.location?.y || 0) !== start.y) return next;
  }
  throw new Error(`walk encounter fixture cannot move from (${start.x},${start.y}) on map ${start.mapId}`);
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

function sourceLootEncounterFixture() {
  const droppableEnemyIds = sourceEnemyDropIds();
  for (const map of Object.values(WORLD.maps || {})) {
    for (const area of map.encounterAreas || []) {
      const firstAvailableGroup = (area.groups || []).find((group) => (
        group.enemies?.length
        && !group.appearByItemId
        && !group.notAppearByItemId
        && Number(group.weight || 0) > 0
      ));
      const firstEnemy = firstAvailableGroup?.enemies?.find((enemy) => Number(enemy.weight || 0) > 0);
      if (firstEnemy && droppableEnemyIds.has(Number(firstEnemy.enemyId))) {
        return { map, area, group: firstAvailableGroup, enemy: firstEnemy };
      }
    }
  }
  throw new Error("missing source enemy1 drop encounter fixture");
}

function sourceEnemyDropIds() {
  const text = readFileSync(path.join(publicRoot, "data", "enemy1.txt"), "utf8");
  const ids = new Set();
  for (const line of text.split(/\r?\n/)) {
    const rows = line.split(",");
    if (rows.length < 10) continue;
    const offset = Number.isFinite(Number.parseInt(rows[2], 10)) && Number.parseInt(rows[2], 10) > 0 ? 2 : 3;
    const enemyId = Number(rows[offset]);
    if (!Number.isFinite(enemyId) || enemyId <= 0) continue;
    for (let i = 0; i < 10; i += 1) {
      const itemId = Number(rows[offset + 11 + i]) || 0;
      const probability = Number(rows[offset + 21 + i]) || 0;
      if (itemId > 0 && probability > 0) {
        ids.add(enemyId);
        break;
      }
    }
  }
  return ids;
}

function inventoryQty(game, id) {
  return (game.inventory || [])
    .filter((item) => Number(item.id) === Number(id))
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function isSimpleItemChangeRecipe(recipe) {
  if (!recipe?.delItems?.length || !recipe?.addItems?.length) return false;
  if (Number(recipe.delGold || 0) <= 0) return false;
  return !/(?:PET|TRANS|HERO|SP|LV|MANOR|CLASS)\s*(?:!=|>=|<=|>|<|=)/i.test(String(recipe.free || ""));
}

function satisfySourceFlagCondition(game, spec = "") {
  for (const match of String(spec || "").matchAll(/\b(?:ENDEV|ENDEVENT|END)\s*=\s*(\d+)/gi)) {
    setTestEventFlag(game, Number(match[1]), "end");
  }
  for (const match of String(spec || "").matchAll(/\b(?:NOWEV|NOWEVENT|NEV)\s*=\s*(\d+)/gi)) {
    setTestEventFlag(game, Number(match[1]), "now");
  }
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

function testEventFlagSet(game, shiftbit, kind = "end") {
  const field = kind === "now" ? "nowEvents" : "endEvents";
  const index = Math.floor(Number(shiftbit) / 32);
  const bit = Number(shiftbit) % 32;
  const mask = (1 << bit) >>> 0;
  return Boolean(game.flags?.bits?.[`${kind}:${shiftbit}`])
    || Boolean(((game.flags?.[field]?.[index] || 0) >>> 0) & mask);
}

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}
