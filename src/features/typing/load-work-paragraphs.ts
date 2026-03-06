import type { WorkCatalogItem } from '@/features/library/types';
import { previewParagraphsByWorkId } from './mockParagraphs';
import { splitParagraphs } from './text';

export async function loadWorkParagraphs(
  work: WorkCatalogItem,
  sourceMode: 'preview' | 'works-origin',
  worksBaseUrl: string | null,
) {
  if (sourceMode === 'preview') {
    const previewParagraphs = previewParagraphsByWorkId[work.id];

    if (!previewParagraphs) {
      throw new Error(`Preview text is missing for work: ${work.id}`);
    }

    return previewParagraphs;
  }

  if (!worksBaseUrl) {
    throw new Error('Works origin is not configured.');
  }

  const textPath = work.textPath ?? work.parts?.[0]?.path;

  if (!textPath) {
    throw new Error(`Text path is missing for work: ${work.id}`);
  }

  const response = await fetch(`${worksBaseUrl}${textPath}`);

  if (!response.ok) {
    throw new Error(`Failed to load work text: ${response.status}`);
  }

  const paragraphs = splitParagraphs(await response.text());

  if (paragraphs.length === 0) {
    throw new Error(`Work text is empty: ${work.id}`);
  }

  return paragraphs;
}
