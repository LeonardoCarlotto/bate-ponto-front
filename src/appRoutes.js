import React from "react";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AdminEditedRegistersScreen from "./screens/AdminEditedRegistersScreen";
import CreateUserScreen from "./screens/CreateUserScreen";
import ReportScreen from "./screens/ReportScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import EditUserScreen from "./screens/EditUserScreen";
import UserListScreen from "./screens/UserListScreen";

const routes = [
  {
    path: "/login",
    element: <LoginScreen />,
    private: false,
  },
  {
    path: "/",
    element: <DashboardScreen />,
    private: true,
  },
  {
    path: "/admin",
    element: <AdminEditedRegistersScreen />,
    private: true,
  },
  {
    path: "/create-user",
    element: <CreateUserScreen />,
    private: true,
  },
  {
    path: "/users",
    element: <UserListScreen />,
    private: true,
  },
  {
    path: "/change-password",
    element: <ChangePasswordScreen />,
    private: true,
  },
  {
    path: "/edit-profile",
    element: <EditUserScreen />,
    private: true,
  },
  {
    path: "/report",
    element: <ReportScreen />,
    private: true,
  },
];

export default routes;