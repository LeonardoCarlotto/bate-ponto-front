import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import BackButton from "../../../shared/components/BackButton";

export default function CadastroPedidoScreen() {
  const navigate = useNavigate();

  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);

  const [clientes] = React.useState([
    { id: 1, nome: "Cliente 1" },
    { id: 2, nome: "Cliente 2" },
    { id: 3, nome: "Cliente 3" },
  ]);

  const [produtos] = React.useState([
    { id: 1, nome: "Produto 1", preco: 10 },
    { id: 2, nome: "Produto 2", preco: 20 },
    { id: 3, nome: "Produto 3", preco: 30 },
  ]);

  const [pacotes] = React.useState([
    { id: 1, nome: "Pacote Básico", preco: 50 },
    { id: 2, nome: "Pacote Premium", preco: 150 },
  ]);

  const [formData, setFormData] = React.useState({
    clienteId: "",
    dataPedido: new Date().toISOString().split("T")[0],
    status: "PENDENTE",
    observacoes: "",
  });

  const [itens, setItens] = React.useState([]);

  const [novoItem, setNovoItem] = React.useState({
    tipo: "produto",
    itemId: "",
    quantidade: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErro(null);
  };

  const handleNovoItemChange = (e) => {
    const { name, value } = e.target;

    setNovoItem((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? parseInt(value) || 1 : value,
      ...(name === "tipo" && { itemId: "" }),
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.itemId) {
      setErro("Selecione um item");
      return;
    }

    const lista = novoItem.tipo === "produto" ? produtos : pacotes;

    const selecionado = lista.find(
      (item) => item.id === parseInt(novoItem.itemId),
    );

    if (!selecionado) {
      setErro("Item não encontrado");
      return;
    }

    const item = {
      id: Date.now(),
      tipo: novoItem.tipo,
      nome: selecionado.nome,
      quantidade: novoItem.quantidade,
      preco: selecionado.preco,
      subtotal: selecionado.preco * novoItem.quantidade,
    };

    setItens((prev) => [...prev, item]);

    setNovoItem({
      tipo: "produto",
      itemId: "",
      quantidade: 1,
    });
  };

  const removerItem = (id) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const validarFormulario = () => {
    if (!formData.clienteId) {
      setErro("Cliente é obrigatório");
      return false;
    }

    if (itens.length === 0) {
      setErro("Adicione pelo menos um item");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      console.log({
        ...formData,
        itens,
        total: calcularTotal(),
      });

      setSucesso(true);

      setTimeout(() => {
        navigate("/comercial/pedidos");
      }, 1200);
    } catch {
      setErro("Erro ao salvar pedido");
    }
  };

  const total = calcularTotal();
  const listaAtual = novoItem.tipo === "produto" ? produtos : pacotes;

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>
      <Container maxWidth="md">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Pedido salvo com sucesso
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Novo Pedido
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Informações do Pedido
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Cliente"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleInputChange}
                  size="small"
                  required
                >
                  <MenuItem value="">
                    <em>Selecione</em>
                  </MenuItem>

                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data do Pedido"
                  name="dataPedido"
                  type="date"
                  value={formData.dataPedido}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  size="small"
                >
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="APROVADO">Aprovado</MenuItem>
                  <MenuItem value="CANCELADO">Cancelado</MenuItem>
                  <MenuItem value="ENTREGUE">Entregue</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Itens do Pedido
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Tipo"
                  name="tipo"
                  value={novoItem.tipo}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="pacote">Pacote</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  select
                  fullWidth
                  label="Item"
                  name="itemId"
                  value={novoItem.itemId}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <MenuItem value="">Selecione</MenuItem>

                  {listaAtual.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome} - R$ {item.preco.toFixed(2)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Qtd"
                  type="number"
                  name="quantidade"
                  value={novoItem.quantidade}
                  onChange={handleNovoItemChange}
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={adicionarItem}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            {itens.length > 0 && (
              <Table size="small" sx={{ mb: 3 }}>
                <TableHead sx={{ background: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Qtd</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell align="right">{item.quantidade}</TableCell>
                      <TableCell align="right">
                        R$ {item.preco.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        R$ {item.subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removerItem(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Grid container mb={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total"
                  value={`R$ ${total.toFixed(2)}`}
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Salvar
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/comercial/pedidos")}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
