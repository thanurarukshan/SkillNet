"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";

export default function CompanyDashboard() {
  const title = "Company Dashboard";
  const panelName = "Jobs";
  const formFields = [
    { name: "name", label: "Job Name", type: "text" },
    { name: "skills", label: "Required Skills", type: "text" },
    { name: "expLevel", label: "Experience Level", type: "text" },
  ];

  // --- States ---
  const [tabIndex, setTabIndex] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetails, setOpenDetails] = useState<null | number>(null);
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);

  // --- Fetch Company Info ---
  const fetchCompanyInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found. Please log in again.");

    try {
      const res = await fetch("http://localhost:5000/api/getStudentInfo", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setCompanyInfo(data.user);
        setProfileEdit(data.user);
      } else {
        console.error("Error fetching profile:", data.error);
        alert(data.error || "Failed to fetch company profile");
      }
    } catch (err) {
      console.error("Error fetching company profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  // --- Handle Profile Edit ---
  const handleProfileChange = (field: string, value: string) =>
    setProfileEdit({ ...profileEdit, [field]: value });

  const handleProfileSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found.");

    try {
      const res = await fetch("http://localhost:5000/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileEdit),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Company profile updated successfully!");
        setCompanyInfo(profileEdit);
        setOpenEditProfile(false);
      } else {
        alert(data.error || "Failed to update company profile");
      }
    } catch (err) {
      console.error("Error updating company profile:", err);
    }
  };

  // --- Job Handling ---
  const handleChange = (field: string, value: string) =>
    setNewItem({ ...newItem, [field]: value });

  const handleSubmit = async () => {
    if (!newItem[formFields[0].name]) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("No token found.");

    try {
      const res = await fetch("http://localhost:5000/api/addJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Job added:", data.message);
        setItems([...items, newItem]);
        setNewItem({});
        setOpenCreate(false);
      } else {
        alert(data.error || "Failed to add job");
      }
    } catch (err) {
      console.error("Error sending to API Gateway:", err);
    }
  };

  const handleUpdate = () => {
    if (openDetails === null) return;
    const updated = [...items];
    updated[openDetails] = newItem;
    setItems(updated);
    setEditMode(false);
  };

  // Mock students (applicants)
  const students = [
    { name: "Alice", skills: "React, Node.js" },
    { name: "Bob", skills: "Python, ML" },
    { name: "Charlie", skills: "UI/UX, Figma" },
  ];

  if (loading)
    return (
      <main className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">{title}</h1>

      {/* --- Company Info Card --- */}
      {companyInfo && (
        <Card className="mb-6 max-w-3xl mx-auto">
          <CardContent>
            {Object.entries(companyInfo).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                <strong>{key}:</strong> {String(value)}
              </Typography>
            ))}
            <div className="flex justify-end mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenEditProfile(true)}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        centered
        className="mb-6"
      >
        <Tab label={panelName} />
        <Tab label="Settings" />
      </Tabs>

      {/* Jobs Panel */}
      {tabIndex === 0 && (
        <Grid container justifyContent="center">
          <Card className="w-full max-w-3xl p-4">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">{panelName}</Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenCreate(true)}
                >
                  Create
                </Button>
              </div>

              <List>
                {items.map((item, index) => (
                  <ListItem key={index} divider disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setNewItem(item);
                        setOpenDetails(index);
                        setEditMode(false);
                      }}
                    >
                      <ListItemText
                        primary={item[formFields[0].name]}
                        secondary={formFields
                          .slice(1)
                          .map((f) => `${f.label}: ${item[f.name]}`)
                          .join(" | ")}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Settings Tab */}
      {tabIndex === 1 && (
        <Card className="max-w-3xl mx-auto p-6">
          <CardContent>
            <Typography variant="h6">Settings</Typography>
            <Typography variant="body2" color="text.secondary">
              Settings panel coming soon...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* --- Edit Profile Dialog --- */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {["name", "industry", "username"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              value={profileEdit[field] || ""}
              onChange={(e) => handleProfileChange(field, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button onClick={handleProfileSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Create Job Dialog --- */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New {panelName.slice(0, -1)}</DialogTitle>
        <DialogContent>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              type={field.type || "text"}
              fullWidth
              value={newItem[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Job Details Dialog --- */}
      <Dialog
        open={openDetails !== null}
        onClose={() => setOpenDetails(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Details</Typography>
            {!editMode && (
              <Button variant="outlined" onClick={() => setEditMode(true)}>
                Edit {panelName.slice(0, -1)}
              </Button>
            )}
          </div>
        </DialogTitle>
        <DialogContent>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              type={field.type || "text"}
              fullWidth
              value={newItem[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              InputProps={{ readOnly: !editMode }}
            />
          ))}
          <Divider className="my-4" />
          <Typography variant="h6" className="mb-2">
            Potential Applicants
          </Typography>
          <List>
            {students.map((s, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={s.name}
                  secondary={`Skills: ${s.skills}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(null)}>Close</Button>
          {editMode && (
            <Button onClick={handleUpdate} variant="contained">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </main>
  );
}


