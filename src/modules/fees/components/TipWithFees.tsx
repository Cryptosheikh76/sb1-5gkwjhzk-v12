import { useState } from 'react';
import { useFeeCalculator } from '../hooks/useFeeCalculator';
import { useTipWithFees } from '../hooks/useTipWithFees';
import { validateTipAmount } from '../utils/validation';
import { FeeBreakdown } from './FeeBreakdown';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';

interface TipWithFeesProps {
  creatorId: string;
  onTipComplete?: () => void;
}

export function TipWithFees({ creatorId, onTipComplete }: TipWithFeesProps) {
  const [amount, setAmount] = useState('0.01');
  const [error, setError] = useState<string | undefined>();
  const { calculation, calculateTransactionFees } = useFeeCalculator();
  const { sendTip, processing } = useTipWithFees(creatorId);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError(undefined);

    const validationError = validateTipAmount(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      calculateTransactionFees(value);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid amount');
    }
  };

  const handleTipSubmit = async () => {
    try {
      setError(undefined);
      await sendTip(amount);
      onTipComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send tip');
    }
  };
  
  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        min="0.001"
        step="0.001"
        label="Tip Amount (ETH)"
        error={error}
        disabled={processing}
      />
      
      {error && (
        <Alert type="error" message={error} />
      )}
      
      {calculation && !error && (
        <FeeBreakdown calculation={calculation} className="mt-4" />
      )}
      
      <Button
        onClick={handleTipSubmit}
        disabled={!!error || !calculation || processing}
        loading={processing}
        fullWidth
      >
        {processing ? 'Processing...' : 'Send Tip'}
      </Button>
    </div>
  );
}