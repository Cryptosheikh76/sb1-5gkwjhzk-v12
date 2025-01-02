import { useState, useCallback } from 'react';
import { videoApi } from '../../services/api/videoApi';
import { handleStreamError } from '../../utils/errors';
import type { Video } from '../../types';

interface UploadProgress {
  progress: number;
  uploading: boolean;
  error: string | null;
}

export function useVideoUpload() {
  const [state, setState] = useState<UploadProgress>({
    progress: 0,
    uploading: false,
    error: null
  });

  const uploadVideo = useCallback(async (
    userId: string,
    file: File,
    description: string
  ): Promise<Video | null> => {
    setState({ progress: 0, uploading: true, error: null });
    
    try {
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 500);

      const video = await videoApi.createVideo(userId, file, description);

      clearInterval(progressInterval);
      setState(prev => ({ ...prev, progress: 100, uploading: false }));
      
      return video;
    } catch (e) {
      setState(prev => ({
        ...prev,
        error: handleStreamError(e),
        uploading: false
      }));
      return null;
    }
  }, []);

  return {
    ...state,
    uploadVideo
  };
}