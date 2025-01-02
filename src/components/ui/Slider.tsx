import { useState } from 'react';
import { cn } from '../../utils/styles';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange?: (value: number[]) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  orientation = 'horizontal',
  className
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onValueChange?.([newValue]);
  };

  return (
    <div 
      className={cn(
        'relative',
        orientation === 'vertical' ? 'h-full w-2' : 'w-full h-2',
        className
      )}
    >
      <div className="absolute inset-0 bg-zinc-700 rounded-full">
        <div
          className="absolute bg-primary rounded-full"
          style={{
            [orientation === 'vertical' ? 'height' : 'width']: `${getPercentage(value[0])}%`
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        className={cn(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
          isDragging && 'cursor-grabbing'
        )}
      />
    </div>
  );
}