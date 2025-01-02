import { useWallet } from '../../hooks/useWallet';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TransactionHistory } from './TransactionHistory';
import { Tabs } from '../ui/Tabs';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallet, connect, disconnect, loading } = useWallet();
  const { balance } = useTokenBalance();

  const tabs = [
    {
      label: 'Overview',
      content: wallet && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-400">Address</p>
            <p className="font-mono">{wallet.address}</p>
          </div>
          
          <div className="p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-400">AGC Balance</p>
            <p className="text-xl font-bold">{balance} AGC</p>
          </div>
        </div>
      )
    },
    {
      label: 'History',
      content: <TransactionHistory />
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Wallet">
      <div className="space-y-4">
        {wallet ? (
          <>
            <Tabs tabs={tabs} />
            <Button
              onClick={disconnect}
              variant="secondary"
              fullWidth
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            onClick={connect}
            loading={loading}
            fullWidth
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </Modal>
  );
}