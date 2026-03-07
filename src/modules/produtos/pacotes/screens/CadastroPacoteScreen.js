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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import BackButton from '../../../../shared/components/BackButton';
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import pacotesService from "../services/api";

export default function CadastroPacoteScreen() {
  const navigate = useNavigate();
  const { pacoteId } = useParams();
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Dados mockados - substituir por chamadas à API quando disponível
  const [produtos] = React.useState([
    { id: 1, nome: "Produto 1", preco: 10.0 },
    { id: 2, nome: "Produto 2", preco: 20.0 },
    { id: 3, nome: "Produto 3", preco: 30.0 },
  ]);

  const [servicos] = React.useState([
    { id: 1, nome: "Serviço de Entrega", preco: 15.0 },
    { id: 2, nome: "Serviço de Instalação", preco: 50.0 },
    { id: 3, nome: "Serviço de Consultoria", preco: 100.0 },
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

  // Calcular o preço total do pacote
  const calcularTotal = () => {
    if (formData.precoPersonalizado) {
      return parseFloat(formData.precoPersonalizado);
    }
    return itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  };

  // Carregar pacote existente se estiver editando
  const carregarPacote = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await pacotesService.getById(pacoteId);
      setFormData({
        nome: data.nome || "",
        descricao: data.descricao || "",
        ativo: data.ativo !== false,
        precoPersonalizado: data.precoPersonalizado || "",
      });
      setItens(data.itens || []);
    } catch (error) {
      setErro("Erro ao carregar pacote");
      console.error("Erro ao carregar pacote:", error);
    } finally {
      setLoading(false);
    }
  }, [pacoteId]);

  React.useEffect(() => {
    if (pacoteId) {
      carregarPacote();
    }
  }, [pacoteId, carregarPacote]);

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
    const itemSelecionado = lista.find(
      (item) => item.id.toString() === novoItem.itemId.toString(),
    );

    if (!itemSelecionado) {
      setErro("Item não encontrado");
      return;
    }

    const novoItemObj = {
      id: `${novoItem.tipo}-${novoItem.itemId}-${Date.now()}`,
      tipo: novoItem.tipo,
      itemId: novoItem.itemId,
      nome: itemSelecionado.nome,
      preco: itemSelecionado.preco,
      quantidade: novoItem.quantidade,
      subtotal: itemSelecionado.preco * novoItem.quantidade,
    };

    setItens([...itens, novoItemObj]);
    setNovoItem({
      tipo: "produto",
      itemId: "",
      quantidade: 1,
    });
    setErro(null);
  };

  const removerItem = (id) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("Nome do pacote é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const pacoteData = {
        nome: formData.nome,
        descricao: formData.descricao,
        ativo: formData.ativo,
        precoPersonalizado: formData.precoPersonalizado
          ? parseFloat(formData.precoPersonalizado)
          : null,
        preco: calcularTotal(),
        itens,
      };

      if (pacoteId) {
        await pacotesService.update(pacoteId, pacoteData);
      } else {
        await pacotesService.create(pacoteData);
      }

      setSucesso(true);
      setTimeout(() => {
        navigate("/produtos/pacotes/lista");
      }, 1500);
    } catch (error) {
      setErro(error.message || "Erro ao salvar pacote");
      console.error("Erro ao salvar pacote:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && pacoteId) {
    return (
      <Box
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const total = calcularTotal();

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>

      <Container maxWidth="dm">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {erro && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {erro}
            </Alert>
          )}

          {sucesso && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Pacote salvo com sucesso!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* INFORMAÇÕES DO PACOTE */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                marginBottom: 2,
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              INFORMAÇÕES DO PACOTE
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Pacote *"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  size="small"
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
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleInputChange}
                    />
                  }
                  label="Pacote ativo"
                />
              </Grid>
            </Grid>

            {/* ITENS DO PACOTE */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#666",
                marginBottom: 2,
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              ITENS DO PACOTE
            </Typography>

            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Item"
                  name="tipo"
                  value={novoItem.tipo}
                  onChange={handleNovoItemChange}
                  size="small"
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="servico">Serviço</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label={novoItem.tipo === "produto" ? "Produto" : "Serviço"}
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

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  name="quantidade"
                  value={novoItem.quantidade}
                  onChange={handleNovoItemChange}
                  inputProps={{ min: 1 }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={adicionarItem}
                  size="small"
                  sx={{ height: 40 }}
                >
                  Adicionar Item
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2.5} sx={{ marginBottom: 3 }}>
              {itens.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                          <TableCell sx={{ fontSize: "0.85rem" }}>
                            Tipo
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.85rem" }}>
                            Nome
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.85rem" }}>
                            Qtd
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.85rem" }}>
                            Preço
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "0.85rem" }}>
                            Subtotal
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            Deletar
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itens.map((item) => (
                          <TableRow key={item.id} sx={{ fontSize: "0.85rem" }}>
                            <TableCell sx={{ fontSize: "0.85rem" }}>
                              {item.tipo === "produto"
                                ? "📦 Produto"
                                : "🔧 Serviço"}
                            </TableCell>
                            <TableCell sx={{ fontSize: "0.85rem" }}>
                              {item.nome}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              {item.quantidade}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              R$ {item.preco.toFixed(2)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: "0.85rem" }}
                            >
                              R$ {item.subtotal.toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
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
                </Grid>
              )}
            </Grid>

          <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preço Personalizado (deixe em branco para cálculo automático)"
                name="precoPersonalizado"
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                value={formData.precoPersonalizado}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ borderTop: "1px solid #eee", paddingTop: 2.5 }}>
              <TextField
                label="Total"
                value={`R$ ${total.toFixed(2)}`}
                disabled
                size="small"
              />
            </Grid>
            

            {/* AÇÕES */}
            <Box sx={{ borderTop: "1px solid #eee", paddingTop: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate("/produtos/pacotes/lista")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
