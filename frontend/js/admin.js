const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? `http://${window.location.hostname}:8087`
  : window.location.origin.replace(':8086', ':8087')) + "/api";

function getAuthHeaders() {
  const token = localStorage.getItem("bb_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function requireAuth() {
  const token = localStorage.getItem("bb_token");
  if (!token) {
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const user = JSON.parse(localStorage.getItem("bb_user") || "null");
  const adminName = document.getElementById("adminName");
  if (adminName && user) {
    adminName.textContent = user.name || user.email || "Admin";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("bb_token");
      localStorage.removeItem("bb_user");
      window.location.href = "login.html";
    });
  }

  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll(".sidebar a[data-section]");
  const sections = {
    overview: document.getElementById("section-overview"),
    stock: document.getElementById("section-stock"),
    requests: document.getElementById("section-requests"),
    donors: document.getElementById("section-donors"),
  };

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      Object.entries(sections).forEach(([key, el]) => {
        el.style.display = key === section ? "block" : "none";
      });
    });
  });

  // Wire once: stock row actions (previously bound on every reload)
  const stockTableBody = document.getElementById("stockTableBody");
  if (stockTableBody) {
    stockTableBody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      try {
        let url;
        let method = "POST";
        if (action === "used") url = `${API_BASE}/admin/stock/${id}/mark-used`;
        else if (action === "expired")
          url = `${API_BASE}/admin/stock/${id}/mark-expired`;
        else if (action === "delete") {
          url = `${API_BASE}/admin/stock/${id}`;
          method = "DELETE";
        }

        if (!url) return;

        const res = await fetch(url, {
          method,
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          loadOverview();
          loadStock();
        }
      } catch (err) {
        console.error("Stock action failed:", err);
      }
    });
  }

  // Wire once: request action buttons
  const requestsTableBody = document.getElementById("requestsTableBody");
  if (requestsTableBody) {
    requestsTableBody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const id = btn.dataset.id;
      const action = btn.dataset.action;

      try {
        const res = await fetch(`${API_BASE}/admin/requests/${id}/${action}` ,{
            method: "POST",
            headers: getAuthHeaders(),
          }
        );
        if (res.ok) {
          loadOverview();
          loadRequests();
          loadStock();
        }
      } catch (err) {
        console.error("Update request failed:", err);
      }
    });
  }

  // Load data
  loadOverview();
  loadStock();
  loadRequests();
  loadDonors();

  // Donor search
  const donorSearch = document.getElementById("donorSearch");
  if (donorSearch) {
    donorSearch.addEventListener("input", () => {
      const query = donorSearch.value.toLowerCase();
      document.querySelectorAll("#donorsTableBody tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  }
});

// ===== API calls =====
async function loadOverview() {
  try {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return;
    const data = await res.json();

    document.getElementById("cardTotalDonors").textContent =
      data.totalDonors ?? 0;
    document.getElementById("cardTotalUnits").textContent =
      data.totalUnits ?? 0;
    document.getElementById("cardPendingRequests").textContent =
      data.pendingRequests ?? 0;
    document.getElementById("cardExpiring").textContent =
      data.expiringSoon ?? 0;

    const tbody = document.getElementById("overviewRequestsBody");
    tbody.innerHTML = "";
    (data.latestRequests || []).forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.requester_name}</td>
        <td>${r.blood_group}</td>
        <td>${r.units_requested}</td>
        <td>${r.status}</td>
        <td>${(r.created_at || "").slice(0, 10)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Overview load failed:", err);
  }
}

async function loadStock() {
  try {
    const res = await fetch(`${API_BASE}/admin/stock`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return;
    const units = await res.json();

    const tbody = document.getElementById("stockTableBody");
    tbody.innerHTML = "";
    units.forEach((u) => {
      const statusClass =
        u.status === "available"
          ? "status-available"
          : u.status === "used"
          ? "status-used"
          : "status-expired";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.donor_name || "—"}</td>
        <td>${u.blood_group}</td>
        <td>${u.units}</td>
        <td>${(u.collected_at || "").slice(0,10)}</td>
        <td>${(u.expiry_date || "").slice(0,10)}</td>
        <td class="${statusClass}">${u.status}</td>
        <td>
          <button class="btn btn-outline" data-action="used" data-id="${u.id}" style="padding:6px 10px;font-size:12px;">Mark Used</button>
          <button class="btn btn-outline" data-action="expired" data-id="${u.id}" style="padding:6px 10px;font-size:12px;">Mark Expired</button>
          <button class="btn btn-outline" data-action="delete" data-id="${u.id}" style="padding:6px 10px;font-size:12px;">Dispose</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Stock load failed:", err);
  }
}

async function loadRequests() {
  try {
    const res = await fetch(`${API_BASE}/admin/requests`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return;
    const requests = await res.json();

    const tbody = document.getElementById("requestsTableBody");
    tbody.innerHTML = "";
    requests.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.requester_name}</td>
        <td>${r.requester_type}</td>
        <td>${r.blood_group}</td>
        <td>${r.units_requested}</td>
        <td>${r.status}</td>
        <td>
          <button class="btn btn-outline" data-action="approve" data-id="${r.id}" style="padding:6px 10px;font-size:12px;">Approve</button>
          <button class="btn btn-outline" data-action="reject" data-id="${r.id}" style="padding:6px 10px;font-size:12px;">Reject</button>
          <button class="btn btn-outline" data-action="fulfill" data-id="${r.id}" style="padding:6px 10px;font-size:12px;">Fulfill</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Requests load failed:", err);
  }
}

async function loadDonors() {
  try {
    const res = await fetch(`${API_BASE}/admin/donors`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return;
    const donors = await res.json();

    const tbody = document.getElementById("donorsTableBody");
    tbody.innerHTML = "";
    donors.forEach((d) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.blood_group}</td>
        <td>${d.phone}</td>
        <td>${d.last_donated_at ? d.last_donated_at.slice(0,10) : "—"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Donors load failed:", err);
  }
}
