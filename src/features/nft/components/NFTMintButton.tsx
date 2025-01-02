import { useState } from 'react';
import { useNFTMinter } from '../hooks/useNFTMinter';
import { Button } from '../../../components/ui/Button';

interface NFTMintButtonProps {
  contractAddress: string;
  price: string;
}

export function NFTMintButton({ contractAddress, price }: NFTMintButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { mint, minting, error } = useNFTMinter(contractAddress);

  const handleMint = async () => {
    try {
      await mint(quantity);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          max="10"
          className="w-24"
        />
        <span>Total: {(Number(price) * quantity).toFixed(6)} ETH</span>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        onClick={handleMint}
        disabled={minting}
        loading={minting}
      >
        Mint NFT
      </Button>
    </div>
  );
}