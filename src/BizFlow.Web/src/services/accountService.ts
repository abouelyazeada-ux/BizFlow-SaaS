import { apiClient } from './apiClient';

export interface CurrentUserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  role: string[];
}

export const accountService = {
  getCurrentProfile: async () => {
    const response = await apiClient.get<CurrentUserProfileResponse>('/account/profile');
    return response.data;
  }
};
