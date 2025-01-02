/*
  # Update fee transaction policies
  
  1. Changes
    - Add policy for staff to manage transactions
    - Ensure idempotent policy creation
*/

-- Drop existing policy if it exists
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Staff can manage transactions" ON fee_transactions;
END $$;

-- Create new policy for staff management
CREATE POLICY "Staff can manage transactions"
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