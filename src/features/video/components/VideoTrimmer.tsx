import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Slider } from '../../../components/ui/Slider';

interface VideoTrimmerProps {
  videoFile: File;
  onTrim: (start: number, end: number) => void;
}

export function VideoTrimmer({ videoFile, onTrim }: VideoTrimmerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEndTime(videoRef.current.duration);
    }
  };

  const handleTrim = () => {
    onTrim(startTime, endTime);
  };

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        src={URL.createObjectURL(videoFile)}
        className="w-full rounded-lg"
        onLoadedMetadata={handleLoadedMetadata}
        controls
      />

      <div className="px-4">
        <Slider
          min={0}
          max={duration}
          value={[startTime, endTime]}
          onValueChange={([start, end]) => {
            setStartTime(start);
            setEndTime(end);
          }}
          step={0.1}
        />
        
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{startTime.toFixed(1)}s</span>
          <span>{endTime.toFixed(1)}s</span>
        </div>
      </div>

      <Button onClick={handleTrim} fullWidth>
        Trim Video
      </Button>
    </div>
  );
}