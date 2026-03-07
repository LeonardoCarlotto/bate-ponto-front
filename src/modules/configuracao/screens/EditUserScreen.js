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
  InputAdornment,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackButton from "../../../shared/components/BackButton";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile, changeMyPassword, API_URL } from "../services/api";

export default function EditUserScreen() {
  const { handleUnauthorized } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingUser, setLoadingUser] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) throw new Error();

        const data = await response.json();

        setName(data.name || "");
        setEmail(data.email || "");
        setPhotoPreview(data.urlPhoto || "");
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do usuário");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [handleUnauthorized]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return setError("Nome é obrigatório");
    if (!email.trim()) return setError("Email é obrigatório");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Email inválido");

    setSavingProfile(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: name.trim(),
        email: email.trim(),
        urlPhoto: photoPreview || undefined,
      };

      await updateUserProfile(token, payload, handleUnauthorized);

      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) return setError("Preencha a senha atual");
    if (!newPassword.trim()) return setError("Preencha a nova senha");

    if (newPassword.length < 6)
      return setError("Senha deve ter no mínimo 6 caracteres");

    if (newPassword !== confirmPassword)
      return setError("As senhas não conferem");

    setSavingPassword(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      await changeMyPassword(
        token,
        currentPassword,
        newPassword,
        handleUnauthorized
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
      setSavingPassword(false);
    }
  };

  if (loadingUser) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>

      <Container maxWidth="md">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* PERFIL */}
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Editar Perfil
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            FOTO DE PERFIL
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar src={photoPreview} sx={{ width: 80, height: 80 }}>
              {name?.slice(0, 2).toUpperCase() || "?"}
            </Avatar>

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              Escolher Foto
              <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            INFORMAÇÕES PESSOAIS
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={
                savingProfile ? <CircularProgress size={18} /> : <SaveIcon />
              }
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? "Salvando..." : "Salvar Informações"}
            </Button>
          </Box>
        </Card>

        {/* SENHA */}
        <Card sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            ALTERAR SENHA
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha Atual"
                type={showPassword.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePassword("current")}>
                        {showPassword.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nova Senha"
                type={showPassword.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePassword("new")}>
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Senha"
                type={showPassword.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePassword("confirm")}>
                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={
                savingPassword ? <CircularProgress size={18} /> : <SaveIcon />
              }
              onClick={handleChangePassword}
              disabled={savingPassword}
            >
              {savingPassword ? "Alterando..." : "Alterar Senha"}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}