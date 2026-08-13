// src/components/PrivateLayout.js
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import NavBar from "./NavBar";

const drawerWidth = 280;
const appBarHeight = 64;

export default function PrivateLayout({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar
        appBarHeight={appBarHeight}
        drawerWidth={drawerWidth}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          ml: isDesktop ? `${drawerWidth}px` : 0,
          pt: `${appBarHeight}px`,
        }}
      >
        <Toolbar sx={{ minHeight: "0 !important", display: "none" }} />
        <Box
          sx={{
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2, sm: 3 },
            maxWidth: 1440,
            mx: "auto",
            width: "100%",
          }}
        >
        {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
