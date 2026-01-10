import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  const [userName, setUserName] = useState(''); // estado para o nome

  useEffect(() => {
    // Simulação de chamada API com fetch ou axios
    async function fetchUserName() {
      try {
        // Exemplo fake de fetch
        const response = await fetch('/api/usuario'); 
        if (!response.ok) throw new Error('Erro ao buscar nome');
        const data = await response.json();
        setUserName(data.name); // supondo que a API retorna { name: 'Leonardo' }
      } catch (error) {
        console.error(error);
        setUserName('User'); // fallback
      }
    }

    fetchUserName();
  }, []);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div">
          Sistema de Ponto
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" startIcon={<AccountCircleIcon />}>
          {userName || 'Carregando...'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
