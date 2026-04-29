import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import BackButton from '../../../shared/components/BackButton';
import {
  AttachMoney,
  TrendingUp,
  CreditCard,
  PieChart,
  Description,
  People,
  AccountBalance
} from '@mui/icons-material';

const FinanceiroHomeScreen = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: AccountBalance,
      title: 'Dashboard Financeiro',
      description: 'Visão geral das finanças',
      path: '/financeiro/dashboard',
      color: '#8B5CF6'
    },
    {
      icon: AttachMoney,
      title: 'Contas a Receber',
      description: 'Gerencie as contas a receber dos clientes',
      path: '/financeiro/contas-receber',
      color: '#10B981'
    },
    {
      icon: CreditCard,
      title: 'Contas a Pagar',
      description: 'Gerencie as contas a pagar e despesas',
      path: '/financeiro/contas-pagar',
      color: '#EF4444'
    },
    {
      icon: TrendingUp,
      title: 'Fluxo de Caixa',
      description: 'Acompanhe o fluxo de caixa da empresa',
      path: '/financeiro/fluxo-caixa',
      color: '#3B82F6'
    },
    {
      icon: PieChart,
      title: 'Relatórios',
      description: 'Visualize relatórios financeiros',
      path: '/financeiro/relatorios',
      color: '#8B5CF6'
    },
    {
      icon: Description,
      title: 'Boletos',
      description: 'Emissão e gestão de boletos',
      path: '/financeiro/boletos',
      color: '#F59E0B'
    },
    {
      icon: People,
      title: 'Centro de Custo',
      description: 'Gerencie centros de custo',
      path: '/financeiro/centro-custo',
      color: '#06B6D4'
    }
  ];

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/"/>
      <Typography variant="h5" gutterBottom sx={{ marginBottom: 1 }}>
        Módulo Financeiro
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gerencie todas as operações financeiras da empresa
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderTop: `4px solid ${card.color}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(card.path)}
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
                  <card.icon sx={{ fontSize: 48, color: card.color, mb: 2 }} />
                  <Typography variant="h6" gutterBottom align="center">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FinanceiroHomeScreen;
