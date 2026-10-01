import type { Email, User, DashboardStats, ActivityItem, SlackConnection } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@company.com',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AJ&backgroundColor=4f46e5&textColor=ffffff',
};

export const mockStats: DashboardStats = {
  scheduled: 128,
  sent: 1284,
  queued: 43,
  failed: 7,
  scheduledToday: 12,
  sentToday: 18,
};

export const mockSlack: SlackConnection = {
  connected: false,
};

export const mockActivity: ActivityItem[] = [
  { id: '1', type: 'sent', message: 'Email sent to john@acme.com', detail: 'Product Demo Follow-up', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: '2', type: 'scheduled', message: 'Scheduled email to alice@startup.io', detail: 'Q4 Outreach Campaign', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '3', type: 'rate_limit', message: 'Rate limit reached for sender hello@company.com', detail: 'Rescheduled to next hour window', timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: '4', type: 'slack', message: 'Slack notification sent', detail: 'Rate limit alert delivered', timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: '5', type: 'sent', message: 'Email sent to mark@enterprise.com', detail: 'Introduction Email', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: '6', type: 'failed', message: 'Failed to send to invalid@.com', detail: 'Invalid recipient address', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
];

const subjects = [
  'Quick question about your workflow',
  'Introducing ReachInbox for your team',
  'Following up on our conversation',
  'Product Demo — 15 minutes?',
  'How [Company] can save 10 hours/week',
  'Partnership opportunity',
  'Your free trial is ready',
];

const senders = ['hello@reachinbox.ai', 'outreach@company.com', 'team@startup.io'];

const recipients = [
  'john.smith@acme.com', 'alice@startup.io', 'mark@enterprise.com',
  'sarah.jones@corp.com', 'dev@techco.io', 'ceo@bigco.com',
  'founder@newco.ai', 'ops@scale.com', 'growth@saas.io', 'hello@agency.co',
];

function makeEmail(i: number, status: Email['status']): Email {
  const now = Date.now();
  const scheduledAt = new Date(now + (i - 5) * 3600000).toISOString();
  const sentAt = status === 'SENT' ? new Date(now - i * 1800000).toISOString() : undefined;
  return {
    id: `email-${i}`,
    recipient: recipients[i % recipients.length],
    subject: subjects[i % subjects.length],
    body: '<p>Hi there,</p><p>I wanted to reach out...</p>',
    senderEmail: senders[i % senders.length],
    scheduledAt,
    sentAt,
    status,
    createdAt: new Date(now - i * 7200000).toISOString(),
  };
}

export const mockScheduled: Email[] = Array.from({ length: 18 }, (_, i) => makeEmail(i, 'SCHEDULED'));
export const mockSent: Email[] = [
  ...Array.from({ length: 14 }, (_, i) => makeEmail(i, 'SENT')),
  ...Array.from({ length: 3 }, (_, i) => makeEmail(i + 14, 'FAILED')),
];
