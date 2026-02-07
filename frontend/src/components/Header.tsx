"use client";

import { useState } from "react";
import Link from "next/link";
import { AppBar, Toolbar, Button, Container, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Header() {
    const { user, logout } = useAuth();
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/#about" },
        { name: "Features", path: "/#features" },
    ];

    return (
        <>
            <AppBar position="sticky" color="default" elevation={1} className="bg-white/80 backdrop-blur-md">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Logo Desktop */}
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontWeight: 700,
                                color: "primary.main",
                                textDecoration: "none",
                                letterSpacing: ".1rem",
                            }}
                        >
                            SkillNet
                        </Typography>

                        {/* Mobile Menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {navLinks.map((link) => (
                                    <MenuItem key={link.name} onClick={handleCloseNavMenu} component={Link} href={link.path}>
                                        <Typography textAlign="center">{link.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* Logo Mobile */}
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontWeight: 700,
                                color: "primary.main",
                                textDecoration: "none",
                            }}
                        >
                            SkillNet
                        </Typography>

                        {/* Desktop Nav */}
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center", gap: 4 }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </Box>

                        {/* Auth Buttons */}
                        <Box sx={{ flexGrow: 0 }}>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Typography variant="body2" className="hidden sm:block font-medium">
                                        Hello, {user.name}
                                    </Typography>
                                    <Button variant="outlined" color="primary" onClick={logout} size="small">
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => setOpenLogin(true)} color="inherit" className="hover:text-indigo-600">
                                        Sign In
                                    </Button>
                                    <Button variant="contained" onClick={() => setOpenSignup(true)} disableElevation>
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
            <SignupModal
                open={openSignup}
                onClose={() => setOpenSignup(false)}
                onSwitchToSignIn={() => {
                    setOpenSignup(false);
                    setOpenLogin(true);
                }}
            />
        </>
    );
}
