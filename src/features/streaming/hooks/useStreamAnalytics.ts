import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface StreamStats {
  peakViewers: number;
  avgWatchTime: number;
  chatMessages: number;
  viewerActivity: {
    timestamp: string;
    viewers: number;
  }[];
}

export function useStreamAnalytics() {
  const [stats, setStats] = useState<StreamStats>({
    peakViewers: 0,
    avgWatchTime: 0,
    chatMessages: 0,
    viewerActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('stream_analytics')
          .select('*')
          .single();

        if (error) throw error;
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('stream_analytics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'stream_analytics' 
      }, 
      () => fetchStats())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { stats, loading };
}