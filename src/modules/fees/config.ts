import { FeeConfig } from './types';

export const DEFAULT_FEE_CONFIG: FeeConfig = {
  platformFeePercent: 5, // 5% platform fee
  minimumFeeAmount: '0.001', // Minimum 0.001 ETH
  maxFeeAmount: '1.0' // Maximum 1 ETH fee
};