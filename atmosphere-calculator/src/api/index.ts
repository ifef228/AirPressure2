import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../lib/apiConfig';

// Создаем инстанс axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Не отправляем cookies для CORS
  timeout: 30000, // 30 секунд таймаут
});

// Интерцептор для добавления токена и логирования запросов
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('[API Request Interceptor] Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Request Interceptor] Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('[API Request Interceptor] No token found in localStorage');
    }

    // Логирование запроса
    const authHeader = typeof config.headers.Authorization === 'string' ? config.headers.Authorization : '';
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasAuthHeader: !!authHeader,
      authHeaderPreview: authHeader ? `${authHeader.substring(0, 30)}...` : 'none',
    });

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов и ошибок
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[API Response]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('[API Error]', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      } : null,
      request: error.request ? {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      } : null,
      config: error.config,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/AirPressure2/login';
    }

    return Promise.reject(error);
  }
);

// Типы для API
export interface RegisterUserRequest {
  login: string; // Изменено с username на login для соответствия бэкенду
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface LoginRequest {
  login: string; // Изменено с username на login для соответствия бэкенду
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  login: string; // Изменено с username на login для соответствия бэкенду
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  role?: string;
}

export interface GasOrder {
  id: number;
  gasId: number;
  gasName: string;
  gasFormula: string;
  gasImageUrl?: string;
  concentration: number;
  temperature: number;
}

export interface Order {
  id: number;
  userId: number;
  tempResult?: number;
  timestamp: string;
  status: 'DRAFT' | 'FORMED' | 'COMPLETED' | 'CANCELLED' | 'DELETED';
  description?: string;
  createdAt?: string;
  formedAt?: string;
  completedAt?: string;
  creatorLogin?: string;
  moderatorLogin?: string;
  gases?: GasOrder[];
  completedResultsCount?: number; // Количество записей м-м с заполненным результатом
  // Для обратной совместимости
  gasId?: number;
  temperature?: number;
  pressure?: number;
  updatedAt?: string;
  gas?: {
    id: number;
    name: string;
    formula: string;
  };
}

export interface CreateOrderRequest {
  gasId: number;
  temperature?: number;
  pressure?: number;
}

export interface UpdateOrderRequest {
  status?: 'DRAFT' | 'FORMED' | 'COMPLETED' | 'CANCELLED' | 'DELETED';
  temperature?: number;
  pressure?: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  gasId: number;
  quantity: number;
  gas?: {
    id: number;
    name: string;
    formula: string;
  };
}

// API методы
export const api = {
  // Авторизация
  auth: {
    register: async (data: RegisterUserRequest): Promise<UserResponse> => {
      try {
        console.log('[API] Register request:', data);
        const response = await axiosInstance.post('/users/register', data);
        console.log('[API] Register response:', response.data);
        // Бэкенд возвращает ApiResponse<UserResponseDto>, нужно извлечь data
        if (response.data && response.data.success && response.data.data) {
          return response.data.data; // Извлекаем UserResponseDto из ApiResponse
        }
        throw new Error(response.data?.message || 'Ошибка регистрации');
      } catch (error: any) {
        console.error('[API] Register error:', error);
        throw error;
      }
    },
    login: async (data: LoginRequest): Promise<LoginResponse> => {
      try {
        console.log('[API] Login request:', data);
        const response = await axiosInstance.post('/users/login', data);
        console.log('[API] Login response:', response.data);
        // Бэкенд возвращает ApiResponse<AuthResponseDto>, нужно извлечь data
        if (response.data && response.data.success && response.data.data) {
          return response.data.data; // Извлекаем AuthResponseDto из ApiResponse
        }
        throw new Error(response.data?.message || 'Ошибка входа');
      } catch (error: any) {
        console.error('[API] Login error:', error);
        throw error;
      }
    },
    getProfile: async (): Promise<UserResponse> => {
      const response = await axiosInstance.get('/users/profile');
      // Бэкенд возвращает ApiResponse<UserResponseDto>, нужно извлечь data
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка загрузки профиля');
    },
    updateProfile: async (data: UpdateUserRequest): Promise<UserResponse> => {
      const response = await axiosInstance.put('/users/profile', data);
      // Бэкенд возвращает ApiResponse<UserResponseDto>, нужно извлечь data
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка обновления профиля');
    },
  },

  // Заявки
  orders: {
    getOrders: async (): Promise<Order[]> => {
      const response = await axiosInstance.get('/gas-orders');
      // Бэкенд возвращает ApiResponse<PagedResponse<OrderResponseDto>>
      if (response.data && response.data.success && response.data.data && response.data.data.items) {
        return response.data.data.items;
      }
      throw new Error(response.data?.message || 'Ошибка загрузки заявок');
    },
    getOrderById: async (id: number): Promise<Order> => {
      const response = await axiosInstance.get(`/gas-orders/${id}`);
      // Бэкенд возвращает ApiResponse<OrderResponseDto>
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка загрузки заявки');
    },
    createOrder: async (data: CreateOrderRequest): Promise<Order> => {
      const response = await axiosInstance.post('/gas-orders', data);
      // Бэкенд возвращает ApiResponse<OrderResponseDto>
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка создания заявки');
    },
    updateOrder: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
      const response = await axiosInstance.put(`/gas-orders/${id}`, data);
      // Бэкенд возвращает ApiResponse<OrderResponseDto>
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка обновления заявки');
    },
    updateGasInOrder: async (orderId: number, gasId: number, data: { concentration?: number; temperature?: number }): Promise<void> => {
      const response = await axiosInstance.put(`/gas-orders/${orderId}/gases/${gasId}`, data);
      // Бэкенд возвращает ApiResponse<String>
      if (response.data && response.data.success) {
        return;
      }
      throw new Error(response.data?.message || 'Ошибка обновления газа в заявке');
    },
    removeGasFromOrder: async (orderId: number, gasId: number): Promise<void> => {
      const response = await axiosInstance.delete(`/gas-orders/${orderId}/gases/${gasId}`);
      // Бэкенд возвращает ApiResponse<String>
      if (response.data && response.data.success) {
        return;
      }
      throw new Error(response.data?.message || 'Ошибка удаления газа из заявки');
    },
    formOrder: async (id: number): Promise<Order> => {
      const response = await axiosInstance.put(`/gas-orders/${id}/form`);
      // Бэкенд возвращает ApiResponse<OrderResponseDto>
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка формирования заявки');
    },
    getOrdersWithFilters: async (params?: {
      status?: string;
      formedDateFrom?: string;
      formedDateTo?: string;
      page?: number;
      size?: number;
    }): Promise<{ items: Order[]; total: number; page: number; size: number }> => {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.formedDateFrom) queryParams.append('formedDateFrom', params.formedDateFrom);
      if (params?.formedDateTo) queryParams.append('formedDateTo', params.formedDateTo);
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());

      const response = await axiosInstance.get(`/gas-orders?${queryParams.toString()}`);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка загрузки заявок');
    },
    completeOrder: async (id: number, action: 'APPROVE' | 'REJECT', comment?: string): Promise<Order> => {
      const response = await axiosInstance.put(`/gas-orders/${id}/complete`, {
        action,
        comment,
      });
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка завершения заявки');
    },
  },

  // Корзина
  cart: {
    getCartIcon: async (): Promise<{ orderId: number | null; itemsCount: number }> => {
      const response = await axiosInstance.get('/gas-orders/cart-icon');
      // Бэкенд возвращает ApiResponse<CartIconDto>
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Ошибка загрузки корзины');
    },
    addToCart: async (gasId: number): Promise<{ success: boolean; message: string; cartCount: number }> => {
      const response = await axiosInstance.post(`/cart/add/${gasId}`);
      return response.data;
    },
    removeFromCart: async (gasId: number): Promise<{ success: boolean; message: string; cartCount: number }> => {
      const response = await axiosInstance.post(`/cart/remove/${gasId}`);
      return response.data;
    },
    getCartCount: async (): Promise<number> => {
      // Используем cart-icon для получения количества
      const cartIcon = await api.cart.getCartIcon();
      return cartIcon.itemsCount;
    },
    getCartItems: async (): Promise<number[]> => {
      const response = await axiosInstance.get('/cart/items');
      return response.data.items || [];
    },
    clearCart: async (): Promise<{ success: boolean; message: string }> => {
      const response = await axiosInstance.post('/cart/clear');
      return response.data;
    },
  },
};

export default axiosInstance;
