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
    // Detect if running locally or in production
    const getAPIURL = () => {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port;
      
      // If running on localhost, use port 8087
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `${protocol}//${hostname}:8087`;
      }
      // If running on a domain/IP, replace the frontend port with backend port
      if (port === '8086') {
        return `${protocol}//${hostname}:8087`;
      }
      // Default: use same host with backend port
      return `${protocol}//${hostname}:8087`;
    };
    const API_URL = getAPIURL();
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
