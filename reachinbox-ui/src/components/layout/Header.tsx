import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-6 border-b border-[#e5e5e5] bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#0a0a0a] leading-none">{title}</h1>
          {description && <p className="text-xs text-[#a3a3a3] mt-0.5">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-2 h-7 px-2.5 rounded-md border border-[#e5e5e5] bg-[#fafafa] text-xs text-[#a3a3a3] hover:bg-[#f5f5f5] transition-colors"
        >
          <Search size={12} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] bg-white border border-[#e5e5e5] rounded px-1 py-0.5 font-mono">⌘K</kbd>
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-[#a3a3a3] hover:bg-[#f5f5f5] hover:text-[#525252] transition-colors relative">
          <Bell size={14} />
        </button>
        <Dropdown
          trigger={<Avatar src={user?.avatar} name={user?.name ?? 'U'} size="sm" className="cursor-pointer" />}
          items={[
            { label: 'Profile', onClick: () => navigate('/settings') },
            { label: 'Settings', onClick: () => navigate('/settings') },
            { label: 'Sign out', onClick: logout, danger: true },
          ]}
        />
      </div>
    </header>
  );
}
