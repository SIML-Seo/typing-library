import { DEFAULT_SETTINGS_RECORD_ID, STORE_NAMES } from './schema';
import { getRecord, putRecord } from './open-db';
import type { AppSettingsRecord } from './types';

export const DEFAULT_VISUAL_FILTERS = {
  brightness: 100,
  contrast: 100,
  hue: 0,
  saturate: 100,
  sepia: 0,
  grayscale: 0,
  invert: 0,
} satisfies AppSettingsRecord['visualFilters'];

export const DEFAULT_APP_SETTINGS = {
  punctuationAndCaseStrict: true,
  theme: 'paper',
  fontSize: 'md',
  typoDisplayMode: 'inline-red' as const,
  soundProfile: 'soft' as const,
  soundVolume: 60,
  visualFilters: DEFAULT_VISUAL_FILTERS,
} satisfies Omit<AppSettingsRecord, 'id' | 'updatedAt'>;

export type AppSettingsPatch =
  Partial<Omit<AppSettingsRecord, 'id' | 'updatedAt' | 'visualFilters'>> & {
    visualFilters?: Partial<AppSettingsRecord['visualFilters']>;
  };

export async function getAppSettings(): Promise<AppSettingsRecord> {
  const stored = await getRecord<AppSettingsRecord>(
    STORE_NAMES.appSettings,
    DEFAULT_SETTINGS_RECORD_ID,
  );

  return {
    id: DEFAULT_SETTINGS_RECORD_ID,
    ...DEFAULT_APP_SETTINGS,
    ...stored,
    visualFilters: {
      ...DEFAULT_VISUAL_FILTERS,
      ...stored?.visualFilters,
    },
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
  };
}

export async function saveAppSettings(patch: AppSettingsPatch): Promise<AppSettingsRecord> {
  const current = await getAppSettings();
  const nextRecord: AppSettingsRecord = {
    ...current,
    ...patch,
    visualFilters: {
      ...current.visualFilters,
      ...patch.visualFilters,
    },
    id: DEFAULT_SETTINGS_RECORD_ID,
    updatedAt: new Date().toISOString(),
  };

  return putRecord(STORE_NAMES.appSettings, nextRecord);
}
