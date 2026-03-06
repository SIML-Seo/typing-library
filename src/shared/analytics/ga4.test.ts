import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildCommonAnalyticsParams,
  buildMyWorkUploadEventParams,
  buildParagraphCompleteEventParams,
  buildTypingCompleteEventParams,
} from './ga4';

describe('buildCommonAnalyticsParams', () => {
  it('should include public work metadata only for public works', () => {
    assert.deepStrictEqual(
      buildCommonAnalyticsParams({
        workKind: 'public',
        typingSessionId: 'session-1',
        publicWorkId: 'spring-spring-kim-yujeong',
        workLanguage: 'ko',
        punctuationCaseOn: true,
      }),
      {
        work_kind: 'public',
        typing_session_id: 'session-1',
        public_work_id: 'spring-spring-kim-yujeong',
        work_language: 'ko',
        punctuation_case_on: 'on',
      },
    );
  });

  it('should omit public work id for personal works', () => {
    assert.deepStrictEqual(
      buildCommonAnalyticsParams({
        workKind: 'my',
        typingSessionId: 'session-2',
        punctuationCaseOn: false,
      }),
      {
        work_kind: 'my',
        typing_session_id: 'session-2',
        punctuation_case_on: 'off',
      },
    );
  });
});

describe('buildParagraphCompleteEventParams', () => {
  it('should add paragraph-specific payload fields', () => {
    assert.deepStrictEqual(
      buildParagraphCompleteEventParams(
        {
          workKind: 'public',
          typingSessionId: 'session-1',
          publicWorkId: 'spring-spring-kim-yujeong',
        },
        {
          paragraphIndex: 3,
          mistakeCount: 2,
          elapsedTimeMs: 45_000,
        },
      ),
      {
        work_kind: 'public',
        typing_session_id: 'session-1',
        public_work_id: 'spring-spring-kim-yujeong',
        paragraph_index: 3,
        mistake_count: 2,
        elapsed_time_ms: 45_000,
      },
    );
  });
});

describe('buildTypingCompleteEventParams', () => {
  it('should add completion metrics', () => {
    assert.deepStrictEqual(
      buildTypingCompleteEventParams(
        {
          workKind: 'my',
          typingSessionId: 'session-2',
          punctuationCaseOn: true,
        },
        {
          elapsedTimeMs: 120_000,
          wpm: 18.4,
          accuracyPercent: 97.2,
        },
      ),
      {
        work_kind: 'my',
        typing_session_id: 'session-2',
        punctuation_case_on: 'on',
        elapsed_time_ms: 120_000,
        wpm: 18.4,
        accuracy_percent: 97.2,
      },
    );
  });
});

describe('buildMyWorkUploadEventParams', () => {
  it('should exclude file name and content while keeping source and text length', () => {
    assert.deepStrictEqual(
      buildMyWorkUploadEventParams({
        textLength: 1280,
        uploadSource: 'file',
      }),
      {
        work_kind: 'my',
        upload_source: 'file',
        text_length: 1280,
      },
    );
  });
});
