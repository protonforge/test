// script.js

const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    // deactivate all tabs & content
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    // activate selected
    tab.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {
    slot.classList.toggle("active");
  });
});

let selectedSlot = null;

// Slot selection
document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {

    document.querySelectorAll(".slot").forEach(s => {
      s.classList.remove("selected");
    });

    selectedSlot = slot;
    slot.classList.add("selected");
  });
});

// Module fitting
document.querySelectorAll(".module").forEach(module => {
  module.addEventListener("click", () => {
    if (!selectedSlot) return;

    const moduleType = module.dataset.type;

    // Check slot compatibility
    if (!selectedSlot.classList.contains(moduleType)) {
      alert("Wrong slot type!");
      return;
    }

    // Fit module
    selectedSlot.classList.add("active");
    selectedSlot.dataset.module = module.textContent;
  });
});
