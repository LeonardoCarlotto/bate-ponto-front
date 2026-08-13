import React, { useState, useEffect } from 'react';
import {
  useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
  Refresh,
} from '@mui/icons-material';
import BackButton from '../../../shared/components/BackButton';
import { contasReceberService } from '../contas-receber/services/api';
import { contasPagarService } from '../contas-pagar/services/api';

export default function DashboardFinanceiroScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [dadosDashboard, setDadosDashboard] = useState({
    contasReceber: {
      total: 0,
      pendente: 0,
      pago: 0,
      vencido: 0,
      quantidade: 0,
    },
    contasPagar: {
      total: 0,
      pendente: 0,
      pago: 0,
      vencido: 0,
      quantidade: 0,
    },
    saldo: {
      aReceber: 0,
      aPagar: 0,
      liquido: 0,
    }
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro(null);

      const [contasReceber, contasPagar] = await Promise.all([
        contasReceberService.listar(),
        contasPagarService.listar(),
      ]);

      // Processar contas a receber (agrupadas por cliente)
      const statsReceber = {
        total: 0,
        pendente: 0,
        pago: 0,
        vencido: 0,
        quantidade: contasReceber?.length || 0,
      };

      contasReceber?.forEach(cliente => {
        const saldoDevedor = cliente.saldoDevedor || 0;
        const totalPago = cliente.totalPago || 0;
        
        statsReceber.total += saldoDevedor;
        
        // Se tem saldo devedor, considera como pendente
        if (saldoDevedor > 0) {
          statsReceber.pendente += saldoDevedor;
        }
        
        // Total pago
        statsReceber.pago += totalPago;
      });

      // Processar contas a pagar
      const statsPagar = {
        total: 0,
        pendente: 0,
        pago: 0,
        vencido: 0,
        quantidade: contasPagar?.length || 0,
      };

      contasPagar?.forEach(conta => {
        statsPagar.total += conta.valor || 0;
        
        if (conta.status === 'PENDENTE') {
          statsPagar.pendente += conta.valor || 0;
        } else if (conta.status === 'PAGO') {
          statsPagar.pago += conta.valor || 0;
        } else if (conta.status === 'VENCIDO') {
          statsPagar.vencido += conta.valor || 0;
        }
      });

      const saldoLiquido = statsReceber.pendente - statsPagar.pendente;

      setDadosDashboard({
        contasReceber: statsReceber,
        contasPagar: statsPagar,
        saldo: {
          aReceber: statsReceber.pendente,
          aPagar: statsPagar.pendente,
          liquido: saldoLiquido,
        }
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      setErro('Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <BackButton />
          <Typography variant="h4" fontWeight={600}>
            Dashboard Financeiro
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          <Refresh />
        </IconButton>
      </Box>

      {erro && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      {/* Cards Principais - Saldo */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Typography variant="h6" color="success.main">
                  A Receber
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {formatarMoeda(dadosDashboard.saldo.aReceber)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dadosDashboard.contasReceber.quantidade} contas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDown color="error" sx={{ mr: 2 }} />
                <Typography variant="h6" color="error.main">
                  A Pagar
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={600} color="error.main">
                {formatarMoeda(dadosDashboard.saldo.aPagar)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dadosDashboard.contasPagar.quantidade} contas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalance sx={{ mr: 2 }} />
                <Typography variant="h6">
                  Saldo Líquido
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                fontWeight={600}
                color={dadosDashboard.saldo.liquido >= 0 ? 'success.main' : 'error.main'}
              >
                {formatarMoeda(dadosDashboard.saldo.liquido)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dadosDashboard.saldo.liquido >= 0 ? 'Positivo' : 'Negativo'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contas a Receber */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Contas a Receber
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/financeiro/contas-receber')}
                >
                  Ver Todas
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
                    <Schedule color="warning" />
                    <Typography variant="body2" color="warning.dark">
                      Pendentes
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasReceber.pendente)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" color="success.dark">
                      Pagas
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasReceber.pago)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={1}>
                    <Warning color="error" />
                    <Typography variant="body2" color="error.dark">
                      Vencidas
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasReceber.vencido)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contas a Pagar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Contas a Pagar
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/financeiro/contas-pagar')}
                >
                  Ver Todas
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="warning.light" borderRadius={1}>
                    <Schedule color="warning" />
                    <Typography variant="body2" color="warning.dark">
                      Pendentes
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasPagar.pendente)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center" p={2} bgcolor="success.light" borderRadius={1}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" color="success.dark">
                      Pagas
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasPagar.pago)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="center" p={2} bgcolor="error.light" borderRadius={1}>
                    <Warning color="error" />
                    <Typography variant="body2" color="error.dark">
                      Vencidas
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatarMoeda(dadosDashboard.contasPagar.vencido)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumo Geral */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Resumo Geral
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="body2" color="text.secondary">
                  Total a Receber
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatarMoeda(dadosDashboard.contasReceber.total)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
                <Typography variant="body2" color="text.secondary">
                  Total a Pagar
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {formatarMoeda(dadosDashboard.contasPagar.total)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Chip 
                  label={`${dadosDashboard.contasReceber.quantidade} Contas`} 
                  color="primary" 
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Contas a Receber
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Chip 
                  label={`${dadosDashboard.contasPagar.quantidade} Contas`} 
                  color="secondary" 
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Contas a Pagar
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
