import { useState } from 'react';
import { Slider } from '../../../../components/ui/Slider';

export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

interface VideoFiltersProps {
  onChange: (filters: FilterValues) => void;
}

export function VideoFilters({ onChange }: VideoFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  const handleChange = (key: keyof FilterValues, value: number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm">Brightness</label>
        <Slider
          value={[filters.brightness]}
          min={0}
          max={200}
          onValueChange={([value]) => handleChange('brightness', value)}
        />
      </div>
      <div>
        <label className="text-sm">Contrast</label>
        <Slider
          value={[filters.contrast]}
          min={0}
          max={200}
          onValueChange={([value]) => handleChange('contrast', value)}
        />
      </div>
      <div>
        <label className="text-sm">Saturation</label>
        <Slider
          value={[filters.saturation]}
          min={0}
          max={200}
          onValueChange={([value]) => handleChange('saturation', value)}
        />
      </div>
    </div>
  );
}