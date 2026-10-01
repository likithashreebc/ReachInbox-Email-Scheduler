export type EmailStatus = 'SCHEDULED' | 'SENT' | 'FAILED' | 'PROCESSING';

export interface Email {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  senderEmail: string;
  scheduledAt: string;
  sentAt?: string;
  status: EmailStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
}

export interface SlackConnection {
  connected: boolean;
  workspace?: string;
  connectedAt?: string;
}

export interface SchedulePayload {
  recipients: string[];
  subject: string;
  body: string;
  senderEmail: string;
  startTime: string;
  delayBetweenMs: number;
  hourlyLimit: number;
}

export interface ScheduleResponse {
  scheduled: number;
  emails: Email[];
}

export interface DashboardStats {
  scheduled: number;
  sent: number;
  queued: number;
  failed: number;
  scheduledToday: number;
  sentToday: number;
}

export interface ActivityItem {
  id: string;
  type: 'sent' | 'scheduled' | 'rate_limit' | 'slack' | 'failed';
  message: string;
  detail?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
  message?: string;
}
