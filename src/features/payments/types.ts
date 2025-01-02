export interface PaymentRequest {
  amount: string;
  currency: string;
  recipientId: string;
  chainId: string;
  metadata?: {
    type: 'tip' | 'purchase' | 'subscription';
    itemId?: string;
    description?: string;
  };
}

export interface PaymentResult {
  transactionHash: string;
  status: 'success' | 'failed';
  timestamp: number;
}

export interface FeeConfig {
  platformFeePercent: number;
  creatorShare: number;
}