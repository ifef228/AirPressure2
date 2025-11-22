# 🚀 Инструкция по деплою и настройке PWA

## ✅ Что уже сделано в проекте

### 1. Redux Toolkit ✓
- Установлен `@reduxjs/toolkit` и `react-redux`
- Создан store с фильтрами газов (`nameFilter`, `formulaFilter`)
- Интегрирован в компонент `GasesList` для сохранения фильтров при навигации
- Используйте **Redux DevTools** в Chrome для отладки

### 2. Адаптивность ✓
- Добавлены адаптивные стили для всех трех страниц (Home, GasesList, GasDetail)
- Брейкпоинты: 1200px, 992px, 768px, 576px
- Навигация использует встроенное бургер-меню Bootstrap
- Карточки газов адаптируются под размер экрана
- Фильтры на мобильных устройствах располагаются вертикально

### 3. PWA ✓
- Создан `manifest.json` с метаданными приложения
- Реализован Service Worker для кеширования и offline режима
- Зарегистрирован Service Worker в `main.tsx`
- Добавлены мета-теги в `index.html`

### 4. GitHub Pages ✓
- Настроен `vite.config.ts` с правильным base path
- Обновлен `App.tsx` с basename для Router
- Добавлены скрипты `deploy` в `package.json`
- Установлен пакет `gh-pages`

---

## 📋 Что нужно сделать вручную

### Шаг 1: Создать PNG иконки для PWA

**ОБЯЗАТЕЛЬНО!** PWA требует наличия PNG иконок.

#### Вариант А: Онлайн генератор (Рекомендуется)
1. Откройте https://realfavicongenerator.net/
2. Загрузите `atmosphere-calculator/public/logo.svg`
3. Настройте параметры:
   - iOS: да
   - Android: да
   - Размеры: 192x192 и 512x512
4. Скачайте архив с иконками
5. Поместите файлы в `atmosphere-calculator/public/`:
   - `logo192.png`
   - `logo512.png`

#### Вариант Б: Создать вручную
1. Откройте любой графический редактор (Photoshop, GIMP, Figma)
2. Создайте изображение 512x512px
3. Используйте желтый фон #fce000
4. Добавьте эмодзи 🌡️ или текст "ATC"
5. Экспортируйте как PNG в двух размерах:
   - 192x192px → `logo192.png`
   - 512x512px → `logo512.png`
6. Поместите файлы в `atmosphere-calculator/public/`

### Шаг 2: Обновить package.json

Откройте `atmosphere-calculator/package.json` и замените:
```json
"homepage": "https://[YOUR-GITHUB-USERNAME].github.io/rip-rt5-51-fyodirov",
```

На:
```json
"homepage": "https://ВАШЕ-ИМЯ-ПОЛЬЗОВАТЕЛЯ.github.io/rip-rt5-51-fyodirov",
```

Где `ВАШЕ-ИМЯ-ПОЛЬЗОВАТЕЛЯ` - ваш username на GitHub.

### Шаг 3: Деплой на GitHub Pages

```bash
cd atmosphere-calculator

# Сборка и деплой
npm run build
npm run deploy
```

**Что произойдет:**
1. Vite соберет production версию в папку `dist/`
2. `gh-pages` создаст ветку `gh-pages` и загрузит туда файлы
3. GitHub автоматически задеплоит приложение

### Шаг 4: Настроить GitHub Pages в репозитории

1. Откройте репозиторий на GitHub
2. Settings → Pages
3. Source: выберите ветку `gh-pages`
4. Нажмите Save
5. Подождите 1-2 минуты

**Ваше приложение будет доступно по адресу:**
```
https://[ваш-username].github.io/rip-rt5-51-fyodirov/
```

### Шаг 5: Проверка PWA

#### На десктопе (Chrome):
1. Откройте ваше приложение на GitHub Pages
2. F12 → Application → Manifest
   - Проверьте, что manifest.json загружен без ошибок
3. Application → Service Workers
   - Должен быть зарегистрирован service worker
4. В адресной строке должна появиться иконка "Установить"
5. Установите PWA

#### На мобильном (Android Chrome):
1. Откройте приложение в Chrome
2. Меню → "Добавить на главный экран"
3. Проверьте работу в offline режиме:
   - Включите airplane mode
   - Откройте PWA с главного экрана
   - Должно работать (закешированные данные)

---

## 🧪 Проверка функционала

### Проверка Redux (Сохранение фильтров)
1. Откройте страницу `/gases`
2. Введите фильтры (например, "Азот" и "N2")
3. Нажмите "Применить"
4. Перейдите на главную страницу `/`
5. Вернитесь на `/gases`
6. **✓ Фильтры должны остаться!**

### Проверка адаптивности
1. Откройте DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Проверьте на разных размерах:
   - iPhone SE (375px) - мобильная версия
   - iPad (768px) - планшет
   - Desktop (1920px) - десктоп

**Что проверить:**
- На мобильном: бургер-меню в Navbar
- Карточки газов адаптируются
- Фильтры на мобильном в колонку
- Все читаемо и кликабельно

### Проверка Service Worker
1. F12 → Console
2. Должно быть сообщение: "Service Worker зарегистрирован"
3. Network → Отключите интернет
4. Обновите страницу (F5)
5. **✓ Страница должна загрузиться из кеша!**

---

## 📊 Deployment диаграмма

Создана подробная диаграмма в файле:
```
/docs/deployment-diagram.md
```

Содержит:
- Архитектуру системы (клиент-сервер-БД)
- Протоколы взаимодействия
- Спецификации брейкпоинтов
- Сетевую архитектуру
- Требования к безопасности

---

## 🔧 Tauri приложение (Дополнительное задание)

### Что такое Tauri?
Tauri - это фреймворк для создания нативных desktop приложений с использованием веб-технологий.

### Установка Tauri

```bash
cd atmosphere-calculator

# Установить Tauri CLI
npm install --save-dev @tauri-apps/cli
npm install @tauri-apps/api

# Инициализация Tauri
npx tauri init
```

**Параметры инициализации:**
- App name: `AtmosphericCalc`
- Window title: `Atmospheric Temperature Calculator`
- Web assets path: `../dist`
- Dev server URL: `http://localhost:5173`
- Dev command: `npm run dev`
- Build command: `npm run build`

### Настройка для локальной сети

В `src-tauri/tauri.conf.json` обновите:
```json
{
  "build": {
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "http": {
        "all": true,
        "request": true,
        "scope": ["http://192.168.*:8080/**"]
      }
    }
  }
}
```

### Подключение к API по IP

В `src/services/api.ts` обновите базовый URL:
```typescript
// Для Tauri используем IP адрес в локальной сети
const API_BASE_URL = window.__TAURI__
  ? 'http://192.168.1.XXX:8080/api'  // Ваш IP
  : '/api';
```

**Как узнать IP:**
```bash
# На Mac/Linux
ifconfig | grep "inet "

# На Windows
ipconfig
```

### Запуск Tauri

```bash
# Разработка
npm run tauri dev

# Сборка
npm run tauri build
```

### Демонстрация для лабораторной

1. Узнайте IP вашего компьютера (например, 192.168.1.10)
2. Запустите бэкенд на порту 8080
3. Обновите `API_BASE_URL` с вашим IP
4. Запустите Tauri приложение
5. Откройте консоль и покажите, что запросы идут на IP (не localhost)
6. Измените данные в БД через SQL
7. Обновите страницу в Tauri - данные должны измениться

---

## 🌐 HTTPS настройка (Опционально)

### Для GitHub Pages
GitHub Pages автоматически предоставляет HTTPS! Ничего делать не нужно.

### Для локального сервера (Dev)

#### Vite HTTPS:
Создайте `vite.config.ts`:
```typescript
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost-cert.pem')
    }
  }
});
```

Создайте сертификаты:
```bash
# Установите mkcert
brew install mkcert  # Mac
# или скачайте с https://github.com/FiloSottile/mkcert

# Создайте сертификаты
mkcert -install
mkcert localhost
```

#### Spring Boot HTTPS:
В `application.yml`:
```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: yourpassword
    key-store-type: PKCS12
```

---

## 📱 Демонстрация на телефоне

### Вариант 1: GitHub Pages (рекомендуется)
1. Задеплойте на GitHub Pages
2. Откройте на телефоне: `https://[user].github.io/rip-rt5-51-fyodirov/`
3. Chrome → Меню → "Добавить на главный экран"

### Вариант 2: Локальная сеть
1. Узнайте IP компьютера (например, 192.168.1.10)
2. Запустите dev сервер: `npm run dev`
3. На телефоне откройте: `http://192.168.1.10:5173`
4. **Внимание:** Service Worker работает только по HTTPS или localhost!

---

## 🎯 Контрольные вопросы

Подготовьтесь к ответам:

### 1. Flux и Redux
- **Flux:** Архитектурный паттерн от Facebook для управления состоянием
- **Redux:** Реализация Flux с тремя принципами:
  - Single source of truth (один store)
  - State is read-only (изменение через actions)
  - Changes via pure functions (reducers)

### 2. Схема Redux
```
Action → Dispatch → Reducer → Store → View
   ↑                                     ↓
   └─────────────────────────────────────┘
```
- **Store:** Хранилище состояния
- **Action:** Объект описывающий изменение `{ type: 'SET_FILTER', payload: 'N2' }`
- **Dispatch:** Функция отправки action
- **Reducer:** Чистая функция `(state, action) => newState`

### 3. Виды нативных приложений
- **PWA:** Веб-приложение с возможностями нативного (Service Worker, offline)
- **Tauri:** Desktop приложение (Rust + WebView)
- **Electron:** Desktop (Node.js + Chromium)
- **React Native:** Мобильное (iOS/Android)
- **Flutter:** Кросс-платформенное (Dart)

### 4. GitHub Pages
- Бесплатный статический хостинг от GitHub
- Поддерживает HTTPS автоматически
- URL: `username.github.io/repository`
- Деплой через gh-pages пакет или GitHub Actions

---

## ✅ Чек-лист перед демонстрацией

- [ ] PNG иконки созданы (logo192.png, logo512.png)
- [ ] package.json обновлен с правильным username
- [ ] Приложение задеплоено на GitHub Pages
- [ ] PWA устанавливается на телефон
- [ ] Redux сохраняет фильтры при навигации
- [ ] Адаптивность работает на всех размерах экрана
- [ ] Service Worker зарегистрирован (проверка в DevTools)
- [ ] Offline режим работает
- [ ] Deployment диаграмма готова
- [ ] (Опционально) Tauri приложение собрано и работает

---

## 🐛 Troubleshooting

### Service Worker не регистрируется
- Проверьте HTTPS (GitHub Pages) или localhost
- Откройте DevTools → Application → Service Workers
- Нажмите "Unregister" и обновите страницу

### PWA не устанавливается
- Проверьте manifest.json (Application → Manifest)
- Убедитесь что иконки существуют (192x192 и 512x512)
- Проверьте start_url в manifest.json

### GitHub Pages показывает 404
- Подождите 2-3 минуты после деплоя
- Проверьте Settings → Pages → Branch должен быть gh-pages
- Проверьте base в vite.config.ts

### Redux не сохраняет состояние
- Откройте Redux DevTools
- Проверьте что Provider обернул App в main.tsx
- Проверьте что используете useAppDispatch и useAppSelector

### Tauri не подключается к API
- Проверьте IP адрес компьютера
- Убедитесь что бэкенд запущен на 8080
- Проверьте CORS настройки на бэкенде
- Проверьте allowlist в tauri.conf.json

---

## 📚 Полезные ссылки

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages](https://pages.github.com/)
- [Tauri Docs](https://tauri.app/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Успехов на защите лабораторной работы! 🎓**
