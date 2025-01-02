import { ethers } from 'ethers';
import { APP_CONFIG } from './constants';

export const validateEthereumAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const formatEthAmount = (amount: string): string => {
  try {
    return ethers.formatEther(amount);
  } catch {
    return '0';
  }
};

export const validateTipAmount = (amount: string): string | null => {
  try {
    const value = parseFloat(amount);
    if (value < parseFloat(APP_CONFIG.MIN_TIP_AMOUNT)) {
      return `Minimum tip amount is ${APP_CONFIG.MIN_TIP_AMOUNT} ETH`;
    }
    if (value > parseFloat(APP_CONFIG.MAX_TIP_AMOUNT)) {
      return `Maximum tip amount is ${APP_CONFIG.MAX_TIP_AMOUNT} ETH`;
    }
    return null;
  } catch {
    return 'Invalid amount';
  }
};