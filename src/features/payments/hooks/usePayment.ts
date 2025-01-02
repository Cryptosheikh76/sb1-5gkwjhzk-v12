```typescript
import { useState } from 'react';
import { useWallet } from '../../../hooks/useWallet';
import { calculateFees } from '../utils/fees';
import { processPayment } from '../utils/transactions';
import { validatePaymentAmount } from '../utils/validation';
import { supabase } from '../../../lib/supabase';

interface PaymentRequest {
  recipientId: string;
  amount: string;
  type: 'tip' | 'nft_purchase' | 'subscription';
}

export function usePayment() {
  const { client } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fees, setFees] = useState<{
    platformFee: string;
    creatorAmount: string;
  } | null>(null);

  const calculatePaymentFees = async (amount: string) => {
    const validationError = validatePaymentAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    const fees = calculateFees(amount);
    setFees(fees);
    return fees;
  };

  const processPaymentRequest = async (request: PaymentRequest) => {
    if (!client) throw new Error('Wallet not connected');

    try {
      setLoading(true);
      setError(null);

      // Calculate fees
      const fees = await calculatePaymentFees(request.amount);
      if (!fees) return;

      // Process payment
      const txHash = await processPayment(client, {
        recipientId: request.recipientId,
        amount: request.amount,
        fees
      });

      // Record transaction
      await supabase.from('payment_transactions').insert({
        recipient_id: request.recipientId,
        amount: request.amount,
        platform_fee: fees.platformFee,
        creator_amount: fees.creatorAmount,
        type: request.type,
        transaction_hash: txHash
      });

      return txHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment: processPaymentRequest,
    calculateFees: calculatePaymentFees,
    fees,
    loading,
    error
  };
}
```