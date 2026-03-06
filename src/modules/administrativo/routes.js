import React from "react";

import AdministrativoHomeScreen from "./screens/AdministrativoHomeScreen";
import ClientesScreen from "./screens/ClientesScreen";
import CadastroClienteScreen from "./screens/CadastroClienteScreen";

const routes = [
  {
    path: "/administrativo",
    element: <AdministrativoHomeScreen />,
    private: true,
  },
  {
    path: "/administrativo/clientes",
    element: <ClientesScreen />,
    private: true,
  },
  {
    path: "/administrativo/clientes/cadastro",
    element: <CadastroClienteScreen />,
    private: true,
  },
  {
    path: "/administrativo/clientes/cadastro/:clienteId",
    element: <CadastroClienteScreen />,
    private: true,
  },
];

export default routes;
