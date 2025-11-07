"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [roleTab, setRoleTab] = useState(0); // 0: Student, 1: SME, 2: Company
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const router = useRouter();

  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);
  const handleSignUpOpen = () => setOpenSignUp(true);
  const handleSignUpClose = () => setOpenSignUp(false);

  const getRole = () => {
    if (roleTab === 0) return "Student";
    if (roleTab === 1) return "SME";
    return "Company";
  };

  // ---------- SIGN UP ----------
  // const handleSignUp = async () => {
  //   const payload = {
  //     role: getRole(),
  //     name,
  //     email,
  //     password,
  //   };

  //   try {
  //     const res = await fetch("http://localhost:5000/api/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       alert("Signup successful! Please sign in.");
  //       setOpenSignUp(false);
  //       setOpenSignIn(true);
  //     } else {
  //       alert(data.error || "Signup failed.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error signing up.");
  //   }
  // };

  const handleSignUp = async () => {
    const payload: any = {
      role: getRole(),
      name,
      email,
      password,
    };

    // Only include for Students
    if (getRole() === "Student") {
      payload.department = department;
      payload.academicYear = academicYear;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Please sign in.");
        setOpenSignUp(false);
        setOpenSignIn(true);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error signing up.");
    }
  };


  // ---------- SIGN IN ----------
  const handleSignIn = async () => {
    const payload = {
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect based on role
        const role = data.user.role;
        if (role === "Student") router.push("/student");
        else if (role === "SME") router.push("/sme");
        else if (role === "Company") router.push("/companies");
      } else {
        alert(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Error signing in.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to SkillNet</h1>
        <p className="text-xl max-w-2xl mb-6">
          Connect students, SMEs, and large companies in one seamless platform for collaboration, projects, and opportunities.
        </p>
        <div className="flex space-x-4">
          <Button variant="contained" color="secondary" onClick={handleSignInOpen}>
            Sign In
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleSignUpOpen}>
            Sign Up
          </Button>
        </div>
      </section>

      {/* Sign In Dialog */}
      <Dialog open={openSignIn} onClose={handleSignInClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent className="space-y-4">
          <Tabs value={roleTab} onChange={(_, v) => setRoleTab(v)} variant="fullWidth">
            <Tab label="Student" />
            <Tab label="SME" />
            <Tab label="Company" />
          </Tabs>
          <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignInClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSignIn}>Sign In</Button>
        </DialogActions>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={openSignUp} onClose={handleSignUpClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent className="space-y-4">
          <Tabs value={roleTab} onChange={(_, v) => setRoleTab(v)} variant="fullWidth">
            <Tab label="Student" />
            <Tab label="SME" />
            <Tab label="Company" />
          </Tabs>
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* Only show for Students */}
          {getRole() === "Student" && (
            <>
              <TextField
                label="Department"
                fullWidth
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                label="Academic Year"
                fullWidth
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignUpClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSignUp}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
