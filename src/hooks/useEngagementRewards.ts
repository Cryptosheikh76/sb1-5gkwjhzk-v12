import { useState } from 'react';
import { useWallet } from './useWallet';
import { calculateEngagementRewards, distributeRewards } from '../lib/xrpl/rewards';
import { supabase } from '../lib/supabase';

export function useEngagementRewards() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processRewards = async (contentId: string, creatorAddress: string) => {
    if (!client) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      // Get engagement metrics
      const { data: metrics } = await supabase
        .from('content_metrics_v2')
        .select('views, likes, comments')
        .eq('content_id', contentId)
        .single();

      if (!metrics) throw new Error('Content metrics not found');

      // Calculate reward amount
      const rewardAmount = await calculateEngagementRewards({
        likes: metrics.likes,
        comments: metrics.comments,
        shares: 0, // Add shares tracking
        views: metrics.views
      });

      // Distribute tokens
      const txHash = await distributeRewards(client, creatorAddress, rewardAmount);

      // Record distribution
      await supabase.from('token_distributions').insert({
        content_id: contentId,
        creator_address: creatorAddress,
        amount: rewardAmount,
        transaction_hash: txHash
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
    processRewards,
    loading,
    error
  };
}