// src/NavBar.js
import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

export default function NavBar({ onLogout }) {
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(""); // ADMIN ou EMPLOYEE
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao buscar Colaborador");
        const data = await response.json();
        setUserName(data.name);
        setUserType(data.type);
      } catch (error) {
        console.error(error);
        setUserName("User");
      }
    }
    fetchUser();
  }, []);

  const handleMenuOpen = (event) => {
    if (userType === "ADMIN") setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const goTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">
          <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Sistema de ponto
          </a>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={handleMenuOpen}>
          {userName || "Carregando..."}
        </Button>

        {userType === "ADMIN" && (
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => goTo("/admin")}>
              Registros Editados
            </MenuItem>
            <MenuItem onClick={() => goTo("/create-user")}>
              Criar Colaborador
            </MenuItem>
          </Menu>
        )}

        <Button color="inherit" onClick={onLogout} sx={{ marginLeft: 2 }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}