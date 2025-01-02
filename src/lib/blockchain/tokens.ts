import { ethers } from 'ethers';
import { getProvider } from './provider';
import { ERC20_ABI } from './constants/abis';

export async function verifyTokenOwnership(
  address: string,
  tokenAddresses: string[],
  chainId: string
): Promise<boolean> {
  const provider = getProvider(chainId);
  
  try {
    const results = await Promise.all(
      tokenAddresses.map(async (tokenAddress) => {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        return balance > 0;
      })
    );
    
    return results.some(Boolean);
  } catch (error) {
    console.error('Error verifying token ownership:', error);
    return false;
  }
}