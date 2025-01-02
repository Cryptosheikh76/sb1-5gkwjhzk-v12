import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { processVideoFile } from '../utils/videoProcessing';
import { useAuth } from '../../../hooks/useAuth';

interface VideoProcessingOptions {
  file: File;
  title: string;
  startTime?: number;
  endTime?: number;
}

export function useVideoEditor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const processVideo = async ({ file, title, startTime, endTime }: VideoProcessingOptions) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Process video file (trim, compress, etc)
      const processedFile = await processVideoFile(file, {
        startTime,
        endTime,
        maxSize: 100 * 1024 * 1024 // 100MB
      });

      // Upload to storage
      const filename = `${user.id}/${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, processedFile);

      if (uploadError) throw uploadError;

      // Create video record
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          title,
          url: fileData.path,
          user_id: user.id
        });

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { processVideo, loading, error };
}