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
  InputAdornment,
  Autocomplete,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import BackButton from "../../../../shared/components/BackButton";
import pacotesService from "../services/api";
import { produtosService } from "../../services/api";

export default function CadastroPacoteScreen() {
  const navigate = useNavigate();
  const { pacoteId } = useParams();

  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [carregandoProdutos, setCarregandoProdutos] = React.useState(true);

  const [produtos, setProdutos] = React.useState([]);

  const [servicoNome, setServicoNome] = React.useState("");

  const [formData, setFormData] = React.useState({
    nome: "",
    descricao: "",
    ativo: true,
    precoPersonalizado: "",
  });

  const [itens, setItens] = React.useState([]);

  const [novoItem, setNovoItem] = React.useState({
    tipo: "produto",
    produto: null,
    quantidade: 1,
  });

  React.useEffect(() => {
    carregarProdutosAtivos();
  }, []);

  const carregarProdutosAtivos = async () => {
    try {
      setCarregandoProdutos(true);
      const data = await produtosService.listar({ status: true });
      setProdutos(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProdutos([]);
    } finally {
      setCarregandoProdutos(false);
    }
  };

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
      0
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

    if (name === "tipo") {
      setNovoItem({
        tipo: value,
        produto: null,
        quantidade: 1,
      });

      setServicoNome("");
    }
  };

  const adicionarItem = () => {
    if (novoItem.tipo === "produto") {
      if (!novoItem.produto) {
        setErro("Selecione um produto");
        return;
      }

      const produto = novoItem.produto;

      const item = {
        id: `${Date.now()}`,
        tipo: "produto",
        itemId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: novoItem.quantidade,
        subtotal: produto.preco * novoItem.quantidade,
      };

      setItens([...itens, item]);
    } else {
      if (!servicoNome.trim()) {
        setErro("Digite o nome do serviço");
        return;
      }

      const item = {
        id: `${Date.now()}`,
        tipo: "servico",
        itemId: null,
        nome: servicoNome,
        preco: 0,
        quantidade: novoItem.quantidade,
        subtotal: 0,
      };

      setItens([...itens, item]);
    }

    setNovoItem({
      tipo: "produto",
      produto: null,
      quantidade: 1,
    });

    setServicoNome("");
    setErro(null);
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
                {novoItem.tipo === "produto" ? (
                  <Autocomplete
                    options={produtos}
                    loading={carregandoProdutos}
                    value={novoItem.produto}
                    onChange={(event, value) =>
                      setNovoItem((prev) => ({
                        ...prev,
                        produto: value,
                      }))
                    }
                    getOptionLabel={(option) =>
                      `${option.nome} - R$ ${option.preco.toFixed(2)}`
                    }
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produto"
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                          endAdornment: (
                            <>
                              {carregandoProdutos && (
                                <CircularProgress size={18} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Serviço"
                    value={servicoNome}
                    onChange={(e) => setServicoNome(e.target.value)}
                    size="small"
                    placeholder="Descreva o serviço..."
                  />
                )}
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
                  disabled={carregandoProdutos}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

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
                          {item.tipo === "produto" ? (
                            <>R$ {item.preco.toFixed(2)}</>
                          ) : (
                            <TextField
                              type="number"
                              value={item.preco}
                              onChange={(e) => {
                                const novoPreco =
                                  parseFloat(e.target.value) || 0;

                                const itensAtualizados = itens.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        preco: novoPreco,
                                        subtotal:
                                          novoPreco * i.quantidade,
                                      }
                                    : i
                                );

                                setItens(itensAtualizados);
                              }}
                              size="small"
                              inputProps={{
                                min: 0,
                                step: 0.01,
                                style: { width: "100px" },
                              }}
                            />
                          )}
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
                  onClick={() =>
                    navigate("/produtos/pacotes/lista")
                  }
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