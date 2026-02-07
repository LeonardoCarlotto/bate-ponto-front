import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import NavBar from "./NavBar";
import LoginScreen from "./screens/LoginScreen";
import { registerPoint, getUserRegisters } from "./services/Api";

function App() {
  const [records, setRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  /* ===============================
     BOTÃO SEGURAR 3 SEGUNDOS
  =============================== */
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimeout = useRef(null);
  const progressInterval = useRef(null);

  const startHolding = () => {
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 1000) * 100, 100);
      setHoldProgress(progress);
    }, 50);

    holdTimeout.current = setTimeout(() => {
      clearInterval(progressInterval.current);
      setHoldProgress(100);
      addRecord();
    }, 1000);
  };

  const stopHolding = () => {
    setIsHolding(false);
    clearTimeout(holdTimeout.current);
    clearInterval(progressInterval.current);
    setHoldProgress(0);
  };

  /* ===============================
     BUSCAR REGISTROS
  =============================== */
  const fetchRegisters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const data = await getUserRegisters(token);

      const mapped = data
        .map((r) => {
          if (!r.date || !r.time) return null;

          const [day, month, year] = r.date.split("/");
          const isoString = `${year}-${month}-${day}T${r.time}:00`;
          const dateObj = new Date(isoString);

          return {
            id: r.id,
            datetime: !isNaN(dateObj) ? dateObj : null,
            type: r.type
              ?.normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toUpperCase(),
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.datetime - b.datetime);

      setRecords(mapped);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  /* ===============================
     LOGIN / LOGOUT
  =============================== */
  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRecords([]);
    setIsAuthenticated(false);
  };

  /* ===============================
     EFFECTS
  =============================== */
  useEffect(() => {
    if (isAuthenticated) fetchRegisters();
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ===============================
     REGISTRAR PONTO
  =============================== */
  const addRecord = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await registerPoint(token);
      await fetchRegisters();
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
    }
  };

  /* ===============================
     AGRUPAR POR DATA
  =============================== */
  const groupedRecords = records.reduce((acc, record) => {
    const dateKey = record.datetime.toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(record);
    return acc;
  }, {});

  const dates = Object.keys(groupedRecords).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const todayKey = new Date().toLocaleDateString();
  const todayDates = dates.filter((d) => d === todayKey);
  const pastDates = dates.filter((d) => d !== todayKey);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  /* ===============================
     SE NÃO ESTIVER LOGADO
  =============================== */
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ===============================
     RENDER TABELA
  =============================== */
  const renderTable = (dateList) => (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Turnos</TableCell>
            <TableCell>Total por Turno</TableCell>
            <TableCell>Total do Dia</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dateList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum registro.
              </TableCell>
            </TableRow>
          ) : (
            dateList.map((date) => {
              const dayRecords = groupedRecords[date];

              let totalMs = 0;
              let inconsistent = false;
              const turnos = [];
              const totalTurnos = [];

              for (let i = 0; i < dayRecords.length; i += 2) {
                const entrada = dayRecords[i];
                const saida = dayRecords[i + 1];

                if (entrada && saida && saida.type === "SAIDA") {
                  const duration = saida.datetime - entrada.datetime;
                  totalMs += duration;

                  turnos.push(
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <ArrowUpwardIcon color="success" fontSize="small" />
                      {formatTime(entrada.datetime)}

                      <ArrowDownwardIcon color="error" fontSize="small" />
                      {formatTime(saida.datetime)}
                    </div>
                  );

                  totalTurnos.push(<div>{formatDuration(duration)}</div>);
                } else {
                  inconsistent = true;

                  if (entrada) {
                    turnos.push(
                      <div
                        key={i}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <ArrowUpwardIcon
                          color="success"
                          fontSize="small"
                        />
                        {formatTime(entrada.datetime)} - 
                        <AccessTimeIcon color="warning" fontSize="small" /> Aguardando
                      </div>
                    );
                    totalTurnos.push(<div> -h --min </div>);
                  }
                }
              }

              return (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>

                  <TableCell>{turnos}</TableCell>
                  <TableCell>{totalTurnos}</TableCell>

                  <TableCell>
                    {totalMs > 0 ? formatDuration(totalMs) : "-"}
                  </TableCell>

                  <TableCell>
                    {inconsistent ? (
                      <Chip label="Pendente" color="error" size="small" />
                    ) : (
                      <Chip label="OK" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  /* ===============================
     TELA PRINCIPAL
  =============================== */
  return (
    <Container maxWidth="md" sx={{ mt: "6rem" }}>
      <NavBar onLogout={handleLogout} />

      <Typography variant="h4" align="center" gutterBottom>
        {currentTime.toLocaleDateString()} -{" "}
        {currentTime.toLocaleTimeString()}
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Button
          variant="contained"
          color={isHolding ? "success" : "primary"}
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          sx={{ position: "relative", overflow: "hidden" }}
        >
          {isHolding
            ? `Segure... ${Math.floor(holdProgress)}%`
            : "Registrar Ponto"}

          {isHolding && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: 4,
                width: `${holdProgress}%`,
                backgroundColor: "lime",
                transition: "width 0.05s linear",
              }}
            />
          )}
        </Button>
      </div>

      {todayDates.length > 0 && (
        <>
          <Typography variant="h6">Registros de Hoje</Typography>
          {renderTable(todayDates)}
        </>
      )}

      <Typography variant="h6">Registros Anteriores</Typography>
      {renderTable(pastDates)}
    </Container>
  );
}

export default App;