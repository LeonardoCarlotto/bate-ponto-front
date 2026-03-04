// src/NavBar.js
import { useState, useEffect } from "react";
import { API_URL } from "./services/api";
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
import { useTranslation } from "./i18n";
import { useAuth } from "./contexts/AuthContext";
import UserAvatar from "./components/UserAvatar";

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
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 403) {
          throw new Error("Acesso negado ao buscar dados do usuário");
        }
        if (!response.ok) throw new Error("Erro ao buscar Colaborador");
        const data = await response.json();
        setUserName(data.name);
        setUserType(data.type);
        setUserPhoto(data.urlPhoto || "");
      } catch (error) {
        handleUnauthorized();
        console.error(error);
        setUserName("User");
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
      <Toolbar>
        <Typography variant="h6">
          <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Registro de Ponto
          </a>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={(event) => setAnchorEl(event.currentTarget)}>
          <UserAvatar name={userName} urlPhoto={userPhoto} size={40} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {userName || "Carregando..."}
          </Typography>
        </Box>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => goTo("/")}>
            {t("nav.home")}
          </MenuItem>
          <MenuItem onClick={() => goTo("/edit-profile")}>
            Editar Perfil
          </MenuItem>
          {userType === "ADMIN" ? (
            <>
              <MenuItem onClick={() => goTo("/admin")}>
                {t("nav.editedRecords")}
              </MenuItem>
              <MenuItem onClick={() => goTo("/create-user")}>
                {t("nav.createUser")}
              </MenuItem>
              <MenuItem onClick={() => goTo("/users")}>
                {t("nav.listUsers")}
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={() => goTo("/report")}>
              {t("nav.report")}
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
