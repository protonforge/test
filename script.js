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
