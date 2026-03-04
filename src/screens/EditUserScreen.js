import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Input,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
      const timeout = 30000;
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = {
        name,
        email,
      };

      if (photoPreview) {
        payload.urlPhoto = photoPreview;
      }

      await updateUserProfile(token, payload, handleUnauthorized);
      setSuccessMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (!currentPassword || !newPassword) {
        setError("Preencha os campos de senha");
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("As senhas não conferem");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      await changeMyPassword(token, currentPassword, newPassword, handleUnauthorized);
      setSuccessMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "8rem", mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Editar Perfil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}

      {/* Foto */}
      <Box sx={{ mt: 3, mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Foto de Perfil
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
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

      {/* Nome e Email */}
      <Box sx={{ mt: 3, mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Informações Pessoais
        </Typography>

        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSaveProfile}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          Salvar Perfil
        </Button>
      </Box>

      {/* Alterar Senha */}
      <Box sx={{ mt: 3, mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Alterar Senha
        </Typography>

        <TextField
          label="Senha Atual"
          type="password"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <TextField
          label="Nova Senha"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <TextField
          label="Confirmar Senha"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleChangePassword}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 2 }}
        >
          Alterar Senha
        </Button>
      </Box>

      {/* Voltar */}
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>
    </Container>
  );
}
