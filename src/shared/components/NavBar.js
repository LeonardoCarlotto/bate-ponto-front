// src/NavBar.js
import { useState, useEffect } from "react";
import { API_URL } from "../../modules/configuracao/services/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "../i18n";
import { useAuth } from "../../modules/configuracao/contexts/AuthContext";
import UserAvatar from "./UserAvatar";

// Importando logo da empresa
import Logo from "../assets/logo.png"; // coloque seu logo em src/assets/logo.png

export default function NavBar({ onLogout }) {
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState(""); // ADMIN ou EMPLOYEE
  const [userPhoto, setUserPhoto] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchUser() {
      const timeout = 15000;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 403) throw new Error("Acesso negado");
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const data = await response.json();
        setUserName(data.name);
        setUserType(data.type);
        setUserPhoto(data.urlPhoto || "");
      } catch (error) {
        handleUnauthorized();
        console.error(error);
        setUserName("User");
      } finally {
        clearTimeout(id);
      }
    }
    fetchUser();
  }, [handleUnauthorized]);

  const handleMenuClose = () => setAnchorEl(null);
  const goTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo da empresa */}
        <Box
          component="img"
          src={Logo}
          alt="Logo da Empresa"
          sx={{ height: 50, cursor: "pointer" }}
          onClick={() => navigate("/")}
        />

        {/* Menu do usuário */}

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => goTo("/configuracao/edit-profile")}>
            Editar Perfil
          </MenuItem>
          {userType === "ADMIN" ? (
            <>
              <MenuItem onClick={() => goTo("/configuracao/admin")}>
                {t("nav.editedRecords")}
              </MenuItem>
              <MenuItem onClick={() => goTo("/configuracao/create-user")}>
                {t("nav.createUser")}
              </MenuItem>
              <MenuItem onClick={() => goTo("/configuracao/users")}>
                {t("nav.listUsers")}
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => goTo("/configuracao/report")}>
              {t("nav.report")}
            </MenuItem>
          )}
        </Menu>

        {/* Botões Home e Logout */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "center" }}
          >
            <UserAvatar name={userName} urlPhoto={userPhoto} size={40} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {userName || "Carregando..."}
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
          >
            HOME
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>
            SAIR
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
