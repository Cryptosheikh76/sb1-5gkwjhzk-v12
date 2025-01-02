```typescript
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/components/AuthProvider';
import { processVideoFile } from '../../video/utils/videoProcessing';

export function useStitch(originalVideoId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();

      return stream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      throw err;
    }
  };

  const stopRecording = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  };

  const uploadStitch = async (videoBlob: string | Blob, caption: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Convert blob URL to file if needed
      const file = videoBlob instanceof Blob ? 
        videoBlob : 
        await fetch(videoBlob).then(r => r.blob());

      // Process video file
      const processedFile = await processVideoFile(new File([file], 'stitch.webm', { type: 'video/webm' }), {
        maxSize: 50 * 1024 * 1024 // 50MB for stitches
      });

      // Upload to storage
      const filename = `stitches/${user.id}/${Date.now()}.webm`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, processedFile);

      if (uploadError) throw uploadError;

      // Create stitch record
      const { error: dbError } = await supabase
        .from('stitches')
        .insert({
          original_video_id: originalVideoId,
          creator_id: user.id,
          url: fileData.path,
          caption
        });

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload stitch');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    startRecording,
    stopRecording,
    uploadStitch,
    loading,
    error
  };
}
```