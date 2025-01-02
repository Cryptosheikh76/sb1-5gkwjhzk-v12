import { ethers } from 'ethers';
import { TOKEN_DECIMALS } from '../constants/tokens';

export function formatTokenAmount(amount: string, symbol: string): string {
  const decimals = TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] || 18;
  return ethers.formatUnits(amount, decimals);
}

export function parseTokenAmount(amount: string, symbol: string): bigint {
  const decimals = TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] || 18;
  return ethers.parseUnits(amount, decimals);
}