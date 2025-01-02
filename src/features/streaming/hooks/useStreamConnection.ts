```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Stream } from '../types';

export function useStreamConnection(streamId: string) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('streams')
          .select(`
            *,
            creator:users(
              id,
              username,
              avatar_url
            )
          `)
          .eq('id', streamId)
          .single();

        if (fetchError) throw fetchError;
        setStream(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stream');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();

    // Subscribe to stream updates
    const channel = supabase
      .channel(`stream:${streamId}`)
      .on('broadcast', { event: 'stream_update' }, ({ payload }) => {
        setStream(prev => ({ ...prev, ...payload }));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [streamId]);

  return { stream, loading, error };
}
```