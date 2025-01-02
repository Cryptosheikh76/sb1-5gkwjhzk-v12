import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '../constants/networks';

export function isValidAddress(address: string, chainId: string): boolean {
  switch (chainId) {
    case 'ethereum':
      return ethers.isAddress(address);
    case 'xrpl':
      return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
    case 'solana':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
}

export function isValidNetwork(chainId: string): boolean {
  return SUPPORTED_NETWORKS.some(network => network.id === chainId);
}

export function validateTransaction(amount: string, chainId: string): string | null {
  if (!isValidNetwork(chainId)) {
    return 'Unsupported network';
  }

  try {
    const value = ethers.parseUnits(amount, 18);
    if (value <= BigInt(0)) {
      return 'Amount must be greater than 0';
    }
    return null;
  } catch {
    return 'Invalid amount format';
  }
}