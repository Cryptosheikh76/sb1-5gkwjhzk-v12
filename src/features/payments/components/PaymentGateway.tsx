```typescript
import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { validatePaymentAmount } from '../utils/validation';
import { FeeBreakdown } from './FeeBreakdown';

interface PaymentGatewayProps {
  recipientId: string;
  amount?: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export function PaymentGateway({ 
  recipientId, 
  amount: initialAmount,
  onSuccess,
  onError 
}: PaymentGatewayProps) {
  const [amount, setAmount] = useState(initialAmount || '');
  const { processPayment, fees, loading, error } = usePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validatePaymentAmount(amount);
    if (validationError) {
      onError?.(new Error(validationError));
      return;
    }

    try {
      const txHash = await processPayment({
        recipientId,
        amount,
        type: 'tip'
      });
      onSuccess?.(txHash);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Payment failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount (AGC)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0.000001"
        step="0.000001"
        required
      />

      {fees && <FeeBreakdown fees={fees} />}
      {error && <Alert type="error" message={error} />}

      <Button
        type="submit"
        disabled={loading || !amount}
        loading={loading}
        fullWidth
      >
        {loading ? 'Processing...' : 'Send Payment'}
      </Button>
    </form>
  );
}
```