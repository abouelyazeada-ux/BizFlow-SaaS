import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardOverview = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['dashboard', 'overview', params],
    queryFn: () => dashboardApi.getOverview(params),
  });
};

export const useSalesAnalytics = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['dashboard', 'sales', params],
    queryFn: () => dashboardApi.getSalesAnalytics(params),
  });
};

export const useInventoryAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'inventory'],
    queryFn: () => dashboardApi.getInventoryAnalytics(),
  });
};

export const useRecentActivities = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activities', limit],
    queryFn: () => dashboardApi.getRecentActivities(limit),
  });
};
