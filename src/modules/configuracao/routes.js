import React from "react";

import LoginScreen from "./screens/LoginScreen";
import PontoHomeScreen from "./screens/PontoHomeScreen";
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
    path: "/ponto",
    element: <PontoHomeScreen />,
    private: true,
  },
  {
    path: "/ponto/dashboard",
    element: <DashboardScreen />,
    private: true,
  },
  {
    path: "/ponto/admin",
    element: <AdminEditedRegistersScreen />,
    private: true,
  },
  {
    path: "/ponto/create-user",
    element: <CreateUserScreen />,
    private: true,
  },
  {
    path: "/ponto/users",
    element: <UserListScreen />,
    private: true,
  },
  {
    path: "/ponto/edit-profile",
    element: <EditUserScreen />,
    private: true,
  },
  {
    path: "/ponto/report",
    element: <ReportScreen />,
    private: true,
  },
];

export default routes;