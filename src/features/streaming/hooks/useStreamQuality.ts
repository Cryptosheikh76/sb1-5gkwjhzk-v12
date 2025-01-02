import { useState, useCallback } from 'react';
import { STREAM_SETTINGS } from '../constants';
import type { StreamQuality } from '../types';

export function useStreamQuality() {
  const [quality, setQuality] = useState<StreamQuality>({
    ...STREAM_SETTINGS.DEFAULT_RESOLUTION,
    bitrate: STREAM_SETTINGS.DEFAULT_BITRATE,
    fps: STREAM_SETTINGS.DEFAULT_FPS,
    codec: 'h264'
  });

  const updateQuality = useCallback((preset: typeof STREAM_SETTINGS.QUALITY_PRESETS[number]) => {
    setQuality({
      width: preset.width,
      height: preset.height,
      bitrate: preset.bitrate,
      fps: preset.fps,
      codec: 'h264'
    });
  }, []);

  return {
    quality,
    updateQuality,
    availableQualities: STREAM_SETTINGS.QUALITY_PRESETS
  };
}