// "use client";

// import { useState, useEffect } from "react";
// import {
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Button,
//   Typography,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Divider,
// } from "@mui/material";
// import { Add } from "@mui/icons-material";

// export default function SmeDashboard() {
//   const [smeInfo, setSmeInfo] = useState({
//     name: "Acme SME",
//     email: "contact@acme.com",
//     sector: "Tech Consulting",
//     actvProjects: 2,
//   });
//   // --- Props that were passed into DashboardLayout ---
//   const title = "SME Dashboard";

//   const panelName = "My Projects";

//   const formFields = [
//     { name: "name", label: "Project Name" },
//     { name: "skills", label: "Required Skills" },
//     { name: "deadline", label: "Deadline", type: "date" },
//   ];

//   useEffect(() => {
//     const fetchSmeInfo = async () => {
//       try {
//         const token = localStorage.getItem("token"); // JWT saved during login
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const res = await fetch("http://localhost:5000/api/getSmeInfo", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           console.log("Failed to fetch sme info");
//           return;
//         }

//         const data = await res.json();
//         console.log("Student info from API:", data);

//         // Map backend fields to frontend state
//         setSmeInfo({
//           name: data.user.name || "",
//           email: data.user.username || "",
//           sector: data.user.department || "N/A",
//           actvProjects: 2,
//         });
//       } catch (err) {
//         console.error("Error fetching student info:", err);
//       }
//     };

//     fetchSmeInfo();
//   }, []);

//   // --- State management (from DashboardLayout) ---
//   const [tabIndex, setTabIndex] = useState(0);
//   const [items, setItems] = useState<any[]>([]);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [openDetails, setOpenDetails] = useState<null | number>(null);
//   const [newItem, setNewItem] = useState<Record<string, string>>({});
//   const [editMode, setEditMode] = useState(false);

//   const handleChange = (field: string, value: string) =>
//     setNewItem({ ...newItem, [field]: value });

//   const handleSubmit = async () => {
//     if (!newItem[formFields[0].name]) return;
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }
//       const res = await fetch("http://localhost:5000/api/addProject", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newItem),
//       });
      
//       if (!res.ok) {
//         const errText = await res.text();
//         console.error("Failed to submit:", errText);
//         return;
//       }

//       const data = await res.json();
//       console.log("Response from gateway:", data.message);

//     } catch (err) {
//       console.error("Error sending to API Gateway:", err);
//     }
//     // Add item locally for display
//     setItems([...items, newItem]);
//     setNewItem({});
//     setOpenCreate(false);
//   };

//   const handleUpdate = () => {
//     if (openDetails === null) return;
//     const updated = [...items];
//     updated[openDetails] = newItem;
//     setItems(updated);
//     setEditMode(false);
//   };

//   // Mock students
//   const students = [
//     { name: "Alice", skills: "React, Node.js" },
//     { name: "Bob", skills: "Python, ML" },
//     { name: "Charlie", skills: "UI/UX, Figma" },
//   ];

//   return (
//     <main className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-4xl font-bold mb-6 text-center">{title}</h1>

//       {/* Info Card */}
//       <Card className="mb-6 max-w-3xl mx-auto">
//         <CardContent>
//           {Object.entries(smeInfo).map(([key, value]) => (
//             <Typography key={key} variant="body2">
//               <strong>{key}:</strong> {value}
//             </Typography>
//           ))}
//         </CardContent>
//       </Card>

//       {/* Tabs */}
//       <Tabs
//         value={tabIndex}
//         onChange={(_, newValue) => setTabIndex(newValue)}
//         centered
//         className="mb-6"
//       >
//         <Tab label={panelName} />
//         <Tab label="Settings" />
//       </Tabs>

//       {/* Items Panel */}
//       {tabIndex === 0 && (
//         <Grid container justifyContent="center">
//           <Card className="w-full max-w-3xl p-4">
//             <CardContent>
//               <div className="flex justify-between items-center mb-4">
//                 <Typography variant="h6">{panelName}</Typography>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() => setOpenCreate(true)}
//                 >
//                   Create
//                 </Button>
//               </div>

//               <List>
//                 {items.map((item, index) => (
//                   <ListItem key={index} divider disablePadding>
//                     <ListItemButton
//                       onClick={() => {
//                         setNewItem(item);
//                         setOpenDetails(index);
//                         setEditMode(false);
//                       }}
//                     >
//                       <ListItemText
//                         primary={item[formFields[0].name]}
//                         secondary={formFields
//                           .slice(1)
//                           .map((f) => `${f.label}: ${item[f.name]}`)
//                           .join(" | ")}
//                       />
//                     </ListItemButton>
//                   </ListItem>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       )}

//       {/* Settings Tab */}
//       {tabIndex === 1 && (
//         <Card className="max-w-3xl mx-auto p-6">
//           <CardContent>
//             <Typography variant="h6">Settings</Typography>
//             <Typography variant="body2" color="text.secondary">
//               Settings panel coming soon...
//             </Typography>
//           </CardContent>
//         </Card>
//       )}

//       {/* Create Dialog */}
//       <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
//         <DialogTitle>Create New {panelName.slice(0, -1)}</DialogTitle>
//         <DialogContent>
//           {formFields.map((field) => (
//             <TextField
//               key={field.name}
//               margin="dense"
//               label={field.label}
//               type={field.type || "text"}
//               fullWidth
//               InputLabelProps={
//                 field.type === "date" ? { shrink: true } : undefined
//               }
//               value={newItem[field.name] || ""}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//             />
//           ))}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Details Dialog */}
//       <Dialog
//         open={openDetails !== null}
//         onClose={() => setOpenDetails(null)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>
//           <div className="flex justify-between items-center">
//             <Typography variant="h6">Details</Typography>
//             {!editMode && (
//               <Button variant="outlined" onClick={() => setEditMode(true)}>
//                 Edit {panelName.slice(0, -1)}
//               </Button>
//             )}
//           </div>
//         </DialogTitle>
//         <DialogContent>
//           {/* Edit or View Form */}
//           {formFields.map((field) => (
//             <TextField
//               key={field.name}
//               margin="dense"
//               label={field.label}
//               type={field.type || "text"}
//               fullWidth
//               InputLabelProps={
//                 field.type === "date" ? { shrink: true } : undefined
//               }
//               value={newItem[field.name] || ""}
//               onChange={(e) => handleChange(field.name, e.target.value)}
//               InputProps={{ readOnly: !editMode }}
//             />
//           ))}

//           <Divider className="my-4" />

//           {/* Available Students */}
//           <Typography variant="h6" className="mb-2">
//             Available Students
//           </Typography>
//           <List>
//             {students.map((s, idx) => (
//               <ListItem key={idx} divider>
//                 <ListItemText
//                   primary={s.name}
//                   secondary={`Skills: ${s.skills}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDetails(null)}>Close</Button>
//           {editMode && (
//             <Button onClick={handleUpdate} variant="contained">
//               Save
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </main>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
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
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
    secondary: { main: "#06b6d4" },
    background: { default: "#f4f6fb" },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: "Inter, sans-serif" },
});

export default function SmeDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [smeInfo, setSmeInfo] = useState({
    name: "Acme Technologies",
    email: "contact@acme.com",
    sector: "Software & IT Services",
    website: "https://acme.com",
    location: "Colombo, Sri Lanka",
    size: "20–50 Employees",
    founded: "2019",
    description:
      "We provide modern web and cloud solutions for enterprises.",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState<any>({});

  const students = [
    { name: "Alice", skills: "React, Node.js" },
    { name: "Bob", skills: "Python, ML" },
    { name: "Charlie", skills: "UI/UX" },
  ];

  const projectFields = [
    { name: "name", label: "Project Name" },
    { name: "skills", label: "Required Skills" },
    { name: "deadline", label: "Deadline", type: "date" },
  ];

  const handleSubmit = () => {
    setProjects([...projects, newProject]);
    setNewProject({});
    setOpenCreate(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">

        {/* HEADER */}
        <Typography variant="h3" textAlign="center" fontWeight="bold" mb={4}>
          🏢 SME Dashboard
        </Typography>

        {/* SME CARD */}
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            color: "white",
          }}
        >
          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
            <Stack spacing={1}>
              <Typography variant="h5">{smeInfo.name}</Typography>
              <Typography>{smeInfo.email}</Typography>
              <Typography>{smeInfo.website}</Typography>
              <Typography>{smeInfo.location}</Typography>
            </Stack>

            <Button
              variant="contained"
              sx={{ bgcolor: "white", color: "#4f46e5" }}
              startIcon={<Edit />}
              onClick={() => setOpenEdit(true)}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* PROFILE EDIT */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Edit Company Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              {Object.entries(smeInfo).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) =>
                    setSmeInfo({ ...smeInfo, [key]: e.target.value })
                  }
                  fullWidth
                />
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* TABS */}
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          centered
          sx={{ mt: 3 }}
        >
          <Tab label="Projects" />
          <Tab label="Settings" />
        </Tabs>

        {/* PROJECTS */}
        {tabIndex === 0 && (
          <Stack spacing={3} mt={4} alignItems="center">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreate(true)}
            >
              Create Project
            </Button>

            {projects.map((p, i) => (
              <Card key={i} sx={{ width: 500, p: 2 }}>
                <Typography variant="h6">{p.name}</Typography>
                <Typography>Skills: {p.skills}</Typography>
                <Typography>Deadline: {p.deadline}</Typography>
                <Button
                  sx={{ mt: 1 }}
                  variant="outlined"
                  onClick={() => {
                    setNewProject(p);
                    setOpenDetails(i);
                    setEditMode(false);
                  }}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </Stack>
        )}

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
                InputLabelProps={
                  f.type === "date" ? { shrink: true } : undefined
                }
                value={newProject[f.name] || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, [f.name]: e.target.value })
                }
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

        {/* DETAILS */}
        <Dialog
          open={openDetails !== null}
          onClose={() => setOpenDetails(null)}
          fullWidth
        >
          <DialogTitle>Project Details</DialogTitle>
          <DialogContent>
            {projectFields.map((f) => (
              <TextField
                key={f.name}
                label={f.label}
                value={newProject[f.name] || ""}
                fullWidth
                margin="dense"
                InputProps={{ readOnly: !editMode }}
              />
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Available Students</Typography>
            <List>
              {students.map((s, i) => (
                <ListItem key={i}>
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
            {!editMode && (
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            )}
            {editMode && <Button variant="contained">Save</Button>}
          </DialogActions>
        </Dialog>
      </main>
    </ThemeProvider>
  );
}

