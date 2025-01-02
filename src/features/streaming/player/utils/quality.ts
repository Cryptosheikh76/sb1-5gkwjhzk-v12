import { StreamQuality } from '../../types/stream';
import { PLAYER_SETTINGS } from '../constants';

export function selectOptimalQuality(bandwidth: number): StreamQuality {
  const availableQualities = [...PLAYER_SETTINGS.QUALITY_PRESETS]
    .sort((a, b) => b.bitrate - a.bitrate);

  // Add 20% buffer to required bandwidth
  const targetBitrate = bandwidth * 0.8;

  const optimal = availableQualities.find(q => q.bitrate <= targetBitrate) 
    || availableQualities[availableQualities.length - 1];

  return {
    width: optimal.width,
    height: optimal.height,
    bitrate: optimal.bitrate,
    fps: optimal.fps,
    codec: 'h264'
  };
}

export function estimateBufferSize(quality: StreamQuality): number {
  // Estimate based on bitrate and resolution
  const baseSize = (quality.width * quality.height * quality.fps) / (1920 * 1080 * 60);
  return Math.max(2, Math.min(10, baseSize * PLAYER_SETTINGS.BUFFER_THRESHOLD));
}