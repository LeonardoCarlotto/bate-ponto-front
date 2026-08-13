import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BackButton from "../../../shared/components/BackButton";
import { pedidosService } from "../services/api";

export default function PedidosScreen() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = React.useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = React.useState([]);
  const [termoBusca, setTermoBusca] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [erro, setErro] = React.useState(null);
  const [mensagem, setMensagem] = React.useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'preparacao':
        return 'warning';
      case 'entregue':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PREPARACAO':
        return 'Em preparação';
      case 'ENTREGUE':
        return 'Entregue';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  React.useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await pedidosService.listar();
        setPedidos(dados || []);
        setPedidosFiltrados(dados || []);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setErro(error.message || 'Erro ao carregar pedidos. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  React.useEffect(() => {
    if (termoBusca.trim() === "") {
      setPedidosFiltrados(pedidos);
    } else {
      const filtrados = pedidos.filter(pedido => {
        const clienteNome = pedido.clienteNome || '';
        const searchTerm = termoBusca.toLowerCase();
        
        return (
          clienteNome.toLowerCase().includes(searchTerm) ||
          pedido.status?.toLowerCase().includes(searchTerm) ||
          pedido.id?.toString().includes(searchTerm)
        );
      });
      setPedidosFiltrados(filtrados);
    }
  }, [termoBusca, pedidos]);

  const handleNovoPedido = () => {
    navigate("/comercial/pedidos/novo");
  };

  const handleEditar = (pedidoId) => {
    navigate(`/comercial/pedidos/editar/${pedidoId}`);
  };

  const handleVisualizar = (pedidoId) => {
    navigate(`/comercial/pedidos/visualizar/${pedidoId}`);
  };

  const handleDeletar = async (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        setErro(null);
        setMensagem(null);
        await pedidosService.deletar(pedidoId);
        // Recarregar a lista
        const dados = await pedidosService.listar();
        setPedidos(dados || []);
        setPedidosFiltrados(dados || []);
        setMensagem('Pedido cancelado com sucesso');
      } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        setErro(error.message || 'Erro ao cancelar pedido. Tente novamente.');
      }
    }
  };

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/comercial" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5">Gerenciar Pedidos</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNovoPedido}
          >
            Novo Pedido
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por ID, cliente ou status..."
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

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErro(null)}>
            {erro}
          </Alert>
        )}

        {mensagem && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMensagem(null)}>
            {mensagem}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando pedidos...
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        {termoBusca.trim() === "" ? "Nenhum pedido cadastrado" : "Nenhum pedido encontrado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>
                        {pedido.clienteNome || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(pedido.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(pedido.status)} 
                          color={getStatusColor(pedido.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        R$ {parseFloat(pedido.valor || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="info"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleVisualizar(pedido.id)}
                          sx={{ mr: 1 }}
                        >
                          Visualizar
                        </Button>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditar(pedido.id)}
                          sx={{ mr: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeletar(pedido.id)}
                          disabled={pedido.status === 'CANCELADO'}
                        >
                          Cancelar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
