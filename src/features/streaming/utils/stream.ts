export function generateStreamKey(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${userId}_${timestamp}_${random}`;
}

export function validateStreamSettings(settings: any): string[] {
  const errors: string[] = [];
  
  if (!settings.title) {
    errors.push('Stream title is required');
  }
  
  if (settings.title && settings.title.length > 100) {
    errors.push('Stream title must be less than 100 characters');
  }

  if (settings.bitrate && (settings.bitrate < 1000 || settings.bitrate > 8000)) {
    errors.push('Bitrate must be between 1000 and 8000 Kbps');
  }

  if (settings.fps && ![30, 60].includes(settings.fps)) {
    errors.push('FPS must be either 30 or 60');
  }

  return errors;
}

export function getStreamUrl(streamKey: string): string {
  return `${window.location.protocol}//${window.location.host}/live/${streamKey}`;
}