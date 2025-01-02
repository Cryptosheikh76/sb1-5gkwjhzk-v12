import { ethers } from 'ethers';
import { getProvider } from '../provider';
import { ContractError } from '../errors';
import { ERC20_ABI, NFT_ABI } from '../constants/abis';

export async function getContract(
  address: string,
  abi: typeof ERC20_ABI | typeof NFT_ABI,
  chainId: string
) {
  try {
    const provider = await getProvider(chainId);
    return new ethers.Contract(address, abi, provider);
  } catch (error) {
    throw new ContractError('Failed to initialize contract');
  }
}

export async function getTokenContract(tokenAddress: string, chainId: string) {
  return getContract(tokenAddress, ERC20_ABI, chainId);
}

export async function getNFTContract(contractAddress: string, chainId: string) {
  return getContract(contractAddress, NFT_ABI, chainId);
}