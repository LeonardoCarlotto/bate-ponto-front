import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar({ onLogout }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserName() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar usuário");

        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error(error);
        setUserName("User");
      }
    }

    fetchUserName();
  }, []);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">
          Sistema de Ponto
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          color="inherit"
          startIcon={<AccountCircleIcon />}
        >
          {userName || "Carregando..."}
        </Button>

        <Button
          color="inherit"
          onClick={onLogout}
          sx={{ marginLeft: 2 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}