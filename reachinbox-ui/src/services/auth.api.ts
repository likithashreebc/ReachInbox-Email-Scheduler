import api from './api';
import type { User } from '@/types';

export const authApi = {
  me: () => api.get<User>('/auth/me').then((r) => r.data),
  logout: () => api.post('/auth/logout'),
  googleLoginUrl: () => `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/auth/google`,
};
