import { useStreams } from '../hooks/useStreams';
import { StreamPreview } from './StreamPreview';
import { Alert } from '../../../components/ui/Alert';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

export function StreamGrid() {
  const { streams, loading, error } = useStreams();

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!streams?.length) {
    return <Alert type="info" message="No live streams available" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <StreamPreview key={stream.id} streamId={stream.id} />
      ))}
    </div>
  );
}