# 🚀 Быстрый старт: Подключение к бэкенду по IP

## 📝 Шаги для настройки

### 1. Узнайте ваш IP адрес

```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Или используйте скрипт
npm run detect-ip
```

Запишите IP, например: `192.168.1.10`

### 2. Создайте файл `.env.local`

В папке `atmosphere-calculator/` создайте файл `.env.local`:

```bash
VITE_API_BASE_URL=http://192.168.1.10:8080/api
```

**Важно:** Замените `192.168.1.10` на ваш реальный IP!

### 3. Обновите CORS на бэкенде

Файл `gas/src/main/kotlin/ru/mstu/yandex/gas/config/CorsConfig.kt` уже обновлен для поддержки IP адресов через паттерны `192.168.*`.

Если нужно добавить конкретный IP, добавьте в `CorsConfig.kt`:

```kotlin
config.addAllowedOrigin("http://192.168.1.10:5173")
```

### 4. Убедитесь, что бэкенд слушает на всех интерфейсах

В файле `gas/src/main/resources/application.yml` должно быть:

```yaml
server:
  port: 8080
  address: 0.0.0.0  # Слушать на всех интерфейсах
```

### 5. Запустите бэкенд

```bash
cd gas
./gradlew bootRun
```

Проверьте в логах, что сервер запустился на `0.0.0.0:8080`

### 6. Запустите Tauri

```bash
cd atmosphere-calculator
npm run tauri:dev
```

### 7. Проверьте подключение

1. Откройте DevTools в Tauri (Cmd+Option+I на Mac, F12 на Windows/Linux)
2. Перейдите на вкладку **Network**
3. Выполните запрос - вы должны увидеть запросы на `http://192.168.1.10:8080/api/...`

---

## 🔍 Сравнение IP адресов

### IP из консоли:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Вывод: inet 192.168.1.10
```

### IP в коде:
```bash
cat atmosphere-calculator/.env.local
# Вывод: VITE_API_BASE_URL=http://192.168.1.10:8080/api
```

**Они должны совпадать! ✅**

---

## 🧪 Демонстрация изменения данных в БД

### 1. Подключитесь к БД

```bash
docker exec -it <postgres_container> psql -U my_user -d my_database
```

### 2. Измените данные

```sql
UPDATE gases
SET name = 'Азот (ОБНОВЛЕНО!)'
WHERE id = 1;
```

### 3. Обновите страницу в Tauri

- Mac: `Cmd + R`
- Windows/Linux: `F5`

Изменения должны появиться! ✅

---

## 📚 Подробная инструкция

См. [NETWORK_SETUP_INSTRUCTIONS.md](./NETWORK_SETUP_INSTRUCTIONS.md) для подробной инструкции по:
- Настройке HTTPS
- Настройке GitHub Pages
- Troubleshooting

---

## ⚡ Быстрые команды

```bash
# Узнать IP
npm run detect-ip

# Запустить Tauri
npm run tauri:dev

# Проверить подключение к бэкенду
curl http://192.168.1.10:8080/api/gases
```

---

**Готово! 🎉**
