import { useState } from 'react';
import { PaymentRequest, PaymentResult } from '../types';
import { calculateFees } from '../utils/fees';
import { processPayment } from '../utils/transactions';
import { useWallet } from '../../../hooks/blockchain/useWallet';

export function usePayments() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, chainId } = useWallet();

  const sendPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
    try {
      setProcessing(true);
      setError(null);

      // Calculate fees
      const { totalAmount, platformFee, creatorAmount } = calculateFees(request.amount);

      // Process payment
      const result = await processPayment({
        ...request,
        amount: totalAmount,
        senderAddress: address,
        platformFee,
        creatorAmount
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    sendPayment,
    processing,
    error
  };
}