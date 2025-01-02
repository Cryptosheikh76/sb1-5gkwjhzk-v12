import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { generateWaveform } from '../utils/audio';

interface UploadOptions {
  file: File;
  title: string;
  artist?: string;
  tags?: string[];
}

export function useSoundUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadSound = async ({ file, title, artist, tags }: UploadOptions) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Generate waveform data
      const waveform = await generateWaveform(file);

      // Upload to storage
      const filename = `sounds/${user.id}/${Date.now()}-${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Create sound record
      const { error: dbError } = await supabase
        .from('sounds')
        .insert({
          title,
          artist,
          url: fileData.path,
          waveform,
          tags,
          creator_id: user.id
        });

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload sound');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadSound, loading, error };
}