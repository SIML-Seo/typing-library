import { STORE_NAMES } from './schema';
import { deleteRecord, getAllRecords, getRecord, putRecord } from './open-db';
import type { TypingResultRecord } from './types';

export async function listTypingResults() {
  const records = await getAllRecords<TypingResultRecord>(STORE_NAMES.typingResults);
  return records.sort((left, right) => right.endedAt.localeCompare(left.endedAt));
}

export async function getTypingResult(id: string) {
  return getRecord<TypingResultRecord>(STORE_NAMES.typingResults, id);
}

export async function saveTypingResult(record: TypingResultRecord) {
  return putRecord(STORE_NAMES.typingResults, record);
}

export async function removeTypingResult(id: string) {
  return deleteRecord(STORE_NAMES.typingResults, id);
}
