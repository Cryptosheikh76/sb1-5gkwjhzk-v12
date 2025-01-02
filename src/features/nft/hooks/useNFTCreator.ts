import { useState } from 'react';
import { NFTCollection, NFTAsset } from '../types';
import { uploadToIPFS } from '../utils/ipfs';
import { deployContract } from '../utils/contracts';
import { supabase } from '../../../lib/supabase';
import { useWallet } from '../../../hooks/blockchain/useWallet';

export function useNFTCreator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, chainId } = useWallet();

  const createCollection = async (
    title: string,
    description: string,
    price: string,
    maxSupply: number,
    files: File[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Upload assets to IPFS
      const assets = await Promise.all(
        files.map(async (file) => {
          const url = await uploadToIPFS(file);
          return {
            assetUrl: url,
            assetType: file.type.split('/')[0] as NFTAsset['assetType']
          };
        })
      );

      // Deploy smart contract
      const contractAddress = await deployContract({
        name: title,
        symbol: title.toUpperCase().replace(/\s+/g, ''),
        maxSupply,
        price,
        chainId
      });

      // Create collection record
      const { data: collection, error: dbError } = await supabase
        .from('nft_collections')
        .insert({
          title,
          description,
          price,
          max_supply: maxSupply,
          creator_address: address,
          chain_id: chainId,
          contract_address: contractAddress,
          status: 'published'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Create asset records
      await supabase.from('nft_assets').insert(
        assets.map(asset => ({
          collection_id: collection.id,
          asset_url: asset.assetUrl,
          asset_type: asset.assetType
        }))
      );

      return collection;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCollection,
    loading,
    error
  };
}