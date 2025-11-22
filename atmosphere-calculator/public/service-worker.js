// Service Worker для PWA
const CACHE_NAME = 'atmospheric-calc-v1';

// Определяем base path (для GitHub Pages это /airPressure/)
const getBasePath = () => {
  const scope = self.registration?.scope || self.location.pathname;
  if (scope.includes('/airPressure/')) {
    return '/airPressure';
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
// Установите BACKEND_IP через сообщение от клиента или используйте значение по умолчанию
let BACKEND_IP = null;
let BACKEND_PORT = '8080';
let USE_HTTPS = false;

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к chrome-extension и не-http(s) протоколам
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Перехватываем запросы к /api для перенаправления на бэкенд по IP
  // Это нужно для GitHub Pages, которые работают по HTTPS, но бэкенд может быть на HTTP в локальной сети
  // Также обрабатываем запросы с base path /airPressure/api
  // И запросы к ifef228.github.io/api (без base path, если они случайно пошли)
  const isApiRequest = url.pathname.startsWith('/api') ||
                       url.pathname.startsWith('/airPressure/api') ||
                       (url.hostname.includes('github.io') && url.pathname.includes('/api'));

  console.log('[Service Worker] Запрос:', url.href, 'isApiRequest:', isApiRequest, 'BACKEND_IP:', BACKEND_IP);

  if (isApiRequest && BACKEND_IP) {
    const protocol = USE_HTTPS ? 'https' : 'http';
    const port = USE_HTTPS ? '8443' : BACKEND_PORT;

    // Убираем base path если есть и нормализуем путь
    let apiPath = url.pathname;

    // Убираем /airPressure если есть
    if (apiPath.startsWith('/airPressure/api')) {
      apiPath = apiPath.replace('/airPressure', '');
    } else if (apiPath.startsWith('/airPressure')) {
      apiPath = apiPath.replace('/airPressure', '');
    }

    // Если путь не начинается с /api, добавляем его
    // Это для случаев, когда запрос идет на /api напрямую
    if (!apiPath.startsWith('/api')) {
      // Если путь содержит /api, извлекаем часть после /api
      const apiIndex = apiPath.indexOf('/api');
      if (apiIndex !== -1) {
        apiPath = apiPath.substring(apiIndex);
      } else {
        // Если /api нет, добавляем его
        apiPath = '/api' + (apiPath.startsWith('/') ? '' : '/') + apiPath;
      }
    }

    const backendUrl = `${protocol}://${BACKEND_IP}:${port}${apiPath}${url.search}`;

    console.log('[Service Worker] Перенаправление API запроса:', url.pathname, '->', backendUrl);

    event.respondWith(
      fetch(backendUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
        mode: 'cors',
        credentials: 'omit' // CORS может не разрешать credentials
      })
      .then((response) => {
        // Проверяем, что ответ успешный
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
      })
      .catch((error) => {
        console.error('[Service Worker] Ошибка при запросе к бэкенду:', error);
        console.error('[Service Worker] URL:', backendUrl);

        // Возвращаем понятную ошибку
        return new Response(JSON.stringify({
          success: false,
          message: `Не удалось подключиться к бэкенду ${BACKEND_IP}:${BACKEND_PORT}. ` +
                   `Проверьте, что бэкенд запущен и доступен в локальной сети. ` +
                   `Ошибка: ${error.message}`
        }), {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          })
        });
      })
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
    BACKEND_IP = event.data.ip || null;
    BACKEND_PORT = event.data.port || '8080';
    USE_HTTPS = event.data.https || false;
    console.log('[Service Worker] Настроен бэкенд:', BACKEND_IP, BACKEND_PORT, USE_HTTPS ? 'HTTPS' : 'HTTP');
  }
});
