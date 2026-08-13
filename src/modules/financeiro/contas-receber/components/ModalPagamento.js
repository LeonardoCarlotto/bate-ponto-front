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
import { contasReceberService } from "../services/api";
import { parseDecimalInput, roundToCents } from "../../../../shared/utils/number";

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
      const valorDisponivel = cliente.pedidoSelecionado ? cliente.valorPedido : '';
      setFormData({
        valor: valorDisponivel ? valorDisponivel.toFixed(2).replace('.', ',') : '',
        formaPagamento: '',
        descricao: cliente.pedidoSelecionado ? `Pagamento pedido #${cliente.pedidoSelecionado.id}` : '',
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

    const valor = roundToCents(parseDecimalInput(formData.valor));
    const valorMaximo = cliente.pedidoSelecionado ? cliente.valorPedido : (cliente?.saldoDevedor || 0);
    
    if (!Number.isFinite(valor) || valor <= 0 || valor - valorMaximo > 0.009) {
      setErro(`Valor deve ser maior que 0 e menor ou igual ao ${cliente.pedidoSelecionado ? 'valor do pedido' : 'saldo devedor'} (R$ ${valorMaximo.toFixed(2)})`);
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
        ...(cliente.pedidoSelecionado && {
          pedidoId: cliente.pedidoSelecionado.id,
          tipoPagamento: 'pedido_individual'
        })
      };

      const resultado = await contasReceberService.registrarPagamento(pagamentoData);
      
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
            pedidoId: cliente.pedidoSelecionado?.id,
            tipoPagamento: cliente.pedidoSelecionado ? 'pedido_individual' : undefined,
            status: resultado.status || 'PAGO',
          }
        ]
      };

      onPagamentoRegistrado(clienteAtualizado);
      onClose();
      
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      setErro(error.message || 'Erro ao registrar pagamento. Tente novamente.');
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
            {cliente.pedidoSelecionado ? (
              <>
                <Typography variant="body2" color="textSecondary">
                  Pedido ID: <strong>#{cliente.pedidoSelecionado.id}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Valor do Pedido: <strong>R$ {(cliente.valorTotalPedido || cliente.valorPedido).toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Já Pago: <strong>R$ {(cliente.valorPagoPedido || 0).toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Saldo do Pedido: <strong>R$ {cliente.valorPedido.toFixed(2)}</strong>
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Saldo Devedor: <strong>R$ {(cliente.saldoDevedor || 0).toFixed(2)}</strong>
              </Typography>
            )}
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
                type="text"
                value={formData.valor}
                onChange={handleInputChange('valor')}
                inputProps={{
                  inputMode: 'decimal'
                }}
                helperText={`Valor máximo: R$ ${(cliente.pedidoSelecionado ? cliente.valorPedido : (cliente.saldoDevedor || 0)).toFixed(2)}`}
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
            disabled={
              submitting ||
              !formData.valor ||
              !Number.isFinite(parseDecimalInput(formData.valor)) ||
              parseDecimalInput(formData.valor) <= 0 ||
              parseDecimalInput(formData.valor) - (cliente.pedidoSelecionado ? cliente.valorPedido : (cliente.saldoDevedor || 0)) > 0.009
            }
          >
            {submitting ? 'Registrando...' : 'Registrar Pagamento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
