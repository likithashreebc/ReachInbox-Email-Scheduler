import { forwardRef } from 'react';
import { cn } from '@/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#525252]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-md border bg-white text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3]',
            'border-[#e5e5e5] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#eef2ff] focus:outline-none',
            'transition-all duration-150 resize-none px-3 py-2',
            error && 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#fef2f2]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        {hint && !error && <p className="text-xs text-[#a3a3a3]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
