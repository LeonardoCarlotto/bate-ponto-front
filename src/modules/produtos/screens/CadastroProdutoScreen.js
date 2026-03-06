import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import { produtosService } from '../services/api';

export default function CadastroProdutoScreen() {
  const navigate = useNavigate();
  const { produtoId } = useParams();
  const [carregando, setCarregando] = React.useState(!!produtoId);
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [categorias, setCategorias] = React.useState([]);

  const [formData, setFormData] = React.useState({
    nome: '',
    descricao: '',
    categoria: '',
    preco: '',
    estoque: '0',
    status: 'ativo',
  });

  const carregarCategorias = useCallback(async () => {
    try {
      const cats = await produtosService.listarCategorias();
      setCategorias(cats);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }, []);

  const carregarProduto = useCallback(async () => {
    try {
      setCarregando(true);
      const produto = await produtosService.obter(produtoId);
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        categoria: produto.categoria || '',
        preco: produto.preco?.toString() || '',
        estoque: produto.estoque?.toString() || '0',
        status: produto.status || 'ativo',
      });
    } catch (error) {
      setErro('Erro ao carregar dados do produto: ' + error.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  React.useEffect(() => {
    carregarCategorias();
    if (produtoId) {
      carregarProduto();
    }
  }, [produtoId, carregarProduto, carregarCategorias]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErro(null);
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return false;
    }
    if (!formData.categoria) {
      setErro('Categoria é obrigatória');
      return false;
    }
    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      setErro('Preço deve ser maior que zero');
      return false;
    }
    if (parseFloat(formData.estoque) < 0) {
      setErro('Estoque não pode ser negativo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);
      const dadosEnvio = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque, 10),
      };
      
      if (produtoId) {
        await produtosService.atualizar(produtoId, dadosEnvio);
      } else {
        await produtosService.criar(dadosEnvio);
      }
      
      setSucesso(true);
      setTimeout(() => {
        navigate('/produtos/lista');
      }, 1500);
    } catch (error) {
      setErro('Erro ao salvar produto: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, mt: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Card sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 2,
      }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600 }}
        >
          {produtoId ? 'Editar Produto' : 'Novo Produto'}
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Produto salvo com sucesso!
          </Alert>
        )}

        {carregando && !formData.nome ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {/* Produção e Descrição */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                  INFORMAÇÕES DO PRODUTO
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Produto"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              {/* Classificação */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#666' }}>
                  CLASSIFICAÇÃO
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={carregando}
                  size="small"
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="descontinuado">Descontinuado</MenuItem>
                </TextField>
              </Grid>

              {/* Preço e Estoque */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#666' }}>
                  DISPONIBILIDADE
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estoque"
                  name="estoque"
                  type="number"
                  inputProps={{ min: '0' }}
                  value={formData.estoque}
                  onChange={handleInputChange}
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              {/* Botões */}
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid #eee',
                }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={carregando}
                    fullWidth
                  >
                    {carregando ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>

                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/produtos/lista')}
                    disabled={carregando}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Card>
    </Container>
  );
}
