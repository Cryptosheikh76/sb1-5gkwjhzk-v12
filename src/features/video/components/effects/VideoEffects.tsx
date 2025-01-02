import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

export type EffectType = 'none' | 'glitch' | 'vhs' | 'pixelate' | 'neon';

interface VideoEffectsProps {
  onSelect: (effect: EffectType) => void;
}

export function VideoEffects({ onSelect }: VideoEffectsProps) {
  const [selected, setSelected] = useState<EffectType>('none');

  const effects: EffectType[] = ['none', 'glitch', 'vhs', 'pixelate', 'neon'];

  const handleSelect = (effect: EffectType) => {
    setSelected(effect);
    onSelect(effect);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {effects.map(effect => (
        <Button
          key={effect}
          variant={selected === effect ? 'primary' : 'secondary'}
          onClick={() => handleSelect(effect)}
          className="capitalize"
        >
          {effect}
        </Button>
      ))}
    </div>
  );
}