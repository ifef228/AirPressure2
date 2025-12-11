#!/bin/bash

# Скрипт для мониторинга порта 8080 через tcpdump (более простой вариант)
# Использование: ./monitor-port-8080-tcpdump.sh [опции]

PORT=8080
INTERFACE="lo0"  # Loopback интерфейс для localhost на macOS
OUTPUT_FILE="capture-$(date +%Y%m%d-%H%M%S).pcap"

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
    echo "  -o, --output FILE         Файл для сохранения (по умолчанию: capture-TIMESTAMP.pcap)"
    echo "  -v, --verbose             Подробный вывод (показывать содержимое пакетов)"
    echo "  -n, --no-save             Не сохранять в файл, только выводить"
    echo "  --help                    Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0                        # Базовый мониторинг с сохранением"
    echo "  $0 -v                     # Подробный вывод с содержимым пакетов"
    echo "  $0 -n                     # Только вывод, без сохранения"
}

# Проверка наличия tcpdump
check_tcpdump() {
    if ! command -v tcpdump &> /dev/null; then
        echo -e "${RED}Ошибка: tcpdump не установлен!${NC}"
        echo ""
        echo "Установите tcpdump:"
        echo "  macOS: обычно уже установлен, или через Xcode Command Line Tools"
        exit 1
    fi
}

# Проверка прав root
check_permissions() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}Предупреждение: tcpdump требует прав root для захвата пакетов${NC}"
        echo "Запустите скрипт с sudo:"
        echo "  sudo $0 $@"
        exit 1
    fi
}

# Парсинг аргументов
VERBOSE=false
NO_SAVE=false

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
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -n|--no-save)
            NO_SAVE=true
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

# Проверки
check_tcpdump
check_permissions

# Построение команды tcpdump
TCPDUMP_CMD="tcpdump -i $INTERFACE 'tcp port $PORT'"

if [ "$VERBOSE" = true ]; then
    TCPDUMP_CMD="$TCPDUMP_CMD -A"  # ASCII вывод
fi

if [ "$NO_SAVE" = false ]; then
    TCPDUMP_CMD="$TCPDUMP_CMD -w $OUTPUT_FILE"
fi

# Вывод информации
echo -e "${BLUE}=== Мониторинг порта $PORT через tcpdump ===${NC}"
echo -e "${GREEN}Интерфейс:${NC} $INTERFACE"
echo -e "${GREEN}Порт:${NC} $PORT"

if [ "$NO_SAVE" = false ]; then
    echo -e "${GREEN}Файл сохранения:${NC} $OUTPUT_FILE"
fi

if [ "$VERBOSE" = true ]; then
    echo -e "${GREEN}Режим:${NC} Подробный (с содержимым пакетов)"
fi

echo ""
echo -e "${YELLOW}Нажмите Ctrl+C для остановки${NC}"
echo ""

# Запуск tcpdump
eval $TCPDUMP_CMD

if [ "$NO_SAVE" = false ]; then
    echo ""
    echo -e "${GREEN}Захват завершен. Файл сохранен: $OUTPUT_FILE${NC}"
    echo ""
    echo "Для просмотра файла используйте:"
    echo "  tcpdump -r $OUTPUT_FILE"
    echo "  tcpdump -r $OUTPUT_FILE -A  # с содержимым"
    echo "  или"
    echo "  tshark -r $OUTPUT_FILE"
    echo "  wireshark $OUTPUT_FILE"
fi
