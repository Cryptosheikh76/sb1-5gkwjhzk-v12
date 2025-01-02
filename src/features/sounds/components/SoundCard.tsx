import { useState, useRef } from 'react';
import { Sound } from '../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

interface SoundCardProps {
  sound: Sound;
}

export function SoundCard({ sound }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="p-4 space-y-3 hover:shadow-neon transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{sound.title}</h3>
          <p className="text-sm text-gray-400">{sound.artist}</p>
        </div>
        <Button
          onClick={togglePlay}
          variant="secondary"
          size="sm"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="h-12 bg-surface-light rounded-lg overflow-hidden">
        {/* Waveform visualization */}
        <div className="flex h-full items-center">
          {sound.waveform.map((value, i) => (
            <div
              key={i}
              className="w-1 mx-px bg-secondary"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Used {sound.usageCount} times
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(sound.url, '_blank')}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
        </Button>
      </div>

      <audio
        ref={audioRef}
        src={sound.url}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </Card>
  );
}