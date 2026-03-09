import type { AppLocale } from '@/locales/config';
import { getLocalizedPath } from '@/locales/config';
import type { WorkKind } from '@/shared/db';

interface TypingRouteParams {
  workId: string;
  workKind?: WorkKind;
}

export function buildTypingPath(locale: AppLocale, params: TypingRouteParams) {
  const searchParams = new URLSearchParams({
    workId: params.workId,
  });

  if (params.workKind === 'my') {
    searchParams.set('kind', 'my');
  }

  return `${getLocalizedPath(locale, '/typing')}?${searchParams.toString()}`;
}

export function parseTypingSearchParams(searchParams: { get(name: string): string | null }) {
  const workId = searchParams.get('workId')?.trim() ?? '';
  const rawKind = searchParams.get('kind');
  const workKind: WorkKind = rawKind === 'my' ? 'my' : 'public';

  return {
    workId,
    workKind,
  };
}
