import React, {  } from "react";
import ReactDOM from "react-dom/client";
import "./assets/globals.css";

import { ThemeProvider } from "@/contexts/theme-provider"
import { RouteProvider } from "@/contexts/route-provider";
import { SettingsProvider } from "@/contexts/settings-provider";

import App from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouteProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </RouteProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
