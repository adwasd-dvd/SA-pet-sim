let pet = null;
let installPrompt = null;

const els = {
  netState: byId("netState"),
  installBtn: byId("installBtn"),
  petName: byId("petName"),
  petNo: byId("petNo"),
  petImg: byId("petImg"),
  attrs: byId("attrs"),
  statsBody: byId("statsBody"),
  skillsBody: byId("skillsBody"),
  randomBtn: byId("randomBtn"),
  sameBtn: byId("sameBtn"),
  shareBtn: byId("shareBtn"),
  lv1Btn: byId("lv1Btn"),
  lv10Btn: byId("lv10Btn"),
  lvMaxBtn: byId("lvMaxBtn"),
  dataQuery: byId("dataQuery"),
  dataSearchBtn: byId("dataSearchBtn"),
  dataResults: byId("dataResults"),
  aiPrompt: byId("aiPrompt"),
  aiBtn: byId("aiBtn"),
  aiResult: byId("aiResult")
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
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
  const parsedUrl = new URL(window.location.href);
  getPet(Number(parsedUrl.searchParams.get("no")) || 0);
}

function bindEvents() {
  els.randomBtn.addEventListener("click", () => getPet(0));
  els.sameBtn.addEventListener("click", () => getPet(pet?.PetId || 0));
  els.lv1Btn.addEventListener("click", () => levelUp(1));
  els.lv10Btn.addEventListener("click", () => levelUp(10));
  els.lvMaxBtn.addEventListener("click", () => levelUp(140));
  els.shareBtn.addEventListener("click", sharePet);
  els.dataSearchBtn.addEventListener("click", searchData);
  els.dataQuery.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchData();
  });
  els.aiBtn.addEventListener("click", analyzePet);
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
  els.petImg.addEventListener("error", () => {
    els.petImg.src = "/f/logo.gif";
  });
}

async function getPet(no) {
  setBusy(true);
  pet = await api("/api/getpet", { no });
  renderPet();
  history.replaceState(null, "", `?no=${pet.PetId}`);
  setBusy(false);
}

async function levelUp(up) {
  if (!pet) return;
  const target = up === 140 ? Math.max(1, 140 - pet.Lv) : up;
  pet = await api("/api/levelup", { pet, up: target });
  renderPet();
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

async function analyzePet() {
  if (!pet) return;
  els.aiResult.textContent = "分析中...";
  const data = await api("/api/ai/analyze", { pet, prompt: els.aiPrompt.value });
  els.aiResult.textContent = data.text || "没有返回分析。";
}

function renderPet() {
  if (!pet) return;
  els.petName.textContent = pet.Name;
  els.petNo.textContent = `No. ${pet.PetId}-${pet.Id}`;
  els.petImg.src = `/f/pet/${pet.ImgNo}.gif`;
  els.attrs.innerHTML = [
    ["地", pet.EarthAT, "earth"],
    ["水", pet.WaterAT, "water"],
    ["火", pet.FireAT, "fire"],
    ["风", pet.WindAT, "wind"]
  ].filter(([, value]) => value > 0).map(([name, value, type]) => `
    <div class="attr ${type}">
      <span>${name}</span>
      <meter min="0" max="100" value="${value}"></meter>
      <b>${value}</b>
    </div>
  `).join("") || `<div class="attr neutral"><span>无</span><meter min="0" max="100" value="0"></meter><b>0</b></div>`;
  renderStats();
  renderSkills();
}

function renderStats() {
  const rows = [
    ["等级", pet.BornLv, pet.Lv, ""],
    ["耐久力", pet.BornPoint[0], pet.WorkMaxHp, pet.GrowthHp],
    ["攻击力", pet.BornPoint[1], pet.WorkFixStr, pet.GrowthStr],
    ["防御力", pet.BornPoint[2], pet.WorkFixTough, pet.GrowthTough],
    ["敏捷力", pet.BornPoint[3], pet.WorkFixDex, pet.GrowthDex],
    ["总成长", "", "", pet.Growth]
  ];
  els.statsBody.innerHTML = rows.map(([name, born, current, growth]) => `
    <tr>
      <td>${name}</td>
      <td>${born}</td>
      <td>${current}</td>
      <td>${growth === "" ? "" : `<strong>${fmt(growth)}</strong>`}</td>
    </tr>
  `).join("");
  els.lv1Btn.disabled = pet.Lv >= 140;
  els.lv10Btn.disabled = pet.Lv >= 140;
  els.lvMaxBtn.disabled = pet.Lv >= 140;
}

function renderSkills() {
  const skills = pet.PetSkills || [];
  els.skillsBody.innerHTML = Array.from({ length: pet.Slot || 0 }, (_, index) => {
    const skill = skills[index];
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${skill ? escapeHtml(skill.Name) : ""}</td>
        <td>${skill ? escapeHtml(skill.Des) : ""}</td>
      </tr>
    `;
  }).join("");
}

function showTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${name}Tab`);
  });
}

async function sharePet() {
  if (!pet) return;
  const text = `${pet.Name} Lv.${pet.Lv} 总成长 ${fmt(pet.Growth)} ${location.href}`;
  if (navigator.share) {
    await navigator.share({ title: "石器时代宠物模拟器", text, url: location.href });
    return;
  }
  await navigator.clipboard?.writeText(text);
  els.shareBtn.textContent = "已复制";
  setTimeout(() => { els.shareBtn.textContent = "分享"; }, 1200);
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

function setBusy(busy) {
  els.randomBtn.disabled = busy;
  els.sameBtn.disabled = busy;
}

function updateNetState() {
  els.netState.textContent = navigator.onLine ? "在线" : "离线";
  els.netState.classList.toggle("offline", !navigator.onLine);
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
  return Number.isFinite(n) ? n.toFixed(2) : "";
}

function byId(id) {
  return document.getElementById(id);
}
