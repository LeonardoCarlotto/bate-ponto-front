import React from "react";

import ComercialHomeScreen from "./screens/ComercialHomeScreen";
import PedidosScreen from "./screens/PedidosScreen";
import ProdutosComercialScreen from "./screens/ProdutosComercialScreen";
import CadastroPedidoScreen from "./screens/CadastroPedidoScreen";

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
    path: "/comercial/produtos",
    element: <ProdutosComercialScreen />,
    private: true,
  },
];

export default routes;
