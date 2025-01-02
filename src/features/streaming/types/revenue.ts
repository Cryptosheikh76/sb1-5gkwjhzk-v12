export type StreamRevenueType = 'public' | 'private';

export interface StreamRevenueConfig {
  id: string;
  streamId: string;
  creatorId: string;
  participantId?: string;
  sharePercentage: number;
  isConfirmed: boolean;
}

export interface StreamRevenueShare {
  id: string;
  streamId: string;
  creatorId: string;
  amount: string;
  transactionHash?: string;
}