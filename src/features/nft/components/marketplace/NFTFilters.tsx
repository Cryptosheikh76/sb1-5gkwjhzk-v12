```typescript
import { Button } from '../../../../components/ui/Button';
import { Slider } from '../../../../components/ui/Slider';

interface NFTFiltersProps {
  filters: {
    type: string;
    priceRange: [number, number];
    hasShipping: boolean;
  };
  onChange: (filters: any) => void;
}

export function NFTFilters({ filters, onChange }: NFTFiltersProps) {
  const types = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'merch', label: 'Merchandise' },
    { id: 'ticket', label: 'Tickets' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {types.map(type => (
          <Button
            key={type.id}
            variant={filters.type === type.id ? 'primary' : 'secondary'}
            onClick={() => onChange({ ...filters, type: type.id })}
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price Range (AGC)</label>
        <Slider
          value={filters.priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={(value) => onChange({ ...filters, priceRange: value })}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.hasShipping}
          onChange={(e) => onChange({ ...filters, hasShipping: e.target.checked })}
        />
        <span>Physical Items Only</span>
      </label>
    </div>
  );
}
```