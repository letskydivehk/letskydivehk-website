import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auto-recover from stale chunk errors after a new deploy.
const RELOAD_KEY = "chunk-reload-attempt";
const isChunkLoadError = (msg: unknown) =>
  typeof msg === "string" &&
  (msg.includes("Importing a module script failed") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("error loading dynamically imported module"));

const tryReloadOnce = () => {
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  sessionStorage.setItem(RELOAD_KEY, "1");
  window.location.reload();
};

window.addEventListener("error", (e) => {
  if (isChunkLoadError(e.message)) tryReloadOnce();
});
window.addEventListener("unhandledrejection", (e) => {
  const reason = e.reason as { message?: string } | string | undefined;
  const msg = typeof reason === "string" ? reason : reason?.message;
  if (isChunkLoadError(msg)) tryReloadOnce();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
