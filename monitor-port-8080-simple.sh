#!/bin/bash

# Простой скрипт для быстрого мониторинга порта 8080
# Показывает HTTP запросы и ответы в реальном времени

PORT=8080
INTERFACE="lo0"

echo "=== Мониторинг HTTP трафика на порту $PORT ==="
echo "Нажмите Ctrl+C для остановки"
echo ""

# Проверяем наличие tshark
if command -v tshark &> /dev/null; then
    echo "Используется tshark..."
    echo ""
    tshark -i "$INTERFACE" -Y "tcp.port == $PORT && http" \
        -T fields \
        -e frame.time \
        -e ip.src \
        -e ip.dst \
        -e http.request.method \
        -e http.request.uri \
        -e http.response.code \
        -e http.response.phrase \
        -e http.content_length \
        2>/dev/null | while IFS=$'\t' read -r time src dst method uri code phrase length; do
            if [ -n "$method" ]; then
                echo "[$time] $src -> $dst | $method $uri"
            elif [ -n "$code" ]; then
                echo "[$time] $src <- $dst | $code $phrase (${length} bytes)"
            fi
        done
elif command -v tcpdump &> /dev/null; then
    echo "Используется tcpdump..."
    echo ""
    if [ "$EUID" -ne 0 ]; then
        echo "Запустите с sudo: sudo $0"
        exit 1
    fi
    tcpdump -i "$INTERFACE" -A -s 0 "tcp port $PORT" 2>/dev/null
else
    echo "Ошибка: не найдены tshark или tcpdump"
    echo "Установите Wireshark: brew install wireshark"
    exit 1
fi
