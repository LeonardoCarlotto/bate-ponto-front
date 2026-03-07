import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
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
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import BackButton from "../../../../shared/components/BackButton";
import pacotesService from "../services/api";

export default function CadastroPacoteScreen() {
  const navigate = useNavigate();
  const { pacoteId } = useParams();

  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [produtos] = React.useState([
    { id: 1, nome: "Produto 1", preco: 10 },
    { id: 2, nome: "Produto 2", preco: 20 },
    { id: 3, nome: "Produto 3", preco: 30 },
  ]);

  const [servicos] = React.useState([
    { id: 1, nome: "Serviço 1", preco: 50 },
    { id: 2, nome: "Serviço 2", preco: 100 },
    { id: 3, nome: "Serviço 3", preco: 150 },
  ]);

  const [formData, setFormData] = React.useState({
    nome: "",
    descricao: "",
    ativo: true,
    precoPersonalizado: "",
  });

  const [itens, setItens] = React.useState([]);

  const [novoItem, setNovoItem] = React.useState({
    tipo: "produto",
    itemId: "",
    quantidade: 1,
  });

  React.useEffect(() => {
    if (!pacoteId) return;

    const carregarPacote = async () => {
      try {
        setLoading(true);

        const data = await pacotesService.getById(pacoteId);

        setFormData({
          nome: data.nome || "",
          descricao: data.descricao || "",
          ativo: data.ativo ?? true,
          precoPersonalizado: data.precoPersonalizado || "",
        });

        setItens(data.itens || []);
      } catch (err) {
        setErro("Erro ao carregar pacote");
      } finally {
        setLoading(false);
      }
    };

    carregarPacote();
  }, [pacoteId]);

  const calcularTotal = () => {
    if (formData.precoPersonalizado) {
      return parseFloat(formData.precoPersonalizado);
    }

    return itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  };

  const total = calcularTotal();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNovoItemChange = (e) => {
    const { name, value } = e.target;

    setNovoItem((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? parseInt(value) || 1 : value,
    }));
  };

  const adicionarItem = () => {
    if (!novoItem.itemId) {
      setErro("Selecione um item");
      return;
    }

    const lista = novoItem.tipo === "produto" ? produtos : servicos;

    const selecionado = lista.find(
      (i) => i.id.toString() === novoItem.itemId.toString(),
    );

    if (!selecionado) return;

    const item = {
      id: `${Date.now()}`,
      tipo: novoItem.tipo,
      itemId: novoItem.itemId,
      nome: selecionado.nome,
      preco: selecionado.preco,
      quantidade: novoItem.quantidade,
      subtotal: selecionado.preco * novoItem.quantidade,
    };

    setItens([...itens, item]);

    setNovoItem({
      tipo: "produto",
      itemId: "",
      quantidade: 1,
    });
  };

  const removerItem = (id) => {
    setItens(itens.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setErro("Nome do pacote é obrigatório");
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...formData,
        preco: total,
        precoPersonalizado: formData.precoPersonalizado
          ? parseFloat(formData.precoPersonalizado)
          : null,
        itens,
      };

      if (pacoteId) {
        await pacotesService.update(pacoteId, data);
      } else {
        await pacotesService.create(data);
      }

      setSucesso(true);

      setTimeout(() => {
        navigate("/produtos/pacotes/lista");
      }, 1500);
    } catch (err) {
      setErro("Erro ao salvar pacote");
    } finally {
      setLoading(false);
    }
  };

  if (loading && pacoteId) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            {pacoteId ? "Editar Pacote" : "Novo Pacote"}
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}
          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Pacote salvo com sucesso
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* INFORMAÇÕES */}
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Informações do Pacote
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Pacote"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.ativo}
                      name="ativo"
                      onChange={handleInputChange}
                    />
                  }
                  label="Pacote ativo"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* ADICIONAR ITEM */}
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Adicionar Itens
            </Typography>

            <Grid container spacing={2} alignItems="center">
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
                  <MenuItem value="servico">Serviço</MenuItem>
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

                  {(novoItem.tipo === "produto" ? produtos : servicos).map(
                    (item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nome} - R$ {item.preco.toFixed(2)}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Qtd"
                  name="quantidade"
                  value={novoItem.quantidade}
                  onChange={handleNovoItemChange}
                  size="small"
                  inputProps={{ min: 1 }}
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

            <Divider sx={{ my: 4 }} />

            {/* TABELA */}
            {itens.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Table size="small">
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
                        <TableCell>
                          {item.tipo === "produto" ? "Produto" : "Serviço"}
                        </TableCell>

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
              </Box>
            )}

            {/* PREÇO */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preço Personalizado"
                  name="precoPersonalizado"
                  type="number"
                  value={formData.precoPersonalizado}
                  onChange={handleInputChange}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total"
                  value={`R$ ${total.toFixed(2)}`}
                  disabled
                  size="small"
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* AÇÕES */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/produtos/pacotes/lista")}
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
