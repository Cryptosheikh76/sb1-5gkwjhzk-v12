export interface RevenueStats {
  totalEarnings: string;
  monthlyEarnings: string;
  monthlyGrowth: number;
  pendingEarnings: string;
  revenueByType: {
    nft_sales: string;
    tips: string;
    streams: string;
    engagement: string;
  };
}

export interface PaymentTransaction {
  id: string;
  amount: string;
  type: 'nft_sale' | 'tip' | 'stream' | 'reward';
  status: 'completed' | 'pending' | 'failed';
  transactionHash?: string;
  createdAt: string;
}