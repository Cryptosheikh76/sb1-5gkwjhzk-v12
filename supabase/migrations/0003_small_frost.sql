/*
  # Add Admin and NFT Features

  1. New Tables
    - `promoted_creators`: Track promoted creator content
    - `flagged_content`: Track reported/flagged content
    - `nft_collections`: Store NFT collection metadata
    - `nft_assets`: Store individual NFT assets within collections

  2. Schema Updates
    - Add `is_staff` and `is_verified` to users table
    - Add `status` and `reach_limited` to videos table

  3. Security
    - Enable RLS on all new tables
    - Add policies for staff access
*/

-- Add new columns to existing tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_staff BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS followers_count INT DEFAULT 0;

ALTER TABLE videos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS reach_limited BOOLEAN DEFAULT false;

-- Create promoted creators table
CREATE TABLE IF NOT EXISTS promoted_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  promoted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(creator_id)
);

-- Create flagged content table
CREATE TABLE IF NOT EXISTS flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES videos(id) NOT NULL,
  reporter_id UUID REFERENCES users(id) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- Create NFT collections table
CREATE TABLE IF NOT EXISTS nft_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_address TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'draft'
);

-- Create NFT assets table
CREATE TABLE IF NOT EXISTS nft_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES nft_collections(id) NOT NULL,
  asset_url TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE promoted_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_assets ENABLE ROW LEVEL SECURITY;

-- Policies for promoted creators
CREATE POLICY "Staff can manage promoted creators"
  ON promoted_creators
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_staff = true
  ));

-- Policies for flagged content
CREATE POLICY "Users can flag content"
  ON flagged_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view and manage flagged content"
  ON flagged_content
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_staff = true
  ));

-- Policies for NFT collections
CREATE POLICY "Anyone can view published NFT collections"
  ON nft_collections
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Creators can manage their NFT collections"
  ON nft_collections
  TO authenticated
  USING (creator_address = auth.uid());

-- Policies for NFT assets
CREATE POLICY "Anyone can view NFT assets"
  ON nft_assets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage their NFT assets"
  ON nft_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nft_collections
      WHERE nft_collections.id = collection_id
      AND nft_collections.creator_address = auth.uid()
    )
  );