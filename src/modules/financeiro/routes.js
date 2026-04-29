import React from "react";

import FinanceiroHomeScreen from "./screens/FinanceiroHomeScreen";
import DashboardFinanceiroScreen from "./screens/DashboardFinanceiroScreen";
import ContasReceberScreen from "./contas-receber/screens/ContasReceberScreen";
import DetalhesClienteScreen from "./contas-receber/screens/DetalhesClienteScreen";
import RegistrarPagamentoScreen from "./contas-receber/screens/RegistrarPagamentoScreen";
import contasPagarRoutes from "./contas-pagar/routes";

const routes = [
  {
    path: "/financeiro",
    element: <FinanceiroHomeScreen />,
    private: true,
  },
  {
    path: "/financeiro/dashboard",
    element: <DashboardFinanceiroScreen />,
    private: true,
  },
  {
    path: "/financeiro/contas-receber",
    element: <ContasReceberScreen />,
    private: true,
  },
  {
    path: "/financeiro/contas-receber/cliente/:clienteId",
    element: <DetalhesClienteScreen />,
    private: true,
  },
  {
    path: "/financeiro/contas-receber/cliente/:clienteId/pagar",
    element: <RegistrarPagamentoScreen />,
    private: true,
  },
  ...contasPagarRoutes,
];

export default routes;
