import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Avatar,
  Input,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateUserScreen({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("EMPLOYEE");
  const [role, setRole] = useState("EMPLOYEE");
  const [active, setActive] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        name,
        email,
        password,
        type,
        role,
        active,
      };

      if (photoPreview) {
        payload.urlPhoto = photoPreview;
      }

      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleUnauthorized();
        throw new Error("Token inv�lido ou expirado");
      }

      if (response.status === 403) {
        throw new Error("Voc� n�o tem permiss�o para criar usu�rios");
      }

      if (!response.ok) throw new Error("Erro ao criar usu�rio");

      alert(t("message.userCreateSuccess"));
      if (onBack && typeof onBack === "function") {
        onBack();
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao criar usuá¡rio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "6rem" }}>
      <Typography variant="h5" gutterBottom>
        {t("button.createUser")}
      </Typography>

      <TextField
        label={t("table.name")}
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label={t("table.email")}
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label={t("label.newPassword")}
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Foto do Usu�rio
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={photoPreview}
            alt={name}
            sx={{ width: 80, height: 80 }}
          >
            {name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <TextField
        select
        label={t("label.type")}
        fullWidth
        margin="normal"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <MenuItem value="ADMIN">{t("table.type.admin")}</MenuItem>
        <MenuItem value="EMPLOYEE">{t("table.type.employee")}</MenuItem>
      </TextField>

      <TextField
        select
        label={t("label.role")}
        fullWidth
        margin="normal"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="ADMIN">{t("table.type.admin")}</MenuItem>
        <MenuItem value="EMPLOYEE">{t("table.type.employee")}</MenuItem>
      </TextField>

      <FormControlLabel
        control={
          <Checkbox
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        }
        label={t("table.active")}
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleBack} disabled={loading}>
          {t("button.back")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t("button.createUser")}
        </Button>
      </Box>
    </Container>
  );
}
