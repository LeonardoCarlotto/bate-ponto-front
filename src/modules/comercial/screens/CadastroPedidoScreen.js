import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import BackButton from '../../../shared/components/BackButton';

export default function CadastroPedidoScreen() {
  const navigate = useNavigate();
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);

  const [clientes] = React.useState([
    { id: 1, nome: 'Cliente 1' },
    { id: 2, nome: 'Cliente 2' },
    { id: 3, nome: 'Cliente 3' },
  ]);

  const [produtos] = React.useState([
    { id: 1, nome: 'Produto 1', preco: 10.00 },
    { id: 2, nome: 'Produto 2', preco: 20.00 },
    { id: 3, nome: 'Produto 3', preco: 30.00 },
  ]);

  const [pacotes] = React.useState([
    { id: 1, nome: 'Pacote Básico', descricao: 'Combo com 3 produtos', preco: 50.00 },
    { id: 2, nome: 'Pacote Premium', descricao: 'Combo com 5 produtos + 2 serviços', preco: 150.00 },
  ]);

  const [formData, setFormData] = React.useState({
    clienteId: '',
    dataPedido: new Date().toISOString().split('T')[0],
    status: 'PENDENTE',
    observacoes: '',
  });

  const [itens, setItens] = React.useState([]);
  const [novoItem, setNovoItem] = React.useState({
    tipo: 'produto',
    itemId: '',
    quantidade: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErro(null);
  };

  const handleNovoItemChange = (e) => {
    const { name, value } = e.target;
    setNovoItem((prevState) => ({
      ...prevState,
      [name]: name === 'quantidade' ? parseInt(value) || 1 : value,
      ...(name === 'tipo' && { itemId: '' }),
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.itemId || novoItem.quantidade <= 0) {
      setErro(`Selecione um ${novoItem.tipo} e quantidade válida`);
      return;
    }

    const lista = novoItem.tipo === 'produto' ? produtos : pacotes;
    const item = lista.find((p) => p.id === parseInt(novoItem.itemId));
    
    if (!item) {
      setErro(`${novoItem.tipo === 'produto' ? 'Produto' : 'Pacote'} não encontrado`);
      return;
    }

    const novoItemCompleto = {
      id: Date.now(),
      tipo: novoItem.tipo,
      itemId: parseInt(novoItem.itemId),
      nome: item.nome,
      quantidade: novoItem.quantidade,
      preco: item.preco,
      subtotal: item.preco * novoItem.quantidade,
    };

    setItens((prevState) => [...prevState, novoItemCompleto]);
    setNovoItem({ tipo: 'produto', itemId: '', quantidade: 1 });
    setErro(null);
  };

  const removerItem = (itemId) => {
    setItens((prevState) => prevState.filter((item) => item.id !== itemId));
  };

  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const validarFormulario = () => {
    if (!formData.clienteId) {
      setErro('Cliente é obrigatório');
      return false;
    }
    if (itens.length === 0) {
      setErro('Adicione pelo menos um pacote ou produto ao pedido');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      console.log('Salvando pedido:', {
        ...formData,
        itens,
        total: calcularTotal(),
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/comercial/pedidos');
      }, 1500);
    } catch (error) {
      setErro('Erro ao salvar pedido: ' + error.message);
    }
  };

  const total = calcularTotal();
  const listaAtual = novoItem.tipo === 'produto' ? produtos : pacotes;

  return (
    <Box>

      <Container maxWidth="md">
        <Box sx={{ paddingX: 2 }}>
            <BackButton />
        </Box>
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {erro && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Pedido salvo com sucesso!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* INFORMAÇÕES DO PEDIDO */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#666', marginBottom: 2, fontWeight: 600, marginTop: 1 }}
            >
              INFORMAÇÕES DO PEDIDO
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Cliente *"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleInputChange}
                  required
                  size="small"
                >
                  <MenuItem value="">
                    <em>Selecione um cliente</em>
                  </MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data do Pedido"
                  name="dataPedido"
                  type="date"
                  value={formData.dataPedido}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  size="small"
                >
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="APROVADO">Aprovado</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado</MenuItem>
                  <MenuItem value="ENTREGUE">Entregue</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="observacoes"
                  multiline
                  rows={3}
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* ITENS DO PEDIDO */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#666', marginBottom: 2, fontWeight: 600, marginTop: 1 }}
            >
              ITENS DO PEDIDO
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  select
                  label="Tipo"
                  name="tipo"
                  value={novoItem.tipo}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="pacote">Pacote</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label={novoItem.tipo === 'produto' ? 'Produto' : 'Pacote'}
                  name="itemId"
                  value={novoItem.itemId}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>
                  {listaAtual.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome} - R$ {item.preco.toFixed(2)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Qtd"
                  name="quantidade"
                  value={novoItem.quantidade}
                  onChange={handleNovoItemChange}
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={adicionarItem}
                  size="small"
                  sx={{ height: 40 }}
                >
                  Adicionar Item
                </Button>
              </Grid>

              {itens.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.85rem' }}>Tipo</TableCell>
                          <TableCell sx={{ fontSize: '0.85rem' }}>Nome</TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                            Qtd
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                            Preço
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                            Subtotal
                          </TableCell>
                          <TableCell align="center" sx={{ fontSize: '0.85rem' }}>
                            Ação
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itens.map((item) => (
                          <TableRow key={item.id} sx={{ fontSize: '0.85rem' }}>
                            <TableCell sx={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>
                              {item.tipo}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.85rem' }}>
                              {item.nome}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                              {item.quantidade}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                              R$ {item.preco.toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.85rem' }}>
                              R$ {item.subtotal.toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removerItem(item.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total"
                  name="total"
                  value={`R$ ${total.toFixed(2)}`}
                  disabled
                  size="small"
                />
              </Grid>

            {/* AÇÕES */}
            <Box sx={{ borderTop: '1px solid #eee', paddingTop: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Salvar
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/comercial/pedidos')}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}