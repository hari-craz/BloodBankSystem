// backend/server.js
import "dotenv/config.js";
import express from "express";
import cors from "cors";

import { query, initDB } from "./config/db.js";
import { router as authRoutes } from "./routes/auth.js";
import donorRoutes from "./routes/donors.js";
import requestRoutes from "./routes/requests.js";
import stockRoutes from "./routes/stock.js";

const app = express();
const PORT = process.env.PORT || 8087;

app.use(cors());
app.use(express.json());

// ensure pool is created
await initDB();

/* ---------- GET /api/stats (public – homepage) ---------- */
app.get("/api/stats", async (req, res) => {
  try {
    const donors = await query("SELECT COUNT(*) AS total FROM donors");
    const stock = await query(
      'SELECT COALESCE(SUM(units),0) AS units FROM blood_stock WHERE status = "available"'
    );
    const pending = await query(
      'SELECT COUNT(*) AS pending FROM blood_requests WHERE status = "pending"'
    );

    res.json({
      totalDonors: donors[0]?.total || 0,
      totalUnits: stock[0]?.units || 0,
      pendingRequests: pending[0]?.pending || 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------- Mount route modules at /api ---------- */
app.use("/api", authRoutes);
app.use("/api", donorRoutes);
app.use("/api", requestRoutes);
app.use("/api", stockRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
