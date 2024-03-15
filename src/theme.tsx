import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  createTheme,
  PaletteOptions,
  ThemeOptions,
  ThemeProvider,
} from "@mui/material/styles";
import {Container } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { PaletteMode } from "@mui/material";

interface ThemeProps {
  children: ReactNode;
}

interface CustomePalette extends PaletteOptions {
  customeBackground: {
    main: string;
  };
}

type ModeThemeTypeToggle = {
  mode: PaletteMode;
  toogleThemeMode: () => void;
  changeAppTheme: (theme: string) => void;
  appThemesValues: any;
  appTheme: string;
};

const ModeToogleContext = createContext<ModeThemeTypeToggle>(null);

const appThemesValues = {
  default: {
    type: "color",
    light: "#dee0dc",
    dark: "#141414",
  },
  theme1: {
    type: "image",
    light:
      "linear-gradient(45deg, rgba(136,0,255,1) 0%, rgba(53,46,232,1) 23%, rgba(68,212,236,1) 56%, rgba(0,255,76,1) 100%)",
    dark: "linear-gradient(45deg, rgba(0,0,4,1) 0%, rgba(13,0,87,1) 31%, rgba(49,0,108,1) 61%, rgba(135,5,5,1) 100%)",
  },
  theme2: {
    type: "image",
    light:
      "radial-gradient(circle, rgba(226,237,52,1) 7%, rgba(52,167,245,1) 100%)",
    dark: "radial-gradient(circle, rgba(228,24,24,1) 0%, rgba(0,0,0,1) 81%)",
  },
};

function Theme({ children }: ThemeProps) {
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("app-theme") || "default"
  );

  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem("theme") as PaletteMode) || "light"
  );

  const theme = useMemo(() => {
    return createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 550,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
      palette: {
        mode,
        customeBackground: {
          main: mode === "light" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)",
        },
      },
      components: {
        MuiBackdrop: {
          styleOverrides: {
            root: {
              backdropFilter: "brightness(0.2)",
            },
          },
        },
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
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundImage: "none",
              background:'inherit'
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#000000",
                width: "1px",
                height: "3px",
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
    } as ThemeOptions & { palette: CustomePalette });
  }, [mode]);

  const toogleThemeMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextMode);
      return nextMode;
    });
  };
  const changeAppTheme = (theme: string) => {
    localStorage.setItem("app-theme", theme);
    setAppTheme(theme);
  };
  return (
    <ModeToogleContext.Provider
      value={{
        mode,
        toogleThemeMode,
        changeAppTheme,
        appThemesValues,
        appTheme,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          disableGutters={true}
          maxWidth={false}
          sx={{
            overflow: "hidden",
            minWidth: "360px",
            width: "100vw",
            height: "100vh",
            background: appThemesValues[appTheme][mode],
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
