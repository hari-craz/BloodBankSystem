// backend/routes/requests.js
import express from "express";
import { query } from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

/* ---------- POST /api/requests (public) ---------- */
router.post("/requests", async (req, res) => {
  try {
    const {
      requester_name,
      requester_type,
      hospital_name,
      blood_group,
      units_requested,
      contact_phone,
      notes,
    } = req.body;

    if (
      !requester_name ||
      !requester_type ||
      !blood_group ||
      !units_requested ||
      !contact_phone
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await query(
      `INSERT INTO blood_requests
        (requester_name, requester_type, hospital_name, blood_group,
         units_requested, contact_phone, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        requester_name,
        requester_type,
        hospital_name || null,
        blood_group,
        units_requested,
        contact_phone,
        notes || null,
      ]
    );

    res.status(201).json({ message: "Request created" });
  } catch (err) {
    console.error("Request create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- GET /api/admin/overview (admin dashboard cards) ---------- */
router.get("/admin/overview", authMiddleware, async (req, res) => {
  try {
    const donors = await query("SELECT COUNT(*) AS total FROM donors");
    const stock = await query(
      'SELECT COALESCE(SUM(units),0) AS units FROM blood_stock WHERE status = "available"'
    );
    const pending = await query(
      'SELECT COUNT(*) AS total FROM blood_requests WHERE status = "pending"'
    );
    const expiringSoon = await query(
      `SELECT COUNT(*) AS total
       FROM blood_stock
       WHERE status = "available"
         AND expiry_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)`
    );
    const latestRequests = await query(
      `SELECT id, requester_name, blood_group, units_requested, status, created_at
       FROM blood_requests
       ORDER BY created_at DESC
       LIMIT 10`
    );

    res.json({
      totalDonors: donors[0]?.total || 0,
      totalUnits: stock[0]?.units || 0,
      pendingRequests: pending[0]?.total || 0,
      expiringSoon: expiringSoon[0]?.total || 0,
      latestRequests,
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- GET /api/admin/requests (admin) ---------- */
router.get("/admin/requests", authMiddleware, async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, requester_name, requester_type, blood_group,
              units_requested, status
       FROM blood_requests
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin requests error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- POST /api/admin/requests/:id/:action (admin) ---------- */
router.post("/admin/requests/:id/:action", authMiddleware, async (req, res) => {
  const { id, action } = req.params;
  const allowed = ["approve", "reject", "fulfill"];
  if (!allowed.includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  let newStatus;
  if (action === "approve") newStatus = "approved";
  if (action === "reject") newStatus = "rejected";
  if (action === "fulfill") newStatus = "fulfilled";

  try {
    await query(
      `UPDATE blood_requests
       SET status = ?
       WHERE id = ?`,
      [newStatus, id]
    );
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Update request error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
