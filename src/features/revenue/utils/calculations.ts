import { ethers } from 'ethers';
import { RevenueShare } from '../types';

const PLATFORM_FEE_PERCENTAGE = 20;

export function calculateRevenueSplit(
  amount: string,
  shares: RevenueShare[]
): { platformAmount: string; creatorShares: { creatorId: string; amount: string }[] } {
  const totalAmount = ethers.parseEther(amount);
  
  // Calculate platform fee (20%)
  const platformFee = (totalAmount * BigInt(PLATFORM_FEE_PERCENTAGE)) / BigInt(100);
  
  // Remaining amount for creators
  const remainingAmount = totalAmount - platformFee;
  
  // Calculate creator shares
  const totalShares = shares.reduce((sum, share) => sum + share.sharePercentage, 0);
  const creatorShares = shares.map(share => ({
    creatorId: share.creatorId,
    amount: ethers.formatEther(
      (remainingAmount * BigInt(share.sharePercentage)) / BigInt(totalShares)
    )
  }));

  return {
    platformAmount: ethers.formatEther(platformFee),
    creatorShares
  };
}