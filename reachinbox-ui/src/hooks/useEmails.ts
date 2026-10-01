import { useState, useEffect, useCallback } from 'react';
import type { Email } from '@/types';
import { emailApi } from '@/services/email.api';

export function useScheduledEmails(pollInterval = 10000) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await emailApi.getScheduled();
      setEmails(data);
      setError(null);
    } catch {
      setError('Failed to load scheduled emails');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => clearInterval(id);
  }, [fetch, pollInterval]);

  return { emails, loading, error, refetch: fetch };
}

export function useSentEmails(pollInterval = 10000) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await emailApi.getSent();
      setEmails(data);
      setError(null);
    } catch {
      setError('Failed to load sent emails');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => clearInterval(id);
  }, [fetch, pollInterval]);

  return { emails, loading, error, refetch: fetch };
}
