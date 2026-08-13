// src/NavBar.js
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../modules/configuracao/services/api";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import UserAvatar from "./UserAvatar";
import { useTranslation } from "../i18n";
import { useAuth } from "../../modules/configuracao/contexts/AuthContext";
import Logo from "../assets/logo.png";

const navGroups = [
  {
    title: "Operação",
    items: [
      { label: "Início", path: "/", icon: <HomeIcon /> },
      { label: "Ponto", path: "/configuracao/dashboard", icon: <AssignmentTurnedInIcon /> },
    ],
  },
  {
    title: "Comercial",
    items: [
      { label: "Clientes", path: "/comercial/clientes", icon: <PeopleIcon /> },
      { label: "Pedidos", path: "/comercial/pedidos", icon: <ReceiptLongIcon /> },
      { label: "Novo pedido", path: "/comercial/pedidos/novo", icon: <AddShoppingCartIcon /> },
    ],
  },
  {
    title: "Financeiro",
    items: [
      { label: "Visão financeira", path: "/financeiro/dashboard", icon: <DashboardIcon /> },
      { label: "Contas a receber", path: "/financeiro/contas-receber", icon: <PointOfSaleIcon /> },
      { label: "Contas a pagar", path: "/financeiro/contas-pagar", icon: <AccountBalanceIcon /> },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { label: "Produtos", path: "/produtos/lista", icon: <Inventory2Icon /> },
      { label: "Pacotes", path: "/produtos/pacotes/lista", icon: <CategoryIcon /> },
      { label: "Fornecedores", path: "/fornecedores/lista", icon: <LocalShippingIcon /> },
    ],
  },
];

const settingsNavItem = { label: "Configurações", path: "/configuracao", icon: <SettingsIcon /> };
const navItems = [...navGroups.flatMap((group) => group.items), settingsNavItem];

const getPageTitle = (pathname) => {
  if (pathname === "/") return "Painel geral";
  if (pathname.startsWith("/comercial/clientes")) return "Clientes";
  if (pathname.startsWith("/comercial/pedidos")) return "Pedidos";
  if (pathname.startsWith("/comercial")) return "Comercial";
  if (pathname.startsWith("/financeiro/contas-receber")) return "Contas a receber";
  if (pathname.startsWith("/financeiro/contas-pagar")) return "Contas a pagar";
  if (pathname.startsWith("/financeiro")) return "Financeiro";
  if (pathname.startsWith("/produtos/pacotes")) return "Pacotes";
  if (pathname.startsWith("/produtos")) return "Produtos";
  if (pathname.startsWith("/fornecedores")) return "Fornecedores";
  if (pathname.startsWith("/configuracao")) return "Configurações";
  return "Sistema";
};

export default function NavBar({ appBarHeight = 64, drawerWidth = 280, onLogout }) {
  const { t } = useTranslation();
  const { handleUnauthorized } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchUser() {
      const timeout = 15000;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (response.status === 403) throw new Error("Acesso negado");
        if (!response.ok) throw new Error("Erro ao buscar usuário");
        const data = await response.json();
        setUserName(data.name);
        setUserType(data.type);
        setUserPhoto(data.urlPhoto || "");
      } catch (error) {
        handleUnauthorized();
        console.error(error);
        setUserName("User");
      } finally {
        clearTimeout(id);
      }
    }
    fetchUser();
  }, [handleUnauthorized]);

  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);
  const roleLabel = userType === "ADMIN" ? "Administrador" : "Operador";
  const activeNavPath = useMemo(() => {
    const matches = navItems
      .filter((item) => {
        if (item.path === "/") return location.pathname === "/";
        return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
      })
      .sort((a, b) => b.path.length - a.path.length);

    return matches[0]?.path || null;
  }, [location.pathname]);

  const handleMenuClose = () => setAnchorEl(null);
  const goTo = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleMenuClose();
  };

  const isActive = (path) => activeNavPath === path;

  const drawerContent = (
    <Box
      sx={{
        bgcolor: "#14222d",
        color: "#d7e1ea",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ px: 2.25, py: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
              height: 46,
              objectFit: "contain",
              p: 0.5,
              width: 46,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={800} noWrap>
              FocoFlow
            </Typography>
            <Typography variant="caption" sx={{ color: "#9fb0bf" }}>
              CRM para fotógrafos
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(215, 225, 234, 0.12)" }} />

      <Box sx={{ flex: 1, overflowY: "auto", py: 1.25 }}>
        {navGroups.map((group) => (
          <Box key={group.title} sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#8798a8",
                display: "block",
                fontWeight: 800,
                px: 2.5,
                py: 1,
                textTransform: "uppercase",
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const selected = isActive(item.path);
                return (
                  <ListItemButton
                    key={item.path}
                    selected={selected}
                    onClick={() => goTo(item.path)}
                    sx={{
                      borderRadius: 1,
                      mx: 1.25,
                      my: 0.25,
                      minHeight: 44,
                      color: selected ? "#ffffff" : "#c8d4dd",
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.10)",
                        borderLeft: "3px solid #d99655",
                        boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.16)",
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: selected ? "#d99655" : "#9fb0bf",
                        minWidth: 36,
                        "& svg": {
                          fontSize: 21,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: selected ? 800 : 600,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(215, 225, 234, 0.12)" }} />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={() => goTo(settingsNavItem.path)}
          selected={isActive(settingsNavItem.path)}
          sx={{
            borderRadius: 1,
            color: "#c8d4dd",
            minHeight: 42,
            "&.Mui-selected": {
              bgcolor: "rgba(255, 255, 255, 0.12)",
            },
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#9fb0bf", minWidth: 36 }}>
            {settingsNavItem.icon}
          </ListItemIcon>
          <ListItemText
            primary={settingsNavItem.label}
            primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        color="inherit"
        position="fixed"
        sx={{
          height: appBarHeight,
          ml: { lg: `${drawerWidth}px` },
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: `${appBarHeight}px !important`, px: { xs: 2, sm: 3 } }}>
          {!isDesktop && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap sx={{ letterSpacing: 0 }}>
              {pageTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              FocoFlow CRM · gestão para fotógrafos
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              color="secondary"
              onClick={() => navigate("/comercial/pedidos/novo")}
              startIcon={<AddShoppingCartIcon />}
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
              variant="contained"
            >
              Novo pedido
            </Button>

            <Tooltip title="Menu do usuário">
              <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ p: 0 }}>
                <UserAvatar name={userName} urlPhoto={userPhoto} size={40} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <Box sx={{ px: 2, py: 1, minWidth: 220 }}>
              <Typography variant="subtitle2" noWrap>
                {userName || "Carregando..."}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {roleLabel}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => goTo("/configuracao/edit-profile")}>
              Editar Perfil
            </MenuItem>
            {userType === "ADMIN" ? (
              <>
                <MenuItem onClick={() => goTo("/configuracao/admin")}>
                  {t("nav.editedRecords")}
                </MenuItem>
                <MenuItem onClick={() => goTo("/configuracao/create-user")}>
                  {t("nav.createUser")}
                </MenuItem>
                <MenuItem onClick={() => goTo("/configuracao/users")}>
                  {t("nav.listUsers")}
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => goTo("/configuracao/report")}>
                {t("nav.report")}
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          ModalProps={{ keepMounted: true }}
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              border: 0,
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          variant="temporary"
        >
          {drawerContent}
        </Drawer>
        <Drawer
          open
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              border: 0,
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          variant="permanent"
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}
