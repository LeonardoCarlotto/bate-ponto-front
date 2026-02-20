import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { reportPdf } from "../services/api";

const ReportScreen = () => {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleDownload = async () => {
    if (!mes || !ano) {
      setError("Por favor, informe mês e ano");
      return;
    }
    setError("");
    try {
      await reportPdf(token, mes, ano);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar o relatório");
    }
  };

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 5 }, (_, i) => anoAtual - i);

  return (
    <Container maxWidth="sm" style={{ marginTop: "10rem" }}>
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
        >
          Gerar PDF
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          style={{ marginTop: "2rem" }}
          href="/"
        >
          Voltar
        </Button>
      </Paper>
    </Container>
  );
};

export default ReportScreen;
