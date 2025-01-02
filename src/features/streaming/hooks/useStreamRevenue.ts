import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { StreamRevenueType, StreamRevenueConfig } from '../types/revenue';
import { useAuth } from '../../../hooks/useAuth';

const DEFAULT_PRIVATE_SPLIT = 50; // 50/50 split for private streams
const DEFAULT_PUBLIC_SPLIT = 75; // 75/25 split for public streams

export function useStreamRevenue(streamId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const setupRevenueSharing = async (
    revenueType: StreamRevenueType,
    participants: string[],
    customShares?: number[]
  ) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Calculate shares based on stream type
      const defaultShare = revenueType === 'private' 
        ? DEFAULT_PRIVATE_SPLIT 
        : DEFAULT_PUBLIC_SPLIT;

      const shares = customShares || participants.map(() => 
        (100 - defaultShare) / participants.length
      );

      // Create revenue configs
      const configs: Partial<StreamRevenueConfig>[] = [
        // Creator's share
        {
          stream_id: streamId,
          creator_id: user.id,
          share_percentage: defaultShare,
          is_confirmed: true
        },
        // Participant shares
        ...participants.map((participantId, index) => ({
          stream_id: streamId,
          creator_id: user.id,
          participant_id: participantId,
          share_percentage: shares[index],
          is_confirmed: false
        }))
      ];

      const { error: dbError } = await supabase
        .from('stream_revenue_config')
        .insert(configs);

      if (dbError) throw dbError;

      // Update stream revenue type
      await supabase
        .from('streams')
        .update({ revenue_type: revenueType })
        .eq('id', streamId);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup revenue sharing');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmShare = async () => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('stream_revenue_config')
      .update({ is_confirmed: true })
      .eq('stream_id', streamId)
      .eq('participant_id', user.id);

    if (error) throw error;
  };

  return {
    setupRevenueSharing,
    confirmShare,
    loading,
    error
  };
}