import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5017/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log('AXIOS REQUEST INTERCEPTOR: 17. request URL', config.url);
    console.log('AXIOS REQUEST INTERCEPTOR: 18. whether token exists', !!token);
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
      console.log('AXIOS REQUEST INTERCEPTOR: 19. Authorization header presence', true);
    } else {
      console.log('AXIOS REQUEST INTERCEPTOR: 19. Authorization header presence', false);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    console.log('AXIOS RESPONSE INTERCEPTOR: 20. response URL', response.config.url);
    console.log('AXIOS RESPONSE INTERCEPTOR: 21. response status', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('AXIOS RESPONSE INTERCEPTOR: 20. response URL', originalRequest?.url);
    console.log('AXIOS RESPONSE INTERCEPTOR: 21. response status', error.response?.status);
    
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        
        const { token, refreshToken: newRefreshToken, userId, email, firstName, lastName, companyId, expiration } = response.data;
        
        useAuthStore.getState().setAuth({
          token,
          refreshToken: newRefreshToken,
          userId,
          email,
          firstName,
          lastName,
          companyId,
          expiration
        });

        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
