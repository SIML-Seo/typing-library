export const APP_DB_NAME = 'typing-library';
export const APP_DB_VERSION = 1;

export const STORE_NAMES = {
  myWorks: 'myWorks',
  typingResults: 'typingResults',
  typingDrafts: 'typingDrafts',
  appSettings: 'appSettings',
} as const;

export const DEFAULT_SETTINGS_RECORD_ID = 'default';

export type StoreName = (typeof STORE_NAMES)[keyof typeof STORE_NAMES];
