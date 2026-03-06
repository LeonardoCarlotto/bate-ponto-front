// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const modules = [
  {
    title: 'Configurações',
    description: 'Acesse suas configurações pessoais, ponto e relatórios.',
    path: '/ponto',
    icon: <HomeRepairServiceIcon style={{ fontSize: 50, color: '#ff9900' }} />,
  },
  {
    title: 'Comercial',
    description: 'Crie, visualize e gerencie pedidos dos clientes.',
    path: '/comercial',
    icon: <ShoppingCartIcon style={{ fontSize: 50, color: '#2196F3' }} />,
  },
  {
    title: 'Administrativo',
    description: 'Gerencie clientes, contratos e informações internas.',
    path: '/administrativo',
    icon: <PeopleIcon style={{ fontSize: 50, color: '#4CAF50' }} />,
  },
  {
    title: 'Produtos',
    description: 'Cadastre, organize e controle produtos e serviços.',
    path: '/produtos',
    icon: <Inventory2Icon style={{ fontSize: 50, color: '#9C27B0' }} />,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px 20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Painel de Módulos
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Acesse rapidamente os módulos da empresa e organize seu trabalho.
      </Typography>

      <Grid container spacing={4} justifyContent="center" style={{ marginTop: 20 }}>
        {modules.map((mod) => (
          <Grid item xs={12} sm={6} md={3} key={mod.title}>
            <Card>
              <CardActionArea onClick={() => navigate(mod.path)}>
                <CardContent
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                  }}
                >
                  {mod.icon}
                  <Typography variant="h6" style={{ marginTop: 15, marginBottom: 10 }} align="center">
                    {mod.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {mod.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}