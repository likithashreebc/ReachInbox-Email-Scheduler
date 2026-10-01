import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Clock, CheckCircle2, Search, Settings,
  LogOut, Zap, ChevronDown
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSlack } from '@/hooks/useSlack';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/scheduled', icon: Clock, label: 'Scheduled' },
  { to: '/sent', icon: CheckCircle2, label: 'Sent' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { slack, connect } = useSlack();
  const navigate = useNavigate();

  return (
    <aside className="w-[220px] shrink-0 h-screen flex flex-col bg-[#0a0a0a] border-r border-[#1f1f1f] sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#4f46e5] flex items-center justify-center shrink-0">
            <Zap size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">ReachInbox</span>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-3 py-2 border-b border-[#1f1f1f]">
        <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#1a1a1a] transition-colors group">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#4f46e5]/20 border border-[#4f46e5]/30 flex items-center justify-center">
              <span className="text-[9px] font-bold text-[#818cf8]">
                {user?.name?.[0] ?? 'W'}
              </span>
            </div>
            <span className="text-xs font-medium text-[#a3a3a3] group-hover:text-[#d4d4d4] transition-colors truncate max-w-[110px]">
              {user?.email?.split('@')[1] ?? 'workspace'}
            </span>
          </div>
          <ChevronDown size={12} className="text-[#525252] shrink-0" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150',
              isActive
                ? 'bg-[#1f1f1f] text-white'
                : 'text-[#737373] hover:bg-[#141414] hover:text-[#d4d4d4]'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? 'text-white' : 'text-[#525252]'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Slack status */}
      <div className="px-3 py-2 border-t border-[#1f1f1f]">
        {slack.connected ? (
          <div className="flex items-center gap-2 px-2.5 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] shrink-0" />
            <span className="text-xs text-[#525252]">Slack connected</span>
          </div>
        ) : (
          <button
            onClick={connect}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[#525252] hover:bg-[#141414] hover:text-[#a3a3a3] transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#525252] shrink-0" />
            Connect Slack
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#1f1f1f]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#141414] transition-colors group">
          <Avatar src={user?.avatar} name={user?.name ?? 'U'} size="xs" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#d4d4d4] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#525252] truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="text-[#525252] hover:text-[#a3a3a3] transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
