import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  Save as SaveIcon,
} from "@mui/icons-material";
import BackButton from "../../../../shared/components/BackButton";
import { contasReceberService } from "../services/api";
import { parseDecimalInput, roundToCents } from "../../../../shared/utils/number";

export default function RegistrarPagamentoScreen() {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [clienteData, setClienteData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [erro, setErro] = React.useState(null);
  
  const [formData, setFormData] = React.useState({
    valor: '',
    formaPagamento: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
  });

  React.useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await contasReceberService.obterPorCliente(clienteId);
        setClienteData(dados);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        setErro(error.message || 'Erro ao carregar dados do cliente. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      carregarDadosCliente();
    }
  }, [clienteId]);

  const calcularTotalEmAberto = (pedidos) => {
    return pedidos
      .filter(p => ['preparação', 'enviado', 'entregue'].includes(p.status?.toLowerCase()))
      .reduce((total, pedido) => total + parseFloat(pedido.valor || 0), 0);
  };

  const calcularTotalPago = (pagamentos) => {
    return pagamentos
      ?.filter((pagamento) => pagamento.status !== 'ESTORNADO')
      .reduce((total, pagamento) => total + parseFloat(pagamento.valor || 0), 0) || 0;
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const valorPagamento = roundToCents(parseDecimalInput(formData.valor));

    if (!formData.valor || !formData.formaPagamento) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!Number.isFinite(valorPagamento) || valorPagamento <= 0 || valorPagamento - saldoDevedor > 0.009) {
      setErro(`Valor deve ser maior que 0 e menor ou igual ao saldo devedor (R$ ${saldoDevedor.toFixed(2)})`);
      return;
    }

    try {
      setSubmitting(true);
      setErro(null);

      const pagamentoData = {
        clienteId: parseInt(clienteId),
        valor: valorPagamento,
        formaPagamento: formData.formaPagamento,
        descricao: formData.descricao,
        data: formData.data,
      };

      await contasReceberService.registrarPagamento(pagamentoData);
      
      // Redirecionar para a tela de detalhes do cliente
      navigate(`/financeiro/contas-receber/cliente/${clienteId}`, {
        state: { message: 'Pagamento registrado com sucesso!' }
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setErro(error.message || 'Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to={`/financeiro/contas-receber/cliente/${clienteId}`} />
        <Container maxWidth="md">
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

  if (erro && !clienteData) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to="/financeiro/contas-receber" />
        <Container maxWidth="md">
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
        <BackButton to="/financeiro/contas-receber" />
        <Container maxWidth="md">
          <Alert severity="warning">
            Cliente não encontrado.
          </Alert>
        </Container>
      </Box>
    );
  }

  const totalEmAberto = clienteData.totalEmAberto ?? calcularTotalEmAberto(clienteData.pedidos || []);
  const totalPago = clienteData.totalPago ?? calcularTotalPago(clienteData.pagamentos);
  const saldoDevedor = clienteData.saldoDevedor ?? (totalEmAberto - totalPago);

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to={`/financeiro/contas-receber/cliente/${clienteId}`} />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Registrar Pagamento - {clienteData.clienteNome}
        </Typography>

        {/* Resumo da Dívida */}
        <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumo da Dívida
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Total em Aberto
                </Typography>
                <Typography variant="h6" color="primary">
                  R$ {totalEmAberto.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Já Pago
                </Typography>
                <Typography variant="h6" color="success.main">
                  R$ {totalPago.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  Saldo Devedor
                </Typography>
                <Typography variant="h6" color={saldoDevedor > 0 ? "error.main" : "success.main"}>
                  R$ {saldoDevedor.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Formulário de Pagamento */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Dados do Pagamento
          </Typography>
          
          {erro && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {erro}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor do Pagamento *"
                  type="text"
                  value={formData.valor}
                  onChange={handleInputChange('valor')}
                  inputProps={{
                    inputMode: 'decimal'
                  }}
                  helperText={`Valor máximo: R$ ${saldoDevedor.toFixed(2)}`}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data do Pagamento *"
                  type="date"
                  value={formData.data}
                  onChange={handleInputChange('data')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Forma de Pagamento *</InputLabel>
                  <Select
                    value={formData.formaPagamento}
                    onChange={handleInputChange('formaPagamento')}
                    label="Forma de Pagamento *"
                  >
                    <MenuItem value="dinheiro">Dinheiro</MenuItem>
                    <MenuItem value="cartao_credito">Cartão de Crédito</MenuItem>
                    <MenuItem value="cartao_debito">Cartão de Débito</MenuItem>
                    <MenuItem value="pix">PIX</MenuItem>
                    <MenuItem value="transferencia">Transferência Bancária</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="outro">Outro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição (Opcional)"
                  multiline
                  rows={3}
                  value={formData.descricao}
                  onChange={handleInputChange('descricao')}
                  placeholder="Observações sobre o pagamento..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={
                  submitting ||
                  !formData.valor ||
                  !Number.isFinite(parseDecimalInput(formData.valor)) ||
                  parseDecimalInput(formData.valor) <= 0 ||
                  parseDecimalInput(formData.valor) - saldoDevedor > 0.009
                }
              >
                {submitting ? 'Registrando...' : 'Registrar Pagamento'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/financeiro/contas-receber/cliente/${clienteId}`)}
              >
                Cancelar
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
