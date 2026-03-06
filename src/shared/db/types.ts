export type WorkKind = 'public' | 'my';

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
    theme: string;
    fontSize: string;
    typoDisplayMode: 'inline-red';
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
  paragraphReportsSnapshot?: ParagraphReport[];
  elapsedTimeMs: number;
  settingsSnapshot: TypingResultRecord['settingsSnapshot'];
  updatedAt: string;
}

export interface AppSettingsRecord {
  id: typeof import('./schema').DEFAULT_SETTINGS_RECORD_ID;
  punctuationAndCaseStrict: boolean;
  theme: string;
  fontSize: string;
  typoDisplayMode: 'inline-red';
  updatedAt: string;
}
