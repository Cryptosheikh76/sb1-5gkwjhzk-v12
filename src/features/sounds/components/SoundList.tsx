import { Sound } from '../types';
import { SoundCard } from './SoundCard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface SoundListProps {
  sounds: Sound[];
  loading: boolean;
}

export function SoundList({ sounds, loading }: SoundListProps) {
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sounds.map((sound) => (
        <SoundCard key={sound.id} sound={sound} />
      ))}
    </div>
  );
}