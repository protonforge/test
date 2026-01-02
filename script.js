document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // SHIP DATA
  // =====================
  const SHIPS = {
    Frigate: { "Succubus": { high: 2, mid: 2, low: 2 } },
    Battleship: { "Typhoon 2": { high: 8, mid: 4, low: 7 } }
  };

  // =====================
  // DOM REFERENCES
  // =====================
  const svg = document.getElementById("fitting-svg");
  const shipCore = document.querySelector(".ship-core");

  const classMenu = document.getElementById("class-menu");
  const classList = document.getElementById("class-list");
  const shipMenu = document.getElementById("ship-menu");
  const shipList = document.getElementById("ship-list");

  const CENTER_X = 200;
  const CENTER_Y = 200;
  const SLOT_RADIUS = 150;
  const SLOT_SIZE = 18;
  const SLOT_SPACING = 14;
  const BUFFER = 5;

  let selectedSlot = null;
  let activeSlot = null;

  // =====================
  // MODULE DATA
  // =====================
  const MODULE_DATA = {
    "Laser Cannon": { pg: 12, cap: 8, bonus: "High EM Damage" },
    "Pulse Laser": { pg: 10, cap: 6, bonus: "Faster ROF" },
    "Warp Scrambler": { pg: 15, cap: 12, bonus: "-2 Warp Strength" },
    "Webifier": { pg: 8, cap: 5, bonus: "-60% Velocity" },
    "Heat Sink": { pg: 5, cap: 0, bonus: "+15% DPS" },
    "Armor Repairer": { pg: 18, cap: 20, bonus: "Repairs Armor" }
  };

  // =====================
  // HELPER FUNCTIONS
  // =====================
  function clusterHalfWidth(slotCount) {
    return slotCount <= 1 ? 0 : ((slotCount - 1) * SLOT_SPACING) / 2;
  }

  function placeCluster(type, count, startAngle) {
    if (count === 0) return;

    // All clusters use the same base radius
    let radius = SLOT_RADIUS;

    // Optional: small outward push for clusters with lots of slots
    if (count > 4) radius += (count - 4) * 3;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * SLOT_SPACING;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `slot ${type}`);
      g.setAttribute("data-slot", `${type}-${i + 1}`);
      g.setAttribute("transform", `translate(${CENTER_X} ${CENTER_Y}) rotate(${angle})`);

      // Circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", -radius);
      circle.setAttribute("r", SLOT_SIZE);
      g.appendChild(circle);

    // Image (upright)
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("class", "slot-icon");
      image.setAttribute("x", -14);
      image.setAttribute("y", -radius - 14);
      image.setAttribute("width", 28);
      image.setAttribute("height", 28);
      image.setAttribute("visibility", "hidden");
      image.setAttribute("transform", `rotate(${-angle} 0 ${-radius})`);
      g.appendChild(image);

      // Optional text labels
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 0);
      text.setAttribute("y", -radius + 35);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("transform", `rotate(${-angle} 0 ${-radius})`);
      text.textContent = `${type[0].toUpperCase()}${i + 1}`;
      g.appendChild(text);

      svg.appendChild(g);
    }
  }

  }

  function attachSlotListeners() {
    document.querySelectorAll(".slot").forEach(slot => {
      slot.addEventListener("click", () => {
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        selectedSlot = slot;
        slot.classList.add("selected");

        if (slot.dataset.module) showModuleInfo(slot);
      });
    });
  }

  function createSlots(shipName) {
    svg.querySelectorAll(".slot").forEach(s => s.remove());
    let ship = null;
    for (let cls in SHIPS) {
      if (SHIPS[cls][shipName]) {
        ship = SHIPS[cls][shipName];
        break;
      }
    }
    if (!ship) return;

    const highHalf = clusterHalfWidth(ship.high);
    const midHalf = clusterHalfWidth(ship.mid);
    const lowHalf = clusterHalfWidth(ship.low);

    const HIGH_BASE = -60;
    const MID_BASE = 90;
    const LOW_BASE = 190;

    let lowAngle = LOW_BASE;
    const overlap = (HIGH_BASE + highHalf + BUFFER) > (LOW_BASE - lowHalf);
    if (overlap) lowAngle += (HIGH_BASE + highHalf + BUFFER) - (LOW_BASE - lowHalf);

    // Place clusters
    placeCluster("high", ship.high, HIGH_BASE);
    placeCluster("mid", ship.mid, MID_BASE);
    placeCluster("low", ship.low, lowAngle);

    attachSlotListeners();
  }

  // =====================
  // SHIP MENU
  // =====================
  shipCore.addEventListener("click", () => {
    classMenu.classList.toggle("hidden");
    shipMenu.classList.add("hidden");
  });

  Object.keys(SHIPS).forEach(cls => {
    const div = document.createElement("div");
    div.className = "ship-option";
    div.dataset.class = cls;
    div.textContent = cls;
    classList.appendChild(div);
  });

  classList.addEventListener("click", e => {
    const cls = e.target.dataset.class;
    if (!cls) return;

    shipList.innerHTML = "";
    Object.keys(SHIPS[cls]).forEach(shipName => {
      const div = document.createElement("div");
      div.className = "ship-option";
      div.dataset.ship = shipName;
      div.textContent = shipName;
      shipList.appendChild(div);
    });

    classMenu.classList.add("hidden");
    shipMenu.classList.remove("hidden");
  });

  shipList.addEventListener("click", e => {
    const shipName = e.target.dataset.ship;
    if (!shipName) return;

    createSlots(shipName);
    shipMenu.classList.add("hidden");
  });

  // =====================
  // TAB NAVIGATION
  // =====================
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (!target) return;

      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");

      if (target !== "fittings") document.getElementById("module-info").classList.add("hidden");
    });
  });

  // =====================
  // MODULE LOGIC
  // =====================
  document.querySelectorAll(".module").forEach(module => {
    module.addEventListener("click", () => {
      if (!selectedSlot) return;

      const type = module.dataset.type;
      const iconPath = module.dataset.icon;

      if (!selectedSlot.classList.contains(type)) {
        alert("Wrong slot type!");
        return;
      }

      const icon = selectedSlot.querySelector(".slot-icon");
      icon.setAttribute("href", iconPath);
      icon.setAttribute("visibility", "visible");

      selectedSlot.dataset.module = module.textContent;
    });
  });

  function showModuleInfo(slot) {
    activeSlot = slot;
    const data = MODULE_DATA[slot.dataset.module];
    if (!data) return;

    document.getElementById("module-name").textContent = slot.dataset.module;
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

    delete activeSlot.dataset.module;
    document.getElementById("module-info").classList.add("hidden");
    activeSlot = null;
  });
});
