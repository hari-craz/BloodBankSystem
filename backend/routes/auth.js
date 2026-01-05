// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
// ❌ REMOVE bcrypt import because we are not using hashing now
// import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

export const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME";

/* ---------- Auth middleware (export for other routes) ---------- */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* ---------- POST /api/auth/login ---------- */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const users = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [
      email,
    ]);
    const user = users[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ PLAIN TEXT PASSWORD CHECK (matches 'admin123' in DB)
    const isValid = password === user.password_hash;
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
