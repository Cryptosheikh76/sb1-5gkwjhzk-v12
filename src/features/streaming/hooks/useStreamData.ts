import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Stream } from '../types';

export function useStreamData(streamId: string) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('streams')
          .select(`
            *,
            creator:users(
              id,
              username,
              avatar_url,
              wallet_address
            )
          `)
          .eq('id', streamId)
          .single();

        if (dbError) throw dbError;
        setStream(data as Stream);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stream');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();

    // Subscribe to stream updates
    const subscription = supabase
      .channel(`stream:${streamId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'streams',
        filter: `id=eq.${streamId}`
      }, 
      () => fetchStream())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [streamId]);

  return { stream, loading, error };
}