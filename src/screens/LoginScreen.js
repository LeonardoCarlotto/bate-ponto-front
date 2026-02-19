import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { login } from "../services/api";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login(email, password);

      // salva token
      localStorage.setItem("token", data.token);

      onLogin(); // avisa App que logou
    } catch (err) {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "10rem" }}>
      <Paper style={{ padding: "2rem" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          type="password"
          label="Senha"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          style={{ marginTop: "1rem" }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginScreen;