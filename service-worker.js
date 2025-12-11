// Service Worker для PWA
const CACHE_NAME = 'atmospheric-calc-v1';

// Определяем base path (для GitHub Pages это /AirPressure2Front/)
const getBasePath = () => {
  const scope = self.registration?.scope || self.location.pathname;
  if (scope.includes('/AirPressure2Front/')) {
    return '/AirPressure2Front';
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
  console.log('[Service Worker] Активация Service Worker, BACKEND_URL:', BACKEND_URL);
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
// Используем HTTPS прокси по умолчанию
let BACKEND_URL = 'https://192.168.1.13:8443';

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к chrome-extension и не-http(s) протоколам
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // В development режиме (localhost) не перехватываем запросы вообще
  // Service Worker нужен только для production (GitHub Pages)
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const isLocalhostBackend = url.hostname === 'localhost' && url.port === '8080';
  const isLocalhostDev = isLocalhost && (url.port === '5173' || url.port === '3000' || !url.port);

  // Пропускаем все запросы в development режиме (localhost:5173, localhost:3000 и т.д.)
  // Это позволяет использовать прокси Vite без вмешательства service worker
  if (isLocalhostDev || isLocalhostBackend) {
    console.log('[Service Worker] Пропускаем запрос в development:', url.href);
    return;
  }

  // Также пропускаем запросы к /AirPressure2Front/api на localhost:5173 (прокси Vite)
  if (isLocalhost && url.port === '5173' && url.pathname.startsWith('/AirPressure2Front/api')) {
    console.log('[Service Worker] Пропускаем запрос к прокси Vite:', url.href);
    return;
  }

  // НЕ перехватываем запросы, которые уже идут на HTTPS прокси (порт 8443) или внешние HTTPS URL
  // Эти запросы должны идти напрямую
  const isHttpsProxy = url.protocol === 'https:' && (url.port === '8443' || url.hostname !== 'ifef228.github.io');
  if (isHttpsProxy) {
    console.log('[Service Worker] Пропускаем запрос к HTTPS прокси или внешнему HTTPS:', url.href);
    return; // Пропускаем, пусть идет напрямую
  }

  // Перехватываем ТОЛЬКО относительные запросы к /api на GitHub Pages
  // НЕ перехватываем запросы к внешним HTTPS URL
  const isApiRequest = (
    url.hostname === 'ifef228.github.io' && (
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/AirPressure2Front/api')
    )
  );

  console.log('[Service Worker] Запрос:', url.href, 'isApiRequest:', isApiRequest, 'BACKEND_URL:', BACKEND_URL);

  // Перехватываем API запросы и проксируем на реальный бэкенд
  if (isApiRequest) {
    if (!BACKEND_URL) {
      console.error('[Service Worker] BACKEND_URL не настроен!');
      event.respondWith(
        new Response(JSON.stringify({
          success: false,
          message: 'Backend URL не настроен в Service Worker'
        }), {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        })
      );
      return;
    }
    event.respondWith(
      (async () => {
        try {
          // Извлекаем путь API (убираем base path если есть)
          let apiPath = url.pathname;
          if (apiPath.startsWith('/AirPressure2Front/api')) {
            apiPath = apiPath.replace('/AirPressure2Front/api', '/api');
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
          console.log('[Service Worker] Проксирование API запроса:', {
            original: url.href,
            backend: backendUrl,
            method: event.request.method,
            pathname: url.pathname,
            apiPath: apiPath
          });

          // Создаем заголовки, исключая те, которые могут вызвать проблемы
          const headers = new Headers();
          // Копируем только безопасные заголовки
          event.request.headers.forEach((value, key) => {
            // Исключаем host и другие заголовки, которые браузер устанавливает автоматически
            const lowerKey = key.toLowerCase();
            if (lowerKey !== 'host' && lowerKey !== 'referer' && lowerKey !== 'origin') {
              headers.set(key, value);
            }
          });

          // Создаем новый запрос с теми же параметрами, но на другой URL
          const requestInit = {
            method: event.request.method,
            headers: headers,
            mode: 'cors', // Разрешаем CORS
            credentials: 'omit', // Не отправляем cookies
            cache: 'no-cache', // Не кешируем API запросы
          };

          // Копируем body только для методов, которые могут иметь body (POST, PUT, PATCH)
          const methodsWithBody = ['POST', 'PUT', 'PATCH'];
          if (methodsWithBody.includes(event.request.method.toUpperCase())) {
            try {
              const clonedRequest = event.request.clone();
              requestInit.body = await clonedRequest.arrayBuffer();
            } catch (bodyError) {
              console.warn('[Service Worker] Не удалось прочитать body:', bodyError);
              // Продолжаем без body, если не удалось его прочитать
            }
          }

          console.log('[Service Worker] Отправка запроса на бэкенд:', backendUrl);
          const response = await fetch(backendUrl, requestInit);

          console.log('[Service Worker] Ответ от бэкенда:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: backendUrl
          });

          // Создаем новый Response с правильными заголовками CORS
          const responseHeaders = new Headers(response.headers);
          // Добавляем CORS заголовки, если их нет
          if (!responseHeaders.has('Access-Control-Allow-Origin')) {
            responseHeaders.set('Access-Control-Allow-Origin', '*');
          }

          // Клонируем ответ для возврата
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
          });
        } catch (error) {
          console.error('[Service Worker] Ошибка проксирования API запроса:', {
            error: error.message,
            stack: error.stack,
            url: url.href,
            backendUrl: BACKEND_URL
          });
          // Возвращаем ошибку с подробной информацией
          return new Response(JSON.stringify({
            success: false,
            message: 'Ошибка подключения к серверу: ' + error.message,
            error: error.toString(),
            backendUrl: BACKEND_URL
          }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
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
  console.log('[Service Worker] Получено сообщение:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Настройка бэкенда для перехвата API запросов
  if (event.data && event.data.type === 'SET_BACKEND_CONFIG') {
    const oldUrl = BACKEND_URL;
    let newUrl = null;

    if (event.data.url) {
      newUrl = event.data.url;
    } else if (event.data.ip) {
      const protocol = event.data.https ? 'https' : 'http';
      const port = event.data.port || '8080';
      newUrl = `${protocol}://${event.data.ip}:${port}`;
    }

    // КРИТИЧНО: ВСЕГДА исправляем на HTTPS прокси (без условий)
    if (newUrl) {
      // ВСЕГДА принудительно исправляем на HTTPS прокси
      if (!newUrl.startsWith('https://') || !newUrl.includes(':8443')) {
        console.warn('[Service Worker] 🔒 FORCING HTTPS proxy (always)');
        console.warn('[Service Worker] Original URL:', newUrl);

        // Извлекаем IP из URL
        const urlMatch = newUrl.match(/https?:\/\/([^\/:]+)(?::(\d+))?/);
        if (urlMatch) {
          const ip = urlMatch[1];
          // ВСЕГДА используем HTTPS и порт 8443
          newUrl = `https://${ip}:8443`;
          console.warn('[Service Worker] Fixed to HTTPS proxy:', newUrl);
        } else {
          // Если не удалось извлечь, просто заменяем
          newUrl = newUrl
            .replace('http://', 'https://')
            .replace(':8080', ':8443');
        }
      }
      BACKEND_URL = newUrl;
    }

    console.log('[Service Worker] Настроен бэкенд URL:', {
      old: oldUrl,
      new: BACKEND_URL,
      received: event.data
    });

    // Отправляем подтверждение обратно клиенту через все клиенты
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'BACKEND_CONFIG_SET',
          success: true,
          backendUrl: BACKEND_URL
        });
      });
    });
  }
});
