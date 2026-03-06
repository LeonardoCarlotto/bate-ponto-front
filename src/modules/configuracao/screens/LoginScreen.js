import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);

      // salva token
      localStorage.setItem("token", data.token);

      navigate("/", { replace: true });
      onLogin(); // avisa App que logou
    } catch (err) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
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
          label="Alterar senha"
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
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Entrar
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginScreen;