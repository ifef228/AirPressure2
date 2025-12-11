# Мониторинг порта Tauri через консоль

## Быстрый старт

### Вариант 1: Простой скрипт (рекомендуется для начала)

```bash
# Сделать скрипт исполняемым
chmod +x monitor-port-8080-simple.sh

# Запустить мониторинг
./monitor-port-8080-simple.sh
```

### Вариант 2: tshark (консольная версия Wireshark)

```bash
# Сделать скрипт исполняемым
chmod +x monitor-port-8080.sh

# Базовый мониторинг
./monitor-port-8080.sh

# Только HTTP трафик
./monitor-port-8080.sh -h

# Только HTTP запросы
./monitor-port-8080.sh -r

# Вывод в JSON
./monitor-port-8080.sh --json

# С фильтром по URI
./monitor-port-8080.sh -f 'http.request.uri contains "login"'
```

### Вариант 3: tcpdump (простой и быстрый)

```bash
# Сделать скрипт исполняемым
chmod +x monitor-port-8080-tcpdump.sh

# Запустить с sudo (требуются права root)
sudo ./monitor-port-8080-tcpdump.sh

# Подробный вывод с содержимым пакетов
sudo ./monitor-port-8080-tcpdump.sh -v

# Только вывод, без сохранения в файл
sudo ./monitor-port-8080-tcpdump.sh -n
```

## Прямые команды (без скриптов)

### tshark - базовые команды

```bash
# Простой мониторинг порта 8080
tshark -i lo0 -f "tcp port 8080"

# Только HTTP трафик
tshark -i lo0 -Y "tcp.port == 8080 && http"

# Только HTTP запросы
tshark -i lo0 -Y "tcp.port == 8080 && http.request"

# С сохранением в файл
tshark -i lo0 -f "tcp port 8080" -w capture.pcapng

# Показать только метод и URI
tshark -i lo0 -Y "tcp.port == 8080 && http" \
  -T fields -e http.request.method -e http.request.uri -e http.response.code

# Вывод в JSON
tshark -i lo0 -Y "tcp.port == 8080 && http" -T json

# Фильтр по конкретному эндпоинту
tshark -i lo0 -Y "tcp.port == 8080 && http.request.uri contains '/api/users/login'"
```

### tcpdump - базовые команды

```bash
# Простой мониторинг (требует sudo)
sudo tcpdump -i lo0 'tcp port 8080'

# С содержимым пакетов (ASCII)
sudo tcpdump -i lo0 -A 'tcp port 8080'

# С сохранением в файл
sudo tcpdump -i lo0 -w capture.pcap 'tcp port 8080'

# Показать только HTTP заголовки
sudo tcpdump -i lo0 -A -s 0 'tcp port 8080' | grep -E "(GET|POST|PUT|DELETE|HTTP/)"

# Более читаемый вывод
sudo tcpdump -i lo0 -A -s 0 'tcp port 8080' | grep --line-buffered -E "(GET|POST|PUT|DELETE|HTTP/|Host:|Content-Type:)"
```

## Полезные примеры

### Мониторинг авторизации

```bash
# Только запросы на /api/users/login
tshark -i lo0 -Y "tcp.port == 8080 && http.request.uri contains '/api/users/login'"
```

### Мониторинг всех API запросов

```bash
# Все запросы к /api
tshark -i lo0 -Y "tcp.port == 8080 && http.request.uri contains '/api'"
```

### Поиск ошибок (4xx, 5xx)

```bash
# Только ответы с ошибками
tshark -i lo0 -Y "tcp.port == 8080 && http.response.code >= 400"
```

### Мониторинг POST запросов

```bash
# Только POST запросы
tshark -i lo0 -Y "tcp.port == 8080 && http.request.method == POST"
```

### Подробный вывод с временными метками

```bash
# С временными метками и IP адресами
tshark -i lo0 -Y "tcp.port == 8080 && http" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e ip.dst \
  -e http.request.method \
  -e http.request.uri \
  -e http.response.code
```

## Анализ сохраненных файлов

### Просмотр сохраненного файла

```bash
# Просмотр через tshark
tshark -r capture.pcapng

# С фильтром
tshark -r capture.pcapng -Y "http"

# Только HTTP запросы
tshark -r capture.pcapng -Y "http.request"

# Вывод в JSON
tshark -r capture.pcapng -T json

# Статистика
tshark -r capture.pcapng -q -z http,tree
```

### Просмотр через tcpdump

```bash
# Базовый просмотр
tcpdump -r capture.pcap

# С содержимым
tcpdump -r capture.pcap -A

# Только HTTP
tcpdump -r capture.pcap -A | grep -E "(GET|POST|PUT|DELETE|HTTP/)"
```

## Полезные фильтры tshark

### По протоколу
- `http` - весь HTTP трафик
- `http.request` - только HTTP запросы
- `http.response` - только HTTP ответы

### По методу
- `http.request.method == "GET"`
- `http.request.method == "POST"`
- `http.request.method == "PUT"`
- `http.request.method == "DELETE"`

### По URI
- `http.request.uri contains "login"`
- `http.request.uri contains "/api/users"`
- `http.request.uri matches ".*/api/.*"`

### По коду ответа
- `http.response.code == 200`
- `http.response.code >= 400`
- `http.response.code >= 500`

### Комбинированные
- `tcp.port == 8080 && http.request && http.request.method == "POST"`
- `tcp.port == 8080 && http.response && http.response.code >= 400`

## Установка инструментов

### macOS

```bash
# Wireshark (включает tshark)
brew install wireshark

# tcpdump обычно уже установлен
# Если нет, установите Xcode Command Line Tools:
xcode-select --install
```

### Проверка установки

```bash
# Проверить tshark
tshark --version

# Проверить tcpdump
tcpdump --version
```

## Решение проблем

### Проблема: "Permission denied" при использовании tcpdump

**Решение:** tcpdump требует прав root. Используйте `sudo`:
```bash
sudo tcpdump -i lo0 'tcp port 8080'
```

### Проблема: tshark не видит пакеты на localhost

**Решение:** Убедитесь, что используете правильный интерфейс:
```bash
# Список доступных интерфейсов
tshark -D

# Используйте lo0 для localhost на macOS
tshark -i lo0 -f "tcp port 8080"
```

### Проблема: Слишком много вывода

**Решение:** Используйте более специфичные фильтры:
```bash
# Только HTTP запросы
tshark -i lo0 -Y "tcp.port == 8080 && http.request"

# Только конкретный эндпоинт
tshark -i lo0 -Y "tcp.port == 8080 && http.request.uri contains '/api/users/login'"
```

### Проблема: Не видно содержимое HTTPS

**Решение:** Если используется HTTPS, содержимое будет зашифровано. В вашем случае используется HTTP на localhost, поэтому проблем быть не должно.

## Полезные однострочники

```bash
# Мониторинг с подсчетом запросов
tshark -i lo0 -Y "tcp.port == 8080 && http.request" -T fields -e http.request.uri | sort | uniq -c

# Мониторинг времени ответа (примерно)
tshark -i lo0 -Y "tcp.port == 8080 && http" -T fields -e frame.time -e http.response.code

# Поиск медленных запросов (>1 секунда между запросом и ответом)
# (требует более сложного анализа)

# Экспорт всех HTTP запросов в текстовый файл
tshark -i lo0 -Y "tcp.port == 8080 && http.request" -T fields \
  -e frame.time -e http.request.method -e http.request.uri > requests.txt
```

## Интеграция с другими инструментами

### Мониторинг + логирование

```bash
# Сохранить вывод в файл
./monitor-port-8080.sh 2>&1 | tee monitor.log

# Только HTTP запросы в файл
tshark -i lo0 -Y "tcp.port == 8080 && http.request" -T fields \
  -e frame.time -e http.request.method -e http.request.uri >> api-requests.log
```

### Мониторинг + уведомления

```bash
# Уведомление при ошибках (macOS)
tshark -i lo0 -Y "tcp.port == 8080 && http.response.code >= 400" | \
  while read line; do
    osascript -e "display notification \"$line\" with title \"API Error\""
  done
```

## Сравнение инструментов

| Инструмент | Преимущества | Недостатки |
|------------|-------------|------------|
| **tshark** | Мощные фильтры, JSON вывод, анализ HTTP | Требует установки Wireshark |
| **tcpdump** | Простой, быстрый, обычно уже установлен | Менее удобные фильтры, требует root |
| **Скрипты** | Удобство, готовые команды | Нужно сделать исполняемыми |

## Рекомендации

1. **Для начала:** Используйте `monitor-port-8080-simple.sh` - самый простой вариант
2. **Для анализа:** Используйте `monitor-port-8080.sh` с опцией `-h` (только HTTP)
3. **Для сохранения:** Используйте скрипты с сохранением в файл, затем анализируйте через Wireshark GUI
4. **Для отладки:** Используйте `-v` или `--verbose` для подробного вывода

---

**Примечание:** Все скрипты автоматически определяют интерфейс `lo0` для localhost на macOS. Если нужно использовать другой интерфейс, используйте опцию `-i`.
