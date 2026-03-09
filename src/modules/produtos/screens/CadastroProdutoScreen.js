import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import BackButton from "../../../shared/components/BackButton";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { produtosService } from "../services/api";

export default function CadastroProdutoScreen() {
  const navigate = useNavigate();
  const { produtoId } = useParams();

  const [carregando, setCarregando] = React.useState(!!produtoId);
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [categorias, setCategorias] = React.useState([]);
  const [openNovaCategoria, setOpenNovaCategoria] = React.useState(false);
  const [novaCategoria, setNovaCategoria] = React.useState("");
  const [novaCategoriaDescricao, setNovaCategoriaDescricao] = React.useState("");
  const [criandoCategoria, setCriandoCategoria] = React.useState(false);
  const [editandoCategoria, setEditandoCategoria] = React.useState(null);
  const [openEditCategoria, setOpenEditCategoria] = React.useState(false);
  const [categoriaEditando, setCategoriaEditando] = React.useState({ nome: "", descricao: "" });

  const [formData, setFormData] = React.useState({
    nome: "",
    descricao: "",
    categoria: "",
    preco: "",
    estoque: "0",
    status: true,
  });

  const carregarCategorias = useCallback(async () => {
    try {
      const cats = await produtosService.listarCategorias();
      setCategorias(cats || []);
    } catch (error) {
      console.error(error);
      setCategorias([]);
    }
  }, []);

  const handleCriarCategoria = async () => {
    if (!novaCategoria.trim()) {
      setErro("Nome da categoria é obrigatório");
      return;
    }

    try {
      setCriandoCategoria(true);
      const categoriaCriada = await produtosService.criarCategoria({
        nome: novaCategoria.trim(),
        descricao: novaCategoriaDescricao.trim()
      });
      
      // Adicionar a nova categoria à lista
      setCategorias(prev => [...prev, categoriaCriada]);
      
      // Selecionar a nova categoria no formulário
      setFormData(prev => ({ ...prev, categoria: categoriaCriada.nome }));
      
      // Fechar diálogo e limpar campos
      setOpenNovaCategoria(false);
      setNovaCategoria("");
      setNovaCategoriaDescricao("");
      setErro(null);
    } catch (error) {
      setErro("Erro ao criar categoria: " + error.message);
    } finally {
      setCriandoCategoria(false);
    }
  };

  const handleEditarCategoria = async () => {
    if (!categoriaEditando.nome.trim()) {
      setErro("Nome da categoria é obrigatório");
      return;
    }

    try {
      setCriandoCategoria(true);
      const categoriaAtualizada = await produtosService.atualizarCategoria(
        editandoCategoria.id,
        {
          nome: categoriaEditando.nome.trim(),
          descricao: categoriaEditando.descricao.trim()
        }
      );
      
      // Atualizar a categoria na lista
      setCategorias(prev => 
        prev.map(cat => 
          cat.id === editandoCategoria.id ? categoriaAtualizada : cat
        )
      );
      
      // Atualizar seleção se for a categoria atual do produto
      if (formData.categoria === editandoCategoria.nome) {
        setFormData(prev => ({ ...prev, categoria: categoriaAtualizada.nome }));
      }
      
      // Fechar diálogo e limpar campos
      setOpenEditCategoria(false);
      setEditandoCategoria(null);
      setCategoriaEditando({ nome: "", descricao: "" });
      setErro(null);
    } catch (error) {
      setErro("Erro ao atualizar categoria: " + error.message);
    } finally {
      setCriandoCategoria(false);
    }
  };

  const abrirEditCategoria = (categoria) => {
    setEditandoCategoria(categoria);
    setCategoriaEditando({
      nome: categoria.nome,
      descricao: categoria.descricao || ""
    });
    setOpenEditCategoria(true);
  };

  const carregarProduto = useCallback(async () => {
    try {
      setCarregando(true);
      const produto = await produtosService.obter(produtoId);

      setFormData({
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        categoria: produto.categoria || "",
        preco: produto.preco?.toString() || "",
        estoque: produto.estoque?.toString() || "0",
        status: produto.status !== undefined ? produto.status : true,
      });
    } catch (error) {
      setErro("Erro ao carregar produto: " + error.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  React.useEffect(() => {
    carregarCategorias();
    if (produtoId) carregarProduto();
  }, [produtoId, carregarCategorias, carregarProduto]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErro(null);
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }

    if (!formData.categoria) {
      setErro("Categoria é obrigatória");
      return false;
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      setErro("Preço deve ser maior que zero");
      return false;
    }

    if (parseFloat(formData.estoque) < 0) {
      setErro("Estoque não pode ser negativo");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setCarregando(true);

      const dadosEnvio = {
        ...formData,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque, 10),
      };

      if (produtoId) {
        await produtosService.atualizar(produtoId, dadosEnvio);
      } else {
        await produtosService.criar(dadosEnvio);
      }

      setSucesso(true);

      setTimeout(() => {
        navigate("/produtos/lista");
      }, 1500);
    } catch (error) {
      setErro("Erro ao salvar: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando && produtoId && !formData.nome) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>

      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>

      <Container maxWidth="md" >

        <Card sx={{ p: 4, mt: 2 }}>

          <Typography variant="h5" fontWeight={600} mb={3}>
            {produtoId ? "Editar Produto" : "Novo Produto"}
          </Typography>

          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          {sucesso && <Alert severity="success" sx={{ mb: 2 }}>Produto salvo com sucesso</Alert>}

          <form onSubmit={handleSubmit}>

            {/* INFORMAÇÕES */}
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Informações do Produto
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nome do Produto"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  size="small"
                >
                  <MenuItem value={true}>Ativo</MenuItem>
                  <MenuItem value={false}>Inativo</MenuItem>
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

            <Divider sx={{ my: 4 }} />

            {/* CLASSIFICAÇÃO */}
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Classificação
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  size="small"
                  required
                  SelectProps={{
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return <span style={{ color: '#9e9e9e' }}>Selecione uma categoria</span>;
                      }
                      return selected;
                    },
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">Selecione</MenuItem>

                  {categorias.map((cat) => (
                    <MenuItem 
                      key={cat.id} 
                      value={cat.nome}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ flex: 1 }}>{cat.nome}</Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          gap: 0.5,
                          opacity: 0.6,
                          '&:hover': { opacity: 1 }
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirEditCategoria(cat);
                          }}
                          sx={{ 
                            p: 0.5,
                            '&:hover': { 
                              backgroundColor: 'primary.light', 
                              color: 'primary.dark' 
                            } 
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                  
                  <Divider />
                  
                  <MenuItem 
                    onClick={() => setOpenNovaCategoria(true)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    <AddIcon fontSize="small" />
                    Adicionar Nova Categoria
                  </MenuItem>
                </TextField>
              </Grid>

            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* DISPONIBILIDADE */}
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              Disponibilidade
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ step: "0.01", min: "0" }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estoque"
                  name="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={handleInputChange}
                  size="small"
                  inputProps={{ min: "0" }}
                />
              </Grid>

            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* AÇÕES */}
            <Grid container spacing={2}>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={carregando}
                >
                  {carregando ? "Salvando..." : "Salvar"}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/produtos/lista")}
                >
                  Cancelar
                </Button>
              </Grid>

            </Grid>

          </form>

        </Card>

        {/* Diálogo para Nova Categoria */}
        <Dialog 
          open={openNovaCategoria} 
          onClose={() => setOpenNovaCategoria(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Categoria"
              fullWidth
              variant="outlined"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              size="small"
              sx={{ mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Descrição (opcional)"
              fullWidth
              variant="outlined"
              value={novaCategoriaDescricao}
              onChange={(e) => setNovaCategoriaDescricao(e.target.value)}
              size="small"
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenNovaCategoria(false)}
              disabled={criandoCategoria}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCriarCategoria}
              variant="contained"
              disabled={criandoCategoria || !novaCategoria.trim()}
              startIcon={criandoCategoria ? <CircularProgress size={16} /> : <AddIcon />}
            >
              {criandoCategoria ? "Criando..." : "Criar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para Editar Categoria */}
        <Dialog 
          open={openEditCategoria} 
          onClose={() => setOpenEditCategoria(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome da Categoria"
              fullWidth
              variant="outlined"
              value={categoriaEditando.nome}
              onChange={(e) => setCategoriaEditando(prev => ({ ...prev, nome: e.target.value }))}
              size="small"
              sx={{ mt: 1 }}
            />
            <TextField
              margin="dense"
              label="Descrição (opcional)"
              fullWidth
              variant="outlined"
              value={categoriaEditando.descricao}
              onChange={(e) => setCategoriaEditando(prev => ({ ...prev, descricao: e.target.value }))}
              size="small"
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenEditCategoria(false)}
              disabled={criandoCategoria}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditarCategoria}
              variant="contained"
              disabled={criandoCategoria || !categoriaEditando.nome.trim()}
              startIcon={criandoCategoria ? <CircularProgress size={16} /> : <EditIcon />}
            >
              {criandoCategoria ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}