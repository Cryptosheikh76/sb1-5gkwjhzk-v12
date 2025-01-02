import { useState, useEffect } from 'react';
import { TokenTransaction } from '../../lib/xrpl/types';
import { getTransactionHistory } from '../../lib/xrpl/transactions';
import { useWallet } from '../../hooks/useWallet';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { formatRelativeTime } from '../../utils/date';

export function TransactionHistory() {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wallet?.address) return;

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const history = await getTransactionHistory(wallet.address);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [wallet?.address]);

  if (loading) return <LoadingSpinner />;
  if (!transactions.length) return <p>No transactions found</p>;

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <div 
          key={tx.hash}
          className="p-4 bg-zinc-800 rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              {tx.type === 'send' ? '-' : '+'}{tx.amount} AGC
            </p>
            <p className="text-sm text-gray-400">
              {tx.type === 'send' ? `To: ${tx.to}` : `From: ${tx.from}`}
            </p>
          </div>
          <span className="text-sm text-gray-400">
            {formatRelativeTime(tx.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}