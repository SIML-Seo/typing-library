'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import {
  listMyWorks,
  listTypingResults,
  type MyWorkRecord,
  type TypingResultRecord,
} from '@/shared/db';
import PageNav from '@/shared/components/PageNav';
import { useWorksCatalog } from '@/features/library/useWorksCatalog';
import { formatElapsedTime } from '@/features/typing/session';
import { buildResultEntries, summarizeResults, type ResultKindFilter } from './history';

type LocalStatus = 'loading' | 'ready' | 'error';

export default function ResultsPage() {
  const t = useI18n();
  const locale = useAppLocale();
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

  return (
    <div className="min-h-screen">
      <PageNav current="results" />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)] sm:text-3xl">
            {t('results.header.title')}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {t('results.header.description')}
          </p>
        </div>

        {/* Overview metrics */}
        <div className="animate-fade-up-delay-1 mt-8 grid gap-4 sm:grid-cols-4">
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

        {/* Toolbar + Results */}
        <div className="animate-fade-up-delay-2 mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('results.toolbar.searchPlaceholder')}
              className="max-w-sm rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
            />

            <div className="flex items-center gap-1.5">
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

          {localStatus === 'loading' ? (
            <StatusPanel>{t('results.status.loading')}</StatusPanel>
          ) : null}

          {localStatus === 'error' ? (
            <StatusPanel tone="danger">{errorMessage ?? t('results.status.error')}</StatusPanel>
          ) : null}

          {localStatus === 'ready' && entries.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-16 text-center">
              <h2 className="text-xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                {t('results.empty.title')}
              </h2>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {t('results.empty.body')}
              </p>
              <Link
                href={libraryPath}
                className="mt-6 inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                {t('results.empty.action')}
              </Link>
            </div>
          ) : null}

          {localStatus === 'ready' && entries.length > 0 ? (
            <div className="mt-6 space-y-3">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          entry.workKind === 'public'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {entry.workKind === 'public'
                            ? t('results.card.publicBadge')
                            : t('results.card.myBadge')}
                        </span>
                        <span className="text-xs text-[color:var(--muted)]">
                          {entry.author ?? t('results.card.authorFallback')}
                        </span>
                      </div>
                      <h2 className="mt-2 text-lg font-medium text-[color:var(--foreground)]">
                        {entry.title}
                      </h2>
                    </div>

                    <p className="shrink-0 text-sm tabular-nums text-[color:var(--muted)]">
                      {new Date(entry.endedAt).toLocaleString(locale, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-light tabular-nums text-[color:var(--foreground)]">
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
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-[color:var(--foreground)] text-white'
          : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--foreground)]'
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
  return (
    <div
      className={`mt-6 rounded-xl border px-5 py-10 text-center text-sm ${
        tone === 'danger'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-[color:var(--line)] bg-[color:var(--surface-sunken)] text-[color:var(--muted)]'
      }`}
    >
      {children}
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[color:var(--surface-sunken)] px-3 py-3">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-lg font-medium tabular-nums text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
