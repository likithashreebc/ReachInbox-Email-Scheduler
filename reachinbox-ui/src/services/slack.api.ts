import api from './api';
import type { SlackConnection } from '@/types';

export const slackApi = {
  status: () => api.get<SlackConnection>('/slack/status').then((r) => r.data),
  disconnect: () => api.post('/slack/disconnect'),
  connectUrl: () => `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/slack/connect`,
};
