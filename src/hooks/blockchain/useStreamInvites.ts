import { useCallback } from 'react';
import { useWallet } from './useWallet';
import { getStreamInvitesContract } from '../../lib/web3/contracts';
import { generateInviteHash, parseEther } from '../../lib/web3/utils';

export function useStreamInvites() {
  const { connect } = useWallet();

  const createInvite = useCallback(async (streamId: string) => {
    const signer = await connect();
    const contract = getStreamInvitesContract(signer);
    const inviteHash = generateInviteHash(streamId, await signer.getAddress());
    const tx = await contract.createInvite(inviteHash);
    await tx.wait();
    return inviteHash;
  }, [connect]);

  const tipCreator = useCallback(async (creatorAddress: string, amount: string) => {
    const signer = await connect();
    const contract = getStreamInvitesContract(signer);
    const tx = await contract.tip(creatorAddress, {
      value: parseEther(amount)
    });
    await tx.wait();
  }, [connect]);

  return {
    createInvite,
    tipCreator
  };
}