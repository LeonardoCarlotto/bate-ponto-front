// src/App.js
import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppRoutes from "./appRoutes";
import PrivateLayout from "./components/PrivateLayout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {AppRoutes.map(({ path, element, private: isPrivate }) => {
          if (isPrivate) {
            return (
              <Route
                key={path}
                path={path}
                element={
                  isAuthenticated ? (
                    <PrivateLayout onLogout={handleLogout}>
                      {element}
                    </PrivateLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            );
          } else {
            return (
              <Route
                key={path}
                path={path}
                element={React.cloneElement(element, { onLogin: handleLogin })}
              />
            );
          }
        })}

        {/* fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;