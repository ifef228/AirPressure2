# Gas API Postman Collection - Инструкция по использованию

## Описание

Коллекция содержит 21+ запросов для работы с API системы расчета температуры газов с поддержкой JWT аутентификации.

## Установка

1. Откройте Postman
2. Нажмите `Import` → выберите файл `Gas-API-Postman-Collection.json`
3. Коллекция будет импортирована со всеми переменными

## Переменные окружения

Коллекция использует следующие переменные (устанавливаются автоматически через тесты):

- `base_url` - базовый URL API (по умолчанию: `http://localhost:8080`)
- `jwt_token` - JWT токен пользователя (автоматически сохраняется при входе)
- `moderator_jwt_token` - JWT токен модератора
- `order_id` - ID текущей заявки
- `gas_id_1`, `gas_id_2` - ID услуг
- `new_gas_id` - ID новой созданной услуги

## Порядок выполнения запросов (21 основной запрос)

### 1. Аутентификация (4 запроса)

#### 1.1. Регистрация пользователя
- **Метод:** `POST /api/users/register`
- **Описание:** Создание нового пользователя
- **Body:**
```json
{
    "login": "testuser",
    "password": "password123",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
}
```

#### 1.2. Вход (Login) - Получить JWT токен
- **Метод:** `POST /api/users/login`
- **Описание:** Получение JWT токена (автоматически сохраняется в переменную `jwt_token`)
- **Body:**
```json
{
    "login": "testuser",
    "password": "password123"
}
```

#### 1.3. Регистрация модератора
- **Метод:** `POST /api/users/register`
- **Описание:** Создание пользователя с ролью модератора

#### 1.4. Вход модератора
- **Метод:** `POST /api/users/login`
- **Описание:** Получение JWT токена модератора

---

### 2. Работа с заявками (4 запроса)

#### 2.1. GET список заявок (с фильтром по дате и статусу)
- **Метод:** `GET /api/gas-orders`
- **Параметры:**
  - `status` - статус заявки (DRAFT, FORMED, COMPLETED, CANCELLED)
  - `formedDateFrom` - дата формирования от (ISO 8601)
  - `formedDateTo` - дата формирования до (ISO 8601)
  - `page` - номер страницы
  - `size` - размер страницы
- **Требует:** JWT токен в заголовке `Authorization: Bearer {token}`

#### 2.2. GET иконка корзины
- **Метод:** `GET /api/gas-orders/cart-icon`
- **Описание:** Получение информации о текущей корзине (количество товаров, ID заявки)

#### 2.3. GET заявка по ID
- **Метод:** `GET /api/gas-orders/:id`
- **Описание:** Получение детальной информации о заявке
- **Автоматически сохраняет:** `order_id` в переменные

#### 2.4. DELETE заявка (если есть)
- **Метод:** `DELETE /api/gas-orders/:id`
- **Описание:** Удаление заявки (только для автора или модератора)
- **Требует:** JWT токен

---

### 3. Работа с услугами (4 запроса)

#### 3.1. GET список услуг (с фильтром)
- **Метод:** `GET /api/gases`
- **Параметры:**
  - `name` - фильтр по названию
  - `formula` - фильтр по формуле
  - `page`, `size` - пагинация
- **Автоматически сохраняет:** `gas_id_1`, `gas_id_2` в переменные

#### 3.2. GET услуга по ID
- **Метод:** `GET /api/gases/:id`
- **Описание:** Получение детальной информации об услуге

#### 3.3. POST добавить новую услугу
- **Метод:** `POST /api/gases`
- **Требует:** JWT токен
- **Body:**
```json
{
    "name": "Азот",
    "formula": "N2",
    "detailedDescription": "Диазот - двухатомный газ без цвета, вкуса и запаха",
    "imageUrl": null
}
```
- **Автоматически сохраняет:** `new_gas_id` в переменные

#### 3.4. POST добавить картинку к услуге
- **Метод:** `POST /api/gases/:id/image`
- **Требует:** JWT токен
- **Body:**
```json
{
    "imageUrl": "https://example.com/images/nitrogen.jpg"
}
```

---

### 4. Работа с заявкой (9 запросов)

#### 4.1. POST добавить услугу в заявку
- **Метод:** `POST /api/gas-orders/:id/gases`
- **Требует:** JWT токен
- **Body:**
```json
{
    "gasId": 1,
    "concentration": 78.08,
    "temperature": 20.0
}
```

#### 4.2. POST добавить другую услугу в заявку
- **Метод:** `POST /api/gas-orders/:id/gases`
- **Описание:** Добавление второй услуги в ту же заявку

#### 4.3. GET иконка корзины (после добавления услуг)
- **Метод:** `GET /api/gas-orders/cart-icon`
- **Описание:** Проверка количества товаров в корзине

#### 4.4. GET заявка (посмотреть заявку из 2 услуг)
- **Метод:** `GET /api/gas-orders/:id`
- **Описание:** Получение полной информации о заявке с двумя услугами

#### 4.5. PUT изменить поле услуги (концентрация/температура)
- **Метод:** `PUT /api/gas-orders/:orderId/gases/:gasId`
- **Требует:** JWT токен (только для автора заявки)
- **Body:**
```json
{
    "concentration": 80.0,
    "temperature": 22.5
}
```

#### 4.6. PUT изменить заявку (описание)
- **Метод:** `PUT /api/gas-orders/:id`
- **Требует:** JWT токен (только для автора заявки)
- **Body:**
```json
{
    "description": "Заявка на расчет температуры атмосферы"
}
```

#### 4.7. PUT завершить черновик заявки (должна быть ошибка)
- **Метод:** `PUT /api/gas-orders/:id/complete`
- **Требует:** JWT токен модератора
- **Ожидаемый результат:** Ошибка 400 (можно завершать только сформированные заявки) или 403 (создатель не может завершать свою заявку)
- **Body:**
```json
{
    "action": "APPROVE",
    "comment": "Одобрено"
}
```

#### 4.8. PUT сформировать заявку
- **Метод:** `PUT /api/gas-orders/:id/form`
- **Требует:** JWT токен
- **Описание:** Перевод заявки из статуса DRAFT в FORMED

#### 4.9. PUT завершить сформированную заявку (модератором)
- **Метод:** `PUT /api/gas-orders/:id/complete`
- **Требует:** JWT токен модератора (не токен создателя!)
- **Body:**
```json
{
    "action": "APPROVE",
    "comment": "Заявка одобрена. Температура рассчитана автоматически."
}
```
- **Действия:** `APPROVE` (одобрить) или `REJECT` (отклонить)

---

## Дополнительные запросы

### GET рассчитать температуру заявки
- **Метод:** `GET /api/gas-orders/:id/calculate-temperature`
- **Описание:** Получение рассчитанной температуры для заявки

### GET услуга в заявке
- **Метод:** `GET /api/gas-orders/:orderId/gases/:gasId`
- **Описание:** Получение информации о конкретной услуге в заявке

### DELETE удалить услугу из заявки
- **Метод:** `DELETE /api/gas-orders/:orderId/gases/:gasId`
- **Требует:** JWT токен

### GET профиль пользователя
- **Метод:** `GET /api/users/profile`
- **Требует:** JWT токен

### PUT обновить профиль
- **Метод:** `PUT /api/users/profile`
- **Требует:** JWT токен

---

## Важные моменты

### JWT Аутентификация

1. **Получение токена:** Выполните запрос "Вход (Login)" - токен автоматически сохранится в переменную `jwt_token`
2. **Использование токена:** Токен автоматически добавляется в заголовок `Authorization: Bearer {token}` для всех запросов (кроме тех, где `auth: "noauth"`)

### Права доступа

- **Без авторизации:** Только GET методы чтения (список услуг, получение услуги, иконка корзины)
- **Обычный пользователь:** Может создавать и редактировать только свои заявки
- **Модератор/Админ:** Может завершать заявки других пользователей, видеть все заявки

### Статусы заявок

- `DRAFT` - Черновик (можно редактировать)
- `FORMED` - Сформирован (ожидает модерации)
- `COMPLETED` - Завершен (одобрен модератором)
- `CANCELLED` - Отклонен
- `DELETED` - Удален

### Порядок выполнения сценария

1. Регистрация и вход пользователя → получение `jwt_token`
2. Регистрация и вход модератора → получение `moderator_jwt_token`
3. GET список заявок (может быть пустым)
4. GET иконка корзины → получение `order_id`
5. DELETE заявка (если есть и нужно очистить)
6. GET список услуг → получение `gas_id_1`, `gas_id_2`
7. POST добавить новую услугу → получение `new_gas_id`
8. POST добавить картинку к услуге
9. POST добавить услугу в заявку
10. POST добавить другую услугу в заявку
11. GET иконка корзины (проверка количества)
12. GET заявка (просмотр 2 услуг)
13. PUT изменить поле услуги (концентрация/температура)
14. PUT изменить заявку
15. PUT завершить черновик (ожидается ошибка)
16. PUT сформировать заявку
17. PUT завершить сформированную заявку (модератором) - расчет температуры

---

## Модели данных (DTO)

### UserDto
```kotlin
RegisterUserDto {
    login: String (3-50 символов)
    password: String (мин. 6 символов)
    email: String? (опционально)
    firstName: String? (опционально)
    lastName: String? (опционально)
    role: String? (USER, MODERATOR, ADMIN)
}

LoginDto {
    login: String
    password: String
}

AuthResponseDto {
    token: String (JWT токен)
    user: UserResponseDto
}
```

### GasDto
```kotlin
CreateGasDto {
    name: String (обязательно)
    formula: String (обязательно)
    detailedDescription: String (обязательно)
    imageUrl: String? (опционально)
}

GasResponseDto {
    id: Long
    name: String
    formula: String
    detailedDescription: String
    imageUrl: String?
    createdAt: String?
    updatedAt: String?
}
```

### OrderDto
```kotlin
AddGasToOrderDto {
    gasId: Long (обязательно)
    concentration: Double (0.0-100.0)
    temperature: Double (-273.15 до 1000.0)
}

UpdateGasOrderDto {
    concentration: Double? (0.0-100.0)
    temperature: Double? (-273.15 до 1000.0)
}

CompleteOrderDto {
    action: String ("APPROVE" | "REJECT")
    comment: String? (опционально)
}

OrderResponseDto {
    id: Long
    userId: Long
    tempResult: Double? (рассчитанная температура)
    timestamp: String
    status: String
    description: String?
    creatorLogin: String?
    moderatorLogin: String?
    gases: List<GasOrderResponseDto>
}
```

---

## Сериализация

Все запросы и ответы используют JSON формат. Spring Boot автоматически сериализует/десериализует объекты через Jackson:

- `@RequestBody` - автоматическая десериализация JSON → Kotlin data class
- `@ResponseBody` - автоматическая сериализация Kotlin data class → JSON
- Валидация через `@Valid` и Jakarta Validation аннотации

---

## Примеры SQL запросов для проверки данных

```sql
-- Просмотр всех заявок
SELECT * FROM calc_order ORDER BY timestamp DESC;

-- Просмотр заявок с услугами
SELECT co.id, co.user_id, co.status, co.temp_result,
       go.gas_id, go.concentration, go.temperature
FROM calc_order co
LEFT JOIN gas_order go ON co.id = go.calc_order_id
ORDER BY co.timestamp DESC;

-- Просмотр пользователей
SELECT id, login, email, role FROM users;

-- Просмотр услуг
SELECT id, name, formula, image_url FROM gas;
```

---

## Troubleshooting

### Токен не сохраняется
- Проверьте, что в тестах запроса правильно настроено сохранение токена
- Убедитесь, что ответ содержит поле `data.token`

### Ошибка 401 Unauthorized
- Проверьте, что токен не истек (срок действия - 6 месяцев)
- Убедитесь, что токен передается в заголовке `Authorization: Bearer {token}`

### Ошибка 403 Forbidden
- Убедитесь, что пользователь имеет необходимые права (роль MODERATOR для завершения заявок)
- Проверьте, что пользователь не пытается завершить свою собственную заявку

### Переменные не устанавливаются
- Проверьте, что тесты в запросах выполняются успешно
- Убедитесь, что ответ имеет ожидаемую структуру
