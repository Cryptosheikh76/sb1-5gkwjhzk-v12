import { useVideoFeed } from '../hooks/useVideoFeed';
import { VideoCard } from './VideoCard';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export function VideoFeed() {
  const { videos, loading, hasMore } = useVideoFeed();

  if (!videos.length && loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
      {loading && <LoadingSpinner />}
      {!hasMore && videos.length > 0 && (
        <p className="text-center text-gray-500">No more videos</p>
      )}
    </div>
  );
}