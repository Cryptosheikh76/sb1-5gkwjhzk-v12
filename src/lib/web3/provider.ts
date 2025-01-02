import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('Please install MetaMask to use this feature');
};

export const connectWallet = async () => {
  const provider = getProvider();
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return provider.getSigner();
};