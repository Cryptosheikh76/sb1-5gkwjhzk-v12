import { StreamQuality } from '../../types/stream';
import { formatBitrate, formatResolution } from '../../utils/format';

interface PlayerStatsProps {
  quality: StreamQuality;
}

export function PlayerStats({ quality }: PlayerStatsProps) {
  return (
    <div className="bg-black/80 p-2 rounded text-sm space-y-1">
      <div>Resolution: {formatResolution(quality.width, quality.height)}</div>
      <div>Bitrate: {formatBitrate(quality.bitrate)}</div>
      <div>FPS: {quality.fps}</div>
      <div>Codec: {quality.codec}</div>
    </div>
  );
}