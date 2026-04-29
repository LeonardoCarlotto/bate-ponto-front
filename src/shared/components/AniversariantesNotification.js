import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Cake,
  Close,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { clientesService } from '../../modules/comercial/services/api';

const AniversariantesNotification = () => {
  const [aniversariantes, setAniversariantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarAniversariantes();
  }, []);

  const carregarAniversariantes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // CHAMADA REAL À API DO BACKEND
      const data = await clientesService.buscarAniversariantesDoDia();
      setAniversariantes(data || []);
    } catch (error) {
      console.error('Erro ao carregar aniversariantes:', error);
      setError('Não foi possível carregar os aniversariantes do dia');
      setAniversariantes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (error || aniversariantes.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 320,
      }}
    >
      <Alert
        severity="info"
        icon={<Cake sx={{ fontSize: 18, color: '#ff9800' }} />}
        action={
          <Box>
            <IconButton
              aria-label="expand"
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ mr: 0.5, p: 0.5, color: '#ff9800' }}
            >
              {expanded ? <ExpandLess sx={{ fontSize: 16, color: '#ff9800' }} /> : <ExpandMore sx={{ fontSize: 16, color: '#ff9800' }} />}
            </IconButton>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setAniversariantes([])}
              sx={{ p: 0.5, color: '#ff9800' }}
            >
              <Close sx={{ fontSize: 16, color: '#ff9800' }} />
            </IconButton>
          </Box>
        }
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
            padding: '4px 0',
          },
          '& .MuiAlert-icon': {
            padding: '4px 0',
          },
          '& .MuiAlert-action': {
            padding: '4px 0',
          },
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff3e0',
          border: '1px solid #ffcc80',
          '& .MuiAlert-message': {
            color: '#e65100',
          },
        }}
      >
        <AlertTitle sx={{ fontSize: '14px', mb: 0.5, color: '#e65100' }}>
          🎉 Aniversariantes ({aniversariantes.length})
        </AlertTitle>
        
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#f57c00' }}>
          {aniversariantes.length === 1 
            ? '1 cliente hoje!' 
            : `${aniversariantes.length} clientes hoje!`
          }
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            {aniversariantes.map((cliente, index) => (
              <Box
                key={cliente.id || index}
                sx={{
                  py: 0.5,
                  borderBottom: index < aniversariantes.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'medium', display: 'block', color: '#e65100' }}>
                  🎂 {cliente.nome}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '10px', color: '#ff9800' }}>
                  {cliente.email && `${cliente.email}`}
                  {cliente.email && cliente.telefone && ' • '}
                  {cliente.telefone && `${cliente.telefone}`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </Alert>
    </Box>
  );
};

export default AniversariantesNotification;
