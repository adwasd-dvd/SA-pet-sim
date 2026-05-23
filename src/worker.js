import { WORLD } from "./world-data.js";
import { STONEAGE_KNOWLEDGE } from "./stoneage-knowledge.js";

const DATA_FILES = {
  enemy: "/data/enemy1.txt",
  enemyBase: "/data/enemybase2.txt",
  items: "/data/itemset6.txt",
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

const GMSV_DATA_SOURCE = "gmsv-data";
const CHAR_MAXUPLEVEL = 140;
const CHAR_MAX_EXP = 1224160000;
const EXPGET_MAXLEVEL = 5;
const EXPGET_DIV = 15;
const LEVEL_EXP_TABLE = Object.freeze([
  0, 0, 2, 8, 25, 62, 129, 240, 409, 656, 1000, 1464, 2073, 2856, 3841, 5062,
  6553, 8352, 10497, 13032, 16000, 19448, 23425, 27984, 33177, 39062, 45697, 53144,
  61465, 70728, 81000, 92352, 104857, 118592, 133633, 150062, 167961, 187416, 208513,
  231344, 256000, 282576, 311169, 341880, 374809, 410062, 447745, 487968, 530841,
  576480, 625000, 676520, 731161, 789048, 850305, 915062, 983449, 1055600, 1131649,
  1211736, 1296000, 1402110, 1515521, 1636671, 1766022, 1904066, 2051322, 2208342,
  2375708, 2554041, 2744000, 2946281, 3161630, 3390834, 3634736, 3894230, 4170272,
  4463878, 4776136, 5108207, 5461333, 5836843, 6236162, 6660816, 7112448, 7592818,
  8103824, 8647511, 9226082, 9841920, 10497600, 11195912, 11939882, 12732800,
  13578242, 14480111, 15442664, 16470563, 17568917, 18743336, 20000000, 21345723,
  22788045, 24335325, 25996856, 27783000, 29705340, 31776872, 34012224, 36427912,
  39042666, 41877804, 44957696, 48310329, 51968004, 55968200, 60354645, 65178685,
  70501009, 76393874, 82944000, 95270613, 110766728, 130792366, 157614250, 195312500,
  252047376, 320144641, 388435456, 456922881, 525610000, 594499921, 663595776,
  732900721, 802417936, 872150625, 942102016, 1012275361, 1082673936, 1153301041,
  1224160000
]);
const ENEMY_BASE_EXP_TABLE = Object.freeze([
  1, 2, 3, 4, 5, 6, 9, 12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 58, 65, 72,
  79, 87, 95, 104, 113, 122, 131, 141, 151, 162, 173, 184, 196, 208, 220, 233,
  246, 260, 274, 288, 303, 318, 333, 348, 365, 381, 398, 415, 432, 450, 468, 486,
  506, 525, 545, 564, 585, 606, 627, 648, 670, 692, 714, 737, 760, 784, 808, 832,
  857, 882, 907, 933, 959, 956, 1012, 1040, 1067, 1095, 1123, 1152, 1181, 1210,
  1240, 1270, 1300, 1331, 1362, 1394, 1426, 1458, 1490, 1524, 1557, 1590, 1625,
  1659, 1694, 1729, 1764, 1800, 1836, 1872, 1909, 1946, 1983, 2021, 2059, 2097,
  2136, 2175, 2214, 2254, 2294, 2334, 2374, 2414, 2455, 2496, 2537, 2578, 2619,
  2661, 2703, 2745, 2787, 2829, 2872, 2915, 2958, 3000, 3043, 3088, 3132, 3176,
  3220, 3264, 3309, 3354, 3399, 3444, 3489, 3535, 3581, 3627, 3673, 3719, 3765,
  3812, 3859, 3906, 3953, 4000, 4047, 4095, 4143, 4191, 4239, 4287, 4335, 4384,
  4433, 4482, 4531, 4580, 4629, 4679, 4729, 4779, 4829, 4879, 4929, 4980, 5031,
  5082, 5133, 5133, 5184, 5235, 5287, 5339, 5391, 5443, 5495, 5547, 5599, 5652,
  5705, 5758, 5811, 5864, 5917, 5970, 6024, 6078, 6132, 6186, 6240, 6295, 6350,
  6405, 6460
]);
const SAVE_SCHEMA = "saac-pwa-v1";
const MAXCHAR_PER_USER = 4;
const INVENTORY_CAPACITY = 15;
const PET_CAPACITY = 5;
const PET_POOL_CAPACITY = 10;
const ITEM_POOL_CAPACITY = 20;
const CHAR_MAXGOLDHAVE = 10000 * 10000;
const BATTLE_ENTRY_MAX = 10;
const BATTLE_PLAYER_MAX = 5;
const BATTLE_SIDE_OFFSET = 10;
const BATTLE_TURN_SECONDS = 30;
const BATTLE_GETITEM_MAX = 3;
const ENEMY_DROP_ROLL_BASE = 1000;
const PLAYER_LEVEL_SKILL_POINTS = 3;
const PLAYER_POINT_STEP = 100;
const PLAYER_INITIAL_CHARM = 60;
const PLAYER_LEVEL_CHARM_STEP = 2;
const CG_INVISIBLE = 99;
const MAP_BLOCKED = 1;
const MAP_SPECIAL = 2;
const EVENT_NPC = 1;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";
const NPC_INTERACTION_RANGE = 2;
const NPC_WINDOW_ACTION_RANGE = 3;
const SOURCE_SCRIPT_TASKS = Object.freeze(buildSourceScriptTaskIndex(WORLD));
const ROUTE_MAX_STEPS = 900;
const ROUTE_MAX_VISITS = 60000;
const PAID_JUMP_BASE_COST = 2000;
const PAID_JUMP_FIRST_TIER_STEPS = 300;
const PAID_JUMP_SECOND_TIER_STEPS = 500;
const PAID_JUMP_FIRST_TIER_COST = 30;
const PAID_JUMP_SECOND_TIER_COST = 50;
const PAID_JUMP_THIRD_TIER_COST = 80;
const DEFAULT_CHAR_DIR = 5;
const AI_WORKSPACE_SCHEMA = "stoneage-ai-workspace-v1";
const AI_WORKSPACE_MAX_MEMORIES = 60;
const AI_NPC_CACHE_SCHEMA = "stoneage-ai-npc-cache-v1";
const AI_NPC_CACHE_TTL_MS = 5 * 60 * 1000;
const AI_NPC_CACHE_MAX_ENTRIES = 24;
const AI_NPC_CACHE_REPLY_LIMIT = 900;
const NPC_SOCIAL_SCHEMA = "stoneage-npc-social-v1";
const NPC_SOCIAL_MAX_NPCS = 32;
const NPC_SOCIAL_MAX_MEMORIES = 5;
const NPC_SOCIAL_PROMPT_MEMORY_LIMIT = 3;
const NPC_PROPOSAL_SCHEMA = "stoneage-npc-proposal-v1";
const NPC_PROPOSAL_TTL_MS = 2 * 60 * 1000;
const NPC_CONDITION_OVERRIDE_TTL_MS = 10 * 60 * 1000;
const NPC_CONDITION_OVERRIDE_MAX_USES = 3;
const ANGEL_ITEM_ID = 2884;
const HERO_ITEM_ID = 2885;
const ANGEL_MISSION_FLAGS = Object.freeze({
  NONE: 0,
  WAIT_ANSWER: 1,
  DOING: 2,
  HERO_COMPLETE: 3,
  TIMEOVER: 4
});
const SAFE_WILD_ENCOUNTER_MAP_RE = /村|庄园|店|医院|道场|柜台|商店|房屋|之家|的家|宠物店|肉店|武器店|防具店|便利|竞技场|競技場|斗技场|鬥技場|PK竞技|武斗场/i;
const SA_DIRECTION_DELTAS = Object.freeze([
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]);
const NPC_VM_ACTIONS = new Set([
  "say",
  "window",
  "shop",
  "petShop",
  "petFusion",
  "itemPoolShop",
  "raceMan",
  "routeService",
  "petSkillShop",
  "professionShop",
  "itemChange",
  "janken",
  "quiz",
  "appearance",
  "warp",
  "heal",
  "save",
  "fortune",
  "give",
  "take",
  "givePet",
  "takePet",
  "setFlag",
  "clearFlag",
  "setLastTalkElder",
  "heroBattleField",
  "missionOver",
  "missionClean",
  "moveNpc",
  "adjustCharm",
  "adjustFame",
  "adjustAmPoint",
  "effect",
  "startBattle",
  "battleAction",
  "quest",
  "debug"
]);
const SOURCE_ELDER_POSITIONS = Object.freeze({
  0: { mapId: "1006", floor: 1006, x: 15, y: 22 },
  1: { mapId: "2006", floor: 2006, x: 20, y: 16 },
  2: { mapId: "3006", floor: 3006, x: 21, y: 16 },
  3: { mapId: "4006", floor: 4006, x: 14, y: 20 },
  4: { mapId: "7770", floor: 7770, x: 9, y: 10 }
});
const BATTLE_PET_SKILL_FUNCS = new Set([
  "PETSKILL_None",
  "PETSKILL_NormalAttack",
  "PETSKILL_NormalGuard",
  "PETSKILL_GuardBreak",
  "PETSKILL_GuardBreak2",
  "PETSKILL_ContinuationAttack",
  "PETSKILL_Mighty",
  "PETSKILL_StatusChange",
  "PETSKILL_MagicStatusChange"
]);
const BATTLE_STATUS_EFFECTS = {
  "毒": { id: 1, key: "poison", label: "中毒", sourceCommand: "BATTLE_ST_POISON" },
  "麻": { id: 2, key: "paralysis", label: "麻痹", sourceCommand: "BATTLE_ST_PARALYSIS" },
  "眠": { id: 3, key: "sleep", label: "睡眠", sourceCommand: "BATTLE_ST_SLEEP" },
  "石": { id: 4, key: "stone", label: "石化", sourceCommand: "BATTLE_ST_STONE" },
  "醉": { id: 5, key: "drunk", label: "酒醉", sourceCommand: "BATTLE_ST_DRUNK" },
  "乱": { id: 6, key: "confusion", label: "混乱", sourceCommand: "BATTLE_ST_CONFUSION" },
  "虚": { id: 7, key: "weaken", label: "虚弱", sourceCommand: "BATTLE_ST_WEAKEN" },
  "剧": { id: 8, key: "deepPoison", label: "剧毒", sourceCommand: "BATTLE_ST_DEEPPOISON" },
  "煞": { id: 11, key: "sars", label: "煞毒", sourceCommand: "BATTLE_ST_SARS" }
};
const BATTLE_STATUS_BLOCKS_TURN = new Set(["paralysis", "sleep", "stone"]);
const BATTLE_STATUS_POISON_KEYS = new Set(["poison", "deepPoison", "sars"]);
const BATTLE_MAGIC_STATUS_EFFECTS = {
  "铁壁": { id: 2, key: "superWall", label: "铁壁", sourceCommand: "CHAR_MAGICSUPERWALL", stat: "defence" },
  "鐵壁": { id: 2, key: "superWall", label: "铁壁", sourceCommand: "CHAR_MAGICSUPERWALL", stat: "defence" }
};
const rankTab = [
  [450, 500],
  [470, 520],
  [490, 540],
  [510, 560],
  [530, 580],
  [550, 600]
];
const PET_FUSION_PET_TABLE = Object.freeze([
  [1, 2, 5, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 5, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5],
  [2, 5, 1, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1],
  [5, 1, 2, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2],
  [1, 2, 5, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5],
  [2, 5, 1, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1],
  [2, 1, 2, 1, 2, 2, 2, 5, 5, 1, 2, 5, 2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 5, 2, 5, 2, 1, 2],
  [1, 2, 5, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 1],
  [2, 5, 1, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 2],
  [10, 3, 10, 3, 10, 8, 10, 8, 10, 3, 10, 3, 10, 8, 10, 8, 10, 3, 10, 3, 10, 8, 10, 8, 10, 8, 10, 3, 10],
  [3, 8, 3, 8, 3, 10, 3, 10, 8, 3, 3, 8, 3, 8, 3, 10, 3, 10, 3, 8, 3, 8, 3, 10, 3, 10, 3, 8, 3],
  [3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8],
  [5, 1, 5, 1, 5, 2, 5, 2, 5, 1, 5, 5, 5, 1, 5, 2, 5, 2, 5, 1, 5, 1, 5, 2, 5, 2, 5, 1, 5],
  [8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10],
  [10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3],
  [3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8],
  [5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1],
  [9, 0, 9, 0, 9, 4, 9, 4, 9, 0, 9, 0, 9, 4, 9, 4, 9, 0, 9, 0, 9, 4, 9, 4, 9, 0, 9, 4, 9],
  [1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2],
  [6, 0, 6, 0, 6, 9, 6, 9, 6, 0, 6, 0, 6, 9, 6, 9, 6, 0, 6, 0, 6, 9, 6, 9, 6, 0, 6, 9, 6],
  [4, 6, 4, 6, 4, 9, 4, 9, 4, 6, 4, 6, 4, 9, 4, 9, 4, 6, 4, 6, 4, 9, 4, 9, 4, 6, 4, 9, 4],
  [8, 3, 8, 3, 8, 10, 8, 10, 8, 3, 8, 3, 8, 10, 8, 10, 8, 3, 8, 3, 8, 10, 8, 10, 8, 3, 8, 10, 8],
  [8, 10, 3, 8, 10, 3, 8, 10, 10, 3, 8, 10, 3, 8, 10, 3, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10],
  [1, 2, 5, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5],
  [0, 4, 0, 4, 0, 6, 0, 6, 0, 4, 0, 4, 0, 6, 0, 6, 0, 4, 0, 4, 0, 6, 0, 4, 0, 6, 0, 4, 0],
  [1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2, 5, 1, 2],
  [3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8],
  [10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3, 8, 10, 3],
  [2, 1, 2, 1, 5, 1, 5, 1, 2, 1, 2, 1, 5, 1, 5, 1, 2, 1, 2, 1, 5, 1, 5, 1, 2, 1, 2, 5, 1],
  [6, 9, 6, 9, 6, 0, 6, 0, 6, 9, 6, 9, 6, 0, 6, 0, 6, 9, 6, 9, 6, 0, 6, 0, 6, 9, 6, 0, 6]
]);
const PET_FUSION_PROPERTY_TABLE = Object.freeze([
  [0, 4, 5, 6],
  [7, 1, 8, 9],
  [10, 11, 2, 12],
  [13, 14, 15, 3]
]);
const PET_FUSION_RESULT_TABLE = Object.freeze([
  [989, 990, 991, 992, 989, 992, 989, 990, 990, 990, 991, 991, 991, 992, 989, 992],
  [1001, 1002, 1003, 1004, 1001, 1001, 1004, 1001, 1002, 1002, 1003, 1003, 1003, 1004, 1004, 1003],
  [1005, 1006, 1007, 1008, 1005, 1005, 1005, 1006, 1006, 1006, 1007, 1006, 1007, 1008, 1008, 1008],
  [1021, 1025, 1023, 1024, 1025, 1021, 1021, 1022, 1022, 1022, 1023, 1023, 1023, 1021, 1024, 1024],
  [1030, 1031, 1032, 1033, 1030, 1030, 1030, 1031, 1031, 1031, 1032, 1031, 1032, 1030, 1033, 1033],
  [1017, 1018, 1019, 1020, 1018, 1017, 1017, 1018, 1019, 1018, 1019, 1019, 1020, 1017, 1020, 1020],
  [1009, 1010, 1011, 1012, 1010, 1009, 1009, 1010, 1010, 1010, 1011, 1011, 1011, 1012, 1012, 1011],
  [993, 994, 995, 996, 994, 993, 993, 994, 995, 994, 995, 993, 996, 993, 996, 996],
  [1026, 1027, 1028, 1029, 1026, 1026, 1026, 1026, 1028, 1027, 1028, 1028, 1029, 1029, 1029, 1029],
  [997, 998, 999, 999, 1000, 997, 997, 1000, 998, 998, 1000, 998, 999, 999, 999, 999],
  [1013, 1014, 1015, 1016, 1013, 1013, 1016, 1013, 1015, 1014, 1015, 1015, 1015, 1016, 1016, 1016]
]);
const PET_FUSION_ILLEGAL_SKILLS = new Set([41, 52, 600, 601, 602, 603, 604, 614, 617, 628, 630, 631, 635, 638, 641]);
const OPENAI_GUIDE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    intent: {
      type: "string",
      enum: ["status", "map", "npc", "quest", "battle", "inventory", "pet", "refuse", "other"]
    },
    nextStep: { type: "string" },
    confidence: { type: "number" }
  },
  required: ["reply", "intent", "nextStep", "confidence"],
  additionalProperties: false
};
const OPENAI_NPC_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    intent: {
      type: "string",
      enum: ["chat", "quest", "trade", "heal", "save", "warp", "battle", "discount", "gift", "noEncounter", "negotiatePass", "conditionOverride", "mapInfo", "refuse"]
    },
    action: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["none", "warp", "teleportInfo", "noEncounter", "shopDiscount", "offMenuItem", "negotiatePass", "roleFavor", "conditionOverride"]
        },
        text: { type: "string" },
        seconds: { type: "integer" },
        percent: { type: "integer" },
        reason: { type: "string" }
      },
      required: ["type", "text", "seconds", "percent", "reason"],
      additionalProperties: false
    },
    confidence: { type: "number" }
  },
  required: ["reply", "intent", "action", "confidence"],
  additionalProperties: false
};

let cache;
let charId = 0;
let tileMetaPromise = null;
const collisionCache = new Map();
const REALTIME_ROOM_PLAYER_LIMIT = 80;
const REALTIME_PRESENCE_TTL_MS = 45_000;
const REALTIME_NAME_LIMIT = 24;
const REALTIME_CHAT_LIMIT = 180;

class UserFacingError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "UserFacingError";
    this.status = status;
  }
}

function userError(message, status = 400) {
  return new UserFacingError(message, status);
}

export class MapRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
    this.players = new Map();
    this.nextSessionId = 1;
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return realtimeJson({ error: "websocket required" }, 426);
    }
    if (this.sessions.size >= REALTIME_ROOM_PLAYER_LIMIT) {
      return realtimeJson({ error: "map room full" }, 503);
    }
    const url = new URL(request.url);
    const roomId = sanitizeRealtimeMapId(url.pathname.split("/").filter(Boolean).pop() || url.searchParams.get("mapId"));
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const session = {
      id: "",
      key: `s${Date.now().toString(36)}${this.nextSessionId++}`,
      roomId,
      lastSeen: Date.now()
    };
    server.accept();
    this.sessions.set(server, session);
    server.addEventListener("message", (event) => this.onMessage(server, event.data));
    server.addEventListener("close", () => this.close(server));
    server.addEventListener("error", () => this.close(server));
    this.send(server, { type: "hello", roomId, players: this.livePlayers(roomId) });
    return new Response(null, { status: 101, webSocket: client });
  }

  onMessage(ws, raw) {
    const session = this.sessions.get(ws);
    if (!session) return;
    const message = parseRealtimeMessage(raw);
    if (!message) {
      this.send(ws, { type: "error", message: "bad-json" });
      return;
    }
    session.lastSeen = Date.now();
    if (message.type === "ping") {
      this.send(ws, { type: "pong", at: session.lastSeen });
      return;
    }
    if (message.type === "chat") {
      const text = sanitizeRealtimeText(message.text, REALTIME_CHAT_LIMIT);
      if (!text) return;
      this.broadcast(session.roomId, {
        type: "chat",
        playerId: session.id,
        name: sanitizeRealtimeText(message.name, REALTIME_NAME_LIMIT),
        text,
        timestamp: session.lastSeen
      });
      return;
    }
    if (message.type !== "join" && message.type !== "move") {
      this.send(ws, { type: "error", message: "unsupported-type" });
      return;
    }
    const player = sanitizeRealtimePlayer(message.player || message, session.roomId, session.lastSeen);
    if (!player.id) {
      this.send(ws, { type: "error", message: "missing-player-id" });
      return;
    }
    session.id = player.id;
    session.roomId = player.mapId;
    this.players.set(session.key, { ...player, sessionKey: session.key, updatedAt: session.lastSeen });
    this.broadcast(session.roomId, { type: message.type === "join" ? "presence" : "move", player });
    if (message.type === "join") {
      this.send(ws, { type: "snapshot", roomId: session.roomId, players: this.livePlayers(session.roomId) });
    }
  }

  close(ws) {
    const session = this.sessions.get(ws);
    if (!session) return;
    this.sessions.delete(ws);
    this.players.delete(session.key);
    if (session.id) {
      this.broadcast(session.roomId, {
        type: "leave",
        playerId: session.id,
        sessionKey: session.key,
        timestamp: Date.now()
      });
    }
  }

  livePlayers(roomId) {
    const now = Date.now();
    const players = [];
    for (const [key, player] of this.players.entries()) {
      if (now - Number(player.updatedAt || 0) > REALTIME_PRESENCE_TTL_MS) {
        this.players.delete(key);
        continue;
      }
      if (player.mapId === roomId) players.push(stripRealtimePrivateFields(player));
    }
    return players;
  }

  broadcast(roomId, payload) {
    for (const [ws, session] of this.sessions.entries()) {
      if (session.roomId !== roomId) continue;
      this.send(ws, payload);
    }
  }

  send(ws, payload) {
    try {
      ws.send(JSON.stringify(payload));
    } catch {
      this.close(ws);
    }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/realtime/map/")) {
      return handleMapRoomSocket(request, env, url);
    }
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }
    return env.ASSETS.fetch(request);
  }
};

function handleMapRoomSocket(request, env, url) {
  if (!env.MAP_ROOMS) return realtimeJson({ error: "map room binding missing" }, 503);
  const mapId = sanitizeRealtimeMapId(url.pathname.split("/").filter(Boolean).pop() || url.searchParams.get("mapId"));
  const id = env.MAP_ROOMS.idFromName(`map:${mapId}`);
  return env.MAP_ROOMS.get(id).fetch(request);
}

function parseRealtimeMessage(raw) {
  try {
    if (typeof raw === "string") return JSON.parse(raw);
    if (raw instanceof ArrayBuffer) return JSON.parse(new TextDecoder().decode(raw));
    return JSON.parse(String(raw || "{}"));
  } catch {
    return null;
  }
}

function sanitizeRealtimePlayer(raw, roomId, now = Date.now()) {
  const id = sanitizeRealtimeText(raw?.id || raw?.playerId, 80).replace(/[^\w:.-]/g, "").slice(0, 80);
  const mapId = sanitizeRealtimeMapId(roomId || raw?.mapId);
  return {
    id,
    name: sanitizeRealtimeText(raw?.name, REALTIME_NAME_LIMIT) || "玩家",
    mapId,
    x: clampRealtimeInt(raw?.x, 0, 9999, 0),
    y: clampRealtimeInt(raw?.y, 0, 9999, 0),
    dir: clampRealtimeInt(raw?.dir, 0, 7, 5),
    timestamp: clampRealtimeInt(raw?.timestamp, 0, now, now)
  };
}

function stripRealtimePrivateFields(player) {
  const { sessionKey, updatedAt, ...publicPlayer } = player;
  return publicPlayer;
}

function sanitizeRealtimeMapId(value) {
  const text = sanitizeRealtimeText(value, 48).replace(/[^\w:.-]/g, "");
  return text || "unknown";
}

function sanitizeRealtimeText(value, max = 80) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function clampRealtimeInt(value, min, max, fallback) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function realtimeJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*"
    }
  });
}

async function handleApi(request, env, url) {
  try {
    if (request.method === "OPTIONS") return json({});
    if (url.pathname === "/api/data/search" && request.method === "POST") {
      const body = await readJson(request);
      return json(await searchData(env, request, String(body.q || "").trim()));
    }
    if (url.pathname === "/api/game/new" && request.method === "POST") {
      const body = await readJson(request);
      return json(await createPlayerGame(env, request, body));
    }
    if (url.pathname === "/api/game/sync" && request.method === "POST") {
      const body = await readJson(request);
      await loadGameData(env, request);
      return json(withMap(normalizeGame(body.game)));
    }
    if (url.pathname === "/api/game/travel" && request.method === "POST") {
      const body = await readJson(request);
      return json(travelGame(body.game, String(body.to || "")));
    }
    if (url.pathname === "/api/game/walk" && request.method === "POST") {
      const body = await readJson(request);
      return json(await walkGame(env, request, body.game, Number(body.dx) || 0, Number(body.dy) || 0));
    }
    if (url.pathname === "/api/game/turn" && request.method === "POST") {
      const body = await readJson(request);
      return json(turnGame(body.game, body));
    }
    if (url.pathname === "/api/game/route" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeGame(env, request, body.game, Number(body.targetX), Number(body.targetY)));
    }
    if (url.pathname === "/api/game/route-npc" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeNpcGame(env, request, body.game, String(body.npcId || ""), Number(body.targetX), Number(body.targetY)));
    }
    if (url.pathname === "/api/game/route-exit" && request.method === "POST") {
      const body = await readJson(request);
      return json(await routeExitGame(env, request, body.game, String(body.exitId || ""), Number(body.targetX), Number(body.targetY)));
    }
    if (url.pathname === "/api/game/paid-jump" && request.method === "POST") {
      const body = await readJson(request);
      return json(await paidJumpGame(env, request, body.game, String(body.kind || ""), String(body.id || ""), Number(body.targetX), Number(body.targetY)));
    }
    if (url.pathname === "/api/game/return-savepoint" && request.method === "POST") {
      const body = await readJson(request);
      return json(returnSavePointGame(body.game));
    }
    if (url.pathname === "/api/game/talk" && request.method === "POST") {
      const body = await readJson(request);
      return json(await talkGame(env, request, body.game, String(body.npcId || "")));
    }
    if (url.pathname === "/api/game/dialog" && request.method === "POST") {
      const body = await readJson(request);
      return json(await dialogGame(env, request, body.game, String(body.npcId || ""), String(body.message || "")));
    }
    if (url.pathname === "/api/game/dialog-proposal" && request.method === "POST") {
      const body = await readJson(request);
      return json(await dialogProposalGame(
        env,
        request,
        body.game,
        String(body.npcId || ""),
        String(body.proposalId || ""),
        String(body.decision || ""),
        Number(body.selectedPetIndex)
      ));
    }
    if (url.pathname === "/api/game/dialog-ai" && request.method === "POST") {
      const body = await readJson(request);
      return json(dialogAiModeGame(body.game, String(body.npcId || ""), Boolean(body.enabled)));
    }
    if (url.pathname === "/api/game/buy" && request.method === "POST") {
      const body = await readJson(request);
      return json(buyGame(body.game, String(body.npcId || ""), Number(body.itemId)));
    }
    if (url.pathname === "/api/game/sell" && request.method === "POST") {
      const body = await readJson(request);
      return json(sellGame(body.game, String(body.npcId || ""), Number(body.itemId), Number(body.qty) || 1));
    }
    if (url.pathname === "/api/game/learn-pet-skill" && request.method === "POST") {
      const body = await readJson(request);
      return json(await learnPetSkillGame(
        env,
        request,
        body.game,
        String(body.npcId || ""),
        Number(body.skillId),
        Number(body.petIndex),
        Number(body.slotIndex)
      ));
    }
    if (url.pathname === "/api/game/learn-profession-skill" && request.method === "POST") {
      const body = await readJson(request);
      return json(learnProfessionSkillGame(
        body.game,
        String(body.npcId || ""),
        Number(body.skillId)
      ));
    }
    if (url.pathname === "/api/game/pool-pet" && request.method === "POST") {
      const body = await readJson(request);
      return json(poolPetGame(
        body.game,
        String(body.npcId || ""),
        String(body.action || ""),
        Number(body.petIndex),
        Number(body.poolIndex)
      ));
    }
    if (url.pathname === "/api/game/pet-fusion" && request.method === "POST") {
      const body = await readJson(request);
      return json(await petFusionGame(
        env,
        request,
        body.game,
        String(body.npcId || ""),
        Number(body.mainIndex),
        Number(body.subIndex1),
        Number(body.subIndex2)
      ));
    }
    if (url.pathname === "/api/game/pool-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(poolItemGame(
        body.game,
        String(body.npcId || ""),
        String(body.action || ""),
        Number(body.itemId),
        Number(body.poolIndex)
      ));
    }
    if (url.pathname === "/api/game/change-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(changeItemGame(body.game, String(body.npcId || ""), Number(body.recipeIndex)));
    }
    if (url.pathname === "/api/game/use-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(await useItemGame(env, request, body.game, Number(body.itemId)));
    }
    if (url.pathname === "/api/game/equip-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(await equipItemGame(env, request, body.game, Number(body.itemId)));
    }
    if (url.pathname === "/api/game/unequip-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(unequipItemGame(body.game, String(body.slot || "")));
    }
    if (url.pathname === "/api/game/drop-item" && request.method === "POST") {
      const body = await readJson(request);
      return json(dropItemGame(body.game, Number(body.itemId), Number(body.qty) || 1));
    }
    if (url.pathname === "/api/game/encounter" && request.method === "POST") {
      const body = await readJson(request);
      return json(await encounterGame(env, request, body.game));
    }
    if (url.pathname === "/api/game/capture" && request.method === "POST") {
      const body = await readJson(request);
      return json(captureGame(body.game));
    }
    if (url.pathname === "/api/game/battle" && request.method === "POST") {
      const body = await readJson(request);
      return json(await battleGame(env, request, body.game, String(body.action || "attack")));
    }
    if (url.pathname === "/api/game/train" && request.method === "POST") {
      const body = await readJson(request);
      return json(trainGame(body.game, Number(body.petIndex) || 0));
    }
    if (url.pathname === "/api/game/allocate-point" && request.method === "POST") {
      const body = await readJson(request);
      return json(allocatePlayerPointGame(body.game, String(body.stat || ""), Number(body.qty) || 1));
    }
    if (url.pathname === "/api/game/rest" && request.method === "POST") {
      const body = await readJson(request);
      return json(restGame(body.game));
    }
    if (url.pathname === "/api/game/pet-mode" && request.method === "POST") {
      const body = await readJson(request);
      return json(petModeGame(body.game, Number(body.petIndex) || 0, String(body.mode || "active")));
    }
    if (url.pathname === "/api/game/pet-release" && request.method === "POST") {
      const body = await readJson(request);
      return json(releasePetGame(body.game, body.petIndex));
    }
    if (url.pathname === "/api/ai/guide" && request.method === "POST") {
      const body = await readJson(request);
      return json(await guideGame(env, request, body.game, String(body.prompt || "")));
    }
    if (url.pathname === "/api/ai/workspace" && request.method === "POST") {
      const body = await readJson(request);
      await loadGameData(env, request);
      const game = normalizeGame(body.game);
      return json({
        workspace: buildAiWorkspace(env, game, String(body.prompt || "")),
        game: withMap(game)
      });
    }
    if (url.pathname === "/api/ai/workspace-note" && request.method === "POST") {
      const body = await readJson(request);
      await loadGameData(env, request);
      const game = normalizeGame(body.game);
      const note = writeAiWorkspaceNote(game, body.note || body);
      return json({
        note,
        workspace: buildAiWorkspace(env, game, String(body.prompt || note.title || "")),
        game: withMap(game)
      });
    }
    if (url.pathname === "/api/ai/status" && request.method === "GET") {
      return json(aiRuntimeStatus(env));
    }
    return json({ error: "not found" }, 404);
  } catch (error) {
    const status = Number.isFinite(error?.status) && error.status >= 400 && error.status <= 599
      ? error.status
      : 500;
    return json({ error: error.message || "server error" }, status);
  }
}

async function createPlayerGame(env, request, body) {
  const data = await loadGameData(env, request);
  const starterEnemy = createEnemy(data, Number(body.starterPet) || 100, 1) || createEnemy(data, pick(data.enemyNoList), 1);
  const starter = normalizeCapturedPet(starterEnemy);
  const name = String(body.name || "").trim().slice(0, 12) || "新来的原始人";
  const now = new Date().toISOString();
  const accountId = cleanAccountId(body.accountId) || `local-${crypto.randomUUID().slice(0, 8)}`;
  const startPoint = clampInt(body.startPoint ?? body.sp, 0, 3, 0);
  return withMap({
    id: crypto.randomUUID(),
    account: {
      id: accountId,
      name: "本地账号",
      activeSlot: 0,
      maxSlots: MAXCHAR_PER_USER,
      lock: null,
      source: "参考 SAAC char.c: id.slot.char"
    },
    character: {
      id: crypto.randomUUID(),
      slot: 0,
      name,
      createdAt: now,
      updatedAt: now,
      deleted: false
    },
    player: {
      name,
      level: 1,
      exp: 0,
      stone: 100,
      hp: 98,
      maxHp: 98,
      dir: DEFAULT_CHAR_DIR,
      Vital: 1600,
      Str: 1200,
      Tough: 1200,
      Dex: 1000,
      EarthAT: 50,
      WaterAT: 50,
      FireAT: 0,
      WindAT: 0,
      WorkFixVital: 16,
      WorkFixStr: 14,
      WorkFixTough: 14,
      WorkFixDex: 10,
      WorkFixLuck: 1,
      WorkMaxHp: 98,
      duelPoint: 0,
      Luck: 1,
      charm: PLAYER_INITIAL_CHARM,
      fame: 0,
      amPoint: 0,
      skillUpPoint: 0,
      professionClass: 0,
      transmigration: 0,
      professionSkillPoint: 0,
      professionSkills: [],
      killPetCount: 0,
      deadCount: 0,
      battleCount: 0,
      winCount: 0,
      loseCount: 0,
      startPoint,
      savePointMask: 1 << startPoint,
      LastTalkElder: startPoint,
      CHAR_LASTTALKELDER: startPoint
    },
    location: {
      mapId: WORLD.startMap,
      x: WORLD.maps[WORLD.startMap].spawn[0],
      y: WORLD.maps[WORLD.startMap].spawn[1],
      dir: DEFAULT_CHAR_DIR
    },
    pets: [starter],
    inventory: [{ id: "stone", name: "石币", qty: 100 }],
    quests: {},
    flags: createFlags(),
    effects: {},
    aiWorkspace: createAiWorkspace(now),
    aiNpcCache: normalizeAiNpcCache(),
    npcSocial: normalizeNpcSocial(),
    dialogAi: {},
    encounter: null,
    dialog: null,
    log: [`${name} 来到了 ${WORLD.maps[WORLD.startMap].name}。`]
  });
}

function travelGame(game, to) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const exit = findExit(map, to);
  if (!exit) throw new Error("这个出口不存在");
  return applyExit(game, exit);
}

function normalizeDir(dir) {
  const n = Number(dir);
  if (!Number.isFinite(n)) return DEFAULT_CHAR_DIR;
  const int = Math.trunc(n);
  return int >= 0 && int < SA_DIRECTION_DELTAS.length ? int : DEFAULT_CHAR_DIR;
}

function dirFromDelta(dx, dy, fallback = DEFAULT_CHAR_DIR) {
  const sx = Math.sign(Number(dx) || 0);
  const sy = Math.sign(Number(dy) || 0);
  const dir = SA_DIRECTION_DELTAS.findIndex(([x, y]) => x === sx && y === sy);
  return dir >= 0 ? dir : normalizeDir(fallback);
}

function deltaForDir(dir) {
  const [dx, dy] = SA_DIRECTION_DELTAS[normalizeDir(dir)];
  return { dx, dy };
}

function setCharacterDir(game, dir) {
  const next = normalizeDir(dir);
  game.player ||= {};
  game.location ||= {};
  game.player.dir = next;
  game.location.dir = next;
  return next;
}

async function walkGame(env, request, game, dx, dy) {
  game = normalizeGame(game);
  const map = currentMap(game);
  if (game.encounter) {
    ensureBattleState(game, activeBattleActor(game), game.encounter);
    return withMap(game);
  }
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const requestedDx = Math.sign(Number(dx) || 0);
  const requestedDy = Math.sign(Number(dy) || 0);
  if (requestedDx === 0 && requestedDy === 0) {
    const currentExit = exitAt(map, game.location.x, game.location.y);
    if (currentExit) return applyExit(game, currentExit);
    const currentClosedExit = closedExitAt(map, game.location.x, game.location.y);
    if (currentClosedExit) noteClosedExit(game, currentClosedExit);
    noteNearby(game, map);
    return withMap(game);
  }
  const dir = dirFromDelta(dx, dy, game.player?.dir ?? game.location?.dir);
  const delta = deltaForDir(dir);
  setCharacterDir(game, dir);
  const currentX = Number(game.location.x || 0);
  const currentY = Number(game.location.y || 0);
  const nextX = clampInt(currentX + delta.dx, 0, width - 1, game.location.x);
  const nextY = clampInt(currentY + delta.dy, 0, height - 1, game.location.y);
  const exit = exitAt(map, nextX, nextY);
  const closedExit = exit ? null : closedExitAt(map, nextX, nextY);
  const collision = await loadCollisionMap(env, request, map);
  if (!exit && !canStepTo(map, collision, currentX, currentY, nextX, nextY, delta.dx, delta.dy)) {
    noteBlockedMove(game, map, nextX, nextY);
    noteNearby(game, map);
    return withMap(game);
  }
  game.location = { ...game.location, x: nextX, y: nextY, dir };
  if (exit) return applyExit(game, exit);
  if (closedExit) noteClosedExit(game, closedExit);
  noteNearby(game, map);
  await maybeStepEncounter(env, request, game, map);
  return withMap(game);
}

function turnGame(game, body = {}) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const fallback = game.player?.dir ?? game.location?.dir;
  const hasExplicitDir = body.dir !== undefined && body.dir !== null && Number.isFinite(Number(body.dir));
  const dir = hasExplicitDir
    ? normalizeDir(Number(body.dir))
    : dirFromDelta(Number(body.dx) || 0, Number(body.dy) || 0, fallback);
  setCharacterDir(game, dir);
  noteNearby(game, map);
  return withMap(game);
}

async function routeGame(env, request, game, targetX, targetY) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  const target = {
    x: clampInt(targetX, 0, width - 1, from.x),
    y: clampInt(targetY, 0, height - 1, from.y)
  };
  if (from.x === target.x && from.y === target.y) {
    return { from, target, route: [], blocked: false, reason: "already-there" };
  }
  if (!canStandAt(map, collision, target.x, target.y)) {
    const approach = findBlockedTargetApproach(map, collision, from, target);
    if (approach) {
      return {
        from,
        target,
        standTarget: approach.target,
        face: faceTargetFrom(approach.target, target),
        route: approach.route,
        blocked: false,
        reason: "target-blocked-nearby"
      };
    }
    return { from, target, route: [], blocked: true, reason: "target-blocked" };
  }
  const route = findRoute(map, collision, from, target);
  return {
    from,
    target,
    route,
    blocked: route.length === 0,
    reason: route.length ? "ok" : "unreachable"
  };
}

function findBlockedTargetApproach(map, collision, from, target) {
  const candidates = [];
  const maxRadius = 3;
  for (let y = target.y - maxRadius; y <= target.y + maxRadius; y += 1) {
    for (let x = target.x - maxRadius; x <= target.x + maxRadius; x += 1) {
      if (x === target.x && y === target.y) continue;
      if (!canStandAt(map, collision, x, y)) continue;
      candidates.push({
        x,
        y,
        targetDistance: distance(x, y, target.x, target.y),
        fromDistance: routeHeuristic(from.x, from.y, x, y)
      });
    }
  }
  candidates.sort((a, b) => (
    a.targetDistance - b.targetDistance
    || a.fromDistance - b.fromDistance
    || a.y - b.y
    || a.x - b.x
  ));
  for (const candidate of candidates) {
    if (candidate.x === from.x && candidate.y === from.y) {
      return { target: { x: candidate.x, y: candidate.y }, route: [] };
    }
    const route = findRoute(map, collision, from, candidate);
    if (route.length) return { target: { x: candidate.x, y: candidate.y }, route };
  }
  return null;
}

function faceTargetFrom(from, target) {
  const dir = dirFromDelta(target.x - from.x, target.y - from.y, DEFAULT_CHAR_DIR);
  const { dx, dy } = deltaForDir(dir);
  return { dir, dx, dy, x: target.x, y: target.y };
}

async function routeNpcGame(env, request, game, npcId, preferredX = NaN, preferredY = NaN) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  const preferred = preferredRouteTile(preferredX, preferredY, width, height);
  if (distance(from.x, from.y, npc.x, npc.y) <= NPC_INTERACTION_RANGE) {
    return {
      from,
      target: from,
      route: [],
      blocked: false,
      reason: "already-near",
      npc: routeNpcSummary(npc)
    };
  }
  for (const target of npcApproachTargets(map, collision, npc, from, preferred)) {
    const route = findRoute(map, collision, from, target);
    if (route.length) {
      return {
        from,
        target,
        route,
        blocked: false,
        reason: "ok",
        npc: routeNpcSummary(npc)
      };
    }
  }
  return {
    from,
    target: null,
    route: [],
    blocked: true,
    reason: "unreachable-npc",
    npc: routeNpcSummary(npc)
  };
}

function npcApproachTargets(map, collision, npc, from, preferred = null) {
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const targets = [];
  const npcX = Number(npc.x);
  const npcY = Number(npc.y);
  for (let dy = -NPC_INTERACTION_RANGE; dy <= NPC_INTERACTION_RANGE; dy += 1) {
    for (let dx = -NPC_INTERACTION_RANGE; dx <= NPC_INTERACTION_RANGE; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const x = npcX + dx;
      const y = npcY + dy;
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const npcDistance = distance(x, y, npcX, npcY);
      if (npcDistance > NPC_INTERACTION_RANGE) continue;
      if (!canStandAt(map, collision, x, y)) continue;
      targets.push({
        x,
        y,
        npcDistance,
        distance: distance(from.x, from.y, x, y),
        preferredDistance: preferred ? distance(preferred.x, preferred.y, x, y) : 0
      });
    }
  }
  return targets.sort((a, b) => (
    a.preferredDistance - b.preferredDistance
    || a.distance - b.distance
    || a.npcDistance - b.npcDistance
    || a.y - b.y
    || a.x - b.x
  ));
}

function routeNpcSummary(npc) {
  return { id: npc.id, name: npc.name, x: npc.x, y: npc.y, type: npc.type };
}

async function routeExitGame(env, request, game, exitId, preferredX = NaN, preferredY = NaN) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const exit = findExit(map, exitId);
  if (!exit) {
    const closedExit = findClosedExit(map, exitId);
    if (closedExit) throw new Error(closedExitMessage(closedExit));
    throw new Error("这个出口不在当前地图");
  }
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  const preferred = preferredRouteTile(preferredX, preferredY, width, height);
  for (const target of exitRouteTargets(map, collision, exit, from, preferred)) {
    if (from.x === target.x && from.y === target.y) {
      return {
        from,
        target,
        route: [{ dx: 0, dy: 0, x: target.x, y: target.y }],
        blocked: false,
        reason: "already-at-exit",
        exit: routeExitSummary(exit, target)
      };
    }
    const route = findRoute(map, collision, from, target);
    if (route.length) {
      return {
        from,
        target,
        route,
        blocked: false,
        reason: "ok",
        exit: routeExitSummary(exit, target)
      };
    }
  }
  return {
    from,
    target: null,
    route: [],
    blocked: true,
    reason: "unreachable-exit",
    exit: routeExitSummary(exit)
  };
}

function exitRouteTargets(map, collision, exit, from, preferred = null) {
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const rawTiles = Array.isArray(exit.tiles) && exit.tiles.length
    ? exit.tiles
    : exitBoundsTiles(exit);
  const seen = new Set();
  return rawTiles
    .map((tile) => ({
      x: Number(tile.x),
      y: Number(tile.y),
      target: tile.target || exit.target,
      distance: distance(from.x, from.y, tile.x, tile.y),
      preferredDistance: preferred ? distance(preferred.x, preferred.y, tile.x, tile.y) : 0
    }))
    .filter((tile) => Number.isFinite(tile.x) && Number.isFinite(tile.y))
    .filter((tile) => tile.x >= 0 && tile.y >= 0 && tile.x < width && tile.y < height)
    .filter((tile) => {
      const key = routeKey(tile.x, tile.y);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter((tile) => canStandAt(map, collision, tile.x, tile.y))
    .sort((a, b) => a.preferredDistance - b.preferredDistance || a.distance - b.distance || a.y - b.y || a.x - b.x);
}

function preferredRouteTile(x, y, width, height) {
  if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return null;
  return {
    x: clampInt(x, 0, Math.max(0, width - 1), 0),
    y: clampInt(y, 0, Math.max(0, height - 1), 0)
  };
}

function exitBoundsTiles(exit) {
  const bounds = Array.isArray(exit.bounds) ? exit.bounds : [exit.x, exit.y, exit.x, exit.y];
  const minX = Math.min(Number(bounds[0]), Number(bounds[2]));
  const maxX = Math.max(Number(bounds[0]), Number(bounds[2]));
  const minY = Math.min(Number(bounds[1]), Number(bounds[3]));
  const maxY = Math.max(Number(bounds[1]), Number(bounds[3]));
  const tiles = [];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      tiles.push({ x, y, target: exit.target });
    }
  }
  return tiles;
}

function routeExitSummary(exit, target = null) {
  return {
    id: exit.id,
    label: exit.label,
    to: exit.to,
    x: target?.x ?? exit.x,
    y: target?.y ?? exit.y,
    target: target?.target || exit.target,
    source: exit.source
  };
}

async function paidJumpGame(env, request, game, kind, id, preferredX = NaN, preferredY = NaN) {
  game = normalizeGame(game);
  if (game.encounter || game.battle) throw userError("战斗中不能付费跳转");
  const map = currentMap(game);
  const collision = await loadCollisionMap(env, request, map);
  const width = collision?.width || Math.max(1, Number(map.size?.[0]) || 1);
  const height = collision?.height || Math.max(1, Number(map.size?.[1]) || 1);
  const from = {
    mapId: map.id,
    x: clampInt(game.location.x, 0, width - 1, 0),
    y: clampInt(game.location.y, 0, height - 1, 0)
  };
  const preferred = preferredRouteTile(preferredX, preferredY, width, height);
  const type = kind === "exit" ? "exit" : "npc";

  if (type === "exit") {
    const exit = findExit(map, id);
    if (!exit) {
      const closedExit = findClosedExit(map, id);
      if (closedExit) throw userError(closedExitMessage(closedExit));
      throw userError("这个出口不在当前地图");
    }
    const target = exitRouteTargets(map, collision, exit, from, preferred)[0];
    if (!target) throw userError(`无法定位 ${exit.label} 的入口。`);
    const jumpCost = paidJumpCost(distance(from.x, from.y, target.x, target.y));
    const warpPermissionState = exit.warp ? warpPermission(game, exit.warp) : null;
    if (warpPermissionState && !warpPermissionState.ok) {
      throw userError(`${exit.warp.payMessage || exit.warp.moneyMessage || "这个入口现在还不能通过。"} 条件：${exit.warp.free || "未满足"}`);
    }
    const extraCost = Number(warpPermissionState?.cost || 0);
    assertPaidJumpFunds(game, jumpCost + extraCost);
    chargePaidJump(game, jumpCost);
    game.location = { ...game.location, x: target.x, y: target.y };
    game.dialog = null;
    game.paidJump = paidJumpSummary(type, exit.label, from, { mapId: map.id, x: target.x, y: target.y }, jumpCost);
    addLog(game, `付费跳转花费 ${jumpCost} 石币，抵达「${exit.label}」入口。`);
    return applyExit(game, {
      ...exit,
      x: target.x,
      y: target.y,
      target: target.target || exit.target,
      sourceTile: { x: target.x, y: target.y, target: target.target || exit.target }
    });
  }

  const npc = map.npcs.find((item) => item.id === id);
  if (!npc) throw userError("这个 NPC 不在当前地图");
  const target = distance(from.x, from.y, npc.x, npc.y) <= NPC_INTERACTION_RANGE
    ? { x: from.x, y: from.y }
    : npcApproachTargets(map, collision, npc, from, preferred)[0];
  if (!target) throw userError(`无法定位 ${npc.name} 附近的可站立位置。`);
  const jumpCost = paidJumpCost(distance(from.x, from.y, target.x, target.y));
  assertPaidJumpFunds(game, jumpCost);
  chargePaidJump(game, jumpCost);
  game.location = { ...game.location, x: target.x, y: target.y };
  game.dialog = null;
  setCharacterDir(game, dirFromDelta(Number(npc.x) - target.x, Number(npc.y) - target.y, game.player?.dir ?? game.location?.dir));
  game.walk = { steps: 0, encounterSteps: 0 };
  game.paidJump = paidJumpSummary(type, npc.name, from, { mapId: map.id, x: target.x, y: target.y }, jumpCost);
  addLog(game, jumpCost > 0
    ? `付费跳转花费 ${jumpCost} 石币，来到 ${npc.name} 附近。`
    : `你已经在 ${npc.name} 附近。`);
  noteNearby(game, map);
  return withMap(game, { npc: routeNpcSummary(npc) });
}

function paidJumpCost(stepDistance) {
  const steps = Math.max(0, Math.trunc(Number(stepDistance) || 0));
  if (steps <= 0) return 0;
  const first = Math.min(steps, PAID_JUMP_FIRST_TIER_STEPS);
  const second = Math.min(Math.max(steps - PAID_JUMP_FIRST_TIER_STEPS, 0), PAID_JUMP_SECOND_TIER_STEPS - PAID_JUMP_FIRST_TIER_STEPS);
  const third = Math.max(steps - PAID_JUMP_SECOND_TIER_STEPS, 0);
  return PAID_JUMP_BASE_COST
    + first * PAID_JUMP_FIRST_TIER_COST
    + second * PAID_JUMP_SECOND_TIER_COST
    + third * PAID_JUMP_THIRD_TIER_COST;
}

function assertPaidJumpFunds(game, cost) {
  if (Number(game.player?.stone || 0) < cost) {
    throw userError(`石币不够：付费跳转需要 ${cost} 石币。`);
  }
}

function chargePaidJump(game, cost) {
  if (cost <= 0) return;
  game.player.stone = Number(game.player.stone || 0) - cost;
  syncStoneItem(game);
}

function paidJumpSummary(kind, label, from, to, cost) {
  return {
    kind,
    label,
    from,
    to,
    cost,
    source: "worker deterministic paid jump",
    at: new Date().toISOString()
  };
}

function assertNpcInteractionRange(game, npc, range = NPC_INTERACTION_RANGE, action = "和 NPC 对话") {
  const currentDistance = distance(game.location.x, game.location.y, npc.x, npc.y);
  if (currentDistance <= range) return;
  throw new Error(`请先走近 ${npc.name} 再${action}。当前位置距离 ${currentDistance} 格，原版 NPC 交互需要靠近。`);
}

function findExit(map, id) {
  return (map.exits || []).find((item) => item.id === id || item.to === id);
}

function findClosedExit(map, id) {
  return (map.profileClosedExits || []).find((item) => item.id === id || item.to === id);
}

function closedExitMessage(exit) {
  return `这个入口通往 ${exit.toName || exit.to || "未开放地图"}，当前内容 profile 暂未开放。`;
}

function closedExitSummary(exit) {
  return {
    id: exit.id,
    label: exit.label,
    detail: exit.detail,
    to: exit.to,
    toName: exit.toName,
    x: exit.x,
    y: exit.y,
    bounds: exit.bounds,
    source: exit.source,
    status: exit.status,
    reason: exit.reason
  };
}

function closedExitAt(map, x, y) {
  for (const exit of map.profileClosedExits || []) {
    const tile = (exit.tiles || []).find((item) => Number(item.x) === x && Number(item.y) === y);
    if (tile) {
      return {
        ...exit,
        x: tile.x,
        y: tile.y,
        target: tile.target,
        sourceTile: { x: tile.x, y: tile.y, target: tile.target }
      };
    }
    if (Array.isArray(exit.tiles) && exit.tiles.length) continue;
    const bounds = Array.isArray(exit.bounds) ? exit.bounds : [exit.x, exit.y, exit.x, exit.y];
    if (x >= bounds[0] && y >= bounds[1] && x <= bounds[2] && y <= bounds[3]) return exit;
  }
  return null;
}

function exitAt(map, x, y) {
  for (const exit of map.exits || []) {
    const tile = (exit.tiles || []).find((item) => Number(item.x) === x && Number(item.y) === y);
    if (tile) {
      return {
        ...exit,
        x: tile.x,
        y: tile.y,
        target: tile.target,
        sourceTile: { x: tile.x, y: tile.y, target: tile.target }
      };
    }
    if (Array.isArray(exit.tiles) && exit.tiles.length) continue;
    const bounds = Array.isArray(exit.bounds) ? exit.bounds : [exit.x, exit.y, exit.x, exit.y];
    if (x >= bounds[0] && y >= bounds[1] && x <= bounds[2] && y <= bounds[3]) return exit;
  }
  return null;
}

function noteBlockedMove(game, map, x, y) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  const key = `${map.id}:${x}:${y}`;
  if (game.walk.blockedKey === key) return;
  game.walk.blockedKey = key;
  addLog(game, `前方 (${x},${y}) 被地形或 NPC 挡住，无法通行。`);
}

async function loadCollisionMap(env, request, map) {
  const path = map.clientMapFile || map.mapFile;
  if (!path) return null;
  if (collisionCache.has(path)) return collisionCache.get(path);
  const [buf, tileMeta] = await Promise.all([
    assetBuffer(env, request, path),
    loadTileMeta(env, request)
  ]);
  const collision = map.clientMapFile
    ? buildClientDatCollision(buf, tileMeta, path)
    : buildLs2Collision(buf, tileMeta, path);
  collisionCache.set(path, collision);
  return collision;
}

async function loadTileMeta(env, request) {
  tileMetaPromise ||= assetJson(env, request, "/data/client-tiles/tiles.json");
  return tileMetaPromise;
}

function buildClientDatCollision(buf, tileMeta, source) {
  const view = new DataView(buf);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const layerSize = width * height * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.byteLength < expected) throw new Error(`invalid client map: ${source}`);
  return buildCollisionFromLayers(width, height, tileMeta, (index) => {
    const tileOffset = 8 + index * 2;
    const partsOffset = 8 + layerSize + index * 2;
    const eventOffset = 8 + layerSize * 2 + index * 2;
    return [
      view.getUint16(tileOffset, true),
      view.getUint16(partsOffset, true),
      view.getUint16(eventOffset, true)
    ];
  }, `${source} client DAT hitMap`);
}

function buildLs2Collision(buf, tileMeta, source) {
  const bytes = new Uint8Array(buf, 0, Math.min(6, buf.byteLength));
  const magic = String.fromCharCode(...bytes);
  if (magic !== "LS2MAP") throw new Error(`invalid LS2MAP: ${source}`);
  const view = new DataView(buf);
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
  const objectLayer = 44 + width * height * 2;
  return buildCollisionFromLayers(width, height, tileMeta, (index) => [
    view.getUint16(44 + index * 2, false),
    objectLayer + index * 2 + 1 < buf.byteLength ? view.getUint16(objectLayer + index * 2, false) : 0,
    0
  ], `${source} LS2MAP hitMap`);
}

function buildCollisionFromLayers(width, height, tileMeta, tileAt, source) {
  const hitMap = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const [ground, parts, event] = tileAt(index);
      applyGroundCollision(hitMap, width, height, x, y, ground, tileMeta);
      applyPartsCollision(hitMap, width, height, x, y, parts, tileMeta);
      if ((event & 0x0fff) === EVENT_NPC) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    }
  }
  return { width, height, hitMap, source };
}

function applyGroundCollision(hitMap, width, height, x, y, tileId, tileMeta) {
  if (tileId > CG_INVISIBLE) {
    const frame = tileMeta.frames?.[tileId];
    if (!frame) return;
    const hit = Number(frame.hit || 0);
    if (hit === 0) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    else if (hit === 2) markHit(hitMap, width, height, x, y, MAP_SPECIAL);
    return;
  }
  applyControlTileCollision(hitMap, width, height, x, y, tileId);
}

function applyPartsCollision(hitMap, width, height, x, y, tileId, tileMeta) {
  if (tileId > CG_INVISIBLE) {
    const frame = tileMeta.frames?.[tileId];
    if (!frame) return;
    const hit = Number(frame.hit || 0);
    const hitX = Math.max(1, Number(frame.hitX || 1));
    const hitY = Math.max(1, Number(frame.hitY || 1));
    if (hit === 0 || hit === 2) {
      for (let ky = 0; ky < hitY; ky += 1) {
        for (let kx = 0; kx < hitX; kx += 1) {
          markHit(hitMap, width, height, x + kx, y - ky, hit === 2 ? MAP_SPECIAL : MAP_BLOCKED);
        }
      }
    } else if (hit === 1 && tileId >= 15680 && tileId <= 15732) {
      markHit(hitMap, width, height, x, y, MAP_BLOCKED);
    }
    return;
  }
  applyControlTileCollision(hitMap, width, height, x, y, tileId);
}

function applyControlTileCollision(hitMap, width, height, x, y, tileId) {
  if ([1, 2, 5, 6, 9, 10].includes(tileId)) markHit(hitMap, width, height, x, y, MAP_BLOCKED);
  else if (tileId === 4) markHit(hitMap, width, height, x, y, MAP_SPECIAL);
}

function markHit(hitMap, width, height, x, y, value) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = y * width + x;
  if (value === MAP_SPECIAL) {
    hitMap[index] = MAP_SPECIAL;
  } else if (hitMap[index] !== MAP_SPECIAL) {
    hitMap[index] = MAP_BLOCKED;
  }
}

function canStandAt(map, collision, x, y) {
  if (!collision || x < 0 || y < 0 || x >= collision.width || y >= collision.height) return false;
  if (exitAt(map, x, y)) return true;
  if (map.npcs.some((npc) => Number(npc.x) === x && Number(npc.y) === y)) return false;
  return collision.hitMap[y * collision.width + x] !== MAP_BLOCKED;
}

function canStepTo(map, collision, fromX, fromY, toX, toY, dx, dy) {
  if (!canStandAt(map, collision, toX, toY)) return false;
  if (dx !== 0 && dy !== 0) {
    const sideX = canStandAt(map, collision, fromX + dx, fromY);
    const sideY = canStandAt(map, collision, fromX, fromY + dy);
    if (!sideX || !sideY) return false;
  }
  return true;
}

function findRoute(map, collision, from, target) {
  const startKey = routeKey(from.x, from.y);
  const targetKey = routeKey(target.x, target.y);
  const open = new RouteMinHeap();
  open.push({
    x: from.x,
    y: from.y,
    key: startKey,
    g: 0,
    f: routeHeuristic(from.x, from.y, target.x, target.y)
  });
  const best = new Map([[startKey, 0]]);
  const cameFrom = new Map();
  const moves = routeMoves();
  let visits = 0;

  while (open.length && visits < ROUTE_MAX_VISITS) {
    const current = open.pop();
    if (current.g !== best.get(current.key)) continue;
    if (current.key === targetKey) return reconstructRoute(cameFrom, current.key);
    if (current.g >= ROUTE_MAX_STEPS) continue;
    visits += 1;

    for (const move of moves) {
      const nx = current.x + move.dx;
      const ny = current.y + move.dy;
      if (!canStepTo(map, collision, current.x, current.y, nx, ny, move.dx, move.dy)) continue;
      const key = routeKey(nx, ny);
      const nextG = current.g + 1;
      if (nextG >= (best.get(key) ?? Infinity)) continue;
      best.set(key, nextG);
      cameFrom.set(key, { prev: current.key, dx: move.dx, dy: move.dy, x: nx, y: ny });
      open.push({
        x: nx,
        y: ny,
        key,
        g: nextG,
        f: nextG + routeHeuristic(nx, ny, target.x, target.y)
      });
    }
  }
  return [];
}

class RouteMinHeap {
  constructor() {
    this.items = [];
  }

  get length() {
    return this.items.length;
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    const first = this.items[0];
    const last = this.items.pop();
    if (this.items.length && last) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return first;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (routeHeapCompare(this.items[parent], this.items[index]) <= 0) break;
      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  sinkDown(index) {
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let best = index;
      if (left < this.items.length && routeHeapCompare(this.items[left], this.items[best]) < 0) best = left;
      if (right < this.items.length && routeHeapCompare(this.items[right], this.items[best]) < 0) best = right;
      if (best === index) break;
      [this.items[index], this.items[best]] = [this.items[best], this.items[index]];
      index = best;
    }
  }
}

function routeHeapCompare(a, b) {
  return a.f - b.f || a.g - b.g || a.y - b.y || a.x - b.x;
}

function reconstructRoute(cameFrom, key) {
  const route = [];
  while (cameFrom.has(key)) {
    const step = cameFrom.get(key);
    route.push({ dx: step.dx, dy: step.dy, x: step.x, y: step.y });
    key = step.prev;
  }
  return route.reverse();
}

function routeMoves() {
  return SA_DIRECTION_DELTAS.map(([dx, dy]) => ({ dx, dy }));
}

function routeHeuristic(x, y, targetX, targetY) {
  return Math.max(Math.abs(targetX - x), Math.abs(targetY - y));
}

function routeKey(x, y) {
  return `${x},${y}`;
}

function noteNearby(game, map) {
  const nearby = nearbyState(game, map);
  const key = [
    game.location.mapId,
    game.location.x,
    game.location.y,
    nearby.npcs.map((npc) => npc.id).join(","),
    nearby.exits.map((exit) => exit.id).join(","),
    nearby.closedExits.map((exit) => exit.id).join(",")
  ].join(":");
  if (game.lastNearbyKey === key) return;
  game.lastNearbyKey = key;
  const parts = [];
  if (nearby.npcs.length) parts.push(`附近 NPC：${nearby.npcs.map((npc) => npc.name).join("、")}`);
  if (nearby.exits.length) parts.push(`附近出口：${nearby.exits.map((exit) => exit.label).join("、")}`);
  if (nearby.closedExits.length) parts.push(`暂未开放入口：${nearby.closedExits.map((exit) => exit.label).join("、")}`);
  if (parts.length) addLog(game, parts.join("；"));
}

function noteClosedExit(game, exit) {
  const key = `${game.location.mapId}:${exit.id}:${game.location.x}:${game.location.y}`;
  if (game.lastClosedExitKey === key) return;
  game.lastClosedExitKey = key;
  addLog(game, closedExitMessage(exit));
}

function applyExit(game, exit) {
  const from = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  const dir = normalizeDir(game.player?.dir ?? game.location?.dir);
  const now = new Date().toISOString();
  const to = { mapId: exit.to, x: exit.target[0], y: exit.target[1] };
  const permission = exit.warp ? warpPermission(game, exit.warp) : null;
  if (permission && !permission.ok) {
    const line = exit.warp.payMessage || exit.warp.moneyMessage || `这个入口现在还不能通过。`;
    addLog(game, `${line} 条件：${exit.warp.free || "未满足"}`);
    return withMap(game);
  }
  if (permission?.cost > 0) {
    if (Number(game.player.stone || 0) < permission.cost) {
      addLog(game, exit.warp.moneyMessage || `这个入口需要 ${permission.cost} 石币，你现在的石币不够。`);
      return withMap(game);
    }
    game.player.stone = Number(game.player.stone || 0) - permission.cost;
    syncStoneItem(game);
  }
  const consumed = permission?.free ? consumeWarpItems(game, exit.warp) : [];
  game.location = { ...to, dir };
  const elderEvent = applyWarpLastTalkElder(game, mapWarpEventActor(exit), exit.warp, "source-mapwarp-setlasttalkelder");
  setCharacterDir(game, dir);
  game.encounter = null;
  game.battle = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  game.lastWarp = {
    kind: "mapwarp",
    exitId: exit.id,
    label: exit.label,
    from,
    sourceTile: exit.sourceTile || { x: exit.x, y: exit.y, target: exit.target },
    to,
    source: exit.source,
    ...(elderEvent?.ok ? { lastTalkElder: elderEvent.detail?.sourceId } : {}),
    warpedAt: now
  };
  game.transition = warpTransition("mapwarp", exit.label, from, to, exit.source, now);
  game.character ||= {};
  game.character.updatedAt = now;
  const ticket = consumed.length ? `消耗 ${consumed.join("、")}，` : "";
  const paid = permission?.cost > 0 ? `花费 ${permission.cost} 石币，` : "";
  const elderLine = elderEvent?.ok ? `记录点标记 LASTTALKELDER=${elderEvent.detail?.sourceId}。` : "";
  addLog(game, `${ticket}${paid}你通过「${exit.label}」来到 ${WORLD.maps[exit.to].name}。${elderLine}`);
  updateQuestProgress(game, "enterMap", { mapId: exit.to });
  return withMap(game);
}

function applyWarpTarget(game, target, label) {
  const targetMap = WORLD.maps[String(target.mapId)];
  if (!targetMap) throw new Error("目标地图尚未加载");
  const from = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  const dir = normalizeDir(game.player?.dir ?? game.location?.dir);
  const now = new Date().toISOString();
  const width = Math.max(1, Number(targetMap.size?.[0]) || 1);
  const height = Math.max(1, Number(targetMap.size?.[1]) || 1);
  const x = clampInt(target.x, 0, width - 1, 0);
  const y = clampInt(target.y, 0, height - 1, 0);
  game.location = { mapId: targetMap.id, x, y, dir };
  setCharacterDir(game, dir);
  game.encounter = null;
  game.battle = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  game.lastWarp = {
    kind: "npc-warp",
    label,
    from,
    to: { mapId: targetMap.id, x, y },
    warpedAt: now
  };
  game.transition = warpTransition("npc-warp", label, from, game.lastWarp.to, target.source || "npc warp", now);
  game.character ||= {};
  game.character.updatedAt = game.lastWarp.warpedAt;
  addLog(game, `你通过「${label}」来到 ${targetMap.name} (${x},${y})。`);
  updateQuestProgress(game, "enterMap", { mapId: targetMap.id });
  return targetMap;
}

function warpTransition(kind, label, from, to, source, at) {
  return {
    id: `${kind}:${from.mapId},${from.x},${from.y}->${to.mapId},${to.x},${to.y}:${at}`,
    type: "warp",
    kind,
    label,
    from,
    to,
    source,
    at
  };
}

function buyGame(game, npcId, itemId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作 NPC 窗口");
  if (!npc.trade?.items?.length) throw new Error("这个 NPC 没有商品资料");
  const item = availableTradeItems(game, npc).find((entry) => Number(entry.id) === Number(itemId));
  if (!item) throw new Error("商品不存在");
  const sourcePrice = Number(item.price || item.cost || 0);
  const discount = shopDiscountForNpc(game, npc);
  const price = discountedShopPrice(game, npc, item);
  const costFame = tradeItemCostFame(item, npc);
  const costPoint = tradeItemCostPoint(item, npc);
  if (Number(game.player.stone || 0) < price) throw new Error("石币不够");
  if (costFame > 0 && Number(game.player.fame || 0) < costFame) {
    throw new Error(`声望不足：需要 ${sourceFameDisplay(costFame)}，当前 ${sourceFameDisplay(game.player.fame || 0)}`);
  }
  if (costPoint > 0 && Number(game.player.amPoint || 0) < costPoint) {
    throw new Error(`点数不足：需要 ${sourcePointDisplay(costPoint)}，当前 ${sourcePointDisplay(game.player.amPoint || 0)}`);
  }
  if (!canCarryItem(game, item)) throw new Error(`背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具`);
  recordNpcVmEvent(game, npc, "shop", "ok", { action: "buy", itemId, itemName: item.name, price, sourcePrice, costFame, costPoint, discountPercent: discount?.percent || 0 });
  if (price > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: price, reason: "buy" });
    if (!taken.ok) throw new Error(taken.error || "石币不够");
  }
  if (costFame > 0) {
    const fameTaken = runNpcVmAction(game, npc, { type: "adjustFame", amount: -costFame, reason: "buy", source: npc.trade?.source || npc.source || "" });
    if (!fameTaken.ok) throw new Error(fameTaken.error || "声望不足");
  }
  if (costPoint > 0) {
    const pointTaken = runNpcVmAction(game, npc, { type: "adjustAmPoint", amount: -costPoint, reason: "buy", source: npc.trade?.source || npc.source || "" });
    if (!pointTaken.ok) throw new Error(pointTaken.error || "点数不足");
  }
  const given = runNpcVmAction(game, npc, { type: "give", item, itemId, itemName: item.name, qty: 1, reason: "buy" });
  if (!given.ok) throw new Error(given.error || "购买失败");
  const discountText = discount ? `（AI 协商 ${discount.percent}% 优待）` : "";
  const fameText = costFame > 0 ? `，消耗 ${sourceFameDisplay(costFame)}` : "";
  const pointText = costPoint > 0 ? `，消耗 ${sourcePointDisplay(costPoint)}` : "";
  addLog(game, `向 ${npc.name} 购买了 ${item.name}，花费 ${price} 石币${fameText}${pointText}${discountText}。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : []),
    npcMessage("system", `购买成功：${item.name} x1，花费 ${price} 石币${fameText}${pointText}${discountText}。`)
  ]);
  return withMap(game, { npc });
}

function sourceFameDisplay(value) {
  const raw = Math.max(0, Math.floor(Number(value) || 0));
  const points = raw / 100;
  return `${Number.isInteger(points) ? points : points.toFixed(2)} 声望`;
}

function sourcePointDisplay(value) {
  const raw = Math.max(0, Math.floor(Number(value) || 0));
  return `${raw} 点`;
}

const STONE_ONLY_TRADE_POINT_SOURCES = new Set([
  "gmsv-data/npc/scipt_plus/test2nd/c_can_mm"
]);

function normalizedTradeSource(source) {
  return String(source || "").replace(/^gmsv-data\//, "").replace(/^file:/, "");
}

function isStoneOnlyTradePointSource(npc) {
  const sources = [
    npc?.trade?.source,
    npc?.script,
    npc?.source
  ].map(normalizedTradeSource);
  return sources.some((source) => (
    source === "npc/scipt_plus/test2nd/c_can_mm"
    || source === "scipt_plus/test2nd/c_can_mm"
    || STONE_ONLY_TRADE_POINT_SOURCES.has(`gmsv-data/${source}`)
  ));
}

function tradeItemCostFame(item, npc = null) {
  return Math.max(0, Number(item?.costFame || 0));
}

function tradeItemCostPoint(item, npc = null) {
  const raw = Math.max(0, Number(item?.costPoint || 0));
  if (raw > 0 && npc && isStoneOnlyTradePointSource(npc)) return 0;
  return raw;
}

function sellGame(game, npcId, itemId, qty = 1) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作 NPC 窗口");
  if (!npc.trade?.items?.length) throw new Error("这个 NPC 没有商品资料");
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");
  const count = Math.max(1, Math.trunc(Number(qty) || 1));
  const sellQty = Math.min(count, Number(item.qty || 0));
  const unitPrice = sellItemPrice(npc, item);
  if (unitPrice <= 0) throw new Error("这个道具不能出售");
  const totalPrice = unitPrice * sellQty;
  const appliedSellRate = tradeSellRateForItem(npc, item);
  recordNpcVmEvent(game, npc, "shop", "ok", {
    action: "sell",
    itemId,
    itemName: item.name,
    qty: sellQty,
    unitPrice,
    price: totalPrice,
    sourcePrice: sourceItemPrice(item),
    sellRate: appliedSellRate,
    specialSellRate: isSpecialSellItem(npc, item) ? appliedSellRate : null
  });
  const taken = runNpcVmAction(game, npc, {
    type: "take",
    item,
    itemId,
    itemName: item.name,
    qty: sellQty,
    reason: "sell"
  });
  if (!taken.ok) throw new Error(taken.error || "出售失败");
  const paid = runNpcVmAction(game, npc, {
    type: "give",
    stone: totalPrice,
    reason: "sell"
  });
  if (!paid.ok) throw new Error(paid.error || "出售失败");
  addLog(game, `卖给 ${npc.name} ${item.name} x${sellQty}，获得 ${totalPrice} 石币。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : []),
    npcMessage("system", `出售成功：${item.name} x${sellQty}，获得 ${totalPrice} 石币。`)
  ]);
  return withMap(game, { npc });
}

function learnProfessionSkillGame(game, npcId, skillId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "学习职业技能");
  if (!isProfessionShopNpc(npc)) throw new Error("这个 NPC 没有职业技能训练资料");

  const state = buildProfessionShopState(game, npc);
  const selectedSkillId = Number(skillId);
  const skill = state?.skills?.find((entry) => Number(entry.id) === selectedSkillId);
  if (!skill) throw new Error("这个训练师不会教这个职业技能");
  if (!skill.learnable) throw new Error(skill.blockedReason || "现在还不能学习这个职业技能");

  if (Number(skill.cost || 0) > 0) {
    const paid = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: Number(skill.cost || 0), reason: "profession-skill" });
    if (!paid.ok) throw new Error(paid.error || "石币不够");
  }

  const learnedLevel = initialProfessionSkillLevel(selectedSkillId);
  const existingSkills = normalizeProfessionSkills(game.player.professionSkills);
  game.player.professionSkills = [
    ...existingSkills.filter((entry) => Number(entry.id) !== selectedSkillId),
    {
      id: selectedSkillId,
      name: skill.name,
      level: learnedLevel,
      percent: learnedLevel,
      classId: Number(skill.professionClass || 0),
      className: skill.professionClassName || professionClassName(skill.professionClass),
      costMp: Number(skill.costMp || 0),
      func: skill.func || "",
      source: skill.source || npc.professionShop?.source || ""
    }
  ].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
  game.player.professionSkillPoint = Math.max(0, Number(game.player.professionSkillPoint || 0) - 1);
  syncProfessionAliases(game.player);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "professionShop", "ok", {
    action: "learn",
    skillId: selectedSkillId,
    skillName: skill.name,
    cost: Number(skill.cost || 0),
    sourceCost: Number(skill.sourceCost || 0),
    skillRate: Number(state.skillRate || 1),
    professionClass: Number(skill.professionClass || 0),
    source: npc.professionShop?.source || npc.source || ""
  });
  addLog(game, `${npc.name} 教会你职业技能 ${skill.name}，花费 ${Number(skill.cost || 0)} 石币。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", `学会了 ${skill.name}，职业技能点剩余 ${Number(game.player.professionSkillPoint || 0)}。`)
  ], { professionShop: buildProfessionShopState(game, npc) });
  return withMap(game, { npc });
}

async function learnPetSkillGame(env, request, game, npcId, skillId, petIndex = NaN, slotIndex = NaN) {
  const data = await loadGameData(env, request);
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "学习宠物技能");
  if (!npc.petSkillShop?.skillIds?.length) throw new Error("这个 NPC 没有宠物技能训练资料");

  const selectedSkillId = Number(skillId);
  if (!npc.petSkillShop.skillIds.some((id) => Number(id) === selectedSkillId)) throw new Error("这个训练师不会教这个技能");
  const skill = data.skills.get(selectedSkillId);
  if (!skill) throw new Error("宠物技能资料未加载");

  const targetPetIndex = Number.isFinite(petIndex) ? exactPetIndex(game, petIndex) : getActivePetIndex(game);
  if (targetPetIndex < 0) throw new Error("需要先选择出战宠物");
  const pet = game.pets[targetPetIndex];
  if (!pet) throw new Error("没有找到这只宠物");

  const currentSkillIds = Array.from({ length: 7 }, (_, index) => Number(pet.PetSkillIds?.[index] || pet.PetSkills?.[index]?.Id || 0));
  if (currentSkillIds.includes(selectedSkillId)) throw new Error(`${pet.Name || "宠物"} 已经会 ${skill.Name}`);
  const requestedSlot = Math.trunc(Number(slotIndex));
  const teachSlot = Number.isFinite(requestedSlot) && requestedSlot >= 0 && requestedSlot < 7
    ? requestedSlot
    : currentSkillIds.findIndex((id) => !id);
  if (teachSlot < 0 || teachSlot >= 7) throw new Error("宠物技能栏已满，请先选择要覆盖的技能格");

  const skillRate = Number(npc.petSkillShop.skillRate || 1) || 1;
  const sourceCost = Math.max(0, Number(skill.Cost || 0));
  const cost = Math.max(0, Math.round(sourceCost * skillRate));
  if (cost > 0) {
    const paid = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "pet-skill" });
    if (!paid.ok) throw new Error(paid.error || "石币不够");
  }

  pet.PetSkillIds = Array.from({ length: 7 }, (_, index) => Number(pet.PetSkillIds?.[index] || pet.PetSkills?.[index]?.Id || 0));
  pet.PetSkills = Array.from({ length: 7 }, (_, index) => pet.PetSkills?.[index] || null);
  pet.PetSkillIds[teachSlot] = selectedSkillId;
  pet.PetSkills[teachSlot] = compactPetSkillForSave(skill);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "petSkillShop", "ok", {
    action: "teach",
    skillId: selectedSkillId,
    skillName: skill.Name,
    petIndex: targetPetIndex,
    petName: pet.Name || "",
    slotIndex: teachSlot,
    cost,
    sourceCost,
    skillRate,
    source: npc.petSkillShop.source || `${GMSV_DATA_SOURCE}/petskill2.txt`
  });
  addLog(game, `${npc.name} 教会 ${pet.Name || "宠物"} ${skill.Name}，花费 ${cost} 石币。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", `${pet.Name || "宠物"} 学会了 ${skill.Name}（技能格 ${teachSlot + 1}），花费 ${cost} 石币。`)
  ], { petSkillShop: buildPetSkillShopState(data, game, npc) });
  return withMap(game, { npc });
}

function poolPetGame(game, npcId, action, petIndex = NaN, poolIndex = NaN) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能整理宠物店寄放栏");
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作宠物店");
  if (!npc.petShop) throw new Error("这个 NPC 没有宠物店脚本资料");

  const mode = normalizePetShopAction(action);
  let message = "";
  if (mode === "deposit") message = depositPetAtShop(game, npc, petIndex);
  else if (mode === "withdraw") message = withdrawPetAtShop(game, npc, poolIndex);
  else if (mode === "sell") message = sellPetAtShop(game, npc, petIndex);
  else throw new Error("宠物店动作不存在");

  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", message)
  ], { petShop: buildPetShopState(game, npc) });
  return withMap(game, { npc, petShopAction: { type: mode, message, source: npc.petShop.source } });
}

async function petFusionGame(env, request, game, npcId, mainIndex = NaN, subIndex1 = NaN, subIndex2 = NaN) {
  const data = await loadGameData(env, request);
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能进行宠物融合");
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作宠物融合");
  if (!isPetFusionNpc(npc)) throw new Error("这个 NPC 没有宠物融合脚本资料");
  const state = buildPetFusionState(game, npc);
  if (!state) throw new Error("这个 NPC 的宠物融合资料无法解析");
  if (state.condition?.ok === false) throw new Error(state.condition.reason || "还不满足宠物融合条件");
  if (!state.eggs.length) throw new Error("这个融合 NPC 没有配置 ADDEGGID 宠物蛋");
  if ((game.pets || []).length < 2) throw new Error("原版宠物融合至少需要主宠和一只副宠");

  const selectedIndexes = normalizePetFusionSelection(game, mainIndex, subIndex1, subIndex2);
  const [mainPet, ...subPets] = selectedIndexes.map((index) => game.pets[index]);
  validatePetFusionPet(data, mainPet, "主宠");
  subPets.forEach((pet, index) => validatePetFusionPet(data, pet, `副宠${index + 1}`));

  const eggEnemyId = Number(state.eggs[0].enemyId || 0);
  const resultPetId = petFusionResultPetId(data, mainPet, subPets[0]);
  if (resultPetId <= 0) throw new Error("这组宠物无法从原版融合表推导结果");
  const resultTemplate = data.enemyBaseSet.get(resultPetId);
  if (!resultTemplate) throw new Error(`融合结果宠物 ${resultPetId} 不在 enemybase2.txt 中`);
  const eggEnemy = createEnemyFromEnemySpec(data, eggEnemyId, {
    npcId: npc.id,
    npcName: npc.name,
    source: npc.petFusion?.source || npc.script || npc.source || ""
  });
  if (!eggEnemy) throw new Error(`ADDEGGID ${eggEnemyId} 无法从 enemy1.txt 生成宠物蛋`);

  const parents = selectedIndexes.map((index) => petFusionParentSummary(game.pets[index], index));
  const work = petFusionWorkStats(mainPet, subPets, `${npc.id}:${parents.map((pet) => `${pet.petId}:${pet.level}`).join("|")}`);
  const skillIds = petFusionSkillIds(mainPet, subPets);
  const egg = createPetFusionEgg(data, eggEnemy, resultTemplate, resultPetId, work, skillIds, parents, npc);

  for (const index of [...selectedIndexes].sort((a, b) => b - a)) {
    game.pets.splice(index, 1);
  }
  game.pets.push(egg);
  ensurePetFormation(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "petFusion", "ok", {
    action: "fuse",
    mutated: true,
    selectedIndexes,
    parents,
    eggEnemyId,
    eggPetId: Number(egg.PetId || 0),
    eggName: egg.Name || "",
    fusionResultPetId: resultPetId,
    fusionResultName: resultTemplate.Name || "",
    fusionRaise: Number(egg.FusionRaise || egg.CHAR_FUSIONRAISE || 0),
    source: npc.petFusion?.source || npc.script || npc.source || "",
    executor: "npc-action-vm"
  });
  addLog(game, `${npc.name} 将 ${parents.map((pet) => pet.name).join("、")} 融合成 ${egg.Name || "宠物蛋"}。`);
  const message = `${npc.name}：融合完成，获得 ${egg.Name || "宠物蛋"}。蛋内结果按原版表记录为 ${resultTemplate.Name || `Pet ${resultPetId}`}，孵化阶段会继续读取 FUSIONRAISE。`;
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", message)
  ], { petFusion: buildPetFusionState(game, npc) });
  return withMap(game, { npc, petFusionAction: { type: "fuse", message, parents, egg: petFusionParentSummary(egg, game.pets.length - 1), resultPetId } });
}

function normalizePetFusionSelection(game, mainIndex, subIndex1, subIndex2 = NaN) {
  const indexes = [exactPetIndex(game, mainIndex), exactPetIndex(game, subIndex1)];
  if (Number.isFinite(Number(subIndex2))) indexes.push(exactPetIndex(game, subIndex2));
  const unique = [...new Set(indexes)];
  if (unique.length !== indexes.length) throw new Error("主宠和副宠不能选择同一只");
  return unique.slice(0, 3);
}

function validatePetFusionPet(data, pet, label) {
  if (!pet) throw new Error(`${label}不存在`);
  if (Number(pet.FusionBeit ?? pet.CHAR_FUSIONBEIT ?? 0) === 1 || Number(pet.FusionRaise ?? pet.CHAR_FUSIONRAISE ?? 0) > 0) {
    throw new Error(`${label}已经是融合蛋或正在孵化，不能再次融合`);
  }
  const code = petFusionCode(data, pet);
  if (code < 0) throw new Error(`${label} ${pet.Name || ""} 没有原版融合分类，不能融合`);
}

function petFusionCode(data, pet) {
  const petId = Number(pet?.PetId || pet?.petId || 0);
  const template = data?.enemyBaseSet?.get(petId);
  const code = Number(template?.FusionCode ?? pet?.FusionCode ?? pet?.CHAR_FUSIONCODE);
  return Number.isFinite(code) ? Math.trunc(code) : -1;
}

function petFusionResultPetId(data, mainPet, subPet) {
  const mainCode = petFusionCode(data, mainPet);
  const subCode = petFusionCode(data, subPet);
  const petRow = PET_FUSION_PET_TABLE[subCode];
  if (!petRow) return 0;
  const px = petRow[mainCode];
  const mainElement = petFusionElementIndex(mainPet);
  const subElement = petFusionElementIndex(subPet);
  const py = PET_FUSION_PROPERTY_TABLE[mainElement]?.[subElement];
  const result = PET_FUSION_RESULT_TABLE[px]?.[py];
  return Number(result || 0);
}

function petFusionElementIndex(pet) {
  const attrs = [
    Number(pet?.EarthAT ?? pet?.Earth ?? 0),
    Number(pet?.WaterAT ?? pet?.Water ?? 0),
    Number(pet?.FireAT ?? pet?.Fire ?? 0),
    Number(pet?.WindAT ?? pet?.WindAt ?? pet?.Wind ?? 0)
  ];
  let bestIndex = 0;
  let bestValue = -1;
  for (let i = 0; i < attrs.length; i += 1) {
    if (attrs[i] > bestValue) {
      bestValue = attrs[i];
      bestIndex = i;
    }
  }
  return bestIndex;
}

function petFusionWorkStats(mainPet, subPets, seed) {
  const main = petFusionScaledWork(mainPet);
  const subAverage = [0, 1, 2, 3].map((index) => {
    const sum = subPets.reduce((total, pet) => total + petFusionScaledWork(pet)[index], 0);
    return subPets.length ? Math.trunc(sum / subPets.length) : 0;
  });
  const work = [0, 1, 2, 3].map((index) => {
    const base = Math.trunc(main[index] * 0.6 + subAverage[index] * 0.4);
    const jitter = (stableHashInt(`${seed}:jitter:${index}`) % 5) - 2;
    return clampInt(base + jitter, 1, 255, 1);
  });
  const rankWork = work.slice();
  for (let i = 0; i < 10; i += 1) {
    const stat = stableHashInt(`${seed}:growth:${i}`) % 4;
    work[stat] = clampInt(work[stat] + 1, 1, 255, work[stat]);
  }
  work.rank = petFusionRank(rankWork);
  work.rankWork = rankWork;
  return work;
}

function petFusionScaledWork(pet) {
  const alloc = Array.isArray(pet?.AllocPoint) && pet.AllocPoint.length >= 4
    ? pet.AllocPoint
    : [
      pet?.WorkFixVital ?? pet?.Vital,
      pet?.WorkFixStr ?? pet?.Str,
      pet?.WorkFixTough ?? pet?.Tough,
      pet?.WorkFixDex ?? pet?.Dex
    ];
  const level = clampInt(pet?.Lv ?? pet?.level, 1, CHAR_MAXUPLEVEL, 1);
  const scale = level < 120 ? 0.7 : level < 140 ? 0.8 : 1;
  return [0, 1, 2, 3].map((index) => Math.max(1, Math.trunc(Number(alloc[index] || 1) * scale)));
}

function petFusionRank(work = []) {
  const sum = work.reduce((total, value) => total + Number(value || 0), 0);
  const thresholds = [130, 100, 95, 85, 80, 0];
  const index = thresholds.findIndex((value) => sum >= value);
  return index >= 0 ? index : thresholds.length - 1;
}

function petFusionSkillIds(mainPet, subPets) {
  const ids = [];
  for (const pet of [mainPet, ...subPets]) {
    const source = Array.isArray(pet?.PetSkillIds) ? pet.PetSkillIds : [];
    for (const id of source) {
      const skillId = Number(id || 0);
      if (skillId > 0 && !PET_FUSION_ILLEGAL_SKILLS.has(skillId) && !ids.includes(skillId)) ids.push(skillId);
      if (ids.length >= 7) break;
    }
    if (ids.length >= 7) break;
  }
  while (ids.length < 7) ids.push(0);
  return ids.slice(0, 7);
}

function createPetFusionEgg(data, eggEnemy, resultTemplate, resultPetId, work, skillIds, parents, npc) {
  const egg = normalizeCapturedPet(eggEnemy);
  const init = Math.max(1, Number(resultTemplate.InitNum || 1));
  egg.Vital = init * Number(resultTemplate.BaseVital || 1) * Number(work[0] || 1);
  egg.Str = init * Number(resultTemplate.BaseStr || 1) * Number(work[1] || 1);
  egg.Tough = init * Number(resultTemplate.BaseTgh || 1) * Number(work[2] || 1);
  egg.Dex = init * Number(resultTemplate.BaseDex || 1) * Number(work[3] || 1);
  egg.AllocPoint = work.slice(0, 4);
  egg.PetRank = Number(work.rank ?? petFusionRank(work));
  egg.PetSkillIds = skillIds.slice(0, 7);
  egg.PetSkills = egg.PetSkillIds.map((id) => (id > 0 ? compactPetSkillForSave(data.skills.get(id) || { Id: id, Name: `技能 ${id}` }) : null));
  egg.Slot = 7;
  egg.Lv = 1;
  egg.Exp = levelExp(1);
  egg.SourceExp = 0;
  egg.EnemyExp = 0;
  egg.FusionCode = -1;
  egg.CHAR_FUSIONCODE = -1;
  egg.FusionRaise = 40;
  egg.CHAR_FUSIONRAISE = 40;
  egg.FusionBeit = 1;
  egg.CHAR_FUSIONBEIT = 1;
  egg.FusionTimeLimit = Math.floor(Date.now() / 1000);
  egg.CHAR_FUSIONTIMELIMIT = egg.FusionTimeLimit;
  egg.FusionIndex = resultPetId;
  egg.CHAR_FUSIONINDEX = resultPetId;
  egg.FusionResultPetId = resultPetId;
  egg.FusionResultName = resultTemplate.Name || "";
  egg.FusionParents = parents;
  egg.FusionSource = npc.petFusion?.source || npc.script || npc.source || "";
  egg.Transmigration = Number(egg.Transmigration || egg.CHAR_TRANSMIGRATION || 1);
  egg.CHAR_TRANSMIGRATION = egg.Transmigration;
  complianceParameter(egg);
  egg.BornPoint = [egg.WorkMaxHp, egg.WorkFixStr, egg.WorkFixTough, egg.WorkFixDex];
  normalizePetRuntime(egg);
  return egg;
}

function petFusionParentSummary(pet, index) {
  return {
    index,
    name: pet?.Name || pet?.name || `宠物 ${Number(index || 0) + 1}`,
    petId: Number(pet?.PetId || pet?.petId || 0),
    level: Number(pet?.Lv || pet?.level || 1),
    hp: Number(pet?.Hp || 0),
    maxHp: Number(pet?.WorkMaxHp || pet?.Hp || 0)
  };
}

function normalizePetShopAction(action = "") {
  const text = String(action || "").toLowerCase();
  if (["deposit", "pool", "store", "寄放", "寄存"].includes(text)) return "deposit";
  if (["withdraw", "draw", "take", "取回", "取出", "领取"].includes(text)) return "withdraw";
  if (["sell", "卖", "卖出", "卖掉"].includes(text)) return "sell";
  return "";
}

function depositPetAtShop(game, npc, petIndex) {
  const shop = npc.petShop || {};
  if (!shop.poolEnabled) throw new Error("这间宠物店没有开放宠物寄放功能");
  const pool = ensurePetPool(game);
  if (pool.length >= PET_POOL_CAPACITY) throw new Error(shop.messages?.poolFull || `宠物寄放栏已满，最多 ${PET_POOL_CAPACITY} 只`);
  if ((game.pets || []).length <= 1) throw new Error("至少要保留一只随身宠物");
  const index = exactPetIndex(game, petIndex);
  const pet = game.pets[index];
  const cost = petShopPetCost(game, npc, pet);
  const paid = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "pet-shop-deposit" });
  if (!paid.ok) throw new Error(shop.messages?.cost || paid.error || "石币不够");
  const [removed] = game.pets.splice(index, 1);
  pool.push({
    ...removed,
    PooledAt: new Date().toISOString(),
    PoolNpcId: npc.id,
    PoolSource: shop.source || npc.script || npc.source || ""
  });
  ensurePetFormation(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "petShop", "ok", {
    action: "deposit",
    petIndex: index,
    petName: removed.Name,
    cost,
    poolUsed: pool.length,
    source: shop.source || ""
  });
  addLog(game, `${npc.name} 寄放了 ${removed.Name}，花费 ${cost} 石币。`);
  return `${removed.Name} 已寄放，花费 ${cost} 石币。${shop.messages?.poolThanks || ""}`.trim();
}

function withdrawPetAtShop(game, npc, poolIndex) {
  const shop = npc.petShop || {};
  if (!shop.poolEnabled) throw new Error("这间宠物店没有开放宠物取回功能");
  const pool = ensurePetPool(game);
  const index = Math.trunc(Number(poolIndex));
  if (!Number.isFinite(index) || index < 0 || index >= pool.length) throw new Error("没有找到这只寄放宠物");
  if ((game.pets || []).length >= PET_CAPACITY) throw new Error(shop.messages?.getFull || `宠物栏已满，最多携带 ${PET_CAPACITY} 只`);
  const [pet] = pool.splice(index, 1);
  delete pet.PooledAt;
  delete pet.PoolNpcId;
  delete pet.PoolSource;
  game.pets.push(pet);
  ensurePetFormation(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "petShop", "ok", {
    action: "withdraw",
    poolIndex: index,
    petName: pet.Name,
    poolUsed: pool.length,
    source: shop.source || ""
  });
  addLog(game, `${npc.name} 取回了 ${pet.Name}。`);
  return `${pet.Name} 已回到随身宠物栏。${shop.messages?.poolThanks || ""}`.trim();
}

function sellPetAtShop(game, npc, petIndex) {
  if ((game.pets || []).length <= 1) throw new Error("至少要保留一只随身宠物");
  const index = exactPetIndex(game, petIndex);
  const pet = game.pets[index];
  const price = petShopPetCost(game, npc, pet);
  const [removed] = game.pets.splice(index, 1);
  const paid = runNpcVmAction(game, npc, { type: "give", stone: price, reason: "pet-shop-sell" });
  if (!paid.ok) throw new Error(paid.error || "出售失败");
  ensurePetFormation(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "petShop", "ok", {
    action: "sell",
    petIndex: index,
    petName: removed.Name,
    price,
    source: npc.petShop?.source || ""
  });
  addLog(game, `${npc.name} 收下了 ${removed.Name}，支付 ${price} 石币。`);
  return `${removed.Name} 已交给宠物店，获得 ${price} 石币。${npc.petShop?.messages?.thanks || ""}`.trim();
}

function poolItemGame(game, npcId, action, itemId = NaN, poolIndex = NaN) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能整理道具寄放栏");
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作道具寄放");
  if (!npc.itemPoolShop) throw new Error("这个 NPC 没有道具寄放脚本资料");

  const mode = normalizeItemPoolAction(action);
  let message = "";
  if (mode === "deposit") message = depositItemAtPoolShop(game, npc, itemId);
  else if (mode === "withdraw") message = withdrawItemAtPoolShop(game, npc, poolIndex);
  else throw new Error("道具寄放动作不存在");

  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", message)
  ], { itemPoolShop: buildItemPoolShopState(game, npc) });
  return withMap(game, { npc, itemPoolAction: { type: mode, message, source: npc.itemPoolShop.source } });
}

function normalizeItemPoolAction(action = "") {
  const text = String(action || "").toLowerCase();
  if (["deposit", "pool", "store", "寄放", "寄存", "存"].includes(text)) return "deposit";
  if (["withdraw", "draw", "take", "取回", "取出", "领取", "取"].includes(text)) return "withdraw";
  return "";
}

function depositItemAtPoolShop(game, npc, itemId) {
  const shop = npc.itemPoolShop || {};
  const pool = ensureItemPool(game);
  if (pool.length >= ITEM_POOL_CAPACITY) throw new Error(shop.messages?.poolFull || `道具寄放栏已满，最多 ${ITEM_POOL_CAPACITY} 种`);
  const id = Number(itemId);
  const item = (game.inventory || []).find((entry) => Number(entry.id) === id && entry.id !== "stone" && Number(entry.qty || 0) > 0);
  if (!item) throw new Error("背包里没有这个道具");
  hydrateInventoryItemFromSource(item);
  if (!canPoolInventoryItem(item)) throw new Error("这个道具不能寄放");
  const cost = Math.max(0, Number(shop.cost || 0) || 0);
  if (cost > 0) {
    const paid = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "item-pool-deposit" });
    if (!paid.ok) throw new Error(shop.messages?.stone || paid.error || "石币不够");
  }
  const pooled = compactPooledInventoryItem(item, npc, shop);
  item.qty = Number(item.qty || 0) - 1;
  if (item.qty <= 0) {
    game.inventory = (game.inventory || []).filter((entry) => entry !== item);
  }
  pool.push(pooled);
  syncStoneItem(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "itemPoolShop", "ok", {
    action: "deposit",
    itemId: Number(pooled.id || 0),
    itemName: pooled.name,
    cost,
    poolUsed: pool.length,
    source: shop.source || ""
  });
  addLog(game, `${npc.name} 寄放了 ${pooled.name}，花费 ${cost} 石币。`);
  return `${pooled.name} 已寄放${cost > 0 ? `，花费 ${cost} 石币` : ""}。${shop.messages?.confirm || ""}`.trim();
}

function withdrawItemAtPoolShop(game, npc, poolIndex) {
  const shop = npc.itemPoolShop || {};
  const pool = ensureItemPool(game);
  const index = Math.trunc(Number(poolIndex));
  if (!Number.isFinite(index) || index < 0 || index >= pool.length) throw new Error("没有找到这个寄放道具");
  const item = { ...pool[index], qty: 1 };
  hydrateInventoryItemFromSource(item);
  if (!canCarryItem(game, item)) throw new Error(shop.messages?.itemFull || `背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具`);
  pool.splice(index, 1);
  delete item.PooledAt;
  delete item.PoolNpcId;
  delete item.PoolSource;
  addInventoryItem(game, item, 1);
  syncStoneItem(game);
  syncCharacterFields(game);
  recordNpcVmEvent(game, npc, "itemPoolShop", "ok", {
    action: "withdraw",
    poolIndex: index,
    itemId: Number(item.id || 0),
    itemName: item.name,
    poolUsed: pool.length,
    source: shop.source || ""
  });
  addLog(game, `${npc.name} 取回了 ${item.name}。`);
  return `${item.name} 已放回背包。${shop.messages?.confirm || ""}`.trim();
}

function canPoolInventoryItem(item = {}) {
  if (!item || item.id === "stone") return false;
  const id = Number(item.id);
  if (!Number.isFinite(id) || id <= 0) return false;
  if (item.equippedSlot) return false;
  return Number(item.qty || 0) > 0;
}

function compactPooledInventoryItem(item, npc, shop) {
  return {
    id: Number(item.id),
    name: item.name || item.secretName || `道具 ${Number(item.id)}`,
    qty: 1,
    image: Number(item.image || 0),
    type: item.type,
    useField: item.useField,
    target: item.target,
    level: item.level,
    price: item.price,
    cost: item.cost,
    description: item.description,
    secretName: item.secretName,
    category: item.category,
    option: item.option,
    effectOption: item.effectOption,
    functionName: item.functionName,
    useFunction: item.useFunction,
    damageBreak: item.damageBreak,
    maxUses: item.maxUses,
    usesRemaining: item.usesRemaining,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`,
    PooledAt: new Date().toISOString(),
    PoolNpcId: npc.id,
    PoolSource: shop.source || npc.script || npc.source || ""
  };
}

function changeItemGame(game, npcId, recipeIndex = NaN) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_WINDOW_ACTION_RANGE, "操作 NPC 窗口");
  if (!npc.itemChange?.recipes?.length) throw new Error("这个 NPC 没有加工资料");

  const index = Math.trunc(Number(recipeIndex));
  const recipe = npc.itemChange.recipes.find((item) => Number(item.index) === index) || npc.itemChange.recipes[index];
  if (!recipe) throw new Error("加工配方不存在");
  const status = itemChangeRecipeStatus(game, recipe);
  if (!status.ok) throw new Error(itemChangeBlockedReason(status));

  recordNpcVmEvent(game, npc, "itemChange", "ok", {
    action: "change",
    recipeIndex: Number(recipe.index ?? index),
    itemId: recipe.changeItemId || recipe.addItems?.[0]?.id || 0,
    itemName: recipe.changeItemName || recipe.addItems?.[0]?.name || "",
    delGold: Number(recipe.delGold || 0),
    delItems: (recipe.delItems || []).map(({ id, name, qty }) => ({ id, name, qty })),
    addItems: (recipe.addItems || []).map(({ id, name, qty }) => ({ id, name, qty })),
    condition: compactConditionStatus(status.condition),
    source: recipe.source || npc.itemChange.source || ""
  });

  if (Number(recipe.delGold || 0) > 0) {
    const paid = runNpcVmAction(game, npc, {
      type: "take",
      item: "stone",
      qty: Number(recipe.delGold || 0),
      reason: "item-change",
      recipeIndex: recipe.index
    });
    if (!paid.ok) throw new Error(paid.error || "石币不够");
  }
  for (const item of recipe.delItems || []) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      item,
      itemId: item.id,
      itemName: item.name,
      qty: item.qty,
      reason: "item-change",
      recipeIndex: recipe.index
    });
    if (!taken.ok) throw new Error(taken.error || `缺少 ${item.name || item.id}`);
  }
  for (const item of recipe.addItems || []) {
    const given = runNpcVmAction(game, npc, {
      type: "give",
      item,
      itemId: item.id,
      itemName: item.name,
      qty: item.qty,
      reason: "item-change",
      recipeIndex: recipe.index
    });
    if (!given.ok) throw new Error(given.error || "加工失败");
  }
  syncCharacterFields(game);
  const resultText = (recipe.addItems || [])
    .map((item) => `${item.name || `item ${item.id}`} x${Number(item.qty || 1)}`)
    .join("、") || recipe.changeItemName || "完成品";
  addLog(game, `${npc.name} 加工完成：${resultText}。`);
  openDialog(game, npc, [
    ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
    npcMessage("system", `加工完成：${resultText}。`)
  ], { itemChange: buildItemChangeState(game, npc) });
  return withMap(game, { npc });
}

async function useItemGame(env, request, game, itemId) {
  const data = await loadGameData(env, request);
  game = normalizeGame(game);
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");
  hydrateInventoryItemFromSource(item, data?.itemSet);
  hydrateRuntimeItemEffect(item, data);
  if (itemLooksEquipment(item)) return equipItemGame(env, request, game, itemId, data);

  const itemUse = applyUsableItem(game, item);
  if (itemUse.effects?.some((effect) => effect.kind === "encounter")) {
    await triggerItemEncounter(env, request, game, itemUse);
  }
  addLog(game, itemUseLogLine(itemUse));
  return withMap(game, { itemUse });
}

async function triggerItemEncounter(env, request, game, itemUse) {
  const map = currentMap(game);
  assertWildEncounterAllowed(map, game);
  const enemy = await spawnEncounter(env, request, game, map, itemUse.itemName || "道具");
  itemUse.encounter = {
    enemyName: enemy?.Name || "",
    enemyLevel: Number(enemy?.Lv || 0),
    enemyPartySize: Number(game.battle?.enemyParty?.length || (enemy ? 1 : 0)),
    source: game.battle?.source || `${GMSV_DATA_SOURCE}/encount.txt`
  };
  return enemy;
}

async function equipItemGame(env, request, game, itemId, data = null) {
  data ||= await loadGameData(env, request);
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能更换装备");
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个装备");
  hydrateInventoryItemFromSource(item, data?.itemSet);
  hydrateRuntimeItemEffect(item, data);
  if (!itemLooksEquipment(item)) throw new Error(`${item.name || "这个道具"} 不是装备，不能穿上`);

  const slot = equipmentSlotForItem(item);
  const equipment = syncEquipmentState(game);
  const previous = equipment[slot] || null;
  const willFreeInventorySlot = Number(item.qty || 0) <= 1;
  if (previous && !willFreeInventorySlot && !canCarryItem(game, previous)) {
    throw new Error("背包没有空位，无法替换装备");
  }

  const equipped = {
    ...item,
    qty: 1,
    equippedSlot: slot,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
  item.qty = Number(item.qty || 0) - 1;
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  if (previous) addInventoryItem(game, previous, 1);

  equipment[slot] = equipped;
  game.character.equipment = equipment;
  game.player.equipment = { ...equipment };
  syncCharacterFields(game);
  addLog(game, `装备了 ${equipped.name || `item ${equipped.id}`}（${slot}）。`);
  return withMap(game, {
    itemAction: {
      type: "equip",
      slot,
      itemId: equipped.id,
      itemName: equipped.name,
      replaced: previous ? previous.name || previous.id : null,
      source: `${GMSV_DATA_SOURCE}/itemset6.txt ITEM_suitEquip/ITEM_ResuitEquip`
    }
  });
}

function unequipItemGame(game, slot) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能更换装备");
  const normalizedSlot = equipmentSlotLabel(slot);
  const equipment = syncEquipmentState(game);
  const item = equipment[normalizedSlot];
  if (!item) throw new Error("这个装备栏没有装备");
  if (!canCarryItem(game, item)) throw new Error("背包没有空位，无法卸下装备");

  delete equipment[normalizedSlot];
  addInventoryItem(game, item, 1);
  game.character.equipment = equipment;
  game.player.equipment = { ...equipment };
  syncCharacterFields(game);
  addLog(game, `卸下了 ${item.name || `item ${item.id}`}（${normalizedSlot}）。`);
  return withMap(game, {
    itemAction: {
      type: "unequip",
      slot: normalizedSlot,
      itemId: item.id,
      itemName: item.name,
      source: `${GMSV_DATA_SOURCE}/itemset6.txt ITEM_suitEquip/ITEM_ResuitEquip`
    }
  });
}

function dropItemGame(game, itemId, qty = 1) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能整理背包");
  const dropped = dropItemInPlace(game, itemId, qty);
  return withMap(game, {
    itemAction: {
      type: "drop",
      itemId: dropped.itemId,
      itemName: dropped.itemName,
      qty: dropped.qty,
      remaining: dropped.remaining,
      source: `${GMSV_DATA_SOURCE}/itemset6.txt + CHAR_MAXITEMNUM=${INVENTORY_CAPACITY}`
    }
  });
}

function dropItemInPlace(game, itemId, qty = 1) {
  const item = findInventoryItem(game, itemId);
  if (!item || item.id === "stone") throw new Error("背包里没有这个道具");
  const count = Math.max(1, Math.trunc(Number(qty) || 1));
  const dropQty = Math.min(count, Number(item.qty || 0));
  item.qty = Number(item.qty || 0) - dropQty;
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  addLog(game, `丢弃了 ${item.name} x${dropQty}，背包空位 ${inventoryState(game).remaining}/${INVENTORY_CAPACITY}。`);
  return {
    itemId: item.id,
    itemName: item.name,
    qty: dropQty,
    remaining: Math.max(0, Number(item.qty || 0))
  };
}

function findInventoryItem(game, itemId) {
  return (game.inventory || []).find((entry) => Number(entry.id) === Number(itemId) && Number(entry.qty || 0) > 0);
}

function syncEquipmentState(game) {
  game.player ||= {};
  game.character ||= {};
  const equipment = equipmentState(game);
  game.character.equipment = equipment;
  game.player.equipment = { ...equipment };
  return equipment;
}

function equipmentState(game) {
  const raw = game.character?.equipment || game.player?.equipment || {};
  const entries = Object.entries(raw || {})
    .filter(([, item]) => item && typeof item === "object")
    .map(([slot, item]) => {
      const normalizedSlot = equipmentSlotLabel(slot || item.equippedSlot || equipmentSlotForItem(item));
      return [normalizedSlot, {
        ...item,
        qty: 1,
        equippedSlot: normalizedSlot,
        source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
      }];
    });
  return Object.fromEntries(entries);
}

function itemLooksEquipment(item = {}) {
  const functionName = itemFunctionName(item);
  if (/ITEM_suitEquip|ITEM_ResuitEquip/i.test(functionName)) return true;
  if (/^ITEM_(?:use|Refresh|ResAndDef|Addexp|ChikulaStone|Gold|metamo|MetamoTime)/i.test(functionName)) return false;
  const text = `${item.name || ""} ${item.secretName || ""} ${item.description || ""} ${item.category || ""} ${item.option || ""}`;
  return /武器|防具|装备|裝備|斧|枪|槍|弓|投石|爪|兜|帽|服|铠|鎧|甲|盾|刀|剑|劍|棒|棍|鞋|靴|项链|項鏈|戒指|护身符|護身符/.test(text);
}

function equipmentSlotForItem(item = {}) {
  const text = `${item.name || ""} ${item.secretName || ""} ${item.description || ""} ${item.category || ""} ${item.option || ""} ${item.type || ""}`.toLowerCase();
  if (/兜|帽|头|頭|helmet|helm/.test(text)) return "头";
  if (/盾|shield/.test(text)) return "盾";
  if (/衣|服|铠|鎧|甲|armor|防具/.test(text)) return "身";
  if (/鞋|靴|足|boot/.test(text)) return "足";
  if (/项链|項鏈|戒指|饰|飾|护身符|護身符|amulet|ring/.test(text)) return "饰";
  return "武器";
}

function equipmentSlotLabel(slot) {
  const text = String(slot || "").trim();
  if (/头|頭|兜|帽/i.test(text)) return "头";
  if (/盾/i.test(text)) return "盾";
  if (/身|衣|服|铠|鎧|甲|防/i.test(text)) return "身";
  if (/足|鞋|靴/i.test(text)) return "足";
  if (/饰|飾|项|項|戒|护身|護身/i.test(text)) return "饰";
  if (/武|weapon|手/i.test(text)) return "武器";
  return text || "武器";
}

function firstUsableRecoveryItem(game) {
  return (game.inventory || []).find((item) => {
    if (item.id === "stone" || Number(item.qty || 0) <= 0) return false;
    const preview = previewItemUse(game, item, { battle: true });
    return preview.usable && preview.actions?.some((action) => ["hp", "mp", "status"].includes(action.kind));
  }) || null;
}

const ITEM_STATUS_RECOVERY_DEFS = [
  { tokens: ["毒", "中毒", "剧毒", "煞毒"], keys: ["poison", "deepPoison", "sars"], label: "毒" },
  { tokens: ["麻", "麻痹", "麻庳"], keys: ["paralysis"], label: "麻痹" },
  { tokens: ["眠", "睡眠", "昏睡"], keys: ["sleep"], label: "睡眠" },
  { tokens: ["石", "石化"], keys: ["stone"], label: "石化" },
  { tokens: ["醉", "酒醉", "酩酊"], keys: ["drunk"], label: "酒醉" },
  { tokens: ["乱", "混乱", "混亂", "混迷"], keys: ["confusion"], label: "混乱" },
  { tokens: ["默", "沉默"], keys: ["silence"], label: "沉默" }
];

const ITEM_BATTLE_EFFECT_KINDS = new Set(["hp", "mp", "status", "captureUp", "statusInflict"]);
const ITEM_NO_ENCOUNTER_SECONDS = 6 * 60;
const ITEM_CHIKULA_SECONDS = 30 * 60;
const ITEM_METAMO_DEFAULT_SECONDS = 3 * 60;

function itemEffect(item) {
  const text = itemEffectText(item);
  const option = itemEffectOption(item);
  const functionName = itemFunctionName(item);
  const scope = itemTargetScope(item, text);
  const effects = [];
  const fieldConsumable = itemLooksFieldConsumable(item, functionName, text);
  const recoveryFunction = /ITEM_useRecovery|ITEM_useImprecate/i.test(functionName);
  const reviveFunction = /ITEM_useRessurect|ITEM_ResAndDef/i.test(functionName);
  const statusFunction = /ITEM_useStatusRecovery|ITEM_Refresh/i.test(functionName);
  const warpFunction = /ITEM_useWarp/i.test(functionName);
  const deathCounterFunction = /ITEM_useDeathcounter/i.test(functionName);
  const encounterFunction = /ITEM_useEncounter/i.test(functionName);
  const noEnemyFunction = /ITEM_useNoenemy/i.test(functionName);
  const addExpFunction = /ITEM_Addexp/i.test(functionName);
  const chikulaFunction = /ITEM_ChikulaStone/i.test(functionName);
  const metamoFunction = /ITEM_(?:metamo|MetamoTime)/i.test(functionName);
  const goldFunction = /ITEM_Gold/i.test(functionName);
  const skillCannedFunction = /ITEM_useSkillCanned/i.test(functionName);
  const captureUpFunction = /ITEM_useCaptureUp/i.test(functionName);
  const statusChangeFunction = /ITEM_useStatusChange/i.test(functionName);

  const revive = reviveFunction || (fieldConsumable && /复活药|復活藥|气绝|氣絕|回魂|回复成耐力|回復成耐力|从气绝|從氣絕/.test(text));
  const hpAmount = parseItemResourceAmount(text, option, ["体", "耐", "耐久力", "耐力", "HP"], {
    allowLooseText: recoveryFunction || reviveFunction || /肉|药|藥|汤|湯|蛋糕|派|露水草|耐久力\s*\d+|耐\s*\d+\s*回复|体\s*\d+\s*回复|回复成耐力/.test(text)
  });
  if ((hpAmount > 0 || revive) && !/重新分配/.test(text)) {
    effects.push({ kind: "hp", amount: Math.max(1, hpAmount || 1), revive, label: revive ? "复活" : "耐久力" });
  }

  const mpAmount = parseItemResourceAmount(text, option, ["气", "氣", "气力", "氣力", "MP"], {
    allowLooseText: recoveryFunction || /气力\s*\d+|全体气力|氣力\s*\d+/.test(text)
  });
  if (mpAmount > 0) effects.push({ kind: "mp", amount: mpAmount, label: "气力" });

  const statusKeys = parseItemStatusRecoveryKeys(text, option, { statusFunction, fieldConsumable });
  if (statusKeys.length) {
    effects.push({
      kind: "status",
      keys: statusKeys.flatMap((entry) => entry.keys),
      labels: statusKeys.map((entry) => entry.label),
      label: statusKeys.map((entry) => entry.label).join("/")
    });
  }

  const charmAmount = fieldConsumable
    ? parseSignedChineseAmount(option, text, ["魅", "魅力"], { requireKeyword: /吃了|使用後|使用后|魅\+/.test(text) || recoveryFunction })
    : 0;
  if (charmAmount) effects.push({ kind: "charm", amount: charmAmount, label: "魅力" });

  const loyaltyAmount = fieldConsumable
    ? parseSignedChineseAmount(option, text, ["忠", "忠诚", "忠誠", "忠诚度", "忠誠度"], { requireKeyword: /宠物|寵物|忠/.test(text) || recoveryFunction })
    : 0;
  if (loyaltyAmount) effects.push({ kind: "loyalty", amount: loyaltyAmount, label: "忠诚度" });

  const warp = warpFunction ? parseItemWarpTarget(option, text, item) : null;
  if (warp) {
    effects.push({
      kind: "warp",
      target: warp,
      uses: /ITEM_useWarpForNum/i.test(functionName) ? itemUseCount(item) : -1,
      label: "传送",
      sourceFunction: functionName
    });
  }

  if (deathCounterFunction || encounterFunction) {
    effects.push({
      kind: "encounter",
      counter: deathCounterFunction,
      uses: deathCounterFunction ? itemUseCount(item) : 1,
      label: deathCounterFunction ? "原地遇敌" : "强制遇敌",
      sourceFunction: functionName
    });
  }

  if (noEnemyFunction) {
    effects.push({
      kind: "noEncounter",
      seconds: ITEM_NO_ENCOUNTER_SECONDS,
      label: "避敌",
      sourceFunction: functionName
    });
  }

  const expBonus = addExpFunction ? parseItemExpBonus(option, text) : null;
  if (expBonus) {
    effects.push({
      kind: "expBonus",
      power: expBonus.power,
      minutes: expBonus.minutes,
      multiplier: expBonus.multiplier,
      label: "经验加成",
      sourceFunction: functionName
    });
  }

  const chikula = chikulaFunction ? parseItemChikula(option, text) : null;
  if (chikula) {
    effects.push({
      kind: "chikula",
      resource: chikula.resource,
      amount: chikula.amount,
      seconds: ITEM_CHIKULA_SECONDS,
      label: chikula.resource === "mp" ? "奇克拉气力" : "奇克拉耐久力",
      sourceFunction: functionName
    });
  }

  const metamo = metamoFunction ? parseItemMetamo(option, text, functionName) : null;
  if (metamo) {
    effects.push({
      kind: "metamo",
      mode: metamo.mode,
      imageNo: metamo.imageNo,
      seconds: metamo.seconds,
      formName: metamo.formName,
      label: "变身",
      sourceFunction: functionName
    });
  }

  const goldAmount = goldFunction ? parseItemGoldAmount(option, text) : 0;
  if (goldAmount > 0) {
    effects.push({
      kind: "gold",
      amount: goldAmount,
      label: "石币",
      sourceFunction: functionName
    });
  }

  const skillId = skillCannedFunction ? parseItemSkillCannedId(option, text) : 0;
  if (skillId > 0) {
    effects.push({
      kind: "petSkillCan",
      skillId,
      label: "宠技罐头",
      sourceFunction: functionName
    });
  }

  const captureUpAmount = captureUpFunction ? parseItemCaptureUpAmount(option, text) : 0;
  if (captureUpAmount > 0) {
    effects.push({
      kind: "captureUp",
      amount: captureUpAmount,
      label: "捕获率",
      sourceFunction: functionName
    });
  }

  const statusInflict = statusChangeFunction ? parseItemStatusInflict(option || text) : null;
  if (statusInflict) {
    effects.push({
      kind: "statusInflict",
      status: statusInflict,
      label: statusInflict.label || "异常状态",
      sourceFunction: functionName
    });
  }

  return {
    usable: effects.length > 0,
    effects,
    scope,
    functionName,
    option,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
}

function itemEffectText(item = {}) {
  return `${item.name || ""} ${item.secretName || ""} ${item.description || ""} ${item.category || ""}`.replace(/\s+/g, " ").trim();
}

function itemEffectOption(item = {}) {
  return String(item.option ?? item.effectOption ?? item.Option ?? item.useOption ?? "").trim();
}

function itemFunctionName(item = {}) {
  return String(item.functionName ?? item.func ?? item.FuncName ?? item.useFunction ?? "").trim();
}

function itemLooksFieldConsumable(item = {}, functionName = "", text = "") {
  if (/ITEM_suitEquip|ITEM_ResuitEquip/i.test(functionName)) return false;
  if (/ITEM_(?:use|ResAndDef|ChikulaStone|metamo|MetamoTime)/i.test(functionName)) return true;
  const rawType = item.type ?? item.Type;
  const hasNumericType = rawType !== undefined && rawType !== null && rawType !== "" && Number.isFinite(Number(rawType));
  if (hasNumericType) return [15, 16, 20].includes(Number(rawType));
  return /吃了|使用後|使用后|肉|药|藥|汤|湯|蛋糕|派|羽毛|叶|葉|苹果|蘋果|梨|葡萄|橘子|饭团|飯糰|牛排|安抚|安撫/.test(text);
}

function itemTargetScope(item = {}, text = "") {
  const target = Number(item.target ?? item.Target ?? 0);
  if (target === 2 || target === 3 || /全体|全體|我方全体|我方全體/.test(text)) return "all";
  return "single";
}

function parseItemResourceAmount(text, option, labels, options = {}) {
  const haystacks = [option, text].filter(Boolean);
  for (const haystack of haystacks) {
    for (const label of labels) {
      const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const direct = String(haystack).match(new RegExp(`${escaped}\\s*:?\\s*(\\d+)`, "i"));
      if (direct) return Math.max(1, Number(direct[1]) || 1);
    }
  }
  if (!options.allowLooseText) return 0;
  const revive = text.match(/(?:回复成耐力|回復成耐力|气绝回复成耐力|氣絕回復成耐力|从气绝回复成|從氣絕回復成)\s*(\d+)/);
  if (revive) return Math.max(1, Number(revive[1]) || 1);
  const loose = text.match(/(?:耐久力|耐力|HP|体力|體力|气力|氣力)\s*(\d+)\s*(?:前後|左右)?\s*(?:回复|回復)?/i)
    || text.match(/(?:耐|体|體|气|氣)\s*(\d+)\s*(?:回复|回復)/);
  return loose ? Math.max(1, Number(loose[1]) || 1) : 0;
}

function parseSignedChineseAmount(option, text, labels, options = {}) {
  const haystack = `${option || ""} ${text || ""}`;
  if (options.requireKeyword === false) return 0;
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = haystack.match(new RegExp(`${escaped}\\s*([+-]?\\d+)`));
    if (match) return Number(match[1]) || 0;
  }
  return 0;
}

function parseItemStatusRecoveryKeys(text, option, options = {}) {
  const statusText = `${option || ""} ${text || ""}`;
  const looksLikeStatusRecovery = options.statusFunction
    || (options.fieldConsumable && /治疗|治療|解除|状态回复|狀態回復|状态回復|净化|淨化/.test(statusText) && !/耐性|精灵\s*Lv|精靈\s*Lv/.test(statusText));
  if (!looksLikeStatusRecovery) return [];
  if (/高等净化|高等淨化|全部异常|全异常|所有异常/.test(statusText)) return ITEM_STATUS_RECOVERY_DEFS;
  return ITEM_STATUS_RECOVERY_DEFS.filter((entry) => entry.tokens.some((token) => statusText.includes(token)));
}

function parseItemWarpTarget(option, text, item) {
  const numbers = String(option || text || "").match(/-?\d+/g)?.map(Number) || [];
  if (numbers.length < 4) return null;
  const [, mapId, x, y] = numbers;
  if (!mapId) return null;
  return {
    mapId: String(mapId),
    x,
    y,
    source: `${item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`} ITEM_useWarp ${option || ""}`.trim()
  };
}

function itemUseCount(item = {}) {
  const explicit = Number(item.usesRemaining ?? item.damageBreak ?? item.maxUses ?? item.DamageBreak ?? item.damagebreak);
  if (Number.isFinite(explicit) && explicit >= 0) return Math.trunc(explicit);
  const text = itemEffectText(item);
  const count = text.match(/使用次数\s*(\d+)\s*次/) || text.match(/(?:剩余|剩餘)\s*(\d+)\s*次/);
  if (count) return Math.max(1, Number(count[1]) || 1);
  if (/ITEM_useWarpForNum/i.test(itemFunctionName(item))) return 2;
  return -1;
}

function parseItemExpBonus(option, text) {
  const raw = `${option || ""} ${text || ""}`;
  const sourceLike = raw.match(/增\s*(\d+)\s*分\s*(\d+)/);
  if (sourceLike) {
    const power = Math.max(1, Number(sourceLike[1]) || 1);
    const minutes = Math.max(1, Number(sourceLike[2]) || 1);
    return { power, minutes, multiplier: 1 + (power * 2) / 100 };
  }
  const readable = raw.match(/经验值上升\s*(\d+)%.*?使用时间\s*(\d+)\s*小时/);
  if (readable) {
    const power = Math.max(1, Number(readable[1]) || 1);
    const minutes = Math.max(1, Number(readable[2]) || 1) * 60;
    return { power, minutes, multiplier: 1 + (power * 2) / 100 };
  }
  return null;
}

function parseItemChikula(option, text) {
  const raw = `${option || ""} ${text || ""}`;
  const hp = raw.match(/hp\s*:\s*(\d+)/i);
  if (hp) return { resource: "hp", amount: Math.max(1, Number(hp[1]) || 1) };
  const mp = raw.match(/mp\s*:\s*(\d+)/i);
  if (mp) return { resource: "mp", amount: Math.max(1, Number(mp[1]) || 1) };
  if (/耐久力/.test(raw)) return { resource: "hp", amount: 1 };
  if (/气力|氣力/.test(raw)) return { resource: "mp", amount: 1 };
  return null;
}

function parseItemMetamo(option, text, functionName = "") {
  const optionText = String(option || "").trim();
  const readableSeconds = parseReadableDurationSeconds(`${text || ""} ${optionText}`);
  if (/ITEM_MetamoTime/i.test(functionName)) {
    const parts = optionText.split("|").map((entry) => entry.trim());
    const imageNo = Number(parts[0] || 0);
    if (!Number.isFinite(imageNo) || imageNo <= 0) return null;
    const rawMinutes = Number(parts[1] || 0);
    const seconds = readableSeconds || (Number.isFinite(rawMinutes) && rawMinutes > 0 ? rawMinutes * 60 : ITEM_METAMO_DEFAULT_SECONDS);
    return {
      mode: "fixed",
      imageNo: Math.trunc(imageNo),
      seconds: clampInt(seconds, 1, 24 * 60 * 60, ITEM_METAMO_DEFAULT_SECONDS),
      formName: parts[2] || ""
    };
  }
  if (/ITEM_metamo/i.test(functionName)) {
    const rawSeconds = Number(optionText.match(/\d+/)?.[0] || 0);
    const seconds = rawSeconds > 0 ? rawSeconds : (readableSeconds || ITEM_METAMO_DEFAULT_SECONDS);
    return {
      mode: "activePet",
      imageNo: 0,
      seconds: clampInt(seconds, 1, 24 * 60 * 60, ITEM_METAMO_DEFAULT_SECONDS),
      formName: ""
    };
  }
  return null;
}

function parseItemGoldAmount(option, text) {
  const raw = `${option || ""} ${text || ""}`;
  const amount = Number(String(raw).match(/\d+/)?.[0] || 0);
  return Number.isFinite(amount) && amount > 0 ? Math.trunc(amount) : 0;
}

function parseItemSkillCannedId(option, text) {
  const raw = `${option || ""} ${text || ""}`;
  const id = Number(String(raw).match(/\d+/)?.[0] || 0);
  return Number.isFinite(id) && id > 0 ? Math.trunc(id) : 0;
}

function parseItemCaptureUpAmount(option, text) {
  const raw = `${option || ""} ${text || ""}`;
  const amount = Number(String(raw).match(/\d+/)?.[0] || 0);
  return Number.isFinite(amount) && amount > 0 ? Math.trunc(amount) : 0;
}

function parseItemStatusInflict(option) {
  const raw = String(option || "");
  const status = parsePetSkillStatusChange(raw);
  if (!status) return null;
  const chance = Number(raw.match(/(?:成|率|chance)\s*([0-9]+)/i)?.[1] || 0);
  return {
    ...status,
    percent: Number.isFinite(chance) && chance > 0 ? chance : (Number(status.percent || 0) || 100)
  };
}

function parseReadableDurationSeconds(text = "") {
  const raw = String(text || "");
  const hour = raw.match(/([0-9一二两三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+)\s*(?:小时|小時|钟头|鐘頭)/);
  if (hour) return Math.max(1, chineseNumber(hour[1])) * 60 * 60;
  const minute = raw.match(/([0-9一二两三四五六七八九十壹贰叁肆伍陆柒捌玖拾]+)\s*(?:分钟|分鐘|分)/);
  if (minute) return Math.max(1, chineseNumber(minute[1])) * 60;
  return 0;
}

function chineseNumber(value) {
  const text = String(value || "").trim();
  const numeric = Number(text);
  if (Number.isFinite(numeric)) return numeric;
  const digits = {
    零: 0, 一: 1, 壹: 1, 二: 2, 贰: 2, 兩: 2, 两: 2, 三: 3, 叁: 3,
    四: 4, 肆: 4, 五: 5, 伍: 5, 六: 6, 陆: 6, 七: 7, 柒: 7,
    八: 8, 捌: 8, 九: 9, 玖: 9
  };
  if (text === "十" || text === "拾") return 10;
  const tenIndex = Math.max(text.indexOf("十"), text.indexOf("拾"));
  if (tenIndex >= 0) {
    const left = text.slice(0, tenIndex);
    const right = text.slice(tenIndex + 1);
    const tens = left ? digits[left] || 1 : 1;
    return tens * 10 + (right ? digits[right] || 0 : 0);
  }
  return digits[text] || 0;
}

function itemPartyTargets(game) {
  const targets = [];
  const activePetIndex = getActivePetIndex(game);
  if (game.player) {
    targets.push({
      kind: "player",
      entity: game.player,
      name: game.player.name || "玩家",
      hpKey: "hp",
      maxHpKey: "maxHp",
      mpKey: "mp",
      maxMpKey: "maxMp"
    });
  }
  for (const [index, pet] of (game.pets || []).entries()) {
    targets.push({
      kind: "pet",
      entity: pet,
      index,
      active: index === activePetIndex,
      name: pet.Name || `宠物 ${index + 1}`,
      hpKey: "Hp",
      maxHpKey: "WorkMaxHp",
      mpKey: "Mp",
      maxMpKey: "WorkMaxMp"
    });
  }
  return targets;
}

function itemTargetHp(target) {
  return Number(target.entity?.[target.hpKey] ?? 0);
}

function itemTargetMaxHp(target) {
  const value = Number(target.entity?.[target.maxHpKey] ?? target.entity?.WorkMaxHp ?? target.entity?.maxHp ?? target.entity?.Hp ?? target.entity?.hp ?? 1);
  return Math.max(1, Number.isFinite(value) ? value : 1);
}

function itemTargetMp(target, effect) {
  const current = Number(target.entity?.[target.mpKey] ?? target.entity?.Mp ?? target.entity?.mp ?? 0);
  const max = itemTargetMaxMp(target, effect);
  return { current: Number.isFinite(current) ? current : 0, max };
}

function itemTargetMaxMp(target, effect) {
  const raw = Number(target.entity?.[target.maxMpKey] ?? target.entity?.WorkMaxMp ?? target.entity?.maxMp ?? target.entity?.MaxMp ?? 0);
  if (Number.isFinite(raw) && raw > 0) return raw;
  return Math.max(100, Number(effect?.amount || 0), Number(target.entity?.[target.mpKey] ?? target.entity?.Mp ?? target.entity?.mp ?? 0));
}

function itemTargetBattleStatusKeys(target, keys) {
  const wanted = new Set(keys || []);
  const statuses = target.entity?.BattleStatuses || {};
  const out = Object.keys(statuses).filter((key) => wanted.has(key) && Number(statuses[key]?.turns || 0) > 0);
  const primary = target.entity?.BattleStatus?.key;
  if (primary && wanted.has(primary) && !out.includes(primary)) out.push(primary);
  return out;
}

function itemTargetEffectScore(target, effects) {
  let score = 0;
  for (const effect of effects) {
    if (effect.kind === "hp") {
      const hp = itemTargetHp(target);
      const maxHp = itemTargetMaxHp(target);
      if (effect.revive && hp <= 0) score += 1000;
      else if (!effect.revive && hp > 0 && hp < maxHp) score += 100 + Math.min(80, maxHp - hp);
    } else if (effect.kind === "mp") {
      const { current, max } = itemTargetMp(target, effect);
      if (current < max) score += 80 + Math.min(40, max - current);
    } else if (effect.kind === "status") {
      score += itemTargetBattleStatusKeys(target, effect.keys).length * 120;
    } else if (effect.kind === "charm" && target.kind === "player") {
      const before = Number(target.entity.charm ?? target.entity.Charm ?? target.entity.CHARM ?? PLAYER_INITIAL_CHARM);
      const after = clampInt(before + effect.amount, 0, 100, before);
      if (after !== before) score += 90;
    } else if (effect.kind === "loyalty" && target.kind === "pet") {
      const before = Number(target.entity.Loyal ?? target.entity.loyal ?? 100);
      const after = clampInt(before + effect.amount, 0, 100, before);
      if (after !== before) score += target.active ? 90 : 70;
    }
  }
  if (target.kind === "pet" && target.active) score += 5;
  return score;
}

function previewItemUse(game, item, options = {}) {
  const effect = itemEffect(item);
  const contextEffects = options.battle
    ? effect.effects.filter((entry) => ITEM_BATTLE_EFFECT_KINDS.has(entry.kind))
    : effect.effects;
  if (!effect.usable || !contextEffects.length) return { usable: false, effect, reason: "unsupported" };

  const actions = [];
  for (const warp of contextEffects.filter((entry) => entry.kind === "warp")) {
    const targetMap = WORLD.maps[String(warp.target.mapId)];
    if (!targetMap) return { usable: false, effect, reason: "warp-map-missing", target: warp.target };
    actions.push({
      kind: "warp",
      target: warp.target,
      mapName: targetMap.name || `floor ${targetMap.id}`,
      usesBefore: warp.uses,
      usesAfter: warp.uses > 0 ? warp.uses - 1 : warp.uses,
      sourceFunction: warp.sourceFunction
    });
  }

  for (const encounter of contextEffects.filter((entry) => entry.kind === "encounter")) {
    if (game.encounter) return { usable: false, effect, reason: "encounter-active" };
    const map = currentMap(game);
    if (!wildEncounterAllowed(map, game)) {
      return { usable: false, effect, reason: "encounter-blocked", map };
    }
    actions.push({
      kind: "encounter",
      counter: encounter.counter,
      usesBefore: encounter.uses,
      usesAfter: encounter.uses > 0 ? encounter.uses - 1 : encounter.uses,
      targetName: map.name || `floor ${map.id}`,
      mapId: map.id,
      sourceFunction: encounter.sourceFunction
    });
  }

  for (const entry of contextEffects.filter((item) => ["noEncounter", "expBonus", "chikula"].includes(item.kind))) {
    actions.push({ ...entry, targetName: "自己" });
  }

  for (const entry of contextEffects.filter((item) => item.kind === "metamo")) {
    const action = previewMetamoItemAction(game, entry);
    if (!action) return { usable: false, effect, reason: "metamo-target-missing" };
    actions.push(action);
  }

  for (const entry of contextEffects.filter((item) => item.kind === "gold")) {
    actions.push(previewGoldItemAction(game, entry));
  }

  for (const entry of contextEffects.filter((item) => item.kind === "petSkillCan")) {
    const action = previewPetSkillCanAction(game, entry, item);
    if (!action.ok) return { usable: false, effect, reason: action.reason, skillId: entry.skillId };
    actions.push(action);
  }

  for (const entry of contextEffects.filter((item) => item.kind === "captureUp")) {
    const action = previewCaptureUpAction(game, entry);
    if (!action.ok) return { usable: false, effect, reason: action.reason };
    actions.push(action);
  }

  for (const entry of contextEffects.filter((item) => item.kind === "statusInflict")) {
    const action = previewStatusInflictAction(game, entry);
    if (!action.ok) return { usable: false, effect, reason: action.reason };
    actions.push(action);
  }

  const partyEffects = contextEffects.filter((entry) => ![
    "warp", "encounter", "noEncounter", "expBonus", "chikula", "metamo", "gold", "petSkillCan", "captureUp", "statusInflict"
  ].includes(entry.kind));
  const targets = itemPartyTargets(game);
  if (partyEffects.length) {
    const targetList = effect.scope === "all"
      ? targets
      : targets
        .map((target) => ({ target, score: itemTargetEffectScore(target, partyEffects) }))
        .sort((a, b) => b.score - a.score)
        .filter((entry) => entry.score > 0)
        .slice(0, 1)
        .map((entry) => entry.target);
    for (const target of targetList) {
      for (const entry of partyEffects) {
        const action = previewItemEffectOnTarget(target, entry);
        if (action) actions.push(action);
      }
    }
  }

  const usable = actions.length > 0;
  const hpAction = actions.find((action) => action.kind === "hp");
  return {
    usable,
    effect,
    actions,
    reason: usable ? "ok" : "no-target",
    target: hpAction?.target || actions[0]?.target || null,
    before: hpAction?.before,
    next: hpAction?.after,
    restored: hpAction?.restored || 0
  };
}

function previewGoldItemAction(game, effect) {
  const before = Math.max(0, Number(game.player?.stone || 0));
  const amount = Math.max(1, Number(effect.amount || 1));
  const after = Math.min(CHAR_MAXGOLDHAVE, before + amount);
  return {
    kind: "gold",
    targetName: "自己",
    before,
    after,
    amount: after - before,
    sourceFunction: effect.sourceFunction
  };
}

function previewPetSkillCanAction(game, effect, item = {}) {
  const targetPetIndex = getActivePetIndex(game);
  if (targetPetIndex < 0) return { ok: false, reason: "pet-skill-no-pet" };
  const pet = game.pets?.[targetPetIndex];
  if (!pet) return { ok: false, reason: "pet-skill-no-pet" };
  const skillId = Number(effect.skillId || 0);
  if (!skillId) return { ok: false, reason: "pet-skill-missing" };
  const currentSkillIds = Array.from({ length: 7 }, (_, index) => Number(pet.PetSkillIds?.[index] || pet.PetSkills?.[index]?.Id || 0));
  if (currentSkillIds.includes(skillId)) return { ok: false, reason: "pet-skill-known" };
  const slotIndex = currentSkillIds.findIndex((id) => !id);
  if (slotIndex < 0) return { ok: false, reason: "pet-skill-full" };
  const skill = item.skillCanned || { Id: skillId, Name: `技能 ${skillId}`, Source: `${GMSV_DATA_SOURCE}/petskill2.txt` };
  return {
    ok: true,
    kind: "petSkillCan",
    targetName: pet.Name || "宠物",
    petIndex: targetPetIndex,
    slotIndex,
    skillId,
    skill,
    sourceFunction: effect.sourceFunction
  };
}

function previewCaptureUpAction(game, effect) {
  if (!game.encounter) return { ok: false, reason: "battle-target-missing" };
  const target = game.encounter;
  const before = Math.max(0, Math.min(100, Number(target.CaptureRate || 0)));
  if (before <= 0 || target.npcEnemy) return { ok: false, reason: "capture-not-allowed" };
  const amount = clampInt(effect.amount, 1, 100, 5);
  const after = Math.min(100, before + amount);
  if (after <= before) return { ok: false, reason: "capture-already-max" };
  return {
    ok: true,
    kind: "captureUp",
    target,
    targetName: target.Name || "野外宠物",
    before,
    after,
    amount,
    sourceFunction: effect.sourceFunction
  };
}

function previewStatusInflictAction(game, effect) {
  if (!game.encounter) return { ok: false, reason: "battle-target-missing" };
  const target = game.encounter;
  if (Number(target.Hp || 0) <= 0) return { ok: false, reason: "battle-target-down" };
  if (!effect.status?.key) return { ok: false, reason: "status-inflict-missing" };
  return {
    ok: true,
    kind: "statusInflict",
    target,
    targetName: target.Name || "敌方",
    status: effect.status,
    sourceFunction: effect.sourceFunction
  };
}

function previewMetamoItemAction(game, effect) {
  if (effect.mode === "fixed" && Number(effect.imageNo || 0) > 0) {
    return {
      kind: "metamo",
      mode: "fixed",
      imageNo: Number(effect.imageNo),
      seconds: effect.seconds,
      formName: effect.formName || `形象 ${effect.imageNo}`,
      targetName: effect.formName || `形象 ${effect.imageNo}`,
      sourceFunction: effect.sourceFunction
    };
  }
  const activePet = getActivePet(game) || (game.pets || [])[0] || null;
  if (!activePet) return null;
  const imageNo = Number(activePet.ImgNo || activePet.BaseBaseImageNumber || activePet.BASEBASEIMAGENUMBER || activePet.PetId || 0);
  if (!Number.isFinite(imageNo) || imageNo <= 0) return null;
  return {
    kind: "metamo",
    mode: "activePet",
    imageNo,
    seconds: effect.seconds,
    formName: activePet.Name || "宠物",
    targetName: activePet.Name || "宠物",
    petIndex: Math.max(0, (game.pets || []).indexOf(activePet)),
    sourceFunction: effect.sourceFunction
  };
}

function previewItemEffectOnTarget(target, effect) {
  if (effect.kind === "hp") {
    const before = itemTargetHp(target);
    const maxHp = itemTargetMaxHp(target);
    if (effect.revive && before > 0) return null;
    if (!effect.revive && before <= 0) return null;
    const after = effect.revive
      ? Math.min(maxHp, Math.max(1, effect.amount))
      : Math.min(maxHp, before + effect.amount);
    if (after <= before) return null;
    return { kind: "hp", target, before, after, restored: after - before, revive: effect.revive, amount: effect.amount };
  }
  if (effect.kind === "mp") {
    const { current, max } = itemTargetMp(target, effect);
    const after = Math.min(max, current + effect.amount);
    if (after <= current) return null;
    return { kind: "mp", target, before: current, after, restored: after - current, amount: effect.amount };
  }
  if (effect.kind === "status") {
    const removed = itemTargetBattleStatusKeys(target, effect.keys);
    if (!removed.length) return null;
    return { kind: "status", target, removed, labels: effect.labels || [] };
  }
  if (effect.kind === "charm" && target.kind === "player") {
    const before = Number(target.entity.charm ?? target.entity.Charm ?? target.entity.CHARM ?? PLAYER_INITIAL_CHARM);
    const after = clampInt(before + effect.amount, 0, 100, before);
    if (after === before) return null;
    return { kind: "charm", target, before, after, amount: effect.amount };
  }
  if (effect.kind === "loyalty" && target.kind === "pet") {
    const before = Number(target.entity.Loyal ?? target.entity.loyal ?? 100);
    const after = clampInt(before + effect.amount, 0, 100, before);
    if (after === before) return null;
    return { kind: "loyalty", target, before, after, amount: effect.amount };
  }
  return null;
}

function previewRecoveryItem(game, item) {
  return previewItemUse(game, item);
}

function applyUsableItem(game, item, options = {}) {
  const preview = previewItemUse(game, item, options);
  if (!preview.effect?.usable) throw new Error(`${item.name} 还没有可模拟的使用效果`);
  if (!preview.usable) throw new Error(itemUseRefusalMessage(item, preview));

  const applied = [];
  for (const action of preview.actions) applyItemUseAction(game, action, applied, item);
  const consumption = consumeItemAfterUse(item, applied);
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  const hpAction = applied.find((action) => action.kind === "hp");
  return {
    itemId: item.id,
    itemName: item.name,
    targetName: hpAction?.targetName || applied[0]?.targetName || "自己",
    before: hpAction?.before,
    after: hpAction?.after,
    restored: hpAction?.restored || 0,
    effects: applied,
    summary: itemUseSummary(item.name, applied),
    remainingUses: consumption.remainingUses,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
}

function applyRecoveryItem(game, item) {
  return applyUsableItem(game, item);
}

function consumeItemAfterUse(item, applied = []) {
  const charged = applied.find((effect) => Number(effect.usesBefore || 0) > 1);
  if (charged) {
    item.usesRemaining = charged.usesAfter;
    item.damageBreak = charged.usesAfter;
    item.effectString = `${charged.kind === "warp" ? "传送" : "原地遇敌"}，可使用次数剩余${charged.usesAfter}次。`;
    return { qtyConsumed: 0, remainingUses: charged.usesAfter };
  }
  item.qty = Number(item.qty || 0) - 1;
  if (Number(item.qty || 0) > 0) {
    const resetUses = itemUseCount({ ...item, usesRemaining: undefined, damageBreak: item.maxUses ?? item.damageBreak });
    if (resetUses > 0) {
      item.usesRemaining = resetUses;
      item.damageBreak = resetUses;
    }
  }
  return { qtyConsumed: 1, remainingUses: Math.max(0, Number(item.usesRemaining || 0)) };
}

function applyItemUseAction(game, action, applied, item) {
  if (action.kind === "hp") {
    action.target.entity[action.target.hpKey] = action.after;
    applied.push({
      kind: "hp",
      targetName: action.target.name,
      before: action.before,
      after: action.after,
      restored: action.restored,
      revive: action.revive
    });
    return;
  }
  if (action.kind === "mp") {
    action.target.entity[action.target.maxMpKey] = itemTargetMaxMp(action.target, action);
    action.target.entity[action.target.mpKey] = action.after;
    applied.push({
      kind: "mp",
      targetName: action.target.name,
      before: action.before,
      after: action.after,
      restored: action.restored
    });
    return;
  }
  if (action.kind === "status") {
    for (const key of action.removed) delete action.target.entity.BattleStatuses?.[key];
    if (action.removed.includes(action.target.entity.BattleStatus?.key)) delete action.target.entity.BattleStatus;
    syncBattlePrimaryStatus(action.target.entity);
    applied.push({
      kind: "status",
      targetName: action.target.name,
      removed: action.removed,
      labels: action.labels
    });
    return;
  }
  if (action.kind === "charm") {
    action.target.entity.charm = action.after;
    action.target.entity.Charm = action.after;
    action.target.entity.CHARM = action.after;
    action.target.entity.WorkFixCharm = action.after;
    applied.push({
      kind: "charm",
      targetName: action.target.name,
      before: action.before,
      after: action.after,
      amount: action.amount
    });
    return;
  }
  if (action.kind === "loyalty") {
    action.target.entity.Loyal = action.after;
    applied.push({
      kind: "loyalty",
      targetName: action.target.name,
      before: action.before,
      after: action.after,
      amount: action.amount
    });
    return;
  }
  if (action.kind === "encounter") {
    applied.push({
      kind: "encounter",
      targetName: action.targetName || "原地",
      mapId: action.mapId,
      usesBefore: action.usesBefore,
      usesAfter: action.usesAfter,
      counter: action.counter,
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "noEncounter") {
    game.effects ||= {};
    const seconds = clampInt(action.seconds, 30, 3600, ITEM_NO_ENCOUNTER_SECONDS);
    const until = Math.max(Number(game.effects.noEncounterUntil || 0), Date.now() + seconds * 1000);
    game.effects.noEncounterUntil = until;
    game.effects.noEncounterReason = action.sourceFunction || "ITEM_useNoenemy";
    game.effects.noEncounterSource = item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`;
    game.walk ||= { steps: 0, encounterSteps: 0 };
    game.walk.encounterSteps = 0;
    applied.push({
      kind: "noEncounter",
      targetName: "自己",
      seconds,
      until,
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "expBonus") {
    game.effects ||= {};
    const power = clampInt(action.power, 1, 1000, 150);
    const minutes = clampInt(action.minutes, 1, 172800, 60);
    const multiplier = Number(action.multiplier) > 0 ? Number(action.multiplier) : 1 + (power * 2) / 100;
    const until = Date.now() + minutes * 60 * 1000;
    game.effects.expBonus = {
      power,
      minutes,
      multiplier,
      until,
      itemId: item.id,
      itemName: item.name,
      source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt ITEM_Addexp`
    };
    game.player.CHAR_WORKITEM_ADDEXP = power;
    game.player.CHAR_WORKITEM_ADDEXPTIME = minutes * 60;
    game.player.CHAR_ADDEXPPOWER = power;
    game.player.CHAR_ADDEXPTIME = minutes * 60;
    applied.push({
      kind: "expBonus",
      targetName: "自己",
      power,
      minutes,
      multiplier,
      until
    });
    return;
  }
  if (action.kind === "chikula") {
    game.effects ||= {};
    const resource = action.resource === "mp" ? "mp" : "hp";
    const amount = Math.max(1, Number(action.amount) || 1);
    const seconds = clampInt(action.seconds, 60, 86400, ITEM_CHIKULA_SECONDS);
    const until = Date.now() + seconds * 1000;
    game.effects.chikula = {
      resource,
      amount,
      until,
      itemId: item.id,
      itemName: item.name,
      source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt ITEM_ChikulaStone`
    };
    game.player.CHAR_WORKCHIKULAHP = resource === "hp" ? amount : 0;
    game.player.CHAR_WORKCHIKULAMP = resource === "mp" ? amount : 0;
    const before = resource === "mp" ? Number(game.player.mp || 0) : Number(game.player.hp || 0);
    if (resource === "mp") {
      const max = Math.max(before, Number(game.player.maxMp || 100), amount);
      game.player.maxMp = max;
      game.player.mp = Math.min(max, before + amount);
    } else {
      const max = Math.max(1, Number(game.player.maxHp || game.player.hp || 1));
      game.player.hp = Math.min(max, before + amount);
    }
    const after = resource === "mp" ? Number(game.player.mp || 0) : Number(game.player.hp || 0);
    applied.push({
      kind: "chikula",
      targetName: "自己",
      resource,
      amount,
      before,
      after,
      until
    });
    return;
  }
  if (action.kind === "metamo") {
    game.effects ||= {};
    game.player ||= {};
    const seconds = clampInt(action.seconds, 1, 24 * 60 * 60, ITEM_METAMO_DEFAULT_SECONDS);
    const until = Date.now() + seconds * 1000;
    const originalImageNo = Number(
      game.effects.metamo?.originalImageNo
      || game.player.CHAR_BASEBASEIMAGENUMBER
      || game.player.BaseBaseImageNumber
      || game.player.CHAR_BASEIMAGENUMBER
      || 0
    );
    game.effects.metamo = {
      mode: action.mode || "activePet",
      imageNo: Number(action.imageNo || 0),
      formName: action.formName || action.targetName || "",
      petIndex: Number(action.petIndex ?? -1),
      seconds,
      until,
      originalImageNo: Number.isFinite(originalImageNo) ? originalImageNo : 0,
      itemId: item.id,
      itemName: item.name,
      sourceFunction: action.sourceFunction || itemFunctionName(item),
      source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
    };
    game.effects.metamoUntil = until;
    game.player.CHAR_WORKITEMMETAMO = Math.ceil(until / 1000);
    game.player.CHAR_WORKNPCMETAMO = 0;
    game.player.CHAR_BASEIMAGENUMBER = Number(action.imageNo || 0);
    game.player.BaseImageNumber = Number(action.imageNo || 0);
    if (!game.player.CHAR_BASEBASEIMAGENUMBER) game.player.CHAR_BASEBASEIMAGENUMBER = game.effects.metamo.originalImageNo;
    applied.push({
      kind: "metamo",
      targetName: action.targetName || action.formName || "自己",
      imageNo: Number(action.imageNo || 0),
      seconds,
      until,
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "gold") {
    game.player ||= {};
    const before = Math.max(0, Number(game.player.stone || 0));
    const after = Math.min(CHAR_MAXGOLDHAVE, Math.max(0, Number(action.after || before)));
    game.player.stone = after;
    game.player.CHAR_GOLD = after;
    syncStoneItem(game);
    applied.push({
      kind: "gold",
      targetName: "自己",
      before,
      after,
      amount: Math.max(0, after - before),
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "petSkillCan") {
    const pet = game.pets?.[action.petIndex];
    if (!pet) return;
    pet.PetSkillIds = Array.from({ length: 7 }, (_, index) => Number(pet.PetSkillIds?.[index] || pet.PetSkills?.[index]?.Id || 0));
    pet.PetSkills = Array.from({ length: 7 }, (_, index) => pet.PetSkills?.[index] || null);
    const skill = action.skill || { Id: action.skillId, Name: `技能 ${action.skillId}` };
    pet.PetSkillIds[action.slotIndex] = Number(action.skillId || skill.Id || 0);
    pet.PetSkills[action.slotIndex] = compactPetSkillForSave(skill);
    syncCharacterFields(game);
    applied.push({
      kind: "petSkillCan",
      targetName: pet.Name || "宠物",
      petIndex: action.petIndex,
      slotIndex: action.slotIndex,
      skillId: Number(action.skillId || skill.Id || 0),
      skillName: skill.Name || `技能 ${action.skillId || ""}`,
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "captureUp") {
    const target = action.target || game.encounter;
    if (!target) return;
    const before = Math.max(0, Math.min(100, Number(target.CaptureRate || action.before || 0)));
    const after = Math.max(before, Math.min(100, Number(action.after || before)));
    target.CaptureRate = after;
    if (game.encounter && (game.encounter === target || game.encounter.Name === target.Name)) game.encounter.CaptureRate = after;
    syncActiveEnemyPartyEntry(game, target);
    applied.push({
      kind: "captureUp",
      targetName: action.targetName || target.Name || "野外宠物",
      before,
      after,
      amount: Math.max(0, after - before),
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "statusInflict") {
    const target = action.target || game.encounter;
    if (!target || !action.status?.key) return;
    const appliedStatus = applyBattleStatus(target, action.status, {
      chance: clampInt(action.status.percent, 0, 300, 100),
      roll: 0
    });
    syncActiveEnemyPartyEntry(game, target);
    applied.push({
      kind: "statusInflict",
      targetName: action.targetName || target.Name || "敌方",
      status: compactBattleStatusEffect(appliedStatus),
      turns: Number(appliedStatus.turns || 0),
      sourceFunction: action.sourceFunction
    });
    return;
  }
  if (action.kind === "warp") {
    const map = applyWarpTarget(game, action.target, item.name || "道具传送");
    applied.push({
      kind: "warp",
      targetName: map.name || `floor ${map.id}`,
      mapId: map.id,
      x: game.location.x,
      y: game.location.y,
      usesBefore: action.usesBefore,
      usesAfter: action.usesAfter,
      sourceFunction: action.sourceFunction
    });
  }
}

function itemUseRefusalMessage(item, preview) {
  if (preview.reason === "warp-map-missing") return `${item.name} 指向的地图还没有加载进当前 Worker`;
  if (preview.reason === "encounter-active") return "已经在战斗中，不能再次触发原地遇敌";
  if (preview.reason === "encounter-blocked") return `${preview.map?.name || "当前地图"} 不能触发原地遇敌：${wildEncounterBlockedText(preview.map, null)}`;
  if (preview.reason === "metamo-target-missing") return `${item.name} 需要可变身的宠物或来源形象`;
  if (preview.reason === "pet-skill-no-pet") return `${item.name} 需要先选择一只出战宠物`;
  if (preview.reason === "pet-skill-known") return "出战宠物已经会这个技能";
  if (preview.reason === "pet-skill-full") return "出战宠物技能栏已满，请先整理技能格";
  if (preview.reason === "capture-not-allowed") return "这个目标不能捕获，捕获率提升道具不能生效";
  if (preview.reason === "capture-already-max") return "这个目标的捕获率已经到上限";
  if (preview.reason === "battle-target-missing") return "战斗中需要先选择一个目标";
  if (preview.reason === "battle-target-down") return "这个目标已经倒下";
  if (preview.reason === "unsupported") return `${item.name} 还没有可模拟的使用效果`;
  return `${item.name} 当前没有合适的目标或状态可以生效`;
}

function itemUseSummary(itemName, effects = []) {
  const parts = effects.map((effect) => {
    if (effect.kind === "hp") return `${effect.targetName}${effect.revive ? "复活并" : ""}耐久力 ${effect.before}->${effect.after}`;
    if (effect.kind === "mp") return `${effect.targetName}气力 ${effect.before}->${effect.after}`;
    if (effect.kind === "status") return `${effect.targetName}解除${(effect.labels || effect.removed || []).join("/") || "异常"}`;
    if (effect.kind === "charm") return `${effect.targetName}魅力 ${effect.before}->${effect.after}`;
    if (effect.kind === "loyalty") return `${effect.targetName}忠诚度 ${effect.before}->${effect.after}`;
    if (effect.kind === "warp") return `传送到 ${effect.targetName} (${effect.x},${effect.y})`;
    if (effect.kind === "encounter") return effect.counter && Number(effect.usesAfter) >= 0
      ? `原地遇敌，剩余 ${effect.usesAfter} 次`
      : "原地遇敌";
    if (effect.kind === "noEncounter") return `避敌 ${effect.seconds} 秒`;
    if (effect.kind === "expBonus") return `经验加成 ${effect.power}%，${effect.minutes} 分钟`;
    if (effect.kind === "chikula") return `自动回复${effect.resource === "mp" ? "气力" : "耐久力"} ${effect.before}->${effect.after}`;
    if (effect.kind === "metamo") return `变身为 ${effect.targetName} ${effect.seconds} 秒`;
    if (effect.kind === "gold") return `获得石币 ${effect.before}->${effect.after}`;
    if (effect.kind === "petSkillCan") return `${effect.targetName} 学会 ${effect.skillName}（技能格 ${Number(effect.slotIndex) + 1}）`;
    if (effect.kind === "captureUp") return `${effect.targetName}捕获率 ${effect.before}->${effect.after}`;
    if (effect.kind === "statusInflict") return `${effect.targetName}进入${effect.status?.label || "异常"} ${effect.turns || ""} 回合`.trim();
    return "";
  }).filter(Boolean);
  return parts.length ? `${itemName}：${parts.join("；")}` : `${itemName} 已使用`;
}

function itemUseLogLine(itemUse) {
  return `使用 ${itemUse.itemName}，${itemUse.summary || itemUseSummary(itemUse.itemName, itemUse.effects)}。`;
}

async function talkGame(env, request, game, npcId) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);
  if (isNpcEnemy(npc)) {
    if (npcEnemyRequiresStartWindow(npc)) {
      openNpcEnemyStartWindow(game, npc);
    } else {
      await startNpcEnemyBattle(env, request, game, npc);
    }
    return withMap(game, { npc });
  }
  const reply = runNpcTalk(game, npc, "hi");
  openDialog(game, npc, [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", reply)
  ]);
  return withMap(game, { npc });
}

async function dialogGame(env, request, game, npcId, message) {
  const data = await loadGameData(env, request);
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);

  const text = message.trim().slice(0, 160);
  if (!text) {
    if (isNpcEnemy(npc)) {
      if (npcEnemyRequiresStartWindow(npc)) {
        openNpcEnemyStartWindow(game, npc);
      } else {
        await startNpcEnemyBattle(env, request, game, npc);
      }
      return withMap(game, { npc });
    }
    const reply = runNpcTalk(game, npc, "hi");
    openDialog(game, npc, [
      npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
      npcMessage("player", "hi"),
      npcMessage("npc", reply)
    ], { petSkillShop: buildPetSkillShopState(data, game, npc) });
    return withMap(game, { npc });
  }

  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc);
  const reply = await npcReply(env, request, game, npc, text);
  openDialog(game, npc, [
    ...existing,
    npcMessage("player", text),
    npcMessage("npc", reply)
  ], { petSkillShop: buildPetSkillShopState(data, game, npc) });
  addLog(game, `${game.player.name} 对 ${npc.name} 说：${text}`);
  addLog(game, `${npc.name}：${reply}`);
  return withMap(game, { npc });
}

async function dialogProposalGame(env, request, game, npcId, proposalId, decision, selectedPetIndex = NaN) {
  await loadGameData(env, request);
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc, NPC_INTERACTION_RANGE, "确认提案");
  const proposal = readPendingNpcProposal(game);
  if (!proposal || proposal.npcId !== npc.id || proposal.id !== proposalId) {
    throw userError("这个 NPC 没有等待确认的提案，或提案已经失效。");
  }
  if (proposal.expiresAt <= Date.now()) {
    clearPendingNpcProposal(game);
    openDialog(game, npc, [
      ...(game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc)),
      npcMessage("system", "这个提案已经过期，请重新和 NPC 交涉。")
    ]);
    return withMap(game, { npc });
  }

  const normalizedDecision = proposalDecision(decision);
  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc);
  if (normalizedDecision === "decline") {
    writeNpcSocialMemory(game, npc, {
      kind: "proposal-declined",
      text: `玩家拒绝「${proposal.title || npcProposalKindLabel(proposal.kind)}」`,
      weight: 1
    }, { declined: 1, affinity: -1 });
    recordNpcVmEvent(game, npc, "window", "blocked", { reason: "npc-proposal-declined", proposalId: proposal.id, kind: proposal.kind });
    clearPendingNpcProposal(game);
    const reply = `${npc.name} 点点头：那就按原来的规矩办。`;
    openDialog(game, npc, [...existing, npcMessage("player", "拒绝"), npcMessage("npc", reply)]);
    addLog(game, `${game.player.name} 拒绝了 ${npc.name} 的提案：${proposal.title || proposal.kind}`);
    return withMap(game, { npc });
  }
  if (normalizedDecision !== "accept") throw userError("decision 必须是 accept 或 decline。");

  const preflight = validateNpcProposalPublicRequirements(game, proposal, selectedPetIndex);
  if (!preflight.ok) {
    recordNpcVmEvent(game, npc, "window", "blocked", { reason: "npc-proposal-preflight-failed", proposalId: proposal.id, kind: proposal.kind, error: preflight.error });
    writeNpcSocialMemory(game, npc, {
      kind: "proposal-failed",
      text: `确认「${proposal.title || npcProposalKindLabel(proposal.kind)}」失败：${preflight.error}`,
      weight: 2
    }, { failed: 1, suspicion: 1 });
    openDialog(game, npc, [...existing, npcMessage("player", "同意"), npcMessage("npc", `${npc.name} 摇摇头：${preflight.error}。`)]);
    return withMap(game, { npc });
  }

  const executed = executeNpcProposalOnClone(game, npc, proposal, selectedPetIndex);
  if (!executed.ok) {
    recordNpcVmEvent(game, npc, "window", "blocked", { reason: "npc-proposal-confirm-failed", proposalId: proposal.id, kind: proposal.kind, error: executed.error });
    writeNpcSocialMemory(game, npc, {
      kind: "proposal-failed",
      text: `确认「${proposal.title || npcProposalKindLabel(proposal.kind)}」失败：${executed.error || "VM 拒绝"}`,
      weight: 2
    }, { failed: 1, suspicion: 1 });
    openDialog(game, npc, [...existing, npcMessage("player", "同意"), npcMessage("npc", executed.reply || `${npc.name} 没能办成：${executed.error || "条件不满足"}。`)]);
    return withMap(game, { npc });
  }

  const nextGame = executed.game;
  const nextMap = currentMap(nextGame);
  const nextNpc = nextMap.npcs.find((item) => item.id === npc.id) || npc;
  clearPendingNpcProposal(nextGame);
  writeNpcSocialMemory(nextGame, nextNpc, {
    kind: "proposal-accepted",
    text: `玩家接受「${proposal.title || npcProposalKindLabel(proposal.kind)}」`,
    weight: 2
  }, proposal.kind === "negotiatePass" && isThreateningNpcProposal(proposal)
    ? { helped: 1, threatened: 1, suspicion: 1 }
    : { helped: 1, trust: 1 });
  recordNpcVmEvent(nextGame, nextNpc, "window", "ok", { reason: "npc-proposal-confirmed", proposalId: proposal.id, kind: proposal.kind });
  const resultMessages = nextGame.dialog?.npcId === nextNpc.id ? nextGame.dialog.messages || [] : existing;
  openDialog(nextGame, nextNpc, [
    ...resultMessages,
    npcMessage("player", "同意"),
    npcMessage("npc", executed.reply)
  ]);
  addLog(nextGame, `${game.player.name} 接受了 ${nextNpc.name} 的提案：${proposal.title || proposal.kind}`);
  return withMap(nextGame, { npc: nextNpc });
}

function dialogAiModeGame(game, npcId, enabled) {
  game = normalizeGame(game);
  const map = currentMap(game);
  const npc = map.npcs.find((item) => item.id === npcId);
  if (!npc) throw new Error("这个 NPC 不在当前地图");
  assertNpcInteractionRange(game, npc);
  setNpcAiModeReply(game, npc, enabled);
  const existing = game.dialog?.npcId === npc.id ? game.dialog.messages || [] : npcInitialDialogMessages(game, npc);
  openDialog(game, npc, existing);
  addLog(game, `${npc.name} ${enabled ? "切换到 AI 对话" : "切回普通脚本对话"}。`);
  return withMap(game, { npc });
}

async function encounterGame(env, request, game) {
  game = normalizeGame(game);
  const map = currentMap(game);
  assertWildEncounterAllowed(map, game);
  await spawnEncounter(env, request, game, map, "野外");
  return withMap(game);
}

async function maybeStepEncounter(env, request, game, map) {
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.steps = Number(game.walk.steps || 0) + 1;
  if (!wildEncounterAllowed(map, game) || game.encounter) return false;
  if (hasActiveNoEncounterEffect(game)) {
    game.walk.encounterSteps = 0;
    return false;
  }
  game.walk.encounterSteps = Number(game.walk.encounterSteps || 0) + 1;
  const steps = game.walk.encounterSteps;
  if (steps < 5) return false;
  const chance = Math.min(0.38, 0.12 + (steps - 5) * 0.035);
  if (steps < 14 && Math.random() >= chance) return false;
  await spawnEncounter(env, request, game, map, "行走");
  game.walk.encounterSteps = 0;
  return true;
}

async function spawnEncounter(env, request, game, map, source) {
  assertWildEncounterAllowed(map, game);
  const encounter = await createEncounterParty(env, request, game, map);
  const enemy = encounter.enemies[0];
  if (!enemy) throw new Error("当前地图没有可遇敌宠物");
  game.encounter = enemy;
  ensureBattleState(game, activeBattleActor(game), enemy);
  if (game.battle) {
    game.battle.source = `${source} encounter from ${encounter.source}`;
    game.battle.enemyParty = encounter.enemies;
    game.battle.activeEnemyIndex = 0;
    game.battle.defeatedEnemies = [];
    game.battle.encounterArea = encounter.area ? {
      id: encounter.area.id,
      bounds: encounter.area.bounds,
      zorder: encounter.area.zorder,
      enemyMax: encounter.area.enemyMax,
      groupGates: (encounter.groupGates || []).slice(0, 8)
    } : null;
  }
  const partyText = encounter.enemies.length > 1 ? `等 ${encounter.enemies.length} 个敌人` : "";
  addLog(game, `${source}遇到了 ${enemy.Name} Lv.${enemy.Lv}${partyText}。`);
  return enemy;
}

function hasActiveNoEncounterEffect(game) {
  const until = Number(game.effects?.noEncounterUntil || 0);
  if (!Number.isFinite(until) || until <= 0) return false;
  if (until > Date.now()) return true;
  if (game.effects) delete game.effects.noEncounterUntil;
  return false;
}

async function createEncounterParty(env, request, game, map) {
  const data = await loadGameData(env, request);
  const area = chooseEncounterArea(map, game.location);
  if ((map.encounterAreas || []).some((item) => item.groups?.length) && !area) {
    return { enemies: [], area: null, source: `${GMSV_DATA_SOURCE}/encount.txt no active area at (${game.location?.x},${game.location?.y})` };
  }
  if (area?.groups?.length) {
    const groupGates = summarizeEncounterGroupGates(game, area);
    const availableGroups = area.groups.filter((group) => encounterGroupGateStatus(game, group).ok);
    if (!availableGroups.length) {
      return { enemies: [], area, groupGates, source: `${GMSV_DATA_SOURCE}/encount.txt area ${area.id} gated by ${GMSV_DATA_SOURCE}/group1.txt item rules` };
    }
    const enemies = [];
    const counts = new Map();
    const enemyMax = Math.max(1, Number(area.enemyMax || 1));
    const count = randRange(1, enemyMax);
    const attempts = Math.max(10, count * 8);
    for (let i = 0; enemies.length < count && i < attempts; i += 1) {
      const group = pickWeighted(availableGroups, (item) => item.weight);
      const entry = group ? pickWeighted(group.enemies || [], (item) => item.weight) : null;
      if (entry && Number(counts.get(entry.enemyId) || 0) >= Math.max(1, Number(entry.createMax || 1))) continue;
      const enemy = entry ? createWildEnemyFromSpec(data, entry, game, area, group) : null;
      if (enemy) {
        counts.set(entry.enemyId, Number(counts.get(entry.enemyId) || 0) + 1);
        enemies.push(enemy);
      }
    }
    if (enemies.length) {
      return {
        enemies,
        area,
        groupGates,
        source: `${GMSV_DATA_SOURCE}/encount.txt area ${area.id} + ${GMSV_DATA_SOURCE}/group1.txt + ${GMSV_DATA_SOURCE}/enemy1.txt + ${GMSV_DATA_SOURCE}/enemybase2.txt`
      };
    }
  }
  const petNo = pick(map.encounterPets || []);
  const enemy = createEnemy(data, petNo, Math.max(1, game.player.level + randInt(3) - 1));
  if (!enemy) return { enemies: [], area: null, source: `${GMSV_DATA_SOURCE}/encount.txt` };
  enemy.CaptureRate = wildCaptureRate(game, enemy);
  enemy.source = `${GMSV_DATA_SOURCE}/encount.txt fallback tempNo ${petNo} + ${GMSV_DATA_SOURCE}/enemybase2.txt`;
  return {
    enemies: [enemy],
    area: null,
    source: `${GMSV_DATA_SOURCE}/encount.txt fallback tempNo + ${GMSV_DATA_SOURCE}/enemybase2.txt`
  };
}

function encounterGroupCanAppear(game, group) {
  return encounterGroupGateStatus(game, group).ok;
}

function encounterGroupGateStatus(game, group) {
  const requiredItem = Number(group?.appearByItemId || 0);
  const required = requiredItem > 0 ? encounterGateItemSummary(game, requiredItem) : null;
  const blockedItem = Number(group?.notAppearByItemId || 0);
  const blocked = blockedItem > 0 ? encounterGateItemSummary(game, blockedItem) : null;
  const missingRequired = Boolean(required && required.have <= 0);
  const forbiddenHeld = Boolean(blocked && blocked.have > 0);
  return {
    ok: !missingRequired && !forbiddenHeld,
    ...(required ? { requiredItem: required, missingRequired } : {}),
    ...(blocked ? { blockedItem: blocked, forbiddenHeld } : {})
  };
}

function encounterGateItemSummary(game, id) {
  const sourceItem = cache?.itemSet?.get(Number(id)) || worldTradeItemIndex().get(Number(id)) || {};
  const sourceName = usableReferenceName(sourceItem.name) ? sourceItem.name : "";
  return {
    id: Number(id),
    name: sourceName || conditionItemName(game, id) || `item ${id}`,
    have: inventoryQty(game, id),
    qty: 1
  };
}

function summarizeEncounterGroupGates(game, area) {
  const rows = [];
  for (const group of area?.groups || []) {
    if (!Number(group?.appearByItemId || 0) && !Number(group?.notAppearByItemId || 0)) continue;
    const status = encounterGroupGateStatus(game, group);
    rows.push({
      groupId: Number(group.groupId || 0),
      available: Boolean(status.ok),
      ...(status.requiredItem ? { requiredItem: status.requiredItem, missingRequired: Boolean(status.missingRequired) } : {}),
      ...(status.blockedItem ? { blockedItem: status.blockedItem, forbiddenHeld: Boolean(status.forbiddenHeld) } : {}),
      enemies: encounterGroupEnemySummary(group),
      source: `${GMSV_DATA_SOURCE}/group1.txt group ${group.groupId || "?"}`
    });
    if (rows.length >= 8) break;
  }
  return rows;
}

function encounterGroupEnemySummary(group) {
  return (group?.enemies || [])
    .slice(0, 3)
    .map((entry) => {
      const enemyId = Number(entry.enemyId || 0);
      const name = sourceScriptEnemyPetName(enemyId);
      return {
        enemyId,
        ...(name ? { name } : {}),
        lvMin: Number(entry.lvMin || 0),
        lvMax: Number(entry.lvMax || 0),
        weight: Number(entry.weight || 0)
      };
    })
    .filter((entry) => entry.enemyId > 0);
}

function currentEncounterGateSummary(game, map) {
  if (!encounterSourceDataAvailable(map) || isSafeWildEncounterMap(map)) return [];
  const area = chooseEncounterArea(map, game.location);
  return summarizeEncounterGroupGates(game, area);
}

function guideEncounterGateSummary(game, map, limit = 4) {
  return currentEncounterGateSummary(game, map)
    .slice(0, limit)
    .map((gate) => ({
      groupId: Number(gate.groupId || 0),
      available: Boolean(gate.available),
      ...(gate.requiredItem ? { requiredItem: gate.requiredItem, missingRequired: Boolean(gate.missingRequired) } : {}),
      ...(gate.blockedItem ? { blockedItem: gate.blockedItem, forbiddenHeld: Boolean(gate.forbiddenHeld) } : {}),
      enemies: (gate.enemies || []).slice(0, 3),
      source: gate.source
    }));
}

function guideEncounterGateText(gates = []) {
  const lines = [];
  for (const gate of gates || []) {
    const parts = [];
    if (gate.requiredItem) {
      const item = gate.requiredItem;
      parts.push(`需要 ${item.name || `item ${item.id}`} x${item.qty || 1}（当前 ${item.have || 0}${gate.missingRequired ? "，缺少" : "，已满足"}）`);
    }
    if (gate.blockedItem) {
      const item = gate.blockedItem;
      parts.push(`不能持有 ${item.name || `item ${item.id}`}（当前 ${item.have || 0}${gate.forbiddenHeld ? "，会阻止出现" : "，已满足"}）`);
    }
    if (!parts.length) continue;
    const enemyHint = (gate.enemies || [])
      .map((enemy) => {
        const label = enemy.name || sourceScriptEnemyPetName(enemy.enemyId) || `enemy ${enemy.enemyId}`;
        return `${label}${enemy.lvMin || enemy.lvMax ? ` Lv.${enemy.lvMin || "?"}-${enemy.lvMax || "?"}` : ""}`;
      })
      .join("、");
    lines.push(`group ${gate.groupId || "?"}：${parts.join("；")}${enemyHint ? `；敌组 ${enemyHint}` : ""}`);
  }
  return lines.join(" | ");
}

function chooseEncounterArea(map, location) {
  const x = Number(location?.x || 0);
  const y = Number(location?.y || 0);
  const areas = (map.encounterAreas || []).filter((area) => area.groups?.length);
  const inside = areas
    .filter((area) => pointInBounds(x, y, area.bounds))
    .sort((a, b) => Number(b.zorder || 0) - Number(a.zorder || 0));
  return inside[0] || null;
}

function pointInBounds(x, y, bounds = []) {
  return x >= Number(bounds[0] || 0)
    && y >= Number(bounds[1] || 0)
    && x <= Number(bounds[2] || 0)
    && y <= Number(bounds[3] || 0);
}

function createWildEnemyFromSpec(data, entry, game, area, group) {
  const enemy = createEnemyFromEnemySpec(data, Number(entry.enemyId), null);
  if (!enemy) return null;
  enemy.CaptureRate = wildCaptureRate(game, enemy);
  enemy.source = [
    `${GMSV_DATA_SOURCE}/encount.txt area ${area.id}`,
    `${GMSV_DATA_SOURCE}/group1.txt group ${group.groupId}`,
    `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${entry.enemyId}`,
    `${GMSV_DATA_SOURCE}/enemybase2.txt ${entry.tempNo}`
  ].join(" + ");
  return enemy;
}

function wildCaptureRate(game, enemy) {
  return Math.max(18, Math.min(75, 70 - Number(enemy.Rare || 0) + Number(game.player?.level || 1) * 2));
}

function pickWeighted(items, weightOf) {
  const weighted = (items || [])
    .map((item) => ({ item, weight: Math.max(0, Number(weightOf(item)) || 0) }))
    .filter((entry) => entry.weight > 0);
  if (!weighted.length) return null;
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

async function npcEnemyReply(env, request, game, npc, lower) {
  if (isNpcEnemyStartChoice(lower)) return startNpcEnemyBattle(env, request, game, npc);
  if (isNoChoice(lower)) {
    runNpcVmAction(game, npc, {
      type: "window",
      status: "cancel",
      reason: "npcenemy-start",
      windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
      select: "no",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    const denied = npcEnemyDeniedMessage(npc);
    recordNpcVmEvent(game, npc, "say", "ok", { line: denied, reason: "npcenemy-denied" });
    return denied;
  }
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "npcenemy-start",
    windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
    buttons: "YESNO",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  return npcEnemyAskMessage(npc);
}

function isYesChoice(text) {
  return /(^|\s)(yes|y|ok)(\s|$)/i.test(text)
    || hasAny(text, ["是", "好", "确定", "確定", "确认", "確認", "愿意", "願意", "可以", "来吧", "來吧", "决胜负", "決勝負", "战斗", "戰鬥", "开战", "開戰", "開始", "开始"]);
}

function isNoChoice(text) {
  return /(^|\s)(no|n|cancel)(\s|$)/i.test(text)
    || hasAny(text, ["否", "不", "算了", "取消", "不要", "拒绝", "拒絕", "离开", "離開", "不开战", "不開戰", "先不"]);
}

function isNpcEnemyStartChoice(text) {
  return isYesChoice(text)
    || hasAny(text, ["挑战", "挑戰", "打一架", "打架", "开打", "開打", "攻击", "攻擊", "我要打", "我要战斗", "我要戰鬥", "开始战斗", "開始戰鬥"]);
}

function npcEnemyItemEntries(game, items = []) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const id = Number(item?.id ?? item?.itemId ?? item);
      if (!Number.isFinite(id) || id <= 0) return null;
      const sourceItem = cache?.itemSet?.get(id) || worldTradeItemIndex().get(id) || {};
      const qty = Math.max(1, Number(item?.qty || item?.amount || 1));
      return {
        ...sourceItem,
        ...item,
        id,
        qty,
        name: item?.name || sourceItem.name || conditionItemName(game, id) || `item ${id}`,
        source: item?.source || sourceItem.source || `${GMSV_DATA_SOURCE}/npc_npcenemy.c item`
      };
    })
    .filter(Boolean);
}

function npcEnemyBattleGate(game, npc) {
  const npcEnemy = npc?.npcEnemy || {};
  const missingRequired = npcEnemyItemEntries(game, npcEnemy.requiredItems)
    .map((item) => ({ ...item, have: inventoryQty(game, item.id) }))
    .filter((item) => item.have < item.qty);
  const forbiddenHeld = npcEnemyItemEntries(game, npcEnemy.forbiddenItems)
    .map((item) => ({ ...item, have: inventoryQty(game, item.id) }))
    .filter((item) => item.have > 0);
  const ok = missingRequired.length === 0 && forbiddenHeld.length === 0;
  if (ok) return { ok: true, missingRequired, forbiddenHeld };
  const parts = [];
  if (missingRequired.length) {
    parts.push(`需要：${missingRequired.map((item) => `${item.name} ${item.have}/${item.qty}`).join("、")}`);
  }
  if (forbiddenHeld.length) {
    parts.push(`不能携带：${forbiddenHeld.map((item) => `${item.name} x${item.have}`).join("、")}`);
  }
  const denied = npcEnemyDeniedMessage(npc);
  const message = [denied, parts.join("；")].filter(Boolean).join("\n");
  return { ok: false, missingRequired, forbiddenHeld, message };
}

function takeNpcEnemyStealItems(game, npc) {
  if (!npc?.npcEnemy?.stealItems) return [];
  const stolen = [];
  for (const item of npcEnemyItemEntries(game, npc.npcEnemy.requiredItems)) {
    const event = runNpcVmAction(game, npc, {
      type: "take",
      itemId: item.id,
      itemName: item.name,
      qty: item.qty,
      reason: "npcenemy-steal",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    if (event.ok) stolen.push(item);
  }
  return stolen;
}

async function startNpcEnemyBattle(env, request, game, npc) {
  if (npc.npcEnemy?.oneBattle && game.encounter && game.battle?.npcEnemy?.npcId === npc.id) {
    const already = npc.npcEnemy?.alreadyMessage || `${npc.name} 已经在战斗中。`;
    recordNpcVmEvent(game, npc, "startBattle", "blocked", {
      reason: "npcenemy-onebattle",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    recordNpcVmEvent(game, npc, "say", "ok", { line: already, reason: "npcenemy-onebattle" });
    return already;
  }
  const gate = npcEnemyBattleGate(game, npc);
  if (!gate.ok) {
    recordNpcVmEvent(game, npc, "startBattle", "blocked", {
      reason: gate.missingRequired.length ? "npcenemy-required-item" : "npcenemy-forbidden-item",
      missingRequired: gate.missingRequired.map((item) => ({ id: item.id, name: item.name, qty: item.qty, have: item.have })),
      forbiddenHeld: gate.forbiddenHeld.map((item) => ({ id: item.id, name: item.name, qty: item.qty, have: item.have })),
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    recordNpcVmEvent(game, npc, "say", "ok", { line: gate.message, reason: "npcenemy-item-gate" });
    return gate.message;
  }
  const enemies = await createNpcEnemyEncounterParty(env, request, game, npc);
  if (!enemies.length) {
    recordNpcVmEvent(game, npc, "startBattle", "blocked", {
      reason: "missing-enemyno",
      enemyNos: npc.npcEnemy?.enemyNos || [],
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    return `${npc.name} 的 NPCEnemy 脚本没有可用的 enemyno，无法开战。`;
  }
  const enemy = enemies[0];
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "npcenemy-start",
    windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
    select: "yes",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  const event = runNpcVmAction(game, npc, {
    type: "startBattle",
    enemy,
    enemies,
    reason: "npcenemy",
    enemyNos: npc.npcEnemy?.enemyNos || [],
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  if (!event.ok) return `${npc.name} 找不到可用的敌人资料：${event.error || "startBattle 被 VM 拒绝"}。`;
  const stolenItems = takeNpcEnemyStealItems(game, npc);
  if (game.battle) {
    const startMessage = npcEnemyStartMessage(npc);
    game.battle.source = `gmsv/npc/npc_npcenemy.c NPC_NPCEnemy_BattleIn + ${npc.npcEnemy?.source || npc.script || npc.source || ""}`;
    game.battle.sourceCommand = "YES";
    game.battle.npcEnemy = {
      npcId: npc.id,
      npcName: npc.name,
      source: npc.npcEnemy?.source || npc.script || npc.source || "",
      dieAct: Number(npc.npcEnemy?.dieAct || 0),
      respawnSeconds: Number(npc.npcEnemy?.respawnSeconds || 0),
      oneBattle: Boolean(npc.npcEnemy?.oneBattle),
      alreadyMessage: npc.npcEnemy?.alreadyMessage || "",
      startMessage,
      endMessage: npc.npcEnemy?.endMessage || "",
      warp: npc.npcEnemy?.warp || null,
      requiredItems: npcEnemyItemEntries(game, npc.npcEnemy?.requiredItems),
      forbiddenItems: npcEnemyItemEntries(game, npc.npcEnemy?.forbiddenItems),
      stealItems: Boolean(npc.npcEnemy?.stealItems),
      stolenItems,
      addItems: npcEnemyItemEntries(game, npc.npcEnemy?.addItems),
      replacementPoints: Array.isArray(npc.npcEnemy?.replacementPoints) ? npc.npcEnemy.replacementPoints : [],
      postBattleEvents: Array.isArray(npc.npcEnemy?.postBattleEvents) ? npc.npcEnemy.postBattleEvents : []
    };
    if (startMessage) game.battle.log = [...(game.battle.log || []), `${npc.name}：${startMessage}`].slice(-8);
    if (stolenItems.length) {
      game.battle.log = [...(game.battle.log || []), `${npc.name} 收走了 ${stolenItems.map((item) => `${item.name} x${item.qty}`).join("、")}。`].slice(-8);
    }
  }
  const startMessage = npcEnemyStartMessage(npc);
  const enemyList = enemies.map((item) => `${item.Name} Lv.${item.Lv}`).join("、");
  if (startMessage) addLog(game, `${npc.name}：${startMessage}`);
  if (stolenItems.length) addLog(game, `${npc.name} 收走了 ${stolenItems.map((item) => `${item.name} x${item.qty}`).join("、")}。`);
  addLog(game, `${npc.name} 召出 ${enemyList}。`);
  return `${startMessage}\n${enemyList} 出现了。`;
}

async function createNpcEnemyEncounterParty(env, request, game, npc) {
  const data = await loadGameData(env, request);
  return (npc.npcEnemy?.enemyNos || [])
    .map((enemyNo) => createEnemyFromEnemySpec(data, Number(enemyNo), {
      npcId: npc.id,
      npcName: npc.name,
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    }))
    .filter(Boolean);
}

function createEnemyFromEnemySpec(data, enemyId, npcEnemy = null) {
  const spec = data.enemySpecsById.get(Number(enemyId));
  if (!spec) return null;
  const level = randRange(spec.lvMin, spec.lvMax);
  const enemy = createEnemy(data, spec.tempNo, level);
  if (!enemy) return null;
  enemy.EnemyId = spec.id;
  enemy.EnemyTempNo = spec.tempNo;
  enemy.EnemyLvMin = spec.lvMin;
  enemy.EnemyLvMax = spec.lvMax;
  enemy.EnemyCreateMin = spec.createMin;
  enemy.EnemyCreateMax = spec.createMax;
  enemy.WorkTactics = Number(spec.tactics || 1);
  enemy.WorkTacticsOption = spec.tacticsOption || enemy.WorkTacticsOption || "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0";
  if (Number(spec.exp || 0) > 0) {
    enemy.Exp = Number(spec.exp);
    enemy.SourceExp = Number(spec.exp);
    enemy.EnemyExp = Number(spec.exp);
  }
  enemy.DuelPoint = Number(spec.duelPoint || enemy.DuelPoint || 0);
  enemy.EnemyStyle = Number(spec.style || 0);
  enemy.WorkPetFlag = Number(spec.petFlg || enemy.WorkPetFlag || 0);
  enemy.EnemyDropTable = enemyDropTableForSpec(data, spec);
  enemy.EnemyDropItems = rollEnemyDropItems(data, spec);
  enemy.CaptureRate = 0;
  enemy.source = `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${spec.id} -> ${GMSV_DATA_SOURCE}/enemybase2.txt ${spec.tempNo}`;
  if (npcEnemy) enemy.npcEnemy = npcEnemy;
  return enemy;
}

function enemyDropTableForSpec(data, spec = {}) {
  return (spec.drops || [])
    .map((entry) => battleDropItemFromSource(data, entry.itemId, {
      slot: Number(entry.slot || 0),
      probability: Number(entry.probability || 0),
      rollBase: ENEMY_DROP_ROLL_BASE,
      source: `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${spec.id} ITEM${Number(entry.slot || 0) || ""}/ITEMPROB${Number(entry.slot || 0) || ""}`
    }))
    .filter(Boolean);
}

function rollEnemyDropItems(data, spec = {}) {
  return (spec.drops || [])
    .filter((entry) => Number(entry.itemId || 0) > 0 && Number(entry.probability || 0) > 0)
    .filter((entry) => randInt(ENEMY_DROP_ROLL_BASE) < Number(entry.probability || 0))
    .map((entry) => battleDropItemFromSource(data, entry.itemId, {
      slot: Number(entry.slot || 0),
      probability: Number(entry.probability || 0),
      rollBase: ENEMY_DROP_ROLL_BASE,
      source: `${GMSV_DATA_SOURCE}/enemy1.txt enemy ${spec.id} ITEM${Number(entry.slot || 0) || ""}/ITEMPROB${Number(entry.slot || 0) || ""}`
    }))
    .filter(Boolean);
}

function battleDropItemFromSource(data, itemId, meta = {}) {
  const id = Number(itemId || 0);
  if (!id) return null;
  const sourceItem = data?.itemSet?.get(id) || cache?.itemSet?.get(id) || worldTradeItemIndex().get(id);
  const item = {
    ...(sourceItem || {}),
    id,
    name: sourceItem?.name || `item ${id}`,
    qty: 1,
    source: meta.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
  hydrateRuntimeItemEffect(item, data);
  return {
    id: item.id,
    name: item.name,
    qty: 1,
    image: item.image,
    type: item.type,
    useField: item.useField,
    target: item.target,
    level: item.level,
    price: item.price,
    cost: item.cost,
    description: item.description,
    secretName: item.secretName,
    category: item.category,
    option: item.option,
    effectOption: item.effectOption,
    functionName: item.functionName,
    useFunction: item.useFunction,
    damageBreak: item.damageBreak,
    maxUses: item.maxUses,
    usesRemaining: item.usesRemaining,
    slot: Number(meta.slot || 0),
    probability: Number(meta.probability || 0),
    rollBase: Number(meta.rollBase || ENEMY_DROP_ROLL_BASE),
    source: item.source
  };
}

function captureGame(game) {
  game = normalizeGame(game);
  const outcome = performBattleAction(game, "capture");
  recordBattleOutcome(game, outcome);
  return withMap(game, {
    captured: outcome.result === "captured",
    battleOutcome: outcome
  });
}

async function battleGame(env, request, game, action) {
  const data = await loadGameData(env, request);
  game = normalizeGame(game);
  hydrateGameInventoryFromSource(game, data?.itemSet);
  hydrateGameInventoryRuntimeEffects(game, data);
  const outcome = performBattleAction(game, action);
  recordBattleOutcome(game, outcome);
  return withMap(game, { battleOutcome: outcome });
}

function performBattleAction(game, action) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const move = normalizeBattleMove(action);
  if (move.type === "escape") {
    return move.release ? performReleaseBattleAction(game) : performPlayerEscapeAction(game);
  }
  if (move.targetIndex != null) selectBattleTarget(game, move.targetIndex);
  if (move.type === "capture") {
    return performCaptureAction(game);
  }
  if (move.type === "item") {
    return performBattleItemAction(game, move.itemId);
  }
  if (move.type === "pet-switch") {
    return performPetSwitchBattleAction(game, move);
  }
  if (move.type === "pet-skill") {
    return performPetSkillAction(game, move);
  }
  if (!["attack", "guard", "wait"].includes(move.type)) throw new Error("这个战斗动作还没有实现");
  const activeActor = activeBattleActor(game);
  ensureBattleState(game, activeActor, game.encounter);

  const enemy = game.encounter;
  const enemyName = enemy.Name;
  const actorName = battleActorName(game, activeActor);
  const supportActor = move.type === "attack" ? sourceBattleSupportActor(game, activeActor) : null;
  const battleLog = [];
  const enemyAi = chooseEnemyBattleMove(game, enemy, activeActor);
  const playerAction = sourcePlayerBattleAction(move, game, activeActor, enemy);
  if (supportActor) playerAction.supportAction = sourceAllySupportBattleAction(game, supportActor, enemy);
  let enemyEscaped = false;
  game.battle.sourceCommand = move.command;
  game.battle.playerAction = playerAction;
  game.battle.enemyAi = enemyAi;
  game.battle.mode = "resolving";
  const actorTurn = (actor) => {
    const turnActorName = battleActorName(game, actor);
    let hit = combatDamageDetail(actor, enemy);
    if (enemyAi.type === "guard") {
      hit = applySourceGuardAdjust(hit, [
        "enemy-guard",
        enemy.EnemyId || enemy.PetId || enemy.Name,
        battleActorIdentity(game, actor),
        game.battle?.turn || 0,
        enemy.Hp,
        battleActorHp(game, actor)
      ]);
      enemyAi.guardAdjust = hit.guardAdjust;
    }
    enemy.Hp = Math.max(0, Number(enemy.Hp || 0) - hit.damage);
    battleLog.push(`${turnActorName} 攻击 ${enemy.Name}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
  };
  const enemyTurn = (guarded = false) => {
    const ended = resolveEnemyBattleTurn(game, enemy, activeActor, enemyAi, playerAction, battleLog, guarded);
    enemyEscaped ||= ended;
    return ended;
  };

  if (move.type === "guard") {
    battleLog.push(`${actorName} 采取防御姿势。`);
    enemyTurn(true);
  } else if (move.type === "wait") {
    battleLog.push(`${actorName} 等待时机。`);
    enemyTurn(false);
  } else {
    const turnOrder = [
      { type: "ally", actor: activeActor, quick: workQuick(activeActor) },
      ...(supportActor ? [{ type: "ally", actor: supportActor, quick: workQuick(supportActor) }] : []),
      { type: "enemy", quick: workQuick(enemy) }
    ].sort((a, b) => Number(b.quick || 0) - Number(a.quick || 0) || (a.type === "ally" ? -1 : 1));
    for (const turn of turnOrder) {
      if (enemy.Hp <= 0 || enemyEscaped) break;
      if (turn.type === "enemy") {
        enemyTurn(false);
      } else if (battleActorHp(game, turn.actor) > 0) {
        actorTurn(turn.actor);
      }
    }
  }

  return settleBattleRound(game, activeActor, enemy, {
    battleLog,
    result: "turn",
    sourceCommand: move.command,
    playerAction,
    enemyAi,
    enemyEscaped
  });
}

function performReleaseBattleAction(game) {
  const enemyName = game.encounter.Name || "野外宠物";
  const activePet = getActivePet(game);
  if (activePet) clearBattleRuntimeEffects(activePet);
  game.encounter = null;
  game.battle = null;
  const line = `你放走了 ${enemyName}，战斗结束。`;
  addLog(game, line);
  return { result: "released", enemyName, sourceCommand: "E", log: [line] };
}

function performPlayerEscapeAction(game) {
  const enemy = game.encounter;
  const activeActor = activeBattleActor(game);
  ensureBattleState(game, activeActor, enemy);
  game.battle.sourceCommand = "E";
  game.battle.mode = "resolving";
  const playerEscape = resolvePlayerEscapeAttempt(game, enemy);
  const enemyName = enemy.Name || "野外宠物";
  if (playerEscape.succeeded) {
    const turnCount = Number(game.battle.turn || 0) + 1;
    game.battle.turn = turnCount;
    const line = `你从 ${enemyName} 面前逃跑成功。`;
    clearPetBattleRuntimeEffects(game, activeActor);
    game.encounter = null;
    game.battle = null;
    addLog(game, line);
    return {
      result: "escaped",
      enemyName,
      petName: battleActorKind(game, activeActor) === "pet" ? battleActorName(game, activeActor) : "",
      sourceCommand: "E",
      playerEscape,
      playerExp: 0,
      petExp: 0,
      stone: 0,
      defeatedEnemies: [],
      escapedEnemies: [],
      sourceResults: [],
      lootItems: [],
      turns: turnCount,
      log: [line]
    };
  }
  const battleLog = [`你试图从 ${enemyName} 面前逃跑，但是失败了。`];
  if (enemy.Hp > 0) {
    const hit = combatDamageDetail(enemy, activeActor);
    setBattleActorHp(game, activeActor, battleActorHp(game, activeActor) - hit.damage);
    battleLog.push(`${enemy.Name} 趁机攻击 ${battleActorName(game, activeActor)}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
  }
  return settleBattleRound(game, activeActor, enemy, {
    battleLog,
    result: "escape-failed",
    sourceCommand: "E",
    playerEscape
  });
}

function performPetSwitchBattleAction(game, move) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const currentPet = getActivePet(game);
  const currentActor = currentPet || game.player;
  ensureBattleState(game, currentActor, game.encounter);

  const currentIndex = getActivePetIndex(game);
  const targetIndex = chooseBattleSwitchPetIndex(game, move.petIndex, currentIndex);
  if (targetIndex === currentIndex) throw new Error("这只宠物已经在战斗中");

  if (targetIndex < 0) {
    if (!currentPet) throw new Error("当前没有出战宠物可收回");
    clearBattleRuntimeEffects(currentPet);
    ensurePetFormation(game).activeIndex = -1;
    const activeActor = game.player;
    ensureBattleState(game, activeActor, game.encounter);
    const enemy = game.encounter;
    const sourceCommand = sourcePetSwitchCommand(-1);
    const enemyAi = chooseEnemyBattleMove(game, enemy, activeActor);
    const playerAction = sourcePlayerPetSwitchAction(sourceCommand, currentPet, null, currentIndex, -1);
    const battleLog = [`${currentPet.Name} 回到队伍后方，${battleActorName(game, activeActor)} 独自应战。`];
    let enemyEscaped = false;
    game.battle.sourceCommand = sourceCommand;
    game.battle.playerAction = playerAction;
    game.battle.enemyAi = enemyAi;
    game.battle.mode = "resolving";
    if (enemy.Hp > 0) {
      enemyEscaped = resolveEnemyBattleTurn(game, enemy, activeActor, enemyAi, playerAction, battleLog, false);
    }
    return settleBattleRound(game, activeActor, enemy, {
      battleLog,
      result: "pet-in",
      sourceCommand,
      playerAction,
      enemyAi,
      enemyEscaped
    });
  }

  const nextPet = game.pets[targetIndex];
  if (!nextPet) throw new Error("没有找到要出战的宠物");
  if (Number(nextPet.Hp ?? nextPet.WorkMaxHp ?? 0) <= 0) {
    throw new Error(`${nextPet.Name || "这只宠物"} 已经倒下，不能在战斗中出战`);
  }

  if (currentPet) clearBattleRuntimeEffects(currentPet);
  ensurePetFormation(game).activeIndex = targetIndex;
  ensureBattleState(game, nextPet, game.encounter);

  const enemy = game.encounter;
  const sourceCommand = sourcePetSwitchCommand(targetIndex);
  const enemyAi = chooseEnemyBattleMove(game, enemy, nextPet);
  const playerAction = sourcePlayerPetSwitchAction(sourceCommand, currentPet, nextPet, currentIndex, targetIndex);
  const battleLog = [currentPet ? `${currentPet.Name} 退下，${nextPet.Name} 出战。` : `${nextPet.Name} 出战。`];
  let enemyEscaped = false;
  game.battle.sourceCommand = sourceCommand;
  game.battle.playerAction = playerAction;
  game.battle.enemyAi = enemyAi;
  game.battle.mode = "resolving";
  if (enemy.Hp > 0) {
    enemyEscaped = resolveEnemyBattleTurn(game, enemy, nextPet, enemyAi, playerAction, battleLog, false);
  }

  return settleBattleRound(game, nextPet, enemy, {
    battleLog,
    result: currentPet ? "pet-switch" : "pet-out",
    sourceCommand,
    playerAction,
    enemyAi,
    enemyEscaped
  });
}

function chooseBattleSwitchPetIndex(game, requestedIndex, currentIndex) {
  const pets = game.pets || [];
  if (requestedIndex != null && Number.isFinite(Number(requestedIndex))) {
    const index = Math.trunc(Number(requestedIndex));
    if (index < 0) return -1;
    if (index >= pets.length) throw new Error("没有找到要出战的宠物");
    return index;
  }
  const next = pets.findIndex((pet, index) => index !== currentIndex && Number(pet?.Hp ?? pet?.WorkMaxHp ?? 0) > 0);
  if (next < 0) throw new Error("没有可切换的后备宠物");
  return next;
}

function normalizeBattleMove(action) {
  const value = String(action || "attack").toLowerCase();
  const itemMatch = value.match(/^item[:|](\d+)$/);
  if (itemMatch) return { type: "item", command: "I", itemId: Number(itemMatch[1]) };
  const petMatch = value.match(/^(pet|宠物|寵物|换宠|換寵|出战|出戰|s)[:|](-?\d+)$/);
  if (petMatch) {
    const petIndex = Math.trunc(Number(petMatch[2]));
    return {
      type: "pet-switch",
      command: sourcePetSwitchCommand(petIndex),
      petIndex
    };
  }
  const skillMatch = value.match(/^(skill|pet-skill|petskill|技能|宠技|寵技|w)[:|](\d+)(?:[:|](\d+))?$/);
  if (skillMatch) {
    const skillSlot = Math.max(0, Number(skillMatch[2]) || 0);
    const targetIndex = Math.max(0, Number(skillMatch[3]) || 0);
    return {
      type: "pet-skill",
      command: sourcePetSkillCommand(skillSlot, targetIndex),
      skillSlot,
      targetIndex
    };
  }
  const targetNoMatch = value.match(/^(attackno|hno|captureno|catchno)[:|](\d+)$/);
  if (targetNoMatch) {
    const targetNo = Math.max(0, Math.trunc(Number(targetNoMatch[2]) || 0));
    const targetIndex = enemyIndexFromBattleNo(targetNo);
    const isCapture = ["captureno", "catchno"].includes(targetNoMatch[1]);
    return {
      type: isCapture ? "capture" : "attack",
      command: sourceTargetBattleCommand(isCapture ? "T" : "H", targetNo),
      targetIndex,
      targetNo
    };
  }
  const targetMatch = value.match(/^(attack|h|攻击|打|capture|catch|捕获|抓宠|抓)[:|](\d+)$/);
  if (targetMatch) {
    const targetIndex = Math.max(0, Number(targetMatch[2]) || 0);
    const isCapture = ["capture", "catch", "捕获", "抓宠", "抓"].includes(targetMatch[1]);
    return {
      type: isCapture ? "capture" : "attack",
      command: `${isCapture ? "T" : "H"}|${targetIndex}`,
      targetIndex
    };
  }
  if (["release", "放走"].includes(value)) return { type: "escape", command: "E", release: true };
  if (["run", "escape", "逃跑", "离开", "離開", "e"].includes(value)) return { type: "escape", command: "E" };
  if (["capture", "catch", "捕获", "抓宠", "抓", "t", "t|0"].includes(value)) return { type: "capture", command: "T|0" };
  if (["item", "道具", "物品", "i"].includes(value)) return { type: "item", command: "I" };
  if (["pet", "宠物", "寵物", "换宠", "換寵", "出战", "出戰", "s"].includes(value)) {
    return { type: "pet-switch", command: "S", petIndex: null };
  }
  if (["skill", "pet-skill", "petskill", "技能", "宠技", "寵技", "w"].includes(value)) {
    return { type: "pet-skill", command: sourcePetSkillCommand(0, 0), skillSlot: 0, targetIndex: 0 };
  }
  if (["guard", "防御", "防守", "g"].includes(value)) return { type: "guard", command: "G" };
  if (["wait", "待机", "等待", "n"].includes(value)) return { type: "wait", command: "N" };
  if (["attack", "攻击", "战斗", "打", "h", "h|0"].includes(value)) return { type: "attack", command: "H|0" };
  return { type: value, command: value };
}

function enemyIndexFromBattleNo(targetNo) {
  const no = Math.max(0, Math.trunc(Number(targetNo) || 0));
  return no >= BATTLE_SIDE_OFFSET ? no - BATTLE_SIDE_OFFSET : no;
}

function sourceTargetBattleCommand(prefix, targetNo) {
  const no = Math.max(0, Math.trunc(Number(targetNo) || 0));
  return `${prefix}|${no.toString(16).toUpperCase()}`;
}

function sourcePetSkillCommand(skillSlot, targetIndex) {
  const slot = Math.max(0, Math.trunc(Number(skillSlot) || 0));
  const target = Math.max(0, Math.trunc(Number(targetIndex) || 0));
  return `W|${slot.toString(16).toUpperCase()}|${target.toString(16).toUpperCase()}`;
}

function sourcePetSwitchCommand(petIndex) {
  const index = Math.trunc(Number(petIndex));
  return `S|${Number.isFinite(index) ? index : -1}`;
}

function sourcePlayerBattleAction(move, game, activeActor, enemy) {
  const activeEnemyIndex = Math.max(0, Number(game.battle?.activeEnemyIndex || 0));
  const targetIndex = Math.max(0, Number(move.targetIndex ?? activeEnemyIndex));
  const base = {
    type: move.type,
    command: move.command,
    source: "gmsv battle_command.c BattleCommandDispach",
    actorKind: battleActorKind(game, activeActor),
    actorSlot: battleActorSlot(game, activeActor),
    actorName: battleActorName(game, activeActor)
  };
  if (move.type === "guard") return { ...base, sourceCommand: "BATTLE_COM_GUARD" };
  if (move.type === "wait") return { ...base, sourceCommand: "BATTLE_COM_WAIT" };
  return {
    ...base,
    sourceCommand: "BATTLE_COM_ATTACK",
    targetKind: "enemy",
    targetSlot: targetIndex,
    targetNo: Number(move.targetNo ?? BATTLE_SIDE_OFFSET + targetIndex),
    targetName: enemy?.Name || "enemy"
  };
}

function sourceBattleSupportActor(game, activeActor) {
  const activePet = getActivePet(game);
  if (activePet && activePet !== activeActor && battleActorHp(game, activePet) > 0) return activePet;
  if (game.player && activeActor !== game.player && battleActorHp(game, game.player) > 0) return game.player;
  return null;
}

function sourceAllySupportBattleAction(game, supportActor, enemy) {
  const activeEnemyIndex = Math.max(0, Number(game.battle?.activeEnemyIndex || 0));
  return {
    type: "attack",
    sourceCommand: "BATTLE_COM_ATTACK",
    command: `AUTO|${BATTLE_SIDE_OFFSET + activeEnemyIndex}`,
    source: "gmsv battle.c PETAI_MODE_ENEMYATTACK / side entry command queue",
    actorKind: battleActorKind(game, supportActor),
    actorSlot: battleActorSlot(game, supportActor),
    actorName: battleActorName(game, supportActor),
    targetKind: "enemy",
    targetSlot: activeEnemyIndex,
    targetNo: BATTLE_SIDE_OFFSET + activeEnemyIndex,
    targetName: enemy?.Name || "enemy"
  };
}

function sourcePlayerPetSwitchAction(command, oldPet, nextPet, oldIndex, nextIndex) {
  const petIn = Number(nextIndex) < 0;
  return {
    type: "pet-switch",
    sourceCommand: petIn ? "BATTLE_COM_PETIN" : "BATTLE_COM_PETOUT",
    command,
    source: `gmsv battle_command.c S| + battle.c ${petIn ? "BATTLE_COM_PETIN/BATTLE_PetIn" : "BATTLE_COM_PETOUT/BATTLE_PetOut"}`,
    actorKind: "player",
    actorSlot: 0,
    actorName: "player",
    targetKind: petIn ? "player" : "pet",
    targetSlot: nextIndex,
    targetName: petIn ? "player-alone" : nextPet?.Name || "pet",
    oldPetSlot: oldIndex,
    oldPetName: oldPet?.Name || ""
  };
}

function performPetSkillAction(game, move) {
  const activePet = getActivePet(game);
  if (!activePet) throw new Error("你需要至少一只宠物才能使用技能");
  ensureBattleState(game, activePet, game.encounter);

  const enemy = game.encounter;
  const skillSlot = Math.max(0, Math.trunc(Number(move.skillSlot) || 0));
  const skill = activePet.PetSkills?.[skillSlot] || null;
  if (!skill?.Id) throw new Error("这个技能槽没有可用的宠物技能");
  const profile = petSkillBattleProfile(skill);
  if (!profile.supported) throw new Error(`${skill.Name || "这个宠物技能"} 还没有接入战斗结算`);

  const battleLog = [];
  const enemyAi = chooseEnemyBattleMove(game, enemy, activePet);
  const playerAction = sourcePlayerPetSkillAction(move, game, activePet, enemy, skill, profile);
  const petFirst = workQuick(activePet) >= workQuick(enemy);
  let enemyEscaped = false;
  game.battle.sourceCommand = move.command;
  game.battle.playerAction = playerAction;
  game.battle.enemyAi = enemyAi;
  game.battle.mode = "resolving";

  const petTurn = () => {
    if (profile.kind === "magic-status") {
      resolvePetMagicStatusTurn(game, activePet, skill, profile, playerAction, battleLog);
      return;
    }
    resolvePetSkillTurn(game, activePet, enemy, skill, profile, enemyAi, playerAction, battleLog);
  };
  const enemyTurn = (guarded = false) => {
    const ended = resolveEnemyBattleTurn(game, enemy, activePet, enemyAi, playerAction, battleLog, guarded);
    enemyEscaped ||= ended;
    return ended;
  };

  if (profile.kind === "guard") {
    battleLog.push(`${activePet.Name} 使用 ${skill.Name}，采取防御姿势。`);
    enemyTurn(true);
  } else if (profile.kind === "wait") {
    battleLog.push(`${activePet.Name} 使用 ${skill.Name}，等待时机。`);
    enemyTurn(false);
  } else if (petFirst) {
    petTurn();
    if (enemy.Hp > 0) enemyTurn(false);
  } else {
    const endedEnemyTurn = enemyTurn(false);
    if (!endedEnemyTurn && activePet.Hp > 0) petTurn();
  }

  return settleBattleRound(game, activePet, enemy, {
    battleLog,
    result: "turn",
    sourceCommand: move.command,
    playerAction,
    enemyAi,
    enemyEscaped
  });
}

function sourcePlayerPetSkillAction(move, game, activePet, enemy, skill, profile) {
  const activeEnemyIndex = Math.max(0, Number(game.battle?.activeEnemyIndex || 0));
  const targetIndex = Math.max(0, Number(move.targetIndex ?? activeEnemyIndex));
  return {
    type: "pet-skill",
    sourceCommand: profile.sourceCommand,
    command: move.command,
    source: "gmsv battle_command.c W| + battle/pet_skill.c PETSKILL_Use",
    actorKind: "pet",
    actorSlot: battlePetSlot(game, activePet),
    actorName: activePet?.Name || activePet?.name || "pet",
    targetKind: profile.targetKind || "enemy",
    targetSlot: targetIndex,
    targetName: enemy?.Name || "enemy",
    petSkill: {
      id: Number(skill.Id || 0),
      slot: Number(move.skillSlot || 0),
      name: skill.Name || "",
      func: skill.FuncName || "",
      option: skill.Option || "",
      target: Number(skill.Target || 0),
      field: Number(skill.Field || 0),
      useType: Number(skill.UseType || 0),
      hitCount: Number(profile.hitCount || 0),
      multiplier: Number(profile.multiplier || 0),
      missChance: Number(profile.missChance || 0),
      status: compactBattleStatusEffect(profile.status),
      magicStatus: compactBattleMagicStatusEffect(profile.magicStatus),
      source: `${GMSV_DATA_SOURCE}/petskill2.txt`
    }
  };
}

function petSkillBattleProfile(skill = {}) {
  const func = String(skill.FuncName || "");
  if (func === "PETSKILL_None") {
    return { supported: true, kind: "wait", sourceCommand: "BATTLE_COM_WAIT", targetKind: "none" };
  }
  if (func === "PETSKILL_NormalAttack") {
    return { supported: true, kind: "attack", sourceCommand: "BATTLE_COM_ATTACK", hitCount: 1, multiplier: 1 };
  }
  if (func === "PETSKILL_NormalGuard") {
    return { supported: true, kind: "guard", sourceCommand: "BATTLE_COM_GUARD", targetKind: "self" };
  }
  if (func === "PETSKILL_GuardBreak") {
    return { supported: true, kind: "attack", sourceCommand: "BATTLE_COM_S_GBREAK", hitCount: 1, multiplier: 1, ignoreGuard: true, guardBreak: true };
  }
  if (func === "PETSKILL_GuardBreak2") {
    return { supported: true, kind: "attack", sourceCommand: "BATTLE_COM_S_GBREAK", hitCount: 1, multiplier: 1, ignoreGuard: true, guardBreak2: true };
  }
  if (func === "PETSKILL_ContinuationAttack") {
    return {
      supported: true,
      kind: "attack",
      sourceCommand: "BATTLE_COM_S_RENZOKU",
      hitCount: clampInt(String(skill.Option || skill.Des || skill.Name).match(/\d+/)?.[0], 2, 9, 2),
      multiplier: 1
    };
  }
  if (func === "PETSKILL_Mighty") {
    const option = String(skill.Option || "");
    return {
      supported: true,
      kind: "attack",
      sourceCommand: "BATTLE_COM_S_MIGHTY",
      hitCount: 1,
      multiplier: clampInt(option.match(/倍\s*(\d+)/)?.[1], 1, 5, 2),
      missChance: clampInt(option.match(/回避\s*(\d+)/)?.[1], 0, 95, 30)
    };
  }
  if (func === "PETSKILL_StatusChange") {
    const option = String(skill.Option || "");
    return {
      supported: true,
      kind: "attack",
      sourceCommand: "BATTLE_COM_S_STATUSCHANGE",
      hitCount: 1,
      multiplier: sourcePercentMultiplier(option, "攻"),
      status: parsePetSkillStatusChange(option)
    };
  }
  if (func === "PETSKILL_MagicStatusChange") {
    const magicStatus = parsePetSkillMagicStatusChange(skill.Option || "");
    return {
      supported: Boolean(magicStatus),
      kind: "magic-status",
      sourceCommand: "BATTLE_COM_S_SUPERWALL",
      targetKind: "ally",
      hitCount: 0,
      multiplier: 0,
      magicStatus,
      reason: magicStatus ? "" : `unsupported magic status ${skill.Option || ""}`
    };
  }
  return { supported: false, kind: "unsupported", sourceCommand: "", reason: `unsupported ${func || "unknown"}` };
}

function parsePetSkillMagicStatusChange(option = "") {
  const parts = String(option || "").split("|").map((item) => cleanReferenceText(item));
  const effect = BATTLE_MAGIC_STATUS_EFFECTS[parts[0]];
  if (!effect) return null;
  return {
    ...effect,
    turn: clampInt(parts[1], 1, 99, 3),
    percent: clampInt(parts[2], 0, 300, 0),
    scope: parts[3] || "单",
    source: "gmsv battle_event.c PETSKILL_MagicStatusChange_Battle"
  };
}

function parsePetSkillStatusChange(option = "") {
  const text = String(option || "");
  const statusGlyph = Object.keys(BATTLE_STATUS_EFFECTS).find((glyph) => text.includes(glyph));
  if (!statusGlyph) return null;
  const effect = BATTLE_STATUS_EFFECTS[statusGlyph];
  const turn = clampInt(text.match(/turn\s*(\d+)/i)?.[1], 1, 99, 3);
  return {
    ...effect,
    turn,
    blocksTurn: BATTLE_STATUS_BLOCKS_TURN.has(effect.key),
    poisonTick: BATTLE_STATUS_POISON_KEYS.has(effect.key),
    attackPercent: sourcePercentValue(text, "攻"),
    defencePercent: sourcePercentValue(text, "防"),
    quickPercent: sourcePercentValue(text, "敏")
  };
}

function sourcePercentMultiplier(text = "", label = "攻") {
  const percent = sourcePercentValue(text, label);
  return Math.max(0.05, 1 + percent / 100);
}

function sourcePercentValue(text = "", label = "攻") {
  const escaped = String(label || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(text || "").match(new RegExp(`${escaped}%\\s*([+-]?\\d+)`));
  return match ? clampInt(match[1], -95, 400, 0) : 0;
}

function resolvePetMagicStatusTurn(game, activePet, skill, profile, playerAction, battleLog) {
  const skillState = playerAction.petSkill;
  const magicStatus = profile.magicStatus;
  if (!magicStatus) {
    skillState.magicStatus = { success: false, reason: "missing-magic-status" };
    battleLog.push(`${activePet.Name} 使用 ${skill.Name}，但这个辅助状态尚未接入。`);
    return;
  }
  if (hasActiveBattleMagicStatus(activePet)) {
    skillState.magicStatus = {
      success: false,
      reason: "already-magic-status",
      status: compactBattleMagicStatusEffect(magicStatus),
      source: "gmsv battle_magic.c BATTLE_MultiMagicStatusChange"
    };
    battleLog.push(`${activePet.Name} 已经处于辅助状态，${skill.Name} 没有叠加。`);
    return;
  }
  const applied = applyBattleMagicStatus(activePet, magicStatus, skill);
  skillState.magicStatus = {
    success: true,
    status: compactBattleMagicStatusEffect(magicStatus),
    applied: compactBattleMagicStatusEffect(applied),
    targetName: activePet.Name,
    source: "gmsv battle_magic.c BATTLE_MultiMagicStatusChange"
  };
  battleLog.push(`${activePet.Name} 使用 ${skill.Name}，${applied.label}提高防御 ${applied.percent}%（${applied.turns} 回合）。`);
}

function resolvePetSkillTurn(game, activePet, enemy, skill, profile, enemyAi, playerAction, battleLog) {
  const skillState = playerAction.petSkill;
  const missRoll = profile.missChance
    ? ((stableHashInt([skill.Id, activePet.PetId || activePet.Name, enemy.EnemyId || enemy.Name, game.battle?.turn || 0, enemy.Hp].join("|")) % 100) + 1)
    : 0;
  if (profile.missChance && missRoll <= profile.missChance) {
    skillState.missRoll = missRoll;
    skillState.missed = true;
    battleLog.push(`${activePet.Name} 使用 ${skill.Name}，但是 ${enemy.Name} 闪开了。`);
    return;
  }

  const hitCount = Math.max(1, Number(profile.hitCount || 1));
  const hits = [];
  let totalDamage = 0;
  for (let i = 0; i < hitCount && enemy.Hp > 0; i += 1) {
    let multiplier = Number(profile.multiplier || 1);
    if (profile.guardBreak2) multiplier = enemyAi.type === "guard" ? 1.3 : 0.7;
    let hit = combatDamageDetail(activePet, enemy, multiplier);
    if (enemyAi.type === "guard" && !profile.ignoreGuard) {
      hit = applySourceGuardAdjust(hit, [
        "enemy-guard",
        "pet-skill",
        skill.Id,
        i,
        enemy.EnemyId || enemy.PetId || enemy.Name,
        activePet.PetId || activePet.Name,
        game.battle?.turn || 0,
        enemy.Hp,
        activePet.Hp
      ]);
      enemyAi.guardAdjust = hit.guardAdjust;
    }
    enemy.Hp = Math.max(0, Number(enemy.Hp || 0) - hit.damage);
    totalDamage += hit.damage;
    hits.push({
      damage: hit.damage,
      critical: Boolean(hit.critical),
      elementMultiplier: Number(hit.elementMultiplier || 1),
      guardAdjust: compactGuardAdjust(hit.guardAdjust)
    });
  }
  skillState.hits = hits;
  skillState.totalDamage = totalDamage;
  const hitText = hits.length > 1 ? `连续 ${hits.length} 次命中，共` : "";
  const detailText = hits.length === 1 ? battleDetailSuffix(hits[0]) : `（${hits.map((hit) => hit.damage).join("/")}）`;
  battleLog.push(`${activePet.Name} 使用 ${skill.Name} 攻击 ${enemy.Name}，${hitText}造成 ${totalDamage} 伤害${detailText}。`);
  if (profile.status && totalDamage > 0 && enemy.Hp > 0) {
    const statusRoll = resolveBattleStatusAttack(game, activePet, enemy, profile.status, skill);
    skillState.status = statusRoll;
    if (statusRoll.success) {
      const applied = applyBattleStatus(enemy, profile.status, statusRoll);
      skillState.status.applied = compactBattleStatusEffect(applied);
      battleLog.push(`${enemy.Name} 陷入${applied.label}状态，持续 ${applied.turns} 回合。`);
    } else if (statusRoll.reason === "already-status") {
      battleLog.push(`${enemy.Name} 已经处于异常状态，${skill.Name} 的状态效果没有叠加。`);
    } else {
      battleLog.push(`${skill.Name} 的状态效果没有成功。`);
    }
  }
}

function resolveEnemyBattleTurn(game, enemy, activeActor, enemyAi, playerAction, battleLog, guarded = false) {
  const statusTurn = consumeBattleStatusBeforeTurn(enemy, battleLog);
  if (statusTurn.stopped || Number(enemy.Hp || 0) <= 0) return false;
  if (enemyAi.type === "guard") {
    battleLog.push(`${enemy.Name} 采取防御姿势。`);
    return false;
  }
  if (enemyAi.type === "wait") {
    battleLog.push(`${enemy.Name} 观察战况，暂不行动。`);
    return false;
  }
  if (enemyAi.type === "escape") {
    const escape = resolveEnemyEscapeAttempt(game, enemy, activeActor, enemyAi);
    enemyAi.escapeChance = escape.chance;
    enemyAi.escapeRoll = escape.roll;
    enemyAi.escapeSucceeded = escape.succeeded;
    if (escape.succeeded) {
      battleLog.push(`${enemy.Name} 逃跑成功。`);
      return true;
    }
    battleLog.push(`${enemy.Name} 试图逃跑，但是失败了。`);
    return false;
  }
  const targetActor = enemyBattleTargetActor(game, enemyAi, activeActor);
  const targetGuarded = guarded && targetActor === activeActor;
  let hit = combatDamageDetail(enemy, targetActor);
  if (targetGuarded) {
    hit = applySourceGuardAdjust(hit, [
      "player-guard",
      battleActorIdentity(game, targetActor),
      enemy.EnemyId || enemy.PetId || enemy.Name,
      game.battle?.turn || 0,
      battleActorHp(game, targetActor),
      enemy.Hp
    ]);
    playerAction.guardAdjust = hit.guardAdjust;
  }
  setBattleActorHp(game, targetActor, battleActorHp(game, targetActor) - hit.damage);
  battleLog.push(`${enemy.Name} ${targetGuarded ? "攻击防御中的" : "攻击"} ${battleActorName(game, targetActor)}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
  return false;
}

function resolveBattleStatusAttack(game, attacker, defender, status, skill = {}) {
  const compactStatus = compactBattleStatusEffect(status);
  if (!status?.key) {
    return { success: false, reason: "missing-status", status: compactStatus };
  }
  if (hasActiveBattleStatus(defender)) {
    return {
      success: false,
      reason: "already-status",
      chance: 0,
      roll: 0,
      status: compactStatus,
      source: "gmsv battle_event.c BATTLE_StatusAttackCheck"
    };
  }
  const resistance = battleStatusResistance(defender, status);
  let chance;
  if (status.key === "paralysis") {
    chance = 20 - resistance;
  } else {
    const vital = firstFiniteNumber(0, defender.Vital, defender.WorkMaxHp);
    const str = firstFiniteNumber(0, defender.Str, defender.WorkAttackPower, defender.WorkFixStr);
    const tough = firstFiniteNumber(0, defender.Tough, defender.WorkDefencePower, defender.WorkFixTough);
    const dex = firstFiniteNumber(0, defender.Dex, defender.WorkQuick, defender.WorkFixDex);
    const total = Math.max(1, vital + str + tough + dex);
    const vitalRatio = total > 0 ? vital / total : 0.25;
    const vitalPenalty = (vitalRatio / 0.25) * 10;
    const levelSwing = Math.max(-40, Math.min(40, (Number(attacker?.Lv || attacker?.level || 1) - Number(defender?.Lv || defender?.level || 1)) * 2));
    const luck = firstFiniteNumber(0, attacker?.WorkFixLuck, attacker?.Luck, attacker?.luck);
    chance = levelSwing + luck - resistance - vitalPenalty;
  }
  chance = Math.max(0, Math.min(80, Math.trunc(chance)));
  const roll = (stableHashInt([
    status.key,
    skill.Id || skill.Name || "",
    attacker?.PetId || attacker?.Name || attacker?.name || "",
    defender?.EnemyId || defender?.PetId || defender?.Name || "",
    Number(game.battle?.turn || 0),
    Number(defender?.Hp || 0),
    status.turn
  ].join("|")) % 100) + 1;
  return {
    success: roll < chance,
    chance,
    roll,
    resistance,
    status: compactStatus,
    source: "gmsv battle_event.c BATTLE_StatusAttackCheck"
  };
}

function battleStatusResistance(char = {}, status = {}) {
  const key = status.key || "";
  const statusName = String(key).replace(/^[a-z]/, (letter) => letter.toUpperCase());
  return Math.max(0, firstFiniteNumber(
    0,
    char[`Resist${statusName}`],
    char[`${statusName}Resistance`],
    char.StatusResistance,
    char.BattleStatusResistance
  ));
}

function hasActiveBattleStatus(char = {}) {
  return Object.values(char.BattleStatuses || {}).some((status) => Number(status?.turns || 0) > 0);
}

function hasActiveBattleMagicStatus(char = {}) {
  return Object.values(char.BattleMagicStatuses || {}).some((status) => Number(status?.turns || 0) > 0);
}

function applyBattleStatus(target, status, roll = {}) {
  target.BattleStatuses ||= {};
  const turns = Math.max(1, Number(status.turn || 3) + 1);
  const applied = {
    ...compactBattleStatusEffect(status),
    turns,
    baseTurn: Number(status.turn || 3),
    chance: Number(roll.chance || 0),
    roll: Number(roll.roll || 0),
    source: "gmsv battle_event.c status turn is PETSKILL option turn + 1"
  };
  target.BattleStatuses[status.key] = applied;
  syncBattlePrimaryStatus(target);
  return applied;
}

function applyBattleMagicStatus(target, status, skill = {}) {
  target.BattleMagicStatuses ||= {};
  const applied = {
    ...compactBattleMagicStatusEffect(status),
    turns: Math.max(1, Number(status.turn || 3)),
    baseTurn: Number(status.turn || 3),
    skillId: Number(skill.Id || 0),
    skillName: skill.Name || "",
    source: "gmsv battle_magic.c BATTLE_MultiMagicStatusChange"
  };
  target.BattleMagicStatuses[status.key] = applied;
  syncBattlePrimaryMagicStatus(target);
  return applied;
}

function consumeBattleStatusBeforeTurn(target, battleLog = []) {
  const statuses = target?.BattleStatuses || {};
  const blocked = [];
  for (const key of Object.keys(statuses)) {
    const status = statuses[key];
    let turns = Number(status?.turns || 0);
    if (turns <= 0) {
      delete statuses[key];
      continue;
    }
    if (BATTLE_STATUS_POISON_KEYS.has(key) && Number(target.Hp || 0) > 0) {
      const maxHp = Math.max(1, Number(target.WorkMaxHp || target.Hp || 1));
      const ratio = key === "poison" ? 0.05 : 0.08;
      const damage = Math.max(1, Math.floor(maxHp * ratio));
      target.Hp = Math.max(0, Number(target.Hp || 0) - damage);
      battleLog.push(`${target.Name} 受到${status.label || "异常"}影响，损失 ${damage} 耐久。`);
    }
    if (BATTLE_STATUS_BLOCKS_TURN.has(key) && Number(target.Hp || 0) > 0) {
      blocked.push(status.label || key);
    }
    turns -= 1;
    if (turns > 0) status.turns = turns;
    else delete statuses[key];
  }
  if (blocked.length && Number(target.Hp || 0) > 0) {
    battleLog.push(`${target.Name} 因${blocked.join("/")}无法行动。`);
  }
  syncBattlePrimaryStatus(target);
  return { stopped: Boolean(blocked.length), source: "gmsv battle_event.c status pre-turn handling" };
}

function consumeBattleMagicStatusesAfterRound(target) {
  const statuses = target?.BattleMagicStatuses || {};
  for (const key of Object.keys(statuses)) {
    const status = statuses[key];
    let turns = Number(status?.turns || 0);
    if (turns <= 0) {
      delete statuses[key];
      continue;
    }
    turns -= 1;
    if (turns > 0) status.turns = turns;
    else delete statuses[key];
  }
  syncBattlePrimaryMagicStatus(target);
}

function syncBattlePrimaryStatus(target = {}) {
  const active = Object.values(target.BattleStatuses || {}).find((status) => Number(status?.turns || 0) > 0);
  if (active) target.BattleStatus = compactBattleStatusEffect(active);
  else delete target.BattleStatus;
}

function syncBattlePrimaryMagicStatus(target = {}) {
  const active = Object.values(target.BattleMagicStatuses || {}).find((status) => Number(status?.turns || 0) > 0);
  if (active) target.BattleMagicStatus = compactBattleMagicStatusEffect(active);
  else delete target.BattleMagicStatus;
}

function clearBattleRuntimeEffects(target = {}) {
  delete target.BattleStatuses;
  delete target.BattleStatus;
  delete target.BattleMagicStatuses;
  delete target.BattleMagicStatus;
}

function compactBattleStatusEffect(status) {
  if (!status) return null;
  return {
    id: Number(status.id || 0),
    key: status.key || "",
    label: status.label || "",
    sourceCommand: status.sourceCommand || "",
    turn: Number(status.turn || status.baseTurn || 0),
    turns: Number(status.turns || 0),
    blocksTurn: Boolean(status.blocksTurn ?? BATTLE_STATUS_BLOCKS_TURN.has(status.key)),
    poisonTick: Boolean(status.poisonTick ?? BATTLE_STATUS_POISON_KEYS.has(status.key)),
    attackPercent: Number(status.attackPercent || 0),
    defencePercent: Number(status.defencePercent || 0),
    quickPercent: Number(status.quickPercent || 0)
  };
}

function compactBattleMagicStatusEffect(status) {
  if (!status) return null;
  return {
    id: Number(status.id || 0),
    key: status.key || "",
    label: status.label || "",
    sourceCommand: status.sourceCommand || "",
    stat: status.stat || "",
    turn: Number(status.turn || status.baseTurn || 0),
    turns: Number(status.turns || 0),
    percent: Number(status.percent || 0),
    scope: status.scope || "",
    skillId: Number(status.skillId || 0),
    skillName: status.skillName || ""
  };
}

function compactBattleStatuses(char = {}) {
  return Object.fromEntries(Object.entries(char.BattleStatuses || {})
    .filter(([, status]) => Number(status?.turns || 0) > 0)
    .map(([key, status]) => [key, compactBattleStatusEffect(status)]));
}

function compactBattleMagicStatuses(char = {}) {
  return Object.fromEntries(Object.entries(char.BattleMagicStatuses || {})
    .filter(([, status]) => Number(status?.turns || 0) > 0)
    .map(([key, status]) => [key, compactBattleMagicStatusEffect(status)]));
}

function chooseEnemyBattleMove(game, enemy, activeActor) {
  const tacticsOption = String(enemy.WorkTacticsOption || enemy.TacticsOption || "");
  const tactics = parseSourceBattleAiTactics(tacticsOption);
  const choices = [];
  if (tactics.attack.weight > 0) choices.push({ type: "attack", weight: tactics.attack.weight });
  if (tactics.guard.weight > 0) choices.push({ type: "guard", weight: tactics.guard.weight });
  if (tactics.escape.weight > 0) choices.push({ type: "escape", weight: tactics.escape.weight });
  if (tactics.wait.weight > 0) choices.push({ type: "wait", weight: tactics.wait.weight });
  if (!choices.length) choices.push({ type: "attack", weight: 1 });
  const selected = weightedDeterministicChoice(choices, [
    enemy.EnemyId || enemy.PetId || enemy.Name,
    enemy.Hp,
    battleActorHp(game, activeActor),
    game.battle?.turn || 0,
    tacticsOption
  ].join("|"));
  const base = {
    type: selected.type,
    source: "gmsv battle_ai.c BATTLE_ai_normal",
    tacticsOption,
    targetRule: tactics.attack.target,
    selectRule: tactics.attack.select
  };
  if (selected.type === "guard") return { ...base, sourceCommand: "BATTLE_COM_GUARD", command: "G" };
  if (selected.type === "escape") return { ...base, sourceCommand: "BATTLE_COM_ESCAPE", command: "E" };
  if (selected.type === "wait") return { ...base, sourceCommand: "BATTLE_COM_WAIT", command: "N" };
  const target = selectSourceEnemyAttackTarget(game, enemy, tactics.attack, activeActor);
  return {
    ...base,
    sourceCommand: "BATTLE_COM_ATTACK",
    command: `H|${target.battleNo}`,
    targetKind: target.kind,
    targetSlot: target.slot,
    targetNo: target.battleNo,
    targetName: target.name,
    targetHp: target.hp,
    targetCandidates: target.candidateKinds,
    targetSource: target.source
  };
}

function enemyBattleTargetActor(game, enemyAi, fallbackActor) {
  const candidates = sourceEnemyTargetCandidates(game);
  const match = candidates.find((candidate) => (
    candidate.kind === enemyAi?.targetKind
    && Number(candidate.slot) === Number(enemyAi?.targetSlot)
  )) || candidates.find((candidate) => Number(candidate.battleNo) === Number(enemyAi?.targetNo));
  return match?.actor || fallbackActor || game.player;
}

function sourceEnemyTargetCandidates(game) {
  const candidates = [];
  if (game.player && battleActorHp(game, game.player) > 0) {
    candidates.push(sourceEnemyTargetCandidate(game, game.player));
  }
  const activePet = getActivePet(game);
  if (activePet && battleActorHp(game, activePet) > 0) {
    candidates.push(sourceEnemyTargetCandidate(game, activePet));
  }
  return candidates;
}

function sourceEnemyTargetCandidate(game, actor) {
  return {
    actor,
    kind: battleActorKind(game, actor),
    slot: battleActorSlot(game, actor),
    battleNo: battleActorBattleNo(game, actor),
    name: battleActorName(game, actor),
    hp: battleActorHp(game, actor),
    maxHp: battleActorMaxHp(game, actor)
  };
}

function selectSourceEnemyAttackTarget(game, enemy, attack, activeActor) {
  const source = "gmsv battle_ai.c B_AI_NORMAL_TARGET_* / B_AI_NORMAL_SELECT_*";
  const all = sourceEnemyTargetCandidates(game);
  const targetRule = Number(attack?.target || 1);
  const selectRule = Number(attack?.select || 1);
  let candidates = all.filter((candidate) => {
    if (targetRule === 2) return candidate.kind === "player";
    if (targetRule === 3) return candidate.kind === "pet";
    return true;
  });
  if (!candidates.length && targetRule !== 1) candidates = all;
  if (!candidates.length) candidates = [sourceEnemyTargetCandidate(game, activeActor || game.player)].filter((candidate) => candidate.actor);
  let selected = candidates[0];
  if (selectRule === 2 || selectRule === 3) {
    selected = candidates.reduce((best, candidate) => {
      if (!best) return candidate;
      if (selectRule === 2) return candidate.hp > best.hp ? candidate : best;
      return candidate.hp < best.hp ? candidate : best;
    }, null) || selected;
  } else {
    const roll = stableHashInt([
      enemy?.EnemyId || enemy?.PetId || enemy?.Name || "",
      enemy?.Hp || 0,
      game.battle?.turn || 0,
      targetRule,
      selectRule,
      candidates.map((candidate) => `${candidate.kind}:${candidate.slot}:${candidate.hp}`).join(",")
    ].join("|")) % candidates.length;
    selected = candidates[roll] || selected;
  }
  return {
    ...selected,
    candidateKinds: candidates.map((candidate) => `${candidate.kind}:${candidate.slot}`),
    source
  };
}

function parseSourceBattleAiTactics(value) {
  const sections = Object.fromEntries(String(value || "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [key, rest = ""] = part.split(":");
      return [String(key || "").trim().toLowerCase(), rest];
    }));
  const attack = parseSourceBattleAiInts(sections.at, [1, 3, 1]);
  const guard = parseSourceBattleAiInts(sections.gu, [0]);
  const escape = parseSourceBattleAiInts(sections.es, [0]);
  return {
    attack: {
      weight: Math.max(0, attack[0] || 0),
      target: attack[1] || 3,
      select: attack[2] || 1
    },
    guard: {
      weight: Math.max(0, guard[0] || 0)
    },
    escape: {
      weight: Math.max(0, escape[0] || 0)
    },
    wait: {
      weight: Math.max(0, parseSourceBattleAiInts(sections.n, [0])[0] || 0)
    }
  };
}

function resolveEnemyEscapeAttempt(game, enemy, activeActor, enemyAi) {
  const battle = game.battle || {};
  const activeIndex = Math.max(0, Number(battle.activeEnemyIndex || 0));
  battle.enemyEscapeAttempts ||= {};
  const attempt = Math.max(1, Number(battle.enemyEscapeAttempts[activeIndex] || 0) + 1);
  battle.enemyEscapeAttempts[activeIndex] = attempt;
  const chance = sourceEscapeChance(enemy, [game.player, getActivePet(game)].filter(Boolean), attempt);
  const roll = (stableHashInt([
    enemy.EnemyId || enemy.PetId || enemy.Name,
    enemy.Hp,
    battleActorHp(game, activeActor),
    game.battle?.turn || 0,
    attempt,
    enemyAi?.tacticsOption || ""
  ].join("|")) % 100) + 1;
  return {
    attempt,
    chance,
    roll,
    succeeded: roll < chance
  };
}

function resolvePlayerEscapeAttempt(game, enemy) {
  const battle = game.battle || {};
  battle.playerEscapeAttempts = Math.max(0, Number(battle.playerEscapeAttempts || 0)) + 1;
  const attempt = battle.playerEscapeAttempts;
  const opponents = liveBattleEnemies(game, enemy);
  const chance = sourceEscapeChance(game.player, opponents, attempt);
  const roll = (stableHashInt([
    game.player?.name || "",
    game.player?.level || 1,
    opponents.map((item) => `${item.EnemyId || item.PetId || item.Name}:${item.Lv || 1}:${item.Hp || 0}`).join(","),
    Number(battle.turn || 0) + 1,
    attempt
  ].join("|")) % 100) + 1;
  return {
    attempt,
    chance,
    roll,
    succeeded: roll < chance,
    source: "gmsv battle_event.c BATTLE_EscapeCheck",
    sourceCommand: "BATTLE_COM_ESCAPE"
  };
}

function liveBattleEnemies(game, fallbackEnemy = null) {
  const party = Array.isArray(game.battle?.enemyParty) && game.battle.enemyParty.length
    ? game.battle.enemyParty
    : [fallbackEnemy].filter(Boolean);
  return party.filter((enemy) => enemy && Number(enemy.Hp || 0) > 0 && !enemy.BattleEscaped);
}

function sourceEscapeChance(actor, opponents, attempt = 1) {
  const isEnemy = Number(actor?.WhichType || 0) === 2 || actor?.EnemyId != null;
  const rare = Number(actor?.Rare ?? actor?.rare ?? 0);
  const luck = isEnemy
    ? (rare <= 0 ? 1 : rare === 1 ? 3 : 5)
    : clampInt(actor?.WorkFixLuck ?? actor?.Luck ?? actor?.luck, 1, 5, 1);
  const myLevel = Math.max(1, Number(actor?.Lv || actor?.level || 1));
  const opponentLevels = (opponents || [])
    .filter(Boolean)
    .map((item) => Number(item.Lv || item.level || 0))
    .filter((level) => level > 0);
  const enemyLevel = opponentLevels.length
    ? Math.round(opponentLevels.reduce((sum, level) => sum + level, 0) / opponentLevels.length)
    : 0;
  const count = Math.max(1, Number(attempt || 1));
  let chance;
  if (luck >= 5) chance = 95 * count;
  else if (luck >= 4) chance = (60 * count) - 2 * (enemyLevel - myLevel);
  else if (luck >= 3) chance = (50 * count) - 2 * (enemyLevel - myLevel);
  else if (luck >= 2) chance = (40 * count) - 2 * (enemyLevel - myLevel);
  else chance = (30 * count) - 2 * (enemyLevel - myLevel);
  return Math.max(1, Math.trunc(chance));
}

function parseSourceBattleAiInts(value, fallback) {
  if (value == null || value === "") return [...fallback];
  const nums = String(value)
    .split(";")
    .map((item) => Number.parseInt(item, 10))
    .map((item) => (Number.isFinite(item) ? item : 0));
  return fallback.map((item, index) => nums[index] ?? item);
}

function weightedDeterministicChoice(choices, seed) {
  const total = choices.reduce((sum, item) => sum + Math.max(0, Number(item.weight || 0)), 0);
  if (total <= 0) return choices[0] || { type: "wait", weight: 1 };
  let roll = stableHashInt(seed) % total;
  for (const choice of choices) {
    roll -= Math.max(0, Number(choice.weight || 0));
    if (roll < 0) return choice;
  }
  return choices[choices.length - 1];
}

function stableHashInt(value) {
  let hash = 2166136261;
  for (const char of String(value || "")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function recordBattleOutcome(game, outcome = null) {
  if (!outcome) return null;
  const summary = {
    at: new Date().toISOString(),
    result: outcome.result || "",
    enemyName: outcome.enemyName || "",
    petName: outcome.petName || "",
    playerExp: Number(outcome.playerExp ?? outcome.exp ?? 0),
    petExp: Number(outcome.petExp || 0),
    stone: Number(outcome.stone || 0),
    levelUps: [...(outcome.levelUps || [])].slice(0, 6),
    sourceCommand: outcome.sourceCommand || "",
    playerAction: compactBattleActionTelemetry(outcome.playerAction),
    enemyAi: outcome.enemyAi ? {
      type: outcome.enemyAi.type || "",
      sourceCommand: outcome.enemyAi.sourceCommand || "",
      command: outcome.enemyAi.command || "",
      targetKind: outcome.enemyAi.targetKind || "",
      targetSlot: Number(outcome.enemyAi.targetSlot || 0),
      targetName: outcome.enemyAi.targetName || "",
      targetRule: Number(outcome.enemyAi.targetRule || 0),
      selectRule: Number(outcome.enemyAi.selectRule || 0),
      escapeChance: Number(outcome.enemyAi.escapeChance || 0),
      escapeRoll: Number(outcome.enemyAi.escapeRoll || 0),
      escapeSucceeded: Boolean(outcome.enemyAi.escapeSucceeded),
      guardAdjust: compactGuardAdjust(outcome.enemyAi.guardAdjust),
      source: outcome.enemyAi.source || ""
    } : null,
    playerEscape: outcome.playerEscape ? {
      sourceCommand: outcome.playerEscape.sourceCommand || "",
      attempt: Number(outcome.playerEscape.attempt || 0),
      chance: Number(outcome.playerEscape.chance || 0),
      roll: Number(outcome.playerEscape.roll || 0),
      succeeded: Boolean(outcome.playerEscape.succeeded),
      source: outcome.playerEscape.source || ""
    } : null,
    sourceResults: (outcome.sourceResults || []).slice(0, 6).map((item) => ({
      type: item.type || "",
      num: Number(item.num || 0),
      name: item.name || "",
      exp: Number(item.exp || 0),
      levelup: Number(item.levelup || 0),
      level: Number(item.level || 0)
    })),
    defeatedEnemies: (outcome.defeatedEnemies || []).slice(0, 8).map((enemy) => ({
      EnemyId: enemy.EnemyId,
      PetId: enemy.PetId,
      Name: enemy.Name,
      Lv: Number(enemy.Lv || 0),
      SourceExp: Number(enemy.SourceExp ?? enemy.Exp ?? 0)
    })),
    escapedEnemies: (outcome.escapedEnemies || []).slice(0, 8).map((enemy) => ({
      EnemyId: enemy.EnemyId,
      PetId: enemy.PetId,
      Name: enemy.Name,
      Lv: Number(enemy.Lv || 0),
      SourceExp: Number(enemy.SourceExp ?? enemy.Exp ?? 0)
    })),
    lootItems: (outcome.lootItems || []).slice(0, 8).map((item) => ({
      id: item.id,
      name: item.name || "",
      qty: Number(item.qty || 1)
    })),
    potentialLootItems: (outcome.potentialLootItems || []).slice(0, 8).map((item) => ({
      id: item.id,
      name: item.name || "",
      qty: Number(item.qty || 1),
      probability: Number(item.probability || 0),
      rollBase: Number(item.rollBase || ENEMY_DROP_ROLL_BASE),
      source: item.source || ""
    })),
    skippedLootItems: (outcome.skippedLootItems || []).slice(0, 8).map((item) => ({
      id: item.id,
      name: item.name || "",
      qty: Number(item.qty || 1),
      reason: item.reason || ""
    })),
    turns: Number(outcome.turns || 0),
    log: (outcome.log || []).slice(-4)
  };
  game.lastBattleOutcome = summary;
  return summary;
}

function compactBattleActionTelemetry(action) {
  if (!action) return null;
  return {
    type: action.type || "",
    sourceCommand: action.sourceCommand || "",
    command: action.command || "",
    actorKind: action.actorKind || "",
    actorSlot: Number(action.actorSlot || 0),
    actorName: action.actorName || "",
    targetKind: action.targetKind || "",
    targetSlot: Number(action.targetSlot || 0),
    targetNo: Number(action.targetNo ?? action.targetSlot ?? 0),
    targetName: action.targetName || "",
    oldPetSlot: Number(action.oldPetSlot ?? -1),
    oldPetName: action.oldPetName || "",
    supportAction: action.supportAction ? compactBattleActionTelemetry(action.supportAction) : null,
    petSkill: compactPetSkillTelemetry(action.petSkill),
    guardAdjust: compactGuardAdjust(action.guardAdjust),
    source: action.source || ""
  };
}

function compactPetSkillTelemetry(skill) {
  if (!skill) return null;
  return {
    id: Number(skill.id || 0),
    slot: Number(skill.slot || 0),
    name: skill.name || "",
    func: skill.func || "",
    option: skill.option || "",
    target: Number(skill.target || 0),
    field: Number(skill.field || 0),
    useType: Number(skill.useType || 0),
    hitCount: Number(skill.hitCount || 0),
    multiplier: Number(skill.multiplier || 0),
    missChance: Number(skill.missChance || 0),
    missRoll: Number(skill.missRoll || 0),
    missed: Boolean(skill.missed),
    status: skill.status ? {
      ...skill.status,
      status: compactBattleStatusEffect(skill.status.status),
      applied: compactBattleStatusEffect(skill.status.applied)
    } : null,
    magicStatus: skill.magicStatus ? {
      ...skill.magicStatus,
      status: compactBattleMagicStatusEffect(skill.magicStatus.status),
      applied: compactBattleMagicStatusEffect(skill.magicStatus.applied)
    } : null,
    totalDamage: Number(skill.totalDamage || 0),
    hits: (skill.hits || []).slice(0, 9).map((hit) => ({
      damage: Number(hit.damage || 0),
      critical: Boolean(hit.critical),
      elementMultiplier: Number(hit.elementMultiplier || 1),
      guardAdjust: compactGuardAdjust(hit.guardAdjust)
    })),
    source: skill.source || ""
  };
}

function compactGuardAdjust(guardAdjust) {
  if (!guardAdjust) return null;
  return {
    roll: Number(guardAdjust.roll || 0),
    multiplier: Number(guardAdjust.multiplier || 0),
    originalDamage: Number(guardAdjust.originalDamage || 0),
    source: guardAdjust.source || ""
  };
}

function battlePetSlot(game, pet) {
  const pets = game.pets || [];
  const index = pets.findIndex((item) => item === pet || (
    item && pet
    && String(item.Name || item.name || "") === String(pet.Name || pet.name || "")
    && Number(item.PetId ?? item.id ?? -1) === Number(pet.PetId ?? pet.id ?? -2)
  ));
  return index >= 0 ? index : 0;
}

function activeBattleActor(game) {
  return getActivePet(game) || game.player;
}

function isPlayerBattleActor(game, actor) {
  return Boolean(actor && actor === game.player);
}

function battleActorKind(game, actor) {
  return isPlayerBattleActor(game, actor) ? "player" : "pet";
}

function battleActorSlot(game, actor) {
  return isPlayerBattleActor(game, actor) ? 0 : battlePetSlot(game, actor);
}

function battleActorBattleNo(game, actor) {
  if (isPlayerBattleActor(game, actor)) return 0;
  return BATTLE_PLAYER_MAX + battlePetSlot(game, actor);
}

function battleActorName(game, actor) {
  if (isPlayerBattleActor(game, actor)) return game.player?.name || "player";
  return actor?.Name || actor?.name || "pet";
}

function battleActorIdentity(game, actor) {
  if (isPlayerBattleActor(game, actor)) return game.player?.characterId || game.player?.name || "player";
  return actor?.PetId || actor?.Name || actor?.name || "pet";
}

function battleActorHpField(game, actor) {
  if (isPlayerBattleActor(game, actor)) return { owner: game.player, key: "hp" };
  return { owner: actor, key: "Hp" };
}

function battleActorHp(game, actor) {
  const field = battleActorHpField(game, actor);
  return Math.max(0, Number(field.owner?.[field.key] || 0));
}

function setBattleActorHp(game, actor, hp) {
  const field = battleActorHpField(game, actor);
  const maxHp = battleActorMaxHp(game, actor);
  field.owner[field.key] = clampInt(Math.floor(Number(hp) || 0), 0, maxHp, 0);
}

function battleActorMaxHp(game, actor) {
  if (isPlayerBattleActor(game, actor)) {
    return Math.max(1, Number(game.player?.WorkMaxHp || game.player?.maxHp || game.player?.hp || 1));
  }
  return Math.max(1, Number(actor?.WorkMaxHp || actor?.Hp || 1));
}

function ensureBattleActorHp(game, actor) {
  if (!actor) return;
  if (isPlayerBattleActor(game, actor)) {
    const maxHp = battleActorMaxHp(game, actor);
    game.player.WorkMaxHp ||= maxHp;
    game.player.maxHp ||= maxHp;
    if (!Number.isFinite(Number(game.player.hp)) || Number(game.player.hp) <= 0) game.player.hp = maxHp;
    return;
  }
  actor.WorkMaxHp ||= Math.max(1, Number(actor.Hp || 1));
  if (!Number.isFinite(Number(actor.Hp)) || Number(actor.Hp) <= 0) actor.Hp = actor.WorkMaxHp;
}

function clearPetBattleRuntimeEffects(game, actor) {
  if (battleActorKind(game, actor) === "pet") clearBattleRuntimeEffects(actor);
}

function selectBattleTarget(game, targetIndex) {
  const battle = game.battle;
  const party = Array.isArray(battle?.enemyParty) ? battle.enemyParty : [];
  if (!party.length) {
    if (targetIndex === 0) return;
    throw new Error("当前战斗没有这个目标");
  }
  const target = party[targetIndex];
  if (!target) throw new Error("当前战斗没有这个目标");
  if (Number(target.Hp || 0) <= 0) throw new Error("这个目标已经倒下");
  battle.activeEnemyIndex = targetIndex;
  game.encounter = target;
}

function syncActiveEnemyPartyEntry(game, target = game.encounter) {
  const battle = game?.battle;
  if (!battle || !Array.isArray(battle.enemyParty) || !target) return;
  const activeIndex = Math.max(0, Number(battle.activeEnemyIndex || 0));
  if (!battle.enemyParty[activeIndex]) return;
  battle.enemyParty[activeIndex] = { ...battle.enemyParty[activeIndex], ...target };
}

function performBattleItemAction(game, itemId = null) {
  if (!game.encounter) throw new Error("当前没有战斗目标");
  const activeActor = activeBattleActor(game);
  ensureBattleState(game, activeActor, game.encounter);

  const item = itemId == null ? firstUsableRecoveryItem(game) : findInventoryItem(game, itemId);
  if (!item) throw new Error("背包里没有可用于战斗的道具");

  const enemy = game.encounter;
  game.battle.sourceCommand = "I";
  game.battle.mode = "resolving";
  const itemUse = applyUsableItem(game, item, { battle: true });
  const battleLog = [itemUseLogLine(itemUse)];
  if (enemy.Hp > 0) {
    const statusResult = consumeBattleStatusBeforeTurn(enemy, battleLog);
    syncActiveEnemyPartyEntry(game, enemy);
    if (!statusResult.stopped && Number(enemy.Hp || 0) > 0) {
      const hit = combatDamageDetail(enemy, activeActor);
      setBattleActorHp(game, activeActor, battleActorHp(game, activeActor) - hit.damage);
      battleLog.push(`${enemy.Name} 趁机反击 ${battleActorName(game, activeActor)}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
    }
  }

  return settleBattleRound(game, activeActor, enemy, {
    battleLog,
    result: "item",
    sourceCommand: "I",
    itemUse
  });
}

function settleBattleRound(game, activeActor, enemy, options = {}) {
  const battleLog = options.battleLog || [];
  const enemyName = enemy.Name;
  const actorIsPet = battleActorKind(game, activeActor) === "pet";
  const petName = actorIsPet ? battleActorName(game, activeActor) : "";
  const actorName = battleActorName(game, activeActor);
  game.battle.turn = Number(game.battle.turn || 0) + 1;
  const turnCount = Number(game.battle.turn || 0);
  game.battle.sourceCommand = options.sourceCommand || game.battle.sourceCommand || "H|0";
  let result = options.result || "turn";
  let exp = 0;
  let stone = 0;
  let defeatedEnemies = [];
  let escapedEnemies = [];
  let rewardSummary = { playerExp: 0, petExp: 0, levelUps: [], sourceResults: [], lootItems: [], potentialLootItems: [], skippedLootItems: [] };
  if (options.enemyEscaped && enemy.Hp > 0 && battleActorHp(game, activeActor) > 0) {
    escapedEnemies = [...(game.battle?.escapedEnemies || [])];
    const nextEnemy = advanceBattleEscapedEnemy(game, enemy, battleLog);
    if (nextEnemy) {
      result = "enemy-escaped-next";
      battleLog.forEach((line) => addLog(game, line));
      return {
        result,
        enemyName,
        nextEnemyName: nextEnemy.Name,
        petName,
        exp,
        playerExp: 0,
        petExp: 0,
        levelUps: [],
        stone,
        sourceCommand: options.sourceCommand,
        playerAction: options.playerAction || null,
        enemyAi: options.enemyAi || null,
        playerEscape: options.playerEscape || null,
        itemUse: options.itemUse || null,
        defeatedEnemies: game.battle?.defeatedEnemies || [],
        escapedEnemies: game.battle?.escapedEnemies || escapedEnemies,
        sourceResults: [],
        lootItems: [],
        potentialLootItems: [],
        turns: turnCount,
        log: battleLog
      };
    }
    result = "enemy-escaped";
    escapedEnemies = game.battle?.escapedEnemies?.length
      ? [...game.battle.escapedEnemies]
      : [enemyBattleSummary(enemy)];
    clearPetBattleRuntimeEffects(game, activeActor);
    game.encounter = null;
    game.battle = null;
    battleLog.push(`敌方逃离，战斗结束。`);
  } else if (enemy.Hp <= 0) {
    const nextEnemy = advanceBattleEnemy(game, enemy, battleLog);
    if (nextEnemy) {
      result = "next-enemy";
      battleLog.forEach((line) => addLog(game, line));
      return {
        result,
        enemyName,
        nextEnemyName: nextEnemy.Name,
        petName,
        exp,
        playerExp: 0,
        petExp: 0,
        levelUps: [],
        stone,
        sourceCommand: options.sourceCommand,
        playerAction: options.playerAction || null,
        enemyAi: options.enemyAi || null,
        playerEscape: options.playerEscape || null,
        itemUse: options.itemUse || null,
        defeatedEnemies: game.battle?.defeatedEnemies || [],
        escapedEnemies: game.battle?.escapedEnemies || [],
        sourceResults: [],
        lootItems: [],
        potentialLootItems: [],
        turns: turnCount,
        log: battleLog
      };
    }
    result = "victory";
    defeatedEnemies = completedBattleEnemies(game, enemy);
    const rewardPet = battleRewardPet(game, activeActor);
    const reward = grantBattleExperience(game, rewardPet, defeatedEnemies, { reason: "victory" });
    rewardSummary = {
      playerExp: Number(reward.playerExp || 0),
      petExp: Number(reward.petExp || 0),
      levelUps: [...(reward.levelUps || [])],
      sourceResults: [...(reward.sourceResults || [])],
      lootItems: [],
      potentialLootItems: battlePotentialLootItems(defeatedEnemies),
      skippedLootItems: []
    };
    exp = reward.playerExp;
    stone = defeatedEnemies.reduce((sum, item) => sum + 12 + Number(item.Lv || 1) * 4, 0);
    game.player.stone += stone;
    syncStoneItem(game);
    const loot = grantBattleLoot(game, defeatedEnemies);
    rewardSummary.lootItems = loot.items;
    rewardSummary.skippedLootItems = loot.skipped;
    const defeatedText = defeatedEnemies.length > 1
      ? `击败敌方 ${defeatedEnemies.length} 人`
      : `击败 ${enemy.Name}`;
    const petReward = reward.petName ? `，${reward.petName} 获得 ${reward.petExp} 经验` : "";
    const levelText = reward.levelUps.length ? ` ${reward.levelUps.join(" ")}` : "";
    const lootText = loot.items.length ? ` 掉落：${formatLootList(loot.items)}。` : "";
    const skippedText = loot.skipped.length ? ` 背包已满，未能获得 ${formatLootList(loot.skipped)}。` : "";
    battleLog.push(`${defeatedText}，人物获得 ${reward.playerExp} 经验${petReward}，获得 ${stone} 石币。${lootText}${skippedText}${levelText}`.trim());
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: enemy.Name,
      result: "battle"
    });
    settleNpcEnemyVictory(game, game.battle?.npcEnemy, battleLog);
    clearPetBattleRuntimeEffects(game, activeActor);
    game.encounter = null;
    game.battle = null;
  } else if (battleActorHp(game, game.player) <= 0) {
    result = "defeat";
    recordBattleDefeat(game, null);
    game.player.hp = Math.max(1, Math.floor(Number(game.player.maxHp || 1) * 0.5));
    clearPetBattleRuntimeEffects(game, activeActor);
    game.encounter = null;
    game.battle = null;
    battleLog.push(`${game.player?.name || "player"} 被击倒，你带着队伍撤退并恢复了少量体力。`);
  } else if (actorIsPet && battleActorHp(game, activeActor) <= 0 && battleActorHp(game, game.player) > 0) {
    result = "pet-defeated";
    recordPetBattleKnockout(game, activeActor);
    clearPetBattleRuntimeEffects(game, activeActor);
    ensurePetFormation(game).activeIndex = -1;
    game.battle.mode = "command";
    advanceBattleCommandWindow(game);
    battleLog.push(`${actorName} 被击倒，退到后方，${game.player?.name || "player"} 继续战斗。`);
    game.battle.log = [...(game.battle.log || []), ...battleLog].slice(-8);
  } else if (battleActorHp(game, activeActor) <= 0) {
    result = "defeat";
    recordBattleDefeat(game, actorIsPet ? activeActor : null);
    if (actorIsPet) {
      const recovered = Math.max(1, Math.floor(Number(activeActor.WorkMaxHp || 1) * 0.35));
      activeActor.Hp = recovered;
    }
    game.player.hp = Math.max(1, Math.floor(Number(game.player.maxHp || 1) * 0.5));
    clearPetBattleRuntimeEffects(game, activeActor);
    game.encounter = null;
    game.battle = null;
    battleLog.push(actorIsPet
      ? `${actorName} 被击倒，你带着队伍撤退并恢复了少量体力。`
      : `${actorName} 被击倒，你撤退并恢复了少量体力。`);
  } else {
    if (actorIsPet) consumeBattleMagicStatusesAfterRound(activeActor);
    game.battle.mode = "command";
    advanceBattleCommandWindow(game);
    game.battle.log = [...(game.battle.log || []), ...battleLog].slice(-8);
  }
  battleLog.forEach((line) => addLog(game, line));
  return {
    result,
    enemyName,
    petName,
    exp,
    playerExp: rewardSummary.playerExp,
    petExp: rewardSummary.petExp,
    levelUps: rewardSummary.levelUps,
    stone,
    sourceCommand: options.sourceCommand,
    playerAction: options.playerAction || null,
    enemyAi: options.enemyAi || null,
    playerEscape: options.playerEscape || null,
    itemUse: options.itemUse || null,
    defeatedEnemies,
    escapedEnemies,
    sourceResults: rewardSummary.sourceResults,
    lootItems: rewardSummary.lootItems,
    potentialLootItems: rewardSummary.potentialLootItems,
    skippedLootItems: rewardSummary.skippedLootItems,
    turns: turnCount,
    log: battleLog
  };
}

function battlePotentialLootItems(defeatedEnemies = []) {
  const potential = [];
  for (const enemy of defeatedEnemies || []) {
    potential.push(...compactBattleLootItems(enemy.EnemyDropTable || enemy.dropTable || []));
  }
  return mergeBattleLootItems(potential);
}

function grantBattleLoot(game, defeatedEnemies = []) {
  const rolled = [];
  for (const enemy of defeatedEnemies || []) {
    rolled.push(...compactBattleLootItems(enemy.EnemyDropItems || enemy.lootItems || []));
  }
  const awardedSlots = [];
  for (const item of rolled) {
    if (awardedSlots.length < BATTLE_GETITEM_MAX) {
      awardedSlots.push(item);
      continue;
    }
    // Source BATTLE_AddExpItem gives each player only GETITEM_MAX result slots;
    // overflow has a 50% chance to replace one of those slots, otherwise it is lost.
    if (randInt(2) === 1) awardedSlots[randInt(BATTLE_GETITEM_MAX)] = item;
  }

  const items = [];
  const skipped = [];
  for (const item of awardedSlots) {
    if (!item?.id) continue;
    if (!canCarryItem(game, item)) {
      skipped.push({ ...item, reason: "inventory-full" });
      continue;
    }
    addInventoryItem(game, item, Number(item.qty || 1));
    items.push(item);
  }
  return {
    items: mergeBattleLootItems(items),
    skipped: mergeBattleLootItems(skipped)
  };
}

function mergeBattleLootItems(items = []) {
  const byId = new Map();
  for (const item of items || []) {
    const id = Number(item?.id || 0);
    if (!id) continue;
    const existing = byId.get(id);
    if (existing) {
      existing.qty = Number(existing.qty || 1) + Number(item.qty || 1);
    } else {
      byId.set(id, { ...item, id, qty: Math.max(1, Number(item.qty || 1)) });
    }
  }
  return [...byId.values()];
}

function formatLootList(items = []) {
  return (items || [])
    .map((item) => `${item.name || `item ${item.id}`} x${Math.max(1, Number(item.qty || 1))}`)
    .join("、");
}

function guideLootChanceText(item = {}) {
  const probability = Number(item.probability || 0);
  const rollBase = Math.max(1, Number(item.rollBase || ENEMY_DROP_ROLL_BASE));
  if (probability <= 0) return "概率未标明";
  const pct = (probability / rollBase) * 100;
  const pctText = pct >= 1 ? pct.toFixed(pct >= 10 ? 0 : 1) : pct.toFixed(2);
  return `${probability}/${rollBase}，约 ${pctText}%`;
}

function guidePotentialLootText(items = [], limit = 6) {
  const list = mergeBattleLootItems(items || [])
    .filter((item) => Number(item.id || 0) > 0)
    .slice(0, limit);
  if (!list.length) return "";
  return list
    .map((item) => `${item.name || `item ${item.id}`} x${Math.max(1, Number(item.qty || 1))}（${guideLootChanceText(item)}${item.source ? `，${item.source}` : ""}）`)
    .join("；");
}

function sourceTaskLootNeeds(game) {
  const tasks = sourceScriptTaskState(game);
  const needs = [];
  for (const task of tasks || []) {
    for (const item of task.requiredItems || []) {
      const id = Number(item.id || 0);
      if (!id) continue;
      needs.push({
        id,
        name: item.name || `item ${id}`,
        qty: Math.max(1, Number(item.qty || item.needed || 1)),
        have: Number(item.have || 0),
        taskTitle: task.title || `EventNo ${task.eventNo}`,
        phase: task.phase || "进行中",
        target: task.target ? {
          name: task.target.name || "",
          mapName: task.target.mapName || "",
          mapId: task.target.mapId || "",
          x: task.target.x,
          y: task.target.y
        } : null,
        source: task.source || task.sourceCluster || ""
      });
    }
  }
  return needs;
}

function sourceTaskNeedLabel(need = {}) {
  const have = Number(need.have || 0);
  const qty = Math.max(1, Number(need.qty || 1));
  const progress = qty > 1 || have > 0 ? ` ${have}/${qty}` : "";
  return `${need.name || `item ${need.id}`}${progress}`;
}

function guideTaskLootText(game, candidateItems = [], scope = "当前/上一场敌人") {
  const taskNeeds = sourceTaskLootNeeds(game);
  if (!taskNeeds.length) return "";
  const candidates = mergeBattleLootItems(candidateItems || []).filter((item) => Number(item.id || 0) > 0);
  if (!candidates.length) {
    const labels = taskNeeds.slice(0, 4).map(sourceTaskNeedLabel).join("、");
    return `当前原脚本任务需要 ${labels}；现在没有可对照的 enemy1.txt 候选掉落。`;
  }
  const candidateIds = new Set(candidates.map((item) => Number(item.id || 0)));
  const matched = taskNeeds.filter((need) => candidateIds.has(Number(need.id || 0)));
  if (matched.length) {
    const labels = matched.slice(0, 4).map((need) => `${sourceTaskNeedLabel(need)}（${need.taskTitle}）`).join("、");
    return `当前任务相关掉落：${labels} 出现在${scope}的 enemy1.txt 候选掉落中；能不能拿到仍按 ITEMPROB 概率结算。`;
  }
  const labels = taskNeeds.slice(0, 4).map((need) => `${sourceTaskNeedLabel(need)}（${need.taskTitle}）`).join("、");
  const target = taskNeeds.find((need) => need.target)?.target;
  const targetText = target?.name
    ? `；优先去目标 NPC：${target.mapName || `floor ${target.mapId}`} (${target.x},${target.y}) 的 ${target.name}，按脚本领取或交付`
    : "；优先按任务目标 NPC、脚本条件和背包要求推进";
  return `当前任务需求 ${labels} 没有出现在${scope}的 enemy1.txt 候选掉落中${targetText}，不要把所有任务道具都当成怪物掉落。`;
}

function guideLastBattleSummary(game) {
  const outcome = game?.lastBattleOutcome;
  if (!outcome) return null;
  const lootText = formatLootList(outcome.lootItems || []);
  const potentialLootText = guidePotentialLootText(outcome.potentialLootItems || [], 8);
  const skippedLootText = formatLootList(outcome.skippedLootItems || []);
  const taskLootText = guideTaskLootText(game, outcome.potentialLootItems || [], "上一场敌人");
  return {
    result: outcome.result || "",
    defeatedEnemies: (outcome.defeatedEnemies || []).map((enemy) => `${enemy.Name || "敌人"} Lv.${Number(enemy.Lv || 0)}`).slice(0, 6),
    escapedEnemies: (outcome.escapedEnemies || []).map((enemy) => `${enemy.Name || "敌人"} Lv.${Number(enemy.Lv || 0)}`).slice(0, 6),
    lootText,
    potentialLootText,
    taskLootText,
    skippedLootText,
    source: "gmsv-data/enemy/enemy1.txt ITEM/ITEMPROB -> battle settlement"
  };
}

function advanceBattleEnemy(game, defeatedEnemy, battleLog) {
  const battle = game.battle;
  if (!battle || !Array.isArray(battle.enemyParty) || battle.enemyParty.length <= 1) return null;
  const activeIndex = Math.max(0, Number(battle.activeEnemyIndex || 0));
  battle.enemyParty[activeIndex] = { ...battle.enemyParty[activeIndex], ...defeatedEnemy, Hp: 0 };
  const nextIndex = battle.enemyParty.findIndex((item) => Number(item.Hp || 0) > 0);
  if (nextIndex < 0) return null;
  battle.defeatedEnemies ||= [];
  battle.defeatedEnemies.push(enemyBattleSummary(defeatedEnemy));
  const nextEnemy = battle.enemyParty[nextIndex];
  battle.activeEnemyIndex = nextIndex;
  game.encounter = nextEnemy;
  battle.mode = "command";
  advanceBattleCommandWindow(game);
  battleLog.push(`击倒 ${defeatedEnemy.Name}。`);
  battleLog.push(`敌方第 ${nextIndex + 1}/${battle.enemyParty.length} 个目标 ${nextEnemy.Name} Lv.${nextEnemy.Lv} 上前。`);
  battle.log = [...(battle.log || []), ...battleLog].slice(-8);
  return nextEnemy;
}

function advanceBattleEscapedEnemy(game, escapedEnemy, battleLog) {
  const battle = game.battle;
  if (!battle || !Array.isArray(battle.enemyParty) || battle.enemyParty.length <= 1) return null;
  const activeIndex = Math.max(0, Number(battle.activeEnemyIndex || 0));
  battle.enemyParty[activeIndex] = { ...battle.enemyParty[activeIndex], ...escapedEnemy, Hp: 0, BattleEscaped: true };
  battle.escapedEnemies ||= [];
  battle.escapedEnemies.push(enemyBattleSummary(escapedEnemy));
  const nextIndex = battle.enemyParty.findIndex((item) => Number(item.Hp || 0) > 0 && !item.BattleEscaped);
  if (nextIndex < 0) return null;
  const nextEnemy = battle.enemyParty[nextIndex];
  battle.activeEnemyIndex = nextIndex;
  game.encounter = nextEnemy;
  battle.mode = "command";
  advanceBattleCommandWindow(game);
  battleLog.push(`敌方第 ${nextIndex + 1}/${battle.enemyParty.length} 个目标 ${nextEnemy.Name} Lv.${nextEnemy.Lv} 上前。`);
  battle.log = [...(battle.log || []), ...battleLog].slice(-8);
  return nextEnemy;
}

function completedBattleEnemies(game, finalEnemy) {
  const defeated = Array.isArray(game.battle?.defeatedEnemies) ? [...game.battle.defeatedEnemies] : [];
  defeated.push(enemyBattleSummary(finalEnemy));
  return defeated;
}

function enemyBattleSummary(enemy) {
  return {
    EnemyId: enemy.EnemyId,
    PetId: enemy.PetId,
    Name: enemy.Name,
    Lv: enemy.Lv,
    Exp: sourceEnemyExp(enemy),
    SourceExp: sourceEnemyExp(enemy),
    WorkFixStr: enemy.WorkFixStr,
    WorkFixTough: enemy.WorkFixTough,
    WorkFixDex: enemy.WorkFixDex,
    WorkFixCharm: enemy.WorkFixCharm,
    WorkAttackPower: enemy.WorkAttackPower,
    WorkDefencePower: enemy.WorkDefencePower,
    WorkQuick: enemy.WorkQuick,
    EarthAT: enemy.EarthAT,
    WaterAT: enemy.WaterAT,
    FireAT: enemy.FireAT,
    WindAT: enemy.WindAT,
    BattleStatuses: compactBattleStatuses(enemy),
    EnemyDropItems: compactBattleLootItems(enemy.EnemyDropItems || enemy.lootItems || []),
    EnemyDropTable: compactBattleLootItems(enemy.EnemyDropTable || enemy.dropTable || [])
  };
}

function compactBattleLootItems(items = []) {
  return (items || [])
    .filter(Boolean)
    .slice(0, 10)
    .map((item) => ({
      id: Number(item.id || 0),
      name: item.name || `item ${item.id || 0}`,
      qty: Math.max(1, Number(item.qty || 1)),
      image: item.image,
      type: item.type,
      useField: item.useField,
      target: item.target,
      level: item.level,
      cost: item.cost,
      description: item.description,
      secretName: item.secretName,
      category: item.category,
      option: item.option,
      effectOption: item.effectOption,
      functionName: item.functionName,
      useFunction: item.useFunction,
      damageBreak: item.damageBreak,
      maxUses: item.maxUses,
      usesRemaining: item.usesRemaining,
      slot: Number(item.slot || 0),
      probability: Number(item.probability || 0),
      rollBase: Number(item.rollBase || ENEMY_DROP_ROLL_BASE),
      source: item.source || `${GMSV_DATA_SOURCE}/enemy1.txt`
    }))
    .filter((item) => item.id > 0);
}

function settleNpcEnemyVictory(game, npcEnemy, battleLog) {
  if (!npcEnemy?.npcId) return;
  ensureFlags(game);
  setEventFlag(game, stableFlag(`${npcEnemy.npcId}:npcenemy-win`), "end");
  updateQuestProgress(game, "npcEnemyWin", {
    npcId: npcEnemy.npcId,
    npcName: npcEnemy.npcName || "",
    mapId: game.location.mapId
  });
  grantNpcEnemyAddItems(game, npcEnemy, battleLog);
  const postBattleEvent = chooseNpcEnemyPostBattleEvent(game, npcEnemy);
  if (postBattleEvent?.event) {
    const event = postBattleEvent.event;
    if (event.endMessage) battleLog.push(event.endMessage);
    applyNpcEnemyPostBattleSourceEffects(game, npcEnemy, event, battleLog);
    if (!Array.isArray(event.warps) || !event.warps.length) {
      applyNpcEnemyReplacement(game, npcEnemy, battleLog);
      return;
    }
    if (postBattleEvent.target?.mapId && WORLD.maps[postBattleEvent.target.mapId]) {
      game.location = {
        ...game.location,
        mapId: postBattleEvent.target.mapId,
        x: Number(postBattleEvent.target.x || 0),
        y: Number(postBattleEvent.target.y || 0)
      };
      battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 按 NEWEVENT${event.seq || ""} 把你送到 (${game.location.x},${game.location.y})。`);
      applyNpcEnemyReplacement(game, npcEnemy, battleLog);
      return;
    }
    battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 的 NEWEVENT${event.seq || ""} 没有可加载的地图目标。`);
    applyNpcEnemyReplacement(game, npcEnemy, battleLog);
    return;
  }
  if (Array.isArray(npcEnemy.postBattleEvents) && npcEnemy.postBattleEvents.length) {
    battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 的战后传送条件未满足。`);
    applyNpcEnemyReplacement(game, npcEnemy, battleLog);
    return;
  }
  applyNpcEnemyPostBattleSourceEffects(game, npcEnemy, null, battleLog);
  if (npcEnemy.endMessage) battleLog.push(npcEnemy.endMessage);
  if (Number(npcEnemy.dieAct || 0) === 1 && npcEnemy.warp?.mapId && WORLD.maps[npcEnemy.warp.mapId]) {
    game.location = {
      ...game.location,
      mapId: npcEnemy.warp.mapId,
      x: Number(npcEnemy.warp.x || 0),
      y: Number(npcEnemy.warp.y || 0)
    };
    battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 让开并把你送到 (${game.location.x},${game.location.y})。`);
    applyNpcEnemyReplacement(game, npcEnemy, battleLog);
    return;
  }
  const respawnSeconds = Math.max(1, Number(npcEnemy.respawnSeconds || 60));
  game.flags.npcEnemyDefeats ||= {};
  game.flags.npcEnemyDefeats[npcEnemy.npcId] = {
    npcName: npcEnemy.npcName || "",
    source: npcEnemy.source || "",
    defeatedAt: new Date().toISOString(),
    until: new Date(Date.now() + respawnSeconds * 1000).toISOString()
  };
  battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 暂时退开，通路打开 ${respawnSeconds} 秒。`);
  applyNpcEnemyReplacement(game, npcEnemy, battleLog);
}

function applyNpcEnemyPostBattleSourceEffects(game, npcEnemy, event, battleLog) {
  if (!npcEnemy?.npcId) return;
  if (Array.isArray(event?.addItems) && event.addItems.length) {
    grantNpcEnemyAddItems(game, {
      ...npcEnemy,
      addItems: event.addItems,
      source: event.source || npcEnemy.source || ""
    }, battleLog);
  }
  applyNpcEnemyHeroBattleField(game, npcEnemy, event, battleLog);
  applyNpcEnemyEventFlags(game, npcEnemy, event);
  syncCharacterFields(game);
}

function applyNpcEnemyHeroBattleField(game, npcEnemy, event, battleLog) {
  const floor = Number(event?.heroBattleField || npcEnemy?.heroBattleField || 0);
  if (!Number.isFinite(floor) || floor <= 0) return null;
  const npc = npcEnemyVmNpc(npcEnemy);
  const vmEvent = runNpcVmAction(game, npc, {
    type: "heroBattleField",
    floor,
    reason: "npcenemy-herobattlefield",
    source: event?.source || npcEnemy.source || ""
  });
  if (vmEvent.ok && vmEvent.detail?.mutated) {
    battleLog?.push(`${npcEnemy.npcName || "NPCEnemy"} 记录英雄战场进度 ${floor}。`);
  }
  return vmEvent;
}

function applyNpcEnemyEventFlags(game, npcEnemy, event) {
  if (!event) return;
  const npc = npcEnemyVmNpc(npcEnemy);
  const source = event.source || npcEnemy?.source || "";
  for (const flag of event.endSetFlags || []) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      shiftbit: Number(flag),
      kind: "end",
      reason: "npcenemy-event-end",
      source
    });
  }
  for (const flag of event.nowSetFlags || []) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      shiftbit: Number(flag),
      kind: "now",
      reason: "npcenemy-event-now",
      source
    });
  }
  for (const flag of event.clearFlags || []) {
    runNpcVmAction(game, npc, {
      type: "clearFlag",
      shiftbit: Number(flag),
      kind: "both",
      reason: "npcenemy-evclr",
      source
    });
  }
}

function npcEnemyVmNpc(npcEnemy) {
  const found = findWorldNpcWithMap(npcEnemy?.npcId);
  return found?.npc || {
    id: npcEnemy?.npcId || "npcenemy",
    name: npcEnemy?.npcName || "NPCEnemy",
    type: "NPCEnemy",
    source: npcEnemy?.source || ""
  };
}

function applyNpcEnemyReplacement(game, npcEnemy, battleLog) {
  const points = Array.isArray(npcEnemy?.replacementPoints) ? npcEnemy.replacementPoints : [];
  if (!npcEnemy?.npcId || !points.length) return null;
  const found = findWorldNpcWithMap(npcEnemy.npcId);
  const npc = found?.npc || {
    id: npcEnemy.npcId,
    name: npcEnemy.npcName || "NPCEnemy",
    type: "NPCEnemy",
    source: npcEnemy.source || ""
  };
  const event = runNpcVmAction(game, npc, {
    type: "moveNpc",
    npcId: npcEnemy.npcId,
    points,
    reason: "npcenemy-replacement",
    source: `gmsv/npc/npc_npcenemy.c Check_EnemyWarpMe + ${npcEnemy.source || ""}`
  });
  const target = event.detail?.target;
  if (event.ok && target) {
    battleLog?.push(`${npcEnemy.npcName || "NPCEnemy"} 按 REPLACEMENT 移到 (${target.x},${target.y})。`);
    return target;
  }
  if (!event.ok) {
    battleLog?.push(`${npcEnemy.npcName || "NPCEnemy"} 的 REPLACEMENT 目标不可用：${event.error || "moveNpc blocked"}。`);
  }
  return null;
}

function grantNpcEnemyAddItems(game, npcEnemy, battleLog) {
  const addItems = npcEnemyItemEntries(game, npcEnemy?.addItems);
  if (!addItems.length) return [];
  const found = findWorldNpcWithMap(npcEnemy.npcId);
  const npc = found?.npc || {
    id: npcEnemy.npcId,
    name: npcEnemy.npcName || "NPCEnemy",
    type: "NPCEnemy",
    source: npcEnemy.source || ""
  };
  const granted = [];
  for (const item of addItems) {
    const event = runNpcVmAction(game, npc, {
      type: "give",
      item,
      itemId: item.id,
      itemName: item.name,
      qty: item.qty,
      reason: "npcenemy-additem",
      source: npcEnemy.source || ""
    });
    if (event.ok) {
      granted.push(item);
      battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 交给你 ${item.name} x${item.qty}。`);
    } else {
      battleLog.push(`${npcEnemy.npcName || "NPCEnemy"} 想交给你 ${item.name}，但 ${event.error || "背包放不下"}。`);
    }
  }
  return granted;
}

function chooseNpcEnemyPostBattleEvent(game, npcEnemy = {}) {
  const events = Array.isArray(npcEnemy.postBattleEvents) ? npcEnemy.postBattleEvents : [];
  for (const event of events) {
    const condition = characterConditionStatus(game, event.condition || "LV>0");
    if (!condition.ok) continue;
    const warps = Array.isArray(event.warps) ? event.warps.filter((warp) => warp?.mapId) : [];
    const index = warps.length
      ? stableHashInt([
        npcEnemy.npcId || "",
        npcEnemy.source || "",
        event.seq || 0,
        game.player?.name || "",
        game.player?.battleCount || 0,
        game.location?.mapId || ""
      ].join("|")) % warps.length
      : -1;
    return {
      event,
      condition,
      target: index >= 0 ? warps[index] : null,
      source: "gmsv/npc/npc_npcenemy.c NPC_NPCEnemy_CheckFree"
    };
  }
  return null;
}

function performCaptureAction(game) {
  if (!game.encounter) throw new Error("当前没有可捕获目标");
  const target = game.encounter;
  const enemyName = target.Name || "野外宠物";
  const activePet = getActivePet(game);
  const activeActor = activePet || game.player;
  ensureBattleState(game, activeActor, target);
  game.battle.sourceCommand = "T|0";
  game.battle.mode = "resolving";
  const rate = Math.max(0, Math.min(100, Number(target.CaptureRate ?? 35)));
  if (rate > 0 && petState(game).used >= PET_CAPACITY) {
    const line = `宠物栏已满（${PET_CAPACITY}/${PET_CAPACITY}），无法捕获 ${enemyName}。`;
    if (game.battle) game.battle.log = [...(game.battle.log || []), line].slice(-8);
    addLog(game, line);
    return { result: "pet-full", enemyName, petName: enemyName, sourceCommand: "T|0", log: [line] };
  }
  const ok = Math.random() * 100 < rate;
  if (ok) {
    const capturedPet = normalizeCapturedPet(target);
    const turnCount = Number(game.battle?.turn || 0) + 1;
    game.pets.push(capturedPet);
    if (activePet) clearBattleRuntimeEffects(activePet);
    game.encounter = null;
    game.battle = null;
    const reward = activePet
      ? grantBattleExperience(game, activePet, [target], { reason: "capture", scale: 0.5 })
      : { playerExp: 0, petExp: 0, petName: "", levelUps: [] };
    const exp = reward.playerExp;
    const stone = 20;
    game.player.stone += stone;
    syncStoneItem(game);
    const petReward = reward.petName ? `，${reward.petName} 获得 ${reward.petExp} 经验` : "";
    const levelText = reward.levelUps.length ? ` ${reward.levelUps.join(" ")}` : "";
    const line = `捕获成功！${enemyName} 加入了队伍，人物获得 ${exp} 经验${petReward}，获得 ${stone} 石币。${levelText}`.trim();
    addLog(game, line);
    updateQuestProgress(game, "fieldWin", {
      mapId: game.location.mapId,
      petName: enemyName,
      result: "capture"
    });
    return {
      result: "captured",
      enemyName,
      petName: enemyName,
      exp,
      playerExp: Number(reward.playerExp || 0),
      petExp: Number(reward.petExp || 0),
      levelUps: [...(reward.levelUps || [])],
      stone,
      rate,
      sourceCommand: "T|0",
      sourceResults: [...(reward.sourceResults || [])],
      defeatedEnemies: [],
      lootItems: [],
      turns: turnCount,
      log: [line]
    };
  }
  const battleLog = [`${enemyName} 挣脱了绳索。`];
  const hit = combatDamageDetail(target, activeActor);
  setBattleActorHp(game, activeActor, battleActorHp(game, activeActor) - hit.damage);
  battleLog.push(`${target.Name} 反击 ${battleActorName(game, activeActor)}，造成 ${hit.damage} 伤害${battleDetailSuffix(hit)}。`);
  return settleBattleRound(game, activeActor, target, {
    battleLog,
    result: "capture-missed",
    sourceCommand: "T|0"
  });
}

function ensureBattleState(game, activeActor, enemy) {
  ensureBattleActorHp(game, activeActor);
  enemy.WorkMaxHp ||= Math.max(1, Number(enemy.Hp || 1));
  if (!Number.isFinite(Number(enemy.Hp)) || Number(enemy.Hp) <= 0) enemy.Hp = enemy.WorkMaxHp;
  game.battle ||= {
    mode: "command",
    turn: 0,
    startedAt: new Date().toISOString(),
    log: [`${battleActorName(game, activeActor)} 遭遇 ${enemy.Name}，战斗开始。`],
    sourceCommand: "",
    source: `gmsv battle_command.c + battle.c command loop from ${GMSV_DATA_SOURCE} enemy parameters`,
    sourceLayout: sourceBattleLayoutState(activeActor),
    turnSeconds: BATTLE_TURN_SECONDS
  };
  markBattleCommandWindow(game);
}

function markBattleCommandWindow(game) {
  if (!game.battle || game.battle.mode !== "command") return;
  const now = Date.now();
  game.battle.turnSeconds = BATTLE_TURN_SECONDS;
  game.battle.roundStartedAt ||= new Date(now).toISOString();
  game.battle.roundDeadlineAt ||= new Date(now + BATTLE_TURN_SECONDS * 1000).toISOString();
}

function advanceBattleCommandWindow(game) {
  if (!game.battle) return;
  const now = Date.now();
  game.battle.roundStartedAt = new Date(now).toISOString();
  game.battle.roundDeadlineAt = new Date(now + BATTLE_TURN_SECONDS * 1000).toISOString();
  game.battle.turnSeconds = BATTLE_TURN_SECONDS;
}

function combatDamage(attacker, defender, multiplier = 1) {
  return combatDamageDetail(attacker, defender, multiplier).damage;
}

function combatDamageDetail(attacker, defender, multiplier = 1) {
  const attack = workAttackPower(attacker);
  const defense = sourceBattleDefensePower(defender);
  const elementMultiplier = elementalDamageMultiplier(attacker, defender);
  let raw = 0;
  if (defense <= attack && attack < defense * (8 / 7)) {
    raw = Math.random() * (attack / 16);
  } else if (defense > attack) {
    raw = Math.random();
  } else {
    raw = ((attack - defense) * 2) + (Math.random() * (attack / 8) - attack / 16);
  }
  const critical = Math.random() * 100 < Math.max(2, Number(attacker.Critical || 0) * 0.35);
  return {
    damage: Math.max(0, Math.floor(raw * (critical ? 1.6 : 1) * multiplier * elementMultiplier)),
    critical,
    elementMultiplier
  };
}

function sourceBattleDefensePower(char = {}) {
  let defense = workDefencePower(char) * 0.70;
  if (Number(char.WorkStone || char.BattleStatuses?.stone?.turns || 0) > 0) defense *= 2;
  return Math.max(0, defense);
}

function applySourceGuardAdjust(detail, seedParts = []) {
  const roll = (stableHashInt(seedParts.join("|")) % 100) + 1;
  let multiplier = 0.5;
  if (roll <= 25) multiplier = 0;
  else if (roll <= 50) multiplier = 0.1;
  else if (roll <= 70) multiplier = 0.2;
  else if (roll <= 85) multiplier = 0.3;
  else if (roll <= 95) multiplier = 0.4;
  const originalDamage = Math.max(0, Number(detail.damage || 0));
  return {
    ...detail,
    damage: Math.max(0, Math.floor(originalDamage * multiplier)),
    guardAdjust: {
      roll,
      multiplier,
      originalDamage,
      source: "gmsv battle_event.c BATTLE_GuardAdjust"
    }
  };
}

function workAttackPower(char = {}) {
  return Math.max(1, firstFiniteNumber(1, char.WorkAttackPower, char.WorkFixStr, char.level, char.Lv));
}

function workDefencePower(char = {}) {
  const base = Math.max(0, firstFiniteNumber(0, char.WorkDefencePower, char.WorkFixTough));
  return Math.max(0, Math.floor(base * battleMagicDefenceMultiplier(char)));
}

function workQuick(char = {}) {
  return Math.max(0, firstFiniteNumber(0, char.WorkQuick, char.WorkFixDex, Number(char.Dex) / 100));
}

function battleMagicDefenceMultiplier(char = {}) {
  const status = char.BattleMagicStatuses?.superWall || char.BattleMagicStatus;
  if (!status || Number(status.turns || 0) <= 0 || status.stat !== "defence") return 1;
  return 1 + Math.max(0, Number(status.percent || 0)) / 100;
}

function firstFiniteNumber(fallback, ...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return fallback;
}

function battleDetailSuffix(detail) {
  const parts = [];
  if (detail.critical) parts.push("会心");
  if (Math.abs(Number(detail.elementMultiplier || 1) - 1) >= 0.06) {
    parts.push(`属性${detail.elementMultiplier > 1 ? "有利" : "不利"} x${detail.elementMultiplier.toFixed(2)}`);
  }
  if (detail.guardAdjust) {
    const multiplier = Number(detail.guardAdjust.multiplier || 0);
    parts.push(multiplier <= 0 ? "完全防御" : `防御x${multiplier.toFixed(2)}`);
  }
  return parts.length ? `（${parts.join("，")}）` : "";
}

function elementalDamageMultiplier(attacker, defender) {
  const a = elementVector(attacker);
  const d = elementVector(defender);
  const aNone = Math.max(0, 100 - a.earth - a.water - a.fire - a.wind);
  const dNone = Math.max(0, 100 - d.earth - d.water - d.fire - d.wind);
  const fire = a.fire * dNone * 1.5 + a.fire * d.fire + a.fire * d.water * 0.6 + a.fire * d.earth + a.fire * d.wind * 1.5;
  const water = a.water * dNone * 1.5 + a.water * d.fire * 1.5 + a.water * d.water + a.water * d.earth * 0.6 + a.water * d.wind;
  const earth = a.earth * dNone * 1.5 + a.earth * d.fire + a.earth * d.water * 1.5 + a.earth * d.earth + a.earth * d.wind * 0.6;
  const wind = a.wind * dNone * 1.5 + a.wind * d.fire * 0.6 + a.wind * d.water + a.wind * d.earth * 1.5 + a.wind * d.wind;
  const none = aNone * dNone + aNone * d.fire * 0.6 + aNone * d.water * 0.6 + aNone * d.earth * 0.6 + aNone * d.wind * 0.6;
  return Math.max(0.1, (fire + water + earth + wind + none) / 10000);
}

function elementVector(char = {}) {
  return {
    earth: clampInt(char.EarthAT ?? char.Earth ?? char.earth, 0, 100, 0),
    water: clampInt(char.WaterAT ?? char.Water ?? char.water, 0, 100, 0),
    fire: clampInt(char.FireAT ?? char.Fire ?? char.fire, 0, 100, 0),
    wind: clampInt(char.WindAT ?? char.WindAt ?? char.Wind ?? char.wind, 0, 100, 0)
  };
}

function levelExp(level) {
  const lv = clampInt(level, 0, CHAR_MAXUPLEVEL, 0);
  return LEVEL_EXP_TABLE[lv] ?? CHAR_MAX_EXP;
}

function progressionSummary(level, exp) {
  const lv = clampInt(level, 1, CHAR_MAXUPLEVEL, 1);
  const safeExp = clampInt(exp, 0, CHAR_MAX_EXP, 0);
  const currentLevelExp = levelExp(lv);
  const nextExp = lv >= CHAR_MAXUPLEVEL ? -1 : levelExp(lv + 1);
  const span = nextExp > currentLevelExp ? nextExp - currentLevelExp : 1;
  const expInLevel = Math.max(0, safeExp - currentLevelExp);
  const expToNext = nextExp < 0 ? 0 : Math.max(0, nextExp - safeExp);
  return {
    level: lv,
    exp: safeExp,
    currentLevelExp,
    nextExp,
    expInLevel,
    expToNext,
    progressPct: nextExp < 0 ? 100 : Math.max(0, Math.min(100, Math.floor((expInLevel / span) * 100))),
    source: "gmsv char_data.c LevelUpTbl cumulative EXP"
  };
}

function addPlayerExp(game, amount) {
  const exp = Math.max(0, Math.trunc(Number(amount) || 0));
  if (exp <= 0) return 0;
  if (clampInt(game.player?.level ?? game.player?.Lv, 1, CHAR_MAXUPLEVEL, 1) >= CHAR_MAXUPLEVEL) return 0;
  game.player.exp = clampInt(Number(game.player.exp || 0) + exp, 0, CHAR_MAX_EXP, CHAR_MAX_EXP);
  return exp;
}

function addPetExp(pet, amount) {
  const exp = Math.max(0, Math.trunc(Number(amount) || 0));
  if (!pet || exp <= 0) return 0;
  if (clampInt(pet.Lv ?? pet.level, 1, CHAR_MAXUPLEVEL, 1) >= CHAR_MAXUPLEVEL) return 0;
  pet.Exp = clampInt(Number(pet.Exp || 0) + exp, 0, CHAR_MAX_EXP, CHAR_MAX_EXP);
  return exp;
}

function maybeLevelPlayer(game) {
  normalizePlayerRuntime(game.player);
  const levelUps = [];
  let gainedLevels = 0;
  while (game.player.level < CHAR_MAXUPLEVEL && game.player.exp >= levelExp(game.player.level + 1)) {
    game.player.level += 1;
    gainedLevels += 1;
    game.player.duelPoint = Number(game.player.duelPoint || 0) + game.player.level * 10;
    game.player.skillUpPoint = Number(game.player.skillUpPoint || 0) + PLAYER_LEVEL_SKILL_POINTS;
    compliancePlayerParameter(game.player, { preserveHp: true });
    levelUps.push(`${game.player.name} 提升到 Lv.${game.player.level}，获得 ${PLAYER_LEVEL_SKILL_POINTS} 点能力点`);
  }
  if (gainedLevels > 0) {
    game.player.charm = Math.min(100, Number(game.player.charm || 0) + PLAYER_LEVEL_CHARM_STEP);
    compliancePlayerParameter(game.player, { preserveHp: true });
  }
  normalizePlayerRuntime(game.player);
  levelUps.forEach((line) => addLog(game, `${line}。`));
  return levelUps;
}

function maybeLevelPet(game, pet) {
  if (!pet) return [];
  normalizePetRuntime(pet);
  const levelUps = [];
  const limit = petLimitLevel(pet);
  while (pet.Lv < limit && pet.Exp >= levelExp(pet.Lv + 1)) {
    petLevelUp(pet, { preserveHp: true });
    levelUps.push(`${pet.Name} 提升到 Lv.${pet.Lv}`);
  }
  normalizePetRuntime(pet);
  levelUps.forEach((line) => addLog(game, `${line}。`));
  return levelUps;
}

function petLimitLevel(pet) {
  const raw = Number(pet?.LimitLevel ?? pet?.limitLevel);
  if (!Number.isFinite(raw) || raw <= 0) return CHAR_MAXUPLEVEL;
  return clampInt(raw, 1, CHAR_MAXUPLEVEL, CHAR_MAXUPLEVEL);
}

function sourceEnemyExp(enemy) {
  const direct = Number(enemy?.SourceExp ?? enemy?.EnemyExp ?? enemy?.Exp);
  if (Number.isFinite(direct) && direct > 0) return Math.max(1, Math.trunc(direct));
  return sourceEnemyExpFromStats(enemy);
}

function sourceEnemyExpFromStats(enemy = {}) {
  const level = clampInt(enemy.Lv ?? enemy.level, 1, ENEMY_BASE_EXP_TABLE.length, 1);
  const base = ENEMY_BASE_EXP_TABLE[level - 1] || ENEMY_BASE_EXP_TABLE.at(-1) || 1;
  const rankNum = [2.5, 2, 1.5, 1, 0.5, 0][clampInt(enemy.PetRank, 0, 5, 5)] ?? 0;
  const alpha = (
    Number(enemy.Critical || 0) + Number(enemy.Counter || 0) + Number(enemy.WorkModCaptureDefault || 0)
    + Number(enemy.Poison || 0) + Number(enemy.Paralysis || 0) + Number(enemy.Sleep || 0)
    + Number(enemy.Stone || 0) + Number(enemy.Drunk || 0) + Number(enemy.Confusion || 0)
  ) / 100 + Number(enemy.Rare || 0);
  return Math.max(1, Math.trunc(base + (rankNum + alpha) * level));
}

function battleExpForLevel(enemy, characterLevel) {
  const exp = sourceEnemyExp(enemy);
  const level = clampInt(characterLevel, 1, CHAR_MAXUPLEVEL, 1);
  const enemyLevel = clampInt(enemy?.Lv, 1, CHAR_MAXUPLEVEL, 1);
  const diff = level - enemyLevel;
  if (diff <= EXPGET_MAXLEVEL) return exp;
  const factor = EXPGET_MAXLEVEL + EXPGET_DIV - diff;
  if (factor <= 0) return 1;
  return Math.max(1, Math.trunc((exp * factor) / EXPGET_DIV));
}

function scaleBattleExp(exp, scale = 1) {
  return exp <= 0 ? 0 : Math.max(1, Math.trunc(exp * Math.max(0, Number(scale) || 0)));
}

function grantBattleExperience(game, activePet, defeatedEnemies, options = {}) {
  const enemies = (defeatedEnemies || []).filter(Boolean);
  const expBonus = activeExpBonus(game);
  const scale = (options.scale ?? 1) * (expBonus?.multiplier || 1);
  const playerExp = enemies.reduce((sum, enemy) => sum + scaleBattleExp(battleExpForLevel(enemy, game.player.level), scale), 0);
  const petExp = activePet
    ? enemies.reduce((sum, enemy) => sum + scaleBattleExp(battleExpForLevel(enemy, activePet.Lv), scale), 0)
    : 0;
  const playerExpAdded = addPlayerExp(game, playerExp);
  const petExpAdded = activePet ? addPetExp(activePet, petExp) : 0;
  recordBattleVictory(game, activePet, enemies, options.reason || "battle");
  const playerLevelUps = maybeLevelPlayer(game);
  const petLevelUps = activePet ? maybeLevelPet(game, activePet) : [];
  const sourceResults = [
    {
      type: "player",
      num: -2,
      name: game.player?.name || "player",
      exp: playerExpAdded,
      levelup: playerLevelUps.length ? 1 : 0,
      level: Number(game.player?.level || 1)
    }
  ];
  if (activePet && (petExpAdded > 0 || petLevelUps.length > 0)) {
    sourceResults.push({
      type: "pet",
      num: battlePetSlot(game, activePet),
      name: activePet.Name || activePet.name || "pet",
      exp: petExpAdded,
      levelup: petLevelUps.length ? 1 : 0,
      level: Number(activePet.Lv || activePet.level || 1)
    });
  }
  syncCharacterFields(game);
  return {
    playerExp: playerExpAdded,
    petExp: petExpAdded,
    petName: activePet?.Name || "",
    levelUps: [...playerLevelUps, ...petLevelUps],
    sourceResults,
    ...(expBonus ? { expBonus } : {}),
    source: "gmsv battle.c BATTLE_AddExpItem/BATTLE_GetExpGold"
  };
}

function battleRewardPet(game, activeActor) {
  if (battleActorKind(game, activeActor) === "pet" && battleActorHp(game, activeActor) > 0) return activeActor;
  const activePet = getActivePet(game);
  return activePet && battleActorHp(game, activePet) > 0 ? activePet : null;
}

function activeExpBonus(game) {
  const entry = game.effects?.expBonus;
  if (!entry) return null;
  const until = Number(entry.until || 0);
  if (!Number.isFinite(until) || until <= Date.now()) {
    if (game.effects) delete game.effects.expBonus;
    if (game.player) {
      game.player.CHAR_WORKITEM_ADDEXP = 0;
      game.player.CHAR_WORKITEM_ADDEXPTIME = 0;
      game.player.CHAR_ADDEXPPOWER = 0;
      game.player.CHAR_ADDEXPTIME = 0;
    }
    return null;
  }
  const power = Math.max(0, Number(entry.power || 0));
  return {
    power,
    multiplier: Number(entry.multiplier) > 0 ? Number(entry.multiplier) : 1 + (power * 2) / 100,
    secondsLeft: Math.ceil((until - Date.now()) / 1000),
    itemName: entry.itemName || ""
  };
}

function recordBattleVictory(game, activePet, enemies, reason) {
  const count = Math.max(1, enemies.length);
  game.player.killPetCount = Number(game.player.killPetCount || 0) + count;
  game.player.battleCount = Number(game.player.battleCount || 0) + 1;
  game.player.winCount = Number(game.player.winCount || 0) + 1;
  game.player.lastBattleReason = reason;
  if (activePet) {
    activePet.KillPetCount = Number(activePet.KillPetCount || 0) + count;
    activePet.BattleCount = Number(activePet.BattleCount || 0) + 1;
    activePet.WinCount = Number(activePet.WinCount || 0) + 1;
    activePet.LastBattleReason = reason;
  }
}

function recordPetBattleKnockout(game, activePet) {
  if (!activePet) return;
  activePet.DeadCount = Number(activePet.DeadCount || 0) + 1;
  activePet.BattleCount = Number(activePet.BattleCount || 0) + 1;
  activePet.LastBattleReason = "pet-defeated";
  syncCharacterFields(game);
}

function recordBattleDefeat(game, activePet) {
  game.player.deadCount = Number(game.player.deadCount || 0) + 1;
  game.player.battleCount = Number(game.player.battleCount || 0) + 1;
  game.player.loseCount = Number(game.player.loseCount || 0) + 1;
  if (activePet) {
    activePet.DeadCount = Number(activePet.DeadCount || 0) + 1;
    activePet.BattleCount = Number(activePet.BattleCount || 0) + 1;
    activePet.LoseCount = Number(activePet.LoseCount || 0) + 1;
  }
  syncCharacterFields(game);
}

function normalizeCapturedPet(target) {
  const pet = { ...target };
  pet.Exp = levelExp(clampInt(pet.Lv, 1, CHAR_MAXUPLEVEL, 1));
  pet.SourceExp = 0;
  pet.EnemyExp = 0;
  pet.CaptureRate = Number(pet.CaptureRate || 0);
  normalizePetRuntime(pet);
  return pet;
}

function trainGame(game, petIndex) {
  game = normalizeGame(game);
  if (petIndex < 0 || petIndex >= game.pets.length) throw new Error("没有找到这只宠物");
  throw new Error("升级需要通过战斗经验累计；请去野外战斗，或在宠物辅助区开启自动练级。");
}

function allocatePlayerPointGame(game, stat, qty = 1) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能分配能力点");
  const key = playerPointStatKey(stat);
  if (!key) throw new Error("能力点只能加到体力、腕力、耐力或速度");
  const amount = clampInt(qty, 1, Math.max(1, Number(game.player.skillUpPoint || 0)), 1);
  if (Number(game.player.skillUpPoint || 0) < amount) throw new Error("没有可分配能力点");
  game.player.skillUpPoint -= amount;
  game.player[key] = Number(game.player[key] || 0) + amount * PLAYER_POINT_STEP;
  compliancePlayerParameter(game.player, { preserveHp: true });
  normalizePlayerRuntime(game.player);
  syncCharacterFields(game);
  addLog(game, `${game.player.name} 将 ${amount} 点能力点加到${playerPointStatLabel(key)}。`);
  return withMap(game, {
    allocation: {
      stat: key,
      label: playerPointStatLabel(key),
      amount,
      rawIncrease: amount * PLAYER_POINT_STEP,
      remaining: game.player.skillUpPoint,
      source: "gmsv char.c CHAR_SkillUp: CHAR_SKILLUPPOINT -1, selected base stat +100"
    }
  });
}

function playerPointStatKey(stat) {
  const value = guideSearchText(stat);
  const map = {
    vital: "Vital",
    hp: "Vital",
    endurance: "Vital",
    体力: "Vital",
    耐久: "Vital",
    str: "Str",
    strength: "Str",
    attack: "Str",
    腕力: "Str",
    攻击: "Str",
    攻擊: "Str",
    tough: "Tough",
    defense: "Tough",
    耐力: "Tough",
    防御: "Tough",
    防禦: "Tough",
    dex: "Dex",
    speed: "Dex",
    quick: "Dex",
    速度: "Dex",
    敏捷: "Dex"
  };
  return map[value] || null;
}

function playerPointStatLabel(key) {
  return { Vital: "体力", Str: "腕力", Tough: "耐力", Dex: "速度" }[key] || key;
}

function restGame(game) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能休息");
  healParty(game);
  addLog(game, `${game.player.name} 和宠物休息了一会儿，耐久力恢复了。`);
  return withMap(game);
}

function petModeGame(game, petIndex, mode) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中暂时不能切换出战宠");
  const index = clampInt(petIndex, 0, Math.max(0, game.pets.length - 1), 0);
  const pet = game.pets[index];
  if (!pet) throw new Error("没有找到这只宠物");
  if (!["active", "battle", "出战", "战斗", "fight"].includes(mode)) {
    throw new Error("这个宠物状态还没有实现");
  }
  ensurePetFormation(game).activeIndex = index;
  addLog(game, `${pet.Name} 设为出战宠。`);
  return withMap(game, {
    petAction: {
      type: "active",
      petIndex: index,
      petName: pet.Name,
      source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`
    }
  });
}

function releasePetGame(game, petIndex) {
  game = normalizeGame(game);
  if (game.encounter) throw new Error("战斗中不能放生宠物");
  const released = releasePetInPlace(game, petIndex);
  return withMap(game, {
    petAction: {
      type: "release",
      petIndex: released.index,
      petName: released.pet.Name,
      remaining: game.pets.length,
      source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`
    }
  });
}

function releasePetInPlace(game, petIndex) {
  const index = exactPetIndex(game, petIndex);
  if (game.pets.length <= 1) throw new Error("至少要保留一只宠物");
  const formation = ensurePetFormation(game);
  const oldActive = formation.activeIndex;
  const [pet] = game.pets.splice(index, 1);
  if (!pet) throw new Error("没有找到这只宠物");
  if (oldActive === index) formation.activeIndex = Math.min(index, game.pets.length - 1);
  else if (oldActive > index) formation.activeIndex = oldActive - 1;
  else formation.activeIndex = oldActive;
  ensurePetFormation(game);
  addLog(game, `${pet.Name} 离开了队伍，宠物栏空出 1 格。`);
  return { index, pet };
}

async function guideGame(env, request, game, prompt) {
  game = normalizeGame(game);
  const action = await applyGuideRequest(env, request, game, prompt);
  if (action) {
    return {
      text: action.text,
      model: "local-action",
      provider: "local-action",
      action: action.action,
      game: withMap(game)
    };
  }
  const map = currentMap(game);
  const context = buildGuideContext(game, map, prompt);
  if (hasOpenAi(env)) {
    try {
      const rsp = await callOpenAiGuide(env, context, prompt);
      return { text: rsp.reply || fallbackGuide(context, prompt), model: rsp.model, provider: "openai" };
    } catch (error) {
      if (!env.AI || typeof env.AI.run !== "function") {
        return {
          text: fallbackGuide(context, prompt, error),
          model: "local-rule",
          provider: "local-rule",
          warning: error?.message || "OpenAI failed"
        };
      }
    }
  }
  if (env.AI && typeof env.AI.run === "function") {
    const messages = [
      {
        role: "system",
        content: [
          "你是单人版石器时代网页运行时的向导，不是万能 GM。",
          "必须只根据给定 JSON 回答；把“当前能做的事”和“需要找对应 NPC/脚本的事”说清楚。",
          "如果玩家问任务、地图、NPC、交易、战斗或避敌，要优先引用当前地图、附近 NPC、出口、任务进度、sourceTasks 原 gmsv 事件目标和原脚本线索。",
          "quests/sourceTasks 里的 guidance 是 Worker 按当前状态算出的行动清单；回答任务时优先复述这些步骤。",
          "context.actionPlan.lines 是 Worker 已经压缩好的“去哪、找谁、做什么、怎么触发”的玩家行动清单；任务问题必须先按它回答。",
          "context.location.encounterGateText/encounterGates 来自 gmsv-data/group1.txt 背包条件；遇敌/刷怪问题必须说明缺少或禁持的道具条件，不要猜。",
          "context.battle.dropText 与 context.lastBattle.potentialLootText/lootText 来自 gmsv-data/enemy/enemy1.txt 的 ITEM/ITEMPROB；回答掉落/战利品问题要说明候选掉落、概率和本次实际获得。",
          "context.battle.taskLootText/context.lastBattle.taskLootText 会对照当前 sourceTasks 说明任务道具是否在当前/上一场敌人的候选掉落中；任务道具不在候选掉落时，要引导去目标 NPC/脚本条件，不要让玩家无效刷怪。",
          "如果 JSON 里有 knowledge，只引用其中和玩家问题相关的石器时代资料库条目；条目只是索引时要说明不能补编完整流程。",
          "workspace.memory 是 Worker 保存的受限记忆，只能当线索；和当前状态冲突时以当前状态为准。",
          "中文，最多三段；给出下一步可执行动作，不要编不存在的地点、NPC 或奖励。"
        ].join("\n")
      },
      { role: "user", content: `${prompt || "我下一步该做什么？"}\n\n当前状态 JSON：${JSON.stringify(context)}` }
    ];
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    try {
      const rsp = await env.AI.run(model, { messages });
      return { text: rsp.response || rsp.text || fallbackGuide(context, prompt), model, provider: "workers-ai" };
    } catch (error) {
      return {
        text: fallbackGuide(context, prompt, error),
        model: "local-rule",
        provider: "local-rule",
        warning: error?.message || "AI binding failed"
      };
    }
  }
  return { text: fallbackGuide(context, prompt), model: "local-rule", provider: "local-rule" };
}

async function callOpenAiGuide(env, context, prompt) {
  const system = [
    "你是单人版石器时代网页运行时的向导，不是万能 GM。",
    "只根据当前 JSON 状态回答；不要编不存在的地点、NPC、道具、任务或奖励。",
    "如果请求会改变游戏状态，说明应由 Worker 的确定性逻辑执行；你只负责解释和提出下一步。",
    "优先引用当前地图、附近 NPC、出口、任务进度、背包、宠物、战斗和临时状态。",
    "如果 context.sourceTasks 有内容，那是当前已经触发的原 gmsv changeevent 事件目标，优先告诉玩家下一步，而不是只列可接任务。",
    "context.quests/sourceTasks 里的 guidance 是 Worker 按当前状态算出的行动清单；回答任务时优先复述这些步骤。",
    "context.actionPlan.lines 是 Worker 已经压缩好的“去哪、找谁、做什么、怎么触发”的玩家行动清单；任务问题必须先按它回答。",
    "context.location.encounterGateText/encounterGates 来自 gmsv-data/group1.txt 背包条件；遇敌/刷怪问题必须说明缺少或禁持的道具条件，不要猜。",
    "context.battle.dropText 与 context.lastBattle.potentialLootText/lootText 来自 gmsv-data/enemy/enemy1.txt 的 ITEM/ITEMPROB；回答掉落/战利品问题要说明候选掉落、概率和本次实际获得。",
    "context.battle.taskLootText/context.lastBattle.taskLootText 会对照当前 sourceTasks 说明任务道具是否在当前/上一场敌人的候选掉落中；任务道具不在候选掉落时，要引导去目标 NPC/脚本条件，不要让玩家无效刷怪。",
    "context.knowledge 是从石器时代资料库压缩检索出的相关知识；只用匹配条目补充专业背景，不要把索引条目扩写成不存在的完整攻略。",
    "context.workspace.memory 是 Worker 保存的受限记忆，只能作为线索；不要把记忆当成已完成的任务状态。",
    "中文，最多三段，口吻清楚但保持游戏沉浸感。"
  ].join("\n");
  const user = JSON.stringify({
    prompt: prompt || "我下一步该做什么？",
    context
  });
  const { json: decision, model } = await callOpenAiStructured(env, {
    name: "stoneage_guide_reply",
    schema: OPENAI_GUIDE_SCHEMA,
    system,
    user,
    maxOutputTokens: 700
  });
  return {
    model,
    reply: String(decision?.reply || "").trim()
  };
}

function hasOpenAi(env) {
  return typeof env?.OPENAI_API_KEY === "string" && env.OPENAI_API_KEY.trim().length > 0;
}

function openAiModel(env) {
  return String(env?.OPENAI_MODEL || DEFAULT_OPENAI_MODEL).trim() || DEFAULT_OPENAI_MODEL;
}

function aiRuntimeStatus(env) {
  if (hasOpenAi(env)) {
    return {
      provider: "openai",
      model: openAiModel(env),
      actionAuthority: "worker-npc-vm",
      structured: true,
      fallback: env?.AI && typeof env.AI.run === "function" ? "workers-ai" : "local-rule"
    };
  }
  if (env?.AI && typeof env.AI.run === "function") {
    return {
      provider: "workers-ai",
      model: env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct",
      actionAuthority: "worker-npc-vm",
      structured: false,
      fallback: "local-rule"
    };
  }
  return {
    provider: "local-rule",
    model: "local-rule",
    actionAuthority: "worker-npc-vm",
    structured: false,
    fallback: "none"
  };
}

async function callOpenAiStructured(env, { name, schema, system, user, maxOutputTokens = 600 }) {
  const model = openAiModel(env);
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema
        }
      },
      max_output_tokens: maxOutputTokens
    })
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`OpenAI ${response.status}: ${message.slice(0, 240)}`);
  }
  const payload = await response.json();
  const outputText = extractOpenAiOutputText(payload);
  if (!outputText) throw new Error("OpenAI returned empty structured output");
  try {
    return { json: JSON.parse(outputText), model };
  } catch (error) {
    throw new Error(`OpenAI structured JSON parse failed: ${error.message || "invalid JSON"}`);
  }
}

function extractOpenAiOutputText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text.trim();
  const parts = [];
  for (const item of payload?.output || []) {
    if (typeof item?.text === "string") parts.push(item.text);
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") parts.push(content.text);
      if (typeof content?.content === "string") parts.push(content.content);
    }
  }
  return parts.join("\n").trim();
}

async function applyGuideRequest(env, request, game, prompt) {
  const text = String(prompt || "").trim();
  const lower = text.toLowerCase();
  if (!text) return null;

  if (game.encounter && isPetSwitchRequest(lower) && !isPetTrainingRequest(lower)) {
    const choice = chooseGuidePet(game, text);
    const move = choice?.pet ? `pet:${choice.index}` : "pet";
    try {
      const outcome = performBattleAction(game, move);
      const lines = Array.isArray(outcome.log) ? outcome.log.join("\n") : "我帮你切换了一只出战宠。";
      return {
        text: `${lines}\n换宠也会消耗一回合，后续还是按战斗结算走。`,
        action: { type: "battle-pet-switch", outcome: outcome.result, petIndex: choice?.index ?? null }
      };
    } catch (error) {
      return {
        text: error.message || "现在没有可切换的后备宠物。",
        action: { type: "battle-pet-switch-refused", reason: "invalid-pet" }
      };
    }
  }

  if (game.encounter && hasAny(lower, ["战斗", "戰鬥", "攻击", "攻擊", "帮打", "幫打", "打一下", "battle", "attack"])) {
    const outcome = performBattleAction(game, "attack");
    const lines = Array.isArray(outcome.log) ? outcome.log.join("\n") : "我帮你推进了一回合战斗。";
    return {
      text: `${lines}\n我只能按当前战斗规则帮忙出一手，后续还要看你的宠物状态。`,
      action: { type: "battle", outcome: outcome.result }
    };
  }

  if (hasAny(lower, ["避敌", "避敵", "不遇敌", "不遇敵", "不会遇到", "不會遇到"])) {
    game.effects ||= {};
    game.effects.noEncounterUntil = Date.now() + 10 * 60 * 1000;
    addLog(game, "AI 向导暂时帮你避开野外敌人，持续 10 分钟。");
    return {
      text: "我先帮你把野外遇敌压住 10 分钟。这个帮助只影响随机遇敌，不会跳过 NPC 战斗或剧情判断。",
      action: { type: "noEncounter", seconds: 600 }
    };
  }

  if (isItemDropRequest(lower)) {
    if (game.encounter) {
      return {
        text: "战斗中不能整理背包。先结束当前战斗，再丢弃或使用道具。",
        action: { type: "item-drop-refused", reason: "battle-active" }
      };
    }
    const choice = chooseGuideItem(game, text);
    if (!choice?.item) {
      return {
        text: guideItemChoiceHelp(game),
        action: { type: "item-drop-refused", reason: choice?.reason || "unknown-item" }
      };
    }
    const qty = itemDropQtyFromPrompt(text, choice.item);
    const dropped = dropItemInPlace(game, choice.item.id, qty);
    return {
      text: `已丢弃 ${dropped.itemName} x${dropped.qty}，背包现在 ${inventoryState(game).used}/${INVENTORY_CAPACITY}。`,
      action: { type: "item-drop", itemId: dropped.itemId, itemName: dropped.itemName, qty: dropped.qty, reason: choice.reason }
    };
  }

  if (isItemUseRequest(lower)) {
    const data = await loadGameData(env, request);
    hydrateGameInventoryFromSource(game, data?.itemSet);
    hydrateGameInventoryRuntimeEffects(game, data);
    const choice = chooseGuideItem(game, text);
    if (!choice?.item) {
      return {
        text: guideItemChoiceHelp(game).replace("丢弃", "使用"),
        action: { type: "item-use-refused", reason: choice?.reason || "unknown-item" }
      };
    }
    const preview = previewItemUse(game, choice.item, { battle: Boolean(game.encounter) });
    if (!preview.usable) {
      return {
        text: `${choice.item.name} 现在没有可模拟的道具效果，或当前没有合适目标。可以继续找对应 NPC 或脚本线索确认这个道具的原版用途。`,
        action: { type: "item-use-refused", reason: preview.reason || "unsupported", itemId: choice.item.id }
      };
    }
    const itemUse = applyUsableItem(game, choice.item, { battle: Boolean(game.encounter) });
    if (itemUse.effects?.some((effect) => effect.kind === "encounter")) {
      await triggerItemEncounter(env, request, game, itemUse);
    }
    addLog(game, `AI 向导${itemUseLogLine(itemUse)}`);
    return {
      text: `已使用 ${itemUse.itemName}，${itemUse.summary}。`,
      action: { type: "item-use", itemId: itemUse.itemId, itemName: itemUse.itemName, targetName: itemUse.targetName, restored: itemUse.restored, reason: choice.reason }
    };
  }

  if (hasAny(lower, ["回血", "治疗", "治療", "恢复", "恢復", "补血", "補血", "休息", "heal", "hp"])) {
    healParty(game);
    addLog(game, "AI 向导帮队伍恢复了耐久力。");
    return {
      text: "我帮你把人物和宠物的耐久力恢复了。真正的医院和治疗 NPC 以后仍会按原版脚本来收钱或判断条件。",
      action: { type: "heal" }
    };
  }

  if (isPetReleaseRequest(lower)) {
    if (game.encounter) {
      return {
        text: "战斗中不能放生宠物。先结束当前战斗，再整理宠物栏。",
        action: { type: "pet-release-refused", reason: "battle-active" }
      };
    }
    if ((game.pets || []).length <= 1) {
      return {
        text: "现在只有一只宠物，先保留它吧；至少要有一只宠物才能继续战斗和探索。",
        action: { type: "pet-release-refused", reason: "last-pet" }
      };
    }
    const choice = chooseGuidePet(game, text);
    if (!choice?.pet) {
      return {
        text: `${guidePetChoiceHelp(game)} 放生会永久移出当前队伍，请说清楚要放生哪一只。`,
        action: { type: "pet-release-refused", reason: choice?.reason || "unknown-pet" }
      };
    }
    const released = releasePetInPlace(game, choice.index);
    return {
      text: `${released.pet.Name} 已离开队伍，宠物栏现在是 ${petState(game).used}/${PET_CAPACITY}。`,
      action: { type: "pet-release", petIndex: choice.index, petName: released.pet.Name, reason: choice.reason }
    };
  }

  if (isPetSwitchRequest(lower) && !isPetTrainingRequest(lower)) {
    if (game.encounter) {
      return {
        text: "现在已经进入战斗，暂时不能换出战宠。先完成、逃离或放走当前战斗目标，再调整宠物队列。",
        action: { type: "pet-switch-refused", reason: "battle-active" }
      };
    }
    const choice = chooseGuidePet(game, text);
    if (!choice?.pet) {
      return {
        text: guidePetChoiceHelp(game),
        action: { type: "pet-switch-refused", reason: choice?.reason || "unknown-pet" }
      };
    }
    ensurePetFormation(game).activeIndex = choice.index;
    addLog(game, `AI 向导把 ${choice.pet.Name} 设为出战宠。`);
    return {
      text: `已让 ${choice.pet.Name} Lv.${Number(choice.pet.Lv || 1)} 出战。之后战斗和道具恢复都会优先作用在这只宠物身上。`,
      action: { type: "pet-switch", petIndex: choice.index, petName: choice.pet.Name, reason: choice.reason }
    };
  }

  if (isTeleportRequest(lower)) {
    const teleport = chooseGuideTeleport(game, text);
    if (!teleport) {
      const map = currentMap(game);
      const labels = map.exits.map((item) => item.label).slice(0, 5).join("、") || "当前地图没有出口";
      return {
        text: `我没判断出你想去哪里。你可以说完整地图名、floor，或直接说“带我去 ${labels}”。`,
        action: { type: "teleport-refused" }
      };
    }
    let targetMap;
    if (teleport.exit) {
      targetMap = WORLD.maps[teleport.exit.to];
      applyExit(game, teleport.exit);
    } else {
      targetMap = WORLD.maps[teleport.target.mapId];
      applyWarpTarget(game, teleport.target, `AI 向导瞬移到 ${targetMap?.name || teleport.target.mapId}`);
    }
    return {
      text: teleport.exit
        ? `我带你走「${teleport.exit.label}」，到了 ${targetMap?.name || teleport.exit.to}。`
        : `我直接把你送到 ${targetMap?.name || teleport.target.mapId}。这属于 AI 向导辅助瞬移，不会伪装成原版 NPC 脚本。`,
      action: {
        type: "teleport",
        mode: teleport.exit ? "mapwarp" : "guide-warp",
        exitId: teleport.exit?.id,
        mapId: teleport.exit?.to || teleport.target.mapId
      }
    };
  }

  if (isPetTrainingRequest(lower)) {
    return {
      text: "练级已经改成主画面的「自动练级」模式：它不会直接送等级，也不会让 AI 代替结算；开启后请走到可遇敌地图，系统会自动寻找野外敌人并按原版战斗结算攻击，经验和升级都来自战斗结果。",
      action: {
        type: "auto-level",
        enabled: true,
        source: "client automation + Worker battle settlement"
      }
    };
  }

  if (!game.encounter && hasAny(lower, ["遇敌", "遇敵", "野外敌人", "野外敵人", "找敌人", "找敵人", "敌人", "敵人", "刷怪", "开战", "開戰"])) {
    const map = currentMap(game);
    if (!wildEncounterAllowed(map, game)) {
      return {
        text: wildEncounterBlockedText(map, game),
        action: { type: "encounter-refused" }
      };
    }
    const enemy = await spawnEncounter(env, request, game, map, "AI 向导");
    return {
      text: `我帮你找到了 ${enemy.Name} Lv.${enemy.Lv}。接下来可以在主画面的 BATTLE 里攻击、道具、捕获或放走。`,
      action: { type: "encounter", enemy: enemy.Name }
    };
  }

  return null;
}

async function runGuideTrainingBattle() {
  return {
    text: "练级已经改为「自动练级」：开启后由客户端在可遇敌地图自动找敌并向 Worker 提交战斗指令，经验、等级和战利品仍只按原战斗结算产生。",
    action: {
      type: "auto-level",
      enabled: true,
      source: "client automation + Worker battle settlement"
    }
  };
}

function chooseGuideExit(game, prompt) {
  const map = currentMap(game);
  if (!map.exits?.length) return null;
  const normalizedPrompt = guideSearchText(prompt);
  const tokens = guideSearchTokens(prompt);
  const scored = map.exits.map((exit, index) => {
    const targetMap = WORLD.maps[exit.to];
    const haystack = guideSearchText(`${exit.label} ${exit.detail || ""} ${targetMap?.name || ""} ${exit.to}`);
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score += token.length;
    }
    const targetName = guideSearchText(targetMap?.name || "");
    const exitLabel = guideSearchText(exit.label || "");
    if (targetName && normalizedPrompt.includes(targetName)) score += 8;
    if (exitLabel && normalizedPrompt.includes(exitLabel)) score += 6;
    return { exit, index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  return scored[0]?.score > 0 ? scored[0].exit : (map.exits.length === 1 ? map.exits[0] : null);
}

function chooseGuideTeleport(game, prompt) {
  const exit = chooseGuideExit(game, prompt);
  const map = chooseWorldMapFromPrompt(prompt);
  if (exit && (!map || String(exit.to) === String(map.id))) return { exit };
  if (!map) return null;
  const spawn = Array.isArray(map.spawn) ? map.spawn : [Math.floor((Number(map.size?.[0]) || 2) / 2), Math.floor((Number(map.size?.[1]) || 2) / 2)];
  return {
    target: {
      mapId: map.id,
      x: spawn[0],
      y: spawn[1],
      source: "AI guide world-map teleport"
    }
  };
}

function chooseWorldMapFromPrompt(prompt) {
  const normalized = guideSearchText(prompt);
  const tokens = guideSearchTokens(prompt);
  const scored = Object.values(WORLD.maps).map((map) => {
    const name = guideSearchText(map.name || "");
    const summary = guideSearchText(map.summary || "");
    const floor = guideSearchText(`${map.floorId || map.id}`);
    let score = 0;
    if (name && normalized.includes(name)) score += 20;
    if (floor && normalized.includes(floor)) score += 10;
    for (const token of tokens) {
      if (name.includes(token)) score += token.length * 2;
      else if (summary.includes(token)) score += token.length;
    }
    if ((normalized.includes("渔村") || normalized.includes("魚村") || normalized.includes("鱼村")) && /渔村|魚村|鱼村/.test(map.name || "")) score += 18;
    if (normalized.includes("玛丽娜丝") && /玛丽娜丝/.test(map.name || "")) score += 10;
    if (normalized.includes("萨姆吉尔") && /萨姆吉尔/.test(map.name || "")) score += 10;
    if (normalized.includes("柯奥") && /柯奥/.test(map.name || "")) score += 10;
    return { map, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].map : null;
}

function isTeleportRequest(text) {
  return hasAny(text, ["瞬移", "传送", "傳送", "带我去", "帶我去", "送我去", "飛到", "飞到", "送到", "移动到", "移動到"]);
}

function guideSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[|�]/g, "")
    .replace(/\s+/g, "");
}

function guideSearchTokens(value) {
  const stopWords = ["帮我", "幫我", "帶我", "带我", "送我", "传送", "傳送", "瞬移", "移动到", "移動到", "到", "去", "一下", "可以", "能不能", "请", "請"];
  let cleaned = guideSearchText(value);
  for (const word of stopWords) cleaned = cleaned.replaceAll(guideSearchText(word), "");
  const tokens = new Set((cleaned.match(/[\u4e00-\u9fff]{2,}|[a-z0-9]+/gi) || []).map(guideSearchText));
  for (let size = 2; size <= Math.min(4, cleaned.length); size += 1) {
    for (let i = 0; i <= cleaned.length - size; i += 1) tokens.add(cleaned.slice(i, i + size));
  }
  return [...tokens].filter((token) => token.length >= 2);
}

async function npcReply(env, request, game, npc, text) {
  const lower = text.toLowerCase();
  if (game.encounter && hasAny(lower, ["攻击", "戰鬥", "战斗", "打", "attack", "防御", "防守", "guard", "等待", "待机", "wait", "技能", "宠技", "寵技", "连续", "連續", "必杀", "必殺", "skill", "换宠", "換寵", "出战", "出戰", "放走", "逃跑", "离开", "離開", "release", "run"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["抓宠", "捕获", "capture", "catch"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["道具", "物品", "item"])) return battleActionReply(game, npc, lower);
  if (game.encounter && hasAny(lower, ["宠物", "pet"])) return battleStatusReply(game, npc);
  if (!game.encounter && isAiModeOn(lower)) return setNpcAiModeReply(game, npc, true);
  if (!game.encounter && isAiModeOff(lower)) return setNpcAiModeReply(game, npc, false);
  if (hasAny(lower, ["来源", "來源", "脚本", "腳本", "source", "debug"])) return sourceReply(game, npc);
  if (!game.encounter && !isNpcAiMode(game, npc) && isAiOnlyNpcRequest(lower, npc)) return aiModeRequiredReply(game, npc, text);
  if (!game.encounter && isNpcEnemy(npc) && isNpcAiMode(game, npc) && isAiRequest(lower)) return aiNpcReply(env, request, game, npc, text);
  if (isNpcEnemy(npc)) return npcEnemyReply(env, request, game, npc, lower);
  if (isGreeting(lower)) return runNpcTalk(game, npc, "hi");
  if (!game.encounter && isNpcAiMode(game, npc) && isAiRequest(lower)) return aiNpcReply(env, request, game, npc, text);
  if (isHealerNpc(npc) && hasAny(lower, ["治疗", "恢復", "恢复", "补血", "耐久", "heal", "hp"])) return healerReply(game, npc);
  if (isSavePointNpc(npc) && (hasAny(lower, ["记录", "記錄", "纪录", "存档", "保存", "save"]) || (hasPendingSavePointConfirm(game, npc) && isSavePointConfirmText(lower)))) return savePointReply(game, npc, text);
  if (isLuckyManNpc(npc) && (isLuckyManRequestText(lower) || isLuckyManConfirmText(lower))) return luckyManReply(game, npc, text);
  if (isJankenNpc(npc) && isJankenRequestText(lower)) return jankenReply(game, npc, text);
  if (isQuizNpc(npc) && isQuizRequestText(text, game, npc)) return quizReply(game, npc, text);
  if (isRaceManNpc(npc) && isRaceManRequestText(lower)) return raceManReply(game, npc, text);
  if (isNewNpcManNpc(npc) && isNewNpcManRequestText(lower)) return newNpcManReply(game, npc, text);
  if (npc.petShop && hasAny(lower, ["宠物店", "寵物店", "寄放", "寄存", "取回", "取出", "领取", "領取", "卖宠", "賣寵", "卖掉", "卖出", "出售", "整理宠物", "整理寵物", "pet"])) return petShopReply(game, npc);
  if (isPetFusionNpc(npc) && hasAny(lower, ["融合", "合成宠", "合成寵", "宠物蛋", "寵物蛋", "合宠", "合寵", "petfusion", "fusion"])) return petFusionReply(game, npc, text);
  if (npc.itemPoolShop && hasAny(lower, ["道具寄放", "寄放道具", "寄存道具", "道具仓库", "道具倉庫", "保管", "取回道具", "取出道具", "领取道具", "寄放", "寄存", "取回", "取出"])) return itemPoolShopReply(game, npc);
  if (isRouteServiceNpc(npc) && hasAny(lower, ["路线", "路線", "搭乘", "坐车", "坐車", "上车", "上車", "巴士", "客运", "客運", "飞机", "飛機", "航班", "出发", "出發", "前往", "去", "route", "ride"])) return routeServiceReply(game, npc, text);
  if (isProfessionShopNpc(npc) && isProfessionShopRequestText(lower)) return professionShopReply(game, npc, text);
  if (npc.trade && hasAny(lower, ["买", "卖", "交易", "商品", "shop", "buy"])) return tradeReply(game, npc);
  if (npc.itemChange?.recipes?.length && hasAny(lower, ["加工", "合成", "制作", "製作", "打造", "换物", "交換", "交换", "change"])) return itemChangePromptReply(game, npc);
  if (isWarpNpc(npc) && hasAny(lower, ["传送", "傳送", "进入", "進入", "出发", "出發", "前往", "移动", "warp"])) return warpNpcReply(game, npc);
  if (hasNpcScriptEvents(npc) && hasAny(lower, ["任务", "委托", "攻略", "quest", "仪式", "儀式", "领取", "领", "給", "给", "交付", "完成"])) return sourceScriptEventReply(game, npc, text);
  if (hasNpcScriptEvents(npc) && (hasPendingSourceStop(game, npc) || isSourceScriptStopText(lower))) return sourceScriptEventReply(game, npc, text);
  if (hasNpcScriptEvents(npc) && npcHasKeywordBranches(npc)) return sourceScriptEventReply(game, npc, text);
  if (hasAny(lower, ["任务", "委托", "攻略", "quest"])) return questReply(game, npc, text);
  if (hasAny(lower, ["抓宠", "捕获"]) || (hasAny(lower, ["宠物", "pet"]) && !isStoneAgeKnowledgeQuestion(lower))) return captureReply(env, request, game, npc);
  if (hasAny(lower, ["训练", "练级", "成长", "技能"]) && !isStoneAgeKnowledgeQuestion(lower)) return trainReply(game, npc);
  if (hasAny(lower, ["地图", "出口", "去哪", "travel", "map", "森林", "草原", "村", "坐标", "座标"])) return mapReply(game, npc, text);
  if (isStoneAgeKnowledgeQuestion(lower)) {
    const reply = localStoneAgeKnowledgeReply(buildStoneAgeKnowledgeContext(game, currentMap(game), text, npc), npc.name);
    if (reply) return reply;
  }
  if (isNpcAiMode(game, npc)) return aiNpcReply(env, request, game, npc, text);
  recordNpcVmEvent(game, npc, "unsupported", "unsupported", { text: text.slice(0, 80) });
  return fallbackNpcReply(npc);
}

function isAiModeOn(text) {
  return /(^|\s)ai(\s|$)/i.test(text) || hasAny(text, ["AI对话", "ai对话", "智能对话", "AI聊天", "ai聊天"]);
}

function isAiModeOff(text) {
  return hasAny(text, ["普通对话", "退出AI", "关闭AI", "不用AI", "普通聊天"]);
}

function isAiRequest(text) {
  return isTeleportRequest(text)
    || hasAny(text, ["请求避敌", "不会遇到", "野外敌人", "避敌", "商量传送", "商量坐车", "去别的地图", "去其他地图", "打折", "折扣", "便宜", "优惠", "優待", "优待", "平时不卖", "平常不卖", "隐藏", "有没有", "能不能给", "给我", "给些", "卖我", "卖给我", "卖一些", "要一个", "真的需要", "很需要", "急用", "帮帮", "帮我", "拜托", "报酬", "贿赂", "收钱", "买路", "威胁", "恐吓", "让我过去", "放我过去", "bus", "ai:"]);
}

function isAiOnlyNpcRequest(text, npc) {
  return isAiTeleportNegotiationRequest(text, npc)
    || hasAny(text, ["请求避敌", "不会遇到", "野外敌人", "避敌"])
    || hasAny(text, ["打折", "折扣", "便宜", "优惠", "優待", "优待"])
    || hasAny(text, ["平时不卖", "平常不卖", "隐藏", "柜台后面", "柜台後面"])
    || hasAny(text, ["商量", "报酬", "贿赂", "收钱", "买路", "威胁", "恐吓", "让我过去", "放我过去", "bus", "ai:"]);
}

function isAiTeleportNegotiationRequest(text, npc) {
  if (!isTeleportRequest(text)) return false;
  const plainSourceWarp = isWarpNpc(npc)
    && hasAny(text, ["传送", "傳送", "进入", "進入", "出发", "出發", "前往", "移动", "warp"])
    && !hasAny(text, ["瞬移", "带我去", "帶我去", "送我去", "飛到", "飞到", "送到", "商量", "别的地图", "其他地图"]);
  return !plainSourceWarp;
}

function isNpcAiMode(game, npc) {
  return Boolean(game.dialogAi?.[npc.id]);
}

function setNpcAiModeReply(game, npc, enabled) {
  game.dialogAi ||= {};
  game.dialogAi[npc.id] = enabled;
  recordNpcVmEvent(game, npc, "debug", "ok", { reason: enabled ? "ai-mode-on" : "ai-mode-off" });
  return enabled
    ? `${npc.name} 会用 AI 对话方式继续回应；可商量信息、优待或传送，但交易、传送、战斗和 flag 仍由 Worker 的 NPC VM 校验。`
    : `${npc.name} 切回普通脚本对话。`;
}

function aiModeRequiredReply(game, npc, text) {
  recordNpcVmEvent(game, npc, "debug", "blocked", {
    reason: "ai-mode-required",
    text: String(text || "").slice(0, 80)
  });
  return `${npc.name} 现在按原版脚本回应，不会处理瞬移、打折、贿赂、隐藏商品或避敌这类 AI 交涉。想尝试这些事，请先点对话框里的 AI 按钮；实际给物品、传送、交易和状态变化仍会由 Worker 按源码规则校验。`;
}

function battleActionReply(game, npc, text) {
  const move = hasAny(text, ["放走", "release"])
    ? "release"
    : hasAny(text, ["逃跑", "离开", "離開", "run", "escape"])
      ? "escape"
      : hasAny(text, ["防御", "防守", "guard"])
        ? "guard"
        : hasAny(text, ["等待", "待机", "wait"])
          ? "wait"
          : hasAny(text, ["换宠", "換寵", "出战", "出戰"])
            ? "pet"
            : hasAny(text, ["技能", "宠技", "寵技", "连续", "連續", "必杀", "必殺", "skill"])
              ? "skill"
              : hasAny(text, ["抓宠", "捕获", "capture", "catch"])
                ? "capture"
                : hasAny(text, ["道具", "物品", "item"])
                  ? "item"
                  : "attack";
  const event = runNpcVmAction(game, npc, {
    type: "battleAction",
    move,
    reason: "dialog-battle"
  });
  if (!event.ok) return `${npc.name}：${event.error || "战斗动作失败"}。`;
  const outcome = event.detail?.outcome || {};
  const lines = Array.isArray(outcome.log) ? outcome.log : [];
  const summary = lines.length ? lines.join("\n") : `${npc.name} 处理了战斗动作。`;
  if (outcome.result === "turn" || outcome.result === "item" || outcome.result === "pet-switch" || outcome.result === "next-enemy" || outcome.result === "enemy-escaped-next") return `${summary}\n继续输入“攻击”“防御”“待机”，或输入“道具”“换宠”“逃跑”。`;
  if (outcome.result === "victory") return `${summary}\n战斗结束。`;
  if (outcome.result === "defeat") return `${summary}\n队伍撤退，战斗结束。`;
  if (outcome.result === "escaped") return `${summary}\n你逃离了战斗。`;
  if (outcome.result === "escape-failed") return `${summary}\n继续输入“攻击”“防御”“道具”或再次“逃跑”。`;
  if (outcome.result === "released") return `${summary}\n战斗结束。`;
  if (outcome.result === "enemy-escaped") return `${summary}\n敌方逃走，战斗结束。`;
  if (outcome.result === "captured") return `${summary}\n捕获成功，战斗结束。`;
  if (outcome.result === "pet-full") return `${summary}\n先去宠物店或仓库整理宠物栏，再继续捕获。`;
  if (outcome.result === "capture-missed") return `${summary}\n继续输入“攻击”“防御”“捕获”或“逃跑”。`;
  return summary;
}

function battleStatusReply(game, npc) {
  const enemy = game.encounter;
  recordNpcVmEvent(game, npc, "battleAction", "noop", {
    query: true,
    enemyName: enemy?.Name,
    enemyLevel: enemy?.Lv,
    enemyHp: enemy?.Hp ?? enemy?.WorkMaxHp,
    reason: "dialog-battle-status"
  });
  return `${npc.name}：当前正在与 ${enemy?.Name || "野外宠物"} Lv.${enemy?.Lv || "?"} 交战。输入“攻击”“防御”“待机”推进战斗，输入“捕获”尝试抓宠，输入“换宠”切换后备宠物，或输入“逃跑”尝试脱离。`;
}

function isGreeting(text) {
  return /(^|\s)(hi|hello|hey|yo)(\s|$)/i.test(text) || hasAny(text, ["你好", "嗨", "哈喽", "問候", "问候"]);
}

function hasAny(text, tokens) {
  return tokens.some((token) => text.includes(token));
}

function npcQuestIds(npc) {
  return [...new Set([
    npc?.questId,
    ...(Array.isArray(npc?.questIds) ? npc.questIds : [])
  ].filter((id) => id && WORLD.quests[id] && isPlayerFacingQuest(WORLD.quests[id])))];
}

function isPlayerFacingQuest(quest) {
  return quest?.playerFacing !== false;
}

function applyNpcHi(game, npc) {
  ensureFlags(game);
  setNpcVmFlag(game, npc, eventFlagForNpc(npc.id), "now", "talk-hi");
  if (hasNpcScriptEvents(npc)) return sourceScriptEventReply(game, npc, "hi");
  if (isHealerNpc(npc)) return healerReply(game, npc);
  if (isSavePointNpc(npc)) return savePointReply(game, npc);
  if (isLuckyManNpc(npc)) return luckyManPromptReply(game, npc);
  if (isJankenNpc(npc)) return jankenPromptReply(game, npc);
  if (isQuizNpc(npc)) return quizPromptReply(game, npc);
  if (isRaceManNpc(npc)) return raceManReply(game, npc, "hi");
  if (isNewNpcManNpc(npc)) return newNpcManPromptReply(game, npc);
  if (isSignBoardNpc(npc)) {
    const reply = npcDialogueLines(npc).join("\n") || npcDefaultLine(npc);
    recordNpcVmEvent(game, npc, "say", "ok", { line: reply, signboard: true });
    return reply;
  }
  if (isWarpNpc(npc)) return warpPromptReply(game, npc);
  if (npc.petShop) return petShopReply(game, npc);
  if (isPetFusionNpc(npc)) return petFusionReply(game, npc, "hi");
  if (isRouteServiceNpc(npc)) return routeServicePromptReply(game, npc);
  if (isProfessionShopNpc(npc)) return professionShopReply(game, npc, "hi");
  if (npc.itemChange?.recipes?.length) return itemChangePromptReply(game, npc);
  const line = nextNpcDialogueLine(game, npc);
  const questIds = npcQuestIds(npc);
  const reportableId = questIds.find((questId) => game.quests[questId]?.status === "可回报");
  if (reportableId) {
    completeQuest(game, reportableId, npc);
    recordNpcVmEvent(game, npc, "quest", "ok", { questId: reportableId, phase: "complete" });
    recordNpcVmEvent(game, npc, "say", "ok", { line });
    return `${line} 你已经完成了「${WORLD.quests[reportableId].title}」，奖励已经给你。`;
  }
  const activeId = questIds.find((questId) => game.quests[questId]?.status === "进行中");
  const newQuestId = questIds.find((questId) => !game.quests[questId]);
  if (newQuestId && !activeId) {
    startQuest(game, newQuestId, npc);
    recordNpcVmEvent(game, npc, "quest", "ok", { questId: newQuestId, phase: "start" });
    recordNpcVmEvent(game, npc, "say", "ok", { line });
    return `${line} ${game.quests[newQuestId].steps[1]}`;
  }
  recordNpcVmEvent(game, npc, "say", "ok", { line });
  return line;
}

function nextNpcDialogueLine(game, npc) {
  const lines = npcDialogueLines(npc);
  if (!lines.length) return npcDefaultLine(npc);
  ensureFlags(game);
  game.flags.npcTalkCounts ||= {};
  const count = Number(game.flags.npcTalkCounts[npc.id] || 0);
  game.flags.npcTalkCounts[npc.id] = count + 1;
  return lines[count % lines.length];
}

function npcDefaultLine(npc) {
  if (npc.trade?.items?.length) return "欢迎光临。";
  if (npc.petShop) {
    const state = npc.petShop.poolEnabled ? "寄放、取回或出售宠物" : "出售宠物";
    return npc.petShop.messages?.main || `这里可以${state}。`;
  }
  if (isPetFusionNpc(npc)) return npc.petFusion?.messages?.start || "这里可以进行宠物融合。";
  if (isRouteServiceNpc(npc)) return routeServiceDefaultLine(npc);
  if (isProfessionShopNpc(npc)) return professionShopDefaultLine(npc);
  if (npc.itemChange?.recipes?.length) return "要加工什么？";
  if (isSignBoardNpc(npc)) return "这个看板没有写内容。";
  if (isWarpNpc(npc)) return "要出发的话，请告诉我目的地。";
  if (isHealerNpc(npc)) return "需要恢复耐久力吗？";
  if (isSavePointNpc(npc)) return "要记录冒险进度吗？";
  if (isLuckyManNpc(npc)) return luckyManPromptText(null, npc);
  if (isJankenNpc(npc)) return jankenPromptText(null, npc);
  if (isQuizNpc(npc)) return quizPromptText(null, npc);
  if (isRaceManNpc(npc)) return raceManDefaultLine(npc);
  if (isNewNpcManNpc(npc)) return newNpcManDefaultLine(npc);
  if (isNpcEnemy(npc)) return npcEnemyAskMessage(npc);
  return "有什么事吗？";
}

function hasNpcScriptEvents(npc) {
  return Array.isArray(npc?.scriptEvents) && npc.scriptEvents.length > 0;
}

function sourceScriptEventReply(game, npc, text = "") {
  const branch = chooseNpcScriptEvent(game, npc, text);
  if (!branch) return sourceScriptEventBlockedReply(game, npc, text);
  const { event, condition } = branch;
  const keyword = sourceScriptKeywordStatus(event, text);
  const detail = {
    reason: "source-changeevent",
    eventNo: event.eventNo,
    eventType: event.type,
    condition: event.condition || "",
    conditionOk: Boolean(condition?.ok),
    petName: event.petName || "",
    keywordRequired: Boolean(keyword.required),
    keywordOk: Boolean(keyword.ok),
    conditionOverride: publicNpcConditionOverrideMatch(condition?.override),
    source: event.source || npc.script || npc.source || ""
  };
  runNpcVmAction(game, npc, {
    type: "window",
    windowType: "CHAR_WINDOWTYPE_EVENT",
    ...detail
  });
  if (event.type === "REQUEST") return runNpcScriptRequest(game, npc, event, detail);
  if (event.type === "ACCEPT") return runNpcScriptAccept(game, npc, event, detail);
  if (event.type === "MESSAGE") return runNpcScriptMessage(game, npc, event, detail);
  if (event.type === "CLEAN") return runNpcScriptClean(game, npc, event, detail);
  recordNpcVmEvent(game, npc, "say", "ok", detail);
  return scriptEventMessages(event, ["normal", "normalMain", "thanks", "cleanMain", "cleanFlag"], game).join("\n") || npcDefaultLine(npc);
}

function chooseNpcScriptEvent(game, npc, text = "") {
  for (const event of npc.scriptEvents || []) {
    const eventNo = Number(event.eventNo || 0);
    if (eventNo > 0 && eventFlagSet(game, eventNo, "end") && event.type !== "MESSAGE") continue;
    if (eventNo > 0 && event.type === "REQUEST" && eventFlagSet(game, eventNo, "now")) continue;
    const keyword = sourceScriptKeywordStatus(event, text);
    if (keyword.required && !keyword.ok) continue;
    const condition = sourceScriptEventConditionStatus(game, event, npc);
    if (!condition.ok) continue;
    return { event, condition };
  }
  return null;
}

function sourceScriptEventConditionStatus(game, event, npc = null) {
  const condition = characterConditionStatus(game, event?.condition || "", { petName: event?.petName || "" });
  if (condition.ok || !npc) return condition;
  const override = matchingNpcConditionOverride(game, npc, event, condition);
  if (!override) return condition;
  const group = condition.groups?.[override.groupIndex] || condition.groups?.find((item) => item.checks?.some((check) => check.token === override.check.token)) || condition.groups?.[0] || null;
  recordNpcVmEvent(game, npc, "debug", "ok", {
    reason: "npc-condition-override-match",
    key: override.entry.key,
    eventNo: event?.eventNo,
    conditionHash: override.entry.conditionHash,
    conditionKind: override.entry.conditionKind,
    token: override.entry.conditionToken
  });
  return {
    ...condition,
    ok: true,
    matched: group?.source || condition.matched || "",
    override: {
      key: override.entry.key,
      npcId: override.entry.npcId,
      eventNo: override.entry.eventNo,
      conditionHash: override.entry.conditionHash,
      conditionToken: override.entry.conditionToken,
      conditionKind: override.entry.conditionKind,
      substituteCost: override.entry.substituteCost,
      check: override.entry.check,
      groupSource: group?.source || "",
      matched: condition.matched || "",
      source: override.entry.source || ""
    }
  };
}

function isSourceConditionReliefRequest(text = "") {
  const raw = String(text || "").toLowerCase();
  const compact = guideSearchText(raw);
  return hasAny(raw, ["conditionoverride"])
    || hasAny(compact, [
      "通融", "帮我过", "幫我過", "帮我做", "幫我做", "条件", "條件",
      "缺材料", "没材料", "沒材料", "材料不够", "材料不夠", "道具不够", "道具不夠",
      "等级不够", "等級不夠", "宠物不够", "寵物不夠", "石币不够", "石幣不夠",
      "让我完成", "讓我完成", "过任务", "過任務", "任务条件", "任務條件", "报酬", "報酬"
    ]);
}

function sourceConditionReliefCandidate(game, npc, text = "", expected = null) {
  if (!hasNpcScriptEvents(npc)) return null;
  if (!expected && !isSourceConditionReliefRequest(text)) return null;
  const expectedEventNo = Number(expected?.eventNo || 0);
  const expectedHash = String(expected?.conditionHash || "");
  for (const event of npc.scriptEvents || []) {
    const eventNo = Number(event.eventNo || 0);
    if (expectedEventNo > 0 && eventNo !== expectedEventNo) continue;
    if (eventNo > 0 && eventFlagSet(game, eventNo, "end") && event.type !== "MESSAGE") continue;
    if (eventNo > 0 && event.type === "REQUEST" && eventFlagSet(game, eventNo, "now")) continue;
    const keyword = sourceScriptKeywordStatus(event, text);
    if (keyword.required && !keyword.ok && !expected) continue;
    const condition = characterConditionStatus(game, event?.condition || "", { petName: event?.petName || "" });
    if (condition.ok) continue;
    const relief = firstRelievableConditionCheck(condition);
    if (!relief) continue;
    const hash = npcConditionHash(npc, event, relief.check);
    if (expectedHash && expectedHash !== hash) continue;
    return { event, condition, check: relief.check, group: relief.group, groupIndex: relief.groupIndex, conditionHash: hash };
  }
  return null;
}

function firstRelievableConditionCheck(condition) {
  const allowed = new Set(["item", "level", "pet", "stone", "event"]);
  for (let groupIndex = 0; groupIndex < (condition.groups || []).length; groupIndex += 1) {
    const group = condition.groups[groupIndex];
    for (const check of group.checks || []) {
      if (check.ok || !allowed.has(check.type)) continue;
      return { check, group, groupIndex };
    }
  }
  return null;
}

function conditionOverrideActionFromCandidate(game, npc, candidate, text = "") {
  const check = candidate.check || {};
  return {
    type: "conditionOverride",
    text: String(text || "").slice(0, 180),
    eventNo: Number(candidate.event?.eventNo || 0),
    conditionHash: candidate.conditionHash || npcConditionHash(npc, candidate.event, check),
    condition: candidate.event?.condition || "",
    conditionToken: check.token || "",
    conditionKind: check.type || "",
    substituteStone: npcConditionOverrideCost(game, npc, candidate, text),
    seconds: Math.ceil(NPC_CONDITION_OVERRIDE_TTL_MS / 1000)
  };
}

function npcConditionOverrideCost(game, npc, candidate, text = "") {
  const check = candidate?.check || {};
  const urgentDiscount = hasAny(String(text || ""), ["拜托", "拜託", "真的需要", "很需要", "急用"]) ? 80 : 0;
  const levelPremium = Math.min(400, Math.max(0, Number(game.player?.level || 1) - 1) * 12);
  let base = 220 + levelPremium;
  if (check.type === "item") {
    const missing = Math.max(1, Number(check.needed || 1) - Number(check.qty || 0));
    base += missing * 140;
  } else if (check.type === "level") {
    const gap = Math.max(1, Number(check.expected || 1) - Number(check.actual || 1));
    base += Math.min(2400, gap * 80);
  } else if (check.type === "pet") {
    const missing = Math.max(1, Number(check.needed || 1) - Number(check.qty || 0));
    base += 260 + missing * 180;
  } else if (check.type === "stone") {
    const missing = Math.max(1, Number(check.expected || 0) - Number(check.actual || 0));
    base += Math.min(5000, Math.ceil(missing * 0.35));
  } else if (check.type === "event") {
    base += 360;
  }
  if (isSavePointNpc(npc)) base += 120;
  return clampInt(Math.round(base - urgentDiscount), 80, 20000, 300);
}

function npcConditionHash(npc, event, check = null) {
  return stableHashString([
    npc?.id || "",
    Number(event?.eventNo || 0),
    normalizeConditionToken(event?.condition || ""),
    normalizeConditionToken(check?.token || "")
  ].join("|"));
}

function npcConditionOverrideKey(npcId, eventNo, conditionHash) {
  return `${npcId}:${Number(eventNo || 0)}:${conditionHash}`;
}

function normalizeConditionToken(value = "") {
  return String(value || "").replace(/\s+/g, "").toUpperCase();
}

function stableHashString(value) {
  let hash = 2166136261;
  for (const char of String(value || "")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36);
}

function matchingNpcConditionOverride(game, npc, event, condition) {
  normalizeNpcConditionOverrides(game);
  const entries = Object.values(game.effects?.npcConditionOverrides || {});
  if (!entries.length) return null;
  for (let groupIndex = 0; groupIndex < (condition.groups || []).length; groupIndex += 1) {
    const group = condition.groups[groupIndex];
    for (const check of group.checks || []) {
      if (check.ok) continue;
      const hash = npcConditionHash(npc, event, check);
      const entry = entries.find((item) => npcConditionOverrideApplies(item, npc, event, hash));
      if (!entry) continue;
      const token = normalizeConditionToken(entry.conditionToken || check.token || "");
      const groupPassesWithOverride = (group.checks || []).every((item) => item.ok || normalizeConditionToken(item.token) === token);
      if (groupPassesWithOverride) return { entry, check, group, groupIndex };
    }
  }
  recordNpcConditionOverrideRefusal(game, npc, event, "no-matching-override");
  return null;
}

function npcConditionOverrideApplies(entry, npc, event, conditionHash) {
  return String(entry?.npcId || "") === String(npc?.id || "")
    && Number(entry?.eventNo || 0) === Number(event?.eventNo || 0)
    && String(entry?.conditionHash || "") === String(conditionHash || "")
    && Number(entry?.expiresAt || 0) > Date.now()
    && Number(entry?.usesLeft || 0) > 0;
}

function recordNpcConditionOverrideRefusal(game, npc, event, reason) {
  if (!event?.condition) return;
  recordNpcVmEvent(game, npc, "debug", "blocked", {
    reason: `npc-condition-override-${reason}`,
    eventNo: event?.eventNo,
    conditionHash: stableHashString(`${npc?.id || ""}|${event?.eventNo || 0}|${normalizeConditionToken(event?.condition || "")}`)
  });
}

function publicNpcConditionOverrideMatch(entry) {
  if (!entry) return null;
  return {
    key: entry.key,
    npcId: entry.npcId,
    eventNo: entry.eventNo,
    conditionHash: entry.conditionHash,
    conditionKind: entry.conditionKind,
    conditionToken: entry.conditionToken,
    substituteStone: Number(entry.substituteCost?.stone || 0),
    usesLeft: entry.usesLeft,
    expiresAt: entry.expiresAt
  };
}

function npcConditionKindLabel(kind = "") {
  const labels = {
    item: "道具条件",
    level: "等级条件",
    pet: "宠物条件",
    stone: "石币条件",
    event: "事件条件"
  };
  return labels[String(kind || "")] || "";
}

function hasPendingSourceStop(game, npc, event = null) {
  const pending = game?.flags?.pendingSourceStop;
  if (!pending || String(pending.npcId || "") !== String(npc?.id || "")) return false;
  if (!event) return true;
  return Number(pending.eventNo || 0) === Number(event.eventNo || 0);
}

function isSourceScriptStopText(text = "") {
  const raw = String(text || "").toLowerCase();
  const compact = guideSearchText(raw);
  return hasAny(raw, ["stop", "cancel", "quit"])
    || hasAny(compact, ["取消任务", "取消委托", "放弃任务", "放棄任務", "放弃委托", "放棄委託", "停止任务", "停止任務", "终止任务", "終止任務", "结束任务", "結束任務", "不做了", "不要了"]);
}

function isSourceScriptStopConfirmText(text = "") {
  const raw = String(text || "").trim().toLowerCase();
  const compact = guideSearchText(raw);
  return /^(y|yes|ok|okay|confirm)$/i.test(raw)
    || ["是", "是的", "确定", "確定", "确认", "確認", "好", "好的", "可以"].includes(compact)
    || hasAny(compact, ["确认取消", "確認取消", "确定取消", "確定取消", "确认放弃", "確認放棄", "确定放弃", "確定放棄"])
    || isSourceScriptStopText(raw);
}

function npcHasKeywordBranches(npc) {
  return (npc?.scriptEvents || []).some((event) => sourceScriptKeywordStatus(event).required);
}

function sourceScriptKeywordStatus(event, text = "") {
  const keyword = String(event?.keyword || "").trim();
  if (!keyword) return { required: false, ok: true };
  const actual = String(text || "").trim();
  return {
    required: true,
    ok: actual === keyword || guideSearchText(actual) === guideSearchText(keyword),
    // Do not expose the keyword itself in normal debug/detail payloads; players should discover it in-world.
    keywordLength: keyword.length
  };
}

function runNpcScriptRequest(game, npc, event, detail) {
  const applied = applyNpcScriptItemDelta(game, npc, event, detail, {
    phase: "request",
    takeReason: "source-changeevent-request-delitem",
    giveReason: "source-changeevent-request-getitem"
  });
  if (!applied.ok) return applied.reply;
  if (Number(event.eventNo || 0) > 0) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      kind: "now",
      shiftbit: Number(event.eventNo),
      key: `now:${event.eventNo}`,
      ...detail
    });
  }
  runNpcScriptNpcWarps(game, npc, event, detail, "request");
  runNpcScriptCharmActions(game, npc, event, detail, "request");
  runNpcScriptCleanFlags(game, npc, event, detail, "request");
  runNpcScriptMissionActions(game, npc, event, detail, "request");
  runNpcScriptProgressActions(game, npc, event, detail, "request");
  runNpcScriptLastTalkElderActions(game, npc, event, detail, "request");
  recordNpcVmEvent(game, npc, "quest", "ok", {
    ...detail,
    phase: "request",
    getItems: event.getItems,
    delItems: event.delItems,
    getRandItems: event.getRandItems,
    getStones: event.getStones,
    delStones: event.delStones,
    npcWarps: event.npcWarps,
    charms: event.charms,
    cleanFlags: event.cleanFlags,
    missionOver: event.missionOver,
    missionClean: event.missionClean,
    addExps: event.addExps,
    lastTalkElder: event.lastTalkElder,
    getPets: event.getPets,
    delPets: event.delPets
  });
  syncCharacterFields(game);
  const lines = scriptEventMessages(event, ["request", "thanks", "normalMain"], game);
  const rewardLine = scriptEventRewardLine(event);
  if (rewardLine) lines.push(rewardLine);
  return lines.join("\n") || npcDefaultLine(npc);
}

function runNpcScriptAccept(game, npc, event, detail) {
  const applied = applyNpcScriptItemDelta(game, npc, event, detail, {
    phase: "accept",
    takeReason: "source-changeevent-delitem",
    giveReason: "source-changeevent-getitem"
  });
  if (!applied.ok) return applied.reply;
  for (const shiftbit of event.endSetFlags || []) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      kind: "end",
      shiftbit,
      key: `end:${shiftbit}`,
      ...detail,
      reason: "source-changeevent-end"
    });
  }
  runNpcScriptNpcWarps(game, npc, event, detail, "accept");
  runNpcScriptCharmActions(game, npc, event, detail, "accept");
  runNpcScriptCleanFlags(game, npc, event, detail, "accept");
  runNpcScriptMissionActions(game, npc, event, detail, "accept");
  runNpcScriptProgressActions(game, npc, event, detail, "accept");
  runNpcScriptLastTalkElderActions(game, npc, event, detail, "accept");
  recordNpcVmEvent(game, npc, "quest", "ok", {
    ...detail,
    phase: "accept",
    getItems: event.getItems,
    delItems: event.delItems,
    getRandItems: event.getRandItems,
    getStones: event.getStones,
    delStones: event.delStones,
    npcWarps: event.npcWarps,
    charms: event.charms,
    getPets: event.getPets,
    delPets: event.delPets,
    cleanFlags: event.cleanFlags,
    endSetFlags: event.endSetFlags,
    missionOver: event.missionOver,
    missionClean: event.missionClean,
    addExps: event.addExps,
    lastTalkElder: event.lastTalkElder
  });
  syncCharacterFields(game);
  const lines = scriptEventMessages(event, ["accept", "thanks", "normalMain"], game);
  const rewardLine = scriptEventRewardLine(event);
  if (rewardLine) lines.push(rewardLine);
  return lines.join("\n") || npcDefaultLine(npc);
}

function runNpcScriptMessage(game, npc, event, detail) {
  const applied = applyNpcScriptItemDelta(game, npc, event, detail, {
    phase: "message",
    takeReason: "source-changeevent-message-delitem",
    giveReason: "source-changeevent-message-getitem"
  });
  if (!applied.ok) return applied.reply;
  for (const shiftbit of event.nowSetFlags || []) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      kind: "now",
      shiftbit,
      key: `now:${shiftbit}`,
      ...detail,
      reason: "source-changeevent-message-now"
    });
  }
  for (const shiftbit of event.endSetFlags || []) {
    runNpcVmAction(game, npc, {
      type: "setFlag",
      kind: "end",
      shiftbit,
      key: `end:${shiftbit}`,
      ...detail,
      reason: "source-changeevent-message-end"
    });
  }
  runNpcScriptNpcWarps(game, npc, event, detail, "message");
  runNpcScriptCharmActions(game, npc, event, detail, "message");
  runNpcScriptCleanFlags(game, npc, event, detail, "message");
  runNpcScriptMissionActions(game, npc, event, detail, "message");
  runNpcScriptProgressActions(game, npc, event, detail, "message");
  runNpcScriptLastTalkElderActions(game, npc, event, detail, "message");
  const hasMutation = (event.getItems || []).length
    || (event.delItems || []).length
    || (event.getRandItems || []).length
    || (event.getStones || []).length
    || (event.delStones || []).length
    || (event.npcWarps || []).length
    || (event.charms || []).length
    || (event.getPets || []).length
    || (event.delPets || []).length
    || (event.cleanFlags || []).length
    || (event.endSetFlags || []).length
    || (event.nowSetFlags || []).length
    || Number(event.missionOver || 0) > 0
    || Number(event.missionClean || 0) > 0
    || Number(event.addExps || 0) > 0
    || Number(event.lastTalkElder || 0) > 0;
  recordNpcVmEvent(game, npc, hasMutation ? "quest" : "say", "ok", {
    ...detail,
    phase: "message",
    getItems: event.getItems,
    delItems: event.delItems,
    petName: event.petName,
    notDelItems: event.notDelItems,
    getRandItems: event.getRandItems,
    getStones: event.getStones,
    delStones: event.delStones,
    npcWarps: event.npcWarps,
    charms: event.charms,
    getPets: event.getPets,
    delPets: event.delPets,
    cleanFlags: event.cleanFlags,
    endSetFlags: event.endSetFlags,
    nowSetFlags: event.nowSetFlags,
    missionOver: event.missionOver,
    missionClean: event.missionClean,
    addExps: event.addExps,
    lastTalkElder: event.lastTalkElder
  });
  syncCharacterFields(game);
  const lines = scriptEventMessages(event, ["normalMain", "normal", "thanks", "request", "accept"], game);
  const rewardLine = scriptEventRewardLine(event);
  if (rewardLine) lines.push(rewardLine);
  return lines.join("\n") || npcDefaultLine(npc);
}

function runNpcScriptClean(game, npc, event, detail) {
  const applied = applyNpcScriptItemDelta(game, npc, event, detail, {
    phase: "clean",
    takeReason: "source-changeevent-clean-delitem",
    giveReason: "source-changeevent-clean-getitem"
  });
  if (!applied.ok) return applied.reply;
  runNpcScriptNpcWarps(game, npc, event, detail, "clean");
  runNpcScriptCharmActions(game, npc, event, detail, "clean");
  runNpcScriptCleanFlags(game, npc, event, detail, "clean");
  runNpcScriptMissionActions(game, npc, event, detail, "clean");
  runNpcScriptProgressActions(game, npc, event, detail, "clean");
  runNpcScriptLastTalkElderActions(game, npc, event, detail, "clean");
  recordNpcVmEvent(game, npc, "quest", "ok", {
    ...detail,
    phase: "clean",
    cleanFlags: event.cleanFlags,
    getItems: event.getItems,
    delItems: event.delItems,
    petName: event.petName,
    notDelItems: event.notDelItems,
    getRandItems: event.getRandItems,
    getStones: event.getStones,
    delStones: event.delStones,
    npcWarps: event.npcWarps,
    charms: event.charms,
    getPets: event.getPets,
    delPets: event.delPets,
    missionOver: event.missionOver,
    missionClean: event.missionClean,
    addExps: event.addExps,
    lastTalkElder: event.lastTalkElder
  });
  syncCharacterFields(game);
  const lines = scriptEventMessages(event, ["cleanMain", "cleanFlag", "normalMain", "normal", "thanks"], game);
  const rewardLine = scriptEventRewardLine(event);
  if (rewardLine) lines.push(rewardLine);
  return lines.join("\n") || npcDefaultLine(npc);
}

function runNpcScriptNpcWarps(game, npc, event, detail, phase) {
  if (!event.npcWarps?.length) return;
  const sourceAction = event.npcWarps.some((point) => point?.sourceAction === "NPCPOINT")
    ? "npcpoint"
    : "npcwarp";
  runNpcVmAction(game, npc, {
    type: "moveNpc",
    npcId: npc.id,
    points: event.npcWarps,
    ...detail,
    phase,
    reason: `source-changeevent-${sourceAction}`
  });
}

function runNpcScriptCharmActions(game, npc, event, detail, phase) {
  const eventNo = Number(event.eventNo || 0);
  if (eventNo <= 0 || !event.charms?.length) return;
  for (const amount of event.charms || []) {
    runNpcVmAction(game, npc, {
      type: "adjustCharm",
      amount,
      ...detail,
      phase,
      reason: "source-changeevent-charm"
    });
  }
}

function runNpcScriptCleanFlags(game, npc, event, detail, phase) {
  for (const shiftbit of event.cleanFlags || []) {
    runNpcVmAction(game, npc, {
      type: "clearFlag",
      kind: "now-end",
      shiftbit,
      key: `now-end:${shiftbit}`,
      ...detail,
      phase,
      reason: "source-changeevent-cleanflag"
    });
  }
}

function runNpcScriptMissionActions(game, npc, event, detail, phase) {
  if (Number(event.missionOver || 0) > 0) {
    runNpcVmAction(game, npc, {
      type: "missionOver",
      mission: Number(event.missionOver),
      ...detail,
      phase,
      reason: "source-changeevent-missionover"
    });
  }
  if (Number(event.missionClean || 0) > 0) {
    runNpcVmAction(game, npc, {
      type: "missionClean",
      mission: Number(event.missionClean),
      ...detail,
      phase,
      reason: "source-changeevent-missionclean"
    });
  }
}

function runNpcScriptProgressActions(game, npc, event, detail, phase) {
  const exp = Number(event.addExps || 0);
  if (exp <= 0) return;
  runNpcVmAction(game, npc, {
    type: "give",
    exp,
    ...detail,
    phase,
    reason: "source-eventaction-addexps"
  });
}

function runNpcScriptLastTalkElderActions(game, npc, event, detail, phase) {
  const sourceId = Number(event.lastTalkElder || 0);
  if (sourceId <= 0) return;
  runNpcVmAction(game, npc, {
    type: "setLastTalkElder",
    sourceId,
    ...detail,
    phase,
    reason: "source-eventaction-setlasttalkelder"
  });
}

function applyNpcScriptItemDelta(game, npc, event, detail, options = {}) {
  const phase = options.phase || "script";
  const conditionOverride = detail?.conditionOverride || null;
  const runtimeEvent = sourceScriptRuntimeEvent(game, event, conditionOverride);
  const preflight = npcScriptEventPreflight(game, runtimeEvent);
  if (!preflight.ok) {
    recordNpcVmEvent(game, npc, "quest", "blocked", {
      ...detail,
      phase,
      reason: preflight.reason,
      itemId: preflight.itemId,
      itemName: preflight.itemName,
      petId: preflight.petId,
      petName: preflight.petName,
      stone: preflight.stone
    });
    const blockedMessage = preflight.reason === "inventory-full"
      ? runtimeEvent.messages?.itemFull
      : preflight.reason === "pet-full"
        ? runtimeEvent.messages?.petFull
        : preflight.reason === "stone-full"
          ? runtimeEvent.messages?.stoneFull
          : preflight.reason === "missing-stone"
            ? runtimeEvent.messages?.stoneLess
            : "";
    return {
      ok: false,
      reply: blockedMessage || `${npc.name}：${preflight.message || "条件还没有准备好。"}。`
    };
  }
  const overridePayment = consumeNpcConditionOverrideForEvent(game, npc, event, conditionOverride, detail);
  if (!overridePayment.ok) return overridePayment;
  for (const item of runtimeEvent.delItems || []) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      itemId: item.id,
      itemName: item.name,
      qty: item.qty,
      ...detail,
      reason: options.takeReason || "source-changeevent-delitem"
    });
    if (!taken.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: taken.error || "take-failed", itemId: item.id, itemName: item.name });
      return { ok: false, reply: `${npc.name}：${taken.error || "需要的道具不够"}。` };
    }
  }
  for (const pet of runtimeEvent.delPets || []) {
    const sourceAction = pet.sourceAction || "DelPet";
    const taken = runNpcVmAction(game, npc, {
      type: "takePet",
      petId: pet.petId,
      petName: pet.petName || conditionPetName(game, pet.petId),
      level: pet.level,
      op: pet.op,
      qty: pet.qty,
      sourceAction,
      sourceCondition: pet.source,
      ...detail,
      reason: options.takePetReason || (sourceAction === "NewDelPet" ? "source-eventaction-newdelpet" : "source-changeevent-delpet")
    });
    if (!taken.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: taken.error || "take-pet-failed", petId: pet.petId, petName: pet.petName || conditionPetName(game, pet.petId) });
      return { ok: false, reply: `${npc.name}：${taken.error || "需要的宠物不符合条件"}。` };
    }
  }
  for (const stone of runtimeEvent.delStones || []) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      item: "stone",
      qty: stone.amount,
      sourceExpression: stone.source || stone.expr || "",
      ...detail,
      reason: options.takeStoneReason || "source-changeevent-delstone"
    });
    if (!taken.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: taken.error || "take-stone-failed", stone: stone.amount });
      return { ok: false, reply: runtimeEvent.messages?.stoneLess || `${npc.name}：${taken.error || "石币不够"}。` };
    }
  }
  for (const item of runtimeEvent.getItems || []) {
    const given = runNpcVmAction(game, npc, {
      type: "give",
      item: sourceScriptItem(item),
      qty: item.qty,
      ...detail,
      reason: item.scriptAction === "AddItem" ? "source-eventaction-additem" : (options.giveReason || "source-changeevent-getitem")
    });
    if (!given.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: given.error || "give-failed", itemId: item.id, itemName: item.name });
      return { ok: false, reply: runtimeEvent.messages?.itemFull || `${npc.name}：${given.error || "背包放不下任务道具"}。` };
    }
  }
  for (const pet of runtimeEvent.getPets || []) {
    const given = runNpcVmAction(game, npc, {
      type: "givePet",
      enemyIds: pet.enemyIds,
      qty: pet.qty,
      ...detail,
      source: pet.source || "GetPet",
      reason: pet.source === "AddPet" ? "source-eventaction-addpet" : (options.givePetReason || "source-changeevent-getpet")
    });
    if (!given.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: given.error || "give-pet-failed", enemyIds: pet.enemyIds });
      return { ok: false, reply: runtimeEvent.messages?.itemFull || `${npc.name}：${given.error || "宠物栏放不下任务宠物"}。` };
    }
  }
  for (const stone of runtimeEvent.getStones || []) {
    const given = runNpcVmAction(game, npc, {
      type: "give",
      stone: stone.amount,
      sourceExpression: stone.source || stone.expr || "",
      ...detail,
      reason: options.giveStoneReason || (stone.source === "AddGold" ? "source-eventaction-addgold" : "source-changeevent-getstone")
    });
    if (!given.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", { ...detail, phase, reason: given.error || "give-stone-failed", stone: stone.amount });
      return { ok: false, reply: runtimeEvent.messages?.stoneFull || `${npc.name}：${given.error || "石币无法放下"}。` };
    }
  }
  return { ok: true };
}

function sourceScriptRuntimeEvent(game, event, conditionOverride = null) {
  const randomItems = sourceScriptRuntimeRandItems(event);
  return {
    ...event,
    getItems: [...(event.getItems || []), ...randomItems],
    delItems: sourceScriptRuntimeDelItems(game, event, conditionOverride),
    getStones: sourceScriptRuntimeStones(game, event.getStones),
    delStones: sourceScriptRuntimeStones(game, event.delStones),
    delPets: sourceScriptRuntimeDelPets(game, event, conditionOverride)
  };
}

function sourceScriptRuntimeRandItems(event) {
  const items = [];
  for (const spec of event.getRandItems || []) {
    const ids = (spec.ids || []).map((id) => Number(id)).filter((id) => id > 0);
    if (!ids.length) continue;
    const id = ids.length === 1 ? ids[0] : ids[randInt(ids.length)];
    items.push(sourceScriptItem({
      id,
      qty: Math.max(1, Number(spec.qty || 1)),
      source: spec.source || "GetRandItem"
    }));
  }
  return items;
}

function sourceScriptRuntimeStones(game, specs = []) {
  return (specs || [])
    .map((spec) => {
      const amount = sourceScriptStoneAmount(game, spec);
      return amount > 0 ? { ...spec, amount } : null;
    })
    .filter(Boolean);
}

function sourceScriptStoneAmount(game, spec = {}) {
  if (Number(spec.multiplier || 0) > 0 || /^LV\s*\*/i.test(String(spec.expr || spec.source || ""))) {
    const multiplier = Number(spec.multiplier || String(spec.expr || spec.source || "").match(/LV\s*\*\s*(\d+)/i)?.[1] || 0);
    return Math.max(0, Number(game.player?.level || 1) * multiplier);
  }
  return Math.max(0, Number(spec.amount || 0));
}

function sourceScriptRuntimeDelItems(game, event, conditionOverride = null) {
  const out = [];
  for (const item of event.delItems || []) {
    if (!item?.evdel) {
      out.push(item);
      continue;
    }
    const condition = sourceScriptEventConditionStatus(game, event);
    out.push(...parseSourceScriptItemConditionSpecs(condition.matched || "", event.notDelItems, conditionOverride));
  }
  return out;
}

function parseSourceScriptItemConditionSpecs(source = "", notDelItems = [], conditionOverride = null) {
  const keep = new Set((notDelItems || []).map((id) => Number(id)).filter((id) => id > 0));
  return String(source || "")
    .split(/[,&|]/)
    .map((part) => {
      const match = part.trim().match(/^ITEM\s*=\s*(\d+)(?:\*(\d+))?$/i);
      if (!match) return null;
      const id = Number(match[1]);
      if (keep.has(id)) return null;
      if (conditionOverrideSkipsItem(conditionOverride, match[0], id)) return null;
      return sourceScriptItem({
        id,
        qty: Math.max(1, Number(match[2] || 1)),
        source: match[0]
      });
    })
    .filter(Boolean);
}

function sourceScriptRuntimeDelPets(game, event, conditionOverride = null) {
  const out = [];
  for (const pet of event.delPets || []) {
    if (!pet?.evdel) {
      out.push(event.petName ? { ...pet, petName: event.petName } : pet);
      continue;
    }
    const condition = sourceScriptEventConditionStatus(game, event);
    out.push(...parseSourceScriptPetConditionSpecs(condition.matched || "", event.petName, conditionOverride)
      .map((resolved) => ({ ...resolved, sourceAction: pet.sourceAction || "DelPet" })));
  }
  return out;
}

function parseSourceScriptPetConditionSpecs(source = "", petName = "", conditionOverride = null) {
  return String(source || "")
    .split(/[,&|]/)
    .map((part) => {
      const match = part.trim().match(/^PET\s*(!=|>=|<=|>|<|=)\s*(\d+)-(\d+)(?:\*(\d+))?$/i);
      if (!match) return null;
      if (conditionOverrideSkipsPet(conditionOverride, match[0], Number(match[3]))) return null;
      return {
        op: match[1],
        level: Number(match[2]),
        petId: Number(match[3]),
        qty: Number(match[4] || 1),
        ...(petName ? { petName } : {}),
        source: match[0]
      };
    })
    .filter(Boolean);
}

function conditionOverrideSkipsItem(conditionOverride, token, itemId) {
  if (!conditionOverride || conditionOverride.conditionKind !== "item") return false;
  const check = conditionOverride.check || {};
  return normalizeConditionToken(token) === normalizeConditionToken(conditionOverride.conditionToken)
    || Number(check.itemId || 0) === Number(itemId || 0);
}

function conditionOverrideSkipsPet(conditionOverride, token, petId) {
  if (!conditionOverride || conditionOverride.conditionKind !== "pet") return false;
  const check = conditionOverride.check || {};
  return normalizeConditionToken(token) === normalizeConditionToken(conditionOverride.conditionToken)
    || Number(check.petId || 0) === Number(petId || 0);
}

function consumeNpcConditionOverrideForEvent(game, npc, event, conditionOverride, detail = {}) {
  if (!conditionOverride?.key) return { ok: true };
  normalizeNpcConditionOverrides(game);
  const entry = game.effects?.npcConditionOverrides?.[conditionOverride.key];
  const now = Date.now();
  if (!entry) {
    recordNpcVmEvent(game, npc, "quest", "blocked", {
      ...detail,
      reason: "npc-condition-override-missing",
      eventNo: event?.eventNo,
      conditionOverride
    });
    return { ok: false, reply: `${npc.name}：刚才的通融条件已经失效，请重新确认。` };
  }
  if (!npcConditionOverrideApplies(entry, npc, event, conditionOverride.conditionHash)) {
    recordNpcVmEvent(game, npc, "quest", "blocked", {
      ...detail,
      reason: "npc-condition-override-scope-mismatch",
      eventNo: event?.eventNo,
      conditionOverride: publicNpcConditionOverrideMatch(entry)
    });
    return { ok: false, reply: `${npc.name}：这个通融不属于当前脚本事件。` };
  }
  if (entry.expiresAt <= now || entry.usesLeft <= 0) {
    delete game.effects.npcConditionOverrides[entry.key];
    recordNpcConditionOverrideDebug(game, entry, entry.expiresAt <= now ? "expired" : "consumed");
    recordNpcVmEvent(game, npc, "quest", "blocked", {
      ...detail,
      reason: entry.expiresAt <= now ? "npc-condition-override-expired" : "npc-condition-override-consumed",
      eventNo: event?.eventNo,
      conditionOverride: publicNpcConditionOverrideMatch(entry)
    });
    return { ok: false, reply: `${npc.name}：通融条件已经失效，请重新确认。` };
  }
  const fee = Number(entry.substituteCost?.stone || 0);
  if (fee > 0) {
    const paid = runNpcVmAction(game, npc, {
      type: "take",
      item: "stone",
      qty: fee,
      ...detail,
      reason: "npc-condition-override-cost",
      conditionOverride: publicNpcConditionOverrideMatch(entry)
    });
    if (!paid.ok) {
      recordNpcVmEvent(game, npc, "quest", "blocked", {
        ...detail,
        reason: "npc-condition-override-cost-failed",
        requiredStone: fee,
        currentStone: Number(game.player?.stone || 0),
        conditionOverride: publicNpcConditionOverrideMatch(entry)
      });
      return { ok: false, reply: `${npc.name}：通融费需要 ${fee} 石币，你现在不够。` };
    }
  }
  entry.usesLeft -= 1;
  recordNpcConditionOverrideDebug(game, entry, "consumed");
  recordNpcVmEvent(game, npc, "debug", "ok", {
    ...detail,
    reason: "npc-condition-override-consumed",
    conditionOverride: publicNpcConditionOverrideMatch(entry)
  });
  if (entry.usesLeft <= 0) delete game.effects.npcConditionOverrides[entry.key];
  return { ok: true };
}

function npcScriptEventPreflight(game, event) {
  for (const stone of event.delStones || []) {
    const amount = Number(stone.amount || 0);
    if (amount > Number(game.player?.stone || 0)) {
      return {
        ok: false,
        reason: "missing-stone",
        stone: amount,
        message: `需要石币 ${amount}`
      };
    }
  }
  for (const stone of event.getStones || []) {
    const amount = Number(stone.amount || 0);
    if (amount > 0 && Number(game.player?.stone || 0) + amount >= CHAR_MAXGOLDHAVE) {
      return {
        ok: false,
        reason: "stone-full",
        stone: amount,
        message: `身上的石币太多，无法再获得 ${amount}`
      };
    }
  }
  for (const item of event.delItems || []) {
    const qty = inventoryQty(game, item.id);
    if (qty < Number(item.qty || 1)) {
      return {
        ok: false,
        reason: "missing-item",
        itemId: item.id,
        itemName: item.name,
        message: `需要 ${item.name || `item ${item.id}`} x${item.qty || 1}`
      };
    }
  }
  for (const pet of event.delPets || []) {
    const qty = petQtyInPartyMatching(game, pet);
    if (qty < Number(pet.qty || 1)) {
      const petName = pet.petName || conditionPetName(game, pet.petId) || `pet ${pet.petId}`;
      return {
        ok: false,
        reason: "missing-pet",
        petId: pet.petId,
        petName,
        message: `需要 ${petName} Lv${pet.op || ">"}${pet.level} x${pet.qty || 1}`
      };
    }
  }
  const slots = new Set((game.inventory || [])
    .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
    .map((item) => Number(item.id)));
  for (const item of event.delItems || []) {
    if (inventoryQty(game, item.id) <= Number(item.qty || 1)) slots.delete(Number(item.id));
  }
  for (const item of event.getItems || []) {
    slots.add(Number(item.id));
  }
  if (slots.size > INVENTORY_CAPACITY) {
    return { ok: false, reason: "inventory-full", message: `背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具` };
  }
  const petCountAfter = (game.pets || []).length
    - (event.delPets || []).reduce((sum, pet) => sum + Math.max(1, Number(pet.qty || 1)), 0)
    + (event.getPets || []).reduce((sum, pet) => sum + Math.max(1, Number(pet.qty || 1)), 0);
  if (petCountAfter > PET_CAPACITY) {
    return { ok: false, reason: "pet-full", message: `宠物栏已满，最多携带 ${PET_CAPACITY} 只宠物` };
  }
  return { ok: true };
}

function sourceScriptEventBlockedReply(game, npc, text = "") {
  const statuses = (npc.scriptEvents || []).map((event) => ({
    event,
    condition: sourceScriptEventConditionStatus(game, event),
    keyword: sourceScriptKeywordStatus(event, text)
  }));
  const completed = statuses.find(({ event }) => Number(event.eventNo || 0) > 0 && eventFlagSet(game, Number(event.eventNo), "end"));
  if (completed) {
    recordNpcVmEvent(game, npc, "say", "ok", { reason: "source-changeevent-completed", eventNo: completed.event.eventNo });
    return scriptEventMessages(completed.event, ["normal", "thanks", "normalMain"]).join("\n") || `${npc.name}：这件事已经结束了。`;
  }
  const inProgress = statuses.find(({ event }) => (
    Number(event.eventNo || 0) > 0 &&
    event.type === "REQUEST" &&
    eventFlagSet(game, Number(event.eventNo), "now") &&
    !eventFlagSet(game, Number(event.eventNo), "end")
  ));
  if (inProgress) {
    return sourceScriptInProgressReply(game, npc, inProgress.event, text);
  }
  const keywordBlocked = statuses.find(({ condition, keyword }) => condition.ok && keyword.required && !keyword.ok);
  if (keywordBlocked) {
    recordNpcVmEvent(game, npc, "quest", "blocked", {
      reason: "source-changeevent-keyword",
      text: text.slice(0, 80),
      keywordRequired: true,
      keywordOk: false
    });
    const base = npc.dialogue && !String(npc.dialogue).startsWith("脚本入口") ? npc.dialogue : npcDefaultLine(npc);
    return `${base}\n这段事件需要说出正确的关键词。`;
  }
  const blocked = statuses.find(({ condition }) => !condition.ok);
  const unmet = compactConditionUnmet(blocked?.condition, 3)
    .map((check) => {
      if (check.itemName) return `${check.itemName} x${check.needed || 1}`;
      if (check.petName) return `${check.petName} Lv${check.op || ""}${check.expected ?? ""} x${check.needed || 1}`;
      if (check.type === "angelMission") return `勇者任务 ${check.mission} ${check.role === "angel" ? "天使" : "勇者"}状态`;
      return check.token;
    })
    .filter(Boolean);
  recordNpcVmEvent(game, npc, "quest", "blocked", {
    reason: "source-changeevent-no-ready-branch",
    text: text.slice(0, 80),
    unmet
  });
  const base = npc.dialogue && !String(npc.dialogue).startsWith("脚本入口") ? npc.dialogue : npcDefaultLine(npc);
  return unmet.length ? `${base}\n还缺：${unmet.join("、")}。` : base;
}

function sourceScriptInProgressReply(game, npc, event, text = "") {
  const detail = {
    reason: "source-changeevent-in-progress",
    eventNo: event.eventNo,
    eventType: event.type,
    source: event.source || npc.script || npc.source || ""
  };
  const pending = hasPendingSourceStop(game, npc, event);
  const directConfirm = hasAny(guideSearchText(text), ["确认取消", "確認取消", "确定取消", "確定取消", "确认放弃", "確認放棄", "确定放弃", "確定放棄"]);
  if ((pending && isSourceScriptStopConfirmText(text)) || directConfirm) {
    return runNpcScriptEndStop(game, npc, event, { ...detail, reason: "source-changeevent-endstop" });
  }
  if (isSourceScriptStopText(text)) {
    ensureFlags(game);
    game.flags.pendingSourceStop = {
      npcId: npc.id,
      eventNo: Number(event.eventNo || 0),
      source: event.source || npc.script || npc.source || ""
    };
    runNpcVmAction(game, npc, {
      type: "window",
      windowType: "CHAR_WINDOWTYPE_WINDOWEVENT_NOWEVENT",
      ...detail,
      reason: "source-changeevent-stop-prompt"
    });
    const lines = scriptEventMessages(event, ["stop", "noStop"], game);
    return lines.join("\n") || `${npc.name}：要放弃这件正在进行的事吗？输入“确定”后会结束任务。`;
  }
  recordNpcVmEvent(game, npc, "quest", "noop", detail);
  return scriptEventMessages(event, ["noStop", "stop", "thanks", "request", "normalMain"], game).join("\n") || `${npc.name}：这件事还在进行中。`;
}

function runNpcScriptEndStop(game, npc, event, detail = {}) {
  ensureFlags(game);
  delete game.flags.pendingSourceStop;
  for (const item of event.getItems || []) {
    const qty = Math.max(1, Number(item.qty || 1));
    if (inventoryQty(game, item.id) < qty) {
      recordNpcVmEvent(game, npc, "quest", "blocked", {
        ...detail,
        phase: "endstop",
        reason: "source-changeevent-endstop-missing-request-item",
        itemId: item.id,
        itemName: item.name,
        qty
      });
      continue;
    }
    runNpcVmAction(game, npc, {
      type: "take",
      itemId: item.id,
      itemName: item.name,
      qty,
      ...detail,
      phase: "endstop",
      reason: "source-changeevent-endstop-getitem"
    });
  }
  const eventNo = Number(event.eventNo || 0);
  if (eventNo > 0) {
    runNpcVmAction(game, npc, {
      type: "clearFlag",
      kind: "now",
      shiftbit: eventNo,
      key: `now:${eventNo}`,
      ...detail,
      phase: "endstop"
    });
  }
  if (Number(game.player?.charm || 0) > 0) {
    runNpcVmAction(game, npc, {
      type: "adjustCharm",
      amount: -1,
      ...detail,
      phase: "endstop"
    });
  }
  recordNpcVmEvent(game, npc, "quest", "ok", {
    ...detail,
    phase: "endstop",
    requestItems: event.getItems,
    eventNo
  });
  syncCharacterFields(game);
  const lines = scriptEventMessages(event, ["endStop", "noStop", "normalMain"], game);
  return lines.join("\n") || `${npc.name}：这件事已经取消。`;
}

function scriptEventMessages(event, keys, game) {
  const lines = [];
  for (const key of keys) {
    const base = event.messages?.[key];
    const pages = (event.messagePages?.[key] || []).filter(Boolean);
    if (base) {
      lines.push(formatSourceScriptMessage(game, event, base));
      for (const page of pages) {
        if (page && page !== base) lines.push(formatSourceScriptMessage(game, event, page));
      }
    } else {
      for (const page of pages) lines.push(formatSourceScriptMessage(game, event, page));
    }
  }
  return lines;
}

function formatSourceScriptMessage(game, event, message) {
  const text = String(message || "");
  if (!text.includes("%8d")) return text;
  const stone = (event.delStones || [])[0];
  const amount = stone ? sourceScriptStoneAmount(game, stone) : 0;
  return text.replace(/%8d/g, String(amount));
}

function scriptEventRewardLine(event) {
  const gets = (event.getItems || []).map((item) => `${item.name || `item ${item.id}`} x${item.qty || 1}`);
  const randGets = (event.getRandItems || []).map(sourceScriptRandomItemLabel).filter(Boolean);
  const petGets = (event.getPets || []).map(sourceScriptGetPetLabel).filter(Boolean);
  const stoneGets = (event.getStones || []).map(sourceScriptStoneLabel).filter(Boolean);
  const exp = Number(event.addExps || 0);
  const parts = [];
  if (gets.length) parts.push(gets.join("、"));
  if (randGets.length) parts.push(`随机道具 ${randGets.join("、")}`);
  if (petGets.length) parts.push(`宠物 ${petGets.join("、")}`);
  if (stoneGets.length) parts.push(`石币 ${stoneGets.join("、")}`);
  if (exp > 0) parts.push(`经验 ${exp}`);
  if (!parts.length) return "";
  return `获得：${parts.join("；")}。`;
}

function sourceScriptItem(item) {
  const sourceItem = cache?.itemSet?.get(Number(item.id));
  return {
    ...(sourceItem || {}),
    ...item,
    id: Number(item.id),
    name: item.name || sourceItem?.name || `item ${item.id}`,
    source: item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
}

function sourceScriptGetPetLabel(spec = {}) {
  const ids = (spec.enemyIds || []).map((id) => Number(id)).filter((id) => id > 0);
  if (!ids.length) return "";
  const names = ids.map(sourceScriptEnemyPetName).filter(Boolean);
  if (names.length === 1 && ids.length === 1) return names[0];
  if (names.length) return `${names.slice(0, 3).join(" / ")}${names.length > 3 ? "..." : ""}之一`;
  return ids.length === 1 ? `enemy ${ids[0]}` : `enemy ${ids.slice(0, 3).join(" / ")}之一`;
}

function sourceScriptRandomItemLabel(spec = {}) {
  const names = (spec.names || [])
    .filter(Boolean)
    .slice(0, 3);
  if (names.length) return `${names.join(" / ")}${(spec.ids || []).length > names.length ? "..." : ""}之一`;
  const ids = (spec.ids || []).map((id) => Number(id)).filter((id) => id > 0);
  return ids.length ? `${ids.slice(0, 3).join(" / ")}${ids.length > 3 ? "..." : ""}之一` : "";
}

function sourceScriptStoneLabel(spec = {}) {
  if (Number(spec.amount || 0) > 0) return String(spec.amount);
  if (spec.expr) return spec.expr;
  return spec.source || "";
}

function sourceScriptEnemyPetName(enemyId) {
  const spec = cache?.enemySpecsById?.get(Number(enemyId));
  const petId = Number(spec?.tempNo || enemyId);
  const template = cache?.enemyBaseSet?.get(petId);
  return usableReferenceName(template?.Name) ? template.Name : "";
}

function buildSourceScriptTaskIndex(world) {
  const tasks = new Map();
  for (const map of Object.values(world.maps || {})) {
    for (const npc of map.npcs || []) {
      for (const event of npc.scriptEvents || []) {
        const eventNo = Number(event.eventNo || 0);
        if (eventNo <= 0) continue;
        const source = event.source || npc.script || npc.source || "";
        const sourceCluster = sourceScriptTaskCluster(source);
        const taskKey = `${eventNo}:${sourceCluster}`;
        const task = tasks.get(taskKey) || {
          eventNo,
          taskKey,
          sourceCluster,
          title: "",
          sources: new Set(),
          npcs: [],
          requestNpcs: [],
          acceptNpcs: [],
          requiredItems: new Map(),
          rewardItems: new Map(),
          requiredStones: [],
          rewardStones: [],
          requiredPets: new Map(),
          rewardPets: new Map()
        };
        const ref = {
          id: npc.id,
          name: npc.name,
          mapId: map.id,
          mapName: map.name,
          x: npc.x,
          y: npc.y,
          source,
          sourceCluster,
          condition: event.condition || "",
          petName: event.petName || "",
          eventType: event.type
        };
        task.sources.add(ref.source);
        task.npcs.push(ref);
        if (event.type === "REQUEST") task.requestNpcs.push(ref);
        if (event.type === "ACCEPT" || event.type === "MESSAGE") {
          task.acceptNpcs.push({
            ...ref,
            getItems: (event.getItems || []).map(sourceScriptTaskItem),
            getRandItems: (event.getRandItems || []).map(sourceScriptTaskRandItem),
            delItems: (event.delItems || []).map(sourceScriptTaskItem),
            getStones: event.getStones || [],
            delStones: event.delStones || [],
            getPets: (event.getPets || []).map(sourceScriptTaskGetPet),
            delPets: (event.delPets || []).map((pet) => sourceScriptTaskPet({ ...pet, petName: event.petName || "" })).filter(Boolean),
            endSetFlags: [...(event.endSetFlags || [])],
            missionOver: Number(event.missionOver || 0),
            missionClean: Number(event.missionClean || 0)
          });
        }
        for (const item of event.delItems || []) upsertSourceScriptTaskItem(task.requiredItems, item);
        for (const item of event.getItems || []) upsertSourceScriptTaskItem(task.rewardItems, item);
        for (const item of event.getRandItems || []) upsertSourceScriptTaskItem(task.rewardItems, sourceScriptTaskRandItem(item));
        for (const stone of event.delStones || []) task.requiredStones.push(stone);
        for (const stone of event.getStones || []) task.rewardStones.push(stone);
        for (const pet of event.delPets || []) upsertSourceScriptTaskPet(task.requiredPets, sourceScriptTaskPet({ ...pet, petName: event.petName || "" }));
        for (const pet of event.getPets || []) upsertSourceScriptTaskPet(task.rewardPets, sourceScriptTaskGetPet(pet));
        tasks.set(taskKey, task);
      }
    }
  }
  return [...tasks.values()]
    .map((task) => ({
      ...task,
      title: sourceScriptTaskTitle(task),
      sources: [...task.sources].filter(Boolean).slice(0, 4),
      requiredItems: [...task.requiredItems.values()],
      rewardItems: [...task.rewardItems.values()],
      requiredStones: task.requiredStones.slice(0, 4),
      rewardStones: task.rewardStones.slice(0, 4),
      requiredPets: [...task.requiredPets.values()],
      rewardPets: [...task.rewardPets.values()],
      npcs: task.npcs.slice(0, 8),
      requestNpcs: task.requestNpcs.slice(0, 4),
      acceptNpcs: task.acceptNpcs.slice(0, 8)
    }))
    .sort((a, b) => a.eventNo - b.eventNo || a.sourceCluster.localeCompare(b.sourceCluster));
}

function sourceScriptTaskCluster(source) {
  const cleaned = String(source || "").replace(/^gmsv-data\/npc\//, "");
  const parts = cleaned.split(/[\\/]+/).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).join("/");
  return cleaned || "unknown";
}

function upsertSourceScriptTaskItem(map, item) {
  const key = Number(item.id);
  if (!key) return;
  const existing = map.get(key);
  const next = sourceScriptTaskItem(item);
  map.set(key, existing ? { ...existing, qty: Math.max(Number(existing.qty || 1), Number(next.qty || 1)) } : next);
}

function sourceScriptTaskItem(item) {
  return {
    id: Number(item.id),
    name: item.name || `item ${item.id}`,
    qty: Math.max(1, Number(item.qty || 1))
  };
}

function sourceScriptTaskRandItem(spec = {}) {
  const sample = (spec.sample || [])
    .map(sourceScriptTaskItem)
    .filter((item) => item.id > 0);
  const first = sample[0];
  return {
    id: first?.id || 0,
    name: sample.length > 1
      ? `${sample.slice(0, 3).map((item) => item.name).join(" / ")}${sample.length > 3 ? "..." : ""}之一`
      : first?.name || "随机道具",
    qty: Math.max(1, Number(spec.qty || 1)),
    random: true,
    candidates: sample.slice(0, 8)
  };
}

function upsertSourceScriptTaskPet(map, pet) {
  if (!pet) return;
  const key = pet.key || `${pet.petId || ""}:${pet.enemyIds?.join(".") || ""}:${pet.op || ""}:${pet.level ?? ""}:${pet.petName || ""}`;
  if (!key) return;
  const existing = map.get(key);
  map.set(key, existing ? { ...existing, qty: Math.max(Number(existing.qty || 1), Number(pet.qty || 1)) } : pet);
}

function sourceScriptTaskPet(pet = {}) {
  if (pet.evdel || !Number(pet.petId)) return null;
  return {
    key: `${pet.petId}:${pet.op || "="}:${pet.level}:${pet.petName || ""}`,
    petId: Number(pet.petId),
    name: pet.petName || `pet ${pet.petId}`,
    op: pet.op || "=",
    level: Number(pet.level || 1),
    qty: Math.max(1, Number(pet.qty || 1)),
    ...(pet.petName ? { petName: pet.petName } : {})
  };
}

function sourceScriptTaskGetPet(pet = {}) {
  const enemyIds = (pet.enemyIds || []).map((id) => Number(id)).filter((id) => id > 0);
  return {
    key: `enemy:${enemyIds.join(".")}`,
    enemyIds,
    name: enemyIds.length === 1 ? `enemy ${enemyIds[0]}` : `enemy ${enemyIds.slice(0, 3).join(" / ")}之一`,
    qty: Math.max(1, Number(pet.qty || 1))
  };
}

function sourceScriptTaskTitle(task) {
  const npc = task.requestNpcs[0] || task.acceptNpcs.find((item) => item.delItems?.length || item.delPets?.length) || task.acceptNpcs[0] || task.npcs[0];
  const reward = [...task.rewardItems.values()].find((item) => item.name);
  const rewardPet = [...(task.rewardPets?.values?.() || [])].find((pet) => pet.name);
  const rewardStone = (task.rewardStones || [])[0];
  return reward
    ? `${npc?.name || "事件"}：${reward.name}`
    : rewardPet
      ? `${npc?.name || "事件"}：${rewardPet.name}`
      : rewardStone
        ? `${npc?.name || "事件"}：石币`
        : (npc?.name || `事件 ${task.eventNo}`);
}

function sourceScriptTaskState(game) {
  ensureFlags(game);
  const recentClusters = recentSourceScriptTaskClusters(game);
  return SOURCE_SCRIPT_TASKS
    .filter((task) => eventFlagSet(game, task.eventNo, "now") && !eventFlagSet(game, task.eventNo, "end"))
    .map((task) => compactSourceScriptTask(game, task, recentClusters))
    .sort(sourceScriptTaskStateSort)
    .slice(0, 8);
}

function recentSourceScriptTaskClusters(game) {
  const clusters = new Map();
  for (const event of [...(game.npcVmEvents || [])].reverse()) {
    const detail = event.detail || {};
    if (!String(detail.reason || "").startsWith("source-changeevent")) continue;
    const eventNo = Number(detail.eventNo || 0);
    if (eventNo <= 0 || clusters.has(eventNo)) continue;
    clusters.set(eventNo, sourceScriptTaskCluster(detail.source || event.source || event.script || ""));
    if (clusters.size >= 8) break;
  }
  return clusters;
}

function compactSourceScriptTask(game, task, recentClusters = new Map()) {
  const readyTurnIns = task.acceptNpcs
    .filter((npc) => npc.delItems?.length || npc.delPets?.length)
    .filter((npc) => characterConditionStatus(game, npc.condition || "", { petName: npc.petName || "" }).ok);
  const readyProviders = task.acceptNpcs
    .filter((npc) => npc.getItems?.length || npc.getPets?.length)
    .filter((npc) => characterConditionStatus(game, npc.condition || "", { petName: npc.petName || "" }).ok);
  const missingItems = task.requiredItems
    .map((item) => ({ ...item, have: inventoryQty(game, item.id), needed: Number(item.qty || 1) }))
    .filter((item) => item.have < item.needed);
  const missingPets = (task.requiredPets || [])
    .map((pet) => ({ ...pet, have: petQtyInPartyMatching(game, pet), needed: Number(pet.qty || 1) }))
    .filter((pet) => pet.have < pet.needed);
  const missingStones = (task.requiredStones || [])
    .map((stone) => ({ ...stone, amount: sourceScriptStoneAmount(game, stone), have: Number(game.player?.stone || 0) }))
    .filter((stone) => stone.amount > stone.have);
  const phase = readyTurnIns.length && !missingItems.length && !missingPets.length && !missingStones.length
    ? "turn-in"
    : readyProviders.length
      ? "collect"
      : (missingItems.length || missingPets.length || missingStones.length)
        ? "collect"
        : "in-progress";
  const nextNpcs = (phase === "turn-in" ? readyTurnIns : readyProviders.length ? readyProviders : task.requestNpcs)
    .map((npc) => sourceScriptTaskNpc(game, npc))
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name, "zh-Hans"))
    .slice(0, 3);
  const recentSourceCluster = recentClusters.get(task.eventNo);
  const guidance = sourceScriptTaskGuidance(game, phase, missingItems, missingPets, missingStones, nextNpcs, task);
  return {
    eventNo: task.eventNo,
    sourceCluster: task.sourceCluster,
    recent: Boolean(recentSourceCluster && recentSourceCluster === task.sourceCluster),
    title: task.title,
    status: "进行中",
    phase,
    next: sourceScriptTaskNextText(phase, missingItems, missingPets, missingStones, nextNpcs, task),
    guidance,
    requiredItems: task.requiredItems.map((item) => ({ ...item, have: inventoryQty(game, item.id) })),
    rewardItems: task.rewardItems,
    requiredStones: (task.requiredStones || []).map((stone) => ({ ...stone, amount: sourceScriptStoneAmount(game, stone), have: Number(game.player?.stone || 0) })),
    rewardStones: (task.rewardStones || []).map((stone) => ({ ...stone, amount: sourceScriptStoneAmount(game, stone) })),
    requiredPets: (task.requiredPets || []).map((pet) => ({ ...pet, have: petQtyInPartyMatching(game, pet) })),
    rewardPets: task.rewardPets || [],
    nextNpcs,
    target: nextNpcs[0] || null,
    source: task.sources[0] || ""
  };
}

function sourceScriptTaskStateSort(a, b) {
  return sourceScriptTaskRank(a) - sourceScriptTaskRank(b)
    || a.eventNo - b.eventNo
    || String(a.sourceCluster || "").localeCompare(String(b.sourceCluster || ""));
}

function sourceScriptTaskRank(task) {
  const distanceRank = Math.min(task.nextNpcs?.[0]?.distance ?? 9999, 9999);
  const phaseRank = task.phase === "turn-in" ? 0 : task.phase === "collect" ? 100 : 200;
  return (task.recent ? -20000 : 0) + (distanceRank < 9999 ? -10000 : 0) + phaseRank + distanceRank;
}

function sourceScriptTaskNpc(game, npc) {
  const sameMap = String(game.location?.mapId || "") === String(npc.mapId);
  const gives = sourceScriptTaskNpcOutputLabels(game, npc);
  const requires = sourceScriptTaskNpcRequirementLabels(game, npc);
  return {
    id: npc.id,
    name: npc.name,
    mapId: npc.mapId,
    mapName: npc.mapName,
    x: npc.x,
    y: npc.y,
    distance: sameMap ? distance(npc.x, npc.y, Number(game.location.x || 0), Number(game.location.y || 0)) : 9999,
    source: npc.source,
    ...(gives.length ? { gives } : {}),
    ...(requires.length ? { requires } : {})
  };
}

function sourceScriptTaskNpcOutputLabels(game, npc = {}) {
  return uniqueSourceTaskLabels([
    ...(npc.getItems || []).map(sourceScriptTaskItemLabel),
    ...(npc.getRandItems || []).map(sourceScriptTaskItemLabel),
    ...(npc.getPets || []).map(sourceScriptTaskPetLabel),
    ...(npc.getStones || []).map((stone) => sourceScriptTaskStoneLabel(game, stone))
  ]);
}

function sourceScriptTaskNpcRequirementLabels(game, npc = {}) {
  return uniqueSourceTaskLabels([
    ...(npc.delItems || []).map(sourceScriptTaskItemLabel),
    ...(npc.delPets || []).map(sourceScriptTaskPetLabel),
    ...(npc.delStones || []).map((stone) => sourceScriptTaskStoneLabel(game, stone))
  ]);
}

function uniqueSourceTaskLabels(labels = [], limit = 4) {
  const out = [];
  const seen = new Set();
  for (const label of labels) {
    const normalized = String(label || "").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= limit) break;
  }
  return out;
}

function sourceScriptTaskItemLabel(item = {}) {
  const name = item.name || (Number(item.id || 0) > 0 ? `道具 ${Number(item.id)}` : "");
  if (!name) return "";
  const qty = Math.max(1, Number(item.qty || 1));
  return qty > 1 ? `${name} x${qty}` : name;
}

function sourceScriptTaskPetLabel(pet = {}) {
  const name = pet.name || (Number(pet.enemyId || 0) > 0 ? `宠物 ${Number(pet.enemyId)}` : "");
  if (!name) return "";
  const qty = Math.max(1, Number(pet.qty || 1));
  const level = Number(pet.level || 0) > 0 ? ` Lv${pet.op || ">="}${Number(pet.level)}` : "";
  return qty > 1 ? `${name}${level} x${qty}` : `${name}${level}`;
}

function sourceScriptTaskStoneLabel(game, stone = {}) {
  const amount = sourceScriptStoneAmount(game, stone);
  return amount > 0 ? `${amount} 石币` : "";
}

function sourceScriptTaskNextText(phase, missingItems, missingPets, missingStones, nextNpcs, task) {
  if (phase === "turn-in") {
    const target = nextNpcs[0];
    return target ? `回到 ${target.mapName} 的 ${target.name} 交付任务需求。` : "回到任务 NPC 交付需求。";
  }
  if (missingItems.length || missingPets.length || missingStones.length) {
    const itemNeeds = missingItems.map((item) => `${item.name} ${item.have}/${item.needed}`);
    const petNeeds = missingPets.map((pet) => `${pet.name} Lv${pet.op}${pet.level} ${pet.have}/${pet.needed}`);
    const stoneNeeds = missingStones.map((stone) => `石币 ${stone.have}/${stone.amount}`);
    const needs = [...itemNeeds, ...petNeeds, ...stoneNeeds].join("、");
    const target = nextNpcs[0];
    return target ? `收集 ${needs}；可先找 ${target.mapName} 的 ${target.name}。` : `收集 ${needs}。`;
  }
  if (nextNpcs[0]) return `继续找 ${nextNpcs[0].mapName} 的 ${nextNpcs[0].name}。`;
  return `继续推进事件 ${task.eventNo}。`;
}

function sourceScriptTaskGuidance(game, phase, missingItems, missingPets, missingStones, nextNpcs, task) {
  const lines = [];
  const target = nextNpcs[0];
  if (target) {
    lines.push(`目标 NPC：去 ${target.mapName} floor ${target.mapId} (${target.x},${target.y}) 找 ${target.name}${target.distance < 9999 ? `，距离 ${target.distance} 格` : ""}${sourceTaskTargetHandoffText(target)}。`);
    const route = routeHintToMap(game, target.mapId);
    if (route) lines.push(route);
    if (phase === "turn-in" && target.requires?.length) lines.push(`交付内容：${target.requires.join("、")}。`);
    else if (phase === "collect" && target.gives?.length) lines.push(`先找他领取/确认：${target.gives.join("、")}。`);
  }
  const needs = [
    ...missingItems.map((item) => `${item.name} ${item.have}/${item.needed}`),
    ...missingPets.map((pet) => `${pet.name} Lv${pet.op}${pet.level} ${pet.have}/${pet.needed}`),
    ...missingStones.map((stone) => `石币 ${stone.have}/${stone.amount}`)
  ];
  if (needs.length) lines.push(`先补齐条件：${needs.join("、")}。`);
  if (phase === "turn-in") lines.push("做法：靠近目标 NPC，双击或输入 hi，把脚本要求的道具/宠物/石币交付。");
  else if (phase === "collect") lines.push("做法：先向提示 NPC 询问、交易或领取线索；满足条件后再回交付 NPC。");
  else lines.push(`做法：继续推进 EventNo ${task.eventNo} 的原脚本分支，优先找最近的相关 NPC。`);
  const rewards = [
    ...(task.rewardItems || []).slice(0, 3).map((item) => `${item.name} x${Number(item.qty || 1)}`),
    ...(task.rewardPets || []).slice(0, 2).map((pet) => pet.name),
    ...(task.rewardStones || []).slice(0, 1).map((stone) => `${sourceScriptStoneAmount(game, stone)} 石币`)
  ];
  if (rewards.length) lines.push(`可能奖励：${rewards.join("、")}。`);
  return compactGuidanceLines(lines);
}

function sourceTaskTargetHandoffText(target = {}) {
  const handoffs = [
    ...(Array.isArray(target.gives) && target.gives.length ? [`领取/确认：${target.gives.join("、")}`] : []),
    ...(Array.isArray(target.requires) && target.requires.length ? [`交付：${target.requires.join("、")}`] : [])
  ];
  return handoffs.length ? `；${handoffs.join("；")}` : "";
}

function responseQuestState(game) {
  return Object.fromEntries(Object.entries(game.quests || {}).map(([questId, quest]) => [
    questId,
    decorateQuestForResponse(game, quest)
  ]));
}

function decorateQuestForResponse(game, quest) {
  if (!quest) return quest;
  const guidance = questGuidanceLines(game, quest);
  return {
    ...quest,
    guidance,
    nextDetail: guidance[0] || nextQuestStepText(quest),
    target: questPrimaryTarget(game, quest)
  };
}

function questGuidanceLines(game, quest) {
  const lines = [];
  const step = nextQuestStepText(quest);
  const stepNo = Math.min(Number(quest.progress || 0) + 1, quest.steps?.length || 1);
  const stepTotal = Math.max(1, quest.steps?.length || 1);
  if (step) lines.push(`当前步骤 ${stepNo}/${stepTotal}：${step}`);
  if (quest.status === "可回报") {
    pushQuestNpcGuidance(lines, game, quest.returnNpcId || quest.startNpcId, "回报");
    lines.push("做法：站到 NPC 两格内双击，或在对话框输入 hi 结算奖励。");
    if (quest.reward) lines.push(`奖励：${quest.reward}。`);
    return compactGuidanceLines(lines);
  }
  const objectives = quest.objectives || {};
  if (Array.isArray(objectives.enterMaps) && objectives.enterMaps.length) {
    const visited = new Set((quest.visitedMaps || []).map(String));
    const nextMapId = objectives.enterMaps.map(String).find((mapId) => !visited.has(mapId));
    if (nextMapId) {
      lines.push(`下一张地图：${questMapLabel(nextMapId)}。`);
      const route = routeHintToMap(game, nextMapId);
      if (route) lines.push(route);
    } else {
      pushQuestNpcGuidance(lines, game, quest.returnNpcId || quest.startNpcId, "回报");
    }
  }
  if (objectives.visitEncounterMap && Number(quest.progress || 0) < 2) {
    const route = routeHintToMap(game, "100");
    lines.push("目标地点：离开村镇去有 encount.txt 的野外地图，萨伊那斯 floor 100 是当前新手路线。");
    if (route) lines.push(route);
  }
  if (objectives.fieldWin && quest.status !== "可回报") {
    lines.push("战斗目标：在野外走动触发遇敌，打赢或捕获一只宠物后任务会变成可回报。");
  }
  if (Array.isArray(objectives.npcEnemyIds) && objectives.npcEnemyIds.length) {
    const target = objectives.npcEnemyIds.map(findWorldNpcWithMap).find(Boolean);
    if (target) {
      lines.push(`战斗目标：去 ${target.map.name} floor ${target.map.id} (${target.npc.x},${target.npc.y}) 找 ${target.npc.name}。`);
      const route = routeHintToMap(game, target.map.id);
      if (route) lines.push(route);
      lines.push("做法：靠近后双击 NPC，按原 NPCEnemy 对话确认战斗并击败他。");
    }
  }
  if (!lines.some((line) => /目标 NPC|回报|下一张地图|目标地点|战斗目标/.test(line))) {
    pushQuestNpcGuidance(lines, game, quest.startNpcId || quest.returnNpcId, "任务 NPC");
  }
  if (quest.reward) lines.push(`奖励：${quest.reward}。`);
  return compactGuidanceLines(lines);
}

function nextQuestStepText(quest) {
  if (quest?.status === "完成") return "完成";
  if (quest?.status === "可回报") return quest.steps?.[quest.steps.length - 1] || "回报任务";
  return quest?.steps?.[Math.min(Number(quest.progress || 0), quest.steps.length - 1)] || "继续探索";
}

function questPrimaryTarget(game, quest) {
  if (!quest) return null;
  const objectives = quest.objectives || {};
  if (quest.status === "可回报") return questNpcTarget(quest.returnNpcId || quest.startNpcId, game);
  if (Array.isArray(objectives.enterMaps) && objectives.enterMaps.length) {
    const visited = new Set((quest.visitedMaps || []).map(String));
    const nextMapId = objectives.enterMaps.map(String).find((mapId) => !visited.has(mapId));
    if (nextMapId) return questMapTarget(nextMapId, game);
  }
  if (Array.isArray(objectives.npcEnemyIds) && objectives.npcEnemyIds.length) {
    const found = objectives.npcEnemyIds.map(findWorldNpcWithMap).find(Boolean);
    if (found) return questNpcTarget(found.npc.id, game);
  }
  if (objectives.visitEncounterMap || objectives.fieldWin) return questMapTarget("100", game);
  return questNpcTarget(quest.startNpcId || quest.returnNpcId, game);
}

function pushQuestNpcGuidance(lines, game, npcId, label) {
  const target = questNpcTarget(npcId, game);
  if (!target) return;
  lines.push(`${label}：去 ${target.mapName} floor ${target.mapId} (${target.x},${target.y}) 找 ${target.name}${target.distance < 9999 ? `，距离 ${target.distance} 格` : ""}。`);
  const route = routeHintToMap(game, target.mapId);
  if (route) lines.push(route);
}

function questNpcTarget(npcId, game = null) {
  const found = findWorldNpcWithMap(npcId);
  if (!found) return null;
  const sameMap = game && String(game.location?.mapId || "") === String(found.map.id);
  return {
    id: found.npc.id,
    name: found.npc.name,
    mapId: found.map.id,
    mapName: found.map.name,
    x: found.npc.x,
    y: found.npc.y,
    distance: sameMap ? distance(found.npc.x, found.npc.y, Number(game.location.x || 0), Number(game.location.y || 0)) : 9999,
    source: found.npc.source || found.npc.script || ""
  };
}

function questMapTarget(mapId, game) {
  const map = WORLD.maps[String(mapId)];
  if (!map) return null;
  const direct = nearestExitToMap(game, map.id);
  return {
    mapId: map.id,
    mapName: map.name,
    floorId: map.floorId || map.id,
    exit: direct ? {
      id: direct.id,
      label: direct.label,
      distance: direct.distance,
      position: exitPositionLabel(direct)
    } : null
  };
}

function findWorldNpcWithMap(npcId) {
  if (!npcId) return null;
  const targetId = String(npcId);
  for (const map of Object.values(WORLD.maps || {})) {
    const npc = (map.npcs || []).find((item) => String(item.id) === targetId);
    if (npc) return { map, npc };
  }
  return null;
}

function routeHintToMap(game, targetMapId) {
  const currentMapId = String(game.location?.mapId || "");
  const target = WORLD.maps[String(targetMapId)];
  if (!target) return "";
  if (currentMapId === String(targetMapId)) return `你已经在 ${target.name} floor ${target.id}；按坐标找目标即可。`;
  const direct = nearestExitToMap(game, targetMapId);
  if (direct) return `路线：当前地图可直达，走出口「${direct.label}」${exitPositionLabel(direct)}，距离 ${direct.distance} 格。`;
  const exits = nearestExits(game, 3)
    .map((exit) => `${exit.label}->${WORLD.maps[exit.to]?.name || `floor ${exit.to}`}`)
    .join("、");
  return exits ? `路线：当前地图没有直达 ${target.name}；先从附近出口前进：${exits}。` : "";
}

function nearestExitToMap(game, targetMapId) {
  return nearestExits(game)
    .find((exit) => String(exit.to) === String(targetMapId)) || null;
}

function nearestExits(game, limit = 99) {
  const map = WORLD.maps[String(game.location?.mapId || "")];
  if (!map?.exits?.length) return [];
  const x = Number(game.location?.x || 0);
  const y = Number(game.location?.y || 0);
  return map.exits
    .map((exit) => ({ ...exit, distance: distanceToExit(exit, x, y) }))
    .sort((a, b) => a.distance - b.distance || String(a.label || "").localeCompare(String(b.label || ""), "zh-Hans"))
    .slice(0, limit);
}

function exitPositionLabel(exit) {
  if (Array.isArray(exit?.bounds)) return `坐标 ${exit.bounds[0]}-${exit.bounds[2]},${exit.bounds[1]}-${exit.bounds[3]}`;
  return `坐标 ${Number(exit?.x || 0)},${Number(exit?.y || 0)}`;
}

function compactGuidanceLines(lines) {
  const seen = new Set();
  const out = [];
  for (const line of lines) {
    const text = sanitizePlayerFacingText(String(line || "").replace(/\s+/g, " ").trim());
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
    if (out.length >= 6) break;
  }
  return out;
}

function npcDialogueLines(npc) {
  if (Array.isArray(npc.dialogueLines) && npc.dialogueLines.length) return npc.dialogueLines.filter(Boolean);
  if (!npc.dialogue) return [];
  return String(npc.dialogue).split(/\n+/).map((item) => item.trim()).filter(Boolean);
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

function completeQuest(game, questId, npc = null) {
  const quest = game.quests[questId];
  if (!quest || quest.status === "完成") return;
  quest.status = "完成";
  quest.progress = quest.steps.length;
  const expReward = Number(quest.expReward || 20);
  const stoneReward = Number(quest.stoneReward || 80);
  if (npc) {
    setNpcVmFlag(game, npc, eventFlagForQuest(questId), "end", "quest-complete");
    runNpcVmAction(game, npc, { type: "give", exp: expReward, stone: stoneReward, reason: "quest" });
  } else {
    addPlayerExp(game, expReward);
    maybeLevelPlayer(game);
    game.player.stone += stoneReward;
    syncStoneItem(game);
    setEventFlag(game, eventFlagForQuest(questId), "end");
  }
  addLog(game, `完成任务「${quest.title}」，获得奖励。`);
}

function questReply(game, npc, text = "") {
  const questIds = npcQuestIds(npc);
  recordNpcVmEvent(game, npc, "quest", questIds.length ? "ok" : "unsupported", { questIds, query: true });
  if (isSpecificStoneAgeKnowledgeQuestion(text) || (!questIds.length && isStoneAgeKnowledgeQuestion(text))) {
    const reply = localStoneAgeKnowledgeReply(buildStoneAgeKnowledgeContext(game, currentMap(game), text, npc), npc.name);
    if (reply) return reply;
  }
  if (!questIds.length) {
    if (npc.questLead) return `${npc.name} 有原脚本线索：「${npc.questLead.title}」。${npc.questLead.summary}\n来源：${npc.questLead.source}`;
    return `${npc.name} 这里没有正式委托，但可以继续问地图、交易或训练。`;
  }
  const reportable = questIds.map((id) => game.quests[id]).find((quest) => quest?.status === "可回报");
  if (reportable) {
    const lines = questGuidanceLines(game, reportable).slice(0, 4).join("\n");
    return `你已经可以回报「${reportable.title}」了。再次点选我会自动送出 hi 并结算奖励。\n${lines}`;
  }
  const active = questIds.map((id) => game.quests[id]).find((quest) => quest?.status === "进行中");
  if (active) {
    const detail = questObjectiveProgressText(active);
    const lines = questGuidanceLines(game, active).slice(0, 5).join("\n");
    return `「${active.title}」还在进行中。${detail ? `${detail}\n` : ""}${lines}`;
  }
  const titles = questIds.map((id) => `「${WORLD.quests[id].title}」`).join("、");
  return `我这里有 ${titles}。点选我时客户端会自动打招呼并触发一个可接任务。`;
}

function questObjectiveProgressText(quest) {
  const objectives = quest?.objectives || {};
  const parts = [];
  if (Array.isArray(objectives.enterMaps) && objectives.enterMaps.length) {
    const targetMaps = objectives.enterMaps.map(String);
    const visited = new Set((quest.visitedMaps || []).map(String));
    const done = targetMaps.filter((mapId) => visited.has(mapId));
    const next = targetMaps.find((mapId) => !visited.has(mapId));
    if (done.length) parts.push(`已确认地图：${done.map(questMapLabel).join("、")}`);
    parts.push(next ? `下一处地图：${questMapLabel(next)}` : "地图目标已确认");
  }
  if (objectives.visitEncounterMap) {
    parts.push(Number(quest.progress || 0) >= 2 ? "野外地图已确认" : "还需要进入有 encount.txt 的野外地图");
  }
  if (objectives.fieldWin) {
    parts.push(quest.status === "可回报" ? "野外战斗已完成" : "还需要完成一次野外战斗或捕获");
  }
  if (Array.isArray(objectives.npcEnemyIds) && objectives.npcEnemyIds.length) {
    parts.push(`NPCEnemy 目标：${objectives.npcEnemyIds.length} 个源码拦路战斗`);
  }
  return parts.length ? `目标进度：${parts.join("；")}。` : "";
}

function guidanceText(item, fallback = "") {
  const lines = Array.isArray(item?.guidance) ? item.guidance.filter(Boolean).slice(0, 5) : [];
  return lines.length ? lines.join("；") : fallback;
}

function questMapLabel(mapId) {
  const map = WORLD.maps[String(mapId)];
  return map ? `${map.name}(floor ${map.id})` : `floor ${mapId}`;
}

async function captureReply(env, request, game, npc) {
  const map = currentMap(game);
  if (!wildEncounterAllowed(map, game)) {
    runNpcVmAction(game, npc, {
      type: "startBattle",
      reason: encounterSourceDataAvailable(map) ? "safe-or-gated-map" : "no-encounter-data",
      mapId: map.id,
      mapName: map.name
    });
    return `${npc.name} 查看了当前地图资料：${wildEncounterBlockedText(map, game)}`;
  }
  const encounter = await createEncounterParty(env, request, game, map);
  const enemy = encounter.enemies[0];
  if (!enemy) return `${npc.name} 找不到可用的遇敌资料。`;
  const event = runNpcVmAction(game, npc, {
    type: "startBattle",
    enemy,
    enemies: encounter.enemies,
    reason: "npc-capture",
    mapId: map.id,
    mapName: map.name,
    source: encounter.source
  });
  if (!event.ok) {
    return `${npc.name} 找不到可用的遇敌资料：${event.error || "startBattle 被 VM 拒绝"}。`;
  }
  addLog(game, `${npc.name} 引导出 ${enemy.Name} Lv.${enemy.Lv}。`);
  return `${npc.name} 根据 ${map.name} 的 encount.txt 引导出 ${enemy.Name} Lv.${enemy.Lv}。\n战斗状态已由 NPC VM 建立；旧的自动抓宠弹窗仍保持关闭，后续会接入原版战斗窗口。`;
}

function trainReply(game, npc) {
  recordNpcVmEvent(game, npc, "fieldSkill", "unsupported", { reason: "training script not ported" });
  const questIds = npcQuestIds(npc);
  const active = questIds.map((id) => game.quests?.[id]).find((quest) => quest?.status === "进行中" || quest?.status === "可回报");
  if (active) {
    recordNpcVmEvent(game, npc, "quest", "ok", { questId: active.id, reason: "training-query" });
    if (active.status === "可回报") {
      return `${npc.name}：训练和成长要靠战斗经验，不能直接帮你提升等级。你已经完成「${active.title}」，回来向我报告就能结算奖励。\n${questGuidanceLines(game, active).slice(0, 3).join("\n")}`;
    }
    const detail = questObjectiveProgressText(active);
    return `${npc.name}：训练和成长要靠战斗经验，不能直接帮你提升等级。当前「${active.title}」${detail ? `\n${detail}` : ""}\n${questGuidanceLines(game, active).slice(0, 4).join("\n")}`;
  }
  if (questIds.length) {
    const titles = questIds.map((id) => WORLD.quests[id]?.title).filter(Boolean).join("、");
    recordNpcVmEvent(game, npc, "quest", "ok", { questIds, reason: "training-query-available" });
    return `${npc.name}：如果想训练，就先接 ${titles || "这里的委托"}；人物和宠物经验只能从战斗、捕获和源码奖励结算获得。`;
  }
  return `${npc.name} 当前没有可模拟的训练脚本，只保留原 NPC 数据入口：${npc.source || npc.script || npc.type}。`;
}

function healerReply(game, npc) {
  const before = {
    playerHp: Number(game.player.hp || 0),
    pets: game.pets.map((pet) => Number(pet.Hp || 0))
  };
  const cost = healerCost(game, npc);
  const needed = needsHealing(game);
  if (!needed) {
    setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "healer-check"), "now", "healer-check");
    recordNpcVmEvent(game, npc, "heal", "noop", { reason: "full-hp" });
    return `${npc.name} 查看了你的状态：人物和宠物都不需要治疗。`;
  }
  if (cost > 0 && Number(game.player.stone || 0) < cost) {
    recordNpcVmEvent(game, npc, "heal", "blocked", { reason: "stone", cost });
    return `${npc.name}：治疗需要 ${cost} 石币，你现在的石币不够。`;
  }
  if (cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "heal" });
    if (!taken.ok) return `${npc.name}：治疗需要 ${cost} 石币，你现在的石币不够。`;
  }
  healParty(game);
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "healer"), "now", "healer");
  const restored = [
    Math.max(0, Number(game.player.hp || 0) - before.playerHp),
    ...game.pets.map((pet, index) => Math.max(0, Number(pet.Hp || 0) - Number(before.pets[index] || 0)))
  ].reduce((sum, item) => sum + item, 0);
  const line = cost > 0
    ? `${npc.name} 为人物和宠物恢复了耐久，花费 ${cost} 石币。`
    : `${npc.name} 为人物和宠物恢复了耐久。`;
  addLog(game, `${line} 合计恢复 ${restored}。`);
  recordNpcVmEvent(game, npc, "heal", "ok", { cost, restored });
  return `${line}\n来源：gmsv npc_windowhealer / npc_healer 会恢复玩家与宠物 HP/MP。`;
}

function needsHealing(game) {
  if (Number(game.player.hp || 0) < Number(game.player.maxHp || 0)) return true;
  return game.pets.some((pet) => Number(pet.Hp || 0) < Number(pet.WorkMaxHp || 0));
}

function healerCost(game, npc) {
  if (!/windowhealer/i.test(`${npc.type} ${npc.template}`)) return 0;
  if (!needsHealing(game)) return 0;
  return Math.max(1, Math.floor(Number(game.player.level || 1) * 2));
}

function healParty(game) {
  game.player.hp = Number(game.player.maxHp || game.player.hp || 1);
  for (const pet of game.pets) {
    pet.WorkMaxHp ||= Math.max(1, Number(pet.Hp || 1));
    pet.Hp = Number(pet.WorkMaxHp || pet.Hp || 1);
    if (Number.isFinite(Number(pet.WorkMaxMp))) pet.Mp = Number(pet.WorkMaxMp || 0);
    pet.IsDie = false;
  }
}

function savePointReply(game, npc, text = "") {
  ensureFlags(game);
  const savePoint = npc.savePoint || {};
  const sourceId = sourceSavePointId(npc);
  if (savePoint.noItem && sourceId > 0) registerSourceSavePoint(game, sourceId);
  const registered = sourceId > 0 && isSourceSavePointRegistered(game, sourceId);
  const requirement = sourceSavePointRequirement(game, npc);
  if (!registered && requirement.required) {
    if (!requirement.ok) {
      clearPendingSavePointConfirm(game, npc);
      recordNpcVmEvent(game, npc, "save", "blocked", {
        reason: "source-savepoint-missing-item",
        sourceId,
        required: requirement.summary,
        source: savePoint.source || npc.script || npc.source || ""
      });
      const request = formatSavePointMessage(game, savePoint.messages?.request || `${npc.name}：想在这里记录，需要准备指定道具。`);
      return `${request}\n需要：${requirement.summary}。\n来源：${savePoint.source || npc.script || npc.source || "gmsv npc_savepoint"}`;
    }
    if (!hasPendingSavePointConfirm(game, npc) || !isSavePointConfirmText(text)) {
      game.flags.pendingSavePoint = {
        npcId: npc.id,
        sourceId,
        items: requirement.alternative.map((item) => ({ id: item.id, name: item.name, qty: item.qty })),
        source: savePoint.source || npc.script || npc.source || ""
      };
      runNpcVmAction(game, npc, {
        type: "window",
        reason: "source-savepoint-confirm",
        sourceId,
        required: requirement.summary,
        source: savePoint.source || npc.script || npc.source || ""
      });
      const confirm = formatSavePointMessage(game, savePoint.messages?.confirm || `${npc.name}：要用这些道具记录这里吗？`);
      return `${confirm}\n将消耗：${requirement.alternative.map(sourceSavePointItemLabel).join("、")}。\n输入“确认记录”继续。`;
    }
    for (const item of requirement.alternative) {
      const taken = runNpcVmAction(game, npc, {
        type: "take",
        itemId: item.id,
        itemName: item.name,
        qty: item.qty,
        reason: "source-savepoint-getitem",
        source: savePoint.source || npc.script || npc.source || ""
      });
      if (!taken.ok) {
        clearPendingSavePointConfirm(game, npc);
        return `${npc.name}：记录需要的 ${sourceSavePointItemLabel(item)} 已经不在背包里了。`;
      }
    }
  }
  clearPendingSavePointConfirm(game, npc);
  const record = applySourceSavePointRecord(game, npc, "source-savepoint");
  const born = record.born;
  addLog(game, `${npc.name} 已记录你的冒险进度。`);
  const key = registered ? "normal" : "ok";
  const message = formatSavePointMessage(game, savePoint.messages?.[key] || `${npc.name} 已记录你的冒险进度。`);
  const bornLine = born ? `记录点：floor ${born.mapId} (${born.x},${born.y})。` : "";
  return `${message}\n${bornLine}来源：gmsv npc_savepoint 会设置 CHAR_SAVEPOINT / LASTTALKELDER 并触发 SAAC 角色保存。`;
}

function isLuckyManNpc(npc) {
  return Boolean(npc?.luckyMan)
    || /LuckyMan|luckyman/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""}`);
}

function isLuckyManRequestText(text) {
  return hasAny(text, ["占卜", "算命", "运势", "運勢", "看看运", "看看運", "fortune", "luck"]);
}

function isLuckyManConfirmText(text) {
  return /(^|\s)(yes|ok|y)(\s|$)/i.test(text)
    || hasAny(text, ["是", "好", "可以", "确认", "確定", "确定", "请", "請", "来吧", "占卜吧"]);
}

function luckyManCost(game, npc) {
  const expr = npc?.luckyMan?.stoneExpr || "0";
  return sourceScriptStoneAmount(game, { expr, source: expr, amount: Number(expr) || 0 });
}

function luckyManPromptText(game, npc) {
  if (!game) return `${npc.name}：要占卜一次吗？`;
  const cost = game ? luckyManCost(game, npc) : 0;
  const raw = npc?.luckyMan?.mainMessage || `${npc.name}：要占卜一次吗？需要 ${cost} 石币。`;
  return formatLuckyManText(raw, cost) || `${npc.name}：要占卜一次吗？需要 ${cost} 石币。`;
}

function formatLuckyManText(text, cost) {
  return String(text || "")
    .replace(/%8d|%4d|%d/gi, String(cost))
    .replace(/\s+/g, " ")
    .trim();
}

function luckyManPromptReply(game, npc) {
  ensureFlags(game);
  const cost = luckyManCost(game, npc);
  game.flags.pendingLuckyMan = {
    npcId: npc.id,
    cost,
    source: npc.luckyMan?.source || npc.script || npc.source || ""
  };
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "source-luckyman-confirm",
    cost,
    sourceExpression: npc.luckyMan?.stoneExpr || "",
    source: npc.luckyMan?.source || npc.script || npc.source || ""
  });
  return `${luckyManPromptText(game, npc)}\n输入“是”开始占卜。`;
}

function luckyManReply(game, npc, text = "") {
  ensureFlags(game);
  const pending = game.flags.pendingLuckyMan;
  const confirmed = isLuckyManConfirmText(String(text || "").toLowerCase());
  if (!confirmed || !pending || String(pending.npcId || "") !== String(npc.id)) return luckyManPromptReply(game, npc);
  const cost = luckyManCost(game, npc);
  if (cost > 0) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      item: "stone",
      qty: cost,
      reason: "source-luckyman",
      sourceExpression: npc.luckyMan?.stoneExpr || "",
      source: npc.luckyMan?.source || npc.script || npc.source || ""
    });
    if (!taken.ok) {
      game.flags.pendingLuckyMan = null;
      runNpcVmAction(game, npc, {
        type: "fortune",
        status: "blocked",
        reason: "source-luckyman-nomoney",
        cost,
        source: npc.luckyMan?.source || npc.script || npc.source || ""
      });
      return npc.luckyMan?.noMoneyMessage || `${npc.name}：占卜需要 ${cost} 石币，你现在的石币不够。`;
    }
  }
  normalizePlayerRuntime(game.player);
  const luck = clampInt(game.player.WorkFixLuck ?? game.player.Luck ?? 1, 1, 5, 1);
  const messages = npc.luckyMan?.luckMessages?.[luck] || npc.luckyMan?.luckMessages?.[String(luck)] || [];
  const message = messages.length ? messages[randInt(messages.length)] : `${npc.name} 看了看你的运势，没有说出更多内容。`;
  game.flags.pendingLuckyMan = null;
  const event = runNpcVmAction(game, npc, {
    type: "fortune",
    reason: "source-luckyman",
    luck,
    cost,
    message,
    source: npc.luckyMan?.source || npc.script || npc.source || ""
  });
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "luckyman"), "now", "source-luckyman");
  addLog(game, `${npc.name}：${message}`);
  return `${npc.name}：${message}\n来源：${event.detail?.source || npc.luckyMan?.source || npc.script || "gmsv npc_luckyman"}。`;
}

function isJankenNpc(npc) {
  return Boolean(npc?.janken)
    || /Janken|npcgen_janken/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""}`);
}

function isJankenRequestText(text = "") {
  return /(^|\s)(rock|paper|scissors|janken)(\s|$)/i.test(text)
    || hasAny(text, ["猜拳", "石头", "石頭", "剪刀", "布", "拳头", "拳頭", "参加", "參加", "开始", "開始", "出拳"]);
}

function jankenPromptText(game, npc) {
  const entry = jankenEntryLine(npc);
  const main = npc?.janken?.mainMessage || `${npc.name}：要猜拳吗？`;
  const action = game ? "输入“石头 / 剪刀 / 布”出拳。" : "";
  return [main, entry, action].filter(Boolean).join("\n");
}

function jankenEntryLine(npc) {
  const items = npc?.janken?.entryItems || [];
  if (!items.length) return "参加条件：免费。";
  return `参加条件：${items.map(jankenItemLabel).join("、")}。`;
}

function jankenItemLabel(item) {
  return `${item?.name || `item ${item?.id || "?"}`} x${Math.max(1, Number(item?.qty || 1))}`;
}

function jankenPromptReply(game, npc) {
  ensureFlags(game);
  game.flags.pendingJanken = {
    npcId: npc.id,
    paid: false,
    round: 0,
    source: npc.janken?.source || npc.script || npc.source || ""
  };
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "source-janken-start",
    entryItems: npc.janken?.entryItems || [],
    source: npc.janken?.source || npc.script || npc.source || ""
  });
  return jankenPromptText(game, npc);
}

function jankenReply(game, npc, text = "") {
  ensureFlags(game);
  const choice = jankenPlayerChoice(text);
  if (choice == null) return jankenPromptReply(game, npc);
  const paid = ensureJankenEntryPaid(game, npc);
  if (!paid.ok) {
    clearPendingJanken(game, npc);
    runNpcVmAction(game, npc, {
      type: "janken",
      status: "blocked",
      reason: "source-janken-no-entry-item",
      entryItems: npc.janken?.entryItems || [],
      source: npc.janken?.source || npc.script || npc.source || ""
    });
    return npc.janken?.noItemMessage || `${npc.name}：你没有参加券。需要 ${paid.missing ? jankenItemLabel(paid.missing) : jankenEntryLine(npc)}。`;
  }
  const pending = game.flags.pendingJanken;
  const round = Math.max(0, Number(pending?.round || 0));
  const npcChoice = jankenNpcChoice(game, npc, choice, round);
  if (pending) pending.round = round + 1;
  const outcome = jankenOutcome(choice, npcChoice);
  const source = npc.janken?.source || npc.script || npc.source || "";
  const event = runNpcVmAction(game, npc, {
    type: "janken",
    reason: "source-janken-round",
    choice: jankenChoiceName(choice),
    npcChoice: jankenChoiceName(npcChoice),
    outcome,
    paidNow: paid.paidNow,
    round: round + 1,
    source
  });
  if (outcome === "tie") {
    addLog(game, `${npc.name} 猜拳平手，重新出拳。`);
    return `${npc.name} 出了${jankenChoiceName(npcChoice)}，你出了${jankenChoiceName(choice)}，平手。\n不用再交参加券，继续输入“石头 / 剪刀 / 布”。`;
  }
  clearPendingJanken(game, npc);
  const won = outcome === "win";
  const rewardLines = grantJankenItems(game, npc, won ? npc.janken?.winItems : npc.janken?.loseItems, outcome);
  const target = won ? npc.janken?.winWarp : npc.janken?.loseWarp;
  const warpLine = applyJankenWarp(game, npc, target, outcome);
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, `janken-${outcome}`), won ? "end" : "now", "source-janken");
  const resultLine = won ? "你赢了" : "你输了";
  const lines = [
    `${npc.name} 出了${jankenChoiceName(npcChoice)}，你出了${jankenChoiceName(choice)}，${resultLine}。`,
    ...rewardLines,
    warpLine,
    `来源：${event.detail?.source || source || "gmsv npc_janken.c"}。`
  ].filter(Boolean);
  addLog(game, `${npc.name} 猜拳：${resultLine}${warpLine ? `，${warpLine}` : ""}`);
  return lines.join("\n");
}

function jankenPlayerChoice(text = "") {
  const value = String(text || "").toLowerCase();
  if (hasAny(value, ["石头", "石頭", "拳头", "拳頭", "rock"])) return 0;
  if (hasAny(value, ["剪刀", "scissors"])) return 1;
  if (hasAny(value, ["布", "paper"])) return 2;
  return null;
}

function jankenNpcChoice(game, npc, playerChoice, round) {
  const seed = [
    game.character?.id || game.player?.name || "",
    game.location?.mapId || "",
    npc.id,
    npc.janken?.source || npc.script || "",
    playerChoice,
    round
  ].join("|");
  return stableHashInt(seed) % 3;
}

function jankenChoiceName(choice) {
  return ["石头", "剪刀", "布"][choice] || "未知";
}

function jankenOutcome(playerChoice, npcChoice) {
  if (playerChoice === npcChoice) return "tie";
  if ((playerChoice === 0 && npcChoice === 1)
    || (playerChoice === 1 && npcChoice === 2)
    || (playerChoice === 2 && npcChoice === 0)) {
    return "win";
  }
  return "lose";
}

function ensureJankenEntryPaid(game, npc) {
  ensureFlags(game);
  const pending = game.flags.pendingJanken;
  if (pending && String(pending.npcId || "") === String(npc.id) && pending.paid) {
    return { ok: true, paidNow: false };
  }
  const items = npc?.janken?.entryItems || [];
  const missing = items.find((item) => inventoryQty(game, item.id) < Math.max(1, Number(item.qty || 1)));
  if (missing) return { ok: false, missing };
  for (const item of items) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      itemId: item.id,
      itemName: item.name,
      qty: Math.max(1, Number(item.qty || 1)),
      reason: "source-janken-entry",
      source: npc.janken?.source || npc.script || npc.source || ""
    });
    if (!taken.ok) return { ok: false, missing: item, error: taken.error };
  }
  game.flags.pendingJanken = {
    npcId: npc.id,
    paid: true,
    round: Number(pending?.round || 0),
    source: npc.janken?.source || npc.script || npc.source || ""
  };
  return { ok: true, paidNow: Boolean(items.length) };
}

function clearPendingJanken(game, npc) {
  if (String(game?.flags?.pendingJanken?.npcId || "") === String(npc?.id || "")) {
    delete game.flags.pendingJanken;
  }
}

function grantJankenItems(game, npc, items = [], outcome = "") {
  const lines = [];
  for (const item of items || []) {
    const given = runNpcVmAction(game, npc, {
      type: "give",
      item,
      itemId: item.id,
      itemName: item.name,
      qty: Math.max(1, Number(item.qty || 1)),
      reason: `source-janken-${outcome}`,
      source: npc.janken?.source || npc.script || npc.source || ""
    });
    if (given.ok) lines.push(`获得 ${jankenItemLabel(item)}。`);
    else lines.push(`${jankenItemLabel(item)} 发放失败：${given.error || "背包空间不足"}。`);
  }
  return lines;
}

function applyJankenWarp(game, npc, target, outcome) {
  if (!target) return "";
  const targetMap = WORLD.maps[String(target.mapId || "")];
  if (!targetMap) {
    runNpcVmAction(game, npc, {
      type: "warp",
      status: "blocked",
      reason: `source-janken-${outcome}-missing-map`,
      target,
      source: npc.janken?.source || npc.script || npc.source || ""
    });
    return `原脚本要传送到 floor ${target.mapId} (${target.x},${target.y})，但目标地图尚未打包。`;
  }
  const arrived = applyWarpTarget(game, { ...target, source: npc.janken?.source || npc.script || npc.source || "" }, `${npc.name} 猜拳${outcome === "win" ? "胜利" : "失败"}`);
  runNpcVmAction(game, npc, {
    type: "warp",
    reason: `source-janken-${outcome}`,
    target,
    source: npc.janken?.source || npc.script || npc.source || ""
  });
  return `你被传送到 ${arrived.name} (${game.location.x},${game.location.y})。`;
}

function isQuizNpc(npc) {
  return Boolean(npc?.quiz)
    || /Quiz|npcgen_quiz|\/quz_/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""}`);
}

function isQuizRequestText(text = "", game = null, npc = null) {
  if (hasPendingQuiz(game, npc)) return true;
  const value = String(text || "").trim();
  return /^[1-9]$/.test(value)
    || hasAny(value.toLowerCase(), ["quiz", "answer"])
    || hasAny(value, ["答题", "答題", "问题", "問題", "回答", "答案", "开始", "開始", "参加", "參加"]);
}

function hasPendingQuiz(game, npc) {
  return String(game?.flags?.pendingQuiz?.npcId || "") === String(npc?.id || "");
}

function buildQuizState(game, npc) {
  if (!isQuizNpc(npc)) return null;
  const quiz = npc.quiz || {};
  const pending = hasPendingQuiz(game, npc) ? game.flags.pendingQuiz : null;
  return {
    kind: "quiz",
    source: quiz.source || npc.script || npc.source || "",
    quizCount: Number(quiz.quizCount || quiz.questions?.length || 0),
    entryItems: quiz.entryItems || [],
    entryStone: Number(quiz.entryStone || 0),
    rewards: quiz.rewardItems || [],
    warps: quiz.warpTargets || [],
    pending: pending ? {
      paid: Boolean(pending.paid),
      index: Number(pending.index || 0),
      correct: Number(pending.correct || 0),
      total: Number(pending.total || 0)
    } : null
  };
}

function quizPromptText(game, npc) {
  const quiz = npc.quiz || {};
  const start = quiz.messages?.start || `${npc.name}：要参加答题吗？`;
  const entry = quizEntryLine(npc);
  const count = Number(quiz.quizCount || quiz.questions?.length || 0);
  const action = game ? "输入“开始”扣除参加条件并开始答题；答题时可输入选项编号或答案文字。" : "";
  return [start, count ? `题数：${count}。` : "", entry, action].filter(Boolean).join("\n");
}

function quizEntryLine(npc) {
  const quiz = npc?.quiz || {};
  const items = quiz.entryItems || [];
  const stone = Number(quiz.entryStone || 0);
  const parts = [
    ...items.map(quizItemLabel),
    stone > 0 ? `${stone} 石币` : ""
  ].filter(Boolean);
  return parts.length ? `参加条件：${parts.join("、")}。` : "参加条件：免费。";
}

function quizItemLabel(item) {
  return `${item?.name || `item ${item?.id || "?"}`} x${Math.max(1, Number(item?.qty || 1))}`;
}

function quizPromptReply(game, npc) {
  ensureFlags(game);
  game.flags.pendingQuiz = {
    npcId: npc.id,
    paid: false,
    index: 0,
    correct: 0,
    total: quizTotal(npc),
    source: npc.quiz?.source || npc.script || npc.source || ""
  };
  runNpcVmAction(game, npc, {
    type: "window",
    reason: "source-quiz-start",
    entryItems: npc.quiz?.entryItems || [],
    entryStone: Number(npc.quiz?.entryStone || 0),
    source: npc.quiz?.source || npc.script || npc.source || ""
  });
  return quizPromptText(game, npc);
}

function quizReply(game, npc, text = "") {
  ensureFlags(game);
  const value = String(text || "").trim();
  const pending = hasPendingQuiz(game, npc) ? game.flags.pendingQuiz : null;
  if (!pending || (!pending.paid && !isQuizStartText(value))) return quizPromptReply(game, npc);
  if (!pending.paid) {
    const paid = ensureQuizEntryPaid(game, npc);
    if (!paid.ok) {
      clearPendingQuiz(game, npc);
      runNpcVmAction(game, npc, {
        type: "quiz",
        status: "blocked",
        reason: "source-quiz-no-entry",
        entryItems: npc.quiz?.entryItems || [],
        entryStone: Number(npc.quiz?.entryStone || 0),
        source: npc.quiz?.source || npc.script || npc.source || ""
      });
      return npc.quiz?.messages?.noEntry || `${npc.name}：参加条件不足。${paid.missing ? `需要 ${paid.missing}` : quizEntryLine(npc)}`;
    }
    runNpcVmAction(game, npc, {
      type: "quiz",
      reason: "source-quiz-entry-paid",
      paidNow: paid.paidNow,
      source: npc.quiz?.source || npc.script || npc.source || ""
    });
    return quizQuestionText(game, npc, currentQuizQuestion(game, npc), "");
  }
  const question = currentQuizQuestion(game, npc);
  if (!question) return finishQuiz(game, npc);
  if (!value) return quizQuestionText(game, npc, question, "");
  const correct = quizAnswerIsCorrect(question, value);
  game.flags.pendingQuiz.correct = Number(game.flags.pendingQuiz.correct || 0) + (correct ? 1 : 0);
  game.flags.pendingQuiz.index = Number(game.flags.pendingQuiz.index || 0) + 1;
  runNpcVmAction(game, npc, {
    type: "quiz",
    reason: "source-quiz-answer",
    questionId: question.id,
    correct,
    index: Number(game.flags.pendingQuiz.index || 0),
    score: Number(game.flags.pendingQuiz.correct || 0),
    source: npc.quiz?.source || npc.script || npc.source || ""
  });
  const nextQuestion = currentQuizQuestion(game, npc);
  if (!nextQuestion) return finishQuiz(game, npc, correct ? "答对。" : "答错。");
  return quizQuestionText(game, npc, nextQuestion, correct ? "答对。" : "答错。");
}

function isQuizStartText(text = "") {
  return hasAny(String(text || ""), ["开始", "開始", "参加", "參加", "答题", "答題", "是", "yes", "start"]);
}

function quizTotal(npc) {
  const quiz = npc?.quiz || {};
  const questionCount = (quiz.questions || []).length;
  const configured = Number(quiz.quizCount || questionCount || 0);
  return Math.max(0, Math.min(questionCount, configured || questionCount));
}

function ensureQuizEntryPaid(game, npc) {
  ensureFlags(game);
  const pending = game.flags.pendingQuiz;
  if (pending && String(pending.npcId || "") === String(npc.id) && pending.paid) return { ok: true, paidNow: false };
  const quiz = npc.quiz || {};
  const items = quiz.entryItems || [];
  const missingItem = items.find((item) => inventoryQty(game, item.id) < Math.max(1, Number(item.qty || 1)));
  if (missingItem) return { ok: false, missing: quizItemLabel(missingItem) };
  const entryStone = Number(quiz.entryStone || 0);
  if (entryStone > 0 && Number(game.player?.stone || 0) < entryStone) return { ok: false, missing: `${entryStone} 石币` };
  for (const item of items) {
    const taken = runNpcVmAction(game, npc, {
      type: "take",
      itemId: item.id,
      itemName: item.name,
      qty: Math.max(1, Number(item.qty || 1)),
      reason: "source-quiz-entry-item",
      source: quiz.source || npc.script || npc.source || ""
    });
    if (!taken.ok) return { ok: false, missing: quizItemLabel(item), error: taken.error };
  }
  if (entryStone > 0) {
    const takenStone = runNpcVmAction(game, npc, {
      type: "take",
      itemId: "stone",
      qty: entryStone,
      reason: "source-quiz-entry-stone",
      source: quiz.source || npc.script || npc.source || ""
    });
    if (!takenStone.ok) return { ok: false, missing: `${entryStone} 石币`, error: takenStone.error };
  }
  game.flags.pendingQuiz = {
    npcId: npc.id,
    paid: true,
    index: 0,
    correct: 0,
    total: quizTotal(npc),
    source: quiz.source || npc.script || npc.source || ""
  };
  return { ok: true, paidNow: Boolean(items.length || entryStone > 0) };
}

function currentQuizQuestion(game, npc) {
  if (!hasPendingQuiz(game, npc)) return null;
  const index = Number(game.flags.pendingQuiz.index || 0);
  const total = quizTotal(npc);
  if (index >= total) return null;
  return (npc.quiz?.questions || [])[index] || null;
}

function quizQuestionText(game, npc, question, prefix = "") {
  if (!question) return `${npc.name}：题库没有匹配到可用题目，暂时不能开始。`;
  const pending = game.flags.pendingQuiz || {};
  const index = Number(pending.index || 0) + 1;
  const total = Math.max(1, Number(pending.total || quizTotal(npc) || 1));
  const options = (question.options || [])
    .map((option, optionIndex) => `${optionIndex + 1}. ${option}`)
    .join("\n");
  const answerHint = options ? "输入 1/2/3 或答案文字。" : "输入答案文字。";
  return [prefix, `问题 ${index}/${total}：${question.question}`, options, answerHint].filter(Boolean).join("\n");
}

function quizAnswerIsCorrect(question, text = "") {
  const value = String(text || "").trim();
  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric > 0) return numeric === Number(question.answerNo || question.correctIndex + 1 || 1);
  const normalized = normalizeQuizAnswer(value);
  const correctText = normalizeQuizAnswer((question.options || [])[Number(question.correctIndex || 0)] || (question.options || [])[0] || "");
  if (!correctText) return false;
  if (Number(question.answerType || 0) === 4) return normalized.includes(correctText) || correctText.includes(normalized);
  return normalized === correctText || normalized.includes(correctText) || correctText.includes(normalized);
}

function normalizeQuizAnswer(value = "") {
  return String(value || "").toLowerCase().replace(/\s+/g, "").replace(/[。！？!?,，、]/g, "");
}

function finishQuiz(game, npc, prefix = "") {
  const pending = hasPendingQuiz(game, npc) ? game.flags.pendingQuiz : {};
  const score = Number(pending.correct || 0);
  const total = Number(pending.total || quizTotal(npc) || 0);
  const source = npc.quiz?.source || npc.script || npc.source || "";
  const event = runNpcVmAction(game, npc, {
    type: "quiz",
    reason: "source-quiz-finish",
    score,
    total,
    source
  });
  const lines = [
    prefix,
    quizResultMessage(npc, score) || `${npc.name}：答题结束，答对 ${score}/${total} 题。`,
    ...grantQuizReward(game, npc, score),
    applyQuizWarp(game, npc, score),
    `来源：${event.detail?.source || source || "gmsv npc_quiz.c"}。`
  ].filter(Boolean);
  clearPendingQuiz(game, npc);
  addLog(game, `${npc.name} 答题结束：${score}/${total}`);
  return lines.join("\n");
}

function quizResultMessage(npc, score) {
  const result = selectQuizThresholdEntry(npc.quiz?.borders || [], score);
  return result?.text || npc.quiz?.messages?.failure || "";
}

function grantQuizReward(game, npc, score) {
  const entry = selectQuizThresholdEntry(npc.quiz?.rewardItems || [], score);
  if (!entry?.candidates?.length) return [];
  const index = stableHashInt([game.character?.id || game.player?.name || "", npc.id, score, npc.quiz?.source || ""].join("|")) % entry.candidates.length;
  const item = entry.candidates[index];
  const given = runNpcVmAction(game, npc, {
    type: "give",
    item,
    itemId: item.id,
    itemName: item.name,
    qty: 1,
    reason: "source-quiz-reward",
    source: npc.quiz?.source || npc.script || npc.source || ""
  });
  return [given.ok ? `获得 ${item.name || `item ${item.id}`} x1。` : `${item.name || `item ${item.id}`} 发放失败：${given.error || "背包空间不足"}。`];
}

function applyQuizWarp(game, npc, score) {
  const entry = selectQuizThresholdEntry(npc.quiz?.warpTargets || [], score);
  const target = entry?.target;
  if (!target) return "";
  const targetMap = WORLD.maps[String(target.mapId || "")];
  if (!targetMap) {
    runNpcVmAction(game, npc, {
      type: "warp",
      status: "blocked",
      reason: "source-quiz-missing-map",
      target,
      source: npc.quiz?.source || npc.script || npc.source || ""
    });
    return `原脚本要传送到 floor ${target.mapId} (${target.x},${target.y})，但目标地图尚未打包。`;
  }
  const arrived = applyWarpTarget(game, { ...target, source: npc.quiz?.source || npc.script || npc.source || "" }, `${npc.name} 答题结算`);
  runNpcVmAction(game, npc, {
    type: "warp",
    reason: "source-quiz-finish",
    target,
    source: npc.quiz?.source || npc.script || npc.source || ""
  });
  return `你被传送到 ${arrived.name} (${game.location.x},${game.location.y})。`;
}

function selectQuizThresholdEntry(entries = [], score = 0) {
  return (entries || []).find((entry) => Number(score) >= Number(entry.threshold || 0)) || null;
}

function clearPendingQuiz(game, npc) {
  if (String(game?.flags?.pendingQuiz?.npcId || "") === String(npc?.id || "")) {
    delete game.flags.pendingQuiz;
  }
}

function applySourceSavePointRecord(game, npc, reason = "source-savepoint") {
  const savePoint = npc.savePoint || {};
  const sourceId = sourceSavePointId(npc);
  const now = new Date().toISOString();
  const born = sourceSavePointBorn(npc);
  const event = runNpcVmAction(game, npc, {
    type: "save",
    reason,
    sourceId,
    born,
    mapId: game.location.mapId,
    x: game.location.x,
    y: game.location.y,
    npcId: npc.id,
    npcName: npc.name,
    source: savePoint.source || npc.script || npc.source || "",
    savedAt: now
  });
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "savepoint"), "end", "savepoint");
  return { event, born, sourceId, savedAt: now };
}

function hasPendingSavePointConfirm(game, npc) {
  return String(game?.flags?.pendingSavePoint?.npcId || "") === String(npc?.id || "");
}

function clearPendingSavePointConfirm(game, npc) {
  if (hasPendingSavePointConfirm(game, npc)) delete game.flags.pendingSavePoint;
}

function isSavePointConfirmText(text = "") {
  return hasAny(String(text || "").toLowerCase(), ["确认", "確定", "确定", "是", "好", "yes", "ok"]);
}

function sourceSavePointId(npc) {
  return clampInt(npc?.savePoint?.id, 0, 63, 0);
}

function sourceSavePointBorn(npc) {
  const born = npc?.savePoint?.born;
  if (!born) return null;
  const mapId = String(born.mapId || born.floor || "");
  const x = Number(born.x);
  const y = Number(born.y);
  if (!mapId || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { mapId, floor: Number(born.floor || mapId), x, y };
}

function isSourceSavePointRegistered(game, sourceId) {
  ensureFlags(game);
  if ((game.flags.savePointIds || []).map(Number).includes(Number(sourceId))) return true;
  if (sourceId >= 0 && sourceId < 32) return Boolean((Number(game.player?.savePointMask || game.player?.SavePoint || 0) >>> 0) & (2 ** sourceId));
  return false;
}

function registerSourceSavePoint(game, sourceId) {
  ensureFlags(game);
  game.flags.savePointIds ||= [];
  if (!game.flags.savePointIds.map(Number).includes(Number(sourceId))) game.flags.savePointIds.push(Number(sourceId));
  game.flags.savePointIds = game.flags.savePointIds.map(Number).filter((id) => Number.isFinite(id) && id >= 0).slice(0, 64);
  if (sourceId >= 0 && sourceId < 32) {
    const bit = 2 ** sourceId;
    game.player.savePointMask = (Number(game.player.savePointMask || game.player.SavePoint || 0) | bit) >>> 0;
    game.player.SavePoint = game.player.savePointMask;
  }
}

function sourceSavePointRequirement(game, npc) {
  const alternatives = Array.isArray(npc?.savePoint?.requiredAlternatives) ? npc.savePoint.requiredAlternatives : [];
  if (!alternatives.length) return { required: false, ok: true, alternative: [], summary: "" };
  const normalized = alternatives
    .map((alternative) => alternative.map((item) => ({
      ...item,
      id: Number(item.id),
      qty: Math.max(1, Number(item.qty || 1))
    })).filter((item) => Number.isFinite(item.id) && item.id > 0))
    .filter((alternative) => alternative.length);
  const summary = normalized.slice(0, 4).map((alternative) => alternative.map(sourceSavePointItemLabel).join(" + ")).join(" 或 ");
  const okAlternative = normalized.find((alternative) => alternative.every((item) => inventoryItemCount(game, item.id) >= item.qty));
  return {
    required: true,
    ok: Boolean(okAlternative),
    alternative: okAlternative || normalized[0] || [],
    alternatives: normalized,
    summary: summary || "原脚本指定道具"
  };
}

function inventoryItemCount(game, itemId) {
  return (game.inventory || [])
    .filter((item) => Number(item.id) === Number(itemId))
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function sourceSavePointItemLabel(item) {
  return `${item.name || `item ${item.id}`} x${Math.max(1, Number(item.qty || 1))}`;
}

function formatSavePointMessage(game, message = "") {
  return String(message || "")
    .replace(/%s/g, game.player?.name || "")
    .trim();
}

function warpPromptReply(game, npc) {
  if (!npc.warp?.target) return fallbackNpcReply(npc);
  const target = npc.warp.target;
  const targetMap = WORLD.maps[target.mapId];
  const targetName = targetMap?.name || `floor ${target.mapId}`;
  const permission = warpPermission(game, npc.warp);
  if (!targetMap) {
    recordNpcVmEvent(game, npc, "warp", "unsupported", { reason: "target-map-missing", target });
    return `${npc.name} 的原版脚本目标是 ${targetName} (${target.x},${target.y})，但这个 floor 尚未打包进当前 Worker 地图集。\n来源：${npc.warp.source}`;
  }
  if (!permission.ok) {
    const line = npc.warp.payMessage || npc.warp.moneyMessage || `${npc.name} 说：现在还不能传送。`;
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: permission.reason || "condition", target, condition: permission.condition });
    return `${line}\n条件：${npc.warp.free || "未满足"}\n来源：${npc.warp.source}`;
  }
  const costLine = permission.cost > 0 ? `需要 ${permission.cost} 石币。` : "当前满足免费传送条件。";
  const intro = permission.free
    ? npc.warp.freeMessage || `${npc.name} 可以送你去 ${targetName}。`
    : npc.warp.payMessage || `${npc.name} 可以送你去 ${targetName}。`;
  recordNpcVmEvent(game, npc, "window", "ok", { action: "warpPrompt", target, cost: permission.cost });
  return `${intro}\n目的地：${targetName} (${target.x},${target.y})。${costLine} 输入“传送”确认。`;
}

function warpNpcReply(game, npc) {
  if (!npc.warp?.target) return fallbackNpcReply(npc);
  const target = npc.warp.target;
  const targetMap = WORLD.maps[target.mapId];
  if (!targetMap) {
    recordNpcVmEvent(game, npc, "warp", "unsupported", { reason: "target-map-missing", target });
    return `${npc.name} 已解析到原版 WARP:${target.mapId},${target.x},${target.y}，但目标地图还没有打包进当前 Worker。`;
  }
  const permission = warpPermission(game, npc.warp);
  if (!permission.ok) {
    const line = npc.warp.payMessage || npc.warp.moneyMessage || `${npc.name}：现在还不能传送。`;
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: permission.reason || "condition", target, condition: permission.condition });
    return `${line}\n条件：${npc.warp.free || "未满足"}`;
  }
  if (permission.cost > 0 && Number(game.player.stone || 0) < permission.cost) {
    recordNpcVmEvent(game, npc, "warp", "blocked", { reason: "stone", target, cost: permission.cost });
    return npc.warp.moneyMessage || `${npc.name}：传送需要 ${permission.cost} 石币，你现在的石币不够。`;
  }
  if (permission.cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: permission.cost, reason: "warp" });
    if (!taken.ok) return npc.warp.moneyMessage || `${npc.name}：传送需要 ${permission.cost} 石币，你现在的石币不够。`;
  }
  const consumed = permission.free ? consumeWarpItems(game, npc.warp) : [];
  for (const itemName of consumed) {
    runNpcVmAction(game, npc, { type: "take", item: itemName, qty: 1, reason: "warp" });
  }
  const arrived = applyWarpTarget(game, target, npc.name);
  const elderEvent = applyWarpLastTalkElder(game, npc, npc.warp, "source-warp-setlasttalkelder");
  if (elderEvent?.ok && game.lastWarp) game.lastWarp.lastTalkElder = elderEvent.detail?.sourceId;
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "warp"), "end", "warp");
  const paid = permission.cost > 0 ? `花费 ${permission.cost} 石币，` : "";
  const ticket = consumed.length ? `消耗 ${consumed.join("、")}，` : "";
  recordNpcVmEvent(game, npc, "warp", "ok", {
    target,
    cost: permission.cost,
    consumed,
    ...(elderEvent?.detail?.sourceId > 0 ? { lastTalkElder: elderEvent.detail.sourceId, lastTalkElderOk: Boolean(elderEvent?.ok) } : {})
  });
  const elderLine = elderEvent?.ok ? `记录点标记：LASTTALKELDER=${elderEvent.detail?.sourceId}。` : "";
  return `${npc.name} 启动传送，${ticket}${paid}你来到 ${arrived.name} (${game.location.x},${game.location.y})。\n${elderLine}\n来源：gmsv npc_warpman WARP:${target.mapId},${target.x},${target.y}`.replace(/\n\n+/g, "\n");
}

function applyWarpLastTalkElder(game, actor, warp, reason) {
  const sourceId = clampInt(warp?.lastTalkElder, 0, 127, 0);
  if (sourceId <= 0) return null;
  return runNpcVmAction(game, actor, {
    type: "setLastTalkElder",
    sourceId,
    reason,
    source: warp?.source || actor?.source || ""
  });
}

function mapWarpEventActor(exit) {
  return {
    id: `mapwarp:${exit?.id || exit?.to || "unknown"}`,
    name: exit?.label || "地图传送点",
    type: "mapwarp",
    template: "npcgen_warp",
    script: "map-exit",
    source: exit?.source || ""
  };
}

function routeServicePromptReply(game, npc) {
  const state = buildRouteServiceState(game, npc);
  if (!state?.routes?.length) return fallbackNpcReply(npc);
  recordNpcVmEvent(game, npc, "window", "ok", {
    action: "routePrompt",
    routes: state.routes.length,
    source: state.source
  });
  return [
    routeServiceDefaultLine(npc),
    `路线：${state.routes.map((route) => `${route.index}.${route.name} -> ${route.targetName} (${route.target?.x ?? "?"},${route.target?.y ?? "?"})`).join("；")}`,
    state.needStone > 0 ? `费用：${state.needStone} 石币。` : "费用：免费。",
    `输入“搭乘”或“双击/对话输入目的地”即可按原路线出发。`
  ].filter(Boolean).join("\n");
}

function routeServiceReply(game, npc, text = "") {
  const route = chooseRouteServiceRoute(npc.routeService, text);
  if (!route) return routeServicePromptReply(game, npc);
  const lower = String(text || "").toLowerCase();
  if (!isRouteRideText(lower)) return routeServicePromptReply(game, npc);
  return rideRouteService(game, npc, route);
}

function routeServiceDefaultLine(npc) {
  const service = npc.routeService || {};
  const label = service.kind === "airplane-route" ? "航线" : service.kind === "bus-route" ? "客运路线" : "路线";
  const count = service.routes?.length || 0;
  return `${npc.name} 经营 ${count || 1} 条${label}。`;
}

function chooseRouteServiceRoute(service, text = "") {
  const routes = service?.routes || [];
  if (!routes.length) return null;
  const query = guideSearchText(text);
  const number = String(text || "").match(/(?:路线|路線|route)?\s*(\d+)/i);
  if (number) {
    const byIndex = routes.find((route) => Number(route.index) === Number(number[1]));
    if (byIndex) return byIndex;
  }
  const scored = routes.map((route) => {
    const targetMap = routeServiceTargetMap(route);
    const haystack = guideSearchText(`${route.name || ""} ${targetMap?.name || ""} ${route.target?.mapId || ""}`);
    let score = 0;
    if (haystack && query.includes(haystack)) score += 10;
    for (const token of guideSearchTokens(text)) {
      if (haystack.includes(token)) score += token.length;
    }
    return { route, score };
  }).sort((a, b) => b.score - a.score || Number(a.route.index || 0) - Number(b.route.index || 0));
  return scored[0]?.score > 0 ? scored[0].route : routes[0];
}

function isRouteRideText(text = "") {
  return hasAny(text, ["搭乘", "坐车", "坐車", "上车", "上車", "出发", "出發", "走吧", "去", "前往", "送我", "带我", "帶我", "ride", "go"]);
}

function rideRouteService(game, npc, route) {
  if (!route) return routeServicePromptReply(game, npc);
  const service = npc.routeService || {};
  const target = routeServiceTarget(route);
  const targetMap = target ? WORLD.maps[String(target.mapId)] : null;
  if (!target || !targetMap) {
    recordNpcVmEvent(game, npc, "routeService", "unsupported", {
      reason: "target-map-missing",
      routeIndex: route.index,
      target,
      source: service.source || ""
    });
    return `${npc.name} 的原路线终点是 floor ${target?.mapId || "?"} (${target?.x ?? "?"},${target?.y ?? "?"})，但目标地图还没打包进当前 Worker。`;
  }
  const denied = routeServiceDeniedItems(game, service);
  if (denied.length) {
    recordNpcVmEvent(game, npc, "routeService", "blocked", {
      reason: "denied-item",
      routeIndex: route.index,
      itemIds: denied.map((item) => item.id),
      source: service.source || ""
    });
    return service.messages?.deniedItem || `${npc.name}：你身上带着不能带上车/飞机的物品：${denied.map((item) => item.name).join("、")}。`;
  }
  const cost = Math.max(0, Number(service.needStone || 0) || 0);
  if (cost > 0) {
    const paid = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "routeService" });
    if (!paid.ok) {
      recordNpcVmEvent(game, npc, "routeService", "blocked", {
        reason: "stone",
        routeIndex: route.index,
        cost,
        source: service.source || ""
      });
      return service.messages?.stone || `${npc.name}：这条路线需要 ${cost} 石币，你现在不够。`;
    }
  }
  const arrived = applyWarpTarget(game, {
    ...target,
    source: `${service.source || "gmsv route"} route ${route.index}`
  }, `${npc.name} ${route.name || "路线"}`);
  runNpcVmAction(game, npc, {
    type: "routeService",
    routeIndex: route.index,
    routeName: route.name,
    target,
    cost,
    source: service.source || ""
  });
  const paidLine = cost > 0 ? `支付 ${cost} 石币，` : "";
  const endLine = service.messages?.end || "";
  return [
    service.messages?.start || `${npc.name} 按原路线让你出发。`,
    `${paidLine}你抵达 ${arrived.name} (${game.location.x},${game.location.y})。`,
    endLine,
    `来源：${service.source || npc.script || npc.source} route ${route.index}`
  ].filter(Boolean).join("\n");
}

function buildRouteServiceState(game, npc) {
  const service = npc?.routeService;
  if (!service?.routes?.length) return null;
  return {
    kind: service.kind || "route-service",
    source: service.source || "",
    needStone: Math.max(0, Number(service.needStone || 0) || 0),
    waitTime: Number(service.waitTime || 0) || 0,
    deniedItemIds: service.deniedItems || [],
    blockedItems: routeServiceDeniedItems(game, service).map((item) => ({ id: item.id, name: item.name })),
    routes: service.routes.map((route) => {
      const target = routeServiceTarget(route);
      const targetMap = target ? WORLD.maps[String(target.mapId)] : null;
      return {
        index: route.index,
        name: route.name,
        target,
        targetName: targetMap?.name || `floor ${target?.mapId || "?"}`,
        stepCount: route.stepCount || route.points?.length || 0,
        available: Boolean(targetMap)
      };
    })
  };
}

function routeServiceTarget(route) {
  if (route?.target?.mapId && WORLD.maps[String(route.target.mapId)]) return route.target;
  return (route?.points || []).slice().reverse().find((point) => point?.mapId && WORLD.maps[String(point.mapId)]) || route?.target || null;
}

function routeServiceTargetMap(route) {
  const target = routeServiceTarget(route);
  return target ? WORLD.maps[String(target.mapId)] : null;
}

function routeServiceDeniedItems(game, service) {
  const ids = new Set((service?.deniedItems || []).map(Number).filter((id) => Number.isFinite(id) && id > 0));
  if (!ids.size) return [];
  return (game.inventory || [])
    .filter((item) => ids.has(Number(item.id)) && Number(item.qty || 0) > 0)
    .map((item) => ({ id: Number(item.id), name: item.name || `item ${item.id}` }));
}

function warpPermission(game, warp) {
  const hasFreeSpec = Boolean(String(warp.free || "").trim());
  const free = warpFreeStatus(game, warp.free || "");
  const hasCostSpec = Boolean(warp.cost);
  const cost = warpCost(game, warp.cost);
  if (hasFreeSpec && free.ok) return { ok: true, free: true, cost: 0, condition: free.condition };
  if (!hasFreeSpec && cost === 0) return { ok: true, free: true, cost: 0 };
  if (hasFreeSpec && !free.ok && !hasCostSpec) return { ok: false, free: false, cost: 0, reason: free.reason, condition: free.condition };
  if (cost == null) return { ok: false, free: false, cost: 0, reason: free.reason };
  return { ok: true, free: false, cost, condition: free.condition };
}

function warpFreeStatus(game, spec) {
  const condition = characterConditionStatus(game, spec);
  return {
    ok: condition.ok,
    reason: condition.reason,
    condition
  };
}

function warpConditionMet(game, part) {
  return characterConditionMet(game, part).ok;
}

function characterConditionStatus(game, spec, options = {}) {
  const raw = String(spec || "").replace(/^(?:FREE|EVENTRUN\d*|EVENT\d*|TALKEVENT\d*|ENDEVENT\d*|CHECKPARTY)\s*[:=]\s*/i, "").trim();
  if (!raw || /^ALLFREE$/i.test(raw)) return { ok: true, reason: "", groups: [] };
  const groups = raw
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((group) => {
      const checks = group
        .split("&")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((part) => characterConditionMet(game, part, options));
      return {
        source: group,
        ok: checks.length ? checks.every((check) => check.ok) : true,
        checks
      };
    });
  if (!groups.length) return { ok: true, reason: "", groups };
  const matched = groups.find((group) => group.ok) || null;
  return {
    ok: Boolean(matched),
    reason: raw,
    matched: matched?.source || "",
    groups
  };
}

function characterConditionMet(game, part, options = {}) {
  const token = String(part || "").trim();
  if (!token) return { ok: true, token, type: "empty" };
  const level = token.match(/^(?:LV|LEVEL)\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (level) {
    const playerLevel = Number(game.player.level || 1);
    const target = Number(level[2]);
    return {
      ok: compareNumber(playerLevel, level[1], target),
      token,
      type: "level",
      actual: playerLevel,
      expected: target,
      op: level[1]
    };
  }
  const item = token.match(/^ITEM\s*(!=|=)\s*(\d+)(?:\*(\d+))?$/i);
  if (item) {
    const itemId = Number(item[2]);
    const qty = inventoryQty(game, itemId);
    const needed = Number(item[3] || 1);
    const hasItem = qty >= needed;
    return {
      ok: item[1] === "!=" ? !hasItem : hasItem,
      token,
      type: "item",
      itemId,
      itemName: conditionItemName(game, itemId),
      qty,
      needed,
      op: item[1]
    };
  }
  const event = token.match(/^(ENDEV|ENDEVENT|END|NOWEV|NOWEVENT|NEV)\s*(!=|=)\s*(\d+)$/i);
  if (event) {
    const kind = /^(NOW|NEV)/i.test(event[1]) ? "now" : "end";
    const active = eventFlagSet(game, Number(event[3]), kind);
    return {
      ok: event[2] === "!=" ? !active : active,
      token,
      type: "event",
      kind,
      shiftbit: Number(event[3]),
      actual: active,
      op: event[2]
    };
  }
  const stone = token.match(/^(?:STONE|GOLD|MONEY)\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (stone) {
    const actual = Number(game.player?.stone || 0);
    const expected = Number(stone[2]);
    return {
      ok: compareNumber(actual, stone[1], expected),
      token,
      type: "stone",
      actual,
      expected,
      op: stone[1]
    };
  }
  const remainingItem = token.match(/^reITEM\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (remainingItem) {
    const actual = Number(inventoryState(game).remaining || 0);
    const expected = Number(remainingItem[2]);
    return {
      ok: compareNumber(actual, remainingItem[1], expected),
      token,
      type: "inventorySlot",
      actual,
      expected,
      op: remainingItem[1]
    };
  }
  const sourcePet = token.match(/^PET\s*(!=|>=|<=|>|<|=)\s*(\d+)-(\d+)(?:\*(\d+))?$/i);
  if (sourcePet) {
    const spec = {
      op: sourcePet[1],
      level: Number(sourcePet[2]),
      petId: Number(sourcePet[3]),
      qty: Number(sourcePet[4] || 1),
      petName: options.petName || ""
    };
    const qty = petQtyInPartyMatching(game, spec);
    const needed = Math.max(1, Number(spec.qty || 1));
    return {
      ok: qty >= needed,
      token,
      type: "pet",
      petId: spec.petId,
      petName: conditionPetName(game, spec.petId),
      petNameRequired: options.petName || "",
      qty,
      needed,
      expected: spec.level,
      op: spec.op
    };
  }
  const petId = token.match(/^(?:PETID|PETNO)\s*(!=|=)\s*(\d+)(?:\*(\d+))?$/i);
  if (petId) {
    const petNo = Number(petId[2]);
    const qty = petQtyInParty(game, petNo);
    const needed = Number(petId[3] || 1);
    const hasPet = qty >= needed;
    return {
      ok: petId[1] === "!=" ? !hasPet : hasPet,
      token,
      type: "pet",
      petId: petNo,
      petName: conditionPetName(game, petNo),
      qty,
      needed,
      op: petId[1]
    };
  }
  const petCount = token.match(/^PETCOUNT\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (petCount) {
    const actual = (game.pets || []).length;
    const expected = Number(petCount[2]);
    return {
      ok: compareNumber(actual, petCount[1], expected),
      token,
      type: "petCount",
      actual,
      expected,
      op: petCount[1]
    };
  }
  const angelMission = token.match(/^(ANGEL|HERO)(_I)?_(NOW|OVER|OUT)\s*=\s*(\d+)$/i);
  if (angelMission) {
    const role = angelMission[1].toLowerCase();
    const status = angelMission[3].toUpperCase();
    const mission = Number(angelMission[4]);
    const requireToken = Boolean(angelMission[2]);
    return angelMissionConditionMet(game, { token, role, status, mission, requireToken });
  }
  const heroCount = token.match(/^HEROCNT\s*(>=|<=|>|<|=)\s*(\d+)$/i);
  if (heroCount) {
    const actual = Number(game.player?.heroCompleteCount ?? game.player?.HeroCnt ?? game.player?.CHAR_HEROCNT ?? 0);
    const expected = Number(heroCount[2]);
    return {
      ok: compareNumber(actual, heroCount[1], expected),
      token,
      type: "heroCount",
      actual,
      expected,
      op: heroCount[1]
    };
  }
  const numericField = token.match(/^(MANOR|CLASS|TRANS|SP)\s*(!=|>=|<=|>|<|=)\s*(\d+)$/i);
  if (numericField) {
    const field = numericField[1].toLowerCase();
    const actual = conditionNumericFieldValue(game, field);
    const expected = Number(numericField[3]);
    return {
      ok: compareNumber(actual, numericField[2], expected),
      token,
      type: field,
      actual,
      expected,
      op: numericField[2]
    };
  }
  const baseBodyImage = token.match(/^BBI\s*(!=|>=|<=|>|<|=)\s*(\d+)$/i);
  if (baseBodyImage) {
    const actual = sourceBaseBodyImageNo(game);
    const expected = Number(baseBodyImage[2]);
    return {
      ok: compareNumber(actual, baseBodyImage[1], expected),
      token,
      type: "baseBodyImage",
      actual,
      expected,
      op: baseBodyImage[1]
    };
  }
  return { ok: false, token, type: "unsupported" };
}

function compareNumber(actual, op, expected) {
  if (op === ">") return actual > expected;
  if (op === ">=") return actual >= expected;
  if (op === "<") return actual < expected;
  if (op === "<=") return actual <= expected;
  if (op === "!=") return actual !== expected;
  return actual === expected;
}

function sourceBaseBodyImageNo(game) {
  return Number(
    game?.player?.CHAR_BASEBASEIMAGENUMBER
    || game?.player?.BaseBaseImageNumber
    || game?.player?.CHAR_BASEIMAGENUMBER
    || game?.player?.BaseImageNumber
    || game?.player?.baseImageNo
    || game?.player?.imageNo
    || 0
  );
}

function eventFlagSet(game, shiftbit, kind = "end") {
  if (!shiftbit) return false;
  ensureFlags(game);
  if (game.flags.bits?.[`${kind}:${shiftbit}`]) return true;
  const field = kind === "now" ? "nowEvents" : "endEvents";
  const index = Math.floor(shiftbit / 32);
  const bit = shiftbit % 32;
  const mask = (1 << bit) >>> 0;
  return Boolean(((game.flags[field]?.[index] || 0) >>> 0) & mask);
}

function petIdInParty(game, petId) {
  return petQtyInParty(game, petId) > 0;
}

function petQtyInParty(game, petId) {
  return (game.pets || []).filter((pet) => Number(pet.PetId ?? pet.petId ?? pet.id) === Number(petId)).length;
}

function petQtyInPartyMatching(game, spec = {}) {
  const petId = Number(spec.petId);
  const level = Number(spec.level);
  const op = spec.op || "=";
  const petName = String(spec.petName || "");
  return (game.pets || []).filter((pet) => (
    Number(pet.PetId ?? pet.petId ?? pet.id) === petId &&
    compareNumber(Number(pet.Lv ?? pet.level ?? 1), op, level) &&
    sourcePetNameMatches(pet, petName)
  )).length;
}

function petIndexesInPartyMatching(game, spec = {}) {
  const indexes = [];
  const petId = Number(spec.petId);
  const level = Number(spec.level);
  const op = spec.op || "=";
  const petName = String(spec.petName || "");
  for (let index = 0; index < (game.pets || []).length; index += 1) {
    const pet = game.pets[index];
    if (Number(pet?.PetId ?? pet?.petId ?? pet?.id) !== petId) continue;
    if (!compareNumber(Number(pet.Lv ?? pet.level ?? 1), op, level)) continue;
    if (!sourcePetNameMatches(pet, petName)) continue;
    indexes.push(index);
  }
  return indexes;
}

function sourcePetNameMatches(pet, requiredName = "") {
  const expected = String(requiredName || "").trim();
  if (!expected) return true;
  const actual = String(pet?.Name ?? pet?.name ?? "").trim();
  if (!actual) return false;
  return actual === expected || guideSearchText(actual) === guideSearchText(expected);
}

function conditionPetName(game, petId) {
  const carried = (game.pets || []).find((pet) => Number(pet.PetId ?? pet.petId ?? pet.id) === Number(petId));
  if (carried?.Name) return carried.Name;
  const template = cache?.enemyBaseSet?.get(Number(petId));
  return usableReferenceName(template?.Name) ? template.Name : "";
}

function conditionItemName(game, itemId) {
  const carried = (game.inventory || []).find((item) => Number(item.id) === Number(itemId) && item.name);
  if (carried?.name) return carried.name;
  const item = cache?.itemSet?.get(Number(itemId));
  if (usableReferenceName(item?.name)) return item.name;
  return worldTradeItemIndex().get(Number(itemId))?.name || "";
}

function conditionNumericFieldValue(game, field) {
  if (field === "manor") return Number(game.player?.manorId ?? game.player?.Manor ?? game.family?.manorId ?? 0);
  if (field === "class") return Number(game.player?.classId ?? game.player?.Class ?? game.player?.professionClass ?? 0);
  if (field === "trans") return Number(game.player?.transmigration ?? game.player?.Trans ?? game.player?.trans ?? 0);
  if (field === "sp") return sourceStartPoint(game);
  return 0;
}

function angelMissionConditionMet(game, spec) {
  const state = activeAngelMission(game);
  const expectedFlag = angelMissionFlagForStatus(spec.status);
  const missionOk = state && Number(state.mission || 0) === Number(spec.mission || 0);
  const roleOk = missionOk && angelMissionRoleMatches(state, spec.role);
  const flagOk = roleOk && Number(state.flag ?? ANGEL_MISSION_FLAGS.NONE) === expectedFlag;
  const tokenOk = !spec.requireToken || angelMissionTokenOk(game, spec.role, state);
  return {
    ok: Boolean(missionOk && roleOk && flagOk && tokenOk),
    token: spec.token,
    type: "angelMission",
    role: spec.role,
    mission: Number(spec.mission || 0),
    expectedFlag,
    actualFlag: state ? Number(state.flag ?? ANGEL_MISSION_FLAGS.NONE) : ANGEL_MISSION_FLAGS.NONE,
    requireToken: Boolean(spec.requireToken),
    tokenOk,
    missionState: compactAngelMissionState(state)
  };
}

function activeAngelMission(game) {
  const state = game?.flags?.angelMission || game?.player?.angelMission || game?.characterFields?.mission?.angelMission;
  if (!state || Number(state.mission || 0) <= 0) return null;
  return state;
}

function compactAngelMissionState(state) {
  if (!state) return null;
  return {
    mission: Number(state.mission || 0),
    role: String(state.role || state.playerRole || ""),
    flag: Number(state.flag ?? ANGEL_MISSION_FLAGS.NONE),
    status: state.status || angelMissionStatusForFlag(state.flag),
    hasAngelToken: Boolean(state.hasAngelToken || state.angelToken || state.hasToken),
    hasHeroToken: Boolean(state.hasHeroToken || state.heroToken || state.hasToken)
  };
}

function angelMissionRoleMatches(state, role) {
  const actual = String(state?.role || state?.playerRole || "hero").toLowerCase();
  return actual === String(role || "").toLowerCase();
}

function angelMissionTokenOk(game, role, state) {
  const normalizedRole = String(role || "").toLowerCase();
  if (normalizedRole === "angel") {
    return Boolean(state?.hasAngelToken || state?.angelToken || state?.hasToken || inventoryQty(game, ANGEL_ITEM_ID) > 0);
  }
  return Boolean(state?.hasHeroToken || state?.heroToken || state?.hasToken || inventoryQty(game, HERO_ITEM_ID) > 0);
}

function angelMissionFlagForStatus(status) {
  const key = String(status || "").toUpperCase();
  if (key === "NOW") return ANGEL_MISSION_FLAGS.DOING;
  if (key === "OVER") return ANGEL_MISSION_FLAGS.HERO_COMPLETE;
  if (key === "OUT") return ANGEL_MISSION_FLAGS.TIMEOVER;
  return ANGEL_MISSION_FLAGS.NONE;
}

function angelMissionStatusForFlag(flag) {
  const value = Number(flag ?? ANGEL_MISSION_FLAGS.NONE);
  if (value === ANGEL_MISSION_FLAGS.DOING) return "DOING";
  if (value === ANGEL_MISSION_FLAGS.HERO_COMPLETE) return "HERO_COMPLETE";
  if (value === ANGEL_MISSION_FLAGS.TIMEOVER) return "TIMEOVER";
  if (value === ANGEL_MISSION_FLAGS.WAIT_ANSWER) return "WAIT_ANSWER";
  return "NONE";
}

function sourceStartPoint(game) {
  const mask = Number(
    game.player?.savePointMask ??
    game.player?.SavePoint ??
    game.player?.CHAR_SAVEPOINT ??
    game.characterFields?.base?.savePointMask ??
    0
  );
  if (Number.isFinite(mask) && mask > 0) {
    for (let shift = 0; shift < 4; shift += 1) {
      if (((mask >>> 0) & (1 << shift)) === (1 << shift)) return shift;
    }
  }
  const explicit = Number(
    game.player?.startPoint ??
    game.player?.StartPoint ??
    game.player?.birthPoint ??
    game.characterFields?.base?.startPoint ??
    0
  );
  return clampInt(explicit, 0, 3, 0);
}

function compactNpcWarpStatus(game, npc) {
  if (!npc?.warp?.target) return null;
  const target = npc.warp.target;
  const targetMap = WORLD.maps[target.mapId];
  const permission = warpPermission(game, npc.warp);
  const cost = Number(permission.cost || 0);
  return {
    ok: Boolean(permission.ok),
    free: Boolean(permission.free),
    affordable: cost <= Number(game.player?.stone || 0),
    cost,
    freeSpec: String(npc.warp.free || ""),
    target: {
      mapId: String(target.mapId || ""),
      x: Number(target.x || 0),
      y: Number(target.y || 0),
      mapName: targetMap?.name || "",
      loaded: Boolean(targetMap)
    },
    condition: compactConditionStatus(permission.condition),
    unmet: compactConditionUnmet(permission.condition, 5)
  };
}

function compactNpcSavePointStatus(game, npc) {
  if (!isSavePointNpc(npc)) return null;
  const sourceId = sourceSavePointId(npc);
  const requirement = sourceSavePointRequirement(game, npc);
  const born = sourceSavePointBorn(npc);
  const registered = sourceId > 0 && isSourceSavePointRegistered(game, sourceId);
  return {
    source: npc.savePoint?.source || npc.script || npc.source || "",
    sourceId,
    registered,
    born,
    required: Boolean(requirement.required),
    hasItems: Boolean(!requirement.required || requirement.ok),
    summary: requirement.summary || "",
    compensationCost: requirement.required && !requirement.ok && !registered
      ? savePointFavorCost(game, npc, requirement)
      : 0
  };
}

function compactNpcScriptStatus(game, npc) {
  const conditions = npcScriptConditionSpecs(npc)
    .slice(0, 5)
    .map((entry) => {
      const condition = characterConditionStatus(game, entry.spec, { petName: entry.petName || "" });
      return {
        kind: entry.kind,
        ok: Boolean(condition.ok),
        source: truncateText(entry.source, 180),
        condition: compactConditionStatus(condition),
        unmet: compactConditionUnmet(condition, 4)
      };
    });
  if (!conditions.length) return null;
  return {
    source: npc.scriptHints?.source || npc.script || npc.source || "",
    conditions,
    hasReadyBranch: conditions.some((condition) => condition.ok),
    hasBlockedBranch: conditions.some((condition) => !condition.ok)
  };
}

function npcScriptConditionSpecs(npc) {
  const specs = [];
  for (const event of npc?.scriptEvents || []) {
    const spec = String(event.condition || "").trim();
    if (!spec || /^LV>0$/i.test(spec)) continue;
    specs.push({
      kind: event.type || "EVENT",
      spec,
      petName: event.petName || "",
      source: event.source || npc.script || npc.source || ""
    });
  }
  if (specs.length) return specs;
  for (const line of npc?.scriptHints?.hints || []) {
    const match = String(line || "").match(/^(EVENTRUN\d*|EVENT\d*|TALKEVENT\d*|ENDEVENT\d*|CHECKPARTY)\s*[:=]\s*(.+)$/i);
    if (!match) continue;
    const spec = match[2].trim();
    if (!spec || /^LV>0$/i.test(spec)) continue;
    specs.push({
      kind: match[1].toUpperCase(),
      spec,
      source: line
    });
  }
  return specs;
}

function compactConditionStatus(condition) {
  if (!condition) return null;
  return {
    ok: Boolean(condition.ok),
    reason: truncateText(condition.reason || "", 180),
    matched: truncateText(condition.matched || "", 180),
    groups: (condition.groups || []).slice(0, 3).map((group) => ({
      ok: Boolean(group.ok),
      source: truncateText(group.source || "", 180),
      checks: (group.checks || []).slice(0, 6).map(compactConditionCheck)
    }))
  };
}

function compactConditionUnmet(condition, max = 5) {
  if (!condition || condition.ok) return [];
  const checks = [];
  for (const group of condition.groups || []) {
    for (const check of group.checks || []) {
      if (!check.ok) checks.push(compactConditionCheck(check));
      if (checks.length >= max) return checks;
    }
  }
  return checks;
}

function compactConditionCheck(check) {
  return Object.fromEntries(Object.entries({
    ok: Boolean(check.ok),
    type: check.type,
    token: truncateText(check.token, 80),
    actual: check.actual,
    expected: check.expected,
    itemId: check.itemId,
    itemName: check.itemName,
    qty: check.qty,
    needed: check.needed,
    kind: check.kind,
    shiftbit: check.shiftbit,
    petId: check.petId,
    petName: check.petName,
    petNameRequired: check.petNameRequired,
    petLevel: check.petLevel,
    mission: check.mission,
    role: check.role,
    expectedFlag: check.expectedFlag,
    actualFlag: check.actualFlag,
    requireToken: check.requireToken,
    tokenOk: check.tokenOk,
    op: check.op
  }).filter(([, value]) => value !== undefined && value !== ""));
}

function truncateText(value, max = 160) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}

function warpCost(game, cost) {
  if (!cost) return 0;
  if (cost.mode === "fixed") return Math.max(0, Number(cost.amount || 0));
  if (cost.mode === "level-multiplier") return Math.max(0, Number(game.player.level || 1) * Number(cost.amount || 0));
  return null;
}

function consumeWarpItems(game, warp) {
  if (!Array.isArray(warp.deleteItems) || !warp.deleteItems.length) return [];
  const consumed = [];
  for (const id of warp.deleteItems) {
    const item = game.inventory?.find((entry) => Number(entry.id) === Number(id) && Number(entry.qty || 0) > 0);
    if (!item) continue;
    item.qty = Number(item.qty || 0) - 1;
    consumed.push(item.name || `item ${id}`);
  }
  game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
  return consumed;
}

function inventoryQty(game, id) {
  return (game.inventory || [])
    .filter((item) => Number(item.id) === Number(id))
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function mapReply(game, npc, text = "") {
  const map = currentMap(game);
  const exits = map.exits.map((exit) => exit.label).join("、") || "暂无出口";
  recordNpcVmEvent(game, npc, "say", "ok", { topic: "map", mapId: map.id });
  const knowledge = buildStoneAgeKnowledgeContext(game, map, text, npc).entries
    .filter((entry) => ["map", "village", "world"].includes(entry.category))
    .slice(0, 2);
  const tip = knowledge.length
    ? `\n资料库提示：${knowledge.map((entry) => `${entry.title}：${entry.facts?.[0] || entry.summary || ""}`).join("；")}`
    : "";
  return `当前地图是${map.name}。出口：${exits}。${tip}`;
}

function isHealerNpc(npc) {
  return /healer/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isSavePointNpc(npc) {
  return /savepoint|save/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isSignBoardNpc(npc) {
  return /signboard/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""}`);
}

function isWarpNpc(npc) {
  return Boolean(npc.warp?.target) || /warp/i.test(`${npc.type} ${npc.template} ${npc.script}`);
}

function isRouteServiceNpc(npc) {
  return Array.isArray(npc?.routeService?.routes) && npc.routeService.routes.length > 0;
}

function isTransportNpc(npc) {
  return isRouteServiceNpc(npc) || /bus|airplane|巴士|客运|客運|长毛象|長毛象|飞机|飛機/i.test(`${npc.name || ""} ${npc.type || ""} ${npc.template || ""} ${npc.script || ""}`);
}

function npcTeleportInfoReply(game, npc, text) {
  const map = currentMap(game);
  const targetMap = chooseWorldMapFromPrompt(text);
  const directExit = targetMap ? map.exits.find((exit) => String(exit.to) === String(targetMap.id)) : chooseGuideExit(game, text);
  recordNpcVmEvent(game, npc, "say", "ok", {
    reason: "ai-teleport-info",
    targetMapId: targetMap?.id || "",
    directExitId: directExit?.id || ""
  });
  if (directExit) {
    return `${npc.name} 认真想了想：我不是传送师，不能直接把你瞬移过去。不过这张地图有「${directExit.label}」，从那里可以到 ${WORLD.maps[directExit.to]?.name || directExit.to}。你可以让右侧 AI 向导帮你瞬移，或自己走这个出口。`;
  }
  const exits = map.exits.map((exit) => exit.label).slice(0, 6).join("、") || "当前地图没有出口";
  if (targetMap) {
    return `${npc.name} 认真想了想：${targetMap.name} 确实在地图资料里，但我这个 NPC 没有传送脚本，不能直接瞬移你。当前可走出口是：${exits}。`;
  }
  return `${npc.name} 没听清你想瞬移到哪里。可以说完整地点名，例如“玛丽娜丝渔村”，也可以用右侧 AI 向导直接请求传送。当前可走出口是：${exits}。`;
}

function isNpcEnemy(npc) {
  return Boolean(npc?.npcEnemy) || /npcenemy/i.test(`${npc?.type || ""} ${npc?.template || ""}`);
}

function npcEnemyRequiresStartWindow(npc) {
  return (npc?.npcEnemy?.askBattleMessages || []).filter(Boolean).length > 0;
}

function npcEnemyAskMessage(npc) {
  const askMessages = (npc?.npcEnemy?.askBattleMessages || []).filter(Boolean);
  if (askMessages.length) return askMessages.join("\n");
  return npcDialogueLines(npc).find(Boolean)
    || "如果能赢过我的话就让你通过。要决胜负吗？";
}

function npcEnemyDeniedMessage(npc) {
  return npc?.npcEnemy?.deniedMessage || "有什么事吗？";
}

function npcEnemyStartMessage(npc) {
  return npc?.npcEnemy?.startMessage || "来吧！";
}

function npcInitialDialogMessages(game, npc) {
  if (isNpcEnemy(npc)) {
    runNpcVmAction(game, npc, {
      type: "window",
      reason: "npcenemy-start",
      windowType: "CHAR_WINDOWTYPE_NPCENEMY_START",
      buttons: "YESNO",
      source: npc.npcEnemy?.source || npc.script || npc.source || ""
    });
    return [npcMessage("npc", npcEnemyAskMessage(npc))];
  }
  return [
    npcMessage("system", "客户端点选 NPC，自动送出 P|hi。"),
    npcMessage("player", "hi"),
    npcMessage("npc", runNpcTalk(game, npc, "hi"))
  ];
}

function openNpcEnemyStartWindow(game, npc) {
  openDialog(game, npc, npcInitialDialogMessages(game, npc));
}

function eventFlagForNpcAction(npcId, action) {
  return stableFlag(`${npcId}:${action}`);
}

function fallbackNpcReply(npc) {
  if (npc.itemPoolShop) return npc.itemPoolShop.messages?.main || "这里可以寄放或取回道具。";
  if (isSignBoardNpc(npc)) return npcDialogueLines(npc).join("\n") || npcDefaultLine(npc);
  if (isPetFusionNpc(npc)) return npc.petFusion?.messages?.start || "这里可以进行宠物融合。";
  if (isProfessionShopNpc(npc)) return professionShopDefaultLine(npc);
  if (isRaceManNpc(npc)) return raceManDefaultLine(npc);
  return npcDialogueLines(npc)[0] || npcDefaultLine(npc);
}

function isProfessionShopNpc(npc) {
  return Boolean(npc?.professionShop?.skills?.length)
    || /ProfessionShop|Profession/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""} ${npc?.source || ""}`);
}

function isProfessionShopRequestText(text = "") {
  return hasAny(text, ["职业", "職業", "转职", "轉職", "技能", "学习", "學習", "学技能", "學技能", "训练", "訓練", "修行", "profession"]);
}

function professionShopDefaultLine(npc) {
  const shop = npc?.professionShop || {};
  return shop.mainMessage || shop.startMessage || `这里可以学习${shop.className ? `${shop.className}的` : ""}职业技能。`;
}

function professionShopReply(game, npc, text = "") {
  const state = buildProfessionShopState(game, npc);
  if (!state) {
    recordNpcVmEvent(game, npc, "professionShop", "unsupported", { reason: "missing-profession-shop", text: String(text || "").slice(0, 80) });
    return "这里暂时没有可解析的职业技能资料。";
  }
  recordNpcVmEvent(game, npc, "professionShop", "ok", {
    action: "window",
    classId: state.classId,
    className: state.className,
    minTrans: state.minTrans,
    skills: state.skills.map((skill) => skill.id).slice(0, 10),
    text: String(text || "").slice(0, 80),
    source: state.source
  });
  const learnable = state.skills.filter((skill) => skill.learnable).slice(0, 5);
  const blocked = state.skills.find((skill) => !skill.learnable);
  const classLine = `你的职业：${state.player.professionClassName}，转生 ${state.player.transmigration}，职业技能点 ${state.player.professionSkillPoint}。`;
  const skillLine = learnable.length
    ? `现在可学：${learnable.map((skill) => `${skill.name} ${skill.cost}石币`).join("、")}。`
    : `暂时没有可学技能${blocked?.blockedReason ? `：${blocked.blockedReason}` : ""}。`;
  const sourceLine = state.source ? `来源：${state.source}` : "";
  return [
    professionShopDefaultLine(npc),
    `训练方向：${state.className}${state.minTrans ? `，需要转生 ${state.minTrans}+` : ""}。`,
    classLine,
    skillLine,
    "在下方职业技能窗口选择技能后，Worker 会按原版职业、转生、技能点、前置技能和石币条件校验。",
    sourceLine
  ].filter(Boolean).join("\n");
}

function isRaceManNpc(npc) {
  return Boolean(npc?.raceMan) || /npc_raceman|raceman/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""} ${npc?.source || ""}`);
}

function isRaceManRequestText(text = "") {
  return hasAny(text, ["竞赛", "競賽", "比赛", "比賽", "报名", "報名", "参加", "參加", "登记", "登記", "规则", "規則", "名次", "排名", "奖励", "獎勵", "资格", "資格", "卡片", "赛程", "賽程", "race"]);
}

function raceManDefaultLine(npc) {
  const race = npc?.raceMan || {};
  const messages = race.messages || {};
  return messages.subject || messages.card || messages.caution || "这里是竞赛登记窗口。";
}

function raceManReply(game, npc, text = "") {
  const state = buildRaceManState(game, npc);
  if (!state) {
    recordNpcVmEvent(game, npc, "raceMan", "unsupported", { reason: "missing-race-metadata" });
    return raceManDefaultLine(npc);
  }
  recordNpcVmEvent(game, npc, "raceMan", "ok", {
    reason: "source-race-summary",
    gameMode: state.gameMode,
    gameCode: state.gameCode,
    modes: state.modes.map((item) => item.code).slice(0, 5),
    missing: state.eligibility.missing.map((item) => item.kind),
    source: state.source,
    text: String(text || "").slice(0, 80)
  });
  const lines = [
    raceManDefaultLine(npc),
    raceManRequirementLine(state),
    raceManModeLine(state),
    raceManRewardLine(state),
    state.eligibility.ok ? "你现在的条件看起来可以继续询问报名；真正报名和赛程结算还需要接入对应源码流程。" : `现在还缺：${state.eligibility.missing.map((item) => item.text).join("、")}。`,
    state.messages.caution,
    `来源：${state.source || npc.script || npc.source || "gmsv race arg"}`
  ].filter(Boolean);
  return lines.join("\n");
}

function buildRaceManState(game, npc) {
  const race = npc?.raceMan;
  if (!race) return null;
  const state = {
    kind: race.kind || "race-man",
    source: race.source || npc.script || npc.source || "",
    gameMode: Number(race.gameMode || 0) || 0,
    gameCode: race.gameCode || "",
    hasGame: Number(race.hasGame || 0) || 0,
    modes: (race.modes || []).slice(0, 5),
    history: (race.history || []).slice(0, 5),
    rankNum: Number(race.rankNum || 0) || 0,
    lowLevel: Number(race.lowLevel || 0) || 0,
    fornewLv: Number(race.fornewLv || 0) || 0,
    fornewTran: race.fornewTran || "",
    delFlag: race.delFlag || "",
    endFlag: race.endFlag || "",
    requiredItem: race.requiredItem || null,
    rewardItem: race.rewardItem || null,
    requiredPetId: Number(race.requiredPetId || 0) || 0,
    petLevel: Number(race.petLevel || 0) || 0,
    rewards: race.rewards || {},
    messages: race.messages || {}
  };
  return {
    ...state,
    eligibility: raceManEligibility(game, state)
  };
}

function raceManEligibility(game, race) {
  const missing = [];
  if (race.requiredItem?.id && inventoryQty(game, race.requiredItem.id) <= 0) {
    missing.push({ kind: "item", text: `${raceItemLabel(race.requiredItem)} x1` });
  }
  if (race.requiredPetId) {
    const pet = (game.pets || []).find((item) => Number(item.PetId || item.id || item.petId || item.enemyId || 0) === Number(race.requiredPetId));
    if (!pet) missing.push({ kind: "pet", text: `指定宠物 ${race.requiredPetId}` });
    else if (race.petLevel && Number(pet.Lv || pet.level || 0) < race.petLevel) missing.push({ kind: "petLevel", text: `${pet.Name || pet.name || `宠物 ${race.requiredPetId}`} Lv.${race.petLevel}` });
  }
  if (race.lowLevel && Number(game.player?.level || game.player?.Lv || 1) < race.lowLevel) {
    missing.push({ kind: "level", text: `人物等级 ${race.lowLevel}` });
  }
  return { ok: missing.length === 0, missing };
}

function raceManRequirementLine(state) {
  const parts = [];
  if (state.requiredItem) parts.push(`报名道具：${raceItemLabel(state.requiredItem)} x1`);
  if (state.rewardItem) parts.push(`报名卡/回执：${raceItemLabel(state.rewardItem)} x1`);
  if (state.requiredPetId) parts.push(`宠物条件：${state.requiredPetId}${state.petLevel ? ` Lv.${state.petLevel}+` : ""}`);
  if (state.lowLevel) parts.push(`最低等级：${state.lowLevel}`);
  if (state.rankNum) parts.push(`排名记录：前 ${state.rankNum}`);
  return parts.length ? parts.join("；") : "";
}

function raceManModeLine(state) {
  const parts = [];
  if (state.gameMode) parts.push(`赛制 ${state.gameMode}`);
  if (state.gameCode) parts.push(`赛程 ${state.gameCode}`);
  if (state.modes.length) parts.push(`当前赛程 ${state.modes.length} 条`);
  if (state.history.length) parts.push(`历史记录 ${state.history.length} 条`);
  return parts.length ? `赛程资料：${parts.join("；")}` : "";
}

function raceManRewardLine(state) {
  const lines = [];
  const first = raceRewardNames(state.rewards.first);
  const second = raceRewardNames(state.rewards.second);
  const third = raceRewardNames(state.rewards.third);
  const normal = raceRewardNames(state.rewards.normal, 4);
  if (first) lines.push(`第一名 ${first}`);
  if (second) lines.push(`第二名 ${second}`);
  if (third) lines.push(`第三名 ${third}`);
  if (normal) lines.push(`普通奖励 ${normal}`);
  return lines.length ? `奖励：${lines.join("；")}` : "";
}

function raceRewardNames(items = [], limit = 3) {
  const names = (items || []).map(raceItemLabel).filter(Boolean).slice(0, limit);
  return names.length ? `${names.join("、")}${items.length > limit ? " 等" : ""}` : "";
}

function raceItemLabel(item) {
  if (!item) return "";
  return item.name || item.secretName || `道具 ${item.id || "?"}`;
}

function isNewNpcManNpc(npc) {
  return Boolean(npc?.newNpcMan)
    || /npc_newnpcman|NPC_NewNpcMan/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""} ${npc?.source || ""}`);
}

function isNewNpcManRequestText(text = "") {
  const raw = String(text || "").toLowerCase();
  const compact = guideSearchText(raw);
  return hasAny(raw, ["appearance", "metamo"])
    || hasAny(compact, ["确认造型", "確認造型", "确定造型", "確定造型", "人物造型", "恢复造型", "恢復造型", "恢复人物", "恢復人物", "变回", "變回", "外观", "外觀", "造型"]);
}

function isNewNpcManConfirmText(text = "") {
  const raw = String(text || "").trim().toLowerCase();
  const compact = guideSearchText(raw);
  return /^(y|yes|ok|okay|confirm)$/i.test(raw)
    || ["是", "是的", "确定", "確定", "确认", "確認", "好", "好的", "可以"].includes(compact)
    || hasAny(compact, ["确认造型", "確認造型", "确定造型", "確定造型", "恢复造型", "恢復造型", "恢复人物", "恢復人物", "变回", "變回"]);
}

function newNpcManDefaultLine(npc) {
  return npc?.newNpcMan?.messages?.start || "这里可以确认人物造型。";
}

function newNpcManPromptReply(game, npc) {
  runNpcVmAction(game, npc, {
    type: "window",
    windowType: "NPC_PROGRAMEGINEER_START",
    buttons: "YESNO",
    source: npc.newNpcMan?.source || npc.script || npc.source || "",
    reason: "source-newnpcman-start"
  });
  recordNpcVmEvent(game, npc, "say", "ok", {
    reason: "source-newnpcman-prompt",
    source: npc.newNpcMan?.source || npc.script || npc.source || ""
  });
  const lines = [newNpcManDefaultLine(npc)];
  const check = npc?.newNpcMan?.messages?.check;
  if (check) lines.push(check);
  lines.push("如果要按原脚本确认当前人物造型，请输入“确认造型”；没有变身时不会凭空改造型。");
  return lines.join("\n");
}

function newNpcManReply(game, npc, text = "") {
  if (!isNewNpcManConfirmText(text)) return newNpcManPromptReply(game, npc);
  const faceImageNo = sourceNewNpcManFaceImageNo(game);
  const imageNo = sourceNewNpcManRestoreImageNo(game, faceImageNo);
  const event = runNpcVmAction(game, npc, {
    type: "appearance",
    imageNo,
    faceImageNo,
    force: true,
    mode: "source-newnpcman-check-msg",
    reason: "source-newnpcman-confirm",
    source: npc.newNpcMan?.source || npc.script || npc.source || "",
    checkMessage: npc.newNpcMan?.messages?.check || ""
  });
  if (!event.ok) return `${npc.name}：${event.error || "无法确认人物造型"}。`;
  const check = npc?.newNpcMan?.messages?.check || "确定是这个人物造型吗？";
  return `${check}\n${npc.name}：已经按原版工程人员流程确认人物造型，当前图像 ${imageNo}。`;
}

function sourceNewNpcManFaceImageNo(game) {
  return Number(
    game.player?.CHAR_FACEIMAGENUMBER
    || game.player?.FaceImageNumber
    || game.player?.faceImageNumber
    || 0
  );
}

function sourceNewNpcManRestoreImageNo(game, faceImageNo = 0) {
  const face = Number(faceImageNo || 0);
  if (Number.isFinite(face) && face > 0) {
    for (let index = 0; index < 48; index += 1) {
      const start = 30000 + index * 25;
      const end = 30024 + index * 25;
      if (face >= start && face < end) return 100000 + index * 5;
    }
  }
  return Number(
    game.effects?.metamo?.originalImageNo
    || game.player?.CHAR_BASEBASEIMAGENUMBER
    || game.player?.BaseBaseImageNumber
    || game.player?.CHAR_BASEIMAGENUMBER
    || game.player?.BaseImageNumber
    || 100000
  );
}

function buildNewNpcManState(game, npc) {
  if (!isNewNpcManNpc(npc)) return null;
  return {
    kind: "new-npc-man",
    source: npc.newNpcMan?.source || npc.script || npc.source || "",
    messages: npc.newNpcMan?.messages || {},
    appearanceRestore: true,
    player: {
      imageNo: Number(game?.player?.CHAR_BASEIMAGENUMBER || game?.player?.BaseImageNumber || 0),
      baseImageNo: Number(game?.player?.CHAR_BASEBASEIMAGENUMBER || game?.player?.BaseBaseImageNumber || 0),
      faceImageNo: sourceNewNpcManFaceImageNo(game || {}),
      metamoUntil: Number(game?.effects?.metamo?.until || game?.effects?.metamoUntil || 0)
    }
  };
}

function isPetFusionNpc(npc) {
  return Boolean(npc?.petFusion) || /npc_petfusion|petfusion/i.test(`${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""} ${npc?.source || ""}`);
}

function petFusionReply(game, npc, text = "") {
  const state = buildPetFusionState(game, npc);
  recordNpcVmEvent(game, npc, "petFusion", state ? "ok" : "unsupported", {
    source: state?.source || npc.petFusion?.source || "",
    eggEnemyIds: state?.eggs?.map((egg) => egg.enemyId).slice(0, 6) || [],
    carryPets: state?.pets?.length || 0,
    conditionOk: Boolean(state?.condition?.ok ?? true),
    text: String(text || "").slice(0, 80)
  });
  if (!state) return `${npc.name} 没有可解析的宠物融合资料。`;
  const start = state.messages.start || "这里可以帮你进行宠物融合。";
  const select = state.messages.select || "请选择主宠和副宠。";
  const eggText = state.eggs.length
    ? state.eggs.map(petFusionEggLabel).join("、")
    : "这里暂时没有可生成的宠物蛋";
  const petText = state.pets.length >= 2
    ? `可用于融合的随身宠物：${state.pets.slice(0, 5).map((pet) => `${pet.name} Lv.${pet.level}`).join("、")}。`
    : "原版需要选择主宠和副宠；你现在随身可用宠物不足。";
  const conditionText = state.condition?.ok
    ? ""
    : `脚本条件还不满足：${state.condition.reason || state.free || "FREE 条件未通过"}。`;
  return [
    start,
    select,
    petText,
    `成功后可能生成：${eggText}。`,
    conditionText,
    "在下方融合窗口选择主宠和副宠后，Worker 会按原版条件扣除宠物并生成宠物蛋。"
  ].filter(Boolean).join("\n");
}

function buildPetFusionState(game, npc) {
  const fusion = npc?.petFusion;
  if (!fusion) return null;
  const free = String(fusion.free || "").trim();
  const condition = free ? characterConditionStatus(game, free) : { ok: true, reason: "", groups: [] };
  return {
    kind: fusion.kind || "pet-fusion",
    source: fusion.source || npc.script || npc.source || "",
    free,
    messages: fusion.messages || {},
    condition,
    eggs: (fusion.eggs || []).map((egg) => ({
      enemyId: Number(egg.enemyId || 0),
      name: egg.name || `宠物蛋 ${Number(egg.enemyId || 0)}`,
      tempNo: Number(egg.tempNo || 0),
      levelMin: Number(egg.levelMin || 1),
      levelMax: Number(egg.levelMax || egg.levelMin || 1)
    })),
    pets: (game.pets || []).map((pet, index) => ({
      index,
      name: pet.Name || pet.name || `宠物 ${index + 1}`,
      level: Number(pet.Lv || pet.level || 1),
      hp: Number(pet.Hp || 0),
      maxHp: Number(pet.WorkMaxHp || pet.MaxHp || pet.Hp || 0),
      petId: Number(pet.PetId || pet.petId || 0),
      image: Number(pet.ImgNo || pet.BaseImageNumber || 0)
    }))
  };
}

function petFusionEggLabel(egg) {
  if (!egg) return "";
  return egg.name || "宠物蛋";
}

function tradeReply(game, npc) {
  const items = availableTradeItems(game, npc).slice(0, 8);
  const sellItems = sellableInventoryItems(game, npc).filter((item) => item.sellable).slice(0, 4);
  const discount = shopDiscountForNpc(game, npc);
  recordNpcVmEvent(game, npc, "shop", items.length ? "ok" : "unsupported", { items: items.length, sellItems: sellItems.length, source: npc.trade?.source || "", discountPercent: discount?.percent || 0, sellRate: tradeSellRate(npc) });
  if (!items.length) return `${npc.name} 没有可解析的商品清单。`;
  const priceText = (item) => {
    const price = discountedShopPrice(game, npc, item);
    const sourcePrice = Number(item.price || item.cost || 0);
    const base = discount && price < sourcePrice ? `${sourcePrice}->${price}石币` : `${price}石币`;
    const costPoint = tradeItemCostPoint(item, npc);
    const costFame = tradeItemCostFame(item, npc);
    const point = costPoint > 0 ? `+${sourcePointDisplay(costPoint)}` : "";
    const fame = costFame > 0 ? `+${sourceFameDisplay(costFame)}` : "";
    return `${base}${point}${fame}`;
  };
  return [
    npc.trade.mainMessage || "欢迎光临！",
    npc.trade.noteMessage || "",
    `可购买：${items.map((item) => `${item.name}(${priceText(item)})`).join("、")}`,
    sellItems.length ? `可卖出：${sellItems.map((item) => `${item.name}(${item.sellPrice}石币)`).join("、")}` : "背包里暂时没有可出售道具。",
    discount ? `这次 AI 协商优待：${discount.percent}% 折扣，临时有效。` : "",
    `商品来源：${npc.trade.source}`
  ].filter(Boolean).join("\n");
}

function petShopReply(game, npc) {
  const state = buildPetShopState(game, npc);
  const pets = state?.pets || [];
  const pooledPets = state?.pooledPets || [];
  recordNpcVmEvent(game, npc, "petShop", state ? "ok" : "unsupported", {
    carry: pets.length,
    pool: pooledPets.length,
    poolEnabled: Boolean(state?.poolEnabled),
    source: state?.source || npc.petShop?.source || ""
  });
  if (!state) return `${npc.name} 没有可解析的宠物店资料。`;
  const carryText = pets.length
    ? pets.slice(0, 5).map((pet) => `${pet.name} Lv.${pet.level}(${pet.cost}石币)`).join("、")
    : "没有随身宠物";
  const poolText = state.poolEnabled
    ? (pooledPets.length
      ? `寄放中：${pooledPets.slice(0, 5).map((pet) => `${pet.name} Lv.${pet.level}`).join("、")}`
      : `寄放栏空着，可以寄放宠物；随身宠物至少要保留 1 只。`)
    : "这间宠物店只处理出售，不开放寄放栏。";
  const help = state.poolEnabled
    ? "下面可以点“寄”把宠物寄放、点“取”领回，或点“卖”出售。费用会按宠物等级、稀有度和你的魅力计算。"
    : "下面可以点“卖”出售宠物，价格会按宠物等级、稀有度和你的魅力计算。";
  return [
    state.messages?.main || "欢迎来到宠物店。",
    `随身宠物 ${state.carry.used}/${state.carry.capacity}：${carryText}`,
    `${poolText}`,
    help
  ].filter(Boolean).join("\n");
}

function itemPoolShopReply(game, npc) {
  const state = buildItemPoolShopState(game, npc);
  const items = state?.items || [];
  const pooledItems = state?.pooledItems || [];
  recordNpcVmEvent(game, npc, "itemPoolShop", state ? "ok" : "unsupported", {
    carry: items.length,
    pool: pooledItems.length,
    cost: Number(state?.cost || 0),
    source: state?.source || npc.itemPoolShop?.source || ""
  });
  if (!state) return `${npc.name} 没有可解析的道具寄放资料。`;
  const carryText = items.length
    ? items.slice(0, 6).map((item) => `${item.name} x${item.qty}`).join("、")
    : "背包里没有可寄放道具";
  const poolText = pooledItems.length
    ? pooledItems.slice(0, 6).map((item) => `${item.name} x${item.qty}`).join("、")
    : "寄放栏空着";
  return [
    state.messages?.main || "欢迎光临。",
    `随身道具 ${state.inventory.used}/${state.inventory.capacity}：${carryText}`,
    `寄放栏 ${state.pool.used}/${state.pool.capacity}：${poolText}`,
    `下面可以点“寄”存 1 个道具、点“取”领回。寄放费用 ${Number(state.cost || 0)} 石币。`
  ].filter(Boolean).join("\n");
}

function itemChangePromptReply(game, npc) {
  const state = buildItemChangeState(game, npc);
  const recipes = state?.recipes || [];
  recordNpcVmEvent(game, npc, "itemChange", recipes.length ? "ok" : "unsupported", {
    recipes: recipes.length,
    source: state?.source || npc.itemChange?.source || ""
  });
  if (!recipes.length) return `${npc.name} 没有可解析的加工清单。`;
  const ready = recipes.filter((recipe) => recipe.canChange).slice(0, 4);
  const preview = (ready.length ? ready : recipes.slice(0, 4))
    .map((recipe) => {
      const result = (recipe.addItems || []).map((item) => `${item.name} x${Number(item.qty || 1)}`).join("、") || recipe.changeItemName;
      const cost = Number(recipe.delGold || 0) > 0 ? `，${Number(recipe.delGold || 0)}石币` : "";
      return `${result}${cost}`;
    })
    .join("；");
  const head = state.menuHead || state.startMessage || "可以加工这些东西：";
  const readiness = ready.length ? `当前可做：${ready.length} 项。` : "材料还不齐，可以先看下面清单。";
  return `${head}\n${preview}\n${readiness}`;
}

function sourceReply(game, npc) {
  const debug = npcDebugInfo(npc);
  recordNpcVmEvent(game, npc, "debug", "ok", { actions: debug.actions });
  return [
    `来源：${debug.source || "未配置"}`,
    `脚本：${debug.script || "未配置"}；template：${debug.template || "未配置"}；type：${debug.type || "未配置"}`,
    `动作：${debug.actions.length ? debug.actions.join("、") : "未归类"}`
  ].join("\n");
}

async function aiNpcReply(env, request, game, npc, text) {
  const socialChanged = recordNpcSocialFromMessage(game, npc, text);
  const action = inferNpcAiAction(game, npc, text);
  if (action?.type === "teleportInfo") return applyNpcAiAction(game, npc, action);
  if (action) return npcAiActionProposalReply(game, npc, action);

  const map = currentMap(game);
  const debug = npcDebugInfo(npc, game);
  const persona = buildNpcPersona(game, npc, map);
  const scriptReferences = await npcScriptReferenceContext(env, request, game, npc, text);
  const referenceReply = npcReferenceQuestionReply(game, npc, text, scriptReferences);
  if (referenceReply) {
    recordNpcVmEvent(game, npc, "say", "ok", { reason: "npc-reference-context", ids: scriptReferences.queryIds });
    return referenceReply;
  }
  const compactScriptReferences = compactNpcScriptReferences(scriptReferences);
  const social = compactNpcSocialForPrompt(game, npc);
  const knowledge = buildStoneAgeKnowledgeContext(game, map, text, npc);
  const remoteRuntime = aiNpcRemoteRuntime(env);
  const remoteCacheKey = remoteRuntime.cacheable && !socialChanged
    ? buildAiNpcCacheKey(game, npc, text, map, debug, compactScriptReferences, remoteRuntime, persona, social)
    : "";
  const cachedReply = remoteCacheKey ? readAiNpcCache(game, remoteCacheKey) : null;
  if (cachedReply) {
    recordNpcVmEvent(game, npc, "say", "ok", {
      reason: "ai-npc-cache",
      provider: cachedReply.provider,
      model: cachedReply.model,
      intent: cachedReply.intent,
      hits: cachedReply.hits
    });
    return cachedReply.reply;
  }
  if (hasOpenAi(env)) {
    try {
      const rsp = await callOpenAiNpc(env, game, npc, text, map, debug, compactScriptReferences, persona, social);
      const proposed = openAiNpcAction(game, npc, rsp.decision, text);
      if (proposed) return openAiNpcActionReply(game, npc, proposed, rsp.decision);
      if (rsp.decision?.reply) {
        if (isPureOpenAiNpcReply(rsp.decision)) {
          writeAiNpcCache(game, remoteCacheKey, rsp.decision.reply, remoteRuntime, rsp.decision.intent);
        }
        recordNpcVmEvent(game, npc, "say", "ok", { reason: "openai-npc", model: rsp.model, intent: rsp.decision.intent });
        return rsp.decision.reply;
      }
    } catch (error) {
      recordNpcVmEvent(game, npc, "say", "blocked", { reason: "openai-npc-error", error: error?.message || "OpenAI failed" });
    }
  }
  const messages = [
    { role: "system", content: "你是石器时代单人 PWA 里的 NPC。必须保持 persona 里的当前身份、职业和原 gmsv 脚本线索，只根据 JSON 回答。social 是这个 NPC 对玩家的轻量关系记忆，只能影响称呼和语气，不能绕过规则。knowledge 是从石器时代资料库压缩出的相关条目，只能用来补充专业背景，不能把索引编成完整流程。workspace.memory 是 Worker 保存的受限记忆，只能当线索。中文，1-2 句。你可以商量信息、优惠或帮助，但不能直接执行状态变化；所有交易、传送、奖励、flag、避敌效果和战斗都必须由 Worker 的确定性 NPC VM 校验执行。不要编造与你身份不符的物品、地点或任务。" },
    { role: "user", content: JSON.stringify({
      persona,
      social,
      npc: {
        id: npc.id,
        name: npc.name,
        type: npc.type,
        dialogue: npc.dialogue,
        source: npc.source,
        script: npc.script,
        actions: debug.actions,
        questIds: npcQuestIds(npc),
        questLead: npc.questLead || null,
        scriptHints: compactNpcHints(npc),
        scriptReferences: compactScriptReferences,
        trade: npc.trade ? { items: npc.trade.items?.slice(0, 8).map((item) => item.name) || [], source: npc.trade.source } : null,
        warp: npc.warp || null,
        raceMan: buildRaceManState(game, npc),
        routeService: buildRouteServiceState(game, npc),
        savePoint: compactNpcSavePointStatus(game, npc),
        warpStatus: npc.warpStatus || compactNpcWarpStatus(game, npc),
        scriptStatus: npc.scriptStatus || compactNpcScriptStatus(game, npc)
      },
      proposal: compactPendingNpcProposalForPrompt(game, npc),
      vm: { allowedActions: debug.allowedActions, recentTrace: compactNpcVmTrace(debug) },
      player: compactPlayerContext(game),
      characterFields: compactCharacterFields(game),
      map: {
        id: map.id,
        name: map.name,
        position: [game.location.x, game.location.y],
        exits: map.exits.map((exit) => ({ label: exit.label, to: exit.to, targetMapName: WORLD.maps[exit.to]?.name || "", distance: distanceToExit(exit, game.location.x, game.location.y) })).slice(0, 12),
        nearbyNpcs: nearbyState(game, map).npcs
      },
      knowledge,
      workspace: compactAiWorkspaceMemory(game),
      quests: responseQuestState(game),
      sourceTasks: sourceScriptTaskState(game),
      pets: game.pets.map(petSummary),
      inventory: inventoryState(game),
      effects: game.effects || {},
      text
    }) }
  ];
  if (env.AI && typeof env.AI.run === "function") {
    const model = env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct";
    try {
      const rsp = await env.AI.run(model, { messages });
      const reply = rsp.response || rsp.text || localNpcAiFallback(game, npc, text);
      writeAiNpcCache(game, remoteCacheKey, reply, remoteRuntime, "chat");
      recordNpcVmEvent(game, npc, "say", "ok", { reason: "ai-npc", model });
      return reply;
    } catch (error) {
      recordNpcVmEvent(game, npc, "say", "blocked", { reason: "ai-npc-error", error: error?.message || "AI binding failed" });
      return localNpcAiFallback(game, npc, text, error);
    }
  }
  recordNpcVmEvent(game, npc, "say", "ok", { reason: "ai-npc-local" });
  return localNpcAiFallback(game, npc, text);
}

async function callOpenAiNpc(env, game, npc, text, map, debug, scriptReferences, persona = null, social = null) {
  const role = npcActionProfile(npc);
  const context = {
    persona: persona || buildNpcPersona(game, npc, map),
    social: social || compactNpcSocialForPrompt(game, npc),
    npc: {
      id: npc.id,
      name: npc.name,
      type: npc.type,
      dialogue: npc.dialogue,
      source: npc.source,
      script: npc.script,
      template: npc.template,
      actions: debug.actions,
      allowedActions: debug.allowedActions,
      questIds: npcQuestIds(npc),
      questLead: npc.questLead || null,
      scriptHints: compactNpcHints(npc),
      scriptReferences,
      trade: npc.trade ? {
        items: npc.trade.items?.slice(0, 12).map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          price: item.price || item.cost || 0,
          costFame: tradeItemCostFame(item, npc),
          costPoint: tradeItemCostPoint(item, npc),
          source: item.source
        })) || [],
        source: npc.trade.source
      } : null,
      warp: npc.warp || null,
      raceMan: buildRaceManState(game, npc),
      routeService: buildRouteServiceState(game, npc),
      savePoint: compactNpcSavePointStatus(game, npc),
      warpStatus: npc.warpStatus || compactNpcWarpStatus(game, npc),
      scriptStatus: npc.scriptStatus || compactNpcScriptStatus(game, npc),
      roleProfile: role,
      canDirectlyMutate: false
    },
    player: compactPlayerContext(game),
    characterFields: compactCharacterFields(game),
    location: {
      mapId: map.id,
      floorId: map.floorId,
      name: map.name,
      position: [game.location.x, game.location.y],
      canWildEncounter: map.canWildEncounter,
      wildEncounterReason: map.wildEncounterReason
    },
    map: {
      exits: map.exits.map((exit) => ({
        label: exit.label,
        to: exit.to,
        targetMapName: WORLD.maps[exit.to]?.name || "",
        distance: distanceToExit(exit, game.location.x, game.location.y)
      })).slice(0, 12),
      nearbyNpcs: nearbyState(game, map).npcs
    },
    quests: responseQuestState(game),
    sourceTasks: sourceScriptTaskState(game),
    pets: game.pets.map(petSummary),
    inventory: inventoryState(game),
    effects: guideEffectSummary(game),
    pendingProposal: compactPendingNpcProposalForPrompt(game, npc),
    knowledge: buildStoneAgeKnowledgeContext(game, map, text, npc),
    workspace: compactAiWorkspaceMemory(game),
    recentConversation: npcOpenAiHistory(game, npc),
    vmTrace: compactNpcVmTrace(debug),
    userText: text
  };
  const system = [
    "你正在扮演石器时代单人网页版里的当前 NPC，不是旁白，也不是万能 GM。",
    "必须保持 NPC 的姓名、职业、地图、脚本来源和行为范围；只能根据 JSON 上下文说话。",
    "persona 是 Worker 从原版脚本、模板、图号、台词、地图和动作推断的人设；social 是这个 NPC 对玩家的轻量关系记忆，最多只带 3 条。可用它调整称呼、语气和是否谨慎，但不能让性别或好感绕过 VM 规则。",
    "NPC 可以解释任务、地图、交易、传送和战斗线索；如果 context.quests/sourceTasks 里有 guidance，要优先按这些行动清单回答下一步；也可以在自己力所能及的角色范围内提出帮助、优待或交涉意图，但不能直接改状态。",
    "knowledge 是从石器时代资料库压缩检索出的相关条目；只引用和玩家问题、当前地图或当前 NPC 相关的条目，不要把索引扩写成不存在的完整攻略。",
    "workspace.memory 是 Worker 保存的受限记忆，只能当线索；和当前状态冲突时以当前地图、背包、任务、flag 为准。",
    "所有交易、传送、奖励、flag、避敌、开战、折扣、赠品和角色帮助都必须交给 Worker 的 NPC VM 校验执行。",
    "只允许提出 action.type 中列出的动作；roleFavor 表示护士急救、守卫通融、店主额外照顾等角色内帮助，可能需要报酬，也可能被 VM 按概率拒绝。",
    "如果动作不符合 NPC 身份，type 必须是 none 或 teleportInfo，并在 reply 里自然拒绝。",
    "商店只能围绕自己的商品类别和 gmsv/itemset 资料谈额外物品；护士/治疗师只能谈治疗、伤势和少量急救恢复品；守门/敌人 NPC 可被贿赂、威胁或说服，但是否通过由 VM 决定。",
    "记录点 NPC 可以解释原脚本道具需求；如果玩家明确提出付钱、报酬或请求通融，可提出 roleFavor，让 Worker 按 savepoint Born 和石币补偿校验是否记录。",
    "脚本里出现数字 id 时，必须先查看 scriptReferences，把它解释成道具、宠物、敌人或地图名；不要把裸编号当成最终答案。解析不到时要说资料里暂时找不到，不能假装知道。",
    "中文，1-3 句，像 NPC 在游戏里说话；不要输出调试字段。"
  ].join("\n");
  const { json: decision, model } = await callOpenAiStructured(env, {
    name: "stoneage_npc_reply",
    schema: OPENAI_NPC_SCHEMA,
    system,
    user: JSON.stringify(context),
    maxOutputTokens: 650
  });
  return { decision, model };
}

async function npcScriptReferenceContext(env, request, game, npc, text) {
  const extracted = extractNpcReferenceIds(npc, text);
  const ids = [...extracted.keys()].slice(0, 18);
  const empty = {
    queryIds: [],
    ids: [],
    resolved: [],
    unresolved: [],
    byId: {},
    hintLines: npc.scriptHints?.hints?.slice(0, 8) || []
  };
  if (!ids.length) return empty;
  let data = null;
  try {
    data = await loadGameData(env, request);
  } catch {
    data = null;
  }
  const tradeIndex = worldTradeItemIndex();
  const resolved = [];
  const unresolved = [];
  const byId = {};
  for (const key of ids) {
    const usage = extracted.get(key);
    const id = Number(key);
    const matches = resolveNpcReferenceId(id, usage, data, game, tradeIndex);
    const preferred = pickPreferredReference(matches, usage);
    const entry = {
      id,
      fromUser: Boolean(usage.fromUser),
      uses: [...usage.uses],
      useLabels: referenceUseLabels(usage.uses),
      hintLines: usage.hintLines.slice(0, 4),
      preferred,
      matches: matches.slice(0, 6)
    };
    byId[key] = entry;
    if (preferred) resolved.push(entry);
    else unresolved.push({ id, fromUser: Boolean(usage.fromUser), uses: [...usage.uses], hintLines: usage.hintLines.slice(0, 4) });
  }
  return {
    queryIds: ids.filter((id) => extracted.get(id)?.fromUser).map(Number),
    ids: ids.map(Number),
    resolved,
    unresolved,
    byId,
    hintLines: empty.hintLines
  };
}

function extractNpcReferenceIds(npc, text) {
  const out = new Map();
  const add = (rawId, use, line = "", fromUser = false) => {
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0 || id > 999999) return;
    const key = String(id);
    const entry = out.get(key) || { id, uses: new Set(), hintLines: [], fromUser: false };
    if (use) entry.uses.add(use);
    if (fromUser) entry.fromUser = true;
    if (line && !entry.hintLines.includes(line)) entry.hintLines.push(line);
    out.set(key, entry);
  };
  for (const id of String(text || "").match(/\b\d{2,6}\b/g) || []) add(id, "user-question", "", true);
  const hintLines = [
    ...(npc.scriptHints?.hints || []),
    npc.questLead?.summary || "",
    npc.dialogue || ""
  ].filter(Boolean);
  for (const line of hintLines) {
    let match;
    const petConditionRe = /\b(?:EVPET|PET)\s*([!<>=]+)\s*(\d{1,3})\s*-\s*(\d{1,6})(?:\s*\*\s*(\d{1,3}))?/gi;
    petConditionRe.lastIndex = 0;
    while ((match = petConditionRe.exec(line))) {
      const op = match[1] || "";
      add(match[3], op.includes("!") ? "condition-missing-pet" : "condition-has-pet", line);
    }
    const rules = [
      { re: /\b(?:GETITEM|GIVEITEM)\s*[:=]\s*(\d{1,6})/gi, use: "give-item" },
      { re: /\b(?:DELITEM|TAKEITEM)\s*[:=]\s*(\d{1,6})/gi, use: "take-item" },
      { re: /\b(?:GETPET|GIVEPET)\s*[:=]\s*(\d{1,6})/gi, use: "give-pet" },
      { re: /\b(?:DELPET|TAKEPET|NEWDELPET)\s*[:=]\s*(\d{1,6})/gi, use: "take-pet" },
      { re: /\b(?:ENEMYPETNO|ENEMY_PETNO|PETNO|PETID)\s*[:=]\s*(\d{1,6})/gi, use: "pet-ref" },
      { re: /\bITEM\s*!=\s*(\d{1,6})/gi, use: "condition-missing-item" },
      { re: /\bITEM\s*=\s*(\d{1,6})/gi, use: "condition-has-item" },
      { re: /\bCHANGEITEM\s*[:=]\s*(\d{1,6})/gi, use: "change-item" },
      { re: /\b(?:ENEMY|ENEMYNO|BATTLE)\s*[:=]\s*(\d{1,6})/gi, use: "enemy-ref" },
      { re: /\bWARP\s*[:=]\s*(\d{1,6})/gi, use: "map-ref" }
    ];
    for (const rule of rules) {
      rule.re.lastIndex = 0;
      while ((match = rule.re.exec(line))) add(match[1], rule.use, line);
    }
  }
  return out;
}

function resolveNpcReferenceId(id, usage, data, game, tradeIndex) {
  const matches = [];
  const item = data?.itemSet?.get(id);
  if (item && item.name) {
    matches.push({
      kind: "item",
      id,
      name: item.name,
      description: item.description,
      cost: item.cost,
      type: item.type,
      image: item.image,
      source: DATA_FILES.items
    });
  }
  const carried = (game.inventory || []).find((entry) => Number(entry.id) === id);
  if (carried) {
    matches.push({
      kind: "inventoryItem",
      id,
      name: carried.name,
      qty: carried.qty || 1,
      description: carried.description || "",
      source: carried.source || "player-inventory"
    });
  }
  const sold = tradeIndex.get(id);
  if (sold) {
    matches.push({
      kind: "shopItem",
      id,
      name: sold.name,
      soldBy: sold.soldBy.slice(0, 4),
      source: "world-trade"
    });
  }
  const enemySpec = data?.enemySpecsById?.get(id);
  if (enemySpec) {
    const base = data.enemyBaseSet.get(enemySpec.tempNo);
    matches.push({
      kind: "enemy",
      id,
      name: base?.Name || `敌人 ${enemySpec.tempNo}`,
      tempNo: enemySpec.tempNo,
      level: `${enemySpec.lvMin}-${enemySpec.lvMax}`,
      count: `${enemySpec.createMin}-${enemySpec.createMax}`,
      source: enemySpec.source
    });
  }
  const petTemplate = data?.enemyBaseSet?.get(id);
  if (petTemplate) {
    matches.push({
      kind: "petTemplate",
      id,
      name: petTemplate.Name,
      image: petTemplate.ImgNo,
      species: petTemplate.Species,
      attributes: {
        earth: petTemplate.EarthAT,
        water: petTemplate.WaterAT,
        fire: petTemplate.FireAT,
        wind: petTemplate.WindAt
      },
      source: DATA_FILES.enemyBase
    });
  }
  const map = WORLD.maps[String(id)];
  if (map) {
    matches.push({
      kind: "map",
      id,
      name: map.name,
      floorId: map.floorId,
      source: "world-data"
    });
  }
  return matches.filter((match) => usableReferenceName(match.name));
}

function pickPreferredReference(matches, usage) {
  if (!matches.length) return null;
  const uses = usage.uses || new Set();
  const wantsItem = ["condition-has-item", "condition-missing-item", "give-item", "take-item", "change-item"].some((use) => uses.has(use));
  const wantsPet = ["condition-has-pet", "condition-missing-pet", "give-pet", "take-pet", "pet-ref"].some((use) => uses.has(use));
  const wantsEnemy = uses.has("enemy-ref");
  const wantsMap = uses.has("map-ref");
  const order = wantsItem
    ? ["inventoryItem", "item", "shopItem", "enemy", "petTemplate", "map"]
    : wantsPet
      ? ["petTemplate", "enemy", "item", "inventoryItem", "shopItem", "map"]
      : wantsEnemy
        ? ["enemy", "petTemplate", "item", "inventoryItem", "shopItem", "map"]
        : wantsMap
          ? ["map", "item", "enemy", "petTemplate", "inventoryItem", "shopItem"]
          : ["inventoryItem", "item", "shopItem", "enemy", "petTemplate", "map"];
  return [...matches].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))[0] || null;
}

function npcReferenceQuestionReply(game, npc, text, context) {
  const queryIds = context?.queryIds || [];
  if (!queryIds.length) return "";
  if (!/(什么|甚么|甚麼|啥|哪个|哪個|编号|編號|道具|物品|东西|東西|意思|用来|用來|item|id)/i.test(String(text || ""))) return "";
  const entries = queryIds.map((id) => context.byId?.[String(id)]).filter(Boolean);
  if (!entries.length) return "";
  const entry = entries.find((item) => item.preferred) || entries[0];
  if (!entry?.preferred) {
    return `${npc.name}想了想：这个编号我暂时没在道具、宠物、敌人或地图资料里对上。先按任务线索找人问问，别只盯着数字。`;
  }
  const main = entry.preferred;
  const relation = npcReferenceRelationSentence(entry, context);
  const description = main.description ? ` ${main.description}` : "";
  return `${npc.name}想了想：你问的那个东西是${referenceKindLabel(main.kind)}「${main.name}」。${description}${relation ? ` ${relation}` : ""}`.replace(/\s+/g, " ").trim();
}

function npcReferenceRelationSentence(entry, context) {
  const uses = new Set(entry.uses || []);
  const given = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.uses?.includes("give-item") && item.preferred?.kind === "item")
    .map((item) => `「${item.preferred.name}」`);
  const taken = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.uses?.includes("take-item") && item.preferred?.kind === "item")
    .map((item) => `「${item.preferred.name}」`);
  if ((uses.has("condition-has-item") || uses.has("take-item")) && given.length) {
    return `按这段任务，它是要交给我的东西，交给我后会换成${given.join("、")}。`;
  }
  if (uses.has("give-item") && taken.length) {
    return `按这段任务，我会把它给你，用来回应你交来的${taken.join("、")}。`;
  }
  const relatedItems = (context.resolved || [])
    .filter((item) => item.id !== entry.id && item.preferred?.kind === "item")
    .slice(0, 3)
    .map((item) => `「${item.preferred.name}」`);
  if ((uses.has("condition-has-item") || uses.has("take-item")) && relatedItems.length) {
    return `按这段任务，它会和${relatedItems.join("、")}一起判断或交换。`;
  }
  if (uses.has("give-item")) return "按这段任务，它是我会交给你的道具。";
  if (uses.has("take-item")) return "按这段任务，它是我会收下的道具。";
  if (uses.has("condition-has-item")) return "按这段任务，我会先看你身上有没有它。";
  if (uses.has("condition-missing-item")) return "按这段任务，我会看你身上是否缺少它来决定下一句。";
  if (uses.has("give-pet")) return "按这段脚本，它是我会交给你的宠物。";
  if (uses.has("take-pet")) return "按这段脚本，它是我会收走或交换的宠物。";
  if (uses.has("condition-has-pet")) return "按这段脚本，我会检查你队伍里有没有这类宠物。";
  if (uses.has("condition-missing-pet")) return "按这段脚本，我会看你队伍里是否还没有这类宠物。";
  if (uses.has("pet-ref")) return "按这段脚本，这是一个宠物模板引用。";
  return referenceUseLabels(entry.uses || []).join("，");
}

function compactNpcScriptReferences(context) {
  const resolved = context?.resolved || [];
  const unresolved = context?.unresolved || [];
  return {
    queryIds: (context?.queryIds || []).slice(0, 6),
    refs: resolved.slice(0, 8).map((entry) => ({
      id: entry.id,
      kind: referenceKindLabel(entry.preferred?.kind),
      name: entry.preferred?.name || "",
      use: referenceUseLabels(entry.uses || []).join("；"),
      desc: shortReferenceText(entry.preferred?.description, 70),
      relation: shortReferenceText(npcReferenceRelationSentence(entry, context), 90),
      alt: entry.matches
        .filter((match) => match.kind !== entry.preferred?.kind && usableReferenceName(match.name))
        .slice(0, 2)
        .map((match) => `${referenceKindLabel(match.kind)}:${match.name}`)
    })),
    unresolved: unresolved.slice(0, 4).map((entry) => ({
      id: entry.id,
      use: referenceUseLabels(entry.uses || []).join("；")
    }))
  };
}

function compactNpcHints(npc) {
  if (!npc.scriptHints) return null;
  return {
    actions: (npc.scriptHints.actions || []).slice(0, 6),
    hints: (npc.scriptHints.hints || []).slice(0, 5)
  };
}

function compactNpcVmTrace(debug) {
  return (debug.vmTrace || []).slice(-5).map((event) => ({
    action: event.action,
    status: event.status,
    reason: event.detail?.reason || "",
    effect: event.detail?.effect || "",
    proposedAction: event.detail?.proposedAction || ""
  }));
}

function shortReferenceText(value, max = 80) {
  const text = cleanReferenceText(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function referenceUseLabels(uses) {
  const labels = {
    "user-question": "玩家问到这个编号",
    "condition-has-item": "脚本检查玩家是否持有",
    "condition-missing-item": "脚本检查玩家是否未持有",
    "give-item": "脚本给予",
    "take-item": "脚本收走",
    "change-item": "脚本交换",
    "condition-has-pet": "脚本检查玩家是否带着宠物",
    "condition-missing-pet": "脚本检查玩家是否未带宠物",
    "give-pet": "脚本给予宠物",
    "take-pet": "脚本收走宠物",
    "pet-ref": "脚本宠物引用",
    "enemy-ref": "脚本敌人引用",
    "map-ref": "脚本地图/传送引用"
  };
  return [...uses].map((use) => labels[use]).filter(Boolean);
}

function referenceKindLabel(kind) {
  if (kind === "inventoryItem") return "背包道具";
  if (kind === "shopItem") return "商品";
  if (kind === "item") return "道具";
  if (kind === "enemy") return "战斗敌人";
  if (kind === "petTemplate") return "宠物/敌人模板";
  if (kind === "map") return "地图";
  return "资料";
}

let tradeItemIndexCache = null;
function worldTradeItemIndex() {
  if (tradeItemIndexCache) return tradeItemIndexCache;
  const index = new Map();
  for (const map of Object.values(WORLD.maps)) {
    for (const npc of map.npcs || []) {
      for (const item of npc.trade?.items || []) {
        const id = Number(item.id);
        if (!Number.isFinite(id) || id <= 0) continue;
        const entry = index.get(id) || { id, name: item.name, soldBy: [] };
        if (!entry.soldBy.some((shop) => shop.npc === npc.name && shop.map === map.name)) {
          entry.soldBy.push({ npc: npc.name, map: map.name, price: Number(item.price || item.cost || 0) });
        }
        index.set(id, entry);
      }
    }
  }
  tradeItemIndexCache = index;
  return index;
}

function usableReferenceName(value) {
  const text = cleanReferenceText(value);
  return Boolean(text && !/[�]/.test(text));
}

function npcOpenAiHistory(game, npc) {
  if (game.dialog?.npcId !== npc.id) return [];
  return (game.dialog.messages || [])
    .slice(-4)
    .map((message) => ({
      speaker: message.speaker,
      text: String(message.text || "").slice(0, 160)
    }));
}

function proposalDecision(value = "") {
  const text = guideSearchText(value);
  if (["accept", "yes", "ok", "confirm"].includes(text) || hasAny(text, ["同意", "接受", "确认", "確定", "确定", "好"])) return "accept";
  if (["decline", "reject", "no", "cancel"].includes(text) || hasAny(text, ["拒绝", "拒絕", "取消", "不要", "算了"])) return "decline";
  return "";
}

function normalizeNpcProposalAction(action) {
  if (!action || typeof action !== "object") return null;
  const type = String(action.type || "");
  if (!["warp", "roleFavor", "noEncounter", "shopDiscount", "offMenuItem", "negotiatePass", "conditionOverride"].includes(type)) return null;
  const base = {
    type,
    text: String(action.text || "").slice(0, 180),
    seconds: clampInt(action.seconds, 0, 1200, 0),
    percent: clampInt(action.percent, 0, 30, 0)
  };
  if (type !== "conditionOverride") return base;
  return {
    ...base,
    eventNo: clampInt(action.eventNo, 0, 999999, 0),
    conditionHash: String(action.conditionHash || "").slice(0, 40),
    condition: String(action.condition || "").slice(0, 240),
    conditionToken: String(action.conditionToken || "").slice(0, 120),
    conditionKind: String(action.conditionKind || "").slice(0, 32),
    substituteStone: clampInt(action.substituteStone ?? action.substituteCost?.stone, 0, CHAR_MAXGOLDHAVE, 0)
  };
}

function normalizePendingNpcProposal(value) {
  if (!value || typeof value !== "object") return null;
  const action = normalizeNpcProposalAction(value.action);
  const id = String(value.id || "").trim().slice(0, 80);
  const npcId = String(value.npcId || "").trim().slice(0, 120);
  if (!id || !npcId || !action) return null;
  const createdAt = clampInt(value.createdAt, 0, Number.MAX_SAFE_INTEGER, Date.now());
  const expiresAt = clampInt(value.expiresAt, 0, Number.MAX_SAFE_INTEGER, createdAt + NPC_PROPOSAL_TTL_MS);
  return {
    schema: NPC_PROPOSAL_SCHEMA,
    id,
    npcId,
    npcName: String(value.npcName || "").slice(0, 40),
    kind: String(value.kind || action.type).slice(0, 32),
    title: String(value.title || npcProposalKindLabel(action.type)).slice(0, 60),
    summary: String(value.summary || "").slice(0, 220),
    costs: normalizeNpcProposalCosts(value.costs),
    grants: normalizeNpcProposalGrants(value.grants),
    risk: String(value.risk || "需要玩家确认后由 Worker 重新校验").slice(0, 120),
    createdAt,
    expiresAt,
    source: String(value.source || "").slice(0, 120),
    action
  };
}

function normalizeNpcProposalCosts(costs = {}) {
  const items = Array.isArray(costs.items) ? costs.items.map(normalizeProposalItem).filter(Boolean).slice(0, 6) : [];
  const pets = Array.isArray(costs.pets) ? costs.pets.map((item) => String(item || "").slice(0, 40)).filter(Boolean).slice(0, 3) : [];
  return {
    stone: clampInt(costs.stone, 0, CHAR_MAXGOLDHAVE, 0),
    items,
    pets,
    requiresPetChoice: Boolean(costs.requiresPetChoice)
  };
}

function normalizeNpcProposalGrants(grants = {}) {
  const items = Array.isArray(grants.items) ? grants.items.map(normalizeProposalItem).filter(Boolean).slice(0, 6) : [];
  const pets = Array.isArray(grants.pets) ? grants.pets.map((item) => String(item || "").slice(0, 40)).filter(Boolean).slice(0, 3) : [];
  const effects = Array.isArray(grants.effects) ? grants.effects.map((item) => String(item || "").slice(0, 80)).filter(Boolean).slice(0, 6) : [];
  return {
    stone: clampInt(grants.stone, 0, CHAR_MAXGOLDHAVE, 0),
    items,
    pets,
    effects,
    warp: grants.warp && typeof grants.warp === "object"
      ? {
        mapId: String(grants.warp.mapId || "").slice(0, 24),
        mapName: String(grants.warp.mapName || "").slice(0, 60),
        x: clampInt(grants.warp.x, 0, 9999, 0),
        y: clampInt(grants.warp.y, 0, 9999, 0)
      }
      : null,
    conditionOverrides: Array.isArray(grants.conditionOverrides)
      ? grants.conditionOverrides.map((item) => String(item || "").slice(0, 80)).filter(Boolean).slice(0, 4)
      : []
  };
}

function normalizeProposalItem(item) {
  if (!item || typeof item !== "object") return null;
  const id = Number(item.id || item.itemId || 0);
  const name = String(item.name || item.itemName || "").slice(0, 40);
  if (!id && !name) return null;
  return { id, name, qty: clampInt(item.qty, 1, 999, 1) };
}

function readPendingNpcProposal(game) {
  ensureFlags(game);
  const proposal = normalizePendingNpcProposal(game.flags.pendingNpcProposal);
  game.flags.pendingNpcProposal = proposal;
  return proposal;
}

function clearPendingNpcProposal(game) {
  ensureFlags(game);
  delete game.flags.pendingNpcProposal;
}

function publicNpcProposal(game, npc = null) {
  const proposal = readPendingNpcProposal(game);
  if (!proposal) return null;
  if (npc && proposal.npcId !== npc.id) return null;
  const secondsLeft = Math.max(0, Math.ceil((proposal.expiresAt - Date.now()) / 1000));
  return {
    schema: proposal.schema,
    id: proposal.id,
    npcId: proposal.npcId,
    npcName: proposal.npcName,
    kind: proposal.kind,
    title: proposal.title,
    summary: proposal.summary,
    costs: proposal.costs,
    grants: proposal.grants,
    risk: proposal.risk,
    expiresAt: proposal.expiresAt,
    secondsLeft,
    source: proposal.source
  };
}

function compactPendingNpcProposalForPrompt(game, npc = null) {
  const proposal = publicNpcProposal(game, npc);
  if (!proposal) return null;
  return {
    npcId: proposal.npcId,
    kind: proposal.kind,
    title: proposal.title,
    summary: proposal.summary,
    costs: proposal.costs,
    grants: proposal.grants,
    risk: proposal.risk,
    source: proposal.source
  };
}

function validateNpcProposalPublicRequirements(game, proposal, selectedPetIndex = NaN) {
  const costs = proposal?.costs || {};
  const grants = proposal?.grants || {};
  const immediateStoneCost = proposal?.kind === "conditionOverride" ? 0 : Number(costs.stone || 0);
  if (immediateStoneCost > 0 && Number(game.player?.stone || 0) < immediateStoneCost) {
    return { ok: false, error: `石币不足，需要 ${immediateStoneCost} 石币` };
  }
  if (costs.requiresPetChoice) {
    const index = Number(selectedPetIndex);
    if (!Number.isInteger(index) || index < 0 || index >= (game.pets || []).length) {
      return { ok: false, error: "需要选择一只符合条件的宠物" };
    }
    const selectedPet = (game.pets || [])[index];
    if (!proposalPetMatchesCost(selectedPet, costs.pets || [])) {
      return { ok: false, error: "选择的宠物不符合这个提案的要求" };
    }
  }
  for (const item of grants.items || []) {
    if (!canCarryItem(game, item)) {
      return { ok: false, error: `背包已满，无法接收 ${item.name || item.id || "道具"}` };
    }
  }
  const petGrantCount = (grants.pets || []).length;
  if (petGrantCount > 0 && (game.pets || []).length + petGrantCount > PET_CAPACITY) {
    return { ok: false, error: `宠物栏已满，最多携带 ${PET_CAPACITY} 只宠物` };
  }
  return { ok: true };
}

function proposalPetMatchesCost(pet, requiredPets = []) {
  if (!requiredPets.length) return Boolean(pet);
  const names = [
    pet?.Name,
    pet?.name,
    pet?.PetName,
    pet?.petName,
    pet?.BaseName,
    pet?.baseName
  ].map((value) => String(value || "").trim()).filter(Boolean);
  const petIds = [pet?.PetId, pet?.petId, pet?.id].map(Number).filter((value) => Number.isFinite(value) && value > 0);
  return requiredPets.some((required) => {
    const text = String(required || "").trim();
    if (!text) return false;
    const requiredId = Number(text);
    if (Number.isFinite(requiredId) && petIds.includes(requiredId)) return true;
    return names.some((name) => name === text || name.includes(text) || text.includes(name));
  });
}

function isThreateningNpcProposal(proposal) {
  return hasAny(String(proposal?.action?.text || proposal?.summary || ""), ["威胁", "恐吓", "吓", "打服", "揍", "threat", "intimidate", "challenge"]);
}

function npcAiActionProposalReply(game, npc, action, reply = "") {
  const proposal = createNpcProposal(game, npc, action);
  if (!proposal) {
    recordNpcVmEvent(game, npc, "window", "blocked", {
      reason: "npc-proposal-unsupported",
      proposedAction: action?.type || "unknown"
    });
    return String(reply || "").trim() || `${npc.name} 不能执行这个请求。`;
  }
  game.flags.pendingNpcProposal = proposal;
  recordNpcVmEvent(game, npc, "window", "ok", {
    reason: "npc-proposal-pending",
    proposalId: proposal.id,
    kind: proposal.kind,
    source: proposal.source
  });
  const lead = String(reply || "").trim();
  const confirm = `需要你确认：${proposal.summary}\n同意后 Worker 会重新检查距离、条件、背包/石币和 NPC 身份，再执行；拒绝不会改状态。`;
  return lead ? `${lead}\n${confirm}` : `${npc.name} 提出一个需要确认的方案。\n${confirm}`;
}

function createNpcProposal(game, npc, action) {
  ensureFlags(game);
  const normalizedAction = normalizeNpcProposalAction(action);
  if (!normalizedAction || !npcProposalActionAllowedForNpc(npc, normalizedAction)) {
    return null;
  }
  const now = Date.now();
  return normalizePendingNpcProposal({
    id: `proposal-${crypto.randomUUID()}`,
    npcId: npc.id,
    npcName: npc.name,
    kind: normalizedAction.type,
    title: npcProposalKindLabel(normalizedAction.type),
    summary: npcProposalSummary(game, npc, normalizedAction),
    costs: npcProposalCosts(game, npc, normalizedAction),
    grants: npcProposalGrants(game, npc, normalizedAction),
    risk: npcProposalRisk(normalizedAction),
    source: npc.script || npc.source || npc.trade?.source || npc.warp?.source || "",
    action: normalizedAction,
    createdAt: now,
    expiresAt: now + NPC_PROPOSAL_TTL_MS
  });
}

function npcProposalActionAllowedForNpc(npc, action) {
  if (!action) return false;
  if (action.type === "warp") return isWarpNpc(npc) || isRouteServiceNpc(npc) || isTransportNpc(npc);
  if (action.type === "roleFavor") return npcCanOfferAiFavor(npc);
  if (action.type === "shopDiscount") return Boolean(npc.trade?.items?.length);
  if (action.type === "offMenuItem") return Boolean(npc.trade?.items?.length && chooseRoleFitOffMenuItem(null, npc, action.text || "").item);
  if (action.type === "negotiatePass") return isNpcEnemy(npc);
  if (action.type === "conditionOverride") return hasNpcScriptEvents(npc) && Number(action.eventNo || 0) > 0 && Boolean(action.conditionHash);
  if (action.type === "noEncounter") return !isNpcEnemy(npc);
  return false;
}

function npcProposalKindLabel(kind) {
  const labels = {
    warp: "传送/路线服务",
    roleFavor: "角色内帮助",
    noEncounter: "临时避敌",
    shopDiscount: "临时折扣",
    offMenuItem: "临时商品/赠品",
    negotiatePass: "守路交涉",
    conditionOverride: "脚本条件通融"
  };
  return labels[kind] || "NPC 提案";
}

function npcProposalSummary(game, npc, action) {
  if (action.type === "warp") {
    const target = npc.warp?.target || null;
    const map = target ? WORLD.maps[target.mapId] : null;
    return target
      ? `${npc.name} 准备按原脚本送你去 ${map?.name || `floor ${target.mapId}`}。`
      : `${npc.name} 准备按原路线/传送脚本帮你移动。`;
  }
  if (action.type === "roleFavor") {
    if (isSavePointNpc(npc)) return `${npc.name} 可以尝试通融记录点，但需要确认后按 Born/CHAR_SAVEPOINT 规则写入。`;
    if (isHealerNpc(npc)) return `${npc.name} 可以尝试给急救恢复品或治疗帮助，确认后按背包和石币重新校验。`;
    return `${npc.name} 可以尝试提供一次角色内帮助，确认后由 NPC VM 判定。`;
  }
  if (action.type === "noEncounter") return `${npc.name} 可以给你临时避敌效果，持续 ${clampInt(action.seconds, 30, 600, 180)} 秒。`;
  if (action.type === "shopDiscount") return `${npc.name} 可以给本店临时 ${clampInt(action.percent, 5, 30, 10)}% 折扣，结账时由 Worker 重算价格。`;
  if (action.type === "offMenuItem") return `${npc.name} 可以找一件符合本店身份的临时商品或小赠品，确认后再加入商品栏/背包。`;
  if (action.type === "negotiatePass") return `${npc.name} 可以接受贿赂/威慑交涉，确认后可能收石币并临时让路。`;
  if (action.type === "conditionOverride") {
    const kind = npcConditionKindLabel(action.conditionKind);
    return `${npc.name} 可以为原脚本事件 ${action.eventNo} 通融一次${kind ? `（${kind}）` : ""}，确认后仍由 NPC VM 执行原事件奖励、传送和 flag。`;
  }
  return `${npc.name} 提出了一个需要确认的动作。`;
}

function npcProposalCosts(game, npc, action) {
  if (action.type === "negotiatePass" && !hasAny(action.text, ["威胁", "恐吓", "吓", "打服", "揍"])) {
    return { stone: Math.max(80, Number(game.player.level || 1) * 40) };
  }
  if (action.type === "roleFavor" && isSavePointNpc(npc)) {
    const requirement = sourceSavePointRequirement(game, npc);
    if (requirement?.required && !requirement.ok && !isSourceSavePointRegistered(game, sourceSavePointId(npc))) {
      return { stone: savePointFavorCost(game, npc, requirement, action.text || "") };
    }
  }
  if (action.type === "roleFavor" && isHealerNpc(npc)) {
    const item = chooseHealerAidItem(action.text || "");
    return item ? { stone: healerAidCost(game, item, action.text || "") } : {};
  }
  if (action.type === "conditionOverride") {
    return { stone: clampInt(action.substituteStone, 0, CHAR_MAXGOLDHAVE, 0) };
  }
  return {};
}

function npcProposalGrants(game, npc, action) {
  if (action.type === "warp") {
    const target = npc.warp?.target || null;
    const map = target ? WORLD.maps[target.mapId] : null;
    return target ? { warp: { mapId: target.mapId, mapName: map?.name || "", x: target.x, y: target.y } } : {};
  }
  if (action.type === "noEncounter") return { effects: [`避敌 ${clampInt(action.seconds, 30, 600, 180)} 秒`] };
  if (action.type === "shopDiscount") return { effects: [`本店 ${clampInt(action.percent, 5, 30, 10)}% 临时折扣`] };
  if (action.type === "offMenuItem") return { effects: ["临时商品栏或角色内赠品"] };
  if (action.type === "negotiatePass") return { effects: ["守路 NPC 临时让路 5 分钟"] };
  if (action.type === "conditionOverride") {
    const kind = npcConditionKindLabel(action.conditionKind);
    return {
      effects: [`${kind || "脚本条件"}一次性通融`],
      conditionOverrides: [`NPC ${npc.name} event ${action.eventNo} ${action.conditionHash}`]
    };
  }
  if (action.type === "roleFavor" && isSavePointNpc(npc)) return { effects: ["写入记录点/出生点"] };
  if (action.type === "roleFavor" && isHealerNpc(npc)) {
    const item = chooseHealerAidItem(action.text || "");
    return item ? { items: [{ id: item.id, name: item.name, qty: 1 }] } : {};
  }
  return {};
}

function npcProposalRisk(action) {
  if (action.type === "roleFavor") return "角色内帮助可能因为石币、背包、原脚本条件或概率被拒绝。";
  if (action.type === "negotiatePass") return "守路交涉可能扣除石币或只产生临时让路，不改原版战斗脚本。";
  if (action.type === "warp") return "传送会移动角色位置；确认前不会改变地图。";
  if (action.type === "conditionOverride") return "只放行指定 NPC 的指定脚本事件一次；奖励、传送、flag、扣物仍由原 NPC VM 重新校验。";
  return "确认前不会扣钱、给物品、改效果或移动角色。";
}

function cloneGameState(game) {
  return normalizeGame(JSON.parse(JSON.stringify(game)));
}

function executeNpcProposalOnClone(game, npc, proposal, selectedPetIndex = NaN) {
  const clone = cloneGameState(game);
  const cloneMap = currentMap(clone);
  const cloneNpc = cloneMap.npcs.find((item) => item.id === npc.id);
  if (!cloneNpc) return { ok: false, error: "确认时 NPC 已不在当前地图" };
  if (!npcProposalActionAllowedForNpc(cloneNpc, proposal.action)) return { ok: false, error: "NPC 身份或脚本能力不允许执行这个提案" };
  if (Number.isFinite(selectedPetIndex)) clone.selectedPetIndex = clampInt(selectedPetIndex, 0, PET_CAPACITY - 1, 0);
  const beforeEventCount = clone.npcVmEvents?.length || 0;
  const beforeLocation = { ...clone.location };
  const reply = applyNpcAiAction(clone, cloneNpc, proposal.action);
  const newEvents = (clone.npcVmEvents || []).slice(beforeEventCount);
  const changedLocation = String(beforeLocation.mapId) !== String(clone.location?.mapId)
    || Number(beforeLocation.x) !== Number(clone.location?.x)
    || Number(beforeLocation.y) !== Number(clone.location?.y);
  const blocked = newEvents.some((event) => event.status === "blocked");
  const okMutation = changedLocation || newEvents.some((event) => event.status === "ok" && (
    event.detail?.mutated === true ||
    ["take", "give", "takePet", "givePet", "save", "effect", "warp"].includes(event.action)
  ));
  if (blocked && !okMutation) {
    return {
      ok: false,
      error: newEvents.find((event) => event.status === "blocked")?.error || newEvents.find((event) => event.status === "blocked")?.detail?.error || "NPC VM 拒绝执行",
      reply
    };
  }
  if (!okMutation && proposal.kind !== "roleFavor") {
    return { ok: false, error: "确认后没有产生可提交的状态变化", reply };
  }
  return { ok: true, game: clone, reply };
}

function openAiNpcAction(game, npc, decision, fallbackText) {
  const action = decision?.action;
  const type = String(action?.type || "none");
  if (type === "none") return null;
  const text = String(action?.text || fallbackText || "");
  if (type === "warp") {
    if (isWarpNpc(npc) || isTransportNpc(npc)) return { type: "warp", text };
    return { type: "teleportInfo", text };
  }
  if (type === "teleportInfo") return { type: "teleportInfo", text };
  if (type === "noEncounter") {
    if (isNpcEnemy(npc)) return { type: "negotiatePass", text };
    if (!npcCanOfferAiFavor(npc)) return null;
    return { type: "noEncounter", seconds: clampInt(action.seconds, 60, 420, aiNoEncounterSeconds(game, npc, text)) };
  }
  if (type === "shopDiscount") {
    if (!npc.trade?.items?.length) return null;
    return {
      type: "shopDiscount",
      percent: clampInt(action.percent, 5, 25, aiShopDiscountPercent(game, npc, text)),
      seconds: 600
    };
  }
  if (type === "offMenuItem") {
    if (!npc.trade?.items?.length) return null;
    return { type: "offMenuItem", text };
  }
  if (type === "negotiatePass") {
    if (!isNpcEnemy(npc)) return null;
    return { type: "negotiatePass", text };
  }
  if (type === "roleFavor") {
    if (!npcCanOfferAiFavor(npc)) return null;
    return { type: "roleFavor", text };
  }
  if (type === "conditionOverride") {
    const candidate = sourceConditionReliefCandidate(game, npc, text || fallbackText || "");
    if (!candidate) return null;
    return conditionOverrideActionFromCandidate(game, npc, candidate, text);
  }
  return null;
}

function openAiNpcActionReply(game, npc, action, decision) {
  const reply = String(decision?.reply || "").trim();
  if (action?.type === "teleportInfo") {
    const applied = applyNpcAiAction(game, npc, action);
    if (!reply || applied.includes(reply)) return applied;
    return `${reply}\n${applied}`;
  }
  recordNpcVmEvent(game, npc, "say", "ok", { reason: "openai-npc-action", intent: decision?.intent || "", proposedAction: action.type });
  return npcAiActionProposalReply(game, npc, action, reply);
}

function npcCanOfferAiFavor(npc) {
  return Boolean(
    npc.trade?.items?.length ||
    isHealerNpc(npc) ||
    isSavePointNpc(npc) ||
    isWarpNpc(npc) ||
    isTransportNpc(npc) ||
    npc.questLead ||
    /elder|guard|gate|town|timeman|村|庄|守|长老|少女|姑娘|男人|女人/i.test(`${npc.name} ${npc.type} ${npc.template} ${npc.script}`)
  );
}

function localNpcAiFallback(game, npc, text, error = null) {
  const intro = error ? `${npc.name} 低声说：我现在只能按本地规则回答。` : `${npc.name} 想了想：`;
  const role = npcActionProfile(npc);
  const sourceTask = sourceScriptTaskState(game)[0];
  if (sourceTask && hasAny(String(text || "").toLowerCase(), ["任务", "下一步", "委托", "攻略", "做什么", "怎么做"])) {
    return `${intro}你现在有原脚本事件「${sourceTask.title}」。${sourceTask.next}`;
  }
  if (isNpcEnemy(npc)) {
    return `${intro}我是守路的 NPCEnemy。你可以按原版方式选“是”开战；也可以试着贿赂或威胁，但是否让路会看你的等级、石币和临时状态。`;
  }
  if (npc.trade?.items?.length && hasAny(String(text || "").toLowerCase(), ["平时不卖", "平常不卖", "隐藏", "有没有", "有沒有", "能不能给", "能不能給", "给我", "給我", "卖我", "賣我", "要一个", "要一個", "要把", "必须", "必須", "一定要", "指定", "只要", "就要", "特殊", "稀有"])) {
    const offer = chooseRoleFitOffMenuItem(game, npc, text || "");
    if (!offer.item) {
      recordNpcVmEvent(game, npc, "shop", "blocked", { action: "offMenu", reason: offer.reason, role: offer.role, text: String(text || "").slice(0, 80) });
      return roleMismatchReply(npc, offer);
    }
  }
  if (npc.trade?.items?.length) {
    const samples = npc.trade.items.slice(0, 5).map((item) => item.name).join("、");
    return `${intro}我这里能谈交易，货架上有 ${samples || "商品"}。想要折扣、柜台后面的东西可以直接说，但物品必须符合我的店铺身份。`;
  }
  if (isRouteServiceNpc(npc)) {
    const state = buildRouteServiceState(game, npc);
    const routes = state?.routes?.map((route) => `${route.name}->${route.targetName}`).join("、") || "原路线";
    const cost = state?.needStone > 0 ? `，费用 ${state.needStone} 石币` : "";
    return `${intro}我是交通路线 NPC，可以按原脚本路线搭乘：${routes}${cost}。你可以问路线，也可以直接说“搭乘”。`;
  }
  if (isWarpNpc(npc)) {
    const target = npc.warp?.target;
    const targetName = target ? WORLD.maps[target.mapId]?.name || `floor ${target.mapId}` : "目标地图";
    return `${intro}我有传送脚本，能按条件送你去 ${targetName}。输入“传送”会走原版 WARP 条件；想商量也可以先说原因。`;
  }
  if (npc.questLead) {
    return `${intro}${npc.questLead.title}：${npc.questLead.summary}\n来源：${npc.questLead.source}`;
  }
  if (role.includes("heal")) return `${intro}我主要负责治疗。你可以说“治疗”；如果真的急用恢复药，也可以好好商量，但我只会处理急救恢复品，而且可能要收补给钱。`;
  if (role.includes("save")) {
    const status = compactNpcSavePointStatus(game, npc);
    if (status?.required && !status?.hasItems && !status?.registered) {
      return `${intro}我是记录点，原脚本要 ${status.summary || "指定道具"}。你可以去找这些材料；如果真的赶路，也可以提出付些石币让我通融一次。`;
    }
    return `${intro}我主要负责记录进度。你可以说“记录”或“存档”。`;
  }
  return `${intro}我能聊地图、任务线索和附近 NPC。更具体地说“出口”“任务”“能不能帮我避敌”，我会按当前脚本身份回答。`;
}

function inferNpcAiAction(game, npc, text) {
  const lower = String(text || "").toLowerCase();
  const relief = sourceConditionReliefCandidate(game, npc, lower);
  if (relief) return conditionOverrideActionFromCandidate(game, npc, relief, lower);
  if (isTeleportRequest(lower)) {
    if (isWarpNpc(npc) || isTransportNpc(npc)) return { type: "warp", text: lower };
    return { type: "teleportInfo", text: lower };
  }
  if (hasAny(lower, ["避敌", "不会遇到", "野外敌人", "不遇敌", "免遇敌", "安全通过", "护送"])) {
    return { type: "noEncounter", seconds: aiNoEncounterSeconds(game, npc, lower) };
  }
  if (npc.trade?.items?.length && hasAny(lower, ["打折", "折扣", "便宜", "优惠", "優待", "优待", "少一点", "少一點"])) {
    return { type: "shopDiscount", percent: aiShopDiscountPercent(game, npc, lower), seconds: 600 };
  }
  if (npc.trade?.items?.length && hasAny(lower, ["平时不卖", "平常不卖", "隐藏", "有没有", "有沒有", "能不能给", "能不能給", "给我", "給我", "卖我", "賣我", "要一个", "要一個", "要把", "必须", "必須", "一定要", "指定", "只要", "就要", "特殊", "稀有"])) {
    const offer = chooseRoleFitOffMenuItem(game, npc, lower);
    if (offer.item) return { type: "offMenuItem", text: lower };
    return null;
  }
  if (isNpcEnemy(npc) && hasAny(lower, ["贿赂", "收钱", "买路", "给你石币", "给钱", "威胁", "恐吓", "让我过去", "放我过去", "让开"])) {
    return { type: "negotiatePass", text: lower };
  }
  if ((isWarpNpc(npc) || isTransportNpc(npc)) && hasAny(lower, ["商量传送", "商量坐车", "去别的地图", "去其他地图", "出发", "前往", "bus", "巴士", "传送", "傳送"])) {
    return { type: "warp", text: lower };
  }
  if (isNpcRoleFavorRequest(lower, npc)) {
    return { type: "roleFavor", text: lower };
  }
  return null;
}

function aiNoEncounterSeconds(game, npc, text) {
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "商量", "帮"]);
  const base = polite ? 240 : 150;
  const levelBonus = Math.min(90, Math.max(0, Number(game.player.level || 1) - 1) * 5);
  const serviceNpc = npc.trade || isHealerNpc(npc) || isSavePointNpc(npc) || isWarpNpc(npc) || isRouteServiceNpc(npc);
  return clampInt(base + levelBonus + (serviceNpc ? 60 : 0), 90, 420, 180);
}

function aiShopDiscountPercent(game, npc, text) {
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "商量", "帮"]);
  const loyalCustomer = Number(game.player.level || 1) >= 5 || Number(game.player.stone || 0) >= 1000;
  return clampInt(10 + (polite ? 5 : 0) + (loyalCustomer ? 5 : 0), 5, 25, 10);
}

function isNpcRoleFavorRequest(text, npc) {
  if (isNpcEnemy(npc)) return false;
  if (isHealerNpc(npc) && (isHealerAidRequest(text) || isPoliteFavorRequest(text))) return true;
  if (npc.trade?.items?.length) return false;
  if (isSavePointNpc(npc) && hasAny(text, ["记录", "記錄", "存档", "保存", "帮我"])) return true;
  return npcCanOfferAiFavor(npc)
    && isPoliteFavorRequest(text)
    && hasAny(text, ["帮", "通融", "照顾", "照顧", "报酬", "給", "给", "卖", "賣", "借"]);
}

function isPoliteFavorRequest(text) {
  return hasAny(text, ["请", "請", "拜托", "拜託", "求你", "能不能", "可以吗", "可以嗎", "真的需要", "很需要", "急用", "帮我", "帮帮", "幫我", "幫幫", "报酬", "報酬", "辛苦"]);
}

function isHealerAidRequest(text) {
  return hasAny(text, ["回复药", "回復藥", "恢复药", "恢復藥", "回復药", "药", "藥", "急救", "受伤", "受傷", "治疗", "治療", "补血", "補血", "耐久", "hp", "血"]);
}

function applyNpcRoleFavor(game, npc, text) {
  if (isHealerNpc(npc)) return applyHealerNpcFavor(game, npc, text);
  if (isSavePointNpc(npc) && hasAny(text, ["记录", "記錄", "纪录", "存档", "保存"])) return applySavePointNpcFavor(game, npc, text);
  recordNpcVmEvent(game, npc, "debug", "blocked", {
    reason: "ai-role-favor",
    role: npcActionProfile(npc),
    text: String(text || "").slice(0, 80)
  });
  return `${npc.name} 想了想：这件事超出我能做的范围。你可以继续问任务、地图，或找更合适的 NPC 交涉。`;
}

function applySavePointNpcFavor(game, npc, text) {
  const sourceId = sourceSavePointId(npc);
  const requirement = sourceSavePointRequirement(game, npc);
  const registered = sourceId > 0 && isSourceSavePointRegistered(game, sourceId);
  if (!requirement.required || requirement.ok || registered) return savePointReply(game, npc, text);
  const wantsCompensation = savePointFavorOffersCompensation(text);
  const cost = savePointFavorCost(game, npc, requirement, text);
  if (!wantsCompensation && !hasAny(text, ["通融", "帮我", "幫我", "拜托", "拜託", "真的需要", "很需要", "急用"])) {
    recordNpcVmEvent(game, npc, "debug", "blocked", {
      reason: "ai-savepoint-favor",
      missing: requirement.summary,
      cost,
      source: npc.savePoint?.source || npc.script || npc.source || ""
    });
    return `${npc.name} 摆摆手：原本我要 ${requirement.summary} 才能记录。你可以去准备这些肉；如果赶时间，就明说愿意付记录补给费。`;
  }
  if (Number(game.player?.stone || 0) < cost) {
    recordNpcVmEvent(game, npc, "debug", "blocked", {
      reason: "ai-savepoint-favor-stone",
      requiredStone: cost,
      currentStone: Number(game.player?.stone || 0),
      missing: requirement.summary
    });
    return `${npc.name} 想了想：原脚本要 ${requirement.summary}。我可以通融一次，但至少要 ${cost} 石币当补给费；你现在石币不够。`;
  }
  const decision = wantsCompensation
    ? { ok: true, chance: 100, roll: 0, cost }
    : npcFavorDecision(game, npc, text, "savepoint-favor", {
      baseChance: 0.54,
      urgentBonus: 0.18,
      cost
    });
  recordNpcVmEvent(game, npc, "debug", decision.ok ? "ok" : "blocked", {
    reason: "ai-role-favor",
    role: "savepoint",
    missing: requirement.summary,
    cost,
    chance: decision.chance,
    roll: decision.roll
  });
  if (!decision.ok) {
    return `${npc.name} 犹豫了一下：记录点的规矩还是要守。带来 ${requirement.summary} 最稳；如果愿意付 ${cost} 石币补给费，我可以再帮你问问。`;
  }
  const paid = runNpcVmAction(game, npc, {
    type: "take",
    item: "stone",
    qty: cost,
    reason: "ai-savepoint-fee",
    source: npc.savePoint?.source || npc.script || npc.source || ""
  });
  if (!paid.ok) return `${npc.name} 摊开手：我可以通融一次，但至少要 ${cost} 石币当补给费。`;
  const record = applySourceSavePointRecord(game, npc, "ai-savepoint-favor");
  if (!record.event?.ok) return `${npc.name} 想帮你记录，但 ${record.event?.error || "记录点状态写入失败"}。`;
  addLog(game, `${npc.name} 通过 AI 交涉收取 ${cost} 石币并记录了冒险进度。`);
  const bornLine = record.born ? `记录点：floor ${record.born.mapId} (${record.born.x},${record.born.y})。` : "";
  return `${npc.name} 压低声音：好吧，这次我收 ${cost} 石币当补给费，先帮你记下来；下次按规矩还是带 ${requirement.summary}。\n${bornLine}这次记录仍由 Worker 按原版 Born/CHAR_SAVEPOINT 写入。`;
}

function savePointFavorOffersCompensation(text = "") {
  return hasAny(String(text || "").toLowerCase(), [
    "给你钱", "給你錢", "给钱", "給錢", "给你石币", "給你石幣", "石币", "石幣",
    "报酬", "報酬", "补给费", "補給費", "辛苦费", "辛苦費", "收钱", "收錢",
    "贿赂", "賄賂", "买通", "買通", "通融"
  ]);
}

function savePointFavorCost(game, npc, requirement, text = "") {
  const alternatives = requirement.alternatives?.length ? requirement.alternatives : [requirement.alternative || []];
  const cheapest = alternatives
    .map((items) => items.reduce((sum, item) => sum + Math.max(1, Number(item.cost || item.price || 10)) * Math.max(1, Number(item.qty || 1)), 0))
    .filter((sum) => Number.isFinite(sum) && sum > 0)
    .sort((a, b) => a - b)[0] || 30;
  const urgentDiscount = hasAny(String(text || ""), ["真的需要", "很需要", "急用", "拜托", "拜託"]) ? 20 : 0;
  const levelPremium = Math.min(120, Math.max(0, Number(game.player?.level || 1) - 1) * 6);
  const sourcePremium = Math.max(0, sourceSavePointId(npc) - 1) * 2;
  return clampInt(Math.round(cheapest * 4 + levelPremium + sourcePremium - urgentDiscount), 80, 5000, 120);
}

function applyHealerNpcFavor(game, npc, text) {
  const wantsItem = hasAny(text, ["回复药", "回復藥", "恢复药", "恢復藥", "回復药", "药", "藥", "急救", "卖", "賣", "给我", "給我", "给些", "给点", "一些"]);
  const wantsTreatment = hasAny(text, ["治疗", "治療", "补血", "補血", "受伤", "受傷", "耐久", "hp", "血"]);
  if (!wantsItem && (wantsTreatment || needsHealing(game))) return healerReply(game, npc);
  const item = chooseHealerAidItem(text);
  if (!item) {
    recordNpcVmEvent(game, npc, "give", "blocked", { reason: "ai-healer-aid", text: String(text || "").slice(0, 80) });
    return `${npc.name} 摇摇头：我这里负责治疗，手边没有适合给你的恢复药。真正买药还是要找药店。`;
  }
  if (!canCarryItem(game, item)) {
    recordNpcVmEvent(game, npc, "give", "blocked", { reason: "inventory-full", itemId: item.id, itemName: item.name });
    return `${npc.name} 看了看你的背包：先整理一下吧，${item.name} 放不下。`;
  }
  const cost = healerAidCost(game, item, text);
  const decision = npcFavorDecision(game, npc, text, "healer-aid", {
    baseChance: 0.48,
    cost,
    urgentBonus: 0.22
  });
  recordNpcVmEvent(game, npc, "debug", decision.ok ? "ok" : "blocked", {
    reason: "ai-role-favor",
    role: "healer",
    itemId: item.id,
    itemName: item.name,
    cost,
    chance: decision.chance,
    roll: decision.roll
  });
  if (!decision.ok) {
    return `${npc.name} 犹豫了一下：我手边的急救药不多，今天不能随便拿出来。你如果愿意出 ${cost} 石币，我可以再想办法；正式买药还是去药店更稳。`;
  }
  if (cost > 0) {
    const paid = runNpcVmAction(game, npc, {
      type: "take",
      item: "stone",
      qty: cost,
      reason: "ai-healer-aid"
    });
    if (!paid.ok) return `${npc.name} 摊开手：我可以匀一瓶 ${item.name}，但至少要 ${cost} 石币当补给钱。`;
  }
  const given = runNpcVmAction(game, npc, {
    type: "give",
    item,
    itemId: item.id,
    itemName: item.name,
    qty: 1,
    reason: "ai-healer-aid"
  });
  if (!given.ok) return `${npc.name} 想把 ${item.name} 给你，但 ${given.error || "背包放不下"}。`;
  setNpcVmFlag(game, npc, eventFlagForNpcAction(npc.id, "ai-healer-aid"), "now", "ai-healer-aid");
  addLog(game, `${npc.name} 通过 AI 交涉给了 ${item.name}，收取 ${cost} 石币。`);
  return `${npc.name} 点点头：看你确实需要，我可以匀一瓶 ${item.name} 给你，收 ${cost} 石币当补给钱。这个帮助只限急救恢复品，正式买药还是要找药店。`;
}

function chooseHealerAidItem(text) {
  const queryTags = requestedItemTags(text);
  const candidates = worldTradeItems()
    .filter((item) => itemRoleTags(item).includes("medicine"))
    .map((item) => ({
      item,
      score: healerAidItemScore(item, queryTags, text)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(a.item.price || a.item.cost || 0) - Number(b.item.price || b.item.cost || 0));
  const entry = candidates[0];
  if (!entry) return null;
  return {
    ...entry.item,
    price: Number(entry.item.price || entry.item.cost || 0),
    source: entry.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
}

function healerAidItemScore(item, queryTags, text) {
  const itemText = `${item.name || ""} ${item.description || ""}`;
  let score = roleItemScore(["medicine"], item, queryTags, text);
  if (/回复药|回復藥|恢复药|恢復藥/.test(text) && /回复药|回復藥|恢复药|恢復藥/.test(item.name || "")) score += 60;
  if (/回复药|回復藥|恢复药|恢復藥|急救|受伤|受傷|补血|補血|耐久|hp|血/.test(text) && /耐久|回复|回復|恢复|恢復/.test(itemText)) score += 14;
  if (/气力|氣力|mp/.test(text) && /气力|氣力/.test(itemText)) score += 20;
  if (/复活|復活|气绝|氣絕|死亡/.test(text) && /复活|復活/.test(itemText)) score += 22;
  if (/之石|护身符|護身符|娃娃|材料|草/.test(item.name || "")) score -= 18;
  if (/万能|传送|武器|刀|装备/.test(text) && !/药|藥|耐久|气力|復活|复活/.test(itemText)) score -= 30;
  return score;
}

function healerAidCost(game, item, text) {
  const base = Math.max(1, Number(item.price || item.cost || 1));
  const urgent = hasAny(text, ["真的需要", "很需要", "急用", "受伤", "受傷", "急救"]);
  const relationship = Number(game.player.level || 1) >= 10 ? -5 : 0;
  const markup = urgent ? 0 : Math.max(1, Math.round(base * 0.1));
  return Math.max(1, base + markup + relationship);
}

function npcFavorDecision(game, npc, text, kind, options = {}) {
  const cost = Math.max(0, Number(options.cost || 0));
  let chance = Number(options.baseChance ?? 0.45);
  if (isPoliteFavorRequest(text)) chance += 0.14;
  if (hasAny(text, ["真的需要", "很需要", "急用", "急救", "受伤", "受傷"])) chance += Number(options.urgentBonus ?? 0.2);
  if (needsHealing(game)) chance += 0.08;
  if (cost > 0 && Number(game.player.stone || 0) >= cost) chance += 0.08;
  if (Number(game.player.level || 1) >= 10) chance += 0.06;
  chance = Math.max(0.05, Math.min(0.95, chance));
  const seedText = `${game.player?.name || game.character?.name || ""}:${game.character?.id || ""}:${npc.id}:${kind}:${guideSearchText(text).slice(0, 28)}`;
  const roll = stableFlag(seedText) / 256;
  const urgent = hasAny(text, ["真的需要", "很需要", "急用", "急救"]);
  return {
    ok: urgent || roll <= chance,
    chance: Math.round(chance * 100),
    roll: Math.round(roll * 100),
    cost
  };
}

function applyNpcAiAction(game, npc, action) {
  recordNpcVmEvent(game, npc, "debug", "ok", { reason: "ai-action-proposal", action: action.type });
  if (action.type === "warp") {
    if (isWarpNpc(npc)) {
      const reply = warpNpcReply(game, npc);
      return `${npc.name} 听完你的请求，决定按原版传送脚本处理。\n${reply}`;
    }
    if (isRouteServiceNpc(npc)) {
      const reply = rideRouteService(game, npc, chooseRouteServiceRoute(npc.routeService, action.text || ""));
      return `${npc.name} 听完你的请求，按原版路线服务处理。\n${reply}`;
    }
    const teleport = chooseGuideTeleport(game, action.text || "");
    if (!teleport) return `${npc.name} 摇摇头：我能帮你坐车，但你得说清楚要去哪个村或地图。`;
    const targetMap = teleport.exit ? WORLD.maps[teleport.exit.to] : WORLD.maps[teleport.target.mapId];
    if (teleport.exit) applyExit(game, teleport.exit);
    else applyWarpTarget(game, teleport.target, `${npc.name} 帮忙传送`);
    recordNpcVmEvent(game, npc, "warp", "ok", {
      reason: "ai-transport-npc",
      mapId: targetMap?.id,
      source: npc.script || npc.source || ""
    });
    return `${npc.name} 听完你的请求，答应帮你过去。\n你来到了 ${targetMap?.name || "目标地图"}。`;
  }
  if (action.type === "teleportInfo") {
    return npcTeleportInfoReply(game, npc, action.text || "");
  }
  if (action.type === "roleFavor") {
    return applyNpcRoleFavor(game, npc, action.text || "");
  }
  if (action.type === "noEncounter") {
    const seconds = clampInt(action.seconds, 30, 600, 180);
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "noEncounter",
      seconds,
      reason: "ai-negotiation",
      source: "npc-ai-worker-guard"
    });
    if (!event.ok) return `${npc.name} 没能给出这个优待：${event.error || "effect 被 VM 拒绝"}。`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    const duration = rest ? `${minutes}分${rest}秒` : `${minutes}分钟`;
    return `${npc.name} 接受了你的说法，暂时帮你避开野外敌人 ${duration}。这只是 AI 协商后的 Worker 效果，不会改动原版遇敌表。`;
  }
  if (action.type === "shopDiscount") {
    const percent = clampInt(action.percent, 5, 30, 10);
    const seconds = clampInt(action.seconds, 60, 1200, 600);
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "shopDiscount",
      npcId: npc.id,
      percent,
      seconds,
      reason: "ai-negotiation",
      source: npc.trade?.source || "npc-ai-worker-guard"
    });
    if (!event.ok) return `${npc.name} 没能给出这个优惠：${event.error || "effect 被 VM 拒绝"}。`;
    return `${npc.name} 点点头：这次给你 ${percent}% 的临时优惠。价格仍按原版商品表读取，只在结账时由 Worker 校验折扣。`;
  }
  if (action.type === "offMenuItem") {
    const offer = chooseRoleFitOffMenuItem(game, npc, action.text || "");
    if (!offer.item) {
      recordNpcVmEvent(game, npc, "shop", "blocked", { action: "offMenu", reason: offer.reason, role: offer.role, text: String(action.text || "").slice(0, 80) });
      return roleMismatchReply(npc, offer);
    }
    if (offer.mode === "gift") {
      const giftKey = `${npc.id}:${offer.item.id}`;
      game.effects ||= {};
      game.effects.npcGifts ||= {};
      if (game.effects.npcGifts[giftKey]) return `${npc.name} 摇摇头：刚才已经给过你了，店里的东西也要留着做生意。`;
      const given = runNpcVmAction(game, npc, {
        type: "give",
        item: offer.item,
        itemId: offer.item.id,
        itemName: offer.item.name,
        qty: 1,
        reason: "ai-off-menu-gift"
      });
      if (!given.ok) return `${npc.name} 想给你 ${offer.item.name}，但 ${given.error || "背包放不下"}。`;
      game.effects.npcGifts[giftKey] = Date.now();
      return `${npc.name} 从柜台后面拿出 ${offer.item.name} 给你。${offer.explain}这是角色相符的小人情，不会凭空生成店外物品。`;
    }
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "offMenuShop",
      npcId: npc.id,
      item: offer.item,
      price: offer.price,
      seconds: 600,
      reason: "ai-off-menu-sale",
      source: offer.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
    });
    if (!event.ok) return `${npc.name} 找到了 ${offer.item.name}，但 ${event.error || "不能摆上临时商品栏"}。`;
    return `${npc.name} 翻了翻柜台后面：可以临时卖你 ${offer.item.name}，价格 ${offer.price} 石币。${offer.explain}输入“买东西”或点商品栏就能购买。`;
  }
  if (action.type === "conditionOverride") {
    const candidate = sourceConditionReliefCandidate(game, npc, action.text || "", action);
    if (!candidate) {
      recordNpcVmEvent(game, npc, "effect", "blocked", {
        effect: "npcConditionOverride",
        reason: "npc-condition-override-no-match",
        eventNo: action.eventNo,
        conditionHash: action.conditionHash,
        conditionKind: action.conditionKind
      });
      return `${npc.name} 摇摇头：现在没有能通融的原脚本条件，还是按规矩来。`;
    }
    const overrideAction = conditionOverrideActionFromCandidate(game, npc, candidate, action.text || "");
    const event = runNpcVmAction(game, npc, {
      type: "effect",
      effect: "npcConditionOverride",
      npcId: npc.id,
      npcName: npc.name,
      eventNo: overrideAction.eventNo,
      conditionHash: overrideAction.conditionHash,
      condition: overrideAction.condition,
      conditionToken: overrideAction.conditionToken,
      conditionKind: overrideAction.conditionKind,
      check: candidate.check,
      substituteStone: overrideAction.substituteStone,
      seconds: clampInt(overrideAction.seconds, 60, 1200, Math.ceil(NPC_CONDITION_OVERRIDE_TTL_MS / 1000)),
      usesLeft: 1,
      reason: "ai-condition-override",
      source: candidate.event.source || npc.script || npc.source || ""
    });
    if (!event.ok) return `${npc.name} 没能通融这个条件：${event.error || "effect 被 VM 拒绝"}。`;
    const cost = Number(overrideAction.substituteStone || 0);
    const fee = cost > 0 ? `，执行原事件前会先收 ${cost} 石币补偿` : "";
    return `${npc.name} 点点头：这次可以通融 ${npcConditionKindLabel(overrideAction.conditionKind) || "脚本条件"}一次${fee}。你再按原脚本和我对话，奖励、传送和 flag 仍由 Worker 按事件 ${overrideAction.eventNo} 校验。`;
  }
  if (action.type === "negotiatePass") {
    return npcEnemyNegotiationReply(game, npc, action.text || "");
  }
  return fallbackNpcReply(npc);
}

function openDialog(game, npc, messages, extra = {}) {
  const debug = npcDebugInfo(npc, game);
  game.dialog = {
    open: true,
    npcId: npc.id,
    npcName: npc.name,
    npcType: isNpcEnemy(npc) ? "NPCEnemy" : npc.type,
    trade: npc.trade ? withTradeState(game, npc.trade, npc) : null,
    petShop: extra.petShop || buildPetShopState(game, npc),
    petFusion: extra.petFusion || buildPetFusionState(game, npc),
    newNpcMan: buildNewNpcManState(game, npc),
    itemPoolShop: extra.itemPoolShop || buildItemPoolShopState(game, npc),
    raceMan: buildRaceManState(game, npc),
    janken: npc.janken || null,
    quiz: buildQuizState(game, npc),
    routeService: buildRouteServiceState(game, npc),
    petSkillShop: extra.petSkillShop || null,
    professionShop: extra.professionShop || buildProfessionShopState(game, npc),
    itemChange: extra.itemChange || buildItemChangeState(game, npc),
    warp: npc.warp || null,
    aiMode: isNpcAiMode(game, npc),
    proposal: extra.proposal || publicNpcProposal(game, npc),
    messages: messages.slice(-12),
    suggestions: dialogSuggestions(npc, game),
    source: dialogSourceLine(debug),
    debug
  };
}

function npcDebugInfo(npc, game = null) {
  const actions = npcActionProfile(npc);
  const map = game ? currentMap(game) : null;
  return {
    source: npc.source || "",
    script: npc.script || "",
    template: npc.template || "",
    type: npc.type || "",
    graphic: npc.graphic || "",
    persona: buildNpcPersona(game, npc, map),
    social: game ? summarizeNpcSocialForDebug(game, npc) : null,
    pendingProposal: game ? publicNpcProposal(game, npc) : null,
    conditionOverrides: game ? compactNpcConditionOverrideDebug(game, npc) : null,
    raceMan: buildRaceManState(game, npc),
    janken: npc.janken || null,
    quiz: buildQuizState(game, npc),
    newNpcMan: buildNewNpcManState(game, npc),
    routeService: buildRouteServiceState(game, npc),
    professionShop: buildProfessionShopState(game, npc),
    timeMan: npc.timeMan || null,
    actions,
    allowedActions: actions.filter((action) => NPC_VM_ACTIONS.has(action)),
    supportedActions: [...NPC_VM_ACTIONS],
    vmTrace: game ? recentNpcVmEvents(game, npc) : [],
    talkFlow: "gmsv CHAR_Talk -> NPC talkedfunc; browser click sends P|hi"
  };
}

function compactNpcConditionOverrideDebug(game, npc) {
  normalizeNpcConditionOverrides(game);
  const active = Object.values(game.effects?.npcConditionOverrides || {})
    .filter((entry) => String(entry.npcId || "") === String(npc?.id || ""))
    .map((entry) => ({
      key: entry.key,
      eventNo: entry.eventNo,
      conditionHash: entry.conditionHash,
      conditionKind: entry.conditionKind,
      conditionToken: entry.conditionToken,
      substituteStone: Number(entry.substituteCost?.stone || 0),
      usesLeft: entry.usesLeft,
      expiresAt: entry.expiresAt
    }));
  const recent = (game.effects?.npcConditionOverrideDebug || [])
    .filter((entry) => !npc || String(entry.npcId || "") === String(npc.id || ""))
    .slice(-8);
  return { active, recent };
}

function dialogSourceLine(debug) {
  const parts = [];
  if (debug.source) parts.push(debug.source);
  if (debug.script && debug.script !== debug.source) parts.push(debug.script);
  if (debug.template && debug.template !== debug.script) parts.push(`template:${debug.template}`);
  if (debug.actions?.length) parts.push(`actions:${debug.actions.join("/")}`);
  return parts.join(" | ") || "参考 gmsv：点击 NPC 后客户端自动送出 P|hi，再由 CHAR_Talk 触发 NPC talkedfunc";
}

function npcActionProfile(npc) {
  const actions = [];
  if (isNpcEnemy(npc)) actions.push("window", "startBattle", "battleAction");
  if (isNpcEnemy(npc) && npc.npcEnemy?.stealItems) actions.push("take");
  if (isNpcEnemy(npc) && (npc.npcEnemy?.addItems?.length || npc.npcEnemy?.postBattleEvents?.some((event) => event.addItems?.length))) actions.push("give");
  if (isNpcEnemy(npc) && (npc.npcEnemy?.heroBattleField || npc.npcEnemy?.postBattleEvents?.some((event) => event.heroBattleField))) actions.push("heroBattleField");
  if (isNpcEnemy(npc) && npc.npcEnemy?.postBattleEvents?.some((event) => event.endSetFlags?.length || event.nowSetFlags?.length)) actions.push("setFlag");
  if (isNpcEnemy(npc) && npc.npcEnemy?.postBattleEvents?.some((event) => event.clearFlags?.length)) actions.push("clearFlag");
  if (npc.trade?.items?.length || /shop/i.test(`${npc.type} ${npc.template}`)) actions.push("shop");
  if (npc.trade?.hasCostFame || npc.trade?.items?.some((item) => tradeItemCostFame(item, npc) > 0)) actions.push("adjustFame");
  if (npc.trade?.hasCostPoint && npc.trade?.items?.some((item) => tradeItemCostPoint(item, npc) > 0)) actions.push("adjustAmPoint");
  if (npc.petShop || /PetShop|petshop/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("petShop");
  if (isPetFusionNpc(npc)) actions.push("petFusion", "window");
  if (npc.itemPoolShop || /PoolItemShop|poolitemshop/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("itemPoolShop");
  if (isRaceManNpc(npc)) actions.push("raceMan", "window", "say");
  if (isJankenNpc(npc)) actions.push("janken", "window", "take", "warp", "say");
  if (isJankenNpc(npc) && (npc.janken?.winItems?.length || npc.janken?.loseItems?.length)) actions.push("give");
  if (isQuizNpc(npc)) actions.push("quiz", "window", "take", "say");
  if (isQuizNpc(npc) && npc.quiz?.rewardItems?.length) actions.push("give");
  if (isQuizNpc(npc) && npc.quiz?.warpTargets?.length) actions.push("warp");
  if (isRouteServiceNpc(npc)) actions.push("routeService", "warp");
  if (isLuckyManNpc(npc)) actions.push("window", "take", "fortune");
  if (npc.petSkillShop?.skillIds?.length || /PetSkill/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("petSkillShop");
  if (isProfessionShopNpc(npc)) actions.push("professionShop", "window");
  if (npc.itemChange?.recipes?.length || /ItemchangeMan|ITEMCHANGE/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("itemChange");
  if (isNewNpcManNpc(npc)) actions.push("appearance", "window", "say");
  if (npc.warp?.target || /warp/i.test(`${npc.type} ${npc.template} ${npc.script}`)) actions.push("warp");
  if (Number(npc.warp?.lastTalkElder || 0) > 0) actions.push("setLastTalkElder");
  if (isHealerNpc(npc)) actions.push("heal");
  if (isSavePointNpc(npc)) actions.push("save");
  if (hasNpcScriptEvents(npc)) {
    actions.push("quest", "window", "give", "take", "setFlag");
    if ((npc.scriptEvents || []).some((event) => event.cleanFlags?.length)) actions.push("clearFlag");
    if ((npc.scriptEvents || []).some((event) => event.messages?.endStop)) actions.push("clearFlag", "adjustCharm");
    if ((npc.scriptEvents || []).some((event) => event.npcWarps?.length)) actions.push("moveNpc");
    if ((npc.scriptEvents || []).some((event) => event.charms?.length)) actions.push("adjustCharm");
    if ((npc.scriptEvents || []).some((event) => event.getPets?.length)) actions.push("givePet");
    if ((npc.scriptEvents || []).some((event) => event.delPets?.length)) actions.push("takePet");
    if ((npc.scriptEvents || []).some((event) => Number(event.missionOver || 0) > 0)) actions.push("missionOver");
    if ((npc.scriptEvents || []).some((event) => Number(event.missionClean || 0) > 0)) actions.push("missionClean");
    if ((npc.scriptEvents || []).some((event) => Number(event.lastTalkElder || 0) > 0)) actions.push("setLastTalkElder");
  }
  if (npcQuestIds(npc).length || npc.questLead) actions.push("quest");
  if (npcDialogueLines(npc).length || /timeman|town|msg|sign/i.test(`${npc.type} ${npc.template}`)) actions.push("say");
  if (!isNpcEnemy(npc)) actions.push("effect");
  return [...new Set(actions)];
}

function recordNpcVmEvent(game, npc, action, status = "ok", detail = {}) {
  game.npcVmEvents ||= [];
  const supported = NPC_VM_ACTIONS.has(action);
  const event = {
    at: new Date().toISOString(),
    npcId: npc.id,
    npcName: npc.name,
    action: supported ? action : "unsupported",
    status: supported ? status : "unsupported",
    supported,
    source: npc.source || "",
    script: npc.script || "",
    template: npc.template || "",
    type: npc.type || "",
    detail: supported ? detail : { ...detail, originalAction: action }
  };
  game.npcVmEvents.push(event);
  game.npcVmEvents = game.npcVmEvents.slice(-40);
  return event;
}

function runNpcVmAction(game, npc, action = {}) {
  const type = String(action.type || action.action || "");
  const status = String(action.status || "ok");
  const mutation = applyNpcVmMutation(game, type, action);
  const event = recordNpcVmEvent(
    game,
    npc,
    type,
    mutation.ok ? status : "blocked",
    npcVmActionDetail(action, mutation)
  );
  event.ok = mutation.ok;
  if (mutation.error) event.error = mutation.error;
  return event;
}

function applyNpcVmMutation(game, type, action) {
  if (!NPC_VM_ACTIONS.has(type)) return { ok: false, mutated: false, error: `unsupported action: ${type || "empty"}` };
  if (type === "setFlag") {
    if (!action.shiftbit) return { ok: true, mutated: false };
    setEventFlag(game, action.shiftbit, action.kind || "end");
    return { ok: true, mutated: true };
  }
  if (type === "clearFlag") {
    if (!action.shiftbit) return { ok: true, mutated: false };
    clearEventFlag(game, action.shiftbit, action.kind || "now-end");
    return { ok: true, mutated: true };
  }
  if (type === "heroBattleField") return applyNpcVmHeroBattleField(game, action);
  if (type === "missionOver") return applyNpcVmMissionOver(game, action);
  if (type === "missionClean") return applyNpcVmMissionClean(game, action);
  if (type === "moveNpc") return applyNpcVmMoveNpc(game, action);
  if (type === "adjustCharm") return applyNpcVmAdjustCharm(game, action);
  if (type === "adjustFame") return applyNpcVmAdjustFame(game, action);
  if (type === "adjustAmPoint") return applyNpcVmAdjustAmPoint(game, action);
  if (type === "take") return applyNpcVmTake(game, action);
  if (type === "give") return applyNpcVmGive(game, action);
  if (type === "takePet") return applyNpcVmTakePet(game, action);
  if (type === "givePet") return applyNpcVmGivePet(game, action);
  if (type === "save") return applyNpcVmSave(game, action);
  if (type === "setLastTalkElder") return applyNpcVmSetLastTalkElder(game, action);
  if (type === "appearance") return applyNpcVmAppearance(game, action);
  if (type === "effect") return applyNpcVmEffect(game, action);
  if (type === "startBattle") return applyNpcVmStartBattle(game, action);
  if (type === "battleAction") return applyNpcVmBattleAction(game, action);
  return { ok: true, mutated: false };
}

function applyNpcVmAppearance(game, action) {
  game.player ||= {};
  const before = Number(game.player.CHAR_BASEIMAGENUMBER || game.player.BaseImageNumber || 0);
  const target = Number(action.imageNo || game.player.CHAR_BASEBASEIMAGENUMBER || game.player.BaseBaseImageNumber || before || 0);
  if (!Number.isFinite(target) || target <= 0) {
    return { ok: false, mutated: false, error: "没有可恢复的人物图像编号" };
  }
  game.effects ||= {};
  delete game.effects.metamo;
  delete game.effects.metamoUntil;
  game.player.CHAR_WORKITEMMETAMO = 0;
  game.player.CHAR_WORKNPCMETAMO = -1;
  game.player.CHAR_BASEIMAGENUMBER = target;
  game.player.CHAR_BASEBASEIMAGENUMBER = target;
  game.player.BaseImageNumber = target;
  game.player.BaseBaseImageNumber = target;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: before !== target || Boolean(action.force),
    before,
    imageNo: target,
    faceImageNo: Number(action.faceImageNo || 0),
    mode: action.mode || "source-npc-newnpcman"
  };
}

function applyNpcVmHeroBattleField(game, action) {
  const floor = Number(action.floor ?? action.heroBattleField ?? 0);
  if (!Number.isFinite(floor) || floor <= 0) {
    return { ok: false, mutated: false, error: "heroBattleField 缺少有效楼层" };
  }
  game.player ||= {};
  const currentHeroFloor = Number(game.player.CHAR_HEROFLOOR ?? game.player.heroFloor ?? game.player.HeroFloor ?? 0) || 0;
  const currentWorkFloor = Number(game.player.CHAR_WORKHEROFLOOR ?? game.player.heroWorkFloor ?? game.player.WorkHeroFloor ?? 0) || 0;
  const nextHeroFloor = Math.max(currentHeroFloor, Math.trunc(floor));
  game.player.CHAR_WORKHEROFLOOR = Math.trunc(floor);
  game.player.heroWorkFloor = Math.trunc(floor);
  game.player.WorkHeroFloor = Math.trunc(floor);
  game.player.CHAR_HEROFLOOR = nextHeroFloor;
  game.player.heroFloor = nextHeroFloor;
  game.player.HeroFloor = nextHeroFloor;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: currentWorkFloor !== Math.trunc(floor) || currentHeroFloor !== nextHeroFloor,
    floor: Math.trunc(floor),
    previousHeroFloor: currentHeroFloor,
    heroFloor: nextHeroFloor
  };
}

function applyNpcVmSave(game, action) {
  ensureFlags(game);
  const now = action.savedAt || new Date().toISOString();
  const sourceId = clampInt(action.sourceId, 0, 63, 0);
  if (sourceId > 0) registerSourceSavePoint(game, sourceId);
  const born = action.born || null;
  game.savePoint = {
    npcId: action.npcId || "",
    npcName: action.npcName || "",
    mapId: action.mapId || game.location?.mapId,
    x: Number(action.x ?? game.location?.x ?? 0),
    y: Number(action.y ?? game.location?.y ?? 0),
    sourceId,
    ...(born ? { born: { ...born } } : {}),
    source: action.source || "",
    savedAt: now
  };
  game.player.LastTalkElder = sourceId;
  game.player.CHAR_LASTTALKELDER = sourceId;
  game.characterFields ||= {};
  game.characterFields.work ||= {};
  game.characterFields.work.CHAR_LASTTALKELDER = sourceId;
  game.character ||= {};
  game.character.updatedAt = now;
  return { ok: true, mutated: true, sourceId, born, savedAt: now };
}

function applyNpcVmSetLastTalkElder(game, action) {
  const sourceId = clampInt(action.sourceId ?? action.elderId ?? action.id, 0, 127, -1);
  if (sourceId < 0) return { ok: false, mutated: false, error: "SetLastTalkelder 缺少有效 elder id" };
  game.player ||= {};
  const before = Number(game.player.CHAR_LASTTALKELDER ?? game.player.LastTalkElder ?? -1);
  game.player.LastTalkElder = sourceId;
  game.player.CHAR_LASTTALKELDER = sourceId;
  game.characterFields ||= {};
  game.characterFields.work ||= {};
  game.characterFields.work.CHAR_LASTTALKELDER = sourceId;
  const born = sourceElderPosition(sourceId);
  const updatedAt = action.savedAt || new Date().toISOString();
  game.lastTalkElder = {
    sourceId,
    ...(born ? { born } : {}),
    source: action.source || "",
    updatedAt
  };
  game.character ||= {};
  game.character.updatedAt = updatedAt;
  return { ok: true, mutated: before !== sourceId || Boolean(action.force), sourceId, born };
}

function sourceElderPosition(sourceId) {
  const born = SOURCE_ELDER_POSITIONS[Number(sourceId)];
  if (!born) return null;
  return { ...born };
}

function applyNpcVmEffect(game, action) {
  game.effects ||= {};
  if (action.effect === "shopDiscount") {
    if (!action.npcId) return { ok: false, mutated: false, error: "shopDiscount 缺少 npcId" };
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 60, 1200, 600);
    const percent = clampInt(action.percent, 5, 30, 10);
    game.effects.shopDiscounts ||= {};
    game.effects.shopDiscounts[action.npcId] = {
      percent,
      until: Date.now() + seconds * 1000,
      reason: action.reason || "npc-effect",
      source: action.source || ""
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, percent, seconds };
  }
  if (action.effect === "offMenuShop") {
    if (!action.npcId || !action.item) return { ok: false, mutated: false, error: "offMenuShop 缺少 npcId 或 item" };
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 60, 1200, 600);
    const item = {
      ...action.item,
      price: Math.max(1, Number(action.price || action.item.price || action.item.cost || 1)),
      offMenu: true,
      source: action.source || action.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
    };
    game.effects.offMenuShop ||= {};
    game.effects.offMenuShop[action.npcId] = {
      until: Date.now() + seconds * 1000,
      reason: action.reason || "npc-effect",
      source: action.source || "",
      items: [item]
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, itemId: item.id, itemName: item.name, price: item.price, seconds };
  }
  if (action.effect === "npcBypass") {
    if (!action.npcId) return { ok: false, mutated: false, error: "npcBypass 缺少 npcId" };
    ensureFlags(game);
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 30, 1200, 300);
    game.flags.npcEnemyDefeats[action.npcId] = {
      until: new Date(Date.now() + seconds * 1000).toISOString(),
      mode: action.mode || "negotiation",
      source: action.source || "",
      reason: action.reason || "npc-effect"
    };
    return { ok: true, mutated: true, effect: action.effect, npcId: action.npcId, seconds, mode: action.mode || "negotiation" };
  }
  if (action.effect === "npcConditionOverride") {
    const npcId = String(action.npcId || "");
    const eventNo = Number(action.eventNo || 0);
    const conditionHash = String(action.conditionHash || "");
    if (!npcId || eventNo <= 0 || !conditionHash) return { ok: false, mutated: false, error: "npcConditionOverride 缺少 npcId/eventNo/conditionHash" };
    const seconds = clampInt(action.seconds ?? action.durationSeconds, 60, 1200, Math.ceil(NPC_CONDITION_OVERRIDE_TTL_MS / 1000));
    const usesLeft = clampInt(action.usesLeft, 1, NPC_CONDITION_OVERRIDE_MAX_USES, 1);
    const entry = normalizeNpcConditionOverride({
      npcId,
      npcName: action.npcName || "",
      eventNo,
      conditionHash,
      condition: action.condition || "",
      conditionToken: action.conditionToken || "",
      conditionKind: action.conditionKind || "",
      check: action.check || null,
      substituteCost: { stone: action.substituteStone ?? action.substituteCost?.stone ?? 0 },
      usesLeft,
      createdAt: Date.now(),
      expiresAt: Date.now() + seconds * 1000,
      reason: action.reason || "npc-effect",
      source: action.source || ""
    });
    if (!entry) return { ok: false, mutated: false, error: "npcConditionOverride 无法规范化" };
    game.effects.npcConditionOverrides ||= {};
    game.effects.npcConditionOverrides[entry.key] = entry;
    recordNpcConditionOverrideDebug(game, entry, "created");
    return {
      ok: true,
      mutated: true,
      effect: action.effect,
      npcId,
      eventNo,
      conditionHash,
      conditionKind: entry.conditionKind,
      substituteStone: entry.substituteCost.stone,
      usesLeft,
      seconds
    };
  }
  if (action.effect !== "noEncounter") return { ok: false, mutated: false, error: `unsupported effect: ${action.effect || "empty"}` };
  const seconds = clampInt(action.seconds ?? action.durationSeconds, 30, 600, 180);
  const until = Math.max(Number(game.effects.noEncounterUntil || 0), Date.now() + seconds * 1000);
  game.effects.noEncounterUntil = until;
  game.effects.noEncounterReason = action.reason || "npc-effect";
  game.effects.noEncounterSource = action.source || "";
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.encounterSteps = 0;
  return { ok: true, mutated: true, effect: action.effect, seconds, until };
}

function applyNpcVmTake(game, action) {
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  if (qty <= 0) return { ok: true, mutated: false };
  const key = npcVmItemKey(action);
  if (isStoneKey(key)) {
    if (Number(game.player.stone || 0) < qty) return { ok: false, mutated: false, error: "石币不够" };
    game.player.stone = Number(game.player.stone || 0) - qty;
    syncStoneItem(game);
    return { ok: true, mutated: true };
  }
  if (action.itemId != null || (typeof action.item === "object" && action.item?.id != null)) {
    const id = Number(action.itemId ?? action.item.id);
    const item = game.inventory?.find((entry) => Number(entry.id) === id && Number(entry.qty || 0) > 0);
    if (!item || Number(item.qty || 0) < qty) return { ok: false, mutated: false, error: "道具不足" };
    item.qty = Number(item.qty || 0) - qty;
    game.inventory = (game.inventory || []).filter((entry) => entry.id === "stone" || Number(entry.qty || 0) > 0);
    return { ok: true, mutated: true };
  }
  return { ok: true, mutated: false };
}

function applyNpcVmGive(game, action) {
  let mutated = false;
  const exp = npcVmAmount(action.exp, 0);
  let levelUps = [];
  if (exp > 0) {
    addPlayerExp(game, exp);
    levelUps = maybeLevelPlayer(game);
    mutated = true;
  }
  const stone = npcVmAmount(action.stone, 0);
  if (stone > 0) {
    game.player.stone = Number(game.player.stone || 0) + stone;
    syncStoneItem(game);
    mutated = true;
  }
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  const item = npcVmGiveItem(action);
  if (item && qty > 0) {
    if (isStoneKey(item.id)) {
      game.player.stone = Number(game.player.stone || 0) + qty;
      syncStoneItem(game);
      mutated = true;
    } else {
      if (!canCarryItem(game, item)) return { ok: false, mutated, error: `背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具` };
      addInventoryItem(game, item, qty);
      mutated = true;
    }
  }
  if (mutated) syncCharacterFields(game);
  return {
    ok: true,
    mutated,
    exp,
    stone,
    levelUps,
    playerLevel: Number(game.player?.level || 1),
    playerExp: Number(game.player?.exp || 0),
    skillUpPoint: Number(game.player?.skillUpPoint || 0)
  };
}

function applyNpcVmTakePet(game, action) {
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  if (qty <= 0) return { ok: true, mutated: false };
  const spec = {
    petId: Number(action.petId),
    level: Number(action.level),
    op: action.op || "=",
    petName: action.petName || ""
  };
  const indexes = petIndexesInPartyMatching(game, spec);
  if (indexes.length < qty) {
    const name = action.petName || conditionPetName(game, spec.petId) || `pet ${spec.petId}`;
    return { ok: false, mutated: false, error: `缺少 ${name} Lv${spec.op}${spec.level} x${qty}` };
  }
  const removedPets = indexes.slice(0, qty)
    .sort((a, b) => b - a)
    .map((index) => {
      const [pet] = game.pets.splice(index, 1);
      return {
        petId: pet?.PetId,
        name: pet?.Name,
        level: Number(pet?.Lv || 1),
        index
      };
    })
    .filter(Boolean)
    .reverse();
  ensurePetFormation(game);
  syncCharacterFields(game);
  return { ok: true, mutated: true, removedPets };
}

function applyNpcVmGivePet(game, action) {
  const qty = npcVmAmount(action.qty ?? action.amount, 1);
  if (qty <= 0) return { ok: true, mutated: false };
  if ((game.pets || []).length + qty > PET_CAPACITY) {
    return { ok: false, mutated: false, error: `宠物栏已满，最多携带 ${PET_CAPACITY} 只宠物` };
  }
  const enemyIds = (action.enemyIds || [action.enemyId])
    .map((id) => Number(id))
    .filter((id) => id > 0);
  if (!enemyIds.length) return { ok: false, mutated: false, error: "GetPet 缺少 enemy id" };
  const givenPets = [];
  for (let i = 0; i < qty; i += 1) {
    const enemyId = enemyIds.length === 1 ? enemyIds[0] : enemyIds[randInt(enemyIds.length)];
    const enemy = cache?.enemySpecsById?.has(enemyId)
      ? createEnemyFromEnemySpec(cache, enemyId, {
        source: action.source || action.reason || "source-changeevent-getpet"
      })
      : createEnemy(cache, enemyId, 1);
    if (!enemy) return { ok: false, mutated: Boolean(givenPets.length), error: `找不到 GetPet enemy ${enemyId}` };
    const pet = normalizeCapturedPet(enemy);
    pet.EventPet = true;
    pet.EventSource = action.source || action.reason || "source-changeevent-getpet";
    game.pets.push(pet);
    givenPets.push({
      enemyId,
      petId: pet.PetId,
      name: pet.Name,
      level: Number(pet.Lv || 1)
    });
  }
  ensurePetFormation(game);
  syncCharacterFields(game);
  return { ok: true, mutated: true, givenPets };
}

function applyNpcVmStartBattle(game, action) {
  if (!action.enemy) return { ok: false, mutated: false, error: "没有可用的遇敌资料" };
  const enemyParty = Array.isArray(action.enemies) && action.enemies.length
    ? action.enemies.map((enemy) => ({ ...enemy }))
    : [{ ...action.enemy }];
  game.encounter = enemyParty[0];
  game.battle = null;
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.walk.encounterSteps = 0;
  const activePet = getActivePet(game);
  if (activePet) {
    ensureBattleState(game, activePet, game.encounter);
    if (game.battle) {
      game.battle.source = action.source
        ? `npc-action-vm startBattle from ${action.source}`
        : `npc-action-vm startBattle from ${GMSV_DATA_SOURCE}/encount.txt`;
      game.battle.enemyParty = enemyParty;
      game.battle.activeEnemyIndex = 0;
      game.battle.defeatedEnemies = [];
    }
  }
  return { ok: true, mutated: true };
}

function applyNpcVmBattleAction(game, action) {
  try {
    const outcome = performBattleAction(game, action.move || action.battleAction || "attack");
    recordBattleOutcome(game, outcome);
    return { ok: true, mutated: true, outcome };
  } catch (error) {
    return { ok: false, mutated: false, error: error.message || "战斗动作失败" };
  }
}

function applyNpcVmMissionOver(game, action) {
  const mission = Number(action.mission ?? action.missionOver ?? 0);
  if (!mission) return { ok: true, mutated: false };
  const state = activeAngelMission(game);
  if (!state || Number(state.mission || 0) !== mission) {
    return {
      ok: false,
      mutated: false,
      error: "当前没有匹配的勇者任务",
      mission,
      missionState: compactAngelMissionState(state)
    };
  }
  const before = compactAngelMissionState(state);
  state.flag = ANGEL_MISSION_FLAGS.HERO_COMPLETE;
  state.status = "HERO_COMPLETE";
  state.completedAt = new Date().toISOString();
  state.completedBy = game.player?.name || "";
  game.flags.angelMission = state;
  const heroCount = Number(game.player?.heroCompleteCount ?? game.player?.HeroCnt ?? game.player?.CHAR_HEROCNT ?? 0) + 1;
  game.player.heroCompleteCount = heroCount;
  game.player.HeroCnt = heroCount;
  game.player.CHAR_HEROCNT = heroCount;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: true,
    mission,
    missionBefore: before,
    missionAfter: compactAngelMissionState(state),
    heroCompleteCount: heroCount
  };
}

function applyNpcVmMissionClean(game, action) {
  const mission = Number(action.mission ?? action.missionClean ?? 0);
  const state = activeAngelMission(game);
  if (mission && state && Number(state.mission || 0) !== mission) {
    return {
      ok: false,
      mutated: false,
      error: "当前没有匹配的天使任务可清理",
      mission,
      missionState: compactAngelMissionState(state)
    };
  }
  if (!state) return { ok: true, mutated: false, mission };
  const before = compactAngelMissionState(state);
  game.flags.angelMission = null;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: true,
    mission: mission || Number(state.mission || 0),
    missionBefore: before,
    missionAfter: null
  };
}

function applyNpcVmMoveNpc(game, action) {
  if (!action.npcId) return { ok: false, mutated: false, error: "moveNpc 缺少 npcId" };
  ensureFlags(game);
  const points = Array.isArray(action.points) ? action.points : [];
  const target = action.target || (() => {
    if (!points.length) return null;
    const counter = Number(game.flags.npcWarpCounters[action.npcId] || 0);
    game.flags.npcWarpCounters[action.npcId] = counter + 1;
    return points[counter % points.length];
  })();
  if (!target) return { ok: false, mutated: false, error: "moveNpc 缺少目标坐标" };
  const mapId = String(target.mapId || game.location?.mapId || "");
  const targetMap = WORLD.maps[mapId];
  if (!targetMap) {
    return {
      ok: false,
      mutated: false,
      error: `moveNpc 目标地图 ${mapId} 未加载`,
      target: { mapId, x: target.x, y: target.y },
      pointCount: points.length
    };
  }
  const width = Math.max(1, Number(targetMap.size?.[0]) || 1);
  const height = Math.max(1, Number(targetMap.size?.[1]) || 1);
  const x = clampInt(target.x, 0, width - 1, 0);
  const y = clampInt(target.y, 0, height - 1, 0);
  game.flags.npcPositions[action.npcId] = {
    mapId,
    x,
    y,
    reason: action.reason || "npc-move",
    source: action.source || "",
    eventNo: action.eventNo,
    updatedAt: new Date().toISOString()
  };
  return { ok: true, mutated: true, target: { mapId, x, y }, pointCount: points.length };
}

function applyNpcVmAdjustCharm(game, action) {
  const amount = Number(action.amount ?? action.charm ?? 0);
  if (!Number.isFinite(amount) || amount === 0) return { ok: true, mutated: false };
  game.player ||= {};
  normalizePlayerRuntime(game.player);
  const before = Number(game.player.charm || 0);
  const after = clampInt(before + amount, 0, 100, before);
  game.player.charm = after;
  game.player.Charm = after;
  game.player.CHARM = after;
  game.player.WorkFixCharm = after;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: after !== before,
    charmBefore: before,
    charmAfter: after,
    charmAmount: amount
  };
}

function applyNpcVmAdjustFame(game, action) {
  const amount = Number(action.amount ?? action.fame ?? 0);
  if (!Number.isFinite(amount) || amount === 0) return { ok: true, mutated: false };
  game.player ||= {};
  normalizePlayerRuntime(game.player);
  const before = Number(game.player.fame || 0);
  const after = Math.max(0, Math.floor(before + amount));
  if (after === before) {
    return { ok: amount >= 0, mutated: false, fameBefore: before, fameAfter: after, fameAmount: amount };
  }
  if (amount < 0 && before + amount < 0) return { ok: false, mutated: false, error: "声望不足", fameBefore: before, fameAmount: amount };
  game.player.fame = after;
  game.player.Fame = after;
  game.player.CHAR_FAME = after;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: true,
    fameBefore: before,
    fameAfter: after,
    fameAmount: amount
  };
}

function applyNpcVmAdjustAmPoint(game, action) {
  const amount = Number(action.amount ?? action.point ?? action.amPoint ?? 0);
  if (!Number.isFinite(amount) || amount === 0) return { ok: true, mutated: false };
  game.player ||= {};
  normalizePlayerRuntime(game.player);
  const before = Number(game.player.amPoint || 0);
  const after = Math.max(0, Math.floor(before + amount));
  if (after === before) {
    return { ok: amount >= 0, mutated: false, amPointBefore: before, amPointAfter: after, amPointAmount: amount };
  }
  if (amount < 0 && before + amount < 0) return { ok: false, mutated: false, error: "点数不足", amPointBefore: before, amPointAmount: amount };
  game.player.amPoint = after;
  game.player.AMPoint = after;
  game.player.AMPOINT = after;
  game.player.CHAR_AMPOINT = after;
  syncCharacterFields(game);
  return {
    ok: true,
    mutated: true,
    amPointBefore: before,
    amPointAfter: after,
    amPointAmount: amount
  };
}

function npcVmActionDetail(action, mutation) {
  const { type: _type, action: _action, status: _status, item, enemy, points: _points, ...detail } = action;
  const out = {
    executor: "npc-action-vm",
    ...detail,
    mutated: Boolean(mutation.mutated)
  };
  if (item != null && typeof item === "object") {
    if (out.itemId == null && item.id != null) out.itemId = item.id;
    if (out.itemName == null && item.name) out.itemName = item.name;
  } else if (item != null) {
    out.item = item;
  }
  if (enemy && typeof enemy === "object") {
    out.enemyNo = enemy.No;
    out.enemyId = enemy.EnemyId;
    out.enemyTempNo = enemy.EnemyTempNo;
    out.enemyName = enemy.Name;
    out.enemyLevel = enemy.Lv;
    out.enemyImage = enemy.ImgNo;
    out.captureRate = enemy.CaptureRate;
  }
  if (mutation.outcome) {
    out.outcome = {
      result: mutation.outcome.result,
      enemyName: mutation.outcome.enemyName,
      petName: mutation.outcome.petName,
      exp: mutation.outcome.exp,
      stone: mutation.outcome.stone,
      rate: mutation.outcome.rate,
      itemUse: mutation.outcome.itemUse,
      playerAction: mutation.outcome.playerAction,
      enemyAi: mutation.outcome.enemyAi,
      playerEscape: mutation.outcome.playerEscape,
      defeatedEnemies: mutation.outcome.defeatedEnemies,
      escapedEnemies: mutation.outcome.escapedEnemies,
      nextEnemyName: mutation.outcome.nextEnemyName,
      log: mutation.outcome.log
    };
  }
  if (mutation.levelUps?.length) out.levelUps = mutation.levelUps;
  if (mutation.removedPets?.length) out.removedPets = mutation.removedPets;
  if (mutation.givenPets?.length) out.givenPets = mutation.givenPets;
  if (mutation.target) out.target = mutation.target;
  if (mutation.pointCount != null) out.pointCount = mutation.pointCount;
  if (mutation.charmBefore != null) out.charmBefore = mutation.charmBefore;
  if (mutation.charmAfter != null) out.charmAfter = mutation.charmAfter;
  if (mutation.charmAmount != null) out.charmAmount = mutation.charmAmount;
  if (mutation.fameBefore != null) out.fameBefore = mutation.fameBefore;
  if (mutation.fameAfter != null) out.fameAfter = mutation.fameAfter;
  if (mutation.fameAmount != null) out.fameAmount = mutation.fameAmount;
  if (mutation.amPointBefore != null) out.amPointBefore = mutation.amPointBefore;
  if (mutation.amPointAfter != null) out.amPointAfter = mutation.amPointAfter;
  if (mutation.amPointAmount != null) out.amPointAmount = mutation.amPointAmount;
  if (mutation.playerLevel != null) out.playerLevel = mutation.playerLevel;
  if (mutation.playerExp != null) out.playerExp = mutation.playerExp;
  if (mutation.skillUpPoint != null) out.skillUpPoint = mutation.skillUpPoint;
  if (mutation.missionBefore !== undefined) out.missionBefore = mutation.missionBefore;
  if (mutation.missionAfter !== undefined) out.missionAfter = mutation.missionAfter;
  if (mutation.heroCompleteCount != null) out.heroCompleteCount = mutation.heroCompleteCount;
  if (mutation.error) out.error = mutation.error;
  return out;
}

function npcVmAmount(value, fallback) {
  const amount = Number(value ?? fallback);
  if (!Number.isFinite(amount)) return fallback;
  return Math.max(0, Math.floor(amount));
}

function npcVmItemKey(action) {
  if (action.item != null && typeof action.item === "object") return action.item.id;
  return action.item ?? action.itemId ?? action.itemName;
}

function npcVmGiveItem(action) {
  if (action.item != null && typeof action.item === "object") return action.item;
  if (action.itemId == null && action.item == null) return null;
  if (isStoneKey(action.item)) return { id: "stone", name: "石币" };
  return {
    id: action.itemId ?? action.item,
    name: action.itemName || `item ${action.itemId ?? action.item}`,
    image: action.image,
    type: action.itemType || action.typeName,
    useField: action.useField,
    target: action.target,
    level: action.level,
    price: action.price,
    cost: action.cost,
    description: action.description
  };
}

function isStoneKey(value) {
  const key = String(value ?? "").toLowerCase();
  return key === "stone" || key === "stones" || key === "石币";
}

function recentNpcVmEvents(game, npc) {
  return (game.npcVmEvents || [])
    .filter((event) => event.npcId === npc.id)
    .slice(-8);
}

function availableTradeItems(game, npc) {
  const base = npc.trade?.items || [];
  const extras = activeOffMenuItems(game, npc);
  const seen = new Set();
  return [...base, ...extras].filter((item) => {
    const key = Number(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function activeOffMenuItems(game, npc) {
  const entry = game.effects?.offMenuShop?.[npc.id];
  if (!entry) return [];
  const until = Number(entry.until || 0);
  if (!Number.isFinite(until) || until <= Date.now()) {
    if (game.effects?.offMenuShop) delete game.effects.offMenuShop[npc.id];
    return [];
  }
  return (entry.items || []).map((item) => ({ ...item, offMenu: true, offMenuUntil: until }));
}

function withTradeState(game, trade, npc = null) {
  const state = inventoryState(game);
  const discount = npc ? shopDiscountForNpc(game, npc) : null;
  const items = npc ? availableTradeItems(game, npc) : (trade.items || []);
  const sellItems = npc ? sellableInventoryItems(game, npc) : [];
  return {
    ...trade,
    noteMessage: trade.noteMessage || "",
    discount,
    inventory: state,
    sellRate: npc ? tradeSellRate(npc) : Number(trade.sellRate || 0),
    sellItems,
    playerFame: Number(game.player?.fame || 0),
    playerPoint: Number(game.player?.amPoint || 0),
    items: items.map((item) => {
      const sourcePrice = Number(item.price || item.cost || 0);
      const price = npc ? discountedShopPrice(game, npc, item) : sourcePrice;
      const costFame = tradeItemCostFame(item, npc);
      const fameAffordable = Number(game.player?.fame || 0) >= costFame;
      const costPoint = tradeItemCostPoint(item, npc);
      const pointAffordable = Number(game.player?.amPoint || 0) >= costPoint;
      return {
        ...item,
        sourcePrice,
        discountPrice: price,
        discountPercent: discount?.percent || 0,
        price,
        costFame,
        fameAffordable,
        costPoint,
        pointAffordable,
        affordable: game.player.stone >= price && fameAffordable && pointAffordable,
        canCarry: canCarryItem(game, item)
      };
    })
  };
}

function buildProfessionShopState(game, npc) {
  const shop = npc?.professionShop;
  if (!shop?.skills?.length) return null;
  const player = game.player || {};
  const professionClass = Number(player.professionClass || player.ProfessionClass || player.PROFESSION_CLASS || 0);
  const transmigration = Number(player.transmigration || player.Transmigration || player.TRANSMIGRATION || 0);
  const professionSkillPoint = Number(player.professionSkillPoint || player.ProfessionSkillPoint || player.PROFESSION_SKILL_POINT || 0);
  const stone = Number(player.stone || 0);
  const learned = normalizeProfessionSkills(player.professionSkills || player.ProfessionSkills || []);
  const learnedLevel = (skillId) => playerProfessionSkillLevel(player, skillId);
  const skillRate = Number(shop.skillRate || 1) || 1;
  const minTrans = Number(shop.minTrans || 0) || 0;
  const skills = (shop.skills || []).map((skill) => {
    const skillClass = Number(skill.professionClass || 0);
    const sourceCost = Math.max(0, Number(skill.sourceCost || 0));
    const cost = Math.max(0, Math.round(sourceCost * skillRate));
    const currentLevel = learnedLevel(skill.id);
    const prerequisites = (skill.prerequisites || []).map((req) => {
      const current = learnedLevel(req.skillId);
      return {
        skillId: Number(req.skillId || 0),
        name: professionSkillName(shop, req.skillId),
        percent: Number(req.percent || 0),
        current,
        ok: current >= Number(req.percent || 0)
      };
    });
    const classEligible = professionClass > 0 && (!skillClass || skillClass === 4 || professionClass === skillClass);
    const transEligible = !minTrans || transmigration >= minTrans;
    const pointEligible = professionSkillPoint > 0;
    const affordable = stone >= cost;
    const alreadyKnown = currentLevel > 0;
    const prereqOk = prerequisites.every((req) => req.ok);
    const blockedReason = alreadyKnown
      ? "已经学会"
      : !professionClass
        ? "尚未转职"
        : !classEligible
          ? `需要${skill.professionClassName || professionClassName(skillClass)}职业`
          : !transEligible
            ? `需要转生 ${minTrans} 次`
            : !pointEligible
              ? "职业技能点不足"
              : !affordable
                ? "石币不足"
                : !prereqOk
                  ? `前置技能不足：${prerequisites.filter((req) => !req.ok).map((req) => `${req.name} ${req.current}/${req.percent}`).join("、")}`
                  : "";
    return {
      ...skill,
      id: Number(skill.id || 0),
      sourceCost,
      cost,
      currentLevel,
      alreadyKnown,
      prerequisites,
      classEligible,
      transEligible,
      pointEligible,
      affordable,
      learnable: !blockedReason,
      blockedReason
    };
  });
  return {
    kind: shop.kind || "profession-skill",
    source: shop.source || `${GMSV_DATA_SOURCE}/npc`,
    skillRate,
    classId: Number(shop.classId || 0),
    className: shop.className || professionClassName(shop.classId),
    minTrans,
    transRequirements: shop.transRequirements || [],
    messages: {
      main: shop.mainMessage || "",
      start: shop.startMessage || "",
      error: shop.errorMessage || "",
      trans: shop.transMessage || "",
      nothing: shop.nothingMessage || ""
    },
    player: {
      professionClass,
      professionClassName: professionClassName(professionClass),
      transmigration,
      professionSkillPoint,
      learned
    },
    stone,
    skills
  };
}

function professionSkillName(shop, skillId) {
  const id = Number(skillId || 0);
  return (shop?.skills || []).find((skill) => Number(skill.id || 0) === id)?.name || `职业技能 ${id}`;
}

function initialProfessionSkillLevel(skillId) {
  return [63, 64, 65].includes(Number(skillId)) ? 50 : 10;
}

function professionClassName(id) {
  const value = Number(id) || 0;
  if (value === 1) return "战士";
  if (value === 2) return "魔法师";
  if (value === 3) return "追猎者";
  if (value === 4) return "通用";
  return "未转职";
}

function buildPetSkillShopState(data, game, npc) {
  const shop = npc.petSkillShop;
  if (!shop?.skillIds?.length) return null;
  const activeIndex = getActivePetIndex(game);
  const activePet = activeIndex >= 0 ? game.pets[activeIndex] || null : null;
  const skillRate = Number(shop.skillRate || 1) || 1;
  const currentSkillIds = Array.from({ length: 7 }, (_, index) => Number(activePet?.PetSkillIds?.[index] || activePet?.PetSkills?.[index]?.Id || 0));
  const firstEmptySlot = currentSkillIds.findIndex((id) => !id);
  const defaultSlotIndex = firstEmptySlot >= 0 ? firstEmptySlot : 0;
  const skills = shop.skillIds
    .map((id) => data.skills.get(Number(id)))
    .filter(Boolean)
    .map((skill) => {
      const sourceCost = Math.max(0, Number(skill.Cost || 0));
      const cost = Math.max(0, Math.round(sourceCost * skillRate));
      return {
        id: Number(skill.Id || 0),
        name: skill.Name || `技能 ${skill.Id}`,
        description: truncateText(skill.Des || skill.Option || skill.FuncName || "", 72),
        func: skill.FuncName || "",
        target: Number(skill.Target || 0),
        sourceCost,
        cost,
        affordable: Number(game.player.stone || 0) >= cost,
        alreadyKnown: currentSkillIds.includes(Number(skill.Id || 0)),
        battleSupported: Boolean(skill.BattleSupported),
        defaultSlotIndex
      };
    });
  const slots = Array.from({ length: 7 }, (_, index) => {
    const skill = activePet?.PetSkills?.[index] || null;
    return {
      index,
      skillId: Number(activePet?.PetSkillIds?.[index] || skill?.Id || 0),
      name: skill?.Name || "",
      empty: !Number(activePet?.PetSkillIds?.[index] || skill?.Id || 0)
    };
  });
  return {
    kind: shop.kind || "pet-skill",
    source: shop.source || `${GMSV_DATA_SOURCE}/npc`,
    skillRate,
    inventory: inventoryState(game),
    stone: Number(game.player.stone || 0),
    activePet: activePet ? {
      index: activeIndex,
      name: activePet.Name || "宠物",
      level: Number(activePet.Lv || 1),
      hp: Number(activePet.Hp || 0),
      maxHp: Number(activePet.WorkMaxHp || activePet.Hp || 0)
    } : null,
    pets: (game.pets || []).map((pet, index) => ({
      index,
      name: pet.Name || `宠物 ${index + 1}`,
      level: Number(pet.Lv || 1),
      active: index === activeIndex
    })),
    slots,
    skills
  };
}

function buildPetShopState(game, npc) {
  const shop = npc?.petShop;
  if (!shop) return null;
  const pool = ensurePetPool(game);
  const activeIndex = getActivePetIndex(game);
  return {
    kind: shop.kind || (shop.poolEnabled ? "pet-pool" : "pet-shop"),
    source: shop.source || npc.script || npc.source || "",
    poolEnabled: Boolean(shop.poolEnabled),
    poolCost: Number(shop.poolCost || 200),
    normalRate: Number(shop.normalRate || 1),
    specialRate: Number(shop.specialRate || 1.2),
    messages: shop.messages || {},
    stone: Number(game.player?.stone || 0),
    carry: {
      used: (game.pets || []).length,
      capacity: PET_CAPACITY,
      activeIndex
    },
    pool: {
      used: pool.length,
      capacity: PET_POOL_CAPACITY
    },
    pets: (game.pets || []).map((pet, index) => compactPetShopPet(game, npc, pet, index, index === activeIndex)),
    pooledPets: pool.map((pet, index) => compactPetShopPet(game, npc, pet, index, false))
  };
}

function buildItemPoolShopState(game, npc) {
  const shop = npc?.itemPoolShop;
  if (!shop) return null;
  const pool = ensureItemPool(game);
  const inventoryItems = (game.inventory || [])
    .filter((item) => canPoolInventoryItem(item))
    .map((item) => {
      hydrateInventoryItemFromSource(item);
      return {
        id: Number(item.id),
        name: item.name || item.secretName || `道具 ${Number(item.id)}`,
        qty: Number(item.qty || 0),
        image: Number(item.image || 0),
        description: truncateText(item.description || item.option || "", 54),
        canDeposit: true
      };
    });
  return {
    kind: shop.kind || "item-pool",
    source: shop.source || npc.script || npc.source || "",
    cost: Math.max(0, Number(shop.cost || 0) || 0),
    messages: shop.messages || {},
    stone: Number(game.player?.stone || 0),
    inventory: inventoryState(game),
    pool: itemPoolState(game),
    items: inventoryItems,
    pooledItems: pool.map((item, index) => ({
      index,
      id: Number(item.id),
      name: item.name || item.secretName || `道具 ${Number(item.id)}`,
      qty: Number(item.qty || 1),
      image: Number(item.image || 0),
      description: truncateText(item.description || item.option || "", 54),
      source: item.PoolSource || item.source || ""
    }))
  };
}

function compactPetShopPet(game, npc, pet, index, active = false) {
  const cost = petShopPetCost(game, npc, pet);
  return {
    index,
    name: pet?.Name || `宠物 ${index + 1}`,
    level: Number(pet?.Lv || 1),
    hp: Number(pet?.Hp || 0),
    maxHp: Number(pet?.WorkMaxHp || pet?.Hp || 0),
    image: Number(pet?.ImgNo || pet?.BaseImageNumber || pet?.CHAR_BASEBASEIMAGENUMBER || 0),
    petId: Number(pet?.PetId || 0),
    active,
    cost,
    affordable: Number(game.player?.stone || 0) >= cost,
    specialRate: isSpecialPetShopImage(npc, pet)
  };
}

function petShopPetCost(game, npc, pet) {
  const shop = npc?.petShop || {};
  const level = Math.max(1, Number(pet?.Lv || 1) || 1);
  const getLevel = Math.max(1, Number(pet?.PetGetLv || pet?.GetLv || pet?.GetLevel || 1) || 1);
  const rareValue = Number(pet?.Rare ?? pet?.CHAR_RARE ?? 0);
  const rare = rareValue <= 0 ? 1 : rareValue === 1 ? 5 : 8;
  const levelCost = level * level * 10;
  const getLevelCost = getLevel * getLevel * 10;
  const baseCost = Math.max(0, (levelCost - getLevelCost) + (level * 10)) * rare;
  const sourceRate = isSpecialPetShopImage(npc, pet)
    ? Number(shop.specialRate || 1.2)
    : Number(shop.normalRate || 1);
  const playerCharm = Number(game.player?.WorkFixCharm ?? game.player?.charm ?? 50) || 50;
  const petAi = Number(pet?.WorkFixAi ?? pet?.CHAR_WORKFIXAI ?? pet?.Loyalty ?? pet?.loyalty ?? 0) || 0;
  const charmFactor = Math.max(20, playerCharm + petAi) / 200;
  const cost = Math.round(baseCost * (Number.isFinite(sourceRate) && sourceRate > 0 ? sourceRate : 1) * charmFactor);
  return clampInt(cost, 1, 1000000, Number(shop.poolCost || 200) || 200);
}

function isSpecialPetShopImage(npc, pet) {
  const image = Number(pet?.ImgNo || pet?.BaseImageNumber || pet?.CHAR_BASEBASEIMAGENUMBER || 0);
  if (!image) return false;
  return (npc?.petShop?.specialPetImages || []).some(([start, end]) => image >= Number(start) && image <= Number(end));
}

function buildItemChangeState(game, npc) {
  const itemChange = npc?.itemChange;
  if (!itemChange?.recipes?.length) return null;
  return {
    kind: itemChange.kind || "item-change",
    source: itemChange.source || npc.script || npc.source || "",
    startMessage: itemChange.startMessage || "",
    menuHead: itemChange.menuHead || "",
    needHead: itemChange.needHead || "",
    failMessage: itemChange.failMessage || "",
    inventory: inventoryState(game),
    stone: Number(game.player?.stone || 0),
    recipes: itemChange.recipes.slice(0, 40).map((recipe) => {
      const status = itemChangeRecipeStatus(game, recipe);
      return {
        ...recipe,
        canChange: Boolean(status.ok),
        affordable: Boolean(status.stoneOk),
        readyItems: Boolean(status.itemsOk),
        canCarry: Boolean(status.capacityOk),
        conditionOk: Boolean(status.condition?.ok ?? true),
        missing: status.missing,
        unmet: compactConditionUnmet(status.condition, 4),
        blockedReason: status.ok ? "" : itemChangeBlockedReason(status)
      };
    })
  };
}

function itemChangeRecipeStatus(game, recipe = {}) {
  const condition = String(recipe.free || "").trim()
    ? characterConditionStatus(game, recipe.free)
    : { ok: true, reason: "", groups: [] };
  const requirements = recipe.delItems?.length ? recipe.delItems : recipe.needItems || [];
  const missing = requirements
    .map((item) => ({
      id: Number(item.id),
      name: item.name || conditionItemName(game, item.id) || `item ${item.id}`,
      qty: Math.max(1, Number(item.qty || 1)),
      have: inventoryQty(game, item.id)
    }))
    .filter((item) => item.have < item.qty);
  const delGold = Math.max(0, Number(recipe.delGold || 0));
  const stoneOk = Number(game.player?.stone || 0) >= delGold;
  const capacityOk = canReceiveItemChangeResult(game, recipe);
  return {
    ok: Boolean(condition.ok) && missing.length === 0 && stoneOk && capacityOk,
    condition,
    missing,
    stoneOk,
    itemsOk: missing.length === 0,
    capacityOk,
    delGold
  };
}

function canReceiveItemChangeResult(game, recipe = {}) {
  const addItems = recipe.addItems || [];
  if (!addItems.length) return true;
  const qtyById = new Map((game.inventory || [])
    .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
    .map((item) => [Number(item.id), Number(item.qty || 0)]));
  for (const item of recipe.delItems || []) {
    const id = Number(item.id);
    const next = Math.max(0, Number(qtyById.get(id) || 0) - Number(item.qty || 1));
    if (next > 0) qtyById.set(id, next);
    else qtyById.delete(id);
  }
  for (const item of addItems) {
    const id = Number(item.id);
    if (!Number.isFinite(id) || id <= 0) continue;
    qtyById.set(id, Number(qtyById.get(id) || 0) + Number(item.qty || 1));
  }
  return qtyById.size <= INVENTORY_CAPACITY;
}

function itemChangeBlockedReason(status = {}) {
  if (status.missing?.length) {
    return `材料不足：${status.missing.map((item) => `${item.name} ${item.have}/${item.qty}`).join("、")}`;
  }
  if (!status.stoneOk) return `石币不够：需要 ${Number(status.delGold || 0)}`;
  if (!status.capacityOk) return `背包已满，最多携带 ${INVENTORY_CAPACITY} 种道具`;
  if (status.condition && !status.condition.ok) {
    const unmet = compactConditionUnmet(status.condition, 3).map((item) => item.itemName || item.token || item.type).filter(Boolean);
    return unmet.length ? `条件未满足：${unmet.join("、")}` : "条件未满足";
  }
  return "加工条件不足";
}

function sellableInventoryItems(game, npc) {
  return (game.inventory || [])
    .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
    .map((item) => {
      const sourcePrice = sourceItemPrice(item);
      const sellPrice = sellItemPrice(npc, item);
      const sellRate = tradeSellRateForItem(npc, item);
      return {
        ...item,
        sourcePrice,
        sellPrice,
        sellRate,
        specialSellRate: isSpecialSellItem(npc, item) ? sellRate : null,
        sellable: sellPrice > 0,
        reason: sellPrice > 0 ? "" : sellBlockReason(npc, item, sourcePrice)
      };
    });
}

function sellItemPrice(npc, item) {
  const sourcePrice = sourceItemPrice(item);
  if (sourcePrice <= 0) return 0;
  if (!itemMatchesTradeSellFilter(npc, item)) return 0;
  const rate = tradeSellRateForItem(npc, item);
  if (rate <= 0) return 0;
  return Math.max(1, Math.floor(sourcePrice * rate));
}

const SOURCE_SHOP_ITEM_TYPES = Object.freeze({
  FIST: 0,
  AXE: 1,
  CLUB: 2,
  SPEAR: 3,
  BOW: 4,
  SHIELD: 5,
  HELM: 6,
  ARMOUR: 7,
  BRACELET: 8,
  ANCLET: 9,
  NECKLACE: 10,
  RING: 11,
  BELT: 12,
  EARRING: 13,
  NOSERING: 14,
  AMULET: 15,
  OTHER: 16,
  BOOMERANG: 17,
  BOUNDTHROW: 18,
  BREAKTHROW: 19,
  DISH: 20,
  METAL: 21,
  JEWEL: 22,
  WARES: 23,
  WBELT: 24,
  WSHIELD: 25,
  WSHOES: 26,
  WGLOVE: 27,
  ANGELTOKEN: 28,
  HEROTOKEN: 29,
  ACCESSORY: 30
});
const SOURCE_OFFENCE_ITEM_TYPES = new Set([0, 1, 2, 3, 4, 17, 18, 19]);
const SOURCE_DEFENCE_ITEM_TYPES = new Set([5, 6, 7]);
const SOURCE_ACCESSORY_ITEM_TYPES = new Set([8, 9, 10, 11, 12, 13, 14, 15]);

function sellBlockReason(npc, item, sourcePrice = sourceItemPrice(item)) {
  if (sourcePrice <= 0) return "没有原始价格";
  if (!itemMatchesTradeSellFilter(npc, item)) return "此店不收这类道具";
  if (tradeSellRateForItem(npc, item) <= 0) return "此店不收购";
  return "不能出售";
}

function itemMatchesTradeSellFilter(npc, item) {
  const trade = npc?.trade || {};
  const limitIds = Array.isArray(trade.limitItemIds) ? trade.limitItemIds.map(Number).filter(Number.isFinite) : [];
  const limitRanges = Array.isArray(trade.limitItemRanges) ? trade.limitItemRanges : [];
  const limitTypes = Array.isArray(trade.limitItemTypes) ? trade.limitItemTypes.map((value) => String(value).toUpperCase()) : [];
  if (!limitIds.length && !limitRanges.length && !limitTypes.length) return true;
  const itemId = Number(item?.id);
  if (Number.isFinite(itemId) && limitIds.includes(itemId)) return true;
  if (Number.isFinite(itemId) && limitRanges.some((range) => itemIdInSourceRange(itemId, range))) return true;
  const itemType = sourceItemType(item);
  return limitTypes.some((type) => sourceTradeTypeMatches(type, itemType));
}

function itemIdInSourceRange(itemId, range) {
  if (!Array.isArray(range) || range.length < 2) return false;
  const start = Number(range[0]);
  const end = Number(range[1]);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  return itemId >= Math.min(start, end) && itemId <= Math.max(start, end);
}

function sourceTradeTypeMatches(token, itemType) {
  const type = Number(itemType);
  if (!Number.isFinite(type)) return false;
  const normalized = String(token || "").trim().toUpperCase();
  if (!normalized || normalized === "TRUE") return false;
  if (normalized === "OFFENCE") return SOURCE_OFFENCE_ITEM_TYPES.has(type);
  if (normalized === "DEFENCE") return SOURCE_DEFENCE_ITEM_TYPES.has(type);
  if (normalized === "ACCESSORY") return SOURCE_ACCESSORY_ITEM_TYPES.has(type);
  if (Object.hasOwn(SOURCE_SHOP_ITEM_TYPES, normalized)) return SOURCE_SHOP_ITEM_TYPES[normalized] === type;
  const numeric = Number(normalized);
  return Number.isFinite(numeric) && numeric === type;
}

function sourceItemType(item) {
  const ownType = Number(item?.type);
  if (Number.isFinite(ownType)) return ownType;
  const itemId = Number(item?.id);
  if (!Number.isFinite(itemId)) return null;
  const worldItem = worldTradeItems().find((entry) => Number(entry.id) === itemId);
  const worldType = Number(worldItem?.type);
  return Number.isFinite(worldType) ? worldType : null;
}

function isSpecialSellItem(npc, item) {
  const itemId = Number(item?.id);
  const ids = Array.isArray(npc?.trade?.specialItems) ? npc.trade.specialItems.map(Number).filter(Number.isFinite) : [];
  return Number.isFinite(itemId) && ids.includes(itemId);
}

function tradeSellRateForItem(npc, item) {
  if (isSpecialSellItem(npc, item)) {
    const raw = Number(npc?.trade?.specialRate);
    return Number.isFinite(raw) ? Math.max(0, Math.min(1000, raw)) : 1.2;
  }
  return tradeSellRate(npc);
}

function sourceItemPrice(item) {
  const ownPrice = Number(item?.price || item?.cost || 0);
  if (Number.isFinite(ownPrice) && ownPrice > 0) return ownPrice;
  const worldItem = worldTradeItems().find((entry) => Number(entry.id) === Number(item?.id));
  const worldPrice = Number(worldItem?.price || worldItem?.cost || 0);
  return Number.isFinite(worldPrice) && worldPrice > 0 ? worldPrice : 0;
}

function sourceItemBasePriceForNpc(npc, item) {
  const ownPrice = sourceItemPrice(item);
  if (ownPrice > 0) return ownPrice;
  const shopPrices = (npc?.trade?.items || [])
    .map((entry) => Number(entry.price || entry.cost || 0))
    .filter((price) => Number.isFinite(price) && price > 0)
    .sort((a, b) => a - b);
  if (!shopPrices.length) return 1;
  const middle = shopPrices[Math.floor(shopPrices.length / 2)];
  return Math.max(1, middle);
}

function tradeSellRate(npc) {
  const raw = Number(npc?.trade?.sellRate);
  if (!Number.isFinite(raw)) return 0.2;
  return Math.max(0, Math.min(1, raw));
}

function shopDiscountForNpc(game, npc) {
  const entry = game.effects?.shopDiscounts?.[npc.id];
  if (!entry) return null;
  const until = Number(entry.until || 0);
  if (!Number.isFinite(until) || until <= Date.now()) {
    if (game.effects?.shopDiscounts) delete game.effects.shopDiscounts[npc.id];
    return null;
  }
  const percent = clampInt(entry.percent, 0, 30, 0);
  return percent > 0 ? { ...entry, percent, until } : null;
}

function discountedShopPrice(game, npc, item) {
  const sourcePrice = Math.max(0, Number(item.price || item.cost || 0));
  const discount = shopDiscountForNpc(game, npc);
  if (!discount || sourcePrice <= 0) return sourcePrice;
  return Math.max(1, Math.floor(sourcePrice * (100 - discount.percent) / 100));
}

function chooseRoleFitOffMenuItem(game, npc, text) {
  const role = npcShopRole(npc);
  const sold = new Set((npc.trade?.items || []).map((item) => Number(item.id)));
  const queryTags = requestedItemTags(text);
  const queryTerms = requestedItemTerms(text);
  if (role.includes("meat") && queryTags.includes("knife")) {
    return { item: null, role, reason: "working-tool", queryTags };
  }
  const candidates = worldOffMenuItems()
    .filter((item) => !sold.has(Number(item.id)))
    .map((item) => ({ item, score: roleItemScore(role, item, queryTags, queryTerms, text) }))
    .filter((entry) => entry.score > 0 && roleAllowsOffMenuItem(role, entry.item))
    .sort((a, b) => b.score - a.score || Number(a.item.price || a.item.cost || 0) - Number(b.item.price || b.item.cost || 0));
  const entry = candidates[0];
  if (!entry) return { item: null, role, reason: queryTags.length ? "role-mismatch" : "no-hidden-item", queryTags };
  const item = {
    ...entry.item,
    source: entry.item.source || `${GMSV_DATA_SOURCE}/itemset6.txt`
  };
  const basePrice = sourceItemBasePriceForNpc(npc, item);
  const mode = shouldGiftOffMenuItem(game, npc, item, text) ? "gift" : "sale";
  const price = mode === "gift" ? 0 : Math.max(1, Math.round(basePrice * 1.2));
  return {
    item: { ...item, price },
    price,
    mode,
    role,
    explain: offMenuExplain(npc, item, role)
  };
}

function npcShopRole(npc) {
  const text = `${npc.name || ""} ${npc.type || ""} ${npc.template || ""} ${npc.script || ""} ${(npc.trade?.items || []).map((item) => `${item.name} ${item.description} ${item.type}`).join(" ")}`;
  const roles = [];
  if (/肉/.test(text) || (npc.trade?.items || []).some((item) => /肉/.test(`${item.name} ${item.description}`))) roles.push("meat");
  if (/药|藥|医|醫|护士|護士|healer|耐久|气力|復活|复活/i.test(text)) roles.push("medicine");
  if (/武器|斧|枪|槍|棍|棒|爪|弓|投掷/.test(text) || (npc.trade?.items || []).some((item) => Number(item.type) === 1)) roles.push("weapon");
  if (/防具|兜|铠|鎧|衣|帽|甲/.test(text)) roles.push("armor");
  if (/首饰|首飾|戒|项链|項鍊/.test(text)) roles.push("accessory");
  if (/素材|石|木|矿|礦|草|皮/.test(text)) roles.push("material");
  if (/宠|寵|饲|飼|pet|skill/i.test(text)) roles.push("pet");
  return roles.length ? [...new Set(roles)] : ["general"];
}

function requestedItemTags(text) {
  const out = [];
  const pairs = [
    ["knife", /刀/],
    ["meat", /肉/],
    ["medicine", /药|藥|耐久|气力|復活|复活/],
    ["weapon", /武器|斧|枪|槍|棍|棒|爪|弓|投掷/],
    ["armor", /防具|兜|铠|鎧|衣|帽|甲/],
    ["accessory", /首饰|首飾|戒|项链|項鍊/],
    ["material", /素材|石|木|矿|礦|草|皮/],
    ["pet", /宠|寵|饲|飼|技能/],
    ["stat", /能力|攻击|攻|防御|防|敏捷|敏|加成/]
  ];
  for (const [tag, pattern] of pairs) {
    if (pattern.test(text)) out.push(tag);
  }
  return out;
}

function requestedItemTerms(text) {
  const source = String(text || "").toLowerCase();
  const rawParts = source
    .replace(/[，。？！、,?!;；|/]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const itemish = source.match(/[\u3400-\u9fffA-Za-z0-9]{1,18}(?:肉|药|藥|宝石|寶石|羽毛|石|斧头|斧|刀|枪|槍|棍棒|棍|棒|爪|弓|戒指|项链|項鍊|衣|帽|兜|铠|鎧)/g) || [];
  const terms = [...rawParts, ...itemish]
    .map(cleanRequestedItemTerm)
    .filter((term) => term.length >= 2);
  if (/乌力/.test(source) && /肉/.test(source)) terms.push("乌力肉", "乌力斯坦肉");
  return [...new Set(terms)];
}

function cleanRequestedItemTerm(value) {
  return String(value || "")
    .replace(/请问|請問|有没有|有沒有|能不能|可不可以|可以|帮我|幫我|给我|給我|我要|需要|必须|必須|一定要|只要|就要|就是|不是|没有|沒有|卖我|賣我|卖|賣|买|買|拿出|拿|给|給|帮|幫|帮忙|幫忙|这个|這個|那个|那個|一种|一種|一个|一個|一些|的|吗|嗎|嘛|呢|吧|你|我|他|她|它|这里|這裡|那边|那邊|店里|店裡|柜台|櫃台|后面|後面|平时|平時|平常|不卖|不賣|隐藏|隱藏|特殊|稀有/g, "")
    .replace(/[^\u3400-\u9fffA-Za-z0-9]+/g, "");
}

function compactItemName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/的/g, "")
    .replace(/[^\u3400-\u9fffA-Za-z0-9]+/g, "");
}

function requestedItemNameScore(item, queryTerms, text) {
  const name = compactItemName(item?.name);
  if (!name) return 0;
  const itemText = compactItemName(`${item?.name || ""} ${item?.secretName || ""} ${item?.description || ""}`);
  const raw = compactItemName(text);
  let score = 0;
  if (raw.includes(name)) score += 36;
  for (const term of queryTerms || []) {
    const normalized = compactItemName(term);
    if (!normalized || normalized.length < 2) continue;
    if (itemText.includes(normalized)) score += normalized.length >= 4 ? 30 : 18;
    else if (normalized.includes(name)) score += 24;
  }
  if (/乌力/.test(raw) && /肉/.test(raw) && /乌力.*肉/.test(name)) score += 28;
  return score;
}

function roleItemScore(role, item, queryTags, queryTerms, text) {
  const itemText = `${item.name || ""} ${item.description || ""}`;
  const itemTags = itemRoleTags(item);
  let score = 0;
  const nameScore = requestedItemNameScore(item, queryTerms, text);
  score += nameScore;
  for (const tag of role) {
    if (itemTags.includes(tag)) score += 8;
  }
  for (const tag of queryTags) {
    if (tag === "stat" && /攻|防|敏|耐久|气力/.test(itemText)) score += 4;
    else if (itemTags.includes(tag)) score += 10;
  }
  if (queryTags.includes("knife") && !/刀/.test(itemText)) score -= 20;
  if (/平时不卖|平常不卖|隐藏|特殊|稀有/.test(text)) score += 2;
  if (nameScore > 0 && role.some((tag) => itemTags.includes(tag))) score += 12;
  return score;
}

function itemRoleTags(item) {
  const text = `${item.name || ""} ${item.description || ""}`;
  const tags = [];
  const sourceType = Number(item.type);
  const looksLikeWorkTool = /开采|開採|矿用|礦用|工具/.test(text) && sourceType !== 1;
  const sourceTypeKnown = Number.isFinite(sourceType) && sourceType > 0;
  const weaponByName = /斧|枪|槍|棍|棒|爪|弓|投掷|刀/.test(item.name || "");
  if (/肉/.test(text)) tags.push("meat");
  if (/药|藥|耐久|气力|復活|复活/.test(text)) tags.push("medicine");
  if (!looksLikeWorkTool && (sourceType === 1 || (!sourceTypeKnown && weaponByName))) tags.push("weapon");
  if (/兜|铠|鎧|衣|帽|甲/.test(text)) tags.push("armor");
  if (/首饰|首飾|戒|项链|項鍊/.test(text)) tags.push("accessory");
  if (looksLikeWorkTool || /石|木|矿|礦|草|皮|素材/.test(text)) tags.push("material");
  if (/宠|寵|饲|飼|技能/.test(text)) tags.push("pet");
  if (/攻|防|敏|耐久|气力/.test(text)) tags.push("stat");
  return [...new Set(tags)];
}

function roleAllowsOffMenuItem(role, item) {
  if (!role?.length || role.includes("general")) return true;
  const itemTags = itemRoleTags(item);
  return role.some((tag) => itemTags.includes(tag));
}

function shouldGiftOffMenuItem(game, npc, item, text) {
  const cheap = Number(item.price || item.cost || 0) <= 60;
  const polite = hasAny(text, ["请", "拜托", "能不能", "可以吗", "帮"]);
  return cheap && polite && /给|送|要/.test(text) && !/买|卖/.test(text);
}

function offMenuExplain(npc, item, role) {
  if (role.includes("meat")) return "肉店只会拿出肉类和恢复用食物；";
  if (role.includes("weapon")) return "武器店只会拿出武器架上同类装备；";
  if (role.includes("medicine")) return "药店只会拿出药剂和恢复品；";
  if (role.includes("material")) return "素材店只会拿出石、木、矿草皮这类材料；";
  if (role.includes("armor")) return "防具店只会拿出兜、铠和护具；";
  if (role.includes("accessory")) return "饰品店只会拿出首饰和戒指；";
  return `${npc.name} 只会拿出和自己业务相符的东西；`;
}

function roleMismatchReply(npc, offer) {
  if (offer.queryTags?.includes("knife") && offer.role?.includes("meat")) {
    return `${npc.name} 把刀往身后收了收：我是卖肉的，切肉刀是吃饭工具，不能卖也不能送。你可以问我要肉或恢复用的食物。`;
  }
  const roleText = (offer.role || []).filter((item) => item !== "general").join("、") || "本职";
  return `${npc.name} 想了想：这件事不太符合我的身份。可以继续探索，找更合适的 NPC；我这里能谈的范围是 ${roleText}。`;
}

function npcEnemyNegotiationReply(game, npc, text) {
  if (!isNpcEnemy(npc)) return `${npc.name} 不负责守路，没法通过贿赂或威胁改变地图通行。`;
  const threat = hasAny(text, ["威胁", "恐吓", "吓", "打服", "揍"]);
  if (threat) {
    const strongEnough = Number(game.player.level || 1) >= 10 || (game.pets || []).some((pet) => Number(pet.Lv || 1) >= 10);
    recordNpcVmEvent(game, npc, "debug", strongEnough ? "ok" : "blocked", { reason: "ai-threat", strongEnough });
    if (!strongEnough) return `${npc.name} 冷笑了一声：这种话对守路的人没用。想过去就按原版规则决胜负，或拿出足够的石币谈。`;
  }
  const cost = threat ? 0 : Math.max(80, Number(game.player.level || 1) * 40);
  if (cost > 0 && Number(game.player.stone || 0) < cost) {
    recordNpcVmEvent(game, npc, "take", "blocked", { reason: "ai-bribe", cost, current: game.player.stone });
    return `${npc.name} 看了一眼你的钱袋：至少 ${cost} 石币才值得我装作没看见。`;
  }
  if (cost > 0) {
    const taken = runNpcVmAction(game, npc, { type: "take", item: "stone", qty: cost, reason: "ai-bribe" });
    if (!taken.ok) return `${npc.name} 没有收下：${taken.error || "石币不够"}。`;
  }
  const event = runNpcVmAction(game, npc, {
    type: "effect",
    effect: "npcBypass",
    npcId: npc.id,
    seconds: 300,
    mode: threat ? "threat" : "bribe",
    reason: threat ? "ai-threat" : "ai-bribe",
    source: npc.npcEnemy?.source || npc.script || npc.source || ""
  });
  if (!event.ok) return `${npc.name} 收了钱，但没能让开：${event.error || "npcBypass 被 VM 拒绝"}。`;
  return threat
    ? `${npc.name} 判断你现在确实不好惹，侧身让开一会儿。通路会打开 5 分钟；这是临时威慑，不会改掉原版 NPCEnemy 的战斗脚本。`
    : `${npc.name} 收下 ${cost} 石币，侧身让开一会儿。通路会打开 5 分钟；这是临时交涉，不会改掉原版 NPCEnemy 的战斗脚本。`;
}

function worldTradeItems() {
  const byId = new Map();
  for (const map of Object.values(WORLD.maps || {})) {
    for (const npc of map.npcs || []) {
      for (const item of npc.trade?.items || []) {
        if (!byId.has(Number(item.id))) {
          byId.set(Number(item.id), {
            ...item,
            price: Number(item.price || item.cost || 0),
            source: item.source || npc.trade.source || npc.source || `${GMSV_DATA_SOURCE}/itemset6.txt`,
            shopNpcName: npc.name,
            shopMapId: map.id
          });
        }
      }
    }
  }
  return [...byId.values()];
}

function worldOffMenuItems() {
  const byKey = new Map();
  const addItem = (item, meta = {}) => {
    const id = Number(item?.id);
    if (!Number.isFinite(id) || id <= 0) return;
    const sourceItem = cache?.itemSet?.get(id) || {};
    const name = cleanReferenceText(item?.name) || sourceItem.name || `道具 ${id}`;
    const key = `${id}:${name}`;
    if (byKey.has(key)) return;
    byKey.set(key, {
      ...sourceItem,
      ...item,
      id,
      name,
      price: Number(item?.price || item?.cost || sourceItem.price || sourceItem.cost || 0),
      cost: Number(item?.cost || sourceItem.cost || item?.price || sourceItem.price || 0),
      source: item?.source || meta.source || sourceItem.source || `${GMSV_DATA_SOURCE}/itemset6.txt`,
      offMenuSourceKind: meta.kind || item?.offMenuSourceKind || "",
      sourceNpcName: meta.npcName || item?.sourceNpcName || "",
      sourceMapId: meta.mapId || item?.sourceMapId || ""
    });
  };
  for (const item of worldTradeItems()) addItem(item, { kind: "trade" });
  for (const map of Object.values(WORLD.maps || {})) {
    for (const npc of map.npcs || []) {
      const source = npc.savePoint?.source || npc.script || npc.source || "";
      for (const alternative of npc.savePoint?.requiredAlternatives || []) {
        for (const item of alternative || []) {
          addItem(item, { kind: "savepoint-requirement", source, npcName: npc.name, mapId: map.id });
        }
      }
    }
  }
  for (const task of SOURCE_SCRIPT_TASKS || []) {
    for (const item of [...(task.requiredItems || []), ...(task.rewardItems || [])]) {
      addItem(item, { kind: "script-task", source: (task.sources || [])[0] || task.sourceCluster || "", npcName: task.title || "", mapId: "" });
    }
    for (const item of (task.rewardItems || []).flatMap((entry) => entry.candidates || [])) {
      addItem(item, { kind: "script-task-random", source: (task.sources || [])[0] || task.sourceCluster || "", npcName: task.title || "", mapId: "" });
    }
  }
  for (const item of cache?.itemSet?.values?.() || []) addItem(item, { kind: "itemset" });
  return [...byKey.values()];
}

function dialogSuggestions(npc, game = null) {
  if (game?.encounter && game?.battle?.npcEnemy) return ["攻击", "防御", "道具", "逃跑"];
  if (game?.encounter) return ["攻击", "捕获", "道具", "放走"];
  if (isNpcEnemy(npc)) return isNpcAiMode(game, npc)
    ? ["开战", "离开", "试着交涉"]
    : ["开战", "离开"];
  const aiHints = isNpcAiMode(game, npc)
    ? (isHealerNpc(npc)
      ? ["请求急救药", "请求治疗", "试着交涉"]
      : ["请求避敌", npc.trade?.items?.length ? "看看柜台后面" : "请求信息", isWarpNpc(npc) ? "试着交涉" : "试着交涉"])
    : [];
  let base = ["hi", "任务", "地图"];
  if (npc.petShop) base = ["hi", "整理宠物", "寄放", "取回"];
  else if (isPetFusionNpc(npc)) base = ["hi", "融合", "宠物蛋", "地图"];
  else if (npc.itemPoolShop) base = ["hi", "寄放道具", "取回道具", "地图"];
  else if (isRaceManNpc(npc)) base = ["hi", "规则", "报名", "奖励"];
  else if (isRouteServiceNpc(npc)) base = ["hi", "路线", "搭乘"];
  else if (isProfessionShopNpc(npc)) base = ["hi", "学技能", "职业", "地图"];
  else if (npc.trade || /shop/i.test(npc.type)) base = ["hi", "买东西", "地图"];
  else if (/healer/i.test(npc.type)) base = ["hi", "治疗", "地图"];
  else if (isLuckyManNpc(npc)) base = ["hi", "占卜", "是"];
  else if (isJankenNpc(npc)) base = ["hi", "石头", "剪刀", "布"];
  else if (isQuizNpc(npc)) base = ["hi", "开始", "1", "2"];
  else if (npc.warp || /warp/i.test(npc.type)) base = ["hi", "传送", "出口"];
  else if (npc.itemChange?.recipes?.length) base = ["hi", "加工", "地图"];
  else if (/save/i.test(npc.type)) base = ["hi", "记录", "地图"];
  return [...new Set([...base, ...aiHints])];
}

function addInventoryItem(game, item, qty = 1) {
  game.inventory ||= [];
  const existing = game.inventory.find((entry) => Number(entry.id) === Number(item.id));
  if (existing) {
    existing.qty = Number(existing.qty || 0) + qty;
    return;
  }
  game.inventory.push({
    id: item.id,
    name: item.name,
    qty,
    image: item.image,
    type: item.type,
    useField: item.useField,
    target: item.target,
    level: item.level,
    price: item.price,
    cost: item.cost,
    description: item.description,
    secretName: item.secretName,
    category: item.category,
    option: item.option,
    effectOption: item.effectOption,
    functionName: item.functionName,
    useFunction: item.useFunction,
    damageBreak: item.damageBreak,
    maxUses: item.maxUses,
    usesRemaining: item.usesRemaining,
    equippedSlot: item.equippedSlot,
    source: `${GMSV_DATA_SOURCE}/itemset6.txt`
  });
}

function hydrateGameInventoryFromSource(game, itemSet = cache?.itemSet) {
  for (const item of game?.inventory || []) hydrateInventoryItemFromSource(item, itemSet);
}

function hydrateGameInventoryRuntimeEffects(game, data = cache) {
  for (const item of game?.inventory || []) hydrateRuntimeItemEffect(item, data);
}

function hydrateRuntimeItemEffect(item, data = cache) {
  if (!item || item.id === "stone") return item;
  const effect = itemEffect(item);
  const skillCan = effect.effects.find((entry) => entry.kind === "petSkillCan" && Number(entry.skillId || 0) > 0);
  if (skillCan) {
    const skill = data?.skills?.get(Number(skillCan.skillId));
    item.skillCanned = skill ? compactPetSkillForSave(skill) : {
      Id: Number(skillCan.skillId),
      Name: `技能 ${Number(skillCan.skillId)}`,
      Source: `${GMSV_DATA_SOURCE}/petskill2.txt`
    };
  }
  return item;
}

function hydrateInventoryItemFromSource(item, itemSet = cache?.itemSet) {
  if (!item || item.id === "stone") return item;
  const id = Number(item.id);
  if (!Number.isFinite(id) || id <= 0) return item;
  const sourceItem = itemSet?.get(id) || worldTradeItemIndex().get(id);
  if (!sourceItem) return item;
  if (!itemNameCompatibleWithSource(item, sourceItem)) return item;

  item.id = id;
  for (const key of [
    "name", "secretName", "description", "option", "effectOption", "functionName", "useFunction",
    "image", "type", "useField", "target", "level", "price", "cost", "category", "source"
  ]) {
    if (isMissingItemField(item[key]) && !isMissingItemField(sourceItem[key])) item[key] = sourceItem[key];
  }

  const sourceDamageBreak = Number(sourceItem.damageBreak ?? sourceItem.maxUses);
  const currentDamageBreak = Number(item.damageBreak ?? item.maxUses ?? item.usesRemaining);
  if (Number.isFinite(sourceDamageBreak) && sourceDamageBreak > 0 && (!Number.isFinite(currentDamageBreak) || currentDamageBreak <= 0)) {
    item.damageBreak = sourceDamageBreak;
    item.maxUses = sourceDamageBreak;
    if (isMissingItemField(item.usesRemaining)) item.usesRemaining = sourceDamageBreak;
  } else {
    if (isMissingItemField(item.damageBreak) && !isMissingItemField(sourceItem.damageBreak)) item.damageBreak = sourceItem.damageBreak;
    if (isMissingItemField(item.maxUses) && !isMissingItemField(sourceItem.maxUses)) item.maxUses = sourceItem.maxUses;
  }
  item.source ||= `${GMSV_DATA_SOURCE}/itemset6.txt`;
  return item;
}

function isMissingItemField(value) {
  return value === undefined || value === null || value === "";
}

function itemNameCompatibleWithSource(item = {}, sourceItem = {}) {
  const existing = normalizeItemNameForSourceMatch(item.name || item.secretName || item.SecretName || "");
  if (!existing) return true;
  const sourceNames = [sourceItem.name, sourceItem.secretName, sourceItem.SecretName]
    .map(normalizeItemNameForSourceMatch)
    .filter(Boolean);
  if (!sourceNames.length) return true;
  return sourceNames.some((source) => source === existing || source.includes(existing) || existing.includes(source));
}

function normalizeItemNameForSourceMatch(value = "") {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s,，.。:：;；'"“”‘’`~!！?？()[\]（）【】<>《》_\-·・]/g, "");
}

function canCarryItem(game, item) {
  if (!item || item.id === "stone") return true;
  const id = Number(item.id);
  if (game.inventory?.some((entry) => Number(entry.id) === id)) return true;
  return inventoryState(game).used < INVENTORY_CAPACITY;
}

function ensurePetFormation(game) {
  game.petFormation ||= {};
  const count = (game.pets || []).length;
  const rawIndex = Number(game.petFormation.activeIndex);
  game.petFormation.activeIndex = count
    ? (Number.isFinite(rawIndex) && rawIndex < 0 ? -1 : clampInt(rawIndex, 0, count - 1, 0))
    : -1;
  game.petFormation.source ||= `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE + client PET STATUS`;
  return game.petFormation;
}

function ensurePetPool(game) {
  game.petPool = Array.isArray(game.petPool) ? game.petPool.filter(Boolean).slice(0, PET_POOL_CAPACITY) : [];
  return game.petPool;
}

function ensureItemPool(game) {
  game.itemPool = Array.isArray(game.itemPool) ? game.itemPool.filter(Boolean).slice(0, ITEM_POOL_CAPACITY) : [];
  for (const item of game.itemPool) {
    item.qty = Math.max(1, Number(item.qty || 1));
    hydrateInventoryItemFromSource(item);
  }
  return game.itemPool;
}

function getActivePetIndex(game) {
  return ensurePetFormation(game).activeIndex;
}

function getActivePet(game) {
  const index = getActivePetIndex(game);
  return index >= 0 ? game.pets[index] || null : null;
}

function exactPetIndex(game, petIndex) {
  const index = Math.trunc(Number(petIndex));
  if (!Number.isFinite(index) || index < 0 || index >= (game.pets || []).length) {
    throw new Error("没有找到这只宠物");
  }
  return index;
}

function isPetSwitchRequest(text) {
  return hasAny(text, [
    "出战宠",
    "出戰寵",
    "换宠",
    "換寵",
    "换一只",
    "換一隻",
    "切换宠",
    "切換寵",
    "上场",
    "上場",
    "出战",
    "出戰",
    "active pet",
    "battle pet"
  ]);
}

function isPetTrainingRequest(text) {
  return hasAny(text, ["练级", "練級", "训练", "訓練", "练宠", "練寵", "升级", "升級", "level", "train"]);
}

function isPetReleaseRequest(text) {
  return hasAny(text, ["放生", "野放", "离队", "離隊", "放走宠", "放走寵", "释放宠", "釋放寵", "release pet"]);
}

function isItemDropRequest(text) {
  return hasAny(text, ["丢弃", "丟棄", "扔掉", "丢掉", "丟掉", "不要这个道具", "整理背包", "清背包", "drop item"]);
}

function isItemUseRequest(text) {
  return hasAny(text, ["使用", "用道具", "用一下", "吃", "喂", "餵", "use item"])
    && !isItemDropRequest(text);
}

function chooseGuideItem(game, prompt) {
  const items = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  if (!items.length) return { reason: "empty-inventory" };
  const indexByNumber = itemIndexFromPrompt(prompt, items.length);
  if (indexByNumber >= 0) return { item: items[indexByNumber], reason: "index" };

  const normalized = guideSearchText(prompt);
  const tokens = guideSearchTokens(prompt)
    .filter((token) => !["使用", "道具", "物品", "丢弃", "丟棄", "全部"].includes(token));
  const named = items
    .map((item, index) => {
      const name = guideSearchText(`${item.name || ""} ${item.secretName || ""}`);
      const id = guideSearchText(`${item.id || ""}`);
      let score = 0;
      if (name && normalized.includes(name)) score += name.length * 4;
      if (name && name.includes(normalized)) score += normalized.length;
      if (id && normalized.includes(id)) score += id.length * 5;
      for (const token of tokens) {
        if (name.includes(token)) score += token.length;
        if (id && id.includes(token)) score += token.length;
      }
      return { item, index, name, id, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.name.length - a.name.length || a.index - b.index);
  if (named.length) return { item: named[0].item, reason: "name" };

  if (hasAny(String(prompt || "").toLowerCase(), ["第一个", "第一個", "第1个", "第1個", "第1"])) {
    return { item: items[0], reason: "first" };
  }
  return { reason: "ambiguous" };
}

function itemIndexFromPrompt(prompt, itemCount) {
  const text = String(prompt || "");
  const match = text.match(/(?:第\s*)?([1-9])\s*(?:个|個|件|格|号|號|道具)?/);
  if (match) {
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < itemCount) return index;
  }
  const ordinals = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  for (let i = 0; i < Math.min(itemCount, ordinals.length); i += 1) {
    const ordinal = ordinals[i];
    if (text.includes(`第${ordinal}`) || text.includes(`${ordinal}号`) || text.includes(`${ordinal}號`)) return i;
  }
  return -1;
}

function itemDropQtyFromPrompt(prompt, item) {
  if (hasAny(String(prompt || "").toLowerCase(), ["全部", "全丢", "全丟", "all"])) return Number(item.qty || 1);
  const match = String(prompt || "").match(/x\s*(\d+)|(\d+)\s*(?:个|個|件|份)/i);
  const qty = Number(match?.[1] || match?.[2] || 1);
  return Math.max(1, Math.min(Number(item.qty || 1), Math.trunc(qty) || 1));
}

function guideItemChoiceHelp(game) {
  const items = (game.inventory || [])
    .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
    .map((item, index) => `${index + 1}. ${item.name} x${Number(item.qty || 0)}`)
    .join("；");
  if (!items) return "背包里没有可以丢弃的普通道具；石币不占道具格，也不能丢弃。";
  return `我没判断出要丢弃哪个道具。可以说“丢弃第 1 个”“丢弃小的肉”或“丢弃小的肉全部”。当前背包：${items}。`;
}

function chooseGuidePet(game, prompt) {
  const pets = game.pets || [];
  if (!pets.length) return { reason: "no-pets" };
  const indexByNumber = petIndexFromPrompt(prompt, pets.length);
  if (indexByNumber >= 0) return { index: indexByNumber, pet: pets[indexByNumber], reason: "index" };

  const normalized = guideSearchText(prompt);
  const named = pets
    .map((pet, index) => ({
      pet,
      index,
      name: guideSearchText(pet.Name || ""),
      petId: guideSearchText(`${pet.PetId || ""}`),
      noText: guideSearchText(`no${pet.PetId || ""}`)
    }))
    .filter((entry) => (entry.name && normalized.includes(entry.name))
      || (entry.petId && normalized.includes(entry.petId))
      || (entry.noText && normalized.includes(entry.noText)))
    .sort((a, b) => b.name.length - a.name.length || a.index - b.index);
  if (named.length) return { index: named[0].index, pet: named[0].pet, reason: "name" };

  const lower = String(prompt || "").toLowerCase();
  if (hasAny(lower, ["最强", "最強", "攻击最高", "攻擊最高", "攻击力最高", "攻擊力最高"])) {
    return bestGuidePet(pets, (pet) => workAttackPower(pet), "highest-attack");
  }
  if (hasAny(lower, ["等级最高", "等級最高", "最高等级", "最高等級", "level"])) {
    return bestGuidePet(pets, (pet) => Number(pet.Lv || 0), "highest-level");
  }
  if (hasAny(lower, ["血最多", "耐久最高", "耐久力最高", "hp最高", "hp 最高"])) {
    return bestGuidePet(pets, (pet) => Number(pet.WorkMaxHp || pet.Hp || 0), "highest-hp");
  }
  return { reason: "ambiguous" };
}

function petIndexFromPrompt(prompt, petCount) {
  const text = String(prompt || "");
  const match = text.match(/(?:第\s*)?([1-5])\s*(?:只|隻|个|個|号|號|宠|寵)?/);
  if (match) {
    const index = Number(match[1]) - 1;
    if (index >= 0 && index < petCount) return index;
  }
  const ordinals = ["一", "二", "三", "四", "五"];
  for (let i = 0; i < Math.min(petCount, ordinals.length); i += 1) {
    const ordinal = ordinals[i];
    if (text.includes(`第${ordinal}`) || text.includes(`${ordinal}号`) || text.includes(`${ordinal}號`)) return i;
  }
  return -1;
}

function bestGuidePet(pets, scoreOf, reason) {
  const ranked = pets
    .map((pet, index) => ({ pet, index, score: Number(scoreOf(pet)) || 0 }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked[0] ? { index: ranked[0].index, pet: ranked[0].pet, reason } : { reason: "no-pets" };
}

function guidePetChoiceHelp(game) {
  const pets = (game.pets || []).map((pet, index) => `${index + 1}. ${pet.Name} Lv.${Number(pet.Lv || 1)} 攻${workAttackPower(pet)}`).join("；");
  if (!pets) return "你现在没有宠物，先通过剧情、捕获或宠物店取得宠物后才能设置出战宠。";
  return `我没判断出要让哪只宠物出战。可以说“让第 2 只出战”“让${game.pets[0]?.Name || "这只宠物"}出战”，也可以说“让攻击最高的宠物出战”。当前宠物：${pets}。`;
}

function petState(game) {
  const formation = ensurePetFormation(game);
  const used = (game.pets || []).length;
  const active = getActivePet(game);
  return {
    used,
    capacity: PET_CAPACITY,
    remaining: Math.max(0, PET_CAPACITY - used),
    activeIndex: formation.activeIndex,
    activeName: active?.Name || "",
    modes: (game.pets || []).map((pet, index) => ({
      index,
      name: pet.Name,
      active: index === formation.activeIndex,
      hp: Number(pet.Hp || 0),
      maxHp: Number(pet.WorkMaxHp || pet.Hp || 0)
    })),
    source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPETHAVE`
  };
}

function petPoolState(game) {
  const pool = ensurePetPool(game);
  return {
    used: pool.length,
    capacity: PET_POOL_CAPACITY,
    remaining: Math.max(0, PET_POOL_CAPACITY - pool.length),
    pets: pool.map((pet, index) => ({
      index,
      name: pet.Name,
      level: Number(pet.Lv || 1),
      hp: Number(pet.Hp || 0),
      maxHp: Number(pet.WorkMaxHp || pet.Hp || 0),
      image: Number(pet.ImgNo || 0),
      source: pet.PoolSource || ""
    })),
    source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPOOLPETHAVE`
  };
}

function itemPoolState(game) {
  const pool = ensureItemPool(game);
  return {
    used: pool.length,
    capacity: ITEM_POOL_CAPACITY,
    remaining: Math.max(0, ITEM_POOL_CAPACITY - pool.length),
    items: pool.map((item, index) => ({
      index,
      id: Number(item.id),
      name: item.name || item.secretName || `道具 ${Number(item.id)}`,
      qty: Number(item.qty || 1),
      image: Number(item.image || 0),
      source: item.PoolSource || item.source || ""
    })),
    source: `${GMSV_DATA_SOURCE}/include/char_base.h CHAR_MAXPOOLITEMHAVE`
  };
}

function inventoryState(game) {
  const used = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0).length;
  return {
    used,
    capacity: INVENTORY_CAPACITY,
    remaining: Math.max(0, INVENTORY_CAPACITY - used),
    source: "gmsv CHAR_MAXITEMNUM=15; stone is currency, not an item slot"
  };
}

function syncStoneItem(game) {
  game.inventory ||= [];
  const stone = game.inventory.find((item) => item.id === "stone");
  if (stone) stone.qty = game.player.stone;
}

function npcMessage(speaker, text) {
  return { speaker, text, at: Date.now() };
}

function buildGuideContext(game, map, prompt = "") {
  const x = Number(game.location.x || 0);
  const y = Number(game.location.y || 0);
  const characterFields = compactCharacterFields(game);
  const npcs = (map.npcs || [])
    .map((npc) => ({
      id: npc.id,
      name: npc.name,
      type: npc.type,
      distance: distance(npc.x, npc.y, x, y),
      position: [npc.x, npc.y],
      actions: npcActionProfile(npc),
      questIds: npcQuestIds(npc),
      questLead: npc.questLead || null,
      trade: npc.trade ? {
        itemCount: npc.trade.items?.length || 0,
        sampleItems: (npc.trade.items || []).slice(0, 4).map((item) => item.name)
      } : null,
      warp: npc.warp?.target ? {
        target: npc.warp.target,
        targetMapName: WORLD.maps[npc.warp.target.mapId]?.name || "",
        status: npc.warpStatus || compactNpcWarpStatus(game, npc)
      } : null,
      scriptStatus: npc.scriptStatus || compactNpcScriptStatus(game, npc),
      timeMan: npc.timeMan || null,
      source: npc.source,
      script: npc.script,
      scriptHints: npc.scriptHints || null
    }))
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name, "zh-Hans"))
    .slice(0, 16);
  const exits = (map.exits || [])
    .map((exit) => ({
      id: exit.id,
      label: exit.label,
      detail: exit.detail,
      distance: distanceToExit(exit, x, y),
      to: exit.to,
      targetMapName: WORLD.maps[exit.to]?.name || "",
      source: exit.source
    }))
    .sort((a, b) => a.distance - b.distance || a.label.localeCompare(b.label, "zh-Hans"))
    .slice(0, 16);
  const closedExits = (map.profileClosedExits || [])
    .map((exit) => ({
      ...closedExitSummary(exit),
      distance: distanceToExit(exit, x, y)
    }))
    .sort((a, b) => a.distance - b.distance || String(a.label || "").localeCompare(String(b.label || ""), "zh-Hans"))
    .slice(0, 8);
  const encounterGates = guideEncounterGateSummary(game, map);
  const encounterGateText = guideEncounterGateText(encounterGates);
  const lastBattle = guideLastBattleSummary(game);
  const context = {
    player: {
      ...compactPlayerContext(game),
      counters: characterFields.counters,
      attributes: characterFields.attributes
    },
    characterFields,
    location: {
      mapId: map.id,
      floorId: map.floorId,
      name: map.name,
      position: [x, y],
      summary: map.summary,
      canWildEncounter: map.canWildEncounter,
      wildEncounterReason: map.wildEncounterReason,
      encounterGateText,
      encounterGates
    },
    knowledge: buildStoneAgeKnowledgeContext(game, map, prompt),
    workspace: compactAiWorkspaceMemory(game),
    map: { exits, closedExits, npcs, nearby: nearbyState(game, map) },
    world: guideWorldSummary(game, map),
    pets: game.pets.map(petSummary),
    petState: petState(game),
    inventory: inventoryState(game),
    effects: guideEffectSummary(game),
    quests: Object.values(responseQuestState(game)),
    sourceTasks: sourceScriptTaskState(game),
    availableQuests: Object.values(WORLD.quests || {}).filter(isPlayerFacingQuest).map((quest) => ({
      id: quest.id,
      title: quest.title,
      steps: quest.steps,
      source: quest.source
    })),
    dialog: game.dialog?.open ? {
      npcId: game.dialog.npcId,
      npcName: game.dialog.npcName,
      aiMode: game.dialog.aiMode,
      source: game.dialog.source,
      recentMessages: (game.dialog.messages || []).slice(-4)
    } : null,
    battle: game.encounter ? {
      enemy: game.encounter.Name,
      level: game.encounter.Lv,
      hp: game.encounter.Hp,
      source: game.battle?.source || game.encounter.source || "",
      dropText: guidePotentialLootText(game.encounter.EnemyDropTable || game.encounter.dropTable || [], 6),
      taskLootText: guideTaskLootText(game, game.encounter.EnemyDropTable || game.encounter.dropTable || [], "当前敌人"),
      encounterGates: game.battle?.encounterArea?.groupGates || []
    } : null,
    lastBattle,
    recentNpcVmEvents: (game.npcVmEvents || []).slice(-8),
    recentLog: game.log.slice(-8)
  };
  context.actionPlan = guideActionPlan(context);
  return context;
}

function guideWorldSummary(game, currentMapValue) {
  const currentId = String(currentMapValue?.id || game.location?.mapId || "");
  const maps = Object.values(WORLD.maps || {});
  const notable = maps
    .filter((map) => map.id === currentId || guideNotableMap(map))
    .map((map) => ({
      id: map.id,
      floorId: map.floorId,
      name: map.name,
      kind: guideMapKind(map),
      canWildEncounter: wildEncounterAllowed(map, map.id === currentId ? game : null),
      source: map.summary
    }))
    .sort((a, b) => (
      Number(b.id === currentId) - Number(a.id === currentId)
      || guideMapKindRank(a.kind) - guideMapKindRank(b.kind)
      || String(a.name).localeCompare(String(b.name), "zh-Hans")
    ))
    .slice(0, 24);
  return {
    mapCount: maps.length,
    questLeadCount: maps.reduce((sum, map) => sum + (map.npcs || []).filter((npc) => npc.questLead).length, 0),
    safePolicy: "村镇、店铺、医院、庄园和竞技场按安全区处理；野外、大陆、洞窟按 encount.txt 触发随机遇敌。",
    notableMaps: notable
  };
}

function guideNotableMap(map) {
  const text = `${map?.name || ""} ${map?.summary || ""}`;
  return /村|医院|庄园|竞技场|競技場|斗技场|鬥技場|PK|洞窟|通路|萨姆吉尔|玛丽娜丝|柯奥|加加|卡鲁它那/i.test(text);
}

function guideMapKind(map) {
  const text = `${map?.name || ""} ${map?.summary || ""}`;
  if (/竞技场|競技場|斗技场|鬥技場|PK/i.test(text)) return "arena";
  if (/医院|店|商店|肉店|宠物店|武器店|防具店|便利/i.test(text)) return "service";
  if (/村|庄园/i.test(text)) return "village";
  if (/洞窟|通路|坑道|海底/i.test(text)) return "dungeon";
  if (wildEncounterAllowed(map)) return "field";
  return "map";
}

function guideMapKindRank(kind) {
  return { village: 0, service: 1, arena: 2, dungeon: 3, field: 4, map: 5 }[kind] ?? 9;
}

function buildStoneAgeKnowledgeContext(game, map, text = "", npc = null) {
  const x = Number(game.location?.x || 0);
  const y = Number(game.location?.y || 0);
  const nearbyNames = (map.npcs || [])
    .filter((item) => distance(item.x, item.y, x, y) <= 6)
    .map((item) => `${item.name} ${item.type || ""}`)
    .slice(0, 8);
  const questTitles = Object.values(game.quests || {})
    .map((quest) => `${quest.title || ""} ${quest.status || ""}`)
    .slice(0, 6);
  const exitNames = (map.exits || [])
    .map((exit) => `${exit.label || ""} ${WORLD.maps[exit.to]?.name || ""}`)
    .slice(0, 8);
  const encounterGateText = guideEncounterGateText(guideEncounterGateSummary(game, map, 3));
  const npcParts = npc ? [
    npc.name,
    npc.type,
    npc.template,
    npc.dialogue,
    npc.questLead?.title,
    npc.questLead?.summary,
    (npc.scriptHints?.hints || []).slice(0, 5).join(" ")
  ] : [];
  const query = [
    text,
    map.name,
    map.summary,
    guideMapKind(map),
    encounterGateText,
    exitNames.join(" "),
    nearbyNames.join(" "),
    questTitles.join(" "),
    game.pets?.map((pet) => pet.Name).join(" "),
    game.inventory?.map((item) => item.name).join(" "),
    ...npcParts
  ].filter(Boolean).join(" ");
  return {
    version: STONEAGE_KNOWLEDGE.version,
    source: STONEAGE_KNOWLEDGE.sourceLabel,
    usage: "只把 entries 当作攻略/设定线索；实际动作仍由当前地图、NPC 脚本、背包和 Worker VM 决定。",
    entries: selectStoneAgeKnowledgeEntries(query, { game, map, npc, prompt: text, limit: 6 })
  };
}

function selectStoneAgeKnowledgeEntries(query, { game = null, map = null, npc = null, prompt = "", limit = 6 } = {}) {
  const normalized = guideSearchText(query).slice(0, 1600);
  const promptNormalized = guideSearchText(prompt);
  const tokens = stoneAgeKnowledgeTokens(promptNormalized ? prompt : `${map?.name || ""} ${npc?.name || ""}`);
  const hints = stoneAgeKnowledgeHints(promptNormalized, map, npc);
  const scored = STONEAGE_KNOWLEDGE.entries
    .map((entry, index) => ({
      entry,
      index,
      score: stoneAgeKnowledgeEntryScore(entry, normalized, promptNormalized, tokens, hints)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = [];
  for (const item of scored) {
    if (!selected.some((entry) => entry.id === item.entry.id)) selected.push(item.entry);
    if (selected.length >= limit) break;
  }
  for (const entry of defaultStoneAgeKnowledgeEntries(map, npc, game, promptNormalized)) {
    if (selected.length >= Math.min(limit, 4)) break;
    if (!selected.some((item) => item.id === entry.id)) selected.push(entry);
  }
  return selected.slice(0, limit).map(compactStoneAgeKnowledgeEntry);
}

function stoneAgeKnowledgeTokens(value) {
  const source = String(value || "").slice(0, 240);
  const normalized = guideSearchText(source);
  const tokens = new Set((source.match(/[\u4e00-\u9fff]{2,12}|[a-z0-9]{2,}/gi) || []).map(guideSearchText));
  for (let size = 2; size <= Math.min(4, normalized.length); size += 1) {
    for (let i = 0; i <= normalized.length - size && i < 80; i += 1) tokens.add(normalized.slice(i, i + size));
  }
  return [...tokens].filter((token) => token.length >= 2);
}

function stoneAgeKnowledgeHints(promptNormalized, map, npc) {
  const mapKind = map ? guideMapKind(map) : "";
  return {
    quest: hasAny(promptNormalized, ["任务", "委托", "攻略", "红暴", "四圣石", "成人仪式", "成人礼", "英雄岛", "二转", "六转", "转生", "五兄弟", "梦德", "愿藏", "梦幻洞窟", "委托店"]),
    quest25: hasAny(promptNormalized, ["2.5", "2.0", "二点五", "二五", "2.5以前", "2.5及以前", "2.5前", "25以前", "25前", "早期任务"]),
    pet: hasAny(promptNormalized, ["宠物技能", "宠物邮件", "骑宠", "忠诚", "三围", "宠物二转", "抓宠", "捕获"]),
    map: hasAny(promptNormalized, ["地图", "坐标", "座标", "村", "洞窟", "北岛", "南岛", "吉鲁", "沙姆", "去哪"]),
    version: hasAny(promptNormalized, ["版本", "精灵的传说", "精灵的召唤", "7.5", "伊甸", "魔界", "追猎者"]),
    combat: hasAny(promptNormalized, ["属性", "相克", "战斗", "遇敌", "攻击", "防御", "敏捷", "地克水", "水克火", "火克风", "风克地"]),
    guide: hasAny(promptNormalized, ["新手", "入门", "开局", "怎么开始", "下一步"]),
    village: mapKind === "village" || mapKind === "service" || hasAny(promptNormalized, ["商店", "购物", "补给", "医院", "肉屋", "宠物店"]),
    npcTrade: Boolean(npc?.trade?.items?.length),
    npcWarp: isWarpNpc(npc || {}),
    npcEnemy: isNpcEnemy(npc || {})
  };
}

function stoneAgeKnowledgeEntryScore(entry, normalized, promptNormalized, tokens, hints) {
  const haystack = guideSearchText([
    entry.id,
    entry.category,
    entry.title,
    entry.summary,
    entry.version,
    entry.group,
    entry.status,
    ...(entry.tags || []),
    ...(entry.facts || []),
    ...(entry.guidance || [])
  ].join(" "));
  let score = 0;
  for (const tag of entry.tags || []) {
    const token = guideSearchText(tag);
    if (!token) continue;
    const generic = stoneAgeGenericKnowledgeTag(token);
    if (promptNormalized.includes(token)) score += (generic ? 8 : 28) + Math.min(generic ? 3 : 10, token.length);
    else if (normalized.includes(token)) score += 3 + Math.min(3, token.length);
  }
  for (const token of tokens) {
    if (haystack.includes(token)) score += Math.min(8, Math.max(2, token.length));
  }
  if (hints.quest && entry.category === "quest") score += 14;
  if (hints.quest25 && entry.category === "quest") score += entry.status === "catalog" ? 24 : 10;
  if (entry.category === "quest") {
    const asksCatalog = hasAny(promptNormalized, ["有哪些", "全部", "列表", "索引", "目录", "2.5", "2.0", "南岛", "北岛", "吉鲁", "沙姆", "转生", "jot", "sot"]);
    const asksWalkthrough = hasAny(promptNormalized, ["怎么做", "流程", "步骤", "攻略", "怎么过"]);
    if (entry.status === "catalog" && asksWalkthrough && !asksCatalog) score -= 22;
    if (entry.status !== "catalog" && asksWalkthrough) score += 18;
    const versionText = guideSearchText(`${entry.version || ""} ${entry.group || ""}`);
    if (promptNormalized.includes("2.5") && versionText.includes("2.5")) score += entry.version === "2.5" ? 32 : 18;
    if (promptNormalized.includes("2.0") && versionText.includes("2.0")) score += entry.version === "2.0" ? 32 : 18;
    if (hasAny(promptNormalized, ["南岛", "北岛", "吉鲁", "沙姆", "转生", "jot", "sot"])) {
      for (const key of ["南岛", "北岛", "吉鲁", "沙姆", "转生", "jot", "sot"]) {
        const normalizedKey = guideSearchText(key);
        if (promptNormalized.includes(normalizedKey) && haystack.includes(normalizedKey)) score += 18;
      }
    }
  }
  if (hints.pet && entry.category === "pet") score += 14;
  if (hints.map && entry.category === "map") score += 12;
  if (hints.map && entry.category === "village") score += 8;
  if (hints.version && entry.category === "version") score += 14;
  if (hints.combat && entry.category === "combat") score += 12;
  if (hints.guide && entry.category === "guide") score += 10;
  if (hints.village && entry.category === "village") score += 10;
  if (hints.npcTrade && entry.category === "village") score += 4;
  if (hints.npcWarp && entry.category === "map") score += 4;
  if (hints.npcEnemy && entry.category === "combat") score += 4;
  if (entry.category === "system" && hasAny(promptNormalized, ["能干嘛", "能做什么", "ai", "npc", "脚本", "gm"])) score += 10;
  return score;
}

function stoneAgeGenericKnowledgeTag(token) {
  return ["任务", "攻略", "任务攻略", "地图", "宠物", "版本", "新手", "入门", "村", "商店", "坐标", "座标"].includes(token);
}

function defaultStoneAgeKnowledgeEntries(map, npc, game, promptNormalized) {
  const ids = ["ai-role-boundaries"];
  const kind = map ? guideMapKind(map) : "";
  if (!promptNormalized || hasAny(promptNormalized, ["下一步", "干嘛", "做什么", "新手", "入门"])) ids.push("beginner-first-steps");
  if (kind === "village" || kind === "service") ids.push("village-shopping-index");
  if (kind === "field" || kind === "dungeon") ids.push("battle-basics", "map-index");
  if (npc?.trade?.items?.length) ids.push("village-shopping-index");
  if (game?.pets?.length) ids.push("pet-system-basics");
  ids.push("map-index");
  const byId = new Map(STONEAGE_KNOWLEDGE.entries.map((entry) => [entry.id, entry]));
  return [...new Set(ids)].map((id) => byId.get(id)).filter(Boolean);
}

function compactStoneAgeKnowledgeEntry(entry) {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    version: entry.version || "",
    group: entry.group || "",
    status: entry.status || "",
    summary: entry.summary,
    facts: (entry.facts || []).slice(0, 4),
    guidance: (entry.guidance || []).slice(0, 2)
  };
}

function localStoneAgeKnowledgeReply(knowledge, speaker = "AI向导") {
  const rawEntries = (knowledge?.entries || []).filter((entry) => entry.category !== "system");
  const primary = rawEntries[0]?.category || "";
  const entries = rawEntries
    .filter((entry) => stoneAgeRelatedKnowledgeCategory(primary, entry.category))
    .slice(0, 3);
  if (!entries.length) return "";
  const lines = entries.map((entry, index) => {
    const fact = entry.facts?.[0] || entry.summary || "";
    const guidance = entry.guidance?.[0] || "";
    const meta = [entry.version, entry.group, entry.status === "catalog" ? "目录索引" : ""].filter(Boolean).join(" / ");
    return `${index + 1}. ${entry.title}${meta ? `（${meta}）` : ""}：${fact}${guidance ? ` ${guidance}` : ""}`;
  });
  return [
    `${speaker}按石器时代资料库能对上这些线索：`,
    ...lines,
    "我会把这些当攻略背景；真正能不能交任务、传送、给奖励或开战，仍看当前 NPC 脚本、背包、flag 和 Worker VM。"
  ].join("\n");
}

function stoneAgeRelatedKnowledgeCategory(primary, category) {
  if (!primary || primary === category) return true;
  const related = {
    quest: ["quest"],
    pet: ["pet", "combat"],
    combat: ["combat", "pet"],
    map: ["map", "village", "world"],
    village: ["village", "map", "world"],
    world: ["world", "map", "village"],
    version: ["version", "quest"],
    guide: ["guide", "pet", "combat", "map"]
  };
  return (related[primary] || [primary]).includes(category);
}

function isStoneAgeKnowledgeQuestion(text) {
  const value = guideSearchText(text);
  return hasAny(value, [
    "攻略",
    "版本",
    "新手",
    "入门",
    "坐标",
    "座标",
    "属性相克",
    "地克水",
    "水克火",
    "火克风",
    "风克地",
    "宠物技能",
    "宠物邮件",
    "骑宠",
    "忠诚",
    "三围",
    "红暴",
    "四圣石",
    "四宝玉",
    "英雄岛",
    "成人仪式",
    "成人礼",
    "委托店",
    "宠物二转",
    "六转",
    "精灵的召唤",
    "精灵的传说",
    "尼斯大陆",
    "村庄购物",
    "2.5",
    "2.0",
    "二点五",
    "二五",
    "转生",
    "五兄弟",
    "梦德洞窟",
    "愿藏娃娃",
    "梦幻洞窟",
    "委托店",
    "JOT",
    "SOT"
  ]);
}

function isSpecificStoneAgeKnowledgeQuestion(text) {
  const value = guideSearchText(text);
  return isStoneAgeKnowledgeQuestion(value) && !["任务", "委托", "quest"].includes(value);
}

function createAiWorkspace(now = new Date().toISOString()) {
  return {
    schema: AI_WORKSPACE_SCHEMA,
    scope: "save-local",
    createdAt: now,
    updatedAt: now,
    memories: []
  };
}

function normalizeAiWorkspace(workspace = null) {
  const now = new Date().toISOString();
  const out = {
    ...createAiWorkspace(now),
    ...(workspace && typeof workspace === "object" ? workspace : {})
  };
  out.schema = AI_WORKSPACE_SCHEMA;
  out.scope = out.scope || "save-local";
  out.createdAt ||= now;
  out.updatedAt ||= out.createdAt;
  out.memories = Array.isArray(out.memories)
    ? out.memories.map(normalizeAiWorkspaceMemory).filter(Boolean).slice(0, AI_WORKSPACE_MAX_MEMORIES)
    : [];
  return out;
}

function normalizeAiNpcCache(cache = null) {
  const now = Date.now();
  const entries = Array.isArray(cache?.entries)
    ? cache.entries
    : (Array.isArray(cache) ? cache : []);
  return {
    schema: AI_NPC_CACHE_SCHEMA,
    entries: entries
      .map(normalizeAiNpcCacheEntry)
      .filter((entry) => entry && entry.expiresAt > now)
      .slice(0, AI_NPC_CACHE_MAX_ENTRIES)
  };
}

function normalizeAiNpcCacheEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const key = String(entry.key || "").trim();
  const reply = String(entry.reply || "").trim().slice(0, AI_NPC_CACHE_REPLY_LIMIT);
  if (!key || !reply) return null;
  const createdAt = Number(entry.createdAt || Date.now());
  const expiresAt = Number(entry.expiresAt || createdAt + AI_NPC_CACHE_TTL_MS);
  return {
    key,
    reply,
    provider: String(entry.provider || "unknown").slice(0, 32),
    model: String(entry.model || "unknown").slice(0, 80),
    intent: String(entry.intent || "").slice(0, 32),
    hits: clampInt(entry.hits, 0, 9999, 0),
    createdAt,
    expiresAt
  };
}

function aiNpcRemoteRuntime(env) {
  if (hasOpenAi(env)) {
    return { provider: "openai", model: openAiModel(env), cacheable: true };
  }
  if (env?.AI && typeof env.AI.run === "function") {
    return { provider: "workers-ai", model: env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct", cacheable: true };
  }
  return { provider: "local-rule", model: "local-rule", cacheable: false };
}

function isPureOpenAiNpcReply(decision) {
  return String(decision?.action?.type || "none") === "none";
}

function buildAiNpcCacheKey(game, npc, text, map, debug, scriptReferences, runtime, persona = null, social = null) {
  const promptPersona = persona || buildNpcPersona(game, npc, map);
  const promptSocial = social || compactNpcSocialForPrompt(game, npc);
  const state = {
    schema: AI_NPC_CACHE_SCHEMA,
    runtime: `${runtime.provider}:${runtime.model}`,
    prompt: normalizeNpcCacheText(text),
    npc: {
      id: npc.id,
      name: npc.name,
      type: npc.type,
      script: npc.script,
      source: npc.source,
      actions: debug.actions,
      persona: {
        role: promptPersona.role,
        profession: promptPersona.profession,
        duty: promptPersona.duty,
        gender: promptPersona.gender?.value || "unknown",
        genderConfidence: promptPersona.gender?.confidence || 0,
        capabilities: promptPersona.roleFitCapabilities || []
      }
    },
    location: {
      mapId: map.id,
      floorId: map.floorId,
      x: Number(game.location?.x || 0),
      y: Number(game.location?.y || 0)
    },
    player: {
      level: Number(game.player?.level || game.player?.Lv || 1),
      hp: Number(game.player?.hp || 0),
      maxHp: Number(game.player?.maxHp || 0),
      stone: Number(game.player?.stone || 0),
      charm: Number(game.player?.charm || 0)
    },
    inventory: (game.inventory || [])
      .map((item) => [String(item.id), Number(item.qty || 0)])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .slice(0, INVENTORY_CAPACITY + 4),
    pets: (game.pets || [])
      .map((pet, index) => [index, pet.id || pet.petId || pet.name || pet.petName || "", pet.name || pet.petName || "", Number(pet.level || pet.Lv || 1), Number(pet.Hp || 0)])
      .slice(0, PET_CAPACITY),
    effects: Object.entries(game.effects || {})
      .map(([key, value]) => [key, stableHashInt(typeof value === "object" ? JSON.stringify(value) : String(value))])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(0, 16),
    tasks: sourceScriptTaskState(game)
      .map((task) => ({
        id: task.id,
        eventNo: task.eventNo,
        phase: task.phase,
        sourceCluster: task.sourceCluster,
        requiredItems: (task.requiredItems || []).map((item) => [item.id, item.have, item.need]).slice(0, 6),
        nextNpcs: (task.nextNpcs || []).map((target) => [target.name, target.mapId, target.x, target.y]).slice(0, 4)
      }))
      .slice(0, 6),
    quests: Object.entries(game.quests || {})
      .map(([questId, quest]) => [questId, quest?.status || "", quest?.step || ""])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
      .slice(0, 10),
    social: {
      scores: promptSocial.scores,
      memories: (promptSocial.memories || []).map((memory) => [memory.kind, stableHashInt(memory.text), memory.weight])
    },
    proposal: compactPendingNpcProposalForPrompt(game, npc),
    refs: stableHashInt(JSON.stringify(scriptReferences || {}))
  };
  const raw = JSON.stringify(state);
  const a = stableHashInt(raw).toString(36);
  const b = stableHashInt([...raw].reverse().join("")).toString(36);
  return `${AI_NPC_CACHE_SCHEMA}:${a}:${b}`;
}

function normalizeNpcCacheText(text) {
  return String(text || "").trim().replace(/\s+/g, " ").slice(0, 220);
}

function readAiNpcCache(game, key) {
  const cache = normalizeAiNpcCache(game.aiNpcCache);
  const index = cache.entries.findIndex((entry) => entry.key === key);
  if (index < 0) {
    game.aiNpcCache = cache;
    return null;
  }
  const entry = { ...cache.entries[index], hits: clampInt(cache.entries[index].hits + 1, 0, 9999, 1) };
  cache.entries.splice(index, 1);
  cache.entries.unshift(entry);
  game.aiNpcCache = cache;
  return entry;
}

function writeAiNpcCache(game, key, reply, runtime, intent = "") {
  if (!key || !runtime?.cacheable) return;
  const text = String(reply || "").trim();
  if (!text) return;
  const now = Date.now();
  const cache = normalizeAiNpcCache(game.aiNpcCache);
  const entry = normalizeAiNpcCacheEntry({
    key,
    reply: text.slice(0, AI_NPC_CACHE_REPLY_LIMIT),
    provider: runtime.provider,
    model: runtime.model,
    intent,
    hits: 0,
    createdAt: now,
    expiresAt: now + AI_NPC_CACHE_TTL_MS
  });
  cache.entries = [
    entry,
    ...cache.entries.filter((item) => item.key !== key)
  ].filter(Boolean).slice(0, AI_NPC_CACHE_MAX_ENTRIES);
  game.aiNpcCache = cache;
}

function normalizeNpcSocial(social = null) {
  const raw = social?.npcs && typeof social.npcs === "object"
    ? Object.entries(social.npcs)
    : [];
  const entries = raw
    .map(([id, entry]) => normalizeNpcSocialEntry(id, entry))
    .filter(Boolean)
    .sort((a, b) => String(b[1].updatedAt || "").localeCompare(String(a[1].updatedAt || "")))
    .slice(0, NPC_SOCIAL_MAX_NPCS);
  return {
    schema: NPC_SOCIAL_SCHEMA,
    npcs: Object.fromEntries(entries)
  };
}

function normalizeNpcSocialEntry(id, entry) {
  if (!entry || typeof entry !== "object") return null;
  const npcId = String(entry.npcId || id || "").trim().slice(0, 120);
  if (!npcId) return null;
  const scores = entry.scores && typeof entry.scores === "object" ? entry.scores : {};
  const memories = Array.isArray(entry.memories)
    ? entry.memories.map(normalizeNpcSocialMemory).filter(Boolean).slice(0, NPC_SOCIAL_MAX_MEMORIES)
    : [];
  return [npcId, {
    npcId,
    npcName: String(entry.npcName || "").trim().slice(0, 40),
    scores: {
      affinity: clampInt(scores.affinity, -100, 100, 0),
      trust: clampInt(scores.trust, -100, 100, 0),
      suspicion: clampInt(scores.suspicion, -100, 100, 0),
      helped: clampInt(scores.helped, 0, 999, 0),
      threatened: clampInt(scores.threatened, 0, 999, 0),
      challenged: clampInt(scores.challenged, 0, 999, 0),
      declined: clampInt(scores.declined, 0, 999, 0),
      failed: clampInt(scores.failed, 0, 999, 0),
      cooldownUntil: clampInt(scores.cooldownUntil, 0, Number.MAX_SAFE_INTEGER, 0)
    },
    memories,
    updatedAt: String(entry.updatedAt || entry.at || new Date().toISOString()).slice(0, 32)
  }];
}

function normalizeNpcSocialMemory(memory) {
  if (!memory || typeof memory !== "object") return null;
  const text = String(memory.text || "").replace(/\s+/g, " ").trim().slice(0, 96);
  if (!text) return null;
  return {
    kind: String(memory.kind || "note").trim().slice(0, 24),
    text,
    at: String(memory.at || new Date().toISOString()).slice(0, 32),
    weight: clampInt(memory.weight, 1, 5, 1)
  };
}

function npcSocialId(npc) {
  return String(npc?.id || `${npc?.source || ""}:${npc?.script || ""}:${npc?.name || ""}`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function readNpcSocialEntry(game, npc) {
  const social = normalizeNpcSocial(game?.npcSocial);
  return social.npcs[npcSocialId(npc)] || null;
}

function ensureNpcSocialEntry(game, npc) {
  game.npcSocial = normalizeNpcSocial(game.npcSocial);
  const id = npcSocialId(npc);
  if (!game.npcSocial.npcs[id]) {
    game.npcSocial.npcs[id] = {
      npcId: id,
      npcName: String(npc?.name || "").slice(0, 40),
      scores: { affinity: 0, trust: 0, suspicion: 0, helped: 0, threatened: 0, challenged: 0, declined: 0, failed: 0, cooldownUntil: 0 },
      memories: [],
      updatedAt: new Date().toISOString()
    };
  }
  return game.npcSocial.npcs[id];
}

function pruneNpcSocial(game) {
  game.npcSocial = normalizeNpcSocial(game.npcSocial);
}

function writeNpcSocialMemory(game, npc, memory, scoreDelta = {}) {
  const entry = ensureNpcSocialEntry(game, npc);
  entry.npcName = String(npc?.name || entry.npcName || "").slice(0, 40);
  entry.scores ||= {};
  for (const [key, value] of Object.entries(scoreDelta || {})) {
    if (!["affinity", "trust", "suspicion", "helped", "threatened", "challenged", "declined", "failed", "cooldownUntil"].includes(key)) continue;
    const min = ["helped", "threatened", "challenged", "declined", "failed", "cooldownUntil"].includes(key) ? 0 : -100;
    const max = key === "cooldownUntil" ? Number.MAX_SAFE_INTEGER : (min === 0 ? 999 : 100);
    entry.scores[key] = clampInt(Number(entry.scores[key] || 0) + Number(value || 0), min, max, Number(entry.scores[key] || 0));
  }
  const normalized = normalizeNpcSocialMemory(memory);
  if (normalized) {
    const key = `${normalized.kind}:${normalized.text}`;
    entry.memories = [
      normalized,
      ...(entry.memories || []).filter((item) => `${item.kind}:${item.text}` !== key)
    ].slice(0, NPC_SOCIAL_MAX_MEMORIES);
  }
  entry.updatedAt = new Date().toISOString();
  pruneNpcSocial(game);
  return entry;
}

function recordNpcSocialFromMessage(game, npc, text) {
  const body = String(text || "").trim();
  if (!body || !game || !npc) return false;
  const signals = [];
  if (/(谢谢|多谢|拜托|麻烦|请你|请帮|帮我|帮帮|劳驾)/i.test(body)) {
    signals.push({ kind: "request", label: "求助", score: { affinity: 1, trust: 1 }, weight: 1 });
  }
  if (/(威胁|让开|滚开|不然|打你|揍你|砍你|杀了|干掉|抢走)/i.test(body)) {
    signals.push({ kind: "threat", label: "威胁", score: { suspicion: 3, threatened: 1, affinity: -2 }, weight: 3 });
  }
  if (/(挑战|决斗|开战|打一架|来战|比试|切磋)/i.test(body)) {
    signals.push({ kind: "challenge", label: "挑战", score: { challenged: 1, suspicion: 1 }, weight: 2 });
  }
  if (/(贿赂|买通|收钱|给你钱|石币|报酬|小费)/i.test(body)) {
    signals.push({ kind: "bargain", label: "交涉", score: { suspicion: 1 }, weight: 2 });
  }
  if (!signals.length) return false;
  const signal = signals.sort((a, b) => b.weight - a.weight)[0];
  writeNpcSocialMemory(game, npc, {
    kind: signal.kind,
    text: `玩家${signal.label}：「${body.slice(0, 48)}」`,
    weight: signal.weight
  }, signal.score);
  recordNpcVmEvent(game, npc, "say", "ok", {
    reason: "npc-social-memory",
    kind: signal.kind,
    cacheable: false
  });
  return true;
}

function compactNpcSocialForPrompt(game, npc, limit = NPC_SOCIAL_PROMPT_MEMORY_LIMIT) {
  const entry = readNpcSocialEntry(game, npc);
  const pendingProposal = publicNpcProposal(game, npc);
  if (!entry) {
    return {
      schema: NPC_SOCIAL_SCHEMA,
      npcId: npcSocialId(npc),
      scores: { affinity: 0, trust: 0, suspicion: 0, helped: 0, threatened: 0, challenged: 0, declined: 0, failed: 0, cooldownUntil: 0 },
      memories: [],
      pendingProposal
    };
  }
  return {
    schema: NPC_SOCIAL_SCHEMA,
    npcId: entry.npcId,
    npcName: entry.npcName,
    scores: { ...entry.scores },
    memories: (entry.memories || [])
      .slice(0, clampInt(limit, 0, NPC_SOCIAL_MAX_MEMORIES, NPC_SOCIAL_PROMPT_MEMORY_LIMIT))
      .map((memory) => ({
        kind: memory.kind,
        text: memory.text,
        weight: memory.weight
      })),
    pendingProposal
  };
}

function summarizeNpcSocialForDebug(game, npc) {
  const social = compactNpcSocialForPrompt(game, npc);
  return {
    schema: NPC_SOCIAL_SCHEMA,
    npcId: social.npcId,
    scores: social.scores,
    memoryCount: readNpcSocialEntry(game, npc)?.memories?.length || 0,
    memoriesUsed: social.memories,
    pendingProposal: social.pendingProposal
  };
}

function buildNpcPersona(game, npc, map = null) {
  const actions = npcActionProfile(npc);
  const dialogueLines = npcDialogueLines(npc).slice(0, 4);
  const role = inferNpcPersonaRole(npc, actions);
  const gender = inferNpcPersonaGender(npc, dialogueLines);
  const ageRole = inferNpcAgeRole(npc, dialogueLines);
  const topics = npcPersonaTopics(npc, actions, map);
  return {
    schema: "stoneage-npc-persona-v1",
    npcId: npcSocialId(npc),
    name: String(npc?.name || "").slice(0, 40),
    identity: npcPersonaIdentity(npc, role, map),
    role: role.role,
    profession: role.profession,
    duty: role.duty,
    ageRole,
    gender,
    sourceMeaning: npcPersonaSourceMeaning(npc, dialogueLines),
    topics,
    roleFitCapabilities: role.capabilities,
    map: map ? { id: map.id, name: map.name, floorId: map.floorId } : null
  };
}

function inferNpcPersonaRole(npc, actions = npcActionProfile(npc)) {
  const text = `${npc?.name || ""} ${npc?.type || ""} ${npc?.template || ""} ${npc?.script || ""}`;
  const capabilities = [];
  const add = (value) => {
    if (value && !capabilities.includes(value)) capabilities.push(value);
  };
  if (isNpcEnemy(npc)) {
    add("startBattle");
    add("negotiatePass");
    return { role: "battle_npc", profession: "守路/战斗 NPC", duty: "拦路、开战或按脚本判断是否放行", capabilities };
  }
  if (npc.trade?.items?.length) {
    add("trade");
    add("discussStock");
    return { role: "shopkeeper", profession: "店员/商人", duty: "出售原版店铺货物，并解释商品用途", capabilities };
  }
  if (isHealerNpc(npc)) {
    add("heal");
    return { role: "healer", profession: "治疗师", duty: "治疗、说明伤势与恢复相关线索", capabilities };
  }
  if (isSavePointNpc(npc)) {
    add("savePoint");
    return { role: "savepoint_keeper", profession: "记录点", duty: "按原脚本处理记录点与出生点", capabilities };
  }
  if (isRouteServiceNpc(npc)) {
    add("routeService");
    add("warp");
    return { role: "route_service", profession: "交通/路线服务", duty: "提供原版交通、路线或移动服务", capabilities };
  }
  if (npc.petShop || actions.includes("petShop")) {
    add("petShop");
    return { role: "pet_keeper", profession: "宠物店员", duty: "处理宠物寄放、取回或宠物相关说明", capabilities };
  }
  if (npc.warp?.target || actions.includes("warp")) {
    add("warp");
    return { role: "transport", profession: "传送/通路 NPC", duty: "按原版条件传送或说明目的地", capabilities };
  }
  if (npc.questLead || npcQuestIds(npc).length || hasNpcScriptEvents(npc)) {
    add("questGuidance");
    if (actions.includes("give")) add("giveByScript");
    if (actions.includes("take")) add("takeByScript");
    return { role: "quest_npc", profession: "任务 NPC", duty: "按原脚本给出任务条件、线索和奖励说明", capabilities };
  }
  if (/sign|board|看板|告示|牌/i.test(text)) {
    add("readSign");
    return { role: "signboard", profession: "看板", duty: "展示原脚本文字和地点说明", capabilities };
  }
  add("talk");
  return { role: "villager", profession: "居民", duty: "按照所在地图和脚本台词提供本地信息", capabilities };
}

function inferNpcPersonaGender(npc, dialogueLines = []) {
  const text = `${npc?.name || ""} ${npc?.type || ""} ${npc?.template || ""} ${dialogueLines.join(" ")}`;
  const femaleSignals = text.match(/(女性|女人|女孩|少女|姑娘|小姐|姐姐|妹妹|妈妈|母亲|妻子|老婆|女儿|护士|老奶奶)/g) || [];
  const maleSignals = text.match(/(男性|男人|男孩|少年|先生|哥哥|弟弟|爸爸|父亲|丈夫|儿子|老爷爷|爷爷|叔叔|伯伯)/g) || [];
  if (femaleSignals.length && !maleSignals.length) {
    return { value: "female", confidence: 0.85, signals: [...new Set(femaleSignals)].slice(0, 4), gameplayEffect: "tone-only" };
  }
  if (maleSignals.length && !femaleSignals.length) {
    return { value: "male", confidence: 0.85, signals: [...new Set(maleSignals)].slice(0, 4), gameplayEffect: "tone-only" };
  }
  return { value: "unknown", confidence: 0, signals: [], gameplayEffect: "tone-only" };
}

function inferNpcAgeRole(npc, dialogueLines = []) {
  const text = `${npc?.name || ""} ${npc?.type || ""} ${npc?.template || ""} ${dialogueLines.join(" ")}`;
  if (/(老人|长者|長者|长老|長老|爷爷|老爷爷|老奶奶|婆婆|伯伯)/.test(text)) return "elder";
  if (/(小孩|孩子|男孩|女孩|少年|少女|小姑娘|小男孩)/.test(text)) return "young";
  return "unknown";
}

function npcPersonaIdentity(npc, role, map) {
  const mapName = map?.name ? `，在 ${map.name}` : "";
  return `${npc?.name || "NPC"} 是${role.profession || "NPC"}${mapName}`;
}

function npcPersonaSourceMeaning(npc, dialogueLines = []) {
  const hints = [
    npc?.questLead?.summary,
    npc?.scriptHints?.hints?.[0],
    dialogueLines[0],
    npc?.trade?.source,
    npc?.warp?.source,
    npc?.source,
    npc?.script
  ].filter(Boolean).map((item) => String(item).replace(/\s+/g, " ").trim());
  return hints[0]?.slice(0, 120) || "本地 world-data/gmsv 脚本只提供基础身份。";
}

function npcPersonaTopics(npc, actions = npcActionProfile(npc), map = null) {
  const topics = [];
  const add = (value) => {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text && !topics.includes(text)) topics.push(text.slice(0, 36));
  };
  add(map?.name);
  add(npc?.questLead?.title);
  for (const item of npc?.trade?.items?.slice(0, 5) || []) add(item.name);
  for (const line of npcDialogueLines(npc).slice(0, 3)) add(line);
  if (actions.includes("warp")) add(npc?.warpStatus?.targetName || npc?.warp?.targetName || "传送");
  if (actions.includes("routeService")) add("路线/交通");
  if (actions.includes("save")) add("记录点");
  if (actions.includes("startBattle")) add("战斗");
  return topics.slice(0, 8);
}

function normalizeAiWorkspaceMemory(entry) {
  if (!entry || typeof entry !== "object") return null;
  const text = String(entry.text || "").trim().slice(0, 360);
  const title = String(entry.title || "").trim().slice(0, 60);
  if (!text && !title) return null;
  const now = new Date().toISOString();
  return {
    id: String(entry.id || `mem-${stableFlag(`${title}:${text}:${entry.createdAt || now}`).toString(36)}`),
    kind: aiWorkspaceKind(entry.kind),
    title: title || aiWorkspaceKind(entry.kind),
    text,
    tags: Array.isArray(entry.tags) ? entry.tags.map((tag) => String(tag).trim().slice(0, 24)).filter(Boolean).slice(0, 8) : [],
    source: String(entry.source || "ai-workspace").trim().slice(0, 80),
    confidence: clampNumber(entry.confidence, 0, 1, 0.6),
    createdAt: String(entry.createdAt || now),
    updatedAt: String(entry.updatedAt || entry.createdAt || now)
  };
}

function writeAiWorkspaceNote(game, note = {}) {
  const workspace = normalizeAiWorkspace(game.aiWorkspace);
  const now = new Date().toISOString();
  const title = String(note.title || note.key || "").trim().slice(0, 60);
  const text = String(note.text || note.body || note.value || "").trim().slice(0, 360);
  if (!title && !text) throw new Error("AI workspace note 需要 title 或 text");
  const entry = normalizeAiWorkspaceMemory({
    id: crypto.randomUUID(),
    kind: note.kind,
    title: title || aiWorkspaceKind(note.kind),
    text,
    tags: Array.isArray(note.tags) ? note.tags : String(note.tags || "").split(/[,\s，、]+/),
    source: note.source || "api:/api/ai/workspace-note",
    confidence: note.confidence,
    createdAt: now,
    updatedAt: now
  });
  workspace.memories = [
    entry,
    ...workspace.memories.filter((item) => item.id !== entry.id)
  ].slice(0, AI_WORKSPACE_MAX_MEMORIES);
  workspace.updatedAt = now;
  game.aiWorkspace = workspace;
  game.character ||= {};
  game.character.updatedAt = now;
  addLog(game, `AI workspace 记录：${entry.title}`);
  return entry;
}

function buildAiWorkspace(env, game, prompt = "") {
  const map = currentMap(game);
  const nearby = nearbyState(game, map);
  const characterFields = compactCharacterFields(game);
  const encounterGates = guideEncounterGateSummary(game, map);
  const encounterGateText = guideEncounterGateText(encounterGates);
  const lastBattle = guideLastBattleSummary(game);
  return {
    schema: AI_WORKSPACE_SCHEMA,
    scope: "per-save workspace; 可迁移到 D1/KV/R2，但当前先随存档走",
    runtime: aiRuntimeStatus(env),
    writePolicy: {
      mode: "worker-validated-notes",
      endpoint: "POST /api/ai/workspace-note",
      allowedKinds: ["observation", "questLead", "playerPreference", "todo", "routeHint", "npcMemory"],
      maxMemories: AI_WORKSPACE_MAX_MEMORIES,
      rule: "AI 只能写入受限 note，不能直接写背包、任务、flag、石币、传送或战斗结果。"
    },
    current: {
      player: {
        ...compactPlayerContext(game),
        hp: `${game.player.hp}/${game.player.maxHp}`
      },
      characterFields,
      location: {
        mapId: map.id,
        floorId: map.floorId,
        name: map.name,
        position: [game.location.x, game.location.y],
        canWildEncounter: map.canWildEncounter,
        wildEncounterReason: map.wildEncounterReason,
        encounterGateText,
        encounterGates
      },
      nearby,
      activePet: getActivePet(game) ? petSummary(getActivePet(game)) : null,
      inventory: inventoryState(game),
      petState: petState(game),
      effects: guideEffectSummary(game),
      quests: responseQuestState(game),
      sourceTasks: sourceScriptTaskState(game),
      battle: game.encounter ? {
        enemy: game.encounter.Name,
        level: game.encounter.Lv,
        hp: game.encounter.Hp,
        source: game.battle?.source || game.encounter.source || "",
        dropText: guidePotentialLootText(game.encounter.EnemyDropTable || game.encounter.dropTable || [], 6),
        taskLootText: guideTaskLootText(game, game.encounter.EnemyDropTable || game.encounter.dropTable || [], "当前敌人"),
        encounterGates: game.battle?.encounterArea?.groupGates || []
      } : null,
      lastBattle
    },
    actionSurface: {
      guideCanMutate: ["heal", "item-use", "item-drop", "pet-switch", "pet-release", "auto-level", "encounter", "teleport", "noEncounter"],
      npcVmActions: [...NPC_VM_ACTIONS],
      authority: "worker-npc-vm"
    },
    knowledge: buildStoneAgeKnowledgeContext(game, map, prompt),
    memory: compactAiWorkspaceMemory(game),
    sources: STONEAGE_KNOWLEDGE.sources
  };
}

function compactAiWorkspaceMemory(game) {
  const workspace = normalizeAiWorkspace(game.aiWorkspace);
  return {
    schema: workspace.schema,
    scope: workspace.scope,
    updatedAt: workspace.updatedAt,
    count: workspace.memories.length,
    memories: workspace.memories.slice(0, 12).map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      text: entry.text,
      tags: entry.tags,
      source: entry.source,
      confidence: entry.confidence,
      updatedAt: entry.updatedAt
    }))
  };
}

function aiWorkspaceKind(kind) {
  const value = guideSearchText(kind || "observation");
  const allowed = {
    observation: "observation",
    questlead: "questLead",
    playerpreference: "playerPreference",
    todo: "todo",
    routehint: "routeHint",
    npcmemory: "npcMemory"
  };
  return allowed[value] || "observation";
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function guideEffectSummary(game) {
  const now = Date.now();
  const effects = [];
  const noEncounterUntil = Number(game.effects?.noEncounterUntil || 0);
  if (noEncounterUntil > now) {
    effects.push({
      type: "noEncounter",
      secondsLeft: Math.ceil((noEncounterUntil - now) / 1000),
      reason: game.effects?.noEncounterReason || "",
      source: game.effects?.noEncounterSource || ""
    });
  }
  const expBonus = game.effects?.expBonus;
  if (Number(expBonus?.until || 0) > now) {
    effects.push({
      type: "expBonus",
      power: Number(expBonus.power || 0),
      multiplier: Number(expBonus.multiplier || 1),
      secondsLeft: Math.ceil((Number(expBonus.until) - now) / 1000),
      source: expBonus.source || "",
      itemName: expBonus.itemName || ""
    });
  }
  const chikula = game.effects?.chikula;
  if (Number(chikula?.until || 0) > now) {
    effects.push({
      type: "chikula",
      resource: chikula.resource || "hp",
      amount: Number(chikula.amount || 0),
      secondsLeft: Math.ceil((Number(chikula.until) - now) / 1000),
      source: chikula.source || "",
      itemName: chikula.itemName || ""
    });
  }
  const metamo = game.effects?.metamo;
  const metamoUntil = Number(metamo?.until || game.effects?.metamoUntil || 0);
  if (metamoUntil > now) {
    effects.push({
      type: "metamo",
      imageNo: Number(metamo?.imageNo || 0),
      formName: metamo?.formName || "",
      secondsLeft: Math.ceil((metamoUntil - now) / 1000),
      source: metamo?.source || "",
      itemName: metamo?.itemName || ""
    });
  }
  for (const [npcId, discount] of Object.entries(game.effects?.shopDiscounts || {})) {
    if (Number(discount.until || 0) > now) effects.push({
      type: "shopDiscount",
      npcId,
      percent: discount.percent,
      secondsLeft: Math.ceil((discount.until - now) / 1000),
      source: discount.source || ""
    });
  }
  for (const [npcId, entry] of Object.entries(game.effects?.offMenuShop || {})) {
    if (Number(entry.until || 0) > now) effects.push({
      type: "offMenuShop",
      npcId,
      items: (entry.items || []).map((item) => item.name),
      secondsLeft: Math.ceil((entry.until - now) / 1000),
      source: entry.source || ""
    });
  }
  for (const [npcId, entry] of Object.entries(game.flags?.npcEnemyDefeats || {})) {
    const until = Date.parse(entry.until || "");
    if (Number.isFinite(until) && until > now) effects.push({
      type: "npcBypass",
      npcId,
      npcName: entry.npcName || "",
      secondsLeft: Math.ceil((until - now) / 1000),
      source: entry.source || ""
    });
  }
  return effects;
}

function guideActionPlan(context) {
  const task = guidePrimaryTask(context);
  const lines = [];
  if (task) {
    lines.push(...guideTaskPlanLines(context, task));
  } else {
    lines.push(...guideOpenTaskPlanLines(context));
  }
  return {
    source: "worker-deterministic-guide",
    location: `${context.location.name} floor ${context.location.floorId || context.location.mapId} (${context.location.position.join(",")})`,
    lines: compactGuidanceLines(lines)
  };
}

function guidePrimaryTask(context) {
  const reportable = context.quests.find((item) => item.status === "可回报");
  if (reportable) return { kind: "quest", status: "reportable", item: reportable };
  const sourceTask = context.sourceTasks?.[0] || null;
  if (sourceTask) return { kind: "sourceTask", status: sourceTask.phase || "进行中", item: sourceTask };
  const active = context.quests.find((item) => item.status === "进行中");
  if (active) return { kind: "quest", status: "active", item: active };
  return null;
}

function guideTaskPlanLines(context, task) {
  const item = task.item || {};
  const lines = [
    `当前位置：${context.location.name} floor ${context.location.floorId || context.location.mapId} (${context.location.position.join(",")})。`,
    `${task.status === "reportable" ? "下一步：回报" : "下一步：继续"}「${item.title || "当前任务"}」。`
  ];
  const guidance = Array.isArray(item.guidance) ? item.guidance.filter(Boolean) : [];
  if (guidance.length) {
    lines.push(...guidance.slice(0, 4));
  } else {
    const fallback = task.kind === "sourceTask"
      ? item.next || "按原脚本事件继续找相关 NPC。"
      : item.nextDetail || guidanceText(item, item.steps?.[Math.min(Number(item.progress || 0), Math.max(0, (item.steps || []).length - 1))] || "继续探索。");
    if (fallback) lines.push(fallback);
  }
  if (item.target) lines.push(guideTargetLine(item.target));
  const nearby = guideRelevantNpcList(context, 3);
  if (nearby) lines.push(`附近可问：${nearby}。`);
  const exits = guideExitList(context, 3);
  if (exits) lines.push(`可用出口：${exits}。`);
  lines.push("操作：NPC 走到两格内双击或输入 hi；地图传送点按出口走过去触发，不需要对话。");
  return lines;
}

function guideOpenTaskPlanLines(context) {
  const lines = [
    `当前位置：${context.location.name} floor ${context.location.floorId || context.location.mapId} (${context.location.position.join(",")})。`
  ];
  const questTitles = (context.availableQuests || []).slice(0, 4).map((quest) => quest.title).filter(Boolean);
  if (questTitles.length) lines.push(`可接核心任务：${questTitles.join("、")}。`);
  const starters = guideRelevantNpcList(context, 5);
  if (starters) {
    lines.push(`先找这些 NPC 试线索/任务：${starters}。`);
    lines.push("做法：到目标 NPC 两格内双击，普通对话先看原脚本；只有想协商额外帮助时再打开 AI。");
  } else {
    lines.push("当前附近没有明显任务 NPC；先看地图出口去村镇、庄园、洞窟入口或有 quest/window 动作的 NPC。");
  }
  const exits = guideExitList(context, 4);
  if (exits) lines.push(`换地图路线：${exits}。`);
  lines.push("地图传送点不是 NPC，不需要对话；走到出口格会由 Worker 按 mapwarp/source 条件判断。");
  return lines;
}

function guideRelevantNpcList(context, limit = 4) {
  return (context.map?.npcs || [])
    .filter((npc) => guideNpcRelevantForTasks(npc))
    .slice(0, limit)
    .map((npc) => {
      const actions = (npc.actions || []).filter((action) => !["effect"].includes(action)).slice(0, 3).join("/");
      const pos = Array.isArray(npc.position) ? `(${npc.position[0]},${npc.position[1]})` : "";
      return `${npc.name}${actions ? `[${actions}]` : ""}${pos} 距离${npc.distance}`;
    })
    .join("；");
}

function guideNpcRelevantForTasks(npc) {
  const actions = new Set(npc.actions || []);
  if (actions.has("quest") || actions.has("window") || actions.has("startBattle")) return true;
  if (npc.questLead || npc.scriptStatus?.hasReadyBranch || npc.scriptStatus?.hasBlockedBranch) return true;
  if (actions.has("say") && !actions.has("warp")) return true;
  return false;
}

function guideExitList(context, limit = 3) {
  return (context.map?.exits || [])
    .slice(0, limit)
    .map((exit) => {
      const target = exit.targetMapName || `floor ${exit.to}`;
      const nearby = exit.distance <= 2 ? "附近" : `距离${exit.distance}`;
      return `${exit.label}->${target}(${nearby})`;
    })
    .join("；");
}

function guideTargetLine(target = {}) {
  if (target.name && target.mapName) {
    const dist = Number(target.distance || 0) < 9999 ? `，距离 ${target.distance} 格` : "";
    return `目标 NPC：去 ${target.mapName} floor ${target.mapId} (${target.x},${target.y}) 找 ${target.name}${dist}${sourceTaskTargetHandoffText(target)}。`;
  }
  if (target.mapName) {
    const exit = target.exit ? `，当前可走出口「${target.exit.label}」${target.exit.position || ""}，距离 ${target.exit.distance} 格` : "";
    return `目标地图：去 ${target.mapName} floor ${target.mapId}${exit}。`;
  }
  return "";
}

function guideActionPlanText(context) {
  const lines = context.actionPlan?.lines || guideActionPlan(context).lines || [];
  return lines.join(" ");
}

function fallbackGuide(context, prompt = "", error = null) {
  const lower = String(prompt || "").toLowerCase();
  const active = context.quests.find((item) => item.status === "进行中");
  const reportable = context.quests.find((item) => item.status === "可回报");
  const sourceTask = context.sourceTasks?.[0] || null;
  const nearbyNpc = context.map.nearby.npcs.map((npc) => npc.name).join("、");
  const exits = context.map.exits.slice(0, 5).map((exit) => `${exit.label}${exit.distance <= 2 ? "(附近)" : ""}`).join("、") || "暂无出口";
  const effects = context.effects.map((item) => {
    if (item.type === "noEncounter") return `避敌剩余 ${item.secondsLeft}s`;
    if (item.type === "expBonus") return `经验加成 ${item.power}% 剩余 ${item.secondsLeft}s`;
    if (item.type === "chikula") return `奇克拉${item.resource === "mp" ? "气力" : "耐久力"} ${item.amount}`;
    if (item.type === "metamo") return `变身${item.formName ? `为${item.formName}` : ""} 剩余 ${item.secondsLeft}s`;
    if (item.type === "shopDiscount") return `NPC ${item.npcId} 折扣 ${item.percent}%`;
    if (item.type === "offMenuShop") return `临时商品 ${item.items.join("、")}`;
    if (item.type === "npcBypass") return `${item.npcName || item.npcId} 暂时让路`;
    return item.type;
  }).join("；");
  const aiNote = error ? "远程 AI 暂时不可用，我先按本地规则判断。 " : "";
  const hasCurrentTask = Boolean(reportable || sourceTask || active);
  const asksDrop = hasAny(lower, ["掉落", "掉东西", "战利品", "掉什么", "爆什么", "loot", "drop"]);
  const asksCurrentAction = hasAny(lower, ["下一步", "干嘛", "做什么", "现在应该", "任务指导"])
    || (hasCurrentTask && !asksDrop && hasAny(lower, ["任务", "quest", "怎么做", "攻略"]));
  if (asksCurrentAction) {
    return `${aiNote}${guideActionPlanText(context)}`;
  }
  if (isStoneAgeKnowledgeQuestion(lower)) {
    const reply = localStoneAgeKnowledgeReply(context.knowledge, "AI向导");
    if (reply) return `${aiNote}${reply}`;
  }
  if (asksDrop) {
    const parts = [];
    if (context.battle?.dropText) {
      parts.push(`当前敌人 ${context.battle.enemy || "敌人"} 的源码候选掉落：${context.battle.dropText}。`);
    }
    if (context.battle?.taskLootText) {
      parts.push(context.battle.taskLootText);
    }
    if (context.lastBattle?.potentialLootText) {
      const defeated = context.lastBattle.defeatedEnemies?.length ? `（${context.lastBattle.defeatedEnemies.join("、")}）` : "";
      parts.push(`上一场战斗${defeated}候选掉落：${context.lastBattle.potentialLootText}。`);
    }
    if (context.lastBattle?.taskLootText) {
      parts.push(context.lastBattle.taskLootText);
    }
    if (context.lastBattle?.lootText) {
      parts.push(`本次实际获得：${context.lastBattle.lootText}。`);
    } else if (context.lastBattle?.potentialLootText || context.battle?.dropText) {
      parts.push("如果本次没掉，是 enemy1.txt 的 ITEMPROB 概率未 roll 中；不是没有掉落表。");
    }
    if (context.location.encounterGateText) parts.push(`遇敌条件：${context.location.encounterGateText}。`);
    if (parts.length) return `${aiNote}${parts.join(" ")}`;
  }
  if (hasAny(lower, ["地图", "出口", "去哪", "去哪里", "传送", "瞬移"])) {
    const notable = (context.world?.notableMaps || [])
      .filter((map) => map.id !== context.location.mapId)
      .slice(0, 8)
      .map((map) => `${map.name}(floor ${map.floorId})`)
      .join("、");
    return `${aiNote}你在${context.location.name} (${context.location.position.join(",")})。可走出口：${exits}。Worker 已打包 ${context.world?.mapCount || "多张"} 张地图；可尝试的目标有：${notable || "当前出口目标"}。需要瞬移时可以说“带我去 地图名/floor”。`;
  }
  if (hasAny(lower, ["npc", "对话", "聊天", "任务线索"])) {
    const list = context.map.npcs.slice(0, 6).map((npc) => `${npc.name}[${npc.actions.join("/") || "say"}] 距离${npc.distance}`).join("；");
    return `${aiNote}当前地图 NPC 按距离看：${list || "无"}。距离 2 格内可以双击，AI 对话会参考 NPC 的职业、商品、传送和 gmsv 脚本线索。`;
  }
  if (hasAny(lower, ["遇敌", "野外", "刷怪", "敌人"])) {
    const gate = context.location.encounterGateText ? ` 源码条件：${context.location.encounterGateText}。` : "";
    return `${aiNote}${context.location.canWildEncounter ? "这里可以按 encount.txt 触发野外遇敌。" : context.location.wildEncounterReason}${gate} ${effects ? `当前状态：${effects}。` : ""}`;
  }
  if (reportable || sourceTask || active) return `${aiNote}${guideActionPlanText(context)}`;
  return `${aiNote}你现在在${context.location.name}。附近 NPC：${nearbyNpc || "无"}；出口：${exits}。${effects ? `当前状态：${effects}。` : ""}`;
}

function normalizeProfessionSkills(value = []) {
  const raw = Array.isArray(value) ? value : [];
  const byId = new Map();
  for (const entry of raw) {
    const id = Number(entry?.id ?? entry?.Id ?? entry?.skillId ?? entry?.SkillId ?? 0);
    if (!Number.isFinite(id) || id <= 0) continue;
    const level = clampInt(entry?.level ?? entry?.Level ?? entry?.percent ?? entry?.Percent, 0, 100, 0);
    byId.set(id, {
      id,
      name: String(entry?.name ?? entry?.Name ?? `职业技能 ${id}`),
      level,
      percent: clampInt(entry?.percent ?? entry?.Percent ?? level, 0, 100, level),
      classId: Number(entry?.classId ?? entry?.professionClass ?? entry?.Class ?? 0) || 0,
      className: String(entry?.className ?? entry?.professionClassName ?? ""),
      costMp: Number(entry?.costMp ?? entry?.CostMp ?? 0) || 0,
      func: String(entry?.func ?? entry?.FuncName ?? ""),
      source: String(entry?.source ?? "")
    });
  }
  return [...byId.values()].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
}

function playerProfessionSkillLevel(player, skillId) {
  const id = Number(skillId || 0);
  if (!id) return 0;
  const skills = normalizeProfessionSkills(player?.professionSkills || player?.ProfessionSkills || []);
  return Math.max(0, Number(skills.find((skill) => Number(skill.id) === id)?.percent || 0));
}

function syncProfessionAliases(player) {
  player.professionClass = clampInt(player.professionClass ?? player.ProfessionClass ?? player.PROFESSION_CLASS ?? player.classId ?? player.Class, 0, 4, 0);
  player.ProfessionClass = player.professionClass;
  player.PROFESSION_CLASS = player.professionClass;
  player.classId = player.professionClass;
  player.transmigration = clampInt(player.transmigration ?? player.Transmigration ?? player.TRANSMIGRATION ?? player.Trans ?? player.trans ?? player.CHAR_TRANSMIGRATION, 0, 99, 0);
  player.Transmigration = player.transmigration;
  player.TRANSMIGRATION = player.transmigration;
  player.trans = player.transmigration;
  player.professionSkillPoint = clampInt(player.professionSkillPoint ?? player.ProfessionSkillPoint ?? player.PROFESSION_SKILL_POINT, 0, 999999999, 0);
  player.ProfessionSkillPoint = player.professionSkillPoint;
  player.PROFESSION_SKILL_POINT = player.professionSkillPoint;
  player.professionSkills = normalizeProfessionSkills(player.professionSkills || player.ProfessionSkills || []);
  player.ProfessionSkills = player.professionSkills;
}

function normalizePlayerRuntime(player) {
  player.level = clampInt(player.level ?? player.Lv, 1, CHAR_MAXUPLEVEL, 1);
  player.exp = clampInt(player.exp ?? player.Exp, 0, CHAR_MAX_EXP, 0);
  player.Vital = clampInt(player.Vital, 1, 999999, 1600);
  player.Str = clampInt(player.Str, 1, 999999, 1200);
  player.Tough = clampInt(player.Tough, 1, 999999, 1200);
  player.Dex = clampInt(player.Dex, 1, 999999, 1000);
  normalizePlayerElementAttributes(player);
  player.duelPoint = clampInt(player.duelPoint ?? player.DuelPoint, 0, 999999999, 0);
  player.Luck = clampInt(player.Luck ?? player.luck, 1, 5, 1);
  player.WorkFixLuck = clampInt(player.WorkFixLuck ?? player.Luck, 1, 5, player.Luck);
  player.charm = clampInt(player.charm ?? player.Charm ?? player.CHARM, 0, 100, PLAYER_INITIAL_CHARM);
  player.fame = clampInt(player.fame ?? player.Fame ?? player.CHAR_FAME, 0, 999999999, 0);
  player.Fame = player.fame;
  player.CHAR_FAME = player.fame;
  player.amPoint = clampInt(player.amPoint ?? player.AMPoint ?? player.AMPOINT ?? player.CHAR_AMPOINT, 0, 999999999, 0);
  player.AMPoint = player.amPoint;
  player.AMPOINT = player.amPoint;
  player.CHAR_AMPOINT = player.amPoint;
  player.skillUpPoint = clampInt(player.skillUpPoint ?? player.SkillUpPoint, 0, 999999999, 0);
  syncProfessionAliases(player);
  player.killPetCount = clampInt(player.killPetCount ?? player.KillPetCount, 0, 999999999, 0);
  player.deadCount = clampInt(player.deadCount ?? player.DeadCount, 0, 999999999, 0);
  player.battleCount = clampInt(player.battleCount, 0, 999999999, 0);
  player.winCount = clampInt(player.winCount, 0, 999999999, 0);
  player.loseCount = clampInt(player.loseCount, 0, 999999999, 0);
  player.startPoint = clampInt(player.startPoint ?? player.StartPoint ?? player.birthPoint, 0, 3, 0);
  player.savePointMask = clampInt(player.savePointMask ?? player.SavePoint ?? player.CHAR_SAVEPOINT, 0, 0xffffffff, 1 << player.startPoint);
  player.SavePoint = player.savePointMask;
  player.LastTalkElder = clampInt(player.LastTalkElder ?? player.CHAR_LASTTALKELDER, 0, 127, player.startPoint);
  player.CHAR_LASTTALKELDER = player.LastTalkElder;
  compliancePlayerParameter(player, { preserveHp: true });
  const progress = progressionSummary(player.level, player.exp);
  player.currentLevelExp = progress.currentLevelExp;
  player.nextExp = progress.nextExp;
  player.expToNext = progress.expToNext;
  player.expProgressPct = progress.progressPct;
}

function normalizePlayerElementAttributes(player) {
  player.EarthAT = clampInt(player.EarthAT, 0, 100, 0);
  player.WaterAT = clampInt(player.WaterAT, 0, 100, 0);
  player.FireAT = clampInt(player.FireAT, 0, 100, 0);
  player.WindAT = clampInt(player.WindAT, 0, 100, 0);
  if (player.EarthAT + player.WaterAT + player.FireAT + player.WindAT <= 0) {
    player.EarthAT = 50;
    player.WaterAT = 50;
    player.FireAT = 0;
    player.WindAT = 0;
  }
}

function compliancePlayerParameter(player, options = {}) {
  const previousHp = Number(player.hp ?? player.Hp ?? player.maxHp ?? 1);
  player.WorkFixDex = Math.max(1, Math.trunc(Number(player.Dex || 0) / 100));
  player.WorkFixVital = Math.max(1, Math.trunc(Number(player.Vital || 0) / 100));
  player.WorkFixStr = Math.max(1, Math.trunc((Number(player.Str || 0) + Number(player.Tough || 0) * 0.1 + Number(player.Vital || 0) * 0.1 + Number(player.Dex || 0) * 0.05) / 100));
  player.WorkFixTough = Math.max(1, Math.trunc((Number(player.Tough || 0) + Number(player.Str || 0) * 0.1 + Number(player.Vital || 0) * 0.1 + Number(player.Dex || 0) * 0.05) / 100));
  player.WorkFixLuck = clampInt(player.WorkFixLuck ?? player.Luck ?? player.luck, 1, 5, 1);
  player.Luck = player.WorkFixLuck;
  player.WorkFixCharm = clampInt(player.charm ?? player.Charm ?? player.CHARM, 0, 100, PLAYER_INITIAL_CHARM);
  player.WorkMaxHp = Math.max(1, Math.trunc((Number(player.Vital || 0) * 4 + Number(player.Str || 0) + Number(player.Tough || 0) + Number(player.Dex || 0)) / 100));
  player.WorkAttackPower = player.WorkFixStr;
  player.WorkDefencePower = player.WorkFixTough;
  player.WorkQuick = player.WorkFixDex;
  player.maxHp = player.WorkMaxHp;
  player.hp = options.preserveHp
    ? clampInt(previousHp, 0, player.maxHp, player.maxHp)
    : player.maxHp;
}

function normalizePetRuntime(pet) {
  pet.Lv = clampInt(pet.Lv ?? pet.level, 1, CHAR_MAXUPLEVEL, 1);
  pet.Exp = clampInt(pet.Exp ?? pet.exp, 0, CHAR_MAX_EXP, levelExp(pet.Lv));
  pet.LimitLevel = petLimitLevel(pet);
  pet.EarthAT = clampInt(pet.EarthAT ?? pet.Earth, 0, 100, 0);
  pet.WaterAT = clampInt(pet.WaterAT ?? pet.Water, 0, 100, 0);
  pet.FireAT = clampInt(pet.FireAT ?? pet.Fire, 0, 100, 0);
  pet.WindAT = clampInt(pet.WindAT ?? pet.WindAt ?? pet.Wind, 0, 100, 0);
  pet.KillPetCount = clampInt(pet.KillPetCount, 0, 999999999, 0);
  pet.DeadCount = clampInt(pet.DeadCount, 0, 999999999, 0);
  pet.BattleCount = clampInt(pet.BattleCount, 0, 999999999, 0);
  pet.WinCount = clampInt(pet.WinCount, 0, 999999999, 0);
  pet.LoseCount = clampInt(pet.LoseCount, 0, 999999999, 0);
  if (!Number.isFinite(Number(pet.WorkMaxHp)) || Number(pet.WorkMaxHp) <= 0) {
    complianceParameter(pet, { preserveHp: true });
  } else {
    pet.Hp = clampInt(pet.Hp, 0, Math.max(1, Number(pet.WorkMaxHp)), Number(pet.WorkMaxHp));
  }
  const progress = progressionSummary(pet.Lv, pet.Exp);
  pet.CurrentLevelExp = progress.currentLevelExp;
  pet.NextExp = progress.nextExp;
  pet.ExpToNext = progress.expToNext;
  pet.ExpProgressPct = progress.progressPct;
}

function normalizeProgressionRuntime(game) {
  normalizePlayerRuntime(game.player);
  game.pets = (game.pets || []).map((pet) => {
    normalizePetRuntime(pet);
    return pet;
  });
  syncCharacterFields(game);
}

function syncCharacterFields(game) {
  game.characterFields = buildCharacterFields(game);
}

function buildCharacterFields(game) {
  game.inventory ||= [];
  game.pets ||= [];
  ensureFlags(game);
  const inventory = inventoryState(game);
  const equipment = equipmentState(game);
  const activeIndex = getActivePetIndex(game);
  const activePet = game.pets[activeIndex] || null;
  const trueBits = Object.entries(game.flags.bits || {})
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key)
    .sort();
  const fields = {
    schema: "gmsv-character-fields-v1",
    source: "gmsv CHAR_* runtime subset + SAAC save charinfo; CHAR_SkillUp consumes CHAR_SKILLUPPOINT and adds 100 to VITAL/STR/TOUGH/DEX",
    aliases: {
      vi: "Vital",
      str: "Str",
      tou: "Tough",
      dx: "Dex",
      skup: "skillUpPoint",
      pcls: "professionClass",
      psp: "professionSkillPoint",
      evt: "flags.endEvents",
      nev: "flags.nowEvents"
    },
    identity: {
      accountId: game.account?.id || "",
      characterId: game.character?.id || "",
      slot: Number(game.character?.slot ?? game.account?.activeSlot ?? 0),
      name: game.player?.name || ""
    },
    base: {
      level: Number(game.player?.level || 1),
      exp: Number(game.player?.exp || 0),
      nextExp: Number(game.player?.nextExp ?? -1),
      expToNext: Number(game.player?.expToNext || 0),
      hp: Number(game.player?.hp || 0),
      maxHp: Number(game.player?.maxHp || 0),
      stone: Number(game.player?.stone || 0),
      charm: Number(game.player?.charm || 0),
      fame: Number(game.player?.fame || 0),
      amPoint: Number(game.player?.amPoint || 0),
      professionClass: Number(game.player?.professionClass || 0),
      professionClassName: professionClassName(game.player?.professionClass),
      transmigration: Number(game.player?.transmigration || 0),
      professionSkillPoint: Number(game.player?.professionSkillPoint || 0),
      startPoint: sourceStartPoint(game),
      savePointMask: Number(game.player?.savePointMask ?? game.player?.SavePoint ?? 0),
      lastTalkElder: Number(game.player?.LastTalkElder ?? game.player?.CHAR_LASTTALKELDER ?? sourceStartPoint(game)),
      mapId: String(game.location?.mapId || ""),
      x: Number(game.location?.x || 0),
      y: Number(game.location?.y || 0),
      dir: normalizeDir(game.player?.dir ?? game.location?.dir),
      metamoUntil: Number(game.effects?.metamo?.until || game.effects?.metamoUntil || 0),
      metamoImageNo: Number(game.effects?.metamo?.imageNo || game.player?.CHAR_BASEIMAGENUMBER || 0),
      metamoName: game.effects?.metamo?.formName || ""
    },
    counters: {
    killPetCount: Number(game.player?.killPetCount || 0),
    deadCount: Number(game.player?.deadCount || 0),
    battleCount: Number(game.player?.battleCount || 0),
    winCount: Number(game.player?.winCount || 0),
    loseCount: Number(game.player?.loseCount || 0),
    duelPoint: Number(game.player?.duelPoint || 0),
    skillUpPoint: Number(game.player?.skillUpPoint || 0),
    professionSkillPoint: Number(game.player?.professionSkillPoint || 0),
    heroCompleteCount: Number(game.player?.heroCompleteCount ?? game.player?.HeroCnt ?? game.player?.CHAR_HEROCNT ?? 0),
    heroFloor: Number(game.player?.heroFloor ?? game.player?.HeroFloor ?? game.player?.CHAR_HEROFLOOR ?? 0),
    heroWorkFloor: Number(game.player?.heroWorkFloor ?? game.player?.WorkHeroFloor ?? game.player?.CHAR_WORKHEROFLOOR ?? 0)
    },
    attributes: {
    Vital: Number(game.player?.Vital || 0),
    Str: Number(game.player?.Str || 0),
    Tough: Number(game.player?.Tough || 0),
    Dex: Number(game.player?.Dex || 0),
    EarthAT: Number(game.player?.EarthAT || 0),
    WaterAT: Number(game.player?.WaterAT || 0),
    FireAT: Number(game.player?.FireAT || 0),
    WindAT: Number(game.player?.WindAT || 0),
    },
    work: {
      WorkFixVital: Number(game.player?.WorkFixVital || 0),
      WorkMaxHp: Number(game.player?.WorkMaxHp || game.player?.maxHp || 0),
      WorkFixStr: Number(game.player?.WorkFixStr || 0),
      WorkFixTough: Number(game.player?.WorkFixTough || 0),
      WorkFixDex: Number(game.player?.WorkFixDex || 0),
      WorkFixLuck: Number(game.player?.WorkFixLuck || game.player?.Luck || 1),
      WorkFixCharm: Number(game.player?.WorkFixCharm || game.player?.charm || 0),
      WorkAttackPower: Number(game.player?.WorkAttackPower || game.player?.WorkFixStr || 0),
      WorkDefencePower: Number(game.player?.WorkDefencePower || game.player?.WorkFixTough || 0),
      WorkQuick: Number(game.player?.WorkQuick || game.player?.WorkFixDex || 0),
      CHAR_LASTTALKELDER: Number(game.player?.LastTalkElder ?? game.player?.CHAR_LASTTALKELDER ?? sourceStartPoint(game)),
      CHAR_WORKHEROFLOOR: Number(game.player?.CHAR_WORKHEROFLOOR ?? game.player?.heroWorkFloor ?? game.player?.WorkHeroFloor ?? 0)
    },
    elements: {
      EarthAT: Number(game.player?.EarthAT || 0),
      WaterAT: Number(game.player?.WaterAT || 0),
      FireAT: Number(game.player?.FireAT || 0),
      WindAT: Number(game.player?.WindAT || 0)
    },
    profession: {
      classId: Number(game.player?.professionClass || 0),
      className: professionClassName(game.player?.professionClass),
      transmigration: Number(game.player?.transmigration || 0),
      skillPoint: Number(game.player?.professionSkillPoint || 0),
      skills: normalizeProfessionSkills(game.player?.professionSkills || []).map((skill) => ({
        id: Number(skill.id || 0),
        name: skill.name || `职业技能 ${Number(skill.id || 0)}`,
        level: Number(skill.level || 0),
        percent: Number(skill.percent || 0),
        classId: Number(skill.classId || 0),
        className: skill.className || professionClassName(skill.classId),
        costMp: Number(skill.costMp || 0),
        func: skill.func || "",
        source: skill.source || ""
      }))
    },
    equipment: Object.fromEntries(Object.entries(equipment).map(([slot, item]) => [slot, {
      id: item.id,
      name: item.name || item.Name || `item ${item.id || ""}`,
      type: item.type || "",
      description: item.description || "",
      source: item.source || ""
    }])),
    events: {
      endEvents: [...(game.flags.endEvents || [])],
      nowEvents: [...(game.flags.nowEvents || [])],
      bitsCount: trueBits.length,
      recentBits: trueBits.slice(-20),
      angelMission: compactAngelMissionState(activeAngelMission(game)),
      npcTalkCounts: Object.fromEntries(Object.entries(game.flags.npcTalkCounts || {}).slice(-20)),
      npcEnemyDefeats: Object.fromEntries(Object.entries(game.flags.npcEnemyDefeats || {}).slice(-12))
    },
    inventory: {
      used: inventory.used,
      capacity: inventory.capacity,
      remaining: inventory.remaining,
      poolUsed: itemPoolState(game).used,
      poolCapacity: itemPoolState(game).capacity,
      items: game.inventory
        .filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0)
        .slice(0, 12)
        .map((item) => ({
          id: item.id,
          name: item.name,
          qty: Number(item.qty || 0),
          type: item.type || ""
        }))
    },
    pets: game.pets.slice(0, PET_CAPACITY).map((pet, index) => {
      const progress = progressionSummary(pet.Lv, pet.Exp);
      return {
        index,
        active: index === activeIndex,
        name: pet.Name,
        petId: pet.PetId,
        level: Number(pet.Lv || 1),
        exp: Number(pet.Exp || 0),
        currentLevelExp: progress.currentLevelExp,
        nextExp: Number(pet.NextExp ?? progress.nextExp),
        expToNext: Number(pet.ExpToNext ?? progress.expToNext),
        expProgressPct: Number(pet.ExpProgressPct ?? progress.progressPct),
        limitLevel: petLimitLevel(pet),
        hp: Number(pet.Hp || 0),
        maxHp: Number(pet.WorkMaxHp || 0),
        loyalty: Number(pet.Loyal || 0),
        counters: {
          killPetCount: Number(pet.KillPetCount || 0),
          deadCount: Number(pet.DeadCount || 0),
          battleCount: Number(pet.BattleCount || 0),
          winCount: Number(pet.WinCount || 0),
          loseCount: Number(pet.LoseCount || 0)
        },
        growth: {
          total: round2(pet.Growth),
          hp: round2(pet.GrowthHp),
          str: round2(pet.GrowthStr),
          tough: round2(pet.GrowthTough),
          dex: round2(pet.GrowthDex)
        },
        elements: {
          EarthAT: Number(pet.EarthAT || 0),
          WaterAT: Number(pet.WaterAT || 0),
          FireAT: Number(pet.FireAT || 0),
          WindAT: Number(pet.WindAT || 0)
        },
        work: {
          WorkFixVital: Number(pet.WorkFixVital || 0),
          WorkMaxHp: Number(pet.WorkMaxHp || 0),
          WorkFixStr: Number(pet.WorkFixStr || 0),
          WorkFixTough: Number(pet.WorkFixTough || 0),
          WorkFixDex: Number(pet.WorkFixDex || 0),
          WorkFixCharm: Number(pet.WorkFixCharm || pet.Charm || 0),
          WorkAttackPower: Number(pet.WorkAttackPower || pet.WorkFixStr || 0),
          WorkDefencePower: Number(pet.WorkDefencePower || pet.WorkFixTough || 0),
          WorkQuick: Number(pet.WorkQuick || pet.WorkFixDex || 0)
        },
        statuses: compactBattleStatuses(pet),
        magicStatuses: compactBattleMagicStatuses(pet)
      };
    }),
    battle: game.encounter ? {
      active: true,
      enemyName: game.encounter.Name || "",
      enemyId: game.encounter.EnemyId || game.encounter.PetId || "",
      enemyLevel: Number(game.encounter.Lv || 1),
      enemyHp: Number(game.encounter.Hp || 0),
      source: game.battle?.source || game.encounter.source || "",
      sourceCommand: game.battle?.sourceCommand || "",
      playerAction: compactBattleActionTelemetry(game.battle?.playerAction),
      enemyAi: game.battle?.enemyAi ? {
        type: game.battle.enemyAi.type || "",
        sourceCommand: game.battle.enemyAi.sourceCommand || "",
        command: game.battle.enemyAi.command || "",
        guardAdjust: compactGuardAdjust(game.battle.enemyAi.guardAdjust),
        source: game.battle.enemyAi.source || ""
      } : null,
      activePetIndex: activeIndex,
      activePetName: activePet?.Name || "",
      activeEnemyIndex: Number(game.battle?.activeEnemyIndex || 0),
      formation: battleFormationForFields(game),
      activeEnemy: battleCharacterFieldSummary(game.encounter, Number(game.battle?.activeEnemyIndex || 0), true),
      enemyParty: battleEnemyPartyForFields(game).map((enemy, index) => battleCharacterFieldSummary(
        enemy,
        index,
        index === Number(game.battle?.activeEnemyIndex || 0)
      ))
    } : {
      active: false,
      activePetIndex: activeIndex,
      activePetName: activePet?.Name || ""
    }
  };
  return fields;
}

function battleEnemyPartyForFields(game) {
  const party = Array.isArray(game.battle?.enemyParty) && game.battle.enemyParty.length
    ? game.battle.enemyParty
    : [game.encounter].filter(Boolean);
  return party.filter(Boolean).slice(0, 10);
}

function battleFormationForFields(game) {
  const activeIndex = getActivePetIndex(game);
  const activePet = getActivePet(game);
  const activeActor = activeBattleActor(game);
  const activeActorNo = battleActorBattleNo(game, activeActor);
  const playerUnit = battleFormationUnit(game.player, {
    side: 0,
    slot: 0,
    battleNo: 0,
    kind: "player",
    row: "back",
    active: activeActorNo === 0,
    commandable: true
  });
  const petUnit = activePet ? battleFormationUnit(activePet, {
    side: 0,
    slot: BATTLE_PLAYER_MAX,
    battleNo: BATTLE_PLAYER_MAX,
    kind: "pet",
    row: "front",
    active: activeActorNo === BATTLE_PLAYER_MAX,
    commandable: true,
    petIndex: activeIndex,
    ownerSlot: 0
  }) : null;
  const enemies = battleEnemyPartyForFields(game).map((enemy, index) => battleFormationUnit(enemy, {
    side: 1,
    slot: index,
    battleNo: BATTLE_SIDE_OFFSET + index,
    kind: "enemy",
    row: index < BATTLE_ENTRY_MAX / 2 ? "back" : "front",
    active: index === Number(game.battle?.activeEnemyIndex || 0),
    commandable: false
  }));
  const allySide = [playerUnit, petUnit].filter(Boolean);
  return {
    source: "gmsv include/battle.h BATTLE_ENTRY_MAX=10/BATTLE_PLAYER_MAX=5/SIDE_OFFSET=10 + battle.c BATTLE_NewEntry: players slots 0-4, default pets ownerSlot+5, enemy side offset +10",
    entryMax: BATTLE_ENTRY_MAX,
    playerMax: BATTLE_PLAYER_MAX,
    sideOffset: BATTLE_SIDE_OFFSET,
    turnSeconds: BATTLE_TURN_SECONDS,
    roundStartedAt: game.battle?.roundStartedAt || "",
    roundDeadlineAt: game.battle?.roundDeadlineAt || "",
    localPlayerNo: 0,
    localPetNo: activePet ? BATTLE_PLAYER_MAX : -1,
    activeActorNo,
    activeActorKind: battleActorKind(game, activeActor),
    mode: "source-formation-scaffold",
    allySide,
    enemySide: enemies,
    allySlots: sourceBattleSlots(0, allySide),
    enemySlots: sourceBattleSlots(1, enemies),
    targetGroups: sourceBattleTargetGroups(),
    commandMenu: sourceBattleCommandMenu(),
    pending: "current resolver is still one-command MVP; next step is full 5 players + 5 pets vs enemy-side formation UI and command queue"
  };
}

function battleFormationUnit(entity, options = {}) {
  const side = Number(options.side || 0);
  const slot = Number(options.slot || 0);
  const battleNo = Number(options.battleNo ?? side * BATTLE_SIDE_OFFSET + slot);
  return {
    side,
    slot,
    battleNo,
    targetNo: battleNo,
    placeNo: battleNo,
    kind: options.kind || "",
    row: options.row || "",
    active: Boolean(options.active),
    commandable: Boolean(options.commandable),
    ownerSlot: Number(options.ownerSlot ?? -1),
    petIndex: Number(options.petIndex ?? -1),
    name: entity?.Name || entity?.name || "",
    level: Number(entity?.Lv || entity?.level || 1),
    hp: Number(entity?.Hp ?? entity?.hp ?? 0),
    maxHp: Number(entity?.WorkMaxHp ?? entity?.maxHp ?? entity?.Hp ?? entity?.hp ?? 0),
    imgNo: Number(entity?.ImgNo || 0),
    work: {
      attack: workAttackPower(entity),
      defence: workDefencePower(entity),
      quick: workQuick(entity)
    },
    elements: elementVector(entity),
    statuses: compactBattleStatuses(entity),
    magicStatuses: compactBattleMagicStatuses(entity)
  };
}

function sourceBattleSlots(side, units) {
  const unitBySlot = new Map(units.map((unit) => [Number(unit.slot || 0), unit]));
  return Array.from({ length: BATTLE_ENTRY_MAX }, (_, slot) => {
    const unit = unitBySlot.get(slot) || null;
    return {
      side,
      slot,
      battleNo: side * BATTLE_SIDE_OFFSET + slot,
      row: slot < BATTLE_PLAYER_MAX ? "back" : "front",
      role: side === 0
        ? (slot < BATTLE_PLAYER_MAX ? "player" : "pet")
        : "enemy",
      occupied: Boolean(unit),
      unit
    };
  });
}

function sourceBattleTargetGroups() {
  return {
    side0: 20,
    side1: 21,
    all: 22,
    side1BackRow: 23,
    side1FrontRow: 24,
    side0FrontRow: 25,
    side0BackRow: 26,
    source: "client battlemenu.cpp target translation + gmsv include/battle.h TARGET_SIDE_*"
  };
}

function sourceBattleCommandMenu() {
  return [
    { index: 0, action: "attack", label: "攻击", command: "H|target", sourceCommand: "BATTLE_COM_ATTACK" },
    { index: 1, action: "magic", label: "咒术", command: "J|magic|target", sourceCommand: "BATTLE_COM_JYUJYUTU" },
    { index: 2, action: "capture", label: "捕获", command: "T|target", sourceCommand: "BATTLE_COM_CAPTURE" },
    { index: 3, action: "help", label: "Help", command: "join/help", sourceCommand: "BATTLE_HELP" },
    { index: 4, action: "guard", label: "防御", command: "G", sourceCommand: "BATTLE_COM_GUARD" },
    { index: 5, action: "item", label: "道具", command: "I|item|target", sourceCommand: "BATTLE_COM_ITEM" },
    { index: 6, action: "pet", label: "宠物", command: "S|pet", sourceCommand: "BATTLE_COM_PETIN/BATTLE_COM_PETOUT" },
    { index: 7, action: "escape", label: "逃跑", command: "E", sourceCommand: "BATTLE_COM_ESCAPE" },
    { index: 8, action: "pet-skill", label: "宠技", command: "W|skill|target", sourceCommand: "PETSKILL_Use" }
  ];
}

function sourceBattleLayoutState(activeActor) {
  return {
    entryMax: BATTLE_ENTRY_MAX,
    playerMax: BATTLE_PLAYER_MAX,
    sideOffset: BATTLE_SIDE_OFFSET,
    turnSeconds: BATTLE_TURN_SECONDS,
    activeActorKind: activeActor?.PetId ? "pet" : "player",
    source: "gmsv include/battle.h + battle.c BATTLE_NewEntry + client battlemenu.cpp"
  };
}

function battleCharacterFieldSummary(enemy, index = 0, active = false) {
  return {
    index,
    active,
    enemyId: enemy.EnemyId || "",
    petId: enemy.PetId || "",
    tempNo: enemy.EnemyTempNo || enemy.PetId || "",
    name: enemy.Name || "",
    level: Number(enemy.Lv || 1),
    hp: Number(enemy.Hp || 0),
    maxHp: Number(enemy.WorkMaxHp || enemy.Hp || 0),
    captureRate: Number(enemy.CaptureRate || 0),
    sourceExp: sourceEnemyExp(enemy),
    elements: {
      EarthAT: Number(enemy.EarthAT || 0),
      WaterAT: Number(enemy.WaterAT || 0),
      FireAT: Number(enemy.FireAT || 0),
      WindAT: Number(enemy.WindAT || 0)
    },
    work: {
      WorkMaxHp: Number(enemy.WorkMaxHp || enemy.Hp || 0),
      WorkFixStr: Number(enemy.WorkFixStr || 0),
      WorkFixTough: Number(enemy.WorkFixTough || 0),
      WorkFixDex: Number(enemy.WorkFixDex || 0),
      WorkFixCharm: Number(enemy.WorkFixCharm || enemy.Charm || 0),
      WorkAttackPower: Number(enemy.WorkAttackPower || enemy.WorkFixStr || 0),
      WorkDefencePower: Number(enemy.WorkDefencePower || enemy.WorkFixTough || 0),
      WorkQuick: Number(enemy.WorkQuick || enemy.WorkFixDex || 0)
    },
    statuses: compactBattleStatuses(enemy),
    source: enemy.source || ""
  };
}

function compactCharacterFields(game) {
  const fields = buildCharacterFields(game);
  game.characterFields = fields;
  return {
    schema: fields.schema,
    source: fields.source,
    base: fields.base,
    counters: fields.counters,
    attributes: fields.attributes,
    work: fields.work,
    elements: fields.elements,
    profession: fields.profession || {},
    equipment: fields.equipment || {},
    events: {
      endEvents: fields.events?.endEvents || [],
      nowEvents: fields.events?.nowEvents || [],
      bitsCount: Number(fields.events?.bitsCount || 0),
      recentBits: (fields.events?.recentBits || []).slice(-8),
      npcTalkCounts: Object.fromEntries(Object.entries(fields.events?.npcTalkCounts || {}).slice(-8))
    },
    inventory: {
      used: fields.inventory?.used || 0,
      capacity: fields.inventory?.capacity || INVENTORY_CAPACITY,
      remaining: fields.inventory?.remaining || 0
    },
    pets: (fields.pets || []).map((pet) => ({
      index: pet.index,
      active: pet.active,
      name: pet.name,
      level: pet.level,
      exp: pet.exp,
      nextExp: pet.nextExp,
      expToNext: pet.expToNext,
      expProgressPct: pet.expProgressPct,
      limitLevel: pet.limitLevel,
      hp: `${pet.hp}/${pet.maxHp}`,
      counters: pet.counters,
      growth: pet.growth,
      elements: pet.elements,
      work: pet.work,
      statuses: pet.statuses,
      magicStatuses: pet.magicStatuses
    })),
    battle: fields.battle
  };
}

function compactPlayerContext(game) {
  const fields = buildCharacterFields(game);
  game.characterFields = fields;
  return {
    name: game.player?.name || "",
    level: Number(game.player?.level || 1),
    exp: Number(game.player?.exp || 0),
    nextExp: Number(game.player?.nextExp ?? -1),
    expToNext: Number(game.player?.expToNext || 0),
    hp: Number(game.player?.hp || 0),
    maxHp: Number(game.player?.maxHp || 0),
    stone: Number(game.player?.stone || 0),
    dir: normalizeDir(game.player?.dir ?? game.location?.dir),
    charm: Number(game.player?.charm || 0),
    fame: Number(game.player?.fame || 0),
    amPoint: Number(game.player?.amPoint || 0),
    skillUpPoint: Number(game.player?.skillUpPoint || 0),
    professionClass: Number(game.player?.professionClass || 0),
    professionClassName: professionClassName(game.player?.professionClass),
    transmigration: Number(game.player?.transmigration || 0),
    professionSkillPoint: Number(game.player?.professionSkillPoint || 0),
    professionSkills: normalizeProfessionSkills(game.player?.professionSkills || []).map((skill) => ({
      id: Number(skill.id || 0),
      name: skill.name,
      percent: Number(skill.percent || 0)
    })),
    heroCompleteCount: Number(game.player?.heroCompleteCount ?? game.player?.HeroCnt ?? game.player?.CHAR_HEROCNT ?? 0),
    angelMission: compactAngelMissionState(activeAngelMission(game)),
    baseStats: {
      Vital: fields.attributes?.Vital || 0,
      Str: fields.attributes?.Str || 0,
      Tough: fields.attributes?.Tough || 0,
      Dex: fields.attributes?.Dex || 0
    },
    work: fields.work || {},
    elements: fields.elements || {}
  };
}

function progressionState(game) {
  return {
    source: "gmsv char_data.c LevelUpTbl + battle.c EXP distribution",
    player: progressionSummary(game.player?.level, game.player?.exp),
    pets: (game.pets || []).map((pet) => ({
      ...progressionSummary(pet.Lv, pet.Exp),
      name: pet.Name,
      petId: pet.PetId,
      limitLevel: petLimitLevel(pet)
    })),
    sourceTasks: sourceScriptTaskState(game)
  };
}

function returnSavePointGame(game) {
  game = normalizeGame(game);
  if (game.encounter || game.battle) throw new Error("战斗中不能返回记录点。");
  const target = returnSavePointTarget(game);
  const from = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  const label = target.kind === "savepoint" ? "返回记录点" : "返回出生点";
  applyWarpTarget(game, target, label);
  const now = new Date().toISOString();
  const to = { mapId: game.location.mapId, x: game.location.x, y: game.location.y };
  game.lastWarp = {
    ...(game.lastWarp || {}),
    kind: "return-savepoint",
    label,
    from,
    to,
    source: target.source,
    returnedAt: now
  };
  game.transition = warpTransition("return-savepoint", label, from, to, target.source, now);
  game.dialog = null;
  game.walk = { steps: 0, encounterSteps: 0 };
  addLog(game, `${label}：你回到了 ${WORLD.maps[to.mapId]?.name || to.mapId} (${to.x},${to.y})。`);
  return withMap(game, {
    returnPoint: {
      ...to,
      label,
      kind: target.kind,
      source: target.source
    }
  });
}

function returnSavePointTarget(game) {
  const savePoint = game.savePoint || null;
  const born = savePoint?.born || null;
  if (born && WORLD.maps[String(born.mapId)]) {
    return clampReturnPoint({
      kind: "savepoint",
      mapId: born.mapId,
      x: born.x,
      y: born.y,
      source: savePoint.source || "gmsv npc_savepoint Born"
    });
  }
  const startMap = WORLD.maps[WORLD.startMap] || Object.values(WORLD.maps)[0];
  if (!startMap) throw new Error("没有可用的出生地图。");
  const spawn = Array.isArray(startMap.spawn) ? startMap.spawn : [0, 0];
  return clampReturnPoint({
    kind: "start",
    mapId: startMap.id,
    x: spawn[0],
    y: spawn[1],
    source: "fallback start spawn"
  });
}

function clampReturnPoint(target) {
  const map = WORLD.maps[String(target.mapId)];
  if (!map) return target;
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  return {
    ...target,
    mapId: map.id,
    x: clampInt(target.x, 0, width - 1, Number(map.spawn?.[0] || 0)),
    y: clampInt(target.y, 0, height - 1, Number(map.spawn?.[1] || 0))
  };
}

function normalizeGame(game) {
  if (!game || !game.player || !game.location) throw new Error("需要先创建人物");
  ensureSaveIdentity(game);
  setCharacterDir(game, game.player?.dir ?? game.location?.dir);
  game.pets ||= [];
  ensurePetFormation(game);
  ensurePetPool(game);
  ensureItemPool(game);
  game.inventory ||= [];
  syncEquipmentState(game);
  normalizeProgressionRuntime(game);
  game.quests ||= {};
  game.quests = normalizeQuestRuntime(game.quests);
  ensureFlags(game);
  game.effects ||= {};
  normalizeNpcConditionOverrides(game);
  normalizeMetamoEffect(game);
  game.automation = normalizeAutomationState(game.automation);
  game.aiWorkspace = normalizeAiWorkspace(game.aiWorkspace);
  game.aiNpcCache = normalizeAiNpcCache(game.aiNpcCache);
  game.npcSocial = normalizeNpcSocial(game.npcSocial);
  game.dialogAi ||= {};
  game.walk ||= { steps: 0, encounterSteps: 0 };
  game.savePoint ||= null;
  game.lastWarp ||= null;
  game.dialog ||= null;
  if (game.dialog?.messages) game.dialog.messages = game.dialog.messages.map((message) => (
    message?.speaker === "npc" && /^脚本入口：/.test(String(message.text || ""))
      ? { ...message, text: "有什么事吗？" }
      : message
  ));
  game.battle ||= null;
  game.npcVmEvents ||= [];
  game.log ||= [];
  game.log = game.log.map(sanitizePlayerFacingText).slice(-40);
  game.character.name = game.player.name;
  game.character.updatedAt = new Date().toISOString();
  game.save = buildSaacSave(game);
  return game;
}

function normalizeMetamoEffect(game) {
  const entry = game.effects?.metamo;
  if (!entry) {
    if (game.player) {
      game.player.CHAR_WORKITEMMETAMO = Number(game.player.CHAR_WORKITEMMETAMO || 0);
      game.player.CHAR_WORKNPCMETAMO = Number(game.player.CHAR_WORKNPCMETAMO || 0);
    }
    return;
  }
  const until = Number(entry.until || game.effects.metamoUntil || 0);
  if (until > Date.now()) {
    game.effects.metamoUntil = until;
    game.player.CHAR_WORKITEMMETAMO = Math.ceil(until / 1000);
    game.player.CHAR_WORKNPCMETAMO = Number(game.player.CHAR_WORKNPCMETAMO || 0);
    if (Number(entry.imageNo || 0) > 0) {
      game.player.CHAR_BASEIMAGENUMBER = Number(entry.imageNo);
      game.player.BaseImageNumber = Number(entry.imageNo);
    }
    return;
  }
  const originalImageNo = Number(entry.originalImageNo || game.player.CHAR_BASEBASEIMAGENUMBER || 0);
  if (originalImageNo > 0) {
    game.player.CHAR_BASEIMAGENUMBER = originalImageNo;
    game.player.BaseImageNumber = originalImageNo;
  }
  game.player.CHAR_WORKITEMMETAMO = 0;
  game.player.CHAR_WORKNPCMETAMO = 0;
  delete game.effects.metamo;
  delete game.effects.metamoUntil;
}

function normalizeNpcConditionOverrides(game) {
  game.effects ||= {};
  const source = game.effects.npcConditionOverrides || {};
  const now = Date.now();
  const normalized = {};
  for (const [key, value] of Object.entries(source)) {
    const entry = normalizeNpcConditionOverride(value, key);
    if (!entry) continue;
    if (entry.expiresAt <= now || entry.usesLeft <= 0) {
      recordNpcConditionOverrideDebug(game, entry, entry.expiresAt <= now ? "expired" : "consumed");
      continue;
    }
    normalized[entry.key] = entry;
  }
  if (Object.keys(normalized).length) game.effects.npcConditionOverrides = normalized;
  else delete game.effects.npcConditionOverrides;
}

function normalizeNpcConditionOverride(value, fallbackKey = "") {
  if (!value || typeof value !== "object") return null;
  const npcId = String(value.npcId || "").slice(0, 120);
  const eventNo = Number(value.eventNo || 0);
  const conditionHash = String(value.conditionHash || "").slice(0, 40);
  if (!npcId || eventNo <= 0 || !conditionHash) return null;
  const key = String(value.key || fallbackKey || npcConditionOverrideKey(npcId, eventNo, conditionHash)).slice(0, 180);
  const createdAt = clampInt(value.createdAt, 0, Number.MAX_SAFE_INTEGER, Date.now());
  const expiresAt = clampInt(value.expiresAt, 0, Number.MAX_SAFE_INTEGER, createdAt + NPC_CONDITION_OVERRIDE_TTL_MS);
  const usesLeft = clampInt(value.usesLeft, 0, NPC_CONDITION_OVERRIDE_MAX_USES, 1);
  const check = value.check && typeof value.check === "object"
    ? {
      type: String(value.check.type || value.conditionKind || "").slice(0, 32),
      token: String(value.check.token || value.conditionToken || "").slice(0, 120),
      itemId: Number(value.check.itemId || 0),
      itemName: String(value.check.itemName || "").slice(0, 60),
      petId: Number(value.check.petId || 0),
      petName: String(value.check.petName || "").slice(0, 60),
      shiftbit: Number(value.check.shiftbit || 0),
      expected: Number(value.check.expected || 0),
      actual: value.check.actual,
      needed: Number(value.check.needed || 0),
      qty: Number(value.check.qty || 0),
      op: String(value.check.op || "").slice(0, 4),
      kind: String(value.check.kind || "").slice(0, 12)
    }
    : {
      type: String(value.conditionKind || "").slice(0, 32),
      token: String(value.conditionToken || "").slice(0, 120)
    };
  return {
    key,
    npcId,
    npcName: String(value.npcName || "").slice(0, 60),
    eventNo,
    conditionHash,
    condition: String(value.condition || "").slice(0, 240),
    conditionToken: String(value.conditionToken || check.token || "").slice(0, 120),
    conditionKind: String(value.conditionKind || check.type || "").slice(0, 32),
    check,
    substituteCost: {
      stone: clampInt(value.substituteCost?.stone ?? value.substituteStone, 0, CHAR_MAXGOLDHAVE, 0)
    },
    usesLeft,
    createdAt,
    expiresAt,
    source: String(value.source || "").slice(0, 160),
    reason: String(value.reason || "").slice(0, 80)
  };
}

function recordNpcConditionOverrideDebug(game, entry, reason) {
  if (!game || !entry) return;
  game.effects ||= {};
  game.effects.npcConditionOverrideDebug ||= [];
  game.effects.npcConditionOverrideDebug.push({
    at: Date.now(),
    reason,
    key: entry.key,
    npcId: entry.npcId,
    eventNo: entry.eventNo,
    conditionHash: entry.conditionHash,
    usesLeft: entry.usesLeft,
    expiresAt: entry.expiresAt
  });
  game.effects.npcConditionOverrideDebug = game.effects.npcConditionOverrideDebug.slice(-16);
}

function normalizeQuestRuntime(quests = {}) {
  return Object.fromEntries(Object.entries(quests || {}).map(([questId, quest]) => {
    if (!quest || typeof quest !== "object") return [questId, quest];
    const { guidance, target, nextDetail, ...runtimeQuest } = quest;
    return [questId, runtimeQuest];
  }));
}

function normalizeAutomationState(value = {}) {
  return {
    autoLevel: Boolean(value?.autoLevel),
    autoEscape: Boolean(value?.autoEscape),
    updatedAt: Number(value?.updatedAt || 0),
    lastNoticeKey: String(value?.lastNoticeKey || "")
  };
}

function sanitizePlayerFacingText(text) {
  return String(text || "").replace(/脚本入口：[^。\n]*/g, "有什么事吗？");
}

function ensureSaveIdentity(game) {
  const now = new Date().toISOString();
  game.account ||= {};
  game.account.id = cleanAccountId(game.account.id) || `local-${stableFlag(game.id || game.player.name).toString(36)}`;
  game.account.name ||= "本地账号";
  game.account.activeSlot = clampInt(game.account.activeSlot, 0, MAXCHAR_PER_USER - 1, 0);
  game.account.maxSlots = MAXCHAR_PER_USER;
  game.account.lock ||= null;
  game.account.source ||= "参考 SAAC char.c: id.slot.char";
  game.character ||= {};
  game.character.id ||= game.id || `${game.account.id}-${game.account.activeSlot}`;
  game.character.slot = clampInt(game.character.slot ?? game.account.activeSlot, 0, MAXCHAR_PER_USER - 1, game.account.activeSlot);
  game.character.name = game.player.name;
  game.character.createdAt ||= now;
  game.character.updatedAt ||= now;
  game.character.deleted = Boolean(game.character.deleted);
}

function buildSaacSave(game) {
  syncCharacterFields(game);
  const option = buildCharOption(game);
  const info = buildCharInfo(game);
  const json = buildSaveJson(game);
  return {
    schema: SAVE_SCHEMA,
    source: "SAAC charSave/makeSaveCharString model: charname|option|charinfo",
    fileName: `${game.account.id}.${game.character.slot}.char`,
    accountId: game.account.id,
    slot: game.character.slot,
    name: game.player.name,
    option,
    info,
    serialized: [escapeSaacField(game.player.name), escapeSaacField(option), escapeSaacField(info)].join("|"),
    json,
    updatedAt: game.character.updatedAt
  };
}

function buildSaveJson(game) {
  return {
    schema: SAVE_SCHEMA,
    source: {
      saac: "stoneage-master/石器时代服务器端最新完整源代码/saac",
      chardata: "2016_SA80/Linux-Main-app/saac",
      gmsv: "stoneage-master/石器时代服务器端最新完整源代码/gmsv",
      client: "stoneage-master/石器时代8.5客户端最新源代码/石器源码"
    },
    account: {
      id: game.account.id,
      name: game.account.name,
      activeSlot: game.account.activeSlot,
      maxSlots: game.account.maxSlots,
      lock: game.account.lock
    },
    character: {
      id: game.character.id,
      slot: game.character.slot,
      name: game.character.name,
      createdAt: game.character.createdAt,
      updatedAt: game.character.updatedAt,
      deleted: game.character.deleted,
      equipment: equipmentState(game)
    },
    player: { ...game.player },
    location: { ...game.location },
    pets: game.pets.map((pet) => ({ ...pet })),
    petPool: ensurePetPool(game).map((pet) => ({ ...pet })),
    itemPool: ensureItemPool(game).map((item) => ({ ...item })),
    petFormation: { ...ensurePetFormation(game) },
    petState: petState(game),
    progression: progressionState(game),
    characterFields: { ...(game.characterFields || {}) },
    lastBattleOutcome: game.lastBattleOutcome ? { ...game.lastBattleOutcome } : null,
    inventory: game.inventory.map((item) => ({ ...item })),
    inventoryState: inventoryState(game),
    quests: game.quests || {},
    savePoint: game.savePoint ? { ...game.savePoint } : null,
    lastWarp: game.lastWarp ? { ...game.lastWarp } : null,
    flags: {
      endEvents: [...(game.flags?.endEvents || [])],
      nowEvents: [...(game.flags?.nowEvents || [])],
      bits: { ...(game.flags?.bits || {}) },
      npcTalkCounts: { ...(game.flags?.npcTalkCounts || {}) },
      npcEnemyDefeats: { ...(game.flags?.npcEnemyDefeats || {}) },
      savePointIds: [...(game.flags?.savePointIds || [])],
      pendingNpcProposal: publicNpcProposal(game),
      angelMission: game.flags?.angelMission ? { ...game.flags.angelMission } : null
    },
    effects: { ...(game.effects || {}) },
    automation: normalizeAutomationState(game.automation),
    aiWorkspace: normalizeAiWorkspace(game.aiWorkspace),
    aiNpcCache: normalizeAiNpcCache(game.aiNpcCache),
    npcSocial: normalizeNpcSocial(game.npcSocial),
    dialogAi: { ...(game.dialogAi || {}) },
    walk: {
      steps: Number(game.walk?.steps || 0),
      encounterSteps: Number(game.walk?.encounterSteps || 0)
    },
    npcVmEvents: (game.npcVmEvents || []).slice(-20),
    log: (game.log || []).slice(-40)
  };
}

function buildCharOption(game) {
  return [
    `lv=${game.player.level}`,
    `floor=${game.location.mapId}`,
    `x=${game.location.x}`,
    `y=${game.location.y}`,
    `dir=${normalizeDir(game.player.dir)}`,
    `pet=${game.pets.length}`,
    `item=${game.inventory.length}`
  ].join(",");
}

function buildCharInfo(game) {
  const activeQuests = Object.values(game.quests || {}).filter((quest) => quest.status !== "完成").map((quest) => quest.title);
  return [
    "DATASTART=1",
    `SCHEMA=${SAVE_SCHEMA}`,
    `ACCOUNT=${game.account.id}`,
    `SLOT=${game.character.slot}`,
    `CHARID=${game.character.id}`,
    `NAME=${game.player.name}`,
    `LV=${game.player.level}`,
    `EXP=${game.player.exp}`,
    `NEXTEXP=${game.player.nextExp}`,
    `EXP_TO_NEXT=${game.player.expToNext}`,
    `STONE=${game.player.stone}`,
    `HP=${game.player.hp}`,
    `MAXHP=${game.player.maxHp}`,
    `CHARM=${game.player.charm}`,
    `FAME=${game.player.fame}`,
    `AMPOINT=${game.player.amPoint}`,
    `VITAL=${game.player.Vital}`,
    `STR=${game.player.Str}`,
    `TOUGH=${game.player.Tough}`,
    `DEX=${game.player.Dex}`,
    `EARTH=${game.player.EarthAT}`,
    `WATER=${game.player.WaterAT}`,
    `FIRE=${game.player.FireAT}`,
    `WIND=${game.player.WindAT}`,
    `WORKMAXHP=${game.player.WorkMaxHp}`,
    `WORKFIXSTR=${game.player.WorkFixStr}`,
    `WORKFIXTOUGH=${game.player.WorkFixTough}`,
    `WORKFIXDEX=${game.player.WorkFixDex}`,
    `WORKFIXLUCK=${game.player.WorkFixLuck}`,
    `WORKFIXCHARM=${game.player.WorkFixCharm}`,
    `WORKATTACKPOWER=${game.player.WorkAttackPower}`,
    `WORKDEFENCEPOWER=${game.player.WorkDefencePower}`,
    `WORKQUICK=${game.player.WorkQuick}`,
    `DUELPOINT=${game.player.duelPoint}`,
    `SKILLUPPOINT=${game.player.skillUpPoint}`,
    `PROFESSION_CLASS=${game.player.professionClass || 0}`,
    `TRANSMIGRATION=${game.player.transmigration || 0}`,
    `PROFESSION_SKILL_POINT=${game.player.professionSkillPoint || 0}`,
    `PROFESSION_SKILLS=${safeJson(normalizeProfessionSkills(game.player.professionSkills || []))}`,
    `KILLPETCOUNT=${game.player.killPetCount}`,
    `DEADCOUNT=${game.player.deadCount}`,
    `BATTLECOUNT=${game.player.battleCount}`,
    `HEROCNT=${game.player.heroCompleteCount ?? game.player.HeroCnt ?? game.player.CHAR_HEROCNT ?? 0}`,
    `ANGEL_MISSION=${safeJson(compactAngelMissionState(activeAngelMission(game)))}`,
    `STARTPOINT=${sourceStartPoint(game)}`,
    `SAVEPOINT=${game.player.savePointMask ?? game.player.SavePoint ?? 0}`,
    `LASTTALKELDER=${game.player.LastTalkElder ?? game.player.CHAR_LASTTALKELDER ?? sourceStartPoint(game)}`,
    `FLOOR=${game.location.mapId}`,
    `X=${game.location.x}`,
    `Y=${game.location.y}`,
    `DIR=${normalizeDir(game.player.dir)}`,
    `LAST_WARP=${game.lastWarp?.to ? `${game.lastWarp.to.mapId},${game.lastWarp.to.x},${game.lastWarp.to.y}` : "NONE"}`,
    `PETCOUNT=${game.pets.length}`,
    `POOLPETCOUNT=${ensurePetPool(game).length}`,
    `POOLITEMCOUNT=${ensureItemPool(game).length}`,
    `ITEMCOUNT=${game.inventory.length}`,
    `LAST_SAVEPOINT=${game.savePoint ? safeJson(game.savePoint) : ""}`,
    `WALK_STEPS=${game.walk?.steps || 0}`,
    `ENCOUNTER_STEPS=${game.walk?.encounterSteps || 0}`,
    `QUESTS=${safeJson(activeQuests)}`,
    `EFFECTS=${safeJson(game.effects || {})}`,
    `FLAGS_END=${(game.flags?.endEvents || []).join(",")}`,
    `FLAGS_NOW=${(game.flags?.nowEvents || []).join(",")}`,
    `FLAGS_BITS=${safeJson(game.flags?.bits || {})}`,
    `NPC_TALK=${safeJson(game.flags?.npcTalkCounts || {})}`,
    `CHARACTER_FIELDS=${safeJson(compactCharacterFields(game))}`,
    `AI_WORKSPACE=${safeJson(compactAiWorkspaceMemory(game))}`,
    `PETS=${safeJson(game.pets.map(petSaveSummary))}`,
    `POOLPETS=${safeJson(ensurePetPool(game).map(petSaveSummary))}`,
    `POOLITEMS=${safeJson(ensureItemPool(game).map(itemSaveSummary))}`,
    `ITEMS=${safeJson(game.inventory.map(itemSaveSummary))}`,
    `UPDATED=${game.character.updatedAt}`,
    "DATAEND=1"
  ].join("\n");
}

function escapeSaacField(value = "") {
  return String(value)
    .replaceAll("\\", "\\y")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\c")
    .replaceAll("|", "\\z");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("\n", " ");
}

function petSaveSummary(pet) {
  return {
    id: pet.Id,
    no: pet.PetId,
    name: pet.Name,
    level: pet.Lv,
    hp: pet.Hp,
    maxHp: pet.WorkMaxHp,
    exp: pet.Exp,
    nextExp: pet.NextExp,
    expToNext: pet.ExpToNext,
    killPetCount: pet.KillPetCount,
    deadCount: pet.DeadCount,
    image: pet.ImgNo
  };
}

function itemSaveSummary(item) {
  return {
    id: item.id,
    name: item.name,
    qty: item.qty,
    type: item.type,
    level: item.level
  };
}

function cleanAccountId(value = "") {
  return String(value).trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function withMap(game, extra = {}) {
  hydrateGameInventoryFromSource(game);
  hydrateGameInventoryRuntimeEffects(game);
  const map = currentMap(game);
  const responseMap = {
    ...clientMapForResponse(map),
    encounterGateSummary: currentEncounterGateSummary(game, map)
  };
  ensureSaveIdentity(game);
  ensureFlags(game);
  setCharacterDir(game, game.player?.dir ?? game.location?.dir);
  game.save = buildSaacSave(game);
  const progression = progressionState(game);
  return {
    ...game,
    quests: responseQuestState(game),
    nearby: nearbyState(game, map),
    inventoryState: inventoryState(game),
    petState: petState(game),
    petPoolState: petPoolState(game),
    itemPoolState: itemPoolState(game),
    progression,
    world: {
      map: responseMap,
      quests: WORLD.quests,
      mapCount: Object.keys(WORLD.maps || {}).length,
      questLeadCount: Object.values(WORLD.maps || {})
        .reduce((sum, item) => sum + (item.npcs || []).filter((npc) => npc.questLead).length, 0)
    },
    ...clientExtraForResponse(extra)
  };
}

function clientExtraForResponse(extra = {}) {
  if (!extra || typeof extra !== "object") return extra;
  const cleaned = { ...extra };
  if (cleaned.npc) cleaned.npc = clientNpcForResponse(cleaned.npc);
  if (cleaned.map) cleaned.map = clientMapForResponse(cleaned.map);
  return cleaned;
}

function clientMapForResponse(map) {
  if (!map?.npcs?.length) return map;
  let changed = false;
  const npcs = map.npcs.map((npc) => {
    const cleaned = clientNpcForResponse(npc);
    if (cleaned !== npc) changed = true;
    return cleaned;
  });
  return changed ? { ...map, npcs } : map;
}

function clientNpcForResponse(npc) {
  if (!npc || !Array.isArray(npc.scriptEvents) || !npc.scriptEvents.length) return npc;
  const { scriptEvents, ...rest } = npc;
  return {
    ...rest,
    scriptEventSummary: compactScriptEventSummary(scriptEvents)
  };
}

function compactScriptEventSummary(scriptEvents) {
  const eventNos = [];
  const types = [];
  const actions = [];
  for (const event of scriptEvents || []) {
    pushUniqueCompact(eventNos, event.eventNo, 8);
    pushUniqueCompact(types, event.type, 8);
    if (event.getItems?.length) pushUniqueCompact(actions, "GetItem", 8);
    if (event.getItems?.some((item) => item?.scriptAction === "AddItem")) pushUniqueCompact(actions, "AddItem", 8);
    if (event.delItems?.length) pushUniqueCompact(actions, "DelItem", 8);
    if (event.delItems?.some((item) => item?.evdel)) pushUniqueCompact(actions, "DelItemEVDEL", 8);
    if (event.notDelItems?.length) pushUniqueCompact(actions, "NotDel", 8);
    if (event.getRandItems?.length) pushUniqueCompact(actions, "GetRandItem", 8);
    if (event.getStones?.length) pushUniqueCompact(actions, "GetStone", 8);
    if (event.getStones?.some((stone) => stone?.source === "AddGold")) pushUniqueCompact(actions, "AddGold", 8);
    if (event.delStones?.length) pushUniqueCompact(actions, "DelStone", 8);
    if (event.npcWarps?.length) pushUniqueCompact(actions, "NpcWarp", 8);
    if (event.npcWarps?.some((point) => point?.sourceAction === "NPCPOINT")) pushUniqueCompact(actions, "NpcPoint", 8);
    if (Number(event.lastTalkElder || 0) > 0) pushUniqueCompact(actions, "SetLastTalkelder", 8);
    if (event.charms?.length) pushUniqueCompact(actions, "Charm", 8);
    if (event.keyword) pushUniqueCompact(actions, "KeyWord", 8);
    if (event.petName) pushUniqueCompact(actions, "Pet_Name", 8);
    if (event.getPets?.length) pushUniqueCompact(actions, "GetPet", 8);
    if (event.getPets?.some((pet) => pet?.source === "AddPet")) pushUniqueCompact(actions, "AddPet", 8);
    if (event.delPets?.length) pushUniqueCompact(actions, "DelPet", 8);
    if (event.nowSetFlags?.length) pushUniqueCompact(actions, "NowSetFlg", 8);
    if (event.endSetFlags?.length) pushUniqueCompact(actions, "EndSetFlg", 8);
    if (event.cleanFlags?.length) pushUniqueCompact(actions, "CleanFlg", 8);
    if (event.messages?.stop || event.messages?.noStop || event.messages?.endStop) pushUniqueCompact(actions, "StopMsg", 8);
    if (Number(event.missionOver || 0) > 0) pushUniqueCompact(actions, "MISSIONOVER", 8);
    if (Number(event.missionClean || 0) > 0) pushUniqueCompact(actions, "MISSIONCLEAN", 8);
    if (event.messagePages && Object.keys(event.messagePages).length) pushUniqueCompact(actions, "MessagePages", 8);
    if (Number(event.addExps || 0) > 0) pushUniqueCompact(actions, "AddExps", 8);
    if (event.condition) pushUniqueCompact(actions, "condition", 8);
  }
  return {
    count: scriptEvents.length,
    ...(eventNos.length ? { eventNos } : {}),
    ...(types.length ? { types } : {}),
    ...(actions.length ? { actions } : {})
  };
}

function pushUniqueCompact(list, value, limit) {
  if (value === undefined || value === null || value === "") return;
  const compact = typeof value === "number" ? value : String(value).slice(0, 32);
  if (list.includes(compact) || list.length >= limit) return;
  list.push(compact);
}

function currentMap(game) {
  const map = WORLD.maps[game.location.mapId];
  if (!map) throw new Error("当前地图不存在");
  return visibleMapForGame(game, map);
}

function visibleMapForGame(game, map) {
  const visible = map.npcs?.length
    ? (() => {
        let npcs = map.npcs.filter((npc) => !isNpcEnemyDefeated(game, npc) && npcVisibleOnRuntimeMap(game, map, npc));
        const movedNpcs = runtimeMovedNpcsForMap(game, map, new Set(npcs.map((npc) => npc.id)));
        if (movedNpcs.length) npcs = [...npcs, ...movedNpcs];
        return npcs.length === map.npcs.length ? map : { ...map, npcs };
      })()
    : map;
  return withRuntimeMapState(game, withWildEncounterPolicy(visible, game));
}

function withRuntimeMapState(game, map) {
  if (!game || !map?.npcs?.length) return map;
  let changed = false;
  const npcs = map.npcs.map((npc) => {
    const runtimePosition = runtimeNpcPosition(game, npc);
    const moved = runtimePosition && String(runtimePosition.mapId) === String(map.id);
    const currentNpc = moved
      ? { ...npc, x: Number(runtimePosition.x), y: Number(runtimePosition.y), runtimePosition }
      : npc;
    const warpStatus = compactNpcWarpStatus(game, currentNpc);
    const scriptStatus = compactNpcScriptStatus(game, currentNpc);
    if (!moved && !warpStatus && !scriptStatus) return npc;
    changed = true;
    return { ...currentNpc, ...(warpStatus ? { warpStatus } : {}), ...(scriptStatus ? { scriptStatus } : {}) };
  });
  return changed ? { ...map, npcs } : map;
}

function runtimeNpcPosition(game, npc) {
  return game?.flags?.npcPositions?.[npc?.id] || null;
}

function npcVisibleOnRuntimeMap(game, map, npc) {
  const position = runtimeNpcPosition(game, npc);
  return !position || String(position.mapId) === String(map.id);
}

function runtimeMovedNpcsForMap(game, map, existingIds = new Set()) {
  const positions = game?.flags?.npcPositions || {};
  const moved = [];
  for (const [npcId, position] of Object.entries(positions)) {
    if (existingIds.has(npcId) || String(position?.mapId || "") !== String(map.id)) continue;
    const npc = findWorldNpcById(npcId);
    if (!npc || isNpcEnemyDefeated(game, npc)) continue;
    moved.push({ ...npc, x: Number(position.x), y: Number(position.y), runtimePosition: position });
  }
  return moved;
}

function findWorldNpcById(npcId) {
  for (const map of Object.values(WORLD.maps || {})) {
    const npc = (map.npcs || []).find((item) => item.id === npcId);
    if (npc) return npc;
  }
  return null;
}

function withWildEncounterPolicy(map, game = null) {
  const canWildEncounter = wildEncounterAllowed(map, game);
  return {
    ...map,
    canWildEncounter,
    wildEncounterReason: canWildEncounter
      ? "encount.txt wild encounter enabled"
      : wildEncounterBlockedText(map, game)
  };
}

function wildEncounterAllowed(map, game = null) {
  return encounterDataAvailable(map, game) && !isSafeWildEncounterMap(map);
}

function encounterSourceDataAvailable(map) {
  return Boolean(map?.encounterAreas?.some((area) => area.groups?.some((group) => group.enemies?.length)))
    || Boolean(map?.encounterPets?.length);
}

function encounterDataAvailable(map, game = null) {
  if (!encounterSourceDataAvailable(map)) return false;
  if (!game) return true;
  const sourceAreas = (map?.encounterAreas || []).filter((area) => area.groups?.some((group) => group.enemies?.length));
  if (!sourceAreas.length) return Boolean(map?.encounterPets?.length);
  const area = chooseEncounterArea(map, game.location);
  return Boolean(area?.groups?.some((group) => group.enemies?.length && encounterGroupCanAppear(game, group)));
}

function isSafeWildEncounterMap(map) {
  const name = String(map?.name || "").replace(/[|�]/g, "");
  if (SAFE_WILD_ENCOUNTER_MAP_RE.test(name)) return true;
  const summary = String(map?.summary || "");
  return /\/samugiru\/|\/kuo\/kuomura|\/marinasu\/marinasu|\/family\//i.test(summary);
}

function assertWildEncounterAllowed(map, game = null) {
  if (!wildEncounterAllowed(map, game)) throw new Error(wildEncounterBlockedText(map, game));
}

function wildEncounterBlockedText(map, game = null) {
  if (!encounterSourceDataAvailable(map)) return `${map?.name || "当前地图"} 没有 encount.txt 遇敌表，不能在这里触发野外战斗。`;
  if (isSafeWildEncounterMap(map)) return `${map.name} 是村镇或安全地图，虽然资料里有 encount.txt 记录，但随机野外遇敌已按安全区规则关闭。`;
  if (game && !encounterDataAvailable(map, game)) {
    const area = chooseEncounterArea(map, game.location);
    if (!area) return `${map?.name || "当前地图"} 当前坐标没有可用的 encount.txt 遇敌区域。`;
    const gateText = guideEncounterGateText(guideEncounterGateSummary(game, map));
    return `${map?.name || "当前地图"} 当前遇敌组需要特定道具或受 group1.txt 背包条件限制，暂时不能在这里触发野外战斗。${gateText ? ` 条件：${gateText}。` : ""}`;
  }
  return `${map?.name || "当前地图"} 当前不能触发野外遇敌。`;
}

function isNpcEnemyDefeated(game, npc) {
  const entry = game.flags?.npcEnemyDefeats?.[npc.id];
  if (!entry) return false;
  const until = Date.parse(entry.until || "");
  return Number.isFinite(until) && until > Date.now();
}

function nearbyState(game, map) {
  const x = Number(game.location.x || 0);
  const y = Number(game.location.y || 0);
  const npcs = map.npcs
    .filter((npc) => distance(npc.x, npc.y, x, y) <= 2)
    .slice(0, 5)
    .map((npc) => ({
      id: npc.id,
      name: npc.name,
      x: npc.x,
      y: npc.y,
      type: npc.type,
      actions: npcActionProfile(npc),
      warpStatus: npc.warpStatus || compactNpcWarpStatus(game, npc),
      scriptStatus: npc.scriptStatus || compactNpcScriptStatus(game, npc)
    }));
  const exits = (map.exits || [])
    .filter((exit) => distanceToExit(exit, x, y) <= 2)
    .slice(0, 5)
    .map((exit) => ({ id: exit.id, label: exit.label, x: exit.x, y: exit.y, to: exit.to }));
  const closedExits = (map.profileClosedExits || [])
    .filter((exit) => distanceToExit(exit, x, y) <= 2)
    .slice(0, 5)
    .map((exit) => closedExitSummary(exit));
  return { npcs, exits, closedExits };
}

function distance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax) - bx), Math.abs(Number(ay) - by));
}

function distanceToBounds(bounds, x, y) {
  const dx = x < bounds[0] ? bounds[0] - x : x > bounds[2] ? x - bounds[2] : 0;
  const dy = y < bounds[1] ? bounds[1] - y : y > bounds[3] ? y - bounds[3] : 0;
  return Math.max(dx, dy);
}

function distanceToExit(exit, x, y) {
  if (Array.isArray(exit.tiles) && exit.tiles.length) {
    return Math.min(...exit.tiles.map((tile) => distance(tile.x, tile.y, x, y)));
  }
  return distanceToBounds(exit.bounds || [exit.x, exit.y, exit.x, exit.y], x, y);
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

function startQuest(game, questId, npc = null) {
  const source = WORLD.quests[questId];
  if (!source) return null;
  game.quests[questId] = {
    ...source,
    status: "进行中",
    progress: Math.min(1, source.steps.length - 1),
    startedAt: new Date().toISOString()
  };
  if (npc) setNpcVmFlag(game, npc, eventFlagForQuest(questId), "now", "quest-start");
  else setEventFlag(game, eventFlagForQuest(questId), "now");
  addLog(game, `接到任务「${source.title}」。`);
  return game.quests[questId];
}

function updateQuestProgress(game, event, payload = {}) {
  for (const [questId, quest] of Object.entries(game.quests || {})) {
    if (!quest || quest.status === "完成") continue;
    const target = questProgressTarget(quest, event, payload);
    if (!target || target <= Number(quest.progress || 0)) continue;
    quest.progress = Math.min(target, quest.steps.length - 1);
    if (quest.progress >= quest.steps.length - 1) {
      quest.status = "可回报";
      addLog(game, `任务「${quest.title}」已完成目标，可以回报。`);
    } else {
      addLog(game, `任务「${quest.title}」推进：${quest.steps[quest.progress]}`);
    }
    game.quests[questId] = quest;
  }
}

function questProgressTarget(quest, event, payload) {
  const objectives = quest.objectives || {};
  if (event === "enterMap" && Array.isArray(objectives.enterMaps)) {
    const mapId = String(payload.mapId || "");
    const targetMaps = objectives.enterMaps.map(String);
    if (targetMaps.includes(mapId)) {
      quest.visitedMaps ||= [];
      if (!quest.visitedMaps.includes(mapId)) quest.visitedMaps.push(mapId);
      return Math.max(1 + quest.visitedMaps.length, Number(quest.progress || 0));
    }
  }
  if (event === "enterMap" && objectives.visitEncounterMap) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (wildEncounterAllowed(map)) return Math.max(2, Number(quest.progress || 0));
  }
  if (event === "fieldWin" && objectives.fieldWin) {
    const map = WORLD.maps[String(payload.mapId || "")];
    if (wildEncounterAllowed(map)) return Math.max(quest.steps.length - 1, Number(quest.progress || 0));
  }
  if (event === "npcEnemyWin" && Array.isArray(objectives.npcEnemyIds)) {
    if (objectives.npcEnemyIds.includes(String(payload.npcId || ""))) {
      return Math.max(quest.steps.length - 1, Number(quest.progress || 0));
    }
  }
  return 0;
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
  game.flags.npcTalkCounts ||= {};
  game.flags.npcEnemyDefeats ||= {};
  game.flags.npcPositions ||= {};
  game.flags.npcWarpCounters ||= {};
  game.flags.savePointIds = Array.isArray(game.flags.savePointIds)
    ? game.flags.savePointIds.map(Number).filter((id) => Number.isFinite(id) && id >= 0).slice(0, 64)
    : [];
  const pendingProposal = normalizePendingNpcProposal(game.flags.pendingNpcProposal);
  if (pendingProposal) game.flags.pendingNpcProposal = pendingProposal;
  else delete game.flags.pendingNpcProposal;
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

function clearEventFlag(game, shiftbit, kind = "end") {
  if (!shiftbit) return;
  if (kind === "now-end" || kind === "both") {
    clearEventFlag(game, shiftbit, "now");
    clearEventFlag(game, shiftbit, "end");
    return;
  }
  ensureFlags(game);
  const field = kind === "now" ? "nowEvents" : "endEvents";
  const index = Math.floor(shiftbit / 32);
  const bit = shiftbit % 32;
  const mask = (1 << bit) >>> 0;
  while (game.flags[field].length <= index) game.flags[field].push(0);
  game.flags[field][index] = (game.flags[field][index] & ~mask) >>> 0;
  delete game.flags.bits[`${kind}:${shiftbit}`];
}

function setNpcVmFlag(game, npc, shiftbit, kind = "end", reason = "") {
  if (!shiftbit) return;
  runNpcVmAction(game, npc, {
    type: "setFlag",
    kind,
    shiftbit,
    key: `${kind}:${shiftbit}`,
    reason
  });
}

function eventFlagForNpc(npcId) {
  return stableFlag(npcId);
}

function eventFlagForQuest(questId) {
  return stableFlag(questId);
}

function stableFlag(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }
  return (hash % 256) + 1;
}

async function loadGameData(env, request) {
  if (cache) return cache;
  const [enemyText, enemyBaseText, skillText, itemText] = await Promise.all([
    assetText(env, request, DATA_FILES.enemy),
    assetText(env, request, DATA_FILES.enemyBase),
    assetText(env, request, DATA_FILES.skills),
    assetEncodedText(env, request, DATA_FILES.items, "gb18030")
  ]);
  const skills = parseSkills(skillText);
  const itemSet = parseItemSet(itemText);
  const enemyBaseSet = new Map();
  const enemyNoList = [];
  for (const line of lines(enemyBaseText)) {
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
      FusionCode: toInt(rows[55]),
      Species: toInt(rows[55])
    };
    enemyBaseSet.set(eb.No, eb);
    enemyNoList.push(eb.No);
  }
  const enemySpecsById = parseEnemySpecs(enemyText, enemyBaseSet, itemSet);
  cache = { enemyBaseSet, enemyNoList, enemySpecsById, itemSet, skills };
  return cache;
}

function parseItemSet(text) {
  const items = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 20) continue;
    const id = toInt(rows[16]);
    if (!id) continue;
    const name = cleanReferenceText(rows[0]) || `道具 ${id}`;
    items.set(id, {
      id,
      name,
      secretName: cleanReferenceText(rows[1]),
      description: cleanReferenceText(rows[2]),
      option: cleanReferenceText(rows[3]),
      functionName: cleanReferenceText(rows[10]),
      image: toInt(rows[17]),
      cost: toInt(rows[18]),
      type: toInt(rows[19]),
      useField: toInt(rows[20]),
      target: toInt(rows[21]),
      level: toInt(rows[22]),
      damageBreak: toInt(rows[23]),
      maxUses: toInt(rows[23]),
      category: cleanReferenceText(rows[68])
    });
  }
  return items;
}

function parseEnemySpecs(text, enemyBaseSet, itemSet = null) {
  const specs = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 10) continue;
    const offset = Number.isFinite(Number.parseInt(rows[2], 10)) && Number.parseInt(rows[2], 10) > 0 ? 2 : 3;
    const id = toInt(rows[offset]);
    const tempNo = toInt(rows[offset + 1]);
    if (!id || !tempNo || !enemyBaseSet.has(tempNo)) continue;
    const tacticsOption = cleanReferenceText(rows[1]);
    const rawMin = toInt(rows[offset + 2]);
    const rawMax = toInt(rows[offset + 3]);
    const maxLevel = Math.max(1, rawMax || rawMin || 1);
    const minLevel = Math.max(1, rawMin || maxLevel);
    const drops = [];
    for (let i = 0; i < 10; i += 1) {
      const itemId = toInt(rows[offset + 11 + i]);
      const probability = toInt(rows[offset + 21 + i]);
      if (itemId > 0 && probability > 0) {
        drops.push({
          slot: i + 1,
          itemId,
          probability,
          name: itemSet?.get(itemId)?.name || `item ${itemId}`,
          source: `${GMSV_DATA_SOURCE}/enemy1.txt ITEM${i + 1}/ITEMPROB${i + 1}`
        });
      }
    }
    specs.set(id, {
      id,
      tempNo,
      lvMin: Math.min(minLevel, maxLevel),
      lvMax: Math.max(minLevel, maxLevel),
      createMax: Math.max(1, toInt(rows[offset + 4]) || 1),
      createMin: Math.max(1, toInt(rows[offset + 5]) || 1),
      tactics: toInt(rows[offset + 6]),
      exp: toInt(rows[offset + 7]),
      duelPoint: toInt(rows[offset + 8]),
      style: toInt(rows[offset + 9]),
      petFlg: toInt(rows[offset + 10]),
      tacticsOption,
      drops,
      source: `${GMSV_DATA_SOURCE}/enemy1.txt`
    });
  }
  return specs;
}

function parseSkills(text) {
  const skills = new Map();
  for (const line of lines(text)) {
    const rows = line.split(",");
    if (rows.length < 12) continue;
    const id = toInt(rows[6]);
    skills.set(id, {
      Id: id,
      Name: cleanReferenceText(rows[0]) || `技能 ${id}`,
      Des: compressStr(cleanReferenceText(rows[1])),
      FuncName: cleanReferenceText(rows[2]),
      Option: cleanReferenceText(rows[3]),
      Free: cleanReferenceText(rows[4]),
      KindCode: cleanReferenceText(rows[5]),
      Field: toInt(rows[7]),
      Target: toInt(rows[8]),
      UseType: toInt(rows[9]),
      Cost: toInt(rows[10]),
      SkillFlag: cleanReferenceText(rows[11]),
      BattleSupported: BATTLE_PET_SKILL_FUNCS.has(cleanReferenceText(rows[2])),
      Source: `${GMSV_DATA_SOURCE}/petskill2.txt`
    });
  }
  return skills;
}

function compactPetSkillForSave(skill = {}) {
  return {
    Id: Number(skill.Id || 0),
    Name: skill.Name || `技能 ${skill.Id || 0}`,
    Des: skill.Des || "",
    FuncName: skill.FuncName || "",
    Option: skill.Option || "",
    Free: skill.Free || "",
    KindCode: skill.KindCode || "",
    Field: Number(skill.Field || 0),
    Target: Number(skill.Target || 0),
    UseType: Number(skill.UseType || 0),
    Cost: Number(skill.Cost || 0),
    SkillFlag: skill.SkillFlag || "",
    BattleSupported: Boolean(skill.BattleSupported),
    Source: skill.Source || `${GMSV_DATA_SOURCE}/petskill2.txt`
  };
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
    SourceExp: 0,
    AllocPoint: [tp.BaseVital, tp.BaseStr, tp.BaseTgh, tp.BaseDex],
    WorkTactics: 1,
    WorkTacticsOption: "at:1;3;1|gu:0|wa:0;0;0;0;0;0;0",
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
  char.Exp = sourceEnemyExpFromStats(char);
  char.SourceExp = char.Exp;
  char.BornPoint = [char.WorkMaxHp, char.WorkFixStr, char.WorkFixTough, char.WorkFixDex];
  return char;
}

function petLevelUp(char, options = {}) {
  if (char.Lv >= CHAR_MAXUPLEVEL) return;
  const prevHp = Number(char.Hp || 0);
  const prevMaxHp = Math.max(1, Number(char.WorkMaxHp || char.Hp || 1));
  const param = [0, 0, 0, 0];
  for (let i = 0; i < 10; i += 1) param[randInt(4)] += 1;
  const rank = Math.max(0, Math.min(char.PetRank || 0, rankTab.length - 1));
  const [min, max] = rankTab[rank];
  const frand = (min + randInt(max - min + 1)) * 0.01;
  char.Vital += Math.trunc((char.AllocPoint[0] + param[0]) * frand);
  char.Str += Math.trunc((char.AllocPoint[1] + param[1]) * frand);
  char.Tough += Math.trunc((char.AllocPoint[2] + param[2]) * frand);
  char.Dex += Math.trunc((char.AllocPoint[3] + param[3]) * frand);
  char.Lv += 1;
  complianceParameter(char, { preserveHp: Boolean(options.preserveHp) });
  if (options.preserveHp) {
    const maxDelta = Math.max(0, Number(char.WorkMaxHp || 1) - prevMaxHp);
    char.Hp = Math.max(1, Math.min(Number(char.WorkMaxHp || 1), prevHp + maxDelta));
  }
  const lvd = char.Lv - char.BornLv;
  if (lvd > 0) {
    char.GrowthHp = (char.WorkMaxHp - char.BornPoint[0]) / lvd;
    char.GrowthStr = (char.WorkFixStr - char.BornPoint[1]) / lvd;
    char.GrowthTough = (char.WorkFixTough - char.BornPoint[2]) / lvd;
    char.GrowthDex = (char.WorkFixDex - char.BornPoint[3]) / lvd;
    char.Growth = char.GrowthStr + char.GrowthTough + char.GrowthDex;
  }
}

function complianceParameter(char, options = {}) {
  const previousHp = Number(char.Hp || 0);
  char.WorkFixDex = Math.trunc(char.Dex / 100);
  char.WorkFixVital = Math.trunc(char.Vital / 100);
  char.WorkFixStr = Math.trunc((char.Str * 1 + char.Tough * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkFixTough = Math.trunc((char.Tough * 1 + char.Str * 0.1 + char.Vital * 0.1 + char.Dex * 0.05) / 100);
  char.WorkFixCharm = clampInt(char.Charm ?? char.charm, 0, 100, 0);
  char.WorkMaxHp = Math.trunc((char.Vital * 4 + char.Str + char.Tough + char.Dex) / 100);
  char.WorkAttackPower = char.WorkFixStr;
  char.WorkDefencePower = char.WorkFixTough;
  char.WorkQuick = char.WorkFixDex;
  char.Hp = options.preserveHp
    ? clampInt(previousHp, 0, Math.max(1, char.WorkMaxHp), Math.max(1, char.WorkMaxHp))
    : char.WorkMaxHp;
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
    const text = path === DATA_FILES.items
      ? await assetEncodedText(env, request, path, "gb18030")
      : await assetText(env, request, path);
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

function petSummary(pet) {
  return {
    name: pet.Name,
    no: pet.PetId,
    lv: pet.Lv,
    exp: pet.Exp,
    nextExp: pet.NextExp,
    expToNext: pet.ExpToNext,
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
    statuses: compactBattleStatuses(pet),
    magicStatuses: compactBattleMagicStatuses(pet),
    skills: (pet.PetSkills || []).filter(Boolean).map((sk) => sk.Name)
  };
}

async function assetText(env, request, path) {
  const url = new URL(path, request.url);
  const rsp = await env.ASSETS.fetch(new Request(url));
  if (!rsp.ok) throw new Error(`missing asset: ${path}`);
  return rsp.text();
}

async function assetEncodedText(env, request, path, encoding) {
  const buffer = await assetBuffer(env, request, path);
  try {
    return new TextDecoder(encoding).decode(buffer);
  } catch {
    return new TextDecoder().decode(buffer);
  }
}

async function assetBuffer(env, request, path) {
  const url = new URL(path, request.url);
  const rsp = await env.ASSETS.fetch(new Request(url));
  if (!rsp.ok) throw new Error(`missing asset: ${path}`);
  return rsp.arrayBuffer();
}

async function assetJson(env, request, path) {
  return JSON.parse(await assetText(env, request, path));
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

function cleanReferenceText(value) {
  return String(value || "")
    .replace(/\0/g, "")
    .replace(/[�\uE000-\uF8FF]/g, "")
    .replace(/\\n/g, " ")
    .replace(/\|0+.*$/g, "")
    .replace(/\|([1-9]\d*).*$/g, " $1")
    .replace(/\|.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function randRange(min, max) {
  const low = Math.min(Number(min) || 1, Number(max) || 1);
  const high = Math.max(Number(min) || 1, Number(max) || 1);
  return Math.floor(low + Math.random() * (high - low + 1));
}

function pick(list) {
  return list[randInt(list.length)];
}

function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}
