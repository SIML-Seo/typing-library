export type WorkKind = 'public' | 'my';
export type AppTheme = 'paper' | 'dark';
export type FontSize = 'sm' | 'md' | 'lg';
export type TypoDisplayMode = 'inline-red' | 'underline-red';

export interface VisualFilterSettings {
  brightness: number;
  contrast: number;
  hue: number;
  saturate: number;
  sepia: number;
  grayscale: number;
  invert: number;
}

export interface WorkRef {
  kind: WorkKind;
  id: string;
}

export interface ParagraphReport {
  paragraphIndex: number;
  typoCount: number;
  correctedTypoCount: number;
  startedAt: string;
  endedAt: string;
}

export interface TypingDraftParagraphReport extends ParagraphReport {
  typedLength: number;
  correctCharacterCount: number;
}

export interface MyWorkRecord {
  id: string;
  title: string;
  author?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypingResultRecord {
  id: string;
  workRef: WorkRef;
  startedAt: string;
  endedAt: string;
  elapsedTimeMs: number;
  wpm: number;
  accuracy: number;
  settingsSnapshot: {
    punctuationAndCaseStrict: boolean;
    theme: AppTheme;
    fontSize: FontSize;
    typoDisplayMode: TypoDisplayMode;
    visualFilters: VisualFilterSettings;
  };
  paragraphReports?: ParagraphReport[];
}

export interface TypingDraftRecord {
  id: string;
  workRef: WorkRef;
  partId?: string;
  workChecksum?: string;
  paragraphIndex: number;
  currentParagraphInput: string;
  paragraphReportsSnapshot?: TypingDraftParagraphReport[];
  elapsedTimeMs: number;
  settingsSnapshot: TypingResultRecord['settingsSnapshot'];
  updatedAt: string;
}

export interface AppSettingsRecord {
  id: typeof import('./schema').DEFAULT_SETTINGS_RECORD_ID;
  punctuationAndCaseStrict: boolean;
  theme: AppTheme;
  fontSize: FontSize;
  typoDisplayMode: TypoDisplayMode;
  visualFilters: VisualFilterSettings;
  updatedAt: string;
}
