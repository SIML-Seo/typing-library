import type { TypingMismatchSegment } from '@/shared/db';
import { isCharacterMatch, type TypingJudgeOptions } from './text';

export function buildTypingMismatchSegments(
  reference: string,
  input: string,
  options: TypingJudgeOptions,
): TypingMismatchSegment[] {
  const segments: TypingMismatchSegment[] = [];
  const maxLength = Math.max(reference.length, input.length);
  let currentSegment: TypingMismatchSegment | null = null;

  for (let index = 0; index < maxLength; index += 1) {
    const expectedCharacter = reference[index];
    const actualCharacter = input[index];
    const isMatch = isCharacterMatch(expectedCharacter, actualCharacter, options);

    if (isMatch) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = null;
      }

      continue;
    }

    if (!currentSegment) {
      currentSegment = {
        start: index,
        end: index,
        expected: expectedCharacter ?? '',
        actual: actualCharacter ?? '',
      };
      continue;
    }

    currentSegment.end = index;
    currentSegment.expected += expectedCharacter ?? '';
    currentSegment.actual += actualCharacter ?? '';
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

export function formatVisibleText(value: string) {
  return value.replace(/ /g, '␠').replace(/\n/g, '↵').replace(/\t/g, '⇥');
}
