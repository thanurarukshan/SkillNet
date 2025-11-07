"use client";

import { useState } from "react";
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
} from "@mui/material";


type DashboardLayoutProps = {
  title: string;
  info: { [key: string]: string | number };
  panelName: string;
  formFields: { name: string; label: string; type?: string }[];
};

export default function DashboardLayout({
  title,
  info,
  panelName,
  formFields,
}: DashboardLayoutProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetails, setOpenDetails] = useState<null | number>(null); // store selected index
  const [newItem, setNewItem] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: string, value: string) =>
    setNewItem({ ...newItem, [field]: value });

  const handleSubmit = () => {
    if (!newItem[formFields[0].name]) return;
    setItems([...items, newItem]);
    setNewItem({});
    setOpenCreate(false);
  };

  const handleUpdate = () => {
    if (openDetails === null) return;
    const updated = [...items];
    updated[openDetails] = newItem;
    setItems(updated);
    setEditMode(false);
  };

  // Mock students
  const students = [
    { name: "Alice", skills: "React, Node.js" },
    { name: "Bob", skills: "Python, ML" },
    { name: "Charlie", skills: "UI/UX, Figma" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">{title}</h1>

      {/* Info Card */}
      <Card className="mb-6 max-w-3xl mx-auto">
        <CardContent>
          {Object.entries(info).map(([key, value]) => (
            <Typography key={key} variant="body2">
              <strong>{key}:</strong> {value}
            </Typography>
          ))}
        </CardContent>
      </Card>

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

      {/* Items Panel */}
      {tabIndex === 0 && (
        <Grid container justifyContent="center">
          <Card className="w-full max-w-3xl p-4">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6">{panelName}</Typography>
                <Button variant="contained" color="success" onClick={() => setOpenCreate(true)}>
                  Create
                </Button>
              </div>

              <List>
                {items.map((item, index) => (
                  <ListItem
                    key={index} divider disablePadding
                  >
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

      {/* Create Dialog */}
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
              InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
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

      {/* Details Dialog */}
      <Dialog open={openDetails !== null} onClose={() => setOpenDetails(null)} fullWidth maxWidth="md">
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
          {/* Edit or View Form */}
          {formFields.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              type={field.type || "text"}
              fullWidth
              InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
              value={newItem[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              InputProps={{ readOnly: !editMode }}
            />
          ))}

          <Divider className="my-4" />

          {/* Available Students */}
          <Typography variant="h6" className="mb-2">Available Students</Typography>
          <List>
            {students.map((s, idx) => (
              <ListItem key={idx} divider>
                <ListItemText primary={s.name} secondary={`Skills: ${s.skills}`} />
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
