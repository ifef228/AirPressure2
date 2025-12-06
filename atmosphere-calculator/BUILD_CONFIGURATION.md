# Инструкция по сборке и настройке для разных окружений

## 1. Tauri приложение

### Разработка (dev режим)

```bash
npm run tauri
# или
npm run tauri:dev
```

Это запустит:
- Vite dev-сервер с `VITE_TAURI=true`
- Tauri приложение, подключенное к dev-серверу
- API URL: `http://localhost:8080/api` (полный URL, так как нет прокси Vite)

**Важно**: Убедитесь, что бэкенд запущен на `http://localhost:8080`

### Сборка (build)

```bash
npm run tauri:build
# или
npm run build:tauri
```

Это:
1. Соберет фронтенд с `VITE_TAURI=true`
2. Соберет Tauri приложение
3. Создаст исполняемый файл в `src-tauri/target/release/`

**Настройка URL бэкенда для production:**

Если бэкенд работает не на `localhost:8080`, установите переменную окружения:

```bash
VITE_API_BASE_URL=http://your-backend-ip:8080 npm run tauri:build
```

Или создайте файл `.env` в корне проекта:

```
VITE_API_BASE_URL=http://your-backend-ip:8080
```

### Структура конфигурации Tauri

Файл: `src-tauri/tauri.conf.json`

- `beforeDevCommand`: `npm run dev:tauri` - команда для запуска dev-сервера
- `beforeBuildCommand`: `npm run build:tauri:only` - команда для сборки фронтенда
- `devUrl`: `http://localhost:5173` - URL dev-сервера
- `frontendDist`: `../dist` - папка со собранным фронтендом

## 2. GitHub Pages

### Сборка для GitHub Pages

```bash
npm run build:web
```

Это:
1. Соберет фронтенд с base path `/AirPressure2/`
2. Скопирует `404.html` для поддержки SPA роутинга
3. Создаст папку `dist/` с готовым к деплою кодом

### Настройка URL бэкенда для GitHub Pages

GitHub Pages не может проксировать запросы к бэкенду, поэтому нужно настроить URL бэкенда вручную.

#### Вариант 1: Через переменную окружения при сборке

```bash
VITE_API_BASE_URL=http://your-backend-ip:8080 npm run build:web
```

#### Вариант 2: Через localStorage в браузере

После загрузки страницы выполните в консоли браузера:

```javascript
localStorage.setItem('backend_url', 'http://your-backend-ip:8080');
location.reload();
```

#### Вариант 3: Через файл конфигурации

Создайте файл `.env.production` в корне проекта:

```
VITE_API_BASE_URL=http://your-backend-ip:8080
```

Затем соберите:

```bash
npm run build:web
```

### Деплой на GitHub Pages

```bash
npm run deploy
```

Это:
1. Соберет проект (`npm run build:web`)
2. Задеплоит папку `dist/` на GitHub Pages

**Важно**:
- Убедитесь, что бэкенд доступен из интернета (не только localhost)
- Настройте CORS на бэкенде для разрешения запросов с `https://ifef228.github.io`
- Используйте HTTPS для бэкенда в production

## 3. Локальная разработка (браузер)

### Запуск dev-сервера

```bash
npm run dev
```

Это:
- Запустит Vite dev-сервер на `http://localhost:5173`
- API запросы будут проксироваться через Vite к `http://localhost:8080/api`
- Base path: `/`

**Важно**: Убедитесь, что бэкенд запущен на `http://localhost:8080`

## 4. Переменные окружения

### Доступные переменные

- `VITE_TAURI` - флаг для определения Tauri режима (устанавливается автоматически)
- `VITE_API_BASE_URL` - базовый URL бэкенда (без `/api`)

### Примеры использования

#### Для Tauri с кастомным бэкендом:

```bash
VITE_API_BASE_URL=http://192.168.1.100:8080 npm run tauri:build
```

#### Для GitHub Pages:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build:web
```

#### Для локальной разработки:

Обычно не требуется, так как используется прокси Vite.

## 5. Проверка конфигурации

### Проверка API URL в консоли браузера

Откройте консоль браузера (F12) и проверьте логи:

```
[API Config] Environment: {
  isTauri: false,
  isLocalhost: true,
  hostname: "localhost",
  apiBaseUrl: "/api",
  ...
}
```

### Проверка работы API

1. Откройте DevTools → Network
2. Выполните действие, которое делает API запрос
3. Проверьте:
   - URL запроса правильный
   - Запрос успешен (статус 200)
   - CORS заголовки присутствуют в ответе

## 6. Устранение проблем

### Tauri не подключается к бэкенду

1. Проверьте, что бэкенд запущен: `curl http://localhost:8080/api/health`
2. Проверьте URL в консоли: должно быть `http://localhost:8080/api`
3. Проверьте CORS настройки на бэкенде

### GitHub Pages не работает с бэкендом

1. Убедитесь, что бэкенд доступен из интернета (не localhost)
2. Проверьте CORS настройки для `https://ifef228.github.io`
3. Установите `VITE_API_BASE_URL` при сборке
4. Проверьте логи в консоли браузера

### CORS ошибки

См. `CORS_CONFIGURATION.md` для детальной информации.
