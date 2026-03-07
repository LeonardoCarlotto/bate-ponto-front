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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import { produtosService } from "../services/api";

export default function CadastroProdutoScreen() {
  const navigate = useNavigate();
  const { produtoId } = useParams();

  const [carregando, setCarregando] = React.useState(!!produtoId);
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [categorias, setCategorias] = React.useState([]);

  const [formData, setFormData] = React.useState({
    nome: "",
    descricao: "",
    categoria: "",
    preco: "",
    estoque: "0",
    status: "ativo",
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
        status: produto.status || "ativo",
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

      <Box sx={{ px: 2, mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Box>

      <Container maxWidth="md">

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
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                  <MenuItem value="descontinuado">Descontinuado</MenuItem>
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

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  size="small"
                >
                  <MenuItem value="">Selecione</MenuItem>

                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </MenuItem>
                  ))}
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
      </Container>
    </Box>
  );
}