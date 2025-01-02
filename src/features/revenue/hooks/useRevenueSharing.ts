import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { RevenueShare } from '../types';
import { calculateRevenueSplit } from '../utils/calculations';
import { useAuth } from '../../../hooks/useAuth';

export function useRevenueSharing(contentId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createRevenueShare = async (
    contentType: RevenueShare['contentType'],
    collaboratorIds: string[],
    customShares?: number[]
  ) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // For duets, enforce 50/50 split
      const shares = contentType === 'video' 
        ? [50, 50] 
        : customShares || collaboratorIds.map(() => 100 / collaboratorIds.length);

      const revenueShares = collaboratorIds.map((creatorId, index) => ({
        content_id: contentId,
        content_type: contentType,
        creator_id: creatorId,
        share_percentage: shares[index],
        is_confirmed: creatorId === user.id // Auto-confirm for the creator
      }));

      const { error: dbError } = await supabase
        .from('revenue_shares')
        .insert(revenueShares);

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set up revenue sharing');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmRevenueShare = async () => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('revenue_shares')
      .update({ is_confirmed: true })
      .eq('content_id', contentId)
      .eq('creator_id', user.id);

    if (error) throw error;
  };

  return {
    createRevenueShare,
    confirmRevenueShare,
    loading,
    error
  };
}