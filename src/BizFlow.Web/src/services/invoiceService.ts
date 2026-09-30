import { apiClient } from './apiClient';
import type { ApiResponse, PagedResult } from '../types/api';

export interface InvoiceItemDto {
  id: string;
  productId: string;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceDto {
  id: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  status: string;
  subTotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
  items: InvoiceItemDto[];
}

export const invoiceService = {
  getInvoices: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PagedResult<InvoiceDto>>>('/invoices', { params });
    return response.data.data;
  },

  getInvoice: async (id: string) => {
    const response = await apiClient.get<ApiResponse<InvoiceDto>>(`/invoices/${id}`);
    return response.data.data;
  },

  createInvoice: async (data: any) => {
    const response = await apiClient.post<ApiResponse<string>>('/invoices', data);
    return response.data.data;
  },

  updateInvoice: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<void>>(`/invoices/${id}`, data);
    return response.data.data;
  },

  deleteInvoice: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/invoices/${id}`);
    return response.data.data;
  },

  confirmInvoice: async (id: string) => {
    const response = await apiClient.post<ApiResponse<void>>(`/invoices/${id}/confirm`);
    return response.data.data;
  },

  cancelInvoice: async (id: string) => {
    const response = await apiClient.post<ApiResponse<void>>(`/invoices/${id}/cancel`);
    return response.data.data;
  }
};
