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
import { Add } from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);

  const [studentInfo, setStudentInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    department: "",
    academic_year: "",
  });

  const [skills, setSkills] = useState([
    { name: "React" },
    { name: "Node.js" },
  ]);

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

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill }]);
      setNewSkill("");
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

        {/* SKILLS */}
        {tabIndex === 0 && (
          <Box textAlign="center">
            <Stack direction="row" justifyContent="center" gap={2} flexWrap="wrap" mb={3}>
              {skills.map((s, idx) => (
                <Chip key={idx} label={s.name} color="primary" />
              ))}
            </Stack>

            <Stack direction="row" justifyContent="center" gap={2}>
              <TextField
                label="New Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                size="small"
              />
              <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill}>
                Add
              </Button>
            </Stack>
          </Box>
        )}

        {/* TEAMS */}
        {tabIndex === 1 && (
          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3}>
            {teams.map((t) => (
              <Card key={t.id} sx={{ width: 260, p: 2 }}>
                <Typography variant="h6">{t.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.members.join(", ")}
                </Typography>
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  Join
                </Button>
              </Card>
            ))}
          </Stack>
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
