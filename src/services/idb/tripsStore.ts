import { TripItem } from "../../models";
import { tx, getAll, saveMany } from "./idb";

export const tripsStore = {
  save(item: TripItem) {
    return tx("trips", "readwrite", (transaction) => {
      transaction.objectStore("trips").put(item);
    });
  },
  saveMany(items) {
    saveMany("trips", items);
  },
  getById(id) {
    return tx("trips", "readonly", (transaction: IDBTransaction) => {
      return transaction.objectStore("trips").get(id);
    });
  },
  getAll() {
    return tx("trips", "readonly", (transaction) => {
      return getAll(transaction.objectStore("trips").index("by-date"));
    });
  },
};
