export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface FeeConfig {
  readonly platformFeePercent: number;
  readonly minimumFeeAmount: string;
  readonly maxFeeAmount: string;
}

export interface FeeCalculation {
  readonly originalAmount: string;
  readonly feeAmount: string;
  readonly creatorAmount: string;
}

export interface FeeTransaction {
  readonly id: string;
  readonly creatorId: string;
  readonly amount: string;
  readonly feeAmount: string;
  readonly creatorAmount: string;
  readonly timestamp: string;
  readonly status: TransactionStatus;
}