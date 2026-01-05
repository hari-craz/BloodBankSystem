import mysql from "mysql2/promise";

let pool;

export async function initDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "blood_bank",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ MySQL pool created");
  }
  return pool;
}

export async function query(sql, params) {
  const db = await initDB();
  const [rows] = await db.execute(sql, params);
  return rows;
}
