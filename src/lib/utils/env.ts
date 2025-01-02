// Required environment variables
const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_CONTRACT_ADDRESS'
] as const;

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    key => !import.meta.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate on init
validateEnv();

export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS,
  IS_PROD: import.meta.env.PROD
} as const;