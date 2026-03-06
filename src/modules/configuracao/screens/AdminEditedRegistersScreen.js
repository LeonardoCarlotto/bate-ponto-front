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
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import UserAvatar from "../../../shared/components/UserAvatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function AdminEditedRegistersScreen({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  useEffect(() => {
    async function fetchEditedRegisters() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/registers/edited/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          throw new Error("Token inv�lido ou expirado");
        }

        if (response.status === 403) {
          throw new Error("Voc� n�o tem permiss�o para acessar registros editados");
        }

        if (!response.ok) throw new Error(t("message.errorFetchingRecords"));

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEditedRegisters();
  }, [t, handleUnauthorized]); // include t and handleUnauthorized to satisfy eslint rules

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box sx={{ paddingX: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          Voltar
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        {t("screen.adminEdited.title")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t("table.name")}</TableCell>
                <TableCell>{t("table.email")}</TableCell>
                <TableCell>{t("table.date") || "Data"}</TableCell>
                <TableCell>{t("table.time") || "Hora"}</TableCell>
                <TableCell>{t("table.type")}</TableCell>
                <TableCell>{t("table.observation") || "Observação"}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <UserAvatar name={record.name} urlPhoto={record.urlPhoto} size={36} />
                  </TableCell>
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