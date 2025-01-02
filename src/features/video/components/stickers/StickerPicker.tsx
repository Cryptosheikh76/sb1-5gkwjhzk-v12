import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { LoadingSpinner } from '../../../../components/common/LoadingSpinner';
import { useStickerLibrary } from '../../hooks/useStickerLibrary';

interface StickerPickerProps {
  onSelect: (url: string) => void;
}

export function StickerPicker({ onSelect }: StickerPickerProps) {
  const [search, setSearch] = useState('');
  const { stickers, loading } = useStickerLibrary();

  const filteredStickers = stickers.filter(sticker =>
    sticker.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search stickers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto p-2">
          {filteredStickers.map(sticker => (
            <button
              key={sticker.id}
              onClick={() => onSelect(sticker.url)}
              className="aspect-square p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              <img
                src={sticker.url}
                alt={sticker.tags.join(', ')}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}