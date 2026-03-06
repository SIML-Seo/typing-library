'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { useCurrentLocale, useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import { listMyWorks, removeMyWork, saveMyWork, type MyWorkRecord } from '@/shared/db';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import { createMyWorkRecord } from './record';

type LoadStatus = 'loading' | 'ready' | 'error';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface FormState {
  title: string;
  author: string;
  content: string;
  sourceFileName: string | null;
}

const EMPTY_FORM: FormState = {
  title: '',
  author: '',
  content: '',
  sourceFileName: null,
};

export default function MyWorksPage() {
  const t = useI18n();
  const locale = useCurrentLocale();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [works, setWorks] = useState<MyWorkRecord[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const libraryPath = getLocalizedPath(locale, '/library');
  const resultsPath = getLocalizedPath(locale, '/results');

  useEffect(() => {
    let isMounted = true;

    listMyWorks()
      .then((records) => {
        if (!isMounted) {
          return;
        }

        setWorks(records);
        setLoadStatus('ready');
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        setLoadStatus('error');
        setErrorMessage(error instanceof Error ? error.message : t('myWorks.form.error'));
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  function updateForm<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setErrorMessage(t('myWorks.form.invalidFile'));
      event.target.value = '';
      return;
    }

    try {
      const content = await file.text();

      setForm((current) => ({
        ...current,
        title: current.title || file.name.replace(/\.txt$/i, ''),
        content,
        sourceFileName: file.name,
      }));
      setErrorMessage(null);
    } catch {
      setErrorMessage(t('myWorks.form.fileReadError'));
    } finally {
      event.target.value = '';
    }
  }

  async function handleSave() {
    if (form.content.trim().length === 0) {
      setErrorMessage(t('myWorks.form.emptyContent'));
      return;
    }

    setSaveStatus('saving');

    try {
      const record = createMyWorkRecord({
        title: form.title,
        author: form.author,
        content: form.content,
        sourceFileName: form.sourceFileName ?? undefined,
      });

      await saveMyWork(record);

      setWorks((current) => [record, ...current.filter((item) => item.id !== record.id)]);
      setForm(EMPTY_FORM);
      setSaveStatus('saved');
      setErrorMessage(null);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : t('myWorks.form.error'));
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);

    try {
      await removeMyWork(id);
      setWorks((current) => current.filter((work) => work.id !== id));
      setErrorMessage(null);
    } catch {
      setErrorMessage(t('myWorks.list.deleteError'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:rgba(244,239,230,0.88)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent)]">
              {t('myWorks.header.eyebrow')}
            </p>
            <h1 className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
              {t('myWorks.header.title')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              {t('myWorks.header.description')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={resultsPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('results.navLabel')}
            </Link>
            <Link
              href={libraryPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:rgba(255,255,255,0.72)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('myWorks.header.backToLibrary')}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-10 lg:py-14">
        <section className="rounded-[2rem] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,243,236,0.88))] p-6 shadow-[0_24px_90px_rgba(60,34,24,0.08)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            {t('myWorks.form.title')}
          </p>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            {t('myWorks.form.description')}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                {t('myWorks.form.titleLabel')}
              </span>
              <input
                value={form.title}
                onChange={(event) => updateForm('title', event.target.value)}
                placeholder={t('myWorks.form.titlePlaceholder')}
                className="w-full rounded-[1.2rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:#9b8a7b] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(161,68,49,0.12)]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                {t('myWorks.form.authorLabel')}
              </span>
              <input
                value={form.author}
                onChange={(event) => updateForm('author', event.target.value)}
                placeholder={t('myWorks.form.authorPlaceholder')}
                className="w-full rounded-[1.2rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:#9b8a7b] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(161,68,49,0.12)]"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {t('myWorks.form.contentLabel')}
            </span>
            <textarea
              value={form.content}
              onChange={(event) => updateForm('content', event.target.value)}
              placeholder={t('myWorks.form.contentPlaceholder')}
              className="min-h-[320px] w-full rounded-[1.4rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.84)] px-4 py-4 text-sm leading-7 text-[color:var(--foreground)] outline-none transition placeholder:text-[color:#9b8a7b] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[rgba(161,68,49,0.12)]"
            />
          </label>

          <div className="mt-4 rounded-[1.4rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {t('myWorks.form.fileLabel')}
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              {t('myWorks.form.fileHint')}
            </p>
            <input
              type="file"
              accept=".txt,text/plain"
              onChange={handleFileChange}
              className="mt-4 block w-full text-sm text-[color:var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[color:var(--accent-strong)]"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[rgba(161,68,49,0.35)] hover:enabled:bg-[color:var(--accent-strong)]"
            >
              {saveStatus === 'saving' ? t('myWorks.form.saving') : t('myWorks.form.saveAction')}
            </button>
            <button
              type="button"
              onClick={() => setForm(EMPTY_FORM)}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.82)] px-6 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('myWorks.form.resetAction')}
            </button>
          </div>

          {saveStatus === 'saved' ? (
            <p className="mt-4 text-sm text-[color:var(--accent)]">{t('myWorks.form.success')}</p>
          ) : null}
          {errorMessage ? (
            <p className="mt-4 text-sm text-[color:#a14431]">{errorMessage}</p>
          ) : null}
        </section>

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:#181310] p-6 text-[color:#efe3d7] shadow-[0_28px_90px_rgba(37,20,13,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:#a99182]">
              {t('myWorks.list.title')}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:#d7c7ba]">
              {t('myWorks.list.description')}
            </p>
            <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[color:#d7c7ba]">
              {t('myWorks.meta.localOnly')}
            </div>
          </div>

          {loadStatus === 'loading' ? (
            <StatusPanel>{t('results.status.loading')}</StatusPanel>
          ) : null}

          {loadStatus === 'error' ? <StatusPanel tone="danger">{errorMessage}</StatusPanel> : null}

          {loadStatus === 'ready' && works.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-[rgba(255,255,255,0.62)] px-5 py-10 text-center">
              <h2 className="text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                {t('myWorks.list.emptyTitle')}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {t('myWorks.list.emptyBody')}
              </p>
            </div>
          ) : null}

          {loadStatus === 'ready' && works.length > 0
            ? works.map((work) => (
                <article
                  key={work.id}
                  className="rounded-[1.6rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.74)] p-5 shadow-[0_18px_50px_rgba(53,31,22,0.06)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
                    {t('myWorks.meta.localOnly')}
                  </p>
                  <h2 className="mt-3 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                    {work.title}
                  </h2>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    {work.author ?? t('myWorks.list.authorFallback')}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                    {t('myWorks.list.updatedAt')} ·{' '}
                    {new Date(work.updatedAt).toLocaleString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={getLocalizedPath(locale, `/typing/my/${work.id}`)}
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
                    >
                      {t('myWorks.list.startTyping')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(work.id)}
                      disabled={deletingId === work.id}
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[rgba(255,255,255,0.88)] px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:#a14431] hover:text-[color:#a14431] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === work.id ? t('myWorks.list.deleting') : t('myWorks.list.deleteAction')}
                    </button>
                  </div>
                </article>
              ))
            : null}
        </section>
      </main>
    </div>
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
      className={`rounded-[1.6rem] border px-5 py-10 text-center text-sm ${toneClassName}`}
    >
      {children}
    </div>
  );
}
