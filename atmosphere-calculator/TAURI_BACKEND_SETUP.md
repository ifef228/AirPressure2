# Настройка Tauri с бэкендом

## Быстрый старт

### 1. Разработка (dev режим)

```bash
# Убедитесь, что бэкенд запущен на http://localhost:8080
npm run tauri
```

Tauri автоматически:
- Запустит Vite dev-сервер
- Откроет Tauri окно
- Подключится к бэкенду по адресу `http://localhost:8080/api`

### 2. Сборка (build)

```bash
# Стандартная сборка (бэкенд на localhost:8080)
npm run tauri:build

# Сборка с кастомным URL бэкенда
VITE_API_BASE_URL=http://192.168.1.100:8080 npm run tauri:build
```

## Как это работает

### Определение окружения

Приложение автоматически определяет, что оно запущено в Tauri, проверяя наличие `window.__TAURI__`.

### API URL для Tauri

В Tauri приложении используется **полный URL** к бэкенду:
- По умолчанию: `http://localhost:8080/api`
- Можно настроить через переменную окружения: `VITE_API_BASE_URL`

**Почему полный URL?**
- Tauri приложение работает не в браузере
- Нет прокси Vite (как в dev-режиме браузера)
- Нужен прямой доступ к бэкенду

### Конфигурация

Файл: `src/lib/apiConfig.ts`

```typescript
if (isTauri) {
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${backendUrl}/api`;
}
```

## Настройка для разных сценариев

### Локальный бэкенд (localhost)

```bash
# Бэкенд на localhost:8080
npm run tauri:build
```

### Удаленный бэкенд (сеть)

```bash
# Бэкенд на другом компьютере в сети
VITE_API_BASE_URL=http://192.168.1.100:8080 npm run tauri:build
```

### Production бэкенд (интернет)

```bash
# Бэкенд на сервере
VITE_API_BASE_URL=https://api.example.com npm run tauri:build
```

## Проверка работы

1. Запустите Tauri приложение
2. Откройте консоль (DevTools включены по умолчанию в dev режиме)
3. Проверьте логи:
   ```
   [API Config] Environment: {
     isTauri: true,
     apiBaseUrl: "http://localhost:8080/api",
     ...
   }
   ```
4. Выполните действие, которое делает API запрос
5. Проверьте Network вкладку (если доступна) или логи в консоли

## Устранение проблем

### Бэкенд не доступен

**Ошибка**: `Failed to fetch` или `Network error`

**Решение**:
1. Убедитесь, что бэкенд запущен
2. Проверьте URL: `curl http://localhost:8080/api/health`
3. Проверьте настройки CORS на бэкенде

### CORS ошибки

**Ошибка**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Решение**:
1. Проверьте настройки CORS в `CorsConfig.kt`
2. Убедитесь, что `addAllowedOriginPattern("*")` включен
3. См. `CORS_CONFIGURATION.md` для деталей

### Неправильный URL бэкенда

**Проблема**: Приложение подключается не к тому бэкенду

**Решение**:
1. Проверьте переменную окружения `VITE_API_BASE_URL`
2. Пересоберите приложение с правильным URL
3. Проверьте логи в консоли для подтверждения URL

## Примеры использования

### Разработка с локальным бэкендом

```bash
# Терминал 1: Запустить бэкенд
cd gas
./gradlew bootRun

# Терминал 2: Запустить Tauri
cd atmosphere-calculator
npm run tauri
```

### Сборка для распространения

```bash
# Собрать с production бэкендом
VITE_API_BASE_URL=https://api.production.com npm run tauri:build

# Результат: src-tauri/target/release/AtmosphericCalc.app (macOS)
```

### Тестирование с разными бэкендами

```bash
# Тест с staging
VITE_API_BASE_URL=http://staging.example.com:8080 npm run tauri:build

# Тест с production
VITE_API_BASE_URL=https://api.example.com npm run tauri:build
```
