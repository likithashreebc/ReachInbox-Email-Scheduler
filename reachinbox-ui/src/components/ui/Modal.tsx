import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className={cn(
        'relative w-full bg-white rounded-xl border border-[#e5e5e5] shadow-xl animate-fade-in',
        'flex flex-col max-h-[90vh]',
        sizes[size],
        className
      )}>
        {(title || description) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#f5f5f5] shrink-0">
            <div>
              {title && <h2 className="text-base font-semibold text-[#0a0a0a]">{title}</h2>}
              {description && <p className="text-sm text-[#737373] mt-0.5">{description}</p>}
            </div>
            <button onClick={onClose} className="text-[#a3a3a3] hover:text-[#525252] transition-colors ml-4 mt-0.5">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
