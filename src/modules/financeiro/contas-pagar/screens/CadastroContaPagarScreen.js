import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import BackButton from "../../../../shared/components/BackButton";
import { fornecedoresService } from "../../../fornecedores/services/api";
import { contasPagarService } from "../services/api";

export default function CadastroContaPagarScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [erro, setErro] = React.useState(null);
  const [sucesso, setSucesso] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isViewing, setIsViewing] = React.useState(false);

  const [fornecedores, setFornecedores] = React.useState([]);

  const [formData, setFormData] = React.useState({
    fornecedorId: "",
    dataVencimento: new Date().toISOString().split("T")[0],
    dataPagamento: "",
    status: "PENDENTE",
    descricao: "",
    valor: "",
    formaPagamento: "",
    parcelas: 1,
  });

  // Carregar dados da API
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setErro(null);

        const [fornecedoresData] = await Promise.all([
          fornecedoresService.listar(),
        ]);

        setFornecedores(fornecedoresData || []);

        // Verificar se está editando ou visualizando
        if (id) {
          const path = window.location.pathname;
          if (path.includes('/visualizar/')) {
            setIsViewing(true);
          } else {
            setIsEditing(true);
          }
          
          // Carregar dados da conta
          const contaData = await contasPagarService.obter(id);
          if (contaData) {
            setFormData({
              fornecedorId: contaData.fornecedorId?.toString() || "",
              dataVencimento: contaData.dataVencimento?.split('T')[0] || new Date().toISOString().split("T")[0],
              dataPagamento: contaData.dataPagamento?.split('T')[0] || "",
              status: contaData.status || "PENDENTE",
              descricao: contaData.descricao || "",
              valor: contaData.valor?.toString() || "",
              formaPagamento: contaData.formaPagamento || "",
              parcelas: contaData.parcelas || 1,
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados. Tente recarregar a página.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErro(null);
  };

  const validarFormulario = () => {
    if (!formData.fornecedorId) {
      setErro("Fornecedor é obrigatório");
      return false;
    }

    if (!formData.descricao) {
      setErro("Descrição é obrigatória");
      return false;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      setErro("Valor deve ser maior que 0");
      return false;
    }

    if (!formData.dataVencimento) {
      setErro("Data de vencimento é obrigatória");
      return false;
    }

    if (!formData.formaPagamento) {
      setErro("Forma de pagamento é obrigatória");
      return false;
    }

    // Validar parcelas para todas as formas de pagamento
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

      const contaData = {
        ...formData,
        valor: parseFloat(formData.valor),
        dataVencimento: formData.dataVencimento,
        dataPagamento: formData.dataPagamento || null,
        status: isEditing ? formData.status : 'PENDENTE', // Na criação sempre PENDENTE
      };

      if (isEditing) {
        // Chamada real à API para atualizar a conta a pagar
        await contasPagarService.atualizar(id, contaData);
      } else {
        // Chamada real à API para criar a conta a pagar
        await contasPagarService.criar(contaData);
      }

      setSucesso(true);

      setTimeout(() => {
        navigate("/financeiro/contas-pagar");
      }, 1200);
    } catch (error) {
      console.error('Erro ao salvar conta a pagar:', error);
      setErro("Erro ao salvar conta a pagar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
                  Conta a pagar salva com sucesso
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Typography variant="h5" fontWeight={600} mb={3}>
                  {isViewing ? 'Visualizar Conta a Pagar' : isEditing ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Informações da Conta
                </Typography>

                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Fornecedor"
                      name="fornecedorId"
                      value={formData.fornecedorId}
                      onChange={handleInputChange}
                      size="small"
                      required
                      disabled={isViewing}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '8.5px 100px'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>

                      {fornecedores.map((fornecedor) => (
                        <MenuItem key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Data de Vencimento"
                      name="dataVencimento"
                      type="date"
                      value={formData.dataVencimento}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      required
                      disabled={isViewing}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Data de Pagamento"
                      name="dataPagamento"
                      type="date"
                      value={formData.dataPagamento}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      helperText="Deixe em branco se ainda não foi paga"
                      disabled={isViewing}
                    />
                  </Grid>

                  {isEditing && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={formData.status || 'PENDENTE'}
                      onChange={handleInputChange}
                      size="small"
                      required
                      disabled={isViewing}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '8.5px 100px'
                        }
                      }}
                    >
                      <MenuItem value="PENDENTE">Pendente</MenuItem>
                      <MenuItem value="PAGO">Pago</MenuItem>
                      <MenuItem value="VENCIDO">Vencido</MenuItem>
                      <MenuItem value="CANCELADO">Cancelado</MenuItem>
                    </TextField>
                  </Grid>
                )}

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor"
                      name="valor"
                      type="number"
                      value={formData.valor}
                      onChange={handleInputChange}
                      inputProps={{ min: 0.01, step: 0.01 }}
                      size="small"
                      required
                      disabled={isViewing}
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
                      required
                      disabled={isViewing}
                    />
                  </Grid>
                </Grid>

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
                      disabled={isViewing}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          padding: '8.5px 100px'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Selecione</em>
                      </MenuItem>
                      <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
                      <MenuItem value="PIX">PIX</MenuItem>
                      <MenuItem value="CARTAO_CREDITO">Cartão de Crédito</MenuItem>
                      <MenuItem value="CARTAO_DEBITO">Cartão de Débito</MenuItem>
                      <MenuItem value="BOLETO">Boleto</MenuItem>
                      <MenuItem value="TRANSFERENCIA">Transferência Bancária</MenuItem>
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
                      disabled={isViewing}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  {!isViewing && (
                    <Grid item xs={12} md={6}>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                      </Button>
                    </Grid>
                  )}

                  <Grid item xs={12} md={isViewing ? 12 : 6}>
                    <Button
                      fullWidth
                      variant={isViewing ? "contained" : "outlined"}
                      startIcon={<CancelIcon />}
                      onClick={() => navigate("/financeiro/contas-pagar")}
                      disabled={loading}
                    >
                      {isViewing ? 'Voltar' : 'Cancelar'}
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
