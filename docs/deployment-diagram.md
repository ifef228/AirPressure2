# Deployment Диаграмма - Atmospheric Temperature Calculator

## Общая архитектура системы

```
┌─────────────────────────────────────────────────────────────────────┐
│                        КЛИЕНТСКАЯ СТОРОНА                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          Устройство пользователя (Browser/Mobile)          │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────┐   │    │
│  │  │      PWA Application (React + TypeScript)           │   │    │
│  │  │                                                      │   │    │
│  │  │  Компоненты:                                        │   │    │
│  │  │  - Home (Главная страница)                          │   │    │
│  │  │  - GasesList (Список газов с фильтрацией)          │   │    │
│  │  │  - GasDetail (Детальная информация о газе)         │   │    │
│  │  │  - Navbar (Навигация с адаптивностью)              │   │    │
│  │  │                                                      │   │    │
│  │  │  Redux Store:                                       │   │    │
│  │  │  - Filters State (nameFilter, formulaFilter)       │   │    │
│  │  │                                                      │   │    │
│  │  │  Service Worker:                                    │   │    │
│  │  │  - Кеширование ресурсов                            │   │    │
│  │  │  - Offline режим                                    │   │    │
│  │  │  - Push уведомления (опционально)                  │   │    │
│  │  └────────────────────────────────────────────────────┘   │    │
│  │                           │                                 │    │
│  │                           │ HTTPS                           │    │
│  │                           ▼                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS/HTTP
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT СРЕДЫ                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          GitHub Pages (Static Hosting)                      │    │
│  │          URL: https://[username].github.io/rip-rt5-51-...  │    │
│  │                                                              │    │
│  │  Компоненты:                                                │    │
│  │  - index.html                                               │    │
│  │  - JavaScript бандлы (React App)                           │    │
│  │  - CSS файлы (Bootstrap + Custom)                          │    │
│  │  - manifest.json (PWA конфигурация)                        │    │
│  │  - service-worker.js                                        │    │
│  │  - Статические ресурсы (изображения, иконки)              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP REST API
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        СЕРВЕРНАЯ СТОРОНА                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          Web Server (Backend API)                           │    │
│  │          Технология: Kotlin + Spring Boot                   │    │
│  │          Порт: 8080                                          │    │
│  │          Протокол: HTTP/HTTPS                               │    │
│  │                                                              │    │
│  │  Endpoints:                                                  │    │
│  │  - GET  /api/gases (список газов с пагинацией)             │    │
│  │  - GET  /api/gases/{id} (детали газа)                      │    │
│  │  - GET  /api/gases?name=...&formula=... (фильтрация)      │    │
│  │                                                              │    │
│  │  Компоненты:                                                │    │
│  │  - GasController (REST контроллер)                         │    │
│  │  - GasService (бизнес-логика)                              │    │
│  │  - GasRepository (доступ к данным)                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                           │                                          │
│                           │ JDBC/JPA                                 │
│                           ▼                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          Database (PostgreSQL)                              │    │
│  │          Порт: 5432                                          │    │
│  │                                                              │    │
│  │  Таблицы:                                                    │    │
│  │  - gases (id, name, formula, description, image_url)        │    │
│  │  - orders (заявки на расчеты)                              │    │
│  │  - calculations (результаты расчетов)                      │    │
│  │                                                              │    │
│  │  Индексы:                                                    │    │
│  │  - idx_gases_name (для быстрого поиска)                    │    │
│  │  - idx_gases_formula (для фильтрации)                      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

## Протоколы и API

### Frontend ↔ Backend
- **Протокол:** HTTP/HTTPS REST API
- **Формат данных:** JSON
- **Методы:** GET, POST, PUT, DELETE
- **Аутентификация:** JWT токены (опционально)

### Backend ↔ Database
- **Протокол:** JDBC/TCP
- **ORM:** Spring Data JPA / Hibernate
- **Пул соединений:** HikariCP

## Детали развертывания

### GitHub Pages (Production Frontend)
- **Хостинг:** GitHub Pages
- **URL:** `https://[username].github.io/rip-rt5-51-fyodirov/`
- **Деплой:** Через `gh-pages` npm пакет
- **Команда:** `npm run deploy`
- **Branch:** `gh-pages` (автоматически создается)

### Local Development
- **Frontend:** Vite Dev Server (localhost:5173)
- **Backend:** Spring Boot (localhost:8080)
- **Database:** Docker PostgreSQL (localhost:5432)

### Docker Infrastructure (Опционально)
```yaml
services:
  postgres:
    image: postgres:15
    ports: 5432:5432
    volumes: ./data:/var/lib/postgresql/data

  backend:
    build: ./gas
    ports: 8080:8080
    depends_on: postgres

  frontend:
    build: ./atmosphere-calculator
    ports: 80:80
```

## Сетевая архитектура

```
                    Internet
                       │
                       │ HTTPS (443)
                       ▼
            ┌────────────────────┐
            │   GitHub Pages     │
            │   (Static Files)   │
            └────────────────────┘
                       │
                       │ API Requests
                       │ HTTPS/HTTP
                       ▼
            ┌────────────────────┐
            │   Backend Server   │
            │   (Spring Boot)    │
            │   Port: 8080       │
            └────────────────────┘
                       │
                       │ JDBC
                       │ Port: 5432
                       ▼
            ┌────────────────────┐
            │   PostgreSQL DB    │
            └────────────────────┘
```

## Спецификации

### Брейкпоинты адаптивности:
- **Desktop:** > 1200px (4 колонки карточек)
- **Tablet:** 768px - 1199px (2-3 колонки)
- **Mobile:** < 768px (1 колонка, бургер-меню)
- **Small Mobile:** < 576px (оптимизированный UI)

### Размеры карточек газов:
- **Desktop:** 100% ширины контейнера (1 карточка в ряд)
- **Tablet:** 100% ширины (адаптивная высота)
- **Mobile:** 100% ширины, уменьшенная высота (150-180px)

### PWA требования:
- Manifest.json с иконками 192x192 и 512x512
- Service Worker для кеширования
- Offline режим работы
- Installable на рабочий стол

## Безопасность

1. **HTTPS:** Обязателен для PWA и Service Workers
2. **CORS:** Настроен на бэкенде для фронтенда
3. **Input Validation:** Валидация всех пользовательских данных
4. **SQL Injection Protection:** Использование PreparedStatement/JPA
5. **XSS Protection:** React автоматически экранирует данные

## Мониторинг и логирование

- **Frontend:** Browser DevTools, Redux DevTools
- **Backend:** Spring Boot Actuator, Logback
- **Database:** PostgreSQL logs
- **Service Worker:** Console logs для отладки кеширования
