```typescript
export function validateMessage(content: string): string | null {
  if (!content.trim()) {
    return 'Message cannot be empty';
  }

  if (content.length > 1000) {
    return 'Message is too long (max 1000 characters)';
  }

  return null;
}

export function validateRecipient(recipientId: string): string | null {
  if (!recipientId) {
    return 'Recipient is required';
  }

  return null;
}
```