import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { getContract } from '../utils/contracts';
import { ContractError } from '../errors';

export function useContract(
  address: string,
  abi: any[],
  chainId?: string
) {
  const { address: account, chainId: walletChain } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !account || !(chainId || walletChain)) return;

    const initContract = async () => {
      try {
        const contract = await getContract(
          address,
          abi,
          chainId || walletChain
        );
        setContract(contract);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize contract');
        setContract(null);
      }
    };

    initContract();
  }, [address, account, chainId, walletChain, abi]);

  return { contract, error };
}