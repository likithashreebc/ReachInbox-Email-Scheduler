import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmailTable } from '@/components/email/EmailTable';
import { ComposeModal } from '@/components/email/ComposeModal';
import { useScheduledEmails } from '@/hooks/useEmails';

export default function ScheduledPage() {
  const { emails, loading, refetch } = useScheduledEmails();
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const filtered = emails.filter((e) =>
    !search || e.recipient.includes(search) || e.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header
        title="Scheduled"
        description="Manage upcoming email deliveries"
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setComposeOpen(true)}>
            Compose
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f5f5f5]">
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={13} />}
              />
            </div>
            <span className="text-xs text-[#a3a3a3] ml-auto">
              {loading ? '' : `${filtered.length.toLocaleString()} email${filtered.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <EmailTable
            emails={filtered}
            loading={loading}
            onCompose={() => setComposeOpen(true)}
            emptyTitle="Nothing scheduled yet"
            emptyDescription="Schedule your first email campaign to see upcoming deliveries here."
          />
        </div>
      </main>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSuccess={refetch}
      />
    </>
  );
}
