```typescript
import { useEffect } from 'react';
import { useFeedContent } from '../hooks/useFeedContent';
import { VideoCard } from '../../video/components/VideoCard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { useInView } from 'react-intersection-observer';

export function ForYouFeed() {
  const { videos, loading, hasMore, loadMore } = useFeedContent();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (loading && !videos.length) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-4">
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          className={index === videos.length - 1 ? 'pb-20' : ''}
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