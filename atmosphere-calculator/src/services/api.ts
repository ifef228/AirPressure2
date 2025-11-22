import { Gas, PaginatedResponse, ApiResponse, GasesFilter } from '../types';
import { getMockGasesPaginated, getMockGasById } from '../data/mockGasesData';

const API_BASE_URL = '/api'; // Проксируется через Vite на http://localhost:8080/api

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

    const url = `${API_BASE_URL}/gases?${params.toString()}`;
    console.log('Fetching gases from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    console.warn('Backend unavailable, using mock data:', error);
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
    const url = `${API_BASE_URL}/gases/${id}`;
    console.log('Fetching gas by id:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
    console.warn('Backend unavailable, using mock data:', error);
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
