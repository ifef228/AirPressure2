#!/bin/bash

# Примеры использования AsyncGoService API

BASE_URL="http://localhost:8081"

echo "=== 1. Проверка здоровья сервиса ==="
curl -s "$BASE_URL/api/health" | jq '.'

echo -e "\n=== 2. Создание задачи типа 'calculate' ==="
TASK1=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"type": "calculate", "data": "2 + 2 * 3"}')
echo "$TASK1" | jq '.'
TASK1_ID=$(echo "$TASK1" | jq -r '.id')

echo -e "\n=== 3. Создание задачи типа 'process' ==="
TASK2=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"type": "process", "data": "process this data"}')
echo "$TASK2" | jq '.'
TASK2_ID=$(echo "$TASK2" | jq -r '.id')

echo -e "\n=== 4. Создание задачи типа 'transform' ==="
TASK3=$(curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"type": "transform", "data": "transform me"}')
echo "$TASK3" | jq '.'
TASK3_ID=$(echo "$TASK3" | jq -r '.id')

echo -e "\n=== 5. Получение всех задач ==="
curl -s "$BASE_URL/api/tasks" | jq '.'

echo -e "\n=== 6. Получение задачи по ID ==="
sleep 1
curl -s "$BASE_URL/api/tasks?id=$TASK1_ID" | jq '.'

echo -e "\n=== 7. Ожидание завершения задач (3 секунды) ==="
sleep 3

echo -e "\n=== 8. Проверка статуса задач после обработки ==="
curl -s "$BASE_URL/api/tasks?id=$TASK1_ID" | jq '.status, .result'
curl -s "$BASE_URL/api/tasks?id=$TASK2_ID" | jq '.status, .result'
curl -s "$BASE_URL/api/tasks?id=$TASK3_ID" | jq '.status, .result'

echo -e "\n=== Готово! ==="
