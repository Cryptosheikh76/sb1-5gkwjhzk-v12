import { Button } from '../../../components/ui/Button';
import { useFollowCreator } from '../hooks/useFollowCreator';

interface FollowButtonProps {
  creatorId?: string;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
}

export function FollowButton({
  creatorId,
  isFollowing,
  onFollow,
  onUnfollow
}: FollowButtonProps) {
  const { followCreator, unfollowCreator, loading } = useFollowCreator();

  const handleClick = async () => {
    if (!creatorId) return;

    try {
      if (isFollowing) {
        await unfollowCreator(creatorId);
        onUnfollow();
      } else {
        await followCreator(creatorId);
        onFollow();
      }
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      onClick={handleClick}
      loading={loading}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}