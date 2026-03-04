// src/NavBar.js
import { useState, useEffect } from "react";
import { API_URL, updateUserPhoto } from "./services/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [photoEditDialog, setPhotoEditDialog] = useState(false);
  const [photoEditPreview, setPhotoEditPreview] = useState("");
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }
        if (!response.ok) throw new Error("Erro ao buscar Colaborador");
        const data = await response.json();
        setUserName(data.name);
        setUserType(data.type);
        setUserPhoto(data.urlPhoto || "");
        setUserId(data.id);
      } catch (error) {
        console.error(error);
        setUserName("User");
      }
    }
    fetchUser();
  }, [handleUnauthorized]);

  const handleMenuClose = () => setAnchorEl(null);

  const openPhotoEditDialog = () => {
    setPhotoEditPreview(userPhoto);
    setPhotoEditDialog(true);
    handleMenuClose();
  };

  const closePhotoEditDialog = () => {
    setPhotoEditDialog(false);
    setPhotoEditPreview("");
  };

  const handlePhotoEditChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoEditPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) return;
      await updateUserPhoto(token, userId, photoEditPreview, handleUnauthorized);
      alert("Foto atualizada com sucesso!");
      setUserPhoto(photoEditPreview);
      closePhotoEditDialog();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao atualizar foto");
    }
  };

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
          <MenuItem onClick={openPhotoEditDialog}>
              Editar Foto
            </MenuItem>
          <MenuItem onClick={() => goTo("/change-password")}>
              {t("nav.changePassword")}
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

      <Dialog open={photoEditDialog} onClose={closePhotoEditDialog}>
        <DialogTitle>Editar sua foto</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 2 }}>
            <UserAvatar name={userName} urlPhoto={photoEditPreview} size={100} />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoEditChange}
              style={{ marginTop: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePhotoEditDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handlePhotoSave}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
