import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants = {
  primary: 'bg-[#4f46e5] text-white hover:bg-[#4338ca] border border-[#4338ca] shadow-sm',
  secondary: 'bg-white text-[#0a0a0a] hover:bg-[#f5f5f5] border border-[#e5e5e5] shadow-sm',
  ghost: 'bg-transparent text-[#525252] hover:bg-[#f5f5f5] hover:text-[#0a0a0a] border border-transparent',
  danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c] border border-[#b91c1c] shadow-sm',
  outline: 'bg-transparent text-[#4f46e5] hover:bg-[#eef2ff] border border-[#4f46e5]',
};

const sizes = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-8 px-3.5 text-sm gap-2',
  lg: 'h-9 px-4 text-sm gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', loading, icon, iconRight, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 cursor-pointer select-none whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={13} className="animate-spin shrink-0" /> : icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
);

Button.displayName = 'Button';
