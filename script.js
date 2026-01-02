const MODULE_DATA = {
  "Laser Cannon": {
    pg: 12,
    cap: 8,
    bonus: "High EM Damage"
  },
  "Pulse Laser": {
    pg: 10,
    cap: 6,
    bonus: "Faster Rate of Fire"
  },
  "Warp Scrambler": {
    pg: 15,
    cap: 12,
    bonus: "-2 Warp Strength"
  },
  "Webifier": {
    pg: 8,
    cap: 5,
    bonus: "-60% Velocity"
  },
  "Heat Sink": {
    pg: 5,
    cap: 0,
    bonus: "+15% Laser DPS"
  },
  "Armor Repairer": {
    pg: 18,
    cap: 20,
    bonus: "Repairs Armor Over Time"
  }
};


let selectedSlot = null;

// Slot selection
document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {
    document.querySelectorAll(".slot").forEach(s =>
      s.classList.remove("selected")
    );

    selectedSlot = slot;
    slot.classList.add("selected");
  });
});

// Module fitting with icon
document.querySelectorAll(".module").forEach(module => {
  module.addEventListener("click", () => {
    if (!selectedSlot) return;

    const moduleType = module.dataset.type;
    const iconPath = module.dataset.icon;

    // Slot compatibility check
    if (!selectedSlot.classList.contains(moduleType)) {
      alert("Wrong slot type!");
      return;
    }

    // Get slot image
    const icon = selectedSlot.querySelector(".slot-icon");

    icon.setAttribute("href", iconPath);
    icon.setAttribute("visibility", "visible");

    selectedSlot.classList.add("active");
    selectedSlot.dataset.module = module.textContent;
  });
});
