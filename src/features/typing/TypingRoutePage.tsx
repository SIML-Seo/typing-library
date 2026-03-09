'use client';

import Link from 'next/link';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import TypingPage from './TypingPage';
import { parseTypingSearchParams } from './route';

export default function TypingRoutePage() {
  const t = useI18n();
  const locale = useAppLocale();
  const searchParams = useSearchParams();
  const { workId, workKind } = parseTypingSearchParams(searchParams);
  const fallbackPath = workKind === 'my' ? getLocalizedPath(locale, '/my-works') : getLocalizedPath(locale, '/library');

  if (!workId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
          {t('typing.title')}
        </p>
        <h1 className="mt-4 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
          {t('typing.statusNotFound')}
        </h1>
        <Link
          href={fallbackPath}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
        >
          {workKind === 'my' ? t('myWorks.navLabel') : t('typing.backToLibrary')}
        </Link>
      </main>
    );
  }

  return <TypingPage key={`${workKind}:${workId}`} workId={workId} workKind={workKind} />;
}
