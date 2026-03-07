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
  Card,
  Alert,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackButton from "../../../shared/components/BackButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useTranslation } from "../../../shared/i18n";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateUserScreen({ onBack }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "EMPLOYEE",
    role: "EMPLOYEE",
    active: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErro(null);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErro("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setErro(null);
    };
    reader.readAsDataURL(file);
  };

  const validarFormulario = () => {
    const { name, email, password } = formData;

    if (!name.trim()) {
      setErro(t("validation.nameRequired") || "Nome é obrigatório");
      return false;
    }

    if (!email.trim()) {
      setErro(t("validation.emailRequired") || "Email é obrigatório");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro(t("validation.emailInvalid") || "Email inválido");
      return false;
    }

    if (!password.trim()) {
      setErro(t("validation.passwordRequired") || "Senha é obrigatória");
      return false;
    }

    if (password.length < 6) {
      setErro(
        t("validation.passwordMinLength") ||
          "Senha deve ter no mínimo 6 caracteres"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Token não encontrado. Faça login novamente.");
        return;
      }

      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
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
        return;
      }

      if (response.status === 403) {
        setErro("Você não tem permissão para criar usuários");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao criar usuário");
      }

      setSucesso(true);

      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          navigate(-1);
        }
      }, 1200);
    } catch (err) {
      setErro(err.message || "Falha ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>

      <Container maxWidth="md">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {t("message.userCreateSuccess") || "Usuário criado com sucesso!"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h5" fontWeight={600} mb={3}>
             Novo Usuário
            </Typography>
            {/* INFORMAÇÕES */}
            <Typography variant="subtitle2" sx={{ color: "#666", mb: 2, fontWeight: 600 }}>
              INFORMAÇÕES PESSOAIS
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${t("table.name")} *`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  size="small"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${t("table.email")} *`}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  size="small"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${t("label.newPassword")} *`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  size="small"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* FOTO */}
            <Typography variant="subtitle2" sx={{ color: "#666", mb: 2, fontWeight: 600 }}>
              FOTO DO USUÁRIO
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={photoPreview}
                    sx={{ width: 80, height: 80 }}
                  >
                    {formData.name?.slice(0, 2).toUpperCase() || "?"}
                  </Avatar>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                    disabled={loading}
                  >
                    Escolher Foto
                    <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* CONFIGURAÇÕES */}
            <Typography variant="subtitle2" sx={{ color: "#666", mb: 2, fontWeight: 600 }}>
              CONFIGURAÇÕES
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label={t("label.type") || "Tipo"}
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  size="small"
                  disabled={loading}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label={t("label.role") || "Função"}
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  size="small"
                  disabled={loading}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.active}
                      name="active"
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  }
                  label={t("table.active")}
                />
              </Grid>
            </Grid>

            {/* BOTÕES */}
            <Box sx={{ borderTop: "1px solid #eee", pt: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    startIcon={
                      loading ? <CircularProgress size={18} /> : <SaveIcon />
                    }
                    disabled={loading}
                  >
                    {loading ? "Criando..." : t("button.createUser")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}