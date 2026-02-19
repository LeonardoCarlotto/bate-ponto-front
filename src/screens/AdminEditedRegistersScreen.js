import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminEditedRegistersScreen({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    async function fetchEditedRegisters() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/registers/edited/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao buscar registros");

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEditedRegisters();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Registros Editados
      </Typography>

      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Voltar
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Colaborador</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Observação</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>{record.userEmail}</TableCell>
                  <TableCell>
                    {record.date} ({record.dayOfWeek})
                  </TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.type}
                      color={record.type === "ENTRADA" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.observation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}