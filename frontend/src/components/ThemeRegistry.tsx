"use client"; // Ensures this component is only rendered on the client

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // This ensures that MUI ThemeProvider only renders after the client mounts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR/client mismatch

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
