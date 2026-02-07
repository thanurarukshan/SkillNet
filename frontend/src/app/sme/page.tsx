"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Stack,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

export default function SmeDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [smeInfo, setSmeInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    company_registration_no: "",
    industry: "",
    business_type: "",
  });

  interface Project {
    name?: string;
    skills?: string;
    deadline?: string;
    [key: string]: string | undefined;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({});

  const projectFields = [
    { name: "name", label: "Project Name" },
    { name: "skills", label: "Required Skills" },
    { name: "deadline", label: "Deadline", type: "date" },
  ];

  useEffect(() => {
    fetchSmeInfo();
  }, []);

  const fetchSmeInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/getSmeInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setSmeInfo(data.user);
      } else {
        console.error("Error fetching SME info:", data.error);
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
          name: smeInfo.name,
          company_registration_no: smeInfo.company_registration_no,
          industry: smeInfo.industry,
          business_type: smeInfo.business_type,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEdit(false);
        fetchSmeInfo();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  const handleSubmit = () => {
    setProjects([...projects, newProject]);
    setNewProject({});
    setOpenCreate(false);
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
            SkillNet - SME Dashboard
          </Typography>
          <UserMenu
            userName={smeInfo.name}
            onProfileUpdate={() => setOpenEdit(true)}
          />
        </Toolbar>
      </AppBar>

      <Box p={4}>
        {/* PROFILE CARD */}
        <Card sx={{ maxWidth: 900, mx: "auto", mb: 4, p: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#6366f1" }}>
                {smeInfo.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {smeInfo.name}
                </Typography>
                <Typography color="text.secondary">{smeInfo.username}</Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Registration No:</strong> {smeInfo.company_registration_no || "N/A"} |{" "}
                  <strong>Industry:</strong> {smeInfo.industry || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Business Type:</strong> {smeInfo.business_type || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mb: 3 }}>
          <Tab label="Projects" />
          <Tab label="Settings" />
        </Tabs>

        {/* PROJECTS */}
        {tabIndex === 0 && (
          <Stack spacing={3} alignItems="center">
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>
              Create Project
            </Button>

            {projects.map((p, i) => (
              <Card key={i} sx={{ width: 500, p: 2 }}>
                <Typography variant="h6">{p.name}</Typography>
                <Typography>Skills: {p.skills}</Typography>
                <Typography>Deadline: {p.deadline}</Typography>
              </Card>
            ))}
          </Stack>
        )}

        {/* SETTINGS */}
        {tabIndex === 1 && (
          <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
            <Typography variant="h6">Settings</Typography>
            <Typography color="text.secondary">Settings panel coming soon...</Typography>
          </Card>
        )}
      </Box>

      {/* EDIT PROFILE */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit SME Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={smeInfo.name}
              onChange={(e) => setSmeInfo({ ...smeInfo, name: e.target.value })}
            />
            <TextField
              label="Registration Number"
              fullWidth
              value={smeInfo.company_registration_no}
              onChange={(e) => setSmeInfo({ ...smeInfo, company_registration_no: e.target.value })}
            />
            <TextField
              label="Industry"
              fullWidth
              value={smeInfo.industry}
              onChange={(e) => setSmeInfo({ ...smeInfo, industry: e.target.value })}
            />
            <TextField
              label="Business Type"
              fullWidth
              value={smeInfo.business_type}
              onChange={(e) => setSmeInfo({ ...smeInfo, business_type: e.target.value })}
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

      {/* CREATE PROJECT */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          {projectFields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              type={f.type || "text"}
              fullWidth
              margin="dense"
              InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
              value={newProject[f.name] || ""}
              onChange={(e) => setNewProject({ ...newProject, [f.name]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
