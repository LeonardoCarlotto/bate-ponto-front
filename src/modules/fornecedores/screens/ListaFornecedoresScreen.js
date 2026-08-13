import React from "react";
import {
  useNavigate } from "react-router-dom";
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
  TextField,
  InputAdornment,
  Alert,
  Chip
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BackButton from "../../../shared/components/BackButton";
import { fornecedoresService } from "../services/api";

export default function ListaFornecedoresScreen() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = React.useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = React.useState([]);
  const [carregando, setCarregando] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [fornecedorParaDeletar, setFornecedorParaDeletar] =
    React.useState(null);
  const [termoBusca, setTermoBusca] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");
  const [excluindo, setExcluindo] = React.useState(false);

  React.useEffect(() => {
    carregarFornecedores();
  }, []);

  React.useEffect(() => {
    if (termoBusca.trim() === "") {
      setFornecedoresFiltrados(fornecedores);
    } else {
      const filtrados = fornecedores.filter(fornecedor => 
        fornecedor.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        fornecedor.cnpj?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        fornecedor.email?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        fornecedor.telefone?.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setFornecedoresFiltrados(filtrados);
    }
  }, [termoBusca, fornecedores]);

  const carregarFornecedores = async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await fornecedoresService.listar();
      setFornecedores(dados);
      setFornecedoresFiltrados(dados);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      setErro(error.message);
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
      setExcluindo(true);
      setErro("");
      setMensagem("");
      await fornecedoresService.deletar(fornecedorParaDeletar.id);
      await carregarFornecedores();
      setMensagem("Fornecedor inativado com sucesso");
      setDialogOpen(false);
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      setErro(error.message);
    } finally {
      setExcluindo(false);
      setFornecedorParaDeletar(null);
    }
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

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {erro && (
              <Grid item xs={12}>
                <Alert severity="error" onClose={() => setErro("")}>
                  {erro}
                </Alert>
              </Grid>
            )}
            {mensagem && (
              <Grid item xs={12}>
                <Alert severity="success" onClose={() => setMensagem("")}>
                  {mensagem}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por nome, CNPJ, email ou telefone..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>CNPJ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedoresFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        {termoBusca.trim() === "" ? "Nenhum fornecedor cadastrado" : "Nenhum fornecedor encontrado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fornecedoresFiltrados.map((fornecedor) => (
                    <TableRow key={fornecedor.id} hover>
                      <TableCell>{fornecedor.nome}</TableCell>
                      <TableCell>{fornecedor.cnpj}</TableCell>
                      <TableCell>{fornecedor.email}</TableCell>
                      <TableCell>{fornecedor.telefone}</TableCell>
                      <TableCell>
                        <Chip
                          label={fornecedor.ativo === false ? "Inativo" : "Ativo"}
                          color={fornecedor.ativo === false ? "default" : "success"}
                          size="small"
                        />
                      </TableCell>
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
                          disabled={fornecedor.ativo === false}
                        >
                          Inativar
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
                Tem certeza que deseja inativar o fornecedor "
                {fornecedorParaDeletar?.nome}"? Ele continuará no histórico,
                mas ficará marcado como inativo.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleConfirmarDelecao}
                color="error"
                variant="contained"
                disabled={excluindo}
              >
                {excluindo ? "Inativando..." : "Inativar"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
}
