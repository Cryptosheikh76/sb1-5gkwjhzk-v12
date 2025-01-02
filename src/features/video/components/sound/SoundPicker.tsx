import { useState } from 'react';
import { useSoundLibrary } from '../../hooks/useSoundLibrary';
import { Input } from '../../../../components/ui/Input';
import { LoadingSpinner } from '../../../../components/common/LoadingSpinner';

export function SoundPicker() {
  const [search, setSearch] = useState('');
  const { sounds, loading } = useSoundLibrary();

  const filteredSounds = sounds.filter(sound => 
    sound.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search sounds..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredSounds.map(sound => (
            <div 
              key={sound.id}
              className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700"
            >
              <div className="flex-1">
                <p className="font-medium">{sound.title}</p>
                <p className="text-sm text-gray-400">{sound.artist}</p>
              </div>
              <div className="text-sm text-gray-400">
                {Math.round(sound.duration)}s
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}