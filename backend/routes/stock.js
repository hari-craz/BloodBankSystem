// backend/routes/stock.js
import express from "express";
import { query } from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

/**
 * Public: GET /api/availability?group=O+
 */
router.get("/availability", async (req, res) => {
  const group = req.query.group;
  if (!group) return res.status(400).json({ error: "Missing group" });

  try {
    const rows = await query(
      `SELECT COALESCE(SUM(units),0) AS units
       FROM blood_stock
       WHERE blood_group = ? AND status = "available"`,
      [group]
    );
    res.json({ group, unitsAvailable: rows[0]?.units || 0 });
  } catch (err) {
    console.error("Availability error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Admin: list units
 */
router.get("/admin/stock", authMiddleware, async (req, res) => {
  try {
    const rows = await query(
      `SELECT s.id,
              d.name AS donor_name,
              s.blood_group,
              s.units,
              s.collected_at,
              s.expiry_date,
              s.status
       FROM blood_stock s
       LEFT JOIN donors d ON s.donor_id = d.id
       ORDER BY s.collected_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin stock error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Admin: mark bag used
 */
router.post("/admin/stock/:id/mark-used", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await query(
      `UPDATE blood_stock SET status = "used" WHERE id = ?`,
      [id]
    );
    res.json({ message: "Marked as used" });
  } catch (err) {
    console.error("Mark used error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Admin: mark bag expired
 */
router.post(
  "/admin/stock/:id/mark-expired",
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    try {
      await query(
        `UPDATE blood_stock SET status = "expired" WHERE id = ?`,
        [id]
      );
      res.json({ message: "Marked as expired" });
    } catch (err) {
      console.error("Mark expired error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/**
 * Admin: dispose bag (delete row)
 */
router.delete("/admin/stock/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await query(`DELETE FROM blood_stock WHERE id = ?`, [id]);
    res.json({ message: "Stock bag deleted" });
  } catch (err) {
    console.error("Delete stock error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
