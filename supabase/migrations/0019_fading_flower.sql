/*
  # Authentication Policies
  
  1. Security
    - Add SELECT policies for viewing own data
    - Add ALL policy for managing own devices
    - Add staff policy for recovery requests
*/

-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "auth_providers_select_policy" ON auth_providers;
    DROP POLICY IF EXISTS "auth_verification_select_policy" ON auth_verification;
    DROP POLICY IF EXISTS "auth_recovery_user_policy" ON auth_recovery;
    DROP POLICY IF EXISTS "auth_recovery_staff_policy" ON auth_recovery;
    DROP POLICY IF EXISTS "user_devices_select_policy" ON user_devices;
    DROP POLICY IF EXISTS "user_devices_all_policy" ON user_devices;
END $$;

-- Create new policies with unique names
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'auth_providers_select_policy_v4'
    ) THEN
        CREATE POLICY "auth_providers_select_policy_v4"
            ON auth_providers FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'auth_verification_select_policy_v4'
    ) THEN
        CREATE POLICY "auth_verification_select_policy_v4"
            ON auth_verification FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'auth_recovery_user_policy_v4'
    ) THEN
        CREATE POLICY "auth_recovery_user_policy_v4"
            ON auth_recovery FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'auth_recovery_staff_policy_v4'
    ) THEN
        CREATE POLICY "auth_recovery_staff_policy_v4"
            ON auth_recovery FOR SELECT
            USING (EXISTS (
                SELECT 1 FROM users
                WHERE users.id = auth.uid()
                AND users.is_staff = true
            ));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'user_devices_select_policy_v4'
    ) THEN
        CREATE POLICY "user_devices_select_policy_v4"
            ON user_devices FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'user_devices_all_policy_v4'
    ) THEN
        CREATE POLICY "user_devices_all_policy_v4"
            ON user_devices FOR ALL
            USING (auth.uid() = user_id);
    END IF;
END $$;