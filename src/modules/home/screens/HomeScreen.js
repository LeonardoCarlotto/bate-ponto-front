// src/pages/Home.js
import React from "react";
import {
  useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleIcon from "@mui/icons-material/People";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TuneIcon from "@mui/icons-material/Tune";
import AniversariantesNotification from "../../../shared/components/AniversariantesNotification";

const quickActions = [
  {
    title: "Novo pedido",
    description: "Criar venda",
    path: "/comercial/pedidos/novo",
    icon: <AddShoppingCartIcon />,
    tone: "#b56b2a",
  },
  {
    title: "Novo cliente",
    description: "Cadastrar contato",
    path: "/comercial/clientes/cadastro",
    icon: <PeopleIcon />,
    tone: "#2f7d5c",
  },
  {
    title: "Registrar ponto",
    description: "Abrir relógio",
    path: "/configuracao/dashboard",
    icon: <AssignmentTurnedInIcon />,
    tone: "#1f4e5f",
  },
  {
    title: "Recebimentos",
    description: "Ver cobranças",
    path: "/financeiro/contas-receber",
    icon: <PointOfSaleIcon />,
    tone: "#316ea8",
  },
  {
    title: "Produtos",
    description: "Gerir catálogo",
    path: "/produtos/lista",
    icon: <Inventory2Icon />,
    tone: "#7a5aa6",
  },
  {
    title: "Fornecedores",
    description: "Base de compras",
    path: "/fornecedores/lista",
    icon: <StorefrontIcon />,
    tone: "#9b5a24",
  },
];

const workAreas = [
  {
    title: "Comercial",
    description: "Pipeline operacional de clientes, pedidos e entregas.",
    path: "/comercial",
    icon: <ReceiptLongIcon />,
    tone: "#316ea8",
    links: [
      { label: "Clientes", path: "/comercial/clientes" },
      { label: "Pedidos", path: "/comercial/pedidos" },
      { label: "Novo pedido", path: "/comercial/pedidos/novo" },
    ],
  },
  {
    title: "Financeiro",
    description: "Cobranças, pagamentos e visão de caixa em um fluxo único.",
    path: "/financeiro/dashboard",
    icon: <AccountBalanceIcon />,
    tone: "#2f7d5c",
    links: [
      { label: "Receber", path: "/financeiro/contas-receber" },
      { label: "Pagar", path: "/financeiro/contas-pagar" },
      { label: "Dashboard", path: "/financeiro/dashboard" },
    ],
  },
  {
    title: "Catálogo",
    description: "Produtos, pacotes e itens usados nos pedidos.",
    path: "/produtos",
    icon: <Inventory2Icon />,
    tone: "#7a5aa6",
    links: [
      { label: "Produtos", path: "/produtos/lista" },
      { label: "Pacotes", path: "/produtos/pacotes/lista" },
      { label: "Novo produto", path: "/produtos/cadastro" },
    ],
  },
  {
    title: "Fornecedores",
    description: "Parceiros, contatos e base de compras.",
    path: "/fornecedores/lista",
    icon: <StorefrontIcon />,
    tone: "#b56b2a",
    links: [
      { label: "Listar", path: "/fornecedores/lista" },
      { label: "Novo", path: "/fornecedores/cadastro" },
    ],
  },
];

const adminActions = [
  { label: "Configurações", path: "/configuracao", icon: <TuneIcon /> },
  { label: "Usuários", path: "/configuracao/users", icon: <PeopleIcon /> },
  { label: "Relatórios", path: "/configuracao/report", icon: <ReceiptLongIcon /> },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <AniversariantesNotification />

      <Paper
        sx={{
          bgcolor: "#19313d",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "white",
          mb: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 1,
            px: { xs: 2, md: 3 },
            py: 1,
          }}
        >
          <Chip
            label="CRM"
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "white", fontWeight: 800 }}
          />
          <Chip
            label="Operacional"
            size="small"
            sx={{ borderColor: "rgba(255,255,255,0.32)", color: "#f1c08d" }}
            variant="outlined"
          />
        </Box>

        <Grid container>
          <Grid item xs={12} lg={7}>
            <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 3, md: 4 } }}>
              <Typography variant="h4">Central de trabalho</Typography>
              <Typography sx={{ color: "#bfd0dc", maxWidth: 620, mt: 1 }}>
                Um painel direto para abrir vendas, acompanhar financeiro e navegar pelas rotinas do sistema.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  onClick={() => navigate("/comercial/pedidos/novo")}
                  startIcon={<AddShoppingCartIcon />}
                  variant="contained"
                >
                  Criar pedido
                </Button>
                <Button
                  onClick={() => navigate("/financeiro/dashboard")}
                  startIcon={<AccountBalanceIcon />}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.32)",
                    color: "white",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.56)",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                  variant="outlined"
                >
                  Ver financeiro
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.06)",
                borderLeft: { lg: "1px solid rgba(255,255,255,0.08)" },
                height: "100%",
                px: { xs: 2, md: 3 },
                py: { xs: 2.5, md: 3 },
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "#f1c08d", mb: 2 }}>
                Rotas frequentes
              </Typography>
              <Grid container spacing={1}>
                {quickActions.slice(0, 4).map((action) => (
                  <Grid item xs={12} sm={6} key={action.title}>
                    <Button
                      fullWidth
                      onClick={() => navigate(action.path)}
                      startIcon={action.icon}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        color: "white",
                        justifyContent: "flex-start",
                        minHeight: 44,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.14)",
                        },
                      }}
                    >
                      {action.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={4} xl={2} key={action.title}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                  boxShadow: "0 14px 34px rgba(24, 36, 48, 0.10)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardActionArea onClick={() => navigate(action.path)} sx={{ height: "100%" }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box
                      sx={{
                        alignItems: "center",
                        bgcolor: action.tone,
                        borderRadius: 1,
                        color: "white",
                        display: "flex",
                        height: 40,
                        justifyContent: "center",
                        width: 40,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <ArrowForwardIcon color="action" fontSize="small" />
                  </Stack>
                  <Typography variant="h6" sx={{ mt: 1.75 }}>
                    {action.title}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 1.5,
              justifyContent: "space-between",
              mb: 1.75,
            }}
          >
            <Box>
              <Typography variant="h5">Áreas do sistema</Typography>
              <Typography color="text.secondary" variant="body2">
                Módulos principais organizados como um CRM de operação.
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: "wrap",
                gap: 1,
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {adminActions.map((action) => (
                <Button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  size="small"
                  startIcon={action.icon}
                  variant="outlined"
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Box>

          <Grid container spacing={2.5}>
            {workAreas.map((area) => (
              <Grid item xs={12} md={6} xl={3} key={area.title}>
                <Card
                  sx={{
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Box sx={{ bgcolor: area.tone, height: 4 }} />
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          alignItems: "center",
                          bgcolor: `${area.tone}18`,
                          border: `1px solid ${area.tone}36`,
                          borderRadius: 1,
                          color: area.tone,
                          display: "flex",
                          height: 44,
                          justifyContent: "center",
                          width: 44,
                        }}
                      >
                        {area.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6">{area.title}</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                          {area.description}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                      <Button size="small" onClick={() => navigate(area.path)} variant="contained">
                        Abrir área
                      </Button>
                      {area.links.map((link) => (
                        <Button
                          key={link.path}
                          onClick={() => navigate(link.path)}
                          size="small"
                          variant="outlined"
                        >
                          {link.label}
                        </Button>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
