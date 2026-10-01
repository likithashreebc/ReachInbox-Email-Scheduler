import { cn } from '@/utils';
import type { EmailStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

const variants = {
  default: 'bg-[#f5f5f5] text-[#525252]',
  success: 'bg-[#f0fdf4] text-[#16a34a]',
  warning: 'bg-[#fffbeb] text-[#d97706]',
  error: 'bg-[#fef2f2] text-[#dc2626]',
  info: 'bg-[#eef2ff] text-[#4f46e5]',
  neutral: 'bg-[#fafafa] text-[#737373] border border-[#e5e5e5]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

const statusConfig: Record<EmailStatus, { label: string; variant: BadgeProps['variant']; dot: string }> = {
  SCHEDULED: { label: 'Scheduled', variant: 'info', dot: 'bg-[#4f46e5]' },
  SENT: { label: 'Sent', variant: 'success', dot: 'bg-[#16a34a]' },
  FAILED: { label: 'Failed', variant: 'error', dot: 'bg-[#dc2626]' },
  PROCESSING: { label: 'Processing', variant: 'warning', dot: 'bg-[#d97706]' },
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </Badge>
  );
}
