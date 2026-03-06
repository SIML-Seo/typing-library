'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useCurrentLocale, useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_SETTINGS_RECORD_ID,
  getAppSettings,
  getMyWork,
  getTypingDraft,
  removeTypingDraft,
  saveAppSettings,
  saveTypingDraft,
  saveTypingResult,
  type AppSettingsRecord,
  type MyWorkRecord,
  type TypingDraftRecord,
  type TypingResultRecord,
  type WorkKind,
} from '@/shared/db';
import LocaleSwitcher from '@/shared/components/LocaleSwitcher';
import { useUiStore } from '@/shared/store';
import { useWorksCatalog } from '@/features/library/useWorksCatalog';
import { loadWorkParagraphs } from './load-work-paragraphs';
import {
  buildTypingResult,
  calculateOverallAccuracy,
  calculateOverallWpm,
  calculateTotalTypos,
  createTypingDraftId,
  formatElapsedTime,
  pickTypingSettingsSnapshot,
  type CompletedParagraphState,
} from './session';
import {
  countCorrectCharacters,
  countTypos,
  isCharacterMatch,
  splitParagraphs,
} from './text';

const AUTOSAVE_DEBOUNCE_MS = 600;

interface TypingPageProps {
  workId: string;
  workKind?: WorkKind;
}

type LoadStatus = 'loading' | 'ready' | 'not-found' | 'error';
type SessionState = 'pending' | 'prompt' | 'active' | 'completed';
type PersistStatus = 'idle' | 'saving' | 'saved' | 'error';
type ResultStatus = 'idle' | 'saving' | 'saved' | 'error';
type SettingsStatus = 'idle' | 'saving' | 'saved' | 'error';

function createDefaultSettingsRecord(): AppSettingsRecord {
  return {
    id: DEFAULT_SETTINGS_RECORD_ID,
    ...DEFAULT_APP_SETTINGS,
    updatedAt: new Date(0).toISOString(),
  };
}

export default function TypingPage({ workId, workKind = 'public' }: TypingPageProps) {
  const t = useI18n();
  const locale = useCurrentLocale();
  const { items, sourceMode, status, worksBaseUrl, errorMessage } = useWorksCatalog();
  const { isSettingsPanelOpen, setSettingsPanelOpen } = useUiStore();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null);
  const [selectedMyWork, setSelectedMyWork] = useState<MyWorkRecord | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [reports, setReports] = useState<CompletedParagraphState[]>([]);
  const [finalizedReports, setFinalizedReports] = useState<CompletedParagraphState[] | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>('pending');
  const [resumeDraft, setResumeDraft] = useState<TypingDraftRecord | null>(null);
  const [settingsSnapshot, setSettingsSnapshot] = useState<AppSettingsRecord>(
    createDefaultSettingsRecord,
  );
  const [storageNotice, setStorageNotice] = useState<string | null>(null);
  const [persistStatus, setPersistStatus] = useState<PersistStatus>('idle');
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<string | null>(null);
  const [resultStatus, setResultStatus] = useState<ResultStatus>('idle');
  const [settingsStatus, setSettingsStatus] = useState<SettingsStatus>('idle');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState<TypingResultRecord | null>(null);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const elapsedBaseMsRef = useRef(0);
  const activeStartedAtMsRef = useRef<number | null>(null);
  const currentParagraphStartedAtRef = useRef<string | null>(null);
  const currentParagraphMaxTyposRef = useRef(0);

  const selectedPublicWork = useMemo(
    () => items.find((item) => item.id === workId) ?? null,
    [items, workId],
  );
  const selectedWork = useMemo(
    () =>
      workKind === 'public'
        ? selectedPublicWork
        : selectedMyWork
          ? {
              id: selectedMyWork.id,
              title: selectedMyWork.title,
              author: selectedMyWork.author,
              source: t('myWorks.meta.localOnly'),
            }
          : null,
    [selectedMyWork, selectedPublicWork, t, workKind],
  );
  const draftId = useMemo(() => createTypingDraftId(workKind, workId), [workId, workKind]);
  const summaryReports = finalizedReports ?? reports;
  const currentParagraph = paragraphs[paragraphIndex] ?? '';
  const judgeOptions = useMemo(
    () => ({
      punctuationAndCaseStrict: settingsSnapshot.punctuationAndCaseStrict,
    }),
    [settingsSnapshot.punctuationAndCaseStrict],
  );
  const isDarkTheme = settingsSnapshot.theme === 'dark';
  const fontSizeClassName =
    settingsSnapshot.fontSize === 'sm'
      ? 'text-[15px] leading-7'
      : settingsSnapshot.fontSize === 'lg'
        ? 'text-[20px] leading-9'
        : 'text-[17px] leading-8';
  const currentTypoCount = countTypos(currentParagraph, inputValue, judgeOptions);
  const correctCharacters = countCorrectCharacters(currentParagraph, inputValue, judgeOptions);
  const currentAccuracy =
    inputValue.length > 0 ? Math.round((correctCharacters / inputValue.length) * 1000) / 10 : null;
  const canAdvance =
    sessionState === 'active' &&
    currentParagraph.length > 0 &&
    inputValue.length === currentParagraph.length;
  const isLastParagraph = paragraphs.length > 0 && paragraphIndex === paragraphs.length - 1;
  const libraryPath = getLocalizedPath(locale, '/library');
  const myWorksPath = getLocalizedPath(locale, '/my-works');
  const backPath = workKind === 'my' ? myWorksPath : libraryPath;
  const backLabel = workKind === 'my' ? t('myWorks.navLabel') : t('typing.backToLibrary');
  const resultsPath = getLocalizedPath(locale, '/results');
  const finalAccuracy =
    savedResult?.accuracy ??
    (summaryReports.length > 0 ? calculateOverallAccuracy(summaryReports) : null);
  const finalWpm =
    savedResult?.wpm ?? (summaryReports.length > 0 ? calculateOverallWpm(summaryReports, elapsedTimeMs) : null);
  const totalTypos = summaryReports.length > 0 ? calculateTotalTypos(summaryReports) : null;
  const themeStyles = useMemo(
    () =>
      ({
        '--page-bg': isDarkTheme ? '#0f0d0b' : 'var(--background)',
        '--header-bg': isDarkTheme ? 'rgba(18,14,11,0.92)' : 'rgba(244,239,230,0.88)',
        '--card-bg': isDarkTheme ? 'rgba(28,23,19,0.9)' : 'rgba(255,255,255,0.68)',
        '--card-bg-strong': isDarkTheme
          ? 'linear-gradient(180deg,rgba(28,23,19,0.96),rgba(21,17,14,0.96))'
          : 'linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,243,236,0.88))',
        '--card-bg-soft': isDarkTheme ? 'rgba(28,23,19,0.76)' : 'rgba(255,255,255,0.72)',
        '--card-bg-soft-strong': isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.62)',
        '--typing-ghost': isDarkTheme ? '#7f7064' : '#8f7c6f',
        '--typing-ok': isDarkTheme ? '#f4e9dd' : '#f8f0e8',
        '--typing-error': '#de6e64',
      }) as CSSProperties,
    [isDarkTheme],
  );

  const getElapsedNow = useCallback(() => {
    const activeStartedAt = activeStartedAtMsRef.current;

    if (activeStartedAt === null) {
      return elapsedBaseMsRef.current;
    }

    return elapsedBaseMsRef.current + (Date.now() - activeStartedAt);
  }, []);

  const resetTiming = useCallback((nextElapsedTimeMs: number) => {
    elapsedBaseMsRef.current = nextElapsedTimeMs;
    activeStartedAtMsRef.current = null;
    setElapsedTimeMs(nextElapsedTimeMs);
  }, []);

  const pauseTiming = useCallback(() => {
    const activeStartedAt = activeStartedAtMsRef.current;

    if (activeStartedAt === null) {
      return elapsedBaseMsRef.current;
    }

    const nextElapsedTimeMs = elapsedBaseMsRef.current + (Date.now() - activeStartedAt);
    elapsedBaseMsRef.current = nextElapsedTimeMs;
    activeStartedAtMsRef.current = null;
    setElapsedTimeMs(nextElapsedTimeMs);

    return nextElapsedTimeMs;
  }, []);

  const startTiming = useCallback(() => {
    if (activeStartedAtMsRef.current !== null) {
      return;
    }

    activeStartedAtMsRef.current = Date.now();
  }, []);

  const resetParagraphTracking = useCallback(
    (nextParagraphIndex: number, nextInputValue: string) => {
      const nextParagraph = paragraphs[nextParagraphIndex] ?? '';

      currentParagraphStartedAtRef.current =
        nextInputValue.length > 0 ? new Date().toISOString() : null;
      currentParagraphMaxTyposRef.current = countTypos(nextParagraph, nextInputValue);
    },
    [paragraphs],
  );

  const activateFreshSession = useCallback(() => {
    setParagraphIndex(0);
    setInputValue('');
    setReports([]);
    setFinalizedReports(null);
    setResumeDraft(null);
    setSavedResult(null);
    setResultStatus('idle');
    setPersistStatus('idle');
    setLastDraftSavedAt(null);
    resetTiming(0);
    resetParagraphTracking(0, '');
    setSessionState('active');
  }, [resetParagraphTracking, resetTiming]);

  const activateDraftSession = useCallback(
    (draft: TypingDraftRecord) => {
      setParagraphIndex(draft.paragraphIndex);
      setInputValue(draft.currentParagraphInput);
      setReports(draft.paragraphReportsSnapshot ?? []);
      setFinalizedReports(null);
      setResumeDraft(null);
      setSavedResult(null);
      setResultStatus('idle');
      setPersistStatus('saved');
      setLastDraftSavedAt(draft.updatedAt);
      resetTiming(draft.elapsedTimeMs);
      resetParagraphTracking(draft.paragraphIndex, draft.currentParagraphInput);
      setSessionState('active');
    },
    [resetParagraphTracking, resetTiming],
  );

  const buildDraftRecord = useCallback(
    (elapsedOverride?: number) => {
      if (!selectedWork) {
        return null;
      }

      const publicWork = workKind === 'public' ? selectedPublicWork : null;

      const elapsedSnapshot = elapsedOverride ?? getElapsedNow();

      return {
        id: draftId,
        workRef: {
          kind: workKind,
          id: selectedWork.id,
        },
        partId: publicWork?.parts?.[0]?.id,
        workChecksum: publicWork?.checksum,
        paragraphIndex,
        currentParagraphInput: inputValue,
        paragraphReportsSnapshot: summaryReports,
        elapsedTimeMs: elapsedSnapshot,
        settingsSnapshot: pickTypingSettingsSnapshot(settingsSnapshot),
        updatedAt: new Date().toISOString(),
      } satisfies TypingDraftRecord;
    },
    [
      draftId,
      getElapsedNow,
      inputValue,
      paragraphIndex,
      selectedPublicWork,
      selectedWork,
      settingsSnapshot,
      summaryReports,
      workKind,
    ],
  );

  const persistDraft = useCallback(
    async (elapsedOverride?: number) => {
      const draft = buildDraftRecord(elapsedOverride);

      if (!draft) {
        return;
      }

      setPersistStatus('saving');

      try {
        await saveTypingDraft(draft);
        setPersistStatus('saved');
        setLastDraftSavedAt(draft.updatedAt);
      } catch {
        setPersistStatus('error');
        setStorageNotice(t('typing.storage.unavailable'));
      }
    },
    [buildDraftRecord, t],
  );

  const finalizeSession = useCallback(
    async (nextReports: CompletedParagraphState[], finalElapsedTimeMs: number) => {
      if (!selectedWork) {
        return;
      }

      const nextResult = buildTypingResult({
        id: crypto.randomUUID(),
        workKind,
        workId: selectedWork.id,
        endedAt: new Date().toISOString(),
        elapsedTimeMs: finalElapsedTimeMs,
        settings: settingsSnapshot,
        paragraphs: nextReports,
      });

      setSavedResult(nextResult);
      setResultStatus('saving');

      try {
        await saveTypingResult(nextResult);
        await removeTypingDraft(draftId);
        setResultStatus('saved');
        setPersistStatus('idle');
        setLastDraftSavedAt(null);
      } catch {
        setResultStatus('error');
        setStorageNotice(t('typing.storage.resultSaveFailed'));
      }
    },
    [draftId, selectedWork, settingsSnapshot, t, workKind],
  );

  async function handleRetrySaveResult() {
    if (!savedResult) {
      return;
    }

    setResultStatus('saving');

    try {
      await saveTypingResult(savedResult);
      await removeTypingDraft(draftId);
      setResultStatus('saved');
      setPersistStatus('idle');
      setLastDraftSavedAt(null);
    } catch {
      setResultStatus('error');
      setStorageNotice(t('typing.storage.resultSaveFailed'));
    }
  }

  async function handleStartOver() {
    try {
      await removeTypingDraft(draftId);
    } catch {
      setStorageNotice(t('typing.storage.clearDraftFailed'));
    }

    activateFreshSession();
  }

  async function handleSettingsChange(
    patch: Partial<Omit<AppSettingsRecord, 'id' | 'updatedAt'>>,
  ) {
    const optimisticRecord: AppSettingsRecord = {
      ...settingsSnapshot,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    setSettingsSnapshot(optimisticRecord);
    setSettingsStatus('saving');
    setSettingsMessage(null);

    try {
      const savedSettings = await saveAppSettings(patch);
      setSettingsSnapshot(savedSettings);
      setSettingsStatus('saved');
      setSettingsMessage(t('typing.settings.saved'));
    } catch {
      setSettingsStatus('error');
      setSettingsMessage(t('typing.settings.saveError'));
    }
  }

  function handleContinueDraft() {
    if (!resumeDraft) {
      return;
    }

    activateDraftSession(resumeDraft);
  }

  useEffect(() => {
    if (workKind === 'public' && status === 'loading') {
      setLoadStatus('loading');
      return;
    }

    if (workKind === 'public' && status === 'error') {
      setLoadStatus('error');
      setLoadErrorMessage(errorMessage);
      return;
    }

    let isMounted = true;

    setLoadStatus('loading');
    setLoadErrorMessage(null);

    const handleReady = (nextParagraphs: string[]) => {
      if (!isMounted) {
        return;
      }

      setParagraphs(nextParagraphs);
      setParagraphIndex(0);
      setInputValue('');
      setReports([]);
      setFinalizedReports(null);
      setResumeDraft(null);
      setSavedResult(null);
      setResultStatus('idle');
      setPersistStatus('idle');
      setLastDraftSavedAt(null);
      setStorageNotice(null);
      resetTiming(0);
      setSessionState('pending');
      setLoadStatus('ready');
    };

    const handleError = (error: unknown) => {
      if (!isMounted) {
        return;
      }

      setLoadStatus('error');
      setLoadErrorMessage(error instanceof Error ? error.message : t('typing.statusError'));
    };

    if (workKind === 'my') {
      getMyWork(workId)
        .then((record) => {
          if (!record) {
            if (isMounted) {
              setLoadStatus('not-found');
            }
            return;
          }

          setSelectedMyWork(record);

          const nextParagraphs = splitParagraphs(record.content);

          if (nextParagraphs.length === 0) {
            throw new Error(t('typing.statusNotFound'));
          }

          handleReady(nextParagraphs);
        })
        .catch(handleError);
    } else {
      if (!selectedPublicWork) {
        setLoadStatus('not-found');
        return;
      }

      setSelectedMyWork(null);

      loadWorkParagraphs(selectedPublicWork, sourceMode, worksBaseUrl)
        .then(handleReady)
        .catch(handleError);
    }

    return () => {
      isMounted = false;
    };
  }, [
    errorMessage,
    resetTiming,
    selectedPublicWork,
    sourceMode,
    status,
    t,
    workId,
    workKind,
    worksBaseUrl,
  ]);

  useEffect(() => {
    if (loadStatus !== 'ready' || sessionState !== 'pending' || !selectedWork) {
      return;
    }

    let isMounted = true;
    const currentPublicWork = selectedPublicWork;

    async function prepareSession() {
      try {
        const storedSettings = await getAppSettings();

        if (isMounted) {
          setSettingsSnapshot(storedSettings);
        }
      } catch {
        if (isMounted) {
          setSettingsSnapshot(createDefaultSettingsRecord());
          setStorageNotice(t('typing.storage.unavailable'));
        }
      }

      try {
        const storedDraft = await getTypingDraft(draftId);

        if (!isMounted) {
          return;
        }

        if (
          storedDraft &&
          currentPublicWork?.checksum &&
          storedDraft.workChecksum &&
          storedDraft.workChecksum !== currentPublicWork.checksum
        ) {
          setStorageNotice(t('typing.resume.outdated'));
          setResumeDraft(null);
          activateFreshSession();
          return;
        }

        if (storedDraft) {
          setResumeDraft(storedDraft);
          setSessionState('prompt');
          return;
        }
      } catch {
        if (isMounted) {
          setStorageNotice(t('typing.storage.unavailable'));
        }
      }

      if (isMounted) {
        activateFreshSession();
      }
    }

    void prepareSession();

    return () => {
      isMounted = false;
    };
  }, [activateFreshSession, draftId, loadStatus, selectedPublicWork, selectedWork, sessionState, t]);

  useEffect(() => {
    if (loadStatus === 'ready' && sessionState === 'active') {
      textareaRef.current?.focus();
    }
  }, [loadStatus, paragraphIndex, sessionState]);

  useEffect(() => {
    if (sessionState !== 'active') {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (activeStartedAtMsRef.current === null) {
        return;
      }

      setElapsedTimeMs(getElapsedNow());
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getElapsedNow, sessionState]);

  useEffect(() => {
    if (sessionState !== 'active') {
      return;
    }

    currentParagraphMaxTyposRef.current = Math.max(currentParagraphMaxTyposRef.current, currentTypoCount);
  }, [currentTypoCount, sessionState]);

  useEffect(() => {
    if (loadStatus !== 'ready' || sessionState !== 'active') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void persistDraft();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    inputValue,
    loadStatus,
    paragraphIndex,
    persistDraft,
    reports,
    sessionState,
    settingsSnapshot,
    summaryReports,
  ]);

  useEffect(() => {
    if (loadStatus !== 'ready' || sessionState !== 'active') {
      return;
    }

    const flushDraft = () => {
      const elapsedSnapshot = pauseTiming();
      void persistDraft(elapsedSnapshot);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushDraft();
      }
    };

    window.addEventListener('pagehide', flushDraft);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', flushDraft);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadStatus, pauseTiming, persistDraft, sessionState]);

  function handleBeforeInput(event: FormEvent<HTMLTextAreaElement>) {
    const nativeEvent = event.nativeEvent as InputEvent;

    if (nativeEvent.isComposing) {
      return;
    }

    if (
      nativeEvent.inputType === 'insertFromPaste' ||
      nativeEvent.inputType === 'insertFromDrop' ||
      (typeof nativeEvent.data === 'string' && nativeEvent.data.length > 1)
    ) {
      event.preventDefault();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (sessionState !== 'active') {
      return;
    }

    const nextValue = event.target.value;

    if (nextValue.length > inputValue.length && currentParagraphStartedAtRef.current === null) {
      currentParagraphStartedAtRef.current = new Date().toISOString();
    }

    startTiming();
    setInputValue(nextValue);
  }

  function handleAdvance() {
    if (!canAdvance) {
      return;
    }

    const endedAt = new Date().toISOString();
    const completedParagraph: CompletedParagraphState = {
      paragraphIndex,
      typoCount: currentTypoCount,
      correctedTypoCount: Math.max(currentParagraphMaxTyposRef.current - currentTypoCount, 0),
      typedLength: inputValue.length,
      correctCharacterCount: correctCharacters,
      startedAt: currentParagraphStartedAtRef.current ?? endedAt,
      endedAt,
    };
    const nextReports = [...reports, completedParagraph];
    const finalElapsedTimeMs = pauseTiming();

    setReports(nextReports);
    setPersistStatus('idle');

    if (isLastParagraph) {
      setFinalizedReports(nextReports);
      setSessionState('completed');
      void finalizeSession(nextReports, finalElapsedTimeMs);
      return;
    }

    const nextParagraphIndex = paragraphIndex + 1;
    setParagraphIndex(nextParagraphIndex);
    setInputValue('');
    resetParagraphTracking(nextParagraphIndex, '');
  }

  function renderOverlay(reference: string, typed: string) {
    if (typed.length === 0) {
      return <span className="text-[color:#8f7c6f]">{t('typing.emptyInput')}</span>;
    }

    const nodes: ReactNode[] = [];

    for (let index = 0; index < typed.length; index += 1) {
      const character = typed[index];
      const expected = reference[index];
      const isCorrect = isCharacterMatch(expected, character, judgeOptions);
      const key = `${index}-${character}`;

      if (character === '\n') {
        nodes.push(<br key={key} />);
        continue;
      }

      nodes.push(
        <span
          key={key}
          className={
            isCorrect
              ? 'text-[color:var(--typing-ok)]'
              : settingsSnapshot.typoDisplayMode === 'underline-red'
                ? 'text-[color:var(--typing-ok)] underline decoration-[color:var(--typing-error)] decoration-2 underline-offset-[0.18em]'
                : 'text-[color:var(--typing-error)]'
          }
        >
          {character === ' ' ? '\u00A0' : character}
        </span>,
      );
    }

    return nodes;
  }

  const autosaveLabel =
    sessionState === 'completed'
      ? resultStatus === 'saved'
        ? t('typing.panel.resultSaved')
        : resultStatus === 'error'
          ? t('typing.panel.resultError')
          : t('typing.panel.resultSaving')
      : persistStatus === 'error'
        ? t('typing.panel.autosaveError')
        : lastDraftSavedAt
          ? t('typing.panel.autosaveSaved', {
              time: new Date(lastDraftSavedAt).toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit',
              }),
            })
          : t('typing.panel.autosaveIdle');

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)]" style={themeStyles}>
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:var(--header-bg)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
              {selectedWork?.title ?? workId}
            </p>
            <h1 className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
              {t('typing.title')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              {t('typing.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <button
              type="button"
              onClick={() => setSettingsPanelOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('typing.settings.open')}
            </button>
            <Link
              href={resultsPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {t('results.navLabel')}
            </Link>
            <Link
              href={backPath}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:px-10 lg:py-14">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-5">
            <MetricCard
              label={t('typing.stats.paragraph')}
              value={paragraphs.length > 0 ? `${Math.min(paragraphIndex + 1, paragraphs.length)}/${paragraphs.length}` : '—'}
            />
            <MetricCard
              label={t('typing.stats.accuracy')}
              value={currentAccuracy === null ? '—' : `${currentAccuracy}%`}
            />
            <MetricCard
              label={t('typing.stats.elapsed')}
              value={formatElapsedTime(elapsedTimeMs)}
            />
            <MetricCard
              label={t('typing.stats.typed')}
              value={`${inputValue.length}`}
            />
            <MetricCard
              label={t('typing.stats.typos')}
              value={`${currentTypoCount}`}
            />
          </div>

          <section className="rounded-[2rem] border border-[color:var(--line)] bg-[image:var(--card-bg-strong)] p-6 shadow-[0_24px_90px_rgba(60,34,24,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[color:var(--line)] pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {workKind === 'my'
                    ? t('typing.sourceModeMy')
                    : sourceMode === 'works-origin'
                      ? t('typing.sourceModeWorks')
                      : t('typing.sourceModePreview')}
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  {t('typing.focusHint')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => textareaRef.current?.focus()}
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                {t('typing.startTyping')}
              </button>
            </div>

            {loadStatus === 'loading' ? (
              <StatusPanel tone="neutral">{t('typing.statusLoading')}</StatusPanel>
            ) : null}

            {loadStatus === 'not-found' ? (
              <StatusPanel tone="danger">{t('typing.statusNotFound')}</StatusPanel>
            ) : null}

            {loadStatus === 'error' ? (
              <StatusPanel tone="danger">{loadErrorMessage ?? t('typing.statusError')}</StatusPanel>
            ) : null}

            {loadStatus === 'ready' && sessionState === 'pending' ? (
              <StatusPanel tone="neutral">{t('typing.statusPreparingSession')}</StatusPanel>
            ) : null}

            {loadStatus === 'ready' && sessionState === 'prompt' && resumeDraft ? (
              <div className="mt-6 rounded-[1.75rem] border border-[color:var(--line)] bg-[color:#181310] p-6 text-[color:#efe3d7] shadow-[0_24px_80px_rgba(37,20,13,0.22)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[color:#a99182]">
                  {t('typing.resume.title')}
                </p>
                <p className="mt-4 text-base leading-8 text-[color:#efe3d7]">
                  {t('typing.resume.body')}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleContinueDraft}
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
                  >
                    {t('typing.resume.continueAction')}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleStartOver()}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-sm font-semibold text-[color:#efe3d7] transition hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.08)]"
                  >
                    {t('typing.resume.restartAction')}
                  </button>
                </div>
              </div>
            ) : null}

            {loadStatus === 'ready' && (sessionState === 'active' || sessionState === 'completed') ? (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => textareaRef.current?.focus()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      textareaRef.current?.focus();
                    }
                  }}
                  className="mt-6 relative cursor-text overflow-hidden rounded-[1.75rem] bg-[color:#181310] px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none ring-1 ring-[rgba(255,255,255,0.04)] transition focus:ring-[rgba(161,68,49,0.35)]"
                >
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onBeforeInput={handleBeforeInput}
                    onChange={handleInputChange}
                    onPaste={(event) => event.preventDefault()}
                    onDrop={(event) => event.preventDefault()}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    readOnly={sessionState !== 'active'}
                    className="absolute inset-0 h-full w-full resize-none opacity-0"
                    aria-label={t('typing.startTyping')}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[color:#8f7c6f]">
                      {t('typing.stats.paragraph')} {paragraphIndex + 1}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[color:#8f7c6f]">
                      {sessionState === 'completed'
                        ? t('typing.actions.completed')
                        : t('typing.clickToFocus')}
                    </p>
                  </div>

                  <div className="mt-6 relative min-h-72">
                    <pre className={`pointer-events-none whitespace-pre-wrap ${fontSizeClassName} text-[color:var(--typing-ghost)]`}>
                      {currentParagraph}
                    </pre>
                    <pre className={`pointer-events-none absolute inset-0 whitespace-pre-wrap ${fontSizeClassName}`}>
                      {renderOverlay(currentParagraph, inputValue)}
                    </pre>
                  </div>
                </div>

                {sessionState === 'active' ? (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAdvance}
                      disabled={!canAdvance}
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-[rgba(161,68,49,0.35)] hover:enabled:bg-[color:var(--accent-strong)]"
                    >
                      {isLastParagraph
                        ? t('typing.actions.finishSession')
                        : t('typing.actions.nextParagraph')}
                    </button>
                  </div>
                ) : null}

                {sessionState === 'completed' ? (
                  <div className="mt-6 rounded-[1.5rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.72)] p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
                      {t('typing.panel.resultTitle')}
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <ResultMetric
                        label={t('typing.stats.accuracy')}
                        value={finalAccuracy === null ? '—' : `${finalAccuracy}%`}
                      />
                      <ResultMetric
                        label={t('typing.stats.wpm')}
                        value={finalWpm === null ? '—' : `${finalWpm}`}
                      />
                      <ResultMetric
                        label={t('typing.stats.elapsed')}
                        value={formatElapsedTime(elapsedTimeMs)}
                      />
                      <ResultMetric
                        label={t('typing.stats.typos')}
                        value={totalTypos === null ? '—' : `${totalTypos}`}
                      />
                    </div>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-7 text-[color:var(--muted)]">
                        {resultStatus === 'saved'
                          ? t('typing.panel.resultSaved')
                          : resultStatus === 'error'
                            ? t('typing.panel.resultError')
                            : t('typing.panel.resultSaving')}
                      </p>
                      {resultStatus === 'error' ? (
                        <button
                          type="button"
                          onClick={() => void handleRetrySaveResult()}
                          className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                        >
                          {t('typing.actions.retrySave')}
                        </button>
                      ) : null}
                      {resultStatus === 'saved' ? (
                        <Link
                          href={resultsPath}
                          className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                        >
                          {t('results.navLabel')}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </section>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[color:var(--line)] bg-[color:#181310] p-6 text-[color:#efe3d7] shadow-[0_28px_90px_rgba(37,20,13,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[color:#a99182]">
              {t('typing.panel.title')}
            </p>
            <h2 className="mt-4 text-3xl [font-family:var(--font-display)] leading-tight">
              {selectedWork?.title ?? workId}
            </h2>
            <p className="mt-3 text-sm text-[color:#d7c7ba]">
              {selectedWork?.author ?? t('library.catalog.authorFallback')}
            </p>

            <div className="mt-6 space-y-3 text-sm leading-7 text-[color:#c9b8ab]">
              <InfoRow
                label={t('typing.panel.source')}
                value={selectedWork?.source ?? t('typing.panel.sourceFallback')}
              />
              <InfoRow
                label={t('typing.panel.paragraphs')}
                value={paragraphs.length > 0 ? `${paragraphs.length}` : '—'}
              />
              <InfoRow
                label={t('typing.panel.currentMode')}
                value={
                  workKind === 'my'
                    ? t('typing.sourceModeMy')
                    : sourceMode === 'works-origin'
                    ? t('typing.sourceModeWorks')
                    : t('typing.sourceModePreview')
                }
              />
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[color:#d7c7ba]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:#a99182]">
                {t('typing.panel.autosaveTitle')}
              </p>
              <p className="mt-3">{autosaveLabel}</p>
            </div>

            {storageNotice ? (
              <div className="mt-4 rounded-[1.4rem] border border-[rgba(222,110,100,0.25)] bg-[rgba(222,110,100,0.08)] p-4 text-sm leading-7 text-[color:#f0d5cf]">
                {storageNotice}
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {t('typing.rules.title')}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>
                {settingsSnapshot.punctuationAndCaseStrict
                  ? t('typing.rules.item1Strict')
                  : t('typing.rules.item1Relaxed')}
              </li>
              <li>{t('typing.rules.item2')}</li>
              <li>{t('typing.rules.item3')}</li>
              <li>{t('typing.rules.item4')}</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              {t('typing.panel.summaryTitle')}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              {t('typing.panel.summaryBody')}
            </p>
            <div className="mt-4 rounded-[1.1rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-sm text-[color:var(--foreground)]">
              {t('typing.stats.done')}: {summaryReports.length}
            </div>
            <div className="mt-4 space-y-2 text-sm text-[color:var(--foreground)]">
              {summaryReports.length === 0 ? (
                <p className="text-[color:var(--muted)]">{t('typing.panel.summaryEmpty')}</p>
              ) : (
                summaryReports.map((report) => (
                  <div
                    key={`${report.paragraphIndex}-${report.endedAt}`}
                    className="rounded-[1rem] border border-[color:var(--line)] bg-[rgba(255,255,255,0.74)] px-4 py-3"
                  >
                    {t('typing.panel.reportItem', {
                      index: report.paragraphIndex + 1,
                      count: report.typoCount,
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>

      {isSettingsPanelOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(9,7,6,0.48)] backdrop-blur-sm">
          <button
            type="button"
            aria-label={t('typing.settings.close')}
            className="flex-1 cursor-default"
            onClick={() => setSettingsPanelOpen(false)}
          />
          <aside className="w-full max-w-md border-l border-[color:var(--line)] bg-[color:var(--page-bg)] p-6 shadow-[-24px_0_70px_rgba(11,8,6,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
                  {t('typing.settings.title')}
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {t('typing.settings.description')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsPanelOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {t('typing.settings.close')}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <SettingsSection
                title={t('typing.settings.sections.display')}
                description={t('typing.settings.displayDescription')}
              >
                <SettingGroup label={t('typing.settings.fontSizeLabel')}>
                  <OptionChip
                    active={settingsSnapshot.fontSize === 'sm'}
                    onClick={() => void handleSettingsChange({ fontSize: 'sm' })}
                    label={t('typing.settings.fontSizeSm')}
                  />
                  <OptionChip
                    active={settingsSnapshot.fontSize === 'md'}
                    onClick={() => void handleSettingsChange({ fontSize: 'md' })}
                    label={t('typing.settings.fontSizeMd')}
                  />
                  <OptionChip
                    active={settingsSnapshot.fontSize === 'lg'}
                    onClick={() => void handleSettingsChange({ fontSize: 'lg' })}
                    label={t('typing.settings.fontSizeLg')}
                  />
                </SettingGroup>

                <SettingGroup label={t('typing.settings.themeLabel')}>
                  <OptionChip
                    active={settingsSnapshot.theme === 'paper'}
                    onClick={() => void handleSettingsChange({ theme: 'paper' })}
                    label={t('typing.settings.themePaper')}
                  />
                  <OptionChip
                    active={settingsSnapshot.theme === 'dark'}
                    onClick={() => void handleSettingsChange({ theme: 'dark' })}
                    label={t('typing.settings.themeDark')}
                  />
                </SettingGroup>
              </SettingsSection>

              <SettingsSection
                title={t('typing.settings.sections.judgement')}
                description={t('typing.settings.judgementDescription')}
              >
                <SettingRow
                  title={t('typing.settings.punctuationCaseLabel')}
                  body={
                    settingsSnapshot.punctuationAndCaseStrict
                      ? t('typing.settings.punctuationCaseOn')
                      : t('typing.settings.punctuationCaseOff')
                  }
                  action={
                    <button
                      type="button"
                      onClick={() =>
                        void handleSettingsChange({
                          punctuationAndCaseStrict: !settingsSnapshot.punctuationAndCaseStrict,
                        })
                      }
                      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                        settingsSnapshot.punctuationAndCaseStrict
                          ? 'bg-[color:var(--accent)] text-white'
                          : 'border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] text-[color:var(--foreground)]'
                      }`}
                    >
                      {settingsSnapshot.punctuationAndCaseStrict
                        ? t('typing.settings.toggleOn')
                        : t('typing.settings.toggleOff')}
                    </button>
                  }
                />
              </SettingsSection>

              <SettingsSection
                title={t('typing.settings.sections.feedback')}
                description={t('typing.settings.feedbackDescription')}
              >
                <SettingGroup label={t('typing.settings.typoDisplayLabel')}>
                  <OptionChip
                    active={settingsSnapshot.typoDisplayMode === 'inline-red'}
                    onClick={() =>
                      void handleSettingsChange({ typoDisplayMode: 'inline-red' })
                    }
                    label={t('typing.settings.typoDisplayInline')}
                  />
                  <OptionChip
                    active={settingsSnapshot.typoDisplayMode === 'underline-red'}
                    onClick={() =>
                      void handleSettingsChange({ typoDisplayMode: 'underline-red' })
                    }
                    label={t('typing.settings.typoDisplayUnderline')}
                  />
                </SettingGroup>
              </SettingsSection>
            </div>

            <div className="mt-8 rounded-[1.4rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-4 text-sm leading-7 text-[color:var(--muted)]">
              {settingsStatus === 'saving'
                ? t('typing.settings.saving')
                : settingsMessage ?? t('typing.settings.idle')}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function StatusPanel({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'neutral' | 'danger';
}) {
  const toneClassName =
    tone === 'danger'
      ? 'border-[rgba(161,68,49,0.22)] bg-[rgba(161,68,49,0.08)] text-[color:var(--foreground)]'
      : 'border-[color:var(--line)] bg-[color:var(--card-bg-soft)] text-[color:var(--muted)]';

  return (
    <div
      className={`mt-6 rounded-[1.6rem] border px-5 py-10 text-center text-sm ${toneClassName}`}
    >
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--card-bg)] p-5 shadow-[0_14px_40px_rgba(53,31,22,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
        {value}
      </p>
    </article>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
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

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.6rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function SettingGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SettingRow({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-[color:var(--card-bg-soft-strong)] p-4">
      <div>
        <p className="text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
        <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{body}</p>
      </div>
      {action}
    </div>
  );
}

function OptionChip({
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
          : 'border-[color:var(--line)] bg-[color:var(--card-bg-soft)] text-[color:var(--foreground)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]'
      }`}
    >
      {label}
    </button>
  );
}
