import { APP_CONFIG } from './constants';

export function validateVideoFile(file: File): string | null {
  if (file.size > APP_CONFIG.MAX_VIDEO_SIZE) {
    return `File size must be less than ${APP_CONFIG.MAX_VIDEO_SIZE / (1024 * 1024)}MB`;
  }

  if (!APP_CONFIG.SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
    return 'Unsupported video format. Please use MP4 or WebM.';
  }

  return null;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export async function generateThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 1; // Capture frame at 1 second
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      }
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(videoFile);
  });
}