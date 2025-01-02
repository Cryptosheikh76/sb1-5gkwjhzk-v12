```typescript
import { AutoModConfig } from '../types';

// Profanity filter using Bloom filter for efficiency
class BloomFilter {
  private filter: Uint8Array;
  private k: number;

  constructor(size: number, k: number) {
    this.filter = new Uint8Array(size);
    this.k = k;
  }

  add(item: string) {
    const hashes = this.getHashes(item);
    hashes.forEach(hash => {
      this.filter[hash % this.filter.length] = 1;
    });
  }

  test(item: string): boolean {
    const hashes = this.getHashes(item);
    return hashes.every(hash => this.filter[hash % this.filter.length] === 1);
  }

  private getHashes(item: string): number[] {
    // Simple hash function for demo
    const hashes = [];
    for (let i = 0; i < this.k; i++) {
      hashes.push(
        Array.from(item).reduce(
          (hash, char) => ((hash << 5) + hash) + char.charCodeAt(0),
          i
        )
      );
    }
    return hashes;
  }
}

// Initialize filters
const profanityFilter = new BloomFilter(1000, 3);
const spamPatterns = [
  /\b(buy|sell|discount|offer)\b/i,
  /https?:\/\/[^\s]+/g,
  /\b\d{10,}\b/g
];

export function moderateContent(
  content: string,
  config: AutoModConfig
): { isValid: boolean; reason?: string } {
  // Check profanity
  if (config.profanityFilter && profanityFilter.test(content)) {
    return {
      isValid: false,
      reason: 'Content contains inappropriate language'
    };
  }

  // Check spam
  if (config.spamDetection) {
    const spamScore = spamPatterns.reduce((score, pattern) => {
      return score + (content.match(pattern)?.length || 0);
    }, 0);

    if (spamScore > 2) {
      return {
        isValid: false,
        reason: 'Content appears to be spam'
      };
    }
  }

  // Check links
  if (config.linkRestrictions && content.match(/https?:\/\/[^\s]+/g)) {
    return {
      isValid: false,
      reason: 'External links are not allowed'
    };
  }

  return { isValid: true };
}

export function detectSensitiveContent(text: string): boolean {
  // Add sensitive content detection logic
  const sensitivePatterns = [
    /\b(password|secret|private|confidential)\b/i,
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i // Email pattern
  ];

  return sensitivePatterns.some(pattern => pattern.test(text));
}

export function sanitizeContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim();
}
```