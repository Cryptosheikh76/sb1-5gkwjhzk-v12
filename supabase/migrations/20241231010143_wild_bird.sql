/*
  # Fee System Implementation

  1. Updates
    - Add is_staff column to users table
  
  2. New Tables
    - fee_transactions table for tracking platform fees
  
  3. Security
    - RLS policies for fee transactions
    - Staff-only updates
*/

-- First add is_staff column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_staff'
  ) THEN
    ALTER TABLE users ADD COLUMN is_staff BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create fee transactions table
CREATE TABLE IF NOT EXISTS fee_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) NOT NULL,
  amount TEXT NOT NULL,
  fee_amount TEXT NOT NULL,
  creator_amount TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  timestamp TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;

-- Creators can view their own transactions
CREATE POLICY "Creators can view own transactions"
  ON fee_transactions
  FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

-- Staff can view all transactions
CREATE POLICY "Staff can view all transactions"
  ON fee_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );

-- Staff can update transaction status
CREATE POLICY "Staff can update transactions"
  ON fee_transactions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_staff = true
    )
  );