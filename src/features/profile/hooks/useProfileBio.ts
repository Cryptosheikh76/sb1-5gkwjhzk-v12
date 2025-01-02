import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { ProfileUpdateData } from '../types';
import { useAuth } from '../../../hooks/useAuth';

export function useProfileBio() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}