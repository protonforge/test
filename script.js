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
  // FIXED GEOMETRY CONSTANTS
  // =====================
  const CENTER_X = 200;
  const CENTER_Y = 200;

  // ONE ABSOLUTE RADIUS FOR ALL SHIPS
  const SLOT_RADIUS = 155;

  const SLOT_SIZE = 18;
  const BASE_SPACING = 14;
  const MAX_CLUSTER_ARC = 120;

  let selectedSlot = null;
  let activeSlot = null;

  // =====================
  // SLOT CREATION
  // =====================
  function placeCluster(type, count, baseAngle) {
    if (!count) return;

    // Spread slots along arc ONLY
    const spacing = Math.min(
      BASE_SPACING,
      MAX_CLUSTER_ARC / Math.max(count - 1, 1)
    );

    const totalArc = spacing * (count - 1);
    const startAngle = baseAngle - totalArc / 2;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + spacing * i;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.classList.add("slot", type);
      g.dataset.slot = `${type}-${i + 1}`;

      g.setAttribute(
        "transform",
        `translate(${CENTER_X} ${CENTER_Y}) rotate(${angle})`
      );

      // Slot circle
      const circle = document.createElementNS(svg.namespaceURI, "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", -SLOT_RADIUS);
      circle.setAttribute("r", SLOT_SIZE);
      g.appendChild(circle);

      // Upright icon
      const image = document.createElementNS(svg.namespaceURI, "image");
      image.classList.add("slot-icon");
      image.setAttribute("x", -14);
      image.setAttribute("y", -SLOT_RADIUS - 14);
      image.setAttribute("width", 28);
      image.setAttribute("height", 28);
      image.setAttribute("visibility", "hidden");

      // Counter-rotate icon to remain upright
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

    let ship;
    for (const cls in SHIPS) {
      if (SHIPS[cls][shipName]) ship = SHIPS[cls][shipName];
    }
    if (!ship) return;

    //  Fixed cluster centers — never move
    placeCluster("high", ship.high, -40);
    placeCluster("mid", ship.mid, 90);
    placeCluster("low", ship.low, 210);

    attachSlotListeners();
  }

  // =====================
  // SHIP MENUS
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
    Object.keys(SHIPS[cls]).forEach(ship => {
      const div = document.createElement("div");
      div.className = "ship-option";
      div.dataset.ship = ship;
      div.textContent = ship;
      shipList.appendChild(div);
    });

    classMenu.classList.add("hidden");
    shipMenu.classList.remove("hidden");
  });

  shipList.addEventListener("click", e => {
    const ship = e.target.dataset.ship;
    if (!ship) return;
    createSlots(ship);
    shipMenu.classList.add("hidden");
  });

  // =====================
  // TABS (SAFE)
  // =====================
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab)?.classList.add("active");
    });
  });

  // =====================
  // MODULE INFO (unchanged)
  // =====================
  function showModuleInfo(slot) {
    activeSlot = slot;
    document.getElementById("module-info").classList.remove("hidden");
  }
});
