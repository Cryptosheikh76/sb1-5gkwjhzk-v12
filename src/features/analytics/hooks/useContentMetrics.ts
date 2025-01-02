import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ContentMetrics } from '../types/metrics';

export function useContentMetrics(userId: string) {
  const [metrics, setMetrics] = useState<ContentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('content_metrics')
          .select('*')
          .eq('creator_id', userId)
          .order('views', { ascending: false });

        if (dbError) throw dbError;
        setMetrics(data as ContentMetrics[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  return { metrics, loading, error };
}