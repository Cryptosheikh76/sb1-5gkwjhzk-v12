import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const colors = [
    '#FFFFFF', '#FF1B6B', '#00A3FF', '#FFB800',
    '#FF4B4B', '#00FF00', '#FF00FF', '#FFFF00'
  ];

  return (
    <div className="relative">
      <Button
        onClick={() => setShowPicker(!showPicker)}
        className="w-8 h-8 p-0"
        style={{ backgroundColor: value }}
      />
      
      {showPicker && (
        <div className="absolute top-full mt-2 p-2 bg-zinc-800 rounded-lg grid grid-cols-4 gap-1">
          {colors.map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setShowPicker(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}