# 🚀 Инструкция по деплою на GitHub Pages с нуля

## 📋 Шаг 1: Подготовка репозитория на GitHub

1. Создайте новый репозиторий на GitHub:
   - Перейдите на https://github.com/new
   - Название репозитория: `airPressure2` (или любое другое)
   - Сделайте репозиторий **публичным** (Public)
   - НЕ добавляйте README, .gitignore или лицензию (если репозиторий пустой)

2. Запомните название репозитория - оно понадобится для base path

## 📋 Шаг 2: Настройка base path в проекте

1. Откройте файл `vite.config.ts` и установите base path:

```typescript
base: "/название-репозитория/",
```

Например, если репозиторий называется `airPressure2`:
```typescript
base: "/airPressure2/",
```

2. Откройте файл `src/App.tsx` и установите basename:

```typescript
const basename = '/название-репозитория';
```

Например:
```typescript
const basename = '/airPressure2';
```

3. Откройте файл `src/services/api.ts` и установите API_BASE_URL:

```typescript
const API_BASE_URL = '/название-репозитория/api';
```

Например:
```typescript
const API_BASE_URL = '/airPressure2/api';
```

4. Откройте файл `src/main.tsx` и установите путь Service Worker:

```typescript
.register('/название-репозитория/service-worker.js', { scope: '/название-репозитория/' })
```

Например:
```typescript
.register('/airPressure2/service-worker.js', { scope: '/airPressure2/' })
```

## 📋 Шаг 3: Подключение к GitHub репозиторию

1. Инициализируйте git (если еще не сделано):

```bash
cd /Users/ifef/Desktop/mgtu/5сем/рип/airPressure2
git init
```

2. Добавьте remote репозиторий:

```bash
git remote add origin https://github.com/ваш-username/название-репозитория.git
```

Например:
```bash
git remote add origin https://github.com/ifef228/airPressure2.git
```

3. Проверьте remote:

```bash
git remote -v
```

Должно показать:
```
origin  https://github.com/ваш-username/название-репозитория.git (fetch)
origin  https://github.com/ваш-username/название-репозитория.git (push)
```

## 📋 Шаг 4: Сборка проекта

1. Перейдите в папку проекта:

```bash
cd atmosphere-calculator
```

2. Установите зависимости (если еще не установлены):

```bash
npm install
```

3. Соберите проект:

```bash
npm run build
```

Проверьте, что папка `dist/` создана и содержит файлы:
- `index.html`
- `404.html`
- `.nojekyll`
- `assets/` (с JS и CSS файлами)
- `service-worker.js`

## 📋 Шаг 5: Деплой на GitHub Pages

1. Убедитесь, что установлен `gh-pages`:

```bash
npm list gh-pages
```

Если не установлен:
```bash
npm install --save-dev gh-pages
```

2. Задеплойте проект:

```bash
npm run deploy
```

Это выполнит:
- `npm run build` (сборка проекта)
- `gh-pages -d dist` (деплой папки dist в ветку gh-pages)

3. Дождитесь завершения. Должно быть сообщение:
```
Published
```

## 📋 Шаг 6: Настройка GitHub Pages

1. Перейдите на GitHub в ваш репозиторий
2. Откройте **Settings** → **Pages**
3. В разделе **Source** выберите:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Нажмите **Save**

## 📋 Шаг 7: Проверка деплоя

1. Подождите 1-2 минуты (GitHub Pages обновляется с задержкой)

2. Откройте ваш сайт:
   ```
   https://ваш-username.github.io/название-репозитория/
   ```

   Например:
   ```
   https://ifef228.github.io/airPressure2/
   ```

3. Проверьте:
   - Страница загружается
   - Навигация работает
   - API запросы идут на правильный путь (в консоли браузера F12)

## 🔄 Обновление после изменений

Когда нужно обновить сайт после изменений в коде:

```bash
cd atmosphere-calculator
npm run deploy
```

Это автоматически:
1. Соберет проект
2. Задеплоит изменения на GitHub Pages

## ⚠️ Важные моменты

1. **Base path должен совпадать с названием репозитория**
   - Репозиторий: `airPressure2` → base path: `/airPressure2/`

2. **Все пути должны использовать base path:**
   - API: `/airPressure2/api`
   - Service Worker: `/airPressure2/service-worker.js`
   - React Router: `basename="/airPressure2"`

3. **Файл `404.html` обязателен** для работы SPA на GitHub Pages

4. **Файл `.nojekyll` обязателен** для отключения Jekyll

## 🐛 Troubleshooting

### Проблема: 404 при переходе на страницы

**Решение:** Убедитесь, что:
- Файл `404.html` есть в `dist/`
- Файл `.nojekyll` есть в `dist/`
- Base path правильный во всех файлах

### Проблема: API запросы идут на неправильный путь

**Решение:** Проверьте:
- `src/services/api.ts` - должен быть `/название-репозитория/api`
- Пересоберите проект: `npm run build`
- Задеплойте: `npm run deploy`

### Проблема: Стили не загружаются

**Решение:**
- Очистите кэш браузера (Ctrl+Shift+R)
- Проверьте, что base path правильный в `vite.config.ts`

### Проблема: "Repository not found"

**Решение:**
- Проверьте, что репозиторий существует на GitHub
- Проверьте права доступа к репозиторию
- Проверьте правильность URL в `git remote -v`

## ✅ Чек-лист перед деплоем

- [ ] Репозиторий создан на GitHub
- [ ] Base path настроен в `vite.config.ts`
- [ ] Basename настроен в `src/App.tsx`
- [ ] API_BASE_URL настроен в `src/services/api.ts`
- [ ] Service Worker путь настроен в `src/main.tsx`
- [ ] Git remote подключен (`git remote -v`)
- [ ] Проект собран (`npm run build`)
- [ ] В `dist/` есть `404.html` и `.nojekyll`
- [ ] Деплой выполнен (`npm run deploy`)
- [ ] GitHub Pages настроен (Settings → Pages → gh-pages branch)

## 📝 Пример полной настройки для репозитория `airPressure2`

### vite.config.ts
```typescript
base: "/airPressure2/",
```

### src/App.tsx
```typescript
const basename = '/airPressure2';
```

### src/services/api.ts
```typescript
const API_BASE_URL = '/airPressure2/api';
```

### src/main.tsx
```typescript
.register('/airPressure2/service-worker.js', { scope: '/airPressure2/' })
```

### Результат
Сайт будет доступен по адресу:
```
https://ifef228.github.io/airPressure2/
```

---

**Готово! Теперь ваш проект задеплоен на GitHub Pages! 🎉**
