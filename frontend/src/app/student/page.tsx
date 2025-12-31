// "use client";

// import { useState, useEffect } from "react";
// import {
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Button,
//   Avatar,
//   Chip,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
// } from "@mui/material";
// import { Add } from "@mui/icons-material";

// export default function StudentDashboard() {
  
//   const [studentInfo, setStudentInfo] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     major: "Computer Science",
//     year: "3rd Year",
//     avatar: "data:image/png;base64,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",
//   });


//   useEffect(() => {
//     const fetchStudentInfo = async () => {
//       try {
//         const token = localStorage.getItem("token"); // JWT saved during login
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const res = await fetch("http://localhost:5000/api/getStudentInfo", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           console.log("Failed to fetch student info");
//           return;
//         }

//         const data = await res.json();
//         console.log("Student info from API:", data);

//         // Map backend fields to frontend state
//         setStudentInfo({
//           name: data.user.name || "",
//           email: data.user.username || "",
//           major: data.user.department || "N/A",
//           year: data.user.acadamic_year || "N/A",
//           avatar: "data:image/png;base64,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", // optionally fetch real avatar if available
//         });
//       } catch (err) {
//         console.error("Error fetching student info:", err);
//       }
//     };

//     fetchStudentInfo();
//   }, []);

//   const [skills, setSkills] = useState([
//     { name: "React", verified: true },
//     { name: "TypeScript", verified: false },
//     { name: "Node.js", verified: true },
//     { name: "Docker", verified: false },
//   ]);

//   const [teamSuggestions, setTeamSuggestions] = useState([
//     { id: 1, name: "Team Alpha", members: ["Alice", "Bob"], joined: false },
//     { id: 2, name: "Team Beta", members: ["Charlie", "David"], joined: false },
//   ]);

//   const [joinedTeams, setJoinedTeams] = useState([
//     { id: 3, name: "Team Gamma", members: ["Eve", "Frank"] },
//   ]);

//   const [jobRequests, setJobRequests] = useState([
//     { id: 1, company: "Google", position: "Frontend Intern" },
//     { id: 2, company: "Microsoft", position: "Backend Intern" },
//   ]);

//   const [tabIndex, setTabIndex] = useState(0);
//   const [openEdit, setOpenEdit] = useState(false);

//   //  New states for skills modal
//   const [openSkills, setOpenSkills] = useState(false);
//   const [newSkill, setNewSkill] = useState("");

//   const handleSaveProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const res = await fetch("http://localhost:5000/api/editProfile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: studentInfo.name,
//           department: studentInfo.major,
//           acadamic_year: studentInfo.year,
//         }),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         console.error("Failed to update profile:", errText);
//         return;
//       }

//       const data = await res.json();
//       console.log("Profile updated successfully:", data);

//       setOpenEdit(false);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//     }
//   };


//   const handleJoinTeam = (id: number) => {
//     const team = teamSuggestions.find((t) => t.id === id);
//     if (team) {
//       setJoinedTeams([...joinedTeams, team]);
//       setTeamSuggestions(teamSuggestions.filter((t) => t.id !== id));
//     }
//   };

//   const handleCreateTeam = () => {
//     const teamName = prompt("Enter new team name:");
//     if (teamName) {
//       const newTeam = { id: Date.now(), name: teamName, members: [studentInfo.name], joined: true };
//       setJoinedTeams([...joinedTeams, newTeam]);
//     }
//   };

//   // ✅ Add new skill
//   const handleAddSkill = () => {
//     if (newSkill.trim() !== "") {
//       setSkills([...skills, { name: newSkill, verified: false }]);
//       setNewSkill("");
//     }
//   };

//   // ✅ Remove skill
//   const handleRemoveSkill = (name: string) => {
//     setSkills(skills.filter((s) => s.name !== name));
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-4xl font-bold mb-6 text-center">Student Dashboard</h1>

//       {/* Student Info */}
//       <Card className="mb-6 max-w-3xl mx-auto">
//         <CardContent className="flex items-center justify-between">
//           <div className="flex items-center space-x-6">
//             <Avatar src={studentInfo.avatar} sx={{ width: 80, height: 80 }} />
//             <div>
//               <Typography variant="h5">{studentInfo.name}</Typography>
//               <Typography variant="body1">{studentInfo.email}</Typography>
//               <Typography variant="body2">
//                 {studentInfo.major} - {studentInfo.year}
//               </Typography>
//             </div>
//           </div>
//           <Button variant="contained" color="primary" onClick={() => setOpenEdit(true)}>
//             Edit Profile
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Edit Profile Dialog */}
//       <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
//         <DialogTitle>Edit Profile</DialogTitle>
//         <DialogContent className="space-y-4">
//           <TextField
//             label="Name"
//             fullWidth
//             value={studentInfo.name}
//             onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
//           />
//           <TextField
//             label="Email"
//             fullWidth
//             value={studentInfo.email}
//             onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
//           />
//           <TextField
//             label="Major"
//             fullWidth
//             value={studentInfo.major}
//             onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })}
//           />
//           <TextField
//             label="Year"
//             fullWidth
//             value={studentInfo.year}
//             onChange={(e) => setStudentInfo({ ...studentInfo, year: e.target.value })}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSaveProfile}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Tabs */}
//       <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered className="mb-6">
//         <Tab label="Skills" />
//         <Tab label="Teams" />
//         <Tab label="Job Requests" />
//       </Tabs>

//       {/* Skills Tab with "Manage Skills" Button */}
//       {tabIndex === 0 && (
//         <div className="flex flex-col items-center gap-4 mb-6">
//           <div className="flex flex-wrap justify-center gap-2">
//             {skills.map((skill, index) => (
//               <Chip
//                 key={index}
//                 label={skill.name}
//                 color={skill.verified ? "success" : "default"}
//                 variant={skill.verified ? "filled" : "outlined"}
//               />
//             ))}
//           </div>
//           <Button
//             variant="outlined"
//             color="primary"
//             startIcon={<Add />}
//             onClick={() => setOpenSkills(true)}
//           >
//             Manage Skills
//           </Button>
//         </div>
//       )}

//       {/* Skills Management Dialog */}
//       <Dialog open={openSkills} onClose={() => setOpenSkills(false)}>
//         <DialogTitle>Manage Skills</DialogTitle>
//         <DialogContent className="space-y-3">
//           <div className="flex flex-wrap gap-2">
//             {skills.map((skill) => (
//               <Chip
//                 key={skill.name}
//                 label={skill.name}
//                 onDelete={() => handleRemoveSkill(skill.name)}
//                 color={skill.verified ? "success" : "default"}
//               />
//             ))}
//           </div>

//           <div className="flex space-x-2 mt-4">
//             <TextField
//               label="Add Skill"
//               fullWidth
//               value={newSkill}
//               onChange={(e) => setNewSkill(e.target.value)}
//             />
//             <Button variant="contained" onClick={handleAddSkill}>
//               Add
//             </Button>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenSkills(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Teams Tab */}
//       {tabIndex === 1 && (
//         <div className="mb-6 max-w-6xl mx-auto">
//           <div className="flex justify-between mb-4">
//             <Typography variant="h6">Team Suggestions</Typography>
//             <Button variant="contained" color="primary" onClick={handleCreateTeam}>
//               Create New Team
//             </Button>
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mb-6">
//             {teamSuggestions.map((team) => (
//               <Card key={team.id} className="w-72 p-4">
//                 <CardContent>
//                   <Typography variant="h6">{team.name}</Typography>
//                   <Typography variant="body2" className="mb-2">
//                     Members: {team.members.join(", ")}
//                   </Typography>
//                   <div className="flex space-x-2">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       fullWidth
//                       onClick={() => handleJoinTeam(team.id)}
//                     >
//                       Join Team
//                     </Button>
//                     <Button variant="outlined" fullWidth>
//                       View Members
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <Typography variant="h6" className="mb-2">
//             Joined Teams
//           </Typography>
//           <div className="flex flex-wrap justify-center gap-4">
//             {joinedTeams.map((team) => (
//               <Card key={team.id} className="w-72 p-4">
//                 <CardContent>
//                   <Typography variant="h6">{team.name}</Typography>
//                   <Typography variant="body2">
//                     Members: {team.members.join(", ")}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Job Requests Tab */}
//       {tabIndex === 2 && (
//         <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-6">
//           {jobRequests.map((job) => (
//             <Card key={job.id} className="w-80 p-4">
//               <CardContent>
//                 <Typography variant="h6">{job.company}</Typography>
//                 <Typography variant="body2" className="mb-2">
//                   {job.position}
//                 </Typography>
//                 <div className="flex space-x-2">
//                   <Button variant="contained" color="success" fullWidth>
//                     Accept
//                   </Button>
//                   <Button variant="outlined" color="error" fullWidth>
//                     Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
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
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#06b6d4",
    },
    background: {
      default: "#f4f6fb",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default function StudentDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openViewProfile, setOpenViewProfile] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [studentInfo, setStudentInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    major: "Computer Science",
    year: "3rd Year",
    degreeProgram: "BSc (Hons) in Computer Science",
    description: "Passionate student interested in software engineering.",
    cv: null as File | null,
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
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

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill }]);
      setNewSkill("");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

        {/* HEADER */}
        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          mb={4}
        >
          🎓 Student Dashboard
        </Typography>

        {/* PROFILE CARD */}
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => setOpenViewProfile(true)}
        >
          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src={studentInfo.avatar} sx={{ width: 90, height: 90 }} />
              <div>
                <Typography variant="h5">{studentInfo.name}</Typography>
                <Typography>{studentInfo.email}</Typography>
                <Typography variant="body2">
                  {studentInfo.degreeProgram}
                </Typography>
              </div>
            </Stack>

            <Button
              variant="contained"
              startIcon={<Edit />}
              sx={{ bgcolor: "white", color: "#4f46e5" }}
              onClick={(e) => {
                e.stopPropagation();
                setOpenEdit(true);
              }}
            >
              Edit
            </Button>
          </CardContent>
        </Card>

        {/* PROFILE VIEW */}
        <Dialog open={openViewProfile} onClose={() => setOpenViewProfile(false)} fullWidth>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={2} alignItems="center">
              <Avatar src={studentInfo.avatar} sx={{ width: 120, height: 120 }} />
              <Typography><b>Name:</b> {studentInfo.name}</Typography>
              <Typography><b>Email:</b> {studentInfo.email}</Typography>
              <Typography><b>Degree:</b> {studentInfo.degreeProgram}</Typography>
              <Typography><b>Department:</b> {studentInfo.major}</Typography>
              <Typography><b>Year:</b> {studentInfo.year}</Typography>
              <Typography><b>About:</b> {studentInfo.description}</Typography>
              {studentInfo.cv && (
                <Button variant="outlined">View CV</Button>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewProfile(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* EDIT PROFILE */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Name" fullWidth value={studentInfo.name}
                onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })} />
              <TextField label="Degree" fullWidth value={studentInfo.degreeProgram}
                onChange={(e) => setStudentInfo({ ...studentInfo, degreeProgram: e.target.value })} />
              <TextField label="Department" fullWidth value={studentInfo.major}
                onChange={(e) => setStudentInfo({ ...studentInfo, major: e.target.value })} />
              <TextField label="Year" fullWidth value={studentInfo.year}
                onChange={(e) => setStudentInfo({ ...studentInfo, year: e.target.value })} />
              <TextField
                label="About"
                multiline
                rows={3}
                value={studentInfo.description}
                onChange={(e) => setStudentInfo({ ...studentInfo, description: e.target.value })}
              />
              <Button component="label" variant="outlined">
                Upload CV
                <input hidden type="file" accept="application/pdf" />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* TABS */}
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mt: 4 }}>
          <Tab label="Skills" />
          <Tab label="Teams" />
          <Tab label="Jobs" />
        </Tabs>

        {/* SKILLS */}
        {tabIndex === 0 && (
          <Box mt={4} textAlign="center">
            <Stack direction="row" justifyContent="center" gap={2} flexWrap="wrap">
              {skills.map((s) => (
                <Chip key={s.name} label={s.name} color="primary" />
              ))}
            </Stack>

            <Stack direction="row" justifyContent="center" mt={3} gap={2}>
              <TextField
                label="New Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill}>
                Add
              </Button>
            </Stack>
          </Box>
        )}

        {/* TEAMS */}
        {tabIndex === 1 && (
          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3} mt={4}>
            {teams.map((t) => (
              <Card key={t.id} sx={{ width: 260, p: 2 }}>
                <Typography variant="h6">{t.name}</Typography>
                <Typography>{t.members.join(", ")}</Typography>
                <Button fullWidth variant="contained" sx={{ mt: 2 }}>
                  Join
                </Button>
              </Card>
            ))}
          </Stack>
        )}

        {/* JOBS */}
        {tabIndex === 2 && (
          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={3} mt={4}>
            {jobs.map((j) => (
              <Card key={j.id} sx={{ width: 260, p: 2 }}>
                <Typography variant="h6">{j.company}</Typography>
                <Typography>{j.position}</Typography>
                <Stack direction="row" gap={2} mt={2}>
                  <Button variant="contained" color="success">Accept</Button>
                  <Button variant="outlined" color="error">Reject</Button>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </main>
    </ThemeProvider>
  );
}
