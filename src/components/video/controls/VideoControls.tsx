import { PlayButton } from './PlayButton';
import { ProgressBar } from './ProgressBar';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

export function VideoControls({ 
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeek
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
      <div className="flex items-center mt-2">
        <PlayButton
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
        />
      </div>
    </div>
  );
}