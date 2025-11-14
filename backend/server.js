// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================== SQLite ==================
const dbPromise = open({
  filename: "./db.sqlite3",
  driver: sqlite3.Database,
});

// Tạo bảng nếu chưa có
(async () => {
  const db = await dbPromise;

  // USERS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      phone TEXT,
      avatar TEXT,
      role TEXT DEFAULT 'buyer',
      disabled INTEGER DEFAULT 0
    );
  `);

  // LISTINGS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sellerId INTEGER,
      title TEXT,
      description TEXT,
      category TEXT,
      price REAL,
      condition TEXT,
      photos TEXT,
      status TEXT DEFAULT 'active',
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  // ORDERS
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyerId INTEGER,
      items TEXT,
      total REAL,
      paymentMethod TEXT,
      shippingInfo TEXT,
      status TEXT DEFAULT 'placed',
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed admin nếu chưa có
  const admin = await db.get("SELECT * FROM users WHERE email = ?", [
    "admin@gmail.com",
  ]);
  if (!admin) {
    await db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin", "admin@gmail.com", "123456", "admin"]
    );
    console.log("👑 Seeded admin: admin@gmail.com / 123456");
  }
})();

// ================== AUTH ==================

// Register
// Register (debug + validate chuẩn)
app.post("/register", async (req, res) => {
  let { name, email, password, phone, role } = req.body;
  const db = await dbPromise;

  // ✅ Ép chuỗi + trim (tránh undefined/null)
  name = String(name ?? "").trim();
  email = String(email ?? "").trim();
  password = String(password ?? "").trim();
  phone = String(phone ?? "").trim();
  role = role === "seller" ? "seller" : "buyer";

  console.log("📩 Register attempt:", { name, email, pwLen: password.length, phone, role });

  // ⚠️ Required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "All required fields must be completed (name, email, password).",
    });
  }

  // ⚠️ Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // ⚠️ Password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
    });
  }

  try {
    // ⚠️ Kiểm tra email trùng (case-insensitive)
    const existing = await db.get(
      "SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)",
      [email]
    );
    if (existing) {
      console.log("⚠️ Found existing:", existing);
      return res.status(400).json({ error: "Email already exists." });
    }

    // ✅ Insert user
    await db.run(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, phone, role]
    );

    console.log("✅ Registered new user:", email);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ error: "Server error while registering user." });
  }
});


// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await dbPromise;
  const user = await db.get(
    "SELECT id, name, email, avatar, role, disabled FROM users WHERE email = ? AND password = ?",
    [email, password]
  );

  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  if (user.disabled)
    return res.status(403).json({
      error:
        "Your account has been temporarily restricted. Please contact support.",
    });

  res.json(user);
});

// Update profile
app.post("/update-profile", async (req, res) => {
  const { email, name, avatar } = req.body;
  const db = await dbPromise;

  try {
    if (!email) return res.status(400).json({ error: "Missing email" });
    await db.run("UPDATE users SET name = ?, avatar = ? WHERE email = ?", [
      name,
      avatar,
      email,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================== ADMIN ==================

// Lấy toàn bộ user
app.get("/admin/users", async (req, res) => {
  const db = await dbPromise;
  const users = await db.all(
    "SELECT id, name, email, phone, avatar, role, disabled FROM users ORDER BY id DESC"
  );
  res.json(users);
});

// Bật/tắt user
app.post("/admin/user/toggle", async (req, res) => {
  const { id, disabled } = req.body;
  const db = await dbPromise;

  const user = await db.get("SELECT role FROM users WHERE id = ?", [id]);
  if (user && user.role === "admin")
    return res
      .status(400)
      .json({ error: "⚠️ You cannot disable an admin account." });

  await db.run("UPDATE users SET disabled = ? WHERE id = ?", [
    disabled ? 1 : 0,
    id,
  ]);
  res.json({ success: true });
});

// ================== LISTINGS (Seller) ==================

// Tạo listing
app.post("/listings", async (req, res) => {
  const { sellerId, title, description, category, price, condition, photos } =
    req.body;
  const db = await dbPromise;

  try {
    await db.run(
      `INSERT INTO listings (sellerId, title, description, category, price, condition, photos)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(sellerId) || 0, // ✅ ép kiểu an toàn, tránh null
        title?.trim() || "Untitled",
        description || "",
        category || "",
        parseFloat(price) || 0,
        condition || "new",
        JSON.stringify(photos || []),
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Add listing failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Lấy listings
app.get("/listings", async (req, res) => {
  const db = await dbPromise;
  const { q, category, min, max, sellerId } = req.query;

  let sql = "SELECT * FROM listings WHERE status = 'active'";
  const params = [];

  // 👇 Nếu có sellerId => chỉ lấy sản phẩm của seller đó
  if (sellerId) {
    sql += " AND sellerId = ?";
    params.push(sellerId);
  }

  if (q) {
    sql += " AND title LIKE ?";
    params.push(`%${q}%`);
  }
  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (min) {
    sql += " AND price >= ?";
    params.push(min);
  }
  if (max) {
    sql += " AND price <= ?";
    params.push(max);
  }

  const rows = await db.all(sql, params);
  res.json(rows);
});

// Xoá listing
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.body; // axios.delete gửi qua `data`
  const db = await dbPromise;

  try {
    const listing = await db.get("SELECT sellerId FROM listings WHERE id = ?", [
      id,
    ]);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Chỉ admin hoặc seller của sản phẩm được xoá
    if (role !== "admin" && listing.sellerId !== userId)
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this listing" });

    await db.run("DELETE FROM listings WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete listing error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// 📝 Update listing
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { sellerId, title, description, category, price, condition, photos, role } = req.body;
  const db = await dbPromise;

  try {
    const existing = await db.get("SELECT sellerId FROM listings WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "Listing not found" });

    // 🔐 Chỉ cho phép admin hoặc seller chính sửa
    if (role !== "admin" && existing.sellerId !== sellerId) {
      return res.status(403).json({ error: "Unauthorized to edit this listing" });
    }

    await db.run(
      `UPDATE listings
       SET title = ?, description = ?, category = ?, price = ?, condition = ?, photos = ?
       WHERE id = ?`,
      [
        title,
        description,
        category,
        price,
        condition,
        JSON.stringify(photos || []),
        id,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update listing error:", err.message);
    res.status(500).json({ error: "Server error while updating listing" });
  }
});

// ================== ORDERS ==================
app.post("/orders", async (req, res) => {
  const { buyerId, items, paymentMethod, shippingInfo } = req.body;
  const db = await dbPromise;
  const total = (items || []).reduce(
    (sum, it) => sum + Number(it.price || 0) * (it.qty || 1),
    0
  );

  await db.run(
    "INSERT INTO orders (buyerId, items, total, paymentMethod, shippingInfo) VALUES (?, ?, ?, ?, ?)",
    [
      buyerId || null,
      JSON.stringify(items || []),
      total,
      paymentMethod || "mock",
      shippingInfo ? JSON.stringify(shippingInfo) : null,
    ]
  );

  res.json({ success: true, total });
});

// ================== START ==================
app.listen(4000, () =>
  console.log("✅ Backend running on http://localhost:4000")
);
//rm db.sqlite3
