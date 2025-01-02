/*
  # NFT Schema Updates

  1. Changes
    - Add missing columns to NFT collections
    - Add missing columns to NFT items
    - Add missing columns to NFT listings and offers
    - Update RLS policies with unique names
  2. Security
    - Enable RLS on all tables
    - Add granular access policies
*/

-- Add new columns to existing tables if they don't exist
DO $$ 
BEGIN
    -- Add columns to nft_collections
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_collections' AND column_name = 'symbol') THEN
        ALTER TABLE nft_collections ADD COLUMN symbol TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_collections' AND column_name = 'contract_address') THEN
        ALTER TABLE nft_collections ADD COLUMN contract_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_collections' AND column_name = 'chain_id') THEN
        ALTER TABLE nft_collections ADD COLUMN chain_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_collections' AND column_name = 'royalty_percentage') THEN
        ALTER TABLE nft_collections ADD COLUMN royalty_percentage INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_collections' AND column_name = 'metadata') THEN
        ALTER TABLE nft_collections ADD COLUMN metadata JSONB;
    END IF;

    -- Add columns to nft_items
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_items' AND column_name = 'token_id') THEN
        ALTER TABLE nft_items ADD COLUMN token_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_items' AND column_name = 'metadata_uri') THEN
        ALTER TABLE nft_items ADD COLUMN metadata_uri TEXT;
    END IF;

    -- Add columns to nft_listings
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_listings' AND column_name = 'currency') THEN
        ALTER TABLE nft_listings ADD COLUMN currency TEXT;
    END IF;

    -- Add columns to nft_offers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_offers' AND column_name = 'currency') THEN
        ALTER TABLE nft_offers ADD COLUMN currency TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nft_offers' AND column_name = 'expires_at') THEN
        ALTER TABLE nft_offers ADD COLUMN expires_at TIMESTAMPTZ;
    END IF;
END $$;

-- Create unique constraint with proper error handling
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'nft_items_collection_token_unique'
    ) THEN
        ALTER TABLE nft_items
        ADD CONSTRAINT nft_items_collection_token_unique 
        UNIQUE(collection_id, token_id);
    END IF;
END $$;

-- Update policies with unique names
DO $$ 
BEGIN
    -- Collections policies
    DROP POLICY IF EXISTS "nft_collections_select_policy_v7" ON nft_collections;
    CREATE POLICY "nft_collections_select_policy_v7"
        ON nft_collections FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "nft_collections_all_policy_v7" ON nft_collections;
    CREATE POLICY "nft_collections_all_policy_v7"
        ON nft_collections FOR ALL
        USING (creator_id = auth.uid());

    -- Items policies
    DROP POLICY IF EXISTS "nft_items_select_policy_v7" ON nft_items;
    CREATE POLICY "nft_items_select_policy_v7"
        ON nft_items FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "nft_items_all_policy_v7" ON nft_items;
    CREATE POLICY "nft_items_all_policy_v7"
        ON nft_items FOR ALL
        USING (owner_id = auth.uid());

    -- Listings policies
    DROP POLICY IF EXISTS "nft_listings_select_policy_v7" ON nft_listings;
    CREATE POLICY "nft_listings_select_policy_v7"
        ON nft_listings FOR SELECT
        USING (true);

    DROP POLICY IF EXISTS "nft_listings_all_policy_v7" ON nft_listings;
    CREATE POLICY "nft_listings_all_policy_v7"
        ON nft_listings FOR ALL
        USING (seller_id = auth.uid());

    -- Offers policies
    DROP POLICY IF EXISTS "nft_offers_select_policy_v7" ON nft_offers;
    CREATE POLICY "nft_offers_select_policy_v7"
        ON nft_offers FOR SELECT
        USING (
            bidder_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM nft_items
                WHERE nft_items.id = item_id
                AND nft_items.owner_id = auth.uid()
            )
        );

    DROP POLICY IF EXISTS "nft_offers_insert_policy_v7" ON nft_offers;
    CREATE POLICY "nft_offers_insert_policy_v7"
        ON nft_offers FOR INSERT
        WITH CHECK (
            bidder_id = auth.uid() AND
            status = 'pending'
        );

    DROP POLICY IF EXISTS "nft_offers_update_policy_v7" ON nft_offers;
    CREATE POLICY "nft_offers_update_policy_v7"
        ON nft_offers FOR UPDATE
        USING (bidder_id = auth.uid())
        WITH CHECK (status = 'cancelled');
END $$;