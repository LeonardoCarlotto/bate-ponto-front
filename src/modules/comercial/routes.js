import React from "react";

import ComercialHomeScreen from "./screens/ComercialHomeScreen";
import PedidosScreen from "./screens/PedidosScreen";
import CadastroPedidoScreen from "./screens/CadastroPedidoScreen";
import EditarPedidoScreen from "./screens/EditarPedidoScreen";
import VisualizarPedidoScreen from "./screens/VisualizarPedidoScreen";
import ClientesScreen from "./screens/ClientesScreen";
import CadastroClienteScreen from "./screens/CadastroClienteScreen";

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
    path: "/comercial/clientes",
    element: <ClientesScreen />,
    private: true,
  },
  {
    path: "/comercial/clientes/cadastro",
    element: <CadastroClienteScreen />,
    private: true,
  },
  {
    path: "/comercial/clientes/cadastro/:clienteId",
    element: <CadastroClienteScreen />,
    private: true,
  },
];

export default routes;
