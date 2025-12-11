import { Gas, PaginatedResponse, ApiResponse, GasesFilter } from '../types';
import { getMockGasesPaginated, getMockGasById } from '../data/mockGasesData';
import { API_BASE_URL } from '../lib/apiConfig';

// Флаг для определения доступности бэкенда
let backendAvailable = true;

/**
 * Получить список газов с фильтрацией и пагинацией
 */
export const getGases = async (filters: GasesFilter = {}): Promise<PaginatedResponse<Gas>> => {
  const { name = '', formula = '', page = 0, size = 20 } = filters;

  try {
    // Формируем query параметры
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (formula) params.append('formula', formula);
    params.append('page', page.toString());
    params.append('size', size.toString());

    // Формируем URL
    const url = `${API_BASE_URL}/gases?${params.toString()}`;
    console.log('[Gases API] Fetching URL:', url);
    console.log('[Gases API] Full URL will be:', window.location.origin + url);

    // Добавляем timeout для запроса (5 секунд)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[Gases API] Response status:', response.status, response.statusText);
    console.log('[Gases API] Response URL:', response.url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<PaginatedResponse<Gas>> = await response.json();

    if (apiResponse.success && apiResponse.data) {
      backendAvailable = true;
      return apiResponse.data;
    } else {
      throw new Error(apiResponse.message || 'Failed to fetch gases');
    }

  } catch (error) {
    // Если запрос был отменен из-за timeout или другая ошибка сети
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Request timeout, using mock data');
    } else {
      console.warn('Backend unavailable, using mock data:', error);
    }
    backendAvailable = false;

    // Возвращаем mock данные
    return getMockGasesPaginated(page, size, name);
  }
};

/**
 * Получить газ по ID
 */
export const getGasById = async (id: number): Promise<Gas | null> => {
  try {
    // Формируем URL - API_BASE_URL уже содержит полный URL к бэкенду
    const url = `${API_BASE_URL}/gases/${id}`;
    console.log('Fetching gas by id:', url);

    // Добавляем timeout для запроса (5 секунд)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse<Gas> = await response.json();

    if (apiResponse.success && apiResponse.data) {
      backendAvailable = true;
      return apiResponse.data;
    } else {
      throw new Error(apiResponse.message || 'Failed to fetch gas');
    }

  } catch (error) {
    // Если запрос был отменен из-за timeout или другая ошибка сети
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Request timeout, using mock data');
    } else {
      console.warn('Backend unavailable, using mock data:', error);
    }
    backendAvailable = false;

    // Возвращаем mock данные
    return getMockGasById(id) || null;
  }
};

/**
 * Проверить доступность бэкенда
 */
export const isBackendAvailable = (): boolean => {
  return backendAvailable;
};
