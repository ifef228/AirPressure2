/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

// Подключаем Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Подключаем кастомную тему Яндекс Маркет
import './styles/yandex-theme.css';
// Подключаем адаптивные стили
import './styles/adaptive.css';
// Подключаем стили карточек газов
import './styles/gas-card.css';

// Обработка редиректа с 404.html для GitHub Pages
// Если путь был сохранен в sessionStorage, восстанавливаем его
// Только для веб-версии (не для Tauri)
if (!(window as any).__TAURI__) {
  const redirectPath = sessionStorage.getItem('redirectPath');
  if (redirectPath) {
    sessionStorage.removeItem('redirectPath');
    // Используем history API для установки пути
    const basename = '/AirPressure2';
    const fullPath = basename + redirectPath + window.location.search + window.location.hash;
    if (window.location.pathname !== basename + redirectPath) {
      window.history.replaceState(null, '', fullPath);
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Регистрация Service Worker для PWA (только в production)
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/AirPressure2/service-worker.js', { scope: '/AirPressure2/' })
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope);

        // Настраиваем URL бэкенда для Service Worker
        // Автоматически определяем локальный IP или используем значение из localStorage
        const getBackendUrl = async (): Promise<string> => {
          // Проверяем localStorage для сохраненного IP
          const savedBackendUrl = localStorage.getItem('backend_url');
          if (savedBackendUrl) {
            console.log('[Backend Config] Используем сохраненный URL:', savedBackendUrl);
            return savedBackendUrl;
          }

          const hostname = window.location.hostname;

          // Если это GitHub Pages, пытаемся определить локальный IP
          if (hostname.includes('github.io')) {
            // Пытаемся определить локальный IP через WebRTC
            try {
              const localIp = await detectLocalIP();
              if (localIp) {
                const backendUrl = `http://${localIp}:8080`;
                console.log('[Backend Config] Автоматически определен IP:', backendUrl);
                // Сохраняем для будущего использования
                localStorage.setItem('backend_url', backendUrl);
                return backendUrl;
              }
            } catch (error) {
              console.warn('[Backend Config] Не удалось определить IP автоматически:', error);
            }

            // Используем значение по умолчанию
            const defaultIp = '192.168.1.13'; // Замените на ваш локальный IP
            const backendUrl = `http://${defaultIp}:8080`;
            console.log('[Backend Config] Используем IP по умолчанию:', backendUrl);
            console.log('[Backend Config] Для изменения IP выполните в консоли:');
            console.log('  localStorage.setItem("backend_url", "http://YOUR_IP:8080");');
            console.log('  location.reload();');
            return backendUrl;
          }

          // Для localhost используем localhost
          return 'http://localhost:8080';
        };

        // Функция для определения локального IP через WebRTC
        const detectLocalIP = (): Promise<string | null> => {
          return new Promise((resolve) => {
            const RTCPeerConnection = window.RTCPeerConnection ||
              (window as any).webkitRTCPeerConnection ||
              (window as any).mozRTCPeerConnection;

            if (!RTCPeerConnection) {
              resolve(null);
              return;
            }

            const pc = new RTCPeerConnection({
              iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            const ips: string[] = [];
            pc.createDataChannel('');

            pc.onicecandidate = (event) => {
              if (event.candidate) {
                const candidate = event.candidate.candidate;
                const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
                if (match) {
                  const ip = match[1];
                  // Фильтруем только локальные IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
                  if (ip.startsWith('192.168.') ||
                      ip.startsWith('10.') ||
                      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) {
                    if (!ips.includes(ip)) {
                      ips.push(ip);
                      console.log('[Backend Config] Найден локальный IP:', ip);
                    }
                  }
                }
              } else {
                // Все кандидаты получены
                pc.close();
                resolve(ips.length > 0 ? ips[0] : null);
              }
            };

            pc.createOffer()
              .then(offer => pc.setLocalDescription(offer))
              .catch(() => resolve(null));

            // Таймаут на случай, если WebRTC не сработает
            setTimeout(() => {
              pc.close();
              resolve(ips.length > 0 ? ips[0] : null);
            }, 3000);
          });
        };

        // Получаем URL бэкенда асинхронно
        getBackendUrl().then(backendUrl => {
          // Функция для отправки конфигурации
          const sendBackendConfig = (sw: ServiceWorker | null) => {
            if (sw) {
              console.log('Отправка конфигурации бэкенда в Service Worker:', backendUrl);
              sw.postMessage({
                type: 'SET_BACKEND_CONFIG',
                url: backendUrl
              });
            }
          };

          // Отправляем конфигурацию бэкенда в Service Worker
          if (registration.active) {
            sendBackendConfig(registration.active);
          } else if (registration.installing) {
            registration.installing.addEventListener('statechange', () => {
              if (registration.active) {
                sendBackendConfig(registration.active);
              }
            });
          } else if (registration.waiting) {
            sendBackendConfig(registration.waiting);
          }

          // Также отправляем конфигурацию при активации Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated' && registration.active) {
                  sendBackendConfig(registration.active);
                }
              });
            }
          });

          // Периодически проверяем и отправляем конфигурацию (на случай, если Service Worker перезапустился)
          setInterval(() => {
            if (registration.active) {
              sendBackendConfig(registration.active);
            }
          }, 5000); // Каждые 5 секунд

          // Отправляем конфигурацию при получении контроля над страницей
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (navigator.serviceWorker.controller) {
              sendBackendConfig(navigator.serviceWorker.controller);
            }
          });
        }).catch((error) => {
          console.error('[Backend Config] Ошибка при получении URL бэкенда:', error);
        });
      })
      .catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
    });
  } else {
    // В development режиме отключаем Service Worker, если он был зарегистрирован
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('Service Worker отключен в development режиме');
          });
        });
      });
    });
  }
}
