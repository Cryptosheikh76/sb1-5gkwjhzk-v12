import { createContext, useContext, useState, useCallback } from 'react';
import type { Stream, StreamQuality } from '../types';
import { STREAM_SETTINGS } from '../constants';

interface StreamContextValue {
  currentStream: Stream | null;
  quality: StreamQuality;
  setCurrentStream: (stream: Stream | null) => void;
  updateQuality: (quality: StreamQuality) => void;
}

const StreamContext = createContext<StreamContextValue | null>(null);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [quality, setQuality] = useState<StreamQuality>({
    ...STREAM_SETTINGS.DEFAULT_RESOLUTION,
    bitrate: STREAM_SETTINGS.DEFAULT_BITRATE,
    fps: STREAM_SETTINGS.DEFAULT_FPS,
    codec: 'h264'
  });

  const updateQuality = useCallback((newQuality: StreamQuality) => {
    setQuality(newQuality);
  }, []);

  return (
    <StreamContext.Provider 
      value={{ 
        currentStream, 
        quality,
        setCurrentStream, 
        updateQuality 
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

export function useStream() {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
}