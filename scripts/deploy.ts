import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;
const NETLIFY_AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN;

function validateEnvironment() {
  if (!NETLIFY_SITE_ID || !NETLIFY_AUTH_TOKEN) {
    throw new Error('Missing required environment variables');
  }
}

function buildProject() {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
}

function deployToNetlify(isProd: boolean) {
  console.log(`Deploying to ${isProd ? 'production' : 'preview'}...`);
  const command = isProd 
    ? 'netlify deploy --build --prod' 
    : 'netlify deploy --build';
  
  execSync(command, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NETLIFY_SITE_ID,
      NETLIFY_AUTH_TOKEN
    }
  });
}

async function deploy(isProd = false) {
  try {
    validateEnvironment();
    buildProject();
    deployToNetlify(isProd);
    console.log('Deployment successful!');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
const isProd = process.argv.includes('--prod');
deploy(isProd);