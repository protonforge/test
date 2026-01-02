// ====== TAB NAVIGATION ======
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab; // e.g., "fittings", "skills", "implants"

    // Remove 'active' from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    // Add 'active' to clicked tab and corresponding content
    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ====== MODULE FITTING LOGIC ======
const MODULE_DATA = {
  "Laser Cannon": { pg: 12, cap: 8, bonus: "High EM Damage" },
  "Pulse Laser": { pg: 10, cap: 6, bonus: "Faster Rate of Fire" },
  "Warp Scrambler": { pg: 15, cap: 12, bonus: "-2 Warp Strength" },
  "Webifier": { pg: 8, cap: 5, bonus: "-60% Velocity" },
  "Heat Sink": { pg: 5, cap: 0, bonus: "+15% Laser DPS" },
  "Armor Repairer": { pg: 18, cap: 20, bonus: "Repairs Armor Over Time" }
};

let selectedSlot = null;
let activeSlot = null;

// Slot selection
document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {
    document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
    selectedSlot = slot;
    slot.classList.add("selected");

    if (slot.dataset.module) {
      showModuleInfo(slot);
    }
  });
});

// Module fitting
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
