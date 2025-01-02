export const PLATFORM_FEE_PERCENT = 5; // 5% platform fee

export function calculateFees(amount: string): {
  platformFee: string;
  creatorAmount: string;
} {
  const value = parseFloat(amount);
  const platformFee = (value * PLATFORM_FEE_PERCENT) / 100;
  const creatorAmount = value - platformFee;

  return {
    platformFee: platformFee.toFixed(6),
    creatorAmount: creatorAmount.toFixed(6)
  };
}