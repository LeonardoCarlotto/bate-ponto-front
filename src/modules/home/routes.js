import React from "react";

import HomeScreen from "./screens/HomeScreen";

const routes = [
  {
    path: "/",
    element: <HomeScreen />,
    private: true,
  }
];

export default routes;