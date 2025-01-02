/*
  # Payment System Schema Update

  1. Changes
    - Drop existing trigger and function if they exist
    - Create payment_transactions and payment_splits tables
    - Set up RLS policies
    - Add transaction status update trigger
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_transaction_timestamp ON payment_transactions;
DROP FUNCTION IF EXISTS update_transaction_status();

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own transactions" ON payment_transactions;
    DROP POLICY IF EXISTS "Users can create transactions" ON payment_transactions;
    DROP POLICY IF EXISTS "Recipients can view their splits" ON payment_splits;
END $$;

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  chain_id TEXT NOT NULL,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payment splits for revenue sharing
CREATE TABLE IF NOT EXISTS payment_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES payment_transactions(id),
  recipient_id UUID REFERENCES users(id),
  share_percentage INTEGER NOT NULL,
  amount TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_splits ENABLE ROW LEVEL SECURITY;

-- Policies for payment_transactions
CREATE POLICY "Users can view their own transactions"
  ON payment_transactions
  FOR SELECT
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id
  );

CREATE POLICY "Users can create transactions"
  ON payment_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policies for payment_splits
CREATE POLICY "Recipients can view their splits"
  ON payment_splits
  FOR SELECT
  USING (auth.uid() = recipient_id);

-- Function to update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating transaction timestamp
CREATE TRIGGER update_transaction_timestamp
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_status();