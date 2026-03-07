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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BackButton from "../../../shared/components/BackButton";

export default function PedidosScreen() {
  const navigate = useNavigate();
  const [pedidos] = React.useState([]);

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
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                    <Typography color="textSecondary">
                      Nenhum pedido cadastrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
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
