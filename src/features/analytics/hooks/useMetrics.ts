import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { UserMetrics, ContentMetrics } from '../types';

export function useMetrics(userId: string) {
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Fetch user metrics
        const { data: userData, error: userError } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (userError) throw userError;

        // Fetch content metrics
        const { data: contentData, error: contentError } = await supabase
          .from('content_metrics')
          .select('*')
          .eq('creator_id', userId);

        if (contentError) throw contentError;

        setUserMetrics(userData);
        setContentMetrics(contentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [userId]);

  return { userMetrics, contentMetrics, loading, error };
}