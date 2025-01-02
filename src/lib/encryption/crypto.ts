```typescript
// Utility functions for cryptographic operations
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(
  message: string, 
  publicKey: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const importedKey = await window.crypto.subtle.importKey(
    'spki',
    Buffer.from(publicKey, 'base64'),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    importedKey,
    data
  );

  return Buffer.from(encrypted).toString('base64');
}

export async function decrypt(
  encryptedMessage: string,
  privateKey: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  const data = Buffer.from(encryptedMessage, 'base64');

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    data
  );

  return decoder.decode(decrypted);
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  return Buffer.from(exported).toString('base64');
}
```