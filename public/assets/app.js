const SAVE_KEY = "sa-pet-sim-game-v1";

let game = null;
let installPrompt = null;

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
  npcList: byId("npcList"),
  exitList: byId("exitList"),
  encounterPanel: byId("encounterPanel"),
  encounterName: byId("encounterName"),
  encounterStats: byId("encounterStats"),
  encounterImg: byId("encounterImg"),
  encounterBtn: byId("encounterBtn"),
  captureBtn: byId("captureBtn"),
  skipEncounterBtn: byId("skipEncounterBtn"),
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
    render();
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
  els.dataSearchBtn.addEventListener("click", searchData);
  els.dataQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchData();
  });
  els.aiBtn.addEventListener("click", askGuide);
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
  els.mapSummary.textContent = `${map.summary}  来源：mapwarp.txt / encount.txt / npc scripts`;
  renderMap(map);
  renderNpc(map);
  renderExits(map);
  renderEncounter();
  renderPets();
  renderQuests();
  renderLog();
  els.saveState.textContent = "已存档";
}

function renderMap(map) {
  const [w, h] = map.size;
  els.mapCanvas.style.setProperty("--cols", w);
  els.mapCanvas.style.setProperty("--rows", h);
  const markers = [
    `<button class="tile player" style="${pos(game.location.x, game.location.y, w, h)}" title="${escapeHtml(game.player.name)}">人</button>`,
    ...map.npcs.map((npc) => `<button class="tile npc" style="${pos(npc.x, npc.y, w, h)}" data-npc="${npc.id}" title="${escapeHtml(npc.name)}">${escapeHtml(npc.name.slice(0, 1))}</button>`),
    ...map.exits.map((exit) => `<button class="tile exit" style="${pos(exit.x, exit.y, w, h)}" data-exit="${exit.to}" title="${escapeHtml(exit.label)}">出</button>`)
  ];
  els.mapCanvas.innerHTML = markers.join("");
  els.mapCanvas.querySelectorAll("[data-npc]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/talk", { npcId: btn.dataset.npc }));
  });
  els.mapCanvas.querySelectorAll("[data-exit]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/travel", { to: btn.dataset.exit }));
  });
}

function renderNpc(map) {
  els.npcList.innerHTML = map.npcs.map((npc) => `
    <button class="list-btn" type="button" data-npc="${npc.id}">
      <strong>${escapeHtml(npc.name)}</strong>
      <span>${escapeHtml(npc.type)} | (${npc.x}, ${npc.y})</span>
    </button>
  `).join("") || `<p class="empty">当前地图没有 NPC。</p>`;
  els.npcList.querySelectorAll("[data-npc]").forEach((btn) => {
    btn.addEventListener("click", () => mutate("/api/game/talk", { npcId: btn.dataset.npc }));
  });
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
      <img src="/f/pet/${pet.ImgNo}.gif" alt="">
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

function pos(x, y, w, h) {
  return `left:${(x / Math.max(1, w - 1)) * 100}%;top:${(y / Math.max(1, h - 1)) * 100}%`;
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
