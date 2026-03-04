// src/App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppRoutes from "./appRoutes";
import PrivateLayout from "./components/PrivateLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function AppContent() {
  const { isAuthenticated, handleLogin, handleLogout } = useAuth();
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;