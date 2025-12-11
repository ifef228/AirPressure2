# Быстрая инструкция для демонстрации в Postman

## Настройка переменных в Postman

Создайте переменные окружения:
- `base_url` = `http://localhost:8080`
- `async_url` = `http://localhost:8081`
- `jwt_token` = `<ваш_jwt_токен>`
- `async_token` = `async123`

---

## Шаг 1: GET список заявок

**Request:**
```
GET {{base_url}}/api/gas-orders
```

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Что смотрим:**
- Запишите `id` заявки (например, `1`)
- Запишите `gasId` первого газа (например, `5`)
- Проверьте, что `completedResultsCount = 0` и `result = null`

---

## Шаг 2: POST создать задачу в асинхронном сервисе

**Request:**
```
POST {{async_url}}/api/tasks
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "type": "calculate",
  "data": "1:5"
}
```

**Важно:** Замените `1:5` на `calcOrderId:gasId` из Шага 1

**Ответ:** Запишите `id` задачи для проверки

---

## Шаг 3: Подождать 5-10 секунд

Асинхронный сервис обрабатывает задачу и автоматически отправляет результат.

---

## Шаг 4: GET список заявок (проверка результата)

**Request:**
```
GET {{base_url}}/api/gas-orders
```

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Что смотрим:**
- `completedResultsCount` увеличился (например, `1`)
- `gases[0].result` появилось значение (например, `15.80`)
- `tempResult` обновился

**Демонстрация:** Покажите, что результат появился с задержкой!

---

## Шаг 5: POST обновить результат вручную с ключом

**Request:**
```
POST {{base_url}}/api/gas-orders/async-results
```

**Headers:**
```
Content-Type: application/json
X-Async-Token: {{async_token}}
```

**Body (raw JSON):**
```json
{
  "results": [
    {
      "calcOrderId": 1,
      "gasId": 5,
      "result": 25.50
    }
  ]
}
```

**Важно:**
- Замените `calcOrderId` и `gasId` на значения из Шага 1
- Установите новое значение `result` (например, `25.50`)

---

## Шаг 6: GET список заявок (проверка обновления)

**Request:**
```
GET {{base_url}}/api/gas-orders
```

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Что смотрим:**
- `result` изменился на новое значение (например, `25.50`)
- `tempResult` обновился

**Демонстрация:** Покажите, что результат изменился!

---

## Чек-лист для демонстрации

- [ ] Шаг 1: Показать список заявок без результатов
- [ ] Шаг 2: Вызвать асинхронный сервис
- [ ] Шаг 3: Подождать 5-10 секунд
- [ ] Шаг 4: Показать, что результат появился с задержкой
- [ ] Шаг 5: Обновить результат вручную с ключом
- [ ] Шаг 6: Показать, что результат изменился

---

## Дополнительно: Проверка статуса задачи

**Request:**
```
GET {{async_url}}/api/tasks?id=<task_id>
```

Замените `<task_id>` на ID задачи из Шага 2.

**Статусы:**
- `pending` - в очереди
- `processing` - обрабатывается
- `completed` - завершена
