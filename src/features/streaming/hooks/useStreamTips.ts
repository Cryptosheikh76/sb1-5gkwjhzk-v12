```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface StreamTip {
  id: string;
  amount: string;
  senderName: string;
}

export function useStreamTips(streamId: string) {
  const [latestTip, setLatestTip] = useState<StreamTip | null>(null);

  useEffect(() => {
    // Subscribe to stream tips
    const channel = supabase
      .channel(`stream:${streamId}`)
      .on('broadcast', { event: 'tip' }, ({ payload }) => {
        setLatestTip(payload);
        // Clear tip animation after 5 seconds
        setTimeout(() => setLatestTip(null), 5000);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [streamId]);

  return { latestTip };
}
```