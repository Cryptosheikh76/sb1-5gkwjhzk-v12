import { useState } from 'react';
import { Stream } from '../types/stream';
import { Button } from '../../../components/ui/Button';
import { ShareButton } from './ShareButton';
import { TipButton } from './TipButton';
import { FollowButton } from './FollowButton';

interface StreamActionsProps {
  stream: Stream;
}

export function StreamActions({ stream }: StreamActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <FollowButton
        creatorId={stream.creator?.id}
        isFollowing={isFollowing}
        onFollow={() => setIsFollowing(true)}
        onUnfollow={() => setIsFollowing(false)}
      />
      
      <TipButton 
        creatorId={stream.creator?.id}
        creatorAddress={stream.creator?.wallet_address}
      />
      
      <ShareButton
        url={window.location.href}
        title={stream.title}
      />
    </div>
  );
}