import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

export type DuetLayoutType = 'side-by-side' | 'picture-in-picture' | 'vertical-stack';

interface DuetLayoutProps {
  originalVideo: string;
  duetVideo: string;
  onLayoutChange: (layout: DuetLayoutType) => void;
}

export function DuetLayout({ originalVideo, duetVideo, onLayoutChange }: DuetLayoutProps) {
  const [layout, setLayout] = useState<DuetLayoutType>('side-by-side');

  const handleLayoutChange = (newLayout: DuetLayoutType) => {
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={layout === 'side-by-side' ? 'primary' : 'secondary'}
          onClick={() => handleLayoutChange('side-by-side')}
        >
          Side by Side
        </Button>
        <Button
          variant={layout === 'picture-in-picture' ? 'primary' : 'secondary'}
          onClick={() => handleLayoutChange('picture-in-picture')}
        >
          PiP
        </Button>
        <Button
          variant={layout === 'vertical-stack' ? 'primary' : 'secondary'}
          onClick={() => handleLayoutChange('vertical-stack')}
        >
          Vertical
        </Button>
      </div>

      <div className={`relative aspect-[9/16] bg-black rounded-lg overflow-hidden
        ${layout === 'side-by-side' ? 'grid grid-cols-2 gap-1' :
          layout === 'vertical-stack' ? 'grid grid-rows-2 gap-1' : ''}`}
      >
        <video src={originalVideo} className="w-full h-full object-cover" />
        <video 
          src={duetVideo} 
          className={`w-full h-full object-cover
            ${layout === 'picture-in-picture' ? 'absolute bottom-4 right-4 w-1/3 h-1/3 rounded' : ''}`}
        />
      </div>
    </div>
  );
}