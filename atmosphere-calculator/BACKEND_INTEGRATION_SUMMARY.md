# Сводка: Интеграция с бэкендом для всех окружений

## Что было исправлено

### 1. ✅ Tauri приложение

**Проблема**: Tauri использовал относительный путь `/api`, который не работал (нет прокси Vite)

**Решение**:
- Создан файл `src/lib/apiConfig.ts` для централизованной конфигурации API
- Для Tauri используется полный URL: `http://localhost:8080/api`
- Можно настроить через переменную окружения `VITE_API_BASE_URL`

**Использование**:
```bash
# Dev режим
npm run tauri

# Build с default бэкендом
npm run tauri:build

# Build с кастомным бэкендом
VITE_API_BASE_URL=http://192.168.1.100:8080 npm run tauri:build
```

### 2. ✅ GitHub Pages

**Проблема**: GitHub Pages не может проксировать запросы к бэкенду

**Решение**:
- Поддержка переменной окружения `VITE_API_BASE_URL` при сборке
- Fallback на localStorage для ручной настройки
- Документация по настройке

**Использование**:
```bash
# Сборка с указанием URL бэкенда
VITE_API_BASE_URL=http://your-backend-ip:8080 npm run build:web

# Деплой
npm run deploy
```

### 3. ✅ Локальная разработка

**Работает как раньше**:
- Использует прокси Vite (`/api` → `http://localhost:8080/api`)
- Не требует изменений

## Структура конфигурации

### Файлы

1. **`src/lib/apiConfig.ts`** - Централизованная конфигурация API URL
2. **`src/api/index.ts`** - Использует `API_BASE_URL` из `apiConfig.ts`
3. **`src/services/api.ts`** - Использует `API_BASE_URL` из `apiConfig.ts`

### Логика определения URL

```
Tauri?
  ├─ Да → http://localhost:8080/api (или VITE_API_BASE_URL/api)
  └─ Нет
      ├─ localhost? → /api (через прокси Vite)
      └─ GitHub Pages → VITE_API_BASE_URL/api или localStorage или /AirPressure2/api
```

## CORS настройка

### На бэкенде (Spring Boot)

Файл: `gas/src/main/kotlin/ru/mstu/yandex/gas/config/CorsConfig.kt`

**Текущая конфигурация**:
- `allowCredentials = false`
- `addAllowedOriginPattern("*")` - разрешает все origin'ы
- `addAllowedHeader("*")` и `addAllowedMethod("*")`
- `maxAge = 3600L` - кеширование preflight запросов

**Как это работает**:
1. Браузер отправляет OPTIONS запрос (preflight)
2. Бэкенд отвечает с CORS заголовками
3. Браузер отправляет основной запрос
4. Бэкенд отвечает с данными и CORS заголовками

**Для production** рекомендуется:
- Указать конкретные origin'ы вместо `*`
- Включить `allowCredentials = true` если нужны cookies
- Ограничить методы и заголовки

Подробнее: `CORS_CONFIGURATION.md`

## Команды

### Разработка

```bash
# Локальная разработка (браузер)
npm run dev

# Tauri dev режим
npm run tauri
```

### Сборка

```bash
# Tauri
npm run tauri:build

# GitHub Pages
npm run build:web

# GitHub Pages с кастомным бэкендом
VITE_API_BASE_URL=http://your-backend-ip:8080 npm run build:web
```

### Деплой

```bash
# GitHub Pages
npm run deploy
```

## Документация

1. **`CORS_CONFIGURATION.md`** - Детальная информация о настройке CORS
2. **`BUILD_CONFIGURATION.md`** - Инструкции по сборке для всех окружений
3. **`TAURI_BACKEND_SETUP.md`** - Специфичная информация для Tauri

## Проверка работы

### Tauri

1. Запустите: `npm run tauri`
2. Откройте консоль (DevTools)
3. Проверьте логи: `[API Config] Environment: { isTauri: true, apiBaseUrl: "http://localhost:8080/api" }`
4. Выполните действие, которое делает API запрос
5. Проверьте, что запрос успешен

### GitHub Pages

1. Соберите: `VITE_API_BASE_URL=http://your-backend-ip:8080 npm run build:web`
2. Задеплойте: `npm run deploy`
3. Откройте сайт в браузере
4. Откройте консоль (F12)
5. Проверьте логи: `[API Config] Environment: { apiBaseUrl: "http://your-backend-ip:8080/api" }`
6. Выполните действие, которое делает API запрос
7. Проверьте, что запрос успешен

### Локальная разработка

1. Запустите: `npm run dev`
2. Откройте `http://localhost:5173`
3. Проверьте, что все работает как раньше

## Важные замечания

1. **Tauri требует полный URL** к бэкенду (не относительный путь)
2. **GitHub Pages не может проксировать** запросы, нужен доступный из интернета бэкенд
3. **CORS должен быть настроен** на бэкенде для всех origin'ов, с которых делаются запросы
4. **Бэкенд должен быть доступен** из сети, где запущено приложение (не только localhost для Tauri/GitHub Pages)
