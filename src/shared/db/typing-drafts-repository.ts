import { STORE_NAMES } from './schema';
import { deleteRecord, getAllRecords, getRecord, putRecord } from './open-db';
import type { TypingDraftRecord } from './types';

export async function listTypingDrafts() {
  const records = await getAllRecords<TypingDraftRecord>(STORE_NAMES.typingDrafts);
  return records.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getTypingDraft(id: string) {
  return getRecord<TypingDraftRecord>(STORE_NAMES.typingDrafts, id);
}

export async function saveTypingDraft(record: TypingDraftRecord) {
  return putRecord(STORE_NAMES.typingDrafts, record);
}

export async function removeTypingDraft(id: string) {
  return deleteRecord(STORE_NAMES.typingDrafts, id);
}
