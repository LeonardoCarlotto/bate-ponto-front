import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProdutosComercialScreen() {
  const navigate = useNavigate();
  const [produtos] = React.useState([]);

  const handleNovoProduto = () => {
    // Implementar lógica para abrir formulário de novo produto comercial
    console.log('Criar novo produto comercial');
  };

  const handleEditar = (produtoId) => {
    console.log('Editar produto:', produtoId);
  };

  const handleDeletar = (produtoId) => {
    console.log('Deletar produto:', produtoId);
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
        <Typography variant="h5">Gerenciar Produtos</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleNovoProduto}>
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ padding: 3 }}>
                  <Typography color="textSecondary">Nenhum produto cadastrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              produtos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell>{produto.id}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.descricao}</TableCell>
                  <TableCell>R$ {produto.preco}</TableCell>
                  <TableCell>{produto.estoque}</TableCell>
                  <TableCell>
                    <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleEditar(produto.id)}>
                      Editar
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeletar(produto.id)}>
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
