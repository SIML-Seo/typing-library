import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MyWorkRecord, TypingResultRecord } from '@/shared/db';
import type { WorkCatalogItem } from '@/features/library/types';
import { buildResultEntries, summarizeResults } from './history';

const publicWorks: WorkCatalogItem[] = [
  {
    id: 'spring-spring-kim-yujeong',
    title: '봄봄',
    author: '김유정',
    language: 'ko',
    copyrightProof: 'public domain',
  },
  {
    id: 'pride-and-prejudice-austen',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    language: 'en',
    copyrightProof: 'public domain',
  },
];

const myWorks: MyWorkRecord[] = [
  {
    id: 'my-work-1',
    title: '내 연습 원고',
    author: '사용자',
    content: 'test',
    createdAt: '2026-03-06T00:00:00.000Z',
    updatedAt: '2026-03-06T00:00:00.000Z',
  },
];

const results: TypingResultRecord[] = [
  {
    id: 'result-1',
    workRef: { kind: 'public', id: 'spring-spring-kim-yujeong' },
    startedAt: '2026-03-06T09:59:00.000Z',
    endedAt: '2026-03-06T10:00:00.000Z',
    elapsedTimeMs: 60_000,
    wpm: 12,
    accuracy: 96.2,
    settingsSnapshot: {
      punctuationAndCaseStrict: true,
      theme: 'paper',
      fontSize: 'md',
      typoDisplayMode: 'inline-red',
      soundProfile: 'soft',
      soundVolume: 60,
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
    paragraphReports: [
      {
        paragraphIndex: 0,
        typoCount: 2,
        correctedTypoCount: 1,
        startedAt: '2026-03-06T09:59:00.000Z',
        endedAt: '2026-03-06T10:00:00.000Z',
      },
    ],
  },
  {
    id: 'result-2',
    workRef: { kind: 'my', id: 'my-work-1' },
    startedAt: '2026-03-06T10:59:00.000Z',
    endedAt: '2026-03-06T11:00:00.000Z',
    elapsedTimeMs: 60_000,
    wpm: 15,
    accuracy: 98.4,
    settingsSnapshot: {
      punctuationAndCaseStrict: true,
      theme: 'paper',
      fontSize: 'md',
      typoDisplayMode: 'inline-red',
      soundProfile: 'soft',
      soundVolume: 60,
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
    paragraphReports: [
      {
        paragraphIndex: 0,
        typoCount: 1,
        correctedTypoCount: 0,
        startedAt: '2026-03-06T10:59:00.000Z',
        endedAt: '2026-03-06T11:00:00.000Z',
      },
    ],
  },
];

describe('buildResultEntries', () => {
  it('should sort results by endedAt descending and resolve work metadata', () => {
    const entries = buildResultEntries({
      results,
      publicWorks,
      myWorks,
    });

    assert.equal(entries[0].id, 'result-2');
    assert.equal(entries[0].title, '내 연습 원고');
    assert.equal(entries[1].title, '봄봄');
    assert.equal(entries[1].typoCount, 2);
  });

  it('should filter by kind', () => {
    const entries = buildResultEntries({
      results,
      publicWorks,
      myWorks,
      kindFilter: 'public',
    });

    assert.deepStrictEqual(entries.map((entry) => entry.id), ['result-1']);
  });

  it('should filter by search query against title and author', () => {
    const entries = buildResultEntries({
      results,
      publicWorks,
      myWorks,
      query: 'jane',
      unknownPublicWorkTitle: '알 수 없는 공개 작품',
      unknownMyWorkTitle: '알 수 없는 내 작품',
    });

    assert.deepStrictEqual(entries.map((entry) => entry.id), []);

    const titleMatchEntries = buildResultEntries({
      results,
      publicWorks,
      myWorks,
      query: '연습',
    });

    assert.deepStrictEqual(titleMatchEntries.map((entry) => entry.id), ['result-2']);
  });
});

describe('summarizeResults', () => {
  it('should calculate total sessions, average accuracy, and average wpm', () => {
    const entries = buildResultEntries({
      results,
      publicWorks,
      myWorks,
    });

    assert.deepStrictEqual(summarizeResults(entries), {
      totalSessions: 2,
      averageAccuracy: 97.3,
      averageWpm: 13.5,
      latestEndedAt: '2026-03-06T11:00:00.000Z',
    });
  });

  it('should return null averages for an empty result set', () => {
    assert.deepStrictEqual(summarizeResults([]), {
      totalSessions: 0,
      averageAccuracy: null,
      averageWpm: null,
      latestEndedAt: null,
    });
  });
});
