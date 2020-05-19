import { DailyLogItem, OutboxItem } from "../../models";

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDb();
  }
  return dbPromise;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("wanderlog", 1);
    request.onupgradeneeded = (_) => {
      const db = request.result;
      setupStores(db);
    };
    request.onerror = (_) => reject(request.error);
    request.onsuccess = (_) => resolve(request.result);
  });
}

export function tx(stores, mode, callback) {
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

function setupStores(db: IDBDatabase) {
  var outboxStore = db.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
  outboxStore.createIndex("by-date", "date");

  var dailyLogStore = db.createObjectStore("dailyLogs", { keyPath: "id" });
  dailyLogStore.createIndex("by-date", "date");
  dailyLogStore.createIndex("by-author", "authorId");

  var dailyLogStore = db.createObjectStore("trips", { keyPath: "id" });
  dailyLogStore.createIndex("by-date", "start");

  db.createObjectStore("keyval");
}
