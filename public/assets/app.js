const SAVE_KEY = "stoneage-web-game-v1";
const MAP_ZOOM_MIN = 0.5;
const MAP_ZOOM_MAX = 8;
const MAP_ZOOM_STEP = 0.5;
const MAP_DEFAULT_ZOOM = 1;
const CG_INVISIBLE = 99;
const SPR_START = 100000;
const REAL_TILE_CELL_LIMIT = 90000;
const LARGE_MAP_CANVAS_MAX_SIDE = 4096;
const LARGE_MAP_VIEW_PADDING = 192;
const LARGE_MAP_TILE_PADDING = 8;
const TILE_ATLAS_MANIFEST = "/data/client-tiles/tiles.json?v=pet-sprites-v2";
const PROFILE_PACK_PLAN_PATH = "/data/profiles/classic-core/profile-texture-pack-plan.json";
const PET_FIELD_ANIMATION_MANIFEST = "/data/profiles/classic-core/pet-field-animations.json";
const GMSV_DATA_SOURCE = "gmsv-data";
const ENCOUNTER_UI_ENABLED = false;
const PET_CAPACITY_FALLBACK = 5;
const BATTLE_PLAYER_MAX = 5;
const BATTLE_SIDE_OFFSET = 10;
const MAP_GRID_SIZE = 64;
const TILE_HALF_H = 24;
const MAP_BACKDROP_COLOR = "#000000";
const CG_GRID_CURSOR = 25001;
const MOVE_MODE_CHANGE_TIME = 1000;
const MOVE_CLICK_WAIT_TIME = 250;
const WARP_EFFECT_MS = 680;
const DIALOG_SCROLL_STEP = 56;
const AUTOMATION_TICK_MS = 760;
const AUTOMATION_BATTLE_STEP_MS = 520;
const AUTOMATION_ROUTE_ESCAPE_LIMIT = 10;
const ROUTE_RETRY_LIMIT = 3;
const PAID_JUMP_BASE_COST = 2000;
const PAID_JUMP_FIRST_TIER_STEPS = 300;
const PAID_JUMP_SECOND_TIER_STEPS = 500;
const PAID_JUMP_FIRST_TIER_COST = 30;
const PAID_JUMP_SECOND_TIER_COST = 50;
const PAID_JUMP_THIRD_TIER_COST = 80;
const BATTLE_KEY_ACTIONS = Object.freeze({
  "1": "attack",
  h: "attack",
  "2": "",
  g: "guard",
  "3": "capture",
  t: "capture",
  "4": "",
  i: "item",
  "5": "guard",
  "6": "item",
  "7": "pet",
  "8": "escape",
  "9": "skill",
  w: "skill",
  s: "pet",
  p: "pet",
  n: "wait",
  escape: "escape",
  e: "escape"
});
const BATTLE_ACTIONS = Object.freeze([
  { action: "attack", label: "攻击", command: "H|0" },
  { action: "magic", label: "咒术", command: "J", disabled: true },
  { action: "capture", label: "捕获", command: "T|0" },
  { action: "help", label: "Help", command: "Help", disabled: true },
  { action: "guard", label: "防御", command: "G" },
  { action: "item", label: "道具", command: "I" },
  { action: "pet", label: "宠物", command: "S" },
  { action: "escape", label: "逃跑", command: "E" }
]);
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
const SCREEN_KEY_VECTORS = Object.freeze({
  q: [-1, -1],
  home: [-1, -1],
  numpad7: [-1, -1],
  "7": [-1, -1],
  w: [0, -1],
  arrowup: [0, -1],
  numpad8: [0, -1],
  "8": [0, -1],
  e: [1, -1],
  pageup: [1, -1],
  numpad9: [1, -1],
  "9": [1, -1],
  d: [1, 0],
  arrowright: [1, 0],
  numpad6: [1, 0],
  "6": [1, 0],
  c: [1, 1],
  pagedown: [1, 1],
  numpad3: [1, 1],
  "3": [1, 1],
  s: [0, 1],
  arrowdown: [0, 1],
  numpad2: [0, 1],
  "2": [0, 1],
  z: [-1, 1],
  end: [-1, 1],
  numpad1: [-1, 1],
  "1": [-1, 1],
  a: [-1, 0],
  arrowleft: [-1, 0],
  numpad4: [-1, 0],
  "4": [-1, 0]
});
const SCREEN_VECTOR_DIRECTIONS = Object.freeze({
  "0,-1": 1,
  "1,-1": 2,
  "1,0": 3,
  "1,1": 4,
  "0,1": 5,
  "-1,1": 6,
  "-1,0": 7,
  "-1,-1": 0
});
const DEFAULT_PLAYER_DIRECTION = 5;
const BATTLE_ENEMY_FACE_DIRECTION = 2;
const BATTLE_ALLY_FACE_DIRECTION = 6;
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
let rescueEpoch = 0;
let tileAtlasPromise = null;
let loadedTileAtlas = null;
let profilePackPlanPromise = null;
const profileAtlasState = {
  disabled: false,
  loadedPacks: new Set(),
  loadingPacks: new Map(),
  framePackUrls: null,
  framePackPlanUrl: "",
  frames: Object.create(null)
};
const petFieldAnimationState = {
  disabled: false,
  manifest: null,
  loading: null,
  missingSprites: new Set()
};
let largeMapRenderer = null;
let mapRenderVersion = 0;
let activeTab = "ai";
let assistTab = "map";
let clientWindowOpen = false;
let selectedClientItemId = null;
let lastClientItemClick = { id: null, at: 0 };
let activeWarpTransitionKey = "";
let warpTransitionTimer = 0;
let battleItemMenuOpen = false;
let battleSkillMenuOpen = false;
let battlePetMenuOpen = false;
let battleSelectedAction = "attack";
let battlePendingAction = "";
let battleFxTimer = 0;
let automationTimer = 0;
let automationInFlight = false;
const pressedMoveKeys = new Set();
let aiRuntime = { provider: "unknown", model: "", actionAuthority: "worker-npc-vm", structured: false, fallback: "" };
let npcSortMode = "source";
let exitSortMode = "source";
let lastNpcMapClick = { id: "", at: 0 };
let playerAnimState = {
  dir: DEFAULT_PLAYER_DIRECTION,
  startedAt: 0,
  walkUntil: 0,
  moveUntil: 0,
  followCamera: false,
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
  startPanY: 0,
  hoverTile: null,
  holdPointerId: null,
  holdMoveTimer: 0,
  holdMoveInterval: 0,
  holdMoveActive: false,
  holdMoveLastKey: "",
  suppressNextClick: false,
  npcHitboxes: []
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
  assistTabs: byId("assistTabs"),
  assistPanelBody: byId("assistPanelBody"),
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
  dialogAiToggleBtn: byId("dialogAiToggleBtn"),
  dialogInput: byId("dialogInput"),
  dialogCloseBtn: byId("dialogCloseBtn"),
  dialogScrollUpBtn: byId("dialogScrollUpBtn"),
  dialogScrollDownBtn: byId("dialogScrollDownBtn"),
  battlePanel: byId("battlePanel"),
  battleTitle: byId("battleTitle"),
  battleSource: byId("battleSource"),
  battleFormationLayer: byId("battleFormationLayer"),
  battleTargetPrompt: byId("battleTargetPrompt"),
  battleCountdown: byId("battleCountdown"),
  battleEnemyTarget: byId("battleEnemyTarget"),
  battleEnemyImg: byId("battleEnemyImg"),
  battleEnemyName: byId("battleEnemyName"),
  battleEnemyStats: byId("battleEnemyStats"),
  battleEnemyHpBar: byId("battleEnemyHpBar"),
  battleEnemyParty: byId("battleEnemyParty"),
  battlePetImg: byId("battlePetImg"),
  battlePetName: byId("battlePetName"),
  battlePetStats: byId("battlePetStats"),
  battlePetHpBar: byId("battlePetHpBar"),
  battlePlayerName: byId("battlePlayerName"),
  battlePlayerStats: byId("battlePlayerStats"),
  battleCommandGrid: byId("battleCommandGrid"),
  sourceBattleLog: byId("sourceBattleLog"),
  petList: byId("petList"),
  questList: byId("questList"),
  gameLog: byId("gameLog"),
  dataQuery: byId("dataQuery"),
  dataSearchBtn: byId("dataSearchBtn"),
  dataResults: byId("dataResults"),
  aiPrompt: byId("aiPrompt"),
  aiBtn: byId("aiBtn"),
  aiResult: byId("aiResult"),
  aiStatusPanel: byId("aiStatusPanel"),
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
  showTab("ai");
  updateNetState();
  window.addEventListener("online", updateNetState);
  window.addEventListener("offline", updateNetState);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    els.installBtn.hidden = false;
  });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  loadAiRuntimeStatus();
  window.setInterval(updateBattleCountdownDisplay, 250);
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
    const fallback = defaultDialogSubmitText(game?.dialog);
    if (text || fallback) sendDialog(text || fallback);
  });
  els.dialogAiToggleBtn.addEventListener("click", () => {
    const enabled = Boolean(game?.dialog?.aiMode);
    toggleDialogAiMode(!enabled);
  });
  els.dialogInput.addEventListener("keydown", onDialogInputKeyDown);
  els.dialogMessages.addEventListener("scroll", updateDialogScrollButtons);
  els.dialogCloseBtn.addEventListener("click", () => {
    closeDialog();
  });
  els.dialogScrollUpBtn.addEventListener("click", () => scrollDialogMessages(-DIALOG_SCROLL_STEP));
  els.dialogScrollDownBtn.addEventListener("click", () => scrollDialogMessages(DIALOG_SCROLL_STEP));
  els.battlePanel.addEventListener("click", onBattlePanelClick);
  els.dataSearchBtn?.addEventListener("click", searchData);
  els.dataQuery?.addEventListener("keydown", (event) => {
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
  els.mapCanvas.addEventListener("pointerleave", onMapPointerLeave);
  els.mapCanvas.addEventListener("click", onMapCanvasClick);
  els.mapCanvas.addEventListener("dblclick", onMapCanvasDoubleClick);
  els.assistTabs.addEventListener("click", onAssistTabClick);
  els.assistPanelBody.addEventListener("click", onAssistPanelClick);
  els.assistPanelBody.addEventListener("dblclick", onAssistPanelDoubleClick);
  els.assistPanelBody.addEventListener("keydown", onAssistPanelKeyDown);
  els.aiStatusPanel?.addEventListener("click", onAssistPanelClick);
  els.aiStatusPanel?.addEventListener("dblclick", onAssistPanelDoubleClick);
  window.addEventListener("resize", centerMapOnPlayer);
  window.addEventListener("keydown", onGameKeyDown);
  window.addEventListener("keyup", onGameKeyUp);
  window.addEventListener("blur", clearPressedMoveKeys);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearPressedMoveKeys();
  });
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
  if (els.encounterImg instanceof HTMLImageElement) {
    els.encounterImg.addEventListener("error", () => {
      els.encounterImg.src = "/f/logo.gif";
    });
  }
}

async function mutate(path, body) {
  if (!game) return;
  game = await api(path, { ...body, game });
  if (path === "/api/game/travel") mapView.centerOnNextRender = true;
  save();
  render();
}

async function allocatePlayerPoint(stat) {
  if (!game) return;
  try {
    game = await api("/api/game/allocate-point", { game, stat, qty: 1 });
    save();
    render();
  } catch (error) {
    addClientLog(error.message || "分配能力点失败。");
  }
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
  ensureAutomationState();
  syncPlayerAnimationDirectionFromGame();
  const map = game.world.map;
  const petsUsed = petUsed();
  const petsCapacity = petCapacity();
  const playerProgress = progressionForPlayer();
  els.playerTitle.textContent = game.player.name;
  els.playerStats.textContent = `Lv.${game.player.level} | HP ${game.player.hp}/${game.player.maxHp} | ${expLabel(playerProgress)} | 魅 ${playerCharmValue()} | 石币 ${game.player.stone} | 宠物 ${petsUsed}/${petsCapacity}`;
  els.mapName.textContent = map.name;
  els.mapSummary.textContent = `${map.summary} | 位置 (${game.location.x},${game.location.y})${nearbyText()} | 来源：${GMSV_DATA_SOURCE}/map + mapwarp.txt + encount.txt + npc scripts`;
  renderMapHud();
  els.encounterBtn.hidden = !ENCOUNTER_UI_ENABLED;
  els.encounterBtn.disabled = !ENCOUNTER_UI_ENABLED || !map.canWildEncounter;
  els.encounterBtn.title = ENCOUNTER_UI_ENABLED
    ? (map.canWildEncounter ? "主动触发一次野外遇敌" : (map.wildEncounterReason || "当前地图不能触发野外遇敌"))
    : "遇敌捕获界面已关闭";
  renderMap(map);
  syncWarpTransition();
  renderAssistPanel(map);
  renderDialog();
  renderBattlePanel();
  renderEncounter();
  renderPets();
  renderQuests();
  renderLog();
  renderSavePanel();
  renderSaveState();
  renderFieldMessage();
  renderAiStatusPanel();
  renderClientWindow();
  scheduleAutomationTick();
}

function renderMap(map) {
  const content = els.mapCanvas.querySelector(".map-content");
  const sameMap = mapView.mapId === map.id && content;
  if (sameMap) {
    if (largeMapRenderer) {
      largeMapRenderer.map = map;
      if (loadedTileAtlas) largeMapRenderer.atlas = loadedTileAtlas;
    }
    syncMapMarkers(map);
    if (mapView.centerOnNextRender) {
      centerMapOnPlayer();
      mapView.centerOnNextRender = false;
    } else {
      clampMapPan();
    }
    applyMapView();
    syncMapCursor(map);
    return;
  }
  resetLargeMapRenderer();
  mapView.npcHitboxes = [];
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
    `<span class="map-grid-cursor client-atlas-sprite" data-atlas-sprite="${CG_GRID_CURSOR}" aria-hidden="true" hidden></span>`,
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
  hydrateAtlasSprites(loadedTileAtlas);
  syncMapCursor(map);
  centerMapOnPoint(layout.player);
  mapView.centerOnNextRender = false;
  clampMapPan();
  applyMapView();
  renderLs2Map(map, renderVersion).catch(() => {
    els.mapCanvas.classList.add("map-fallback");
  });
}

function syncWarpTransition() {
  const transition = game?.transition?.type === "warp" ? game.transition : null;
  if (!transition) {
    clearWarpTransitionTimer();
    activeWarpTransitionKey = "";
    els.mapCanvas.classList.remove("warping");
    return;
  }
  const key = transition.id || `${transition.kind}:${transition.from?.mapId}->${transition.to?.mapId}:${transition.at}`;
  els.mapCanvas.classList.add("warping");
  if (key === activeWarpTransitionKey) return;
  clearWarpTransitionTimer();
  activeWarpTransitionKey = key;
  warpTransitionTimer = window.setTimeout(() => {
    if (game?.transition && (game.transition.id || "") === (transition.id || "")) {
      game.transition = null;
      save();
    }
    els.mapCanvas.classList.remove("warping");
    activeWarpTransitionKey = "";
    warpTransitionTimer = 0;
  }, WARP_EFFECT_MS);
}

function clearWarpTransitionTimer() {
  if (!warpTransitionTimer) return;
  window.clearTimeout(warpTransitionTimer);
  warpTransitionTimer = 0;
}

function onMapCanvasClick(event) {
  if (isBattleOpen() || game?.dialog?.open) return;
  if (mapView.suppressNextClick) {
    mapView.suppressNextClick = false;
    return;
  }
  if (mapView.moved) return;
  const tile = mapTileFromPointer(event);
  const exitMarker = explicitExitFromMapEvent(event);
  if (exitMarker) {
    lastNpcMapClick = { id: "", at: 0 };
    handleMapExitClick(exitMarker, { preferredTile: normalizeExitPreferredTile(exitMarker, tile) });
    return;
  }
  const explicitNpc = explicitNpcFromMapEvent(event);
  const tileExit = !explicitNpc ? exitFromTile(tile) : null;
  if (tileExit) {
    lastNpcMapClick = { id: "", at: 0 };
    handleMapExitClick(tileExit, { preferredTile: tile });
    return;
  }
  if (explicitNpc) {
    const now = performance.now();
    const repeated = lastNpcMapClick.id === explicitNpc.id && now - lastNpcMapClick.at < 520;
    lastNpcMapClick = { id: explicitNpc.id, at: now };
    const near = cellDistance(game.location.x, game.location.y, explicitNpc.x, explicitNpc.y) <= 2;
    goToNpc(explicitNpc.id, {
      openWhenNear: near && repeated,
      preferredTile: normalizeNpcPreferredTile(explicitNpc, tile)
    });
    return;
  }
  lastNpcMapClick = { id: "", at: 0 };
  const target = tile || mapTileFromPointer(event);
  if (target) {
    setMapHoverTile(target);
    followRouteTo(target);
  }
}

function onMapCanvasDoubleClick(event) {
  if (isBattleOpen() || game?.dialog?.open) return;
  const tile = mapTileFromPointer(event);
  const exitMarker = explicitExitFromMapEvent(event);
  if (exitMarker) {
    event.preventDefault();
    lastNpcMapClick = { id: "", at: 0 };
    handleMapExitClick(exitMarker, { preferredTile: normalizeExitPreferredTile(exitMarker, tile) });
    return;
  }
  const explicitNpc = explicitNpcFromMapEvent(event);
  const tileExit = !explicitNpc ? exitFromTile(tile) || nearestExitToTile(tile, 1) : null;
  if (tileExit) {
    event.preventDefault();
    lastNpcMapClick = { id: "", at: 0 };
    handleMapExitClick(tileExit, { preferredTile: tile });
    return;
  }
  const npc = explicitNpc || (tile ? nearestNpcToTile(tile, 2) : null);
  if (!npc) return;
  event.preventDefault();
  lastNpcMapClick = { id: npc.id, at: performance.now() };
  goToNpc(npc.id, { openWhenNear: true, preferredTile: normalizeNpcPreferredTile(npc, tile) });
}

function npcFromMapEvent(event, maxTileDistance = 1) {
  const explicitNpc = explicitNpcFromMapEvent(event);
  if (explicitNpc) return explicitNpc;
  const tile = mapTileFromPointer(event);
  if (!tile) return null;
  return nearestNpcToTile(tile, maxTileDistance);
}

function explicitNpcFromMapEvent(event) {
  const npcBtn = event.target.closest("[data-npc]");
  if (npcBtn && els.mapCanvas.contains(npcBtn)) return npcById(npcBtn.dataset.npc);
  return npcFromSpriteHitbox(event);
}

function npcFromSpriteHitbox(event) {
  const point = mapContentPointFromPointer(event);
  if (!point || !mapView.npcHitboxes.length) return null;
  const candidates = mapView.npcHitboxes
    .filter((box) => point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom)
    .map((box) => ({
      ...box,
      distance: Math.hypot(point.x - box.centerX, point.y - box.centerY)
    }))
    .sort((a, b) => a.distance - b.distance || b.depth - a.depth || b.order - a.order);
  return candidates.length ? npcById(candidates[0].npcId) : null;
}

function npcById(npcId) {
  return game?.world?.map?.npcs?.find((item) => item.id === npcId) || null;
}

function nearestNpcToTile(tile, maxDistance) {
  const npcs = game?.world?.map?.npcs || [];
  let best = null;
  for (const npc of npcs) {
    const distance = cellDistance(tile.x, tile.y, npc.x, npc.y);
    if (distance > maxDistance) continue;
    if (!best || distance < best.distance) best = { npc, distance };
  }
  return best?.npc || null;
}

function explicitExitFromMapEvent(event) {
  const exitBtn = event.target.closest("[data-exit]");
  if (!exitBtn || !els.mapCanvas.contains(exitBtn)) return null;
  return exitById(exitBtn.dataset.exit);
}

function exitById(exitId) {
  const map = game?.world?.map;
  return (map?.exits || []).find((item) => item.id === exitId) || null;
}

function exitFromTile(tile) {
  if (!tile) return null;
  const map = game?.world?.map;
  const active = (map?.exits || []).find((exit) => exitContainsTile(exit, tile));
  if (active) return active;
  const closed = (map?.profileClosedExits || []).find((exit) => exitContainsTile(exit, tile));
  return closed ? { ...closed, closedProfile: true } : null;
}

function nearestExitToTile(tile, maxDistance = 1) {
  if (!tile) return null;
  const map = game?.world?.map;
  const candidates = [
    ...(map?.exits || []).map((exit) => ({ exit, distance: exitDistanceToTile(exit, tile), closedProfile: false })),
    ...(map?.profileClosedExits || []).map((exit) => ({ exit, distance: exitDistanceToTile(exit, tile), closedProfile: true }))
  ]
    .filter((item) => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance || exitDistanceToPlayer(a.exit) - exitDistanceToPlayer(b.exit));
  const match = candidates[0];
  if (!match) return null;
  return match.closedProfile ? { ...match.exit, closedProfile: true } : match.exit;
}

function exitContainsTile(exit, tile) {
  if (!exit || !tile) return false;
  const tx = Number(tile.x);
  const ty = Number(tile.y);
  if (!Number.isFinite(tx) || !Number.isFinite(ty)) return false;
  if ((exit.tiles || []).some((item) => Number(item.x) === tx && Number(item.y) === ty)) return true;
  if (Array.isArray(exit.bounds) && exit.bounds.length >= 4) {
    const minX = Math.min(Number(exit.bounds[0]), Number(exit.bounds[2]));
    const maxX = Math.max(Number(exit.bounds[0]), Number(exit.bounds[2]));
    const minY = Math.min(Number(exit.bounds[1]), Number(exit.bounds[3]));
    const maxY = Math.max(Number(exit.bounds[1]), Number(exit.bounds[3]));
    if (tx >= minX && tx <= maxX && ty >= minY && ty <= maxY) return true;
  }
  return Number(exit.x) === tx && Number(exit.y) === ty;
}

function exitDistanceToTile(exit, tile) {
  if (!exit || !tile) return Infinity;
  const tx = Number(tile.x);
  const ty = Number(tile.y);
  if (!Number.isFinite(tx) || !Number.isFinite(ty)) return Infinity;
  if (Array.isArray(exit.tiles) && exit.tiles.length) {
    return Math.min(...exit.tiles.map((item) => cellDistance(tx, ty, item.x, item.y)));
  }
  if (Array.isArray(exit.bounds) && exit.bounds.length >= 4) {
    const minX = Math.min(Number(exit.bounds[0]), Number(exit.bounds[2]));
    const maxX = Math.max(Number(exit.bounds[0]), Number(exit.bounds[2]));
    const minY = Math.min(Number(exit.bounds[1]), Number(exit.bounds[3]));
    const maxY = Math.max(Number(exit.bounds[1]), Number(exit.bounds[3]));
    const dx = tx < minX ? minX - tx : tx > maxX ? tx - maxX : 0;
    const dy = ty < minY ? minY - ty : ty > maxY ? ty - maxY : 0;
    return Math.max(dx, dy);
  }
  return cellDistance(tx, ty, exit.x, exit.y);
}

function exitDistanceToPlayer(exit) {
  return exitDistanceToTile(exit, { x: game?.location?.x, y: game?.location?.y });
}

function normalizeNpcPreferredTile(npc, tile) {
  if (!npc || !tile) return null;
  const dx = Number(tile.x) - Number(npc.x);
  const dy = Number(tile.y) - Number(npc.y);
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) <= 2) return tile;
  return {
    x: Number(npc.x) + Math.sign(dx) * Math.min(2, Math.abs(dx)),
    y: Number(npc.y) + Math.sign(dy) * Math.min(2, Math.abs(dy))
  };
}

function normalizeExitPreferredTile(exit, tile) {
  if (!exit) return tile || null;
  if (tile && exitDistanceToTile(exit, tile) <= 1) return tile;
  return {
    x: Number(exit.x),
    y: Number(exit.y)
  };
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
  const point = playerTilePoint(game.location);
  centerMapOnPoint(mapClientPoint(game.world.map, point.x, point.y));
}

function centerMapOnPoint(point) {
  const rect = els.mapCanvas.getBoundingClientRect();
  mapView.panX = (rect.width || 1) / 2 - point[0] * mapView.zoom;
  mapView.panY = (rect.height || 340) / 2 - point[1] * mapView.zoom;
  clampMapPan();
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
  if (isBattleOpen()) return;
  clearMapHoldMove();
  mapView.dragging = true;
  mapView.moved = false;
  mapView.startX = event.clientX;
  mapView.startY = event.clientY;
  mapView.startPanX = mapView.panX;
  mapView.startPanY = mapView.panY;
  mapView.holdPointerId = event.pointerId;
  setMapHoverTile(mapTileFromPointer(event));
  mapView.holdMoveTimer = window.setTimeout(beginMapHoldMove, MOVE_MODE_CHANGE_TIME);
  els.mapCanvas.classList.add("dragging");
  els.mapCanvas.setPointerCapture(event.pointerId);
}

function onGameKeyDown(event) {
  if (!game || els.game.hidden) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const tag = event.target?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select" || event.target?.isContentEditable) {
    clearPressedMoveKeys();
    return;
  }
  const key = event.key.toLowerCase();
  if (game.dialog?.open) {
    clearPressedMoveKeys();
    if (key === "escape") closeDialog();
    else if (key === "pageup") scrollDialogMessages(-DIALOG_SCROLL_STEP * 3);
    else if (key === "pagedown") scrollDialogMessages(DIALOG_SCROLL_STEP * 3);
    else els.dialogInput.focus();
    event.preventDefault();
    return;
  }
  if (isBattleOpen()) {
    clearPressedMoveKeys();
    const action = BATTLE_KEY_ACTIONS[key];
    if (action === "item") {
      toggleBattleItemMenu();
    } else if (action === "skill") {
      toggleBattleSkillMenu();
    } else if (action) {
      sendBattleAction(action);
    }
    event.preventDefault();
    return;
  }
  const direction = screenDirectionForKey(key, event.code);
  if (!direction) return;
  event.preventDefault();
  routeToken += 1;
  walkPlayer(direction[0], direction[1]);
}

function onGameKeyUp(event) {
  const keyId = movementKeyId(event.key, event.code);
  if (keyId) pressedMoveKeys.delete(keyId);
}

function clearPressedMoveKeys() {
  pressedMoveKeys.clear();
}

function screenDirectionForKey(key, code = "") {
  const keyId = movementKeyId(key, code);
  if (!keyId) return null;
  pressedMoveKeys.add(keyId);
  const dir = pressedScreenDirection();
  return directionDelta(dir);
}

function movementKeyId(key, code = "") {
  const codeId = String(code || "").toLowerCase();
  if (SCREEN_KEY_VECTORS[codeId]) return codeId;
  const keyId = String(key || "").toLowerCase();
  if (SCREEN_KEY_VECTORS[keyId]) return keyId;
  return "";
}

function pressedScreenDirection() {
  let sx = 0;
  let sy = 0;
  for (const key of pressedMoveKeys) {
    const vector = SCREEN_KEY_VECTORS[key];
    if (!vector) continue;
    sx += vector[0];
    sy += vector[1];
  }
  const screenX = Math.sign(sx);
  const screenY = Math.sign(sy);
  return SCREEN_VECTOR_DIRECTIONS[`${screenX},${screenY}`];
}

function directionDelta(dir) {
  if (dir === undefined || dir === null) return null;
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
  const epoch = rescueEpoch;
  const requestedServerDir = serverDirectionForDelta(dx, dy);
  const before = {
    mapId: game.location.mapId,
    x: game.location.x,
    y: game.location.y
  };
  try {
    const nextGame = await api("/api/game/walk", { game, dx, dy });
    if (epoch !== rescueEpoch) return false;
    game = nextGame;
    const moved = before.mapId !== game.location.mapId || before.x !== game.location.x || before.y !== game.location.y;
    const animDir = clientAnimDirectionFromServerDir(currentServerDirection(requestedServerDir));
    if (moved && before.mapId === game.location.mapId) {
      startPlayerWalkAnimation(animDir, playerTilePoint(before), game.location);
      mapView.centerOnNextRender = false;
    } else {
      facePlayerDirection(animDir);
      mapView.centerOnNextRender = before.mapId !== game.location.mapId;
    }
    save();
    render();
    return moved;
  } finally {
    walkInFlight = false;
  }
}

async function turnPlayer(face) {
  if (!game || !face) return false;
  const epoch = rescueEpoch;
  try {
    const dir = Number(face.dir);
    const payload = {
      game,
      dx: Number(face.dx) || 0,
      dy: Number(face.dy) || 0
    };
    if (Number.isFinite(dir)) payload.dir = dir;
    const nextGame = await api("/api/game/turn", payload);
    if (epoch !== rescueEpoch) return false;
    game = nextGame;
    facePlayerDirection(clientAnimDirectionFromServerDir(currentServerDirection()));
    save();
    render();
    return true;
  } catch (error) {
    addClientLog(error.message || "无法转向。");
    return false;
  }
}

function startPlayerWalkAnimation(dir, from = game?.location, to = game?.location) {
  setPlayerDirection(dir);
  playerAnimState.startedAt = performance.now();
  playerAnimState.walkUntil = playerAnimState.startedAt + PLAYER_WALK_ANIM_MS;
  playerAnimState.moveUntil = playerAnimState.startedAt + PLAYER_WALK_MOVE_MS;
  playerAnimState.followCamera = true;
  playerAnimState.mapId = to?.mapId || game?.location?.mapId || null;
  playerAnimState.fromX = Number(from?.x ?? to?.x ?? 0);
  playerAnimState.fromY = Number(from?.y ?? to?.y ?? 0);
  playerAnimState.toX = Number(to?.x ?? from?.x ?? 0);
  playerAnimState.toY = Number(to?.y ?? from?.y ?? 0);
  followPlayerCamera();
  invalidatePlayerSpriteRender();
  schedulePlayerAnimTick();
}

function facePlayerDirection(dir) {
  setPlayerDirection(dir);
  playerAnimState.walkUntil = 0;
  playerAnimState.moveUntil = 0;
  playerAnimState.followCamera = false;
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

function followPlayerCamera() {
  if (!playerAnimState.followCamera || !game?.world?.map) return;
  centerMapOnPlayer();
  applyMapView();
}

function schedulePlayerAnimTick() {
  if (playerAnimState.raf) return;
  playerAnimState.raf = requestAnimationFrame(() => {
    playerAnimState.raf = 0;
    followPlayerCamera();
    invalidatePlayerSpriteRender();
    if (performance.now() < playerAnimState.walkUntil) {
      schedulePlayerAnimTick();
    } else {
      playerAnimState.followCamera = false;
    }
  });
}

async function followRouteTo(target, routeData = null) {
  if (!game) return;
  if (isBattleOpen()) {
    if (automationState().autoEscape) {
      const escaped = await autoEscapeCurrentBattle({ routeToken });
      if (!escaped) return false;
    } else {
      addClientLog("战斗中无法移动。");
      return false;
    }
  }
  if (routeInFlight) {
    routeToken += 1;
  }
  const token = ++routeToken;
  routeInFlight = true;
  try {
    if (!await waitForWalkSlot(token)) return false;
    let data = routeData || await api("/api/game/route", { game, targetX: target.x, targetY: target.y });
    const initialFace = routeData?.face || null;
    for (let attempt = 0; attempt < ROUTE_RETRY_LIMIT; attempt += 1) {
      if (attempt > 0) data = await api("/api/game/route", { game, targetX: target.x, targetY: target.y });
      const route = Array.isArray(data.route) ? data.route : [];
      const routeTarget = data.target || target;
      if (!route.length) {
        if (data.blocked) addClientLog("那里无法通行。");
        const face = data.face || initialFace;
        if (face && token === routeToken) return turnPlayer(face);
        return !data.blocked || isAtRouteTarget(routeTarget);
      }
      let shouldRetry = false;
      for (const step of route) {
        if (token !== routeToken) return false;
        if (!await waitForWalkSlot(token)) return false;
        const beforeMap = game.location.mapId;
        const moved = await walkPlayer(step.dx, step.dy);
        if (game.location.mapId !== beforeMap) return moved;
        if (!moved) {
          shouldRetry = true;
          break;
        }
        if (game.encounter && !await resolveRouteEncounter(token)) return false;
        await wait(85);
      }
      if (shouldRetry && attempt < ROUTE_RETRY_LIMIT - 1) continue;
      const face = data.face || initialFace;
      if (face && token === routeToken) return turnPlayer(face);
      if (isAtRouteTarget(routeTarget)) return true;
      if (attempt < ROUTE_RETRY_LIMIT - 1) continue;
      if (shouldRetry) addClientLog("路线中途被挡住，已重新计算但仍无法到达。");
      return false;
    }
    return false;
  } catch (error) {
    addClientLog(error.message || "无法计算路线。");
    return false;
  } finally {
    if (token === routeToken) routeInFlight = false;
  }
}

function isAtRouteTarget(target) {
  if (!game || !target) return false;
  return Number(game.location.x) === Number(target.x) && Number(game.location.y) === Number(target.y);
}

async function resolveRouteEncounter(token) {
  if (!game?.encounter) return true;
  if (!automationState().autoEscape) {
    addClientLog("路上遇敌，路线暂停。开启自动逃跑后会逃跑并继续原路线。");
    return false;
  }
  addClientLog("自动逃跑：路上遇敌，先逃跑再继续路线。");
  return autoEscapeCurrentBattle({ routeToken: token });
}

async function waitForWalkSlot(token, timeoutMs = 800) {
  const startedAt = performance.now();
  while (walkInFlight && token === routeToken && performance.now() - startedAt < timeoutMs) {
    await wait(16);
  }
  return token === routeToken && !walkInFlight;
}

function ensureAutomationState() {
  if (!game) return { autoLevel: false, autoEscape: false };
  game.automation ||= {};
  game.automation.autoLevel = Boolean(game.automation.autoLevel);
  game.automation.autoEscape = Boolean(game.automation.autoEscape);
  game.automation.updatedAt ||= Date.now();
  return game.automation;
}

function automationState() {
  return ensureAutomationState();
}

function setAutomationMode(mode, enabled, options = {}) {
  if (!game) return;
  const state = automationState();
  if (mode === "level") {
    state.autoLevel = Boolean(enabled);
    if (state.autoLevel) state.autoEscape = false;
  } else if (mode === "escape") {
    state.autoEscape = Boolean(enabled);
    if (state.autoEscape) state.autoLevel = false;
  }
  state.updatedAt = Date.now();
  state.lastNoticeKey = "";
  if (!options.silent) addClientLog(automationModeLogLine(mode, Boolean(enabled)));
  save();
  render();
  scheduleAutomationTick(120);
}

function automationModeLogLine(mode, enabled) {
  if (mode === "level") {
    return enabled
      ? "自动练级已开启：到可遇敌地图后会自动找敌并按原战斗结算攻击。"
      : "自动练级已关闭。";
  }
  return enabled
    ? "自动逃跑已开启：跑图遇敌会自动逃跑，成功后继续原路线。"
    : "自动逃跑已关闭。";
}

function automationModeTitle() {
  const state = automationState();
  if (state.autoLevel) return "自动练级运行中";
  if (state.autoEscape) return "自动逃跑待命";
  return "自动辅助未开启";
}

function automationModeDetail() {
  const state = automationState();
  if (state.autoLevel) {
    if (game?.encounter) return "正在自动按攻击结算战斗，经验来自原战斗结果。";
    if (game?.world?.map?.canWildEncounter) return "当前地图可遇敌，会自动寻找敌人并战斗。";
    return "会等待你走到可遇敌地图后自动开始。";
  }
  if (state.autoEscape) {
    if (game?.encounter) return "正在尝试逃跑。";
    return "寻路或跑图遇敌时会自动逃跑，成功后继续原路线。";
  }
  return "可在这里开启自动练级或跑图自动逃跑。";
}

function scheduleAutomationTick(delay = AUTOMATION_TICK_MS) {
  window.clearTimeout(automationTimer);
  automationTimer = 0;
  if (!game || els.game.hidden) return;
  const state = automationState();
  if (!state.autoLevel && !state.autoEscape) return;
  automationTimer = window.setTimeout(() => {
    automationTimer = 0;
    runAutomationTick();
  }, delay);
}

async function runAutomationTick() {
  if (!game || els.game.hidden || automationInFlight) {
    scheduleAutomationTick(AUTOMATION_TICK_MS);
    return;
  }
  const state = automationState();
  if (!state.autoLevel && !state.autoEscape) return;
  if (game.dialog?.open) {
    scheduleAutomationTick(AUTOMATION_TICK_MS);
    return;
  }
  if (game.encounter) {
    if (state.autoEscape) {
      await autoEscapeCurrentBattle();
    } else if (state.autoLevel) {
      await runAutomationBattleAction("attack", "自动练级");
    }
    scheduleAutomationTick(game.encounter ? AUTOMATION_BATTLE_STEP_MS : AUTOMATION_TICK_MS);
    return;
  }
  if (!state.autoLevel) return;
  if (routeInFlight || walkInFlight) {
    scheduleAutomationTick(240);
    return;
  }
  if (!autoLevelCanStartHere()) {
    scheduleAutomationTick(AUTOMATION_TICK_MS);
    return;
  }
  await startAutoLevelEncounter();
  scheduleAutomationTick(game.encounter ? 180 : AUTOMATION_TICK_MS);
}

function autoLevelCanStartHere() {
  const state = automationState();
  const map = game?.world?.map;
  if (!state.autoLevel || !map) return false;
  const activePet = getActivePet();
  if (!activePet || Number(activePet.Hp ?? activePet.WorkMaxHp ?? 0) <= 0 || Number(game.player?.hp || 0) <= 0) {
    automationNoticeOnce("auto-level-no-pet", "自动练级暂停：需要人物和出战宠物保持可战斗状态。");
    return false;
  }
  if (!map.canWildEncounter) {
    automationNoticeOnce(`auto-level-map:${map.id}`, "自动练级等待中：当前地图安全或没有野外遇敌，走到野外区域后会自动开始。");
    return false;
  }
  if (noEncounterEffectText()) {
    automationNoticeOnce("auto-level-no-encounter-effect", "自动练级等待中：当前有避敌效果。");
    return false;
  }
  return true;
}

function automationNoticeOnce(key, text) {
  const state = automationState();
  if (state.lastNoticeKey === key) return;
  state.lastNoticeKey = key;
  addClientLog(text);
}

async function startAutoLevelEncounter() {
  if (automationInFlight || !game || game.encounter) return false;
  automationInFlight = true;
  try {
    game = await api("/api/game/encounter", { game });
    automationState().lastNoticeKey = "";
    save();
    render();
    return true;
  } catch (error) {
    automationNoticeOnce(`auto-level-error:${game?.world?.map?.id || ""}`, error.message || "自动练级无法在当前地图遇敌。");
    return false;
  } finally {
    automationInFlight = false;
  }
}

async function autoEscapeCurrentBattle(options = {}) {
  let attempts = 0;
  while (game?.encounter && attempts < AUTOMATION_ROUTE_ESCAPE_LIMIT) {
    if (options.routeToken !== undefined && options.routeToken !== routeToken) return false;
    attempts += 1;
    const outcome = await runAutomationBattleAction("escape", "自动逃跑");
    if (!outcome) return false;
    if (!game?.encounter) {
      addClientLog(options.routeToken !== undefined ? "自动逃跑成功，继续原路线。" : "自动逃跑成功。");
      return true;
    }
    await wait(AUTOMATION_BATTLE_STEP_MS);
  }
  if (game?.encounter) addClientLog("自动逃跑连续失败，路线暂停，避免硬吃伤害。");
  return !game?.encounter;
}

async function runAutomationBattleAction(action, label) {
  if (!game?.encounter || automationInFlight) return null;
  automationInFlight = true;
  battlePendingAction = action;
  renderBattlePanel();
  try {
    const nextGame = await api("/api/game/battle", { game, action });
    const outcome = nextGame.battleOutcome || nextGame.lastBattleOutcome || null;
    game = nextGame;
    if (outcome?.result === "defeat") {
      automationState().autoLevel = false;
      addClientLog(`${label}停止：战斗失败，请治疗后再继续。`);
    }
    battleItemMenuOpen = false;
    battleSkillMenuOpen = false;
    battlePetMenuOpen = false;
    battlePendingAction = "";
    save();
    render();
    return outcome;
  } catch (error) {
    battlePendingAction = "";
    addClientLog(error.message || `${label}失败。`);
    renderBattlePanel();
    return null;
  } finally {
    automationInFlight = false;
  }
}

async function returnToSavePoint() {
  if (!game) return;
  if (isBattleOpen()) {
    addClientLog("战斗中不能返回记录点。");
    return;
  }
  rescueEpoch += 1;
  routeToken += 1;
  routeInFlight = false;
  battlePendingAction = "";
  clearPressedMoveKeys();
  try {
    game = await api("/api/game/return-savepoint", { game });
    mapView.centerOnNextRender = true;
    playerAnimState.active = false;
    save();
    render();
  } catch (error) {
    addClientLog(error.message || "返回记录点失败。");
  }
}

async function goToNpc(npcId, options = {}) {
  if (isBattleOpen()) {
    addClientLog("战斗中无法和 NPC 对话。");
    return;
  }
  const openWhenNear = Boolean(options.openWhenNear);
  const preferredTile = normalizeRoutePreference(options.preferredTile);
  const map = game?.world?.map;
  const npc = map?.npcs?.find((item) => item.id === npcId);
  if (!npc) return;
  if (cellDistance(game.location.x, game.location.y, npc.x, npc.y) <= 2) {
    await faceNpc(npc);
    if (openWhenNear) await openDialog(npc.id);
    else addClientLog(`已面对 ${npc.name}。双击 NPC 开始对话。`);
    return;
  }
  let approach;
  try {
    const payload = { game, npcId: npc.id };
    if (preferredTile) {
      payload.targetX = preferredTile.x;
      payload.targetY = preferredTile.y;
    }
    approach = await api("/api/game/route-npc", payload);
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
  if (reached && stillNear) {
    if (openWhenNear) await openDialog(npc.id);
    else addClientLog(`已靠近 ${npc.name}。双击 NPC 开始对话。`);
  }
}

async function faceNpc(npc) {
  if (!game || !npc) return;
  try {
    game = await api("/api/game/turn", {
      game,
      dx: Number(npc.x || 0) - Number(game.location.x || 0),
      dy: Number(npc.y || 0) - Number(game.location.y || 0)
    });
    save();
    render();
  } catch {
    // Facing is a client comfort action; failed facing should not block NPC interaction.
  }
}

async function goToExit(exitId, options = {}) {
  if (isBattleOpen()) {
    addClientLog("战斗中无法移动到出口。");
    return;
  }
  const preferredTile = normalizeRoutePreference(options.preferredTile);
  const map = game?.world?.map;
  const exit = map?.exits?.find((item) => item.id === exitId);
  if (!exit) return;
  try {
    const payload = { game, exitId: exit.id };
    if (preferredTile) {
      payload.targetX = preferredTile.x;
      payload.targetY = preferredTile.y;
    }
    const approach = await api("/api/game/route-exit", payload);
    if (approach.blocked || !approach.target) {
      addClientLog(`无法到达 ${exit.label}。`);
      return;
    }
    followRouteTo(approach.target, approach);
  } catch (error) {
    addClientLog(error.message || `无法到达 ${exit.label}。`);
  }
}

async function paidJumpTo(kind, id, options = {}) {
  if (!game) return;
  if (isBattleOpen()) {
    addClientLog("战斗中不能付费跳转。");
    return;
  }
  routeToken += 1;
  routeInFlight = false;
  clearPressedMoveKeys();
  try {
    const payload = { game, kind, id };
    const preferredTile = normalizeRoutePreference(options.preferredTile);
    if (preferredTile) {
      payload.targetX = preferredTile.x;
      payload.targetY = preferredTile.y;
    }
    game = await api("/api/game/paid-jump", payload);
    playerAnimState.active = false;
    mapView.centerOnNextRender = true;
    save();
    render();
  } catch (error) {
    addClientLog(error.message || "付费跳转失败。");
  }
}

function handleMapExitClick(exit, options = {}) {
  if (!exit) return;
  if (exit.closedProfile) {
    const target = exit.toName || exit.to || "目标地图";
    addClientLog(`这个入口通往 ${target}，当前内容 profile 暂未开放。`);
    return;
  }
  goToExit(exit.id, options);
}

function normalizeRoutePreference(tile) {
  const x = Number(tile?.x);
  const y = Number(tile?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x: Math.trunc(x), y: Math.trunc(y) };
}

function cellDistance(ax, ay, bx, by) {
  return Math.max(Math.abs(Number(ax || 0) - Number(bx || 0)), Math.abs(Number(ay || 0) - Number(by || 0)));
}

function mapContentPointFromPointer(event) {
  const rect = els.mapCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - mapView.panX) / mapView.zoom,
    y: (event.clientY - rect.top - mapView.panY) / mapView.zoom
  };
}

function mapTileFromPointer(event) {
  if (!game?.world?.map) return null;
  const { x: contentX, y: contentY } = mapContentPointFromPointer(event);
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
  const rawX = (screenX / 32 - screenY / 24) / 2;
  const rawY = (screenX / 32 + screenY / 24) / 2;
  return nearestIsoTile(width, height, rawX, rawY, screenX, screenY);
}

function nearestIsoTile(width, height, rawX, rawY, screenX, screenY) {
  let best = null;
  const baseX = Math.floor(rawX);
  const baseY = Math.floor(rawY);
  for (let y = baseY - 1; y <= baseY + 2; y += 1) {
    for (let x = baseX - 1; x <= baseX + 2; x += 1) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const [cx, cy] = isoPoint(x, y, 32, 24);
      const nx = (screenX - cx) / 32;
      const ny = (screenY - cy) / 24;
      const score = nx * nx + ny * ny;
      if (!best || score < best.score) best = { x, y, score };
    }
  }
  return best
    ? { x: best.x, y: best.y }
    : {
      x: Math.max(0, Math.min(width - 1, Math.round(rawX))),
      y: Math.max(0, Math.min(height - 1, Math.round(rawY)))
    };
}

function onMapPointerMove(event) {
  if (!mapView.dragging) {
    setMapHoverTile(mapTileFromPointer(event));
    return;
  }
  if (mapView.holdMoveActive) {
    setMapHoverTile(mapTileFromPointer(event));
    return;
  }
  const dx = event.clientX - mapView.startX;
  const dy = event.clientY - mapView.startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    mapView.moved = true;
    clearMapHoldMove();
  }
  mapView.panX = mapView.startPanX + dx;
  mapView.panY = mapView.startPanY + dy;
  clampMapPan();
  applyMapView();
}

function onMapPointerUp(event) {
  if (!mapView.dragging) return;
  const wasHoldMove = mapView.holdMoveActive;
  clearMapHoldMove({ suppressClick: wasHoldMove });
  mapView.dragging = false;
  els.mapCanvas.classList.remove("dragging");
  if (els.mapCanvas.hasPointerCapture(event.pointerId)) {
    els.mapCanvas.releasePointerCapture(event.pointerId);
  }
  setTimeout(() => {
    mapView.moved = false;
  }, 0);
}

function onMapPointerLeave() {
  if (mapView.dragging) return;
  setMapHoverTile(null);
}

function beginMapHoldMove() {
  if (!game || !mapView.dragging || mapView.moved || !mapView.hoverTile) return;
  mapView.holdMoveActive = true;
  mapView.suppressNextClick = true;
  mapView.holdMoveLastKey = "";
  els.mapCanvas.classList.add("map-move-hold");
  pulseMapHoldMove(true);
  mapView.holdMoveInterval = window.setInterval(() => pulseMapHoldMove(), MOVE_CLICK_WAIT_TIME);
}

function pulseMapHoldMove(force = false) {
  if (!mapView.holdMoveActive || !game?.world?.map || !mapView.hoverTile) return;
  const tile = mapView.hoverTile;
  if (tile.mapId !== game.world.map.id) return;
  const key = `${tile.mapId}:${tile.x},${tile.y}`;
  if (!force && key === mapView.holdMoveLastKey) return;
  mapView.holdMoveLastKey = key;
  followRouteTo({ x: tile.x, y: tile.y });
}

function clearMapHoldMove({ suppressClick = false } = {}) {
  if (mapView.holdMoveTimer) {
    window.clearTimeout(mapView.holdMoveTimer);
    mapView.holdMoveTimer = 0;
  }
  if (mapView.holdMoveInterval) {
    window.clearInterval(mapView.holdMoveInterval);
    mapView.holdMoveInterval = 0;
  }
  if (suppressClick || mapView.holdMoveActive) mapView.suppressNextClick = true;
  mapView.holdPointerId = null;
  mapView.holdMoveActive = false;
  mapView.holdMoveLastKey = "";
  els.mapCanvas.classList.remove("map-move-hold");
}

function setMapHoverTile(tile) {
  const next = tile && game?.world?.map
    ? { mapId: game.world.map.id, x: Number(tile.x), y: Number(tile.y) }
    : null;
  if (
    mapView.hoverTile?.mapId === next?.mapId
    && mapView.hoverTile?.x === next?.x
    && mapView.hoverTile?.y === next?.y
  ) return;
  mapView.hoverTile = next;
  syncMapCursor(game?.world?.map);
}

function syncMapCursor(map) {
  const cursor = els.mapCanvas.querySelector(".map-grid-cursor");
  if (!cursor) return;
  const tile = mapView.hoverTile;
  if (!map || !tile || tile.mapId !== map.id) {
    cursor.hidden = true;
    return;
  }
  const [x, y] = mapClientPoint(map, tile.x, tile.y);
  cursor.style.left = `${Math.round(x)}px`;
  cursor.style.top = `${Math.round(y)}px`;
  cursor.hidden = false;
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
  const visualFallback = await loadClientMapVisualFallback(map, width, height, tileAt);
  const visualTileAt = visualFallback?.tileAt || tileAt;
  const atlas = await loadTileAtlas(map);
  if (renderVersion !== mapRenderVersion) return;
  if (atlas) {
    drawViewportTileMap(canvas, width, height, visualTileAt, atlas, map, visualFallback?.label || "client DAT viewport", renderVersion);
    return;
  }
  if (width * height > REAL_TILE_CELL_LIMIT) {
    drawLargeIsoPreview(canvas, width, height, visualTileAt, map, visualFallback?.label || "client DAT overview");
    return;
  }
  drawTilePreview(canvas, width, height, visualTileAt);
}

async function loadClientMapVisualFallback(map, width, height, clientTileAt) {
  if (!map?.mapFile) return null;
  const cells = width * height;
  if (!cells) return null;
  let missingGround = 0;
  for (let index = 0; index < cells; index += 1) {
    if (clientTileAt(index)[0] <= CG_INVISIBLE) missingGround += 1;
  }
  if (missingGround / cells < 0.05) return null;
  try {
    const rsp = await fetch(map.mapFile);
    if (!rsp.ok) return null;
    const fallback = parseLs2MapReader(await rsp.arrayBuffer());
    if (!fallback || fallback.width !== width || fallback.height !== height) return null;
    let groundFill = 0;
    let objectFill = 0;
    for (let index = 0; index < cells; index += 1) {
      const [ground, object] = clientTileAt(index);
      const [fallbackGround, fallbackObject] = fallback.tileAt(index);
      if (ground <= CG_INVISIBLE && fallbackGround > CG_INVISIBLE) groundFill += 1;
      if (!isStaticMapObjectTile(object) && isStaticMapObjectTile(fallbackObject)) objectFill += 1;
    }
    if (!groundFill && !objectFill) return null;
    return {
      label: `client DAT viewport + LS2 visual fallback`,
      tileAt(index) {
        const [ground, object, overlay] = clientTileAt(index);
        const [fallbackGround, fallbackObject] = fallback.tileAt(index);
        return [
          ground > CG_INVISIBLE ? ground : fallbackGround,
          isStaticMapObjectTile(object) ? object : fallbackObject,
          overlay
        ];
      }
    };
  } catch {
    return null;
  }
}

function parseLs2MapReader(buf) {
  const view = new DataView(buf);
  const magic = String.fromCharCode(...new Uint8Array(buf.slice(0, 6)));
  if (magic !== "LS2MAP") return null;
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
  const cells = width * height;
  const groundOffset = 44;
  const objectOffset = groundOffset + cells * 2;
  if (!width || !height || objectOffset > view.byteLength) return null;
  return {
    width,
    height,
    tileAt(index) {
      const tileOffset = groundOffset + index * 2;
      const partOffset = objectOffset + index * 2;
      return [
        tileOffset + 1 < view.byteLength ? view.getUint16(tileOffset, false) : 0,
        partOffset + 1 < view.byteLength ? view.getUint16(partOffset, false) : 0,
        0
      ];
    }
  };
}

async function loadTileAtlas(map = null) {
  const profileAtlas = await loadProfileTileAtlasForMap(map);
  if (profileAtlas) return profileAtlas;
  return loadMonolithicTileAtlas();
}

async function loadProfileTileAtlasForMap(map) {
  if (profileAtlasState.disabled) return null;
  const plan = await loadProfilePackPlan();
  if (!plan?.runtimeManifestSketch) return null;
  const floor = Number(map?.floorId);
  if (!Number.isFinite(floor)) return null;
  const packPaths = requiredPackPathsForFloor(plan, floor);
  if (!packPaths.length) return null;
  try {
    await ensureProfilePacksLoaded(packPaths);
    const atlas = atlasWithProfileFrames(null, "profile packs");
    setLoadedTileAtlas(atlas);
    hydrateAtlasSprites(atlas);
    return atlas;
  } catch {
    profileAtlasState.disabled = true;
    return null;
  }
}

async function loadProfilePackPlan() {
  if (!profilePackPlanPromise) {
    profilePackPlanPromise = (async () => {
      const rsp = await fetch(PROFILE_PACK_PLAN_PATH);
      if (!rsp.ok) return null;
      const plan = await rsp.json();
      return {
        ...plan,
        __url: new URL(PROFILE_PACK_PLAN_PATH, window.location.origin).toString()
      };
    })().catch(() => null);
  }
  return profilePackPlanPromise;
}

function requiredPackPathsForFloor(plan, floor) {
  const sketch = plan.runtimeManifestSketch || {};
  const floorKey = String(floor);
  const floorPacks = sketch.floors?.[floorKey]?.packs || [];
  const all = [
    ...(sketch.bootPacks || []),
    ...(sketch.sharedPacks || []),
    ...floorPacks
  ];
  return [...new Set(all
    .map((entry) => String(entry || "").trim())
    .filter(Boolean)
    .map((entry) => resolvePackUrl(plan.__url, entry)))];
}

function resolvePackUrl(planUrl, ref) {
  if (!planUrl) return ref;
  return new URL(ref, planUrl).toString();
}

async function ensureProfilePacksLoaded(packManifestUrls) {
  await Promise.all(packManifestUrls.map((manifestUrl) => loadProfilePackManifest(manifestUrl)));
}

async function loadProfilePackManifest(manifestUrl) {
  if (profileAtlasState.loadedPacks.has(manifestUrl)) return;
  if (profileAtlasState.loadingPacks.has(manifestUrl)) {
    await profileAtlasState.loadingPacks.get(manifestUrl);
    return;
  }
  const task = (async () => {
    const rsp = await fetch(manifestUrl);
    if (!rsp.ok) throw new Error(`pack manifest missing: ${manifestUrl}`);
    const manifest = await rsp.json();
    const imageUrl = new URL(manifest.image || "", manifestUrl).toString();
    const image = new Image();
    image.decoding = "async";
    image.src = imageUrl;
    await decodeImageWithFallback(image);
    const frames = parsePackFrames(manifest, image);
    for (const frame of frames) {
      profileAtlasState.frames[frame.id] = frame;
    }
    profileAtlasState.loadedPacks.add(manifestUrl);
  })();
  profileAtlasState.loadingPacks.set(manifestUrl, task);
  try {
    await task;
  } finally {
    profileAtlasState.loadingPacks.delete(manifestUrl);
  }
}

function parsePackFrames(manifest, image) {
  const fields = manifest.fields || [];
  const index = Object.fromEntries(fields.map((field, i) => [field, i]));
  const frames = [];
  for (const row of manifest.frames || []) {
    const id = Number(row[index.id]);
    const x = Number(row[index.x]);
    const y = Number(row[index.y]);
    const width = Number(row[index.w]);
    const height = Number(row[index.h]);
    if (!Number.isFinite(id) || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) continue;
    frames.push({
      id,
      x,
      y,
      width,
      height,
      xoffset: Number(row[index.xo] ?? 0),
      yoffset: Number(row[index.yo] ?? 0),
      hit: Number(row[index.hit] ?? 0),
      prioType: Number(row[index.prio] ?? 0),
      bitmapNo: Number(row[index.bitmap] ?? 0),
      graphicNo: Number(row[index.graphic] ?? 0),
      atlasWidth: image.naturalWidth || image.width,
      atlasHeight: image.naturalHeight || image.height,
      image
    });
  }
  return frames;
}

function atlasWithProfileFrames(baseAtlas = loadedTileAtlas, modeSuffix = "profile packs") {
  const baseFrames = baseAtlas?.frames || {};
  const frames = {
    ...baseFrames,
    ...profileAtlasState.frames
  };
  return {
    ...(baseAtlas || {}),
    mode: baseAtlas?.mode ? `${baseAtlas.mode} + ${modeSuffix}` : modeSuffix,
    frames
  };
}

function setLoadedTileAtlas(atlas, options = {}) {
  loadedTileAtlas = atlas || null;
  if (!largeMapRenderer || !loadedTileAtlas) return loadedTileAtlas;
  largeMapRenderer.atlas = loadedTileAtlas;
  if (options.spritesOnly) {
    scheduleLargeMapSpriteRender();
  } else {
    largeMapRenderer.lastKey = "";
    scheduleLargeMapRender();
  }
  return loadedTileAtlas;
}

async function decodeImageWithFallback(image) {
  await image.decode().catch(() => new Promise((resolve, reject) => {
    if (image.complete && image.naturalWidth > 0) {
      resolve();
      return;
    }
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", reject, { once: true });
  }));
}

async function loadMonolithicTileAtlas() {
  if (!tileAtlasPromise) {
    tileAtlasPromise = (async () => {
      const rsp = await fetch(TILE_ATLAS_MANIFEST);
      if (!rsp.ok) return null;
      const manifest = await rsp.json();
      const image = new Image();
      image.decoding = "async";
      image.src = manifest.image;
      await decodeImageWithFallback(image);
      setLoadedTileAtlas({ ...manifest, mode: "monolithic atlas", image });
      hydrateAtlasSprites(loadedTileAtlas);
      return loadedTileAtlas;
    })().catch(() => null);
  }
  return tileAtlasPromise;
}

function hydrateAtlasSprites(atlas = loadedTileAtlas, root = document) {
  if (!atlas) return;
  const missingIds = new Set();
  atlasSpriteNodes(root).forEach((el) => {
    const resolvedId = resolvedAtlasSpriteId(el);
    if (resolvedId > 0 && String(resolvedId) !== String(el.dataset.atlasSprite || "")) {
      el.dataset.atlasSprite = String(resolvedId);
    }
    const frame = applyAtlasSprite(el, atlas, el.dataset.atlasSprite);
    const id = Number(el.dataset.atlasSprite || 0);
    if (!frame && Number.isFinite(id) && id > 0) missingIds.add(id);
  });
  if (root === document) refreshAtlasButtonSprites(atlas);
  if (missingIds.size) {
    void ensureProfileAtlasFramesLoaded([...missingIds]).then((loaded) => {
      if (!loaded) return;
      const nextAtlas = atlasWithProfileFrames(atlas || loadedTileAtlas);
      setLoadedTileAtlas(nextAtlas, { spritesOnly: true });
      hydrateAtlasSprites(nextAtlas, root);
    });
  }
}

function atlasSpriteNodes(root = document) {
  const nodes = [];
  if (root?.matches?.("[data-atlas-sprite]")) nodes.push(root);
  root?.querySelectorAll?.("[data-atlas-sprite]").forEach((el) => nodes.push(el));
  return nodes;
}

function resolvedAtlasSpriteId(el) {
  const sourceSprite = Number(el?.dataset?.sourceSprite || 0);
  if (Number.isFinite(sourceSprite) && sourceSprite >= SPR_START) {
    const sourceDir = Number(el.dataset.sourceDir);
    return sourceFieldSpriteTileId(sourceSprite, {
      fallback: Number(el.dataset.atlasFallback || el.dataset.atlasSprite || sourceSprite),
      dir: Number.isFinite(sourceDir) ? sourceDir : undefined
    });
  }
  return Number(el?.dataset?.atlasSprite || 0);
}

function sourceSpriteAttrs(spriteNo, fallback = spriteNo, options = {}) {
  const source = Number(spriteNo || 0);
  if (!Number.isFinite(source) || source < SPR_START) return "";
  const safeFallback = Number(fallback || source);
  const sourceDir = Number(options.dir);
  const dirAttr = Number.isFinite(sourceDir) ? ` data-source-dir="${normalizeDirection(sourceDir)}"` : "";
  return ` data-source-sprite="${source}" data-atlas-fallback="${Number.isFinite(safeFallback) ? safeFallback : source}"${dirAttr}`;
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
  const frameShell = el.closest?.(".atlas-sprite-frame");
  const image = frame?.image || atlas?.image;
  if (!frame || !image) {
    el.hidden = true;
    frameShell?.classList.add("missing");
    return null;
  }
  const atlasWidth = Number(frame.atlasWidth || atlas.atlasWidth || image.naturalWidth || image.width || frame.width);
  const atlasHeight = Number(frame.atlasHeight || atlas.atlasHeight || image.naturalHeight || image.height || frame.height);
  el.hidden = false;
  frameShell?.classList.remove("missing");
  el.style.width = `${frame.width}px`;
  el.style.height = `${frame.height}px`;
  el.style.backgroundImage = `url("${image.src}")`;
  el.style.backgroundSize = `${atlasWidth}px ${atlasHeight}px`;
  el.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
  return frame;
}

function requestPetFieldAnimations(spriteNo = 0) {
  if (petFieldAnimationState.disabled) return;
  void ensurePetFieldAnimationsLoaded().then((manifest) => {
    if (!manifest || !spriteNo) return null;
    return ensurePetFieldSpritePackLoaded(spriteNo);
  });
}

async function ensurePetFieldAnimationsLoaded() {
  if (petFieldAnimationState.disabled) return null;
  if (petFieldAnimationState.manifest) return petFieldAnimationState.manifest;
  if (petFieldAnimationState.loading) return petFieldAnimationState.loading;
  petFieldAnimationState.loading = (async () => {
    const rsp = await fetch(PET_FIELD_ANIMATION_MANIFEST);
    if (!rsp.ok) throw new Error(`pet field animation manifest missing: ${PET_FIELD_ANIMATION_MANIFEST}`);
    const manifest = await rsp.json();
    const manifestUrl = new URL(PET_FIELD_ANIMATION_MANIFEST, window.location.origin).toString();
    const packUrl = resolvePackUrl(manifestUrl, manifest.pack?.manifest || "");
    if (packUrl) await ensureProfilePacksLoaded([packUrl]);
    petFieldAnimationState.manifest = { ...manifest, __url: manifestUrl };
    setLoadedTileAtlas(atlasWithProfileFrames(loadedTileAtlas, "pet field animation"), { spritesOnly: true });
    hydrateAtlasSprites(loadedTileAtlas);
    invalidatePlayerSpriteRender();
    if (game) render();
    return petFieldAnimationState.manifest;
  })().catch(() => {
    petFieldAnimationState.disabled = true;
    return null;
  }).finally(() => {
    petFieldAnimationState.loading = null;
  });
  return petFieldAnimationState.loading;
}

async function ensurePetFieldSpritePackLoaded(spriteNo) {
  const id = Number(spriteNo || 0);
  if (!Number.isFinite(id) || id < SPR_START || petFieldAnimationState.disabled) return false;
  const manifest = await ensurePetFieldAnimationsLoaded();
  const sprite = manifest?.sprites?.[id];
  const packRef = sprite?.pack || sprite?.packs?.field || "";
  if (!packRef) {
    petFieldAnimationState.missingSprites.add(id);
    return false;
  }
  const packUrl = resolvePackUrl(manifest.__url || PET_FIELD_ANIMATION_MANIFEST, packRef);
  try {
    await ensureProfilePacksLoaded([packUrl]);
    setLoadedTileAtlas(atlasWithProfileFrames(loadedTileAtlas, "pet field animation"), { spritesOnly: true });
    hydrateAtlasSprites(loadedTileAtlas);
    invalidatePlayerSpriteRender();
    if (game) render();
    return true;
  } catch {
    petFieldAnimationState.missingSprites.add(id);
    return false;
  }
}

function sourceFieldSpriteTileId(spriteNo, options = {}) {
  const fallback = Number(options.fallback ?? spriteNo ?? 0);
  const id = Number(spriteNo || 0);
  if (!Number.isFinite(id) || id < SPR_START) return fallback;
  const manifest = petFieldAnimationState.manifest;
  if (!manifest?.sprites?.[id]) {
    if (!manifest || !petFieldAnimationState.missingSprites.has(id)) requestPetFieldAnimations(id);
    return fallback;
  }
  const frameId = petFieldAnimationFrameId(manifest.sprites[id], options);
  if (!frameId) return fallback;
  if (loadedTileAtlas?.frames?.[frameId] || profileAtlasState.frames?.[frameId]) return frameId;
  if (!petFieldAnimationState.missingSprites.has(id)) requestPetFieldAnimations(id);
  return fallback;
}

function petFieldAnimationFrameId(sprite, options = {}) {
  const action = options.action || "stand";
  const actionMap = sprite?.actions?.[action] || sprite?.actions?.stand || {};
  const dirs = Object.keys(actionMap).sort((a, b) => Number(a) - Number(b));
  if (!dirs.length) return 0;
  const dir = normalizeDirection(options.dir ?? DEFAULT_PLAYER_DIRECTION);
  const anim = actionMap[dir] || actionMap[DEFAULT_PLAYER_DIRECTION] || actionMap[dirs[0]];
  const frames = anim?.[2] || [];
  if (!frames.length) return 0;
  const frameMs = Math.max(50, Number(anim?.[1] || 160));
  const index = action === "walk" || options.animate
    ? Math.floor((options.now ?? performance.now()) / frameMs) % frames.length
    : 0;
  return Number(frames[index]?.[0] || frames[0]?.[0] || 0);
}

async function ensureProfileAtlasFramesLoaded(tileIds) {
  if (profileAtlasState.disabled) return false;
  const missing = uniqueNumbers(tileIds).filter((id) => !profileAtlasState.frames[id]);
  if (!missing.length) return false;
  const plan = await loadProfilePackPlan();
  if (!plan?.packs?.length) return false;
  const packUrls = profilePackUrlsForFrameIds(plan, missing);
  if (!packUrls.length) return false;
  try {
    await ensureProfilePacksLoaded(packUrls);
    return missing.some((id) => Boolean(profileAtlasState.frames[id]));
  } catch {
    return false;
  }
}

function profilePackUrlsForFrameIds(plan, tileIds) {
  const lookup = profileFramePackUrlMap(plan);
  const urls = new Set();
  for (const id of uniqueNumbers(tileIds)) {
    const candidates = lookup.get(id) || [];
    const preferred = candidates.find((item) => item.domain === "pet-field-animation")
      || candidates.find((item) => item.domain === "pets-static")
      || candidates.find((item) => item.domain === "pets-encounter")
      || candidates.find((item) => item.domain === "npc-field")
      || candidates[0];
    if (preferred?.url) urls.add(preferred.url);
  }
  return [...urls];
}

function profileFramePackUrlMap(plan) {
  if (profileAtlasState.framePackUrls && profileAtlasState.framePackPlanUrl === plan.__url) {
    return profileAtlasState.framePackUrls;
  }
  const map = new Map();
  for (const pack of plan.packs || []) {
    if (!pack?.manifest) continue;
    const url = resolvePackUrl(plan.__url, pack.manifest);
    for (const id of uniqueNumbers(pack.presentIds || pack.ids || [])) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push({ url, domain: pack.domain || "", id: pack.id || "" });
    }
  }
  profileAtlasState.framePackUrls = map;
  profileAtlasState.framePackPlanUrl = plan.__url;
  return map;
}

function uniqueNumbers(values) {
  return [...new Set((values || [])
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0))]
    .sort((a, b) => a - b);
}

function petSpriteMarkup(tileId, label = "", className = "", options = {}) {
  const source = Number(tileId || 0);
  const useFieldFrame = Boolean(options.fieldFrame);
  const id = useFieldFrame ? sourceFieldSpriteTileId(source, { fallback: source }) : source;
  const aria = label ? `role="img" aria-label="${escapeHtml(label)}"` : `aria-hidden="true"`;
  const missingLabel = useFieldFrame && source >= SPR_START ? `SpriteNo ${source}` : `ImgNo ${id || "-"}`;
  const spriteAttrs = useFieldFrame ? sourceSpriteAttrs(source, id) : "";
  return `
    <span class="atlas-sprite-frame ${className}" data-imgno="${source || id}" data-missing="${missingLabel}" ${aria}>
      <span class="client-atlas-sprite ui-atlas-sprite" data-atlas-sprite="${id}"${spriteAttrs} aria-hidden="true"></span>
    </span>
  `;
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
    if (isStaticMapObjectTile(object) && atlas.frames?.[object]) {
      sprites.push(mapDepthSprite(atlas, object, px, py, screenX, screenY, x, y, "part", order++));
    }
  }
  const npcSprites = collectNpcSprites(map, atlas, (npc, index) => {
    const [mapX, mapY] = mapRenderPoint(npc.x, npc.y, width, height);
    const [screenX, screenY] = isoPoint(mapX, mapY, halfW, halfH);
    return mapDepthSprite(
      atlas,
      npc.tileId,
      screenX - bounds.minX,
      screenY - bounds.minY,
      screenX,
      screenY,
      npc.x,
      npc.y,
      "char",
      order + index
    );
  });
  updateNpcSpriteHitboxes(npcSprites);
  sprites.push(...npcSprites);
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
  els.mapCanvas.dataset.mapSize = `${width} x ${height} | client drawMap + ${atlas.mode || "real atlas"}`;
  syncMapMarkers(game.world.map);
  centerMapOnPlayer();
  clampMapPan();
  applyMapView();
}

function collectNpcSprites(map, atlas, locate) {
  if (!map?.npcs?.length) return [];
  return map.npcs
    .map((npc) => ({ ...npc, graphicId: Number(npc.graphic) || 0 }))
    .map((npc) => ({
      ...npc,
      tileId: sourceFieldSpriteTileId(npc.graphicId, {
        dir: clientAnimDirectionFromServerDir(npc.dir ?? DEFAULT_PLAYER_DIRECTION),
        fallback: npc.graphicId
      })
    }))
    .filter((npc) => npc.tileId > CG_INVISIBLE && atlas.frames?.[npc.tileId])
    .map((npc, index) => {
      const sprite = locate(npc, index);
      return sprite ? { ...sprite, npcId: npc.id, npcName: npc.name } : null;
    })
    .filter(Boolean);
}

function collectPlayerSprites(map, atlas, locate) {
  if (!map || !game?.location) return [];
  const tileId = playerFrameTileId(atlas);
  if (tileId <= CG_INVISIBLE || !isUsablePlayerFrame(tileId, atlas.frames?.[tileId])) return [];
  return [locate(tileId)];
}

function playerFrameTileId(atlas = loadedTileAtlas, options = {}) {
  const now = performance.now();
  const dir = Number.isFinite(Number(options.dir)) ? normalizeDirection(Number(options.dir)) : playerAnimState.dir;
  const moving = !options.forceStand && now < playerAnimState.walkUntil;
  const frames = (moving ? PLAYER_WALK_FRAMES : PLAYER_STAND_FRAMES)[dir]
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

function isStaticMapObjectTile(tileId) {
  const id = Number(tileId || 0);
  return id > CG_INVISIBLE && !PLAYER_FRAME_IDS.has(id);
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
    ...map.npcs.map((npc) => [mapCanvasDataMarker("npc", npc.id), mapClientPoint(map, npc.x, npc.y)]),
    ...map.exits.map((exit) => [mapCanvasDataMarker("exit", exit.id), mapClientPoint(map, exit.x, exit.y)])
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

function mapCanvasDataMarker(kind, value) {
  const attr = kind === "exit" ? "exit" : "npc";
  const expected = String(value || "");
  return Array.from(els.mapCanvas.querySelectorAll(`[data-${attr}]`))
    .find((el) => String(el.dataset[attr] || "") === expected) || null;
}

function mapPixelBounds(width, height, tileAt, atlas, halfW, halfH) {
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [ground, object] = tileAt(y * width + x);
      const [mapX, mapY] = mapRenderPoint(x, y, width, height);
      const [px, py] = isoPoint(mapX, mapY, halfW, halfH);
      if (ground > CG_INVISIBLE) includeTileBounds(bounds, atlas.frames?.[ground], px, py);
      if (isStaticMapObjectTile(object)) includeTileBounds(bounds, atlas.frames?.[object], px, py);
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
  const sourceImage = frame.image || atlas.image;
  if (!sourceImage) return;
  const dx = Math.round(x + frame.xoffset);
  const dy = Math.round(y + frame.yoffset);
  ctx.save();
  ctx.translate(dx, dy + frame.height);
  ctx.scale(1, -1);
  ctx.drawImage(
    sourceImage,
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
  const reader = parseLs2MapReader(buf);
  if (!reader) throw new Error("invalid LS2MAP");
  const { width, height, tileAt } = reader;
  const atlas = await loadTileAtlas(map);
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
    if (isStaticMapObjectTile(object) && renderer.atlas.frames?.[object]) {
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
  updateNpcSpriteHitboxes(charSprites);
  order += charSprites.length;
  const sprites = [...charSprites];
  forEachClientDisplayTile(x1, y1, x2, y2, (x, y) => {
    const [, object] = renderer.tileAt(y * renderer.width + x);
    const [screenX, screenY] = mapTileContentPoint(renderer, x, y);
    if (isStaticMapObjectTile(object) && renderer.atlas.frames?.[object]) {
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

function updateNpcSpriteHitboxes(sprites = []) {
  const pad = 3;
  mapView.npcHitboxes = sprites
    .filter((sprite) => sprite.npcId)
    .map((sprite) => ({
      npcId: sprite.npcId,
      npcName: sprite.npcName || "",
      left: sprite.left - pad,
      top: sprite.top - pad,
      right: sprite.right + pad,
      bottom: sprite.bottom + pad,
      centerX: (sprite.left + sprite.right) / 2,
      centerY: (sprite.top + sprite.bottom) / 2,
      depth: Number(sprite.depth || 0),
      order: Number(sprite.order || 0)
    }));
}

function collectViewportCharSprites(renderer, order = 0) {
  const sprites = [];
  sprites.push(...collectNpcSprites(renderer.map, renderer.atlas, (npc, index) => {
    const [x, y] = mapTileContentPoint(renderer, npc.x, npc.y);
    return mapDepthSprite(
      renderer.atlas,
      npc.tileId,
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
        tileColor(ground > CG_INVISIBLE ? ground : 0, isStaticMapObjectTile(object) ? object : 0, overlay)
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
      const color = tileColor(ground > CG_INVISIBLE ? ground : 0, isStaticMapObjectTile(object) ? object : 0, overlay);
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

function renderAssistPanel(map) {
  if (!els.assistPanelBody) return;
  document.querySelectorAll("[data-assist-tab]").forEach((btn) => {
    const active = btn.dataset.assistTab === assistTab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  const renderers = {
    map: renderAssistMap,
    pets: renderAssistPets,
    items: renderAssistItems,
    character: renderAssistCharacter,
    knowledge: renderAssistKnowledge,
    debug: renderAssistDebug
  };
  const renderActive = renderers[assistTab] || renderAssistMap;
  els.assistPanelBody.innerHTML = renderActive(map);
  hydrateAtlasSprites(loadedTileAtlas, els.assistPanelBody);
}

function renderAssistMap(map) {
  return `
    <section class="assist-grid two">
      <div class="assist-pane">
        <div class="assist-pane-head">
          <h3>NPC</h3>
          ${renderSortBar("npc", npcSortMode)}
        </div>
        <div class="stack" data-assist-list="npc">
          ${renderNpcListHtml(map)}
        </div>
      </div>
      <div class="assist-pane">
        <div class="assist-pane-head">
          <h3>地图位置</h3>
          ${renderSortBar("exit", exitSortMode)}
        </div>
        <div class="stack" data-assist-list="exit">
          ${renderExitListHtml(map)}
        </div>
      </div>
    </section>
  `;
}

function renderNpcListHtml(map) {
  const npcs = sortMapPoints(map.npcs, npcSortMode, (npc) => pointDistance(npc.x, npc.y));
  return npcs.map((npc) => `
    <article class="list-btn assist-map-card" role="button" tabindex="0" data-npc="${escapeHtml(npc.id)}" title="${escapeHtml(`${npc.type || "NPC"} | (${npc.x}, ${npc.y})`)}">
      <div class="assist-map-card-main">
        <div class="assist-map-copy">
          <strong>${escapeHtml(npc.name)}</strong>
          ${renderNpcTags(npc)}
          <span>距离 ${formatCellDistance(npc.x, npc.y)}</span>
          ${renderNpcContextLines(npc)}
        </div>
        ${renderAssistMapActions("npc", npc.id, pointDistance(npc.x, npc.y))}
      </div>
    </article>
  `).join("") || `<p class="empty">当前地图没有 NPC。</p>`;
}

function renderAssistMapActions(kind, id, distance) {
  const normalizedKind = kind === "exit" ? "exit" : "npc";
  const escapedId = escapeHtml(id);
  const price = paidJumpCost(distance);
  return `
    <div class="assist-map-actions">
      <button class="assist-go-btn" type="button" data-assist-go-${normalizedKind}="${escapedId}">自动前往</button>
      <button class="assist-go-btn paid" type="button" data-assist-paid-jump-${normalizedKind}="${escapedId}" title="${escapeHtml(price > 0 ? `预计 ${price} 石币，Worker 会按实际距离校验扣费` : "已经在附近，不收跳转费")}">
        <span>付费跳转</span>
        <small>${price > 0 ? `${price} 石币` : "脚下"}</small>
      </button>
    </div>
  `;
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

function renderNpcContextLines(npc) {
  const lines = [];
  if (npc.questLead) lines.push(npc.questLead.summary || npc.questLead.title);
  const warpLine = npcWarpStatusLine(npc);
  if (warpLine) lines.push(warpLine);
  const scriptLine = npcScriptStatusLine(npc);
  if (scriptLine) lines.push(scriptLine);
  return lines.map((line) => `<small>${escapeHtml(line)}</small>`).join("");
}

function npcWarpStatusLine(npc) {
  const status = npc.warpStatus;
  if (!status) return "";
  const target = status.target?.mapName || (status.target?.mapId ? `floor ${status.target.mapId}` : "目标地图");
  if (!status.target?.loaded) return `传送目标 ${target} 尚未打包进 Worker 地图集`;
  if (status.ok && status.free) return `可传送：${target}${status.freeSpec ? " | FREE 条件已满足" : ""}`;
  if (status.ok) return `${status.affordable ? "可付费传送" : "石币不足"}：${target}${status.cost ? ` | 需要 ${status.cost} 石币` : ""}`;
  const unmet = (status.unmet || []).map(conditionCheckLabel).filter(Boolean).join("、");
  return `条件未满足：${unmet || status.freeSpec || "脚本条件"} | 目标 ${target}`;
}

function npcScriptStatusLine(npc) {
  const status = npc.scriptStatus;
  if (!status?.conditions?.length) return "";
  const ready = status.conditions.find((condition) => condition.ok);
  if (ready) return `脚本条件：有可执行分支 | ${ready.kind}`;
  const blocked = status.conditions.find((condition) => condition.unmet?.length) || status.conditions[0];
  const unmet = (blocked.unmet || []).map(conditionCheckLabel).filter(Boolean).join("、");
  return `脚本条件未满足：${unmet || blocked.source || "事件条件"}`;
}

function conditionCheckLabel(check) {
  if (!check) return "";
  if (check.type === "item") {
    const name = check.itemName ? `「${check.itemName}」` : check.itemId;
    return `道具 ${name} ${Number(check.qty || 0)}/${Number(check.needed || 1)}`;
  }
  if (check.type === "event") return `${check.kind === "now" ? "NOWEV" : "ENDEV"} ${check.shiftbit}`;
  if (check.type === "pet") {
    const name = check.petName ? `「${check.petName}」` : (check.petId || "");
    return `宠物 ${name}${check.needed ? ` ${Number(check.qty || 0)}/${Number(check.needed || 1)}` : ""}`.trim();
  }
  if (check.type === "level") return `等级 ${check.actual}${check.op}${check.expected}`;
  if (check.type === "stone") return `石币 ${check.actual}${check.op}${check.expected}`;
  if (check.type === "manor") return `庄园 ${check.actual}${check.op}${check.expected}`;
  if (check.type === "class") return `职业 ${check.actual}${check.op}${check.expected}`;
  if (check.type === "trans") return `转生 ${check.actual}${check.op}${check.expected}`;
  return check.token || "";
}

function renderNpcTags(npc) {
  const tags = npcTags(npc);
  if (!tags.length) return "";
  return `<em class="assist-tags">${tags.map((tag) => `<b>${escapeHtml(tag)}</b>`).join("")}</em>`;
}

function npcTags(npc) {
  const text = `${npc.type || ""} ${npc.template || ""} ${npc.script || ""}`;
  const tags = [];
  if (npc.questLead) tags.push("线索");
  if (npc.questId || npc.questIds?.length) tags.push("任务");
  if (npc.trade) tags.push("交易");
  if (npc.warp) tags.push("传送");
  if (npc.warpStatus) tags.push(npc.warpStatus.ok ? "可达" : "条件");
  if (npc.scriptStatus) tags.push(npc.scriptStatus.hasReadyBranch ? "可触发" : "脚本条件");
  if (npc.npcEnemy || /npcenemy/i.test(text)) tags.push("战斗");
  if (/healer/i.test(text)) tags.push("治疗");
  if (/save/i.test(text)) tags.push("记录");
  return [...new Set(tags)];
}

function onAssistTabClick(event) {
  const btn = event.target.closest("[data-assist-tab]");
  if (!btn) return;
  assistTab = btn.dataset.assistTab || "map";
  renderAssistPanel(game?.world?.map || currentClientMap());
}

function onAssistPanelClick(event) {
  const sortNpc = event.target.closest("[data-npc-sort]");
  if (sortNpc) {
    npcSortMode = sortNpc.dataset.npcSort === "distance" ? "distance" : "source";
    renderAssistPanel(game.world.map);
    return;
  }
  const sortExit = event.target.closest("[data-exit-sort]");
  if (sortExit) {
    exitSortMode = sortExit.dataset.exitSort === "distance" ? "distance" : "source";
    renderAssistPanel(game.world.map);
    return;
  }
  const goNpcBtn = event.target.closest("[data-assist-go-npc]");
  if (goNpcBtn) {
    event.preventDefault();
    event.stopPropagation();
    goToNpc(goNpcBtn.dataset.assistGoNpc, { openWhenNear: false });
    return;
  }
  const goExitBtn = event.target.closest("[data-assist-go-exit]");
  if (goExitBtn) {
    event.preventDefault();
    event.stopPropagation();
    goToExit(goExitBtn.dataset.assistGoExit);
    return;
  }
  const paidNpcBtn = event.target.closest("[data-assist-paid-jump-npc]");
  if (paidNpcBtn) {
    event.preventDefault();
    event.stopPropagation();
    paidJumpTo("npc", paidNpcBtn.dataset.assistPaidJumpNpc);
    return;
  }
  const paidExitBtn = event.target.closest("[data-assist-paid-jump-exit]");
  if (paidExitBtn) {
    event.preventDefault();
    event.stopPropagation();
    paidJumpTo("exit", paidExitBtn.dataset.assistPaidJumpExit);
    return;
  }
  const npcBtn = event.target.closest("[data-npc]");
  if (npcBtn) {
    return;
  }
  const exitBtn = event.target.closest("[data-exit]");
  if (exitBtn) {
    return;
  }
  const activePetBtn = event.target.closest("[data-assist-active-pet]");
  if (activePetBtn) {
    mutate("/api/game/pet-mode", { petIndex: Number(activePetBtn.dataset.assistActivePet), mode: "active" });
    return;
  }
  const releasePetBtn = event.target.closest("[data-assist-release-pet]");
  if (releasePetBtn) {
    releasePet(Number(releasePetBtn.dataset.assistReleasePet));
    return;
  }
  const restBtn = event.target.closest("[data-assist-rest]");
  if (restBtn) {
    mutate("/api/game/rest", {});
    return;
  }
  const encounterBtn = event.target.closest("[data-assist-encounter]");
  if (encounterBtn) {
    mutate("/api/game/encounter", {});
    return;
  }
  const returnSavePointBtn = event.target.closest("[data-assist-return-savepoint]");
  if (returnSavePointBtn) {
    returnToSavePoint();
    return;
  }
  const autoBtn = event.target.closest("[data-assist-toggle-auto]");
  if (autoBtn) {
    const mode = autoBtn.dataset.assistToggleAuto;
    const state = automationState();
    const next = mode === "level" ? !state.autoLevel : !state.autoEscape;
    setAutomationMode(mode, next);
    return;
  }
  const useBtn = event.target.closest("[data-assist-use-item]");
  if (useBtn) {
    useItem(Number(useBtn.dataset.assistUseItem));
    return;
  }
  const equipBtn = event.target.closest("[data-assist-equip-item]");
  if (equipBtn) {
    equipItem(Number(equipBtn.dataset.assistEquipItem));
    return;
  }
  const dropBtn = event.target.closest("[data-assist-drop-item]");
  if (dropBtn) {
    dropItem(Number(dropBtn.dataset.assistDropItem));
    return;
  }
  const pointBtn = event.target.closest("[data-player-stat-up]");
  if (pointBtn) {
    allocatePlayerPoint(pointBtn.dataset.playerStatUp);
    return;
  }
  const clientBtn = event.target.closest("[data-assist-client-tab]");
  if (clientBtn) {
    showTab(clientBtn.dataset.assistClientTab, { openClientWindow: true });
    return;
  }
  const searchBtn = event.target.closest("[data-assist-search]");
  if (searchBtn) searchAssistData();
}

function onAssistPanelDoubleClick(event) {
  if (event.target.closest("[data-assist-go-npc], [data-assist-go-exit]")) return;
  if (event.target.closest("[data-npc-sort], [data-exit-sort]")) return;
  const btn = event.target.closest("[data-npc], [data-exit]");
  if (!btn) return;
  event.preventDefault();
  if (btn.dataset.npc) {
    goToNpc(btn.dataset.npc, { openWhenNear: true });
    return;
  }
  if (btn.dataset.exit) goToExit(btn.dataset.exit);
}

function onAssistPanelKeyDown(event) {
  if (event.key === "Enter" && event.target?.id === "assistDataQuery") searchAssistData();
  if (!["Enter", " "].includes(event.key)) return;
  const card = event.target.closest?.(".assist-map-card[data-npc], .assist-map-card[data-exit]");
  if (!card || card.classList.contains("closed-profile-exit")) return;
  event.preventDefault();
  if (card.dataset.npc) {
    goToNpc(card.dataset.npc, { openWhenNear: false });
    return;
  }
  if (card.dataset.exit) goToExit(card.dataset.exit);
}

function currentClientMap() {
  return game?.world?.map || { npcs: [], exits: [] };
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

async function toggleDialogAiMode(enabled) {
  if (!game?.dialog?.npcId) return;
  const npcId = game.dialog.npcId;
  try {
    game = await api("/api/game/dialog-ai", { game, npcId, enabled });
    save();
    render();
    els.dialogInput.focus();
  } catch (error) {
    appendDialogSystem(error.message || "无法切换 AI 对话。");
    els.dialogInput.focus();
  }
}

function onDialogInputKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === "escape") {
    event.preventDefault();
    closeDialog();
  } else if (key === "pageup") {
    event.preventDefault();
    scrollDialogMessages(-DIALOG_SCROLL_STEP * 3);
  } else if (key === "pagedown") {
    event.preventDefault();
    scrollDialogMessages(DIALOG_SCROLL_STEP * 3);
  }
}

function closeDialog() {
  if (!game) return;
  game.dialog = null;
  save();
  renderDialog();
}

function scrollDialogMessages(delta) {
  if (els.dialogPanel.hidden) return;
  els.dialogMessages.scrollTop += delta;
  updateDialogScrollButtons();
}

function updateDialogScrollButtons() {
  const canScroll = els.dialogMessages.scrollHeight > els.dialogMessages.clientHeight + 1;
  els.dialogScrollUpBtn.disabled = !canScroll || els.dialogMessages.scrollTop <= 0;
  els.dialogScrollDownBtn.disabled = !canScroll
    || els.dialogMessages.scrollTop + els.dialogMessages.clientHeight >= els.dialogMessages.scrollHeight - 1;
}

function renderDialog() {
  const dialog = game?.dialog;
  if (dialog?.open) clientWindowOpen = false;
  const battleOpen = isBattleOpen();
  els.dialogPanel.hidden = !dialog?.open || battleOpen;
  if (!dialog?.open || battleOpen) {
    updateDialogAiToggleButton(null);
    updateDialogScrollButtons();
    return;
  }
  updateDialogAiToggleButton(dialog);
  els.dialogNpcName.textContent = dialog.npcName || "NPC";
  els.dialogSource.textContent = "";
  els.dialogMessages.innerHTML = (dialog.messages || []).filter((message) => message.speaker !== "system").map((message) => {
    const kind = message.speaker === "player" ? "player" : message.speaker === "system" ? "system" : "npc";
    return `<p class="dialog-bubble ${kind}"><span>${escapeHtml(dialogSpeaker(message.speaker, dialog))}</span>${escapeHtml(message.text)}</p>`;
  }).join("");
  const auxiliary = [
    renderDialogCommandButtons(dialog),
    renderDialogShop(dialog),
    renderDialogPetShop(dialog),
    renderDialogItemPoolShop(dialog),
    renderDialogPetSkillShop(dialog),
    renderDialogItemChange(dialog)
  ].filter(Boolean).join("");
  els.dialogSuggestions.hidden = !auxiliary;
  els.dialogSuggestions.innerHTML = auxiliary;
  hydrateAtlasSprites(loadedTileAtlas, els.dialogSuggestions);
  els.dialogSuggestions.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => buyItem(Number(btn.dataset.buy)));
  });
  els.dialogSuggestions.querySelectorAll("[data-sell]").forEach((btn) => {
    btn.addEventListener("click", () => sellItem(Number(btn.dataset.sell)));
  });
  els.dialogSuggestions.querySelectorAll("[data-pool-pet]").forEach((btn) => {
    const petIndex = btn.dataset.petIndex === undefined ? NaN : Number(btn.dataset.petIndex);
    const poolIndex = btn.dataset.poolIndex === undefined ? NaN : Number(btn.dataset.poolIndex);
    btn.addEventListener("click", () => poolPet(btn.dataset.poolPet, petIndex, poolIndex));
  });
  els.dialogSuggestions.querySelectorAll("[data-pool-item]").forEach((btn) => {
    const itemId = btn.dataset.itemId === undefined ? NaN : Number(btn.dataset.itemId);
    const poolIndex = btn.dataset.poolIndex === undefined ? NaN : Number(btn.dataset.poolIndex);
    btn.addEventListener("click", () => poolItem(btn.dataset.poolItem, itemId, poolIndex));
  });
  els.dialogSuggestions.querySelectorAll("[data-learn-pet-skill]").forEach((btn) => {
    btn.addEventListener("click", () => learnPetSkill(Number(btn.dataset.learnPetSkill), Number(btn.dataset.petIndex), Number(btn.dataset.slotIndex)));
  });
  els.dialogSuggestions.querySelectorAll("[data-change-item]").forEach((btn) => {
    btn.addEventListener("click", () => changeItem(Number(btn.dataset.changeItem)));
  });
  els.dialogSuggestions.querySelectorAll("[data-dialog-command]").forEach((btn) => {
    btn.addEventListener("click", () => sendDialog(btn.dataset.dialogCommand || ""));
  });
  els.dialogMessages.scrollTop = els.dialogMessages.scrollHeight;
  updateDialogScrollButtons();
}

function defaultDialogSubmitText(dialog) {
  const suggestions = dialog?.suggestions || [];
  if (dialog?.npcType === "NPCEnemy" && suggestions.includes("是")) return "是";
  return "";
}

function renderDialogCommandButtons(dialog) {
  const suggestions = (dialog?.suggestions || []).filter(Boolean);
  const isNpcEnemyPrompt = dialog?.npcType === "NPCEnemy";
  const isBattleCommand = Boolean(game?.encounter) && suggestions.some((item) => ["攻击", "防御", "道具", "逃跑"].includes(item));
  if (!isNpcEnemyPrompt && !isBattleCommand) return "";
  const allowed = isNpcEnemyPrompt
    ? new Set(["是", "否", "试着交涉"])
    : new Set(["攻击", "防御", "道具", "逃跑", "捕获", "放走"]);
  const commands = suggestions.filter((item) => allowed.has(item));
  if (!commands.length) return "";
  return commands.map((item) => (
    `<button type="button" class="dialog-command-btn" data-dialog-command="${escapeHtml(item)}">${escapeHtml(item)}</button>`
  )).join("");
}

function updateDialogAiToggleButton(dialog) {
  if (!els.dialogAiToggleBtn) return;
  const enabled = Boolean(dialog?.aiMode);
  els.dialogAiToggleBtn.hidden = !dialog?.open;
  els.dialogAiToggleBtn.classList.toggle("active", enabled);
  els.dialogAiToggleBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
  els.dialogAiToggleBtn.title = enabled ? "关闭 AI 对话" : "开启 AI 对话";
}

function renderDialogBattle() {
  const enemy = game?.encounter;
  if (!enemy) return "";
  const activePet = getActivePet();
  const enemyMax = Math.max(1, Number(enemy.WorkMaxHp || enemy.Hp || 1));
  const enemyHp = Math.max(0, Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : enemyMax);
  const petMax = activePet ? Math.max(1, Number(activePet.WorkMaxHp || activePet.Hp || 1)) : 1;
  const petHp = activePet ? Math.max(0, Number(activePet.Hp || petMax)) : 0;
  const petFull = petUsed() >= petCapacity();
  const battleLog = (game.battle?.log || []).slice(-4);
  return `
    <div class="battle-box">
      <div class="battle-target">
        ${petSpriteMarkup(enemy.ImgNo, enemy.Name || "遇敌", "battle-target-sprite")}
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
        <button class="ghost-btn" type="button" data-say="捕获" ${petFull ? "disabled" : ""}>捕获</button>
        <button class="ghost-btn" type="button" data-say="放走">放走</button>
      </div>
      <div class="battle-box-log">
        ${battleLog.length ? battleLog.map((line) => `<p>${escapeHtml(line)}</p>`).join("") : `<p>战斗开始。</p>`}
      </div>
    </div>
  `;
}

function isBattleOpen() {
  return Boolean(game?.encounter);
}

function renderBattlePanel() {
  const enemy = game?.encounter;
  els.battlePanel.hidden = !enemy;
  els.mapCanvas.classList.toggle("in-battle", Boolean(enemy));
  els.battlePanel.closest(".map-panel")?.classList.toggle("battle-active", Boolean(enemy));
  if (!enemy) {
    battleItemMenuOpen = false;
    battleSkillMenuOpen = false;
    battlePetMenuOpen = false;
    battleSelectedAction = "attack";
    battlePendingAction = "";
    return;
  }
  clientWindowOpen = false;
  const activePet = getActivePet();
  const battle = game.battle || {};
  const enemyMax = Math.max(1, Number(enemy.WorkMaxHp || enemy.Hp || 1));
  const enemyHp = Math.max(0, Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : enemyMax);
  const petMax = activePet ? Math.max(1, Number(activePet.WorkMaxHp || activePet.Hp || 1)) : 1;
  const petHp = activePet ? Math.max(0, Number(activePet.Hp || petMax)) : 0;
  const enemyParty = battleEnemyParty(battle, enemy);
  const partyCount = enemyParty.length;
  const activeEnemyNo = Math.min(partyCount, Number(battle.activeEnemyIndex || 0) + 1);
  const activeEnemyField = battleEnemyField(Number(battle.activeEnemyIndex || 0), enemy);
  const formation = battleFormationState();
  els.battleTitle.textContent = partyCount > 1
    ? `BATTLE ${Number(battle.turn || 0) + 1} | 敌 ${activeEnemyNo}/${partyCount}`
    : `BATTLE ${Number(battle.turn || 0) + 1}`;
  els.battleSource.textContent = battle.sourceCommand
    ? `PLAYER ${battle.sourceCommand}`
    : "PLAYER";
  els.battleSource.title = battle.source || enemy.source || "gmsv battle_command.c";
  els.battlePanel.classList.toggle("battle-busy", Boolean(battlePendingAction));
  updateBattleTargetPrompt(formation);
  updateBattleCountdownDisplay();
  setBattleSprite(els.battleEnemyImg, enemy.ImgNo, { dir: BATTLE_ENEMY_FACE_DIRECTION });
  els.battleEnemyName.textContent = `${enemy.Name || "野外宠物"} Lv.${Number(enemy.Lv || 1)}`;
  els.battleEnemyStats.textContent = battleEnemyStatsText(enemy, activeEnemyField, enemyHp, enemyMax);
  els.battleEnemyHpBar.style.width = `${clampPercent(enemyHp, enemyMax)}%`;
  renderBattleEnemyParty(enemyParty, Number(battle.activeEnemyIndex || 0), true);
  renderBattleFormation();
  if (activePet) {
    const petProgress = progressionForPet(activePetIndex(), activePet);
    const petStatus = battleStatusText(activePet);
    setBattleSprite(els.battlePetImg, activePet.ImgNo, { dir: BATTLE_ALLY_FACE_DIRECTION });
    els.battlePetName.textContent = `${activePet.Name} Lv.${Number(activePet.Lv || 1)}`;
    els.battlePetStats.textContent = `HP ${petHp}/${petMax} | ${expLabel(petProgress)} | ${workStatsText(activePet, null, " ")}${petStatus ? ` | 状态 ${petStatus}` : ""} | ${elementText(activePet)}`;
    els.battlePetHpBar.style.width = `${clampPercent(petHp, petMax)}%`;
  } else {
    setBattleSprite(els.battlePetImg, null);
    els.battlePetName.textContent = "人物单独应战";
    els.battlePetStats.textContent = "PETIN 后状态 | 可攻击、防御、道具，S 可叫出宠物";
    els.battlePetHpBar.style.width = "0%";
  }
  els.battlePlayerName.textContent = game.player.name;
  els.battlePlayerStats.textContent = `Lv.${game.player.level} | HP ${Number(game.player.hp || 0)}/${Number(game.player.maxHp || 0)} | ${expLabel(progressionForPlayer())} | 点 ${Number(game.player.skillUpPoint || 0)} | 魅 ${playerCharmValue()} | ${elementText(game.player)}`;
  const battleItems = battleUsableItems();
  const hasBattleItem = battleItems.length > 0;
  const battleSkills = battleUsableSkills(activePet);
  const hasBattleSkill = battleSkills.length > 0;
  const battlePets = battleSwitchablePets();
  const hasBattlePet = Boolean(activePet) || battlePets.length > 0;
  const petFull = petUsed() >= petCapacity();
  if (!hasBattleItem) battleItemMenuOpen = false;
  if (!hasBattleSkill) battleSkillMenuOpen = false;
  if (!hasBattlePet) battlePetMenuOpen = false;
  els.battleCommandGrid.innerHTML = BATTLE_ACTIONS.map((entry, index) => {
    const disabled = entry.disabled
      || (entry.action === "capture" && (Number(enemy.CaptureRate ?? 35) <= 0 || petFull))
      || (entry.action === "item" && !hasBattleItem)
      || (entry.action === "skill" && !hasBattleSkill)
      || (entry.action === "pet" && !hasBattlePet);
    const active = isTargetedBattleAction(entry.action) && battleSelectedAction === entry.action;
    const pending = battlePendingAction === entry.action || battlePendingAction.startsWith(`${entry.action}:`);
    return `
      <button type="button" data-battle-action="${entry.action}" class="${active ? "active" : ""} ${pending ? "pending" : ""}" aria-pressed="${active ? "true" : "false"}" ${disabled ? "disabled" : ""} title="${escapeHtml(battleActionHint(entry))}">
        <b>${escapeHtml(entry.label)}</b>
        <span>${escapeHtml(entry.command)}</span>
        <small>${index + 1}</small>
      </button>
    `;
  }).join("") + renderBattleItemPicker(battleItems) + renderBattleSkillPicker(battleSkills) + renderBattlePetPicker(battlePets);
  const log = (battle.log || game.log || []).slice(-6);
  els.sourceBattleLog.innerHTML = log.length
    ? log.map((line) => `<p>${escapeHtml(line)}</p>`).join("")
    : `<p>战斗开始。</p>`;
}

function battleEnemyParty(battle, enemy) {
  const party = Array.isArray(battle?.enemyParty) && battle.enemyParty.length ? battle.enemyParty : [enemy];
  return party.filter(Boolean);
}

function battleFormationState() {
  return game?.characterFields?.battle?.formation || game?.save?.json?.characterFields?.battle?.formation || null;
}

function updateBattleTargetPrompt(formation) {
  if (!els.battleTargetPrompt) return;
  els.battleTargetPrompt.hidden = !formation;
  if (!formation) return;
  const spans = els.battleTargetPrompt.querySelectorAll("span");
  const [line1, line2] = battleTargetPromptLines();
  if (spans[0]) spans[0].textContent = line1;
  if (spans[1]) spans[1].textContent = line2;
}

function battleTargetPromptLines() {
  if (battlePendingAction) return ["指令已送出", "等待回合结算"];
  if (battleSelectedAction === "capture") return ["请选择", "捕获目标"];
  return ["请选择", "攻击目标"];
}

function updateBattleCountdownDisplay() {
  if (!els.battleCountdown) return;
  const battle = battleFieldState();
  if (!game?.encounter || !battle?.active) {
    els.battleCountdown.hidden = true;
    return;
  }
  const fallback = Math.max(1, Number(battle.formation?.turnSeconds || game?.battle?.turnSeconds || 30));
  const deadline = Date.parse(battle.formation?.roundDeadlineAt || game?.battle?.roundDeadlineAt || "");
  const rest = Number.isFinite(deadline)
    ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
    : fallback;
  els.battleCountdown.hidden = false;
  els.battleCountdown.textContent = String(Math.min(fallback, rest)).padStart(2, " ");
  els.battleCountdown.classList.toggle("urgent", rest <= 5);
}

function battleActionHint(entry) {
  if (entry.action === "magic") return "咒术 J：按原版菜单保留，魔法/精灵技能表正在接入";
  if (entry.action === "help") return "Help：原版加入/求援入口，等待多人战斗房间接入";
  if (entry.action === "skill") return "宠技 W：选择出战宠物技能后点目标";
  if (entry.action === "pet") return "宠物 S：出战、换宠或收回出战宠";
  if (entry.action === "attack") return "攻击 H：先选择攻击，再点左上敌方单位";
  if (entry.action === "capture") return "捕获 T：先选择捕获，再点左上敌方单位";
  return `${entry.label} ${entry.command}`;
}

function isTargetedBattleAction(action) {
  return action === "attack" || action === "capture";
}

function renderBattleFormation() {
  if (!els.battleFormationLayer) return;
  const formation = battleFormationState();
  if (!formation?.allySide?.length && !formation?.enemySide?.length) {
    els.battleFormationLayer.innerHTML = "";
    return;
  }
  const units = [
    ...(formation.enemySide || []).map((unit) => ({ ...unit, sideClass: "enemy-side" })),
    ...(formation.allySide || []).map((unit) => ({ ...unit, sideClass: "ally-side" }))
  ].filter((unit) => Number(unit.hp ?? 1) > 0 || unit.kind === "player");
  const targetMode = isTargetedBattleAction(battleSelectedAction);
  els.battleFormationLayer.innerHTML = units.map((unit) => {
    const pos = battleFormationUnitPosition(unit);
    const maxHp = Math.max(1, Number(unit.maxHp || unit.hp || 1));
    const hp = Math.max(0, Number(unit.hp || 0));
    const battleNo = Number(unit.battleNo || 0);
    const targetAttr = unit.kind === "enemy"
      ? `data-battle-target="${Math.max(0, Number(unit.slot || 0))}" data-battle-target-no="${battleNo}"`
      : "";
    const buttonTag = unit.kind === "enemy" ? "button" : "div";
    const typeAttr = unit.kind === "enemy" ? `type="button"` : "";
    const imgNo = battleFormationUnitImageNo(unit);
    const faceDir = battleFormationUnitDirection(unit);
    const spriteId = unit.kind === "player"
      ? playerFrameTileId(loadedTileAtlas, { dir: faceDir, forceStand: true })
      : sourceFieldSpriteTileId(imgNo, { fallback: Number(imgNo || 0), dir: faceDir });
    const spriteAttrs = unit.kind === "player" ? "" : sourceSpriteAttrs(imgNo, spriteId, { dir: faceDir });
    return `
      <${buttonTag} ${typeAttr} class="battle-formation-unit ${escapeHtml(unit.sideClass)} ${escapeHtml(unit.kind || "")} ${unit.active ? "active" : ""}" ${targetAttr} data-battle-no="${battleNo}" style="--battle-x:${pos.x}%; --battle-y:${pos.y}%; --battle-z:${pos.z};" title="${escapeHtml(battleFormationUnitTitle(unit))}">
        <span class="battle-unit-hp"><b style="width:${clampPercent(hp, maxHp)}%"></b></span>
        ${unit.kind === "player" ? `<em class="battle-role-label">PLAYER</em>` : unit.kind === "pet" ? `<em class="battle-role-label">PET</em>` : ""}
        <span class="battle-unit-sprite client-atlas-sprite" data-atlas-sprite="${Number(spriteId || 0)}"${spriteAttrs} aria-hidden="true"></span>
        <strong>${escapeHtml(unit.name || unit.kind || "unit")}</strong>
      </${buttonTag}>
    `;
  }).join("");
  els.battleFormationLayer.querySelectorAll("[data-battle-target]").forEach((node) => {
    node.classList.toggle("targetable", targetMode && !battlePendingAction);
    node.dataset.targetMode = targetMode ? battleSelectedAction : "";
  });
  hydrateBattleSprites(els.battleFormationLayer);
}

function battleFormationUnitDirection(unit = {}) {
  return unit.kind === "enemy" || Number(unit.side || 0) === 1
    ? BATTLE_ENEMY_FACE_DIRECTION
    : BATTLE_ALLY_FACE_DIRECTION;
}

function battleFormationUnitImageNo(unit = {}) {
  const direct = Number(unit.imgNo || unit.ImgNo || 0);
  if (Number.isFinite(direct) && direct > 0) return direct;
  if (unit.kind === "enemy") {
    const enemy = battleEnemyParty(game?.battle || {}, game?.encounter || null)[Math.max(0, Number(unit.slot || 0))];
    return Number(enemy?.ImgNo || enemy?.imgNo || 0);
  }
  if (unit.kind === "pet") {
    const byIndex = game?.pets?.[Number(unit.petIndex)];
    const active = getActivePet();
    return Number(byIndex?.ImgNo || active?.ImgNo || 0);
  }
  return 0;
}

function hydrateBattleSprites(root) {
  if (loadedTileAtlas) {
    hydrateAtlasSprites(loadedTileAtlas, root);
    return;
  }
  loadTileAtlas().then((atlas) => {
    if (atlas && isBattleOpen()) hydrateAtlasSprites(atlas, root);
  });
}

function battleFormationUnitPosition(unit) {
  const slot = Math.max(0, Number(unit.slot || 0));
  if (unit.side === 1 || unit.kind === "enemy") {
    const enemy = [
      [11, 39], [17, 30], [23, 21], [29, 45], [35, 34],
      [28, 58], [35, 49], [42, 40], [49, 31], [56, 52]
    ][slot] || [22 + (slot % 5) * 7, 28 + Math.floor(slot / 5) * 18];
    return { x: enemy[0], y: enemy[1], z: 20 + Math.round(enemy[1]) };
  }
  const ally = [
    [82, 84], [86, 78], [90, 72], [94, 66], [90, 90],
    [68, 78], [74, 70], [80, 62], [86, 54], [92, 46]
  ][slot] || [78, 66];
  return { x: ally[0], y: ally[1], z: 60 + Math.round(ally[1]) };
}

function battleFormationUnitTitle(unit) {
  const work = unit.work || {};
  const parts = [
    `${unit.name || "unit"} Lv.${Number(unit.level || 1)}`,
    `side ${Number(unit.side || 0)} slot ${Number(unit.slot || 0)} no ${Number(unit.battleNo || 0)}`,
    `HP ${Number(unit.hp || 0)}/${Number(unit.maxHp || 0)}`,
    `攻 ${Number(work.attack || 0)} 防 ${Number(work.defence || 0)} 敏 ${Number(work.quick || 0)}`
  ];
  return parts.join(" | ");
}

function renderBattleEnemyParty(party, activeIndex, canTarget) {
  if (!els.battleEnemyParty) return;
  els.battleEnemyParty.hidden = party.length <= 1;
  if (party.length <= 1) {
    els.battleEnemyParty.innerHTML = "";
    return;
  }
  els.battleEnemyParty.innerHTML = party.map((enemy, index) => {
    const field = battleEnemyField(index, enemy);
    const maxHp = Math.max(1, Number(enemy.WorkMaxHp || enemy.Hp || 1));
    const hp = Math.max(0, Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : maxHp);
    const defeated = hp <= 0;
    const active = index === activeIndex;
    const sourceExp = Number(field?.sourceExp ?? enemy.SourceExp ?? enemy.EnemyExp ?? enemy.Exp ?? 0);
    const captureRate = Number(field?.captureRate ?? enemy.CaptureRate ?? 0);
    const status = battleStatusText(field || enemy);
    const title = `${enemy.Name || "敌人"} Lv.${Number(field?.level ?? enemy.Lv ?? 1)} | EXP ${sourceExp || 0} | 捕获 ${captureRate}%${status ? ` | 状态 ${status}` : ""} | ${elementText(field || enemy)}`;
    const spriteId = sourceFieldSpriteTileId(enemy.ImgNo, {
      fallback: Number(enemy.ImgNo || 0),
      dir: BATTLE_ENEMY_FACE_DIRECTION
    });
    return `
      <button type="button" data-battle-target="${index}" data-battle-target-no="${BATTLE_SIDE_OFFSET + index}" class="${active ? "active" : ""}" ${defeated || !canTarget ? "disabled" : ""} title="${escapeHtml(title)}">
        <span class="battle-enemy-thumb"><span class="client-atlas-sprite" data-atlas-sprite="${spriteId}"${sourceSpriteAttrs(enemy.ImgNo, spriteId, { dir: BATTLE_ENEMY_FACE_DIRECTION })} aria-hidden="true"></span></span>
        <b>${index + 1}</b>
        <em>${escapeHtml(enemy.Name || "敌人")}</em>
        <i><strong style="width:${clampPercent(hp, maxHp)}%"></strong></i>
      </button>
    `;
  }).join("");
  els.battleEnemyParty.querySelectorAll("[data-atlas-sprite]").forEach((node) => {
    hydrateBattleSprites(node);
  });
}

function setBattleSprite(el, tileId, options = {}) {
  const source = Number(tileId || 0);
  const id = sourceFieldSpriteTileId(source, { fallback: source, dir: options.dir });
  el.dataset.atlasSprite = id > 0 ? String(id) : "";
  if (Number.isFinite(source) && source >= SPR_START) {
    el.dataset.sourceSprite = String(source);
    el.dataset.atlasFallback = String(source);
    if (Number.isFinite(Number(options.dir))) el.dataset.sourceDir = String(normalizeDirection(Number(options.dir)));
    else delete el.dataset.sourceDir;
  } else {
    delete el.dataset.sourceSprite;
    delete el.dataset.atlasFallback;
    delete el.dataset.sourceDir;
  }
  if (id <= 0) {
    el.hidden = true;
    return;
  }
  hydrateBattleSprites(el);
}

function battleFieldState() {
  return game?.characterFields?.battle || game?.save?.json?.characterFields?.battle || null;
}

function battleEnemyField(index = 0, enemy = null) {
  const battle = battleFieldState();
  if (!battle?.active) return null;
  const party = Array.isArray(battle.enemyParty) ? battle.enemyParty : [];
  return party[index] || (Number(battle.activeEnemyIndex || 0) === index ? battle.activeEnemy : null) || enemy;
}

function battleEnemyStatsText(enemy, field, hp, maxHp) {
  const sourceExp = Number(field?.sourceExp ?? enemy.SourceExp ?? enemy.EnemyExp ?? enemy.Exp ?? 0);
  const captureRate = Number(field?.captureRate ?? enemy.CaptureRate ?? 0);
  const status = battleStatusText(field || enemy);
  const parts = [
    `HP ${hp}/${maxHp}`,
    workStatsText(field || {}, enemy, " "),
    `EXP ${sourceExp || 0}`
  ];
  if (captureRate > 0) parts.push(`捕 ${captureRate}%`);
  if (status) parts.push(`状态 ${status}`);
  parts.push(elementText(field || enemy));
  return parts.join(" | ");
}

function battleStatusText(entity = {}) {
  const statuses = entity.statuses || entity.BattleStatuses || {};
  const magicStatuses = entity.magicStatuses || entity.BattleMagicStatuses || {};
  return [...Object.values(statuses), ...Object.values(magicStatuses)]
    .filter((status) => Number(status?.turns || 0) > 0)
    .map((status) => `${status.label || status.key || "异常"}${Number(status.turns || 0)}`)
    .join("/");
}

function onBattlePanelClick(event) {
  const targetBtn = event.target.closest("[data-battle-target]");
  if (targetBtn && els.battlePanel.contains(targetBtn) && !targetBtn.disabled) {
    const action = isTargetedBattleAction(battleSelectedAction) ? battleSelectedAction : "attack";
    const targetToken = targetBtn.dataset.battleTargetNo || targetBtn.dataset.battleTarget;
    flashBattleElement(targetBtn, "battle-click-confirm");
    sendBattleAction(`${action}No:${targetToken}`);
    return;
  }
  const itemBtn = event.target.closest("[data-battle-item]");
  if (itemBtn && els.battlePanel.contains(itemBtn)) {
    sendBattleAction(`item:${itemBtn.dataset.battleItem}`);
    return;
  }
  const skillBtn = event.target.closest("[data-battle-skill]");
  if (skillBtn && els.battlePanel.contains(skillBtn)) {
    const target = Number(game?.battle?.activeEnemyIndex || 0);
    sendBattleAction(`skill:${skillBtn.dataset.battleSkill}:${target}`);
    return;
  }
  const petBtn = event.target.closest("[data-battle-pet]");
  if (petBtn && els.battlePanel.contains(petBtn)) {
    sendBattleAction(`pet:${petBtn.dataset.battlePet}`);
    return;
  }
  const closeBtn = event.target.closest("[data-battle-items-close]");
  if (closeBtn && els.battlePanel.contains(closeBtn)) {
    battleItemMenuOpen = false;
    renderBattlePanel();
    return;
  }
  const closeSkillsBtn = event.target.closest("[data-battle-skills-close]");
  if (closeSkillsBtn && els.battlePanel.contains(closeSkillsBtn)) {
    battleSkillMenuOpen = false;
    renderBattlePanel();
    return;
  }
  const closePetsBtn = event.target.closest("[data-battle-pets-close]");
  if (closePetsBtn && els.battlePanel.contains(closePetsBtn)) {
    battlePetMenuOpen = false;
    renderBattlePanel();
    return;
  }
  const btn = event.target.closest("[data-battle-action]");
  if (!btn || !els.battlePanel.contains(btn) || btn.disabled) return;
  flashBattleElement(btn, "battle-click-confirm");
  if (isTargetedBattleAction(btn.dataset.battleAction)) {
    battleSelectedAction = btn.dataset.battleAction;
    battleItemMenuOpen = false;
    battleSkillMenuOpen = false;
    battlePetMenuOpen = false;
    renderBattlePanel();
    return;
  }
  if (btn.dataset.battleAction === "item") {
    toggleBattleItemMenu();
    return;
  }
  if (btn.dataset.battleAction === "skill") {
    toggleBattleSkillMenu();
    return;
  }
  if (btn.dataset.battleAction === "pet") {
    toggleBattlePetMenu();
    return;
  }
  sendBattleAction(btn.dataset.battleAction);
}

async function sendBattleAction(action) {
  if (!game?.encounter) return;
  if (battlePendingAction) return;
  if (action === "capture" && Number(game.encounter.CaptureRate ?? 35) <= 0) {
    addClientLog("这个目标不能捕获。");
    return;
  }
  if (action === "capture" && petUsed() >= petCapacity()) {
    addClientLog(`宠物栏已满（${petUsed()}/${petCapacity()}）。`);
    return;
  }
  const previousGame = game;
  battlePendingAction = action;
  renderBattlePanel();
  try {
    const nextGame = await api("/api/game/battle", { game, action });
    const outcome = nextGame.battleOutcome || nextGame.lastBattleOutcome || null;
    const fxActions = buildBattleFxActions(previousGame, outcome);
    game = nextGame;
    battleItemMenuOpen = false;
    battleSkillMenuOpen = false;
    battlePetMenuOpen = false;
    battlePendingAction = "";
    save();
    render();
    playBattleFxActions(fxActions);
  } catch (error) {
    battlePendingAction = "";
    renderBattlePanel();
    addClientLog(error.message || "战斗指令失败。");
  }
}

function flashBattleElement(el, className) {
  if (!el) return;
  el.classList.remove(className);
  window.requestAnimationFrame(() => {
    el.classList.add(className);
    window.setTimeout(() => el.classList.remove(className), 240);
  });
}

function buildBattleFxActions(previousGame, outcome) {
  if (!previousGame?.encounter || !outcome) return [];
  const actions = [];
  const activeEnemyIndex = Math.max(0, Number(previousGame.battle?.activeEnemyIndex || 0));
  const playerAction = outcome.playerAction;
  if (battleActionHasStrikeMotion(playerAction)) {
    actions.push({
      actorNo: battleActionActorNo(playerAction),
      targetNo: BATTLE_SIDE_OFFSET + Number(playerAction.targetSlot || activeEnemyIndex),
      kind: "player"
    });
  }
  const enemyAi = outcome.enemyAi;
  if (battleActionHasStrikeMotion(enemyAi)) {
    actions.push({
      actorNo: BATTLE_SIDE_OFFSET + activeEnemyIndex,
      targetNo: battleActionActorNo(playerAction) || Number(enemyAi.targetSlot ?? 0),
      kind: "enemy"
    });
  }
  if (outcome.result === "escape-failed" && !enemyAi) {
    actions.push({
      actorNo: BATTLE_SIDE_OFFSET + activeEnemyIndex,
      targetNo: Number(playerAction?.actorSlot ?? battleFieldState()?.formation?.activeActorNo ?? BATTLE_PLAYER_MAX),
      kind: "enemy"
    });
  }
  return actions;
}

function battleActionActorNo(action) {
  if (!action) return 0;
  if (action.actorKind === "pet") {
    return BATTLE_PLAYER_MAX + Math.max(0, Number(action.actorSlot || 0));
  }
  return Math.max(0, Number(action.actorSlot || 0));
}

function battleActionHasStrikeMotion(action) {
  if (!action) return false;
  if (action.sourceCommand === "BATTLE_COM_ATTACK") return true;
  if (action.type !== "pet-skill") return false;
  return !["BATTLE_COM_GUARD", "BATTLE_COM_WAIT", "BATTLE_COM_S_SUPERWALL"].includes(action.sourceCommand);
}

function playBattleFxActions(actions) {
  window.clearTimeout(battleFxTimer);
  if (!actions?.length || !els.battleFormationLayer || !isBattleOpen()) return;
  actions.slice(0, 3).forEach((action, index) => {
    battleFxTimer = window.setTimeout(() => playBattleLunge(action), 90 + index * 360);
  });
}

function playBattleLunge(action) {
  const source = els.battleFormationLayer?.querySelector(`[data-battle-no="${Number(action.actorNo)}"]`);
  const target = els.battleFormationLayer?.querySelector(`[data-battle-no="${Number(action.targetNo)}"]`);
  if (!source || !target) return;
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const dx = ((targetRect.left + targetRect.width / 2) - (sourceRect.left + sourceRect.width / 2)) * 0.68;
  const dy = ((targetRect.top + targetRect.height / 2) - (sourceRect.top + sourceRect.height / 2)) * 0.68;
  source.style.setProperty("--battle-lunge-x", `${Math.round(dx)}px`);
  source.style.setProperty("--battle-lunge-y", `${Math.round(dy)}px`);
  source.classList.remove("is-attacking");
  target.classList.remove("is-hit");
  window.requestAnimationFrame(() => {
    source.classList.add("is-attacking");
    target.classList.add("is-hit");
    spawnBattleImpact(target);
    window.setTimeout(() => {
      source.classList.remove("is-attacking");
      target.classList.remove("is-hit");
    }, 420);
  });
}

function spawnBattleImpact(target) {
  const layer = els.battleFormationLayer;
  if (!layer || !target) return;
  const layerRect = layer.getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const impact = document.createElement("span");
  impact.className = "battle-impact";
  impact.style.left = `${rect.left + rect.width / 2 - layerRect.left}px`;
  impact.style.top = `${rect.top + rect.height / 2 - layerRect.top}px`;
  layer.append(impact);
  window.setTimeout(() => impact.remove(), 360);
}

function toggleBattleItemMenu() {
  if (!game?.encounter || !battleUsableItems().length) return;
  battleItemMenuOpen = !battleItemMenuOpen;
  if (battleItemMenuOpen) {
    battleSkillMenuOpen = false;
    battlePetMenuOpen = false;
  }
  renderBattlePanel();
}

function renderBattleItemPicker(items) {
  if (!battleItemMenuOpen) return "";
  return `
    <div class="battle-item-picker" aria-label="战斗道具">
      <div>
        <strong>ITEM</strong>
        <button type="button" data-battle-items-close title="关闭">×</button>
      </div>
      ${items.map((item, index) => `
        <button type="button" data-battle-item="${item.id}">
          <b>${escapeHtml(item.name || `item ${item.id}`)}</b>
          <span>x${Number(item.qty || 0)}</span>
          <small>${index + 1}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function toggleBattleSkillMenu() {
  if (!game?.encounter || !battleUsableSkills(getActivePet()).length) return;
  battleSkillMenuOpen = !battleSkillMenuOpen;
  if (battleSkillMenuOpen) {
    battleItemMenuOpen = false;
    battlePetMenuOpen = false;
  }
  renderBattlePanel();
}

function renderBattleSkillPicker(skills) {
  if (!battleSkillMenuOpen) return "";
  return `
    <div class="battle-item-picker battle-skill-picker" aria-label="宠物技能">
      <div>
        <strong>SKILL W</strong>
        <button type="button" data-battle-skills-close title="关闭">×</button>
      </div>
      ${skills.map((skill, index) => `
        <button type="button" data-battle-skill="${skill.slot}" title="${escapeHtml(skillHint(skill))}">
          <b>${escapeHtml(skill.name || `skill ${skill.id}`)}</b>
          <span>${escapeHtml(skill.command)}</span>
          <small>${index + 1}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function toggleBattlePetMenu() {
  if (!game?.encounter || (!getActivePet() && !battleSwitchablePets().length)) return;
  battlePetMenuOpen = !battlePetMenuOpen;
  if (battlePetMenuOpen) {
    battleItemMenuOpen = false;
    battleSkillMenuOpen = false;
  }
  renderBattlePanel();
}

function battleSwitchablePets() {
  const activeIndex = activePetIndex();
  return (game?.pets || [])
    .map((pet, index) => ({ pet, index }))
    .filter(({ pet, index }) => index !== activeIndex && Number(pet?.Hp ?? pet?.WorkMaxHp ?? 0) > 0);
}

function renderBattlePetPicker(entries) {
  if (!battlePetMenuOpen) return "";
  const activePet = getActivePet();
  const withdraw = activePet ? `
        <button type="button" data-battle-pet="-1" title="收回出战宠，让人物单独应战">
          <b>收回 ${escapeHtml(activePet.Name || "出战宠")}</b>
          <span>人物单独应战</span>
          <small>S|-1</small>
        </button>
  ` : "";
  return `
    <div class="battle-item-picker battle-pet-picker" aria-label="切换出战宠物">
      <div>
        <strong>PET S</strong>
        <button type="button" data-battle-pets-close title="关闭">×</button>
      </div>
      ${withdraw}
      ${entries.map(({ pet, index }) => {
        const hp = Math.max(0, Number(pet.Hp || 0));
        const maxHp = Math.max(1, Number(pet.WorkMaxHp || pet.Hp || 1));
        return `
          <button type="button" data-battle-pet="${index}" title="${escapeHtml(elementText(pet))}">
            <b>${escapeHtml(pet.Name || `pet ${index + 1}`)}</b>
            <span>HP ${hp}/${maxHp}</span>
            <small>S|${index}</small>
          </button>
        `;
      }).join("")}
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
  const sellItems = dialog.trade?.sellItems || [];
  if (!items.length && !sellItems.length) return "";
  const state = dialog.trade.inventory || inventoryState();
  const discount = dialog.trade?.discount;
  const discountNote = discount?.percent
    ? `<i class="shop-summary-badge">临时 ${Number(discount.percent)}% 优待</i>`
    : "";
  const buyList = items.slice(0, 8).map((item) => {
    const hint = shopItemHint(item);
    return `
      <button class="shop-item" type="button" data-buy="${item.id}" title="${escapeHtml(hint || item.name)}" ${shopDisabled(item) ? "disabled" : ""}>
        <span class="shop-item-main">
          <span class="shop-item-title">
            <strong>${escapeHtml(item.name)}</strong>
            ${shopItemBadges(item)}
          </span>
          <small>${escapeHtml(hint)}</small>
        </span>
        <span class="shop-price">${shopPriceMarkup(item)}</span>
      </button>
    `;
  }).join("");
  const sellList = sellItems.length
    ? sellItems.slice(0, 8).map((item) => {
      const hint = sellItemHint(item, dialog.trade);
      return `
        <button class="shop-item shop-item-sell" type="button" data-sell="${item.id}" title="${escapeHtml(hint || item.name)}" ${sellDisabled(item) ? "disabled" : ""}>
          <span class="shop-item-main">
            <span class="shop-item-title">
              <strong>${escapeHtml(item.name)} x${Number(item.qty || 0)}</strong>
            </span>
            <small>${escapeHtml(hint)}</small>
          </span>
          <span class="shop-price">${escapeHtml(sellPriceLabel(item))}</span>
        </button>
      `;
    }).join("")
    : `<p class="shop-empty">背包里没有可卖给店家的道具。</p>`;
  return `
    <div class="shop-box trade-shop-box">
      <div class="shop-summary">
        <strong>交易</strong>
        <span>${discountNote} 背包 ${state.used}/${state.capacity} | 石币 ${Number(game.player.stone || 0)}</span>
      </div>
      <section class="shop-section">
        <header><strong>买入</strong><small>店铺商品</small></header>
        <div class="shop-list">${buyList || `<p class="shop-empty">没有可购买商品。</p>`}</div>
      </section>
      <section class="shop-section">
        <header><strong>卖出</strong><small>按原脚本 sellRate ${Number(dialog.trade?.sellRate || 0)}</small></header>
        <div class="shop-list">${sellList}</div>
      </section>
    </div>
  `;
}

function renderDialogPetShop(dialog) {
  const shop = dialog.petShop;
  if (!shop) return "";
  const carry = shop.carry || {};
  const pool = shop.pool || {};
  const pets = shop.pets || [];
  const pooledPets = shop.pooledPets || [];
  const canDeposit = shop.poolEnabled && Number(pool.used || 0) < Number(pool.capacity || 0);
  const canWithdraw = shop.poolEnabled && Number(carry.used || 0) < Number(carry.capacity || 0);
  const carryList = pets.length
    ? pets.slice(0, 5).map((pet) => `
        <div class="shop-item pet-shop-item">
          <span class="pet-shop-main">
            ${petSpriteMarkup(pet.image, pet.name, "shop-pet-sprite")}
            <span>
              <span class="shop-item-title">
                <strong>${escapeHtml(pet.name)} Lv.${Number(pet.level || 1)}</strong>
                ${pet.active ? `<i class="shop-badge">出战</i>` : ""}
              </span>
              <small>${escapeHtml(petShopPetHint(pet, shop))}</small>
            </span>
          </span>
          <span class="pet-shop-actions">
            <button type="button" data-pool-pet="deposit" data-pet-index="${pet.index}" ${canDeposit && pet.affordable ? "" : "disabled"}>寄</button>
            <button type="button" data-pool-pet="sell" data-pet-index="${pet.index}" ${Number(carry.used || 0) > 1 ? "" : "disabled"}>卖</button>
          </span>
        </div>
      `).join("")
    : `<p class="shop-empty">没有随身宠物。</p>`;
  const poolList = shop.poolEnabled
    ? (pooledPets.length
      ? pooledPets.slice(0, Number(pool.capacity || 10)).map((pet) => `
          <div class="shop-item pet-shop-item shop-item-sell">
            <span class="pet-shop-main">
              ${petSpriteMarkup(pet.image, pet.name, "shop-pet-sprite")}
              <span>
                <strong>${escapeHtml(pet.name)} Lv.${Number(pet.level || 1)}</strong>
                <small>HP ${Number(pet.hp || 0)}/${Number(pet.maxHp || 0)} | ${pet.specialRate ? "特殊倍率" : "普通倍率"}</small>
              </span>
            </span>
            <span class="pet-shop-actions">
              <button type="button" data-pool-pet="withdraw" data-pool-index="${pet.index}" ${canWithdraw ? "" : "disabled"}>取</button>
            </span>
          </div>
        `).join("")
      : `<p class="shop-empty">寄放栏空着。</p>`)
    : `<p class="shop-empty">这间宠物店没有开放寄放栏。</p>`;
  return `
    <div class="shop-box pet-shop-box">
      <div class="shop-summary">
        <strong>宠物店</strong>
        <span>随身 ${Number(carry.used || 0)}/${Number(carry.capacity || 0)} | 寄放 ${Number(pool.used || 0)}/${Number(pool.capacity || 0)} | 石币 ${Number(shop.stone || game.player.stone || 0)}</span>
      </div>
      <section class="shop-section">
        <header><strong>随身宠物</strong><small>${shop.poolEnabled ? `寄放基础 ${Number(shop.poolCost || 0)}` : "可出售"}</small></header>
        <div class="shop-list">${carryList}</div>
      </section>
      <section class="shop-section">
        <header><strong>寄放栏</strong><small>${shop.poolEnabled ? "宠物店 pool" : "未开放"}</small></header>
        <div class="shop-list">${poolList}</div>
      </section>
    </div>
  `;
}

function petShopPetHint(pet, shop) {
  const parts = [`HP ${Number(pet.hp || 0)}/${Number(pet.maxHp || 0)}`];
  if (shop.poolEnabled) parts.push(`寄放 ${Number(pet.cost || 0)} 石币`);
  parts.push(`出售 ${Number(pet.cost || 0)} 石币`);
  if (pet.specialRate) parts.push("特殊倍率");
  return parts.join(" | ");
}

function renderDialogItemPoolShop(dialog) {
  const shop = dialog.itemPoolShop;
  if (!shop) return "";
  const inventory = shop.inventory || {};
  const pool = shop.pool || {};
  const items = shop.items || [];
  const pooledItems = shop.pooledItems || [];
  const canDeposit = Number(pool.used || 0) < Number(pool.capacity || 0);
  const canWithdraw = Number(inventory.used || 0) < Number(inventory.capacity || 0);
  const cost = Number(shop.cost || 0);
  const carryList = items.length
    ? items.slice(0, 12).map((item) => `
        <div class="shop-item">
          <span>
            <strong>${escapeHtml(item.name)} x${Number(item.qty || 0)}</strong>
            <small>${escapeHtml(item.description || `ImgNo ${Number(item.image || 0)}`)}</small>
          </span>
          <span class="pet-shop-actions">
            <button type="button" data-pool-item="deposit" data-item-id="${Number(item.id)}" ${canDeposit && Number(shop.stone || 0) >= cost ? "" : "disabled"}>寄</button>
          </span>
        </div>
      `).join("")
    : `<p class="shop-empty">背包里没有可寄放道具。</p>`;
  const poolList = pooledItems.length
    ? pooledItems.slice(0, Number(pool.capacity || 20)).map((item) => `
        <div class="shop-item shop-item-sell">
          <span>
            <strong>${escapeHtml(item.name)} x${Number(item.qty || 1)}</strong>
            <small>${escapeHtml(item.description || item.source || "寄放道具")}</small>
          </span>
          <span class="pet-shop-actions">
            <button type="button" data-pool-item="withdraw" data-pool-index="${Number(item.index)}" ${canWithdraw ? "" : "disabled"}>取</button>
          </span>
        </div>
      `).join("")
    : `<p class="shop-empty">寄放栏空着。</p>`;
  return `
    <div class="shop-box item-pool-shop-box">
      <div class="shop-summary">
        <strong>道具寄放</strong>
        <span>背包 ${Number(inventory.used || 0)}/${Number(inventory.capacity || 0)} | 寄放 ${Number(pool.used || 0)}/${Number(pool.capacity || 0)} | 每件 ${cost} 石币</span>
      </div>
      <section class="shop-section">
        <header><strong>背包</strong><small>寄放 1 个</small></header>
        <div class="shop-list">${carryList}</div>
      </section>
      <section class="shop-section">
        <header><strong>寄放栏</strong><small>CHAR_MAXPOOLITEMHAVE</small></header>
        <div class="shop-list">${poolList}</div>
      </section>
    </div>
  `;
}

function renderDialogPetSkillShop(dialog) {
  const shop = dialog.petSkillShop;
  if (!shop?.skills?.length) return "";
  const pet = shop.activePet;
  const slots = shop.slots || [];
  const defaultSlotIndex = slots.find((slot) => slot.empty)?.index ?? 0;
  const slotLabel = slots.map((slot) => `${slot.index + 1}:${slot.name || "空"}`).join(" ");
  const skillList = shop.skills.slice(0, 10).map((skill) => {
    const disabled = !pet || skill.affordable === false || skill.alreadyKnown;
    const hint = petSkillShopHint(skill, pet);
    return `
      <button class="shop-item" type="button"
        data-learn-pet-skill="${skill.id}"
        data-pet-index="${pet?.index ?? -1}"
        data-slot-index="${skill.defaultSlotIndex ?? defaultSlotIndex}"
        ${disabled ? "disabled" : ""}>
        <span>
          <strong>${escapeHtml(skill.name)}</strong>
          <small>${escapeHtml(hint)}</small>
        </span>
        <b>${Number(skill.cost || 0)} 石币</b>
      </button>
    `;
  }).join("");
  return `
    <div class="shop-box">
      <div class="shop-summary">
        <strong>宠物技能</strong>
        <span>${pet ? `${escapeHtml(pet.name)} Lv.${Number(pet.level || 1)}` : "没有出战宠物"} | 石币 ${Number(shop.stone || 0)}</span>
      </div>
      <section class="shop-section">
        <header><strong>训练</strong><small>skill_rate ${Number(shop.skillRate || 1)}</small></header>
        <div class="shop-list">${skillList || `<p class="shop-empty">没有可学习技能。</p>`}</div>
      </section>
      <section class="shop-section">
        <header><strong>技能格</strong><small>默认写入第一个空格</small></header>
        <p class="shop-empty">${escapeHtml(slotLabel || "没有宠物技能栏资料")}</p>
      </section>
    </div>
  `;
}

function renderDialogItemChange(dialog) {
  const itemChange = dialog.itemChange;
  if (!itemChange?.recipes?.length) return "";
  const state = itemChange.inventory || inventoryState();
  const recipes = itemChange.recipes.slice(0, 12).map((recipe) => `
    <button class="shop-item" type="button" data-change-item="${Number(recipe.index || 0)}" ${recipe.canChange ? "" : "disabled"}>
      <span>
        <strong>${escapeHtml(itemChangeRecipeName(recipe))}</strong>
        <small>${escapeHtml(itemChangeRecipeHint(recipe))}</small>
      </span>
      <b>${itemChangeRecipeCost(recipe)}</b>
    </button>
  `).join("");
  return `
    <div class="shop-box item-change-box">
      <div class="shop-summary">
        <strong>加工</strong>
        <span>背包 ${state.used}/${state.capacity} | 石币 ${Number(itemChange.stone || game.player.stone || 0)}</span>
      </div>
      <section class="shop-section">
        <header><strong>配方</strong><small>${escapeHtml(itemChange.menuHead || itemChange.source || "ItemchangeMan")}</small></header>
        <div class="shop-list">${recipes || `<p class="shop-empty">没有可加工配方。</p>`}</div>
      </section>
      <section class="shop-section">
        <header><strong>要求</strong><small>${escapeHtml(itemChange.needHead || "NeedItem / DelItem")}</small></header>
        <p class="shop-empty">${escapeHtml(itemChange.startMessage || "选择配方后会按原脚本扣除材料与石币。")}</p>
      </section>
    </div>
  `;
}

function itemChangeRecipeName(recipe) {
  return (recipe.addItems || []).map((item) => `${item.name} x${Number(item.qty || 1)}`).join("、")
    || recipe.changeItemName
    || `配方 ${Number(recipe.index || 0) + 1}`;
}

function itemChangeRecipeHint(recipe) {
  if (recipe.blockedReason) return recipe.blockedReason;
  const needs = (recipe.delItems?.length ? recipe.delItems : recipe.needItems || [])
    .map((item) => `${item.name} x${Number(item.qty || 1)}`)
    .join("、");
  const parts = [];
  if (needs) parts.push(`材料 ${needs}`);
  if (recipe.needMsg) parts.push(recipe.needMsg);
  if (recipe.free) parts.push(recipe.free);
  return parts.join(" | ") || `recipe ${Number(recipe.index || 0) + 1}`;
}

function itemChangeRecipeCost(recipe) {
  const cost = Number(recipe.delGold || 0);
  return cost > 0 ? `${cost} 石币` : "加工";
}

function petSkillShopHint(skill, pet) {
  if (!pet) return "需要先选择出战宠物";
  if (skill.alreadyKnown) return "这只宠物已经学会";
  if (skill.affordable === false) return "石币不足";
  const details = [];
  if (skill.description) details.push(skill.description);
  if (skill.battleSupported) details.push("战斗可用");
  if (Number(skill.sourceCost || 0) !== Number(skill.cost || 0)) details.push(`原价 ${Number(skill.sourceCost || 0)}`);
  return details.join(" | ") || `petskill ${skill.id}`;
}

function shopDisabled(item) {
  return item.affordable === false || item.canCarry === false;
}

function shopItemHint(item) {
  if (item.affordable === false) return "石币不足";
  if (item.canCarry === false) return "背包已满";
  const details = [];
  if (item.offMenu) {
    const remaining = effectRemainingLabel(item.offMenuUntil);
    details.push(`临时商品${remaining ? ` ${remaining}` : ""}`);
  }
  if (item.level) details.push(`Lv.${item.level}`);
  const description = cleanShopItemDescription(item.description);
  if (description) details.push(description);
  return details.join(" | ") || `item ${item.id}`;
}

function cleanShopItemDescription(value) {
  return String(value || "")
    .replace(/^AI\s*优[惠待]\s*\d+%\s*[：:]\s*/i, "")
    .replace(/^AI\s*協商\s*\d+%\s*[：:]\s*/i, "")
    .trim();
}

function isDiscountedShopItem(item) {
  const price = Number(item.price || item.discountPrice || 0);
  const source = Number(item.sourcePrice || price);
  return Number(item.discountPercent || 0) > 0 && source > price;
}

function shopItemBadges(item) {
  const badges = [];
  if (isDiscountedShopItem(item)) badges.push(`<i class="shop-badge shop-badge-discount">-${Number(item.discountPercent)}%</i>`);
  if (item.offMenu) badges.push(`<i class="shop-badge">临时</i>`);
  return badges.join("");
}

function shopPriceMarkup(item) {
  const price = Number(item.price || item.discountPrice || 0);
  const source = Number(item.sourcePrice || price);
  if (isDiscountedShopItem(item)) {
    return `<span class="shop-price-old">${source}</span><span class="shop-price-arrow">→</span><span class="shop-price-now">${price}</span><em>石币</em>`;
  }
  return `<span class="shop-price-now">${price}</span><em>石币</em>`;
}

function sellDisabled(item) {
  return item.sellable === false || Number(item.sellPrice || 0) <= 0;
}

function sellItemHint(item, trade) {
  if (item.sellable === false) return item.reason || "不能出售";
  const details = [];
  if (Number(item.sourcePrice || 0) > 0) details.push(`原价 ${Number(item.sourcePrice)}`);
  if (Number(trade?.sellRate || item.sellRate || 0) > 0) details.push(`卖出率 ${Number(trade?.sellRate || item.sellRate)}`);
  if (item.description) details.push(item.description);
  return details.join(" | ") || `item ${item.id}`;
}

function sellPriceLabel(item) {
  return `${Number(item.sellPrice || 0)} 石币`;
}

function effectRemainingLabel(until) {
  const remaining = Math.ceil((Number(until || 0) - Date.now()) / 1000);
  if (!Number.isFinite(remaining) || remaining <= 0) return "";
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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

async function sellItem(itemId) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/sell", { game, npcId: game.dialog.npcId, itemId, qty: 1 });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "出售失败");
  }
}

async function poolPet(action, petIndex, poolIndex) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/pool-pet", {
      game,
      npcId: game.dialog.npcId,
      action,
      petIndex,
      poolIndex
    });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "宠物店操作失败");
  }
}

async function poolItem(action, itemId, poolIndex) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/pool-item", {
      game,
      npcId: game.dialog.npcId,
      action,
      itemId,
      poolIndex
    });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "道具寄放操作失败");
  }
}

async function learnPetSkill(skillId, petIndex, slotIndex) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/learn-pet-skill", {
      game,
      npcId: game.dialog.npcId,
      skillId,
      petIndex,
      slotIndex
    });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "学习宠物技能失败");
  }
}

async function changeItem(recipeIndex) {
  if (!game?.dialog?.npcId) return;
  try {
    game = await api("/api/game/change-item", {
      game,
      npcId: game.dialog.npcId,
      recipeIndex
    });
    save();
    render();
  } catch (error) {
    appendDialogSystem(error.message || "加工失败");
  }
}

async function useItem(itemId) {
  if (!game) return;
  try {
    game = await api("/api/game/use-item", { game, itemId });
    syncSelectedClientItem();
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "道具使用失败");
    save();
    render();
  }
}

async function dropItem(itemId) {
  if (!game) return;
  const item = (game.inventory || []).find((entry) => Number(entry.id) === Number(itemId));
  if (!item) return;
  if (!window.confirm(`丢弃 ${item.name} x1？`)) return;
  try {
    game = await api("/api/game/drop-item", { game, itemId, qty: 1 });
    syncSelectedClientItem();
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "道具丢弃失败");
    save();
    render();
  }
}

async function equipItem(itemId) {
  if (!game) return;
  try {
    game = await api("/api/game/equip-item", { game, itemId });
    syncSelectedClientItem();
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "装备失败");
    save();
    render();
  }
}

async function unequipItem(slot) {
  if (!game) return;
  try {
    game = await api("/api/game/unequip-item", { game, slot });
    syncSelectedClientItem();
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "卸下装备失败");
    save();
    render();
  }
}

async function releasePet(petIndex) {
  if (!game) return;
  const pet = game.pets?.[petIndex];
  if (!pet) return;
  if (!window.confirm(`放生 ${pet.Name}？这会把它移出当前队伍。`)) return;
  try {
    game = await api("/api/game/pet-release", { game, petIndex });
    save();
    render();
  } catch (error) {
    game.log.push(error.message || "宠物放生失败");
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

function renderExitListHtml(map) {
  const exits = sortMapPoints(map.exits || [], exitSortMode, (exit) => distanceToExitClient(exit));
  const closedExits = sortMapPoints(map.profileClosedExits || [], exitSortMode, (exit) => distanceToExitClient(exit));
  const activeHtml = exits.map((exit) => `
    <article class="list-btn assist-map-card" role="button" tabindex="0" data-exit="${escapeHtml(exit.id)}" title="${escapeHtml(`${exit.detail || exit.source || ""} | 入口 (${exit.x}, ${exit.y})`)}">
      <div class="assist-map-card-main">
        <div class="assist-map-copy">
          <strong>${escapeHtml(exit.label)}</strong>
          <span>距离 ${formatExitDistance(exit)}</span>
        </div>
        ${renderAssistMapActions("exit", exit.id, distanceToExitClient(exit))}
      </div>
    </article>
  `).join("");
  const closedHtml = closedExits.map((exit) => `
    <article class="list-btn assist-map-card closed-profile-exit" aria-disabled="true" title="${escapeHtml(exit.reason || "当前内容 profile 暂未开放")}">
      <strong>${escapeHtml(exit.label)}</strong>
      <span>距离 ${formatExitDistance(exit)}</span>
      <small>暂未开放：${escapeHtml(exit.toName || exit.to || "目标地图")}</small>
    </article>
  `).join("");
  return activeHtml || closedHtml ? `${activeHtml}${closedHtml}` : `<p class="empty">当前地图没有出口。</p>`;
}

function renderSortBar(kind, mode) {
  const attr = kind === "npc" ? "npc-sort" : "exit-sort";
  return `
    <div class="sort-bar" aria-label="${kind === "npc" ? "NPC 排序" : "出口排序"}">
      <button type="button" data-${attr}="source" class="${mode === "source" ? "active" : ""}">原始</button>
      <button type="button" data-${attr}="distance" class="${mode === "distance" ? "active" : ""}">距离</button>
    </div>
  `;
}

function sortMapPoints(items, mode, distanceFn) {
  if (mode !== "distance") return [...items];
  return [...items]
    .map((item, index) => ({ item, index, distance: distanceFn(item) }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .map(({ item }) => item);
}

function pointDistance(x, y) {
  return cellDistance(game.location.x, game.location.y, x, y);
}

function formatCellDistance(x, y) {
  const distance = pointDistance(x, y);
  return distance === 0 ? "脚下" : `${distance} 格`;
}

function distanceToExitClient(exit) {
  if (Array.isArray(exit.tiles) && exit.tiles.length) {
    const x = Number(game.location.x || 0);
    const y = Number(game.location.y || 0);
    return Math.min(...exit.tiles.map((tile) => cellDistance(x, y, tile.x, tile.y)));
  }
  if (Array.isArray(exit.bounds) && exit.bounds.length >= 4) {
    const x = Number(game.location.x || 0);
    const y = Number(game.location.y || 0);
    const dx = x < exit.bounds[0] ? exit.bounds[0] - x : x > exit.bounds[2] ? x - exit.bounds[2] : 0;
    const dy = y < exit.bounds[1] ? exit.bounds[1] - y : y > exit.bounds[3] ? y - exit.bounds[3] : 0;
    return Math.max(dx, dy);
  }
  return pointDistance(exit.x, exit.y);
}

function formatExitDistance(exit) {
  const distance = distanceToExitClient(exit);
  return distance === 0 ? "脚下" : `${distance} 格`;
}

function renderRightCurrentSummary() {
  const map = game.world?.map || currentClientMap();
  const effect = noEncounterEffectText();
  const inventory = inventoryState();
  const pet = getActivePet();
  const firstItem = (game.inventory || []).find((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  const battle = fieldBattleSummary();
  const worldMeta = [
    game.world?.mapCount ? `地图 ${Number(game.world.mapCount)}` : "",
    game.world?.questLeadCount ? `线索 ${Number(game.world.questLeadCount)}` : "",
    map?.canWildEncounter ? "可遇敌" : "安全/无遇敌"
  ].filter(Boolean).join(" | ");
  const itemText = firstItem ? `${firstItem.name} x${Number(firstItem.qty || 0)}` : "背包还没有道具";
  const automation = automationState();
  const automationText = `${automationModeTitle()} | ${automationModeDetail()}`;
  const petText = pet
    ? `${pet.Name} Lv.${Number(pet.Lv || 1)} | HP ${Number(pet.Hp || 0)}/${Number(pet.WorkMaxHp || 0)} | ${workStatsText(pet)} | ${elementText(pet)}`
    : "没有宠物";
  const playerText = `HP ${Number(game.player.hp || 0)}/${Number(game.player.maxHp || 0)} | 点 ${Number(game.player.skillUpPoint || 0)} | 魅 ${playerCharmValue()} | ${elementText(game.player)} | 石币 ${Number(game.player.stone || 0)} | 背包 ${inventory.used}/${inventory.capacity}${effect ? ` | ${effect}` : ""}`;
  return `
    <section class="ai-status-card ai-current-card" aria-label="当前地图与状态">
      <div class="ai-status-head">
        <strong>${escapeHtml(map?.name || "当前地图")} floor ${escapeHtml(String(map?.floorId || game.location.mapId))}</strong>
        <span>(${Number(game.location.x || 0)}, ${Number(game.location.y || 0)}) | ${escapeHtml(worldMeta || "地图资料已加载")}</span>
      </div>
      <div class="ai-current-list">
        <article>
          <b>${escapeHtml(game.player.name)} Lv.${Number(game.player.level || 1)}</b>
          <span title="${escapeHtml(playerText)}">${escapeHtml(playerText)}</span>
        </article>
        <article>
          <b>宠物</b>
          <span title="${escapeHtml(petText)}">${escapeHtml(petText)}</span>
        </article>
        <article>
          <b>道具</b>
          <span title="${escapeHtml(itemText)}">${escapeHtml(itemText)}</span>
        </article>
        <article>
          <b>战斗</b>
          <span title="${escapeHtml(battle)}">${escapeHtml(battle)}</span>
        </article>
        <article class="${automation.autoLevel || automation.autoEscape ? "strong" : ""}">
          <b>自动辅助</b>
          <span title="${escapeHtml(automationText)}">${escapeHtml(automationText)}</span>
        </article>
      </div>
    </section>
  `;
}

function renderMapQuestLeadHtml(map) {
  const activeQuests = Object.values(game.quests || {});
  const sourceTasks = game.progression?.sourceTasks || [];
  const mapLeads = (map.npcs || [])
    .filter((npc) => npc.questLead)
    .slice()
    .sort((a, b) => pointDistance(a.x, a.y) - pointDistance(b.x, b.y))
    .slice(0, 5);
  const scriptLeads = (map.npcs || [])
    .filter((npc) => npc.scriptStatus && !npc.questLead)
    .slice()
    .sort((a, b) => Number(b.scriptStatus?.hasReadyBranch || 0) - Number(a.scriptStatus?.hasReadyBranch || 0) || pointDistance(a.x, a.y) - pointDistance(b.x, b.y))
    .slice(0, 5);
  if (!activeQuests.length && !sourceTasks.length && !mapLeads.length && !scriptLeads.length) return "";
  return `
    <section class="assist-lead-panel" aria-label="任务与脚本线索">
      ${activeQuests.length ? `
        <div class="assist-lead-group">
          <strong>当前任务</strong>
          ${activeQuests.slice(0, 4).map((quest) => `
            <article>
              <b>${escapeHtml(quest.title)}</b>
              <span>${escapeHtml(quest.status)} | ${escapeHtml(nextQuestStep(quest))}</span>
              ${renderGuidanceList(questGuidanceLines(quest), 3)}
            </article>
          `).join("")}
        </div>
      ` : ""}
      ${sourceTasks.length ? `
        <div class="assist-lead-group">
          <strong>原脚本事件</strong>
          ${sourceTasks.slice(0, 4).map((task) => `
            <article>
              <b>${escapeHtml(task.title)}</b>
              <span>${escapeHtml(task.next || task.status)}${task.nextNpcs?.[0]?.distance < 9999 ? ` | 距离 ${Number(task.nextNpcs[0].distance)} 格` : ""}</span>
              ${renderGuidanceList(taskGuidanceLines(task), 3)}
            </article>
          `).join("")}
        </div>
      ` : ""}
      ${mapLeads.length ? `
        <div class="assist-lead-group">
          <strong>本地图原脚本线索</strong>
          ${mapLeads.map((npc) => `
            <button class="assist-lead-row" type="button" data-npc="${escapeHtml(npc.id)}">
              <b>${escapeHtml(npc.name)}</b>
              <span>${escapeHtml(npc.questLead.summary || npc.questLead.title)} | 距离 ${formatCellDistance(npc.x, npc.y)}</span>
            </button>
          `).join("")}
        </div>
      ` : ""}
      ${scriptLeads.length ? `
        <div class="assist-lead-group">
          <strong>本地图可问 NPC</strong>
          ${scriptLeads.map((npc) => `
            <button class="assist-lead-row" type="button" data-npc="${escapeHtml(npc.id)}">
              <b>${escapeHtml(npc.name)}</b>
              <span>${escapeHtml(scriptLeadText(npc))} | 距离 ${formatCellDistance(npc.x, npc.y)}</span>
            </button>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function scriptLeadText(npc) {
  const status = npc.scriptStatus || {};
  if (status.hasReadyBranch) return "可触发原脚本";
  const unmet = (status.conditions || [])
    .flatMap((condition) => condition.unmet || [])
    .map(scriptCheckLabel)
    .filter(Boolean)
    .slice(0, 2);
  if (unmet.length) return `缺 ${unmet.join("、")}`;
  const count = Number(npc.scriptEventSummary?.count || 0);
  return count ? `${count} 段原脚本` : "脚本条件待确认";
}

function scriptCheckLabel(check) {
  if (check.itemName) return `${check.itemName} x${Number(check.needed || check.qty || 1)}`;
  if (check.petName) return check.petName;
  if (check.token) return check.token;
  return "";
}

function renderAssistPets() {
  const pets = game.pets || [];
  const petSlots = petState();
  const capacity = Math.max(5, Number(petSlots.capacity || PET_CAPACITY_FALLBACK || 5));
  const slots = Array.from({ length: Math.min(5, capacity) }, (_, index) => pets[index] || null);
  return `
    <section class="assist-grid pets-only">
      <div class="assist-pane assist-pets-pane">
        <div class="assist-pane-head">
          <h3>宠物状态 ${Number(petSlots.used || pets.length)}/${Number(petSlots.capacity || PET_CAPACITY_FALLBACK)}</h3>
          <button class="ghost-btn assist-small-btn" type="button" data-assist-client-tab="pets">主画面窗口</button>
        </div>
        <div class="assist-pet-slot-grid" aria-label="宠物 1 到 5 号槽位">
          ${slots.map((pet, index) => renderAssistPetSlot(pet, index)).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderRightQuickCommands() {
  if (!game) return "";
  const pets = game.pets || [];
  const canEncounter = Boolean(game.world?.map?.canWildEncounter) && !game.encounter;
  const automation = automationState();
  const returnPoint = game.savePoint?.born || null;
  const encounterTitle = canEncounter
    ? "按当前地图 encount.txt 触发野外遇敌"
    : (game.world?.map?.wildEncounterReason || "当前地图不能触发野外遇敌");
  const returnTitle = returnPoint
    ? `回到记录点 floor ${returnPoint.mapId} (${returnPoint.x},${returnPoint.y})`
    : "还没和记录点 NPC 完成记录时，会回到出生点";
  return `
    <section class="ai-tool-section ai-quick-section" aria-label="快速指令">
      <div class="ai-tool-head">
        <strong>快捷</strong>
        <span>${escapeHtml(automationModeTitle())}</span>
      </div>
      <div class="ai-quick-grid">
        <button type="button" data-assist-encounter ${canEncounter ? "" : "disabled"} title="${escapeHtml(encounterTitle)}">找敌</button>
        <button type="button" data-assist-rest ${pets.length ? "" : "disabled"}>回血</button>
        <button type="button" class="${automation.autoLevel ? "active" : ""}" data-assist-toggle-auto="level" aria-pressed="${automation.autoLevel ? "true" : "false"}">自动练级</button>
        <button type="button" class="${automation.autoEscape ? "active" : ""}" data-assist-toggle-auto="escape" aria-pressed="${automation.autoEscape ? "true" : "false"}">自动逃跑</button>
        <button type="button" data-assist-return-savepoint ${game.encounter ? "disabled" : ""} title="${escapeHtml(returnTitle)}">回记录点</button>
        <button type="button" data-assist-client-tab="pets">PET</button>
        <button type="button" data-assist-client-tab="items">ITEM</button>
      </div>
      <p class="ai-auto-note ${automation.autoLevel || automation.autoEscape ? "active" : ""}">
        ${escapeHtml(automationModeDetail())}
      </p>
    </section>
  `;
}

function renderAssistPetSlot(pet, index) {
  if (!pet) {
    return `
      <article class="assist-card pet-slot empty">
        <div class="assist-pet-slot-head">
          <b>${index + 1}</b>
          <span>空位</span>
        </div>
        <div class="assist-pet-empty" aria-hidden="true">空</div>
        <div class="assist-pet-info">
          <strong>未携带宠物</strong>
          <span>可通过捕获或任务获得</span>
        </div>
      </article>
    `;
  }
  const maxHp = Math.max(1, Number(pet.WorkMaxHp || pet.Hp || 1));
  const hp = Math.max(0, Number(pet.Hp || 0));
  const active = index === activePetIndex();
  const progress = progressionForPet(index, pet);
  const fieldPet = characterPetField(index) || {};
  return `
    <article class="assist-card pet-slot ${active ? "active" : ""}">
      <div class="assist-pet-slot-head">
        <b>${index + 1}</b>
        <span>${active ? "出战" : "待命"}</span>
      </div>
      <div class="assist-pet-portrait">
        ${petSpriteMarkup(pet.ImgNo, pet.Name, "assist-pet-sprite")}
      </div>
      <div class="assist-pet-info">
        <strong>${escapeHtml(pet.Name)} Lv.${Number(pet.Lv || 1)}</strong>
        <span>No.${Number(pet.PetId || 0)} | HP ${hp}/${maxHp}</span>
        <div class="assist-meter"><i style="width:${clampPercent(hp, maxHp)}%"></i></div>
        <small>${escapeHtml(workStatsText(pet))}</small>
        <small>${escapeHtml(expLabel(progress))}</small>
        <div class="assist-meter exp"><i style="width:${Number(progress.progressPct || 0)}%"></i></div>
        <small>${escapeHtml(petGrowthLabel(fieldPet, pet))}</small>
      </div>
      <div class="assist-card-actions pet-slot-actions">
        <button type="button" data-assist-active-pet="${index}" ${active ? "disabled" : ""}>战</button>
        <button type="button" data-assist-release-pet="${index}" ${game.pets.length <= 1 ? "disabled" : ""}>放</button>
      </div>
    </article>
  `;
}

function renderAssistItems() {
  const state = inventoryState();
  const items = (game.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  return `
    <section class="assist-grid two">
      <div class="assist-pane">
        <div class="assist-pane-head">
          <h3>道具</h3>
          <button class="ghost-btn assist-small-btn" type="button" data-assist-client-tab="items">主画面窗口</button>
        </div>
        <div class="assist-item-list">
          ${items.map(renderAssistItem).join("") || `<p class="empty">背包还没有道具。</p>`}
        </div>
      </div>
      <div class="assist-pane compact">
        <h3>背包状态</h3>
        <div class="assist-stat-grid">
          <article><strong>${state.used}/${state.capacity}</strong><span>容量</span></article>
          <article><strong>${Number(game.player.stone || 0)}</strong><span>石币</span></article>
          <article><strong>${items.filter(inventoryItemUsable).length}</strong><span>可快速使用</span></article>
        </div>
        <button type="button" data-assist-client-tab="items">打开 ITEM</button>
      </div>
    </section>
  `;
}

function renderAssistItem(item) {
  const gear = inventoryItemGear(item);
  const usable = inventoryItemUsable(item);
  return `
    <article class="assist-card item">
      <div>
        <strong>${escapeHtml(item.name || `item ${item.id}`)}</strong>
        <span>x${Number(item.qty || 0)} | type ${escapeHtml(String(item.type ?? ""))}</span>
        <small>${escapeHtml(item.description || item.source || "")}</small>
      </div>
      <div class="assist-card-actions item">
        ${gear
          ? `<button type="button" data-assist-equip-item="${item.id}">穿</button>`
          : `<button type="button" data-assist-use-item="${item.id}" ${usable ? "" : "disabled"}>用</button>`}
        <button type="button" data-assist-drop-item="${item.id}">丢</button>
      </div>
    </article>
  `;
}

function renderAssistCharacter() {
  const player = game.player;
  const progress = progressionForPlayer();
  const equipment = characterEquipmentSummary();
  const canSpendPoints = Number(player.skillUpPoint || 0) > 0 && !game.encounter;
  const work = workStatsText(player);
  return `
    <section class="assist-grid two">
      <div class="assist-pane">
        <div class="assist-pane-head">
          <h3>人物</h3>
          <button class="ghost-btn assist-small-btn" type="button" data-assist-client-tab="status">主画面窗口</button>
        </div>
        <div class="assist-stat-grid">
          <article><strong>Lv.${Number(player.level || 1)}</strong><span>等级</span></article>
          <article><strong>${Number(progress.exp || 0)}</strong><span>NEXT ${Number(progress.expToNext || 0)}</span></article>
          <article><strong>${Number(player.hp || 0)}/${Number(player.maxHp || 0)}</strong><span>HP</span></article>
          <article><strong>${Number(player.stone || 0)}</strong><span>石币</span></article>
          <article><strong>${playerCharmValue(player)}</strong><span>魅力</span></article>
          <article><strong>${Number(player.skillUpPoint || 0)}</strong><span>可分配能力点</span></article>
          <article><strong>${escapeHtml(elementText(player))}</strong><span>地水火风</span></article>
          <article><strong>${escapeHtml(work)}</strong><span>攻防敏</span></article>
        </div>
        <div class="assist-status-strip single">
          <div>
            <strong>基础点</strong>
            <span>${escapeHtml(basePointText(player))}</span>
          </div>
          <div>
            <strong>位置</strong>
            <span>${escapeHtml(game.world.map.name)} | floor ${escapeHtml(String(game.location.mapId))} | (${Number(game.location.x || 0)},${Number(game.location.y || 0)})</span>
          </div>
          <div>
            <strong>状态</strong>
            <span>${escapeHtml(noEncounterEffectText() || "普通")} | 魅 ${playerCharmValue(player)} | 战 ${Number(player.battleCount || 0)} 胜 ${Number(player.winCount || 0)}</span>
          </div>
        </div>
        <div class="assist-point-actions">
          ${playerPointButtonsHtml(!canSpendPoints)}
        </div>
      </div>
      <div class="assist-pane compact">
        <h3>装备</h3>
        <div class="assist-item-list">
          ${equipment.map((item) => `
            <article class="assist-card item">
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <span>${escapeHtml(item.slot)}</span>
                <small>${escapeHtml(item.description)}</small>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function characterEquipmentSummary() {
  const equipped = game.character?.equipment || game.player?.equipment || {};
  const rows = Object.entries(equipped).filter(([, item]) => item);
  if (rows.length) {
    return rows.map(([slot, item]) => ({
      slot,
      id: item.id,
      name: item.name || item.Name || `item ${item.id || ""}`,
      description: item.description || item.source || "",
      equipped: true
    }));
  }
  const gearItems = (game.inventory || []).filter(inventoryItemGear);
  if (gearItems.length) {
    return gearItems.slice(0, 5).map((item) => ({
      slot: `背包候选 / ${inventoryItemEquipmentSlot(item)}`,
      id: item.id,
      name: item.name || `item ${item.id}`,
      description: item.description || item.source || "",
      equipped: false
    }));
  }
  return [{ slot: "装备栏", name: "未装备", description: "背包里有装备时可以在 ITEM 窗口直接穿上", equipped: false }];
}

function renderAssistKnowledge() {
  return `
    <section class="assist-grid two">
      <div class="assist-pane">
        <h3>资料库</h3>
        <div class="search-row assist-search-row">
          <input id="assistDataQuery" type="search" value="${escapeHtml(els.dataQuery?.value || "")}" placeholder="搜索地图、NPC、道具、宠物、遇敌数据">
          <button type="button" data-assist-search>搜索</button>
        </div>
        <div id="assistDataResults" class="result-list compact-results">
          ${els.dataResults?.innerHTML || `<p class="empty">输入两个字以上搜索 gmsv data。</p>`}
        </div>
      </div>
      <div class="assist-pane compact">
        <h3>AI Workspace</h3>
        ${renderAiWorkspaceMini()}
        <h3>当前线索</h3>
        <div class="assist-log-mini">
          ${(game.log || []).slice(-7).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderAiWorkspaceMini() {
  const workspace = game.aiWorkspace || {};
  const memories = Array.isArray(workspace.memories) ? workspace.memories.slice(0, 5) : [];
  return `
    <div class="assist-debug-list workspace-mini">
      <article class="assist-debug-row">
        <b>schema</b>
        <span>${escapeHtml(workspace.schema || "stoneage-ai-workspace-v1")}</span>
      </article>
      <article class="assist-debug-row">
        <b>memory</b>
        <span>${memories.length}/${Number(workspace.memories?.length || 0)} saved notes</span>
      </article>
      ${memories.length ? memories.map((entry) => `
        <article class="assist-debug-row">
          <b>${escapeHtml(entry.kind || "note")}</b>
          <span>${escapeHtml(`${entry.title || "未命名"}：${entry.text || ""}`.slice(0, 120))}</span>
        </article>
      `).join("") : `<article class="assist-debug-row"><b>notes</b><span>暂无 AI memory；可由 Worker 校验接口写入。</span></article>`}
    </div>
  `;
}

function renderAssistDebug() {
  const dialog = game.dialog?.open ? game.dialog : null;
  const debug = dialog?.debug || {};
  const trace = (debug.vmTrace || game.npcVmEvents || []).slice(-10).reverse();
  const rows = [
    ["NPC", dialog ? `${dialog.npcName || "--"} | ${dialog.npcType || "--"} | AI ${dialog.aiMode ? "on" : "off"}` : "当前没有打开 NPC 对话"],
    ["source", dialogDebugLine(dialog)],
    ["script", debug.script || "--"],
    ["template", debug.template || "--"],
    ["actions", (debug.actions || []).join("/") || "--"],
    ["talkFlow", debug.talkFlow || "--"],
    ["trade", dialog?.trade?.source || "--"],
    ["battle", game.battle?.source || game.encounter?.source || "--"],
    ["AI", `${aiRuntimeLabel()} | action ${aiRuntime.actionAuthority || "worker-npc-vm"}`]
  ];
  return `
    <section class="assist-grid two">
      <div class="assist-pane">
        <h3>Debug</h3>
        <div class="assist-debug-list">
          ${rows.map(([label, value]) => `
            <article class="assist-debug-row">
              <b>${escapeHtml(label)}</b>
              <span>${escapeHtml(value || "--")}</span>
            </article>
          `).join("")}
        </div>
      </div>
      <div class="assist-pane compact">
        <h3>NPC VM Trace</h3>
        <div class="assist-debug-trace">
          ${trace.length ? trace.map((event) => `
            <article>
              <b>${escapeHtml(`${event.action || "--"}:${event.status || "--"}`)}</b>
              <span>${escapeHtml(event.npcName || event.npcId || "--")}</span>
              <code>${escapeHtml(JSON.stringify(event.detail || {}).slice(0, 180))}</code>
            </article>
          `).join("") : `<p class="empty">暂无 NPC VM trace。</p>`}
        </div>
      </div>
    </section>
  `;
}

function fieldBattleSummary() {
  const enemy = game.encounter;
  if (!enemy) {
    const outcome = recentBattleOutcome();
    return outcome ? battleOutcomeSummary(outcome) : "当前无战斗";
  }
  const activePet = getActivePet();
  const enemyMax = Math.max(1, Number(enemy.WorkMaxHp || enemy.Hp || 1));
  const enemyHp = Math.max(0, Number(enemy.Hp ?? enemyMax));
  const petText = activePet ? `${activePet.Name} HP ${Number(activePet.Hp || 0)}/${Number(activePet.WorkMaxHp || 0)}` : "无出战宠物";
  const lastLine = (game.battle?.log || []).slice(-1)[0] || "战斗开始";
  return `${escapeHtml(enemy.Name || "敌人")} Lv.${Number(enemy.Lv || 1)} HP ${enemyHp}/${enemyMax} | ${escapeHtml(petText)} | ${escapeHtml(lastLine)}`;
}

function recentBattleOutcome() {
  return game?.battleOutcome || game?.lastBattleOutcome || game?.save?.json?.lastBattleOutcome || null;
}

function battleOutcomeSummary(outcome = {}) {
  const resultLabel = {
    turn: "回合",
    item: "道具",
    "next-enemy": "换敌",
    victory: "胜利",
    captured: "捕获",
    defeat: "撤退",
    escaped: "逃跑",
    "escape-failed": "逃跑失败",
    released: "放走",
    "enemy-escaped": "敌逃",
    "enemy-escaped-next": "敌逃",
    "capture-missed": "捕获失败",
    "pet-full": "宠物栏满"
  }[outcome.result] || outcome.result || "战斗";
  const exp = Number(outcome.playerExp ?? outcome.exp ?? 0);
  const petExp = Number(outcome.petExp || 0);
  const stone = Number(outcome.stone || 0);
  const petName = outcome.petName || "出战宠";
  const levelUps = (outcome.levelUps || []).slice(0, 2).join("；");
  const parts = [`${resultLabel}${outcome.enemyName ? ` ${outcome.enemyName}` : ""}`];
  const commandText = battleCommandSummary(outcome.playerAction?.command || outcome.sourceCommand);
  if (commandText) parts.push(commandText);
  if (exp > 0) parts.push(`人物 +${exp}EXP`);
  if (petExp > 0) parts.push(`${petName} +${petExp}EXP`);
  if (stone > 0) parts.push(`石币 +${stone}`);
  const lootItems = (outcome.lootItems || []).slice(0, 3);
  if (lootItems.length) parts.push(`掉落 ${lootItems.map((item) => `${item.name || `item ${item.id}`} x${Number(item.qty || 1)}`).join("、")}`);
  const skippedLootItems = (outcome.skippedLootItems || []).slice(0, 2);
  if (skippedLootItems.length) parts.push(`背包满 ${skippedLootItems.map((item) => item.name || `item ${item.id}`).join("、")}`);
  if (levelUps) parts.push(levelUps);
  return parts.join(" | ");
}

function battleCommandSummary(command) {
  const value = String(command || "").toUpperCase();
  if (!value) return "";
  if (value.startsWith("H")) return "攻击";
  if (value === "G") return "防御";
  if (value.startsWith("T")) return "捕获";
  if (value === "I") return "道具";
  if (value.startsWith("W")) return "技能";
  if (value === "N") return "待机";
  if (value === "E") return "逃跑";
  return value;
}

function noEncounterEffectText() {
  const until = Number(game.effects?.noEncounterUntil || 0);
  const remaining = Math.ceil((until - Date.now()) / 1000);
  if (remaining <= 0) return "";
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `避敌 ${minutes}:${String(seconds).padStart(2, "0")}`;
}

function renderAiStatusPanel() {
  if (!els.aiStatusPanel || !game) return;
  const rows = aiStatusRows();
  const runtime = aiRuntimeLabel();
  els.aiStatusPanel.innerHTML = `
    ${renderRightCurrentSummary()}
    ${renderMapQuestLeadHtml(game.world.map)}
    <section class="ai-status-card ai-state-card" aria-label="AI 与临时状态">
      <div class="ai-tool-head">
        <strong>AI / 状态</strong>
        <span>${escapeHtml(runtime)}</span>
      </div>
      <div class="ai-effect-list">
        ${rows.map((row) => `
          <article class="ai-effect-row ${row.strong ? "strong" : ""}">
            <b>${escapeHtml(row.label)}</b>
            <span>${escapeHtml(row.text)}</span>
          </article>
        `).join("") || `<article class="ai-effect-row"><b>临时状态</b><span>暂无 AI 或 NPC 协商效果</span></article>`}
      </div>
    </section>
    ${renderRightQuickCommands()}
  `;
}

function aiRuntimeLabel() {
  const provider = {
    openai: "OpenAI",
    "workers-ai": "Workers AI",
    "local-rule": "本地规则",
    "local-action": "本地动作",
    unknown: "检测中"
  }[aiRuntime.provider] || aiRuntime.provider || "检测中";
  const model = aiRuntime.model && aiRuntime.model !== aiRuntime.provider ? ` ${aiRuntime.model}` : "";
  return `${provider}${model}`.trim();
}

function aiStatusRows() {
  const rows = [];
  const now = Date.now();
  const automation = automationState();
  if (automation.autoLevel || automation.autoEscape) {
    rows.push({
      label: "自动辅助",
      text: `${automationModeTitle()} | ${automationModeDetail()}`,
      strong: true
    });
  }
  const outcome = recentBattleOutcome();
  if (outcome && !game.encounter) {
    rows.push({
      label: "战斗结算",
      text: battleOutcomeSummary(outcome),
      strong: Number(outcome.playerExp ?? outcome.exp ?? 0) > 0 || Number(outcome.petExp || 0) > 0
    });
  }
  const noEncounterUntil = Number(game.effects?.noEncounterUntil || 0);
  if (noEncounterUntil > now) {
    rows.push({
      label: "AI 避敌",
      text: `${effectRemainingLabel(noEncounterUntil)} | ${effectSourceText(game.effects?.noEncounterReason, game.effects?.noEncounterSource)}`,
      strong: true
    });
  }
  const metamo = game.effects?.metamo;
  const metamoUntil = Number(metamo?.until || game.effects?.metamoUntil || 0);
  if (metamoUntil > now) {
    rows.push({
      label: "道具变身",
      text: `${metamo?.formName || metamo?.itemName || "临时形象"} | ${effectRemainingLabel(metamoUntil)}`,
      strong: true
    });
  }
  for (const [npcId, entry] of Object.entries(game.effects?.shopDiscounts || {})) {
    const until = Number(entry?.until || 0);
    if (until <= now) continue;
    rows.push({
      label: "商店优待",
      text: `${knownNpcName(npcId)} ${Number(entry.percent || 0)}% 折扣 | ${effectRemainingLabel(until)}`,
      strong: true
    });
  }
  for (const [npcId, entry] of Object.entries(game.effects?.offMenuShop || {})) {
    const until = Number(entry?.until || 0);
    if (until <= now) continue;
    const items = (entry.items || []).map((item) => item.name || `item ${item.id}`).filter(Boolean).slice(0, 2).join("、");
    rows.push({
      label: "临时商品",
      text: `${knownNpcName(npcId)} ${items || "隐藏商品"} | ${effectRemainingLabel(until)}`,
      strong: true
    });
  }
  for (const [npcId, entry] of Object.entries(game.flags?.npcEnemyDefeats || {})) {
    const until = Date.parse(entry?.until || "");
    if (!Number.isFinite(until) || until <= now) continue;
    rows.push({
      label: "通行状态",
      text: `${knownNpcName(npcId)} ${npcBypassMode(entry.mode)} | ${effectRemainingLabel(until)}`,
      strong: true
    });
  }
  for (const [key, value] of Object.entries(game.effects?.npcGifts || {})) {
    if (!value) continue;
    rows.push({
      label: "额外收获",
      text: `${knownNpcName(key.split(":")[0])} 给过特殊物品`,
      strong: false
    });
  }
  for (const row of genericAiBoostRows()) rows.push(row);
  return rows.slice(0, 7);
}

function genericAiBoostRows() {
  const sources = [
    ["属性加成", game.effects?.statBoosts],
    ["属性加成", game.effects?.attributeBoosts],
    ["AI 状态", game.effects?.aiBoosts]
  ];
  const rows = [];
  const now = Date.now();
  for (const [label, value] of sources) {
    if (!value || typeof value !== "object") continue;
    for (const [key, entry] of Object.entries(value)) {
      const until = Number(entry?.until || 0);
      if (until && until <= now) continue;
      const amount = entry?.amount ?? entry?.value ?? entry?.percent ?? "";
      const unit = entry?.percent ? "%" : "";
      rows.push({
        label,
        text: `${key}${amount !== "" ? ` +${amount}${unit}` : ""}${until ? ` | ${effectRemainingLabel(until)}` : ""}`,
        strong: true
      });
    }
  }
  return rows;
}

function effectSourceText(reason, source) {
  if (source) return source;
  if (reason === "ai-negotiation") return "NPC 协商";
  if (reason) return reason;
  return "AI 向导";
}

function knownNpcName(npcId) {
  const id = String(npcId || "");
  const current = game.world?.map?.npcs?.find((npc) => npc.id === id);
  if (current?.name) return current.name;
  const event = (game.npcVmEvents || []).slice().reverse().find((item) => item.npcId === id);
  return event?.npcName || "NPC";
}

function npcBypassMode(mode) {
  if (mode === "bribe") return "买路放行";
  if (mode === "threat") return "威慑放行";
  if (mode === "negotiation") return "交涉放行";
  return "暂时放行";
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
  const activePet = getActivePet();
  const enemyHp = Number.isFinite(Number(enemy.Hp)) ? Number(enemy.Hp) : Number(enemy.WorkMaxHp || 0);
  const petHp = activePet ? `${activePet.Name} HP ${Number(activePet.Hp || activePet.WorkMaxHp || 0)}/${activePet.WorkMaxHp}` : "无出战宠物";
  els.encounterStats.textContent = `捕获率 ${enemy.CaptureRate}% | 敌 HP ${enemyHp}/${enemy.WorkMaxHp} | ${workStatsText(enemy)} | ${elementText(enemy)} | ${petHp}`;
  setBattleSprite(els.encounterImg, enemy.ImgNo);
  els.attackBtn.disabled = false;
  els.battleLog.innerHTML = (game.battle?.log || []).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function renderMapHud() {
  const playerHp = clampPercent(game.player.hp, game.player.maxHp);
  const activePet = getActivePet();
  const inventory = inventoryState();
  const petsUsed = petUsed();
  const petsCapacity = petCapacity();
  els.mapHudName.textContent = game.player.name;
  els.mapHudMeta.textContent = `Lv.${game.player.level} | ${expLabel(progressionForPlayer())} | 点 ${Number(game.player.skillUpPoint || 0)} | 魅 ${playerCharmValue()}`;
  els.mapHudHpBar.style.width = `${playerHp}%`;
  els.mapHudHpText.textContent = `HP ${Number(game.player.hp || 0)}/${Number(game.player.maxHp || 0)}`;
  if (activePet) {
    const petHp = clampPercent(activePet.Hp, activePet.WorkMaxHp);
    els.mapHudPetName.textContent = activePet.Name;
    els.mapHudPetMeta.textContent = `Lv.${activePet.Lv} | ${expLabel(progressionForPet(activePetIndex(), activePet))}`;
    els.mapHudPetHpBar.style.width = `${petHp}%`;
    els.mapHudPetHpText.textContent = `HP ${Number(activePet.Hp || 0)}/${Number(activePet.WorkMaxHp || 0)}`;
  } else {
    els.mapHudPetName.textContent = "无出战宠物";
    els.mapHudPetMeta.textContent = "宠物栏为空";
    els.mapHudPetHpBar.style.width = "0%";
    els.mapHudPetHpText.textContent = "--";
  }
  els.mapHudInventory.textContent = `石币 ${Number(game.player.stone || 0)} | 背包 ${inventory.used}/${inventory.capacity} | 宠物 ${petsUsed}/${petsCapacity}`;
}

function renderFieldMessage() {
  const last = [...(game.log || [])].reverse().find((line) => String(line || "").trim());
  els.fieldMessage.textContent = last || `${game.player.name} 来到了 ${game.world.map.name}。`;
}

function renderClientWindow() {
  if (!els.clientWindow) return;
  if (!game || !clientWindowOpen || isBattleOpen()) {
    els.clientWindow.hidden = true;
    return;
  }
  const content = clientWindowContent(activeTab);
  els.clientWindowTitle.textContent = content.title;
  els.clientWindowBody.innerHTML = content.html;
  els.clientWindow.hidden = false;
  hydrateAtlasSprites(loadedTileAtlas, els.clientWindowBody);
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
  if (name === "save" || name === "items") return clientItemWindow();
  if (name === "status") return clientCharacterWindow();
  if (name === "quests") return clientQuestWindow();
  if (name === "log") return clientLogWindow();
  if (name === "data") return clientDataWindow();
  if (name === "ai") return clientAiWindow();
  return clientPetWindow();
}

function clientCharacterWindow() {
  const player = game.player;
  const progress = progressionForPlayer();
  const equipment = characterEquipmentSummary();
  const canSpendPoints = Number(player.skillUpPoint || 0) > 0 && !game.encounter;
  const work = workStatsText(player);
  return {
    title: "STATUS",
    html: `
      <div class="client-list-window">
        <article><strong>${escapeHtml(player.name)}</strong><span>Lv.${Number(player.level || 1)} | ${escapeHtml(expLabel(progress))} | 石币 ${Number(player.stone || 0)}</span></article>
        <article><strong>耐久力</strong><span>${Number(player.hp || 0)} / ${Number(player.maxHp || 0)}</span></article>
        <article><strong>能力</strong><span>${escapeHtml(work)}</span></article>
        <article><strong>魅力</strong><span>${playerCharmValue(player)} / 100 | 决斗点 ${Number(player.duelPoint || 0)}</span></article>
        <article><strong>基础点</strong><span>${escapeHtml(basePointText(player))}</span></article>
        <article><strong>属性</strong><span>${escapeHtml(elementText(player))}</span></article>
        <article>
          <strong>能力点 ${Number(player.skillUpPoint || 0)}</strong>
          <div class="client-point-actions">
            ${playerPointButtonsHtml(!canSpendPoints)}
          </div>
        </article>
        <article><strong>计数</strong><span>战 ${Number(player.battleCount || 0)} | 胜 ${Number(player.winCount || 0)} | 击倒 ${Number(player.killPetCount || 0)}</span></article>
        <article><strong>当前位置</strong><span>${escapeHtml(game.world.map.name)} (${Number(game.location.x || 0)},${Number(game.location.y || 0)})</span></article>
        ${equipment.map((item) => `
          <article class="client-equipment-row">
            <div>
              <strong>${escapeHtml(item.slot)}</strong>
              <span>${escapeHtml(item.name)} | ${escapeHtml(item.description)}</span>
            </div>
            ${item.equipped && item.name !== "未装备"
              ? `<button type="button" data-client-unequip-slot="${escapeHtml(item.slot)}">卸下</button>`
              : item.id
                ? `<button type="button" data-client-open-item="${item.id}">查看</button>`
                : `<button type="button" data-client-show-status disabled>查看</button>`}
          </article>
        `).join("")}
      </div>
    `
  };
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
  const pet = getActivePet();
  if (!pet) {
    return {
      title: "PET STATUS",
      html: `<p class="client-empty">没有出战宠物。</p>`
    };
  }
  const hp = Number(pet.Hp || 0);
  const maxHp = Number(pet.WorkMaxHp || hp || 1);
  const activeIndex = activePetIndex();
  const progress = progressionForPet(activeIndex, pet);
  const fieldPet = characterPetField(activeIndex) || {};
  const pets = game.pets || [];
  const work = workStats(pet);
  return {
    title: "PET STATUS",
    html: `
      <div class="client-pet-status">
        <div class="client-pet-portrait">
          ${petSpriteMarkup(pet.ImgNo, pet.Name, "client-pet-sprite")}
          <strong>${escapeHtml(pet.Name)}</strong>
        </div>
        <div class="client-stat-stack">
          ${clientStatRow("等级", pet.Lv)}
          ${clientStatRow("经验值", Number(progress.exp || 0))}
          ${clientStatRow("NEXT", Number(progress.nextExp) < 0 ? "MAX" : Number(progress.expToNext || 0))}
          ${clientStatRow("耐久力", `${hp}/${maxHp}`)}
          ${clientStatRow("攻击力", work.attack)}
          ${clientStatRow("防御力", work.defense)}
          ${clientStatRow("敏捷力", work.quick)}
          ${clientStatRow("忠诚度", pet.Loyal || 100)}
          ${clientStatRow("成长", petGrowthLabel(fieldPet, pet))}
          ${clientStatRow("战绩", petCounterLabel(fieldPet, pet))}
        </div>
      </div>
      <div class="client-meter-row">
        <span>地属性</span><i style="width:${clampPercent(pet.EarthAT || pet.Earth || pet.earth || 0, 100)}%"></i>
      </div>
      <div class="client-meter-row water">
        <span>水属性</span><i style="width:${clampPercent(pet.WaterAT || pet.Water || pet.water || 0, 100)}%"></i>
      </div>
      <div class="client-meter-row fire">
        <span>火属性</span><i style="width:${clampPercent(pet.FireAT || pet.Fire || pet.fire || 0, 100)}%"></i>
      </div>
      <div class="client-meter-row wind">
        <span>风属性</span><i style="width:${clampPercent(pet.WindAT || pet.Wind || pet.wind || 0, 100)}%"></i>
      </div>
      <div class="client-party-row">
        ${pets.map((entry, index) => `
          <button type="button" class="${index === activePetIndex() ? "active" : ""}" data-client-active-pet="${index}" title="设为出战宠：${escapeHtml(entry.Name)}" ${index === activePetIndex() ? "disabled" : ""}>
            ${petSpriteMarkup(entry.ImgNo, entry.Name, "client-party-pet-sprite")}
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
  const selected = selectedClientInventoryItem(inventory);
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
        ${slots.map((item) => clientItemSlot(item, selected)).join("")}
      </div>
      ${selected ? clientSelectedItemPanel(selected) : `
        <div class="client-item-desc">
          <strong>背包</strong>
          <span>空位 ${state.remaining ?? Math.max(0, capacity - state.used)}/${capacity}</span>
        </div>
      `}
    `
  };
}

function clientItemSlot(item, selected) {
  if (!item) return `<span class="client-slot empty"></span>`;
  const label = item.image || item.type || item.name || "物";
  const isSelected = Number(selected?.id) === Number(item.id);
  const gear = inventoryItemGear(item);
  return `
    <button class="client-slot filled ${isSelected ? "selected" : ""} ${gear ? "gear" : ""}" type="button" data-client-select-item="${item.id}" title="${escapeHtml(item.description || item.name)}">
      <b>${escapeHtml(String(label).slice(0, 2))}</b>
      <small>x${Number(item.qty || 0)}</small>
    </button>
  `;
}

function clientSelectedItemPanel(item) {
  const usable = inventoryItemUsable(item);
  const gear = inventoryItemGear(item);
  const description = item.description || item.source || "道具资料来自 itemset6.txt。";
  return `
    <div class="client-item-desc">
      <strong>${escapeHtml(item.name || `item ${item.id}`)}</strong>
      <span>${escapeHtml(description)}</span>
      <div class="client-item-meta">
        <em>${escapeHtml(gear ? `装备候选 / ${inventoryItemEquipmentSlot(item)}` : (usable ? "可使用" : "不可直接使用"))}</em>
        <em>x${Number(item.qty || 0)}</em>
      </div>
      <div class="client-item-actions">
        ${gear ? `<button type="button" data-client-equip-item="${item.id}">穿上</button>` : `<button type="button" data-client-use-item="${item.id}" ${usable ? "" : "disabled"}>使用</button>`}
        <button type="button" data-client-drop-item="${item.id}">丢弃</button>
        <button type="button" data-client-show-status>装备栏</button>
      </div>
    </div>
  `;
}

function clientQuestWindow() {
  const quests = Object.values(game.quests || {});
  const sourceTasks = game.progression?.sourceTasks || [];
  return {
    title: "QUEST",
    html: quests.length || sourceTasks.length ? `
      <div class="client-list-window">
        ${quests.map((quest) => `
          <article>
            <strong>${escapeHtml(quest.title)}</strong>
            <span>${escapeHtml(quest.status)} | ${escapeHtml(nextQuestStep(quest))}</span>
            ${renderGuidanceList(questGuidanceLines(quest), 3)}
          </article>
        `).join("")}
        ${sourceTasks.map((task) => `
          <article>
            <strong>${escapeHtml(task.title)}</strong>
            <span>${escapeHtml(task.status)} | ${escapeHtml(task.next || "继续推进原脚本事件")}</span>
            ${renderGuidanceList(taskGuidanceLines(task), 3)}
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
          <span>client map + gmsv-data/npc + gmsv-data/mapwarp.txt</span>
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
        <article>
          <strong>运行时</strong>
          <span>${escapeHtml(aiRuntimeLabel())} | 状态执行：Worker NPC VM</span>
        </article>
      </div>
    `
  };
}

function clientStatRow(label, value) {
  return `<div class="client-stat-row"><b>${escapeHtml(label)}</b><span>${escapeHtml(value ?? "--")}</span></div>`;
}

function playerPointButtonsHtml(disabled = false) {
  return [
    ["Vital", "体"],
    ["Str", "腕"],
    ["Tough", "耐"],
    ["Dex", "速"]
  ].map(([stat, label]) => `
    <button type="button" data-player-stat-up="${stat}" ${disabled ? "disabled" : ""} title="消耗 1 点能力点增加${label}">
      +${label}
    </button>
  `).join("");
}

function basePointText(entity = {}) {
  return `体 ${basePointValue(entity.Vital)} | 腕 ${basePointValue(entity.Str)} | 耐 ${basePointValue(entity.Tough)} | 速 ${basePointValue(entity.Dex)}`;
}

function basePointValue(value) {
  return Math.trunc(Math.max(0, Number(value || 0)) / 100);
}

function playerCharmValue(player = game?.player) {
  const raw = player?.charm ?? player?.Charm ?? game?.characterFields?.base?.charm;
  const value = raw === undefined || raw === null || raw === "" ? 60 : raw;
  return Math.max(0, Math.min(100, Math.trunc(Number(value || 0))));
}

function workStats(entity = {}, fallback = null) {
  const current = entity || {};
  const currentWork = current.work || {};
  const backup = fallback || {};
  const backupWork = backup.work || {};
  return {
    attack: firstDisplayNumber(currentWork.WorkAttackPower, current.WorkAttackPower, backupWork.WorkAttackPower, backup.WorkAttackPower, currentWork.WorkFixStr, current.WorkFixStr, backupWork.WorkFixStr, backup.WorkFixStr),
    defense: firstDisplayNumber(currentWork.WorkDefencePower, current.WorkDefencePower, backupWork.WorkDefencePower, backup.WorkDefencePower, currentWork.WorkFixTough, current.WorkFixTough, backupWork.WorkFixTough, backup.WorkFixTough),
    quick: firstDisplayNumber(currentWork.WorkQuick, current.WorkQuick, backupWork.WorkQuick, backup.WorkQuick, currentWork.WorkFixDex, current.WorkFixDex, backupWork.WorkFixDex, backup.WorkFixDex)
  };
}

function workStatsText(entity = {}, fallback = null, separator = " | ") {
  const stats = workStats(entity, fallback);
  return [`攻 ${stats.attack}`, `防 ${stats.defense}`, `敏 ${stats.quick}`].join(separator);
}

function firstDisplayNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const number = Number(value);
    if (Number.isFinite(number)) return Math.trunc(number);
  }
  return 0;
}

function elementText(entity = {}) {
  const element = elementVector(entity);
  return `地 ${element.earth} | 水 ${element.water} | 火 ${element.fire} | 风 ${element.wind}`;
}

function elementVector(entity = {}) {
  const nested = entity.elements || {};
  return {
    earth: clampElement(entity.EarthAT ?? entity.Earth ?? entity.earth ?? nested.EarthAT ?? nested.earth),
    water: clampElement(entity.WaterAT ?? entity.Water ?? entity.water ?? nested.WaterAT ?? nested.water),
    fire: clampElement(entity.FireAT ?? entity.Fire ?? entity.fire ?? nested.FireAT ?? nested.fire),
    wind: clampElement(entity.WindAT ?? entity.WindAt ?? entity.Wind ?? entity.wind ?? nested.WindAT ?? nested.WindAt ?? nested.wind)
  };
}

function clampElement(value) {
  const number = Math.trunc(Number(value || 0));
  return Math.max(0, Math.min(100, Number.isFinite(number) ? number : 0));
}

function bindClientWindowActions() {
  els.clientWindowBody.querySelectorAll("[data-client-active-pet]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/pet-mode", { petIndex: Number(btn.dataset.clientActivePet), mode: "active" }));
  });
  els.clientWindowBody.querySelectorAll("[data-client-select-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = Number(btn.dataset.clientSelectItem);
      const now = Date.now();
      const repeatedClick = Number(lastClientItemClick.id) === itemId && now - Number(lastClientItemClick.at || 0) < 450;
      lastClientItemClick = { id: itemId, at: now };
      selectedClientItemId = itemId;
      if (!repeatedClick) {
        renderClientWindow();
        return;
      }
      const item = (game.inventory || []).find((entry) => Number(entry.id) === itemId);
      if (item && inventoryItemGear(item)) equipItem(itemId);
      else if (item && inventoryItemUsable(item)) useItem(itemId);
      else renderClientWindow();
    });
  });
  els.clientWindowBody.querySelectorAll("[data-client-use-item]").forEach((btn) => {
    btn.addEventListener("click", () => useItem(Number(btn.dataset.clientUseItem)));
  });
  els.clientWindowBody.querySelectorAll("[data-client-equip-item]").forEach((btn) => {
    btn.addEventListener("click", () => equipItem(Number(btn.dataset.clientEquipItem)));
  });
  els.clientWindowBody.querySelectorAll("[data-client-drop-item]").forEach((btn) => {
    btn.addEventListener("click", () => dropItem(Number(btn.dataset.clientDropItem)));
  });
  els.clientWindowBody.querySelectorAll("[data-client-unequip-slot]").forEach((btn) => {
    btn.addEventListener("click", () => unequipItem(btn.dataset.clientUnequipSlot));
  });
  els.clientWindowBody.querySelectorAll("[data-client-show-status]").forEach((btn) => {
    btn.addEventListener("click", () => showTab("status", { openClientWindow: true }));
  });
  els.clientWindowBody.querySelectorAll("[data-client-open-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedClientItemId = Number(btn.dataset.clientOpenItem);
      showTab("items", { openClientWindow: true });
    });
  });
  els.clientWindowBody.querySelectorAll("[data-player-stat-up]").forEach((btn) => {
    btn.addEventListener("click", () => allocatePlayerPoint(btn.dataset.playerStatUp));
  });
}

function renderPets() {
  const slots = petState();
  const pets = game.pets.map((pet, index) => `
    <article class="pet-card ${index === activePetIndex() ? "active" : ""}">
      ${petSpriteMarkup(pet.ImgNo, pet.Name, "pet-card-sprite")}
      <div>
        <h3>${escapeHtml(pet.Name)} Lv.${pet.Lv}</h3>
        <p class="muted">${index === activePetIndex() ? "出战" : "待命"} | No.${pet.PetId} | HP ${Number(pet.Hp || 0)}/${pet.WorkMaxHp} | ${escapeHtml(expLabel(progressionForPet(index, pet)))}</p>
        <p>${escapeHtml(petGrowthLabel(characterPetField(index), pet))}</p>
        <p class="muted">${escapeHtml(petCounterLabel(characterPetField(index), pet))} | ${escapeHtml(elementText(pet))}</p>
      </div>
      <div class="pet-card-actions">
        <button type="button" data-active-pet="${index}" ${index === activePetIndex() ? "disabled" : ""}>出战</button>
        <button type="button" data-release-pet="${index}" ${game.pets.length <= 1 ? "disabled" : ""}>放生</button>
      </div>
    </article>
  `).join("");
  const inventory = (game.inventory || []).filter((item) => item.id !== "stone");
  const state = inventoryState();
  els.petList.innerHTML = `
    <article class="inventory-box">
      <div class="inventory-head">
        <h3>PET STATUS</h3>
        <span>${Number(slots.used || game.pets.length)}/${Number(slots.capacity || PET_CAPACITY_FALLBACK)}</span>
      </div>
      <p class="muted">出战 ${escapeHtml(slots.activeName || "无")} | 来源 ${escapeHtml(slots.source || "gmsv CHAR_MAXPETHAVE")}</p>
    </article>
  ` + pets + `
    <article class="inventory-box">
      <div class="inventory-head">
        <h3>背包</h3>
        <span>${state.used}/${state.capacity}</span>
      </div>
      ${inventory.map((item) => {
        const gear = inventoryItemGear(item);
        const usable = inventoryItemUsable(item);
        return `
          <div class="inventory-item">
            <span>
              <strong>${escapeHtml(item.name)}</strong>
              <small>x${Number(item.qty || 0)} | type ${escapeHtml(String(item.type ?? ""))} | ${escapeHtml(item.description || item.source || "")}</small>
            </span>
            <span class="inventory-item-actions">
              ${gear
                ? `<button type="button" data-equip-item="${item.id}">装备</button>`
                : `<button type="button" data-use-item="${item.id}" ${usable ? "" : "disabled"}>使用</button>`}
              <button type="button" data-drop-item="${item.id}">丢弃</button>
            </span>
          </div>
        `;
      }).join("") || `<p class="empty">背包还没有道具。</p>`}
    </article>
  `;
  hydrateAtlasSprites(loadedTileAtlas, els.petList);
  els.petList.querySelectorAll("[data-active-pet]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/pet-mode", { petIndex: Number(btn.dataset.activePet), mode: "active" }));
  });
  els.petList.querySelectorAll("[data-release-pet]").forEach((btn) => {
    btn.addEventListener("click", () => releasePet(Number(btn.dataset.releasePet)));
  });
  els.petList.querySelectorAll("[data-use-item]").forEach((btn) => {
    btn.addEventListener("click", () => useItem(Number(btn.dataset.useItem)));
  });
  els.petList.querySelectorAll("[data-equip-item]").forEach((btn) => {
    btn.addEventListener("click", () => equipItem(Number(btn.dataset.equipItem)));
  });
  els.petList.querySelectorAll("[data-drop-item]").forEach((btn) => {
    btn.addEventListener("click", () => dropItem(Number(btn.dataset.dropItem)));
  });
}

function inventoryState() {
  const serverState = game?.inventoryState || game?.save?.json?.inventoryState;
  if (serverState?.capacity) return serverState;
  const used = (game?.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0).length;
  return { used, capacity: 15, remaining: Math.max(0, 15 - used) };
}

function petState() {
  const serverState = game?.petState || game?.save?.json?.petState;
  if (serverState?.capacity) return serverState;
  const used = (game?.pets || []).length;
  return { used, capacity: PET_CAPACITY_FALLBACK, remaining: Math.max(0, PET_CAPACITY_FALLBACK - used), activeIndex: used ? 0 : -1 };
}

function petUsed() {
  return Number(petState().used || (game?.pets || []).length || 0);
}

function petCapacity() {
  return Math.max(1, Number(petState().capacity || PET_CAPACITY_FALLBACK));
}

function activePetIndex() {
  const index = Number(petState().activeIndex ?? 0);
  return Number.isFinite(index) ? Math.max(-1, Math.trunc(index)) : -1;
}

function getActivePet() {
  const index = activePetIndex();
  return index >= 0 ? game?.pets?.[index] || null : null;
}

function syncSelectedClientItem() {
  const inventory = (game?.inventory || []).filter((item) => item.id !== "stone" && Number(item.qty || 0) > 0);
  if (!inventory.length) {
    selectedClientItemId = null;
    return null;
  }
  const selected = inventory.find((item) => Number(item.id) === Number(selectedClientItemId));
  if (selected) return selected;
  selectedClientItemId = inventory[0].id;
  return inventory[0];
}

function selectedClientInventoryItem(inventory) {
  if (!inventory.length) {
    selectedClientItemId = null;
    return null;
  }
  const selected = inventory.find((item) => Number(item.id) === Number(selectedClientItemId));
  if (selected) return selected;
  selectedClientItemId = inventory[0].id;
  return inventory[0];
}

function inventoryItemGear(item) {
  const text = `${item.name || ""} ${item.description || ""} ${item.category || ""} ${item.option || ""} ${item.functionName || ""}`;
  return /ITEM_suitEquip|ITEM_ResuitEquip|武器|防具|装备|裝備|斧|枪|槍|弓|投石|爪|兜|帽|服|铠|鎧|甲|盾|刀|剑|劍|棒|棍|鞋|靴|项链|項鏈|戒指|护身符|護身符/i.test(text);
}

function inventoryItemEquipmentSlot(item) {
  const text = `${item.name || ""} ${item.description || ""} ${item.category || ""} ${item.option || ""}`.toLowerCase();
  if (/兜|帽|头|頭|helmet|helm/.test(text)) return "头";
  if (/盾|shield/.test(text)) return "盾";
  if (/衣|服|铠|鎧|甲|armor|防具/.test(text)) return "身";
  if (/鞋|靴|足|boot/.test(text)) return "足";
  if (/项链|項鏈|戒指|饰|飾|护身符|護身符|amulet|ring/.test(text)) return "饰";
  return "武器";
}

function inventoryItemUsable(item) {
  const text = `${item.name || ""} ${item.description || ""} ${item.option || ""} ${item.functionName || ""}`;
  if (inventoryItemGear(item)) return false;
  const rawType = item.type ?? item.Type;
  const hasNumericType = rawType !== undefined && rawType !== null && rawType !== "" && Number.isFinite(Number(rawType));
  if (hasNumericType && ![15, 16, 20].includes(Number(rawType)) && !/^ITEM_/i.test(String(item.functionName || ""))) return false;
  return /ITEM_useRecovery|ITEM_useStatusRecovery|ITEM_useStatusChange|ITEM_useRessurect|ITEM_ResAndDef|ITEM_useWarp|ITEM_useWarpForNum|ITEM_useDeathcounter|ITEM_useEncounter|ITEM_useNoenemy|ITEM_useCaptureUp|ITEM_useSkillCanned|ITEM_Addexp|ITEM_ChikulaStone|ITEM_Gold|ITEM_metamo|ITEM_MetamoTime|耐久力|耐力|HP|体\s*\d+|耐\s*\d+|气力|氣力|气\s*\d+|氣\s*\d+|小的肉|乾燥肉|大的肉|高级肉|复活|復活|气绝|氣絕|解除|治疗|治療|状态回复|狀態回復|净化|淨化|魅\+|忠\s*[+-]?\d|忠诚度|羽毛|飞行|飛行|瞬间|瞬間|恶魔宝石|惡魔寶石|原地遇敌|遇敌|驱散敌人|避敌|经验值上升|增\s*\d+\s*分\s*\d+|自动回复|奇克拉|变身|變身|石币券|石幣券|石币|石幣|宠技罐头|寵技罐頭|捕获率|捕獲率|捕捉率|状态变化|狀態變化/i.test(text);
}

function battleUsableItems() {
  return (game?.inventory || []).filter((item) => (
    item.id !== "stone"
    && Number(item.qty || 0) > 0
    && inventoryItemUsable(item)
  ));
}

function battleUsableSkills(activePet = getActivePet()) {
  return (activePet?.PetSkills || [])
    .map((skill, slot) => (skill ? { ...skill, slot } : { slot }))
    .filter((skill) => Number(skill.Id || 0) > 0 && battleSkillSupported(skill))
    .slice(0, 7)
    .map((skill) => ({
      id: Number(skill.Id || 0),
      slot: Number(skill.slot || 0),
      name: skill.Name || `技能 ${skill.Id}`,
      description: skill.Des || "",
      func: skill.FuncName || "",
      option: skill.Option || "",
      target: Number(skill.Target || 0),
      command: `W|${Number(skill.slot || 0).toString(16).toUpperCase()}|${Number(game?.battle?.activeEnemyIndex || 0).toString(16).toUpperCase()}`
    }));
}

function battleSkillSupported(skill = {}) {
  return [
    "PETSKILL_NormalAttack",
    "PETSKILL_NormalGuard",
    "PETSKILL_GuardBreak",
    "PETSKILL_GuardBreak2",
    "PETSKILL_ContinuationAttack",
    "PETSKILL_Mighty",
    "PETSKILL_StatusChange",
    "PETSKILL_MagicStatusChange"
  ].includes(skill.FuncName || "");
}

function skillHint(skill = {}) {
  return [skill.description, skill.option, skill.func].filter(Boolean).join(" | ") || skill.command || "";
}

function battleHasRecoverableTarget() {
  const pet = getActivePet();
  if (pet && Number(pet.Hp || 0) < Number(pet.WorkMaxHp || pet.Hp || 1)) return true;
  return Number(game?.player?.hp || 0) < Number(game?.player?.maxHp || 1);
}

function renderQuests() {
  const quests = Object.values(game.quests || {});
  const sourceTasks = game.progression?.sourceTasks || [];
  const questHtml = quests.map((quest) => `
    <article class="result-item quest-card">
      <div><strong>${escapeHtml(quest.title)}</strong><span>${escapeHtml(quest.status)}</span></div>
      <p>${escapeHtml(quest.description)}</p>
      <div class="quest-progress" aria-label="任务进度">
        ${(quest.steps || []).map((step, index) => `
          <span class="${index < Number(quest.progress || 0) ? "done" : index === Number(quest.progress || 0) && quest.status !== "完成" ? "current" : ""}" title="${escapeHtml(step)}"></span>
        `).join("")}
      </div>
      <p class="muted">下一步：${escapeHtml(nextQuestStep(quest))}</p>
      ${renderGuidanceList(questGuidanceLines(quest), 5)}
      <p class="muted">奖励：${escapeHtml(quest.reward)} | 来源：${escapeHtml(quest.source)}</p>
    </article>
  `).join("");
  const sourceTaskHtml = sourceTasks.map((task) => `
      <article class="result-item quest-card">
        <div><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(task.status)}</span></div>
        <p>${escapeHtml(task.next || "继续推进原脚本事件。")}</p>
        ${renderGuidanceList(taskGuidanceLines(task), 5)}
        ${task.requiredItems?.length ? `<p class="muted">道具：${escapeHtml(task.requiredItems.map((item) => `${item.name} ${Number(item.have || 0)}/${Number(item.qty || 1)}`).join("、"))}</p>` : ""}
        ${task.rewardItems?.length ? `<p class="muted">可能奖励：${escapeHtml(task.rewardItems.map((item) => `${item.name} x${Number(item.qty || 1)}`).join("、"))}</p>` : ""}
        <p class="muted">来源：${escapeHtml(task.source || "gmsv-data changeevent")} | EventNo ${Number(task.eventNo || 0)}</p>
      </article>
    `).join("");
  const starterHtml = renderQuestStarterCards(game.world?.map);
  els.questList.innerHTML = questHtml || sourceTaskHtml
    ? `${questHtml}${sourceTaskHtml}`
    : starterHtml || `<p class="empty">还没有接任务。先查看本地图 NPC 与出口，去村镇、庄园或洞窟入口找有线索的 NPC。</p>`;
}

function renderQuestStarterCards(map) {
  if (!map) return "";
  const questNpcs = (map.npcs || [])
    .filter((npc) => {
      const tags = npcTags(npc);
      return tags.some((tag) => ["线索", "任务", "可触发", "脚本条件", "战斗"].includes(tag))
        || (npc.actions || []).some((action) => ["quest", "window", "startBattle"].includes(action));
    })
    .slice()
    .sort((a, b) => pointDistance(a.x, a.y) - pointDistance(b.x, b.y))
    .slice(0, 6);
  const exits = (map.exits || [])
    .slice()
    .sort((a, b) => distanceToExitClient(a) - distanceToExitClient(b))
    .slice(0, 4);
  if (!questNpcs.length && !exits.length) return "";
  return `
    <article class="result-item quest-card">
      <div><strong>当前地图线索</strong><span>${escapeHtml(map.name || "地图")} floor ${escapeHtml(String(map.floorId || game.location.mapId))}</span></div>
      <p>还没有正式接到任务。先按距离找原脚本 NPC 询问；地图传送点不是 NPC，走到出口格会自动触发。</p>
      ${questNpcs.length ? `
        <ul class="quest-guidance">
          ${questNpcs.map((npc) => `
            <li>找 ${escapeHtml(npc.name)} (${Number(npc.x || 0)},${Number(npc.y || 0)})，距离 ${escapeHtml(formatCellDistance(npc.x, npc.y))}。${escapeHtml(npc.questLead?.summary || scriptLeadText(npc) || npcTags(npc).join("、") || "双击/hi 询问。")}</li>
          `).join("")}
        </ul>
      ` : ""}
      ${exits.length ? `<p class="muted">附近出口：${escapeHtml(exits.map((exit) => `${exit.label}->${exit.toName || exit.to || ""} ${formatExitDistance(exit)}`).join("；"))}</p>` : ""}
    </article>
  `;
}

function questGuidanceLines(quest) {
  const lines = Array.isArray(quest?.guidance) ? quest.guidance : [];
  const fallback = nextQuestStep(quest);
  return compactDisplayLines(lines.length ? lines : [fallback]);
}

function taskGuidanceLines(task) {
  const lines = Array.isArray(task?.guidance) ? task.guidance : [];
  return compactDisplayLines(lines.length ? lines : [task?.next || "继续推进原脚本事件。"]);
}

function compactDisplayLines(lines) {
  const seen = new Set();
  return (lines || [])
    .map((line) => String(line || "").trim())
    .filter((line) => {
      if (!line || seen.has(line)) return false;
      seen.add(line);
      return true;
    });
}

function renderGuidanceList(lines, limit = 4) {
  const items = compactDisplayLines(lines).slice(0, limit);
  if (!items.length) return "";
  return `
    <ul class="quest-guidance">
      ${items.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
    </ul>
  `;
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
  if (!els.dataQuery || !els.dataResults) return;
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

async function searchAssistData() {
  const input = document.getElementById("assistDataQuery");
  const results = document.getElementById("assistDataResults");
  if (!input || !results) return;
  const q = input.value.trim();
  if (els.dataQuery) els.dataQuery.value = q;
  if (q.length < 2) {
    results.innerHTML = `<p class="empty">至少输入两个字。</p>`;
    return;
  }
  results.innerHTML = `<p class="empty">搜索中...</p>`;
  const data = await api("/api/data/search", { q });
  const html = data.results.length
    ? data.results.map((row) => `
      <article class="result-item">
        <div><strong>${escapeHtml(row.source)}</strong><span>${escapeHtml(row.file)}:${row.line}</span></div>
        <p>${highlight(escapeHtml(row.text), q)}</p>
      </article>
    `).join("")
    : `<p class="empty">没有找到相关资料。</p>`;
  results.innerHTML = html;
  if (els.dataResults) els.dataResults.innerHTML = html;
}

async function askGuide() {
  if (!game) return;
  const beforeMap = game.location?.mapId;
  els.aiResult.textContent = "向导思考中...";
  renderClientWindow();
  const data = await api("/api/ai/guide", { game, prompt: els.aiPrompt.value });
  if (data.provider || data.model) {
    aiRuntime = {
      ...aiRuntime,
      provider: data.provider || aiRuntime.provider,
      model: data.model || aiRuntime.model
    };
  }
  if (data.game) {
    game = data.game;
    if (beforeMap !== game.location?.mapId) mapView.centerOnNextRender = true;
    save();
  }
  if (data.action?.type === "auto-level" && data.action.enabled) {
    setAutomationMode("level", true, { silent: true });
  }
  els.aiResult.textContent = data.text || "向导暂时没有建议。";
  render();
}

async function loadAiRuntimeStatus() {
  try {
    const rsp = await fetch("/api/ai/status");
    if (!rsp.ok) return;
    aiRuntime = await rsp.json();
    renderAiStatusPanel();
    renderClientWindow();
  } catch (_error) {
    aiRuntime = { provider: "unknown", model: "", actionAuthority: "worker-npc-vm", structured: false, fallback: "" };
  }
}

function showTab(name, options = {}) {
  activeTab = name || activeTab;
  if (options.openClientWindow) clientWindowOpen = true;
  const rightPanelTab = ["ai", "quests", "log", "save"].includes(activeTab) ? activeTab : "ai";
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === rightPanelTab);
  });
  document.querySelectorAll("[data-command-tab]").forEach((btn) => {
    const active = btn.dataset.commandTab === activeTab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  refreshAtlasButtonSprites();
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${rightPanelTab}Tab`);
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
  if (nearby.closedExits?.length) parts.push(`未开放入口 ${nearby.closedExits.map((exit) => exit.label).join("、")}`);
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

function progressionForPlayer() {
  return game?.progression?.player || {
    exp: Number(game?.player?.exp || 0),
    nextExp: Number(game?.player?.nextExp ?? -1),
    expToNext: Number(game?.player?.expToNext || 0),
    progressPct: Number(game?.player?.expProgressPct || 0)
  };
}

function progressionForPet(index, pet = null) {
  return game?.progression?.pets?.[index] || {
    exp: Number(pet?.Exp || 0),
    nextExp: Number(pet?.NextExp ?? -1),
    expToNext: Number(pet?.ExpToNext || 0),
    progressPct: Number(pet?.ExpProgressPct || 0)
  };
}

function characterPetField(index) {
  return game?.characterFields?.pets?.[index] || game?.save?.json?.characterFields?.pets?.[index] || null;
}

function petGrowthLabel(fieldPet = null, pet = {}) {
  const growth = fieldPet?.growth || {};
  const total = growth.total ?? pet.Growth;
  const hp = growth.hp ?? pet.GrowthHp;
  const str = growth.str ?? pet.GrowthStr;
  const tough = growth.tough ?? pet.GrowthTough;
  const dex = growth.dex ?? pet.GrowthDex;
  return `成长 ${fmt(total)} | 血 ${fmt(hp)} 腕 ${fmt(str)} 耐 ${fmt(tough)} 速 ${fmt(dex)}`;
}

function petCounterLabel(fieldPet = null, pet = {}) {
  const counters = fieldPet?.counters || {};
  const battles = counters.battleCount ?? pet.BattleCount;
  const wins = counters.winCount ?? pet.WinCount;
  const defeats = counters.loseCount ?? pet.LoseCount;
  const kills = counters.killPetCount ?? pet.KillPetCount;
  return `战 ${Number(battles || 0)} 胜 ${Number(wins || 0)} 败 ${Number(defeats || 0)} 击 ${Number(kills || 0)}`;
}

function expLabel(progress) {
  if (!progress) return "EXP 0";
  if (Number(progress.nextExp) < 0) return `EXP ${Number(progress.exp || 0)} | MAX`;
  return `EXP ${Number(progress.exp || 0)} | NEXT ${Number(progress.expToNext || 0)}`;
}

function byId(id) {
  return document.getElementById(id);
}
