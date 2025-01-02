import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useVideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadVideo = async (file: File, title: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Upload to storage
      const filename = `videos/${user.id}/${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, file, {
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });

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

      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadVideo,
    uploading,
    progress,
    error
  };
}