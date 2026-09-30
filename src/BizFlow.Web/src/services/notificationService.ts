import { apiClient } from './apiClient';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: number;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const notificationService = {
  getNotifications: async (params?: { pageNumber?: number; pageSize?: number; unreadOnly?: boolean }) => {
    const response = await apiClient.get<PagedResult<NotificationDto>>('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<number>('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put<boolean>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put<boolean>('/notifications/read-all');
    return response.data;
  }
};
