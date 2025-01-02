import { useQuery } from '../../hooks';
import { Stream } from '../../types';
import { StreamCard } from './StreamCard';
import { Alert, Skeleton } from '../ui';

export function StreamList() {
  const { data: streams, loading, error } = useQuery<Stream[]>('streams');

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Failed to load streams. Please try again later."
      />
    );
  }

  if (!streams?.length) {
    return (
      <Alert
        type="info"
        message="No live streams at the moment. Check back later!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}