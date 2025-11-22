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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/AirPressure2/service-worker.js', { scope: '/AirPressure2/' })
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope);

        // Настраиваем URL бэкенда для Service Worker
        // Можно изменить этот URL на ваш реальный бэкенд
        const backendUrl = 'https://192.168.1.13:8080';

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
      })
      .catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
  });
}
