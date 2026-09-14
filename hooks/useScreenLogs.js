import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useScreenLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchInitialLogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('screen_logs')
      .select('*')
      .order('captured_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching logs:', error);
      setError(error);
    } else {
      setLogs(data || []);
      setIsConnected(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInitialLogs();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:screen_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'screen_logs' },
        (payload) => {
          console.log('New log received!', payload);
          setLogs((currentLogs) => {
            // Keep maximum of 500 logs in memory to prevent browser lag over time
            const newLogs = [payload.new, ...currentLogs];
            return newLogs.slice(0, 500);
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInitialLogs]);

  return { logs, loading, error, isConnected, refetch: fetchInitialLogs };
}
