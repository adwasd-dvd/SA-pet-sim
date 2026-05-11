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
    return json({ error: "not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "server error" }, 500);
  }
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
