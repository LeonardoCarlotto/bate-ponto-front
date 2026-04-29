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
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AttachMoney as AttachMoneyIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import BackButton from "../../../../shared/components/BackButton";
import ModalPagamento from "../components/ModalPagamento";
import { contasReceberService } from "../services/api";

export default function ContasReceberScreen() {
  const navigate = useNavigate();
  const [contas, setContas] = React.useState([]);
  const [contasFiltradas, setContasFiltradas] = React.useState([]);
  const [termoBusca, setTermoBusca] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [erro, setErro] = React.useState(null);
  const [expandedClients, setExpandedClients] = React.useState(new Set());
  const [modalPagamentoOpen, setModalPagamentoOpen] = React.useState(false);
  const [clienteSelecionado, setClienteSelecionado] = React.useState(null);

  React.useEffect(() => {
    const carregarContas = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await contasReceberService.listar();
        setContas(dados || []);
        setContasFiltradas(dados || []);
      } catch (error) {
        console.error('Erro ao carregar contas a receber:', error);
        setErro('Erro ao carregar contas a receber. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    carregarContas();
  }, []);

  React.useEffect(() => {
    if (termoBusca.trim() === "") {
      setContasFiltradas(contas);
    } else {
      const filtradas = contas.filter(cliente => {
        const clienteNome = cliente.clienteNome || '';
        const searchTerm = termoBusca.toLowerCase();
        
        return (
          clienteNome.toLowerCase().includes(searchTerm) ||
          cliente.clienteId?.toString().includes(searchTerm)
        );
      });
      setContasFiltradas(filtradas);
    }
  }, [termoBusca, contas]);

  const handleToggleExpand = (clienteId) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded.has(clienteId)) {
      newExpanded.delete(clienteId);
    } else {
      newExpanded.add(clienteId);
    }
    setExpandedClients(newExpanded);
  };

  const handleRegistrarPagamento = (cliente) => {
    setClienteSelecionado(cliente);
    setModalPagamentoOpen(true);
  };

  const handlePagamentoRegistrado = (clienteAtualizado) => {
    // Atualizar a lista de contas com o cliente atualizado
    setContas(prev => prev.map(c => 
      c.clienteId === clienteAtualizado.clienteId ? clienteAtualizado : c
    ));
    setContasFiltradas(prev => prev.map(c => 
      c.clienteId === clienteAtualizado.clienteId ? clienteAtualizado : c
    ));
  };

  const handleCloseModal = () => {
    setModalPagamentoOpen(false);
    setClienteSelecionado(null);
  };

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

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5">Contas a Receber</Typography>
          <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AttachMoneyIcon />}
              >
                Total Clientes: {contasFiltradas.length}
              </Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por cliente..."
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
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando contas a receber...
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Cliente</TableCell>
                  <TableCell align="right">Total em Aberto</TableCell>
                  <TableCell align="right">Total Pago</TableCell>
                  <TableCell align="right">Saldo Devedor</TableCell>
                  <TableCell>Pedidos em Aberto</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {contasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        {termoBusca.trim() === "" ? "Nenhuma conta a receber encontrada" : "Nenhum cliente encontrado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  contasFiltradas.map((cliente) => {
                    const totalEmAberto = cliente.totalEmAberto || 0;
                    const totalPago = cliente.totalPago || 0;
                    const saldoDevedor = cliente.saldoDevedor || 0;
                    const pedidosEmAberto = cliente.pedidos || [];

                    return (
                      <React.Fragment key={cliente.clienteId}>
                        <TableRow>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleExpand(cliente.clienteId)}
                            >
                              {expandedClients.has(cliente.clienteId) ? 
                                <KeyboardArrowUpIcon /> : 
                                <KeyboardArrowDownIcon />
                              }
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {cliente.clienteNome || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {cliente.clienteId}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="primary" fontWeight="bold">
                              R$ {totalEmAberto.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="success.main" fontWeight="bold">
                              R$ {totalPago.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              color={saldoDevedor > 0 ? "error.main" : "success.main"} 
                              fontWeight="bold"
                            >
                              R$ {saldoDevedor.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${pedidosEmAberto.length} pedidos`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell 
                            colSpan={7} 
                            sx={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse 
                              in={expandedClients.has(cliente.clienteId)} 
                              timeout="auto" 
                              unmountOnExit
                            >
                              <Box sx={{ margin: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  Pedidos em Aberto
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>ID Pedido</TableCell>
                                      <TableCell>Data</TableCell>
                                      <TableCell>Status</TableCell>
                                      <TableCell align="right">Valor</TableCell>
                                      <TableCell align="center">Ações</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {pedidosEmAberto.length === 0 ? (
                                      <TableRow>
                                        <TableCell colSpan={5} align="center">
                                          <Typography variant="body2" color="textSecondary">
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
                                          <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                              <Button
                                                size="small"
                                                color="info"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => navigate(`/comercial/pedidos/visualizar/${pedido.id}`)}
                                              >
                                                Visualizar
                                              </Button>
                                              <Button
                                                size="small"
                                                color="success"
                                                startIcon={<PaymentIcon />}
                                                onClick={() => handleRegistrarPagamento({
                                                  ...cliente,
                                                  pedidoSelecionado: pedido,
                                                  valorPedido: parseFloat(pedido.valor || 0)
                                                })}
                                              >
                                                Pagar
                                              </Button>
                                            </Box>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <ModalPagamento
        open={modalPagamentoOpen}
        onClose={handleCloseModal}
        cliente={clienteSelecionado}
        onPagamentoRegistrado={handlePagamentoRegistrado}
      />
    </Box>
  );
}
