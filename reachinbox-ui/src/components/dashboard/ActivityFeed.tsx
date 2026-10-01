import { CheckCircle2, Clock, AlertTriangle, MessageSquare, XCircle } from 'lucide-react';
import type { ActivityItem } from '@/types';
import { formatRelative } from '@/utils';
import { cn } from '@/utils';

const config = {
  sent: { icon: CheckCircle2, color: 'text-[#16a34a]', bg: 'bg-[#f0fdf4]' },
  scheduled: { icon: Clock, color: 'text-[#4f46e5]', bg: 'bg-[#eef2ff]' },
  rate_limit: { icon: AlertTriangle, color: 'text-[#d97706]', bg: 'bg-[#fffbeb]' },
  slack: { icon: MessageSquare, color: 'text-[#525252]', bg: 'bg-[#f5f5f5]' },
  failed: { icon: XCircle, color: 'text-[#dc2626]', bg: 'bg-[#fef2f2]' },
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const { icon: Icon, color, bg } = config[item.type];
        return (
          <div key={item.id} className={cn('flex items-start gap-3 px-4 py-3', i < items.length - 1 && 'border-b border-[#f5f5f5]')}>
            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5', bg)}>
              <Icon size={12} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#0a0a0a] leading-snug">{item.message}</p>
              {item.detail && <p className="text-xs text-[#a3a3a3] mt-0.5">{item.detail}</p>}
            </div>
            <span className="text-xs text-[#a3a3a3] shrink-0 mt-0.5">{formatRelative(item.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}
