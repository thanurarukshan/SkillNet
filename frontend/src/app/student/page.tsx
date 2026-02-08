"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Chip,
  Box,
  Stack,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Add, Groups } from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [unverifiedSkills, setUnverifiedSkills] = useState<string[]>([]);

  const [studentInfo, setStudentInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    department: "",
    academic_year: "",
  });

  const [teams] = useState([
    { id: 1, name: "Team Alpha", members: ["Alice", "Bob"] },
    { id: 2, name: "Team Beta", members: ["John", "Alex"] },
  ]);

  const [jobs] = useState([
    { id: 1, company: "Google", position: "Frontend Intern" },
    { id: 2, company: "Microsoft", position: "Backend Intern" },
  ]);

  useEffect(() => {
    fetchStudentInfo();
    fetchStudentSkills();
  }, []);

  const fetchStudentInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/getStudentInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setStudentInfo(data.user);
      } else {
        console.error("Error fetching student info:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentInfo.name,
          department: studentInfo.department,
          academic_year: studentInfo.academic_year,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEdit(false);
        fetchStudentInfo();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  const fetchStudentSkills = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/getStudentSkills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setVerifiedSkills(data.verified_skills || []);
        setUnverifiedSkills(data.unverified_skills || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert("Please enter a skill name");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/addSkill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill: newSkill.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewSkill("");
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to add skill");
      }
    } catch (err) {
      console.error("Error adding skill:", err);
      alert("Error adding skill");
    }
  };

  const handleVerifySkill = async (skill: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/verifySkill", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to verify skill");
      }
    } catch (err) {
      console.error("Error verifying skill:", err);
      alert("Error verifying skill");
    }
  };

  const handleRemoveSkill = async (skill: string, type: "verified" | "unverified") => {
    if (!confirm(`Are you sure you want to remove "${skill}"?`)) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/removeSkill", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill, type }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to remove skill");
      }
    } catch (err) {
      console.error("Error removing skill:", err);
      alert("Error removing skill");
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <Typography variant="h5">Loading...</Typography>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* HEADER BAR */}
      <AppBar position="static" sx={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            SkillNet - Student Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => router.push("/student")}
            sx={{ mr: 2, fontWeight: "bold" }}
          >
            Dashboard
          </Button>
          <UserMenu
            userName={studentInfo.name}
            onProfileUpdate={() => setOpenEdit(true)}
          />
        </Toolbar>
      </AppBar>

      <Box p={4}>
        {/* PROFILE CARD */}
        <Card sx={{ maxWidth: 900, mx: "auto", mb: 4, p: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src="" sx={{ width: 80, height: 80, bgcolor: "#6366f1" }}>
                {studentInfo.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {studentInfo.name}
                </Typography>
                <Typography color="text.secondary">{studentInfo.username}</Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Department:</strong> {studentInfo.department || "N/A"} |{" "}
                  <strong>Year:</strong> {studentInfo.academic_year || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mb: 3 }}>
          <Tab label="Skills" />
          <Tab label="Teams" />
          <Tab label="Jobs" />
        </Tabs>

        {/* SKILLS TAB - Complete Implementation */}
        {tabIndex === 0 && (
          <Box>
            {/* Add Skill Section */}
            <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, p: 3 }}>
              <Typography variant="h6" mb={2}>
                Add New Skill
              </Typography>
              <Stack direction="row" gap={2}>
                <TextField
                  label="Skill Name"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., React, Python, Machine Learning"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddSkill();
                  }}
                />
                <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill}>
                  Add
                </Button>
              </Stack>
            </Card>

            {/* Verified Skills */}
            <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, p: 3 }}>
              <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center" }}>
                ✓ Verified Skills
                <Chip label={verifiedSkills.length} size="small" sx={{ ml: 2 }} color="success" />
              </Typography>
              {verifiedSkills.length > 0 ? (
                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  {verifiedSkills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      color="success"
                      onDelete={() => handleRemoveSkill(skill, "verified")}
                      sx={{ fontSize: "0.95rem", height: "32px" }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No verified skills yet. Verify skills from the unverified list below.
                </Typography>
              )}
            </Card>

            {/* Unverified Skills */}
            <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, p: 3 }}>
              <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center" }}>
                ⏳ Unverified Skills
                <Chip label={unverifiedSkills.length} size="small" sx={{ ml: 2 }} color="warning" />
              </Typography>
              {unverifiedSkills.length > 0 ? (
                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  {unverifiedSkills.map((skill, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "warning.main",
                        borderRadius: "16px",
                        px: 1.5,
                        py: 0.5,
                        gap: 1,
                        backgroundColor: "#fff8e1"
                      }}
                    >
                      <Typography sx={{ fontSize: "0.875rem", color: "text.primary" }}>
                        {skill}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleVerifySkill(skill)}
                        sx={{
                          minWidth: "auto",
                          px: 1,
                          py: 0.25,
                          fontSize: "0.7rem",
                          height: "24px",
                          textTransform: "none"
                        }}
                      >
                        ✓
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleRemoveSkill(skill, "unverified")}
                        sx={{
                          minWidth: "auto",
                          px: 0.5,
                          py: 0.25,
                          fontSize: "0.75rem",
                          height: "24px"
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No unverified skills. Add new skills above.
                </Typography>
              )}
            </Card>

            {/* Skills Info */}
            <Card sx={{ maxWidth: 900, mx: "auto", p: 2, bgcolor: "#f0f9ff" }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Tip:</strong> Verify your skills to improve team recommendations and increase your visibility to employers.
              </Typography>
            </Card>
          </Box>
        )}

        {/* TEAMS TAB - Navigate to Teams Page */}
        {tabIndex === 1 && (
          <Box textAlign="center">
            <Card sx={{ maxWidth: 600, mx: "auto", p: 6 }}>
              <Groups sx={{ fontSize: 100, color: "#6366f1", mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Team Management
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Find teams, create your own, manage members, and get AI-powered recommendations based on your skills.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Groups />}
                onClick={() => router.push("/student/teams")}
                fullWidth
              >
                Go to Teams
              </Button>
            </Card>
          </Box>
        )}

        {/* JOBS */}
        {tabIndex === 2 && (
          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3}>
            {jobs.map((j) => (
              <Card key={j.id} sx={{ width: 260, p: 2 }}>
                <Typography variant="h6">{j.company}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {j.position}
                </Typography>
                <Stack direction="row" gap={2} mt={2}>
                  <Button variant="contained" color="success" fullWidth>
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" fullWidth>
                    Reject
                  </Button>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* EDIT PROFILE */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
            />
            <TextField
              label="Department"
              fullWidth
              value={studentInfo.department}
              onChange={(e) => setStudentInfo({ ...studentInfo, department: e.target.value })}
            />
            <TextField
              label="Academic Year"
              fullWidth
              value={studentInfo.academic_year}
              onChange={(e) => setStudentInfo({ ...studentInfo, academic_year: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
