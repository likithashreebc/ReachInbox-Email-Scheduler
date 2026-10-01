import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import type { Email } from '@/types';
import { formatFullDate } from '@/utils';
import { Mail, Clock, User, Send } from 'lucide-react';

interface EmailDetailModalProps {
  email: Email | null;
  onClose: () => void;
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f5f5f5] last:border-0">
      <span className="text-[#a3a3a3] mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#a3a3a3] mb-0.5">{label}</p>
        <p className="text-sm text-[#0a0a0a] break-all">{value}</p>
      </div>
    </div>
  );
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  if (!email) return null;

  return (
    <Modal
      open={!!email}
      onClose={onClose}
      title="Email Details"
      description={`ID: ${email.id}`}
      size="md"
    >
      <div className="px-6 py-4 flex flex-col gap-1">
        <div className="flex items-center justify-between py-3 border-b border-[#f5f5f5]">
          <span className="text-xs text-[#a3a3a3]">Status</span>
          <StatusBadge status={email.status} />
        </div>

        <Row icon={<User size={14} />} label="Recipient" value={email.recipient} />
        <Row icon={<Send size={14} />} label="Sender" value={email.senderEmail} />
        <Row icon={<Mail size={14} />} label="Subject" value={email.subject} />
        <Row
          icon={<Clock size={14} />}
          label="Scheduled At"
          value={formatFullDate(email.scheduledAt)}
        />
        {email.sentAt && (
          <Row
            icon={<Clock size={14} />}
            label="Sent At"
            value={formatFullDate(email.sentAt)}
          />
        )}

        {/* Body */}
        <div className="pt-3">
          <p className="text-xs text-[#a3a3a3] mb-2">Body</p>
          <div
            className="text-sm text-[#525252] bg-[#fafafa] border border-[#f0f0f0] rounded-lg p-3 max-h-40 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </div>
    </Modal>
  );
}
