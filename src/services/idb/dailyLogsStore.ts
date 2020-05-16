import { DailyLogItem } from "../../models";
import { tx, getAll } from "./idb";

export const dailyLogStore = {
  save(item: DailyLogItem): Promise<any> {
    return tx("dailyLogs", "readwrite", (transaction) => {
      transaction.objectStore("dailyLogs").put(item);
    });
  },
  getById(id) {
    return tx("dailyLogs", "readonly", (transaction: IDBTransaction) => {
      return transaction.objectStore("dailyLogs").get(id);
    });
  },
  getAll(): Promise<DailyLogItem[]> {
    return tx("dailyLogs", "readonly", (transaction) => {
      return getAll(transaction.objectStore("dailyLogs").index("by-date"));
    });
  },
  // TODO: getByAuthor
  // TODO: getByDateRange <-- for selecting by trip
};
