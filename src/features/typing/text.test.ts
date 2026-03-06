import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countCorrectCharacters, countTypos, splitParagraphs } from './text';

describe('splitParagraphs', () => {
  it('should normalize windows line breaks and split on blank lines', () => {
    const text = '첫 문단 첫 줄\r\n첫 문단 둘째 줄\r\n\r\n둘째 문단\n\n셋째 문단';

    assert.deepStrictEqual(splitParagraphs(text), [
      '첫 문단 첫 줄\n첫 문단 둘째 줄',
      '둘째 문단',
      '셋째 문단',
    ]);
  });

  it('should remove empty paragraphs after splitting', () => {
    const text = '\n\n첫 문단\n\n\n\n둘째 문단\n\n';

    assert.deepStrictEqual(splitParagraphs(text), ['첫 문단', '둘째 문단']);
  });
});

describe('countTypos', () => {
  it('should count only mismatched positions', () => {
    assert.equal(countTypos('abcd', 'abxd'), 1);
  });

  it('should count extra input beyond the reference length as typos', () => {
    assert.equal(countTypos('abc', 'axcd'), 2);
  });
});

describe('countCorrectCharacters', () => {
  it('should count only exact matches in the same position', () => {
    assert.equal(countCorrectCharacters('abcd', 'abxd'), 3);
  });

  it('should ignore extra mismatched characters', () => {
    assert.equal(countCorrectCharacters('abc', 'axcd'), 2);
  });
});
