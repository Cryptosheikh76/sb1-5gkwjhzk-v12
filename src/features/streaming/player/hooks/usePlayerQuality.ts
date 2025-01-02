import { useState, useCallback } from 'react';
import { PLAYER_SETTINGS } from '../constants';
import type { StreamQuality } from '../../types/stream';

export function usePlayerQuality() {
  const [quality, setQuality] = useState<StreamQuality>({
    width: 1920,
    height: 1080,
    bitrate: 6000,
    fps: 60,
    codec: 'h264'
  });

  const [isAuto, setIsAuto] = useState(true);

  const selectQuality = useCallback((preset: typeof PLAYER_SETTINGS.QUALITY_PRESETS[number]) => {
    setQuality({
      width: preset.width,
      height: preset.height,
      bitrate: preset.bitrate,
      fps: preset.fps,
      codec: 'h264'
    });
    setIsAuto(false);
  }, []);

  const enableAutoQuality = useCallback(() => {
    setIsAuto(true);
  }, []);

  return {
    quality,
    isAuto,
    selectQuality,
    enableAutoQuality,
    availableQualities: PLAYER_SETTINGS.QUALITY_PRESETS
  };
}