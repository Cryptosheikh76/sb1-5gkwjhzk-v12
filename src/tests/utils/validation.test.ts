```typescript
import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword,
  validateUsername 
} from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name+tag@example.co.uk')).toBeNull();
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('invalid')).toBe('Invalid email format');
      expect(validateEmail('test@')).toBe('Invalid email format');
    });
  });

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toHaveLength(0);
    });

    it('returns errors for weak passwords', () => {
      const errors = validatePassword('weak');
      expect(errors).toContain('Password must be at least 8 characters');
      expect(errors).toContain('Password must contain at least one uppercase letter');
      expect(errors).toContain('Password must contain at least one number');
    });
  });

  describe('validateUsername', () => {
    it('validates correct usernames', () => {
      expect(validateUsername('validUser123')).toBeNull();
    });

    it('rejects invalid usernames', () => {
      expect(validateUsername('')).toBe('Username is required');
      expect(validateUsername('a')).toBe('Username must be at least 3 characters');
      expect(validateUsername('invalid@user')).toBe('Username can only contain letters, numbers, and underscores');
    });
  });
});
```