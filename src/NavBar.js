// src/NavBar.js
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

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

        <Button
          color="inherit"
          startIcon={<AccountCircleIcon />}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {userName || "Carregando..."}
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => goTo("/")}>
              Inicio
            </MenuItem>
          {userType === "ADMIN" ? (
            <>
              <MenuItem onClick={() => goTo("/admin")}>
                Registros Editados
              </MenuItem>
              <MenuItem onClick={() => goTo("/create-user")}>
                Criar Colaborador
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => goTo("/report")}>
              Gerar Relatorio
            </MenuItem>
          )}
        </Menu>

        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ marginLeft: 2 }}
        >
          SAIR
        </Button>
      </Toolbar>
    </AppBar>
  );
}
