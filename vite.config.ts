import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { localCms } from "./vite-plugin-local-cms";

// Custom domain (banderas.jcampos.dev via CNAME) serves from root, so base is
// "/". Override with BASE_PATH for a project-page deploy (e.g. "/cb-pages/").
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react(), localCms()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5000,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
