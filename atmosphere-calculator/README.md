# 🌡️ AtmosphericTempCalc - Калькулятор температуры атмосферы

Профессиональный инструмент для расчета температуры атмосферы на основе концентрации газов.

## 🚀 Технологии

- **Frontend:** React 18 + TypeScript + Vite
- **State Management:** Redux Toolkit
- **UI Framework:** Bootstrap 5 + React Bootstrap
- **Routing:** React Router v6
- **PWA:** Service Worker + Web App Manifest
- **Styling:** Custom CSS + Bootstrap + Адаптивные медиа-запросы
- **Backend:** Kotlin + Spring Boot (см. `/gas`)
- **Database:** PostgreSQL

## ✨ Возможности

### ✅ Реализовано в Лабораторной #6

1. **Redux Toolkit для управления состоянием**
   - Фильтры газов сохраняются при навигации
   - Redux DevTools для отладки
   - Типизированные хуки `useAppDispatch` и `useAppSelector`

2. **Полная адаптивность**
   - 4 брейкпоинта: Desktop, Tablet, Mobile, Small Mobile
   - Адаптивная навигация с бургер-меню (Bootstrap)
   - Responsive карточки газов
   - Адаптивные фильтры и формы

3. **Progressive Web App (PWA)**
   - Service Worker для кеширования
   - Работа в offline режиме
   - Установка на рабочий стол / главный экран
   - Manifest с иконками и метаданными

4. **GitHub Pages Ready**
   - Настроенный деплой через `gh-pages`
   - Правильный routing с basename
   - Production оптимизация

## 📦 Установка и запуск

### Разработка

```bash
# Установка зависимостей
npm install --legacy-peer-deps

# Запуск dev сервера
npm run dev
```

Приложение откроется на http://localhost:5173

### Production сборка

```bash
# Сборка
npm run build

# Предпросмотр production версии
npm run preview
```

### Деплой на GitHub Pages

```bash
# Деплой (сборка + публикация)
npm run deploy
```

**Перед деплоем:** Обновите `homepage` в `package.json` с вашим GitHub username!

## 📱 Структура проекта

```
atmosphere-calculator/
├── public/                    # Статические файлы
│   ├── manifest.json         # PWA манифест
│   ├── service-worker.js     # Service Worker
│   ├── logo.svg              # Векторная иконка
│   └── create_icons_instructions.txt
├── src/
│   ├── components/           # React компоненты
│   │   ├── Navbar.tsx       # Навигация с адаптивностью
│   │   ├── GasCard.tsx      # Карточка газа
│   │   └── Breadcrumbs.tsx  # Хлебные крошки
│   ├── pages/               # Страницы
│   │   ├── Home.tsx         # Главная страница
│   │   ├── GasesList.tsx    # Список газов с фильтрами
│   │   └── GasDetail.tsx    # Детальная страница газа
│   ├── store/               # Redux Store
│   │   ├── store.ts         # Конфигурация store
│   │   ├── filtersSlice.ts  # Slice для фильтров
│   │   └── hooks.ts         # Типизированные хуки
│   ├── services/
│   │   └── api.ts           # API клиент
│   ├── styles/
│   │   ├── yandex-theme.css # Кастомная тема
│   │   └── adaptive.css     # Адаптивные стили
│   ├── types/
│   │   └── index.ts         # TypeScript типы
│   ├── App.tsx              # Корневой компонент
│   └── main.tsx             # Точка входа + SW регистрация
├── docs/
│   └── deployment-diagram.md # Deployment диаграмма
├── DEPLOYMENT_INSTRUCTIONS.md # 📖 Подробная инструкция
├── vite.config.ts            # Vite конфигурация
└── package.json
```

## 🎨 Адаптивность

### Брейкпоинты

| Размер | Описание | Колонки | Особенности |
|--------|----------|---------|-------------|
| > 1200px | Desktop | 1 (full width) | Полный функционал |
| 992-1199px | Tablet Landscape | 1 | Адаптивная навигация |
| 768-991px | Tablet Portrait | 1 | Бургер меню |
| 576-767px | Mobile Large | 1 | Вертикальные фильтры |
| < 576px | Mobile Small | 1 | Оптимизированный UI |

### Адаптивные компоненты

- **Navbar:** Bootstrap бургер-меню на < 992px
- **GasCard:** Уменьшенная высота и размеры на мобильных
- **Фильтры:** Вертикальное расположение на < 576px
- **Кнопки:** На всю ширину на мобильных
- **Типографика:** Адаптивные размеры шрифтов

## 🔧 Redux Store

### Структура состояния

```typescript
{
  filters: {
    nameFilter: string,      // Фильтр по названию
    formulaFilter: string    // Фильтр по формуле
  }
}
```

### Actions

- `setNameFilter(name: string)` - Установить фильтр по названию
- `setFormulaFilter(formula: string)` - Установить фильтр по формуле
- `resetFilters()` - Сбросить все фильтры

### Использование

```typescript
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setNameFilter } from './store/filtersSlice';

// В компоненте
const dispatch = useAppDispatch();
const nameFilter = useAppSelector(state => state.filters.nameFilter);

// Изменение фильтра
dispatch(setNameFilter('Азот'));
```

### Redux DevTools

Установите расширение для Chrome:
[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)

## 📲 PWA Features

### Service Worker

- **Кеширование:** Автоматическое кеширование всех ресурсов
- **Offline:** Работа без интернета
- **Обновления:** Автоматическая проверка обновлений

### Manifest

- **Название:** AtmosphericTempCalc
- **Тема:** Желтый (#fce000)
- **Ориентация:** Portrait-primary
- **Иконки:** 192x192 и 512x512 (требуется создать!)

### Установка PWA

**Desktop (Chrome):**
1. Откройте приложение
2. В адресной строке справа - иконка установки
3. Нажмите "Установить"

**Mobile (Android Chrome):**
1. Откройте приложение
2. Меню → "Добавить на главный экран"

## 🌐 API

### Endpoints

```
GET  /api/gases                    # Список газов
GET  /api/gases?name=...&formula=  # Фильтрация
GET  /api/gases/{id}               # Детали газа
```

### Mock данные

При недоступности бэкенда используются mock данные из `src/data/mockGasesData.ts`

## 🚀 Deployment

### GitHub Pages

1. Обновите `homepage` в `package.json`:
```json
"homepage": "https://YOUR-USERNAME.github.io/rip-rt5-51-fyodirov"
```

2. Деплой:
```bash
npm run deploy
```

3. Настройте GitHub Pages:
   - Settings → Pages
   - Source: `gh-pages` branch
   - Save

Приложение будет доступно по адресу из `homepage`.

### Локальная сеть (для Tauri)

```bash
# Узнайте IP
ifconfig | grep "inet "  # Mac/Linux
ipconfig                  # Windows

# Обновите API_BASE_URL в src/services/api.ts
const API_BASE_URL = 'http://192.168.1.XXX:8080/api';
```

## 📚 Документация

- **[DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)** - Полная инструкция по деплою, PWA, Tauri
- **[/docs/deployment-diagram.md](../docs/deployment-diagram.md)** - Deployment диаграмма системы
- **[/docs/system-requirements/](../docs/system-requirements/)** - Системные требования

## 🐛 Известные проблемы

1. **PNG иконки:** Требуется создать вручную (см. инструкцию)
2. **HTTPS:** Service Worker работает только по HTTPS или localhost
3. **CORS:** Настройте CORS на бэкенде для продакшена

## 📝 TODO

- [ ] Создать PNG иконки 192x192 и 512x512
- [ ] Обновить homepage в package.json
- [ ] Задеплоить на GitHub Pages
- [ ] Проверить PWA на телефоне
- [ ] (Опционально) Настроить Tauri

## 🎓 Контрольные вопросы

### Flux
Архитектурный паттерн для управления состоянием с однонаправленным потоком данных.

### Redux Схема
```
Action → Dispatch → Reducer → Store → View → Action
```

### Виды нативных приложений
- **PWA:** Web с возможностями нативного
- **Tauri:** Desktop (Rust + WebView)
- **Electron:** Desktop (Node + Chromium)
- **React Native:** Mobile (iOS/Android)

### GitHub Pages
Бесплатный статический хостинг от GitHub с автоматическим HTTPS.

## 👨‍💻 Автор

Лабораторная работа #6 - Внедрение адаптивности и развертывание приложения

## 📄 Лицензия

Учебный проект МГТУ им. Н.Э. Баумана

---

**Для подробных инструкций см. [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)**
