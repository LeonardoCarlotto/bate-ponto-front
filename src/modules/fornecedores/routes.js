import React from "react";

import ListaFornecedoresScreen from "./screens/ListaFornecedoresScreen";
import CadastroFornecedorScreen from "./screens/CadastroFornecedorScreen";

const routes = [
  {
    path: "/fornecedores",
    element: <ListaFornecedoresScreen />,
    private: true,
  },
  {
    path: "/fornecedores/lista",
    element: <ListaFornecedoresScreen />,
    private: true,
  },
  {
    path: "/fornecedores/cadastro",
    element: <CadastroFornecedorScreen />,
    private: true,
  },
  {
    path: "/fornecedores/cadastro/:fornecedorId",
    element: <CadastroFornecedorScreen />,
    private: true,
  },
];

export default routes;
