export const MESSAGE_LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
  SLOW_MODE_DELAY: 30, // seconds
  MAX_MESSAGES: 200,
  EMOTE_LIMIT: 10, // max emotes per message
  LINK_LIMIT: 1 // max links per message
} as const;

export const MESSAGE_ERRORS = {
  NOT_LOGGED_IN: 'Must be logged in to send messages',
  MESSAGE_TOO_LONG: `Message must be less than ${MESSAGE_LIMITS.MAX_MESSAGE_LENGTH} characters`,
  SLOW_MODE: `You can chat again in {seconds} seconds`,
  EMOTE_LIMIT: `Maximum ${MESSAGE_LIMITS.EMOTE_LIMIT} emotes per message`,
  LINK_LIMIT: `Maximum ${MESSAGE_LIMITS.LINK_LIMIT} links per message`
} as const;