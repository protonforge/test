document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // Ship Classes & Ships
  // =====================
  const SHIP_CLASSES = {
    "Frigate": ["Succubus", "Gladius"],
    "Destroyer": ["Typhoon 2", "Scythe"],
    "Cruiser": ["Vanguard", "Nova"],
    "Battlecruiser": ["Excalibur", "Reaper"],
    "Battleship": ["Colossus", "Titan"],
    "Carrier": ["Harbinger", "Archangel"],
    "Assault Carrier": ["Judicator", "Valiant"],
    "Dreadnought": ["Oblivion", "Leviathan"],
    "Supercarrier": ["Behemoth", "Aegis"],
    "Industrial": ["Hauler", "Freighter"]
  };

  const SHIPS = {
    "Succubus": { high: 2, mid: 2, low: 2 },
    "Gladius": { high: 3, mid: 2, low: 1 },
    "Typhoon 2": { high: 8, mid: 4, low: 7 },
    "Scythe": { high: 4, mid: 3, low: 3 },
    "Vanguard": { high: 4, mid: 3, low: 2 },
    "Nova": { high: 3, mid: 3, low: 3 },
    "Excalibur": { high: 5, mid: 3, low: 3 },
    "Reaper": { high: 4, mid: 4, low: 4 },
  };

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

  const svg = document.getElementById("fitting-svg");
  const shipCore = document.querySelector(".ship-core");
  const classMenu = document.getElementById("class-menu");
  const shipMenu = document.getElementById("ship-menu");
  const classList = document.getElementById("class-list");
  const shipList = document.getElementById("ship-list");

  // =====================
  // Generate class buttons
  // =====================
  for (const shipClass in SHIP_CLASSES) {
    const div = document.createElement("div");
    div.className = "ship-option";
    div.dataset.shipClass = shipClass;
    div.textContent = shipClass;
    classList.appendChild(div);
  }

  // =====================
  // SHIP CORE CLICK → CLASS MENU
  // =====================
  shipCore.addEventListener("click", () => {
    classMenu.classList.toggle("hidden");
  });

  // =====================
  // CLASS MENU CLICK → SHIP MENU
  // =====================
  classList.addEventListener("click", (e) => {
    let option = e.target;
    while (option && !option.dataset.shipClass) option = option.parentElement;
    if (!option) return;

    const shipClass = option.dataset.shipClass;
    const ships = SHIP_CLASSES[shipClass];

    shipList.innerHTML = "";
    ships.forEach(shipName => {
      const div = document.createElement("div");
      div.className = "ship-option";
      div.dataset.ship = shipName;
      div.textContent = shipName;
      shipList.appendChild(div);
    });

    classMenu.classList.add("hidden");
    shipMenu.classList.remove("hidden");
  });

  // =====================
  // SHIP MENU CLICK → CREATE SLOTS & CLOSE
  // =====================
  shipList.addEventListener("click", (e) => {
    let option = e.target;
    while (option && !option.dataset.ship) option = option.parentElement;
    if (!option) return;

    const selectedShip = option.dataset.ship;
    if (!selectedShip) return;

    createSlots(selectedShip);
    shipMenu.classList.add("hidden");
  });

  // =====================
  // CREATE CIRCULAR SLOTS
  // =====================
  function createSlots(shipName) {
    if (!svg) return;

    // Clear old slots
    svg.querySelectorAll(".slot").forEach(s => s.remove());

    const ship = SHIPS[shipName];
    if (!ship) return;

    function placeSlots(type, count, startAngle, endAngle, radius = 140) {
      for (let i = 0; i < count; i++) {
        const angle = count === 1 ? (startAngle + endAngle) / 2
          : startAngle + ((endAngle - startAngle) / (count - 1)) * i;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", `slot ${type}`);
        g.setAttribute("data-slot", `${type}-${i+1}`);
        g.setAttribute("transform", `translate(200 200) rotate(${angle})`);

        // Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", 0);
        circle.setAttribute("cy", -radius);
        circle.setAttribute("r", 18);
        g.appendChild(circle);

        // Text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", 0);
        text.setAttribute("y", -radius + 35);
        text.setAttribute("text-anchor", "middle");
        text.textContent = `${type[0].toUpperCase()}${i+1}`;
        g.appendChild(text);

        // Icon
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("class", "slot-icon");
        image.setAttribute("x", -14);
        image.setAttribute("y", -radius - 14);
        image.setAttribute("width", 28);
        image.setAttribute("height", 28);
        image.setAttribute("visibility", "hidden");
        g.appendChild(image);

        svg.appendChild(g);

        // Slot click
        g.addEventListener("click", () => {
          svg.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
          selectedSlot = g;
          g.classList.add("selected");

          if (g.dataset.module) showModuleInfo(g);
        });
      }
    }

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

});
