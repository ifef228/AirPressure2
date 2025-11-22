// Service Worker для PWA
const CACHE_NAME = 'atmospheric-calc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/logo192.png',
  '/logo512.png'
];

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

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
  // Игнорируем запросы к chrome-extension и не-http(s) протоколам
  if (!event.request.url.startsWith('http')) {
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
              // Кешируем только GET запросы
              if (event.request.method === 'GET') {
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
});
