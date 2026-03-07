import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessIcon from '@mui/icons-material/Business';
import BackpackIcon from '@mui/icons-material/Backpack';
import BackButton from '../../../shared/components/BackButton';

export default function ProdutosHomeScreen() {
  const navigate = useNavigate();

  const opcoes = [
    {
      title: 'Gerenciar Produtos',
      description: 'Cadastre, organize e controle produtos e serviços.',
      path: '/produtos/lista',
      icon: <Inventory2Icon style={{ fontSize: 50, color: '#9C27B0' }} />,
    },
    {
      title: 'Gerenciar Pacotes',
      description: 'Crie combos de produtos e serviços para venda.',
      path: '/produtos/pacotes/lista',
      icon: <BackpackIcon style={{ fontSize: 50, color: '#FF5722' }} />,
    },
    {
      title: 'Gerenciar Fornecedores',
      description: 'Cadastre e gerencie seus fornecedores.',
      path: '/fornecedores/lista',
      icon: <BusinessIcon style={{ fontSize: 50, color: '#FF9800' }} />,
    },
  ];

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/"/>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 1 }}>
        Módulo Produtos
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ marginBottom: 3 }}>
        Gerencie seus produtos e serviços
      </Typography>

      <Grid container spacing={3}>
        {opcoes.map((opcao) => (
          <Grid item xs={12} sm={6} md={4} key={opcao.title}>
            <Card>
              <CardActionArea onClick={() => navigate(opcao.path)}>
                <CardContent
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                  }}
                >
                  {opcao.icon}
                  <Typography variant="h6" style={{ marginTop: 15, marginBottom: 10 }} align="center">
                    {opcao.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {opcao.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
