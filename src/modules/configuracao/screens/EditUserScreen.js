import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Card,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile, changeMyPassword, API_URL } from "../services/api";

export default function EditUserScreen() {
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
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

        if (!response.ok) throw new Error("Erro ao buscar dados do usuário");

        const data = await response.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhotoPreview(data.urlPhoto || "");
      } catch (err) {
        handleUnauthorized();
        console.error(err);
        setError("Erro ao carregar dados do usuário");
      } finally {
        clearTimeout(id);
      }
    };

    fetchUserData();
  }, [handleUnauthorized]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!email.trim()) {
      setError("Email é obrigatório");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        name: name.trim(),
        email: email.trim(),
      };

      if (photoPreview) {
        payload.urlPhoto = photoPreview;
      }

      await updateUserProfile(token, payload, handleUnauthorized);
      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      setError("Preencha a senha atual");
      return;
    }
    if (!newPassword.trim()) {
      setError("Preencha a nova senha");
      return;
    }
    if (newPassword.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await changeMyPassword(
        token,
        currentPassword,
        newPassword,
        handleUnauthorized,
      );
      setSuccessMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          Voltar
        </Button>
      </Box>

      <Container maxWidth="dm">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* FOTO DE PERFIL */}
          <Typography
            variant="subtitle2"
            sx={{
              color: "#666",
              marginBottom: 2,
              fontWeight: 600,
              marginTop: 1,
            }}
          >
            FOTO DE PERFIL
          </Typography>

          <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={photoPreview}
                  alt={name}
                  sx={{ width: 80, height: 80 }}
                >
                  {name?.slice(0, 2).toUpperCase() || "?"}
                </Avatar>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                  size="small"
                >
                  Escolher Foto
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* INFORMAÇÕES PESSOAIS */}
          <Typography
            variant="subtitle2"
            sx={{
              color: "#666",
              marginBottom: 2,
              fontWeight: 600,
              marginTop: 1,
            }}
          >
            INFORMAÇÕES PESSOAIS
          </Typography>

          <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                size="small"
              />
            </Grid>
          </Grid>
          <Box sx={{ paddingTop: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Informações"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
        <Card sx={{ p: { xs: 2, sm: 2 }, marginTop: 2 }}>
          {/* ALTERAR SENHA */}
          <Typography
            variant="subtitle2"
            sx={{
              color: "#666",
              marginBottom: 2,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            ALTERAR SENHA
          </Typography>

          <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha Atual *"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha *"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Senha *"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                size="small"
              />
            </Grid>
          </Grid>
          <Box sx={{ paddingTop: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
