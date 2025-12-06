# Диагностика белого экрана в Tauri

## Проблема
Tauri показывает белый экран, хотя в DOM есть header, но нет body и ничего не рисуется.

## Что было добавлено для диагностики

### 1. Расширенное логирование
- В `main.tsx` добавлено логирование состояния root элемента, body и стилей
- В `App.tsx` добавлено логирование окружения и computed styles

### 2. Визуальный индикатор
- Добавлен красный баннер вверху экрана в Tauri режиме: "Tauri Mode Active - App Rendered"
- Если видите этот баннер, значит React рендерится

### 3. Отключена блокировка DevTools в dev режиме
- В dev режиме DevTools доступны для отладки
- В production режиме блокировка работает как раньше

## Шаги диагностики

### 1. Откройте консоль в Tauri

В dev режиме DevTools должны быть доступны. Если нет:
- Проверьте `tauri.conf.json`: `"devtools": true`
- Попробуйте Cmd+Option+I (Mac) или F12

### 2. Проверьте логи в консоли

Должны быть следующие логи:
```
[Main] Starting application...
[Main] Tauri detected: true
[Main] Root element found: <div id="root">
[Main] App rendered successfully
[App] Rendering App component
[App] Environment: { isTauri: true, ... }
```

### 3. Проверьте ошибки

Если есть ошибки в консоли:
- Ошибки импорта модулей
- Ошибки рендеринга компонентов
- CORS ошибки при запросах к API

### 4. Проверьте DOM

В DevTools → Elements:
- Проверьте, что `#root` существует
- Проверьте, что внутри `#root` есть контент
- Проверьте computed styles для `#root`:
  - `display: flex`
  - `min-height: 100vh`
  - `width: 100%`

### 5. Проверьте стили

В DevTools → Elements → Computed:
- Проверьте стили для `html`, `body`, `#root`
- Убедитесь, что `height` и `min-height` установлены правильно
- Проверьте, что Bootstrap CSS загружен

### 6. Проверьте Network

В DevTools → Network:
- Убедитесь, что все CSS файлы загружены (200 статус)
- Убедитесь, что JavaScript файлы загружены
- Проверьте, нет ли ошибок загрузки ресурсов

## Возможные причины и решения

### 1. Стили не применяются

**Симптомы**: Контент есть в DOM, но не виден

**Решение**:
- Проверьте, что все CSS файлы загружены
- Проверьте computed styles
- Убедитесь, что нет конфликтов стилей

### 2. React не монтируется

**Симптомы**: В DOM только `<div id="root"></div>`, без контента

**Решение**:
- Проверьте логи: `[Main] App rendered successfully`
- Проверьте ошибки в консоли
- Убедитесь, что все импорты работают

### 3. Router не работает

**Симптомы**: Header есть, но контент страницы не отображается

**Решение**:
- Проверьте basename в логах: должно быть `''` для Tauri
- Проверьте текущий route: `window.location.pathname`
- Проверьте, что Routes рендерится

### 4. Компоненты не рендерятся

**Симптомы**: Структура есть, но компоненты пустые

**Решение**:
- Проверьте ошибки в консоли
- Проверьте, что все зависимости установлены
- Убедитесь, что store инициализирован правильно

## Команды для проверки

### Перезапуск Tauri

```bash
# Остановите текущий процесс (Ctrl+C)
# Очистите кеш
rm -rf node_modules/.vite
# Перезапустите
npm run tauri
```

### Проверка сборки

```bash
# Проверьте, что сборка работает
npm run build:tauri:only

# Проверьте dist папку
ls -la dist/
```

### Проверка зависимостей

```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

## Что проверить в консоли

Выполните в консоли браузера Tauri:

```javascript
// Проверка root элемента
const root = document.getElementById('root');
console.log('Root:', root);
console.log('Root children:', root?.children.length);
console.log('Root innerHTML:', root?.innerHTML.substring(0, 200));

// Проверка стилей
const rootStyle = window.getComputedStyle(root);
console.log('Root styles:', {
  display: rootStyle.display,
  minHeight: rootStyle.minHeight,
  height: rootStyle.height,
  width: rootStyle.width,
});

// Проверка body
console.log('Body:', document.body);
console.log('Body height:', document.body?.offsetHeight);

// Проверка React
console.log('React root:', root?._reactRootContainer);
```

## Если ничего не помогает

1. Создайте минимальный тестовый компонент
2. Проверьте, что базовый React рендерится
3. Постепенно добавляйте компоненты
4. Проверьте версии зависимостей

## Контакты для помощи

Если проблема не решается, соберите следующую информацию:
- Вывод консоли (все логи)
- Скриншот DevTools → Elements
- Скриншот DevTools → Console
- Версии: `node -v`, `npm -v`
- Вывод: `npm list react react-dom`
