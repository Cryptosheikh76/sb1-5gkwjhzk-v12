```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { generateThumbnail } from '../utils/video';

interface UploadOptions {
  file: File;
  title: string;
  description?: string;
  isPublic?: boolean;
}

export function useVideoUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (options: UploadOptions) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Generate thumbnail
      const thumbnail = await generateThumbnail(options.file);

      // Upload video file
      const videoPath = `videos/${user.id}/${Date.now()}-${options.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(videoPath, options.file, {
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });

      if (uploadError) throw uploadError;

      // Create video record
      const { error: dbError } = await supabase
        .from('videos')
        .insert({
          title: options.title,
          description: options.description,
          url: videoPath,
          thumbnail_url: thumbnail,
          creator_id: user.id,
          is_public: options.isPublic
        });

      if (dbError) throw dbError;

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
```