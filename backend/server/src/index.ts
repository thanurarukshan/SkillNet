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
  throw new Error("Missing required database environment variables in .env file");
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
      message: "Database connection successful!",
      tables: rows,
    });
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      message: "Database connection failed",
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
// app.post("/api/signup", async (req: Request, res: Response) => {
//   try {
//     const { role, name, email, password } = req.body;

//     if (!role || !name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await pool.query(
//       "INSERT INTO auth (category, name, username, password_hash) VALUES (?, ?, ?, ?)",
//       [role, name, email, hashedPassword]
//     );

//     res.json({ message: "User registered successfully." });
//   } catch (err: any) {
//     if (err.code === "ER_DUP_ENTRY") {
//       res.status(400).json({ error: "Email already exists." });
//     } else {
//       console.error("Signup Error:", err);
//       res.status(500).json({ error: "Server error." });
//     }
//   }
// });
// 🧾 Sign Up Route - Enhanced for Role-Based Registration
app.post("/api/signup", async (req: Request, res: Response) => {
  try {
    const {
      role,
      name,
      email,
      password,
      department,
      academicYear,
      companyRegistrationNo,
      companyType,
      industry,
      businessType
    } = req.body;

    // Validate required fields
    if (!role || !name || !email || !password) {
      return res.status(400).json({ error: "Role, name, email, and password are required." });
    }

    // Role-specific validation
    if (role === "Company") {
      if (!companyRegistrationNo || !companyType || !industry) {
        return res.status(400).json({
          error: "Company registration number, company type, and industry are required for companies."
        });
      }
    } else if (role === "SME") {
      if (!companyRegistrationNo || !industry || !businessType) {
        return res.status(400).json({
          error: "Registration number, industry, and business type are required for SMEs."
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into MySQL with role-specific fields
    const [result] = await pool.query(
      `INSERT INTO auth (
        category, 
        name, 
        department, 
        academic_year, 
        username, 
        password_hash,
        company_registration_no,
        company_type,
        industry,
        business_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        role,
        name,
        role === "Student" ? department || null : null,
        role === "Student" ? academicYear || null : null,
        email,
        hashedPassword,
        (role === "Company" || role === "SME") ? companyRegistrationNo || null : null,
        role === "Company" ? companyType || null : null,
        (role === "Company" || role === "SME") ? industry || null : null,
        role === "SME" ? businessType || null : null
      ]
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

// from student dashboard to get details
app.get("/api/getStudentInfo", async (req: Request, res: Response) => {
  try {
    // ✅ Extract and verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ✅ Fetch user data from DB (except password)
    const [rows]: any = await pool.query(
      "SELECT id, name, category AS role, department, academic_year, username FROM auth WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Error fetching student info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Edit Profile - Generic for all roles
app.put("/api/editProfile", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const {
      name,
      department,
      academic_year,
      company_registration_no,
      company_type,
      industry,
      business_type
    } = req.body;

    // Update all fields that are provided
    const [result]: any = await pool.query(
      `UPDATE auth SET 
        name = ?, 
        department = ?, 
        academic_year = ?,
        company_registration_no = ?,
        company_type = ?,
        industry = ?,
        business_type = ?
      WHERE id = ?`,
      [
        name || null,
        department || null,
        academic_year || null,
        company_registration_no || null,
        company_type || null,
        industry || null,
        business_type || null,
        decoded.id
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("EditProfile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Change Password
app.put("/api/changePassword", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    // Fetch current password hash
    const [rows]: any = await pool.query(
      "SELECT password_hash FROM auth WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE auth SET password_hash = ? WHERE id = ?",
      [hashedNewPassword, decoded.id]
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("ChangePassword Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User Account
app.delete("/api/deleteUser", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Delete user (cascade will handle related data)
    const [result]: any = await pool.query(
      "DELETE FROM auth WHERE id = ?",
      [decoded.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("DeleteUser Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// from sme dashboard to get details
app.get("/api/getSmeInfo", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Fetch SME data from DB
    const [rows]: any = await pool.query(
      `SELECT id, name, category AS role, username, 
       company_registration_no, industry, business_type, created_at 
       FROM auth WHERE id = ?`,
      [decoded.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Error fetching SME info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// from company dashboard to get details
app.get("/api/getCompanyInfo", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Fetch Company data from DB
    const [rows]: any = await pool.query(
      `SELECT id, name, category AS role, username,
       company_registration_no, company_type, industry, created_at 
       FROM auth WHERE id = ?`,
      [decoded.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Error fetching company info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/addProject", async (req: Request, res: Response) => {
  console.log("AddProject:", req.body);
  console.log("AddProject:1", req.headers.authorization);
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    console.log("AddProject:2");
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET not set");
    console.log("AddProject:3");
    const decoded: any = jwt.verify(token, jwtSecret);

    // const { name, department, acadamic_year } = req.body;

    // const [result]: any = await pool.query(
    //   "UPDATE auth SET name = ?, department = ?, acadamic_year = ? WHERE id = ?",
    //   [name, department, acadamic_year, decoded.id]
    // );

    // if (result.affectedRows === 0)
    //   return res.status(404).json({ error: "User not found" });
    console.log("AddProject:4");
    res.json({ message: "Project created successfully" });
  } catch (err) {
    console.error("AddProject Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
