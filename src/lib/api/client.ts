import { createClient } from '@supabase/supabase-js';
import { ENV } from '../../utils/env';

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export type { PostgrestError } from '@supabase/supabase-js';