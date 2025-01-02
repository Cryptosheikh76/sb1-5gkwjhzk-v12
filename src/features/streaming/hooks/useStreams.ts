import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Stream } from '../types';

export function useStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('streams')
          .select(`
            *,
            creator:users(username, avatar_url)
          `)
          .eq('is_live', true)
          .order('viewer_count', { ascending: false });

        if (dbError) throw dbError;
        setStreams(data as Stream[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load streams');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();

    // Subscribe to stream updates
    const subscription = supabase
      .channel('public:streams')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'streams' 
      }, 
      () => fetchStreams())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { streams, loading, error };
}