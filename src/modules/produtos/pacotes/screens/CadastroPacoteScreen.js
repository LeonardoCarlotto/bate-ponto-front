import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { pacotesService } from '../services/api';

export default function CadastroPacoteScreen() {
  const navigate = useNavigate();
  const { pacoteId } = useParams();
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [produtos] = React.useState([
    { id: 1, nome: 'Produto 1', preco: 10.00, descricao: 'Desc 1' },
    { id: 2, nome: 'Produto 2', preco: 20.00, descricao: 'Desc 2' },
    { id: 3, nome: 'Produto 3', preco: 30.00, descricao: 'Desc 3' },
  ]);

  const [formData, setFormData] = React.useState({
    nome: '',
    descricao: '',
    preco: '',
    ativo: true,
  });

  const [itens, setItens] = React.useState([]);
  const [novoItem, setNovoItem] = React.useState({
    produtoId: '',
    quantidade: 1,
  });

  // Mover carregarPacote FORA do useEffect com useCallback
  const carregarPacote = React.useCallback(async () => {
    if (!pacoteId) return;

    setLoading(true);
    try {
      const data = await pacotesService.obter(pacoteId);
      setFormData(data);
      setItens(data.itens || []);
    } catch (error) {
      setErro('Erro ao carregar pacote: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [pacoteId]);

  // Agora useEffect pode referenciar carregarPacote na dependency array
  React.useEffect(() => {
    carregarPacote();
  }, [carregarPacote]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'preco' ? parseFloat(value) || 0 : value,
    }));
    setErro(null);
  };

  const handleNovoItemChange = (e) => {
    const { name, value } = e.target;
    setNovoItem((prevState) => ({
      ...prevState,
      [name]: name === 'quantidade' ? parseInt(value) || 1 : value,
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.produtoId || novoItem.quantidade <= 0) {
      setErro('Selecione um produto e quantidade válida');
      return;
    }

    const produto = produtos.find((p) => p.id === parseInt(novoItem.produtoId));

    if (!produto) {
      setErro('Produto não encontrado');
      return;
    }

    const novoItemCompleto = {
      id: Date.now(),
      produtoId: parseInt(novoItem.produtoId),
      nomeProduto: produto.nome,
      quantidade: novoItem.quantidade,
      preco: produto.preco,
      subtotal: produto.preco * novoItem.quantidade,
    };

    setItens((prevState) => [...prevState, novoItemCompleto]);
    setNovoItem({ produtoId: '', quantidade: 1 });
    setErro(null);
  };

  const removerItem = (itemId) => {
    setItens((prevState) => prevState.filter((item) => item.id !== itemId));
  };

  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro('Nome do pacote é obrigatório');
      return false;
    }
    if (!formData.descricao.trim()) {
      setErro('Descrição é obrigatória');
      return false;
    }
    if (formData.preco <= 0) {
      setErro('Preço deve ser maior que 0');
      return false;
    }
    if (itens.length === 0) {
      setErro('Adicione pelo menos um produto ao pacote');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const dados = {
        ...formData,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
        total: calcularTotal(),
      };

      if (pacoteId) {
        await pacotesService.atualizar(pacoteId, dados);
      } else {
        await pacotesService.criar(dados);
      }

      setSucesso(true);
      setTimeout(() => {
        navigate('/produtos/pacotes');
      }, 1500);
    } catch (error) {
      setErro('Erro ao salvar pacote: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const total = calcularTotal();

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ marginBottom: 2, marginTop: 2 }}
        >
          Voltar
        </Button>
      </Box>

      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 600 }}>
            {pacoteId ? 'Editar Pacote' : 'Novo Pacote'}
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Pacote salvo com sucesso!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* INFORMAÇÕES DO PACOTE */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#666', marginBottom: 2, fontWeight: 600, marginTop: 1 }}
            >
              INFORMAÇÕES DO PACOTE
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Pacote *"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Pacote Casamento Completo"
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição *"
                  name="descricao"
                  multiline
                  rows={3}
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva os serviços e produtos inclusos"
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Preço Total *"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01', min: '0' }}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total de Itens"
                  value={`R$ ${total.toFixed(2)}`}
                  disabled
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <Chip
                  label={formData.ativo ? 'Ativo' : 'Inativo'}
                  color={formData.ativo ? 'success' : 'error'}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* PRODUTOS DO PACOTE */}
            <Typography
              variant="subtitle2"
              sx={{ color: '#666', marginBottom: 2, fontWeight: 600, marginTop: 1 }}
            >
              PRODUTOS DO PACOTE
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  select
                  label="Produto *"
                  name="produtoId"
                  value={novoItem.produtoId}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - R$ {produto.preco.toFixed(2)}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade *"
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
                  Adicionar Produto
                </Button>
              </Grid>

              {itens.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontSize: '0.85rem' }}>Produto</TableCell>
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
                          <TableRow key={item.id}>
                            <TableCell sx={{ fontSize: '0.85rem' }}>
                              {item.nomeProduto}
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
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/produtos/pacotes')}
                    disabled={loading}
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