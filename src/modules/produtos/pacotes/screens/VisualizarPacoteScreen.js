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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BackButton from "../../../../shared/components/BackButton";
import { pacotesService } from "../services/api";

export default function VisualizarPacoteScreen() {
  const navigate = useNavigate();
  const { pacoteId } = useParams();

  const [erro, setErro] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [pacote, setPacote] = React.useState(null);
  const [mostrarPrecosItens, setMostrarPrecosItens] = React.useState(true);

  React.useEffect(() => {
    if (!pacoteId) return;

    const carregarPacote = async () => {
      try {
        setLoading(true);
        const data = await pacotesService.getById(pacoteId);
        setPacote(data);
      } catch (err) {
        setErro("Erro ao carregar pacote");
      } finally {
        setLoading(false);
      }
    };

    carregarPacote();
  }, [pacoteId]);

  const calcularTotal = () => {
    if (!pacote) return 0;
    
    if (pacote.precoPersonalizado) {
      return parseFloat(pacote.precoPersonalizado);
    }

    return pacote.itens?.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    ) || 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!pacote) {
    return (
      <Box>
        <Box sx={{ paddingX: 2 }}>
          <BackButton />
        </Box>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Pacote não encontrado
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate("/produtos/pacotes/lista")}
            >
              Voltar
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const total = calcularTotal();

  const gerarPDF = () => {
    if (!pacote) return;

    // Criar conteúdo HTML para o PDF
    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1976d2; }
          .info-section { margin-bottom: 30px; }
          .info-section h2 { color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .info-item { margin-bottom: 10px; }
          .info-label { font-weight: bold; color: #555; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th { background-color: #f5f5f5; padding: 10px; text-align: left; border: 1px solid #ddd; }
          .items-table td { padding: 10px; border: 1px solid #ddd; }
          .items-table .text-right { text-align: right; }
          .total-section { margin-top: 30px; text-align: right; }
          .total-section .total { font-size: 18px; font-weight: bold; color: #1976d2; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          .price-notice { 
            background-color: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 10px; 
            margin-bottom: 20px; 
            border-radius: 4px; 
            text-align: center; 
            color: #856404;
          }
          @media print {
            body { margin: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ORÇAMENTO - PACOTE DE SERVIÇOS</h1>
          <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div class="info-section">
          <h2>Informações do Pacote</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Nome do Pacote:</span> ${pacote.nome || ''}
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span> ${pacote.ativo ? 'Ativo' : 'Inativo'}
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">Descrição:</span>
            <p>${pacote.descricao || 'Sem descrição'}</p>
          </div>
        </div>

        <div class="info-section">
          <h2>Itens do Pacote</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th class="text-right">Quantidade</th>
                ${mostrarPrecosItens ? '<th class="text-right">Preço Unit.</th>' : ''}
                ${mostrarPrecosItens ? '<th class="text-right">Subtotal</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${pacote.itens?.map(item => `
                <tr>
                  <td>${item.tipo === 'produto' ? 'Produto' : 'Serviço'}</td>
                  <td>${item.nome}</td>
                  <td class="text-right">${item.quantidade}</td>
                  ${mostrarPrecosItens ? `<td class="text-right">R$ ${item.preco.toFixed(2)}</td>` : ''}
                  ${mostrarPrecosItens ? `<td class="text-right">R$ ${item.subtotal.toFixed(2)}</td>` : ''}
                </tr>
              `).join('') || `<tr><td colspan="${mostrarPrecosItens ? 5 : 3}" style="text-align: center;">Nenhum item adicionado</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="total-section">
          ${pacote.precoPersonalizado ? `
            <div class="info-item">
              <span class="info-label">Preço Personalizado:</span> R$ ${parseFloat(pacote.precoPersonalizado).toFixed(2)}
            </div>
          ` : ''}
          <div class="total">
            TOTAL: R$ ${total.toFixed(2)}
          </div>
        </div>

        <div class="footer">
          <p>Este orçamento foi gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          <p>Validade do orçamento: 30 dias</p>
          ${!mostrarPrecosItens ? '<p>Para condições comerciais detalhadas, favor entrar em contato.</p>' : ''}
        </div>
      </body>
      </html>
    `;

    // Criar uma nova janela para impressão
    const novaJanela = window.open('', '_blank');
    novaJanela.document.write(conteudoHTML);
    novaJanela.document.close();
    
    // Aguardar o conteúdo carregar e então abrir o diálogo de impressão
    setTimeout(() => {
      novaJanela.print();
    }, 500);
  };

  return (
    <Box>
      <Box sx={{ paddingX: 2 }}>
        <BackButton />
      </Box>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} mb={3}>
            Visualizar Pacote
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {/* INFORMAÇÕES */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Informações do Pacote
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Pacote"
                value={pacote.nome || ""}
                size="small"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={pacote.descricao || ""}
                multiline
                rows={3}
                size="small"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={pacote.ativo ?? true}
                    disabled
                  />
                }
                label="Pacote ativo"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ITENS */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Itens do Pacote
          </Typography>

          {pacote.itens?.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ background: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell align="right">Qtd</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pacote.itens.map((item) => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              Nenhum item adicionado ao pacote
            </Typography>
          )}

          {/* PREÇO */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preço Personalizado"
                value={pacote.precoPersonalizado || ""}
                size="small"
                disabled
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

          {/* OPÇÕES DO PDF */}
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Opções do Orçamento
          </Typography>
          
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mostrarPrecosItens}
                    onChange={(e) => setMostrarPrecosItens(e.target.checked)}
                  />
                }
                label="Mostrar preços unitários dos itens no orçamento"
              />
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                {mostrarPrecosItens 
                  ? "O orçamento mostrará o preço de cada item individualmente" 
                  : "O orçamento mostrará apenas o valor total, sem detalhar preços unitários"
                }
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* AÇÕES */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<PictureAsPdfIcon />}
                onClick={gerarPDF}
              >
                Gerar PDF
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate("/produtos/pacotes/lista")}
              >
                Voltar para Lista
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
