import { VideoMetadata } from '../../types';
import { TipButton } from '../payments/TipButton';

interface VideoInfoProps {
  video: VideoMetadata;
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{video.title}</h3>
          <p className="text-sm text-gray-400">{video.creator?.username}</p>
        </div>
        <TipButton recipientId={video.creatorId} />
      </div>
      <p className="mt-2 text-sm text-gray-300">{video.description}</p>
    </div>
  );
}