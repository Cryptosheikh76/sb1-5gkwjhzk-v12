import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { ColorPicker } from './ColorPicker';
import { FontPicker } from './FontPicker';
import { TextAnimation } from './TextAnimation';
import { TextPosition } from '../../../types/editor';

interface TextOverlayProps {
  onAdd: (text: TextPosition) => void;
}

export function TextOverlay({ onAdd }: TextOverlayProps) {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [font, setFont] = useState('Inter');
  const [animation, setAnimation] = useState<string>('none');

  const handleAdd = () => {
    if (!text.trim()) return;
    
    onAdd({
      text,
      color,
      font,
      animation,
      position: { x: 50, y: 50 }, // Default center position
      scale: 1,
      rotation: 0
    });
    
    setText('');
  };

  return (
    <div className="space-y-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
      />
      
      <div className="flex gap-2">
        <ColorPicker value={color} onChange={setColor} />
        <FontPicker value={font} onChange={setFont} />
        <TextAnimation value={animation} onChange={setAnimation} />
      </div>

      <Button onClick={handleAdd} disabled={!text.trim()}>
        Add Text
      </Button>
    </div>
  );
}