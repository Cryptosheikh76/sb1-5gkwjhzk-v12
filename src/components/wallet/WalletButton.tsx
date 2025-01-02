import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Button } from '../ui/Button';
import { WalletModal } from './WalletModal';

interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className }: WalletButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { wallet, loading } = useWallet();

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={loading}
        variant="secondary"
        className={className}
      >
        {wallet ? 
          `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 
          'Connect Wallet'
        }
      </Button>

      <WalletModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}