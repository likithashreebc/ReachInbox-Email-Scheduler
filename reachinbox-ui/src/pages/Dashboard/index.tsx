import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Mail, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ComposeModal } from '@/components/email/ComposeModal';
import { useAuth } from '@/hooks/useAuth';
import { useScheduledEmails, useSentEmails } from '@/hooks/useEmails';
import type { ActivityItem } from '@/types';

function greeting(name: string) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${g}, ${name.split(' ')[0]}`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { emails: scheduled, loading: loadingScheduled } = useScheduledEmails();
  const { emails: sent, loading: loadingSent } = useSentEmails();
  const [composeOpen, setComposeOpen] = useState(false);
  const navigate = useNavigate();

  const failed = sent.filter((e) => e.status === 'FAILED').length;
  const sentCount = sent.filter((e) => e.status === 'SENT').length;

  // Build real activity from actual emails
  const activity: ActivityItem[] = [
    ...sent.slice(0, 5).map((e) => ({
      id: e.id,
      type: e.status === 'SENT' ? ('sent' as const) : ('failed' as const),
      message: e.status === 'SENT' ? `Email sent to ${e.recipient}` : `Failed to send to ${e.recipient}`,
      detail: e.subject,
      timestamp: (e.sentAt ?? e.scheduledAt) as string,
    })),
    ...scheduled.slice(0, 3).map((e) => ({
      id: e.id,
      type: 'scheduled' as const,
      message: `Scheduled email to ${e.recipient}`,
      detail: e.subject,
      timestamp: e.scheduledAt as string,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  const stats = [
    {
      label: 'Scheduled',
      value: loadingScheduled ? '—' : scheduled.length,
      sub: 'Upcoming deliveries',
      icon: <Clock size={14} />,
    },
    {
      label: 'Sent',
      value: loadingSent ? '—' : sentCount,
      sub: 'Successfully delivered',
      icon: <CheckCircle2 size={14} />,
    },
    {
      label: 'Queued',
      value: loadingScheduled ? '—' : scheduled.length,
      sub: 'Processing now',
      icon: <Loader2 size={14} />,
    },
    {
      label: 'Failed',
      value: loadingSent ? '—' : failed,
      sub: failed > 0 ? 'Needs attention' : 'All clear',
      icon: <AlertCircle size={14} />,
    },
  ];

  return (
    <>
      <Header
        title="Overview"
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setComposeOpen(true)}>
            Compose
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#0a0a0a]">
            {user ? greeting(user.name) : 'Welcome back'}
          </h2>
          <p className="text-sm text-[#737373] mt-0.5">Here's what's happening with your outreach.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          {(loadingScheduled || loadingSent)
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : stats.map((s) => <StatCard key={s.label} {...s} />)
          }
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Recent scheduled */}
          <div className="xl:col-span-2 bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f5f5f5]">
              <div>
                <h3 className="text-sm font-semibold text-[#0a0a0a]">Upcoming Emails</h3>
                <p className="text-xs text-[#a3a3a3] mt-0.5">Next scheduled deliveries</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/scheduled')}>View all</Button>
            </div>
            {loadingScheduled ? (
              <div className="p-4 flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="skeleton h-3 w-36" />
                    <div className="skeleton h-3 flex-1" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : scheduled.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Mail size={20} className="text-[#d4d4d4] mb-2" />
                <p className="text-sm text-[#737373]">No scheduled emails</p>
                <button onClick={() => setComposeOpen(true)} className="text-xs text-[#4f46e5] mt-1 hover:underline">
                  Schedule your first campaign →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#f5f5f5]">
                {scheduled.slice(0, 5).map((email) => (
                  <div key={email.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#fafafa] transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] shrink-0" />
                    <span className="text-sm text-[#0a0a0a] w-44 truncate shrink-0">{email.recipient}</span>
                    <span className="text-sm text-[#737373] flex-1 truncate">{email.subject}</span>
                    <span className="text-xs text-[#a3a3a3] shrink-0">
                      {new Date(email.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#f5f5f5]">
              <h3 className="text-sm font-semibold text-[#0a0a0a]">Recent Activity</h3>
              <p className="text-xs text-[#a3a3a3] mt-0.5">Latest system events</p>
            </div>
            <ActivityFeed items={activity} />
          </div>
        </div>
      </main>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
