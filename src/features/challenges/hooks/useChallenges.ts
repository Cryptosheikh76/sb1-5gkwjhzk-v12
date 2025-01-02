import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Challenge, ChallengeEntry } from '../types';
import { useAuth } from '../../../hooks/useAuth';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .eq('status', 'active')
        .order('participant_count', { ascending: false });

      if (data) setChallenges(data as Challenge[]);
      setLoading(false);
    };

    fetchChallenges();
  }, []);

  const submitEntry = async (challengeId: string, videoId: string) => {
    if (!user) throw new Error('Must be logged in');

    const { error } = await supabase
      .from('challenge_entries')
      .insert({
        challenge_id: challengeId,
        video_id: videoId,
        creator_id: user.id
      });

    if (error) throw error;
  };

  return { challenges, loading, submitEntry };
}