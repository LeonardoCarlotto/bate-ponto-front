import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Container,
  Typography,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Button,
  Chip,
  Paper,
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BackButton from "../../../shared/components/BackButton";
import { pedidosService } from "../services/api";

export default function VisualizarPedidoScreen() {
  const navigate = useNavigate();
  const { pedidoId } = useParams();

  const [erro, setErro] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [pedido, setPedido] = React.useState(null);

  // Carregar dados do pedido
  React.useEffect(() => {
    const carregarPedido = async () => {
      try {
        setLoading(true);
        setErro(null);

        const pedidoData = await pedidosService.obter(pedidoId);

        setPedido(pedidoData);
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        console.error('Status do erro:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
        setErro(error.message || 'Erro ao carregar dados do pedido. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    carregarPedido();
  }, [pedidoId]);

  const handleImprimir = () => {
    window.print();
  };

  const handleEditar = () => {
    navigate(`/comercial/pedidos/editar/${pedidoId}`);
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PREPARACAO':
        return 'warning';
      case 'ENTREGUE':
        return 'success';
      case 'CANCELADO':
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

  // Estilo para impressão
  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-area, .print-area * {
        visibility: visible;
      }
      .print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  if (loading) {
    return (
      <Box>
        <Box sx={{ paddingX: 2 }}>
          <BackButton />
        </Box>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando dados do pedido...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (erro) {
    return (
      <Box>
        <Box sx={{ paddingX: 2 }}>
          <BackButton />
        </Box>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mt: 2 }}>
            {erro}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!pedido) {
    return (
      <Box>
        <Box sx={{ paddingX: 2 }}>
          <BackButton />
        </Box>
        <Container maxWidth="md">
          <Alert severity="info" sx={{ mt: 2 }}>
            Pedido não encontrado.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <style>{printStyles}</style>
      <Box>
        <Box sx={{ paddingX: 2 }} className="no-print">
          <BackButton />
        </Box>
        <Container maxWidth="md" className="print-area">
          <Card sx={{ p: { xs: 2, sm: 4 }, mb: 3 }}>
            {/* Cabeçalho com botões - não imprimir */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="no-print">
              <Typography variant="h5" fontWeight={600}>
                Pedido #{pedido.id}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PrintIcon />}
                  onClick={handleImprimir}
                  size="small"
                >
                  Imprimir
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditar}
                  size="small"
                >
                  Editar
                </Button>
                <Button
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleVoltar}
                  size="small"
                >
                  Voltar
                </Button>
              </Box>
            </Box>

            {/* Informações do Pedido */}
            <Typography variant="h6" fontWeight={600} mb={2}>
              Informações do Pedido
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>ID do Pedido:</strong> {pedido.id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Data do Pedido:</strong> {new Date(pedido.data).toLocaleDateString("pt-BR")}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cliente:</strong> {pedido.clienteNome}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> <Chip 
                    label={getStatusLabel(pedido.status)} 
                    color={getStatusColor(pedido.status)} 
                    size="small" 
                  />
                </Typography>
              </Grid>
              {pedido.descricao && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Descrição:</strong> {pedido.descricao}
                  </Typography>
                </Grid>
              )}
              {pedido.formaPagamento && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Forma de Pagamento:</strong> {pedido.formaPagamento}
                  </Typography>
                </Grid>
              )}
              {pedido.parcelas && (
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Parcelas:</strong> {pedido.parcelas}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  <strong>Valor Total:</strong> R$ {parseFloat(pedido.valor || 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>

            {/* Itens do Pedido */}
            <Typography variant="h6" fontWeight={600} mb={2}>
              Itens do Pedido
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell><strong>Nome</strong></TableCell>
                    <TableCell align="right"><strong>Quantidade</strong></TableCell>
                    <TableCell align="right"><strong>Preço Unit.</strong></TableCell>
                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedido.itens && pedido.itens.length > 0 ? (
                    pedido.itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.tipo === 'pacote' ? 'Pacote' : 'Produto'}</TableCell>
                        <TableCell>{item.nome || item.produtoNome || item.pacoteNome}</TableCell>
                        <TableCell align="right">{item.quantidade}</TableCell>
                        <TableCell align="right">
                          R$ {parseFloat(item.precoUnitario || 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          R$ {parseFloat(item.subtotal || 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">
                          Nenhum item encontrado neste pedido.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rodapé com informações adicionais - não imprimir */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }} className="no-print">
              <Typography variant="caption" color="text.secondary" align="center">
                Pedido gerado em {new Date().toLocaleString("pt-BR")} | Sistema de Gestão
              </Typography>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
}
