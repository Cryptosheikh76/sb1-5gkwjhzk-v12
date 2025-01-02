import { ethers } from 'ethers';
import StreamInvitesABI from '../../contracts/StreamInvites.json';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getStreamInvitesContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, StreamInvitesABI, signer);
};