import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
  const [records, setRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualiza a hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Função para adicionar registro seguindo a ordem: entrada, saida, entrada, saida
  const addRecord = () => {
    const now = new Date();
    setRecords(prev => [...prev, { id: now.getTime(), datetime: now }]);
  };

  // Agrupa registros por data em até duas jornadas
  const groupedRecords = records.reduce((acc, record) => {
    const dateKey = record.datetime.toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = {
        jornada_01_inicio: null,
        jornada_01_fim: null,
        jornada_02_inicio: null,
        jornada_02_fim: null,
        count: 0
      };
    }

    const jornada = acc[dateKey];

    // Preenche os horários na ordem dos registros (count)
    switch (jornada.count) {
      case 0:
        jornada.jornada_01_inicio = record.datetime;
        break;
      case 1:
        jornada.jornada_01_fim = record.datetime;
        break;
      case 2:
        jornada.jornada_02_inicio = record.datetime;
        break;
      case 3:
        jornada.jornada_02_fim = record.datetime;
        break;
      default:
        // Ignora se já tiver 4 registros no dia
        break;
    }

    jornada.count += 1;
    return acc;
  }, {});

  const dates = Object.keys(groupedRecords).sort((a, b) => new Date(b) - new Date(a)); // ordenar do mais recente

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Sistema de Ponto
      </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Button variant="contained" color="primary" onClick={addRecord}>
          Registrar Ponto
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>saida</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>saida</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum registro feito ainda.
                </TableCell>
              </TableRow>
            ) : (
              dates.map(date => {
                const j = groupedRecords[date];
                return (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{j.jornada_01_inicio ? j.jornada_01_inicio.toLocaleTimeString() : '-'}</TableCell>
                    <TableCell>{j.jornada_01_fim ? j.jornada_01_fim.toLocaleTimeString() : '-'}</TableCell>
                    <TableCell>{j.jornada_02_inicio ? j.jornada_02_inicio.toLocaleTimeString() : '-'}</TableCell>
                    <TableCell>{j.jornada_02_fim ? j.jornada_02_fim.toLocaleTimeString() : '-'}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
