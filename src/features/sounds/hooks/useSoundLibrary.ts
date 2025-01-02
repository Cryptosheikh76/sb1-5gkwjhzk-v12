import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Sound } from '../types';

export function useSoundLibrary() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('sound_library')
          .select(`
            *,
            creator:users(username, avatar_url),
            usage_stats:sound_usage_stats(count)
          `)
          .order('usage_count', { ascending: false });

        if (dbError) throw dbError;
        setSounds(data as Sound[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sounds');
      } finally {
        setLoading(false);
      }
    };

    fetchSounds();

    // Subscribe to sound updates
    const subscription = supabase
      .channel('sound_library')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sound_library' 
      }, 
      () => fetchSounds())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { sounds, loading, error };
}