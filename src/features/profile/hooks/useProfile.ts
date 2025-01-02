```typescript
import { useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import type { User } from '../../auth/types';

interface ProfileUpdate {
  username?: string;
  avatar_url?: string;
  bio?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export function useProfile(userId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (updateError) throw updateError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });

      return publicUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, updateProfile]);

  return {
    updateProfile,
    uploadAvatar,
    loading,
    error
  };
}
```