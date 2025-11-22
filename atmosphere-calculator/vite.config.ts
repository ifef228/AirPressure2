import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && screenGraphPlugin()],
  publicDir: "./public",
  // Для GitHub Pages используем название репозитория как base
  base: mode === "production" ? "/airPressure/" : "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Копируем service worker в корень dist
    rollupOptions: {
      input: {
        main: "./index.html",
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}));
