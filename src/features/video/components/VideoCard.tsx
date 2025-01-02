import { useState } from 'react';
import { VideoMetadata, VideoEngagement } from '../types';
import { TipButton } from '../../payments/components/TipButton';
import { formatDuration } from '../../../utils/format';

interface VideoCardProps {
  video: VideoMetadata;
}

export function VideoCard({ video }: VideoCardProps) {
  const [engagement, setEngagement] = useState<VideoEngagement>({
    likes: 0,
    comments: 0,
    tips: []
  });

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="aspect-[9/16] relative">
        <video
          src={`https://ipfs.io/ipfs/${video.ipfsHash}`}
          poster={video.thumbnailUrl}
          className="w-full h-full object-cover"
          controls
        />
        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-400">{video.creator?.username}</p>
          </div>
          <TipButton recipientId={video.creatorId} />
        </div>
        
        <p className="mt-2 text-sm text-gray-300">{video.description}</p>
        
        <div className="mt-3 flex gap-4 text-sm text-gray-400">
          <span>{engagement.likes} likes</span>
          <span>{engagement.comments} comments</span>
          {engagement.tips.length > 0 && (
            <span>{engagement.tips.length} tips</span>
          )}
        </div>
      </div>
    </div>
  );
}