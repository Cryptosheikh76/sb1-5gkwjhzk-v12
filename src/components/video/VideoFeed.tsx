import { useQuery } from '../../hooks/useQuery';
import { VideoPlayer } from './VideoPlayer';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Alert } from '../ui/Alert';
import { Video } from '../../types';

export function VideoFeed() {
  const { data: videos, loading, error } = useQuery<Video[]>('videos');

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          message="Failed to load videos. Please try again later."
        />
      </div>
    );
  }

  if (!videos?.length) {
    return (
      <div className="p-4">
        <Alert
          type="info"
          message="No videos found. Check back later for new content!"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
}