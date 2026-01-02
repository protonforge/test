// =====================
// SHIP DATA
// =====================
const SHIPS = {
  "Succubus": { high: 2, mid: 2, low: 2 },
  "Typhoon 2": { high: 8, mid: 4, low: 7 },
};

const SHIP_CLASSES = {
  "Frigate": ["Succubus"],
  "Destroyer": ["Coercer"],
  "Cruiser": ["Omen"],
  "Battlecruiser": ["Oracle"],
  "Battleship": ["Typhoon 2"],
  "Carrier": ["Archon"],
  "Assault Carrier": ["Anaconda"],
  "Dreadnought": ["Bane"],
  "Supercarrier": ["Wyvern"],
  "Industrial": ["Tayra", "Rorqual"]
};


// =====================
// MODULE DATA
// =====================
const MODULE_DATA = {
  "Laser Cannon": { pg: 12, cap: 8, bonus: "High EM Damage" },
  "Pulse Laser": { pg: 10, cap: 6, bonus: "Faster Rate of Fire" },
  "Warp Scrambler": { pg: 15, cap: 12, bonus: "-2 Warp Strength" },
  "Webifier": { pg: 8, cap: 5, bonus: "-60% Velocity" },
  "Heat Sink": { pg: 5, cap: 0, bonus: "+15% Laser DPS" },
  "Armor Repairer": { pg: 18, cap: 20, bonus: "Repairs Armor Over Time" }
};

// =====================
// GLOBAL VARIABLES
// =====================
let selectedSlot = null;
let activeSlot = null;

// =====================
// SHIP MENU LOGIC
// =====================

document.addEventListener("DOMContentLoaded", () => {
  const shipCore = document.querySelector(".ship-core");
  const classMenu = document.getElementById("class-menu");
  const shipMenu = document.getElementById("ship-menu");
  const classList = document.getElementById("class-list");
  const shipList = document.getElementById("ship-list");

  // =====================
  // Generate class buttons dynamically
  // =====================
  for (const shipClass in SHIP_CLASSES) {
    const div = document.createElement("div");
    div.className = "ship-option";
    div.dataset.shipClass = shipClass;
    div.textContent = shipClass;
    classList.appendChild(div);
  }

  // =====================
  // Click ship core → open class menu
  // =====================
  shipCore.addEventListener("click", () => {
    classMenu.classList.toggle("hidden");
  });

  // =====================
  // Click class → show ships for that class
  // =====================
  classList.addEventListener("click", (e) => {
    const option = e.target.closest(".ship-option");
    if (!option) return;

    const shipClass = option.dataset.shipClass;
    const ships = SHIP_CLASSES[shipClass];

    // Clear old ships
    shipList.innerHTML = "";

    // Generate ship buttons
    ships.forEach(shipName => {
      const div = document.createElement("div");
      div.className = "ship-option";
      div.dataset.ship = shipName;
      div.textContent = shipName;
      shipList.appendChild(div);
    });

    // Hide class menu, show ship menu
    classMenu.classList.add("hidden");
    shipMenu.classList.remove("hidden");
  });

  // =====================
  // Click ship → generate slots and close ship menu
  // =====================
  shipList.addEventListener("click", (e) => {
    const option = e.target.closest(".ship-option");
    if (!option) return;

    const selectedShip = option.dataset.ship;
    createSlots(selectedShip); // your dynamic slot function
    shipMenu.classList.add("hidden"); // auto-close
  });

  // =====================
  // TAB NAVIGATION
  // =====================
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(target).classList.add('active');

      if (target !== 'fittings') {
        document.getElementById('module-info').classList.add('hidden');
      }
    });
  });

  // =====================
  // MODULE LOGIC
  // =====================
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

});
