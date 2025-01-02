import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { processVideoFile } from '../../video/utils/videoProcessing';

export function useDuet(originalVideoId: string) {
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

  const uploadDuet = async (videoBlob: string | Blob, layout: 'side-by-side' | 'picture-in-picture') => {
    if (!user) throw new Error('Must be logged in');

    try {
      setLoading(true);
      setError(null);

      // Convert blob URL to file if needed
      const file = videoBlob instanceof Blob ? 
        videoBlob : 
        await fetch(videoBlob).then(r => r.blob());

      // Process video file
      const processedFile = await processVideoFile(new File([file], 'duet.webm', { type: 'video/webm' }), {
        maxSize: 50 * 1024 * 1024 // 50MB for duets
      });

      // Upload to storage
      const filename = `duets/${user.id}/${Date.now()}.webm`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, processedFile);

      if (uploadError) throw uploadError;

      // Create duet record
      const { error: dbError } = await supabase
        .from('duets')
        .insert({
          original_video_id: originalVideoId,
          creator_id: user.id,
          url: fileData.path,
          layout
        });

      if (dbError) throw dbError;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload duet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    startRecording,
    stopRecording,
    uploadDuet,
    loading,
    error
  };
}