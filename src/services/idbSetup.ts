export function setupStores(db: IDBDatabase) {
  try {
    var outboxStore = db.createObjectStore("outbox", { keyPath: "id", autoIncrement: true });
    outboxStore.createIndex("by-date", "date");
  } catch (err) {}

  try {
    var dailyLogStore = db.createObjectStore("dailyLogs", { keyPath: "id" });
    dailyLogStore.createIndex("by-date", "date");
    dailyLogStore.createIndex("by-author", "authorId");
  } catch (err) {}

  try {
    var dailyLogStore = db.createObjectStore("trips", { keyPath: "id" });
    dailyLogStore.createIndex("by-date", "start");
  } catch (err) {}

  try {
    console.log("SETUP STORE: photos store");
    var photoStore = db.createObjectStore("photos", { keyPath: "id" });
    photoStore.createIndex("by-date", "date");
  } catch (err) {}
}
