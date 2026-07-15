import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { api, clearTokens, isAuthenticated } from '@/lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  isTenantAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        try {
          await api.post('/auth/logout', {});
        } catch {
        }
        clearTokens();
        set({ user: null });
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(user.role);
      },

      isSuperAdmin: () => get().user?.role === 'SUPER_ADMIN',
      isTenantAdmin: () =>
        ['SUPER_ADMIN', 'TENANT_ADMIN'].includes(get().user?.role || ''),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state && !isAuthenticated()) {
          state.setUser(null);
        }
      },
    }
  )
);
