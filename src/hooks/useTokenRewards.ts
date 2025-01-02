```typescript
import { useState } from 'react';
import { useWallet } from './useWallet';
import { distributeEngagementRewards } from '../lib/xrpl/token/distribution';
import { supabase } from '../lib/supabase';

export function useTokenRewards() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processEngagementRewards = async (contentId: string) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      // Get content metrics
      const { data: metrics } = await supabase
        .from('content_metrics')
        .select('*')
        .eq('content_id', contentId)
        .single();

      if (!metrics) throw new Error('Content metrics not found');

      // Get creator address
      const { data: content } = await supabase
        .from('videos')
        .select('creator:users(wallet_address)')
        .eq('id', contentId)
        .single();

      if (!content?.creator?.wallet_address) {
        throw new Error('Creator wallet not found');
      }

      // Distribute rewards
      const txHash = await distributeEngagementRewards(client, {
        contentId,
        creatorAddress: content.creator.wallet_address,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        views: metrics.views
      });

      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processEngagementRewards,
    loading,
    error
  };
}
```