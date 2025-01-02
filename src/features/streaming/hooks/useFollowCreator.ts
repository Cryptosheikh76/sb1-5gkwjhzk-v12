import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export function useFollowCreator() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const followCreator = async (creatorId: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          creator_id: creatorId
        });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const unfollowCreator = async (creatorId: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('creator_id', creatorId);

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    followCreator,
    unfollowCreator,
    loading
  };
}