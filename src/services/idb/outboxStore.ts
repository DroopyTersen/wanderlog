import { OutboxItem } from "../../models";
import { tx, getAll } from "./idb";

export const outboxStore = {
  add(item: OutboxItem) {
    item.date = new Date();
    return tx("outbox", "readwrite", (transaction) => {
      transaction.objectStore("outbox").add(item);
    });
  },
  remove(id) {
    return tx("outbox", "readwrite", (transaction) => {
      transaction.objectStore("outbox").delete(id);
    });
  },
  getNextItem(id) {
    return tx("outbox", "readonly", (transaction) => {
      return transaction
        .objectStore("outbox")
        .index("by-date")
        .get(IDBKeyRange.lowerBound(new Date(0)));
    });
  },
  getAll() {
    return tx("outbox", "readonly", (transaction) => {
      return getAll(transaction.objectStore("outbox").index("by-date"));
    });
  },
};
