import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface VideoControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function VideoControls({ isPlaying, onPlay, onPause }: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}