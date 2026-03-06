'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useCurrentLocale, useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import {
  listMyWorks,
  listTypingResults,
  type MyWorkRecord,
  type TypingResultRecord,
} from '@/shared/db';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import { useWorksCatalog } from '@/features/library/useWorksCatalog';
import { formatElapsedTime } from '@/features/typing/session';
import { buildResultEntries, summarizeResults, type ResultKindFilter } from './history';

type LocalStatus = 'loading' | 'ready' | 'error';

export default function ResultsPage() {
  const t = useI18n();
  const locale = useCurrentLocale();
  const { items, status: catalogStatus } = useWorksCatalog();
  const [localStatus, setLocalStatus] = useState<LocalStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<TypingResultRecord[]>([]);
  const [myWorks, setMyWorks] = useState<MyWorkRecord[]>([]);
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<ResultKindFilter>('all');

  useEffect(() => {
    let isMounted = true;

    Promise.all([listTypingResults(), listMyWorks()])
      .then(([typingResults, personalWorks]) => {
        if (!isMounted) {
          return;
        }

        setResults(typingResults);
        setMyWorks(personalWorks);
        setLocalStatus('ready');
        setErrorMessage(null);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setLocalStatus('error');
        setErrorMessage(error instanceof Error ? error.message : t('results.status.error'));
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  const entries = useMemo(
    () =>
      buildResultEntries({
        results,
        publicWorks: catalogStatus === 'ready' ? items : [],
        myWorks,
        query,
        kindFilter,
        unknownPublicWorkTitle: t('results.card.unknownPublicTitle'),
        unknownMyWorkTitle: t('results.card.unknownMyTitle'),
      }),
    [catalogStatus, items, kindFilter, myWorks, query, results, t],
  );

  const overview = useMemo(() => summarizeResults(entries), [entries]);
  const libraryPath = getLocalizedPath(locale, '/library');
  const landingPath = getLocalizedPath(locale, '/');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(244,239,230,0.88)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent)]">
              {t('results.header.eyebrow')}
            </p>
            <h1 className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
              {t('results.header.title')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              {t('results.header.description')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={libraryPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('results.header.backToLibrary')}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.25fr)_320px] lg:px-10 lg:py-14">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label={t('results.metrics.sessions')}
              value={`${overview.totalSessions}`}
            />
            <MetricCard
              label={t('results.metrics.averageAccuracy')}
              value={overview.averageAccuracy === null ? '—' : `${overview.averageAccuracy}%`}
            />
            <MetricCard
              label={t('results.metrics.averageWpm')}
              value={overview.averageWpm === null ? '—' : `${overview.averageWpm}`}
            />
            <MetricCard
              label={t('results.metrics.latestSession')}
              value={
                overview.latestEndedAt
                  ? new Date(overview.latestEndedAt).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : t('results.metrics.noData')
              }
            />
          </div>

          <section className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,243,236,0.88))] p-6 shadow-[0_24px_90px_rgba(60,34,24,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[color:var(--line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <label className="block lg:w-80">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {t('results.toolbar.searchLabel')}
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('results.toolbar.searchPlaceholder')}
                  className="w-full rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:#9b8a7b] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(161,68,49,0.12)]"
                />
              </label>

              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {t('results.toolbar.filterLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={kindFilter === 'all'}
                    onClick={() => setKindFilter('all')}
                    label={t('results.toolbar.all')}
                  />
                  <FilterChip
                    active={kindFilter === 'public'}
                    onClick={() => setKindFilter('public')}
                    label={t('results.toolbar.public')}
                  />
                  <FilterChip
                    active={kindFilter === 'my'}
                    onClick={() => setKindFilter('my')}
                    label={t('results.toolbar.my')}
                  />
                </div>
              </div>
            </div>

            {localStatus === 'loading' ? (
              <StatusPanel>{t('results.status.loading')}</StatusPanel>
            ) : null}

            {localStatus === 'error' ? (
              <StatusPanel tone="danger">{errorMessage ?? t('results.status.error')}</StatusPanel>
            ) : null}

            {localStatus === 'ready' && entries.length === 0 ? (
              <div className="mt-6 rounded-[1.6rem] border border-dashed border-[color:var(--line)] bg-[rgba(255,255,255,0.62)] px-5 py-10 text-center">
                <h2 className="text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                  {t('results.empty.title')}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {t('results.empty.body')}
                </p>
                <Link
                  href={libraryPath}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
                >
                  {t('results.empty.action')}
                </Link>
              </div>
            ) : null}

            {localStatus === 'ready' && entries.length > 0 ? (
              <div className="mt-6 space-y-4">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-[1.6rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.74)] p-5 shadow-[0_18px_50px_rgba(53,31,22,0.06)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <span className="inline-flex rounded-full border border-[color:var(--line)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                          {entry.workKind === 'public'
                            ? t('results.card.publicBadge')
                            : t('results.card.myBadge')}
                        </span>
                        <h2 className="mt-4 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                          {entry.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[color:var(--muted)]">
                          <span>{entry.author ?? t('results.card.authorFallback')}</span>
                          <span>{entry.language ?? t('results.card.languageFallback')}</span>
                        </div>
                      </div>

                      <div className="text-sm text-[color:var(--muted)]">
                        <p className="text-[11px] uppercase tracking-[0.22em]">
                          {t('results.card.endedAt')}
                        </p>
                        <p className="mt-2 text-base text-[color:var(--foreground)]">
                          {new Date(entry.endedAt).toLocaleString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <ResultMetric
                        label={t('results.card.accuracy')}
                        value={`${entry.accuracy}%`}
                      />
                      <ResultMetric
                        label={t('results.card.wpm')}
                        value={`${entry.wpm}`}
                      />
                      <ResultMetric
                        label={t('results.card.elapsed')}
                        value={formatElapsedTime(entry.elapsedTimeMs)}
                      />
                      <ResultMetric
                        label={t('results.card.typos')}
                        value={`${entry.typoCount}`}
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:#181310] p-6 text-[color:#efe3d7] shadow-[0_28px_90px_rgba(37,20,13,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:#a99182]">
              {t('results.side.title')}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:#d7c7ba]">
              {t('results.side.body')}
            </p>

            <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[color:#d7c7ba]">
              {t('results.side.catalogNotice')}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {t('results.header.backToLanding')}
            </p>
            <Link
              href={landingPath}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.9)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('results.header.backToLanding')}
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] p-5 shadow-[0_14px_40px_rgba(53,31,22,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
        {value}
      </p>
    </article>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-[color:var(--accent)] bg-[rgba(161,68,49,0.08)] text-[color:var(--accent)]'
          : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.74)] text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]'
      }`}
    >
      {label}
    </button>
  );
}

function StatusPanel({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'danger';
}) {
  const toneClassName =
    tone === 'danger'
      ? 'border-[rgba(161,68,49,0.22)] bg-[rgba(161,68,49,0.08)] text-[color:var(--foreground)]'
      : 'border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] text-[color:var(--muted)]';

  return (
    <div
      className={`mt-6 rounded-[1.6rem] border px-5 py-10 text-center text-sm ${toneClassName}`}
    >
      {children}
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
