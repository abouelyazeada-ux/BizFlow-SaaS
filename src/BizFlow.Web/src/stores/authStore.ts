import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  companyId: string | null;
  expiration: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (data: { token: string; refreshToken: string; userId: string; email: string; firstName: string; lastName: string; companyId: string; expiration: string }) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  updateUser: (data: { firstName: string; lastName: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      companyId: null,
      expiration: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (data) => set({ 
        token: data.token, 
        refreshToken: data.refreshToken,
        userId: data.userId, 
        email: data.email, 
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: data.companyId, 
        expiration: data.expiration, 
        isAuthenticated: !!data.token 
      }),
      logout: () => {
        console.log('AUTH STORE: 23. logout() invocation');
        console.trace('AUTH STORE: 24. who triggered logout');
        set({ 
          token: null, 
          refreshToken: null,
          userId: null, 
          email: null, 
          firstName: null,
          lastName: null,
          companyId: null, 
          expiration: null, 
          isAuthenticated: false 
        });
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
      updateUser: (data: { firstName: string; lastName: string }) => set({
        firstName: data.firstName,
        lastName: data.lastName
      })
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
