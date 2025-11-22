// Типы данных для приложения

export interface Gas {
  id: number;
  name: string;
  formula: string;
  detailedDescription: string;
  imageUrl: string | null;
  concentration?: string;
  temperature?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export interface GasesFilter {
  name?: string;
  formula?: string;
  page?: number;
  size?: number;
}
