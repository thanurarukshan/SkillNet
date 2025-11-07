"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export default function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    major: "Computer Science",
    year: "3rd Year",
    avatar: "https://i.pravatar.cc/150?img=3",
  });

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT saved during login
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch("http://localhost:5000/api/getStudentInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch student info");
          return;
        }

        const data = await res.json();
        console.log("Student info from API:", data);

        // Map backend fields to frontend state
        setStudentInfo({
          name: data.user.name || "",
          email: data.user.username || "",
          major: data.user.department || "N/A",
          year: data.user.acadamic_year || "N/A",
          avatar: "https://i.pravatar.cc/150?img=3", // optionally fetch real avatar if available
        });
      } catch (err) {
        console.error("Error fetching student info:", err);
      }
    };

    fetchStudentInfo();
  }, []);

  const [skills, setSkills] = useState([
    { name: "React", verified: true },
    { name: "TypeScript", verified: false },
    { name: "Node.js", verified: true },
    { name: "Docker", verified: false },
  ]);

  const [teamSuggestions, setTeamSuggestions] = useState([
    { id: 1, name: "Team Alpha", members: ["Alice", "Bob"], joined: false },
    { id: 2, name: "Team Beta", members: ["Charlie", "David"], joined: false },
  ]);

  const [joinedTeams, setJoinedTeams] = useState([
    { id: 3, name: "Team Gamma", members: ["Eve", "Frank"] },
  ]);

  const [jobRequests, setJobRequests] = useState([
    { id: 1, company: "Google", position: "Frontend Intern" },
    { id: 2, company: "Microsoft", position: "Backend Intern" },
  ]);

  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);

  // ✅ New states for skills modal
  const [openSkills, setOpenSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/editProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentInfo),
      });

      if (!res.ok) {
        console.error("Failed to send profile data");
        return;
      }

      const data = await res.json();
      console.log("Response from gateway:", data);

      (document.activeElement as HTMLElement)?.blur();
      setOpenEdit(false);
    } catch (err) {
      console.error("Error sending to API Gateway:", err);
    }
  };

  const handleJoinTeam = (id: number) => {
    const team = teamSuggestions.find((t) => t.id === id);
    if (team) {
      setJoinedTeams([...joinedTeams, team]);
      setTeamSuggestions(teamSuggestions.filter((t) => t.id !== id));
    }
  };

  const handleCreateTeam = () => {
    const teamName = prompt("Enter new team name:");
    if (teamName) {
      const newTeam = { id: Date.now(), name: teamName, members: [studentInfo.name], joined: true };
      setJoinedTeams([...joinedTeams, newTeam]);
    }
  };

  // ✅ Add new skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, { name: newSkill, verified: false }]);
      setNewSkill("");
    }
  };

  // ✅ Remove skill
  const handleRemoveSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Student Dashboard</h1>

      {/* Student Info */}
      <Card className="mb-6 max-w-3xl mx-auto">
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Avatar src={studentInfo.avatar} sx={{ width: 80, height: 80 }} />
            <div>
              <Typography variant="h5">{studentInfo.name}</Typography>
              <Typography variant="body1">{studentInfo.email}</Typography>
              <Typography variant="body2">
                {studentInfo.major} - {studentInfo.year}
              </Typography>
            </div>
          </div>
          <Button variant="contained" color="primary" onClick={() => setOpenEdit(true)}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            label="Name"
            fullWidth
            value={studentInfo.name}
            onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            value={studentInfo.email}
            onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
          />
          <TextField
            label="Major"
            fullWidth
            value={studentInfo.major}
            onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })}
          />
          <TextField
            label="Year"
            fullWidth
            value={studentInfo.year}
            onChange={(e) => setStudentInfo({ ...studentInfo, year: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabs */}
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered className="mb-6">
        <Tab label="Skills" />
        <Tab label="Teams" />
        <Tab label="Job Requests" />
      </Tabs>

      {/* Skills Tab with "Manage Skills" Button */}
      {tabIndex === 0 && (
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            {skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill.name}
                color={skill.verified ? "success" : "default"}
                variant={skill.verified ? "filled" : "outlined"}
              />
            ))}
          </div>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenSkills(true)}
          >
            Manage Skills
          </Button>
        </div>
      )}

      {/* Skills Management Dialog */}
      <Dialog open={openSkills} onClose={() => setOpenSkills(false)}>
        <DialogTitle>Manage Skills</DialogTitle>
        <DialogContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Chip
                key={skill.name}
                label={skill.name}
                onDelete={() => handleRemoveSkill(skill.name)}
                color={skill.verified ? "success" : "default"}
              />
            ))}
          </div>

          <div className="flex space-x-2 mt-4">
            <TextField
              label="Add Skill"
              fullWidth
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddSkill}>
              Add
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkills(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Teams Tab */}
      {tabIndex === 1 && (
        <div className="mb-6 max-w-6xl mx-auto">
          <div className="flex justify-between mb-4">
            <Typography variant="h6">Team Suggestions</Typography>
            <Button variant="contained" color="primary" onClick={handleCreateTeam}>
              Create New Team
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {teamSuggestions.map((team) => (
              <Card key={team.id} className="w-72 p-4">
                <CardContent>
                  <Typography variant="h6">{team.name}</Typography>
                  <Typography variant="body2" className="mb-2">
                    Members: {team.members.join(", ")}
                  </Typography>
                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleJoinTeam(team.id)}
                    >
                      Join Team
                    </Button>
                    <Button variant="outlined" fullWidth>
                      View Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Typography variant="h6" className="mb-2">
            Joined Teams
          </Typography>
          <div className="flex flex-wrap justify-center gap-4">
            {joinedTeams.map((team) => (
              <Card key={team.id} className="w-72 p-4">
                <CardContent>
                  <Typography variant="h6">{team.name}</Typography>
                  <Typography variant="body2">
                    Members: {team.members.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Job Requests Tab */}
      {tabIndex === 2 && (
        <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-6">
          {jobRequests.map((job) => (
            <Card key={job.id} className="w-80 p-4">
              <CardContent>
                <Typography variant="h6">{job.company}</Typography>
                <Typography variant="body2" className="mb-2">
                  {job.position}
                </Typography>
                <div className="flex space-x-2">
                  <Button variant="contained" color="success" fullWidth>
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" fullWidth>
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
