/*
  # NFT Schema Update

  1. Drop Existing Objects
    - Drop existing policies and triggers to avoid conflicts
  2. Tables
    - nft_collections: Stores collection metadata
    - nft_items: Stores individual NFT items
    - nft_listings: Stores marketplace listings
    - nft_offers: Stores offers made on NFTs
  3. Security
    - Enable RLS on all tables
    - Add policies for creators and buyers
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Collections are viewable by everyone" ON nft_collections;
    DROP POLICY IF EXISTS "Creators can manage their collections" ON nft_collections;
    DROP POLICY IF EXISTS "Items are viewable by everyone" ON nft_items;
    DROP POLICY IF EXISTS "Owners can manage their items" ON nft_items;
    DROP POLICY IF EXISTS "Listings are viewable by everyone" ON nft_listings;
    DROP POLICY IF EXISTS "Sellers can manage their listings" ON nft_listings;
    DROP POLICY IF EXISTS "Offers are viewable by item owners and bidders" ON nft_offers;
    DROP POLICY IF EXISTS "Users can create offers" ON nft_offers;
    DROP POLICY IF EXISTS "Bidders can cancel their offers" ON nft_offers;
END $$;

-- Drop existing triggers if they exist
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_nft_collections_timestamp ON nft_collections;
    DROP TRIGGER IF EXISTS update_nft_items_timestamp ON nft_items;
    DROP TRIGGER IF EXISTS update_nft_listings_timestamp ON nft_listings;
    DROP TRIGGER IF EXISTS update_nft_offers_timestamp ON nft_offers;
END $$;

-- NFT Collections
CREATE TABLE IF NOT EXISTS nft_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  symbol TEXT NOT NULL,
  contract_address TEXT,
  chain_id TEXT NOT NULL,
  royalty_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'draft',
  metadata JSONB
);

-- NFT Items
CREATE TABLE IF NOT EXISTS nft_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES nft_collections(id) NOT NULL,
  token_id TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  metadata_uri TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(collection_id, token_id)
);

-- NFT Listings
CREATE TABLE IF NOT EXISTS nft_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES nft_items(id) NOT NULL,
  seller_id UUID REFERENCES users(id) NOT NULL,
  price TEXT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- NFT Offers
CREATE TABLE IF NOT EXISTS nft_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES nft_items(id) NOT NULL,
  bidder_id UUID REFERENCES users(id) NOT NULL,
  price TEXT NOT NULL,
  currency TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_offers ENABLE ROW LEVEL SECURITY;

-- Collection Policies
CREATE POLICY "nft_collections_select_policy"
  ON nft_collections FOR SELECT
  USING (true);

CREATE POLICY "nft_collections_all_policy"
  ON nft_collections FOR ALL
  USING (creator_id = auth.uid());

-- Item Policies
CREATE POLICY "nft_items_select_policy"
  ON nft_items FOR SELECT
  USING (true);

CREATE POLICY "nft_items_all_policy"
  ON nft_items FOR ALL
  USING (owner_id = auth.uid());

-- Listing Policies
CREATE POLICY "nft_listings_select_policy"
  ON nft_listings FOR SELECT
  USING (true);

CREATE POLICY "nft_listings_all_policy"
  ON nft_listings FOR ALL
  USING (seller_id = auth.uid());

-- Offer Policies
CREATE POLICY "nft_offers_select_policy"
  ON nft_offers FOR SELECT
  USING (
    bidder_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM nft_items
      WHERE nft_items.id = item_id
      AND nft_items.owner_id = auth.uid()
    )
  );

CREATE POLICY "nft_offers_insert_policy"
  ON nft_offers FOR INSERT
  WITH CHECK (
    bidder_id = auth.uid() AND
    status = 'pending'
  );

CREATE POLICY "nft_offers_update_policy"
  ON nft_offers FOR UPDATE
  USING (bidder_id = auth.uid())
  WITH CHECK (status = 'cancelled');