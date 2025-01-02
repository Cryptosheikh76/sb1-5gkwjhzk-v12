import { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { supportedChains } from '../../../lib/blockchain/chains';

interface PaymentButtonProps {
  recipientId: string;
  onSuccess?: (result: PaymentResult) => void;
  type?: 'tip' | 'purchase' | 'subscription';
  itemId?: string;
}

export function PaymentButton({ 
  recipientId, 
  onSuccess,
  type = 'tip',
  itemId 
}: PaymentButtonProps) {
  const [amount, setAmount] = useState('');
  const [selectedChain, setSelectedChain] = useState(supportedChains[0].id);
  const { sendPayment, processing, error } = usePayments();

  const handlePayment = async () => {
    try {
      const result = await sendPayment({
        amount,
        currency: supportedChains.find(c => c.id === selectedChain)?.nativeCurrency.symbol || '',
        recipientId,
        chainId: selectedChain,
        metadata: {
          type,
          itemId,
          description: `Payment for ${type}`
        }
      });

      if (result.status === 'success') {
        onSuccess?.(result);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          min="0"
          step="0.000001"
          className="w-32"
        />
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
          className="bg-zinc-800 rounded px-2"
        >
          {supportedChains.map(chain => (
            <option key={chain.id} value={chain.id}>
              {chain.nativeCurrency.symbol}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        onClick={handlePayment}
        disabled={processing || !amount}
        loading={processing}
      >
        {type === 'tip' ? 'Send Tip' : 'Pay'}
      </Button>
    </div>
  );
}