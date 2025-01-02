import { Challenge } from '../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatRelativeTime } from '../../../utils/date';

interface ChallengeCardProps {
  challenge: Challenge;
  onParticipate: () => void;
}

export function ChallengeCard({ challenge, onParticipate }: ChallengeCardProps) {
  const isActive = new Date(challenge.endDate) > new Date();

  return (
    <Card className="overflow-hidden hover:shadow-neon transition-shadow duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">{challenge.title}</h3>
            <p className="text-sm text-gray-400">
              {formatRelativeTime(challenge.startDate)}
            </p>
          </div>
          <Badge variant={isActive ? 'success' : 'error'}>
            {isActive ? 'Active' : 'Ended'}
          </Badge>
        </div>

        <p className="text-sm">{challenge.description}</p>

        {challenge.prize && (
          <div className="bg-surface-light p-3 rounded-lg">
            <p className="text-sm font-medium">
              Prize: {challenge.prize.amount} {challenge.prize.currency}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {challenge.participantCount} participants
          </span>
          <Button
            onClick={onParticipate}
            disabled={!isActive}
          >
            Participate
          </Button>
        </div>
      </div>
    </Card>
  );
}