```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../lib/supabase';
import { mintNFT } from '../lib/xrpl/nft/client';

const router = Router();

// Get NFT listings
router.get('/listings', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('nft_listings')
      .select(`
        *,
        item:nft_items(
          *,
          collection:nft_collections(*)
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Create NFT collection
router.post('/collections', authMiddleware, async (req, res, next) => {
  try {
    const { title, description, price, royaltyFee, metadata } = req.body;

    // Create collection in database
    const { data: collection, error: dbError } = await supabase
      .from('nft_collections')
      .insert({
        title,
        description,
        creator_id: req.user.id,
        royalty_fee: royaltyFee
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Mint NFT on XRPL
    const txHash = await mintNFT(req.user.id, collection.id, metadata);

    res.json({ 
      collection,
      transactionHash: txHash 
    });
  } catch (error) {
    next(error);
  }
});

export { router as nftRouter };
```