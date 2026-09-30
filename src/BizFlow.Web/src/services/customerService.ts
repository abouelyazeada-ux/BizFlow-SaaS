import { apiClient } from './apiClient';
import type { ApiResponse, PagedResult } from '../types/api';

export interface CustomerDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export const customerService = {
  getCustomers: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PagedResult<CustomerDto>>>('/customers', { params });
    return response.data.data;
  },
  
  getCustomer: async (id: string) => {
    const response = await apiClient.get<ApiResponse<CustomerDto>>(`/customers/${id}`);
    return response.data.data;
  },

  createCustomer: async (data: Partial<CustomerDto>) => {
    const response = await apiClient.post<ApiResponse<string>>('/customers', data);
    return response.data.data;
  },

  updateCustomer: async (id: string, data: Partial<CustomerDto>) => {
    const response = await apiClient.put<ApiResponse<void>>(`/customers/${id}`, data);
    return response.data.data;
  },

  deleteCustomer: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/customers/${id}`);
    return response.data.data;
  }
};
