import { useState, useRef, useEffect } from 'react';
import { Stream, StreamQuality } from '../../types/stream';
import { PlayerOverlay } from './PlayerOverlay';
import { useStreamStatus } from '../../hooks/useStreamStatus';
import { usePlayerState } from '../../hooks/usePlayerState';

interface PlayerCoreProps {
  stream: Stream;
}

export function PlayerCore({ stream }: PlayerCoreProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const status = useStreamStatus(stream.id);
  const { 
    state,
    actions: { play, pause, seek, setVolume, setQuality }
  } = usePlayerState(videoRef);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={stream.url}
        className="w-full h-full"
        playsInline
      />

      <PlayerOverlay
        duration={state.duration}
        currentTime={state.currentTime}
        volume={state.volume}
        isPlaying={state.isPlaying}
        quality={state.quality}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onVolumeChange={setVolume}
        onQualityChange={setQuality}
      />
    </div>
  );
}