import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return response.data.data;
  },
  
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return response.data.data;
  }
};
