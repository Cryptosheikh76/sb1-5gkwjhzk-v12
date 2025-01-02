/*
  # Stream Revenue Configuration

  1. New Tables
    - `stream_revenue_config` - Stores revenue sharing rules for streams
    - `stream_revenue_shares` - Tracks actual revenue shares for each stream

  2. Changes
    - Add revenue_type column to streams table
    - Add revenue sharing configuration for public/private streams

  3. Security
    - Enable RLS
    - Add policies for creators and participants
*/

-- Add revenue type to streams
ALTER TABLE streams ADD COLUMN IF NOT EXISTS revenue_type TEXT CHECK (revenue_type IN ('public', 'private'));

-- Stream revenue configuration
CREATE TABLE IF NOT EXISTS stream_revenue_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  participant_id UUID REFERENCES users(id),
  share_percentage INTEGER NOT NULL CHECK (share_percentage >= 0 AND share_percentage <= 100),
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, participant_id)
);

-- Stream revenue shares
CREATE TABLE IF NOT EXISTS stream_revenue_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  amount TEXT NOT NULL,
  transaction_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE stream_revenue_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_revenue_shares ENABLE ROW LEVEL SECURITY;

-- Policies for stream revenue config
CREATE POLICY "Creators can manage revenue config"
  ON stream_revenue_config
  FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Participants can view their revenue config"
  ON stream_revenue_config
  FOR SELECT
  TO authenticated
  USING (participant_id = auth.uid());

-- Policies for stream revenue shares
CREATE POLICY "Anyone can view stream revenue shares"
  ON stream_revenue_shares
  FOR SELECT
  USING (true);

CREATE POLICY "System can create revenue shares"
  ON stream_revenue_shares
  FOR INSERT
  TO authenticated
  WITH CHECK (true);