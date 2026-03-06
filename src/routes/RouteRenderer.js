// src/routes/RouteRenderer.js
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { routes } from "./index";
import PrivateLayout from "../shared/components/PrivateLayout";
import { useAuth } from "../modules/configuracao/contexts/AuthContext";

function RouteRenderer() {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element, private: isPrivate }) => {
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
          }

          return (
            <Route
              key={path}
              path={path}
              element={React.cloneElement(element, { onLogin: handleLogin })}
            />
          );
        })}

        {/* fallback global */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default RouteRenderer;