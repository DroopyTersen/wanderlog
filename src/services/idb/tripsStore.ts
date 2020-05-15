import { TripItem } from "../../models";
import { tx, getAll } from "./idb";

export const tripsStore = {
  save(item: TripItem) {
    return tx("trips", "readwrite", (transaction) => {
      transaction.objectStore("trips").put(item);
    });
  },
  getById(id) {
    return tx("trips", "readonly", (transaction: IDBTransaction) => {
      return transaction.objectStore("trips").get(id);
    });
  },
  getAll() {
    return tx("trips", "readonly", (transaction) => {
      return getAll(transaction.objectStore("dailyLogs").index("by-date"));
    });
  },
};
