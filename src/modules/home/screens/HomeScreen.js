// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AniversariantesNotification from '../../../shared/components/AniversariantesNotification';

const modules = [
  {
    title: 'Configurações',
    description: 'Acesse suas configurações pessoais, ponto e relatórios.',
    path: '/configuracao',
    icon: <HomeRepairServiceIcon style={{ fontSize: 50, color: '#ff9900' }} />,
  },
  {
    title: 'Comercial',
    description: 'Crie, visualize e gerencie pedidos e clientes.',
    path: '/comercial',
    icon: <ShoppingCartIcon style={{ fontSize: 50, color: '#2196F3' }} />,
  },
  {
    title: 'Financeiro',
    description: 'Gerencie contas a receber, pagar e fluxo de caixa.',
    path: '/financeiro',
    icon: <AccountBalanceIcon style={{ fontSize: 50, color: '#00897B' }} />,
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
      <AniversariantesNotification />
      
      <Typography variant="h4" align="center" gutterBottom>
        Painel de Módulos
      </Typography>
      {/* Atalhos Rápidos */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Acesso Rápido
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Funções mais utilizadas do sistema
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          {/* Card Bater Ponto */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/configuracao/dashboard')}
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 48, color: '#ff9900', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Bater o Ponto
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Registrar seu ponto de trabalho
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Card Criar Pedidos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/comercial/pedidos/novo')}
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                  }}
                >
                  <AddShoppingCartIcon sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Criar Pedidos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Novo pedido de vendas
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Card Criar Clientes */}
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/comercial/clientes/cadastro')}
            >
              <CardActionArea>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '30px 20px',
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Criar Clientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Cadastrar novo cliente
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h5" align="center" gutterBottom>
        Módulos do Sistema
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