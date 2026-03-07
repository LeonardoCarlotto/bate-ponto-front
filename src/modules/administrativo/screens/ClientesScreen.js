import React, { useEffect, useState } from 'react';
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
import BackButton from '../../../shared/components/BackButton';
import { clientesService } from '../services/api';

export default function ClientesScreen() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setErro(null);
      const data = await clientesService.listar();
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setErro('Erro ao carregar clientes. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovoCliente = () => {
    navigate('/administrativo/clientes/cadastro');
  };

  const handleEditar = (clienteId) => {
    navigate(`/administrativo/clientes/cadastro/${clienteId}`);
  };

  const handleDeletar = async (clienteId) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await clientesService.deletar(clienteId);
        carregarClientes();
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        alert('Erro ao deletar cliente');
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <BackButton />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5">Gerenciar Clientes</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNovoCliente}>
          Novo Cliente
        </Button>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {erro}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                  <Typography color="textSecondary">Nenhum cliente cadastrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.id}</TableCell>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleEditar(cliente.id)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeletar(cliente.id)}>
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Box>
  );
}
