import api from './api';
import type { Email, SchedulePayload, ScheduleResponse } from '@/types';

export const emailApi = {
  schedule: (payload: SchedulePayload) =>
    api.post<ScheduleResponse>('/emails/schedule', payload).then((r) => r.data),

  getScheduled: () =>
    api.get<Email[]>('/emails/scheduled').then((r) => r.data),

  getSent: () =>
    api.get<Email[]>('/emails/sent').then((r) => r.data),

  search: (q: string) =>
    api.get<Email[]>('/emails/search', { params: { q } }).then((r) => r.data),
};
