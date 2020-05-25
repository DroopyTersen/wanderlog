export function setupStores(db: IDBDatabase) {
  var outboxStore = db.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
  outboxStore.createIndex("by-date", "date");

  var dailyLogStore = db.createObjectStore("dailyLogs", { keyPath: "id" });
  dailyLogStore.createIndex("by-date", "date");
  dailyLogStore.createIndex("by-author", "authorId");

  var dailyLogStore = db.createObjectStore("trips", { keyPath: "id" });
  dailyLogStore.createIndex("by-date", "start");

  var photoStore = db.createObjectStore("photos", { keyPath: "id" });
  photoStore.createIndex("by-date", "date");

  db.createObjectStore("keyval");
}
