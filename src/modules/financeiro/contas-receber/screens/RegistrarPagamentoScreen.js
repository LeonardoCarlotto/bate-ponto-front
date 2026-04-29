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
        setErro('Erro ao carregar dados do cliente. Tente recarregar a página.');
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
    return pagamentos?.reduce((total, pagamento) => total + parseFloat(pagamento.valor || 0), 0) || 0;
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.valor || !formData.formaPagamento) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSubmitting(true);
      setErro(null);

      const pagamentoData = {
        clienteId: parseInt(clienteId),
        valor: parseFloat(formData.valor),
        formaPagamento: formData.formaPagamento,
        descricao: formData.descricao,
        data: formData.data,
      };

      await contasReceberService.registrarPagamento(pagamentoData);
      
      // Redirecionar para a tela de detalhes do cliente
      navigate(`/contas-receber/cliente/${clienteId}`, {
        state: { message: 'Pagamento registrado com sucesso!' }
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setErro('Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ paddingX: 2 }}>
        <BackButton to={`/contas-receber/cliente/${clienteId}`} />
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
        <BackButton to="/contas-receber" />
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
        <BackButton to="/contas-receber" />
        <Container maxWidth="md">
          <Alert severity="warning">
            Cliente não encontrado.
          </Alert>
        </Container>
      </Box>
    );
  }

  const totalEmAberto = calcularTotalEmAberto(clienteData.pedidos || []);
  const totalPago = calcularTotalPago(clienteData.pagamentos);
  const saldoDevedor = totalEmAberto - totalPago;

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to={`/contas-receber/cliente/${clienteId}`} />
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
                  type="number"
                  value={formData.valor}
                  onChange={handleInputChange('valor')}
                  inputProps={{ 
                    min: 0.01, 
                    step: 0.01,
                    max: saldoDevedor 
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
                disabled={submitting || !formData.valor || parseFloat(formData.valor) <= 0 || parseFloat(formData.valor) > saldoDevedor}
              >
                {submitting ? 'Registrando...' : 'Registrar Pagamento'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/contas-receber/cliente/${clienteId}`)}
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
