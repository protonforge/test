// TAB NAVIGATION
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));

    // Activate clicked tab and corresponding content
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');

    // OPTIONAL: hide module info when leaving Fittings tab
    if (target !== 'fittings') {
      document.getElementById('module-info').classList.add('hidden');
    }
  });
});

// MODULE LOGIC
const MODULE_DATA = { /* your module data */ };
let selectedSlot = null;
let activeSlot = null;

document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {
    document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
    selectedSlot = slot;
    slot.classList.add("selected");

    if (slot.dataset.module) showModuleInfo(slot);
  });
});

document.querySelectorAll(".module").forEach(module => {
  module.addEventListener("click", () => {
    if (!selectedSlot) return;
    const moduleType = module.dataset.type;
    const iconPath = module.dataset.icon;

    if (!selectedSlot.classList.contains(moduleType)) {
      alert("Wrong slot type!");
      return;
    }

    const icon = selectedSlot.querySelector(".slot-icon");
    icon.setAttribute("href", iconPath);
    icon.setAttribute("visibility", "visible");

    selectedSlot.classList.add("active");
    selectedSlot.dataset.module = module.textContent;
  });
});

function showModuleInfo(slot) {
  activeSlot = slot;
  const name = slot.dataset.module;
  const data = MODULE_DATA[name];

  document.getElementById("module-name").textContent = name;
  document.getElementById("stat-pg").textContent = data.pg;
  document.getElementById("stat-cap").textContent = data.cap;
  document.getElementById("stat-bonus").textContent = data.bonus;

  document.getElementById("module-info").classList.remove("hidden");
}

document.getElementById("remove-module").addEventListener("click", () => {
  if (!activeSlot) return;
  const icon = activeSlot.querySelector(".slot-icon");

  icon.setAttribute("visibility", "hidden");
  icon.removeAttribute("href");
  activeSlot.classList.remove("active");
  delete activeSlot.dataset.module;

  document.getElementById("module-info").classList.add("hidden");
  activeSlot = null;
});
