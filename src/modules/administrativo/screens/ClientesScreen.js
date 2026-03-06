import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ClientesScreen() {
  const navigate = useNavigate();
  const [clientes] = React.useState([]);

  const handleNovoCliente = () => {
    navigate('/administrativo/clientes/cadastro');
  };

  const handleEditar = (clienteId) => {
    navigate(`/administrativo/clientes/cadastro/${clienteId}`);
  };

  const handleDeletar = (clienteId) => {
    // Implementar lógica de deleção
    console.log('Deletar cliente:', clienteId);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2 }}
      >
        Voltar
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5">Gerenciar Clientes</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNovoCliente}>
          Novo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
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
                  <TableCell>{cliente.endereco}</TableCell>
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
    </Box>
  );
}
