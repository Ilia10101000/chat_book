import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { Theme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <Theme>
        <App />
      </Theme>
    </BrowserRouter>
  </React.StrictMode>
);
