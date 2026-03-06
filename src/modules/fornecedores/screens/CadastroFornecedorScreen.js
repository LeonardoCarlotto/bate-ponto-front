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
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import { fornecedoresService } from "../services/api";

export default function CadastroFornecedorScreen() {
  const navigate = useNavigate();
  const { fornecedorId } = useParams();
  const [carregando, setCarregando] = React.useState(!!fornecedorId);
  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);

  const [formData, setFormData] = React.useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    celular: "",
    contato: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    ativo: true,
  });

  const carregarFornecedor = useCallback(async () => {
    try {
      setCarregando(true);
      const fornecedor = await fornecedoresService.obter(fornecedorId);
      setFormData({
        nome: fornecedor.nome || "",
        cnpj: fornecedor.cnpj || "",
        email: fornecedor.email || "",
        telefone: fornecedor.telefone || "",
        celular: fornecedor.celular || "",
        contato: fornecedor.contato || "",
        endereco: fornecedor.endereco || "",
        cidade: fornecedor.cidade || "",
        estado: fornecedor.estado || "",
        cep: fornecedor.cep || "",
        ativo: fornecedor.ativo !== false,
      });
    } catch (error) {
      setErro("Erro ao carregar dados do fornecedor: " + error.message);
    } finally {
      setCarregando(false);
    }
  }, [fornecedorId]);

  React.useEffect(() => {
    if (fornecedorId) {
      carregarFornecedor();
    }
  }, [fornecedorId, carregarFornecedor]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErro(null);
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("Nome é obrigatório");
      return false;
    }
    if (!formData.cnpj.trim()) {
      setErro("CNPJ é obrigatório");
      return false;
    }
    if (!formData.email.trim()) {
      setErro("Email é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setErro("Email inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);

      if (fornecedorId) {
        await fornecedoresService.atualizar(fornecedorId, formData);
      } else {
        await fornecedoresService.criar(formData);
      }

      setSucesso(true);
      setTimeout(() => {
        navigate("/fornecedores/lista");
      }, 1500);
    } catch (error) {
      setErro("Erro ao salvar fornecedor: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="dm" sx={{ py: 4, mt: 2 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>

      <Card
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {fornecedorId ? "Editar Fornecedor" : "Novo Fornecedor"}
        </Typography>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Fornecedor salvo com sucesso!
          </Alert>
        )}

        {carregando && !formData.nome ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, color: "#666" }}
              >
                INFORMAÇÕES DA EMPRESA
              </Typography>
            </Grid>
            <Grid container spacing={2.5}>
              {/* Informações Básicas */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome da Empresa"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  placeholder="12.345.678/0001-90"
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleInputChange}
                  placeholder="Nome do responsável"
                  disabled={carregando}
                  size="small"
                />
              </Grid>
            </Grid>
            {/* Contato */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2, color: "#666" }}
              >
                CONTATO
              </Typography>
            </Grid>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 3000-0000"
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  disabled={carregando}
                  size="small"
                />
              </Grid>
            </Grid>
            {/* Endereço */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2, color: "#666" }}
              >
                ENDEREÇO
              </Typography>
            </Grid>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="SP"
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  placeholder="01310-100"
                  disabled={carregando}
                  size="small"
                />
              </Grid>

              {/* Botões */}
            </Grid>
            <Box sx={{ borderTop: "1px solid #eee", paddingTop: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={carregando}
                    fullWidth
                  >
                    {carregando ? <CircularProgress size={20} /> : "Salvar"}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate("/fornecedores/lista")}
                    disabled={carregando}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Card>
    </Container>
  );
}
