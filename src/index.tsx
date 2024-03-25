import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Theme } from "./theme";
import { HashRouter } from "react-router-dom";
import "./i18n";
import { CircularProgress } from "@mui/material";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Suspense
      fallback={
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      }
    >
      <HashRouter>
        <Theme>
          <App />
        </Theme>
      </HashRouter>
    </Suspense>
  </React.StrictMode>
);
