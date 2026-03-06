import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardContent, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function ComercialHomeScreen() {
  const navigate = useNavigate();

  const opcoes = [
    {
      title: 'Gerenciar Pedidos',
      description: 'Crie, visualize e acompanhe os pedidos dos clientes.',
      path: '/comercial/pedidos',
      icon: <ShoppingCartIcon style={{ fontSize: 50, color: '#2196F3' }} />,
    },
  ];

  return (
    <Box sx={{ padding: '30px 20px' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ marginBottom: 2 }}
      >
        Voltar
      </Button>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 1 }}>
        Módulo Comercial
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ marginBottom: 3 }}>
        Gerencie pedidos e produtos
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
