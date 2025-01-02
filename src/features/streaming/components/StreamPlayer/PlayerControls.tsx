import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Slider } from '../../../../components/ui/Slider';
import { formatDuration } from '../../../../utils/date';

interface PlayerControlsProps {
  duration: number;
  currentTime: number;
  volume: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function PlayerControls({
  duration,
  currentTime,
  volume,
  isPlaying,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange
}: PlayerControlsProps) {
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <Slider
        value={[currentTime]}
        max={duration}
        onValueChange={([value]) => onSeek(value)}
        className="mb-4"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={isPlaying ? onPause : onPlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowVolume(!showVolume)}
            >
              Volume
            </Button>
            
            {showVolume && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/80 rounded">
                <Slider
                  orientation="vertical"
                  value={[volume]}
                  max={100}
                  onValueChange={([value]) => onVolumeChange(value)}
                  className="h-24"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-sm">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
}