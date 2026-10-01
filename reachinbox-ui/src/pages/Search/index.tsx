import { useState, useCallback } from 'react';
import { Search as SearchIcon, Mail } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/Badge';
import { emailApi } from '@/services/email.api';
import { formatDate, truncate } from '@/utils';
import type { Email } from '@/types';

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#fef9c3] text-[#0a0a0a] rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const data = await emailApi.search(q);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') doSearch(query);
  };

  return (
    <>
      <Header title="Search" description="Find emails by recipient, subject, or sender" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <SearchIcon size={16} className="absolute left-4 text-[#a3a3a3] pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search emails, recipients, subjects..."
              className="w-full h-11 pl-11 pr-4 bg-white border border-[#e5e5e5] rounded-lg text-sm text-[#0a0a0a] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#eef2ff] transition-all shadow-sm"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
                className="absolute right-3 text-xs text-[#a3a3a3] hover:text-[#525252] bg-[#f5f5f5] px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-[#a3a3a3] mt-2 text-center">Press Enter to search</p>
        </div>

        {/* Results */}
        <div className="max-w-2xl mx-auto mt-6">
          {loading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-2">
                  <div className="skeleton h-3.5 w-48" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-32" />
                </div>
              ))}
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center mb-4">
                <Mail size={18} className="text-[#a3a3a3]" />
              </div>
              <p className="text-sm font-medium text-[#0a0a0a]">No emails found</p>
              <p className="text-sm text-[#737373] mt-1">Try searching by recipient, subject, or sender.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-0 bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#f5f5f5]">
                <span className="text-xs text-[#a3a3a3]">{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</span>
              </div>
              {results.map((email, i) => (
                <div key={email.id} className={`px-4 py-3 hover:bg-[#fafafa] transition-colors ${i < results.length - 1 ? 'border-b border-[#f5f5f5]' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#0a0a0a]">{highlight(email.recipient, query)}</span>
                        <StatusBadge status={email.status} />
                      </div>
                      <p className="text-sm text-[#525252] truncate">{highlight(truncate(email.subject, 80), query)}</p>
                      <p className="text-xs text-[#a3a3a3] mt-1 font-mono">{highlight(email.senderEmail, query)}</p>
                    </div>
                    <span className="text-xs text-[#a3a3a3] shrink-0 mt-0.5">
                      {formatDate(email.sentAt ?? email.scheduledAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#a3a3a3]">
              <SearchIcon size={28} className="mb-3 opacity-30" />
              <p className="text-sm">Search across all your scheduled and sent emails</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
