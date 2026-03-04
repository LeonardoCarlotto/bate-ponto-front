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
import { useTranslation } from "../i18n";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function AdminEditedRegistersScreen({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

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

        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          throw new Error("Unauthorized");
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
      <Typography variant="h5" gutterBottom>
        {t("screen.adminEdited.title")}
      </Typography>

      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        {t("button.back")}
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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