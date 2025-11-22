import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && screenGraphPlugin()],
  publicDir: "./public",
  // Всегда используем один base path
  base: "/airPressure/",
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
    host: '0.0.0.0',
    proxy: {
      '/airPressure/api': {
        target: 'http://192.168.1.13:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/airPressure\/api/, '/api')
      }
    }
  }
}));
