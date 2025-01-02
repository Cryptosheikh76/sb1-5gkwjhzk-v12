export interface ThumbnailOptions {
  width?: number;
  height?: number;
  quality?: number;
  timestamp?: number;
}

export async function generateThumbnail(
  videoFile: File,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    width = 1280,
    height = 720,
    quality = 0.8,
    timestamp = 0
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = width;
      canvas.height = height;
      video.currentTime = timestamp;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      }
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(videoFile);
  });
}