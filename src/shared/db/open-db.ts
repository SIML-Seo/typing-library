import { APP_DB_NAME, APP_DB_VERSION, STORE_NAMES, type StoreName } from './schema';

let dbPromise: Promise<IDBDatabase> | null = null;

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB 요청에 실패했습니다.'));
  });
}

function transactionToPromise(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () =>
      reject(transaction.error ?? new Error('IndexedDB 트랜잭션이 중단되었습니다.'));
    transaction.onerror = () =>
      reject(transaction.error ?? new Error('IndexedDB 트랜잭션이 실패했습니다.'));
  });
}

function ensureStore(database: IDBDatabase, storeName: StoreName) {
  if (database.objectStoreNames.contains(storeName)) {
    return;
  }

  const store = database.createObjectStore(storeName, { keyPath: 'id' });
  if (!store.indexNames.contains('updatedAt')) {
    store.createIndex('updatedAt', 'updatedAt', { unique: false });
  }
}

export function openAppDb() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저 환경에서만 IndexedDB를 열 수 있습니다.'));
  }

  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('이 브라우저는 IndexedDB를 지원하지 않습니다.'));
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(APP_DB_NAME, APP_DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      ensureStore(database, STORE_NAMES.myWorks);
      ensureStore(database, STORE_NAMES.typingResults);
      ensureStore(database, STORE_NAMES.typingDrafts);
      ensureStore(database, STORE_NAMES.appSettings);
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        dbPromise = null;
      };
      resolve(database);
    };

    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB를 열지 못했습니다.'));
    };
  });

  return dbPromise;
}

export async function runWithStore<Result>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore) => Promise<Result>,
) {
  const database = await openAppDb();
  const transaction = database.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);

  const result = await handler(store);
  await transactionToPromise(transaction);

  return result;
}

export async function getRecord<RecordType>(storeName: StoreName, id: string) {
  return runWithStore(storeName, 'readonly', async (store) => {
    const request = store.get(id);
    return requestToPromise<RecordType | undefined>(request);
  });
}

export async function getAllRecords<RecordType>(storeName: StoreName) {
  return runWithStore(storeName, 'readonly', async (store) => {
    const request = store.getAll();
    return requestToPromise<RecordType[]>(request);
  });
}

export async function putRecord<RecordType>(storeName: StoreName, value: RecordType) {
  return runWithStore(storeName, 'readwrite', async (store) => {
    const request = store.put(value);
    await requestToPromise(request);
    return value;
  });
}

export async function deleteRecord(storeName: StoreName, id: string) {
  return runWithStore(storeName, 'readwrite', async (store) => {
    const request = store.delete(id);
    await requestToPromise(request);
  });
}
