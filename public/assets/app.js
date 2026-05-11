const SAVE_KEY = "sa-pet-sim-game-v1";
const MAP_ZOOM_MIN = 0.5;
const MAP_ZOOM_MAX = 8;
const MAP_ZOOM_STEP = 0.5;
const MAP_DEFAULT_ZOOM = 4.5;
const TILE_ATLAS_MANIFEST = "/data/client-tiles/tiles.json";

let game = null;
let installPrompt = null;
let walkInFlight = false;
let tileAtlasPromise = null;
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
  npcList: byId("npcList"),
  exitList: byId("exitList"),
  encounterPanel: byId("encounterPanel"),
  encounterName: byId("encounterName"),
  encounterStats: byId("encounterStats"),
  encounterImg: byId("encounterImg"),
  encounterBtn: byId("encounterBtn"),
  captureBtn: byId("captureBtn"),
  skipEncounterBtn: byId("skipEncounterBtn"),
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
  guideBtn: byId("guideBtn"),
  newGameBtn: byId("newGameBtn"),
  installBtn: byId("installBtn"),
  netState: byId("netState"),
  saveState: byId("saveState")
};

init();

function init() {
  bindEvents();
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
  els.encounterBtn.addEventListener("click", () => mutate("/api/game/encounter", {}));
  els.captureBtn.addEventListener("click", () => mutate("/api/game/capture", {}));
  els.skipEncounterBtn.addEventListener("click", () => {
    if (!game) return;
    game.encounter = null;
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
  els.mapZoomOut.addEventListener("click", () => zoomMap(mapView.zoom - MAP_ZOOM_STEP));
  els.mapZoomIn.addEventListener("click", () => zoomMap(mapView.zoom + MAP_ZOOM_STEP));
  els.mapZoomReset.addEventListener("click", resetMapView);
  els.mapCanvas.addEventListener("pointerdown", onMapPointerDown);
  els.mapCanvas.addEventListener("pointermove", onMapPointerMove);
  els.mapCanvas.addEventListener("pointerup", onMapPointerUp);
  els.mapCanvas.addEventListener("pointercancel", onMapPointerUp);
  window.addEventListener("keydown", onGameKeyDown);
  els.guideBtn.addEventListener("click", () => {
    showTab("ai");
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
  const map = game.world.map;
  els.playerTitle.textContent = game.player.name;
  els.playerStats.textContent = `Lv.${game.player.level} | 经验 ${game.player.exp} | 石币 ${game.player.stone} | 宠物 ${game.pets.length}`;
  els.mapName.textContent = map.name;
  els.mapSummary.textContent = `${map.summary} | 位置 (${game.location.x},${game.location.y})${nearbyText()} | 来源：ref___data/map + mapwarp.txt + encount.txt + npc scripts`;
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
}

function renderMap(map) {
  const layout = mapLayout(map);
  if (mapView.mapId !== map.id) {
    mapView.mapId = map.id;
    mapView.centerOnNextRender = true;
  }
  const markers = [
    `<canvas class="ls2-map" aria-hidden="true"></canvas>`,
    `<div class="map-region village"><strong>${escapeHtml(layout.primary)}</strong><span>${escapeHtml(layout.primaryHint)}</span></div>`,
    `<div class="map-region wild"><strong>遇敌区</strong><span>数据来自 encount.txt</span></div>`,
    `<button class="map-marker player" style="${mapPos(layout.player)}" title="${escapeHtml(game.player.name)}"><b>你</b><span>${escapeHtml(game.player.name)}</span></button>`,
    ...map.npcs.map((npc, index) => {
      const point = layout.npcs[index] || [45, 50];
      return `<button class="map-marker npc" style="${mapPos(point)}" data-npc="${npc.id}" title="${escapeHtml(npc.name)}"><b>${escapeHtml(npc.name.slice(0, 1))}</b><span>${escapeHtml(npc.name)}</span></button>`;
    }),
    ...map.exits.map((exit, index) => {
      const point = layout.exits[index] || [86, 55];
      return `<button class="map-marker exit" style="${mapPos(point)}" data-exit="${exit.id}" title="${escapeHtml(exit.detail || exit.label)}"><b>出</b><span>${escapeHtml(exit.label)}</span></button>`;
    })
  ];
  els.mapCanvas.innerHTML = `<div class="map-content">${markers.join("")}</div>`;
  if (mapView.centerOnNextRender) {
    centerMapOnPoint(layout.player);
    mapView.centerOnNextRender = false;
  }
  clampMapPan();
  applyMapView();
  renderLs2Map(map).catch(() => {
    els.mapCanvas.classList.add("map-fallback");
  });
  els.mapCanvas.querySelectorAll("[data-npc]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!mapView.moved) openDialog(btn.dataset.npc);
    });
  });
  els.mapCanvas.querySelectorAll("[data-exit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!mapView.moved) mutate("/api/game/travel", { to: btn.dataset.exit });
    });
  });
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
  centerMapOnPoint(worldPoint(game.world.map, game.location?.x, game.location?.y));
}

function centerMapOnPoint(point) {
  const rect = els.mapCanvas.getBoundingClientRect();
  const baseW = rect.width || 1;
  const baseH = rect.height || 340;
  mapView.panX = baseW / 2 - (point[0] / 100) * baseW * mapView.zoom;
  mapView.panY = baseH / 2 - (point[1] / 100) * baseH * mapView.zoom;
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
}

function clampMapPan() {
  const rect = els.mapCanvas.getBoundingClientRect();
  const baseW = rect.width || 1;
  const baseH = rect.height || 340;
  const scaledW = baseW * mapView.zoom;
  const scaledH = baseH * mapView.zoom;
  mapView.panX = scaledW <= baseW
    ? (baseW - scaledW) / 2
    : Math.max(baseW - scaledW, Math.min(0, mapView.panX));
  mapView.panY = scaledH <= baseH
    ? (baseH - scaledH) / 2
    : Math.max(baseH - scaledH, Math.min(0, mapView.panY));
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
  const direction = {
    w: [0, -1],
    arrowup: [0, -1],
    s: [0, 1],
    arrowdown: [0, 1],
    a: [-1, 0],
    arrowleft: [-1, 0],
    d: [1, 0],
    arrowright: [1, 0]
  }[key];
  if (!direction) return;
  event.preventDefault();
  walkPlayer(direction[0], direction[1]);
}

async function walkPlayer(dx, dy) {
  if (walkInFlight) return;
  walkInFlight = true;
  try {
    game = await api("/api/game/walk", { game, dx, dy });
    mapView.centerOnNextRender = true;
    save();
    render();
  } finally {
    walkInFlight = false;
  }
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

async function renderLs2Map(map) {
  if (!map.clientMapFile && !map.mapFile) return;
  const canvas = els.mapCanvas.querySelector(".ls2-map");
  if (!canvas) return;
  const rsp = await fetch(map.clientMapFile || map.mapFile);
  if (!rsp.ok) throw new Error("map file missing");
  const buf = await rsp.arrayBuffer();
  if (map.clientMapFile) {
    await renderClientDatMap(canvas, buf);
    return;
  }
  renderLs2MapBuffer(canvas, buf);
}

async function renderClientDatMap(canvas, buf) {
  const view = new DataView(buf);
  const width = view.getUint32(0, true);
  const height = view.getUint32(4, true);
  const expected = 8 + width * height * 6;
  if (!width || !height || buf.byteLength < expected) throw new Error("invalid client map");
  const tileAt = (index) => {
    const offset = 8 + index * 6;
    return [
      view.getUint16(offset, true),
      view.getUint16(offset + 2, true),
      view.getUint16(offset + 4, true)
    ];
  };
  const atlas = await loadTileAtlas();
  if (atlas) {
    drawRealTileMap(canvas, width, height, tileAt, atlas);
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
      return { ...manifest, image };
    })().catch(() => null);
  }
  return tileAtlasPromise;
}

function drawRealTileMap(canvas, width, height, tileAt, atlas) {
  const max = Math.max(width, height);
  const tileW = max <= 180 ? atlas.tileWidth : max <= 420 ? Math.floor(atlas.tileWidth / 2) : Math.floor(atlas.tileWidth / 4);
  const tileH = max <= 180 ? atlas.tileHeight : max <= 420 ? Math.floor(atlas.tileHeight / 2) : Math.floor(atlas.tileHeight / 4);
  const halfW = tileW / 2;
  const halfH = tileH / 2;
  canvas.width = Math.ceil((width + height) * halfW + tileW);
  canvas.height = Math.ceil((width + height) * halfH + tileH);
  const originX = halfW;
  const originY = (width - 1) * halfH + halfH;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let diagonal = 0; diagonal <= width + height - 2; diagonal += 1) {
    const startX = Math.max(0, diagonal - (height - 1));
    const endX = Math.min(width - 1, diagonal);
    for (let x = startX; x <= endX; x += 1) {
      const y = diagonal - x;
      const [ground, object] = tileAt(y * width + x);
      const px = Math.round(originX + (x + y) * halfW);
      const py = Math.round(originY + (y - x) * halfH);
      drawAtlasTile(ctx, atlas, ground, px, py, tileW, tileH);
      drawAtlasTile(ctx, atlas, object, px, py, tileW, tileH);
    }
  }
  els.mapCanvas.dataset.mapSize = `${width} x ${height} | isometric client tiles`;
}

function drawAtlasTile(ctx, atlas, tileId, x, y, width, height) {
  const index = atlas.tiles?.[tileId];
  if (index === undefined) return;
  const sx = (index % atlas.columns) * atlas.tileWidth;
  const sy = Math.floor(index / atlas.columns) * atlas.tileHeight;
  ctx.drawImage(atlas.image, sx, sy, atlas.tileWidth, atlas.tileHeight, x, y, width, height);
}

function renderLs2MapBuffer(canvas, buf) {
  const view = new DataView(buf);
  const magic = String.fromCharCode(...new Uint8Array(buf.slice(0, 6)));
  if (magic !== "LS2MAP") throw new Error("invalid LS2MAP");
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
  drawTilePreview(canvas, width, height, (index) => {
    const tileOffset = 44 + index * 2;
    const objectOffset = 44 + width * height * 2 + index * 2;
    return [
      view.getUint16(tileOffset, false),
      objectOffset + 1 < view.byteLength ? view.getUint16(objectOffset, false) : 0,
      0
    ];
  });
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
      const color = tileColor(ground, object, overlay);
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
  const width = Math.max(1, Number(map.size?.[0]) || 1);
  const height = Math.max(1, Number(map.size?.[1]) || 1);
  return [
    Math.max(5, Math.min(95, (Number(x) || 0) / width * 100)),
    Math.max(8, Math.min(92, (Number(y) || 0) / height * 100))
  ];
}

function renderNpc(map) {
  els.npcList.innerHTML = map.npcs.map((npc) => `
    <button class="list-btn" type="button" data-npc="${npc.id}">
      <strong>${escapeHtml(npc.name)}</strong>
      <span>${escapeHtml(npc.type)}${npc.trade ? " | 可交易" : ""} | (${npc.x}, ${npc.y})</span>
    </button>
  `).join("") || `<p class="empty">当前地图没有 NPC。</p>`;
  els.npcList.querySelectorAll("[data-npc]").forEach((btn) => {
    btn.addEventListener("click", () => openDialog(btn.dataset.npc));
  });
}

async function openDialog(npcId) {
  if (!game) return;
  game = await api("/api/game/dialog", { game, npcId });
  save();
  render();
  els.dialogInput.focus();
}

async function sendDialog(message) {
  if (!game?.dialog?.npcId) return;
  const npcId = game.dialog.npcId;
  els.dialogInput.value = "";
  game = await api("/api/game/dialog", { game, npcId, message });
  save();
  render();
  els.dialogInput.focus();
}

function renderDialog() {
  const dialog = game?.dialog;
  els.dialogPanel.hidden = !dialog?.open;
  if (!dialog?.open) return;
  els.dialogNpcName.textContent = dialog.npcName || "NPC";
  els.dialogSource.textContent = dialog.source || "点击 NPC 后已自动打招呼，可继续追问";
  els.dialogMessages.innerHTML = (dialog.messages || []).map((message) => `
    <p class="dialog-bubble ${message.speaker === "player" ? "player" : message.speaker === "system" ? "system" : "npc"}">
      <span>${escapeHtml(dialogSpeaker(message.speaker, dialog))}</span>
      ${escapeHtml(message.text)}
    </p>
  `).join("");
  const shop = renderDialogShop(dialog);
  els.dialogSuggestions.innerHTML = (dialog.suggestions || ["任务", "地图", "抓宠"]).map((item) => `
    <button class="ghost-btn" type="button" data-say="${escapeHtml(item)}">${escapeHtml(item)}</button>
  `).join("") + shop;
  els.dialogSuggestions.querySelectorAll("[data-say]").forEach((btn) => {
    btn.addEventListener("click", () => sendDialog(btn.dataset.say));
  });
  els.dialogSuggestions.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => buyItem(Number(btn.dataset.buy)));
  });
  els.dialogMessages.scrollTop = els.dialogMessages.scrollHeight;
}

function renderDialogShop(dialog) {
  const items = dialog.trade?.items || [];
  if (!items.length) return "";
  return `
    <div class="shop-box">
      <div><strong>商品</strong><span>${escapeHtml(dialog.trade.source || "ref___data")}</span></div>
      ${items.slice(0, 8).map((item) => `
        <button class="shop-item" type="button" data-buy="${item.id}">
          <span>${escapeHtml(item.name)}</span>
          <b>${Number(item.price || 0)} 石币</b>
        </button>
      `).join("")}
    </div>
  `;
}

async function buyItem(itemId) {
  if (!game?.dialog?.npcId) return;
  game = await api("/api/game/buy", { game, npcId: game.dialog.npcId, itemId });
  save();
  render();
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
    btn.addEventListener("click", () => mutate("/api/game/travel", { to: btn.dataset.exit }));
  });
}

function renderEncounter() {
  const enemy = game.encounter;
  els.encounterPanel.hidden = !enemy;
  if (!enemy) return;
  els.encounterName.textContent = `${enemy.Name} Lv.${enemy.Lv}`;
  els.encounterStats.textContent = `捕获率 ${enemy.CaptureRate}% | HP ${enemy.WorkMaxHp} | 攻 ${enemy.WorkFixStr} | 防 ${enemy.WorkFixTough} | 敏 ${enemy.WorkFixDex}`;
  els.encounterImg.src = `/f/pet/${enemy.ImgNo}.gif`;
}

function renderPets() {
  const pets = game.pets.map((pet, index) => `
    <article class="pet-card">
      <img src="/f/pet/${pet.ImgNo}.gif" alt="" onerror="this.src='/f/logo.gif'">
      <div>
        <h3>${escapeHtml(pet.Name)} Lv.${pet.Lv}</h3>
        <p class="muted">No.${pet.PetId} | HP ${pet.WorkMaxHp} | 攻 ${pet.WorkFixStr} | 防 ${pet.WorkFixTough} | 敏 ${pet.WorkFixDex}</p>
        <p>总成长 <strong>${fmt(pet.Growth)}</strong></p>
      </div>
      <button type="button" data-train="${index}">训练</button>
    </article>
  `).join("");
  const inventory = (game.inventory || []).filter((item) => item.id !== "stone");
  els.petList.innerHTML = pets + `
    <article class="inventory-box">
      <h3>背包</h3>
      ${inventory.map((item) => `
        <div class="inventory-item">
          <strong>${escapeHtml(item.name)}</strong>
          <span>x${Number(item.qty || 0)} | type ${escapeHtml(String(item.type ?? ""))} | ${escapeHtml(item.description || item.source || "")}</span>
        </div>
      `).join("") || `<p class="empty">背包还没有道具。</p>`}
    </article>
  `;
  els.petList.querySelectorAll("[data-train]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/train", { petIndex: Number(btn.dataset.train) }));
  });
}

function renderQuests() {
  const quests = Object.values(game.quests || {});
  els.questList.innerHTML = quests.map((quest) => `
    <article class="result-item">
      <div><strong>${escapeHtml(quest.title)}</strong><span>${escapeHtml(quest.status)}</span></div>
      <p>${escapeHtml(quest.description)}</p>
      <p class="muted">下一步：${escapeHtml(quest.steps[Math.min(quest.progress || 0, quest.steps.length - 1)] || "完成")}</p>
      <p class="muted">奖励：${escapeHtml(quest.reward)} | 来源：${escapeHtml(quest.source)}</p>
    </article>
  `).join("") || `<p class="empty">还没有接任务，先和 NPC 聊聊。</p>`;
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
  const data = await api("/api/ai/guide", { game, prompt: els.aiPrompt.value });
  els.aiResult.textContent = data.text || "向导暂时没有建议。";
}

function showTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${name}Tab`);
  });
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
  `;
  els.saveText.value = save.serialized || "";
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

function updateNetState() {
  els.netState.textContent = navigator.onLine ? "在线" : "离线";
  els.netState.classList.toggle("offline", !navigator.onLine);
}

function mapPos(point) {
  return `left:${point[0]}%;top:${point[1]}%`;
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

function fmt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function byId(id) {
  return document.getElementById(id);
}
