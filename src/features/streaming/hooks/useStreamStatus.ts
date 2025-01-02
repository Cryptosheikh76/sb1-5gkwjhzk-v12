import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { StreamStatus } from '../types/stream';

export function useStreamStatus(streamId: string) {
  const [status, setStatus] = useState<StreamStatus>({
    isLive: false,
    viewerCount: 0,
    duration: 0,
    health: 'offline'
  });

  useEffect(() => {
    // Subscribe to stream status updates
    const subscription = supabase
      .channel(`stream:${streamId}`)
      .on('broadcast', { event: 'status' }, ({ payload }) => {
        setStatus(payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [streamId]);

  return status;
}