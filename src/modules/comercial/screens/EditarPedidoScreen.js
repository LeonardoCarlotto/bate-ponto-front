import React from "react";
import {
  useNavigate,
  useParams } from "react-router-dom";
import {
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  InputAdornment,
  Autocomplete
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import BackButton from "../../../shared/components/BackButton";
import { clientesService, pedidosService } from "../services/api";
import { produtosService } from "../../produtos/services/api";
import { pacotesService } from "../../produtos/pacotes/services/api";

export default function EditarPedidoScreen() {
  const navigate = useNavigate();
  const { pedidoId } = useParams();

  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);

  const [clientes, setClientes] = React.useState([]);
  const [produtos, setProdutos] = React.useState([]);
  const [pacotes, setPacotes] = React.useState([]);

  const [formData, setFormData] = React.useState({
    clienteId: "",
    dataPedido: "",
    status: "PREPARACAO",
    descricao: "",
    formaPagamento: "",
    parcelas: 1,
  });

  const [itens, setItens] = React.useState([]);

  const [novoItem, setNovoItem] = React.useState({
    tipo: "produto",
    itemId: "",
    quantidade: 1,
  });

  // Carregar dados do pedido e listas
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setErro(null);

        const [pedidoData, clientesData, produtosData, pacotesData] = await Promise.all([
          pedidosService.obter(pedidoId),
          clientesService.listar(),
          produtosService.listar(),
          pacotesService.list()
        ]);

        // Carregar dados do pedido
        if (pedidoData) {
          setFormData({
            clienteId: pedidoData.clienteId?.toString() || "",
            dataPedido: pedidoData.data?.split('T')[0] || "",
            status: pedidoData.status || "PREPARACAO",
            descricao: pedidoData.descricao || "",
            formaPagamento: pedidoData.formaPagamento || "",
            parcelas: pedidoData.parcelas || 1,
          });
          // Mapear itens para o formato esperado pelo frontend
          const itensMapeados = (pedidoData.itens || []).map(item => ({
            localId: `${item.tipo || 'produto'}-${item.itemId || item.produtoId || item.pacoteId || item.id}-${item.id || Date.now()}`,
            tipo: item.tipo || (item.pacoteId ? "pacote" : "produto"),
            itemId: item.itemId || item.produtoId || item.pacoteId,
            nome: item.nome || item.produtoNome || item.pacoteNome || 'Item sem nome',
            quantidade: item.quantidade,
            preco: item.precoUnitario || item.preco || 0,
            subtotal: item.subtotal || (item.precoUnitario || item.preco || 0) * item.quantidade,
          }));
          
          setItens(itensMapeados);
        }

        setClientes(clientesData || []);
        setProdutos(produtosData || []);
        setPacotes(pacotesData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        console.error('Status do erro:', error.response?.status);
        console.error('Dados do erro:', error.response?.data);
        setErro('Erro ao carregar dados do pedido. Tente recarregar a página.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [pedidoId]);

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
      localId: `${novoItem.tipo}-${novoItem.itemId}-${Date.now()}`,
      tipo: novoItem.tipo,
      itemId: parseInt(novoItem.itemId), // ID real do produto/pacote
      nome: selecionado.nome,
      quantidade: novoItem.quantidade,
      preco: selecionado.preco || 0,
      subtotal: (selecionado.preco || 0) * novoItem.quantidade,
    };

    setItens((prev) => [...prev, item]);
    setNovoItem({
      tipo: "produto",
      itemId: "",
      quantidade: 1,
    });
  };

  const removerItem = (localId) => {
    setItens((prev) => prev.filter((i) => i.localId !== localId));
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

    if (!formData.formaPagamento) {
      setErro("Forma de pagamento é obrigatória");
      return false;
    }

    if (formData.parcelas < 1 || formData.parcelas > 12) {
      setErro("Número de parcelas deve estar entre 1 e 12");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setErro(null);

      // Converter data para formato ISO local sem timezone
      const dataComHora = new Date(formData.dataPedido + 'T00:00:00');
      const ano = dataComHora.getFullYear();
      const mes = String(dataComHora.getMonth() + 1).padStart(2, '0');
      const dia = String(dataComHora.getDate()).padStart(2, '0');
      const horas = String(dataComHora.getHours()).padStart(2, '0');
      const minutos = String(dataComHora.getMinutes()).padStart(2, '0');
      const segundos = String(dataComHora.getSeconds()).padStart(2, '0');
      const formatoLocal = `${ano}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;

      const pedidoData = {
        clienteId: parseInt(formData.clienteId),
        dataPedido: formatoLocal,
        status: formData.status,
        descricao: formData.descricao,
        observacoes: formData.descricao,
        formaPagamento: formData.formaPagamento,
        parcelas: parseInt(formData.parcelas, 10),
        itens: itens.map(item => ({
          id: item.itemId,
          itemId: item.itemId,
          tipo: item.tipo,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco,
          subtotal: item.subtotal
        })),
        total: calcularTotal(),
      };

      await pedidosService.atualizar(pedidoId, pedidoData);

      setSucesso(true);

      setTimeout(() => {
        navigate("/comercial/pedidos");
      }, 1200);
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      setErro(error.message || "Erro ao salvar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const total = calcularTotal();
  const listaAtual = novoItem.tipo === "produto" ? produtos : pacotes;
  const clienteSelecionado = clientes.find(
    (cliente) => cliente.id === parseInt(formData.clienteId, 10),
  ) || null;
  const itemSelecionado = listaAtual.find(
    (item) => item.id === parseInt(novoItem.itemId, 10),
  ) || null;

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>
      <Container maxWidth="md">
        <Card sx={{ p: { xs: 2, sm: 4 } }}>
          {loadingData ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Carregando dados...
              </Typography>
            </Box>
          ) : (
            <>
              {erro && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {erro}
                </Alert>
              )}

              {sucesso && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Pedido atualizado com sucesso
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Typography variant="h5" fontWeight={600} mb={3}>
                  Editar Pedido #{pedidoId}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Informações do Pedido
                </Typography>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Autocomplete
                        sx={{ flex: 1 }}
                        options={clientes}
                        value={clienteSelecionado}
                        onChange={(event, value) => {
                          setFormData((prev) => ({
                            ...prev,
                            clienteId: value?.id?.toString() || "",
                          }));
                          setErro(null);
                        }}
                        getOptionLabel={(option) => option.nome || ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            size="small"
                            required
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
                            }}
                          />
                        )}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/comercial/clientes/cadastro")}
                        sx={{ minWidth: { sm: 150 } }}
                      >
                        Cadastrar
                      </Button>
                    </Box>
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
                      <MenuItem value="PREPARACAO">Em preparação</MenuItem>
                      <MenuItem value="ENTREGUE">Entregue</MenuItem>
                      <MenuItem value="CANCELADO">Cancelado</MenuItem>
                    </TextField>
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
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Autocomplete
                        sx={{ flex: 1 }}
                        options={listaAtual}
                        value={itemSelecionado}
                        onChange={(event, value) => {
                          setNovoItem((prev) => ({
                            ...prev,
                            itemId: value?.id?.toString() || "",
                          }));
                          setErro(null);
                        }}
                        getOptionLabel={(option) =>
                          `${option.nome} - R$ ${(option.preco || 0).toFixed(2)}`
                        }
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Item"
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
                            }}
                          />
                        )}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(novoItem.tipo === "pacote" ? "/produtos/pacotes/cadastro" : "/produtos/cadastro")}
                        sx={{ minWidth: { sm: 150 } }}
                      >
                        Cadastrar
                      </Button>
                    </Box>
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
                        <TableRow key={item.localId}>
                          <TableCell>{item.tipo}</TableCell>
                          <TableCell>{item.nome}</TableCell>
                          <TableCell align="right">{item.quantidade}</TableCell>
                          <TableCell align="right">
                            R$ {(item.preco || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            R$ {(item.subtotal || 0).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => removerItem(item.localId)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Formas de Pagamento
                </Typography>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Forma de Pagamento"
                      name="formaPagamento"
                      value={formData.formaPagamento}
                      onChange={handleInputChange}
                      size="small"
                      required
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                      <MenuItem value="PIX">PIX</MenuItem>
                      <MenuItem value="CARTAO_CREDITO">Cartão de Crédito</MenuItem>
                      <MenuItem value="CARTAO_DEBITO">Cartão de Débito</MenuItem>
                      <MenuItem value="BOLETO">Boleto</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Parcelas"
                      name="parcelas"
                      type="number"
                      value={formData.parcelas}
                      onChange={handleInputChange}
                      inputProps={{ min: 1, max: 12 }}
                      size="small"
                      helperText="Número de parcelas (máximo 12)"
                    />
                  </Grid>
                </Grid>

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
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => navigate("/comercial/pedidos")}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          )}
        </Card>
      </Container>
    </Box>
  );
}
