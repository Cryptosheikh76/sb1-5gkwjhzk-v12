import { useState } from 'react';
import { VideoProcessingOptions } from '../types';
import { processVideoFile } from '../utils/videoProcessing';

export function useVideoProcessing() {
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processVideo = async (file: File, options: VideoProcessingOptions) => {
    try {
      setProcessing(true);
      setProgress(0);
      setError(null);

      const processedFile = await processVideoFile(file, {
        ...options,
        onProgress: (percent) => setProgress(percent)
      });

      return processedFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process video');
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return { processVideo, progress, processing, error };
}