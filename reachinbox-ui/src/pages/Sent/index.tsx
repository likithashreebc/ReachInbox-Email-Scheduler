import { useState } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { EmailTable } from '@/components/email/EmailTable';
import { useSentEmails } from '@/hooks/useEmails';

export default function SentPage() {
  const { emails, loading } = useSentEmails();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = emails.filter((e) => {
    const matchSearch = !search ||
      e.recipient.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === 'all' ||
      (tab === 'sent' && e.status === 'SENT') ||
      (tab === 'failed' && e.status === 'FAILED');
    return matchSearch && matchTab;
  });

  const sentCount = emails.filter((e) => e.status === 'SENT').length;
  const failedCount = emails.filter((e) => e.status === 'FAILED').length;

  return (
    <>
      <Header title="Sent" description="Completed email deliveries" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f5f5f5]">
            <Tabs
              tabs={[
                { id: 'all', label: 'All', count: emails.length },
                { id: 'sent', label: 'Sent', count: sentCount },
                { id: 'failed', label: 'Failed', count: failedCount },
              ]}
              active={tab}
              onChange={setTab}
              className="border-none"
            />
            <div className="ml-auto max-w-xs">
              <Input
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={13} />}
              />
            </div>
          </div>

          <EmailTable
            emails={filtered}
            loading={loading}
            emptyTitle="No sent emails yet"
            emptyDescription="Your completed email deliveries will appear here."
            showSentAt
          />
        </div>
      </main>
    </>
  );
}
