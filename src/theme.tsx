import React, { ReactNode, createContext, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, Container, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { PaletteMode } from "@mui/material";

interface ThemeProps {
  children: ReactNode;
}

type ModeTypeToggle = [PaletteMode, () => void];

export const ModeToogleContext = createContext<ModeTypeToggle>(null);

function Theme({ children }: ThemeProps) {
  const [mode, setMode] = React.useState<PaletteMode>(
    localStorage.getItem("theme") as PaletteMode || "light"
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
            useFlexGap:true
          }
        }
      },
    });
  }, [mode]);

  const toogleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem('theme', nextMode);
      return nextMode
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
            minHeight: "100vh",
            zIndex: -1,
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

export { Theme };
