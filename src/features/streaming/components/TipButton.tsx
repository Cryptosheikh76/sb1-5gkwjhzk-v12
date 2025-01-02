import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import { useTipCreator } from '../hooks/useTipCreator';
import { validateTipAmount } from '../utils/validation';

interface TipButtonProps {
  creatorId?: string;
  creatorAddress?: string;
}

export function TipButton({ creatorId, creatorAddress }: TipButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('0.01');
  const { sendTip, loading, error } = useTipCreator();

  const handleTip = async () => {
    if (!creatorId || !creatorAddress) return;

    const validationError = validateTipAmount(amount);
    if (validationError) {
      return;
    }

    try {
      await sendTip({
        creatorId,
        creatorAddress,
        amount
      });
      setShowModal(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
      >
        Send Tip
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Send a Tip"
      >
        <div className="space-y-4">
          <Input
            type="number"
            label="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.001"
            step="0.001"
          />

          {error && <Alert type="error" message={error} />}

          <Button
            onClick={handleTip}
            loading={loading}
            disabled={loading || !amount}
            fullWidth
          >
            Send {amount} ETH
          </Button>
        </div>
      </Modal>
    </>
  );
}