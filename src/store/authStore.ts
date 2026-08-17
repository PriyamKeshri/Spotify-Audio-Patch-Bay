import { create } from 'zustand';
import type { SpotifyUser } from '../types/spotify';
import { readStoredToken } from '../auth/tokenStore';

interface AuthState {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  authError: string | null;
  setUser: (user: SpotifyUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: Boolean(readStoredToken()),
  user: null,
  authError: null,
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthError: (authError) => set({ authError }),
}));
