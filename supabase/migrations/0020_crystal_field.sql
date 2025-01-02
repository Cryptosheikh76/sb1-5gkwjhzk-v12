/*
  # Authentication Fields Migration
  
  1. Changes
    - Add phone number and verification fields
    - Add email verification status
    - Add 2FA toggle
    - Add recovery email
*/

DO $$ 
BEGIN
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_email TEXT;
END $$;