import { useState } from 'react';
import { useStreamInvites } from '../../hooks/blockchain/useStreamInvites';
import { useWallet } from '../../hooks/blockchain/useWallet';

interface TipButtonProps {
  creatorAddress: string;
  onSuccess?: () => void;
}

export default function TipButton({ creatorAddress, onSuccess }: TipButtonProps) {
  const { tipCreator } = useStreamInvites();
  const { loading } = useWallet();
  const [amount, setAmount] = useState('0.01');
  const [showInput, setShowInput] = useState(false);

  const handleTip = async () => {
    try {
      await tipCreator(creatorAddress, amount);
      onSuccess?.();
      setShowInput(false);
    } catch (error) {
      console.error('Failed to send tip:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowInput(true)}
        className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
        disabled={loading}
      >
        Tip Creator
      </button>

      {showInput && (
        <div className="absolute bottom-full mb-2 bg-white p-4 rounded-lg shadow-lg">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            step="0.01"
            min="0.01"
          />
          <div className="flex gap-2">
            <button
              onClick={handleTip}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
              disabled={loading}
            >
              Send {amount} ETH
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}