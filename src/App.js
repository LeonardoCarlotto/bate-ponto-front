// src/App.js
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "./theme";
import { AuthProvider } from "./modules/ponto/contexts/AuthContext";
import RouteRenderer from "./routes/RouteRenderer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouteRenderer />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;