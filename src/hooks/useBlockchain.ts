import { useState } from 'react';
import { ethers } from 'ethers';
import { connectWallet } from '../lib/web3/provider';
import { getStreamInvitesContract } from '../lib/web3/contracts';

export function useBlockchain() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);
      const signer = await connectWallet();
      const address = await signer.getAddress();
      setAddress(address);
      setConnected(true);
      return signer;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const tipCreator = async (creatorAddress: string, amount: string) => {
    const signer = await connect();
    const contract = getStreamInvitesContract(signer);
    const tx = await contract.tip(creatorAddress, {
      value: ethers.parseEther(amount)
    });
    await tx.wait();
  };

  return {
    connected,
    address,
    loading,
    connect,
    tipCreator
  };
}