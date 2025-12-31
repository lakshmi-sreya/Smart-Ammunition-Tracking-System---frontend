/* Smart Ammunition Tracking System
   - Handles login, storage, CRUD, transactions, audit log, analytics and theme
*/

/* ---------- Constants & Keys ---------- */
const LS_AMMO = "ammoRecords";
const LS_AUDIT = "auditLog";
const LS_FEEDBACK = "feedbackList";
const LS_THEME = "themePref";
const SESSION_USER = "sats_user";
const ALERT_THRESHOLD = 100;

/* ---------- DOM ---------- */
const loginPage = document.getElementById("loginPage");
const appRoot = document.getElementById("app");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const welcomeUser = document.getElementById("welcomeUser");
const lockedBy = document.getElementById("lockedBy");
const footerLockedBy = document.getElementById("footerLockedBy");
const totalAmmoEl = document.getElementById("totalAmmo");
const activeAlertsEl = document.getElementById("activeAlerts");
const recentTransactionsEl = document.getElementById("recentTransactions");
const navButtons = document.querySelectorAll(".navBtn");
const sections = document.querySelectorAll(".section");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggle = document.getElementById("themeToggle");

/* Ammo records elements */
const addAmmoForm = document.getElementById("addAmmoForm");
const newCategory = document.getElementById("newCategory");
const newWeapon = document.getElementById("newWeapon");
const newCaliber = document.getElementById("newCaliber");
const newQty = document.getElementById("newQty");
const newLocation = document.getElementById("newLocation");
const newInspection = document.getElementById("newInspection");
const ammoTableBody = document.querySelector("#ammoTable tbody");
const addAmmoMsg = document.getElementById("addAmmoMsg");
const resetFormBtn = document.getElementById("resetForm");

/* Transaction elements */
const transForm = document.getElementById("transactionForm");
const transAction = document.getElementById("transAction");
const transWeapon = document.getElementById("transWeapon");
const transQty = document.getElementById("transQty");
const transMsg = document.getElementById("transMsg");
const clearTrans = document.getElementById("clearTrans");

/* Audit */
const auditTableBody = document.querySelector("#auditTable tbody");

/* Analytics */
const chartCtx = document.getElementById("ammoChart").getContext("2d");
let ammoChart = null;

/* Feedback */
const feedbackText = document.getElementById("feedbackText");
const submitFeedback = document.getElementById("submitFeedback");
const clearFeedback = document.getElementById("clearFeedback");
const feedbackList = document.getElementById("feedbackList");

/* Data */
let ammoRecords = JSON.parse(localStorage.getItem(LS_AMMO)) || [];
let auditLog = JSON.parse(localStorage.getItem(LS_AUDIT)) || [];
let feedbacks = JSON.parse(localStorage.getItem(LS_FEEDBACK)) || [];

/* ---------- Utilities ---------- */
const nowStr = () => new Date().toLocaleString();
const saveAmmo = () => localStorage.setItem(LS_AMMO, JSON.stringify(ammoRecords));
const saveAudit = () => localStorage.setItem(LS_AUDIT, JSON.stringify(auditLog));
const saveFeedbacks = () => localStorage.setItem(LS_FEEDBACK, JSON.stringify(feedbacks));
const currentUser = () => sessionStorage.getItem(SESSION_USER) || "Unknown";

/* ---------- Login ---------- */
loginBtn.addEventListener("click", (e) => {
  const user = loginUsername.value.trim();
  const pass = loginPassword.value.trim();
  if (user === "admin" && pass === "1234") {
    sessionStorage.setItem(SESSION_USER, user);
    initApp();
  } else {
    loginError.style.display = "block";
    loginError.textContent = "Invalid credentials — try again.";
    loginPassword.value = "";
  }
});

/* Press Enter to login */
[loginUsername, loginPassword].forEach(inp =>
  inp.addEventListener("keyup", (e) => {
    if (e.key === "Enter") loginBtn.click();
  })
);

/* ---------- App Initialization ---------- */
function initApp(){
  // hide login, show app
  loginPage.style.display = "none";
  appRoot.style.display = "block";
  // set username displays
  const user = currentUser();
  welcomeUser.textContent = user;
  lockedBy.textContent = `Locked by ${user}`;
  footerLockedBy.textContent = `Locked by ${user}`;
  // load theme preference
  const theme = localStorage.getItem(LS_THEME) || "light";
  applyTheme(theme);
  // render UI
  renderAll();
  // attach events
  attachNavHandlers();
  logoutBtn.addEventListener("click", handleLogout);
  themeToggle.addEventListener("click", toggleTheme);
}

/* ---------- Theme ---------- */
function applyTheme(theme){
  if(theme === "dark"){ document.body.classList.add("dark"); themeToggle.textContent = "☀️"; }
  else { document.body.classList.remove("dark"); themeToggle.textContent = "🌙"; }
  localStorage.setItem(LS_THEME, theme);
}
function toggleTheme(){
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

/* ---------- Navigation ---------- */
function attachNavHandlers(){
  navButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      navButtons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      showSection(btn.dataset.target);
    });
  });
}
function showSection(id){
  sections.forEach(s=>{
    s.classList.remove("visible");
  });
  const target = document.getElementById(id);
  if(target){ target.classList.add("visible"); }
}

/* ---------- Render / Live Updates ---------- */
function renderAll(){
  renderRecordsTable();
  renderDashboard();
  renderTransactionOptions();
  renderAuditTable();
  renderChart();
  renderFeedbacks();
}

/* Dashboard */
function renderDashboard(){
  const total = ammoRecords.reduce((s, r) => s + Number(r.quantity || 0), 0);
  totalAmmoEl.textContent = total;
  const alerts = ammoRecords.filter(r => Number(r.quantity) < ALERT_THRESHOLD).length;
  activeAlertsEl.textContent = alerts;
  // recent transactions
  recentTransactionsEl.innerHTML = "";
  const recent = auditLog.slice().reverse().slice(0,6);
  recent.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.timestamp} — ${a.user} ${a.action} ${a.quantity} (${a.weapon})`;
    recentTransactionsEl.appendChild(li);
  });
  lockedBy.textContent = `Locked by ${currentUser()}`;
  footerLockedBy.textContent = `Locked by ${currentUser()}`;
}

/* Ammo Records Table */
function renderRecordsTable(){
  ammoTableBody.innerHTML = "";
  ammoRecords.forEach((r, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(r.category)}</td>
      <td>${escapeHtml(r.weapon)}</td>
      <td>${escapeHtml(r.caliber || "")}</td>
      <td>${Number(r.quantity)}</td>
      <td>${escapeHtml(r.location || "")}</td>
      <td>${escapeHtml(r.lastInspection || "")}</td>
      <td>
        <button data-idx="${idx}" class="btn small editBtn">Edit</button>
        <button data-idx="${idx}" class="btn small danger deleteBtn">Delete</button>
      </td>
    `;
    // low stock highlight
    if(Number(r.quantity) < ALERT_THRESHOLD){
      tr.style.borderLeft = `4px solid ${getComputedStyle(document.documentElement).getPropertyValue('--orange') || '#FF9933'}`;
    }
    ammoTableBody.appendChild(tr);
  });

  // attach delete & edit handlers
  document.querySelectorAll(".deleteBtn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const idx = Number(btn.dataset.idx);
      if(confirm(`Delete record "${ammoRecords[idx].weapon}"?`)){
        const deleted = ammoRecords.splice(idx,1)[0];
        saveAmmo(); renderAll();
        logAudit("Delete", deleted.category, deleted.weapon, deleted.quantity);
      }
    });
  });

  document.querySelectorAll(".editBtn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const idx = Number(btn.dataset.idx);
      openEditModal(idx);
    });
  });
}

/* Basic edit modal (simple prompt-based editing to keep single-file) */
function openEditModal(idx){
  const rec = ammoRecords[idx];
  const newQty = prompt("Edit Quantity:", rec.quantity);
  if(newQty === null) return;
  const n = Number(newQty);
  if(isNaN(n) || n < 0){ alert("Invalid quantity"); return; }
  rec.quantity = n;
  rec.lastInspection = new Date().toISOString().slice(0,10);
  saveAmmo(); renderAll();
  logAudit("EditQty", rec.category, rec.weapon, rec.quantity);
}

/* ---------- Add Ammo ---------- */
addAmmoForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const category = newCategory.value.trim() || "Uncategorized";
  const weapon = newWeapon.value.trim() || "Unknown";
  const caliber = newCaliber.value.trim();
  const quantity = Number(newQty.value) || 0;
  const location = newLocation.value.trim();
  const lastInspection = newInspection.value || new Date().toISOString().slice(0,10);

  const newRec = { id: Date.now(), category, weapon, caliber, quantity, location, lastInspection };
  ammoRecords.push(newRec);
  saveAmmo();
  addAmmoMsg.textContent = `Added ${weapon} (${quantity})`;
  setTimeout(()=> addAmmoMsg.textContent = "", 2500);
  addAmmoForm.reset();
  renderAll();
  logAudit("AddRecord", category, weapon, quantity);
});

resetFormBtn.addEventListener("click", ()=>{
  addAmmoForm.reset();
});

/* ---------- Transactions ---------- */
function renderTransactionOptions(){
  // fill select with weapon options (Category | Weapon text)
  transWeapon.innerHTML = "";
  if(ammoRecords.length === 0){
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No records available";
    transWeapon.appendChild(opt);
    transWeapon.disabled = true;
  } else {
    transWeapon.disabled = false;
    ammoRecords.forEach((r, idx)=>{
      const opt = document.createElement("option");
      opt.value = r.id; // use id
      opt.textContent = `${r.category} — ${r.weapon} (${r.quantity})`;
      transWeapon.appendChild(opt);
    });
  }
}

transForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const action = transAction.value;
  const selectedId = transWeapon.value;
  const qty = Math.abs(Number(transQty.value)) || 0;
  if(!selectedId){ transMsg.textContent = "Select a weapon/record."; return; }
  if(qty <= 0){ transMsg.textContent = "Enter a positive quantity."; return; }

  const idx = ammoRecords.findIndex(r => String(r.id) === String(selectedId));
  if(idx === -1){ transMsg.textContent = "Record not found."; return; }

  const rec = ammoRecords[idx];
  if(action === "Add"){
    rec.quantity = Number(rec.quantity) + qty;
    logAudit("Add", rec.category, rec.weapon, qty);
    transMsg.textContent = `Added ${qty} to ${rec.weapon}.`;
  } else {
    if(Number(rec.quantity) - qty < 0){
      transMsg.textContent = "Insufficient quantity — transaction blocked.";
      return;
    }
    rec.quantity = Number(rec.quantity) - qty;
    logAudit("Take", rec.category, rec.weapon, qty);
    transMsg.textContent = `Took ${qty} from ${rec.weapon}.`;
  }
  rec.lastInspection = new Date().toISOString().slice(0,10);
  saveAmmo();
  renderAll();
  renderTransactionOptions();
  setTimeout(()=> transMsg.textContent = "", 3000);
});

clearTrans.addEventListener("click", ()=> transForm.reset());

/* ---------- Audit Log ---------- */
function logAudit(action, category, weapon, quantity){
  const entry = {
    timestamp: nowStr(),
    action,
    category: category || "",
    weapon: weapon || "",
    quantity: quantity || 0,
    user: currentUser()
  };
  auditLog.push(entry);
  saveAudit();
  renderAuditTable();
}

function renderAuditTable(){
  auditTableBody.innerHTML = "";
  // most recent first
  const list = auditLog.slice().reverse();
  list.forEach(a=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.timestamp}</td>
      <td>${a.action}</td>
      <td>${escapeHtml(a.category)}</td>
      <td>${escapeHtml(a.weapon)}</td>
      <td>${a.quantity}</td>
      <td>${a.user}</td>
    `;
    auditTableBody.appendChild(tr);
  });
}

/* ---------- Analytics (Chart.js) ---------- */
function renderChart(){
  const categories = {};
  ammoRecords.forEach(r=>{
    const cat = r.category || "Uncategorized";
    categories[cat] = (categories[cat] || 0) + Number(r.quantity || 0);
  });
  const labels = Object.keys(categories);
  const data = labels.map(l => categories[l]);

  // background colors - generate palette
  const bg = labels.map((_,i) => `rgba(${(50+i*30)%255},${(120+i*50)%255},${(200-i*20+255)%255},0.8)`);

  if(ammoChart) {
    ammoChart.data.labels = labels;
    ammoChart.data.datasets[0].data = data;
    ammoChart.data.datasets[0].backgroundColor = bg;
    ammoChart.update();
    return;
  }

  ammoChart = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Quantity",
        data,
        backgroundColor: bg,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index' }
      },
      scales: {
        y: { beginAtZero: true },
      }
    }
  });
}

/* ---------- Feedback ---------- */
submitFeedback.addEventListener("click", ()=>{
  const txt = feedbackText.value.trim();
  if(!txt) return;
  feedbacks.push({ id: Date.now(), user: currentUser(), text: txt, time: nowStr() });
  saveFeedbacks();
  feedbackText.value = "";
  renderFeedbacks();
});

clearFeedback.addEventListener("click", ()=> feedbackText.value = "");

function renderFeedbacks(){
  feedbackList.innerHTML = "";
  feedbacks.slice().reverse().forEach(f=>{
    const el = document.createElement("div");
    el.className = "card";
    el.style.marginBottom = "8px";
    el.innerHTML = `<strong>${escapeHtml(f.user)}</strong> <span class="muted small">• ${f.time}</span><p>${escapeHtml(f.text)}</p>`;
    feedbackList.appendChild(el);
  });
}

/* ---------- Helpers ---------- */
function escapeHtml(s){
  if(!s && s !== 0) return "";
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

/* Logout */
function handleLogout(){
  sessionStorage.removeItem(SESSION_USER);
  // reload page to reset everything elegantly
  location.reload();
}

/* ---------- initialize on load if session exists ---------- */
window.addEventListener("load", ()=>{
  // If already logged in in this session, skip login
  if(sessionStorage.getItem(SESSION_USER)){
    initApp();
  }

  // initial renders if not logged in may still show data in console
  renderAuditTable();
  renderChart();
});

/* Track storage changes (if another tab modifies localStorage) */
window.addEventListener("storage", (e)=>{
  if(e.key === LS_AMMO){
    ammoRecords = JSON.parse(e.newValue) || [];
    renderAll();
  }
  if(e.key === LS_AUDIT){
    auditLog = JSON.parse(e.newValue) || [];
    renderAuditTable();
    renderDashboard();
  }
});

/* Seed sample data if no records present (for first-time demo) */
(function seedDemo(){
  if(!localStorage.getItem(LS_AMMO) && !localStorage.getItem(LS_AUDIT)){
    ammoRecords = [
      { id: Date.now()+1, category:"Rifle Cartridges", weapon:"AK-47", caliber:"7.62x39mm", quantity:15000, location:"Depot A", lastInspection:"2025-07-01" },
      { id: Date.now()+2, category:"Handgun Rounds", weapon:"9mm Pistol", caliber:"9x19mm", quantity:8000, location:"Depot B", lastInspection:"2025-08-15" },
      { id: Date.now()+3, category:"Artillery Shells", weapon:"105mm Howitzer", caliber:"105mm", quantity:50, location:"Armory C", lastInspection:"2025-09-10" }
    ];
    auditLog = [
      { timestamp: nowStr(), action:"Seed", category:"System", weapon:"DemoData", quantity:0, user:"system" }
    ];
    saveAmmo(); saveAudit();
  }
})();
