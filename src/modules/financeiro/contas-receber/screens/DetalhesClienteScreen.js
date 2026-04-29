import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  AttachMoney as AttachMoneyIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import BackButton from "../../../../shared/components/BackButton";
import { contasReceberService } from "../services/api";

export default function DetalhesClienteScreen() {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [clienteData, setClienteData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [erro, setErro] = React.useState(null);

  React.useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await contasReceberService.obterPorCliente(clienteId);
        setClienteData(dados);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        setErro('Erro ao carregar dados do cliente. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      carregarDadosCliente();
    }
  }, [clienteId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'preparação':
        return 'warning';
      case 'enviado':
        return 'info';
      case 'entregue':
        return 'success';
      default:
        return 'default';
    }
  };

  const calcularTotalEmAberto = (pedidos) => {
    return pedidos
      .filter(p => ['preparação', 'enviado', 'entregue'].includes(p.status?.toLowerCase()))
      .reduce((total, pedido) => total + parseFloat(pedido.valor || 0), 0);
  };

  const calcularTotalPago = (pagamentos) => {
    return pagamentos?.reduce((total, pagamento) => total + parseFloat(pagamento.valor || 0), 0) || 0;
  };

  const handleRegistrarPagamento = () => {
    navigate(`/contas-receber/cliente/${clienteId}/pagar`);
  };

  const handleVerPagamento = (pagamentoId) => {
    navigate(`/contas-receber/pagamento/${pagamentoId}`);
  };

  if (loading) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to="/contas-receber" />
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando dados do cliente...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (erro) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to="/contas-receber" />
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!clienteData) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to="/contas-receber" />
        <Container maxWidth="lg">
          <Alert severity="warning">
            Cliente não encontrado.
          </Alert>
        </Container>
      </Box>
    );
  }

  const pedidosEmAberto = clienteData.pedidos?.filter(p => 
    ['preparação', 'enviado', 'entregue'].includes(p.status?.toLowerCase())
  ) || [];
  const totalEmAberto = calcularTotalEmAberto(clienteData.pedidos || []);
  const totalPago = calcularTotalPago(clienteData.pagamentos);
  const saldoDevedor = totalEmAberto - totalPago;

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/contas-receber" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h4">
            Contas a Receber - {clienteData.clienteNome}
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<PaymentIcon />}
            onClick={handleRegistrarPagamento}
            disabled={saldoDevedor <= 0}
          >
            Registrar Pagamento
          </Button>
        </Box>

        {/* Resumo Financeiro */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total em Aberto
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      R$ {totalEmAberto.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PaymentIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Pago
                    </Typography>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      R$ {totalPago.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <HistoryIcon color="error" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Saldo Devedor
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={saldoDevedor > 0 ? "error.main" : "success.main"} 
                      fontWeight="bold"
                    >
                      R$ {saldoDevedor.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <VisibilityIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pedidos em Aberto
                    </Typography>
                    <Typography variant="h5" color="info.main" fontWeight="bold">
                      {pedidosEmAberto.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pedidos em Aberto */}
        <Typography variant="h6" gutterBottom>
          Pedidos em Aberto
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosEmAberto.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ padding: 3 }}>
                    <Typography color="textSecondary">
                      Nenhum pedido em aberto
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pedidosEmAberto.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>
                      {new Date(pedido.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pedido.status} 
                        size="small" 
                        color={getStatusColor(pedido.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      R$ {parseFloat(pedido.valor || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Histórico de Pagamentos */}
        <Typography variant="h6" gutterBottom>
          Histórico de Pagamentos
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Forma Pagamento</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!clienteData.pagamentos || clienteData.pagamentos.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ padding: 3 }}>
                    <Typography color="textSecondary">
                      Nenhum pagamento registrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clienteData.pagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell>
                      {new Date(pagamento.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Typography color="success.main" fontWeight="bold">
                        R$ {parseFloat(pagamento.valor || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>{pagamento.formaPagamento || 'N/A'}</TableCell>
                    <TableCell>{pagamento.descricao || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVerPagamento(pagamento.id)}
                      >
                        Ver
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
