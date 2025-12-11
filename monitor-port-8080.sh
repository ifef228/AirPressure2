#!/bin/bash

# Скрипт для мониторинга порта 8080 через tshark (консольная версия Wireshark)
# Использование: ./monitor-port-8080.sh [опции]

PORT=8080
INTERFACE="lo0"  # Loopback интерфейс для localhost на macOS
OUTPUT_FILE="capture-$(date +%Y%m%d-%H%M%S).pcapng"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция помощи
show_help() {
    echo "Использование: $0 [опции]"
    echo ""
    echo "Опции:"
    echo "  -p, --port PORT          Порт для мониторинга (по умолчанию: 8080)"
    echo "  -i, --interface IFACE     Сетевой интерфейс (по умолчанию: lo0)"
    echo "  -f, --filter FILTER       Дополнительный фильтр tshark"
    echo "  -o, --output FILE         Файл для сохранения (по умолчанию: capture-TIMESTAMP.pcapng)"
    echo "  -v, --verbose             Подробный вывод"
    echo "  -h, --http-only           Показывать только HTTP трафик"
    echo "  -r, --requests-only       Показывать только HTTP запросы"
    echo "  --json                    Выводить в формате JSON"
    echo "  --help                    Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0                        # Базовый мониторинг порта 8080"
    echo "  $0 -h                     # Только HTTP трафик"
    echo "  $0 -r                     # Только HTTP запросы"
    echo "  $0 --json                 # Вывод в JSON формате"
    echo "  $0 -f 'http.request.uri contains login'  # Фильтр по URI"
}

# Проверка наличия tshark
check_tshark() {
    if ! command -v tshark &> /dev/null; then
        echo -e "${RED}Ошибка: tshark не установлен!${NC}"
        echo ""
        echo "Установите Wireshark (который включает tshark):"
        echo "  brew install wireshark"
        echo ""
        echo "Или используйте tcpdump (более простой вариант):"
        echo "  ./monitor-port-8080-tcpdump.sh"
        exit 1
    fi
}

# Парсинг аргументов
VERBOSE=false
HTTP_ONLY=false
REQUESTS_ONLY=false
JSON_OUTPUT=false
CUSTOM_FILTER=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -i|--interface)
            INTERFACE="$2"
            shift 2
            ;;
        -f|--filter)
            CUSTOM_FILTER="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--http-only)
            HTTP_ONLY=true
            shift
            ;;
        -r|--requests-only)
            REQUESTS_ONLY=true
            shift
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Неизвестная опция: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Проверка tshark
check_tshark

# Построение фильтра
FILTER="tcp.port == $PORT"

if [ "$HTTP_ONLY" = true ]; then
    FILTER="$FILTER && http"
fi

if [ "$REQUESTS_ONLY" = true ]; then
    FILTER="$FILTER && http.request"
fi

if [ -n "$CUSTOM_FILTER" ]; then
    FILTER="$FILTER && $CUSTOM_FILTER"
fi

# Вывод информации
echo -e "${BLUE}=== Мониторинг порта $PORT через tshark ===${NC}"
echo -e "${GREEN}Интерфейс:${NC} $INTERFACE"
echo -e "${GREEN}Фильтр:${NC} $FILTER"
echo -e "${GREEN}Файл сохранения:${NC} $OUTPUT_FILE"
echo ""
echo -e "${YELLOW}Нажмите Ctrl+C для остановки${NC}"
echo ""

# Формат вывода
if [ "$JSON_OUTPUT" = true ]; then
    OUTPUT_FORMAT="-T json"
else
    OUTPUT_FORMAT="-T fields -e frame.number -e frame.time -e ip.src -e ip.dst -e tcp.srcport -e tcp.dstport -e http.request.method -e http.request.uri -e http.response.code -e http.response.phrase"
fi

# Запуск tshark
if [ "$VERBOSE" = true ]; then
    tshark -i "$INTERFACE" -f "tcp port $PORT" -Y "$FILTER" -w "$OUTPUT_FILE" $OUTPUT_FORMAT
else
    tshark -i "$INTERFACE" -f "tcp port $PORT" -Y "$FILTER" -w "$OUTPUT_FILE" $OUTPUT_FORMAT 2>/dev/null
fi

echo ""
echo -e "${GREEN}Захват завершен. Файл сохранен: $OUTPUT_FILE${NC}"
echo ""
echo "Для просмотра файла используйте:"
echo "  tshark -r $OUTPUT_FILE"
echo "  или"
echo "  wireshark $OUTPUT_FILE"
