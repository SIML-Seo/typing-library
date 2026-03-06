import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createMyWorkRecord,
  inferTitleFromContent,
  inferTitleFromFilename,
  normalizeMyWorkContent,
  resolveMyWorkTitle,
} from './record';

describe('normalizeMyWorkContent', () => {
  it('should remove bom and normalize line breaks', () => {
    assert.equal(normalizeMyWorkContent('\uFEFF첫 줄\r\n둘째 줄'), '첫 줄\n둘째 줄');
  });
});

describe('inferTitleFromFilename', () => {
  it('should strip the txt extension', () => {
    assert.equal(inferTitleFromFilename('봄봄.txt'), '봄봄');
  });

  it('should return null for an empty filename', () => {
    assert.equal(inferTitleFromFilename('   '), null);
  });
});

describe('inferTitleFromContent', () => {
  it('should use the first non-empty line', () => {
    assert.equal(inferTitleFromContent('\n\n제목 줄\n본문'), '제목 줄');
  });
});

describe('resolveMyWorkTitle', () => {
  it('should prefer explicit title over file name and content', () => {
    assert.equal(
      resolveMyWorkTitle({
        title: '직접 입력한 제목',
        sourceFileName: '파일제목.txt',
        content: '본문 첫 줄',
      }),
      '직접 입력한 제목',
    );
  });

  it('should fall back to file name when title is empty', () => {
    assert.equal(
      resolveMyWorkTitle({
        title: '  ',
        sourceFileName: '파일제목.txt',
        content: '본문 첫 줄',
      }),
      '파일제목',
    );
  });
});

describe('createMyWorkRecord', () => {
  it('should create a normalized record', () => {
    const record = createMyWorkRecord({
      id: 'my-work-1',
      title: '',
      author: '  작성자  ',
      sourceFileName: '샘플.txt',
      content: '\uFEFF첫 줄\r\n둘째 줄',
      now: '2026-03-06T12:00:00.000Z',
    });

    assert.deepStrictEqual(record, {
      id: 'my-work-1',
      title: '샘플',
      author: '작성자',
      content: '첫 줄\n둘째 줄',
      createdAt: '2026-03-06T12:00:00.000Z',
      updatedAt: '2026-03-06T12:00:00.000Z',
    });
  });

  it('should throw when content is empty after normalization', () => {
    assert.throws(
      () =>
        createMyWorkRecord({
          content: '\n\n',
        }),
      /비어 있습니다/,
    );
  });
});
