import { apiClient } from './apiClient';
import type { ApiResponse, PagedResult } from '../types/api';

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  price: number;
  costPrice: number;
  quantity: number;
  minimumStockLevel: number;
  isActive: boolean;
  stockStatus: string;
}

export const productService = {
  getProducts: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PagedResult<ProductDto>>>('/products', { params });
    return response.data.data;
  },

  getProduct: async (id: string) => {
    const response = await apiClient.get<ApiResponse<ProductDto>>(`/products/${id}`);
    return response.data.data;
  },

  createProduct: async (data: Partial<ProductDto>) => {
    const response = await apiClient.post<ApiResponse<string>>('/products', data);
    return response.data.data;
  },

  updateProduct: async (id: string, data: Partial<ProductDto>) => {
    const response = await apiClient.put<ApiResponse<void>>(`/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data.data;
  },

  adjustStock: async (id: string, quantity: number, reason: string) => {
    const response = await apiClient.post<ApiResponse<void>>(`/products/${id}/adjust-stock`, { quantity, reason });
    return response.data.data;
  }
};
