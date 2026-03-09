import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildTypingPath, parseTypingSearchParams } from './route';

describe('buildTypingPath', () => {
  it('should build a default-locale public typing path', () => {
    assert.equal(
      buildTypingPath('ko', {
        workId: 'spring-spring-kim-yujeong',
      }),
      '/typing?workId=spring-spring-kim-yujeong',
    );
  });

  it('should build a localized personal typing path', () => {
    assert.equal(
      buildTypingPath('en', {
        workId: 'my-work-1',
        workKind: 'my',
      }),
      '/en/typing?workId=my-work-1&kind=my',
    );
  });
});

describe('parseTypingSearchParams', () => {
  it('should parse work id and public kind by default', () => {
    const params = new URLSearchParams('workId=spring-spring-kim-yujeong');

    assert.deepStrictEqual(parseTypingSearchParams(params), {
      workId: 'spring-spring-kim-yujeong',
      workKind: 'public',
    });
  });

  it('should parse personal kind when kind=my is present', () => {
    const params = new URLSearchParams('workId=my-work-1&kind=my');

    assert.deepStrictEqual(parseTypingSearchParams(params), {
      workId: 'my-work-1',
      workKind: 'my',
    });
  });
});
