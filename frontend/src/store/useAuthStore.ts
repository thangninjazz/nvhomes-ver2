import { create } from 'zustand';
import { api } from '@/services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null, // Không dùng token từ localStorage nữa
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ token: null, user });
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ token: null, user: null });
  }
}));
