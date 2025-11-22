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
      .register('/airPressure/service-worker.js', { scope: '/airPressure/' })
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope);

        // Настройка бэкенда для Service Worker
        const setupBackend = (worker: ServiceWorker | null) => {
          if (!worker) return;
          worker.postMessage({
            type: 'SET_BACKEND_CONFIG',
            ip: '192.168.1.13',
            port: '8080',
            https: false
          });
        };

        if (registration.active) {
          setupBackend(registration.active);
        }
      })
      .catch((error) => {
        console.log('Ошибка регистрации Service Worker:', error);
      });
  });
}
