# Просмотр логов AsyncGoService

## Способы просмотра логов

### 1. Если приложение запущено в терминале

Логи выводятся прямо в терминал, где запущено приложение:
```bash
cd AsyncGoService
go run main.go
```

### 2. Запуск с сохранением логов в файл

```bash
cd AsyncGoService
go run main.go > app.log 2>&1
```

Или только ошибки:
```bash
go run main.go 2> errors.log
```

### 3. Запуск в фоне с логированием

```bash
cd AsyncGoService
nohup go run main.go > app.log 2>&1 &
```

Просмотр логов в реальном времени:
```bash
tail -f app.log
```

### 4. Использование tee для одновременного вывода и сохранения

```bash
cd AsyncGoService
go run main.go | tee app.log
```

### 5. Просмотр логов запущенного процесса

Если приложение уже запущено, можно найти его PID и посмотреть логи:

```bash
# Найти PID процесса
ps aux | grep "go run main.go" | grep -v grep

# Или найти по порту
lsof -i :8081

# Посмотреть логи через journalctl (если используется systemd)
journalctl -u async-go-service -f
```

### 6. Использование screen или tmux

```bash
# Запуск в screen
screen -S async-service
cd AsyncGoService
go run main.go
# Нажмите Ctrl+A, затем D для отсоединения

# Подключение обратно
screen -r async-service

# Или с tmux
tmux new -s async-service
cd AsyncGoService
go run main.go
# Нажмите Ctrl+B, затем D для отсоединения

# Подключение обратно
tmux attach -t async-service
```

### 7. Сборка и запуск бинарника

```bash
cd AsyncGoService
go build -o async-service main.go
./async-service > app.log 2>&1 &

# Просмотр логов
tail -f app.log
```

### 8. Использование logrotate для ротации логов

Создайте файл `/etc/logrotate.d/async-go-service`:
```
/path/to/AsyncGoService/app.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 user group
}
```

## Полезные команды

```bash
# Просмотр последних 100 строк логов
tail -n 100 app.log

# Поиск в логах
grep "error" app.log
grep "Task" app.log

# Просмотр логов с временными метками (если они есть)
grep "2025-12-06" app.log

# Подсчет строк в логах
wc -l app.log

# Мониторинг логов в реальном времени с фильтрацией
tail -f app.log | grep --line-buffered "ERROR\|WARN"
```

## Настройка уровня логирования

В текущей реализации используется стандартный пакет `log`. Для более продвинутого логирования можно использовать:

- `logrus` - структурированное логирование
- `zap` - быстрый логгер от Uber
- `zerolog` - простой и быстрый логгер

Пример с logrus:
```go
import "github.com/sirupsen/logrus"

logrus.SetLevel(logrus.DebugLevel)
logrus.WithFields(logrus.Fields{
    "task_id": task.ID,
    "status": task.Status,
}).Info("Task processed")
```
