import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const refNpcRoot = path.join(appRoot, "external", "sources", "ref___data", "npc");
const closurePath = path.join(appRoot, "docs", "planning", "classic-core-closure-manifest.json");
const reportJsonPath = path.join(appRoot, "docs", "planning", "npc-script-coverage-report.json");
const reportMdPath = path.join(appRoot, "docs", "planning", "NPC_SCRIPT_COVERAGE_REPORT.md");
const gb18030 = new TextDecoder("gb18030");

const PROFILE_ORDER = [
  "classic-core",
  "classic-rebirth",
  "classic-advanced-2.0",
  "classic-advanced-2.5"
];

const PARSED_EVENT_ACTIONS = [
  "AddGold",
  "AddItem",
  "AddExps",
  "Charm",
  "CleanFlg",
  "condition",
  "DelItem",
  "DelItemEVDEL",
  "DelPet",
  "DelStone",
  "EndSetFlg",
  "GetItem",
  "GetPet",
  "GetRandItem",
  "GetStone",
  "KeyWord",
  "MessagePages",
  "MISSIONCLEAN",
  "MISSIONOVER",
  "NotDel",
  "NpcWarp",
  "Pet_Name",
  "StopMsg"
];

const ACTION_KEYS = new Set([
  "addexps",
  "addexp",
  "addgold",
  "additem",
  "charm",
  "cleanflg",
  "cleanflag",
  "delgold",
  "delitem",
  "delpet",
  "delstone",
  "endsetflag",
  "endsetflg",
  "getgold",
  "getitem",
  "getpet",
  "getranditem",
  "getstone",
  "giveitem",
  "keyword",
  "missionclean",
  "missionover",
  "notdel",
  "notdelitem",
  "nowsetflag",
  "nowsetflg",
  "npcwarp",
  "pet_name",
  "petname"
]);

const MESSAGE_KEYS = new Set([
  "acceptmsg",
  "cleanflagmsg",
  "cleanflgmsg",
  "cleanmainmsg",
  "endstopmsg",
  "freemsg",
  "fail_msg",
  "failmsg",
  "hint_msg",
  "itemfullmsg",
  "luck",
  "main_msg",
  "moneymessage",
  "moneymsg",
  "money_msg",
  "nomal_msg",
  "nomalmainmsg",
  "nomalmsg",
  "nomalwindowmsg",
  "normalmainmsg",
  "normalmsg",
  "normalwindowmsg",
  "nostopmsg",
  "partymsg",
  "party_msg",
  "paymsg",
  "pay_msg",
  "petfullmsg",
  "okmsg",
  "over_msg",
  "realymsg",
  "cost_msg",
  "getfull_msg",
  "draw_main",
  "pool_main",
  "poolfull_msg",
  "pooltanks_msg",
  "requestmsg",
  "start_msg",
  "stonelessmsg",
  "stonefullmsg",
  "stopmsg",
  "thanks_msg",
  "thanksmsg",
  "talkmsg",
  "msg_denieditem",
  "msg_end",
  "msg_gettingon",
  "msg_notparty",
  "msg_overparty",
  "msg_start",
  "msg_stone",
  "nomoney",
  "warp_msg"
]);

const CONTROL_KEYS = new Set([
  "event",
  "eventno",
  "free",
  "id",
  "noevent",
  "nofree",
  "talkevent",
  "talkrun",
  "type"
]);

const SUPPORTED_CONFIG_KEYS = new Set([
  "alreadymsg",
  "askbattlemsg",
  "askbattlemsg1",
  "askbattlemsg2",
  "askbattlemsg3",
  "askbattlemsg4",
  "askbattlemsg5",
  "askbattlemsg6",
  "buy_main",
  "buy_msg",
  "buy_rate",
  "born",
  "cost",
  "costfame",
  "changeitem",
  "changeitemcost",
  "changemsg",
  "delitem",
  "denieditem",
  "deniedmsg",
  "dieact",
  "endmsg",
  "enemyno",
  "entype",
  "err_msg",
  "free_msg",
  "itemfull_msg",
  "itemlist",
  "level_msg",
  "limititemtype",
  "limititemno",
  "main_msg",
  "menuhead",
  "message",
  "money",
  "moneymsg",
  "needhead",
  "needitem",
  "needmsg",
  "needstone",
  "newevent",
  "nomal_rate",
  "nothing_msg",
  "other_msg",
  "oneway",
  "onebattle",
  "partymsg",
  "paymsg",
  "pet_skill",
  "pool_cost",
  "pool_flg",
  "realy_msg",
  "routename",
  "routenum",
  "routeto",
  "sell_main",
  "sell_msg",
  "sell_rate",
  "sellonly_msg",
  "skill_rate",
  "special_item",
  "special_pet",
  "special_rate",
  "startmsg",
  "stone",
  "stone_msg",
  "time",
  "waittime",
  "warp",
  "warpfl",
  "warpx",
  "warpy",
  "what_msg"
]);

const BLOCKED_OR_LATER_SYSTEM_KEYS = [
  "family",
  "profession",
  "casino",
  "race",
  "cook",
  "fusion",
  "fm",
  "fame"
];

const ACTION_HINTS = [
  "battle",
  "change",
  "cost",
  "event",
  "exp",
  "flag",
  "flg",
  "floor",
  "gold",
  "item",
  "level",
  "limit",
  "money",
  "pet",
  "skill",
  "special",
  "stone",
  "warp"
];

function main() {
  const closure = loadJson(closurePath, { profiles: [] });
  const profiles = buildProfileSets(closure);
  const rawFiles = scanRawNpcFiles(refNpcRoot);
  const rawCoverage = collectRawKeyCoverage(rawFiles, profiles);
  const worldCoverage = collectWorldCoverage(profiles);
  const report = {
    generatedAt: new Date().toISOString(),
    sourcePolicy: [
      "Local ref___data NPC files are the source of truth.",
      "External guides only influence profile candidates; this report ranks local source actions by current profile impact.",
      "Raw scripts are summarized here for developer planning and are not sent to normal client payloads."
    ].join(" "),
    summary: {
      rawFilesScanned: rawFiles.length,
      worldMaps: Object.keys(WORLD.maps || {}).length,
      worldNpcs: worldCoverage.full.npcs,
      worldScriptNpcs: worldCoverage.full.scriptNpcs,
      worldScriptEvents: worldCoverage.full.scriptEvents,
      parsedActionKinds: Object.keys(worldCoverage.full.parsedActions).length,
      unsupportedCandidateKeys: rawCoverage.unsupportedCandidates.length
    },
    profiles: Object.fromEntries(PROFILE_ORDER.map((id) => [id, profiles[id]?.summary || emptyProfileSummary(id)])),
    parsedWorldActions: worldCoverage,
    rawKeyCoverage: rawCoverage
  };

  mkdirSync(path.dirname(reportJsonPath), { recursive: true });
  writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(reportMdPath, renderMarkdown(report));

  console.log(`NPC script coverage report written: ${path.relative(appRoot, reportMdPath)}`);
  console.log(`Unsupported action candidates: ${report.summary.unsupportedCandidateKeys}`);
}

function loadJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, "utf8"));
}

function buildProfileSets(closure) {
  const profiles = {};
  for (const id of PROFILE_ORDER) {
    const profile = (closure.profiles || []).find((item) => item.id === id);
    const floors = new Set((profile?.floors || []).map((floor) => String(floor.floor)));
    const sourceFiles = new Set();
    const summary = {
      id,
      floors: floors.size,
      sourceFiles: 0,
      worldNpcs: 0,
      worldScriptNpcs: 0,
      worldScriptEvents: 0
    };
    profiles[id] = { id, floors, sourceFiles, summary };
  }

  for (const [mapId, map] of Object.entries(WORLD.maps || {})) {
    for (const npc of map.npcs || []) {
      for (const profile of Object.values(profiles)) {
        if (!profile.floors.has(String(mapId))) continue;
        profile.summary.worldNpcs += 1;
        if (npc.scriptEvents?.length) {
          profile.summary.worldScriptNpcs += 1;
          profile.summary.worldScriptEvents += npc.scriptEvents.length;
        }
        collectNpcSourceFiles(profile.sourceFiles, npc);
      }
    }
  }

  for (const profile of Object.values(profiles)) {
    profile.summary.sourceFiles = profile.sourceFiles.size;
  }

  return profiles;
}

function emptyProfileSummary(id) {
  return {
    id,
    floors: 0,
    sourceFiles: 0,
    worldNpcs: 0,
    worldScriptNpcs: 0,
    worldScriptEvents: 0
  };
}

function collectNpcSourceFiles(out, npc) {
  addSourceFile(out, npc?.source);
  addSourceFile(out, npc?.warp?.source);
  addSourceFile(out, npc?.trade?.source);
  addSourceFile(out, npc?.npcEnemy?.source);
  if (String(npc?.script || "").startsWith("file:")) {
    addSourceFile(out, `gmsv-data/npc/${npc.script.slice("file:".length)}`);
  }
  for (const event of npc?.scriptEvents || []) addSourceFile(out, event.source);
}

function addSourceFile(out, source) {
  const file = sourceToRefNpcPath(source);
  if (file) out.add(file);
}

function sourceToRefNpcPath(source) {
  const value = String(source || "").trim();
  if (!value) return "";
  let rel = value;
  if (rel.startsWith("gmsv-data/npc/")) rel = rel.slice("gmsv-data/npc/".length);
  if (rel.startsWith("file:")) rel = rel.slice("file:".length);
  if (rel.startsWith("external/sources/ref___data/npc/")) {
    rel = rel.slice("external/sources/ref___data/npc/".length);
  }
  if (!rel || rel.includes("..")) return "";
  return normalizePath(path.join(refNpcRoot, rel));
}

function scanRawNpcFiles(root) {
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === ".DS_Store" || name.endsWith("~") || name.endsWith(".bak") || name.endsWith(".orig")) continue;
      const file = path.join(dir, name);
      const stat = statSync(file);
      if (stat.isDirectory()) {
        walk(file);
      } else if (stat.isFile()) {
        files.push(file);
      }
    }
  };
  if (existsSync(root)) walk(root);
  return files.sort();
}

function collectRawKeyCoverage(files, profiles) {
  const records = new Map();
  const byCategory = {};
  let rawLines = 0;
  for (const file of files) {
    const text = gb18030.decode(readFileSync(file));
    const relFile = toPosixPath(path.relative(appRoot, file));
    const profileIds = PROFILE_ORDER.filter((id) => profiles[id]?.sourceFiles.has(normalizePath(file)));
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (!line || line.startsWith("#")) continue;
      rawLines += 1;
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/);
      if (!match) continue;
      const key = match[1];
      const normalized = normalizeKey(key);
      const category = classifyKey(key);
      const record = records.get(normalized) || createKeyRecord(key, category);
      record.occurrences += 1;
      record.files.add(relFile);
      if (record.samples.length < 5) record.samples.push({ file: relFile, line: index + 1, text: truncate(line, 180) });
      for (const id of profileIds) {
        const profileRecord = record.profiles[id];
        profileRecord.occurrences += 1;
        profileRecord.files.add(relFile);
      }
      records.set(normalized, record);
      byCategory[category] = (byCategory[category] || 0) + 1;
    }
  }

  const keyRecords = [...records.values()]
    .map((record) => ({
      key: record.key,
      normalized: record.normalized,
      category: record.category,
      occurrences: record.occurrences,
      files: record.files.size,
      profiles: Object.fromEntries(PROFILE_ORDER.map((id) => [
        id,
        {
          occurrences: record.profiles[id].occurrences,
          files: record.profiles[id].files.size
        }
      ])),
      samples: record.samples
    }))
    .sort(compareKeyRecord);

  const unsupportedCandidates = keyRecords
    .filter((record) => record.category === "candidate-action" || record.category === "unknown")
    .sort(comparePriorityRecord)
    .slice(0, 40);

  return {
    rawLines,
    byCategory,
    keyRecords,
    unsupportedCandidates
  };
}

function createKeyRecord(key, category) {
  return {
    key,
    normalized: normalizeKey(key),
    category,
    occurrences: 0,
    files: new Set(),
    profiles: Object.fromEntries(PROFILE_ORDER.map((id) => [id, { occurrences: 0, files: new Set() }])),
    samples: []
  };
}

function normalizeKey(key) {
  return String(key || "").trim().toLowerCase().replace(/\d+$/, "");
}

function classifyKey(key) {
  const raw = String(key || "").trim();
  const normalized = normalizeKey(raw);
  if (ACTION_KEYS.has(normalized)) return "supported-action";
  if (MESSAGE_KEYS.has(normalized)) return "supported-message";
  if (CONTROL_KEYS.has(normalized)) return "condition-control";
  if (SUPPORTED_CONFIG_KEYS.has(normalized)) return "supported-config";
  if (BLOCKED_OR_LATER_SYSTEM_KEYS.some((needle) => normalized.includes(needle))) return "blocked-or-later-system";
  if (ACTION_HINTS.some((needle) => normalized.includes(needle))) return "candidate-action";
  return "unknown";
}

function collectWorldCoverage(profiles) {
  const full = createWorldSummary();
  const profileSummaries = Object.fromEntries(PROFILE_ORDER.map((id) => [id, createWorldSummary()]));
  for (const [mapId, map] of Object.entries(WORLD.maps || {})) {
    full.maps += 1;
    for (const npc of map.npcs || []) {
      addNpcToWorldSummary(full, npc);
      for (const id of PROFILE_ORDER) {
        if (!profiles[id]?.floors.has(String(mapId))) continue;
        profileSummaries[id].maps ||= profiles[id].floors.size;
        addNpcToWorldSummary(profileSummaries[id], npc);
      }
    }
  }
  for (const summary of [full, ...Object.values(profileSummaries)]) {
    summary.parsedActions = sortObject(summary.parsedActions);
    summary.eventTypes = sortObject(summary.eventTypes);
  }
  return { full, profiles: profileSummaries };
}

function createWorldSummary() {
  return {
    maps: 0,
    npcs: 0,
    scriptNpcs: 0,
    scriptEvents: 0,
    parsedActions: {},
    eventTypes: {}
  };
}

function addNpcToWorldSummary(summary, npc) {
  summary.npcs += 1;
  if (!npc.scriptEvents?.length) return;
  summary.scriptNpcs += 1;
  for (const event of npc.scriptEvents) {
    summary.scriptEvents += 1;
    count(summary.eventTypes, event.type || "EVENT");
    for (const action of scriptEventActions(event)) count(summary.parsedActions, action);
  }
}

function scriptEventActions(event) {
  const actions = [];
  if (event.getItems?.length) actions.push("GetItem");
  if (event.getItems?.some((item) => item?.scriptAction === "AddItem")) actions.push("AddItem");
  if (event.delItems?.length) actions.push("DelItem");
  if (event.delItems?.some((item) => item?.evdel)) actions.push("DelItemEVDEL");
  if (event.notDelItems?.length) actions.push("NotDel");
  if (event.getRandItems?.length) actions.push("GetRandItem");
  if (event.getStones?.length) actions.push("GetStone");
  if (event.getStones?.some((stone) => stone?.source === "AddGold")) actions.push("AddGold");
  if (event.delStones?.length) actions.push("DelStone");
  if (event.npcWarps?.length) actions.push("NpcWarp");
  if (event.charms?.length) actions.push("Charm");
  if (event.keyword) actions.push("KeyWord");
  if (event.petName) actions.push("Pet_Name");
  if (event.getPets?.length) actions.push("GetPet");
  if (event.delPets?.length) actions.push("DelPet");
  if (event.endSetFlags?.length) actions.push("EndSetFlg");
  if (event.cleanFlags?.length) actions.push("CleanFlg");
  if (event.messages?.stop || event.messages?.noStop || event.messages?.endStop) actions.push("StopMsg");
  if (Number(event.missionOver || 0) > 0) actions.push("MISSIONOVER");
  if (Number(event.missionClean || 0) > 0) actions.push("MISSIONCLEAN");
  if (event.messagePages && Object.keys(event.messagePages).length) actions.push("MessagePages");
  if (Number(event.addExps || 0) > 0) actions.push("AddExps");
  if (event.condition) actions.push("condition");
  return actions;
}

function count(object, key, amount = 1) {
  object[key] = (object[key] || 0) + amount;
}

function sortObject(object) {
  return Object.fromEntries(Object.entries(object).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function compareKeyRecord(a, b) {
  return a.normalized.localeCompare(b.normalized);
}

function comparePriorityRecord(a, b) {
  return b.profiles["classic-core"].occurrences - a.profiles["classic-core"].occurrences
    || b.profiles["classic-rebirth"].occurrences - a.profiles["classic-rebirth"].occurrences
    || b.profiles["classic-advanced-2.5"].occurrences - a.profiles["classic-advanced-2.5"].occurrences
    || b.occurrences - a.occurrences
    || a.key.localeCompare(b.key);
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# NPC Script Coverage Report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push("This report is generated from local NPC source files and generated world data. It is the planning gate for loading more source NPC tasks without sending raw scripts to the client.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Raw NPC files scanned | ${report.summary.rawFilesScanned} |`);
  lines.push(`| Generated world NPCs | ${report.summary.worldNpcs} |`);
  lines.push(`| Generated script NPCs | ${report.summary.worldScriptNpcs} |`);
  lines.push(`| Generated script events | ${report.summary.worldScriptEvents} |`);
  lines.push(`| Parsed action kinds | ${report.summary.parsedActionKinds} |`);
  lines.push(`| Unsupported action candidates | ${report.summary.unsupportedCandidateKeys} |`);
  lines.push("");
  lines.push("## Profile Impact");
  lines.push("");
  lines.push("| Profile | Floors | Source files | World NPCs | Script NPCs | Script events |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const id of PROFILE_ORDER) {
    const profile = report.profiles[id] || emptyProfileSummary(id);
    lines.push(`| ${id} | ${profile.floors} | ${profile.sourceFiles} | ${profile.worldNpcs} | ${profile.worldScriptNpcs} | ${profile.worldScriptEvents} |`);
  }
  lines.push("");
  lines.push("## Parsed Runtime Actions");
  lines.push("");
  lines.push("| Action | Full world | classic-core | rebirth | advanced-2.0 | advanced-2.5 |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const action of PARSED_EVENT_ACTIONS) {
    lines.push(`| ${action} | ${report.parsedWorldActions.full.parsedActions[action] || 0} | ${report.parsedWorldActions.profiles["classic-core"].parsedActions[action] || 0} | ${report.parsedWorldActions.profiles["classic-rebirth"].parsedActions[action] || 0} | ${report.parsedWorldActions.profiles["classic-advanced-2.0"].parsedActions[action] || 0} | ${report.parsedWorldActions.profiles["classic-advanced-2.5"].parsedActions[action] || 0} |`);
  }
  lines.push("");
  lines.push("## Top Unsupported Action Candidates");
  lines.push("");
  lines.push("These are not automatically bugs. Some belong to later systems or config files. They are sorted by current profile impact first, then total local source frequency.");
  lines.push("");
  lines.push("| Key | Category | classic-core refs | rebirth refs | advanced-2.5 refs | Total refs | Sample |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | --- |");
  for (const record of report.rawKeyCoverage.unsupportedCandidates.slice(0, 25)) {
    const sample = record.samples[0] ? `${record.samples[0].file}:${record.samples[0].line}` : "";
    lines.push(`| ${record.key} | ${record.category} | ${record.profiles["classic-core"].occurrences} | ${record.profiles["classic-rebirth"].occurrences} | ${record.profiles["classic-advanced-2.5"].occurrences} | ${record.occurrences} | ${sample} |`);
  }
  lines.push("");
  lines.push("## Recommended Next Slice");
  lines.push("");
  const topCore = report.rawKeyCoverage.unsupportedCandidates.find((record) => record.profiles["classic-core"].occurrences > 0);
  if (topCore) {
    lines.push(`- Start with \`${topCore.key}\`, because it appears in classic-core source references ${topCore.profiles["classic-core"].occurrences} times.`);
  } else {
    lines.push("- No unsupported action candidate currently hits classic-core source references; keep porting the highest rebirth or 2.5 candidates only after the core quest spine is playable.");
  }
  lines.push("- Every newly ported action should go through the Worker deterministic NPC VM and add `check:npc` regression coverage.");
  lines.push("- Keep normal client payloads compact: expose summaries and debug-tab details, not raw script bodies.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function normalizePath(file) {
  return path.resolve(file).split(path.sep).join("/");
}

function toPosixPath(file) {
  return String(file || "").split(path.sep).join("/");
}

function truncate(text, length) {
  const value = String(text || "");
  return value.length <= length ? value : `${value.slice(0, length - 1)}…`;
}

main();
