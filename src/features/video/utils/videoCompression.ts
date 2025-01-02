export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetSize?: number; // in bytes
}

export async function compressVideo(
  file: File, 
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    targetSize = 100 * 1024 * 1024 // 100MB
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Set up MediaRecorder with compression
        const stream = canvas.captureStream();
        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: Math.floor((targetSize * 8) / (video.duration))
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(new File([blob], file.name, { type: 'video/webm' }));
        };

        recorder.start();

        const processFrame = () => {
          if (video.currentTime < video.duration) {
            if (ctx) {
              ctx.drawImage(video, 0, 0, width, height);
            }
            video.currentTime += 1/30; // 30fps
            requestAnimationFrame(processFrame);
          } else {
            recorder.stop();
          }
        };

        processFrame();
      };

      video.src = URL.createObjectURL(file);

    } catch (error) {
      reject(error);
    }
  });
}