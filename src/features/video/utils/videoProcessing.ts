interface ProcessingOptions {
  startTime?: number;
  endTime?: number;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
  onProgress?: (progress: number) => void;
}

export async function processVideoFile(file: File, options: ProcessingOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const start = options.startTime || 0;
        const end = options.endTime || video.duration;
        const duration = end - start;

        const stream = canvas.captureStream();
        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(new File([blob], file.name, { type: 'video/webm' }));
        };

        video.currentTime = start;
        recorder.start();

        let frameCount = 0;
        const totalFrames = duration * 30; // 30fps

        const processFrame = () => {
          if (video.currentTime < end) {
            if (ctx) {
              ctx.filter = options.filters ? 
                `brightness(${options.filters.brightness}%) ` +
                `contrast(${options.filters.contrast}%) ` +
                `saturate(${options.filters.saturation}%)` : 
                'none';
              
              ctx.drawImage(video, 0, 0);
            }

            frameCount++;
            options.onProgress?.(Math.min((frameCount / totalFrames) * 100, 99));

            video.currentTime += 1/30;
            requestAnimationFrame(processFrame);
          } else {
            recorder.stop();
            options.onProgress?.(100);
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