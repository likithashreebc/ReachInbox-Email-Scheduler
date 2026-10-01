import { forwardRef } from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#525252]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-[#a3a3a3] pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-8 rounded-md border bg-white text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3]',
              'border-[#e5e5e5] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#eef2ff] focus:outline-none',
              'transition-all duration-150',
              'disabled:bg-[#fafafa] disabled:text-[#a3a3a3] disabled:cursor-not-allowed',
              icon ? 'pl-9' : 'px-3',
              iconRight ? 'pr-9' : 'pr-3',
              error && 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#fef2f2]',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-[#a3a3a3] flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#a3a3a3]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
