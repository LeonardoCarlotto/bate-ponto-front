// src/routes/index.js
import configuracaoRoutes from "../modules/configuracao/routes.js";
import homeRoutes from "../modules/home/routes.js";
import comercialRoutes from "../modules/comercial/routes.js";
import administrativoRoutes from "../modules/administrativo/routes.js";
import produtosRoutes from "../modules/produtos/routes.js";
import fornecedoresRoutes from "../modules/fornecedores/routes.js";

export const routes = [
  ...homeRoutes,
  ...configuracaoRoutes,
  ...comercialRoutes,
  ...administrativoRoutes,
  ...produtosRoutes,
  ...fornecedoresRoutes,
];