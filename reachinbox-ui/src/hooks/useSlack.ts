import { useState, useEffect } from 'react';
import type { SlackConnection } from '@/types';
import { slackApi } from '@/services/slack.api';
import { mockSlack } from '@/utils/mockData';

export function useSlack() {
  const [slack, setSlack] = useState<SlackConnection>(mockSlack);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const data = await slackApi.status();
      setSlack(data);
    } catch {
      setSlack(mockSlack);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const disconnect = async () => {
    await slackApi.disconnect();
    setSlack({ connected: false });
  };

  const connect = () => {
    window.location.href = slackApi.connectUrl();
  };

  return { slack, loading, connect, disconnect, refetch: fetch };
}
