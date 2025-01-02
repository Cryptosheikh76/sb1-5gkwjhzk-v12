import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { DuetVideo } from '../types';
import { processVideoFile } from '../../video/utils/videoProcessing';

export function useDuet(originalVideoId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createDuet = async (file: File, layout: DuetVideo['layout']) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Process video file
      const processedFile = await processVideoFile(file, {
        maxSize: 50 * 1024 * 1024 // 50MB for duets
      });

      // Upload to storage
      const filename = `duets/${user.id}/${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, processedFile);

      if (uploadError) throw uploadError;

      // Create duet record
      const { data, error: dbError } = await supabase
        .from('duets')
        .insert({
          original_video_id: originalVideoId,
          creator_id: user.id,
          url: fileData.path,
          layout
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create duet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createDuet, loading, error };
}