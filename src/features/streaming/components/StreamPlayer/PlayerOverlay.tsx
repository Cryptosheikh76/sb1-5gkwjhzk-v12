import { useState } from 'react';
import { PlayerControls } from './PlayerControls';
import { PlayerStats } from './PlayerStats';
import { StreamQuality } from '../../types/stream';

interface PlayerOverlayProps {
  duration: number;
  currentTime: number;
  volume: number;
  isPlaying: boolean;
  quality: StreamQuality;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onQualityChange: (quality: StreamQuality) => void;
}

export function PlayerOverlay({
  duration,
  currentTime,
  volume,
  isPlaying,
  quality,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onQualityChange
}: PlayerOverlayProps) {
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <div className="absolute top-4 right-4">
        {showStats && <PlayerStats quality={quality} />}
        <button 
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-white/80 hover:text-white"
        >
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </button>
      </div>

      <PlayerControls
        duration={duration}
        currentTime={currentTime}
        volume={volume}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        onVolumeChange={onVolumeChange}
      />
    </>
  );
}