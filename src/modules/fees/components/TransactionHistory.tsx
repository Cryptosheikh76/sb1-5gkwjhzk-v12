import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { formatRelativeTime } from '../../../utils/date';

interface TransactionHistoryProps {
  creatorId: string;
  className?: string;
}

export function TransactionHistory({ creatorId, className }: TransactionHistoryProps) {
  const { transactions, loading, error } = useTransactionHistory(creatorId);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!transactions.length) return <div>No transactions yet</div>;

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      <div className="space-y-3">
        {transactions.map(tx => (
          <div 
            key={tx.id}
            className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{tx.amount} ETH</div>
              <div className="text-sm text-gray-400">
                {formatRelativeTime(tx.timestamp)}
              </div>
            </div>
            <div className={`
              px-2 py-1 rounded text-sm
              ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'}
            `}>
              {tx.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}