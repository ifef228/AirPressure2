# 🚀 Быстрый деплой на GitHub Pages

## ✅ Проверка настроек

Перед деплоем проверьте настройки:

```bash
npm run deploy:check
```

Это покажет:
- Git remote репозиторий
- Название репозитория

## 📦 Деплой

### Обычный деплой:
```bash
npm run deploy
```

Это выполнит:
1. `npm run build` - сборка проекта
2. Копирование `404.html` и `.nojekyll` в `dist/`
3. `gh-pages -d dist` - деплой на GitHub Pages

### Принудительный деплой (если есть проблемы):
```bash
npm run deploy:force
```

## 🔍 После деплоя

1. Подождите 1-2 минуты
2. Откройте сайт: `https://ifef228.github.io/AirPressure2/airPressure/`
3. Проверьте в консоли браузера (F12), что запросы идут на правильный путь

## ⚙️ Текущие настройки

- **Репозиторий:** `AirPressure2`
- **Base path:** `/airPressure/`
- **URL сайта:** `https://ifef228.github.io/AirPressure2/airPressure/`
- **API путь:** `/airPressure/api`

## 📝 Важно

Убедитесь, что в GitHub:
- Settings → Pages → Source: `gh-pages` branch
- Settings → Pages → Folder: `/ (root)`

---

**Готово! Просто выполните `npm run deploy`** 🎉
