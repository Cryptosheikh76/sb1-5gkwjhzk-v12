import { useState, useEffect, RefObject } from 'react';
import { StreamQuality } from '../types/stream';

export function usePlayerState(videoRef: RefObject<HTMLVideoElement>) {
  const [state, setState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    quality: {
      width: 1920,
      height: 1080,
      bitrate: 6000,
      fps: 60,
      codec: 'h264'
    } as StreamQuality
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers = {
      timeupdate: () => setState(s => ({ ...s, currentTime: video.currentTime })),
      durationchange: () => setState(s => ({ ...s, duration: video.duration })),
      play: () => setState(s => ({ ...s, isPlaying: true })),
      pause: () => setState(s => ({ ...s, isPlaying: false }))
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, []);

  const actions = {
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    setVolume: (value: number) => {
      setState(s => ({ ...s, volume: value }));
      if (videoRef.current) {
        videoRef.current.volume = value / 100;
      }
    },
    setQuality: (quality: StreamQuality) => {
      setState(s => ({ ...s, quality }));
    }
  };

  return { state, actions };
}