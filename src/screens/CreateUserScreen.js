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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateUserScreen({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("EMPLOYEE");
  const [role, setRole] = useState("EMPLOYEE");
  const [active, setActive] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
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

      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        throw new Error("Unauthorized");
      }

      if (!response.ok) throw new Error("Erro ao criar usuário");

      alert(t("message.userCreateSuccess"));
      onBack();
    } catch (err) {
      console.error(err);
      alert("Falha ao criar usuário");
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

      <TextField
        select
        label={t("label.type")}
        fullWidth
        margin="normal"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <MenuItem value="ADMIN">ADMIN</MenuItem>
        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
      </TextField>

      <TextField
        select
        label={t("label.role")}
        fullWidth
        margin="normal"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="ADMIN">ADMIN</MenuItem>
        <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
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
        <Button variant="outlined" onClick={handleBack}>
          {t("button.back")}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t("button.createUser")}
        </Button>
      </Box>
    </Container>
  );
}
