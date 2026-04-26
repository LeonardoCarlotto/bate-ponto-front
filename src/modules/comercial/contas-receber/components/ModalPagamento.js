import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Payment as PaymentIcon } from "@mui/icons-material";

export default function ModalPagamento({ 
  open, 
  onClose, 
  cliente, 
  onPagamentoRegistrado 
}) {
  const [formData, setFormData] = React.useState({
    valor: '',
    formaPagamento: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  React.useEffect(() => {
    if (open && cliente) {
      setFormData({
        valor: '',
        formaPagamento: '',
        descricao: '',
        data: new Date().toISOString().split('T')[0],
      });
      setErro(null);
    }
  }, [open, cliente]);

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

    const valor = parseFloat(formData.valor);
    if (valor <= 0 || valor > (cliente?.saldoDevedor || 0)) {
      setErro(`Valor deve ser maior que 0 e menor ou igual ao saldo devedor (R$ ${(cliente?.saldoDevedor || 0).toFixed(2)})`);
      return;
    }

    try {
      setSubmitting(true);
      setErro(null);

      const pagamentoData = {
        clienteId: cliente.clienteId,
        clienteNome: cliente.clienteNome,
        valor: valor,
        formaPagamento: formData.formaPagamento,
        descricao: formData.descricao,
        data: formData.data,
      };

      // Enviar para endpoint (simulado por enquanto)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contas-receber/pagamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(pagamentoData),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar pagamento');
      }

      const resultado = await response.json();
      
      // Atualizar dados do cliente
      const clienteAtualizado = {
        ...cliente,
        totalPago: (cliente.totalPago || 0) + valor,
        saldoDevedor: (cliente.saldoDevedor || 0) - valor,
        pagamentos: [
          ...(cliente.pagamentos || []),
          {
            id: resultado.id || Date.now(),
            valor: valor,
            formaPagamento: formData.formaPagamento,
            descricao: formData.descricao,
            data: formData.data,
          }
        ]
      };

      onPagamentoRegistrado(clienteAtualizado);
      onClose();
      
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setErro('Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PaymentIcon color="success" />
          <Typography variant="h6">Registrar Pagamento</Typography>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cliente: {cliente.clienteNome}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Saldo Devedor: <strong>R$ {(cliente.saldoDevedor || 0).toFixed(2)}</strong>
            </Typography>
          </Box>

          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Valor do Pagamento *"
                type="number"
                value={formData.valor}
                onChange={handleInputChange('valor')}
                inputProps={{ 
                  min: 0.01, 
                  step: 0.01,
                  max: cliente.saldoDevedor || 0 
                }}
                helperText={`Valor máximo: R$ ${(cliente.saldoDevedor || 0).toFixed(2)}`}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={submitting ? <CircularProgress size={20} /> : <PaymentIcon />}
            disabled={submitting || !formData.valor || parseFloat(formData.valor) <= 0 || parseFloat(formData.valor) > (cliente.saldoDevedor || 0)}
          >
            {submitting ? 'Registrando...' : 'Registrar Pagamento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
