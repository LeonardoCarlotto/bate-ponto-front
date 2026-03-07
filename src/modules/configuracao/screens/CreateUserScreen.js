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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("EMPLOYEE");
  const [role, setRole] = useState("EMPLOYEE");
  const [active, setActive] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };



  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
  };

  const validarFormulario = () => {
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
      setErro(t("validation.passwordMinLength") || "Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

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
        name: name.trim(),
        email: email.trim(),
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
        setErro("Token inválido ou expirado");
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
        if (onBack && typeof onBack === "function") {
          onBack();
        } else {
          navigate(-1);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setErro(err.message || "Falha ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>

      <Container maxWidth="dm">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {erro && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              {t("message.userCreateSuccess") || "Usuário criado com sucesso!"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
                  label={`${t("table.name")} *`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${t("table.email")} *`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={`${t("label.newPassword")} *`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  size="small"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* FOTO DO USUÁRIO */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                marginBottom: 2,
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              FOTO DO USUÁRIO
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

            {/* CONFIGURAÇÕES */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                marginBottom: 2,
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              CONFIGURAÇÕES
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t("label.type") || "Tipo"}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={loading}
                  size="small"
                >
                  <MenuItem value="ADMIN">{t("table.type.admin")}</MenuItem>
                  <MenuItem value="EMPLOYEE">{t("table.type.employee")}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={t("label.role") || "Função"}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  size="small"
                >
                  <MenuItem value="ADMIN">{t("table.type.admin")}</MenuItem>
                  <MenuItem value="EMPLOYEE">{t("table.type.employee")}</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={t("table.active")}
                />
              </Grid>
            </Grid>

            {/* AÇÕES */}
            <Box sx={{ borderTop: "1px solid #eee", paddingTop: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? "Criando..." : t("button.createUser")}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <BackButton
                    label="Cancelar"
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}