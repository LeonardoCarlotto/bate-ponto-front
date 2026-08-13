// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f4e5f",
      dark: "#153844",
      light: "#3f7182",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b56b2a",
      dark: "#854817",
      light: "#d99655",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2f7d5c",
    },
    info: {
      main: "#316ea8",
    },
    warning: {
      main: "#b98218",
    },
    error: {
      main: "#b84444",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#1d2730",
      secondary: "#65717d",
    },
    divider: "#dbe1e7",
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.25,
    },
    h5: {
      fontWeight: 700,
      fontSize: "1.35rem",
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: 1.35,
    },
    subtitle2: {
      fontWeight: 700,
      color: "#3a4652",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f4f6f8",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 0 rgba(24, 36, 48, 0.08)",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid #dbe1e7",
          boxShadow: "0 8px 24px rgba(24, 36, 48, 0.05)",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthMd: {
          "@media (min-width: 900px)": {
            maxWidth: 1180,
          },
        },
        maxWidthLg: {
          "@media (min-width: 1200px)": {
            maxWidth: 1440,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 40,
          paddingLeft: 14,
          paddingRight: 14,
          whiteSpace: "nowrap",
        },
        contained: {
          boxShadow: "0 1px 2px rgba(24, 36, 48, 0.14)",
          "&:hover": {
            boxShadow: "0 8px 18px rgba(24, 36, 48, 0.14)",
          },
        },
        containedPrimary: {
          backgroundColor: "#1f4e5f",
          "&:hover": {
            backgroundColor: "#153844",
          },
        },
        containedSecondary: {
          backgroundColor: "#b56b2a",
          "&:hover": {
            backgroundColor: "#854817",
          },
        },
        containedSuccess: {
          backgroundColor: "#2f7d5c",
          "&:hover": {
            backgroundColor: "#245f47",
          },
        },
        containedInfo: {
          backgroundColor: "#316ea8",
          "&:hover": {
            backgroundColor: "#24547f",
          },
        },
        containedError: {
          backgroundColor: "#b84444",
          "&:hover": {
            backgroundColor: "#8d3030",
          },
        },
        outlined: {
          backgroundColor: "#ffffff",
          borderColor: "#b9c8d3",
          borderWidth: 1.5,
          color: "#1f4e5f",
          "&:hover": {
            backgroundColor: "#f3f7f9",
            borderColor: "#1f4e5f",
            borderWidth: 1.5,
          },
        },
        outlinedError: {
          color: "#b84444",
          borderColor: "#d8a0a0",
          "&:hover": {
            backgroundColor: "#fff3f3",
            borderColor: "#b84444",
          },
        },
        outlinedSuccess: {
          color: "#2f7d5c",
          borderColor: "#99c4b1",
          "&:hover": {
            backgroundColor: "#f1faf6",
            borderColor: "#2f7d5c",
          },
        },
        text: {
          color: "#1f4e5f",
          "&:hover": {
            backgroundColor: "#edf4f7",
          },
        },
        sizeSmall: {
          minHeight: 34,
          paddingLeft: 10,
          paddingRight: 10,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: "1px solid #dbe1e7",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(24, 36, 48, 0.04)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#eef2f5",
          color: "#34424f",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: 0,
          textTransform: "uppercase",
        },
        root: {
          borderBottomColor: "#e4e9ee",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 700,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: "1px solid #dbe1e7",
        },
      },
    },
  },
});

export default theme;
