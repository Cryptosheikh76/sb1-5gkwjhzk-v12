import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { TransitionType } from '../../../types/editor';

interface TransitionPickerProps {
  onSelect: (transition: TransitionType) => void;
}

export function TransitionPicker({ onSelect }: TransitionPickerProps) {
  const [selected, setSelected] = useState<TransitionType>('none');

  const transitions: TransitionType[] = [
    'none',
    'fade',
    'slide',
    'zoom',
    'rotate',
    'glitch'
  ];

  const handleSelect = (transition: TransitionType) => {
    setSelected(transition);
    onSelect(transition);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {transitions.map(transition => (
        <Button
          key={transition}
          variant={selected === transition ? 'primary' : 'secondary'}
          onClick={() => handleSelect(transition)}
          className="capitalize"
        >
          {transition}
        </Button>
      ))}
    </div>
  );
}