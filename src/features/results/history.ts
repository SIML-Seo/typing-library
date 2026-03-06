import type { MyWorkRecord, TypingResultRecord } from '@/shared/db';
import type { WorkCatalogItem } from '@/features/library/types';

export type ResultKindFilter = 'all' | 'public' | 'my';

export interface ResultEntry {
  id: string;
  workId: string;
  workKind: TypingResultRecord['workRef']['kind'];
  title: string;
  author?: string;
  language?: string;
  endedAt: string;
  accuracy: number;
  wpm: number;
  elapsedTimeMs: number;
  typoCount: number;
}

export interface ResultOverview {
  totalSessions: number;
  averageAccuracy: number | null;
  averageWpm: number | null;
  latestEndedAt: string | null;
}

const UNKNOWN_PUBLIC_WORK_TITLE = '알 수 없는 공개 작품';
const UNKNOWN_MY_WORK_TITLE = '알 수 없는 내 작품';

function resolvePublicWorkMeta(
  workId: string,
  publicWorks: WorkCatalogItem[],
): Partial<Pick<ResultEntry, 'title' | 'author' | 'language'>> {
  const matched = publicWorks.find((work) => work.id === workId);

  if (!matched) {
    return {};
  }

  return {
    title: matched.title,
    author: matched.author,
    language: matched.language,
  };
}

function resolveMyWorkMeta(
  workId: string,
  myWorks: MyWorkRecord[],
): Partial<Pick<ResultEntry, 'title' | 'author' | 'language'>> {
  const matched = myWorks.find((work) => work.id === workId);

  if (!matched) {
    return {};
  }

  return {
    title: matched.title,
    author: matched.author,
  };
}

export function buildResultEntries(params: {
  results: TypingResultRecord[];
  publicWorks: WorkCatalogItem[];
  myWorks: MyWorkRecord[];
  query?: string;
  kindFilter?: ResultKindFilter;
  unknownPublicWorkTitle?: string;
  unknownMyWorkTitle?: string;
}): ResultEntry[] {
  const {
    results,
    publicWorks,
    myWorks,
    query = '',
    kindFilter = 'all',
    unknownPublicWorkTitle = UNKNOWN_PUBLIC_WORK_TITLE,
    unknownMyWorkTitle = UNKNOWN_MY_WORK_TITLE,
  } = params;
  const normalizedQuery = query.trim().toLowerCase();

  return results
    .map((record) => {
      const workMeta =
        record.workRef.kind === 'public'
          ? resolvePublicWorkMeta(record.workRef.id, publicWorks)
          : resolveMyWorkMeta(record.workRef.id, myWorks);
      const title =
        record.workRef.kind === 'public'
          ? workMeta.title || unknownPublicWorkTitle
          : workMeta.title || unknownMyWorkTitle;

      return {
        id: record.id,
        workId: record.workRef.id,
        workKind: record.workRef.kind,
        title,
        author: workMeta.author,
        language: workMeta.language,
        endedAt: record.endedAt,
        accuracy: record.accuracy,
        wpm: record.wpm,
        elapsedTimeMs: record.elapsedTimeMs,
        typoCount:
          record.paragraphReports?.reduce((sum, report) => sum + report.typoCount, 0) ?? 0,
      } satisfies ResultEntry;
    })
    .filter((entry) => (kindFilter === 'all' ? true : entry.workKind === kindFilter))
    .filter((entry) => {
      if (!normalizedQuery) {
        return true;
      }

      return [entry.title, entry.author, entry.language]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    })
    .sort((left, right) => right.endedAt.localeCompare(left.endedAt));
}

export function summarizeResults(entries: ResultEntry[]): ResultOverview {
  if (entries.length === 0) {
    return {
      totalSessions: 0,
      averageAccuracy: null,
      averageWpm: null,
      latestEndedAt: null,
    };
  }

  const totalAccuracy = entries.reduce((sum, entry) => sum + entry.accuracy, 0);
  const totalWpm = entries.reduce((sum, entry) => sum + entry.wpm, 0);

  return {
    totalSessions: entries.length,
    averageAccuracy: Math.round((totalAccuracy / entries.length) * 10) / 10,
    averageWpm: Math.round((totalWpm / entries.length) * 10) / 10,
    latestEndedAt: entries[0].endedAt,
  };
}
