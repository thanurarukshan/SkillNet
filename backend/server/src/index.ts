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

// =====================================================
// SKILL MANAGEMENT ENDPOINTS
// =====================================================

// Get Student Skills
app.get("/api/getStudentSkills", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const [rows]: any = await pool.query(
      "SELECT unverified_skills, verified_skills, updated_at FROM skills WHERE student_id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      // No skills record yet, return empty arrays
      return res.json({
        unverified_skills: [],
        verified_skills: [],
        updated_at: null
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GetStudentSkills Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add Skill (to unverified list)
app.post("/api/addSkill", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { skill } = req.body;

    if (!skill || typeof skill !== "string") {
      return res.status(400).json({ error: "Skill name is required" });
    }

    // Check if skills record exists
    const [existing]: any = await pool.query(
      "SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?",
      [decoded.id]
    );

    if (!existing.length) {
      // Create new skills record
      await pool.query(
        "INSERT INTO skills (student_id, unverified_skills, verified_skills) VALUES (?, ?, ?)",
        [decoded.id, JSON.stringify([skill]), JSON.stringify([])]
      );
    } else {
      // Update existing record
      const unverified = existing[0].unverified_skills || [];
      const verified = existing[0].verified_skills || [];

      // Check if skill already exists in either list
      if (unverified.includes(skill) || verified.includes(skill)) {
        return res.status(400).json({ error: "Skill already exists" });
      }

      unverified.push(skill);
      await pool.query(
        "UPDATE skills SET unverified_skills = ? WHERE student_id = ?",
        [JSON.stringify(unverified), decoded.id]
      );
    }

    res.json({ message: "Skill added successfully" });
  } catch (err) {
    console.error("AddSkill Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Verify Skill (move from unverified to verified)
app.put("/api/verifySkill", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ error: "Skill name is required" });
    }

    const [rows]: any = await pool.query(
      "SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "No skills found" });
    }

    const unverified = rows[0].unverified_skills || [];
    const verified = rows[0].verified_skills || [];

    // Check if skill exists in unverified list
    const index = unverified.indexOf(skill);
    if (index === -1) {
      return res.status(400).json({ error: "Skill not found in unverified list" });
    }

    // Move skill from unverified to verified
    unverified.splice(index, 1);
    verified.push(skill);

    await pool.query(
      "UPDATE skills SET unverified_skills = ?, verified_skills = ? WHERE student_id = ?",
      [JSON.stringify(unverified), JSON.stringify(verified), decoded.id]
    );

    res.json({ message: "Skill verified successfully" });
  } catch (err) {
    console.error("VerifySkill Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove Skill
app.delete("/api/removeSkill", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { skill, type } = req.body; // type: 'verified' or 'unverified'

    if (!skill || !type) {
      return res.status(400).json({ error: "Skill name and type are required" });
    }

    const [rows]: any = await pool.query(
      "SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "No skills found" });
    }

    const unverified = rows[0].unverified_skills || [];
    const verified = rows[0].verified_skills || [];

    if (type === "verified") {
      const index = verified.indexOf(skill);
      if (index === -1) {
        return res.status(400).json({ error: "Skill not found in verified list" });
      }
      verified.splice(index, 1);
    } else {
      const index = unverified.indexOf(skill);
      if (index === -1) {
        return res.status(400).json({ error: "Skill not found in unverified list" });
      }
      unverified.splice(index, 1);
    }

    await pool.query(
      "UPDATE skills SET unverified_skills = ?, verified_skills = ? WHERE student_id = ?",
      [JSON.stringify(unverified), JSON.stringify(verified), decoded.id]
    );

    res.json({ message: "Skill removed successfully" });
  } catch (err) {
    console.error("RemoveSkill Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================================================
// TEAM MANAGEMENT ENDPOINTS
// =====================================================

// Create Team
app.post("/api/createTeam", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamName, memberCount, skillsRequired } = req.body;

    if (!teamName || !memberCount) {
      return res.status(400).json({ error: "Team name and member count are required" });
    }

    // Auto-add team leader to current_members
    const currentMembers = [{ id: decoded.id, name: decoded.name, role: "leader" }];

    const [result]: any = await pool.query(
      `INSERT INTO teams (t_name, team_leader_id, member_count, current_members, t_skills_req) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        teamName,
        decoded.id,
        memberCount,
        JSON.stringify(currentMembers),
        JSON.stringify(skillsRequired || [])
      ]
    );

    res.json({
      message: "Team created successfully",
      teamId: result.insertId
    });
  } catch (err) {
    console.error("CreateTeam Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get My Teams
app.get("/api/getMyTeams", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const [rows]: any = await pool.query(
      `SELECT t.*, a.name as leader_name 
       FROM teams t
       JOIN auth a ON t.team_leader_id = a.id
       WHERE t.team_leader_id = ? OR JSON_CONTAINS(t.current_members, ?, '$')`,
      [decoded.id, JSON.stringify({ id: decoded.id })]
    );

    res.json({ teams: rows });
  } catch (err) {
    console.error("GetMyTeams Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Team Details
app.get("/api/getTeamDetails/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;

    const [rows]: any = await pool.query(
      `SELECT t.*, a.name as leader_name 
       FROM teams t
       JOIN auth a ON t.team_leader_id = a.id
       WHERE t.t_id = ?`,
      [teamId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Get pending join requests for this team (if user is leader)
    let pendingRequests = [];
    if (rows[0].team_leader_id === decoded.id) {
      const [requests]: any = await pool.query(
        `SELECT r.*, a.name as student_name, a.username as student_email
         FROM team_join_requests r
         JOIN auth a ON r.student_id = a.id
         WHERE r.team_id = ? AND r.status = 'pending'`,
        [teamId]
      );
      pendingRequests = requests;
    }

    res.json({
      team: rows[0],
      pendingRequests,
      isLeader: rows[0].team_leader_id === decoded.id
    });
  } catch (err) {
    console.error("GetTeamDetails Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Team (leader only)
app.put("/api/updateTeam/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;
    const { teamName, memberCount } = req.body;

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can update team" });
    }

    await pool.query(
      "UPDATE teams SET t_name = ?, member_count = ? WHERE t_id = ?",
      [teamName, memberCount, teamId]
    );

    res.json({ message: "Team updated successfully" });
  } catch (err) {
    console.error("UpdateTeam Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Team (leader only)
app.delete("/api/deleteTeam/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can delete team" });
    }

    await pool.query("DELETE FROM teams WHERE t_id = ?", [teamId]);

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("DeleteTeam Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove Member from Team (leader only)
app.put("/api/removeMember/:teamId/:studentId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId, studentId } = req.params;

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id, current_members FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can remove members" });
    }

    // Remove member from current_members
    const members = team[0].current_members || [];
    const updatedMembers = members.filter((m: any) => m.id !== parseInt(studentId));

    await pool.query(
      "UPDATE teams SET current_members = ? WHERE t_id = ?",
      [JSON.stringify(updatedMembers), teamId]
    );

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("RemoveMember Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Leave Team
app.post("/api/leaveTeam/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;

    const [team]: any = await pool.query(
      "SELECT team_leader_id, current_members FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id === decoded.id) {
      return res.status(400).json({ error: "Team leader cannot leave team. Delete team instead." });
    }

    // Remove user from current_members
    const members = team[0].current_members || [];
    const updatedMembers = members.filter((m: any) => m.id !== decoded.id);

    await pool.query(
      "UPDATE teams SET current_members = ? WHERE t_id = ?",
      [JSON.stringify(updatedMembers), teamId]
    );

    res.json({ message: "Left team successfully" });
  } catch (err) {
    console.error("LeaveTeam Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================================================
// TEAM DISCOVERY ENDPOINTS
// =====================================================

// Search Teams
app.get("/api/searchTeams", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const { query, type } = req.query; // type: 'name' or 'skills'

    let sql = `SELECT t.*, a.name as leader_name 
               FROM teams t
               JOIN auth a ON t.team_leader_id = a.id`;

    const params: any[] = [];

    if (query && type === "name") {
      sql += " WHERE t.t_name LIKE ?";
      params.push(`%${query}%`);
    } else if (query && type === "skills") {
      // Support multiple skills separated by comma
      const skillsArray = String(query).split(',').map(s => s.trim().toLowerCase()).filter(s => s);

      if (skillsArray.length > 0) {
        // Build WHERE clause to match any of the provided skills
        const conditions = skillsArray.map(() => "LOWER(t.t_skills_req) LIKE ?").join(" OR ");
        sql += ` WHERE (${conditions})`;

        // Add parameters for each skill
        skillsArray.forEach(skill => {
          params.push(`%${skill}%`);
        });
      }
    }

    sql += " ORDER BY t.created_at DESC LIMIT 50";

    const [rows]: any = await pool.query(sql, params);

    res.json({ teams: rows });
  } catch (err) {
    console.error("SearchTeams Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Request to Join Team
app.post("/api/requestJoinTeam/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;

    // Check if team exists
    const [team]: any = await pool.query(
      "SELECT * FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if already a member
    const members = team[0].current_members || [];
    if (members.some((m: any) => m.id === decoded.id)) {
      return res.status(400).json({ error: "Already a member of this team" });
    }

    // Check if team is full
    if (members.length >= team[0].member_count) {
      return res.status(400).json({ error: "Team is full" });
    }

    // Create join request
    await pool.query(
      "INSERT INTO team_join_requests (team_id, student_id, status) VALUES (?, ?, 'pending')",
      [teamId, decoded.id]
    );

    res.json({ message: "Join request sent successfully" });
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Join request already exists" });
    }
    console.error("RequestJoinTeam Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Team Join Requests (leader only)
app.get("/api/getTeamRequests/:teamId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { teamId } = req.params;

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id FROM teams WHERE t_id = ?",
      [teamId]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can view requests" });
    }

    const [rows]: any = await pool.query(
      `SELECT r.*, a.name as student_name, a.username as student_email
       FROM team_join_requests r
       JOIN auth a ON r.student_id = a.id
       WHERE r.team_id = ? AND r.status = 'pending'`,
      [teamId]
    );

    res.json({ requests: rows });
  } catch (err) {
    console.error("GetTeamRequests Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Approve Join Request (leader only)
app.put("/api/approveRequest/:requestId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { requestId } = req.params;

    // Get request details
    const [request]: any = await pool.query(
      `SELECT r.*, a.name as student_name
       FROM team_join_requests r
       JOIN auth a ON r.student_id = a.id
       WHERE r.id = ?`,
      [requestId]
    );

    if (!request.length) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id, current_members, member_count FROM teams WHERE t_id = ?",
      [request[0].team_id]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can approve requests" });
    }

    // Check if team is full
    const members = team[0].current_members || [];
    if (members.length >= team[0].member_count) {
      return res.status(400).json({ error: "Team is full" });
    }

    // Add student to team
    members.push({
      id: request[0].student_id,
      name: request[0].student_name,
      role: "member"
    });

    await pool.query(
      "UPDATE teams SET current_members = ? WHERE t_id = ?",
      [JSON.stringify(members), request[0].team_id]
    );

    // Update request status
    await pool.query(
      "UPDATE team_join_requests SET status = 'approved' WHERE id = ?",
      [requestId]
    );

    res.json({ message: "Request approved successfully" });
  } catch (err) {
    console.error("ApproveRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reject Join Request (leader only)
app.put("/api/rejectRequest/:requestId", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { requestId } = req.params;

    // Get request details
    const [request]: any = await pool.query(
      "SELECT * FROM team_join_requests WHERE id = ?",
      [requestId]
    );

    if (!request.length) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Verify user is team leader
    const [team]: any = await pool.query(
      "SELECT team_leader_id FROM teams WHERE t_id = ?",
      [request[0].team_id]
    );

    if (!team.length) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team[0].team_leader_id !== decoded.id) {
      return res.status(403).json({ error: "Only team leader can reject requests" });
    }

    // Update request status
    await pool.query(
      "UPDATE team_join_requests SET status = 'rejected' WHERE id = ?",
      [requestId]
    );

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    console.error("RejectRequest Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =====================================================
// ML RECOMMENDATION ENDPOINT
// =====================================================

// Get Team Recommendations
app.get("/api/getTeamRecommendations", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Get student's verified skills
    const [skillsRow]: any = await pool.query(
      "SELECT verified_skills FROM skills WHERE student_id = ?",
      [decoded.id]
    );

    if (!skillsRow.length || !skillsRow[0].verified_skills || skillsRow[0].verified_skills.length === 0) {
      return res.json({
        recommendations: [],
        message: "No verified skills found. Add and verify skills to get recommendations."
      });
    }

    const verifiedSkills = skillsRow[0].verified_skills.join(" ");

    // Validate ML service availability
    const mlApiUrl = process.env.ML_API_URL || "http://localhost:5002";
    await fetch(`${mlApiUrl}/ml/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: verifiedSkills,
        top_n: 5,
        min_similarity: 0.1
      })
    });

    // Process recommendations
    const userSkills = skillsRow[0].verified_skills.map((s: string) => s.toLowerCase());
    const [teams]: any = await pool.query(
      "SELECT t.*, a.name as leader_name FROM teams t JOIN auth a ON t.team_leader_id = a.id ORDER BY t.created_at DESC LIMIT 50"
    );

    const processed = teams.map((t: any) => {
      let teamSkills: string[] = [];
      if (typeof t.t_skills_req === 'string') {
        try {
          teamSkills = JSON.parse(t.t_skills_req);
        } catch {
          teamSkills = t.t_skills_req.split(',').map((s: string) => s.trim());
        }
      } else if (Array.isArray(t.t_skills_req)) {
        teamSkills = t.t_skills_req;
      }

      const tSkills = teamSkills.map(s => s.toLowerCase());
      const overlaps = userSkills.filter((us: string) =>
        tSkills.some(ts => ts.includes(us) || us.includes(ts))
      ).length;

      return {
        ...t,
        similarity_score: overlaps / Math.max(tSkills.length, userSkills.length),
        _c: overlaps
      };
    }).filter((t: any) => t._c > 0)
      .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
      .slice(0, 5)
      .map(({ _c, ...rest }: any) => rest);

    res.json({
      student_skills: verifiedSkills,
      recommendations: processed,
      total_evaluated: teams.length
    });
  } catch (err) {
    console.error("GetTeamRecommendations Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
