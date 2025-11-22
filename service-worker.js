// Service Worker для PWA
const CACHE_NAME = 'atmospheric-calc-v1';

// Определяем base path (для GitHub Pages это /AirPressure2/)
const getBasePath = () => {
  const scope = self.registration?.scope || self.location.pathname;
  if (scope.includes('/AirPressure2/')) {
    return '/AirPressure2';
  }
  return '';
};

const BASE_PATH = getBasePath();
const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/logo.svg',
  BASE_PATH + '/logo192.png',
  BASE_PATH + '/logo512.png'
].filter(url => url); // Убираем пустые строки

// Установка Service Worker и кеширование ресурсов
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Установка Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кеширование ресурсов');
        return cache.addAll(urlsToCache.map(url => {
          // Добавляем base path для GitHub Pages
          const baseUrl = self.registration.scope;
          return new Request(url, { cache: 'reload' });
        })).catch(err => {
          console.log('[Service Worker] Ошибка кеширования:', err);
          // Не прерываем установку, если некоторые ресурсы недоступны
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

// Активация Service Worker и очистка старых кешей
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Активация Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Конфигурация API для перехвата запросов (для GitHub Pages)
// Установите BACKEND_URL через сообщение от клиента или используйте значение по умолчанию
let BACKEND_URL = 'https://192.168.1.13:8080';

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к chrome-extension и не-http(s) протоколам
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Перехватываем запросы к /api для перенаправления на бэкенд
  // Это нужно для GitHub Pages, которые работают по HTTPS
  // Обрабатываем запросы с base path /AirPressure2/api и без него
  const isApiRequest = url.pathname.startsWith('/api') ||
                       url.pathname.startsWith('/AirPressure2/api') ||
                       (url.hostname.includes('github.io') && url.pathname.includes('/api'));

  console.log('[Service Worker] Запрос:', url.href, 'isApiRequest:', isApiRequest, 'BACKEND_URL:', BACKEND_URL);

  // Перехватываем API запросы и проксируем на реальный бэкенд
  if (isApiRequest && BACKEND_URL) {
    event.respondWith(
      (async () => {
        try {
          // Извлекаем путь API (убираем base path если есть)
          let apiPath = url.pathname;
          if (apiPath.startsWith('/AirPressure2/api')) {
            apiPath = apiPath.replace('/AirPressure2/api', '/api');
          } else if (apiPath.startsWith('/api')) {
            // Уже правильный путь
          } else {
            // Извлекаем /api/... из пути
            const apiIndex = apiPath.indexOf('/api');
            if (apiIndex !== -1) {
              apiPath = apiPath.substring(apiIndex);
            }
          }

          // Формируем URL для бэкенда
          const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;
          console.log('[Service Worker] Проксирование API запроса:', backendUrl);

          // Создаем новый запрос с теми же параметрами, но на другой URL
          const requestInit = {
            method: event.request.method,
            headers: new Headers(event.request.headers),
            mode: 'cors', // Разрешаем CORS
            credentials: 'omit', // Не отправляем cookies
          };

          // Копируем body только если он есть (для POST, PUT и т.д.)
          if (event.request.body !== null) {
            requestInit.body = await event.request.clone().arrayBuffer();
          }

          const response = await fetch(backendUrl, requestInit);

          // Клонируем ответ для возврата
          const responseClone = response.clone();
          return responseClone;
        } catch (error) {
          console.error('[Service Worker] Ошибка проксирования API запроса:', error);
          // Возвращаем ошибку
          return new Response(JSON.stringify({
            success: false,
            message: 'Ошибка подключения к серверу: ' + error.message
          }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем закешированный ресурс, если он есть
        if (response) {
          console.log('[Service Worker] Возврат из кеша:', event.request.url);
          return response;
        }

        // Иначе делаем сетевой запрос
        console.log('[Service Worker] Запрос из сети:', event.request.url);
        return fetch(event.request).then((response) => {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ для кеширования
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // Кешируем только GET запросы (не кешируем API запросы)
              if (event.request.method === 'GET' && !url.pathname.startsWith('/api')) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch((error) => {
          console.log('[Service Worker] Ошибка сети:', error);
          // Можно вернуть offline страницу
          return new Response('Offline - нет подключения к сети', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Настройка бэкенда для перехвата API запросов
  if (event.data && event.data.type === 'SET_BACKEND_CONFIG') {
    if (event.data.url) {
      BACKEND_URL = event.data.url;
    } else if (event.data.ip) {
      const protocol = event.data.https ? 'https' : 'http';
      const port = event.data.port || '8080';
      BACKEND_URL = `${protocol}://${event.data.ip}:${port}`;
    }
    console.log('[Service Worker] Настроен бэкенд URL:', BACKEND_URL);

    // Отправляем подтверждение обратно клиенту
    event.ports[0]?.postMessage({
      success: true,
      backendUrl: BACKEND_URL
    });
  }
});
