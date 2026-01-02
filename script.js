// =====================
// SHIP DATA
// =====================
const SHIPS = {
  "Succubus": { high: 2, mid: 2, low: 2 },
  "Typhoon 2": { high: 8, mid: 4, low: 7 },
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

// Ship menu logic
document.addEventListener("DOMContentLoaded", () => {

  const shipMenu = document.getElementById("ship-menu");
  const shipCore = document.querySelector(".ship-core");

  // Open/close ship menu when clicking ship core
  shipCore.addEventListener("click", () => {
    shipMenu.classList.toggle("hidden");
  });

  // Use event delegation to ensure clicks on ship options always work
  shipMenu.addEventListener("click", (e) => {
    const option = e.target.closest(".ship-option");
    if (!option) return;

    const selectedShip = option.dataset.ship;

    // Generate slots dynamically
    createSlots(selectedShip);

    // Automatically close the ship menu
        shipMenu.classList.add("hidden");
  });

});


// =====================
// CREATE SLOTS FUNCTION
// =====================
function createSlots(shipName) {
  const svg = document.getElementById("fitting-svg");

  // Clear old slots
  svg.querySelectorAll(".slot").forEach(s => s.remove());
  selectedSlot = null;
  activeSlot = null;
  document.getElementById("module-info").classList.add("hidden");

  const ship = SHIPS[shipName];
  if (!ship) return;

  // Helper to place slots in a circular arc
  function placeSlots(type, count, startAngle, endAngle, radius = 140) {
    for (let i = 0; i < count; i++) {
      const angle = count === 1 ? (startAngle + endAngle) / 2
                                : startAngle + ((endAngle - startAngle) / (count - 1)) * i;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `slot ${type}`);
      g.setAttribute("data-slot", `${type}-${i+1}`);
      g.setAttribute("transform", `translate(200 200) rotate(${angle})`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", -radius);
      circle.setAttribute("r", 18);
      g.appendChild(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 0);
      text.setAttribute("y", -radius + 35);
      text.setAttribute("text-anchor", "middle");
      text.textContent = `${type[0].toUpperCase()}${i+1}`;
      g.appendChild(text);

      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("class", "slot-icon");
      image.setAttribute("x", -14);
      image.setAttribute("y", -radius - 14);
      image.setAttribute("width", 28);
      image.setAttribute("height", 28);
      image.setAttribute("visibility", "hidden");
      g.appendChild(image);

      // =====================
      // SLOT CLICK LISTENER
      // =====================
      g.addEventListener("click", () => {
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        selectedSlot = g;
        g.classList.add("selected");

        if (g.dataset.module) showModuleInfo(g);
      });

      svg.appendChild(g);
    }
  }

  // Create arcs for each slot type
  placeSlots("high", ship.high, -60, 60);
  placeSlots("mid", ship.mid, 90, 150);
  placeSlots("low", ship.low, 210, 270);
}

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
