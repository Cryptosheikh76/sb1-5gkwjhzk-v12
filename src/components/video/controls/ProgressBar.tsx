interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="w-full h-1 bg-white/20 rounded cursor-pointer"
         onClick={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           const percent = (e.clientX - rect.left) / rect.width;
           onSeek(percent * duration);
         }}>
      <div 
        className="h-full bg-primary rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}