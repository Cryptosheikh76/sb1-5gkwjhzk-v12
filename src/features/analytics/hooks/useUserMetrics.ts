import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { UserMetrics } from '../types/metrics';

export function useUserMetrics(userId: string) {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (dbError) throw dbError;
        setMetrics(data as UserMetrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  return { metrics, loading, error };
}