// src/routes/index.js
import pontoRoutes from "../modules/ponto/routes.js";
import homeRoutes from "../modules/home/routes.js";
// futuramente:
// import comercialRoutes from "../modules/comercial/appRoutes";

export const routes = [
  ...pontoRoutes,
  ...homeRoutes,
  // ...comercialRoutes,
  // ...rhRoutes,
];