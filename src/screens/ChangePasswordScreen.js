import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeMyPassword } from "../services/api";
import { useTranslation } from "../i18n";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await changeMyPassword(token, currentPassword, newPassword);
      alert(t("message.passwordChanged"));
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || t("message.errorChangingPassword") || "Erro ao alterar senha");
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
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t("button.back")}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t("button.submit")}
        </Button>
      </Box>
    </Container>
  );
}