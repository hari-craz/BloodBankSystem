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
  const pendingEl = document.getElementById("pendingRequests");

  if (donorsEl && unitsEl && pendingEl) {
    const API_URL = window.location.origin.replace(':8080', ':3000');
    fetch(API_URL + "/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        donorsEl.textContent = data.totalDonors ?? "0";
        unitsEl.textContent = data.totalUnits ?? "0";
        pendingEl.textContent = data.pendingRequests ?? "0";
      })
      .catch((err) => console.error(err));
  }
});
