```typescript
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.string().default('3000'),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  clientUrl: z.string().url(),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
  xrplNode: z.string().url(),
  platformWallet: z.string(),
  agcIssuer: z.string()
});

export const config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  xrplNode: process.env.XRPL_NODE,
  platformWallet: process.env.PLATFORM_WALLET,
  agcIssuer: process.env.AGC_ISSUER
});
```