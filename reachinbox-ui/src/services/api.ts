import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login on 401 if NOT on the auth/me check itself
    // This prevents the infinite reload loop
    const url = err.config?.url ?? '';
    if (err.response?.status === 401 && !url.includes('/auth/me')) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
