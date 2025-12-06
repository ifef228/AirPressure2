import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Определяем base path в зависимости от окружения
  // Для Tauri используем '/', для веб - '/AirPressure2/'
  // Tauri устанавливает переменную TAURI_FAMILY или можно использовать VITE_TAURI
  const isTauri = process.env.TAURI_FAMILY !== undefined ||
                  process.env.VITE_TAURI === 'true' ||
                  process.env.TAURI_PLATFORM !== undefined ||
                  mode === 'tauri';
  const base = isTauri ? '/' : '/AirPressure2/';

  console.log('[Vite Config] Mode:', mode);
  console.log('[Vite Config] TAURI_FAMILY:', process.env.TAURI_FAMILY);
  console.log('[Vite Config] VITE_TAURI:', process.env.VITE_TAURI);
  console.log('[Vite Config] TAURI_PLATFORM:', process.env.TAURI_PLATFORM);
  console.log('[Vite Config] Tauri mode:', isTauri, 'Base:', base);

  return {
    plugins: [react(), mode === "development" && screenGraphPlugin()],
    publicDir: "./public",
    // Base path зависит от окружения
    base: base,
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
        '/AirPressure2/api': {
          target: 'http://localhost:8080', // Бэкенд работает по HTTP (при запуске с профилем dev)
          changeOrigin: true,
          secure: false, // Отключаем проверку SSL (не используется для HTTP)
          rewrite: (path) => {
            const newPath = path.replace(/^\/AirPressure2\/api/, '/api');
            console.log('[Vite Proxy] Rewrite:', path, '->', newPath);
            return newPath;
          },
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, res) => {
              console.error('[Vite Proxy] Error:', err.message);
              console.error('[Vite Proxy] Request URL:', req.url);
              if (res && !res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                res.end('Proxy error: ' + err.message);
              }
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('[Vite Proxy] Sending Request:', {
                method: req.method,
                originalUrl: req.url,
                proxyUrl: proxyReq.path,
                target: _options.target,
              });
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('[Vite Proxy] Received Response:', {
                status: proxyRes.statusCode,
                statusText: proxyRes.statusMessage,
                url: req.url,
              });
            });
          },
        }
      }
    }
  };
});
