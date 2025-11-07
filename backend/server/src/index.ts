// import express, { Application, Request, Response } from "express";

// const app: Application = express();
// const PORT = process.env.PORT || 5001;

// app.use(express.json());

// // Sample route
// app.get("/api/hello", (req: Request, res: Response) => {
//   res.json({ message: "Hello from Express + TypeScript!" });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import mysql, { PoolOptions } from "mysql2/promise";
// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Validate environment variables at startup
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error("❌ Missing required database environment variables in .env file");
}

// Define pool options with non-optional strings
const dbConfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(express.json());

// Test route for database connectivity
app.get("/api/db-test", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SHOW TABLES");
    res.json({
      message: "✅ Database connection successful!",
      tables: rows,
    });
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      message: "❌ Database connection failed",
      error: error.message,
    });
  }
});

// Default route
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript!" });
});

// authentication and autherization
// 🧾 Sign Up Route
app.post("/api/signup", async (req: Request, res: Response) => {
  try {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO auth (category, name, username, password_hash) VALUES (?, ?, ?, ?)",
      [role, name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully." });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Email already exists." });
    } else {
      console.error("Signup Error:", err);
      res.status(500).json({ error: "Server error." });
    }
  }
});

// 🔐 Sign In Route
// app.post("/api/signin", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const [rows]: any = await pool.query(
//       "SELECT * FROM auth WHERE username = ?",
//       [email]
//     );

//     if (rows.length === 0) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     const user = rows[0];
//     const isMatch = await bcrypt.compare(password, user.password_hash);

//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.category,
//       },
//     });
//   } catch (err) {
//     console.error("Signin Error:", err);
//     res.status(500).json({ error: "Server error." });
//   }
// });

app.post("/api/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const [rows]: any = await pool.query("SELECT * FROM auth WHERE username = ?", [email]);

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // ✅ Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.category, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.category,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signin" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
