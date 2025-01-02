/*
  # Sound Library and Revenue Sharing System V2

  1. New Tables
    - `sound_library` - Stores sound metadata and usage info
    - `sound_revenue_shares` - Tracks revenue sharing for sound usage
    - `sound_usage_stats` - Tracks sound usage statistics

  2. Changes
    - Add revenue sharing configuration for sounds
    - Add automatic revenue split tracking
    - Add usage statistics tracking

  3. Security
    - Enable RLS
    - Add policies for creators and users
*/

-- Sound library table
CREATE TABLE IF NOT EXISTS sound_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  url TEXT NOT NULL,
  waveform INTEGER[] NOT NULL,
  category TEXT,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sound revenue shares table
CREATE TABLE IF NOT EXISTS sound_revenue_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sound_id UUID REFERENCES sound_library(id) NOT NULL,
  creator_id UUID REFERENCES users(id) NOT NULL,
  share_percentage INTEGER NOT NULL CHECK (share_percentage >= 0 AND share_percentage <= 100),
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sound usage stats table
CREATE TABLE IF NOT EXISTS sound_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sound_id UUID REFERENCES sound_library(id) NOT NULL,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'livestream')),
  start_time INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE sound_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_revenue_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_usage_stats ENABLE ROW LEVEL SECURITY;

-- Sound library policies with unique names
CREATE POLICY "sound_library_view_policy_v2"
  ON sound_library FOR SELECT
  USING (true);

CREATE POLICY "sound_library_manage_policy_v2"
  ON sound_library FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

-- Sound revenue shares policies with unique names
CREATE POLICY "sound_revenue_shares_view_policy_v2"
  ON sound_revenue_shares FOR SELECT
  USING (true);

CREATE POLICY "sound_revenue_shares_manage_policy_v2"
  ON sound_revenue_shares FOR ALL
  TO authenticated
  USING (creator_id = auth.uid());

-- Sound usage stats policies with unique names
CREATE POLICY "sound_usage_stats_view_policy_v2"
  ON sound_usage_stats FOR SELECT
  USING (true);

CREATE POLICY "sound_usage_stats_insert_policy_v2"
  ON sound_usage_stats FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS update_sound_usage_count_trigger ON sound_usage_stats;
DROP FUNCTION IF EXISTS update_sound_usage_count();

-- Function to update usage count
CREATE OR REPLACE FUNCTION update_sound_usage_count_v2()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sound_library
  SET 
    usage_count = usage_count + 1,
    updated_at = now()
  WHERE id = NEW.sound_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating usage count with unique name
CREATE TRIGGER update_sound_usage_count_trigger_v2
  AFTER INSERT ON sound_usage_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_sound_usage_count_v2();