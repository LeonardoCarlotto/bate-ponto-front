import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "../../../shared/components/BackButton";
import { fornecedoresService } from "../services/api";

export default function ListaFornecedoresScreen() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = React.useState([]);
  const [carregando, setCarregando] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [fornecedorParaDeletar, setFornecedorParaDeletar] =
    React.useState(null);

  React.useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      setCarregando(true);
      const dados = await fornecedoresService.listar();
      setFornecedores(dados);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleNovoFornecedor = () => {
    navigate("/fornecedores/cadastro");
  };

  const handleEditar = (id) => {
    navigate(`/fornecedores/cadastro/${id}`);
  };

  const handleAbrirDialogDeletar = (fornecedor) => {
    setFornecedorParaDeletar(fornecedor);
    setDialogOpen(true);
  };

  const handleConfirmarDelecao = async () => {
    try {
      setDialogOpen(false);
      await fornecedoresService.deletar(fornecedorParaDeletar.id);
      await carregarFornecedores();
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      alert("Erro ao deletar fornecedor");
    }
    setFornecedorParaDeletar(null);
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ paddingX: 2 }}>
      <Box>
        <BackButton to="/produtos" />
      </Box>
      <Container maxWidth="lg">
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <Typography variant="h5">Gerenciar Fornecedores</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNovoFornecedor}
            >
              Novo Fornecedor
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        Nenhum fornecedor cadastrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fornecedores.map((fornecedor) => (
                    <TableRow key={fornecedor.id} hover>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.email}</TableCell>
                      <TableCell>{fornecedor.telefone}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditar(fornecedor.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleAbrirDialogDeletar(fornecedor)}
                        >
                          Deletar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tem certeza que deseja deletar o fornecedor "
                {fornecedorParaDeletar?.nome}"? Esta ação não pode ser desfeita.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleConfirmarDelecao}
                color="error"
                variant="contained"
              >
                Deletar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
}
