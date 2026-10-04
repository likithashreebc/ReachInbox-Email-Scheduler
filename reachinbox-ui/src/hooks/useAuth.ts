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
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Capture token from URL after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetchUser();
  }, []);

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    fetchedRef.current = false;
    window.location.href = '/login';
  };

  return { user, loading, logout, refetch: fetchUser };
}
