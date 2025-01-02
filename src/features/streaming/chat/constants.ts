```typescript
export const CHAT_SETTINGS = {
  MAX_MESSAGE_LENGTH: 500,
  SLOW_MODE_DELAY: 30, // seconds
  MAX_MESSAGES: 200,
  EMOTE_LIMIT: 10, // max emotes per message
  LINK_LIMIT: 1 // max links per message
} as const;

export const CHAT_ERRORS = {
  NOT_LOGGED_IN: 'Must be logged in to chat',
  MESSAGE_TOO_LONG: `Message must be less than ${CHAT_SETTINGS.MAX_MESSAGE_LENGTH} characters`,
  SLOW_MODE: `You can chat again in {seconds} seconds`,
  EMOTE_LIMIT: `Maximum ${CHAT_SETTINGS.EMOTE_LIMIT} emotes per message`,
  LINK_LIMIT: `Maximum ${CHAT_SETTINGS.LINK_LIMIT} links per message`
} as const;
```