export interface RevenueShare {
  id: string;
  contentId: string;
  contentType: 'video' | 'livestream' | 'sound';
  creatorId: string;
  sharePercentage: number;
  isConfirmed: boolean;
}

export interface Revenue {
  id: string;
  contentId: string;
  amount: string;
  currency: string;
  platformFee: string;
  creatorShares: {
    creatorId: string;
    amount: string;
  }[];
  timestamp: string;
}

export interface RevenueDistribution {
  platformAmount: string;
  creatorShares: {
    creatorId: string;
    amount: string;
  }[];
}