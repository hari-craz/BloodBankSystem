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
    
    // Auto-create tables if they don't exist
    await createTablesIfNotExist();
  }
  return pool;
}

async function createTablesIfNotExist() {
  try {
    console.log("🔧 Checking database tables...");
    
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create donors table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS donors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        gender ENUM('M', 'F', 'Other') NOT NULL,
        blood_group VARCHAR(5) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        address TEXT,
        last_donated_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create blood_stock table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blood_stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT,
        blood_group VARCHAR(5) NOT NULL,
        units DECIMAL(5,2) DEFAULT 1.0,
        collected_at DATE NOT NULL,
        expiry_date DATE NOT NULL,
        status ENUM('available', 'used', 'expired') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE SET NULL
      )
    `);
    
    // Create blood_requests table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blood_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        requester_name VARCHAR(100) NOT NULL,
        requester_type ENUM('patient', 'hospital') NOT NULL,
        hospital_name VARCHAR(100),
        blood_group VARCHAR(5) NOT NULL,
        units_requested INT NOT NULL,
        contact_phone VARCHAR(20) NOT NULL,
        notes TEXT,
        status ENUM('pending', 'approved', 'rejected', 'fulfilled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert default admin user if not exists
    await pool.execute(`
      INSERT IGNORE INTO users (name, email, password_hash, role) 
      VALUES ('Admin', 'admin@bloodbank.com', 'admin123', 'admin')
    `);
    
    console.log("✅ Database tables verified/created");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    throw err;
  }
}

export async function query(sql, params) {
  const db = await initDB();
  const [rows] = await db.execute(sql, params);
  return rows;
}
