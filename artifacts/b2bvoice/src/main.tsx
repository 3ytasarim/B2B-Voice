import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { loaderForPath } from "./routeLoaders";
import "./index.css";

const container = document.getElementById("root")!;
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const path = window.location.pathname.slice(base.length) || "/";

async function start() {
  // Load the current route's chunk first so React can hydrate the
  // prerendered HTML instead of falling back to a client-side render.
  await loaderForPath(path)?.();
  if (container.hasChildNodes() && container.dataset.prerendered === "true") {
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }
}

void start();
