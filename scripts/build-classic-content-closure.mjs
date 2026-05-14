import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORLD } from "../src/world-data.js";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const refRoot = path.join(appRoot, "external", "sources", "ref___data");
const mapRoot = path.join(refRoot, "map");
const publicRoot = path.join(appRoot, "public");
const publicDataRoot = path.join(publicRoot, "data");
const auditPath = path.join(appRoot, "docs", "planning", "classic-core-source-audit.json");
const manifestOut = path.join(appRoot, "docs", "planning", "classic-core-closure-manifest.json");
const markdownOut = path.join(appRoot, "docs", "planning", "CLASSIC_CORE_CLOSURE_MANIFEST.md");
const gb18030 = new TextDecoder("gb18030");

const CONTENT_LINES = [
  {
    id: "classic-village-start",
    profile: "classic-core",
    title: "Classic Village Start",
    stage: "boot",
    terms: ["萨姆吉尔", "玛丽娜丝", "玛丽娜斯", "渔村", "柯奥", "萨伊那斯"],
    seedFloors: [100, 1000, 1100, 2000],
    required: true
  },
  {
    id: "classic-village-service-loops",
    profile: "classic-core",
    title: "Village Shops, Heal, Save, Equipment",
    stage: "boot",
    terms: ["武器店", "道具店", "宠物店", "医院", "护士", "肉店", "储存点", "村长", "长老", "族长"],
    seedFloors: [
      ...range(1001, 1006),
      ...range(1101, 1106),
      ...range(1201, 1206),
      ...range(1301, 1306),
      ...range(1401, 1406),
      ...range(2001, 2006),
      ...range(3001, 3006),
      ...range(4001, 4006)
    ],
    required: true
  },
  {
    id: "first-pet-capture-training",
    profile: "classic-core",
    title: "First Pet Capture And Training Loop",
    stage: "boot",
    terms: ["捕获", "捕捉", "训练", "宠物", "乌力", "布伊", "加美", "凯比"],
    seedFloors: [100, 1000, 1003, 1103, 2000],
    required: true
  },
  {
    id: "adult-ceremony",
    profile: "classic-core",
    title: "成人仪式",
    stage: "core",
    terms: ["成人仪式", "成人式", "仪式的审判", "仪式审判", "审判仪式", "仪之玉", "仪玉"],
    seedFloors: [],
    includeScriptText: true,
    preferRunnableSourceTaskClosure: true,
    validateRouteFromCoreStarts: true,
    required: true
  },
  {
    id: "glass-cave-proof",
    profile: "classic-core",
    title: "琉璃洞窟",
    stage: "rebirth-proof",
    terms: ["琉璃洞窟", "琉璃的洞窟", "琉璃"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "yellow-cave-proof",
    profile: "classic-core",
    title: "玄黄洞窟",
    stage: "rebirth-proof",
    terms: ["玄黄洞窟", "岚黄", "玄黄"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "blue-cave-proof",
    profile: "classic-core",
    title: "碧青洞窟",
    stage: "rebirth-proof",
    terms: ["碧青洞窟", "碧青的洞窟", "碧青"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "red-cave-proof",
    profile: "classic-core",
    title: "深红洞窟",
    stage: "rebirth-proof",
    terms: ["深红洞窟", "深红的洞窟", "深红"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "dark-cave-rebirth",
    profile: "classic-core",
    title: "漆黑洞窟 / 人物转生",
    stage: "rebirth",
    terms: ["漆黑洞窟", "漆黑的洞窟", "漆黑", "人物转生", "转生地", "漆黑的守护兽"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "classic-advanced-2-0",
    profile: "classic-advanced-2.0",
    title: "2.0 英雄岛 / 红暴 / 四圣石 / 金虎",
    stage: "advanced",
    terms: ["英雄岛", "红暴", "红色暴龙", "四圣石", "圣石", "金虎", "金格萨贝鲁"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  },
  {
    id: "classic-advanced-2-5",
    profile: "classic-advanced-2.5",
    title: "2.5 玛蕾菲雅 / 精灵王线",
    stage: "advanced",
    terms: ["玛蕾菲雅", "玛蕾菲亚", "精灵王", "精灵少女", "黑暗精灵王"],
    seedFloors: [],
    includeScriptText: true,
    required: false
  }
];

const sourceMaps = scanMapFiles();
const warps = parseWarps(path.join(mapRoot, "mapwarp.txt"));
const enemyBase = parseEnemyBase(path.join(publicDataRoot, "enemybase2.txt"));
const clientTileFrames = readClientFrames();
const audit = existsSync(auditPath) ? JSON.parse(readFileSync(auditPath, "utf8")) : null;
const generatedMapIds = new Set(Object.keys(WORLD.maps || {}));
const npcScriptTextCache = new Map();
const CORE_ROUTE_START_FLOORS = [100, 200, 1000, 1100, 2000, 3000, 4000];

const lineClosures = CONTENT_LINES.map((line) => buildLineClosure(line));
const profiles = buildProfiles(lineClosures);

const manifestBody = {
  sourcePolicy: "Closure is computed from local ref___data, generated world-data, and client resource evidence. It is a build-planning manifest, not a runtime filter yet.",
  profiles,
  lines: lineClosures
};
const manifest = {
  generatedAt: stableGeneratedAt(manifestOut, manifestBody),
  ...manifestBody
};

writeFileSync(manifestOut, `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(markdownOut, renderMarkdown(manifest));
console.log(`Wrote ${path.relative(appRoot, markdownOut)}`);
console.log(`Wrote ${path.relative(appRoot, manifestOut)}`);
for (const profile of profiles) {
  console.log(`${profile.id}: floors=${profile.counts.floorCount} npcs=${profile.counts.npcCount} closedWarps=${profile.counts.closedWarpCount} enemies=${profile.counts.enemyTempNoCount} items=${profile.counts.itemCount}`);
}

function buildLineClosure(line) {
  const terms = normalizeTerms(line.terms);
  const generatedMatches = findGeneratedMatches(terms, line);
  const sourceMapMatches = findSourceMapMatches(terms);
  const seedFloors = uniqueNumbers(line.seedFloors || []);
  let requiredFloors = uniqueNumbers([
    ...seedFloors,
    ...generatedMatches.mapFloors,
    ...sourceMapMatches.map((item) => item.floor)
  ]);
  let generatedFloors = requiredFloors.filter((floor) => generatedMapIds.has(String(floor)));
  let sourceOnlyFloors = requiredFloors.filter((floor) => !generatedMapIds.has(String(floor)) && sourceMaps.has(floor));
  let oneHopTransitFloors = collectOneHopTransit(generatedFloors, requiredFloors);
  let enabledFloors = generatedFloors;
  let npcs = collectNpcs(enabledFloors, terms, line);
  let scriptEvents = collectScriptEvents(npcs);
  let sourceTaskClusters = collectSourceTaskClusters(scriptEvents);
  const preferredSourceTaskClusters = line.preferRunnableSourceTaskClosure
    ? sourceTaskClusters.filter((cluster) => cluster.runnable && sourceTaskClusterMatchesTerms(cluster, terms))
    : [];
  if (preferredSourceTaskClusters.length) {
    npcs = collectNpcsForSourceTaskClusters(preferredSourceTaskClusters);
    requiredFloors = uniqueNumbers(npcs.map((npc) => npc.floor));
    generatedFloors = requiredFloors.filter((floor) => generatedMapIds.has(String(floor)));
    sourceOnlyFloors = requiredFloors.filter((floor) => !generatedMapIds.has(String(floor)) && sourceMaps.has(floor));
    oneHopTransitFloors = collectOneHopTransit(generatedFloors, requiredFloors);
    enabledFloors = generatedFloors;
    scriptEvents = collectScriptEvents(npcs);
    sourceTaskClusters = collectSourceTaskClusters(scriptEvents)
      .filter((cluster) => sourceTaskClusterMatchesTerms(cluster, terms));
  }
  const warpsForLine = collectWarps(enabledFloors);
  const encounters = collectEncounters(enabledFloors);
  const items = collectItems(npcs, scriptEvents);
  const enemyTempNos = uniqueNumbers([
    ...encounters.flatMap((area) => area.enemyTempNos),
    ...matchingEnemyTempNos(terms)
  ]);
  const petResources = enemyTempNos.map((tempNo) => petResourceFor(tempNo)).filter(Boolean);
  const route = routeEvidenceForLine(generatedFloors, line);

  return {
    id: line.id,
    profile: line.profile,
    title: line.title,
    stage: line.stage,
    required: Boolean(line.required),
    terms,
    sourceEvidence: sourceEvidenceFor(terms),
    maps: {
      requiredFloors: floorRecords(requiredFloors),
      generatedFloors: floorRecords(generatedFloors),
      sourceOnlyFloors: floorRecords(sourceOnlyFloors),
      oneHopTransitFloors: floorRecords(oneHopTransitFloors),
      missingSeedFloors: seedFloors.filter((floor) => !sourceMaps.has(floor) && !generatedMapIds.has(String(floor)))
    },
    npcs,
    sourceTaskClusters,
    scripts: uniqueStrings(npcs.flatMap((npc) => [npc.source, npc.script]).filter(Boolean)).sort(),
    warps: warpsForLine,
    ...(route ? { route } : {}),
    items,
    encounters,
    enemies: enemyTempNos.map((tempNo) => enemyRecord(tempNo)).filter(Boolean),
    petResources,
    counts: {
      requiredFloorCount: requiredFloors.length,
      generatedFloorCount: generatedFloors.length,
      sourceOnlyFloorCount: sourceOnlyFloors.length,
      transitFloorCount: oneHopTransitFloors.length,
      npcCount: npcs.length,
      scriptCount: uniqueStrings(npcs.flatMap((npc) => [npc.source, npc.script]).filter(Boolean)).length,
      scriptEventCount: scriptEvents.length,
      sourceTaskClusterCount: sourceTaskClusters.length,
      itemCount: items.length,
      encounterAreaCount: encounters.length,
      enemyTempNoCount: enemyTempNos.length,
      petResourceCount: petResources.length,
      outboundWarpCount: warpsForLine.length
    },
    validation: validationForLine(line, requiredFloors, sourceOnlyFloors, petResources, sourceTaskClusters, route)
  };
}

function buildProfiles(lines) {
  const byProfile = new Map();
  for (const line of lines) {
    const list = byProfile.get(line.profile) || [];
    list.push(line);
    byProfile.set(line.profile, list);
  }
  return [...byProfile.entries()].map(([id, profileLines]) => {
    const floorIds = uniqueNumbers(profileLines.flatMap((line) => [
      ...line.maps.generatedFloors.map((floor) => floor.floor)
    ]));
    const closedWarps = collectClosedWarps(floorIds);
    const npcs = collectNpcs(floorIds, []);
    const encounters = collectEncounters(floorIds);
    const itemIds = uniqueNumbers(collectItems(npcs).map((item) => item.id));
    const enemyTempNos = uniqueNumbers(encounters.flatMap((area) => area.enemyTempNos));
    const petResources = enemyTempNos.map((tempNo) => petResourceFor(tempNo)).filter(Boolean);
    const sourceOnlyFloors = uniqueNumbers(profileLines.flatMap((line) => line.maps.sourceOnlyFloors.map((floor) => floor.floor)));
    return {
      id,
      lineIds: profileLines.map((line) => line.id),
      floors: floorRecords(floorIds),
      sourceOnlyFloors: floorRecords(sourceOnlyFloors),
      closedWarps,
      packageImpact: packageImpactForFloors(floorIds, petResources),
      counts: {
        floorCount: floorIds.length,
        sourceOnlyFloorCount: sourceOnlyFloors.length,
        npcCount: npcs.length,
        closedWarpCount: closedWarps.length,
        encounterAreaCount: encounters.length,
        enemyTempNoCount: enemyTempNos.length,
        itemCount: itemIds.length,
        petResourceCount: petResources.length
      },
      validation: {
        status: sourceOnlyFloors.length ? "needs-world-generation" : "closure-draft",
        warnings: [
          ...(sourceOnlyFloors.length ? [`${sourceOnlyFloors.length} source-confirmed floors are not in current generated WORLD.`] : []),
          ...(closedWarps.length ? [`${closedWarps.length} outgoing warps would need close/hide rules if this profile ships as-is.`] : [])
        ]
      }
    };
  });
}

function findGeneratedMatches(terms, line = {}) {
  const mapFloors = new Set();
  const npcMatches = [];
  for (const map of Object.values(WORLD.maps || {})) {
    const mapText = [map.id, map.name, map.summary, map.clientMapSource].filter(Boolean).join(" ");
    if (matchesAny(mapText, terms)) mapFloors.add(Number(map.id));
    for (const npc of map.npcs || []) {
      const npcText = npcSearchText(npc, line);
      if (!matchesAny(npcText, terms)) continue;
      mapFloors.add(Number(map.id));
      npcMatches.push(npcRecord(map, npc));
    }
  }
  return { mapFloors: [...mapFloors], npcMatches };
}

function findSourceMapMatches(terms) {
  const out = [];
  for (const map of sourceMaps.values()) {
    const text = [map.floor, map.name, map.path].join(" ");
    if (!matchesAny(text, terms)) continue;
    out.push(sourceMapRecord(map));
  }
  return out.sort((a, b) => a.floor - b.floor);
}

function collectOneHopTransit(generatedFloors, requiredFloors) {
  const required = new Set(requiredFloors.map(String));
  const out = new Set();
  for (const floor of generatedFloors) {
    const map = WORLD.maps[String(floor)];
    for (const exit of map?.exits || []) {
      const target = Number(exit.to);
      if (!Number.isFinite(target) || required.has(String(target))) continue;
      if (generatedMapIds.has(String(target))) out.add(target);
    }
  }
  return [...out].sort((a, b) => a - b);
}

function collectNpcs(floors, terms, line = {}) {
  const out = [];
  for (const floor of floors) {
    const map = WORLD.maps[String(floor)];
    if (!map) continue;
    for (const npc of map.npcs || []) {
      if (terms.length) {
        const npcText = npcSearchText(npc, line);
        if (!matchesAny(npcText, terms) && !terms.some((term) => map.name.includes(term))) continue;
      }
      out.push(npcRecord(map, npc));
    }
  }
  return dedupeBy(out, (npc) => npc.id).sort((a, b) => Number(a.floor) - Number(b.floor) || a.y - b.y || a.x - b.x);
}

function collectNpcsForSourceTaskClusters(clusters) {
  const ids = new Set(clusters.flatMap((cluster) => (cluster.npcs || []).map((npc) => npc.id)));
  const out = [];
  for (const map of Object.values(WORLD.maps || {})) {
    for (const npc of map.npcs || []) {
      if (ids.has(npc.id)) out.push(npcRecord(map, npc));
    }
  }
  return out.sort((a, b) => Number(a.floor) - Number(b.floor) || a.y - b.y || a.x - b.x);
}

function collectWarps(floors) {
  const enabled = new Set(floors.map(String));
  const out = [];
  for (const floor of floors) {
    const map = WORLD.maps[String(floor)];
    for (const exit of map?.exits || []) {
      out.push({
        floor,
        mapName: map.name,
        to: Number(exit.to),
        toName: WORLD.maps[String(exit.to)]?.name || sourceMaps.get(Number(exit.to))?.name || `floor ${exit.to}`,
        label: exit.label,
        source: exit.source,
        status: enabled.has(String(exit.to)) ? "internal" : "outbound-needs-profile-decision"
      });
    }
  }
  return dedupeBy(out, (warp) => `${warp.floor}:${warp.to}:${warp.label}`).sort((a, b) => a.floor - b.floor || a.to - b.to);
}

function collectClosedWarps(floors) {
  const enabled = new Set(floors.map(String));
  return collectWarps(floors)
    .filter((warp) => !enabled.has(String(warp.to)))
    .map((warp) => ({ ...warp, status: "closed-or-hidden-until-profile-enabled" }));
}

function collectEncounters(floors) {
  const out = [];
  for (const floor of floors) {
    const map = WORLD.maps[String(floor)];
    for (const area of map?.encounterAreas || []) {
      const enemyTempNos = uniqueNumbers((area.groups || [])
        .flatMap((group) => group.enemies || [])
        .map((enemy) => Number(enemy.tempNo))
        .filter((value) => Number.isFinite(value) && value > 0));
      const groupIds = uniqueNumbers((area.groups || []).map((group) => Number(group.groupId)).filter((value) => Number.isFinite(value)));
      out.push({
        floor,
        mapName: map.name,
        id: area.id,
        bounds: area.bounds,
        groupIds,
        enemyTempNos,
        source: area.source
      });
    }
  }
  return out.sort((a, b) => a.floor - b.floor || a.id - b.id);
}

function collectScriptEvents(npcs) {
  const out = [];
  for (const npc of npcs) {
    const map = WORLD.maps[String(npc.floor)];
    const sourceNpc = (map?.npcs || []).find((item) => item.id === npc.id);
    for (const event of sourceNpc?.scriptEvents || []) {
      const eventNo = Number(event.eventNo || 0);
      const getItems = (event.getItems || []).map(scriptEventItemRecord);
      const delItems = (event.delItems || []).map(scriptEventItemRecord);
      const endSetFlags = uniqueNumbers(event.endSetFlags || []);
      if (eventNo <= 0 && !getItems.length && !delItems.length && !endSetFlags.length) continue;
      out.push({
        npcId: npc.id,
        npcName: npc.name,
        floor: npc.floor,
        mapName: npc.mapName,
        eventNo,
        type: event.type || "",
        condition: event.condition || "",
        source: event.source || sourceNpc.script || sourceNpc.source || "",
        sourceCluster: sourceScriptCluster(event.source || sourceNpc.script || sourceNpc.source || ""),
        getItems,
        delItems,
        endSetFlags
      });
    }
  }
  return out.sort((a, b) => a.floor - b.floor || a.eventNo - b.eventNo || a.npcName.localeCompare(b.npcName, "zh-Hans"));
}

function scriptEventItemRecord(item) {
  return {
    id: Number(item.id),
    name: item.name || `item ${item.id}`,
    qty: Math.max(1, Number(item.qty || 1)),
    source: item.source || "gmsv-data/itemset6.txt"
  };
}

function collectSourceTaskClusters(scriptEvents) {
  const clusters = new Map();
  for (const event of scriptEvents) {
    const eventNo = Number(event.eventNo || 0);
    if (eventNo <= 0) continue;
    const key = `${eventNo}:${event.sourceCluster}`;
    const cluster = clusters.get(key) || {
      eventNo,
      sourceCluster: event.sourceCluster,
      eventTypes: new Set(),
      npcs: new Map(),
      requiredItems: new Map(),
      rewardItems: new Map(),
      endSetFlags: new Set(),
      sources: new Set()
    };
    if (event.type) cluster.eventTypes.add(event.type);
    cluster.npcs.set(event.npcId, {
      id: event.npcId,
      name: event.npcName,
      floor: event.floor,
      mapName: event.mapName
    });
    for (const item of event.delItems || []) upsertClosureItem(cluster.requiredItems, item);
    for (const item of event.getItems || []) upsertClosureItem(cluster.rewardItems, item);
    for (const flag of event.endSetFlags || []) cluster.endSetFlags.add(Number(flag));
    if (event.source) cluster.sources.add(event.source);
    clusters.set(key, cluster);
  }
  return [...clusters.values()]
    .map((cluster) => {
      const eventTypes = [...cluster.eventTypes].sort();
      const requiredItems = [...cluster.requiredItems.values()].sort((a, b) => a.id - b.id);
      const rewardItems = [...cluster.rewardItems.values()].sort((a, b) => a.id - b.id);
      const endSetFlags = uniqueNumbers([...cluster.endSetFlags]);
      return {
        eventNo: cluster.eventNo,
        sourceCluster: cluster.sourceCluster,
        eventTypes,
        npcs: [...cluster.npcs.values()].sort((a, b) => a.floor - b.floor || a.name.localeCompare(b.name, "zh-Hans")),
        requiredItems,
        rewardItems,
        endSetFlags,
        sources: [...cluster.sources].sort(),
        runnable: eventTypes.includes("REQUEST") && eventTypes.includes("ACCEPT") && Boolean(requiredItems.length || rewardItems.length || endSetFlags.length)
      };
    })
    .sort((a, b) => a.eventNo - b.eventNo || a.sourceCluster.localeCompare(b.sourceCluster));
}

function collectItems(npcs, scriptEvents = []) {
  const out = [];
  for (const npc of npcs) {
    const map = WORLD.maps[String(npc.floor)];
    const sourceNpc = (map?.npcs || []).find((item) => item.id === npc.id);
    for (const item of sourceNpc?.trade?.items || []) {
      out.push({
        id: Number(item.id),
        name: item.name,
        type: item.type,
        dependency: "shop",
        price: item.price,
        npcId: npc.id,
        npcName: npc.name,
        floor: npc.floor,
        source: sourceNpc.trade.source
      });
    }
  }
  for (const event of scriptEvents) {
    for (const item of event.delItems || []) {
      out.push({
        ...item,
        dependency: "script-del",
        eventNo: event.eventNo,
        npcId: event.npcId,
        npcName: event.npcName,
        floor: event.floor,
        source: item.source || event.source
      });
    }
    for (const item of event.getItems || []) {
      out.push({
        ...item,
        dependency: "script-get",
        eventNo: event.eventNo,
        npcId: event.npcId,
        npcName: event.npcName,
        floor: event.floor,
        source: item.source || event.source
      });
    }
  }
  return dedupeBy(out, (item) => `${item.id}:${item.floor}:${item.npcId}`).sort((a, b) => a.id - b.id);
}

function upsertClosureItem(map, item) {
  const key = Number(item.id);
  if (!key) return;
  const next = scriptEventItemRecord(item);
  const existing = map.get(key);
  map.set(key, existing ? { ...existing, qty: Math.max(Number(existing.qty || 1), Number(next.qty || 1)) } : next);
}

function sourceScriptCluster(source) {
  const cleaned = String(source || "").replace(/^gmsv-data\/npc\//, "");
  const parts = cleaned.split(/[\\/]+/).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).join("/");
  return cleaned || "unknown";
}

function sourceTaskClusterMatchesTerms(cluster, terms) {
  const text = [
    cluster.eventNo,
    cluster.sourceCluster,
    ...(cluster.npcs || []).flatMap((npc) => [npc.name, npc.mapName]),
    ...(cluster.requiredItems || []).map((item) => item.name),
    ...(cluster.rewardItems || []).map((item) => item.name),
    ...(cluster.sources || [])
  ].filter(Boolean).join(" ");
  return matchesAny(text, terms);
}

function matchingEnemyTempNos(terms) {
  return [...enemyBase.values()]
    .filter((enemy) => matchesAny(enemy.name, terms))
    .map((enemy) => enemy.tempNo);
}

function npcSearchText(npc, line = {}) {
  return [
    npc.name,
    npc.type,
    npc.dialogue,
    npc.source,
    npc.script,
    npc.template,
    npc.trade?.source,
    npc.warp?.source,
    npc.warp?.freeMessage,
    npc.warp?.payMessage,
    npc.warp?.moneyMessage,
    npc.warp?.partyMessage,
    npc.npcEnemy?.source,
    npc.scriptHints?.hints?.join(" "),
    line.includeScriptText ? npcScriptText(npc) : ""
  ].filter(Boolean).join(" ");
}

function npcScriptText(npc) {
  const refs = [
    npc.script,
    npc.scriptHints?.source,
    npc.trade?.source,
    npc.warp?.source,
    npc.npcEnemy?.source
  ];
  return uniqueStrings(refs.flatMap(resolveNpcScriptRefs))
    .map((file) => readCachedNpcScript(file))
    .filter(Boolean)
    .join("\n");
}

function resolveNpcScriptRefs(ref) {
  const value = String(ref || "").trim();
  if (!value) return [];
  const out = [];
  const pushNpcRelative = (relativePath) => {
    if (!relativePath) return;
    const clean = relativePath.replace(/^\/+/, "");
    out.push(path.join(refRoot, "npc", clean));
  };

  if (value.startsWith("file:")) {
    pushNpcRelative(value.slice("file:".length));
  } else if (value.startsWith("gmsv-data/npc/")) {
    pushNpcRelative(value.slice("gmsv-data/npc/".length));
  } else if (value.startsWith("gmsv-data/")) {
    out.push(path.join(refRoot, value.slice("gmsv-data/".length)));
  }
  return out;
}

function readCachedNpcScript(file) {
  if (!file || !existsSync(file)) return "";
  if (!npcScriptTextCache.has(file)) {
    const stat = statSync(file);
    npcScriptTextCache.set(file, stat.size <= 1024 * 1024 ? readGb(file) : "");
  }
  return npcScriptTextCache.get(file);
}

function sourceEvidenceFor(terms) {
  if (!audit) return [];
  return (audit.candidates || [])
    .filter((candidate) => matchesAny([candidate.name, ...(candidate.aliases || [])].join(" "), terms))
    .map((candidate) => ({
      name: candidate.name,
      status: candidate.status,
      group: candidate.group,
      evidenceKinds: uniqueStrings((candidate.evidence || []).map((item) => item.kind)).sort()
    }));
}

function routeEvidenceForLine(generatedFloors, line = {}) {
  if (!line.validateRouteFromCoreStarts) return null;
  const targetFloors = uniqueNumbers(generatedFloors).filter((floor) => generatedMapIds.has(String(floor)));
  const startFloors = uniqueNumbers(line.routeStartFloors || CORE_ROUTE_START_FLOORS)
    .filter((floor) => generatedMapIds.has(String(floor)));
  const routeTree = reachableFloorsFrom(startFloors);
  const reachableFloors = targetFloors.filter((floor) => routeTree.reachable.has(String(floor)));
  const unreachableFloors = targetFloors.filter((floor) => !routeTree.reachable.has(String(floor)));
  const paths = Object.fromEntries(reachableFloors.map((floor) => [floor, routePathTo(String(floor), routeTree.parents)]));
  const pathEdges = Object.values(paths).flatMap((path) => path.edges || []);
  const transitFloors = uniqueNumbers(Object.values(paths).flatMap((path) => path.floors || []))
    .filter((floor) => !targetFloors.includes(floor) && !startFloors.includes(floor));
  const usesNpcWarp = pathEdges.some((edge) => edge.kind === "npc-warp");
  return {
    status: unreachableFloors.length ? "needs-entry-path" : usesNpcWarp ? "reachable-with-source-npc-warp" : "reachable-from-core-starts",
    evidence: "Generated WORLD exits and NPC warp targets derived from local ref___data/map/mapwarp.txt and gmsv-data/npc scripts.",
    startFloors,
    reachableFloors,
    unreachableFloors,
    transitFloors,
    paths
  };
}

function reachableFloorsFrom(startFloors) {
  const queue = startFloors.map(String);
  const reachable = new Set(queue);
  const parents = new Map();
  while (queue.length) {
    const floor = queue.shift();
    for (const edge of routeEdgesForFloor(floor)) {
      const next = String(edge.to);
      if (!generatedMapIds.has(next) || reachable.has(next)) continue;
      reachable.add(next);
      parents.set(next, { from: floor, edge });
      queue.push(next);
    }
  }
  return { reachable, parents };
}

function routeEdgesForFloor(floor) {
  const map = WORLD.maps[String(floor)];
  const edges = [];
  for (const exit of map?.exits || []) {
    edges.push({
      kind: "mapwarp",
      from: Number(floor),
      to: Number(exit.to),
      label: exit.label,
      source: exit.source || "gmsv-data/map/mapwarp.txt"
    });
  }
  for (const npc of map?.npcs || []) {
    const target = npc.warp?.target;
    if (!target?.mapId) continue;
    edges.push({
      kind: "npc-warp",
      from: Number(floor),
      to: Number(target.mapId),
      label: `${npc.name} -> floor ${target.mapId}`,
      npcId: npc.id,
      npcName: npc.name,
      x: npc.x,
      y: npc.y,
      condition: npc.warp.free || "",
      cost: npc.warp.money || "",
      source: npc.warp.source || npc.script || npc.source || ""
    });
  }
  return edges;
}

function routePathTo(targetFloor, parents) {
  const edges = [];
  const floors = [Number(targetFloor)];
  let cursor = targetFloor;
  while (parents.has(cursor)) {
    const parent = parents.get(cursor);
    edges.push(parent.edge);
    cursor = String(parent.from);
    floors.push(Number(cursor));
  }
  return {
    floors: floors.reverse(),
    edges: edges.reverse()
  };
}

function validationForLine(line, requiredFloors, sourceOnlyFloors, petResources, sourceTaskClusters = [], route = null) {
  const warnings = [];
  const runnableSourceTasks = sourceTaskClusters.filter((cluster) => cluster.runnable);
  if (!requiredFloors.length) warnings.push("No local floor was pulled into this line yet; use script/NPC evidence before enabling.");
  if (sourceOnlyFloors.length) warnings.push(`${sourceOnlyFloors.length} source map floors are not in current generated WORLD and must be added before this line is playable.`);
  if (petResources.some((pet) => !pet.hasClientFrame)) warnings.push("Some enemy/pet bitmap ids are not in the current client tile atlas.");
  if (line.includeScriptText && !runnableSourceTasks.length) warnings.push("NPC script-text matches are dependency candidates; validate source actions, flags, rewards, and warps before marking this line playable.");
  if (route?.unreachableFloors?.length) {
    warnings.push(`${route.unreachableFloors.length} generated floor(s) have no verified mapwarp route from core starts: ${route.unreachableFloors.slice(0, 8).join(", ")}.`);
  }
  const hasUnreachableRoute = Boolean(route?.unreachableFloors?.length);
  const status = warnings.length
    ? (runnableSourceTasks.length && hasUnreachableRoute ? "script-playable-needs-entry" : "needs-closure-work")
    : (runnableSourceTasks.length ? "playable-source-script-draft" : "closure-draft");
  return {
    status,
    warnings
  };
}

function packageImpactForFloors(floors, petResources) {
  const mapBytes = floors.reduce((sum, floor) => sum + fileSize(path.join(publicDataRoot, "maps", `${floor}.ls2map`)), 0);
  const clientMapBytes = floors.reduce((sum, floor) => sum + fileSize(path.join(publicDataRoot, "client-maps", `${floor}.dat`)), 0);
  return {
    mapBytes,
    clientMapBytes,
    petStaticFrameCount: petResources.filter((pet) => pet.hasClientFrame).length,
    note: "This is an approximate manifest impact. It does not include future field/battle animation packs yet."
  };
}

function scanMapFiles() {
  const files = new Map();
  for (const file of walk(mapRoot)) {
    const buf = readFileSync(file);
    if (buf.length < 44 || buf.toString("ascii", 0, 6) !== "LS2MAP") continue;
    const floor = buf.readUInt16BE(6);
    const rawName = gb18030.decode(buf.subarray(8, 40)).replace(/\0/g, "").trim();
    files.set(floor, {
      floor,
      file,
      path: relative(file),
      name: cleanName(rawName) || `floor ${floor}`,
      width: buf.readUInt16BE(40),
      height: buf.readUInt16BE(42)
    });
  }
  return files;
}

function parseWarps(file) {
  const out = new Map();
  if (!existsSync(file)) return out;
  for (const line of readGb(file).split(/\r?\n/)) {
    const parts = line.trim().split(":");
    if (parts.length < 5) continue;
    const from = parts[2].split(",").map(Number);
    const to = parts[3].split(",").map(Number);
    if (from.length < 3 || to.length < 3 || from.some(Number.isNaN) || to.some(Number.isNaN)) continue;
    const list = out.get(from[0]) || [];
    list.push({ floor: from[0], x: from[1], y: from[2], toFloor: to[0], toX: to[1], toY: to[2] });
    out.set(from[0], list);
  }
  return out;
}

function parseEnemyBase(file) {
  const out = new Map();
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const cols = line.trim().split(",");
    if (cols.length < 37) continue;
    const tempNo = Number(cols[6]);
    if (!Number.isFinite(tempNo) || tempNo <= 0) continue;
    out.set(tempNo, {
      tempNo,
      name: cleanName(cols[0]) || `enemy ${tempNo}`,
      level: Number(cols[7]) || 0,
      imageNo: positiveNumber(cols[36])
    });
  }
  return out;
}

function readClientFrames() {
  const file = path.join(publicDataRoot, "client-tiles", "tiles.json");
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, "utf8")).frames || {};
}

function floorRecords(floors) {
  return uniqueNumbers(floors).map((floor) => {
    const generated = WORLD.maps[String(floor)];
    const source = sourceMaps.get(floor);
    return {
      floor,
      name: generated?.name || source?.name || `floor ${floor}`,
      generated: Boolean(generated),
      sourcePath: source?.path || null,
      size: generated?.size || (source ? [source.width, source.height] : null),
      mapBytes: fileSize(path.join(publicDataRoot, "maps", `${floor}.ls2map`)),
      clientMapBytes: fileSize(path.join(publicDataRoot, "client-maps", `${floor}.dat`))
    };
  });
}

function sourceMapRecord(map) {
  return {
    floor: map.floor,
    name: map.name,
    generated: generatedMapIds.has(String(map.floor)),
    sourcePath: map.path,
    size: [map.width, map.height]
  };
}

function npcRecord(map, npc) {
  return {
    id: npc.id,
    floor: Number(map.id),
    mapName: map.name,
    name: npc.name,
    type: npc.type,
    x: npc.x,
    y: npc.y,
    source: npc.source,
    script: npc.script,
    actions: npc.scriptHints?.actions || [],
    hasTrade: Boolean(npc.trade),
    hasWarp: Boolean(npc.warp),
    hasBattle: Boolean(npc.npcEnemy)
  };
}

function enemyRecord(tempNo) {
  const enemy = enemyBase.get(Number(tempNo));
  if (!enemy) return null;
  return {
    tempNo: enemy.tempNo,
    name: enemy.name,
    level: enemy.level,
    imageNo: enemy.imageNo,
    hasClientFrame: Boolean(enemy.imageNo && clientTileFrames[String(enemy.imageNo)])
  };
}

function petResourceFor(tempNo) {
  const enemy = enemyBase.get(Number(tempNo));
  if (!enemy) return null;
  return {
    tempNo: enemy.tempNo,
    name: enemy.name,
    bitmapNo: enemy.imageNo,
    hasClientFrame: Boolean(enemy.imageNo && clientTileFrames[String(enemy.imageNo)])
  };
}

function renderMarkdown(manifest) {
  const lines = [
    "# Classic Core Closure Manifest",
    "",
    `Generated: ${manifest.generatedAt}`,
    "",
    "This manifest is the first machine-readable dependency closure draft for original-resource content profiles. It does not prune runtime assets yet.",
    "",
    "## Profile Summary",
    "",
    "| Profile | Lines | Floors | Source-Only Floors | NPCs | Items | Enemy TempNos | Pet Frames | Closed Warps | Map Bytes | Client Map Bytes |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
  ];
  for (const profile of manifest.profiles) {
    lines.push(`| ${profile.id} | ${profile.lineIds.length} | ${profile.counts.floorCount} | ${profile.counts.sourceOnlyFloorCount} | ${profile.counts.npcCount} | ${profile.counts.itemCount} | ${profile.counts.enemyTempNoCount} | ${profile.counts.petResourceCount} | ${profile.counts.closedWarpCount} | ${profile.packageImpact.mapBytes} | ${profile.packageImpact.clientMapBytes} |`);
  }
  lines.push("", "## Line Summary", "", "| Line | Profile | Stage | Floors | Source-Only | NPCs | Source Tasks | Items | Enemies | Status | Warnings |", "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |");
  for (const line of manifest.lines) {
    lines.push(`| ${line.title} | ${line.profile} | ${line.stage} | ${line.counts.generatedFloorCount} | ${line.counts.sourceOnlyFloorCount} | ${line.counts.npcCount} | ${line.counts.sourceTaskClusterCount} | ${line.counts.itemCount} | ${line.counts.enemyTempNoCount} | ${line.validation.status} | ${line.validation.warnings.join("<br>") || ""} |`);
  }
  lines.push("", "## Important Notes", "");
  lines.push("- `sourceOnlyFloors` means local original LS2MAP data exists, but the current generated Worker `WORLD` does not include the floor yet.");
  lines.push("- `sourceTaskClusters` are parsed `EventNo`/`TYPE` changeevent groups with their source required/reward items. They are used to keep task resources in profile closure instead of trusting text matches alone.");
  lines.push("- Route evidence uses original map exits and generated NPC warp scripts. `script-playable-needs-entry` means the local NPC script task cluster looks runnable, but no verified mapwarp/NPC-warp route from core start maps is known yet.");
  lines.push("- `closedWarps` are not bugs by themselves. They are the list of exits that need source-style close/hide behavior if a smaller profile ships without the target map.");
  lines.push("- Rebirth remains gated until the four proof cave lines and dark cave line have no missing generated floors and have battle/NPC rewards validated.");
  lines.push("- This draft intentionally avoids new art, renamed content, shortened cave chains, and arbitrary map caps.");
  return `${lines.join("\n")}\n`;
}

function matchesAny(text, terms) {
  const value = String(text || "");
  return terms.some((term) => value.includes(term));
}

function normalizeTerms(terms) {
  const out = new Set();
  for (const term of terms || []) {
    const value = String(term).trim();
    if (!value) continue;
    out.add(value);
    for (const part of value.split(/[ /／、|]+/)) {
      const cleaned = part.replace(/系$/u, "").trim();
      if (cleaned.length >= 2) out.add(cleaned);
    }
  }
  return [...out];
}

function uniqueNumbers(values) {
  return [...new Set(values.map(Number).filter((value) => Number.isFinite(value)))].sort((a, b) => a - b);
}

function uniqueStrings(values) {
  return [...new Set(values.map(String).filter(Boolean))];
}

function dedupeBy(items, keyFn) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function readGb(file) {
  return gb18030.decode(readFileSync(file));
}

function cleanName(value = "") {
  return String(value)
    .replace(/\0/g, "")
    .replace(/[�\uE000-\uF8FF]/g, "")
    .replace(/\|0+.*$/g, "")
    .replace(/\|([1-9]\d*).*$/g, " $1")
    .replace(/\|.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function relative(file) {
  return path.relative(appRoot, file).replaceAll(path.sep, "/");
}

function fileSize(file) {
  try {
    const stat = statSync(file);
    return stat.isFile() ? stat.size : 0;
  } catch {
    return 0;
  }
}

function stableGeneratedAt(file, body) {
  if (!existsSync(file)) return new Date().toISOString();
  try {
    const previous = JSON.parse(readFileSync(file, "utf8"));
    const { generatedAt: _previousGeneratedAt, ...previousBody } = previous;
    if (JSON.stringify(previousBody) === JSON.stringify(body)) return previous.generatedAt || new Date().toISOString();
  } catch {
    // Keep generator output deterministic except when the previous JSON is unreadable.
  }
  return new Date().toISOString();
}
