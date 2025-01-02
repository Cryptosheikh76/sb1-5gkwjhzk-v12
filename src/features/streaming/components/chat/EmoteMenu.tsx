import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface Emote {
  id: string;
  code: string;
  url: string;
}

export function EmoteMenu() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'recent' | 'channel' | 'global'>('recent');

  const categories = [
    { id: 'recent', label: 'Recent' },
    { id: 'channel', label: 'Channel' },
    { id: 'global', label: 'Global' }
  ];

  // Mock emotes - replace with real data
  const emotes: Emote[] = [
    { id: '1', code: 'Kappa', url: '/emotes/kappa.png' },
    { id: '2', code: 'PogChamp', url: '/emotes/pogchamp.png' }
  ];

  const filteredEmotes = emotes.filter(emote => 
    emote.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-2 bg-zinc-900 rounded-lg w-72">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search emotes..."
        className="mb-2"
      />

      <div className="flex gap-1 mb-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            size="sm"
            variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-1 max-h-60 overflow-y-auto">
        {filteredEmotes.map(emote => (
          <button
            key={emote.id}
            className="p-1 hover:bg-zinc-800 rounded"
            title={emote.code}
          >
            <img src={emote.url} alt={emote.code} className="w-8 h-8" />
          </button>
        ))}
      </div>
    </div>
  );
}