import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { formatRelativeTime } from '../../../utils/date';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';

interface TransactionHistoryProps {
  userId: string;
}

export function TransactionHistory({ userId }: TransactionHistoryProps) {
  const { transactions, loading, error } = usePaymentHistory(userId);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!transactions.length) {
    return <Alert type="info" message="No transactions found" />;
  }

  return (
    <div className="space-y-4">
      {transactions.map(tx => (
        <div 
          key={tx.id}
          className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between"
        >
          <div>
            <p className="font-medium">
              {tx.type === 'tip' ? 'Tip' : 'Payment'} {tx.amount} {tx.currency}
            </p>
            <p className="text-sm text-gray-400">
              {tx.sender.username} → {tx.recipient.username}
            </p>
            <p className="text-xs text-gray-500">
              {formatRelativeTime(tx.created_at)}
            </p>
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
  );
}