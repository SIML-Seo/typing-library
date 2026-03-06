import type { VisualFilterSettings } from '@/shared/db';

export function buildVisualFilterValue(filters: VisualFilterSettings) {
  const parts: string[] = [];

  if (filters.brightness !== 100) {
    parts.push(`brightness(${filters.brightness}%)`);
  }

  if (filters.contrast !== 100) {
    parts.push(`contrast(${filters.contrast}%)`);
  }

  if (filters.hue !== 0) {
    parts.push(`hue-rotate(${filters.hue}deg)`);
  }

  if (filters.saturate !== 100) {
    parts.push(`saturate(${filters.saturate}%)`);
  }

  if (filters.sepia !== 0) {
    parts.push(`sepia(${filters.sepia}%)`);
  }

  if (filters.grayscale !== 0) {
    parts.push(`grayscale(${filters.grayscale}%)`);
  }

  if (filters.invert !== 0) {
    parts.push(`invert(${filters.invert}%)`);
  }

  return parts.join(' ');
}

export function hasActiveVisualFilter(filters: VisualFilterSettings) {
  return buildVisualFilterValue(filters).length > 0;
}
