import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Slider } from '../../../components/ui/Slider';

interface VideoFiltersProps {
  onApplyFilters: (filters: VideoFilters) => void;
}

interface VideoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
}

export function VideoFilters({ onApplyFilters }: VideoFiltersProps) {
  const [filters, setFilters] = useState<VideoFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100
  });

  const handleFilterChange = (filter: keyof VideoFilters, value: number) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Brightness</label>
        <Slider
          min={0}
          max={200}
          value={[filters.brightness]}
          onValueChange={([value]) => handleFilterChange('brightness', value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Contrast</label>
        <Slider
          min={0}
          max={200}
          value={[filters.contrast]}
          onValueChange={([value]) => handleFilterChange('contrast', value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Saturation</label>
        <Slider
          min={0}
          max={200}
          value={[filters.saturation]}
          onValueChange={([value]) => handleFilterChange('saturation', value)}
        />
      </div>

      <Button onClick={() => onApplyFilters(filters)} fullWidth>
        Apply Filters
      </Button>
    </div>
  );
}