import { ethers } from 'ethers';
import { APP_CONFIG } from '../constants';

export interface PaymentValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePaymentAmount(amount: string): PaymentValidationResult {
  try {
    const value = ethers.parseEther(amount);
    
    if (value <= BigInt(0)) {
      return {
        isValid: false,
        error: 'Amount must be greater than 0'
      };
    }

    const minValue = ethers.parseEther(APP_CONFIG.MIN_TIP_AMOUNT);
    if (value < minValue) {
      return {
        isValid: false,
        error: `Minimum amount is ${APP_CONFIG.MIN_TIP_AMOUNT} ETH`
      };
    }

    const maxValue = ethers.parseEther(APP_CONFIG.MAX_TIP_AMOUNT);
    if (value > maxValue) {
      return {
        isValid: false,
        error: `Maximum amount is ${APP_CONFIG.MAX_TIP_AMOUNT} ETH`
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Invalid amount format'
    };
  }
}

export function validateRecipientAddress(address: string): PaymentValidationResult {
  if (!address) {
    return {
      isValid: false,
      error: 'Recipient address is required'
    };
  }

  if (!ethers.isAddress(address)) {
    return {
      isValid: false,
      error: 'Invalid Ethereum address'
    };
  }

  return { isValid: true };
}

export function validateGasLimit(gasLimit: bigint): PaymentValidationResult {
  const minGas = BigInt(21000); // Minimum gas for ETH transfer
  const maxGas = BigInt(300000); // Reasonable maximum

  if (gasLimit < minGas) {
    return {
      isValid: false,
      error: 'Gas limit too low'
    };
  }

  if (gasLimit > maxGas) {
    return {
      isValid: false,
      error: 'Gas limit too high'
    };
  }

  return { isValid: true };
}

export function validateTransactionSpeed(
  maxFeePerGas: bigint,
  maxPriorityFeePerGas: bigint
): PaymentValidationResult {
  const minPriorityFee = ethers.parseUnits("1", "gwei");
  const maxPriorityFee = ethers.parseUnits("100", "gwei");
  const maxTotalFee = ethers.parseUnits("500", "gwei");

  if (maxPriorityFeePerGas < minPriorityFee) {
    return {
      isValid: false,
      error: 'Priority fee too low for current network conditions'
    };
  }

  if (maxPriorityFeePerGas > maxPriorityFee) {
    return {
      isValid: false,
      error: 'Priority fee exceeds reasonable maximum'
    };
  }

  if (maxFeePerGas > maxTotalFee) {
    return {
      isValid: false,
      error: 'Total fee exceeds reasonable maximum'
    };
  }

  if (maxFeePerGas < maxPriorityFeePerGas) {
    return {
      isValid: false,
      error: 'Max fee must be greater than priority fee'
    };
  }

  return { isValid: true };
}