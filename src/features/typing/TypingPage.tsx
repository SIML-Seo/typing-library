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
import { useAppLocale } from '@/components/I18nClientProvider';
import { useI18n } from '@/locales/client';
import { getLocalizedPath } from '@/locales/config';
import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_VISUAL_FILTERS,
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
import {
  buildCommonAnalyticsParams,
  buildParagraphCompleteEventParams,
  buildTypingCompleteEventParams,
  trackGa4Event,
  type Ga4CommonContext,
} from '@/shared/analytics/ga4';
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
import { buildTypingMismatchSegments, formatVisibleText } from './paragraph-report';
import { useTypingSound, shouldPlayTypingSound } from './sound';
import { buildVisualFilterValue, hasActiveVisualFilter } from './visual-filters';

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

interface PendingParagraphReportState {
  paragraph: CompletedParagraphState;
  nextReports: CompletedParagraphState[];
  elapsedTimeMs: number;
  isLastParagraph: boolean;
}

function createDefaultSettingsRecord(): AppSettingsRecord {
  return {
    id: DEFAULT_SETTINGS_RECORD_ID,
    ...DEFAULT_APP_SETTINGS,
    updatedAt: new Date(0).toISOString(),
  };
}

export default function TypingPage({ workId, workKind = 'public' }: TypingPageProps) {
  const t = useI18n();
  const locale = useAppLocale();
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
  const [typingSessionId, setTypingSessionId] = useState('');
  const [hasSentTypingStart, setHasSentTypingStart] = useState(false);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [pendingParagraphReport, setPendingParagraphReport] =
    useState<PendingParagraphReportState | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const elapsedBaseMsRef = useRef(0);
  const activeStartedAtMsRef = useRef<number | null>(null);
  const currentParagraphStartedAtRef = useRef<string | null>(null);
  const currentParagraphMaxTyposRef = useRef(0);
  const { playTypingSound } = useTypingSound();

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
  const analyticsContext = useMemo<Ga4CommonContext>(
    () => ({
      workKind,
      typingSessionId: typingSessionId || undefined,
      publicWorkId: workKind === 'public' ? selectedPublicWork?.id : undefined,
      workLanguage: workKind === 'public' ? selectedPublicWork?.language : undefined,
      punctuationCaseOn: settingsSnapshot.punctuationAndCaseStrict,
    }),
    [
      selectedPublicWork?.id,
      selectedPublicWork?.language,
      settingsSnapshot.punctuationAndCaseStrict,
      typingSessionId,
      workKind,
    ],
  );
  const analyticsParams = useMemo(
    () => buildCommonAnalyticsParams(analyticsContext),
    [analyticsContext],
  );
  const themeStyles = useMemo(
    () =>
      ({
        '--page-bg': isDarkTheme ? '#0f0d0b' : 'var(--background)',
        '--header-bg': isDarkTheme ? 'rgba(15,13,11,0.92)' : 'rgba(250,249,247,0.92)',
        '--card-bg': isDarkTheme ? 'rgba(28,23,19,0.9)' : '#ffffff',
        '--card-bg-strong': isDarkTheme
          ? 'linear-gradient(180deg,rgba(28,23,19,0.96),rgba(21,17,14,0.96))'
          : 'none',
        '--card-bg-soft': isDarkTheme ? 'rgba(28,23,19,0.76)' : '#ffffff',
        '--card-bg-soft-strong': isDarkTheme ? 'rgba(255,255,255,0.04)' : 'var(--surface-sunken)',
        '--typing-ghost': isDarkTheme ? '#57534e' : '#a1a1aa',
        '--typing-ok': isDarkTheme ? '#fafaf9' : '#1a1a1a',
        '--typing-error': '#ef4444',
      }) as CSSProperties,
    [isDarkTheme],
  );
  const visualFilterValue = useMemo(
    () => buildVisualFilterValue(settingsSnapshot.visualFilters),
    [settingsSnapshot.visualFilters],
  );
  const hasVisualFilter = useMemo(
    () => hasActiveVisualFilter(settingsSnapshot.visualFilters),
    [settingsSnapshot.visualFilters],
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
    setTypingSessionId(crypto.randomUUID());
    setHasSentTypingStart(false);
    resetTiming(0);
    resetParagraphTracking(0, '');
    setSessionState('active');
  }, [resetParagraphTracking, resetTiming]);

  const activateDraftSession = useCallback(
    (draft: TypingDraftRecord) => {
      setParagraphIndex(draft.paragraphIndex);
      setInputValue(draft.currentParagraphInput);
      setReports(
        (draft.paragraphReportsSnapshot ?? []).map((report) => ({
          ...report,
          mismatchSegments: report.mismatchSegments ?? [],
        })),
      );
      setFinalizedReports(null);
      setResumeDraft(null);
      setSavedResult(null);
      setResultStatus('idle');
      setPersistStatus('saved');
      setLastDraftSavedAt(draft.updatedAt);
      setTypingSessionId(draft.typingSessionId ?? crypto.randomUUID());
      setHasSentTypingStart(draft.hasSentTypingStart ?? false);
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
        typingSessionId,
        hasSentTypingStart,
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
      typingSessionId,
      hasSentTypingStart,
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

      trackGa4Event(
        'typing_complete',
        buildTypingCompleteEventParams(analyticsContext, {
          elapsedTimeMs: finalElapsedTimeMs,
          wpm: nextResult.wpm,
          accuracyPercent: nextResult.accuracy,
        }),
      );

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
    [analyticsContext, draftId, selectedWork, settingsSnapshot, t, workKind],
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

  function handleConfirmParagraphReport() {
    if (!pendingParagraphReport) {
      return;
    }

    const { elapsedTimeMs: completedElapsedTimeMs, isLastParagraph, nextReports } =
      pendingParagraphReport;

    setPendingParagraphReport(null);
    setReports(nextReports);
    setPersistStatus('idle');

    if (isLastParagraph) {
      setFinalizedReports(nextReports);
      setSessionState('completed');
      void finalizeSession(nextReports, completedElapsedTimeMs);
      return;
    }

    const nextParagraphIndex = paragraphIndex + 1;
    setParagraphIndex(nextParagraphIndex);
    setInputValue('');
    resetParagraphTracking(nextParagraphIndex, '');
  }

  async function handleSettingsChange(
    patch: Parameters<typeof saveAppSettings>[0],
  ) {
    const optimisticRecord: AppSettingsRecord = {
      ...settingsSnapshot,
      ...patch,
      visualFilters: {
        ...settingsSnapshot.visualFilters,
        ...patch.visualFilters,
      },
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
    if (sessionState !== 'active' || pendingParagraphReport) {
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
  }, [getElapsedNow, pendingParagraphReport, sessionState]);

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
  }, [loadStatus, pauseTiming, pendingParagraphReport, persistDraft, sessionState]);

  function handleBeforeInput(event: FormEvent<HTMLTextAreaElement>) {
    const nativeEvent = event.nativeEvent as InputEvent;

    if (nativeEvent.isComposing) {
      return;
    }

    if (
      nativeEvent.inputType === 'insertFromPaste' ||
      nativeEvent.inputType === 'insertFromDrop'
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

    if (!hasSentTypingStart && nextValue.length > 0) {
      trackGa4Event('typing_start', analyticsParams);
      setHasSentTypingStart(true);
    }

    if (
      shouldPlayTypingSound(
        settingsSnapshot.soundProfile,
        inputValue.length,
        nextValue.length,
      )
    ) {
      playTypingSound(settingsSnapshot.soundProfile, settingsSnapshot.soundVolume);
    }

    startTiming();
    setInputValue(nextValue);
  }

  function handleAdvance() {
    if (!canAdvance || pendingParagraphReport) {
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
      mismatchSegments: buildTypingMismatchSegments(currentParagraph, inputValue, judgeOptions),
    };
    const nextReports = [...reports, completedParagraph];
    const finalElapsedTimeMs = pauseTiming();

    trackGa4Event(
      'typing_paragraph_complete',
      buildParagraphCompleteEventParams(analyticsContext, {
        paragraphIndex: paragraphIndex + 1,
        mistakeCount: currentTypoCount,
        elapsedTimeMs: finalElapsedTimeMs,
      }),
    );

    setPendingParagraphReport({
      paragraph: completedParagraph,
      nextReports,
      elapsedTimeMs: finalElapsedTimeMs,
      isLastParagraph,
    });
  }

  function renderOverlay(reference: string, typed: string) {
    if (typed.length === 0) {
      return null;
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
  const modeLabel =
    workKind === 'my'
      ? t('typing.sourceModeMy')
      : sourceMode === 'works-origin'
        ? t('typing.sourceModeWorks')
        : t('typing.sourceModePreview');
  const paragraphProgressLabel =
    paragraphs.length > 0
      ? `${Math.min(paragraphIndex + 1, paragraphs.length)}/${paragraphs.length}`
      : '—';
  const focusChips = [
    [t('typing.stats.paragraph'), paragraphProgressLabel].join(' '),
    currentAccuracy === null
      ? [t('typing.stats.accuracy'), '—'].join(' ')
      : [t('typing.stats.accuracy'), `${currentAccuracy}%`].join(' '),
    [t('typing.stats.elapsed'), formatElapsedTime(elapsedTimeMs)].join(' '),
    [t('typing.stats.typos'), `${currentTypoCount}`].join(' '),
  ];
  const compactRules = [
    settingsSnapshot.punctuationAndCaseStrict
      ? t('typing.rules.item1Strict')
      : t('typing.rules.item1Relaxed'),
    t('typing.rules.item2'),
    t('typing.rules.item3'),
  ];
  const resultStatusMessage =
    resultStatus === 'saved'
      ? t('typing.panel.resultSaved')
      : resultStatus === 'error'
        ? t('typing.panel.resultError')
        : t('typing.panel.resultSaving');

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)]" style={themeStyles}>
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[color:var(--header-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="truncate font-medium text-[color:var(--foreground)]">
                {selectedWork?.title ?? workId}
              </span>
              <span className="text-[color:var(--muted)]">·</span>
              <span className="truncate text-[color:var(--muted)]">
                {selectedWork?.author ?? t('library.catalog.authorFallback')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSettingsPanelOpen(true)}
              className="rounded-lg p-2 text-[color:var(--muted)] transition hover:bg-[color:var(--card-bg-soft-strong)] hover:text-[color:var(--foreground)]"
              aria-label={t('typing.settings.open')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            <Link
              href={resultsPath}
              className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
            >
              {t('results.navLabel')}
            </Link>
            <Link
              href={backPath}
              className="rounded-lg px-3 py-1.5 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
            >
              {backLabel}
            </Link>
          </div>
        </div>
      </header>

      {hasVisualFilter ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-20"
          style={{
            backdropFilter: visualFilterValue,
            WebkitBackdropFilter: visualFilterValue,
          }}
        />
      ) : null}

      <main className="mx-auto max-w-4xl px-5 py-6 lg:py-10">
        <section className="space-y-4">
          {/* Stats bar */}
          <div className="flex items-center gap-4 text-sm tabular-nums text-[color:var(--muted)]">
            {focusChips.map((chip, index) => (
              <span key={chip} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-[color:var(--line)]">|</span>}
                {chip}
              </span>
            ))}
          </div>

          {/* Main typing card */}
          <section className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--card-bg-soft)]">
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
              <StatusPanelCard>
                <p className="text-sm font-medium text-[color:var(--accent)]">
                  {t('typing.resume.title')}
                </p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {t('typing.resume.body')}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <PrimaryActionButton onClick={handleContinueDraft}>
                    {t('typing.resume.continueAction')}
                  </PrimaryActionButton>
                  <SecondaryActionButton onClick={() => void handleStartOver()}>
                    {t('typing.resume.restartAction')}
                  </SecondaryActionButton>
                </div>
              </StatusPanelCard>
            ) : null}

            {loadStatus === 'ready' && (sessionState === 'active' || sessionState === 'completed') ? (
              <>
                {/* Toolbar inside card */}
                <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] px-5 py-3">
                  <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
                    <span>{modeLabel}</span>
                    <span>·</span>
                    <span>{autosaveLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sessionState === 'active' ? (
                      <PrimaryActionButton
                        onClick={handleAdvance}
                        disabled={!canAdvance}
                      >
                        {t('typing.actions.reviewParagraph')}
                      </PrimaryActionButton>
                    ) : null}
                  </div>
                </div>

                {/* Typing area */}
                <div
                  onClick={() => textareaRef.current?.focus()}
                  className="relative cursor-text bg-[#1c1917] px-6 py-8 sm:px-8 sm:py-10"
                >
                  <p className="mb-6 text-xs text-[#78716c]">
                    {sessionState === 'completed'
                      ? t('typing.actions.completed')
                      : t('typing.clickToFocus')}
                  </p>

                  <div className="relative min-h-[20rem] sm:min-h-[26rem]">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onBeforeInput={handleBeforeInput}
                      onChange={handleInputChange}
                      onPaste={(event) => event.preventDefault()}
                      onDrop={(event) => event.preventDefault()}
                      onKeyDownCapture={(event) => event.stopPropagation()}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      readOnly={sessionState !== 'active' || pendingParagraphReport !== null}
                      aria-label={t('typing.startTyping')}
                      className={`absolute inset-0 z-10 h-full w-full resize-none overflow-hidden border-0 bg-transparent p-0 opacity-0 ${fontSizeClassName} outline-none`}
                    />
                    <pre className={`pointer-events-none whitespace-pre-wrap break-words ${fontSizeClassName} text-[color:var(--typing-ghost)]`}>
                      {currentParagraph}
                    </pre>
                    <pre className={`pointer-events-none absolute inset-0 whitespace-pre-wrap break-words ${fontSizeClassName}`}>
                      {renderOverlay(currentParagraph, inputValue)}
                    </pre>
                  </div>
                </div>

                {/* Rules */}
                <div className="flex items-center gap-3 border-t border-[color:var(--line)] px-5 py-3 text-xs text-[color:var(--muted)]">
                  {compactRules.map((rule, index) => (
                    <span key={rule} className="flex items-center gap-2">
                      {index > 0 && <span className="text-[color:var(--line)]">·</span>}
                      {rule}
                    </span>
                  ))}
                </div>

                {storageNotice ? (
                  <div className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
                    {storageNotice}
                  </div>
                ) : null}

                {sessionState === 'completed' ? (
                  <section className="border-t border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--accent)]">
                          {t('typing.panel.resultTitle')}
                        </p>
                        <p className="mt-1 text-sm text-[color:var(--muted)]">
                          {resultStatusMessage}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {resultStatus === 'error' ? (
                          <SecondaryActionButton onClick={() => void handleRetrySaveResult()}>
                            {t('typing.actions.retrySave')}
                          </SecondaryActionButton>
                        ) : null}
                        {resultStatus === 'saved' ? (
                          <SecondaryActionButton asLink href={resultsPath}>
                            {t('results.navLabel')}
                          </SecondaryActionButton>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

                    <div className="mt-4 border-t border-[color:var(--line)] pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-medium text-[color:var(--muted)]">
                          {t('typing.panel.summaryTitle')}
                        </p>
                        <p className="text-xs text-[color:var(--muted)]">
                          {t('typing.stats.done')}: {summaryReports.length}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {summaryReports.length === 0 ? (
                          <p className="text-sm text-[color:var(--muted)]">
                            {t('typing.panel.summaryEmpty')}
                          </p>
                        ) : (
                          summaryReports.map((report) => (
                            <InfoChip key={`${report.paragraphIndex}-${report.endedAt}`}>
                              {t('typing.panel.reportItem', {
                                index: report.paragraphIndex + 1,
                                count: report.typoCount,
                              })}
                            </InfoChip>
                          ))
                        )}
                      </div>
                    </div>
                  </section>
                ) : null}
              </>
            ) : null}
          </section>
        </section>
      </main>

      {pendingParagraphReport ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6 pt-20 backdrop-blur-sm">
          <section className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--page-bg)] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] p-6">
              <div>
                <p className="text-sm font-medium text-[color:var(--accent)]">
                  {t('typing.report.title')}
                </p>
                <h2 className="mt-2 text-2xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                  {t('typing.stats.paragraph')} {pendingParagraphReport.paragraph.paragraphIndex + 1}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--muted)]">
                  {t('typing.report.subtitle')}
                </p>
              </div>

              <div className="rounded-xl bg-[color:var(--card-bg-soft-strong)] px-4 py-3 text-right">
                <p className="text-xs text-[color:var(--muted)]">
                  {t('typing.report.typoCount')}
                </p>
                <p className="mt-1 text-2xl font-light tabular-nums text-[color:var(--foreground)]">
                  {pendingParagraphReport.paragraph.typoCount}
                </p>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-6">
              {pendingParagraphReport.paragraph.mismatchSegments.length === 0 ? (
                <div className="rounded-xl bg-[color:var(--card-bg-soft-strong)] px-5 py-10 text-center">
                  <h3 className="text-xl [font-family:var(--font-display)] text-[color:var(--foreground)]">
                    {t('typing.report.cleanTitle')}
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    {t('typing.report.cleanBody')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {pendingParagraphReport.paragraph.mismatchSegments.map((segment) => (
                    <article
                      key={`${segment.start}-${segment.end}`}
                      className="rounded-xl border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-4"
                    >
                      <p className="text-xs font-medium text-[color:var(--accent)]">
                        {segment.start === segment.end
                          ? t('typing.report.mismatchRangeSingle', {
                              start: segment.start + 1,
                            })
                          : t('typing.report.mismatchRangeMulti', {
                              start: segment.start + 1,
                              end: segment.end + 1,
                            })}
                      </p>
                      <div className="mt-3 space-y-2">
                        <MismatchValue
                          label={t('typing.report.expectedLabel')}
                          value={segment.expected}
                        />
                        <MismatchValue
                          label={t('typing.report.actualLabel')}
                          value={segment.actual}
                          emptyLabel={t('typing.report.emptyActual')}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-[color:var(--line)] px-6 py-4">
              <button
                type="button"
                onClick={handleConfirmParagraphReport}
                className="inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                {pendingParagraphReport.isLastParagraph
                  ? t('typing.actions.finishSession')
                  : t('typing.actions.nextParagraph')}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isSettingsPanelOpen ? (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
          <button
            type="button"
            aria-label={t('typing.settings.close')}
            className="flex-1 cursor-default"
            onClick={() => setSettingsPanelOpen(false)}
          />
          <aside className="w-full max-w-sm overflow-y-auto border-l border-[color:var(--line)] bg-[color:var(--page-bg)] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--page-bg)] px-5 py-4">
              <h2 className="text-sm font-medium text-[color:var(--foreground)]">
                {t('typing.settings.title')}
              </h2>
              <button
                type="button"
                onClick={() => setSettingsPanelOpen(false)}
                className="rounded-lg p-1.5 text-[color:var(--muted)] transition hover:bg-[color:var(--card-bg-soft-strong)] hover:text-[color:var(--foreground)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-5 p-5">
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

              <SettingsSection
                title={t('typing.settings.sections.sound')}
                description={t('typing.settings.soundDescription')}
              >
                <SettingGroup label={t('typing.settings.soundProfileLabel')}>
                  <OptionChip
                    active={settingsSnapshot.soundProfile === 'off'}
                    onClick={() => void handleSettingsChange({ soundProfile: 'off' })}
                    label={t('typing.settings.soundProfileOff')}
                  />
                  <OptionChip
                    active={settingsSnapshot.soundProfile === 'soft'}
                    onClick={() => void handleSettingsChange({ soundProfile: 'soft' })}
                    label={t('typing.settings.soundProfileSoft')}
                  />
                  <OptionChip
                    active={settingsSnapshot.soundProfile === 'mechanical'}
                    onClick={() => void handleSettingsChange({ soundProfile: 'mechanical' })}
                    label={t('typing.settings.soundProfileMechanical')}
                  />
                  <OptionChip
                    active={settingsSnapshot.soundProfile === 'typewriter'}
                    onClick={() => void handleSettingsChange({ soundProfile: 'typewriter' })}
                    label={t('typing.settings.soundProfileTypewriter')}
                  />
                </SettingGroup>

                <FilterSlider
                  label={t('typing.settings.soundVolumeLabel')}
                  min={0}
                  max={100}
                  step={1}
                  value={settingsSnapshot.soundVolume}
                  suffix="%"
                  onChange={(value) =>
                    void handleSettingsChange({
                      soundVolume: value,
                    })
                  }
                />
              </SettingsSection>

              <SettingsSection
                title={t('typing.settings.sections.filters')}
                description={t('typing.settings.filtersDescription')}
              >
                <div className="space-y-4">
                  <FilterSlider
                    label={t('typing.settings.filtersBrightness')}
                    min={70}
                    max={130}
                    step={1}
                    value={settingsSnapshot.visualFilters.brightness}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          brightness: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersContrast')}
                    min={70}
                    max={130}
                    step={1}
                    value={settingsSnapshot.visualFilters.contrast}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          contrast: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersHue')}
                    min={-45}
                    max={45}
                    step={1}
                    value={settingsSnapshot.visualFilters.hue}
                    suffix="deg"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          hue: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersSaturate')}
                    min={70}
                    max={150}
                    step={1}
                    value={settingsSnapshot.visualFilters.saturate}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          saturate: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersSepia')}
                    min={0}
                    max={60}
                    step={1}
                    value={settingsSnapshot.visualFilters.sepia}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          sepia: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersGrayscale')}
                    min={0}
                    max={60}
                    step={1}
                    value={settingsSnapshot.visualFilters.grayscale}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          grayscale: value,
                        },
                      })
                    }
                  />
                  <FilterSlider
                    label={t('typing.settings.filtersInvert')}
                    min={0}
                    max={20}
                    step={1}
                    value={settingsSnapshot.visualFilters.invert}
                    suffix="%"
                    onChange={(value) =>
                      void handleSettingsChange({
                        visualFilters: {
                          invert: value,
                        },
                      })
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void handleSettingsChange({
                      visualFilters: DEFAULT_VISUAL_FILTERS,
                    })
                  }
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                >
                  {t('typing.settings.filtersReset')}
                </button>
              </SettingsSection>
            </div>

            <div className="rounded-lg bg-[color:var(--card-bg-soft-strong)] px-4 py-3 text-xs text-[color:var(--muted)]">
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
  return (
    <div
      className={`px-5 py-10 text-center text-sm ${
        tone === 'danger'
          ? 'bg-red-50 text-red-700'
          : 'text-[color:var(--muted)]'
      }`}
    >
      {children}
    </div>
  );
}

function StatusPanelCard({ children }: { children: ReactNode }) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[color:var(--card-bg-soft-strong)] px-3 py-3">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-lg font-medium tabular-nums text-[color:var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function InfoChip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-md bg-[color:var(--card-bg-soft-strong)] px-2 py-1 text-xs text-[color:var(--muted)]">
      {children}
    </span>
  );
}

function PrimaryActionButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-lg bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function SecondaryActionButton({
  asLink = false,
  children,
  href,
  onClick,
}: {
  asLink?: boolean;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    'inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--card-bg-soft-strong)] hover:text-[color:var(--foreground)]';

  if (asLink && href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
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
    <section className="rounded-xl border border-[color:var(--line)] bg-[color:var(--card-bg-soft)] p-4">
      <p className="text-xs font-medium text-[color:var(--foreground)]">
        {title}
      </p>
      <p className="mt-1 text-xs text-[color:var(--muted)]">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SettingGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
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
    <div className="flex items-start justify-between gap-3 rounded-lg bg-[color:var(--card-bg-soft-strong)] p-3">
      <div>
        <p className="text-sm font-medium text-[color:var(--foreground)]">{title}</p>
        <p className="mt-1 text-xs text-[color:var(--muted)]">{body}</p>
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
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-[color:var(--foreground)] text-white'
          : 'text-[color:var(--muted)] hover:bg-[color:var(--card-bg-soft-strong)] hover:text-[color:var(--foreground)]'
      }`}
    >
      {label}
    </button>
  );
}

function FilterSlider({
  label,
  min,
  max,
  step,
  value,
  suffix,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-lg bg-[color:var(--card-bg-soft-strong)] p-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-[color:var(--foreground)]">{label}</span>
        <span className="text-xs tabular-nums text-[color:var(--muted)]">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 block w-full accent-[color:var(--accent)]"
      />
    </label>
  );
}

function MismatchValue({
  label,
  value,
  emptyLabel,
}: {
  label: string;
  value: string;
  emptyLabel?: string;
}) {
  const visibleValue = value.length > 0 ? formatVisibleText(value) : emptyLabel ?? '';

  return (
    <div className="rounded-lg bg-[color:var(--card-bg-soft-strong)] p-3">
      <p className="text-xs text-[color:var(--muted)]">{label}</p>
      <pre className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-[color:var(--foreground)]">
        {visibleValue}
      </pre>
    </div>
  );
}
