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

export default function CreateUserScreen({ onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("EMPLOYEE");
  const [role, setRole] = useState("EMPLOYEE");
  const [active, setActive] = useState(true);
  const navigate = useNavigate();

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

      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao criar usuário");

      alert("Usuário criado com sucesso!");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Falha ao criar usuário");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: "6rem" }}>
      <Typography variant="h5" gutterBottom>
        Criar Usuário
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

      <TextField
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        select
        label="Tipo"
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
        label="Role"
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
        label="Usuário ativo"
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleBack}>
          Voltar
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Criar Usuário
        </Button>
      </Box>
    </Container>
  );
}
