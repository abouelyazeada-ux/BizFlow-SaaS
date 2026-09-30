import { apiClient } from '../../../services/apiClient';
import type { ApiResponse } from '../../../types/api';
import type { 
  DashboardOverviewDto, 
  SalesAnalyticsDto, 
  InventoryAnalyticsDto, 
  RecentActivityDto 
} from '../types/dashboard.types';

export const dashboardApi = {
  getOverview: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<ApiResponse<DashboardOverviewDto>>('/dashboard/overview', { params });
    return response.data.data;
  },

  getSalesAnalytics: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<ApiResponse<SalesAnalyticsDto>>('/dashboard/sales', { params });
    return response.data.data;
  },

  getInventoryAnalytics: async () => {
    const response = await apiClient.get<ApiResponse<InventoryAnalyticsDto>>('/dashboard/inventory');
    return response.data.data;
  },

  getRecentActivities: async (limit: number = 5) => {
    const response = await apiClient.get<ApiResponse<RecentActivityDto[]>>('/dashboard/recent-activities', { params: { limit } });
    return response.data.data;
  }
};
