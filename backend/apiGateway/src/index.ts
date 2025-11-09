import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { verifyToken } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = 5000;

// Backend server URL
const BACKEND_BASE_URL = "http://localhost:5001";

// ✅ Allow requests from frontend
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

//-----------------------Test Routes--------------------------------
// Proxy route for /api/hello
app.get("/api/hello", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/hello`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error contacting backend:", err);
    res.status(500).json({ error: "Backend service unreachable" });
  }
});

// Proxy route for /api/db-test
app.get("/api/db-test", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/db-test`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error contacting backend:", err);
    res.status(500).json({ error: "Backend service unreachable" });
  }
});

//-----------------------Auth Routes--------------------------------
// Sign Up
app.post("/api/signup", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway Signup Error:", err);
    res.status(500).json({ error: "Gateway signup failed" });
  }
});

// Sign In
app.post("/api/signin", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway Signin Error:", err);
    res.status(500).json({ error: "Gateway signin failed" });
  }
});

// Protected Route
app.get("/api/protected", verifyToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Welcome ${user.name}, you are a ${user.role}!` });
});

//-----------------------Student Routes--------------------------------
// Get Student Info
app.get("/api/getStudentInfo", verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await fetch(`${BACKEND_BASE_URL}/api/getStudentInfo`, {
      headers: { Authorization: token!, "Content-Type": "application/json" },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway getStudentInfo error:", err);
    res.status(500).json({ error: "Failed to fetch student info" });
  }
});

// Edit Profile
app.put("/api/editProfile", verifyToken, async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const response = await axios.put(`${BACKEND_BASE_URL}/api/editProfile`, payload, {
      headers: { Authorization: req.headers.authorization! },
    });
    res.json(response.data);
  } catch (err: any) {
    console.error("Gateway EditProfile Error:", err.message);
    res.status(500).json({ error: "Gateway error" });
  }
});

//-----------------------Company Routes--------------------------------
// Get Company Info
app.get("/api/getCompanyInfo", verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await fetch(`${BACKEND_BASE_URL}/api/getCompanyInfo`, {
      headers: { Authorization: token!, "Content-Type": "application/json" },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway getCompanyInfo error:", err);
    res.status(500).json({ error: "Failed to fetch company info" });
  }
});

// Edit Company Profile
app.put("/api/editCompanyProfile", verifyToken, async (req: Request, res) => {
  try {
    const payload = req.body;
    const response = await axios.put(`${BACKEND_BASE_URL}/api/editCompanyProfile`, payload, {
      headers: { Authorization: req.headers.authorization! },
    });
    res.json(response.data);
  } catch (err: any) {
    console.error("Gateway EditCompanyProfile Error:", err.message);
    res.status(500).json({ error: "Gateway error" });
  }
});

// Add Job
app.post("/api/addJob", verifyToken, async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const response = await axios.post(`${BACKEND_BASE_URL}/api/addJob`, payload, {
      headers: { Authorization: req.headers.authorization! },
    });
    res.json(response.data);
  } catch (err: any) {
    console.error("Gateway addJob error:", err.message);
    res.status(500).json({ error: "Failed to add job" });
  }
});
//-----------------------SME Routes--------------------------------
// Get SME Info
app.get("/api/getSmeInfo", verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log("x:", token);
    // const response = await fetch(`${BACKEND_BASE_URL}/api/getSmeInfo`, {
    //   headers: { Authorization: token!, "Content-Type": "application/json" },
    // });
    // const data = await response.json();
    // res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway getSmeInfo error:", err);
    res.status(500).json({ error: "Failed to fetch Sme info" });
  }
});

// Add Project
app.post("/api/addProject", verifyToken, async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const response = await axios.put(`${BACKEND_BASE_URL}/api/addProject`, payload, {
      headers: { Authorization: req.headers.authorization! },
    });
    res.json(response.data);
  } catch (err: any) {
    console.error("Gateway addProject error:", err.message);
    res.status(500).json({ error: "Failed to add project" });
  }
});

//-----------------------Start Server--------------------------------
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on http://localhost:${PORT}`);
});
