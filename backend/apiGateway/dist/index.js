"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5000;
// Backend server URL
const BACKEND_BASE_URL = "http://localhost:5001";
// ✅ Allow requests from your frontend (localhost:3001)
app.use((0, cors_1.default)({
    origin: "http://localhost:3001", // or "*" for all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
// ✅ Proxy route for /api/hello
app.get("/api/hello", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/hello`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        console.error("Error contacting backend:", err);
        res.status(500).json({ error: "Backend service unreachable" });
    }
});
// ✅ Proxy route for /api/db-test (database connectivity)
app.get("/api/db-test", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/db-test`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        console.error("Error contacting backend:", err);
        res.status(500).json({ error: "Backend service unreachable" });
    }
});
//-----------------------Auth related--------------------------------
// ✅ Proxy POST route: Sign Up
app.post("/api/signup", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway Signup Error:", err);
        res.status(500).json({ error: "Gateway signup failed" });
    }
});
// ✅ Proxy POST route: Sign In
app.post("/api/signin", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway Signin Error:", err);
        res.status(500).json({ error: "Gateway signin failed" });
    }
});
//-----------------------accept data from frontend-------------------------------
//add job
app.post("/api/addJob", async (req, res) => {
    try {
        console.log("Received form data at Gateway:", req.body);
        // const response = await fetch(`${BACKEND_BASE_URL}/api/addJob`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(req.body),
        // });
        // const data = await response.json();
        // res.json(data);
    }
    catch (err) {
        console.error("Error forwarding request:", err);
        res.status(500).json({ error: "Backend POST failed" });
    }
});
//add Project
app.post("/api/addProject", async (req, res) => {
    try {
        console.log("Received form data at Gateway:", req.body);
        // const response = await fetch(`${BACKEND_BASE_URL}/api/addJob`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(req.body),
        // });
        // const data = await response.json();
        // res.json(data);
    }
    catch (err) {
        console.error("Error forwarding request:", err);
        res.status(500).json({ error: "Backend POST failed" });
    }
});
app.listen(PORT, () => {
    console.log(`🚪 API Gateway running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map