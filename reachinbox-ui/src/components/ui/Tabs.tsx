import { cn } from '@/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-0.5 border-b border-[#e5e5e5]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            active === tab.id
              ? 'border-[#0a0a0a] text-[#0a0a0a]'
              : 'border-transparent text-[#737373] hover:text-[#525252]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded font-medium',
              active === tab.id ? 'bg-[#f5f5f5] text-[#525252]' : 'bg-[#f5f5f5] text-[#a3a3a3]'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
