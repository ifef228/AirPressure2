# Настройка CORS для работы с бэкендом

## Обзор

CORS (Cross-Origin Resource Sharing) настроен на бэкенде (Spring Boot) для разрешения запросов из разных источников (origin).

## Конфигурация на бэкенде

Файл: `gas/src/main/kotlin/ru/mstu/yandex/gas/config/CorsConfig.kt`

### Основные настройки:

1. **allowCredentials = false**
   - Отключено для упрощения CORS
   - Позволяет использовать `addAllowedOriginPattern("*")` для разрешения всех origin'ов
   - В production можно включить и указать конкретные origin'ы

2. **addAllowedOriginPattern("*")**
   - Разрешает запросы с любых доменов
   - Подходит для разработки
   - В production рекомендуется указать конкретные домены:
     ```kotlin
     config.addAllowedOrigin("http://localhost:5173") // Локальная разработка
     config.addAllowedOrigin("https://ifef228.github.io") // GitHub Pages
     config.addAllowedOrigin("tauri://localhost") // Tauri приложение
     ```

3. **addAllowedHeader("*")** и **addAllowedMethod("*")**
   - Разрешает все HTTP заголовки и методы
   - Явно разрешены важные заголовки:
     - `Authorization` - для JWT токенов
     - `Content-Type` - для JSON запросов
     - `Accept` - для указания типа ответа
     - `X-Requested-With` - для AJAX запросов

4. **addExposedHeader(...)**
   - Заголовки, которые будут доступны клиенту в ответе
   - Включает `Authorization`, `Content-Type`, `Access-Control-Allow-Origin`

5. **maxAge = 3600L**
   - Время кеширования preflight запросов (1 час)
   - Уменьшает количество OPTIONS запросов

## Как это работает

### 1. Preflight запрос (OPTIONS)

Когда браузер отправляет CORS запрос, он сначала отправляет OPTIONS запрос для проверки разрешений:

```
OPTIONS /api/gases HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: GET
Access-Control-Request-Headers: Authorization, Content-Type
```

Бэкенд отвечает:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3600
```

### 2. Основной запрос

После успешного preflight, браузер отправляет основной запрос:

```
GET /api/gases HTTP/1.1
Origin: http://localhost:5173
Authorization: Bearer <token>
```

Бэкенд отвечает с заголовками CORS:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json
...
```

## Настройка для разных окружений

### Локальная разработка (npm run dev)

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- CORS: Разрешен для `localhost:5173` (через `*`)

### Tauri приложение

- Frontend: Tauri окно (нет origin в традиционном смысле)
- Backend: `http://localhost:8080`
- CORS: Разрешен через `*` (в production нужно добавить `tauri://localhost`)

**Важно**: В Tauri приложении используется полный URL к бэкенду (`http://localhost:8080/api`), так как нет прокси Vite.

### GitHub Pages

- Frontend: `https://ifef228.github.io/AirPressure2/`
- Backend: Настраиваемый URL (через переменную окружения или localStorage)
- CORS: Разрешен через `*` (в production нужно указать конкретный домен)

**Настройка URL бэкенда для GitHub Pages:**

1. Через переменную окружения при сборке:
   ```bash
   VITE_API_BASE_URL=http://your-backend-ip:8080 npm run build:web
   ```

2. Через localStorage в браузере:
   ```javascript
   localStorage.setItem('backend_url', 'http://your-backend-ip:8080');
   location.reload();
   ```

## Проверка CORS

### В браузере (DevTools → Network)

1. Откройте вкладку Network
2. Найдите запрос к API
3. Проверьте заголовки запроса и ответа:
   - Запрос должен содержать `Origin`
   - Ответ должен содержать `Access-Control-Allow-Origin`

### Типичные ошибки CORS

1. **"Access to fetch at '...' from origin '...' has been blocked by CORS policy"**
   - Проверьте, что бэкенд запущен
   - Проверьте настройки CORS в `CorsConfig.kt`
   - Убедитесь, что origin разрешен

2. **"No 'Access-Control-Allow-Origin' header is present"**
   - Бэкенд не отправляет CORS заголовки
   - Проверьте, что `CorsFilter` зарегистрирован

3. **"Credentials flag is true, but 'Access-Control-Allow-Credentials' is not 'true'"**
   - Если используете `withCredentials: true`, нужно включить `allowCredentials = true` в CORS
   - И указать конкретные origin'ы (не `*`)

## Рекомендации для production

1. Указать конкретные origin'ы вместо `*`:
   ```kotlin
   config.addAllowedOrigin("https://ifef228.github.io")
   config.addAllowedOrigin("tauri://localhost")
   ```

2. Включить `allowCredentials = true` если нужны cookies:
   ```kotlin
   config.allowCredentials = true
   // И указать конкретные origin'ы
   ```

3. Ограничить разрешенные методы и заголовки:
   ```kotlin
   config.addAllowedMethod("GET")
   config.addAllowedMethod("POST")
   config.addAllowedHeader("Authorization")
   config.addAllowedHeader("Content-Type")
   ```

4. Использовать HTTPS для production
