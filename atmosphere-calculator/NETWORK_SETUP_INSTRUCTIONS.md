# 🌐 Инструкция по настройке подключения к бэкенду по IP локальной сети

## 📋 Содержание

1. [Настройка Tauri для работы с бэкендом по IP](#1-настройка-tauri-для-работы-с-бэкендом-по-ip)
2. [Сравнение IP сервера из консоли и в коде](#2-сравнение-ip-сервера-из-консоли-и-в-коде)
3. [Демонстрация изменения данных в БД](#3-демонстрация-изменения-данных-в-бд)
4. [Настройка HTTPS](#4-настройка-https)
5. [Настройка GitHub Pages для работы с бэкендом по IP](#5-настройка-github-pages-для-работы-с-бэкендом-по-ip)

---

## 1. Настройка Tauri для работы с бэкендом по IP

### Шаг 1: Узнайте IP адрес вашего компьютера

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Или более точно:
```bash
ipconfig getifaddr en0  # Wi-Fi
ipconfig getifaddr en1  # Ethernet
```

**Linux:**
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig
```
Ищите IPv4 адрес, например: `192.168.1.10`

### Шаг 2: Обновите конфигурацию Tauri

Файл `src-tauri/tauri.conf.json` уже настроен для работы с IP адресами:
```json
"http": {
  "all": true,
  "request": true,
  "scope": [
    "http://localhost:8080/**",
    "http://192.168.*:8080/**"
  ]
}
```

### Шаг 3: Настройте API endpoint в коде

В файле `src/services/api.ts` используется переменная окружения `VITE_API_BASE_URL`.

**Для Tauri (desktop приложение):**

Создайте файл `.env.local` в корне `atmosphere-calculator/`:
```bash
# .env.local
VITE_API_BASE_URL=http://192.168.1.10:8080/api
```

**Важно:** Замените `192.168.1.10` на ваш реальный IP адрес!

### Шаг 4: Обновите CORS на бэкенде

Откройте `gas/src/main/kotlin/ru/mstu/yandex/gas/config/CorsConfig.kt` и добавьте ваш IP:

```kotlin
config.addAllowedOrigin("http://192.168.1.10:8080")  // Ваш IP
config.addAllowedOrigin("http://192.168.1.10:5173")  // Vite dev server на IP
config.addAllowedOriginPattern("http://192.168.*:8080")  // Любой IP в локальной сети
config.addAllowedOriginPattern("http://192.168.*:5173")
```

### Шаг 5: Запустите бэкенд

Убедитесь, что бэкенд слушает на всех интерфейсах (0.0.0.0), а не только на localhost:

В `gas/src/main/resources/application.yml`:
```yaml
server:
  port: 8080
  address: 0.0.0.0  # Слушать на всех интерфейсах
```

Или при запуске:
```bash
java -jar gas.jar --server.address=0.0.0.0
```

### Шаг 6: Проверьте подключение

1. Запустите Tauri:
```bash
cd atmosphere-calculator
npm run tauri:dev
```

2. Откройте DevTools в Tauri (Cmd+Option+I на Mac, F12 на Windows/Linux)

3. Перейдите на вкладку Network

4. Выполните запрос к API - в Network вы должны увидеть запросы на `http://192.168.1.10:8080/api/...` (не localhost!)

---

## 2. Сравнение IP сервера из консоли и в коде

### Шаг 1: Получите IP из консоли

**В терминале:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Вывод будет примерно таким:
```
inet 192.168.1.10 netmask 0xffffff00 broadcast 192.168.1.255
```

Запишите IP: **192.168.1.10**

### Шаг 2: Проверьте IP в коде приложения

**В файле `.env.local`:**
```bash
cat atmosphere-calculator/.env.local
```

Должно быть:
```
VITE_API_BASE_URL=http://192.168.1.10:8080/api
```

**В файле `src/services/api.ts`:**
Откройте файл и проверьте, что используется переменная окружения:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

### Шаг 3: Проверьте IP в конфигурации Tauri

**В файле `src-tauri/tauri.conf.json`:**
Проверьте, что разрешены запросы к вашему IP:
```json
"scope": [
  "http://192.168.*:8080/**"
]
```

### Шаг 4: Сравните IP адреса

| Источник | IP адрес | Должен совпадать |
|----------|----------|------------------|
| Консоль (`ifconfig`) | `192.168.1.10` | ✅ |
| `.env.local` | `192.168.1.10` | ✅ |
| Tauri config | `192.168.*` | ✅ (паттерн) |
| CORS config | `192.168.1.10` | ✅ |

**Все IP должны совпадать!**

### Шаг 5: Демонстрация в DevTools

1. Откройте Tauri приложение
2. Откройте DevTools (Cmd+Option+I)
3. Перейдите на вкладку **Console**
4. Выполните запрос - в консоли увидите:
```
Fetching gases from: http://192.168.1.10:8080/api/gases?...
```

5. Перейдите на вкладку **Network**
6. Найдите запрос к `/api/gases`
7. Посмотрите на **Request URL** - должен быть `http://192.168.1.10:8080/api/gases`

---

## 3. Демонстрация изменения данных в БД

### Шаг 1: Подключитесь к базе данных

```bash
# Если используете Docker
docker exec -it <postgres_container> psql -U my_user -d my_database

# Или напрямую
psql -h localhost -U my_user -d my_database
```

### Шаг 2: Посмотрите текущие данные

```sql
SELECT id, name, formula, price FROM gases LIMIT 5;
```

Запишите ID одного из газов, например: `id = 1`

### Шаг 3: Отредактируйте данные в БД

```sql
-- Обновите название газа
UPDATE gases
SET name = 'Азот (ОБНОВЛЕНО через БД!)'
WHERE id = 1;

-- Или обновите цену
UPDATE gases
SET price = 999.99
WHERE id = 1;

-- Проверьте изменения
SELECT id, name, formula, price FROM gases WHERE id = 1;
```

### Шаг 4: Продемонстрируйте изменения в Tauri

1. **Откройте Tauri приложение** (если еще не открыто)

2. **Найдите газ с ID = 1** в списке

3. **Обновите страницу** в Tauri:
   - Mac: `Cmd + R`
   - Windows/Linux: `F5`

4. **Проверьте изменения:**
   - Название должно измениться на "Азот (ОБНОВЛЕНО через БД!)"
   - Цена должна измениться на 999.99

5. **Покажите в DevTools:**
   - Откройте Network
   - Выполните новый запрос
   - Покажите, что данные приходят с бэкенда по IP

### Шаг 5: Дополнительная демонстрация

Можно также изменить несколько газов:

```sql
-- Обновите несколько газов
UPDATE gases
SET name = name || ' [ОБНОВЛЕНО]'
WHERE id IN (1, 2, 3);

-- Проверьте
SELECT id, name FROM gases WHERE id IN (1, 2, 3);
```

Затем обновите страницу в Tauri - все три газа должны обновиться!

---

## 4. Настройка HTTPS

### Вариант 1: Использование mkcert (для локальной разработки)

#### Шаг 1: Установите mkcert

**Mac:**
```bash
brew install mkcert
brew install nss  # для Firefox
```

**Linux:**
```bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**Windows:**
Скачайте с [GitHub Releases](https://github.com/FiloSottile/mkcert/releases)

#### Шаг 2: Создайте локальный CA

```bash
mkcert -install
```

#### Шаг 3: Создайте сертификаты для вашего IP

```bash
cd atmosphere-calculator
mkdir -p certs
cd certs

# Создайте сертификат для IP адреса
mkcert 192.168.1.10 localhost

# Это создаст:
# - 192.168.1.10+1.pem (сертификат)
# - 192.168.1.10+1-key.pem (приватный ключ)
```

#### Шаг 4: Настройте Spring Boot для HTTPS

Создайте файл `gas/src/main/resources/application-https.yml`:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: changeit
    key-store-type: PKCS12
    key-alias: server
```

Или используйте сертификаты mkcert напрямую через Java KeyStore:

```bash
# Конвертируйте сертификаты в PKCS12
openssl pkcs12 -export \
  -in 192.168.1.10+1.pem \
  -inkey 192.168.1.10+1-key.pem \
  -out keystore.p12 \
  -name server \
  -password pass:changeit
```

#### Шаг 5: Обновите CORS для HTTPS

В `CorsConfig.kt`:
```kotlin
config.addAllowedOrigin("https://192.168.1.10:8443")
config.addAllowedOrigin("https://192.168.1.10:5173")
config.addAllowedOriginPattern("https://192.168.*:8443")
```

#### Шаг 6: Обновите API endpoint

В `.env.local`:
```bash
VITE_API_BASE_URL=https://192.168.1.10:8443/api
```

В `tauri.conf.json`:
```json
"scope": [
  "https://192.168.*:8443/**"
]
```

### Вариант 2: Использование Nginx как reverse proxy с SSL

#### Шаг 1: Установите Nginx

**Mac:**
```bash
brew install nginx
```

**Linux:**
```bash
sudo apt install nginx
```

#### Шаг 2: Создайте конфигурацию Nginx

Создайте файл `/etc/nginx/sites-available/gas-backend`:

```nginx
server {
    listen 8443 ssl http2;
    server_name 192.168.1.10;

    ssl_certificate /path/to/certs/192.168.1.10+1.pem;
    ssl_certificate_key /path/to/certs/192.168.1.10+1-key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Шаг 3: Активируйте конфигурацию

```bash
sudo ln -s /etc/nginx/sites-available/gas-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx  # или brew services restart nginx
```

---

## 5. Настройка GitHub Pages для работы с бэкендом по IP

### Проблема

GitHub Pages работает по HTTPS, но ваш бэкенд на локальной сети может быть по HTTP. Браузеры блокируют смешанный контент (HTTPS → HTTP).

### Решение: Использование переменных окружения и условной логики

#### Шаг 1: Обновите `api.ts` для поддержки разных окружений

Файл уже обновлен для поддержки переменных окружения. Проверьте:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

#### Шаг 2: Создайте скрипт для определения IP автоматически

Создайте файл `atmosphere-calculator/scripts/detect-ip.js`:

```javascript
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIP();
console.log(`Detected IP: ${ip}`);
console.log(`VITE_API_BASE_URL=http://${ip}:8080/api`);
```

#### Шаг 3: Настройте GitHub Actions для автоматической подстановки IP

Создайте файл `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci
        working-directory: ./atmosphere-calculator

      - name: Build with environment variables
        run: |
          echo "VITE_API_BASE_URL=https://your-backend-domain.com/api" > .env.production
          npm run build
        working-directory: ./atmosphere-calculator

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./atmosphere-calculator/dist
```

#### Шаг 4: Альтернативное решение - использование относительных путей с прокси

Если ваш бэкенд доступен через домен (например, через ngrok или туннель):

1. **Используйте ngrok для создания туннеля:**

```bash
ngrok http 8080
```

Вы получите URL типа: `https://abc123.ngrok.io`

2. **Обновите `.env.production`:**

```bash
VITE_API_BASE_URL=https://abc123.ngrok.io/api
```

3. **Обновите CORS на бэкенде:**

```kotlin
config.addAllowedOrigin("https://abc123.ngrok.io")
config.addAllowedOrigin("https://yourusername.github.io")
```

#### Шаг 5: Решение для локальной сети - использование Service Worker

Если бэкенд должен быть доступен только в локальной сети, используйте Service Worker для перехвата запросов:

Создайте файл `atmosphere-calculator/public/service-worker.js`:

```javascript
const API_IP = '192.168.1.10';  // Замените на ваш IP
const API_PORT = 8080;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Перехватываем запросы к /api
  if (url.pathname.startsWith('/api')) {
    const newUrl = `http://${API_IP}:${API_PORT}${url.pathname}${url.search}`;
    event.respondWith(
      fetch(newUrl, {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body
      })
    );
  }
});
```

**Важно:** Service Worker работает только по HTTPS или localhost!

#### Шаг 6: Финальная настройка для GitHub Pages

1. **Создайте файл `.env.production` в `atmosphere-calculator/`:**

```bash
# .env.production
# Для GitHub Pages используйте публичный URL бэкенда
VITE_API_BASE_URL=https://your-backend-domain.com/api

# Или если используете ngrok
# VITE_API_BASE_URL=https://abc123.ngrok.io/api
```

2. **Обновите `vite.config.ts` для production:**

```typescript
export default defineConfig(({ mode }) => ({
  // ...
  define: {
    'import.meta.env.VITE_API_BASE_URL': mode === 'production'
      ? JSON.stringify('https://your-backend-domain.com/api')
      : JSON.stringify(process.env.VITE_API_BASE_URL || '/api')
  }
}));
```

3. **Соберите проект:**

```bash
cd atmosphere-calculator
npm run build
```

4. **Проверьте `dist/index.html`:**

Откройте файл и убедитесь, что API запросы идут на правильный URL.

---

## 📝 Чек-лист для демонстрации

### Подключение по IP:
- [ ] IP адрес получен из консоли (`ifconfig`)
- [ ] IP адрес обновлен в `.env.local`
- [ ] IP адрес добавлен в CORS config
- [ ] Бэкенд слушает на `0.0.0.0:8080`
- [ ] Tauri приложение подключается по IP (проверено в DevTools)

### Сравнение IP:
- [ ] IP из консоли совпадает с IP в `.env.local`
- [ ] IP из консоли совпадает с IP в CORS config
- [ ] В DevTools Network видны запросы на IP (не localhost)

### Изменение данных в БД:
- [ ] Данные изменены в БД через SQL
- [ ] Изменения видны в Tauri после обновления страницы
- [ ] В DevTools видно, что данные приходят с бэкенда

### HTTPS (опционально):
- [ ] Сертификаты созданы (mkcert)
- [ ] Бэкенд настроен на HTTPS (порт 8443)
- [ ] CORS обновлен для HTTPS
- [ ] Tauri подключается по HTTPS

### GitHub Pages:
- [ ] `.env.production` настроен
- [ ] Проект собран с правильным API URL
- [ ] GitHub Pages развернут
- [ ] Фронт на GitHub Pages подключается к бэкенду

---

## 🐛 Troubleshooting

### Проблема: CORS ошибка при подключении по IP

**Решение:**
1. Проверьте, что IP добавлен в `CorsConfig.kt`
2. Используйте `addAllowedOriginPattern` для паттернов IP
3. Убедитесь, что `allowCredentials = true` если нужны cookies

### Проблема: Бэкенд недоступен по IP

**Решение:**
1. Проверьте firewall: `sudo ufw allow 8080`
2. Убедитесь, что бэкенд слушает на `0.0.0.0`, а не `127.0.0.1`
3. Проверьте, что IP адрес правильный: `ifconfig`

### Проблема: GitHub Pages не может подключиться к бэкенду

**Решение:**
1. Используйте публичный URL (ngrok, домен)
2. Или используйте Service Worker для перехвата запросов
3. Убедитесь, что CORS разрешает запросы с GitHub Pages

### Проблема: HTTPS сертификат не доверяется

**Решение:**
1. Установите mkcert CA: `mkcert -install`
2. Или добавьте сертификат в доверенные вручную
3. Для production используйте Let's Encrypt

---

## 📚 Полезные команды

```bash
# Узнать IP адрес
ifconfig | grep "inet " | grep -v 127.0.0.1

# Проверить, слушает ли бэкенд на всех интерфейсах
netstat -an | grep 8080

# Проверить CORS заголовки
curl -H "Origin: http://192.168.1.10:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://192.168.1.10:8080/api/gases

# Проверить подключение к бэкенду
curl http://192.168.1.10:8080/api/gases
```

---

**Готово! Теперь ваше приложение работает с бэкендом по IP локальной сети! 🎉**
