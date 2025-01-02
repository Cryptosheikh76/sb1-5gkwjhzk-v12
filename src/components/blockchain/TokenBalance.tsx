import { useTokenBalance } from '../../lib/blockchain/hooks/useTokenBalance';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TokenBalanceProps {
  chainId: string;
  className?: string;
}

export function TokenBalance({ chainId, className }: TokenBalanceProps) {
  const { balance, loading, error } = useTokenBalance(chainId);

  if (loading) return <LoadingSpinner size="sm" />;
  if (error) return null;

  return (
    <span className={className}>
      {balance} AGC
    </span>
  );
}