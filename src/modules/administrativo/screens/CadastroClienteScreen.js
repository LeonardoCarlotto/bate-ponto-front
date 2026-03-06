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
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import { clientesService } from '../services/api';

export default function CadastroClienteScreen() {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [carregando, setCarregando] = React.useState(!!clienteId);
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    celular: '',
    dataAbertura: new Date().toISOString().split('T')[0],
    ativo: true,
  });

  const carregarCliente = useCallback(async () => {
    try {
      setCarregando(true);
      const cliente = await clientesService.obter(clienteId);
      setFormData({
        nome: cliente.nome || '',
        cpfCnpj: cliente.cpfCnpj || '',
        email: cliente.email || '',
        telefone: cliente.telefone || '',
        celular: cliente.celular || '',
        dataAbertura: cliente.dataAbertura || new Date().toISOString().split('T')[0],
        ativo: cliente.ativo !== false,
      });
    } catch (error) {
      setErro('Erro ao carregar dados do cliente: ' + error.message);
    } finally {
      setCarregando(false);
    }
  }, [clienteId]);

  React.useEffect(() => {
    if (clienteId) {
      carregarCliente();
    }
  }, [clienteId, carregarCliente]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErro(null);
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return false;
    }
    if (!formData.cpfCnpj.trim()) {
      setErro('CPF/CNPJ é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      setErro('Email é obrigatório');
      return false;
    }
    if (!formData.email.includes('@')) {
      setErro('Email inválido');
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
      
      if (clienteId) {
        await clientesService.atualizar(clienteId, formData);
      } else {
        await clientesService.criar(formData);
      }
      
      setSucesso(true);
      setTimeout(() => {
        navigate('/administrativo/clientes');
      }, 1500);
    } catch (error) {
      setErro('Erro ao salvar cliente: ' + error.message);
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
          {clienteId ? 'Editar Cliente' : 'Novo Cliente'}
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Cliente salvo com sucesso!
          </Alert>
        )}

        {carregando && !formData.nome ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {/* Informações Básicas */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                  INFORMAÇÕES BÁSICAS
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPF/CNPJ"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  placeholder="123.456.789-00"
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Abertura"
                  name="dataAbertura"
                  type="date"
                  value={formData.dataAbertura}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              {/* Contato */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 2, color: '#666' }}>
                  CONTATO
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 3000-0000"
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
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
                    onClick={() => navigate('/administrativo/clientes')}
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
