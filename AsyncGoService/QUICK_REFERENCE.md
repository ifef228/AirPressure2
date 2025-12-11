# Быстрая справка для демонстрации

## Порядок действий

### 1️⃣ GET список заявок
```
GET http://localhost:8080/api/gas-orders
Authorization: Bearer <токен>
```
**Записать:** `id` заявки и `gasId` первого газа

---

### 2️⃣ POST создать задачу в асинхронном сервисе
```
POST http://localhost:8081/api/tasks
Content-Type: application/json

{
  "type": "calculate",
  "data": "1:5"
}
```
**Заменить:** `1:5` на `calcOrderId:gasId` из шага 1

---

### 3️⃣ ⏳ Подождать 5-10 секунд

---

### 4️⃣ GET список заявок (проверка)
```
GET http://localhost:8080/api/gas-orders
Authorization: Bearer <токен>
```
**Показать:** Результат появился! (`result` и `tempResult` заполнены)

---

### 5️⃣ POST обновить результат вручную
```
POST http://localhost:8080/api/gas-orders/async-results
Content-Type: application/json
X-Async-Token: async123

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
**Заменить:** `calcOrderId`, `gasId` и `result` на нужные значения

---

### 6️⃣ GET список заявок (финальная проверка)
```
GET http://localhost:8080/api/gas-orders
Authorization: Bearer <токен>
```
**Показать:** Результат изменился на новое значение!

---

## Формула данных задачи
```
calcOrderId:gasId
```
Пример: `1:5` означает заявку ID=1, газ ID=5

## Токен асинхронного сервиса
```
async123
```

## Порты
- Основной сервис: `8080`
- Асинхронный сервис: `8081`
