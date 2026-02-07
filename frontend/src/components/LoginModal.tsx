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
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type LoginModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const [roleTab, setRoleTab] = useState(0); // 0: Student, 1: SME, 2: Company
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSignIn = async () => {
        const payload = {
            email,
            password,
        };

        try {
            const res = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                login(data.token, data.user);
                onClose();

                // Redirect based on role
                const role = data.user.role;
                if (role === "Student") router.push("/student");
                else if (role === "SME") router.push("/sme");
                else if (role === "Company") router.push("/companies");
            } else {
                alert(data.error || "Invalid credentials.");
            }
        } catch (err) {
            console.error(err);
            alert("Error signing in.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Sign In</DialogTitle>
            <DialogContent className="space-y-4 pt-4">
                <Tabs value={roleTab} onChange={(_, v) => setRoleTab(v)} variant="fullWidth" className="mb-4">
                    <Tab label="Student" />
                    <Tab label="SME" />
                    <Tab label="Company" />
                </Tabs>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="dense"
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions className="px-6 pb-6">
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button variant="contained" onClick={handleSignIn} disableElevation>Sign In</Button>
            </DialogActions>
        </Dialog>
    );
}
