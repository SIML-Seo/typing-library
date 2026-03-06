import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildTypingMismatchSegments, formatVisibleText } from './paragraph-report';

describe('buildTypingMismatchSegments', () => {
  it('should group consecutive mismatches into one segment', () => {
    assert.deepStrictEqual(
      buildTypingMismatchSegments('abcdef', 'abXYef', {
        punctuationAndCaseStrict: true,
      }),
      [
        {
          start: 2,
          end: 3,
          expected: 'cd',
          actual: 'XY',
        },
      ],
    );
  });

  it('should split segments when mismatches are separated by a correct character', () => {
    assert.deepStrictEqual(
      buildTypingMismatchSegments('abcdef', 'abXdYf', {
        punctuationAndCaseStrict: true,
      }),
      [
        {
          start: 2,
          end: 2,
          expected: 'c',
          actual: 'X',
        },
        {
          start: 4,
          end: 4,
          expected: 'e',
          actual: 'Y',
        },
      ],
    );
  });

  it('should respect relaxed punctuation and case matching', () => {
    assert.deepStrictEqual(
      buildTypingMismatchSegments('Hello, World!', 'hello. world?', {
        punctuationAndCaseStrict: false,
      }),
      [],
    );
  });

  it('should keep whitespace strict even when punctuation and case are relaxed', () => {
    assert.deepStrictEqual(
      buildTypingMismatchSegments('A B', 'A\nB', {
        punctuationAndCaseStrict: false,
      }),
      [
        {
          start: 1,
          end: 1,
          expected: ' ',
          actual: '\n',
        },
      ],
    );
  });
});

describe('formatVisibleText', () => {
  it('should reveal whitespace markers', () => {
    assert.equal(formatVisibleText('a b\n\tc'), 'a␠b↵⇥c');
  });
});
