import React from "react";

import ComercialHomeScreen from "./screens/ComercialHomeScreen";
import PedidosScreen from "./screens/PedidosScreen";
import CadastroPedidoScreen from "./screens/CadastroPedidoScreen";
import EditarPedidoScreen from "./screens/EditarPedidoScreen";
import VisualizarPedidoScreen from "./screens/VisualizarPedidoScreen";
import ContasReceberScreen from "./contas-receber/screens/ContasReceberScreen";
import DetalhesClienteScreen from "./contas-receber/screens/DetalhesClienteScreen";
import RegistrarPagamentoScreen from "./contas-receber/screens/RegistrarPagamentoScreen";

const routes = [
  {
    path: "/comercial",
    element: <ComercialHomeScreen />,
    private: true,
  },
  {
    path: "/comercial/pedidos",
    element: <PedidosScreen />,
    private: true,
  },
  {
    path: "/comercial/pedidos/novo",
    element: <CadastroPedidoScreen />,
    private: true,
  },
  {
    path: "/comercial/pedidos/editar/:pedidoId",
    element: <EditarPedidoScreen />,
    private: true,
  },
  {
    path: "/comercial/pedidos/visualizar/:pedidoId",
    element: <VisualizarPedidoScreen />,
    private: true,
  },
  {
    path: "/comercial/contas-receber",
    element: <ContasReceberScreen />,
    private: true,
  },
  {
    path: "/comercial/contas-receber/cliente/:clienteId",
    element: <DetalhesClienteScreen />,
    private: true,
  },
  {
    path: "/comercial/contas-receber/cliente/:clienteId/pagar",
    element: <RegistrarPagamentoScreen />,
    private: true,
  },
];

export default routes;
