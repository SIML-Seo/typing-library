import { DEFAULT_SETTINGS_RECORD_ID, STORE_NAMES } from './schema';
import { getRecord, putRecord } from './open-db';
import type { AppSettingsRecord } from './types';

export const DEFAULT_APP_SETTINGS = {
  punctuationAndCaseStrict: true,
  theme: 'paper',
  fontSize: 'md',
  typoDisplayMode: 'inline-red' as const,
} satisfies Omit<AppSettingsRecord, 'id' | 'updatedAt'>;

export async function getAppSettings() {
  const stored = await getRecord<AppSettingsRecord>(
    STORE_NAMES.appSettings,
    DEFAULT_SETTINGS_RECORD_ID,
  );

  return (
    stored ?? {
      id: DEFAULT_SETTINGS_RECORD_ID,
      ...DEFAULT_APP_SETTINGS,
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function saveAppSettings(
  patch: Partial<Omit<AppSettingsRecord, 'id' | 'updatedAt'>>,
) {
  const current = await getAppSettings();
  const nextRecord: AppSettingsRecord = {
    ...current,
    ...patch,
    id: DEFAULT_SETTINGS_RECORD_ID,
    updatedAt: new Date().toISOString(),
  };

  return putRecord(STORE_NAMES.appSettings, nextRecord);
}
