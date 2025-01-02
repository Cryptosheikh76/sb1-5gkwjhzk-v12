import { useState, useCallback, useEffect } from 'react';
import { PLAYER_SETTINGS, PLAYER_SHORTCUTS } from '../constants';

export function usePlayerControls(videoRef: React.RefObject<HTMLVideoElement>) {
  const [showControls, setShowControls] = useState(true);
  let hideTimeout: NodeJS.Timeout;

  const resetHideTimeout = useCallback(() => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setShowControls(true);
    hideTimeout = setTimeout(() => {
      setShowControls(false);
    }, PLAYER_SETTINGS.AUTO_HIDE_CONTROLS);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!videoRef.current) return;

    switch (e.key) {
      case PLAYER_SHORTCUTS.PLAY_PAUSE:
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        break;
      case PLAYER_SHORTCUTS.MUTE:
        videoRef.current.muted = !videoRef.current.muted;
        break;
      case PLAYER_SHORTCUTS.SEEK_FORWARD:
        videoRef.current.currentTime += PLAYER_SETTINGS.SEEK_STEPS;
        break;
      case PLAYER_SHORTCUTS.SEEK_BACKWARD:
        videoRef.current.currentTime -= PLAYER_SETTINGS.SEEK_STEPS;
        break;
      case PLAYER_SHORTCUTS.VOLUME_UP:
        videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
        break;
      case PLAYER_SHORTCUTS.VOLUME_DOWN:
        videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
        break;
    }

    resetHideTimeout();
  }, [videoRef, resetHideTimeout]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [handleKeyPress]);

  return {
    showControls,
    resetHideTimeout
  };
}