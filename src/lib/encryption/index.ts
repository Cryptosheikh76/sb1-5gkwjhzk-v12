```typescript
import { generateKeyPair, encrypt, decrypt } from './crypto';
import { supabase } from '../supabase';

export class EncryptionService {
  private static instance: EncryptionService;
  private keyPair: CryptoKeyPair | null = null;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new EncryptionService();
    }
    return this.instance;
  }

  async initializeKeys(userId: string) {
    // Generate new key pair if none exists
    const keyPair = await generateKeyPair();
    this.keyPair = keyPair;

    // Store public key in database
    await supabase
      .from('user_keys')
      .upsert({
        user_id: userId,
        public_key: await exportPublicKey(keyPair.publicKey)
      });

    // Store private key securely in memory only
    return keyPair;
  }

  async encryptMessage(message: string, recipientPublicKey: string): Promise<string> {
    if (!this.keyPair) throw new Error('Encryption not initialized');
    return encrypt(message, recipientPublicKey);
  }

  async decryptMessage(encryptedMessage: string): Promise<string> {
    if (!this.keyPair) throw new Error('Encryption not initialized');
    return decrypt(encryptedMessage, this.keyPair.privateKey);
  }
}

export const encryptionService = EncryptionService.getInstance();
```