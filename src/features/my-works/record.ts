import type { MyWorkRecord } from '@/shared/db';

const UNTITLED_WORK_TITLE = '제목 없는 작품';

export function normalizeMyWorkContent(content: string) {
  return content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

export function inferTitleFromFilename(filename: string) {
  const trimmed = filename.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\.txt$/i, '').trim() || null;
}

export function inferTitleFromContent(content: string) {
  const normalized = normalizeMyWorkContent(content);
  const firstLine = normalized
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  return firstLine || null;
}

export function resolveMyWorkTitle(params: {
  title?: string;
  sourceFileName?: string;
  content: string;
}) {
  const explicitTitle = params.title?.trim();

  if (explicitTitle) {
    return explicitTitle;
  }

  const fileTitle = params.sourceFileName ? inferTitleFromFilename(params.sourceFileName) : null;

  if (fileTitle) {
    return fileTitle;
  }

  return inferTitleFromContent(params.content) ?? UNTITLED_WORK_TITLE;
}

export function createMyWorkRecord(params: {
  title?: string;
  author?: string;
  content: string;
  sourceFileName?: string;
  now?: string;
  id?: string;
}) {
  const normalizedContent = normalizeMyWorkContent(params.content);

  if (normalizedContent.trim().length === 0) {
    throw new Error('내 작품 본문이 비어 있습니다.');
  }

  const now = params.now ?? new Date().toISOString();

  return {
    id: params.id ?? crypto.randomUUID(),
    title: resolveMyWorkTitle({
      title: params.title,
      sourceFileName: params.sourceFileName,
      content: normalizedContent,
    }),
    author: params.author?.trim() || undefined,
    content: normalizedContent,
    createdAt: now,
    updatedAt: now,
  } satisfies MyWorkRecord;
}
