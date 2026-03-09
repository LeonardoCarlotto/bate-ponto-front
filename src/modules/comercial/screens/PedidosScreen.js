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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BackButton from "../../../shared/components/BackButton";

export default function PedidosScreen() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = React.useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = React.useState([]);
  const [termoBusca, setTermoBusca] = React.useState("");

  React.useEffect(() => {
    // Simulação de dados - substituir com chamada real à API
    const dadosSimulados = [
      { id: 1, cliente: "João Silva", status: "Pendente", total: 150.00, dataPedido: "2024-01-15" },
      { id: 2, cliente: "Maria Santos", status: "Concluído", total: 320.50, dataPedido: "2024-01-14" },
      { id: 3, cliente: "Pedro Costa", status: "Em Andamento", total: 89.90, dataPedido: "2024-01-13" },
    ];
    setPedidos(dadosSimulados);
    setPedidosFiltrados(dadosSimulados);
  }, []);

  React.useEffect(() => {
    if (termoBusca.trim() === "") {
      setPedidosFiltrados(pedidos);
    } else {
      const filtrados = pedidos.filter(pedido => 
        pedido.cliente.toLowerCase().includes(termoBusca.toLowerCase()) ||
        pedido.status.toLowerCase().includes(termoBusca.toLowerCase()) ||
        pedido.id.toString().includes(termoBusca.toLowerCase())
      );
      setPedidosFiltrados(filtrados);
    }
  }, [termoBusca, pedidos]);

  const handleNovoPedido = () => {
    navigate("/comercial/pedidos/novo");
  };

  const handleEditar = (pedidoId) => {
    console.log("Editar pedido:", pedidoId);
  };

  const handleDeletar = (pedidoId) => {
    console.log("Deletar pedido:", pedidoId);
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
                    <TableCell>{pedido.cliente}</TableCell>
                    <TableCell>
                      {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{pedido.status}</TableCell>
                    <TableCell>
                      R$ {parseFloat(pedido.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditar(pedido.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeletar(pedido.id)}
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
      </Container>
    </Box>
  );
}
