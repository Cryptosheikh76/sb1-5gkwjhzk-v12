import { useEffect } from 'react';
import { useStreamViewer } from '../hooks/useStreamViewer';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

interface StreamViewerProps {
  streamId: string;
}

export function StreamViewer({ streamId }: StreamViewerProps) {
  const { connection, loading, error, joinStream, leaveStream } = useStreamViewer(streamId);

  useEffect(() => {
    joinStream();
    return () => leaveStream();
  }, [streamId]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={(video) => {
          if (video && connection?.peerConnection) {
            video.srcObject = new MediaStream(
              connection.peerConnection.getReceivers().map(r => r.track)
            );
          }
        }}
        autoPlay
        playsInline
        className="w-full h-full"
      />
    </div>
  );
}