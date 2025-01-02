/*
  # Authentication Fields Migration
  
  1. Changes
    - Add phone number and verification fields
    - Add email verification status
    - Add 2FA toggle
    - Add recovery email
  
  2. Security
    - All fields are optional
    - Default verification status is false
*/

DO $$ 
BEGIN
    -- Add phone number and verification fields
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
    
    -- Add email verification status
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
    
    -- Add two-factor authentication toggle
    ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
    
    -- Add recovery email
    ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_email TEXT;
END $$;