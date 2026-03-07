import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BackButton from '../../../../shared/components/BackButton';
import pacotesService from '../services/api';

export default function ListaPacotesScreen() {
  const navigate = useNavigate();
  const [pacotes, setPacotes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  React.useEffect(() => {
    carregarPacotes();
  }, []);

  const carregarPacotes = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await pacotesService.list();
      setPacotes(data || []);
    } catch (error) {
      setErro('Erro ao carregar pacotes');
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoPacote = () => {
    navigate('/produtos/pacotes/cadastro');
  };

  const handleEditar = (pacoteId) => {
    navigate(`/produtos/pacotes/cadastro/${pacoteId}`);
  };

  const handleDeletar = async (pacoteId) => {
    if (window.confirm('Tem certeza que deseja deletar este pacote?')) {
      try {
        await pacotesService.delete(pacoteId);
        carregarPacotes();
      } catch (error) {
        setErro('Erro ao deletar pacote');
        console.error('Erro ao deletar pacote:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <BackButton />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5">Pacotes Disponíveis</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNovoPacote}>
          Novo Pacote
        </Button>
      </Box>

      {erro && <Alert severity="error" sx={{ marginBottom: 2 }}>{erro}</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="center">Qtd Itens</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                  <Typography color="textSecondary">Nenhum pacote cadastrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pacotes.map((pacote) => (
                <TableRow key={pacote.id}>
                  <TableCell>{pacote.nome}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pacote.descricao}
                  </TableCell>
                  <TableCell align="right">R$ {parseFloat(pacote.preco || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">{pacote.itens?.length || 0}</TableCell>
                  <TableCell align="center">
                    <span style={{ fontSize: '0.85rem', backgroundColor: pacote.ativo ? '#e8f5e9' : '#ffebee', padding: '4px 8px', borderRadius: '4px' }}>
                      {pacote.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditar(pacote.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeletar(pacote.id)}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
