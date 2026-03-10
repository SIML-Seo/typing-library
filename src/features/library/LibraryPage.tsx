'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { listMyWorks } from '@/shared/db';
import PageNav from '@/shared/components/PageNav';
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
  return (
    <div className="min-h-screen">
      <PageNav current="library" />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
        {/* Page header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)] sm:text-3xl">
            {t('library.header.title')}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {t('library.catalog.description')}
          </p>
        </div>

        {/* Metrics row */}
        <div className="animate-fade-up-delay-1 mt-8 grid gap-4 sm:grid-cols-3">
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

        {/* Main content: catalog + detail */}
        <div className="animate-fade-up-delay-2 mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Catalog section */}
          <section>
            {/* Search */}
            <div className="mb-6">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('library.catalog.searchPlaceholder')}
                className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
              />
            </div>

            {status === 'error' ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage ?? t('library.metrics.myWorksError')}
              </div>
            ) : null}

            {sourceMode === 'preview' ? (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_WORKS_BASE_URL
                </code>
                {' '}
                {t('library.catalog.previewWarning')}
              </div>
            ) : null}

            {/* Work cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {status === 'loading'
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-sunken)]"
                    />
                  ))
                : filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedWorkId(item.id)}
                      className={`group rounded-xl border p-5 text-left transition ${
                        item.id === selectedWork?.id
                          ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] shadow-sm'
                          : 'border-[color:var(--line)] bg-[color:var(--surface)] hover:border-[color:var(--muted)] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-[color:var(--muted)]">
                            {item.language ?? t('library.catalog.unknownLanguage')} · {item.parts?.length ? t('library.catalog.multipart') : t('library.catalog.singleFile')}
                          </p>
                          <h3 className="mt-2 text-base font-medium leading-snug text-[color:var(--foreground)]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="shrink-0 rounded-md bg-[color:var(--surface-sunken)] px-2 py-1 text-xs text-[color:var(--muted)]">
                          {item.parts?.length
                            ? `${item.parts.length} ${t('library.catalog.partsSuffix')}`
                            : t('library.catalog.singleBadge')}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[color:var(--foreground)]">
                        {item.author ?? t('library.catalog.authorFallback')}
                      </p>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[color:var(--muted)]">
                        {item.copyrightProof}
                      </p>
                    </button>
                  ))}
            </div>

            {status === 'ready' && filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--line)] px-5 py-10 text-center text-sm text-[color:var(--muted)]">
                {t('library.catalog.noResults')}
              </div>
            ) : null}
          </section>

          {/* Detail sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[#1c1917] p-6 text-white">
              <p className="text-xs text-white/50">
                {t('library.selection.eyebrow')}
              </p>
              {selectedWork ? (
                <>
                  <h2 className="mt-4 text-xl [font-family:var(--font-display)] leading-snug">
                    {selectedWork.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    {selectedWork.author ?? t('library.catalog.authorFallback')}
                  </p>

                  <div className="mt-6 space-y-3 text-sm">
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

                  <p className="mt-5 rounded-lg border border-white/[0.06] bg-white/[0.04] p-3 text-xs leading-relaxed text-white/60">
                    {selectedWork.copyrightProof}
                  </p>

                  {typingPath ? (
                    <Link
                      href={typingPath}
                      className="mt-5 flex w-full items-center justify-center rounded-lg bg-[color:var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      {t('typing.startTyping')}
                    </Link>
                  ) : null}
                </>
              ) : (
                <p className="mt-4 text-sm text-white/60">
                  {t('library.selection.noSelection')}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
              <p className="text-xs font-medium text-[color:var(--muted)]">
                {t('library.side.worksOriginLabel')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                {worksBaseUrl
                  ? t('library.side.worksOriginCurrent', { url: worksBaseUrl })
                  : t('library.side.worksOriginUnset')}
              </p>
            </div>

            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
              <p className="text-xs font-medium text-[color:var(--muted)]">
                {t('library.side.localFirstLabel')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                {t('library.side.localFirstDescription')}
              </p>
            </div>
          </aside>
        </div>
      </main>
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
    <article className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-light tabular-nums text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">{description}</p>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2.5">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-right text-sm text-white/80">{value}</span>
    </div>
  );
}
