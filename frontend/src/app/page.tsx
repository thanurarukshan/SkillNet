"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";

export default function Home() {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [roleTab, setRoleTab] = useState(0); // 0: Student, 1: SME, 2: Company

  const handleSignInOpen = () => setOpenSignIn(true);
  const handleSignInClose = () => setOpenSignIn(false);
  const handleSignUpOpen = () => setOpenSignUp(true);
  const handleSignUpClose = () => setOpenSignUp(false);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to SkillNet</h1>
        <p className="text-xl max-w-2xl mb-6">
          Connect students, SMEs, and large companies in one seamless platform for collaboration, projects, and opportunities.
        </p>
        <div className="flex space-x-4">
          <Button variant="contained" color="secondary" onClick={handleSignInOpen}>
            Sign In
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleSignUpOpen}>
            Sign Up
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold mb-2">Manage Teams</h3>
            <p>Students and SMEs can create and join teams to collaborate efficiently on projects.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold mb-2">Track Projects</h3>
            <p>Companies can post projects, and teams can apply to work, track progress, and deliver results.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold mb-2">Role-based Access</h3>
            <p>Students, SMEs, and companies have customized dashboards and functionalities based on their roles.</p>
          </div>
        </div>
      </section>

      {/* Sign In Dialog */}
      <Dialog open={openSignIn} onClose={handleSignInClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent className="space-y-4">
          <Tabs
            value={roleTab}
            onChange={(_, value) => setRoleTab(value)}
            variant="fullWidth"
          >
            <Tab label="Student" />
            <Tab label="SME" />
            <Tab label="Company" />
          </Tabs>
          <TextField label="Email" type="email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignInClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSignInClose}>Sign In</Button>
        </DialogActions>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={openSignUp} onClose={handleSignUpClose}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent className="space-y-4">
          <Tabs
            value={roleTab}
            onChange={(_, value) => setRoleTab(value)}
            variant="fullWidth"
          >
            <Tab label="Student" />
            <Tab label="SME" />
            <Tab label="Company" />
          </Tabs>
          <TextField label="Name" fullWidth />
          <TextField label="Email" type="email" fullWidth />
          <TextField label="Password" type="password" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSignUpClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSignUpClose}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
