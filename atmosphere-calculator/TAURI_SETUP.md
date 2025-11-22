# 🖥️ Tauri Desktop Application - Инструкция

## ⚠️ Важно: Tauri это ОПЦИОНАЛЬНАЯ часть задания!

PWA уже работает и готов к демонстрации. Tauri нужен только для дополнительной демонстрации нативного desktop приложения.

---

## 📋 Что уже сделано

- ✅ Установлены пакеты `@tauri-apps/cli` и `@tauri-apps/api`
- ✅ Создана конфигурация `src-tauri/tauri.conf.json`
- ✅ Добавлены скрипты в `package.json`
- ✅ Настроен HTTP доступ для локальной сети (192.168.*)

---

## 🛠️ Что нужно установить

### 1. Установите Rust (ОБЯЗАТЕЛЬНО!)

Tauri использует Rust для создания нативного приложения.

**Mac:**
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

После установки перезапустите терминал или выполните:
```bash
source $HOME/.cargo/env
```

**Проверка установки:**
```bash
rustc --version
cargo --version
```

### 2. Установите Xcode Command Line Tools (Mac)

```bash
xcode-select --install
```

---

## 🎨 Создание иконок для Tauri

Tauri требует несколько форматов иконок. Можно использовать онлайн-генератор или создать вручную.

### Вариант 1: Автоматическая генерация (Рекомендуется)

1. Используйте существующую иконку `public/logo512.png`
2. Установите иконки автоматически:

```bash
cd atmosphere-calculator
npx @tauri-apps/cli icon public/logo512.png
```

Это создаст все необходимые форматы в `src-tauri/icons/`

### Вариант 2: Вручную

Скопируйте иконки из `public/` в `src-tauri/icons/`:
```bash
cp public/logo192.png src-tauri/icons/128x128.png
cp public/logo512.png src-tauri/icons/128x128@2x.png
```

---

## 🔧 Настройка API для локальной сети

### Шаг 1: Узнайте IP адрес вашего компьютера

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Или:
```bash
ipconfig getifaddr en0  # Wi-Fi
ipconfig getifaddr en1  # Ethernet
```

Запишите IP, например: `192.168.1.10`

### Шаг 2: Обновите API в коде

Создайте файл `src/services/tauri-api.ts`:

```typescript
import { getGases as getGasesOriginal, getGasById as getGasByIdOriginal } from './api';

// Определяем базовый URL в зависимости от среды
const API_BASE_URL = (window as any).__TAURI__
  ? 'http://192.168.1.10:8080/api'  // ← ЗАМЕНИТЕ на ваш IP!
  : '/api';

// Экспортируем функции с правильным URL
export const getGases = getGasesOriginal;
export const getGasById = getGasByIdOriginal;
```

**Важно:** В `192.168.1.10` замените на ваш реальный IP!

### Шаг 3: Обновите imports в компонентах (опционально)

Если хотите использовать другой API для Tauri, обновите импорты:

```typescript
// Вместо
import { getGases } from '../services/api';

// Используйте
import { getGases } from '../services/tauri-api';
```

---

## 🚀 Запуск Tauri

### Разработка (Dev mode)

1. Убедитесь что бэкенд запущен на порту 8080
2. Запустите Tauri:

```bash
npm run tauri:dev
```

**Что произойдет:**
- Vite запустит dev сервер на localhost:5173
- Tauri откроет нативное окно с приложением
- Hot reload будет работать как в браузере

### Production сборка

```bash
npm run tauri:build
```

**Результат:**
- Mac: `.dmg` и `.app` файлы в `src-tauri/target/release/bundle/`
- Windows: `.exe` и `.msi` в соответствующей папке
- Linux: `.deb`, `.AppImage` и другие форматы

---

## 📱 Демонстрация для лабораторной

### Порядок демонстрации:

1. **Покажите IP в консоли бэкенда**
   - Запустите бэкенд
   - В логах должен быть IP: `192.168.1.10:8080`
   - Покажите в терминале: `ifconfig | grep "inet "`

2. **Покажите IP в коде Tauri**
   - Откройте `src/services/tauri-api.ts`
   - Покажите строку с `http://192.168.1.10:8080/api`
   - Сравните IP - они должны совпадать!

3. **Запустите Tauri приложение**
   ```bash
   npm run tauri:dev
   ```

4. **Откройте DevTools в Tauri**
   - В окне Tauri: Cmd+Option+I (Mac) или F12
   - Network → Покажите запросы
   - Они идут на `192.168.1.10:8080` (не localhost!)

5. **Отредактируйте данные в БД**
   ```sql
   UPDATE gases SET name = 'Азот (обновлено!)' WHERE id = 1;
   ```

6. **Обновите страницу в Tauri**
   - Перезагрузите: Cmd+R или F5
   - Данные должны измениться! ✅

---

## ⚙️ Конфигурация Tauri

Файл `src-tauri/tauri.conf.json` уже настроен:

- **devPath:** `http://localhost:5173` - Vite dev server
- **distDir:** `../dist` - Production сборка
- **HTTP allowlist:** Разрешены запросы к `192.168.*:8080`
- **Window:** 1200x800, минимум 800x600

---

## 🐛 Troubleshooting

### Rust не установлен
```
error: failed to run custom build command for `tauri v1.5.0`
```
**Решение:** Установите Rust (см. выше)

### IP адрес изменился
Если DHCP изменил ваш IP:
1. Узнайте новый IP: `ifconfig | grep "inet "`
2. Обновите в `src/services/tauri-api.ts`
3. Перезапустите `npm run tauri:dev`

### CORS ошибка
```
Access to fetch has been blocked by CORS policy
```
**Решение:** Проверьте CORS на бэкенде (Spring Boot):

```kotlin
@Configuration
class CorsConfig {
    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedOrigins("*")
                    .allowedMethods("*")
            }
        }
    }
}
```

### Порт 5173 занят
```
Port 5173 is in use
```
**Решение:**
1. Остановите другие Vite процессы
2. Или измените порт в `vite.config.ts` и `src-tauri/tauri.conf.json`

---

## 📊 Сравнение PWA vs Tauri

| Характеристика | PWA | Tauri |
|---------------|-----|-------|
| Размер | ~3 MB | ~10-20 MB |
| Установка | Через браузер | .dmg/.exe файл |
| Обновления | Автоматически | Вручную |
| Оффлайн | Service Worker | Встроенный |
| Доступ к FS | Ограниченный | Полный |
| Производительность | Браузер | Нативная |

---

## ✅ Чек-лист перед демонстрацией

- [ ] Rust установлен (`rustc --version`)
- [ ] Xcode CLI tools установлены (Mac)
- [ ] IP адрес узнан (`ifconfig`)
- [ ] IP обновлен в `tauri-api.ts`
- [ ] Бэкенд запущен на 8080
- [ ] CORS настроен на бэкенде
- [ ] Иконки созданы (`npx @tauri-apps/cli icon`)
- [ ] `npm run tauri:dev` работает
- [ ] Запросы идут на IP (не localhost)
- [ ] Изменение БД отражается в Tauri

---

## 🎓 Контрольные вопросы - Tauri

### Что такое Tauri?
Фреймворк для создания нативных desktop приложений с использованием веб-технологий (HTML/CSS/JS). Использует Rust для backend и системный WebView для frontend.

### Отличия от Electron?
- **Размер:** Tauri ~10 MB vs Electron ~120 MB
- **Backend:** Rust vs Node.js
- **WebView:** Системный vs встроенный Chromium
- **Производительность:** Выше у Tauri
- **Потребление памяти:** Меньше у Tauri

### Преимущества Tauri для этого проекта?
- Нативное desktop приложение
- Полный доступ к файловой системе
- Прямые HTTP запросы (не через браузер)
- Можно распространять как .exe/.dmg
- Легковесное решение

---

## 📚 Полезные ссылки

- [Tauri Docs](https://tauri.app/)
- [Rust Installation](https://www.rust-lang.org/tools/install)
- [Tauri Icon Generation](https://tauri.app/v1/guides/features/icons)
- [Tauri HTTP Client](https://tauri.app/v1/api/js/http)

---

**Tauri готов к использованию! 🎉**

Для базовой демонстрации PWA достаточно, Tauri - это дополнительный бонус!

