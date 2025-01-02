import { useState } from 'react';
import { VideoMetadata, VideoEngagement } from '../types';
import { TipButton } from '../../payments/components/TipButton';
import { formatDuration } from '../../../utils/format';
import { EngagementButtons } from '../engagement/EngagementButtons';

interface VideoCardProps {
  video: VideoMetadata;
}

export function VideoCard({ video }: VideoCardProps) {
  const [engagement, setEngagement] = useState<VideoEngagement>({
    likes: 0,
    comments: 0,
    tips: []
  });

  const handleLike = () => {
    setEngagement(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  };

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden relative">
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
        
        <div className="absolute right-4 bottom-20">
          <EngagementButtons
            likes={engagement.likes}
            comments={engagement.comments}
            shares={0}
            onLike={handleLike}
          />
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
      </div>
    </div>
  );
}