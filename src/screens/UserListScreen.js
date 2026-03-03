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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllUsers, changeUserPassword } from "../services/api";
import { useTranslation } from "../i18n";
import { useAuth } from "../contexts/AuthContext";

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
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

  const handleChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedUser) return;
      await changeUserPassword(token, selectedUser.id, newPassword, handleUnauthorized);
      alert(t("message.passwordChanged"));
      closeDialog();
    } catch (err) {
      console.error(err);
      alert(err.message || t("message.errorChangingPassword") || "Erro ao alterar senha");
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
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("table.id")}</TableCell>
                <TableCell>{t("table.name")}</TableCell>
                <TableCell>{t("table.email")}</TableCell>
                <TableCell>{t("table.type")}</TableCell>
                <TableCell>{t("table.role")}</TableCell>
                <TableCell>{t("table.active")}</TableCell>
                <TableCell>{t("table.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.active ? t("table.yes") : t("table.no")}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openDialog(user)}
                    >
                      Alterar senha
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
          <Button onClick={closeDialog}>{t("button.back")}</Button>
          <Button variant="contained" onClick={handleChange}>
            {t("button.submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
