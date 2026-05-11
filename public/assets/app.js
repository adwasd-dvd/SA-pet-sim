const SAVE_KEY = "sa-pet-sim-game-v1";
const MAP_ZOOM_MIN = 0.5;
const MAP_ZOOM_MAX = 3;
const MAP_ZOOM_STEP = 0.25;

let game = null;
let installPrompt = null;
let mapZoom = 1;

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
    showGame();
    syncGame();
  }
}

function bindEvents() {
  els.createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    game = await api("/api/game/new", { name: els.playerName.value });
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
  els.mapZoomOut.addEventListener("click", () => setMapZoom(mapZoom - MAP_ZOOM_STEP));
  els.mapZoomIn.addEventListener("click", () => setMapZoom(mapZoom + MAP_ZOOM_STEP));
  els.mapZoomReset.addEventListener("click", () => setMapZoom(1));
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
  els.mapSummary.textContent = `${map.summary} | 来源：ref___data/map + mapwarp.txt + encount.txt + npc scripts`;
  renderMap(map);
  renderNpc(map);
  renderExits(map);
  renderDialog();
  renderEncounter();
  renderPets();
  renderQuests();
  renderLog();
  els.saveState.textContent = "已存档";
}

function renderMap(map) {
  const layout = mapLayout(map);
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
      return `<button class="map-marker exit" style="${mapPos(point)}" data-exit="${exit.to}" title="${escapeHtml(exit.label)}"><b>出</b><span>${escapeHtml(exit.label)}</span></button>`;
    })
  ];
  els.mapCanvas.innerHTML = `<div class="map-content">${markers.join("")}</div>`;
  applyMapZoom();
  renderLs2Map(map).catch(() => {
    els.mapCanvas.classList.add("map-fallback");
  });
  els.mapCanvas.querySelectorAll("[data-npc]").forEach((btn) => {
    btn.addEventListener("click", () => openDialog(btn.dataset.npc));
  });
  els.mapCanvas.querySelectorAll("[data-exit]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/travel", { to: btn.dataset.exit }));
  });
}

function setMapZoom(value) {
  mapZoom = Math.max(MAP_ZOOM_MIN, Math.min(MAP_ZOOM_MAX, value));
  applyMapZoom();
}

function applyMapZoom() {
  const content = els.mapCanvas.querySelector(".map-content");
  if (content) {
    content.style.width = `${Math.round(mapZoom * 100)}%`;
    content.style.height = `${Math.round(340 * mapZoom)}px`;
  }
  els.mapZoomValue.textContent = `${Math.round(mapZoom * 100)}%`;
  els.mapZoomOut.disabled = mapZoom <= MAP_ZOOM_MIN;
  els.mapZoomIn.disabled = mapZoom >= MAP_ZOOM_MAX;
}

async function renderLs2Map(map) {
  if (!map.mapFile) return;
  const canvas = els.mapCanvas.querySelector(".ls2-map");
  if (!canvas) return;
  const rsp = await fetch(map.mapFile);
  if (!rsp.ok) throw new Error("map file missing");
  const buf = await rsp.arrayBuffer();
  const view = new DataView(buf);
  const magic = String.fromCharCode(...new Uint8Array(buf.slice(0, 6)));
  if (magic !== "LS2MAP") throw new Error("invalid LS2MAP");
  const width = view.getUint16(0x28, false);
  const height = view.getUint16(0x2a, false);
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
      const tileOffset = 44 + index * 2;
      const objectOffset = 44 + width * height * 2 + index * 2;
      const ground = view.getUint16(tileOffset, false);
      const object = objectOffset + 1 < view.byteLength ? view.getUint16(objectOffset, false) : 0;
      const color = tileColor(ground, object);
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

function tileColor(ground, object) {
  if (ground === 0 && object === 0) return [60, 91, 82];
  if (object > 0 && object < 1000) return [66, 83, 77];
  const seed = (ground || object) >>> 0;
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
      <span>${escapeHtml(npc.type)} | (${npc.x}, ${npc.y})</span>
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
  els.dialogSuggestions.innerHTML = (dialog.suggestions || ["任务", "地图", "抓宠"]).map((item) => `
    <button class="ghost-btn" type="button" data-say="${escapeHtml(item)}">${escapeHtml(item)}</button>
  `).join("");
  els.dialogSuggestions.querySelectorAll("[data-say]").forEach((btn) => {
    btn.addEventListener("click", () => sendDialog(btn.dataset.say));
  });
  els.dialogMessages.scrollTop = els.dialogMessages.scrollHeight;
}

function dialogSpeaker(speaker, dialog) {
  if (speaker === "player") return game.player.name;
  if (speaker === "system") return "系统";
  return dialog.npcName || "NPC";
}

function renderExits(map) {
  els.exitList.innerHTML = map.exits.map((exit) => `
    <button class="list-btn" type="button" data-exit="${exit.to}">
      <strong>${escapeHtml(exit.label)}</strong>
      <span>${escapeHtml(exit.source)} | (${exit.x}, ${exit.y})</span>
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
  els.petList.innerHTML = game.pets.map((pet, index) => `
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
