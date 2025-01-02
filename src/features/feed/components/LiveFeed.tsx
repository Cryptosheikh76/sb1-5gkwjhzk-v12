```typescript
import { useEffect } from 'react';
import { useLiveStreams } from '../hooks/useLiveStreams';
import { StreamCard } from '../../streaming/components/StreamCard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { useInView } from 'react-intersection-observer';

export function LiveFeed() {
  const { streams, loading, hasMore, loadMore } = useLiveStreams();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (loading && !streams.length) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-4">
      {streams.map((stream, index) => (
        <StreamCard
          key={stream.id}
          stream={stream}
          className={index === streams.length - 1 ? 'pb-20' : ''}
        />
      ))}
      {hasMore && (
        <div ref={ref} className="h-20">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
```