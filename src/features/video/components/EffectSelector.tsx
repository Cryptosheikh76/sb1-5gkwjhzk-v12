import { useState } from 'react';
import { VideoEffect } from '../types';
import { Button } from '../../../components/ui/Button';

interface EffectSelectorProps {
  onSelectEffect: (effect: VideoEffect) => void;
}

export function EffectSelector({ onSelectEffect }: EffectSelectorProps) {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const effects: VideoEffect[] = [
    { type: 'glitch', intensity: 0.5 },
    { type: 'neon', color: '#00ff00' },
    { type: 'cyberpunk' }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {effects.map((effect) => (
        <Button
          key={effect.type}
          onClick={() => {
            setSelectedEffect(effect.type);
            onSelectEffect(effect);
          }}
          variant={selectedEffect === effect.type ? 'primary' : 'secondary'}
          className="aspect-square"
        >
          <span className="capitalize">{effect.type}</span>
        </Button>
      ))}
    </div>
  );
}