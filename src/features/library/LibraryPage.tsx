'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import { listMyWorks } from '@/shared/db';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import { buildTypingPath } from '@/features/typing/route';
import { useWorksCatalog } from './useWorksCatalog';

export default function LibraryPage() {
  const t = useI18n();
  const locale = useAppLocale();
  const { items, sourceMode, status, worksBaseUrl, errorMessage } = useWorksCatalog();
  const [query, setQuery] = useState('');
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [myWorksCount, setMyWorksCount] = useState<number | null>(null);
  const [myWorksError, setMyWorksError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listMyWorks()
      .then((records) => {
        if (!isMounted) {
          return;
        }

        setMyWorksCount(records.length);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setMyWorksError(
          error instanceof Error
            ? error.message
            : t('library.metrics.myWorksError'),
        );
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const searchableFields = [item.title, item.author, item.language, item.source].filter(
        (value): value is string => Boolean(value),
      );

      return searchableFields.some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [items, query]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedWorkId(null);
      return;
    }

    if (!selectedWorkId || !filteredItems.some((item) => item.id === selectedWorkId)) {
      setSelectedWorkId(filteredItems[0].id);
    }
  }, [filteredItems, selectedWorkId]);

  const selectedWork =
    filteredItems.find((item) => item.id === selectedWorkId) ?? filteredItems[0] ?? null;
  const typingPath = selectedWork
    ? buildTypingPath(locale, {
        workId: selectedWork.id,
      })
    : null;
  const myWorksPath = getLocalizedPath(locale, '/my-works');
  const resultsPath = getLocalizedPath(locale, '/results');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(244,239,230,0.88)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent)]">
              {t('library.header.eyebrow')}
            </p>
            <h1 className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
              {t('library.header.title')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <SourceBadge sourceMode={sourceMode} />
            <LocaleSwitcher />
            <Link
              href={myWorksPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('myWorks.navLabel')}
            </Link>
            <Link
              href={resultsPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('results.navLabel')}
            </Link>
            <Link
              href={getLocalizedPath(locale, '/')}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('library.header.back')}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:px-10 lg:py-14">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label={t('library.metrics.publicWorksLabel')}
              value={status === 'ready' ? `${items.length}` : '...'}
              description={t('library.metrics.publicWorksDescription')}
            />
            <MetricCard
              label={t('library.metrics.myWorksLabel')}
              value={
                myWorksError
                  ? t('library.metrics.myWorksError')
                  : myWorksCount === null
                    ? t('library.metrics.myWorksPending')
                    : `${myWorksCount}`
              }
              description={
                myWorksError ?? t('library.metrics.myWorksDescription')
              }
            />
            <MetricCard
              label={t('library.metrics.modeLabel')}
              value={
                sourceMode === 'works-origin'
                  ? t('library.metrics.liveMode')
                  : t('library.metrics.previewMode')
              }
              description={
                sourceMode === 'works-origin'
                  ? t('library.metrics.liveDescription')
                  : t('library.metrics.previewDescription')
              }
            />
          </div>

          <section className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,243,236,0.88))] p-6 shadow-[0_24px_90px_rgba(60,34,24,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[color:var(--line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                  {t('library.catalog.eyebrow')}
                </p>
                <h2 className="mt-3 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                  {t('library.catalog.title')}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
                  {t('library.catalog.description')}
                </p>
              </div>

              <label className="block lg:w-72">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {t('library.catalog.searchLabel')}
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('library.catalog.searchPlaceholder')}
                  className="w-full rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:#9b8a7b] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(161,68,49,0.12)]"
                />
              </label>
            </div>

            {status === 'error' ? (
              <div className="mt-6 rounded-[1.5rem] border border-[rgba(161,68,49,0.22)] bg-[rgba(161,68,49,0.08)] px-5 py-4 text-sm text-[color:var(--foreground)]">
                {errorMessage ?? t('library.metrics.myWorksError')}
              </div>
            ) : null}

            {sourceMode === 'preview' ? (
              <div className="mt-6 rounded-[1.5rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.7)] px-5 py-4 text-sm leading-7 text-[color:var(--muted)]">
                <code className="rounded bg-[rgba(24,19,16,0.06)] px-1.5 py-0.5 text-[color:var(--foreground)]">
                  NEXT_PUBLIC_WORKS_BASE_URL
                </code>
                {' '}
                {t('library.catalog.previewWarning')}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {status === 'loading'
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-48 animate-pulse rounded-[1.5rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.55)]"
                    />
                  ))
                : filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWorkId(item.id)}
                      className={`group rounded-[1.6rem] border p-5 text-left transition ${
                        item.id === selectedWork?.id
                          ? 'border-[color:var(--accent)] bg-[rgba(161,68,49,0.08)] shadow-[0_18px_40px_rgba(92,40,28,0.10)]'
                          : 'border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] hover:border-[color:rgba(161,68,49,0.35)] hover:bg-[color:rgba(255,255,255,0.94)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.26em] text-[color:var(--muted)]">
                            {item.language ?? t('library.catalog.unknownLanguage')} ·{' '}
                            {item.parts?.length
                              ? t('library.catalog.multipart')
                              : t('library.catalog.singleFile')}
                          </p>
                          <h3 className="mt-3 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[color:var(--accent)]">
                          {item.parts?.length
                            ? `${item.parts.length} ${t('library.catalog.partsSuffix')}`
                            : t('library.catalog.singleBadge')}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-[color:var(--foreground)]">
                        {item.author ?? t('library.catalog.authorFallback')}
                      </p>
                      <p className="mt-4 min-h-20 text-sm leading-7 text-[color:var(--muted)]">
                        {item.copyrightProof}
                      </p>

                      <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
                        <span>{item.source ?? t('library.catalog.sourcePending')}</span>
                        <span className="transition group-hover:text-[color:var(--accent)]">
                          {t('library.catalog.select')}
                        </span>
                      </div>
                    </button>
                  ))}
            </div>

            {status === 'ready' && filteredItems.length === 0 ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-[color:var(--line)] px-5 py-8 text-center text-sm text-[color:var(--muted)]">
                {t('library.catalog.noResults')}
              </div>
            ) : null}
          </section>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:#181310] p-6 text-[color:#efe3d7] shadow-[0_28px_90px_rgba(37,20,13,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:#a99182]">
              {t('library.selection.eyebrow')}
            </p>
            {selectedWork ? (
              <>
                <h2 className="mt-4 text-3xl [font-family:var(--font-display)] leading-tight">
                  {selectedWork.title}
                </h2>
                <p className="mt-3 text-sm text-[color:#d7c7ba]">
                  {selectedWork.author ?? t('library.catalog.authorFallback')}
                </p>
                <div className="mt-6 space-y-3 text-sm leading-7 text-[color:#c9b8ab]">
                  <InfoRow
                    label={t('library.selection.languageLabel')}
                    value={selectedWork.language ?? t('library.selection.languageFallback')}
                  />
                  <InfoRow
                    label={t('library.selection.pathLabel')}
                    value={
                      selectedWork.textPath ??
                      `${selectedWork.parts?.length ?? 0} ${t('library.catalog.partsSuffix')}`
                    }
                  />
                  <InfoRow
                    label={t('library.selection.sourceLabel')}
                    value={selectedWork.source ?? t('library.selection.sourceFallback')}
                  />
                </div>
                <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[color:#d7c7ba]">
                  {selectedWork.copyrightProof}
                </div>
                <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[color:#a99182]">
                    {t('library.selection.nextLabel')}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:#d7c7ba]">
                    {t('library.selection.nextDescription')}
                  </p>
                  {typingPath ? (
                    <Link
                      href={typingPath}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
                    >
                      {t('typing.startTyping')}
                    </Link>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[color:#d7c7ba]">
                {t('library.selection.noSelection')}
              </p>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {t('library.side.worksOriginLabel')}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              {worksBaseUrl
                ? t('library.side.worksOriginCurrent', { url: worksBaseUrl })
                : t('library.side.worksOriginUnset')}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {t('library.side.localFirstLabel')}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              {t('library.side.localFirstDescription')}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function SourceBadge({ sourceMode }: { sourceMode: 'preview' | 'works-origin' }) {
  const t = useI18n();
  const label =
    sourceMode === 'works-origin'
      ? t('library.badge.worksOrigin')
      : t('library.badge.preview');

  return (
    <div className="rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
      {label}
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.68)] p-5 shadow-[0_14px_40px_rgba(53,31,22,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-3">
      <span className="text-[11px] uppercase tracking-[0.24em] text-[color:#a99182]">
        {label}
      </span>
      <span className="text-right text-[color:#efe3d7]">{value}</span>
    </div>
  );
}
