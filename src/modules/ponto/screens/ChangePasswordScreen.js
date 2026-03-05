import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeMyPassword } from "../services/api";
import { useTranslation } from "../../../shared/i18n";
import { useAuth } from "../contexts/AuthContext";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await changeMyPassword(token, currentPassword, newPassword, handleUnauthorized);
      alert(t("message.passwordChanged"));
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || t("message.errorChangingPassword") || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "6rem" }}>
      <Typography variant="h5" gutterBottom>
        {t("screen.changePassword.title")}
      </Typography>

      <TextField
        label={t("label.currentPassword")}
        type="password"
        fullWidth
        margin="normal"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <TextField
        label={t("label.newPassword")}
        type="password"
        fullWidth
        margin="normal"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
          {t("button.back")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {t("button.submit")}
        </Button>
      </Box>
    </Container>
  );
}