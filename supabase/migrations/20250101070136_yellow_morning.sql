/*
  # Token Rewards and Transactions Schema

  1. New Tables
    - token_distributions - Tracks token reward distributions
    - token_transactions - Tracks all token transfers
    - engagement_metrics - Tracks user engagement for rewards
    - reward_rates - Configurable reward rates

  2. Security
    - Enable RLS
    - Add policies for token operations
*/

-- Token distributions table
CREATE TABLE IF NOT EXISTS token_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  creator_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('engagement', 'referral')),
  transaction_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Token transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('transfer', 'reward', 'fee')),
  transaction_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Engagement metrics table
CREATE TABLE IF NOT EXISTS engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reward rates table
CREATE TABLE IF NOT EXISTS reward_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  amount TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE token_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Token distributions are viewable by involved parties"
  ON token_distributions FOR SELECT
  USING (creator_address = auth.jwt()->>'wallet_address');

CREATE POLICY "Token transactions are viewable by involved parties"
  ON token_transactions FOR SELECT
  USING (
    from_address = auth.jwt()->>'wallet_address' OR
    to_address = auth.jwt()->>'wallet_address'
  );

CREATE POLICY "Engagement metrics are viewable by everyone"
  ON engagement_metrics FOR SELECT
  USING (true);

CREATE POLICY "Only staff can manage reward rates"
  ON reward_rates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );

-- Function to update engagement metrics
CREATE OR REPLACE FUNCTION update_engagement_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO engagement_metrics (content_id)
  VALUES (NEW.content_id)
  ON CONFLICT (content_id) DO UPDATE
  SET
    likes = engagement_metrics.likes + CASE WHEN NEW.type = 'like' THEN 1 ELSE 0 END,
    comments = engagement_metrics.comments + CASE WHEN NEW.type = 'comment' THEN 1 ELSE 0 END,
    shares = engagement_metrics.shares + CASE WHEN NEW.type = 'share' THEN 1 ELSE 0 END,
    views = engagement_metrics.views + CASE WHEN NEW.type = 'view' THEN 1 ELSE 0 END,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating engagement metrics
CREATE TRIGGER update_engagement_on_event
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_engagement_metrics();