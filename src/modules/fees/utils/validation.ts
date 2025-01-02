import { ethers } from 'ethers';
import { DEFAULT_FEE_CONFIG } from '../config';

export function validateTipAmount(amount: string): string | null {
  try {
    const value = ethers.parseEther(amount);
    
    if (value <= BigInt(0)) {
      return 'Amount must be greater than 0';
    }

    const minAmount = ethers.parseEther(DEFAULT_FEE_CONFIG.minimumFeeAmount);
    if (value < minAmount) {
      return `Minimum amount is ${DEFAULT_FEE_CONFIG.minimumFeeAmount} ETH`;
    }

    const maxAmount = ethers.parseEther('100.0'); // Reasonable maximum for beta
    if (value > maxAmount) {
      return 'Amount exceeds maximum allowed';
    }

    return null;
  } catch {
    return 'Invalid amount format';
  }
}