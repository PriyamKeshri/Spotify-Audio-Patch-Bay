import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { beginAuthorization, logout as clearSession } from '../auth/authFlow';
import { readStoredToken } from '../auth/tokenStore';
import { getCurrentUser } from '../api/playlists';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { isAuthenticated, setAuthenticated, setUser, user } = useAuthStore();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (userQuery.data) setUser(userQuery.data);
  }, [userQuery.data, setUser]);

  // Keep the store in sync if another tab logs in/out (storage event fires
  // cross-tab, not same-tab, which is exactly what we want here).
  useEffect(() => {
    const handleStorage = () => setAuthenticated(Boolean(readStoredToken()));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setAuthenticated]);

  const login = useCallback(() => {
    void beginAuthorization();
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuthenticated(false);
    setUser(null);
    queryClient.clear();
  }, [setAuthenticated, setUser, queryClient]);

  return {
    isAuthenticated,
    user,
    isLoadingUser: userQuery.isLoading,
    login,
    logout,
  };
}
