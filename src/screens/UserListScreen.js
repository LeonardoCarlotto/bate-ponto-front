import React, { useEffect, useState, useCallback } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllUsers, changeUserPassword, getRegistersForUser } from "../services/api";
import { useTranslation } from "../i18n";
import { useAuth } from "../contexts/AuthContext";
import UserAvatar from "../components/UserAvatar";

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [reportDialog, setReportDialog] = useState(false);
  const [reportMes, setReportMes] = useState("");
  const [reportAno, setReportAno] = useState("");
  const [registersDialog, setRegistersDialog] = useState(false);
  const [userRegisters, setUserRegisters] = useState([]);
  const [loadingRegisters, setLoadingRegisters] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await getAllUsers(token, handleUnauthorized);
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Falha ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBack = () => {
    navigate(-1);
  };

  const openDialog = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setNewPassword("");
  };

  const openReportDialog = (user) => {
    setSelectedUser(user);
    setReportMes("");
    setReportAno("");
    setReportDialog(true);
  };

  const closeReportDialog = () => {
    setReportDialog(false);
    setSelectedUser(null);
  };

  const openRegistersDialog = async (user) => {
    setSelectedUser(user);
    setLoadingRegisters(true);
    setRegistersDialog(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await getRegistersForUser(token, user.id, handleUnauthorized);
      setUserRegisters(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar registros: " + err.message);
    } finally {
      setLoadingRegisters(false);
    }
  };

  const closeRegistersDialog = () => {
    setRegistersDialog(false);
    setSelectedUser(null);
    setUserRegisters([]);
  };

  const handleChange = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedUser) return;
      await changeUserPassword(token, selectedUser.id, newPassword, handleUnauthorized);
      alert(t("message.passwordChanged"));
      closeDialog();
    } catch (err) {
      console.error(err);
      alert(err.message || t("message.errorChangingPassword") || "Erro ao alterar senha");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReport = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedUser) return;
      if (!reportMes || !reportAno) {
        alert("Informe mês e ano");
        return;
      }
      // import the new API function dynamically to avoid circular
      const { reportPdfForUser } = await import("../services/api");
      await reportPdfForUser(token, selectedUser.id, reportMes, reportAno, handleUnauthorized);
      closeReportDialog();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao baixar relatório");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        {t("screen.userList.title")}
      </Typography>

      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        {t("button.back")}
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("table.id")}</TableCell>
                <TableCell></TableCell>
                <TableCell>{t("table.name")}</TableCell>
                <TableCell>{t("table.email")}</TableCell>
                <TableCell>{t("table.type")}</TableCell>
                <TableCell>{t("table.active")}</TableCell>
                <TableCell>{t("table.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <UserAvatar name={user.name} urlPhoto={user.urlPhoto} size={36} />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{
                    user.type === "EMPLOYEE"
                      ? t("table.type.employee")
                      : t("table.type.admin")
                  }</TableCell>
                              <TableCell>{user.active ? t("table.yes") : t("table.no")}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openDialog(user)}
                      sx={{ mr: 1 }}
                      disabled={loading || actionLoading}
                    >
                      Alterar senha
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openRegistersDialog(user)}
                      sx={{ mr: 1 }}
                    >
                      Registros
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => openReportDialog(user)}
                      disabled={loading || actionLoading}
                      startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      Relatório
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{t("nav.changePassword")} de {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("label.newPassword")}
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={actionLoading}>{t("button.back")}</Button>
          <Button
            variant="contained"
            onClick={handleChange}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {t("button.submit")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reportDialog} onClose={closeReportDialog}>
        <DialogTitle>Relatório de {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Mês"
            type="number"
            fullWidth
            margin="normal"
            value={reportMes}
            onChange={(e) => setReportMes(e.target.value)}
          />
          <TextField
            label="Ano"
            type="number"
            fullWidth
            margin="normal"
            value={reportAno}
            onChange={(e) => setReportAno(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReportDialog} disabled={actionLoading}>{t("button.back")}</Button>
          <Button
            variant="contained"
            onClick={handleReport}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Gerar PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={registersDialog} onClose={closeRegistersDialog} maxWidth="md" fullWidth>
        <DialogTitle>Registros de {selectedUser?.name}</DialogTitle>
        <DialogContent>
          {loadingRegisters ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : userRegisters.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Observação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userRegisters.map((reg, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{reg.date || "-"}</TableCell>
                      <TableCell>{reg.time || "-"}</TableCell>
                      <TableCell>{reg.type || "-"}</TableCell>
                      <TableCell>{reg.observation || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Nenhum registro encontrado</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRegistersDialog}>{t("button.back")}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
