```typescript
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useStreamQuality } from '../hooks/useStreamQuality';

interface StreamQualitySelectorProps {
  streamId: string;
}

export function StreamQualitySelector({ streamId }: StreamQualitySelectorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { quality, updateQuality, availableQualities } = useStreamQuality();

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
      >
        {quality.height}p{quality.fps}
      </Button>

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
          {availableQualities.map(q => (
            <button
              key={`${q.height}p${q.fps}`}
              className="w-full px-4 py-2 text-left hover:bg-zinc-700 transition-colors"
              onClick={() => {
                updateQuality(q);
                setShowMenu(false);
              }}
            >
              {q.height}p{q.fps} {q.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```