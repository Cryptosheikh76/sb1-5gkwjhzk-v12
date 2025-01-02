import { ethers } from 'ethers';
import { ENV } from '../utils/env';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletError';
  }
}

export async function getProvider(chainId?: string) {
  if (typeof window.ethereum === 'undefined') {
    throw new WalletError('Please install MetaMask to use this feature');
  }

  try {
    return new ethers.BrowserProvider(window.ethereum);
  } catch (error) {
    throw new WalletError('Failed to connect to wallet provider');
  }
}

export async function connectWallet() {
  const provider = await getProvider();
  
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return provider.getSigner();
  } catch (error) {
    if (error instanceof Error) {
      throw new WalletError(error.message);
    }
    throw new WalletError('Failed to connect wallet');
  }
}