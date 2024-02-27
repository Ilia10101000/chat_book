import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { PaletteMode } from "@mui/material";

interface ThemeProps {
  children: ReactNode;
}

type ModeTypeToggle = [PaletteMode, () => void];

const ModeToogleContext = createContext<ModeTypeToggle>(null);

function Theme({ children }: ThemeProps) {
  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem("theme") as PaletteMode) || "light"
  );

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
      },
      components: {
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              position: "absolute",
              top: "55px",
            },
          },
        },
        MuiStack: {
          defaultProps: {
            useFlexGap: true,
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#000000",
                width: "1px",
                height:"3px"
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                backgroundColor: "#6b6b6b",
              },
              "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                {
                  backgroundColor: "#737573",
                },
            },
          },
        },
      },
    });
  }, [mode]);

  const toogleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextMode);
      return nextMode;
    });
  };
  return (
    <ModeToogleContext.Provider value={[mode, toogleThemeMode]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          disableGutters={true}
          maxWidth={false}
          sx={{
            minWidth: "360px",
            minHeight: "100vh",
            background: (theme) =>
              theme.palette.mode === "light"
                ? "linear-gradient(45deg, rgba(136,0,255,1) 0%, rgba(53,46,232,1) 23%, rgba(68,212,236,1) 56%, rgba(0,255,76,1) 100%)"
                : "linear-gradient(45deg, rgba(0,0,4,1) 0%, rgba(13,0,87,1) 31%, rgba(49,0,108,1) 61%, rgba(135,5,5,1) 100%)",
          }}
        >
          {children}
        </Container>
      </ThemeProvider>
    </ModeToogleContext.Provider>
  );
}

function useTheme() {
  return useContext(ModeToogleContext);
}

export { Theme, useTheme };