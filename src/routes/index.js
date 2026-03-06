// src/routes/index.js
import pontoRoutes from "../modules/configuracao/routes.js";
import homeRoutes from "../modules/home/routes.js";
import comercialRoutes from "../modules/comercial/routes.js";
import administrativoRoutes from "../modules/administrativo/routes.js";
import produtosRoutes from "../modules/produtos/routes.js";
import fornecedoresRoutes from "../modules/fornecedores/routes.js";

export const routes = [
  ...homeRoutes,
  ...pontoRoutes,
  ...comercialRoutes,
  ...administrativoRoutes,
  ...produtosRoutes,
  ...fornecedoresRoutes,
];