import { useState, useRef } from 'react';
import { useStreamConnection } from '../../hooks/useStreamConnection';
import { StreamControls } from './StreamControls';
import { StreamQualitySelector } from './StreamQualitySelector';
import { StreamStats } from './StreamStats';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../ui/Alert';

interface VideoPlayerProps {
  streamId: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ streamId, autoPlay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { stream, loading, error } = useStreamConnection(streamId);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!stream) return <Alert type="error" message="Stream not found" />;

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={stream.url}
        className="w-full h-full"
        autoPlay={autoPlay}
        playsInline
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <StreamControls
          videoRef={videoRef}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <StreamQualitySelector streamId={streamId} />
        <StreamStats streamId={streamId} />
      </div>
    </div>
  );
}