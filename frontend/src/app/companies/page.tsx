"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

export default function CompanyDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    company_registration_no: "",
    company_type: "",
    industry: "",
  });

  interface Job {
    name?: string;
    skills?: string;
    expLevel?: string;
    [key: string]: string | undefined;
  }

  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>({});

  const formFields = [
    { name: "name", label: "Job Name", type: "text" },
    { name: "skills", label: "Required Skills", type: "text" },
    { name: "expLevel", label: "Experience Level", type: "text" },
  ];

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/getCompanyInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setCompanyInfo(data.user);
      } else {
        console.error("Error fetching company info:", data.error);
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
          name: companyInfo.name,
          company_registration_no: companyInfo.company_registration_no,
          company_type: companyInfo.company_type,
          industry: companyInfo.industry,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEdit(false);
        fetchCompanyInfo();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  const handleSubmit = () => {
    setJobs([...jobs, newJob]);
    setNewJob({});
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
            SkillNet - Company Dashboard
          </Typography>
          <UserMenu
            userName={companyInfo.name}
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
                {companyInfo.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {companyInfo.name}
                </Typography>
                <Typography color="text.secondary">{companyInfo.username}</Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Registration No:</strong> {companyInfo.company_registration_no || "N/A"} |{" "}
                  <strong>Type:</strong> {companyInfo.company_type || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Industry:</strong> {companyInfo.industry || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mb: 3 }}>
          <Tab label="Jobs" />
          <Tab label="Settings" />
        </Tabs>

        {/* JOBS */}
        {tabIndex === 0 && (
          <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Job Listings</Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => setOpenCreate(true)}
              >
                Post Job
              </Button>
            </Stack>

            <List>
              {jobs.map((job, index) => (
                <ListItem key={index} divider disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={job.name}
                      secondary={`Skills: ${job.skills} | Level: ${job.expLevel}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Card>
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
        <DialogTitle>Edit Company Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company Name"
              fullWidth
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            />
            <TextField
              label="Registration Number"
              fullWidth
              value={companyInfo.company_registration_no}
              onChange={(e) => setCompanyInfo({ ...companyInfo, company_registration_no: e.target.value })}
            />
            <TextField
              select
              label="Company Type"
              fullWidth
              value={companyInfo.company_type}
              onChange={(e) => setCompanyInfo({ ...companyInfo, company_type: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select Company Type</option>
              <option value="Pvt.Ltd">Private Limited (Pvt. Ltd.)</option>
              <option value="LLP">Limited Liability Partnership (LLP)</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </TextField>
            <TextField
              label="Industry"
              fullWidth
              value={companyInfo.industry}
              onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
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

      {/* CREATE JOB */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              type={field.type}
              fullWidth
              value={newJob[field.name] || ""}
              onChange={(e) => setNewJob({ ...newJob, [field.name]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Post Job
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
