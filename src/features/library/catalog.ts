import { getWorksBaseUrl } from '@/shared/lib/works-config';
import { previewWorksCatalog } from './mockWorks';
import type { WorkCatalogItem, WorksCatalogPayload } from './types';

function normalizeWork(raw: unknown): WorkCatalogItem | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const item = raw as Record<string, unknown>;
  if (typeof item.id !== 'string' || typeof item.title !== 'string') {
    return null;
  }

  const parts =
    Array.isArray(item.parts) &&
    item.parts
      .map((part) => {
        if (!part || typeof part !== 'object') {
          return null;
        }

        const candidate = part as Record<string, unknown>;
        if (typeof candidate.id !== 'string' || typeof candidate.path !== 'string') {
          return null;
        }

        return {
          id: candidate.id,
          path: candidate.path,
          title: typeof candidate.title === 'string' ? candidate.title : undefined,
        };
      })
      .filter((part): part is NonNullable<typeof part> => part !== null);

  return {
    id: item.id,
    title: item.title,
    author: typeof item.author === 'string' ? item.author : undefined,
    language: typeof item.language === 'string' ? item.language : undefined,
    source: typeof item.source === 'string' ? item.source : undefined,
    checksum: typeof item.checksum === 'string' ? item.checksum : undefined,
    copyrightProof:
      typeof item.copyrightProof === 'string'
        ? item.copyrightProof
        : '저작권 만료 근거는 works catalog에 추가해야 합니다.',
    textPath: typeof item.textPath === 'string' ? item.textPath : undefined,
    parts: parts && parts.length > 0 ? parts : undefined,
  };
}

function parseCatalog(input: unknown) {
  const rawItems = Array.isArray(input)
    ? input
    : input && typeof input === 'object' && Array.isArray((input as { works?: unknown[] }).works)
      ? (input as { works: unknown[] }).works
      : null;

  if (!rawItems) {
    throw new Error('works index 형식이 올바르지 않습니다.');
  }

  return rawItems
    .map(normalizeWork)
    .filter((item): item is WorkCatalogItem => item !== null);
}

export async function loadWorksCatalog(): Promise<WorksCatalogPayload> {
  const worksBaseUrl = getWorksBaseUrl();

  if (!worksBaseUrl) {
    return {
      items: previewWorksCatalog,
      sourceMode: 'preview',
      worksBaseUrl: null,
    };
  }

  const response = await fetch(`${worksBaseUrl}/works/index.json`, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`works index를 불러오지 못했습니다. (${response.status})`);
  }

  const payload = await response.json();

  return {
    items: parseCatalog(payload),
    sourceMode: 'works-origin',
    worksBaseUrl,
  };
}
