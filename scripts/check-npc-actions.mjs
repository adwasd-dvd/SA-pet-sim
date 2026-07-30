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

const workerSource = readFileSync(path.join(appRoot, "src/worker.js"), "utf8");
const supportedPetSkillSetSource = workerSource.match(/const BATTLE_PET_SKILL_FUNCS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || "";
const supportedPetSkillFuncs = new Set([...supportedPetSkillSetSource.matchAll(/"([^"]+)"/g)].map((match) => match[1]));
const petSkill2Source = readFileSync(path.join(publicRoot, "data", "petskill2.txt"), "utf8");
const petSkill2Funcs = new Set(petSkill2Source.split(/\r?\n/).map((line) => line.split(",")[2]).filter((func) => /^PETSKILL_/.test(func)));
[
  "PETSKILL_Guardian",
  "PETSKILL_ChargeAttack",
  "PETSKILL_Abduct",
  "PETSKILL_BecomePig",
  "PETSKILL_SelfExplodeAttack",
  "PETSKILL_Steal",
  "PETSKILL_StealMoney",
  "PETSKILL_Lighttakeed",
  "PETSKILL_BecomeFox",
  "PETSKILL_PowerBalance",
  "PETSKILL_WildViolentAttack",
  "PETSKILL_SpeedyAttack",
  "PETSKILL_EarthRound",
  "PETSKILL_DamageToHp",
  "PETSKILL_Modifyattack",
  "PETSKILL_Mdfyattack",
  "PETSKILL_Retrace",
  "PETSKILL_Gyrate",
  "PETSKILL_Deeppoison",
  "PETSKILL_Sars",
  "PETSKILL_Sonic",
  "PETSKILL_Acupuncture",
  "PETSKILL_BattleModel",
  "PETSKILL_BatFly",
  "PETSKILL_DivideAttack",
  "PETSKILL_AntInter",
  "PETSKILL_Barrier",
  "PETSKILL_Nocast",
  "PETSKILL_SetMagicPet",
  "PETSKILL_Vary"
].forEach((func) => {
  assert(supportedPetSkillFuncs.has(func), `${func} battle profile must stay in BattleSupported whitelist`);
});
[
  "PETSKILL_Awaken",
  "PETSKILL_Temptation",
  "PETSKILL_Merge",
  "PETSKILL_Fixitem",
  "PETSKILL_Inslay"
].forEach((func) => {
  assert(petSkill2Funcs.has(func), `${func} must remain grounded in local petskill2 data before it can be classified`);
  assert(!supportedPetSkillFuncs.has(func), `${func} must not enter the battle whitelist without a verified source battle command`);
  assert(workerSource.includes(func) && workerSource.includes("source-boundary"), `${func} unsupported source boundary must stay explicit`);
});

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
  NoDuck: 1,
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
  Luck: 0,
  WorkFixLuck: 0,
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
const originalRandomForEnemyTargetPlayerDefeat = Math.random;
try {
  // Keep this regression deterministic: force a high roll so enemy hit does not
  // get skipped by a lucky dodge branch.
  Math.random = () => 0.9;
  enemyTargetPlayerDefeatGame = await api("/api/game/battle", { game: enemyTargetPlayerDefeatGame, action: "防御" });
} finally {
  Math.random = originalRandomForEnemyTargetPlayerDefeat;
}
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
const originalRandomForPetKo = Math.random;
try {
  Math.random = () => 0.5;
  petKoBattleGame = await api("/api/game/battle", { game: petKoBattleGame, action: "攻击" });
} finally {
  Math.random = originalRandomForPetKo;
}
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

const firstPetShopMap = WORLD.maps["1003"];
const firstPetPoolNpc = firstPetShopMap?.npcs?.find((npc) => npc.id === "1003-12-13-5696");
assert(firstPetPoolNpc?.petShop?.poolEnabled, "first-pet core keeps Samugiru source pet shop pool NPC");
assertEqual(firstPetPoolNpc.petShop.poolCost, 200, "first-pet core pet shop keeps source pool cost");
let firstPetPoolGame = await api("/api/game/new", { name: "first-pet-core-pool-runtime-test" });
firstPetPoolGame.player.stone = 1000;
firstPetPoolGame.location = { mapId: firstPetShopMap.id, x: firstPetPoolNpc.x, y: firstPetPoolNpc.y - 1, dir: 4 };
firstPetPoolGame.pets.push({
  ...firstPetPoolGame.pets[0],
  Name: "核心线寄放乌力",
  PetId: Number(firstPetPoolGame.pets[0].PetId || 100) + 11,
  Lv: 3,
  PetGetLv: 1,
  Hp: 55,
  WorkMaxHp: 55,
  Loyalty: 72,
  Rare: 0
});
const firstPetPoolStoneBefore = Number(firstPetPoolGame.player.stone || 0);
firstPetPoolGame = await api("/api/game/talk", { game: firstPetPoolGame, npcId: firstPetPoolNpc.id });
assert(firstPetPoolGame.dialog?.petShop?.poolEnabled, "first-pet core pet shop dialog exposes source pool metadata");
firstPetPoolGame = await api("/api/game/pool-pet", { game: firstPetPoolGame, npcId: firstPetPoolNpc.id, action: "deposit", petIndex: 1 });
assertEqual(firstPetPoolGame.pets.length, 1, "first-pet core pet shop deposit moves a carried pet into pool");
assertEqual(firstPetPoolGame.petPoolState.used, 1, "first-pet core pet shop deposit fills one pool slot");
assert(Number(firstPetPoolGame.player.stone || 0) < firstPetPoolStoneBefore, "first-pet core pet shop deposit charges source-style stone cost");
assert(firstPetPoolGame.dialog.debug.vmTrace.some((event) => event.action === "petShop" && event.detail?.action === "deposit"), "first-pet core pet shop deposit records VM trace");
firstPetPoolGame = await api("/api/game/pool-pet", { game: firstPetPoolGame, npcId: firstPetPoolNpc.id, action: "withdraw", poolIndex: 0 });
assertEqual(firstPetPoolGame.pets.length, 2, "first-pet core pet shop withdraw restores carried pet");
assertEqual(firstPetPoolGame.petPoolState.used, 0, "first-pet core pet shop withdraw clears pool slot");

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
jankenGame = await api("/api/game/dialog", { game: jankenGame, npcId: jankenTestNpc.id, message: jankenChoices[0] });
assertEqual(inventoryQty(jankenGame, 2347), 0, "Janken entry item is charged exactly once when the first round starts");
assert(jankenGame.dialog?.debug?.vmTrace?.some((event) => event.action === "take" && event.detail?.reason === "source-janken-entry"), "Janken entry charge runs through NPC VM take");
for (const choice of jankenChoices.slice(1)) {
  if (!jankenGame.flags?.pendingJanken) break;
  jankenGame = await api("/api/game/dialog", { game: jankenGame, npcId: jankenTestNpc.id, message: choice });
  if (!jankenGame.flags?.pendingJanken) break;
}
assert(!jankenGame.flags?.pendingJanken, "Janken source runtime eventually resolves win/lose and clears pending state");
assertEqual(inventoryQty(jankenGame, 2347), 0, "Janken entry item is charged exactly once even if the first round ties");
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
  battleLootGame.encounter.NoDuck = 1;
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

const samugiruNurse = WORLD.maps["1005"]?.npcs?.find((npc) => npc.id === "1005-17-13-5702");
if (!samugiruNurse) throw new Error("missing Samugiru hospital nurse fixture");
assertEqual(samugiruNurse.name, "萨姆吉尔的护士", "Samugiru hospital nurse keeps source name");
let samugiruNurseGame = await api("/api/game/new", { name: "samugiru-hospital-nurse-runtime-test" });
samugiruNurseGame.location = { mapId: "1005", x: samugiruNurse.x + 1, y: samugiruNurse.y };
samugiruNurseGame.player.hp = 5;
samugiruNurseGame.pets[0].Hp = 2;
samugiruNurseGame.player.stone = 10000;
const samugiruNurseStoneBefore = samugiruNurseGame.player.stone;
samugiruNurseGame = await api("/api/game/dialog", { game: samugiruNurseGame, npcId: samugiruNurse.id, message: "治疗" });
assertEqual(samugiruNurseGame.player.hp, samugiruNurseGame.player.maxHp, "Samugiru hospital nurse restores player hp");
assertEqual(samugiruNurseGame.pets[0].Hp, samugiruNurseGame.pets[0].WorkMaxHp, "Samugiru hospital nurse restores active pet hp");
assert(samugiruNurseGame.player.stone < samugiruNurseStoneBefore, "Samugiru hospital nurse charges source healing fee");
assertEqual(samugiruNurseGame.dialog.debug.source, samugiruNurse.source, "Samugiru hospital nurse dialog records source");
assertEqual(samugiruNurseGame.dialog.debug.template, samugiruNurse.template, "Samugiru hospital nurse dialog records template");
assert(samugiruNurseGame.dialog.debug.actions.includes("heal"), "Samugiru hospital nurse advertises heal action");
assert(samugiruNurseGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "heal" && event.detail?.executor === "npc-action-vm"), "Samugiru hospital nurse healing fee runs through NPC VM");
assert(samugiruNurseGame.dialog.debug.vmTrace.some((event) => event.action === "heal" && event.status === "ok"), "Samugiru hospital nurse records heal VM trace");
assert(samugiruNurseGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "healer"), "Samugiru hospital nurse records healer flag through NPC VM");

const samugiruDoctor = WORLD.maps["1005"]?.npcs?.find((npc) => npc.id === "1005-11-13-5239");
if (!samugiruDoctor) throw new Error("missing Samugiru hospital doctor fixture");
assertEqual(samugiruDoctor.name, "萨姆吉尔的医生", "Samugiru doctor keeps source name");
const samugiruDoctorRequest = samugiruDoctor.scriptEvents?.find((event) => event.type === "REQUEST" && event.condition === "LV>0&ITEM=1982");
const samugiruDoctorMessage = samugiruDoctor.scriptEvents?.find((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=1983");
assert(samugiruDoctorRequest, "Samugiru doctor keeps source REQUEST branch for item 1982");
assert(samugiruDoctorMessage, "Samugiru doctor keeps source MESSAGE branch for item 1983");
assert(samugiruDoctorRequest.getItems?.some((item) => Number(item.id) === 1983 && item.name === "爱困草"), "Samugiru doctor source REQUEST grants item 1983 爱困草");
let samugiruDoctorGame = await api("/api/game/new", { name: "samugiru-hospital-doctor-runtime-test" });
samugiruDoctorGame.location = { mapId: "1005", x: samugiruDoctor.x + 1, y: samugiruDoctor.y };
samugiruDoctorGame = await api("/api/game/dialog", { game: samugiruDoctorGame, npcId: samugiruDoctor.id });
assert(samugiruDoctorGame.dialog.messages.some((message) => message.speaker === "npc" && /爱困草/.test(message.text)), "Samugiru doctor explains missing source herb requirement");
assertEqual(samugiruDoctorGame.dialog.debug.source, samugiruDoctor.source, "Samugiru doctor dialog records source");
assertEqual(samugiruDoctorGame.dialog.debug.template, samugiruDoctor.template, "Samugiru doctor dialog records template");
assert(samugiruDoctorGame.dialog.debug.actions.includes("quest"), "Samugiru doctor advertises source quest action");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.status === "blocked" && event.detail?.reason === "source-changeevent-no-ready-branch"), "Samugiru doctor missing source herb stays on changeevent block path");
samugiruDoctorGame.inventory.push({ id: 1982, name: "安眠药的药粉", qty: 1 });
samugiruDoctorGame = await api("/api/game/dialog", { game: samugiruDoctorGame, npcId: samugiruDoctor.id });
assertEqual(inventoryQty(samugiruDoctorGame, 1983), 1, "Samugiru doctor source REQUEST gives item 1983 爱困草");
assertEqual(inventoryQty(samugiruDoctorGame, 1982), 1, "Samugiru doctor source REQUEST does not consume item 1982 without a source DelItem branch");
assert(samugiruDoctorGame.dialog.messages.some((message) => message.speaker === "npc" && /那爱困草你就拿去吧/.test(message.text)), "Samugiru doctor uses source thanks text after giving herb");
assert(samugiruDoctorGame.dialog.messages.some((message) => /获得：爱困草 x1/.test(message.text || "")), "Samugiru doctor reports source herb reward");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "REQUEST" && event.detail?.condition === "LV>0&ITEM=1982" && event.status === "ok"), "Samugiru doctor source REQUEST condition is selected by VM");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 1983 && event.detail?.reason === "source-changeevent-request-getitem"), "Samugiru doctor item 1983 grant runs through source changeevent VM");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.status === "ok" && event.detail?.phase === "request"), "Samugiru doctor records source REQUEST quest phase");
samugiruDoctorGame = await api("/api/game/dialog", { game: samugiruDoctorGame, npcId: samugiruDoctor.id });
assert(samugiruDoctorGame.dialog.messages.some((message) => message.speaker === "npc" && /身上有药之后就快点出发吧|昨天是不是喝多了/.test(message.text || "")), "Samugiru doctor follows source MESSAGE branch after item 1983 is present");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=1983" && event.status === "ok"), "Samugiru doctor source MESSAGE condition is selected by VM");
assert(samugiruDoctorGame.dialog.debug.vmTrace.some((event) => event.action === "say" && event.detail?.phase === "message"), "Samugiru doctor MESSAGE branch emits source say VM trace");

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

const firstPetSaveNpc = WORLD.maps["1000"]?.npcs?.find((npc) => npc.id === "1000-94-99-6117");
if (!firstPetSaveNpc) throw new Error("missing first-pet Samugiru savepoint fixture");
assertEqual(firstPetSaveNpc.name, "萨姆吉尔的储存点", "first-pet savepoint keeps source NPC name");
assertEqual(firstPetSaveNpc.savePoint?.id, 4, "first-pet savepoint keeps source save id");
assertEqual(firstPetSaveNpc.savePoint?.born?.mapId, "1000", "first-pet savepoint keeps source Born map");
assertEqual(firstPetSaveNpc.savePoint?.born?.x, 92, "first-pet savepoint keeps source Born x");
assertEqual(firstPetSaveNpc.savePoint?.born?.y, 99, "first-pet savepoint keeps source Born y");
const firstPetSaveReqIds = new Set((firstPetSaveNpc.savePoint?.requiredAlternatives || []).flat().map((item) => Number(item.id)).filter(Boolean));
const firstPetSaveRequirement = firstPetSaveNpc.savePoint?.requiredAlternatives?.[0] || [];
const firstPetSaveItem = firstPetSaveRequirement[0];
assertEqual(Number(firstPetSaveItem?.id || 0), 1930, "first-pet savepoint uses source meat requirement");

let firstPetSaveGame = await api("/api/game/new", { name: "first-pet-samugiru-savepoint-runtime-test" });
firstPetSaveGame.location = { mapId: "1000", x: firstPetSaveNpc.x + 1, y: firstPetSaveNpc.y };
firstPetSaveGame.inventory = (firstPetSaveGame.inventory || []).filter((item) => !firstPetSaveReqIds.has(Number(item.id)));
firstPetSaveGame = await api("/api/game/dialog", { game: firstPetSaveGame, npcId: firstPetSaveNpc.id, message: "记录" });
assert(firstPetSaveGame.savePoint?.npcId !== firstPetSaveNpc.id, "first-pet savepoint does not record without source meat");
assert(firstPetSaveGame.dialog.messages.some((message) => message.speaker === "npc" && /凯比特的肉|需要|来源|原脚本/.test(message.text)), "first-pet savepoint missing meat explains source requirement");
assert(firstPetSaveGame.dialog.debug.vmTrace.some((event) => event.action === "save" && event.status === "blocked" && event.detail?.reason === "source-savepoint-missing-item"), "first-pet savepoint missing meat stays on source block path");

firstPetSaveGame.inventory.push({ ...firstPetSaveItem, qty: 1 });
firstPetSaveGame = await api("/api/game/dialog", { game: firstPetSaveGame, npcId: firstPetSaveNpc.id, message: "记录" });
assert(firstPetSaveGame.flags.pendingSavePoint?.npcId === firstPetSaveNpc.id, "first-pet savepoint asks for confirmation before consuming source meat");
assert(firstPetSaveGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.reason === "source-savepoint-confirm"), "first-pet savepoint confirmation runs through window VM trace");
firstPetSaveGame = await api("/api/game/dialog", { game: firstPetSaveGame, npcId: firstPetSaveNpc.id, message: "确认记录" });
assertEqual(inventoryQty(firstPetSaveGame, firstPetSaveItem.id), 0, "first-pet savepoint consumes source meat only after confirmation");
assertEqual(firstPetSaveGame.savePoint.npcId, firstPetSaveNpc.id, "first-pet savepoint records source NPC id");
assertEqual(firstPetSaveGame.savePoint.sourceId, 4, "first-pet savepoint records source save id");
assertEqual(firstPetSaveGame.savePoint.born.mapId, "1000", "first-pet savepoint records source Born map");
assertEqual(firstPetSaveGame.savePoint.born.x, 92, "first-pet savepoint records source Born x");
assertEqual(firstPetSaveGame.savePoint.born.y, 99, "first-pet savepoint records source Born y");
assertEqual(firstPetSaveGame.save.json.savePoint.npcId, firstPetSaveNpc.id, "first-pet save json records source savepoint");
assert(firstPetSaveGame.save.info.includes("LAST_SAVEPOINT="), "first-pet save info includes last savepoint");
assert(firstPetSaveGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-savepoint-getitem"), "first-pet savepoint meat consumption runs through NPC VM");
assert(firstPetSaveGame.dialog.debug.vmTrace.some((event) => event.action === "save" && event.status === "ok"), "first-pet savepoint records through save VM trace");
assert(firstPetSaveGame.dialog.debug.vmTrace.some((event) => event.action === "setFlag" && event.detail?.reason === "savepoint"), "first-pet savepoint records setFlag VM trace");
assert(firstPetSaveGame.flags.bits[`end:${stableFlag(`${firstPetSaveNpc.id}:savepoint`)}`], "first-pet savepoint end flag set");
firstPetSaveGame.location = { mapId: "300", x: 274, y: 403, dir: 4 };
firstPetSaveGame = await api("/api/game/return-savepoint", { game: firstPetSaveGame });
assertEqual(firstPetSaveGame.location.mapId, "1000", "first-pet return point uses source Born map after NPC record");
assertEqual(firstPetSaveGame.location.x, 92, "first-pet return point uses source Born x after NPC record");
assertEqual(firstPetSaveGame.location.y, 99, "first-pet return point uses source Born y after NPC record");
assertEqual(firstPetSaveGame.returnPoint.kind, "savepoint", "first-pet return point reports source savepoint after NPC record");

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

const samugiruServiceShops = [
  { mapId: "1001", npcId: "1001-17-13-5693", name: "萨姆吉尔的武器店", itemId: 4 },
  { mapId: "1001", npcId: "1001-17-15-5694", name: "萨姆吉尔的防具店", itemId: 800 },
  { mapId: "1002", npcId: "1002-18-15-5695", name: "萨姆吉尔的道具店", itemId: 1250 },
  { mapId: "1004", npcId: "1004-17-13-5701", name: "萨姆吉尔的肉店", itemId: 2344 },
  { mapId: "1005", npcId: "1005-14-14-5703", name: "萨姆吉尔的药剂师", itemId: 1500 }
];
for (const spec of samugiruServiceShops) {
  const map = WORLD.maps[spec.mapId];
  const npc = map?.npcs?.find((entry) => entry.id === spec.npcId);
  if (!npc) throw new Error(`missing Samugiru service shop fixture ${spec.npcId}`);
  assertEqual(npc.name, spec.name, `${spec.name} keeps source NPC name`);
  const item = npc.trade?.items?.find((entry) => Number(entry.id) === Number(spec.itemId));
  if (!item) throw new Error(`missing Samugiru service shop item ${spec.itemId}`);
  const price = Number(item.price || item.cost || 0);
  assert(price > 0, `${spec.name} source item has a positive price`);

  let samugiruShopGame = await api("/api/game/new", { name: `samugiru-service-shop-${spec.itemId}-runtime-test` });
  samugiruShopGame.location = { mapId: spec.mapId, x: npc.x + 1, y: npc.y };
  samugiruShopGame.player.stone = price + 1000;
  samugiruShopGame = await api("/api/game/talk", { game: samugiruShopGame, npcId: npc.id });
  const dialogItem = samugiruShopGame.dialog.trade?.items?.find((entry) => Number(entry.id) === Number(spec.itemId));
  assert(dialogItem, `${spec.name} exposes source trade item ${item.name}`);
  assertEqual(dialogItem.sourcePrice, price, `${spec.name} exposes source price for ${item.name}`);
  assertEqual(samugiruShopGame.dialog.debug.source, npc.source, `${spec.name} dialog records source`);
  assertEqual(samugiruShopGame.dialog.debug.template, npc.template, `${spec.name} dialog records template`);
  assert(samugiruShopGame.dialog.debug.actions.includes("shop"), `${spec.name} dialog advertises shop action`);

  const shopStoneBeforeBuy = samugiruShopGame.player.stone;
  samugiruShopGame = await api("/api/game/buy", { game: samugiruShopGame, npcId: npc.id, itemId: item.id });
  assertEqual(samugiruShopGame.player.stone, shopStoneBeforeBuy - price, `${spec.name} buy charges source stone price`);
  assertEqual(inventoryQty(samugiruShopGame, item.id), 1, `${spec.name} buy gives source item ${item.name}`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.action === "buy"), `${spec.name} buy records shop VM event`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "buy" && event.detail?.executor === "npc-action-vm"), `${spec.name} buy runs stone take through NPC VM`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "buy" && event.detail?.executor === "npc-action-vm"), `${spec.name} buy runs item give through NPC VM`);

  const sellEntry = samugiruShopGame.dialog.trade?.sellItems?.find((entry) => Number(entry.id) === Number(item.id));
  assert(sellEntry?.sellable, `${spec.name} exposes bought source item as sellable`);
  const shopSellPrice = Number(sellEntry.sellPrice || 0);
  assert(shopSellPrice > 0, `${spec.name} exposes source sell price for ${item.name}`);
  const shopStoneBeforeSell = samugiruShopGame.player.stone;
  samugiruShopGame = await api("/api/game/sell", { game: samugiruShopGame, npcId: npc.id, itemId: item.id });
  assertEqual(samugiruShopGame.player.stone, shopStoneBeforeSell + shopSellPrice, `${spec.name} sell pays source sell rate`);
  assertEqual(inventoryQty(samugiruShopGame, item.id), 0, `${spec.name} sell removes source item ${item.name}`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "shop" && event.detail?.action === "sell"), `${spec.name} sell records shop VM event`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "sell" && event.detail?.executor === "npc-action-vm"), `${spec.name} sell runs item take through NPC VM`);
  assert(samugiruShopGame.dialog.debug.vmTrace.some((event) => event.action === "give" && event.detail?.reason === "sell" && event.detail?.stone === shopSellPrice && event.detail?.executor === "npc-action-vm"), `${spec.name} sell runs stone give through NPC VM`);
}

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
const pkStoneOnlyMarkerBefore = pkStoneOnlyShop.npc.trade.stoneOnlyPointCost;
const pkStoneOnlyUnknownSourceBefore = pkStoneOnlyShop.npc.trade.source;
const pkStoneOnlyUnknownScriptBefore = pkStoneOnlyShop.npc.script;
const pkStoneOnlyUnknownNpcSourceBefore = pkStoneOnlyShop.npc.source;
const pkStoneOnlyHintSourceBefore = pkStoneOnlyShop.npc.scriptHints?.source;
pkStoneOnlyShop.npc.trade.source = "gmsv-data/npc/custom/unknown_shop_source";
pkStoneOnlyShop.npc.script = "file:custom/unknown_shop_script";
pkStoneOnlyShop.npc.source = "gmsv-data/npc/custom/unknown_shop_create";
pkStoneOnlyShop.npc.scriptHints ||= {};
pkStoneOnlyShop.npc.scriptHints.source = "gmsv-data/npc/scipt_plus/test2nd/c_can_mm";
pkStoneOnlyShop.npc.trade.stoneOnlyPointCost = false;
try {
  let pkStoneOnlyHintSourceGame = await api("/api/game/new", { name: "shop-pk-stone-only-script-hint-test" });
  pkStoneOnlyHintSourceGame.location = { mapId: pkStoneOnlyShop.map.id, x: pkStoneOnlyShop.npc.x + 1, y: pkStoneOnlyShop.npc.y };
  pkStoneOnlyHintSourceGame.player.stone = Number(pkStoneOnlyItem.price || pkStoneOnlyItem.cost || 0) + 456;
  pkStoneOnlyHintSourceGame.player.amPoint = 0;
  pkStoneOnlyHintSourceGame = await api("/api/game/talk", { game: pkStoneOnlyHintSourceGame, npcId: pkStoneOnlyShop.npc.id });
  assert(
    pkStoneOnlyHintSourceGame.dialog.trade.items.every((item) => Number(item.costPoint || 0) === 0 && item.pointAffordable !== false),
    "stone-only PK merchant stays stone-priced when runtime falls back to scriptHints.source"
  );
} finally {
  pkStoneOnlyShop.npc.trade.source = pkStoneOnlyUnknownSourceBefore;
  pkStoneOnlyShop.npc.script = pkStoneOnlyUnknownScriptBefore;
  pkStoneOnlyShop.npc.source = pkStoneOnlyUnknownNpcSourceBefore;
  if (pkStoneOnlyShop.npc.scriptHints) pkStoneOnlyShop.npc.scriptHints.source = pkStoneOnlyHintSourceBefore;
}
pkStoneOnlyShop.npc.trade.source = "gmsv-data/npc/custom/unknown_shop_source";
pkStoneOnlyShop.npc.trade.stoneOnlyPointCost = true;
try {
  let pkStoneOnlyMarkerGame = await api("/api/game/new", { name: "shop-pk-stone-only-marker-test" });
  pkStoneOnlyMarkerGame.location = { mapId: pkStoneOnlyShop.map.id, x: pkStoneOnlyShop.npc.x + 1, y: pkStoneOnlyShop.npc.y };
  pkStoneOnlyMarkerGame.player.stone = Number(pkStoneOnlyItem.price || pkStoneOnlyItem.cost || 0) + 456;
  pkStoneOnlyMarkerGame.player.amPoint = 0;
  pkStoneOnlyMarkerGame = await api("/api/game/talk", { game: pkStoneOnlyMarkerGame, npcId: pkStoneOnlyShop.npc.id });
  assert(
    pkStoneOnlyMarkerGame.dialog.trade.items.every((item) => Number(item.costPoint || 0) === 0 && item.pointAffordable !== false),
    "stone-only compatibility marker keeps PK merchant stone-priced even when source path is unrecognized"
  );
} finally {
  pkStoneOnlyShop.npc.trade.source = pkStoneOnlyUnknownSourceBefore;
  pkStoneOnlyShop.npc.trade.stoneOnlyPointCost = pkStoneOnlyMarkerBefore;
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
const firstPetSkillNpc = WORLD.maps["1003"]?.npcs?.find((npc) => npc.id === "1003-18-13-5699");
assert(firstPetSkillNpc?.petSkillShop?.skillIds?.length, "first-pet core keeps Samugiru source pet skill trainer");
assert(firstPetSkillNpc.petSkillShop.skillIds.includes(10), "first-pet core trainer keeps source skill id 10");
let firstPetSkillGame = await api("/api/game/new", { name: "first-pet-core-skill-runtime-test" });
firstPetSkillGame.location = { mapId: "1003", x: firstPetSkillNpc.x + 1, y: firstPetSkillNpc.y };
firstPetSkillGame.player.stone = 100000;
firstPetSkillGame = await api("/api/game/dialog", { game: firstPetSkillGame, npcId: firstPetSkillNpc.id });
assert(firstPetSkillGame.dialog.petSkillShop?.skills?.some((skill) => Number(skill.id) === 10), "first-pet core trainer dialog exposes source skill id 10");
const firstPetLearnableSkill = firstPetSkillGame.dialog.petSkillShop.skills.find((skill) => !skill.alreadyKnown && Number(skill.cost || 0) > 0);
if (!firstPetLearnableSkill) throw new Error("missing first-pet core learnable skill fixture");
const firstPetLearnSlot = firstPetSkillGame.dialog.petSkillShop.slots.find((slot) => slot.empty)?.index ?? 4;
const firstPetSkillStoneBefore = firstPetSkillGame.player.stone;
firstPetSkillGame = await api("/api/game/learn-pet-skill", {
  game: firstPetSkillGame,
  npcId: firstPetSkillNpc.id,
  skillId: firstPetLearnableSkill.id,
  petIndex: 0,
  slotIndex: firstPetLearnSlot
});
assertEqual(Number(firstPetSkillGame.pets[0].PetSkillIds[firstPetLearnSlot]), Number(firstPetLearnableSkill.id), "first-pet core trainer writes selected skill id to pet skill slot");
assertEqual(firstPetSkillGame.pets[0].PetSkills[firstPetLearnSlot]?.Name, firstPetLearnableSkill.name, "first-pet core trainer stores compact skill metadata");
assertEqual(firstPetSkillGame.player.stone, firstPetSkillStoneBefore - Number(firstPetLearnableSkill.cost || 0), "first-pet core trainer charges source skill cost");
assert(firstPetSkillGame.dialog.debug.vmTrace.some((event) => event.action === "petSkillShop" && event.detail?.skillId === firstPetLearnableSkill.id), "first-pet core trainer records teach VM event");

const firstPetFreeSkillNpc = WORLD.maps["1003"]?.npcs?.find((npc) => npc.id === "1003-19-20-1484");
assert(firstPetFreeSkillNpc?.petSkillShop?.skillIds?.length, "first-pet core keeps source snake trainer fixture");
assertEqual(firstPetFreeSkillNpc.petSkillShop.kind, "free-pet-skill", "first-pet snake trainer keeps source free-pet-skill shop kind");
assert(firstPetFreeSkillNpc.petSkillShop.skillIds.includes(575), "first-pet snake trainer keeps source weaken skill id 575");
let firstPetFreeSkillGame = await api("/api/game/new", { name: "first-pet-core-free-skill-runtime-test" });
firstPetFreeSkillGame.location = { mapId: "1003", x: firstPetFreeSkillNpc.x + 1, y: firstPetFreeSkillNpc.y };
firstPetFreeSkillGame.player.stone = 100000;
firstPetFreeSkillGame = await api("/api/game/dialog", { game: firstPetFreeSkillGame, npcId: firstPetFreeSkillNpc.id });
assertEqual(firstPetFreeSkillGame.dialog.petSkillShop?.kind, "free-pet-skill", "first-pet snake trainer dialog exposes source shop kind");
assert(firstPetFreeSkillGame.dialog.petSkillShop.skills.some((skill) => Number(skill.id) === 575 && Number(skill.cost || 0) > 0), "first-pet snake trainer dialog exposes source skill id 575 with source cost");
const firstPetFreeSkill = firstPetFreeSkillGame.dialog.petSkillShop.skills.find((skill) => Number(skill.id) === 575);
const firstPetFreeSkillSlot = firstPetFreeSkillGame.dialog.petSkillShop.slots.find((slot) => slot.empty)?.index ?? 4;
const firstPetFreeSkillStoneBefore = firstPetFreeSkillGame.player.stone;
firstPetFreeSkillGame = await api("/api/game/learn-pet-skill", {
  game: firstPetFreeSkillGame,
  npcId: firstPetFreeSkillNpc.id,
  skillId: firstPetFreeSkill.id,
  petIndex: 0,
  slotIndex: firstPetFreeSkillSlot
});
assertEqual(Number(firstPetFreeSkillGame.pets[0].PetSkillIds[firstPetFreeSkillSlot]), Number(firstPetFreeSkill.id), "first-pet snake trainer writes selected source skill id to pet skill slot");
assertEqual(firstPetFreeSkillGame.pets[0].PetSkills[firstPetFreeSkillSlot]?.Name, firstPetFreeSkill.name, "first-pet snake trainer stores compact skill metadata");
assertEqual(firstPetFreeSkillGame.player.stone, firstPetFreeSkillStoneBefore - Number(firstPetFreeSkill.cost || 0), "first-pet snake trainer charges source skill cost");
assert(firstPetFreeSkillGame.dialog.debug.vmTrace.some((event) => event.action === "petSkillShop" && event.detail?.skillId === firstPetFreeSkill.id && event.detail?.source?.includes("freeshop04.arg")), "first-pet snake trainer records freeshop VM teach event");
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
npcItemBattleGame.encounter.WorkFixStr = 0;
npcItemBattleGame.encounter.WorkAttackPower = 0;
npcItemBattleGame.encounter.Attack = 0;
npcItemBattleGame.encounter.Str = 0;
const itemBattleHpBefore = Number(npcItemBattleGame.pets[0].Hp || 0);
npcItemBattleGame = await api("/api/game/dialog", { game: npcItemBattleGame, npcId: battleNpc.npc.id, message: "道具" });
assert(inventoryQty(npcItemBattleGame, 990001) === 0, "NPC battle item consumes recovery item");
assert(npcItemBattleGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes("使用 小的肉")), "NPC battle item replies with item battle log");
assert(
  npcItemBattleGame.dialog.debug.vmTrace.some(
    (event) => event.action === "battleAction"
      && event.status === "ok"
      && event.detail?.outcome?.itemUse?.itemName === "小的肉"
  ),
  "NPC battle item records item outcome through VM"
);
let selectedItemBattleGame = await api("/api/game/new", { name: "selected-item-battle-test" });
selectedItemBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
selectedItemBattleGame = await api("/api/game/dialog", { game: selectedItemBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
selectedItemBattleGame.inventory.push({ id: 990002, name: "小的肉", qty: 1, description: "回复耐久力 30", source: "test itemset6 recovery" });
selectedItemBattleGame.inventory.push({ id: 990003, name: "大的肉", qty: 1, description: "回复耐久力 65", source: "test itemset6 recovery" });
selectedItemBattleGame.pets[0].WorkMaxHp = Math.max(120, Number(selectedItemBattleGame.pets[0].WorkMaxHp || selectedItemBattleGame.pets[0].Hp || 1));
selectedItemBattleGame.pets[0].Hp = Math.max(1, selectedItemBattleGame.pets[0].WorkMaxHp - 80);
selectedItemBattleGame.encounter.WorkFixStr = 0;
selectedItemBattleGame.encounter.WorkAttackPower = 0;
selectedItemBattleGame.encounter.Attack = 0;
selectedItemBattleGame.encounter.Str = 0;
selectedItemBattleGame = await api("/api/game/battle", { game: selectedItemBattleGame, action: "item:990003" });
assert(inventoryQty(selectedItemBattleGame, 990002) === 1, "selected battle item leaves unselected item untouched");
assert(inventoryQty(selectedItemBattleGame, 990003) === 0, "selected battle item consumes requested item id");
assert(selectedItemBattleGame.battleOutcome?.itemUse?.itemName === "大的肉", "selected battle item outcome records requested item");
let itemTargetPlayerGame = await api("/api/game/new", { name: "battle-item-target-player-test" });
itemTargetPlayerGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
itemTargetPlayerGame = await api("/api/game/dialog", { game: itemTargetPlayerGame, npcId: battleNpc.npc.id, message: "宠物" });
itemTargetPlayerGame.inventory.push({ id: 990014, name: "小的肉", qty: 1, description: "回复耐久力 30", source: "test itemset6 recovery" });
Object.assign(itemTargetPlayerGame.player, {
  Hp: 99999,
  hp: 99999,
  maxHp: 99999,
  WorkMaxHp: 99999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(itemTargetPlayerGame.pets[0], {
  Hp: 900,
  WorkMaxHp: 999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(itemTargetPlayerGame.encounter, {
  Lv: 1,
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(itemTargetPlayerGame.battle?.enemyParty?.[0] || {}, itemTargetPlayerGame.encounter);
itemTargetPlayerGame = await api("/api/game/battle", { game: itemTargetPlayerGame, action: "item:990014" });
assertEqual(itemTargetPlayerGame.battleOutcome.result, "item", "battle item keeps battle active after source enemy turn");
assertEqual(itemTargetPlayerGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ITEM", "battle item records source item command telemetry");
assertEqual(itemTargetPlayerGame.battleOutcome.enemyAi?.targetKind, "player", "battle item enemy turn honors source target player rule");
assert(itemTargetPlayerGame.battleOutcome.log.some((line) => line.includes(itemTargetPlayerGame.player.name)), "battle item source enemy turn resolves against the selected player target");
assertEqual(Number(itemTargetPlayerGame.pets[0].Hp || 0), 930, "battle item enemy turn does not force damage onto the active pet");
let blockedItemBattleGame = await api("/api/game/new", { name: "battle-item-status-blocked-test" });
blockedItemBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
blockedItemBattleGame = await api("/api/game/dialog", { game: blockedItemBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
blockedItemBattleGame.inventory.push({ id: 990004, name: "大的肉", qty: 1, description: "回复耐久力 65", source: "test itemset6 recovery" });
blockedItemBattleGame.pets[0].WorkMaxHp = 999;
blockedItemBattleGame.pets[0].MaxHp = 999;
blockedItemBattleGame.pets[0].Hp = 999;
blockedItemBattleGame.player.BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
Object.assign(blockedItemBattleGame.player, {
  Hp: 99999,
  hp: 99999,
  maxHp: 99999,
  WorkMaxHp: 99999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  Tough: 0
});
Object.assign(blockedItemBattleGame.encounter, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkFixDex: 0,
  WorkQuick: 0,
  Critical: 0,
  Attack: 0,
  Str: 0,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(blockedItemBattleGame.battle?.enemyParty?.[0] || {}, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkFixDex: 0,
  WorkQuick: 0,
  Critical: 0,
  Attack: 0,
  Str: 0,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
const blockedItemPetHpBefore = Number(blockedItemBattleGame.pets[0].Hp || 0);
blockedItemBattleGame = await api("/api/game/battle", { game: blockedItemBattleGame, action: "item:990004" });
assertEqual(blockedItemBattleGame.battleOutcome.result, "item-blocked", "sleep blocks source I item command before use");
assertEqual(blockedItemBattleGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ITEM", "blocked battle item records source item command telemetry");
assertEqual(blockedItemBattleGame.battleOutcome.enemyAi?.targetKind, "player", "blocked battle item enemy turn honors source target player rule");
assertEqual(inventoryQty(blockedItemBattleGame, 990004), 1, "blocked battle item command does not consume the item");
assert(Number(blockedItemBattleGame.pets[0].Hp || 0) <= blockedItemPetHpBefore, "blocked battle item command does not heal before status resolves");
assert(blockedItemBattleGame.battleOutcome.log.some((line) => line.includes("睡眠") && line.includes("无法行动")), "blocked battle item command writes status log");
let sleepWakeBattleGame = await api("/api/game/new", { name: "source-sleep-damage-wakeup-test" });
sleepWakeBattleGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
sleepWakeBattleGame = await api("/api/game/dialog", { game: sleepWakeBattleGame, npcId: battleNpc.npc.id, message: "宠物" });
Object.assign(sleepWakeBattleGame.pets[0], {
  WorkFixStr: 80,
  WorkAttackPower: 80,
  WorkQuick: 999,
  WorkFixDex: 999
});
Object.assign(sleepWakeBattleGame.encounter, {
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  BattleStatuses: { sleep: { key: "sleep", label: "睡眠", turns: 3 } }
});
Object.assign(sleepWakeBattleGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: sleepWakeBattleGame.encounter.WorkMaxHp,
  Hp: sleepWakeBattleGame.encounter.Hp,
  WorkFixTough: sleepWakeBattleGame.encounter.WorkFixTough,
  WorkDefencePower: sleepWakeBattleGame.encounter.WorkDefencePower,
  WorkQuick: sleepWakeBattleGame.encounter.WorkQuick,
  WorkFixDex: sleepWakeBattleGame.encounter.WorkFixDex,
  WorkAttackPower: sleepWakeBattleGame.encounter.WorkAttackPower,
  WorkFixStr: sleepWakeBattleGame.encounter.WorkFixStr,
  BattleStatuses: sleepWakeBattleGame.encounter.BattleStatuses
});
sleepWakeBattleGame = await api("/api/game/battle", { game: sleepWakeBattleGame, action: "attack" });
assert(!sleepWakeBattleGame.encounter.BattleStatuses?.sleep, "source BATTLE_DamageWakeUp clears enemy sleep after damage");
assert(sleepWakeBattleGame.battleOutcome.log.some((line) => line.includes("睡眠状态解除")), "damage wake-up writes a source-style sleep clear log");
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
let guardBreak2SkillGame = await api("/api/game/new", { name: "pet-guardbreak2-skill-test" });
guardBreak2SkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
guardBreak2SkillGame = await api("/api/game/dialog", { game: guardBreak2SkillGame, npcId: battleNpc.npc.id, message: "宠物" });
guardBreak2SkillGame.pets[0].PetSkillIds = [543];
guardBreak2SkillGame.pets[0].PetSkills = [{
  Id: 543,
  Name: "破除防御之2",
  Des: "敌防御时攻+30%，敌非防御时攻-30%",
  FuncName: "PETSKILL_GuardBreak2",
  Option: "",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
guardBreak2SkillGame.pets[0].WorkFixStr = 80;
guardBreak2SkillGame.pets[0].WorkAttackPower = 80;
guardBreak2SkillGame.pets[0].WorkQuick = 999;
guardBreak2SkillGame.pets[0].WorkFixDex = 999;
guardBreak2SkillGame.encounter.WorkMaxHp = 999;
guardBreak2SkillGame.encounter.Hp = 999;
guardBreak2SkillGame.encounter.WorkFixTough = 1;
guardBreak2SkillGame.encounter.WorkDefencePower = 1;
guardBreak2SkillGame.encounter.WorkQuick = 1;
guardBreak2SkillGame.encounter.WorkFixDex = 1;
guardBreak2SkillGame.encounter.WorkAttackPower = 1;
guardBreak2SkillGame = await api("/api/game/battle", { game: guardBreak2SkillGame, action: "skill:0" });
assertEqual(guardBreak2SkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_GBREAK2", "GuardBreak2 pet skill maps to source battle command");
assert(guardBreak2SkillGame.battleOutcome.playerAction?.petSkill?.id === 543, "GuardBreak2 telemetry records source petskill2 id");
let selfExplodeSkillGame = await api("/api/game/new", { name: "pet-self-explode-skill-test" });
selfExplodeSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
selfExplodeSkillGame = await api("/api/game/dialog", { game: selfExplodeSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
selfExplodeSkillGame.pets[0].PetSkillIds = [582];
selfExplodeSkillGame.pets[0].PetSkills = [{
  Id: 582,
  Name: "自爆攻击",
  Des: "牺牲自己，提高50%命中率，造成三倍损伤",
  FuncName: "PETSKILL_SelfExplodeAttack",
  Option: "倍3 回避-50",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
selfExplodeSkillGame.pets[0].PetId = 58200;
selfExplodeSkillGame.pets[0].WorkMaxHp = 300;
selfExplodeSkillGame.pets[0].Hp = 300;
selfExplodeSkillGame.pets[0].WorkFixStr = 100;
selfExplodeSkillGame.pets[0].WorkAttackPower = 100;
selfExplodeSkillGame.pets[0].WorkFixTough = 1000;
selfExplodeSkillGame.pets[0].WorkDefencePower = 1000;
selfExplodeSkillGame.pets[0].WorkQuick = 999;
selfExplodeSkillGame.pets[0].WorkFixDex = 999;
selfExplodeSkillGame.encounter.EnemyId = 0;
selfExplodeSkillGame.encounter.PetId = 0;
selfExplodeSkillGame.encounter.Name = "自爆测试敌人";
selfExplodeSkillGame.encounter.WorkMaxHp = 999;
selfExplodeSkillGame.encounter.Hp = 999;
selfExplodeSkillGame.encounter.WorkFixTough = 1;
selfExplodeSkillGame.encounter.WorkDefencePower = 1;
selfExplodeSkillGame.encounter.WorkQuick = 0;
selfExplodeSkillGame.encounter.WorkFixDex = 0;
selfExplodeSkillGame.encounter.WorkAttackPower = 0;
Object.assign(selfExplodeSkillGame.battle?.enemyParty?.[0] || {}, {
  EnemyId: selfExplodeSkillGame.encounter.EnemyId,
  PetId: selfExplodeSkillGame.encounter.PetId,
  Name: selfExplodeSkillGame.encounter.Name,
  WorkMaxHp: selfExplodeSkillGame.encounter.WorkMaxHp,
  Hp: selfExplodeSkillGame.encounter.Hp,
  WorkFixTough: selfExplodeSkillGame.encounter.WorkFixTough,
  WorkDefencePower: selfExplodeSkillGame.encounter.WorkDefencePower,
  WorkQuick: selfExplodeSkillGame.encounter.WorkQuick,
  WorkFixDex: selfExplodeSkillGame.encounter.WorkFixDex,
  WorkAttackPower: selfExplodeSkillGame.encounter.WorkAttackPower
});
const selfExplodePetHpBefore = Number(selfExplodeSkillGame.pets[0].Hp || 0);
const selfExplodeEnemyHpBefore = Number(selfExplodeSkillGame.encounter.Hp || 0);
selfExplodeSkillGame = await api("/api/game/battle", { game: selfExplodeSkillGame, action: "skill:0" });
assertEqual(selfExplodeSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ATTACK", "SelfExplodeAttack uses source non-PvP normal attack fallback");
assertEqual(selfExplodeSkillGame.battleOutcome.playerAction?.petSkill?.selfExplode?.battleTypeFallback, "non-pvp-normal-attack", "SelfExplodeAttack records the source battle type fallback");
assertEqual(selfExplodeSkillGame.battleOutcome.playerAction?.petSkill?.selfExplode?.pvpSourceCommand, "BATTLE_COM_S_EXPLODE", "SelfExplodeAttack telemetry keeps the protected PvP source command");
assertEqual(selfExplodeSkillGame.battleOutcome.playerAction?.petSkill?.multiplier, 1, "SelfExplodeAttack does not apply petskill2 display multiplier in non-PvP");
assertEqual(selfExplodeSkillGame.battleOutcome.playerAction?.petSkill?.missChance, 0, "SelfExplodeAttack does not apply PvP explode option changes in non-PvP");
assert(Number(selfExplodeSkillGame.pets[0].Hp || 0) > 1, "SelfExplodeAttack non-PvP fallback does not set attacker HP to 1");
assert(Number(selfExplodeSkillGame.pets[0].Hp || 0) >= selfExplodePetHpBefore - 1, "SelfExplodeAttack non-PvP fallback only allows ordinary enemy response damage in this fixture");
assert(Number(selfExplodeSkillGame.encounter?.Hp || 0) < selfExplodeEnemyHpBefore, "SelfExplodeAttack non-PvP fallback damages the active battle target");
let becomeFoxSkillGame = await api("/api/game/new", { name: "pet-becomefox-skill-test" });
becomeFoxSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
becomeFoxSkillGame = await api("/api/game/dialog", { game: becomeFoxSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
becomeFoxSkillGame.pets[0].PetSkillIds = [625];
becomeFoxSkillGame.pets[0].PetSkills = [{
  Id: 625,
  Name: "媚惑术",
  Des: "使宠物变成小狐狸",
  FuncName: "PETSKILL_BecomeFox",
  Option: "",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(becomeFoxSkillGame.pets[0], {
  Lv: 12,
  WorkAttackPower: 180,
  WorkFixStr: 180,
  WorkQuick: 999,
  WorkFixDex: 999,
  Critical: 0
});
Object.assign(becomeFoxSkillGame.encounter, {
  Name: "变狐测试宠物敌人",
  PetId: 900625,
  WorkPetFlg: 1,
  WhichType: 2,
  Lv: 1,
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 0,
  WorkDefencePower: 0,
  WorkQuick: 100,
  WorkFixDex: 100,
  WorkAttackPower: 100,
  WorkFixStr: 100,
  Critical: 0,
  WorkTacticsOption: "at:0;1;1|gu:0|es:100|wa:0;0;0;0;0;0;0"
});
Object.assign(becomeFoxSkillGame.battle?.enemyParty?.[0] || {}, becomeFoxSkillGame.encounter);
if (Array.isArray(becomeFoxSkillGame.battle?.enemyParty)) {
  becomeFoxSkillGame.battle.enemyParty = becomeFoxSkillGame.battle.enemyParty.slice(0, 1);
  becomeFoxSkillGame.battle.activeEnemyIndex = 0;
}
const becomeFoxEnemyHpBefore = Number(becomeFoxSkillGame.encounter.Hp || 0);
const originalRandomForBecomeFox = Math.random;
try {
  Math.random = () => 0;
  becomeFoxSkillGame = await api("/api/game/battle", { game: becomeFoxSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForBecomeFox;
}
const becomeFoxTelemetry = becomeFoxSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(becomeFoxSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_BECOMEFOX", "BecomeFox pet skill maps to source battle command");
assert(Number(becomeFoxTelemetry?.totalDamage || 0) > 0, "BecomeFox performs the source normal physical attack");
assert(Number(becomeFoxSkillGame.encounter?.Hp || 0) < becomeFoxEnemyHpBefore, "BecomeFox damages the active battle target");
assertEqual(becomeFoxTelemetry?.becomeFox?.success, true, "BecomeFox applies fox state on a source-success roll");
assertEqual(becomeFoxTelemetry?.becomeFox?.roll, 0, "BecomeFox records rand()%100 roll");
assertEqual(becomeFoxTelemetry?.becomeFox?.successPercent, 31, "BecomeFox uses source rand()%100 < 31 threshold");
assertEqual(becomeFoxTelemetry?.becomeFox?.applied?.imageNumber, 101749, "BecomeFox records source fox image number");
assertEqual(becomeFoxTelemetry?.becomeFox?.after?.attack, 80, "BecomeFox applies source attack -20% battle modifier");
assertEqual(becomeFoxTelemetry?.becomeFox?.after?.defence, 0, "BecomeFox applies source defence -20% battle modifier after zero defence");
assertEqual(becomeFoxTelemetry?.becomeFox?.after?.quick, 80, "BecomeFox applies source quick -20% battle modifier");
assertEqual(becomeFoxSkillGame.encounter?.BattleBecomeFox?.turns, 2, "BecomeFox battle state persists after the settled round with one turn consumed");
assertEqual(becomeFoxSkillGame.battleOutcome.enemyAi?.foxRestricted, true, "BecomeFox restricts the same-round enemy escape command to wait");
assertEqual(becomeFoxSkillGame.battleOutcome.enemyAi?.sourceCommand, "BATTLE_COM_WAIT", "BecomeFox restricted enemy command uses source wait dispatch");
let becomePigSkillGame = await api("/api/game/new", { name: "pet-becomepig-skill-test" });
becomePigSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
becomePigSkillGame = await api("/api/game/dialog", { game: becomePigSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
becomePigSkillGame.pets[0].PetSkillIds = [631];
becomePigSkillGame.pets[0].PetSkills = [{
  Id: 631,
  Name: "乌力化",
  Des: "在一定时间内使对方变成乌力",
  FuncName: "PETSKILL_BecomePig",
  Option: "30 180",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(becomePigSkillGame.pets[0], {
  Lv: 12,
  WorkAttackPower: 180,
  WorkFixStr: 180,
  WorkQuick: 999,
  WorkFixDex: 999,
  Critical: 0
});
Object.assign(becomePigSkillGame.encounter, {
  WhichType: 2,
  Lv: 1,
  WorkMaxHp: 220,
  Hp: 220,
  WorkFixTough: 0,
  WorkDefencePower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: ""
});
Object.assign(becomePigSkillGame.battle?.enemyParty?.[0] || {}, {
  WhichType: becomePigSkillGame.encounter.WhichType,
  Lv: becomePigSkillGame.encounter.Lv,
  WorkMaxHp: becomePigSkillGame.encounter.WorkMaxHp,
  Hp: becomePigSkillGame.encounter.Hp,
  WorkFixTough: becomePigSkillGame.encounter.WorkFixTough,
  WorkDefencePower: becomePigSkillGame.encounter.WorkDefencePower,
  WorkQuick: becomePigSkillGame.encounter.WorkQuick,
  WorkFixDex: becomePigSkillGame.encounter.WorkFixDex,
  WorkAttackPower: becomePigSkillGame.encounter.WorkAttackPower,
  WorkFixStr: becomePigSkillGame.encounter.WorkFixStr,
  Critical: becomePigSkillGame.encounter.Critical,
  WorkTacticsOption: becomePigSkillGame.encounter.WorkTacticsOption
});
if (Array.isArray(becomePigSkillGame.battle?.enemyParty)) {
  becomePigSkillGame.battle.enemyParty = becomePigSkillGame.battle.enemyParty.slice(0, 1);
  becomePigSkillGame.battle.activeEnemyIndex = 0;
}
const becomePigEnemyHpBefore = Number(becomePigSkillGame.encounter.Hp || 0);
const originalRandomForBecomePig = Math.random;
try {
  Math.random = () => 0;
  becomePigSkillGame = await api("/api/game/battle", { game: becomePigSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForBecomePig;
}
const becomePigTelemetry = becomePigSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(becomePigSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_BECOMEPIG", "BecomePig pet skill maps to source battle command");
assert(Number(becomePigTelemetry?.totalDamage || 0) > 0, "BecomePig enemy-target branch still performs the source normal attack");
assert(Number(becomePigSkillGame.encounter?.Hp || 0) < becomePigEnemyHpBefore, "BecomePig enemy-target branch damages the active battle target");
assertEqual(becomePigTelemetry?.becomePig?.targetKind, "enemy", "BecomePig records source enemy target kind");
assertEqual(becomePigTelemetry?.becomePig?.landed, true, "BecomePig side-effect telemetry records landed hit");
assertEqual(becomePigTelemetry?.becomePig?.applied, false, "BecomePig does not apply pig state to non-player targets");
assertEqual(becomePigTelemetry?.becomePig?.reason, "target-not-player", "BecomePig records source player-target-only guard");
assertEqual(becomePigTelemetry?.becomePig?.durationSeconds, 60, "BecomePig preserves executable source default duration instead of display option drift");
assertEqual(becomePigTelemetry?.becomePig?.imageNumber, 100250, "BecomePig preserves executable source default pig image");
assertEqual(becomePigTelemetry?.becomePig?.optionRaw, "30 180", "BecomePig telemetry keeps raw petskill2 option for audit");
assert(!becomePigSkillGame.encounter?.BattleBecomePig, "BecomePig enemy target is not mutated into pig state");
let lighttakeSkillGame = await api("/api/game/new", { name: "pet-lighttake-skill-test" });
lighttakeSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
lighttakeSkillGame = await api("/api/game/dialog", { game: lighttakeSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
lighttakeSkillGame.pets[0].PetSkillIds = [609];
lighttakeSkillGame.pets[0].PetSkills = [{
  Id: 609,
  Name: "采光术",
  Des: "夺取对方使用中的光、镜、消失的效果",
  FuncName: "PETSKILL_Lighttakeed",
  Option: "ABSROB",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(lighttakeSkillGame.pets[0], {
  Lv: 12,
  WorkAttackPower: 200,
  WorkFixStr: 200,
  WorkDefencePower: 90,
  WorkFixTough: 90,
  WorkQuick: 999,
  WorkFixDex: 999,
  Critical: 0
});
Object.assign(lighttakeSkillGame.encounter, {
  WhichType: 2,
  Lv: 1,
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 0,
  WorkDefencePower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: "",
  BattleMagicDefense: { absrob: 2 },
  WorkDamageAbsrob: 2,
  CHAR_WORKDAMAGEABSROB: 2
});
Object.assign(lighttakeSkillGame.battle?.enemyParty?.[0] || {}, {
  WhichType: lighttakeSkillGame.encounter.WhichType,
  Lv: lighttakeSkillGame.encounter.Lv,
  WorkMaxHp: lighttakeSkillGame.encounter.WorkMaxHp,
  Hp: lighttakeSkillGame.encounter.Hp,
  WorkFixTough: lighttakeSkillGame.encounter.WorkFixTough,
  WorkDefencePower: lighttakeSkillGame.encounter.WorkDefencePower,
  WorkQuick: lighttakeSkillGame.encounter.WorkQuick,
  WorkFixDex: lighttakeSkillGame.encounter.WorkFixDex,
  WorkAttackPower: lighttakeSkillGame.encounter.WorkAttackPower,
  WorkFixStr: lighttakeSkillGame.encounter.WorkFixStr,
  Critical: lighttakeSkillGame.encounter.Critical,
  WorkTacticsOption: lighttakeSkillGame.encounter.WorkTacticsOption,
  BattleMagicDefense: { absrob: 2 },
  WorkDamageAbsrob: 2,
  CHAR_WORKDAMAGEABSROB: 2
});
if (Array.isArray(lighttakeSkillGame.battle?.enemyParty)) {
  lighttakeSkillGame.battle.enemyParty = lighttakeSkillGame.battle.enemyParty.slice(0, 1);
  lighttakeSkillGame.battle.activeEnemyIndex = 0;
}
const lighttakePetAttackBefore = Number(lighttakeSkillGame.pets[0].WorkAttackPower || 0);
const lighttakePetDefenceBefore = Number(lighttakeSkillGame.pets[0].WorkDefencePower || 0);
const lighttakeEnemyHpBefore = Number(lighttakeSkillGame.encounter.Hp || 0);
lighttakeSkillGame = await api("/api/game/battle", { game: lighttakeSkillGame, action: "skill:0" });
const lighttakeTelemetry = lighttakeSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(lighttakeSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_LIGHTTAKE", "Lighttakeed pet skill maps to source battle command");
assert(Number(lighttakeTelemetry?.totalDamage || 0) > 0, "Lighttakeed source branch performs a physical attack");
assert(Number(lighttakeSkillGame.encounter?.Hp || 0) < lighttakeEnemyHpBefore, "Lighttakeed damages the active battle target");
assertEqual(lighttakeTelemetry?.attackPercent, -30, "Lighttakeed applies source attack=FIXSTR*0.7 temporary stat");
assertEqual(lighttakeTelemetry?.defencePercent, -50, "Lighttakeed applies source defence=FIXTOUGH*0.5 temporary stat");
assertEqual(lighttakeTelemetry?.lighttake?.token, "ABSROB", "Lighttakeed records the petskill2 option token");
assertEqual(lighttakeTelemetry?.lighttake?.sourceReactType, "BATTLE_MD_ABSROB", "Lighttakeed records source magic-defense react type");
assertEqual(lighttakeTelemetry?.lighttake?.targetCount, 2, "Lighttakeed reads matching target magic-defense count");
assertEqual(lighttakeTelemetry?.lighttake?.transferredCount, 3, "Lighttakeed transfers source target count plus one");
assertEqual(lighttakeTelemetry?.lighttake?.applied, true, "Lighttakeed applies when the target has matching magic-defense state");
assertEqual(lighttakeTelemetry?.lighttake?.reason, "source-matching-reaction-transferred", "Lighttakeed records the source transfer reason");
assertEqual(lighttakeSkillGame.pets[0].BattleMagicDefense?.absrob, 3, "Lighttakeed writes the transferred ABSROB count to the active pet battle state");
assertEqual(lighttakeSkillGame.pets[0].WorkDamageAbsrob, 3, "Lighttakeed mirrors source CHAR_WORKDAMAGEABSROB on the active pet");
assertEqual(lighttakeSkillGame.pets[0].WorkAttackPower, lighttakePetAttackBefore, "Lighttakeed restores temporary attack after the action");
assertEqual(lighttakeSkillGame.pets[0].WorkDefencePower, lighttakePetDefenceBefore, "Lighttakeed restores temporary defence after the action");
let abductSkillGame = await api("/api/game/new", { name: "pet-abduct-skill-test" });
abductSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
abductSkillGame = await api("/api/game/dialog", { game: abductSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
abductSkillGame.pets[0].PetSkillIds = [130];
abductSkillGame.pets[0].PetSkills = [{
  Id: 130,
  Name: "旅程伙伴",
  Des: "把一只恐龙当作是伙伴当场带走",
  FuncName: "PETSKILL_Abduct",
  Option: "",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
abductSkillGame.pets[0].Lv = 1;
abductSkillGame.pets[0].WorkQuick = 999;
abductSkillGame.pets[0].WorkFixDex = 999;
abductSkillGame.encounter.WhichType = 2;
abductSkillGame.encounter.Lv = 1;
abductSkillGame.encounter.WorkMaxHp = 999;
abductSkillGame.encounter.Hp = 999;
abductSkillGame.encounter.WorkQuick = 0;
abductSkillGame.encounter.WorkFixDex = 0;
abductSkillGame.encounter.WorkAttackPower = 0;
Object.assign(abductSkillGame.battle?.enemyParty?.[0] || {}, {
  WhichType: abductSkillGame.encounter.WhichType,
  Lv: abductSkillGame.encounter.Lv,
  WorkMaxHp: abductSkillGame.encounter.WorkMaxHp,
  Hp: abductSkillGame.encounter.Hp,
  WorkQuick: abductSkillGame.encounter.WorkQuick,
  WorkFixDex: abductSkillGame.encounter.WorkFixDex,
  WorkAttackPower: abductSkillGame.encounter.WorkAttackPower
});
if (Array.isArray(abductSkillGame.battle?.enemyParty)) {
  abductSkillGame.battle.enemyParty = abductSkillGame.battle.enemyParty.slice(0, 1);
  abductSkillGame.battle.activeEnemyIndex = 0;
}
const abductEnemyHpBefore = Number(abductSkillGame.encounter.Hp || 0);
const originalRandomForAbduct = Math.random;
try {
  Math.random = () => 0;
  abductSkillGame = await api("/api/game/battle", { game: abductSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForAbduct;
}
const abductTelemetry = abductSkillGame.battleOutcome.playerAction?.petSkill?.abduct;
assertEqual(abductSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ABDUCT", "Abduct pet skill maps to source battle command");
assertEqual(abductTelemetry?.targetKind, "enemy", "Abduct records source enemy target kind");
assertEqual(abductTelemetry?.successPercent, 50, "Abduct ordinary enemy target uses source minimum success percent");
assertEqual(abductTelemetry?.roll, 1, "Abduct uses source RAND(1,100) success roll");
assertEqual(abductTelemetry?.success, true, "Abduct succeeds when source roll is below per");
assertEqual(abductTelemetry?.targetExited, true, "Abduct success exits the target");
assertEqual(abductTelemetry?.petExited, true, "Abduct exits the acting pet after the action");
assertEqual(Number(abductSkillGame.battleOutcome.playerAction?.petSkill?.totalDamage || 0), 0, "Abduct does not deal damage in the source branch");
assertEqual(abductEnemyHpBefore, 999, "Abduct fixture starts with a live enemy target");
assertEqual(abductSkillGame.battleOutcome.result, "enemy-escaped", "Abduct ends a single-target battle as enemy escaped");
assertEqual(abductSkillGame.battleOutcome.playerExp, 0, "Abduct escape does not grant victory EXP");
assertEqual(abductSkillGame.battleOutcome.stone, 0, "Abduct escape does not grant stone rewards");
assertEqual(abductSkillGame.petState?.activeIndex, -1, "Abduct withdraws the active pet from formation");
assert(!abductSkillGame.encounter, "Abduct clears battle encounter after the target exits");
let stealSkillGame = await api("/api/game/new", { name: "pet-steal-skill-test" });
stealSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
stealSkillGame = await api("/api/game/dialog", { game: stealSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
stealSkillGame.pets[0].PetSkillIds = [140];
stealSkillGame.pets[0].PetSkills = [{
  Id: 140,
  Name: "偷窃",
  Des: "偷窃",
  FuncName: "PETSKILL_Steal",
  Option: "",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
stealSkillGame.pets[0].WorkQuick = 999;
stealSkillGame.pets[0].WorkFixDex = 999;
stealSkillGame.encounter.WhichType = 2;
stealSkillGame.encounter.WorkMaxHp = 999;
stealSkillGame.encounter.Hp = 999;
stealSkillGame.encounter.WorkQuick = 0;
stealSkillGame.encounter.WorkFixDex = 0;
stealSkillGame.encounter.WorkAttackPower = 0;
Object.assign(stealSkillGame.battle?.enemyParty?.[0] || {}, {
  WhichType: stealSkillGame.encounter.WhichType,
  WorkMaxHp: stealSkillGame.encounter.WorkMaxHp,
  Hp: stealSkillGame.encounter.Hp,
  WorkQuick: stealSkillGame.encounter.WorkQuick,
  WorkFixDex: stealSkillGame.encounter.WorkFixDex,
  WorkAttackPower: stealSkillGame.encounter.WorkAttackPower
});
const stealEnemyHpBefore = Number(stealSkillGame.encounter.Hp || 0);
const stealPlayerStoneBefore = Number(stealSkillGame.player.stone || 0);
stealSkillGame = await api("/api/game/battle", { game: stealSkillGame, action: "skill:0" });
assertEqual(stealSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_STEAL", "Steal pet skill maps to source battle command");
assertEqual(stealSkillGame.battleOutcome.playerAction?.petSkill?.steal?.targetKind, "enemy", "Steal records source enemy target kind");
assertEqual(stealSkillGame.battleOutcome.playerAction?.petSkill?.steal?.successPercent, 0, "Steal enemy-target success rate follows source per=0 branch");
assertEqual(stealSkillGame.battleOutcome.playerAction?.petSkill?.steal?.success, false, "Steal does not succeed against ordinary enemy targets");
assertEqual(Number(stealSkillGame.battleOutcome.playerAction?.petSkill?.totalDamage || 0), 0, "Steal does not deal damage in the source enemy-target branch");
assertEqual(Number(stealSkillGame.encounter?.Hp || 0), stealEnemyHpBefore, "Steal does not damage the active battle target");
assertEqual(Number(stealSkillGame.player.stone || 0), stealPlayerStoneBefore, "Steal does not mutate player stone in the enemy-target branch");
let stealMoneySkillGame = await api("/api/game/new", { name: "pet-stealmoney-skill-test" });
stealMoneySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
stealMoneySkillGame = await api("/api/game/dialog", { game: stealMoneySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
stealMoneySkillGame.pets[0].PetSkillIds = [211];
stealMoneySkillGame.pets[0].PetSkills = [{
  Id: 211,
  Name: "捐献",
  Des: "要求对方捐献石币",
  FuncName: "PETSKILL_StealMoney",
  Option: "",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
stealMoneySkillGame.player.stone = 100;
stealMoneySkillGame.inventory.find((item) => item.id === "stone").qty = 100;
stealMoneySkillGame.pets[0].WorkQuick = 999;
stealMoneySkillGame.pets[0].WorkFixDex = 999;
stealMoneySkillGame.encounter.WhichType = 2;
stealMoneySkillGame.encounter.WorkMaxHp = 999;
stealMoneySkillGame.encounter.Hp = 999;
stealMoneySkillGame.encounter.WorkQuick = 0;
stealMoneySkillGame.encounter.WorkFixDex = 0;
stealMoneySkillGame.encounter.WorkAttackPower = 0;
Object.assign(stealMoneySkillGame.battle?.enemyParty?.[0] || {}, {
  WhichType: stealMoneySkillGame.encounter.WhichType,
  WorkMaxHp: stealMoneySkillGame.encounter.WorkMaxHp,
  Hp: stealMoneySkillGame.encounter.Hp,
  WorkQuick: stealMoneySkillGame.encounter.WorkQuick,
  WorkFixDex: stealMoneySkillGame.encounter.WorkFixDex,
  WorkAttackPower: stealMoneySkillGame.encounter.WorkAttackPower
});
const stealMoneyEnemyHpBefore = Number(stealMoneySkillGame.encounter.Hp || 0);
const originalRandomForStealMoney = Math.random;
try {
  const rolls = [0, 0];
  Math.random = () => rolls.shift() ?? 0;
  stealMoneySkillGame = await api("/api/game/battle", { game: stealMoneySkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForStealMoney;
}
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_STEALMONEY", "StealMoney pet skill maps to source battle command");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.targetKind, "enemy", "StealMoney records source enemy target kind");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.successPercent, 5, "StealMoney enemy-target success rate follows source per=5 branch");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.roll, 1, "StealMoney uses source RAND(1,100) success roll");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.success, true, "StealMoney succeeds when source roll is below per");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.gold, 10, "StealMoney enemy target gold follows source RAND(10,100)");
assertEqual(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.stealMoney?.petExited, true, "StealMoney successful pet action exits default pet");
assertEqual(Number(stealMoneySkillGame.battleOutcome.playerAction?.petSkill?.totalDamage || 0), 0, "StealMoney does not deal damage in the source enemy-target branch");
assertEqual(Number(stealMoneySkillGame.encounter?.Hp || 0), stealMoneyEnemyHpBefore, "StealMoney does not damage the active battle target");
assertEqual(Number(stealMoneySkillGame.player.stone || 0), 110, "StealMoney adds enemy-branch stone reward to the player");
assertEqual(Number(stealMoneySkillGame.inventory.find((item) => item.id === "stone")?.qty || 0), 110, "StealMoney keeps the stone inventory mirror synced");
assertEqual(stealMoneySkillGame.petState?.activeIndex, -1, "StealMoney success withdraws the active pet from formation");
let powerBalanceSkillGame = await api("/api/game/new", { name: "pet-powerbalance-skill-test" });
powerBalanceSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
powerBalanceSkillGame = await api("/api/game/dialog", { game: powerBalanceSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
powerBalanceSkillGame.pets[0].PetSkillIds = [50];
powerBalanceSkillGame.pets[0].PetSkills = [{
  Id: 50,
  Name: "背水之战其之1",
  Des: "防御力减30%，攻击力变成+30%",
  FuncName: "PETSKILL_PowerBalance",
  Option: "攻%+25 防%-35",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
powerBalanceSkillGame.pets[0].WorkFixStr = 80;
powerBalanceSkillGame.pets[0].WorkAttackPower = 80;
powerBalanceSkillGame.pets[0].WorkFixTough = 100;
powerBalanceSkillGame.pets[0].WorkDefencePower = 100;
powerBalanceSkillGame.pets[0].WorkQuick = 999;
powerBalanceSkillGame.pets[0].WorkFixDex = 999;
powerBalanceSkillGame.encounter.WorkMaxHp = 999;
powerBalanceSkillGame.encounter.Hp = 999;
powerBalanceSkillGame.encounter.WorkFixTough = 1;
powerBalanceSkillGame.encounter.WorkDefencePower = 1;
powerBalanceSkillGame.encounter.WorkQuick = 0;
powerBalanceSkillGame.encounter.WorkFixDex = 0;
powerBalanceSkillGame.encounter.WorkAttackPower = 1;
const powerBalanceHpBefore = Number(powerBalanceSkillGame.encounter.Hp || 0);
powerBalanceSkillGame = await api("/api/game/battle", { game: powerBalanceSkillGame, action: "skill:0" });
assertEqual(powerBalanceSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_POWERBALANCE", "PowerBalance pet skill maps to source battle command");
assertEqual(powerBalanceSkillGame.battleOutcome.playerAction?.petSkill?.multiplier, 1, "PowerBalance pet skill leaves source attack percent in temporary WorkAttackPower");
assertEqual(powerBalanceSkillGame.battleOutcome.playerAction?.petSkill?.attackPercent, 25, "PowerBalance pet skill preserves source attack percent telemetry");
assertEqual(powerBalanceSkillGame.battleOutcome.playerAction?.petSkill?.defencePercent, -35, "PowerBalance pet skill preserves source defence percent telemetry");
assertEqual(powerBalanceSkillGame.pets[0].WorkAttackPower, 80, "PowerBalance pet skill restores temporary attack after the round");
assertEqual(powerBalanceSkillGame.pets[0].WorkDefencePower, 100, "PowerBalance pet skill restores temporary defence after the round");
assert(Number(powerBalanceSkillGame.encounter?.Hp || 0) < powerBalanceHpBefore, "PowerBalance pet skill damages the active battle target");
let wildViolentSkillGame = await api("/api/game/new", { name: "pet-wildviolent-skill-test" });
wildViolentSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
wildViolentSkillGame = await api("/api/game/dialog", { game: wildViolentSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
wildViolentSkillGame.pets[0].PetSkillIds = [541];
wildViolentSkillGame.pets[0].PetSkills = [{
  Id: 541,
  Name: "狂暴攻击",
  Des: "防御力减30%，攻击力加100%，命中率下降30%",
  FuncName: "PETSKILL_WildViolentAttack",
  Option: "攻%+80 防%-35 回避30",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
wildViolentSkillGame.pets[0].PetId = 100;
wildViolentSkillGame.pets[0].WorkFixStr = 80;
wildViolentSkillGame.pets[0].WorkAttackPower = 80;
wildViolentSkillGame.pets[0].WorkFixTough = 100;
wildViolentSkillGame.pets[0].WorkDefencePower = 100;
wildViolentSkillGame.pets[0].WorkQuick = 999;
wildViolentSkillGame.pets[0].WorkFixDex = 999;
wildViolentSkillGame.encounter.EnemyId = 0;
wildViolentSkillGame.encounter.PetId = 0;
wildViolentSkillGame.encounter.Name = "狂暴测试敌人";
wildViolentSkillGame.encounter.WorkMaxHp = 999;
wildViolentSkillGame.encounter.Hp = 999;
wildViolentSkillGame.encounter.WorkFixTough = 1;
wildViolentSkillGame.encounter.WorkDefencePower = 1;
wildViolentSkillGame.encounter.WorkQuick = 0;
wildViolentSkillGame.encounter.WorkFixDex = 0;
wildViolentSkillGame.encounter.WorkAttackPower = 1;
wildViolentSkillGame.encounter.BattleStatuses = { paralysis: { turns: 1, label: "麻痹" } };
Object.assign(wildViolentSkillGame.battle?.enemyParty?.[0] || {}, {
  EnemyId: wildViolentSkillGame.encounter.EnemyId,
  PetId: wildViolentSkillGame.encounter.PetId,
  Name: wildViolentSkillGame.encounter.Name,
  WorkMaxHp: wildViolentSkillGame.encounter.WorkMaxHp,
  Hp: wildViolentSkillGame.encounter.Hp,
  WorkFixTough: wildViolentSkillGame.encounter.WorkFixTough,
  WorkDefencePower: wildViolentSkillGame.encounter.WorkDefencePower,
  WorkQuick: wildViolentSkillGame.encounter.WorkQuick,
  WorkFixDex: wildViolentSkillGame.encounter.WorkFixDex,
  WorkAttackPower: wildViolentSkillGame.encounter.WorkAttackPower,
  BattleStatuses: wildViolentSkillGame.encounter.BattleStatuses
});
const wildViolentHpBefore = Number(wildViolentSkillGame.encounter.Hp || 0);
wildViolentSkillGame = await api("/api/game/battle", { game: wildViolentSkillGame, action: "skill:0" });
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_WILDVIOLENTATTACK", "WildViolentAttack pet skill maps to source battle command");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.multiplier, 1, "WildViolentAttack pet skill leaves source attack percent in temporary WorkAttackPower");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.attackPercent, 80, "WildViolentAttack pet skill preserves source attack percent telemetry");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.missChance, 30, "WildViolentAttack pet skill preserves source miss telemetry");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.duckModifier, 30, "WildViolentAttack pet skill applies source duck modifier instead of whole-skill miss");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.defencePercent, -35, "WildViolentAttack pet skill preserves source defence percent telemetry");
assert(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hitCount >= 3 && wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hitCount <= 10, "WildViolentAttack pet skill rolls source 3-10 attack count");
assertEqual(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.damageDivisor, wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hitCount, "WildViolentAttack pet skill divides each hit by source attack count");
assert(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hits?.length >= 3 && wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hits?.length <= 10, "WildViolentAttack pet skill records the source multi-hit sequence");
assert(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hits?.some((hit) => Number(hit.damage || 0) > 0), "WildViolentAttack pet skill lands at least one source multi-hit strike in the fixture");
assert(wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hits?.filter((hit) => !hit.dodged).every((hit) => Number(hit.damageDivisor || 0) === wildViolentSkillGame.battleOutcome.playerAction?.petSkill?.hitCount), "WildViolentAttack pet skill records per-hit source damage divisor");
assertEqual(wildViolentSkillGame.pets[0].WorkAttackPower, 80, "WildViolentAttack pet skill restores temporary attack after the round");
assertEqual(wildViolentSkillGame.pets[0].WorkDefencePower, 100, "WildViolentAttack pet skill restores temporary defence after the round");
assert(Number(wildViolentSkillGame.encounter?.Hp || 0) < wildViolentHpBefore, "WildViolentAttack pet skill damages the active battle target");
let attackCrazedSkillGame = await api("/api/game/new", { name: "pet-attackcrazed-skill-test" });
attackCrazedSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
attackCrazedSkillGame = await api("/api/game/dialog", { game: attackCrazedSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
attackCrazedSkillGame.pets[0].PetSkillIds = [613];
attackCrazedSkillGame.pets[0].PetSkills = [{
  Id: 613,
  Name: "狂乱暴走",
  Des: "乱数攻击对手3次 攻20% 防30% 下降",
  FuncName: "PETSKILL_AttackCrazed",
  Option: "3",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
attackCrazedSkillGame.pets[0].PetId = 61300;
attackCrazedSkillGame.pets[0].WorkFixStr = 100;
attackCrazedSkillGame.pets[0].WorkAttackPower = 100;
attackCrazedSkillGame.pets[0].WorkFixTough = 100;
attackCrazedSkillGame.pets[0].WorkDefencePower = 100;
attackCrazedSkillGame.pets[0].WorkQuick = 999;
attackCrazedSkillGame.pets[0].WorkFixDex = 999;
attackCrazedSkillGame.encounter.EnemyId = 61301;
attackCrazedSkillGame.encounter.Name = "狂乱主目标";
attackCrazedSkillGame.encounter.WorkMaxHp = 999;
attackCrazedSkillGame.encounter.Hp = 999;
attackCrazedSkillGame.encounter.WorkFixTough = 1;
attackCrazedSkillGame.encounter.WorkDefencePower = 1;
attackCrazedSkillGame.encounter.WorkQuick = 0;
attackCrazedSkillGame.encounter.WorkFixDex = 0;
attackCrazedSkillGame.encounter.WorkAttackPower = 1;
attackCrazedSkillGame.battle.enemyParty = [
  { ...attackCrazedSkillGame.encounter },
  { ...attackCrazedSkillGame.encounter, EnemyId: 61302, Name: "狂乱随机目标", Hp: 999, WorkMaxHp: 999 },
  { ...attackCrazedSkillGame.encounter, EnemyId: 61303, Name: "狂乱备用目标", Hp: 999, WorkMaxHp: 999 }
];
attackCrazedSkillGame.battle.activeEnemyIndex = 0;
const attackCrazedRandomTargetHpBefore = Number(attackCrazedSkillGame.battle.enemyParty[1].Hp || 0);
const originalRandomForAttackCrazed = Math.random;
try {
  Math.random = () => 0.5;
  attackCrazedSkillGame = await api("/api/game/battle", { game: attackCrazedSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForAttackCrazed;
}
const attackCrazedTelemetry = attackCrazedSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(attackCrazedSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ATTCRAZED", "AttackCrazed pet skill maps to source battle command");
assertEqual(attackCrazedTelemetry?.hitCount, 3, "AttackCrazed pet skill uses source option attack count");
assertEqual(attackCrazedTelemetry?.attackPercent, -20, "AttackCrazed applies source temporary attack penalty");
assertEqual(attackCrazedTelemetry?.defencePercent, -30, "AttackCrazed applies source temporary defence penalty");
assertEqual(attackCrazedTelemetry?.targetScope, "enemy-random", "AttackCrazed records source random enemy target scope");
assertEqual(attackCrazedTelemetry?.hits?.length, 3, "AttackCrazed records three source random attacks");
assert(attackCrazedTelemetry?.hits?.every((hit) => Number(hit.damageDivisor || 0) === 1), "AttackCrazed does not divide damage per hit in source behavior");
assert(attackCrazedTelemetry?.hits?.every((hit) => Number(hit.targetSlot || 0) === 1), "AttackCrazed source random fixture targets the same live enemy slot");
assert(Number(attackCrazedSkillGame.battle.enemyParty[1]?.Hp || 0) < attackCrazedRandomTargetHpBefore, "AttackCrazed damages the randomly selected enemy slot");
assertEqual(attackCrazedSkillGame.pets[0].WorkAttackPower, 100, "AttackCrazed restores temporary attack after the round");
assertEqual(attackCrazedSkillGame.pets[0].WorkDefencePower, 100, "AttackCrazed restores temporary defence after the round");
let attackShootSkillGame = await api("/api/game/new", { name: "pet-attackshoot-skill-test" });
attackShootSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
attackShootSkillGame = await api("/api/game/dialog", { game: attackShootSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
attackShootSkillGame.pets[0].PetSkillIds = [614];
attackShootSkillGame.pets[0].PetSkills = [{
  Id: 614,
  Name: "栗子连激",
  Des: "乱数连续投掷栗子3~5颗",
  FuncName: "PETSKILL_AttackShoot",
  Option: "5|5",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
attackShootSkillGame.pets[0].PetId = 61400;
attackShootSkillGame.pets[0].WorkFixStr = 120;
attackShootSkillGame.pets[0].WorkAttackPower = 120;
attackShootSkillGame.pets[0].WorkFixTough = 100;
attackShootSkillGame.pets[0].WorkDefencePower = 100;
attackShootSkillGame.pets[0].WorkQuick = 999;
attackShootSkillGame.pets[0].WorkFixDex = 999;
attackShootSkillGame.encounter.EnemyId = 61401;
attackShootSkillGame.encounter.Name = "栗子测试敌人";
attackShootSkillGame.encounter.WorkMaxHp = 999;
attackShootSkillGame.encounter.Hp = 999;
attackShootSkillGame.encounter.WorkFixTough = 1;
attackShootSkillGame.encounter.WorkDefencePower = 1;
attackShootSkillGame.encounter.WorkQuick = 0;
attackShootSkillGame.encounter.WorkFixDex = 0;
attackShootSkillGame.encounter.WorkAttackPower = 1;
attackShootSkillGame.encounter.NoDuck = 1;
Object.assign(attackShootSkillGame.battle?.enemyParty?.[0] || {}, {
  ...attackShootSkillGame.encounter,
  BattleStatuses: {}
});
const attackShootHpBefore = Number(attackShootSkillGame.encounter.Hp || 0);
const originalRandomForAttackShoot = Math.random;
try {
  Math.random = () => 0.99; // Force the source sleep RAND(1,5)>4 branch in this fixture.
  attackShootSkillGame = await api("/api/game/battle", { game: attackShootSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForAttackShoot;
}
const attackShootTelemetry = attackShootSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(attackShootSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ATTSHOOT", "AttackShoot pet skill maps to source battle command");
assertEqual(attackShootTelemetry?.hitCount, 5, "AttackShoot pet skill rolls within the source hit count range in the fixture");
assertEqual(attackShootTelemetry?.damageDivisor, 5, "AttackShoot divides each hit damage by source attack count");
assertEqual(attackShootTelemetry?.sleepOnHitChance, 20, "AttackShoot preserves source 20 percent sleep-on-hit chance");
assertEqual(attackShootTelemetry?.counterSuppressed, true, "AttackShoot records source counter suppression semantics");
assertEqual(attackShootTelemetry?.targetScope, "enemy-random", "AttackShoot uses source random enemy target scope");
assertEqual(attackShootTelemetry?.hits?.length, 5, "AttackShoot records source chestnut hits");
assert(attackShootTelemetry?.hits?.every((hit) => Number(hit.damageDivisor || 0) === 5), "AttackShoot records per-hit source damage divisor");
assert(attackShootTelemetry?.hits?.some((hit) => hit.onHitStatus?.success), "AttackShoot can apply source sleep after landed damage");
const attackShootTargetSlot = Math.max(0, Number(attackShootTelemetry?.hits?.[0]?.targetSlot || 0));
const attackShootTarget = attackShootSkillGame.battle?.enemyParty?.[attackShootTargetSlot] || attackShootSkillGame.encounter;
assert(Number(attackShootTarget?.Hp || 0) < attackShootHpBefore, "AttackShoot damages the actual source-random target");
assert(Number(attackShootTarget?.BattleStatuses?.sleep?.turns || 0) > 0, "AttackShoot persists source sleep status on the actual target");
let battleTearSkillGame = await api("/api/game/new", { name: "pet-battletear-skill-test" });
battleTearSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
battleTearSkillGame = await api("/api/game/dialog", { game: battleTearSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
battleTearSkillGame.pets[0].PetSkillIds = [616];
battleTearSkillGame.pets[0].PetSkills = [{
  Id: 616,
  Name: "撕裂伤口2",
  Des: "撕裂旧伤口 增加50%伤害",
  FuncName: "PETSKILL_BattleTearDamage",
  Option: "50",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
battleTearSkillGame.pets[0].PetId = 61600;
battleTearSkillGame.pets[0].WorkFixStr = 100;
battleTearSkillGame.pets[0].WorkAttackPower = 100;
battleTearSkillGame.pets[0].WorkFixTough = 100;
battleTearSkillGame.pets[0].WorkDefencePower = 100;
battleTearSkillGame.pets[0].WorkQuick = 10;
battleTearSkillGame.pets[0].WorkFixDex = 10;
battleTearSkillGame.encounter.EnemyId = 61601;
battleTearSkillGame.encounter.Name = "旧伤测试敌人";
battleTearSkillGame.encounter.WorkMaxHp = 500;
battleTearSkillGame.encounter.Hp = 300;
battleTearSkillGame.encounter.WorkFixTough = 1;
battleTearSkillGame.encounter.WorkDefencePower = 1;
battleTearSkillGame.encounter.WorkQuick = 10;
battleTearSkillGame.encounter.WorkFixDex = 10;
battleTearSkillGame.encounter.WorkAttackPower = 1;
Object.assign(battleTearSkillGame.battle?.enemyParty?.[0] || {}, battleTearSkillGame.encounter);
const battleTearHpBefore = Number(battleTearSkillGame.encounter.Hp || 0);
const originalRandomForBattleTear = Math.random;
try {
  Math.random = () => 0.99;
  battleTearSkillGame = await api("/api/game/battle", { game: battleTearSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForBattleTear;
}
const battleTearTelemetry = battleTearSkillGame.battleOutcome.playerAction?.petSkill;
const battleTearHit = battleTearTelemetry?.hits?.[0];
assertEqual(battleTearSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_PETSKILLTEAR", "BattleTearDamage pet skill maps to source battle command");
assertEqual(battleTearTelemetry?.attackPercent, -10, "BattleTearDamage applies source temporary attack penalty");
assertEqual(battleTearTelemetry?.defencePercent, -20, "BattleTearDamage applies source temporary defence penalty");
assertEqual(battleTearTelemetry?.tearDamagePercent, 50, "BattleTearDamage preserves source old-wound damage percent");
assertEqual(battleTearHit?.tearDamage?.missingHp, 200, "BattleTearDamage computes source missing HP before the hit");
assertEqual(battleTearHit?.tearDamage?.addedDamage, 100, "BattleTearDamage adds missing HP percent to landed damage");
assert(Number(battleTearHit?.damage || 0) > Number(battleTearHit?.tearDamage?.addedDamage || 0), "BattleTearDamage keeps base hit damage plus tear damage");
assert(Number(battleTearSkillGame.encounter?.Hp || 0) < battleTearHpBefore - 99, "BattleTearDamage applies old-wound bonus to the active target");
assertEqual(battleTearSkillGame.pets[0].WorkAttackPower, 100, "BattleTearDamage restores temporary attack after the round");
assertEqual(battleTearSkillGame.pets[0].WorkDefencePower, 100, "BattleTearDamage restores temporary defence after the round");
let hectorSkillGame = await api("/api/game/new", { name: "pet-hector-skill-test" });
hectorSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
hectorSkillGame = await api("/api/game/dialog", { game: hectorSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
hectorSkillGame.pets[0].PetSkillIds = [620];
hectorSkillGame.pets[0].PetSkills = [{
  Id: 620,
  Name: "威吓攻击",
  Des: "攻击力下降30% 敏捷下降30% 有60%的机率使对手麻痹一回合",
  FuncName: "PETSKILL_Hector",
  Option: "麻 turn 1 攻%-30 敏%-30",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
hectorSkillGame.pets[0].PetId = 62000;
hectorSkillGame.pets[0].WorkFixStr = 100;
hectorSkillGame.pets[0].WorkAttackPower = 100;
hectorSkillGame.pets[0].WorkFixTough = 100;
hectorSkillGame.pets[0].WorkDefencePower = 100;
hectorSkillGame.pets[0].WorkQuick = 100;
hectorSkillGame.pets[0].WorkFixDex = 100;
hectorSkillGame.pets[0].Hp = 999;
hectorSkillGame.pets[0].WorkMaxHp = 999;
hectorSkillGame.encounter.EnemyId = 62002;
hectorSkillGame.encounter.Name = "威吓测试敌人";
hectorSkillGame.encounter.WorkMaxHp = 999;
hectorSkillGame.encounter.Hp = 999;
hectorSkillGame.encounter.WorkFixTough = 1;
hectorSkillGame.encounter.WorkDefencePower = 1;
hectorSkillGame.encounter.WorkQuick = 1;
hectorSkillGame.encounter.WorkFixDex = 1;
hectorSkillGame.encounter.WorkAttackPower = 1;
Object.assign(hectorSkillGame.battle?.enemyParty?.[0] || {}, hectorSkillGame.encounter);
const hectorOriginalRandom = Math.random;
try {
  Math.random = () => 0.99;
  hectorSkillGame = await api("/api/game/battle", { game: hectorSkillGame, action: "skill:0" });
} finally {
  Math.random = hectorOriginalRandom;
}
const hectorTelemetry = hectorSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(hectorSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_HECTOR", "Hector pet skill maps to source battle command");
assertEqual(hectorTelemetry?.attackPercent, -30, "Hector applies source temporary attack percent");
assertEqual(hectorTelemetry?.quickPercent, -30, "Hector applies source temporary quick percent");
assertEqual(hectorTelemetry?.quickPercentFromFixDex, true, "Hector quick penalty uses source WorkFixDex base");
assertEqual(hectorTelemetry?.status?.chance, 60, "Hector uses source default 60 percent paralysis chance");
assertEqual(hectorTelemetry?.status?.status?.key, "paralysis", "Hector parses source paralysis status");
assertEqual(hectorTelemetry?.status?.status?.turn, 1, "Hector parses source one-turn paralysis");
assertEqual(typeof hectorTelemetry?.status?.success, "boolean", "Hector records a deterministic source paralysis roll result");
assertEqual(hectorSkillGame.pets[0].WorkAttackPower, 100, "Hector restores temporary attack after the round");
assertEqual(hectorSkillGame.pets[0].WorkQuick, 100, "Hector restores temporary quick after the round");
let weakenSkillGame = await api("/api/game/new", { name: "pet-weaken-skill-test" });
weakenSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
weakenSkillGame = await api("/api/game/dialog", { game: weakenSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
weakenSkillGame.pets[0].PetSkillIds = [576];
weakenSkillGame.pets[0].PetSkills = [{
  Id: 576,
  Name: "全体虚弱",
  Des: "敌全体三回合内攻防敏下降20%",
  FuncName: "PETSKILL_Weaken",
  Option: "虚 turn 3 成 50",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
weakenSkillGame.pets[0].PetId = 57600;
weakenSkillGame.pets[0].WorkQuick = 999;
weakenSkillGame.pets[0].WorkFixDex = 999;
weakenSkillGame.pets[0].Hp = 999;
weakenSkillGame.pets[0].WorkMaxHp = 999;
weakenSkillGame.encounter.EnemyId = 57605;
weakenSkillGame.encounter.Name = "虚弱测试敌人A";
weakenSkillGame.encounter.WorkMaxHp = 999;
weakenSkillGame.encounter.Hp = 999;
weakenSkillGame.encounter.WorkQuick = 1;
weakenSkillGame.encounter.WorkFixDex = 1;
weakenSkillGame.encounter.WorkAttackPower = 1;
const weakenEnemyTwo = {
  ...weakenSkillGame.encounter,
  EnemyId: 57608,
  Name: "虚弱测试敌人B",
  Hp: 999,
  WorkMaxHp: 999
};
weakenSkillGame.battle.enemyParty = [weakenSkillGame.encounter, weakenEnemyTwo];
const weakenOriginalRandom = Math.random;
try {
  Math.random = () => 0.99;
  weakenSkillGame = await api("/api/game/battle", { game: weakenSkillGame, action: "skill:0" });
} finally {
  Math.random = weakenOriginalRandom;
}
const weakenTelemetry = weakenSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(weakenSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_WEAKEN", "Weaken pet skill maps to source battle command");
assertEqual(weakenTelemetry?.targetScope, "enemy-all", "Weaken Target=3 uses all live enemy targets");
assertEqual(weakenTelemetry?.totalDamage, 0, "Weaken source pet skill does not deal direct attack damage");
assertEqual(weakenTelemetry?.status?.status?.key, "weaken", "Weaken parses source weak status");
assertEqual(weakenTelemetry?.status?.rolls?.length, 2, "Weaken records a status roll per live enemy target");
assert(weakenTelemetry?.status?.rolls?.every((roll) => roll.chance === 50 && roll.success), "Weaken uses source 成 success percent for every target fixture");
assert(Number(weakenSkillGame.battle.enemyParty[0]?.BattleStatuses?.weaken?.turns || 0) > 0, "Weaken persists status on the active enemy target");
assert(Number(weakenSkillGame.battle.enemyParty[1]?.BattleStatuses?.weaken?.turns || 0) > 0, "Weaken persists status on the second enemy target");
let refreshSkillGame = await api("/api/game/new", { name: "pet-refresh-skill-test" });
refreshSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
refreshSkillGame = await api("/api/game/dialog", { game: refreshSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
refreshSkillGame.pets[0].PetSkillIds = [592];
refreshSkillGame.pets[0].PetSkills = [{
  Id: 592,
  Name: "净化",
  Des: "解除所有异常状态",
  FuncName: "PETSKILL_Refresh",
  Option: "全",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
refreshSkillGame.pets[0].WorkQuick = 999;
refreshSkillGame.pets[0].WorkFixDex = 999;
refreshSkillGame.pets[0].Hp = 999;
refreshSkillGame.pets[0].WorkMaxHp = 999;
refreshSkillGame.player.BattleStatuses = {
  poison: { key: "poison", label: "中毒", turns: 3 },
  weaken: { key: "weaken", label: "虚弱", turns: 3 }
};
refreshSkillGame.pets[0].BattleStatuses = {
  weaken: { key: "weaken", label: "虚弱", turns: 3 }
};
refreshSkillGame.encounter.BattleStatuses = {
  poison: { key: "poison", label: "中毒", turns: 3 }
};
refreshSkillGame.encounter.WorkAttackPower = 1;
refreshSkillGame.encounter.WorkQuick = 1;
refreshSkillGame.encounter.WorkFixDex = 1;
Object.assign(refreshSkillGame.battle?.enemyParty?.[0] || {}, {
  BattleStatuses: refreshSkillGame.encounter.BattleStatuses,
  WorkAttackPower: refreshSkillGame.encounter.WorkAttackPower,
  WorkQuick: refreshSkillGame.encounter.WorkQuick,
  WorkFixDex: refreshSkillGame.encounter.WorkFixDex
});
refreshSkillGame = await api("/api/game/battle", { game: refreshSkillGame, action: "skill:0" });
const refreshTelemetry = refreshSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(refreshSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_REFRESH", "Refresh pet skill maps to source battle command");
assertEqual(refreshTelemetry?.targetScope, "ally-side", "Refresh Target=2 uses ally-side targets");
assertEqual(refreshTelemetry?.totalDamage, 0, "Refresh source pet skill does not deal direct attack damage");
assert(refreshTelemetry?.refresh?.success, "Refresh reports successful source status recovery");
assert(refreshTelemetry?.refresh?.results?.some((result) => result.targetKind === "player" && result.removed.includes("poison") && result.removed.includes("weaken")), "Refresh clears all matching player statuses");
assert(refreshTelemetry?.refresh?.results?.some((result) => result.targetKind === "pet" && result.removed.includes("weaken")), "Refresh clears active pet status");
assert(!refreshSkillGame.player.BattleStatuses?.poison && !refreshSkillGame.player.BattleStatuses?.weaken, "Refresh persists player status cleanup");
assert(!refreshSkillGame.pets[0].BattleStatuses?.weaken, "Refresh persists pet status cleanup");
assert(refreshSkillGame.encounter.BattleStatuses?.poison, "Refresh does not clear enemy status when targeting ally side");
let advancedStatusSkillGame = await api("/api/game/new", { name: "pet-advanced-status-skill-test" });
advancedStatusSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
advancedStatusSkillGame = await api("/api/game/dialog", { game: advancedStatusSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
advancedStatusSkillGame.pets[0].PetSkillIds = [578];
advancedStatusSkillGame.pets[0].PetSkills = [{
  Id: 578,
  Name: "全体剧毒",
  Des: "敌全体中毒5回合，第六回合前未解则阵亡",
  FuncName: "PETSKILL_Deeppoison",
  Option: "剧 turn 5 成 50",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
advancedStatusSkillGame.pets[0].PetId = 57800;
advancedStatusSkillGame.pets[0].WorkQuick = 999;
advancedStatusSkillGame.pets[0].WorkFixDex = 999;
advancedStatusSkillGame.pets[0].Hp = 999;
advancedStatusSkillGame.pets[0].WorkMaxHp = 999;
advancedStatusSkillGame.encounter.EnemyId = 57805;
advancedStatusSkillGame.encounter.Name = "剧毒测试敌人A";
advancedStatusSkillGame.encounter.WorkMaxHp = 999;
advancedStatusSkillGame.encounter.Hp = 999;
advancedStatusSkillGame.encounter.WorkQuick = 1;
advancedStatusSkillGame.encounter.WorkFixDex = 1;
advancedStatusSkillGame.encounter.WorkAttackPower = 1;
const advancedStatusEnemyTwo = {
  ...advancedStatusSkillGame.encounter,
  EnemyId: 57809,
  Name: "剧毒测试敌人B",
  Hp: 999,
  WorkMaxHp: 999
};
advancedStatusSkillGame.battle.enemyParty = [advancedStatusSkillGame.encounter, advancedStatusEnemyTwo];
advancedStatusSkillGame = await api("/api/game/battle", { game: advancedStatusSkillGame, action: "skill:0" });
const advancedStatusTelemetry = advancedStatusSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(advancedStatusSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_DEEPPOISON", "Deeppoison pet skill maps to source battle command");
assertEqual(advancedStatusTelemetry?.targetScope, "enemy-all", "Deeppoison Target=3 uses all live enemy targets");
assertEqual(advancedStatusTelemetry?.totalDamage, 0, "Deeppoison source pet skill does not deal direct attack damage");
assertEqual(advancedStatusTelemetry?.status?.status?.key, "deepPoison", "Deeppoison parses source deep poison status");
assertEqual(advancedStatusTelemetry?.status?.status?.turn, 5, "Deeppoison parses source turn count");
assert(advancedStatusTelemetry?.status?.rolls?.every((roll) => roll.chance === 50 && roll.success), "Deeppoison uses source 成 success percent for every target fixture");
assert(Number(advancedStatusSkillGame.battle.enemyParty[0]?.BattleStatuses?.deepPoison?.turns || 0) > 0, "Deeppoison persists status on the active enemy target");
assert(Number(advancedStatusSkillGame.battle.enemyParty[1]?.BattleStatuses?.deepPoison?.turns || 0) > 0, "Deeppoison persists status on the second enemy target");
let sarsSkillGame = await api("/api/game/new", { name: "pet-sars-skill-test" });
sarsSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
sarsSkillGame = await api("/api/game/dialog", { game: sarsSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
sarsSkillGame.pets[0].PetSkillIds = [617];
sarsSkillGame.pets[0].PetSkills = [{
  Id: 617,
  Name: "毒煞蔓延",
  Des: "让对手中毒且有机会传染到周围的人",
  FuncName: "PETSKILL_Sars",
  Option: "煞 turn 3 成 100",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
sarsSkillGame.pets[0].PetId = 61700;
sarsSkillGame.pets[0].WorkQuick = 999;
sarsSkillGame.pets[0].WorkFixDex = 999;
sarsSkillGame.pets[0].Hp = 999;
sarsSkillGame.pets[0].WorkMaxHp = 999;
sarsSkillGame.encounter.EnemyId = 61705;
sarsSkillGame.encounter.Name = "煞毒测试敌人A";
sarsSkillGame.encounter.WorkMaxHp = 999;
sarsSkillGame.encounter.Hp = 999;
sarsSkillGame.encounter.WorkQuick = 1;
sarsSkillGame.encounter.WorkFixDex = 1;
sarsSkillGame.encounter.WorkAttackPower = 1;
const sarsEnemyTwo = {
  ...sarsSkillGame.encounter,
  EnemyId: 61709,
  Name: "煞毒测试敌人B",
  Hp: 999,
  WorkMaxHp: 999
};
sarsSkillGame.battle.enemyParty = [sarsSkillGame.encounter, sarsEnemyTwo];
sarsSkillGame = await api("/api/game/battle", { game: sarsSkillGame, action: "skill:0" });
const sarsTelemetry = sarsSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(sarsSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SARS", "Sars pet skill maps to source battle command");
assertEqual(sarsTelemetry?.targetScope, "enemy-all", "Sars Target=3 uses all live enemy targets");
assertEqual(sarsTelemetry?.totalDamage, 0, "Sars source pet skill does not deal direct attack damage");
assertEqual(sarsTelemetry?.status?.status?.key, "sars", "Sars parses source sars poison status");
assertEqual(sarsTelemetry?.status?.status?.turn, 3, "Sars parses source turn count");
assertEqual(sarsTelemetry?.status?.status?.fixedChance, 100, "Sars parses source 成 success percent");
assert(sarsTelemetry?.status?.rolls?.every((roll) => roll.chance === 80 && roll.success), "Sars status chance goes through source status cap for every target fixture");
assert(Number(sarsSkillGame.battle.enemyParty[0]?.BattleStatuses?.sars?.turns || 0) > 0, "Sars persists status on the active enemy target");
assert(Number(sarsSkillGame.battle.enemyParty[1]?.BattleStatuses?.sars?.turns || 0) > 0, "Sars persists status on the second enemy target");
let barrierSkillGame = await api("/api/game/new", { name: "pet-barrier-skill-test" });
barrierSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
barrierSkillGame = await api("/api/game/dialog", { game: barrierSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
barrierSkillGame.pets[0].PetSkillIds = [594];
barrierSkillGame.pets[0].PetSkills = [{
  Id: 594,
  Name: "究极魔障",
  Des: "敌全体三回合无法行动",
  FuncName: "PETSKILL_Barrier",
  Option: "障 turn 3 成 50",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
barrierSkillGame.pets[0].PetId = 59400;
barrierSkillGame.pets[0].WorkQuick = 999;
barrierSkillGame.pets[0].WorkFixDex = 999;
barrierSkillGame.pets[0].Hp = 999;
barrierSkillGame.pets[0].WorkMaxHp = 999;
barrierSkillGame.encounter.EnemyId = 59402;
barrierSkillGame.encounter.Name = "魔障测试敌人A";
barrierSkillGame.encounter.WorkMaxHp = 999;
barrierSkillGame.encounter.Hp = 999;
barrierSkillGame.encounter.WorkQuick = 1;
barrierSkillGame.encounter.WorkFixDex = 1;
barrierSkillGame.encounter.WorkAttackPower = 80;
const barrierEnemyTwo = {
  ...barrierSkillGame.encounter,
  EnemyId: 59403,
  Name: "魔障测试敌人B",
  Hp: 999,
  WorkMaxHp: 999
};
barrierSkillGame.battle.enemyParty = [barrierSkillGame.encounter, barrierEnemyTwo];
barrierSkillGame = await api("/api/game/battle", { game: barrierSkillGame, action: "skill:0" });
const barrierTelemetry = barrierSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(barrierSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_BARRIER", "Barrier pet skill maps to source battle command");
assertEqual(barrierTelemetry?.status?.status?.key, "barrier", "Barrier parses source barrier status");
assert(barrierTelemetry?.status?.rolls?.every((roll) => roll.chance === 50 && roll.success), "Barrier uses source 成 success percent for every target fixture");
assert(Number(barrierSkillGame.battle.enemyParty[0]?.BattleStatuses?.barrier?.turns || 0) > 0, "Barrier persists blocking status on active enemy");
const petHpBeforeBarrierWait = Number(barrierSkillGame.pets[0].Hp || 0);
barrierSkillGame = await api("/api/game/battle", { game: barrierSkillGame, action: "wait" });
assertEqual(Number(barrierSkillGame.pets[0].Hp || 0), petHpBeforeBarrierWait, "Barrier blocks the next enemy turn before it can attack");
assert(barrierSkillGame.battleOutcome?.log?.some((line) => line.includes("魔障") && line.includes("无法行动")), "Barrier records source-style blocked-turn log");
let noCastSkillGame = await api("/api/game/new", { name: "pet-nocast-skill-test" });
noCastSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
noCastSkillGame = await api("/api/game/dialog", { game: noCastSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
noCastSkillGame.pets[0].PetSkillIds = [580];
noCastSkillGame.pets[0].PetSkills = [{
  Id: 580,
  Name: "沉默",
  Des: "敌全体无法使用咒术三回合",
  FuncName: "PETSKILL_Nocast",
  Option: "默 turn 3 成 50",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
noCastSkillGame.pets[0].PetId = 58000;
noCastSkillGame.pets[0].WorkQuick = 999;
noCastSkillGame.pets[0].WorkFixDex = 999;
noCastSkillGame.pets[0].Hp = 999;
noCastSkillGame.pets[0].WorkMaxHp = 999;
noCastSkillGame.encounter.EnemyId = 58002;
noCastSkillGame.encounter.Name = "沉默测试敌人";
noCastSkillGame.encounter.WorkMaxHp = 999;
noCastSkillGame.encounter.Hp = 999;
noCastSkillGame.encounter.WorkQuick = 1;
noCastSkillGame.encounter.WorkFixDex = 1;
noCastSkillGame.encounter.WorkAttackPower = 1;
noCastSkillGame.battle.enemyParty = [noCastSkillGame.encounter];
noCastSkillGame = await api("/api/game/battle", { game: noCastSkillGame, action: "skill:0" });
const noCastTelemetry = noCastSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(noCastSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_NOCAST", "Nocast pet skill maps to source battle command");
assertEqual(noCastTelemetry?.status?.key || noCastTelemetry?.status?.status?.key, "noCast", "Nocast parses source no-cast status");
assertEqual(noCastTelemetry?.status?.chance, 50, "Nocast uses source 成 success percent");
assert(noCastTelemetry?.status?.success, "Nocast deterministic fixture applies the status");
assert(Number(noCastSkillGame.battle.enemyParty[0]?.BattleStatuses?.noCast?.turns || 0) > 0, "Nocast persists no-cast status without blocking ordinary enemy attacks");
let sonicSkillGame = await api("/api/game/new", { name: "pet-sonic-skill-test" });
sonicSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
sonicSkillGame = await api("/api/game/dialog", { game: sonicSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
sonicSkillGame.pets[0].PetSkillIds = [618];
sonicSkillGame.pets[0].PetSkills = [{
  Id: 618,
  Name: "音波冲击",
  Des: "攻击宠物时可贯穿伤害至人物身上",
  FuncName: "PETSKILL_Sonic",
  Option: "",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(sonicSkillGame.pets[0], {
  PetId: 61800,
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 140,
  WorkFixStr: 140,
  WorkQuick: 999,
  WorkFixDex: 999
});
const sonicOwnerEnemy = {
  ...sonicSkillGame.encounter,
  EnemyId: 61801,
  Name: "音波主人目标",
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1
};
const sonicPetEnemy = {
  ...sonicOwnerEnemy,
  EnemyId: 61805,
  Name: "音波宠物目标",
  Hp: 999,
  WorkMaxHp: 999
};
sonicSkillGame.encounter = sonicPetEnemy;
sonicSkillGame.battle.activeEnemyIndex = 5;
sonicSkillGame.battle.enemyParty = [
  sonicOwnerEnemy,
  { ...sonicOwnerEnemy, EnemyId: 61802, Name: "空位1", Hp: 0 },
  { ...sonicOwnerEnemy, EnemyId: 61803, Name: "空位2", Hp: 0 },
  { ...sonicOwnerEnemy, EnemyId: 61804, Name: "空位3", Hp: 0 },
  { ...sonicOwnerEnemy, EnemyId: 61806, Name: "空位4", Hp: 0 },
  sonicPetEnemy
];
sonicSkillGame = await api("/api/game/battle", { game: sonicSkillGame, action: "skill:0:5" });
const sonicTelemetry = sonicSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(sonicSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SONIC", "Sonic pet skill maps to source battle command");
assert(sonicTelemetry?.hits?.[0]?.damage > 0, "Sonic deals direct damage to the pet-slot target");
assertEqual(sonicTelemetry?.hits?.[0]?.sourceCommand, "BATTLE_COM_S_SONIC", "Sonic primary hit records source command");
assertEqual(sonicTelemetry?.sonicPiercePercent, 50, "Sonic records source SONIC2 half-damage percent");
assert(sonicTelemetry?.sonicPierce?.success, "Sonic resolves source owner pierce when target is a pet slot");
assertEqual(sonicTelemetry?.sonicPierce?.sourceCommand, "BATTLE_COM_S_SONIC2", "Sonic pierce maps to source SONIC2 command");
assertEqual(sonicTelemetry?.sonicPierce?.ownerSlot, 0, "Sonic pet slot 5 pierces to owner slot 0");
assert(sonicTelemetry?.sonicPierce?.damage > 0, "Sonic pierce deals owner half damage");
assert(Number(sonicSkillGame.battle.enemyParty[0]?.Hp || 0) < 999, "Sonic persists owner pierce HP loss");
assert(Number(sonicSkillGame.battle.enemyParty[5]?.Hp || 0) < 999, "Sonic persists primary pet-target HP loss");
let battleModelSkillGame = await api("/api/game/new", { name: "pet-battlemodel-skill-test" });
battleModelSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
battleModelSkillGame = await api("/api/game/dialog", { game: battleModelSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
battleModelSkillGame.pets[0].PetSkillIds = [638];
battleModelSkillGame.pets[0].PetSkills = [{
  Id: 638,
  Name: "群蜂乱舞",
  Des: "攻击力下降30% 全体麻痹一回合",
  FuncName: "PETSKILL_BattleModel",
  Option: "5|4|麻|1|100|攻%-30|101867 101868",
  Field: 1,
  Target: 3,
  UseType: 3,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(battleModelSkillGame.pets[0], {
  PetId: 63800,
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 200,
  WorkFixStr: 200,
  WorkDefencePower: 80,
  WorkFixTough: 80,
  WorkQuick: 999,
  WorkFixDex: 999
});
const battleModelTargets = [0, 1, 2].map((index) => ({
  ...battleModelSkillGame.encounter,
  EnemyId: 63810 + index,
  Name: `战斗模型目标${index + 1}`,
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
}));
battleModelSkillGame.encounter = battleModelTargets[0];
battleModelSkillGame.battle.enemyParty = battleModelTargets;
battleModelSkillGame.battle.activeEnemyIndex = 0;
const originalRandomForBattleModel = Math.random;
try {
  Math.random = () => 0.1;
  battleModelSkillGame = await api("/api/game/battle", { game: battleModelSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForBattleModel;
}
const battleModelTelemetry = battleModelSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(battleModelSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_BATTLE_MODEL", "BattleModel pet skill maps to source battle command");
assertEqual(battleModelTelemetry?.battleModel?.type, 5, "BattleModel parses source attack type");
assertEqual(battleModelTelemetry?.battleModel?.objectNum, 4, "BattleModel parses source attack object count");
assertEqual(battleModelTelemetry?.battleModel?.status?.key, "paralysis", "BattleModel parses source status token");
assertEqual(battleModelTelemetry?.battleModel?.statusChance, 100, "BattleModel parses source status chance");
assertEqual(battleModelTelemetry?.attackPercent, -30, "BattleModel applies source attack percent as temporary WorkAttackPower");
assertEqual(battleModelTelemetry?.targetScope, "enemy-battle-model", "BattleModel records source multi-target scope");
assert(battleModelTelemetry?.hits?.length >= 3, "BattleModel attacks each live enemy target before repeating");
assert(battleModelTelemetry.hits.slice(0, 3).every((hit) => hit.sourceCommand === "BATTLE_COM_S_BATTLE_MODEL"), "BattleModel hit telemetry records source command");
assertEqual(battleModelTelemetry.hits?.[0]?.actionNumber, 101867, "BattleModel first hit uses first source action image");
assertEqual(battleModelTelemetry.hits?.[1]?.actionNumber, 101868, "BattleModel second hit uses second source action image");
assertEqual(battleModelTelemetry.hits?.[2]?.actionNumber, 101867, "BattleModel cycles source action images");
assert(battleModelTelemetry.hits.slice(0, 3).every((hit) => Number(hit.damage || 0) > 0), "BattleModel damages each live target");
assert(battleModelTelemetry?.status?.rolls?.length >= 3, "BattleModel rolls status for each damaged live target");
assert(battleModelTelemetry.status.rolls.every((roll) => roll.chance === 80), "BattleModel status rolls preserve the source-style capped hit chance");
assert(battleModelTelemetry.status.rolls.some((roll) => roll.success), "BattleModel can apply source status after landed damage");
assert(battleModelSkillGame.battle.enemyParty.slice(0, 3).some((enemy) => Number(enemy?.BattleStatuses?.paralysis?.turns || 0) > 0), "BattleModel persists source paralysis on successful damaged targets");
assertEqual(battleModelSkillGame.pets[0].WorkAttackPower, 200, "BattleModel restores temporary attack after the round");
let fallGroundSkillGame = await api("/api/game/new", { name: "pet-fallground-skill-test" });
fallGroundSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
fallGroundSkillGame = await api("/api/game/dialog", { game: fallGroundSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
fallGroundSkillGame.pets[0].PetSkillIds = [210];
fallGroundSkillGame.pets[0].PetSkills = [{
  Id: 210,
  Name: "落马术",
  Des: "落马",
  FuncName: "PETSKILL_FallGround",
  Option: "攻%-30",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(fallGroundSkillGame.pets[0], {
  PetId: 21000,
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 140,
  WorkFixStr: 140,
  WorkDefencePower: 80,
  WorkFixTough: 80,
  WorkQuick: 999,
  WorkFixDex: 999
});
Object.assign(fallGroundSkillGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(fallGroundSkillGame.battle?.enemyParty?.[0] || {}, {
  Hp: fallGroundSkillGame.encounter.Hp,
  WorkMaxHp: fallGroundSkillGame.encounter.WorkMaxHp,
  WorkDefencePower: fallGroundSkillGame.encounter.WorkDefencePower,
  WorkFixTough: fallGroundSkillGame.encounter.WorkFixTough,
  WorkQuick: fallGroundSkillGame.encounter.WorkQuick,
  WorkFixDex: fallGroundSkillGame.encounter.WorkFixDex,
  WorkAttackPower: fallGroundSkillGame.encounter.WorkAttackPower,
  WorkTacticsOption: fallGroundSkillGame.encounter.WorkTacticsOption
});
fallGroundSkillGame = await api("/api/game/battle", { game: fallGroundSkillGame, action: "skill:0" });
const fallGroundTelemetry = fallGroundSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(fallGroundSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_FALLRIDE", "FallGround pet skill maps to source battle command");
assertEqual(fallGroundTelemetry?.attackPercent, -30, "FallGround parses source attack percent");
assertEqual(fallGroundTelemetry?.fallGround?.sourceCommand, "BATTLE_COM_S_FALLRIDE", "FallGround records source fall-ride telemetry");
assertEqual(fallGroundTelemetry?.fallGround?.ridingEffect, "single-player-no-riding-target", "FallGround keeps riding effect inert until riding actors exist");
assertEqual(fallGroundTelemetry?.hits?.[0]?.sourceCommand, "BATTLE_COM_S_FALLRIDE", "FallGround hit telemetry records source command");
assert(fallGroundTelemetry?.hits?.[0]?.damage > 0, "FallGround deals source attack damage");
assertEqual(fallGroundSkillGame.pets[0].WorkAttackPower, 140, "FallGround restores temporary attack after the round");
let toothCrusheSkillGame = await api("/api/game/new", { name: "pet-toothcrushe-skill-test" });
toothCrusheSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
toothCrusheSkillGame = await api("/api/game/dialog", { game: toothCrusheSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
toothCrusheSkillGame.pets[0].PetSkillIds = [574];
toothCrusheSkillGame.pets[0].PetSkills = [{
  Id: 574,
  Name: "E啮齿术",
  Des: "破坏对方装备武器",
  FuncName: "PETSKILL_ToothCrushe",
  Option: "",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(toothCrusheSkillGame.pets[0], {
  PetId: 57400,
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 150,
  WorkFixStr: 150,
  WorkDefencePower: 80,
  WorkFixTough: 80,
  WorkQuick: 999,
  WorkFixDex: 999
});
Object.assign(toothCrusheSkillGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(toothCrusheSkillGame.battle?.enemyParty?.[0] || {}, {
  Hp: toothCrusheSkillGame.encounter.Hp,
  WorkMaxHp: toothCrusheSkillGame.encounter.WorkMaxHp,
  WorkDefencePower: toothCrusheSkillGame.encounter.WorkDefencePower,
  WorkFixTough: toothCrusheSkillGame.encounter.WorkFixTough,
  WorkQuick: toothCrusheSkillGame.encounter.WorkQuick,
  WorkFixDex: toothCrusheSkillGame.encounter.WorkFixDex,
  WorkAttackPower: toothCrusheSkillGame.encounter.WorkAttackPower,
  WorkTacticsOption: toothCrusheSkillGame.encounter.WorkTacticsOption
});
toothCrusheSkillGame = await api("/api/game/battle", { game: toothCrusheSkillGame, action: "skill:0" });
const toothCrusheTelemetry = toothCrusheSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(toothCrusheSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_TOOTHCRUSHE", "ToothCrushe pet skill maps to source battle command");
assertEqual(toothCrusheTelemetry?.toothCrushe?.sourceCommand, "BATTLE_COM_S_TOOTHCRUSHE", "ToothCrushe records source equipment-crush telemetry");
assertEqual(toothCrusheTelemetry?.toothCrushe?.equipmentEffect, "no-equipment-target", "ToothCrushe keeps equipment crush inert until equipment durability exists");
assertEqual(toothCrusheTelemetry?.hits?.[0]?.sourceCommand, "BATTLE_COM_S_TOOTHCRUSHE", "ToothCrushe hit telemetry records source command");
assert(toothCrusheTelemetry?.hits?.[0]?.damage > 0, "ToothCrushe deals source attack damage");
assertEqual(toothCrusheSkillGame.pets[0].WorkAttackPower, 150, "ToothCrushe does not leave temporary attack mutation");
let batFlySkillGame = await api("/api/game/new", { name: "pet-batfly-skill-test" });
batFlySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
batFlySkillGame = await api("/api/game/dialog", { game: batFlySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
batFlySkillGame.pets[0].PetSkillIds = [633];
batFlySkillGame.pets[0].PetSkills = [{
  Id: 633,
  Name: "群蝠四窜",
  Des: "吸血",
  FuncName: "PETSKILL_BatFly",
  Option: "",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(batFlySkillGame.pets[0], {
  PetId: 63300,
  Hp: 120,
  WorkMaxHp: 150,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkDefencePower: 999,
  WorkFixTough: 999,
  WorkQuick: 999,
  WorkFixDex: 999
});
const batFlyTargets = [100, 200, 300].map((hp, index) => ({
  ...batFlySkillGame.encounter,
  EnemyId: 63310 + index,
  Name: `群蝠目标${index + 1}`,
  Hp: hp,
  WorkMaxHp: hp,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 0,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
}));
batFlySkillGame.encounter = batFlyTargets[0];
batFlySkillGame.battle.enemyParty = batFlyTargets;
batFlySkillGame.battle.activeEnemyIndex = 0;
batFlySkillGame = await api("/api/game/battle", { game: batFlySkillGame, action: "skill:0" });
const batFlyTelemetry = batFlySkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(batFlySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_BAT_FLY", "BatFly pet skill maps to source battle command");
assertEqual(batFlyTelemetry?.hpDrainPercent, 10, "BatFly records source non-riding HP drain percent");
assertEqual(batFlyTelemetry?.targetScope, "enemy-all", "BatFly scans all live enemy targets");
assertEqual(batFlyTelemetry?.batFly?.targetCount, 3, "BatFly drains each live enemy target");
assertEqual(batFlyTelemetry?.batFly?.totalDamage, 60, "BatFly sums source current-HP percentage damage");
assertEqual(batFlyTelemetry?.batFly?.healAmount, 30, "BatFly heals caster by drained HP capped at max HP");
assertEqual(batFlyTelemetry?.batFly?.afterCasterHp, 150, "BatFly caster heal respects max HP cap");
assertEqual(batFlyTelemetry?.batFly?.rideEffect, "single-player-no-ride-pet-target", "BatFly keeps ride-pet branch inert until riding targets exist");
assertEqual(batFlyTelemetry?.hits?.[0]?.sourceCommand, "BATTLE_COM_S_BAT_FLY", "BatFly hit telemetry records source command");
assertEqual(batFlyTelemetry?.hits?.[0]?.damage, 10, "BatFly drains 10% from first target current HP");
assertEqual(batFlyTelemetry?.hits?.[1]?.damage, 20, "BatFly drains 10% from second target current HP");
assertEqual(batFlyTelemetry?.hits?.[2]?.damage, 30, "BatFly drains 10% from third target current HP");
assertEqual(batFlySkillGame.battle.enemyParty[0].Hp, 90, "BatFly persists first target HP loss");
assertEqual(batFlySkillGame.battle.enemyParty[1].Hp, 180, "BatFly persists second target HP loss");
assertEqual(batFlySkillGame.battle.enemyParty[2].Hp, 270, "BatFly persists third target HP loss");
let divideAttackSkillGame = await api("/api/game/new", { name: "pet-divideattack-skill-test" });
divideAttackSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
divideAttackSkillGame = await api("/api/game/dialog", { game: divideAttackSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
divideAttackSkillGame.pets[0].PetSkillIds = [634];
divideAttackSkillGame.pets[0].PetSkills = [{
  Id: 634,
  Name: "分身地裂",
  Des: "全体攻击",
  FuncName: "PETSKILL_DivideAttack",
  Option: "",
  Field: 1,
  Target: 3,
  UseType: 1,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(divideAttackSkillGame.pets[0], {
  PetId: 63400,
  Hp: 300,
  WorkMaxHp: 300,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkDefencePower: 999,
  WorkFixTough: 999,
  WorkQuick: 999,
  WorkFixDex: 999
});
const divideAttackTargets = [100, 200, 300].map((hp, index) => ({
  ...divideAttackSkillGame.encounter,
  EnemyId: 63410 + index,
  Name: `地裂目标${index + 1}`,
  Hp: hp,
  WorkMaxHp: hp,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 0,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
}));
divideAttackSkillGame.encounter = divideAttackTargets[0];
divideAttackSkillGame.battle.enemyParty = divideAttackTargets;
divideAttackSkillGame.battle.activeEnemyIndex = 0;
divideAttackSkillGame = await api("/api/game/battle", { game: divideAttackSkillGame, action: "skill:0" });
const divideAttackTelemetry = divideAttackSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(divideAttackSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_DIVIDE_ATTACK", "DivideAttack pet skill maps to source battle command");
assertEqual(divideAttackTelemetry?.targetScope, "enemy-all", "DivideAttack scans all live enemy targets");
assertEqual(divideAttackTelemetry?.hpDamagePercent, 20, "DivideAttack records source non-riding HP damage percent");
assertEqual(divideAttackTelemetry?.mpDrainPercent, 50, "DivideAttack records source player-target MP drain percent");
assertEqual(divideAttackTelemetry?.divideAttack?.targetCount, 3, "DivideAttack hits each live enemy target");
assertEqual(divideAttackTelemetry?.divideAttack?.totalDamage, 120, "DivideAttack sums source current-HP percentage damage");
assertEqual(divideAttackTelemetry?.divideAttack?.totalMpDamage, 0, "DivideAttack keeps MP branch inert for non-player enemy targets");
assertEqual(divideAttackTelemetry?.divideAttack?.rideEffect, "single-player-no-ride-pet-target", "DivideAttack keeps ride-pet branch inert until riding targets exist");
assertEqual(divideAttackTelemetry?.divideAttack?.mpEffect, "enemy-target-not-player", "DivideAttack records source MP branch reason");
assertEqual(divideAttackTelemetry?.hits?.[0]?.sourceCommand, "BATTLE_COM_S_DIVIDE_ATTACK", "DivideAttack hit telemetry records source command");
assertEqual(divideAttackTelemetry?.hits?.[0]?.damage, 20, "DivideAttack damages first target for 20% current HP");
assertEqual(divideAttackTelemetry?.hits?.[1]?.damage, 40, "DivideAttack damages second target for 20% current HP");
assertEqual(divideAttackTelemetry?.hits?.[2]?.damage, 60, "DivideAttack damages third target for 20% current HP");
assertEqual(divideAttackTelemetry?.hits?.[0]?.mpEffect, "enemy-target-not-player", "DivideAttack hit telemetry records inert MP branch");
assertEqual(divideAttackSkillGame.battle.enemyParty[0].Hp, 80, "DivideAttack persists first target HP loss");
assertEqual(divideAttackSkillGame.battle.enemyParty[1].Hp, 160, "DivideAttack persists second target HP loss");
assertEqual(divideAttackSkillGame.battle.enemyParty[2].Hp, 240, "DivideAttack persists third target HP loss");
let antInterSkillGame = await api("/api/game/new", { name: "pet-antinter-skill-test" });
antInterSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
antInterSkillGame = await api("/api/game/dialog", { game: antInterSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
antInterSkillGame.pets[0].PetSkillIds = [639];
antInterSkillGame.pets[0].PetSkills = [{
  Id: 639,
  Name: "蚁葬",
  Des: "使敌方死亡宠物回到宠物栏，无法再参与战斗",
  FuncName: "PETSKILL_AntInter",
  Option: "",
  Field: 1,
  Target: 10,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(antInterSkillGame.pets[0], {
  PetId: 63900,
  Hp: 300,
  WorkMaxHp: 300,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkDefencePower: 999,
  WorkFixTough: 999,
  WorkQuick: 999,
  WorkFixDex: 999
});
const antInterActiveTarget = {
  ...antInterSkillGame.encounter,
  EnemyId: 63910,
  Name: "蚁葬活目标",
  Hp: 120,
  WorkMaxHp: 120,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 0,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
};
antInterSkillGame.encounter = antInterActiveTarget;
antInterSkillGame.battle.enemyParty = [antInterActiveTarget];
antInterSkillGame.battle.activeEnemyIndex = 0;
antInterSkillGame = await api("/api/game/battle", { game: antInterSkillGame, action: "skill:0" });
let antInterTelemetry = antInterSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(antInterSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ANTINTER", "AntInter pet skill maps to source battle command");
assertEqual(antInterTelemetry?.antInter?.success, false, "AntInter refuses ordinary live enemy targets");
assertEqual(antInterTelemetry?.antInter?.reason, "target-not-pet", "AntInter records non-pet failure reason");
assertEqual(antInterSkillGame.battle.enemyParty[0].Hp, 120, "AntInter does not damage ordinary live enemy targets");
const antInterDeadPet = {
  ...antInterActiveTarget,
  EnemyId: 63915,
  Name: "蚁葬死亡宠物",
  Hp: 0,
  WorkMaxHp: 100,
  SourceBattleKind: "pet",
  OwnerSlot: 0,
  BattleEscaped: false
};
antInterSkillGame.encounter = antInterSkillGame.battle.enemyParty[0];
antInterSkillGame.battle.enemyParty = [
  antInterSkillGame.battle.enemyParty[0],
  { ...antInterActiveTarget, EnemyId: 63911, Name: "空位1", Hp: 0, BattleEscaped: true },
  { ...antInterActiveTarget, EnemyId: 63912, Name: "空位2", Hp: 0, BattleEscaped: true },
  { ...antInterActiveTarget, EnemyId: 63913, Name: "空位3", Hp: 0, BattleEscaped: true },
  { ...antInterActiveTarget, EnemyId: 63914, Name: "空位4", Hp: 0, BattleEscaped: true },
  antInterDeadPet
];
antInterSkillGame.battle.activeEnemyIndex = 0;
antInterSkillGame = await api("/api/game/battle", { game: antInterSkillGame, action: "skill:0:5" });
antInterTelemetry = antInterSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(antInterTelemetry?.antInter?.success, true, "AntInter succeeds on a dead source pet target");
assertEqual(antInterTelemetry?.antInter?.targetSlot, 5, "AntInter records source pet target slot");
assertEqual(antInterTelemetry?.antInter?.targetIsPet, true, "AntInter records pet target classification");
assertEqual(antInterTelemetry?.antInter?.exitEffect, "BATTLE_PetDefaultExit", "AntInter records source pet-exit effect");
assertEqual(antInterSkillGame.battle.enemyParty[5].BattleEscaped, true, "AntInter marks dead pet target as exited");
assertEqual(antInterSkillGame.battle.enemyParty[5].SourceDefaultPet, -1, "AntInter records source default pet removal");
assertEqual(antInterSkillGame.battle.enemyParty[5].AntInterRemoved, true, "AntInter records no-reentry marker");
let guardianSkillGame = await api("/api/game/new", { name: "pet-guardian-skill-test" });
guardianSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
guardianSkillGame = await api("/api/game/dialog", { game: guardianSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
const guardianPlayerHpBefore = Number(guardianSkillGame.player.hp || 0);
guardianSkillGame.pets[0].PetSkillIds = [20];
guardianSkillGame.pets[0].PetSkills = [{
  Id: 20,
  Name: "忠犬",
  Des: "保护主人不受到敌人的直接攻击",
  FuncName: "PETSKILL_Guardian",
  Option: "攻%-20  COM:攻击",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(guardianSkillGame.pets[0], {
  PetId: 20020,
  Name: "忠犬测试宠",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 120,
  WorkFixStr: 120,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 999,
  WorkFixDex: 999,
  NoDuck: 1
});
guardianSkillGame.encounter = {
  ...guardianSkillGame.encounter,
  EnemyId: 20021,
  Name: "忠犬攻击测试敌",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 150,
  WorkFixStr: 150,
  WorkDefencePower: 1,
  WorkFixTough: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
};
guardianSkillGame.battle.enemyParty = [guardianSkillGame.encounter];
guardianSkillGame.battle.activeEnemyIndex = 0;
guardianSkillGame = await api("/api/game/battle", { game: guardianSkillGame, action: "skill:0" });
const guardianTelemetry = guardianSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(guardianSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_GUARDIAN_ATTACK", "Guardian pet skill maps to source guardian command");
assert(guardianTelemetry?.guardian?.success, "Guardian records source guard state application");
assertEqual(guardianTelemetry?.guardian?.applied?.ownerKind, "player", "Guardian protects the player owner slot");
assert(guardianSkillGame.battleOutcome.enemyAi?.guardian?.success, "Guardian intercepts an enemy attack that targeted the player");
assertEqual(guardianSkillGame.battleOutcome.enemyAi?.guardian?.guardianName, "忠犬测试宠", "Guardian telemetry records the intercepting pet");
assertEqual(guardianSkillGame.player.hp, guardianPlayerHpBefore, "Guardian prevents direct player HP loss");
assert(Number(guardianSkillGame.pets[0].Hp || 0) < 999, "Guardian pet takes the redirected enemy damage");
assert(!guardianSkillGame.pets[0].BattleGuardian, "Guardian battle flag clears after the round");
let speedySkillGame = await api("/api/game/new", { name: "pet-speedy-skill-test" });
speedySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
speedySkillGame = await api("/api/game/dialog", { game: speedySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
speedySkillGame.pets[0].PetSkillIds = [542];
speedySkillGame.pets[0].PetSkills = [{
  Id: 542,
  Name: "疾速攻击",
  Des: "防御力减30%，敏捷变成加+30%",
  FuncName: "PETSKILL_SpeedyAttack",
  Option: "防%-30 敏%+30",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
speedySkillGame.pets[0].WorkFixStr = 80;
speedySkillGame.pets[0].WorkAttackPower = 80;
speedySkillGame.pets[0].WorkFixTough = 100;
speedySkillGame.pets[0].WorkDefencePower = 100;
speedySkillGame.pets[0].WorkQuick = 10;
speedySkillGame.pets[0].WorkFixDex = 10;
speedySkillGame.pets[0].Hp = 999;
speedySkillGame.pets[0].WorkMaxHp = 999;
speedySkillGame.encounter.WorkMaxHp = 999;
speedySkillGame.encounter.Hp = 999;
speedySkillGame.encounter.WorkFixTough = 1;
speedySkillGame.encounter.WorkDefencePower = 1;
speedySkillGame.encounter.WorkQuick = 20;
speedySkillGame.encounter.WorkFixDex = 20;
speedySkillGame.encounter.WorkAttackPower = 1;
Object.assign(speedySkillGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: speedySkillGame.encounter.WorkMaxHp,
  Hp: speedySkillGame.encounter.Hp,
  WorkFixTough: speedySkillGame.encounter.WorkFixTough,
  WorkDefencePower: speedySkillGame.encounter.WorkDefencePower,
  WorkQuick: speedySkillGame.encounter.WorkQuick,
  WorkFixDex: speedySkillGame.encounter.WorkFixDex,
  WorkAttackPower: speedySkillGame.encounter.WorkAttackPower
});
const speedyHpBefore = Number(speedySkillGame.encounter.Hp || 0);
speedySkillGame = await api("/api/game/battle", { game: speedySkillGame, action: "skill:0" });
assertEqual(speedySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SPEEDYATTACK", "SpeedyAttack pet skill maps to source battle command");
assertEqual(speedySkillGame.battleOutcome.playerAction?.petSkill?.multiplier, 1, "SpeedyAttack pet skill keeps source attack damage unmodified");
assertEqual(speedySkillGame.battleOutcome.playerAction?.petSkill?.defencePercent, -30, "SpeedyAttack pet skill preserves source defence percent telemetry");
assertEqual(speedySkillGame.battleOutcome.playerAction?.petSkill?.quickPercent, 30, "SpeedyAttack pet skill preserves source quick percent telemetry");
assert(speedySkillGame.battleOutcome.log[0]?.includes("疾速攻击"), "SpeedyAttack source quick boost lets the pet act before a slightly faster enemy");
assertEqual(speedySkillGame.pets[0].WorkQuick, 10, "SpeedyAttack pet skill restores temporary quick after the round");
assertEqual(speedySkillGame.pets[0].WorkDefencePower, 100, "SpeedyAttack pet skill restores temporary defence after the round");
assert(Number(speedySkillGame.encounter?.Hp || 0) < speedyHpBefore, "SpeedyAttack pet skill damages the active battle target");
let earthRoundSkillGame = await api("/api/game/new", { name: "pet-earthround-skill-test" });
earthRoundSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
earthRoundSkillGame = await api("/api/game/dialog", { game: earthRoundSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
earthRoundSkillGame.pets[0].PetSkillIds = [120];
earthRoundSkillGame.pets[0].PetSkills = [{
  Id: 120,
  Name: "地球一周",
  Des: "一回合从敌人背后以两倍攻击力攻击",
  FuncName: "PETSKILL_EarthRound",
  Option: "攻%+90",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
earthRoundSkillGame.pets[0].WorkFixStr = 70;
earthRoundSkillGame.pets[0].WorkAttackPower = 70;
earthRoundSkillGame.pets[0].WorkQuick = 999;
earthRoundSkillGame.pets[0].WorkFixDex = 999;
earthRoundSkillGame.pets[0].Hp = 300;
earthRoundSkillGame.pets[0].WorkMaxHp = 300;
earthRoundSkillGame.player.hp = 500;
earthRoundSkillGame.player.maxHp = 500;
earthRoundSkillGame.player.Hp = 500;
earthRoundSkillGame.player.WorkMaxHp = 500;
earthRoundSkillGame.player.Vital = 50000;
earthRoundSkillGame.player.Tough = 100;
earthRoundSkillGame.player.WorkFixTough = 1;
earthRoundSkillGame.player.WorkDefencePower = 1;
earthRoundSkillGame.player.NoDuck = 1;
earthRoundSkillGame.encounter.WorkMaxHp = 999;
earthRoundSkillGame.encounter.Hp = 999;
earthRoundSkillGame.encounter.WorkFixTough = 1;
earthRoundSkillGame.encounter.WorkDefencePower = 1;
earthRoundSkillGame.encounter.WorkQuick = 0;
earthRoundSkillGame.encounter.WorkFixDex = 0;
earthRoundSkillGame.encounter.WorkAttackPower = 200;
earthRoundSkillGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
earthRoundSkillGame.encounter.TacticsOption = earthRoundSkillGame.encounter.WorkTacticsOption;
Object.assign(earthRoundSkillGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: earthRoundSkillGame.encounter.WorkMaxHp,
  Hp: earthRoundSkillGame.encounter.Hp,
  WorkFixTough: earthRoundSkillGame.encounter.WorkFixTough,
  WorkDefencePower: earthRoundSkillGame.encounter.WorkDefencePower,
  WorkQuick: earthRoundSkillGame.encounter.WorkQuick,
  WorkFixDex: earthRoundSkillGame.encounter.WorkFixDex,
  WorkAttackPower: earthRoundSkillGame.encounter.WorkAttackPower,
  WorkTacticsOption: earthRoundSkillGame.encounter.WorkTacticsOption,
  TacticsOption: earthRoundSkillGame.encounter.TacticsOption
});
const earthRoundPetHpBefore = Number(earthRoundSkillGame.pets[0].Hp || 0);
const earthRoundPlayerHpBefore = Number(earthRoundSkillGame.player.hp || 0);
earthRoundSkillGame = await api("/api/game/battle", { game: earthRoundSkillGame, action: "skill:0" });
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_EARTHROUND1", "EarthRound pet skill maps to source battle command");
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.attackPercent, 90, "EarthRound pet skill preserves source attack percent telemetry");
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.earthRound?.hidden, true, "EarthRound first source command hides the pet");
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.hits?.length || 0, 0, "EarthRound first source command does not attack immediately");
assertEqual(Number(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.totalDamage || 0), 0, "EarthRound hide source command deals no immediate damage");
assertEqual(earthRoundSkillGame.pets[0].BattleEarthRound?.sourceCommand, "BATTLE_COM_S_EARTHROUND0", "EarthRound stores the source back-attack continuation command");
assert(!(earthRoundSkillGame.battleOutcome.enemyAi?.targetCandidates || []).includes("pet:0"), "EarthRound hidden pet is removed from enemy target candidates");
assertEqual(Number(earthRoundSkillGame.pets[0].Hp || 0), earthRoundPetHpBefore, "EarthRound hidden pet is not targetable by enemy AI");
assert(Number(earthRoundSkillGame.player.hp || 0) < earthRoundPlayerHpBefore, "EarthRound hidden pet retargets enemy attacks to the player");
const earthRoundHpAfterHide = Number(earthRoundSkillGame.encounter.Hp || 0);
earthRoundSkillGame = await api("/api/game/battle", { game: earthRoundSkillGame, action: "attack" });
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_EARTHROUND0", "EarthRound continuation maps to source back-attack command");
assertEqual(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.earthRound?.completed, true, "EarthRound continuation completes the hidden attack");
assert(Math.abs(Number(earthRoundSkillGame.battleOutcome.playerAction?.petSkill?.multiplier || 0) - 1.9) < 0.001, "EarthRound continuation applies the source attack percent as damage multiplier");
assert(Number(earthRoundSkillGame.encounter?.Hp || 0) < earthRoundHpAfterHide, "EarthRound continuation damages the active battle target");
assert(!earthRoundSkillGame.pets[0].BattleEarthRound, "EarthRound clears the hidden continuation state after attacking");
assertEqual(earthRoundSkillGame.pets[0].WorkAttackPower, 70, "EarthRound does not mutate WorkAttackPower outside the source continuation");
let damageToHpSkillGame = await api("/api/game/new", { name: "pet-damagetohp-skill-test" });
damageToHpSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
damageToHpSkillGame = await api("/api/game/dialog", { game: damageToHpSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
damageToHpSkillGame.pets[0].PetSkillIds = [503];
damageToHpSkillGame.pets[0].PetSkills = [{
  Id: 503,
  Name: "嗜血技",
  Des: "攻击力下降30%，并将伤害值的50%化为己用",
  FuncName: "PETSKILL_DamageToHp",
  Option: "30|50",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
damageToHpSkillGame.pets[0].Hp = 40;
damageToHpSkillGame.pets[0].WorkMaxHp = 200;
damageToHpSkillGame.pets[0].WorkFixStr = 100;
damageToHpSkillGame.pets[0].WorkAttackPower = 100;
damageToHpSkillGame.pets[0].WorkQuick = 999;
damageToHpSkillGame.pets[0].WorkFixDex = 999;
damageToHpSkillGame.encounter.WorkMaxHp = 999;
damageToHpSkillGame.encounter.Hp = 999;
damageToHpSkillGame.encounter.WorkFixTough = 1;
damageToHpSkillGame.encounter.WorkDefencePower = 1;
damageToHpSkillGame.encounter.WorkQuick = 0;
damageToHpSkillGame.encounter.WorkFixDex = 0;
damageToHpSkillGame.encounter.WorkAttackPower = 0;
Object.assign(damageToHpSkillGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: damageToHpSkillGame.encounter.WorkMaxHp,
  Hp: damageToHpSkillGame.encounter.Hp,
  WorkFixTough: damageToHpSkillGame.encounter.WorkFixTough,
  WorkDefencePower: damageToHpSkillGame.encounter.WorkDefencePower,
  WorkQuick: damageToHpSkillGame.encounter.WorkQuick,
  WorkFixDex: damageToHpSkillGame.encounter.WorkFixDex,
  WorkAttackPower: damageToHpSkillGame.encounter.WorkAttackPower
});
const damageToHpHpBefore = Number(damageToHpSkillGame.pets[0].Hp || 0);
const damageToHpEnemyHpBefore = Number(damageToHpSkillGame.encounter.Hp || 0);
damageToHpSkillGame = await api("/api/game/battle", { game: damageToHpSkillGame, action: "skill:0" });
assertEqual(damageToHpSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_DAMAGETOHP", "DamageToHp pet skill maps to source battle command");
assertEqual(damageToHpSkillGame.battleOutcome.playerAction?.petSkill?.attackPercent, -30, "DamageToHp pet skill applies source attack penalty as temporary WorkAttackPower");
assertEqual(damageToHpSkillGame.battleOutcome.playerAction?.petSkill?.drainPercent, 50, "DamageToHp pet skill preserves source drain percent telemetry");
assert(Number(damageToHpSkillGame.battleOutcome.playerAction?.petSkill?.healAmount || 0) > 0, "DamageToHp pet skill heals from landed damage");
assert(Number(damageToHpSkillGame.pets[0].Hp || 0) > damageToHpHpBefore, "DamageToHp pet skill restores pet HP");
assert(Number(damageToHpSkillGame.pets[0].Hp || 0) <= Number(damageToHpSkillGame.pets[0].WorkMaxHp || 0), "DamageToHp pet skill caps healing at WorkMaxHp");
assertEqual(damageToHpSkillGame.pets[0].WorkAttackPower, 100, "DamageToHp pet skill restores temporary attack after the round");
assert(Number(damageToHpSkillGame.encounter?.Hp || 0) < damageToHpEnemyHpBefore, "DamageToHp pet skill damages the active battle target");
let mpDamageSkillGame = await api("/api/game/new", { name: "pet-mpdamage-skill-test" });
mpDamageSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
mpDamageSkillGame = await api("/api/game/dialog", { game: mpDamageSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
mpDamageSkillGame.pets[0].PetSkillIds = [506];
mpDamageSkillGame.pets[0].PetSkills = [{
  Id: 506,
  Name: "MP攻击",
  Des: "攻击力下降50%，并损害对方50%的MP",
  FuncName: "PETSKILL_MpDamage",
  Option: "50|50",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
mpDamageSkillGame.pets[0].WorkFixStr = 100;
mpDamageSkillGame.pets[0].WorkAttackPower = 100;
mpDamageSkillGame.pets[0].WorkQuick = 999;
mpDamageSkillGame.pets[0].WorkFixDex = 999;
mpDamageSkillGame.encounter = {
  Name: "MP测试人物目标",
  Hp: 999,
  WorkMaxHp: 999,
  mp: 80,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1
};
mpDamageSkillGame.battle.enemyParty = [mpDamageSkillGame.encounter];
mpDamageSkillGame.battle.activeEnemyIndex = 0;
const mpDamageHpBefore = Number(mpDamageSkillGame.encounter.Hp || 0);
mpDamageSkillGame = await api("/api/game/battle", { game: mpDamageSkillGame, action: "skill:0" });
const mpDamageTelemetry = mpDamageSkillGame.battleOutcome.playerAction?.petSkill;
const mpDamageHit = mpDamageTelemetry?.hits?.[0];
assertEqual(mpDamageSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_MPDAMAGE", "MpDamage pet skill maps to source battle command");
assertEqual(mpDamageTelemetry?.attackPercent, -50, "MpDamage applies source temporary attack penalty");
assertEqual(mpDamageTelemetry?.mpDamagePercent, 50, "MpDamage preserves source MP damage percent telemetry");
assertEqual(mpDamageHit?.mpDamage?.before, 80, "MpDamage reads target MP before source side effect");
assertEqual(mpDamageHit?.mpDamage?.amount, 40, "MpDamage removes source percent of target MP after a landed hit");
assertEqual(mpDamageSkillGame.encounter.mp, 40, "MpDamage persists target MP reduction");
assert(Number(mpDamageSkillGame.encounter?.Hp || 0) < mpDamageHpBefore, "MpDamage still deals normal reduced attack damage");
assertEqual(mpDamageSkillGame.pets[0].WorkAttackPower, 100, "MpDamage restores temporary attack after the round");
let roarSkillGame = await api("/api/game/new", { name: "pet-roar-skill-test" });
roarSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
roarSkillGame = await api("/api/game/dialog", { game: roarSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
roarSkillGame.pets[0].PetSkillIds = [581];
roarSkillGame.pets[0].PetSkills = [{
  Id: 581,
  Name: "大吼",
  Des: "对年兽吼叫，可吓跑年兽，雷龙专用技",
  FuncName: "PETSKILL_Roar",
  Option: "901|902|903|904|1056|1057|1058|1059",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
roarSkillGame.pets[0].WorkQuick = 999;
roarSkillGame.pets[0].WorkFixDex = 999;
roarSkillGame.encounter = {
  Name: "年兽测试目标",
  PetId: 901,
  Hp: 500,
  WorkMaxHp: 500,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkAttackPower: 1
};
roarSkillGame.battle.enemyParty = [roarSkillGame.encounter];
roarSkillGame.battle.activeEnemyIndex = 0;
roarSkillGame = await api("/api/game/battle", { game: roarSkillGame, action: "skill:0" });
const roarTelemetry = roarSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(roarSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ROAR", "Roar pet skill maps to source battle command");
assert(roarTelemetry?.roar?.success, "Roar succeeds only when target PetId is in source PETSKILL_OPTION whitelist");
assertEqual(roarTelemetry?.roar?.targetId, 901, "Roar records source target PetId");
assertEqual(roarSkillGame.battleOutcome.result, "enemy-escaped", "Roar ends a single-target battle as enemy escaped");
assertEqual(roarSkillGame.battleOutcome.playerExp, 0, "Roar escape does not grant victory EXP");
assertEqual(roarSkillGame.battleOutcome.stone, 0, "Roar escape does not grant stone rewards");
assert(!roarSkillGame.encounter, "Roar clears battle encounter after the target escapes");
let noGuardSkillGame = await api("/api/game/new", { name: "pet-noguard-skill-test" });
noGuardSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
noGuardSkillGame = await api("/api/game/dialog", { game: noGuardSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
noGuardSkillGame.pets[0].PetSkillIds = [152];
noGuardSkillGame.pets[0].PetSkills = [{
  Id: 152,
  Name: "不防守战法3",
  Des: "自己不进行攻击，反击跟回避率就会变的非常高",
  FuncName: "PETSKILL_NoGuard",
  Option: "回避%+50 反击%+80 会心%+40",
  Field: 1,
  Target: 5,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
noGuardSkillGame.pets[0].Hp = 120;
noGuardSkillGame.pets[0].WorkMaxHp = 120;
noGuardSkillGame.pets[0].WorkQuick = 1;
noGuardSkillGame.pets[0].WorkFixDex = 1;
noGuardSkillGame.encounter.Name = "不防守测试敌人";
noGuardSkillGame.encounter.WorkMaxHp = 999;
noGuardSkillGame.encounter.Hp = 999;
noGuardSkillGame.encounter.WorkFixTough = 1;
noGuardSkillGame.encounter.WorkDefencePower = 1;
noGuardSkillGame.encounter.WorkQuick = 999;
noGuardSkillGame.encounter.WorkFixDex = 999;
noGuardSkillGame.encounter.WorkAttackPower = 50;
noGuardSkillGame.encounter.WorkTactics = 1;
noGuardSkillGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
noGuardSkillGame.battle.enemyParty = [noGuardSkillGame.encounter];
noGuardSkillGame.battle.activeEnemyIndex = 0;
const noGuardPetHpBefore = Number(noGuardSkillGame.pets[0].Hp || 0);
const originalRandomForNoGuard = Math.random;
try {
  Math.random = () => 0;
  noGuardSkillGame = await api("/api/game/battle", { game: noGuardSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForNoGuard;
}
const noGuardTelemetry = noGuardSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(noGuardSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_NOGUARD", "NoGuard pet skill maps to source battle command");
assertEqual(noGuardTelemetry?.duckModifier, 50, "NoGuard parses source dodge modifier");
assertEqual(noGuardTelemetry?.counterPercent, 80, "NoGuard preserves source counter percent telemetry");
assertEqual(noGuardTelemetry?.criticalPercent, 40, "NoGuard preserves source critical percent telemetry");
assert(noGuardTelemetry?.noGuardActive, "NoGuard marks the source no-action stance for the enemy response");
assert(noGuardTelemetry?.dodgeCheck?.dodged, "NoGuard applies source dodge modifier when the enemy targets the active pet");
assertEqual(noGuardSkillGame.pets[0].Hp, noGuardPetHpBefore, "NoGuard dodge prevents enemy damage to the active pet");
assertEqual(noGuardTelemetry?.totalDamage || 0, 0, "NoGuard itself does not deal direct damage");
let acupunctureSkillGame = await api("/api/game/new", { name: "pet-acupuncture-skill-test" });
acupunctureSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
acupunctureSkillGame = await api("/api/game/dialog", { game: acupunctureSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
acupunctureSkillGame.pets[0].PetSkillIds = [622];
acupunctureSkillGame.pets[0].PetSkills = [{
  Id: 622,
  Name: "针刺外皮",
  Des: "可令攻击者受到1/2的伤害",
  FuncName: "PETSKILL_Acupuncture",
  Option: "",
  Field: 1,
  Target: 0,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
acupunctureSkillGame.pets[0].Hp = 200;
acupunctureSkillGame.pets[0].WorkMaxHp = 200;
acupunctureSkillGame.pets[0].WorkFixDex = 1;
acupunctureSkillGame.pets[0].WorkQuick = 1;
acupunctureSkillGame.encounter.Name = "针刺测试敌人";
acupunctureSkillGame.encounter.WorkMaxHp = 999;
acupunctureSkillGame.encounter.Hp = 999;
acupunctureSkillGame.encounter.WorkFixTough = 1;
acupunctureSkillGame.encounter.WorkDefencePower = 1;
acupunctureSkillGame.encounter.WorkQuick = 999;
acupunctureSkillGame.encounter.WorkFixDex = 999;
acupunctureSkillGame.encounter.WorkAttackPower = 80;
acupunctureSkillGame.encounter.WorkTactics = 1;
acupunctureSkillGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
acupunctureSkillGame.battle.enemyParty = [acupunctureSkillGame.encounter];
acupunctureSkillGame.battle.activeEnemyIndex = 0;
const acupunctureEnemyHpBefore = Number(acupunctureSkillGame.encounter.Hp || 0);
const acupuncturePetHpBefore = Number(acupunctureSkillGame.pets[0].Hp || 0);
const originalRandomForAcupuncture = Math.random;
try {
  Math.random = () => 0.99;
  acupunctureSkillGame = await api("/api/game/battle", { game: acupunctureSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForAcupuncture;
}
const acupunctureTelemetry = acupunctureSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(acupunctureSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ACUPUNCTURE", "Acupuncture pet skill maps to source battle command");
assertEqual(acupunctureTelemetry?.acupunctureReflectPercent, 50, "Acupuncture records source half-damage reflect percent");
assert(acupunctureTelemetry?.acupuncture?.success, "Acupuncture sets source reflect state before enemy attack");
assert(acupunctureTelemetry?.acupunctureReflect?.success, "Acupuncture reflects damage after a landed enemy hit");
assertEqual(acupunctureTelemetry.acupunctureReflect.sourceCommand, "BATTLE_MD_ACUPUNCTURE", "Acupuncture reflect records source reaction command");
assert(acupunctureTelemetry.acupunctureReflect.sourceDamage > 0, "Acupuncture reflect is based on landed damage");
assertEqual(acupunctureTelemetry.acupunctureReflect.damage, Math.trunc(acupunctureTelemetry.acupunctureReflect.sourceDamage / 2), "Acupuncture reflects half of landed damage");
assertEqual(acupunctureSkillGame.encounter.Hp, acupunctureEnemyHpBefore - acupunctureTelemetry.acupunctureReflect.damage, "Acupuncture reflect persists enemy HP loss");
assertEqual(acupunctureSkillGame.pets[0].Hp, Math.max(0, acupuncturePetHpBefore - acupunctureTelemetry.acupunctureReflect.sourceDamage), "Acupuncture still applies incoming enemy damage to the pet");
assert(!acupunctureSkillGame.pets[0].BattleAcupuncture, "Acupuncture source state clears after reflect");
let timidSkillGame = await api("/api/game/new", { name: "pet-2timid-skill-test" });
timidSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
timidSkillGame = await api("/api/game/dialog", { game: timidSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
timidSkillGame.pets[0].PetSkillIds = [636];
timidSkillGame.pets[0].PetSkills = [{
  Id: 636,
  Name: "狂狮怒吼",
  Des: "使用时攻下降50% 敏上升30% 使敌方宠物受到惊吓回到宠物栏",
  FuncName: "PETSKILL_2BattleTimid",
  Option: "-攻%50+敏%30命%60",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
timidSkillGame.pets[0].WorkFixStr = 120;
timidSkillGame.pets[0].WorkAttackPower = 120;
timidSkillGame.pets[0].WorkFixDex = 100;
timidSkillGame.pets[0].WorkQuick = 100;
timidSkillGame.pets[0].Hp = 200;
timidSkillGame.pets[0].WorkMaxHp = 200;
timidSkillGame.encounter.Name = "怯战测试敌人";
timidSkillGame.encounter.WorkMaxHp = 999;
timidSkillGame.encounter.Hp = 999;
timidSkillGame.encounter.WorkFixTough = 1;
timidSkillGame.encounter.WorkDefencePower = 1;
timidSkillGame.encounter.WorkQuick = 1;
timidSkillGame.encounter.WorkFixDex = 1;
timidSkillGame.encounter.WorkAttackPower = 0;
Object.assign(timidSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: timidSkillGame.encounter.Name,
  WorkMaxHp: timidSkillGame.encounter.WorkMaxHp,
  Hp: timidSkillGame.encounter.Hp,
  WorkFixTough: timidSkillGame.encounter.WorkFixTough,
  WorkDefencePower: timidSkillGame.encounter.WorkDefencePower,
  WorkQuick: timidSkillGame.encounter.WorkQuick,
  WorkFixDex: timidSkillGame.encounter.WorkFixDex,
  WorkAttackPower: timidSkillGame.encounter.WorkAttackPower
});
timidSkillGame.battle.enemyParty = [timidSkillGame.encounter];
timidSkillGame.battle.activeEnemyIndex = 0;
const originalRandomForTimid = Math.random;
try {
  Math.random = () => 0;
  timidSkillGame = await api("/api/game/battle", { game: timidSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForTimid;
}
const timidTelemetry = timidSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(timidSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_2TIMID", "2BattleTimid pet skill maps to source battle command");
assertEqual(timidTelemetry?.attackPercent, -50, "2BattleTimid parses source attack penalty");
assertEqual(timidTelemetry?.quickPercent, 30, "2BattleTimid parses source quick boost");
assertEqual(timidTelemetry?.timidChance, 60, "2BattleTimid parses source timid chance");
assertEqual(timidTelemetry?.timid?.success, true, "2BattleTimid can scare the target away after landed damage");
assertEqual(timidSkillGame.battleOutcome.result, "enemy-escaped", "2BattleTimid ends the battle as target escaped");
assertEqual(timidSkillGame.battleOutcome.playerExp, 0, "2BattleTimid escape does not grant victory EXP");
assertEqual(timidSkillGame.battleOutcome.stone, 0, "2BattleTimid escape does not grant stone rewards");
assert(!timidSkillGame.encounter, "2BattleTimid clears encounter after source escape");
let damageToHp2SkillGame = await api("/api/game/new", { name: "pet-damagetohp2-skill-test" });
damageToHp2SkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
damageToHp2SkillGame = await api("/api/game/dialog", { game: damageToHp2SkillGame, npcId: battleNpc.npc.id, message: "宠物" });
damageToHp2SkillGame.pets[0].PetSkillIds = [623];
damageToHp2SkillGame.pets[0].PetSkills = [{
  Id: 623,
  Name: "浴血狂袭",
  Des: "Hp50%以下时才可使用 攻敏上升20% 会心一击上升30% 吸收伤害30%转Hp",
  FuncName: "PETSKILL_DamageToHp2",
  Option: "30",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
damageToHp2SkillGame.pets[0].Hp = 60;
damageToHp2SkillGame.pets[0].WorkMaxHp = 200;
damageToHp2SkillGame.pets[0].WorkFixStr = 100;
damageToHp2SkillGame.pets[0].WorkAttackPower = 100;
damageToHp2SkillGame.pets[0].WorkFixDex = 10;
damageToHp2SkillGame.pets[0].WorkQuick = 10;
damageToHp2SkillGame.encounter.Name = "浴血狂袭测试敌人";
damageToHp2SkillGame.encounter.WorkMaxHp = 999;
damageToHp2SkillGame.encounter.Hp = 999;
damageToHp2SkillGame.encounter.WorkFixTough = 1;
damageToHp2SkillGame.encounter.WorkDefencePower = 1;
damageToHp2SkillGame.encounter.WorkQuick = 25;
damageToHp2SkillGame.encounter.WorkFixDex = 0;
damageToHp2SkillGame.encounter.WorkAttackPower = 0;
Object.assign(damageToHp2SkillGame.battle?.enemyParty?.[0] || {}, {
  Name: damageToHp2SkillGame.encounter.Name,
  WorkMaxHp: damageToHp2SkillGame.encounter.WorkMaxHp,
  Hp: damageToHp2SkillGame.encounter.Hp,
  WorkFixTough: damageToHp2SkillGame.encounter.WorkFixTough,
  WorkDefencePower: damageToHp2SkillGame.encounter.WorkDefencePower,
  WorkQuick: damageToHp2SkillGame.encounter.WorkQuick,
  WorkFixDex: damageToHp2SkillGame.encounter.WorkFixDex,
  WorkAttackPower: damageToHp2SkillGame.encounter.WorkAttackPower
});
const damageToHp2HpBefore = Number(damageToHp2SkillGame.pets[0].Hp || 0);
const damageToHp2EnemyHpBefore = Number(damageToHp2SkillGame.encounter.Hp || 0);
const originalRandomForDamageToHp2 = Math.random;
try {
  Math.random = () => 0.5;
  damageToHp2SkillGame = await api("/api/game/battle", { game: damageToHp2SkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForDamageToHp2;
}
const damageToHp2Telemetry = damageToHp2SkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(damageToHp2SkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_DAMAGETOHP2", "DamageToHp2 pet skill maps to source battle command");
assertEqual(damageToHp2Telemetry?.attackPercent, 20, "DamageToHp2 pet skill applies source attack boost telemetry");
assertEqual(damageToHp2Telemetry?.quickPercent, 20, "DamageToHp2 pet skill applies source quick boost telemetry");
assertEqual(damageToHp2Telemetry?.criticalPercent, 30, "DamageToHp2 pet skill applies source critical boost telemetry");
assertEqual(damageToHp2Telemetry?.drainPercent, 30, "DamageToHp2 pet skill parses source drain percent from option");
assert(damageToHp2SkillGame.battleOutcome.log[0]?.includes("浴血狂袭"), "DamageToHp2 source quick boost lets the pet act before a slightly faster enemy");
assert(Number(damageToHp2Telemetry?.healAmount || 0) > 0, "DamageToHp2 pet skill heals from landed damage");
assert(Number(damageToHp2SkillGame.pets[0].Hp || 0) > damageToHp2HpBefore, "DamageToHp2 pet skill restores pet HP");
assert(Number(damageToHp2SkillGame.encounter?.Hp || 0) < damageToHp2EnemyHpBefore, "DamageToHp2 pet skill damages the active battle target");
assertEqual(damageToHp2SkillGame.pets[0].WorkAttackPower, 100, "DamageToHp2 pet skill restores temporary attack after the round");
assertEqual(damageToHp2SkillGame.pets[0].WorkQuick, 10, "DamageToHp2 pet skill restores temporary quick after the round");
let modifyAttackSkillGame = await api("/api/game/new", { name: "pet-modifyattack-skill-test" });
modifyAttackSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
modifyAttackSkillGame = await api("/api/game/dialog", { game: modifyAttackSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
modifyAttackSkillGame.pets[0].PetSkillIds = [544];
modifyAttackSkillGame.pets[0].PetSkills = [{
  Id: 544,
  Name: "地属性强化攻击",
  Des: "对地属性强化20%攻击",
  FuncName: "PETSKILL_Modifyattack",
  Option: "EA|20",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
modifyAttackSkillGame.pets[0].WorkFixStr = 90;
modifyAttackSkillGame.pets[0].WorkAttackPower = 90;
modifyAttackSkillGame.pets[0].WorkQuick = 999;
modifyAttackSkillGame.pets[0].WorkFixDex = 999;
modifyAttackSkillGame.encounter.Name = "地属性强化测试敌人";
modifyAttackSkillGame.encounter.WorkMaxHp = 999;
modifyAttackSkillGame.encounter.Hp = 999;
modifyAttackSkillGame.encounter.WorkFixTough = 1;
modifyAttackSkillGame.encounter.WorkDefencePower = 1;
modifyAttackSkillGame.encounter.WorkQuick = 0;
modifyAttackSkillGame.encounter.WorkFixDex = 0;
modifyAttackSkillGame.encounter.WorkAttackPower = 1;
modifyAttackSkillGame.encounter.EarthAT = 50;
modifyAttackSkillGame.encounter.WaterAT = 0;
modifyAttackSkillGame.encounter.FireAT = 0;
modifyAttackSkillGame.encounter.WindAT = 0;
Object.assign(modifyAttackSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: modifyAttackSkillGame.encounter.Name,
  WorkMaxHp: modifyAttackSkillGame.encounter.WorkMaxHp,
  Hp: modifyAttackSkillGame.encounter.Hp,
  WorkFixTough: modifyAttackSkillGame.encounter.WorkFixTough,
  WorkDefencePower: modifyAttackSkillGame.encounter.WorkDefencePower,
  WorkQuick: modifyAttackSkillGame.encounter.WorkQuick,
  WorkFixDex: modifyAttackSkillGame.encounter.WorkFixDex,
  WorkAttackPower: modifyAttackSkillGame.encounter.WorkAttackPower,
  EarthAT: modifyAttackSkillGame.encounter.EarthAT,
  WaterAT: modifyAttackSkillGame.encounter.WaterAT,
  FireAT: modifyAttackSkillGame.encounter.FireAT,
  WindAT: modifyAttackSkillGame.encounter.WindAT
});
const originalRandomForModifyAttack = Math.random;
try {
  Math.random = () => 0.5;
  modifyAttackSkillGame = await api("/api/game/battle", { game: modifyAttackSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForModifyAttack;
}
const modifyAttackTelemetry = modifyAttackSkillGame.battleOutcome.playerAction?.petSkill;
const modifyAttackHit = modifyAttackTelemetry?.hits?.find((hit) => !hit.dodged);
assertEqual(modifyAttackSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_MODIFYATT", "Modifyattack pet skill maps to source battle command");
assertEqual(modifyAttackTelemetry?.attributeBoost?.element, "earth", "Modifyattack pet skill parses source EA attribute token");
assertEqual(modifyAttackTelemetry?.attributeBoost?.percent, 20, "Modifyattack pet skill preserves source attribute boost percent");
assert(Number(modifyAttackHit?.attributeBoost?.addedDamage || 0) > 0, "Modifyattack pet skill adds source attribute bonus damage");
assert(Number(modifyAttackSkillGame.encounter?.Hp || 0) < 999, "Modifyattack pet skill damages the active target");
let mdfyAttackSkillGame = await api("/api/game/new", { name: "pet-mdfyattack-skill-test" });
mdfyAttackSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
mdfyAttackSkillGame = await api("/api/game/dialog", { game: mdfyAttackSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
mdfyAttackSkillGame.pets[0].PetSkillIds = [550];
mdfyAttackSkillGame.pets[0].PetSkills = [{
  Id: 550,
  Name: "火属性转换攻击",
  Des: "转换自己为火属性",
  FuncName: "PETSKILL_Mdfyattack",
  Option: "FI|100",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
mdfyAttackSkillGame.pets[0].EarthAT = 0;
mdfyAttackSkillGame.pets[0].WaterAT = 0;
mdfyAttackSkillGame.pets[0].FireAT = 0;
mdfyAttackSkillGame.pets[0].WindAT = 0;
mdfyAttackSkillGame.pets[0].WorkFixStr = 90;
mdfyAttackSkillGame.pets[0].WorkAttackPower = 90;
mdfyAttackSkillGame.pets[0].WorkQuick = 999;
mdfyAttackSkillGame.pets[0].WorkFixDex = 999;
mdfyAttackSkillGame.encounter.Name = "风属性转换测试敌人";
mdfyAttackSkillGame.encounter.WorkMaxHp = 999;
mdfyAttackSkillGame.encounter.Hp = 999;
mdfyAttackSkillGame.encounter.WorkFixTough = 1;
mdfyAttackSkillGame.encounter.WorkDefencePower = 1;
mdfyAttackSkillGame.encounter.WorkQuick = 0;
mdfyAttackSkillGame.encounter.WorkFixDex = 0;
mdfyAttackSkillGame.encounter.WorkAttackPower = 1;
mdfyAttackSkillGame.encounter.EarthAT = 0;
mdfyAttackSkillGame.encounter.WaterAT = 0;
mdfyAttackSkillGame.encounter.FireAT = 0;
mdfyAttackSkillGame.encounter.WindAT = 100;
Object.assign(mdfyAttackSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: mdfyAttackSkillGame.encounter.Name,
  WorkMaxHp: mdfyAttackSkillGame.encounter.WorkMaxHp,
  Hp: mdfyAttackSkillGame.encounter.Hp,
  WorkFixTough: mdfyAttackSkillGame.encounter.WorkFixTough,
  WorkDefencePower: mdfyAttackSkillGame.encounter.WorkDefencePower,
  WorkQuick: mdfyAttackSkillGame.encounter.WorkQuick,
  WorkFixDex: mdfyAttackSkillGame.encounter.WorkFixDex,
  WorkAttackPower: mdfyAttackSkillGame.encounter.WorkAttackPower,
  EarthAT: mdfyAttackSkillGame.encounter.EarthAT,
  WaterAT: mdfyAttackSkillGame.encounter.WaterAT,
  FireAT: mdfyAttackSkillGame.encounter.FireAT,
  WindAT: mdfyAttackSkillGame.encounter.WindAT
});
mdfyAttackSkillGame = await api("/api/game/battle", { game: mdfyAttackSkillGame, action: "skill:0" });
const mdfyAttackTelemetry = mdfyAttackSkillGame.battleOutcome.playerAction?.petSkill;
const mdfyAttackHit = mdfyAttackTelemetry?.hits?.find((hit) => !hit.dodged);
assertEqual(mdfyAttackSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_MDFYATTACK", "Mdfyattack pet skill maps to source battle command");
assertEqual(mdfyAttackTelemetry?.attributeOverride?.element, "fire", "Mdfyattack pet skill parses source FI attribute token");
assertEqual(mdfyAttackTelemetry?.attributeOverride?.percent, 100, "Mdfyattack pet skill preserves source attribute override percent");
assert(Number(mdfyAttackHit?.elementMultiplier || 0) > 1.4, "Mdfyattack pet skill applies source temporary attack attribute to damage");
assert(Number(mdfyAttackSkillGame.encounter?.Hp || 0) < 999, "Mdfyattack pet skill damages the active target");
let retraceSkillGame = await api("/api/game/new", { name: "pet-retrace-skill-test" });
retraceSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
retraceSkillGame = await api("/api/game/dialog", { game: retraceSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
retraceSkillGame.pets[0].PetSkillIds = [621];
retraceSkillGame.pets[0].PetSkills = [{
  Id: 621,
  Name: "追迹攻击",
  Des: "对手在第一次攻击闪避的话 将会80%的机率发动第二次攻击",
  FuncName: "PETSKILL_Retrace",
  Option: "攻%+20",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
retraceSkillGame.pets[0].WorkFixStr = 90;
retraceSkillGame.pets[0].WorkAttackPower = 90;
retraceSkillGame.pets[0].WorkQuick = 999;
retraceSkillGame.pets[0].WorkFixDex = 1;
retraceSkillGame.encounter.Name = "追迹闪避测试敌人";
retraceSkillGame.encounter.WorkMaxHp = 999;
retraceSkillGame.encounter.Hp = 999;
retraceSkillGame.encounter.WorkFixTough = 1;
retraceSkillGame.encounter.WorkDefencePower = 1;
retraceSkillGame.encounter.WorkQuick = 0;
retraceSkillGame.encounter.WorkFixDex = 999;
retraceSkillGame.encounter.WorkAttackPower = 0;
retraceSkillGame.encounter.Critical = 0;
Object.assign(retraceSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: retraceSkillGame.encounter.Name,
  WorkMaxHp: retraceSkillGame.encounter.WorkMaxHp,
  Hp: retraceSkillGame.encounter.Hp,
  WorkFixTough: retraceSkillGame.encounter.WorkFixTough,
  WorkDefencePower: retraceSkillGame.encounter.WorkDefencePower,
  WorkQuick: retraceSkillGame.encounter.WorkQuick,
  WorkFixDex: retraceSkillGame.encounter.WorkFixDex,
  WorkAttackPower: retraceSkillGame.encounter.WorkAttackPower,
  Critical: retraceSkillGame.encounter.Critical
});
const originalRandomForRetrace = Math.random;
try {
  const sequence = [0.01, 0.5, 0.99, 0.5, 0.99];
  let index = 0;
  Math.random = () => sequence[index++] ?? 0.99;
  retraceSkillGame = await api("/api/game/battle", { game: retraceSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForRetrace;
}
const retraceTelemetry = retraceSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(retraceSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_RETRACE", "Retrace pet skill maps to source battle command");
assertEqual(retraceTelemetry?.hitCount, 1, "Retrace source command starts as one attack");
assertEqual(retraceTelemetry?.retraceChance, 80, "Retrace preserves source retry chance telemetry");
assertEqual(retraceTelemetry?.retraceAttackPercent, 20, "Retrace preserves source second-hit attack boost telemetry");
assertEqual(retraceTelemetry?.retraceTriggered, true, "Retrace triggers source retry after the first dodge");
assertEqual(retraceTelemetry?.hits?.[0]?.dodged, true, "Retrace first hit can be dodged through source duck check");
assertEqual(retraceTelemetry?.hits?.[1]?.retrace, true, "Retrace records the second source attack");
assert(Number(retraceTelemetry?.hits?.[1]?.damage || 0) > 0, "Retrace second attack can land and damage after a first dodge");
assert(Number(retraceSkillGame.encounter?.Hp || 0) < 999, "Retrace pet skill damages the active target after retry");
assertEqual(retraceSkillGame.pets[0].WorkAttackPower, 90, "Retrace restores temporary second-hit attack boost after the round");
let regretSkillGame = await api("/api/game/new", { name: "pet-regret-skill-test" });
regretSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
regretSkillGame = await api("/api/game/dialog", { game: regretSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
regretSkillGame.pets[0].PetSkillIds = [640];
regretSkillGame.pets[0].PetSkills = [{
  Id: 640,
  Name: "憾甲一击",
  Des: "使时无视敌方装备防御攻击前后方敌人，使用时攻上升30%防御下降50%",
  FuncName: "PETSKILL_Regret",
  Option: "命%20 攻%30 防%-50",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(regretSkillGame.pets[0], {
  WorkFixStr: 100,
  WorkAttackPower: 100,
  WorkFixTough: 80,
  WorkDefencePower: 80,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
const regretFrontEnemy = {
  ...regretSkillGame.encounter,
  EnemyId: 990640,
  PetId: 990640,
  Name: "憾甲前排测试敌人",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0
};
const regretBackEnemy = {
  ...regretFrontEnemy,
  EnemyId: 990645,
  PetId: 990645,
  Name: "憾甲后排测试敌人",
  Hp: 999,
  WorkMaxHp: 999
};
regretSkillGame.battle.enemyParty = [
  regretFrontEnemy,
  { ...regretFrontEnemy, Name: "憾甲空位一", Hp: 0 },
  { ...regretFrontEnemy, Name: "憾甲空位二", Hp: 0 },
  { ...regretFrontEnemy, Name: "憾甲空位三", Hp: 0 },
  { ...regretFrontEnemy, Name: "憾甲空位四", Hp: 0 },
  regretBackEnemy
];
regretSkillGame.battle.activeEnemyIndex = 5;
regretSkillGame.encounter = regretBackEnemy;
const originalRandomForRegret = Math.random;
try {
  Math.random = () => 0.5;
  regretSkillGame = await api("/api/game/battle", { game: regretSkillGame, action: "skill:0:5" });
} finally {
  Math.random = originalRandomForRegret;
}
const regretTelemetry = regretSkillGame.battleOutcome.playerAction?.petSkill;
const regretMainHit = regretTelemetry?.hits?.find((hit) => Number(hit.targetSlot) === 5);
const regretSecondHit = regretTelemetry?.hits?.find((hit) => Number(hit.targetSlot) === 0);
assertEqual(regretSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_REGRET", "Regret pet skill maps to source battle command");
assertEqual(regretTelemetry?.attackPercent, 30, "Regret parses source attack boost");
assertEqual(regretTelemetry?.defencePercent, -50, "Regret parses source defence penalty");
assertEqual(regretTelemetry?.targetScope, "enemy-column", "Regret records source front/back target scope");
assertEqual(regretMainHit?.sourceCommand, "BATTLE_COM_S_REGRET", "Regret main hit records source command");
assertEqual(regretSecondHit?.sourceCommand, "BATTLE_COM_S_REGRET2", "Regret secondary hit records source command");
assertEqual(regretSecondHit?.multiplier, 0.8, "Regret secondary hit applies source 0.8 damage multiplier");
assert(Number(regretMainHit?.damage || 0) > 0, "Regret damages the selected back target");
assert(Number(regretSecondHit?.damage || 0) > 0, "Regret damages the paired front target");
assert(Number(regretSkillGame.battle?.enemyParty?.[5]?.Hp || 0) < 999, "Regret persists damage on selected back target");
assert(Number(regretSkillGame.battle?.enemyParty?.[0]?.Hp || 0) < 999, "Regret persists damage on paired front target");
assertEqual(regretSkillGame.pets[0].WorkAttackPower, 100, "Regret restores temporary attack boost after the round");
assertEqual(regretSkillGame.pets[0].WorkDefencePower, 80, "Regret restores temporary defence penalty after the round");
let gyrateSkillGame = await api("/api/game/new", { name: "pet-gyrate-skill-test" });
gyrateSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
gyrateSkillGame = await api("/api/game/dialog", { game: gyrateSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
gyrateSkillGame.pets[0].PetSkillIds = [619];
gyrateSkillGame.pets[0].PetSkills = [{
  Id: 619,
  Name: "回旋攻击",
  Des: "攻击力下降50% 可攻击敌方一排",
  FuncName: "PETSKILL_Gyrate",
  Option: "攻%-50",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(gyrateSkillGame.pets[0], {
  WorkFixStr: 120,
  WorkAttackPower: 120,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(gyrateSkillGame.encounter, {
  EnemyId: 990619,
  PetId: 990619,
  Name: "回旋测试敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0
});
const gyrateEnemyTwo = {
  ...gyrateSkillGame.encounter,
  EnemyId: 990620,
  PetId: 990620,
  Name: "回旋测试敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
const gyrateEnemyThree = {
  ...gyrateSkillGame.encounter,
  EnemyId: 990621,
  PetId: 990621,
  Name: "回旋测试敌人三",
  Hp: 999,
  WorkMaxHp: 999
};
gyrateSkillGame.battle.enemyParty = [gyrateSkillGame.encounter, gyrateEnemyTwo, gyrateEnemyThree];
gyrateSkillGame.battle.activeEnemyIndex = 0;
gyrateSkillGame = await api("/api/game/battle", { game: gyrateSkillGame, action: "skill:0" });
const gyrateTelemetry = gyrateSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(gyrateSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_GYRATE", "Gyrate pet skill maps to source battle command");
assertEqual(gyrateTelemetry?.attackPercent, -50, "Gyrate applies source attack percent as temporary WorkAttackPower");
assertEqual(gyrateTelemetry?.targetScope, "enemy-row", "Gyrate preserves source row target scope telemetry");
assertEqual(gyrateTelemetry?.hits?.length, 3, "Gyrate attacks each live enemy in the source row");
assertEqual(new Set(gyrateTelemetry.hits.map((hit) => hit.targetSlot)).size, 3, "Gyrate records distinct row target slots");
assert(gyrateSkillGame.battle.enemyParty.every((enemy) => Number(enemy.Hp || 0) < 999), "Gyrate damages every live enemy in the row fixture");
assertEqual(gyrateSkillGame.pets[0].WorkAttackPower, 120, "Gyrate restores temporary attack after the round");
let firekillSkillGame = await api("/api/game/new", { name: "pet-firekill-skill-test" });
firekillSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
firekillSkillGame = await api("/api/game/dialog", { game: firekillSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
firekillSkillGame.pets[0].PetSkillIds = [624];
firekillSkillGame.pets[0].PetSkills = [{
  Id: 624,
  Name: "火线猎杀",
  Des: "敌一排火焰攻击",
  FuncName: "PETSKILL_Firekill",
  Option: "",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(firekillSkillGame.pets[0], {
  WorkFixStr: 200,
  WorkAttackPower: 200,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(firekillSkillGame.encounter, {
  Name: "火线测试敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 999,
  WorkDefencePower: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:3;0;0;0;0;0;0"
});
const firekillEnemyTwo = {
  ...firekillSkillGame.encounter,
  EnemyId: 990624,
  PetId: 990624,
  Name: "火线测试敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
firekillSkillGame.battle.enemyParty = [firekillSkillGame.encounter, firekillEnemyTwo];
firekillSkillGame.battle.activeEnemyIndex = 0;
firekillSkillGame = await api("/api/game/battle", { game: firekillSkillGame, action: "skill:0" });
const firekillTelemetry = firekillSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(firekillSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_FIREKILL", "Firekill pet skill maps to source battle command");
assertEqual(firekillTelemetry?.attackPercent, -20, "Firekill applies source 80 percent WorkFixStr physical attack");
assertEqual(firekillTelemetry?.targetScope, "enemy-row", "Firekill preserves source row target scope telemetry");
assertEqual(firekillTelemetry?.fireMagicPower, 200, "Firekill records source BATTLE_MultiAttMagic_Fire power");
assertEqual(firekillTelemetry?.hits?.length, 1, "Firekill records one source physical opening attack");
assertEqual(firekillTelemetry?.hits?.[0]?.phase, "physical", "Firekill physical hit is separated from fire magic hits");
assertEqual(firekillTelemetry?.fireMagicHits?.length, 2, "Firekill applies fire magic to each live enemy in the selected row");
assert(firekillTelemetry.fireMagicHits.every((hit) => hit.damage === 200), "Firekill fire magic uses source Power=200 while magic resist is not modeled");
assert(Number(firekillSkillGame.battle.enemyParty[0].Hp || 0) < 799, "Firekill active target takes physical plus fire damage");
assertEqual(Number(firekillSkillGame.battle.enemyParty[1].Hp || 0), 799, "Firekill adjacent row target takes fire damage only");
assertEqual(firekillSkillGame.pets[0].WorkAttackPower, 200, "Firekill restores temporary attack after the round");
let attackMagicSkillGame = await api("/api/game/new", { name: "pet-attackmagic-skill-test" });
attackMagicSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
attackMagicSkillGame = await api("/api/game/dialog", { game: attackMagicSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
attackMagicSkillGame.pets[0].PetSkillIds = [317];
attackMagicSkillGame.pets[0].PetSkills = [{
  Id: 317,
  Name: "E熔岩爆发",
  Des: "火魔法LV3-3",
  FuncName: "PETSKILL_AttackMagic",
  Option: "magic 317 item 19663",
  Field: 1,
  Target: 7,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(attackMagicSkillGame.pets[0], {
  WorkQuick: 100,
  WorkFixDex: 100,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(attackMagicSkillGame.encounter, {
  EnemyId: 990317,
  PetId: 990317,
  Name: "攻击魔法测试敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 999,
  WorkDefencePower: 999,
  WorkQuick: 110,
  WorkFixDex: 110,
  WorkAttackPower: 0,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 100,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:3;0;0;0;0;0;0"
});
const attackMagicEnemyTwo = {
  ...attackMagicSkillGame.encounter,
  EnemyId: 990318,
  PetId: 990318,
  Name: "攻击魔法测试敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
attackMagicSkillGame.battle.enemyParty = [attackMagicSkillGame.encounter, attackMagicEnemyTwo];
attackMagicSkillGame.battle.activeEnemyIndex = 0;
attackMagicSkillGame = await api("/api/game/battle", { game: attackMagicSkillGame, action: "skill:0" });
const attackMagicTelemetry = attackMagicSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(attackMagicSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_ATTACK_MAGIC", "AttackMagic pet skill maps to source battle command");
assertEqual(attackMagicTelemetry?.attackMagic?.magicId, 317, "AttackMagic parses source magic id from PETSKILL_OPTION");
assertEqual(attackMagicTelemetry?.attackMagic?.power, 200, "AttackMagic uses source magic.txt power");
assertEqual(attackMagicTelemetry?.attackMagic?.level, 3, "AttackMagic uses source magic.txt level");
assertEqual(attackMagicTelemetry?.attackMagic?.targetIndex, 26, "AttackMagic preserves source TargetIndex row target");
assertEqual(attackMagicTelemetry?.targetScope, "enemy-row", "AttackMagic maps TargetIndex 26 to row target scope");
assertEqual(attackMagicTelemetry?.sourceQuickBonus, 20, "AttackMagic records source BATTLE_COM_S_ATTACK_MAGIC quick bonus");
assert(attackMagicSkillGame.battleOutcome.log[0]?.includes("E熔岩爆发"), "AttackMagic source quick bonus lets the magic pet act before a slightly faster enemy");
assertEqual(attackMagicTelemetry?.hits?.length, 2, "AttackMagic applies row magic to each live enemy in the selected row");
assert(attackMagicTelemetry.hits.every((hit) => hit.magicId === 317 && hit.power === 200 && hit.phase === "attack-magic"), "AttackMagic hit telemetry records source magic id, power, and phase");
assert(attackMagicTelemetry.hits.every((hit) => Number(hit.elementMultiplier || 0) > 1.4), "AttackMagic applies source magic element advantage through local attributes");
assert(attackMagicSkillGame.battle.enemyParty.every((enemy) => Number(enemy.Hp || 0) < 999), "AttackMagic persists row magic damage to every target in the fixture");
let combinedSkillGame = await api("/api/game/new", { name: "pet-combined-skill-test" });
combinedSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedSkillGame = await api("/api/game/dialog", { game: combinedSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedSkillGame.pets[0].PetSkillIds = [630];
combinedSkillGame.pets[0].PetSkills = [{
  Id: 630,
  Name: "地灵威能",
  Des: "可招唤地精灵魔法威力的技能",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|306",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedSkillGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(combinedSkillGame.encounter, {
  EnemyId: 990630,
  PetId: 990630,
  Name: "综合法测试敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 999,
  WorkDefencePower: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  EarthAT: 100,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:3;0;0;0;0;0;0"
});
const combinedEnemyTwo = {
  ...combinedSkillGame.encounter,
  EnemyId: 990631,
  PetId: 990631,
  Name: "综合法测试敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
combinedSkillGame.battle.enemyParty = [combinedSkillGame.encounter, combinedEnemyTwo];
combinedSkillGame.battle.activeEnemyIndex = 0;
combinedSkillGame = await api("/api/game/battle", { game: combinedSkillGame, action: "skill:0" });
const combinedTelemetry = combinedSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_JYUJYUTU", "Combined pet skill maps to source JYUJYUTU command");
assertEqual(combinedTelemetry?.combined?.profile?.magicIds?.[0], 306, "Combined preserves source magic candidate id");
assertEqual(combinedTelemetry?.combined?.selectedMagicId, 306, "Combined selects the source magic id from PETSKILL_OPTION");
assertEqual(combinedTelemetry?.attackMagic?.magicId, 306, "Combined selected attack magic reuses source magic profile");
assertEqual(combinedTelemetry?.attackMagic?.combinedSelected, true, "Combined marks the attack magic as selected through PETSKILL_Combined");
assertEqual(combinedTelemetry?.attackMagic?.targetIndex, 20, "Combined selected magic keeps source TargetIndex 20 all-enemy shape");
assertEqual(combinedTelemetry?.hits?.length, 2, "Combined selected attack magic applies to every live enemy target");
assert(combinedTelemetry.hits.every((hit) => hit.sourceCommand === "BATTLE_COM_JYUJYUTU" && hit.magicId === 306), "Combined hit telemetry records source JYUJYUTU command plus selected magic id");
assert(combinedSkillGame.battle.enemyParty.every((enemy) => Number(enemy.Hp || 0) < 999), "Combined selected attack magic persists damage to all targets");
let unsupportedCombinedMagicGame = await api("/api/game/new", { name: "pet-combined-unsupported-high-magic-test" });
unsupportedCombinedMagicGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
unsupportedCombinedMagicGame = await api("/api/game/dialog", { game: unsupportedCombinedMagicGame, npcId: battleNpc.npc.id, message: "宠物" });
unsupportedCombinedMagicGame.pets[0].PetSkillIds = [800];
unsupportedCombinedMagicGame.pets[0].PetSkills = [{
  Id: 800,
  Name: "土系魔法初级",
  Des: "候选表里存在但本地 magic.txt 未定义的综合法魔法",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|470",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "public/data/petskill2.txt"
}];
let unsupportedCombinedError = "";
try {
  await api("/api/game/battle", { game: unsupportedCombinedMagicGame, action: "skill:0" });
} catch (error) {
  unsupportedCombinedError = error.message || String(error);
}
assert(unsupportedCombinedError.includes("还没有接入战斗结算"), "Combined high magic id 470 remains unsupported without a local source magic definition");
const unsupportedPetSkillBoundaryCases = [
  {
    id: 642,
    name: "觉醒",
    func: "PETSKILL_Awaken",
    option: "攻%5 防%5 敏%5 命%30 回%30",
    expected: "no registered executable battle function"
  },
  {
    id: 643,
    name: "蛊惑",
    func: "PETSKILL_Temptation",
    option: "40",
    expected: "no PETSKILL_Temptation registration"
  },
  {
    id: 200,
    name: "加工",
    func: "PETSKILL_Merge",
    option: "",
    expected: "source field/craft pet skill"
  },
  {
    id: 540,
    name: "修复",
    func: "PETSKILL_Fixitem",
    option: "",
    expected: "source field/craft pet skill"
  },
  {
    id: 572,
    name: "镶宝石",
    func: "PETSKILL_Inslay",
    option: "",
    expected: "source field/craft pet skill"
  }
];
for (const boundarySkill of unsupportedPetSkillBoundaryCases) {
  let boundaryGame = await api("/api/game/new", { name: `pet-boundary-${boundarySkill.func}` });
  boundaryGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
  boundaryGame = await api("/api/game/dialog", { game: boundaryGame, npcId: battleNpc.npc.id, message: "宠物" });
  boundaryGame.pets[0].PetSkillIds = [boundarySkill.id];
  boundaryGame.pets[0].PetSkills = [{
    Id: boundarySkill.id,
    Name: boundarySkill.name,
    Des: "source boundary regression fixture",
    FuncName: boundarySkill.func,
    Option: boundarySkill.option,
    Field: 1,
    Target: 1,
    UseType: 2,
    Source: "public/data/petskill2.txt"
  }];
  let boundaryError = "";
  try {
    await api("/api/game/battle", { game: boundaryGame, action: "skill:0" });
  } catch (error) {
    boundaryError = error.message || String(error);
  }
  assert(boundaryError.includes("source-boundary"), `${boundarySkill.func} battle attempt reports source boundary`);
  assert(boundaryError.includes(boundarySkill.expected), `${boundarySkill.func} battle attempt reports the expected unsupported reason`);
}
let combinedStatusChangeGame = await api("/api/game/new", { name: "pet-combined-status-change-test" });
combinedStatusChangeGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedStatusChangeGame = await api("/api/game/dialog", { game: combinedStatusChangeGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedStatusChangeGame.pets[0].PetSkillIds = [629];
combinedStatusChangeGame.pets[0].PetSkills = [{
  Id: 629,
  Name: "难得糊涂改",
  Des: "随机让对方产生异常状态",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|159",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedStatusChangeGame.pets[0], {
  PetId: 990000,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(combinedStatusChangeGame.encounter, {
  EnemyId: 991003,
  PetId: 991003,
  Name: "综合状态测试敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0
});
const combinedStatusEnemyTwo = {
  ...combinedStatusChangeGame.encounter,
  EnemyId: 991005,
  PetId: 991005,
  Name: "综合状态测试敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
combinedStatusChangeGame.battle.enemyParty = [combinedStatusChangeGame.encounter, combinedStatusEnemyTwo];
combinedStatusChangeGame.battle.activeEnemyIndex = 0;
combinedStatusChangeGame = await api("/api/game/battle", { game: combinedStatusChangeGame, action: "skill:0" });
const combinedStatusTelemetry = combinedStatusChangeGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedStatusChangeGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_JYUJYUTU", "Combined status change keeps source JYUJYUTU command");
assertEqual(combinedStatusTelemetry?.combined?.profile?.statusChangeMagicIds?.[0], 159, "Combined status change exposes MAGIC_StatusChange candidate id");
assertEqual(combinedStatusTelemetry?.combined?.selectedMagicId, 159, "Combined status change selects the source magic id");
assertEqual(combinedStatusTelemetry?.combined?.selectedKind, "status-change", "Combined status change records selected kind");
assertEqual(combinedStatusTelemetry?.status?.magicId, 159, "Combined selected status change records source magic id");
assertEqual(combinedStatusTelemetry?.status?.status?.key, "stone", "Combined selected status change maps source stone status");
assertEqual(combinedStatusTelemetry?.status?.rolls?.length, 2, "Combined status change applies source all-enemy target index");
assert(combinedStatusTelemetry.status.rolls.every((roll) => roll.chance === 25 && roll.success), "Combined status change uses source success percent for every target fixture");
assert(Number(combinedStatusChangeGame.battle.enemyParty[0]?.BattleStatuses?.stone?.turns || 0) > 0, "Combined status change persists stone on first enemy");
assert(Number(combinedStatusChangeGame.battle.enemyParty[1]?.BattleStatuses?.stone?.turns || 0) > 0, "Combined status change persists stone on second enemy");
let combinedStatusLv6Game = await api("/api/game/new", { name: "pet-combined-status-change-lv6-test" });
combinedStatusLv6Game.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedStatusLv6Game = await api("/api/game/dialog", { game: combinedStatusLv6Game, npcId: battleNpc.npc.id, message: "宠物" });
combinedStatusLv6Game.pets[0].PetSkillIds = [733];
combinedStatusLv6Game.pets[0].PetSkills = [{
  Id: 733,
  Name: "狮王之吼",
  Des: "随机施放石化、睡眠、混乱LV6全体精灵",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|413",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedStatusLv6Game.pets[0], {
  PetId: 990000,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(combinedStatusLv6Game.encounter, {
  EnemyId: 991001,
  PetId: 991001,
  Name: "综合状态六级敌人一",
  WorkMaxHp: 999,
  Hp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0
});
const combinedStatusLv6EnemyTwo = {
  ...combinedStatusLv6Game.encounter,
  EnemyId: 991002,
  PetId: 991002,
  Name: "综合状态六级敌人二",
  Hp: 999,
  WorkMaxHp: 999
};
combinedStatusLv6Game.battle.enemyParty = [combinedStatusLv6Game.encounter, combinedStatusLv6EnemyTwo];
combinedStatusLv6Game.battle.activeEnemyIndex = 0;
combinedStatusLv6Game = await api("/api/game/battle", { game: combinedStatusLv6Game, action: "skill:0" });
const combinedStatusLv6Telemetry = combinedStatusLv6Game.battleOutcome.playerAction?.petSkill;
assertEqual(combinedStatusLv6Telemetry?.combined?.profile?.statusChangeMagicIds?.[0], 413, "Combined LV6 status change exposes source MAGIC_StatusChange id");
assertEqual(combinedStatusLv6Telemetry?.status?.status?.turn, 6, "Combined LV6 status change keeps source turn count");
assert(combinedStatusLv6Telemetry.status.rolls.every((roll) => roll.chance === 25 && roll.success), "Combined LV6 status change uses source success percent");
assert(Number(combinedStatusLv6Game.battle.enemyParty[0]?.BattleStatuses?.stone?.turns || 0) >= 6, "Combined LV6 status change persists source turn count on first enemy");
let combinedRefreshSkillGame = await api("/api/game/new", { name: "pet-combined-refresh-skill-test" });
combinedRefreshSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedRefreshSkillGame = await api("/api/game/dialog", { game: combinedRefreshSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedRefreshSkillGame.pets[0].PetSkillIds = [637];
combinedRefreshSkillGame.pets[0].PetSkills = [{
  Id: 637,
  Name: "净化之舞",
  Des: "全部状态异常回复 (一方全体)",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|61",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedRefreshSkillGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999,
  BattleStatuses: {
    poison: { key: "poison", label: "中毒", turns: 3 },
    weaken: { key: "weaken", label: "虚弱", turns: 3 }
  }
});
combinedRefreshSkillGame.player.BattleStatuses = {
  weaken: { key: "weaken", label: "虚弱", turns: 3 }
};
combinedRefreshSkillGame.encounter.BattleStatuses = {
  poison: { key: "poison", label: "中毒", turns: 3 }
};
Object.assign(combinedRefreshSkillGame.encounter, {
  WorkAttackPower: 1,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(combinedRefreshSkillGame.battle?.enemyParty?.[0] || {}, {
  BattleStatuses: combinedRefreshSkillGame.encounter.BattleStatuses,
  WorkAttackPower: combinedRefreshSkillGame.encounter.WorkAttackPower,
  WorkQuick: combinedRefreshSkillGame.encounter.WorkQuick,
  WorkFixDex: combinedRefreshSkillGame.encounter.WorkFixDex
});
combinedRefreshSkillGame = await api("/api/game/battle", { game: combinedRefreshSkillGame, action: "skill:0" });
const combinedRefreshTelemetry = combinedRefreshSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedRefreshSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_JYUJYUTU", "Combined status recovery keeps source JYUJYUTU command");
assertEqual(combinedRefreshTelemetry?.combined?.profile?.magicIds?.[0], 61, "Combined status recovery preserves source MAGIC_StatusRecovery candidate id");
assertEqual(combinedRefreshTelemetry?.combined?.selectedMagicId, 61, "Combined status recovery selects magic id 61");
assertEqual(combinedRefreshTelemetry?.combined?.selectedKind, "refresh", "Combined status recovery records the selected non-attack magic kind");
assertEqual(combinedRefreshTelemetry?.refresh?.magicId, 61, "Combined selected refresh records source magic id 61");
assertEqual(combinedRefreshTelemetry?.refresh?.combinedSelected, true, "Combined selected refresh marks the recovery as selected through PETSKILL_Combined");
assertEqual(combinedRefreshTelemetry?.refresh?.sourceCommand, "BATTLE_COM_JYUJYUTU", "Combined selected refresh reports JYUJYUTU as the source command");
assert(combinedRefreshTelemetry?.refresh?.success, "Combined selected refresh recovers at least one ally-side status");
assert(combinedRefreshTelemetry?.refresh?.results?.some((result) => result.targetKind === "player" && result.removed.includes("weaken")), "Combined selected refresh clears player ally status");
assert(combinedRefreshTelemetry?.refresh?.results?.some((result) => result.targetKind === "pet" && result.removed.includes("poison") && result.removed.includes("weaken")), "Combined selected refresh clears active pet statuses");
assert(!combinedRefreshSkillGame.player.BattleStatuses?.weaken, "Combined selected refresh persists player status cleanup");
assert(!combinedRefreshSkillGame.pets[0].BattleStatuses?.poison && !combinedRefreshSkillGame.pets[0].BattleStatuses?.weaken, "Combined selected refresh persists pet status cleanup");
assert(combinedRefreshSkillGame.encounter.BattleStatuses?.poison, "Combined selected refresh does not clear enemy status");
const combinedSingleRefreshCases = [
  { magicId: 71, option: "毒", key: "poison", label: "中毒", otherKey: "confusion", otherLabel: "混乱" },
  { magicId: 81, option: "麻", key: "paralysis", label: "麻痹", otherKey: "poison", otherLabel: "中毒" },
  { magicId: 91, option: "石", key: "stone", label: "石化", otherKey: "poison", otherLabel: "中毒" },
  { magicId: 101, option: "乱", key: "confusion", label: "混乱", otherKey: "poison", otherLabel: "中毒" },
  { magicId: 121, option: "眠", key: "sleep", label: "睡眠", otherKey: "poison", otherLabel: "中毒" }
];
for (const statusCase of combinedSingleRefreshCases) {
  let singleRefreshSkillGame = await api("/api/game/new", { name: `pet-combined-single-refresh-${statusCase.magicId}` });
  singleRefreshSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
  singleRefreshSkillGame = await api("/api/game/dialog", { game: singleRefreshSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
  singleRefreshSkillGame.pets[0].PetSkillIds = [648];
  singleRefreshSkillGame.pets[0].PetSkills = [{
    Id: 648,
    Name: `配药-${statusCase.option}`,
    Des: "单项状态异常回复 (一方全体)",
    FuncName: "PETSKILL_Combined",
    Option: `综合法|1|${statusCase.magicId}`,
    Field: 1,
    Target: 2,
    UseType: 2,
    Source: "gmsv-data/petskill2.txt"
  }];
  Object.assign(singleRefreshSkillGame.pets[0], {
    WorkQuick: 999,
    WorkFixDex: 999,
    Hp: 999,
    WorkMaxHp: 999,
    BattleStatuses: {}
  });
  singleRefreshSkillGame.player.BattleStatuses = {
    [statusCase.key]: { key: statusCase.key, label: statusCase.label, turns: 3 },
    [statusCase.otherKey]: { key: statusCase.otherKey, label: statusCase.otherLabel, turns: 3 }
  };
  singleRefreshSkillGame.encounter.BattleStatuses = {
    [statusCase.key]: { key: statusCase.key, label: statusCase.label, turns: 3 }
  };
  Object.assign(singleRefreshSkillGame.encounter, {
    WorkAttackPower: 1,
    WorkQuick: 1,
    WorkFixDex: 1
  });
  Object.assign(singleRefreshSkillGame.battle?.enemyParty?.[0] || {}, {
    BattleStatuses: singleRefreshSkillGame.encounter.BattleStatuses,
    WorkAttackPower: singleRefreshSkillGame.encounter.WorkAttackPower,
    WorkQuick: singleRefreshSkillGame.encounter.WorkQuick,
    WorkFixDex: singleRefreshSkillGame.encounter.WorkFixDex
  });
  singleRefreshSkillGame = await api("/api/game/battle", { game: singleRefreshSkillGame, action: "skill:0" });
  const singleRefreshTelemetry = singleRefreshSkillGame.battleOutcome.playerAction?.petSkill;
  assertEqual(singleRefreshSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_JYUJYUTU", `Combined single status recovery ${statusCase.magicId} keeps source JYUJYUTU command`);
  assertEqual(singleRefreshTelemetry?.combined?.profile?.magicIds?.[0], statusCase.magicId, `Combined single status recovery ${statusCase.magicId} preserves source MAGIC_StatusRecovery candidate id`);
  assertEqual(singleRefreshTelemetry?.combined?.profile?.refreshMagicIds?.[0], statusCase.magicId, `Combined single status recovery ${statusCase.magicId} exposes refresh candidate id`);
  assertEqual(singleRefreshTelemetry?.combined?.selectedMagicId, statusCase.magicId, `Combined single status recovery ${statusCase.magicId} selects the source magic id`);
  assertEqual(singleRefreshTelemetry?.combined?.selectedKind, "refresh", `Combined single status recovery ${statusCase.magicId} records refresh kind`);
  assertEqual(singleRefreshTelemetry?.refresh?.magicId, statusCase.magicId, `Combined single status recovery ${statusCase.magicId} records source magic id`);
  assertEqual(singleRefreshTelemetry?.refresh?.refresh?.status?.key, statusCase.key, `Combined single status recovery ${statusCase.magicId} maps source status key`);
  assert(singleRefreshTelemetry?.refresh?.results?.some((result) => result.targetKind === "player" && result.removed.includes(statusCase.key)), `Combined single status recovery ${statusCase.magicId} clears matching player status`);
  assert(!singleRefreshSkillGame.player.BattleStatuses?.[statusCase.key], `Combined single status recovery ${statusCase.magicId} persists matching player status cleanup`);
  assert(singleRefreshSkillGame.player.BattleStatuses?.[statusCase.otherKey], `Combined single status recovery ${statusCase.magicId} leaves unrelated player status`);
  assert(singleRefreshSkillGame.encounter.BattleStatuses?.[statusCase.key], `Combined single status recovery ${statusCase.magicId} does not clear enemy status`);
}
let combinedRecoverySkillGame = await api("/api/game/new", { name: "pet-combined-recovery-skill-test" });
combinedRecoverySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedRecoverySkillGame = await api("/api/game/dialog", { game: combinedRecoverySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedRecoverySkillGame.player.WorkMaxHp = 120;
combinedRecoverySkillGame.player.maxHp = 120;
combinedRecoverySkillGame.player.hp = 80;
combinedRecoverySkillGame.pets[0].PetSkillIds = [646];
combinedRecoverySkillGame.pets[0].PetSkills = [{
  Id: 646,
  Name: "元气",
  Des: "回覆我方全体体力",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|20",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedRecoverySkillGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 40,
  WorkMaxHp: 70
});
Object.assign(combinedRecoverySkillGame.encounter, {
  Name: "综合法回复测试敌人",
  WorkMaxHp: 90,
  Hp: 30,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(combinedRecoverySkillGame.battle?.enemyParty?.[0] || {}, {
  Name: combinedRecoverySkillGame.encounter.Name,
  WorkMaxHp: combinedRecoverySkillGame.encounter.WorkMaxHp,
  Hp: combinedRecoverySkillGame.encounter.Hp,
  WorkAttackPower: combinedRecoverySkillGame.encounter.WorkAttackPower,
  WorkFixStr: combinedRecoverySkillGame.encounter.WorkFixStr,
  WorkQuick: combinedRecoverySkillGame.encounter.WorkQuick,
  WorkFixDex: combinedRecoverySkillGame.encounter.WorkFixDex,
  WorkTacticsOption: combinedRecoverySkillGame.encounter.WorkTacticsOption
});
combinedRecoverySkillGame = await api("/api/game/battle", { game: combinedRecoverySkillGame, action: "skill:0" });
const combinedRecoveryTelemetry = combinedRecoverySkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedRecoverySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_JYUJYUTU", "Combined HP recovery keeps source JYUJYUTU command");
assertEqual(combinedRecoveryTelemetry?.combined?.profile?.magicIds?.[0], 20, "Combined HP recovery preserves source MAGIC_Recovery candidate id");
assertEqual(combinedRecoveryTelemetry?.combined?.profile?.recoveryMagicIds?.[0], 20, "Combined HP recovery exposes recovery candidate id");
assertEqual(combinedRecoveryTelemetry?.combined?.selectedMagicId, 20, "Combined HP recovery selects magic id 20");
assertEqual(combinedRecoveryTelemetry?.combined?.selectedKind, "recovery", "Combined HP recovery records selected recovery kind");
assertEqual(combinedRecoveryTelemetry?.recovery?.magicId, 20, "Combined selected recovery records source magic id 20");
assertEqual(combinedRecoveryTelemetry?.recovery?.combinedSelected, true, "Combined selected recovery marks the HP recovery as selected through PETSKILL_Combined");
assertEqual(combinedRecoveryTelemetry?.recovery?.recovery?.power, 50, "Combined selected recovery uses source MAGIC_Recovery power");
assert(combinedRecoveryTelemetry?.recovery?.results?.some((result) => result.targetKind === "player" && result.before === 80 && result.after === result.maxHp && result.amount === result.maxHp - 80), "Combined selected recovery heals player ally up to runtime max HP");
assert(combinedRecoveryTelemetry?.recovery?.results?.some((result) => result.targetKind === "pet" && result.before === 40 && result.after === 70 && result.amount === 30), "Combined selected recovery heals active pet ally up to max HP");
assertEqual(combinedRecoverySkillGame.player.hp, combinedRecoverySkillGame.player.WorkMaxHp, "Combined selected recovery persists player HP recovery");
assertEqual(combinedRecoverySkillGame.pets[0].Hp, 70, "Combined selected recovery persists pet HP recovery");
assertEqual(Number(combinedRecoverySkillGame.battle.enemyParty?.[0]?.Hp || 0), 30, "Combined selected recovery does not heal enemy target");
let combinedAttReverseSkillGame = await api("/api/game/new", { name: "pet-combined-att-reverse-skill-test" });
combinedAttReverseSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedAttReverseSkillGame = await api("/api/game/dialog", { game: combinedAttReverseSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedAttReverseSkillGame.pets[0].PetSkillIds = [632];
combinedAttReverseSkillGame.pets[0].PetSkills = [{
  Id: 632,
  Name: "逆转",
  Des: "反转属性",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|240",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedAttReverseSkillGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(combinedAttReverseSkillGame.encounter, {
  Name: "综合法逆转测试敌人",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 10,
  WaterAT: 20,
  FireAT: 30,
  WindAT: 40,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(combinedAttReverseSkillGame.battle?.enemyParty?.[0] || {}, combinedAttReverseSkillGame.encounter);
combinedAttReverseSkillGame = await api("/api/game/battle", { game: combinedAttReverseSkillGame, action: "skill:0" });
const combinedAttReverseTelemetry = combinedAttReverseSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedAttReverseTelemetry?.combined?.profile?.attReverseMagicIds?.[0], 240, "Combined att reverse exposes MAGIC_AttReverse candidate id");
assertEqual(combinedAttReverseTelemetry?.combined?.selectedKind, "att-reverse", "Combined att reverse records selected kind");
assertEqual(combinedAttReverseTelemetry?.attReverse?.magicId, 240, "Combined selected att reverse records source magic id");
assertEqual(combinedAttReverseTelemetry?.attReverse?.combinedSelected, true, "Combined selected att reverse marks the selection source");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.length, 1, "Single-target att reverse affects only the selected enemy");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.[0]?.before?.earth, 10, "AttReverse telemetry records source pre-reverse earth");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.[0]?.after?.earth, 30, "AttReverse applies source earth<-fire mapping");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.[0]?.after?.water, 40, "AttReverse applies source water<-wind mapping");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.[0]?.after?.fire, 10, "AttReverse applies source fire<-earth mapping");
assertEqual(combinedAttReverseTelemetry?.attReverse?.results?.[0]?.after?.wind, 20, "AttReverse applies source wind<-water mapping");
assert(combinedAttReverseSkillGame.battle.enemyParty?.[0]?.BattleAttReverse?.active, "AttReverse persists a battle-only reverse flag on the enemy");
let battlePropertySkillGame = await api("/api/game/new", { name: "pet-battle-property-skill-test" });
battlePropertySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
battlePropertySkillGame = await api("/api/game/dialog", { game: battlePropertySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
battlePropertySkillGame.pets[0].PetSkillIds = [612];
battlePropertySkillGame.pets[0].PetSkills = [{
  Id: 612,
  Name: "魔之诅咒",
  Des: "根据目标属性调整自己的战斗属性",
  FuncName: "PETSKILL_BattleProperty",
  Option: "PET_PetskillPropertyEvent",
  Field: 1,
  Target: 5,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(battlePropertySkillGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0
});
Object.assign(battlePropertySkillGame.encounter, {
  Name: "属性构造测试敌人",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 100,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(battlePropertySkillGame.battle?.enemyParty?.[0] || {}, battlePropertySkillGame.encounter);
battlePropertySkillGame = await api("/api/game/battle", { game: battlePropertySkillGame, action: "skill:0" });
const battlePropertyTelemetry = battlePropertySkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(battlePropertySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_PROPERTYSKILL", "BattleProperty uses source PROPERTYSKILL command");
assertEqual(battlePropertyTelemetry?.battleProperty?.functionName, "PET_PetskillPropertyEvent", "BattleProperty records source callback name");
assertEqual(battlePropertyTelemetry?.battleProperty?.targetAttributes?.earth, 100, "BattleProperty records selected target earth attribute");
assertEqual(battlePropertyTelemetry?.battleProperty?.attributes?.wind, 100, "BattleProperty applies source (i+3)%4 mapping: target earth becomes caster wind");
assertEqual(battlePropertyTelemetry?.totalDamage, 0, "BattleProperty has no immediate damage");
assert(battlePropertySkillGame.pets[0].BattleProperty?.active, "BattleProperty persists a battle-only property callback on the active pet");
assertEqual(battlePropertySkillGame.pets[0].BattleProperty?.attributes?.wind, 100, "BattleProperty persisted state uses the mapped wind attribute for future damage");
assertEqual(battlePropertySkillGame.characterFields?.battle?.formation?.allySide?.find((unit) => unit.kind === "pet")?.battleProperty?.attributes?.wind, 100, "BattleProperty appears in lightweight battle formation fields");
let combinedEnemyAllReverseGame = await api("/api/game/new", { name: "pet-combined-enemy-all-reverse-test" });
combinedEnemyAllReverseGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedEnemyAllReverseGame = await api("/api/game/dialog", { game: combinedEnemyAllReverseGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedEnemyAllReverseGame.pets[0].PetSkillIds = [657];
combinedEnemyAllReverseGame.pets[0].PetSkills = [{
  Id: 657,
  Name: "敌方全逆转",
  Des: "反转敌方全体属性",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|240",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedEnemyAllReverseGame.pets[0], { WorkQuick: 999, WorkFixDex: 999, Hp: 999, WorkMaxHp: 999 });
Object.assign(combinedEnemyAllReverseGame.encounter, {
  Name: "敌全逆转一",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 5,
  WaterAT: 15,
  FireAT: 25,
  WindAT: 55,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
const reverseEnemyTwo = { ...combinedEnemyAllReverseGame.encounter, Name: "敌全逆转二", EarthAT: 11, WaterAT: 22, FireAT: 33, WindAT: 44 };
combinedEnemyAllReverseGame.battle.enemyParty = [combinedEnemyAllReverseGame.encounter, reverseEnemyTwo];
combinedEnemyAllReverseGame = await api("/api/game/battle", { game: combinedEnemyAllReverseGame, action: "skill:0" });
const combinedEnemyAllReverseTelemetry = combinedEnemyAllReverseGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedEnemyAllReverseTelemetry?.targetScope, "enemy-all", "Enemy-all att reverse keeps petskill Target=3 scope");
assertEqual(combinedEnemyAllReverseTelemetry?.attReverse?.results?.length, 2, "Enemy-all att reverse applies to all live enemies");
assert(combinedEnemyAllReverseGame.battle.enemyParty.every((enemy) => enemy.BattleAttReverse?.active), "Enemy-all att reverse persists battle reverse on each enemy");
let combinedAllyAllReverseGame = await api("/api/game/new", { name: "pet-combined-ally-all-reverse-test" });
combinedAllyAllReverseGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedAllyAllReverseGame = await api("/api/game/dialog", { game: combinedAllyAllReverseGame, npcId: battleNpc.npc.id, message: "宠物" });
Object.assign(combinedAllyAllReverseGame.player, { EarthAT: 1, WaterAT: 2, FireAT: 3, WindAT: 4, WorkMaxHp: 120, hp: 120 });
combinedAllyAllReverseGame.pets[0].PetSkillIds = [719];
combinedAllyAllReverseGame.pets[0].PetSkills = [{
  Id: 719,
  Name: "我方全逆转",
  Des: "反转我方全体属性",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|240",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedAllyAllReverseGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999,
  EarthAT: 6,
  WaterAT: 7,
  FireAT: 8,
  WindAT: 9
});
Object.assign(combinedAllyAllReverseGame.encounter, {
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
combinedAllyAllReverseGame = await api("/api/game/battle", { game: combinedAllyAllReverseGame, action: "skill:0" });
const combinedAllyAllReverseTelemetry = combinedAllyAllReverseGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedAllyAllReverseTelemetry?.targetScope, "ally-side", "Ally-side att reverse keeps petskill Target=2 scope");
assert(combinedAllyAllReverseTelemetry?.attReverse?.results?.some((result) => result.targetKind === "player" && result.after.earth === 3 && result.after.water === 4), "Ally-side att reverse applies source mapping to player");
assert(combinedAllyAllReverseTelemetry?.attReverse?.results?.some((result) => result.targetKind === "pet" && result.after.earth === 8 && result.after.water === 9), "Ally-side att reverse applies source mapping to active pet");
assert(combinedAllyAllReverseGame.player.BattleAttReverse?.active, "Ally-side att reverse persists battle reverse on player");
assert(combinedAllyAllReverseGame.pets[0].BattleAttReverse?.active, "Ally-side att reverse persists battle reverse on active pet");
let combinedFieldAttGame = await api("/api/game/new", { name: "pet-combined-field-att-skill-test" });
combinedFieldAttGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedFieldAttGame = await api("/api/game/dialog", { game: combinedFieldAttGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedFieldAttGame.pets[0].PetSkillIds = [701];
combinedFieldAttGame.pets[0].PetSkills = [{
  Id: 701,
  Name: "裂地",
  Des: "场地变成地属性",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|194",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedFieldAttGame.pets[0], {
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999,
  EarthAT: 100,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0
});
Object.assign(combinedFieldAttGame.encounter, {
  Name: "综合法场地测试敌人",
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 100,
  WindAT: 0,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(combinedFieldAttGame.battle?.enemyParty?.[0] || {}, combinedFieldAttGame.encounter);
combinedFieldAttGame = await api("/api/game/battle", { game: combinedFieldAttGame, action: "skill:0" });
const combinedFieldAttTelemetry = combinedFieldAttGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedFieldAttTelemetry?.combined?.profile?.fieldAttMagicIds?.[0], 194, "Combined field attribute exposes MAGIC_FieldAttChange candidate id");
assertEqual(combinedFieldAttTelemetry?.combined?.selectedKind, "field-att", "Combined field attribute records selected kind");
assertEqual(combinedFieldAttTelemetry?.fieldAtt?.magicId, 194, "Combined selected field attribute records source magic id");
assertEqual(combinedFieldAttTelemetry?.fieldAtt?.combinedSelected, true, "Combined selected field attribute marks the selection source");
assertEqual(combinedFieldAttTelemetry?.fieldAtt?.applied?.element, "earth", "FieldAtt id 194 applies earth field");
assertEqual(combinedFieldAttTelemetry?.fieldAtt?.applied?.power, 100, "FieldAtt id 194 applies source power");
assertEqual(combinedFieldAttTelemetry?.fieldAtt?.applied?.baseTurns, 5, "FieldAtt id 194 applies source turn count");
assertEqual(combinedFieldAttGame.battle?.fieldAttribute?.turns, 4, "Field attribute decrements once after the source battle round");
combinedFieldAttGame.pets[0].PetSkillIds = [630];
combinedFieldAttGame.pets[0].PetSkills = [{
  Id: 630,
  Name: "地魔法测试",
  Des: "地属性攻击魔法",
  FuncName: "PETSKILL_AttackMagic",
  Option: "magic 306",
  Field: 1,
  Target: 3,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
combinedFieldAttGame.encounter.Hp = 9999;
combinedFieldAttGame.encounter.WorkMaxHp = 9999;
if (combinedFieldAttGame.battle?.enemyParty?.[0]) {
  combinedFieldAttGame.battle.enemyParty[0].Hp = 9999;
  combinedFieldAttGame.battle.enemyParty[0].WorkMaxHp = 9999;
}
combinedFieldAttGame = await api("/api/game/battle", { game: combinedFieldAttGame, action: "skill:0" });
const fieldBoostMagicTelemetry = combinedFieldAttGame.battleOutcome.playerAction?.petSkill;
assert(fieldBoostMagicTelemetry?.hits?.some((hit) => Number(hit.fieldMultiplier || 0) > 1.9), "Active field attribute adjusts later attack magic damage");
let combinedFieldClearGame = await api("/api/game/new", { name: "pet-combined-field-clear-skill-test" });
combinedFieldClearGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
combinedFieldClearGame = await api("/api/game/dialog", { game: combinedFieldClearGame, npcId: battleNpc.npc.id, message: "宠物" });
combinedFieldClearGame.battle.fieldAttribute = {
  active: true,
  magicId: 194,
  element: "earth",
  fieldAttr: 1,
  power: 100,
  turns: 4,
  baseTurns: 5,
  sourceOption: "華 100 turn 5",
  sourceCommand: "BATTLE_COM_JYUJYUTU",
  source: "test preloaded field attribute"
};
combinedFieldClearGame.pets[0].PetSkillIds = [705];
combinedFieldClearGame.pets[0].PetSkills = [{
  Id: 705,
  Name: "调和",
  Des: "场地恢复无属性",
  FuncName: "PETSKILL_Combined",
  Option: "综合法|1|230",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(combinedFieldClearGame.pets[0], { WorkQuick: 999, WorkFixDex: 999, Hp: 999, WorkMaxHp: 999 });
Object.assign(combinedFieldClearGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 0,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkTacticsOption: "at:1;3;1|gu:100|es:0|wa:0;0;0;0;0;0;0"
});
combinedFieldClearGame = await api("/api/game/battle", { game: combinedFieldClearGame, action: "skill:0" });
const combinedFieldClearTelemetry = combinedFieldClearGame.battleOutcome.playerAction?.petSkill;
assertEqual(combinedFieldClearTelemetry?.combined?.selectedMagicId, 230, "Combined field clear selects MAGIC_FieldAttChange none id");
assertEqual(combinedFieldClearTelemetry?.fieldAtt?.applied?.active, false, "FieldAtt id 230 applies no-attribute field state");
assert(!combinedFieldClearGame.battle?.fieldAttribute, "FieldAtt id 230 clears persisted battle field attribute after the round");
let showMercySkillGame = await api("/api/game/new", { name: "pet-showmercy-skill-test" });
showMercySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
showMercySkillGame = await api("/api/game/dialog", { game: showMercySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
showMercySkillGame.pets[0].PetSkillIds = [626];
showMercySkillGame.pets[0].PetSkills = [{
  Id: 626,
  Name: "手下留情",
  Des: "使对方Hp剩下一点 不会将对方致死",
  FuncName: "PETSKILL_ShowMercy",
  Option: "",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(showMercySkillGame.pets[0], {
  WorkFixStr: 999,
  WorkAttackPower: 999,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(showMercySkillGame.encounter, {
  Name: "手下留情测试敌人",
  WorkMaxHp: 40,
  Hp: 40,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(showMercySkillGame.battle?.enemyParty?.[0] || {}, {
  Name: showMercySkillGame.encounter.Name,
  WorkMaxHp: showMercySkillGame.encounter.WorkMaxHp,
  Hp: showMercySkillGame.encounter.Hp,
  WorkFixTough: showMercySkillGame.encounter.WorkFixTough,
  WorkDefencePower: showMercySkillGame.encounter.WorkDefencePower,
  WorkQuick: showMercySkillGame.encounter.WorkQuick,
  WorkFixDex: showMercySkillGame.encounter.WorkFixDex,
  WorkAttackPower: showMercySkillGame.encounter.WorkAttackPower,
  WorkFixStr: showMercySkillGame.encounter.WorkFixStr,
  Critical: showMercySkillGame.encounter.Critical,
  WorkTacticsOption: showMercySkillGame.encounter.WorkTacticsOption
});
showMercySkillGame = await api("/api/game/battle", { game: showMercySkillGame, action: "skill:0" });
const showMercyTelemetry = showMercySkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(showMercySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SHOWMERCY", "ShowMercy pet skill maps to source battle command");
assertEqual(Number(showMercySkillGame.encounter?.Hp || 0), 1, "ShowMercy leaves the active target at 1 HP instead of killing it");
assert(showMercyTelemetry?.hits?.[0]?.showMercyPreventedKill, "ShowMercy telemetry records source no-kill adjustment");
assertEqual(showMercyTelemetry?.hits?.[0]?.showMercyPreventedKill?.beforeHp, 40, "ShowMercy no-kill telemetry records target HP before damage");
assert(Number(showMercyTelemetry?.hits?.[0]?.showMercyPreventedKill?.originalDamage || 0) >= 40, "ShowMercy no-kill telemetry records lethal original damage");
assertEqual(showMercyTelemetry?.hits?.[0]?.damage, 39, "ShowMercy applies source HP-1 adjusted damage");
let sacrificeSkillGame = await api("/api/game/new", { name: "pet-sacrifice-skill-test" });
sacrificeSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
sacrificeSkillGame = await api("/api/game/dialog", { game: sacrificeSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
sacrificeSkillGame.pets[0].PetSkillIds = [573];
sacrificeSkillGame.pets[0].PetSkills = [{
  Id: 573,
  Name: "救援",
  Des: "牺牲自己50%的HP，补至他人身上",
  FuncName: "PETSKILL_Sacrifice",
  Option: "",
  Field: 1,
  Target: 1,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(sacrificeSkillGame.player, { hp: 10, maxHp: 120, WorkMaxHp: 120 });
Object.assign(sacrificeSkillGame.pets[0], {
  WorkFixStr: 1,
  WorkAttackPower: 1,
  WorkQuick: 999,
  WorkFixDex: 999,
  Hp: 100,
  WorkMaxHp: 100
});
Object.assign(sacrificeSkillGame.encounter, {
  Name: "救援测试敌人",
  WorkMaxHp: 80,
  Hp: 80,
  WorkFixTough: 999,
  WorkDefencePower: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:3;0;0;0;0;0;0"
});
Object.assign(sacrificeSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: sacrificeSkillGame.encounter.Name,
  WorkMaxHp: sacrificeSkillGame.encounter.WorkMaxHp,
  Hp: sacrificeSkillGame.encounter.Hp,
  WorkFixTough: sacrificeSkillGame.encounter.WorkFixTough,
  WorkDefencePower: sacrificeSkillGame.encounter.WorkDefencePower,
  WorkQuick: sacrificeSkillGame.encounter.WorkQuick,
  WorkFixDex: sacrificeSkillGame.encounter.WorkFixDex,
  WorkAttackPower: sacrificeSkillGame.encounter.WorkAttackPower,
  WorkFixStr: sacrificeSkillGame.encounter.WorkFixStr,
  Critical: sacrificeSkillGame.encounter.Critical,
  WorkTacticsOption: sacrificeSkillGame.encounter.WorkTacticsOption
});
sacrificeSkillGame = await api("/api/game/battle", { game: sacrificeSkillGame, action: "skill:0" });
const sacrificeTelemetry = sacrificeSkillGame.battleOutcome.playerAction?.petSkill?.sacrifice;
assertEqual(sacrificeSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SACRIFICE", "Sacrifice pet skill maps to source battle command");
assertEqual(Number(sacrificeSkillGame.pets[0].Hp || 0), 50, "Sacrifice halves caster HP using source truncation");
assertEqual(Number(sacrificeSkillGame.player.hp || 0), 60, "Sacrifice heals player by the source post-halving caster HP");
assertEqual(sacrificeTelemetry?.beforeCasterHp, 100, "Sacrifice telemetry records caster HP before source mutation");
assertEqual(sacrificeTelemetry?.afterCasterHp, 50, "Sacrifice telemetry records caster HP after source mutation");
assertEqual(sacrificeTelemetry?.target?.healAmount, 50, "Sacrifice telemetry records source heal amount");
let lowSacrificeSkillGame = await api("/api/game/new", { name: "pet-sacrifice-low-hp-test" });
lowSacrificeSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
lowSacrificeSkillGame = await api("/api/game/dialog", { game: lowSacrificeSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
lowSacrificeSkillGame.pets[0].PetSkillIds = [573];
lowSacrificeSkillGame.pets[0].PetSkills = sacrificeSkillGame.pets[0].PetSkills;
Object.assign(lowSacrificeSkillGame.player, { hp: 10, maxHp: 120, WorkMaxHp: 120 });
Object.assign(lowSacrificeSkillGame.pets[0], { Hp: 20, WorkMaxHp: 100, WorkQuick: 999, WorkFixDex: 999 });
Object.assign(lowSacrificeSkillGame.encounter, sacrificeSkillGame.encounter);
Object.assign(lowSacrificeSkillGame.battle?.enemyParty?.[0] || {}, sacrificeSkillGame.battle?.enemyParty?.[0] || {});
lowSacrificeSkillGame = await api("/api/game/battle", { game: lowSacrificeSkillGame, action: "skill:0" });
const lowSacrificeTelemetry = lowSacrificeSkillGame.battleOutcome.playerAction?.petSkill?.sacrifice;
assertEqual(Number(lowSacrificeSkillGame.pets[0].Hp || 0), 20, "Sacrifice low HP failure does not halve caster HP");
assertEqual(Number(lowSacrificeSkillGame.player.hp || 0), 10, "Sacrifice low HP failure does not heal target");
assertEqual(lowSacrificeTelemetry?.reason, "caster-hp-too-low", "Sacrifice low HP failure follows source HP threshold");
let chargeSkillGame = await api("/api/game/new", { name: "pet-charge-skill-test" });
chargeSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
chargeSkillGame = await api("/api/game/dialog", { game: chargeSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
chargeSkillGame.pets[0].PetSkillIds = [30];
chargeSkillGame.pets[0].PetSkills = [{
  Id: 30,
  Name: "突击",
  Des: "1回合储存力量，下次攻击时就会有两倍的攻击力",
  FuncName: "PETSKILL_ChargeAttack",
  Option: "1 攻%+90",
  Field: 1,
  Target: 6,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(chargeSkillGame.pets[0], {
  WorkFixStr: 100,
  WorkAttackPower: 100,
  WorkQuick: 999,
  WorkFixDex: 1,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(chargeSkillGame.encounter, {
  Name: "突击测试敌人",
  WorkMaxHp: 999,
  Hp: 999,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 999,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Critical: 0,
  WorkTacticsOption: "at:1:1:1|es:0|gu:0|rn:1",
  TacticsOption: "at:1:1:1|es:0|gu:0|rn:1"
});
Object.assign(chargeSkillGame.battle?.enemyParty?.[0] || {}, {
  Name: chargeSkillGame.encounter.Name,
  WorkMaxHp: chargeSkillGame.encounter.WorkMaxHp,
  Hp: chargeSkillGame.encounter.Hp,
  WorkFixTough: chargeSkillGame.encounter.WorkFixTough,
  WorkDefencePower: chargeSkillGame.encounter.WorkDefencePower,
  WorkQuick: chargeSkillGame.encounter.WorkQuick,
  WorkFixDex: chargeSkillGame.encounter.WorkFixDex,
  WorkAttackPower: chargeSkillGame.encounter.WorkAttackPower,
  WorkFixStr: chargeSkillGame.encounter.WorkFixStr,
  Critical: chargeSkillGame.encounter.Critical,
  WorkTacticsOption: chargeSkillGame.encounter.WorkTacticsOption,
  TacticsOption: chargeSkillGame.encounter.TacticsOption
});
chargeSkillGame = await api("/api/game/battle", { game: chargeSkillGame, action: "skill:0" });
const chargeStartTelemetry = chargeSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(chargeSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_CHARGE", "ChargeAttack pet skill starts with source charge command");
assertEqual(chargeStartTelemetry?.chargeTurns, 1, "ChargeAttack parses source charge turn count");
assertEqual(chargeStartTelemetry?.chargeAttackPercent, 90, "ChargeAttack parses source attack percent");
assertEqual(chargeStartTelemetry?.charge?.charging, true, "ChargeAttack first round stores a charging state");
assertEqual(chargeStartTelemetry?.charge?.turns, 0, "ChargeAttack decrements the source charge counter before the next attack");
assertEqual(chargeStartTelemetry?.hits?.length || 0, 0, "ChargeAttack first round does not attack immediately");
assertEqual(Number(chargeSkillGame.encounter?.Hp || 0), 999, "ChargeAttack first round leaves the target undamaged");
chargeSkillGame = await api("/api/game/battle", { game: chargeSkillGame, action: "attack" });
const chargeOkTelemetry = chargeSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(chargeSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_CHARGE_OK", "ChargeAttack stored command resolves as source charge-ok attack");
assertEqual(chargeOkTelemetry?.charge?.completed, true, "ChargeAttack records completed source charge state");
assertEqual(chargeOkTelemetry?.hits?.[0]?.dodged, false, "ChargeAttack charge-ok hit skips source duck check");
assertEqual(chargeOkTelemetry?.hits?.[0]?.dodgeCheck?.reason, "source-charge-ok-no-duck", "ChargeAttack telemetry records source no-duck semantics");
assert(Number(chargeOkTelemetry?.hits?.[0]?.damage || 0) > 0, "ChargeAttack charge-ok hit deals damage");
assert(Number(chargeSkillGame.encounter?.Hp || 0) < 999, "ChargeAttack damages the target after charging");
assertEqual(chargeSkillGame.pets[0].WorkAttackPower, 100, "ChargeAttack restores temporary attack after charge-ok settlement");
assert(!chargeSkillGame.pets[0].BattleCharge, "ChargeAttack clears temporary battle charge state after charge-ok settlement");
let blockedPetSkillGame = await api("/api/game/new", { name: "pet-skill-status-blocked-test" });
blockedPetSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
blockedPetSkillGame = await api("/api/game/dialog", { game: blockedPetSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
blockedPetSkillGame.pets[0].PetSkillIds = [10];
blockedPetSkillGame.pets[0].PetSkills = [{
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
blockedPetSkillGame.pets[0].WorkFixStr = 999;
blockedPetSkillGame.pets[0].WorkAttackPower = 999;
blockedPetSkillGame.pets[0].WorkQuick = 999;
blockedPetSkillGame.pets[0].WorkFixDex = 999;
blockedPetSkillGame.pets[0].BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
blockedPetSkillGame.encounter.WorkMaxHp = 999;
blockedPetSkillGame.encounter.Hp = 999;
blockedPetSkillGame.encounter.WorkFixTough = 1;
blockedPetSkillGame.encounter.WorkDefencePower = 1;
blockedPetSkillGame.encounter.WorkQuick = 0;
blockedPetSkillGame.encounter.WorkFixDex = 0;
blockedPetSkillGame.encounter.WorkAttackPower = 1;
Object.assign(blockedPetSkillGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: blockedPetSkillGame.encounter.WorkMaxHp,
  Hp: blockedPetSkillGame.encounter.Hp,
  WorkFixTough: blockedPetSkillGame.encounter.WorkFixTough,
  WorkDefencePower: blockedPetSkillGame.encounter.WorkDefencePower,
  WorkQuick: blockedPetSkillGame.encounter.WorkQuick,
  WorkFixDex: blockedPetSkillGame.encounter.WorkFixDex,
  WorkAttackPower: blockedPetSkillGame.encounter.WorkAttackPower
});
const blockedPetSkillEnemyHpBefore = Number(blockedPetSkillGame.encounter.Hp || 0);
blockedPetSkillGame = await api("/api/game/battle", { game: blockedPetSkillGame, action: "skill:0" });
assertEqual(blockedPetSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_RENZOKU", "blocked pet skill still records source command telemetry");
assertEqual(Number(blockedPetSkillGame.encounter?.Hp || 0), blockedPetSkillEnemyHpBefore, "sleep blocks pet skill damage before the pet turn");
assert(!blockedPetSkillGame.pets[0].BattleStatuses?.sleep, "sleep turn is consumed when it blocks pet skill action");
assert(blockedPetSkillGame.battleOutcome.log.some((line) => line.includes("睡眠") && line.includes("无法行动")), "blocked pet skill writes source-style status log");
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
petStatusSkillGame.pets[0].Lv = 1;
petStatusSkillGame.pets[0].PetId = 100;
petStatusSkillGame.pets[0].WorkFixLuck = 20;
petStatusSkillGame.pets[0].Luck = 20;
petStatusSkillGame.pets[0].Str = 30;
petStatusSkillGame.pets[0].WorkFixStr = 30;
petStatusSkillGame.pets[0].WorkAttackPower = 30;
petStatusSkillGame.pets[0].WorkQuick = 999;
petStatusSkillGame.pets[0].WorkFixDex = 999;
petStatusSkillGame.pets[0].Critical = 0;
const statusSkillEnemyFixture = {
  EnemyId: 990257,
  PetId: 990257,
  Name: "状态测试敌人",
  Lv: 1,
  WorkMaxHp: 999,
  Hp: 999,
  Vital: 100,
  Str: 100,
  Tough: 100,
  Dex: 100,
  NoDuck: 1,
  WorkFixTough: 1,
  WorkDefencePower: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 1
};
Object.assign(petStatusSkillGame.encounter, statusSkillEnemyFixture);
Object.assign(petStatusSkillGame.battle?.enemyParty?.[0] || {}, statusSkillEnemyFixture);
const originalRandomForPetStatusSkill = Math.random;
try {
  // Keep this regression deterministic: skip dodge; the status roll comes from stableHashInt.
  Math.random = () => 0;
  petStatusSkillGame = await api("/api/game/battle", { game: petStatusSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForPetStatusSkill;
}
const statusSkillTelemetry = petStatusSkillGame.battleOutcome.playerAction?.petSkill?.status;
assertEqual(petStatusSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_STATUSCHANGE", "status pet skill maps to source battle command");
assertEqual(statusSkillTelemetry?.status?.key, "poison", "status pet skill parses petskill2 status token");
assertEqual(statusSkillTelemetry?.chance, 40, "status pet skill uses source BATTLE_StatusAttackCheck base chance");
assertEqual(statusSkillTelemetry?.roll, 40, "status pet skill regression sits on the source inclusive chance boundary");
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
petMagicStatusGame.pets[0].PetId = 100;
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
petMagicStatusGame.encounter.WorkAttackPower = 0;
petMagicStatusGame.encounter.WorkFixStr = 0;
petMagicStatusGame.encounter.Attack = 0;
petMagicStatusGame.encounter.Str = 0;
petMagicStatusGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
Object.assign(petMagicStatusGame.battle?.enemyParty?.[0] || {}, {
  WorkQuick: petMagicStatusGame.encounter.WorkQuick,
  WorkFixDex: petMagicStatusGame.encounter.WorkFixDex,
  Hp: petMagicStatusGame.encounter.Hp,
  WorkMaxHp: petMagicStatusGame.encounter.WorkMaxHp,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkTacticsOption: petMagicStatusGame.encounter.WorkTacticsOption
});
petMagicStatusGame = await api("/api/game/battle", { game: petMagicStatusGame, action: "skill:0" });
const magicStatusTelemetry = petMagicStatusGame.battleOutcome.playerAction?.petSkill?.magicStatus;
const activeMagicPetIndex = Math.max(0, Number(petMagicStatusGame.petState?.activeIndex || 0));
const activeMagicPet = petMagicStatusGame.pets?.[activeMagicPetIndex] || petMagicStatusGame.pets?.[0];
assertEqual(petMagicStatusGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SUPERWALL", "magic status pet skill maps to source superwall command");
assertEqual(magicStatusTelemetry?.status?.key, "superWall", "magic status pet skill parses petskill2 option");
assert(magicStatusTelemetry?.success, "magic status pet skill applies to active pet");
assert(Number(activeMagicPet?.BattleMagicStatuses?.superWall?.turns || 0) > 0, "magic status pet skill persists active pet battle magic status");
assert(petMagicStatusGame.battleOutcome.log.some((line) => line.includes("铁壁") && line.includes("防御")), "magic status battle log explains defense buff");
let setDuckSkillGame = await api("/api/game/new", { name: "pet-setduck-skill-test" });
setDuckSkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
setDuckSkillGame = await api("/api/game/dialog", { game: setDuckSkillGame, npcId: battleNpc.npc.id, message: "宠物" });
setDuckSkillGame.pets[0].PetSkillIds = [595];
setDuckSkillGame.pets[0].PetSkills = [{
  Id: 595,
  Name: "闪避术",
  Des: "三回合内闪避率上升60，有效时间三回合",
  FuncName: "PETSKILL_SetDuck",
  Option: "3|60",
  Field: 1,
  Target: 0,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(setDuckSkillGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkDefencePower: 1,
  WorkFixTough: 1
});
Object.assign(setDuckSkillGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 500,
  WorkFixStr: 500,
  Attack: 500,
  Str: 500,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(setDuckSkillGame.battle?.enemyParty?.[0] || {}, {
  Hp: setDuckSkillGame.encounter.Hp,
  WorkMaxHp: setDuckSkillGame.encounter.WorkMaxHp,
  WorkQuick: setDuckSkillGame.encounter.WorkQuick,
  WorkFixDex: setDuckSkillGame.encounter.WorkFixDex,
  WorkAttackPower: setDuckSkillGame.encounter.WorkAttackPower,
  WorkFixStr: setDuckSkillGame.encounter.WorkFixStr,
  Attack: setDuckSkillGame.encounter.Attack,
  Str: setDuckSkillGame.encounter.Str,
  WorkTactics: setDuckSkillGame.encounter.WorkTactics,
  WorkTacticsOption: setDuckSkillGame.encounter.WorkTacticsOption
});
const setDuckPetHpBefore = Number(setDuckSkillGame.pets[0].Hp || 0);
const originalRandomForSetDuck = Math.random;
try {
  Math.random = () => 0.3;
  setDuckSkillGame = await api("/api/game/battle", { game: setDuckSkillGame, action: "skill:0" });
} finally {
  Math.random = originalRandomForSetDuck;
}
const setDuckTelemetry = setDuckSkillGame.battleOutcome.playerAction?.petSkill;
assertEqual(setDuckSkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SETDUCK", "SetDuck pet skill maps to source command");
assertEqual(setDuckTelemetry?.setDuckTurn, 3, "SetDuck parses source turn option");
assertEqual(setDuckTelemetry?.setDuckPower, 60, "SetDuck parses source power option");
assert(setDuckTelemetry?.setDuck?.success, "SetDuck applies source duck state");
assertEqual(setDuckSkillGame.battleOutcome.enemyAi?.targetKind, "pet", "SetDuck fixture enemy response targets pet");
assertEqual(setDuckTelemetry?.dodgeCheck?.reason, "set-duck", "SetDuck drives source dodge branch");
assert(setDuckTelemetry?.dodgeCheck?.dodged, "SetDuck source dodge check prevents the enemy hit");
assertEqual(Number(setDuckSkillGame.pets[0].Hp || 0), setDuckPetHpBefore, "SetDuck dodged enemy hit keeps pet HP unchanged");
assertEqual(Number(setDuckSkillGame.pets[0].BattleSkillDuck?.turns || 0), 2, "SetDuck state decrements after the battle round");
let setMagicPetGame = await api("/api/game/new", { name: "pet-setmagicpet-skill-test" });
setMagicPetGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
setMagicPetGame = await api("/api/game/dialog", { game: setMagicPetGame, npcId: battleNpc.npc.id, message: "宠物" });
setMagicPetGame.pets[0].PetSkillIds = [603];
setMagicPetGame.pets[0].PetSkills = [{
  Id: 603,
  Name: "火焰威能",
  Des: "我方全体攻击力三回合内提升10%",
  FuncName: "PETSKILL_SetMagicPet",
  Option: "3|10|STR",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(setMagicPetGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 100,
  WorkFixStr: 100,
  WorkQuick: 999,
  WorkFixDex: 999
});
Object.assign(setMagicPetGame.player, {
  hp: 999,
  maxHp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 80,
  WorkFixStr: 80
});
Object.assign(setMagicPetGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(setMagicPetGame.battle?.enemyParty?.[0] || {}, {
  Hp: setMagicPetGame.encounter.Hp,
  WorkMaxHp: setMagicPetGame.encounter.WorkMaxHp,
  WorkQuick: setMagicPetGame.encounter.WorkQuick,
  WorkFixDex: setMagicPetGame.encounter.WorkFixDex,
  WorkAttackPower: setMagicPetGame.encounter.WorkAttackPower,
  WorkFixStr: setMagicPetGame.encounter.WorkFixStr,
  WorkTactics: setMagicPetGame.encounter.WorkTactics,
  WorkTacticsOption: setMagicPetGame.encounter.WorkTacticsOption
});
setMagicPetGame = await api("/api/game/battle", { game: setMagicPetGame, action: "skill:0" });
const setMagicPetTelemetry = setMagicPetGame.battleOutcome.playerAction?.petSkill?.magicPet;
assertEqual(setMagicPetGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_SETMAGICPET", "SetMagicPet maps to source command");
assertEqual(setMagicPetTelemetry?.profile?.stat, "attack", "SetMagicPet parses STR boost option");
assertEqual(setMagicPetTelemetry?.profile?.turn, 3, "SetMagicPet parses source boost turns");
assertEqual(setMagicPetTelemetry?.profile?.value, 10, "SetMagicPet parses source boost value");
assertEqual(setMagicPetTelemetry?.targets?.length, 2, "SetMagicPet Target=2 applies to the ally side");
assert(setMagicPetTelemetry?.targets?.every((target) => target.success), "SetMagicPet applies to all eligible ally targets");
assertEqual(Number(setMagicPetGame.player.BattleSkillBoosts?.attack?.turns || 0), 2, "SetMagicPet player boost decrements after the round");
assertEqual(Number(setMagicPetGame.pets[0].BattleSkillBoosts?.attack?.turns || 0), 2, "SetMagicPet pet boost decrements after the round");
let setMagicPetHealGame = await api("/api/game/new", { name: "pet-setmagicpet-heal-test" });
setMagicPetHealGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
setMagicPetHealGame = await api("/api/game/dialog", { game: setMagicPetHealGame, npcId: battleNpc.npc.id, message: "宠物" });
setMagicPetHealGame.pets[0].PetSkillIds = [602];
setMagicPetHealGame.pets[0].PetSkills = [{
  Id: 602,
  Name: "水灵滋润",
  Des: "我方全体体力300回复",
  FuncName: "PETSKILL_SetMagicPet",
  Option: "3|300|HP",
  Field: 1,
  Target: 2,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(setMagicPetHealGame.player, { hp: 200, maxHp: 500, WorkMaxHp: 500 });
Object.assign(setMagicPetHealGame.pets[0], {
  Hp: 100,
  WorkMaxHp: 450,
  WorkQuick: 999,
  WorkFixDex: 999
});
Object.assign(setMagicPetHealGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(setMagicPetHealGame.battle?.enemyParty?.[0] || {}, {
  Hp: setMagicPetHealGame.encounter.Hp,
  WorkMaxHp: setMagicPetHealGame.encounter.WorkMaxHp,
  WorkQuick: setMagicPetHealGame.encounter.WorkQuick,
  WorkFixDex: setMagicPetHealGame.encounter.WorkFixDex,
  WorkAttackPower: setMagicPetHealGame.encounter.WorkAttackPower,
  WorkFixStr: setMagicPetHealGame.encounter.WorkFixStr,
  WorkTactics: setMagicPetHealGame.encounter.WorkTactics,
  WorkTacticsOption: setMagicPetHealGame.encounter.WorkTacticsOption
});
setMagicPetHealGame = await api("/api/game/battle", { game: setMagicPetHealGame, action: "skill:0" });
const setMagicPetHealTelemetry = setMagicPetHealGame.battleOutcome.playerAction?.petSkill?.magicPet;
assertEqual(setMagicPetHealTelemetry?.profile?.stat, "hp", "SetMagicPet parses HP recovery option");
assert(setMagicPetHealTelemetry?.targets?.some((target) => target.kind === "player"), "SetMagicPet HP recovery enumerates the ally-side player target");
assertEqual(setMagicPetHealTelemetry?.targets?.find((target) => target.kind === "pet")?.after, 400, "SetMagicPet HP recovery heals pet by source amount");
let varySkillGame = await api("/api/game/new", { name: "pet-vary-skill-test" });
varySkillGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
varySkillGame = await api("/api/game/dialog", { game: varySkillGame, npcId: battleNpc.npc.id, message: "宠物" });
varySkillGame.pets[0].PetSkillIds = [600];
varySkillGame.pets[0].PetSkills = [{
  Id: 600,
  Name: "暗月变身",
  Des: "攻%+30 敏%+30 魔防%-50",
  FuncName: "PETSKILL_Vary",
  Option: "攻%+30 敏%+30 魔防%-50",
  Field: 1,
  Target: 5,
  UseType: 2,
  Source: "gmsv-data/petskill2.txt"
}];
Object.assign(varySkillGame.pets[0], {
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 100,
  WorkFixStr: 100,
  WorkDefencePower: 40,
  WorkFixTough: 40,
  WorkQuick: 100,
  WorkFixDex: 100
});
Object.assign(varySkillGame.encounter, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkQuick: 0,
  WorkFixDex: 0,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
Object.assign(varySkillGame.battle?.enemyParty?.[0] || {}, {
  Hp: varySkillGame.encounter.Hp,
  WorkMaxHp: varySkillGame.encounter.WorkMaxHp,
  WorkQuick: varySkillGame.encounter.WorkQuick,
  WorkFixDex: varySkillGame.encounter.WorkFixDex,
  WorkAttackPower: varySkillGame.encounter.WorkAttackPower,
  WorkFixStr: varySkillGame.encounter.WorkFixStr,
  WorkTactics: varySkillGame.encounter.WorkTactics,
  WorkTacticsOption: varySkillGame.encounter.WorkTacticsOption
});
const varyEnemyHpBefore = Number(varySkillGame.encounter.Hp || 0);
varySkillGame = await api("/api/game/battle", { game: varySkillGame, action: "skill:0" });
const varyTelemetry = varySkillGame.battleOutcome.playerAction?.petSkill?.vary;
assertEqual(varySkillGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_S_VARY", "Vary pet skill maps to source command");
assertEqual(varySkillGame.battleOutcome.playerAction?.petSkill?.varyProfile?.attackPercent, 30, "Vary parses source attack percent");
assertEqual(varySkillGame.battleOutcome.playerAction?.petSkill?.varyProfile?.quickPercent, 30, "Vary parses source quick percent");
assertEqual(varySkillGame.battleOutcome.playerAction?.petSkill?.varyProfile?.magicDefencePercent, -50, "Vary preserves source magic defence option telemetry");
assert(varyTelemetry?.success, "Vary applies source transform state");
assertEqual(varyTelemetry?.after?.attack, 130, "Vary attack multiplier follows PETSKILL_Vary source WorkAttackPower update");
assertEqual(varyTelemetry?.after?.quick, 130, "Vary quick multiplier follows PETSKILL_Vary source WorkQuick update");
assertEqual(Number(varySkillGame.encounter?.Hp || 0), varyEnemyHpBefore, "Vary source command does not deal direct damage");
assertEqual(Number(varySkillGame.pets[0].BattleVary?.turns || 0), 4, "Vary state decrements after the battle round");
assertEqual(varySkillGame.characterFields?.pets?.[0]?.vary?.attackPercent, 30, "character fields expose active Vary state");
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
  Hp: 5000,
  WorkMaxHp: 5000,
  WorkFixTough: 500,
  WorkDefencePower: 500
});
battlePetSwitchGame.encounter.WorkTactics = 1;
battlePetSwitchGame.encounter.WorkTacticsOption = "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0";
battlePetSwitchGame.encounter.Str = 0;
battlePetSwitchGame.encounter.WorkFixStr = 0;
battlePetSwitchGame.encounter.WorkAttackPower = 0;
battlePetSwitchGame.battle.enemyParty = [battlePetSwitchGame.encounter];
battlePetSwitchGame.battle.activeEnemyIndex = 0;
battlePetSwitchGame = await api("/api/game/battle", { game: battlePetSwitchGame, action: "S|1" });
assertEqual(battlePetSwitchGame.petState.activeIndex, 1, "source S pet command switches active battle pet");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_PETOUT", "battle pet switch maps to source PETOUT command");
assertEqual(battlePetSwitchGame.battleOutcome.playerAction?.command, "S|1", "battle pet switch records source S slot command");
assert(!battlePetSwitchGame.pets[0].BattleMagicStatuses?.superWall, "switching out clears old active pet battle-only magic status");
assert(battlePetSwitchGame.encounter, "battle pet switch keeps battle active after the enemy response");
assert(battlePetSwitchGame.battleOutcome.log.some((line) => line.includes("后备出战奥卡洛斯") && line.includes("出战")), "battle pet switch writes source-style battle log");
let blockedPetSwitchGame = await api("/api/game/new", { name: "pet-switch-status-blocked-test" });
blockedPetSwitchGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
blockedPetSwitchGame = await api("/api/game/dialog", { game: blockedPetSwitchGame, npcId: battleNpc.npc.id, message: "宠物" });
blockedPetSwitchGame.pets[0].BattleMagicStatuses = {
  superWall: { key: "superWall", label: "铁壁", turns: 2, percent: 30 }
};
Object.assign(blockedPetSwitchGame.pets[0], {
  Hp: 5000,
  WorkMaxHp: 5000,
  WorkDefencePower: 500,
  WorkFixTough: 500,
  WorkQuick: 100,
  WorkFixDex: 100
});
blockedPetSwitchGame.pets.push({
  ...blockedPetSwitchGame.pets[0],
  Name: "睡眠阻止换宠后备",
  PetId: Number(blockedPetSwitchGame.pets[0].PetId || 100) + 40,
  Lv: 4,
  Hp: 5000,
  WorkMaxHp: 5000
});
blockedPetSwitchGame.player.BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
Object.assign(blockedPetSwitchGame.player, {
  Hp: 99999,
  hp: 99999,
  maxHp: 99999,
  WorkMaxHp: 99999
});
blockedPetSwitchGame.encounter.WorkAttackPower = 0;
blockedPetSwitchGame.encounter.WorkFixStr = 0;
blockedPetSwitchGame.encounter.Attack = 0;
blockedPetSwitchGame.encounter.Str = 0;
blockedPetSwitchGame.encounter.WorkTactics = 1;
blockedPetSwitchGame.encounter.WorkTacticsOption = "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0";
Object.assign(blockedPetSwitchGame.battle?.enemyParty?.[0] || {}, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
const blockedPetSwitchActiveHpBefore = Number(blockedPetSwitchGame.pets[0].Hp || 0);
const originalRandomForBlockedPetSwitchEnemyTurn = Math.random;
try {
  Math.random = () => 0.99;
  blockedPetSwitchGame = await api("/api/game/battle", { game: blockedPetSwitchGame, action: "S|1" });
} finally {
  Math.random = originalRandomForBlockedPetSwitchEnemyTurn;
}
assertEqual(blockedPetSwitchGame.battleOutcome.result, "pet-switch-blocked", "sleep blocks source S pet switch before PETOUT/PETIN mutation");
assertEqual(blockedPetSwitchGame.petState.activeIndex, 0, "blocked source S command keeps the active pet unchanged");
assertEqual(blockedPetSwitchGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_PETOUT", "blocked pet switch still records source S telemetry");
assertEqual(blockedPetSwitchGame.battleOutcome.enemyAi?.targetKind, "player", "blocked pet switch enemy turn honors source target player rule");
assertEqual(Number(blockedPetSwitchGame.pets[0].Hp || 0), blockedPetSwitchActiveHpBefore, "blocked pet switch enemy turn does not force damage onto the active pet");
assert(blockedPetSwitchGame.pets[0].BattleMagicStatuses?.superWall, "blocked pet switch does not clear old active pet battle-only magic status");
assert(!blockedPetSwitchGame.player.BattleStatuses?.sleep, "player sleep turn is consumed when it blocks pet switch");
assert(blockedPetSwitchGame.battleOutcome.log.some((line) => line.includes("睡眠") && line.includes("无法行动")), "blocked pet switch writes source-style status log");
Object.assign(battlePetSwitchGame.pets[0], {
  Hp: 99999,
  WorkMaxHp: 99999,
  WorkDefencePower: 9999,
  WorkFixTough: 9999
});
Object.assign(battlePetSwitchGame.pets[1], {
  Hp: 99999,
  WorkMaxHp: 99999,
  WorkDefencePower: 9999,
  WorkFixTough: 9999
});
battlePetSwitchGame.petFormation = {
  ...(battlePetSwitchGame.petFormation || {}),
  activeIndex: 1
};
battlePetSwitchGame.petState = {
  ...(battlePetSwitchGame.petState || {}),
  activeIndex: 1,
  activePetIndex: 1
};
Object.assign(battlePetSwitchGame.encounter, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0
});
Object.assign(battlePetSwitchGame.battle?.enemyParty?.[0] || {}, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0
});
battlePetSwitchGame = await api("/api/game/dialog", { game: battlePetSwitchGame, npcId: battleNpc.npc.id, message: "换宠" });
assertEqual(battlePetSwitchGame.petState.activeIndex, 0, "NPC dialog battleAction can switch to the next available pet");
assert(battlePetSwitchGame.dialog.debug.vmTrace.some((event) => event.action === "battleAction" && event.detail?.outcome?.result === "pet-switch"), "NPC dialog pet switch records battleAction VM trace");
battlePetSwitchGame.player.hp = 5000;
battlePetSwitchGame.player.Hp = 5000;
battlePetSwitchGame.player.maxHp = 5000;
battlePetSwitchGame.player.WorkMaxHp = 5000;
battlePetSwitchGame.player.WorkAttackPower = 250;
battlePetSwitchGame.player.WorkDefencePower = 500;
battlePetSwitchGame.player.WorkQuick = 250;
battlePetSwitchGame.player.BattleStatuses = {};
battlePetSwitchGame.player.BattleMagicStatuses = {};
battlePetSwitchGame.encounter.WorkMaxHp = Math.max(999, Number(battlePetSwitchGame.encounter.WorkMaxHp || 0));
battlePetSwitchGame.encounter.Hp = battlePetSwitchGame.encounter.WorkMaxHp;
battlePetSwitchGame.encounter.WorkAttackPower = 0;
battlePetSwitchGame.encounter.WorkFixStr = 0;
battlePetSwitchGame.encounter.Attack = 0;
battlePetSwitchGame.encounter.Str = 0;
Object.assign(battlePetSwitchGame.battle?.enemyParty?.[0] || {}, {
  WorkMaxHp: battlePetSwitchGame.encounter.WorkMaxHp,
  Hp: battlePetSwitchGame.encounter.Hp,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0"
});
battlePetSwitchGame.battle.enemyParty = [battlePetSwitchGame.encounter];
battlePetSwitchGame.battle.activeEnemyIndex = 0;
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
// This regression only validates PETOUT availability from player-alone state.
// Keep the fallback pet durable so prior turn residue cannot make this flaky.
battlePetSwitchGame.pets[0].WorkMaxHp = Math.max(5000, Number(battlePetSwitchGame.pets[0].WorkMaxHp || 0));
battlePetSwitchGame.pets[0].Hp = battlePetSwitchGame.pets[0].WorkMaxHp;
battlePetSwitchGame.pets[0].WorkFixTough = Math.max(500, Number(battlePetSwitchGame.pets[0].WorkFixTough || 0));
battlePetSwitchGame.pets[0].WorkDefencePower = Math.max(500, Number(battlePetSwitchGame.pets[0].WorkDefencePower || 0));
battlePetSwitchGame.pets[0].BattleStatuses = {};
battlePetSwitchGame.pets[0].BattleMagicStatuses = {};
battlePetSwitchGame.encounter.WorkAttackPower = 0;
battlePetSwitchGame.encounter.WorkFixStr = 0;
battlePetSwitchGame.encounter.Attack = 0;
battlePetSwitchGame.encounter.Str = 0;
battlePetSwitchGame.encounter.BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
Object.assign(battlePetSwitchGame.battle?.enemyParty?.[0] || {}, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkTactics: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0",
  BattleStatuses: {
    sleep: { key: "sleep", label: "睡眠", turns: 1 }
  }
});
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
let blockedCaptureGame = await api("/api/game/new", { name: "battle-capture-status-blocked-test" });
blockedCaptureGame.location = { mapId: battleNpc.map.id, x: battleNpc.npc.x + 1, y: battleNpc.npc.y };
blockedCaptureGame = await api("/api/game/dialog", { game: blockedCaptureGame, npcId: battleNpc.npc.id, message: "宠物" });
const blockedCapturePetsBefore = blockedCaptureGame.pets.length;
blockedCaptureGame.encounter.CaptureRate = 100;
blockedCaptureGame.player.Hp = 999;
blockedCaptureGame.player.hp = 999;
blockedCaptureGame.player.MaxHp = 999;
blockedCaptureGame.player.maxHp = 999;
blockedCaptureGame.player.WorkMaxHp = 999;
blockedCaptureGame.player.WorkDefencePower = 999;
blockedCaptureGame.player.WorkFixTough = 999;
blockedCaptureGame.player.Defense = 999;
blockedCaptureGame.player.Tough = 999;
blockedCaptureGame.pets[0].Hp = 999;
blockedCaptureGame.pets[0].hp = 999;
blockedCaptureGame.pets[0].MaxHp = 999;
blockedCaptureGame.pets[0].maxHp = 999;
blockedCaptureGame.pets[0].WorkMaxHp = 999;
blockedCaptureGame.pets[0].WorkDefencePower = 999;
blockedCaptureGame.pets[0].WorkFixTough = 999;
blockedCaptureGame.pets[0].Defense = 999;
blockedCaptureGame.pets[0].Tough = 999;
blockedCaptureGame.player.BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
Object.assign(blockedCaptureGame.encounter, {
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0
});
Object.assign(blockedCaptureGame.battle?.enemyParty?.[0] || {}, {
  CaptureRate: blockedCaptureGame.encounter.CaptureRate,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0
});
(blockedCaptureGame.battle?.enemyParty || []).forEach((enemy) => {
  enemy.WorkAttackPower = 0;
  enemy.WorkFixStr = 0;
  enemy.Attack = 0;
  enemy.Str = 0;
});
blockedCaptureGame = await api("/api/game/battle", { game: blockedCaptureGame, action: "capture" });
assertEqual(blockedCaptureGame.battleOutcome.result, "capture-blocked", "sleep blocks source T capture command before capture roll");
assert(blockedCaptureGame.encounter, "blocked capture keeps the battle target active");
assertEqual(blockedCaptureGame.pets.length, blockedCapturePetsBefore, "blocked capture does not add a pet");
assert(blockedCaptureGame.battleOutcome.log.some((line) => line.includes("睡眠") && line.includes("无法行动")), "blocked capture command writes status log");
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

const sotC1Npc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-126-99-7678");
if (!sotC1Npc) throw new Error("missing Samugiru SOT C-1 checkpoint fixture");
assertEqual(sotC1Npc.name, "检查员(C-1)", "SOT C-1 keeps source NPC name");
assert(sotC1Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17" && event.keyword === "贝洛洛克" && event.delItems?.some((item) => Number(item.id) === 2575) && event.getItems?.some((item) => Number(item.id) === 2576)), "SOT C-1 parses source KeyWord checkpoint exchange");
assert(sotC1Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2576&ENDEV=17/.test(event.condition || "")), "SOT C-1 parses source already-passed MESSAGE branch");
let sotC1PromptGame = await api("/api/game/new", { name: "samugiru-sot-c1-prompt-runtime-test" });
sotC1PromptGame.location = { mapId: "1000", x: sotC1Npc.x + 1, y: sotC1Npc.y };
setTestEventFlag(sotC1PromptGame, 17, "end");
sotC1PromptGame.inventory.push({ id: 2575, name: "检查石", qty: 1 });
sotC1PromptGame = await api("/api/game/dialog", { game: sotC1PromptGame, npcId: sotC1Npc.id });
assertEqual(inventoryQty(sotC1PromptGame, 2575), 1, "SOT C-1 prompt branch does not consume starting check stone without keyword");
assertEqual(inventoryQty(sotC1PromptGame, 2576), 0, "SOT C-1 prompt branch does not grant passed check stone without keyword");
assert(sotC1PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "")), "SOT C-1 prompt branch asks for the source signboard answer");
assert(sotC1PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-1 prompt branch selects the non-keyword MESSAGE branch");
let sotC1Game = await api("/api/game/new", { name: "samugiru-sot-c1-keyword-runtime-test" });
sotC1Game.location = { mapId: "1000", x: sotC1Npc.x + 1, y: sotC1Npc.y };
setTestEventFlag(sotC1Game, 17, "end");
sotC1Game.inventory.push({ id: 2575, name: "检查石", qty: 1 });
sotC1Game = await api("/api/game/dialog", { game: sotC1Game, npcId: sotC1Npc.id, message: "贝洛洛克" });
assertEqual(inventoryQty(sotC1Game, 2575), 0, "SOT C-1 keyword branch consumes starting check stone");
assertEqual(inventoryQty(sotC1Game, 2576), 1, "SOT C-1 keyword branch grants first checkpoint stone");
assert(sotC1Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /下一个检查点是柯奥村/.test(message.text || "")), "SOT C-1 keyword branch reports source pass text");
assert(sotC1Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-1 keyword MESSAGE branch is selected by VM");
assert(sotC1Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2575 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-1 keyword branch takes item 2575 through NPC VM");
assert(sotC1Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2576 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-1 keyword branch gives item 2576 through NPC VM");
assert(sotC1Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2576) && event.detail?.delItems?.some((item) => Number(item.id) === 2575)), "SOT C-1 keyword branch records source exchange metadata");
let sotC1PassedGame = await api("/api/game/new", { name: "samugiru-sot-c1-passed-runtime-test" });
sotC1PassedGame.location = { mapId: "1000", x: sotC1Npc.x + 1, y: sotC1Npc.y };
setTestEventFlag(sotC1PassedGame, 17, "end");
sotC1PassedGame.inventory.push({ id: 2576, name: "检查石", qty: 1 });
sotC1PassedGame = await api("/api/game/dialog", { game: sotC1PassedGame, npcId: sotC1Npc.id });
assertEqual(inventoryQty(sotC1PassedGame, 2576), 1, "SOT C-1 already-passed branch does not duplicate checkpoint stone");
assert(sotC1PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /柯奥村/.test(message.text || "")), "SOT C-1 already-passed branch uses source follow-up text");
assert(sotC1PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2576&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-1 already-passed MESSAGE branch is selected by VM");

const sotC2Npc = WORLD.maps["1100"]?.npcs.find((npc) => npc.id === "1100-98-76-7679");
if (!sotC2Npc) throw new Error("missing Ko village SOT C-2 checkpoint fixture");
assertEqual(sotC2Npc.name, "检查员(C-2)", "SOT C-2 keeps source NPC name");
assert(sotC2Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2576&ENDEV=17" && event.keyword === "喝酒" && event.delItems?.some((item) => Number(item.id) === 2576) && event.getItems?.some((item) => Number(item.id) === 2577)), "SOT C-2 parses source KeyWord checkpoint exchange");
assert(sotC2Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2577&ENDEV=17/.test(event.condition || "")), "SOT C-2 parses source already-passed MESSAGE branch");
assert(sotC2Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17"), "SOT C-2 parses source too-early MESSAGE branch");
let sotC2PromptGame = await api("/api/game/new", { name: "ko-village-sot-c2-prompt-runtime-test" });
sotC2PromptGame.location = { mapId: "1100", x: sotC2Npc.x + 1, y: sotC2Npc.y };
setTestEventFlag(sotC2PromptGame, 17, "end");
sotC2PromptGame.inventory.push({ id: 2576, name: "检查石", qty: 1 });
sotC2PromptGame = await api("/api/game/dialog", { game: sotC2PromptGame, npcId: sotC2Npc.id });
assertEqual(inventoryQty(sotC2PromptGame, 2576), 1, "SOT C-2 prompt branch does not consume first checkpoint stone without keyword");
assertEqual(inventoryQty(sotC2PromptGame, 2577), 0, "SOT C-2 prompt branch does not grant second checkpoint stone without keyword");
assert(sotC2PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-2 prompt branch asks for the source signboard answer");
assert(sotC2PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2576&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-2 prompt branch selects the non-keyword MESSAGE branch");
let sotC2Game = await api("/api/game/new", { name: "ko-village-sot-c2-keyword-runtime-test" });
sotC2Game.location = { mapId: "1100", x: sotC2Npc.x + 1, y: sotC2Npc.y };
setTestEventFlag(sotC2Game, 17, "end");
sotC2Game.inventory.push({ id: 2576, name: "检查石", qty: 1 });
sotC2Game = await api("/api/game/dialog", { game: sotC2Game, npcId: sotC2Npc.id, message: "喝酒" });
assertEqual(inventoryQty(sotC2Game, 2576), 0, "SOT C-2 keyword branch consumes first checkpoint stone");
assertEqual(inventoryQty(sotC2Game, 2577), 1, "SOT C-2 keyword branch grants second checkpoint stone");
assert(sotC2Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第2检查点/.test(message.text || "") && /柯奥山的小洞窟/.test(message.text || "")), "SOT C-2 keyword branch reports source pass text");
assert(sotC2Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2576&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-2 keyword MESSAGE branch is selected by VM");
assert(sotC2Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2576 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-2 keyword branch takes item 2576 through NPC VM");
assert(sotC2Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2577 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-2 keyword branch gives item 2577 through NPC VM");
assert(sotC2Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2577) && event.detail?.delItems?.some((item) => Number(item.id) === 2576)), "SOT C-2 keyword branch records source exchange metadata");
let sotC2PassedGame = await api("/api/game/new", { name: "ko-village-sot-c2-passed-runtime-test" });
sotC2PassedGame.location = { mapId: "1100", x: sotC2Npc.x + 1, y: sotC2Npc.y };
setTestEventFlag(sotC2PassedGame, 17, "end");
sotC2PassedGame.inventory.push({ id: 2577, name: "检查石", qty: 1 });
sotC2PassedGame = await api("/api/game/dialog", { game: sotC2PassedGame, npcId: sotC2Npc.id });
assertEqual(inventoryQty(sotC2PassedGame, 2577), 1, "SOT C-2 already-passed branch does not duplicate checkpoint stone");
assert(sotC2PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /柯奥山的小洞窟/.test(message.text || "")), "SOT C-2 already-passed branch uses source follow-up text");
assert(sotC2PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2577&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-2 already-passed MESSAGE branch is selected by VM");
let sotC2EarlyGame = await api("/api/game/new", { name: "ko-village-sot-c2-too-early-runtime-test" });
sotC2EarlyGame.location = { mapId: "1100", x: sotC2Npc.x + 1, y: sotC2Npc.y };
setTestEventFlag(sotC2EarlyGame, 17, "end");
sotC2EarlyGame.inventory.push({ id: 2575, name: "检查石", qty: 1 });
sotC2EarlyGame = await api("/api/game/dialog", { game: sotC2EarlyGame, npcId: sotC2Npc.id });
assertEqual(inventoryQty(sotC2EarlyGame, 2575), 1, "SOT C-2 too-early branch preserves starting check stone");
assertEqual(inventoryQty(sotC2EarlyGame, 2577), 0, "SOT C-2 too-early branch does not grant second checkpoint stone");
assert(sotC2EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-2 too-early branch uses source order text");
assert(sotC2EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17" && event.status === "ok"), "SOT C-2 too-early MESSAGE branch is selected by VM");

const sotC3Npc = WORLD.maps["11004"]?.npcs.find((npc) => npc.id === "11004-21-8-7680");
if (!sotC3Npc) throw new Error("missing Ko cave SOT C-3 checkpoint fixture");
assertEqual(sotC3Npc.name, "检查员(C-3)", "SOT C-3 keeps source NPC name");
assert(sotC3Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2577&ENDEV=17" && event.keyword === "42" && event.delItems?.some((item) => Number(item.id) === 2577) && event.getItems?.some((item) => Number(item.id) === 2578)), "SOT C-3 parses source KeyWord checkpoint exchange");
assert(sotC3Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2578&ENDEV=17/.test(event.condition || "")), "SOT C-3 parses source already-passed MESSAGE branch");
assert(sotC3Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17"), "SOT C-3 parses source too-early MESSAGE branch");
let sotC3PromptGame = await api("/api/game/new", { name: "ko-cave-sot-c3-prompt-runtime-test" });
sotC3PromptGame.location = { mapId: "11004", x: sotC3Npc.x + 1, y: sotC3Npc.y };
setTestEventFlag(sotC3PromptGame, 17, "end");
sotC3PromptGame.inventory.push({ id: 2577, name: "检查石", qty: 1 });
sotC3PromptGame = await api("/api/game/dialog", { game: sotC3PromptGame, npcId: sotC3Npc.id });
assertEqual(inventoryQty(sotC3PromptGame, 2577), 1, "SOT C-3 prompt branch does not consume second checkpoint stone without keyword");
assertEqual(inventoryQty(sotC3PromptGame, 2578), 0, "SOT C-3 prompt branch does not grant third checkpoint stone without keyword");
assert(sotC3PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-3 prompt branch asks for the source signboard answer");
assert(sotC3PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2577&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-3 prompt branch selects the non-keyword MESSAGE branch");
let sotC3Game = await api("/api/game/new", { name: "ko-cave-sot-c3-keyword-runtime-test" });
sotC3Game.location = { mapId: "11004", x: sotC3Npc.x + 1, y: sotC3Npc.y };
setTestEventFlag(sotC3Game, 17, "end");
sotC3Game.inventory.push({ id: 2577, name: "检查石", qty: 1 });
sotC3Game = await api("/api/game/dialog", { game: sotC3Game, npcId: sotC3Npc.id, message: "42" });
assertEqual(inventoryQty(sotC3Game, 2577), 0, "SOT C-3 keyword branch consumes second checkpoint stone");
assertEqual(inventoryQty(sotC3Game, 2578), 1, "SOT C-3 keyword branch grants third checkpoint stone");
assert(sotC3Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第3检查点/.test(message.text || "") && /玛丽娜丝村/.test(message.text || "")), "SOT C-3 keyword branch reports source pass text");
assert(sotC3Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2577&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-3 keyword MESSAGE branch is selected by VM");
assert(sotC3Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2577 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-3 keyword branch takes item 2577 through NPC VM");
assert(sotC3Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2578 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-3 keyword branch gives item 2578 through NPC VM");
assert(sotC3Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2578) && event.detail?.delItems?.some((item) => Number(item.id) === 2577)), "SOT C-3 keyword branch records source exchange metadata");
let sotC3PassedGame = await api("/api/game/new", { name: "ko-cave-sot-c3-passed-runtime-test" });
sotC3PassedGame.location = { mapId: "11004", x: sotC3Npc.x + 1, y: sotC3Npc.y };
setTestEventFlag(sotC3PassedGame, 17, "end");
sotC3PassedGame.inventory.push({ id: 2578, name: "检查石", qty: 1 });
sotC3PassedGame = await api("/api/game/dialog", { game: sotC3PassedGame, npcId: sotC3Npc.id });
assertEqual(inventoryQty(sotC3PassedGame, 2578), 1, "SOT C-3 already-passed branch does not duplicate checkpoint stone");
assert(sotC3PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /玛丽娜丝村/.test(message.text || "")), "SOT C-3 already-passed branch uses source follow-up text");
assert(sotC3PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2578&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-3 already-passed MESSAGE branch is selected by VM");
let sotC3EarlyGame = await api("/api/game/new", { name: "ko-cave-sot-c3-too-early-runtime-test" });
sotC3EarlyGame.location = { mapId: "11004", x: sotC3Npc.x + 1, y: sotC3Npc.y };
setTestEventFlag(sotC3EarlyGame, 17, "end");
sotC3EarlyGame.inventory.push({ id: 2576, name: "检查石", qty: 1 });
sotC3EarlyGame = await api("/api/game/dialog", { game: sotC3EarlyGame, npcId: sotC3Npc.id });
assertEqual(inventoryQty(sotC3EarlyGame, 2576), 1, "SOT C-3 too-early branch preserves first checkpoint stone");
assertEqual(inventoryQty(sotC3EarlyGame, 2578), 0, "SOT C-3 too-early branch does not grant third checkpoint stone");
assert(sotC3EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-3 too-early branch uses source order text");
assert(sotC3EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17" && event.status === "ok"), "SOT C-3 too-early MESSAGE branch is selected by VM");

const sotC4Npc = WORLD.maps["2000"]?.npcs.find((npc) => npc.id === "2000-80-115-7681");
if (!sotC4Npc) throw new Error("missing Marinas SOT C-4 checkpoint fixture");
assertEqual(sotC4Npc.name, "检查员(C-4)", "SOT C-4 keeps source NPC name");
assert(sotC4Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2578&ENDEV=17" && event.keyword === "特级柯尔克石" && event.delItems?.some((item) => Number(item.id) === 2578) && event.getItems?.some((item) => Number(item.id) === 2579)), "SOT C-4 parses source KeyWord checkpoint exchange");
assert(sotC4Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2579&ENDEV=17/.test(event.condition || "")), "SOT C-4 parses source already-passed MESSAGE branch");
assert(sotC4Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17"), "SOT C-4 parses source too-early MESSAGE branch");
let sotC4PromptGame = await api("/api/game/new", { name: "marinas-sot-c4-prompt-runtime-test" });
sotC4PromptGame.location = { mapId: "2000", x: sotC4Npc.x + 1, y: sotC4Npc.y };
setTestEventFlag(sotC4PromptGame, 17, "end");
sotC4PromptGame.inventory.push({ id: 2578, name: "检查石", qty: 1 });
sotC4PromptGame = await api("/api/game/dialog", { game: sotC4PromptGame, npcId: sotC4Npc.id });
assertEqual(inventoryQty(sotC4PromptGame, 2578), 1, "SOT C-4 prompt branch does not consume third checkpoint stone without keyword");
assertEqual(inventoryQty(sotC4PromptGame, 2579), 0, "SOT C-4 prompt branch does not grant fourth checkpoint stone without keyword");
assert(sotC4PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-4 prompt branch asks for the source signboard answer");
assert(sotC4PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2578&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-4 prompt branch selects the non-keyword MESSAGE branch");
let sotC4Game = await api("/api/game/new", { name: "marinas-sot-c4-keyword-runtime-test" });
sotC4Game.location = { mapId: "2000", x: sotC4Npc.x + 1, y: sotC4Npc.y };
setTestEventFlag(sotC4Game, 17, "end");
sotC4Game.inventory.push({ id: 2578, name: "检查石", qty: 1 });
sotC4Game = await api("/api/game/dialog", { game: sotC4Game, npcId: sotC4Npc.id, message: "特级柯尔克石" });
assertEqual(inventoryQty(sotC4Game, 2578), 0, "SOT C-4 keyword branch consumes third checkpoint stone");
assertEqual(inventoryQty(sotC4Game, 2579), 1, "SOT C-4 keyword branch grants fourth checkpoint stone");
assert(sotC4Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第4检查点/.test(message.text || "") && /盗贼的洞窟/.test(message.text || "")), "SOT C-4 keyword branch reports source pass text");
assert(sotC4Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2578&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-4 keyword MESSAGE branch is selected by VM");
assert(sotC4Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2578 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-4 keyword branch takes item 2578 through NPC VM");
assert(sotC4Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2579 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-4 keyword branch gives item 2579 through NPC VM");
assert(sotC4Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2579) && event.detail?.delItems?.some((item) => Number(item.id) === 2578)), "SOT C-4 keyword branch records source exchange metadata");
let sotC4PassedGame = await api("/api/game/new", { name: "marinas-sot-c4-passed-runtime-test" });
sotC4PassedGame.location = { mapId: "2000", x: sotC4Npc.x + 1, y: sotC4Npc.y };
setTestEventFlag(sotC4PassedGame, 17, "end");
sotC4PassedGame.inventory.push({ id: 2579, name: "检查石", qty: 1 });
sotC4PassedGame = await api("/api/game/dialog", { game: sotC4PassedGame, npcId: sotC4Npc.id });
assertEqual(inventoryQty(sotC4PassedGame, 2579), 1, "SOT C-4 already-passed branch does not duplicate checkpoint stone");
assert(sotC4PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /盗贼的洞窟/.test(message.text || "")), "SOT C-4 already-passed branch uses source follow-up text");
assert(sotC4PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2579&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-4 already-passed MESSAGE branch is selected by VM");
let sotC4EarlyGame = await api("/api/game/new", { name: "marinas-sot-c4-too-early-runtime-test" });
sotC4EarlyGame.location = { mapId: "2000", x: sotC4Npc.x + 1, y: sotC4Npc.y };
setTestEventFlag(sotC4EarlyGame, 17, "end");
sotC4EarlyGame.inventory.push({ id: 2577, name: "检查石", qty: 1 });
sotC4EarlyGame = await api("/api/game/dialog", { game: sotC4EarlyGame, npcId: sotC4Npc.id });
assertEqual(inventoryQty(sotC4EarlyGame, 2577), 1, "SOT C-4 too-early branch preserves second checkpoint stone");
assertEqual(inventoryQty(sotC4EarlyGame, 2579), 0, "SOT C-4 too-early branch does not grant fourth checkpoint stone");
assert(sotC4EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-4 too-early branch uses source order text");
assert(sotC4EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17" && event.status === "ok"), "SOT C-4 too-early MESSAGE branch is selected by VM");

const sotC5Npc = WORLD.maps["10703"]?.npcs.find((npc) => npc.id === "10703-41-45-7682");
if (!sotC5Npc) throw new Error("missing Thieves Cave SOT C-5 checkpoint fixture");
assertEqual(sotC5Npc.name, "检查员(C-5)", "SOT C-5 keeps source NPC name");
assert(sotC5Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2579&ENDEV=17" && event.keyword === "为了健康而推荐的温青菜" && event.delItems?.some((item) => Number(item.id) === 2579) && event.getItems?.some((item) => Number(item.id) === 2580)), "SOT C-5 parses source KeyWord checkpoint exchange");
assert(sotC5Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2580&ENDEV=17/.test(event.condition || "")), "SOT C-5 parses source already-passed MESSAGE branch");
assert(sotC5Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17"), "SOT C-5 parses source too-early MESSAGE branch");
let sotC5PromptGame = await api("/api/game/new", { name: "thieves-cave-sot-c5-prompt-runtime-test" });
sotC5PromptGame.location = { mapId: "10703", x: sotC5Npc.x + 1, y: sotC5Npc.y };
setTestEventFlag(sotC5PromptGame, 17, "end");
sotC5PromptGame.inventory.push({ id: 2579, name: "检查石", qty: 1 });
sotC5PromptGame = await api("/api/game/dialog", { game: sotC5PromptGame, npcId: sotC5Npc.id });
assertEqual(inventoryQty(sotC5PromptGame, 2579), 1, "SOT C-5 prompt branch does not consume fourth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC5PromptGame, 2580), 0, "SOT C-5 prompt branch does not grant fifth checkpoint stone without keyword");
assert(sotC5PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-5 prompt branch asks for the source signboard answer");
assert(sotC5PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2579&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-5 prompt branch selects the non-keyword MESSAGE branch");
let sotC5Game = await api("/api/game/new", { name: "thieves-cave-sot-c5-keyword-runtime-test" });
sotC5Game.location = { mapId: "10703", x: sotC5Npc.x + 1, y: sotC5Npc.y };
setTestEventFlag(sotC5Game, 17, "end");
sotC5Game.inventory.push({ id: 2579, name: "检查石", qty: 1 });
sotC5Game = await api("/api/game/dialog", { game: sotC5Game, npcId: sotC5Npc.id, message: "为了健康而推荐的温青菜" });
assertEqual(inventoryQty(sotC5Game, 2579), 0, "SOT C-5 keyword branch consumes fourth checkpoint stone");
assertEqual(inventoryQty(sotC5Game, 2580), 1, "SOT C-5 keyword branch grants fifth checkpoint stone");
assert(sotC5Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第5检查点/.test(message.text || "") && /阿布的洞窟/.test(message.text || "")), "SOT C-5 keyword branch reports source pass text");
assert(sotC5Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2579&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-5 keyword MESSAGE branch is selected by VM");
assert(sotC5Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2579 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-5 keyword branch takes item 2579 through NPC VM");
assert(sotC5Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2580 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-5 keyword branch gives item 2580 through NPC VM");
assert(sotC5Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2580) && event.detail?.delItems?.some((item) => Number(item.id) === 2579)), "SOT C-5 keyword branch records source exchange metadata");
let sotC5PassedGame = await api("/api/game/new", { name: "thieves-cave-sot-c5-passed-runtime-test" });
sotC5PassedGame.location = { mapId: "10703", x: sotC5Npc.x + 1, y: sotC5Npc.y };
setTestEventFlag(sotC5PassedGame, 17, "end");
sotC5PassedGame.inventory.push({ id: 2580, name: "检查石", qty: 1 });
sotC5PassedGame = await api("/api/game/dialog", { game: sotC5PassedGame, npcId: sotC5Npc.id });
assertEqual(inventoryQty(sotC5PassedGame, 2580), 1, "SOT C-5 already-passed branch does not duplicate checkpoint stone");
assert(sotC5PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /阿布的洞窟/.test(message.text || "")), "SOT C-5 already-passed branch uses source follow-up text");
assert(sotC5PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2580&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-5 already-passed MESSAGE branch is selected by VM");
let sotC5EarlyGame = await api("/api/game/new", { name: "thieves-cave-sot-c5-too-early-runtime-test" });
sotC5EarlyGame.location = { mapId: "10703", x: sotC5Npc.x + 1, y: sotC5Npc.y };
setTestEventFlag(sotC5EarlyGame, 17, "end");
sotC5EarlyGame.inventory.push({ id: 2578, name: "检查石", qty: 1 });
sotC5EarlyGame = await api("/api/game/dialog", { game: sotC5EarlyGame, npcId: sotC5Npc.id });
assertEqual(inventoryQty(sotC5EarlyGame, 2578), 1, "SOT C-5 too-early branch preserves third checkpoint stone");
assertEqual(inventoryQty(sotC5EarlyGame, 2580), 0, "SOT C-5 too-early branch does not grant fifth checkpoint stone");
assert(sotC5EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-5 too-early branch uses source order text");
assert(sotC5EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17" && event.status === "ok"), "SOT C-5 too-early MESSAGE branch is selected by VM");

const sotC6Npc = WORLD.maps["10007"]?.npcs.find((npc) => npc.id === "10007-23-9-7683");
if (!sotC6Npc) throw new Error("missing Abu Cave SOT C-6 checkpoint fixture");
assertEqual(sotC6Npc.name, "检查员(C-6)", "SOT C-6 keeps source NPC name");
assert(sotC6Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2580&ENDEV=17" && event.keyword === "半年前" && event.delItems?.some((item) => Number(item.id) === 2580) && event.getItems?.some((item) => Number(item.id) === 2581)), "SOT C-6 parses source KeyWord checkpoint exchange");
assert(sotC6Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2581&ENDEV=17/.test(event.condition || "")), "SOT C-6 parses source already-passed MESSAGE branch");
assert(sotC6Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17"), "SOT C-6 parses source too-early MESSAGE branch");
let sotC6PromptGame = await api("/api/game/new", { name: "abu-cave-sot-c6-prompt-runtime-test" });
sotC6PromptGame.location = { mapId: "10007", x: sotC6Npc.x + 1, y: sotC6Npc.y };
setTestEventFlag(sotC6PromptGame, 17, "end");
sotC6PromptGame.inventory.push({ id: 2580, name: "检查石", qty: 1 });
sotC6PromptGame = await api("/api/game/dialog", { game: sotC6PromptGame, npcId: sotC6Npc.id });
assertEqual(inventoryQty(sotC6PromptGame, 2580), 1, "SOT C-6 prompt branch does not consume fifth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC6PromptGame, 2581), 0, "SOT C-6 prompt branch does not grant sixth checkpoint stone without keyword");
assert(sotC6PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-6 prompt branch asks for the source signboard answer");
assert(sotC6PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2580&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-6 prompt branch selects the non-keyword MESSAGE branch");
let sotC6Game = await api("/api/game/new", { name: "abu-cave-sot-c6-keyword-runtime-test" });
sotC6Game.location = { mapId: "10007", x: sotC6Npc.x + 1, y: sotC6Npc.y };
setTestEventFlag(sotC6Game, 17, "end");
sotC6Game.inventory.push({ id: 2580, name: "检查石", qty: 1 });
sotC6Game = await api("/api/game/dialog", { game: sotC6Game, npcId: sotC6Npc.id, message: "半年前" });
assertEqual(inventoryQty(sotC6Game, 2580), 0, "SOT C-6 keyword branch consumes fifth checkpoint stone");
assertEqual(inventoryQty(sotC6Game, 2581), 1, "SOT C-6 keyword branch grants sixth checkpoint stone");
assert(sotC6Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第6检查点/.test(message.text || "") && /柯尔克的大坑道/.test(message.text || "")), "SOT C-6 keyword branch reports source pass text");
assert(sotC6Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2580&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-6 keyword MESSAGE branch is selected by VM");
assert(sotC6Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2580 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-6 keyword branch takes item 2580 through NPC VM");
assert(sotC6Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2581 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-6 keyword branch gives item 2581 through NPC VM");
assert(sotC6Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2581) && event.detail?.delItems?.some((item) => Number(item.id) === 2580)), "SOT C-6 keyword branch records source exchange metadata");
let sotC6PassedGame = await api("/api/game/new", { name: "abu-cave-sot-c6-passed-runtime-test" });
sotC6PassedGame.location = { mapId: "10007", x: sotC6Npc.x + 1, y: sotC6Npc.y };
setTestEventFlag(sotC6PassedGame, 17, "end");
sotC6PassedGame.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotC6PassedGame = await api("/api/game/dialog", { game: sotC6PassedGame, npcId: sotC6Npc.id });
assertEqual(inventoryQty(sotC6PassedGame, 2581), 1, "SOT C-6 already-passed branch does not duplicate checkpoint stone");
assert(sotC6PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /柯尔克的大坑道/.test(message.text || "")), "SOT C-6 already-passed branch uses source follow-up text");
assert(sotC6PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2581&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-6 already-passed MESSAGE branch is selected by VM");
let sotC6EarlyGame = await api("/api/game/new", { name: "abu-cave-sot-c6-too-early-runtime-test" });
sotC6EarlyGame.location = { mapId: "10007", x: sotC6Npc.x + 1, y: sotC6Npc.y };
setTestEventFlag(sotC6EarlyGame, 17, "end");
sotC6EarlyGame.inventory.push({ id: 2579, name: "检查石", qty: 1 });
sotC6EarlyGame = await api("/api/game/dialog", { game: sotC6EarlyGame, npcId: sotC6Npc.id });
assertEqual(inventoryQty(sotC6EarlyGame, 2579), 1, "SOT C-6 too-early branch preserves fourth checkpoint stone");
assertEqual(inventoryQty(sotC6EarlyGame, 2581), 0, "SOT C-6 too-early branch does not grant sixth checkpoint stone");
assert(sotC6EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-6 too-early branch uses source order text");
assert(sotC6EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17" && event.status === "ok"), "SOT C-6 too-early MESSAGE branch is selected by VM");

const sotC7Npc = WORLD.maps["10915"]?.npcs.find((npc) => npc.id === "10915-54-10-7684");
if (!sotC7Npc) throw new Error("missing Korku Mine SOT C-7 checkpoint fixture");
assertEqual(sotC7Npc.name, "检查员(C-7)", "SOT C-7 keeps source NPC name");
assert(sotC7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2581&ENDEV=17" && event.keyword === "ＢＡＲ Ｓｉｌｋｙ ＣＬＵＢ" && event.delItems?.some((item) => Number(item.id) === 2581) && event.getItems?.some((item) => Number(item.id) === 2582)), "SOT C-7 parses source KeyWord checkpoint exchange");
assert(sotC7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2582&ENDEV=17/.test(event.condition || "")), "SOT C-7 parses source already-passed MESSAGE branch");
assert(sotC7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17"), "SOT C-7 parses source too-early MESSAGE branch");
let sotC7PromptGame = await api("/api/game/new", { name: "korku-mine-sot-c7-prompt-runtime-test" });
sotC7PromptGame.location = { mapId: "10915", x: sotC7Npc.x + 1, y: sotC7Npc.y };
setTestEventFlag(sotC7PromptGame, 17, "end");
sotC7PromptGame.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotC7PromptGame = await api("/api/game/dialog", { game: sotC7PromptGame, npcId: sotC7Npc.id });
assertEqual(inventoryQty(sotC7PromptGame, 2581), 1, "SOT C-7 prompt branch does not consume sixth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC7PromptGame, 2582), 0, "SOT C-7 prompt branch does not grant seventh checkpoint stone without keyword");
assert(sotC7PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-7 prompt branch asks for the source signboard answer");
assert(sotC7PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2581&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-7 prompt branch selects the non-keyword MESSAGE branch");
let sotC7Game = await api("/api/game/new", { name: "korku-mine-sot-c7-keyword-runtime-test" });
sotC7Game.location = { mapId: "10915", x: sotC7Npc.x + 1, y: sotC7Npc.y };
setTestEventFlag(sotC7Game, 17, "end");
sotC7Game.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotC7Game = await api("/api/game/dialog", { game: sotC7Game, npcId: sotC7Npc.id, message: "ＢＡＲ Ｓｉｌｋｙ ＣＬＵＢ" });
assertEqual(inventoryQty(sotC7Game, 2581), 0, "SOT C-7 keyword branch consumes sixth checkpoint stone");
assertEqual(inventoryQty(sotC7Game, 2582), 1, "SOT C-7 keyword branch grants seventh checkpoint stone");
assert(sotC7Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第7检查点/.test(message.text || "") && /柯尔克村/.test(message.text || "")), "SOT C-7 keyword branch reports source pass text");
assert(sotC7Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2581&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-7 keyword MESSAGE branch is selected by VM");
assert(sotC7Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2581 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-7 keyword branch takes item 2581 through NPC VM");
assert(sotC7Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2582 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-7 keyword branch gives item 2582 through NPC VM");
assert(sotC7Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2582) && event.detail?.delItems?.some((item) => Number(item.id) === 2581)), "SOT C-7 keyword branch records source exchange metadata");
let sotC7PassedGame = await api("/api/game/new", { name: "korku-mine-sot-c7-passed-runtime-test" });
sotC7PassedGame.location = { mapId: "10915", x: sotC7Npc.x + 1, y: sotC7Npc.y };
setTestEventFlag(sotC7PassedGame, 17, "end");
sotC7PassedGame.inventory.push({ id: 2582, name: "检查石", qty: 1 });
sotC7PassedGame = await api("/api/game/dialog", { game: sotC7PassedGame, npcId: sotC7Npc.id });
assertEqual(inventoryQty(sotC7PassedGame, 2582), 1, "SOT C-7 already-passed branch does not duplicate checkpoint stone");
assert(sotC7PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /柯尔克村/.test(message.text || "")), "SOT C-7 already-passed branch uses source follow-up text");
assert(sotC7PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2582&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-7 already-passed MESSAGE branch is selected by VM");
let sotC7EarlyGame = await api("/api/game/new", { name: "korku-mine-sot-c7-too-early-runtime-test" });
sotC7EarlyGame.location = { mapId: "10915", x: sotC7Npc.x + 1, y: sotC7Npc.y };
setTestEventFlag(sotC7EarlyGame, 17, "end");
sotC7EarlyGame.inventory.push({ id: 2580, name: "检查石", qty: 1 });
sotC7EarlyGame = await api("/api/game/dialog", { game: sotC7EarlyGame, npcId: sotC7Npc.id });
assertEqual(inventoryQty(sotC7EarlyGame, 2580), 1, "SOT C-7 too-early branch preserves fifth checkpoint stone");
assertEqual(inventoryQty(sotC7EarlyGame, 2582), 0, "SOT C-7 too-early branch does not grant seventh checkpoint stone");
assert(sotC7EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-7 too-early branch uses source order text");
assert(sotC7EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17" && event.status === "ok"), "SOT C-7 too-early MESSAGE branch is selected by VM");

const sotC8Npc = WORLD.maps["1200"]?.npcs.find((npc) => npc.id === "1200-86-96-7685");
if (!sotC8Npc) throw new Error("missing Korku village SOT C-8 checkpoint fixture");
assertEqual(sotC8Npc.name, "检查员(C-8)", "SOT C-8 keeps source NPC name");
assert(sotC8Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2582&ENDEV=17" && event.keyword === "头盔" && event.delItems?.some((item) => Number(item.id) === 2582) && event.getItems?.some((item) => Number(item.id) === 2583)), "SOT C-8 parses source KeyWord checkpoint exchange");
assert(sotC8Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2583&ENDEV=17/.test(event.condition || "")), "SOT C-8 parses source already-passed MESSAGE branch");
assert(sotC8Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17"), "SOT C-8 parses source too-early MESSAGE branch");
let sotC8PromptGame = await api("/api/game/new", { name: "korku-village-sot-c8-prompt-runtime-test" });
sotC8PromptGame.location = { mapId: "1200", x: sotC8Npc.x + 1, y: sotC8Npc.y };
setTestEventFlag(sotC8PromptGame, 17, "end");
sotC8PromptGame.inventory.push({ id: 2582, name: "检查石", qty: 1 });
sotC8PromptGame = await api("/api/game/dialog", { game: sotC8PromptGame, npcId: sotC8Npc.id });
assertEqual(inventoryQty(sotC8PromptGame, 2582), 1, "SOT C-8 prompt branch does not consume seventh checkpoint stone without keyword");
assertEqual(inventoryQty(sotC8PromptGame, 2583), 0, "SOT C-8 prompt branch does not grant eighth checkpoint stone without keyword");
assert(sotC8PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-8 prompt branch asks for the source signboard answer");
assert(sotC8PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2582&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-8 prompt branch selects the non-keyword MESSAGE branch");
let sotC8Game = await api("/api/game/new", { name: "korku-village-sot-c8-keyword-runtime-test" });
sotC8Game.location = { mapId: "1200", x: sotC8Npc.x + 1, y: sotC8Npc.y };
setTestEventFlag(sotC8Game, 17, "end");
sotC8Game.inventory.push({ id: 2582, name: "检查石", qty: 1 });
sotC8Game = await api("/api/game/dialog", { game: sotC8Game, npcId: sotC8Npc.id, message: "头盔" });
assertEqual(inventoryQty(sotC8Game, 2582), 0, "SOT C-8 keyword branch consumes seventh checkpoint stone");
assertEqual(inventoryQty(sotC8Game, 2583), 1, "SOT C-8 keyword branch grants eighth checkpoint stone");
assert(sotC8Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第8检查点/.test(message.text || "") && /霍特尔村/.test(message.text || "")), "SOT C-8 keyword branch reports source pass text");
assert(sotC8Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2582&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-8 keyword MESSAGE branch is selected by VM");
assert(sotC8Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2582 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-8 keyword branch takes item 2582 through NPC VM");
assert(sotC8Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2583 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-8 keyword branch gives item 2583 through NPC VM");
assert(sotC8Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2583) && event.detail?.delItems?.some((item) => Number(item.id) === 2582)), "SOT C-8 keyword branch records source exchange metadata");
let sotC8PassedGame = await api("/api/game/new", { name: "korku-village-sot-c8-passed-runtime-test" });
sotC8PassedGame.location = { mapId: "1200", x: sotC8Npc.x + 1, y: sotC8Npc.y };
setTestEventFlag(sotC8PassedGame, 17, "end");
sotC8PassedGame.inventory.push({ id: 2583, name: "检查石", qty: 1 });
sotC8PassedGame = await api("/api/game/dialog", { game: sotC8PassedGame, npcId: sotC8Npc.id });
assertEqual(inventoryQty(sotC8PassedGame, 2583), 1, "SOT C-8 already-passed branch does not duplicate checkpoint stone");
assert(sotC8PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /霍特尔村/.test(message.text || "")), "SOT C-8 already-passed branch uses source follow-up text");
assert(sotC8PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2583&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-8 already-passed MESSAGE branch is selected by VM");
let sotC8EarlyGame = await api("/api/game/new", { name: "korku-village-sot-c8-too-early-runtime-test" });
sotC8EarlyGame.location = { mapId: "1200", x: sotC8Npc.x + 1, y: sotC8Npc.y };
setTestEventFlag(sotC8EarlyGame, 17, "end");
sotC8EarlyGame.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotC8EarlyGame = await api("/api/game/dialog", { game: sotC8EarlyGame, npcId: sotC8Npc.id });
assertEqual(inventoryQty(sotC8EarlyGame, 2581), 1, "SOT C-8 too-early branch preserves sixth checkpoint stone");
assertEqual(inventoryQty(sotC8EarlyGame, 2583), 0, "SOT C-8 too-early branch does not grant eighth checkpoint stone");
assert(sotC8EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-8 too-early branch uses source order text");
assert(sotC8EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17" && event.status === "ok"), "SOT C-8 too-early MESSAGE branch is selected by VM");

const sotC9Npc = WORLD.maps["1300"]?.npcs.find((npc) => npc.id === "1300-65-26-7686");
if (!sotC9Npc) throw new Error("missing Hotor village SOT C-9 checkpoint fixture");
assertEqual(sotC9Npc.name, "检查员(C-9)", "SOT C-9 keeps source NPC name");
assert(sotC9Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2583&ENDEV=17" && event.keyword === "携带方便的三明治" && event.delItems?.some((item) => Number(item.id) === 2583) && event.getItems?.some((item) => Number(item.id) === 2584)), "SOT C-9 parses source KeyWord checkpoint exchange");
assert(sotC9Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2584&ENDEV=17/.test(event.condition || "")), "SOT C-9 parses source already-passed MESSAGE branch");
assert(sotC9Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17"), "SOT C-9 parses source too-early MESSAGE branch");
let sotC9PromptGame = await api("/api/game/new", { name: "hotor-village-sot-c9-prompt-runtime-test" });
sotC9PromptGame.location = { mapId: "1300", x: sotC9Npc.x + 1, y: sotC9Npc.y };
setTestEventFlag(sotC9PromptGame, 17, "end");
sotC9PromptGame.inventory.push({ id: 2583, name: "检查石", qty: 1 });
sotC9PromptGame = await api("/api/game/dialog", { game: sotC9PromptGame, npcId: sotC9Npc.id });
assertEqual(inventoryQty(sotC9PromptGame, 2583), 1, "SOT C-9 prompt branch does not consume eighth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC9PromptGame, 2584), 0, "SOT C-9 prompt branch does not grant ninth checkpoint stone without keyword");
assert(sotC9PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-9 prompt branch asks for the source signboard answer");
assert(sotC9PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2583&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-9 prompt branch selects the non-keyword MESSAGE branch");
let sotC9Game = await api("/api/game/new", { name: "hotor-village-sot-c9-keyword-runtime-test" });
sotC9Game.location = { mapId: "1300", x: sotC9Npc.x + 1, y: sotC9Npc.y };
setTestEventFlag(sotC9Game, 17, "end");
sotC9Game.inventory.push({ id: 2583, name: "检查石", qty: 1 });
sotC9Game = await api("/api/game/dialog", { game: sotC9Game, npcId: sotC9Npc.id, message: "携带方便的三明治" });
assertEqual(inventoryQty(sotC9Game, 2583), 0, "SOT C-9 keyword branch consumes eighth checkpoint stone");
assertEqual(inventoryQty(sotC9Game, 2584), 1, "SOT C-9 keyword branch grants ninth checkpoint stone");
assert(sotC9Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第9检查点/.test(message.text || "") && /盗贼的大本营/.test(message.text || "")), "SOT C-9 keyword branch reports source pass text");
assert(sotC9Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2583&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-9 keyword MESSAGE branch is selected by VM");
assert(sotC9Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2583 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-9 keyword branch takes item 2583 through NPC VM");
assert(sotC9Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2584 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-9 keyword branch gives item 2584 through NPC VM");
assert(sotC9Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2584) && event.detail?.delItems?.some((item) => Number(item.id) === 2583)), "SOT C-9 keyword branch records source exchange metadata");
let sotC9PassedGame = await api("/api/game/new", { name: "hotor-village-sot-c9-passed-runtime-test" });
sotC9PassedGame.location = { mapId: "1300", x: sotC9Npc.x + 1, y: sotC9Npc.y };
setTestEventFlag(sotC9PassedGame, 17, "end");
sotC9PassedGame.inventory.push({ id: 2584, name: "检查石", qty: 1 });
sotC9PassedGame = await api("/api/game/dialog", { game: sotC9PassedGame, npcId: sotC9Npc.id });
assertEqual(inventoryQty(sotC9PassedGame, 2584), 1, "SOT C-9 already-passed branch does not duplicate checkpoint stone");
assert(sotC9PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /盗贼的大本营/.test(message.text || "")), "SOT C-9 already-passed branch uses source follow-up text");
assert(sotC9PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2584&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-9 already-passed MESSAGE branch is selected by VM");
let sotC9EarlyGame = await api("/api/game/new", { name: "hotor-village-sot-c9-too-early-runtime-test" });
sotC9EarlyGame.location = { mapId: "1300", x: sotC9Npc.x + 1, y: sotC9Npc.y };
setTestEventFlag(sotC9EarlyGame, 17, "end");
sotC9EarlyGame.inventory.push({ id: 2582, name: "检查石", qty: 1 });
sotC9EarlyGame = await api("/api/game/dialog", { game: sotC9EarlyGame, npcId: sotC9Npc.id });
assertEqual(inventoryQty(sotC9EarlyGame, 2582), 1, "SOT C-9 too-early branch preserves seventh checkpoint stone");
assertEqual(inventoryQty(sotC9EarlyGame, 2584), 0, "SOT C-9 too-early branch does not grant ninth checkpoint stone");
assert(sotC9EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-9 too-early branch uses source order text");
assert(sotC9EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17" && event.status === "ok"), "SOT C-9 too-early MESSAGE branch is selected by VM");

const sotC10Npc = WORLD.maps["11104"]?.npcs.find((npc) => npc.id === "11104-11-41-7687");
if (!sotC10Npc) throw new Error("missing thieves base SOT C-10 checkpoint fixture");
assertEqual(sotC10Npc.name, "检查员(C-10)", "SOT C-10 keeps source NPC name");
assert(sotC10Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2584&ENDEV=17" && event.keyword === "鲍尔" && event.delItems?.some((item) => Number(item.id) === 2584) && event.getItems?.some((item) => Number(item.id) === 2585)), "SOT C-10 parses source KeyWord checkpoint exchange");
assert(sotC10Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2585&ENDEV=17/.test(event.condition || "")), "SOT C-10 parses source already-passed MESSAGE branch");
assert(sotC10Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17,LV>0&ITEM=2583&ENDEV=17"), "SOT C-10 parses source too-early MESSAGE branch");
let sotC10PromptGame = await api("/api/game/new", { name: "thieves-base-sot-c10-prompt-runtime-test" });
sotC10PromptGame.location = { mapId: "11104", x: sotC10Npc.x + 1, y: sotC10Npc.y };
setTestEventFlag(sotC10PromptGame, 17, "end");
sotC10PromptGame.inventory.push({ id: 2584, name: "检查石", qty: 1 });
sotC10PromptGame = await api("/api/game/dialog", { game: sotC10PromptGame, npcId: sotC10Npc.id });
assertEqual(inventoryQty(sotC10PromptGame, 2584), 1, "SOT C-10 prompt branch does not consume ninth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC10PromptGame, 2585), 0, "SOT C-10 prompt branch does not grant tenth checkpoint stone without keyword");
assert(sotC10PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-10 prompt branch asks for the source signboard answer");
assert(sotC10PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2584&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-10 prompt branch selects the non-keyword MESSAGE branch");
let sotC10Game = await api("/api/game/new", { name: "thieves-base-sot-c10-keyword-runtime-test" });
sotC10Game.location = { mapId: "11104", x: sotC10Npc.x + 1, y: sotC10Npc.y };
setTestEventFlag(sotC10Game, 17, "end");
sotC10Game.inventory.push({ id: 2584, name: "检查石", qty: 1 });
sotC10Game = await api("/api/game/dialog", { game: sotC10Game, npcId: sotC10Npc.id, message: "鲍尔" });
assertEqual(inventoryQty(sotC10Game, 2584), 0, "SOT C-10 keyword branch consumes ninth checkpoint stone");
assertEqual(inventoryQty(sotC10Game, 2585), 1, "SOT C-10 keyword branch grants tenth checkpoint stone");
assert(sotC10Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第10检查点/.test(message.text || "") && /伪装的洞窟/.test(message.text || "")), "SOT C-10 keyword branch reports source pass text");
assert(sotC10Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2584&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-10 keyword MESSAGE branch is selected by VM");
assert(sotC10Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2584 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-10 keyword branch takes item 2584 through NPC VM");
assert(sotC10Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2585 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-10 keyword branch gives item 2585 through NPC VM");
assert(sotC10Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2585) && event.detail?.delItems?.some((item) => Number(item.id) === 2584)), "SOT C-10 keyword branch records source exchange metadata");
let sotC10PassedGame = await api("/api/game/new", { name: "thieves-base-sot-c10-passed-runtime-test" });
sotC10PassedGame.location = { mapId: "11104", x: sotC10Npc.x + 1, y: sotC10Npc.y };
setTestEventFlag(sotC10PassedGame, 17, "end");
sotC10PassedGame.inventory.push({ id: 2585, name: "检查石", qty: 1 });
sotC10PassedGame = await api("/api/game/dialog", { game: sotC10PassedGame, npcId: sotC10Npc.id });
assertEqual(inventoryQty(sotC10PassedGame, 2585), 1, "SOT C-10 already-passed branch does not duplicate checkpoint stone");
assert(sotC10PassedGame.dialog.messages.some((message) => /你好像已经来过/.test(message.text || "") && /虚伪的洞窟/.test(message.text || "")), "SOT C-10 already-passed branch uses source follow-up text");
assert(sotC10PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2585&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-10 already-passed MESSAGE branch is selected by VM");
let sotC10EarlyGame = await api("/api/game/new", { name: "thieves-base-sot-c10-too-early-runtime-test" });
sotC10EarlyGame.location = { mapId: "11104", x: sotC10Npc.x + 1, y: sotC10Npc.y };
setTestEventFlag(sotC10EarlyGame, 17, "end");
sotC10EarlyGame.inventory.push({ id: 2583, name: "检查石", qty: 1 });
sotC10EarlyGame = await api("/api/game/dialog", { game: sotC10EarlyGame, npcId: sotC10Npc.id });
assertEqual(inventoryQty(sotC10EarlyGame, 2583), 1, "SOT C-10 too-early branch preserves eighth checkpoint stone");
assertEqual(inventoryQty(sotC10EarlyGame, 2585), 0, "SOT C-10 too-early branch does not grant tenth checkpoint stone");
assert(sotC10EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-10 too-early branch uses source order text");
assert(sotC10EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17,LV>0&ITEM=2583&ENDEV=17" && event.status === "ok"), "SOT C-10 too-early MESSAGE branch is selected by VM");

const sotC11Npc = WORLD.maps["10402"]?.npcs.find((npc) => npc.id === "10402-37-6-7688");
if (!sotC11Npc) throw new Error("missing illusion cave SOT C-11 checkpoint fixture");
assertEqual(sotC11Npc.name, "检查员(C-11)", "SOT C-11 keeps source NPC name");
assert(sotC11Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2585&ENDEV=17" && event.keyword === "哥亚山" && event.delItems?.some((item) => Number(item.id) === 2585) && event.getItems?.some((item) => Number(item.id) === 2586)), "SOT C-11 parses source KeyWord checkpoint exchange");
assert(sotC11Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2586&ENDEV=17/.test(event.condition || "")), "SOT C-11 parses source already-passed MESSAGE branch");
assert(sotC11Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17,LV>0&ITEM=2583&ENDEV=17,LV>0&ITEM=2584&ENDEV=17"), "SOT C-11 parses source too-early MESSAGE branch");
let sotC11PromptGame = await api("/api/game/new", { name: "illusion-cave-sot-c11-prompt-runtime-test" });
sotC11PromptGame.location = { mapId: "10402", x: sotC11Npc.x + 1, y: sotC11Npc.y };
setTestEventFlag(sotC11PromptGame, 17, "end");
sotC11PromptGame.inventory.push({ id: 2585, name: "检查石", qty: 1 });
sotC11PromptGame = await api("/api/game/dialog", { game: sotC11PromptGame, npcId: sotC11Npc.id });
assertEqual(inventoryQty(sotC11PromptGame, 2585), 1, "SOT C-11 prompt branch does not consume tenth checkpoint stone without keyword");
assertEqual(inventoryQty(sotC11PromptGame, 2586), 0, "SOT C-11 prompt branch does not grant eleventh checkpoint stone without keyword");
assert(sotC11PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-11 prompt branch asks for the source signboard answer");
assert(sotC11PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2585&ENDEV=17" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT C-11 prompt branch selects the non-keyword MESSAGE branch");
let sotC11Game = await api("/api/game/new", { name: "illusion-cave-sot-c11-keyword-runtime-test" });
sotC11Game.location = { mapId: "10402", x: sotC11Npc.x + 1, y: sotC11Npc.y };
setTestEventFlag(sotC11Game, 17, "end");
sotC11Game.inventory.push({ id: 2585, name: "检查石", qty: 1 });
sotC11Game = await api("/api/game/dialog", { game: sotC11Game, npcId: sotC11Npc.id, message: "哥亚山" });
assertEqual(inventoryQty(sotC11Game, 2585), 0, "SOT C-11 keyword branch consumes tenth checkpoint stone");
assertEqual(inventoryQty(sotC11Game, 2586), 1, "SOT C-11 keyword branch grants eleventh checkpoint stone");
assert(sotC11Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第11检查点/.test(message.text || "") && /卡坦村/.test(message.text || "")), "SOT C-11 keyword branch reports source pass text");
assert(sotC11Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2585&ENDEV=17" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT C-11 keyword MESSAGE branch is selected by VM");
assert(sotC11Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2585 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-11 keyword branch takes item 2585 through NPC VM");
assert(sotC11Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2586 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-11 keyword branch gives item 2586 through NPC VM");
assert(sotC11Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2586) && event.detail?.delItems?.some((item) => Number(item.id) === 2585)), "SOT C-11 keyword branch records source exchange metadata");
let sotC11PassedGame = await api("/api/game/new", { name: "illusion-cave-sot-c11-passed-runtime-test" });
sotC11PassedGame.location = { mapId: "10402", x: sotC11Npc.x + 1, y: sotC11Npc.y };
setTestEventFlag(sotC11PassedGame, 17, "end");
sotC11PassedGame.inventory.push({ id: 2586, name: "检查石", qty: 1 });
sotC11PassedGame = await api("/api/game/dialog", { game: sotC11PassedGame, npcId: sotC11Npc.id });
assertEqual(inventoryQty(sotC11PassedGame, 2586), 1, "SOT C-11 already-passed branch does not duplicate checkpoint stone");
assert(sotC11PassedGame.dialog.messages.some((message) => /你好像已经来过/.test(message.text || "") && /卡坦村/.test(message.text || "")), "SOT C-11 already-passed branch uses source follow-up text");
assert(sotC11PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2586&ENDEV=17/.test(event.detail?.condition || "") && event.status === "ok"), "SOT C-11 already-passed MESSAGE branch is selected by VM");
let sotC11EarlyGame = await api("/api/game/new", { name: "illusion-cave-sot-c11-too-early-runtime-test" });
sotC11EarlyGame.location = { mapId: "10402", x: sotC11Npc.x + 1, y: sotC11Npc.y };
setTestEventFlag(sotC11EarlyGame, 17, "end");
sotC11EarlyGame.inventory.push({ id: 2584, name: "检查石", qty: 1 });
sotC11EarlyGame = await api("/api/game/dialog", { game: sotC11EarlyGame, npcId: sotC11Npc.id });
assertEqual(inventoryQty(sotC11EarlyGame, 2584), 1, "SOT C-11 too-early branch preserves ninth checkpoint stone");
assertEqual(inventoryQty(sotC11EarlyGame, 2586), 0, "SOT C-11 too-early branch does not grant eleventh checkpoint stone");
assert(sotC11EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-11 too-early branch uses source order text");
assert(sotC11EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17,LV>0&ITEM=2583&ENDEV=17,LV>0&ITEM=2584&ENDEV=17" && event.status === "ok"), "SOT C-11 too-early MESSAGE branch is selected by VM");

const sotC12Npc = WORLD.maps["1400"]?.npcs.find((npc) => npc.id === "1400-110-81-7689");
if (!sotC12Npc) throw new Error("missing Katan village SOT C-12 checkpoint fixture");
assertEqual(sotC12Npc.name, "检查员(C-12)", "SOT C-12 keeps source NPC name");
assert(sotC12Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2586&ENDEV=17" && event.keyword === "83岁" && event.delItems?.some((item) => Number(item.id) === 2586) && event.getItems?.some((item) => Number(item.id) === 2587)), "SOT C-12 parses source KeyWord checkpoint exchange");
assert(sotC12Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2587&ENDEV=17"), "SOT C-12 parses source all-checkpoints-passed MESSAGE branch");
assert(sotC12Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575&ENDEV=17,LV>0&ITEM=2576&ENDEV=17,LV>0&ITEM=2577&ENDEV=17,LV>0&ITEM=2578&ENDEV=17,LV>0&ITEM=2579&ENDEV=17,LV>0&ITEM=2580&ENDEV=17,LV>0&ITEM=2581&ENDEV=17,LV>0&ITEM=2582&ENDEV=17,LV>0&ITEM=2583&ENDEV=17,LV>0&ITEM=2584&ENDEV=17,LV>0&ITEM=2585&ENDEV=17"), "SOT C-12 parses source too-early MESSAGE branch");
let sotC12PromptGame = await api("/api/game/new", { name: "katan-village-sot-c12-prompt-runtime-test" });
sotC12PromptGame.location = { mapId: "1400", x: sotC12Npc.x + 1, y: sotC12Npc.y };
setTestEventFlag(sotC12PromptGame, 17, "end");
sotC12PromptGame.inventory.push({ id: 2586, name: "检查石", qty: 1 });
sotC12PromptGame = await api("/api/game/dialog", { game: sotC12PromptGame, npcId: sotC12Npc.id });
assertEqual(inventoryQty(sotC12PromptGame, 2586), 1, "SOT C-12 prompt branch does not consume eleventh checkpoint stone without keyword");
assertEqual(inventoryQty(sotC12PromptGame, 2587), 0, "SOT C-12 prompt branch does not grant final checkpoint stone without keyword");
assert(sotC12PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /C路线/.test(message.text || "")), "SOT C-12 prompt branch asks for the source signboard answer");
let sotC12Game = await api("/api/game/new", { name: "katan-village-sot-c12-keyword-runtime-test" });
sotC12Game.location = { mapId: "1400", x: sotC12Npc.x + 1, y: sotC12Npc.y };
setTestEventFlag(sotC12Game, 17, "end");
sotC12Game.inventory.push({ id: 2586, name: "检查石", qty: 1 });
sotC12Game = await api("/api/game/dialog", { game: sotC12Game, npcId: sotC12Npc.id, message: "83岁" });
assertEqual(inventoryQty(sotC12Game, 2586), 0, "SOT C-12 keyword branch consumes eleventh checkpoint stone");
assertEqual(inventoryQty(sotC12Game, 2587), 1, "SOT C-12 keyword branch grants final checkpoint stone");
assert(sotC12Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第12检查点/.test(message.text || "") && /萨姆吉尔/.test(message.text || "")), "SOT C-12 keyword branch reports source completion text");
assert(sotC12Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2586 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C-12 keyword branch takes item 2586 through NPC VM");
assert(sotC12Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2587 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C-12 keyword branch gives item 2587 through NPC VM");
let sotC12PassedGame = await api("/api/game/new", { name: "katan-village-sot-c12-passed-runtime-test" });
sotC12PassedGame.location = { mapId: "1400", x: sotC12Npc.x + 1, y: sotC12Npc.y };
setTestEventFlag(sotC12PassedGame, 17, "end");
sotC12PassedGame.inventory.push({ id: 2587, name: "检查石", qty: 1 });
sotC12PassedGame = await api("/api/game/dialog", { game: sotC12PassedGame, npcId: sotC12Npc.id });
assertEqual(inventoryQty(sotC12PassedGame, 2587), 1, "SOT C-12 already-passed branch does not duplicate final checkpoint stone");
assert(sotC12PassedGame.dialog.messages.some((message) => /所有的检查点/.test(message.text || "") && /萨姆吉尔/.test(message.text || "")), "SOT C-12 already-passed branch directs the player to source settlement");
let sotC12EarlyGame = await api("/api/game/new", { name: "katan-village-sot-c12-too-early-runtime-test" });
sotC12EarlyGame.location = { mapId: "1400", x: sotC12Npc.x + 1, y: sotC12Npc.y };
setTestEventFlag(sotC12EarlyGame, 17, "end");
sotC12EarlyGame.inventory.push({ id: 2585, name: "检查石", qty: 1 });
sotC12EarlyGame = await api("/api/game/dialog", { game: sotC12EarlyGame, npcId: sotC12Npc.id });
assertEqual(inventoryQty(sotC12EarlyGame, 2585), 1, "SOT C-12 too-early branch preserves tenth checkpoint stone");
assertEqual(inventoryQty(sotC12EarlyGame, 2587), 0, "SOT C-12 too-early branch does not grant final checkpoint stone");
assert(sotC12EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT C-12 too-early branch uses source order text");

const sotCSettlementNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-108-28-7702");
if (!sotCSettlementNpc) throw new Error("missing Samugiru SOT C-route settlement fixture");
assertEqual(sotCSettlementNpc.name, "检查员(C)", "SOT C-route settlement keeps source NPC name");
const sotCSettlementEvent = sotCSettlementNpc.scriptEvents?.find((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2587&ENDEV=17");
assert(sotCSettlementEvent?.delItems?.some((item) => Number(item.id) === 2587), "SOT C settlement parses final checkpoint stone consumption");
assert(sotCSettlementEvent?.getRandItems?.some((spec) => spec.ids?.includes(20210) && spec.ids?.includes(20889)), "SOT C settlement parses source random item reward pool");
assert(sotCSettlementEvent?.getPets?.some((spec) => spec.enemyIds?.includes(1592) && spec.enemyIds?.includes(1645)), "SOT C settlement parses source random pet reward pool");
let sotCWrongRouteGame = await api("/api/game/new", { name: "samugiru-sot-c-settlement-flag-gate-test" });
sotCWrongRouteGame.location = { mapId: "1000", x: sotCSettlementNpc.x + 1, y: sotCSettlementNpc.y };
sotCWrongRouteGame.inventory.push({ id: 2587, name: "检查石", qty: 1 });
sotCWrongRouteGame = await api("/api/game/dialog", { game: sotCWrongRouteGame, npcId: sotCSettlementNpc.id });
assertEqual(inventoryQty(sotCWrongRouteGame, 2587), 1, "SOT C settlement preserves final stone without source ENDEV 17");
assert(sotCWrongRouteGame.dialog.messages.some((message) => /C路线/.test(message.text || "") && /最后集合地点/.test(message.text || "")), "SOT C settlement uses source route-mismatch text without ENDEV 17");
let sotCPetFullGame = await api("/api/game/new", { name: "samugiru-sot-c-settlement-pet-full-test" });
sotCPetFullGame.location = { mapId: "1000", x: sotCSettlementNpc.x + 1, y: sotCSettlementNpc.y };
setTestEventFlag(sotCPetFullGame, 17, "end");
sotCPetFullGame.inventory.push({ id: 2587, name: "检查石", qty: 1 });
const sotCPetFullFixture = { ...sotCPetFullGame.pets[0] };
while (sotCPetFullGame.pets.length < 5) sotCPetFullGame.pets.push({ ...sotCPetFullFixture });
sotCPetFullGame = await api("/api/game/dialog", { game: sotCPetFullGame, npcId: sotCSettlementNpc.id });
assertEqual(inventoryQty(sotCPetFullGame, 2587), 1, "SOT C pet-full preflight preserves final checkpoint stone");
assertEqual(sotCPetFullGame.pets.length, 5, "SOT C pet-full preflight does not add a partial reward pet");
assert(sotCPetFullGame.dialog.messages.some((message) => /宠物数满了/.test(message.text || "") && /宠物弄少一点/.test(message.text || "")), "SOT C pet-full preflight returns source PetFullMsg");
assert(sotCPetFullGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.status === "blocked" && event.detail?.reason === "pet-full"), "SOT C pet-full preflight is recorded before settlement mutations");
let sotCSettlementGame = await api("/api/game/new", { name: "samugiru-sot-c-settlement-runtime-test" });
sotCSettlementGame.location = { mapId: "1000", x: sotCSettlementNpc.x + 1, y: sotCSettlementNpc.y };
setTestEventFlag(sotCSettlementGame, 17, "end");
sotCSettlementGame.inventory.push({ id: 2587, name: "检查石", qty: 1 });
const sotCSettlementPetCount = sotCSettlementGame.pets.length;
const originalRandomForSotCSettlement = Math.random;
try {
  Math.random = () => 0;
  sotCSettlementGame = await api("/api/game/dialog", { game: sotCSettlementGame, npcId: sotCSettlementNpc.id });
} finally {
  Math.random = originalRandomForSotCSettlement;
}
assertEqual(inventoryQty(sotCSettlementGame, 2587), 0, "SOT C settlement consumes final checkpoint stone");
assertEqual(inventoryQty(sotCSettlementGame, 20210), 1, "SOT C settlement grants one deterministic source random item fixture");
assertEqual(sotCSettlementGame.pets.length, sotCSettlementPetCount + 1, "SOT C settlement grants one source random pet");
assert(sotCSettlementGame.dialog.messages.some((message) => /辛苦你了/.test(message.text || "") && /所有的检查点/.test(message.text || "")), "SOT C settlement reports source completion message");
assert(sotCSettlementGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2587 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT C settlement consumes item 2587 through NPC VM");
assert(sotCSettlementGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 20210 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT C settlement grants random item through NPC VM");
assert(sotCSettlementGame.dialog.debug.vmTrace.some((event) => event.action === "givePet" && event.detail?.reason === "source-changeevent-getpet" && event.detail?.givenPets?.some((pet) => Number(pet.enemyId) === 1592)), "SOT C settlement grants random pet through NPC VM");

const sotD7Npc = WORLD.maps["100"]?.npcs.find((npc) => npc.id === "100-428-543-7696");
if (!sotD7Npc) throw new Error("missing Sainasu SOT D-7 checkpoint fixture");
assertEqual(sotD7Npc.name, "检查员(D-7)", "SOT D-7 keeps source NPC name");
assert(sotD7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2581" && event.keyword === "强恩一族" && event.delItems?.some((item) => Number(item.id) === 2581) && event.getItems?.some((item) => Number(item.id) === 2582)), "SOT D-7 parses source KeyWord checkpoint exchange");
assert(sotD7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && /^LV>0&ITEM=2582/.test(event.condition || "")), "SOT D-7 parses source already-passed MESSAGE branch");
assert(sotD7Npc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2575,LV>0&ITEM=2576,LV>0&ITEM=2577,LV>0&ITEM=2578,LV>0&ITEM=2579,LV>0&ITEM=2580"), "SOT D-7 parses source too-early MESSAGE branch");
let sotD7PromptGame = await api("/api/game/new", { name: "sainasu-sot-d7-prompt-runtime-test" });
sotD7PromptGame.location = { mapId: "100", x: sotD7Npc.x + 1, y: sotD7Npc.y };
sotD7PromptGame.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotD7PromptGame = await api("/api/game/dialog", { game: sotD7PromptGame, npcId: sotD7Npc.id });
assertEqual(inventoryQty(sotD7PromptGame, 2581), 1, "SOT D-7 prompt branch does not consume sixth checkpoint stone without keyword");
assertEqual(inventoryQty(sotD7PromptGame, 2582), 0, "SOT D-7 prompt branch does not grant seventh checkpoint stone without keyword");
assert(sotD7PromptGame.dialog.messages.some((message) => /请说出旁边看板/.test(message.text || "") && /D路线/.test(message.text || "")), "SOT D-7 prompt branch asks for the source signboard answer");
assert(sotD7PromptGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2581" && event.detail?.keywordRequired === false && event.status === "ok"), "SOT D-7 prompt branch selects the non-keyword MESSAGE branch");
let sotD7Game = await api("/api/game/new", { name: "sainasu-sot-d7-keyword-runtime-test" });
sotD7Game.location = { mapId: "100", x: sotD7Npc.x + 1, y: sotD7Npc.y };
sotD7Game.inventory.push({ id: 2581, name: "检查石", qty: 1 });
sotD7Game = await api("/api/game/dialog", { game: sotD7Game, npcId: sotD7Npc.id, message: "强恩一族" });
assertEqual(inventoryQty(sotD7Game, 2581), 0, "SOT D-7 keyword branch consumes sixth checkpoint stone");
assertEqual(inventoryQty(sotD7Game, 2582), 1, "SOT D-7 keyword branch grants seventh checkpoint stone");
assert(sotD7Game.dialog.messages.some((message) => /答对了/.test(message.text || "") && /第7检查点/.test(message.text || "") && /柯奥山的小洞窟/.test(message.text || "")), "SOT D-7 keyword branch reports source pass text");
assert(sotD7Game.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2581" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.status === "ok"), "SOT D-7 keyword MESSAGE branch is selected by VM");
assert(sotD7Game.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2581 && event.detail?.reason === "source-changeevent-message-delitem"), "SOT D-7 keyword branch takes item 2581 through NPC VM");
assert(sotD7Game.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2582 && event.detail?.reason === "source-changeevent-message-getitem"), "SOT D-7 keyword branch gives item 2582 through NPC VM");
assert(sotD7Game.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "MESSAGE" && event.detail?.keywordRequired === true && event.detail?.keywordOk === true && event.detail?.getItems?.some((item) => Number(item.id) === 2582) && event.detail?.delItems?.some((item) => Number(item.id) === 2581)), "SOT D-7 keyword branch records source exchange metadata");
let sotD7PassedGame = await api("/api/game/new", { name: "sainasu-sot-d7-passed-runtime-test" });
sotD7PassedGame.location = { mapId: "100", x: sotD7Npc.x + 1, y: sotD7Npc.y };
sotD7PassedGame.inventory.push({ id: 2582, name: "检查石", qty: 1 });
sotD7PassedGame = await api("/api/game/dialog", { game: sotD7PassedGame, npcId: sotD7Npc.id });
assertEqual(inventoryQty(sotD7PassedGame, 2582), 1, "SOT D-7 already-passed branch does not duplicate checkpoint stone");
assert(sotD7PassedGame.dialog.messages.some((message) => /你好像已经通过/.test(message.text || "") && /柯奥山的小洞窟/.test(message.text || "")), "SOT D-7 already-passed branch uses source follow-up text");
assert(sotD7PassedGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && /^LV>0&ITEM=2582/.test(event.detail?.condition || "") && event.status === "ok"), "SOT D-7 already-passed MESSAGE branch is selected by VM");
let sotD7EarlyGame = await api("/api/game/new", { name: "sainasu-sot-d7-too-early-runtime-test" });
sotD7EarlyGame.location = { mapId: "100", x: sotD7Npc.x + 1, y: sotD7Npc.y };
sotD7EarlyGame.inventory.push({ id: 2580, name: "检查石", qty: 1 });
sotD7EarlyGame = await api("/api/game/dialog", { game: sotD7EarlyGame, npcId: sotD7Npc.id });
assertEqual(inventoryQty(sotD7EarlyGame, 2580), 1, "SOT D-7 too-early branch preserves fifth checkpoint stone");
assertEqual(inventoryQty(sotD7EarlyGame, 2582), 0, "SOT D-7 too-early branch does not grant seventh checkpoint stone");
assert(sotD7EarlyGame.dialog.messages.some((message) => /还太早了一点/.test(message.text || "") && /按照顺序通过/.test(message.text || "")), "SOT D-7 too-early branch uses source order text");
assert(sotD7EarlyGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2575,LV>0&ITEM=2576,LV>0&ITEM=2577,LV>0&ITEM=2578,LV>0&ITEM=2579,LV>0&ITEM=2580" && event.status === "ok"), "SOT D-7 too-early MESSAGE branch is selected by VM");

const sotCounterNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-33-56-7677");
if (!sotCounterNpc) throw new Error("missing Samugiru SOT counter fixture");
assertEqual(sotCounterNpc.name, "ＳＯＴ柜台", "SOT counter keeps source NPC name");
assert(sotCounterNpc.scriptEvents?.some((event) => event.type === "REQUEST" && event.condition === "LV>0&ENDEV=17" && event.getItems?.some((item) => Number(item.id) === 2575)), "SOT counter parses source C-route registration handout");
assert(sotCounterNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ITEM=2575" && event.delItems?.some((item) => Number(item.id) === 2575)), "SOT counter parses source starting-stone withdrawal branch");
assert(sotCounterNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ITEM=2576,LV>0&ITEM=2577,LV>0&ITEM=2578,LV>0&ITEM=2579" && event.delItems?.length === 4), "SOT counter parses source partial-checkpoint withdrawal branch");
let sotCounterJoinGame = await api("/api/game/new", { name: "samugiru-sot-counter-join-runtime-test" });
sotCounterJoinGame.location = { mapId: "1000", x: sotCounterNpc.x + 1, y: sotCounterNpc.y };
setTestEventFlag(sotCounterJoinGame, 17, "end");
sotCounterJoinGame = await api("/api/game/dialog", { game: sotCounterJoinGame, npcId: sotCounterNpc.id });
assertEqual(inventoryQty(sotCounterJoinGame, 2575), 1, "SOT counter C-route registration gives starting check stone");
assert(sotCounterJoinGame.dialog.messages.some((message) => /SOT环岛活动 是走C路线/.test(message.text || "")), "SOT counter C-route registration uses source route text");
assert(sotCounterJoinGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "REQUEST" && event.detail?.condition === "LV>0&ENDEV=17" && event.status === "ok"), "SOT counter C-route REQUEST branch is selected by VM");
assert(sotCounterJoinGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2575 && event.detail?.reason === "source-changeevent-request-getitem"), "SOT counter registration gives item 2575 through NPC VM");
let sotCounterQuitStartGame = await api("/api/game/new", { name: "samugiru-sot-counter-quit-start-runtime-test" });
sotCounterQuitStartGame.location = { mapId: "1000", x: sotCounterNpc.x + 1, y: sotCounterNpc.y };
sotCounterQuitStartGame.inventory.push({ id: 2575, name: "检查石", qty: 1 });
sotCounterQuitStartGame = await api("/api/game/dialog", { game: sotCounterQuitStartGame, npcId: sotCounterNpc.id });
assertEqual(inventoryQty(sotCounterQuitStartGame, 2575), 0, "SOT counter starting-stone withdrawal consumes item 2575");
assert(sotCounterQuitStartGame.dialog.messages.some((message) => /一个都没收集到/.test(message.text || "") && /第一检查点/.test(message.text || "")), "SOT counter starting-stone withdrawal uses source no-checkpoint text");
assert(sotCounterQuitStartGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ITEM=2575" && event.status === "ok"), "SOT counter starting-stone ACCEPT branch is selected by VM");
assert(sotCounterQuitStartGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2575 && event.detail?.reason === "source-changeevent-delitem"), "SOT counter starting-stone withdrawal takes item 2575 through NPC VM");
let sotCounterQuitPartialGame = await api("/api/game/new", { name: "samugiru-sot-counter-quit-partial-runtime-test" });
sotCounterQuitPartialGame.location = { mapId: "1000", x: sotCounterNpc.x + 1, y: sotCounterNpc.y };
sotCounterQuitPartialGame.inventory.push(
  { id: 2576, name: "检查石", qty: 1 },
  { id: 2577, name: "检查石", qty: 1 },
  { id: 2578, name: "检查石", qty: 1 },
  { id: 2579, name: "检查石", qty: 1 }
);
sotCounterQuitPartialGame = await api("/api/game/dialog", { game: sotCounterQuitPartialGame, npcId: sotCounterNpc.id });
for (const itemId of [2576, 2577, 2578, 2579]) {
  assertEqual(inventoryQty(sotCounterQuitPartialGame, itemId), 0, `SOT counter partial withdrawal consumes item ${itemId}`);
  assert(sotCounterQuitPartialGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === itemId && event.detail?.reason === "source-changeevent-delitem"), `SOT counter partial withdrawal takes item ${itemId} through NPC VM`);
}
assert(sotCounterQuitPartialGame.dialog.messages.some((message) => /看你的检查项目 你好像还没完成/.test(message.text || "")), "SOT counter partial withdrawal uses source unfinished text");
assert(sotCounterQuitPartialGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ITEM=2576,LV>0&ITEM=2577,LV>0&ITEM=2578,LV>0&ITEM=2579" && event.status === "ok"), "SOT counter partial-checkpoint ACCEPT branch is selected by VM");

const alagiNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-117-101-7495");
if (!alagiNpc) throw new Error("missing Samugiru Alagi fruit-wine fixture");
assertEqual(alagiNpc.name, "阿喇吉", "Alagi keeps source NPC name");
assert(alagiNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0" && event.getItems?.some((item) => Number(item.id) === 2020)), "Alagi parses source starter spoiled-wine handout");
assert(alagiNpc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2020"), "Alagi parses source carry-spoiled-wine reminder");
assert(alagiNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ITEM=2021" && event.getItems?.some((item) => Number(item.id) === 1602) && event.delItems?.some((item) => Number(item.id) === 2021)), "Alagi parses fermented-fruit reward exchange");
assert(alagiNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ITEM=2023" && event.getItems?.some((item) => Number(item.id) === 11968) && event.delItems?.some((item) => Number(item.id) === 2023)), "Alagi parses distilled-liquor reward exchange");
let alagiStarterGame = await api("/api/game/new", { name: "samugiru-alagi-starter-runtime-test" });
alagiStarterGame.location = { mapId: "1000", x: alagiNpc.x + 1, y: alagiNpc.y };
alagiStarterGame = await api("/api/game/dialog", { game: alagiStarterGame, npcId: alagiNpc.id });
assertEqual(inventoryQty(alagiStarterGame, 2020), 1, "Alagi source starter branch gives spoiled fruit wine");
assert(alagiStarterGame.dialog.messages.some((message) => /酸坏的水果酒 x1/.test(message.text || "")), "Alagi starter dialog reports spoiled fruit wine reward");
assert(alagiStarterGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0" && event.status === "ok"), "Alagi starter ACCEPT branch is selected by VM");
assert(alagiStarterGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2020 && event.detail?.reason === "source-changeevent-getitem"), "Alagi starter item 2020 grant runs through NPC VM");
alagiStarterGame = await api("/api/game/dialog", { game: alagiStarterGame, npcId: alagiNpc.id });
assertEqual(inventoryQty(alagiStarterGame, 2020), 1, "Alagi carry-spoiled-wine MESSAGE branch does not duplicate item 2020");
assert(alagiStarterGame.dialog.messages.some((message) => /求求你快点出发吧/.test(message.text || "")), "Alagi carry-spoiled-wine branch uses source reminder text");
assert(alagiStarterGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2020" && event.status === "ok"), "Alagi carry-spoiled-wine MESSAGE branch is selected by VM");
let alagiFruitGame = await api("/api/game/new", { name: "samugiru-alagi-fermented-fruit-runtime-test" });
alagiFruitGame.location = { mapId: "1000", x: alagiNpc.x + 1, y: alagiNpc.y };
alagiFruitGame.inventory.push({ id: 2021, name: "发酵完成的水果", qty: 1 });
alagiFruitGame = await api("/api/game/dialog", { game: alagiFruitGame, npcId: alagiNpc.id });
assertEqual(inventoryQty(alagiFruitGame, 2021), 0, "Alagi fermented-fruit branch consumes item 2021");
assertEqual(inventoryQty(alagiFruitGame, 1602), 1, "Alagi fermented-fruit branch gives charm orange");
assert(alagiFruitGame.dialog.messages.some((message) => /获得：魅力橘子 x1/.test(message.text || "")), "Alagi fermented-fruit branch reports charm orange reward");
assert(alagiFruitGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ITEM=2021" && event.status === "ok"), "Alagi fermented-fruit ACCEPT branch is selected by VM");
assert(alagiFruitGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2021 && event.detail?.reason === "source-changeevent-delitem"), "Alagi fermented-fruit branch takes item 2021 through NPC VM");
assert(alagiFruitGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 1602 && event.detail?.reason === "source-changeevent-getitem"), "Alagi fermented-fruit branch gives item 1602 through NPC VM");
let alagiLiquorGame = await api("/api/game/new", { name: "samugiru-alagi-liquor-runtime-test" });
alagiLiquorGame.location = { mapId: "1000", x: alagiNpc.x + 1, y: alagiNpc.y };
alagiLiquorGame.inventory.push({ id: 2023, name: "高级烧酒", qty: 1 });
alagiLiquorGame = await api("/api/game/dialog", { game: alagiLiquorGame, npcId: alagiNpc.id });
assertEqual(inventoryQty(alagiLiquorGame, 2023), 0, "Alagi liquor branch consumes item 2023");
assertEqual(inventoryQty(alagiLiquorGame, 11968), 1, "Alagi liquor branch gives source hangover herb");
assert(alagiLiquorGame.dialog.messages.some((message) => /获得：酩酊草 x1/.test(message.text || "")), "Alagi liquor branch reports hangover herb reward");
assert(alagiLiquorGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ITEM=2023" && event.status === "ok"), "Alagi liquor ACCEPT branch is selected by VM");
assert(alagiLiquorGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === 2023 && event.detail?.reason === "source-changeevent-delitem"), "Alagi liquor branch takes item 2023 through NPC VM");
assert(alagiLiquorGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 11968 && event.detail?.reason === "source-changeevent-getitem"), "Alagi liquor branch gives item 11968 through NPC VM");
alagiLiquorGame = await api("/api/game/dialog", { game: alagiLiquorGame, npcId: alagiNpc.id });
assertEqual(inventoryQty(alagiLiquorGame, 11968), 1, "Alagi post-herb MESSAGE branch does not duplicate item 11968");
assert(alagiLiquorGame.dialog.messages.some((message) => /村长一定会很高兴/.test(message.text || "")), "Alagi post-herb branch uses source completion text");
assert(alagiLiquorGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=11968" && event.status === "ok"), "Alagi post-herb MESSAGE branch is selected by VM");

const kairasNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-31-69-7581");
if (!kairasNpc) throw new Error("missing Samugiru Kairas treasure fixture");
assertEqual(kairasNpc.name, "凯拉斯", "Kairas keeps source NPC name");
assert(kairasNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ENDEV=4&ITEM=1853&ITEM=1854&ITEM=1855&ITEM=1856&ITEM=1857" && event.delItems?.length === 5 && event.getRandItems?.some((rand) => rand.ids?.some((id) => [1858, 1859, 1860].includes(Number(id))))), "Kairas parses source five-treasure random reward exchange");
for (const itemId of [1858, 1859, 1860]) {
  assert(kairasNpc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === `LV>0&ITEM=${itemId}`), `Kairas parses post-reward MESSAGE for item ${itemId}`);
}
let kairasMissingGame = await api("/api/game/new", { name: "samugiru-kairas-missing-treasure-runtime-test" });
kairasMissingGame.location = { mapId: "1000", x: kairasNpc.x + 1, y: kairasNpc.y };
setTestEventFlag(kairasMissingGame, 4, "end");
kairasMissingGame.inventory.push({ id: 1854, name: "古老的勾玉", qty: 1 });
kairasMissingGame = await api("/api/game/dialog", { game: kairasMissingGame, npcId: kairasNpc.id });
assertEqual(inventoryQty(kairasMissingGame, 1854), 1, "Kairas missing-treasure branch does not consume partial source treasure");
assert(kairasMissingGame.dialog.messages.some((message) => /没有黄金图腾像/.test(message.text || "")), "Kairas missing-treasure branch names the first missing source treasure");
assert(kairasMissingGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM!=1853" && event.status === "ok"), "Kairas missing-treasure MESSAGE branch is selected by VM");
let kairasGame = await api("/api/game/new", { name: "samugiru-kairas-treasure-runtime-test" });
kairasGame.location = { mapId: "1000", x: kairasNpc.x + 1, y: kairasNpc.y };
setTestEventFlag(kairasGame, 4, "end");
kairasGame.inventory.push(
  { id: 1853, name: "黄金图腾像", qty: 1 },
  { id: 1854, name: "古老的勾玉", qty: 1 },
  { id: 1855, name: "传说的竖琴", qty: 1 },
  { id: 1856, name: "金砂", qty: 1 },
  { id: 1857, name: "透明的水晶", qty: 1 }
);
kairasGame = await api("/api/game/dialog", { game: kairasGame, npcId: kairasNpc.id });
for (const itemId of [1853, 1854, 1855, 1856, 1857]) {
  assertEqual(inventoryQty(kairasGame, itemId), 0, `Kairas source ACCEPT consumes treasure ${itemId}`);
  assert(kairasGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === itemId && event.detail?.reason === "source-changeevent-delitem"), `Kairas source ACCEPT takes item ${itemId} through NPC VM`);
}
const kairasRewardIds = [1858, 1859, 1860];
const kairasRewardId = kairasRewardIds.find((itemId) => inventoryQty(kairasGame, itemId) === 1);
assert(kairasRewardId, "Kairas source ACCEPT gives one source random treasure reward");
assert(kairasRewardIds.filter((itemId) => inventoryQty(kairasGame, itemId) > 0).length === 1, "Kairas source ACCEPT gives exactly one random reward item");
assert(kairasGame.dialog.messages.some((message) => /获得：/.test(message.text || "") && kairasRewardIds.some((itemId) => inventoryQty(kairasGame, itemId) > 0)), "Kairas source ACCEPT reports a reward item");
assert(kairasGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ENDEV=4&ITEM=1853&ITEM=1854&ITEM=1855&ITEM=1856&ITEM=1857" && event.status === "ok"), "Kairas source ACCEPT branch is selected by VM");
assert(kairasGame.dialog.debug.vmTrace.some((event) => event.action === "give" && kairasRewardIds.includes(Number(event.detail?.itemId)) && event.detail?.reason === "source-changeevent-getitem"), "Kairas random reward runs through NPC VM");
assert(
  kairasGame.dialog.debug.vmTrace.some((event) =>
    event.action === "quest" &&
    Array.isArray(event.detail?.getRandItems) &&
    event.detail.getRandItems.some((group) =>
      Array.isArray(group.ids) && group.ids.some((itemId) => kairasRewardIds.includes(Number(itemId)))
    )
  ),
  "Kairas source ACCEPT records GetRandItem reward metadata"
);
kairasGame = await api("/api/game/dialog", { game: kairasGame, npcId: kairasNpc.id });
assertEqual(inventoryQty(kairasGame, kairasRewardId), 1, "Kairas post-reward MESSAGE branch does not duplicate the random reward");
assert(kairasGame.dialog.messages.some((message) => /我们不是已经交换宝物了吗/.test(message.text || "")), "Kairas post-reward branch uses source completion text");
assert(kairasGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === `LV>0&ITEM=${kairasRewardId}` && event.status === "ok"), "Kairas post-reward MESSAGE branch is selected by VM");

const meatNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-77-118-7537");
if (!meatNpc) throw new Error("missing Samugiru Betsiana meat-contract fixture");
assertEqual(meatNpc.name, "贝丝安娜", "Betsiana keeps source NPC name");
assert(meatNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ENDEV=4" && event.getItems?.some((item) => Number(item.id) === 1820)), "Betsiana parses source meat contract handout");
assert(meatNpc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ENDEV=4&ITEM=1820"), "Betsiana parses source contract reminder MESSAGE");
assert(meatNpc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ENDEV=4&ITEM!=12893&ITEM=1820"), "Betsiana parses source missing-meat MESSAGE branch");
assert(meatNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ENDEV=4&ITEM=1820&ITEM=12889&ITEM=12890&ITEM=12891&ITEM=12892&ITEM=12893" && event.delItems?.length === 6 && event.getItems?.some((item) => Number(item.id) === 1816)), "Betsiana parses source five-meat reward exchange");
let meatContractGame = await api("/api/game/new", { name: "samugiru-betsiana-contract-runtime-test" });
meatContractGame.location = { mapId: "1000", x: meatNpc.x + 1, y: meatNpc.y };
setTestEventFlag(meatContractGame, 4, "end");
meatContractGame = await api("/api/game/dialog", { game: meatContractGame, npcId: meatNpc.id });
assertEqual(inventoryQty(meatContractGame, 1820), 1, "Betsiana source starter branch gives meat contract");
assert(meatContractGame.dialog.messages.some((message) => /合约书/.test(message.text || "")), "Betsiana starter dialog mentions source contract");
assert(meatContractGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ENDEV=4" && event.status === "ok"), "Betsiana starter ACCEPT branch is selected by VM");
assert(meatContractGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 1820 && event.detail?.reason === "source-changeevent-getitem"), "Betsiana contract grant runs through NPC VM");
meatContractGame = await api("/api/game/dialog", { game: meatContractGame, npcId: meatNpc.id });
assertEqual(inventoryQty(meatContractGame, 1820), 1, "Betsiana contract reminder does not duplicate the contract");
assert(meatContractGame.dialog.messages.some((message) => /根本没有收集完成/.test(message.text || "")), "Betsiana contract-only repeat uses source missing-meat priority text");
assert(meatContractGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ENDEV=4&ITEM!=12893&ITEM=1820" && event.status === "ok"), "Betsiana contract-only repeat selects the first source missing-meat MESSAGE branch");
let meatMissingGame = await api("/api/game/new", { name: "samugiru-betsiana-missing-meat-runtime-test" });
meatMissingGame.location = { mapId: "1000", x: meatNpc.x + 1, y: meatNpc.y };
setTestEventFlag(meatMissingGame, 4, "end");
meatMissingGame.inventory.push(
  { id: 1820, name: "合约书", qty: 1 },
  { id: 12889, name: "一口肉", qty: 1 },
  { id: 12890, name: "小的肉", qty: 1 },
  { id: 12891, name: "丸丸肉", qty: 1 },
  { id: 12892, name: "大块的肉", qty: 1 }
);
meatMissingGame = await api("/api/game/dialog", { game: meatMissingGame, npcId: meatNpc.id });
for (const itemId of [1820, 12889, 12890, 12891, 12892]) {
  assertEqual(inventoryQty(meatMissingGame, itemId), 1, `Betsiana missing-meat branch does not consume partial item ${itemId}`);
}
assert(meatMissingGame.dialog.messages.some((message) => /根本没有收集完成/.test(message.text || "")), "Betsiana missing-meat branch uses source incomplete text");
assert(meatMissingGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ENDEV=4&ITEM!=12893&ITEM=1820" && event.status === "ok"), "Betsiana missing-meat MESSAGE branch is selected by VM");
let meatRewardGame = await api("/api/game/new", { name: "samugiru-betsiana-five-meat-runtime-test" });
meatRewardGame.location = { mapId: "1000", x: meatNpc.x + 1, y: meatNpc.y };
setTestEventFlag(meatRewardGame, 4, "end");
meatRewardGame.inventory.push(
  { id: 1820, name: "合约书", qty: 1 },
  { id: 12889, name: "一口肉", qty: 1 },
  { id: 12890, name: "小的肉", qty: 1 },
  { id: 12891, name: "丸丸肉", qty: 1 },
  { id: 12892, name: "大块的肉", qty: 1 },
  { id: 12893, name: "满腹肉", qty: 1 }
);
meatRewardGame = await api("/api/game/dialog", { game: meatRewardGame, npcId: meatNpc.id });
for (const itemId of [1820, 12889, 12890, 12891, 12892, 12893]) {
  assertEqual(inventoryQty(meatRewardGame, itemId), 0, `Betsiana source ACCEPT consumes item ${itemId}`);
  assert(meatRewardGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === itemId && event.detail?.reason === "source-changeevent-delitem"), `Betsiana source ACCEPT takes item ${itemId} through NPC VM`);
}
assertEqual(inventoryQty(meatRewardGame, 1816), 1, "Betsiana source ACCEPT gives super nourishing meat");
assert(meatRewardGame.dialog.messages.some((message) => /获得：超级补的肉 x1/.test(message.text || "")), "Betsiana source ACCEPT reports super nourishing meat reward");
assert(meatRewardGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ENDEV=4&ITEM=1820&ITEM=12889&ITEM=12890&ITEM=12891&ITEM=12892&ITEM=12893" && event.status === "ok"), "Betsiana five-meat ACCEPT branch is selected by VM");
assert(meatRewardGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 1816 && event.detail?.reason === "source-changeevent-getitem"), "Betsiana reward item 1816 runs through NPC VM");

const lierNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.id === "1000-63-43-7530");
if (!lierNpc) throw new Error("missing Samugiru Lier dance-task fixture");
assertEqual(lierNpc.name, "莉儿", "Lier keeps source NPC name");
assert(lierNpc.scriptEvents?.some((event) => event.type === "ACCEPT" && event.condition === "LV>0&ITEM=2010&ITEM=2011&ITEM=2012" && event.getItems?.some((item) => Number(item.id) === 2013)), "Lier parses source fur turn-in reward");
assert(lierNpc.scriptEvents?.some((event) => event.type === "MESSAGE" && event.condition === "LV>0&ITEM=2013"), "Lier parses source post-reward MESSAGE branch");
let lierGame = await api("/api/game/new", { name: "samugiru-lier-dance-runtime-test" });
lierGame.location = { mapId: "1000", x: lierNpc.x + 1, y: lierNpc.y };
lierGame.inventory.push(
  { id: 2010, name: "贝鲁卡的皮毛", qty: 1 },
  { id: 2011, name: "贝鲁伊卡的皮毛", qty: 1 },
  { id: 2012, name: "格鲁西斯的皮毛", qty: 1 }
);
lierGame = await api("/api/game/dialog", { game: lierGame, npcId: lierNpc.id });
assertEqual(inventoryQty(lierGame, 2010), 0, "Lier source ACCEPT consumes Beluka fur");
assertEqual(inventoryQty(lierGame, 2011), 0, "Lier source ACCEPT consumes Beluika fur");
assertEqual(inventoryQty(lierGame, 2012), 0, "Lier source ACCEPT consumes Gelusis fur");
assertEqual(inventoryQty(lierGame, 2013), 1, "Lier source ACCEPT gives source love candy");
assert(lierGame.dialog.messages.some((message) => /获得：莉儿的爱心糖果 x1/.test(message.text || "")), "Lier dialog reports source candy reward");
assert(lierGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV>0&ITEM=2010&ITEM=2011&ITEM=2012" && event.status === "ok"), "Lier source ACCEPT branch is selected by VM");
for (const itemId of [2010, 2011, 2012]) {
  assert(lierGame.dialog.debug.vmTrace.some((event) => event.action === "take" && Number(event.detail?.itemId) === itemId && event.detail?.reason === "source-changeevent-delitem"), `Lier source ACCEPT takes item ${itemId} through NPC VM`);
}
assert(lierGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2013 && event.detail?.reason === "source-changeevent-getitem"), "Lier source ACCEPT gives item 2013 through NPC VM");
lierGame = await api("/api/game/dialog", { game: lierGame, npcId: lierNpc.id });
assertEqual(inventoryQty(lierGame, 2013), 1, "Lier source MESSAGE branch does not duplicate the candy");
assert(lierGame.dialog.messages.some((message) => /谢谢你了！我有漂漂亮亮的舞衣可以穿了/.test(message.text || "")), "Lier source MESSAGE branch uses post-reward thanks text");
assert(lierGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "LV>0&ITEM=2013" && event.status === "ok"), "Lier source post-reward MESSAGE branch is selected by VM");

const ticketNpc = WORLD.maps["1000"]?.npcs.find((npc) => npc.name === "门票贩卖员" && npc.scriptEvents?.some((event) => event.delStones?.some((stone) => stone.expr === "LV*3")));
if (!ticketNpc) throw new Error("missing source DelStone ticket fixture");
assert(ticketNpc.scriptEvents?.some((event) => event.delStones?.some((stone) => stone.expr === "LV*3")), "ticket seller parses source DelStone LV* multiplier");
const ticketOldTicketIds = [2521, 2522, 2523, 2524, 2598, 2599, 2600, 2601, 2602];
let freeTicketGame = await api("/api/game/new", { name: "source-script-free-ticket-test" });
freeTicketGame.location = { mapId: "1000", x: ticketNpc.x + 1, y: ticketNpc.y };
freeTicketGame.player.level = 5;
freeTicketGame.player.stone = 100;
freeTicketGame.inventory = [
  { id: "stone", name: "石币", qty: 100 },
  ...ticketOldTicketIds.map((id) => ({ id, name: `旧票${id}`, qty: 1 }))
];
freeTicketGame = await api("/api/game/dialog", { game: freeTicketGame, npcId: ticketNpc.id });
assertEqual(freeTicketGame.player.stone, 100, "ticket seller low-level branch does not charge stone");
assertEqual(inventoryQty(freeTicketGame, 2597), 1, "ticket seller low-level branch gives source arena ticket");
for (const id of ticketOldTicketIds) {
  assertEqual(inventoryQty(freeTicketGame, id), 0, `ticket seller low-level branch collects old ticket ${id}`);
}
assert(freeTicketGame.dialog.debug.vmTrace.some((event) => event.action === "quest" && event.detail?.eventType === "ACCEPT" && event.detail?.condition === "LV<11,DR<11,DR=77,DR=777" && event.status === "ok"), "ticket seller low-level source ACCEPT branch is selected by VM");
assert(freeTicketGame.dialog.debug.vmTrace.some((event) => event.action === "give" && Number(event.detail?.itemId) === 2597 && event.detail?.reason === "source-changeevent-getitem"), "ticket seller low-level ticket grant runs through NPC VM");
assert(!freeTicketGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-delstone"), "ticket seller low-level branch avoids source DelStone charge");
let ticketGame = await api("/api/game/new", { name: "source-script-stone-cost-test" });
ticketGame.location = { mapId: "1000", x: ticketNpc.x + 1, y: ticketNpc.y };
ticketGame.player.level = 12;
ticketGame.player.stone = 100;
ticketGame.inventory = [
  { id: "stone", name: "石币", qty: 100 },
  ...ticketOldTicketIds.map((id) => ({ id, name: `旧票${id}`, qty: 1 }))
];
ticketGame = await api("/api/game/dialog", { game: ticketGame, npcId: ticketNpc.id });
assertEqual(ticketGame.player.stone, 64, "source DelStone LV*3 charges player level times multiplier");
assertEqual(inventoryQty(ticketGame, 2597), 1, "ticket seller gives source arena ticket after DelStone payment");
for (const id of ticketOldTicketIds) {
  assertEqual(inventoryQty(ticketGame, id), 0, `ticket seller paid branch collects old ticket ${id}`);
}
assert(ticketGame.dialog.debug.vmTrace.some((event) => event.action === "take" && event.detail?.reason === "source-changeevent-delstone" && event.detail?.qty === 36), "source DelStone records NPC VM stone take");
ticketGame = await api("/api/game/dialog", { game: ticketGame, npcId: ticketNpc.id });
assertEqual(ticketGame.player.stone, 64, "ticket seller repeat ITEM=2597 branch does not charge again");
assertEqual(inventoryQty(ticketGame, 2597), 1, "ticket seller repeat ITEM=2597 branch does not duplicate the arena ticket");
assert(ticketGame.dialog.messages.some((message) => message.speaker === "npc" && /已经有票了喔/.test(message.text || "")), "ticket seller repeat ITEM=2597 branch uses source already-have-ticket text");
assert(ticketGame.dialog.debug.vmTrace.some((event) => event.action === "window" && event.detail?.eventType === "MESSAGE" && event.detail?.condition === "ITEM=2597" && event.status === "ok"), "ticket seller repeat source MESSAGE branch is selected by VM");

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

let mixedRangeLowLevelGame = await api("/api/game/new", { name: "mixed-range-low-level-encounter-test" });
mixedRangeLowLevelGame.location = { mapId: "100", x: 440, y: 120, dir: 2 };
mixedRangeLowLevelGame.player.level = 1;
mixedRangeLowLevelGame.pets[0].Lv = 1;

let mixedRangeHighLevelGame = await api("/api/game/new", { name: "mixed-range-high-level-encounter-test" });
mixedRangeHighLevelGame.location = { mapId: "100", x: 440, y: 120, dir: 2 };
mixedRangeHighLevelGame.player.level = 20;
mixedRangeHighLevelGame.pets[0].Lv = 20;
const originalRandomForEncounterGroupLevelParity = Math.random;
try {
  Math.random = () => 0;
  mixedRangeLowLevelGame = await api("/api/game/encounter", { game: mixedRangeLowLevelGame });
  Math.random = () => 0;
  mixedRangeHighLevelGame = await api("/api/game/encounter", { game: mixedRangeHighLevelGame });
} finally {
  Math.random = originalRandomForEncounterGroupLevelParity;
}
const lowLevelGroupId = Number((mixedRangeLowLevelGame.battle?.source || "").match(/group\s+(\d+)/)?.[1] || 0);
const highLevelGroupId = Number((mixedRangeHighLevelGame.battle?.source || "").match(/group\s+(\d+)/)?.[1] || 0);
assert(lowLevelGroupId > 0 && highLevelGroupId > 0, "mixed source area encounters expose selected source group ids");
assertEqual(
  lowLevelGroupId,
  highLevelGroupId,
  "source encounter group selection remains level-independent under identical rolls"
);
assertEqual(
  Number(mixedRangeLowLevelGame.encounter?.EnemyId || 0),
  Number(mixedRangeHighLevelGame.encounter?.EnemyId || 0),
  "source encounter enemy selection remains level-independent under identical rolls"
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
  WorkQuick: 0,
  WorkFixDex: 0,
  EarthAT: 0,
  WaterAT: 0,
  FireAT: 0,
  WindAT: 0
});
Object.assign(sourceRandDamageGame.pets[0], {
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 0,
  WorkFixDex: 0,
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

let sourceCriticalChanceGame = await api("/api/game/new", { name: "source-critical-chance-battle-test" });
sourceCriticalChanceGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceCriticalChanceGame = await api("/api/game/encounter", { game: sourceCriticalChanceGame });
Object.assign(sourceCriticalChanceGame.pets[0], {
  WorkFixDex: 20,
  WorkQuick: 20,
  Hp: 999,
  WorkMaxHp: 999
});
Object.assign(sourceCriticalChanceGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 120,
  WorkFixStr: 120,
  WorkDefencePower: 10,
  WorkFixTough: 10,
  WorkFixDex: 25,
  WorkQuick: 25,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceCriticalChanceGame.battle.enemyParty = [sourceCriticalChanceGame.encounter];
sourceCriticalChanceGame.battle.activeEnemyIndex = 0;
const originalRandomForCriticalChance = Math.random;
let sourceCriticalChanceRandomCalls = 0;
try {
  Math.random = () => {
    sourceCriticalChanceRandomCalls += 1;
    if (sourceCriticalChanceRandomCalls === 1) return 0.4;
    return 0.0151;
  };
  sourceCriticalChanceGame = await api("/api/game/battle", { game: sourceCriticalChanceGame, action: "防御" });
} finally {
  Math.random = originalRandomForCriticalChance;
}
assertEqual(sourceCriticalChanceGame.battleOutcome.result, "turn", "source critical chance test keeps battle active");
assert(
  !sourceCriticalChanceGame.battleOutcome.log.some((line) => line.includes("会心")),
  "enemy low critical chance no longer applies a forced 2% critical floor"
);

let sourceEnemyTemplateCriticalGame = await api("/api/game/new", { name: "source-enemy-template-critical-battle-test" });
sourceEnemyTemplateCriticalGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceEnemyTemplateCriticalGame = await api("/api/game/encounter", { game: sourceEnemyTemplateCriticalGame });
sourceEnemyTemplateCriticalGame.petFormation = { activeIndex: -1 };
Object.assign(sourceEnemyTemplateCriticalGame.player, {
  WorkFixDex: 10,
  WorkQuick: 10,
  WorkFixLuck: 0,
  Luck: 0,
  Hp: 5000,
  WorkMaxHp: 5000
});
Object.assign(sourceEnemyTemplateCriticalGame.encounter, {
  Hp: 600,
  WorkMaxHp: 600,
  WorkAttackPower: 40,
  WorkFixStr: 40,
  WorkDefencePower: 30,
  WorkFixTough: 30,
  WorkFixDex: 100,
  WorkQuick: 100,
  Critical: 100,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceEnemyTemplateCriticalGame.battle.enemyParty = [sourceEnemyTemplateCriticalGame.encounter];
sourceEnemyTemplateCriticalGame.battle.activeEnemyIndex = 0;
const originalRandomForEnemyTemplateCritical = Math.random;
try {
  Math.random = () => 0.5;
  sourceEnemyTemplateCriticalGame = await api("/api/game/battle", { game: sourceEnemyTemplateCriticalGame, action: "防御" });
} finally {
  Math.random = originalRandomForEnemyTemplateCritical;
}
assertEqual(sourceEnemyTemplateCriticalGame.battleOutcome.result, "turn", "enemy template critical test keeps battle active");
assert(
  !sourceEnemyTemplateCriticalGame.battleOutcome.log.some((line) => line.includes("会心")),
  "enemy template Critical field does not directly inflate source critical checks"
);

let sourceCriticalRatioGame = await api("/api/game/new", { name: "source-critical-ratio-battle-test" });
sourceCriticalRatioGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceCriticalRatioGame = await api("/api/game/encounter", { game: sourceCriticalRatioGame });
sourceCriticalRatioGame.petFormation = { activeIndex: -1 };
Object.assign(sourceCriticalRatioGame.player, {
  WorkFixDex: 10,
  WorkQuick: 100,
  WorkFixLuck: 0,
  Luck: 0,
  Critical: 20,
  WorkAttackPower: 180,
  WorkFixStr: 180
});
Object.assign(sourceCriticalRatioGame.encounter, {
  Hp: 600,
  WorkMaxHp: 600,
  WorkFixDex: 100,
  WorkQuick: 1,
  WorkDefencePower: 120,
  WorkFixTough: 120,
  Abio: 1,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceCriticalRatioGame.battle.enemyParty = [sourceCriticalRatioGame.encounter];
sourceCriticalRatioGame.battle.activeEnemyIndex = 0;
const originalRandomForCriticalRatio = Math.random;
let sourceCriticalRatioRandomCalls = 0;
try {
  Math.random = () => {
    sourceCriticalRatioRandomCalls += 1;
    if (sourceCriticalRatioRandomCalls === 1) return 0.2;
    if (sourceCriticalRatioRandomCalls === 2) return 0.0099;
    return 0.9;
  };
  sourceCriticalRatioGame = await api("/api/game/battle", { game: sourceCriticalRatioGame, action: "攻击" });
} finally {
  Math.random = originalRandomForCriticalRatio;
}
assert(
  sourceCriticalRatioGame.battleOutcome.log.some((line) => line.includes("会心")),
  "source critical ratio branch keeps sub-dex attacker critical chance when source roll is in-range"
);

let sourceCriticalParaGame = await api("/api/game/new", { name: "source-critical-para-battle-test" });
sourceCriticalParaGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceCriticalParaGame = await api("/api/game/encounter", { game: sourceCriticalParaGame });
sourceCriticalParaGame.petFormation = { activeIndex: -1 };
Object.assign(sourceCriticalParaGame.player, {
  WorkFixDex: 10,
  WorkQuick: 100,
  WorkFixLuck: 0,
  Luck: 0,
  Critical: 20,
  WorkAttackPower: 180,
  WorkFixStr: 180
});
Object.assign(sourceCriticalParaGame.encounter, {
  Hp: 600,
  WorkMaxHp: 600,
  WorkFixDex: 100,
  WorkQuick: 1,
  WorkDefencePower: 120,
  WorkFixTough: 120,
  Abio: 1,
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceCriticalParaGame.battle.enemyParty = [sourceCriticalParaGame.encounter];
sourceCriticalParaGame.battle.activeEnemyIndex = 0;
const originalRandomForCriticalPara = Math.random;
let sourceCriticalParaRandomCalls = 0;
try {
  Math.random = () => {
    sourceCriticalParaRandomCalls += 1;
    if (sourceCriticalParaRandomCalls === 1) return 0.2;
    if (sourceCriticalParaRandomCalls === 2) return 0.0399;
    return 0.9;
  };
  sourceCriticalParaGame = await api("/api/game/battle", { game: sourceCriticalParaGame, action: "攻击" });
} finally {
  Math.random = originalRandomForCriticalPara;
}
assert(
  sourceCriticalParaGame.battleOutcome.log.some((line) => line.includes("会心")),
  "source critical para keeps 0.09 branch so mid-roll player crit is preserved"
);

let sourceDuckBlockedStatusGame = await api("/api/game/new", { name: "source-duck-blocked-status-battle-test" });
sourceDuckBlockedStatusGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceDuckBlockedStatusGame = await api("/api/game/encounter", { game: sourceDuckBlockedStatusGame });
Object.assign(sourceDuckBlockedStatusGame.player, {
  WorkFixDex: 1,
  WorkQuick: 900
});
Object.assign(sourceDuckBlockedStatusGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkFixDex: 999,
  WorkQuick: 1,
  BattleStatuses: {
    stone: { key: "stone", label: "石化", turns: 2 }
  },
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceDuckBlockedStatusGame.battle.enemyParty = [sourceDuckBlockedStatusGame.encounter];
sourceDuckBlockedStatusGame.battle.activeEnemyIndex = 0;
const originalRandomForDuckBlockedStatus = Math.random;
try {
  Math.random = () => 0;
  sourceDuckBlockedStatusGame = await api("/api/game/battle", { game: sourceDuckBlockedStatusGame, action: "攻击" });
} finally {
  Math.random = originalRandomForDuckBlockedStatus;
}
assert(
  !sourceDuckBlockedStatusGame.battleOutcome.log.some((line) => line.includes("闪开了")),
  "source duck check disables dodge when defender is under turn-blocking status"
);

let sourceDuckProfessionStatusGame = await api("/api/game/new", { name: "source-duck-profession-status-battle-test" });
sourceDuckProfessionStatusGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceDuckProfessionStatusGame = await api("/api/game/encounter", { game: sourceDuckProfessionStatusGame });
Object.assign(sourceDuckProfessionStatusGame.player, {
  WorkFixDex: 1,
  WorkQuick: 900
});
Object.assign(sourceDuckProfessionStatusGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkFixDex: 999,
  WorkQuick: 1,
  BattleStatuses: {
    dragnet: { key: "dragnet", label: "捕网", turns: 2 }
  },
  WorkTacticsOption: "at:0;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceDuckProfessionStatusGame.battle.enemyParty = [sourceDuckProfessionStatusGame.encounter];
sourceDuckProfessionStatusGame.battle.activeEnemyIndex = 0;
const originalRandomForDuckProfessionStatus = Math.random;
try {
  Math.random = () => 0;
  sourceDuckProfessionStatusGame = await api("/api/game/battle", { game: sourceDuckProfessionStatusGame, action: "攻击" });
} finally {
  Math.random = originalRandomForDuckProfessionStatus;
}
assert(
  !sourceDuckProfessionStatusGame.battleOutcome.log.some((line) => line.includes("闪开了")),
  "source duck check disables dodge when defender is under dragnet status"
);

let sourceAllyBlockedStatusGame = await api("/api/game/new", { name: "source-ally-blocked-status-battle-test" });
sourceAllyBlockedStatusGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
sourceAllyBlockedStatusGame = await api("/api/game/encounter", { game: sourceAllyBlockedStatusGame });
sourceAllyBlockedStatusGame.petFormation = { activeIndex: -1 };
Object.assign(sourceAllyBlockedStatusGame.player, {
  Hp: 999,
  WorkMaxHp: 999,
  WorkAttackPower: 999,
  WorkFixStr: 999,
  WorkQuick: 900,
  WorkFixDex: 900,
  BattleStatuses: {
    sleep: { key: "sleep", label: "睡眠", turns: 2 }
  }
});
Object.assign(sourceAllyBlockedStatusGame.encounter, {
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
  SourceExp: 1,
  Exp: 1
});
sourceAllyBlockedStatusGame.battle.enemyParty = [sourceAllyBlockedStatusGame.encounter];
sourceAllyBlockedStatusGame.battle.activeEnemyIndex = 0;
const allyBlockedEnemyHpBefore = Number(sourceAllyBlockedStatusGame.encounter.Hp || 0);
sourceAllyBlockedStatusGame = await api("/api/game/battle", { game: sourceAllyBlockedStatusGame, action: "攻击" });
assertEqual(Number(sourceAllyBlockedStatusGame.encounter.Hp || 0), allyBlockedEnemyHpBefore, "source turn-block status prevents player-side attack before damage");
assert(sourceAllyBlockedStatusGame.battleOutcome.log.some((line) => line.includes("无法行动")), "source turn-block status logs blocked player-side action");
assertEqual(sourceAllyBlockedStatusGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ATTACK", "blocked player-side attack keeps source attack command telemetry");

for (const status of [
  { key: "dizzy", label: "晕眩" },
  { key: "dragnet", label: "捕网" }
]) {
  let sourceProfessionBlockedStatusGame = await api("/api/game/new", { name: `source-profession-${status.key}-blocked-status-battle-test` });
  sourceProfessionBlockedStatusGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
  sourceProfessionBlockedStatusGame = await api("/api/game/encounter", { game: sourceProfessionBlockedStatusGame });
  sourceProfessionBlockedStatusGame.petFormation = { activeIndex: -1 };
  Object.assign(sourceProfessionBlockedStatusGame.player, {
    Hp: 999,
    WorkMaxHp: 999,
    WorkAttackPower: 999,
    WorkFixStr: 999,
    WorkQuick: 900,
    WorkFixDex: 900,
    BattleStatuses: {
      [status.key]: { key: status.key, label: status.label, turns: 2 }
    }
  });
  Object.assign(sourceProfessionBlockedStatusGame.encounter, {
    Hp: 500,
    WorkMaxHp: 500,
    WorkAttackPower: 1,
    WorkFixStr: 1,
    WorkQuick: 1,
    WorkFixDex: 1,
    WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0",
    SourceExp: 1,
    Exp: 1
  });
  sourceProfessionBlockedStatusGame.battle.enemyParty = [sourceProfessionBlockedStatusGame.encounter];
  sourceProfessionBlockedStatusGame.battle.activeEnemyIndex = 0;
  const professionBlockedEnemyHpBefore = Number(sourceProfessionBlockedStatusGame.encounter.Hp || 0);
  sourceProfessionBlockedStatusGame = await api("/api/game/battle", { game: sourceProfessionBlockedStatusGame, action: "攻击" });
  assertEqual(Number(sourceProfessionBlockedStatusGame.encounter.Hp || 0), professionBlockedEnemyHpBefore, `${status.label} prevents player-side attack before damage`);
  assert(sourceProfessionBlockedStatusGame.battleOutcome.log.some((line) => line.includes(status.label) && line.includes("无法行动")), `${status.label} logs blocked player-side action`);
  assertEqual(sourceProfessionBlockedStatusGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ATTACK", `${status.label} blocked attack keeps source attack command telemetry`);
}

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

let playerEscapeFailTargetGame = await api("/api/game/new", { name: "player-escape-fail-target-player-test" });
playerEscapeFailTargetGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerEscapeFailTargetGame = await api("/api/game/encounter", { game: playerEscapeFailTargetGame });
Object.assign(playerEscapeFailTargetGame.player, {
  level: 1,
  Luck: 1,
  WorkFixLuck: 1,
  Hp: 99999,
  hp: 99999,
  maxHp: 99999,
  Vital: 2000000,
  WorkFixVital: 20000,
  WorkMaxHp: 99999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(playerEscapeFailTargetGame.pets[0], {
  Lv: 1,
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(playerEscapeFailTargetGame.encounter, {
  Lv: 140,
  Hp: 500,
  WorkMaxHp: 500,
  Str: 1,
  Attack: 1,
  Critical: 0,
  WorkAttackPower: 10,
  WorkFixStr: 10,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
playerEscapeFailTargetGame.battle.enemyParty = [playerEscapeFailTargetGame.encounter];
const originalRandomForEscapeFailTarget = Math.random;
let escapeFailTargetRandomCalls = 0;
try {
  Math.random = () => {
    escapeFailTargetRandomCalls += 1;
    if (escapeFailTargetRandomCalls === 1) return 0.5;
    if (escapeFailTargetRandomCalls === 2) return 0.99;
    return 0.5;
  };
  playerEscapeFailTargetGame = await api("/api/game/battle", { game: playerEscapeFailTargetGame, action: "逃跑" });
} finally {
  Math.random = originalRandomForEscapeFailTarget;
}
assertEqual(playerEscapeFailTargetGame.battleOutcome.result, "defeat", "failed escape can resolve defeat when source enemy turn targets the player");
assertEqual(playerEscapeFailTargetGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_ESCAPE", "failed escape records source escape command telemetry");
assertEqual(playerEscapeFailTargetGame.battleOutcome.enemyAi?.targetKind, "player", "failed escape enemy turn honors source target player rule");
assert(playerEscapeFailTargetGame.battleOutcome.log.some((line) => line.includes(playerEscapeFailTargetGame.player.name) && line.includes("被击倒")), "failed escape source enemy turn defeats the selected player target");
assertEqual(Number(playerEscapeFailTargetGame.pets[0].Hp || 0), 999, "failed escape enemy turn does not force damage onto the active pet");

let playerCaptureMissTargetGame = await api("/api/game/new", { name: "player-capture-miss-target-player-test" });
playerCaptureMissTargetGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerCaptureMissTargetGame = await api("/api/game/encounter", { game: playerCaptureMissTargetGame });
Object.assign(playerCaptureMissTargetGame.player, {
  Hp: 99999,
  hp: 99999,
  maxHp: 99999,
  WorkMaxHp: 99999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(playerCaptureMissTargetGame.pets[0], {
  Lv: 1,
  Hp: 999,
  WorkMaxHp: 999,
  WorkDefencePower: 0,
  WorkFixTough: 0,
  WorkQuick: 1,
  WorkFixDex: 1
});
Object.assign(playerCaptureMissTargetGame.encounter, {
  Lv: 1,
  Hp: 500,
  WorkMaxHp: 500,
  CaptureRate: 0,
  Str: 1,
  Attack: 1,
  Critical: 0,
  WorkAttackPower: 1,
  WorkFixStr: 1,
  WorkQuick: 999,
  WorkFixDex: 999,
  WorkTacticsOption: "at:1;2;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
playerCaptureMissTargetGame.battle.enemyParty = [playerCaptureMissTargetGame.encounter];
const originalRandomForFailedCaptureEnemyTurn = Math.random;
try {
  Math.random = () => 0.99;
  playerCaptureMissTargetGame = await api("/api/game/battle", { game: playerCaptureMissTargetGame, action: "捕获" });
} finally {
  Math.random = originalRandomForFailedCaptureEnemyTurn;
}
assertEqual(playerCaptureMissTargetGame.battleOutcome.result, "capture-missed", "failed capture keeps battle active after source enemy turn");
assertEqual(playerCaptureMissTargetGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_CAPTURE", "failed capture records source capture command telemetry");
assertEqual(playerCaptureMissTargetGame.battleOutcome.enemyAi?.targetKind, "player", "failed capture enemy turn honors source target player rule");
assert(playerCaptureMissTargetGame.battleOutcome.log.some((line) => line.includes(playerCaptureMissTargetGame.player.name) && line.includes("造成")), "failed capture source enemy turn attacks the selected player target");
assertEqual(Number(playerCaptureMissTargetGame.pets[0].Hp || 0), 999, "failed capture enemy turn does not force damage onto the active pet");

let playerEscapeFirstCountGame = await api("/api/game/new", { name: "player-escape-first-count-test" });
playerEscapeFirstCountGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
playerEscapeFirstCountGame = await api("/api/game/encounter", { game: playerEscapeFirstCountGame });
Object.assign(playerEscapeFirstCountGame.player, { level: 1, Luck: 1, WorkFixLuck: 1 });
Object.assign(playerEscapeFirstCountGame.pets[0], { Lv: 1, Hp: 999, WorkMaxHp: 999 });
Object.assign(playerEscapeFirstCountGame.encounter, {
  Lv: 1,
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
playerEscapeFirstCountGame.battle.enemyParty = [playerEscapeFirstCountGame.encounter];
playerEscapeFirstCountGame = await api("/api/game/battle", { game: playerEscapeFirstCountGame, action: "逃跑" });
assertEqual(playerEscapeFirstCountGame.battleOutcome.playerEscape?.attempt, 1, "player first escape stores one source entry escape increment");
assertEqual(playerEscapeFirstCountGame.battleOutcome.playerEscape?.sourceEscapeCount, 2, "player first escape check uses source entry escape plus one");
assertEqual(playerEscapeFirstCountGame.battleOutcome.playerEscape?.chance, 60, "player first escape chance follows source post-increment escape count");

let blockedEscapeGame = await api("/api/game/new", { name: "player-escape-status-blocked-test" });
blockedEscapeGame.location = { mapId: "100", x: 637, y: 493, dir: 2 };
blockedEscapeGame = await api("/api/game/encounter", { game: blockedEscapeGame });
blockedEscapeGame.player.BattleStatuses = {
  sleep: { key: "sleep", label: "睡眠", turns: 1 }
};
Object.assign(blockedEscapeGame.pets[0], { Hp: 999, WorkMaxHp: 999 });
Object.assign(blockedEscapeGame.encounter, {
  Lv: 1,
  Hp: 500,
  WorkMaxHp: 500,
  WorkAttackPower: 0,
  WorkFixStr: 0,
  Attack: 0,
  Str: 0,
  WorkQuick: 1,
  WorkFixDex: 1,
  WorkTacticsOption: "at:1;3;1|gu:0|es:0|wa:0;0;0;0;0;0;0"
});
blockedEscapeGame.battle.enemyParty = [blockedEscapeGame.encounter];
blockedEscapeGame = await api("/api/game/battle", { game: blockedEscapeGame, action: "逃跑" });
assertEqual(blockedEscapeGame.battleOutcome.result, "escape-blocked", "sleep blocks source E escape before escape roll");
assertEqual(blockedEscapeGame.battleOutcome.sourceCommand, "N", "blocked source E command dispatches to source wait command");
assertEqual(blockedEscapeGame.battleOutcome.playerAction?.sourceCommand, "BATTLE_COM_WAIT", "blocked escape records wait dispatch telemetry");
assertEqual(blockedEscapeGame.battleOutcome.playerAction?.attemptedSourceCommand, "BATTLE_COM_ESCAPE", "blocked escape keeps attempted escape telemetry");
assertEqual(Number(blockedEscapeGame.battle?.playerEscapeAttempts || 0), 0, "blocked escape does not increment source escape attempts");
assert(!blockedEscapeGame.player.BattleStatuses?.sleep, "player sleep turn is consumed when it blocks escape");
assert(blockedEscapeGame.battleOutcome.log.some((line) => line.includes("睡眠") && line.includes("无法行动")), "blocked escape writes source-style status log");
assert(blockedEscapeGame.encounter && blockedEscapeGame.battle, "blocked escape keeps battle active");

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

let aiCooldownGame = await api("/api/game/new", { name: "npc-ai-cooldown-test" });
aiCooldownGame.location = { mapId: "1100", x: villageGirl.x - 1, y: villageGirl.y };
aiCooldownGame = await api("/api/game/dialog", { game: aiCooldownGame, npcId: villageGirl.id, message: "AI对话" });
let openAiCooldownCalls = 0;
globalThis.fetch = async (request, init) => {
  const url = typeof request === "string" ? request : request?.url || "";
  if (String(url).includes("/v1/responses")) {
    openAiCooldownCalls += 1;
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        reply: "村子南边是商店，北边有长者和路口。",
        intent: "chat",
        action: { type: "none", text: "", seconds: 0, percent: 0, reason: "" },
        confidence: 0.8
      })
    }), { status: 200, headers: { "content-type": "application/json" } });
  }
  return originalFetch(request, init);
};
try {
  const openAiEnv = { ...env, OPENAI_API_KEY: "test-openai-key", OPENAI_MODEL: "gpt-cooldown-test" };
  aiCooldownGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiCooldownGame, npcId: villageGirl.id, message: "先聊第一句" });
  aiCooldownGame = await apiWithEnv(openAiEnv, "/api/game/dialog", { game: aiCooldownGame, npcId: villageGirl.id, message: "再聊第二句" });
  assertEqual(openAiCooldownCalls, 1, "different NPC AI prompts are rate-limited during cooldown instead of calling OpenAI repeatedly");
  const cooldownReply = aiCooldownGame.dialog.messages.at(-1)?.text || "";
  assert(cooldownReply.includes("缓口气"), "cooldown reply tells the player to wait briefly");
  assert(aiCooldownGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "ai-npc-cooldown"), "cooldown block records a VM trace reason");
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
  assertEqual(openAiProposalCalls, 1, "repeat OpenAI proposal request is rate-limited while proposal is still pending");
  const proposalCooldownReply = aiProposalCacheGame.dialog.messages.at(-1)?.text || "";
  assert(proposalCooldownReply.includes("同意") || proposalCooldownReply.includes("拒绝"), "proposal cooldown reply asks the player to confirm or decline first");
  assert(aiProposalCacheGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "ai-npc-cooldown"), "proposal cooldown block records a VM trace reason");
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
  assertEqual(openAiMemoryCalls, 1, "memory-writing NPC message is rate-limited instead of repeatedly calling OpenAI");
  assert(!aiMemoryCacheGame.aiNpcCache?.entries?.length, "memory-writing NPC reply does not persist a pure-chat cache entry");
  assert(aiMemoryCacheGame.dialog.debug.vmTrace.some((event) => event.detail?.reason === "ai-npc-cooldown"), "memory-writing cooldown block records a VM trace reason");
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
