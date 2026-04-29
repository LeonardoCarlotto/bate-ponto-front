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
import PaymentIcon from "@mui/icons-material/Payment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import BackButton from "../../../../shared/components/BackButton";
import { contasPagarService } from "../services/api";

export default function ContasPagarScreen() {
  const navigate = useNavigate();
  const [contas, setContas] = React.useState([]);
  const [contasFiltradas, setContasFiltradas] = React.useState([]);
  const [termoBusca, setTermoBusca] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [erro, setErro] = React.useState(null);
  const [dialogPagamento, setDialogPagamento] = React.useState(false);
  const [contaSelecionada, setContaSelecionada] = React.useState(null);

  React.useEffect(() => {
    const carregarContas = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await contasPagarService.listar();
        setContas(dados || []);
        setContasFiltradas(dados || []);
      } catch (error) {
        console.error('Erro ao carregar contas a pagar:', error);
        setErro('Erro ao carregar contas a pagar. Tente recarregar a página.');
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
      const filtradas = contas.filter(conta => {
        const fornecedorNome = conta.fornecedorNome || '';
        const searchTerm = termoBusca.toLowerCase();
        
        return (
          fornecedorNome.toLowerCase().includes(searchTerm) ||
          conta.descricao?.toLowerCase().includes(searchTerm) ||
          conta.status?.toLowerCase().includes(searchTerm) ||
          conta.id?.toString().includes(searchTerm)
        );
      });
      setContasFiltradas(filtradas);
    }
  }, [termoBusca, contas]);

  const handleNovaConta = () => {
    navigate("/financeiro/contas-pagar/novo");
  };

  const handleEditar = (contaId) => {
    navigate(`/financeiro/contas-pagar/editar/${contaId}`);
  };

  const handleVisualizar = (contaId) => {
    navigate(`/financeiro/contas-pagar/visualizar/${contaId}`);
  };

  const handleDeletar = async (contaId) => {
    if (window.confirm('Tem certeza que deseja deletar esta conta a pagar?')) {
      try {
        await contasPagarService.deletar(contaId);
        // Recarregar a lista
        const dados = await contasPagarService.listar();
        setContas(dados || []);
        setContasFiltradas(dados || []);
      } catch (error) {
        console.error('Erro ao deletar conta a pagar:', error);
        setErro('Erro ao deletar conta a pagar. Tente novamente.');
      }
    }
  };

  const handlePagar = (conta) => {
    setContaSelecionada(conta);
    setDialogPagamento(true);
  };

  const confirmarPagamento = async () => {
    if (!contaSelecionada) return;
    
    try {
      // Atualizar status para PAGO e data de pagamento para hoje
      const dadosAtualizados = {
        ...contaSelecionada,
        status: 'PAGO',
        dataPagamento: new Date().toISOString().split('T')[0],
      };
      
      await contasPagarService.atualizar(contaSelecionada.id, dadosAtualizados);
      
      // Recarregar a lista
      const dados = await contasPagarService.listar();
      setContas(dados || []);
      setContasFiltradas(dados || []);
      
      setDialogPagamento(false);
      setContaSelecionada(null);
    } catch (error) {
      console.error('Erro ao pagar conta:', error);
      setErro('Erro ao pagar conta. Tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'warning';
      case 'pago':
        return 'success';
      case 'vencido':
        return 'error';
      case 'cancelado':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'PAGO':
        return 'Pago';
      case 'VENCIDO':
        return 'Vencido';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const calcularTotal = () => {
    return contasFiltradas.reduce((sum, conta) => sum + (conta.valor || 0), 0);
  };

  const calcularTotalPorStatus = (status) => {
    return contasFiltradas
      .filter(conta => conta.status === status)
      .reduce((sum, conta) => sum + (conta.valor || 0), 0);
  };

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5">Contas a Pagar</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNovaConta}
          >
            Nova Conta
          </Button>
        </Box>

        {/* Resumo */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                R$ {calcularTotal().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Geral
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                R$ {calcularTotalPorStatus('PENDENTE').toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pendentes
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                R$ {calcularTotalPorStatus('VENCIDO').toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Vencidas
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                R$ {calcularTotalPorStatus('PAGO').toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pagas
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por fornecedor, descrição..."
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
              Carregando contas a pagar...
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fornecedor</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data Vencimento</TableCell>
                  <TableCell>Data Pagamento</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        {termoBusca.trim() === "" 
                          ? "Nenhuma conta a pagar encontrada" 
                          : "Nenhuma conta encontrada para esta busca"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  contasFiltradas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell>{conta.id}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {conta.fornecedorNome || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{conta.descricao || '-'}</TableCell>
                      <TableCell>
                        {new Date(conta.dataVencimento).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        {conta.dataPagamento 
                          ? new Date(conta.dataPagamento).toLocaleDateString("pt-BR")
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" fontWeight="bold">
                          R$ {parseFloat(conta.valor || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(conta.status)} 
                          color={getStatusColor(conta.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            color="info"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleVisualizar(conta.id)}
                          >
                            Visualizar
                          </Button>
                          <Button
                            size="small"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditar(conta.id)}
                          >
                            Editar
                          </Button>
                          {conta.status !== 'PAGO' && (
                            <Button
                              size="small"
                              color="success"
                              startIcon={<PaymentIcon />}
                              onClick={() => handlePagar(conta)}
                            >
                              Pagar
                            </Button>
                          )}
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeletar(conta.id)}
                          >
                            Deletar
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Diálogo de Confirmação de Pagamento */}
      <Dialog open={dialogPagamento} onClose={() => setDialogPagamento(false)}>
        <DialogTitle>Confirmar Pagamento</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja marcar esta conta como paga?
          </Typography>
          {contaSelecionada && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Fornecedor: {contaSelecionada.fornecedorNome || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Descrição: {contaSelecionada.descricao || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valor: R$ {parseFloat(contaSelecionada.valor || 0).toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogPagamento(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmarPagamento} color="success" variant="contained">
            Confirmar Pagamento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
