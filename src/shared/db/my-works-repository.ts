import { STORE_NAMES } from './schema';
import { deleteRecord, getAllRecords, getRecord, putRecord } from './open-db';
import type { MyWorkRecord } from './types';

export async function listMyWorks() {
  const records = await getAllRecords<MyWorkRecord>(STORE_NAMES.myWorks);
  return records.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getMyWork(id: string) {
  return getRecord<MyWorkRecord>(STORE_NAMES.myWorks, id);
}

export async function saveMyWork(record: MyWorkRecord) {
  return putRecord(STORE_NAMES.myWorks, record);
}

export async function removeMyWork(id: string) {
  return deleteRecord(STORE_NAMES.myWorks, id);
}
