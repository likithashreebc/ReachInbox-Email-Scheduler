import { cn } from '@/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  sub?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, trend, trendUp, sub, icon, className }: StatCardProps) {
  return (
    <div className={cn('bg-white border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#737373] uppercase tracking-wide">{label}</span>
        {icon && <span className="text-[#a3a3a3]">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold text-[#0a0a0a] tabular-nums leading-none">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className={cn('flex items-center gap-0.5 text-xs font-medium mb-0.5', trendUp ? 'text-[#16a34a]' : 'text-[#dc2626]')}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
      {sub && <span className="text-xs text-[#a3a3a3]">{sub}</span>}
    </div>
  );
}
