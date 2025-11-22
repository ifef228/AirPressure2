# 🔄 Не видите изменения? Очистите кеш!

## Проблема
Браузер кеширует старую версию приложения. Нужно принудительно перезагрузить.

## ✅ Решения

### Вариант 1: Жесткая перезагрузка (Рекомендуется!)

**Chrome/Edge/Brave (Mac):**
```
Cmd + Shift + R
```

**Chrome/Edge/Brave (Windows/Linux):**
```
Ctrl + Shift + R
```
или
```
Ctrl + F5
```

**Safari (Mac):**
```
Cmd + Option + E  (очистить кеш)
затем
Cmd + R  (перезагрузить)
```

### Вариант 2: Очистить кеш через DevTools

1. Откройте DevTools: `Cmd + Option + I` (Mac) или `F12`
2. **Кликните правой кнопкой** на кнопку обновления (↻)
3. Выберите **"Empty Cache and Hard Reload"** (Очистить кеш и жестко перезагрузить)

### Вариант 3: Очистить весь кеш браузера

**Chrome:**
1. Settings (Cmd + ,)
2. Privacy and Security → Clear browsing data
3. Выберите "Cached images and files"
4. Clear data

**Safari:**
1. Safari → Settings → Advanced
2. Поставьте галочку "Show Develop menu"
3. Develop → Empty Caches
4. Перезагрузите страницу

### Вариант 4: Режим инкогнито

Откройте в приватном окне:
- **Chrome:** `Cmd + Shift + N` (Mac) или `Ctrl + Shift + N`
- **Safari:** `Cmd + Shift + N`

## 🌐 Для GitHub Pages

Если смотрите на https://ifef228.github.io/airPressure/:

1. **Жесткая перезагрузка:** `Cmd + Shift + R`
2. **Подождите 2-3 минуты** - GitHub Pages может кешировать на своей стороне
3. Попробуйте добавить `?v=2` в конец URL:
   ```
   https://ifef228.github.io/airPressure/?v=2
   ```

## 📱 На мобильном

**iOS Safari:**
1. Settings → Safari → Clear History and Website Data

**Android Chrome:**
1. Chrome → Settings → Privacy → Clear browsing data
2. Выберите "Cached images and files"

## ✅ Проверка что изменения применились

После очистки кеша вы должны увидеть:

### ✅ Карточки газов:
- Высота **250px** (не 180px)
- **Желтая** кнопка "в корзину" справа
- Показываются **Концентрация** и **Температура**
- Изображение **120x120px** слева

### ✅ Сетка:
- **2 колонки** на десктопе
- **1 колонка** на мобильных

### ✅ Плавающая корзина:
- Желтая круглая кнопка **80x80px** справа внизу
- С красным badge при наличии товаров

## 🐛 Все еще не работает?

Если после всех попыток ничего не меняется:

1. Проверьте что вы на правильном URL:
   - Локально: http://localhost:5173
   - GitHub Pages: https://ifef228.github.io/airPressure/

2. Проверьте консоль браузера (F12 → Console):
   - Есть ли ошибки JavaScript?
   - Загрузились ли все файлы CSS?

3. Перезапустите dev сервер:
   ```bash
   cd atmosphere-calculator
   # Остановите: Ctrl+C
   npm run dev
   ```

4. Пересоберите и задеплойте заново:
   ```bash
   npm run build
   npm run deploy
   ```

---

**В 99% случаев помогает: Cmd + Shift + R!** 🔄
