'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { listMyWorks, removeMyWork, saveMyWork, type MyWorkRecord } from '@/shared/db';
import { buildMyWorkUploadEventParams, trackGa4Event } from '@/shared/analytics/ga4';
import PageNav from '@/shared/components/PageNav';
import { buildTypingPath } from '@/features/typing/route';
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
  const locale = useAppLocale();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [works, setWorks] = useState<MyWorkRecord[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      trackGa4Event(
        'my_work_upload',
        buildMyWorkUploadEventParams({
          textLength: record.content.length,
          uploadSource: form.sourceFileName ? 'file' : 'paste',
        }),
      );

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
      <PageNav current="my-works" />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)] sm:text-3xl">
            {t('myWorks.header.title')}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            {t('myWorks.header.description')}
          </p>
        </div>

        <div className="animate-fade-up-delay-1 mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Upload form */}
          <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6">
            <h2 className="text-sm font-medium text-[color:var(--foreground)]">
              {t('myWorks.form.title')}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              {t('myWorks.form.description')}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[color:var(--muted)]">
                  {t('myWorks.form.titleLabel')}
                </span>
                <input
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  placeholder={t('myWorks.form.titlePlaceholder')}
                  className="w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[color:var(--muted)]">
                  {t('myWorks.form.authorLabel')}
                </span>
                <input
                  value={form.author}
                  onChange={(event) => updateForm('author', event.target.value)}
                  placeholder={t('myWorks.form.authorPlaceholder')}
                  className="w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs font-medium text-[color:var(--muted)]">
                {t('myWorks.form.contentLabel')}
              </span>
              <textarea
                value={form.content}
                onChange={(event) => updateForm('content', event.target.value)}
                placeholder={t('myWorks.form.contentPlaceholder')}
                className="min-h-[280px] w-full rounded-lg border border-[color:var(--line)] bg-[color:var(--background)] px-3 py-3 text-sm leading-relaxed text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
              />
            </label>

            <div className="mt-4 rounded-lg border border-dashed border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-4">
              <p className="text-xs font-medium text-[color:var(--muted)]">
                {t('myWorks.form.fileLabel')}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {t('myWorks.form.fileHint')}
              </p>
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileChange}
                className="mt-3 block w-full text-sm text-[color:var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--foreground)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saveStatus === 'saving'}
                className="inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saveStatus === 'saving' ? t('myWorks.form.saving') : t('myWorks.form.saveAction')}
              </button>
              <button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--surface-sunken)] hover:text-[color:var(--foreground)]"
              >
                {t('myWorks.form.resetAction')}
              </button>
            </div>

            {saveStatus === 'saved' ? (
              <p className="mt-4 text-sm text-emerald-600">{t('myWorks.form.success')}</p>
            ) : null}
            {errorMessage ? (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            ) : null}
          </section>

          {/* Works list */}
          <section className="space-y-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-sunken)] p-4">
              <p className="text-sm font-medium text-[color:var(--foreground)]">
                {t('myWorks.list.title')}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {t('myWorks.meta.localOnly')}
              </p>
            </div>

            {loadStatus === 'loading' ? (
              <StatusPanel>{t('results.status.loading')}</StatusPanel>
            ) : null}

            {loadStatus === 'error' ? <StatusPanel tone="danger">{errorMessage}</StatusPanel> : null}

            {loadStatus === 'ready' && works.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-12 text-center">
                <h2 className="text-lg [font-family:var(--font-display)] text-[color:var(--foreground)]">
                  {t('myWorks.list.emptyTitle')}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {t('myWorks.list.emptyBody')}
                </p>
              </div>
            ) : null}

            {loadStatus === 'ready' && works.length > 0
              ? works.map((work) => (
                  <article
                    key={work.id}
                    className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 transition hover:shadow-sm"
                  >
                    <h2 className="text-base font-medium text-[color:var(--foreground)]">
                      {work.title}
                    </h2>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {work.author ?? t('myWorks.list.authorFallback')}
                    </p>
                    <p className="mt-2 text-xs tabular-nums text-[color:var(--muted)]">
                      {t('myWorks.list.updatedAt')} · {new Date(work.updatedAt).toLocaleString(locale, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={buildTypingPath(locale, {
                          workId: work.id,
                          workKind: 'my',
                        })}
                        className="inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        {t('myWorks.list.startTyping')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(work.id)}
                        disabled={deletingId === work.id}
                        className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deletingId === work.id ? t('myWorks.list.deleting') : t('myWorks.list.deleteAction')}
                      </button>
                    </div>
                  </article>
                ))
              : null}
          </section>
        </div>
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
  return (
    <div
      className={`rounded-xl border px-5 py-10 text-center text-sm ${
        tone === 'danger'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-[color:var(--line)] bg-[color:var(--surface-sunken)] text-[color:var(--muted)]'
      }`}
    >
      {children}
    </div>
  );
}
