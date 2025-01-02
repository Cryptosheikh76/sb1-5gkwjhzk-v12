import { useStreamData } from '../hooks/useStreamData';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface StreamPreviewProps {
  streamId: string;
  className?: string;
}

export function StreamPreview({ streamId, className }: StreamPreviewProps) {
  const { stream, loading } = useStreamData(streamId);

  if (loading) return <LoadingSpinner />;
  if (!stream) return null;

  return (
    <Card className={className}>
      <div className="relative aspect-video bg-gradient-to-br from-surface to-background overflow-hidden rounded-t-lg">
        {stream.thumbnail_url ? (
          <img 
            src={stream.thumbnail_url} 
            alt={stream.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-text-secondary">No Preview Available</div>
          </div>
        )}
        {stream.is_live && (
          <Badge 
            variant="error"
            className="absolute top-2 left-2"
          >
            LIVE
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-text-primary">{stream.title}</h3>
        <p className="text-sm text-text-secondary mt-1">
          {stream.creator?.username}
        </p>
      </div>
    </Card>
  );
}