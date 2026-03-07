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
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BackButton from "../../../shared/components/BackButton";
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
        contato: fornecedor.contato || "",
        endereco: fornecedor.endereco || "",
        cidade: fornecedor.cidade || "",
        estado: fornecedor.estado || "",
        cep: fornecedor.cep || "",
        ativo: fornecedor.ativo !== false,
      });
    } catch (error) {
      setErro("Erro ao carregar fornecedor: " + error.message);
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

    if (!validarFormulario()) return;

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

  if (carregando && fornecedorId && !formData.nome) {
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
    <Container maxWidth="md">

      <Card sx={{ p: 4 }}>

        <Typography variant="h5" fontWeight={600} mb={3}>
          {fornecedorId ? "Editar Fornecedor" : "Novo Fornecedor"}
        </Typography>

        {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
        {sucesso && <Alert severity="success" sx={{ mb: 2 }}>Fornecedor salvo com sucesso</Alert>}

        <form onSubmit={handleSubmit}>

          {/* EMPRESA */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Informações da Empresa
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Nome da Empresa"
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
                label="CNPJ"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                placeholder="00.000.000/0000-00"
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contato"
                name="contato"
                value={formData.contato}
                onChange={handleInputChange}
                placeholder="Responsável"
                size="small"
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* CONTATO */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Contato
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 3000-0000"
                size="small"
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ENDEREÇO */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Endereço
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                placeholder="SP"
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                placeholder="00000-000"
                size="small"
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* BOTÕES */}
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
                onClick={() => navigate("/fornecedores/lista")}
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