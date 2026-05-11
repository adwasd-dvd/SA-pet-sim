const DATA_FILES = {
  enemyBase: "/data/enemybase2.txt",
  skills: "/data/petskill2.txt",
  searchable: [
    ["宠物", "/data/enemybase2.txt"],
    ["道具", "/data/itemset6.txt"],
    ["地图", "/data/mapset.txt"],
    ["传送", "/data/mapwarp.txt"],
    ["NPC外观", "/data/npc-look.txt"],
    ["遇敌", "/data/encount.txt"],
    ["敌人", "/data/enemy1.txt"],
    ["可捕获排行", "/data/obtainable_140_attr_net_rank_v2.csv"]
  ]
};

const CHAR_MAXUPLEVEL = 140;
const rankTab = [
  [450, 500],
  [470, 520],
  [490, 540],
  [510, 560],
  [530, 580],
  [550, 600]
];

const WORLD = {
  startMap: "samgill",
  maps: {
    samgill: {
      id: "samgill",
      name: "萨姆吉尔村",
      floorId: 100,
      mapFile: "/data/maps/1021.ls2map",
      summary: "海边的新手村，适合建立人物、学习抓宠和接第一批委托。",
      size: [18, 12],
      spawn: [9, 6],
      encounterPets: [100, 101, 102, 103, 104, 105, 106, 107],
      npcs: [
        { id: "elder", name: "村长", x: 9, y: 4, type: "quest", dialogue: "年轻的原始人，先去草原抓一只伙伴吧。带着宠物回来，我会给你下一步指引。", questId: "first-pet" },
        { id: "trainer", name: "宠物训练师", x: 12, y: 7, type: "trainer", dialogue: "宠物成长需要战斗，也需要耐心。我可以帮你做一次安全训练。" },
        { id: "guide", name: "旅行向导", x: 5, y: 7, type: "guide", dialogue: "村外草原有低等级野兽，森林路口通向更远的地方。" }
      ],
      exits: [
        { id: "plain", label: "去村外草原", to: "plain", x: 16, y: 6, target: [2, 6], source: "mapwarp.txt" }
      ]
    },
    plain: {
      id: "plain",
      name: "村外草原",
      floorId: 101,
      mapFile: "/data/maps/sainasu.ls2map",
      summary: "低等级练级区，常见乌力系和布依系宠物。",
      size: [22, 14],
      spawn: [2, 6],
      encounterPets: [108, 109, 110, 111, 112, 113, 114, 115],
      npcs: [
        { id: "hunter", name: "猎人", x: 8, y: 5, type: "hint", dialogue: "血低的时候不要硬撑。抓宠最好先观察属性和成长。" },
        { id: "lost", name: "迷路的小孩", x: 15, y: 9, type: "quest", dialogue: "我想回村子，可是路上有野兽。你能带我回去吗？", questId: "lost-child" }
      ],
      exits: [
        { id: "samgill", label: "回萨姆吉尔村", to: "samgill", x: 0, y: 6, target: [15, 6], source: "mapwarp.txt" },
        { id: "forest", label: "去森林路口", to: "forest", x: 21, y: 8, target: [2, 8], source: "mapwarp.txt" }
      ]
    },
    forest: {
      id: "forest",
      name: "森林路口",
      floorId: 102,
      mapFile: "/data/maps/1022.ls2map",
      summary: "更危险的区域，宠物等级略高，也更容易遇到任务 NPC。",
      size: [24, 16],
      spawn: [2, 8],
      encounterPets: [116, 117, 118, 119, 120, 121, 122, 123],
      npcs: [
        { id: "herbalist", name: "采药人", x: 10, y: 6, type: "quest", dialogue: "森林里有治疗用的草药，但附近的野兽越来越凶。", questId: "forest-herb" },
        { id: "stone", name: "古老石碑", x: 17, y: 10, type: "lore", dialogue: "石碑上刻着模糊的路线：村庄、草原、森林，再往前就是真正的冒险。" }
      ],
      exits: [
        { id: "plain", label: "回村外草原", to: "plain", x: 0, y: 8, target: [20, 8], source: "mapwarp.txt" }
      ]
    }
  },
  quests: {
    "first-pet": {
      id: "first-pet",
      title: "第一只伙伴",
      source: "mission.txt / npc event seed",
      description: "村长希望你在村外草原捕获第一只宠物。",
      steps: ["和村长交谈", "去村外草原遇敌", "捕获一只宠物", "回村找村长"],
      reward: "石币 120，人物经验 30"
    },
    "lost-child": {
      id: "lost-child",
      title: "迷路的小孩",
      source: "npc/*.arg pattern",
      description: "把草原上的小孩带回萨姆吉尔村。",
      steps: ["在草原找到迷路的小孩", "回到萨姆吉尔村", "向村长报告"],
      reward: "石币 80，宠物训练机会"
    },
    "forest-herb": {
      id: "forest-herb",
      title: "森林草药",
      source: "npc event script seed",
      description: "采药人需要你调查森林里的野兽。",
      steps: ["到森林路口", "和采药人交谈", "完成 3 次安全训练"],
      reward: "治疗药草，人物经验 60"
    }
  }
};

let cache;
let charId = 0;
const charSet = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }
    return env.ASSETS.fetch(request);
  }
};

async function handleApi(request, env, url) {
  try {
    if (request.method === "OPTIONS") return json({});
    if (url.pathname === "/api/getpet" && request.method === "POST") {
      const body = await readJson(request);
      const data = await loadGameData(env, request);
      const no = Number(body.no) || pick(data.enemyNoList);
      const pet = createEnemy(data, no, 1);
      if (!pet) return json({ error: "pet not found" }, 404);
      return json(pet);
    }
    if (url.pathname === "/api/levelup" && request.method === "POST") {
      const body = await readJson(request);
      let pet = body.pet;
      if (!pet && body.id) pet = charSet.get(Number(body.id));
      if (!pet) return json({ error: "pet not found" }, 404);
      const up = Math.max(1, Math.min(Number(body.up) || 1, CHAR_MAXUPLEVEL));
      for (let i = 0; i < up; i += 1) petLevelUp(pet);
      charSet.set(pet.Id, pet);
      return json(pet);
    }
    if (url.pathname === "/api/data/search" && request.method === "POST") {
      const body = await readJson(request);
      return json(await searchData(env, request, String(body.q || "").trim()));
    }
    if (url.pathname === "/api/ai/analyze" && request.method === "POST") {
      const body = await readJson(request);
      return json(await analyzePet(env, body.pet, String(body.prompt || "")));
    }
    if (url.pathname === "/api/game/new" && request.method === "POST") {
      const body = await readJson(request);
      return json(await createPlayerGame(env, request, body));
    }
    if (url.pathname === "/api/game/sync" && request.method === "POST") {
      const body = await readJson(request);
      return json(withMap(normalizeGame(body.game)));
    }
    if (url.pathname === "/api/game/travel" && request.method === "POST") {
      const body = await readJson(request);
      return json(travelGame(body.game, String(body.to || "")));
    }
    if (url.pathname === "/api/game/talk" && request.method === "POST") {
      const body = await readJson(request);
      return json(talkGame(body.game, String(body.npcId || "")));
    }
    if (url.pathname === "/api/game/dialog" && request.method === "POST") {
      const body = await readJson(request);
      return json(await dialogGame(env, body.game, String(body.npcId || ""), String(body.message || "")));
    }
    if (url.pathname === "/api/game/encounter" && request.method === "POST") {
      const body = await readJson(request);
      return json(await encounterGame(env, request, body.game));
    }
    if (url.pathname === "/api/game/capture" && request.method === "POST") {
      const body = await readJson(request);
      return json(captureGame(body.game));
    }
    if (url.pathname === "/api/game/train" && request.method === "POST") {
      const body = await readJson(request);
      return json(trainGame(body.game, Number(body.petIndex) || 0));
    }
    if (url.pathname === "/api/ai/guide" && request.method === "POST") {
      const body = await readJson(request);
      return json(await guideGame(env, body.game, String(body.prompt || "")));
    }
    return json({ error: "not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "server error" }, 500);
  }
}

async function createPlayerGame(env, request, body) {
  const data = await loadGameData(env, request);
  const starter = createEnemy(data, Number(body.starterPet) || 100, 1) || createEnemy(data, pick(data.enemyNoList), 1);
  const name = String(body.name || "").trim().slice(0, 12) || "新来的原始人";
  return withMap({
    id: crypto.randomUUID(),
    player: {
      name,
      level: 1,
      exp: 0,
      stone: 100,
      hp: 100,
      maxHp: 100
    },
    location: {
      mapId: WORLD.startMap,
      x: WORLD.maps[WORLD.startMap].spawn[0],
      y: WORLD.maps[WORLD.startMap].spawn[1]
    },
    pets: [starter],
    inventory: [{ id: "stone", name: "石币", qty: 100 }],
    quests: {},
    flags: createFlags(),
    encounter: null,
    dialog: null,
    log: [`${name} 来到了 ${WORLD.maps[WORLD.startMap].name}。`]
  });
}

function travelGame(game, to) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const exit = map.exits.find((item) => item.to === to || item.id === to);
  if (!exit) throw new Error("这个出口不存在");
  game.location = { mapId: exit.to, x: exit.target[0], y: exit.target[1] };
  game.encounter = null;
  addLog(game, `你通过「${exit.label}」来到 ${WORLD.maps[exit.to].name}。`);
  return withMap(game);
}

function talkGame(game, npcId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  const reply = runNpcTalk(game, npc, "hi");
  openDialog(game, npc, [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", reply)
  ]);
  return withMap(game, { npc });
}

async function dialogGame(env, game, npcId, message) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");

  const text = message.trim().slice(0, 160);
  if (!text) {
    const reply = runNpcTalk(game, npc, "hi");
    openDialog(game, npc, [
      npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
      npcMessage("player", "hi"),
      npcMessage("npc", reply)
    ]);
    return withMap(game, { npc });
  }

  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", runNpcTalk(game, npc, "hi"))
  ];
  const reply = await npcReply(env, game, npc, text);
  openDialog(game, npc, [
    ...existing,
    npcMessage("player", text),
    npcMessage("npc", reply)
  ]);
  addLog(game, `${game.player.name} 对 ${npc.name} 说：${text}`);
  addLog(game, `${npc.name}：${reply}`);
  return withMap(game, { npc });
}

async function encounterGame(env, request, game) {
  game = normalizeGame(game);
  const data = await loadGameData(env, request);
  const map = currentMap(game);
  const petNo = pick(map.encounterPets);
  const enemy = createEnemy(data, petNo, Math.max(1, game.player.level + randInt(3) - 1));
  if (!enemy) throw new Error("当前地图没有可遇敌宠物");
  enemy.CaptureRate = Math.max(18, Math.min(75, 70 - enemy.Rare + game.player.level * 2));
  game.encounter = enemy;
  addLog(game, `野外遇到了 ${enemy.Name} Lv.${enemy.Lv}。`);
  return withMap(game);
}

function captureGame(game) {
  game = normalizeGame(game);
  if (!game.encounter) throw new Error("当前没有可捕获目标");
  const target = game.encounter;
  const rate = Number(target.CaptureRate || 35);
  const ok = Math.random() * 100 < rate;
  if (ok) {
    game.pets.push(target);
    game.encounter = null;
    game.player.exp += 12;
    game.player.stone += 20;
    addQuestProgress(game, "first-pet", 1);
    addLog(game, `捕获成功！${target.Name} 加入了队伍。`);
  } else {
    addLog(game, `${target.Name} 挣脱了绳索。`);
  }
  return withMap(game, { captured: ok });
}

function trainGame(game, petIndex) {
  game = normalizeGame(game);
  const pet = game.pets[petIndex];
  if (!pet) throw new Error("没有找到这只宠物");
  const before = pet.Lv;
  const up = pet.Lv < 10 ? 2 : 1;
  for (let i = 0; i < up; i += 1) petLevelUp(pet);
  game.player.exp += 10 * (pet.Lv - before);
  game.player.stone += 12;
  addQuestProgress(game, "forest-herb", 1);
  addLog(game, `${pet.Name} 完成训练，从 Lv.${before} 提升到 Lv.${pet.Lv}。`);
  return withMap(game);
}

async function guideGame(env, game, prompt) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const context = {
    player: game.player,
    map: { name: map.name, summary: map.summary, exits: map.exits.map((e) => e.label), npcs: map.npcs.map((n) => n.name) },
    pets: game.pets.map(petSummary),
    quests: Object.values(game.quests),
    recentLog: game.log.slice(-6)
  };
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      { role: "system", content: "你是单人版石器时代游戏里的向导。只根据给你的当前游戏状态回答，给玩家下一步建议。简洁中文，最多三段。" },
      { role: "user", content: `${prompt || "我下一步该做什么？"}\n\n当前状态：${JSON.stringify(context)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    const rsp = await env.AI.run(model, { messages });
    return { text: rsp.response || rsp.text || fallbackGuide(context), model };
  }
  return { text: fallbackGuide(context), model: "local-rule" };
}

async function npcReply(env, game, npc, text) {
  const lower = text.toLowerCase();
  if (isGreeting(lower)) return runNpcTalk(game, npc, "hi");
  if (hasAny(lower, ["任务", "委托", "quest"])) return questReply(game, npc);
  if (hasAny(lower, ["抓宠", "捕获", "宠物", "pet"])) return captureReply(game, npc);
  if (hasAny(lower, ["训练", "练级", "成长", "技能"])) return trainReply(game, npc);
  if (hasAny(lower, ["地图", "出口", "去哪", "travel", "map", "森林", "草原", "村"])) return mapReply(game, npc);
  if (env.AI && typeof env.AI.run === "function") return aiNpcReply(env, game, npc, text);
  return fallbackNpcReply(npc);
}

function isGreeting(text) {
  return /(^|\s)(hi|hello|hey|yo)(\s|$)/i.test(text) || hasAny(text, ["你好", "嗨", "哈喽", "問候", "问候"]);
}

function hasAny(text, tokens) {
  return tokens.some((token) => text.includes(token));
}

function applyNpcHi(game, npc) {
  ensureFlags(game);
  setEventFlag(game, eventFlagForNpc(npc.id), "now");
  if (npc.questId) {
    if (!game.quests[npc.questId]) {
      game.quests[npc.questId] = { ...WORLD.quests[npc.questId], status: "进行中", progress: 0 };
      addLog(game, `接到任务「${WORLD.quests[npc.questId].title}」。`);
    } else if (game.quests[npc.questId].status === "可回报") {
      completeQuest(game, npc.questId);
      return `${npc.dialogue} 你已经完成了「${WORLD.quests[npc.questId].title}」，奖励已经给你。`;
    }
  }
  if (npc.id === "elder" && game.pets.length > 1) {
    addQuestProgress(game, "first-pet", 2);
    setEventFlag(game, eventFlagForNpc("elder"), "end");
  }
  if (npc.id === "stone") setEventFlag(game, eventFlagForNpc("stone"), "end");
  return npc.dialogue;
}

function runNpcTalk(game, npc, text) {
  const body = text.trim().toLowerCase();
  if (isGreeting(body)) {
    const reply = applyNpcHi(game, npc);
    addLog(game, `${game.player.name} 对 ${npc.name} 说：hi`);
    addLog(game, `${npc.name}：${reply}`);
    return reply;
  }
  return fallbackNpcReply(npc);
}

function completeQuest(game, questId) {
  const quest = game.quests[questId];
  if (!quest || quest.status === "完成") return;
  quest.status = "完成";
  quest.progress = quest.steps.length;
  game.player.exp += questId === "forest-herb" ? 60 : questId === "first-pet" ? 30 : 20;
  game.player.stone += questId === "first-pet" ? 120 : 80;
  setEventFlag(game, eventFlagForQuest(questId), "end");
  addLog(game, `完成任务「${quest.title}」，获得奖励。`);
}

function questReply(game, npc) {
  if (!npc.questId) return `${npc.name} 这里没有正式委托，但可以继续问地图、抓宠或训练。`;
  const quest = game.quests[npc.questId];
  if (!quest) return `我这里有「${WORLD.quests[npc.questId].title}」。点选我时客户端会自动打招呼并触发任务。`;
  if (quest.status === "可回报") return `你已经可以回报「${quest.title}」了。再次点选我会自动送出 hi 并结算奖励。`;
  return `「${quest.title}」还在进行中。下一步是：${quest.steps[Math.min(quest.progress || 0, quest.steps.length - 1)]}。`;
}

function captureReply(game, npc) {
  if (npc.id === "hunter") return "抓宠先观察等级和捕获率，血不够就回村。遇敌后点捕获，成功了宠物会进队伍。";
  if (npc.id === "elder") return "第一只伙伴要去村外草原找。抓到以后回来再点我，客户端会自动打招呼。";
  return "宠物会在野外遇敌中出现。不同地图的 encounter 表不同，越往外越危险。";
}

function trainReply(game, npc) {
  if (npc.id === "trainer") return "打开宠物页点训练，我会做一次安全训练。低等级宠物通常一次能多升一点。";
  return "宠物可以靠训练和冒险升级。成长要等等级上来后才更好判断。";
}

function mapReply(game, npc) {
  const map = currentMap(game);
  const exits = map.exits.map((exit) => exit.label).join("、") || "暂无出口";
  if (npc.id === "guide") return `这里是${map.name}。可走的出口：${exits}。地图上的蓝色标记就是出口。`;
  return `当前地图是${map.name}。出口：${exits}。`;
}

function fallbackNpcReply(npc) {
  const hints = {
    elder: "你说得有点新鲜。可以问任务或抓宠；默认打招呼已经在点选时自动发生了。",
    trainer: "我听懂了一点。若是宠物相关，问训练、技能、成长会更准。",
    guide: "我能回答地图、出口和去哪儿。",
    stone: "石碑上的字纹闪了一下，似乎只认地图和森林这些词。"
  };
  return hints[npc.id] || "NPC 沉思了一会儿。你可以试试说任务、地图、抓宠或训练。";
}

async function aiNpcReply(env, game, npc, text) {
  const map = currentMap(game);
  const messages = [
    { role: "system", content: "你是石器时代单人 PWA 里的 NPC。必须保持 NPC 身份，只根据当前地图、任务、宠物和玩家发言回应。中文，1-2 句，不替玩家操作。" },
    { role: "user", content: JSON.stringify({
      npc: { id: npc.id, name: npc.name, type: npc.type, dialogue: npc.dialogue },
      player: game.player,
      map: { name: map.name, exits: map.exits.map((exit) => exit.label) },
      quests: game.quests,
      pets: game.pets.map(petSummary),
      text
    }) }
  ];
  const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
  const rsp = await env.AI.run(model, { messages });
  return rsp.response || rsp.text || fallbackNpcReply(npc);
}

function openDialog(game, npc, messages) {
  game.dialog = {
    open: true,
    npcId: npc.id,
    npcName: npc.name,
    npcType: npc.type,
    messages: messages.slice(-12),
    suggestions: dialogSuggestions(npc),
    source: "参考 gmsv：点击 NPC 后客户端自动送出 P|hi，再由 CHAR_Talk 触发 NPC talkedfunc"
  };
}

function dialogSuggestions(npc) {
  const base = ["任务", "地图", "抓宠"];
  if (npc.type === "trainer") return ["训练", "成长", "技能"];
  if (npc.id === "hunter") return ["抓宠", "练级", "任务"];
  if (npc.id === "guide") return ["出口", "地图", "森林"];
  return base;
}

function npcMessage(speaker, text) {
  return { speaker, text, at: Date.now() };
}

function fallbackGuide(context) {
  const quest = context.quests.find((item) => item.status === "进行中");
  if (quest) {
    return `你现在在${context.map.name}。建议继续任务「${quest.title}」：${quest.steps[Math.min(quest.progress || 0, quest.steps.length - 1)]}。当前地图 NPC：${context.map.npcs.join("、") || "无"}。`;
  }
  return `你现在在${context.map.name}。可以先和 NPC 交谈接任务，或者去野外遇敌抓宠。出口：${context.map.exits.join("、") || "暂无"}`;
}

function normalizeGame(game) {
  if (!game || !game.player || !game.location) throw new Error("需要先创建人物");
  game.pets ||= [];
  game.inventory ||= [];
  game.quests ||= {};
  ensureFlags(game);
  game.dialog ||= null;
  game.log ||= [];
  return game;
}

function withMap(game, extra = {}) {
  const map = currentMap(game);
  return {
    ...game,
    world: {
      map,
      quests: WORLD.quests
    },
    ...extra
  };
}

function currentMap(game) {
  const map = WORLD.maps[game.location.mapId];
  if (!map) throw new Error("当前地图不存在");
  return map;
}

function addLog(game, text) {
  game.log.push(text);
  game.log = game.log.slice(-24);
}

function addQuestProgress(game, questId, amount) {
  const quest = game.quests[questId];
  if (!quest || quest.status === "完成") return;
  quest.progress = Math.min((quest.progress || 0) + amount, quest.steps.length);
  if (quest.progress >= quest.steps.length - 1) {
    quest.status = "可回报";
  }
}

function createFlags() {
  return {
    endEvents: Array(8).fill(0),
    nowEvents: Array(8).fill(0),
    bits: {}
  };
}

function ensureFlags(game) {
  game.flags ||= {};
  game.flags.endEvents = normalizeFlagArray(game.flags.endEvents);
  game.flags.nowEvents = normalizeFlagArray(game.flags.nowEvents);
  game.flags.bits ||= {};
}

function normalizeFlagArray(value) {
  if (!Array.isArray(value)) return Array(8).fill(0);
  const out = Array(8).fill(0);
  value.slice(0, 8).forEach((item, index) => {
    out[index] = Number(item) >>> 0;
  });
  return out;
}

function setEventFlag(game, shiftbit, kind = "end") {
  if (!shiftbit) return;
  ensureFlags(game);
  const field = kind === "now" ? "nowEvents" : "endEvents";
  const index = Math.floor(shiftbit / 32);
  const bit = shiftbit % 32;
  while (game.flags[field].length <= index) game.flags[field].push(0);
  game.flags[field][index] = (game.flags[field][index] | (1 << bit)) >>> 0;
  game.flags.bits[`${kind}:${shiftbit}`] = true;
}

function eventFlagForNpc(npcId) {
  const flags = {
    elder: 1,
    trainer: 2,
    guide: 3,
    hunter: 4,
    lost: 5,
    herbalist: 6,
    stone: 7
  };
  return flags[npcId] || 0;
}

function eventFlagForQuest(questId) {
  const flags = {
    "first-pet": 33,
    "lost-child": 34,
    "forest-herb": 35
  };
  return flags[questId] || 0;
}

async function loadGameData(env, request) {
  if (cache) return cache;
  const [enemyText, skillText] = await Promise.all([
    assetText(env, request, DATA_FILES.enemyBase),
    assetText(env, request, DATA_FILES.skills)
  ]);
  const skills = parseSkills(skillText);
  const enemyBaseSet = new Map();
  const enemyNoList = [];
  for (const line of lines(enemyText)) {
    const rows = line.split(",");
    if (rows.length < 56) continue;
    const petSkills = [];
    const petSkillIds = [];
    for (let j = 0; j < 7; j += 1) {
      const skillId = toInt(rows[25 + j]);
      petSkillIds[j] = skillId;
      petSkills[j] = skillId ? skills.get(skillId) || null : null;
    }
    const eb = {
      Name: rows[0],
      No: toInt(rows[6]),
      InitNum: toInt(rows[7]),
      LvUpPoint: Math.trunc(toFloat(rows[8])),
      BaseVital: toInt(rows[9]),
      BaseStr: toInt(rows[10]),
      BaseTgh: toInt(rows[11]),
      BaseDex: toInt(rows[12]),
      ModAI: toInt(rows[13]),
      Get: toInt(rows[14]),
      EarthAT: toInt(rows[15]),
      WaterAT: toInt(rows[16]),
      FireAT: toInt(rows[17]),
      WindAt: toInt(rows[18]),
      Poison: toInt(rows[19]),
      Paralysis: toInt(rows[20]),
      Sleep: toInt(rows[21]),
      Stone: toInt(rows[22]),
      Drunk: toInt(rows[23]),
      Confusion: toInt(rows[24]),
      PetSkillIds: petSkillIds,
      PetSkills: petSkills,
      Rare: toInt(rows[32]),
      Critical: toInt(rows[33]),
      Counter: toInt(rows[34]),
      Slot: toInt(rows[35]),
      ImgNo: toInt(rows[36]),
      PetFlag: toInt(rows[37]),
      Size: toInt(rows[38]),
      LimitLevel: toInt(rows[54]),
      Species: toInt(rows[55])
    };
    enemyBaseSet.set(eb.No, eb);
    enemyNoList.push(eb.No);
  }
  cache = { enemyBaseSet, enemyNoList, skills };
  return cache;
}

function parseSkills(text) {
  const skills = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 12) continue;
    const id = toInt(rows[6]);
    skills.set(id, { Id: id, Name: rows[0], Des: compressStr(rows[1]) });
  }
  return skills;
}

function createEnemy(data, ebno, baselevel) {
  const eb = data.enemyBaseSet.get(ebno);
  if (!eb) return null;
  const level = baselevel;
  const tp = { ...eb };
  const paramCal = (v) => ((level - 1) * eb.LvUpPoint + eb.InitNum) * v;
  tp.BaseVital += randInt(5) - 2;
  tp.BaseStr += randInt(5) - 2;
  tp.BaseTgh += randInt(5) - 2;
  tp.BaseDex += randInt(5) - 2;

  const char = {
    Id: ++charId,
    Name: eb.Name,
    ImgNo: tp.ImgNo,
    WhichType: 2,
    DuelPoint: 0,
    Vital: 0,
    Str: 0,
    Tough: 0,
    Dex: 0,
    EarthAT: tp.EarthAT,
    WaterAT: tp.WaterAT,
    FireAT: tp.FireAT,
    WindAT: tp.WindAt,
    ModAI: tp.ModAI,
    VariableAI: 0,
    Slot: tp.Slot,
    Poison: tp.Poison,
    Paralysis: tp.Paralysis,
    Sleep: tp.Sleep,
    Stone: tp.Stone,
    Drunk: tp.Drunk,
    Confusion: tp.Confusion,
    Rare: tp.Rare,
    PetId: tp.No,
    Critical: tp.Critical,
    Counter: tp.Counter,
    Luck: 0,
    PetSkillIds: tp.PetSkillIds,
    PetSkills: tp.PetSkills,
    PetRank: enemyRank(data, ebno),
    Exp: 0,
    AllocPoint: [tp.BaseVital, tp.BaseStr, tp.BaseTgh, tp.BaseDex],
    WorkTactics: 0,
    WorkTacticsOption: "",
    WorkBattleActContition: "",
    WorkPetFlag: 0,
    WorkModCaptureDefault: tp.Get,
    Hp: 0,
    Mp: 0,
    BornLv: level,
    Lv: level,
    BornPoint: [0, 0, 0, 0],
    WorkMaxHp: 0,
    WorkMaxMp: 0,
    WorkFixVital: 0,
    WorkFixStr: 0,
    WorkFixTough: 0,
    WorkFixDex: 0,
    GrowthHp: 0,
    GrowthStr: 0,
    GrowthTough: 0,
    GrowthDex: 0,
    Growth: 0
  };

  for (let i = 0; i < 10; i += 1) {
    const w = randInt(4);
    if (w === 0) tp.BaseVital += 1;
    if (w === 1) tp.BaseStr += 1;
    if (w === 2) tp.BaseTgh += 1;
    if (w === 3) tp.BaseDex += 1;
  }
  char.Vital = paramCal(tp.BaseVital);
  char.Str = paramCal(tp.BaseStr);
  char.Tough = paramCal(tp.BaseTgh);
  char.Dex = paramCal(tp.BaseDex);
  complianceParameter(char);
  char.BornPoint = [char.WorkMaxHp, char.WorkFixStr, char.WorkFixTough, char.WorkFixDex];
  charSet.set(char.Id, char);
  return char;
}

function petLevelUp(char) {
  if (char.Lv >= CHAR_MAXUPLEVEL) return;
  const param = [0, 0, 0, 0];
  for (let i = 0; i < 10; i += 1) param[randInt(4)] = 1;
  const rank = Math.max(0, Math.min(char.PetRank || 0, rankTab.length - 1));
  const [min, max] = rankTab[rank];
  const frand = (min + randInt(max - min + 1)) * 0.01;
  char.Vital += Math.trunc((char.AllocPoint[0] + param[0]) * frand);
  char.Str += Math.trunc((char.AllocPoint[1] + param[1]) * frand);
  char.Tough += Math.trunc((char.AllocPoint[2] + param[2]) * frand);
  char.Dex += Math.trunc((char.AllocPoint[3] + param[3]) * frand);
  char.Lv += 1;
  complianceParameter(char);
  const lvd = char.Lv - char.BornLv;
  if (lvd > 0) {
    char.GrowthHp = (char.WorkMaxHp - char.BornPoint[0]) / lvd;
    char.GrowthStr = (char.WorkFixStr - char.BornPoint[1]) / lvd;
    char.GrowthTough = (char.WorkFixTough - char.BornPoint[2]) / lvd;
    char.GrowthDex = (char.WorkFixDex - char.BornPoint[3]) / lvd;
    char.Growth = char.GrowthStr + char.GrowthTough + char.GrowthDex;
  }
}

function complianceParameter(char) {
  char.WorkFixDex = Math.trunc(char.Dex / 100);
  char.WorkFixVital = Math.trunc(char.Vital / 100);
  char.WorkFixStr = Math.trunc((char.Str * 1 + char.Tough * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkFixTough = Math.trunc((char.Tough * 1 + char.Str * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkMaxHp = Math.trunc((char.Vital * 4 + char.Str + char.Tough + char.Dex) / 100);
  char.Hp = char.WorkMaxHp;
  char.Mp = char.WorkMaxMp;
}

function enemyRank(data, ebno) {
  const ranktbl = [100, 95, 90, 85, 80, 0];
  const tp = data.enemyBaseSet.get(ebno);
  if (!tp) return 0;
  const sum = tp.BaseVital + tp.BaseStr + tp.BaseTgh + tp.BaseDex;
  return ranktbl.findIndex((w) => sum >= w);
}

async function searchData(env, request, q) {
  if (q.length < 2) return { query: q, results: [] };
  const results = [];
  await Promise.all(DATA_FILES.searchable.map(async ([label, path]) => {
    const text = await assetText(env, request, path);
    let lineNo = 0;
    for (const line of lines(text)) {
      lineNo += 1;
      if (line.toLowerCase().includes(q.toLowerCase())) {
        results.push({ source: label, file: path, line: lineNo, text: line.slice(0, 280) });
        if (results.length >= 40) break;
      }
    }
  }));
  return { query: q, results: results.slice(0, 60) };
}

async function analyzePet(env, pet, prompt) {
  if (!pet) return { text: "先捕获一只宠物，再让我分析。" };
  const summary = petSummary(pet);
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      { role: "system", content: "你是石器时代宠物模拟器助手。用简洁中文分析宠物成长率、属性和技能，给出是否值得练的建议。" },
      { role: "user", content: `${prompt || "分析这只宠物。"}\n\n宠物数据：${JSON.stringify(summary)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    const rsp = await env.AI.run(model, { messages });
    return { text: rsp.response || rsp.text || fallbackAnalysis(pet), model };
  }
  return { text: fallbackAnalysis(pet), model: "local-rule" };
}

function petSummary(pet) {
  return {
    name: pet.Name,
    no: pet.PetId,
    lv: pet.Lv,
    hp: pet.WorkMaxHp,
    attack: pet.WorkFixStr,
    defense: pet.WorkFixTough,
    speed: pet.WorkFixDex,
    growth: round2(pet.Growth),
    growthHp: round2(pet.GrowthHp),
    growthStr: round2(pet.GrowthStr),
    growthTough: round2(pet.GrowthTough),
    growthDex: round2(pet.GrowthDex),
    attributes: { earth: pet.EarthAT, water: pet.WaterAT, fire: pet.FireAT, wind: pet.WindAT },
    skills: (pet.PetSkills || []).filter(Boolean).map((sk) => sk.Name)
  };
}

function fallbackAnalysis(pet) {
  const growth = Number(pet.Growth || 0);
  const verdict = pet.Lv < 20
    ? "等级还低，建议先拉到 30 级以上再判断成长。"
    : growth >= 6.0
      ? "总成长表现很亮眼，值得继续练。"
      : growth >= 5.4
        ? "总成长属于可用区间，可以看技能和属性再决定。"
        : "总成长偏低，更适合做图鉴或过渡。";
  const best = [
    ["攻", pet.GrowthStr || 0],
    ["防", pet.GrowthTough || 0],
    ["敏", pet.GrowthDex || 0],
    ["血", pet.GrowthHp || 0]
  ].sort((a, b) => b[1] - a[1])[0][0];
  return `${pet.Name} 当前 Lv.${pet.Lv}，总成长 ${round2(growth)}。优势项是${best}成长。${verdict}`;
}

async function assetText(env, request, path) {
  const url = new URL(path, request.url);
  const rsp = await env.ASSETS.fetch(new Request(url));
  if (!rsp.ok) throw new Error(`missing asset: ${path}`);
  return rsp.text();
}

async function readJson(request) {
  if (!request.body) return {};
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}

function lines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function compressStr(str) {
  return str ? str.replace(/\s+/g, ",") : "";
}

function toInt(value) {
  const n = Number.parseInt(value || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

function toFloat(value) {
  const n = Number.parseFloat(value || "0");
  return Number.isFinite(n) ? n : 0;
}

function randInt(n) {
  return Math.floor(Math.random() * n);
}

function pick(list) {
  return list[randInt(list.length)];
}

function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}
