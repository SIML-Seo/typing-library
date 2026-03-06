import type { AppSettingsRecord, ParagraphReport, TypingResultRecord } from '@/shared/db';
import type { WorkKind } from '@/shared/db';

export interface CompletedParagraphState {
  paragraphIndex: number;
  typoCount: number;
  correctedTypoCount: number;
  typedLength: number;
  correctCharacterCount: number;
  startedAt: string;
  endedAt: string;
}

export function createTypingDraftId(workKind: WorkKind, workId: string) {
  return `typing-draft:${workKind}:${workId}`;
}

export function pickTypingSettingsSnapshot(
  settings: Pick<
    AppSettingsRecord,
    'punctuationAndCaseStrict' | 'theme' | 'fontSize' | 'typoDisplayMode' | 'visualFilters'
  >,
): TypingResultRecord['settingsSnapshot'] {
  return {
    punctuationAndCaseStrict: settings.punctuationAndCaseStrict,
    theme: settings.theme,
    fontSize: settings.fontSize,
    typoDisplayMode: settings.typoDisplayMode,
    visualFilters: settings.visualFilters,
  };
}

export function toParagraphReports(paragraphs: CompletedParagraphState[]): ParagraphReport[] {
  return paragraphs.map(
    ({ paragraphIndex, typoCount, correctedTypoCount, startedAt, endedAt }) => ({
      paragraphIndex,
      typoCount,
      correctedTypoCount,
      startedAt,
      endedAt,
    }),
  );
}

export function calculateOverallAccuracy(paragraphs: CompletedParagraphState[]) {
  const totalTypedLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.typedLength, 0);

  if (totalTypedLength === 0) {
    return 0;
  }

  const totalCorrectCharacters = paragraphs.reduce(
    (sum, paragraph) => sum + paragraph.correctCharacterCount,
    0,
  );

  return Math.round((totalCorrectCharacters / totalTypedLength) * 1000) / 10;
}

export function calculateOverallWpm(
  paragraphs: CompletedParagraphState[],
  elapsedTimeMs: number,
) {
  if (elapsedTimeMs <= 0) {
    return 0;
  }

  const totalTypedLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.typedLength, 0);

  return Math.round((((totalTypedLength / 5) * 60000) / elapsedTimeMs) * 10) / 10;
}

export function calculateTotalTypos(paragraphs: CompletedParagraphState[]) {
  return paragraphs.reduce((sum, paragraph) => sum + paragraph.typoCount, 0);
}

export function buildTypingResult(params: {
  id: string;
  workKind: WorkKind;
  workId: string;
  endedAt: string;
  elapsedTimeMs: number;
  settings: Pick<
    AppSettingsRecord,
    'punctuationAndCaseStrict' | 'theme' | 'fontSize' | 'typoDisplayMode' | 'visualFilters'
  >;
  paragraphs: CompletedParagraphState[];
}): TypingResultRecord {
  const { id, workKind, workId, endedAt, elapsedTimeMs, settings, paragraphs } = params;
  const endedAtMs = new Date(endedAt).getTime();

  return {
    id,
    workRef: {
      kind: workKind,
      id: workId,
    },
    startedAt: new Date(endedAtMs - elapsedTimeMs).toISOString(),
    endedAt,
    elapsedTimeMs,
    wpm: calculateOverallWpm(paragraphs, elapsedTimeMs),
    accuracy: calculateOverallAccuracy(paragraphs),
    settingsSnapshot: pickTypingSettingsSnapshot(settings),
    paragraphReports: toParagraphReports(paragraphs),
  };
}

export function formatElapsedTime(elapsedTimeMs: number) {
  const totalSeconds = Math.max(0, Math.round(elapsedTimeMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((unit) => `${unit}`.padStart(2, '0')).join(':');
  }

  return [`${minutes}`.padStart(2, '0'), `${seconds}`.padStart(2, '0')].join(':');
}
