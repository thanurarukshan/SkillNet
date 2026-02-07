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

type SignupModalProps = {
    open: boolean;
    onClose: () => void;
    onSwitchToSignIn: () => void;
};

export default function SignupModal({ open, onClose, onSwitchToSignIn }: SignupModalProps) {
    const [roleTab, setRoleTab] = useState(0); // 0: Student, 1: SME, 2: Company
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [academicYear, setAcademicYear] = useState("");

    // Company fields
    const [companyRegistrationNo, setCompanyRegistrationNo] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");

    // SME fields
    const [smeRegistrationNo, setSmeRegistrationNo] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [smeIndustry, setSmeIndustry] = useState("");

    const getRole = () => {
        if (roleTab === 0) return "Student";
        if (roleTab === 1) return "SME";
        return "Company";
    };

    interface SignupPayload {
        role: string;
        name: string;
        email: string;
        password: string;
        department?: string;
        academicYear?: string;
        companyRegistrationNo?: string;
        companyType?: string;
        industry?: string;
        businessType?: string;
    }

    const handleSignUp = async () => {
        const payload: SignupPayload = {
            role: getRole(),
            name,
            email,
            password,
        };

        // Only include for Students
        if (getRole() === "Student") {
            payload.department = department;
            payload.academicYear = academicYear;
        }

        // Only include for Company
        if (getRole() === "Company") {
            payload.companyRegistrationNo = companyRegistrationNo;
            payload.companyType = companyType;
            payload.industry = companyIndustry;
        }

        // Only include for SME
        if (getRole() === "SME") {
            payload.companyRegistrationNo = smeRegistrationNo;
            payload.businessType = businessType;
            payload.industry = smeIndustry;
        }

        try {
            const res = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Signup successful! Please sign in.");
                onClose();
                onSwitchToSignIn();
            } else {
                alert(data.error || "Signup failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Error signing up.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogContent className="space-y-4 pt-4">
                <Tabs value={roleTab} onChange={(_, v) => setRoleTab(v)} variant="fullWidth" className="mb-4">
                    <Tab label="Student" />
                    <Tab label="SME" />
                    <Tab label="Company" />
                </Tabs>
                <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="dense"
                />
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
                {/* Only show for Students */}
                {getRole() === "Student" && (
                    <>
                        <TextField
                            label="Department"
                            fullWidth
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            margin="dense"
                        />
                        <TextField
                            label="Academic Year"
                            fullWidth
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            margin="dense"
                        />
                    </>
                )}
                {/* Company fields */}
                {getRole() === "Company" && (
                    <>
                        <TextField
                            label="Company Registration Number"
                            fullWidth
                            value={companyRegistrationNo}
                            onChange={(e) => setCompanyRegistrationNo(e.target.value)}
                            margin="dense"
                        />
                        <TextField
                            select
                            label="Company Type"
                            fullWidth
                            value={companyType}
                            onChange={(e) => setCompanyType(e.target.value)}
                            margin="dense"
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
                            value={companyIndustry}
                            onChange={(e) => setCompanyIndustry(e.target.value)}
                            margin="dense"
                        />
                    </>
                )}
                {/* SME fields */}
                {getRole() === "SME" && (
                    <>
                        <TextField
                            label="Business Registration Number"
                            fullWidth
                            value={smeRegistrationNo}
                            onChange={(e) => setSmeRegistrationNo(e.target.value)}
                            margin="dense"
                        />
                        <TextField
                            label="Business Type"
                            fullWidth
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            margin="dense"
                        />
                        <TextField
                            label="Industry"
                            fullWidth
                            value={smeIndustry}
                            onChange={(e) => setSmeIndustry(e.target.value)}
                            margin="dense"
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions className="px-6 pb-6">
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button variant="contained" onClick={handleSignUp} disableElevation>Sign Up</Button>
            </DialogActions>
        </Dialog>
    );
}
