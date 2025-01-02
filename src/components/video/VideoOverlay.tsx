import { VideoMetadata } from '../../types';
import { formatDuration } from '../../utils/format';

interface VideoOverlayProps {
  video: VideoMetadata;
}

export function VideoOverlay({ video }: VideoOverlayProps) {
  return (
    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm">
      {formatDuration(video.duration)}
    </div>
  );
}