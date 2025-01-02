import { ChatBadge } from '../components/chat/ChatBadges';

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  badges?: ChatBadge[];
  isDeleted?: boolean;
  isHighlighted?: boolean;
}

export interface ChatSettings {
  slowMode: boolean;
  slowModeDelay: number;
  followersOnly: boolean;
  subscribersOnly: boolean;
  emoteOnly: boolean;
  blockedWords: string[];
}