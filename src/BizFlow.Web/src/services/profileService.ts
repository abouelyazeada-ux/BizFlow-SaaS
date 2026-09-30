import { apiClient } from './apiClient';

export interface ProfileResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get<ProfileResponse>('/profile');
    return response.data;
  },
  
  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await apiClient.post('/profile/change-password', data);
    return response.data;
  }
};
