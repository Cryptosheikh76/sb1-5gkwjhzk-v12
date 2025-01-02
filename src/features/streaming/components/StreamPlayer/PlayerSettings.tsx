import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { StreamQuality } from '../../types/stream';

interface PlayerSettingsProps {
  quality: StreamQuality;
  onQualityChange: (quality: StreamQuality) => void;
}

export function PlayerSettings({ quality, onQualityChange }: PlayerSettingsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const qualities: StreamQuality[] = [
    { width: 1920, height: 1080, bitrate: 6000, fps: 60, codec: 'h264' },
    { width: 1280, height: 720, bitrate: 4500, fps: 60, codec: 'h264' },
    { width: 852, height: 480, bitrate: 2500, fps: 30, codec: 'h264' }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setShowMenu(!showMenu)}
      >
        Settings
      </Button>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-black/80 rounded min-w-[200px]">
          <div className="space-y-2">
            <p className="text-sm font-medium px-2">Quality</p>
            {qualities.map((q) => (
              <button
                key={`${q.width}x${q.height}`}
                className={`w-full px-2 py-1 text-left text-sm rounded hover:bg-white/10 ${
                  q.width === quality.width ? 'bg-white/20' : ''
                }`}
                onClick={() => {
                  onQualityChange(q);
                  setShowMenu(false);
                }}
              >
                {q.height}p {q.fps}fps
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}