// src/routes/index.js
import configuracaoRoutes from "../modules/configuracao/routes.js";
import homeRoutes from "../modules/home/routes.js";
import comercialRoutes from "../modules/comercial/routes.js";
import produtosRoutes from "../modules/produtos/routes.js";
import fornecedoresRoutes from "../modules/fornecedores/routes.js";
import financeiroRoutes from "../modules/financeiro/routes.js";

export const routes = [
  ...homeRoutes,
  ...configuracaoRoutes,
  ...comercialRoutes,
  ...produtosRoutes,
  ...fornecedoresRoutes,
  ...financeiroRoutes,
];