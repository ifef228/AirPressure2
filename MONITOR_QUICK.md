# Быстрый мониторинг порта 8080

## Самый простой способ

```bash
./monitor-port-8080-simple.sh
```

## С сохранением в файл

```bash
# tshark (рекомендуется)
./monitor-port-8080.sh

# tcpdump (требует sudo)
sudo ./monitor-port-8080-tcpdump.sh
```

## Прямые команды

```bash
# tshark - только HTTP
tshark -i lo0 -Y "tcp.port == 8080 && http"

# tcpdump - с содержимым
sudo tcpdump -i lo0 -A 'tcp port 8080'
```

## Полезные опции

```bash
# Только HTTP запросы
./monitor-port-8080.sh -r

# Вывод в JSON
./monitor-port-8080.sh --json

# Фильтр по URI
./monitor-port-8080.sh -f 'http.request.uri contains "login"'
```

Подробнее: см. `CONSOLE_MONITORING_GUIDE.md`
