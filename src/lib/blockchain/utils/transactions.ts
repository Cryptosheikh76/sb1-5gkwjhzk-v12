import { ethers } from 'ethers';
import { TransactionRequest } from '../../../types/blockchain';
import { TransactionError } from '../errors';
import { validateTransaction } from './validation';

export async function prepareTransaction(
  request: TransactionRequest,
  chainId: string
): Promise<TransactionRequest> {
  const error = validateTransaction(request.value || '0', chainId);
  if (error) {
    throw new TransactionError(error);
  }

  return {
    ...request,
    chainId,
    value: request.value ? ethers.parseUnits(request.value, 18).toString() : '0'
  };
}

export function getTransactionStatus(hash: string, chainId: string) {
  // Implementation for checking transaction status
  // This will be different for each chain
  return {
    status: 'pending' as const,
    confirmations: 0
  };
}