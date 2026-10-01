import { useState } from 'react';
import { MoreHorizontal, Eye, Mail } from 'lucide-react';
import type { Email } from '@/types';
import { StatusBadge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmailDetailModal } from './EmailDetailModal';
import { formatDate, truncate } from '@/utils';

interface EmailTableProps {
  emails: Email[];
  loading: boolean;
  onCompose?: () => void;
  emptyTitle: string;
  emptyDescription: string;
  showSentAt?: boolean;
}

export function EmailTable({ emails, loading, onCompose, emptyTitle, emptyDescription, showSentAt }: EmailTableProps) {
  const [selected, setSelected] = useState<Email | null>(null);

  if (loading) return <SkeletonTable rows={8} />;

  if (emails.length === 0) {
    return (
      <EmptyState
        icon={<Mail size={18} />}
        title={emptyTitle}
        description={emptyDescription}
        action={onCompose ? { label: 'Compose Email', onClick: onCompose } : undefined}
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0f0f0]">
              <th className="text-left text-xs font-medium text-[#a3a3a3] px-4 py-2.5 w-[220px]">Recipient</th>
              <th className="text-left text-xs font-medium text-[#a3a3a3] px-4 py-2.5">Subject</th>
              <th className="text-left text-xs font-medium text-[#a3a3a3] px-4 py-2.5 w-[160px]">
                {showSentAt ? 'Sent' : 'Scheduled'}
              </th>
              <th className="text-left text-xs font-medium text-[#a3a3a3] px-4 py-2.5 w-[180px]">Sender</th>
              <th className="text-left text-xs font-medium text-[#a3a3a3] px-4 py-2.5 w-[100px]">Status</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr
                key={email.id}
                className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors group cursor-pointer"
                onClick={() => setSelected(email)}
              >
                <td className="px-4 py-3">
                  <span className="text-sm text-[#0a0a0a] font-medium">{email.recipient}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-[#525252]">{truncate(email.subject, 60)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-[#737373]">
                    {showSentAt
                      ? email.sentAt ? formatDate(email.sentAt) : '—'
                      : formatDate(email.scheduledAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-[#737373] font-mono">{email.senderEmail}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={email.status} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dropdown
                      trigger={
                        <button className="w-6 h-6 flex items-center justify-center rounded text-[#a3a3a3] hover:bg-[#f0f0f0] hover:text-[#525252] transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      }
                      items={[
                        { label: 'View details', icon: <Eye size={13} />, onClick: () => setSelected(email) },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EmailDetailModal email={selected} onClose={() => setSelected(null)} />
    </>
  );
}
