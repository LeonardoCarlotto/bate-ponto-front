import React from "react";

import LoginScreen from "./screens/LoginScreen";
import ConfiguracaoHomeScreen from "./screens/ConfiguracaoHomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AdminEditedRegistersScreen from "./screens/AdminEditedRegistersScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import ReportScreen from "./screens/ReportScreen";
import EditUserScreen from "./screens/EditUserScreen";
import UserListScreen from "./screens/UserListScreen";

const routes = [
  {
    path: "/login",
    element: <LoginScreen />,
    private: false,
  },
  {
    path: "/configuracao",
    element: <ConfiguracaoHomeScreen />,
    private: true,
  },
  {
    path: "/configuracao/dashboard",
    element: <DashboardScreen />,
    private: true,
  },
  {
    path: "/configuracao/admin",
    element: <AdminEditedRegistersScreen />,
    private: true,
  },
  {
    path: "/configuracao/create-user",
    element: <CreateUserScreen />,
    private: true,
  },
  {
    path: "/configuracao/users",
    element: <UserListScreen />,
    private: true,
  },
  {
    path: "/configuracao/edit-profile",
    element: <EditUserScreen />,
    private: true,
  },
  {
    path: "/configuracao/report",
    element: <ReportScreen />,
    private: true,
  },
];

export default routes;