const SAVE_KEY = "stoneage-web-game-v1";
const MAP_ZOOM_MIN = 0.5;
const MAP_ZOOM_MAX = 8;
const MAP_ZOOM_STEP = 0.5;
const MAP_DEFAULT_ZOOM = 1;
const CG_INVISIBLE = 99;
const REAL_TILE_CELL_LIMIT = 90000;
const LARGE_MAP_CANVAS_MAX_SIDE = 4096;
const LARGE_MAP_VIEW_PADDING = 192;
const LARGE_MAP_TILE_PADDING = 8;
const TILE_ATLAS_MANIFEST = "/data/client-tiles/tiles.json?v=player-sprite-v2";
const ENCOUNTER_UI_ENABLED = false;
const MAP_GRID_SIZE = 64;
const TILE_HALF_H = 24;
const MAP_BACKDROP_COLOR = "#000000";
// SPR_001em (100000) stand/walk frames from the original client sprite tables.
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
const SCREEN_DIRECTION_KEYS = Object.freeze({
  q: 0,
  home: 0,
  numpad7: 0,
  "7": 0,
  w: 1,
  arrowup: 1,
  numpad8: 1,
  "8": 1,
  e: 2,
  pageup: 2,
  numpad9: 2,
  "9": 2,
  d: 3,
  arrowright: 3,
  numpad6: 3,
  "6": 3,
  c: 4,
  pagedown: 4,
  numpad3: 4,
  "3": 4,
  s: 5,
  arrowdown: 5,
  numpad2: 5,
  "2": 5,
  z: 6,
  end: 6,
  numpad1: 6,
  "1": 6,
  a: 7,
  arrowleft: 7,
  numpad4: 7,
  "4": 7
});
const DEFAULT_PLAYER_DIRECTION = 5;
const PLAYER_WALK_FRAME_MS = 95;
const PLAYER_WALK_ANIM_MS = 720;
const PLAYER_WALK_MOVE_MS = 190;
const PLAYER_STAND_FRAMES = Object.freeze({
  0: [10201, 10202, 10203, 10202],
  1: [10244, 10245, 10246, 10245],
  2: [10287, 10288, 10289, 10288],
  3: [10330, 10331, 10332, 10331],
  4: [10373, 10374, 10375, 10374],
  5: [10416, 10417, 10418, 10417],
  6: [10459, 10460, 10461, 10460],
  7: [10502, 10503, 10504, 10503]
});
const PLAYER_WALK_FRAMES = Object.freeze({
  0: [10212, 10213, 10214, 10215, 10216, 10217],
  1: [10255, 10256, 10257, 10258, 10259, 10260],
  2: [10298, 10299, 10300, 10301, 10302, 10303],
  3: [10341, 10342, 10343, 10344, 10345, 10346],
  4: [10384, 10385, 10386, 10387, 10388, 10389],
  5: [10427, 10428, 10429, 10430, 10431, 10432],
  6: [10470, 10471, 10472, 10473, 10474, 10475],
  7: [10513, 10514, 10515, 10516, 10517, 10518]
});
const PLAYER_FRAME_IDS = new Set(Object.values(PLAYER_STAND_FRAMES).concat(Object.values(PLAYER_WALK_FRAMES)).flat());
const DEFAULT_PLAYER_FRAME = PLAYER_STAND_FRAMES[DEFAULT_PLAYER_DIRECTION][0];

let game = null;
let installPrompt = null;
let walkInFlight = false;
let routeInFlight = false;
let routeToken = 0;
let tileAtlasPromise = null;
let loadedTileAtlas = null;
let largeMapRenderer = null;
let mapRenderVersion = 0;
let activeTab = "pets";
let clientWindowOpen = false;
let playerAnimState = {
  dir: DEFAULT_PLAYER_DIRECTION,
  startedAt: 0,
  walkUntil: 0,
  moveUntil: 0,
  mapId: null,
  fromX: 0,
  fromY: 0,
  toX: 0,
  toY: 0,
  raf: 0
};
const mapView = {
  zoom: MAP_DEFAULT_ZOOM,
  panX: 0,
  panY: 0,
  centerOnNextRender: true,
  mapId: null,
  dragging: false,
  moved: false,
  startX: 0,
  startY: 0,
  startPanX: 0,
  startPanY: 0
};

const els = {
  creator: byId("creator"),
  game: byId("game"),
  createForm: byId("createForm"),
  playerName: byId("playerName"),
  playerTitle: byId("playerTitle"),
  playerStats: byId("playerStats"),
  mapName: byId("mapName"),
  mapSummary: byId("mapSummary"),
  mapCanvas: byId("mapCanvas"),
  mapZoomOut: byId("mapZoomOut"),
  mapZoomReset: byId("mapZoomReset"),
  mapZoomIn: byId("mapZoomIn"),
  mapZoomValue: byId("mapZoomValue"),
  mapHudName: byId("mapHudName"),
  mapHudMeta: byId("mapHudMeta"),
  mapHudHpBar: byId("mapHudHpBar"),
  mapHudHpText: byId("mapHudHpText"),
  mapHudPetName: byId("mapHudPetName"),
  mapHudPetMeta: byId("mapHudPetMeta"),
  mapHudPetHpBar: byId("mapHudPetHpBar"),
  mapHudPetHpText: byId("mapHudPetHpText"),
  mapHudInventory: byId("mapHudInventory"),
  fieldMessage: byId("fieldMessage"),
  clientWindow: byId("clientWindow"),
  clientWindowTitle: byId("clientWindowTitle"),
  clientWindowBody: byId("clientWindowBody"),
  clientWindowClose: byId("clientWindowClose"),
  npcList: byId("npcList"),
  exitList: byId("exitList"),
  encounterPanel: byId("encounterPanel"),
  encounterName: byId("encounterName"),
  encounterStats: byId("encounterStats"),
  encounterImg: byId("encounterImg"),
  encounterBtn: byId("encounterBtn"),
  attackBtn: byId("attackBtn"),
  captureBtn: byId("captureBtn"),
  skipEncounterBtn: byId("skipEncounterBtn"),
  battleLog: byId("battleLog"),
  dialogPanel: byId("dialogPanel"),
  dialogNpcName: byId("dialogNpcName"),
  dialogSource: byId("dialogSource"),
  dialogMessages: byId("dialogMessages"),
  dialogSuggestions: byId("dialogSuggestions"),
  dialogForm: byId("dialogForm"),
  dialogInput: byId("dialogInput"),
  dialogCloseBtn: byId("dialogCloseBtn"),
  petList: byId("petList"),
  questList: byId("questList"),
  gameLog: byId("gameLog"),
  dataQuery: byId("dataQuery"),
  dataSearchBtn: byId("dataSearchBtn"),
  dataResults: byId("dataResults"),
  aiPrompt: byId("aiPrompt"),
  aiBtn: byId("aiBtn"),
  aiResult: byId("aiResult"),
  saveInfo: byId("saveInfo"),
  saveText: byId("saveText"),
  saveJsonText: byId("saveJsonText"),
  exportSaveBtn: byId("exportSaveBtn"),
  importSaveBtn: byId("importSaveBtn"),
  guideBtn: byId("guideBtn"),
  newGameBtn: byId("newGameBtn"),
  installBtn: byId("installBtn"),
  netState: byId("netState"),
  saveState: byId("saveState")
};

init();

function init() {
  bindEvents();
  showTab("pets");
  updateNetState();
  window.addEventListener("online", updateNetState);
  window.addEventListener("offline", updateNetState);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    els.installBtn.hidden = false;
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    game = JSON.parse(saved);
    mapView.centerOnNextRender = true;
    showGame();
    syncGame();
  }
}

function bindEvents() {
  els.createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    game = await api("/api/game/new", { name: els.playerName.value });
    mapView.zoom = MAP_DEFAULT_ZOOM;
    mapView.centerOnNextRender = true;
    save();
    showGame();
    render();
  });
  if (ENCOUNTER_UI_ENABLED) {
    els.encounterBtn.addEventListener("click", () => mutate("/api/game/encounter", {}));
    els.attackBtn.addEventListener("click", () => mutate("/api/game/battle", { action: "attack" }));
    els.captureBtn.addEventListener("click", () => mutate("/api/game/capture", {}));
  }
  els.skipEncounterBtn.addEventListener("click", () => {
    if (!game) return;
    game.encounter = null;
    game.battle = null;
    game.log.push("你放走了野外宠物。");
    save();
    render();
  });
  els.dialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.dialogInput.value.trim();
    if (text) sendDialog(text);
  });
  els.dialogCloseBtn.addEventListener("click", () => {
    if (!game) return;
    game.dialog = null;
    save();
    renderDialog();
  });
  els.dataSearchBtn.addEventListener("click", searchData);
  els.dataQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchData();
  });
  els.aiBtn.addEventListener("click", askGuide);
  els.exportSaveBtn.addEventListener("click", exportSaveJson);
  els.importSaveBtn.addEventListener("click", importSaveJson);
  els.mapZoomOut.addEventListener("click", () => zoomMap(mapView.zoom - MAP_ZOOM_STEP));
  els.mapZoomIn.addEventListener("click", () => zoomMap(mapView.zoom + MAP_ZOOM_STEP));
  els.mapZoomReset.addEventListener("click", resetMapView);
  els.mapCanvas.addEventListener("pointerdown", onMapPointerDown);
  els.mapCanvas.addEventListener("pointermove", onMapPointerMove);
  els.mapCanvas.addEventListener("pointerup", onMapPointerUp);
  els.mapCanvas.addEventListener("pointercancel", onMapPointerUp);
  els.mapCanvas.addEventListener("click", onMapCanvasClick);
  els.npcList.addEventListener("click", onNpcListClick);
  window.addEventListener("resize", centerMapOnPlayer);
  window.addEventListener("keydown", onGameKeyDown);
  els.guideBtn.addEventListener("click", () => {
    showTab("ai", { openClientWindow: true });
    askGuide();
  });
  els.newGameBtn.addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    game = null;
    els.game.hidden = true;
    els.creator.hidden = false;
  });
  els.installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    els.installBtn.hidden = true;
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });
  document.querySelectorAll("[data-command-tab]").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.commandTab, { openClientWindow: true }));
  });
  els.clientWindowClose.addEventListener("click", () => {
    clientWindowOpen = false;
    renderClientWindow();
  });
  els.encounterImg.addEventListener("error", () => {
    els.encounterImg.src = "/f/logo.gif";
  });
}

async function mutate(path, body) {
  if (!game) return;
  game = await api(path, { ...body, game });
  if (path === "/api/game/travel") mapView.centerOnNextRender = true;
  save();
  render();
}

async function syncGame() {
  if (!game) return;
  game = await api("/api/game/sync", { game });
  save();
  render();
}

function showGame() {
  els.creator.hidden = true;
  els.game.hidden = false;
}

function render() {
  if (!game) return;
  syncPlayerAnimationDirectionFromGame();
  const map = game.world.map;
  els.playerTitle.textContent = game.player.name;
  els.playerStats.textContent = `Lv.${game.player.level} | HP ${game.player.hp}/${game.player.maxHp} | 经验 ${game.player.exp} | 石币 ${game.player.stone} | 宠物 ${game.pets.length}`;
  els.mapName.textContent = map.name;
  els.mapSummary.textContent = `${map.summary} | 位置 (${game.location.x},${game.location.y})${nearbyText()} | 来源：ref___data/map + mapwarp.txt + encount.txt + npc scripts`;
  renderMapHud();
  els.encounterBtn.hidden = !ENCOUNTER_UI_ENABLED;
  els.encounterBtn.disabled = !ENCOUNTER_UI_ENABLED || !map.encounterPets?.length;
  els.encounterBtn.title = ENCOUNTER_UI_ENABLED
    ? (map.encounterPets?.length ? "主动触发一次野外遇敌" : "当前地图没有 encount.txt 遇敌资料")
    : "遇敌捕获界面已关闭";
  renderMap(map);
  renderNpc(map);
  renderExits(map);
  renderDialog();
  renderEncounter();
  renderPets();
  renderQuests();
  renderLog();
  renderSavePanel();
  renderSaveState();
  renderFieldMessage();
  renderClientWindow();
}

function renderMap(map) {
  const content = els.mapCanvas.querySelector(".map-content");
  const sameMap = mapView.mapId === map.id && content;
  if (sameMap) {
    if (largeMapRenderer) largeMapRenderer.map = map;
    syncMapMarkers(map);
    if (mapView.centerOnNextRender) {
      centerMapOnPlayer();
      mapView.centerOnNextRender = false;
    } else {
      clampMapPan();
    }
    applyMapView();
    return;
  }
  resetLargeMapRenderer();
  const renderVersion = ++mapRenderVersion;
  const layout = mapLayout(map);
  const metrics = mapMetrics(map);
  if (mapView.mapId !== map.id) {
    mapView.mapId = map.id;
    mapView.centerOnNextRender = true;
  }
  const markers = [
    `<canvas class="ls2-map" aria-hidden="true"></canvas>`,
    `<canvas class="ls2-sprites" aria-hidden="true"></canvas>`,
    `<div class="map-region village"><strong>${escapeHtml(layout.primary)}</strong><span>${escapeHtml(layout.primaryHint)}</span></div>`,
    `<button class="map-marker player" style="${mapPos(layout.player)}" title="${escapeHtml(game.player.name)}" aria-label="${escapeHtml(game.player.name)}"><b aria-hidden="true">你</b><span>${escapeHtml(game.player.name)}</span></button>`,
    ...map.npcs.map((npc, index) => {
      const point = layout.npcs[index] || [45, 50];
      return `<button class="map-marker npc" style="${mapPos(point)}" data-npc="${npc.id}" title="${escapeHtml(npc.name)}" aria-label="${escapeHtml(npc.name)}"><b aria-hidden="true">${escapeHtml(npc.name.slice(0, 1))}</b><span>${escapeHtml(npc.name)}</span></button>`;
    }),
    ...map.exits.map((exit, index) => {
      const point = layout.exits[index] || [86, 55];
      return `<button class="map-marker exit" style="${mapPos(point)}" data-exit="${exit.id}" title="${escapeHtml(exit.detail || exit.label)}" aria-label="${escapeHtml(exit.label)}"><b aria-hidden="true">出</b><span>${escapeHtml(exit.label)}</span></button>`;
    })
  ];
  els.mapCanvas.innerHTML = `<div class="map-content" style="width:${Math.ceil(metrics.width)}px;height:${Math.ceil(metrics.height)}px">${markers.join("")}</div>`;
  centerMapOnPoint(layout.player);
  mapView.centerOnNextRender = false;
  clampMapPan();
  applyMapView();
  renderLs2Map(map, renderVersion).catch(() => {
    els.mapCanvas.classList.add("map-fallback");
  });
}

function onMapCanvasClick(event) {
  if (mapView.moved) return;
  const npcBtn = event.target.closest("[data-npc]");
  if (npcBtn && els.mapCanvas.contains(npcBtn)) {
    goToNpc(npcBtn.dataset.npc);
    return;
  }
  const exitBtn = event.target.closest("[data-exit]");
  if (exitBtn && els.mapCanvas.contains(exitBtn)) {
    goToExit(exitBtn.dataset.exit);
    return;
  }
  const target = mapTileFromPointer(event);
  if (target) {
    followRouteTo(target);
  }
}

function zoomMap(value, anchor = null) {
  const nextZoom = Math.max(MAP_ZOOM_MIN, Math.min(MAP_ZOOM_MAX, value));
  const oldZoom = mapView.zoom;
  if (nextZoom === oldZoom) return;
  const rect = els.mapCanvas.getBoundingClientRect();
  const point = anchor || { x: rect.width / 2, y: rect.height / 2 };
  const worldX = (point.x - mapView.panX) / oldZoom;
  const worldY = (point.y - mapView.panY) / oldZoom;
  mapView.zoom = nextZoom;
  mapView.panX = point.x - worldX * nextZoom;
  mapView.panY = point.y - worldY * nextZoom;
  clampMapPan();
  applyMapView();
}

function resetMapView() {
  mapView.zoom = MAP_DEFAULT_ZOOM;
  centerMapOnPlayer();
  applyMapView();
}

function centerMapOnPlayer() {
  if (!game?.world?.map) return;
  centerMapOnPoint(mapClientPoint(game.world.map, game.location?.x, game.location?.y));
}

function centerMapOnPoint(point) {
  const rect = els.mapCanvas.getBoundingClientRect();
  mapView.panX = (rect.width || 1) / 2 - point[0] * mapView.zoom;
  mapView.panY = (rect.height || 340) / 2 - point[1] * mapView.zoom;
  clampMapPan();
}

function isPlayerNearViewportEdge(margin = 128) {
  if (!game?.world?.map) return true;
  const rect = els.mapCanvas.getBoundingClientRect();
  const width = rect.width || 1;
  const height = rect.height || 340;
  const [x, y] = mapClientPoint(game.world.map, game.location?.x, game.location?.y);
  const screenX = x * mapView.zoom + mapView.panX;
  const screenY = y * mapView.zoom + mapView.panY;
  return screenX < margin || screenY < margin || screenX > width - margin || screenY > height - margin;
}

function applyMapView() {
  const content = els.mapCanvas.querySelector(".map-content");
  const markerScale = Number((1 / mapView.zoom).toFixed(4));
  if (content) {
    content.style.transform = `translate(${Math.round(mapView.panX)}px, ${Math.round(mapView.panY)}px) scale(${mapView.zoom})`;
  }
  els.mapCanvas.style.setProperty("--marker-scale", markerScale);
  els.mapZoomValue.textContent = `${Math.round(mapView.zoom * 100)}%`;
  els.mapZoomOut.disabled = mapView.zoom <= MAP_ZOOM_MIN;
  els.mapZoomIn.disabled = mapView.zoom >= MAP_ZOOM_MAX;
  scheduleLargeMapRender();
  scheduleLargeMapSpriteRender();
}

function clampMapPan() {
  const rect = els.mapCanvas.getBoundingClientRect();
  const viewportW = rect.width || 1;
  const viewportH = rect.height || 340;
  const content = els.mapCanvas.querySelector(".map-content");
  const contentW = content?.offsetWidth || viewportW;
  const contentH = content?.offsetHeight || viewportH;
  const scaledW = contentW * mapView.zoom;
  const scaledH = contentH * mapView.zoom;
  mapView.panX = scaledW <= viewportW
    ? (viewportW - scaledW) / 2
    : Math.max(viewportW - scaledW, Math.min(0, mapView.panX));
  mapView.panY = scaledH <= viewportH
    ? (viewportH - scaledH) / 2
    : Math.max(viewportH - scaledH, Math.min(0, mapView.panY));
}

function onMapPointerDown(event) {
  if (event.button !== 0) return;
  mapView.dragging = true;
  mapView.moved = false;
  mapView.startX = event.clientX;
  mapView.startY = event.clientY;
  mapView.startPanX = mapView.panX;
  mapView.startPanY = mapView.panY;
  els.mapCanvas.classList.add("dragging");
  els.mapCanvas.setPointerCapture(event.pointerId);
}

function onGameKeyDown(event) {
  if (!game || els.game.hidden) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const tag = event.target?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select" || event.target?.isContentEditable) return;
  const key = event.key.toLowerCase();
  const direction = screenDirectionForKey(key, event.code);
  if (!direction) return;
  event.preventDefault();
  routeToken += 1;
  walkPlayer(direction[0], direction[1]);
}

function screenDirectionForKey(key, code = "") {
  const dir = SCREEN_DIRECTION_KEYS[String(code || "").toLowerCase()] ?? SCREEN_DIRECTION_KEYS[key];
  return directionDelta(dir);
}

function directionDelta(dir) {
  const delta = SA_DIRECTION_DELTAS[normalizeDirection(dir)];
  return delta ? [...delta] : null;
}

function normalizeDirection(dir) {
  const value = Number(dir);
  if (!Number.isFinite(value)) return DEFAULT_PLAYER_DIRECTION;
  return ((Math.trunc(value) % 8) + 8) % 8;
}

async function walkPlayer(dx, dy) {
  if (walkInFlight) return false;
  walkInFlight = true;
  const requestedServerDir = serverDirectionForDelta(dx, dy);
  const before = {
    mapId: game.location.mapId,
    x: game.location.x,
    y: game.location.y
  };
  try {
    game = await api("/api/game/walk", { game, dx, dy });
    const moved = before.mapId !== game.location.mapId || before.x !== game.location.x || before.y !== game.location.y;
    const animDir = clientAnimDirectionFromServerDir(currentServerDirection(requestedServerDir));
    if (moved && before.mapId === game.location.mapId) {
      startPlayerWalkAnimation(animDir, playerTilePoint(before), game.location);
    } else {
      facePlayerDirection(animDir);
    }
    mapView.centerOnNextRender = before.mapId !== game.location.mapId || isPlayerNearViewportEdge();
    save();
    render();
    return moved;
  } finally {
    walkInFlight = false;
  }
}

function startPlayerWalkAnimation(dir, from = game?.location, to = game?.location) {
  setPlayerDirection(dir);
  playerAnimState.startedAt = performance.now();
  playerAnimState.walkUntil = playerAnimState.startedAt + PLAYER_WALK_ANIM_MS;
  playerAnimState.moveUntil = playerAnimState.startedAt + PLAYER_WALK_MOVE_MS;
  playerAnimState.mapId = to?.mapId || game?.location?.mapId || null;
  playerAnimState.fromX = Number(from?.x ?? to?.x ?? 0);
  playerAnimState.fromY = Number(from?.y ?? to?.y ?? 0);
  playerAnimState.toX = Number(to?.x ?? from?.x ?? 0);
  playerAnimState.toY = Number(to?.y ?? from?.y ?? 0);
  invalidatePlayerSpriteRender();
  schedulePlayerAnimTick();
}

function facePlayerDirection(dir) {
  setPlayerDirection(dir);
  playerAnimState.walkUntil = 0;
  playerAnimState.moveUntil = 0;
  playerAnimState.mapId = null;
  invalidatePlayerSpriteRender();
}

function setPlayerDirection(dir) {
  playerAnimState.dir = normalizeDirection(dir);
}

function serverDirectionForDelta(dx, dy) {
  const sx = Math.sign(dx);
  const sy = Math.sign(dy);
  const index = SA_DIRECTION_DELTAS.findIndex(([dirX, dirY]) => dirX === sx && dirY === sy);
  return index >= 0 ? index : currentServerDirection();
}

function currentServerDirection(fallback = DEFAULT_PLAYER_DIRECTION) {
  return normalizeDirection(game?.player?.dir ?? game?.location?.dir ?? fallback);
}

function clientAnimDirectionFromServerDir(dir) {
  // Original client anim_ang uses map.cpp moveAddTbl, offset by +3 from gmsv CHAR_DIR.
  return normalizeDirection(normalizeDirection(dir) + 3);
}

function syncPlayerAnimationDirectionFromGame(force = false) {
  if (!game) return;
  if (!force && performance.now() < playerAnimState.walkUntil) return;
  playerAnimState.dir = clientAnimDirectionFromServerDir(currentServerDirection());
  playerAnimState.mapId = null;
}

function playerTilePoint(fallback = game?.location) {
  const now = performance.now();
  if (game?.location?.mapId && playerAnimState.mapId === game.location.mapId && now < playerAnimState.walkUntil) {
    const span = Math.max(1, playerAnimState.moveUntil - playerAnimState.startedAt);
    const progress = now < playerAnimState.moveUntil
      ? Math.max(0, Math.min(1, (now - playerAnimState.startedAt) / span))
      : 1;
    return {
      x: lerp(playerAnimState.fromX, playerAnimState.toX, progress),
      y: lerp(playerAnimState.fromY, playerAnimState.toY, progress)
    };
  }
  return {
    x: Number(fallback?.x ?? 0),
    y: Number(fallback?.y ?? 0)
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function invalidatePlayerSpriteRender() {
  if (!largeMapRenderer) return;
  scheduleLargeMapSpriteRender();
}

function schedulePlayerAnimTick() {
  if (playerAnimState.raf) return;
  playerAnimState.raf = requestAnimationFrame(() => {
    playerAnimState.raf = 0;
    invalidatePlayerSpriteRender();
    if (performance.now() < playerAnimState.walkUntil) schedulePlayerAnimTick();
  });
}

async function followRouteTo(target, routeData = null) {
  if (!game) return;
  if (routeInFlight) {
    routeToken += 1;
    routeInFlight = false;
    return;
  }
  const token = ++routeToken;
  routeInFlight = true;
  try {
    const data = routeData || await api("/api/game/route", { game, targetX: target.x, targetY: target.y });
    const route = Array.isArray(data.route) ? data.route : [];
    if (!route.length) {
      if (data.blocked) addClientLog("那里无法通行。");
      return !data.blocked;
    }
    for (const step of route) {
      if (token !== routeToken) return false;
      const beforeMap = game.location.mapId;
      const moved = await walkPlayer(step.dx, step.dy);
      if (!moved || game.location.mapId !== beforeMap) return moved;
      await wait(85);
    }
    return true;
  } catch (error) {
    addClientLog(error.message || "无法计算路线。");
    return false;
  } finally {
    routeInFlight = false;
  }
}

async function goToNpc(npcId) {
  const map = game?.world?.map;
  const npc = map?.npcs?.find((item) => item.id === npcId);
  if (!npc) return;
  if (cellDistance(game.location.x, game.location.y, npc.x, npc.y) <= 2) {
    await openDialog(npc.id);
    return;
  }
  let approach;
  try {
    approach = await api("/api/game/route-npc", { game, npcId: npc.id });
    if (approach.blocked || !approach.target) {
      addClientLog(`无法靠近 ${npc.name}。`);
      return;
    }
  } catch (error) {
    addClientLog(error.message || `无法靠近 ${npc.name}。`);
    return;
  }
  const reached = await followRouteTo(approach.target, approach);
  const currentMap = game?.world?.map;
  const stillNear = currentMap?.id === map.id && cellDistance(game.location.x, game.location.y, npc.x, npc.y) <= 2;
  if (reached && stillNear) await openDialog(npc.id);
}

async function goToExit(exitId) {
  const map = game?.world?.map;
  const exit = map?.exits?.find((item) => item.id === exitId);
  if (!exit) return;
  try {
    const approach = await api("/api/game/route-exit", { game, exitId: exit.id });
    if (approach.blocked || !approach.target) {
      addClientLog(`无法到达 ${exit.label}。`);
      return;
    }
    followRouteTo(approach.target, approach);
  } catch (error) {
    addClientLog(error.message || `无法到达 ${exit.label}。`);
  }
}

function cellDistance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax || 0) - Number(bx || 0)), Math.abs(Number(ay || 0) - Number(by || 0)));
}

function mapTileFromPointer(event) {
  if (!game?.world?.map) return null;
  const rect = els.mapCanvas.getBoundingClientRect();
  const contentX = (event.clientX - rect.left - mapView.panX) / mapView.zoom;
  const contentY = (event.clientY - rect.top - mapView.panY) / mapView.zoom;
  const map = game.world.map;
  const canvas = els.mapCanvas.querySelector(".ls2-map");
  const metrics = mapMetrics(map);
  const minX = Number.isFinite(Number(canvas?.dataset?.minX))
    ? Number(canvas.dataset.minX)
    : metrics.minX - metrics.margin;
  const minY = Number.isFinite(Number(canvas?.dataset?.minY))
    ? Number(canvas.dataset.minY)
    : metrics.minY - metrics.margin;
  const screenX = contentX + minX;
  const screenY = contentY + minY;
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  return {
    x: Math.max(0, Math.min(width - 1, Math.round((screenX / 32 - screenY / 24) / 2))),
    y: Math.max(0, Math.min(height - 1, Math.round((screenX / 32 + screenY / 24) / 2)))
  };
}

function onMapPointerMove(event) {
  if (!mapView.dragging) return;
  const dx = event.clientX - mapView.startX;
  const dy = event.clientY - mapView.startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) mapView.moved = true;
  mapView.panX = mapView.startPanX + dx;
  mapView.panY = mapView.startPanY + dy;
  clampMapPan();
  applyMapView();
}

function onMapPointerUp(event) {
  if (!mapView.dragging) return;
  mapView.dragging = false;
  els.mapCanvas.classList.remove("dragging");
  if (els.mapCanvas.hasPointerCapture(event.pointerId)) {
    els.mapCanvas.releasePointerCapture(event.pointerId);
  }
  setTimeout(() => {
    mapView.moved = false;
  }, 0);
}

async function renderLs2Map(map, renderVersion) {
  if (!map.clientMapFile && !map.mapFile) return;
  const canvas = els.mapCanvas.querySelector(".ls2-map");
  if (!canvas) return;
  const mapUrl = map.clientMapFile || map.mapFile;
  const rsp = await fetch(mapUrl);
  if (!rsp.ok) throw new Error("map file missing");
  const buf = await rsp.arrayBuffer();
  if (renderVersion !== mapRenderVersion) return;
  if (mapUrl === map.clientMapFile) {
    await renderClientDatMap(canvas, buf, map, renderVersion);
    return;
  }
  await renderLs2MapBuffer(canvas, buf, map, renderVersion);
}

async function renderClientDatMap(canvas, buf, map, renderVersion) {
  const view = new DataView(buf);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const layerSize = width * height * 2;
  const expected = 8 + layerSize * 3;
  if (!width || !height || buf.byteLength < expected) throw new Error("invalid client map");
  const tileAt = (index) => {
    const tileOffset = 8 + index * 2;
    const partsOffset = 8 + layerSize + index * 2;
    const eventOffset = 8 + layerSize * 2 + index * 2;
    return [
      view.getUint16(tileOffset, true),
      view.getUint16(partsOffset, true),
      view.getUint16(eventOffset, true)
    ];
  };
  const atlas = await loadTileAtlas();
  if (renderVersion !== mapRenderVersion) return;
  if (atlas) {
    drawViewportTileMap(canvas, width, height, tileAt, atlas, map, "client DAT viewport", renderVersion);
    return;
  }
  if (width * height > REAL_TILE_CELL_LIMIT) {
    drawLargeIsoPreview(canvas, width, height, tileAt, map, "client DAT overview");
    return;
  }
  drawTilePreview(canvas, width, height, tileAt);
}

async function loadTileAtlas() {
  if (!tileAtlasPromise) {
    tileAtlasPromise = (async () => {
      const rsp = await fetch(TILE_ATLAS_MANIFEST);
      if (!rsp.ok) return null;
      const manifest = await rsp.json();
      const image = new Image();
      image.decoding = "async";
      image.src = manifest.image;
      await image.decode();
      loadedTileAtlas = { ...manifest, image };
      hydrateAtlasSprites(loadedTileAtlas);
      return loadedTileAtlas;
    })().catch(() => null);
  }
  return tileAtlasPromise;
}

function hydrateAtlasSprites(atlas = loadedTileAtlas) {
  if (!atlas) return;
  document.querySelectorAll("[data-atlas-sprite]").forEach((el) => {
    applyAtlasSprite(el, atlas, el.dataset.atlasSprite);
  });
  refreshAtlasButtonSprites(atlas);
}

function refreshAtlasButtonSprites(atlas = loadedTileAtlas) {
  if (!atlas) return;
  document.querySelectorAll("[data-atlas-off]").forEach((btn) => {
    const tileId = btn.classList.contains("active") && btn.dataset.atlasOn
      ? btn.dataset.atlasOn
      : btn.dataset.atlasOff;
    let sprite = [...btn.children].find((child) => child.classList.contains("client-atlas-sprite"));
    if (!sprite) {
      sprite = document.createElement("span");
      sprite.className = "client-atlas-sprite";
      sprite.setAttribute("aria-hidden", "true");
      btn.prepend(sprite);
    }
    const frame = applyAtlasSprite(sprite, atlas, tileId);
    if (frame) {
      btn.style.width = `${frame.width}px`;
      btn.style.height = `${frame.height}px`;
    }
  });
}

function applyAtlasSprite(el, atlas, tileId) {
  const frame = atlas?.frames?.[tileId];
  if (!frame) {
    el.hidden = true;
    return null;
  }
  el.hidden = false;
  el.style.width = `${frame.width}px`;
  el.style.height = `${frame.height}px`;
  el.style.backgroundImage = `url("${atlas.image.src}")`;
  el.style.backgroundSize = `${atlas.atlasWidth}px ${atlas.atlasHeight}px`;
  el.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
  return frame;
}

function drawRealTileMap(canvas, width, height, tileAt, atlas, map = null) {
  const halfW = 32;
  const halfH = 24;
  const bounds = mapPixelBounds(width, height, tileAt, atlas, halfW, halfH);
  canvas.width = Math.max(1, Math.ceil(bounds.maxX - bounds.minX));
  canvas.height = Math.max(1, Math.ceil(bounds.maxY - bounds.minY));
  canvas.dataset.minX = String(bounds.minX);
  canvas.dataset.minY = String(bounds.minY);
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  const content = canvas.closest(".map-content");
  if (content) {
    content.classList.add("has-real-map");
    content.style.width = `${canvas.width}px`;
    content.style.height = `${canvas.height}px`;
  }
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = MAP_BACKDROP_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const sprites = [];
  let order = 0;
  for (const { x, y } of clientMapDisplayOrder(width, height)) {
    const [ground, object] = tileAt(y * width + x);
    const [mapX, mapY] = mapRenderPoint(x, y, width, height);
    const [screenX, screenY] = isoPoint(mapX, mapY, halfW, halfH);
    const px = screenX - bounds.minX;
    const py = screenY - bounds.minY;
    if (ground > CG_INVISIBLE) drawAtlasTile(ctx, atlas, ground, px, py);
    if (object > CG_INVISIBLE && atlas.frames?.[object]) {
      sprites.push(mapDepthSprite(atlas, object, px, py, screenX, screenY, x, y, "part", order++));
    }
  }
  sprites.push(...collectNpcSprites(map, atlas, (npc, index) => {
    const [mapX, mapY] = mapRenderPoint(npc.x, npc.y, width, height);
    const [screenX, screenY] = isoPoint(mapX, mapY, halfW, halfH);
    return mapDepthSprite(
      atlas,
      npc.graphicId,
      screenX - bounds.minX,
      screenY - bounds.minY,
      screenX,
      screenY,
      npc.x,
      npc.y,
      "char",
      order + index
    );
  }));
  sprites.push(...collectPlayerSprites(map, atlas, (tileId) => {
    const playerPoint = playerTilePoint();
    const [mapX, mapY] = mapRenderPoint(playerPoint.x, playerPoint.y, width, height);
    const [screenX, screenY] = isoPoint(mapX, mapY, halfW, halfH);
    return mapDepthSprite(
      atlas,
      tileId,
      screenX - bounds.minX,
      screenY - bounds.minY,
      screenX,
      screenY,
      playerPoint.x,
      playerPoint.y,
      "char",
      order + 10000
    );
  }));
  drawDepthSprites(ctx, atlas, sprites);
  els.mapCanvas.dataset.mapSize = `${width} x ${height} | client drawMap + real atlas`;
  syncMapMarkers(game.world.map);
  centerMapOnPlayer();
  clampMapPan();
  applyMapView();
}

function collectNpcSprites(map, atlas, locate) {
  if (!map?.npcs?.length) return [];
  return map.npcs
    .map((npc) => ({ ...npc, graphicId: Number(npc.graphic) || 0 }))
    .filter((npc) => npc.graphicId > CG_INVISIBLE && atlas.frames?.[npc.graphicId])
    .map((npc, index) => locate(npc, index));
}

function collectPlayerSprites(map, atlas, locate) {
  if (!map || !game?.location) return [];
  const tileId = playerFrameTileId(atlas);
  if (tileId <= CG_INVISIBLE || !isUsablePlayerFrame(tileId, atlas.frames?.[tileId])) return [];
  return [locate(tileId)];
}

function playerFrameTileId(atlas = loadedTileAtlas) {
  const now = performance.now();
  const moving = now < playerAnimState.walkUntil;
  const frames = (moving ? PLAYER_WALK_FRAMES : PLAYER_STAND_FRAMES)[playerAnimState.dir]
    || PLAYER_STAND_FRAMES[DEFAULT_PLAYER_DIRECTION];
  const frameIndex = moving ? Math.floor((now - playerAnimState.startedAt) / PLAYER_WALK_FRAME_MS) % frames.length : 0;
  return firstAvailablePlayerFrame(frames.slice(frameIndex).concat(frames.slice(0, frameIndex)), atlas)
    || firstAvailablePlayerFrame(PLAYER_STAND_FRAMES[DEFAULT_PLAYER_DIRECTION], atlas)
    || DEFAULT_PLAYER_FRAME;
}

function firstAvailablePlayerFrame(frames, atlas) {
  if (!Array.isArray(frames)) return null;
  if (!atlas) return frames[0] || null;
  return frames.find((id) => isUsablePlayerFrame(id, atlas.frames?.[id])) || null;
}

function isUsablePlayerFrame(tileId, frame) {
  if (!frame || !PLAYER_FRAME_IDS.has(Number(tileId))) return false;
  if (Number(frame.bitmapNo) !== Number(tileId) || Number(frame.graphicNo || 0) !== 0) return false;
  return frame.width >= 24 && frame.width <= 96 && frame.height >= 45 && frame.height <= 96;
}

function mapDepthSprite(atlas, tileId, x, y, screenX, screenY, gridX, gridY, type, order) {
  const frame = atlas.frames?.[tileId] || {};
  const left = x + Number(frame.xoffset || 0);
  const top = y + Number(frame.yoffset || 0);
  const width = Number(frame.width || 0);
  const height = Number(frame.height || 0);
  return {
    tileId,
    type,
    x,
    y,
    screenX,
    screenY,
    mapX: (Number(gridX) || 0) * MAP_GRID_SIZE,
    mapY: (Number(gridY) || 0) * MAP_GRID_SIZE,
    depth: screenY,
    order,
    left,
    top,
    right: left + width,
    bottom: top + height,
    hit: Number(frame.hit || 0),
    prioType: Number(frame.prioType || 0),
    hitX: Number(frame.hitX || 1),
    hitY: Number(frame.hitY || 1)
  };
}

function spritesOverlap(a, b, margin = 0) {
  return a.left - margin < b.right
    && a.right + margin > b.left
    && a.top - margin < b.bottom
    && a.bottom + margin > b.top;
}

function drawDepthSprites(ctx, atlas, sprites) {
  sprites
    .sort(compareDepthSprites)
    .forEach((entry) => drawAtlasTile(ctx, atlas, entry.tileId, entry.x, entry.y));
}

function compareDepthSprites(a, b) {
  if (a.type === "part" && b.type === "char") {
    return partCoversChar(b, a) ? 1 : -1;
  }
  if (a.type === "char" && b.type === "part") {
    return partCoversChar(a, b) ? -1 : 1;
  }
  return a.depth - b.depth || a.order - b.order;
}

function partCoversChar(char, part) {
  if (part.hit !== 0 && part.prioType === 3) return false;
  if (part.prioType === 1) return !(char.mapX <= part.mapX || char.mapY >= part.mapY);
  if (char.mapX > part.mapX && char.mapY < part.mapY) return true;
  const hitX = Math.max(1, part.hitX || 1);
  const hitY = Math.max(1, part.hitY || 1);
  if (char.screenX > part.screenX) {
    if (part.screenY - (hitX - 1) * TILE_HALF_H <= char.screenY) return false;
  } else if (char.screenX < part.screenX) {
    if (part.screenY - (hitY - 1) * TILE_HALF_H <= char.screenY) return false;
  } else if (part.screenY <= char.screenY) {
    return false;
  }
  return true;
}

function clientMapDrawOrder(width, height) {
  const cells = [];
  let ti = height - 1;
  let tj = 0;
  while (ti >= 0) {
    let y = ti;
    let x = tj;
    while (y >= 0 && x >= 0) {
      cells.push({ x, y });
      y -= 1;
      x -= 1;
    }
    if (tj < width - 1) tj += 1;
    else ti -= 1;
  }
  return cells;
}

function clientMapDisplayOrder(width, height) {
  return clientMapDrawOrder(width, height).reverse();
}

function mapRenderPoint(x, y, width, height) {
  return [x, y];
}

function isoPoint(x, y, halfW, halfH) {
  return [(x + y) * halfW, (y - x) * halfH];
}

function mapMetrics(map) {
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const margin = 192;
  const points = [
    mapRenderPoint(0, 0, width, height),
    mapRenderPoint(width - 1, 0, width, height),
    mapRenderPoint(0, height - 1, width, height),
    mapRenderPoint(width - 1, height - 1, width, height)
  ].map(([x, y]) => isoPoint(x, y, 32, 24));
  const minX = Math.min(...points.map((point) => point[0]));
  const maxX = Math.max(...points.map((point) => point[0]));
  const minY = Math.min(...points.map((point) => point[1]));
  const maxY = Math.max(...points.map((point) => point[1]));
  return {
    minX,
    minY,
    margin,
    width: maxX - minX + margin * 2,
    height: maxY - minY + margin * 2
  };
}

function mapWorldPoint(map, x, y) {
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const metrics = mapMetrics(map);
  const [mapX, mapY] = mapRenderPoint(
    Math.max(0, Math.min(width - 1, Number(x) || 0)),
    Math.max(0, Math.min(height - 1, Number(y) || 0)),
    width,
    height
  );
  const [screenX, screenY] = isoPoint(mapX, mapY, 32, 24);
  return [
    screenX - metrics.minX + metrics.margin,
    screenY - metrics.minY + metrics.margin
  ];
}

function mapClientPoint(map, x, y) {
  const canvas = els.mapCanvas.querySelector(".ls2-map");
  if (!canvas?.width || !canvas?.height) return mapWorldPoint(map, x, y);
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  const [mapX, mapY] = mapRenderPoint(
    Math.max(0, Math.min(width - 1, Number(x) || 0)),
    Math.max(0, Math.min(height - 1, Number(y) || 0)),
    width,
    height
  );
  const [screenX, screenY] = isoPoint(mapX, mapY, 32, 24);
  return [screenX - Number(canvas.dataset.minX || 0), screenY - Number(canvas.dataset.minY || 0)];
}

function syncMapMarkers(map) {
  const pairs = [
    [els.mapCanvas.querySelector(".map-marker.player"), mapClientPoint(map, game.location?.x, game.location?.y)],
    ...map.npcs.map((npc) => [els.mapCanvas.querySelector(`[data-npc="${cssEscape(npc.id)}"]`), mapClientPoint(map, npc.x, npc.y)]),
    ...map.exits.map((exit) => [els.mapCanvas.querySelector(`[data-exit="${cssEscape(exit.id)}"]`), mapClientPoint(map, exit.x, exit.y)])
  ];
  for (const [el, point] of pairs) {
    if (!el) continue;
    el.style.left = `${Math.round(point[0])}px`;
    el.style.top = `${Math.round(point[1])}px`;
  }
  const player = els.mapCanvas.querySelector(".map-marker.player");
  if (player) {
    player.title = game.player.name;
    const label = player.querySelector("span");
    if (label) label.textContent = game.player.name;
  }
}

function mapPixelBounds(width, height, tileAt, atlas, halfW, halfH) {
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [ground, object] = tileAt(y * width + x);
      const [mapX, mapY] = mapRenderPoint(x, y, width, height);
      const [px, py] = isoPoint(mapX, mapY, halfW, halfH);
      if (ground > CG_INVISIBLE) includeTileBounds(bounds, atlas.frames?.[ground], px, py);
      if (object > CG_INVISIBLE) includeTileBounds(bounds, atlas.frames?.[object], px, py);
    }
  }
  if (!Number.isFinite(bounds.minX)) return { minX: 0, minY: 0, maxX: width * 64, maxY: height * 48 };
  bounds.minX -= 8;
  bounds.minY -= 8;
  bounds.maxX += 8;
  bounds.maxY += 8;
  return bounds;
}

function includeTileBounds(bounds, frame, x, y) {
  if (!frame) return;
  const left = x + frame.xoffset;
  const top = y + frame.yoffset;
  bounds.minX = Math.min(bounds.minX, left);
  bounds.minY = Math.min(bounds.minY, top);
  bounds.maxX = Math.max(bounds.maxX, left + frame.width);
  bounds.maxY = Math.max(bounds.maxY, top + frame.height);
}

function drawAtlasTile(ctx, atlas, tileId, x, y) {
  const frame = atlas.frames?.[tileId];
  if (!frame) return;
  const dx = Math.round(x + frame.xoffset);
  const dy = Math.round(y + frame.yoffset);
  ctx.save();
  ctx.translate(dx, dy + frame.height);
  ctx.scale(1, -1);
  ctx.drawImage(
    atlas.image,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    0,
    0,
    frame.width,
    frame.height
  );
  ctx.restore();
}

async function renderLs2MapBuffer(canvas, buf, map = null, renderVersion = mapRenderVersion) {
  const view = new DataView(buf);
  const magic = String.fromCharCode(...new Uint8Array(buf.slice(0, 6)));
  if (magic !== "LS2MAP") throw new Error("invalid LS2MAP");
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
  const tileAt = (index) => {
    const tileOffset = 44 + index * 2;
    const objectOffset = 44 + width * height * 2 + index * 2;
    return [
      view.getUint16(tileOffset, false),
      objectOffset + 1 < view.byteLength ? view.getUint16(objectOffset, false) : 0,
      0
    ];
  };
  const atlas = await loadTileAtlas();
  if (renderVersion !== mapRenderVersion) return;
  if (atlas) {
    drawViewportTileMap(canvas, width, height, tileAt, atlas, map, "LS2MAP viewport", renderVersion);
    return;
  }
  if (width * height > REAL_TILE_CELL_LIMIT) {
    drawLargeIsoPreview(canvas, width, height, tileAt, map, "LS2MAP overview");
    return;
  }
  drawTilePreview(canvas, width, height, tileAt);
}

function drawViewportTileMap(canvas, width, height, tileAt, atlas, map, sourceLabel, renderVersion) {
  const metrics = mapMetrics(map || { size: [width, height] });
  const fullWidth = Math.max(1, Math.ceil(metrics.width));
  const fullHeight = Math.max(1, Math.ceil(metrics.height));
  const minX = metrics.minX - metrics.margin;
  const minY = metrics.minY - metrics.margin;
  canvas.classList.add("viewport-tile-map");
  canvas.dataset.minX = String(minX);
  canvas.dataset.minY = String(minY);
  canvas.style.width = "1px";
  canvas.style.height = "1px";
  const content = canvas.closest(".map-content");
  const spriteCanvas = content?.querySelector(".ls2-sprites") || null;
  if (content) {
    content.classList.add("has-real-map");
    content.style.width = `${fullWidth}px`;
    content.style.height = `${fullHeight}px`;
  }
  largeMapRenderer = {
    renderVersion,
    canvas,
    width,
    height,
    fullWidth,
    fullHeight,
    minX,
    minY,
    tileAt,
    atlas,
    map: map || game.world.map,
    raf: 0,
    spriteCanvas,
    spriteRaf: 0,
    lastKey: ""
  };
  els.mapCanvas.dataset.mapSize = `${width} x ${height} | ${sourceLabel} | real viewport`;
  syncMapMarkers(largeMapRenderer.map);
  centerMapOnPlayer();
  clampMapPan();
  applyMapView();
}

function resetLargeMapRenderer() {
  if (largeMapRenderer?.raf) cancelAnimationFrame(largeMapRenderer.raf);
  if (largeMapRenderer?.spriteRaf) cancelAnimationFrame(largeMapRenderer.spriteRaf);
  largeMapRenderer = null;
}

function scheduleLargeMapRender() {
  if (!largeMapRenderer || largeMapRenderer.renderVersion !== mapRenderVersion) return;
  if (!largeMapRenderer.canvas?.isConnected) return;
  if (largeMapRenderer.raf) return;
  largeMapRenderer.raf = requestAnimationFrame(() => {
    const renderer = largeMapRenderer;
    if (!renderer) return;
    renderer.raf = 0;
    renderLargeMapViewport(renderer);
  });
}

function scheduleLargeMapSpriteRender() {
  if (!largeMapRenderer || largeMapRenderer.renderVersion !== mapRenderVersion) return;
  if (!largeMapRenderer.spriteCanvas?.isConnected) return;
  if (largeMapRenderer.spriteRaf) return;
  largeMapRenderer.spriteRaf = requestAnimationFrame(() => {
    const renderer = largeMapRenderer;
    if (!renderer) return;
    renderer.spriteRaf = 0;
    renderLargeMapSprites(renderer);
  });
}

function largeMapViewportState(renderer) {
  const viewport = els.mapCanvas.getBoundingClientRect();
  const zoom = Math.max(0.1, mapView.zoom || 1);
  const viewportW = Math.max(1, Math.ceil(viewport.width || 1));
  const viewportH = Math.max(1, Math.ceil(viewport.height || 340));
  const pad = LARGE_MAP_VIEW_PADDING / zoom + 96;
  const left = Math.max(0, Math.floor((-mapView.panX / zoom) - pad));
  const top = Math.max(0, Math.floor((-mapView.panY / zoom) - pad));
  const right = Math.min(renderer.fullWidth, Math.ceil(((viewportW - mapView.panX) / zoom) + pad));
  const bottom = Math.min(renderer.fullHeight, Math.ceil(((viewportH - mapView.panY) / zoom) + pad));
  const cssW = Math.max(1, right - left);
  const cssH = Math.max(1, bottom - top);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const pixelScale = Math.max(0.35, Math.min(zoom * dpr, LARGE_MAP_CANVAS_MAX_SIDE / cssW, LARGE_MAP_CANVAS_MAX_SIDE / cssH));
  const pixelW = Math.max(1, Math.ceil(cssW * pixelScale));
  const pixelH = Math.max(1, Math.ceil(cssH * pixelScale));
  return {
    left,
    top,
    right,
    bottom,
    cssW,
    cssH,
    pixelScale,
    pixelW,
    pixelH,
    key: [
      left,
      top,
      right,
      bottom,
      pixelW,
      pixelH,
      renderer.width,
      renderer.height
    ].join(":")
  };
}

function renderLargeMapViewport(renderer) {
  if (renderer !== largeMapRenderer || renderer.renderVersion !== mapRenderVersion) return;
  const state = largeMapViewportState(renderer);
  if (state.key === renderer.lastKey) return;
  renderer.lastKey = state.key;
  renderer.viewportState = state;
  configureViewportCanvas(renderer.canvas, state);
  if (renderer.spriteCanvas) configureViewportCanvas(renderer.spriteCanvas, state);
  const ctx = renderer.canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;
  resetViewportContext(ctx, state);
  ctx.fillStyle = MAP_BACKDROP_COLOR;
  ctx.fillRect(0, 0, state.pixelW, state.pixelH);
  setViewportWorldTransform(ctx, state);
  drawViewportBaseTiles(ctx, renderer, state);
  renderLargeMapSprites(renderer, state);
}

function configureViewportCanvas(canvas, state) {
  if (!canvas) return;
  canvas.width = state.pixelW;
  canvas.height = state.pixelH;
  canvas.style.left = `${state.left}px`;
  canvas.style.top = `${state.top}px`;
  canvas.style.width = `${state.cssW}px`;
  canvas.style.height = `${state.cssH}px`;
}

function resetViewportContext(ctx, state) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, state.pixelW, state.pixelH);
}

function setViewportWorldTransform(ctx, state) {
  ctx.setTransform(
    state.pixelScale,
    0,
    0,
    state.pixelScale,
    -state.left * state.pixelScale,
    -state.top * state.pixelScale
  );
}

function viewportTileBounds(renderer, state) {
  const corners = [
    contentToTilePoint(renderer, state.left, state.top),
    contentToTilePoint(renderer, state.right, state.top),
    contentToTilePoint(renderer, state.left, state.bottom),
    contentToTilePoint(renderer, state.right, state.bottom)
  ];
  return {
    x1: Math.max(0, Math.floor(Math.min(...corners.map((point) => point[0]))) - LARGE_MAP_TILE_PADDING),
    y1: Math.max(0, Math.floor(Math.min(...corners.map((point) => point[1]))) - LARGE_MAP_TILE_PADDING),
    x2: Math.min(renderer.width - 1, Math.ceil(Math.max(...corners.map((point) => point[0]))) + LARGE_MAP_TILE_PADDING),
    y2: Math.min(renderer.height - 1, Math.ceil(Math.max(...corners.map((point) => point[1]))) + LARGE_MAP_TILE_PADDING)
  };
}

function drawViewportBaseTiles(ctx, renderer, state) {
  const { x1, y1, x2, y2 } = viewportTileBounds(renderer, state);
  forEachClientDisplayTile(x1, y1, x2, y2, (x, y) => {
    const [ground, object] = renderer.tileAt(y * renderer.width + x);
    const [screenX, screenY] = mapTileContentPoint(renderer, x, y);
    if (ground > CG_INVISIBLE) drawAtlasTile(ctx, renderer.atlas, ground, screenX, screenY);
    if (object > CG_INVISIBLE && renderer.atlas.frames?.[object]) {
      drawAtlasTile(ctx, renderer.atlas, object, screenX, screenY);
    }
  });
}

function renderLargeMapSprites(renderer, state = largeMapViewportState(renderer)) {
  if (renderer !== largeMapRenderer || renderer.renderVersion !== mapRenderVersion) return;
  if (!renderer.spriteCanvas?.isConnected) return;
  if (state.key !== renderer.lastKey) {
    renderLargeMapViewport(renderer);
    return;
  }
  configureViewportCanvas(renderer.spriteCanvas, state);
  const ctx = renderer.spriteCanvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;
  resetViewportContext(ctx, state);
  setViewportWorldTransform(ctx, state);
  drawViewportDynamicSprites(ctx, renderer, state);
}

function drawViewportDynamicSprites(ctx, renderer, state) {
  const { x1, y1, x2, y2 } = viewportTileBounds(renderer, state);
  let order = 0;
  const charSprites = collectViewportCharSprites(renderer, order);
  order += charSprites.length;
  const sprites = [...charSprites];
  forEachClientDisplayTile(x1, y1, x2, y2, (x, y) => {
    const [, object] = renderer.tileAt(y * renderer.width + x);
    const [screenX, screenY] = mapTileContentPoint(renderer, x, y);
    if (object > CG_INVISIBLE && renderer.atlas.frames?.[object]) {
      const part = mapDepthSprite(
        renderer.atlas,
        object,
        screenX,
        screenY,
        screenX + renderer.minX,
        screenY + renderer.minY,
        x,
        y,
        "part",
        order++
      );
      if (charSprites.some((char) => spritesOverlap(part, char, 10) && partCoversChar(char, part))) sprites.push(part);
    }
  });
  drawDepthSprites(ctx, renderer.atlas, sprites);
}

function collectViewportCharSprites(renderer, order = 0) {
  const sprites = [];
  sprites.push(...collectNpcSprites(renderer.map, renderer.atlas, (npc, index) => {
    const [x, y] = mapTileContentPoint(renderer, npc.x, npc.y);
    return mapDepthSprite(
      renderer.atlas,
      npc.graphicId,
      x,
      y,
      x + renderer.minX,
      y + renderer.minY,
      npc.x,
      npc.y,
      "char",
      order + index
    );
  }));
  sprites.push(...collectPlayerSprites(renderer.map, renderer.atlas, (tileId) => {
    const playerPoint = playerTilePoint();
    const [x, y] = mapTileContentPoint(renderer, playerPoint.x, playerPoint.y);
    return mapDepthSprite(
      renderer.atlas,
      tileId,
      x,
      y,
      x + renderer.minX,
      y + renderer.minY,
      playerPoint.x,
      playerPoint.y,
      "char",
      order + sprites.length + 10000
    );
  }));
  return sprites;
}

function forEachClientDrawTile(x1, y1, x2, y2, callback) {
  for (let diff = x1 - y2; diff <= x2 - y1; diff += 1) {
    const yStart = Math.min(y2, x2 - diff);
    const yEnd = Math.max(y1, x1 - diff);
    for (let y = yStart; y >= yEnd; y -= 1) {
      const x = diff + y;
      callback(x, y);
    }
  }
}

function forEachClientDisplayTile(x1, y1, x2, y2, callback) {
  const cells = [];
  forEachClientDrawTile(x1, y1, x2, y2, (x, y) => cells.push([x, y]));
  for (let i = cells.length - 1; i >= 0; i -= 1) callback(cells[i][0], cells[i][1]);
}

function mapTileContentPoint(renderer, x, y) {
  const [mapX, mapY] = mapRenderPoint(x, y, renderer.width, renderer.height);
  const [screenX, screenY] = isoPoint(mapX, mapY, 32, 24);
  return [screenX - renderer.minX, screenY - renderer.minY];
}

function contentToTilePoint(renderer, contentX, contentY) {
  const screenX = contentX + renderer.minX;
  const screenY = contentY + renderer.minY;
  return [
    (screenX / 32 - screenY / 24) / 2,
    (screenX / 32 + screenY / 24) / 2
  ];
}

function drawLargeIsoPreview(canvas, width, height, tileAt, map, sourceLabel) {
  const metrics = mapMetrics(map || { size: [width, height] });
  const fullWidth = Math.max(1, Math.ceil(metrics.width));
  const fullHeight = Math.max(1, Math.ceil(metrics.height));
  const scale = Math.min(1, LARGE_MAP_CANVAS_MAX_SIDE / Math.max(fullWidth, fullHeight));
  canvas.width = Math.max(1, Math.ceil(fullWidth * scale));
  canvas.height = Math.max(1, Math.ceil(fullHeight * scale));
  canvas.dataset.minX = String(metrics.minX - metrics.margin);
  canvas.dataset.minY = String(metrics.minY - metrics.margin);
  canvas.style.width = `${fullWidth}px`;
  canvas.style.height = `${fullHeight}px`;
  const content = canvas.closest(".map-content");
  if (content) {
    content.style.width = `${fullWidth}px`;
    content.style.height = `${fullHeight}px`;
  }
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.imageSmoothingEnabled = false;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = "#2a433d";
  ctx.fillRect(0, 0, fullWidth, fullHeight);
  const step = Math.max(1, Math.ceil(Math.max(width, height) / 280));
  const minX = metrics.minX - metrics.margin;
  const minY = metrics.minY - metrics.margin;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const [ground, object, overlay] = tileAt(y * width + x);
      const [screenX, screenY] = isoPoint(x, y, 32, 24);
      drawIsoSample(
        ctx,
        screenX - minX,
        screenY - minY,
        step,
        tileColor(ground > CG_INVISIBLE ? ground : 0, object > CG_INVISIBLE ? object : 0, overlay)
      );
    }
  }
  els.mapCanvas.dataset.mapSize = `${width} x ${height} | ${sourceLabel} | sampled ${step}x`;
  syncMapMarkers(game.world.map);
  centerMapOnPlayer();
  clampMapPan();
  applyMapView();
}

function drawIsoSample(ctx, x, y, step, color) {
  const halfW = Math.max(2, 32 * step);
  const halfH = Math.max(2, 24 * step);
  ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  ctx.beginPath();
  ctx.moveTo(x, y - halfH);
  ctx.lineTo(x + halfW, y);
  ctx.lineTo(x, y + halfH);
  ctx.lineTo(x - halfW, y);
  ctx.closePath();
  ctx.fill();
}

function drawTilePreview(canvas, width, height, tileAt) {
  const maxSide = 640;
  const scale = Math.max(1, Math.ceil(Math.max(width, height) / maxSide));
  const outW = Math.ceil(width / scale);
  const outH = Math.ceil(height / scale);
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d", { alpha: false });
  const img = ctx.createImageData(outW, outH);
  for (let y = 0; y < outH; y += 1) {
    for (let x = 0; x < outW; x += 1) {
      const sx = Math.min(width - 1, x * scale);
      const sy = Math.min(height - 1, y * scale);
      const index = sy * width + sx;
      const [ground, object, overlay] = tileAt(index);
      const color = tileColor(ground > CG_INVISIBLE ? ground : 0, object > CG_INVISIBLE ? object : 0, overlay);
      const i = (y * outW + x) * 4;
      img.data[i] = color[0];
      img.data[i + 1] = color[1];
      img.data[i + 2] = color[2];
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  els.mapCanvas.dataset.mapSize = `${width} x ${height}`;
}

function tileColor(ground, object, overlay = 0) {
  if (ground === 0 && object === 0 && overlay === 0) return [42, 67, 61];
  if (overlay > 0 && overlay < 1000) return [56, 70, 65];
  if (object > 0 && object < 1000) return [66, 83, 77];
  const seed = (overlay || object || ground) >>> 0;
  const hue = seed % 360;
  const band = seed % 7;
  if (band === 0) return hslToRgb(hue, 28, 42);
  if (band === 1) return hslToRgb(42, 34, 62);
  if (band === 2) return hslToRgb(92, 28, 48);
  if (band === 3) return hslToRgb(128, 26, 42);
  if (band === 4) return hslToRgb(205, 28, 48);
  if (band === 5) return hslToRgb(24, 28, 50);
  return hslToRgb(hue, 22, 54);
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
}

function mapLayout(map) {
  return {
    primary: map.name,
    primaryHint: `floor ${map.floorId} | ${map.size?.[0] || "?"}x${map.size?.[1] || "?"}`,
    player: worldPoint(map, game.location?.x, game.location?.y),
    npcs: map.npcs.map((npc) => worldPoint(map, npc.x, npc.y)),
    exits: map.exits.map((exit) => worldPoint(map, exit.x, exit.y))
  };
}

function worldPoint(map, x, y) {
  return mapWorldPoint(map, x, y);
}

function renderNpc(map) {
  els.npcList.innerHTML = map.npcs.map((npc) => `
    <button class="list-btn" type="button" data-npc="${npc.id}">
      <strong>${escapeHtml(npc.name)}</strong>
      <span>${escapeHtml(npc.type)}${npc.trade ? " | 可交易" : ""} | (${npc.x}, ${npc.y})</span>
    </button>
  `).join("") || `<p class="empty">当前地图没有 NPC。</p>`;
}

function onNpcListClick(event) {
  const btn = event.target.closest("[data-npc]");
  if (btn && els.npcList.contains(btn)) goToNpc(btn.dataset.npc);
}

async function openDialog(npcId) {
  if (!game) return;
  try {
    game = await api("/api/game/dialog", { game, npcId });
    clientWindowOpen = false;
    save();
    render();
    els.dialogInput.focus();
  } catch (error) {
    addClientLog(error.message || "无法打开 NPC 对话。");
  }
}

async function sendDialog(message) {
  if (!game?.dialog?.npcId) return;
  const npcId = game.dialog.npcId;
  els.dialogInput.value = "";
  try {
    game = await api("/api/game/dialog", { game, npcId, message });
    save();
    render();
    els.dialogInput.focus();
  } catch (error) {
    appendDialogSystem(error.message || "NPC 没有回应。");
    els.dialogInput.focus();
  }
}

function renderDialog() {
  const dialog = game?.dialog;
  if (dialog?.open) clientWindowOpen = false;
  els.dialogPanel.hidden = !dialog?.open;
  if (!dialog?.open) return;
  els.dialogNpcName.textContent = dialog.npcName || "NPC";
  els.dialogSource.textContent = dialogDebugLine(dialog);
  els.dialogMessages.innerHTML = (dialog.messages || []).map((message) => `
    <p class="dialog-bubble ${message.speaker === "player" ? "player" : message.speaker === "system" ? "system" : "npc"}">
      <span>${escapeHtml(dialogSpeaker(message.speaker, dialog))}</span>
      ${escapeHtml(message.text)}
    </p>
  `).join("");
  const battle = renderDialogBattle();
  const shop = renderDialogShop(dialog);
  els.dialogSuggestions.innerHTML = battle + (dialog.suggestions || ["任务", "地图", "交易"]).map((item) => `
    <button class="ghost-btn" type="button" data-say="${escapeHtml(item)}">${escapeHtml(item)}</button>
  `).join("") + shop;
  els.dialogSuggestions.querySelectorAll("[data-say]").forEach((btn) => {
    btn.addEventListener("click", () => sendDialog(btn.dataset.say));
  });
  els.dialogSuggestions.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => buyItem(Number(btn.dataset.buy)));
  });
  els.dialogSuggestions.querySelectorAll("[data-battle-img]").forEach((img) => {
    const fallback = () => {
      if (img.dataset.fallback === "1") return;
      img.dataset.fallback = "1";
      img.src = "/f/logo.gif";
    };
    img.addEventListener("error", fallback);
    if (img.complete && img.naturalWidth === 0) fallback();
  });
  els.dialogMessages.scrollTop = els.dialogMessages.scrollHeight;
}

function renderDialogBattle() {
  const enemy = game?.encounter;
  if (!enemy) return "";
  const activePet = game.pets?.[0] || null;
  const enemyMax = Math.max(1, Number(enemy.WorkMaxHp || enemy.Hp || 1));
  const enemyHp = Math.max(0, Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : enemyMax);
  const petMax = activePet ? Math.max(1, Number(activePet.WorkMaxHp || activePet.Hp || 1)) : 1;
  const petHp = activePet ? Math.max(0, Number(activePet.Hp || petMax)) : 0;
  const battleLog = (game.battle?.log || []).slice(-4);
  return `
    <div class="battle-box">
      <div class="battle-target">
        <img data-battle-img src="/f/pet/${Number(enemy.ImgNo || 0)}.gif" alt="${escapeHtml(enemy.Name || "遇敌")}" loading="lazy">
        <div>
          <strong>${escapeHtml(enemy.Name || "野外宠物")} Lv.${Number(enemy.Lv || 1)}</strong>
          <span>HP ${enemyHp}/${enemyMax} | 捕获率 ${Number(enemy.CaptureRate || 0)}%</span>
          <div class="meter"><i style="width:${clampPercent(enemyHp, enemyMax)}%"></i></div>
        </div>
      </div>
      <div class="battle-party">
        <strong>${activePet ? escapeHtml(activePet.Name) : "无出战宠物"}</strong>
        <span>${activePet ? `HP ${petHp}/${petMax}` : "需要至少一只宠物"}</span>
        <div class="meter pet"><i style="width:${clampPercent(petHp, petMax)}%"></i></div>
      </div>
      <div class="battle-actions">
        <button class="ghost-btn" type="button" data-say="攻击" ${activePet ? "" : "disabled"}>攻击</button>
        <button class="ghost-btn" type="button" data-say="捕获">捕获</button>
        <button class="ghost-btn" type="button" data-say="放走">放走</button>
      </div>
      <div class="battle-box-log">
        ${battleLog.length ? battleLog.map((line) => `<p>${escapeHtml(line)}</p>`).join("") : `<p>战斗开始。</p>`}
      </div>
    </div>
  `;
}

function dialogDebugLine(dialog) {
  const debug = dialog?.debug;
  if (!debug) return dialog?.source || "点击 NPC 后已自动打招呼，可继续追问";
  const parts = [];
  if (debug.source) parts.push(debug.source);
  if (debug.script && debug.script !== debug.source) parts.push(debug.script);
  if (debug.template && debug.template !== debug.script) parts.push(`template:${debug.template}`);
  if (debug.actions?.length) parts.push(`actions:${debug.actions.join("/")}`);
  return parts.join(" | ") || dialog.source || debug.talkFlow || "点击 NPC 后已自动打招呼，可继续追问";
}

function renderDialogShop(dialog) {
  const items = dialog.trade?.items || [];
  if (!items.length) return "";
  const state = dialog.trade.inventory || inventoryState();
  return `
    <div class="shop-box">
      <div>
        <strong>商品</strong>
        <span>背包 ${state.used}/${state.capacity} | 石币 ${Number(game.player.stone || 0)} | ${escapeHtml(dialog.trade.source || "ref___data")}</span>
      </div>
      ${items.slice(0, 8).map((item) => `
        <button class="shop-item" type="button" data-buy="${item.id}" ${shopDisabled(item) ? "disabled" : ""}>
          <span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${escapeHtml(shopItemHint(item))}</small>
          </span>
          <b>${Number(item.price || 0)} 石币</b>
        </button>
      `).join("")}
    </div>
  `;
}

function shopDisabled(item) {
  return item.affordable === false || item.canCarry === false;
}

function shopItemHint(item) {
  if (item.affordable === false) return "石币不足";
  if (item.canCarry === false) return "背包已满";
  const details = [];
  if (item.level) details.push(`Lv.${item.level}`);
  if (item.description) details.push(item.description);
  return details.join(" | ") || `item ${item.id}`;
}

async function buyItem(itemId) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/buy", { game, npcId: game.dialog.npcId, itemId });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "购买失败");
  }
}

async function useItem(itemId) {
  if (!game) return;
  try {
    game = await api("/api/game/use-item", { game, itemId });
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "道具使用失败");
    save();
    render();
  }
}

function appendDialogSystem(text) {
  if (!game?.dialog) return;
  game.dialog.messages = [
    ...(game.dialog.messages || []),
    { speaker: "system", text, at: Date.now() }
  ].slice(-12);
  save();
  renderDialog();
}

function dialogSpeaker(speaker, dialog) {
  if (speaker === "player") return game.player.name;
  if (speaker === "system") return "系统";
  return dialog.npcName || "NPC";
}

function renderExits(map) {
  els.exitList.innerHTML = map.exits.map((exit) => `
    <button class="list-btn" type="button" data-exit="${exit.id}">
      <strong>${escapeHtml(exit.label)}</strong>
      <span>${escapeHtml(exit.detail || exit.source)} | 入口 (${exit.x}, ${exit.y})</span>
    </button>
  `).join("") || `<p class="empty">当前地图没有出口。</p>`;
  els.exitList.querySelectorAll("[data-exit]").forEach((btn) => {
    btn.addEventListener("click", () => goToExit(btn.dataset.exit));
  });
}

function renderEncounter() {
  if (!ENCOUNTER_UI_ENABLED) {
    els.encounterPanel.hidden = true;
    els.battleLog.innerHTML = "";
    return;
  }
  const enemy = game.encounter;
  els.encounterPanel.hidden = !enemy;
  if (!enemy) return;
  els.encounterName.textContent = `${enemy.Name} Lv.${enemy.Lv}`;
  const activePet = game.pets?.[0];
  const enemyHp = Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : Number(enemy.WorkMaxHp || 0);
  const petHp = activePet ? `${activePet.Name} HP ${Number(activePet.Hp || activePet.WorkMaxHp || 0)}/${activePet.WorkMaxHp}` : "无出战宠物";
  els.encounterStats.textContent = `捕获率 ${enemy.CaptureRate}% | 敌 HP ${enemyHp}/${enemy.WorkMaxHp} | 攻 ${enemy.WorkFixStr} | 防 ${enemy.WorkFixTough} | 敏 ${enemy.WorkFixDex} | ${petHp}`;
  els.encounterImg.src = `/f/pet/${enemy.ImgNo}.gif`;
  els.attackBtn.disabled = !activePet;
  els.battleLog.innerHTML = (game.battle?.log || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function renderMapHud() {
  const playerHp = clampPercent(game.player.hp, game.player.maxHp);
  const activePet = game.pets?.[0];
  const inventory = inventoryState();
  els.mapHudName.textContent = game.player.name;
  els.mapHudMeta.textContent = `Lv.${game.player.level} | EXP ${Number(game.player.exp || 0)}`;
  els.mapHudHpBar.style.width = `${playerHp}%`;
  els.mapHudHpText.textContent = `HP ${Number(game.player.hp || 0)}/${Number(game.player.maxHp || 0)}`;
  if (activePet) {
    const petHp = clampPercent(activePet.Hp, activePet.WorkMaxHp);
    els.mapHudPetName.textContent = activePet.Name;
    els.mapHudPetMeta.textContent = `Lv.${activePet.Lv} | No.${activePet.PetId}`;
    els.mapHudPetHpBar.style.width = `${petHp}%`;
    els.mapHudPetHpText.textContent = `HP ${Number(activePet.Hp || 0)}/${Number(activePet.WorkMaxHp || 0)}`;
  } else {
    els.mapHudPetName.textContent = "无出战宠物";
    els.mapHudPetMeta.textContent = "宠物栏为空";
    els.mapHudPetHpBar.style.width = "0%";
    els.mapHudPetHpText.textContent = "--";
  }
  els.mapHudInventory.textContent = `石币 ${Number(game.player.stone || 0)} | 背包 ${inventory.used}/${inventory.capacity} | 宠物 ${game.pets.length}`;
}

function renderFieldMessage() {
  const last = [...(game.log || [])].reverse().find((line) => String(line || "").trim());
  els.fieldMessage.textContent = last || `${game.player.name} 来到了 ${game.world.map.name}。`;
}

function renderClientWindow() {
  if (!els.clientWindow) return;
  if (!game || !clientWindowOpen) {
    els.clientWindow.hidden = true;
    return;
  }
  const content = clientWindowContent(activeTab);
  els.clientWindowTitle.textContent = content.title;
  els.clientWindowBody.innerHTML = content.html;
  els.clientWindow.hidden = false;
  bindClientWindowActions();
}

function clientWindowContent(name) {
  if (name === "settings") return clientSettingsWindow();
  if (name === "card") return clientCardWindow();
  if (name === "party") return clientPartyWindow();
  if (name === "trade") return clientTradeWindow();
  if (name === "channel") return clientChannelWindow();
  if (name === "joinBattle") return clientJoinBattleWindow();
  if (name === "duel") return clientDuelWindow();
  if (name === "actions") return clientActionWindow();
  if (name === "save") return clientItemWindow();
  if (name === "quests") return clientQuestWindow();
  if (name === "log") return clientLogWindow();
  if (name === "data") return clientDataWindow();
  if (name === "ai") return clientAiWindow();
  return clientPetWindow();
}

function clientSettingsWindow() {
  return {
    title: "OPTION",
    html: `
      <div class="client-list-window">
        <article><strong>游戏设定</strong><span>音量 / 画面 / 操作</span></article>
        <article><strong>名片</strong><span>人物资料与名片交换</span></article>
        <article><strong>交易</strong><span>玩家交易</span></article>
        <article><strong>频道</strong><span>家族与频道功能</span></article>
        <article><strong>Action</strong><span>人物动作</span></article>
      </div>
    `
  };
}

function frontTileTarget() {
  const forward = directionDelta(currentServerDirection()) || [0, 0];
  return {
    x: Number(game.location.x || 0) + forward[0],
    y: Number(game.location.y || 0) + forward[1]
  };
}

function clientCardWindow() {
  const target = frontTileTarget();
  return {
    title: "CARD",
    html: `
      <div class="client-list-window">
        <article><strong>交换名片</strong><span>面前 (${target.x}, ${target.y})</span></article>
        <article><strong>状态</strong><span>面前没有可交换名片的玩家。</span></article>
      </div>
    `
  };
}

function clientPartyWindow() {
  const target = frontTileTarget();
  return {
    title: "PARTY",
    html: `
      <div class="client-list-window">
        <article><strong>加入队伍</strong><span>面前 (${target.x}, ${target.y})</span></article>
        <article><strong>状态</strong><span>附近没有可加入的队伍。</span></article>
      </div>
    `
  };
}

function clientTradeWindow() {
  const target = frontTileTarget();
  return {
    title: "TRADE",
    html: `
      <div class="client-list-window">
        <article><strong>进行交易</strong><span>面前 (${target.x}, ${target.y})</span></article>
        <article><strong>状态</strong><span>附近没有可交易玩家。</span></article>
      </div>
    `
  };
}

function clientChannelWindow() {
  return {
    title: "CHANNEL",
    html: `
      <div class="client-list-window">
        <article><strong>家族功能</strong><span>${escapeHtml(game.player.familyName || "尚未加入家族。")}</span></article>
        <article><strong>频道</strong><span>${escapeHtml(game.player.channel ?? "一般频道")}</span></article>
      </div>
    `
  };
}

function clientJoinBattleWindow() {
  const target = frontTileTarget();
  return {
    title: "BATTLE",
    html: `
      <div class="client-list-window">
        <article><strong>加入战斗</strong><span>面前 (${target.x}, ${target.y})</span></article>
        <article><strong>状态</strong><span>面前没有可加入或观战的战斗。</span></article>
      </div>
    `
  };
}

function clientDuelWindow() {
  const target = frontTileTarget();
  return {
    title: "DUEL",
    html: `
      <div class="client-list-window">
        <article><strong>决斗</strong><span>面前 (${target.x}, ${target.y})</span></article>
        <article><strong>状态</strong><span>面前没有可决斗的玩家。</span></article>
      </div>
    `
  };
}

function clientActionWindow() {
  return {
    title: "ACTION",
    html: `
      <div class="client-list-window">
        <article><strong>人物动作</strong><span>站立 / 点头 / 挥手</span></article>
        <article><strong>当前方向</strong><span>${currentServerDirection()}</span></article>
      </div>
    `
  };
}

function clientPetWindow() {
  const pet = game.pets?.[0];
  if (!pet) {
    return {
      title: "PET STATUS",
      html: `<p class="client-empty">没有出战宠物。</p>`
    };
  }
  const hp = Number(pet.Hp || 0);
  const maxHp = Number(pet.WorkMaxHp || hp || 1);
  const pets = game.pets || [];
  return {
    title: "PET STATUS",
    html: `
      <div class="client-pet-status">
        <div class="client-pet-portrait">
          <img src="/f/pet/${Number(pet.ImgNo || 0)}.gif" alt="" onerror="this.src='/f/logo.gif'">
          <strong>${escapeHtml(pet.Name)}</strong>
        </div>
        <div class="client-stat-stack">
          ${clientStatRow("等级", pet.Lv)}
          ${clientStatRow("经验值", Number(pet.Exp || 0))}
          ${clientStatRow("NEXT", "-1")}
          ${clientStatRow("耐久力", `${hp}/${maxHp}`)}
          ${clientStatRow("攻击力", pet.WorkFixStr)}
          ${clientStatRow("防御力", pet.WorkFixTough)}
          ${clientStatRow("敏捷力", pet.WorkFixDex)}
          ${clientStatRow("忠诚度", pet.Loyal || 100)}
        </div>
      </div>
      <div class="client-meter-row">
        <span>地属性</span><i style="width:${clampPercent(pet.Earth || pet.earth || 0, 10)}%"></i>
      </div>
      <div class="client-meter-row water">
        <span>水属性</span><i style="width:${clampPercent(pet.Water || pet.water || 0, 10)}%"></i>
      </div>
      <div class="client-meter-row fire">
        <span>火属性</span><i style="width:${clampPercent(pet.Fire || pet.fire || 0, 10)}%"></i>
      </div>
      <div class="client-meter-row wind">
        <span>风属性</span><i style="width:${clampPercent(pet.Wind || pet.wind || 0, 10)}%"></i>
      </div>
      <div class="client-party-row">
        ${pets.map((entry, index) => `
          <button type="button" data-client-train="${index}" title="训练 ${escapeHtml(entry.Name)}">
            <img src="/f/pet/${Number(entry.ImgNo || 0)}.gif" alt="" onerror="this.src='/f/logo.gif'">
            <span>Lv.${Number(entry.Lv || 1)}</span>
          </button>
        `).join("")}
      </div>
    `
  };
}

function clientItemWindow() {
  const inventory = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  const state = inventoryState();
  const capacity = Math.max(15, Number(state.capacity || 15));
  const slots = Array.from({ length: capacity }, (_, index) => inventory[index] || null);
  return {
    title: "ITEM",
    html: `
      <div class="client-item-top">
        <div class="client-item-category-grid">
          ${["骨", "肉", "草", "石", "壶", "卷"].map((label) => `<span>${label}</span>`).join("")}
        </div>
        <div class="client-money-box">
          <strong>Stone</strong>
          <span>${Number(game.player.stone || 0)}</span>
        </div>
      </div>
      <div class="client-slot-grid">
        ${slots.map((item) => clientItemSlot(item)).join("")}
      </div>
      <div class="client-item-desc">
        <strong>${inventory.length ? escapeHtml(inventory[0].name) : "背包"}</strong>
        <span>${inventory.length ? escapeHtml(inventory[0].description || inventory[0].source || "道具资料来自 itemset6.txt。") : `空位 ${state.remaining ?? Math.max(0, capacity - state.used)}/${capacity}`}</span>
      </div>
    `
  };
}

function clientItemSlot(item) {
  if (!item) return `<span class="client-slot empty"></span>`;
  const label = item.image || item.type || item.name || "物";
  return `
    <button class="client-slot filled" type="button" data-client-use-item="${item.id}" title="${escapeHtml(item.description || item.name)}" ${inventoryItemUsable(item) ? "" : "disabled"}>
      <b>${escapeHtml(String(label).slice(0, 2))}</b>
      <small>x${Number(item.qty || 0)}</small>
    </button>
  `;
}

function clientQuestWindow() {
  const quests = Object.values(game.quests || {});
  return {
    title: "QUEST",
    html: quests.length ? `
      <div class="client-list-window">
        ${quests.map((quest) => `
          <article>
            <strong>${escapeHtml(quest.title)}</strong>
            <span>${escapeHtml(quest.status)} | ${escapeHtml(nextQuestStep(quest))}</span>
          </article>
        `).join("")}
      </div>
    ` : `<p class="client-empty">还没有接任务。</p>`
  };
}

function clientLogWindow() {
  const lines = (game.log || []).slice(-6).reverse();
  return {
    title: "LOG",
    html: lines.length ? `
      <div class="client-list-window log">
        ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      </div>
    ` : `<p class="client-empty">暂无日志。</p>`
  };
}

function clientDataWindow() {
  const map = game.world.map;
  const near = nearbyText() || " | 附近：无";
  return {
    title: "DATA",
    html: `
      <div class="client-list-window">
        <article>
          <strong>${escapeHtml(map.name)}</strong>
          <span>floor ${escapeHtml(map.floorId)} | ${escapeHtml(map.size?.join("x") || "--")}</span>
        </article>
        <article>
          <strong>${escapeHtml(game.player.name)}</strong>
          <span>Lv.${Number(game.player.level || 1)} | (${Number(game.location.x || 0)}, ${Number(game.location.y || 0)})${escapeHtml(near)}</span>
        </article>
        <article>
          <strong>来源</strong>
          <span>client map + npc scripts + mapwarp.txt</span>
        </article>
      </div>
    `
  };
}

function clientAiWindow() {
  const prompt = els.aiPrompt.value.trim();
  return {
    title: "AI",
    html: `
      <div class="client-list-window">
        <article>
          <strong>AI 向导</strong>
          <span>${escapeHtml(prompt || "可询问任务、地图、交易和下一步行动。")}</span>
        </article>
        <article>
          <strong>回答</strong>
          <span>${escapeHtml(els.aiResult.textContent || "点击外层 AI 按钮后会显示结果。")}</span>
        </article>
      </div>
    `
  };
}

function clientStatRow(label, value) {
  return `<div class="client-stat-row"><b>${escapeHtml(label)}</b><span>${escapeHtml(value ?? "--")}</span></div>`;
}

function bindClientWindowActions() {
  els.clientWindowBody.querySelectorAll("[data-client-train]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/train", { petIndex: Number(btn.dataset.clientTrain) }));
  });
  els.clientWindowBody.querySelectorAll("[data-client-use-item]").forEach((btn) => {
    btn.addEventListener("click", () => useItem(Number(btn.dataset.clientUseItem)));
  });
}

function renderPets() {
  const pets = game.pets.map((pet, index) => `
    <article class="pet-card">
      <img src="/f/pet/${pet.ImgNo}.gif" alt="" onerror="this.src='/f/logo.gif'">
      <div>
        <h3>${escapeHtml(pet.Name)} Lv.${pet.Lv}</h3>
        <p class="muted">No.${pet.PetId} | HP ${Number(pet.Hp || 0)}/${pet.WorkMaxHp} | 攻 ${pet.WorkFixStr} | 防 ${pet.WorkFixTough} | 敏 ${pet.WorkFixDex}</p>
        <p>总成长 <strong>${fmt(pet.Growth)}</strong></p>
      </div>
      <button type="button" data-train="${index}">训练</button>
    </article>
  `).join("");
  const inventory = (game.inventory || []).filter((item) => item.id !== "stone");
  const state = inventoryState();
  els.petList.innerHTML = pets + `
    <article class="inventory-box">
      <div class="inventory-head">
        <h3>背包</h3>
        <span>${state.used}/${state.capacity}</span>
      </div>
      ${inventory.map((item) => `
        <div class="inventory-item">
          <span>
            <strong>${escapeHtml(item.name)}</strong>
            <small>x${Number(item.qty || 0)} | type ${escapeHtml(String(item.type ?? ""))} | ${escapeHtml(item.description || item.source || "")}</small>
          </span>
          <button type="button" data-use-item="${item.id}" ${inventoryItemUsable(item) ? "" : "disabled"}>使用</button>
        </div>
      `).join("") || `<p class="empty">背包还没有道具。</p>`}
    </article>
  `;
  els.petList.querySelectorAll("[data-train]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/train", { petIndex: Number(btn.dataset.train) }));
  });
  els.petList.querySelectorAll("[data-use-item]").forEach((btn) => {
    btn.addEventListener("click", () => useItem(Number(btn.dataset.useItem)));
  });
}

function inventoryState() {
  const serverState = game?.inventoryState || game?.save?.json?.inventoryState;
  if (serverState?.capacity) return serverState;
  const used = (game?.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0).length;
  return { used, capacity: 15, remaining: Math.max(0, 15 - used) };
}

function inventoryItemUsable(item) {
  const text = `${item.name || ""} ${item.description || ""}`;
  return /耐久力|耐力|HP|小的肉|乾燥肉|大的肉|高级肉|复活|气绝/i.test(text);
}

function renderQuests() {
  const quests = Object.values(game.quests || {});
  els.questList.innerHTML = quests.map((quest) => `
    <article class="result-item quest-card">
      <div><strong>${escapeHtml(quest.title)}</strong><span>${escapeHtml(quest.status)}</span></div>
      <p>${escapeHtml(quest.description)}</p>
      <div class="quest-progress" aria-label="任务进度">
        ${(quest.steps || []).map((step, index) => `
          <span class="${index < Number(quest.progress || 0) ? "done" : index === Number(quest.progress || 0) && quest.status !== "完成" ? "current" : ""}" title="${escapeHtml(step)}"></span>
        `).join("")}
      </div>
      <p class="muted">下一步：${escapeHtml(nextQuestStep(quest))}</p>
      <p class="muted">奖励：${escapeHtml(quest.reward)} | 来源：${escapeHtml(quest.source)}</p>
    </article>
  `).join("") || `<p class="empty">还没有接任务，先和 NPC 聊聊。</p>`;
}

function nextQuestStep(quest) {
  if (quest.status === "完成") return "完成";
  if (quest.status === "可回报") return quest.steps?.[quest.steps.length - 1] || "回报任务";
  return quest.steps?.[Math.min(Number(quest.progress || 0), quest.steps.length - 1)] || "继续探索";
}

function renderLog() {
  els.gameLog.innerHTML = game.log.slice().reverse().map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

async function searchData() {
  const q = els.dataQuery.value.trim();
  if (q.length < 2) {
    els.dataResults.innerHTML = `<p class="empty">至少输入两个字。</p>`;
    return;
  }
  els.dataResults.innerHTML = `<p class="empty">搜索中...</p>`;
  const data = await api("/api/data/search", { q });
  if (!data.results.length) {
    els.dataResults.innerHTML = `<p class="empty">没有找到相关资料。</p>`;
    return;
  }
  els.dataResults.innerHTML = data.results.map((row) => `
    <article class="result-item">
      <div><strong>${escapeHtml(row.source)}</strong><span>${escapeHtml(row.file)}:${row.line}</span></div>
      <p>${highlight(escapeHtml(row.text), q)}</p>
    </article>
  `).join("");
}

async function askGuide() {
  if (!game) return;
  els.aiResult.textContent = "向导思考中...";
  renderClientWindow();
  const data = await api("/api/ai/guide", { game, prompt: els.aiPrompt.value });
  els.aiResult.textContent = data.text || "向导暂时没有建议。";
  renderClientWindow();
}

function showTab(name, options = {}) {
  activeTab = name || activeTab;
  if (options.openClientWindow) clientWindowOpen = true;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });
  document.querySelectorAll("[data-command-tab]").forEach((btn) => {
    const active = btn.dataset.commandTab === activeTab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  refreshAtlasButtonSprites();
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${activeTab}Tab`);
  });
  renderClientWindow();
}

function renderSaveState() {
  const save = game?.save;
  if (!save) {
    els.saveState.textContent = "本地存档";
    return;
  }
  els.saveState.textContent = `槽 ${save.slot} | ${save.fileName}`;
}

function renderSavePanel() {
  const save = game?.save;
  if (!save) return;
  els.saveInfo.innerHTML = `
    <article class="result-card">
      <strong>账号 ${escapeHtml(save.accountId)} / 人物槽 ${save.slot}</strong>
      <span>${escapeHtml(save.fileName)} | ${escapeHtml(save.schema)} | ${escapeHtml(save.updatedAt || "")}</span>
    </article>
    <article class="result-card">
      <strong>SAAC 字符串结构</strong>
      <span>charname | option | charinfo，对应原 SAAC 的 makeSaveCharString。</span>
    </article>
    <article class="result-card">
      <strong>JSON 调试存档</strong>
      <span>schema=${escapeHtml(save.schema)}，用于本 PWA 导入/导出；字段按 account、character、player、location、flags、pets、inventory 拆分。</span>
    </article>
  `;
  els.saveText.value = save.serialized || "";
  if (!els.saveJsonText.value.trim()) {
    els.saveJsonText.value = JSON.stringify(save.json || game, null, 2);
  }
}

function exportSaveJson() {
  if (!game?.save) return;
  els.saveJsonText.value = JSON.stringify(game.save.json || game, null, 2);
}

async function importSaveJson() {
  const raw = els.saveJsonText.value.trim();
  if (!raw) return;
  let next;
  try {
    next = JSON.parse(raw);
  } catch {
    els.saveInfo.insertAdjacentHTML("afterbegin", `<article class="result-card"><strong>导入失败</strong><span>JSON 格式不正确。</span></article>`);
    return;
  }
  game = await api("/api/game/sync", { game: next.game || next });
  mapView.zoom = MAP_DEFAULT_ZOOM;
  mapView.centerOnNextRender = true;
  save();
  showGame();
  render();
}

function nearbyText() {
  const nearby = game?.nearby;
  if (!nearby) return "";
  const parts = [];
  if (nearby.npcs?.length) parts.push(`NPC ${nearby.npcs.map((npc) => npc.name).join("、")}`);
  if (nearby.exits?.length) parts.push(`出口 ${nearby.exits.map((exit) => exit.label).join("、")}`);
  return parts.length ? ` | 附近：${parts.join("；")}` : "";
}

async function api(path, body) {
  const rsp = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await rsp.json();
  if (!rsp.ok) throw new Error(data.error || "request failed");
  return data;
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));
}

function addClientLog(text) {
  if (!game) return;
  game.log = [...(game.log || []), text].slice(-24);
  save();
  renderLog();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateNetState() {
  els.netState.textContent = navigator.onLine ? "在线" : "离线";
  els.netState.classList.toggle("offline", !navigator.onLine);
}

function mapPos(point) {
  return `left:${Math.round(point[0])}px;top:${Math.round(point[1])}px`;
}

function highlight(text, q) {
  const token = escapeHtml(q);
  return text.replaceAll(token, `<mark>${token}</mark>`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[ch]));
}

function cssEscape(value) {
  if (window.CSS?.escape) return CSS.escape(String(value));
  return String(value).replace(/["\\\]]/g, "\\$&");
}

function clampPercent(value, max) {
  const safeMax = Number(max) || 0;
  if (safeMax <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(value || 0) / safeMax) * 100)));
}

function fmt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function byId(id) {
  return document.getElementById(id);
}
