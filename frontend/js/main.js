// main.js

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // Example: load homepage stats if present
  const donorsEl = document.getElementById("totalDonors");
  const unitsEl = document.getElementById("totalUnits");

  if (donorsEl && unitsEl) {
    // Skeleton: integrate with backend later
    fetch("http://localhost:3000/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        donorsEl.textContent = data.totalDonors ?? "0";
        unitsEl.textContent = data.totalUnits ?? "0";
      })
      .catch((err) => console.error(err));
  }
});
