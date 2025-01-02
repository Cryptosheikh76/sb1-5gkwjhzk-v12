import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

interface PlayButtonProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export function PlayButton({ isPlaying, onPlay, onPause }: PlayButtonProps) {
  return (
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
  );
}