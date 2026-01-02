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

  // =====================
  // SLOT CONSTANTS
  // =====================
  const CENTER_X = 200;
  const CENTER_Y = 200;
  const SLOT_RADIUS = 150;
  const SLOT_SIZE = 18;

  const BASE_SPACING = 14;
  const MAX_CLUSTER_ARC = 120; // max degrees a cluster may span

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
  // SLOT CREATION
  // =====================
  function placeCluster(type, count, baseAngle) {
    if (count === 0) return;

    const spacing = Math.min(
      BASE_SPACING,
      MAX_CLUSTER_ARC / Math.max(count - 1, 1)
    );

    const totalWidth = spacing * (count - 1);
    const startAngle = baseAngle - totalWidth / 2;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * spacing;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `slot ${type}`);
      g.setAttribute("data-slot", `${type}-${i + 1}`);
      g.setAttribute(
        "transform",
        `translate(${CENTER_X} ${CENTER_Y}) rotate(${angle})`
      );

      // Slot circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", -SLOT_RADIUS);
      circle.setAttribute("r", SLOT_SIZE);
      g.appendChild(circle);

      // Upright icon
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
      image.setAttribute("class", "slot-icon");
      image.setAttribute("x", -14);
      image.setAttribute("y", -SLOT_RADIUS - 14);
      image.setAttribute("width", 28);
      image.setAttribute("height", 28);
      image.setAttribute("visibility", "hidden");
      image.setAttribute(
        "transform",
        `rotate(${-angle} 0 ${-SLOT_RADIUS})`
      );
      g.appendChild(image);

      svg.appendChild(g);
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

    placeCluster("high", ship.high, -60);
    placeCluster("mid", ship.mid, 90);
    placeCluster("low", ship.low, 210);

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
  // TAB NAVIGATION (FIXED)
  // =====================
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (!target) return;

      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target)?.classList.add("active");

      if (target !== "fittings") {
        document.getElementById("module-info")?.classList.add("hidden");
      }
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
