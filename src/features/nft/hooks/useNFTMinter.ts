import { useState } from 'react';
import { getNFTContract } from '../utils/contracts';
import { useWallet } from '../../../hooks/blockchain/useWallet';

export function useNFTMinter(contractAddress: string) {
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();

  const mint = async (quantity: number = 1) => {
    try {
      setMinting(true);
      setError(null);

      const contract = await getNFTContract(contractAddress);
      const tx = await contract.mint(address, quantity);
      await tx.wait();

      return tx.hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
      throw err;
    } finally {
      setMinting(false);
    }
  };

  return {
    mint,
    minting,
    error
  };
}