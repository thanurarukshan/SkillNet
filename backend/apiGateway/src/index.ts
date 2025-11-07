import express, { Request, Response } from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
const PORT = 5000;
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth";

// Backend server URL
const BACKEND_BASE_URL = "http://localhost:5001";

// ✅ Allow requests from your frontend (localhost:3001)
app.use(cors({
  origin: "http://localhost:3001", // or "*" for all origins
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());


// ✅ Proxy route for /api/hello
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

// ✅ Proxy route for /api/db-test (database connectivity)
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

//-----------------------Auth related--------------------------------
// ✅ Proxy POST route: Sign Up
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

// ✅ Proxy POST route: Sign In
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

// from the student dashboard to get details
app.get("/api/getStudentInfo", verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization; // already verified
    const response = await fetch(`${BACKEND_BASE_URL}/api/getStudentInfo`, {
      headers: {
        Authorization: token!, // forward token to backend
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Gateway getStudentInfo error:", err);
    res.status(500).json({ error: "Failed to fetch student info" });
  }
});

app.get("/api/protected", verifyToken, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Welcome ${user.name}, you are a ${user.role}!` });
});


//-----------------------accept data from frontend-------------------------------
//add job
app.post("/api/addJob", async (req: Request, res: Response) => {
  console.log("Received form data at Gateway:", req.body);
  try {

    // const response = await fetch(`${BACKEND_BASE_URL}/api/addJob`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(req.body),
    // });

    // const data = await response.json();
    res.json(req.body);
  } catch (err) {
    console.error("Error forwarding request:", err);
    res.status(500).json({ error: "Backend POST failed" });
  }
});

//add Project
app.post("/api/addProject", async (req: Request, res: Response) => {
  console.log("Received form data at Gateway:", req.body);
  try {

    // const response = await fetch(`${BACKEND_BASE_URL}/api/addProject`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(req.body),
    // });

    // const data = await response.json();
    res.json(req.body);
  } catch (err) {
    console.error("Error forwarding request:", err);
    res.status(500).json({ error: "Backend POST failed" });
  }
});

//edit Profile
app.post("/api/editProfile", async (req: Request, res: Response) => {
  console.log("Received form data at Gateway:", req.body);
  try {

    // const response = await fetch(`${BACKEND_BASE_URL}/api/editProfile`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(req.body),
    // });

    // const data = await response.json();
    res.json(req.body);
  } catch (err) {
    console.error("Error forwarding request:", err);
    res.status(500).json({ error: "Backend POST failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on http://localhost:${PORT}`);
});