#!/usr/bin/env node

const { writeFileSync } = require('fs');
const { execSync } = require('child_process');

// Validate environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_CONTRACT_ADDRESS'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Create production environment file
writeFileSync('.env.production', `
VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY}
VITE_CONTRACT_ADDRESS=${process.env.VITE_CONTRACT_ADDRESS}
`.trim());

// Run build and tests
try {
  console.log('Running type check...');
  execSync('npm run typecheck', { stdio: 'inherit' });
  
  console.log('Running tests...');
  execSync('npm run test', { stdio: 'inherit' });
  
  console.log('Build ready for deployment');
} catch (error) {
  console.error('Pre-deployment checks failed:', error);
  process.exit(1);
}