import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { reportPdf } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const ReportScreen = () => {
  const navigate = useNavigate();
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleUnauthorized } = useAuth();
  const token = localStorage.getItem("token");

  const handleDownload = async () => {
    if (!mes || !ano) {
      setError("Por favor, informe mês e ano");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await reportPdf(token, mes, ano, handleUnauthorized);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o relatório");
    } finally {
      setLoading(false);
    }
  };

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i);

  return (
    <Container maxWidth="sm" style={{ marginTop: "10rem" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2 }}
      >
        Voltar
      </Button>
      <Paper style={{ padding: "2rem" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Gerar Relatorio Mensal
        </Typography>

        {error && (
          <Typography
            color="error"
            align="center"
            style={{ marginBottom: "1rem" }}
          >
            {error}
          </Typography>
        )}

        <TextField
          select
          fullWidth
          label="Mes"
          margin="normal"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          {[...Array(12)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Ano"
          margin="normal"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          placeholder="2026"
        >
          {anos.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "2rem" }}
          onClick={handleDownload}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Gerar PDF
        </Button>
      </Paper>
    </Container>
  );
};

export default ReportScreen;
