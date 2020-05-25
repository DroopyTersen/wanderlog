import { setupStores } from "./idbSetup";
let dbPromise;
function getDb() {
  if (!dbPromise) {
    dbPromise = openDb();
  }
  return dbPromise;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("wanderlog", 3);
    request.onupgradeneeded = (_) => {
      const db = request.result;
      setupStores(db);
    };
    request.onerror = (_) => reject(request.error);
    request.onsuccess = (_) => resolve(request.result);
  });
}

export function tx(stores, mode, callback): Promise<any> {
  return getDb().then((db: IDBDatabase) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(stores, mode);
      const request = callback(transaction);

      if (request instanceof IDBRequest) {
        request.onsuccess = (_) => resolve(request.result);
      } else if (request) {
        resolve(request);
      }

      transaction.onerror = (_) => reject(transaction.error);
      transaction.oncomplete = (event) => resolve((event as any).result);
    });
  });
}

export function saveMany(store: string, items: any[]) {
  return tx(store, "readwrite", (transaction) => {
    items.forEach((item) => {
      transaction.objectStore(store).put(item);
    });
  });
}

export function deleteAll(store: string) {
  return tx(store, "readwrite", (transaction: IDBTransaction) => {
    transaction.objectStore(store).clear();
  });
}

function iterate(cursorRequest, callback) {
  return new Promise((resolve, reject) => {
    cursorRequest.onerror = (_) => reject(cursorRequest.error);
    cursorRequest.onsuccess = (_) => {
      if (!cursorRequest.result) {
        resolve();
        return;
      }
      callback(cursorRequest.result, resolve);
    };
  });
}

export function getAll(cursorable) {
  if ("getAll" in cursorable) {
    return cursorable.getAll();
  }

  var items = [];

  return iterate(cursorable.openCursor(), (cursor) => {
    items.push(cursor.value);
    cursor.continue();
  }).then((_) => items);
}

export interface IDBStore<T> {
  save(item: T): Promise<any>;
  saveMany(item: T[]): Promise<any>;
  getById(id: string): Promise<T>;
  getAll(index?: string): Promise<T[]>;
  remove(id: string): Promise<void>;
}

export function createIdbStore<T>(collection: string): IDBStore<T> {
  return {
    save(item: T) {
      return tx(collection, "readwrite", (transaction) => {
        transaction.objectStore(collection).put(item);
      });
    },
    saveMany(items) {
      return saveMany(collection, items);
    },
    getById(id) {
      return tx(collection, "readonly", (transaction: IDBTransaction) => {
        return transaction.objectStore(collection).get(id);
      });
    },
    getAll(index = "by-date") {
      return tx(collection, "readonly", (transaction) => {
        let store = transaction.objectStore(collection).index(index);
        return getAll(store);
      });
    },
    remove(id) {
      return tx(collection, "readwrite", (transaction: IDBTransaction) => {
        transaction.objectStore(collection).delete(id);
      });
    },
  };
}
