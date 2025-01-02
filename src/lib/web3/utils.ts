import { ethers } from 'ethers';

export const generateInviteHash = (streamId: string, address: string) => {
  return ethers.keccak256(
    ethers.solidityPacked(['string', 'address'], [streamId, address])
  );
};

export const formatEther = (value: string) => {
  return ethers.formatEther(value);
};

export const parseEther = (value: string) => {
  return ethers.parseEther(value);
};