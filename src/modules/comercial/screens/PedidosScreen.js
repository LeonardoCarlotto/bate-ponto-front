import React from "react";
import {
  useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArticleIcon from "@mui/icons-material/Article";
import SyncIcon from "@mui/icons-material/Sync";
import BackButton from "../../../shared/components/BackButton";
import { clientesService, nfseService, pedidosService } from "../services/api";

export default function PedidosScreen() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = React.useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = React.useState([]);
  const [termoBusca, setTermoBusca] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [erro, setErro] = React.useState(null);
  const [mensagem, setMensagem] = React.useState(null);
  const [nfsePorPedido, setNfsePorPedido] = React.useState({});
  const [nfseLoadingPorPedido, setNfseLoadingPorPedido] = React.useState({});
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = React.useState(null);

  const nfseConfigurado = nfseService.isConfigured();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'preparacao':
        return 'warning';
      case 'entregue':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PREPARACAO':
        return 'Em preparação';
      case 'ENTREGUE':
        return 'Entregue';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getNfseStatusColor = (nfse, carregando) => {
    if (!nfseConfigurado) return 'default';
    if (carregando) return 'info';
    if (!nfse) return 'default';

    switch (nfse.status) {
      case 'EMITIDA':
        return 'success';
      case 'REJEITADA':
      case 'ERRO':
        return 'error';
      case 'CANCELADA':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getNfseStatusLabel = (nfse, carregando) => {
    if (!nfseConfigurado) return 'NFS-e off';
    if (carregando) return 'Consultando';
    if (!nfse) return 'Não emitida';

    switch (nfse.status) {
      case 'EMITIDA':
        return nfse.numeroNfse ? `NFS-e ${nfse.numeroNfse}` : 'Emitida';
      case 'PROCESSANDO':
        return 'Processando';
      case 'PENDENTE':
        return 'Pendente';
      case 'REJEITADA':
        return 'Rejeitada';
      case 'ERRO':
        return 'Erro fiscal';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return nfse.status || 'Consultar';
    }
  };

  const carregarStatusNfse = React.useCallback(async (listaPedidos) => {
    if (!nfseService.isConfigured() || !listaPedidos?.length) {
      return;
    }

    const updates = await Promise.all(
      listaPedidos.map(async (pedido) => {
        try {
          const nfse = await nfseService.consultarPorPedido(pedido.id);
          return [pedido.id, nfse];
        } catch (error) {
          console.warn(`Não foi possível consultar NFS-e do pedido ${pedido.id}:`, error);
          return [pedido.id, null];
        }
      })
    );

    setNfsePorPedido((atual) => ({
      ...atual,
      ...Object.fromEntries(updates),
    }));
  }, []);

  React.useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setLoading(true);
        setErro(null);
        
        const dados = await pedidosService.listar();
        setPedidos(dados || []);
        setPedidosFiltrados(dados || []);
        carregarStatusNfse(dados || []);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setErro(error.message || 'Erro ao carregar pedidos. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, [carregarStatusNfse]);

  React.useEffect(() => {
    if (termoBusca.trim() === "") {
      setPedidosFiltrados(pedidos);
    } else {
      const filtrados = pedidos.filter(pedido => {
        const clienteNome = pedido.clienteNome || '';
        const searchTerm = termoBusca.toLowerCase();
        
        return (
          clienteNome.toLowerCase().includes(searchTerm) ||
          pedido.status?.toLowerCase().includes(searchTerm) ||
          pedido.id?.toString().includes(searchTerm)
        );
      });
      setPedidosFiltrados(filtrados);
    }
  }, [termoBusca, pedidos]);

  const handleNovoPedido = () => {
    navigate("/comercial/pedidos/novo");
  };

  const handleEditar = (pedidoId) => {
    navigate(`/comercial/pedidos/editar/${pedidoId}`);
  };

  const handleVisualizar = (pedidoId) => {
    navigate(`/comercial/pedidos/visualizar/${pedidoId}`);
  };

  const handleDeletar = async (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        setErro(null);
        setMensagem(null);
        await pedidosService.deletar(pedidoId);
        // Recarregar a lista
        const dados = await pedidosService.listar();
        setPedidos(dados || []);
        setPedidosFiltrados(dados || []);
        setMensagem('Pedido cancelado com sucesso');
      } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        setErro(error.message || 'Erro ao cancelar pedido. Tente novamente.');
      }
    }
  };

  const handleAbrirMenu = (event, pedido) => {
    setMenuAnchorEl(event.currentTarget);
    setPedidoSelecionado(pedido);
  };

  const handleFecharMenu = () => {
    setMenuAnchorEl(null);
    setPedidoSelecionado(null);
  };

  const setNfseLoading = (pedidoId, loadingValue) => {
    setNfseLoadingPorPedido((atual) => ({
      ...atual,
      [pedidoId]: loadingValue,
    }));
  };

  const atualizarNfseDoPedido = async (pedidoId) => {
    const nfse = await nfseService.consultarPorPedido(pedidoId);
    setNfsePorPedido((atual) => ({
      ...atual,
      [pedidoId]: nfse,
    }));
    return nfse;
  };

  const handleConsultarNfse = async (pedido) => {
    handleFecharMenu();

    try {
      setErro(null);
      setMensagem(null);
      setNfseLoading(pedido.id, true);
      const nfse = await atualizarNfseDoPedido(pedido.id);
      setMensagem(nfse ? 'NFS-e consultada com sucesso' : 'Este pedido ainda não possui NFS-e emitida');
    } catch (error) {
      console.error('Erro ao consultar NFS-e:', error);
      setErro(error.message || 'Erro ao consultar NFS-e.');
    } finally {
      setNfseLoading(pedido.id, false);
    }
  };

  const handleEmitirNfse = async (pedido) => {
    handleFecharMenu();

    if (pedido.status === 'CANCELADO') {
      setErro('Não é possível emitir NFS-e para pedido cancelado.');
      return;
    }

    try {
      setErro(null);
      setMensagem(null);
      setNfseLoading(pedido.id, true);

      const [pedidoCompleto, cliente] = await Promise.all([
        pedidosService.obter(pedido.id),
        clientesService.obter(pedido.clienteId),
      ]);
      const nfse = await nfseService.emitirPorPedido(pedidoCompleto, cliente);

      setNfsePorPedido((atual) => ({
        ...atual,
        [pedido.id]: nfse,
      }));
      setMensagem('Solicitação de NFS-e enviada com sucesso');
    } catch (error) {
      console.error('Erro ao emitir NFS-e:', error);
      setErro(error.message || 'Erro ao emitir NFS-e.');
    } finally {
      setNfseLoading(pedido.id, false);
    }
  };

  const getNfseParaDownload = async (pedido) => {
    return nfsePorPedido[pedido.id] || await atualizarNfseDoPedido(pedido.id);
  };

  const handleBaixarPdf = async (pedido) => {
    handleFecharMenu();

    try {
      setErro(null);
      setMensagem(null);
      setNfseLoading(pedido.id, true);
      const nfse = await getNfseParaDownload(pedido);

      if (!nfse?.id) {
        setErro('Este pedido ainda não possui NFS-e para baixar.');
        return;
      }

      await nfseService.baixarPdf(nfse.id, pedido.id);
    } catch (error) {
      console.error('Erro ao baixar DANFSe:', error);
      setErro(error.message || 'Erro ao baixar DANFSe.');
    } finally {
      setNfseLoading(pedido.id, false);
    }
  };

  const handleBaixarXml = async (pedido) => {
    handleFecharMenu();

    try {
      setErro(null);
      setMensagem(null);
      setNfseLoading(pedido.id, true);
      const nfse = await getNfseParaDownload(pedido);

      if (!nfse?.id) {
        setErro('Este pedido ainda não possui XML de NFS-e.');
        return;
      }

      await nfseService.baixarXml(nfse.id, pedido.id);
    } catch (error) {
      console.error('Erro ao baixar XML:', error);
      setErro(error.message || 'Erro ao baixar XML.');
    } finally {
      setNfseLoading(pedido.id, false);
    }
  };

  const nfseSelecionada = pedidoSelecionado ? nfsePorPedido[pedidoSelecionado.id] : null;
  const nfseSelecionadaLoading = pedidoSelecionado ? nfseLoadingPorPedido[pedidoSelecionado.id] : false;
  const nfseDownloadDisponivel = Boolean(nfseSelecionada?.id);

  return (
    <Box sx={{ paddingX: 2 }}>
      <BackButton to="/comercial" />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5">Gerenciar Pedidos</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNovoPedido}
          >
            Novo Pedido
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar por ID, cliente ou status..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
        </Grid>

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErro(null)}>
            {erro}
          </Alert>
        )}

        {mensagem && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMensagem(null)}>
            {mensagem}
          </Alert>
        )}

        {!nfseConfigurado && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Configure REACT_APP_NFSE_API_KEY e REACT_APP_NFSE_API_URL para habilitar ações fiscais.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando pedidos...
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Fiscal</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ padding: 3 }}>
                      <Typography color="textSecondary">
                        {termoBusca.trim() === "" ? "Nenhum pedido cadastrado" : "Nenhum pedido encontrado"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>
                        {pedido.clienteNome || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(pedido.data).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(pedido.status)} 
                          color={getStatusColor(pedido.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        R$ {parseFloat(pedido.valor || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getNfseStatusLabel(nfsePorPedido[pedido.id], nfseLoadingPorPedido[pedido.id])}
                          color={getNfseStatusColor(nfsePorPedido[pedido.id], nfseLoadingPorPedido[pedido.id])}
                          size="small"
                          variant={nfsePorPedido[pedido.id] ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ações do pedido">
                          <span>
                            <IconButton
                              size="small"
                              onClick={(event) => handleAbrirMenu(event, pedido)}
                              disabled={nfseLoadingPorPedido[pedido.id]}
                              aria-label={`Ações do pedido ${pedido.id}`}
                            >
                              {nfseLoadingPorPedido[pedido.id] ? (
                                <CircularProgress size={20} />
                              ) : (
                                <MoreVertIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleFecharMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleVisualizar(pedidoSelecionado.id)} disabled={!pedidoSelecionado}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Visualizar</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleEditar(pedidoSelecionado.id)} disabled={!pedidoSelecionado}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => handleEmitirNfse(pedidoSelecionado)}
            disabled={!pedidoSelecionado || !nfseConfigurado || pedidoSelecionado.status === 'CANCELADO' || nfseSelecionadaLoading}
          >
            <ListItemIcon>
              <ReceiptLongIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Emitir NFS-e</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleConsultarNfse(pedidoSelecionado)}
            disabled={!pedidoSelecionado || !nfseConfigurado || nfseSelecionadaLoading}
          >
            <ListItemIcon>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Consultar NFS-e</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleBaixarPdf(pedidoSelecionado)}
            disabled={!pedidoSelecionado || !nfseConfigurado || !nfseDownloadDisponivel || nfseSelecionadaLoading}
          >
            <ListItemIcon>
              <FileDownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Baixar DANFSe</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleBaixarXml(pedidoSelecionado)}
            disabled={!pedidoSelecionado || !nfseConfigurado || !nfseDownloadDisponivel || nfseSelecionadaLoading}
          >
            <ListItemIcon>
              <ArticleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Baixar XML</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              const pedidoId = pedidoSelecionado.id;
              handleFecharMenu();
              handleDeletar(pedidoId);
            }}
            disabled={!pedidoSelecionado || pedidoSelecionado.status === 'CANCELADO'}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cancelar pedido</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
}
