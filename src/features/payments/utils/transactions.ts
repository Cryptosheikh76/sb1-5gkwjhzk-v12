import { PaymentRequest, PaymentResult } from '../types';
import { 
  sendEthereumTransaction,
  sendXRPLTransaction,
  sendSolanaTransaction
} from '../../../lib/blockchain/chains';

export async function processPayment(
  request: PaymentRequest & {
    senderAddress: string;
    platformFee: string;
    creatorAmount: string;
  }
): Promise<PaymentResult> {
  const { chainId } = request;

  // Prepare transaction based on chain
  const tx = {
    to: request.recipientId,
    from: request.senderAddress,
    value: request.amount,
    chainId
  };

  try {
    // Send transaction to appropriate chain
    const hash = await (
      chainId === 'ethereum' ? sendEthereumTransaction(tx) :
      chainId === 'xrpl' ? sendXRPLTransaction(tx) :
      chainId === 'solana' ? sendSolanaTransaction(tx) :
      Promise.reject(new Error('Unsupported chain'))
    );

    return {
      transactionHash: typeof hash === 'string' ? hash : hash.hash,
      status: 'success',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      transactionHash: '',
      status: 'failed',
      timestamp: Date.now()
    };
  }
}