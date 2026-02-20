// src/screens/DashboardScreen.js
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  registerPoint,
  getUserRegisters,
  updateRegister,
  createManualRegister,
} from "../services/api";

export default function DashboardScreen() {
  const [records, setRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimeout = useRef(null);
  const progressInterval = useRef(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editTime, setEditTime] = useState("");
  const [observation, setObservation] = useState("");

  const [openDayEdit, setOpenDayEdit] = useState(false);
  const [editingDate, setEditingDate] = useState("");
  const [dayRecordsEdit, setDayRecordsEdit] = useState([]);

  /* ===============================
     BUSCAR REGISTROS
  =============================== */
  const fetchRegisters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRegisters();
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
      console.error(error);
    }
  };

  const startHolding = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 600) * 100, 100);
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
     AGRUPAR REGISTROS
  =============================== */
  const groupedRecords = records.reduce((acc, record) => {
    const dateKey = record.datetime.toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(record);
    return acc;
  }, {});

  const dates = Object.keys(groupedRecords).sort(
      (a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'))
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

  const calcularHorasAteAgora = () => {
    const hoje = new Date().toLocaleDateString();
    const registrosHoje = records.filter(
      (r) => r.datetime.toLocaleDateString() === hoje
    );

    let totalMs = 0;
    for (let i = 0; i < registrosHoje.length; i += 2) {
      const entrada = registrosHoje[i];
      const saida = registrosHoje[i + 1];
      if (entrada && saida && saida.type === "SAIDA") {
        totalMs += saida.datetime - entrada.datetime;
      } else if (entrada && !saida) {
        totalMs += new Date() - entrada.datetime;
      }
    }
    return totalMs;
  };

  /* ===============================
     EDITAR MODAIS
  =============================== */
  const handleEditDay = (date) => {
    const recordsOfDay = groupedRecords[date] || [];
    const formatted = recordsOfDay.map((r) => ({
      id: r.id,
      time: r.datetime.toTimeString().slice(0, 5),
      type: r.type,
    }));
    setEditingDate(date);
    setDayRecordsEdit(formatted);
    setOpenDayEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedRecord) return;

      await updateRegister(token, selectedRecord.id, {
        observation,
        newRegistro: editTime,
      });
      setOpenEdit(false);
      setSelectedRecord(null);
      fetchRegisters();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveDayEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const [day, month, year] = editingDate.split("/");
      const ordered = [...dayRecordsEdit].sort((a, b) =>
        a.time.localeCompare(b.time)
      );

      const promises = ordered
        .filter((r) => r.time)
        .map((r) => {
          const isoDateTime = `${year}-${month}-${day}T${r.time}:00`;
          if (r.id) {
            return updateRegister(token, r.id, {
              observation: "Edição manual do dia",
              newRegistro: r.time,
            });
          } else {
            return createManualRegister(token, {
              dataTime: isoDateTime,
              type: r.type,
              observation: "Inserido manualmente",
            });
          }
        });
      await Promise.all(promises);
      setOpenDayEdit(false);
      setDayRecordsEdit([]);
      setEditingDate("");
      fetchRegisters();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTurno = () => {
    const totalExistentes = dayRecordsEdit.length;
    const nextType = totalExistentes % 2 === 0 ? "ENTRADA" : "SAIDA";
    setDayRecordsEdit([
      ...dayRecordsEdit,
      { id: null, time: "", type: nextType },
    ]);
  };

  const handleRemoveTurno = (index) => {
    const updated = [...dayRecordsEdit];
    updated.splice(index, 1);
    setDayRecordsEdit(updated);
  };

  /* ===============================
     RENDER
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
            <TableCell>Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dateList.map((date) => {
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
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowUpwardIcon color="success" fontSize="small" />
                    {formatTime(entrada.datetime)}
                    <ArrowDownwardIcon color="error" fontSize="small" />
                    {formatTime(saida.datetime)}
                  </div>
                );
                totalTurnos.push(<div key={`dur-${i}`}>{formatDuration(duration)}</div>);
              } else {
                inconsistent = true;
                if (entrada) {
                  turnos.push(
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <ArrowUpwardIcon color="success" fontSize="small" />
                      {formatTime(entrada.datetime)} -
                      <AccessTimeIcon color="warning" fontSize="small" /> Aguardando
                    </div>
                  );
                  totalTurnos.push(<div key={`dur-${i}`}> -h --min </div>);
                }
              }
            }

            return (
              <TableRow key={date}>
                <TableCell>{date}</TableCell>
                <TableCell>{turnos}</TableCell>
                <TableCell>{totalTurnos}</TableCell>
                <TableCell>{totalMs > 0 && !inconsistent ? formatDuration(totalMs) : "-h --min"}</TableCell>
                <TableCell>
                  {inconsistent ? <Chip label="Pendente" color="error" size="small" /> : <Chip label="OK" color="success" size="small" />}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEditDay(date)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="md" sx={{ mt: "6rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
      </Typography>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Horas trabalhadas hoje: {formatDuration(calcularHorasAteAgora())}
      </Typography>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <Button
          variant="contained"
          startIcon={<AccessTimeIcon />}
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          sx={{
            position: "relative",
            width: 280,
            height: 72,
            borderRadius: "18px",
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          {isHolding ? `Confirmando ${Math.floor(holdProgress)}%` : "Registrar Ponto"}
          {isHolding && (
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 6,
              width: `${holdProgress}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.8))",
              transition: "width 0.05s linear"
            }} />
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

      {/* Modais */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Registro</DialogTitle>
        <DialogContent>
          <TextField label="Novo Horário" type="time" fullWidth margin="normal" value={editTime} onChange={e => setEditTime(e.target.value)} />
          <TextField label="Observação" fullWidth margin="normal" multiline rows={3} value={observation} onChange={e => setObservation(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDayEdit} onClose={() => setOpenDayEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Dia {editingDate}</DialogTitle>
        <DialogContent>
          {dayRecordsEdit.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              {item.type === "ENTRADA" ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
              <TextField type="time" size="small" value={item.time} onChange={e => {
                const updated = [...dayRecordsEdit];
                updated[index].time = e.target.value;
                setDayRecordsEdit(updated);
              }} InputLabelProps={{ shrink: true }} />
              <IconButton color="error" onClick={() => handleRemoveTurno(index)}><DeleteIcon /></IconButton>
            </div>
          ))}
          <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddTurno} fullWidth>Adicionar Turno</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDayEdit(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveDayEdit}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}