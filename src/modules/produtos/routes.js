import React from "react";

import ProdutosHomeScreen from "./screens/ProdutosHomeScreen";
import ListaProdutosScreen from "./screens/ListaProdutosScreen";
import CadastroProdutoScreen from "./screens/CadastroProdutoScreen";
import pacotesRoutes from "./pacotes/routes";

const routes = [
  {
    path: "/produtos",
    element: <ProdutosHomeScreen />,
    private: true,
  },
  {
    path: "/produtos/lista",
    element: <ListaProdutosScreen />,
    private: true,
  },
  {
    path: "/produtos/cadastro",
    element: <CadastroProdutoScreen />,
    private: true,
  },
  {
    path: "/produtos/cadastro/:produtoId",
    element: <CadastroProdutoScreen />,
    private: true,
  },
  ...pacotesRoutes,
];

export default routes;
