import { useState } from 'react';
import { useEngagementRewards } from '../../hooks/useEngagementRewards';
import { Button } from '../ui/Button';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface EngagementButtonsProps {
  contentId: string;
  creatorAddress: string;
  initialMetrics: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export function EngagementButtons({ 
  contentId, 
  creatorAddress,
  initialMetrics 
}: EngagementButtonsProps) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [isLiked, setIsLiked] = useState(false);
  const { processRewards } = useEngagementRewards();

  const handleLike = async () => {
    if (isLiked) return;
    
    setIsLiked(true);
    setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
    
    try {
      await processRewards(contentId, creatorAddress);
    } catch (error) {
      console.error('Failed to process rewards:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        variant="ghost" 
        onClick={handleLike}
        className="group flex flex-col items-center"
      >
        <div className="p-3 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700/80">
          {isLiked ? (
            <HeartSolidIcon className="w-6 h-6 text-red-500" />
          ) : (
            <HeartIcon className="w-6 h-6" />
          )}
        </div>
        <span className="text-sm mt-1">{metrics.likes}</span>
      </Button>

      <Button 
        variant="ghost"
        className="group flex flex-col items-center"
      >
        <div className="p-3 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700/80">
          <ChatBubbleLeftIcon className="w-6 h-6" />
        </div>
        <span className="text-sm mt-1">{metrics.comments}</span>
      </Button>

      <Button 
        variant="ghost"
        className="group flex flex-col items-center"
      >
        <div className="p-3 rounded-full bg-zinc-800/80 group-hover:bg-zinc-700/80">
          <ShareIcon className="w-6 h-6" />
        </div>
        <span className="text-sm mt-1">{metrics.shares}</span>
      </Button>
    </div>
  );
}