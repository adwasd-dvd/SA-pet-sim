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
assert(teacherGame.dialog.source.includes(teacher.source), "teacher dialog source line includes source path");
teacherGame = await api("/api/game/dialog", { game: teacherGame, npcId: teacher.id, message: "来源" });
assert(teacherGame.dialog.messages.some((message) => message.speaker === "player" && message.text === "来源"), "custom dialog text is appended");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(teacher.source)), "source query replies with source path");
assert(teacherGame.dialog.messages.some((message) => message.speaker === "npc" && message.text.includes(teacher.script)), "source query replies with script path");

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
assert(game.flags.bits[`end:${stableFlag(`${saveNpc.npc.id}:savepoint`)}`], "savepoint end flag set");

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
assert(game.save.info.includes(`FLOOR=${warpNpc.npc.warp.target.mapId}`), "saac-like save info records warped floor");
assert(game.flags.bits[`end:${stableFlag(`${warpNpc.npc.id}:warp`)}`], "warp action flag set");

console.log("NPC actions OK: source-debug dialogue, distance-gated talk/window actions, healer, savepoint, and source WARP NPC actions mutate game/save state.");

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

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}
