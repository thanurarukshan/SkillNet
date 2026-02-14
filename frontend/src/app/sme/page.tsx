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
  Stack,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Send,
  CheckCircle,
  Business,
} from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

interface Profile {
  id: number;
  name: string;
  email: string;
  category: string;
}

interface Project {
  p_id: number;
  p_name: string;
  p_description: string;
  p_time_period: string;
  p_skills_req: string[];
  p_value_type: "fixed" | "discuss";
  p_value_amount: number | null;
  hired_team_id: number | null;
  hired_team_name: string | null;
  leader_name: string | null;
  created_at: string;
}

interface Recommendation {
  t_id: number;
  t_name: string;
  t_skills_req: string[] | string;
  similarity_score: number;
  leader_name: string;
}

export default function SmeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Dialog states
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openEditProject, setOpenEditProject] = useState(false);
  const [openProjectDetails, setOpenProjectDetails] = useState(false);
  const [openHiringRequest, setOpenHiringRequest] = useState(false);

  // Selected project and team
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Recommendation | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [projectForm, setProjectForm] = useState({
    p_name: "",
    p_description: "",
    p_time_period: "",
    p_skills_req: [] as string[],
    p_value_type: "discuss" as "fixed" | "discuss",
    p_value_amount: "",
  });
  const [hiringMessage, setHiringMessage] = useState("");
  const [smeContact, setSmeContact] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/getSmeInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProfile({ ...data.user, email: data.user.username });
        setProfileForm({ name: data.user.name, email: data.user.username });
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
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
        body: JSON.stringify({ name: profileForm.name }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEditProfile(false);
        fetchProfile();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error updating profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm("Are you sure you want to delete your account? This will delete all your projects and cannot be undone.")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/deleteUser", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        router.push("/");
      } else {
        alert("Failed to delete account");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCreateProject = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      ...projectForm,
      p_value_amount: projectForm.p_value_type === "fixed" ? parseFloat(projectForm.p_value_amount) : null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Project created successfully!");
        setOpenCreateProject(false);
        setProjectForm({
          p_name: "",
          p_description: "",
          p_time_period: "",
          p_skills_req: [],
          p_value_type: "discuss",
          p_value_amount: "",
        });
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create project");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error creating project");
    }
  };

  const handleUpdateProject = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedProject) return;

    const payload = {
      ...projectForm,
      p_value_amount: projectForm.p_value_type === "fixed" ? parseFloat(projectForm.p_value_amount) : null,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${selectedProject.p_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Project updated successfully!");
        setOpenEditProject(false);
        fetchProjects();
      } else {
        alert("Failed to update project");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Project deleted successfully!");
        fetchProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const openProject = async (project: Project) => {
    setSelectedProject(project);
    setOpenProjectDetails(true);

    // Fetch recommendations
    setLoadingRecs(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${project.p_id}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const openEditProjectDialog = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      p_name: project.p_name,
      p_description: project.p_description,
      p_time_period: project.p_time_period,
      p_skills_req: project.p_skills_req,
      p_value_type: project.p_value_type,
      p_value_amount: project.p_value_amount?.toString() || "",
    });
    setOpenEditProject(true);
  };

  const openHiringDialog = (team: Recommendation) => {
    setSelectedTeam(team);
    setHiringMessage(`Hi, we're interested in hiring your team "${team.t_name}" for our project "${selectedProject?.p_name}". Looking forward to working together!`);
    setSmeContact(profile?.email || "");
    setOpenHiringRequest(true);
  };

  const handleSendHiringRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedProject || !selectedTeam) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${selectedProject.p_id}/send-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: selectedTeam.t_id,
          message: hiringMessage,
          sme_contact: smeContact,
        }),
      });

      if (res.ok) {
        alert("Hiring request sent successfully!");
        setOpenHiringRequest(false);
        setOpenProjectDetails(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send request");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error sending request");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* HEADER */}
      <AppBar position="static" sx={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
        <Toolbar>
          <Business sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            SkillNet - SME Dashboard
          </Typography>
          <UserMenu
            userName={profile?.name || ""}
            onProfileUpdate={() => setOpenEditProfile(true)}
          />
        </Toolbar>
      </AppBar>

      <Box p={4}>
        {/* PROFILE CARD */}
        <Card sx={{ maxWidth: 1000, mx: "auto", mb: 4, p: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ width: 80, height: 80, bgcolor: "#7c3aed" }}>
                  {profile?.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {profile?.name}
                  </Typography>
                  <Typography color="text.secondary">{profile?.email}</Typography>
                  <Chip label="SME" size="small" color="secondary" sx={{ mt: 1 }} />
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setOpenEditProfile(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteProfile}
                >
                  Delete Account
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* PROJECTS SECTION */}
        <Box maxWidth={1000} mx="auto">
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              My Projects ({projects.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateProject(true)}
              sx={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}
            >
              Create New Project
            </Button>
          </Stack>

          {projects.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary" mb={2}>
                No projects yet. Create your first project to get started!
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenCreateProject(true)}
              >
                Create Project
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} md={6} key={project.p_id}>
                  <Card sx={{ height: "100%", cursor: "pointer", "&:hover": { boxShadow: 4 } }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                          <Box flex={1} onClick={() => openProject(project)}>
                            <Typography variant="h6" fontWeight="bold">
                              {project.p_name}
                            </Typography>
                            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                              {project.p_description?.substring(0, 100)}...
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => openEditProjectDialog(project)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProject(project.p_id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>

                        <Box onClick={() => openProject(project)}>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {project.p_time_period}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Value:</strong>{" "}
                            {project.p_value_type === "fixed"
                              ? `$${project.p_value_amount?.toLocaleString()}`
                              : "Discuss Later"}
                          </Typography>

                          <Box mt={1}>
                            <Typography variant="body2" fontWeight="bold" mb={0.5}>
                              Required Skills:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {project.p_skills_req.slice(0, 3).map((skill, idx) => (
                                <Chip key={idx} label={skill} size="small" color="primary" sx={{ mb: 0.5 }} />
                              ))}
                              {project.p_skills_req.length > 3 && (
                                <Chip label={`+${project.p_skills_req.length - 3} more`} size="small" sx={{ mb: 0.5 }} />
                              )}
                            </Stack>
                          </Box>

                          {project.hired_team_id ? (
                            <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
                              Hired: {project.hired_team_name} ({project.leader_name})
                            </Alert>
                          ) : (
                            <Chip label="Looking for Team" color="warning" size="small" sx={{ mt: 2 }} />
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* EDIT PROFILE DIALOG */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE PROJECT DIALOG */}
      <Dialog open={openCreateProject} onClose={() => setOpenCreateProject(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Project Name"
              fullWidth
              required
              value={projectForm.p_name}
              onChange={(e) => setProjectForm({ ...projectForm, p_name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={projectForm.p_description}
              onChange={(e) => setProjectForm({ ...projectForm, p_description: e.target.value })}
            />
            <TextField
              label="Time Period (e.g., 3 months)"
              fullWidth
              value={projectForm.p_time_period}
              onChange={(e) => setProjectForm({ ...projectForm, p_time_period: e.target.value })}
            />
            <Autocomplete
              multiple
              freeSolo
              options={["React", "Node.js", "Python", "Java", "TypeScript", "MongoDB", "Docker", "AWS"]}
              value={projectForm.p_skills_req}
              onChange={(_, newValue) => setProjectForm({ ...projectForm, p_skills_req: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Required Skills" placeholder="Type and press enter" />
              )}
            />
            <FormControl fullWidth>
              <InputLabel>Project Value</InputLabel>
              <Select
                value={projectForm.p_value_type}
                label="Project Value"
                onChange={(e) =>
                  setProjectForm({ ...projectForm, p_value_type: e.target.value as "fixed" | "discuss" })
                }
              >
                <MenuItem value="discuss">Discuss Later</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            {projectForm.p_value_type === "fixed" && (
              <TextField
                label="Fixed Amount ($)"
                type="number"
                fullWidth
                value={projectForm.p_value_amount}
                onChange={(e) => setProjectForm({ ...projectForm, p_value_amount: e.target.value })}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateProject(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateProject}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT PROJECT DIALOG */}
      <Dialog open={openEditProject} onClose={() => setOpenEditProject(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Project Name"
              fullWidth
              required
              value={projectForm.p_name}
              onChange={(e) => setProjectForm({ ...projectForm, p_name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={projectForm.p_description}
              onChange={(e) => setProjectForm({ ...projectForm, p_description: e.target.value })}
            />
            <TextField
              label="Time Period"
              fullWidth
              value={projectForm.p_time_period}
              onChange={(e) => setProjectForm({ ...projectForm, p_time_period: e.target.value })}
            />
            <Autocomplete
              multiple
              freeSolo
              options={["React", "Node.js", "Python", "Java", "TypeScript", "MongoDB", "Docker", "AWS"]}
              value={projectForm.p_skills_req}
              onChange={(_, newValue) => setProjectForm({ ...projectForm, p_skills_req: newValue })}
              renderInput={(params) => <TextField {...params} label="Required Skills" />}
            />
            <FormControl fullWidth>
              <InputLabel>Project Value</InputLabel>
              <Select
                value={projectForm.p_value_type}
                label="Project Value"
                onChange={(e) =>
                  setProjectForm({ ...projectForm, p_value_type: e.target.value as "fixed" | "discuss" })
                }
              >
                <MenuItem value="discuss">Discuss Later</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            {projectForm.p_value_type === "fixed" && (
              <TextField
                label="Fixed Amount ($)"
                type="number"
                fullWidth
                value={projectForm.p_value_amount}
                onChange={(e) => setProjectForm({ ...projectForm, p_value_amount: e.target.value })}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProject(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProject}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* PROJECT DETAILS & AI MATCHER DIALOG */}
      <Dialog open={openProjectDetails} onClose={() => setOpenProjectDetails(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProject?.p_name}
          {selectedProject?.hired_team_id && <Chip label="Team Hired" color="success" size="small" sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1">{selectedProject.p_description}</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  <strong>Duration:</strong> {selectedProject.p_time_period}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Value:</strong>{" "}
                  {selectedProject.p_value_type === "fixed"
                    ? `$${selectedProject.p_value_amount?.toLocaleString()}`
                    : "Discuss Later"}
                </Typography>
                <Box mt={1}>
                  <Typography variant="body2" fontWeight="bold">Required Skills:</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
                    {selectedProject.p_skills_req.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" color="primary" />
                    ))}
                  </Stack>
                </Box>
              </Box>

              {selectedProject.hired_team_id ? (
                <Alert severity="success">
                  <Typography fontWeight="bold">Hired Team: {selectedProject.hired_team_name}</Typography>
                  <Typography variant="body2">Team Leader: {selectedProject.leader_name}</Typography>
                </Alert>
              ) : (
                <>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      🤖 AI Project Matcher
                    </Typography>
                    {loadingRecs ? (
                      <Box textAlign="center" py={3}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          Finding best matching teams...
                        </Typography>
                      </Box>
                    ) : recommendations.length === 0 ? (
                      <Alert severity="info">No team recommendations available yet.</Alert>
                    ) : (
                      <Stack spacing={2}>
                        {recommendations.map((team) => (
                          <Card key={team.t_id} variant="outlined">
                            <CardContent>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box flex={1}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {team.t_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Leader: {team.leader_name}
                                  </Typography>
                                  <Box mt={1}>
                                    <Typography variant="caption">Team Skills:</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
                                      {(Array.isArray(team.t_skills_req)
                                        ? team.t_skills_req
                                        : typeof team.t_skills_req === "string"
                                          ? team.t_skills_req.split(",")
                                          : []
                                      ).slice(0, 4).map((skill, idx) => (
                                        <Chip key={idx} label={skill} size="small" variant="outlined" />
                                      ))}
                                    </Stack>
                                  </Box>
                                </Box>
                                <Stack alignItems="center" spacing={1}>
                                  <Chip
                                    label={`${Math.round(team.similarity_score * 100)}% Match`}
                                    color={team.similarity_score > 0.7 ? "success" : "primary"}
                                    size="small"
                                  />
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<Send />}
                                    onClick={() => openHiringDialog(team)}
                                  >
                                    Send Request
                                  </Button>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* SEND HIRING REQUEST DIALOG */}
      <Dialog open={openHiringRequest} onClose={() => setOpenHiringRequest(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Hiring Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Team:</strong> {selectedTeam?.t_name}
              </Typography>
              <Typography variant="body2">
                <strong>Match Score:</strong> {Math.round((selectedTeam?.similarity_score || 0) * 100)}%
              </Typography>
            </Alert>
            <TextField
              label="Your Message"
              fullWidth
              multiline
              rows={4}
              value={hiringMessage}
              onChange={(e) => setHiringMessage(e.target.value)}
            />
            <TextField
              label="Your Contact Information"
              fullWidth
              value={smeContact}
              onChange={(e) => setSmeContact(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHiringRequest(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} onClick={handleSendHiringRequest}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
