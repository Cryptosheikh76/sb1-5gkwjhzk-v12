import { useState, useEffect } from 'react';
import type { StreamQuality } from '../../types/stream';

interface PlayerStats {
  bufferHealth: number;
  droppedFrames: number;
  bandwidth: number;
  latency: number;
}

export function usePlayerStats(videoRef: React.RefObject<HTMLVideoElement>) {
  const [stats, setStats] = useState<PlayerStats>({
    bufferHealth: 0,
    droppedFrames: 0,
    bandwidth: 0,
    latency: 0
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateStats = () => {
      setStats({
        bufferHealth: video.buffered.length ? 
          video.buffered.end(video.buffered.length - 1) - video.currentTime : 0,
        droppedFrames: 0, // Would come from media source extension
        bandwidth: 0, // Would come from media source extension
        latency: 0 // Would come from stream source
      });
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [videoRef]);

  return stats;
}