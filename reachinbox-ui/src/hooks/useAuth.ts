import { useState, useEffect, createContext, useContext, useRef } from 'react';
import type { User } from '@/types';
import { authApi } from '@/services/auth.api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
  refetch: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchUser = async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once ever — prevent loop
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUser();
  }, []);

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    setUser(null);
    fetchedRef.current = false;
    window.location.href = '/login';
  };

  return { user, loading, logout, refetch: fetchUser };
}
