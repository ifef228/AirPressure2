# 🌐 Настройка ngrok для доступа к бэкенду через GitHub Pages

## Проблема

GitHub Pages работает по HTTPS, а бэкенд на локальной сети по HTTP. Браузер блокирует mixed content (HTTPS → HTTP).

## Решение: ngrok

ngrok создает HTTPS туннель к вашему локальному бэкенду.

## 📋 Шаги

### 1. Установите ngrok

**Mac:**
```bash
brew install ngrok
```

**Или скачайте с:** https://ngrok.com/download

### 2. Зарегистрируйтесь на ngrok.com

1. Перейдите на https://ngrok.com
2. Зарегистрируйтесь (бесплатно)
3. Получите authtoken

### 3. Настройте ngrok

```bash
ngrok config add-authtoken ваш-token
```

### 4. Запустите туннель к бэкенду

```bash
ngrok http 8080
```

Вы получите URL типа:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8080
```

### 5. Обновите API_BASE_URL

Откройте `src/services/api.ts` и обновите:

```typescript
const API_BASE_URL = 'https://abc123.ngrok-free.app/api';
```

Замените `abc123.ngrok-free.app` на ваш ngrok URL.

### 6. Обновите CORS на бэкенде

Откройте `gas/src/main/kotlin/ru/mstu/yandex/gas/config/CorsConfig.kt` и добавьте:

```kotlin
config.addAllowedOrigin("https://abc123.ngrok-free.app")
config.addAllowedOrigin("https://ifef228.github.io")
```

### 7. Пересоберите и задеплойте

```bash
npm run build
npm run deploy
```

## ⚠️ Важно

- ngrok бесплатный план дает случайный URL при каждом запуске
- Для постоянного URL нужен платный план или можно использовать другой сервис
- Туннель должен быть запущен, пока используется сайт

## 🔄 Альтернатива: Использовать только в локальной сети

Если не нужен доступ через интернет, просто используйте приложение в локальной сети без GitHub Pages.
