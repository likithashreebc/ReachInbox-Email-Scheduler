import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div className={cn(
          'absolute top-full mt-1 z-50 min-w-[160px] bg-white border border-[#e5e5e5] rounded-lg shadow-lg py-1 animate-fade-in',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item, i) => (
            <button
              key={i}
              disabled={item.disabled}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
                item.danger ? 'text-[#dc2626] hover:bg-[#fef2f2]' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]',
                item.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="shrink-0 text-current opacity-60">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
