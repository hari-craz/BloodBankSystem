// backend/routes/donors.js
import express from "express";
import { query } from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

/* ---------- POST /api/donors (public) ---------- */
router.post("/donors", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      blood_group,
      phone,
      email,
      address,
    } = req.body;

    if (!name || !age || !gender || !blood_group || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await query(
      `INSERT INTO donors (name, age, gender, blood_group, phone, email, address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, age, gender, blood_group, phone, email || null, address || null]
    );

    res.status(201).json({ message: "Donor registered" });
  } catch (err) {
    console.error("Donor create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- GET /api/admin/donors (admin) ---------- */
router.get("/admin/donors", authMiddleware, async (req, res) => {
  try {
    const donors = await query(
      `SELECT id, name, blood_group, phone, last_donated_at
       FROM donors
       ORDER BY created_at DESC`
    );
    res.json(donors);
  } catch (err) {
    console.error("Admin donors error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
