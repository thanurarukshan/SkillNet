"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar,
    Tab,
    Tabs
} from "@mui/material";
import { CheckCircle, Cancel, Business, PendingActions } from "@mui/icons-material";

interface HiringRequest {
    hr_id: number;
    project_id: number;
    team_id: number;
    sme_id: number;
    message: string;
    sme_email: string;
    sme_contact: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    responded_at: string | null;
    p_name: string;
    p_description: string;
    p_time_period: string;
    p_skills_req: string[];
    p_value_type: "fixed" | "discuss";
    p_value_amount: number | null;
    sme_name: string;
}

export default function HiringRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<HiringRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/teams/hiring-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            } else {
                console.error("Failed to fetch requests");
            }
        } catch (err) {
            console.error("Error fetching hiring requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/accept`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Hiring request accepted! The project has been assigned to your team.");
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to accept request");
            }
        } catch (err) {
            alert("Error accepting request");
        }
    };

    const handleReject = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/reject`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Hiring request rejected");
                fetchRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject request");
            }
        } catch (err) {
            alert("Error rejecting request");
        }
    };

    const pendingRequests = requests.filter((r) => r.status === "pending");
    const acceptedRequests = requests.filter((r) => r.status === "accepted");
    const rejectedRequests = requests.filter((r) => r.status === "rejected");

    const displayRequests =
        activeTab === 0 ? pendingRequests : activeTab === 1 ? acceptedRequests : rejectedRequests;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
            {/* HEADER */}
            <AppBar position="static" sx={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                <Toolbar>
                    <Business sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Hiring Requests
                    </Typography>
                    <Button color="inherit" onClick={() => router.push("/student/teams")}>
                        Back to Teams
                    </Button>
                </Toolbar>
            </AppBar>

            <Box p={4} maxWidth={1200} mx="auto">
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Team Hiring Requests
                </Typography>

                {/* TABS */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                        <Tab
                            label={`Pending (${pendingRequests.length})`}
                            icon={<PendingActions />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Accepted (${acceptedRequests.length})`}
                            icon={<CheckCircle />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Rejected (${rejectedRequests.length})`}
                            icon={<Cancel />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {displayRequests.length === 0 ? (
                    <Alert severity="info">
                        No {activeTab === 0 ? "pending" : activeTab === 1 ? "accepted" : "rejected"} requests
                    </Alert>
                ) : (
                    <Stack spacing={3}>
                        {displayRequests.map((req) => (
                            <Card key={req.hr_id} sx={{ ":hover": { boxShadow: 4 } }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                                            <Box flex={1}>
                                                <Typography variant="h5" fontWeight="bold" mb={1}>
                                                    {req.p_name}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" mb={2}>
                                                    {req.p_description}
                                                </Typography>

                                                <Stack direction="row" spacing={2} mb={2}>
                                                    <Chip
                                                        label={`Status: ${req.status.toUpperCase()}`}
                                                        color={
                                                            req.status === "accepted" ? "success" : req.status === "rejected" ? "error" : "warning"
                                                        }
                                                        size="small"
                                                    />
                                                    <Chip label={`Duration: ${req.p_time_period}`} size="small" variant="outlined" />
                                                    <Chip
                                                        label={
                                                            req.p_value_type === "fixed"
                                                                ? `Value: $${req.p_value_amount?.toLocaleString()}`
                                                                : "Value: Discuss"
                                                        }
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Stack>

                                                <Box mb={2}>
                                                    <Typography variant="body2" fontWeight="bold" mb={0.5}>
                                                        Required Skills:
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                        {req.p_skills_req.map((skill, idx) => (
                                                            <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                                                        ))}
                                                    </Stack>
                                                </Box>

                                                <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mb: 2 }}>
                                                    <Typography variant="body2" fontWeight="bold" mb={1}>
                                                        From: {req.sme_name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                                        📧 {req.sme_email}
                                                    </Typography>
                                                    {req.sme_contact && (
                                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                                            📞 {req.sme_contact}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" mt={2}>
                                                        <strong>Message:</strong> {req.message}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="caption" color="text.secondary">
                                                    Received: {new Date(req.created_at).toLocaleString()}
                                                </Typography>
                                                {req.responded_at && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        Responded: {new Date(req.responded_at).toLocaleString()}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {req.status === "pending" && (
                                                <Stack spacing={1} ml={2}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<CheckCircle />}
                                                        onClick={() => handleAccept(req.hr_id)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Cancel />}
                                                        onClick={() => handleReject(req.hr_id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
