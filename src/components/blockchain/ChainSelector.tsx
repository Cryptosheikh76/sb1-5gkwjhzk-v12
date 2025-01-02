import { useMultiChain } from '../../lib/blockchain/hooks/useMultiChain';
import { Button } from '../ui/Button';

export function ChainSelector() {
  const { selectedChain, supportedChains, switchChain } = useMultiChain();

  return (
    <div className="flex items-center gap-2">
      {supportedChains.map(chain => (
        <Button
          key={chain.id}
          onClick={() => switchChain(chain.id)}
          variant={chain.id === selectedChain.id ? 'primary' : 'secondary'}
          size="sm"
        >
          {chain.nativeCurrency.symbol}
        </Button>
      ))}
    </div>
  );
}