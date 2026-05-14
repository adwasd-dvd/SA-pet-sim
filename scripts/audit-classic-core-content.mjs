import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORLD } from "../src/world-data.js";
import { STONEAGE_QUEST_GROUPS_25 } from "../src/stoneage-quest-index.js";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const refRoot = path.join(appRoot, "external", "sources", "ref___data");
const clientSourceRoot = path.join(appRoot, "external", "sources", "client-source");
const publicDataRoot = path.join(appRoot, "public", "data");
const auditJsonOut = path.join(appRoot, "docs", "planning", "classic-core-source-audit.json");
const auditMarkdownOut = path.join(appRoot, "docs", "planning", "CLASSIC_CORE_SOURCE_AUDIT.md");
const gb18030 = new TextDecoder("gb18030");

const MAX_EVIDENCE_PER_KIND = 5;
const MAX_SCAN_BYTES = 2 * 1024 * 1024;
const SKIP_EXTENSIONS = new Set([
  ".bin",
  ".dat",
  ".gif",
  ".jpeg",
  ".jpg",
  ".ls2map",
  ".png",
  ".psd",
  ".wav"
]);

const c = (name, aliases = []) => ({ name, aliases });

const CANDIDATE_GROUPS = [
  {
    id: "core-quest-lines",
    profile: "classic-core",
    type: "quest",
    candidates: [
      c("成人仪式", ["成人", "成人任务"]),
      c("琉璃洞窟", ["琉璃", "琉璃洞"]),
      c("玄黄洞窟", ["玄黄", "玄黄洞"]),
      c("碧青洞窟", ["碧青", "碧青洞"]),
      c("深红洞窟", ["深红", "深红洞"]),
      c("漆黑洞窟 / 人物转生", ["漆黑洞窟", "漆黑", "人物转生", "转生"])
    ]
  },
  {
    id: "advanced-quest-lines",
    profile: "classic-advanced",
    type: "quest",
    candidates: [
      c("英雄岛", ["英雄岛前传", "英雄岛后传"]),
      c("红暴", ["红暴任务", "红色暴龙"]),
      c("四圣石", ["圣石"]),
      c("金虎", ["金格萨贝鲁"]),
      c("玛蕾菲雅", ["玛蕾菲亚", "malayfia"]),
      c("精灵王 / 精灵少女 / 黑暗精灵王", ["精灵王", "精灵少女", "黑暗精灵王"])
    ]
  },
  {
    id: "core-regions",
    profile: "classic-core",
    type: "map-region",
    candidates: [
      c("北岛 / 萨伊那斯", ["北岛", "萨伊那斯"]),
      c("南岛 / 加鲁卡", ["南岛", "加鲁卡", "加鲁迦"]),
      c("吉鲁岛", ["吉鲁"]),
      c("沙姆岛", ["沙姆"]),
      c("玛丽娜丝渔村", ["玛丽娜斯渔村", "玛丽娜丝", "渔村"]),
      c("萨姆吉尔村", ["萨姆吉尔", "萨村"]),
      c("柯奥村", ["柯奥"]),
      c("卡坦村", ["卡坦"]),
      c("柯尔克村", ["柯尔克"]),
      c("加加村", ["加加"]),
      c("卡鲁它那村", ["卡鲁它那", "卡鲁他那"]),
      c("奇喀喀村", ["奇喀喀"]),
      c("福尔德村", ["福尔德"]),
      c("达那村", ["达那"])
    ]
  },
  {
    id: "functional-interiors",
    profile: "classic-core",
    type: "npc-map-function",
    candidates: [
      c("武器店", ["武器", "weapon"]),
      c("道具店", ["道具店", "ItemShop"]),
      c("宠物店", ["宠物店", "PetShop"]),
      c("医院 / 护士", ["医院", "护士", "Healer", "heal"]),
      c("肉店", ["肉店", "肉"]),
      c("村长 / 长老屋", ["村长", "长老", "族长"]),
      c("交通 / 传送", ["通关处", "传送", "WarpMan", "warp"])
    ]
  },
  {
    id: "core-pet-families",
    profile: "classic-core",
    type: "pet-family",
    candidates: [
      c("乌力系", ["乌力"]),
      c("布伊系", ["布伊"]),
      c("加美系", ["加美", "加比"]),
      c("凯比系", ["凯比"]),
      c("人龙系", ["人龙"]),
      c("火鸡系", ["火鸡"]),
      c("老虎系", ["贝鲁", "老虎"]),
      c("暴龙系", ["暴龙", "帖拉所伊朵", "红暴", "蓝暴", "机械暴龙"]),
      c("雷龙系", ["雷龙", "布林帖斯"]),
      c("鲨鱼系 / 海主人系", ["鲨鱼", "海主人"]),
      c("穿山甲系 / 洞窟生态", ["穿山甲", "卡达鲁卡斯"]),
      c("大象系", ["大象", "玛恩摩"]),
      c("飞天蛙系 / 洛克斯系", ["飞天蛙", "洛克斯"]),
      c("四洞守护与转生 Boss", ["守护", "Boss", "魔王", "精灵"])
    ]
  }
];

const candidates = [];
for (const group of CANDIDATE_GROUPS) {
  for (const candidate of group.candidates) {
    const id = `${group.id}:${candidate.name}`;
    candidates.push({
      id,
      group: group.id,
      profile: group.profile,
      type: group.type,
      name: candidate.name,
      aliases: candidate.aliases,
      terms: candidateTerms(candidate)
    });
  }
}

const resultById = new Map(candidates.map((candidate) => [candidate.id, { ...candidate, evidence: [] }]));
const termToCandidateIds = new Map();
for (const candidate of candidates) {
  for (const term of candidate.terms) {
    const list = termToCandidateIds.get(term) || [];
    list.push(candidate.id);
    termToCandidateIds.set(term, list);
  }
}

scanWorldData();
scanQuestIndex();
scanEnemyBase();
scanClientTileEvidence();
scanTextCorpus();

const results = candidates.map((candidate) => {
  const result = resultById.get(candidate.id);
  const sourceKinds = new Set(["world-map", "world-npc", "world-quest", "ref-data", "public-data", "client-source", "enemybase", "encounter", "client-resource"]);
  const hasSourceEvidence = result.evidence.some((item) => sourceKinds.has(item.kind));
  const hasGuideIndex = result.evidence.some((item) => item.kind === "quest-index");
  return {
    ...result,
    status: hasSourceEvidence ? "source-confirmed" : hasGuideIndex ? "guide-index-only" : "unresolved",
    evidence: compactEvidence(result.evidence)
  };
});

const summary = summarize(results);
const packageImpact = summarizePackageImpact();
const reportBody = {
  policy: "External guides are advisory only; release profile entries require local ref___data, world-data, or client-resource evidence.",
  summary,
  packageImpact,
  candidates: results
};
const report = {
  generatedAt: stableGeneratedAt(auditJsonOut, reportBody),
  ...reportBody
};

writeFileSync(auditJsonOut, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(auditMarkdownOut, renderMarkdown(report));
console.log(`Wrote ${path.relative(appRoot, auditMarkdownOut)}`);
console.log(`Wrote ${path.relative(appRoot, auditJsonOut)}`);
console.log(`Confirmed ${summary.sourceConfirmed}/${summary.totalCandidates}; guide-only ${summary.guideIndexOnly}; unresolved ${summary.unresolved}.`);

function candidateTerms(candidate) {
  const terms = new Set([candidate.name, ...(candidate.aliases || [])]);
  for (const value of [...terms]) {
    for (const part of value.split(/[ /／、|]+/)) {
      const cleaned = part.replace(/系$/u, "").trim();
      if (cleaned.length >= 2) terms.add(cleaned);
    }
  }
  return [...terms]
    .map((term) => term.replace(/系$/u, "").trim())
    .filter((term) => term.length >= 2);
}

function scanWorldData() {
  const maps = Object.values(WORLD.maps || {});
  for (const map of maps) {
    const haystack = [
      map.name,
      map.summary,
      map.id,
      map.floorId,
      map.clientMapSource
    ].filter(Boolean).join(" ");
    addTermMatches(haystack, (candidateId, term) => addEvidence(candidateId, {
      kind: "world-map",
      path: "src/world-data.js",
      ref: `floor ${map.id}`,
      label: map.name,
      term
    }));

    for (const npc of map.npcs || []) {
      const npcText = [
        npc.name,
        npc.type,
        npc.dialogue,
        npc.source,
        npc.script,
        npc.template,
        npc.trade?.source,
        npc.warp?.source,
        npc.scriptHints?.hints?.join(" ")
      ].filter(Boolean).join(" ");
      addTermMatches(npcText, (candidateId, term) => addEvidence(candidateId, {
        kind: "world-npc",
        path: "src/world-data.js",
        ref: `floor ${map.id} npc (${npc.x},${npc.y})`,
        label: npc.name,
        term
      }));
    }
  }

  for (const quest of Object.values(WORLD.quests || {})) {
    const questText = [
      quest.title,
      quest.description,
      quest.reward,
      quest.source,
      ...(quest.steps || [])
    ].filter(Boolean).join(" ");
    addTermMatches(questText, (candidateId, term) => addEvidence(candidateId, {
      kind: "world-quest",
      path: "src/world-data.js",
      ref: quest.id,
      label: quest.title,
      term
    }));
  }
}

function scanQuestIndex() {
  for (const group of STONEAGE_QUEST_GROUPS_25 || []) {
    for (const task of group.tasks || []) {
      const text = [
        group.version,
        group.group,
        group.note,
        task.title,
        task.source,
        ...(task.aliases || [])
      ].filter(Boolean).join(" ");
      addTermMatches(text, (candidateId, term) => addEvidence(candidateId, {
        kind: "quest-index",
        path: "src/stoneage-quest-index.js",
        ref: `${group.group}/${task.slug}`,
        label: task.title,
        term
      }));
    }
  }
}

function scanEnemyBase() {
  const rows = parseEnemyBase();
  const byTempNo = new Map(rows.map((row) => [row.tempNo, row]));
  for (const row of rows) {
    addTermMatches(row.name, (candidateId, term) => addEvidence(candidateId, {
      kind: "enemybase",
      path: "public/data/enemybase2.txt",
      ref: `tempNo ${row.tempNo}`,
      label: `${row.name}${row.imageNo ? ` img ${row.imageNo}` : ""}`,
      term
    }));
  }

  for (const map of Object.values(WORLD.maps || {})) {
    for (const tempNo of map.encounterPets || []) {
      const enemy = byTempNo.get(Number(tempNo));
      if (!enemy) continue;
      addTermMatches(enemy.name, (candidateId, term) => addEvidence(candidateId, {
        kind: "encounter",
        path: "src/world-data.js",
        ref: `floor ${map.id}`,
        label: `${enemy.name} (${tempNo})`,
        term
      }));
    }
  }
}

function scanClientTileEvidence() {
  const tilesPath = path.join(publicDataRoot, "client-tiles", "tiles.json");
  if (!existsSync(tilesPath)) return;
  const tiles = JSON.parse(readFileSync(tilesPath, "utf8"));
  const frames = tiles.frames || {};
  for (const row of parseEnemyBase()) {
    if (!row.imageNo || !frames[String(row.imageNo)]) continue;
    addTermMatches(row.name, (candidateId, term) => addEvidence(candidateId, {
      kind: "client-resource",
      path: "public/data/client-tiles/tiles.json",
      ref: `bitmap ${row.imageNo}`,
      label: row.name,
      term
    }));
  }
}

function scanTextCorpus() {
  const scanRoots = [
    { kind: "ref-data", root: refRoot, encoding: "gb18030" },
    { kind: "client-source", root: clientSourceRoot, encoding: "gb18030" },
    { kind: "public-data", root: publicDataRoot, encoding: "utf8" }
  ];
  for (const root of scanRoots) {
    if (!existsSync(root.root)) continue;
    for (const file of walk(root.root)) {
      if (!isTextCandidate(file)) continue;
      const size = safeStat(file)?.size || 0;
      if (size > MAX_SCAN_BYTES) continue;
      const text = root.encoding === "gb18030" ? readGb(file) : readFileSync(file, "utf8");
      addTermMatches(text, (candidateId, term) => addEvidence(candidateId, {
        kind: root.kind,
        path: relative(file),
        ref: snippetFor(text, term),
        label: path.basename(file),
        term
      }));
    }
  }
}

function addTermMatches(text, onMatch) {
  if (!text) return;
  for (const [term, ids] of termToCandidateIds) {
    if (!text.includes(term)) continue;
    for (const id of ids) onMatch(id, term);
  }
}

function addEvidence(candidateId, evidence) {
  const result = resultById.get(candidateId);
  if (!result) return;
  const countForKind = result.evidence.filter((item) => item.kind === evidence.kind).length;
  if (countForKind >= MAX_EVIDENCE_PER_KIND) return;
  const key = `${evidence.kind}:${evidence.path}:${evidence.ref}:${evidence.label}`;
  if (result.evidence.some((item) => `${item.kind}:${item.path}:${item.ref}:${item.label}` === key)) return;
  result.evidence.push(evidence);
}

function compactEvidence(evidence) {
  return evidence
    .sort((a, b) => evidenceRank(a.kind) - evidenceRank(b.kind) || String(a.path).localeCompare(String(b.path)))
    .slice(0, 18);
}

function evidenceRank(kind) {
  return {
    "world-map": 1,
    "world-npc": 2,
    "world-quest": 3,
    enemybase: 4,
    encounter: 5,
    "client-resource": 6,
    "ref-data": 7,
    "public-data": 8,
    "client-source": 9,
    "quest-index": 10
  }[kind] || 99;
}

function parseEnemyBase() {
  const file = path.join(publicDataRoot, "enemybase2.txt");
  if (!existsSync(file)) return [];
  const out = [];
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const cols = line.trim().split(",");
    if (cols.length < 37) continue;
    const tempNo = Number(cols[6]);
    const imageNo = Number(cols[36]);
    const name = cleanName(cols[0]);
    if (!name || !Number.isFinite(tempNo) || tempNo <= 0) continue;
    out.push({
      name,
      tempNo,
      imageNo: Number.isFinite(imageNo) && imageNo > 0 ? imageNo : null
    });
  }
  return out;
}

function summarize(results) {
  const byStatus = countBy(results, "status");
  return {
    totalCandidates: results.length,
    sourceConfirmed: byStatus["source-confirmed"] || 0,
    guideIndexOnly: byStatus["guide-index-only"] || 0,
    unresolved: byStatus.unresolved || 0,
    byType: countBy(results, "type"),
    byGroup: countBy(results, "group")
  };
}

function summarizePackageImpact() {
  const maps = Object.values(WORLD.maps || {});
  const npcCount = maps.reduce((sum, map) => sum + (map.npcs || []).length, 0);
  const encounterAreaCount = maps.reduce((sum, map) => sum + (map.encounterAreas || []).length, 0);
  const encounterPetCount = new Set(maps.flatMap((map) => map.encounterPets || [])).size;
  const clientTilesPath = path.join(publicDataRoot, "client-tiles", "tiles.json");
  const clientTiles = existsSync(clientTilesPath) ? JSON.parse(readFileSync(clientTilesPath, "utf8")) : null;
  return {
    generatedWorld: {
      floorCount: maps.length,
      npcCount,
      questCount: Object.keys(WORLD.quests || {}).length,
      encounterAreaCount,
      encounterPetCount
    },
    publicDataBytes: {
      maps: dirSize(path.join(publicDataRoot, "maps")),
      clientMaps: dirSize(path.join(publicDataRoot, "client-maps")),
      clientTilesJson: fileSize(clientTilesPath),
      clientTilesAtlas: fileSize(path.join(publicDataRoot, "client-tiles", "tiles-atlas.png"))
    },
    clientTileFrameCount: clientTiles ? Object.keys(clientTiles.frames || {}).length : 0,
    note: "These are current full-dev-ish generated package numbers, not the future classic-core closure size."
  };
}

function renderMarkdown(report) {
  const unresolved = report.candidates.filter((item) => item.status !== "source-confirmed");
  const lines = [
    "# Classic Core Source Audit",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a local-source evidence report for the classic content profile. It does not prune resources yet.",
    "",
    "External guide entries remain advisory. A candidate is `source-confirmed` only when local `world-data`, `ref___data`, public generated data, or client resources contain evidence.",
    "",
    "## Summary",
    "",
    `- Candidates: ${report.summary.totalCandidates}`,
    `- Source-confirmed: ${report.summary.sourceConfirmed}`,
    `- Guide-index-only: ${report.summary.guideIndexOnly}`,
    `- Unresolved: ${report.summary.unresolved}`,
    `- Current generated floors: ${report.packageImpact.generatedWorld.floorCount}`,
    `- Current generated NPCs: ${report.packageImpact.generatedWorld.npcCount}`,
    `- Current encounter areas: ${report.packageImpact.generatedWorld.encounterAreaCount}`,
    `- Current unique encounter pet/enemy tempNos: ${report.packageImpact.generatedWorld.encounterPetCount}`,
    `- Current client tile frames: ${report.packageImpact.clientTileFrameCount}`,
    `- Current map asset bytes: ${report.packageImpact.publicDataBytes.maps}`,
    `- Current client map asset bytes: ${report.packageImpact.publicDataBytes.clientMaps}`,
    "",
    "## Candidate Evidence",
    "",
    "| Profile | Type | Candidate | Status | Local Evidence |",
    "| --- | --- | --- | --- | --- |"
  ];

  for (const item of report.candidates) {
    lines.push(`| ${item.profile} | ${item.type} | ${item.name} | ${item.status} | ${evidenceCell(item.evidence)} |`);
  }

  lines.push("", "## Needs Follow-Up", "");
  if (!unresolved.length) {
    lines.push("- All candidates have local source evidence.");
  } else {
    for (const item of unresolved) {
      lines.push(`- ${item.name}: ${item.status}. Evidence: ${evidenceCell(item.evidence) || "none"}`);
    }
  }

  lines.push(
    "",
    "## Next Closure Work",
    "",
    "- Treat this report as evidence discovery, not as a shipping list.",
    "- For `source-confirmed` quest lines, build the next manifest from actual NPC scripts, warps, items, enemy groups, and map dependencies.",
    "- For `guide-index-only` entries, inspect local `ref___data/npc`, `mapwarp`, `enemybase`, `group1`, and client resources before enabling them.",
    "- For `unresolved` entries, keep the content closed/hidden in `classic-core` until local source evidence is found.",
    "- Do not shorten cave floor chains, rename content, recolor pets, or replace missing content with original web-only material."
  );

  return `${lines.join("\n")}\n`;
}

function evidenceCell(evidence) {
  return evidence
    .slice(0, 4)
    .map((item) => `${item.kind}:${escapePipe(item.ref || item.label || item.path)}`)
    .join("<br>");
}

function escapePipe(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function countBy(items, key) {
  const out = {};
  for (const item of items) out[item[key]] = (out[item[key]] || 0) + 1;
  return out;
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) out.push(...walk(file));
    else out.push(file);
  }
  return out;
}

function isTextCandidate(file) {
  const ext = path.extname(file).toLowerCase();
  if (SKIP_EXTENSIONS.has(ext)) return false;
  if (!ext) return true;
  return [
    ".c",
    ".cpp",
    ".create",
    ".csv",
    ".gen",
    ".h",
    ".hpp",
    ".ini",
    ".js",
    ".json",
    ".lua",
    ".md",
    ".template",
    ".txt"
  ].includes(ext);
}

function readGb(file) {
  return gb18030.decode(readFileSync(file));
}

function snippetFor(text, term) {
  const index = text.indexOf(term);
  if (index < 0) return "";
  const start = Math.max(0, index - 28);
  const end = Math.min(text.length, index + term.length + 48);
  return cleanName(text.slice(start, end)).slice(0, 90);
}

function cleanName(value = "") {
  return String(value)
    .replace(/\0/g, "")
    .replace(/[�\uE000-\uF8FF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function relative(file) {
  return path.relative(appRoot, file).replaceAll(path.sep, "/");
}

function safeStat(file) {
  try {
    return statSync(file);
  } catch {
    return null;
  }
}

function fileSize(file) {
  const stat = safeStat(file);
  return stat?.isFile() ? stat.size : 0;
}

function dirSize(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const file of walk(dir)) total += fileSize(file);
  return total;
}

function stableGeneratedAt(file, body) {
  if (!existsSync(file)) return new Date().toISOString();
  try {
    const previous = JSON.parse(readFileSync(file, "utf8"));
    const { generatedAt: _previousGeneratedAt, ...previousBody } = previous;
    if (JSON.stringify(previousBody) === JSON.stringify(body)) return previous.generatedAt || new Date().toISOString();
  } catch {
    // Fall through and regenerate the timestamp when the previous file is not valid JSON.
  }
  return new Date().toISOString();
}
