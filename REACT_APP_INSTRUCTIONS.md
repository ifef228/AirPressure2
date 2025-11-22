# Инструкции по запуску React приложения

## Шаг 1: Запуск бэкенда

```bash
cd gas
./gradlew bootRun
```

Бэкенд должен быть на `http://localhost:8080`

## Шаг 2: Установка зависимостей фронтенда

```bash
cd atmosphere-calculator
npm install
```

## Шаг 3: Запуск React приложения

```bash
npm run dev
```

Приложение будет на `http://localhost:5173`

## Что реализовано:

✅ Главная страница со статическим описанием
✅ Страница списка газов с фильтрами (название, формула)
✅ Фильтрация на бэкенде
✅ Пагинация
✅ Страница деталей газа
✅ Navbar (React-Bootstrap)
✅ Breadcrumbs (самописный)
✅ Дефолтные изображения для газов
✅ Fetch API с fallback на mock данные
✅ Проксирование через Vite (CORS решен)
✅ React-Bootstrap компоненты
✅ Без Redux и Context

## Структура:

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Breadcrumbs.tsx
│   └── GasCard.tsx
├── pages/
│   ├── Home.tsx
│   ├── GasesList.tsx
│   └── GasDetail.tsx
├── services/
│   └── api.ts
├── data/
│   └── mockGasesData.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```
