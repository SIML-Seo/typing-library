import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildTypingResult,
  calculateOverallAccuracy,
  calculateOverallWpm,
  calculateTotalTypos,
  createTypingDraftId,
  formatElapsedTime,
} from './session';
import type { CompletedParagraphState } from './session';

const paragraphReports: CompletedParagraphState[] = [
  {
    paragraphIndex: 0,
    typoCount: 1,
    correctedTypoCount: 0,
    typedLength: 25,
    correctCharacterCount: 24,
    startedAt: '2026-03-06T10:00:00.000Z',
    endedAt: '2026-03-06T10:00:30.000Z',
    mismatchSegments: [],
  },
  {
    paragraphIndex: 1,
    typoCount: 2,
    correctedTypoCount: 1,
    typedLength: 25,
    correctCharacterCount: 23,
    startedAt: '2026-03-06T10:00:31.000Z',
    endedAt: '2026-03-06T10:01:00.000Z',
    mismatchSegments: [],
  },
];

describe('createTypingDraftId', () => {
  it('should create a stable draft id for public works', () => {
    assert.equal(
      createTypingDraftId('public', 'spring-spring-kim-yujeong'),
      'typing-draft:public:spring-spring-kim-yujeong',
    );
  });

  it('should create a stable draft id for personal works', () => {
    assert.equal(createTypingDraftId('my', 'my-work-1'), 'typing-draft:my:my-work-1');
  });
});

describe('session metrics', () => {
  it('should calculate overall accuracy with one decimal place', () => {
    assert.equal(calculateOverallAccuracy(paragraphReports), 94);
  });

  it('should calculate total typos across paragraphs', () => {
    assert.equal(calculateTotalTypos(paragraphReports), 3);
  });

  it('should calculate wpm from total typed characters and elapsed time', () => {
    assert.equal(calculateOverallWpm(paragraphReports, 60_000), 10);
  });
});

describe('buildTypingResult', () => {
  it('should build a persisted result record from session data', () => {
    const result = buildTypingResult({
      id: 'result-1',
      workKind: 'public',
      workId: 'spring-spring-kim-yujeong',
      endedAt: '2026-03-06T10:01:00.000Z',
      elapsedTimeMs: 60_000,
      settings: {
        punctuationAndCaseStrict: true,
        theme: 'paper',
        fontSize: 'md',
        typoDisplayMode: 'inline-red',
        visualFilters: {
          brightness: 100,
          contrast: 100,
          hue: 0,
          saturate: 100,
          sepia: 0,
          grayscale: 0,
          invert: 0,
        },
      },
      paragraphs: paragraphReports,
    });

    assert.equal(result.id, 'result-1');
    assert.deepStrictEqual(result.workRef, {
      kind: 'public',
      id: 'spring-spring-kim-yujeong',
    });
    assert.equal(result.startedAt, '2026-03-06T10:00:00.000Z');
    assert.equal(result.endedAt, '2026-03-06T10:01:00.000Z');
    assert.equal(result.elapsedTimeMs, 60_000);
    assert.equal(result.accuracy, 94);
    assert.equal(result.wpm, 10);
    assert.equal(result.paragraphReports?.length, 2);
  });
});

describe('formatElapsedTime', () => {
  it('should format minute-based durations as mm:ss', () => {
    assert.equal(formatElapsedTime(65_000), '01:05');
  });

  it('should format hour-based durations as hh:mm:ss', () => {
    assert.equal(formatElapsedTime(3_661_000), '01:01:01');
  });
});
