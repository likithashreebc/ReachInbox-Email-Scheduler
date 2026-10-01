import { cn } from '@/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#a3a3a3] mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[#0a0a0a]">{title}</p>
      {description && <p className="text-sm text-[#737373] mt-1 max-w-xs">{description}</p>}
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
