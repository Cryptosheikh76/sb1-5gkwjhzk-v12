import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

const SOUND_CREATOR_SHARE = 25; // 25% for sound creator in content

export function useSoundRevenue(soundId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const setupRevenueShare = async (contentId: string, contentType: 'video' | 'livestream') => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Create revenue share record
      const { error: dbError } = await supabase
        .from('sound_revenue_shares')
        .insert({
          sound_id: soundId,
          creator_id: user.id,
          share_percentage: SOUND_CREATOR_SHARE,
          is_confirmed: true
        });

      if (dbError) throw dbError;

      // Record sound usage
      await supabase
        .from('sound_usage_stats')
        .insert({
          sound_id: soundId,
          content_id: contentId,
          content_type: contentType,
          start_time: 0, // Default to start
          duration: 0 // Will be updated when content is published
        });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup revenue sharing');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    setupRevenueShare,
    loading,
    error
  };
}