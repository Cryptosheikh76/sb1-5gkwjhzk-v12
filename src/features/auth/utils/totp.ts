```typescript
import { createHmac } from 'crypto';

export function generateTOTP(secret: string, window = 0): string {
  const period = 30;
  const digits = 6;
  
  // Get current time period
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / period) + window;

  // Create HMAC using secret
  const hmac = createHmac('sha1', base32ToBuffer(secret));
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));
  hmac.update(counterBuffer);
  const hmacResult = hmac.digest();

  // Generate OTP
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code = ((hmacResult[offset] & 0x7f) << 24) |
               ((hmacResult[offset + 1] & 0xff) << 16) |
               ((hmacResult[offset + 2] & 0xff) << 8) |
               (hmacResult[offset + 3] & 0xff);

  return (code % Math.pow(10, digits)).toString().padStart(digits, '0');
}

function base32ToBuffer(str: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = str
    .toUpperCase()
    .split('')
    .map(char => alphabet.indexOf(char).toString(2).padStart(5, '0'))
    .join('');
  
  const bytes = bits.match(/.{8}/g) || [];
  return Buffer.from(bytes.map(byte => parseInt(byte, 2)));
}

export function verifyTOTP(secret: string, token: string): boolean {
  // Check current and adjacent time windows
  for (let window = -1; window <= 1; window++) {
    if (generateTOTP(secret, window) === token) {
      return true;
    }
  }
  return false;
}
```