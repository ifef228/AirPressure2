/**
 * Конфигурация API для разных окружений
 *
 * Определяет базовый URL API в зависимости от окружения:
 * - Tauri: http://localhost:8080/api (полный URL, так как нет прокси)
 * - Локальная разработка (браузер): /api (через прокси Vite)
 * - GitHub Pages: настраиваемый URL (через переменную окружения или localStorage)
 */

// Определяем окружение
const isTauri = !!(window as any).__TAURI__;
const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '';

/**
 * Получить базовый URL API
 */
export function getApiBaseUrl(): string {
  // Для Tauri используем полный URL к бэкенду
  if (isTauri) {
    // Можно использовать переменную окружения или значение по умолчанию
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${backendUrl}/api`;
  }

  // Для локальной разработки (браузер) используем относительный путь через прокси Vite
  if (isLocalhost) {
    return '/api';
  }

  // Для GitHub Pages используем настраиваемый URL
  // Сначала проверяем переменную окружения
  if (import.meta.env.VITE_API_BASE_URL) {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  }

  // Затем проверяем localStorage (для ручной настройки)
  const savedBackendUrl = localStorage.getItem('backend_url');
  if (savedBackendUrl) {
    // Если сохранен полный URL, используем его
    if (savedBackendUrl.startsWith('http')) {
      return `${savedBackendUrl}/api`;
    }
    return savedBackendUrl;
  }

  // По умолчанию для GitHub Pages используем относительный путь
  // (будет работать только если настроен прокси или CORS)
  return '/AirPressure2/api';
}

// Экспортируем базовый URL
export const API_BASE_URL = getApiBaseUrl();

// Логирование для диагностики
console.log('[API Config] Environment:', {
  isTauri,
  isLocalhost,
  hostname: window.location.hostname,
  href: window.location.href,
  apiBaseUrl: API_BASE_URL,
  viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL,
});
