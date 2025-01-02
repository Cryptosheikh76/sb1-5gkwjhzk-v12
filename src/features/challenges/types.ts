export interface Challenge {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  startDate: string;
  endDate: string;
  prize?: {
    amount: string;
    currency: string;
  };
  rules: string[];
  participantCount: number;
  status: 'active' | 'ended';
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  videoId: string;
  creatorId: string;
  votes: number;
  created_at: string;
}