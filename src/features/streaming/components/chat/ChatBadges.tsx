import { Badge } from '../../../../components/ui/Badge';

export interface ChatBadge {
  type: 'moderator' | 'subscriber' | 'founder' | 'vip';
  label: string;
  color: string;
}

interface ChatBadgesProps {
  badges: ChatBadge[];
}

export function ChatBadges({ badges }: ChatBadgesProps) {
  return (
    <div className="flex gap-1">
      {badges.map((badge) => (
        <Badge
          key={badge.type}
          variant="default"
          className={`bg-${badge.color}-500/20 text-${badge.color}-400 text-xs`}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}