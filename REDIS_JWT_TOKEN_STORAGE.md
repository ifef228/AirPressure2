# Хранение JWT токенов в Redis

## Описание

При выходе пользователя (logout) JWT токен сохраняется в Redis blacklist. **Важно:** в Redis сохраняется **полный JWT токен** (вся строка), а не просто метка "blacklisted".

## Структура хранения

- **Ключ Redis:** `jwt:blacklist:{hashCode}` (где `{hashCode}` - хеш-код токена)
- **Значение Redis:** Полный JWT токен (вся строка, например: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Реализация

### TokenBlacklistService

Метод `addTokenToBlacklist()` сохраняет полный токен:

```kotlin
// Сохраняем полный JWT токен в Redis с TTL
redisTemplate.opsForValue().set(key, token, expirationTime, TimeUnit.MILLISECONDS)
```

### Получение токена из Redis

Для получения полного токена из Redis можно использовать:

1. **Через API контроллер:**
   ```
   GET /api/admin/blacklist/keys
   ```
   В ответе поле `value` содержит полный JWT токен.

2. **Через сервис:**
   ```kotlin
   val fullToken = tokenBlacklistService.getTokenFromBlacklist(token)
   ```

3. **Напрямую через Redis:**
   ```bash
   redis-cli
   > KEYS jwt:blacklist:*
   > GET jwt:blacklist:{hashCode}
   ```

## Пример использования

### 1. Выход пользователя (logout)

```bash
POST /api/users/logout
Authorization: Bearer {jwt_token}
```

Токен сохраняется в Redis с полной строкой.

### 2. Проверка токена в blacklist

```bash
POST /api/admin/blacklist/check
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Получение всех токенов из blacklist

```bash
GET /api/admin/blacklist/keys
```

Ответ содержит:
```json
{
  "success": true,
  "data": [
    {
      "key": "jwt:blacklist:123456789",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDg2NDAwfQ.signature",
      "ttlSeconds": 86400,
      "ttlHours": 24.0,
      "ttlDays": 1.0
    }
  ]
}
```

## Проверка через Redis CLI

```bash
# Подключение к Redis
redis-cli

# Получить все ключи blacklist
KEYS jwt:blacklist:*

# Получить полный токен по ключу
GET jwt:blacklist:123456789

# Проверить TTL
TTL jwt:blacklist:123456789
```

## Важные моменты

1. **Полный токен сохраняется:** В Redis хранится полная строка JWT токена, а не просто метка.

2. **Ключ использует хеш:** Для производительности ключ использует хеш-код токена, но значение содержит полный токен.

3. **TTL автоматический:** TTL устанавливается на основе времени истечения токена из его claims.

4. **Безопасность:** Доступ к API blacklist должен быть ограничен только для администраторов в production.

## Изменения в коде

### До изменений:
```kotlin
redisTemplate.opsForValue().set(key, "blacklisted", expirationTime, TimeUnit.MILLISECONDS)
```

### После изменений:
```kotlin
redisTemplate.opsForValue().set(key, token, expirationTime, TimeUnit.MILLISECONDS)
```

## Тестирование

Все тесты обновлены для проверки сохранения полного токена:

```kotlin
verify(valueOperations).set(
    argThat { it.startsWith("jwt:blacklist:") },
    eq(token), // Полный JWT токен
    any(),
    eq(TimeUnit.MILLISECONDS)
)
```

## API Endpoints

- `POST /api/users/logout` - Выход пользователя (добавляет токен в blacklist)
- `GET /api/admin/blacklist/keys` - Получить все токены из blacklist (с полными токенами)
- `POST /api/admin/blacklist/check` - Проверить, находится ли токен в blacklist
- `GET /api/admin/blacklist/size` - Получить количество токенов в blacklist
- `DELETE /api/admin/blacklist/clear` - Очистить весь blacklist

---

**Дата изменений:** 2024
**Файлы:**
- `gas/src/main/kotlin/ru/mstu/yandex/gas/service/TokenBlacklistService.kt`
- `gas/src/test/kotlin/ru/mstu/yandex/gas/service/TokenBlacklistServiceTest.kt`
- `gas/src/main/kotlin/ru/mstu/yandex/gas/controller/api/GasTokenBlacklistController.kt`
