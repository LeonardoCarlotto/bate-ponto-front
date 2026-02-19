// src/components/PrivateLayout.js
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";

export default function PrivateLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <main style={{ marginTop: "4rem" }}>
        {children || <Outlet />}
      </main>
    </>
  );
}