import { ethers } from 'ethers';
import { Chain, TransactionRequest } from '../../types/blockchain';

export const ethereumConfig: Chain = {
  id: 'ethereum',
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrl: 'https://mainnet.infura.io/v3/your-project-id'
};

export async function sendEthereumTransaction(tx: TransactionRequest) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer.sendTransaction(tx);
}