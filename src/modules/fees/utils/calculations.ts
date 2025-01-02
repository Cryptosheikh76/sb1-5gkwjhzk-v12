import { ethers } from 'ethers';
import { FeeConfig, FeeCalculation } from '../types';
import { DEFAULT_FEE_CONFIG } from '../config';
import { FeeCalculationError } from './errors';

export function calculateFees(
  amount: string,
  config: FeeConfig = DEFAULT_FEE_CONFIG
): FeeCalculation {
  try {
    const amountWei = ethers.parseEther(amount);
    if (amountWei <= BigInt(0)) {
      throw new FeeCalculationError('Amount must be greater than 0');
    }

    const feePercent = config.platformFeePercent / 100;
    
    // Calculate fee amount
    let feeAmount = amountWei * BigInt(Math.floor(feePercent * 100)) / BigInt(100);
    
    // Apply minimum/maximum constraints
    const minFeeWei = ethers.parseEther(config.minimumFeeAmount);
    const maxFeeWei = ethers.parseEther(config.maxFeeAmount);
    
    if (feeAmount < minFeeWei) {
      feeAmount = minFeeWei;
    } else if (feeAmount > maxFeeWei) {
      feeAmount = maxFeeWei;
    }
    
    const creatorAmount = amountWei - feeAmount;
    
    return {
      originalAmount: amount,
      feeAmount: ethers.formatEther(feeAmount),
      creatorAmount: ethers.formatEther(creatorAmount)
    };
  } catch (error) {
    if (error instanceof FeeCalculationError) {
      throw error;
    }
    throw new FeeCalculationError('Invalid amount format');
  }
}