import type { WorkKind } from '@/shared/db';

export type Ga4EventName =
  | 'typing_start'
  | 'typing_paragraph_complete'
  | 'typing_complete'
  | 'my_work_upload';

export interface Ga4CommonContext {
  workKind: WorkKind;
  typingSessionId?: string;
  publicWorkId?: string;
  workLanguage?: string;
  punctuationCaseOn?: boolean;
}

function compactParams(params: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );
}

export function buildCommonAnalyticsParams(context: Ga4CommonContext) {
  return compactParams({
    work_kind: context.workKind,
    typing_session_id: context.typingSessionId,
    public_work_id: context.workKind === 'public' ? context.publicWorkId : undefined,
    work_language: context.workLanguage,
    punctuation_case_on:
      context.punctuationCaseOn === undefined
        ? undefined
        : context.punctuationCaseOn
          ? 'on'
          : 'off',
    app_version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}

export function buildParagraphCompleteEventParams(
  context: Ga4CommonContext,
  params: {
    paragraphIndex: number;
    mistakeCount: number;
    elapsedTimeMs: number;
  },
) {
  return {
    ...buildCommonAnalyticsParams(context),
    paragraph_index: params.paragraphIndex,
    mistake_count: params.mistakeCount,
    elapsed_time_ms: params.elapsedTimeMs,
  };
}

export function buildTypingCompleteEventParams(
  context: Ga4CommonContext,
  params: {
    elapsedTimeMs: number;
    wpm: number;
    accuracyPercent: number;
  },
) {
  return {
    ...buildCommonAnalyticsParams(context),
    elapsed_time_ms: params.elapsedTimeMs,
    wpm: params.wpm,
    accuracy_percent: params.accuracyPercent,
  };
}

export function buildMyWorkUploadEventParams(params: {
  textLength: number;
  uploadSource: 'file' | 'paste';
}) {
  return compactParams({
    work_kind: 'my',
    upload_source: params.uploadSource,
    text_length: params.textLength,
    app_version: process.env.NEXT_PUBLIC_APP_VERSION,
  });
}

function getMeasurementId() {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
}

export function isGa4Enabled() {
  return Boolean(getMeasurementId());
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGa4Event(
  eventName: Ga4EventName,
  params: Record<string, string | number | undefined>,
) {
  if (!isGa4Enabled() || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  window.gtag('event', eventName, params);
  return true;
}
